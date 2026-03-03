/**
 * Transcript Intake Extractor
 *
 * Analyzes a discovery call transcript to extract answers for the
 * intake form questions. Uses the same OpenRouter/Claude pipeline
 * as the competency analyzer, but with a different prompt focused
 * on extracting specific form answers.
 *
 * Returns a preFill map matching the shape used by CRM inferrers:
 *   { [questionKey]: { value: string|string[], confidence: 'high'|'medium', evidence: string } }
 */

/**
 * All intake questions that could plausibly be answered from a transcript.
 * Excludes CRM-specific questions (dashboard count, required fields) that
 * require system access rather than conversation context.
 */
const EXTRACTABLE_QUESTIONS = [
  // Section A — Company Profile
  { key: 'A1', label: 'What is your primary CRM?', options: ['HubSpot', 'Salesforce', 'Other'] },
  { key: 'A2', label: 'How many total sales reps?', options: ['1-5', '6-15', '16-50', '50+'] },
  { key: 'A3', label: 'What is your approximate ARR range?', options: ['<$1M', '$1-5M', '$5-20M', '$20-50M', '$50M+'] },
  { key: 'A4', label: 'What is your primary GTM motion?', options: ['Inbound-led', 'Outbound-led', 'Product-led', 'Partner-led', 'Blended'] },
  { key: 'A5', label: 'Do you have a partner/channel program?', options: ['Yes, active', 'Building', 'No'] },

  // Section B — Tools (extracted as array)
  { key: 'B1_tools', label: 'Which GTM tools does the company use?', type: 'multi',
    options: ['sales_engagement', 'conversation_intel', 'data_enrichment', 'csp', 'lead_routing', 'esign', 'bi_analytics', 'support', 'enablement_platform', 'prm_tool', 'forecasting_tool', 'lms', 'abm_tool'],
    optionLabels: {
      sales_engagement: 'Sales engagement (Outreach, Salesloft, Apollo)',
      conversation_intel: 'Conversation intelligence (Gong, Chorus)',
      data_enrichment: 'Data enrichment (ZoomInfo, Clearbit, Clay)',
      csp: 'Customer success platform (Gainsight, ChurnZero)',
      lead_routing: 'Lead routing (LeanData, Chili Piper)',
      esign: 'E-signature (DocuSign, PandaDoc)',
      bi_analytics: 'BI/Analytics (Tableau, Looker, Power BI)',
      support: 'Support/Ticketing (Zendesk, Intercom)',
      enablement_platform: 'Sales enablement (Highspot, Seismic)',
      prm_tool: 'Partner management (PartnerStack, Crossbeam)',
      forecasting_tool: 'Forecasting (Clari, BoostUp)',
      lms: 'Learning management (WorkRamp, Lessonly)',
      abm_tool: 'ABM platform (6sense, Demandbase)',
    },
  },

  // Section C — Team & Org
  { key: 'T1', label: 'How many people are in your GTM org total?', options: ['1-10', '11-25', '26-50', '51-100', '100+'] },
  { key: 'T2', label: 'How long does it take a new rep to reach full productivity?', options: ['<30 days', '30-60 days', '60-90 days', '90+ days', "Don't know"] },
  { key: 'T3', label: 'How are territories or accounts assigned?', options: ['Named accounts', 'Geographic', 'Round-robin', 'No formal process'] },
  { key: 'T4', label: 'Is there a documented comp plan with variable components?', options: ['Yes with accelerators', 'Yes basic', 'Informal', 'No'] },
  { key: 'T5', label: 'How is your team structured?', options: ['By function (SDR/AE/AM)', 'By segment', 'By geography', 'Flat/generalist'] },

  // Section D — Processes
  { key: 'C1', label: 'How do inbound leads reach your CRM?', options: ['CRM forms (HubSpot/SF)', 'Website → API', 'Manual entry', 'Mix'] },
  { key: 'C3', label: 'Do you have a documented MQL definition?', options: ['Yes, with lead scoring', 'Yes, criteria-based', 'Informal', 'No'] },
  { key: 'C4', label: 'Do you use a sales qualification methodology?', options: ['MEDDIC/MEDDPICC', 'BANT', 'SPICED', 'Custom framework', 'Multiple', 'None'] },
  { key: 'C6', label: 'Do you track closed-lost reasons?', options: ['Required field', 'Optional field', 'Not tracked'] },
  { key: 'C7', label: 'Is there a formal sales-to-CS handoff process?', options: ['Documented + automated', 'Documented', 'Informal', 'None'] },
  { key: 'C9', label: 'Do you collect NPS or CSAT?', options: ['Yes, automated program', 'Yes, ad hoc', 'No'] },
  { key: 'C12', label: 'Do you run events (webinars, conferences, dinners)?', options: ['Yes, regularly', 'Occasionally', 'No'] },
  { key: 'C13', label: 'Do you have a documented operating/GTM plan?', options: ['Yes quarterly', 'Yes annual', 'Informal', 'No'] },
  { key: 'C14', label: 'Is there a headcount/capacity model?', options: ['Yes with revenue tie', 'Basic', 'No'] },
  { key: 'C18', label: 'Is there a documented coaching program?', options: ['Yes with CI', 'Yes informal', 'No'] },
  { key: 'M4_pipeline', label: 'Do you track marketing-sourced vs sales-sourced pipeline?', options: ['Yes, in CRM', 'Yes, externally', 'No'] },
  { key: 'R4_winloss', label: 'Do you conduct win/loss analysis?', options: ['Formal process', 'Ad hoc', 'No'] },

  // Section E — Reporting
  { key: 'D2', label: 'Are dashboards trusted for decision-making?', options: ['Yes, primary tool', 'Somewhat', 'Not really', 'No dashboards'] },
  { key: 'D3', label: 'How is sales forecasting done?', options: ['AI/tool-assisted', 'CRM forecast tool', 'Spreadsheet', 'Gut feel', 'Not done'] },
  { key: 'D4', label: 'Do you have a growth model / revenue plan?', options: ['Yes, comprehensive', 'Partial', 'No'] },
  { key: 'D6', label: 'Are playbooks documented?', options: ['Yes in enablement platform', 'Yes in docs', 'Tribal knowledge', 'No'] },

  // Section F — Planning & Enablement
  { key: 'E1', label: 'What data informs your quarterly planning?', options: ['CRM data + finance', 'CRM data only', 'Spreadsheets', 'Gut feel'] },
  { key: 'E2', label: 'How do reps access playbooks and sales content?', options: ['Enablement platform', 'Shared drive/wiki', 'CRM embedded', 'No central place'] },
  { key: 'E3', label: 'How often do managers review calls or meetings with reps?', options: ['Weekly', 'Monthly', 'Quarterly', 'Rarely/never'] },
];

