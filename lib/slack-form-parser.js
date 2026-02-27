/**
 * Slack Form Parser
 *
 * Parses the raw text output from the Slack pre-diagnostic questionnaire
 * and maps it to intake form answer keys.
 */

/**
 * Tool name → B1_tools category key mapping.
 * Keys are lowercased for matching; values are the intake form category keys.
 */
const TOOL_LOOKUP = {
  // Sales engagement
  salesloft: 'sales_engagement',
  outreach: 'sales_engagement',
  apollo: 'sales_engagement',
  hubspot: 'sales_engagement',
  // Conversation intelligence
  gong: 'conversation_intel',
  chorus: 'conversation_intel',
  'gong engage': 'conversation_intel',
  'gong/gong engage': 'conversation_intel',
  // Data enrichment
  zoominfo: 'data_enrichment',
  clearbit: 'data_enrichment',
  clay: 'data_enrichment',
  '6sense': 'data_enrichment',
  advizorpro: 'data_enrichment',
  lusha: 'data_enrichment',
  cognism: 'data_enrichment',
  // Customer success
  gainsight: 'csp',
  churnzero: 'csp',
  vitally: 'csp',
  totango: 'csp',
  planhat: 'csp',
  // Lead routing
  leandata: 'lead_routing',
  chilipiper: 'lead_routing',
  'chili piper': 'lead_routing',
  // E-signature / CLM
  docusign: 'esign',
  pandadoc: 'esign',
  ironclad: 'esign',
  // BI/Analytics
  tableau: 'bi_analytics',
  looker: 'bi_analytics',
  'power bi': 'bi_analytics',
  powerbi: 'bi_analytics',
  domo: 'bi_analytics',
  // Support
  zendesk: 'support',
  intercom: 'support',
  freshdesk: 'support',
  // Enablement
  highspot: 'enablement_platform',
  seismic: 'enablement_platform',
  showpad: 'enablement_platform',
  guru: 'enablement_platform',
  // Forecasting / Quota/Commission
  clari: 'forecasting_tool',
  aviso: 'forecasting_tool',
  boostup: 'forecasting_tool',
  spiff: 'forecasting_tool',
  captivateiq: 'forecasting_tool',
  xactly: 'forecasting_tool',
  // ABM
  demandbase: 'abm_tool',
  terminus: 'abm_tool',
  // PRM
  partnerstack: 'prm_tool',
  crossbeam: 'prm_tool',
  reveal: 'prm_tool',
  // Marketing automation (maps to a note, not a B1 category)
  marketo: '_map',
  pardot: '_map',
  'hubspot marketing': '_map',
  'marketing cloud': '_map',
  eloqua: '_map',
};

/**
 * Slack field label → intake form field mapping.
 * Each entry defines how to parse and map the value.
 */
