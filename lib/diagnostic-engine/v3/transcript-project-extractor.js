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

function buildSystemPrompt() {
  return `You are a RevOps project analyst. Your job is to analyze discovery call transcripts and identify specific projects or services the company needs based on what is discussed.

You have access to a catalog of strategic projects and managed service implementations. For each signal you detect, map it to the most relevant service ID from the catalog.

SIGNAL TYPES:
- explicit_mention: Prospect directly names a project, capability, or deliverable they want
- pain_point: Frustration or problem described that implies a specific project need
- tool_gap: Missing tool or platform that maps to a managed service implementation
- aspiration: Forward-looking goal or desire that maps to a project

RULES:
- Only map to service IDs from the catalog below
- Include a direct quote from the transcript as evidence
- Set confidence based on evidence strength:
  - 0.8-1.0: Directly stated need or explicit request ("we need forecasting")
  - 0.5-0.7: Strong implication from pain point or context ("we can't forecast accurately")
  - 0.3-0.5: Weak implication, could be interpreted differently
- Do NOT map generic complaints to specific projects without clear connection
- A single quote can map to multiple projects if clearly relevant
- Prefer strategic projects over managed services unless the signal is specifically about a tool
- Do NOT duplicate signals — if forecasting is mentioned multiple times, submit ONE signal with the strongest evidence
- Focus on the prospect's stated needs, not the seller's suggestions

SERVICE CATALOG:
${CATALOG_TEXT}`;
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
      max_tokens: 4096,
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
