# Auto SOW Builder — Feature Specification

**Date:** 2026-02-11
**Branch:** `feature/sales-diagnostic-sow-flow`
**Status:** Draft

---

## 1. Feature Overview

The Auto SOW Builder transforms the current manual 8–12 minute SOW creation process into a 2-minute review-and-adjust workflow. When a user clicks "Build SOW" from diagnostic results, the system will:

1. Filter diagnostic items to those needing attention (`warning`/`unable` status OR `addToEngagement === true`)
2. Group them by GTM function (Cross Functional, Marketing, Sales, Customer Success, Partnerships)
3. Look up each item's `serviceId` in the `service_catalog` database table to get hours, rate, and deliverables
4. Auto-generate SOW sections with pre-populated titles, descriptions, hours, rates, deliverables, and diagnostic item links
5. Generate a template-based executive summary from diagnostic statistics
6. Suggest a timeline based on section count and hours
7. Present everything in the existing `SowBuilder` UI for editing

**Goal:** Reduce SOW creation from a blank canvas to a pre-filled, editable draft.

---

## 2. Data Flow

```
┌─────────────────────┐
│  diagnostic_results │  processes[] with status, serviceId, function, outcome
│  (Supabase)         │
└─────────┬───────────┘
          │ filter: warning/unable OR addToEngagement
          ▼
┌─────────────────────┐
│  Priority Items     │  Items that need SOW sections
└─────────┬───────────┘
          │ group by: process.function
          ▼
┌─────────────────────┐
│  Grouped Sections   │  { "Sales": [item1, item2], "Marketing": [item3, ...] }
└─────────┬───────────┘
          │ for each item: lookup serviceId in service_catalog
          ▼
┌─────────────────────┐
│  service_catalog    │  hours_low, hours_high, default_rate, description, key_steps
│  (Supabase)         │
└─────────┬───────────┘
          │ merge catalog data into section defaults
          ▼
┌─────────────────────┐
│  Auto-Generated     │  title, description, hours, rate, deliverables,
│  SOW Sections       │  diagnostic_items[], start_date, end_date
└─────────┬───────────┘
          │ bulkCreateSections()
          ▼
┌─────────────────────┐
│  sow_sections       │  Persisted, editable in SowBuilder
│  (Supabase)         │
└─────────────────────┘
```

### Key Data Shapes

**Diagnostic process item** (from `diagnostic_results.processes[]`):
```js
{
  name: "Lead Routing",
  status: "warning",           // healthy | careful | warning | unable
  addToEngagement: true,
  function: "Sales",           // GTM function
  outcome: "Improve Sales Efficiency",
  metric: "Opportunity/Deal - CW cycle time",
  serviceId: "lead-routing",   // links to service_catalog.slug
  serviceType: "strategic"     // strategic | managed
}
```

**Service catalog row** (from `service_catalog` table):
```js
{
  id: "uuid",
  slug: "lead-routing",       // matches process.serviceId
  name: "Lead Routing",
  category: "Marketing",
  description: "Automated lead assignment rules...",
  hours_low: 30,
  hours_high: 50,
  default_rate: 200,
  key_steps: ["Define routing rules", "Configure automation", ...],
  primary_function: "Marketing",
  project_type: "strategic",
  active: true
}
```

---

## 3. Algorithm

### 3.1 Item Selection

Include a diagnostic process item in the SOW if **any** of these are true:
- `status === 'warning'`
- `status === 'unable'`
- `addToEngagement === true`

```js
function selectPriorityItems(processes) {
  return processes.filter(p =>
    p.status === 'warning' ||
    p.status === 'unable' ||
    p.addToEngagement === true
  );
}
```

### 3.2 Grouping Strategy

Group selected items by `function` to create one SOW section per function that has items. Within each group, sort by severity: `unable` first, then `warning`, then `careful`.

```js
function groupByFunction(items) {
  const STATUS_PRIORITY = { unable: 0, warning: 1, careful: 2, healthy: 3 };

  const groups = {};
  items.forEach(item => {
    const fn = item.function || 'Other';
    if (!groups[fn]) groups[fn] = [];
    groups[fn].push(item);
  });

  // Sort items within each group by severity
  Object.values(groups).forEach(group => {
    group.sort((a, b) => (STATUS_PRIORITY[a.status] ?? 9) - (STATUS_PRIORITY[b.status] ?? 9));
  });

  return groups;
}
```

