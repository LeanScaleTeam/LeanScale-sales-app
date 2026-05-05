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

describe('isStale guard', () => {
  test('treats malformed snapshot_date as stale', () => {
    const snapshot = {
      snapshot_date: 'not-a-date',
      volume_metrics: { data: [{ month: '2026-03', net_arr: 1000000 }] },
    };
    const out = resolvePower10FromSnapshot(snapshot);
    expect(out.D5_arr.stale).toBe(true);
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
