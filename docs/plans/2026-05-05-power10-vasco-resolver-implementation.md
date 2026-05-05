# Power 10 Vasco Resolver Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Auto-fill the v3 diagnostic Section E Power 10 questions from the latest `vasco_snapshots` row when one exists, display the actual value alongside, allow user override, and persist actuals on the saved diagnostic result.

**Architecture:** New `lib/vasco/power10-resolver.js` reads a snapshot row and returns `{ D5_*: { available, value, formatted, source, asOf, stale } }`. New API `GET /api/diagnostic/intake/vasco-power10?customerId=…` exposes the resolver to the intake UI. `SectionE_Reporting.js` accepts a `vascoPower10` prop, uses each metric's `formatted` as a "From Vasco" badge, and pre-selects `Automated` (still overridable). `lib/diagnostics.js` extends each `power10_metrics` entry with `vascoValue`, `vascoFormatted`, `vascoSource`, `userOverride`. A new migration adds `recurring_revenue_changes JSONB` to `vasco_snapshots`; the Vasco sync routine prompt (held outside the repo in the Claude Code RemoteTrigger config) is updated to populate it.

**Tech Stack:** Next.js 14 (Pages Router), Jest, Supabase (Postgres, JSONB), React.

**Scope:** v3 only. RP-5 grader logic stays the same — auto-filled `Automated` answers naturally raise `power10_metrics_count`.

**Design doc:** [`docs/plans/2026-05-05-power10-vasco-resolver-design.md`](./2026-05-05-power10-vasco-resolver-design.md)

---

## Pre-flight

- Worktree: `.worktrees/power10-vasco-resolver` on branch `feature/power10-vasco-resolver` (off `origin/main` @ 711bce3).
- Baseline `npm test`: 883 passing / 57 failing — all 57 failures are pre-existing on `main`, none in Vasco / Power 10 / `lib/diagnostic-engine/v3/` / `components/diagnostic-intake/`. Verify after each task that no new files in scope regress.

---

## Task 1: Resolver — D5_arr (smallest possible test slice)

**Files:**
- Create: `lib/vasco/power10-resolver.js`
- Create: `__tests__/lib/vasco-power10-resolver.test.js`

**Step 1: Write the failing test**

```javascript
// __tests__/lib/vasco-power10-resolver.test.js
import { resolvePower10FromSnapshot } from '../../lib/vasco/power10-resolver';

describe('resolvePower10FromSnapshot — D5_arr', () => {
  test('returns ARR from latest full month net_arr', () => {
    const snapshot = {
      snapshot_date: '2026-04-30',
      volume_metrics: {
        data: [
          { month: '2026-02', net_arr: 1000000 },
          { month: '2026-03', net_arr: 1100000 }, // latest full
          { month: '2026-04', net_arr: 1234567 }, // partial — skipped
        ],
      },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_arr).toEqual({
      name: 'ARR',
      available: true,
      value: 1100000,
      formatted: '$1.1M',
      source: 'volume_metrics.net_arr',
      asOf: '2026-03',
      stale: false,
    });
  });

  test('returns empty object when snapshot is null', () => {
    expect(resolvePower10FromSnapshot(null)).toEqual({});
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest __tests__/lib/vasco-power10-resolver.test.js`
Expected: FAIL with "Cannot find module '../../lib/vasco/power10-resolver'"

**Step 3: Write minimal implementation**

```javascript
// lib/vasco/power10-resolver.js

const STALE_DAYS = 90;

function pickLatestFullMonth(data) {
  if (!Array.isArray(data) || data.length === 0) return null;
  if (data.length === 1) return data[0];
  return data[data.length - 2];
}

function isStale(snapshotDate) {
  if (!snapshotDate) return false;
  const ageMs = Date.now() - new Date(snapshotDate).getTime();
  return ageMs > STALE_DAYS * 24 * 60 * 60 * 1000;
}

function formatCurrency(value) {
  if (value == null) return null;
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
}

export function resolvePower10FromSnapshot(snapshot) {
  if (!snapshot) return {};
  const stale = isStale(snapshot.snapshot_date);
  const volumeData = snapshot.volume_metrics?.data || [];
  const latest = pickLatestFullMonth(volumeData);

  const out = {};

  if (latest?.net_arr != null) {
    out.D5_arr = {
      name: 'ARR',
      available: true,
      value: latest.net_arr,
      formatted: formatCurrency(latest.net_arr),
      source: 'volume_metrics.net_arr',
      asOf: latest.month || null,
      stale,
    };
  }

  return out;
}
```

**Step 4: Run test to verify it passes**

Run: `npx jest __tests__/lib/vasco-power10-resolver.test.js`
Expected: PASS, 2 tests.

**Step 5: Commit**

```bash
git add lib/vasco/power10-resolver.js __tests__/lib/vasco-power10-resolver.test.js
git commit -m "feat(vasco): power10 resolver scaffold + D5_arr"
```

---

## Task 2: Resolver — Volume + time-in-stage metrics (D5_bookings, D5_mql, D5_mql_opp, D5_pipeline, D5_opp_cw, D5_cycle)

