/**
 * Tests for lib/salesforce.js - Salesforce OAuth helpers
 *
 * These tests mock the Supabase clients and global fetch to test
 * the OAuth helper functions in isolation.
 */

// Mock the supabase module before importing salesforce.js
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockUpdate = jest.fn();
const mockEq = jest.fn();
const mockOrder = jest.fn();
const mockLimit = jest.fn();
const mockSingle = jest.fn();

// Build chainable mock
function buildChain(finalResult) {
  const chain = {
    from: mockFrom,
    select: mockSelect,
    update: mockUpdate,
    eq: mockEq,
    order: mockOrder,
    limit: mockLimit,
    single: mockSingle,
  };

  mockFrom.mockReturnValue(chain);
  mockSelect.mockReturnValue(chain);
  mockUpdate.mockReturnValue(chain);
  mockEq.mockReturnValue(chain);
  mockOrder.mockReturnValue(chain);
  mockLimit.mockReturnValue(chain);
  mockSingle.mockReturnValue(finalResult || { data: null, error: null });

  return chain;
}

jest.mock('../../lib/supabase', () => ({
  supabaseAdmin: {
    from: (...args) => mockFrom(...args),
  },
}));

// Save original env and fetch
const originalEnv = { ...process.env };
const originalFetch = global.fetch;

beforeAll(() => {
  process.env.SALESFORCE_CLIENT_ID = 'test-client-id';
  process.env.SALESFORCE_CLIENT_SECRET = 'test-client-secret';
  process.env.SALESFORCE_REDIRECT_URI = 'https://example.com/callback';
});

afterAll(() => {
  process.env = originalEnv;
  global.fetch = originalFetch;
});

const {
  getAuthorizationUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
  getAccessToken,
  getOrgIdentity,
} = require('../../lib/salesforce');

