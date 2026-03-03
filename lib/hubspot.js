/**
 * HubSpot OAuth helpers
 *
 * Handles authorization URL generation, code exchange, token refresh,
 * and portal info retrieval. Stores tokens in Supabase hubspot_connections.
 */

import { supabaseAdmin } from './supabase';

const HUBSPOT_OAUTH_URL = 'https://app.hubspot.com/oauth/authorize';
const HUBSPOT_TOKEN_URL = 'https://api.hubapi.com/oauth/v1/token';
const HUBSPOT_API_BASE = 'https://api.hubapi.com';

const REQUIRED_SCOPES = 'oauth';

const OPTIONAL_SCOPES = [
  'crm.objects.contacts.read',
  'crm.objects.companies.read',
  'crm.objects.deals.read',
  'crm.schemas.contacts.read',
  'crm.schemas.companies.read',
  'crm.schemas.deals.read',
  'crm.objects.owners.read',
  'automation',
  'forms',
  'crm.lists.read',
  'marketing-email',
  'tickets',
  'crm.schemas.custom.read',
  'crm.objects.custom.read',
  'crm.objects.line_items.read',
  'crm.schemas.line_items.read',
  'crm.objects.quotes.read',
  'crm.schemas.quotes.read',
  'crm.objects.products.read',
  'automation.sequences.read',
  'crm.objects.feedback_submissions.read',
  'crm.objects.goals.read',
].join(' ');

/**
 * Build HubSpot OAuth authorization URL.
 * @param {string} customerId - UUID of the customer
 * @param {string} slug - Customer slug for redirect back
 * @returns {string} Full authorization URL
 */
export function getAuthorizationUrl(customerId, slug) {
  const state = Buffer.from(JSON.stringify({ customerId, slug })).toString('base64url');

  const params = new URLSearchParams({
    client_id: process.env.HUBSPOT_CLIENT_ID,
    redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
    scope: REQUIRED_SCOPES,
    optional_scope: OPTIONAL_SCOPES,
    state,
  });

  return `${HUBSPOT_OAUTH_URL}?${params}`;
}

/**
 * Exchange authorization code for access + refresh tokens.
 * @param {string} code - Authorization code from callback
 * @returns {Promise<{access_token: string, refresh_token: string, expires_in: number}>}
 */
export async function exchangeCodeForTokens(code) {
  const res = await fetch(HUBSPOT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.HUBSPOT_CLIENT_ID,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET,
      redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
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
 * @returns {Promise<{access_token: string, refresh_token: string, expires_in: number}>}
 */
export async function refreshAccessToken(refreshToken) {
  const res = await fetch(HUBSPOT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.HUBSPOT_CLIENT_ID,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET,
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
 * @param {string} customerId - UUID of the customer
 * @returns {Promise<{accessToken: string, portalId: number}|null>}
 */
export async function getAccessToken(customerId) {
  const { data: conn, error } = await supabaseAdmin
    .from('hubspot_connections')
    .select('*')
    .eq('customer_id', customerId)
    .order('connected_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !conn) return null;

  // Check if token expires within 5 minutes
  const expiresAt = new Date(conn.expires_at);
  const fiveMinFromNow = new Date(Date.now() + 5 * 60 * 1000);

  if (expiresAt > fiveMinFromNow) {
    return { accessToken: conn.access_token, portalId: conn.portal_id };
  }

  // Refresh the token
  const tokens = await refreshAccessToken(conn.refresh_token);

  const newExpiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  await supabaseAdmin
    .from('hubspot_connections')
    .update({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: newExpiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', conn.id);

  return { accessToken: tokens.access_token, portalId: conn.portal_id };
}

/**
 * Get HubSpot portal info (portalId, account name).
 * @param {string} accessToken - Valid access token
 * @returns {Promise<{portalId: number, accountName: string}>}
 */
export async function getPortalInfo(accessToken) {
  const res = await fetch(`${HUBSPOT_API_BASE}/oauth/v1/access-tokens/${accessToken}`);

  if (!res.ok) {
    throw new Error(`Failed to get portal info: ${res.status}`);
  }

  const data = await res.json();
  return {
    portalId: data.hub_id,
    accountName: data.hub_domain || data.app_id?.toString() || 'Unknown',
  };
}
