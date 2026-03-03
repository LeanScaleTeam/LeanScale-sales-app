/**
 * Diagnostic v3 Results
 * GET /api/diagnostic/v3/results?customerId=...
 *
 * Returns the full v3 diagnostic result for display.
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
    const { data, error } = await supabaseAdmin
      .from('diagnostic_results_v3')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'No v3 diagnostic result found' });
      }
      console.error('Error fetching v3 result:', error);
      return res.status(500).json({ error: 'Failed to fetch result' });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: data.id,
        version: data.version,
        crm_type: data.crm_type,
        score_card: data.score_card,
        pillar_scores: data.pillar_scores,
        department_scores: data.department_scores,
        overall_score: data.overall_score,
        roadmap: data.roadmap,
        roadmap_overrides: data.roadmap_overrides || null,
        company_profile: data.company_profile,
        data_coverage: data.data_coverage,
        metadata: data.metadata,
        transcript_ids: data.transcript_ids,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
    });
  } catch (err) {
    console.error('v3 results fetch error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
