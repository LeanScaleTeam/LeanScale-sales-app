/**
 * Consultant Assessment API
 *
 * POST /api/diagnostic/consultant — Upsert consultant assessments (bulk)
 * GET  /api/diagnostic/consultant?customerId=... — Get all consultant assessments
 */

import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'POST') return handleUpsert(req, res);
  if (req.method === 'GET') return handleGet(req, res);
  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Bulk upsert consultant assessments.
 * Body: { customerId, assessments: [{ competencyId, department, score, notes }], assessedBy }
 */
async function handleUpsert(req, res) {
  const { customerId, assessments, assessedBy } = req.body;

  if (!customerId || !assessments || !Array.isArray(assessments)) {
    return res.status(400).json({ error: 'customerId and assessments array are required' });
  }

  try {
    const rows = assessments
      .filter((a) => a.competencyId && a.department && a.score >= 1 && a.score <= 5)
      .map((a) => ({
        customer_id: customerId,
        competency_id: a.competencyId,
        department: a.department,
        score: a.score,
        notes: a.notes || null,
        assessed_by: assessedBy || 'consultant',
        assessed_at: new Date().toISOString(),
      }));

    if (rows.length === 0) {
      return res.status(400).json({ error: 'No valid assessments provided' });
    }

    const { data, error } = await supabaseAdmin
      .from('consultant_assessments')
      .upsert(rows, { onConflict: 'customer_id,competency_id,department' })
      .select();

    if (error) {
      console.error('Error upserting consultant assessments:', error);
      return res.status(500).json({ error: 'Failed to save assessments' });
    }

    return res.status(200).json({
      success: true,
      data: {
        savedCount: data?.length || 0,
        assessments: data,
      },
    });
  } catch (err) {
    console.error('Consultant assessment upsert error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get all consultant assessments for a customer.
 */
async function handleGet(req, res) {
  const { customerId } = req.query;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('consultant_assessments')
      .select('*')
      .eq('customer_id', customerId)
      .order('competency_id');

    if (error) {
      console.error('Error fetching consultant assessments:', error);
      return res.status(500).json({ error: 'Failed to fetch assessments' });
    }

    return res.status(200).json({ success: true, data: data || [] });
  } catch (err) {
    console.error('Consultant assessment fetch error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
