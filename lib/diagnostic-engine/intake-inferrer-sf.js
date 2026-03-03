/**
 * Salesforce Intake Inferrer
 *
 * Reads Salesforce metadata (same shape stored in `salesforce_metadata` table)
 * and produces a pre-fill map for intake form questions. Each entry has:
 *   { value: string|string[], confidence: 'high'|'medium', evidence: string }
 *
 * HIGH-confidence inferences (auto-select):
 *   A2  — rep count bucket
 *   C5  — required fields on opportunity stages
 *   C6  — closed-lost reason tracking
 *   C10 — deduplication process
 *   D1  — dashboard count bucket
 *
 * MEDIUM-confidence inferences (auto-select with evidence):
 *   B1_tools — detected GTM tools
 *   C1  — lead capture method
 *   C3  — MQL definition
 *   C4  — qualification methodology
 *   C8  — renewal tracking
 *   C11 — email nurture campaigns
 */

// ── Sales Profile Patterns ──
// Profiles that indicate a user is a sales rep

const SALES_PROFILE_PATTERNS = [
  /\bsales\b/i,
  /\bbusiness\s*development\b/i,
  /\baccount\s*executive\b/i,
  /\bsdr\b/i,
  /\bbdr\b/i,
  /\bae\b/i,
  /\baccount\s*manager\b/i,
  /\bstandard\s*user\b/i,
];

// ── Tool Detection Patterns ──
// Maps ConnectedApp names and field prefixes to intake tool category keys

const TOOL_PATTERNS = [
  {
    key: 'sales_engagement',
    appPatterns: [/outreach/i, /salesloft/i, /apollo/i],
    fieldPatterns: [/^outreach_/i, /^salesloft_/i, /^apollo_/i],
  },
  {
    key: 'conversation_intel',
    appPatterns: [/gong/i, /chorus/i],
    fieldPatterns: [/^gong_/i, /^chorus_/i],
  },
  {
    key: 'data_enrichment',
    appPatterns: [/zoominfo/i, /clearbit/i, /clay\b/i],
    fieldPatterns: [/^zoominfo/i, /^zi_/i, /^clearbit/i, /^clay_/i],
  },
  {
    key: 'csp',
    appPatterns: [/gainsight/i, /churnzero/i, /vitally/i],
    fieldPatterns: [/^gainsight/i, /^churnzero/i],
  },
  {
    key: 'lead_routing',
    appPatterns: [/leandata/i, /chili\s*piper/i],
    fieldPatterns: [/^leandata/i, /^chilipiper/i],
  },
  {
    key: 'esign',
    appPatterns: [/docusign/i, /pandadoc/i],
    fieldPatterns: [/^dsfs__/i, /^pandadoc/i],
  },
  {
    key: 'bi_analytics',
    appPatterns: [/tableau/i, /looker/i, /power\s*bi/i],
    fieldPatterns: [],
  },
  {
    key: 'support',
    appPatterns: [/zendesk/i, /intercom/i, /freshdesk/i],
    fieldPatterns: [/^zendesk/i, /^intercom/i],
  },
];

// ── Closed-Lost Reason Field Pattern ──

const CLOSED_LOST_FIELD_PATTERN = /closed.*lost.*reason|loss.*reason|close.*reason/i;

// ── Dedup/Merge Flow Pattern ──

const DEDUP_FLOW_PATTERN = /dedup|duplicate|merge/i;

// ── Lead Capture Patterns ──

const LEAD_CREATION_FLOW_PATTERN = /web.?to.?lead|lead.*creat|create.*lead|inbound.*lead/i;
const WEB_TO_LEAD_FIELD_PATTERN = /web.?to.?lead|web2lead/i;

// ── MQL / Lead Scoring Patterns ──

const LEAD_SCORE_PATTERN = /score/i;
const MQL_QUALIFIED_PATTERN = /mql|qualified|qualification/i;

// ── Qualification Methodology Patterns ──

