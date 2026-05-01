/**
 * Reporting Pillar Grader (RP-1 through RP-6)
 *
 * Mixed data sources: API signals, intake answers, transcript analysis,
 * and consultant assessments. Each competency is scored per-department
 * on the v3 5-point scale (1-5).
 *
 * Score resolution order:
 *   1. Consultant score (always wins if present)
 *   2. Transcript score (overlays API/intake base)
 *   3. API / Intake computed score
 *   4. null (no data)
 */

import { V3_SOURCE_TYPES } from '../constants-v3';

// ── Reporting Competency Definitions ──

const REPORTING_COMPETENCIES = [
  {
    id: 'RP-1',
    name: 'Executive dashboards',
    departments: ['marketing', 'sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['executive-reporting-suite'],
  },
  {
    id: 'RP-2',
    name: 'Manager dashboards',
    departments: ['marketing', 'sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.TRANSCRIPT_CONSULTANT,
    serviceIds: ['monthly-quarterly-gtm-reporting-pack'],
  },
  {
    id: 'RP-3',
    name: 'IC dashboards (daily use)',
    departments: ['marketing', 'sales', 'cs'],
    source: V3_SOURCE_TYPES.TRANSCRIPT_CONSULTANT,
    serviceIds: ['monthly-quarterly-gtm-reporting-pack'],
  },
  {
    id: 'RP-4',
    name: 'Cadence reporting (D/W/M/Q/A)',
    departments: ['marketing', 'sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.TRANSCRIPT,
    serviceIds: ['monthly-quarterly-gtm-reporting-pack'],
  },
  {
    id: 'RP-5',
    name: 'Revenue metrics (Power 10)',
    departments: ['sales'],
    source: V3_SOURCE_TYPES.INTAKE,
    serviceIds: ['arr-reporting', 'executive-reporting-suite'],
  },
  {
    id: 'RP-6',
    name: 'Forecasting methodology',
    departments: ['sales'],
    source: V3_SOURCE_TYPES.INTAKE,
    serviceIds: ['forecasting-process-implementation', 'growth-model'],
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
 * Clamp a numeric score to the 1-5 range.
 */
function clamp(score) {
  return Math.max(1, Math.min(5, score));
}

// ── Per-Competency Scoring Logic ──

/**
 * RP-1: Executive dashboards
 * API source: exec_dashboard_count (preferred) or dashboard_count/report_count (fallback)
 * Intake modifier: dashboard_trust (low = -1, high = +1)
 */
function scoreRP1(signals, intakeAnswers) {
  const execCount = signals.exec_dashboard_count ?? null;
  const totalCount = signals.dashboard_count ?? signals.report_count ?? null;

  if (execCount === null && totalCount === null) return null;

  let score;
  if (execCount !== null && execCount > 0) {
    // Exec-specific dashboards detected — more targeted scoring
    if (execCount > 5) score = 5;
    else if (execCount > 2) score = 4;
    else score = 3;
  } else if (totalCount !== null) {
    // Fall back to total dashboard/report count
    if (totalCount > 20) score = 5;
    else if (totalCount > 10) score = 4;
    else if (totalCount > 3) score = 3;
    else if (totalCount > 0) score = 2;
    else score = 1;
  }

  // Intake trust adjustment
  const trust = intakeAnswers.dashboard_trust;
  if (trust === 'low') score -= 1;
  else if (trust === 'high') score += 1;

  return clamp(score);
}

/**
 * RP-2: Manager dashboards
 * API source: manager_dashboard_count (naming pattern on dashboards)
 * Intake source: manager_dashboard_access (from C16)
 * Intake overrides weak API signal
 */
function scoreRP2(signals, intakeAnswers) {
  // Intake-driven score (stronger)
  const access = intakeAnswers.manager_dashboard_access;
  if (access === 'per_team') return 4;
  if (access === 'shared') return 3;
  if (access === 'none') return 1;

  // API fallback — capped at 4
  const count = signals.manager_dashboard_count ?? null;
  if (count === null || count === undefined || count === 0) return null;

  if (count > 5) return 4;
  if (count > 2) return 3;
  return 2;
}

/**
 * RP-3: IC dashboards (daily use)
 * API source: ic_dashboard_count (naming pattern on dashboards)
 * Intake source: ic_crm_usage (from C17)
 * Intake overrides weak API signal
 */
function scoreRP3(signals, intakeAnswers) {
  // Intake-driven score (stronger)
  const usage = intakeAnswers.ic_crm_usage;
  if (usage === 'daily_personalized') return 4;
  if (usage === 'daily_basic') return 3;
  if (usage === 'none') return 1;

  // API fallback — capped at 4
  const count = signals.ic_dashboard_count ?? null;
  if (count === null || count === undefined || count === 0) return null;

  if (count > 5) return 4;
  if (count > 2) return 3;
  return 2;
}

/**
 * RP-4: Cadence reporting
 * API source: report_schedule_count (CronTrigger), department_report_folders
 * Intake source: report_distribution (from D5)
 */
function scoreRP4(signals, intakeAnswers) {
  // Intake-driven score (stronger signal)
  const dist = intakeAnswers.report_distribution;
  if (dist === 'automated') return 5;
  if (dist === 'manual') return 3;
  if (dist === 'on_demand') return 2;
  if (dist === 'none') return 1;

  // API fallback
  const schedules = signals.report_schedule_count ?? null;
  const deptFolders = signals.department_report_folders || 0;

  // HubSpot fallback: use meeting-based cadence signals when SF-specific signals are absent
  const cadenceEvents = signals.recurring_review_event_count || 0;
  const cadenceTypes = signals.cadence_types || {};

  if ((schedules === null || schedules === undefined || schedules === 0) && deptFolders === 0) {
    // Try meeting-based cadence (HubSpot path)
    if (cadenceEvents > 0) {
      const levels = Object.values(cadenceTypes).filter(Boolean).length;
      if (levels >= 3) return 4;
      if (levels >= 2) return 3;
      return 2;
    }
    return null;
  }

  const count = (schedules || 0) + deptFolders;

  if (count > 10) return 4;
  if (count > 3) return 3;
  return 2;
}

/**
 * RP-5: Revenue metrics (Power 10)
 * Intake source: power10_metrics_count
 * v2 R2 logic
 */
function scoreRP5(intakeAnswers) {
  const count = intakeAnswers.power10_metrics_count;

  if (count === null || count === undefined) return null;

  if (count >= 10) return 5;
  if (count >= 7) return 4;
  if (count >= 4) return 3;
  if (count >= 1) return 2;
  return 1;
}

/**
 * RP-6: Forecasting methodology
 * Intake source: forecasting_methodology
 * API signal: has_forecasting_config (SF) adds +1 boost
 * v2 R3 logic
 */
function scoreRP6(signals, intakeAnswers) {
  const methodology = intakeAnswers.forecasting_methodology;

  if (!methodology) return null;

  const METHODOLOGY_SCORES = {
    structured_tool: 5,
    structured: 4,
    basic: 3,
    gut_feel: 2,
    none: 1,
  };

  let score = METHODOLOGY_SCORES[methodology] ?? null;
  if (score === null) return null;

  // SF forecasting config boost
  if (signals.has_forecasting_config) {
    score += 1;
  }

  return clamp(score);
}

// ── Main Grader ──

/**
 * Grade the Reporting pillar (RP-1 through RP-6).
 *
 * @param {Object} signals          - CRM computed signals (dashboard_count, report_count, report_schedule_count, has_forecasting_config)
 * @param {Object} intakeAnswers    - Intake form answers (dashboard_trust, power10_metrics_count, forecasting_methodology)
 * @param {Object} transcriptScores - Map of { [competencyId_department]: { score, confidence, evidence } }
 * @param {Object} consultantScores - Map of { [competencyId_department]: { score, notes } }
 * @returns {Array} Array of competency grade objects
 */
export function gradeReporting(signals, intakeAnswers, transcriptScores, consultantScores) {
  return REPORTING_COMPETENCIES.map((competency) => {
    const departments = {};
    const gradeSignals = [];

    // Compute the API/intake base score (same for all depts in a competency)
    let baseScore = null;

    if (competency.id === 'RP-1') {
      baseScore = scoreRP1(signals, intakeAnswers);
      if (baseScore !== null) {
        const execCount = signals.exec_dashboard_count ?? null;
        const totalCount = signals.dashboard_count ?? signals.report_count;
        if (execCount !== null && execCount > 0) {
          gradeSignals.push({
            name: 'exec_dashboard_count',
            value: `${execCount} executive dashboards detected`,
            impact: deriveImpact(baseScore),
            source: 'api',
          });
        }
        if (totalCount > 0) {
          gradeSignals.push({
            name: 'dashboard_count',
            value: `${totalCount} total dashboards/reports`,
            impact: deriveImpact(baseScore),
            source: 'api',
          });
        }
        if (intakeAnswers.dashboard_trust) {
          gradeSignals.push({
            name: 'dashboard_trust',
            value: `Trust level: ${intakeAnswers.dashboard_trust}`,
            impact: intakeAnswers.dashboard_trust === 'high' ? 'positive' : 'negative',
            source: 'intake',
          });
        }
      }
    } else if (competency.id === 'RP-2') {
      baseScore = scoreRP2(signals, intakeAnswers);
      if (baseScore !== null) {
        if (intakeAnswers.manager_dashboard_access) {
          gradeSignals.push({
            name: 'manager_dashboard_access',
            value: `Manager dashboards: ${intakeAnswers.manager_dashboard_access}`,
            impact: deriveImpact(baseScore),
            source: 'intake',
          });
        } else if (signals.manager_dashboard_count > 0) {
          gradeSignals.push({
            name: 'manager_dashboard_count',
            value: `${signals.manager_dashboard_count} manager dashboards detected`,
            impact: deriveImpact(baseScore),
            source: 'api',
          });
        }
      }
    } else if (competency.id === 'RP-3') {
      baseScore = scoreRP3(signals, intakeAnswers);
      if (baseScore !== null) {
        if (intakeAnswers.ic_crm_usage) {
          gradeSignals.push({
            name: 'ic_crm_usage',
            value: `IC CRM usage: ${intakeAnswers.ic_crm_usage}`,
            impact: deriveImpact(baseScore),
            source: 'intake',
          });
        } else if (signals.ic_dashboard_count > 0) {
          gradeSignals.push({
            name: 'ic_dashboard_count',
            value: `${signals.ic_dashboard_count} IC/personal dashboards detected`,
            impact: deriveImpact(baseScore),
            source: 'api',
          });
        }
      }
    } else if (competency.id === 'RP-4') {
      baseScore = scoreRP4(signals, intakeAnswers);
      if (baseScore !== null) {
        if (intakeAnswers.report_distribution) {
          gradeSignals.push({
            name: 'report_distribution',
            value: `Report distribution: ${intakeAnswers.report_distribution}`,
            impact: deriveImpact(baseScore),
            source: 'intake',
          });
        } else if (signals.report_schedule_count > 0) {
          gradeSignals.push({
            name: 'report_schedule_count',
            value: `${signals.report_schedule_count} scheduled reports detected`,
            impact: deriveImpact(baseScore),
            source: 'api',
          });
        }
      }
    } else if (competency.id === 'RP-5') {
      baseScore = scoreRP5(intakeAnswers);
      if (baseScore !== null) {
        gradeSignals.push({
          name: 'power10_metrics_count',
          value: `${intakeAnswers.power10_metrics_count} of 10 revenue metrics reported`,
          impact: deriveImpact(baseScore),
          source: 'intake',
        });
      }
    } else if (competency.id === 'RP-6') {
      baseScore = scoreRP6(signals, intakeAnswers);
      if (intakeAnswers.forecasting_methodology) {
        gradeSignals.push({
          name: 'forecasting_methodology',
          value: `Methodology: ${intakeAnswers.forecasting_methodology}`,
          impact: baseScore !== null ? deriveImpact(baseScore) : 'neutral',
          source: 'intake',
        });
      }
      if (signals.has_forecasting_config) {
        gradeSignals.push({
          name: 'has_forecasting_config',
          value: 'Forecasting configuration detected in CRM',
          impact: 'positive',
          source: 'api',
        });
      }
    }

    for (const dept of competency.departments) {
      const key = scoreKey(competency.id, dept);
      const transcript = transcriptScores[key] || null;
      const consultant = consultantScores[key] || null;

      // Resolve score: consultant > transcript > API/intake base > null
      let score = baseScore;

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
      pillar: 'reporting',
      departments,
      source: competency.source,
      signals: gradeSignals,
      serviceIds: competency.serviceIds,
    };
  });
}
