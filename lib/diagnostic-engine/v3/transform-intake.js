/**
 * Intake Answer Transformer
 *
 * Maps raw intake form keys (A1, B1_tools, C1, D2, D5_arr, etc.)
 * to semantic keys expected by v3 graders (dashboard_trust,
 * forecasting_methodology, power10_metrics_count, etc.).
 *
 * The raw answers are preserved; semantic keys are added alongside them.
 */

/**
 * Transform raw intake answers into grader-friendly keys.
 *
 * @param {object} raw - Raw intake answers (keys like A1, D2, C13, etc.)
 * @returns {object} Extended answers with semantic keys added
 */
export function transformIntakeForV3(raw = {}) {
  const out = { ...raw };

  // ── D2 → dashboard_trust ──
  // Maps "Are dashboards trusted?" to the trust level used by RP-1
  const d2 = raw.D2;
  if (d2 === 'Yes, primary tool') out.dashboard_trust = 'high';
  else if (d2 === 'Somewhat') out.dashboard_trust = 'medium';
  else if (d2 === 'Not really') out.dashboard_trust = 'low';
  else if (d2 === 'No dashboards') out.dashboard_trust = 'low';

  // ── D3 → forecasting_methodology ──
  // Maps "How is sales forecasting done?" to methodology level used by RP-6
  const d3 = raw.D3;
  if (d3 === 'CRM forecast tool' || d3 === 'AI/tool-assisted') out.forecasting_methodology = 'structured_tool';
  else if (d3 === 'Spreadsheet') out.forecasting_methodology = 'structured';
  else if (d3 === 'Gut feel') out.forecasting_methodology = 'gut_feel';
  else if (d3 === 'Not done') out.forecasting_methodology = 'none';

  // ── D5_* Power 10 → power10_metrics_count ──
  // Count of Power 10 metrics the org can report (Automated or Manual calc)
  const p10Keys = [
    'D5_arr', 'D5_bookings', 'D5_pipeline', 'D5_mql', 'D5_gross_churn',
    'D5_grr', 'D5_nrr', 'D5_mql_opp', 'D5_opp_cw', 'D5_cycle',
  ];
  const p10Count = p10Keys.filter((k) =>
    raw[k] === 'Automated' || raw[k] === 'Manual calc'
  ).length;
  if (p10Keys.some((k) => raw[k])) {
    out.power10_metrics_count = p10Count;
  }

  // ── B1_tools → tool detection flags ──
  const tools = Array.isArray(raw.B1_tools) ? raw.B1_tools : [];
  out.has_enablement_tool_intake = tools.includes('enablement_platform');
  out.has_prm_tool_intake = tools.includes('prm_tool');
  out.has_forecasting_tool_intake = tools.includes('forecasting_tool');
  out.has_lms_tool_intake = tools.includes('lms');
  out.has_abm_tool_intake = tools.includes('abm_tool');
  out.has_ci_tool_intake = tools.includes('conversation_intel');
  out.has_se_tool_intake = tools.includes('sales_engagement');
  out.has_csp_tool_intake = tools.includes('csp');
  out.has_bi_tool_intake = tools.includes('bi_analytics');
  out.has_support_tool_intake = tools.includes('support');

  // ── C13 → operating_plan (PL-1) ──
  const c13 = raw.C13;
  if (c13 === 'Yes quarterly') out.operating_plan = 'quarterly';
  else if (c13 === 'Yes annual') out.operating_plan = 'annual';
  else if (c13 === 'Informal') out.operating_plan = 'informal';
  else if (c13 === 'No') out.operating_plan = 'none';

  // ── C14 → capacity_plan (PL-2) ──
  const c14 = raw.C14;
  if (c14 === 'Yes with revenue tie') out.capacity_plan = 'revenue_tied';
  else if (c14 === 'Basic') out.capacity_plan = 'basic';
  else if (c14 === 'No') out.capacity_plan = 'none';

  // ── C15 → review_cadence (PL-5) ──
  const c15 = raw.C15;
  if (c15 === 'D/W/M/Q') out.review_cadence = 'full';
  else if (c15 === 'W/M/Q') out.review_cadence = 'good';
  else if (c15 === 'Monthly') out.review_cadence = 'monthly';
  else if (c15 === 'Quarterly') out.review_cadence = 'quarterly';
  else if (c15 === 'None') out.review_cadence = 'none';

  // ── C16 → manager_dashboard_access (RP-2) ──
  const c16 = raw.C16;
  if (c16 === 'Yes per team') out.manager_dashboard_access = 'per_team';
  else if (c16 === 'Shared') out.manager_dashboard_access = 'shared';
  else if (c16 === 'No') out.manager_dashboard_access = 'none';

  // ── C17 → ic_crm_usage (RP-3) ──
  const c17 = raw.C17;
  if (c17 === 'Yes with personal views') out.ic_crm_usage = 'daily_personalized';
  else if (c17 === 'Yes basic') out.ic_crm_usage = 'daily_basic';
  else if (c17 === 'No') out.ic_crm_usage = 'none';

  // ── C18 → coaching_program (EN-3) ──
  const c18 = raw.C18;
  if (c18 === 'Yes with CI') out.coaching_program = 'structured_ci';
  else if (c18 === 'Yes informal') out.coaching_program = 'informal';
  else if (c18 === 'No') out.coaching_program = 'none';

  // ── D5 → report_distribution (RP-4) ──
  const d5 = raw.D5;
  if (d5 === 'Automated schedule') out.report_distribution = 'automated';
  else if (d5 === 'Manual email') out.report_distribution = 'manual';
  else if (d5 === 'On-demand') out.report_distribution = 'on_demand';
  else if (d5 === 'Not distributed') out.report_distribution = 'none';

  // ── D6 → playbook_status (EN-5) ──
  const d6 = raw.D6;
  if (d6 === 'Yes in enablement platform') out.playbook_status = 'platform';
  else if (d6 === 'Yes in docs') out.playbook_status = 'docs';
  else if (d6 === 'Tribal knowledge') out.playbook_status = 'tribal';
  else if (d6 === 'No') out.playbook_status = 'none';

  // ── C4 → sales methodology (enhanced) ──
  const c4 = raw.C4;
  if (c4 === 'MEDDIC/MEDDPICC') out.sales_methodology = 'meddic';
  else if (c4 === 'BANT') out.sales_methodology = 'bant';
  else if (c4 === 'SPICED') out.sales_methodology = 'spiced';
  else if (c4 === 'Custom framework') out.sales_methodology = 'custom';
  else if (c4 === 'Multiple') out.sales_methodology = 'multiple';
  else if (c4 === 'None') out.sales_methodology = 'none';

  return out;
}
