/**
 * Roadmap Overrides API
 * GET  /api/diagnostic/v3/roadmap?customerId=... — Return roadmap with overrides applied
 * PUT  /api/diagnostic/v3/roadmap — Save roadmap overrides
 */

import { supabaseAdmin } from '../../../../lib/supabase';
import { applyRoadmapOverrides } from '../../../../lib/diagnostic-engine/v3/apply-roadmap-overrides';

function isAdmin(req) {
  return !!(req.cookies?.['admin-session'] || req.cookies?.['sb-access-token']);
}

export default async function handler(req, res) {
  if (req.method === 'GET') return handleGet(req, res);
  if (req.method === 'PUT') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
    return handlePut(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleGet(req, res) {
  const { customerId } = req.query;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('diagnostic_results_v3')
      .select('roadmap, roadmap_overrides')
      .eq('customer_id', customerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'No v3 diagnostic result found' });
      }
      console.error('Error fetching roadmap:', error);
      return res.status(500).json({ error: 'Failed to fetch roadmap' });
    }

    const merged = applyRoadmapOverrides(data.roadmap, data.roadmap_overrides);

    return res.status(200).json({
      success: true,
      data: {
        roadmap: merged,
        overrides: data.roadmap_overrides,
        hasOverrides: !!data.roadmap_overrides,
      },
    });
  } catch (err) {
    console.error('Roadmap GET error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handlePut(req, res) {
  const { customerId, overrides } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  if (!overrides || typeof overrides !== 'object') {
    return res.status(400).json({ error: 'overrides object is required' });
  }

  try {
    const { error } = await supabaseAdmin
      .from('diagnostic_results_v3')
      .update({
        roadmap_overrides: overrides,
        updated_at: new Date().toISOString(),
      })
      .eq('customer_id', customerId);

    if (error) {
      console.error('Error saving roadmap overrides:', error);
      return res.status(500).json({ error: 'Failed to save overrides' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Roadmap PUT error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
