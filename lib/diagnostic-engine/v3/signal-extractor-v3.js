/**
 * v3 Signal Extractor
 *
 * Extends the base HubSpot and Salesforce signal extractors with
 * additional v3-specific signals for the 6-pillar model.
 *
 * Reuses extractSignals() and extractSalesforceSignals() as the base,
 * then adds new signals needed by v3 graders.
 */

import { extractSignals } from '../signal-extractor';
import { extractSalesforceSignals } from '../signal-extractor-sf';

/**
 * Extract v3-enhanced signals from HubSpot metadata.
 * Returns all v2 signals plus new v3 signals.
 *
 * @param {object} metadata - Raw HubSpot API downloads
 * @returns {object} Extended flat signal object
 */
export function extractSignalsV3HubSpot(metadata) {
  // Start with all v2 signals
  const base = extractSignals(metadata);

  const { properties, pipelines, workflows, forms, lists, owners, marketing_emails } = metadata || {};
  const workflowList = Array.isArray(workflows) ? workflows : (workflows?.results || []);

  // ── New v3 signals ──

  // Feedback surveys (RP-4)
  const feedbackWorkflows = workflowList.filter((w) =>
    /feedback|survey|nps|csat/i.test(w.name || '') && w.enabled !== false
  );
  base.feedback_survey_count = feedbackWorkflows.length;

  // Blog/content counts (EN-1)
  // HubSpot blog posts are in marketing_emails or separate endpoint
  base.blog_post_count = 0; // Not available in standard metadata; leave for API extension

  // Marketing email volume (EN-1 weak signal)
  const publishedEmails = Array.isArray(marketing_emails)
    ? marketing_emails.filter((e) => e.publishDate || e.state === 'PUBLISHED')
    : [];
  base.published_email_count = publishedEmails.length;

  // Engagement scoring config (PR-1)
  const hasLeadScoring = workflowList.some((w) =>
    /lead.?scor|mql|scoring/i.test(w.name || '') && w.enabled !== false
  );
  base.has_lead_scoring = hasLeadScoring;

  // Enablement platform detection (EN-2)
  // Check for known enablement tool integrations in properties or workflows
  const enablementPatterns = /seismic|highspot|showpad|guru|lessonly|mindtickle/i;
  const hasEnablementProperties = (properties?.contacts?.results || []).some((p) =>
    enablementPatterns.test(p.name || '')
  );
  const hasEnablementWorkflows = workflowList.some((w) =>
    enablementPatterns.test(w.name || '')
  );
  base.has_enablement_platform = hasEnablementProperties || hasEnablementWorkflows;

  // Conversation intelligence detection (EN-3)
  const ciPatterns = /gong|chorus|clari|aviso|revenue\.io|wingman/i;
  const hasCIProperties = (properties?.contacts?.results || []).some((p) =>
    ciPatterns.test(p.name || '')
  );
  const hasCIWorkflows = workflowList.some((w) =>
    ciPatterns.test(w.name || '')
  );
  base.has_conversation_intelligence = hasCIProperties || hasCIWorkflows;

  // Sales engagement tool detection (SY-3)
  const sePatterns = /outreach|salesloft|sales.?engagement|sequence/i;
  const hasSEProperties = (properties?.contacts?.results || []).some((p) =>
    sePatterns.test(p.name || '')
  );
  base.has_sales_engagement_tool = hasSEProperties || (base.sequence_count > 0);

  // Dashboard/report counts (RP-1)
  // HubSpot doesn't expose dashboard counts in metadata; leave as 0
  base.dashboard_count = base.dashboard_count || 0;
  base.report_count = base.report_count || 0;

  // Campaign attribution (PR-9)
  base.campaign_count = base.campaign_count || 0;

  // Territory management (PR-7) — not available in HubSpot metadata
  base.has_territory_model = false;

  // Forecasting config (RP-6) — not in HubSpot metadata
  base.has_forecasting_config = false;

  return base;
}

/**
 * Extract v3-enhanced signals from Salesforce metadata.
 * Returns all v2 signals plus new v3 signals.
 *
 * @param {object} metadata - Raw Salesforce metadata
 * @returns {object} Extended flat signal object
 */
