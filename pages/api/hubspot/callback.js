/**
 * HubSpot OAuth Callback
 * GET /api/hubspot/callback?code=xxx&state=xxx
 *
 * Handles the OAuth callback from HubSpot:
 * 1. Exchanges auth code for tokens
 * 2. Gets portal info
 * 3. Stores tokens in hubspot_connections
 * 4. Triggers metadata download
 * 5. Redirects back to intake form
 */

import { exchangeCodeForTokens, getPortalInfo } from '../../../lib/hubspot';
import { downloadAndStoreMetadata } from '../../../lib/hubspot-downloader';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error: oauthError, state } = req.query;

  // Decode state to get customerId and slug
  let customerId, slug;
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString());
    customerId = decoded.customerId;
    slug = decoded.slug;
  } catch {
    return res.status(400).json({ error: 'Invalid state parameter' });
  }

  // Handle OAuth errors
  if (oauthError) {
    return res.redirect(`/c/${slug}/diagnostic/intake?hubspot=error&reason=${encodeURIComponent(oauthError)}`);
  }

  if (!code) {
    return res.redirect(`/c/${slug}/diagnostic/intake?hubspot=error&reason=no_code`);
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Get portal info
    const portalInfo = await getPortalInfo(tokens.access_token);
    const portalId = portalInfo.portalId;
    const portalName = portalInfo.accountName || 'Unknown';

    // Store connection in Supabase
    await supabaseAdmin.from('hubspot_connections').upsert(
      {
        customer_id: customerId,
        portal_id: portalId,
        portal_name: portalName,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        scopes_granted: tokens.scope ? tokens.scope.split(' ') : [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'customer_id,portal_id' }
    );

    // Update customer with CRM type and portal ID
    await supabaseAdmin
      .from('customers')
      .update({
        crm_type: 'hubspot',
        hubspot_portal_id: portalId,
      })
      .eq('id', customerId);

    // Download metadata (blocking — ~15-30 seconds)
    await downloadAndStoreMetadata(customerId, portalId, tokens.access_token);

    // Redirect back to intake form
    res.redirect(
      `/c/${slug}/diagnostic/intake?hubspot=connected&portalName=${encodeURIComponent(portalName)}`
    );
  } catch (err) {
    console.error('HubSpot callback error:', err);
    res.redirect(
      `/c/${slug}/diagnostic/intake?hubspot=error&reason=${encodeURIComponent(err.message)}`
    );
  }
}