const METHODOLOGY_PATTERNS = [
  { value: 'MEDDIC/MEDDPICC', pattern: /meddic|meddpicc/i },
  { value: 'BANT', pattern: /bant/i },
  { value: 'SPICED', pattern: /spiced/i },
];

// ── Renewal Record Type Pattern ──

const RENEWAL_PATTERN = /renewal/i;

// ── MAP / Nurture Patterns ──

const MAP_APP_PATTERN = /pardot|marketing\s*cloud|marketo|hubspot.*marketing/i;

// ── Main Export ──

/**
 * Infer intake form answers from Salesforce metadata.
 *
 * @param {object|null} metadata - Raw Salesforce metadata (same shape as salesforce_metadata table)
 * @returns {object} Pre-fill map keyed by question ID. Each entry:
 *   { value: string|string[], confidence: 'high'|'medium', evidence: string }
 */
export function inferIntakeAnswers(metadata) {
  const preFill = {};

  if (!metadata) return preFill;

  // Normalize arrays and objects
  const objects = metadata.objects || {};
  const users = Array.isArray(metadata.users) ? metadata.users : [];
  const flows = Array.isArray(metadata.flows) ? metadata.flows : [];
  const validationRules = Array.isArray(metadata.validationRules) ? metadata.validationRules : [];
  const dashboards = Array.isArray(metadata.dashboards) ? metadata.dashboards : [];
  const connectedApps = Array.isArray(metadata.connectedApps) ? metadata.connectedApps : [];
  const recordTypes = Array.isArray(metadata.recordTypes) ? metadata.recordTypes : [];

  // Get object field arrays
  const oppFields = getFields(objects.Opportunity);
  const leadFields = getFields(objects.Lead);

  // Collect all field names across all objects (for tool detection)
  const allFieldNames = collectAllFieldNames(objects);

  // ── HIGH CONFIDENCE ──

  inferA2(preFill, users);
  inferC5(preFill, validationRules);
  inferC6(preFill, oppFields);
  inferC10(preFill, flows);
  inferD1(preFill, dashboards);

  // ── MEDIUM CONFIDENCE ──

  inferB1Tools(preFill, connectedApps, allFieldNames);
  inferC1(preFill, flows, leadFields);
  inferC3(preFill, leadFields);
  inferC4(preFill, oppFields);
  inferC8(preFill, recordTypes);
  inferC11(preFill, connectedApps);

  return preFill;
}

// ── HIGH CONFIDENCE Inferences ──

/**
 * A2: Rep count — count active users with sales-related profiles.
 * Map to buckets: 1-5, 6-15, 16-50, 50+
 */
function inferA2(preFill, users) {
  const salesUsers = users.filter((u) => {
    const profileName = u.Profile?.Name || '';
    return SALES_PROFILE_PATTERNS.some((p) => p.test(profileName));
  });

  const count = salesUsers.length;
  if (count === 0) return;

  let bucket;
  if (count <= 5) bucket = '1-5';
  else if (count <= 15) bucket = '6-15';
  else if (count <= 50) bucket = '16-50';
  else bucket = '50+';

  preFill.A2 = {
    value: bucket,
    confidence: 'high',
    evidence: `${count} active users with sales-related profiles detected`,
  };
}

/**
 * C5: Required fields — count ValidationRules on Opportunity.
 * >=4 -> "Yes, all stages", 1-3 -> "Some stages", 0 -> "No required fields"
 */
function inferC5(preFill, validationRules) {
  const oppRuleCount = validationRules.filter((r) => {
    // Handle both flat and nested EntityDefinition formats
    const entityName =
      r['EntityDefinition.QualifiedApiName'] ||
      r.EntityDefinition?.QualifiedApiName ||
      '';
    return entityName === 'Opportunity';
  }).length;

  let value;
  if (oppRuleCount >= 4) value = 'Yes, all stages';
  else if (oppRuleCount >= 1) value = 'Some stages';
  else value = 'No required fields';

  preFill.C5 = {
    value,
    confidence: 'high',
    evidence: `${oppRuleCount} validation rule${oppRuleCount !== 1 ? 's' : ''} on Opportunity`,
  };
}

