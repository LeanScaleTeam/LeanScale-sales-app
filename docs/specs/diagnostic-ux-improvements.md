# Diagnostic UX Improvements — Feature Spec

**Date:** 2026-02-11  
**Branch:** `feature/sales-diagnostic-sow-flow`  
**Status:** Draft  

---

## Table of Contents

1. [Search & Filter](#1-search--filter)
2. [Quick Assessment Mode](#2-quick-assessment-mode)
3. [Status Selection UX](#3-status-selection-ux)
4. ["Not Applicable" Status](#4-not-applicable-status)
5. [Power10 Metrics Editing](#5-power10-metrics-editing)
6. [Edit History / Audit Trail](#6-edit-history--audit-trail)
7. [Diagnostic PDF Export](#7-diagnostic-pdf-export)
8. [Read-Only View](#8-read-only-view)
9. [Mobile / Tablet Optimization](#9-mobile--tablet-optimization)
10. [Merge on Re-import](#10-merge-on-re-import)

---

## 1. Search & Filter

**Priority: P0**

### User Story

> As a sales rep running a live diagnostic call, I want to quickly find specific processes by name, function, status, or outcome so I can jump to the relevant items without scrolling through all 63 rows.

### Current Behavior

The `ItemTable` component in `DiagnosticResults.js` renders all items in a single `<table>` with no filtering. The only way to narrow down is switching to the "By Function" or "By Outcome" grouped tabs.

### Technical Approach

Add a `FilterBar` component rendered above `ItemTable` on the Processes tab. It holds a text search input and dropdown filters for function, status, and outcome. Filtering is client-side on the already-loaded `processes` array.

**New component: `components/diagnostic/FilterBar.js`**

```jsx
import { useState } from 'react';

const STATUS_OPTIONS = ['all', 'healthy', 'careful', 'warning', 'unable', 'na'];

export default function FilterBar({ categories, outcomes, filters, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Search processes..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        style={{
          flex: '1 1 200px',
          padding: '0.4rem 0.75rem',
          fontSize: '0.85rem',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
        }}
      />
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        style={{ padding: '0.4rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
      >
        <option value="all">All Statuses</option>
        {STATUS_OPTIONS.filter(s => s !== 'all').map(s => (
          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
        ))}
      </select>
      <select
        value={filters.function}
        onChange={(e) => onChange({ ...filters, function: e.target.value })}
        style={{ padding: '0.4rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
      >
        <option value="all">All Functions</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select
        value={filters.outcome}
        onChange={(e) => onChange({ ...filters, outcome: e.target.value })}
        style={{ padding: '0.4rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
      >
        <option value="all">All Outcomes</option>
        {outcomes.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
        <input
          type="checkbox"
          checked={filters.priorityOnly}
          onChange={(e) => onChange({ ...filters, priorityOnly: e.target.checked })}
        />
        Priority only
      </label>
    </div>
  );
}
```

**Filter logic in `DiagnosticResults.js`:**

```js
const [filters, setFilters] = useState({
  search: '', status: 'all', function: 'all', outcome: 'all', priorityOnly: false,
});

const filteredProcesses = useMemo(() => {
  return processes.filter(p => {
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status !== 'all' && p.status !== filters.status) return false;
    if (filters.function !== 'all' && p.function !== filters.function) return false;
    if (filters.outcome !== 'all' && p.outcome !== filters.outcome) return false;
    if (filters.priorityOnly && !p.addToEngagement) return false;
    return true;
  });
}, [processes, filters]);
```

Render `<FilterBar>` above `<ItemTable>` on the `processes` tab. Pass `filteredProcesses` instead of `processes` to `ItemTable`. Show a count badge: `Showing {filteredProcesses.length} of {processes.length}`.

### Data Model Changes

None.

---

## 2. Quick Assessment Mode

**Priority: P0**

### User Story

> As a sales rep on a 30-minute discovery call, I want to run a focused 15-20 item diagnostic covering the most impactful processes so I can deliver value without running over time, then expand to the full 63 later if needed.

### Current Behavior

The diagnostic always shows all 63 processes. No subset or guided mode exists.

### Technical Approach

Add a `quickAssessment` boolean flag to each process in the static data, marking the 15-20 highest-impact items. Add a toggle in the UI to switch between Quick and Full mode.

**Data change in `data/diagnostic-config.md` and `data/diagnostic-data.js`:**

Each process object gains a `quickAssessment: true/false` field. The parse script propagates it.

```js
// In diagnostic-data.js, add to high-impact items:
{ name: "Growth Model", status: "unable", ..., quickAssessment: true },
{ name: "ICP Definition", status: "warning", ..., quickAssessment: true },
// etc. — 15-20 items total, spread across all 5 functions
```

**Registry extension in `data/diagnostic-registry.js`:**

No change needed — the flag lives on each process item.

**UI in `DiagnosticResults.js`:**

```jsx
const [quickMode, setQuickMode] = useState(false);

// Apply before other filters:
const baseProcesses = quickMode
  ? processes.filter(p => p.quickAssessment)
  : processes;
```

Add a toggle button next to the Edit Mode button:

```jsx
<button
  onClick={() => setQuickMode(!quickMode)}
  style={{
    padding: '0.4rem 1rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    background: quickMode ? '#f59e0b' : 'var(--bg-subtle)',
    color: quickMode ? 'white' : 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
  }}
>
  {quickMode ? `Quick Mode (${quickCount})` : 'Quick Mode'}
</button>
```

When Quick Mode is active, the Health Overview, charts, and tab counts all reflect only the quick subset. A banner states: _"Quick Assessment: Showing {n} high-impact items. Switch to Full to see all {total}."_

### Data Model Changes

- **`diagnostic-data.js`**: Add `quickAssessment: boolean` to each process object.
- **`diagnostic_results.processes` JSONB**: The field is stored alongside existing fields — no schema migration needed (JSONB is flexible).
- **`diagnostic-config.md`**: Add a `Quick` column to the markdown table.

---

## 3. Status Selection UX

**Priority: P0**

### User Story

> As a sales rep, I want to set any status in one click instead of cycling through 4 options, so I can accurately capture the prospect's response without multiple clicks during a live call.

### Current Behavior

In `ItemTable` within `DiagnosticResults.js`, clicking the status badge cycles through `STATUS_CYCLE = ['healthy', 'careful', 'warning', 'unable']`. Setting "warning" from "healthy" requires 3 clicks.

### Technical Approach

Replace the cycle button with a click-to-open popover showing all status options (including N/A — see Feature 4). Use a lightweight popover with absolute positioning.

**New component: `components/diagnostic/StatusPicker.js`**

```jsx
import { useState, useRef, useEffect } from 'react';
import { StatusBadge } from './StatusLegend';

const STATUSES = ['healthy', 'careful', 'warning', 'unable', 'na'];

export default function StatusPicker({ currentStatus, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function close(e) { if (!ref.current?.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: '1px dashed var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.2rem 0.4rem',
          cursor: 'pointer',
        }}
        title="Click to change status"
      >
        <StatusBadge status={currentStatus} />
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          background: 'white',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          padding: '0.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.15rem',
          minWidth: '120px',
          marginTop: '4px',
        }}>
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { onChange(s); setOpen(false); }}
              style={{
                background: s === currentStatus ? 'var(--bg-subtle)' : 'transparent',
                border: 'none',
                padding: '0.35rem 0.5rem',
                cursor: 'pointer',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'left',
              }}
            >
              <StatusBadge status={s} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Integration in `ItemTable`:**

Replace the status cycle button:

```jsx
// Before:
<button onClick={() => { /* cycle logic */ }}>
  <StatusBadge status={item.status} />
</button>

// After:
<StatusPicker
  currentStatus={item.status}
  onChange={(newStatus) => onStatusChange(item.name, newStatus)}
/>
```

### Data Model Changes

None (the `na` status is covered in Feature 4).

---

## 4. "Not Applicable" Status

**Priority: P0**

### User Story

> As a sales rep, I want to mark processes as "Not Applicable" when they don't apply to this prospect's business, so they don't count as negative findings and don't skew the health overview.

### Current Behavior

The only option for irrelevant items is "unable to report" which looks negative (black dot) and counts in the health distribution. There are exactly 4 statuses: `healthy`, `careful`, `warning`, `unable`.

### Technical Approach

Add `na` as a fifth status. It renders as a gray "N/A" badge and is excluded from health calculations.

**`StatusLegend.js` changes:**

```js
const STATUS_CONFIG = {
  healthy: { cssVar: '--status-healthy', label: 'Healthy' },
  careful: { cssVar: '--status-careful', label: 'Careful' },
  warning: { cssVar: '--status-warning', label: 'Warning' },
  unable:  { cssVar: '--status-unable',  label: 'Unable' },
  na:      { cssVar: '--status-na',      label: 'N/A' },
};
```

**Add CSS variable in `styles/globals.css`:**

```css
:root {
  --status-na: #d1d5db; /* gray-300 */
}
```

**Update `countStatuses` in `diagnostic-registry.js`:**

```js
export function countStatuses(items) {
  const counts = { healthy: 0, careful: 0, warning: 0, unable: 0, na: 0 };
  items.forEach(item => {
    const s = item.status || 'unable';
    if (counts.hasOwnProperty(s)) counts[s]++;
  });
  return counts;
}
```

**Exclude N/A from health scoring:**

Anywhere health percentages or overall ratings are computed, filter out `na` items:

```js
const scorableItems = processes.filter(p => p.status !== 'na');
const scorableStats = countStatuses(scorableItems);
```

The Health Overview section in `DiagnosticResults.js` should show N/A as a separate muted count outside the main distribution, e.g., _"5 items marked N/A"_.

**SOW from-diagnostic API** (`pages/api/sow/from-diagnostic.js`): Exclude `na` items when computing `overall_rating`.

### Data Model Changes

- **`diagnostic_results.processes` JSONB**: `status` field now accepts `"na"` as a value. No schema change needed (it's a string in JSONB).
- **`STATUS_CYCLE` in `DiagnosticResults.js`**: Removed (replaced by StatusPicker in Feature 3).

---

## 5. Power10 Metrics Editing

**Priority: P1**

### User Story

> As a sales rep, I want to edit the Power10 metrics' `ableToReport` and `statusAgainstPlan` values during a call, so the metrics tab reflects the prospect's actual state instead of static defaults.

### Current Behavior

The Power10 tab in `DiagnosticResults.js` renders metrics from `config.power10Metrics` as read-only cards with two status dots (Report, Plan). There is no edit mode for metrics — only `processes` and `tools` support editing.

### Technical Approach

Store Power10 metrics in the `diagnostic_results` row alongside processes. Add edit controls to the metrics grid when edit mode is active.

**Add `metrics` to `diagnostic_results`:**

The existing `diagnostic_results` table stores `processes` (JSONB) and `tools` (JSONB). Add saving/loading of metrics in the same row. Since the column doesn't exist yet, either:
- Add a `metrics JSONB` column, or
- Store metrics inside the existing `processes` JSONB under a `__metrics` key (simpler, no migration).

**Recommended: add column.**

```sql
ALTER TABLE diagnostic_results ADD COLUMN metrics JSONB DEFAULT '[]';
```

**State management in `DiagnosticResults.js`:**

```js
const [editableMetrics, setEditableMetrics] = useState(null);
const metrics = editableMetrics || power10Data;

function handleMetricChange(metricName, field, newStatus) {
  const updated = metrics.map(m =>
    m.name === metricName ? { ...m, [field]: newStatus } : m
  );
  setEditableMetrics(updated);
  scheduleSave(editableProcesses, editableTools, updated);
}
```

**Edit UI on the Power10 tab:**

Replace the static `StatusDot` with `StatusPicker` when in edit mode:

```jsx
{power10Data.map((metric) => (
  <div key={metric.name} style={{ /* existing card styles */ }}>
    <span>{metric.name}</span>
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Report</div>
        {editMode ? (
          <StatusPicker
            currentStatus={metric.ableToReport || 'unable'}
            onChange={(s) => handleMetricChange(metric.name, 'ableToReport', s)}
          />
        ) : (
          <StatusDot status={metric.ableToReport || 'unable'} />
        )}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Plan</div>
        {editMode ? (
          <StatusPicker
            currentStatus={metric.statusAgainstPlan || 'unable'}
            onChange={(s) => handleMetricChange(metric.name, 'statusAgainstPlan', s)}
          />
        ) : (
          <StatusDot status={metric.statusAgainstPlan || 'unable'} />
        )}
      </div>
    </div>
  </div>
))}
```

**API changes (`pages/api/diagnostics/[type].js`):**

Accept `metrics` in PUT body, include in the upsert. Return `metrics` in GET response.

### Data Model Changes

- **New column:** `diagnostic_results.metrics JSONB DEFAULT '[]'`
- **API:** `GET/PUT /api/diagnostics/[type]` — include `metrics` field.

---

## 6. Edit History / Audit Trail

**Priority: P2**

### User Story

> As a sales manager, I want to see who changed a diagnostic item's status and when, so I can review the assessment history and catch accidental changes.

### Current Behavior

No change tracking. The `diagnostic_results` table stores only current state. Notes have `author` and `created_at` but process status changes are untracked.

### Technical Approach

Create a `diagnostic_audit_log` table. Write an entry on every status or priority change.

**Schema:**

```sql
CREATE TABLE diagnostic_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnostic_result_id UUID NOT NULL REFERENCES diagnostic_results(id) ON DELETE CASCADE,
  process_name TEXT NOT NULL,
  field TEXT NOT NULL,           -- 'status', 'addToEngagement', 'ableToReport', 'statusAgainstPlan'
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT NOT NULL,      -- user name or email
  changed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_log_result ON diagnostic_audit_log(diagnostic_result_id);
CREATE INDEX idx_audit_log_process ON diagnostic_audit_log(process_name);
```

**API: `POST /api/diagnostics/audit`**

Called from the PUT handler. When the API receives updated processes, diff against the current DB state and insert audit rows for any changed fields.

```js
// In pages/api/diagnostics/[type].js PUT handler:
async function recordChanges(resultId, oldProcesses, newProcesses, changedBy) {
  const changes = [];
  const oldMap = Object.fromEntries(oldProcesses.map(p => [p.name, p]));
  for (const proc of newProcesses) {
    const old = oldMap[proc.name];
    if (!old) continue;
    if (old.status !== proc.status) {
      changes.push({
        diagnostic_result_id: resultId,
        process_name: proc.name,
        field: 'status',
        old_value: old.status,
        new_value: proc.status,
        changed_by: changedBy,
      });
    }
    if (old.addToEngagement !== proc.addToEngagement) {
      changes.push({
        diagnostic_result_id: resultId,
        process_name: proc.name,
        field: 'addToEngagement',
        old_value: String(old.addToEngagement),
        new_value: String(proc.addToEngagement),
        changed_by: changedBy,
      });
    }
  }
  if (changes.length > 0) {
    await supabaseAdmin.from('diagnostic_audit_log').insert(changes);
  }
}
```

**UI: History icon per row in `ItemTable`**

In edit mode, show a small clock icon next to the notes button. Clicking it opens a mini drawer showing the change log for that process item.

```jsx
// Fetch audit log for a process:
const [auditLog, setAuditLog] = useState([]);
// GET /api/diagnostics/audit?resultId=xxx&processName=yyy
```

**Display format per entry:**
> `jake@leanscale.team` changed status from **Healthy** → **Warning** — _Feb 11, 2026 3:04 PM_

### Data Model Changes

- **New table:** `diagnostic_audit_log` (see schema above).
- **New API:** `GET /api/diagnostics/audit?resultId=&processName=` and write-side integrated into existing PUT.

---

## 7. Diagnostic PDF Export

**Priority: P1**

### User Story

> As a sales rep, I want to export the diagnostic results as a branded PDF after a call so I can email it to the prospect without requiring them to log in.

### Current Behavior

PDF export exists only for SOWs via `@react-pdf/renderer` in `SowPdfDocument.js`. There is no diagnostic PDF export.

### Technical Approach

Create a `DiagnosticPdfDocument` component using `@react-pdf/renderer` and an API route to generate the PDF.

**New component: `components/diagnostic/DiagnosticPdfDocument.js`**

```jsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10 },
  header: { backgroundColor: '#1e1b4b', color: 'white', padding: 20, marginBottom: 20, borderRadius: 4 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 10, color: '#c4b5fd' },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  row: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb' },
  nameCol: { flex: 3 },
  funcCol: { flex: 2, color: '#6b7280' },
  statusCol: { flex: 1, textAlign: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  summaryBox: { flexDirection: 'row', gap: 16, marginBottom: 16, padding: 12, backgroundColor: '#f3f4f6', borderRadius: 4 },
  statItem: { textAlign: 'center' },
  statNum: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 8, color: '#6b7280' },
});

const STATUS_COLORS = {
  healthy: '#22c55e', careful: '#eab308', warning: '#ef4444', unable: '#1f2937', na: '#d1d5db',
};

export default function DiagnosticPdfDocument({ diagnostic, customerName, diagnosticType }) {
  const processes = diagnostic.processes || [];
  const stats = { healthy: 0, careful: 0, warning: 0, unable: 0, na: 0 };
  processes.forEach(p => { if (stats.hasOwnProperty(p.status)) stats[p.status]++; });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{customerName} — {diagnosticType.toUpperCase()} Diagnostic</Text>
          <Text style={styles.subtitle}>Generated {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.summaryBox}>
          {Object.entries(stats).filter(([,v]) => v > 0).map(([status, count]) => (
            <View key={status} style={styles.statItem}>
              <Text style={[styles.statNum, { color: STATUS_COLORS[status] }]}>{count}</Text>
              <Text style={styles.statLabel}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Process Health Assessment</Text>
        <View style={styles.row}>
          <Text style={[styles.nameCol, { fontWeight: 'bold' }]}>Process</Text>
          <Text style={[styles.funcCol, { fontWeight: 'bold' }]}>Function</Text>
          <Text style={[styles.statusCol, { fontWeight: 'bold' }]}>Status</Text>
        </View>
        {processes.map((p, i) => (
          <View key={i} style={[styles.row, { backgroundColor: i % 2 === 0 ? '#ffffff' : '#f9fafb' }]}>
            <Text style={styles.nameCol}>{p.name}</Text>
            <Text style={styles.funcCol}>{p.function || '-'}</Text>
            <Text style={[styles.statusCol, { color: STATUS_COLORS[p.status] || '#9ca3af' }]}>
              {(p.status || 'unable').charAt(0).toUpperCase() + (p.status || 'unable').slice(1)}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
```

**New API route: `pages/api/diagnostics/export-pdf.js`**

```js
import { renderToBuffer } from '@react-pdf/renderer';
import DiagnosticPdfDocument from '../../components/diagnostic/DiagnosticPdfDocument';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { diagnosticResultId, customerId, customerName, diagnosticType } = req.body;

  // Fetch diagnostic data from DB
  const { data } = await supabaseAdmin
    .from('diagnostic_results')
    .select('*')
    .eq('id', diagnosticResultId)
    .single();

  const buffer = await renderToBuffer(
    <DiagnosticPdfDocument
      diagnostic={data}
      customerName={customerName}
      diagnosticType={diagnosticType}
    />
  );

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${customerName}-${diagnosticType}-diagnostic.pdf"`);
  res.send(Buffer.from(buffer));
}
```

**UI: Add "Export PDF" button** next to "Build SOW" in `DiagnosticResults.js`:

```jsx
{diagnosticResultId && (
  <button
    onClick={async () => {
      const res = await fetch('/api/diagnostics/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosticResultId,
          customerId: customer.id,
          customerName: customer.customerName,
          diagnosticType,
        }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${customer.customerName}-${diagnosticType}-diagnostic.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }}
    style={{
      padding: '0.4rem 1rem',
      fontSize: '0.8rem',
      background: 'var(--bg-subtle)',
      color: 'var(--text-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
    }}
  >
    📄 Export PDF
  </button>
)}
```

### Data Model Changes

None.

---

## 8. Read-Only View

**Priority: P1**

### User Story

> As a customer viewing my diagnostic results, I want to see a polished read-only view without edit controls, import buttons, or "Build SOW" options, so the experience feels professional.

### Current Behavior

All users see the same `DiagnosticResults` component. Non-demo customers see Edit Mode, Import Markdown, and Build SOW buttons. There's no role distinction.

### Technical Approach

Add a `viewMode` prop to `DiagnosticResults` and a URL query parameter `?view=readonly`. When the customer portal renders the diagnostic, it passes `viewMode="readonly"`.

**Changes in `DiagnosticResults.js`:**

```jsx
export default function DiagnosticResults({ diagnosticType, viewMode = 'full' }) {
  const isReadOnly = viewMode === 'readonly';
  // ...

  // Hide all edit controls when read-only:
  // - Edit Mode button: hidden
  // - Import Markdown button: hidden
  // - Build SOW button: hidden
  // - StatusPicker: replaced with static StatusBadge
  // - Priority toggle: replaced with static badge
  // - Notes column: hidden (or show read-only notes via NoteDrawer with readOnly=true)
```

**Dedicated read-only page route: `pages/try-leanscale/diagnostic-view.js`**

```jsx
import DiagnosticResults from '../../components/diagnostic/DiagnosticResults';

export default function DiagnosticReadOnlyView() {
  return <DiagnosticResults diagnosticType="gtm" viewMode="readonly" />;
}
```

**Visual enhancements for read-only mode:**

- Hide the gray dashed edit borders around status badges
- Add a "Prepared for [Customer Name]" header with date
- Show a "Powered by LeanScale" footer
- Notes (if any) shown inline in a clean format via `NoteDrawer` with `readOnly={true}` (already supported)
- Replace the CTA banner with a softer "Want to learn more? Contact your LeanScale advisor" message

**URL-based sharing:**

A sales rep can share `https://app.leanscale.team/c/customer-slug/try-leanscale/diagnostic-view` — the customer sees the polished read-only version.

### Data Model Changes

None.

---

## 9. Mobile / Tablet Optimization

**Priority: P1**

### User Story

> As a sales rep using an iPad during an in-person meeting, I want the diagnostic table to be usable on a tablet-sized screen so I can run the assessment without needing a laptop.

### Current Behavior

The `<table>` in `ItemTable` requires horizontal scrolling on screens < 768px. The summary stats grid and Health Overview cards don't stack properly. Inline styles don't include responsive breakpoints.

### Technical Approach

Add responsive CSS classes and convert the table to a card-based layout on small screens. Since the codebase uses `globals.css` with CSS custom properties, add media queries there.

**`styles/globals.css` additions:**

```css
/* Diagnostic responsive */
@media (max-width: 768px) {
  .diagnostic-table table {
    display: none;
  }

  .diagnostic-table .mobile-cards {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .diagnostic-mobile-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: var(--bg-white);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
  }

  .diagnostic-mobile-card .card-name {
    font-weight: var(--font-medium);
    font-size: var(--text-sm);
    flex: 1;
  }

  .diagnostic-mobile-card .card-meta {
    font-size: var(--text-xs);
    color: var(--text-secondary);
  }

  .diagnostic-charts-row {
    flex-direction: column !important;
  }

  .diagnostic-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .power10-grid {
    grid-template-columns: 1fr !important;
  }
}

@media (min-width: 769px) {
  .diagnostic-table .mobile-cards {
    display: none;
  }
}
```

**`ItemTable` dual rendering:**

```jsx
function ItemTable({ items, editMode, ...props }) {
  return (
    <div className="diagnostic-table">
      {/* Desktop table */}
      <table className="data-table">
        {/* ... existing table markup ... */}
      </table>

      {/* Mobile card list */}
      <div className="mobile-cards">
        {items.map((item) => (
          <div key={item.name} className="diagnostic-mobile-card">
            <div>
              <div className="card-name">{item.name}</div>
              <div className="card-meta">{item.function || ''}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {item.addToEngagement && (
                <span style={{ fontSize: '0.65rem', background: 'var(--ls-lime-green)', color: 'var(--ls-purple)', padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: 600 }}>
                  Priority
                </span>
              )}
              {editMode ? (
                <StatusPicker currentStatus={item.status} onChange={(s) => props.onStatusChange(item.name, s)} />
              ) : (
                <StatusDot status={item.status} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Touch targets:** All interactive elements (status picker, priority toggle, note button) should be at minimum 44×44px on touch devices. The StatusPicker popover options should have generous padding (12px+).

### Data Model Changes

None.

---

## 10. Merge on Re-import

**Priority: P2**

### User Story

> As a sales rep, I want to re-import an updated markdown file without losing my manual edits (notes, status changes, priorities), so I can incorporate new process items from a template update while preserving my work.

### Current Behavior

In `MarkdownImport.js`, `handleConfirmImport` calls `onImport({ processes, tools })` which replaces `editableProcesses` entirely in `DiagnosticResults.js` and immediately saves. All prior edits are lost.

### Technical Approach

Add a merge step between parse and save. For each imported process, check if a matching process (by `name`) already exists with edits. Let the user choose per-conflict or apply a bulk strategy.

**Merge logic in `DiagnosticResults.js`:**

```js
function mergeImport(importedProcesses, existingProcesses) {
  const existingMap = Object.fromEntries(existingProcesses.map(p => [p.name, p]));
  const merged = [];
  const conflicts = [];

  for (const imported of importedProcesses) {
    const existing = existingMap[imported.name];
    if (!existing) {
      // New item — add as-is
      merged.push(imported);
    } else if (existing.status === imported.status && existing.addToEngagement === imported.addToEngagement) {
      // No conflict — keep existing (preserves any extra fields like notes references)
      merged.push(existing);
    } else {
      // Conflict — track for resolution
      conflicts.push({ imported, existing });
      merged.push(existing); // Default: keep existing
    }
    delete existingMap[imported.name];
  }

  // Items in existing but not in import — keep them (they might be custom additions)
  for (const remaining of Object.values(existingMap)) {
    merged.push(remaining);
  }

  return { merged, conflicts };
}
```

**Merge UI in `MarkdownImport.js`:**

After parsing, if conflicts exist, show a conflict resolution panel:

```jsx
{conflicts.length > 0 && (
  <div style={{ marginTop: '1rem', border: '1px solid #f59e0b', borderRadius: '8px', padding: '1rem' }}>
    <h4>⚠️ {conflicts.length} Conflicts</h4>
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
      <button onClick={() => resolveAll('keep')}>Keep All Existing</button>
      <button onClick={() => resolveAll('import')}>Use All Imported</button>
    </div>
    {conflicts.map(({ imported, existing }) => (
      <div key={imported.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
        <span>{imported.name}</span>
        <div>
          <span>Existing: <StatusBadge status={existing.status} /></span>
          <span> → Imported: <StatusBadge status={imported.status} /></span>
          <button onClick={() => resolveOne(imported.name, 'keep')}>Keep</button>
          <button onClick={() => resolveOne(imported.name, 'import')}>Import</button>
        </div>
      </div>
    ))}
  </div>
)}
```

**Merge strategies:**
- **Keep existing** (default): Imported data fills only new items; existing edits are untouched.
- **Use imported**: Overwrites status/priority from the import file.
- **Per-item**: User decides for each conflict.

Notes are never affected by import — they live in a separate table (`diagnostic_notes`) keyed by `process_name`, so they survive any process array replacement.

### Data Model Changes

None — this is purely client-side merge logic before the save call.

---

## Implementation Order

| Phase | Features | Effort |
|-------|----------|--------|
| **Phase 1 (Sprint 1)** | #3 Status Selection UX, #4 N/A Status, #1 Search & Filter | ~3 days |
| **Phase 2 (Sprint 1)** | #2 Quick Assessment Mode, #5 Power10 Editing | ~2 days |
| **Phase 3 (Sprint 2)** | #7 PDF Export, #8 Read-Only View | ~3 days |
| **Phase 4 (Sprint 2)** | #9 Mobile/Tablet, #10 Merge on Re-import | ~3 days |
| **Phase 5 (Sprint 3)** | #6 Edit History/Audit Trail | ~2 days |

**Total estimated effort: ~13 dev-days**

---

## Dependencies

- Features 3 and 4 should ship together (StatusPicker includes N/A option).
- Feature 1 (Search & Filter) works independently but pairs well with Feature 2 (Quick Mode).
- Feature 7 (PDF Export) can reuse patterns from existing `SowPdfDocument.js`.
- Feature 8 (Read-Only View) depends on Feature 4 (N/A status) for complete display logic.
- Feature 6 (Audit Trail) requires a DB migration and can be deferred.
