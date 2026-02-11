# Dynamic Engagement Page — Technical Specification

**Date:** 2026-02-11  
**Branch:** `feature/sales-diagnostic-sow-flow`  
**Status:** Draft  

---

## 1. Problem Statement

The engagement page (`pages/try-leanscale/engagement.js`) currently renders a **static, demo-quality view** that is identical for every customer. It imports `processes` and `managedServicesHealth` directly from the static `data/diagnostic-data.js` file and computes hours using fabricated formulas (`20 + (idx * 8)` for low hours, `40 + (idx * 12)` for high hours). These numbers have no relationship to the service catalog's actual `hours_low`/`hours_high` values.

**Consequences:**
- A customer who just completed a diagnostic sees the same engagement overview as every other customer
- Hour estimates are fiction — index-based formulas produce wildly different numbers than the service catalog
- No recommended tier — the page shows all three tiers equally without guidance
- The "Build SOW" action on the diagnostic page creates an empty SOW with no pre-populated sections
- Sales reps must manually explain the connection between diagnostic findings and the engagement recommendation

**Goal:** Transform the engagement page into a **dynamic, customer-specific recommendation engine** that reads from the customer's saved diagnostic results, computes real hours from the service catalog, recommends an engagement tier, and feeds directly into the SOW builder.

---

## 2. Current Architecture

### 2.1 Data Flow (Static)

```
data/diagnostic-data.js (static file)
        ↓ import { processes, managedServicesHealth }
pages/try-leanscale/engagement.js
        ↓ .filter(p => p.addToEngagement)
        ↓ .map((p, idx) => { lowHours: 20 + (idx * 8), ... })
Rendered UI (same for all customers)
```

### 2.2 engagement.js Internals

The page computes `engagementItems` in a `useMemo` with no dependencies (runs once):

```js
// Current: hardcoded hour formulas based on array index
const priorityProcesses = processes
  .filter(p => p.addToEngagement)
  .map((p, idx) => ({
    ...p,
    lowHours: 20 + (idx * 8),      // fabricated
    highHours: 40 + (idx * 12),     // fabricated
    startWeek: idx + 1,             // sequential, not dependency-based
    durationWeeks: 3 + Math.floor(idx / 3),  // fabricated
    priority: idx < 5 ? 'High' : 'Medium',   // arbitrary cutoff
  }));
```

The service catalog lookup (`getServiceDetails`) only fetches `icon`, `description`, and `hasPlaybook` — it ignores `hours_low`, `hours_high`, and `default_rate` because those fields don't exist on the static `strategicProjects` objects. They only exist in the **database** `service_catalog` table.

### 2.3 What the Page Renders

1. **Summary cards** — strategic project count, managed service count, total hours, managed hours/mo
2. **Timeline calculator** — three tier cards (50h/$15K, 100h/$25K, 225h/$50K) with duration estimates
3. **Gantt-style timeline** — H1 2026 project timeline (26 weeks)
4. **Strategic projects table** — checkboxes, status, priority, hours, playbook links
5. **Managed services grid** — cards with hours/month
6. **CTA** — "Check Cohort Availability" and "Start Engagement"

### 2.4 What's Missing

| Capability | Current | Needed |
|---|---|---|
| Customer-specific data | ❌ Static imports | ✅ Fetch from `diagnostic_results` |
| Real hours | ❌ `20 + (idx * 8)` | ✅ From `service_catalog` DB |
| Tier recommendation | ❌ All equal | ✅ Computed from total hours |
| Project ordering | ❌ Array index | ✅ Priority + dependency logic |
| SOW connection | ❌ None | ✅ "Build SOW" pre-populates sections |
| Fallback for no data | ❌ Always static | ✅ Graceful demo mode |

---

## 3. Proposed Architecture

### 3.1 Data Flow (Dynamic)

```
Customer visits /try-leanscale/engagement
        ↓
Client: useEffect → GET /api/engagement?customerId=XXX
        ↓
Server: /api/engagement handler
        ├── Fetch diagnostic_results (customerId, type='gtm')
        ├── Fetch service_catalog (all active services)
        ├── Run recommendation engine
        └── Return EngagementRecommendation
        ↓
Client: Render dynamic UI with customer-specific data
        ↓
"Build SOW" button → POST /api/sow/from-engagement
        ↓
SOW created with pre-populated sections from recommendations
```

