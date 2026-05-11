# Power 10 Vasco Resolver — Design

**Date:** 2026-05-05
**Status:** Design (approved through Section 3 of brainstorm)
**Scope:** v3 only

## Problem

The diagnostic v3 Section E asks users to self-report whether they can report each Power 10 metric ("Automated / Manual calc / Can't report"). LeanScale already pulls Vasco data per-customer into `vasco_snapshots`. We can pre-fill the answers and surface actual values, with user override.

## Goal — Hybrid Auto-Fill (Option C)

When a Vasco snapshot exists for a customer:

1. **Auto-fill** the Section E Power 10 question with `Automated` for any metric Vasco can report.
2. **Show the actual value** ("From Vasco: $1.2M") under the question.
3. **Allow override** — user can change the answer; pre-fill stops being applied to that key.
4. **Persist actuals** — `vascoValue` saved alongside the user's capability answer.
5. **Display in results** — Power 10 card on results page shows actuals when available.

## Architecture — All v3

| Layer | File | Change |
|---|---|---|
| Data | `supabase/migrations/0XX_add_recurring_revenue_to_vasco_snapshots.sql` | NEW — adds `recurring_revenue_changes JSONB` column |
| Sync routine | Claude Code routine prompt (RemoteTrigger config, not in repo) | UPDATE — add recurring-revenue queries (Step 2b §g + balances) |
| Resolver | `lib/vasco/power10-resolver.js` | NEW — maps snapshot → `{ D5_*: { available, value, formatted, source, asOf, stale } }` |
| API | `pages/api/diagnostic/intake/vasco-power10.js` | NEW — `GET ?customerId=...` returns resolver output |
| Intake UI | `components/diagnostic-intake/SectionE_Reporting.js` | UPDATE — accepts `vascoPower10` prop, renders auto-fill + actual badge |
| Intake page | `pages/diagnostic/intake.js` | UPDATE — fetches `vascoPower10` on mount |
| Persistence | `lib/diagnostics.js:upsertDiagnosticResult` | UPDATE — `power10_metrics` entries gain `vascoValue`, `vascoSource` |
| Results | `pages/api/diagnostic/v3/run.js` + `lib/diagnostic-engine/v3/transform-intake.js` | UPDATE — passes resolver output through to grader / results display |
| Results UI | `components/diagnostic/v3/ScoreCardGrid.js` (or wherever RP-5 renders) | UPDATE — show actuals on the Power 10 / RP-5 card |

## Power 10 → Vasco Mapping

Resolver reads `snapshot.volume_metrics.data[]` and `snapshot.time_in_stage.data[]` (latest full month = `data[length - 2]`, matching `lib/vasco/map-snapshot.js:74`).

### Metrics from `volume_metrics` + `time_in_stage` (already synced today)

| D5 key | Power 10 metric | Snapshot path | Format |
|---|---|---|---|
| `D5_arr` | ARR | `latest.net_arr` (= `net_recurring_revenue_actuals`) | `$1.2M` |
| `D5_bookings` | Bookings | `latest.amount_won` | `$340K` |
| `D5_mql` | MQL production | `latest.mqls` | `142` |
| `D5_mql_opp` | MQL → Opp conv. rate | `latest.cvr_mql_sql` | `18%` |
| `D5_pipeline` | Pipeline production | `{ count: latest.sqls, amount: latest.amount_sqls }` | `47 / $890K` |
| `D5_opp_cw` | Opp → CW conv. rate | `latest.cvr_sal_won` | `22%` |
| `D5_cycle` | Opp/Deal CW cycle time | `latestTis.sal_to_won_days` | `54 days` |

### Metrics from `recurring_revenue_changes` (new — requires sync update)

For the latest full calendar month P, sliced by `phases.name`:

| D5 key | Metric | Formula |
|---|---|---|
| `D5_gross_churn` | Gross churn % | `−(sum of negative RETENTION deltas) / start_of_period_mrr` |
| `D5_grr` | Gross retention | `1 − gross_churn` |
| `D5_nrr` | Net retention | `(start_mrr + RETENTION_net + EXPANSION_net) / start_mrr` |

**Conventions:**
- Use `phases.name` (not `metric_type`) — bowtie semantics, matches Vasco product UI.
- "Gross churn" = downgrade / cancellation losses only; expansion excluded.
- "GRR" ≤ 100%; "NRR" can exceed 100%.
- Period = latest full calendar month; period boundaries from cube readme's `beforeDate` instants.
- Native cadence pass-through — do not multiply MRR×12 to fake ARR; org's `recurringRevenueRecognition` already determines what `recurring_revenue_actuals` represents.

## Resolver Contract

```ts
// lib/vasco/power10-resolver.js
export function resolvePower10FromSnapshot(snapshot): {
  [D5_key: string]: {
    name: string,             // canonical Power 10 metric name
    available: boolean,       // true → has a value to display
    value: number | null,     // raw numeric (or composite for D5_pipeline)
    formatted: string | null, // human-readable
    source: string,           // e.g. 'volume_metrics.net_arr'
    asOf: string | null,      // 'YYYY-MM' of the full month used
    stale: boolean,           // true if snapshot > 90 days old
  }
}
```

