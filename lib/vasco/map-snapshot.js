/**
 * Maps a vasco_snapshots row into formats consumed by the diagnostic engine.
 *
 * Three outputs:
 *   1. crm_health  → engagement_overrides.crm_health (display in SystemsHealth)
 *   2. competency scores → consultant_assessments (feed the scoring engine)
 *   3. trend data  → structured for UI charts (funnel trends, velocity)
 */

// ── CRM Health mapping (Phase 1) ─────────────────────────────────────────────

const BOWTIE_STAGE_MAP = [
  { label: 'Awareness',  metricKey: 'leads' },
  { label: 'Education',  metricKey: 'mqls' },
  { label: 'Selection',  metricKey: 'sqls' },
  { label: 'Closing',    metricKey: 'sals' },
  { label: 'Onboarding', metricKey: 'won' },
  { label: 'Retention',  metricKey: 'live' },
  { label: 'Expansion',  metricKey: null },
];

/**
 * Convert a vasco_snapshots row → engagement_overrides.crm_health shape.
 */
export function mapSnapshotToCrmHealth(snapshot) {
  const integrity = snapshot.integrity_score || {};
  const issues = snapshot.integrity_issues?.issues || [];
  const volumeData = snapshot.volume_metrics?.data || [];

  // Use the latest full month (skip current partial month)
  const latestMonth = volumeData.length > 1
    ? volumeData[volumeData.length - 2]
    : volumeData[0] || {};

  // Map volume metrics to bowtie stages
  const bowtieStages = BOWTIE_STAGE_MAP.map(({ label, metricKey }) => {
    const count = metricKey ? (latestMonth[metricKey] ?? null) : null;
    // Calculate errors from integrity issues proportionally (per-stage not available, use total)
    return { label, count, errorsBefore: null, errorsAfter: null };
  });

  // Map event status
  const eventStatus = {
    succeeded: integrity.success || 0,
    warning: integrity.warning || 0,
    failed: integrity.fail || 0,
    ignored: (integrity.total || 0) - (integrity.success || 0) - (integrity.warning || 0) - (integrity.fail || 0),
  };

  // Map integrity issues
  const mappedIssues = issues
    .filter(i => i.severity !== 'IGNORE')
    .map(i => ({
      severity: i.severity?.toLowerCase() || 'warning',
      category: i.category || 'DATA_QUALITY',
      name: i.title || i.name,
      eventCount: i.eventCount || 0,
      accountCount: i.accountCount || 0,
      description: i.description || '',
    }));

  return {
    integrity_score: integrity.score != null ? Math.round(integrity.score * 10) / 10 : null,
    bowtie_stages: bowtieStages,
    event_status: eventStatus,
    issues: mappedIssues,
    employees: [], // Not available from metric engine — requires context graph
    _source: 'vasco_snapshot',
    _snapshot_date: snapshot.snapshot_date,
  };
}


// ── Competency score mapping (Phase 2) ───────────────────────────────────────

function scoreFromThresholds(value, greenMin, yellowMin) {
  if (value == null) return null;
  if (value >= greenMin) return 5;
  if (value >= yellowMin) return 3;
  return 1;
}

/**
 * Derive competency scores from snapshot metrics.
 * Returns { [competencyId]: { score, rationale } } for competencies with enough data.
 */
