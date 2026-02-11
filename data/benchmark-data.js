/**
 * Benchmark Presets for Diagnostic Comparisons
 *
 * Each preset defines expected status for processes at different company stages.
 * Statuses: 'healthy' | 'careful' | 'warning' | 'unable' | 'na'
 *
 * Philosophy:
 * - Series A: Early stage, most things are manual or not yet built
 * - Series B: Building foundations, some processes formalized
 * - Series C+: Scaling, most processes should be in place
 * - Enterprise: Mature, nearly everything should be healthy
 */

// Status numeric values for comparison (higher = better)
export const STATUS_VALUES = {
  healthy: 4,
  careful: 3,
  warning: 2,
  unable: 1,
  na: 0,
};

export const STATUS_LABELS = {
  healthy: 'Healthy',
  careful: 'Careful',
  warning: 'Warning',
  unable: 'Unable to Report',
  na: 'N/A',
};

/**
 * Default weights per function for scoring.
 * Reps can override these per customer.
 */
export const DEFAULT_FUNCTION_WEIGHTS = {
  'Cross Functional': 1.0,
  'Marketing': 1.0,
  'Sales': 1.0,
  'Customer Success': 1.0,
  'Partnerships': 0.5,
};

/**
 * Generate benchmark expectations for a given preset.
 * Returns a map of processName -> expectedStatus
 */
function makeBenchmark(overrides, defaultStatus = 'unable') {
  // overrides is { processName: status }
  // Anything not listed defaults to defaultStatus
  return { defaultStatus, overrides };
}

