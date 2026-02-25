/**
 * Salesforce Signal Extractor
 *
 * Takes raw Salesforce metadata (from API downloader or zip parser) and
 * produces a flat signal object with ~55 computed values:
 *   - ~40 shared signals (same keys as the HubSpot extractor)
 *   - ~15 Platform Health signals (Salesforce-only)
 *
 * Reference: signal-extractor.js (HubSpot equivalent)
 */

// ── Enrichment Patterns (shared with HubSpot extractor) ──

const ENRICHMENT_PATTERNS = [
  { name: 'AdvizorPro', pattern: /advizor/i },
  { name: 'ZoomInfo', pattern: /zoominfo|zi_/i },
  { name: 'Clearbit', pattern: /clearbit/i },
  { name: 'Apollo', pattern: /apollo/i },
  { name: 'Clay', pattern: /^clay_|_clay_/i },
  { name: 'Cognism', pattern: /cognism/i },
  { name: 'Lusha', pattern: /lusha/i },
  { name: '6sense', pattern: /6sense/i },
  { name: 'Demandbase', pattern: /demandbase/i },
];

// ── Main Export ──

/**
 * Extract all diagnostic signals from raw Salesforce metadata.
 * @param {object} metadata - Raw Salesforce metadata
 * @returns {object} Flat signal object
 */
