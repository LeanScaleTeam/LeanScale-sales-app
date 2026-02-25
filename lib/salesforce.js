/**
 * Salesforce OAuth helpers
 *
 * Handles authorization URL generation, code exchange, token refresh,
 * and org identity retrieval. Stores tokens in Supabase salesforce_connections.
 */

import { supabaseAdmin } from './supabase';

const SF_LOGIN_URL = 'https://login.salesforce.com';
const SF_SANDBOX_LOGIN_URL = 'https://test.salesforce.com';

/**
 * Build Salesforce OAuth authorization URL.
 * @param {string} customerId - UUID of the customer
 * @param {string} slug - Customer slug for redirect back
 * @param {boolean} isSandbox - Whether to use sandbox login
 * @returns {string} Full authorization URL
 */
export function getAuthorizationUrl(customerId, slug, isSandbox = false) {
  const baseUrl = isSandbox ? SF_SANDBOX_LOGIN_URL : SF_LOGIN_URL;
  const state = Buffer.from(JSON.stringify({ customerId, slug, isSandbox })).toString('base64url');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SALESFORCE_CLIENT_ID,
    redirect_uri: process.env.SALESFORCE_REDIRECT_URI,
    state,
  });

  return `${baseUrl}/services/oauth2/authorize?${params}`;
}

/**
 * Exchange authorization code for access + refresh tokens.
 * @param {string} code - Authorization code from callback
 * @param {boolean} isSandbox - Whether to use sandbox token endpoint
 * @returns {Promise<{access_token: string, refresh_token: string, instance_url: string, id: string}>}
 */
export async function exchangeCodeForTokens(code, isSandbox = false) {
  const baseUrl = isSandbox ? SF_SANDBOX_LOGIN_URL : SF_LOGIN_URL;

  const res = await fetch(`${baseUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      redirect_uri: process.env.SALESFORCE_REDIRECT_URI,
      code,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return res.json();
}

/**
 * Refresh an expired access token.
 * @param {string} refreshToken - The refresh token
 * @param {boolean} isSandbox - Whether to use sandbox token endpoint
 * @returns {Promise<{access_token: string, instance_url: string}>}
 */
export async function refreshAccessToken(refreshToken, isSandbox = false) {
  const baseUrl = isSandbox ? SF_SANDBOX_LOGIN_URL : SF_LOGIN_URL;

  const res = await fetch(`${baseUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  return res.json();
}

/**
 * Get a valid access token for a customer, auto-refreshing if needed.
 * Salesforce access tokens expire ~2 hours after issue.
 * @param {string} customerId - UUID of the customer
 * @returns {Promise<{accessToken: string, instanceUrl: string, orgId: string}|null>}
 */
export async function getAccessToken(customerId) {
  const { data: conn, error } = await supabaseAdmin
    .from('salesforce_connections')
    .select('*')
    .eq('customer_id', customerId)
    .order('connected_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !conn) return null;

  // Salesforce tokens last ~2 hours; refresh proactively after 1.5 hours
  const connectedAt = new Date(conn.updated_at || conn.connected_at);
  const ninetyMinLater = new Date(connectedAt.getTime() + 90 * 60 * 1000);

  if (new Date() < ninetyMinLater) {
    return {
      accessToken: conn.access_token,
      instanceUrl: conn.instance_url,
      orgId: conn.org_id,
    };
  }

  // Refresh the token
  const tokens = await refreshAccessToken(conn.refresh_token, conn.is_sandbox);

  await supabaseAdmin
    .from('salesforce_connections')
    .update({
      access_token: tokens.access_token,
      instance_url: tokens.instance_url || conn.instance_url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', conn.id);

  return {
    accessToken: tokens.access_token,
    instanceUrl: tokens.instance_url || conn.instance_url,
    orgId: conn.org_id,
  };
}

/**
 * Get Salesforce org identity from the identity URL.
 * @param {string} identityUrl - The 'id' field from token response
 * @param {string} accessToken - Valid access token
 * @returns {Promise<{orgId: string, userId: string, displayName: string}>}
 */
export async function getOrgIdentity(identityUrl, accessToken) {
  const res = await fetch(identityUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to get org identity: ${res.status}`);
  }

  const data = await res.json();
  return {
    orgId: data.organization_id,
    userId: data.user_id,
    displayName: data.display_name || data.username || 'Unknown',
  };
}
