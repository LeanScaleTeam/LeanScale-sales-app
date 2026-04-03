import { supabaseAdmin } from '../../../lib/supabase';
import { inferHubSpotIntakeAnswers } from '../../../lib/diagnostic-engine/intake-inferrer-hs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.body || {};

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    const { data: row } = await supabaseAdmin
      .from('hubspot_metadata')
      .select('*')
      .eq('customer_id', customerId)
      .order('downloaded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!row) {
      return res.status(404).json({ error: 'No metadata found for this customer' });
    }

    // No column remapping needed — HubSpot metadata columns already match download shape
    const preFill = inferHubSpotIntakeAnswers(row);

    return res.status(200).json({ success: true, preFill });
  } catch (err) {
    console.error('HubSpot infer error:', err);
    return res.status(500).json({ error: 'Failed to infer intake answers' });
  }
}
