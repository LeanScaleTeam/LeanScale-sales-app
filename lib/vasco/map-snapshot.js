/**
 * Maps a vasco_snapshots row into formats consumed by the diagnostic engine.
 *
 * Outputs:
 *   1. crm_health        → engagement_overrides.crm_health (SystemsHealth display, includes employees from context_graph)
 *   2. competency scores → consultant_assessments (12 competencies covered when full snapshot present)
 *   3. trend data        → structured for UI charts (funnel trends, velocity)
 *   4. tech stack overrides → engagement_overrides.techStack.tools (auto-populates TechStackGrid)
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
 * Extract an employees[] list from context_graph for the SystemsHealth display.
 * Vasco's context_graph contains org/people nodes — shape is best-effort across
 * versions. We accept any of: graph.employees, graph.people, graph.users, graph.nodes
 * (filtered by node_type === 'person'|'employee'|'user').
 */
function employeesFromContextGraph(contextGraph) {
  if (!contextGraph || typeof contextGraph !== 'object') return [];

  const direct = contextGraph.employees || contextGraph.people || contextGraph.users;
  if (Array.isArray(direct)) {
    return direct.map(normalizeEmployee).filter(Boolean);
  }

  if (Array.isArray(contextGraph.nodes)) {
    return contextGraph.nodes
      .filter(n => {
        const t = (n?.type || n?.node_type || '').toLowerCase();
        return t === 'person' || t === 'employee' || t === 'user';
      })
      .map(normalizeEmployee)
      .filter(Boolean);
  }

  return [];
}

function normalizeEmployee(node) {
  if (!node || typeof node !== 'object') return null;
  const name = node.name || node.full_name || node.display_name;
  if (!name) return null;
  return {
    name,
    role: node.role || node.title || node.job_title || null,
    department: node.department || node.team || null,
    integrity_score: node.integrity_score ?? node.score ?? null,
    events: node.event_count ?? node.events ?? null,
  };
}

/**
 * Convert a vasco_snapshots row → engagement_overrides.crm_health shape.
 */