**Files:**
- Modify: `lib/vasco/power10-resolver.js`
- Modify: `__tests__/lib/vasco-power10-resolver.test.js`

**Step 1: Write the failing tests**

Append to the test file:

```javascript
describe('resolvePower10FromSnapshot — volume + tis metrics', () => {
  const fullSnapshot = {
    snapshot_date: '2026-04-30',
    volume_metrics: {
      data: [
        { month: '2026-02', net_arr: 1, amount_won: 1, mqls: 1, cvr_mql_sql: 0, sqls: 1, amount_sqls: 1, cvr_sal_won: 0 },
        {
          month: '2026-03',
          net_arr: 1100000,
          amount_won: 340000,
          mqls: 142,
          cvr_mql_sql: 0.18,
          sqls: 47,
          amount_sqls: 890000,
          cvr_sal_won: 0.22,
        },
        { month: '2026-04', net_arr: 9, amount_won: 9, mqls: 9, cvr_mql_sql: 0, sqls: 9, amount_sqls: 9, cvr_sal_won: 0 },
      ],
    },
    time_in_stage: {
      data: [
        { month: '2026-02', sal_to_won_days: 99 },
        { month: '2026-03', sal_to_won_days: 54 },
        { month: '2026-04', sal_to_won_days: 1 },
      ],
    },
  };

  test('D5_bookings from amount_won', () => {
    expect(resolvePower10FromSnapshot(fullSnapshot).D5_bookings).toMatchObject({
      available: true, value: 340000, formatted: '$340K', source: 'volume_metrics.amount_won',
    });
  });

  test('D5_mql from mqls count', () => {
    expect(resolvePower10FromSnapshot(fullSnapshot).D5_mql).toMatchObject({
      available: true, value: 142, formatted: '142', source: 'volume_metrics.mqls',
    });
  });

  test('D5_mql_opp from cvr_mql_sql as percentage', () => {
    expect(resolvePower10FromSnapshot(fullSnapshot).D5_mql_opp).toMatchObject({
      available: true, value: 0.18, formatted: '18%', source: 'volume_metrics.cvr_mql_sql',
    });
  });

  test('D5_pipeline as composite count + amount', () => {
    expect(resolvePower10FromSnapshot(fullSnapshot).D5_pipeline).toMatchObject({
      available: true,
      value: { count: 47, amount: 890000 },
      formatted: '47 / $890K',
      source: 'volume_metrics.sqls + amount_sqls',
    });
  });

  test('D5_opp_cw from cvr_sal_won as percentage', () => {
    expect(resolvePower10FromSnapshot(fullSnapshot).D5_opp_cw).toMatchObject({
      available: true, value: 0.22, formatted: '22%', source: 'volume_metrics.cvr_sal_won',
    });
  });

  test('D5_cycle from sal_to_won_days as days', () => {
    expect(resolvePower10FromSnapshot(fullSnapshot).D5_cycle).toMatchObject({
      available: true, value: 54, formatted: '54 days', source: 'time_in_stage.sal_to_won_days',
    });
  });

  test('returns no entry when underlying field missing', () => {
    const out = resolvePower10FromSnapshot({ snapshot_date: '2026-04-30', volume_metrics: { data: [{ month: '2026-03' }] } });
    expect(out.D5_bookings).toBeUndefined();
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx jest __tests__/lib/vasco-power10-resolver.test.js`
Expected: 6 new tests fail (undefined entries).

**Step 3: Extend implementation**

Add helpers + 6 metric blocks. After the D5_arr block in `resolvePower10FromSnapshot`:

```javascript
function formatNumber(n) {
  if (n == null) return null;
  return String(Math.round(n));
}

function formatPct(n) {
  if (n == null) return null;
  return `${Math.round(n * 100)}%`;
}

function formatDays(n) {
  if (n == null) return null;
  return `${Math.round(n)} days`;
}
```

```javascript
// inside resolvePower10FromSnapshot, after the D5_arr block:

if (latest?.amount_won != null) {
  out.D5_bookings = {
    name: 'Bookings',
    available: true,
    value: latest.amount_won,
    formatted: formatCurrency(latest.amount_won),
    source: 'volume_metrics.amount_won',
    asOf: latest.month || null,
    stale,
  };
}

if (latest?.mqls != null) {
  out.D5_mql = {
    name: 'MQL production',
    available: true,
    value: latest.mqls,
    formatted: formatNumber(latest.mqls),
    source: 'volume_metrics.mqls',
    asOf: latest.month || null,
    stale,
  };
}

if (latest?.cvr_mql_sql != null) {
  out.D5_mql_opp = {
    name: 'MQL → Opportunity conversion rate',
    available: true,
    value: latest.cvr_mql_sql,
    formatted: formatPct(latest.cvr_mql_sql),
    source: 'volume_metrics.cvr_mql_sql',
    asOf: latest.month || null,
    stale,
  };
}

if (latest?.sqls != null && latest?.amount_sqls != null) {
  out.D5_pipeline = {
    name: 'Pipeline production',
    available: true,
    value: { count: latest.sqls, amount: latest.amount_sqls },
    formatted: `${latest.sqls} / ${formatCurrency(latest.amount_sqls)}`,
    source: 'volume_metrics.sqls + amount_sqls',
    asOf: latest.month || null,
    stale,
  };
}

if (latest?.cvr_sal_won != null) {
  out.D5_opp_cw = {
    name: 'Opportunity → CW conversion rate',
    available: true,
    value: latest.cvr_sal_won,
    formatted: formatPct(latest.cvr_sal_won),
    source: 'volume_metrics.cvr_sal_won',
    asOf: latest.month || null,
    stale,
  };
}

const tisData = snapshot.time_in_stage?.data || [];
const latestTis = pickLatestFullMonth(tisData);
if (latestTis?.sal_to_won_days != null) {
  out.D5_cycle = {
    name: 'Opportunity/Deal CW cycle time',
    available: true,
    value: latestTis.sal_to_won_days,
    formatted: formatDays(latestTis.sal_to_won_days),
    source: 'time_in_stage.sal_to_won_days',
    asOf: latestTis.month || null,
    stale,
  };
}
```

