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
 * Check sales_content_count, content_type_diversity, marketing emails as signals.
 * Capped at 3 from API — transcript/consultant for 4+.
 */
function apiScoreEN1(signals) {
  const salesContent = signals.sales_content_count || 0;
  const diversity = signals.content_type_diversity || 0;
  const emailCount = signals.marketing_email_count || signals.blog_post_count || 0;

  if (salesContent > 10 && diversity >= 3) return 3;
  if (salesContent > 5) return 3;
  if (emailCount > 50) return 3;
  if (salesContent > 0 || emailCount > 20) return 2;
  return null;
}

/**
 * EN-2: Content accessible in single system
 * Check for enablement platform detection or enablement package.
 *   has_enablement_platform or has_enablement_package -> 4
 *   content_version_count > 20 (content in CRM) -> 3
 *   else -> null
 */
function apiScoreEN2(signals) {
  if (signals.has_enablement_platform || signals.has_enablement_package) return 4;
  if ((signals.content_version_count || 0) > 20) return 3;
  return null;
}

/**
 * EN-3: Sales coaching program
 * Check for conversation intelligence tool and coaching activity.
 *   has_conversation_intelligence + coaching -> 4
 *   has_conversation_intelligence -> 3
 *   coaching_activity_count > 0 -> 2
 *   else -> null
 */
function apiScoreEN3(signals) {
  const hasCI = signals.has_conversation_intelligence;
  const coaching = signals.coaching_activity_count || 0;

  if (hasCI && coaching > 0) return 4;
  if (hasCI) return 3;
  if (coaching > 0) return 2;
  return null;
}

/**
 * EN-5: Playbook documentation
 * Check knowledge_article_count, playbook_content_count.
 *   articles > 10 or playbook content > 5 -> 3
 *   any articles or playbook content > 0 -> 2
 *   else -> null
 */
function apiScoreEN5(signals) {
  const articles = signals.knowledge_article_count || 0;
  const playbooks = signals.playbook_content_count || 0;

  if (articles > 10 || playbooks > 5) return 3;
  if (articles > 0 || playbooks > 0) return 2;
  return null;
}

// ── Intake Scorers ──

/**
 * EN-3: Intake coaching program (from C18)
 * Overrides weak API signal when present.
 */
function intakeScoreEN3(intakeAnswers) {
  const program = intakeAnswers.coaching_program;
  if (!program) return null;

  const SCORES = { structured_ci: 5, informal: 3, none: 1 };
  return SCORES[program] ?? null;
}

/**
 * EN-5: Intake playbook status (from D6)
 * Overrides weak API signal when present.
 */
function intakeScoreEN5(intakeAnswers) {
  const status = intakeAnswers.playbook_status;
  if (!status) return null;

  const SCORES = { platform: 5, docs: 3, tribal: 2, none: 1 };
  return SCORES[status] ?? null;
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
      const salesContent = signals.sales_content_count || 0;
      if (salesContent > 0) {
        return { name: 'sales content', value: `${salesContent} sales content documents (case studies, battle cards, etc.)` };
      }
      if (signals.marketing_email_count > 0) {
        return { name: 'marketing email count', value: `${signals.marketing_email_count} emails detected` };
      }
      return null;
    }
    case 'EN-2': {
      if (signals.has_enablement_package) {
        return { name: 'enablement platform', value: 'Enablement platform detected (installed package)' };
      }
      if (signals.has_enablement_platform) {
        return { name: 'enablement platform', value: 'Enablement platform detected (content volume)' };
      }
      if ((signals.content_version_count || 0) > 20) {
        return { name: 'content in CRM', value: `${signals.content_version_count} documents stored in Salesforce` };
      }
      return null;
    }
    case 'EN-3': {
      const parts = [];
      if (signals.has_conversation_intelligence) parts.push('CI tool detected');
      if ((signals.coaching_activity_count || 0) > 0) parts.push(`${signals.coaching_activity_count} coaching activities`);
      if (parts.length > 0) {
        return { name: 'coaching program', value: parts.join(', ') };
      }
      return null;
    }
    case 'EN-5': {
      const articles = signals.knowledge_article_count || 0;
      const playbooks = signals.playbook_content_count || 0;
      const parts = [];
      if (articles > 0) parts.push(`${articles} knowledge articles`);
      if (playbooks > 0) parts.push(`${playbooks} playbook documents`);
      if (parts.length > 0) {
        return { name: 'playbook documentation', value: parts.join(', ') };
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
    let apiBase = competency.apiScore(signals);

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

    // Intake scores override weak API signals (EN-2, EN-3, EN-5)
    if (competency.id === 'EN-2' && intakeAnswers.has_enablement_tool_intake) {
      apiBase = Math.max(apiBase || 0, 4);
      gradeSignals.push({
        name: 'enablement_tool',
        value: 'Enablement platform reported in intake',
        impact: 'positive',
        source: 'intake',
      });
    }

    if (competency.id === 'EN-3') {
      const intakeEN3 = intakeScoreEN3(intakeAnswers);
      if (intakeEN3 !== null) {
        apiBase = intakeEN3;
        gradeSignals.push({
          name: 'coaching_program',
          value: `Coaching program: ${intakeAnswers.coaching_program}`,
          impact: deriveImpact(intakeEN3),
          source: 'intake',
        });
      }
    }

    if (competency.id === 'EN-5') {
      const intakeEN5 = intakeScoreEN5(intakeAnswers);
      if (intakeEN5 !== null) {
        apiBase = Math.max(apiBase || 0, intakeEN5);
        gradeSignals.push({
          name: 'playbook_status',
          value: `Playbooks: ${intakeAnswers.playbook_status}`,
          impact: deriveImpact(intakeEN5),
          source: 'intake',
        });
      }
    }

    for (const dept of competency.departments) {
      const key = scoreKey(competency.id, dept);
      const transcript = transcriptScores[key] || null;
      const consultant = consultantScores[key] || null;

      // Resolve score: consultant > transcript > API/intake base
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
          name: `${dept} (${consultant.assessed_by === "vasco-auto" ? "vasco" : "consultant"})`,
          value: consultant.notes || `Score: ${score}`,
          impact: deriveImpact(score),
          source: consultant.assessed_by === 'vasco-auto' ? 'vasco' : 'consultant',
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
