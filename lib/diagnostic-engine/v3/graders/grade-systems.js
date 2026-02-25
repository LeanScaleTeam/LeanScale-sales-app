/**
 * Systems Pillar Grader (SY-1 through SY-7)
 *
 * Systems is the most API-driven pillar, reusing v2 signal extraction
 * logic mapped onto the v3 5-point scale. Most competencies start with
 * a CRM API base score and allow transcript/consultant overlay.
 *
 * Score resolution order:
 *   1. Consultant score (always wins if present)
 *   2. Transcript score (overrides API)
 *   3. API base score (computed from CRM signals)
 *
 * v2 to v3 scale mapping for SY-1 (combined F1+F4+F5):
 *   v2 averages 1-3 per sub-score, then maps combined average:
 *     avg >= 2.7 -> 5, >= 2.3 -> 4, >= 1.7 -> 3, >= 1.3 -> 2, else -> 1
 */

import { V3_SOURCE_TYPES } from '../constants-v3';

// ── Systems Competency Definitions ──

const SYSTEMS_COMPETENCIES = [
  {
    id: 'SY-1',
    name: 'CRM configuration & optimization',
    departments: ['marketing', 'sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.API_ONLY,
    serviceIds: ['hubspot-impl', 'salesforce-impl', 'foundational-automations-and-reporting-logic'],
    grader: gradeSY1,
  },
  {
    id: 'SY-2',
    name: 'Marketing automation platform',
    departments: ['marketing'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['marketing-automation-platform-implementation'],
    grader: gradeSY2,
  },
  {
    id: 'SY-3',
    name: 'Sales engagement platform',
    departments: ['sales'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['sales-engagement-platform', 'automated-outbound-process'],
    grader: gradeSY3,
  },
  {
    id: 'SY-4',
    name: 'CS / support platform',
    departments: ['cs'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['customer-success-platform-implementation', 'support-system-implementation'],
    grader: gradeSY4,
  },
  {
    id: 'SY-5',
    name: 'Partner management platform',
    departments: ['partners'],
    source: V3_SOURCE_TYPES.INTAKE,
    serviceIds: ['partnership-success-platform-implementation'],
    grader: gradeSY5,
  },
  {
    id: 'SY-6',
    name: 'Intelligence tools (enrichment, CI)',
    departments: ['marketing', 'sales'],
    source: V3_SOURCE_TYPES.API_ONLY,
    serviceIds: ['automated-inbound-data-enrichment', 'clay-impl'],
    grader: gradeSY6,
  },
  {
    id: 'SY-7',
    name: 'Integration / automation health',
    departments: ['marketing', 'sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.API_ONLY,
    serviceIds: ['crm-erp-integration'],
    grader: gradeSY7,
  },
];

// ── Helpers ──

/**
 * Derive impact label from a 1-5 score.
 *   1-2 = negative, 3 = neutral, 4-5 = positive
 */
function deriveImpact(score) {
  if (score <= 2) return 'negative';
  if (score >= 4) return 'positive';
  return 'neutral';
}

/**
 * Build the lookup key used in transcript and consultant score maps.
 */
function scoreKey(competencyId, department) {
  return `${competencyId}_${department}`;
}

/**
 * Safely read a numeric signal, defaulting to 0.
 */
function num(signals, key) {
  return signals[key] || 0;
}

/**
 * Safely read a boolean signal, defaulting to false.
 */
function bool(signals, key) {
  return !!signals[key];
}

// ── v2 Sub-Score Functions (1-3 scale) ──

/**
 * F1 sub-score: CRM Data Model quality.
 * Signals: deal_custom_properties, contact_custom_properties, enrichment_field_count
 */
function computeF1SubScore(s) {
  let score = 0;
  let count = 0;

  // Deal custom properties
  const dealCustom = num(s, 'deal_custom_properties');
  if (dealCustom >= 10) score += 3;
  else if (dealCustom >= 5) score += 2;
  else score += 1;
  count++;

  // Contact custom properties
  const contactCustom = num(s, 'contact_custom_properties');
  if (contactCustom >= 30) score += 3;
  else if (contactCustom >= 10) score += 2;
  else score += 1;
  count++;

  // Enrichment field count
  const enrichment = num(s, 'enrichment_field_count');
  if (enrichment >= 20) score += 3;
  else if (enrichment >= 5) score += 2;
  else score += 1;
  count++;

  return count > 0 ? score / count : 1;
}

/**
 * F4 sub-score: Automation Engine quality.
 * Signals: total_active_workflows, workflow_category_count, has_task_automation
 */
function computeF4SubScore(s) {
  let score = 0;
  let count = 0;

  // Active workflow count
  const workflows = num(s, 'total_active_workflows');
  if (workflows >= 20) score += 3;
  else if (workflows >= 10) score += 2;
  else score += 1;
  count++;

  // Category coverage
  const categories = num(s, 'workflow_category_count');
  if (categories >= 4) score += 3;
  else if (categories >= 2) score += 2;
  else score += 1;
  count++;

  // Task automation
  if (bool(s, 'has_task_automation')) score += 3;
  else score += 1;
  count++;

  return count > 0 ? score / count : 1;
}

/**
 * F5 sub-score: Team & Ownership structure.
 * Signals: team_count, owner_to_team_coverage
 */
function computeF5SubScore(s) {
  let score = 0;
  let count = 0;

  // Teams defined
  const teams = num(s, 'team_count');
  if (teams >= 3) score += 3;
  else if (teams >= 1) score += 2;
  else score += 1;
  count++;

  // Owner-to-team coverage
  const coverage = num(s, 'owner_to_team_coverage');
  if (coverage >= 90) score += 3;
  else if (coverage >= 50) score += 2;
  else score += 1;
  count++;

  return count > 0 ? score / count : 1;
}

/**
 * Map combined v2 average (1-3 scale) to v3 score (1-5 scale).
 *   avg >= 2.7 -> 5
 *   avg >= 2.3 -> 4
 *   avg >= 1.7 -> 3
 *   avg >= 1.3 -> 2
 *   else       -> 1
 */
function mapV2ToV3(avg) {
  if (avg >= 2.7) return 5;
  if (avg >= 2.3) return 4;
  if (avg >= 1.7) return 3;
  if (avg >= 1.3) return 2;
  return 1;
}

// ── Per-Competency Grading Functions ──
// Each returns { score, signals } where score is 1-5 and signals is an array.

/**
 * SY-1: CRM Configuration & Optimization
 * Combines v2 F1 + F4 + F5 sub-scores, maps average to v3 scale.
 */
function gradeSY1(s) {
  const f1Avg = computeF1SubScore(s);
  const f4Avg = computeF4SubScore(s);
  const f5Avg = computeF5SubScore(s);

  const overallAvg = (f1Avg + f4Avg + f5Avg) / 3;
  const score = mapV2ToV3(overallAvg);

  const signals = [
    {
      name: 'Data model (custom properties)',
      value: `Deal: ${num(s, 'deal_custom_properties')}, Contact: ${num(s, 'contact_custom_properties')}, Enrichment: ${num(s, 'enrichment_field_count')} fields`,
      impact: deriveImpact(mapV2ToV3(f1Avg)),
      source: 'api',
    },
    {
      name: 'Automation engine',
      value: `${num(s, 'total_active_workflows')} workflows, ${num(s, 'workflow_category_count')} categories, tasks: ${bool(s, 'has_task_automation') ? 'yes' : 'no'}`,
      impact: deriveImpact(mapV2ToV3(f4Avg)),
      source: 'api',
    },
    {
      name: 'Team & ownership',
      value: `${num(s, 'team_count')} teams, ${num(s, 'owner_to_team_coverage')}% coverage`,
      impact: deriveImpact(mapV2ToV3(f5Avg)),
      source: 'api',
    },
  ];

  return { score, signals };
}

/**
 * SY-2: Marketing Automation Platform
 * Checks marketing_email_count, form_count, total_active_lists
 */
function gradeSY2(s) {
  const emails = num(s, 'marketing_email_count');
  const forms = num(s, 'form_count');
  const lists = num(s, 'total_active_lists');

  let score;
  if (emails > 50 && forms > 5 && lists > 10) {
    score = 5;
  } else if (emails > 20 && forms > 2) {
    score = 4;
  } else if (emails > 0) {
    score = 3;
  } else if (forms > 0) {
    score = 2;
  } else {
    score = 1;
  }

  const signals = [];
  if (emails > 0) {
    signals.push({
      name: 'Marketing emails',
      value: `${emails} emails`,
      impact: emails > 20 ? 'positive' : 'neutral',
      source: 'api',
    });
  }
  if (forms > 0) {
    signals.push({
      name: 'Forms',
      value: `${forms} forms`,
      impact: forms > 5 ? 'positive' : 'neutral',
      source: 'api',
    });
  }
  if (lists > 0) {
    signals.push({
      name: 'Active lists',
      value: `${lists} lists`,
      impact: lists > 10 ? 'positive' : 'neutral',
      source: 'api',
    });
  }
  if (signals.length === 0) {
    signals.push({
      name: 'Marketing automation',
      value: 'No marketing assets detected',
      impact: 'negative',
      source: 'api',
    });
  }

  return { score, signals };
}

/**
 * SY-3: Sales Engagement Platform
 * Checks has_sequences, sequence_count, has_sales_engagement_tool
 */
function gradeSY3(s) {
  const hasSequences = bool(s, 'has_sequences') || num(s, 'sequence_count') > 0;
  const hasTool = bool(s, 'has_sales_engagement_tool');

  let score;
  if (hasTool && hasSequences) {
    score = 5;
  } else if (hasTool) {
    score = 4;
  } else if (hasSequences) {
    score = 3;
  } else {
    // Basic CRM at minimum (running diagnostic means CRM exists)
    score = 2;
  }

  const signals = [];
  if (hasTool) {
    signals.push({
      name: 'Sales engagement tool',
      value: 'Detected',
      impact: 'positive',
      source: 'api',
    });
  }
  if (hasSequences) {
    const seqCount = num(s, 'sequence_count');
    signals.push({
      name: 'Sequences',
      value: seqCount > 0 ? `${seqCount} sequences` : 'Present',
      impact: 'positive',
      source: 'api',
    });
  }
  if (!hasTool && !hasSequences) {
    signals.push({
      name: 'Sales engagement',
      value: 'No engagement platform detected',
      impact: 'negative',
      source: 'api',
    });
  }

  return { score, signals };
}

/**
 * SY-4: CS / Support Platform
 * Checks ticket_pipeline_customized, has_cs_handoff_workflow, has_health_scoring
 */
function gradeSY4(s) {
  const ticketCustomized = bool(s, 'ticket_pipeline_customized');
  const csHandoff = bool(s, 'has_cs_handoff_workflow');
  const healthScoring = bool(s, 'has_health_scoring');

  const indicatorCount = [ticketCustomized, csHandoff, healthScoring].filter(Boolean).length;

  let score;
  if (indicatorCount === 3) {
    score = 5;
  } else if (indicatorCount === 2) {
    score = 4;
  } else if (ticketCustomized) {
    score = 3;
  } else if (num(s, 'ticket_pipeline_count') > 0) {
    // Basic ticketing exists but not customized
    score = 2;
  } else {
    score = 1;
  }

  const signals = [];
  if (ticketCustomized) {
    signals.push({
      name: 'Ticket pipeline',
      value: 'Customized',
      impact: 'positive',
      source: 'api',
    });
  }
  if (csHandoff) {
    signals.push({
      name: 'CS handoff workflow',
      value: 'Present',
      impact: 'positive',
      source: 'api',
    });
  }
  if (healthScoring) {
    signals.push({
      name: 'Health scoring',
      value: 'Present',
      impact: 'positive',
      source: 'api',
    });
  }
  if (indicatorCount === 0) {
    signals.push({
      name: 'CS platform',
      value: num(s, 'ticket_pipeline_count') > 0 ? 'Basic ticketing only' : 'No CS platform detected',
      impact: 'negative',
      source: 'api',
    });
  }

  return { score, signals };
}

/**
 * SY-5: Partner Management Platform
 * Checks intakeAnswers.A5, signals.has_partner_pipeline
 * Mostly relies on transcript/consultant overlay.
 */
function gradeSY5(s, intakeAnswers) {
  const intake = intakeAnswers || {};
  const hasPartnerPipeline = bool(s, 'has_partner_pipeline');
  const hasPartners = !!intake.A5;

  let score;
  if (hasPartners && hasPartnerPipeline) {
    score = 5;
  } else if (hasPartnerPipeline) {
    score = 3;
  } else {
    score = 1;
  }

  const signals = [];
  if (hasPartnerPipeline) {
    signals.push({
      name: 'Partner pipeline',
      value: 'Present in CRM',
      impact: 'positive',
      source: 'api',
    });
  }
  if (hasPartners) {
    signals.push({
      name: 'Partner program (intake)',
      value: 'Has partners',
      impact: 'positive',
      source: 'intake',
    });
  }
  if (!hasPartnerPipeline && !hasPartners) {
    signals.push({
      name: 'Partner management',
      value: 'No partner program detected',
      impact: 'negative',
      source: 'api',
    });
  }

  return { score, signals };
}

/**
 * SY-6: Intelligence Tools (enrichment, CI)
 * v2 F6 logic mapped to v3 scale.
 * Checks enrichment_tools, enrichment_field_count, enrichment_multi_object
 */
function gradeSY6(s) {
  const tools = s.enrichment_tools || [];
  const toolCount = tools.length;
  const fieldCount = num(s, 'enrichment_field_count');
  const multiObject = bool(s, 'enrichment_multi_object');

  let score;
  if (multiObject && fieldCount >= 20) {
    score = 5;
  } else if (toolCount > 0 && fieldCount >= 10) {
    score = 4;
  } else if (toolCount > 0) {
    score = 3;
  } else if (fieldCount > 0) {
    score = 2;
  } else {
    score = 1;
  }

  const signals = [];
  if (toolCount > 0) {
    const toolNames = tools.map((t) => `${t.name} (${t.fieldCount} fields)`).join(', ');
    signals.push({
      name: 'Enrichment tools',
      value: toolNames,
      impact: fieldCount >= 20 ? 'positive' : 'neutral',
      source: 'api',
    });
  }
  if (multiObject) {
    signals.push({
      name: 'Multi-object enrichment',
      value: 'Contacts + Companies',
      impact: 'positive',
      source: 'api',
    });
  }
  if (toolCount === 0 && fieldCount === 0) {
    signals.push({
      name: 'Enrichment tools',
      value: 'None detected',
      impact: 'negative',
      source: 'api',
    });
  }

  return { score, signals };
}

/**
 * SY-7: Integration / Automation Health
 * v2 P5 logic for Salesforce mapped to v3 scale.
 * Checks connected_app_count, named_credential_count, integration_count
 */
function gradeSY7(s) {
  const appCount = num(s, 'connected_app_count');
  const credCount = num(s, 'named_credential_count');
  const integrationCount = num(s, 'integration_count');

  let score;
  if (credCount > 0 && appCount > 5) {
    score = 5;
  } else if (appCount > 3) {
    score = 4;
  } else if (appCount > 1 || integrationCount > 1) {
    score = 3;
  } else if (appCount > 0 || credCount > 0 || integrationCount > 0) {
    // Minimal presence — at least one metric is non-zero but barely
    score = 2;
  } else {
    score = 1;
  }

  const signals = [];
  if (appCount > 0 || credCount > 0) {
    signals.push({
      name: 'Connected apps',
      value: `${appCount} apps, ${credCount} named credentials`,
      impact: credCount > 0 ? 'positive' : 'neutral',
      source: 'api',
    });
  }
  if (integrationCount > 0) {
    signals.push({
      name: 'Integrations',
      value: `${integrationCount} detected`,
      impact: integrationCount > 5 ? 'positive' : 'neutral',
      source: 'api',
    });
  }
  if (appCount === 0 && credCount === 0 && integrationCount === 0) {
    signals.push({
      name: 'Integrations',
      value: 'None detected',
      impact: 'negative',
      source: 'api',
    });
  }

  return { score, signals };
}

// ── Main Grader ──

/**
 * Grade the Systems pillar (SY-1 through SY-7).
 *
 * @param {Object} signals          - CRM computed signals (primary data source)
 * @param {Object} intakeAnswers    - Intake form answers (used by SY-5)
 * @param {Object} transcriptScores - Map of { [competencyId_department]: { score, confidence, evidence } }
 * @param {Object} consultantScores - Map of { [competencyId_department]: { score, notes } }
 * @returns {Array} Array of competency grade objects
 */
export function gradeSystems(signals, intakeAnswers, transcriptScores, consultantScores) {
  const s = signals || {};
  const intake = intakeAnswers || {};
  const transcript = transcriptScores || {};
  const consultant = consultantScores || {};

  return SYSTEMS_COMPETENCIES.map((competency) => {
    // Compute API base score and signals for this competency
    const apiResult = competency.id === 'SY-5'
      ? competency.grader(s, intake)
      : competency.grader(s);

    const departments = {};
    const gradeSignals = [...apiResult.signals];

    for (const dept of competency.departments) {
      const key = scoreKey(competency.id, dept);
      const transcriptEntry = transcript[key] || null;
      const consultantEntry = consultant[key] || null;

      // Score resolution: consultant > transcript > API base
      let score = apiResult.score;

      if (consultantEntry) {
        score = consultantEntry.score;
        gradeSignals.push({
          name: `${dept} (consultant)`,
          value: consultantEntry.notes || `Score: ${score}`,
          impact: deriveImpact(score),
          source: 'consultant',
        });
      } else if (transcriptEntry) {
        score = transcriptEntry.score;
        gradeSignals.push({
          name: `${dept} (transcript)`,
          value: transcriptEntry.evidence || `Score: ${score}`,
          impact: deriveImpact(score),
          source: 'transcript',
        });
      }

      departments[dept] = score;
    }

    return {
      id: competency.id,
      name: competency.name,
      pillar: 'systems',
      departments,
      source: competency.source,
      signals: gradeSignals,
      serviceIds: competency.serviceIds,
    };
  });
}
