/**
 * HubSpot Intake Inferrer
 *
 * Reads HubSpot metadata (same shape stored in `hubspot_metadata` table)
 * and produces a pre-fill map for intake form questions. Each entry has:
 *   { value: string|string[], confidence: 'high'|'medium', evidence: string }
 *
 * HIGH-confidence inferences (auto-select):
 *   A2  — rep count bucket
 *   C6  — closed-lost reason tracking
 *   C10 — deduplication process
 *
 * MEDIUM-confidence inferences (auto-select with evidence):
 *   A3  — ARR range (from deal aggregates)
 *   A4  — GTM motion (from contact source distribution)
 *   A5  — partner program
 *   B1_tools — detected GTM tools
 *   C1  — lead capture method
 *   C2  — response time
 *   C3  — MQL definition
 *   C4  — qualification methodology
 *   C5  — required fields on deal stages
 *   C7  — CS handoff process
 *   C8  — renewal tracking
 *   C9  — NPS/CSAT program
 *   C11 — email nurture campaigns
 *   M4_pipeline — deal attribution
 *   M7_tracking — partner deal tracking
 *   T1  — GTM org size
 *   T3  — territory model
 *   T5  — team structure
 *   D3  — forecasting method
 *   D6  — playbooks / enablement
 *   E2  — content access
 *   E3  — call review cadence
 *   C12 — events / webinars (from campaigns + workflows)
 *   C13 — operating / GTM plan (from goals + deal aggregates)
 *   T4  — comp plan (from deal properties)
 *   D4  — growth model (from deal aggregates + pipelines)
 *   E1  — planning data source (from goals + deal aggregates)
 *   R4_winloss — win/loss analysis (from deal properties)
 *   D5_arr through D5_cycle — Power 10 metrics (from deal data + pipelines + properties)
 */

// ── Sales Team Patterns ──

const SALES_TEAM_PATTERNS = [/sales/i, /\bae\b/i, /\bsdr\b/i, /\bbdr\b/i, /account\s*executive/i, /business\s*dev/i];

// ── Tool Detection Patterns ──

const TOOL_PATTERNS = [
  { key: 'sales_engagement', fieldPatterns: [/^outreach_/i, /^salesloft_/i, /^apollo_/i] },
  { key: 'conversation_intel', fieldPatterns: [/^gong_/i, /^chorus_/i, /^wingman/i, /^revenue_io/i] },
  { key: 'data_enrichment', fieldPatterns: [/^zoominfo/i, /^zi_/i, /^clearbit/i, /^clay_/i] },
  { key: 'csp', fieldPatterns: [/^gainsight/i, /^churnzero/i] },
  { key: 'lead_routing', fieldPatterns: [/^leandata/i, /^chilipiper/i] },
  { key: 'esign', fieldPatterns: [/^docusign/i, /^pandadoc/i] },
  { key: 'bi_analytics', fieldPatterns: [] },
  { key: 'support', fieldPatterns: [/^zendesk/i, /^intercom/i] },
  { key: 'enablement_platform', fieldPatterns: [/^highspot/i, /^seismic/i, /^showpad/i, /^guru_/i] },
  { key: 'forecasting_tool', fieldPatterns: [/^clari_/i, /^aviso_/i, /^boostup_/i] },
  { key: 'abm_tool', fieldPatterns: [/^6sense/i, /^demandbase/i, /^terminus/i, /^rollworks/i] },
  { key: 'prm_tool', fieldPatterns: [/^partnerstack/i, /^crossbeam/i, /^reveal_/i] },
  { key: 'lms', fieldPatterns: [/^lessonly/i, /^workramp/i, /^docebo/i, /^mindtickle/i] },
];

// ── Field & Workflow Patterns ──

const CLOSED_LOST_FIELD_PATTERN = /closed.*lost.*reason|loss.*reason|close.*reason/i;
const DEDUP_WORKFLOW_PATTERN = /dedup|duplicate|merge/i;
const PARTNER_PIPELINE_PATTERN = /partner|referral|channel/i;
const LEAD_ROUTING_WORKFLOW_PATTERN = /lead.*rout|round.*robin|assign.*lead|speed.*lead/i;
const NURTURE_WORKFLOW_PATTERN = /nurture|drip|sequence/i;
const CS_HANDOFF_PATTERN = /handoff|hand.?off|onboard|customer.*success/i;
const RENEWAL_PATTERN = /renewal/i;
const NPS_CSAT_PATTERN = /nps|csat|satisfaction|feedback|survey/i;
const LEAD_SCORE_WORKFLOW_PATTERN = /lead.*scor|scoring/i;
const MQL_QUALIFIED_PATTERN = /mql|qualified|qualification/i;
const METHODOLOGY_PATTERNS = [
  { value: 'MEDDIC/MEDDPICC', pattern: /meddic|meddpicc/i },
  { value: 'BANT', pattern: /bant/i },
  { value: 'SPICED', pattern: /spiced/i },
];
const ENABLEMENT_PATTERN = /highspot|seismic|showpad|guru/i;
const GEOGRAPHIC_TEAM_PATTERN = /emea|apac|americas|latam|amer|na\b|eu\b/i;
const SEGMENT_TEAM_PATTERN = /enterprise|mid.?market|smb|commercial|strategic/i;
const FUNCTION_TEAM_PATTERN = /\bsdr\b|\bae\b|\bam\b|\bcse?\b|account\s*manage/i;

// ── New Inference Patterns ──

