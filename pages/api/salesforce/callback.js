/**
 * Salesforce OAuth Callback
 * GET /api/salesforce/callback?code=xxx&state=xxx
 *
 * Handles the OAuth callback from Salesforce:
 * 1. Exchanges auth code for tokens
 * 2. Gets org identity
 * 3. Stores tokens in salesforce_connections
 * 4. Updates customer CRM type
 * 5. Triggers metadata download
 * 6. Auto-runs diagnostic if intake is awaiting CRM data
 * 7. Redirects back to intake form
 */

import { exchangeCodeForTokens, getOrgIdentity } from '../../../lib/salesforce';
import { downloadAndStoreMetadata } from '../../../lib/salesforce-downloader';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error: oauthError, state } = req.query;

  // Decode state to get customerId, slug, and isSandbox
  let customerId, slug, isSandbox;
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString());
    customerId = decoded.customerId;
    slug = decoded.slug;
    isSandbox = decoded.isSandbox || false;
  } catch {
    return res.status(400).json({ error: 'Invalid state parameter' });
  }

  // Handle OAuth errors
  if (oauthError) {
    return res.redirect(
      `/c/${slug}/diagnostic/intake?salesforce=error&reason=${encodeURIComponent(oauthError)}`
    );
  }

  if (!code) {
    return res.redirect(`/c/${slug}/diagnostic/intake?salesforce=error&reason=no_code`);
  }

  // Read PKCE code_verifier from cookie (Next.js parses cookies automatically)
  const codeVerifier = req.cookies?.sf_code_verifier;

  // Clear the verifier cookie
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie',
    `sf_code_verifier=; HttpOnly; SameSite=Lax; Path=/api/salesforce/callback; Max-Age=0${secure}`
  );

  try {
    // Exchange code for tokens with PKCE verifier
    const tokens = await exchangeCodeForTokens(code, isSandbox, codeVerifier);

    // Get org identity
    const identity = await getOrgIdentity(tokens.id, tokens.access_token);

    // Store connection in Supabase
    await supabaseAdmin.from('salesforce_connections').upsert(
      {
        customer_id: customerId,
        org_id: identity.orgId,
        instance_url: tokens.instance_url,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        is_sandbox: isSandbox,
        connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'customer_id,org_id' }
    );

    // Check if HubSpot is also connected — upgrade to dual
    const { data: hsConn } = await supabaseAdmin
      .from('hubspot_connections')
      .select('id')
      .eq('customer_id', customerId)
      .single();

    const newCrmType = hsConn ? 'dual' : 'salesforce';

    // Update customer CRM type
    await supabaseAdmin
      .from('customers')
      .update({ crm_type: newCrmType })
      .eq('id', customerId);

    // Download metadata (blocking)
    await downloadAndStoreMetadata(customerId, identity.orgId, tokens.instance_url, tokens.access_token);

    // Check if intake is awaiting CRM data — if so, auto-run diagnostic
    const { data: intake } = await supabaseAdmin
      .from('diagnostic_intake')
      .select('id, status, answers')
      .eq('customer_id', customerId)
      .single();

    if (intake?.status === 'awaiting_crm_data') {
      // Don't auto-run diagnostic for dual mode until both systems have metadata
      if (newCrmType === 'dual') {
        const { data: hsMetadata } = await supabaseAdmin
          .from('hubspot_metadata')
          .select('id')
          .eq('customer_id', customerId)
          .limit(1)
          .single();

        if (!hsMetadata) {
          // HubSpot metadata not ready yet — skip auto-run
          // The HubSpot callback will trigger it when ready
        } else {
          const { runDiagnostic } = await import('../../../lib/diagnostic-engine');
          const { data: metadata } = await supabaseAdmin
            .from('salesforce_metadata')
            .select('id, computed_signals')
            .eq('customer_id', customerId)
            .order('fetched_at', { ascending: false })
            .limit(1)
            .single();

          const result = runDiagnostic(intake.answers, metadata?.computed_signals || {}, 'dual');

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
              salesforce_metadata_id: metadata?.id || null,
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
        const { data: metadata } = await supabaseAdmin
          .from('salesforce_metadata')
          .select('id, computed_signals')
          .eq('customer_id', customerId)
          .order('fetched_at', { ascending: false })
          .limit(1)
          .single();

        const result = runDiagnostic(intake.answers, metadata?.computed_signals || {}, 'salesforce');

        await supabaseAdmin.from('diagnostic_results').upsert(
          {
            customer_id: customerId,
            diagnostic_type: 'gtm',
            version: 2,
            crm_type: 'salesforce',
            items: result.items,
            scores: result.scores,
            company_profile: result.company_profile,
            metadata: result.metadata,
            intake_id: intake.id,
            salesforce_metadata_id: metadata?.id || null,
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
    const orgName = encodeURIComponent(identity.displayName);
    res.redirect(`/c/${slug}/diagnostic/intake?salesforce=connected&orgName=${orgName}`);
  } catch (err) {
    console.error('Salesforce callback error:', err);
    res.redirect(
      `/c/${slug}/diagnostic/intake?salesforce=error&reason=${encodeURIComponent(err.message)}`
    );
  }
}
