/**
 * Motions Layer Grading (M1-M7)
 *
 * All Motion items are API_PLUS — graded from CRM metadata signals + intake answers.
 * Each function combines API signal scores with intake answer scores.
 */

import { SOURCE_TYPES } from './constants';

export function gradeMotions(signals, intake = {}) {
  return [
    gradeM1(signals, intake),
    gradeM2(signals, intake),
    gradeM3(signals, intake),
    gradeM4(signals, intake),
    gradeM5(signals, intake),
    gradeM6(signals, intake),
    gradeM7(signals, intake),
  ];
}

function scoreFromAnswer(value, mapping) {
  if (!value || !mapping) return null;
  return mapping[value] ?? null;
}

/**
 * M1: Inbound Lead Flow
 */
function gradeM1(s, intake) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // API signals
  if (s.form_count >= 5) {
    score += 3;
    itemSignals.push({ name: 'Forms', value: `${s.form_count} (${s.lead_capture_forms} lead capture)`, impact: 'positive', source: 'api' });
  } else if (s.form_count >= 1) {
    score += 2;
    itemSignals.push({ name: 'Forms', value: `${s.form_count}`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Forms', value: 'None', impact: 'negative', source: 'api' });
  }
  count++;

  if (s.has_lead_routing_workflow) {
    score += 3;
    itemSignals.push({ name: 'Lead routing workflow', value: 'Present', impact: 'positive', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Lead routing workflow', value: 'Missing', impact: 'negative', source: 'api' });
  }
  count++;

  // Intake signals
  const responseTimeScore = scoreFromAnswer(intake.C2, {
    '<5 minutes': 3, '<1 hour': 2, 'Same day': 2, '>24 hours': 1, "Don't know": 1,
  });
  if (responseTimeScore !== null) {
    score += responseTimeScore;
    count++;
    itemSignals.push({ name: 'Response time to leads', value: intake.C2, impact: responseTimeScore >= 3 ? 'positive' : responseTimeScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  const mqlScore = scoreFromAnswer(intake.C3, {
    'Yes, with lead scoring': 3, 'Yes, criteria-based': 2, 'Informal': 1, 'No': 1,
  });
  if (mqlScore !== null) {
    score += mqlScore;
    count++;
    itemSignals.push({ name: 'MQL definition', value: intake.C3, impact: mqlScore >= 3 ? 'positive' : mqlScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  const avg = count > 0 ? score / count : 1;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'M1', name: 'Inbound Lead Flow', layer: 'motions', status,
    source: SOURCE_TYPES.API_PLUS, signals: itemSignals, recommendations: [],
    serviceIds: ['lead-routing', 'speed-to-lead', 'website-lead-capture-and-form-configuration', 'lead-scoring-model-sales-led'],
  };
}

/**
 * M2: Marketing Email & Nurture
 */
function gradeM2(s, intake) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Published emails
  if (s.published_emails >= 10) {
    score += 3;
    itemSignals.push({ name: 'Published marketing emails', value: `${s.published_emails}`, impact: 'positive', source: 'api' });
  } else if (s.published_emails >= 1) {
    score += 2;
    itemSignals.push({ name: 'Published marketing emails', value: `${s.published_emails}`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Published marketing emails', value: `0 (${s.marketing_email_count} total, all drafts)`, impact: 'negative', source: 'api' });
  }
  count++;

  // Nurture workflows
  if (s.nurture_workflow_count >= 2) {
    score += 3;
    itemSignals.push({ name: 'Nurture workflows', value: `${s.nurture_workflow_count}`, impact: 'positive', source: 'api' });
  } else if (s.nurture_workflow_count >= 1) {
    score += 2;
    itemSignals.push({ name: 'Nurture workflows', value: `${s.nurture_workflow_count}`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Nurture workflows', value: 'None', impact: 'negative', source: 'api' });
  }
  count++;

  // Dynamic lists (segmentation)
  if (s.dynamic_list_count >= 5) {
    score += 3;
    itemSignals.push({ name: 'Dynamic lists', value: `${s.dynamic_list_count}`, impact: 'positive', source: 'api' });
  } else if (s.dynamic_list_count >= 1) {
    score += 2;
    itemSignals.push({ name: 'Dynamic lists', value: `${s.dynamic_list_count}`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Dynamic lists', value: 'None', impact: 'negative', source: 'api' });
  }
  count++;

  // Intake: nurture campaigns
  const nurtureScore = scoreFromAnswer(intake.C11, {
    'Yes, in CRM/MAP': 3, 'Yes, other tool': 2, 'No': 1,
  });
  if (nurtureScore !== null) {
    score += nurtureScore;
    count++;
    itemSignals.push({ name: 'Nurture campaigns', value: intake.C11, impact: nurtureScore >= 3 ? 'positive' : nurtureScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  const avg = count > 0 ? score / count : 1;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'M2', name: 'Marketing Email & Nurture', layer: 'motions', status,
    source: SOURCE_TYPES.API_PLUS, signals: itemSignals, recommendations: [],
    serviceIds: ['email-operations-nurture-program', 'marketing-automation-platform-implementation', 'marketing-database-segmentation'],
  };
}

/**
 * M3: Sales Execution
 */
function gradeM3(s, intake) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Stalled deal notifications
  if (s.has_stalled_deal_notification) {
    score += 3;
    itemSignals.push({ name: 'Stalled deal notifications', value: 'Present', impact: 'positive', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Stalled deal notifications', value: 'Missing', impact: 'negative', source: 'api' });
  }
  count++;

  // Task automation
  if (s.has_task_automation) {
    score += 3;
    itemSignals.push({ name: 'Task automation', value: 'Present', impact: 'positive', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Task automation', value: 'Missing', impact: 'negative', source: 'api' });
  }
  count++;

  // Intake: qualification methodology
  const qualScore = scoreFromAnswer(intake.C4, {
    'MEDDIC/MEDDPICC': 3, 'BANT': 3, 'SPICED': 3, 'Custom framework': 2, 'None': 1,
  });
  if (qualScore !== null) {
    score += qualScore;
    count++;
    itemSignals.push({ name: 'Qualification methodology', value: intake.C4, impact: qualScore >= 3 ? 'positive' : qualScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  // Intake: required deal fields
  const fieldsScore = scoreFromAnswer(intake.C5, {
    'Yes, all stages': 3, 'Some stages': 2, 'No required fields': 1,
  });
  if (fieldsScore !== null) {
    score += fieldsScore;
    count++;
    itemSignals.push({ name: 'Required deal stage fields', value: intake.C5, impact: fieldsScore >= 3 ? 'positive' : fieldsScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  const avg = count > 0 ? score / count : 1;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'M3', name: 'Sales Execution', layer: 'motions', status,
    source: SOURCE_TYPES.API_PLUS, signals: itemSignals, recommendations: [],
    serviceIds: ['activity-capture', 'sales-qualification-methodology', 'automated-outbound-process', 'sales-engagement-platform'],
  };
}

/**
 * M4: Attribution & Source Tracking
 */
function gradeM4(s, intake) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Attribution workflows
  if (s.attribution_workflow_count >= 2) {
    score += 3;
    itemSignals.push({ name: 'Attribution workflows', value: `${s.attribution_workflow_count}`, impact: 'positive', source: 'api' });
  } else if (s.attribution_workflow_count >= 1) {
    score += 2;
    itemSignals.push({ name: 'Attribution workflows', value: `${s.attribution_workflow_count}`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Attribution workflows', value: 'None', impact: 'negative', source: 'api' });
  }
  count++;

  // Deal source property
  if (s.has_deal_source_property) {
    score += 3;
    itemSignals.push({ name: 'Deal source property', value: 'Present', impact: 'positive', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Deal source property', value: 'Missing', impact: 'negative', source: 'api' });
  }
  count++;

  // Intake: pipeline tracking
  const pipelineScore = scoreFromAnswer(intake.M4_pipeline, {
    'Yes, in CRM': 3, 'Yes, externally': 2, 'No': 1,
  });
  if (pipelineScore !== null) {
    score += pipelineScore;
    count++;
    itemSignals.push({ name: 'Marketing vs sales pipeline tracking', value: intake.M4_pipeline, impact: pipelineScore >= 3 ? 'positive' : pipelineScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  // Intake: attribution model
  const attrScore = scoreFromAnswer(intake.M4_model, {
    'Multi-touch': 3, 'First-touch': 2, 'Last-touch': 2, 'None': 1,
  });
  if (attrScore !== null) {
    score += attrScore;
    count++;
    itemSignals.push({ name: 'Attribution model', value: intake.M4_model, impact: attrScore >= 3 ? 'positive' : attrScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  const avg = count > 0 ? score / count : 1;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'M4', name: 'Attribution & Source Tracking', layer: 'motions', status,
    source: SOURCE_TYPES.API_PLUS, signals: itemSignals, recommendations: [],
    serviceIds: ['lead-and-opportunity-attribution', 'marketing-reporting-pack'],
  };
}

/**
 * M5: Deal-to-Close Process
 */
function gradeM5(s, intake) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Competitor property
  if (s.has_competitor_property) {
    score += 3;
    itemSignals.push({ name: 'Competitor tracking', value: 'Property exists', impact: 'positive', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Competitor tracking', value: 'No property', impact: 'negative', source: 'api' });
  }
  count++;

  // Close reason property
  if (s.has_close_reason_property) {
    score += 3;
    itemSignals.push({ name: 'Closed-lost reason', value: 'Property exists', impact: 'positive', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Closed-lost reason', value: 'No property', impact: 'negative', source: 'api' });
  }
  count++;

  // Closed-won automation
  if (s.has_closed_won_automation) {
    score += 3;
    itemSignals.push({ name: 'Closed-won automation', value: 'Present', impact: 'positive', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Closed-won automation', value: 'Missing', impact: 'negative', source: 'api' });
  }
  count++;

  // Intake: closed-lost tracking
  const clScore = scoreFromAnswer(intake.C6, {
    'Required field': 3, 'Optional field': 2, 'Not tracked': 1,
  });
  if (clScore !== null) {
    score += clScore;
    count++;
    itemSignals.push({ name: 'Closed-lost reason tracking', value: intake.C6, impact: clScore >= 3 ? 'positive' : clScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  const avg = count > 0 ? score / count : 1;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'M5', name: 'Deal-to-Close Process', layer: 'motions', status,
    source: SOURCE_TYPES.API_PLUS, signals: itemSignals, recommendations: [],
    serviceIds: ['cpq-implementation', 'e-signature-implementation', 'clm-implementation', 'quote-to-cash'],
  };
}

/**
 * M6: Customer Onboarding & Success
 */
function gradeM6(s, intake) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // CS handoff workflow
  if (s.has_cs_handoff_workflow) {
    score += 3;
    itemSignals.push({ name: 'CS handoff workflow', value: 'Present', impact: 'positive', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'CS handoff workflow', value: 'Missing', impact: 'negative', source: 'api' });
  }
  count++;

  // Onboarding workflow
  if (s.has_onboarding_workflow) {
    score += 3;
    itemSignals.push({ name: 'Onboarding workflow', value: 'Present', impact: 'positive', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Onboarding workflow', value: 'Missing', impact: 'negative', source: 'api' });
  }
  count++;

  // Ticket pipeline customization
  if (s.ticket_pipeline_customized) {
    itemSignals.push({ name: 'Ticket pipeline', value: 'Customized', impact: 'positive', source: 'api' });
  }

  // Intake: handoff process
  const handoffScore = scoreFromAnswer(intake.C7, {
    'Documented + automated': 3, 'Documented': 2, 'Informal': 1, 'None': 1,
  });
  if (handoffScore !== null) {
    score += handoffScore;
    count++;
    itemSignals.push({ name: 'Handoff process', value: intake.C7, impact: handoffScore >= 3 ? 'positive' : handoffScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  // Intake: renewals
  const renewalScore = scoreFromAnswer(intake.C8, {
    'Automated in CRM/CSP': 3, 'Manual tracking': 2, 'Not systematically tracked': 1,
  });
  if (renewalScore !== null) {
    score += renewalScore;
    count++;
    itemSignals.push({ name: 'Renewal tracking', value: intake.C8, impact: renewalScore >= 3 ? 'positive' : renewalScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  // Intake: NPS
  const npsScore = scoreFromAnswer(intake.C9, {
    'Yes, automated program': 3, 'Yes, ad hoc': 2, 'No': 1,
  });
  if (npsScore !== null) {
    score += npsScore;
    count++;
    itemSignals.push({ name: 'NPS/CSAT program', value: intake.C9, impact: npsScore >= 3 ? 'positive' : npsScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  const avg = count > 0 ? score / count : 1;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'M6', name: 'Customer Onboarding & Success', layer: 'motions', status,
    source: SOURCE_TYPES.API_PLUS, signals: itemSignals, recommendations: [],
    serviceIds: ['sales-to-cs-handoff-process-implementation', 'customer-success-platform-implementation', 'customer-health-model', 'nps-and-voice-of-customer-launch', 'renewal-management'],
  };
}

/**
 * M7: Partner & Channel Ops
 * Skip logic: if A5 = "No" → mark unable
 */
function gradeM7(s, intake) {
  // Check skip logic
  if (intake.A5 === 'No') {
    return {
      id: 'M7', name: 'Partner & Channel Ops', layer: 'motions', status: 'unable',
      source: SOURCE_TYPES.API_PLUS, signals: [{ name: 'Partner program', value: 'Not applicable', impact: 'neutral', source: 'intake' }],
      recommendations: [], serviceIds: ['partnership-success-platform-implementation'],
    };
  }

  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Partner pipeline
  if (s.has_partner_pipeline) {
    score += 3;
    itemSignals.push({ name: 'Partner/referral pipeline', value: 'Present', impact: 'positive', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Partner/referral pipeline', value: 'Missing', impact: 'negative', source: 'api' });
  }
  count++;

  // Referral workflow
  if (s.has_referral_workflow) {
    score += 3;
    itemSignals.push({ name: 'Referral workflow', value: 'Present', impact: 'positive', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Referral workflow', value: 'Missing', impact: 'negative', source: 'api' });
  }
  count++;

  // Intake: partner deal tracking
  const trackScore = scoreFromAnswer(intake.M7_tracking, {
    'Separate pipeline': 3, 'Tags/fields': 2, 'Not tracked': 1,
  });
  if (trackScore !== null) {
    score += trackScore;
    count++;
    itemSignals.push({ name: 'Partner deal tracking', value: intake.M7_tracking, impact: trackScore >= 3 ? 'positive' : trackScore >= 2 ? 'neutral' : 'negative', source: 'intake' });
  }

  const avg = count > 0 ? score / count : 1;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'M7', name: 'Partner & Channel Ops', layer: 'motions', status,
    source: SOURCE_TYPES.API_PLUS, signals: itemSignals, recommendations: [],
    serviceIds: ['partnership-success-platform-implementation'],
  };
}
