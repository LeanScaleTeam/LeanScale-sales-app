/**
 * Attio Automation Health Grading (replaces F4 for Attio customers)
 *
 * Attio Workflows are not exposed via REST API, so we infer automation maturity
 * from:
 *   1. Webhook breadth (event types, platform diversity)        — 35%
 *   2. Webhook quality (filter sophistication, health)          — 20%
 *   3. Actor share (% of writes by non-human actors)            — 25%
 *   4. AI attribute adoption                                    — 10%
 *   5. Intake supplement (workflow self-report, sequences, etc) — 10%
 *
 * Output: single item shaped like other graders (id: 'F4', layer: 'foundation').
 */

import { SOURCE_TYPES } from '../constants';

export function gradeAutomationAttio(signals, intakeAnswers = {}) {
  const itemSignals = [];
  let score = 0; // accumulator out of 3.0

  // ── Webhook breadth ──
  const eventCount = signals.attio_webhook_event_type_count || 0;
  const platforms = signals.attio_webhook_platforms || [];
  const platformCount = platforms.filter((p) => p !== 'Custom').length;

  if (eventCount >= 5 || platformCount >= 3) {
    score += 1.05; // 35% of 3.0
    itemSignals.push({
      name: 'Webhook breadth',
      value: `${eventCount} event types across ${platforms.length} platform${platforms.length === 1 ? '' : 's'}`,
      impact: 'positive',
      source: 'api',
    });
  } else if (eventCount >= 2 || platformCount >= 1) {
    score += 0.7;
    itemSignals.push({
      name: 'Webhook breadth',
      value: `${eventCount} event types, ${platforms.join(', ') || 'no recognized platforms'}`,
      impact: 'neutral',
      source: 'api',
    });
  } else {
    score += 0.35;
    itemSignals.push({
      name: 'Webhook breadth',
      value: signals.attio_webhook_total === 0 ? 'No webhooks configured' : `${signals.attio_webhook_total} webhooks, narrow event coverage`,
      impact: 'negative',
      source: 'api',
    });
  }

  // ── Webhook quality ──
  const filterPct = signals.attio_webhook_with_filter_pct || 0;
  const healthPct = signals.attio_webhook_health_pct || 0;
  if (filterPct >= 50 && healthPct >= 90) {
    score += 0.6;
    itemSignals.push({
      name: 'Webhook quality',
      value: `${filterPct}% have filters, ${healthPct}% active`,
      impact: 'positive',
      source: 'api',
    });
  } else if (signals.attio_webhook_total > 0) {
    score += 0.3;
    itemSignals.push({
      name: 'Webhook quality',
      value: `${filterPct}% filtered, ${healthPct}% active`,
      impact: 'neutral',
      source: 'api',
    });
  }

  // ── Actor share — % of writes driven by automation ──
  const automationPct = signals.attio_automation_write_share_pct || 0;
  if (automationPct >= 30) {
    score += 0.75;
    itemSignals.push({
      name: 'Automation footprint in data',
      value: `${automationPct}% of recent writes by API tokens or system actors`,
      impact: 'positive',
      source: 'api',
    });
  } else if (automationPct >= 10) {
    score += 0.45;
    itemSignals.push({
      name: 'Automation footprint in data',
      value: `${automationPct}% of recent writes by automated actors`,
      impact: 'neutral',
      source: 'api',
    });
  } else {
    score += 0.2;
    itemSignals.push({
      name: 'Automation footprint in data',
      value: `${automationPct}% — most writes are manual`,
      impact: 'negative',
      source: 'api',
    });
  }

  // ── AI attribute adoption ──
  const aiCount = signals.ai_attribute_count || 0;
  if (aiCount >= 3) {
    score += 0.3;
    itemSignals.push({
      name: 'AI Attributes',
      value: `${aiCount} AI-configured attributes`,
      impact: 'positive',
      source: 'api',
    });
  } else if (aiCount >= 1) {
    score += 0.18;
    itemSignals.push({
      name: 'AI Attributes',
      value: `${aiCount} AI-configured attribute${aiCount === 1 ? '' : 's'}`,
      impact: 'neutral',
      source: 'api',
    });
  }

  // ── Intake supplement ──
  // A_attio_workflow_count: '0' | '1-3' | '4-10' | '10+'
  const wfCount = intakeAnswers.A_attio_workflow_count;
  if (wfCount === '10+' || wfCount === '4-10') {
    score += 0.3;
    itemSignals.push({
      name: 'Self-reported workflows',
      value: `${wfCount} active Attio Workflows`,
      impact: 'positive',
      source: 'intake',
    });
  } else if (wfCount === '1-3') {
    score += 0.18;
    itemSignals.push({
      name: 'Self-reported workflows',
      value: '1-3 active Attio Workflows',
      impact: 'neutral',
      source: 'intake',
    });
  } else if (wfCount === '0') {
    itemSignals.push({
      name: 'Self-reported workflows',
      value: 'No active Attio Workflows',
      impact: 'negative',
      source: 'intake',
    });
  }

  // Normalize to 1-3 status scale
  const normalized = Math.max(0, Math.min(3, score));
  const status = normalized >= 2.3 ? 'healthy' : normalized >= 1.3 ? 'careful' : 'warning';

  return {
    id: 'F4',
    name: 'Automation Engine (Attio)',
    layer: 'foundation',
    source: SOURCE_TYPES.API_PLUS,
    status,
    score: Math.round(normalized * 100) / 100,
    signals: itemSignals,
    notes: 'Attio Workflows are not exposed via API. This score combines webhook signals, write provenance, AI attribute adoption, and self-reported workflow usage.',
  };
}