**No-snapshot behavior:** returns `{}` — Section E falls back to today's manual self-report flow with no auto-fill or badges.

**Backwards compat:** snapshots taken before the `recurring_revenue_changes` migration → those 3 metrics return `available: false, source: 'recurring_revenue_changes (not synced for this snapshot)'`. Older snapshots still drive the other 7 metrics fine.

## Sync Routine Prompt — Diff to Apply

Append the following to **Step 2b** in the existing Vasco Data Sync routine prompt (after section `f) query_context_graph`):

```
g) query_metric_engine — recurring_revenue_changes for last 12 months by month:
   Measures: recurring_revenue_actuals, recurring_customers_actuals
   Dimensions: phases.name
   TimeDimension: recurring_revenue_changes.date, dateRange from 12 months ago to today, granularity month
   Limit: 1000

h) query_metric_engine — Beginning / Ending balances for the latest full calendar month:
   For each of [start_of_period, end_of_period]:
     Measures: recurring_revenue_actuals, recurring_customers_actuals
     Filters: { member: 'recurring_revenue_changes.date', operator: 'beforeDate',
                values: [<UTC instant for that boundary, from cube readme>] }
     Limit: 1
   Store as: { start_of_period: { date, mrr, customers }, end_of_period: { date, mrr, customers } }

   If recurring_revenue_changes errors, set recurring_revenue_changes to null and note the error.
```

…and add to the **Step 2c** UPDATE statement:

```
recurring_revenue_changes = CASE WHEN <has_data>
  THEN $vs$<json>$vs$::jsonb ELSE NULL END,
```

The JSON shape stored in the column:

```json
{
  "monthly": [{ "month": "2026-04", "phase": "RETENTION", "recurring_revenue_actuals": -1234, "recurring_customers_actuals": -1 }, ...],
  "balances": {
    "start_of_period": { "date": "2026-04-01", "mrr": 50000, "customers": 42 },
    "end_of_period":   { "date": "2026-05-01", "mrr": 52400, "customers": 43 }
  },
  "period": "2026-04"
}
```

## Persistence Schema

Existing `power10_metrics` JSONB column (per `lib/diagnostics.js:50` and migration history) holds an array. New entry shape — additive, backwards-compatible:

```json
{
  "name": "ARR",
  "key": "D5_arr",
  "capability": "Automated",
  "vascoValue": 1234567,
  "vascoFormatted": "$1.2M",
  "vascoSource": "volume_metrics.net_arr",
  "asOf": "2026-04",
  "userOverride": false
}
```

`userOverride: true` when the user changed the auto-filled answer — useful in QBR / engagement-pitch walkthroughs to flag where reality and self-report diverge.

## RP-5 Grader — No Logic Change for v1

`scoreRP5` in `lib/diagnostic-engine/v3/graders/grade-reporting.js` already counts how many metrics are reportable (`Automated` or `Manual calc`). Auto-fill bumps the count up naturally because `Automated` becomes the default for Vasco-resolvable metrics. The grader stays untouched.

**Future enhancement (not v1):** add a "Vasco-validated" tier that scores higher when the `vascoValue` exists *and* the user didn't override away from `Automated`.

## Edge Cases

- **No snapshot** — resolver returns `{}`; Section E behaves as today.
- **Stale snapshot (>90 days)** — values still displayed, `stale: true` shown as warning chip.
- **Partial snapshot (e.g. context_graph errored)** — only affected metrics return `available: false`.
- **`start_of_period_mrr === 0`** — churn / GRR / NRR all `available: false` (undefined for new customers).
- **Volume data has only 1 month** — fall back to `data[0]` instead of `data[length-2]` (already the convention in `map-snapshot.js`).
- **Org cadence** — pass through; ARR vs MRR labeling derived from org's `recurringRevenueRecognition` if needed for display, but value itself is unchanged.

## Test Plan

1. **Unit — resolver** (`__tests__/lib/vasco/power10-resolver.test.js`)
   - Empty snapshot → `{}`
   - Volume-only snapshot (current production) → 7 metrics available, 3 not.
   - Full snapshot post-migration → all 10 available.
   - `start_of_period_mrr === 0` → retention trio not available.
   - Stale snapshot (>90 days) → `stale: true`.
2. **Unit — Section E** — `vascoPower10` prop pre-fills, badge renders, override clears badge and sets `userOverride: true`.
3. **Integration — intake API** — fixture customer with snapshot returns resolved object; customer without snapshot returns `{}`.
4. **Manual — sync routine** — run updated routine against a LeanScale-internal customer, verify `recurring_revenue_changes` JSONB lands with both `monthly` array and `balances` object.

## Open Items (Out of Scope for v1)

- "Vasco-validated" RP-5 grader tier.
- Live MCP refresh button on the diagnostic (currently we rely on the snapshot pipeline).
- Power 10 trend display (12-month sparkline) — the data is in the snapshot but not surfaced.
