/**
 * Salesforce Connection Status
 * GET /api/salesforce/status/[customerId]
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
      .from('salesforce_connections')
      .select('org_id, instance_url, is_sandbox, connected_at, updated_at')
      .eq('customer_id', customerId)
      .order('connected_at', { ascending: false })
      .limit(1)
      .single();

    if (!connection) {
      return res.status(200).json({
        connected: false,
        orgId: null,
        instanceUrl: null,
        lastDownloaded: null,
        signalsReady: false,
      });
    }

    // Check for metadata
    const { data: metadata } = await supabaseAdmin
      .from('salesforce_metadata')
      .select('fetched_at, computed_signals, source')
      .eq('customer_id', customerId)
      .order('fetched_at', { ascending: false })
      .limit(1)
      .single();

    return res.status(200).json({
      connected: true,
      orgId: connection.org_id,
      instanceUrl: connection.instance_url,
      isSandbox: connection.is_sandbox,
      connectedAt: connection.connected_at,
      lastDownloaded: metadata?.fetched_at || null,
      signalsReady: !!metadata?.computed_signals,
      source: metadata?.source || null,
    });
  } catch (err) {
    console.error('Salesforce status error:', err);
    return res.status(500).json({ error: 'Failed to check status' });
  }
}