const EVENT_CAMPAIGN_PATTERN = /webinar|event|conference|dinner|field.?event|roadshow|summit|meetup/i;
const COMMISSION_PATTERN = /commission|comp.?plan|variable.?comp|quota|spiff|bonus|incentive/i;
const ACCELERATOR_PATTERN = /accelerat|kicker|multiplier|tier/i;
const ARR_PATTERN = /\barr\b|annual.?recurring|recurring.?revenue|mrr|monthly.?recurring/i;
const CHURN_PATTERN = /churn|logo.?retention/i;
const COMPETITOR_PATTERN = /competitor|competitive|alternative/i;
const CI_WORKFLOW_PATTERN = /gong|chorus|clari|aviso|wingman|revenue.?io|conversation.?intel/i;

// ── Main Export ──

/**
 * Infer intake form answers from HubSpot metadata.
 *
 * @param {object|null} metadata - Raw HubSpot metadata (same shape as hubspot_metadata table)
 * @returns {object} Pre-fill map keyed by question ID. Each entry:
 *   { value: string|string[], confidence: 'high'|'medium', evidence: string }
 */
export function inferHubSpotIntakeAnswers(metadata) {
  const preFill = {};
  if (!metadata) return preFill;

  // Normalize
  const properties = metadata.properties || {};
  const pipelines = metadata.pipelines || {};
  const workflows = getWorkflowResults(metadata.workflows);
  const forms = getFormResults(metadata.forms);
  const owners = getOwnerResults(metadata.owners);
  const marketingEmails = getMarketingEmailResults(metadata.marketing_emails);

  const dealProps = getPropertyResults(properties, 'deals');
  const contactProps = getPropertyResults(properties, 'contacts');
  const allPropNames = collectAllPropertyNames(properties);
  const dealPipelines = getPipelineResults(pipelines, 'deals');
  const dealAggregates = metadata.deal_aggregates || null;
  const contactSources = metadata.contact_sources || null;
  const meetings = metadata.meetings || null;
  const goals = metadata.goals || null;
  const campaigns = getCampaignResults(metadata.campaigns);
  const calls = metadata.calls || null;

  // ── HIGH CONFIDENCE ──

  inferA2(preFill, owners);
  inferC6(preFill, dealProps);
  inferC10(preFill, workflows);

  // ── MEDIUM CONFIDENCE ──

  inferA3(preFill, dealAggregates);
  inferA4(preFill, contactSources);
  inferA5(preFill, dealPipelines, workflows);
  inferB1Tools(preFill, allPropNames);
  inferC1(preFill, forms, workflows);
  inferC2(preFill, workflows);
  inferC3(preFill, workflows, contactProps);
  inferC4(preFill, dealProps);
  inferC5(preFill, dealPipelines);
  inferC7(preFill, workflows);
  inferC8(preFill, dealPipelines, dealProps);
  inferC9(preFill, workflows, contactProps);
  inferC11(preFill, workflows, marketingEmails);
  inferM4Pipeline(preFill, dealProps);
  inferM7Tracking(preFill, dealPipelines);
  inferT1(preFill, owners);
  inferT3(preFill, workflows, owners);
  inferT5(preFill, owners);
  inferD3(preFill, dealProps);
  inferD6(preFill, allPropNames);
  inferE2(preFill, allPropNames);
  inferE3(preFill, contactProps);
  inferPL5(preFill, meetings);
  inferRP6Goals(preFill, goals, dealProps);

  // ── EXPANDED COVERAGE ──

  inferC12(preFill, campaigns, workflows);
  inferC13(preFill, goals, dealAggregates);
  inferT4(preFill, dealProps);
  inferD4(preFill, dealAggregates, dealPipelines, dealProps);
  inferE1(preFill, goals, dealAggregates);
  inferR4WinLoss(preFill, dealProps);
  inferPower10(preFill, dealAggregates, dealPipelines, dealProps, contactProps, workflows);

  return preFill;
}

// ── HIGH CONFIDENCE Inferences ──

/**
 * A2: Rep count — filter owners by sales team patterns, then bucket.
 * Map to buckets: 1-5, 6-15, 16-50, 50+
 */
function inferA2(preFill, owners) {
  // Filter owners whose teams match sales patterns
  const salesOwners = owners.filter((o) => {
    const teams = Array.isArray(o.teams) ? o.teams : [];
    return teams.some((t) => {
      const teamName = t.name || '';
      return SALES_TEAM_PATTERNS.some((p) => p.test(teamName));
    });
  });

  // Fallback: if no team matches, count all owners
  const count = salesOwners.length > 0 ? salesOwners.length : owners.length;
  if (count === 0) return;

  let bucket;
  if (count <= 5) bucket = '1-5';
  else if (count <= 15) bucket = '6-15';
  else if (count <= 50) bucket = '16-50';
  else bucket = '50+';

  const evidenceDetail = salesOwners.length > 0
    ? `${salesOwners.length} owners with sales-related team assignments`
    : `${owners.length} total owners (no sales team filter matched)`;

  preFill.A2 = {
    value: bucket,
    confidence: 'high',
    evidence: evidenceDetail,
  };
}

// ── MEDIUM CONFIDENCE — Expanded Data Inferences ──

/**
 * A3: ARR range — bucket closed-won deal amounts from current year.
 * Buckets: <$1M, $1-5M, $5-20M, $20-50M, $50M+
 */
