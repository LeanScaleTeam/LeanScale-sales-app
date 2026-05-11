/**
 * Attio Signal Extractor
 *
 * Takes raw Attio v2 API metadata and produces a flat signal object
 * compatible with the diagnostic engine graders. Matches the HubSpot/Salesforce
 * signal shape where possible, with Attio-specific automation signals replacing
 * the workflow-based ones (since Attio Workflows aren't yet exposed via API).
 *
 * Inputs (downloaded by lib/attio-downloader.js):
 *   - self            : /v2/self response
 *   - objects         : /v2/objects data
 *   - attributes      : { [object_slug]: [...attributes] }
 *   - statuses        : { "{object}.{attr}": [...statuses] }
 *   - lists           : /v2/lists data
 *   - list_entries    : { [list_id]: [...entries] }   (sampled)
 *   - workspace_members : /v2/workspace-members data
 *   - tasks           : array of tasks
 *   - webhooks        : /v2/webhooks data
 *   - record_samples  : { [object_slug]: [...records] }
 *   - deal_aggregates : { closed_won_count, closed_won_amount, stage_counts, ... }
 */

const STANDARD_ATTIO_OBJECTS = new Set(['people', 'companies', 'deals', 'workspaces', 'users']);

const ENRICHMENT_PATTERNS = [
  { name: 'ZoomInfo', pattern: /zoominfo|zi_/i },
  { name: 'Clearbit', pattern: /clearbit/i },
  { name: 'Apollo', pattern: /apollo/i },
  { name: 'Clay', pattern: /^clay_|_clay_|clay /i },
  { name: 'Cognism', pattern: /cognism/i },
  { name: 'Lusha', pattern: /lusha/i },
  { name: '6sense', pattern: /6sense/i },
  { name: 'Demandbase', pattern: /demandbase/i },
  { name: 'Attio Enrichment', pattern: /^enrich|enriched_/i },
];

const WEBHOOK_PLATFORMS = [
  { name: 'Slack', match: (host) => /hooks\.slack\.com|slack\.com/i.test(host) },
  { name: 'Zapier', match: (host) => /zapier\.com/i.test(host) },
  { name: 'Make', match: (host) => /make\.com|integromat\.com/i.test(host) },
  { name: 'n8n', match: (host) => /n8n\./i.test(host) },
  { name: 'Segment', match: (host) => /segment\.io|segment\.com/i.test(host) },
  { name: 'HubSpot', match: (host) => /hubspot|hubapi/i.test(host) },
  { name: 'Salesforce', match: (host) => /salesforce|force\.com/i.test(host) },
  { name: 'Outreach', match: (host) => /outreach\.io/i.test(host) },
  { name: 'Mixmax', match: (host) => /mixmax/i.test(host) },
];

