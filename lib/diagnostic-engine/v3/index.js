/**
 * Diagnostic Engine v3 — Main Export
 *
 * Pure function: (intakeAnswers, computedSignals, transcriptAssessments,
 *                 consultantAssessments, crmType) → DiagnosticResultV3
 *
 * Orchestrates: grade 6 pillars → compute scores → generate roadmap
 */

import { gradePlanning } from './graders/grade-planning';
import { gradePeople } from './graders/grade-people';
import { gradeProcess } from './graders/grade-process';
import { gradeSystems } from './graders/grade-systems';
import { gradeReporting } from './graders/grade-reporting';
import { gradeEnablement } from './graders/grade-enablement';
import { computeScoresV3 } from './compute-scores-v3';
import { generateRoadmap } from './generate-roadmap';
import { collectActionableServiceIdsV3, validateV3ServiceIds } from './service-mapping-v3';
import { PILLAR_ORDER, DEPARTMENTS, V3_COMPETENCIES, expandDepartments } from './constants-v3';
import { transformIntakeForV3 } from './transform-intake';

/**
 * Run the full v3 diagnostic engine.
 *
 * @param {object} intakeAnswers - Answers from the intake form
 * @param {object} computedSignals - Pre-extracted signals from CRM metadata (or {})
 * @param {object} transcriptAssessments - Map of { competencyId_dept: { score, confidence, evidence } }
 * @param {object} consultantAssessments - Map of { competencyId_dept: { score, notes } }
 * @param {string} crmType - 'salesforce', 'hubspot', or 'unknown'
 * @returns {object} DiagnosticResultV3
 */
export function runDiagnosticV3(
  intakeAnswers = {},
  computedSignals = {},
  transcriptAssessments = {},
  consultantAssessments = {},
  crmType = 'unknown'
) {
  const signals = computedSignals || {};
  const transcript = transcriptAssessments || {};
  const consultant = consultantAssessments || {};

  // Transform raw intake keys to semantic grader keys
  intakeAnswers = transformIntakeForV3(intakeAnswers);

  // Grade each pillar
  const planningItems = gradePlanning(signals, intakeAnswers, transcript, consultant);
  const peopleItems = gradePeople(signals, intakeAnswers, transcript, consultant);
  const processItems = gradeProcess(signals, intakeAnswers, transcript, consultant);
  const systemsItems = gradeSystems(signals, intakeAnswers, transcript, consultant);
  const reportingItems = gradeReporting(signals, intakeAnswers, transcript, consultant);
  const enablementItems = gradeEnablement(signals, intakeAnswers, transcript, consultant);

  // Combine all competency results
  const allCompetencies = [
    ...planningItems,
    ...peopleItems,
    ...processItems,
    ...systemsItems,
    ...reportingItems,
    ...enablementItems,
  ];

  // Compute aggregate scores
  const {
    scoreCard,
    pillarScores,
    departmentScores,
    overall,
    overallLabel,
    dataCoverage,
  } = computeScoresV3(allCompetencies);

  // Generate prioritized roadmap
  const roadmap = generateRoadmap(allCompetencies);

  // Collect actionable service IDs
  const actionableServices = collectActionableServiceIdsV3(allCompetencies);

  // Build company profile from intake
  const companyProfile = {
    crm: intakeAnswers.A1 || crmType || 'unknown',
    repCount: intakeAnswers.A2 || 'unknown',
    arrRange: intakeAnswers.A3 || 'unknown',
    gtmMotion: intakeAnswers.A4 || 'unknown',
    hasPartners: intakeAnswers.A5 !== 'No',
  };

  return {
    version: 3,
    crmType,
    company_profile: companyProfile,
    competencies: allCompetencies,
    score_card: scoreCard,
    pillar_scores: pillarScores,
    department_scores: departmentScores,
    overall_score: overall,
    overall_label: overallLabel,
    roadmap,
    actionable_services: actionableServices,
    data_coverage: dataCoverage,
    metadata: {
      generatedAt: new Date().toISOString(),
      apiDataAvailable: Object.keys(signals).length > 0,
      intakeCompleted: Object.keys(intakeAnswers).length > 0,
      transcriptCount: Object.keys(transcript).length,
      consultantCount: Object.keys(consultant).length,
      competencyCount: allCompetencies.length,
      signalCount: Object.keys(signals).length,
    },
  };
}

/**
 * Recompute scores and roadmap from existing competency results.
 * Used when admin overrides individual cell scores.
 *
 * @param {Array} competencies - Previously graded competencies with updated scores
 * @returns {object} Updated scores and roadmap
 */
export function recomputeV3(competencies) {
  const { scoreCard, pillarScores, departmentScores, overall, overallLabel, dataCoverage } =
    computeScoresV3(competencies);
  const roadmap = generateRoadmap(competencies);
  const actionableServices = collectActionableServiceIdsV3(competencies);

  return {
    score_card: scoreCard,
    pillar_scores: pillarScores,
    department_scores: departmentScores,
    overall_score: overall,
    overall_label: overallLabel,
    roadmap,
    actionable_services: actionableServices,
    data_coverage: dataCoverage,
  };
}