describe('lib/salesforce.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  // ==========================================
  // getAuthorizationUrl
  // ==========================================
  describe('getAuthorizationUrl', () => {
    test('builds production authorization URL with correct parameters', () => {
      const url = getAuthorizationUrl('cust-123', 'acme', false);

      expect(url).toContain('https://login.salesforce.com/services/oauth2/authorize');
      expect(url).toContain('client_id=test-client-id');
      expect(url).toContain('redirect_uri=');
      expect(url).toContain('response_type=code');
    });

    test('builds sandbox authorization URL when isSandbox is true', () => {
      const url = getAuthorizationUrl('cust-123', 'acme', true);

      expect(url).toContain('https://test.salesforce.com/services/oauth2/authorize');
    });

    test('encodes state as base64url JSON with customerId, slug, and isSandbox', () => {
      const url = getAuthorizationUrl('cust-123', 'acme', false);
      const urlObj = new URL(url);
      const state = urlObj.searchParams.get('state');

      const decoded = JSON.parse(Buffer.from(state, 'base64url').toString());
      expect(decoded).toEqual({
        customerId: 'cust-123',
        slug: 'acme',
        isSandbox: false,
      });
    });

    test('encodes sandbox flag in state when isSandbox is true', () => {
      const url = getAuthorizationUrl('cust-456', 'sandbox-co', true);
      const urlObj = new URL(url);
      const state = urlObj.searchParams.get('state');

      const decoded = JSON.parse(Buffer.from(state, 'base64url').toString());
      expect(decoded).toEqual({
        customerId: 'cust-456',
        slug: 'sandbox-co',
        isSandbox: true,
      });
    });

    test('defaults to production URL when isSandbox is falsy', () => {
      const url = getAuthorizationUrl('cust-123', 'acme');

      expect(url).toContain('https://login.salesforce.com/services/oauth2/authorize');
    });
  });

  // ==========================================
  // exchangeCodeForTokens
  // ==========================================
  describe('exchangeCodeForTokens', () => {
    test('exchanges code for tokens using production endpoint', async () => {
      const mockTokens = {
        access_token: 'access-123',
        refresh_token: 'refresh-456',
        instance_url: 'https://na1.salesforce.com',
        id: 'https://login.salesforce.com/id/orgId/userId',
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTokens),
      });

      const result = await exchangeCodeForTokens('auth-code-xyz', false);

      expect(result).toEqual(mockTokens);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://login.salesforce.com/services/oauth2/token',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      );

      // Verify body parameters
      const callArgs = global.fetch.mock.calls[0];
      const body = callArgs[1].body;
      expect(body.get('grant_type')).toBe('authorization_code');
      expect(body.get('client_id')).toBe('test-client-id');
      expect(body.get('client_secret')).toBe('test-client-secret');
      expect(body.get('redirect_uri')).toBe('https://example.com/callback');
      expect(body.get('code')).toBe('auth-code-xyz');
    });

    test('exchanges code using sandbox endpoint when isSandbox is true', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ access_token: 'tok' }),
      });

      await exchangeCodeForTokens('code', true);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.salesforce.com/services/oauth2/token',
        expect.any(Object)
      );
    });

    test('throws error when token exchange fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('invalid_grant: expired authorization code'),
      });

      await expect(exchangeCodeForTokens('bad-code', false)).rejects.toThrow(
        'Token exchange failed'
      );
    });
  });

  // ==========================================
  // refreshAccessToken
  // ==========================================
  describe('refreshAccessToken', () => {
    test('refreshes token using production endpoint', async () => {
      const mockTokens = {
        access_token: 'new-access-789',
        instance_url: 'https://na1.salesforce.com',
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTokens),
      });

      const result = await refreshAccessToken('refresh-token-abc', false);

      expect(result).toEqual(mockTokens);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://login.salesforce.com/services/oauth2/token',
        expect.objectContaining({
          method: 'POST',
        })
      );

      // Verify body parameters
      const callArgs = global.fetch.mock.calls[0];
      const body = callArgs[1].body;
      expect(body.get('grant_type')).toBe('refresh_token');
      expect(body.get('client_id')).toBe('test-client-id');
      expect(body.get('client_secret')).toBe('test-client-secret');
      expect(body.get('refresh_token')).toBe('refresh-token-abc');
    });

    test('refreshes token using sandbox endpoint when isSandbox is true', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ access_token: 'tok' }),
      });

      await refreshAccessToken('refresh-token', true);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.salesforce.com/services/oauth2/token',
        expect.any(Object)
      );
    });

    test('throws error when refresh fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('invalid_grant: refresh token expired'),
      });

      await expect(refreshAccessToken('bad-refresh', false)).rejects.toThrow(
        'Token refresh failed'
      );
    });
  });

  // ==========================================
  // getAccessToken
  // ==========================================
  describe('getAccessToken', () => {
    test('returns existing token when updated recently (within 90 minutes)', async () => {
      const recentDate = new Date(Date.now() - 30 * 60 * 1000).toISOString(); // 30 min ago
      const mockConn = {
        id: 'conn-1',
        customer_id: 'cust-123',
        access_token: 'valid-token',
        refresh_token: 'refresh-tok',
        instance_url: 'https://na1.salesforce.com',
        is_sandbox: false,
        updated_at: recentDate,
      };

      buildChain();
      mockSingle.mockReturnValue({ data: mockConn, error: null });

      const result = await getAccessToken('cust-123');

      expect(result).toEqual({
        accessToken: 'valid-token',
        instanceUrl: 'https://na1.salesforce.com',
      });
      expect(mockFrom).toHaveBeenCalledWith('salesforce_connections');
      expect(mockEq).toHaveBeenCalledWith('customer_id', 'cust-123');
      // Should NOT call fetch to refresh
      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('refreshes token when updated_at is older than 90 minutes', async () => {
      const oldDate = new Date(Date.now() - 100 * 60 * 1000).toISOString(); // 100 min ago
      const mockConn = {
        id: 'conn-1',
        customer_id: 'cust-123',
        access_token: 'old-token',
        refresh_token: 'refresh-tok',
        instance_url: 'https://na1.salesforce.com',
        is_sandbox: false,
        updated_at: oldDate,
      };

      buildChain();
      mockSingle.mockReturnValue({ data: mockConn, error: null });

      // Mock the refresh fetch call
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'refreshed-token',
            instance_url: 'https://na1.salesforce.com',
          }),
      });

      const result = await getAccessToken('cust-123');

      expect(result).toEqual({
        accessToken: 'refreshed-token',
        instanceUrl: 'https://na1.salesforce.com',
      });
      // Should have called fetch to refresh
      expect(global.fetch).toHaveBeenCalled();
      // Should have updated the connection in Supabase
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          access_token: 'refreshed-token',
        })
      );
    });

    test('returns null when no connection exists', async () => {
      buildChain();
      mockSingle.mockReturnValue({ data: null, error: { message: 'Not found' } });

      const result = await getAccessToken('nonexistent');
      expect(result).toBeNull();
    });
  });

  // ==========================================
  // getOrgIdentity
  // ==========================================
  describe('getOrgIdentity', () => {
    test('fetches org identity from identity URL', async () => {
      const mockIdentity = {
        organization_id: 'org-123',
        username: 'admin@acme.com',
        display_name: 'Admin User',
        urls: {},
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockIdentity),
      });

      const result = await getOrgIdentity(
        'https://login.salesforce.com/id/orgId/userId',
        'access-token-xyz'
      );

      expect(result).toEqual(mockIdentity);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://login.salesforce.com/id/orgId/userId',
        expect.objectContaining({
          headers: { Authorization: 'Bearer access-token-xyz' },
        })
      );
    });

    test('throws error when identity fetch fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
      });

      await expect(
        getOrgIdentity('https://login.salesforce.com/id/org/user', 'bad-token')
      ).rejects.toThrow('Failed to get org identity');
    });
  });
});
