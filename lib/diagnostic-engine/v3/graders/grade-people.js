/**
 * People Pillar Grader (PE-1 through PE-6)
 *
 * People is primarily scored from consultant assessments and discovery
 * transcripts, except PE-6 (Org structure clarity) which uses CRM API
 * signals as a base score with transcript/consultant overlay.
 *
 * Score resolution order:
 *   1. Consultant score (always wins if present)
 *   2. Transcript score
 *   3. API base score (PE-6 only)
 *   4. null (no data)
 */

import { V3_SOURCE_TYPES } from '../constants-v3';

// ── People Competency Definitions ──

const PEOPLE_COMPETENCIES = [
  {
    id: 'PE-1',
    name: 'Documented job descriptions',
    departments: ['marketing', 'sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.CONSULTANT_ONLY,
    serviceIds: ['gtm-org-chart-roles-and-hiring-plan'],
  },
  {
    id: 'PE-2',
    name: 'Structured interview process',
    departments: ['marketing', 'sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.CONSULTANT_ONLY,
    serviceIds: ['gtm-org-chart-roles-and-hiring-plan'],
  },
  {
    id: 'PE-3',
    name: 'Onboarding plan (30/60/90)',
    departments: ['marketing', 'sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.TRANSCRIPT,
    serviceIds: ['gtm-org-chart-roles-and-hiring-plan'],
  },
  {
    id: 'PE-4',
    name: 'Comp plan / commission structure',
    departments: ['sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.TRANSCRIPT_CONSULTANT,
    serviceIds: ['commission-plan-design-and-implementation'],
  },
  {
    id: 'PE-5',
    name: 'Performance review cadence',
    departments: ['marketing', 'sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.CONSULTANT_ONLY,
    serviceIds: ['gtm-org-chart-roles-and-hiring-plan'],
  },
  {
    id: 'PE-6',
    name: 'Org structure clarity',
    departments: ['marketing', 'sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['gtm-org-chart-roles-and-hiring-plan'],
  },
];

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
 * Compute PE-6 API base score from CRM team/role signals.
 *
 * Returns a 1-5 score or null if no meaningful API data is present.
 *
 * Thresholds:
 *   team_count >= 3 && owner_to_team_coverage >= 90 → 5
 *   team_count >= 3 && owner_to_team_coverage >= 50 → 4
 *   team_count >= 1                                  → 3
 *   total_owners > 0                                 → 2
 *   else                                             → 1
 *
 * Returns null when there is no usable API data (all fields undefined or missing).
 */
function computeOrgStructureScore(signals) {
  const teamCount = signals.team_count;
  const coverage = signals.owner_to_team_coverage;
  const totalOwners = signals.total_owners;

  // If none of the relevant fields are present, we have no API data
  if (teamCount === undefined && coverage === undefined && totalOwners === undefined) {
    return null;
  }

  const tc = teamCount || 0;
  const cov = coverage || 0;
  const owners = totalOwners || 0;

  if (tc >= 3 && cov >= 90) return 5;
  if (tc >= 3 && cov >= 50) return 4;
  if (tc >= 1) return 3;
  if (owners > 0) return 2;
  return 1;
}

// ── Main Grader ──

/**
 * Grade the People pillar (PE-1 through PE-6).
 *
 * @param {Object} signals          - CRM computed signals (used for PE-6 org structure)
 * @param {Object} intakeAnswers    - Intake form answers (unused for people pillar)
 * @param {Object} transcriptScores - Map of { [competencyId_department]: { score, confidence, evidence } }
 * @param {Object} consultantScores - Map of { [competencyId_department]: { score, notes } }
 * @returns {Array} Array of competency grade objects
 */
export function gradePeople(signals, intakeAnswers, transcriptScores, consultantScores) {
  // Pre-compute PE-6 API base score once
  const orgStructureBase = computeOrgStructureScore(signals);

  return PEOPLE_COMPETENCIES.map((competency) => {
    const departments = {};
    const gradeSignals = [];

    // For PE-6, add an API signal if we have data
    const isApiPlus = competency.source === V3_SOURCE_TYPES.API_PLUS;
    if (isApiPlus && orgStructureBase !== null) {
      gradeSignals.push({
        name: 'Org structure (CRM)',
        value: `Teams: ${signals.team_count || 0}, Coverage: ${signals.owner_to_team_coverage || 0}%, Owners: ${signals.total_owners || 0}`,
        impact: deriveImpact(orgStructureBase),
        source: 'api',
      });
    }

    for (const dept of competency.departments) {
      const key = scoreKey(competency.id, dept);
      const transcript = transcriptScores[key] || null;
      const consultant = consultantScores[key] || null;

      // Resolve score: consultant > transcript > API base (PE-6 only) > null
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
      } else if (isApiPlus && orgStructureBase !== null) {
        score = orgStructureBase;
      }

      departments[dept] = score;
    }

    return {
      id: competency.id,
      name: competency.name,
      pillar: 'people',
      departments,
      source: competency.source,
      signals: gradeSignals,
      serviceIds: competency.serviceIds,
    };
  });
}