/**
 * C6: Closed-lost reason — find field on Opportunity matching closed-lost patterns.
 * Found + not nillable -> "Required field"
 * Found + nillable -> "Optional field"
 * Not found -> "Not tracked"
 */
function inferC6(preFill, oppFields) {
  const matchingField = oppFields.find((f) => {
    const nameLabel = `${f.name || ''} ${f.label || ''}`;
    return CLOSED_LOST_FIELD_PATTERN.test(nameLabel);
  });

  let value;
  if (matchingField && !matchingField.nillable) {
    value = 'Required field';
  } else if (matchingField) {
    value = 'Optional field';
  } else {
    value = 'Not tracked';
  }

  const evidence = matchingField
    ? `Field "${matchingField.label || matchingField.name}" found on Opportunity (${matchingField.nillable ? 'optional' : 'required'})`
    : 'No closed-lost reason field found on Opportunity';

  preFill.C6 = {
    value,
    confidence: 'high',
    evidence,
  };
}

/**
 * C10: Deduplication — check flows for dedup/duplicate/merge patterns.
 * Only infer when found; absence does not mean "No process".
 */
function inferC10(preFill, flows) {
  const dedupFlows = flows.filter((f) => {
    const label = f.MasterLabel || f.Label || f.Name || '';
    return DEDUP_FLOW_PATTERN.test(label);
  });

  if (dedupFlows.length === 0) return;

  preFill.C10 = {
    value: 'Automated tool',
    confidence: 'high',
    evidence: `Deduplication flow${dedupFlows.length > 1 ? 's' : ''} detected: ${dedupFlows.map((f) => f.MasterLabel || f.Label || f.Name).join(', ')}`,
  };
}

/**
 * D1: Dashboards — count dashboards.
 * >=10 -> "10+", 5-9 -> "5-10", 1-4 -> "1-4", 0 -> "None"
 */
function inferD1(preFill, dashboards) {
  const count = dashboards.length;

  let value;
  if (count >= 10) value = '10+';
  else if (count >= 5) value = '5-10';
  else if (count >= 1) value = '1-4';
  else value = 'None';

  preFill.D1 = {
    value,
    confidence: 'high',
    evidence: `${count} dashboard${count !== 1 ? 's' : ''} found in Salesforce`,
  };
}

// ── MEDIUM CONFIDENCE Inferences ──

/**
 * B1_tools: Match ConnectedApp names + field prefixes against tool patterns.
 * Returns array of matched tool category keys.
 */