function inferA3(preFill, dealAggregates) {
  if (!dealAggregates || !dealAggregates.total_closed_won_amount) return;

  const amount = dealAggregates.total_closed_won_amount;
  if (amount <= 0) return;

  let bucket;
  if (amount < 1_000_000) bucket = '<$1M';
  else if (amount < 5_000_000) bucket = '$1-5M';
  else if (amount < 20_000_000) bucket = '$5-20M';
  else if (amount < 50_000_000) bucket = '$20-50M';
  else bucket = '$50M+';

  const formatted = amount >= 1_000_000
    ? `$${(amount / 1_000_000).toFixed(1)}M`
    : `$${Math.round(amount / 1000)}K`;

  preFill.A3 = {
    value: bucket,
    confidence: 'medium',
    evidence: `${formatted} closed-won in ${dealAggregates.year} (${dealAggregates.closed_won_deal_count} deals)`,
  };
}

/**
 * A4: GTM motion — infer from contact source distribution.
 * >50% organic_search/social/referral → "Inbound-led"
 * >50% paid_search/paid_social → "Outbound-led"
 * >30% direct_traffic + product usage → "Product-led"
 * Mixed → "Blended"
 */
function inferA4(preFill, contactSources) {
  if (!contactSources || !contactSources.source_distribution) return;

  const dist = contactSources.source_distribution;
  const total = contactSources.sample_size;
  if (total < 10) return; // need meaningful sample

  // Group sources into GTM motions
  const inboundSources = ['ORGANIC_SEARCH', 'SOCIAL_MEDIA', 'REFERRALS', 'EMAIL_MARKETING'];
  const outboundSources = ['PAID_SEARCH', 'PAID_SOCIAL', 'OFFLINE'];
  const productSources = ['DIRECT_TRAFFIC'];

  let inbound = 0, outbound = 0, product = 0;
  for (const [source, count] of Object.entries(dist)) {
    const key = source.toUpperCase();
    if (inboundSources.includes(key)) inbound += count;
    else if (outboundSources.includes(key)) outbound += count;
    else if (productSources.includes(key)) product += count;
  }

  const inboundPct = inbound / total;
  const outboundPct = outbound / total;
  const productPct = product / total;

  let value, detail;
  if (inboundPct > 0.5) {
    value = 'Inbound-led';
    detail = `${Math.round(inboundPct * 100)}% inbound sources`;
  } else if (outboundPct > 0.5) {
    value = 'Outbound-led';
    detail = `${Math.round(outboundPct * 100)}% paid/outbound sources`;
  } else if (productPct > 0.3) {
    value = 'Product-led';
    detail = `${Math.round(productPct * 100)}% direct traffic`;
  } else {
    value = 'Blended';
    detail = `Mixed sources: ${Math.round(inboundPct * 100)}% inbound, ${Math.round(outboundPct * 100)}% outbound, ${Math.round(productPct * 100)}% direct`;
  }

  preFill.A4 = {
    value,
    confidence: 'medium',
    evidence: `Contact source analysis (${total} contacts): ${detail}`,
  };
}

/**
 * D3: Forecasting — check if hs_forecast_amount property exists on deals.
 * Found → "CRM forecast tool"
 */
function inferD3(preFill, dealProps) {
  const hasForecast = dealProps.some((p) => p.name === 'hs_forecast_amount');

  if (!hasForecast) return;

  preFill.D3 = {
    value: 'CRM forecast tool',
    confidence: 'medium',
    evidence: 'HubSpot forecast amount property detected on deals',
  };
}

/**
 * C6: Closed-lost reason — find deal property matching closed-lost patterns.
 * Found + enumeration type -> "Required field" (enums are typically required)
 * Found + other type -> "Optional field"
 * Not found -> "Not tracked"
 */
function inferC6(preFill, dealProps) {
  const matchingProp = dealProps.find((p) => {
    const nameLabel = `${p.name || ''} ${p.label || ''}`;
    return CLOSED_LOST_FIELD_PATTERN.test(nameLabel);
  });

  let value;
  if (matchingProp && matchingProp.type === 'enumeration') {
    value = 'Required field';
  } else if (matchingProp) {
    value = 'Optional field';
  } else {
    value = 'Not tracked';
  }

  const evidence = matchingProp
    ? `Property "${matchingProp.label || matchingProp.name}" found on deals (type: ${matchingProp.type || 'unknown'})`
    : 'No closed-lost reason property found on deals';

  preFill.C6 = {
    value,
    confidence: 'high',
    evidence,
  };
}

/**
 * C10: Deduplication — check workflows for dedup/duplicate/merge patterns.
 * Only infer when found; absence does not mean "No process".
 */
function inferC10(preFill, workflows) {
  const dedupWorkflows = workflows.filter((w) => {
    const name = w.name || '';
    return DEDUP_WORKFLOW_PATTERN.test(name);
  });

  if (dedupWorkflows.length === 0) return;

  preFill.C10 = {
    value: 'Automated tool',
    confidence: 'high',
    evidence: `Deduplication workflow${dedupWorkflows.length > 1 ? 's' : ''} detected: ${dedupWorkflows.map((w) => w.name).join(', ')}`,
  };
}

// ── MEDIUM CONFIDENCE Inferences ──

/**
 * A5: Partner program — check deal pipelines or workflows for partner/referral/channel patterns.
 * Found -> "Yes, active"
 */
function inferA5(preFill, dealPipelines, workflows) {
  const partnerPipeline = dealPipelines.find((p) => {
    const label = p.label || '';
    return PARTNER_PIPELINE_PATTERN.test(label);
  });

  const partnerWorkflow = workflows.find((w) => {
    const name = w.name || '';
    return PARTNER_PIPELINE_PATTERN.test(name);
  });

  if (!partnerPipeline && !partnerWorkflow) return;

  const evidence = partnerPipeline
    ? `Partner/referral pipeline detected: "${partnerPipeline.label}"`
    : `Partner/referral workflow detected: "${partnerWorkflow.name}"`;

  preFill.A5 = {
    value: 'Yes, active',
    confidence: 'medium',
    evidence,
  };
}