**Step 4: Run tests to verify they pass**

Run: `npx jest __tests__/lib/vasco-power10-resolver.test.js`
Expected: 8 tests pass total.

**Step 5: Commit**

```bash
git add lib/vasco/power10-resolver.js __tests__/lib/vasco-power10-resolver.test.js
git commit -m "feat(vasco): power10 resolver — bookings, MQL, conversions, pipeline, cycle"
```

---

## Task 3: Resolver — Recurring revenue (D5_gross_churn, D5_grr, D5_nrr) with backwards-compat

**Files:**
- Modify: `lib/vasco/power10-resolver.js`
- Modify: `__tests__/lib/vasco-power10-resolver.test.js`

**Step 1: Write the failing tests**

Append:

```javascript
describe('resolvePower10FromSnapshot — recurring revenue', () => {
  test('returns available: false when recurring_revenue_changes column missing (legacy snapshot)', () => {
    const out = resolvePower10FromSnapshot({ snapshot_date: '2026-04-30', volume_metrics: { data: [{ month: '2026-03', net_arr: 1 }] } });
    expect(out.D5_gross_churn).toMatchObject({ available: false, source: 'recurring_revenue_changes (not synced for this snapshot)' });
    expect(out.D5_grr).toMatchObject({ available: false });
    expect(out.D5_nrr).toMatchObject({ available: false });
  });

  test('computes churn / GRR / NRR from monthly deltas + balances', () => {
    // Period: 2026-03. Start MRR = 50000.
    // RETENTION deltas in 2026-03: -1000 (churn loss) + +200 (re-up adjustment) — net = -800.
    // EXPANSION deltas in 2026-03: +2400.
    // Gross churn = 1000 / 50000 = 2.0% → GRR = 98%
    // NRR = (50000 - 800 + 2400) / 50000 = 51600/50000 = 103.2% → "103%"
    const snapshot = {
      snapshot_date: '2026-04-30',
      volume_metrics: { data: [{ month: '2026-03', net_arr: 1 }] },
      recurring_revenue_changes: {
        period: '2026-03',
        balances: {
          start_of_period: { date: '2026-03-01', mrr: 50000, customers: 42 },
          end_of_period: { date: '2026-04-01', mrr: 51600, customers: 43 },
        },
        monthly: [
          { month: '2026-03', phase: 'RETENTION', recurring_revenue_actuals: -1000, recurring_customers_actuals: -1 },
          { month: '2026-03', phase: 'RETENTION', recurring_revenue_actuals: 200, recurring_customers_actuals: 0 },
          { month: '2026-03', phase: 'EXPANSION', recurring_revenue_actuals: 2400, recurring_customers_actuals: 0 },
          { month: '2026-03', phase: 'ACQUISITION', recurring_revenue_actuals: 5000, recurring_customers_actuals: 1 }, // ignored
          { month: '2026-02', phase: 'RETENTION', recurring_revenue_actuals: -9999, recurring_customers_actuals: 0 }, // ignored — different period
        ],
      },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_gross_churn).toMatchObject({ available: true, value: 0.02, formatted: '2%', source: 'recurring_revenue_changes' });
    expect(out.D5_grr).toMatchObject({ available: true, value: 0.98, formatted: '98%', source: 'recurring_revenue_changes' });
    expect(out.D5_nrr).toMatchObject({ available: true, value: 1.032, formatted: '103%', source: 'recurring_revenue_changes' });
  });

  test('returns available: false when start_of_period mrr is 0', () => {
    const snapshot = {
      snapshot_date: '2026-04-30',
      volume_metrics: { data: [{ month: '2026-03', net_arr: 1 }] },
      recurring_revenue_changes: {
        period: '2026-03',
        balances: { start_of_period: { date: '2026-03-01', mrr: 0, customers: 0 }, end_of_period: { date: '2026-04-01', mrr: 1, customers: 1 } },
        monthly: [],
      },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_gross_churn).toMatchObject({ available: false });
    expect(out.D5_grr).toMatchObject({ available: false });
    expect(out.D5_nrr).toMatchObject({ available: false });
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npx jest __tests__/lib/vasco-power10-resolver.test.js`
Expected: 3 new tests fail.

