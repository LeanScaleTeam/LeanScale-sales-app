/**
 * Enablement Pillar Grader (EN-1 through EN-5)
 *
 * Enablement is primarily scored from transcript analysis and consultant
 * assessments, with weak API signals for content counts and platform detection.
 *
 * Score resolution order:
 *   1. Compute API base score (weak signal, often null)
 *   2. Overlay transcript score (overrides API base)
 *   3. Consultant score (always wins if present)
 */

import { V3_SOURCE_TYPES } from '../constants-v3';

// ── Enablement Competency Definitions ──

const ENABLEMENT_COMPETENCIES = [
  {
    id: 'EN-1',
    name: 'ICP content coverage',
    departments: ['marketing', 'sales', 'partners'],
    source: V3_SOURCE_TYPES.TRANSCRIPT_CONSULTANT,
    serviceIds: ['sales-enablement-platform-implementation'],
    apiScore: apiScoreEN1,
  },
  {
    id: 'EN-2',
    name: 'Content accessible in single system',
    departments: ['marketing', 'sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['sales-enablement-platform-implementation'],
    apiScore: apiScoreEN2,
  },
  {
    id: 'EN-3',
    name: 'Sales coaching program',
    departments: ['sales'],
    source: V3_SOURCE_TYPES.TRANSCRIPT_CONSULTANT,
    serviceIds: ['conversation-intelligence-platform-implementation'],
    apiScore: apiScoreEN3,
  },
  {
    id: 'EN-4',
    name: 'Training / certification',
    departments: ['marketing', 'sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.CONSULTANT_ONLY,
    serviceIds: ['sales-enablement-platform-implementation'],
    apiScore: () => null,
  },
  {
    id: 'EN-5',
    name: 'Playbook documentation',
    departments: ['marketing', 'sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.TRANSCRIPT_CONSULTANT,
    serviceIds: ['sales-enablement-platform-implementation'],
    apiScore: apiScoreEN5,
  },
];

// ── API Weak Signal Scorers ──

/**
 * EN-1: ICP content coverage
 * Check blog_post_count or marketing_email_count as weak signal.
 *   emails > 50 (or blogs > 50) -> 3
 *   emails > 20 (or blogs > 20) -> 2
 *   else -> null
 */
function apiScoreEN1(signals) {
  const count = signals.marketing_email_count || signals.blog_post_count || 0;
  if (count > 50) return 3;
  if (count > 20) return 2;
  return null;
}

/**
 * EN-2: Content accessible in single system
 * Check for enablement platform detection.
 *   has_enablement_platform -> 4
 *   else -> null (transcript/consultant override)
 */
function apiScoreEN2(signals) {
  if (signals.has_enablement_platform) return 4;
  return null;
}

/**
 * EN-3: Sales coaching program
 * Check for conversation intelligence tool.
 *   has_conversation_intelligence -> 3
 *   else -> null
 */
function apiScoreEN3(signals) {
  if (signals.has_conversation_intelligence) return 3;
  return null;
}

/**
 * EN-5: Playbook documentation
 * Check knowledge_article_count (Salesforce).
 *   articles > 10 -> 3
 *   articles > 0  -> 2
 *   else -> null
 */
function apiScoreEN5(signals) {
  const count = signals.knowledge_article_count || 0;
  if (count > 10) return 3;
  if (count > 0) return 2;
  return null;
}

// ── Helpers ──

/**
 * Derive impact label from a 1-5 score.
 *   1-2 = negative, 3 = neutral, 4-5 = positive
 */
function deriveImpact(score) {
  if (score <= 2) return 'negative';
  if (score >= 4) return 'positive';
  return 'neutral';
}

/**
 * Build the lookup key used in transcript and consultant score maps.
 */
function scoreKey(competencyId, department) {
  return `${competencyId}_${department}`;
}

/**
 * Build a human-readable description of the API signal used.
 */
function describeApiSignal(competencyId, signals) {
  switch (competencyId) {
    case 'EN-1': {
      if (signals.marketing_email_count > 0) {
        return { name: 'marketing email count', value: `${signals.marketing_email_count} emails detected` };
      }
      if (signals.blog_post_count > 0) {
        return { name: 'blog post count', value: `${signals.blog_post_count} posts detected` };
      }
      return null;
    }
    case 'EN-2': {
      if (signals.has_enablement_platform) {
        return { name: 'enablement platform', value: 'Enablement platform detected' };
      }
      return null;
    }
    case 'EN-3': {
      if (signals.has_conversation_intelligence) {
        return { name: 'conversation intelligence', value: 'Conversation intelligence tool detected' };
      }
      return null;
    }
    case 'EN-5': {
      const count = signals.knowledge_article_count || 0;
      if (count > 0) {
        return { name: 'knowledge articles', value: `${count} knowledge articles found` };
      }
      return null;
    }
    default:
      return null;
  }
}

// ── Main Grader ──

/**
 * Grade the Enablement pillar (EN-1 through EN-5).
 *
 * @param {Object} signals         - CRM computed signals
 * @param {Object} intakeAnswers   - Intake form answers
 * @param {Object} transcriptScores - Map of { [competencyId_department]: { score, confidence, evidence } }
 * @param {Object} consultantScores - Map of { [competencyId_department]: { score, notes } }
 * @returns {Array} Array of competency grade objects
 */
export function gradeEnablement(signals, intakeAnswers, transcriptScores, consultantScores) {
  return ENABLEMENT_COMPETENCIES.map((competency) => {
    const departments = {};
    const gradeSignals = [];

    // Compute API base score once for this competency (same for all departments)
    const apiBase = competency.apiScore(signals);

    // Record API signal if present
    if (apiBase !== null) {
      const apiDesc = describeApiSignal(competency.id, signals);
      if (apiDesc) {
        gradeSignals.push({
          name: apiDesc.name,
          value: apiDesc.value,
          impact: deriveImpact(apiBase),
          source: 'api',
        });
      }
    }

    for (const dept of competency.departments) {
      const key = scoreKey(competency.id, dept);
      const transcript = transcriptScores[key] || null;
      const consultant = consultantScores[key] || null;

      // Resolve score: consultant > transcript > API base
      let score = apiBase;

      if (transcript) {
        score = transcript.score;
        gradeSignals.push({
          name: `${dept} (transcript)`,
          value: transcript.evidence || `Score: ${score}`,
          impact: deriveImpact(score),
          source: 'transcript',
        });
      }

      if (consultant) {
        score = consultant.score;
        gradeSignals.push({
          name: `${dept} (consultant)`,
          value: consultant.notes || `Score: ${score}`,
          impact: deriveImpact(score),
          source: 'consultant',
        });
      }

      departments[dept] = score;
    }

    return {
      id: competency.id,
      name: competency.name,
      pillar: 'enablement',
      departments,
      source: competency.source,
      signals: gradeSignals,
      serviceIds: competency.serviceIds,
    };
  });
}
