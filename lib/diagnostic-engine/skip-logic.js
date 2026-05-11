/**
 * Intake Skip Logic
 *
 * Determines which intake sections/questions to show or hide
 * based on company profile answers (Section A).
 */

/**
 * Get skip rules from profile answers.
 * @param {object} profileAnswers - Section A answers (A1-A5)
 * @returns {object} Skip rules controlling question visibility
 */
export function getSkipRules(profileAnswers = {}, crmMetadataExists = false) {
  const rules = {
    // CRM connection
    showHubSpotConnect: false,
    showSalesforceConnect: false,
    showAttioConnect: false,

    // Section skips
    skipPartnerQuestions: false,
    skipEnterpriseQuestions: false,
    skipOutboundQuestions: false,
    showPLGQuestions: false,

    // Show Attio-specific automation questions (since Workflows aren't API-readable)
    showAttioAutomationQuestions: false,

    // CRM-adaptive visibility (hides auto-detected questions)
    hasSalesforceSignals: false,
    hasHubSpotSignals: false,
    hasAttioSignals: false,

    // Question-level skips
    skipTerritoryDesign: false,
    skipCommissionTool: false,
    skipEnablementPlatform: false,
  };

  // A1: CRM type
  if (profileAnswers.A1 === 'HubSpot') {
    rules.showHubSpotConnect = true;
    if (crmMetadataExists) rules.hasHubSpotSignals = true;
  }
  if (profileAnswers.A1 === 'Salesforce') {
    rules.showSalesforceConnect = true;
    if (crmMetadataExists) rules.hasSalesforceSignals = true;
  }
  if (profileAnswers.A1 === 'Attio') {
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
 * @param {object} rules - Output from getSkipRules()
 * @returns {string[]} Section identifiers to show
 */
export function getActiveSections(rules) {
  const sections = ['A', 'B', 'C', 'D', 'E', 'F'];
  // All sections always show; skip logic controls individual questions within them
  return sections;
}

/**
 * Filter questions within a section based on skip rules.
 * @param {string} section - 'B', 'C', or 'D'
 * @param {Array} questions - Question definitions
 * @param {object} rules - Skip rules
 * @returns {Array} Filtered questions
 */
export function filterQuestions(section, questions, rules) {
  return questions.filter((q) => {
    // Skip partner questions if no partner program
    if (rules.skipPartnerQuestions && q.tags?.includes('partner')) return false;

    // Skip enterprise questions for small teams
    if (rules.skipEnterpriseQuestions && q.tags?.includes('enterprise')) return false;

    // Skip outbound questions for PLG
    if (rules.skipOutboundQuestions && q.tags?.includes('outbound')) return false;

    // CRM-adaptive: hide auto-detected questions for Salesforce customers
    // HubSpot detection is weaker, so these questions stay visible for HS
    if (q.hideWhenAutoDetected && (rules.hasSalesforceSignals || rules.hasHubSpotSignals)) return false;

    return true;
  });
}
