/**
 * Diagnostic Engine v2 — Main Export
 *
 * Pure function: (intakeAnswers, computedSignals) → DiagnosticResult
 *
 * Orchestrates: grade foundation → grade motions → grade maturity →
 * compute scores → generate recommendations → map services.
 *
 * Multi-CRM support: the 3rd argument can be either a legacy `crmType` string
 * (e.g. 'salesforce', 'hubspot', 'attio', 'dual') OR a `crm_systems` array
 * (e.g. ['attio', 'hubspot_map']). The engine derives the right grader routing
 * from whichever is provided, falling back to intake answer A1.
 */

import { gradeFoundation } from './grade-foundation';
import { gradeMotions } from './grade-motions';
import { gradeMaturity } from './grade-maturity';
import { computeScores } from './compute-scores';
import { attachRecommendations } from './generate-recommendations';
import { collectActionableServiceIds } from './service-mapping';
import {
  SYSTEM_KEYS,
  normalizeCrmSystems,
  deriveLegacyCrmType,
} from './crm-systems';

/**
 * Run the full diagnostic engine.
 *
 * @param {object} intakeAnswers
 * @param {object} computedSignals
 * @param {string|string[]|null} crmTypeOrSystems - legacy string, array of system keys, or null
 * @returns {object} DiagnosticResult
 */
export function runDiagnostic(intakeAnswers = {}, computedSignals = {}, crmTypeOrSystems = null) {
  const signals = computedSignals || {};

  // Resolve crm_systems[] from whichever input shape the caller provided.
  // Priority: explicit arg > intake A1 > 'unknown'.
  let crmSystems;
  if (Array.isArray(crmTypeOrSystems)) {
    crmSystems = normalizeCrmSystems(crmTypeOrSystems);
  } else if (typeof crmTypeOrSystems === 'string' && crmTypeOrSystems) {
    crmSystems = normalizeCrmSystems(crmTypeOrSystems);
  } else {
    crmSystems = normalizeCrmSystems(intakeAnswers.A1);
  }

  const legacyCrmType = deriveLegacyCrmType(crmSystems);

  const hasSalesforce = crmSystems.includes(SYSTEM_KEYS.SALESFORCE);
  const hasAttio = crmSystems.includes(SYSTEM_KEYS.ATTIO);

  // Grade each layer
  const foundationItems = gradeFoundation(signals);
  const motionItems = gradeMotions(signals, intakeAnswers);
  const maturityItems = gradeMaturity(signals, intakeAnswers);

  // Salesforce-only: Platform Health layer (still requires SF to be the
  // primary CRM, i.e. no Attio also selected for the CRM role).
  let platformHealthItems = [];
  if (hasSalesforce) {
    const { gradePlatformHealth } = require('./graders/platform-health');
    platformHealthItems = gradePlatformHealth(signals);
  }

  // Attio: replace F4 (workflow-based) with the Attio automation grader
  // that uses webhooks + actor-share + AI attrs + intake supplement.
  let adjustedFoundationItems = foundationItems;
  if (hasAttio) {
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

  // Compute composite scores. computeScores still takes the legacy single string
  // (it uses it only to decide whether to include platformHealth in the weight model).
  const scores = computeScores(items, legacyCrmType);

  // Build company profile from intake
  const companyProfile = {
    crm: intakeAnswers.A1 || 'unknown',
    crmSystems,
    repCount: intakeAnswers.A2 || 'unknown',
    arrRange: intakeAnswers.A3 || 'unknown',
    gtmMotion: intakeAnswers.A4 || 'unknown',
    hasPartners: intakeAnswers.A5 !== 'No',
  };

  // Collect actionable service IDs
  const actionableServices = collectActionableServiceIds(items);

  return {
    version: 2,
    crmType: legacyCrmType, // legacy string for back-compat
    crmSystems,             // canonical array
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