export function extractSignalsV3Salesforce(metadata) {
  // Start with all v2 signals
  const base = extractSalesforceSignals(metadata);

  const {
    objects, stages, users, flows, workflowRules, validationRules,
    apexTriggers, apexClasses, profiles, permissionSets, roles,
    reports, dashboards, connectedApps, namedCredentials, recordTypes,
    // New v3 metadata fields (added by extended downloader)
    campaigns, territories, forecastingTypes, contentVersions,
    knowledgeArticles, reportSchedules, duplicateRules, taskAggregates,
  } = metadata || {};

  // ── New v3 signals ──

  // Campaign records (PR-9)
  const campaignList = Array.isArray(campaigns) ? campaigns : [];
  base.campaign_count = campaignList.length;
  base.active_campaign_count = campaignList.filter((c) => c.IsActive === true).length;
  base.has_campaign_attribution = campaignList.some((c) =>
    c.Type === 'Attribution' || c.NumberOfOpportunities > 0
  );

  // Territory management (PR-7)
  const territoryList = Array.isArray(territories) ? territories : [];
  base.has_territory_model = territoryList.length > 0;
  base.territory_count = territoryList.length;

  // Forecasting config (RP-6)
  const forecastList = Array.isArray(forecastingTypes) ? forecastingTypes : [];
  base.has_forecasting_config = forecastList.length > 0;
  base.forecasting_type_count = forecastList.length;

  // Content versions / enablement docs (EN-1, EN-2)
  const contentList = Array.isArray(contentVersions) ? contentVersions : [];
  base.content_version_count = contentList.length;
  base.has_enablement_platform = contentList.length > 20; // Rough heuristic

  // Knowledge articles / playbooks (EN-5)
  const articleList = Array.isArray(knowledgeArticles) ? knowledgeArticles : [];
  base.knowledge_article_count = articleList.length;

  // Dashboard folder analysis (RP-1, RP-2, RP-3)
  const dashboardList = Array.isArray(dashboards) ? dashboards : [];
  base.dashboard_count = dashboardList.length;
  base.exec_dashboard_count = dashboardList.filter((d) =>
    /exec|board|leadership|c-suite/i.test(d.FolderName || d.Title || '')
  ).length;
  base.manager_dashboard_count = dashboardList.filter((d) =>
    /manager|team.?lead|director/i.test(d.FolderName || d.Title || '')
  ).length;

  // Report schedules (RP-4)
  const scheduleList = Array.isArray(reportSchedules) ? reportSchedules : [];
  base.report_schedule_count = scheduleList.length;

  // Duplicate rules (SY-1 data quality)
  const dupRuleList = Array.isArray(duplicateRules) ? duplicateRules : [];
  base.duplicate_rule_count = dupRuleList.length;
  base.has_duplicate_rules = dupRuleList.length > 0;

  // Task activity aggregates (PR-10)
  const taskAgg = taskAggregates || {};
  base.task_90day_count = taskAgg.total || 0;
  base.task_completion_rate = taskAgg.completionRate || 0;

  // Conversation intelligence detection (EN-3)
  const connAppList = Array.isArray(connectedApps) ? connectedApps : [];
  const ciPatterns = /gong|chorus|clari|aviso|revenue\.io|wingman/i;
  base.has_conversation_intelligence = connAppList.some((app) =>
    ciPatterns.test(app.Name || app.Label || '')
  );

  // Sales engagement detection (SY-3)
  const sePatterns = /outreach|salesloft|sales.?engagement/i;
  base.has_sales_engagement_tool = connAppList.some((app) =>
    sePatterns.test(app.Name || app.Label || '')
  );

  // Report count
  const reportList = Array.isArray(reports) ? reports : [];
  base.report_count = reportList.length;

  return base;
}

/**
 * Extract v3 signals based on CRM type.
 * Convenience wrapper that dispatches to the correct extractor.
 *
 * @param {object} metadata - Raw CRM metadata
 * @param {string} crmType - 'hubspot' or 'salesforce'
 * @returns {object} Flat signal object
 */
export function extractSignalsV3(metadata, crmType) {
  if (crmType === 'salesforce') {
    return extractSignalsV3Salesforce(metadata);
  }
  return extractSignalsV3HubSpot(metadata);
}