export const benchmarkPresets = {
  'Series A': {
    id: 'series-a',
    label: 'Series A',
    description: 'Early-stage SaaS ($1-5M ARR). Focus on product-market fit, basic CRM hygiene.',
    defaultStatus: 'unable',
    overrides: {
      // Cross Functional
      'Activity Capture': 'warning',
      'CRM Deduplication': 'unable',
      'CRM Deduplication Ongoing Tool': 'unable',
      'Foundational Automations and Reporting Logic': 'warning',
      'GTM Lifecycle': 'unable',
      'Growth Model': 'unable',
      'ARR Reporting': 'warning',
      'Executive Reporting Suite': 'unable',
      'PLG GTM Design': 'unable',
      'GTM Diagnostic': 'unable',
      'Monthly/Quarterly GTM Reporting Pack': 'unable',
      'Revenue Recognition': 'unable',
      'GTM Org Chart & Hiring Plan': 'unable',
      'CRM-ERP Integration': 'unable',
      'Revenue Intelligence Platform Implementation': 'unable',
      'HubSpot to Salesforce CRM Migration': 'unable',
      'Salesforce to HubSpot CRM Migration': 'unable',
      'Fed/PubSec CRM Partitioning': 'unable',
      // Marketing
      'Automated Inbound Data Enrichment': 'warning',
      'Market Map': 'warning',
      'Lead & Opportunity Attribution': 'unable',
      'Lead Lifecycle (GTM Lifecycle)': 'warning',
      'Lead Routing': 'warning',
      'Marketing Automation Platform Implementation': 'careful',
      'Email Operations: Nurture Program Build & Management': 'warning',
      'Email Operations: Subscription & Compliance Framework': 'warning',
      'Email Operations: Templates & Build Process': 'warning',
      'Inbound Lead Journey Mapping': 'warning',
      'Website Lead Capture & Form Configuration': 'careful',
      'Speed-to-Lead': 'warning',
      'ABM / ABS Process and System': 'unable',
      'AI Automated Inbound': 'unable',
      'Event Operations: Event Platform Implementation': 'unable',
      'Event Operations: Lead List Intake Process': 'unable',
      'Lead Scoring Model Design (Product-Led)': 'unable',
      'Lead Scoring Model Design (Sales-Led)': 'unable',
      'Marketing Database Segmentation': 'unable',
      'Marketing Reporting Pack': 'unable',
      'Physical Event Process and ROI Reporting': 'unable',
      'Webinar Operations: Platform Implementation': 'unable',
      'Webinar Operations: Process Design': 'unable',
      // Sales
      'Forecasting Process Implementation': 'unable',
      'Lead Routing': 'warning',
      'Sales Lifecycle (GTM Lifecycle)': 'warning',
      'Sales Territory Design and System Implementation': 'unable',
      'Automated Outbound Process': 'unable',
      'CLM Implementation': 'unable',
      'Commission Tool Implementation': 'unable',
      'Conversation Intelligence Implementation': 'unable',
      'CPQ Implementation': 'unable',
      'E-Signature Implementation': 'careful',
      'Quote to Cash': 'warning',
      'Sales Engagement Platform Implementation': 'unable',
      'Sales Engagement Platform': 'unable',
      'Sales Qualification Methodology': 'warning',
      'Rules of Engagement Design': 'unable',
      'Quotas and Target Setting': 'unable',
      'Win/Loss Analysis': 'unable',
      'Commission Plan Design & Implementation': 'unable',
      'Revenue Intelligence Process': 'unable',
      'Opportunity Management UX Improvements': 'unable',
      'Sales Enablement Platform Implementation': 'unable',
      // Customer Success
      'Customer Lifecycle (GTM Lifecycle)': 'unable',
      'Customer Health Model': 'unable',
      'Customer Segmentation': 'unable',
      'Customer Success Platform Implementation': 'unable',
      'NPS and Voice of Customer Launch': 'unable',
      'Renewal Management': 'unable',
      'Renewal, Churn, NRR/GRR Reporting': 'unable',
      'Onboarding and Process Improvement': 'warning',
      'Sales to CS Handoff Process': 'unable',
      'Support System Implementation': 'warning',
      // Partnerships
      'Partnership Success Platform Implementation': 'unable',
      // Cross Functional
      'Marketing-to-Sales Handoff & SLA Tracking': 'unable',
    },
  },

  'Series B': {
    id: 'series-b',
    label: 'Series B',
    description: 'Growth stage SaaS ($5-20M ARR). Formalizing processes, building repeatable GTM.',
    defaultStatus: 'warning',
    overrides: {
      // Cross Functional
      'Activity Capture': 'careful',
      'CRM Deduplication': 'warning',
      'CRM Deduplication Ongoing Tool': 'warning',
      'Foundational Automations and Reporting Logic': 'careful',
      'GTM Lifecycle': 'careful',
      'Growth Model': 'warning',
      'ARR Reporting': 'careful',
      'Executive Reporting Suite': 'warning',
      'PLG GTM Design': 'warning',
      'GTM Diagnostic': 'careful',
      'Monthly/Quarterly GTM Reporting Pack': 'careful',
      'Revenue Recognition': 'warning',
      'GTM Org Chart & Hiring Plan': 'warning',
      'CRM-ERP Integration': 'unable',
      'Revenue Intelligence Platform Implementation': 'warning',
      'Marketing-to-Sales Handoff & SLA Tracking': 'careful',
      // Marketing
      'Automated Inbound Data Enrichment': 'careful',
      'Market Map': 'careful',
      'Lead & Opportunity Attribution': 'careful',
      'Lead Lifecycle (GTM Lifecycle)': 'careful',
      'Lead Routing': 'careful',
      'Marketing Automation Platform Implementation': 'healthy',
      'Email Operations: Nurture Program Build & Management': 'careful',
      'Email Operations: Subscription & Compliance Framework': 'careful',
      'Email Operations: Templates & Build Process': 'careful',
      'Inbound Lead Journey Mapping': 'careful',
      'Website Lead Capture & Form Configuration': 'healthy',
      'Speed-to-Lead': 'careful',
      'ABM / ABS Process and System': 'warning',
      'AI Automated Inbound': 'warning',
      'Event Operations: Event Platform Implementation': 'warning',
      'Event Operations: Lead List Intake Process': 'warning',
      'Lead Scoring Model Design (Product-Led)': 'warning',
      'Lead Scoring Model Design (Sales-Led)': 'warning',
      'Marketing Database Segmentation': 'careful',
      'Marketing Reporting Pack': 'careful',
      'Physical Event Process and ROI Reporting': 'warning',
      'Webinar Operations: Platform Implementation': 'warning',
      'Webinar Operations: Process Design': 'warning',
      // Sales
      'Forecasting Process Implementation': 'careful',
      'Sales Lifecycle (GTM Lifecycle)': 'careful',
      'Sales Territory Design and System Implementation': 'careful',
      'Automated Outbound Process': 'warning',
      'CLM Implementation': 'warning',
      'Commission Tool Implementation': 'warning',
      'Conversation Intelligence Implementation': 'warning',
      'CPQ Implementation': 'warning',
      'E-Signature Implementation': 'healthy',
      'Quote to Cash': 'careful',
      'Sales Engagement Platform Implementation': 'careful',
      'Sales Engagement Platform': 'careful',
      'Sales Qualification Methodology': 'careful',
      'Rules of Engagement Design': 'careful',
      'Quotas and Target Setting': 'warning',
      'Win/Loss Analysis': 'warning',
      'Commission Plan Design & Implementation': 'warning',
      'Revenue Intelligence Process': 'warning',
      'Opportunity Management UX Improvements': 'careful',
      'Sales Enablement Platform Implementation': 'warning',
      // Customer Success
      'Customer Lifecycle (GTM Lifecycle)': 'careful',
      'Customer Health Model': 'warning',
      'Customer Segmentation': 'careful',
      'Customer Success Platform Implementation': 'warning',
      'NPS and Voice of Customer Launch': 'warning',
      'Renewal Management': 'warning',
      'Renewal, Churn, NRR/GRR Reporting': 'careful',
      'Onboarding and Process Improvement': 'careful',
      'Sales to CS Handoff Process': 'careful',
      'Support System Implementation': 'careful',
      // Partnerships
      'Partnership Success Platform Implementation': 'warning',
    },
  },

  'Series C+': {
    id: 'series-c',
    label: 'Series C+',
    description: 'Scaling SaaS ($20-100M ARR). Optimizing efficiency, advanced analytics, full GTM stack.',
    defaultStatus: 'careful',
    overrides: {
      // Cross Functional
      'Activity Capture': 'healthy',
      'CRM Deduplication': 'careful',
      'CRM Deduplication Ongoing Tool': 'careful',
      'Foundational Automations and Reporting Logic': 'healthy',
      'GTM Lifecycle': 'healthy',
      'Growth Model': 'careful',
      'ARR Reporting': 'healthy',
      'Executive Reporting Suite': 'careful',
      'PLG GTM Design': 'careful',
      'GTM Diagnostic': 'healthy',
      'Monthly/Quarterly GTM Reporting Pack': 'healthy',
      'Revenue Recognition': 'careful',
      'GTM Org Chart & Hiring Plan': 'careful',
      'CRM-ERP Integration': 'warning',
      'Revenue Intelligence Platform Implementation': 'careful',
      'Marketing-to-Sales Handoff & SLA Tracking': 'healthy',
      // Marketing
      'Automated Inbound Data Enrichment': 'healthy',
      'Market Map': 'healthy',
      'Lead & Opportunity Attribution': 'healthy',
      'Lead Lifecycle (GTM Lifecycle)': 'healthy',
      'Lead Routing': 'healthy',
      'Marketing Automation Platform Implementation': 'healthy',
      'Email Operations: Nurture Program Build & Management': 'healthy',
      'Email Operations: Subscription & Compliance Framework': 'healthy',
      'Email Operations: Templates & Build Process': 'healthy',
      'Inbound Lead Journey Mapping': 'healthy',
      'Website Lead Capture & Form Configuration': 'healthy',
      'Speed-to-Lead': 'healthy',
      'ABM / ABS Process and System': 'careful',
      'AI Automated Inbound': 'careful',
      'Event Operations: Event Platform Implementation': 'careful',
      'Event Operations: Lead List Intake Process': 'careful',
      'Lead Scoring Model Design (Product-Led)': 'careful',
      'Lead Scoring Model Design (Sales-Led)': 'careful',
      'Marketing Database Segmentation': 'healthy',
      'Marketing Reporting Pack': 'healthy',
      'Physical Event Process and ROI Reporting': 'careful',
      'Webinar Operations: Platform Implementation': 'careful',
      'Webinar Operations: Process Design': 'careful',
      // Sales
      'Forecasting Process Implementation': 'healthy',
      'Sales Lifecycle (GTM Lifecycle)': 'healthy',
      'Sales Territory Design and System Implementation': 'healthy',
      'Automated Outbound Process': 'careful',
      'CLM Implementation': 'careful',
      'Commission Tool Implementation': 'careful',
      'Conversation Intelligence Implementation': 'careful',
      'CPQ Implementation': 'careful',
      'E-Signature Implementation': 'healthy',
      'Quote to Cash': 'healthy',
      'Sales Engagement Platform Implementation': 'healthy',
      'Sales Engagement Platform': 'healthy',
      'Sales Qualification Methodology': 'healthy',
      'Rules of Engagement Design': 'healthy',
      'Quotas and Target Setting': 'careful',
      'Win/Loss Analysis': 'careful',
      'Commission Plan Design & Implementation': 'careful',
      'Revenue Intelligence Process': 'careful',
      'Opportunity Management UX Improvements': 'healthy',
      'Sales Enablement Platform Implementation': 'careful',
      // Customer Success
      'Customer Lifecycle (GTM Lifecycle)': 'healthy',
      'Customer Health Model': 'careful',
      'Customer Segmentation': 'healthy',
      'Customer Success Platform Implementation': 'careful',
      'NPS and Voice of Customer Launch': 'careful',
      'Renewal Management': 'careful',
      'Renewal, Churn, NRR/GRR Reporting': 'healthy',
      'Onboarding and Process Improvement': 'healthy',
      'Sales to CS Handoff Process': 'healthy',
      'Support System Implementation': 'healthy',
      // Partnerships
      'Partnership Success Platform Implementation': 'careful',
    },
  },

  'Enterprise': {
    id: 'enterprise',
    label: 'Enterprise',
    description: 'Mature SaaS ($100M+ ARR). Best-in-class operations, fully instrumented GTM.',
    defaultStatus: 'healthy',
    overrides: {
      // Few things that even enterprise companies may not have perfected
      'CRM-ERP Integration': 'careful',
      'Fed/PubSec CRM Partitioning': 'careful',
      'HubSpot to Salesforce CRM Migration': 'na',
      'Salesforce to HubSpot CRM Migration': 'na',
      'PLG GTM Design': 'careful',
      'AI Automated Inbound': 'careful',
      'Lead Scoring Model Design (Product-Led)': 'careful',
      'Partnership Success Platform Implementation': 'careful',
      'Growth Model': 'healthy',
      'Revenue Recognition': 'healthy',
      'GTM Org Chart & Hiring Plan': 'healthy',
    },
  },
};

