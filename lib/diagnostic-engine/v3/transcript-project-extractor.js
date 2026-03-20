/**
 * Transcript Project Signal Extractor
 *
 * Analyzes discovery call transcripts to detect specific project needs
 * based on explicit mentions, pain points, tool gaps, and aspirations.
 * Uses the same OpenRouter/Claude pipeline as the competency analyzer
 * and intake extractor, but maps signals to service catalog entries.
 *
 * Returns an array of project signals that feed into roadmap generation.
 */

import { strategicProjects, managedServices } from '../../../data/services-catalog';

// ── Build valid service ID set for validation ──

const ALL_SERVICE_IDS = new Set();
const SERVICE_CATALOG_LINES = [];

for (const [category, services] of Object.entries(strategicProjects)) {
  for (const svc of services) {
    ALL_SERVICE_IDS.add(svc.id);
    SERVICE_CATALOG_LINES.push(`- ${svc.id}: ${svc.name} — ${svc.description} [${category}]`);
  }
}
for (const [category, services] of Object.entries(managedServices)) {
  for (const svc of services) {
    ALL_SERVICE_IDS.add(svc.id);
    SERVICE_CATALOG_LINES.push(`- ${svc.id}: ${svc.name} — ${svc.description} [${category}, managed]`);
  }
}

const CATALOG_TEXT = SERVICE_CATALOG_LINES.join('\n');

const VALID_SIGNAL_TYPES = new Set([
  'explicit_mention',
  'pain_point',
  'tool_gap',
  'aspiration',
]);

/**
 * Extract project signals from a transcript.
 *
 * @param {string} transcriptText - Raw transcript text
 * @param {object} options
 * @param {string} options.model - OpenRouter model ID
 * @param {string} options.apiKey - OpenRouter API key
 * @returns {Array<{ service_id, signal_type, confidence, evidence, reasoning }>}
 */