export function extractSalesforceSignals(metadata) {
  const {
    objects, stages, users, flows, workflowRules, validationRules,
    apexTriggers, apexClasses, profiles, permissionSets, roles,
    reports, dashboards, connectedApps, namedCredentials, recordTypes,
  } = metadata || {};

  // Normalize arrays
  const flowList = Array.isArray(flows) ? flows : [];
  const ruleList = Array.isArray(workflowRules) ? workflowRules : [];
  const userList = Array.isArray(users) ? users : [];
  const roleList = Array.isArray(roles) ? roles : [];
  const triggerList = Array.isArray(apexTriggers) ? apexTriggers : [];
  const classList = Array.isArray(apexClasses) ? apexClasses : [];
  const valRuleList = Array.isArray(validationRules) ? validationRules : [];
  const profileList = Array.isArray(profiles) ? profiles : [];
  const permSetList = Array.isArray(permissionSets) ? permissionSets : [];
  const reportList = Array.isArray(reports) ? reports : [];
  const dashboardList = Array.isArray(dashboards) ? dashboards : [];
  const connAppList = Array.isArray(connectedApps) ? connectedApps : [];
  const namedCredList = Array.isArray(namedCredentials) ? namedCredentials : [];
  const recordTypeList = Array.isArray(recordTypes) ? recordTypes : [];

  // Build unified automation list for classification
  // Salesforce automations use Label (flows) or Name (workflowRules)
  const allAutomations = [
    ...flowList.map((f) => ({ name: f.Label || f.Name || '', description: f.Description || '', active: f.Status === 'Active' })),
    ...ruleList.map((r) => ({ name: r.Name || '', description: r.Description || '', active: r.Active === true })),
  ];
  const activeAutomations = allAutomations.filter((a) => a.active);
  const disabledAutomations = allAutomations.filter((a) => !a.active);

  // Object describes
  const contactDescribe = objects?.Contact;
  const leadDescribe = objects?.Lead;
  const accountDescribe = objects?.Account;
  const opportunityDescribe = objects?.Opportunity;
  const caseDescribe = objects?.Case;

  // Combined contact + lead fields (for property counts and enrichment)
  const contactLeadFields = [
    ...getFields(contactDescribe),
    ...getFields(leadDescribe),
  ];
  const accountFields = getFields(accountDescribe);
  const opportunityFields = getFields(opportunityDescribe);

  // All field names for enrichment detection
  const allFieldNames = getAllFieldNames(objects);

  // Role names
  const roleNames = extractRoleNames(roleList);

  // Opportunity stages
  const oppStages = stages?.opportunityStages || [];

  return {
    // ── F1: CRM Data Model ──
    contact_total_properties: countFields(contactDescribe) + countFields(leadDescribe),
    contact_custom_properties: countCustomFields(contactDescribe) + countCustomFields(leadDescribe),
    company_total_properties: countFields(accountDescribe),
    company_custom_properties: countCustomFields(accountDescribe),
    deal_total_properties: countFields(opportunityDescribe),
    deal_custom_properties: countCustomFields(opportunityDescribe),
    ticket_total_properties: countFields(caseDescribe),
    ticket_custom_properties: countCustomFields(caseDescribe),
    enrichment_tool_detected: detectEnrichmentTool(contactLeadFields),
    enrichment_field_count: countEnrichmentFields(contactLeadFields, accountFields),

    // ── F2: Pipeline Design ──
    deal_pipeline_count: 1, // Salesforce has a single pipeline
    deal_pipeline_stages: oppStages.length > 0
      ? [{
          name: 'Salesforce',
          stageCount: oppStages.length,
          hasStalled: oppStages.some((s) => /stall|park|on hold/i.test(s.MasterLabel || '')),
          probabilities: oppStages.map((s) => s.DefaultProbability || 0),
          hasClosedLost: oppStages.some((s) => /closed.?lost|lost/i.test(s.MasterLabel || '')),
        }]
      : [],

    // Ticket pipeline signals — Salesforce doesn't have a separate ticket pipeline
    ticket_pipeline_count: 0,
    ticket_pipeline_customized: false,

    // ── F3: Lifecycle & Lead Status ──
    lifecycle_workflow_count: classifyAutomations(allAutomations, 'lifecycle').length,
    lead_status_workflow_count: classifyAutomations(allAutomations, 'lead_status').length,
    lifecycle_stages_covered: detectLifecycleStages(allAutomations, objects),
    has_cross_object_sync: detectCrossObjectSync(allAutomations),

    // ── F4: Automation Engine ──
    total_active_workflows: activeAutomations.length,
    total_disabled_workflows: disabledAutomations.length,
    workflow_categories: categorizeAutomations(allAutomations),
    workflow_category_count: Object.keys(categorizeAutomations(allAutomations)).length,
    has_task_automation: allAutomations.some((a) => isTaskAutomation(a)),
    has_deal_creation_automation: allAutomations.some((a) => isDealCreationAutomation(a)),

    // ── F5: Team & Ownership ──
    total_owners: userList.length,
    teams: roleNames,
    team_count: roleNames.length,
    orphan_owner_count: countOrphanOwners(userList),
    owner_to_team_coverage: calcRoleCoverage(userList),

    // ── F6: Data Enrichment ──
    enrichment_tools: detectAllEnrichmentTools(contactLeadFields, accountFields),
    enrichment_multi_object: checkMultiObjectEnrichment(objects),
    has_enrichment_workflow: allAutomations.some((a) => isEnrichmentAutomation(a)),

    // ── M1: Inbound Lead Flow ──
    form_count: 0, // Salesforce has no native forms
    lead_capture_forms: 0,
    has_lead_routing_workflow: allAutomations.some((a) => isLeadRoutingAutomation(a)),
    has_speed_to_lead: allAutomations.some((a) => isSpeedToLeadAutomation(a)),

    // ── M2: Marketing Email & Nurture ──
    marketing_email_count: 0, // Not native to Salesforce
    published_emails: 0,
    nurture_workflow_count: classifyAutomations(allAutomations, 'nurture').length,
    dynamic_list_count: 0,
    static_list_count: 0,

    // ── M3: Sales Execution ──
    has_stalled_deal_notification: allAutomations.some((a) => isStalledDealAutomation(a)),

    // ── M4: Attribution ──
    attribution_workflow_count: classifyAutomations(allAutomations, 'attribution').length,
    has_deal_source_property: hasField(opportunityFields, ['deal_source', 'dealSource', 'original_source', 'hs_analytics_source', 'LeadSource']),

    // ── M5: Deal-to-Close ──
    has_competitor_property: hasField(opportunityFields, ['competitor', 'competitors', 'competitive_landscape']),
    has_close_reason_property: hasField(opportunityFields, ['closed_lost_reason', 'closed_lost_reasons', 'close_lost_reason']),
    has_closed_won_automation: allAutomations.some((a) => isClosedWonAutomation(a)),

    // ── M6: Customer Success ──
    has_cs_handoff_workflow: allAutomations.some((a) => isCSHandoffAutomation(a)),
    has_onboarding_workflow: allAutomations.some((a) => isOnboardingAutomation(a)),

    // ── M7: Partner ──
    has_partner_pipeline: oppStages.some((s) => /partner|resell|referr|channel/i.test(s.MasterLabel || '')),
    has_referral_workflow: allAutomations.some((a) => isReferralAutomation(a)),

    // ── R4: Win/Loss ──
    has_competitor_tracking: hasField(opportunityFields, ['competitor', 'competitors']),
    has_closed_lost_reason: hasField(opportunityFields, ['closed_lost_reason', 'closed_lost_reasons']),

    // ── Reporting ──
    has_reporting_dashboards: dashboardList.length > 0,

    // ── Platform Health: Apex ──
    apex_trigger_count: triggerList.length,
    apex_class_count: classList.length,
    apex_total_lines: sumLengthWithoutComments(triggerList) + sumLengthWithoutComments(classList),

    // ── Platform Health: Validation Rules ──
    validation_rule_count: valRuleList.length,
    validation_rules_by_object: groupByObject(valRuleList, 'EntityDefinition'),

    // ── Platform Health: Duplicate Rules ──
    duplicate_rule_count: 0, // placeholder for v1

    // ── Platform Health: Security & Governance ──
    profile_count: profileList.length,
    permission_set_count: permSetList.length,
    role_hierarchy_depth: calcRoleHierarchyDepth(roleList),

    // ── Platform Health: Record Types ──
    record_type_count: recordTypeList.length,
    record_types_by_object: groupRecordTypes(recordTypeList),
    page_layout_count: 0, // placeholder for v1

    // ── Platform Health: Integrations ──
    connected_app_count: connAppList.length,
    named_credential_count: namedCredList.length,
    outbound_flow_count: countOutboundFlows(flowList),
  };
}

