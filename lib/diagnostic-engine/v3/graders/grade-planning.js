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

// ── Intake Scorers ──

/**
 * PL-1: Operating plan with quarterly goals
 * Intake source: operating_plan (from C13)
 */
function scorePL1Intake(intakeAnswers) {
  const plan = intakeAnswers.operating_plan;
  if (!plan) return null;

  const SCORES = { quarterly: 5, annual: 4, informal: 2, none: 1 };
  return SCORES[plan] ?? null;
}

/**
 * PL-2: Capacity plan / headcount model
 * Intake source: capacity_plan (from C14)
 */
function scorePL2Intake(intakeAnswers) {
  const plan = intakeAnswers.capacity_plan;
  if (!plan) return null;

  const SCORES = { revenue_tied: 5, basic: 3, none: 1 };
  return SCORES[plan] ?? null;
}

/**
 * PL-5: Review cadence — Intake source: review_cadence (from C15)
 * Used as complement to API cadence detection.
 */
function scorePL5Intake(intakeAnswers) {
  const cadence = intakeAnswers.review_cadence;
  if (!cadence) return null;

  const SCORES = { full: 5, good: 4, monthly: 3, quarterly: 2, none: 1 };
  return SCORES[cadence] ?? null;
}

// ── Main Grader ──

/**
 * Grade the Planning pillar (PL-1 through PL-5).
 *
 * @param {Object} signals         - CRM computed signals (mostly unused for planning)
 * @param {Object} intakeAnswers   - Intake form answers (transformed)
 * @param {Object} transcriptScores - Map of { [competencyId_department]: { score, confidence, evidence } }
 * @param {Object} consultantScores - Map of { [competencyId_department]: { score, notes } }
 * @returns {Array} Array of competency grade objects
 */

/**
 * PL-4: OKR / KPI setting
 * Weak API signal: KPI-named dashboards suggest KPI tracking.
 * Capped at 2 from API (very weak proxy).
 */
function scorePL4(signals) {
  const execDash = signals.exec_dashboard_count || 0;
  const deptFolders = signals.department_report_folders || 0;

  if (execDash > 3 || deptFolders > 3) return 2;
  return null;
}

/**
 * PL-5: Review cadence (QBR, WBR)
 * API signal: recurring_review_event_count, cadence_types from Event queries.
 * Capped at 3 from API — transcript/consultant for 4+.
 */
function scorePL5(signals) {
  const cadence = signals.cadence_types;
  const eventCount = signals.recurring_review_event_count || 0;

  if (!cadence || eventCount === 0) return null;

  const levels = [cadence.daily > 0, cadence.weekly > 0, cadence.monthly > 0, cadence.quarterly > 0].filter(Boolean).length;

  if (levels >= 3) return 3; // Capped — need transcript for 4+
  if (levels >= 2) return 3;
  if (levels >= 1) return 2;
  return null;
}

export function gradePlanning(signals, intakeAnswers, transcriptScores, consultantScores) {
  return PLANNING_COMPETENCIES.map((competency) => {
    const departments = {};
    const gradeSignals = [];

    // Compute base scores from API + intake
    let apiBase = null;

    if (competency.id === 'PL-1') {
      apiBase = scorePL1Intake(intakeAnswers);
      if (apiBase !== null) {
        gradeSignals.push({
          name: 'operating_plan',
          value: `Operating plan: ${intakeAnswers.operating_plan}`,
          impact: deriveImpact(apiBase),
          source: 'intake',
        });
      }
    } else if (competency.id === 'PL-2') {
      apiBase = scorePL2Intake(intakeAnswers);
      if (apiBase !== null) {
        gradeSignals.push({
          name: 'capacity_plan',
          value: `Capacity plan: ${intakeAnswers.capacity_plan}`,
          impact: deriveImpact(apiBase),
          source: 'intake',
        });
      }
    } else if (competency.id === 'PL-4') {
      apiBase = scorePL4(signals);
      if (apiBase !== null) {
        gradeSignals.push({
          name: 'KPI dashboards',
          value: `${signals.exec_dashboard_count || 0} exec dashboards, ${signals.department_report_folders || 0} dept report folders`,
          impact: 'neutral',
          source: 'api',
        });
      }
    } else if (competency.id === 'PL-5') {
      // Intake score takes priority over weak API signal
      const intakePL5 = scorePL5Intake(intakeAnswers);
      apiBase = scorePL5(signals);

      if (intakePL5 !== null) {
        apiBase = intakePL5;
        gradeSignals.push({
          name: 'review_cadence',
          value: `Review cadence: ${intakeAnswers.review_cadence}`,
          impact: deriveImpact(intakePL5),
          source: 'intake',
        });
      } else if (apiBase !== null) {
        const cadence = signals.cadence_types || {};
        const parts = [];
        if (cadence.daily > 0) parts.push(`daily: ${cadence.daily}`);
        if (cadence.weekly > 0) parts.push(`weekly: ${cadence.weekly}`);
        if (cadence.monthly > 0) parts.push(`monthly: ${cadence.monthly}`);
        if (cadence.quarterly > 0) parts.push(`quarterly: ${cadence.quarterly}`);
        gradeSignals.push({
          name: 'Review cadence events',
          value: `${signals.recurring_review_event_count} recurring events (${parts.join(', ')})`,
          impact: deriveImpact(apiBase),
          source: 'api',
        });
      }
    }

    for (const dept of DEPARTMENTS) {
      const key = scoreKey(competency.id, dept);
      const transcript = transcriptScores[key] || null;
      const consultant = consultantScores[key] || null;

      // Resolve score: consultant > transcript > API base > null
      let score = apiBase;

      if (consultant) {
        score = consultant.score;
        gradeSignals.push({
          name: `${dept} (${consultant.assessed_by === "vasco-auto" ? "vasco" : "consultant"})`,
          value: consultant.notes || `Score: ${score}`,
          impact: deriveImpact(score),
          source: consultant.assessed_by === 'vasco-auto' ? 'vasco' : 'consultant',
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
