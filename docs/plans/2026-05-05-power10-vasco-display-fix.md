# Power 10 Vasco Display Fix — Implementation Plan

**Branch:** `feature/power10-vasco-display-fix` (off `main` post-#66)
**Goal:** Wire Vasco actuals + performance into the Power 10 results page (`Power10Anchor`), and fix the `D5_arr` data semantics issue found in #66.

## What's wrong with what shipped in #66

1. **Wrong display target.** PR #66 wired Vasco into `CompetencyDetailPanel.js` (RP-5 detail in v3 ScoreCard). The user-facing Power 10 page is `Power10Anchor` rendered by `DiagnosticResults.js` — that's where customers expect to see the data and it's untouched by #66.

2. **`D5_arr` semantics bug.** `volume_metrics.net_recurring_revenue_actuals` is a **monthly net delta**, not a standing ARR balance. For Paramify in April 2026, this returned −$100K (net contraction month). Real ARR is the cumulative ending balance from the `recurring_revenue_changes` cube via `beforeDate`.

3. **No performance signal.** Today's `derivePower10FromIntake` only sets `ableToReport` (capability self-report). The `statusAgainstPlan` field that drives the Performance row is never populated, so every card defaults to "Unable" on that row. Vasco exposes `perf_*` measures (actuals ÷ forecast) on `volume_metrics` — we can derive Performance directly.

## Architecture

| Layer | Change |
|---|---|
| Resolver (`lib/vasco/power10-resolver.js`) | Add `performance` field to every metric. Switch `D5_arr` to read from `recurring_revenue_changes.balances.end_of_period.mrr` (the BARR/EARR ending balance). |
| Migration (additive) | No schema change — performance + ARR balance both ride on existing `recurring_revenue_changes` JSONB and the new `volume_metrics_performance` field of the existing `volume_metrics` JSONB. |
| Sync routine | Pull `perf_*` measures + ending balance via existing `query_metric_engine` calls. |
| `derivePower10FromIntake` (`DiagnosticResults.js:86`) | Renamed → `derivePower10` and accepts `(answers, vascoPower10)`. Merges intake capability with Vasco actuals + performance + thresholds. |
| `Power10Anchor.js` MetricCard | Add a `formatted` value slot between description and status rows. Show "—" when unavailable. Status rows now read real `ableToReport` (Vasco available OR self-report) and `statusAgainstPlan` (perf bucket OR threshold bucket OR consultant override). |

## Performance bucketing rules

For metrics with Vasco forecast:
- `perf >= 0.9` → **healthy**
- `perf >= 0.6` → **careful**
- `perf < 0.6` → **warning**
- `null` → **unable**

For metrics without Vasco forecast (industry thresholds):
| Metric | Healthy | Careful | Warning |
|---|---|---|---|
| ARR | (no threshold — use **unable** until consultant overrides) | | |
| Gross churn (annualized) | ≤ 5% | ≤ 10% | > 10% |
| GRR | ≥ 90% | ≥ 80% | < 80% |
| NRR | ≥ 110% | ≥ 100% | < 100% |
| Cycle Time (days) | ≤ 60 | ≤ 90 | > 90 |

`engagement_overrides.power10` already lets consultants override `ableToReport` and `statusAgainstPlan` per metric — no change needed.

## Implementation steps

### Step 1 — Resolver: add `performance` field, fix `D5_arr` source

**Files:**
- `lib/vasco/power10-resolver.js`
- `__tests__/lib/vasco-power10-resolver.test.js`

**Tests first.** Three new test cases:
1. `D5_arr` reads from `recurring_revenue_changes.balances.end_of_period.mrr` when present, falls back to `available: false` when missing.
2. `performance` field populated from `volume_metrics_performance.D5_*` perf ratios when present.
3. Threshold-based performance for retention metrics (e.g. NRR ≥ 1.10 → healthy).

**Resolver changes:**
- New helper `bucketPerf(ratio)` → `'healthy'|'careful'|'warning'`.
- New helper `bucketByThreshold(value, healthyAt, carefulAt, lowerIsBetter)` for threshold metrics.
- `D5_arr` block reads `snapshot.recurring_revenue_changes?.balances?.end_of_period?.mrr` instead of `latest.net_arr`. Source string becomes `'recurring_revenue_changes.balances.end_of_period.mrr'`.
- Each existing block gets `performance:` field populated from `snapshot.volume_metrics_performance?.D5_*` (new optional field on snapshots) when forecasted, or threshold-based when not, or `'unable'` when no signal.

### Step 2 — Sync routine + snapshot shape

The resolver reads two new fields from the snapshot. The sync routine must write them.

**Snapshot field additions (no schema migration — both ride on existing JSONB):**
- `recurring_revenue_changes.balances` — already specified in #66's design doc; routine prompt update needed.
- `volume_metrics_performance` — new top-level JSONB field. Shape:
  ```json
  {
    "period": "2026-04",
    "D5_bookings":  { "perf": 0.82 },
    "D5_pipeline":  { "perf": 0.91 },
    "D5_mql":       { "perf": 1.05 },
    "D5_mql_opp":   { "perf": 0.78 },
    "D5_opp_cw":    { "perf": 1.10 }
  }
  ```

**Migration:** add `volume_metrics_performance JSONB` column (additive, idempotent).

**Routine prompt diff:** new step 2b §i to query perf measures, new step 2c assignment.

### Step 3 — `derivePower10` reads Vasco data

**File:** `components/diagnostic/DiagnosticResults.js`

- Rename `derivePower10FromIntake(answers)` → `derivePower10(answers, vascoPower10)`.
- For each metric: check Vasco availability first; fall back to intake answer; emit `formatted` (Vasco) or `null`.
- Compute `ableToReport` from Vasco available OR intake `Automated`/`Manual calc` → `'healthy'`/`'careful'`, else `'warning'`/`'unable'`.
- Compute `statusAgainstPlan` from Vasco performance OR threshold OR `'unable'`.
- Update both call sites to pass `vascoPower10` (loaded via existing `/api/diagnostic/vasco-power10` endpoint already shipped in #66).

### Step 4 — MetricCard shows the value

**File:** `components/engagement-pitch/Power10Anchor.js`

Add a value row between the "Why" italic line and the divider:

```jsx
{metric.formatted && (
  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.95)', lineHeight: 1.1 }}>
    {metric.formatted}
    {metric.asOf && <span style={{ fontSize: '0.6rem', fontWeight: 400, color: 'rgba(255,255,255,0.35)', marginLeft: '0.5rem' }}>{metric.asOf}</span>}
  </div>
)}
```

### Step 5 — Wire `vascoPower10` fetch into DiagnosticResults

**File:** `components/diagnostic/DiagnosticResults.js`

- New `useState` for `vascoPower10`.
- Fetch from `/api/diagnostic/vasco-power10?customerId=` in the existing intake-load effect.
- Pass into all `derivePower10` call sites.

### Step 6 — Apply migration + update routine prompt

After PR is approved + merged:
1. Apply migration `027_volume_metrics_performance.sql` to Supabase.
2. Update Vasco Data Sync routine prompt with steps 2b §i (perf query) + 2b §h (balance queries from #66 design doc, if not yet applied).
3. Re-sync Paramify; verify Power 10 page shows real values + status colors.

## Test plan

- [ ] `npm test` — at least 909 passing (baseline). New tests for resolver extension push count higher.
- [ ] `npm run build` — succeeds.
- [ ] Manual smoke: Paramify intake → Section E shows auto-fill (regression check from #66). Power 10 page shows ARR ~$5M (not −$100K), Bookings ~$606K, MQL Volume 84, etc.
- [ ] Override flow: edit mode → click a status row → status cycles → persists to engagement_overrides.

## Out of scope

- Any change to RP-5 grader scoring.
- Any change to engagement-pitch / QBR consumers of `power10Data` (they read `name`, `ableToReport`, `statusAgainstPlan` only — backwards-compatible).
- Live MCP refresh from the diagnostic page (still runs through the snapshot pipeline).
