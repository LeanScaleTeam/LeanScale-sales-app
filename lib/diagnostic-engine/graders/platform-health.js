/**
 * Platform Health Layer Grading (P1-P5)
 *
 * Salesforce-only layer grading Apex code health, validation rules,
 * security model, record type design, and integration footprint.
 */

import { SOURCE_TYPES } from '../constants';

export function gradePlatformHealth(signals) {
  return [
    gradeP1(signals),
    gradeP2(signals),
    gradeP3(signals),
    gradeP4(signals),
    gradeP5(signals),
  ];
}

/**
 * P1: Apex Code Health
 */
function gradeP1(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Trigger count
  const triggerCount = s.apex_trigger_count || 0;
  if (triggerCount <= 20) {
    score += 3;
    itemSignals.push({ name: 'Apex triggers', value: `${triggerCount}`, impact: 'positive', source: 'api' });
  } else if (triggerCount <= 50) {
    score += 2;
    itemSignals.push({ name: 'Apex triggers', value: `${triggerCount}`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Apex triggers', value: `${triggerCount}`, impact: 'negative', source: 'api' });
  }
  count++;

  // Class count and complexity
  const classCount = s.apex_class_count || 0;
  const totalLines = s.apex_total_lines || 0;
  const avgLines = classCount > 0 ? Math.round(totalLines / classCount) : 0;

  if (classCount > 0 && avgLines < 200) {
    score += 3;
    itemSignals.push({ name: 'Apex classes', value: `${classCount} (avg ${avgLines} lines)`, impact: 'positive', source: 'api' });
  } else if (classCount > 0 && avgLines < 500) {
    score += 2;
    itemSignals.push({ name: 'Apex classes', value: `${classCount} (avg ${avgLines} lines)`, impact: 'neutral', source: 'api' });
  } else {
    score += classCount > 0 ? 1 : 2; // No Apex is neutral, not bad
    itemSignals.push({ name: 'Apex classes', value: classCount > 0 ? `${classCount} (avg ${avgLines} lines)` : 'None', impact: classCount > 0 ? 'negative' : 'neutral', source: 'api' });
  }
  count++;

  const avg = count > 0 ? score / count : 2;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'P1', name: 'Apex Code Health', layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY, status, score: Math.round(avg * 100) / 100,
    signals: itemSignals,
  };
}

/**
 * P2: Validation & Data Quality Rules
 */
function gradeP2(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Validation rule coverage
  const ruleCount = s.validation_rule_count || 0;
  const rulesByObject = s.validation_rules_by_object || {};
  const objectsWithRules = Object.keys(rulesByObject).length;

  if (objectsWithRules >= 4 && ruleCount >= 10) {
    score += 3;
    itemSignals.push({ name: 'Validation rules', value: `${ruleCount} across ${objectsWithRules} objects`, impact: 'positive', source: 'api' });
  } else if (objectsWithRules >= 2 && ruleCount >= 3) {
    score += 2;
    itemSignals.push({ name: 'Validation rules', value: `${ruleCount} across ${objectsWithRules} objects`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Validation rules', value: ruleCount > 0 ? `${ruleCount} across ${objectsWithRules} objects` : 'None', impact: 'negative', source: 'api' });
  }
  count++;

  const avg = count > 0 ? score / count : 2;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'P2', name: 'Validation & Data Quality', layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY, status, score: Math.round(avg * 100) / 100,
    signals: itemSignals,
  };
}

/**
 * P3: Security & Access Model
 */
function gradeP3(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Role hierarchy
  const depth = s.role_hierarchy_depth || 0;
  if (depth >= 2 && depth <= 6) {
    score += 3;
    itemSignals.push({ name: 'Role hierarchy depth', value: `${depth} levels`, impact: 'positive', source: 'api' });
  } else if (depth >= 1) {
    score += 2;
    itemSignals.push({ name: 'Role hierarchy depth', value: `${depth} level(s)`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Role hierarchy depth', value: 'No hierarchy', impact: 'negative', source: 'api' });
  }
  count++;

  // Profile/PermSet sprawl
  const profileCount = s.profile_count || 0;
  const permSetCount = s.permission_set_count || 0;

  if (profileCount <= 15 && permSetCount <= 30) {
    score += 3;
    itemSignals.push({ name: 'Profiles / Permission Sets', value: `${profileCount} / ${permSetCount}`, impact: 'positive', source: 'api' });
  } else if (profileCount <= 30 && permSetCount <= 60) {
    score += 2;
    itemSignals.push({ name: 'Profiles / Permission Sets', value: `${profileCount} / ${permSetCount}`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Profiles / Permission Sets', value: `${profileCount} / ${permSetCount}`, impact: 'negative', source: 'api' });
  }
  count++;

  const avg = count > 0 ? score / count : 2;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'P3', name: 'Security & Access Model', layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY, status, score: Math.round(avg * 100) / 100,
    signals: itemSignals,
  };
}

/**
 * P4: Record Type & Layout Design
 */
function gradeP4(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  const rtCount = s.record_type_count || 0;
  const rtByObject = s.record_types_by_object || {};
  const maxPerObject = Math.max(0, ...Object.values(rtByObject));

  if (rtCount > 0 && maxPerObject <= 5) {
    score += 3;
    itemSignals.push({ name: 'Record types', value: `${rtCount} total (max ${maxPerObject} per object)`, impact: 'positive', source: 'api' });
  } else if (rtCount > 0 && maxPerObject <= 10) {
    score += 2;
    itemSignals.push({ name: 'Record types', value: `${rtCount} total (max ${maxPerObject} per object)`, impact: 'neutral', source: 'api' });
  } else if (rtCount === 0) {
    score += 2; // No record types is neutral
    itemSignals.push({ name: 'Record types', value: 'None', impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Record types', value: `${rtCount} total (max ${maxPerObject} per object)`, impact: 'negative', source: 'api' });
  }
  count++;

  const avg = count > 0 ? score / count : 2;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'P4', name: 'Record Type & Layout Design', layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY, status, score: Math.round(avg * 100) / 100,
    signals: itemSignals,
  };
}

/**
 * P5: Integration Footprint
 */
function gradeP5(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  const appCount = s.connected_app_count || 0;
  const credCount = s.named_credential_count || 0;
  const outboundFlows = s.outbound_flow_count || 0;

  // Named credentials indicate well-managed integrations
  if (credCount > 0 && appCount <= 15) {
    score += 3;
    itemSignals.push({ name: 'Integrations', value: `${appCount} apps, ${credCount} named credentials`, impact: 'positive', source: 'api' });
  } else if (appCount <= 20) {
    score += 2;
    itemSignals.push({ name: 'Integrations', value: `${appCount} apps, ${credCount} named credentials`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Integrations', value: `${appCount} apps, ${credCount} named credentials`, impact: 'negative', source: 'api' });
  }
  count++;

  if (outboundFlows > 0) {
    itemSignals.push({ name: 'Outbound flows', value: `${outboundFlows}`, impact: 'neutral', source: 'api' });
  }

  const avg = count > 0 ? score / count : 2;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'P5', name: 'Integration Footprint', layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY, status, score: Math.round(avg * 100) / 100,
    signals: itemSignals,
  };
}
