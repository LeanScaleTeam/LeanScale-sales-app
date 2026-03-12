// lib/diagnostic-engine/signal-merger.js

/**
 * Signal Merger — Combines Salesforce (CRM) and HubSpot (MAP) signals.
 *
 * Domain Authority Model:
 * - SF owns CRM/ops signals: pipelines, objects, users, roles, platform health
 *   -> drives Sales, CS, Partners department scores in v3
 * - HS owns marketing signals: forms, emails, campaigns, workflows, attribution
 *   -> drives Marketing department scores in v3
 * - Overlapping counts are summed (total_automation_count = SF flows + HS workflows)
 * - Boolean signals use OR (has_enrichment = SF enrichment || HS enrichment)
 */

// Keys where Salesforce is the authority (sales ops, CS, partners)
const SF_AUTHORITATIVE_KEYS = [
  'pipeline_stage_count', 'total_users', 'role_count', 'profile_count',
  'permission_set_count', 'record_type_count', 'validation_rule_count',
  'apex_trigger_count', 'apex_class_count', 'connected_app_count',
  'named_credential_count', 'has_duplicate_rules', 'installed_package_count',
  'report_count', 'dashboard_count', 'territory_count', 'forecasting_type_count',
  'has_cs_pipeline', 'has_partner_pipeline', 'case_count',
];

// Keys where HubSpot is the authority (marketing automation & demand gen)
const HS_AUTHORITATIVE_KEYS = [
  'form_count', 'active_list_count', 'static_list_count',
  'published_email_count', 'marketing_email_count',
  'campaign_count', 'goal_count',
  'has_attribution_workflow', 'has_campaign_attribution',
  'blog_post_count', 'sequence_count',
  'feedback_survey_count',
];

// Keys that should be summed when both are present
const SUMMED_KEYS = [
  'total_automation_count', 'active_automation_count',
];

// Boolean keys that should be OR'd
const BOOLEAN_OR_KEYS = [
  'has_lead_scoring', 'has_lifecycle_stages', 'has_lead_routing',
  'has_enrichment', 'has_enablement_platform', 'has_conversation_intelligence',
  'has_sales_engagement_tool', 'has_duplicate_rules',
];

export function mergeSignals(sfSignals = {}, hsSignals = {}) {
  const sfKeys = Object.keys(sfSignals);
  const hsKeys = Object.keys(hsSignals);

  const hasSF = sfKeys.length > 0;
  const hasHS = hsKeys.length > 0;

  if (!hasSF && !hasHS) return { _source: 'none' };
  if (!hasHS) return { ...sfSignals, _source: 'salesforce_only', _sf_signal_count: sfKeys.length };
  if (!hasSF) return { ...hsSignals, _source: 'hubspot_only', _hs_signal_count: hsKeys.length };

  const merged = { ...sfSignals };

  for (const [key, value] of Object.entries(hsSignals)) {
    if (SF_AUTHORITATIVE_KEYS.includes(key)) {
      // SF is authoritative — keep the SF value
      continue;
    }

    if (HS_AUTHORITATIVE_KEYS.includes(key)) {
      // HS is authoritative — always take HS value
      merged[key] = value;
      continue;
    }

    if (SUMMED_KEYS.includes(key)) {
      merged[key] = (sfSignals[key] || 0) + (value || 0);
      continue;
    }

    if (BOOLEAN_OR_KEYS.includes(key)) {
      merged[key] = !!(sfSignals[key] || value);
      continue;
    }

    // Default: HS fills in if SF value is missing or zero
    if (merged[key] === undefined || merged[key] === null || merged[key] === 0) {
      merged[key] = value;
    }
  }

  merged._source = 'dual';
  merged._sf_signal_count = sfKeys.length;
  merged._hs_signal_count = hsKeys.length;

  return merged;
}
