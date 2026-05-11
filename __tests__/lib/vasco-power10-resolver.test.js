import { resolvePower10FromSnapshot } from '../../lib/vasco/power10-resolver';

describe('resolvePower10FromSnapshot — D5_arr', () => {
  test('returns empty object when snapshot is null', () => {
    expect(resolvePower10FromSnapshot(null)).toEqual({});
  });
});

describe('resolvePower10FromSnapshot — D5_arr from balance', () => {
  test('uses recurring_revenue_changes.balances.end_of_period.mrr as ARR source', () => {
    const snapshot = {
      snapshot_date: '2026-05-01',
      volume_metrics: { data: [{ month: '2026-04', net_arr: -100000 }] },
      recurring_revenue_changes: {
        period: '2026-04',
        balances: {
          start_of_period: { date: '2026-04-01', mrr: 5100000, customers: 110 },
          end_of_period:   { date: '2026-05-01', mrr: 5000000, customers: 109 },
        },
        monthly: [],
      },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_arr).toMatchObject({
      available: true,
      value: 5000000,
      formatted: '$5.0M',
      source: 'recurring_revenue_changes.balances.end_of_period.mrr',
      asOf: '2026-04',
    });
  });

  test('D5_arr unavailable when no recurring_revenue_changes', () => {
    const snapshot = {
      snapshot_date: '2026-05-01',
      volume_metrics: { data: [{ month: '2026-04', net_arr: 1000000 }] },
    };
    expect(resolvePower10FromSnapshot(snapshot).D5_arr).toMatchObject({ available: false });
  });
});

describe('resolvePower10FromSnapshot — performance field', () => {
  test('reads perf ratio from volume_metrics_performance for forecasted metrics', () => {
    const snapshot = {
      snapshot_date: '2026-05-01',
      volume_metrics: { data: [{ month: '2026-04', amount_won: 600000, mqls: 84 }] },
      volume_metrics_performance: {
        period: '2026-04',
        D5_bookings: { perf: 0.95 },
        D5_mql:      { perf: 0.45 },
      },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_bookings.performance).toBe('healthy'); // 0.95 >= 0.9
    expect(out.D5_mql.performance).toBe('warning');      // 0.45 < 0.6
  });

  test('threshold-based performance for retention metrics', () => {
    const snapshot = {
      snapshot_date: '2026-05-01',
      volume_metrics: { data: [{ month: '2026-04', net_arr: 1 }] },
      recurring_revenue_changes: {
        period: '2026-04',
        balances: { start_of_period: { date: '2026-04-01', mrr: 100000, customers: 10 }, end_of_period: { date: '2026-05-01', mrr: 110000, customers: 11 } },
        monthly: [
          { month: '2026-04', phase: 'EXPANSION', recurring_revenue_actuals: 12000, recurring_customers_actuals: 0 },
          { month: '2026-04', phase: 'RETENTION', recurring_revenue_actuals: -2000, recurring_customers_actuals: 0 },
        ],
      },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    // gross_churn = 2000 / 100000 = 0.02 monthly → 0.24 annualized → > 0.10 → warning
    expect(out.D5_gross_churn.performance).toBe('warning');
    // grr = 1 - 0.02 = 0.98 monthly → not annualized for this rule (we use as-is); >= 0.90 → healthy
    expect(out.D5_grr.performance).toBe('healthy');
    // nrr = 1.10 → >= 1.10 → healthy
    expect(out.D5_nrr.performance).toBe('healthy');
  });

  test('performance defaults to unable when no signal', () => {
    const snapshot = {
      snapshot_date: '2026-05-01',
      volume_metrics: { data: [{ month: '2026-04', amount_won: 600000 }] },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_bookings.performance).toBe('unable');
  });
});

describe('isStale guard', () => {
  test('treats malformed snapshot_date as stale', () => {
    const snapshot = {
      snapshot_date: 'not-a-date',
      volume_metrics: { data: [{ month: '2026-03', net_arr: 1000000 }] },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_arr.stale).toBe(true);
  });

  test('marks snapshot > 90 days old as stale', () => {
    const oldDate = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString();
    const snapshot = {
      snapshot_date: oldDate,
      volume_metrics: { data: [{ month: '2026-01', net_arr: 1000000 }] },
    };
    expect(resolvePower10FromSnapshot(snapshot).D5_arr.stale).toBe(true);
  });

  test('marks fresh snapshot as not stale', () => {
    const recent = new Date().toISOString();
    const snapshot = {
      snapshot_date: recent,
      volume_metrics: { data: [{ month: '2026-04', net_arr: 1000000 }] },
    };
    expect(resolvePower10FromSnapshot(snapshot).D5_arr.stale).toBe(false);
  });
});

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

  test('emits 0% conversion rates as legitimate values, not missing', () => {
    const snapshot = {
      snapshot_date: '2026-04-30',
      volume_metrics: {
        data: [
          { month: '2026-02', cvr_mql_sql: 0, cvr_sal_won: 0 },
          { month: '2026-03', cvr_mql_sql: 0, cvr_sal_won: 0 },
          { month: '2026-04', cvr_mql_sql: 0, cvr_sal_won: 0 },
        ],
      },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_mql_opp).toMatchObject({ available: true, value: 0, formatted: '0%' });
    expect(out.D5_opp_cw).toMatchObject({ available: true, value: 0, formatted: '0%' });
  });
});