**Step 3: Extend implementation**

Add to `resolvePower10FromSnapshot` after the volume/tis blocks:

```javascript
const rrc = snapshot.recurring_revenue_changes;

function unavailableRetention(reason) {
  return {
    name: '',
    available: false,
    value: null,
    formatted: null,
    source: reason,
    asOf: null,
    stale,
  };
}

if (!rrc) {
  const reason = 'recurring_revenue_changes (not synced for this snapshot)';
  out.D5_gross_churn = { ...unavailableRetention(reason), name: 'Gross churn' };
  out.D5_grr = { ...unavailableRetention(reason), name: 'Gross retention' };
  out.D5_nrr = { ...unavailableRetention(reason), name: 'Net retention' };
} else {
  const startMrr = rrc.balances?.start_of_period?.mrr;
  const period = rrc.period || null;
  if (!startMrr || startMrr <= 0) {
    const reason = 'recurring_revenue_changes (start-of-period MRR is 0)';
    out.D5_gross_churn = { ...unavailableRetention(reason), name: 'Gross churn', asOf: period };
    out.D5_grr = { ...unavailableRetention(reason), name: 'Gross retention', asOf: period };
    out.D5_nrr = { ...unavailableRetention(reason), name: 'Net retention', asOf: period };
  } else {
    const periodRows = (rrc.monthly || []).filter(r => r.month === period);
    const retentionLoss = periodRows
      .filter(r => r.phase === 'RETENTION' && r.recurring_revenue_actuals < 0)
      .reduce((s, r) => s + r.recurring_revenue_actuals, 0); // negative number
    const retentionNet = periodRows
      .filter(r => r.phase === 'RETENTION')
      .reduce((s, r) => s + r.recurring_revenue_actuals, 0);
    const expansionNet = periodRows
      .filter(r => r.phase === 'EXPANSION')
      .reduce((s, r) => s + r.recurring_revenue_actuals, 0);

    const grossChurn = -retentionLoss / startMrr; // positive %
    const grr = 1 - grossChurn;
    const nrr = (startMrr + retentionNet + expansionNet) / startMrr;

    out.D5_gross_churn = {
      name: 'Gross churn',
      available: true,
      value: Math.round(grossChurn * 1000) / 1000,
      formatted: formatPct(grossChurn),
      source: 'recurring_revenue_changes',
      asOf: period,
      stale,
    };
    out.D5_grr = {
      name: 'Gross retention',
      available: true,
      value: Math.round(grr * 1000) / 1000,
      formatted: formatPct(grr),
      source: 'recurring_revenue_changes',
      asOf: period,
      stale,
    };
    out.D5_nrr = {
      name: 'Net retention',
      available: true,
      value: Math.round(nrr * 1000) / 1000,
      formatted: formatPct(nrr),
      source: 'recurring_revenue_changes',
      asOf: period,
      stale,
    };
  }
}
```

**Step 4: Run tests to verify they pass**

Run: `npx jest __tests__/lib/vasco-power10-resolver.test.js`
Expected: 11 tests pass.

**Step 5: Commit**

```bash
git add lib/vasco/power10-resolver.js __tests__/lib/vasco-power10-resolver.test.js
git commit -m "feat(vasco): power10 resolver — gross churn, GRR, NRR with backwards-compat"
```

---

## Task 4: Resolver — Stale snapshot flag

**Files:**
- Modify: `__tests__/lib/vasco-power10-resolver.test.js`

**Step 1: Write the failing test**

```javascript
describe('resolvePower10FromSnapshot — staleness', () => {
  test('marks all available metrics as stale when snapshot_date > 90 days ago', () => {
    const oldDate = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString();
    const snapshot = {
      snapshot_date: oldDate,
      volume_metrics: { data: [{ month: '2026-01', net_arr: 1000000 }] }, // single row → used as-is
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_arr.stale).toBe(true);
  });

  test('marks fresh snapshot as stale: false', () => {
    const recent = new Date().toISOString();
    const snapshot = {
      snapshot_date: recent,
      volume_metrics: { data: [{ month: '2026-04', net_arr: 1000000 }] },
    };
    expect(resolvePower10FromSnapshot(snapshot).D5_arr.stale).toBe(false);
  });
});
```

**Step 2: Run tests**

Run: `npx jest __tests__/lib/vasco-power10-resolver.test.js`
Expected: PASS — `isStale` is already implemented in Task 1; these tests just lock in the behavior.

**Step 3: Commit**

```bash
git add __tests__/lib/vasco-power10-resolver.test.js
git commit -m "test(vasco): power10 resolver — staleness behavior"
```

---

## Task 5: Migration — Add recurring_revenue_changes column

**Files:**
- Create: `supabase/migrations/026_vasco_recurring_revenue.sql`

**Step 1: Write the migration**