export function mapSnapshotToCompetencyScores(snapshot) {
  const volumeData = snapshot.volume_metrics?.data || [];
  const tisData = snapshot.time_in_stage?.data || [];
  const integrity = snapshot.integrity_score || {};

  // Use latest full month (skip partial current month)
  const latest = volumeData.length > 1 ? volumeData[volumeData.length - 2] : volumeData[0];
  const prior = volumeData.length > 2 ? volumeData[volumeData.length - 3] : null;
  const latestTis = tisData.length > 1 ? tisData[tisData.length - 2] : tisData[0];

  const scores = {};

  // SY-1: CRM Data Quality ← integrity score (direct)
  if (integrity.score != null) {
    scores['SY-1'] = {
      score: scoreFromThresholds(integrity.score, 90, 70),
      rationale: `Integrity score: ${Math.round(integrity.score)}% (${integrity.fail || 0} failing events)`,
    };
  }

  // PR-3: Win Rate ← SAL-to-Won conversion rate
  if (latest?.cvr_sal_won != null) {
    const winRate = parseFloat(latest.cvr_sal_won);
    scores['PR-3'] = {
      score: scoreFromThresholds(winRate, 0.20, 0.10),
      rationale: `Win rate: ${(winRate * 100).toFixed(1)}% (SAL→Won)`,
    };
  }

  // PR-2: Sales Cycle ← time in stage SAL→Won (days, lower is better)
  if (latestTis?.sal_to_won_days != null && latestTis.sal_to_won_days > 0) {
    const days = parseFloat(latestTis.sal_to_won_days);
    // Invert: <30 days = green, <60 = yellow, else red
    scores['PR-2'] = {
      score: days <= 30 ? 5 : days <= 60 ? 3 : 1,
      rationale: `Sales cycle: ${Math.round(days)} days (SAL→Won)`,
    };
  }

  // CS-1: NRR ← net_arr month-over-month trend
  if (latest?.net_arr != null && prior?.net_arr != null && prior.net_arr > 0) {
    const growth = latest.net_arr / prior.net_arr;
    scores['CS-1'] = {
      score: scoreFromThresholds(growth, 1.0, 0.9),
      rationale: `Net ARR trend: ${(growth * 100).toFixed(0)}% MoM (${Math.round(latest.net_arr / 1000)}K → ${Math.round(prior.net_arr / 1000)}K)`,
    };
  }

  // MK-1: MQL Volume ← MQL count trend (growth)
  if (latest?.mqls != null && prior?.mqls != null && prior.mqls > 0) {
    const growth = latest.mqls / prior.mqls;
    scores['MK-1'] = {
      score: scoreFromThresholds(growth, 0.9, 0.6),
      rationale: `MQL trend: ${latest.mqls} vs ${prior.mqls} prior month (${(growth * 100).toFixed(0)}%)`,
    };
  }

  // SE-1: Activity Compliance ← Lead-to-MQL conversion as proxy for activity effectiveness
  if (latest?.cvr_lead_mql != null) {
    const cvr = parseFloat(latest.cvr_lead_mql);
    scores['SE-1'] = {
      score: scoreFromThresholds(cvr, 0.08, 0.04),
      rationale: `Lead→MQL rate: ${(cvr * 100).toFixed(1)}% (proxy for activity quality)`,
    };
  }

  return scores;
}


// ── Trend data for UI charts (Phase 3) ───────────────────────────────────────

/**
 * Structure snapshot data for funnel trend and velocity charts.
 */
export function mapSnapshotToTrends(snapshot) {
  const volumeData = snapshot.volume_metrics?.data || [];
  const tisData = snapshot.time_in_stage?.data || [];

  const funnelTrend = volumeData.map(m => ({
    month: m.month,
    leads: parseInt(m.leads) || 0,
    mqls: parseInt(m.mqls) || 0,
    sqls: parseInt(m.sqls) || 0,
    sals: parseInt(m.sals) || 0,
    won: parseInt(m.won) || 0,
    live: parseInt(m.live) || 0,
    amount_won: m.amount_won || 0,
    new_arr: m.new_arr || 0,
    net_arr: m.net_arr || 0,
    cvr_lead_mql: parseFloat(m.cvr_lead_mql) || 0,
    cvr_sal_won: parseFloat(m.cvr_sal_won) || 0,
  }));

  const velocityTrend = tisData.map(m => ({
    month: m.month,
    lead_to_mql: parseFloat(m.lead_to_mql_days) || null,
    sql_to_sal: parseFloat(m.sql_to_sal_days) || null,
    sal_to_won: parseFloat(m.sal_to_won_days) || null,
    won_to_live: parseFloat(m.won_to_live_days) || null,
  }));

  return { funnelTrend, velocityTrend };
}
