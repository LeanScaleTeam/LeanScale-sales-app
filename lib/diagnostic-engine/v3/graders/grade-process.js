/**
 * Process Pillar Grader (PR-1 through PR-10)
 *
 * Process is the heaviest pillar (25% weight) and has the most CRM API signal
 * coverage.  Each competency is scoped to specific departments and reuses v2
 * signal extraction logic, mapped from the old 1-3 scale to the v3 1-5 scale.
 *
 * Score resolution order:
 *   1. Consultant score (always wins if present)
 *   2. Transcript score (overlays API score when API is null OR confidence > 0.7)
 *   3. API-computed score
 *   4. null (no data)
 */

import { V3_SOURCE_TYPES } from '../constants-v3';

// ── Process Competency Definitions ──

const PROCESS_COMPETENCIES = [
  {
    id: 'PR-1',
    name: 'Lead lifecycle definition',
    departments: ['marketing'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['lead-lifecycle', 'gtm-lifecycle'],
    grade: gradePR1,
  },
  {
    id: 'PR-2',
    name: 'Sales lifecycle / pipeline design',
    departments: ['sales'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['sales-lifecycle'],
    grade: gradePR2,
  },
  {
    id: 'PR-3',
    name: 'Customer lifecycle definition',
    departments: ['cs'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['customer-lifecycle', 'onboarding-and-process-improvement'],
    grade: gradePR3,
  },
  {
    id: 'PR-4',
    name: 'Partner lifecycle definition',
    departments: ['partners'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['partnership-success-platform-implementation'],
    grade: gradePR4,
  },
  {
    id: 'PR-5',
    name: 'Cross-functional handoffs',
    departments: ['marketing', 'sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: [
      'marketing-to-sales-handoff-and-sla-tracking',
      'sales-to-cs-handoff-process-implementation',
    ],
    grade: gradePR5,
  },
  {
    id: 'PR-6',
    name: 'Sales methodology (MEDDIC etc)',
    departments: ['sales'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['sales-qualification-methodology'],
    grade: gradePR6,
  },
  {
    id: 'PR-7',
    name: 'Territory / account assignment',
    departments: ['sales', 'partners'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['sales-territory-design', 'lead-routing', 'rules-of-engagement-design'],
    grade: gradePR7,
  },
  {
    id: 'PR-8',
    name: 'ABM / target account process',
    departments: ['marketing', 'sales'],
    source: V3_SOURCE_TYPES.TRANSCRIPT,
    serviceIds: ['abm-abs-process-and-system', 'market-map'],
    grade: gradePR8,
  },
  {
    id: 'PR-9',
    name: 'Attribution model',
    departments: ['marketing'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['lead-and-opportunity-attribution'],
    grade: gradePR9,
  },
  {
    id: 'PR-10',
    name: 'Pipeline management process',
    departments: ['sales'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['forecasting-process-implementation', 'revenue-intelligence-process'],
    grade: gradePR10,
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

// ── Per-Competency API Graders ──
// Each returns { score, signals } for the given signals object.
// score is 1-5 or null. signals is an array of signal detail objects.

/**
 * PR-1: Lead lifecycle definition (v2 F3 logic, marketing only)
 * Uses lifecycle_stages_covered, lead_status_workflow_count, has_cross_object_sync
 */
function gradePR1(s) {
  const gradeSignals = [];
  const stagesCovered = s.lifecycle_stages_covered?.length || 0;
  const workflows = s.lead_status_workflow_count || 0;
  const crossSync = !!s.has_cross_object_sync;

  // Need at least some data to produce a score
  if (stagesCovered === 0 && workflows === 0 && !crossSync) {
    // Check if the signal keys exist at all (empty array vs. missing)
    if (!s.lifecycle_stages_covered && !s.lead_status_workflow_count && s.has_cross_object_sync === undefined) {
      return { score: null, signals: gradeSignals };
    }
  }

  let score;
  if (stagesCovered >= 5 && workflows >= 3 && crossSync) {
    score = 5;
  } else if (stagesCovered >= 5 && workflows >= 1) {
    score = 4;
  } else if (stagesCovered >= 3) {
    score = 3;
  } else if (stagesCovered > 0 || workflows > 0) {
    score = 2;
  } else {
    score = 1;
  }

  gradeSignals.push({
    name: 'Lifecycle stage coverage',
    value: `${stagesCovered} stages`,
    impact: stagesCovered >= 5 ? 'positive' : stagesCovered >= 3 ? 'neutral' : 'negative',
    source: 'api',
  });

  if (workflows > 0) {
    gradeSignals.push({
      name: 'Lead status workflows',
      value: `${workflows} workflow(s)`,
      impact: workflows >= 3 ? 'positive' : 'neutral',
      source: 'api',
    });
  }

  if (crossSync) {
    gradeSignals.push({
      name: 'Cross-object lifecycle sync',
      value: 'Present',
      impact: 'positive',
      source: 'api',
    });
  }

  return { score, signals: gradeSignals };
}

/**
 * PR-2: Sales lifecycle / pipeline design (v2 F2 logic, sales only)
 * Uses deal_pipeline_stages[0] { stageCount, probabilities, hasStalled }
 */
function gradePR2(s) {
  const gradeSignals = [];
  const pipelines = s.deal_pipeline_stages;

  if (!pipelines || pipelines.length === 0) {
    if (pipelines === undefined) {
      return { score: null, signals: gradeSignals };
    }
    gradeSignals.push({
      name: 'Deal pipelines',
      value: 'None found',
      impact: 'negative',
      source: 'api',
    });
    return { score: 1, signals: gradeSignals };
  }

  const primary = pipelines[0];
  const stages = primary.stageCount || 0;
  const probs = primary.probabilities || [];
  const nonDefault = probs.filter((p) => p !== 0 && p !== 100);
  const isAscending = nonDefault.length > 0 && nonDefault.every((p, i) => i === 0 || p >= nonDefault[i - 1]);
  const hasStalled = !!primary.hasStalled;

  let score;
  if (stages >= 5 && stages <= 8 && nonDefault.length > 2 && isAscending && hasStalled) {
    score = 5;
  } else if (stages >= 5 && stages <= 8 && nonDefault.length > 0) {
    score = 4;
  } else if (stages >= 3 && stages <= 10) {
    score = 3;
  } else if (stages > 0) {
    score = 2;
  } else {
    score = 1;
  }

  gradeSignals.push({
    name: 'Deal pipeline stages',
    value: `${stages} stages`,
    impact: stages >= 5 && stages <= 8 ? 'positive' : stages >= 3 ? 'neutral' : 'negative',
    source: 'api',
  });

  if (nonDefault.length > 0) {
    gradeSignals.push({
      name: 'Stage probabilities',
      value: isAscending ? 'Set and ascending' : 'Set but not fully logical',
      impact: isAscending ? 'positive' : 'neutral',
      source: 'api',
    });
  }

  if (hasStalled) {
    gradeSignals.push({
      name: 'Stalled/parking lot stage',
      value: 'Present',
      impact: 'positive',
      source: 'api',
    });
  }

  return { score, signals: gradeSignals };
}

/**
 * PR-3: Customer lifecycle definition (v2 M6 signals, cs only)
 * Uses has_cs_handoff_workflow, has_renewal_tracking, has_health_scoring
 */
function gradePR3(s) {
  const gradeSignals = [];

  // Check if any relevant signal is present
  if (s.has_cs_handoff_workflow === undefined &&
      s.has_renewal_tracking === undefined &&
      s.has_health_scoring === undefined) {
    return { score: null, signals: gradeSignals };
  }

  const present = [
    !!s.has_cs_handoff_workflow,
    !!s.has_renewal_tracking,
    !!s.has_health_scoring,
  ].filter(Boolean).length;

  let score;
  if (present === 3) {
    score = 5;
  } else if (present === 2) {
    score = 4;
  } else if (present === 1) {
    score = 3;
  } else {
    score = 1;
  }

  const items = [
    { key: 'has_cs_handoff_workflow', label: 'CS handoff workflow' },
    { key: 'has_renewal_tracking', label: 'Renewal tracking' },
    { key: 'has_health_scoring', label: 'Health scoring' },
  ];

  for (const item of items) {
    gradeSignals.push({
      name: item.label,
      value: s[item.key] ? 'Present' : 'Missing',
      impact: s[item.key] ? 'positive' : 'negative',
      source: 'api',
    });
  }

  return { score, signals: gradeSignals };
}

/**
 * PR-4: Partner lifecycle definition (v2 M7 signals, partners only)
 * Uses has_partner_pipeline, has_referral_workflow
 */
function gradePR4(s) {
  const gradeSignals = [];

  if (s.has_partner_pipeline === undefined && s.has_referral_workflow === undefined) {
    return { score: null, signals: gradeSignals };
  }

  const pipeline = !!s.has_partner_pipeline;
  const referral = !!s.has_referral_workflow;

  let score;
  if (pipeline && referral) {
    score = 5;
  } else if (pipeline) {
    score = 3;
  } else {
    score = 1;
  }

  gradeSignals.push({
    name: 'Partner pipeline',
    value: pipeline ? 'Present' : 'Missing',
    impact: pipeline ? 'positive' : 'negative',
    source: 'api',
  });

  gradeSignals.push({
    name: 'Referral workflow',
    value: referral ? 'Present' : 'Missing',
    impact: referral ? 'positive' : 'negative',
    source: 'api',
  });

  return { score, signals: gradeSignals };
}

/**
 * PR-5: Cross-functional handoffs (all depts, API + TRANSCRIPT)
 * Uses has_lead_routing_workflow, has_cs_handoff_workflow
 * Same API score applies to all departments; transcript overlay per-dept
 */
function gradePR5(s) {
  const gradeSignals = [];

  if (s.has_lead_routing_workflow === undefined && s.has_cs_handoff_workflow === undefined) {
    return { score: null, signals: gradeSignals };
  }

  const routing = !!s.has_lead_routing_workflow;
  const handoff = !!s.has_cs_handoff_workflow;

  let score;
  if (routing && handoff) {
    score = 4;
  } else if (routing || handoff) {
    score = 3;
  } else {
    score = 2;
  }

  gradeSignals.push({
    name: 'Lead routing workflow',
    value: routing ? 'Present' : 'Missing',
    impact: routing ? 'positive' : 'negative',
    source: 'api',
  });

  gradeSignals.push({
    name: 'CS handoff workflow',
    value: handoff ? 'Present' : 'Missing',
    impact: handoff ? 'positive' : 'negative',
    source: 'api',
  });

  return { score, signals: gradeSignals };
}

/**
 * PR-6: Sales methodology (v2 M3 logic, sales only)
 * Uses has_required_deal_fields, has_stalled_deal_notification, methodology_field_count
 * Intake: sales_methodology (from C4)
 */
function gradePR6(s, intakeAnswers) {
  const gradeSignals = [];
  const methodologyCount = s.methodology_field_count || 0;
  const intake = intakeAnswers || {};
  const intakeMethodology = intake.sales_methodology;

  if (s.has_required_deal_fields === undefined &&
      s.has_stalled_deal_notification === undefined &&
      methodologyCount === 0 &&
      !intakeMethodology) {
    return { score: null, signals: gradeSignals };
  }

  const reqFields = !!s.has_required_deal_fields;
  const stalledNotif = !!s.has_stalled_deal_notification;
  const hasMethodology = methodologyCount >= 3;

  let score;
  if (reqFields && stalledNotif) {
    score = 5;
  } else if (reqFields) {
    score = 4;
  } else if (stalledNotif || hasMethodology) {
    score = 3;
  } else if (methodologyCount > 0) {
    score = 2;
  } else {
    score = 1;
  }

  // Intake methodology can boost the score
  if (intakeMethodology) {
    const METH_SCORES = { meddic: 4, multiple: 5, spiced: 4, bant: 3, custom: 3, none: 1 };
    const intakeScore = METH_SCORES[intakeMethodology] ?? null;
    if (intakeScore !== null && intakeScore > score) {
      score = intakeScore;
    }
    gradeSignals.push({
      name: 'Sales methodology (intake)',
      value: `Methodology: ${intakeMethodology}`,
      impact: deriveImpact(intakeScore || score),
      source: 'intake',
    });
  }

  gradeSignals.push({
    name: 'Required deal fields',
    value: reqFields ? 'Stage-gated validation rules detected' : 'Missing',
    impact: reqFields ? 'positive' : 'negative',
    source: 'api',
  });

  gradeSignals.push({
    name: 'Stalled deal notifications',
    value: stalledNotif ? 'Present' : 'Missing',
    impact: stalledNotif ? 'positive' : 'negative',
    source: 'api',
  });

  if (methodologyCount > 0) {
    gradeSignals.push({
      name: 'Sales methodology fields',
      value: `${methodologyCount} methodology-related fields on Opportunity`,
      impact: hasMethodology ? 'positive' : 'neutral',
      source: 'api',
    });
  }

  return { score, signals: gradeSignals };
}

/**
 * PR-7: Territory / account assignment (sales + partners, API + TRANSCRIPT)
 * Uses has_territory_model, has_lead_routing_workflow
 */
function gradePR7(s) {
  const gradeSignals = [];

  if (s.has_territory_model === undefined && s.has_lead_routing_workflow === undefined) {
    return { score: null, signals: gradeSignals };
  }

  const territory = !!s.has_territory_model;
  const routing = !!s.has_lead_routing_workflow;

  let score;
  if (territory && routing) {
    score = 4;
  } else if (routing) {
    score = 3;
  } else {
    score = 1;
  }

  gradeSignals.push({
    name: 'Territory model',
    value: territory ? 'Present' : 'Missing',
    impact: territory ? 'positive' : 'negative',
    source: 'api',
  });

  gradeSignals.push({
    name: 'Lead routing workflow',
    value: routing ? 'Present' : 'Missing',
    impact: routing ? 'positive' : 'negative',
    source: 'api',
  });

  return { score, signals: gradeSignals };
}

/**
 * PR-8: ABM / target account process (marketing + sales)
 * API signals: ABM fields on Account, ABM campaigns, ABM tool detected.
 * Capped at 3 from API — transcript/consultant needed for higher scores.
 */
function gradePR8(s, intakeAnswers) {
  const gradeSignals = [];
  const intake = intakeAnswers || {};
  const hasAbmFields = !!s.has_abm_fields;
  const hasAbmCampaigns = !!s.has_abm_campaigns;
  const hasAbmTool = !!s.has_abm_tool || !!intake.has_abm_tool_intake;
  const campaigns = s.campaign_count || 0;

  if (!hasAbmFields && !hasAbmCampaigns && !hasAbmTool && campaigns === 0) {
    return { score: null, signals: gradeSignals };
  }

  const indicators = [hasAbmFields, hasAbmCampaigns || campaigns > 0, hasAbmTool].filter(Boolean).length;

  let score;
  if (indicators >= 3) {
    score = 3; // Capped — need transcript for 4+
  } else if (indicators >= 2) {
    score = 3;
  } else {
    score = 2;
  }

  if (hasAbmFields) {
    gradeSignals.push({
      name: 'ABM / target account fields',
      value: 'Target/tier/ICP fields detected on Account object',
      impact: 'neutral',
      source: 'api',
    });
  }

  if (hasAbmTool) {
    gradeSignals.push({
      name: 'ABM platform',
      value: intake.has_abm_tool_intake ? 'ABM platform reported (intake)' : 'ABM tool detected (installed package)',
      impact: 'positive',
      source: intake.has_abm_tool_intake ? 'intake' : 'api',
    });
  }

  if (hasAbmCampaigns) {
    gradeSignals.push({
      name: 'ABM campaigns',
      value: 'ABM-type campaigns found',
      impact: 'neutral',
      source: 'api',
    });
  } else if (campaigns > 0) {
    gradeSignals.push({
      name: 'Active campaigns',
      value: `${campaigns} campaigns detected`,
      impact: 'neutral',
      source: 'api',
    });
  }

  return { score, signals: gradeSignals };
}

/**
 * PR-9: Attribution model (v2 M4 logic, marketing only)
 * Uses has_deal_source_tracking, has_attribution_workflow, campaign_count,
 * has_campaign_members, has_campaign_attribution
 */
function gradePR9(s) {
  const gradeSignals = [];

  if (s.has_deal_source_tracking === undefined &&
      s.has_attribution_workflow === undefined &&
      s.campaign_count === undefined) {
    return { score: null, signals: gradeSignals };
  }

  const sourceTracking = !!s.has_deal_source_tracking;
  const attribution = !!s.has_attribution_workflow;
  const campaigns = s.campaign_count || 0;
  const hasCampaignMembers = !!s.has_campaign_members;
  const hasCampaignAttribution = !!s.has_campaign_attribution;

  let score;
  if (attribution && sourceTracking && campaigns >= 5 && hasCampaignAttribution) {
    score = 5;
  } else if (attribution && sourceTracking && campaigns >= 5) {
    score = 5;
  } else if (attribution && sourceTracking) {
    score = 4;
  } else if (sourceTracking && hasCampaignMembers) {
    score = 4;
  } else if (sourceTracking) {
    score = 3;
  } else if (campaigns > 0 || attribution) {
    score = 2;
  } else {
    score = 1;
  }

  gradeSignals.push({
    name: 'Deal source tracking',
    value: sourceTracking ? 'LeadSource field detected' : 'Missing',
    impact: sourceTracking ? 'positive' : 'negative',
    source: 'api',
  });

  if (attribution) {
    gradeSignals.push({
      name: 'Attribution workflow',
      value: 'Present',
      impact: 'positive',
      source: 'api',
    });
  }

  if (campaigns > 0) {
    gradeSignals.push({
      name: 'Campaign count',
      value: `${campaigns} active campaigns`,
      impact: campaigns >= 5 ? 'positive' : 'neutral',
      source: 'api',
    });
  }

  if (hasCampaignMembers) {
    gradeSignals.push({
      name: 'Campaign members',
      value: 'Campaign member records found (attribution tracking active)',
      impact: 'positive',
      source: 'api',
    });
  }

  if (hasCampaignAttribution) {
    gradeSignals.push({
      name: 'Campaign attribution',
      value: 'Campaigns linked to opportunities',
      impact: 'positive',
      source: 'api',
    });
  }

  return { score, signals: gradeSignals };
}

/**
 * PR-10: Pipeline management process (sales only, API + TRANSCRIPT)
 * Uses has_stalled_deal_notification, deal_pipeline_stages (pipeline exists)
 * Intake: has_forecasting_tool_intake (from B1_tools)
 */
function gradePR10(s, intakeAnswers) {
  const gradeSignals = [];
  const intake = intakeAnswers || {};
  const pipelines = s.deal_pipeline_stages;
  const hasPipeline = pipelines && pipelines.length > 0;
  const stalledNotif = !!s.has_stalled_deal_notification;
  const hasForecastTool = !!intake.has_forecasting_tool_intake;

  if (pipelines === undefined && s.has_stalled_deal_notification === undefined && !hasForecastTool) {
    return { score: null, signals: gradeSignals };
  }

  let score;
  if (hasPipeline && stalledNotif && hasForecastTool) {
    score = 5;
  } else if (hasPipeline && stalledNotif) {
    score = 4;
  } else if (hasForecastTool) {
    score = 4;
  } else if (hasPipeline) {
    score = 3;
  } else {
    score = 1;
  }

  gradeSignals.push({
    name: 'Deal pipeline',
    value: hasPipeline ? 'Present' : 'Missing',
    impact: hasPipeline ? 'positive' : 'negative',
    source: 'api',
  });

  if (stalledNotif) {
    gradeSignals.push({
      name: 'Stalled deal notifications',
      value: 'Present',
      impact: 'positive',
      source: 'api',
    });
  }

  if (hasForecastTool) {
    gradeSignals.push({
      name: 'Forecasting tool (intake)',
      value: 'Forecasting platform reported',
      impact: 'positive',
      source: 'intake',
    });
  }

  return { score, signals: gradeSignals };
}

// ── Main Grader ──

/**
 * Grade the Process pillar (PR-1 through PR-10).
 *
 * @param {Object} signals           - CRM computed signals
 * @param {Object} intakeAnswers     - Intake form answers (unused for most process items)
 * @param {Object} transcriptScores  - Map of { [competencyId_department]: { score, confidence, evidence } }
 * @param {Object} consultantScores  - Map of { [competencyId_department]: { score, notes } }
 * @returns {Array} Array of competency grade objects
 */
export function gradeProcess(signals, intakeAnswers, transcriptScores, consultantScores) {
  return PROCESS_COMPETENCIES.map((competency) => {
    // Step 1: Compute API-based score (some graders accept intakeAnswers)
    const needsIntake = ['PR-6', 'PR-8', 'PR-10'].includes(competency.id);
    const apiResult = needsIntake
      ? competency.grade(signals, intakeAnswers)
      : competency.grade(signals);
    const apiScore = apiResult.score;
    const apiSignals = apiResult.signals;

    // Step 2: Build per-department scores with overlay logic
    const departments = {};
    const gradeSignals = [...apiSignals];

    for (const dept of competency.departments) {
      const key = scoreKey(competency.id, dept);
      const transcript = transcriptScores[key] || null;
      const consultant = consultantScores[key] || null;

      let finalScore = apiScore;

      // Overlay transcript: when API score is null, or transcript confidence > 0.7
      if (transcript) {
        if (finalScore === null) {
          finalScore = transcript.score;
          gradeSignals.push({
            name: `${dept} (transcript)`,
            value: transcript.evidence || `Score: ${transcript.score}`,
            impact: deriveImpact(transcript.score),
            source: 'transcript',
          });
        } else if (transcript.confidence > 0.7) {
          finalScore = transcript.score;
          gradeSignals.push({
            name: `${dept} (transcript override)`,
            value: transcript.evidence || `Score: ${transcript.score}`,
            impact: deriveImpact(transcript.score),
            source: 'transcript',
          });
        }
      }

      // Consultant always overrides everything
      if (consultant) {
        finalScore = consultant.score;
        gradeSignals.push({
          name: `${dept} (${consultant.assessed_by === "vasco-auto" ? "vasco" : "consultant"})`,
          value: consultant.notes || `Score: ${consultant.score}`,
          impact: deriveImpact(consultant.score),
          source: consultant.assessed_by === 'vasco-auto' ? 'vasco' : 'consultant',
        });
      }

      departments[dept] = finalScore;
    }

    return {
      id: competency.id,
      name: competency.name,
      pillar: 'process',
      departments,
      source: competency.source,
      signals: gradeSignals,
      serviceIds: competency.serviceIds,
    };
  });
}