/**
 * B1_tools: Match property name prefixes against tool patterns.
 * Returns array of matched tool category keys.
 */
function inferB1Tools(preFill, allPropNames) {
  const matchedTools = [];
  const evidenceParts = [];

  for (const toolDef of TOOL_PATTERNS) {
    const fieldMatch = allPropNames.find((name) =>
      toolDef.fieldPatterns.some((p) => p.test(name))
    );

    if (fieldMatch) {
      matchedTools.push(toolDef.key);
      evidenceParts.push(`${toolDef.key} (property prefix match)`);
    }
  }

  if (matchedTools.length === 0) return;

  preFill.B1_tools = {
    value: matchedTools,
    confidence: 'medium',
    evidence: `Detected tools: ${evidenceParts.join(', ')}`,
  };
}

/**
 * C1: Lead capture — check forms count or lead routing workflows.
 * Found -> "CRM forms (HubSpot/SF)"
 */
function inferC1(preFill, forms, workflows) {
  const hasForms = forms.length > 0;

  const hasLeadRoutingWorkflow = workflows.some((w) => {
    const name = w.name || '';
    return LEAD_ROUTING_WORKFLOW_PATTERN.test(name);
  });

  if (!hasForms && !hasLeadRoutingWorkflow) return;

  const evidence = hasForms
    ? `${forms.length} HubSpot form${forms.length !== 1 ? 's' : ''} detected`
    : 'Lead routing workflow detected';

  preFill.C1 = {
    value: 'CRM forms (HubSpot/SF)',
    confidence: 'medium',
    evidence,
  };
}

/**
 * C2: Response time — check workflows for speed-to-lead or lead routing patterns.
 * Found -> "<5 minutes"
 */
function inferC2(preFill, workflows) {
  const hasSpeedToLead = workflows.some((w) => {
    const name = w.name || '';
    return LEAD_ROUTING_WORKFLOW_PATTERN.test(name);
  });

  if (!hasSpeedToLead) return;

  preFill.C2 = {
    value: '<5 minutes',
    confidence: 'medium',
    evidence: 'Lead routing / speed-to-lead workflow detected',
  };
}

/**
 * C3: MQL definition — check workflows for lead scoring or contact properties for MQL patterns.
 * Score workflow -> "Yes, with lead scoring"
 * MQL/qualified properties (no score) -> "Yes, criteria-based"
 */
function inferC3(preFill, workflows, contactProps) {
  const hasLeadScoreWorkflow = workflows.some((w) => {
    const name = w.name || '';
    return LEAD_SCORE_WORKFLOW_PATTERN.test(name);
  });

  const hasMqlProp = contactProps.some((p) => {
    const nameLabel = `${p.name || ''} ${p.label || ''}`;
    return MQL_QUALIFIED_PATTERN.test(nameLabel);
  });

  if (!hasLeadScoreWorkflow && !hasMqlProp) return;

  if (hasLeadScoreWorkflow) {
    preFill.C3 = {
      value: 'Yes, with lead scoring',
      confidence: 'medium',
      evidence: 'Lead scoring workflow detected',
    };
  } else {
    preFill.C3 = {
      value: 'Yes, criteria-based',
      confidence: 'medium',
      evidence: 'MQL/qualification property detected on contacts',
    };
  }
}

/**
 * C4: Qualification methodology — check deal properties for MEDDIC/BANT/SPICED patterns.
 * Returns the first matching methodology.
 */
function inferC4(preFill, dealProps) {
  for (const { value, pattern } of METHODOLOGY_PATTERNS) {
    const match = dealProps.find((p) => {
      const nameLabel = `${p.name || ''} ${p.label || ''}`;
      return pattern.test(nameLabel);
    });

    if (match) {
      preFill.C4 = {
        value,
        confidence: 'medium',
        evidence: `Property "${match.label || match.name}" on deals matches ${value} methodology`,
      };
      return;
    }
  }
}

/**
 * C5: Required fields — check deal pipeline stages for distinct non-zero probabilities.
 * All stages have distinct non-zero probabilities -> "Some stages" (weaker proxy than SF validation rules).
 */
function inferC5(preFill, dealPipelines) {
  for (const pipeline of dealPipelines) {
    const stages = Array.isArray(pipeline.stages) ? pipeline.stages : [];
    if (stages.length === 0) continue;

    const probabilities = stages
      .map((s) => {
        const prob = s.metadata && s.metadata.probability != null
          ? parseFloat(s.metadata.probability)
          : null;
        return prob;
      })
      .filter((p) => p !== null && p > 0);

    const uniqueProbs = new Set(probabilities);

    if (probabilities.length > 0 && uniqueProbs.size === probabilities.length) {
      preFill.C5 = {
        value: 'Some stages',
        confidence: 'medium',
        evidence: `Pipeline "${pipeline.label}" has ${stages.length} stages with distinct non-zero probabilities`,
      };
      return;
    }
  }
}

/**
 * C7: CS handoff — check workflows for handoff or onboarding patterns.
 * "handoff" -> "Documented + automated"
 * "onboard" only -> "Informal"
 */
