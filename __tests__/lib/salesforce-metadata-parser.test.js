/**
 * Tests for lib/salesforce-metadata-parser.js
 *
 * TDD Phase 1: Tests define the expected behavior of parseMetadataZip.
 * The parser reads a Salesforce CLI metadata zip and produces the same
 * normalized JSON shape as the API downloader output.
 */

import JSZip from 'jszip';
import { parseMetadataZip } from '../../lib/salesforce-metadata-parser';

// ── Helpers ──

/**
 * Build a zip buffer with the given file paths and contents.
 * @param {Record<string, string>} fileMap - { path: content }
 * @returns {Promise<Buffer>}
 */
async function buildZip(fileMap) {
  const zip = new JSZip();
  for (const [path, content] of Object.entries(fileMap)) {
    zip.file(path, content);
  }
  return zip.generateAsync({ type: 'nodebuffer' });
}

/**
 * Build a simple field XML.
 */
function fieldXML(label, type) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>MyField__c</fullName>
    <label>${label}</label>
    <type>${type}</type>
</CustomField>`;
}

/**
 * Build a simple flow XML.
 */
function flowXML(label, processType, status) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Flow xmlns="http://soap.sforce.com/2006/04/metadata">
    <label>${label}</label>
    <processType>${processType}</processType>
    <status>${status}</status>
</Flow>`;
}

/**
 * Build a simple workflow XML with rules.
 */