**Alternative grouping: by outcome.** Offer a `groupBy` parameter (`function` or `outcome`) so the sales rep can choose. Default is `function`.

```js
function groupItems(items, groupBy = 'function') {
  const groups = {};
  items.forEach(item => {
    const key = item[groupBy] || 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}
```

### 3.3 Service Catalog Lookup

For each item, look up the matching `service_catalog` entry by `serviceId`. The `serviceId` on diagnostic items matches the `slug` field in `service_catalog` (or may match by `name` normalization as a fallback).

```js
async function lookupCatalogEntries(items) {
  // Batch fetch all relevant catalog entries
  const serviceIds = [...new Set(items.map(i => i.serviceId).filter(Boolean))];

  if (serviceIds.length === 0) return {};

  const { data } = await supabaseAdmin
    .from('service_catalog')
    .select('*')
    .in('slug', serviceIds)
    .eq('active', true);

  // Build lookup map: slug → catalog entry
  const catalog = {};
  (data || []).forEach(entry => {
    catalog[entry.slug] = entry;
  });

  return catalog;
}
```

### 3.4 Section Generation

For each function group, create a SOW section:

```js
function generateSections(groupedItems, catalogMap, options = {}) {
  const { defaultRate = 200, sowStartDate = null } = options;
  const sections = [];
  let sortOrder = 0;
  let cumulativeWeeks = 0;

  // Order functions: Cross Functional first (foundational), then alphabetical
  const FUNCTION_ORDER = [
    'Cross Functional',
    'Marketing',
    'Sales',
    'Customer Success',
    'Partnerships',
  ];

  const orderedFunctions = FUNCTION_ORDER.filter(fn => groupedItems[fn]);

  for (const fn of orderedFunctions) {
    const items = groupedItems[fn];

    // Aggregate hours and rate from catalog entries
    let totalHoursLow = 0;
    let totalHoursHigh = 0;
    let rateSum = 0;
    let rateCount = 0;
    const allDeliverables = [];
    const descriptions = [];

    items.forEach(item => {
      const catalog = catalogMap[item.serviceId];
      if (catalog) {
        totalHoursLow += catalog.hours_low || 0;
        totalHoursHigh += catalog.hours_high || 0;
        if (catalog.default_rate) {
          rateSum += parseFloat(catalog.default_rate);
          rateCount++;
        }
        if (catalog.key_steps) {
          allDeliverables.push(...catalog.key_steps);
        }
        if (catalog.description) {
          descriptions.push(`**${catalog.name}:** ${catalog.description}`);
        }
      }
    });

    // Use average of low/high for section hours
    const hours = totalHoursLow && totalHoursHigh
      ? Math.round((totalHoursLow + totalHoursHigh) / 2)
      : totalHoursLow || totalHoursHigh || null;

    // Use average rate from catalog entries, fallback to default
    const rate = rateCount > 0
      ? Math.round(rateSum / rateCount)
      : defaultRate;

    // Calculate timeline
    const estimatedWeeks = hours ? Math.max(2, Math.ceil(hours / 40)) : 4;
    const startDate = sowStartDate
      ? addWeeks(new Date(sowStartDate), cumulativeWeeks)
      : null;
    const endDate = startDate
      ? addWeeks(startDate, estimatedWeeks)
      : null;
    cumulativeWeeks += estimatedWeeks;

    sections.push({
      title: `${fn} — GTM Operations`,
      description: descriptions.join('\n\n') || `Strategic projects addressing ${fn.toLowerCase()} diagnostic findings.`,
      hours,
      rate,
      deliverables: deduplicateDeliverables(allDeliverables),
      diagnosticItems: items.map(i => i.name),
      sortOrder: sortOrder++,
      startDate: startDate ? startDate.toISOString().split('T')[0] : null,
      endDate: endDate ? endDate.toISOString().split('T')[0] : null,
    });
  }

  return sections;
}

function deduplicateDeliverables(deliverables) {
  const seen = new Set();
  return deliverables.filter(d => {
    const key = (typeof d === 'string' ? d : d.name || '').toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function addWeeks(date, weeks) {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}
```

### 3.5 Individual Item Sections (Alternative Strategy)

For higher-fidelity SOWs, each diagnostic item can become its own section instead of grouping by function. Use when the item count is ≤ 8:

