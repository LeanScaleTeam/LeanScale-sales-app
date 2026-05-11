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
 * @param {object} computedSignals - Pre-extracted signals from CRM metadata (or null)
 * @param {string|null} crmType - 'salesforce', 'hubspot', or null (auto-detect from A1)
 * @returns {object} DiagnosticResult
 */
export function runDiagnostic(intakeAnswers = {}, computedSignals = {}, crmType = null) {
  const signals = computedSignals || {};
  const detectedCrmType = crmType || intakeAnswers.A1?.toLowerCase() || 'unknown';

  // Grade each layer
  const foundationItems = gradeFoundation(signals);
  const motionItems = gradeMotions(signals, intakeAnswers);
  const maturityItems = gradeMaturity(signals, intakeAnswers);

  // Salesforce-only: Platform Health layer
  let platformHealthItems = [];
  if (detectedCrmType === 'salesforce') {
    const { gradePlatformHealth } = require('./graders/platform-health');
    platformHealthItems = gradePlatformHealth(signals);
  }

  // Attio: replace F4 (workflow-based) with the Attio automation grader
  // that uses webhooks + actor-share + AI attrs + intake supplement.
  let adjustedFoundationItems = foundationItems;
  if (detectedCrmType === 'attio') {
    const { gradeAutomationAttio } = require('./graders/automation-attio');
    const attioF4 = gradeAutomationAttio(signals, intakeAnswers);
    adjustedFoundationItems = foundationItems.map((item) =>
      item.id === 'F4' ? attioF4 : item
    );
  }

  // Combine all items
  const items = [...adjustedFoundationItems, ...motionItems, ...maturityItems, ...platformHealthItems];

  // Attach recommendations based on status
  attachRecommendations(items);

  // Compute composite scores
  const scores = computeScores(items, detectedCrmType);

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
    crmType: detectedCrmType,
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
