/**
 * Recommendation Generator
 *
 * Generates status-driven recommendation text for each diagnostic item.
 * Recommendations are shown to the customer as actionable next steps.
 */

const RECOMMENDATIONS = {
  F1: {
    warning: [
      'Audit and customize deal properties to capture critical sales data (amount, close date, source, competitors).',
      'Add ticket custom properties to track support categories and outcomes.',
      'Evaluate data enrichment tools (Clay, ZoomInfo, Clearbit) to automate contact/company data quality.',
    ],
    careful: [
      'Review deal properties for completeness — ensure close reasons, competitors, and contract values are captured.',
      'Consider extending enrichment coverage to company records, not just contacts.',
    ],
    healthy: [
      'Maintain data model hygiene with periodic property audits.',
    ],
  },
  F2: {
    warning: [
      'Redesign deal pipeline with 5-8 stages reflecting your actual sales process.',
      'Set stage probabilities to ascending values reflecting realistic win likelihood.',
      'Add a stalled/parking lot stage for pipeline hygiene.',
    ],
    careful: [
      'Review stage probabilities to ensure they reflect historical conversion rates.',
      'Consider adding a stalled/parking lot stage if pipeline hygiene is a concern.',
    ],
    healthy: [
      'Pipeline structure is solid. Monitor for stage bloat as processes evolve.',
    ],
  },
  F3: {
    warning: [
      'Build lifecycle automation covering Lead → MQL → SQL → Opportunity → Customer transitions.',
      'Create lead status workflows covering New, Attempted, Qualified, Nurture, and Unqualified.',
      'Add company-to-contact lifecycle sync to maintain data consistency.',
    ],
    careful: [
      'Extend lifecycle coverage to all 5 stages if not fully automated.',
      'Add cross-object sync between company and contact lifecycle stages.',
    ],
    healthy: [
      'Lifecycle automation is comprehensive. Review quarterly to ensure coverage matches process changes.',
    ],
  },
  F4: {
    warning: [
      'Build foundational automations: task creation, notification, lifecycle transitions, and data sync.',
      'Start with high-impact workflows: new lead notification, stalled deal alerts, and lifecycle updates.',
    ],
    careful: [
      'Expand automation coverage to include task creation and deal creation workflows.',
      'Add notification workflows for key events (deal stage changes, lead assignment).',
    ],
    healthy: [
      'Automation engine is well-developed. Consider adding deal creation automation if not present.',
    ],
  },
  F5: {
    warning: [
      'Define teams in HubSpot (Sales, Marketing, CS at minimum) and assign all owners.',
      'Clean up orphan owners — every active user should belong to a team.',
    ],
    careful: [
      'Ensure all owners are assigned to teams for accurate reporting and routing.',
      'Add functional teams (Marketing, CS) if only Sales team exists.',
    ],
    healthy: [
      'Team structure is well-defined. Review quarterly as org changes occur.',
    ],
  },
  F6: {
    warning: [
      'Implement a data enrichment tool (Clay, ZoomInfo, Clearbit) to automate lead and company enrichment.',
      'Focus enrichment on both contacts and companies for complete coverage.',
    ],
    careful: [
      'Extend enrichment to company records if currently contacts-only.',
      'Build automated enrichment workflows to run on new record creation.',
    ],
    healthy: [
      'Enrichment coverage is strong. Monitor field quality and freshness.',
    ],
  },
  M1: {
    warning: [
      'Set up lead capture forms on your website integrated with your CRM.',
      'Build automated lead routing to ensure fast response times.',
      'Define MQL criteria and implement lead scoring.',
    ],
    careful: [
      'Optimize lead routing for speed-to-lead under 5 minutes.',
      'Formalize your MQL definition with scoring or explicit criteria.',
    ],
    healthy: [
      'Inbound lead flow is well-configured. Monitor conversion rates and response times.',
    ],
  },
  M2: {
    warning: [
      'Build email nurture campaigns in your CRM/marketing platform.',
      'Create dynamic lists for targeted segmentation.',
      'Publish marketing emails — drafts don\'t generate pipeline.',
    ],
    careful: [
      'Expand nurture programs to cover multiple segments and lifecycle stages.',
      'Increase dynamic list usage for behavioral and firmographic targeting.',
    ],
    healthy: [
      'Marketing email operations are strong. Optimize for engagement rates.',
    ],
  },
  M3: {
    warning: [
      'Implement a sales qualification methodology (MEDDIC, BANT, or custom).',
      'Add required fields on deal stages to enforce data quality.',
      'Build stalled deal notification workflows.',
    ],
    careful: [
      'Enforce required fields on all deal stage transitions.',
      'Add task automation for sales follow-up activities.',
    ],
    healthy: [
      'Sales execution processes are solid. Monitor adoption and compliance.',
    ],
  },
  M4: {
    warning: [
      'Implement source tracking on deals to differentiate marketing vs sales pipeline.',
      'Build attribution workflows to capture first-touch and last-touch data.',
    ],
    careful: [
      'Consider multi-touch attribution for more accurate marketing impact measurement.',
      'Ensure all deal sources are consistently tracked.',
    ],
    healthy: [
      'Attribution tracking is comprehensive. Review model accuracy quarterly.',
    ],
  },
  M5: {
    warning: [
      'Add competitor tracking and closed-lost reason properties to deals.',
      'Build closed-won automation for CS handoff and customer lifecycle updates.',
    ],
    careful: [
      'Ensure closed-lost reasons are a required field, not optional.',
      'Add automation for post-close activities (CS handoff, welcome sequences).',
    ],
    healthy: [
      'Deal-to-close process is well-instrumented. Monitor close rate trends.',
    ],
  },
  M6: {
    warning: [
      'Build a formal sales-to-CS handoff process with automated triggers.',
      'Implement customer onboarding workflows in your CRM.',
      'Start tracking renewals systematically.',
    ],
    careful: [
      'Automate the handoff process if currently manual.',
      'Implement NPS/CSAT collection for customer health visibility.',
    ],
    healthy: [
      'Customer success operations are well-established. Monitor health scores and retention.',
    ],
  },
  M7: {
    warning: [
      'Create a dedicated partner/referral pipeline for deal tracking.',
      'Build referral workflows for automated partner communication.',
    ],
    careful: [
      'Formalize partner deal tracking with a separate pipeline or robust field system.',
    ],
    healthy: [
      'Partner operations are well-structured. Monitor partner-sourced pipeline.',
    ],
  },
  R1: {
    warning: [
      'Build custom dashboards in your CRM for executive visibility.',
      'Create a standard reporting package reviewed in leadership meetings.',
    ],
    careful: [
      'Increase dashboard trust by validating data accuracy and training executives.',
    ],
    healthy: [
      'Executive reporting is well-adopted. Ensure dashboards stay current.',
    ],
  },
  R2: {
    warning: [
      'Prioritize building automated reporting for your top 3 revenue metrics.',
      'Start with pipeline, bookings, and conversion rates as highest-impact metrics.',
    ],
    careful: [
      'Automate manual metric calculations to reduce reporting burden.',
    ],
    healthy: [
      'Revenue metrics reporting is comprehensive. Focus on insight generation.',
    ],
  },
  R3: {
    warning: [
      'Implement a forecasting methodology (even spreadsheet-based) as a starting point.',
      'Set quotas and targets to enable performance measurement.',
    ],
    careful: [
      'Migrate forecasting to your CRM forecast tool for better accuracy and visibility.',
      'Build a comprehensive growth model tying quotas to capacity.',
    ],
    healthy: [
      'Forecasting and planning are mature. Focus on forecast accuracy improvement.',
    ],
  },
  R4: {
    warning: [
      'Add competitor tracking as a required field on deals.',
      'Require closed-lost reasons to build a win/loss analysis dataset.',
      'Start conducting formal win/loss reviews.',
    ],
    careful: [
      'Formalize win/loss analysis into a regular cadence.',
      'Ensure competitor data is captured consistently across all deals.',
    ],
    healthy: [
      'Competitive intelligence processes are strong. Share insights across teams.',
    ],
  },
};

/**
 * Generate recommendations for a single diagnostic item.
 * @param {string} itemId - e.g. 'F1', 'M3'
 * @param {string} status - 'healthy', 'careful', 'warning'
 * @returns {string[]} Array of recommendation strings
 */
export function getRecommendations(itemId, status) {
  if (status === 'unable') return [];
  return RECOMMENDATIONS[itemId]?.[status] || [];
}

/**
 * Attach recommendations to all items in-place.
 * @param {Array} items - DiagnosticItem[]
 * @returns {Array} Same items with recommendations populated
 */
export function attachRecommendations(items) {
  for (const item of items) {
    item.recommendations = getRecommendations(item.id, item.status);
  }
  return items;
}