```sql
-- Add recurring_revenue_changes column to vasco_snapshots for churn / GRR / NRR computation.
-- Populated by the Vasco Data Sync routine (Step 2b §g + balance queries).
-- Shape: { period: 'YYYY-MM', monthly: [...], balances: { start_of_period, end_of_period } }
ALTER TABLE vasco_snapshots
  ADD COLUMN IF NOT EXISTS recurring_revenue_changes JSONB;
```

**Step 2: Verify SQL syntax (no apply)**

Run: `cat supabase/migrations/026_vasco_recurring_revenue.sql`
Expected: file prints. (Apply happens via Supabase deploy, not in this task.)

**Step 3: Commit**

```bash
git add supabase/migrations/026_vasco_recurring_revenue.sql
git commit -m "feat(db): add recurring_revenue_changes column to vasco_snapshots"
```

---

## Task 6: Intake API — `/api/diagnostic/intake/vasco-power10`

**Files:**
- Create: `pages/api/diagnostic/intake/vasco-power10.js`
- Create: `__tests__/api/diagnostic-intake-vasco-power10.test.js`

**Step 1: Write the failing test**

```javascript
import handler from '../../../pages/api/diagnostic/intake/vasco-power10';
import { resolvePower10FromSnapshot } from '../../../lib/vasco/power10-resolver';

jest.mock('../../../lib/supabase', () => {
  const single = jest.fn();
  const limit = jest.fn(() => ({ single }));
  const order = jest.fn(() => ({ limit }));
  const eq = jest.fn(() => ({ order }));
  const select = jest.fn(() => ({ eq }));
  const from = jest.fn(() => ({ select }));
  return { supabaseAdmin: { from }, __mocks: { single, limit, order, eq, select, from } };
});

const { __mocks } = require('../../../lib/supabase');

function mockReqRes({ method = 'GET', query = {} } = {}) {
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; return this; },
  };
  return [{ method, query }, res];
}

describe('/api/diagnostic/intake/vasco-power10', () => {
  beforeEach(() => jest.clearAllMocks());

  test('400 when customerId missing', async () => {
    const [req, res] = mockReqRes({ query: {} });
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  test('returns {} when no snapshot exists', async () => {
    __mocks.single.mockResolvedValue({ data: null, error: null });
    const [req, res] = mockReqRes({ query: { customerId: 'c-1' } });
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ vascoPower10: {} });
  });

  test('returns resolved metrics when snapshot exists', async () => {
    __mocks.single.mockResolvedValue({
      data: {
        snapshot_date: new Date().toISOString(),
        volume_metrics: { data: [{ month: '2026-03', net_arr: 1100000 }, { month: '2026-04', net_arr: 9 }] },
      },
      error: null,
    });
    const [req, res] = mockReqRes({ query: { customerId: 'c-1' } });
    await handler(req, res);
    expect(res.body.vascoPower10.D5_arr).toMatchObject({ available: true, formatted: '$1.1M' });
  });

  test('405 on non-GET', async () => {
    const [req, res] = mockReqRes({ method: 'POST', query: { customerId: 'c-1' } });
    await handler(req, res);
    expect(res.statusCode).toBe(405);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest __tests__/api/diagnostic-intake-vasco-power10.test.js`
Expected: FAIL — handler module doesn't exist.

**Step 3: Implement handler**

```javascript
// pages/api/diagnostic/intake/vasco-power10.js

import { supabaseAdmin } from '../../../../lib/supabase';
import { resolvePower10FromSnapshot } from '../../../../lib/vasco/power10-resolver';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.query;
  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const { data, error } = await supabaseAdmin
    .from('vasco_snapshots')
    .select('*')
    .eq('customer_id', customerId)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ vascoPower10: resolvePower10FromSnapshot(data) });
}
```

> **Note on path depth:** test imports `../../../pages/...` (test depth: `__tests__/api/file.js` → 3 levels up). Handler imports `../../../../lib/...` (handler depth: `pages/api/diagnostic/intake/file.js` → 4 levels up). Verify by running the tests.

**Step 4: Run test to verify it passes**

Run: `npx jest __tests__/api/diagnostic-intake-vasco-power10.test.js`
Expected: 4 tests pass.

**Step 5: Commit**

```bash
git add pages/api/diagnostic/intake/vasco-power10.js __tests__/api/diagnostic-intake-vasco-power10.test.js
git commit -m "feat(api): /api/diagnostic/intake/vasco-power10 endpoint"
```

---

## Task 7: SectionE — Accept vascoPower10 prop, render badge, auto-fill

**Files:**
- Modify: `components/diagnostic-intake/SectionE_Reporting.js`

**Step 1: Add the prop and pre-fill logic (no test — UI behavior covered by Task 9 e2e)**

Modify the function signature and `useState` initializer in `components/diagnostic-intake/SectionE_Reporting.js`:

