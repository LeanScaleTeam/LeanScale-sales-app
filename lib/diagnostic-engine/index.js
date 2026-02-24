/**
 * Diagnostic Engine v2 — Main Export
 *
 * Pure function: (intakeAnswers, computedSignals) → DiagnosticResult
 *
 * Orchestrates: grade foundation → grade motions → grade maturity →
 * compute scores → generate recommendations → map services.
 */

import { gradeFoundation } from './grade-foundation';
import { gradeMotions } from './grade-motions';
import { gradeMaturity } from './grade-maturity';
import { computeScores } from './compute-scores';
import { attachRecommendations } from './generate-recommendations';
import { collectActionableServiceIds } from './service-mapping';

/**
 * Run the full diagnostic engine.
 *
 * @param {object} intakeAnswers - Answers from the intake form (keyed by question ID)
 * @param {object} computedSignals - Pre-extracted signals from HubSpot metadata (or null)
 * @returns {object} DiagnosticResult
 */
export function runDiagnostic(intakeAnswers = {}, computedSignals = {}) {
  const signals = computedSignals || {};

  // Grade each layer
  const foundationItems = gradeFoundation(signals);
  const motionItems = gradeMotions(signals, intakeAnswers);
  const maturityItems = gradeMaturity(signals, intakeAnswers);

  // Combine all items
  const items = [...foundationItems, ...motionItems, ...maturityItems];

  // Attach recommendations based on status
  attachRecommendations(items);

  // Compute composite scores
  const scores = computeScores(items);

  // Build company profile from intake
  const companyProfile = {
    crm: intakeAnswers.A1 || 'unknown',
    repCount: intakeAnswers.A2 || 'unknown',
    arrRange: intakeAnswers.A3 || 'unknown',
    gtmMotion: intakeAnswers.A4 || 'unknown',
    hasPartners: intakeAnswers.A5 !== 'No',
  };

  // Collect actionable service IDs
  const actionableServices = collectActionableServiceIds(items);

  return {
    version: 2,
    company_profile: companyProfile,
    items,
    scores,
    actionable_services: actionableServices,
    metadata: {
      generatedAt: new Date().toISOString(),
      apiDataAvailable: Object.keys(signals).length > 0,
      intakeCompleted: Object.keys(intakeAnswers).length > 0,
      itemCount: items.length,
      signalCount: Object.keys(signals).length,
    },
  };
}