export function extractAttioSignals(metadata) {
  const {
    objects = [],
    attributes = {},
    statuses = {},
    lists = [],
    list_entries = {},
    workspace_members = [],
    tasks = [],
    webhooks = [],
    record_samples = {},
    deal_aggregates = {},
  } = metadata || {};

  const peopleAttrs = attributes.people || [];
  const companyAttrs = attributes.companies || [];
  const dealAttrs = attributes.deals || [];

  const customObjects = objects.filter((o) => !STANDARD_ATTIO_OBJECTS.has(o.api_slug));

  // ── Webhook analysis ──
  const webhookStats = analyzeWebhooks(webhooks);
  // ── Actor share analysis ──
  const actorStats = analyzeActorShare(record_samples, tasks, workspace_members);
  // ── AI attribute detection ──
  const aiAttributeCount = countAIAttributes(attributes);
  // ── Pipeline stages (Attio: status attributes on deals + status-bearing lists) ──
  const dealPipelineStages = extractDealPipelineStages(dealAttrs, statuses, lists, list_entries);

  return {
    // ── F1: CRM Data Model ──
    contact_total_properties: peopleAttrs.length,
    contact_custom_properties: countCustomAttributes(peopleAttrs),
    company_total_properties: companyAttrs.length,
    company_custom_properties: countCustomAttributes(companyAttrs),
    deal_total_properties: dealAttrs.length,
    deal_custom_properties: countCustomAttributes(dealAttrs),
    ticket_total_properties: 0, // Attio has no native tickets object
    ticket_custom_properties: 0,
    enrichment_tool_detected: detectEnrichmentTool([...peopleAttrs, ...companyAttrs]),
    enrichment_field_count: countEnrichmentFields(peopleAttrs, companyAttrs),
    enrichment_tools: detectAllEnrichmentTools({ peopleAttrs, companyAttrs }),
    enrichment_multi_object: checkMultiObjectEnrichment({ peopleAttrs, companyAttrs }),
    has_enrichment_workflow: false, // Not detectable from API in Attio

    // ── F2: Pipeline Design ──
    deal_pipeline_count: dealPipelineStages.length,
    deal_pipeline_stages: dealPipelineStages,
    ticket_pipeline_count: 0,
    ticket_pipeline_customized: false,

    // ── F3: Lifecycle & Lead Status ──
    // Attio: no workflow API. Use status-attribute presence as proxy.
    lifecycle_workflow_count: 0,
    lead_status_workflow_count: 0,
    lifecycle_stages_covered: detectLifecycleStages(peopleAttrs, companyAttrs),
    has_cross_object_sync: webhookStats.has_cross_object_events,

    // ── F4: Automation Engine — Attio variant (webhooks + AI + actor share) ──
    // These replace workflow-count metrics. The Attio grader consumes these directly.
    attio_webhook_total: webhookStats.total,
    attio_webhook_active: webhookStats.active,
    attio_webhook_platforms: webhookStats.platforms,
    attio_webhook_platform_count: webhookStats.platforms.length,
    attio_webhook_event_types: webhookStats.event_types,
    attio_webhook_event_type_count: webhookStats.event_types.length,
    attio_webhook_with_filter_pct: webhookStats.with_filter_pct,
    attio_webhook_health_pct: webhookStats.health_pct,
    attio_automation_write_share_pct: actorStats.automation_share_pct,
    attio_api_token_actors: actorStats.api_token_actor_count,
    ai_attribute_count: aiAttributeCount,
    // Legacy keys (so HubSpot graders that import these don't crash)
    total_active_workflows: webhookStats.active, // proxy
    total_disabled_workflows: Math.max(0, webhookStats.total - webhookStats.active),
    workflow_categories: {},
    workflow_category_count: 0,
    has_task_automation: webhookStats.event_types.some((e) => /task/i.test(e)),
    has_deal_creation_automation: webhookStats.event_types.some((e) => /record\.created/i.test(e)),

    // ── F5: Team & Ownership ──
    total_owners: workspace_members.length,
    teams: [], // Attio has no native teams concept
    team_count: 0,
    orphan_owner_count: 0, // Not directly knowable
    owner_to_team_coverage: 0,

    // ── M1: Inbound Lead Flow ──
    // Attio forms are not API-exposed; rely on intake answers for this pillar.
    form_count: 0,
    lead_capture_forms: 0,
    has_lead_routing_workflow: false,
    has_speed_to_lead: webhookStats.event_types.some((e) =>
      /record\.created/i.test(e)
    ),

    // ── M2: Marketing Email & Nurture ──
    // Sequences exist in product but not via API; intake covers it.
    marketing_email_count: 0,
    published_emails: 0,
    nurture_workflow_count: 0,
    dynamic_list_count: lists.length, // Attio Lists are all queryable, treat as segmentation
    static_list_count: 0,

    // ── M3: Sales Execution ──
    has_stalled_deal_notification: webhookStats.event_types.some((e) =>
      /list-entry\.updated|record\.updated/i.test(e)
    ),

    // ── M4: Attribution ──
    attribution_workflow_count: 0,
    has_deal_source_property: hasAttr(dealAttrs, ['source', 'deal_source', 'lead_source', 'utm_source']),

    // ── M5: Deal-to-Close ──
    has_competitor_property: hasAttr(dealAttrs, ['competitor', 'competitors', 'competitive']),
    has_close_reason_property: hasAttr(dealAttrs, ['closed_lost_reason', 'close_reason', 'lost_reason']),
    has_closed_won_automation: webhookStats.event_types.some((e) =>
      /list-entry\.updated|record\.updated/i.test(e)
    ),

    // ── M6: Customer Success ──
    has_cs_handoff_workflow: false, // intake
    has_onboarding_workflow: false, // intake

    // ── M7: Partner ──
    has_partner_pipeline: lists.some((l) => /partner|channel|reseller/i.test(l.name || '')),
    has_referral_workflow: false,

    // ── R4: Win/Loss ──
    has_competitor_tracking: hasAttr(dealAttrs, ['competitor', 'competitors']),
    has_closed_lost_reason: hasAttr(dealAttrs, ['closed_lost_reason', 'lost_reason']),

    // ── Activity Signals ──
    task_90day_count: tasks.length,
    task_completion_rate: tasks.length
      ? tasks.filter((t) => t.is_completed).length / tasks.length
      : 0,
    meeting_90day_count: 0, // No first-class meetings API in Attio
    call_90day_count: 0,
    call_recording_rate: 0,
    has_call_recording: false,

    // ── Custom Object Maturity ──
    custom_object_count: customObjects.length,
    has_custom_objects: customObjects.length > 0,

    // ── Deal aggregates (for ARR estimation) ──
    closed_won_count: deal_aggregates.closed_won_count || 0,
    closed_won_amount: deal_aggregates.closed_won_amount || 0,
    total_open_deals: deal_aggregates.total_open_deals || 0,
    deal_stage_counts: deal_aggregates.stage_counts || {},
  };
}