const FIELD_MAP = [
  { pattern: /^email$/i, handler: (v) => ({ _email: v }) },
  { pattern: /^crm$/i, handler: parseCRM },
  { pattern: /^marketing automation/i, handler: (v) => parseToolField(v, '_map_info') },
  { pattern: /^customer success platform/i, handler: (v) => parseToolCategory(v, 'csp') },
  { pattern: /^customer support platform/i, handler: (v) => parseToolCategory(v, 'support') },
  { pattern: /^partner relationship/i, handler: (v) => parseToolCategory(v, 'prm_tool') },
  { pattern: /^data enrichment/i, handler: (v) => parseToolCategory(v, 'data_enrichment') },
  { pattern: /^sales engagement/i, handler: (v) => parseToolCategory(v, 'sales_engagement') },
  { pattern: /^revenue intelligence/i, handler: (v) => parseToolCategory(v, 'conversation_intel') },
  { pattern: /^lead routing/i, handler: (v) => parseToolCategory(v, 'lead_routing') },
  { pattern: /^cpq/i, handler: (v) => parseToolCategory(v, 'cpq') },
  { pattern: /^data analytics/i, handler: (v) => parseToolCategory(v, 'bi_analytics') },
  { pattern: /^gtm.*enablement/i, handler: (v) => parseToolCategory(v, 'enablement_platform') },
  { pattern: /^quota.*commission/i, handler: (v) => parseToolCategory(v, 'forecasting_tool') },
  { pattern: /^contract lifecycle/i, handler: (v) => parseToolCategory(v, 'esign') },
  { pattern: /^de-?duplication/i, handler: (v) => parseToolCategory(v, 'dedup') },
  { pattern: /^beginning of year arr|^current arr/i, handler: parseARR },
  { pattern: /^annual bookings goal/i, handler: (v) => parseMetricValue(v, 'D5_bookings') },
  { pattern: /^annual created sql goal/i, handler: (v) => parseMetricValue(v, 'D5_pipeline') },
  { pattern: /^annual created mql goal/i, handler: (v) => parseMetricValue(v, 'D5_mql') },
  { pattern: /^annual sql to closed won conversion/i, handler: (v) => parseMetricValue(v, 'D5_opp_cw') },
  { pattern: /^mql to sql conversion/i, handler: (v) => parseMetricValue(v, 'D5_mql_opp') },
  { pattern: /^annual sql to closed won time/i, handler: (v) => parseMetricValue(v, 'D5_cycle') },
  { pattern: /^annual gross churn/i, handler: (v) => parseMetricValue(v, 'D5_gross_churn') },
  { pattern: /^annual gross retention/i, handler: (v) => parseMetricValue(v, 'D5_grr') },
  { pattern: /^annual net retention/i, handler: (v) => parseMetricValue(v, 'D5_nrr') },
  { pattern: /^biggest pain/i, handler: (v) => ({ _pains: v }) },
  { pattern: /^biggest opportunit/i, handler: (v) => ({ _opportunities: v }) },
  { pattern: /^are there any specific tools/i, handler: (v) => ({ _toolNotes: v }) },
];

/**
 * Parse raw Slack form text into intake form answers and context notes.
 *
 * @param {string} rawText - Raw text pasted from Slack
 * @returns {{ answers: object, preFill: object, contextNotes: object, summary: { mapped: number, skipped: number, total: number } }}
 */
export function parseSlackForm(rawText) {
  const lines = rawText.split('\n').filter((l) => l.trim());
  const parsed = {};
  const tools = new Set();
  const toolNames = {};
  const contextNotes = {};
  const metricValues = {};
  let totalFields = 0;
  let mappedFields = 0;

  // Parse key:value pairs
  // Handle both "Key:Value" on one line and "Key\nValue" on two lines
  const entries = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && colonIdx < line.length - 1) {
      // Key:Value on same line
      entries.push([line.slice(0, colonIdx).trim(), line.slice(colonIdx + 1).trim()]);
    } else if (colonIdx === line.length - 1) {
      // Key: with value on next line
      const key = line.slice(0, colonIdx).trim();
      const value = (lines[i + 1] || '').trim();
      if (value && !value.includes(':')) {
        entries.push([key, value]);
        i++; // skip next line
      }
    } else if (i + 1 < lines.length) {
      // Could be Key\nValue pattern — check if next line looks like a value
      const next = lines[i + 1]?.trim();
      if (next && !FIELD_MAP.some((f) => f.pattern.test(line)) && !next.includes(':')) {
        // Not a recognized field label, skip
      }
    }
  }

  // Process each entry through field map
  for (const [key, value] of entries) {
    if (!value) continue;
    totalFields++;

    let matched = false;
    for (const field of FIELD_MAP) {
      if (field.pattern.test(key)) {
        const result = field.handler(value);
        if (result) {
          // Separate context notes from answers
          for (const [k, v] of Object.entries(result)) {
            if (k.startsWith('_')) {
              if (k === '_tools') {
                for (const t of v) {
                  tools.add(t.category);
                  toolNames[t.category] = t.name;
                }
              } else if (k === '_pains') {
                contextNotes.pains = v;
              } else if (k === '_opportunities') {
                contextNotes.opportunities = v;
              } else if (k === '_email') {
                contextNotes.email = v;
              } else if (k === '_toolNotes') {
                contextNotes.toolNotes = v;
              } else if (k === '_map_info') {
                contextNotes.mapPlatform = v;
              } else if (k === '_metric') {
                metricValues[v.key] = v.raw;
              }
            } else {
              parsed[k] = v;
            }
          }
          matched = true;
          mappedFields++;
        }
        break;
      }
    }

    if (!matched) {
      // Try to match as a tool name directly
      const toolResult = tryToolMatch(value);
      if (toolResult.length > 0) {
        for (const t of toolResult) {
          tools.add(t.category);
          toolNames[t.category] = t.name;
        }
        matched = true;
        mappedFields++;
      }
    }
  }

  // Build answers object
  const answers = { ...parsed };

  // Build B1_tools from collected tool categories
  if (tools.size > 0) {
    answers.B1_tools = [...tools].filter((t) => t !== '_map' && t !== 'dedup' && t !== 'cpq');
  }

  // Build preFill object (same shape as Salesforce inference)
  const preFill = {};
  for (const [key, value] of Object.entries(answers)) {
    if (key === 'B1_tools') {
      preFill.B1_tools = {
        value: answers.B1_tools,
        confidence: 'medium',
        evidence: 'From pre-diagnostic intake form',
        source: 'slack-form',
      };
    } else {
      preFill[key] = {
        value,
        confidence: 'medium',
        evidence: 'From pre-diagnostic intake form',
        source: 'slack-form',
      };
    }
  }

  // Add metric context (raw values as evidence)
  for (const [key, raw] of Object.entries(metricValues)) {
    if (!preFill[key]) {
      preFill[key] = {
        value: null,
        confidence: 'low',
        evidence: `Reported: ${raw}`,
        source: 'slack-form',
      };
    }
  }

  return {
    answers,
    preFill,
    contextNotes,
    summary: {
      mapped: mappedFields,
      skipped: totalFields - mappedFields,
      total: totalFields,
      toolsFound: tools.size,
      metricsFound: Object.keys(metricValues).length,
    },
  };
}

