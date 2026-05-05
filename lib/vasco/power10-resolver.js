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

// ─── Performance bucketing ────────────────────────────────────────────────────
// Used to convert a numeric signal (perf ratio or threshold metric) into one of
// the four Power 10 status states: 'healthy' | 'careful' | 'warning' | 'unable'.

function bucketPerf(ratio) {
  if (ratio == null || isNaN(ratio)) return 'unable';
  if (ratio >= 0.9) return 'healthy';
  if (ratio >= 0.6) return 'careful';
  return 'warning';
}

function bucketByThreshold(value, { healthyAt, carefulAt, lowerIsBetter = false }) {
  if (value == null) return 'unable';
  if (lowerIsBetter) {
    if (value <= healthyAt) return 'healthy';
    if (value <= carefulAt) return 'careful';
    return 'warning';
  }
  if (value >= healthyAt) return 'healthy';
  if (value >= carefulAt) return 'careful';
  return 'warning';
}

export function resolvePower10FromSnapshot(snapshot) {
  if (!snapshot) return {};
  const stale = isStale(snapshot.snapshot_date);
  const volumeData = snapshot.volume_metrics?.data || [];
  const latest = pickLatestFullMonth(volumeData);
  const vmp = snapshot.volume_metrics_performance || {};

  // Performance helpers — keep in scope for retention metrics below
  const perfFor = (key) => bucketPerf(vmp?.[key]?.perf);

  const out = {};

  // D5_arr — sourced from recurring_revenue_changes.balances.end_of_period.mrr
  // (the standing ARR/MRR cube balance). The legacy volume_metrics.net_arr is a
  // *monthly net delta* (acquisition + expansion - churn) and is the wrong
  // signal for an absolute ARR display. There is no industry-wide threshold
  // for absolute ARR, so performance defaults to 'unable' (consultant override).
  const arrBalance = snapshot.recurring_revenue_changes?.balances?.end_of_period?.mrr;
  const arrPeriod = snapshot.recurring_revenue_changes?.period
    || snapshot.recurring_revenue_changes?.balances?.end_of_period?.date
    || null;
  if (arrBalance != null) {
    out.D5_arr = {
      name: 'ARR',
      available: true,
      value: arrBalance,
      formatted: formatCurrency(arrBalance),
      source: 'recurring_revenue_changes.balances.end_of_period.mrr',
      asOf: arrPeriod,
      stale,
      performance: 'unable',
    };
  } else {
    out.D5_arr = {
      name: 'ARR',
      available: false,
      value: null,
      formatted: null,
      source: 'recurring_revenue_changes (not synced for this snapshot)',
      asOf: null,
      stale,
      performance: 'unable',
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
      performance: perfFor('D5_bookings'),
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
      performance: perfFor('D5_mql'),
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
      performance: perfFor('D5_mql_opp'),
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
      performance: perfFor('D5_pipeline'),
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
      performance: perfFor('D5_opp_cw'),
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
      // Threshold-based: <= 60 days healthy, <= 90 careful, else warning.
      performance: bucketByThreshold(latestTis.sal_to_won_days, { healthyAt: 60, carefulAt: 90, lowerIsBetter: true }),
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
      performance: 'unable',
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

      const grossChurnRounded = Math.round(grossChurn * 1000) / 1000;
      const grrRounded = Math.round(grr * 1000) / 1000;
      const nrrRounded = Math.round(nrr * 1000) / 1000;

      // Gross churn here is a *monthly* ratio (1-month loss / start MRR).
      // The healthy/careful thresholds (5% / 10%) are *annualized* targets,
      // so multiply by 12 before bucketing.
      const grossChurnAnnualized = grossChurnRounded * 12;
      out.D5_gross_churn = {
        name: 'Gross churn',
        available: true,
        value: grossChurnRounded,
        formatted: formatPct(grossChurnRounded),
        source: 'recurring_revenue_changes',
        asOf: period,
        stale,
        performance: bucketByThreshold(grossChurnAnnualized, { healthyAt: 0.05, carefulAt: 0.10, lowerIsBetter: true }),
      };
      out.D5_grr = {
        name: 'Gross retention',
        available: true,
        value: grrRounded,
        formatted: formatPct(grrRounded),
        source: 'recurring_revenue_changes',
        asOf: period,
        stale,
        performance: bucketByThreshold(grrRounded, { healthyAt: 0.90, carefulAt: 0.80 }),
      };
      out.D5_nrr = {
        name: 'Net retention',
        available: true,
        value: nrrRounded,
        formatted: formatPct(nrrRounded),
        source: 'recurring_revenue_changes',
        asOf: period,
        stale,
        performance: bucketByThreshold(nrrRounded, { healthyAt: 1.10, carefulAt: 1.00 }),
      };
    }
  }

  return out;
}

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

/**
 * Build the persistence-ready Power 10 payload for a given set of intake answers.
 *
 * Returns an array of 10 entries (one per Power 10 metric) carrying the user's
 * capability answer, the actual value from Vasco (when available), and a
 * userOverride flag — true when Vasco can report the metric AND the user
 * answered something other than 'Automated'. Useful for QBR / engagement pitch
 * walkthroughs where divergence between reality and self-report matters.
 */
export function buildPower10Payload(answers = {}, vascoPower10 = {}) {
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