// ── Helpers ──

function countCustomAttributes(attrs) {
  if (!Array.isArray(attrs)) return 0;
  // Attio attributes have `is_system: true` for built-ins
  return attrs.filter((a) => a.is_system === false || (a.is_system == null && a.is_default !== true)).length;
}

function countAIAttributes(attributesByObject) {
  let count = 0;
  for (const attrs of Object.values(attributesByObject || {})) {
    for (const a of attrs || []) {
      if (a.is_ai_attribute || a.ai_autofill_config || a.config?.ai_autofill || a.type === 'ai') {
        count++;
      }
    }
  }
  return count;
}

function hasAttr(attrs, needles) {
  if (!Array.isArray(attrs)) return false;
  const lowerNeedles = needles.map((n) => n.toLowerCase());
  return attrs.some((a) => {
    const slug = (a.api_slug || '').toLowerCase();
    const title = (a.title || '').toLowerCase();
    return lowerNeedles.some((n) => slug.includes(n) || title.includes(n));
  });
}

function detectEnrichmentTool(attrs) {
  for (const tool of ENRICHMENT_PATTERNS) {
    if (attrs.some((a) => tool.pattern.test(a.api_slug || '') || tool.pattern.test(a.title || ''))) {
      return tool.name;
    }
  }
  return null;
}

function countEnrichmentFields(peopleAttrs, companyAttrs) {
  const all = [...(peopleAttrs || []), ...(companyAttrs || [])];
  let count = 0;
  for (const a of all) {
    for (const tool of ENRICHMENT_PATTERNS) {
      if (tool.pattern.test(a.api_slug || '') || tool.pattern.test(a.title || '')) {
        count++;
        break;
      }
    }
  }
  return count;
}

function detectAllEnrichmentTools({ peopleAttrs, companyAttrs }) {
  const all = [...(peopleAttrs || []), ...(companyAttrs || [])];
  const found = [];
  for (const tool of ENRICHMENT_PATTERNS) {
    const fields = all.filter(
      (a) => tool.pattern.test(a.api_slug || '') || tool.pattern.test(a.title || '')
    );
    if (fields.length > 0) found.push({ name: tool.name, fieldCount: fields.length });
  }
  return found;
}

function checkMultiObjectEnrichment({ peopleAttrs, companyAttrs }) {
  const peopleHit = (peopleAttrs || []).some((a) =>
    ENRICHMENT_PATTERNS.some((t) => t.pattern.test(a.api_slug || ''))
  );
  const companyHit = (companyAttrs || []).some((a) =>
    ENRICHMENT_PATTERNS.some((t) => t.pattern.test(a.api_slug || ''))
  );
  return peopleHit && companyHit;
}

function detectLifecycleStages(peopleAttrs, companyAttrs) {
  const all = [...(peopleAttrs || []), ...(companyAttrs || [])];
  const lifecycleAttr = all.find(
    (a) =>
      /lifecycle|stage|status/i.test(a.api_slug || '') &&
      (a.type === 'status' || a.type === 'select')
  );
  return lifecycleAttr ? [lifecycleAttr.title || lifecycleAttr.api_slug] : [];
}

