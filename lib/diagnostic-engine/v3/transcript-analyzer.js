/**
 * Transcript Analyzer
 *
 * Processes discovery call transcripts using Claude API to extract
 * competency assessments. Each transcript is analyzed against the
 * full v3 rubric, producing per-competency, per-department scores.
 */

import { V3_COMPETENCIES, expandDepartments, V3_STATUS, getTranscriptCompetencies } from './constants-v3';

/**
 * Analyze a transcript and extract competency assessments.
 *
 * @param {string} transcriptText - Raw transcript text
 * @param {object} options
 * @param {string} options.model - Claude model to use (default: 'claude-sonnet-4-6')
 * @param {string} options.apiKey - Anthropic API key
 * @returns {Array<{ competency_id, department, score, confidence, evidence_quotes, assessment, reasoning }>}
 */
export async function analyzeTranscript(transcriptText, options = {}) {
  const {
    model = 'claude-sonnet-4-6',
    apiKey = process.env.ANTHROPIC_API_KEY,
  } = options;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is required for transcript analysis');
  }

  if (!transcriptText || transcriptText.trim().length < 100) {
    throw new Error('Transcript text is too short for meaningful analysis');
  }

  // Build the rubric reference for the prompt
  const rubricText = buildRubricReference();

  // First pass: extract evidence and score
  const response = await callClaude({
    model,
    apiKey,
    system: buildSystemPrompt(rubricText),
    messages: [
      {
        role: 'user',
        content: `Analyze the following discovery call transcript and extract competency assessments.\n\n<transcript>\n${transcriptText}\n</transcript>`,
      },
    ],
    tools: [extractionTool],
  });

  // Parse the tool use response
  const assessments = parseExtractionResponse(response);

  return assessments;
}

/**
 * Merge assessments from multiple transcripts.
 * Takes the highest-confidence assessment per competency/department.
 *
 * @param {Array<Array>} transcriptResults - Array of assessment arrays from analyzeTranscript
 * @returns {object} Map of { competencyId_dept: { score, confidence, evidence } }
 */
export function mergeTranscriptAssessments(transcriptResults) {
  const merged = {};

  for (const assessments of transcriptResults) {
    for (const a of assessments) {
      const key = `${a.competency_id}_${a.department}`;
      if (!merged[key] || a.confidence > merged[key].confidence) {
        merged[key] = {
          score: a.score,
          confidence: a.confidence,
          evidence: a.evidence_quotes || [],
          assessment: a.assessment,
          reasoning: a.reasoning,
        };
      }
    }
  }

  return merged;
}

/**
 * Identify low-confidence assessments that need consultant review.
 *
 * @param {Array} assessments - From analyzeTranscript
 * @param {number} threshold - Confidence threshold (default 0.5)
 * @returns {Array} Low-confidence assessments
 */
export function flagForReview(assessments, threshold = 0.5) {
  return assessments.filter((a) => a.confidence < threshold);
}

// ── Internal Helpers ──

// ── Evidence Patterns for HIGH priority competencies ──

const EVIDENCE_PATTERNS = {
  'PL-1': 'Mentions of annual plan, quarterly goals, OKRs, strategic planning, operating plan documents.',
  'PL-2': 'Hiring plans, headcount models, ramp time, capacity planning, quota-to-rep ratios.',
  'PE-3': 'Onboarding processes, 30/60/90 day plans, new hire ramp, training programs for new employees.',
  'PE-4': 'Commission structures, OTE, comp plans, accelerators, SPIFFs, variable pay discussions.',
  'PR-8': 'ABM programs, target account lists, account-based selling, intent data, account tiers.',
  'EN-1': 'Content strategy, ICP documentation, persona content, case studies, sales collateral coverage.',
  'EN-3': 'Sales coaching, call reviews, conversation intelligence tools (Gong/Chorus), deal reviews, manager coaching.',
  'EN-5': 'Playbooks, documented processes, sales plays, runbooks, process documentation.',
};

function getEvidencePatterns(competencyId) {
  return EVIDENCE_PATTERNS[competencyId] || 'General evidence of maturity in this area.';
}

