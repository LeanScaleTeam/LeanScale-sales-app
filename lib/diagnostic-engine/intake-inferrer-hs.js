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
 *   D6  — playbooks / enablement
 *   E2  — content access
 *   E3  — call review cadence
 */

// ── Sales Team Patterns ──

const SALES_TEAM_PATTERNS = [/sales/i, /\bae\b/i, /\bsdr\b/i, /\bbdr\b/i, /account\s*executive/i, /business\s*dev/i];

// ── Tool Detection Patterns ──

const TOOL_PATTERNS = [
  { key: 'sales_engagement', fieldPatterns: [/^outreach_/i, /^salesloft_/i, /^apollo_/i] },
  { key: 'conversation_intel', fieldPatterns: [/^gong_/i, /^chorus_/i] },
  { key: 'data_enrichment', fieldPatterns: [/^zoominfo/i, /^zi_/i, /^clearbit/i, /^clay_/i] },
  { key: 'csp', fieldPatterns: [/^gainsight/i, /^churnzero/i] },
  { key: 'lead_routing', fieldPatterns: [/^leandata/i, /^chilipiper/i] },
  { key: 'esign', fieldPatterns: [/^docusign/i, /^pandadoc/i] },
  { key: 'bi_analytics', fieldPatterns: [] },
  { key: 'support', fieldPatterns: [/^zendesk/i, /^intercom/i] },
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
const ENABLEMENT_PATTERN = /highspot|seismic|showpad/i;
const GEOGRAPHIC_TEAM_PATTERN = /emea|apac|americas|latam|amer|na\b|eu\b/i;
const SEGMENT_TEAM_PATTERN = /enterprise|mid.?market|smb|commercial|strategic/i;
const FUNCTION_TEAM_PATTERN = /\bsdr\b|\bae\b|\bam\b|\bcse?\b|account\s*manage/i;

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

  // ── HIGH CONFIDENCE ──

  inferA2(preFill, owners);
  inferC6(preFill, dealProps);
  inferC10(preFill, workflows);

  // ── MEDIUM CONFIDENCE ──

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
  inferD6(preFill, allPropNames);
  inferE2(preFill, allPropNames);
  inferE3(preFill, contactProps);

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
 * E3: Call review cadence — check contact properties for Gong/Chorus fields.
 * Found -> "Weekly"
 */
function inferE3(preFill, contactProps) {
  const hasConversationIntel = contactProps.some((p) => {
    const name = p.name || '';
    return /^gong_/i.test(name) || /^chorus_/i.test(name);
  });

  if (!hasConversationIntel) return;

  preFill.E3 = {
    value: 'Weekly',
    confidence: 'medium',
    evidence: 'Conversation intelligence properties detected on contacts (Gong/Chorus)',
  };
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
