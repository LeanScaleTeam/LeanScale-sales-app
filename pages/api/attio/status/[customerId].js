/**
 * Attio Connection Status
 * GET /api/attio/status/[customerId]
 *
 * Returns connection status and download info for a customer.
 */

import { supabaseAdmin } from '../../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.query;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    const { data: connection } = await supabaseAdmin
      .from('attio_connections')
      .select('workspace_id, workspace_name, connected_at, updated_at')
      .eq('customer_id', customerId)
      .order('connected_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!connection) {
      return res.status(200).json({
        connected: false,
        workspaceId: null,
        workspaceName: null,
        lastDownloaded: null,
        signalsReady: false,
      });
    }

    const { data: metadata } = await supabaseAdmin
      .from('attio_metadata')
      .select('downloaded_at, computed_signals')
      .eq('customer_id', customerId)
      .eq('workspace_id', connection.workspace_id)
      .maybeSingle();

    return res.status(200).json({
      connected: true,
      workspaceId: connection.workspace_id,
      workspaceName: connection.workspace_name,
      connectedAt: connection.connected_at,
      lastDownloaded: metadata?.downloaded_at || null,
      signalsReady: !!metadata?.computed_signals,
    });
  } catch (err) {
    console.error('Attio status error:', err);
    return res.status(500).json({ error: 'Failed to check status' });
  }
}
