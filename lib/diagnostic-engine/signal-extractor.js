/**
 * Signal Extractor
 *
 * Takes raw HubSpot metadata JSON and produces a flat signal object
 * with ~40 computed values used by the grading functions.
 *
 * Reference: Diagnostic-Repo/Diagnostic/implementation-handoff.md §6
 */

/**
 * Extract all diagnostic signals from raw HubSpot metadata.
 * @param {object} metadata - Raw HubSpot API downloads
 * @returns {object} Flat signal object
 */
export function extractSignals(metadata) {
  const { properties, pipelines, workflows, forms, lists, owners, marketing_emails, tasks, meetings, calls, custom_object_schemas } = metadata || {};

  const workflowList = Array.isArray(workflows) ? workflows : (workflows?.results || []);

  return {
    // ── F1: CRM Data Model ──
    contact_total_properties: properties?.contacts?.results?.length || 0,
    contact_custom_properties: countCustom(properties?.contacts?.results),
    company_total_properties: properties?.companies?.results?.length || 0,
    company_custom_properties: countCustom(properties?.companies?.results),
    deal_total_properties: properties?.deals?.results?.length || 0,
    deal_custom_properties: countCustom(properties?.deals?.results),
    ticket_total_properties: properties?.tickets?.results?.length || 0,
    ticket_custom_properties: countCustom(properties?.tickets?.results),
    enrichment_tool_detected: detectEnrichmentTool(properties?.contacts?.results),
    enrichment_field_count: countEnrichmentFields(properties?.contacts?.results, properties?.companies?.results),

    // ── F2: Pipeline Design ──
    deal_pipeline_count: pipelines?.deals?.length || 0,
    deal_pipeline_stages: (pipelines?.deals || []).map((p) => ({
      name: p.label,
      stageCount: p.stages?.length || 0,
      hasStalled: (p.stages || []).some((s) => /stall|park|on hold/i.test(s.label)),
      probabilities: (p.stages || []).map((s) => parseFloat(s.metadata?.probability || 0)),
      hasClosedLost: (p.stages || []).some((s) => /closed.?lost|lost/i.test(s.label)),
    })),
    ticket_pipeline_count: pipelines?.tickets?.length || 0,
    ticket_pipeline_customized: (pipelines?.tickets?.[0]?.stages?.length || 0) > 4,

    // ── F3: Lifecycle & Lead Status ──
    lifecycle_workflow_count: classifyWorkflows(workflowList, 'lifecycle').length,
    lead_status_workflow_count: classifyWorkflows(workflowList, 'lead_status').length,
    lifecycle_stages_covered: detectLifecycleStages(workflowList),
    has_cross_object_sync: detectCrossObjectSync(workflowList),

    // ── F4: Automation Engine ──
    total_active_workflows: workflowList.filter((w) => w.enabled !== false).length,
    total_disabled_workflows: workflowList.filter((w) => w.enabled === false).length,
    workflow_categories: categorizeWorkflows(workflowList),
    workflow_category_count: Object.keys(categorizeWorkflows(workflowList)).length,
    has_task_automation: workflowList.some((w) => isTaskWorkflow(w)),
    has_deal_creation_automation: workflowList.some((w) => isDealCreationWorkflow(w)),

    // ── F5: Team & Ownership ──
    total_owners: owners?.results?.length || 0,
    teams: extractTeams(owners?.results),
    team_count: extractTeams(owners?.results).length,
    orphan_owner_count: countOrphanOwners(owners?.results),
    owner_to_team_coverage: calcTeamCoverage(owners?.results),

    // ── F6: Data Enrichment ──
    enrichment_tools: detectAllEnrichmentTools(properties),
    enrichment_multi_object: checkMultiObjectEnrichment(properties),
    has_enrichment_workflow: workflowList.some((w) => isEnrichmentWorkflow(w)),

    // ── M1: Inbound Lead Flow ──
    form_count: forms?.results?.length || 0,
    lead_capture_forms: (forms?.results || []).filter((f) => isLeadCaptureForm(f)).length,
    has_lead_routing_workflow: workflowList.some((w) => isLeadRoutingWorkflow(w)),
    has_speed_to_lead: workflowList.some((w) => isSpeedToLeadWorkflow(w)),

    // ── M2: Marketing Email & Nurture ──
    marketing_email_count: marketing_emails?.results?.length || 0,
    published_emails: (marketing_emails?.results || []).filter((e) => e.state === 'PUBLISHED').length,
    nurture_workflow_count: classifyWorkflows(workflowList, 'nurture').length,
    dynamic_list_count: (lists?.lists || []).filter((l) => l.dynamic).length,
    static_list_count: (lists?.lists || []).filter((l) => !l.dynamic).length,

    // ── M3: Sales Execution ──
    has_stalled_deal_notification: workflowList.some((w) => isStalledDealWorkflow(w)),

    // ── M4: Attribution ──
    attribution_workflow_count: classifyWorkflows(workflowList, 'attribution').length,
    has_deal_source_property: hasDealProperty(properties?.deals?.results, ['deal_source', 'dealSource', 'original_source', 'hs_analytics_source']),

    // ── M5: Deal-to-Close ──
    has_competitor_property: hasDealProperty(properties?.deals?.results, ['competitor', 'competitors', 'competitive_landscape']),
    has_close_reason_property: hasDealProperty(properties?.deals?.results, ['closed_lost_reason', 'closed_lost_reasons', 'close_lost_reason']),
    has_closed_won_automation: workflowList.some((w) => isClosedWonWorkflow(w)),

    // ── M6: Customer Success ──
    has_cs_handoff_workflow: workflowList.some((w) => isCSHandoffWorkflow(w)),
    has_onboarding_workflow: workflowList.some((w) => isOnboardingWorkflow(w)),

    // ── M7: Partner ──
    has_partner_pipeline: (pipelines?.deals || []).some((p) => /partner|resell|referr|channel/i.test(p.label)),
    has_referral_workflow: workflowList.some((w) => isReferralWorkflow(w)),

    // ── R4: Win/Loss ──
    has_competitor_tracking: hasDealProperty(properties?.deals?.results, ['competitor', 'competitors']),
    has_closed_lost_reason: hasDealProperty(properties?.deals?.results, ['closed_lost_reason', 'closed_lost_reasons']),

    // ── Activity Signals ──
    task_90day_count: tasks?.total || 0,
    task_completion_rate: tasks?.completion_rate || 0,
    meeting_90day_count: meetings?.total || 0,
    call_90day_count: calls?.total || 0,
    call_recording_rate: calls?.recording_rate || 0,
    has_call_recording: (calls?.with_recording || 0) > 0,

    // ── Custom Object Maturity ──
    custom_object_count: (custom_object_schemas?.results || []).length,
    has_custom_objects: (custom_object_schemas?.results || []).length > 0,
  };
}

