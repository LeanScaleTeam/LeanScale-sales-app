/**
 * Foundation Layer Grading (F1-F6)
 *
 * All Foundation items are API_ONLY — graded entirely from CRM metadata signals.
 * Each function returns a DiagnosticItem with id, name, layer, status, signals, etc.
 */

import { SOURCE_TYPES } from './constants';

export function gradeFoundation(signals) {
  return [
    gradeF1(signals),
    gradeF2(signals),
    gradeF3(signals),
    gradeF4(signals),
    gradeF5(signals),
    gradeF6(signals),
  ];
}

/**
 * F1: CRM Data Model
 * Grades property counts, custom fields, and enrichment fields.
 */
function gradeF1(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Deal custom properties
  if (s.deal_custom_properties >= 10) {
    score += 3;
    itemSignals.push({ name: 'Deal custom properties', value: `${s.deal_custom_properties}`, impact: 'positive', source: 'api' });
  } else if (s.deal_custom_properties >= 5) {
    score += 2;
    itemSignals.push({ name: 'Deal custom properties', value: `${s.deal_custom_properties}`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Deal custom properties', value: `${s.deal_custom_properties}`, impact: 'negative', source: 'api' });
  }
  count++;

  // Contact custom properties
  if (s.contact_custom_properties >= 30) {
    score += 3;
    itemSignals.push({ name: 'Contact custom properties', value: `${s.contact_custom_properties}`, impact: 'positive', source: 'api' });
  } else if (s.contact_custom_properties >= 10) {
    score += 2;
    itemSignals.push({ name: 'Contact custom properties', value: `${s.contact_custom_properties}`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Contact custom properties', value: `${s.contact_custom_properties}`, impact: 'negative', source: 'api' });
  }
  count++;

  // Ticket custom properties
  if (s.ticket_custom_properties >= 5) {
    score += 3;
    itemSignals.push({ name: 'Ticket custom properties', value: `${s.ticket_custom_properties}`, impact: 'positive', source: 'api' });
  } else if (s.ticket_custom_properties >= 1) {
    score += 2;
    itemSignals.push({ name: 'Ticket custom properties', value: `${s.ticket_custom_properties}`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Ticket properties fully default', value: '0 custom', impact: 'negative', source: 'api' });
  }
  count++;

  // Enrichment
  if (s.enrichment_field_count >= 20) {
    score += 3;
    itemSignals.push({ name: 'Data enrichment', value: `${s.enrichment_tool_detected || 'Unknown'} (${s.enrichment_field_count} fields)`, impact: 'positive', source: 'api' });
  } else if (s.enrichment_field_count >= 5) {
    score += 2;
    itemSignals.push({ name: 'Data enrichment', value: `${s.enrichment_field_count} fields`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'No enrichment tool detected', value: '0 fields', impact: 'negative', source: 'api' });
  }
  count++;

  const avg = score / count;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'F1',
    name: 'CRM Data Model',
    layer: 'foundation',
    status,
    source: SOURCE_TYPES.API_ONLY,
    signals: itemSignals,
    recommendations: [],
    serviceIds: ['hubspot-impl', 'crm-deduplication'],
  };
}

/**
 * F2: Pipeline Design
 * Grades deal/ticket pipeline structure, stage counts, probabilities.
 */
function gradeF2(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  const primaryPipeline = s.deal_pipeline_stages?.[0];

  if (primaryPipeline) {
    // Stage count
    const stages = primaryPipeline.stageCount;
    if (stages >= 5 && stages <= 8) {
      score += 3;
      itemSignals.push({ name: 'Deal pipeline stages', value: `${stages} stages`, impact: 'positive', source: 'api' });
    } else if (stages >= 3 && stages <= 10) {
      score += 2;
      itemSignals.push({ name: 'Deal pipeline stages', value: `${stages} stages`, impact: 'neutral', source: 'api' });
    } else {
      score += 1;
      itemSignals.push({ name: 'Deal pipeline stages', value: `${stages} stages (suboptimal)`, impact: 'negative', source: 'api' });
    }
    count++;

    // Probabilities
    const probs = primaryPipeline.probabilities || [];
    const nonDefault = probs.filter((p) => p !== 0 && p !== 100);
    const isAscending = nonDefault.every((p, i) => i === 0 || p >= nonDefault[i - 1]);
    if (nonDefault.length > 2 && isAscending) {
      score += 3;
      itemSignals.push({ name: 'Stage probabilities', value: 'Set and ascending', impact: 'positive', source: 'api' });
    } else if (nonDefault.length > 0) {
      score += 2;
      itemSignals.push({ name: 'Stage probabilities', value: 'Set but not fully logical', impact: 'neutral', source: 'api' });
    } else {
      score += 1;
      itemSignals.push({ name: 'Stage probabilities', value: 'All defaults', impact: 'negative', source: 'api' });
    }
    count++;

    // Stalled/parking lot stage
    if (primaryPipeline.hasStalled) {
      score += 3;
      itemSignals.push({ name: 'Stalled/parking lot stage', value: 'Present', impact: 'positive', source: 'api' });
    } else {
      score += 1;
      itemSignals.push({ name: 'Stalled/parking lot stage', value: 'Missing', impact: 'negative', source: 'api' });
    }
    count++;

    // Closed-lost stage
    if (primaryPipeline.hasClosedLost) {
      itemSignals.push({ name: 'Closed-Lost stage', value: 'Present', impact: 'positive', source: 'api' });
    }
  } else {
    score += 1;
    count++;
    itemSignals.push({ name: 'Deal pipelines', value: 'None found', impact: 'negative', source: 'api' });
  }

  // Ticket pipeline
  if (s.ticket_pipeline_customized) {
    itemSignals.push({ name: 'Ticket pipeline', value: 'Customized', impact: 'positive', source: 'api' });
  }

  const avg = count > 0 ? score / count : 1;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'F2',
    name: 'Pipeline Design',
    layer: 'foundation',
    status,
    source: SOURCE_TYPES.API_ONLY,
    signals: itemSignals,
    recommendations: [],
    serviceIds: ['sales-lifecycle'],
  };
}

/**
 * F3: Lifecycle & Lead Status Automation
 * Grades lifecycle workflow coverage and cross-object sync.
 */
function gradeF3(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Lifecycle stage coverage
  const stagesCovered = s.lifecycle_stages_covered?.length || 0;
  if (stagesCovered >= 5) {
    score += 3;
    itemSignals.push({ name: 'Lifecycle stage coverage', value: `${stagesCovered}/5 stages (${s.lifecycle_stages_covered.join(', ')})`, impact: 'positive', source: 'api' });
  } else if (stagesCovered >= 3) {
    score += 2;
    itemSignals.push({ name: 'Lifecycle stage coverage', value: `${stagesCovered}/5 stages`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Lifecycle stage coverage', value: `${stagesCovered}/5 stages`, impact: 'negative', source: 'api' });
  }
  count++;

  // Lead status workflows
  if (s.lead_status_workflow_count >= 3) {
    score += 3;
    itemSignals.push({ name: 'Lead status workflows', value: `${s.lead_status_workflow_count} workflows`, impact: 'positive', source: 'api' });
  } else if (s.lead_status_workflow_count >= 1) {
    score += 2;
    itemSignals.push({ name: 'Lead status workflows', value: `${s.lead_status_workflow_count} workflow(s)`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Lead status workflows', value: 'None', impact: 'negative', source: 'api' });
  }
  count++;

  // Cross-object sync
  if (s.has_cross_object_sync) {
    score += 3;
    itemSignals.push({ name: 'Cross-object lifecycle sync', value: 'Present', impact: 'positive', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Cross-object lifecycle sync', value: 'Missing', impact: 'negative', source: 'api' });
  }
  count++;

  const avg = score / count;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'F3',
    name: 'Lifecycle & Lead Status',
    layer: 'foundation',
    status,
    source: SOURCE_TYPES.API_ONLY,
    signals: itemSignals,
    recommendations: [],
    serviceIds: ['gtm-lifecycle', 'lead-lifecycle'],
  };
}

/**
 * F4: Automation Engine
 * Grades workflow breadth, category coverage, task/deal automation.
 */
function gradeF4(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Active workflow count
  if (s.total_active_workflows >= 20) {
    score += 3;
    itemSignals.push({ name: 'Active workflows', value: `${s.total_active_workflows}`, impact: 'positive', source: 'api' });
  } else if (s.total_active_workflows >= 10) {
    score += 2;
    itemSignals.push({ name: 'Active workflows', value: `${s.total_active_workflows}`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Active workflows', value: `${s.total_active_workflows}`, impact: 'negative', source: 'api' });
  }
  count++;

  // Category coverage
  if (s.workflow_category_count >= 4) {
    score += 3;
    itemSignals.push({ name: 'Workflow categories', value: `${s.workflow_category_count} categories`, impact: 'positive', source: 'api' });
  } else if (s.workflow_category_count >= 2) {
    score += 2;
    itemSignals.push({ name: 'Workflow categories', value: `${s.workflow_category_count} categories`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Workflow categories', value: `${s.workflow_category_count} category`, impact: 'negative', source: 'api' });
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

  // Deal creation automation
  if (s.has_deal_creation_automation) {
    itemSignals.push({ name: 'Deal creation automation', value: 'Present', impact: 'positive', source: 'api' });
  } else {
    itemSignals.push({ name: 'Deal creation automation', value: 'Manual only', impact: 'negative', source: 'api' });
  }

  const avg = score / count;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'F4',
    name: 'Automation Engine',
    layer: 'foundation',
    status,
    source: SOURCE_TYPES.API_ONLY,
    signals: itemSignals,
    recommendations: [],
    serviceIds: ['foundational-automations-and-reporting-logic'],
  };
}

/**
 * F5: Team & Ownership Structure
 * Grades team definitions, owner coverage, functional breadth.
 */
function gradeF5(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Teams defined
  if (s.team_count >= 3) {
    score += 3;
    itemSignals.push({ name: 'Teams defined', value: `${s.team_count} teams (${s.teams.join(', ')})`, impact: 'positive', source: 'api' });
  } else if (s.team_count >= 1) {
    score += 2;
    itemSignals.push({ name: 'Teams defined', value: `${s.team_count} team(s)`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Teams defined', value: 'None', impact: 'negative', source: 'api' });
  }
  count++;

  // Owner-to-team coverage
  if (s.owner_to_team_coverage >= 90) {
    score += 3;
    itemSignals.push({ name: 'Owner-to-team coverage', value: `${s.owner_to_team_coverage}%`, impact: 'positive', source: 'api' });
  } else if (s.owner_to_team_coverage >= 50) {
    score += 2;
    itemSignals.push({ name: 'Owner-to-team coverage', value: `${s.owner_to_team_coverage}%`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Owner-to-team coverage', value: `${s.owner_to_team_coverage}%`, impact: 'negative', source: 'api' });
  }
  count++;

  // Orphan owners
  if (s.orphan_owner_count > 0) {
    itemSignals.push({ name: 'Orphan owners (no team)', value: `${s.orphan_owner_count}`, impact: 'negative', source: 'api' });
  }

  const avg = score / count;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'F5',
    name: 'Team & Ownership',
    layer: 'foundation',
    status,
    source: SOURCE_TYPES.API_ONLY,
    signals: itemSignals,
    recommendations: [],
    serviceIds: ['hubspot-impl'],
  };
}

/**
 * F6: Data Enrichment
 * Grades enrichment tool presence, field count, multi-object coverage.
 */
function gradeF6(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Enrichment tool present
  const toolCount = s.enrichment_tools?.length || 0;
  if (toolCount > 0 && s.enrichment_field_count >= 20) {
    score += 3;
    const toolNames = s.enrichment_tools.map((t) => `${t.name} (${t.fieldCount} fields)`).join(', ');
    itemSignals.push({ name: 'Enrichment tools', value: toolNames, impact: 'positive', source: 'api' });
  } else if (toolCount > 0) {
    score += 2;
    const toolNames = s.enrichment_tools.map((t) => t.name).join(', ');
    itemSignals.push({ name: 'Enrichment tools', value: `${toolNames} (${s.enrichment_field_count} fields)`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Enrichment tools', value: 'None detected', impact: 'negative', source: 'api' });
  }
  count++;

  // Multi-object enrichment
  if (s.enrichment_multi_object) {
    score += 3;
    itemSignals.push({ name: 'Multi-object enrichment', value: 'Contacts + Companies', impact: 'positive', source: 'api' });
  } else if (toolCount > 0) {
    score += 2;
    itemSignals.push({ name: 'Multi-object enrichment', value: 'Contacts only', impact: 'neutral', source: 'api' });
  }
  count++;

  // Enrichment automation workflow
  if (s.has_enrichment_workflow) {
    itemSignals.push({ name: 'Enrichment automation', value: 'Workflow exists', impact: 'positive', source: 'api' });
  }

  const avg = count > 0 ? score / count : 1;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'F6',
    name: 'Data Enrichment',
    layer: 'foundation',
    status,
    source: SOURCE_TYPES.API_ONLY,
    signals: itemSignals,
    recommendations: [],
    serviceIds: ['automated-inbound-data-enrichment', 'clay-impl'],
  };
}