function inferC7(preFill, workflows) {
  const handoffWorkflow = workflows.find((w) => {
    const name = w.name || '';
    return /handoff|hand.?off/i.test(name);
  });

  const onboardWorkflow = workflows.find((w) => {
    const name = w.name || '';
    return CS_HANDOFF_PATTERN.test(name);
  });

  if (!handoffWorkflow && !onboardWorkflow) return;

  if (handoffWorkflow) {
    preFill.C7 = {
      value: 'Documented + automated',
      confidence: 'medium',
      evidence: `CS handoff workflow detected: "${handoffWorkflow.name}"`,
    };
  } else {
    preFill.C7 = {
      value: 'Informal',
      confidence: 'medium',
      evidence: `Onboarding workflow detected: "${onboardWorkflow.name}"`,
    };
  }
}

/**
 * C8: Renewals — check pipelines or deal properties for renewal patterns.
 * Found -> "Automated in CRM/CSP"
 */
function inferC8(preFill, dealPipelines, dealProps) {
  const renewalPipeline = dealPipelines.find((p) => {
    const label = p.label || '';
    return RENEWAL_PATTERN.test(label);
  });

  const renewalProp = dealProps.find((p) => {
    const nameLabel = `${p.name || ''} ${p.label || ''}`;
    return RENEWAL_PATTERN.test(nameLabel);
  });

  if (!renewalPipeline && !renewalProp) return;

  const evidence = renewalPipeline
    ? `Renewal pipeline detected: "${renewalPipeline.label}"`
    : `Renewal property detected: "${renewalProp.label || renewalProp.name}"`;

  preFill.C8 = {
    value: 'Automated in CRM/CSP',
    confidence: 'medium',
    evidence,
  };
}

/**
 * C9: NPS/CSAT — check workflows AND contact properties for NPS/CSAT patterns.
 * Both -> "Yes, automated program"
 * Properties only -> "Yes, ad hoc"
 */
function inferC9(preFill, workflows, contactProps) {
  const hasNpsWorkflow = workflows.some((w) => {
    const name = w.name || '';
    return NPS_CSAT_PATTERN.test(name);
  });

  const hasNpsProp = contactProps.some((p) => {
    const nameLabel = `${p.name || ''} ${p.label || ''}`;
    return NPS_CSAT_PATTERN.test(nameLabel);
  });

  if (!hasNpsWorkflow && !hasNpsProp) return;

  if (hasNpsWorkflow && hasNpsProp) {
    preFill.C9 = {
      value: 'Yes, automated program',
      confidence: 'medium',
      evidence: 'NPS/CSAT workflow and contact properties detected',
    };
  } else if (hasNpsProp) {
    preFill.C9 = {
      value: 'Yes, ad hoc',
      confidence: 'medium',
      evidence: 'NPS/CSAT contact properties detected (no automated workflow)',
    };
  }
}

/**
 * C11: Nurture campaigns — check workflows for nurture patterns or marketing email count.
 * Workflow match -> "Yes, in CRM/MAP"
 * Marketing emails > 5 -> "Yes, other tool"
 */
function inferC11(preFill, workflows, marketingEmails) {
  const hasNurtureWorkflow = workflows.some((w) => {
    const name = w.name || '';
    return NURTURE_WORKFLOW_PATTERN.test(name);
  });

  if (hasNurtureWorkflow) {
    preFill.C11 = {
      value: 'Yes, in CRM/MAP',
      confidence: 'medium',
      evidence: 'Nurture/drip workflow detected',
    };
    return;
  }

  if (marketingEmails.length > 5) {
    preFill.C11 = {
      value: 'Yes, other tool',
      confidence: 'medium',
      evidence: `${marketingEmails.length} marketing emails detected`,
    };
  }
}

/**
 * M4_pipeline: Deal attribution — check deal properties for source fields.
 * Found -> "Yes, in CRM"
 */
function inferM4Pipeline(preFill, dealProps) {
  const sourceProp = dealProps.find((p) => {
    const name = p.name || '';
    return name === 'deal_source' || name === 'hs_analytics_source';
  });

  if (!sourceProp) return;

  preFill.M4_pipeline = {
    value: 'Yes, in CRM',
    confidence: 'medium',
    evidence: `Deal source property detected: "${sourceProp.label || sourceProp.name}"`,
  };
}

/**
 * M7_tracking: Partner deal tracking — check pipelines for partner/referral/channel patterns.
 * Found -> "Separate pipeline"
 */
function inferM7Tracking(preFill, dealPipelines) {
  const partnerPipeline = dealPipelines.find((p) => {
    const label = p.label || '';
    return PARTNER_PIPELINE_PATTERN.test(label);
  });

  if (!partnerPipeline) return;

  preFill.M7_tracking = {
    value: 'Separate pipeline',
    confidence: 'medium',
    evidence: `Partner/referral pipeline detected: "${partnerPipeline.label}"`,
  };
}

/**
 * T1: GTM org size — count total owners.
 * Buckets: 1-10, 11-25, 26-50, 51-100, 100+
 */
function inferT1(preFill, owners) {
  const count = owners.length;
  if (count === 0) return;

  let bucket;
  if (count <= 10) bucket = '1-10';
  else if (count <= 25) bucket = '11-25';
  else if (count <= 50) bucket = '26-50';
  else if (count <= 100) bucket = '51-100';
  else bucket = '100+';

  preFill.T1 = {
    value: bucket,
    confidence: 'medium',
    evidence: `${count} HubSpot owner${count !== 1 ? 's' : ''} detected`,
  };
}

/**
 * T3: Territory model — check workflows for round-robin or owner teams for geographic patterns.
 * Round-robin workflow -> "Round-robin"
 * Geographic team names -> "Geographic"
 */
