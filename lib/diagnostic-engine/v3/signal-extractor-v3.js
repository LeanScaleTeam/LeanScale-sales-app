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
    // v3 Phase 2: New data from extended downloader
    campaigns, installedPackages, territories, forecastingTypes,
    duplicateRules, reportSchedules, emailTemplates,
    // v3 Phase 3: Activity & content data
    taskAggregates, eventPatterns, contentVersions, knowledgeArticles,
    campaignMemberCount,
  } = metadata || {};

  // ── v3 Signals ──

  // Campaign records (PR-9, PR-8)
  const campaignList = Array.isArray(campaigns) ? campaigns : [];
  base.campaign_count = campaignList.length;
  base.active_campaign_count = campaignList.filter((c) => c.IsActive === true).length;
  base.has_campaign_attribution = campaignList.some((c) =>
    c.Type === 'Attribution' || c.NumberOfOpportunities > 0
  );
  base.has_abm_campaigns = campaignList.some((c) =>
    /abm|target.*account|account.*based/i.test(c.Name || c.Type || '')
  );

  // Campaign member count (PR-9 attribution depth)
  base.campaign_member_count = campaignMemberCount || 0;
  base.has_campaign_members = (campaignMemberCount || 0) > 0;

  // Installed packages — tool detection across many competencies
  const packageList = Array.isArray(installedPackages) ? installedPackages : [];
  const packageNames = packageList.map((p) => p.SubscriberPackage?.Name || '').filter(Boolean);
  base.installed_package_count = packageList.length;

  // Tool detections from installed packages
  const mapPatterns = /pardot|marketing.?cloud|marketo|hubspot|mailchimp|eloqua|act-?on/i;
  base.has_marketing_automation_package = packageNames.some((n) => mapPatterns.test(n));

  const csPatterns = /gainsight|churnzero|vitally|totango|customer.?success/i;
  base.has_cs_platform_installed = packageNames.some((n) => csPatterns.test(n));

  const commissionPatterns = /xactly|captivateiq|spiff|performio|everstage|varicent/i;
  base.has_commission_tool = packageNames.some((n) => commissionPatterns.test(n));

  const abmPackagePatterns = /6sense|demandbase|terminus|rollworks/i;
  base.has_abm_tool = packageNames.some((n) => abmPackagePatterns.test(n));

  const enablementPkgPatterns = /seismic|highspot|showpad|guru|lessonly|mindtickle/i;
  base.has_enablement_package = packageNames.some((n) => enablementPkgPatterns.test(n));

  const lmsPatterns = /lessonly|workramp|docebo|litmos|cornerstone/i;
  base.has_lms_tool = packageNames.some((n) => lmsPatterns.test(n));

  // Territory management (PR-7)
  const territoryList = Array.isArray(territories) ? territories : [];
  base.has_territory_model = territoryList.length > 0;
  base.territory_count = territoryList.length;

  // Forecasting config (RP-6)
  const forecastList = Array.isArray(forecastingTypes) ? forecastingTypes : [];
  base.has_forecasting_config = forecastList.length > 0;
  base.forecasting_type_count = forecastList.length;

  // Duplicate rules (SY-1 data quality)
  const dupRuleList = Array.isArray(duplicateRules) ? duplicateRules : [];
  base.duplicate_rule_count = dupRuleList.length;
  base.has_duplicate_rules = dupRuleList.length > 0;

  // Report schedules (RP-4 cadence)
  const scheduleList = Array.isArray(reportSchedules) ? reportSchedules : [];
  base.report_schedule_count = scheduleList.length;

  // Email templates (SY-2 MAP proxy)
  const templateList = Array.isArray(emailTemplates) ? emailTemplates : [];
  base.email_template_count = templateList.length > 0 ? (templateList[0]?.cnt || 0) : 0;

  // Content versions / enablement docs (EN-1, EN-2, EN-5)
  const contentList = Array.isArray(contentVersions) ? contentVersions : [];
  base.content_version_count = contentList.length;
  // Classify content by type
  const salesContentPatterns = /case.?study|whitepaper|data.?sheet|solution.?brief|pitch.*deck|battle.?card|competitor|objection|pricing|proposal|one.?pager/i;
  base.sales_content_count = contentList.filter((c) =>
    salesContentPatterns.test(c.Title || '')
  ).length;
  const playbookContentPatterns = /playbook|runbook|process.?doc|sop|standard.*operating|how.?to|guide|methodology/i;
  base.playbook_content_count = contentList.filter((c) =>
    playbookContentPatterns.test(c.Title || '')
  ).length;
  const contentFileTypes = [...new Set(contentList.map((c) => c.FileType).filter(Boolean))];
  base.content_type_diversity = contentFileTypes.length;
  // Enablement platform heuristic: content in CRM + enablement package
  base.has_enablement_platform = base.has_enablement_package || contentList.length > 20;

  // Knowledge articles / playbooks (EN-5)
  const articleList = Array.isArray(knowledgeArticles) ? knowledgeArticles : [];
  base.knowledge_article_count = articleList.length;

  // Task activity aggregates (PR-10, EN-3)
  const taskAgg = taskAggregates || {};
  base.task_90day_count = taskAgg.total || 0;
  base.task_completion_rate = taskAgg.completionRate || 0;

  // Event recurrence patterns (PL-5 review cadence)
  const eventList = Array.isArray(eventPatterns) ? eventPatterns : [];
  const cadencePatterns = /QBR|quarterly.*review|weekly.*review|WBR|pipeline.*review|forecast.*call|1.?on.?1|one.?on.?one|standup|stand.?up/i;
  const cadenceEvents = eventList.filter((e) => cadencePatterns.test(e.Subject || ''));
  base.recurring_review_event_count = cadenceEvents.length;
  base.has_review_cadence = cadenceEvents.length > 0;
  // Classify by frequency
  base.cadence_types = {
    daily: cadenceEvents.filter((e) => /daily|standup|stand.?up/i.test(e.Subject || '')).length,
    weekly: cadenceEvents.filter((e) => /weekly|WBR|1.?on.?1|one.?on.?one/i.test(e.Subject || '')).length,
    monthly: cadenceEvents.filter((e) => /monthly|pipeline.*review/i.test(e.Subject || '')).length,
    quarterly: cadenceEvents.filter((e) => /QBR|quarterly/i.test(e.Subject || '')).length,
  };

  // Coaching activity detection (EN-3)
  base.coaching_activity_count = eventList.filter((e) =>
    /coaching|deal.*review|1.?on.?1.*rep|coaching.*session/i.test(e.Subject || '')
  ).length;

  // Dashboard folder analysis (RP-1, RP-2, RP-3)
  const dashboardList = Array.isArray(dashboards) ? dashboards : [];
  base.dashboard_count = dashboardList.length;
  base.exec_dashboard_count = dashboardList.filter((d) =>
    /exec|board|leadership|c-suite|ceo|cro|cmo/i.test(d.FolderName || d.Title || '')
  ).length;
  base.manager_dashboard_count = dashboardList.filter((d) =>
    /manager|team.?lead|director|vp|pipeline.*review/i.test(d.FolderName || d.Title || '')
  ).length;
  base.ic_dashboard_count = dashboardList.filter((d) =>
    /my.*dashboard|rep.*view|ic.*dashboard|personal|individual|daily.*view|my.*pipeline|my.*tasks/i.test(d.Title || d.FolderName || '')
  ).length;

  // Report folder analysis (organized reporting indicator)
  const reportList = Array.isArray(reports) ? reports : [];
  base.report_count = reportList.length;
  const reportFolders = [...new Set(reportList.map((r) => r.FolderName).filter(Boolean))];
  base.report_folder_count = reportFolders.length;
  base.department_report_folders = reportFolders.filter((f) =>
    /marketing|sales|cs|support|partner|exec|leadership/i.test(f)
  ).length;

  // Conversation intelligence detection (EN-3) — ConnectedApps + packages
  const connAppList = Array.isArray(connectedApps) ? connectedApps : [];
  const ciPatterns = /gong|chorus|clari|aviso|revenue\.io|wingman/i;
  base.has_conversation_intelligence = connAppList.some((app) =>
    ciPatterns.test(app.Name || app.Label || '')
  ) || packageNames.some((n) => ciPatterns.test(n));

  // Sales engagement detection (SY-3) — ConnectedApps + packages
  const sePatterns = /outreach|salesloft|sales.?engagement/i;
  base.has_sales_engagement_tool = connAppList.some((app) =>
    sePatterns.test(app.Name || app.Label || '')
  ) || packageNames.some((n) => sePatterns.test(n));

  // ── Signal Aliases (fix naming mismatches) ──

  // PR-9 grader checks has_deal_source_tracking, base extractor computes has_deal_source_property
  base.has_deal_source_tracking = base.has_deal_source_property;

  // PR-9 grader checks has_attribution_workflow, base computes attribution_workflow_count
  base.has_attribution_workflow = (base.attribution_workflow_count || 0) > 0;

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
