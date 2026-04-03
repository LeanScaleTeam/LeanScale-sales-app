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

  // Validate slug to prevent open redirect injection
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({ error: 'Invalid slug in state' });
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

    // Check if Salesforce is also connected — upgrade to dual
    const { data: sfConn } = await supabaseAdmin
      .from('salesforce_connections')
      .select('id')
      .eq('customer_id', customerId)
      .maybeSingle();

    const newCrmType = sfConn ? 'dual' : 'hubspot';

    // Update customer with CRM type and portal ID
    await supabaseAdmin
      .from('customers')
      .update({
        crm_type: newCrmType,
        hubspot_portal_id: portalId,
      })
      .eq('id', customerId);

    // Download metadata (blocking — ~15-30 seconds)
    await downloadAndStoreMetadata(customerId, portalId, tokens.access_token);

    // Check if intake is awaiting CRM data — if so, auto-run diagnostic
    const { data: intake } = await supabaseAdmin
      .from('diagnostic_intake')
      .select('id, status, answers')
      .eq('customer_id', customerId)
      .maybeSingle();

    if (intake?.status === 'awaiting_crm_data') {
      // Don't auto-run diagnostic for dual mode until both systems have metadata
      if (newCrmType === 'dual') {
        const { data: sfMetadata } = await supabaseAdmin
          .from('salesforce_metadata')
          .select('id')
          .eq('customer_id', customerId)
          .limit(1)
          .maybeSingle();

        if (!sfMetadata) {
          // Salesforce metadata not ready yet — skip auto-run
          // The Salesforce callback will trigger it when ready
        } else {
          const { runDiagnostic } = await import('../../../lib/diagnostic-engine');
          const { data: hsMetadata } = await supabaseAdmin
            .from('hubspot_metadata')
            .select('id, computed_signals')
            .eq('customer_id', customerId)
            .order('fetched_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          const result = runDiagnostic(intake.answers, hsMetadata?.computed_signals || {}, 'dual');

          await supabaseAdmin.from('diagnostic_results').upsert(
            {
              customer_id: customerId,
              diagnostic_type: 'gtm',
              version: 2,
              crm_type: 'dual',
              items: result.items,
              scores: result.scores,
              company_profile: result.company_profile,
              metadata: result.metadata,
              intake_id: intake.id,
              hubspot_metadata_id: hsMetadata?.id || null,
            },
            { onConflict: 'customer_id,diagnostic_type' }
          );

          await supabaseAdmin
            .from('diagnostic_intake')
            .update({ status: 'complete' })
            .eq('customer_id', customerId);
        }
      } else {
        const { runDiagnostic } = await import('../../../lib/diagnostic-engine');
        const { data: hsMetadata } = await supabaseAdmin
          .from('hubspot_metadata')
          .select('id, computed_signals')
          .eq('customer_id', customerId)
          .order('fetched_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const result = runDiagnostic(intake.answers, hsMetadata?.computed_signals || {}, 'hubspot');

        await supabaseAdmin.from('diagnostic_results').upsert(
          {
            customer_id: customerId,
            diagnostic_type: 'gtm',
            version: 2,
            crm_type: 'hubspot',
            items: result.items,
            scores: result.scores,
            company_profile: result.company_profile,
            metadata: result.metadata,
            intake_id: intake.id,
            hubspot_metadata_id: hsMetadata?.id || null,
          },
          { onConflict: 'customer_id,diagnostic_type' }
        );

        await supabaseAdmin
          .from('diagnostic_intake')
          .update({ status: 'complete' })
          .eq('customer_id', customerId);
      }
    }

    // Redirect back to intake form
    return res.redirect(
      `/c/${slug}/diagnostic/intake?hubspot=connected&portalName=${encodeURIComponent(portalName)}`
    );
  } catch (err) {
    console.error('HubSpot callback error:', err);
    return res.redirect(
      `/c/${slug}/diagnostic/intake?hubspot=error&reason=${encodeURIComponent(err.message)}`
    );
  }
}