function inferT3(preFill, workflows, owners) {
  const hasRoundRobin = workflows.some((w) => {
    const name = w.name || '';
    return /round.*robin/i.test(name);
  });

  if (hasRoundRobin) {
    preFill.T3 = {
      value: 'Round-robin',
      confidence: 'medium',
      evidence: 'Round-robin workflow detected',
    };
    return;
  }

  const hasGeoTeam = owners.some((o) => {
    const teams = Array.isArray(o.teams) ? o.teams : [];
    return teams.some((t) => GEOGRAPHIC_TEAM_PATTERN.test(t.name || ''));
  });

  if (hasGeoTeam) {
    preFill.T3 = {
      value: 'Geographic',
      confidence: 'medium',
      evidence: 'Geographic team names detected (e.g., EMEA, APAC, Americas)',
    };
  }
}

/**
 * T5: Team structure — check owner team names for function/geography/segment patterns.
 * Function patterns -> "By function (SDR/AE/AM)"
 * Geographic patterns -> "By geography"
 * Segment patterns -> "By segment"
 */
function inferT5(preFill, owners) {
  const allTeamNames = [];
  for (const o of owners) {
    const teams = Array.isArray(o.teams) ? o.teams : [];
    for (const t of teams) {
      if (t.name) allTeamNames.push(t.name);
    }
  }

  if (allTeamNames.length === 0) return;

  const hasFunction = allTeamNames.some((name) => FUNCTION_TEAM_PATTERN.test(name));
  const hasGeo = allTeamNames.some((name) => GEOGRAPHIC_TEAM_PATTERN.test(name));
  const hasSegment = allTeamNames.some((name) => SEGMENT_TEAM_PATTERN.test(name));

  if (hasFunction) {
    preFill.T5 = {
      value: 'By function (SDR/AE/AM)',
      confidence: 'medium',
      evidence: 'Function-based team names detected (e.g., SDR, AE, AM)',
    };
  } else if (hasGeo) {
    preFill.T5 = {
      value: 'By geography',
      confidence: 'medium',
      evidence: 'Geography-based team names detected',
    };
  } else if (hasSegment) {
    preFill.T5 = {
      value: 'By segment',
      confidence: 'medium',
      evidence: 'Segment-based team names detected (e.g., Enterprise, SMB)',
    };
  }
}

/**
 * D6: Playbooks / enablement — check all property names for enablement platform patterns.
 * Found -> "Yes in enablement platform"
 */
function inferD6(preFill, allPropNames) {
  const match = allPropNames.find((name) => ENABLEMENT_PATTERN.test(name));

  if (!match) return;

  preFill.D6 = {
    value: 'Yes in enablement platform',
    confidence: 'medium',
    evidence: `Enablement platform property detected: "${match}"`,
  };
}

/**
 * E2: Content access — check all property names for enablement platform patterns.
 * Found -> "Enablement platform"
 */
function inferE2(preFill, allPropNames) {
  const match = allPropNames.find((name) => ENABLEMENT_PATTERN.test(name));

  if (!match) return;

  preFill.E2 = {
    value: 'Enablement platform',
    confidence: 'medium',
    evidence: `Enablement platform property detected: "${match}"`,
  };
}

/**
 * E3: Call review cadence — check contact properties AND workflows for CI tools.
 * Found -> "Weekly"
 */
function inferE3(preFill, contactProps) {
  const hasConversationIntel = contactProps.some((p) => {
    const name = p.name || '';
    return /^gong_/i.test(name) || /^chorus_/i.test(name) || /^wingman/i.test(name) || /^revenue_io/i.test(name);
  });

  if (!hasConversationIntel) return;

  preFill.E3 = {
    value: 'Weekly',
    confidence: 'medium',
    evidence: 'Conversation intelligence properties detected on contacts',
  };
}

/**
 * PL-5: Review cadence — check meeting titles for QBR/WBR/pipeline review patterns.
 */
function inferPL5(preFill, meetings) {
  if (!meetings || !meetings.meetings) return;

  const meetingList = meetings.meetings;
  const weeklyPattern = /weekly|WBR|1.?on.?1|one.?on.?one|standup|pipeline.*review/i;
  const monthlyPattern = /monthly|MBR|forecast/i;
  const quarterlyPattern = /QBR|quarterly/i;

  const hasWeekly = meetingList.some((m) => weeklyPattern.test(m.properties?.hs_meeting_title || ''));
  const hasMonthly = meetingList.some((m) => monthlyPattern.test(m.properties?.hs_meeting_title || ''));
  const hasQuarterly = meetingList.some((m) => quarterlyPattern.test(m.properties?.hs_meeting_title || ''));

  if (!hasWeekly && !hasMonthly && !hasQuarterly) return;

  const cadences = [];
  if (hasWeekly) cadences.push('weekly');
  if (hasMonthly) cadences.push('monthly');
  if (hasQuarterly) cadences.push('quarterly');

  preFill.PL5_cadence = {
    value: cadences.join(' + '),
    confidence: 'medium',
    evidence: `Meeting cadence detected: ${cadences.join(', ')} review meetings found in last 90 days`,
  };
}

/**
 * RP-6: Forecasting — enhance with goals data.
 * Goals API shows active forecasting, stronger than just the property check.
 */
function inferRP6Goals(preFill, goals, dealProps) {
  if (preFill.D3) return; // Already inferred from deal properties

  if (!goals || !goals.goals || goals.goals.length === 0) return;

  preFill.D3 = {
    value: 'CRM forecast tool',
    confidence: 'medium',
    evidence: `${goals.goals.length} goal target(s) configured in HubSpot Goals`,
  };
}

// ── EXPANDED COVERAGE Inferences ──

/**
 * C12: Events/webinars — check campaign names and workflow names for event patterns.
 * >5 matches -> "Yes, regularly"; 1-5 -> "Occasionally"
 */
