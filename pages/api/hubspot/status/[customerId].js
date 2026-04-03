/**
 * HubSpot Connection Status
 * GET /api/hubspot/status/[customerId]
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
    // Check for connection
    const { data: connection } = await supabaseAdmin
      .from('hubspot_connections')
      .select('portal_id, portal_name, connected_at, updated_at')
      .eq('customer_id', customerId)
      .order('connected_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!connection) {
      return res.status(200).json({
        connected: false,
        portalId: null,
        portalName: null,
        lastDownloaded: null,
        signalsReady: false,
      });
    }

    // Check for metadata
    const { data: metadata } = await supabaseAdmin
      .from('hubspot_metadata')
      .select('downloaded_at, computed_signals')
      .eq('customer_id', customerId)
      .eq('portal_id', connection.portal_id)
      .maybeSingle();

    return res.status(200).json({
      connected: true,
      portalId: connection.portal_id,
      portalName: connection.portal_name,
      connectedAt: connection.connected_at,
      lastDownloaded: metadata?.downloaded_at || null,
      signalsReady: !!metadata?.computed_signals,
    });
  } catch (err) {
    console.error('HubSpot status error:', err);
    return res.status(500).json({ error: 'Failed to check status' });
  }
}
