import handler from '../../pages/api/diagnostic/vasco-power10';

jest.mock('../../lib/supabase', () => {
  const single = jest.fn();
  const limit = jest.fn(() => ({ single }));
  const order = jest.fn(() => ({ limit }));
  const eq = jest.fn(() => ({ order }));
  const select = jest.fn(() => ({ eq }));
  const from = jest.fn(() => ({ select }));
  return { supabaseAdmin: { from }, __mocks: { single, limit, order, eq, select, from } };
});

const { __mocks } = require('../../lib/supabase');

function mockReqRes({ method = 'GET', query = {} } = {}) {
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; return this; },
  };
  return [{ method, query }, res];
}

describe('/api/diagnostic/vasco-power10', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset only the leaf mock — the chain mocks (from/select/eq/order/limit) keep
    // their return-next-level wiring set in the jest.mock factory above.
    __mocks.single.mockReset();
    __mocks.single.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
  });

  test('400 when customerId missing', async () => {
    const [req, res] = mockReqRes({ query: {} });
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  test('returns vascoPower10: {} when no snapshot exists', async () => {
    __mocks.single.mockResolvedValue({ data: null, error: { code: 'PGRST116' } });
    const [req, res] = mockReqRes({ query: { customerId: 'c-1' } });
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ vascoPower10: {} });
  });

  test('returns resolved metrics when snapshot exists', async () => {
    __mocks.single.mockResolvedValue({
      data: {
        snapshot_date: new Date().toISOString(),
        volume_metrics: { data: [{ month: '2026-03', net_arr: 1100000 }, { month: '2026-04', net_arr: 9 }] },
      },
      error: null,
    });
    const [req, res] = mockReqRes({ query: { customerId: 'c-1' } });
    await handler(req, res);
    expect(res.body.vascoPower10.D5_arr).toMatchObject({ available: true, formatted: '$1.1M' });
  });

  test('405 on non-GET', async () => {
    const [req, res] = mockReqRes({ method: 'POST', query: { customerId: 'c-1' } });
    await handler(req, res);
    expect(res.statusCode).toBe(405);
  });

  test('500 on unexpected supabase error', async () => {
    __mocks.single.mockResolvedValue({ data: null, error: { code: 'XX000', message: 'boom' } });
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const [req, res] = mockReqRes({ query: { customerId: 'c-1' } });
    await handler(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to load snapshot' });
    errSpy.mockRestore();
  });
});