function extractDealPipelineStages(dealAttrs, statuses, lists, listEntries) {
  const pipelines = [];

  // Strategy 1: status attribute directly on the deals object
  const statusAttrs = (dealAttrs || []).filter((a) => a.type === 'status');
  for (const attr of statusAttrs) {
    const key = `deals.${attr.api_slug}`;
    const stageList = statuses?.[key] || [];
    if (stageList.length > 0) {
      pipelines.push({
        name: attr.title || attr.api_slug,
        source: 'object_status_attr',
        stageCount: stageList.length,
        stages: stageList.map((s) => s.title || s.value),
        hasClosedLost: stageList.some((s) => /lost/i.test(s.title || s.value || '')),
        hasClosedWon: stageList.some((s) => /won/i.test(s.title || s.value || '')),
        hasStalled: stageList.some((s) => /stall|hold|park/i.test(s.title || s.value || '')),
      });
    }
  }

  // Strategy 2: lists with a status attribute (Attio's main pipeline modeling pattern)
  for (const list of lists || []) {
    const listId = list.id?.list_id || list.api_slug;
    const entries = listEntries?.[listId] || [];
    if (entries.length === 0) continue;
    // Detect a stage-like status in entry values
    const firstEntry = entries[0];
    const stageEntry =
      firstEntry?.entry_values?.stage?.[0] ||
      firstEntry?.entry_values?.status?.[0];
    if (!stageEntry) continue;
    const uniqStages = new Set();
    for (const e of entries) {
      const s =
        e?.entry_values?.stage?.[0]?.status?.title ||
        e?.entry_values?.status?.[0]?.status?.title;
      if (s) uniqStages.add(s);
    }
    if (uniqStages.size > 0) {
      const stages = [...uniqStages];
      pipelines.push({
        name: list.name || list.api_slug,
        source: 'list_status',
        stageCount: stages.length,
        stages,
        hasClosedLost: stages.some((s) => /lost/i.test(s)),
        hasClosedWon: stages.some((s) => /won/i.test(s)),
        hasStalled: stages.some((s) => /stall|hold|park/i.test(s)),
      });
    }
  }

  return pipelines;
}

function analyzeWebhooks(webhooks) {
  const list = Array.isArray(webhooks) ? webhooks : [];
  const total = list.length;
  const active = list.filter((w) => (w.status || 'active') === 'active').length;
  const platformSet = new Set();
  const eventSet = new Set();
  let withFilter = 0;
  let crossObject = false;

  for (const w of list) {
    const url = w.target_url || '';
    try {
      const host = new URL(url).host;
      for (const p of WEBHOOK_PLATFORMS) {
        if (p.match(host)) platformSet.add(p.name);
      }
      if (![...platformSet].some((p) => host.includes(p.toLowerCase()))) {
        // Tag unknown destinations as Custom
        platformSet.add('Custom');
      }
    } catch {
      /* invalid URL */
    }
    const subs = w.subscriptions || [];
    for (const s of subs) {
      if (s.event_type) eventSet.add(s.event_type);
      if (s.filter && (Array.isArray(s.filter.$and) || Array.isArray(s.filter.$or))) {
        withFilter++;
      }
    }
    const objs = new Set(subs.map((s) => (s.event_type || '').split('.')[0]));
    if (objs.size > 1) crossObject = true;
  }

  return {
    total,
    active,
    platforms: [...platformSet],
    event_types: [...eventSet],
    with_filter_pct: total ? Math.round((withFilter / Math.max(1, total)) * 100) : 0,
    health_pct: total ? Math.round((active / total) * 100) : 0,
    has_cross_object_events: crossObject,
  };
}

function analyzeActorShare(recordSamples, tasks, workspaceMembers) {
  const humanIds = new Set((workspaceMembers || []).map((m) => m.id?.workspace_member_id || m.id));
  let total = 0;
  let nonHuman = 0;
  let apiTokenCount = 0;

  const buckets = [
    ...Object.values(recordSamples || {}).flat(),
    ...(tasks || []),
  ];

  for (const item of buckets) {
    const actor = item?.created_by_actor || item?.created_by;
    if (!actor) continue;
    total++;
    const actorType = actor.type || actor.actor_type;
    if (actorType && actorType !== 'workspace-member') {
      nonHuman++;
      if (actorType === 'api-token' || actorType === 'system') apiTokenCount++;
    } else if (actor.id && !humanIds.has(actor.id)) {
      // Actor we don't recognize as a workspace member
      nonHuman++;
    }
  }

  return {
    sampled_writes: total,
    automation_share_pct: total ? Math.round((nonHuman / total) * 100) : 0,
    api_token_actor_count: apiTokenCount,
  };
}