function inferC12(preFill, campaigns, workflows) {
  const eventCampaigns = campaigns.filter((c) =>
    EVENT_CAMPAIGN_PATTERN.test(c.name || '')
  );
  const eventWorkflows = workflows.filter((w) =>
    EVENT_CAMPAIGN_PATTERN.test(w.name || '')
  );
  const totalEvents = eventCampaigns.length + eventWorkflows.length;
  if (totalEvents === 0) return;

  preFill.C12 = {
    value: totalEvents > 5 ? 'Yes, regularly' : 'Occasionally',
    confidence: 'medium',
    evidence: `${eventCampaigns.length} event campaign(s) + ${eventWorkflows.length} event workflow(s) detected`,
  };
}

/**
 * C13: Operating/GTM plan — infer from goals API + deal aggregates.
 * Goals + revenue data -> "Yes, data-informed"
 * Goals only -> "Yes, informal"
 */
function inferC13(preFill, goals, dealAggregates) {
  const hasGoals = goals?.goals?.length > 0;
  const hasRevenue = dealAggregates?.total_closed_won_amount > 0;

  if (!hasGoals) return;

  if (hasGoals && hasRevenue) {
    preFill.C13 = {
      value: 'Yes, data-informed',
      confidence: 'medium',
      evidence: `${goals.goals.length} goal target(s) with revenue tracking in CRM`,
    };
  } else {
    preFill.C13 = {
      value: 'Yes, informal',
      confidence: 'medium',
      evidence: `${goals.goals.length} goal target(s) configured in HubSpot Goals`,
    };
  }
}

/**
 * T4: Comp plan — scan deal properties for commission/quota/spiff patterns.
 * Accelerator patterns -> "Yes with accelerators"
 * Commission patterns only -> "Yes basic"
 */
function inferT4(preFill, dealProps) {
  const commissionFields = dealProps.filter((p) => {
    const nameLabel = `${p.name || ''} ${p.label || ''}`;
    return COMMISSION_PATTERN.test(nameLabel);
  });

  if (commissionFields.length === 0) return;

  const hasAccelerators = commissionFields.some((p) => {
    const nameLabel = `${p.name || ''} ${p.label || ''}`;
    return ACCELERATOR_PATTERN.test(nameLabel);
  });

  if (hasAccelerators) {
    preFill.T4 = {
      value: 'Yes with accelerators',
      confidence: 'medium',
      evidence: `Commission fields with accelerators: ${commissionFields.map((p) => p.label || p.name).join(', ')}`,
    };
  } else {
    preFill.T4 = {
      value: 'Yes basic',
      confidence: 'medium',
      evidence: `Commission/comp fields detected: ${commissionFields.map((p) => p.label || p.name).join(', ')}`,
    };
  }
}

/**
 * D4: Growth model — infer from deal aggregates, multiple pipelines, and ARR properties.
 * Revenue + multiple pipelines + ARR property -> "Yes, comprehensive"
 * Revenue + one of the above -> "Partial"
 */
function inferD4(preFill, dealAggregates, dealPipelines, dealProps) {
  const hasRevenue = dealAggregates?.total_closed_won_amount > 0;
  const hasMultiplePipelines = dealPipelines.length > 1;
  const hasARRProp = dealProps.some((p) => {
    const nameLabel = `${p.name || ''} ${p.label || ''}`;
    return ARR_PATTERN.test(nameLabel);
  });

  if (!hasRevenue) return;

  if (hasRevenue && hasMultiplePipelines && hasARRProp) {
    preFill.D4 = {
      value: 'Yes, comprehensive',
      confidence: 'medium',
      evidence: 'Revenue tracking, multiple pipelines (new/expansion), and ARR property detected',
    };
  } else if (hasRevenue && (hasMultiplePipelines || hasARRProp)) {
    preFill.D4 = {
      value: 'Partial',
      confidence: 'medium',
      evidence: `Revenue tracking detected${hasMultiplePipelines ? ' with multiple pipelines' : ''}${hasARRProp ? ' with ARR property' : ''}`,
    };
  }
}

/**
 * E1: Planning data source — what data informs quarterly planning.
 * Goals + revenue -> "CRM data + finance"
 * Goals only -> "CRM data only"
 */
function inferE1(preFill, goals, dealAggregates) {
  const hasGoals = goals?.goals?.length > 0;
  const hasRevenue = dealAggregates?.total_closed_won_amount > 0;

  if (!hasGoals && !hasRevenue) return;

  if (hasGoals && hasRevenue) {
    preFill.E1 = {
      value: 'CRM data + finance',
      confidence: 'medium',
      evidence: 'CRM goals and revenue tracking active',
    };
  } else if (hasGoals) {
    preFill.E1 = {
      value: 'CRM data only',
      confidence: 'medium',
      evidence: `${goals.goals.length} goal target(s) configured`,
    };
  } else if (hasRevenue) {
    preFill.E1 = {
      value: 'CRM data only',
      confidence: 'medium',
      evidence: 'Revenue tracking via deal amounts',
    };
  }
}

/**
 * R4_winloss: Win/loss analysis — check deal properties for competitor and closed-lost reason.
 * Both -> "Structured"
 * One -> "Ad hoc"
 */
