/**
 * GET /api/diagnostic/vasco-power10?customerId=<uuid>
 *
 * Loads the latest vasco_snapshots row for the customer and returns the
 * Power 10 metrics resolved from it. When no snapshot exists, returns
 * { vascoPower10: {} } so the intake form falls back to manual entry.
 */

import { supabaseAdmin } from '../../../lib/supabase';
import { resolvePower10FromSnapshot } from '../../../lib/vasco/power10-resolver';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.query;
  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const { data, error } = await supabaseAdmin
    .from('vasco_snapshots')
    .select('*')
    .eq('customer_id', customerId)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single();

  // PGRST116 = no rows found — that's not an error, just an empty result
  if (error && error.code !== 'PGRST116') {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ vascoPower10: resolvePower10FromSnapshot(data) });
}