```js
function shouldUseItemSections(items) {
  return items.length <= 8;
}

function generateItemSections(items, catalogMap, options = {}) {
  return items.map((item, idx) => {
    const catalog = catalogMap[item.serviceId];
    const hours = catalog
      ? Math.round((catalog.hours_low + catalog.hours_high) / 2)
      : null;

    return {
      title: item.name,
      description: catalog?.description || '',
      hours,
      rate: catalog?.default_rate ? parseFloat(catalog.default_rate) : options.defaultRate || 200,
      deliverables: catalog?.key_steps || [],
      diagnosticItems: [item.name],
      sortOrder: idx,
      serviceCatalogId: catalog?.id || null,
    };
  });
}
```

**Decision logic:**

| Priority items count | Strategy |
|---------------------|----------|
| 1–8 | One section per item |
| 9+ | Group by function |

---

## 4. API Design

### 4.1 Enhanced `POST /api/sow/from-diagnostic`

Modify the existing endpoint to accept an `autoGenerate` flag. When `true`, the endpoint creates sections automatically.

**Request body:**
```json
{
  "customerId": "uuid",
  "diagnosticResultId": "uuid",
  "diagnosticType": "gtm",
  "customerName": "Acme Corp",
  "sowType": "custom",
  "createdBy": "jake@leanscale.team",
  "autoGenerate": true,
  "groupBy": "function",
  "defaultRate": 200,
  "startDate": "2026-03-01"
}
```

**New fields:**
- `autoGenerate` (boolean, default `true`) — if `true`, auto-create sections
- `groupBy` (`"function"` | `"outcome"`, default `"function"`) — grouping strategy
- `defaultRate` (number, default `200`) — fallback rate when catalog has none
- `startDate` (string, optional) — SOW start date for timeline calculation

**Updated handler:**

```js
// pages/api/sow/from-diagnostic.js (enhanced)

import { createSow, updateSow } from '../../../lib/sow';
import { getDiagnosticResult } from '../../../lib/diagnostics';
import { bulkCreateSections } from '../../../lib/sow-sections';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const {
      customerId,
      diagnosticResultId,
      diagnosticType = 'gtm',
      customerName,
      sowType = 'custom',
      createdBy,
      autoGenerate = true,
      groupBy = 'function',
      defaultRate = 200,
      startDate,
    } = req.body;

    // ... existing validation ...

    const diagnosticResult = await getDiagnosticResult(customerId, diagnosticType);
    if (!diagnosticResult) {
      return res.status(404).json({ success: false, error: 'Diagnostic result not found' });
    }

    const processes = diagnosticResult.processes || [];

    // Compute overall rating (existing logic)
    const statusCounts = { warning: 0, unable: 0, careful: 0, healthy: 0 };
    processes.forEach(p => { if (statusCounts[p.status] !== undefined) statusCounts[p.status]++; });
    const criticalPct = (statusCounts.warning + statusCounts.unable) / (processes.length || 1);
    let overallRating = 'healthy';
    if (criticalPct > 0.5) overallRating = 'critical';
    else if (criticalPct > 0.3) overallRating = 'warning';
    else if (criticalPct > 0.1) overallRating = 'moderate';

    // Generate executive summary
    const executiveSummary = autoGenerate
      ? generateExecutiveSummary(processes, customerName, diagnosticType, statusCounts)
      : '';

    const title = customerName ? `${customerName} Statement of Work` : 'Statement of Work';

    // Create SOW
    const sow = await createSow({
      customerId,
      title,
      sowType,
      content: {
        executive_summary: executiveSummary,
        client_info: customerName ? { company: customerName } : {},
        assumptions: [
          'Client will provide timely access to required systems and stakeholders.',
          'Scope changes will be managed through a change request process.',
          'All work will be performed remotely unless otherwise agreed.',
        ],
        acceptance_criteria: [
          'Deliverables reviewed and approved by client stakeholder.',
          'Knowledge transfer session completed for each section.',
        ],
      },
      createdBy,
    });

    if (!sow) {
      return res.status(500).json({ success: false, error: 'Failed to create SOW' });
    }

    // Update with diagnostic links
    await updateSow(sow.id, {
      diagnostic_result_ids: [diagnosticResultId],
      overall_rating: overallRating,
      diagnostic_snapshot: {
        processes: processes.map(p => ({
          name: p.name,
          status: p.status,
          addToEngagement: p.addToEngagement,
          function: p.function,
          outcome: p.outcome,
          serviceId: p.serviceId,
          serviceType: p.serviceType,
        })),
        snapshotAt: new Date().toISOString(),
      },
    });

    // Auto-generate sections
    let generatedSections = [];
    if (autoGenerate) {
      const priorityItems = selectPriorityItems(processes);

      if (priorityItems.length > 0) {
        const catalogMap = await lookupCatalogEntries(priorityItems);
        const grouped = groupItems(priorityItems, groupBy);

        const useItemSections = priorityItems.length <= 8;
        const sectionDefs = useItemSections
          ? generateItemSections(priorityItems, catalogMap, { defaultRate })
          : generateSections(grouped, catalogMap, { defaultRate, sowStartDate: startDate });

        generatedSections = await bulkCreateSections(sow.id, sectionDefs);

        // Update SOW totals
        let totalHours = 0, totalInvestment = 0;
        let minDate = null, maxDate = null;
        generatedSections.forEach(s => {
          const h = parseFloat(s.hours) || 0;
          const r = parseFloat(s.rate) || 0;
          totalHours += h;
          totalInvestment += h * r;
          if (s.start_date && (!minDate || s.start_date < minDate)) minDate = s.start_date;
          if (s.end_date && (!maxDate || s.end_date > maxDate)) maxDate = s.end_date;
        });

        await updateSow(sow.id, {
          total_hours: totalHours,
          total_investment: totalInvestment,
          start_date: minDate,
          end_date: maxDate,
        });
      }
    }

    return res.status(201).json({
      success: true,
      data: {
        ...sow,
        diagnostic_result_ids: [diagnosticResultId],
        overall_rating: overallRating,
        sections: generatedSections,
      },
      meta: {
        autoGenerated: autoGenerate,
        sectionsCreated: generatedSections.length,
        priorityItemCount: autoGenerate ? selectPriorityItems(processes).length : 0,
      },
    });
  } catch (error) {
    console.error('Error creating SOW from diagnostic:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
```

