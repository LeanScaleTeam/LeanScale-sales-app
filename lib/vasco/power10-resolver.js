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

      const grossChurn = -retentionLoss / startMrr;
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

  return out;
}