### 3.2 Component Architecture

```
pages/try-leanscale/engagement.js
  ├── useEngagementData(customerId)     // custom hook
  │     ├── fetches /api/engagement
  │     ├── manages loading/error state
  │     └── returns { recommendation, isLoading, isDemo }
  ├── <EngagementSummaryCard />          // tier + total hours + investment
  ├── <FunctionBreakdown />             // grouped projects by function
  ├── <EngagementTimeline />            // visual project sequence
  ├── <TierCalculator />                // interactive tier comparison
  └── <BuildSowCTA />                   // feeds into SOW builder
```

### 3.3 State Management

The engagement page will use the existing `CustomerContext` for customer identity and a new `useEngagementData` hook for data fetching:

```js
function useEngagementData() {
  const { customer, isDemo } = useCustomer();
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isDemo || !customer?.id) {
      // Load fallback static data
      setRecommendation(buildStaticFallback());
      setIsLoading(false);
      return;
    }

    fetch(`/api/engagement?customerId=${customer.id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setRecommendation(json.data);
        } else {
          setRecommendation(buildStaticFallback());
        }
      })
      .catch(() => setRecommendation(buildStaticFallback()))
      .finally(() => setIsLoading(false));
  }, [customer?.id, isDemo]);

  return { recommendation, isLoading, isDemo };
}
```

---

## 4. Recommendation Engine

### 4.1 Algorithm Overview

```
Input:
  - diagnostic_results.processes[]  (customer-specific statuses + addToEngagement flags)
  - service_catalog[]              (hours_low, hours_high, default_rate per serviceId)

Steps:
  1. Filter   → processes where addToEngagement === true
  2. Enrich   → join each process.serviceId to service_catalog for hours/rate
  3. Score    → assign priority weight based on status
  4. Group    → organize by function (Cross Functional, Marketing, Sales, CS, Partnerships)
  5. Sequence → order projects within groups by priority weight, then by dependency
  6. Total    → sum hours, compute recommended tier
  7. Timeline → assign start/end weeks based on sequence and tier capacity

Output:
  - EngagementRecommendation object (see §4.6)
```

### 4.2 Step 1: Filter Priority Items

```js
function filterPriorityItems(processes) {
  return processes.filter(p => p.addToEngagement);
}
```

Only items explicitly flagged as `addToEngagement: true` by the sales rep during the diagnostic are included. This is a deliberate, human-curated list — not an automatic filter.

### 4.3 Step 2: Enrich with Service Catalog

Each diagnostic process has a `serviceId` that maps to the `service_catalog` table. The enrichment joins them:

```js
function enrichWithCatalog(priorityProcesses, serviceCatalog) {
  return priorityProcesses.map(process => {
    const catalogEntry = serviceCatalog.find(
      s => s.name?.toLowerCase().replace(/\s+/g, '-') === process.serviceId
        || s.id === process.serviceId
    );

    return {
      ...process,
      hoursLow: catalogEntry?.hours_low ?? 30,    // fallback default
      hoursHigh: catalogEntry?.hours_high ?? 60,
      rate: catalogEntry?.default_rate ?? 250,
      deliverables: catalogEntry?.key_steps ?? [],
      catalogId: catalogEntry?.id ?? null,
      description: catalogEntry?.description ?? '',
      primaryFunction: catalogEntry?.primary_function ?? process.function,
    };
  });
}
```

**Fallback:** If a `serviceId` has no matching catalog entry, use sensible defaults (30–60 hours at $250/hr). This handles cases where the catalog hasn't been seeded or a new process was added to the diagnostic without a catalog entry.

### 4.4 Step 3: Score and Prioritize

```js
const STATUS_WEIGHTS = {
  unable: 4,    // highest urgency — can't even report on this
  warning: 3,   // actively broken
  careful: 2,   // needs attention
  healthy: 1,   // rarely flagged for engagement, but possible
};

function scorePriority(enrichedItem) {
  return {
    ...enrichedItem,
    priorityScore: STATUS_WEIGHTS[enrichedItem.status] ?? 1,
    priorityLabel: enrichedItem.status === 'unable' || enrichedItem.status === 'warning'
      ? 'High' : 'Medium',
  };
}
```

### 4.5 Step 4–5: Group and Sequence

```js
const FUNCTION_ORDER = [
  'Cross Functional',   // foundational — must be done first
  'Sales',              // revenue-generating
  'Marketing',          // pipeline-generating
  'Customer Success',   // retention
  'Partnerships',       // expansion
];

