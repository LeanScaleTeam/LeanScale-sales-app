/**
 * CRM Signals for Consultant Audit Form
 * GET /api/diagnostic/v3/crm-signals?customerId=...
 *
 * Returns computed_signals and enhanced_signals from the customer's
 * CRM metadata table (Salesforce or HubSpot).
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
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('crm_type')
      .eq('id', customerId)
      .single();

    const crmType = customer?.crm_type || 'unknown';
    let computedSignals = {};
    let enhancedSignals = {};

    if (crmType === 'salesforce') {
      const { data: sfMetadata } = await supabaseAdmin
        .from('salesforce_metadata')
        .select('computed_signals, enhanced_signals')
        .eq('customer_id', customerId)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .single();

      computedSignals = sfMetadata?.computed_signals || {};
      enhancedSignals = sfMetadata?.enhanced_signals || {};
    } else if (crmType === 'hubspot') {
      const { data: hsMetadata } = await supabaseAdmin
        .from('hubspot_metadata')
        .select('computed_signals')
        .eq('customer_id', customerId)
        .order('downloaded_at', { ascending: false })
        .limit(1)
        .single();

      computedSignals = hsMetadata?.computed_signals || {};
    }

    return res.status(200).json({
      success: true,
      data: { crmType, computedSignals, enhancedSignals },
    });
  } catch (err) {
    console.error('CRM signals fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch CRM signals' });
  }
}