/**
 * Extract intake form answers from a transcript.
 *
 * @param {string} transcriptText - Raw transcript text
 * @param {object} options
 * @param {string} options.model - OpenRouter model ID
 * @param {string} options.apiKey - OpenRouter API key
 * @returns {object} preFill map: { [key]: { value, confidence, evidence } }
 */
export async function extractIntakeFromTranscript(transcriptText, options = {}) {
  const {
    model = 'anthropic/claude-sonnet-4',
    apiKey = process.env.OPENROUTER_API_KEY,
  } = options;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is required for transcript intake extraction');
  }

  if (!transcriptText || transcriptText.trim().length < 100) {
    throw new Error('Transcript text is too short for meaningful extraction');
  }

  const questionsPrompt = buildQuestionsPrompt();

  const response = await callOpenRouter({
    model,
    apiKey,
    system: buildIntakeSystemPrompt(questionsPrompt),
    messages: [
      {
        role: 'user',
        content: `Extract intake form answers from the following discovery call transcript.\n\n<transcript>\n${transcriptText}\n</transcript>`,
      },
    ],
    tools: [intakeExtractionTool],
  });

  return parseIntakeResponse(response);
}

// ── Internal Helpers ──

function buildQuestionsPrompt() {
  const lines = [];

  for (const q of EXTRACTABLE_QUESTIONS) {
    if (q.type === 'multi') {
      const optLabels = Object.entries(q.optionLabels)
        .map(([k, v]) => `  - "${k}": ${v}`)
        .join('\n');
      lines.push(`**${q.key}** (multi-select): ${q.label}\nValid values:\n${optLabels}`);
    } else {
      lines.push(`**${q.key}**: ${q.label}\nValid options: ${q.options.map((o) => `"${o}"`).join(', ')}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function buildIntakeSystemPrompt(questionsPrompt) {
  return `You are a RevOps intake analyst. Your job is to listen to a discovery call transcript and extract answers to intake form questions about the company's GTM operations.

For each question listed below, determine if the transcript contains evidence to answer it. Only extract answers you are confident about — do NOT guess or infer answers without clear evidence.

RULES:
- Only use the EXACT option values listed for each question
- For multi-select questions (B1_tools), return an array of matching tool keys
- Include a direct quote from the transcript as evidence for each answer
- Set confidence to "high" when the speaker directly states the answer
- Set confidence to "medium" when the answer is implied but not explicitly stated
- Skip questions where the transcript provides no relevant information
- Do NOT infer answers — only extract what is explicitly discussed

QUESTIONS:
${questionsPrompt}`;
}

const intakeExtractionTool = {
  name: 'submit_intake_answers',
  description: 'Submit extracted intake form answers from the transcript',
  input_schema: {
    type: 'object',
    properties: {
      answers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description: 'Intake question key (e.g., A1, B1_tools, C4, D3)',
            },
            value: {
              description: 'Answer value — must be one of the valid options for the question. String for single-select, array for multi-select (B1_tools).',
              oneOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } },
              ],
            },
            confidence: {
              type: 'string',
              enum: ['high', 'medium'],
              description: 'high = directly stated, medium = implied',
            },
            evidence: {
              type: 'string',
              description: 'Direct quote from transcript supporting this answer',
            },
          },
          required: ['key', 'value', 'confidence', 'evidence'],
        },
      },
    },
    required: ['answers'],
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
      tool_choice: { type: 'function', function: { name: 'submit_intake_answers' } },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error (${response.status}): ${error}`);
  }

  return response.json();
}

/**
 * Build valid option sets for validation.
 */
function getValidOptions() {
  const map = {};
  for (const q of EXTRACTABLE_QUESTIONS) {
    map[q.key] = new Set(q.options);
  }
  return map;
}

function parseIntakeResponse(response) {
  const toolCalls = response.choices?.[0]?.message?.tool_calls;
  if (!toolCalls || toolCalls.length === 0) return {};

  const call = toolCalls.find((tc) => tc.function?.name === 'submit_intake_answers');
  if (!call) return {};

  let parsed;
  try {
    parsed = typeof call.function.arguments === 'string'
      ? JSON.parse(call.function.arguments)
      : call.function.arguments;
  } catch {
    return {};
  }

  if (!parsed?.answers || !Array.isArray(parsed.answers)) return {};

  const validOptions = getValidOptions();
  const validKeys = new Set(EXTRACTABLE_QUESTIONS.map((q) => q.key));
  const preFill = {};

  for (const answer of parsed.answers) {
    if (!validKeys.has(answer.key)) continue;
    if (!answer.value) continue;
    if (!['high', 'medium'].includes(answer.confidence)) continue;

    // Validate the answer value against valid options
    if (answer.key === 'B1_tools') {
      // Multi-select: filter to valid tool keys
      const toolOptions = new Set(EXTRACTABLE_QUESTIONS.find((q) => q.key === 'B1_tools').options);
      const validTools = Array.isArray(answer.value)
        ? answer.value.filter((v) => toolOptions.has(v))
        : [];
      if (validTools.length > 0) {
        preFill[answer.key] = {
          value: validTools,
          confidence: answer.confidence,
          evidence: answer.evidence || '',
        };
      }
    } else {
      // Single-select: check the value matches a valid option
      if (validOptions[answer.key]?.has(answer.value)) {
        preFill[answer.key] = {
          value: answer.value,
          confidence: answer.confidence,
          evidence: answer.evidence || '',
        };
      }
    }
  }

  return preFill;
}