// ── Helper Functions ──

/**
 * Get fields array from an object describe, safely.
 */
function getFields(objectDescribe) {
  if (!objectDescribe || !Array.isArray(objectDescribe.fields)) return [];
  return objectDescribe.fields;
}

/**
 * Count total fields from an object describe.
 */
function countFields(objectDescribe) {
  return getFields(objectDescribe).length;
}

/**
 * Count custom fields from an object describe.
 * In Salesforce, custom fields have f.custom === true.
 */
function countCustomFields(objectDescribe) {
  return getFields(objectDescribe).filter((f) => f.custom === true).length;
}

/**
 * Get all field names across all objects (for enrichment detection).
 */
function getAllFieldNames(objects) {
  if (!objects) return [];
  const names = [];
  for (const key of Object.keys(objects)) {
    const fields = getFields(objects[key]);
    for (const f of fields) {
      names.push(f.name || '');
      names.push(f.label || '');
    }
  }
  return names;
}

/**
 * Get field names from an array of field descriptors.
 */
function getFieldNames(fields) {
  return fields.map((f) => f.name || '');
}

/**
 * Check if any field in the list matches one of the given names.
 */
function hasField(fields, names) {
  if (!Array.isArray(fields) || !Array.isArray(names)) return false;
  return fields.some((f) => names.includes(f.name));
}

/**
 * Detect the first enrichment tool from a list of fields.
 */
function detectEnrichmentTool(fields) {
  if (!Array.isArray(fields)) return null;
  for (const tool of ENRICHMENT_PATTERNS) {
    if (fields.some((f) => tool.pattern.test(f.name || '') || tool.pattern.test(f.label || ''))) {
      return tool.name;
    }
  }
  return null;
}

/**
 * Count enrichment fields across contact/lead fields and account fields.
 */
function countEnrichmentFields(contactLeadFields, accountFields) {
  let count = 0;
  const allFields = [...(contactLeadFields || []), ...(accountFields || [])];
  for (const f of allFields) {
    for (const tool of ENRICHMENT_PATTERNS) {
      if (tool.pattern.test(f.name || '') || tool.pattern.test(f.label || '')) {
        count++;
        break;
      }
    }
  }
  return count;
}

/**
 * Detect all enrichment tools with their field counts.
 */
function detectAllEnrichmentTools(contactLeadFields, accountFields) {
  const found = [];
  const allFields = [...(contactLeadFields || []), ...(accountFields || [])];
  for (const tool of ENRICHMENT_PATTERNS) {
    const matchingFields = allFields.filter(
      (f) => tool.pattern.test(f.name || '') || tool.pattern.test(f.label || '')
    );
    if (matchingFields.length > 0) {
      found.push({ name: tool.name, fieldCount: matchingFields.length });
    }
  }
  return found;
}

