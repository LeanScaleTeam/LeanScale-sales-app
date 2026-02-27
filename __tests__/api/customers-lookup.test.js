/**
 * Tests for pages/api/customers/lookup.js
 *
 * TDD Phase 1: Tests define the expected behavior of the customer lookup endpoint.
 * Mocks supabase for customer slug resolution.
 */

// ── Mocks (before imports) ──

const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockSingle = jest.fn();

const mockFrom = jest.fn();

jest.mock('../../lib/supabase', () => ({
  supabaseAdmin: {
    from: (...args) => mockFrom(...args),
  },
}));

// ── Import handler ──

const handler = require('../../pages/api/customers/lookup').default;

// ── Helpers ──

function mockReq(method = 'GET', query = {}) {
  return { method, query };
}

function mockRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
}

function setupSupabaseChain(result) {
  const chain = {
    select: mockSelect,
    eq: mockEq,
    single: mockSingle,
  };

  mockSelect.mockReturnValue(chain);
  mockEq.mockReturnValue(chain);
  mockSingle.mockReturnValue(result || { data: null, error: null });
  mockFrom.mockReturnValue(chain);

  return chain;
}

// ── Tests ──

describe('GET /api/customers/lookup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupSupabaseChain({ data: null, error: null });
  });

  test('rejects non-GET methods with 405', async () => {
    const req = mockReq('POST');
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  test('returns 400 when slug is missing', async () => {
    const req = mockReq('GET', {});
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'slug is required' });
  });

  test('returns 400 when slug is empty string', async () => {
    const req = mockReq('GET', { slug: '' });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'slug is required' });
  });

  test('queries supabase with correct table, select, and slug', async () => {
    setupSupabaseChain({
      data: { id: 'abc-123', name: 'Scandit', slug: 'scandit' },
      error: null,
    });

    const req = mockReq('GET', { slug: 'scandit' });
    const res = mockRes();

    await handler(req, res);

    expect(mockFrom).toHaveBeenCalledWith('customers');
    expect(mockSelect).toHaveBeenCalledWith('id, name, slug');
    expect(mockEq).toHaveBeenCalledWith('slug', 'scandit');
  });

  test('returns customer record on success', async () => {
    setupSupabaseChain({
      data: { id: 'abc-123', name: 'Scandit', slug: 'scandit' },
      error: null,
    });

    const req = mockReq('GET', { slug: 'scandit' });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 'abc-123',
      name: 'Scandit',
      slug: 'scandit',
    });
  });

  test('returns 404 when customer not found', async () => {
    setupSupabaseChain({
      data: null,
      error: { message: 'No rows found', code: 'PGRST116' },
    });

    const req = mockReq('GET', { slug: 'nonexistent' });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Customer not found' });
  });

  test('returns 500 on unexpected database error', async () => {
    mockFrom.mockImplementation(() => {
      throw new Error('Connection failed');
    });

    const req = mockReq('GET', { slug: 'scandit' });
    const res = mockRes();

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});
