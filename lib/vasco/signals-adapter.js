/**
 * Vasco → computedSignals adapter.
 *
 * Converts a vasco_snapshots row into the same `computedSignals` shape that
 * salesforce_metadata.computed_signals and hubspot_metadata.computed_signals
 * produce, so the v3 graders can run on a Vasco snapshot without any CRM data.
 *
 * Coverage is partial — Vasco does not expose schema-level CRM signals
 * (apex_trigger_count, validation_rule_count, custom_field_count, etc.).
 * Signals it can produce:
 *   - Tool presence flags (has_sales_engagement_tool, has_conversation_intelligence, ...)
 *   - User/owner counts from context_graph
 *   - Dashboard / report counts from matrix_statuses (coarse — derived from
 *     bi_dashboards status, not actual API counts)
 *   - Pipeline / stage counts from gtm_stages
 *
 * Anything missing falls through to null/0/false; graders gracefully return
 * null base scores and let consultant/transcript layers fill in. This is
 * acceptable because the same snapshot also writes scores directly to
 * consultant_assessments via mapSnapshotToCompetencyScores.
 */

function isFilled(v) {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim().length > 0 && !/^[—\-–na/]+$/i.test(v.trim());
  if (Array.isArray(v)) return v.length > 0;
  return Boolean(v);
}

/**
 * Map matrix status to a coarse count signal. "OK"/"Set" -> high, "Working" ->
 * medium, "Needs ..." -> low, "Need"/"Not Set" -> 0.
 */
function statusToCount(status, scale = { high: 5, med: 3, low: 1, none: 0 }) {
  if (!status) return scale.none;
  if (status === 'OK' || status === 'Set') return scale.high;
  if (status === 'Working') return scale.med;
  if (status === 'To Double Check' || status === 'Needs Refinement' || status === 'Needs Work') return scale.low;
  return scale.none;
}

function readMatrixStatus(matrix, field) {
  if (!matrix || typeof matrix !== 'object') return null;
  for (const cat of Object.values(matrix)) {
    if (cat && typeof cat === 'object' && cat[field] && typeof cat[field] === 'object') {
      return cat[field].status || null;
    }
  }
  return null;
}

/**
 * Build a computedSignals object from a Vasco snapshot.
 */
