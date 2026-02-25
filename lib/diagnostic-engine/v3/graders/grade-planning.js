/**
 * Planning Pillar Grader (PL-1 through PL-5)
 *
 * Planning is primarily scored from transcript analysis and consultant
 * assessments rather than CRM API signals. Each competency is scored
 * per-department on the v3 5-point scale (1-5).
 *
 * Score resolution order:
 *   1. Consultant score (always wins if present)
 *   2. Transcript score
 *   3. null (no data)
 */

import { V3_SOURCE_TYPES } from '../constants-v3';

// ── Planning Competency Definitions ──

const PLANNING_COMPETENCIES = [
  {
    id: 'PL-1',
    name: 'Operating plan with quarterly goals',
    source: V3_SOURCE_TYPES.TRANSCRIPT,
    serviceIds: ['growth-model', 'monthly-quarterly-gtm-reporting-pack'],
  },
  {
    id: 'PL-2',
    name: 'Capacity plan / headcount model',
    source: V3_SOURCE_TYPES.TRANSCRIPT_CONSULTANT,
    serviceIds: ['quotas-and-target-setting', 'gtm-org-chart-roles-and-hiring-plan'],
  },
  {
    id: 'PL-3',
    name: 'Budget allocation process',
    source: V3_SOURCE_TYPES.CONSULTANT_ONLY,
    serviceIds: ['growth-model'],
  },
  {
    id: 'PL-4',
    name: 'OKR / KPI setting',
    source: V3_SOURCE_TYPES.TRANSCRIPT,
    serviceIds: ['executive-reporting-suite'],
  },
  {
    id: 'PL-5',
    name: 'Review cadence (QBR, WBR)',
    source: V3_SOURCE_TYPES.TRANSCRIPT,
    serviceIds: ['monthly-quarterly-gtm-reporting-pack'],
  },
];

const DEPARTMENTS = ['marketing', 'sales', 'cs', 'partners'];

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

// ── Main Grader ──

/**
 * Grade the Planning pillar (PL-1 through PL-5).
 *
 * @param {Object} signals         - CRM computed signals (mostly unused for planning)
 * @param {Object} intakeAnswers   - Intake form answers
 * @param {Object} transcriptScores - Map of { [competencyId_department]: { score, confidence, evidence } }
 * @param {Object} consultantScores - Map of { [competencyId_department]: { score, notes } }
 * @returns {Array} Array of competency grade objects
 */
export function gradePlanning(signals, intakeAnswers, transcriptScores, consultantScores) {
  return PLANNING_COMPETENCIES.map((competency) => {
    const departments = {};
    const gradeSignals = [];

    for (const dept of DEPARTMENTS) {
      const key = scoreKey(competency.id, dept);
      const transcript = transcriptScores[key] || null;
      const consultant = consultantScores[key] || null;

      // Resolve score: consultant overrides transcript
      let score = null;

      if (consultant) {
        score = consultant.score;
        gradeSignals.push({
          name: `${dept} (consultant)`,
          value: consultant.notes || `Score: ${score}`,
          impact: deriveImpact(score),
          source: 'consultant',
        });
      } else if (transcript) {
        score = transcript.score;
        gradeSignals.push({
          name: `${dept} (transcript)`,
          value: transcript.evidence || `Score: ${score}`,
          impact: deriveImpact(score),
          source: 'transcript',
        });
      }

      departments[dept] = score;
    }

    return {
      id: competency.id,
      name: competency.name,
      pillar: 'planning',
      departments,
      source: competency.source,
      signals: gradeSignals,
      serviceIds: competency.serviceIds,
    };
  });
}