### 4.2 New: `POST /api/sow/[id]/regenerate-sections`

Allows re-generating sections for an existing SOW (e.g., after diagnostic changes). Deletes existing sections and rebuilds.

```json
POST /api/sow/:id/regenerate-sections
{
  "groupBy": "function",
  "defaultRate": 200,
  "startDate": "2026-03-01",
  "preserveManual": true
}
```

When `preserveManual` is `true`, keep sections that have no `diagnostic_items` (manually added). Only regenerate sections that were auto-generated.

### 4.3 Service Catalog Lookup Enhancement

Add a `slug` column to `service_catalog` if not present, indexed for fast lookup. The `slug` matches `process.serviceId`.

```sql
ALTER TABLE service_catalog ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_service_catalog_slug ON service_catalog(slug);
```

Seed slugs from the static `strategicProjects` data:
```js
// Flatten strategicProjects to get slug → service mapping
import { strategicProjects } from '../../data/services-catalog';

const allProjects = Object.values(strategicProjects).flat();
// Each has { id: 'lead-routing', name: 'Lead Routing', ... }
// id === slug === process.serviceId
```

---

## 5. UI Changes

### 5.1 SowBuilder — Auto-Generated State

When the builder loads with auto-generated sections, show a banner:

```jsx
{sections.length > 0 && sow.created_at === sow.updated_at && (
  <div style={{
    padding: '0.75rem 1.25rem',
    background: '#F0FFF4',
    border: '1px solid #C6F6D5',
    borderRadius: '0.75rem',
    marginBottom: '1rem',
    fontSize: '0.875rem',
    color: '#276749',
  }}>
    ✨ <strong>{sections.length} sections</strong> were auto-generated from your diagnostic results.
    Review and adjust hours, rates, and deliverables as needed.
  </div>
)}
```

### 5.2 SowBuilder — Section Source Indicator

Each auto-generated section should show its source:

```jsx
// In SectionEditor, show a subtle indicator
{section.diagnostic_items?.length > 0 && (
  <span style={{ fontSize: '0.7rem', color: '#A0AEC0' }}>
    📊 From diagnostic ({section.diagnostic_items.length} items)
  </span>
)}
```

### 5.3 SowBuilder — Executive Summary Editor

Add an editable executive summary field above the two-panel layout:

```jsx
<div style={{ marginBottom: '1.5rem' }}>
  <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1a1a2e', display: 'block', marginBottom: '0.5rem' }}>
    Executive Summary
  </label>
  <textarea
    value={executiveSummary}
    onChange={(e) => setExecutiveSummary(e.target.value)}
    onBlur={() => saveExecutiveSummary()}
    rows={4}
    style={{
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #E2E8F0',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      lineHeight: 1.7,
      resize: 'vertical',
    }}
    placeholder="Executive summary will appear here..."
  />
</div>
```

### 5.4 "Build SOW" Button Enhancement

On the diagnostic results page, the "Build SOW" button should show what will be generated:

```jsx
<button onClick={handleBuildSow}>
  Build SOW ({priorityCount} items → ~{estimatedSections} sections)
</button>
```

### 5.5 Grouping Toggle

Add a toggle in the SowBuilder to switch between function-based and outcome-based grouping (triggers `regenerate-sections`):

```jsx
<select value={groupBy} onChange={handleGroupByChange}>
  <option value="function">Group by Function</option>
  <option value="outcome">Group by Outcome</option>
</select>
```

---

## 6. Executive Summary Generation

Template-based generation from diagnostic statistics:

```js
function generateExecutiveSummary(processes, customerName, diagnosticType, statusCounts) {
  const total = processes.length;
  const warningCount = statusCounts.warning || 0;
  const unableCount = statusCounts.unable || 0;
  const healthyCount = statusCounts.healthy || 0;
  const criticalCount = warningCount + unableCount;
  const criticalPct = Math.round((criticalCount / total) * 100);

  const priorityItems = processes.filter(p =>
    p.status === 'warning' || p.status === 'unable' || p.addToEngagement
  );
  const functions = [...new Set(priorityItems.map(p => p.function))];

  const diagnosticLabel = {
    gtm: 'GTM Operations',
    clay: 'Clay Enrichment',
    cpq: 'Quote-to-Cash',
  }[diagnosticType] || 'Operations';

  const companyRef = customerName || 'your organization';

  // Build severity description
  let severityDesc;
  if (criticalPct > 50) {
    severityDesc = `significant operational gaps requiring immediate attention`;
  } else if (criticalPct > 30) {
    severityDesc = `several areas requiring strategic improvement`;
  } else if (criticalPct > 10) {
    severityDesc = `targeted opportunities for optimization`;
  } else {
    severityDesc = `a strong foundation with select enhancement opportunities`;
  }

  const summary = [
    `Following a comprehensive ${diagnosticLabel} diagnostic assessment of ${companyRef}, ` +
    `LeanScale identified ${severityDesc}. ` +
    `Of the ${total} processes evaluated, ${criticalCount} (${criticalPct}%) ` +
    `require attention — ${warningCount} flagged as warning and ${unableCount} unable to report.`,
    '',
    `This Statement of Work addresses ${priorityItems.length} priority items ` +
    `spanning ${functions.join(', ')}. ` +
    `The recommended engagement focuses on establishing operational foundations, ` +
    `implementing key process improvements, and enabling data-driven decision making ` +
    `across ${companyRef}'s go-to-market organization.`,
  ].join('\n');

  return summary;
}
```

**Example output:**

> Following a comprehensive GTM Operations diagnostic assessment of Acme Corp, LeanScale identified several areas requiring strategic improvement. Of the 63 processes evaluated, 26 (41%) require attention — 12 flagged as warning and 14 unable to report.
>
> This Statement of Work addresses 15 priority items spanning Cross Functional, Marketing, Sales, Customer Success. The recommended engagement focuses on establishing operational foundations, implementing key process improvements, and enabling data-driven decision making across Acme Corp's go-to-market organization.

---

## 7. Hour/Rate Defaults

### 7.1 Service Catalog Lookup

Each diagnostic item has a `serviceId` that maps to a `service_catalog` row. The catalog provides:

| Field | Usage |
|-------|-------|
| `hours_low` | Minimum estimated hours |
| `hours_high` | Maximum estimated hours |
| `default_rate` | Hourly rate (USD) |
| `key_steps` | Pre-built deliverables list |
| `description` | Section description text |

### 7.2 Hour Calculation

For a single section mapped to one catalog entry:
```js
const hours = Math.round((catalog.hours_low + catalog.hours_high) / 2);
```

For a grouped section (multiple items → one section):
```js
// Sum hours across all catalog entries in the group
const totalHoursLow = items.reduce((sum, item) => {
  const cat = catalogMap[item.serviceId];
  return sum + (cat?.hours_low || 0);
}, 0);

