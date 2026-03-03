/**
 * Tests for Salesforce Enhanced Intake Inferrer
 * TDD Phase 1: Tests define expected behavior of inferEnhancedAnswers
 *
 * The enhanced inferrer reads SOQL query results (arrAggregate,
 * leadSourceDistribution, campaignTypes, loginHistory, partnerRoles,
 * reportNames, dashboards) plus standard metadata and produces
 * a pre-fill map for intake form questions. Each entry has:
 *   { value: string, confidence: 'high'|'medium', evidence: string }
 */

import { inferEnhancedAnswers } from '../../lib/diagnostic-engine/intake-inferrer-sf-enhanced';

// -- Test Fixtures --

function makeField(name, label, type = 'string', extra = {}) {
  return { name, label, type, custom: false, nillable: true, ...extra };
}

function makeObjectDescribe(fields = []) {
  return { fields };
}

/**
 * Build enhanced SOQL data with sensible defaults and overrides.
 */
function buildEnhanced(overrides = {}) {
  return {
    arrAggregate: overrides.arrAggregate || [],
    leadSourceDistribution: overrides.leadSourceDistribution || [],
    campaignTypes: overrides.campaignTypes || [],
    loginHistory: overrides.loginHistory || [],
    partnerRoles: overrides.partnerRoles || [],
    reportNames: overrides.reportNames || [],
    dashboards: overrides.dashboards || [],
  };
}

/**
 * Build standard metadata with sensible defaults and overrides.
 */
function buildMetadata(overrides = {}) {
  return {
    objects: overrides.objects || {},
    users: overrides.users || [],
    flows: overrides.flows || [],
    validationRules: overrides.validationRules || [],
    dashboards: overrides.dashboards || [],
    connectedApps: overrides.connectedApps || [],
    recordTypes: overrides.recordTypes || [],
    roles: overrides.roles || [],
    forecastingTypes: overrides.forecastingTypes || [],
    reportSchedules: overrides.reportSchedules || [],
    contentVersions: overrides.contentVersions || [],
    knowledgeArticles: overrides.knowledgeArticles || [],
  };
}

// -- Tests --

