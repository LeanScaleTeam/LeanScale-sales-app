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
  const parsed = {};
  const tools = new Set();
  const toolNames = {};
  const contextNotes = {};
  const metricValues = {};
  let totalFields = 0;
  let mappedFields = 0;

  // Extract key:value entries from the raw text.
  // Supports two formats:
  //   1. Newline-separated: "Key:Value\nKey:Value\n..."
  //   2. Concatenated (Slack copy-paste strips newlines): "EmailfooKey:ValueKey:Value..."
  const entries = extractEntries(rawText);

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

/**
 * Known field labels from the Slack form, ordered longest-first so longer
 * labels match before shorter ones (e.g., "Annual Gross Churn" before "Annual").
 * These are used as split points when the text has no newlines.
 */
const KNOWN_LABELS = [
  'New submission for',
  'View submission',
  'Email',
  'CRM',
  'Marketing Automation Platform (MAP)',
  'Marketing Automation Platform',
  'Customer Success Platform',
  'Customer Support Platform',
  'Partner Relationship Management (PRM)',
  'Partner Relationship Management',
  'Data Enrichment',
  'Sales Engagement Platform',
  'Revenue Intelligence',
  'Lead Routing',
  'CPQ (Configure, Price, Quote)',
  'CPQ',
  'Data Analytics',
  'GTM/Sales Enablement',
  'Quota/Commission Management',
  'Contract Lifecycle Management (CLM)',
  'Contract Lifecycle Management',
  'De-duplication Platform',
  'De-Duplication Platform',
  'Are there any specific tools you are interested in adding to your Tech Stack?',
  'Are there any specific tools',
  'Beginning of Year ARR ($)',
  'Beginning of Year ARR',
  'Current ARR ($)',
  'Current ARR',
  'End of Year ARR Goal ($)',
  'End of Year ARR Goal',
  'Next Year ARR Goal ($)',
  'Next Year ARR Goal',
  'Annual Bookings Goal ($)',
  'Annual Bookings Goal',
  'Annual Created SQL Goal ($)',
  'Annual Created SQL Goal',
  'Annual Created MQL Goal (#)',
  'Annual Created MQL Goal',
  'Annual SQL to Closed Won Conversion expectation (%)',
  'Annual SQL to Closed Won Conversion',
  'MQL to SQL Conversion expectation (%)',
  'MQL to SQL Conversion',
  'Annual SQL to Closed Won Time to Close expectation (days)',
  'Annual SQL to Closed Won Time to Close',
  'Annual Gross Churn goal ($)',
  'Annual Gross Churn',
  'Annual Gross retention rate (%)',
  'Annual Gross retention rate',
  'Annual Net retention rate (%)',
  'Annual Net retention rate',
  'Biggest pains',
  'Biggest opportunities',
].sort((a, b) => b.length - a.length); // longest first

/**
 * Extract key:value entries from raw text. Handles:
 * 1. Newline-separated format (clean paste)
 * 2. Concatenated format (Slack strips newlines)
 */
function extractEntries(rawText) {
  // First, try newline-separated parsing
  const lines = rawText.split('\n').filter((l) => l.trim());
  if (lines.length >= 5) {
    // Looks like it has real newlines — use line-based parsing
    return extractFromLines(lines);
  }

  // Concatenated format — use known labels as split points
  return extractFromConcatenated(rawText);
}

function extractFromLines(lines) {
  const entries = [];
  // Build a set of known label patterns (lowercase, without parentheticals) for matching
  const knownLabelLower = KNOWN_LABELS.map((l) => l.toLowerCase().replace(/\s*\([^)]*\)\s*/g, '').replace(/\?$/, '').trim());

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Skip header lines
    if (/^new submission for/i.test(line) || /^\(view submission\)/i.test(line)) continue;

    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && colonIdx < line.length - 1) {
      // Key:Value on same line
      entries.push([line.slice(0, colonIdx).trim(), line.slice(colonIdx + 1).trim()]);
    } else if (colonIdx === line.length - 1) {
      // Key: with value on next line
      const key = line.slice(0, colonIdx).trim();
      const value = (lines[i + 1] || '').trim();
      if (value) {
        entries.push([key, value]);
        i++;
      }
    } else {
      // No colon — check if this line is a known label (with value on next line)
      // Strip parentheticals for matching: "Beginning of Year ARR ($)" → "Beginning of Year ARR"
      const cleaned = line.replace(/\s*\([^)]*\)\s*/g, '').replace(/\?$/, '').trim().toLowerCase();
      const isKnownLabel = knownLabelLower.some((label) => cleaned === label || cleaned.startsWith(label));
      if (isKnownLabel && i + 1 < lines.length) {
        const value = lines[i + 1].trim();
        if (value) {
          // Use the original line (with parentheticals) as the key for FIELD_MAP matching
          entries.push([line.replace(/\?$/, '').trim(), value]);
          i++;
        }
      }
    }
  }
  return entries;
}

