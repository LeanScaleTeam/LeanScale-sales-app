/**
 * Tests for Salesforce Intake Inferrer
 * TDD Phase 1: Tests define expected behavior of inferIntakeAnswers
 *
 * The inferrer reads Salesforce metadata and produces a pre-fill map
 * for intake form questions. Each entry has:
 *   { value: string|string[], confidence: 'high'|'medium', evidence: string }
 */

import { inferIntakeAnswers } from '../../lib/diagnostic-engine/intake-inferrer-sf';

// ── Test Fixtures ──

function makeField(name, label, type = 'string', extra = {}) {
  return { name, label, type, custom: false, nillable: true, ...extra };
}

function makeObjectDescribe(fields = []) {
  return { fields };
}

/**
 * Build a complete metadata object with sensible defaults and overrides.
 */
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

/**
 * Create a user with an optional profile name and role name.
 */
function makeUser(profileName, roleName) {
  return {
    Id: `user_${Math.random().toString(36).slice(2, 8)}`,
    Name: `User ${profileName}`,
    IsActive: true,
    Profile: { Name: profileName },
    UserRole: roleName ? { Name: roleName } : null,
  };
}

// ── Tests ──

describe('inferIntakeAnswers', () => {
  test('exports inferIntakeAnswers as a function', () => {
    expect(typeof inferIntakeAnswers).toBe('function');
  });

  test('returns an object when called with empty metadata', () => {
    const result = inferIntakeAnswers(buildMetadata());
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  test('always infers C5, C6, D1 even with empty metadata (meaningful defaults)', () => {
    const result = inferIntakeAnswers(buildMetadata());
    // These three always produce an inference because absence is itself a signal:
    // C5: 0 validation rules -> "No required fields"
    // C6: no closed-lost field -> "Not tracked"
    // D1: 0 dashboards -> "None"
    expect(Object.keys(result)).toEqual(expect.arrayContaining(['C5', 'C6', 'D1']));
    expect(Object.keys(result).length).toBe(3);
    expect(result.C5.value).toBe('No required fields');
    expect(result.C6.value).toBe('Not tracked');
    expect(result.D1.value).toBe('None');
  });

  test('handles null/undefined metadata gracefully', () => {
    expect(() => inferIntakeAnswers(null)).not.toThrow();
    expect(() => inferIntakeAnswers(undefined)).not.toThrow();
    expect(() => inferIntakeAnswers({})).not.toThrow();
  });

  // ── A2: Rep Count (HIGH confidence) ──

  describe('A2 — rep count', () => {
    test('infers 1-5 when 3 users have sales profiles', () => {
      const users = [
        makeUser('Sales User', 'AE'),
        makeUser('Business Development', 'BDR'),
        makeUser('Account Executive', 'AE Team'),
        makeUser('System Administrator', 'Admin'),
      ];
      const result = inferIntakeAnswers(buildMetadata({ users }));
      expect(result.A2).toBeDefined();
      expect(result.A2.value).toBe('1-5');
      expect(result.A2.confidence).toBe('high');
      expect(result.A2.evidence).toContain('3');
    });

    test('infers 6-15 when 8 users have sales profiles', () => {
      const users = Array.from({ length: 8 }, (_, i) =>
        makeUser('Sales User', `Rep ${i}`)
      );
      // Add non-sales users that should be excluded
      users.push(makeUser('System Administrator', 'Admin'));
      users.push(makeUser('Marketing User', 'Marketing'));
      const result = inferIntakeAnswers(buildMetadata({ users }));
      expect(result.A2.value).toBe('6-15');
      expect(result.A2.confidence).toBe('high');
    });

    test('infers 16-50 when 20 users have sales profiles', () => {
      const users = Array.from({ length: 20 }, (_, i) =>
        makeUser('Standard User', `Rep ${i}`)
      );
      const result = inferIntakeAnswers(buildMetadata({ users }));
      expect(result.A2.value).toBe('16-50');
      expect(result.A2.confidence).toBe('high');
    });

    test('infers 50+ when 55 users have sales profiles', () => {
      const users = Array.from({ length: 55 }, (_, i) =>
        makeUser('Account Executive', `Rep ${i}`)
      );
      const result = inferIntakeAnswers(buildMetadata({ users }));
      expect(result.A2.value).toBe('50+');
      expect(result.A2.confidence).toBe('high');
    });

    test('matches case-insensitive profile names like SDR and BDR', () => {
      const users = [
        makeUser('sdr', 'Team 1'),
        makeUser('BDR', 'Team 2'),
        makeUser('Account Manager', 'Team 3'),
      ];
      const result = inferIntakeAnswers(buildMetadata({ users }));
      expect(result.A2).toBeDefined();
      expect(result.A2.value).toBe('1-5');
    });

    test('does not infer A2 when no users have sales profiles', () => {
      const users = [
        makeUser('System Administrator', 'Admin'),
        makeUser('Marketing User', 'Marketing'),
        makeUser('Chatter Free User', null),
      ];
      const result = inferIntakeAnswers(buildMetadata({ users }));
      expect(result.A2).toBeUndefined();
    });
  });

  // ── C5: Required Fields (HIGH confidence) ──

  describe('C5 — required fields on opportunity stage transitions', () => {
    test('infers "Yes, all stages" when >=4 validation rules on Opportunity', () => {
      const validationRules = [
        { ValidationName: 'Opp_Stage_1', 'EntityDefinition.QualifiedApiName': 'Opportunity', Active: true },
        { ValidationName: 'Opp_Stage_2', 'EntityDefinition.QualifiedApiName': 'Opportunity', Active: true },
        { ValidationName: 'Opp_Budget', 'EntityDefinition.QualifiedApiName': 'Opportunity', Active: true },
        { ValidationName: 'Opp_Close_Date', 'EntityDefinition.QualifiedApiName': 'Opportunity', Active: true },
      ];
      const result = inferIntakeAnswers(buildMetadata({ validationRules }));
      expect(result.C5).toBeDefined();
      expect(result.C5.value).toBe('Yes, all stages');
      expect(result.C5.confidence).toBe('high');
    });

    test('infers "Some stages" when 1-3 validation rules on Opportunity', () => {
      const validationRules = [
        { ValidationName: 'Opp_Check', 'EntityDefinition.QualifiedApiName': 'Opportunity', Active: true },
        { ValidationName: 'Opp_Budget', 'EntityDefinition.QualifiedApiName': 'Opportunity', Active: true },
      ];
      const result = inferIntakeAnswers(buildMetadata({ validationRules }));
      expect(result.C5.value).toBe('Some stages');
      expect(result.C5.confidence).toBe('high');
    });

    test('infers "No required fields" when 0 validation rules on Opportunity', () => {
      const validationRules = [
        { ValidationName: 'Account_Check', 'EntityDefinition.QualifiedApiName': 'Account', Active: true },
      ];
      const result = inferIntakeAnswers(buildMetadata({ validationRules }));
      expect(result.C5.value).toBe('No required fields');
      expect(result.C5.confidence).toBe('high');
    });

    test('also infers with EntityDefinition nested object format', () => {
      const validationRules = [
        { ValidationName: 'Opp_Check', EntityDefinition: { QualifiedApiName: 'Opportunity' }, Active: true },
        { ValidationName: 'Opp_Budget', EntityDefinition: { QualifiedApiName: 'Opportunity' }, Active: true },
        { ValidationName: 'Opp_Next', EntityDefinition: { QualifiedApiName: 'Opportunity' }, Active: true },
        { ValidationName: 'Opp_Close', EntityDefinition: { QualifiedApiName: 'Opportunity' }, Active: true },
      ];
      const result = inferIntakeAnswers(buildMetadata({ validationRules }));
      expect(result.C5.value).toBe('Yes, all stages');
    });
  });

  // ── C6: Closed-Lost Reason (HIGH confidence) ──

  describe('C6 — closed-lost reason tracking', () => {
    test('infers "Required field" when matching field exists and is not nillable', () => {
      const objects = {
        Opportunity: makeObjectDescribe([
          makeField('Closed_Lost_Reason__c', 'Closed Lost Reason', 'picklist', { nillable: false }),
          makeField('StageName', 'Stage', 'picklist'),
        ]),
      };
      const result = inferIntakeAnswers(buildMetadata({ objects }));
      expect(result.C6).toBeDefined();
      expect(result.C6.value).toBe('Required field');
      expect(result.C6.confidence).toBe('high');
    });

    test('infers "Optional field" when matching field exists and is nillable', () => {
      const objects = {
        Opportunity: makeObjectDescribe([
          makeField('Loss_Reason__c', 'Loss Reason', 'picklist', { nillable: true }),
        ]),
      };
      const result = inferIntakeAnswers(buildMetadata({ objects }));
      expect(result.C6.value).toBe('Optional field');
    });

    test('infers "Not tracked" when no matching field found', () => {
      const objects = {
        Opportunity: makeObjectDescribe([
          makeField('StageName', 'Stage', 'picklist'),
          makeField('Amount', 'Amount', 'currency'),
        ]),
      };
      const result = inferIntakeAnswers(buildMetadata({ objects }));
      expect(result.C6.value).toBe('Not tracked');
    });

    test('matches various closed-lost field naming patterns', () => {
      // close_reason pattern
      const objects1 = {
        Opportunity: makeObjectDescribe([
          makeField('Close_Reason__c', 'Close Reason', 'picklist', { nillable: false }),
        ]),
      };
      const r1 = inferIntakeAnswers(buildMetadata({ objects: objects1 }));
      expect(r1.C6.value).toBe('Required field');

      // closed_lost_reasons pattern
      const objects2 = {
        Opportunity: makeObjectDescribe([
          makeField('Closed_Lost_Reasons__c', 'Closed Lost Reasons', 'multipicklist', { nillable: true }),
        ]),
      };
      const r2 = inferIntakeAnswers(buildMetadata({ objects: objects2 }));
      expect(r2.C6.value).toBe('Optional field');
    });
  });

  // ── C10: Deduplication (HIGH confidence) ──

  describe('C10 — deduplication process', () => {
    test('infers "Automated tool" when flows contain dedup pattern', () => {
      const flows = [
        { Label: 'Duplicate Record Check', ProcessType: 'Flow', Status: 'Active' },
      ];
      const result = inferIntakeAnswers(buildMetadata({ flows }));
      expect(result.C10).toBeDefined();
      expect(result.C10.value).toBe('Automated tool');
      expect(result.C10.confidence).toBe('high');
    });

    test('infers "Automated tool" when flows contain merge pattern', () => {
      const flows = [
        { Label: 'Lead Merge Automation', ProcessType: 'Flow', Status: 'Active' },
      ];
      const result = inferIntakeAnswers(buildMetadata({ flows }));
      expect(result.C10.value).toBe('Automated tool');
    });

    test('does not infer C10 when no dedup flows found', () => {
      const flows = [
        { Label: 'Lead Assignment', ProcessType: 'Flow', Status: 'Active' },
      ];
      const result = inferIntakeAnswers(buildMetadata({ flows }));
      expect(result.C10).toBeUndefined();
    });
  });

  // ── D1: Dashboards (HIGH confidence) ──

  describe('D1 — dashboard count', () => {
    test('infers "10+" when >=10 dashboards', () => {
      const dashboards = Array.from({ length: 12 }, (_, i) => ({
        Id: `dash_${i}`,
        Title: `Dashboard ${i}`,
      }));
      const result = inferIntakeAnswers(buildMetadata({ dashboards }));
      expect(result.D1).toBeDefined();
      expect(result.D1.value).toBe('10+');
      expect(result.D1.confidence).toBe('high');
    });

    test('infers "5-10" when 5-9 dashboards', () => {
      const dashboards = Array.from({ length: 7 }, (_, i) => ({
        Id: `dash_${i}`,
        Title: `Dashboard ${i}`,
      }));
      const result = inferIntakeAnswers(buildMetadata({ dashboards }));
      expect(result.D1.value).toBe('5-10');
    });

    test('infers "1-4" when 1-4 dashboards', () => {
      const dashboards = [{ Id: 'dash_1', Title: 'Pipeline Dashboard' }];
      const result = inferIntakeAnswers(buildMetadata({ dashboards }));
      expect(result.D1.value).toBe('1-4');
    });

    test('infers "None" when 0 dashboards', () => {
      const result = inferIntakeAnswers(buildMetadata({ dashboards: [] }));
      expect(result.D1.value).toBe('None');
      expect(result.D1.confidence).toBe('high');
    });
  });

  // ── B1_tools: Tool Detection (MEDIUM confidence) ──

  describe('B1_tools — tool detection from connected apps and field prefixes', () => {
    test('detects sales_engagement from Outreach connected app', () => {
      const connectedApps = [{ Name: 'Outreach' }];
      const result = inferIntakeAnswers(buildMetadata({ connectedApps }));
      expect(result.B1_tools).toBeDefined();
      expect(result.B1_tools.value).toContain('sales_engagement');
      expect(result.B1_tools.confidence).toBe('medium');
    });

    test('detects conversation_intel from Gong connected app', () => {
      const connectedApps = [{ Name: 'Gong.io' }];
      const result = inferIntakeAnswers(buildMetadata({ connectedApps }));
      expect(result.B1_tools.value).toContain('conversation_intel');
    });

    test('detects data_enrichment from ZoomInfo field prefixes', () => {
      const objects = {
        Lead: makeObjectDescribe([
          makeField('zoominfo_company_revenue', 'ZoomInfo Revenue', 'currency'),
        ]),
      };
      const result = inferIntakeAnswers(buildMetadata({ objects }));
      expect(result.B1_tools).toBeDefined();
      expect(result.B1_tools.value).toContain('data_enrichment');
    });

    test('detects csp from Gainsight connected app', () => {
      const connectedApps = [{ Name: 'Gainsight' }];
      const result = inferIntakeAnswers(buildMetadata({ connectedApps }));
      expect(result.B1_tools.value).toContain('csp');
    });

    test('detects lead_routing from LeanData connected app', () => {
      const connectedApps = [{ Name: 'LeanData' }];
      const result = inferIntakeAnswers(buildMetadata({ connectedApps }));
      expect(result.B1_tools.value).toContain('lead_routing');
    });

    test('detects esign from DocuSign connected app', () => {
      const connectedApps = [{ Name: 'DocuSign for Salesforce' }];
      const result = inferIntakeAnswers(buildMetadata({ connectedApps }));
      expect(result.B1_tools.value).toContain('esign');
    });

    test('detects bi_analytics from Tableau connected app', () => {
      const connectedApps = [{ Name: 'Tableau CRM' }];
      const result = inferIntakeAnswers(buildMetadata({ connectedApps }));
      expect(result.B1_tools.value).toContain('bi_analytics');
    });

    test('detects support from Zendesk connected app', () => {
      const connectedApps = [{ Name: 'Zendesk Integration' }];
      const result = inferIntakeAnswers(buildMetadata({ connectedApps }));
      expect(result.B1_tools.value).toContain('support');
    });

    test('detects multiple tools at once', () => {
      const connectedApps = [
        { Name: 'Outreach' },
        { Name: 'Gong.io' },
        { Name: 'Gainsight' },
      ];
      const result = inferIntakeAnswers(buildMetadata({ connectedApps }));
      expect(result.B1_tools.value).toContain('sales_engagement');
      expect(result.B1_tools.value).toContain('conversation_intel');
      expect(result.B1_tools.value).toContain('csp');
    });

    test('does not infer B1_tools when no tool patterns match', () => {
      const connectedApps = [{ Name: 'Custom Internal App' }];
      const result = inferIntakeAnswers(buildMetadata({ connectedApps }));
      expect(result.B1_tools).toBeUndefined();
    });

    test('includes evidence listing matched tools', () => {
      const connectedApps = [{ Name: 'Salesloft' }];
      const result = inferIntakeAnswers(buildMetadata({ connectedApps }));
      expect(result.B1_tools.evidence).toBeDefined();
      expect(typeof result.B1_tools.evidence).toBe('string');
    });
  });

  // ── C1: Lead Capture (MEDIUM confidence) ──

  describe('C1 — lead capture method', () => {
    test('infers "CRM forms (HubSpot/SF)" when lead-creation flow found', () => {
      const flows = [
        { Label: 'Web-to-Lead Creation', ProcessType: 'Flow', Status: 'Active' },
      ];
      const result = inferIntakeAnswers(buildMetadata({ flows }));
      expect(result.C1).toBeDefined();
      expect(result.C1.value).toBe('CRM forms (HubSpot/SF)');
      expect(result.C1.confidence).toBe('medium');
    });

    test('infers "CRM forms (HubSpot/SF)" when Web-to-Lead fields detected', () => {
      const objects = {
        Lead: makeObjectDescribe([
          makeField('Web2Lead__c', 'Web to Lead', 'boolean'),
        ]),
      };
      const result = inferIntakeAnswers(buildMetadata({ objects }));
      expect(result.C1).toBeDefined();
      expect(result.C1.value).toBe('CRM forms (HubSpot/SF)');
    });

    test('does not infer C1 when no lead capture signals found', () => {
      const result = inferIntakeAnswers(buildMetadata());
      expect(result.C1).toBeUndefined();
    });
  });

  // ── C3: MQL Definition (MEDIUM confidence) ──

  describe('C3 — MQL definition', () => {
    test('infers "Yes, with lead scoring" when Lead has score fields', () => {
      const objects = {
        Lead: makeObjectDescribe([
          makeField('Lead_Score__c', 'Lead Score', 'number'),
        ]),
      };
      const result = inferIntakeAnswers(buildMetadata({ objects }));
      expect(result.C3).toBeDefined();
      expect(result.C3.value).toBe('Yes, with lead scoring');
      expect(result.C3.confidence).toBe('medium');
    });

    test('infers "Yes, criteria-based" when Lead has MQL/qualified fields but no score', () => {
      const objects = {
        Lead: makeObjectDescribe([
          makeField('MQL_Date__c', 'MQL Date', 'datetime'),
        ]),
      };
      const result = inferIntakeAnswers(buildMetadata({ objects }));
      expect(result.C3.value).toBe('Yes, criteria-based');
    });

    test('does not infer C3 when no scoring/MQL fields found', () => {
      const objects = {
        Lead: makeObjectDescribe([
          makeField('FirstName', 'First Name', 'string'),
        ]),
      };
      const result = inferIntakeAnswers(buildMetadata({ objects }));
      expect(result.C3).toBeUndefined();
    });
  });

  // ── C4: Qualification Methodology (MEDIUM confidence) ──

  describe('C4 — qualification methodology', () => {
    test('infers "MEDDIC/MEDDPICC" when Opportunity fields match', () => {
      const objects = {
        Opportunity: makeObjectDescribe([
          makeField('MEDDIC_Score__c', 'MEDDIC Score', 'number'),
        ]),
      };
      const result = inferIntakeAnswers(buildMetadata({ objects }));
      expect(result.C4).toBeDefined();
      expect(result.C4.value).toBe('MEDDIC/MEDDPICC');
      expect(result.C4.confidence).toBe('medium');
    });

    test('infers "BANT" when Opportunity fields match BANT', () => {
      const objects = {
        Opportunity: makeObjectDescribe([
          makeField('BANT_Budget__c', 'BANT Budget', 'currency'),
        ]),
      };
      const result = inferIntakeAnswers(buildMetadata({ objects }));
      expect(result.C4.value).toBe('BANT');
    });

    test('infers "SPICED" when Opportunity fields match SPICED', () => {
      const objects = {
        Opportunity: makeObjectDescribe([
          makeField('SPICED_Pain__c', 'SPICED Pain', 'textarea'),
        ]),
      };
      const result = inferIntakeAnswers(buildMetadata({ objects }));
      expect(result.C4.value).toBe('SPICED');
    });

    test('does not infer C4 when no methodology fields found', () => {
      const objects = {
        Opportunity: makeObjectDescribe([
          makeField('Amount', 'Amount', 'currency'),
        ]),
      };
      const result = inferIntakeAnswers(buildMetadata({ objects }));
      expect(result.C4).toBeUndefined();
    });
  });

  // ── C8: Renewals (MEDIUM confidence) ──

  describe('C8 — renewal tracking', () => {
    test('infers "Automated in CRM/CSP" when RecordTypes include renewal pattern', () => {
      const recordTypes = [
        { SobjectType: 'Opportunity', Name: 'Renewal', DeveloperName: 'Renewal' },
      ];
      const result = inferIntakeAnswers(buildMetadata({ recordTypes }));
      expect(result.C8).toBeDefined();
      expect(result.C8.value).toBe('Automated in CRM/CSP');
      expect(result.C8.confidence).toBe('medium');
    });

    test('does not infer C8 when no renewal record types', () => {
      const recordTypes = [
        { SobjectType: 'Opportunity', Name: 'New Business', DeveloperName: 'New_Business' },
      ];
      const result = inferIntakeAnswers(buildMetadata({ recordTypes }));
      expect(result.C8).toBeUndefined();
    });
  });

  // ── C11: Nurture Campaigns (MEDIUM confidence) ──

  describe('C11 — email nurture campaigns', () => {
    test('infers "Yes, in CRM/MAP" when Pardot connected app detected', () => {
      const connectedApps = [{ Name: 'Pardot' }];
      const result = inferIntakeAnswers(buildMetadata({ connectedApps }));
      expect(result.C11).toBeDefined();
      expect(result.C11.value).toBe('Yes, in CRM/MAP');
      expect(result.C11.confidence).toBe('medium');
    });

    test('infers "Yes, in CRM/MAP" when Marketing Cloud connected app detected', () => {
      const connectedApps = [{ Name: 'Salesforce Marketing Cloud' }];
      const result = inferIntakeAnswers(buildMetadata({ connectedApps }));
      expect(result.C11.value).toBe('Yes, in CRM/MAP');
    });

    test('does not infer C11 when no MAP tool detected', () => {
      const connectedApps = [{ Name: 'Gong.io' }];
      const result = inferIntakeAnswers(buildMetadata({ connectedApps }));
      expect(result.C11).toBeUndefined();
    });
  });

  // ── Output shape validation ──

  describe('output shape', () => {
    test('every inferred entry has value, confidence, and evidence', () => {
      const users = Array.from({ length: 10 }, (_, i) =>
        makeUser('Sales User', `Rep ${i}`)
      );
      const dashboards = Array.from({ length: 15 }, (_, i) => ({
        Id: `dash_${i}`,
        Title: `Dashboard ${i}`,
      }));
      const connectedApps = [{ Name: 'Outreach' }, { Name: 'Gong.io' }];
      const validationRules = [
        { ValidationName: 'Opp_Check', 'EntityDefinition.QualifiedApiName': 'Opportunity', Active: true },
      ];

      const result = inferIntakeAnswers(buildMetadata({
        users,
        dashboards,
        connectedApps,
        validationRules,
      }));

      for (const [key, entry] of Object.entries(result)) {
        expect(entry).toHaveProperty('value');
        expect(entry).toHaveProperty('confidence');
        expect(entry).toHaveProperty('evidence');
        expect(['high', 'medium']).toContain(entry.confidence);
        expect(typeof entry.evidence).toBe('string');
        expect(entry.evidence.length).toBeGreaterThan(0);
      }
    });
  });
});