function workflowXML(rules) {
  const ruleBlocks = rules
    .map(
      (r) => `    <rules>
        <fullName>${r.name}</fullName>
        <active>${r.active}</active>
    </rules>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<Workflow xmlns="http://soap.sforce.com/2006/04/metadata">
${ruleBlocks}
</Workflow>`;
}

/**
 * Build a validation rule XML.
 */
function validationRuleXML(fullName, active) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<ValidationRule xmlns="http://soap.sforce.com/2006/04/metadata">
    <fullName>${fullName}</fullName>
    <active>${active}</active>
</ValidationRule>`;
}

/**
 * Build a role XML.
 */
function roleXML(parentRole) {
  if (parentRole) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Role xmlns="http://soap.sforce.com/2006/04/metadata">
    <parentRole>${parentRole}</parentRole>
</Role>`;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<Role xmlns="http://soap.sforce.com/2006/04/metadata">
</Role>`;
}

// ── Tests ──

describe('parseMetadataZip', () => {
  test('exports parseMetadataZip as a function', () => {
    expect(typeof parseMetadataZip).toBe('function');
  });

  test('returns normalized metadata shape from an empty zip', async () => {
    const zipBuffer = await buildZip({});
    const result = await parseMetadataZip(zipBuffer);

    expect(result).toHaveProperty('objects');
    expect(result).toHaveProperty('stages');
    expect(result).toHaveProperty('users');
    expect(result).toHaveProperty('flows');
    expect(result).toHaveProperty('workflowRules');
    expect(result).toHaveProperty('validationRules');
    expect(result).toHaveProperty('apexTriggers');
    expect(result).toHaveProperty('apexClasses');
    expect(result).toHaveProperty('profiles');
    expect(result).toHaveProperty('permissionSets');
    expect(result).toHaveProperty('roles');
    expect(result).toHaveProperty('reports');
    expect(result).toHaveProperty('dashboards');
    expect(result).toHaveProperty('connectedApps');
    expect(result).toHaveProperty('namedCredentials');
    expect(result).toHaveProperty('recordTypes');
  });

  test('stages defaults to empty opportunityStages and leadStatuses', async () => {
    const zipBuffer = await buildZip({});
    const result = await parseMetadataZip(zipBuffer);

    expect(result.stages).toEqual({ opportunityStages: [], leadStatuses: [] });
  });

  test('users defaults to empty array', async () => {
    const zipBuffer = await buildZip({});
    const result = await parseMetadataZip(zipBuffer);

    expect(result.users).toEqual([]);
  });

  // ── Root Detection ──

  describe('root detection', () => {
    test('detects force-app/main/default/ root', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/objects/Lead/fields/Custom__c.field-meta.xml': fieldXML(
          'Custom',
          'Text'
        ),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.objects.Lead.fields).toHaveLength(1);
      expect(result.objects.Lead.fields[0].name).toBe('Custom__c');
    });

    test('detects unpackaged/ root', async () => {
      const zipBuffer = await buildZip({
        'unpackaged/objects/Lead/fields/Custom__c.field-meta.xml': fieldXML('Custom', 'Text'),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.objects.Lead.fields).toHaveLength(1);
    });

    test('handles nested root directory (e.g. prefix/force-app/main/default/)', async () => {
      const zipBuffer = await buildZip({
        'my-project/force-app/main/default/objects/Account/fields/Industry__c.field-meta.xml':
          fieldXML('Industry', 'Picklist'),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.objects.Account.fields).toHaveLength(1);
      expect(result.objects.Account.fields[0].name).toBe('Industry__c');
    });
  });

  // ── Object Parsing ──

  describe('parseObjects', () => {
    test('parses field XML files under objects/{ObjectName}/fields/', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/objects/Lead/fields/Custom__c.field-meta.xml': fieldXML(
          'My Custom',
          'Text'
        ),
        'force-app/main/default/objects/Lead/fields/Email__c.field-meta.xml': fieldXML(
          'Email Custom',
          'Email'
        ),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.objects.Lead.fields).toHaveLength(2);
    });

    test('extracts name from filename (strip .field-meta.xml)', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/objects/Contact/fields/ZoomInfo_Company__c.field-meta.xml':
          fieldXML('ZoomInfo Company', 'Text'),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.objects.Contact.fields[0].name).toBe('ZoomInfo_Company__c');
    });

    test('extracts label from XML', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/objects/Account/fields/Revenue__c.field-meta.xml': fieldXML(
          'Annual Revenue',
          'Currency'
        ),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.objects.Account.fields[0].label).toBe('Annual Revenue');
    });

    test('extracts type from XML', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/objects/Opportunity/fields/Amount__c.field-meta.xml': fieldXML(
          'Amount',
          'Currency'
        ),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.objects.Opportunity.fields[0].type).toBe('Currency');
    });

    test('marks custom fields (name ends in __c)', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/objects/Lead/fields/MyCustom__c.field-meta.xml': fieldXML(
          'My Custom',
          'Text'
        ),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.objects.Lead.fields[0].custom).toBe(true);
    });

    test('marks non-custom fields (name does not end in __c)', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/objects/Lead/fields/StandardField.field-meta.xml': fieldXML(
          'Standard',
          'Text'
        ),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.objects.Lead.fields[0].custom).toBe(false);
    });

    test('parses standard object set (Lead, Contact, Account, Opportunity, Case, Campaign)', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/objects/Lead/fields/A__c.field-meta.xml': fieldXML('A', 'Text'),
        'force-app/main/default/objects/Contact/fields/B__c.field-meta.xml': fieldXML('B', 'Text'),
        'force-app/main/default/objects/Account/fields/C__c.field-meta.xml': fieldXML('C', 'Text'),
        'force-app/main/default/objects/Opportunity/fields/D__c.field-meta.xml': fieldXML(
          'D',
          'Text'
        ),
        'force-app/main/default/objects/Case/fields/E__c.field-meta.xml': fieldXML('E', 'Text'),
        'force-app/main/default/objects/Campaign/fields/F__c.field-meta.xml': fieldXML(
          'F',
          'Text'
        ),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(Object.keys(result.objects)).toEqual(
        expect.arrayContaining(['Lead', 'Contact', 'Account', 'Opportunity', 'Case', 'Campaign'])
      );
      expect(result.objects.Lead.fields).toHaveLength(1);
      expect(result.objects.Contact.fields).toHaveLength(1);
      expect(result.objects.Campaign.fields).toHaveLength(1);
    });

    test('returns empty fields array for objects with no field files', async () => {
      const zipBuffer = await buildZip({});
      const result = await parseMetadataZip(zipBuffer);

      expect(result.objects.Lead.fields).toEqual([]);
      expect(result.objects.Account.fields).toEqual([]);
    });
  });

  // ── Flow Parsing ──

  describe('parseFlows', () => {
    test('parses .flow-meta.xml files from flows/ directory', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/flows/Lead_Assignment.flow-meta.xml': flowXML(
          'Lead Assignment',
          'AutoLaunchedFlow',
          'Active'
        ),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.flows).toHaveLength(1);
      expect(result.flows[0].Label).toBe('Lead Assignment');
      expect(result.flows[0].ProcessType).toBe('AutoLaunchedFlow');
      expect(result.flows[0].Status).toBe('Active');
    });

    test('parses multiple flows', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/flows/Flow1.flow-meta.xml': flowXML(
          'Flow One',
          'AutoLaunchedFlow',
          'Active'
        ),
        'force-app/main/default/flows/Flow2.flow-meta.xml': flowXML(
          'Flow Two',
          'Screen',
          'Inactive'
        ),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.flows).toHaveLength(2);
    });

    test('uses filename as label fallback when XML has no label', async () => {
      const xmlNoLabel = `<?xml version="1.0" encoding="UTF-8"?>
<Flow xmlns="http://soap.sforce.com/2006/04/metadata">
    <processType>AutoLaunchedFlow</processType>
    <status>Active</status>
</Flow>`;
      const zipBuffer = await buildZip({
        'force-app/main/default/flows/MyFlow.flow-meta.xml': xmlNoLabel,
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.flows[0].Label).toBe('MyFlow');
    });

    test('returns empty array when no flows exist', async () => {
      const zipBuffer = await buildZip({});
      const result = await parseMetadataZip(zipBuffer);

      expect(result.flows).toEqual([]);
    });
  });

  // ── Workflow Rule Parsing ──

  describe('parseWorkflowRules', () => {
    test('extracts individual rules from workflow XML', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/workflows/Lead.workflow-meta.xml': workflowXML([
          { name: 'Lead_Auto_Assign', active: 'true' },
          { name: 'Lead_Follow_Up', active: 'true' },
        ]),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.workflowRules).toHaveLength(2);
      expect(result.workflowRules[0].Name).toBe('Lead_Auto_Assign');
      expect(result.workflowRules[0].Active).toBe(true);
      expect(result.workflowRules[0].TableEnumOrId).toBe('Lead');
    });

    test('excludes inactive workflow rules', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/workflows/Account.workflow-meta.xml': workflowXML([
          { name: 'Active_Rule', active: 'true' },
          { name: 'Inactive_Rule', active: 'false' },
        ]),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.workflowRules).toHaveLength(1);
      expect(result.workflowRules[0].Name).toBe('Active_Rule');
    });

    test('returns empty array when no workflows exist', async () => {
      const zipBuffer = await buildZip({});
      const result = await parseMetadataZip(zipBuffer);

      expect(result.workflowRules).toEqual([]);
    });
  });

  // ── Validation Rule Parsing ──

  describe('parseValidationRules', () => {
    test('parses validation rule XML files', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/objects/Lead/validationRules/RequireEmail.validationRule-meta.xml':
          validationRuleXML('RequireEmail', 'true'),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.validationRules).toHaveLength(1);
      expect(result.validationRules[0].ValidationName).toBe('RequireEmail');
      expect(result.validationRules[0].Active).toBe(true);
      expect(result.validationRules[0].EntityDefinition.QualifiedApiName).toBe('Lead');
    });

    test('excludes inactive validation rules', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/objects/Lead/validationRules/Active.validationRule-meta.xml':
          validationRuleXML('Active', 'true'),
        'force-app/main/default/objects/Lead/validationRules/Inactive.validationRule-meta.xml':
          validationRuleXML('Inactive', 'false'),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.validationRules).toHaveLength(1);
      expect(result.validationRules[0].ValidationName).toBe('Active');
    });

    test('extracts object name from path', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/objects/Account/validationRules/Check.validationRule-meta.xml':
          validationRuleXML('Check', 'true'),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.validationRules[0].EntityDefinition.QualifiedApiName).toBe('Account');
    });
  });

  // ── Trigger Parsing ──

  describe('parseTriggers', () => {
    test('parses .trigger-meta.xml files from triggers/ directory', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/triggers/LeadTrigger.trigger-meta.xml':
          '<ApexTrigger><status>Active</status></ApexTrigger>',
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.apexTriggers).toHaveLength(1);
      expect(result.apexTriggers[0].Name).toBe('LeadTrigger');
      expect(result.apexTriggers[0].Status).toBe('Active');
    });

    test('returns empty array when no triggers exist', async () => {
      const zipBuffer = await buildZip({});
      const result = await parseMetadataZip(zipBuffer);

      expect(result.apexTriggers).toEqual([]);
    });
  });

  // ── Class Parsing ──

  describe('parseClasses', () => {
    test('parses .cls files from classes/ directory', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/classes/MyController.cls':
          'public class MyController {\n  public void doStuff() {\n    System.debug("hello");\n  }\n}',
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.apexClasses).toHaveLength(1);
      expect(result.apexClasses[0].Name).toBe('MyController');
      expect(result.apexClasses[0].NamespacePrefix).toBeNull();
    });

    test('counts lines excluding blank and comment-only lines', async () => {
      const clsContent = [
        'public class MyClass {',
        '  // This is a comment',
        '',
        '  public void run() {',
        '    System.debug("test");',
        '  }',
        '}',
      ].join('\n');

      const zipBuffer = await buildZip({
        'force-app/main/default/classes/MyClass.cls': clsContent,
      });
      const result = await parseMetadataZip(zipBuffer);

      // Lines excluding blank and comment-only: 5 (line 1, 4, 5, 6, 7)
      expect(result.apexClasses[0].LengthWithoutComments).toBe(5);
    });

    test('returns empty array when no classes exist', async () => {
      const zipBuffer = await buildZip({});
      const result = await parseMetadataZip(zipBuffer);

      expect(result.apexClasses).toEqual([]);
    });
  });

  // ── Profile Parsing ──

  describe('parseProfiles', () => {
    test('parses .profile-meta.xml files from profiles/ directory', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/profiles/Admin.profile-meta.xml': '<Profile></Profile>',
        'force-app/main/default/profiles/Standard.profile-meta.xml': '<Profile></Profile>',
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.profiles).toHaveLength(2);
      expect(result.profiles.map((p) => p.Name)).toEqual(
        expect.arrayContaining(['Admin', 'Standard'])
      );
    });
  });

  // ── Permission Set Parsing ──

  describe('parsePermissionSets', () => {
    test('parses .permissionset-meta.xml files from permissionsets/ directory', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/permissionsets/SalesOps.permissionset-meta.xml':
          '<PermissionSet></PermissionSet>',
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.permissionSets).toHaveLength(1);
      expect(result.permissionSets[0].Label).toBe('SalesOps');
      expect(result.permissionSets[0].IsCustom).toBe(true);
    });
  });

  // ── Role Parsing ──

  describe('parseRoles', () => {
    test('parses .role-meta.xml files from roles/ directory', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/roles/CEO.role-meta.xml': roleXML(null),
        'force-app/main/default/roles/VP_Sales.role-meta.xml': roleXML('CEO'),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.roles).toHaveLength(2);
      const ceo = result.roles.find((r) => r.DeveloperName === 'CEO');
      const vp = result.roles.find((r) => r.DeveloperName === 'VP_Sales');

      expect(ceo.ParentRoleId).toBeNull();
      expect(vp.ParentRoleId).toBe('CEO');
    });
  });

  // ── List By Folder ──

  describe('listByFolder', () => {
    test('lists reports by folder (unique names)', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/reports/SalesReports/Pipeline.report-meta.xml': '<Report></Report>',
        'force-app/main/default/reports/SalesReports/Won.report-meta.xml': '<Report></Report>',
        'force-app/main/default/reports/MarketingReports/Leads.report-meta.xml':
          '<Report></Report>',
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.reports).toHaveLength(2);
      expect(result.reports.map((r) => r.Name)).toEqual(
        expect.arrayContaining(['SalesReports', 'MarketingReports'])
      );
    });

    test('lists dashboards by folder', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/dashboards/ExecDashboards/Overview.dashboard-meta.xml':
          '<Dashboard></Dashboard>',
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.dashboards).toHaveLength(1);
      expect(result.dashboards[0].Name).toBe('ExecDashboards');
    });

    test('lists connectedApps', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/connectedApps/Slack/Slack.connectedApp-meta.xml':
          '<ConnectedApp></ConnectedApp>',
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.connectedApps).toHaveLength(1);
      expect(result.connectedApps[0].Name).toBe('Slack');
    });

    test('lists namedCredentials', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/namedCredentials/MyAPI.namedCredential-meta.xml':
          '<NamedCredential></NamedCredential>',
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.namedCredentials).toHaveLength(1);
      expect(result.namedCredentials[0].Name).toBe('MyAPI.namedCredential-meta.xml');
    });
  });

  // ── Record Types ──

  describe('extractRecordTypes', () => {
    test('counts record types per object', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/objects/Account/recordTypes/Business.recordType-meta.xml':
          '<RecordType></RecordType>',
        'force-app/main/default/objects/Account/recordTypes/Enterprise.recordType-meta.xml':
          '<RecordType></RecordType>',
        'force-app/main/default/objects/Lead/recordTypes/Inbound.recordType-meta.xml':
          '<RecordType></RecordType>',
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.recordTypes).toHaveLength(2);
      const accountRT = result.recordTypes.find((rt) => rt.SobjectType === 'Account');
      const leadRT = result.recordTypes.find((rt) => rt.SobjectType === 'Lead');

      expect(accountRT.cnt).toBe(2);
      expect(leadRT.cnt).toBe(1);
    });

    test('returns empty array when no record types exist', async () => {
      const zipBuffer = await buildZip({});
      const result = await parseMetadataZip(zipBuffer);

      expect(result.recordTypes).toEqual([]);
    });
  });

  // ── XML Value Extraction ──

  describe('XML value extraction', () => {
    test('extracts simple XML tag values correctly', async () => {
      const zipBuffer = await buildZip({
        'force-app/main/default/flows/TestFlow.flow-meta.xml': flowXML(
          'Test Label',
          'AutoLaunchedFlow',
          'Active'
        ),
      });
      const result = await parseMetadataZip(zipBuffer);

      expect(result.flows[0].Label).toBe('Test Label');
      expect(result.flows[0].ProcessType).toBe('AutoLaunchedFlow');
      expect(result.flows[0].Status).toBe('Active');
    });
  });

  // ── Integration: Full Metadata Zip ──

  describe('full metadata zip integration', () => {
    test('parses a realistic metadata zip with multiple types', async () => {
      const zipBuffer = await buildZip({
        // Objects
        'force-app/main/default/objects/Lead/fields/ZoomInfo__c.field-meta.xml': fieldXML(
          'ZoomInfo',
          'Text'
        ),
        'force-app/main/default/objects/Contact/fields/Email__c.field-meta.xml': fieldXML(
          'Email',
          'Email'
        ),
        'force-app/main/default/objects/Account/fields/Industry__c.field-meta.xml': fieldXML(
          'Industry',
          'Picklist'
        ),
        'force-app/main/default/objects/Opportunity/fields/Amount__c.field-meta.xml': fieldXML(
          'Amount',
          'Currency'
        ),

        // Flows
        'force-app/main/default/flows/Lead_Assignment.flow-meta.xml': flowXML(
          'Lead Assignment',
          'AutoLaunchedFlow',
          'Active'
        ),
        'force-app/main/default/flows/Opp_Update.flow-meta.xml': flowXML(
          'Opp Stage Update',
          'RecordTriggered',
          'Active'
        ),

        // Workflows
        'force-app/main/default/workflows/Lead.workflow-meta.xml': workflowXML([
          { name: 'Lead_Notify', active: 'true' },
        ]),

        // Validation Rules
        'force-app/main/default/objects/Account/validationRules/RequireIndustry.validationRule-meta.xml':
          validationRuleXML('RequireIndustry', 'true'),

        // Triggers
        'force-app/main/default/triggers/OpportunityTrigger.trigger-meta.xml':
          '<ApexTrigger><status>Active</status></ApexTrigger>',

        // Classes
        'force-app/main/default/classes/OpportunityHandler.cls':
          'public class OpportunityHandler {\n  public void handle() {}\n}',

        // Profiles
        'force-app/main/default/profiles/Admin.profile-meta.xml': '<Profile></Profile>',
        'force-app/main/default/profiles/Standard.profile-meta.xml': '<Profile></Profile>',

        // Permission Sets
        'force-app/main/default/permissionsets/SalesOps.permissionset-meta.xml':
          '<PermissionSet></PermissionSet>',

        // Roles
        'force-app/main/default/roles/CEO.role-meta.xml': roleXML(null),
        'force-app/main/default/roles/VP_Sales.role-meta.xml': roleXML('CEO'),

        // Reports
        'force-app/main/default/reports/SalesReports/Pipeline.report-meta.xml': '<Report></Report>',

        // Dashboards
        'force-app/main/default/dashboards/ExecDash/Overview.dashboard-meta.xml':
          '<Dashboard></Dashboard>',

        // Record Types
        'force-app/main/default/objects/Account/recordTypes/Business.recordType-meta.xml':
          '<RecordType></RecordType>',
      });

      const result = await parseMetadataZip(zipBuffer);

      // Objects
      expect(result.objects.Lead.fields).toHaveLength(1);
      expect(result.objects.Contact.fields).toHaveLength(1);
      expect(result.objects.Account.fields).toHaveLength(1);
      expect(result.objects.Opportunity.fields).toHaveLength(1);

      // Flows
      expect(result.flows).toHaveLength(2);

      // Workflow Rules
      expect(result.workflowRules).toHaveLength(1);

      // Validation Rules
      expect(result.validationRules).toHaveLength(1);

      // Triggers
      expect(result.apexTriggers).toHaveLength(1);

      // Classes
      expect(result.apexClasses).toHaveLength(1);

      // Profiles
      expect(result.profiles).toHaveLength(2);

      // Permission Sets
      expect(result.permissionSets).toHaveLength(1);

      // Roles
      expect(result.roles).toHaveLength(2);

      // Reports
      expect(result.reports).toHaveLength(1);

      // Dashboards
      expect(result.dashboards).toHaveLength(1);

      // Record Types
      expect(result.recordTypes).toHaveLength(1);
      expect(result.recordTypes[0].SobjectType).toBe('Account');
      expect(result.recordTypes[0].cnt).toBe(1);

      // Stages and users should be defaults
      expect(result.stages).toEqual({ opportunityStages: [], leadStatuses: [] });
      expect(result.users).toEqual([]);
    });
  });
});
