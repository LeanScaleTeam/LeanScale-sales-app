const STALE_DAYS = 90;

function pickLatestFullMonth(data) {
  if (!Array.isArray(data) || data.length === 0) return null;
  if (data.length === 1) return data[0];
  return data[data.length - 2];
}

function isStale(snapshotDate) {
  if (!snapshotDate) return false;
  const t = new Date(snapshotDate).getTime();
  if (isNaN(t)) return true;
  return Date.now() - t > STALE_DAYS * 24 * 60 * 60 * 1000;
}

function formatCurrency(value) {
  if (value == null) return null;
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
}

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

  return out;
}