```javascript
export default function SectionE_Reporting({ answers, skipRules, preFill = {}, vascoPower10 = {}, onComplete, onBack }) {
  // Filter reporting questions based on CRM-adaptive visibility
  const visibleReporting = REPORTING_QUESTIONS.filter((q) => {
    if (q.hideWhenAutoDetected && (skipRules.hasSalesforceSignals || skipRules.hasHubSpotSignals)) return false;
    return true;
  });

  const allQuestions = [...visibleReporting, ...POWER_10_METRICS.map((m) => ({ ...m, options: POWER_10_OPTIONS }))];
  const [local, setLocal] = useState(() => {
    const init = {};
    for (const q of [...REPORTING_QUESTIONS, ...POWER_10_METRICS.map((m) => ({ ...m, options: POWER_10_OPTIONS }))]) {
      // Priority: existing answer > Vasco auto-fill > Slack-form prefill > empty
      const vasco = vascoPower10[q.key];
      const vascoDefault = vasco?.available ? 'Automated' : '';
      init[q.key] = answers[q.key] || vascoDefault || preFill[q.key]?.value || '';
    }
    return init;
  });
  const [overridden, setOverridden] = useState(new Set());
```

Then in the Power 10 metric loop, render the actual-value badge below the option grid:

```javascript
      {POWER_10_METRICS.map((m) => {
        const vasco = vascoPower10[m.key];
        const showVascoBadge = vasco?.available && !overridden.has(m.key);
        return (
          <div key={m.key} style={styles.question}>
            <label style={styles.label}>{m.label}</label>
            <div style={styles.optionGrid}>
              {POWER_10_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(m.key, opt)}
                  style={{
                    ...styles.optionBtn,
                    ...(local[m.key] === opt ? styles.optionSelected : {}),
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {showVascoBadge && (
              <div style={styles.autoDetectedHint}>
                From Vasco: {vasco.formatted} ({vasco.asOf}){vasco.stale ? ' · stale' : ''}
              </div>
            )}
            {vasco && !vasco.available && vasco.source?.includes('not synced') && (
              <div style={{ ...styles.autoDetectedHint, background: '#FEF3C7', color: '#92400E' }}>
                Vasco snapshot doesn't include this metric yet
              </div>
            )}
          </div>
        );
      })}
```

**Step 2: Sanity check the render**

Run: `npx jest --testPathPattern='diagnostic-intake|SectionE'`
Expected: no new failures (no tests for this file today; just confirms it compiles).

Run: `npm run build 2>&1 | tail -20`
Expected: build succeeds (or fails identically to baseline). If it fails for an unrelated reason, note and continue.

**Step 3: Commit**

```bash
git add components/diagnostic-intake/SectionE_Reporting.js
git commit -m "feat(intake): SectionE accepts vascoPower10 prop, auto-fills + badges"
```

---

## Task 8: IntakeForm — Fetch vascoPower10 and pass to SectionE

**Files:**
- Modify: `components/diagnostic-intake/IntakeForm.js`

**Step 1: Add the fetch + state**

Inside the existing mount-time effect (around `loadExisting()` near line 76), after the intake answers fetch, add:

```javascript
        // Load Vasco Power 10 resolver output (best-effort — fall back to {} on any failure)
        try {
          const vRes = await fetch(`/api/diagnostic/intake/vasco-power10?customerId=${customer.id}`);
          if (vRes.ok) {
            const vData = await vRes.json();
            setVascoPower10(vData.vascoPower10 || {});
          }
        } catch (e) {
          // Non-fatal — Section E falls back to manual entry
        }
```

Add the state declaration with the other useState calls near line 58:

```javascript
  const [vascoPower10, setVascoPower10] = useState({});
```

Pass it to `<SectionE />` in the section render (around line 601):

```javascript
              <SectionE
                answers={answers}
                skipRules={skipRules}
                onComplete={(a) => handleSectionComplete('E', a)}
                onBack={handleBack}
                preFill={preFill}
                vascoPower10={vascoPower10}
              />
```

**Step 2: Build check**

Run: `npm run build 2>&1 | tail -10`
Expected: build succeeds.

**Step 3: Commit**

```bash
git add components/diagnostic-intake/IntakeForm.js
git commit -m "feat(intake): fetch + thread vascoPower10 into SectionE"
```

---

## Task 9: Persistence — Capture Vasco actuals on submit

**Files:**
- Modify: `lib/diagnostics.js` (specifically `upsertDiagnosticResult`)
- Modify: `lib/diagnostic-engine/v3/transform-intake.js` (no behavior change — just confirm the count still works)
- Modify: `__tests__/lib/diagnostic-engine.test.js` OR create new `__tests__/lib/diagnostics-power10.test.js`

**Step 1: Locate where SectionE answers get assembled into power10Metrics**

Run: `grep -n "power10Metrics\|power10_metrics" lib/diagnostics.js components/diagnostic-intake/IntakeForm.js`

In `IntakeForm.js`, at the point where the diagnostic submission payload is built (the call to `upsertDiagnosticResult`), build a richer `power10Metrics` array. Each entry:

```javascript
{
  name: <canonical name from data/diagnostic-data.js power10MetricNames>,
  key: 'D5_arr' | ... ,
  capability: answers[key], // 'Automated' | 'Manual calc' | "Can't report"
  vascoValue: vascoPower10[key]?.value ?? null,
  vascoFormatted: vascoPower10[key]?.formatted ?? null,
  vascoSource: vascoPower10[key]?.source ?? null,
  asOf: vascoPower10[key]?.asOf ?? null,
  userOverride: vascoPower10[key]?.available && answers[key] !== 'Automated',
}
```

Find the construction site:

Run: `grep -n "power10Metrics\|upsertDiagnosticResult" components/diagnostic-intake/IntakeForm.js`

Modify the array-build to include those fields.

**Step 2: Add a unit test for the persistence shape**

Create `__tests__/lib/build-power10-payload.test.js`:

```javascript
import { buildPower10Payload } from '../../lib/vasco/power10-resolver';

describe('buildPower10Payload', () => {
  test('marks userOverride when user answered something other than Automated for an available metric', () => {
    const answers = { D5_arr: 'Manual calc' };
    const vasco = { D5_arr: { name: 'ARR', available: true, value: 1, formatted: '$1', source: 'x', asOf: '2026-03', stale: false } };
    const out = buildPower10Payload(answers, vasco);
    expect(out.find(p => p.key === 'D5_arr')).toMatchObject({
      key: 'D5_arr', capability: 'Manual calc', vascoValue: 1, userOverride: true,
    });
  });

  test('userOverride false when user accepted Automated', () => {
    const answers = { D5_arr: 'Automated' };
    const vasco = { D5_arr: { name: 'ARR', available: true, value: 1, formatted: '$1', source: 'x', asOf: '2026-03', stale: false } };
    const out = buildPower10Payload(answers, vasco);
    expect(out.find(p => p.key === 'D5_arr').userOverride).toBe(false);
  });

  test('vasco fields null when metric unavailable', () => {
    const answers = { D5_grr: "Can't report" };
    const out = buildPower10Payload(answers, {});
    expect(out.find(p => p.key === 'D5_grr')).toMatchObject({
      key: 'D5_grr', capability: "Can't report", vascoValue: null, userOverride: false,
    });
  });
});
```

**Step 3: Implement `buildPower10Payload`**

Append to `lib/vasco/power10-resolver.js`:

```javascript
const D5_TO_NAME = {
  D5_arr: 'ARR',
  D5_bookings: 'Bookings',
  D5_mql: 'MQL production',
  D5_mql_opp: 'MQL → Opportunity conversion rate',
  D5_pipeline: 'Pipeline production',
  D5_opp_cw: 'Opportunity → CW conversion rate',
  D5_cycle: 'Opportunity/Deal CW cycle time',
  D5_gross_churn: 'Gross churn',
  D5_grr: 'Gross retention',
  D5_nrr: 'Net retention',
};

export function buildPower10Payload(answers, vascoPower10 = {}) {
  return Object.entries(D5_TO_NAME).map(([key, name]) => {
    const v = vascoPower10[key];
    const capability = answers[key] || null;
    const userOverride = !!(v?.available && capability && capability !== 'Automated');
    return {
      name,
      key,
      capability,
      vascoValue: v?.value ?? null,
      vascoFormatted: v?.formatted ?? null,
      vascoSource: v?.source ?? null,
      asOf: v?.asOf ?? null,
      userOverride,
    };
  });
}
```

**Step 4: Wire it into IntakeForm submission**

In `IntakeForm.js`, where the submit payload is constructed for the diagnostic, replace the existing `power10Metrics` derivation with:

```javascript
import { buildPower10Payload } from '../../lib/vasco/power10-resolver';
// ...
const power10MetricsPayload = buildPower10Payload(answers, vascoPower10);
// pass `power10MetricsPayload` where `power10Metrics` was passed before
```

**Step 5: Run tests**

Run: `npx jest __tests__/lib/build-power10-payload.test.js __tests__/lib/vasco-power10-resolver.test.js`
Expected: all tests pass.

Run: `npm run build 2>&1 | tail -10`
Expected: build succeeds.

**Step 6: Commit**

```bash
git add lib/vasco/power10-resolver.js components/diagnostic-intake/IntakeForm.js __tests__/lib/build-power10-payload.test.js
git commit -m "feat(intake): persist Vasco actuals + userOverride flag with power10_metrics"
```

---

## Task 10: Results display — Show Vasco actuals on RP-5 / Power 10 card

**Files:**
- Inspect: `components/diagnostic/v3/ScoreCardGrid.js` and any RP-5 detail component
- Modify: whichever component renders the Power 10 / RP-5 evidence

**Step 1: Find the RP-5 render site**

Run:
```bash
grep -rn "RP-5\|power10_metrics_count\|power10_metrics" components/diagnostic/v3/ pages/api/diagnostic/v3/results.js
```

**Step 2: Read the persisted `power10_metrics` array on the diagnostic_result row in the v3 results API**

In `pages/api/diagnostic/v3/results.js` (or wherever results are assembled for the UI), include `power10_metrics` in the response payload alongside scores.

**Step 3: Render an actuals strip**

In the RP-5 card / details panel (likely `CompetencyDetailPanel.js`), if `power10_metrics` exists, render a 10-row mini-table:

| Metric | Capability | Actual (Vasco) | As of |
|---|---|---|---|
| ARR | Automated | $1.1M | 2026-03 |
| ... | ... | ... | ... |

```jsx
{power10Metrics?.length > 0 && (
  <div style={{ marginTop: 16 }}>
    <h4>Power 10 — Vasco actuals</h4>
    <table style={{ width: '100%', fontSize: 13 }}>
      <thead><tr><th>Metric</th><th>Reportable</th><th>Actual</th><th>As of</th></tr></thead>
      <tbody>
        {power10Metrics.map(m => (
          <tr key={m.key} style={m.userOverride ? { background: '#FEF3C7' } : {}}>
            <td>{m.name}</td>
            <td>{m.capability || '—'}</td>
            <td>{m.vascoFormatted || '—'}</td>
            <td>{m.asOf || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
```

**Step 4: Build check**

Run: `npm run build 2>&1 | tail -10`

**Step 5: Commit**

```bash
git add components/diagnostic/v3/ pages/api/diagnostic/v3/results.js
git commit -m "feat(results): show Vasco actuals on RP-5 detail panel"
```

---

## Task 11: Final verification

**Step 1: Run full test suite**

Run: `npm test 2>&1 | tail -10`
Expected: passing tests >= baseline (883), failing tests <= baseline (57). New tests added by this plan: ~17. So target: ~900 passing, 57 failing.

If new failures appear in files we touched, fix before merge.

**Step 2: Manual test — local dev**

Run: `npm run dev` and walk through:
1. Open intake for a customer with a recent Vasco snapshot. Section E Power 10 questions should pre-select `Automated` for the 7 cube-backed metrics, with "From Vasco: …" badges.
2. Override one (e.g. ARR → "Manual calc"). Badge stays, but the answer changes.
3. Submit. Verify in Supabase that `diagnostic_results.power10_metrics[]` carries `vascoValue`, `vascoFormatted`, `userOverride: true` for the overridden one.
4. Open results. RP-5 detail shows the actuals table.

**Step 3: Manual test — empty state**

Open intake for a customer **without** a Vasco snapshot. Section E behaves as before (no badges, no auto-fill).

**Step 4: Sync routine prompt update**

Update the Vasco Data Sync Claude Code routine prompt (held in the RemoteTrigger config — outside repo). Apply the diff in [`docs/plans/2026-05-05-power10-vasco-resolver-design.md`](./2026-05-05-power10-vasco-resolver-design.md) §Sync-Routine-Prompt-Diff:

- Add Step 2b §g (`recurring_revenue_changes` 12-month query)
- Add Step 2b §h (start/end balance queries)
- Add `recurring_revenue_changes = CASE WHEN <has_data> THEN $vs$<json>$vs$::jsonb ELSE NULL END,` to Step 2c UPDATE

Then run the routine against one internal customer (e.g. LeanScale itself) to populate the new column. Verify churn / GRR / NRR appear in Section E for that customer.

**Step 5: Apply migration to staging Supabase**

Migration `026_vasco_recurring_revenue.sql` is additive and non-destructive. Apply via `supabase db push` or whatever the team uses. **Confirm with the team before applying to production.**

**Step 6: Open PR**

```bash
git push -u origin feature/power10-vasco-resolver
gh pr create --title "Power 10 Vasco auto-fill (v3 diagnostic)" --body "$(cat <<'EOF'
## Summary
- Auto-fills Section E Power 10 capability questions from `vasco_snapshots`
- Displays actual values inline ("From Vasco: $1.1M (2026-03)")
- User override preserved, flagged on the persisted record
- New `lib/vasco/power10-resolver.js` covers all 10 metrics
- Adds `recurring_revenue_changes JSONB` to `vasco_snapshots` for churn/GRR/NRR
- Sync routine prompt updated separately (RemoteTrigger config — see design doc)

## Design
[`docs/plans/2026-05-05-power10-vasco-resolver-design.md`](docs/plans/2026-05-05-power10-vasco-resolver-design.md)

## Test plan
- [ ] `npm test` — passing >= baseline (883), failing <= baseline (57)
- [ ] Manual: customer with snapshot → auto-fill + badges
- [ ] Manual: customer without snapshot → no auto-fill (regression check)
- [ ] Manual: override flips userOverride flag in persisted row
- [ ] Migration applied to staging
- [ ] Sync routine prompt updated; one customer re-synced; churn/GRR/NRR visible

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Notes for the implementer

- **YAGNI:** No "Vasco-validated" RP-5 grader tier in this PR — the design doc lists it as future work.
- **Backwards-compat is load-bearing:** Snapshots taken before the migration must still flow through — Task 3 covers this.
- **The sync routine prompt is not in this repo.** It lives in the Claude Code RemoteTrigger config behind `CLAUDE_VASCO_TRIGGER_ID`. Updating it is part of the rollout (Task 11 §4), not the code PR.
- **Pre-existing test failures** — 57 tests in unrelated suites (Salesforce, Clay, SOW, Layout) fail on `main`. Don't try to fix them in this PR.