export async function extractProjectSignals(transcriptText, options = {}) {
  const {
    model = 'anthropic/claude-sonnet-4',
    apiKey = process.env.OPENROUTER_API_KEY,
  } = options;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required for project signal extraction');
  }

  if (!transcriptText || transcriptText.trim().length < 100) {
    throw new Error('Transcript text is too short for meaningful extraction');
  }

  const systemPrompt = buildSystemPrompt();

  const response = await callOpenRouter({
    model,
    apiKey,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Analyze the following discovery call transcript and identify project signals.\n\n<transcript>\n${transcriptText}\n</transcript>`,
      },
    ],
    tools: [projectSignalTool],
  });

  return parseProjectSignalResponse(response);
}

/**
 * Build the full prompt config for client-side OpenRouter call.
 * Returns everything the browser needs to call OpenRouter directly.
 */
export function buildProjectSignalPromptConfig(transcriptText) {
  const systemPrompt = buildSystemPrompt();
  return {
    model: 'anthropic/claude-sonnet-4',
    systemPrompt,
    userMessage: `Analyze the following discovery call transcript and identify project signals.\n\n<transcript>\n${transcriptText}\n</transcript>`,
    tools: [{
      type: 'function',
      function: {
        name: projectSignalTool.name,
        description: projectSignalTool.description,
        parameters: projectSignalTool.input_schema,
      },
    }],
    toolChoice: { type: 'function', function: { name: 'submit_project_signals' } },
  };
}

/**
 * Parse and validate an OpenRouter response for project signal extraction.
 * Exported so the server-side store endpoint can validate client-submitted results.
 */
export { parseProjectSignalResponse };

// ── Internal Helpers ──

// ── Trigger phrases for high-frequency services ──
// These help the LLM match colloquial language to catalog entries
const TRIGGER_PHRASES = {
  'forecasting-process-implementation': ['forecast accuracy', 'can\'t predict revenue', 'commit vs best case', 'pipeline coverage', 'sandbagging', 'deal slippage', 'revenue predictability'],
  'growth-model': ['financial model', 'revenue targets', 'capacity planning', 'ARR goals', 'growth plan', 'unit economics', 'how do we get to X million'],
  'executive-reporting-suite': ['board reporting', 'executive visibility', 'leadership dashboards', 'board deck', 'investor reporting', 'can\'t see the numbers'],
  'sales-enablement-platform-implementation': ['reps don\'t know what to say', 'no sales content', 'content is scattered', 'training materials', 'onboarding content', 'sales playbook', 'ramp time too long'],
  'conversation-intelligence-platform-implementation': ['call recording', 'coaching calls', 'listen to calls', 'call quality', 'Gong', 'Chorus', 'conversation intelligence', 'call review'],
  'lead-routing': ['leads not getting to reps', 'lead assignment', 'round robin', 'leads sitting', 'slow response', 'wrong rep gets the lead'],
  'lead-lifecycle': ['lead stages', 'MQL to SQL', 'lead status', 'lead lifecycle', 'lead progression', 'what happens after they fill out a form'],
  'sales-lifecycle': ['pipeline stages', 'deal stages', 'opportunity stages', 'sales process', 'pipeline design', 'exit criteria'],
  'lead-scoring-model-sales-led': ['lead scoring', 'lead prioritization', 'which leads are good', 'lead quality', 'too many bad leads', 'MQL quality'],
  'speed-to-lead': ['response time', 'speed to lead', 'how fast do we follow up', 'leads going cold', 'no one calls them back'],
  'automated-outbound-process': ['outbound', 'prospecting', 'cold outreach', 'sequences', 'cadences', 'SDR process', 'BDR process', 'outbound motion'],
  'abm-abs-process-and-system': ['account-based', 'ABM', 'target accounts', 'enterprise selling', 'named accounts', 'account list', 'moving upmarket'],
  'market-map': ['ICP', 'ideal customer', 'TAM', 'total addressable market', 'who should we sell to', 'market segmentation', 'account tiering'],
  'sales-qualification-methodology': ['qualification', 'MEDDIC', 'BANT', 'SPICED', 'deal qualification', 'reps aren\'t qualifying', 'bad deals in pipeline'],
  'sales-territory-design': ['territory', 'account assignment', 'territory planning', 'geographic territories', 'account ownership', 'who owns what'],
  'rules-of-engagement-design': ['rules of engagement', 'account conflicts', 'who owns the account', 'rep fighting over deals', 'overlap between reps'],
  'commission-plan-design-and-implementation': ['comp plan', 'commission structure', 'incentive', 'OTE', 'accelerators', 'SPIFFs', 'variable compensation'],
  'commission-tool-implementation': ['commission tracking', 'commission spreadsheet', 'payout calculation', 'CaptivateIQ', 'Spiff', 'Xactly', 'manual commission'],
  'customer-lifecycle': ['post-sale process', 'customer journey', 'onboarding to renewal', 'customer stages', 'no visibility after close'],
  'renewal-management': ['renewal process', 'churn', 'retention', 'renewal tracking', 'customers lapsing', 'auto-renew', 'renewal playbook'],
  'customer-health-model': ['customer health', 'at-risk accounts', 'health score', 'churn prediction', 'which customers are unhappy'],
  'onboarding-and-process-improvement': ['customer onboarding', 'time to value', 'implementation process', 'onboarding takes too long', 'customers drop off'],
  'sales-to-cs-handoff-process-implementation': ['handoff to CS', 'context lost after close', 'CS doesn\'t know the deal', 'post-sale handoff'],
  'marketing-to-sales-handoff-and-sla-tracking': ['marketing to sales handoff', 'MQL handoff', 'leads not followed up', 'SLA between marketing and sales'],
  'crm-deduplication': ['duplicates', 'duplicate records', 'messy CRM data', 'data quality', 'same account twice'],
  'activity-capture': ['activity logging', 'reps not logging', 'no visibility into activity', 'emails not in CRM', 'calls not tracked'],
  'lead-and-opportunity-attribution': ['attribution', 'what\'s working', 'marketing ROI', 'which campaigns drive revenue', 'can\'t prove marketing impact'],
  'cpq-implementation': ['CPQ', 'configure price quote', 'quoting process', 'proposal generation', 'pricing errors', 'quote approval'],
  'quote-to-cash': ['quote to cash', 'invoicing', 'billing process', 'order management', 'contract to invoice'],
  'arr-reporting': ['ARR tracking', 'recurring revenue', 'MRR', 'annual recurring', 'revenue reporting'],
  'revenue-intelligence-process': ['revenue intelligence', 'deal insights', 'pipeline analytics', 'Clari', 'revenue operations data'],
  'opportunity-management-ux-improvements': ['CRM too slow', 'reps hate the CRM', 'too many clicks', 'CRM adoption', 'sales productivity'],
  'automated-inbound-data-enrichment': ['data enrichment', 'enrich leads', 'incomplete data', 'don\'t know who they are', 'lead data quality'],
  'marketing-automation-platform-implementation': ['marketing automation', 'email platform', 'Marketo', 'Pardot', 'HubSpot marketing', 'nurture campaigns'],
  'email-operations-nurture-program': ['nurture', 'drip campaigns', 'email sequences', 'stay in touch', 'warming leads', 'email nurture'],
  'nps-and-voice-of-customer-launch': ['NPS', 'customer feedback', 'voice of customer', 'customer satisfaction', 'CSAT', 'customer survey'],
  'gtm-org-chart-roles-and-hiring-plan': ['org design', 'hiring plan', 'who do we hire next', 'team structure', 'roles and responsibilities', 'org chart'],
  'quotas-and-target-setting': ['quota setting', 'targets', 'quota methodology', 'how much should each rep carry', 'quota attainment'],
  'monthly-quarterly-gtm-reporting-pack': ['reporting pack', 'QBR', 'business review', 'monthly reporting', 'quarterly review', 'WBR'],
};

function buildSystemPrompt() {
  // Build enriched catalog with trigger phrases
  const enrichedCatalog = SERVICE_CATALOG_LINES.map((line) => {
    const idMatch = line.match(/^- ([^:]+):/);
    if (idMatch && TRIGGER_PHRASES[idMatch[1]]) {
      return `${line}\n  TRIGGERS: ${TRIGGER_PHRASES[idMatch[1]].map(t => `"${t}"`).join(', ')}`;
    }
    return line;
  }).join('\n');

  return `You are a RevOps project analyst. Your job is to analyze discovery call transcripts and identify ALL projects or services the company needs — both explicitly stated and implied by their pain points, gaps, and goals.

You have access to a catalog of strategic projects and managed service implementations. For each signal you detect, map it to the most relevant service ID(s) from the catalog.

SIGNAL TYPES:
- explicit_mention: Prospect directly names a project, capability, or deliverable they want
- pain_point: Frustration or problem described that implies a specific project need
- tool_gap: Missing tool or platform that maps to a managed service implementation
- aspiration: Forward-looking goal or desire that maps to a project

RULES:
- Only map to service IDs from the catalog below
- Include a direct quote from the transcript as evidence
- Set confidence based on evidence strength:
  - 0.8-1.0: Directly stated need or explicit request
  - 0.5-0.7: Strong implication from pain point or context
  - 0.3-0.5: Reasonable inference — the need is implied but not stated
  - 0.2-0.3: Weak but plausible inference
- When a prospect describes a pain point, ACTIVELY INFER which services would address it — even if the service isn't named directly. Use the TRIGGERS listed under each service to help you match colloquial language to catalog entries.
- It is better to surface a borderline signal with lower confidence than to miss a real need. Consultants will review and adjust — your job is to catch everything plausible.
- A single pain point or quote CAN and SHOULD map to MULTIPLE services when it implies several needs
- Do NOT submit the same service_id more than once — pick the strongest evidence for each
- Prefer strategic projects over managed services unless the signal is specifically about a tool
- Focus on the prospect's stated needs, not the seller's suggestions
- Look for INDIRECT signals: if someone says "we have no idea what's working in marketing" that implies attribution, reporting, and possibly marketing automation needs

MAPPING EXAMPLES:
These show how to infer services from what prospects say:

1. "We need to implement forecasting" → forecasting-process-implementation (explicit_mention, 0.9)
2. "Our reps don't know what to say on discovery calls" → sales-enablement-platform-implementation (pain_point, 0.7), conversation-intelligence-platform-implementation (pain_point, 0.6)
3. "We're still tracking commissions in a spreadsheet" → commission-tool-implementation (tool_gap, 0.8), commission-plan-design-and-implementation (pain_point, 0.6)
4. "We want to move upmarket and sell to enterprise" → abm-abs-process-and-system (aspiration, 0.6), sales-territory-design (aspiration, 0.5), market-map (aspiration, 0.5)
5. "Leads are falling through the cracks" → lead-routing (pain_point, 0.7), lead-lifecycle (pain_point, 0.6), speed-to-lead (pain_point, 0.6)
6. "We don't know which marketing campaigns actually drive revenue" → lead-and-opportunity-attribution (pain_point, 0.8), marketing-reporting-pack (pain_point, 0.6)
7. "Our CRM is a mess, tons of duplicates" → crm-deduplication (pain_point, 0.8), foundational-automations-and-reporting-logic (pain_point, 0.5)
8. "After we close a deal, CS has no idea what was promised" → sales-to-cs-handoff-process-implementation (pain_point, 0.8), customer-lifecycle (pain_point, 0.5)
9. "We have no visibility into what reps are doing all day" → activity-capture (pain_point, 0.7), conversation-intelligence-platform-implementation (pain_point, 0.5), monthly-quarterly-gtm-reporting-pack (pain_point, 0.5)
10. "Our customers keep churning and we don't see it coming" → customer-health-model (pain_point, 0.8), renewal-management (pain_point, 0.7), nps-and-voice-of-customer-launch (pain_point, 0.5)

SERVICE CATALOG:
${enrichedCatalog}`;
}

const projectSignalTool = {
  name: 'submit_project_signals',
  description: 'Submit project signals detected from the transcript',
  input_schema: {
    type: 'object',
    properties: {
      signals: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            service_id: {
              type: 'string',
              description: 'Service ID from the catalog (e.g., forecasting-process-implementation, gong-impl)',
            },
            signal_type: {
              type: 'string',
              enum: ['explicit_mention', 'pain_point', 'tool_gap', 'aspiration'],
              description: 'Type of signal detected',
            },
            confidence: {
              type: 'number',
              minimum: 0,
              maximum: 1,
              description: 'Confidence level based on evidence strength (0.0 to 1.0)',
            },
            evidence: {
              type: 'string',
              description: 'Direct quote from the transcript supporting this signal',
            },
            reasoning: {
              type: 'string',
              description: 'Why this project is relevant to what was said',
            },
          },
          required: ['service_id', 'signal_type', 'confidence', 'evidence', 'reasoning'],
        },
      },
    },
    required: ['signals'],
  },
};

async function callOpenRouter({ model, apiKey, system, messages, tools }) {
  const openAiTools = tools.map((t) => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description,
      parameters: t.input_schema,
    },
  }));

  const allMessages = [
    { role: 'system', content: system },
    ...messages,
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://leanscale.team',
      'X-Title': 'LeanScale Diagnostic',
    },
    body: JSON.stringify({
      model,
      max_tokens: 8192,
      messages: allMessages,
      tools: openAiTools,
      tool_choice: { type: 'function', function: { name: 'submit_project_signals' } },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${error}`);
  }

  return response.json();
}

function parseProjectSignalResponse(response) {
  const toolCalls = response.choices?.[0]?.message?.tool_calls;
  if (!toolCalls || toolCalls.length === 0) return [];

  const call = toolCalls.find((tc) => tc.function?.name === 'submit_project_signals');
  if (!call) return [];

  let parsed;
  try {
    parsed = typeof call.function.arguments === 'string'
      ? JSON.parse(call.function.arguments)
      : call.function.arguments;
  } catch {
    return [];
  }

  if (!parsed?.signals || !Array.isArray(parsed.signals)) return [];

  return parsed.signals
    .filter((s) => {
      return (
        ALL_SERVICE_IDS.has(s.service_id) &&
        VALID_SIGNAL_TYPES.has(s.signal_type) &&
        typeof s.confidence === 'number' &&
        s.confidence >= 0 &&
        s.confidence <= 1 &&
        s.evidence &&
        s.reasoning
      );
    })
    .map((s) => ({
      service_id: s.service_id,
      signal_type: s.signal_type,
      confidence: Math.round(s.confidence * 100) / 100,
      evidence: s.evidence,
      reasoning: s.reasoning,
    }));
}
