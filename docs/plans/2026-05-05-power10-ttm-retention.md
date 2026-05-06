# Power 10 — TTM Retention + Cadence Labels

**Issue:** [#68](https://github.com/LeanScaleTeam/LeanScale-sales-app/issues/68)
**Branch:** `feature/power10-ttm-retention` (off main post-#67)
**Goal:** Compute Gross Churn / GRR / NRR over a trailing-12-month window when the data is available; fall back to single-month otherwise. Surface the cadence in the UI.

## What changes

### Snapshot shape — additive

`recurring_revenue_changes.balances.window_start` (new optional sub-field):

```json
{
  "period": "2026-04",
  "monthly": [...12 rows of phase deltas...],
  "balances": {
    "start_of_period": { "date": "2026-04-01", "mrr": 4161355, "customers": 129 },
    "end_of_period":   { "date": "2026-05-01", "mrr": 4734355, "customers": 138 },
    "window_start":    { "date": "2025-05-01", "mrr": 3200000, "customers": 95 }
  }
}
```

`window_start` is the MRR balance 13 calendar months before today (= start of the trailing 12-month window ending at start_of_period). When this field is present, the resolver uses TTM math; when absent, it falls back to single-month.

### Resolver

`lib/vasco/power10-resolver.js` retention block:

- Read `window_start.mrr`. If present and > 0 → TTM path.
- TTM `gross_churn = -sum(RETENTION negatives, all 12 monthly rows) / window_start.mrr`
- TTM `grr = 1 - gross_churn`
- TTM `nrr = (window_start.mrr + RETENTION_net_12mo + EXPANSION_net_12mo) / window_start.mrr`
- Add `cadence: 'trailing_12m'` to each retention metric.
- Performance thresholds applied directly (no ×12) since input is annual-equivalent.
- Fallback path: same logic as today, with `cadence: 'single_month'`.

Also add `cadence: 'single_month'` to non-retention metrics so the UI has a consistent field to read.

### UI

`components/engagement-pitch/Power10Anchor.js` — append " · TTM" to the period label when `metric.cadence === 'trailing_12m'`.

### Routine prompt

Step 2h gets a third balance query for `window_start`. The cube readme already exposes the relevant pre-resolved boundary instants for "last quarter / last fiscal year / etc." but not specifically "13 months ago" — the routine will compute it from the start_of_period instant by subtracting 12 months in the org's timezone, then run the same `beforeDate` cumulative query.

## Acceptance criteria

- [x] Resolver produces `cadence` field on every metric
- [x] When `window_start` present: TTM math, 5%/10% gross churn thresholds applied directly (no ×12)
- [x] When `window_start` absent: single-month math (current behavior unchanged)
- [x] When `window_start.mrr <= 0`: fall back to single-month gracefully
- [x] UI shows " · TTM" suffix in the asOf label when cadence is trailing_12m
- [x] Existing tests pass; new tests cover TTM happy path, fallback when window_start absent, fallback when window_start.mrr is 0
- [x] Routine prompt updated with §h additional balance

## Test cases

1. **TTM happy path:** `window_start.mrr = 3.2M`, sum of RETENTION negatives across 12 months = -240K, sum of EXPANSION across 12 months = 360K → gross_churn = 7.5%, grr = 92.5%, nrr = (3200 - 80 + 360)/3200 = 1.119 ≈ 112%. cadence = 'trailing_12m'.
2. **Fallback — no window_start:** legacy snapshot. Compute single-month, cadence = 'single_month', performance buckets via ×12 path (preserved for backwards-compat).
3. **Fallback — window_start.mrr is 0:** new customer with no historical balance. cadence = 'single_month', use start_of_period.mrr as before.

## Out of scope

- Customers with < 12 months of monthly rows still use TTM but with however many rows exist; the `window_start` balance defines the denominator regardless of how many phase rows are present.
- Quarterly / weekly cadence options.
- Trend sparklines.