describe('inferEnhancedAnswers', () => {
  test('exports inferEnhancedAnswers as a function', () => {
    expect(typeof inferEnhancedAnswers).toBe('function');
  });

  test('returns an empty object when called with empty enhanced data and empty metadata', () => {
    const result = inferEnhancedAnswers(buildEnhanced(), buildMetadata());
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  test('handles null/undefined arguments gracefully', () => {
    expect(() => inferEnhancedAnswers(null, null)).not.toThrow();
    expect(() => inferEnhancedAnswers(undefined, undefined)).not.toThrow();
    expect(() => inferEnhancedAnswers({}, {})).not.toThrow();
  });

  // -- A3: ARR Range --

  describe('A3 -- ARR range', () => {
    test('infers "<$1M" when total is 500000', () => {
      const enhanced = buildEnhanced({
        arrAggregate: [{ total: 500000 }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A3).toBeDefined();
      expect(result.A3.value).toBe('<$1M');
      expect(result.A3.confidence).toBe('medium');
      expect(result.A3.evidence).toContain('500');
    });

    test('infers "$1-5M" when total is 3000000', () => {
      const enhanced = buildEnhanced({
        arrAggregate: [{ total: 3000000 }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A3.value).toBe('$1-5M');
    });

    test('infers "$5-20M" when total is 12000000', () => {
      const enhanced = buildEnhanced({
        arrAggregate: [{ total: 12000000 }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A3.value).toBe('$5-20M');
    });

    test('infers "$20-50M" when total is 35000000', () => {
      const enhanced = buildEnhanced({
        arrAggregate: [{ total: 35000000 }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A3.value).toBe('$20-50M');
    });

    test('infers "$50M+" when total is 75000000', () => {
      const enhanced = buildEnhanced({
        arrAggregate: [{ total: 75000000 }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A3.value).toBe('$50M+');
    });

    test('does not infer A3 when arrAggregate is empty', () => {
      const result = inferEnhancedAnswers(buildEnhanced(), buildMetadata());
      expect(result.A3).toBeUndefined();
    });

    test('does not infer A3 when total is 0', () => {
      const enhanced = buildEnhanced({
        arrAggregate: [{ total: 0 }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A3).toBeUndefined();
    });

    test('includes dollar amount in evidence', () => {
      const enhanced = buildEnhanced({
        arrAggregate: [{ total: 8500000 }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A3.evidence).toMatch(/8.*500.*000|8\.5M|8,500,000/);
    });
  });

  // -- A4: GTM Motion --

  describe('A4 -- GTM motion', () => {
    test('infers "Inbound-led" when top source is Web', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'Web', cnt: 100 },
          { LeadSource: 'Referral', cnt: 20 },
          { LeadSource: 'Cold Call', cnt: 10 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4).toBeDefined();
      expect(result.A4.value).toBe('Inbound-led');
      expect(result.A4.confidence).toBe('medium');
    });

    test('infers "Inbound-led" when top source contains "Organic"', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'Organic Search', cnt: 80 },
          { LeadSource: 'Partner', cnt: 30 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4.value).toBe('Inbound-led');
    });

    test('infers "Inbound-led" when top source contains "Content"', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'Content Download', cnt: 60 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4.value).toBe('Inbound-led');
    });

    test('infers "Inbound-led" when top source contains "SEO"', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'SEO Campaign', cnt: 50 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4.value).toBe('Inbound-led');
    });

    test('infers "Outbound-led" when top source is Cold Call', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'Cold Call', cnt: 80 },
          { LeadSource: 'Web', cnt: 20 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4.value).toBe('Outbound-led');
    });

    test('infers "Outbound-led" when top source contains "Outbound"', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'Outbound Prospecting', cnt: 90 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4.value).toBe('Outbound-led');
    });

    test('infers "Outbound-led" when top source contains "Prospecting"', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'Sales Prospecting', cnt: 70 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4.value).toBe('Outbound-led');
    });

    test('infers "Partner-led" when top source is Referral', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'Referral', cnt: 60 },
          { LeadSource: 'Web', cnt: 15 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4.value).toBe('Partner-led');
    });

    test('infers "Partner-led" when top source contains "Partner"', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'Partner Network', cnt: 55 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4.value).toBe('Partner-led');
    });

    test('infers "Partner-led" when top source contains "Channel"', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'Channel Program', cnt: 45 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4.value).toBe('Partner-led');
    });

    test('infers "Product-led" when top source contains "Trial"', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'Free Trial', cnt: 100 },
          { LeadSource: 'Web', cnt: 20 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4.value).toBe('Product-led');
    });

    test('infers "Product-led" when top source contains "Freemium"', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'Freemium Signup', cnt: 80 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4.value).toBe('Product-led');
    });

    test('infers "Product-led" when top source contains "Signup"', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'Product Signup', cnt: 70 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4.value).toBe('Product-led');
    });

    test('infers "Blended" when top source does not match any pattern', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'Other', cnt: 50 },
          { LeadSource: 'Unknown', cnt: 30 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4.value).toBe('Blended');
    });

    test('shows top 3 sources in evidence', () => {
      const enhanced = buildEnhanced({
        leadSourceDistribution: [
          { LeadSource: 'Web', cnt: 100 },
          { LeadSource: 'Referral', cnt: 50 },
          { LeadSource: 'Cold Call', cnt: 25 },
          { LeadSource: 'Event', cnt: 5 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A4.evidence).toContain('Web');
      expect(result.A4.evidence).toContain('Referral');
      expect(result.A4.evidence).toContain('Cold Call');
    });

    test('does not infer A4 when leadSourceDistribution is empty', () => {
      const result = inferEnhancedAnswers(buildEnhanced(), buildMetadata());
      expect(result.A4).toBeUndefined();
    });
  });

  // -- A5: Partner Program --

  describe('A5 -- partner program', () => {
    test('infers "Yes, active" when partnerRoles is non-empty', () => {
      const enhanced = buildEnhanced({
        partnerRoles: [{ Role: 'Reseller' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.A5).toBeDefined();
      expect(result.A5.value).toBe('Yes, active');
      expect(result.A5.confidence).toBe('medium');
    });

    test('infers "Yes, active" when metadata recordTypes contain Partner', () => {
      const metadata = buildMetadata({
        recordTypes: [
          { SobjectType: 'PartnerAccount', Name: 'Partner', DeveloperName: 'Partner' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.A5).toBeDefined();
      expect(result.A5.value).toBe('Yes, active');
    });

    test('does not infer A5 when no partner signals', () => {
      const metadata = buildMetadata({
        recordTypes: [
          { SobjectType: 'Opportunity', Name: 'New Business', DeveloperName: 'New_Business' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.A5).toBeUndefined();
    });
  });

  // -- C7: Sales-to-CS Handoff --

  describe('C7 -- sales-to-CS handoff', () => {
    test('infers "Documented + automated" when flows match handoff pattern', () => {
      const metadata = buildMetadata({
        flows: [
          { Label: 'Sales to CS Handoff', ProcessType: 'Flow', Status: 'Active' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C7).toBeDefined();
      expect(result.C7.value).toBe('Documented + automated');
      expect(result.C7.confidence).toBe('medium');
    });

    test('infers "Documented + automated" when flow label matches "onboarding"', () => {
      const metadata = buildMetadata({
        flows: [
          { Label: 'Customer Onboarding Process', ProcessType: 'Flow', Status: 'Active' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C7.value).toBe('Documented + automated');
    });

    test('infers "Documented + automated" when flow matches hand-off (hyphenated)', () => {
      const metadata = buildMetadata({
        flows: [
          { Label: 'Deal Hand-Off Automation', ProcessType: 'Flow', Status: 'Active' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C7.value).toBe('Documented + automated');
    });

    test('infers "Informal" when CS roles found but no handoff flow', () => {
      const metadata = buildMetadata({
        roles: [
          { Name: 'Customer Success Manager' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C7).toBeDefined();
      expect(result.C7.value).toBe('Informal');
    });

    test('infers "Informal" when role matches "CSM"', () => {
      const metadata = buildMetadata({
        roles: [
          { Name: 'CSM Team Lead' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C7.value).toBe('Informal');
    });

    test('infers "Informal" when role matches "onboarding"', () => {
      const metadata = buildMetadata({
        roles: [
          { Name: 'Onboarding Specialist' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C7.value).toBe('Informal');
    });

    test('prefers "Documented + automated" over "Informal" when both flow and roles exist', () => {
      const metadata = buildMetadata({
        flows: [
          { Label: 'Sales to CS Handoff', ProcessType: 'Flow', Status: 'Active' },
        ],
        roles: [
          { Name: 'Customer Success Manager' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C7.value).toBe('Documented + automated');
    });

    test('does not infer C7 when no handoff signals', () => {
      const metadata = buildMetadata({
        flows: [
          { Label: 'Lead Assignment', ProcessType: 'Flow', Status: 'Active' },
        ],
        roles: [
          { Name: 'Sales Manager' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C7).toBeUndefined();
    });
  });

  // -- C9: NPS/CSAT --

  describe('C9 -- NPS/CSAT', () => {
    test('infers "Yes, automated program" when NPS field and automated flow exist', () => {
      const metadata = buildMetadata({
        objects: {
          Account: makeObjectDescribe([
            makeField('NPS_Score__c', 'NPS Score', 'number'),
          ]),
        },
        flows: [
          { Label: 'NPS Survey Automation', ProcessType: 'Flow', Status: 'Active' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C9).toBeDefined();
      expect(result.C9.value).toBe('Yes, automated program');
      expect(result.C9.confidence).toBe('medium');
    });

    test('infers "Yes, automated program" when CSAT field and survey flow exist', () => {
      const metadata = buildMetadata({
        objects: {
          Contact: makeObjectDescribe([
            makeField('CSAT_Score__c', 'CSAT Score', 'number'),
          ]),
        },
        flows: [
          { Label: 'Customer Satisfaction Survey', ProcessType: 'Flow', Status: 'Active' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C9.value).toBe('Yes, automated program');
    });

    test('infers "Yes, ad hoc" when NPS field exists but no survey flow', () => {
      const metadata = buildMetadata({
        objects: {
          Account: makeObjectDescribe([
            makeField('Net_Promoter_Score__c', 'Net Promoter Score', 'number'),
          ]),
        },
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C9).toBeDefined();
      expect(result.C9.value).toBe('Yes, ad hoc');
    });

    test('infers "Yes, ad hoc" when satisfaction field on Contact', () => {
      const metadata = buildMetadata({
        objects: {
          Contact: makeObjectDescribe([
            makeField('Satisfaction_Rating__c', 'Satisfaction Rating', 'picklist'),
          ]),
        },
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C9.value).toBe('Yes, ad hoc');
    });

    test('does not infer C9 when no NPS/CSAT fields found', () => {
      const metadata = buildMetadata({
        objects: {
          Account: makeObjectDescribe([
            makeField('Name', 'Account Name', 'string'),
          ]),
        },
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C9).toBeUndefined();
    });
  });

  // -- C12: Events --

  describe('C12 -- events', () => {
    test('infers "Yes, regularly" when campaign event types total > 5', () => {
      const enhanced = buildEnhanced({
        campaignTypes: [
          { Type: 'Webinar', cnt: 4 },
          { Type: 'Conference', cnt: 3 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.C12).toBeDefined();
      expect(result.C12.value).toBe('Yes, regularly');
      expect(result.C12.confidence).toBe('medium');
    });

    test('infers "Occasionally" when campaign event types total is 1-5', () => {
      const enhanced = buildEnhanced({
        campaignTypes: [
          { Type: 'Dinner Event', cnt: 2 },
          { Type: 'Workshop', cnt: 1 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.C12.value).toBe('Occasionally');
    });

    test('matches "Event" type', () => {
      const enhanced = buildEnhanced({
        campaignTypes: [
          { Type: 'Event', cnt: 3 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.C12).toBeDefined();
      expect(result.C12.value).toBe('Occasionally');
    });

    test('matches "Roundtable" type', () => {
      const enhanced = buildEnhanced({
        campaignTypes: [
          { Type: 'Executive Roundtable', cnt: 8 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.C12.value).toBe('Yes, regularly');
    });

    test('does not count non-event campaign types', () => {
      const enhanced = buildEnhanced({
        campaignTypes: [
          { Type: 'Email', cnt: 100 },
          { Type: 'Social Media', cnt: 50 },
          { Type: 'Webinar', cnt: 2 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.C12.value).toBe('Occasionally');
    });

    test('does not infer C12 when no event campaign types', () => {
      const enhanced = buildEnhanced({
        campaignTypes: [
          { Type: 'Email', cnt: 100 },
          { Type: 'Social Media', cnt: 50 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.C12).toBeUndefined();
    });
  });

  // -- C16: Manager Dashboards --

  describe('C16 -- manager dashboards', () => {
    test('infers "Yes per team" when dashboard title matches manager pattern', () => {
      const metadata = buildMetadata({
        dashboards: [
          { Title: 'Sales Manager Dashboard', FolderName: 'Sales' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C16).toBeDefined();
      expect(result.C16.value).toBe('Yes per team');
      expect(result.C16.confidence).toBe('medium');
    });

    test('infers "Yes per team" when FolderName matches leadership pattern', () => {
      const metadata = buildMetadata({
        dashboards: [
          { Title: 'Pipeline Overview', FolderName: 'Leadership Reports' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C16.value).toBe('Yes per team');
    });

    test('matches "Director" in title', () => {
      const metadata = buildMetadata({
        dashboards: [
          { Title: 'Director Weekly Metrics', FolderName: 'Dashboards' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C16.value).toBe('Yes per team');
    });

    test('matches "Executive" in FolderName', () => {
      const metadata = buildMetadata({
        dashboards: [
          { Title: 'Revenue Metrics', FolderName: 'Executive Dashboards' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C16.value).toBe('Yes per team');
    });

    test('matches "VP" in title', () => {
      const metadata = buildMetadata({
        dashboards: [
          { Title: 'VP Sales Pipeline', FolderName: 'Dashboards' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C16.value).toBe('Yes per team');
    });

    test('matches "SVP" in FolderName', () => {
      const metadata = buildMetadata({
        dashboards: [
          { Title: 'Revenue Metrics', FolderName: 'SVP Reports' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C16.value).toBe('Yes per team');
    });

    test('does not infer C16 when no manager dashboard patterns', () => {
      const metadata = buildMetadata({
        dashboards: [
          { Title: 'Pipeline Dashboard', FolderName: 'Sales Dashboards' },
          { Title: 'Marketing Dashboard', FolderName: 'Marketing' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.C16).toBeUndefined();
    });
  });

  // -- C17: IC Daily Use --

  describe('C17 -- IC daily use', () => {
    test('infers "Yes with personal views" when >50% of users are frequent', () => {
      const enhanced = buildEnhanced({
        loginHistory: [
          { UserId: 'u1', cnt: 7 },
          { UserId: 'u2', cnt: 6 },
          { UserId: 'u3', cnt: 5 },
          { UserId: 'u4', cnt: 5 },
        ],
      });
      const metadata = buildMetadata({
        users: [
          { Id: 'u1' }, { Id: 'u2' }, { Id: 'u3' }, { Id: 'u4' }, { Id: 'u5' },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, metadata);
      expect(result.C17).toBeDefined();
      expect(result.C17.value).toBe('Yes with personal views');
      expect(result.C17.confidence).toBe('medium');
    });

    test('infers "Yes basic" when 25-50% of users are frequent', () => {
      const enhanced = buildEnhanced({
        loginHistory: [
          { UserId: 'u1', cnt: 7 },
          { UserId: 'u2', cnt: 6 },
          { UserId: 'u3', cnt: 1 },
          { UserId: 'u4', cnt: 2 },
        ],
      });
      const metadata = buildMetadata({
        users: [
          { Id: 'u1' }, { Id: 'u2' }, { Id: 'u3' }, { Id: 'u4' }, { Id: 'u5' },
          { Id: 'u6' },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, metadata);
      expect(result.C17).toBeDefined();
      expect(result.C17.value).toBe('Yes basic');
    });

    test('does not infer C17 when <25% of users are frequent', () => {
      const enhanced = buildEnhanced({
        loginHistory: [
          { UserId: 'u1', cnt: 7 },
          { UserId: 'u2', cnt: 1 },
          { UserId: 'u3', cnt: 2 },
        ],
      });
      const metadata = buildMetadata({
        users: [
          { Id: 'u1' }, { Id: 'u2' }, { Id: 'u3' }, { Id: 'u4' }, { Id: 'u5' },
          { Id: 'u6' }, { Id: 'u7' }, { Id: 'u8' }, { Id: 'u9' }, { Id: 'u10' },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, metadata);
      expect(result.C17).toBeUndefined();
    });

    test('does not infer C17 when no users in metadata', () => {
      const enhanced = buildEnhanced({
        loginHistory: [
          { UserId: 'u1', cnt: 7 },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.C17).toBeUndefined();
    });
  });

  // -- D3: Forecasting --

  describe('D3 -- forecasting', () => {
    test('infers "CRM forecast tool" when forecastingTypes is non-empty', () => {
      const metadata = buildMetadata({
        forecastingTypes: [{ Name: 'OpportunityRevenue' }],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.D3).toBeDefined();
      expect(result.D3.value).toBe('CRM forecast tool');
      expect(result.D3.confidence).toBe('medium');
    });

    test('infers "AI/tool-assisted" when connectedApps match Clari', () => {
      const metadata = buildMetadata({
        connectedApps: [{ Name: 'Clari' }],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.D3).toBeDefined();
      expect(result.D3.value).toBe('AI/tool-assisted');
    });

    test('infers "AI/tool-assisted" when connectedApps match Aviso', () => {
      const metadata = buildMetadata({
        connectedApps: [{ Name: 'Aviso Insights' }],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.D3.value).toBe('AI/tool-assisted');
    });

    test('infers "AI/tool-assisted" when connectedApps match BoostUp', () => {
      const metadata = buildMetadata({
        connectedApps: [{ Name: 'BoostUp Revenue Intelligence' }],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.D3.value).toBe('AI/tool-assisted');
    });

    test('prefers "AI/tool-assisted" over "CRM forecast tool" when both exist', () => {
      const metadata = buildMetadata({
        forecastingTypes: [{ Name: 'OpportunityRevenue' }],
        connectedApps: [{ Name: 'Clari' }],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.D3.value).toBe('AI/tool-assisted');
    });

    test('does not infer D3 when no forecasting signals', () => {
      const result = inferEnhancedAnswers(buildEnhanced(), buildMetadata());
      expect(result.D3).toBeUndefined();
    });
  });

  // -- D5: Report Distribution --

  describe('D5 -- report distribution', () => {
    test('infers "Automated schedule" when reportSchedules is non-empty', () => {
      const metadata = buildMetadata({
        reportSchedules: [{ Id: 'sched_1', ReportId: 'rpt_1' }],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.D5).toBeDefined();
      expect(result.D5.value).toBe('Automated schedule');
      expect(result.D5.confidence).toBe('high');
    });

    test('does not infer D5 when reportSchedules is empty', () => {
      const result = inferEnhancedAnswers(buildEnhanced(), buildMetadata());
      expect(result.D5).toBeUndefined();
    });
  });

  // -- D6: Playbooks --

  describe('D6 -- playbooks', () => {
    test('infers "Yes in enablement platform" when knowledgeArticles match playbook pattern', () => {
      const metadata = buildMetadata({
        knowledgeArticles: [
          { Title: 'Enterprise Sales Playbook' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.D6).toBeDefined();
      expect(result.D6.value).toBe('Yes in enablement platform');
      expect(result.D6.confidence).toBe('medium');
    });

    test('matches "battle card" in knowledge articles', () => {
      const metadata = buildMetadata({
        knowledgeArticles: [
          { Title: 'Competitor Battle Card - Acme' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.D6.value).toBe('Yes in enablement platform');
    });

    test('matches "enablement" in content versions', () => {
      const metadata = buildMetadata({
        contentVersions: [
          { Title: 'Sales Enablement Guide' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.D6).toBeDefined();
      expect(result.D6.value).toBe('Yes in docs');
    });

    test('matches "objection" in content versions', () => {
      const metadata = buildMetadata({
        contentVersions: [
          { Title: 'Common Objection Handling' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.D6.value).toBe('Yes in docs');
    });

    test('matches "pricing guide" in content versions', () => {
      const metadata = buildMetadata({
        contentVersions: [
          { Title: 'Pricing Guide 2026' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.D6.value).toBe('Yes in docs');
    });

    test('matches "compete" in knowledge articles', () => {
      const metadata = buildMetadata({
        knowledgeArticles: [
          { Title: 'Compete Analysis: Gartner Quadrant' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.D6.value).toBe('Yes in enablement platform');
    });

    test('prefers knowledge articles over content versions', () => {
      const metadata = buildMetadata({
        knowledgeArticles: [
          { Title: 'Sales Playbook v2' },
        ],
        contentVersions: [
          { Title: 'Sales Play Guide' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.D6.value).toBe('Yes in enablement platform');
    });

    test('does not infer D6 when no playbook content found', () => {
      const metadata = buildMetadata({
        contentVersions: [
          { Title: 'Q1 Board Presentation' },
        ],
        knowledgeArticles: [
          { Title: 'Password Reset Instructions' },
        ],
      });
      const result = inferEnhancedAnswers(buildEnhanced(), metadata);
      expect(result.D6).toBeUndefined();
    });
  });

  // -- Power 10 Metrics (D5_arr through D5_cycle) --

  describe('Power 10 metrics -- report name matching', () => {
    test('infers D5_arr as "Automated" when report name matches ARR', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'ARR Monthly Tracking' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_arr).toBeDefined();
      expect(result.D5_arr.value).toBe('Automated');
      expect(result.D5_arr.confidence).toBe('medium');
    });

    test('matches "annual recurring revenue" for D5_arr', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Annual Recurring Revenue Report' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_arr).toBeDefined();
      expect(result.D5_arr.value).toBe('Automated');
    });

    test('infers D5_bookings as "Automated" when report name matches bookings', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'New Business Bookings Q1' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_bookings).toBeDefined();
      expect(result.D5_bookings.value).toBe('Automated');
    });

    test('matches "expansion" for D5_bookings', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Expansion Revenue Tracker' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_bookings).toBeDefined();
    });

    test('infers D5_pipeline as "Automated" when report name matches pipeline', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Pipeline Coverage Report' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_pipeline).toBeDefined();
      expect(result.D5_pipeline.value).toBe('Automated');
    });

    test('matches "funnel" for D5_pipeline', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Sales Funnel Analysis' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_pipeline).toBeDefined();
    });

    test('infers D5_mql as "Automated" when report name matches MQL', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'MQL Volume by Month' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_mql).toBeDefined();
      expect(result.D5_mql.value).toBe('Automated');
    });

    test('matches "marketing qualified" for D5_mql', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Marketing Qualified Leads Report' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_mql).toBeDefined();
    });

    test('matches "lead source" for D5_mql', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Lead Source Breakdown' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_mql).toBeDefined();
    });

    test('infers D5_gross_churn as "Automated" when report name matches churn', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Monthly Churn Report' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_gross_churn).toBeDefined();
      expect(result.D5_gross_churn.value).toBe('Automated');
    });

    test('matches "logo retention" for D5_gross_churn', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Logo Retention Tracking' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_gross_churn).toBeDefined();
    });

    test('infers D5_grr as "Automated" when report name matches GRR', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'GRR Monthly Dashboard' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_grr).toBeDefined();
      expect(result.D5_grr.value).toBe('Automated');
    });

    test('matches "gross retention" for D5_grr', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Gross Retention Rate Analysis' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_grr).toBeDefined();
    });

    test('infers D5_nrr as "Automated" when report name matches NRR', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'NRR Quarterly Review' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_nrr).toBeDefined();
      expect(result.D5_nrr.value).toBe('Automated');
    });

    test('matches "net retention" for D5_nrr', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Net Retention Analysis' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_nrr).toBeDefined();
    });

    test('infers D5_mql_opp as "Automated" when report matches MQL to Opp', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'MQL to Opp Conversion Report' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_mql_opp).toBeDefined();
      expect(result.D5_mql_opp.value).toBe('Automated');
    });

    test('matches "lead conversion" for D5_mql_opp', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Lead Conversion Rate by Source' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_mql_opp).toBeDefined();
    });

    test('infers D5_opp_cw as "Automated" when report matches win rate', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Win Rate Analysis' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_opp_cw).toBeDefined();
      expect(result.D5_opp_cw.value).toBe('Automated');
    });

    test('matches "close rate" for D5_opp_cw', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Close Rate by Rep' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_opp_cw).toBeDefined();
    });

    test('infers D5_cycle as "Automated" when report matches sales cycle', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Sales Cycle Time Report' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_cycle).toBeDefined();
      expect(result.D5_cycle.value).toBe('Automated');
    });

    test('matches "average days to close" for D5_cycle', () => {
      const enhanced = buildEnhanced({
        reportNames: [{ Name: 'Average Days to Close by Segment' }],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_cycle).toBeDefined();
    });

    test('does not infer Power 10 metrics when no matching reports', () => {
      const enhanced = buildEnhanced({
        reportNames: [
          { Name: 'Account List View' },
          { Name: 'Contact Duplicates' },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_arr).toBeUndefined();
      expect(result.D5_bookings).toBeUndefined();
      expect(result.D5_pipeline).toBeUndefined();
      expect(result.D5_mql).toBeUndefined();
      expect(result.D5_gross_churn).toBeUndefined();
      expect(result.D5_grr).toBeUndefined();
      expect(result.D5_nrr).toBeUndefined();
      expect(result.D5_mql_opp).toBeUndefined();
      // D5_opp_cw and D5_cycle are always set (reportable from standard fields)
      expect(result.D5_opp_cw.value).toBe('Automated');
      expect(result.D5_cycle.value).toBe('Automated');
    });

    test('infers multiple Power 10 metrics simultaneously', () => {
      const enhanced = buildEnhanced({
        reportNames: [
          { Name: 'ARR Dashboard' },
          { Name: 'Pipeline Report' },
          { Name: 'Win Rate by Team' },
          { Name: 'Monthly Churn Analysis' },
        ],
      });
      const result = inferEnhancedAnswers(enhanced, buildMetadata());
      expect(result.D5_arr).toBeDefined();
      expect(result.D5_pipeline).toBeDefined();
      expect(result.D5_opp_cw).toBeDefined();
      expect(result.D5_gross_churn).toBeDefined();
    });
  });

  // -- Output Shape Validation --

  describe('output shape', () => {
    test('every inferred entry has value, confidence, and evidence', () => {
      const enhanced = buildEnhanced({
        arrAggregate: [{ total: 5000000 }],
        leadSourceDistribution: [{ LeadSource: 'Web', cnt: 100 }],
        campaignTypes: [{ Type: 'Webinar', cnt: 10 }],
        loginHistory: [
          { UserId: 'u1', cnt: 7 },
          { UserId: 'u2', cnt: 6 },
        ],
        partnerRoles: [{ Role: 'Reseller' }],
        reportNames: [{ Name: 'ARR Tracking' }],
      });
      const metadata = buildMetadata({
        users: [{ Id: 'u1' }, { Id: 'u2' }, { Id: 'u3' }],
        flows: [{ Label: 'Sales to CS Handoff' }],
        dashboards: [{ Title: 'Manager Dashboard', FolderName: 'Sales' }],
        forecastingTypes: [{ Name: 'OpportunityRevenue' }],
        reportSchedules: [{ Id: 'sched_1' }],
        knowledgeArticles: [{ Title: 'Sales Playbook' }],
        objects: {
          Account: makeObjectDescribe([
            makeField('NPS_Score__c', 'NPS Score', 'number'),
          ]),
        },
      });

      const result = inferEnhancedAnswers(enhanced, metadata);

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

  // -- C2 is explicitly skipped --

  describe('C2 -- response time (intentionally skipped)', () => {
    test('never produces a C2 entry', () => {
      const enhanced = buildEnhanced({
        arrAggregate: [{ total: 50000000 }],
        leadSourceDistribution: [{ LeadSource: 'Web', cnt: 100 }],
      });
      const metadata = buildMetadata({
        flows: [{ Label: 'Response Time SLA' }],
      });
      const result = inferEnhancedAnswers(enhanced, metadata);
      expect(result.C2).toBeUndefined();
    });
  });
});
