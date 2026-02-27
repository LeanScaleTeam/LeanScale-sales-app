/**
 * Tests for pages/api/salesforce/upload-json.js
 *
 * TDD Phase 1: Tests define the expected behavior of the JSON upload endpoint.
 * Mocks supabase, extractSalesforceSignals, and inferEnhancedAnswers.
 */

// ── Mocks (before imports) ──

// Mock extractSalesforceSignals
const mockExtractSignals = jest.fn();
jest.mock('../../lib/diagnostic-engine/signal-extractor-sf', () => ({
  extractSalesforceSignals: (...args) => mockExtractSignals(...args),
}));

// Mock inferEnhancedAnswers
const mockInferEnhanced = jest.fn();
jest.mock('../../lib/diagnostic-engine/intake-inferrer-sf-enhanced', () => ({
  inferEnhancedAnswers: (...args) => mockInferEnhanced(...args),
}));

// Mock runDiagnostic (dynamic import inside handler)
const mockRunDiagnostic = jest.fn();
jest.mock('../../lib/diagnostic-engine', () => ({
  runDiagnostic: (...args) => mockRunDiagnostic(...args),
}));

// Mock supabase
const mockUpsert = jest.fn();
const mockUpdate = jest.fn();
const mockSelectSingle = jest.fn();
const mockEq = jest.fn();
const mockOrder = jest.fn();
const mockLimit = jest.fn();

function makeChain(finalResult) {
  const chain = {
    upsert: mockUpsert,
    update: mockUpdate,
    select: mockSelectSingle,
    eq: mockEq,
    order: mockOrder,
    limit: mockLimit,
    single: jest.fn(),
  };

  mockUpsert.mockReturnValue({ error: null, ...chain });
  mockUpdate.mockReturnValue(chain);
  mockSelectSingle.mockReturnValue(chain);
  mockEq.mockReturnValue(chain);
  mockOrder.mockReturnValue(chain);
  mockLimit.mockReturnValue(chain);
  chain.single.mockReturnValue(finalResult || { data: null, error: null });

  return chain;
}

const mockFrom = jest.fn();

jest.mock('../../lib/supabase', () => ({
  supabaseAdmin: {
    from: (...args) => mockFrom(...args),
  },
}));

// ── Import handler ──

const handler = require('../../pages/api/salesforce/upload-json').default;

// ── Helpers ──

function mockReq(method = 'POST', body = {}) {
  return { method, body };
}

function mockRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
}

function validBody() {
  return {
    customerId: 'test-customer-id',
    metadata: {
      objects: {},
      stages: { opportunityStages: [] },
      users: [],
      flows: [],
      workflowRules: [],
      validationRules: [],
      apexTriggers: [],
      apexClasses: [],
      profiles: [],
      permissionSets: [],
      roles: [],
      reports: [],
      dashboards: [],
      connectedApps: [],
      namedCredentials: [],
      recordTypes: [],
      campaigns: [],
      installedPackages: [],
      territories: [],
      forecastingTypes: [],
      duplicateRules: [],
      reportSchedules: [],
      emailTemplates: [],
      taskAggregates: {},
      eventPatterns: [],
      contentVersions: [],
      knowledgeArticles: [],
    },
    enhanced: {
      arrAggregate: [],
      leadSourceDistribution: [],
      campaignTypes: [],
      loginHistory: [],
      partnerRoles: [],
      reportNames: [],
    },
  };
}

// ── Tests ──