/**
 * Check if enrichment fields exist on both Contact/Lead and Account objects.
 */
function checkMultiObjectEnrichment(objects) {
  if (!objects) return false;
  const contactLeadFields = [...getFields(objects.Contact), ...getFields(objects.Lead)];
  const accountFields = getFields(objects.Account);

  const contactEnriched = contactLeadFields.some((f) =>
    ENRICHMENT_PATTERNS.some((t) => t.pattern.test(f.name || ''))
  );
  const accountEnriched = accountFields.some((f) =>
    ENRICHMENT_PATTERNS.some((t) => t.pattern.test(f.name || ''))
  );
  return contactEnriched && accountEnriched;
}

// ── Automation Classification ──

/**
 * Classify automations by category (same patterns as HubSpot).
 * Uses a.name (which maps to Label or Name in Salesforce).
 */
function classifyAutomations(automations, category) {
  if (!Array.isArray(automations)) return [];
  const patterns = {
    lifecycle: /lifecycle|life.?cycle|stage.*transition|mql|sql|customer.*stage/i,
    lead_status: /lead.?status|lead.*state|new.*lead|attempted|qualified|nurture/i,
    nurture: /nurture|drip|email.*sequence|follow.?up.*campaign/i,
    attribution: /attribution|source.*track|utm|campaign.*track|first.*touch|last.*touch/i,
  };
  const pattern = patterns[category];
  if (!pattern) return [];
  return automations.filter((a) => pattern.test(a.name || '') || pattern.test(a.description || ''));
}

/**
 * Detect lifecycle stages from automations and LeadStatus picklist values.
 */
function detectLifecycleStages(automations, objects) {
  const stages = new Set();
  const stagePatterns = [
    { stage: 'Lead', pattern: /\blead\b/i },
    { stage: 'MQL', pattern: /\bmql\b|marketing.?qualified/i },
    { stage: 'SQL', pattern: /\bsql\b|sales.?qualified/i },
    { stage: 'Opportunity', pattern: /\bopportunit/i },
    { stage: 'Customer', pattern: /\bcustomer\b/i },
  ];

  // Check automation names
  for (const a of (automations || [])) {
    const text = `${a.name || ''} ${a.description || ''}`;
    for (const { stage, pattern } of stagePatterns) {
      if (pattern.test(text)) stages.add(stage);
    }
  }

  // Check Lead.Status picklist values
  const leadFields = getFields(objects?.Lead);
  for (const field of leadFields) {
    if (field.name === 'Status' && Array.isArray(field.picklistValues)) {
      for (const pv of field.picklistValues) {
        const text = `${pv.value || ''} ${pv.label || ''}`;
        for (const { stage, pattern } of stagePatterns) {
          if (pattern.test(text)) stages.add(stage);
        }
      }
    }
  }

  return [...stages];
}

/**
 * Detect cross-object sync automations.
 */
function detectCrossObjectSync(automations) {
  if (!Array.isArray(automations)) return false;
  return automations.some(
    (a) => /company.*contact|contact.*company|cross.*object|sync.*lifecycle|account.*contact/i.test(a.name || '')
  );
}

/**
 * Categorize automations into functional categories.
 */
function categorizeAutomations(automations) {
  if (!Array.isArray(automations)) return {};
  const categories = {
    lifecycle: [],
    task: [],
    notification: [],
    data_sync: [],
    deal: [],
    marketing: [],
    other: [],
  };
  for (const a of automations) {
    const name = (a.name || '').toLowerCase();
    if (/lifecycle|stage|status/i.test(name)) categories.lifecycle.push(a.name);
    else if (/task|to.?do|reminder/i.test(name)) categories.task.push(a.name);
    else if (/notif|alert|slack|email.*internal/i.test(name)) categories.notification.push(a.name);
    else if (/sync|update|copy|mirror/i.test(name)) categories.data_sync.push(a.name);
    else if (/deal|pipeline|opportunity|closed/i.test(name)) categories.deal.push(a.name);
    else if (/marketing|email|nurture|campaign/i.test(name)) categories.marketing.push(a.name);
    else categories.other.push(a.name);
  }
  // Remove empty categories
  const result = {};
  for (const [key, arr] of Object.entries(categories)) {
    if (arr.length > 0) result[key] = arr;
  }
  return result;
}