function buildRubricReference() {
  const lines = [];

  // HIGH priority — full rubric with evidence extraction patterns
  const highPriority = V3_COMPETENCIES.filter((c) => c.transcriptPriority === 'high');
  lines.push('# HIGH PRIORITY COMPETENCIES');
  lines.push('Extract detailed evidence for these. Score each one if ANY evidence exists.\n');

  for (const comp of highPriority) {
    const depts = expandDepartments(comp.departments);
    lines.push(`## ${comp.id}: ${comp.name}`);
    lines.push(`Pillar: ${comp.pillar} | Departments: ${depts.join(', ')}`);
    lines.push(`Description: ${comp.description}`);
    lines.push(`LOOK FOR: ${getEvidencePatterns(comp.id)}`);
    if (comp.rubric) {
      lines.push('Scoring rubric:');
      for (const [score, desc] of Object.entries(comp.rubric)) {
        lines.push(`  ${score} (${V3_STATUS[score]}): ${desc}`);
      }
    }
    lines.push('');
  }

  // MEDIUM priority — compressed rubric, conditional extraction
  const medPriority = V3_COMPETENCIES.filter((c) => c.transcriptPriority === 'medium');
  lines.push('\n# MEDIUM PRIORITY COMPETENCIES');
  lines.push('Only score these if STRONG, EXPLICIT evidence is found. Do not infer.\n');

  for (const comp of medPriority) {
    const depts = expandDepartments(comp.departments);
    lines.push(`## ${comp.id}: ${comp.name}`);
    lines.push(`Departments: ${depts.join(', ')}`);
    // Compressed rubric: only show 1, 3, 5 anchors
    if (comp.rubric) {
      lines.push(`  1: ${comp.rubric[1]}`);
      lines.push(`  3: ${comp.rubric[3]}`);
      lines.push(`  5: ${comp.rubric[5]}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function buildSystemPrompt(rubricText) {
  return `You are a RevOps diagnostic analyst. Your job is to analyze discovery call transcripts and extract evidence-based assessments of a company's go-to-market operations maturity.

You will analyze against TWO tiers of competencies:

**HIGH PRIORITY (8 competencies):** Score these whenever you find ANY evidence. Provide detailed quotes and reasoning.

**MEDIUM PRIORITY (7 competencies):** ONLY score these if you find STRONG, EXPLICIT evidence. If evidence is ambiguous or indirect, skip the competency entirely. Set confidence below 0.5 for any medium-priority assessment.

For each competency you score, provide:
1. A score from 1-5 based on the rubric
2. A confidence level (0.0-1.0) indicating evidence strength
3. 1-3 direct quotes from the transcript
4. A brief assessment summary
5. Your reasoning for the score

RULES:
- HIGH PRIORITY: Always attempt to score if there is any relevant discussion
- MEDIUM PRIORITY: Only score with strong, explicit evidence (direct statements, not inferences)
- Include the priority tier in your reasoning
- Score each applicable department separately when department-specific information exists
- Do NOT hallucinate or infer scores without evidence
- Do NOT score any competency not listed below

COMPETENCY RUBRIC:
${rubricText}`;
}

const extractionTool = {
  name: 'submit_assessments',
  description: 'Submit competency assessments extracted from the transcript',
  input_schema: {
    type: 'object',
    properties: {
      assessments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            competency_id: {
              type: 'string',
              description: 'Competency ID (e.g., PL-1, PR-5, SY-1)',
            },
            department: {
              type: 'string',
              enum: ['marketing', 'sales', 'cs', 'partners'],
              description: 'Department this assessment applies to',
            },
            score: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Score from 1 (Weak) to 5 (Best Practice)',
            },
            confidence: {
              type: 'number',
              minimum: 0,
              maximum: 1,
              description: 'Confidence level based on evidence strength',
            },
            evidence_quotes: {
              type: 'array',
              items: { type: 'string' },
              description: 'Direct quotes from transcript supporting this assessment',
            },
            assessment: {
              type: 'string',
              description: 'Brief assessment summary (1-2 sentences)',
            },
            reasoning: {
              type: 'string',
              description: 'Detailed reasoning for the score',
            },
          },
          required: ['competency_id', 'department', 'score', 'confidence', 'assessment'],
        },
      },
    },
    required: ['assessments'],
  },
};

async function callClaude({ model, apiKey, system, messages, tools }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system,
      messages,
      tools,
      tool_choice: { type: 'tool', name: 'submit_assessments' },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error (${response.status}): ${error}`);
  }

  return response.json();
}

function parseExtractionResponse(response) {
  // Find the tool_use content block
  const toolUse = response.content?.find((block) => block.type === 'tool_use');
  if (!toolUse || !toolUse.input?.assessments) {
    return [];
  }

  // Only accept competencies that are in the transcript analysis set
  const validTranscriptIds = new Set(
    getTranscriptCompetencies().map((c) => c.id)
  );
  const validDepts = new Set(['marketing', 'sales', 'cs', 'partners']);

  return toolUse.input.assessments
    .filter((a) => {
      return (
        validTranscriptIds.has(a.competency_id) &&
        validDepts.has(a.department) &&
        a.score >= 1 &&
        a.score <= 5 &&
        a.confidence >= 0 &&
        a.confidence <= 1
      );
    })
    .map((a) => ({
      competency_id: a.competency_id,
      department: a.department,
      score: a.score,
      confidence: Math.round(a.confidence * 100) / 100,
      evidence_quotes: a.evidence_quotes || [],
      assessment: a.assessment || '',
      reasoning: a.reasoning || '',
    }));
}