function groupAndSequence(scoredItems) {
  const groups = {};

  for (const func of FUNCTION_ORDER) {
    const items = scoredItems
      .filter(item => item.function === func)
      .sort((a, b) => b.priorityScore - a.priorityScore); // highest priority first

    if (items.length > 0) {
      groups[func] = items;
    }
  }

  // Flatten into ordered sequence for timeline
  const sequence = [];
  let weekCursor = 1;

  for (const func of FUNCTION_ORDER) {
    if (!groups[func]) continue;
    for (const item of groups[func]) {
      const avgHours = (item.hoursLow + item.hoursHigh) / 2;
      // Duration in weeks assuming ~20 hrs/week capacity within the tier
      const durationWeeks = Math.max(2, Math.ceil(avgHours / 20));
      sequence.push({
        ...item,
        startWeek: weekCursor,
        durationWeeks,
      });
      // Overlap projects within the same function by 1 week
      weekCursor += Math.max(1, durationWeeks - 1);
    }
  }

  return { groups, sequence };
}
```

### 4.6 Step 6–7: Compute Tier and Build Recommendation

```js
const TIERS = [
  { id: 'starter',  hours: 50,  price: 15000, label: 'Starter' },
  { id: 'growth',   hours: 100, price: 25000, label: 'Growth' },
  { id: 'scale',    hours: 225, price: 50000, label: 'Scale' },
];

function computeRecommendation(diagnosticResult, serviceCatalog, managedServices) {
  const priorityProcesses = filterPriorityItems(diagnosticResult.processes);
  const enriched = enrichWithCatalog(priorityProcesses, serviceCatalog);
  const scored = enriched.map(scorePriority);
  const { groups, sequence } = groupAndSequence(scored);

  // Compute totals
  const totalHoursLow = scored.reduce((sum, p) => sum + p.hoursLow, 0);
  const totalHoursHigh = scored.reduce((sum, p) => sum + p.hoursHigh, 0);
  const avgHours = Math.round((totalHoursLow + totalHoursHigh) / 2);

  // Managed services hours
  const priorityManaged = (managedServices || []).filter(m => m.addToEngagement);
  const managedHoursPerMonth = priorityManaged.reduce(
    (sum, m) => sum + (m.hoursPerMonth || 8), 0
  );

  // Recommend tier: pick the smallest tier that completes projects within 6 months
  const recommendedTier = TIERS.find(tier => {
    const availablePerMonth = tier.hours - managedHoursPerMonth;
    if (availablePerMonth <= 0) return false;
    const monthsNeeded = avgHours / availablePerMonth;
    return monthsNeeded <= 6;
  }) || TIERS[TIERS.length - 1]; // default to Scale if nothing fits

  // Total investment estimate (6 months)
  const estimatedInvestment = recommendedTier.price * 6;
  const estimatedDurationMonths = Math.ceil(avgHours / (recommendedTier.hours - managedHoursPerMonth));

  return {
    customerId: diagnosticResult.customer_id,
    diagnosticResultId: diagnosticResult.id,
    diagnosticType: diagnosticResult.diagnostic_type,
    generatedAt: new Date().toISOString(),

    summary: {
      recommendedTier,
      totalHoursLow,
      totalHoursHigh,
      avgProjectHours: avgHours,
      managedHoursPerMonth,
      estimatedDurationMonths,
      estimatedInvestment,
      projectCount: scored.length,
      managedServiceCount: priorityManaged.length,
      highPriorityCount: scored.filter(s => s.priorityLabel === 'High').length,
    },

    functionGroups: groups,      // { 'Cross Functional': [...], 'Sales': [...], ... }
    projectSequence: sequence,   // ordered array with startWeek/durationWeeks
    managedServices: priorityManaged,
    tiers: TIERS.map(tier => ({
      ...tier,
      estimatedMonths: Math.ceil(avgHours / Math.max(1, tier.hours - managedHoursPerMonth)),
      isRecommended: tier.id === recommendedTier.id,
    })),
  };
}
```

### 4.7 EngagementRecommendation Data Shape

```typescript
interface EngagementRecommendation {
  customerId: string;
  diagnosticResultId: string;
  diagnosticType: 'gtm' | 'clay' | 'cpq';
  generatedAt: string;

