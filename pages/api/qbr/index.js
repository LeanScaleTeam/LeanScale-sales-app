/**
 * /api/qbr — List all QBRs for a customer (GET) or create a new one (POST)
 */

import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  switch (req.method) {
    case 'GET':  return handleGet(req, res);
    case 'POST': return handlePost(req, res);
    default:     return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req, res) {
  const { customerId } = req.query;
  if (!customerId) return res.status(400).json({ error: 'customerId required' });

  const { data, error } = await supabaseAdmin
    .from('customer_qbrs')
    .select('*')
    .eq('customer_id', customerId)
    .order('quarter', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ qbrs: data || [] });
}

async function handlePost(req, res) {
  const {
    customerId,
    quarter,
    quarterLabel,
    isBaseline = false,
    periodStart,
    periodEnd,
    hoursBudgeted,
    power10Snapshot,
    scoresSnapshot,
  } = req.body;

  if (!customerId || !quarter) {
    return res.status(400).json({ error: 'customerId and quarter required' });
  }

  const { data, error } = await supabaseAdmin
    .from('customer_qbrs')
    .insert({
      customer_id:      customerId,
      quarter,
      quarter_label:    quarterLabel || quarter,
      is_baseline:      isBaseline,
      period_start:     periodStart || null,
      period_end:       periodEnd   || null,
      hours_budgeted:   hoursBudgeted || null,
      power10_snapshot: power10Snapshot || [],
      scores_snapshot:  scoresSnapshot  || {},
      status: 'draft',
    })
    .select()
    .maybeSingle();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: `A QBR for ${quarter} already exists for this customer.` });
    }
    return res.status(500).json({ error: error.message });
  }
  return res.status(201).json({ qbr: data });
}
