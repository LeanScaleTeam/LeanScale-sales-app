/**
 * Tests for v3 Process Pillar Grader (PR-1 through PR-10)
 *
 * Covers:
 * - lib/diagnostic-engine/v3/graders/grade-process.js
 * - API signal-based scoring per competency
 * - Department-scoped grades (only applicable departments per competency)
 * - Transcript overlay when API score is null or confidence > 0.7
 * - Consultant always overrides
 * - Signal collection with impact derivation
 * - v2 -> v3 scale mapping (1-3 -> 1-5)
 */

describe('gradeProcess - v3 Process Pillar', () => {
  let gradeProcess;

  beforeAll(() => {
    ({ gradeProcess } = require('../../lib/diagnostic-engine/v3/graders/grade-process'));
  });

  // ── Basic Structure ──

  test('returns an array of 10 competency grade objects', () => {
    const result = gradeProcess({}, {}, {}, {});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(10);
  });

  test('each grade has the correct shape', () => {
    const result = gradeProcess({}, {}, {}, {});
    for (const grade of result) {
      expect(grade).toHaveProperty('id');
      expect(grade).toHaveProperty('name');
      expect(grade).toHaveProperty('pillar', 'process');
      expect(grade).toHaveProperty('departments');
      expect(grade).toHaveProperty('source');
      expect(grade).toHaveProperty('signals');
      expect(grade).toHaveProperty('serviceIds');
      expect(typeof grade.departments).toBe('object');
      expect(Array.isArray(grade.signals)).toBe(true);
      expect(Array.isArray(grade.serviceIds)).toBe(true);
    }
  });

  test('returns competencies in order PR-1 through PR-10', () => {
    const result = gradeProcess({}, {}, {}, {});
    const ids = result.map((g) => g.id);
    expect(ids).toEqual([
      'PR-1', 'PR-2', 'PR-3', 'PR-4', 'PR-5',
      'PR-6', 'PR-7', 'PR-8', 'PR-9', 'PR-10',
    ]);
  });

  // ── Correct Names and Sources ──

  test('PR-1 has correct name, source, and serviceIds', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr1 = result.find((g) => g.id === 'PR-1');
    expect(pr1.name).toBe('Lead lifecycle definition');
    expect(pr1.source).toBe('API_PLUS');
    expect(pr1.serviceIds).toEqual(['lead-lifecycle', 'gtm-lifecycle']);
  });

  test('PR-2 has correct name, source, and serviceIds', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr2 = result.find((g) => g.id === 'PR-2');
    expect(pr2.name).toBe('Sales lifecycle / pipeline design');
    expect(pr2.source).toBe('API_PLUS');
    expect(pr2.serviceIds).toEqual(['sales-lifecycle']);
  });

  test('PR-3 has correct name, source, and serviceIds', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr3 = result.find((g) => g.id === 'PR-3');
    expect(pr3.name).toBe('Customer lifecycle definition');
    expect(pr3.source).toBe('API_PLUS');
    expect(pr3.serviceIds).toEqual(['customer-lifecycle', 'onboarding-and-process-improvement']);
  });

  test('PR-4 has correct name, source, and serviceIds', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr4 = result.find((g) => g.id === 'PR-4');
    expect(pr4.name).toBe('Partner lifecycle definition');
    expect(pr4.source).toBe('API_PLUS');
    expect(pr4.serviceIds).toEqual(['partnership-success-platform-implementation']);
  });

  test('PR-5 has correct name, source, and serviceIds', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr5 = result.find((g) => g.id === 'PR-5');
    expect(pr5.name).toBe('Cross-functional handoffs');
    expect(pr5.source).toBe('API_PLUS');
    expect(pr5.serviceIds).toEqual([
      'marketing-to-sales-handoff-and-sla-tracking',
      'sales-to-cs-handoff-process-implementation',
    ]);
  });

  test('PR-6 has correct name, source, and serviceIds', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr6 = result.find((g) => g.id === 'PR-6');
    expect(pr6.name).toBe('Sales methodology (MEDDIC etc)');
    expect(pr6.source).toBe('API_PLUS');
    expect(pr6.serviceIds).toEqual(['sales-qualification-methodology']);
  });

  test('PR-7 has correct name, source, and serviceIds', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr7 = result.find((g) => g.id === 'PR-7');
    expect(pr7.name).toBe('Territory / account assignment');
    expect(pr7.source).toBe('API_PLUS');
    expect(pr7.serviceIds).toEqual([
      'sales-territory-design',
      'lead-routing',
      'rules-of-engagement-design',
    ]);
  });

  test('PR-8 has correct name, source, and serviceIds', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr8 = result.find((g) => g.id === 'PR-8');
    expect(pr8.name).toBe('ABM / target account process');
    expect(pr8.source).toBe('TRANSCRIPT');
    expect(pr8.serviceIds).toEqual(['abm-abs-process-and-system', 'market-map']);
  });

  test('PR-9 has correct name, source, and serviceIds', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr9 = result.find((g) => g.id === 'PR-9');
    expect(pr9.name).toBe('Attribution model');
    expect(pr9.source).toBe('API_PLUS');
    expect(pr9.serviceIds).toEqual(['lead-and-opportunity-attribution']);
  });

  test('PR-10 has correct name, source, and serviceIds', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr10 = result.find((g) => g.id === 'PR-10');
    expect(pr10.name).toBe('Pipeline management process');
    expect(pr10.source).toBe('API_PLUS');
    expect(pr10.serviceIds).toEqual([
      'forecasting-process-implementation',
      'revenue-intelligence-process',
    ]);
  });

  // ── Department Scoping ──

  test('PR-1 only has marketing department', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr1 = result.find((g) => g.id === 'PR-1');
    expect(Object.keys(pr1.departments)).toEqual(['marketing']);
  });

  test('PR-2 only has sales department', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr2 = result.find((g) => g.id === 'PR-2');
    expect(Object.keys(pr2.departments)).toEqual(['sales']);
  });

  test('PR-3 only has cs department', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr3 = result.find((g) => g.id === 'PR-3');
    expect(Object.keys(pr3.departments)).toEqual(['cs']);
  });

  test('PR-4 only has partners department', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr4 = result.find((g) => g.id === 'PR-4');
    expect(Object.keys(pr4.departments)).toEqual(['partners']);
  });

  test('PR-5 has all 4 departments', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr5 = result.find((g) => g.id === 'PR-5');
    expect(Object.keys(pr5.departments).sort()).toEqual(['cs', 'marketing', 'partners', 'sales']);
  });

  test('PR-6 only has sales department', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr6 = result.find((g) => g.id === 'PR-6');
    expect(Object.keys(pr6.departments)).toEqual(['sales']);
  });

  test('PR-7 has sales and partners departments', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr7 = result.find((g) => g.id === 'PR-7');
    expect(Object.keys(pr7.departments).sort()).toEqual(['partners', 'sales']);
  });

  test('PR-8 has marketing and sales departments', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr8 = result.find((g) => g.id === 'PR-8');
    expect(Object.keys(pr8.departments).sort()).toEqual(['marketing', 'sales']);
  });

  test('PR-9 only has marketing department', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr9 = result.find((g) => g.id === 'PR-9');
    expect(Object.keys(pr9.departments)).toEqual(['marketing']);
  });

  test('PR-10 only has sales department', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr10 = result.find((g) => g.id === 'PR-10');
    expect(Object.keys(pr10.departments)).toEqual(['sales']);
  });

  // ── Null Scores When No Data ──

  test('all department scores are null when no signals or transcript data', () => {
    const result = gradeProcess({}, {}, {}, {});
    for (const grade of result) {
      for (const dept of Object.keys(grade.departments)) {
        expect(grade.departments[dept]).toBeNull();
      }
    }
  });

  // ── PR-1: Lead Lifecycle Definition (v2 F3 logic) ──

  test('PR-1 scores 5 with full lifecycle (>=5 stages + >=3 workflows + cross-sync)', () => {
    const signals = {
      lifecycle_stages_covered: ['subscriber', 'lead', 'mql', 'sql', 'customer'],
      lead_status_workflow_count: 3,
      has_cross_object_sync: true,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr1 = result.find((g) => g.id === 'PR-1');
    expect(pr1.departments.marketing).toBe(5);
  });

  test('PR-1 scores 4 with >=5 stages + >=1 workflow but no cross-sync', () => {
    const signals = {
      lifecycle_stages_covered: ['subscriber', 'lead', 'mql', 'sql', 'customer'],
      lead_status_workflow_count: 1,
      has_cross_object_sync: false,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr1 = result.find((g) => g.id === 'PR-1');
    expect(pr1.departments.marketing).toBe(4);
  });

  test('PR-1 scores 3 with >=3 stages', () => {
    const signals = {
      lifecycle_stages_covered: ['lead', 'mql', 'sql'],
      lead_status_workflow_count: 0,
      has_cross_object_sync: false,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr1 = result.find((g) => g.id === 'PR-1');
    expect(pr1.departments.marketing).toBe(3);
  });

  test('PR-1 scores 2 with some coverage (<3 stages)', () => {
    const signals = {
      lifecycle_stages_covered: ['lead', 'mql'],
      lead_status_workflow_count: 0,
      has_cross_object_sync: false,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr1 = result.find((g) => g.id === 'PR-1');
    expect(pr1.departments.marketing).toBe(2);
  });

  test('PR-1 scores 1 with no lifecycle data', () => {
    const signals = {
      lifecycle_stages_covered: [],
      lead_status_workflow_count: 0,
      has_cross_object_sync: false,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr1 = result.find((g) => g.id === 'PR-1');
    expect(pr1.departments.marketing).toBe(1);
  });

  // ── PR-2: Sales Pipeline Design (v2 F2 logic) ──

  test('PR-2 scores 5 with 5-8 stages + ascending probs + stalled', () => {
    const signals = {
      deal_pipeline_stages: [{
        stageCount: 6,
        probabilities: [0, 10, 25, 50, 75, 100],
        hasStalled: true,
      }],
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr2 = result.find((g) => g.id === 'PR-2');
    expect(pr2.departments.sales).toBe(5);
  });

  test('PR-2 scores 4 with 5-8 stages + some probs but no ascending or no stalled', () => {
    const signals = {
      deal_pipeline_stages: [{
        stageCount: 6,
        probabilities: [0, 20, 40, 60, 80, 100],
        hasStalled: false,
      }],
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr2 = result.find((g) => g.id === 'PR-2');
    expect(pr2.departments.sales).toBe(4);
  });

  test('PR-2 scores 3 with 3-10 stages but default probs', () => {
    const signals = {
      deal_pipeline_stages: [{
        stageCount: 4,
        probabilities: [0, 0, 0, 100],
        hasStalled: false,
      }],
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr2 = result.find((g) => g.id === 'PR-2');
    expect(pr2.departments.sales).toBe(3);
  });

  test('PR-2 scores 2 when pipeline exists but stage count outside 3-10', () => {
    const signals = {
      deal_pipeline_stages: [{
        stageCount: 2,
        probabilities: [],
        hasStalled: false,
      }],
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr2 = result.find((g) => g.id === 'PR-2');
    expect(pr2.departments.sales).toBe(2);
  });

  test('PR-2 scores 1 with no pipeline', () => {
    const signals = {
      deal_pipeline_stages: [],
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr2 = result.find((g) => g.id === 'PR-2');
    expect(pr2.departments.sales).toBe(1);
  });

  // ── PR-3: Customer Lifecycle Definition (v2 M6 signals) ──

  test('PR-3 scores 5 with all 3 CS signals', () => {
    const signals = {
      has_cs_handoff_workflow: true,
      has_renewal_tracking: true,
      has_health_scoring: true,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr3 = result.find((g) => g.id === 'PR-3');
    expect(pr3.departments.cs).toBe(5);
  });

  test('PR-3 scores 4 with 2 CS signals', () => {
    const signals = {
      has_cs_handoff_workflow: true,
      has_renewal_tracking: true,
      has_health_scoring: false,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr3 = result.find((g) => g.id === 'PR-3');
    expect(pr3.departments.cs).toBe(4);
  });

  test('PR-3 scores 3 with 1 CS signal', () => {
    const signals = {
      has_cs_handoff_workflow: true,
      has_renewal_tracking: false,
      has_health_scoring: false,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr3 = result.find((g) => g.id === 'PR-3');
    expect(pr3.departments.cs).toBe(3);
  });

  test('PR-3 scores 1 with no CS signals', () => {
    const signals = {
      has_cs_handoff_workflow: false,
      has_renewal_tracking: false,
      has_health_scoring: false,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr3 = result.find((g) => g.id === 'PR-3');
    expect(pr3.departments.cs).toBe(1);
  });

  // ── PR-4: Partner Lifecycle Definition (v2 M7 signals) ──

  test('PR-4 scores 5 with both partner pipeline and referral workflow', () => {
    const signals = {
      has_partner_pipeline: true,
      has_referral_workflow: true,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr4 = result.find((g) => g.id === 'PR-4');
    expect(pr4.departments.partners).toBe(5);
  });

  test('PR-4 scores 3 with partner pipeline only', () => {
    const signals = {
      has_partner_pipeline: true,
      has_referral_workflow: false,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr4 = result.find((g) => g.id === 'PR-4');
    expect(pr4.departments.partners).toBe(3);
  });

  test('PR-4 scores 1 with neither', () => {
    const signals = {
      has_partner_pipeline: false,
      has_referral_workflow: false,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr4 = result.find((g) => g.id === 'PR-4');
    expect(pr4.departments.partners).toBe(1);
  });

  // ── PR-5: Cross-functional Handoffs ──

  test('PR-5 scores 4 with both routing and handoff workflows', () => {
    const signals = {
      has_lead_routing_workflow: true,
      has_cs_handoff_workflow: true,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr5 = result.find((g) => g.id === 'PR-5');
    // All departments get the same API score
    for (const dept of Object.keys(pr5.departments)) {
      expect(pr5.departments[dept]).toBe(4);
    }
  });

  test('PR-5 scores 3 with one workflow', () => {
    const signals = {
      has_lead_routing_workflow: true,
      has_cs_handoff_workflow: false,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr5 = result.find((g) => g.id === 'PR-5');
    for (const dept of Object.keys(pr5.departments)) {
      expect(pr5.departments[dept]).toBe(3);
    }
  });

  test('PR-5 scores 2 with neither workflow', () => {
    const signals = {
      has_lead_routing_workflow: false,
      has_cs_handoff_workflow: false,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr5 = result.find((g) => g.id === 'PR-5');
    for (const dept of Object.keys(pr5.departments)) {
      expect(pr5.departments[dept]).toBe(2);
    }
  });

  // ── PR-6: Sales Methodology (v2 M3 logic) ──

  test('PR-6 scores 5 with both required deal fields and stalled notification', () => {
    const signals = {
      has_required_deal_fields: true,
      has_stalled_deal_notification: true,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr6 = result.find((g) => g.id === 'PR-6');
    expect(pr6.departments.sales).toBe(5);
  });

  test('PR-6 scores 4 with required deal fields only', () => {
    const signals = {
      has_required_deal_fields: true,
      has_stalled_deal_notification: false,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr6 = result.find((g) => g.id === 'PR-6');
    expect(pr6.departments.sales).toBe(4);
  });

  test('PR-6 scores 3 with stalled notification only', () => {
    const signals = {
      has_required_deal_fields: false,
      has_stalled_deal_notification: true,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr6 = result.find((g) => g.id === 'PR-6');
    expect(pr6.departments.sales).toBe(3);
  });

  test('PR-6 scores 1 with no signals', () => {
    const signals = {
      has_required_deal_fields: false,
      has_stalled_deal_notification: false,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr6 = result.find((g) => g.id === 'PR-6');
    expect(pr6.departments.sales).toBe(1);
  });

  // ── PR-7: Territory / Account Assignment ──

  test('PR-7 scores 4 with territory model and routing', () => {
    const signals = {
      has_territory_model: true,
      has_lead_routing_workflow: true,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr7 = result.find((g) => g.id === 'PR-7');
    expect(pr7.departments.sales).toBe(4);
    expect(pr7.departments.partners).toBe(4);
  });

  test('PR-7 scores 3 with routing only', () => {
    const signals = {
      has_territory_model: false,
      has_lead_routing_workflow: true,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr7 = result.find((g) => g.id === 'PR-7');
    expect(pr7.departments.sales).toBe(3);
    expect(pr7.departments.partners).toBe(3);
  });

  test('PR-7 scores 1 with neither', () => {
    const signals = {
      has_territory_model: false,
      has_lead_routing_workflow: false,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr7 = result.find((g) => g.id === 'PR-7');
    expect(pr7.departments.sales).toBe(1);
    expect(pr7.departments.partners).toBe(1);
  });

  // ── PR-8: ABM (Transcript-only) ──

  test('PR-8 returns null for all departments with no transcript data', () => {
    const result = gradeProcess({}, {}, {}, {});
    const pr8 = result.find((g) => g.id === 'PR-8');
    expect(pr8.departments.marketing).toBeNull();
    expect(pr8.departments.sales).toBeNull();
  });

  test('PR-8 picks up transcript scores', () => {
    const transcriptScores = {
      'PR-8_marketing': { score: 3, confidence: 0.8, evidence: 'Basic ABM process' },
      'PR-8_sales': { score: 4, confidence: 0.9, evidence: 'Multi-channel ABM' },
    };
    const result = gradeProcess({}, {}, transcriptScores, {});
    const pr8 = result.find((g) => g.id === 'PR-8');
    expect(pr8.departments.marketing).toBe(3);
    expect(pr8.departments.sales).toBe(4);
  });

  // ── PR-9: Attribution Model (v2 M4 logic) ──

  test('PR-9 scores 5 with attribution + source tracking + campaigns >= 5', () => {
    const signals = {
      has_deal_source_tracking: true,
      has_attribution_workflow: true,
      campaign_count: 10,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr9 = result.find((g) => g.id === 'PR-9');
    expect(pr9.departments.marketing).toBe(5);
  });

  test('PR-9 scores 4 with attribution + source tracking, campaigns < 5', () => {
    const signals = {
      has_deal_source_tracking: true,
      has_attribution_workflow: true,
      campaign_count: 2,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr9 = result.find((g) => g.id === 'PR-9');
    expect(pr9.departments.marketing).toBe(4);
  });

  test('PR-9 scores 3 with source tracking only', () => {
    const signals = {
      has_deal_source_tracking: true,
      has_attribution_workflow: false,
      campaign_count: 0,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr9 = result.find((g) => g.id === 'PR-9');
    expect(pr9.departments.marketing).toBe(3);
  });

  test('PR-9 scores 2 with some signal present (campaign_count > 0)', () => {
    const signals = {
      has_deal_source_tracking: false,
      has_attribution_workflow: false,
      campaign_count: 3,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr9 = result.find((g) => g.id === 'PR-9');
    expect(pr9.departments.marketing).toBe(2);
  });

  test('PR-9 scores 1 with nothing', () => {
    const signals = {
      has_deal_source_tracking: false,
      has_attribution_workflow: false,
      campaign_count: 0,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr9 = result.find((g) => g.id === 'PR-9');
    expect(pr9.departments.marketing).toBe(1);
  });

  // ── PR-10: Pipeline Management Process ──

  test('PR-10 scores 4 with pipeline + stalled alerts', () => {
    const signals = {
      has_stalled_deal_notification: true,
      deal_pipeline_stages: [{ stageCount: 5 }],
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr10 = result.find((g) => g.id === 'PR-10');
    expect(pr10.departments.sales).toBe(4);
  });

  test('PR-10 scores 3 with pipeline but no stalled alerts', () => {
    const signals = {
      has_stalled_deal_notification: false,
      deal_pipeline_stages: [{ stageCount: 5 }],
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr10 = result.find((g) => g.id === 'PR-10');
    expect(pr10.departments.sales).toBe(3);
  });

  test('PR-10 scores 1 with no pipeline', () => {
    const signals = {
      has_stalled_deal_notification: false,
      deal_pipeline_stages: [],
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr10 = result.find((g) => g.id === 'PR-10');
    expect(pr10.departments.sales).toBe(1);
  });

  // ── Transcript Overlay ──

  test('transcript score overlays when API score is null', () => {
    // PR-8 is TRANSCRIPT-only, no API signal
    const transcriptScores = {
      'PR-8_marketing': { score: 4, confidence: 0.8, evidence: 'Good ABM' },
    };
    const result = gradeProcess({}, {}, transcriptScores, {});
    const pr8 = result.find((g) => g.id === 'PR-8');
    expect(pr8.departments.marketing).toBe(4);
  });

  test('transcript score overlays API score when confidence > 0.7', () => {
    // PR-5 has API signals for score 2, but transcript says 5 with high confidence
    const signals = {
      has_lead_routing_workflow: false,
      has_cs_handoff_workflow: false,
    };
    const transcriptScores = {
      'PR-5_marketing': { score: 5, confidence: 0.8, evidence: 'Excellent handoffs' },
    };
    const result = gradeProcess(signals, {}, transcriptScores, {});
    const pr5 = result.find((g) => g.id === 'PR-5');
    expect(pr5.departments.marketing).toBe(5);
  });

  test('transcript score does NOT overlay API score when confidence <= 0.7', () => {
    const signals = {
      has_lead_routing_workflow: false,
      has_cs_handoff_workflow: false,
    };
    const transcriptScores = {
      'PR-5_marketing': { score: 5, confidence: 0.5, evidence: 'Maybe good' },
    };
    const result = gradeProcess(signals, {}, transcriptScores, {});
    const pr5 = result.find((g) => g.id === 'PR-5');
    // Should keep API score of 2
    expect(pr5.departments.marketing).toBe(2);
  });

  // ── Consultant Override ──

  test('consultant score overrides everything', () => {
    const signals = {
      lifecycle_stages_covered: ['subscriber', 'lead', 'mql', 'sql', 'customer'],
      lead_status_workflow_count: 3,
      has_cross_object_sync: true,
    };
    const transcriptScores = {
      'PR-1_marketing': { score: 4, confidence: 0.9, evidence: 'Good lifecycle' },
    };
    const consultantScores = {
      'PR-1_marketing': { score: 2, notes: 'Actually weak' },
    };
    const result = gradeProcess(signals, {}, transcriptScores, consultantScores);
    const pr1 = result.find((g) => g.id === 'PR-1');
    expect(pr1.departments.marketing).toBe(2);
  });

  test('consultant override works across multiple competencies', () => {
    const consultantScores = {
      'PR-2_sales': { score: 5, notes: 'Excellent pipeline' },
      'PR-4_partners': { score: 3, notes: 'Decent partner program' },
    };
    const result = gradeProcess({}, {}, {}, consultantScores);
    const pr2 = result.find((g) => g.id === 'PR-2');
    expect(pr2.departments.sales).toBe(5);
    const pr4 = result.find((g) => g.id === 'PR-4');
    expect(pr4.departments.partners).toBe(3);
  });

  // ── Signal Collection ──

  test('API grading produces signals with name, value, impact, source', () => {
    const signals = {
      lifecycle_stages_covered: ['subscriber', 'lead', 'mql', 'sql', 'customer'],
      lead_status_workflow_count: 3,
      has_cross_object_sync: true,
    };
    const result = gradeProcess(signals, {}, {}, {});
    const pr1 = result.find((g) => g.id === 'PR-1');
    expect(pr1.signals.length).toBeGreaterThan(0);
    for (const signal of pr1.signals) {
      expect(signal).toHaveProperty('name');
      expect(signal).toHaveProperty('value');
      expect(signal).toHaveProperty('impact');
      expect(signal).toHaveProperty('source');
    }
  });

  test('consultant override produces consultant-sourced signal', () => {
    const consultantScores = {
      'PR-3_cs': { score: 4, notes: 'Good CS lifecycle' },
    };
    const result = gradeProcess({}, {}, {}, consultantScores);
    const pr3 = result.find((g) => g.id === 'PR-3');
    const signal = pr3.signals.find((s) => s.source === 'consultant');
    expect(signal).toBeDefined();
    expect(signal.value).toContain('Good CS lifecycle');
  });

  test('transcript overlay produces transcript-sourced signal', () => {
    const transcriptScores = {
      'PR-8_sales': { score: 3, confidence: 0.8, evidence: 'Some ABM usage' },
    };
    const result = gradeProcess({}, {}, transcriptScores, {});
    const pr8 = result.find((g) => g.id === 'PR-8');
    const signal = pr8.signals.find((s) => s.source === 'transcript');
    expect(signal).toBeDefined();
    expect(signal.value).toContain('Some ABM usage');
  });

  test('no signals when no data', () => {
    const result = gradeProcess({}, {}, {}, {});
    // Competencies with no API signals and no transcript/consultant data should have no signals
    const pr8 = result.find((g) => g.id === 'PR-8');
    expect(pr8.signals).toEqual([]);
  });

  // ── Impact Derivation ──

  test('impact is negative for score 1-2, neutral for 3, positive for 4-5', () => {
    const transcriptScores = {
      'PR-8_marketing': { score: 1, confidence: 0.8, evidence: 'No ABM' },
      'PR-8_sales': { score: 3, confidence: 0.8, evidence: 'Basic ABM' },
    };
    const consultantScores = {
      'PR-3_cs': { score: 5, notes: 'Best practice CS' },
    };
    const result = gradeProcess({}, {}, transcriptScores, consultantScores);
    const pr8 = result.find((g) => g.id === 'PR-8');
    const mktSignal = pr8.signals.find((s) => s.name.includes('marketing'));
    const salesSignal = pr8.signals.find((s) => s.name.includes('sales'));
    expect(mktSignal.impact).toBe('negative');
    expect(salesSignal.impact).toBe('neutral');

    const pr3 = result.find((g) => g.id === 'PR-3');
    const csSignal = pr3.signals.find((s) => s.source === 'consultant');
    expect(csSignal.impact).toBe('positive');
  });
});