  summary: {
    recommendedTier: Tier;
    totalHoursLow: number;
    totalHoursHigh: number;
    avgProjectHours: number;
    managedHoursPerMonth: number;
    estimatedDurationMonths: number;
    estimatedInvestment: number;
    projectCount: number;
    managedServiceCount: number;
    highPriorityCount: number;
  };

  functionGroups: Record<string, EnrichedProject[]>;
  projectSequence: SequencedProject[];
  managedServices: ManagedServiceItem[];
  tiers: TierComparison[];
}

interface EnrichedProject {
  name: string;
  status: 'healthy' | 'careful' | 'warning' | 'unable';
  function: string;
  outcome: string;
  metric: string;
  serviceId: string;
  hoursLow: number;
  hoursHigh: number;
  rate: number;
  priorityScore: number;
  priorityLabel: 'High' | 'Medium';
  deliverables: string[];
  catalogId: string | null;
  description: string;
}

interface SequencedProject extends EnrichedProject {
  startWeek: number;
  durationWeeks: number;
}

interface TierComparison {
  id: string;
  hours: number;
  price: number;
  label: string;
  estimatedMonths: number;
  isRecommended: boolean;
}
```

---

## 5. UI Design

### 5.1 Page Layout

```
┌────────────────────────────────────────────────┐
│  📋 Engagement Overview                        │
│  "Personalized for [Customer Name]"            │
│  [Based on GTM Diagnostic completed Feb 10]    │
├────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  RECOMMENDED ENGAGEMENT                  │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐       │   │
│  │  │ Growth │ │ 11     │ │ $150K  │       │   │
│  │  │ Tier   │ │ Proj.  │ │ Est.   │       │   │
│  │  │ 100h/mo│ │ 640hrs │ │ 6 mo   │       │   │
│  │  └────────┘ └────────┘ └────────┘       │   │
│  │  [5 High Priority · 6 Medium Priority]   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─ TIER COMPARISON ──────────────────────┐    │
│  │  Starter 50h  │  Growth 100h* │  Scale  │    │
│  │  $15K/mo      │  $25K/mo      │  $50K   │    │
│  │  ~13 months   │  ~7 months    │  ~3 mo  │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  ┌─ PROJECTS BY FUNCTION ─────────────────┐    │
│  │                                         │    │
│  │  Cross Functional (3 projects)          │    │
│  │  ├─ Activity Capture    ⚠️  40-80h      │    │
│  │  ├─ Mktg-Sales Handoff  🟡  30-50h      │    │
│  │  └─ Market Map          🟡  40-60h      │    │
│  │                                         │    │
│  │  Sales (3 projects)                     │    │
│  │  ├─ Sales Lifecycle     ⚫  50-90h      │    │
│  │  ├─ Lead Routing        ⚠️  30-50h      │    │
│  │  └─ Territory Design    🟡  40-60h      │    │
│  │  ...                                   │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─ PROJECT TIMELINE ─────────────────────┐    │
│  │  [Gantt chart — same as current but     │    │
│  │   with real hours driving bar widths    │    │
│  │   and priority-based ordering]          │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  [Build SOW from These Recommendations]  │   │
│  │  [Download Engagement Summary PDF]       │   │
│  └─────────────────────────────────────────┘   │
└────────────────────────────────────────────────┘
```

### 5.2 Summary Card

The top card replaces the current four stat boxes with a single focused recommendation:

```jsx
function EngagementSummaryCard({ summary, customerName, diagnosticDate }) {
  const { recommendedTier, avgProjectHours, managedHoursPerMonth,
          estimatedDurationMonths, estimatedInvestment, projectCount,
          highPriorityCount } = summary;

  return (
    <section className="card" style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
      color: 'white',
      marginBottom: '2rem',
    }}>
      <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginBottom: '0.5rem' }}>
        Recommended for {customerName}
      </div>
      <h2 style={{ fontSize: '1.5rem', margin: '0 0 1.5rem' }}>
        {recommendedTier.label} Engagement — {recommendedTier.hours} hrs/mo
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <MetricBox label="Projects" value={projectCount} />
        <MetricBox label="Total Hours" value={`${avgProjectHours}`} />
        <MetricBox label="Duration" value={`~${estimatedDurationMonths} mo`} />
        <MetricBox label="Investment" value={`$${(estimatedInvestment/1000).toFixed(0)}K`} />
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#c4b5fd' }}>
        {highPriorityCount} high-priority · {managedHoursPerMonth} hrs/mo managed services
      </div>
    </section>
  );
}
```

### 5.3 Function-by-Function Breakdown

Each function group renders as a collapsible card with its projects, hours, and statuses:

```jsx
function FunctionBreakdown({ functionGroups }) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recommended Projects</h2>
      {FUNCTION_ORDER.map(func => {
        const projects = functionGroups[func];
        if (!projects?.length) return null;

        const groupHoursLow = projects.reduce((s, p) => s + p.hoursLow, 0);
        const groupHoursHigh = projects.reduce((s, p) => s + p.hoursHigh, 0);

        return (
          <div key={func} className="card" style={{ marginBottom: '1rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>
                {func} ({projects.length} project{projects.length > 1 ? 's' : ''})
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#7c3aed', fontWeight: 600 }}>
                {groupHoursLow}–{groupHoursHigh} hours
              </span>
            </div>
            {projects.map(project => (
              <ProjectRow key={project.name} project={project} />
            ))}
          </div>
        );
      })}
    </section>
  );
}
```

### 5.4 Timeline

The existing Gantt timeline stays but is powered by `projectSequence` data with real durations:

```jsx
function EngagementTimeline({ projectSequence, managedServices, totalWeeks = 26 }) {
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Suggested Timeline</h2>
      <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <div style={{ minWidth: '1200px' }}>
          {/* Week headers */}
          <div style={{ display: 'grid', gridTemplateColumns: `280px repeat(${totalWeeks}, 1fr)` }}>
            <div style={{ fontWeight: 600, fontSize: '0.75rem' }}>Project</div>
            {weeks.map(w => (
              <div key={w} style={{ fontSize: '0.6rem', textAlign: 'center' }}>
                {w % 4 === 1 ? getWeekLabel(w) : ''}
              </div>
            ))}
          </div>

          {/* Project bars — driven by real data */}
          {projectSequence.map(project => (
            <TimelineRow key={project.name} project={project} weeks={weeks} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 5.5 Build SOW CTA

```jsx
function BuildSowCTA({ recommendation, customerPath }) {
  const handleBuildSow = async () => {
    const res = await fetch('/api/sow/from-engagement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: recommendation.customerId,
        diagnosticResultId: recommendation.diagnosticResultId,
        recommendation: recommendation,
      }),
    });
    const json = await res.json();
    if (json.success) {
      router.push(customerPath(`/sow/${json.data.id}/build`));
    }
  };

  return (
    <div className="card" style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
      color: 'white',
      textAlign: 'center',
    }}>
      <h3>Ready to formalize this engagement?</h3>
      <p style={{ opacity: 0.9 }}>
        Build a SOW pre-populated with {recommendation.summary.projectCount} projects
        and {recommendation.summary.avgProjectHours} estimated hours.
      </p>
      <button onClick={handleBuildSow} className="btn" style={{
        background: 'white', color: '#7c3aed', fontWeight: 700, padding: '0.75rem 2rem',
      }}>
        Build SOW from Recommendations
      </button>
    </div>
  );
}
```

---

## 6. API Changes

### 6.1 New Endpoint: `GET /api/engagement`

**File:** `pages/api/engagement.js`

```js
import { getDiagnosticResult } from '../../lib/diagnostics';
import { listServices } from '../../lib/service-catalog';
import { computeRecommendation } from '../../lib/engagement-engine';
import { processes as staticProcesses, managedServicesHealth } from '../../data/diagnostic-data';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { customerId, diagnosticType = 'gtm' } = req.query;

  if (!customerId) {
    return res.status(400).json({ success: false, error: 'customerId required' });
  }

  try {
    // 1. Fetch customer's diagnostic results
    const diagnosticResult = await getDiagnosticResult(customerId, diagnosticType);

    if (!diagnosticResult) {
      // Return fallback recommendation from static data
      return res.status(200).json({
        success: true,
        isDemo: true,
        data: buildStaticFallback(),
      });
    }

    // 2. Fetch service catalog for hours/rates
    const serviceCatalog = await listServices({ active: true });

    // 3. Get managed services from diagnostic data
    // (managed services health is stored in the diagnostic processes array
    //  or falls back to static data)
    const managedServices = diagnosticResult.processes
      ? extractManagedServices(diagnosticResult.processes)
      : managedServicesHealth;

    // 4. Run recommendation engine
    const recommendation = computeRecommendation(
      diagnosticResult,
      serviceCatalog,
      managedServices
    );

    return res.status(200).json({
      success: true,
      isDemo: false,
      data: recommendation,
    });
  } catch (err) {
    console.error('Engagement API error:', err);
    return res.status(500).json({ success: false, error: 'Internal error' });
  }
}
```

### 6.2 New Endpoint: `POST /api/sow/from-engagement`

**File:** `pages/api/sow/from-engagement.js`

Creates a SOW **with pre-populated sections** from the engagement recommendation:

```js
import { createSow } from '../../../lib/sow';
import { createSection } from '../../../lib/sow-sections';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { customerId, diagnosticResultId, recommendation } = req.body;

  try {
    // 1. Create the SOW
    const sow = await createSow({
      customer_id: customerId,
      title: `${recommendation.summary.recommendedTier.label} Engagement`,
      sow_type: 'custom',
      diagnostic_result_ids: [diagnosticResultId],
      diagnostic_snapshot: recommendation.projectSequence,
      overall_rating: computeOverallRating(recommendation),
      total_hours: recommendation.summary.avgProjectHours,
      total_investment: recommendation.summary.estimatedInvestment,
      content: {
        executive_summary: generateExecutiveSummary(recommendation),
      },
    });

    // 2. Create sections grouped by function
    let sortOrder = 0;
    for (const func of FUNCTION_ORDER) {
      const projects = recommendation.functionGroups[func];
      if (!projects?.length) continue;

      for (const project of projects) {
        await createSection({
          sow_id: sow.id,
          title: project.name,
          description: project.description,
          hours: Math.round((project.hoursLow + project.hoursHigh) / 2),
          rate: project.rate,
          deliverables: project.deliverables.map(d => ({
            title: d,
            complete: false,
          })),
          diagnostic_items: [project.name],
          sort_order: sortOrder++,
        });
      }
    }

    return res.status(200).json({ success: true, data: sow });
  } catch (err) {
    console.error('Create SOW from engagement error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create SOW' });
  }
}
```

### 6.3 New Library: `lib/engagement-engine.js`

The `computeRecommendation` function from §4.6 lives here. This is a pure function (no DB calls) — it takes diagnostic results + catalog data as input and returns the `EngagementRecommendation` object. This makes it testable without mocking.

```js
// lib/engagement-engine.js
export {
  computeRecommendation,
  filterPriorityItems,
  enrichWithCatalog,
  scorePriority,
  groupAndSequence,
  TIERS,
  FUNCTION_ORDER,
  STATUS_WEIGHTS,
};
```

---

## 7. Fallback Behavior

When no diagnostic results exist (demo mode, new customer, database unavailable), the engagement page degrades gracefully:

### 7.1 Detection

```js
// In useEngagementData hook
if (isDemo || !customer?.id) → use static fallback
if (API returns { isDemo: true }) → use static fallback
if (API returns error) → use static fallback
```

### 7.2 Static Fallback

```js
function buildStaticFallback() {
  // Use the static diagnostic-data.js processes with default hours
  const priorityProcesses = processes.filter(p => p.addToEngagement);
  const priorityManaged = managedServicesHealth.filter(m => m.addToEngagement);

  // Use hardcoded but reasonable defaults from service catalog static data
  const enriched = priorityProcesses.map(p => ({
    ...p,
    hoursLow: 30,
    hoursHigh: 60,
    rate: 250,
    priorityScore: STATUS_WEIGHTS[p.status] ?? 1,
    priorityLabel: p.status === 'unable' || p.status === 'warning' ? 'High' : 'Medium',
    deliverables: [],
    catalogId: null,
    description: getStaticDescription(p.serviceId),
  }));

  // Build recommendation using same engine but with defaults
  return computeRecommendation(
    { processes: processes, customer_id: 'demo', id: 'demo', diagnostic_type: 'gtm' },
    [], // empty catalog = all defaults
    priorityManaged
  );
}
```

### 7.3 UI Indicators

When in fallback mode, show a subtle banner:

```jsx
{isDemo && (
  <div style={{
    background: '#fef3c7', border: '1px solid #fbbf24',
    borderRadius: '8px', padding: '0.75rem 1rem',
    fontSize: '0.85rem', marginBottom: '1.5rem',
    display: 'flex', alignItems: 'center', gap: '0.5rem',
  }}>
    <span>ℹ️</span>
    This is a sample engagement overview. Complete your
    <Link href={customerPath('/try-leanscale/diagnostic')}> GTM Diagnostic</Link>
    {' '}to see personalized recommendations.
  </div>
)}
```

---

## 8. Connection to SOW

### 8.1 Flow: Engagement → SOW

```
Engagement Page
  │
  ├── "Build SOW from Recommendations" button
  │     ↓
  │   POST /api/sow/from-engagement
  │     ├── Creates SOW with diagnostic_result_ids, total_hours, executive_summary
  │     ├── Creates N sow_sections (one per recommended project)
  │     │     Each section has: title, description, hours, rate, deliverables, diagnostic_items
  │     └── Returns SOW id
  │     ↓
  │   Redirect to /sow/[id]/build
  │     ↓
  │   SowBuilder opens with pre-populated sections
  │     ├── Left panel: DiagnosticItemPicker (all items, recommended ones pre-selected)
  │     ├── Right panel: Sections already created with hours/rates/deliverables
  │     └── Sales rep reviews, adjusts, adds/removes sections
  │     ↓
  │   Save → Preview → Export PDF → Push to Teamwork
```

### 8.2 Data Mapping

| Engagement Recommendation | SOW Field |
|---|---|
| `summary.recommendedTier.label` | `sow.title` prefix |
| `summary.avgProjectHours` | `sow.total_hours` |
| `summary.estimatedInvestment` | `sow.total_investment` |
| `diagnosticResultId` | `sow.diagnostic_result_ids[0]` |
| `projectSequence` | `sow.diagnostic_snapshot` |
| Each project in `functionGroups` | One `sow_section` row |
| `project.name` | `section.title` |
| `project.description` | `section.description` |
| `(project.hoursLow + hoursHigh) / 2` | `section.hours` |
| `project.rate` | `section.rate` |
| `project.deliverables` | `section.deliverables` (JSONB) |
| `[project.name]` | `section.diagnostic_items` (JSONB) |
| Sequential by function group | `section.sort_order` |

### 8.3 Executive Summary Generation

When creating a SOW from engagement, auto-generate the executive summary:

```js
function generateExecutiveSummary(recommendation) {
  const { summary, functionGroups } = recommendation;
  const functionNames = Object.keys(functionGroups);

  return `Based on the GTM diagnostic assessment, we identified ${summary.projectCount} `
    + `priority projects across ${functionNames.length} functional areas `
    + `(${functionNames.join(', ')}). `
    + `${summary.highPriorityCount} items require immediate attention. `
    + `We recommend a ${summary.recommendedTier.label} engagement at `
    + `${summary.recommendedTier.hours} hours/month ($${summary.recommendedTier.price.toLocaleString()}/mo) `
    + `with an estimated duration of ${summary.estimatedDurationMonths} months `
    + `to complete all strategic projects, plus ${summary.managedHoursPerMonth} hours/month `
    + `for ongoing managed services.`;
}
```

### 8.4 Round-Trip Sync

When diagnostic results change after an engagement recommendation was used to create a SOW, the existing `DiagnosticSyncBanner` on the SOW page will detect the drift. Additionally, the engagement page should re-compute on each visit (it's not cached — it always fetches fresh diagnostic data and re-runs the engine).

---

## Implementation Order

1. **`lib/engagement-engine.js`** — Pure recommendation engine (testable, no deps)
2. **`pages/api/engagement.js`** — API endpoint wiring engine to data sources
3. **`pages/try-leanscale/engagement.js`** — Refactor page to use `useEngagementData` hook
4. **`pages/api/sow/from-engagement.js`** — SOW creation with pre-populated sections
5. **Tests** — Unit tests for engagement engine (priority scoring, tier selection, sequencing)
6. **Polish** — Loading states, error handling, demo banner, responsive design
