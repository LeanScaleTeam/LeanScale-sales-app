/**
 * Unified CRM Connection Status
 * GET /api/diagnostic/connection-status?customerId=xxx
 *
 * Returns both Salesforce and HubSpot connection status in a single call.
 * Useful for dual-mode UI to determine which CRM systems are connected.
 */

import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.query;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    const [sfResult, hsResult, customerResult] = await Promise.all([
      supabaseAdmin
        .from('salesforce_connections')
        .select('id, instance_url, is_sandbox')
        .eq('customer_id', customerId)
        .order('connected_at', { ascending: false })
        .limit(1)
        .single(),
      supabaseAdmin
        .from('hubspot_connections')
        .select('id, portal_id, portal_name')
        .eq('customer_id', customerId)
        .order('connected_at', { ascending: false })
        .limit(1)
        .single(),
      supabaseAdmin
        .from('customers')
        .select('crm_type')
        .eq('id', customerId)
        .single(),
    ]);

    const sf = sfResult.data;
    const hs = hsResult.data;
    const customer = customerResult.data;

    return res.status(200).json({
      crmType: customer?.crm_type || null,
      salesforce: {
        connected: !!sf,
        instanceUrl: sf?.instance_url || null,
        isSandbox: sf?.is_sandbox || null,
      },
      hubspot: {
        connected: !!hs,
        portalId: hs?.portal_id || null,
        portalName: hs?.portal_name || null,
      },
      isDual: !!sf && !!hs,
    });
  } catch (err) {
    console.error('Connection status error:', err);
    return res.status(500).json({ error: 'Failed to fetch connection status' });
  }
}