export function mapSnapshotToCrmHealth(snapshot) {
  const integrity = snapshot.integrity_score || {};
  const issues = snapshot.integrity_issues?.issues || [];
  const volumeData = snapshot.volume_metrics?.data || [];
  const employees = employeesFromContextGraph(snapshot.context_graph);

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
    employees,
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
 * snapshot.tech_stack shape: { crm: 'Salesforce', call_recording: 'Gong', ... }
 * A non-empty string value indicates the tool is in place.
 *
 * Engine competency reminder (constants-v3.js):
 *   SY-1 CRM configuration & optimization
 *   SY-2 Marketing automation platform   (no direct Vasco signal — skip)
 *   SY-3 Sales engagement platform
 *   SY-4 CS / support platform
 *   SY-5 Partner management platform     (intake-only — skip)
 *   SY-6 Intelligence tools (enrichment, CI)
 *   SY-7 Integration / automation health
 *   RP-5 Revenue metrics (Power 10)
 *   RP-6 Forecasting methodology
 */

/**
 * Count integration / data infrastructure tools present in tech_stack —
 * input for SY-7 (Integration / automation health).
 */
function countIntegrationTools(techStack) {
  if (!techStack || typeof techStack !== 'object') return 0;
  const integrationKeys = ['data_warehouse', 'integration', 'etl', 'reverse_etl', 'ipaas'];
  return integrationKeys.filter(k => isFilled(techStack[k])).length;
}

/**
 * Count enrichment + conversation-intelligence tools — input for SY-6
 * (Intelligence tools — enrichment, CI). Falls back to scanning context_graph
 * for known vendor names.
 */
function countIntelligenceTools(techStack, contextGraph) {
  let count = 0;
  if (techStack && typeof techStack === 'object') {
    if (isFilled(techStack.data_enrichment) || isFilled(techStack.enrichment)) count += 1;
    if (isFilled(techStack.call_recording) || isFilled(techStack.conversation_intelligence)) count += 1;
    if (isFilled(techStack.marketing_analytics)) count += 1;
  }
  // Context graph fallback — look for known enrichment / CI vendor names
  const intelVendors = /zoominfo|clearbit|apollo|cognism|lusha|clay|6sense|demandbase|gong|chorus|fireflies|avoma|jiminny/i;
  if (contextGraph && Array.isArray(contextGraph.tools)) {
    for (const t of contextGraph.tools) {
      const name = t?.name || t?.vendor || '';
      if (intelVendors.test(name)) count += 1;
    }
  }
  return count;
}

function isFilled(v) {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return Boolean(v);
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
  // Departments: all (marketing, sales, cs, partners)
  if (integrity.score != null) {
    scores['SY-1'] = {
      score: scoreFromThresholds(integrity.score, 90, 70),
      rationale: `Integrity score: ${Math.round(integrity.score)}% (${integrity.fail || 0} failing events)`,
    };
  }

  // PR-10: Pipeline management ← SAL-to-Won conversion (win rate)
  // Departments: sales
  if (latest?.cvr_sal_won != null) {
    const winRate = parseFloat(latest.cvr_sal_won);
    scores['PR-10'] = {
      score: scoreFromThresholds(winRate, 0.20, 0.10),
      rationale: `Win rate: ${(winRate * 100).toFixed(1)}% (SAL→Won)`,
    };
  }

  // PR-2: Sales lifecycle / pipeline design ← time in stage SAL→Won (days, lower is better)
  // Departments: sales
  if (latestTis?.sal_to_won_days != null && latestTis.sal_to_won_days > 0) {
    const days = parseFloat(latestTis.sal_to_won_days);
    scores['PR-2'] = {
      score: days <= 30 ? 5 : days <= 60 ? 3 : 1,
      rationale: `Sales cycle: ${Math.round(days)} days (SAL→Won)`,
    };
  }

  // PR-3: Customer lifecycle definition ← NRR month-over-month trend
  // Departments: cs
  if (latest?.net_arr != null && prior?.net_arr != null && prior.net_arr > 0) {
    const growth = latest.net_arr / prior.net_arr;
    scores['PR-3'] = {
      score: scoreFromThresholds(growth, 1.0, 0.9),
      rationale: `Net ARR trend: ${(growth * 100).toFixed(0)}% MoM (${Math.round(latest.net_arr / 1000)}K → ${Math.round(prior.net_arr / 1000)}K)`,
    };
  }

  // PR-1: Lead lifecycle definition ← MQL volume trend (growth)
  // Departments: marketing
  if (latest?.mqls != null && prior?.mqls != null && prior.mqls > 0) {
    const growth = latest.mqls / prior.mqls;
    scores['PR-1'] = {
      score: scoreFromThresholds(growth, 0.9, 0.6),
      rationale: `MQL trend: ${latest.mqls} vs ${prior.mqls} prior month (${(growth * 100).toFixed(0)}%)`,
    };
  }

  // SY-3: Sales engagement platform ← Lead-to-MQL conversion as proxy for activity quality
  // Departments: sales
  if (latest?.cvr_lead_mql != null) {
    const cvr = parseFloat(latest.cvr_lead_mql);
    scores['SY-3'] = {
      score: scoreFromThresholds(cvr, 0.08, 0.04),
      rationale: `Lead→MQL rate: ${(cvr * 100).toFixed(1)}% (proxy for activity quality)`,
    };
  }

  // RP-5: Revenue metrics (Power 10) ← pipeline coverage as a primary Power 10 signal.
  // Score green if ≥3x quota, yellow if ≥2x. Pipeline coverage indicates that
  // the team is actively tracking and managing the core Power 10 revenue metric.
  const pipelineCoverage = readPipelineCoverage(snapshot, latest);
  if (pipelineCoverage != null) {
    scores['RP-5'] = {
      score: scoreFromThresholds(pipelineCoverage, 3.0, 2.0),
      rationale: `Pipeline coverage: ${pipelineCoverage.toFixed(2)}x quota (Power 10 metric, target ≥3x)`,
    };
  }

  // RP-6: Forecasting methodology ← forecast vs. actuals variance.
  // Variance ≤10% = mature forecasting (5); ≤25% = developing (3); else = ad hoc (1).
  const forecastAccuracy = readForecastAccuracy(snapshot, latest);
  if (forecastAccuracy != null) {
    const variance = Math.abs(1 - forecastAccuracy);
    scores['RP-6'] = {
      score: variance <= 0.10 ? 5 : variance <= 0.25 ? 3 : 1,
      rationale: `Forecast accuracy: ${(forecastAccuracy * 100).toFixed(0)}% of forecast (variance ${(variance * 100).toFixed(0)}%)`,
    };
  }

  // SY-4 (CS / support platform), SY-6 (Intelligence tools — enrichment, CI),
  // SY-7 (Integration / automation health), RP-6 (Forecasting methodology)
  // ← derived from snapshot.tech_stack and context_graph
  const techStack = snapshot.tech_stack || null;
  const contextGraph = snapshot.context_graph || null;

  if (techStack) {
    // SY-4: CS / support platform — Gainsight, ChurnZero, Zendesk, etc.
    if (isFilled(techStack.cs_platform) || isFilled(techStack.customer_success) || isFilled(techStack.support)) {
      const hit = techStack.cs_platform || techStack.customer_success || techStack.support;
      scores['SY-4'] = {
        score: 5,
        rationale: `CS / support platform: ${hit} (from Vasco tech stack)`,
      };
    } else if (Object.keys(techStack).length > 0) {
      scores['SY-4'] = {
        score: 1,
        rationale: 'No CS / support platform detected in Vasco tech stack',
      };
    }

    // SY-6: Intelligence tools — enrichment + conversation intelligence
    const intelCount = countIntelligenceTools(techStack, contextGraph);
    scores['SY-6'] = {
      score: intelCount >= 2 ? 5 : intelCount === 1 ? 3 : 1,
      rationale: `Intelligence tools detected: ${intelCount} (enrichment + conversation intel)`,
    };

    // SY-7: Integration / automation health — data warehouse, iPaaS, ETL
    const integrationCount = countIntegrationTools(techStack);
    scores['SY-7'] = {
      score: integrationCount >= 2 ? 5 : integrationCount === 1 ? 3 : 1,
      rationale: `Integration / data infrastructure tools: ${integrationCount} (warehouse / iPaaS / ETL)`,
    };

    // RP-6 platform signal — boost when a forecasting platform is in place
    // (combined with the metric-based score below; tool-only is 3, with metric we use the metric score)
    const forecastingHit = techStack.forecasting || techStack.revenue_intelligence || techStack.rev_ops;
    if (isFilled(forecastingHit) && !scores['RP-6']) {
      scores['RP-6'] = {
        score: 3,
        rationale: `Forecasting platform: ${forecastingHit} (no accuracy metric available — partial credit)`,
      };
    }
  }

  return scores;
}

/**
 * Try several known shapes for pipeline coverage in Vasco snapshots.
 * Priority: explicit metric → computed (pipeline / quota) → null.
 */
function readPipelineCoverage(snapshot, latestVolume) {
  if (latestVolume?.pipeline_coverage != null) return parseFloat(latestVolume.pipeline_coverage);
  if (snapshot.metrics?.pipeline_coverage?.actual != null) return parseFloat(snapshot.metrics.pipeline_coverage.actual);
  if (snapshot.metrics?.pipeline_coverage != null && typeof snapshot.metrics.pipeline_coverage === 'number') {
    return parseFloat(snapshot.metrics.pipeline_coverage);
  }
  // Compute from open_pipeline + quota when both are present
  const pipeline = latestVolume?.open_pipeline ?? latestVolume?.pipeline_value;
  const quota = latestVolume?.quota ?? snapshot.metrics?.quota?.actual ?? snapshot.metrics?.quota;
  if (pipeline != null && quota != null && quota > 0) {
    return parseFloat(pipeline) / parseFloat(quota);
  }
  return null;
}

/**
 * Try several known shapes for forecast accuracy. Returns ratio (e.g. 0.92 = 92% of forecast).
 */
function readForecastAccuracy(snapshot, latestVolume) {
  if (latestVolume?.forecast_accuracy != null) return parseFloat(latestVolume.forecast_accuracy);
  if (snapshot.metrics?.forecast_accuracy?.actual != null) return parseFloat(snapshot.metrics.forecast_accuracy.actual);
  if (snapshot.metrics?.forecast_accuracy != null && typeof snapshot.metrics.forecast_accuracy === 'number') {
    return parseFloat(snapshot.metrics.forecast_accuracy);
  }
  // Compute from forecast vs. actual when both present
  const actual = latestVolume?.amount_won ?? latestVolume?.actual_revenue;
  const forecast = latestVolume?.forecast ?? latestVolume?.forecasted_revenue;
  if (actual != null && forecast != null && forecast > 0) {
    return parseFloat(actual) / parseFloat(forecast);
  }
  return null;
}


// ── GTM matrix → Planning / Reporting / Process scores (Phase 5) ─────────────

/**
 * Convert a Vasco matrix status string → diagnostic 1-5 score.
 * Returns null for Paused / N/A (skip — not enough info).
 */
const MATRIX_STATUS_TO_SCORE = {
  'OK': 5,
  'Set': 5,
  'Working': 4,
  'To Double Check': 3,
  'Needs Refinement': 3,
  'Needs Work': 2,
  'Need': 1,
  'Not Set': 1,
  'Paused': null,
  'N/A': null,
};

function matrixStatusToScore(status) {
  if (!status) return null;
  const score = MATRIX_STATUS_TO_SCORE[status];
  return score === undefined ? null : score;
}

/**
 * Pull a status entry from the matrix tree.
 * matrix_statuses shape is nested: { planning: { top_down_summary: { status, notes, inferred }, ... }, ... }
 * Returns the entry object or null. Tries exact category->field path then falls
 * back to scanning all categories.
 */
function readMatrixField(matrix, field, preferredCategories = []) {
  if (!matrix || typeof matrix !== 'object') return null;
  for (const cat of preferredCategories) {
    const entry = matrix[cat]?.[field];
    if (entry && typeof entry === 'object') return entry;
  }
  // Top-level field (some snapshots flatten unit_economics)
  if (matrix[field] && typeof matrix[field] === 'object' && 'status' in matrix[field]) {
    return matrix[field];
  }
  // Fallback scan
  for (const v of Object.values(matrix)) {
    if (v && typeof v === 'object' && v[field] && typeof v[field] === 'object' && 'status' in v[field]) {
      return v[field];
    }
  }
  return null;
}

function avgScores(...vals) {
  const filtered = vals.filter(v => v != null);
  if (filtered.length === 0) return null;
  const sum = filtered.reduce((a, b) => a + b, 0);
  return Math.round(sum / filtered.length);
}

/**
 * Derive competency scores from snapshot.matrix_statuses.
 * Returns the same shape as mapSnapshotToCompetencyScores so callers can merge.
 */
export function mapMatrixStatusesToCompetencyScores(snapshot) {
  const matrix = snapshot.matrix_statuses;
  if (!matrix || typeof matrix !== 'object') return {};

  const scores = {};

  // PL-1: Operating plan ← combination of top_down_summary + acquisition targets
  const summary = readMatrixField(matrix, 'top_down_summary', ['planning']);
  const acqTargets = readMatrixField(matrix, 'top_down_acquisition_targets', ['planning']);
  const pl1 = avgScores(matrixStatusToScore(summary?.status), matrixStatusToScore(acqTargets?.status));
  if (pl1 != null) {
    scores['PL-1'] = {
      score: pl1,
      rationale: `Operating plan from GTM matrix: top-down summary ${summary?.status || '—'}, acquisition targets ${acqTargets?.status || '—'}`,
    };
  }

  // PL-2: Capacity / headcount model ← bottom_up (individual targets)
  const bottomUp = readMatrixField(matrix, 'bottom_up', ['planning']);
  const pl2 = matrixStatusToScore(bottomUp?.status);
  if (pl2 != null) {
    scores['PL-2'] = {
      score: pl2,
      rationale: `Bottom-up individual targets in GTM matrix: ${bottomUp.status}`,
    };
  }

  // PL-3: Budget allocation ← unit_economics (closest fit — both about $ planning)
  const unitEcon = readMatrixField(matrix, 'unit_economics', ['unit_economics']);
  const pl3 = matrixStatusToScore(unitEcon?.status);
  if (pl3 != null) {
    scores['PL-3'] = {
      score: pl3,
      rationale: `Unit economics in GTM matrix: ${unitEcon.status}`,
    };
  }

  // RP-1: Executive dashboards ← bi_dashboards
  const biDash = readMatrixField(matrix, 'bi_dashboards', ['reporting']);
  const rp1 = matrixStatusToScore(biDash?.status);
  if (rp1 != null) {
    scores['RP-1'] = {
      score: rp1,
      rationale: `BI dashboards status in GTM matrix: ${biDash.status}`,
    };
  }

  // PR-8: ABM / target account process ← icp
  const icp = readMatrixField(matrix, 'icp', ['reporting']);
  const pr8 = matrixStatusToScore(icp?.status);
  if (pr8 != null) {
    scores['PR-8'] = {
      score: pr8,
      rationale: `ICP definition in GTM matrix: ${icp.status}`,
    };
  }

  // PR-1: Lead lifecycle definition ← lifecycle_stages (only set if not already
  // scored from MQL trend metrics — those are stronger signals)
  const lifecycle = readMatrixField(matrix, 'lifecycle_stages', ['crm_connection']);
  const lifecycleScore = matrixStatusToScore(lifecycle?.status);
  if (lifecycleScore != null) {
    scores['_PR-1_matrix'] = {  // namespaced — caller will use as fallback
      score: lifecycleScore,
      rationale: `Lifecycle stages in GTM matrix: ${lifecycle.status}`,
    };
  }

  return scores;
}


// ── Tech stack overrides for TechStackGrid (Phase 4) ─────────────────────────

/**
 * Vendor-name patterns → TechStackGrid tool IDs.
 * Order matters: more specific patterns first. Each entry is matched against
 * tech_stack values (which may be free-form strings like "Gong + Fireflies").
 */
const TECH_STACK_VENDOR_PATTERNS = [
  // CRM
  { pattern: /salesforce|sfdc/i,     toolId: 'salesforce' },
  { pattern: /hubspot.*crm|hubspot$/i, toolId: 'hubspot-crm' },
  { pattern: /dynamics/i,            toolId: 'dynamics' },
  { pattern: /pipedrive/i,           toolId: 'pipedrive' },
  { pattern: /zoho/i,                toolId: 'zoho-crm' },
  // Marketing automation
  { pattern: /hubspot.*market/i,     toolId: 'hubspot-mktg' },
  { pattern: /marketo/i,             toolId: 'marketo' },
  { pattern: /pardot|marketing.cloud/i, toolId: 'pardot' },
  { pattern: /eloqua/i,              toolId: 'eloqua' },
  { pattern: /activecampaign/i,      toolId: 'activecampaign' },
  { pattern: /mailchimp/i,           toolId: 'mailchimp' },
  { pattern: /klaviyo/i,             toolId: 'klaviyo' },
  { pattern: /braze/i,               toolId: 'braze' },
  { pattern: /iterable/i,            toolId: 'iterable' },
  { pattern: /customer\.?io/i,       toolId: 'customer-io' },
  { pattern: /brevo|sendinblue/i,    toolId: 'brevo' },
  // Sales engagement
  { pattern: /outreach/i,            toolId: 'outreach' },
  { pattern: /salesloft/i,           toolId: 'salesloft' },
  { pattern: /apollo/i,              toolId: 'apollo' },
  { pattern: /amplemarket/i,         toolId: 'amplemarket' },
  { pattern: /groove/i,              toolId: 'groove' },
  { pattern: /instantly/i,           toolId: 'instantly' },
  { pattern: /mixmax/i,              toolId: 'mixmax' },
  { pattern: /reply\.?io/i,          toolId: 'reply-io' },
  { pattern: /lemlist/i,             toolId: 'lemlist' },
  // Conversation intelligence
  { pattern: /gong/i,                toolId: 'gong' },
  { pattern: /chorus/i,              toolId: 'chorus' },
  { pattern: /clari.copilot/i,       toolId: 'clari-copilot' },
  { pattern: /fireflies/i,           toolId: 'fireflies' },
  { pattern: /avoma/i,               toolId: 'avoma' },
  { pattern: /jiminny/i,             toolId: 'jiminny' },
  { pattern: /otter/i,               toolId: 'otter' },
  // Forecasting / RevOps
  { pattern: /clari(?!.copilot)/i,   toolId: 'clari' },
  { pattern: /aviso/i,               toolId: 'aviso' },
  { pattern: /boostup/i,             toolId: 'boostup' },
  { pattern: /insightsquared/i,      toolId: 'insightsquared' },
  { pattern: /people\.?ai/i,         toolId: 'people-ai' },
  { pattern: /scratchpad/i,          toolId: 'scratchpad' },
  { pattern: /weflow/i,              toolId: 'weflow' },
  { pattern: /ebsta/i,               toolId: 'ebsta' },
  // Data enrichment
  { pattern: /zoominfo|zi_/i,        toolId: 'zoominfo' },
  { pattern: /clearbit/i,            toolId: 'clearbit' },
  { pattern: /clay/i,                toolId: 'clay' },
  { pattern: /cognism/i,             toolId: 'cognism' },
  { pattern: /lusha/i,               toolId: 'lusha' },
  { pattern: /bombora/i,             toolId: 'bombora' },
  { pattern: /leadiq/i,              toolId: 'leadiq' },
  { pattern: /seamless/i,            toolId: 'seamless' },
  // ABM
  { pattern: /6sense/i,              toolId: '6sense' },
  { pattern: /demandbase/i,          toolId: 'demandbase' },
  { pattern: /terminus/i,            toolId: 'terminus' },
  { pattern: /rollworks/i,           toolId: 'rollworks' },
  // CS
  { pattern: /gainsight/i,           toolId: 'gainsight' },
  { pattern: /churnzero/i,           toolId: 'churnzero' },
  { pattern: /vitally/i,             toolId: 'vitally' },
  { pattern: /totango/i,             toolId: 'totango' },
  { pattern: /planhat/i,             toolId: 'planhat' },
  { pattern: /catalyst/i,            toolId: 'catalyst' },
  // Support
  { pattern: /zendesk/i,             toolId: 'zendesk' },
  { pattern: /intercom/i,            toolId: 'intercom' },
  { pattern: /freshdesk/i,           toolId: 'freshdesk' },
  // Enablement
  { pattern: /highspot/i,            toolId: 'highspot' },
  { pattern: /seismic/i,             toolId: 'seismic' },
  { pattern: /showpad/i,             toolId: 'showpad' },
  { pattern: /\bguru\b/i,            toolId: 'guru' },
  { pattern: /mindtickle/i,          toolId: 'mindtickle' },
  { pattern: /mediafly/i,            toolId: 'mediafly' },
  // CPQ / Billing
  { pattern: /\bcpq\b|salesforce.cpq/i, toolId: 'sf-cpq' },
  { pattern: /dealhub/i,             toolId: 'dealhub' },
  { pattern: /conga/i,               toolId: 'conga' },
  { pattern: /docusign/i,            toolId: 'docusign' },
  { pattern: /pandadoc/i,            toolId: 'pandadoc' },
  { pattern: /zuora/i,               toolId: 'zuora' },
  { pattern: /chargebee/i,           toolId: 'chargebee' },
  { pattern: /stripe/i,              toolId: 'stripe-billing' },
  { pattern: /quickbooks|netsuite/i, toolId: null }, // ERP — no matching toolId in catalog
  // Commission
  { pattern: /captivateiq/i,         toolId: 'captivateiq' },
  { pattern: /spiff/i,               toolId: 'spiff' },
  { pattern: /xactly/i,              toolId: 'xactly' },
  { pattern: /performio/i,           toolId: 'performio' },
  { pattern: /everstage/i,           toolId: 'everstage' },
  // BI
  { pattern: /looker/i,              toolId: 'looker' },
  { pattern: /tableau/i,             toolId: 'tableau' },
  { pattern: /power.?bi/i,           toolId: 'powerbi' },
  { pattern: /\bdomo\b/i,            toolId: 'domo' },
  // Integration / Data infra
  { pattern: /zapier/i,              toolId: 'zapier' },
  { pattern: /workato/i,             toolId: 'workato' },
  { pattern: /\bmake\b/i,            toolId: 'make' },
  { pattern: /tray\.?io/i,           toolId: 'tray-io' },
  { pattern: /mulesoft/i,            toolId: 'mulesoft' },
  { pattern: /celigo/i,              toolId: 'celigo' },
  { pattern: /fivetran/i,            toolId: 'fivetran' },
  { pattern: /segment/i,             toolId: 'segment' },
  { pattern: /\bcensus\b/i,          toolId: 'census' },
  { pattern: /hightouch/i,           toolId: 'hightouch' },
  { pattern: /bigquery|snowflake|redshift|databricks/i, toolId: null }, // warehouses not in catalog
  // Product analytics
  { pattern: /amplitude/i,           toolId: 'amplitude' },
  { pattern: /mixpanel/i,            toolId: 'mixpanel' },
  { pattern: /pendo/i,               toolId: 'pendo' },
  { pattern: /\bheap\b/i,            toolId: 'heap' },
  { pattern: /fullstory/i,           toolId: 'fullstory' },
  { pattern: /posthog/i,             toolId: 'posthog' },
  { pattern: /appcues/i,             toolId: 'appcues' },
  { pattern: /launchdarkly/i,        toolId: 'launchdarkly' },
  // Routing
  { pattern: /leandata/i,            toolId: 'leandata' },
  { pattern: /chili.?piper/i,        toolId: 'chili-piper' },
];

/**
 * Convert snapshot.tech_stack → engagement_overrides.techStack.tools shape.
 *
 * Input  : { crm: 'Salesforce', call_recording: 'Gong + Fireflies', billing: '', ... }
 * Output : { salesforce: 'adopted', gong: 'adopted', fireflies: 'adopted' }
 *
 * Values may contain multiple vendors (comma/semicolon/+ separated). All matched.
 * Empty / null / "—" values are skipped (treated as absence — TechStackGrid renders
 * those categories as gaps already).
 */
export function mapSnapshotToTechStackOverrides(snapshot) {
  const techStack = snapshot.tech_stack;
  if (!techStack || typeof techStack !== 'object') return null;

  const tools = {};

  for (const value of Object.values(techStack)) {
    if (!isFilled(value)) continue;
    const str = String(value);

    // Skip placeholder values
    if (/^[—\-–na/]+$/i.test(str.trim())) continue;

    // Match every pattern that hits — a single value can list multiple vendors
    for (const { pattern, toolId } of TECH_STACK_VENDOR_PATTERNS) {
      if (toolId && pattern.test(str)) {
        tools[toolId] = 'adopted';
      }
    }
  }

  return Object.keys(tools).length > 0 ? tools : null;
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