function inferR4WinLoss(preFill, dealProps) {
  const hasCompetitor = dealProps.some((p) => {
    const nameLabel = `${p.name || ''} ${p.label || ''}`;
    return COMPETITOR_PATTERN.test(nameLabel);
  });

  const hasClosedLostReason = dealProps.some((p) => {
    const nameLabel = `${p.name || ''} ${p.label || ''}`;
    return CLOSED_LOST_FIELD_PATTERN.test(nameLabel);
  });

  if (!hasCompetitor && !hasClosedLostReason) return;

  if (hasCompetitor && hasClosedLostReason) {
    preFill.R4_winloss = {
      value: 'Structured',
      confidence: 'medium',
      evidence: 'Competitor tracking and closed-lost reason fields detected on deals',
    };
  } else {
    const detail = hasCompetitor ? 'Competitor field' : 'Closed-lost reason field';
    preFill.R4_winloss = {
      value: 'Ad hoc',
      confidence: 'medium',
      evidence: `${detail} detected on deals (partial win/loss tracking)`,
    };
  }
}

/**
 * Power 10 metrics (D5_arr through D5_cycle) — check HubSpot data availability.
 * "Automated" = reportable from standard CRM data
 * "Manual calc" = data exists but needs manual computation
 */
function inferPower10(preFill, dealAggregates, dealPipelines, dealProps, contactProps, workflows) {
  const hasRevenue = dealAggregates?.total_closed_won_amount > 0;
  const hasMultiplePipelines = dealPipelines.length > 1;
  const hasDealSource = dealProps.some((p) => p.name === 'deal_source' || p.name === 'hs_analytics_source');
  const hasMQLProp = contactProps.some((p) => MQL_QUALIFIED_PATTERN.test(`${p.name || ''} ${p.label || ''}`));
  const hasLeadScoring = workflows.some((w) => LEAD_SCORE_WORKFLOW_PATTERN.test(w.name || ''));
  const hasRenewalPipeline = dealPipelines.some((p) => RENEWAL_PATTERN.test(p.label || ''));
  const hasRenewalProp = dealProps.some((p) => RENEWAL_PATTERN.test(`${p.name || ''} ${p.label || ''}`));
  const hasRenewalTracking = hasRenewalPipeline || hasRenewalProp;
  const hasChurnField = dealProps.some((p) => CHURN_PATTERN.test(`${p.name || ''} ${p.label || ''}`));

  const metrics = {
    D5_arr: hasRevenue ? 'Manual calc' : null,
    D5_bookings: hasMultiplePipelines ? 'Automated' : null,
    D5_pipeline: hasDealSource ? 'Automated' : null,
    D5_mql: (hasMQLProp || hasLeadScoring) ? 'Automated' : null,
    D5_gross_churn: (hasChurnField || hasRenewalTracking) ? 'Manual calc' : null,
    D5_grr: hasRenewalTracking ? 'Manual calc' : null,
    D5_nrr: (hasRenewalTracking && hasRevenue) ? 'Manual calc' : null,
    D5_mql_opp: hasMQLProp ? 'Manual calc' : null,
    D5_opp_cw: 'Automated', // Always reportable from deal pipeline
    D5_cycle: 'Automated', // Always reportable from deal dates
  };

  const evidenceMap = {
    D5_arr: 'Closed-won deal amounts tracked',
    D5_bookings: 'Multiple deal pipelines (new vs expansion)',
    D5_pipeline: 'Deal source property detected',
    D5_mql: hasMQLProp ? 'MQL property on contacts' : 'Lead scoring workflow detected',
    D5_gross_churn: hasChurnField ? 'Churn field on deals' : 'Renewal tracking detected',
    D5_grr: 'Renewal tracking fields detected',
    D5_nrr: 'Renewal tracking + revenue data available',
    D5_mql_opp: 'MQL property on contacts',
    D5_opp_cw: 'Standard deal pipeline fields (always reportable)',
    D5_cycle: 'Reportable from deal create date to close date',
  };

  for (const [key, value] of Object.entries(metrics)) {
    if (value && !preFill[key]) {
      preFill[key] = {
        value,
        confidence: 'medium',
        evidence: evidenceMap[key] || 'HubSpot CRM data signal',
      };
    }
  }
}

// ── Utility Helpers ──

function getPropertyResults(properties, objectType) {
  if (!properties || !properties[objectType]) return [];
  const obj = properties[objectType];
  return Array.isArray(obj.results) ? obj.results : Array.isArray(obj) ? obj : [];
}

function collectAllPropertyNames(properties) {
  if (!properties) return [];
  const names = [];
  for (const type of Object.keys(properties)) {
    const props = getPropertyResults(properties, type);
    for (const p of props) {
      if (p.name) names.push(p.name);
      if (p.label) names.push(p.label);
    }
  }
  return names;
}

function getWorkflowResults(workflows) {
  if (!workflows) return [];
  if (Array.isArray(workflows.results)) return workflows.results;
  if (Array.isArray(workflows)) return workflows;
  return [];
}

function getOwnerResults(owners) {
  if (!owners) return [];
  if (Array.isArray(owners.results)) return owners.results;
  if (Array.isArray(owners)) return owners;
  return [];
}

function getPipelineResults(pipelines, type) {
  if (!pipelines || !pipelines[type]) return [];
  return Array.isArray(pipelines[type]) ? pipelines[type] : [];
}

function getFormResults(forms) {
  if (!forms) return [];
  if (Array.isArray(forms.results)) return forms.results;
  if (Array.isArray(forms)) return forms;
  return [];
}

function getMarketingEmailResults(emails) {
  if (!emails) return [];
  if (Array.isArray(emails.results)) return emails.results;
  if (Array.isArray(emails)) return emails;
  return [];
}

function getCampaignResults(campaigns) {
  if (!campaigns) return [];
  if (Array.isArray(campaigns.results)) return campaigns.results;
  if (Array.isArray(campaigns)) return campaigns;
  return [];
}