// ── Automation Type Detectors (match HubSpot patterns, use a.name) ──

function isTaskAutomation(a) {
  return /task|to.?do|assign/i.test(a.name || '');
}

function isDealCreationAutomation(a) {
  return /create.*deal|new.*deal|auto.*deal|deal.*creation/i.test(a.name || '');
}

function isEnrichmentAutomation(a) {
  return /enrich|clay|zoominfo|clearbit|append/i.test(a.name || '');
}

function isLeadRoutingAutomation(a) {
  return /lead.*rout|round.?robin|assign.*lead|distribute.*lead/i.test(a.name || '');
}

function isSpeedToLeadAutomation(a) {
  return /speed.?to.?lead|instant.*response|quick.*response|new.*lead.*notif/i.test(a.name || '');
}

function isStalledDealAutomation(a) {
  return /stall|stagnant|inactive.*deal|no.*activity|stuck|aging/i.test(a.name || '');
}

function isClosedWonAutomation(a) {
  return /closed.?won|deal.*won|won.*deal|customer.*welcome|handoff/i.test(a.name || '');
}

function isCSHandoffAutomation(a) {
  return /handoff|hand.?off|sales.?to.?cs|cs.*handoff|onboard.*trigger/i.test(a.name || '');
}

function isOnboardingAutomation(a) {
  return /onboard|welcome.*customer|new.*customer|implementation/i.test(a.name || '');
}

function isReferralAutomation(a) {
  return /referral|partner.*deal|channel|resell/i.test(a.name || '');
}

// ── Team & Ownership Helpers ──

/**
 * Extract role names from the roles array.
 */
function extractRoleNames(roles) {
  if (!Array.isArray(roles)) return [];
  return roles.map((r) => r.Name).filter(Boolean);
}

/**
 * Count users without a role assignment.
 */
function countOrphanOwners(users) {
  if (!Array.isArray(users)) return 0;
  return users.filter((u) => !u.UserRoleId).length;
}

/**
 * Calculate percentage of users with role assignments.
 */
function calcRoleCoverage(users) {
  if (!Array.isArray(users) || users.length === 0) return 0;
  const withRole = users.filter((u) => u.UserRoleId).length;
  return Math.round((withRole / users.length) * 100);
}

// ── Platform Health Helpers ──

/**
 * Sum LengthWithoutComments across an array of apex items.
 */
function sumLengthWithoutComments(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (item.LengthWithoutComments || 0), 0);
}

/**
 * Group items by a key field, returning { key: count } map.
 */
function groupByObject(items, keyField) {
  if (!Array.isArray(items)) return {};
  const groups = {};
  for (const item of items) {
    const key = item[keyField];
    if (key) {
      groups[key] = (groups[key] || 0) + 1;
    }
  }
  return groups;
}

/**
 * Group record types by SobjectType.
 */
function groupRecordTypes(recordTypes) {
  if (!Array.isArray(recordTypes)) return {};
  const groups = {};
  for (const rt of recordTypes) {
    const obj = rt.SobjectType;
    if (obj) {
      groups[obj] = (groups[obj] || 0) + 1;
    }
  }
  return groups;
}

/**
 * Calculate the maximum depth of the role hierarchy by traversing ParentRoleId.
 */
function calcRoleHierarchyDepth(roles) {
  if (!Array.isArray(roles) || roles.length === 0) return 0;

  // Build a map of Id -> role
  const roleMap = new Map();
  for (const r of roles) {
    roleMap.set(r.Id, r);
  }

  let maxDepth = 0;
  for (const role of roles) {
    let depth = 1;
    let current = role;
    const visited = new Set();
    while (current.ParentRoleId && roleMap.has(current.ParentRoleId)) {
      if (visited.has(current.Id)) break; // cycle protection
      visited.add(current.Id);
      current = roleMap.get(current.ParentRoleId);
      depth++;
    }
    if (depth > maxDepth) maxDepth = depth;
  }
  return maxDepth;
}

/**
 * Count flows that appear to be outbound (external callouts).
 */
function countOutboundFlows(flows) {
  if (!Array.isArray(flows)) return 0;
  const outboundPattern = /outbound|external|send.*to|push.*to|api.*call|webhook|callout|http|post.*to|integration/i;
  return flows.filter((f) => outboundPattern.test(f.Label || f.Name || '')).length;
}