// ── Helper Functions ──

function countCustom(propsArray) {
  if (!Array.isArray(propsArray)) return 0;
  return propsArray.filter((p) => !p.hubspotDefined && p.name && !p.name.startsWith('hs_')).length;
}

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

function detectEnrichmentTool(contactProps) {
  if (!Array.isArray(contactProps)) return null;
  for (const tool of ENRICHMENT_PATTERNS) {
    if (contactProps.some((p) => tool.pattern.test(p.name) || tool.pattern.test(p.label || ''))) {
      return tool.name;
    }
  }
  return null;
}

function countEnrichmentFields(contactProps, companyProps) {
  let count = 0;
  const allProps = [...(contactProps || []), ...(companyProps || [])];
  for (const p of allProps) {
    for (const tool of ENRICHMENT_PATTERNS) {
      if (tool.pattern.test(p.name) || tool.pattern.test(p.label || '')) {
        count++;
        break;
      }
    }
  }
  return count;
}

function detectAllEnrichmentTools(properties) {
  const found = [];
  const allProps = [
    ...(properties?.contacts?.results || []),
    ...(properties?.companies?.results || []),
  ];
  for (const tool of ENRICHMENT_PATTERNS) {
    const fields = allProps.filter(
      (p) => tool.pattern.test(p.name) || tool.pattern.test(p.label || '')
    );
    if (fields.length > 0) {
      found.push({ name: tool.name, fieldCount: fields.length });
    }
  }
  return found;
}

function checkMultiObjectEnrichment(properties) {
  const contactEnriched = (properties?.contacts?.results || []).some((p) =>
    ENRICHMENT_PATTERNS.some((t) => t.pattern.test(p.name))
  );
  const companyEnriched = (properties?.companies?.results || []).some((p) =>
    ENRICHMENT_PATTERNS.some((t) => t.pattern.test(p.name))
  );
  return contactEnriched && companyEnriched;
}

function classifyWorkflows(workflows, category) {
  if (!Array.isArray(workflows)) return [];
  const patterns = {
    lifecycle: /lifecycle|life.?cycle|stage.*transition|mql|sql|customer.*stage/i,
    lead_status: /lead.?status|lead.*state|new.*lead|attempted|qualified|nurture/i,
    nurture: /nurture|drip|email.*sequence|follow.?up.*campaign/i,
    attribution: /attribution|source.*track|utm|campaign.*track|first.*touch|last.*touch/i,
  };
  const pattern = patterns[category];
  if (!pattern) return [];
  return workflows.filter((w) => pattern.test(w.name || '') || pattern.test(w.description || ''));
}