export function vascoSnapshotToComputedSignals(snapshot) {
  if (!snapshot) return {};

  const techStack = snapshot.tech_stack || {};
  const contextGraph = snapshot.context_graph || {};
  const matrix = snapshot.matrix_statuses || {};
  const stages = snapshot.gtm_stages?.stages || {};

  // Tool presence flags from tech_stack
  const signals = {
    // Sales engagement / conversation intel
    has_sales_engagement_tool: isFilled(techStack.sales_engagement),
    has_conversation_intelligence: isFilled(techStack.call_recording) || isFilled(techStack.conversation_intelligence),
    // Enablement
    has_enablement_platform: isFilled(techStack.enablement) || isFilled(techStack.sales_enablement),
    has_enablement_package: isFilled(techStack.enablement) || isFilled(techStack.sales_enablement),
    // Commission
    has_commission_tool: isFilled(techStack.commission),
    has_commission_fields: false, // CRM-only signal — leave false
    // Forecasting
    has_forecasting_config: isFilled(techStack.forecasting),
    // Partner
    has_partner_pipeline: isFilled(techStack.partner_management) || isFilled(techStack.prm),
    // Marketing automation
    has_marketing_automation_package: isFilled(techStack.marketing_automation),
    // Enrichment
    enrichment_tools: enrichmentToolsFromTechStack(techStack),
    // Support / CS
    has_cs_platform_installed: isFilled(techStack.cs_platform) || isFilled(techStack.customer_success),
    has_support_tool: isFilled(techStack.support),
    // ABM
    has_abm_tool: isFilled(techStack.abm),
    // PRM
    has_prm_tool: isFilled(techStack.partner_management) || isFilled(techStack.prm),
  };

  // User / team counts from context_graph
  const employees = readEmployees(contextGraph);
  if (employees.length > 0) {
    signals.total_users = employees.length;
    signals.total_owners = employees.length;
    signals.owner_to_team_coverage = 1.0; // assume connected employees are all owners
    signals.team_count = countDepartments(employees);
  }

  // Dashboards / reports — derived from matrix (coarse)
  const biStatus = readMatrixStatus(matrix, 'bi_dashboards');
  if (biStatus) {
    const dashCount = statusToCount(biStatus, { high: 8, med: 4, low: 2, none: 0 });
    signals.exec_dashboard_count = dashCount >= 4 ? Math.floor(dashCount / 2) : 0;
    signals.manager_dashboard_count = dashCount;
    signals.dashboard_count = dashCount + signals.exec_dashboard_count;
    signals.report_count = dashCount * 3;
    signals.department_report_folders = dashCount >= 4 ? 4 : dashCount >= 2 ? 2 : 0;
  }

  // Review cadence — derived from matrix digest_activation
  const digestStatus = readMatrixStatus(matrix, 'digest_activation');
  if (digestStatus) {
    signals.recurring_review_event_count = statusToCount(digestStatus, { high: 12, med: 6, low: 2, none: 0 });
    if (signals.recurring_review_event_count >= 6) {
      signals.cadence_types = ['weekly', 'monthly', 'quarterly'];
    } else if (signals.recurring_review_event_count >= 2) {
      signals.cadence_types = ['monthly'];
    }
  }

  // Pipeline stage counts from gtm_stages
  if (stages && typeof stages === 'object') {
    const stageList = Array.isArray(stages) ? stages : Object.values(stages);
    if (stageList.length > 0) {
      signals.pipeline_stage_count = stageList.length;
    }
  }

  // CRM type marker — graders that branch on CRM type can detect Vasco-only
  signals._vasco_only = true;
  signals._vasco_snapshot_id = snapshot.id;
  signals._vasco_snapshot_date = snapshot.snapshot_date;

  return signals;
}

function readEmployees(contextGraph) {
  const direct = contextGraph.employees || contextGraph.people || contextGraph.users;
  if (Array.isArray(direct)) return direct;
  if (Array.isArray(contextGraph.nodes)) {
    return contextGraph.nodes.filter(n => {
      const t = (n?.type || n?.node_type || '').toLowerCase();
      return t === 'person' || t === 'employee' || t === 'user';
    });
  }
  return [];
}

function countDepartments(employees) {
  const depts = new Set();
  for (const e of employees) {
    const d = e?.department || e?.team;
    if (d) depts.add(String(d).toLowerCase());
  }
  return depts.size || 1;
}

const ENRICHMENT_PATTERNS = /zoominfo|clearbit|apollo|cognism|lusha|clay|6sense|demandbase|leadiq|seamless/i;

function enrichmentToolsFromTechStack(techStack) {
  const tools = [];
  for (const [, value] of Object.entries(techStack || {})) {
    if (!isFilled(value)) continue;
    const str = String(value);
    if (ENRICHMENT_PATTERNS.test(str)) {
      tools.push({ name: str });
    }
  }
  return tools;
}

/**
 * Merge Vasco-derived signals into existing CRM signals.
 * CRM signals win when both have the same key (CRM data is fresher / more
 * authoritative on schema-level signals). Vasco fills the gaps.
 */
export function mergeVascoSignals(crmSignals, vascoSignals) {
  if (!vascoSignals) return crmSignals || {};
  if (!crmSignals || Object.keys(crmSignals).length === 0) return vascoSignals;

  const merged = { ...vascoSignals };
  for (const [key, value] of Object.entries(crmSignals)) {
    // CRM-derived booleans that are true should win
    // CRM-derived numeric counts should always win (they're real measurements)
    // Vasco fills only when CRM is missing the key entirely
    if (value !== null && value !== undefined && value !== false && value !== 0) {
      merged[key] = value;
    } else if (key in crmSignals && !(key in vascoSignals)) {
      merged[key] = value;
    }
  }
  return merged;
}