// --- Helper functions ---

function parseCRM(value) {
  const v = value.trim().toLowerCase();
  if (v.includes('salesforce')) return { A1: 'Salesforce' };
  if (v.includes('hubspot')) return { A1: 'HubSpot' };
  return { A1: 'Other' };
}

function parseARR(value) {
  const num = parseFloat(value.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return null;
  // Value is in millions (e.g., "$75M+")
  if (num >= 50) return { A3: '$50M+' };
  if (num >= 20) return { A3: '$20-50M' };
  if (num >= 5) return { A3: '$5-20M' };
  if (num >= 1) return { A3: '$1-5M' };
  return { A3: '<$1M' };
}

function parseToolCategory(value, category) {
  const v = value.trim().toLowerCase();
  if (v === "don't have" || v === 'none' || v === 'n/a' || v === 'crm-only' || v === 'crm') {
    return null;
  }
  // Split on commas and try to match each tool
  const toolResults = tryToolMatch(value);
  if (toolResults.length > 0) {
    return { _tools: toolResults };
  }
  // If no specific tool matched, just add the category
  return { _tools: [{ category, name: value.trim() }] };
}

function parseToolField(value, contextKey) {
  const v = value.trim().toLowerCase();
  if (v === "don't have" || v === 'none' || v === 'n/a') return null;
  return { [contextKey]: value.trim() };
}

function parseMetricValue(value, key) {
  const v = value.trim().toLowerCase();
  if (v === 'none' || v === 'n/a' || v === "don't know" || v === 'more') return { _metric: { key, raw: value.trim() } };
  return { _metric: { key, raw: value.trim() } };
}

function tryToolMatch(value) {
  const results = [];
  // Split on commas, slashes, and "and"
  const parts = value.split(/[,\/]|\band\b/i).map((p) => p.trim()).filter(Boolean);
  for (const part of parts) {
    const lower = part.toLowerCase();
    // Try exact match first
    if (TOOL_LOOKUP[lower]) {
      results.push({ category: TOOL_LOOKUP[lower], name: part });
      continue;
    }
    // Try partial match
    for (const [toolName, category] of Object.entries(TOOL_LOOKUP)) {
      if (lower.includes(toolName) || toolName.includes(lower)) {
        results.push({ category, name: part });
        break;
      }
    }
  }
  return results;
}
