/**
 * Attio OAuth Callback
 * GET /api/attio/callback?code=xxx&state=xxx
 *
 * 1. Exchanges auth code for access token
 * 2. Calls /v2/self to get workspace info
 * 3. Stores tokens in attio_connections
 * 4. Triggers metadata download
 * 5. Redirects back to intake form
 */

import { exchangeCodeForTokens, getSelf } from '../../../lib/attio';
import { downloadAndStoreMetadata } from '../../../lib/attio-downloader';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error: oauthError, state } = req.query;

  let customerId, slug;
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString());
    customerId = decoded.customerId;
    slug = decoded.slug;
  } catch {
    return res.status(400).json({ error: 'Invalid state parameter' });
  }

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({ error: 'Invalid slug in state' });
  }

  if (oauthError) {
    return res.redirect(
      `/c/${slug}/diagnostic/intake?attio=error&reason=${encodeURIComponent(oauthError)}`
    );
  }

  if (!code) {
    return res.redirect(`/c/${slug}/diagnostic/intake?attio=error&reason=no_code`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const self = await getSelf(tokens.access_token);

    const workspaceId = self.workspace_id || tokens.workspace_id;
    const workspaceName = self.workspace_name || tokens.workspace_name || 'Attio Workspace';
    const workspaceSlug = self.workspace_slug || null;

    // Store connection — Attio returns long-lived access tokens; refresh may not be present.
    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;

    await supabaseAdmin.from('attio_connections').upsert(
      {
        customer_id: customerId,
        workspace_id: workspaceId,
        workspace_name: workspaceName,
        workspace_slug: workspaceSlug,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || null,
        expires_at: expiresAt,
        scopes_granted: tokens.scope ? tokens.scope.split(' ') : [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'customer_id,workspace_id' }
    );

    // Mark this customer as Attio (single-CRM for now; dual-mode extension TBD)
    await supabaseAdmin
      .from('customers')
      .update({
        crm_type: 'attio',
        attio_workspace_id: workspaceId,
      })
      .eq('id', customerId);

    // Blocking metadata download (~10-30s depending on workspace size)
    await downloadAndStoreMetadata(customerId, workspaceId, tokens.access_token);

    // Auto-run diagnostic if intake is awaiting CRM data
    const { data: intake } = await supabaseAdmin
      .from('diagnostic_intake')
      .select('id, status, answers')
      .eq('customer_id', customerId)
      .maybeSingle();

    if (intake?.status === 'awaiting_crm_data') {
      const { runDiagnostic } = await import('../../../lib/diagnostic-engine');
      const { data: meta } = await supabaseAdmin
        .from('attio_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('downloaded_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const result = runDiagnostic(intake.answers, meta?.computed_signals || {}, 'attio');

      await supabaseAdmin.from('diagnostic_results').upsert(
        {
          customer_id: customerId,
          diagnostic_type: 'gtm',
          version: 2,
          crm_type: 'attio',
          items: result.items,
          scores: result.scores,
          company_profile: result.company_profile,
          metadata: result.metadata,
          intake_id: intake.id,
          attio_metadata_id: meta?.id || null,
        },
        { onConflict: 'customer_id,diagnostic_type' }
      );

      await supabaseAdmin
        .from('diagnostic_intake')
        .update({ status: 'complete' })
        .eq('customer_id', customerId);
    }

    return res.redirect(
      `/c/${slug}/diagnostic/intake?attio=connected&workspaceName=${encodeURIComponent(workspaceName)}`
    );
  } catch (err) {
    console.error('Attio callback error:', err);
    return res.redirect(
      `/c/${slug}/diagnostic/intake?attio=error&reason=${encodeURIComponent(err.message)}`
    );
  }
}
