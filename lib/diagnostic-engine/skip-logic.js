/**
 * Intake Skip Logic
 *
 * Determines which intake sections/questions to show or hide based on Section A
 * answers. A1 is now a multi-select array of CRM systems — skip rules read from
 * crm_systems normalized via lib/diagnostic-engine/crm-systems.js.
 */

import { SYSTEM_KEYS, normalizeCrmSystems } from './crm-systems';

/**
 * Get skip rules from profile answers.
 * @param {object} profileAnswers - Section A answers (A1-A5). A1 may be array or legacy string.
 * @param {boolean} crmMetadataExists - True if at least one CRM is connected
 * @returns {object} Skip rules controlling question visibility
 */
export function getSkipRules(profileAnswers = {}, crmMetadataExists = false) {
  const crmSystems = normalizeCrmSystems(profileAnswers.A1);

  const rules = {
    // CRM connection prompts
    showHubSpotConnect: false,
    showSalesforceConnect: false,
    showAttioConnect: false,

    // Section skips
    skipPartnerQuestions: false,
    skipEnterpriseQuestions: false,
    skipOutboundQuestions: false,
    showPLGQuestions: false,

    // Attio automation supplement (workflows aren't API-exposed)
    showAttioAutomationQuestions: false,

    // CRM-adaptive visibility (hides questions covered by metadata)
    hasSalesforceSignals: false,
    hasHubSpotSignals: false,
    hasAttioSignals: false,

    // Question-level skips
    skipTerritoryDesign: false,
    skipCommissionTool: false,
    skipEnablementPlatform: false,

    // Expose the normalized array for downstream consumers
    crmSystems,
  };

  // Connect prompts per selected system
  const hasSalesforce = crmSystems.includes(SYSTEM_KEYS.SALESFORCE);
  const hasHubSpot =
    crmSystems.includes(SYSTEM_KEYS.HUBSPOT_CRM) ||
    crmSystems.includes(SYSTEM_KEYS.HUBSPOT_MAP);
  const hasAttio = crmSystems.includes(SYSTEM_KEYS.ATTIO);

  if (hasSalesforce) {
    rules.showSalesforceConnect = true;
    if (crmMetadataExists) rules.hasSalesforceSignals = true;
  }
  if (hasHubSpot) {
    rules.showHubSpotConnect = true;
    if (crmMetadataExists) rules.hasHubSpotSignals = true;
  }
  if (hasAttio) {
    rules.showAttioConnect = true;
    rules.showAttioAutomationQuestions = true;
    if (crmMetadataExists) rules.hasAttioSignals = true;
  }

  // A2: Rep count — small teams skip enterprise features
  if (profileAnswers.A2 === '1-5') {
    rules.skipEnterpriseQuestions = true;
    rules.skipTerritoryDesign = true;
    rules.skipCommissionTool = true;
    rules.skipEnablementPlatform = true;
  }

  // A4: GTM motion
  if (profileAnswers.A4 === 'Product-led') {
    rules.skipOutboundQuestions = true;
    rules.showPLGQuestions = true;
  }

  // A5: Partner program
  if (profileAnswers.A5 === 'No') {
    rules.skipPartnerQuestions = true;
  }

  return rules;
}

/**
 * Get the list of sections applicable based on skip rules.
 */
export function getActiveSections(/* rules */) {
  return ['A', 'B', 'C', 'D', 'E', 'F'];
}

/**
 * Filter questions within a section based on skip rules.
 * @param {string} section - 'B', 'C', or 'D'
 * @param {array} questions - Array of question objects
 * @param {object} rules - Output from getSkipRules()
 */
export function filterQuestions(section, questions, rules) {
  return questions.filter((q) => {
    if (q.requiresPartner && rules.skipPartnerQuestions) return false;
    if (q.requiresEnterprise && rules.skipEnterpriseQuestions) return false;
    if (q.requiresOutbound && rules.skipOutboundQuestions) return false;
    return true;
  });
}