const totalHoursHigh = items.reduce((sum, item) => {
  const cat = catalogMap[item.serviceId];
  return sum + (cat?.hours_high || 0);
}, 0);

const hours = Math.round((totalHoursLow + totalHoursHigh) / 2);
```

### 7.3 Rate Calculation

Use the average `default_rate` across catalog entries in a section. If no catalog entries have a rate, use the `defaultRate` parameter (default: `200`).

```js
const rates = items
  .map(i => catalogMap[i.serviceId]?.default_rate)
  .filter(Boolean)
  .map(r => parseFloat(r));

const rate = rates.length > 0
  ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length)
  : defaultRate;
```

### 7.4 Fallback Chain

When a catalog entry is not found for a `serviceId`:

1. Try matching by `name` (case-insensitive)
2. Try matching by `slug` with common transformations (e.g., removing hyphens)
3. Use defaults: `hours = null`, `rate = defaultRate`, `deliverables = []`

```js
function findCatalogEntry(serviceId, catalogMap, allCatalog) {
  // Direct slug match
  if (catalogMap[serviceId]) return catalogMap[serviceId];

  // Name-based fallback
  const byName = allCatalog.find(c =>
    c.name.toLowerCase().replace(/[^a-z0-9]/g, '') ===
    serviceId.replace(/-/g, '')
  );
  return byName || null;
}
```

---

## 8. Timeline Auto-Suggestion

### 8.1 Logic

Sections are sequenced based on function order (foundational work first), with duration derived from hours.

```js
function suggestTimeline(sections, startDate) {
  const baseDate = startDate ? new Date(startDate) : nextMonday();
  let cursor = new Date(baseDate);

  return sections.map(section => {
    const hours = parseFloat(section.hours) || 40;
    // Assume ~20 productive hours/week for a consultant
    const weeks = Math.max(2, Math.ceil(hours / 20));

    const sectionStart = new Date(cursor);
    cursor.setDate(cursor.getDate() + weeks * 7);
    const sectionEnd = new Date(cursor);

    // Add 1-week buffer between sections
    cursor.setDate(cursor.getDate() + 7);

    return {
      ...section,
      startDate: sectionStart.toISOString().split('T')[0],
      endDate: sectionEnd.toISOString().split('T')[0],
    };
  });
}

function nextMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + diff);
  return d;
}
```

### 8.2 Overlap Mode

For parallel execution (e.g., Marketing and Sales can run concurrently), support `parallel` mode where independent sections overlap:

```js
function suggestTimelineParallel(sections, startDate) {
  const baseDate = startDate ? new Date(startDate) : nextMonday();

  // Cross Functional runs first (foundational)
  // Marketing, Sales, CS run in parallel after
  // Partnerships runs last
  const phases = [
    sections.filter(s => s.title.includes('Cross Functional')),
    sections.filter(s => !s.title.includes('Cross Functional') && !s.title.includes('Partnerships')),
    sections.filter(s => s.title.includes('Partnerships')),
  ].filter(p => p.length > 0);

  let cursor = new Date(baseDate);
  const result = [];

  phases.forEach(phase => {
    let maxEnd = new Date(cursor);
    phase.forEach(section => {
      const hours = parseFloat(section.hours) || 40;
      const weeks = Math.max(2, Math.ceil(hours / 20));
      const end = new Date(cursor);
      end.setDate(end.getDate() + weeks * 7);
      if (end > maxEnd) maxEnd = end;

      result.push({
        ...section,
        startDate: cursor.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
      });
    });
    cursor = new Date(maxEnd);
    cursor.setDate(cursor.getDate() + 7); // buffer
  });

  return result;
}
```

---

## 9. Edge Cases

### 9.1 No Matching Catalog Entry

**When:** A diagnostic item's `serviceId` has no match in `service_catalog`.

**Behavior:**
- Section is still created with the item's `name` as title
- Hours and rate are `null` (displayed as "—" in UI with an indicator to fill in)
- Deliverables are empty
- Description falls back to: `"Strategic project addressing {item.name} based on diagnostic findings."`

### 9.2 Empty Diagnostics

**When:** No processes have `warning`/`unable` status or `addToEngagement`.

**Behavior:**
- SOW is created with no auto-generated sections
- Executive summary reads: "The diagnostic assessment indicates a healthy operational state. This SOW addresses select optimization opportunities identified during the assessment."
- User is redirected to the builder with a message: "No priority items found. Add sections manually or from the service catalog."

### 9.3 Multiple Diagnostic Types

**When:** A customer has both GTM and Clay diagnostic results.

**Current limitation:** `from-diagnostic` accepts a single `diagnosticResultId`.

**Future enhancement:** Accept an array of diagnostic result IDs:
```json
{
  "diagnosticResultIds": ["uuid-gtm", "uuid-clay"],
  "diagnosticTypes": ["gtm", "clay"]
}
```

For now, generate from one diagnostic at a time. The `diagnostic_result_ids` array on the SOW already supports multiple IDs, so the schema is ready.

### 9.4 Re-generation After Edits

**When:** User clicks "Regenerate" after modifying diagnostic results.

**Behavior:**
- Show confirmation: "This will replace auto-generated sections. Manually added sections will be preserved."
- Delete sections where ALL `diagnostic_items` came from the diagnostic
- Regenerate new sections
- Recalculate totals

### 9.5 Very Large Item Count

**When:** 30+ priority items across all functions.

**Behavior:**
- Always use function-based grouping (never per-item sections)
- Cap deliverables per section at 15 (take the highest-priority items' deliverables)
- Add a note: "Full deliverable details available in individual playbooks"

### 9.6 Managed Services Items

**When:** Diagnostic includes `managedServicesHealth` items with `serviceType: 'managed'`.

**Behavior:**
- Create a separate "Managed Services" section
- Use `hoursPerMonth` from the diagnostic data instead of catalog lookup
- Rate calculation: `hoursPerMonth * rate * engagementMonths` (default 12 months)

### 9.7 Existing SOW for Customer

**When:** Customer already has a SOW (draft or otherwise).

**Behavior:**
- Show warning: "An existing SOW ({title}, {status}) exists for this customer. Create another?"
- Allow creating a new one (don't overwrite)
- Old SOWs remain unaffected

---

## 10. Migration Path

### 10.1 Backward Compatibility

All changes are **additive**. Existing behavior is preserved:

| Aspect | Current | After |
|--------|---------|-------|
| `from-diagnostic` without `autoGenerate` | Creates empty SOW | Same (default `autoGenerate: true`, but `false` works) |
| Existing SOWs | Untouched | Untouched |
| SowBuilder with no sections | Shows empty state | Same |
| SowBuilder with sections | Shows sections | Same + source indicator |
| `diagnostic_snapshot` | Stores name, status, addToEngagement | Stores all fields (superset) |

### 10.2 Database Changes

```sql
-- Add slug column to service_catalog if not present
ALTER TABLE service_catalog ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_service_catalog_slug ON service_catalog(slug) WHERE slug IS NOT NULL;

-- Populate slugs from existing data (one-time migration)
-- Run via seed script that maps strategicProjects[].id → service_catalog.slug
```

### 10.3 Implementation Order

1. **Phase 1:** Add `slug` to `service_catalog`, seed data, implement `lookupCatalogEntries()`
2. **Phase 2:** Implement `generateSections()`, `generateExecutiveSummary()`, `suggestTimeline()`
3. **Phase 3:** Modify `from-diagnostic` endpoint to use auto-generation
4. **Phase 4:** Update SowBuilder UI (banner, executive summary editor, source indicators)
5. **Phase 5:** Add `regenerate-sections` endpoint and grouping toggle

### 10.4 Testing Plan

- **Unit tests:** `selectPriorityItems()`, `groupByFunction()`, `generateSections()`, `generateExecutiveSummary()`
- **Integration tests:** `from-diagnostic` with `autoGenerate: true` creates expected sections
- **Edge case tests:** Empty diagnostics, no catalog matches, 30+ items
- **Manual QA:** Full flow from diagnostic edit → Build SOW → review sections → adjust → export PDF

---

## Appendix: Service Catalog Schema Reference

```sql
CREATE TABLE service_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,                  -- matches diagnostic process.serviceId
  name TEXT NOT NULL,
  category TEXT,                     -- e.g., 'Cross Functional', 'Marketing'
  description TEXT,
  hours_low INTEGER,
  hours_high INTEGER,
  default_rate NUMERIC(10,2),
  key_steps JSONB DEFAULT '[]',      -- array of deliverable strings
  project_type TEXT,                 -- 'strategic' | 'managed'
  primary_function TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