describe('resolvePower10FromSnapshot — recurring revenue', () => {
  test('returns available: false when recurring_revenue_changes column missing (legacy snapshot)', () => {
    const out = resolvePower10FromSnapshot({ snapshot_date: '2026-04-30', volume_metrics: { data: [{ month: '2026-03', net_arr: 1 }] } });
    expect(out.D5_gross_churn).toMatchObject({ available: false, source: 'recurring_revenue_changes (not synced for this snapshot)' });
    expect(out.D5_grr).toMatchObject({ available: false });
    expect(out.D5_nrr).toMatchObject({ available: false });
  });

  test('computes churn / GRR / NRR from monthly deltas + balances', () => {
    // Period: 2026-03. Start MRR = 50000.
    // RETENTION deltas in 2026-03: -1000 (churn loss) + +200 (re-up) — net = -800; loss = -1000.
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
          { month: '2026-03', phase: 'ACQUISITION', recurring_revenue_actuals: 5000, recurring_customers_actuals: 1 },
          { month: '2026-02', phase: 'RETENTION', recurring_revenue_actuals: -9999, recurring_customers_actuals: 0 },
        ],
      },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_gross_churn).toMatchObject({ available: true, value: 0.02, formatted: '2%', source: 'recurring_revenue_changes' });
    expect(out.D5_grr).toMatchObject({ available: true, value: 0.98, formatted: '98%', source: 'recurring_revenue_changes' });
    expect(out.D5_nrr).toMatchObject({ available: true, value: 1.032, formatted: '103%', source: 'recurring_revenue_changes' });
  });

  test('value and formatted are consistent at rounding boundaries', () => {
    // gross_churn = 1245 / 50000 = 0.0249 (raw) → rounds to value=0.025 → formatted from rounded = "3%" (since round(2.5)=3)
    // Without the fix: formatted would have been formatPct(0.0249) = round(2.49)% = "2%", diverging from value=0.025.
    const snapshot = {
      snapshot_date: '2026-04-30',
      volume_metrics: { data: [{ month: '2026-03', net_arr: 1 }] },
      recurring_revenue_changes: {
        period: '2026-03',
        balances: {
          start_of_period: { date: '2026-03-01', mrr: 50000, customers: 42 },
          end_of_period: { date: '2026-04-01', mrr: 48755, customers: 41 },
        },
        monthly: [
          { month: '2026-03', phase: 'RETENTION', recurring_revenue_actuals: -1245, recurring_customers_actuals: -1 },
        ],
      },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_gross_churn.value).toBe(0.025);
    expect(out.D5_gross_churn.formatted).toBe('3%');
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

describe('resolvePower10FromSnapshot — TTM cadence for retention metrics', () => {
  test('uses trailing-12-month math when window_start.mrr is present', () => {
    // window_start.mrr = 3,200,000 (denominator)
    // RETENTION negatives across 12 months: -240K total → gross_churn = 240K / 3.2M = 7.5%
    // RETENTION net (positives + negatives): -240K + 0 = -240K
    // EXPANSION net: 360K
    // NRR = (3.2M - 240K + 360K) / 3.2M = 3.32M / 3.2M = 1.0375 → 104%
    const snapshot = {
      snapshot_date: '2026-05-01',
      volume_metrics: { data: [{ month: '2026-04', net_arr: 1 }] },
      recurring_revenue_changes: {
        period: '2026-04',
        balances: {
          window_start:    { date: '2025-05-01', mrr: 3200000, customers: 95 },
          start_of_period: { date: '2026-04-01', mrr: 4000000, customers: 110 },
          end_of_period:   { date: '2026-05-01', mrr: 4120000, customers: 113 },
        },
        monthly: [
          // RETENTION losses scattered across the 12 months
          { month: '2025-06', phase: 'RETENTION', recurring_revenue_actuals: -50000, recurring_customers_actuals: -1 },
          { month: '2025-09', phase: 'RETENTION', recurring_revenue_actuals: -90000, recurring_customers_actuals: -2 },
          { month: '2026-01', phase: 'RETENTION', recurring_revenue_actuals: -100000, recurring_customers_actuals: -2 },
          // EXPANSION across the 12 months
          { month: '2025-08', phase: 'EXPANSION', recurring_revenue_actuals: 120000, recurring_customers_actuals: 0 },
          { month: '2025-11', phase: 'EXPANSION', recurring_revenue_actuals: 140000, recurring_customers_actuals: 0 },
          { month: '2026-03', phase: 'EXPANSION', recurring_revenue_actuals: 100000, recurring_customers_actuals: 0 },
          // ACQUISITION rows ignored entirely for retention metrics
          { month: '2026-04', phase: 'ACQUISITION', recurring_revenue_actuals: 999999, recurring_customers_actuals: 5 },
        ],
      },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_gross_churn).toMatchObject({ available: true, value: 0.075, formatted: '8%', cadence: 'trailing_12m' });
    expect(out.D5_grr).toMatchObject({ available: true, value: 0.925, formatted: '93%', cadence: 'trailing_12m' });
    expect(out.D5_nrr).toMatchObject({ available: true, value: 1.038, formatted: '104%', cadence: 'trailing_12m' });
    // 7.5% TTM gross churn → annualization NOT applied → > 5% but < 10% → careful
    expect(out.D5_gross_churn.performance).toBe('careful');
    // 92.5% GRR → >= 90% → healthy
    expect(out.D5_grr.performance).toBe('healthy');
    // 103.8% NRR → >= 100% but < 110% → careful
    expect(out.D5_nrr.performance).toBe('careful');
  });

  test('falls back to single-month cadence when window_start absent (legacy snapshot)', () => {
    const snapshot = {
      snapshot_date: '2026-05-01',
      volume_metrics: { data: [{ month: '2026-04', net_arr: 1 }] },
      recurring_revenue_changes: {
        period: '2026-04',
        balances: {
          start_of_period: { date: '2026-04-01', mrr: 100000, customers: 10 },
          end_of_period:   { date: '2026-05-01', mrr: 95000, customers: 9 },
        },
        monthly: [
          { month: '2026-04', phase: 'RETENTION', recurring_revenue_actuals: -5000, recurring_customers_actuals: -1 },
        ],
      },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_gross_churn).toMatchObject({ cadence: 'single_month', value: 0.05 });
    // Single-month 5% × 12 = 60% annualized → > 10% → warning (preserves pre-TTM behavior)
    expect(out.D5_gross_churn.performance).toBe('warning');
  });

  test('falls back to single-month when window_start.mrr is 0 (new customer)', () => {
    const snapshot = {
      snapshot_date: '2026-05-01',
      volume_metrics: { data: [{ month: '2026-04', net_arr: 1 }] },
      recurring_revenue_changes: {
        period: '2026-04',
        balances: {
          window_start:    { date: '2025-05-01', mrr: 0, customers: 0 },
          start_of_period: { date: '2026-04-01', mrr: 50000, customers: 5 },
          end_of_period:   { date: '2026-05-01', mrr: 52000, customers: 5 },
        },
        monthly: [
          { month: '2026-04', phase: 'RETENTION', recurring_revenue_actuals: -1000, recurring_customers_actuals: 0 },
        ],
      },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_gross_churn).toMatchObject({ cadence: 'single_month' });
    expect(out.D5_gross_churn.value).toBe(0.02); // 1000 / 50000 single-month
  });

  test('all metrics carry cadence field', () => {
    const snapshot = {
      snapshot_date: '2026-05-01',
      volume_metrics: { data: [{ month: '2026-04', net_arr: 1, amount_won: 100, mqls: 10, sqls: 5, amount_sqls: 50, cvr_mql_sql: 0.5, cvr_sal_won: 0.2 }] },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    for (const key of ['D5_arr', 'D5_bookings', 'D5_mql', 'D5_mql_opp', 'D5_pipeline', 'D5_opp_cw']) {
      expect(out[key].cadence).toBeDefined();
    }
  });
});

import { buildPower10Payload } from '../../lib/vasco/power10-resolver';

describe('buildPower10Payload', () => {
  test('marks userOverride when user answered something other than Automated for an available metric', () => {
    const answers = { D5_arr: 'Manual calc' };
    const vasco = { D5_arr: { name: 'ARR', available: true, value: 1, formatted: '$1', source: 'x', asOf: '2026-03', stale: false } };
    const out = buildPower10Payload(answers, vasco);
    expect(out.find(p => p.key === 'D5_arr')).toMatchObject({
      key: 'D5_arr', name: 'ARR', capability: 'Manual calc', vascoValue: 1, vascoFormatted: '$1', userOverride: true,
    });
  });

  test('userOverride false when user accepted Automated', () => {
    const answers = { D5_arr: 'Automated' };
    const vasco = { D5_arr: { name: 'ARR', available: true, value: 1, formatted: '$1', source: 'x', asOf: '2026-03', stale: false } };
    const out = buildPower10Payload(answers, vasco);
    expect(out.find(p => p.key === 'D5_arr').userOverride).toBe(false);
  });

  test('userOverride false when metric not available in Vasco (legacy / not synced)', () => {
    const answers = { D5_grr: "Can't report" };
    const out = buildPower10Payload(answers, {});
    expect(out.find(p => p.key === 'D5_grr')).toMatchObject({
      key: 'D5_grr', name: 'Gross retention', capability: "Can't report", vascoValue: null, vascoFormatted: null, vascoSource: null, asOf: null, userOverride: false,
    });
  });

  test('returns 10 entries (one per Power 10 metric) even when answers and vasco are empty', () => {
    const out = buildPower10Payload({}, {});
    expect(out).toHaveLength(10);
    expect(out.map(p => p.key).sort()).toEqual([
      'D5_arr', 'D5_bookings', 'D5_cycle', 'D5_gross_churn', 'D5_grr',
      'D5_mql', 'D5_mql_opp', 'D5_nrr', 'D5_opp_cw', 'D5_pipeline',
    ]);
    expect(out.every(p => p.capability === null && p.vascoValue === null)).toBe(true);
  });
});
