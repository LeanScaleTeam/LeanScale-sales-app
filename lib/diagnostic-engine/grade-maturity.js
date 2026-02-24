/**
 * Maturity Layer Grading (R1-R4)
 *
 * R1-R3 are INTAKE_ONLY, R4 is API_PLUS. Graded from intake answers
 * with optional API signal hints.
 */

import { SOURCE_TYPES } from './constants';

export function gradeMaturity(signals, intake = {}) {
  return [
    gradeR1(signals, intake),
    gradeR2(signals, intake),
    gradeR3(signals, intake),
    gradeR4(signals, intake),
  ];
}

function scoreFromAnswer(value, mapping) {
  if (!value || !mapping) return null;
  return mapping[value] ?? null;
}

/**
 * R1: Executive Reporting
 */
function gradeR1(s, intake) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Dashboard count
  const dashScore = scoreFromAnswer(intake.D1, {
    '10+': 3, '5-10': 3, '1-4': 2, 'None': 1,
  });
  if (dashScore !== null) {
    score += dashScore;
    count++;
    itemSignals.push({ name: 'CRM dashboards', value: intake.D1, impact: dashScore >= 3 ? 'positive' : dashScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  // Dashboard trust
  const trustScore = scoreFromAnswer(intake.D2, {
    'Yes, primary tool': 3, 'Somewhat': 2, 'Not really': 1, 'No dashboards': 1,
  });
  if (trustScore !== null) {
    score += trustScore;
    count++;
    itemSignals.push({ name: 'Dashboard trust', value: intake.D2, impact: trustScore >= 3 ? 'positive' : trustScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  const avg = count > 0 ? score / count : 1;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'R1', name: 'Executive Reporting', layer: 'maturity', status,
    source: SOURCE_TYPES.INTAKE_ONLY, signals: itemSignals, recommendations: [],
    serviceIds: ['executive-reporting-suite', 'monthly-quarterly-gtm-reporting-pack'],
  };
}

/**
 * R2: Revenue Metrics (Power 10)
 *
 * 10 metrics, each rated: Automated (3), Manual calc (2), Can't report (1)
 */
function gradeR2(s, intake) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  const POWER_10 = [
    { key: 'D5_arr', label: 'ARR by segment' },
    { key: 'D5_bookings', label: 'Bookings (new + expansion)' },
    { key: 'D5_pipeline', label: 'Pipeline by source and stage' },
    { key: 'D5_mql', label: 'MQLs by source and channel' },
    { key: 'D5_gross_churn', label: 'Gross churn' },
    { key: 'D5_grr', label: 'Gross dollar retention' },
    { key: 'D5_nrr', label: 'Net dollar retention' },
    { key: 'D5_mql_opp', label: 'MQL-to-Opp conversion rate' },
    { key: 'D5_opp_cw', label: 'Opp-to-CW conversion rate' },
    { key: 'D5_cycle', label: 'Average sales cycle time' },
  ];

  const METRIC_SCORES = {
    'Automated': 3,
    'Manual calc': 2,
    "Can't report": 1,
  };

  for (const metric of POWER_10) {
    const answer = intake[metric.key];
    const mScore = METRIC_SCORES[answer];
    if (mScore !== undefined) {
      score += mScore;
      count++;
      itemSignals.push({
        name: metric.label,
        value: answer,
        impact: mScore >= 3 ? 'positive' : mScore >= 2 ? 'neutral' : 'negative',
        source: 'intake',
      });
    }
  }

  const avg = count > 0 ? score / count : 1;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'R2', name: 'Revenue Metrics (Power 10)', layer: 'maturity', status,
    source: SOURCE_TYPES.INTAKE_ONLY, signals: itemSignals, recommendations: [],
    serviceIds: ['arr-reporting', 'executive-reporting-suite'],
  };
}

/**
 * R3: Forecasting & Planning
 */
function gradeR3(s, intake) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Forecasting method
  const forecastScore = scoreFromAnswer(intake.D3, {
    'CRM forecast tool': 3, 'Spreadsheet': 2, 'Gut feel': 1, 'Not done': 1,
  });
  if (forecastScore !== null) {
    score += forecastScore;
    count++;
    itemSignals.push({ name: 'Forecasting method', value: intake.D3, impact: forecastScore >= 3 ? 'positive' : forecastScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  // Growth model
  const growthScore = scoreFromAnswer(intake.D4, {
    'Yes, comprehensive': 3, 'Partial': 2, 'No': 1,
  });
  if (growthScore !== null) {
    score += growthScore;
    count++;
    itemSignals.push({ name: 'Growth model', value: intake.D4, impact: growthScore >= 3 ? 'positive' : growthScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  const avg = count > 0 ? score / count : 1;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'R3', name: 'Forecasting & Planning', layer: 'maturity', status,
    source: SOURCE_TYPES.INTAKE_ONLY, signals: itemSignals, recommendations: [],
    serviceIds: ['forecasting-process-implementation', 'growth-model', 'quotas-and-target-setting'],
  };
}

/**
 * R4: Win/Loss & Competitive Intelligence
 */
function gradeR4(s, intake) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // API: competitor tracking property
  if (s.has_competitor_tracking) {
    score += 3;
    itemSignals.push({ name: 'Competitor property on deals', value: 'Present', impact: 'positive', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Competitor property on deals', value: 'Missing', impact: 'negative', source: 'api' });
  }
  count++;

  // API: closed-lost reason
  if (s.has_closed_lost_reason) {
    score += 3;
    itemSignals.push({ name: 'Closed-lost reason property', value: 'Present', impact: 'positive', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Closed-lost reason property', value: 'Missing', impact: 'negative', source: 'api' });
  }
  count++;

  // Intake: win/loss analysis
  const wlScore = scoreFromAnswer(intake.R4_winloss, {
    'Formal process': 3, 'Ad hoc': 2, 'No': 1,
  });
  if (wlScore !== null) {
    score += wlScore;
    count++;
    itemSignals.push({ name: 'Win/loss analysis', value: intake.R4_winloss, impact: wlScore >= 3 ? 'positive' : wlScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  const avg = count > 0 ? score / count : 1;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'R4', name: 'Win/Loss & Competitive Intel', layer: 'maturity', status,
    source: SOURCE_TYPES.API_PLUS, signals: itemSignals, recommendations: [],
    serviceIds: ['sales-qualification-methodology', 'conversation-intelligence-platform-implementation'],
  };
}
