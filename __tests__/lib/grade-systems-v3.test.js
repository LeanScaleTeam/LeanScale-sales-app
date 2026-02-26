/**
 * Tests for v3 Systems Pillar Grader (SY-1 through SY-7)
 *
 * Covers:
 * - lib/diagnostic-engine/v3/graders/grade-systems.js
 * - API signal extraction and scoring for each competency
 * - v2 1-3 scale to v3 1-5 scale mapping (SY-1 combines F1+F4+F5)
 * - Department-specific scoring (SY-2 marketing, SY-3 sales, SY-4 cs, SY-5 partners)
 * - Cross-department scoring (SY-1, SY-7 all depts)
 * - Transcript/consultant overlay behavior
 * - Signal collection per competency
 */

describe('gradeSystems - v3 Systems Pillar', () => {
  let gradeSystems;

  beforeAll(() => {
    ({ gradeSystems } = require('../../lib/diagnostic-engine/v3/graders/grade-systems'));
  });

  // ── Basic Structure ──

  test('returns an array of 7 competency grade objects', () => {
    const result = gradeSystems({}, {}, {}, {});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(7);
  });

  test('each grade has the correct shape', () => {
    const result = gradeSystems({}, {}, {}, {});
    for (const grade of result) {
      expect(grade).toHaveProperty('id');
      expect(grade).toHaveProperty('name');
      expect(grade).toHaveProperty('pillar', 'systems');
      expect(grade).toHaveProperty('departments');
      expect(grade).toHaveProperty('source');
      expect(grade).toHaveProperty('signals');
      expect(grade).toHaveProperty('serviceIds');
      expect(typeof grade.departments).toBe('object');
      expect(Array.isArray(grade.signals)).toBe(true);
      expect(Array.isArray(grade.serviceIds)).toBe(true);
    }
  });

  test('returns competencies in order SY-1 through SY-7', () => {
    const result = gradeSystems({}, {}, {}, {});
    const ids = result.map((g) => g.id);
    expect(ids).toEqual(['SY-1', 'SY-2', 'SY-3', 'SY-4', 'SY-5', 'SY-6', 'SY-7']);
  });

  // ── Correct Names, Sources, and Service IDs ──

  test('SY-1 has correct metadata', () => {
    const result = gradeSystems({}, {}, {}, {});
    const sy1 = result.find((g) => g.id === 'SY-1');
    expect(sy1.name).toBe('CRM configuration & optimization');
    expect(sy1.source).toBe('API_ONLY');
    expect(sy1.serviceIds).toEqual(['hubspot-impl', 'salesforce-impl', 'foundational-automations-and-reporting-logic']);
  });

  test('SY-2 has correct metadata', () => {
    const result = gradeSystems({}, {}, {}, {});
    const sy2 = result.find((g) => g.id === 'SY-2');
    expect(sy2.name).toBe('Marketing automation platform');
    expect(sy2.source).toBe('API_PLUS');
    expect(sy2.serviceIds).toEqual(['marketing-automation-platform-implementation']);
  });

  test('SY-3 has correct metadata', () => {
    const result = gradeSystems({}, {}, {}, {});
    const sy3 = result.find((g) => g.id === 'SY-3');
    expect(sy3.name).toBe('Sales engagement platform');
    expect(sy3.source).toBe('API_PLUS');
    expect(sy3.serviceIds).toEqual(['sales-engagement-platform', 'automated-outbound-process']);
  });

  test('SY-4 has correct metadata', () => {
    const result = gradeSystems({}, {}, {}, {});
    const sy4 = result.find((g) => g.id === 'SY-4');
    expect(sy4.name).toBe('CS / support platform');
    expect(sy4.source).toBe('API_PLUS');
    expect(sy4.serviceIds).toEqual(['customer-success-platform-implementation', 'support-system-implementation']);
  });

  test('SY-5 has correct metadata', () => {
    const result = gradeSystems({}, {}, {}, {});
    const sy5 = result.find((g) => g.id === 'SY-5');
    expect(sy5.name).toBe('Partner management platform');
    expect(sy5.source).toBe('INTAKE');
    expect(sy5.serviceIds).toEqual(['partnership-success-platform-implementation']);
  });

  test('SY-6 has correct metadata', () => {
    const result = gradeSystems({}, {}, {}, {});
    const sy6 = result.find((g) => g.id === 'SY-6');
    expect(sy6.name).toBe('Intelligence tools (enrichment, CI)');
    expect(sy6.source).toBe('API_ONLY');
    expect(sy6.serviceIds).toEqual(['automated-inbound-data-enrichment', 'clay-impl']);
  });

  test('SY-7 has correct metadata', () => {
    const result = gradeSystems({}, {}, {}, {});
    const sy7 = result.find((g) => g.id === 'SY-7');
    expect(sy7.name).toBe('Integration / automation health');
    expect(sy7.source).toBe('API_ONLY');
    expect(sy7.serviceIds).toEqual(['crm-erp-integration']);
  });

  // ── Department Coverage ──

  test('SY-1 applies to all 4 departments', () => {
    const result = gradeSystems({}, {}, {}, {});
    const sy1 = result.find((g) => g.id === 'SY-1');
    expect(sy1.departments).toHaveProperty('marketing');
    expect(sy1.departments).toHaveProperty('sales');
    expect(sy1.departments).toHaveProperty('cs');
    expect(sy1.departments).toHaveProperty('partners');
  });

  test('SY-2 applies only to marketing', () => {
    const result = gradeSystems({}, {}, {}, {});
    const sy2 = result.find((g) => g.id === 'SY-2');
    expect(sy2.departments).toHaveProperty('marketing');
    expect(sy2.departments.sales).toBeUndefined();
    expect(sy2.departments.cs).toBeUndefined();
    expect(sy2.departments.partners).toBeUndefined();
  });

  test('SY-3 applies only to sales', () => {
    const result = gradeSystems({}, {}, {}, {});
    const sy3 = result.find((g) => g.id === 'SY-3');
    expect(sy3.departments).toHaveProperty('sales');
    expect(sy3.departments.marketing).toBeUndefined();
    expect(sy3.departments.cs).toBeUndefined();
    expect(sy3.departments.partners).toBeUndefined();
  });

  test('SY-4 applies only to cs', () => {
    const result = gradeSystems({}, {}, {}, {});
    const sy4 = result.find((g) => g.id === 'SY-4');
    expect(sy4.departments).toHaveProperty('cs');
    expect(sy4.departments.marketing).toBeUndefined();
    expect(sy4.departments.sales).toBeUndefined();
    expect(sy4.departments.partners).toBeUndefined();
  });

  test('SY-5 applies only to partners', () => {
    const result = gradeSystems({}, {}, {}, {});
    const sy5 = result.find((g) => g.id === 'SY-5');
    expect(sy5.departments).toHaveProperty('partners');
    expect(sy5.departments.marketing).toBeUndefined();
    expect(sy5.departments.sales).toBeUndefined();
    expect(sy5.departments.cs).toBeUndefined();
  });

  test('SY-6 applies to marketing and sales', () => {
    const result = gradeSystems({}, {}, {}, {});
    const sy6 = result.find((g) => g.id === 'SY-6');
    expect(sy6.departments).toHaveProperty('marketing');
    expect(sy6.departments).toHaveProperty('sales');
    expect(sy6.departments.cs).toBeUndefined();
    expect(sy6.departments.partners).toBeUndefined();
  });

  test('SY-7 applies to all 4 departments', () => {
    const result = gradeSystems({}, {}, {}, {});
    const sy7 = result.find((g) => g.id === 'SY-7');
    expect(sy7.departments).toHaveProperty('marketing');
    expect(sy7.departments).toHaveProperty('sales');
    expect(sy7.departments).toHaveProperty('cs');
    expect(sy7.departments).toHaveProperty('partners');
  });

  // ══════════════════════════════════════════════
  // SY-1: CRM Configuration (F1+F4+F5 combined)
  // ══════════════════════════════════════════════

  describe('SY-1 - CRM configuration & optimization', () => {
    test('scores 5 when all sub-scores are high (avg >= 2.7)', () => {
      const signals = {
        // F1 high: deal_custom >=10 (3), contact_custom >=30 (3), enrichment >=20 (3) -> F1 avg=3
        deal_custom_properties: 15,
        contact_custom_properties: 40,
        enrichment_field_count: 25,
        // F4 high: workflows >=20 (3), categories >=4 (3), task_auto (3) -> F4 avg=3
        total_active_workflows: 25,
        workflow_category_count: 5,
        has_task_automation: true,
        // F5 high: teams >=3 (3), coverage >=90 (3) -> F5 avg=3
        team_count: 4,
        owner_to_team_coverage: 95,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy1 = result.find((g) => g.id === 'SY-1');
      expect(sy1.departments.marketing).toBe(5);
      expect(sy1.departments.sales).toBe(5);
      expect(sy1.departments.cs).toBe(5);
      expect(sy1.departments.partners).toBe(5);
    });

    test('scores 4 when sub-scores are moderately high (avg >= 2.3)', () => {
      const signals = {
        // F1 moderate: deal >=5 (2), contact >=10 (2), enrichment >=5 (2) -> F1 avg=2
        deal_custom_properties: 7,
        contact_custom_properties: 15,
        enrichment_field_count: 10,
        // F4 high: workflows >=20 (3), categories >=4 (3), task_auto (3) -> F4 avg=3
        total_active_workflows: 25,
        workflow_category_count: 5,
        has_task_automation: true,
        // F5 high: teams >=3 (3), coverage >=90 (3) -> F5 avg=3
        team_count: 4,
        owner_to_team_coverage: 95,
      };
      // F1=2, F4=3, F5=3 -> overall avg = 2.67 -> score = 4
      const result = gradeSystems(signals, {}, {}, {});
      const sy1 = result.find((g) => g.id === 'SY-1');
      expect(sy1.departments.marketing).toBe(4);
    });

    test('scores 3 when sub-scores are moderate (avg >= 1.7)', () => {
      const signals = {
        // F1 low: deal <5 (1), contact <10 (1), enrichment <5 (1) -> F1 avg=1
        deal_custom_properties: 2,
        contact_custom_properties: 5,
        enrichment_field_count: 2,
        // F4 moderate: workflows >=10 (2), categories >=2 (2), no task auto (1) -> F4 avg=1.67
        total_active_workflows: 12,
        workflow_category_count: 3,
        has_task_automation: false,
        // F5 high: teams >=3 (3), coverage >=90 (3) -> F5 avg=3
        team_count: 4,
        owner_to_team_coverage: 95,
      };
      // F1=1, F4=1.67, F5=3 -> overall avg = 1.89 -> score = 3
      const result = gradeSystems(signals, {}, {}, {});
      const sy1 = result.find((g) => g.id === 'SY-1');
      expect(sy1.departments.marketing).toBe(3);
    });

    test('scores 2 when sub-scores are low (avg >= 1.3)', () => {
      const signals = {
        deal_custom_properties: 2,
        contact_custom_properties: 5,
        enrichment_field_count: 2,
        total_active_workflows: 5,
        workflow_category_count: 1,
        has_task_automation: false,
        team_count: 1,
        owner_to_team_coverage: 60,
      };
      // F1=1, F4=1, F5=2 -> avg = 1.33 -> score = 2
      const result = gradeSystems(signals, {}, {}, {});
      const sy1 = result.find((g) => g.id === 'SY-1');
      expect(sy1.departments.marketing).toBe(2);
    });

    test('scores 1 when all sub-scores are minimal (avg < 1.3)', () => {
      const signals = {
        deal_custom_properties: 0,
        contact_custom_properties: 0,
        enrichment_field_count: 0,
        total_active_workflows: 0,
        workflow_category_count: 0,
        has_task_automation: false,
        team_count: 0,
        owner_to_team_coverage: 0,
      };
      // F1=1, F4=1, F5=1 -> avg = 1 -> score = 1
      const result = gradeSystems(signals, {}, {}, {});
      const sy1 = result.find((g) => g.id === 'SY-1');
      expect(sy1.departments.marketing).toBe(1);
    });

    test('applies same score to all departments', () => {
      const signals = {
        deal_custom_properties: 15,
        contact_custom_properties: 40,
        enrichment_field_count: 25,
        total_active_workflows: 25,
        workflow_category_count: 5,
        has_task_automation: true,
        team_count: 4,
        owner_to_team_coverage: 95,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy1 = result.find((g) => g.id === 'SY-1');
      const score = sy1.departments.marketing;
      expect(sy1.departments.sales).toBe(score);
      expect(sy1.departments.cs).toBe(score);
      expect(sy1.departments.partners).toBe(score);
    });

    test('collects signals from F1, F4, and F5 sub-scores', () => {
      const signals = {
        deal_custom_properties: 15,
        contact_custom_properties: 40,
        enrichment_field_count: 25,
        total_active_workflows: 25,
        workflow_category_count: 5,
        has_task_automation: true,
        team_count: 4,
        owner_to_team_coverage: 95,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy1 = result.find((g) => g.id === 'SY-1');
      expect(sy1.signals.length).toBeGreaterThan(0);
      // Should have signals from all three sub-areas
      const signalNames = sy1.signals.map((s) => s.name.toLowerCase());
      const hasF1Signal = signalNames.some((n) => n.includes('custom') || n.includes('enrichment') || n.includes('data model'));
      const hasF4Signal = signalNames.some((n) => n.includes('workflow') || n.includes('automation'));
      const hasF5Signal = signalNames.some((n) => n.includes('team') || n.includes('owner'));
      expect(hasF1Signal).toBe(true);
      expect(hasF4Signal).toBe(true);
      expect(hasF5Signal).toBe(true);
    });
  });

  // ══════════════════════════════════════════════
  // SY-2: Marketing Automation Platform
  // ══════════════════════════════════════════════

  describe('SY-2 - Marketing automation platform', () => {
    test('scores 5 with emails>50, forms>5, lists>10', () => {
      const signals = {
        marketing_email_count: 60,
        form_count: 8,
        total_active_lists: 15,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy2 = result.find((g) => g.id === 'SY-2');
      expect(sy2.departments.marketing).toBe(5);
    });

    test('scores 4 with emails>20, forms>2', () => {
      const signals = {
        marketing_email_count: 30,
        form_count: 4,
        total_active_lists: 5,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy2 = result.find((g) => g.id === 'SY-2');
      expect(sy2.departments.marketing).toBe(4);
    });

    test('scores 3 with emails>0', () => {
      const signals = {
        marketing_email_count: 5,
        form_count: 0,
        total_active_lists: 0,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy2 = result.find((g) => g.id === 'SY-2');
      expect(sy2.departments.marketing).toBe(3);
    });

    test('scores 2 with only forms>0', () => {
      const signals = {
        marketing_email_count: 0,
        form_count: 1,
        total_active_lists: 0,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy2 = result.find((g) => g.id === 'SY-2');
      expect(sy2.departments.marketing).toBe(2);
    });

    test('scores 1 with nothing', () => {
      const signals = {
        marketing_email_count: 0,
        form_count: 0,
        total_active_lists: 0,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy2 = result.find((g) => g.id === 'SY-2');
      expect(sy2.departments.marketing).toBe(1);
    });

    test('collects marketing signals', () => {
      const signals = {
        marketing_email_count: 60,
        form_count: 8,
        total_active_lists: 15,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy2 = result.find((g) => g.id === 'SY-2');
      expect(sy2.signals.length).toBeGreaterThan(0);
    });
  });

  // ══════════════════════════════════════════════
  // SY-3: Sales Engagement Platform
  // ══════════════════════════════════════════════

  describe('SY-3 - Sales engagement platform', () => {
    test('scores 5 with both sequences and engagement tool', () => {
      const signals = {
        has_sequences: true,
        sequence_count: 5,
        has_sales_engagement_tool: true,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy3 = result.find((g) => g.id === 'SY-3');
      expect(sy3.departments.sales).toBe(5);
    });

    test('scores 4 with engagement tool detected but no active sequences', () => {
      const signals = {
        has_sequences: false,
        sequence_count: 0,
        has_sales_engagement_tool: true,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy3 = result.find((g) => g.id === 'SY-3');
      expect(sy3.departments.sales).toBe(4);
    });

    test('scores 3 with sequences but no engagement tool', () => {
      const signals = {
        has_sequences: true,
        sequence_count: 3,
        has_sales_engagement_tool: false,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy3 = result.find((g) => g.id === 'SY-3');
      expect(sy3.departments.sales).toBe(3);
    });

    test('scores 2 with basic CRM (no sequences, no tool)', () => {
      const signals = {
        has_sequences: false,
        sequence_count: 0,
        has_sales_engagement_tool: false,
        // some CRM exists implicitly (we are running a diagnostic)
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy3 = result.find((g) => g.id === 'SY-3');
      expect(sy3.departments.sales).toBe(2);
    });
  });

  // ══════════════════════════════════════════════
  // SY-4: CS / Support Platform
  // ══════════════════════════════════════════════

  describe('SY-4 - CS / support platform', () => {
    test('scores 5 with all 3 indicators', () => {
      const signals = {
        ticket_pipeline_customized: true,
        has_cs_handoff_workflow: true,
        has_health_scoring: true,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy4 = result.find((g) => g.id === 'SY-4');
      expect(sy4.departments.cs).toBe(5);
    });

    test('scores 4 with 2 of 3 indicators', () => {
      const signals = {
        ticket_pipeline_customized: true,
        has_cs_handoff_workflow: true,
        has_health_scoring: false,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy4 = result.find((g) => g.id === 'SY-4');
      expect(sy4.departments.cs).toBe(4);
    });

    test('scores 3 with only ticket pipeline customized', () => {
      const signals = {
        ticket_pipeline_customized: true,
        has_cs_handoff_workflow: false,
        has_health_scoring: false,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy4 = result.find((g) => g.id === 'SY-4');
      expect(sy4.departments.cs).toBe(3);
    });

    test('scores 2 with basic ticketing (no customization)', () => {
      const signals = {
        ticket_pipeline_customized: false,
        has_cs_handoff_workflow: false,
        has_health_scoring: false,
        ticket_pipeline_count: 1, // basic ticket system exists
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy4 = result.find((g) => g.id === 'SY-4');
      expect(sy4.departments.cs).toBe(2);
    });

    test('scores 1 with nothing', () => {
      const signals = {
        ticket_pipeline_customized: false,
        has_cs_handoff_workflow: false,
        has_health_scoring: false,
        ticket_pipeline_count: 0,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy4 = result.find((g) => g.id === 'SY-4');
      expect(sy4.departments.cs).toBe(1);
    });
  });

  // ══════════════════════════════════════════════
  // SY-5: Partner Management Platform
  // ══════════════════════════════════════════════

  describe('SY-5 - Partner management platform', () => {
    test('scores 5 with A5 partner and partner pipeline', () => {
      const signals = { has_partner_pipeline: true };
      const intakeAnswers = { A5: true };
      const result = gradeSystems(signals, intakeAnswers, {}, {});
      const sy5 = result.find((g) => g.id === 'SY-5');
      expect(sy5.departments.partners).toBe(5);
    });

    test('scores 3 with partner pipeline but no intake answer', () => {
      const signals = { has_partner_pipeline: true };
      const result = gradeSystems(signals, {}, {}, {});
      const sy5 = result.find((g) => g.id === 'SY-5');
      expect(sy5.departments.partners).toBe(3);
    });

    test('scores 1 with no partner signals', () => {
      const signals = { has_partner_pipeline: false };
      const intakeAnswers = { A5: false };
      const result = gradeSystems(signals, intakeAnswers, {}, {});
      const sy5 = result.find((g) => g.id === 'SY-5');
      expect(sy5.departments.partners).toBe(1);
    });

    test('transcript score overlays API score', () => {
      const signals = { has_partner_pipeline: false };
      const transcriptScores = {
        'SY-5_partners': { score: 4, confidence: 0.8, evidence: 'Has partner portal' },
      };
      const result = gradeSystems(signals, {}, transcriptScores, {});
      const sy5 = result.find((g) => g.id === 'SY-5');
      expect(sy5.departments.partners).toBe(4);
    });

    test('consultant overrides everything', () => {
      const signals = { has_partner_pipeline: false };
      const transcriptScores = {
        'SY-5_partners': { score: 4, confidence: 0.8, evidence: 'Has partner portal' },
      };
      const consultantScores = {
        'SY-5_partners': { score: 2, notes: 'Actually quite weak' },
      };
      const result = gradeSystems(signals, {}, transcriptScores, consultantScores);
      const sy5 = result.find((g) => g.id === 'SY-5');
      expect(sy5.departments.partners).toBe(2);
    });
  });

  // ══════════════════════════════════════════════
  // SY-6: Intelligence Tools (enrichment, CI)
  // ══════════════════════════════════════════════

  describe('SY-6 - Intelligence tools', () => {
    test('scores 5 with multi-object enrichment and fields >= 20', () => {
      const signals = {
        enrichment_tools: [{ name: 'ZoomInfo', fieldCount: 25 }],
        enrichment_field_count: 25,
        enrichment_multi_object: true,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy6 = result.find((g) => g.id === 'SY-6');
      expect(sy6.departments.marketing).toBe(5);
      expect(sy6.departments.sales).toBe(5);
    });

    test('scores 4 with tools and fields >= 10', () => {
      const signals = {
        enrichment_tools: [{ name: 'Clearbit', fieldCount: 12 }],
        enrichment_field_count: 12,
        enrichment_multi_object: false,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy6 = result.find((g) => g.id === 'SY-6');
      expect(sy6.departments.marketing).toBe(4);
    });

    test('scores 3 with tools detected but few fields', () => {
      const signals = {
        enrichment_tools: [{ name: 'Apollo', fieldCount: 5 }],
        enrichment_field_count: 5,
        enrichment_multi_object: false,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy6 = result.find((g) => g.id === 'SY-6');
      expect(sy6.departments.marketing).toBe(3);
    });

    test('scores 2 with some enrichment fields but no tools', () => {
      const signals = {
        enrichment_tools: [],
        enrichment_field_count: 3,
        enrichment_multi_object: false,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy6 = result.find((g) => g.id === 'SY-6');
      expect(sy6.departments.marketing).toBe(2);
    });

    test('scores 1 with nothing', () => {
      const signals = {
        enrichment_tools: [],
        enrichment_field_count: 0,
        enrichment_multi_object: false,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy6 = result.find((g) => g.id === 'SY-6');
      expect(sy6.departments.marketing).toBe(1);
    });

    test('applies same score to both marketing and sales', () => {
      const signals = {
        enrichment_tools: [{ name: 'ZoomInfo', fieldCount: 25 }],
        enrichment_field_count: 25,
        enrichment_multi_object: true,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy6 = result.find((g) => g.id === 'SY-6');
      expect(sy6.departments.marketing).toBe(sy6.departments.sales);
    });
  });

  // ══════════════════════════════════════════════
  // SY-7: Integration / Automation Health
  // ══════════════════════════════════════════════

  describe('SY-7 - Integration health', () => {
    test('scores 5 with named creds and connected apps > 5', () => {
      const signals = {
        connected_app_count: 8,
        named_credential_count: 3,
        integration_count: 10,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy7 = result.find((g) => g.id === 'SY-7');
      expect(sy7.departments.marketing).toBe(5);
    });

    test('scores 4 with connected apps > 3 (no named creds)', () => {
      const signals = {
        connected_app_count: 5,
        named_credential_count: 0,
        integration_count: 5,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy7 = result.find((g) => g.id === 'SY-7');
      expect(sy7.departments.marketing).toBe(4);
    });

    test('scores 3 with some integrations', () => {
      const signals = {
        connected_app_count: 2,
        named_credential_count: 0,
        integration_count: 3,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy7 = result.find((g) => g.id === 'SY-7');
      expect(sy7.departments.marketing).toBe(3);
    });

    test('scores 2 with minimal integrations', () => {
      const signals = {
        connected_app_count: 1,
        named_credential_count: 0,
        integration_count: 1,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy7 = result.find((g) => g.id === 'SY-7');
      expect(sy7.departments.marketing).toBe(2);
    });

    test('scores 1 with no integrations', () => {
      const signals = {
        connected_app_count: 0,
        named_credential_count: 0,
        integration_count: 0,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy7 = result.find((g) => g.id === 'SY-7');
      expect(sy7.departments.marketing).toBe(1);
    });

    test('applies same score to all departments', () => {
      const signals = {
        connected_app_count: 8,
        named_credential_count: 3,
        integration_count: 10,
      };
      const result = gradeSystems(signals, {}, {}, {});
      const sy7 = result.find((g) => g.id === 'SY-7');
      const score = sy7.departments.marketing;
      expect(sy7.departments.sales).toBe(score);
      expect(sy7.departments.cs).toBe(score);
      expect(sy7.departments.partners).toBe(score);
    });
  });

  // ══════════════════════════════════════════════
  // Transcript & Consultant Overlay
  // ══════════════════════════════════════════════

  describe('Transcript and consultant overlay', () => {
    test('transcript score overrides API score when present', () => {
      const signals = {
        marketing_email_count: 60,
        form_count: 8,
        total_active_lists: 15,
      };
      const transcriptScores = {
        'SY-2_marketing': { score: 2, confidence: 0.8, evidence: 'Poor usage despite having tools' },
      };
      const result = gradeSystems(signals, {}, transcriptScores, {});
      const sy2 = result.find((g) => g.id === 'SY-2');
      expect(sy2.departments.marketing).toBe(2);
    });

    test('consultant score overrides both API and transcript', () => {
      const signals = {
        marketing_email_count: 60,
        form_count: 8,
        total_active_lists: 15,
      };
      const transcriptScores = {
        'SY-2_marketing': { score: 2, confidence: 0.8, evidence: 'Poor usage' },
      };
      const consultantScores = {
        'SY-2_marketing': { score: 4, notes: 'Actually good platform usage' },
      };
      const result = gradeSystems(signals, {}, transcriptScores, consultantScores);
      const sy2 = result.find((g) => g.id === 'SY-2');
      expect(sy2.departments.marketing).toBe(4);
    });

    test('consultant overrides on SY-1 for a specific department', () => {
      const signals = {
        deal_custom_properties: 0,
        contact_custom_properties: 0,
        enrichment_field_count: 0,
        total_active_workflows: 0,
        workflow_category_count: 0,
        has_task_automation: false,
        team_count: 0,
        owner_to_team_coverage: 0,
      };
      const consultantScores = {
        'SY-1_marketing': { score: 5, notes: 'Excellent CRM config' },
      };
      const result = gradeSystems(signals, {}, {}, consultantScores);
      const sy1 = result.find((g) => g.id === 'SY-1');
      expect(sy1.departments.marketing).toBe(5);
      // Other depts should remain at API score (1)
      expect(sy1.departments.sales).toBe(1);
    });

    test('handles mixed transcript and consultant across competencies', () => {
      const signals = {
        marketing_email_count: 60,
        form_count: 8,
        total_active_lists: 15,
        has_sequences: true,
        sequence_count: 5,
        has_sales_engagement_tool: true,
      };
      const transcriptScores = {
        'SY-2_marketing': { score: 3, confidence: 0.7, evidence: 'Moderate usage' },
      };
      const consultantScores = {
        'SY-3_sales': { score: 2, notes: 'Low adoption of engagement tool' },
      };
      const result = gradeSystems(signals, {}, transcriptScores, consultantScores);

      const sy2 = result.find((g) => g.id === 'SY-2');
      expect(sy2.departments.marketing).toBe(3); // transcript override

      const sy3 = result.find((g) => g.id === 'SY-3');
      expect(sy3.departments.sales).toBe(2); // consultant override
    });
  });

  // ── Empty / Missing Signals ──

  describe('Edge cases with empty signals', () => {
    test('handles completely empty signals object', () => {
      const result = gradeSystems({}, {}, {}, {});
      expect(result.length).toBe(7);
      // All should produce some score (no crashes)
      for (const grade of result) {
        for (const dept of Object.keys(grade.departments)) {
          const score = grade.departments[dept];
          expect(typeof score).toBe('number');
          expect(score).toBeGreaterThanOrEqual(1);
          expect(score).toBeLessThanOrEqual(5);
        }
      }
    });

    test('handles undefined signals gracefully', () => {
      const result = gradeSystems(undefined, undefined, undefined, undefined);
      expect(result.length).toBe(7);
    });

    test('handles null signals gracefully', () => {
      const result = gradeSystems(null, null, null, null);
      expect(result.length).toBe(7);
    });
  });
});