function inferB1Tools(preFill, connectedApps, allFieldNames) {
  const matchedTools = [];
  const evidenceParts = [];

  for (const toolDef of TOOL_PATTERNS) {
    // Check ConnectedApp names
    const appMatch = connectedApps.find((app) =>
      toolDef.appPatterns.some((p) => p.test(app.Name || ''))
    );

    // Check field name prefixes across all objects
    const fieldMatch = allFieldNames.find((name) =>
      toolDef.fieldPatterns.some((p) => p.test(name))
    );

    if (appMatch || fieldMatch) {
      matchedTools.push(toolDef.key);
      const source = appMatch
        ? `ConnectedApp "${appMatch.Name}"`
        : `field prefix match`;
      evidenceParts.push(`${toolDef.key} (${source})`);
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
 * C1: Lead capture — check for lead-creation Flows or Web-to-Lead fields.
 * If found -> "CRM forms (HubSpot/SF)"
 */
function inferC1(preFill, flows, leadFields) {
  const hasLeadCreationFlow = flows.some((f) => {
    const label = f.MasterLabel || f.Label || f.Name || '';
    return LEAD_CREATION_FLOW_PATTERN.test(label);
  });

  const hasWebToLeadField = leadFields.some((f) => {
    const nameLabel = `${f.name || ''} ${f.label || ''}`;
    return WEB_TO_LEAD_FIELD_PATTERN.test(nameLabel);
  });

  if (!hasLeadCreationFlow && !hasWebToLeadField) return;

  const evidence = hasLeadCreationFlow
    ? 'Lead creation flow detected'
    : 'Web-to-Lead fields detected on Lead object';

  preFill.C1 = {
    value: 'CRM forms (HubSpot/SF)',
    confidence: 'medium',
    evidence,
  };
}

/**
 * C3: MQL definition — check Lead fields for score/mql/qualified patterns.
 * Score fields -> "Yes, with lead scoring"
 * MQL/qualified fields (no score) -> "Yes, criteria-based"
 */
function inferC3(preFill, leadFields) {
  const hasScoreField = leadFields.some((f) => {
    const nameLabel = `${f.name || ''} ${f.label || ''}`;
    return LEAD_SCORE_PATTERN.test(nameLabel);
  });

  const hasMqlField = leadFields.some((f) => {
    const nameLabel = `${f.name || ''} ${f.label || ''}`;
    return MQL_QUALIFIED_PATTERN.test(nameLabel);
  });

  if (!hasScoreField && !hasMqlField) return;

  if (hasScoreField) {
    preFill.C3 = {
      value: 'Yes, with lead scoring',
      confidence: 'medium',
      evidence: 'Lead score field detected on Lead object',
    };
  } else {
    preFill.C3 = {
      value: 'Yes, criteria-based',
      confidence: 'medium',
      evidence: 'MQL/qualification field detected on Lead object',
    };
  }
}

/**
 * C4: Qualification methodology — check Opportunity fields for MEDDIC/BANT/SPICED patterns.
 * Returns the first matching methodology.
 */
function inferC4(preFill, oppFields) {
  for (const { value, pattern } of METHODOLOGY_PATTERNS) {
    const match = oppFields.find((f) => {
      const nameLabel = `${f.name || ''} ${f.label || ''}`;
      return pattern.test(nameLabel);
    });

    if (match) {
      preFill.C4 = {
        value,
        confidence: 'medium',
        evidence: `Field "${match.label || match.name}" on Opportunity matches ${value} methodology`,
      };
      return;
    }
  }
}

/**
 * C8: Renewals — check RecordTypes for renewal pattern.
 * Found -> "Automated in CRM/CSP"
 */
function inferC8(preFill, recordTypes) {
  const renewalRT = recordTypes.find((rt) => {
    const name = `${rt.Name || ''} ${rt.DeveloperName || ''}`;
    return RENEWAL_PATTERN.test(name);
  });

  if (!renewalRT) return;

  preFill.C8 = {
    value: 'Automated in CRM/CSP',
    confidence: 'medium',
    evidence: `Renewal record type "${renewalRT.Name}" found on ${renewalRT.SobjectType || 'unknown object'}`,
  };
}

/**
 * C11: Nurture campaigns — check ConnectedApps for Pardot/Marketing Cloud.
 * Found -> "Yes, in CRM/MAP"
 */
function inferC11(preFill, connectedApps) {
  const mapApp = connectedApps.find((app) =>
    MAP_APP_PATTERN.test(app.Name || '')
  );

  if (!mapApp) return;

  preFill.C11 = {
    value: 'Yes, in CRM/MAP',
    confidence: 'medium',
    evidence: `Marketing automation platform detected: ${mapApp.Name}`,
  };
}

// ── Utility Helpers ──

/**
 * Get fields array from an object describe, safely.
 * @param {object} objectDescribe - Salesforce object describe
 * @returns {Array} Fields array
 */
function getFields(objectDescribe) {
  if (!objectDescribe || !Array.isArray(objectDescribe.fields)) return [];
  return objectDescribe.fields;
}

/**
 * Collect all field names across all objects for tool detection.
 * @param {object} objects - Dict keyed by object name
 * @returns {string[]} All field names
 */
function collectAllFieldNames(objects) {
  if (!objects) return [];
  const names = [];
  for (const key of Object.keys(objects)) {
    const fields = getFields(objects[key]);
    for (const f of fields) {
      if (f.name) names.push(f.name);
      if (f.label) names.push(f.label);
    }
  }
  return names;
}