function extractFromConcatenated(text) {
  const entries = [];
  // Strip common header text
  let cleaned = text
    .replace(/New submission for\s*"[^"]*"\s*/gi, '')
    .replace(/\(View submission\)/gi, '')
    .trim();

  // Strategy: For each known label, search for it in the text.
  // Short labels (<=5 chars like "CRM", "CPQ", "Email") must be followed by ":"
  // or be at position 0 to avoid false matches inside values like "CRM-only".
  // Longer labels are distinctive enough to match anywhere.
  const positions = [];
  const lowerCleaned = cleaned.toLowerCase();

  // Labels that never have a colon after them in the form
  const NO_COLON_LABELS = new Set([
    'are there any specific tools you are interested in adding to your tech stack?',
    'are there any specific tools',
    'biggest pains',
    'biggest opportunities',
  ]);

  for (const label of KNOWN_LABELS) {
    const lowerLabel = label.toLowerCase();
    let startIdx = 0;
    while (startIdx < lowerCleaned.length) {
      const idx = lowerCleaned.indexOf(lowerLabel, startIdx);
      if (idx === -1) break;

      // Check this position isn't already covered by a longer match
      const alreadyCovered = positions.some(
        (p) => idx >= p.start && idx < p.start + p.label.length
      );

      if (!alreadyCovered) {
        const afterLabel = idx + label.length;
        const charAfter = afterLabel < cleaned.length ? cleaned[afterLabel] : '';

        if (label.length <= 5) {
          // Short labels: require colon after, OR position 0
          if (charAfter === ':' || idx === 0) {
            positions.push({ start: idx, label: cleaned.slice(idx, idx + label.length) });
          }
        } else if (NO_COLON_LABELS.has(lowerLabel)) {
          // Labels that don't use colons — match if followed by a non-colon char
          positions.push({ start: idx, label: cleaned.slice(idx, idx + label.length) });
        } else {
          // Long labels: match if followed by colon or parenthetical like "($)" then colon
          if (charAfter === ':' || charAfter === '(' || charAfter === ' ') {
            positions.push({ start: idx, label: cleaned.slice(idx, idx + label.length) });
          }
        }
      }

      startIdx = idx + 1;
    }
  }

  // Sort by position
  positions.sort((a, b) => a.start - b.start);

  // Extract key:value pairs from positions
  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    let keyEnd = pos.start + pos.label.length;
    const valueEnd = i + 1 < positions.length ? positions[i + 1].start : cleaned.length;

    // Skip past any parenthetical suffix and colon that follow the label
    // e.g., "Beginning of Year ARR ($)$75M+" — skip "($)" to get "$75M+"
    let between = cleaned.slice(keyEnd, valueEnd);
    const parenColonMatch = between.match(/^(\s*\([^)]*\)\s*:?\s*|:\s*)/);
    if (parenColonMatch) {
      between = between.slice(parenColonMatch[0].length);
    }
    let value = between.trim();

    // Clean up the key — remove parenthetical hints
    let key = pos.label.replace(/\s*\([^)]*\)\s*$/, '').trim();
    // Remove trailing question mark
    key = key.replace(/\?$/, '').trim();

    if (key && value) {
      entries.push([key, value]);
    }
  }

  return entries;
}

function parseCRM(value) {
  const v = value.trim().toLowerCase();
  if (v.includes('salesforce')) return { A1: 'Salesforce' };
  if (v.includes('hubspot')) return { A1: 'HubSpot' };
  return { A1: 'Other' };
}

function parseARR(value) {
  const raw = value.trim().toLowerCase();
  const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return null;

  // Normalize to millions: detect K/k suffix (e.g., "$500k" → 0.5M)
  let millions;
  if (/k/i.test(raw)) {
    millions = num / 1000;
  } else if (/b/i.test(raw)) {
    millions = num * 1000;
  } else if (/m/i.test(raw)) {
    millions = num;
  } else {
    // No suffix — heuristic: if num > 1000, assume raw dollars; otherwise assume millions
    millions = num > 1000 ? num / 1_000_000 : num;
  }

  if (millions >= 50) return { A3: '$50M+' };
  if (millions >= 20) return { A3: '$20-50M' };
  if (millions >= 5) return { A3: '$5-20M' };
  if (millions >= 1) return { A3: '$1-5M' };
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
