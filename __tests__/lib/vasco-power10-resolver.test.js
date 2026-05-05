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
