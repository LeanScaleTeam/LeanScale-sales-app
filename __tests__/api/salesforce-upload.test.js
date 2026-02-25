/**
 * Tests for pages/api/salesforce/upload.js
 *
 * TDD Phase 1: Tests define the expected behavior of the upload endpoint.
 * Mocks formidable, supabase, parseMetadataZip, and extractSalesforceSignals.
 */

// ── Mocks (before imports) ──

// Mock formidable
const mockFormParse = jest.fn();
jest.mock('formidable', () => ({
  IncomingForm: jest.fn().mockImplementation(() => ({
    parse: mockFormParse,
  })),
}));

// Mock fs
jest.mock('fs', () => ({
  readFileSync: jest.fn().mockReturnValue(Buffer.from('fake-zip-data')),
}));

// Mock parseMetadataZip
const mockParseMetadataZip = jest.fn();
jest.mock('../../lib/salesforce-metadata-parser', () => ({
  parseMetadataZip: (...args) => mockParseMetadataZip(...args),
}));

// Mock extractSalesforceSignals
const mockExtractSignals = jest.fn();
jest.mock('../../lib/diagnostic-engine/signal-extractor-sf', () => ({
  extractSalesforceSignals: (...args) => mockExtractSignals(...args),
}));

// Mock supabase
const mockUpsert = jest.fn();
const mockUpdate = jest.fn();
const mockSelectSingle = jest.fn();
const mockEq = jest.fn();

function makeChain(finalResult) {
  const chain = {
    upsert: mockUpsert,
    update: mockUpdate,
    select: mockSelectSingle,
    eq: mockEq,
    single: jest.fn(),
  };

  mockUpsert.mockReturnValue({ error: null, ...chain });
  mockUpdate.mockReturnValue(chain);
  mockSelectSingle.mockReturnValue(chain);
  mockEq.mockReturnValue(chain);
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

const handler = require('../../pages/api/salesforce/upload').default;

// ── Helpers ──

function mockReq(method = 'POST') {
  return { method };
}

function mockRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
}

// ── Tests ──

describe('POST /api/salesforce/upload', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default: formidable returns valid file
    mockFormParse.mockImplementation((req, cb) => {
      cb(null, { customerId: ['test-customer-id'] }, {
        file: [{ filepath: '/tmp/upload.zip', size: 1024 }],
      });
    });

    // Default: parser returns metadata
    mockParseMetadataZip.mockResolvedValue({
      objects: {},
      stages: { opportunityStages: [], leadStatuses: [] },
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
    });

    // Default: signal extractor returns signals
    mockExtractSignals.mockReturnValue({
      contact_total_properties: 10,
      company_total_properties: 5,
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
    mockFormParse.mockImplementation((req, cb) => {
      cb(null, {}, { file: [{ filepath: '/tmp/upload.zip', size: 1024 }] });
    });

    const req = mockReq('POST');
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'customerId is required' });
  });

  test('returns 400 when no file is uploaded', async () => {
    mockFormParse.mockImplementation((req, cb) => {
      cb(null, { customerId: ['cust-123'] }, {});
    });

    const req = mockReq('POST');
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'No file uploaded' });
  });

  test('returns 400 when file exceeds 50MB', async () => {
    mockFormParse.mockImplementation((req, cb) => {
      cb(null, { customerId: ['cust-123'] }, {
        file: [{ filepath: '/tmp/big.zip', size: 51 * 1024 * 1024 }],
      });
    });

    const req = mockReq('POST');
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'File too large. Maximum 50MB.' });
  });

  test('calls parseMetadataZip with zip buffer from readFileSync', async () => {
    const req = mockReq('POST');
    const res = mockRes();

    await handler(req, res);

    expect(mockParseMetadataZip).toHaveBeenCalledWith(expect.any(Buffer));
  });

  test('calls extractSalesforceSignals with parsed metadata', async () => {
    const req = mockReq('POST');
    const res = mockRes();

    await handler(req, res);

    expect(mockExtractSignals).toHaveBeenCalledWith(
      expect.objectContaining({
        objects: expect.any(Object),
        flows: expect.any(Array),
      })
    );
  });

  test('returns 200 with success and signalCount on valid upload', async () => {
    const req = mockReq('POST');
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      signalCount: 2, // 2 keys in mockExtractSignals return
    });
  });

  test('returns 500 when formidable parse throws', async () => {
    mockFormParse.mockImplementation((req, cb) => {
      cb(new Error('Parse error'));
    });

    const req = mockReq('POST');
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test('exports config with bodyParser disabled', () => {
    const { config } = require('../../pages/api/salesforce/upload');
    expect(config).toEqual({ api: { bodyParser: false } });
  });
});