function detectLifecycleStages(workflows) {
  if (!Array.isArray(workflows)) return [];
  const stages = new Set();
  const stagePatterns = [
    { stage: 'Lead', pattern: /\blead\b/i },
    { stage: 'MQL', pattern: /\bmql\b|marketing.?qualified/i },
    { stage: 'SQL', pattern: /\bsql\b|sales.?qualified/i },
    { stage: 'Opportunity', pattern: /\bopportunit/i },
    { stage: 'Customer', pattern: /\bcustomer\b/i },
  ];
  for (const wf of workflows) {
    const text = `${wf.name || ''} ${wf.description || ''}`;
    for (const { stage, pattern } of stagePatterns) {
      if (pattern.test(text)) stages.add(stage);
    }
  }
  return [...stages];
}

function detectCrossObjectSync(workflows) {
  if (!Array.isArray(workflows)) return false;
  return workflows.some(
    (w) => /company.*contact|contact.*company|cross.*object|sync.*lifecycle/i.test(w.name || '')
  );
}

function categorizeWorkflows(workflows) {
  if (!Array.isArray(workflows)) return {};
  const categories = {
    lifecycle: [],
    task: [],
    notification: [],
    data_sync: [],
    deal: [],
    marketing: [],
    other: [],
  };
  for (const wf of workflows) {
    const name = (wf.name || '').toLowerCase();
    if (/lifecycle|stage|status/i.test(name)) categories.lifecycle.push(wf.name);
    else if (/task|to.?do|reminder/i.test(name)) categories.task.push(wf.name);
    else if (/notif|alert|slack|email.*internal/i.test(name)) categories.notification.push(wf.name);
    else if (/sync|update|copy|mirror/i.test(name)) categories.data_sync.push(wf.name);
    else if (/deal|pipeline|opportunity|closed/i.test(name)) categories.deal.push(wf.name);
    else if (/marketing|email|nurture|campaign/i.test(name)) categories.marketing.push(wf.name);
    else categories.other.push(wf.name);
  }
  // Remove empty categories
  const result = {};
  for (const [key, arr] of Object.entries(categories)) {
    if (arr.length > 0) result[key] = arr;
  }
  return result;
}

function isTaskWorkflow(wf) {
  return /task|to.?do|assign/i.test(wf.name || '');
}

function isDealCreationWorkflow(wf) {
  return /create.*deal|new.*deal|auto.*deal|deal.*creation/i.test(wf.name || '');
}

function isEnrichmentWorkflow(wf) {
  return /enrich|clay|zoominfo|clearbit|append/i.test(wf.name || '');
}

function extractTeams(ownersArray) {
  if (!Array.isArray(ownersArray)) return [];
  const teamSet = new Set();
  for (const owner of ownersArray) {
    if (owner.teams && Array.isArray(owner.teams)) {
      for (const team of owner.teams) {
        if (team.name) teamSet.add(team.name);
      }
    }
  }
  return [...teamSet];
}

function countOrphanOwners(ownersArray) {
  if (!Array.isArray(ownersArray)) return 0;
  return ownersArray.filter(
    (o) => !o.teams || !Array.isArray(o.teams) || o.teams.length === 0
  ).length;
}

function calcTeamCoverage(ownersArray) {
  if (!Array.isArray(ownersArray) || ownersArray.length === 0) return 0;
  const withTeam = ownersArray.filter(
    (o) => o.teams && Array.isArray(o.teams) && o.teams.length > 0
  ).length;
  return Math.round((withTeam / ownersArray.length) * 100);
}

function isLeadCaptureForm(form) {
  const name = (form.name || '').toLowerCase();
  return /contact|lead|demo|trial|sign.?up|download|newsletter|get.?started/i.test(name);
}

function isLeadRoutingWorkflow(wf) {
  return /lead.*rout|round.?robin|assign.*lead|distribute.*lead/i.test(wf.name || '');
}

function isSpeedToLeadWorkflow(wf) {
  return /speed.?to.?lead|instant.*response|quick.*response|new.*lead.*notif/i.test(wf.name || '');
}

function isStalledDealWorkflow(wf) {
  return /stall|stagnant|inactive.*deal|no.*activity|stuck|aging/i.test(wf.name || '');
}

function hasDealProperty(dealProps, names) {
  if (!Array.isArray(dealProps) || !Array.isArray(names)) return false;
  return dealProps.some((p) => names.includes(p.name));
}

function isClosedWonWorkflow(wf) {
  return /closed.?won|deal.*won|won.*deal|customer.*welcome|handoff/i.test(wf.name || '');
}

function isCSHandoffWorkflow(wf) {
  return /handoff|hand.?off|sales.?to.?cs|cs.*handoff|onboard.*trigger/i.test(wf.name || '');
}

function isOnboardingWorkflow(wf) {
  return /onboard|welcome.*customer|new.*customer|implementation/i.test(wf.name || '');
}

function isReferralWorkflow(wf) {
  return /referral|partner.*deal|channel|resell/i.test(wf.name || '');
}