/**
 * Get the benchmark status for a specific process name given a preset.
 */
export function getBenchmarkStatus(presetId, processName) {
  const preset = Object.values(benchmarkPresets).find(p => p.id === presetId)
    || benchmarkPresets[presetId];
  if (!preset) return 'unable';
  return preset.overrides[processName] ?? preset.defaultStatus;
}

/**
 * Get all benchmark statuses for an array of processes.
 * Returns array of { name, currentStatus, benchmarkStatus, gap }
 */
export function compareToBenchmark(processes, presetId) {
  return processes.map(p => {
    const benchmarkStatus = getBenchmarkStatus(presetId, p.name);
    const currentValue = STATUS_VALUES[p.status] || 0;
    const benchmarkValue = STATUS_VALUES[benchmarkStatus] || 0;
    const gap = currentValue - benchmarkValue; // positive = above benchmark
    return {
      name: p.name,
      function: p.function,
      currentStatus: p.status,
      benchmarkStatus,
      gap,
      aboveBenchmark: gap > 0,
      atBenchmark: gap === 0,
      belowBenchmark: gap < 0,
    };
  });
}

/**
 * Calculate a weighted health score (0-100) for a set of processes.
 */
export function calculateHealthScore(processes, functionWeights = DEFAULT_FUNCTION_WEIGHTS) {
  const scorable = processes.filter(p => p.status !== 'na');
  if (scorable.length === 0) return { total: 0, byFunction: {} };

  const byFunction = {};
  const functionTotals = {};

  for (const p of scorable) {
    const fn = p.function || 'Other';
    const weight = functionWeights[fn] ?? 1.0;
    const value = STATUS_VALUES[p.status] || 0;
    const maxValue = STATUS_VALUES.healthy; // 4

    if (!byFunction[fn]) {
      byFunction[fn] = { score: 0, maxScore: 0, count: 0, weight };
    }
    byFunction[fn].score += value * weight;
    byFunction[fn].maxScore += maxValue * weight;
    byFunction[fn].count++;
  }

  let totalWeightedScore = 0;
  let totalMaxScore = 0;

  for (const fn of Object.keys(byFunction)) {
    const { score, maxScore } = byFunction[fn];
    byFunction[fn].percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    totalWeightedScore += score;
    totalMaxScore += maxScore;
  }

  const total = totalMaxScore > 0 ? Math.round((totalWeightedScore / totalMaxScore) * 100) : 0;

  return { total, byFunction };
}

/**
 * What-if analysis: calculate score if certain processes were changed to a target status.
 */
export function whatIfScore(processes, changes, functionWeights = DEFAULT_FUNCTION_WEIGHTS) {
  // changes is { processName: newStatus }
  const modified = processes.map(p =>
    changes[p.name] ? { ...p, status: changes[p.name] } : p
  );
  return calculateHealthScore(modified, functionWeights);
}
