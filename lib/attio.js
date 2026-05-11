/**
 * Attio OAuth helpers
 *
 * Handles authorization URL generation, code exchange, token refresh,
 * and workspace info retrieval. Stores tokens in Supabase attio_connections.
 *
 * Docs:
 *   - OAuth flow:  https://developers.attio.com/reference/using-oauth
 *   - Token:       https://developers.attio.com/reference/post_oauth-token
 *   - Introspect:  https://developers.attio.com/reference/post_oauth-introspect
 *   - Identify:    https://docs.attio.com/rest-api/endpoint-reference/meta/identify
 */

import { supabaseAdmin } from './supabase';

const ATTIO_OAUTH_URL = 'https://app.attio.com/authorize';
const ATTIO_TOKEN_URL = 'https://app.attio.com/oauth/token';
const ATTIO_API_BASE = 'https://api.attio.com';

const SCOPES = [
  'object_configuration:read',
  'record_permission:read',
  'user_management:read',
  'task:read',
  'note:read',
  'webhook:read',
  'list_configuration:read',
  'list_entry:read',
  'comment:read',
].join(' ');

/**
 * Build Attio OAuth authorization URL.
 * @param {string} customerId - UUID of the customer
 * @param {string} slug - Customer slug for redirect back
 * @returns {string} Full authorization URL
 */
export function getAuthorizationUrl(customerId, slug) {
  const state = Buffer.from(JSON.stringify({ customerId, slug })).toString('base64url');

  const params = new URLSearchParams({
    client_id: process.env.ATTIO_CLIENT_ID,
    redirect_uri: process.env.ATTIO_REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES,
    state,
  });

  return `${ATTIO_OAUTH_URL}?${params}`;
}

/**
 * Exchange authorization code for access token.
 * Attio returns: { access_token, token_type, scope, workspace_id, workspace_name }
 * (Attio access tokens are long-lived; no refresh_token is returned for confidential clients
 * with the default config — re-auth is required if revoked.)
 */
export async function exchangeCodeForTokens(code) {
  const res = await fetch(ATTIO_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.ATTIO_CLIENT_ID,
      client_secret: process.env.ATTIO_CLIENT_SECRET,
      redirect_uri: process.env.ATTIO_REDIRECT_URI,
      code,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Attio token exchange failed: ${error}`);
  }

  return res.json();
}

/**
 * Get the authenticated workspace info via /v2/self.
 * Returns: { workspace_id, workspace_name, workspace_slug, authorized_by, scopes, ... }
 */
export async function getSelf(accessToken) {
  const res = await fetch(`${ATTIO_API_BASE}/v2/self`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Attio /v2/self failed: ${res.status}`);
  }

  const data = await res.json();
  return data.data || data;
}

/**
 * Get a valid access token for a customer.
 * Attio tokens are long-lived; we just return the stored token.
 * If introspection later shows the token is revoked, the caller should
 * trigger a re-auth flow.
 */
export async function getAccessToken(customerId) {
  const { data: conn, error } = await supabaseAdmin
    .from('attio_connections')
    .select('*')
    .eq('customer_id', customerId)
    .order('connected_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !conn) return null;

  return {
    accessToken: conn.access_token,
    workspaceId: conn.workspace_id,
    workspaceName: conn.workspace_name,
  };
}

/**
 * Introspect a token to verify it's still active and inspect granted scopes.
 * Useful before kicking off a long download to bail early if the token was revoked.
 */
export async function introspectToken(accessToken) {
  const res = await fetch(`${ATTIO_API_BASE}/oauth/introspect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.ATTIO_CLIENT_ID}:${process.env.ATTIO_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({ token: accessToken }),
  });

  if (!res.ok) return { active: false };
  return res.json();
}
