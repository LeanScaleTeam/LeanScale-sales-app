/**
 * Tests for Salesforce Signal Extractor
 * TDD Phase 1: Tests define the expected behavior of extractSalesforceSignals
 *
 * The extractor maps Salesforce metadata to the same signal keys used
 * by the HubSpot extractor, plus Platform Health signals unique to Salesforce.
 */

import { extractSalesforceSignals } from '../../lib/diagnostic-engine/signal-extractor-sf';

// ── Test Fixtures ──

function makeField(name, label, type = 'string', custom = false) {
  return { name, label, type, custom };
}

function makeObjectDescribe(fields = []) {
  return { fields };
}

function buildMetadata(overrides = {}) {
  return {
    objects: overrides.objects || {},
    stages: overrides.stages || {},
    users: overrides.users || [],
    flows: overrides.flows || [],
    workflowRules: overrides.workflowRules || [],
    validationRules: overrides.validationRules || [],
    apexTriggers: overrides.apexTriggers || [],
    apexClasses: overrides.apexClasses || [],
    profiles: overrides.profiles || [],
    permissionSets: overrides.permissionSets || [],
    roles: overrides.roles || [],
    reports: overrides.reports || [],
    dashboards: overrides.dashboards || [],
    connectedApps: overrides.connectedApps || [],
    namedCredentials: overrides.namedCredentials || [],
    recordTypes: overrides.recordTypes || [],
  };
}

// ── Tests ──

