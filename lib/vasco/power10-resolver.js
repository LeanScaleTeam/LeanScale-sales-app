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