describe('POST /api/salesforce/upload-json', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default: signal extractor returns signals
    mockExtractSignals.mockReturnValue({
      contact_total_properties: 10,
      company_total_properties: 5,
    });

    // Default: enhanced inferrer returns pre-fill answers
    mockInferEnhanced.mockReturnValue({
      A3: { value: '$1M-$5M', confidence: 'high', evidence: 'ARR aggregate data' },
      B2: { value: 'Outbound-led', confidence: 'medium', evidence: 'Lead source distribution' },
    });

    // Default: supabase chain
    const chain = makeChain({ data: null, error: null });
    mockFrom.mockReturnValue(chain);
  });

  test('rejects non-POST methods with 405', async () => {
    const req = mockReq('GET');
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  test('returns 400 when customerId is missing', async () => {
    const req = mockReq('POST', { metadata: {}, enhanced: {} });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'customerId is required' });
  });

  test('returns 400 when body is empty', async () => {
    const req = mockReq('POST', {});
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'customerId is required' });
  });

  test('calls extractSalesforceSignals with metadata from body', async () => {
    const body = validBody();
    const req = mockReq('POST', body);
    const res = mockRes();

    await handler(req, res);

    expect(mockExtractSignals).toHaveBeenCalledWith(body.metadata);
  });

  test('calls inferEnhancedAnswers with enhanced and metadata', async () => {
    const body = validBody();
    const req = mockReq('POST', body);
    const res = mockRes();

    await handler(req, res);

    expect(mockInferEnhanced).toHaveBeenCalledWith(body.enhanced, body.metadata);
  });

  test('upserts to salesforce_metadata with source cli and all v3 columns', async () => {
    const body = validBody();
    const req = mockReq('POST', body);
    const res = mockRes();

    await handler(req, res);

    // Verify upsert was called
    expect(mockFrom).toHaveBeenCalledWith('salesforce_metadata');
    expect(mockUpsert).toHaveBeenCalled();

    // Check the upsert payload
    const upsertPayload = mockUpsert.mock.calls[0][0];
    expect(upsertPayload.customer_id).toBe('test-customer-id');
    expect(upsertPayload.source).toBe('cli');
    expect(upsertPayload.org_id).toBe('cli');
    expect(upsertPayload.objects).toEqual({});
    expect(upsertPayload.campaigns).toEqual([]);
    expect(upsertPayload.installed_packages).toEqual([]);
    expect(upsertPayload.territories).toEqual([]);
    expect(upsertPayload.forecasting_types).toEqual([]);
    expect(upsertPayload.duplicate_rules).toEqual([]);
    expect(upsertPayload.report_schedules).toEqual([]);
    expect(upsertPayload.email_templates).toEqual([]);
    expect(upsertPayload.task_aggregates).toEqual({});
    expect(upsertPayload.event_patterns).toEqual([]);
    expect(upsertPayload.content_versions).toEqual([]);
    expect(upsertPayload.knowledge_articles).toEqual([]);
    expect(upsertPayload.enhanced_signals).toBeDefined();
  });

  test('upsert uses onConflict customer_id,org_id', async () => {
    const body = validBody();
    const req = mockReq('POST', body);
    const res = mockRes();

    await handler(req, res);

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.any(Object),
      { onConflict: 'customer_id,org_id' }
    );
  });

  test('updates customer crm_type to salesforce', async () => {
    const body = validBody();
    const req = mockReq('POST', body);
    const res = mockRes();

    await handler(req, res);

    expect(mockFrom).toHaveBeenCalledWith('customers');
    expect(mockUpdate).toHaveBeenCalledWith({ crm_type: 'salesforce' });
  });

  test('queries diagnostic_intake for the customer', async () => {
    const body = validBody();
    const req = mockReq('POST', body);
    const res = mockRes();

    await handler(req, res);

    expect(mockFrom).toHaveBeenCalledWith('diagnostic_intake');
  });

  test('returns 200 with success, signalCount, enhancedCount, preFillCount', async () => {
    const body = validBody();
    const req = mockReq('POST', body);
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      signalCount: 2,
      enhancedCount: 2,
      preFillCount: 2,
    });
  });

  test('returns 500 when supabase upsert fails', async () => {
    const chain = makeChain({ data: null, error: null });
    mockUpsert.mockReturnValue({ error: { message: 'DB error' }, ...chain });
    mockFrom.mockReturnValue(chain);

    const body = validBody();
    const req = mockReq('POST', body);
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to store metadata' });
  });

  test('runs diagnostic engine when intake is awaiting_crm_data', async () => {
    // Make the diagnostic_intake query return awaiting status
    const intakeResult = {
      data: { id: 'intake-123', status: 'awaiting_crm_data', answers: { A1: 'Salesforce' } },
      error: null,
    };

    // We need different returns for different tables
    const chain = makeChain({ data: null, error: null });

    let callCount = 0;
    mockFrom.mockImplementation((table) => {
      callCount++;
      if (table === 'diagnostic_intake') {
        return {
          ...chain,
          select: jest.fn().mockReturnValue({
            ...chain,
            eq: jest.fn().mockReturnValue({
              ...chain,
              single: jest.fn().mockReturnValue(intakeResult),
            }),
          }),
        };
      }
      return chain;
    });

    mockRunDiagnostic.mockReturnValue({
      items: [],
      scores: {},
      company_profile: {},
      metadata: {},
    });

    const body = validBody();
    const req = mockReq('POST', body);
    const res = mockRes();

    await handler(req, res);

    // Should have called runDiagnostic
    expect(mockRunDiagnostic).toHaveBeenCalled();
  });

  test('returns 500 on unexpected error', async () => {
    mockExtractSignals.mockImplementation(() => {
      throw new Error('Signal extraction failed');
    });

    const body = validBody();
    const req = mockReq('POST', body);
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  test('includes computed_signals and enhanced_signals in upsert', async () => {
    const body = validBody();
    const req = mockReq('POST', body);
    const res = mockRes();

    await handler(req, res);

    const upsertPayload = mockUpsert.mock.calls[0][0];
    expect(upsertPayload.computed_signals).toEqual({
      contact_total_properties: 10,
      company_total_properties: 5,
    });
    expect(upsertPayload.enhanced_signals).toEqual({
      A3: { value: '$1M-$5M', confidence: 'high', evidence: 'ARR aggregate data' },
      B2: { value: 'Outbound-led', confidence: 'medium', evidence: 'Lead source distribution' },
    });
  });

  test('includes fetched_at and updated_at timestamps in upsert', async () => {
    const body = validBody();
    const req = mockReq('POST', body);
    const res = mockRes();

    await handler(req, res);

    const upsertPayload = mockUpsert.mock.calls[0][0];
    expect(upsertPayload.fetched_at).toBeDefined();
    expect(upsertPayload.updated_at).toBeDefined();
    // Should be ISO date strings
    expect(typeof upsertPayload.fetched_at).toBe('string');
    expect(typeof upsertPayload.updated_at).toBe('string');
  });

  test('includes fetch_status with source cli', async () => {
    const body = validBody();
    const req = mockReq('POST', body);
    const res = mockRes();

    await handler(req, res);

    const upsertPayload = mockUpsert.mock.calls[0][0];
    expect(upsertPayload.fetch_status).toEqual({ source: 'cli' });
  });
});