describe('extractSalesforceSignals', () => {
  test('exports extractSalesforceSignals as a function', () => {
    expect(typeof extractSalesforceSignals).toBe('function');
  });

  test('returns an object when called with empty metadata', () => {
    const result = extractSalesforceSignals(buildMetadata());
    expect(typeof result).toBe('object');
    expect(result).not.toBeNull();
  });

  test('handles null/undefined metadata gracefully', () => {
    expect(() => extractSalesforceSignals(null)).not.toThrow();
    expect(() => extractSalesforceSignals(undefined)).not.toThrow();
    expect(() => extractSalesforceSignals({})).not.toThrow();
  });

  // ── F1: CRM Data Model Signals ──

  describe('F1: CRM Data Model', () => {
    test('counts contact total properties from Contact + Lead objects', () => {
      const metadata = buildMetadata({
        objects: {
          Contact: makeObjectDescribe([
            makeField('FirstName', 'First Name'),
            makeField('LastName', 'Last Name'),
            makeField('Email', 'Email'),
          ]),
          Lead: makeObjectDescribe([
            makeField('Company', 'Company'),
            makeField('Status', 'Status'),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.contact_total_properties).toBe(5);
    });

    test('counts contact custom properties from Contact + Lead', () => {
      const metadata = buildMetadata({
        objects: {
          Contact: makeObjectDescribe([
            makeField('FirstName', 'First Name', 'string', false),
            makeField('ZoomInfo_Company__c', 'ZoomInfo Company', 'string', true),
          ]),
          Lead: makeObjectDescribe([
            makeField('Status', 'Status', 'string', false),
            makeField('Lead_Score__c', 'Lead Score', 'double', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.contact_custom_properties).toBe(2);
    });

    test('counts company total/custom properties from Account object', () => {
      const metadata = buildMetadata({
        objects: {
          Account: makeObjectDescribe([
            makeField('Name', 'Account Name', 'string', false),
            makeField('Industry', 'Industry', 'picklist', false),
            makeField('ARR__c', 'ARR', 'currency', true),
            makeField('ICP_Score__c', 'ICP Score', 'number', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.company_total_properties).toBe(4);
      expect(signals.company_custom_properties).toBe(2);
    });

    test('counts deal total/custom properties from Opportunity object', () => {
      const metadata = buildMetadata({
        objects: {
          Opportunity: makeObjectDescribe([
            makeField('Name', 'Opportunity Name', 'string', false),
            makeField('Amount', 'Amount', 'currency', false),
            makeField('StageName', 'Stage', 'picklist', false),
            makeField('MEDDIC_Score__c', 'MEDDIC Score', 'number', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.deal_total_properties).toBe(4);
      expect(signals.deal_custom_properties).toBe(1);
    });

    test('counts ticket total/custom properties from Case object', () => {
      const metadata = buildMetadata({
        objects: {
          Case: makeObjectDescribe([
            makeField('Subject', 'Subject', 'string', false),
            makeField('Status', 'Status', 'picklist', false),
            makeField('Priority', 'Priority', 'picklist', false),
            makeField('Escalation_Reason__c', 'Escalation Reason', 'string', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.ticket_total_properties).toBe(4);
      expect(signals.ticket_custom_properties).toBe(1);
    });

    test('returns 0 for missing objects', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.contact_total_properties).toBe(0);
      expect(signals.contact_custom_properties).toBe(0);
      expect(signals.company_total_properties).toBe(0);
      expect(signals.company_custom_properties).toBe(0);
      expect(signals.deal_total_properties).toBe(0);
      expect(signals.deal_custom_properties).toBe(0);
      expect(signals.ticket_total_properties).toBe(0);
      expect(signals.ticket_custom_properties).toBe(0);
    });
  });

  // ── F6: Enrichment Signals ──

  describe('F6: Data Enrichment', () => {
    test('detects ZoomInfo enrichment tool from Contact field names', () => {
      const metadata = buildMetadata({
        objects: {
          Contact: makeObjectDescribe([
            makeField('zi_revenue__c', 'ZoomInfo Revenue', 'currency', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.enrichment_tool_detected).toBe('ZoomInfo');
    });

    test('detects Clearbit enrichment tool from field labels', () => {
      const metadata = buildMetadata({
        objects: {
          Contact: makeObjectDescribe([
            makeField('cb_company', 'Clearbit Company', 'string', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.enrichment_tool_detected).toBe('Clearbit');
    });

    test('detects AdvizorPro enrichment from field names', () => {
      const metadata = buildMetadata({
        objects: {
          Contact: makeObjectDescribe([
            makeField('advizor_id__c', 'AdvizorPro ID', 'string', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.enrichment_tool_detected).toBe('AdvizorPro');
    });

    test('counts enrichment fields across Contact + Lead + Account', () => {
      const metadata = buildMetadata({
        objects: {
          Contact: makeObjectDescribe([
            makeField('zi_revenue__c', 'ZI Revenue', 'currency', true),
            makeField('zi_company_name__c', 'ZI Company', 'string', true),
          ]),
          Account: makeObjectDescribe([
            makeField('zi_industry__c', 'ZI Industry', 'string', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.enrichment_field_count).toBe(3);
    });

    test('returns null when no enrichment tool detected', () => {
      const metadata = buildMetadata({
        objects: {
          Contact: makeObjectDescribe([
            makeField('FirstName', 'First Name'),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.enrichment_tool_detected).toBeNull();
    });

    test('detects all enrichment tools with field counts', () => {
      const metadata = buildMetadata({
        objects: {
          Contact: makeObjectDescribe([
            makeField('zi_revenue__c', 'ZI Revenue', 'currency', true),
            makeField('clearbit_company__c', 'Clearbit Company', 'string', true),
          ]),
          Account: makeObjectDescribe([
            makeField('zi_industry__c', 'ZI Industry', 'string', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.enrichment_tools).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'ZoomInfo', fieldCount: 2 }),
          expect.objectContaining({ name: 'Clearbit', fieldCount: 1 }),
        ])
      );
    });

    test('detects multi-object enrichment (contacts + accounts)', () => {
      const metadata = buildMetadata({
        objects: {
          Contact: makeObjectDescribe([
            makeField('zi_revenue__c', 'ZI Revenue', 'currency', true),
          ]),
          Account: makeObjectDescribe([
            makeField('zi_industry__c', 'ZI Industry', 'string', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.enrichment_multi_object).toBe(true);
    });

    test('detects single-object enrichment returns false', () => {
      const metadata = buildMetadata({
        objects: {
          Contact: makeObjectDescribe([
            makeField('zi_revenue__c', 'ZI Revenue', 'currency', true),
          ]),
          Account: makeObjectDescribe([
            makeField('Name', 'Name', 'string', false),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.enrichment_multi_object).toBe(false);
    });
  });

  // ── F2: Pipeline Design ──

  describe('F2: Pipeline Design', () => {
    test('sets deal_pipeline_count to 1 (Salesforce single pipeline)', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.deal_pipeline_count).toBe(1);
    });

    test('maps opportunity stages with MasterLabel, DefaultProbability, IsClosed, IsWon', () => {
      const metadata = buildMetadata({
        stages: {
          opportunityStages: [
            { MasterLabel: 'Prospecting', DefaultProbability: 10, IsClosed: false, IsWon: false },
            { MasterLabel: 'Qualification', DefaultProbability: 20, IsClosed: false, IsWon: false },
            { MasterLabel: 'Closed Won', DefaultProbability: 100, IsClosed: true, IsWon: true },
            { MasterLabel: 'Closed Lost', DefaultProbability: 0, IsClosed: true, IsWon: false },
          ],
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.deal_pipeline_stages).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'Salesforce',
          stageCount: 4,
          hasClosedLost: true,
        }),
      ]));
      expect(signals.deal_pipeline_stages[0].probabilities).toEqual([10, 20, 100, 0]);
    });

    test('returns empty pipeline stages when stages not provided', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.deal_pipeline_stages).toEqual([]);
    });
  });

  // ── F3: Lifecycle & Lead Status ──

  describe('F3: Lifecycle & Lead Status', () => {
    test('detects lifecycle stages from LeadStatus picklist values', () => {
      const metadata = buildMetadata({
        objects: {
          Lead: makeObjectDescribe([
            {
              name: 'Status',
              label: 'Lead Status',
              type: 'picklist',
              custom: false,
              picklistValues: [
                { value: 'New', label: 'New' },
                { value: 'MQL', label: 'Marketing Qualified' },
                { value: 'SQL', label: 'Sales Qualified' },
                { value: 'Nurture', label: 'Nurture' },
              ],
            },
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.lifecycle_stages_covered).toEqual(
        expect.arrayContaining(['MQL', 'SQL'])
      );
    });

    test('returns empty array when no lifecycle stages detected', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.lifecycle_stages_covered).toEqual([]);
    });
  });

  // ── F4: Automation Engine ──

  describe('F4: Automation Engine', () => {
    test('counts total active workflows from flows + workflowRules', () => {
      const metadata = buildMetadata({
        flows: [
          { Label: 'Lead Assignment Flow', Status: 'Active' },
          { Label: 'Inactive Flow', Status: 'Inactive' },
        ],
        workflowRules: [
          { Name: 'Case Escalation', Active: true },
          { Name: 'Old Rule', Active: false },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      // Active = 1 active flow + 1 active workflowRule = 2
      expect(signals.total_active_workflows).toBe(2);
    });

    test('detects lead routing workflow from flow Label', () => {
      const metadata = buildMetadata({
        flows: [
          { Label: 'Lead Assignment Round Robin', Status: 'Active' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_lead_routing_workflow).toBe(true);
    });

    test('detects lead routing from workflowRule Name', () => {
      const metadata = buildMetadata({
        workflowRules: [
          { Name: 'Lead Routing to SDR', Active: true },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_lead_routing_workflow).toBe(true);
    });

    test('returns false for lead routing when no matching automations', () => {
      const metadata = buildMetadata({
        flows: [
          { Label: 'Opportunity Close', Status: 'Active' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_lead_routing_workflow).toBe(false);
    });

    test('categorizes automations into categories', () => {
      const metadata = buildMetadata({
        flows: [
          { Label: 'Lifecycle Stage Transition', Status: 'Active' },
          { Label: 'Task Reminder', Status: 'Active' },
          { Label: 'Slack Notification', Status: 'Active' },
          { Label: 'Deal Pipeline Update', Status: 'Active' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.workflow_categories).toHaveProperty('lifecycle');
      expect(signals.workflow_categories).toHaveProperty('task');
      expect(signals.workflow_categories).toHaveProperty('notification');
      expect(signals.workflow_categories).toHaveProperty('deal');
      expect(signals.workflow_category_count).toBeGreaterThanOrEqual(4);
    });

    test('detects task automation', () => {
      const metadata = buildMetadata({
        flows: [{ Label: 'Create Task for Follow-Up', Status: 'Active' }],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_task_automation).toBe(true);
    });

    test('detects deal creation automation', () => {
      const metadata = buildMetadata({
        flows: [{ Label: 'Auto Create Deal on MQL', Status: 'Active' }],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_deal_creation_automation).toBe(true);
    });

    test('detects enrichment workflow', () => {
      const metadata = buildMetadata({
        flows: [{ Label: 'ZoomInfo Enrichment Flow', Status: 'Active' }],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_enrichment_workflow).toBe(true);
    });

    test('detects stalled deal workflow', () => {
      const metadata = buildMetadata({
        flows: [{ Label: 'Stalled Deal Notification', Status: 'Active' }],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_stalled_deal_notification).toBe(true);
    });

    test('detects closed-won automation', () => {
      const metadata = buildMetadata({
        flows: [{ Label: 'Closed Won Customer Welcome', Status: 'Active' }],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_closed_won_automation).toBe(true);
    });

    test('detects CS handoff workflow', () => {
      const metadata = buildMetadata({
        flows: [{ Label: 'Sales to CS Handoff', Status: 'Active' }],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_cs_handoff_workflow).toBe(true);
    });

    test('detects onboarding workflow', () => {
      const metadata = buildMetadata({
        flows: [{ Label: 'New Customer Onboarding', Status: 'Active' }],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_onboarding_workflow).toBe(true);
    });

    test('detects referral workflow', () => {
      const metadata = buildMetadata({
        flows: [{ Label: 'Partner Referral Process', Status: 'Active' }],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_referral_workflow).toBe(true);
    });

    test('classifies lifecycle, lead_status, nurture, and attribution workflows', () => {
      const metadata = buildMetadata({
        flows: [
          { Label: 'Lifecycle Stage Transition', Status: 'Active' },
          { Label: 'New Lead Status Update', Status: 'Active' },
          { Label: 'Nurture Email Sequence', Status: 'Active' },
          { Label: 'Campaign Attribution Tracking', Status: 'Active' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.lifecycle_workflow_count).toBeGreaterThanOrEqual(1);
      expect(signals.lead_status_workflow_count).toBeGreaterThanOrEqual(1);
      expect(signals.nurture_workflow_count).toBeGreaterThanOrEqual(1);
      expect(signals.attribution_workflow_count).toBeGreaterThanOrEqual(1);
    });

    test('detects cross-object sync workflow', () => {
      const metadata = buildMetadata({
        flows: [{ Label: 'Company Contact Cross Object Sync', Status: 'Active' }],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_cross_object_sync).toBe(true);
    });

    test('counts disabled workflows (inactive flows + inactive rules)', () => {
      const metadata = buildMetadata({
        flows: [
          { Label: 'Active Flow', Status: 'Active' },
          { Label: 'Inactive Flow', Status: 'Inactive' },
          { Label: 'Draft Flow', Status: 'Draft' },
        ],
        workflowRules: [
          { Name: 'Active Rule', Active: true },
          { Name: 'Inactive Rule', Active: false },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.total_disabled_workflows).toBe(3);
    });
  });

  // ── F5: Team & Ownership ──

  describe('F5: Team & Ownership', () => {
    test('counts total owners from users array', () => {
      const metadata = buildMetadata({
        users: [
          { Id: '001', Name: 'User1', IsActive: true, UserRoleId: 'r1' },
          { Id: '002', Name: 'User2', IsActive: true, UserRoleId: 'r2' },
          { Id: '003', Name: 'User3', IsActive: true, UserRoleId: null },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.total_owners).toBe(3);
    });

    test('extracts team names from roles', () => {
      const metadata = buildMetadata({
        roles: [
          { Id: 'r1', Name: 'Sales', ParentRoleId: null },
          { Id: 'r2', Name: 'Marketing', ParentRoleId: null },
          { Id: 'r3', Name: 'SDR', ParentRoleId: 'r1' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.teams).toEqual(expect.arrayContaining(['Sales', 'Marketing', 'SDR']));
      expect(signals.team_count).toBe(3);
    });

    test('counts orphan owners (users without a role)', () => {
      const metadata = buildMetadata({
        users: [
          { Id: '001', Name: 'User1', IsActive: true, UserRoleId: 'r1' },
          { Id: '002', Name: 'User2', IsActive: true, UserRoleId: null },
          { Id: '003', Name: 'User3', IsActive: true, UserRoleId: '' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.orphan_owner_count).toBe(2);
    });

    test('calculates owner-to-team coverage as percentage', () => {
      const metadata = buildMetadata({
        users: [
          { Id: '001', Name: 'User1', IsActive: true, UserRoleId: 'r1' },
          { Id: '002', Name: 'User2', IsActive: true, UserRoleId: 'r2' },
          { Id: '003', Name: 'User3', IsActive: true, UserRoleId: null },
          { Id: '004', Name: 'User4', IsActive: true, UserRoleId: 'r1' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      // 3 out of 4 have roles = 75%
      expect(signals.owner_to_team_coverage).toBe(75);
    });

    test('returns 0 coverage when no users', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.owner_to_team_coverage).toBe(0);
    });
  });

  // ── M1-M7 Boolean Signals ──

  describe('M1-M7: Motion Signals', () => {
    test('counts forms as 0 (Salesforce has no native forms)', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.form_count).toBe(0);
    });

    test('counts marketing emails as 0 (not native to Salesforce)', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.marketing_email_count).toBe(0);
    });

    test('detects has_reporting_dashboards from dashboards array', () => {
      const metadata = buildMetadata({
        dashboards: [
          { Id: 'd1', Title: 'Sales Dashboard' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_reporting_dashboards).toBe(true);
    });

    test('detects has_reporting_dashboards as false when empty', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.has_reporting_dashboards).toBe(false);
    });

    test('detects has_speed_to_lead from automation names', () => {
      const metadata = buildMetadata({
        flows: [{ Label: 'Speed to Lead Notification', Status: 'Active' }],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_speed_to_lead).toBe(true);
    });

    test('detects deal source property from Opportunity fields', () => {
      const metadata = buildMetadata({
        objects: {
          Opportunity: makeObjectDescribe([
            makeField('deal_source', 'Deal Source', 'picklist', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_deal_source_property).toBe(true);
    });

    test('detects competitor property from Opportunity fields', () => {
      const metadata = buildMetadata({
        objects: {
          Opportunity: makeObjectDescribe([
            makeField('competitor', 'Competitor', 'text', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_competitor_property).toBe(true);
    });

    test('detects close reason property from Opportunity fields', () => {
      const metadata = buildMetadata({
        objects: {
          Opportunity: makeObjectDescribe([
            makeField('closed_lost_reason', 'Closed Lost Reason', 'picklist', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_close_reason_property).toBe(true);
    });

    test('detects has_partner_pipeline from opportunity stages', () => {
      const metadata = buildMetadata({
        stages: {
          opportunityStages: [
            { MasterLabel: 'Partner Deal', DefaultProbability: 50, IsClosed: false, IsWon: false },
          ],
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_partner_pipeline).toBe(true);
    });

    test('detects has_competitor_tracking from Opportunity fields', () => {
      const metadata = buildMetadata({
        objects: {
          Opportunity: makeObjectDescribe([
            makeField('competitors', 'Competitors', 'textarea', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_competitor_tracking).toBe(true);
    });

    test('detects has_closed_lost_reason from Opportunity fields', () => {
      const metadata = buildMetadata({
        objects: {
          Opportunity: makeObjectDescribe([
            makeField('closed_lost_reasons', 'Closed Lost Reasons', 'multipicklist', true),
          ]),
        },
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.has_closed_lost_reason).toBe(true);
    });
  });

  // ── Platform Health Signals (Salesforce-only) ──

  describe('Platform Health: Apex', () => {
    test('counts apex triggers', () => {
      const metadata = buildMetadata({
        apexTriggers: [
          { Name: 'AccountTrigger', TableEnumOrId: 'Account', LengthWithoutComments: 120 },
          { Name: 'OpportunityTrigger', TableEnumOrId: 'Opportunity', LengthWithoutComments: 200 },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.apex_trigger_count).toBe(2);
    });

    test('counts apex classes', () => {
      const metadata = buildMetadata({
        apexClasses: [
          { Name: 'AccountHandler', LengthWithoutComments: 500 },
          { Name: 'OpportunityHelper', LengthWithoutComments: 300 },
          { Name: 'TestAccountHandler', LengthWithoutComments: 200 },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.apex_class_count).toBe(3);
    });

    test('sums apex total lines (LengthWithoutComments)', () => {
      const metadata = buildMetadata({
        apexTriggers: [
          { Name: 'T1', LengthWithoutComments: 100 },
        ],
        apexClasses: [
          { Name: 'C1', LengthWithoutComments: 500 },
          { Name: 'C2', LengthWithoutComments: 300 },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.apex_total_lines).toBe(900);
    });

    test('returns 0 for apex counts when no apex metadata', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.apex_trigger_count).toBe(0);
      expect(signals.apex_class_count).toBe(0);
      expect(signals.apex_total_lines).toBe(0);
    });
  });

  describe('Platform Health: Validation Rules', () => {
    test('counts validation rules', () => {
      const metadata = buildMetadata({
        validationRules: [
          { FullName: 'Account.Require_Industry', EntityDefinition: 'Account', Active: true },
          { FullName: 'Opportunity.Amount_Required', EntityDefinition: 'Opportunity', Active: true },
          { FullName: 'Contact.Email_Format', EntityDefinition: 'Contact', Active: true },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.validation_rule_count).toBe(3);
    });

    test('groups validation rules by object (EntityDefinition)', () => {
      const metadata = buildMetadata({
        validationRules: [
          { FullName: 'Account.Rule1', EntityDefinition: 'Account', Active: true },
          { FullName: 'Account.Rule2', EntityDefinition: 'Account', Active: true },
          { FullName: 'Opportunity.Rule1', EntityDefinition: 'Opportunity', Active: true },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.validation_rules_by_object).toEqual({
        Account: 2,
        Opportunity: 1,
      });
    });

    test('returns empty object when no validation rules', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.validation_rule_count).toBe(0);
      expect(signals.validation_rules_by_object).toEqual({});
    });
  });

  describe('Platform Health: Duplicate Rules', () => {
    test('returns duplicate_rule_count as 0 (placeholder for v1)', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.duplicate_rule_count).toBe(0);
    });
  });

  describe('Platform Health: Security & Governance', () => {
    test('counts profiles', () => {
      const metadata = buildMetadata({
        profiles: [
          { Name: 'System Administrator' },
          { Name: 'Standard User' },
          { Name: 'Marketing User' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.profile_count).toBe(3);
    });

    test('counts permission sets', () => {
      const metadata = buildMetadata({
        permissionSets: [
          { Name: 'Sales_Cloud_User' },
          { Name: 'Marketing_User' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.permission_set_count).toBe(2);
    });

    test('calculates role hierarchy depth', () => {
      const metadata = buildMetadata({
        roles: [
          { Id: 'r1', Name: 'CEO', ParentRoleId: null },
          { Id: 'r2', Name: 'VP Sales', ParentRoleId: 'r1' },
          { Id: 'r3', Name: 'Sales Director', ParentRoleId: 'r2' },
          { Id: 'r4', Name: 'Sales Rep', ParentRoleId: 'r3' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      // CEO(1) -> VP(2) -> Dir(3) -> Rep(4) = depth 4
      expect(signals.role_hierarchy_depth).toBe(4);
    });

    test('returns 0 role hierarchy depth when no roles', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.role_hierarchy_depth).toBe(0);
    });

    test('handles flat role hierarchy (depth 1)', () => {
      const metadata = buildMetadata({
        roles: [
          { Id: 'r1', Name: 'Admin', ParentRoleId: null },
          { Id: 'r2', Name: 'User', ParentRoleId: null },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.role_hierarchy_depth).toBe(1);
    });
  });

  describe('Platform Health: Record Types', () => {
    test('counts record types', () => {
      const metadata = buildMetadata({
        recordTypes: [
          { Id: 'rt1', Name: 'Enterprise', SobjectType: 'Account' },
          { Id: 'rt2', Name: 'SMB', SobjectType: 'Account' },
          { Id: 'rt3', Name: 'New Business', SobjectType: 'Opportunity' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.record_type_count).toBe(3);
    });

    test('groups record types by object', () => {
      const metadata = buildMetadata({
        recordTypes: [
          { Id: 'rt1', Name: 'Enterprise', SobjectType: 'Account' },
          { Id: 'rt2', Name: 'SMB', SobjectType: 'Account' },
          { Id: 'rt3', Name: 'New Business', SobjectType: 'Opportunity' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.record_types_by_object).toEqual({
        Account: 2,
        Opportunity: 1,
      });
    });

    test('returns 0 and empty object when no record types', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.record_type_count).toBe(0);
      expect(signals.record_types_by_object).toEqual({});
    });
  });

  describe('Platform Health: Page Layouts', () => {
    test('returns page_layout_count as 0 (placeholder for v1)', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.page_layout_count).toBe(0);
    });
  });

  describe('Platform Health: Integrations', () => {
    test('counts connected apps', () => {
      const metadata = buildMetadata({
        connectedApps: [
          { Name: 'Slack', Label: 'Slack Integration' },
          { Name: 'ZoomInfo', Label: 'ZoomInfo Integration' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.connected_app_count).toBe(2);
    });

    test('counts named credentials', () => {
      const metadata = buildMetadata({
        namedCredentials: [
          { DeveloperName: 'Stripe_API' },
          { DeveloperName: 'AWS_Lambda' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      expect(signals.named_credential_count).toBe(2);
    });

    test('counts outbound flows (flows with external callout keywords)', () => {
      const metadata = buildMetadata({
        flows: [
          { Label: 'Send to Slack Notification', Status: 'Active' },
          { Label: 'Internal Lead Assignment', Status: 'Active' },
          { Label: 'Push to External API', Status: 'Active' },
        ],
      });
      const signals = extractSalesforceSignals(metadata);
      // Only flows with outbound/external/send/push/api/webhook keywords
      expect(signals.outbound_flow_count).toBeGreaterThanOrEqual(2);
    });

    test('returns 0 counts when no integration metadata', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      expect(signals.connected_app_count).toBe(0);
      expect(signals.named_credential_count).toBe(0);
      expect(signals.outbound_flow_count).toBe(0);
    });
  });

  // ── Complete Signal Coverage ──

  describe('Complete signal output', () => {
    test('returns all shared signal keys', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      const sharedKeys = [
        'contact_total_properties', 'contact_custom_properties',
        'company_total_properties', 'company_custom_properties',
        'deal_total_properties', 'deal_custom_properties',
        'ticket_total_properties', 'ticket_custom_properties',
        'enrichment_tool_detected', 'enrichment_field_count',
        'deal_pipeline_count', 'deal_pipeline_stages',
        'lifecycle_stages_covered',
        'total_active_workflows', 'total_disabled_workflows',
        'has_lead_routing_workflow',
        'workflow_categories', 'workflow_category_count',
        'has_task_automation', 'has_deal_creation_automation',
        'total_owners', 'teams', 'team_count',
        'orphan_owner_count', 'owner_to_team_coverage',
        'form_count', 'marketing_email_count',
        'has_reporting_dashboards',
        'enrichment_tools', 'enrichment_multi_object',
        'has_enrichment_workflow',
        'lead_capture_forms', 'has_speed_to_lead',
        'lifecycle_workflow_count', 'lead_status_workflow_count',
        'nurture_workflow_count',
        'has_stalled_deal_notification',
        'attribution_workflow_count',
        'has_deal_source_property',
        'has_competitor_property', 'has_close_reason_property',
        'has_closed_won_automation',
        'has_cs_handoff_workflow', 'has_onboarding_workflow',
        'has_partner_pipeline', 'has_referral_workflow',
        'has_competitor_tracking', 'has_closed_lost_reason',
        'has_cross_object_sync',
      ];
      for (const key of sharedKeys) {
        expect(signals).toHaveProperty(key);
      }
    });

    test('returns all platform health signal keys', () => {
      const signals = extractSalesforceSignals(buildMetadata());
      const platformKeys = [
        'apex_trigger_count', 'apex_class_count', 'apex_total_lines',
        'validation_rule_count', 'validation_rules_by_object',
        'duplicate_rule_count',
        'profile_count', 'permission_set_count', 'role_hierarchy_depth',
        'record_type_count', 'record_types_by_object', 'page_layout_count',
        'connected_app_count', 'named_credential_count', 'outbound_flow_count',
      ];
      for (const key of platformKeys) {
        expect(signals).toHaveProperty(key);
      }
    });
  });

  // ── Integration Test with Rich Data ──

  describe('Integration: rich metadata scenario', () => {
    test('correctly processes a full Salesforce metadata set', () => {
      const metadata = buildMetadata({
        objects: {
          Contact: makeObjectDescribe([
            makeField('FirstName', 'First Name', 'string', false),
            makeField('LastName', 'Last Name', 'string', false),
            makeField('Email', 'Email', 'email', false),
            makeField('zi_revenue__c', 'ZI Revenue', 'currency', true),
            makeField('zi_company__c', 'ZI Company', 'string', true),
          ]),
          Lead: makeObjectDescribe([
            makeField('Company', 'Company', 'string', false),
            makeField('Lead_Score__c', 'Lead Score', 'double', true),
            {
              name: 'Status',
              label: 'Lead Status',
              type: 'picklist',
              custom: false,
              picklistValues: [
                { value: 'New', label: 'New' },
                { value: 'MQL', label: 'Marketing Qualified' },
                { value: 'SQL', label: 'Sales Qualified' },
              ],
            },
          ]),
          Account: makeObjectDescribe([
            makeField('Name', 'Name', 'string', false),
            makeField('Industry', 'Industry', 'picklist', false),
            makeField('zi_industry__c', 'ZI Industry', 'string', true),
            makeField('ARR__c', 'ARR', 'currency', true),
          ]),
          Opportunity: makeObjectDescribe([
            makeField('Name', 'Opportunity Name', 'string', false),
            makeField('Amount', 'Amount', 'currency', false),
            makeField('StageName', 'Stage', 'picklist', false),
            makeField('competitor', 'Competitor', 'text', true),
            makeField('closed_lost_reason', 'Closed Lost Reason', 'picklist', true),
          ]),
          Case: makeObjectDescribe([
            makeField('Subject', 'Subject', 'string', false),
            makeField('Status', 'Status', 'picklist', false),
          ]),
        },
        stages: {
          opportunityStages: [
            { MasterLabel: 'Prospecting', DefaultProbability: 10, IsClosed: false, IsWon: false },
            { MasterLabel: 'Qualification', DefaultProbability: 30, IsClosed: false, IsWon: false },
            { MasterLabel: 'Proposal', DefaultProbability: 60, IsClosed: false, IsWon: false },
            { MasterLabel: 'Negotiation', DefaultProbability: 80, IsClosed: false, IsWon: false },
            { MasterLabel: 'Closed Won', DefaultProbability: 100, IsClosed: true, IsWon: true },
            { MasterLabel: 'Closed Lost', DefaultProbability: 0, IsClosed: true, IsWon: false },
          ],
        },
        users: [
          { Id: 'u1', Name: 'Alice', IsActive: true, UserRoleId: 'r1' },
          { Id: 'u2', Name: 'Bob', IsActive: true, UserRoleId: 'r2' },
          { Id: 'u3', Name: 'Charlie', IsActive: true, UserRoleId: null },
        ],
        flows: [
          { Label: 'Lead Assignment Round Robin', Status: 'Active' },
          { Label: 'Lifecycle Stage Transition', Status: 'Active' },
          { Label: 'Stalled Deal Alert', Status: 'Active' },
          { Label: 'Old Flow', Status: 'Inactive' },
        ],
        workflowRules: [
          { Name: 'Case Escalation', Active: true },
        ],
        validationRules: [
          { FullName: 'Account.Industry_Required', EntityDefinition: 'Account', Active: true },
          { FullName: 'Opp.Amount_Required', EntityDefinition: 'Opportunity', Active: true },
        ],
        apexTriggers: [
          { Name: 'AccountTrigger', TableEnumOrId: 'Account', LengthWithoutComments: 150 },
        ],
        apexClasses: [
          { Name: 'AccountHandler', LengthWithoutComments: 500 },
        ],
        profiles: [
          { Name: 'System Administrator' },
          { Name: 'Standard User' },
        ],
        permissionSets: [
          { Name: 'Sales_Cloud_User' },
        ],
        roles: [
          { Id: 'r1', Name: 'VP Sales', ParentRoleId: null },
          { Id: 'r2', Name: 'Sales Rep', ParentRoleId: 'r1' },
        ],
        reports: [
          { Id: 'rep1', Name: 'Pipeline Report' },
        ],
        dashboards: [
          { Id: 'd1', Title: 'Sales Dashboard' },
        ],
        connectedApps: [
          { Name: 'Slack', Label: 'Slack Integration' },
        ],
        namedCredentials: [],
        recordTypes: [
          { Id: 'rt1', Name: 'Enterprise', SobjectType: 'Account' },
          { Id: 'rt2', Name: 'SMB', SobjectType: 'Account' },
        ],
      });

      const signals = extractSalesforceSignals(metadata);

      // CRM Data Model
      expect(signals.contact_total_properties).toBe(8); // 5 Contact + 3 Lead
      expect(signals.contact_custom_properties).toBe(3); // 2 Contact + 1 Lead
      expect(signals.company_total_properties).toBe(4);
      expect(signals.company_custom_properties).toBe(2);
      expect(signals.deal_total_properties).toBe(5);
      expect(signals.deal_custom_properties).toBe(2);
      expect(signals.ticket_total_properties).toBe(2);
      expect(signals.ticket_custom_properties).toBe(0);

      // Enrichment
      expect(signals.enrichment_tool_detected).toBe('ZoomInfo');
      expect(signals.enrichment_field_count).toBe(3); // zi_revenue, zi_company, zi_industry
      expect(signals.enrichment_multi_object).toBe(true);

      // Pipeline
      expect(signals.deal_pipeline_count).toBe(1);
      expect(signals.deal_pipeline_stages[0].stageCount).toBe(6);
      expect(signals.deal_pipeline_stages[0].hasClosedLost).toBe(true);

      // Lifecycle
      expect(signals.lifecycle_stages_covered).toEqual(
        expect.arrayContaining(['MQL', 'SQL'])
      );

      // Automation
      expect(signals.total_active_workflows).toBe(4); // 3 active flows + 1 active rule
      expect(signals.total_disabled_workflows).toBe(1); // 1 inactive flow
      expect(signals.has_lead_routing_workflow).toBe(true);
      expect(signals.has_stalled_deal_notification).toBe(true);

      // Ownership
      expect(signals.total_owners).toBe(3);
      expect(signals.team_count).toBe(2);
      expect(signals.orphan_owner_count).toBe(1);

      // Platform Health
      expect(signals.apex_trigger_count).toBe(1);
      expect(signals.apex_class_count).toBe(1);
      expect(signals.apex_total_lines).toBe(650);
      expect(signals.validation_rule_count).toBe(2);
      expect(signals.profile_count).toBe(2);
      expect(signals.permission_set_count).toBe(1);
      expect(signals.role_hierarchy_depth).toBe(2);
      expect(signals.record_type_count).toBe(2);
      expect(signals.connected_app_count).toBe(1);
      expect(signals.has_reporting_dashboards).toBe(true);

      // Deal properties
      expect(signals.has_competitor_property).toBe(true);
      expect(signals.has_close_reason_property).toBe(true);
    });
  });
});
