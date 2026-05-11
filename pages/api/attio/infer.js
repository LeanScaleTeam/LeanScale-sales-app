/**
 * Attio Intake Pre-Fill Inferrer
 * POST /api/attio/infer  { customerId }
 *
 * Reads the most recent attio_metadata row and infers values for
 * intake questions we can answer from the API (object counts, member
 * count, deal pipeline presence, webhook usage, etc.).
 */

import { supabaseAdmin } from '../../../lib/supabase';
import { inferAttioIntakeAnswers } from '../../../lib/diagnostic-engine/intake-inferrer-attio';

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
      .from('attio_metadata')
      .select('*')
      .eq('customer_id', customerId)
      .order('downloaded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!row) {
      return res.status(404).json({ error: 'No Attio metadata found for this customer' });
    }

    const preFill = inferAttioIntakeAnswers(row);

    return res.status(200).json({ success: true, preFill });
  } catch (err) {
    console.error('Attio infer error:', err);
    return res.status(500).json({ error: 'Failed to infer intake answers' });
  }
}
