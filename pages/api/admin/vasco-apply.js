/**
 * Apply a Vasco snapshot to a customer's diagnostic.
 *
 * POST — apply the latest (or specified) snapshot
 *   body: { customerId, snapshotId? }
 *
 * Response: { success, applied: { crm_health, competency_scores, trends } }
 */

import { supabaseAdmin } from '../../../lib/supabase';
import {
  mapSnapshotToCrmHealth,
  mapSnapshotToCompetencyScores,
  mapSnapshotToTrends,
} from '../../../lib/vasco/map-snapshot';
import { V3_COMPETENCIES, expandDepartments } from '../../../lib/diagnostic-engine/v3/constants-v3';

function verifyAuth(req) {
  const cookies = req.cookies || {};
  return Object.keys(cookies).some(
    key => key.startsWith('sb-') && key.endsWith('-auth-token')
  ) || !!(cookies['admin-session']);
}

export default async function handler(req, res) {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId, snapshotId } = req.body;
  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    // 1. Fetch the snapshot
    let query = supabaseAdmin
      .from('vasco_snapshots')
      .select('*')
      .eq('customer_id', customerId)
      .eq('sync_status', 'complete');

    if (snapshotId) {
      query = query.eq('id', snapshotId);
    } else {
      query = query.order('snapshot_date', { ascending: false }).limit(1);
    }

    const { data: snapshots, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;

    if (!snapshots || snapshots.length === 0) {
      return res.status(404).json({ error: 'No completed Vasco snapshot found for this customer' });
    }

    const snapshot = snapshots[0];

    // 2. Map snapshot → crm_health
    const crmHealth = mapSnapshotToCrmHealth(snapshot);

    // 3. Map snapshot → competency scores
    const competencyScores = mapSnapshotToCompetencyScores(snapshot);

    // 4. Map snapshot → trend data
    const trends = mapSnapshotToTrends(snapshot);

    // 5. Write crm_health to engagement_overrides
    const { data: existing } = await supabaseAdmin
      .from('diagnostic_results_v3')
      .select('engagement_overrides')
      .eq('customer_id', customerId)
      .single();

    const currentOverrides = existing?.engagement_overrides || {};
    const updatedOverrides = {
      ...currentOverrides,
      crm_health: crmHealth,
      vasco_trends: trends,
      vasco_applied_at: new Date().toISOString(),
      vasco_snapshot_id: snapshot.id,
    };

    const { error: updateErr } = await supabaseAdmin
      .from('diagnostic_results_v3')
      .update({ engagement_overrides: updatedOverrides })
      .eq('customer_id', customerId);

    if (updateErr) throw updateErr;

    // 6. Write competency scores to consultant_assessments
    const bulkAssessments = [];
    for (const [competencyId, { score, rationale }] of Object.entries(competencyScores)) {
      const comp = V3_COMPETENCIES.find(c => c.id === competencyId);
      const depts = comp ? expandDepartments(comp.departments) : ['sales'];
      for (const dept of depts) {
        bulkAssessments.push({
          competencyId,
          department: dept,
          score,
          notes: rationale,
        });
      }
    }

    if (bulkAssessments.length > 0) {
      const { error: assessErr } = await supabaseAdmin
        .from('consultant_assessments')
        .upsert(
          bulkAssessments.map(a => ({
            customer_id: customerId,
            competency_id: a.competencyId,
            department: a.department,
            score: a.score,
            notes: a.notes,
            assessed_by: 'vasco-auto',
          })),
          { onConflict: 'customer_id,competency_id,department' }
        );

      if (assessErr) throw assessErr;
    }

    return res.status(200).json({
      success: true,
      snapshotId: snapshot.id,
      snapshotDate: snapshot.snapshot_date,
      applied: {
        crm_health: crmHealth,
        competency_scores: competencyScores,
        competency_count: bulkAssessments.length,
        trends_months: trends.funnelTrend.length,
      },
    });
  } catch (err) {
    console.error('Vasco apply error:', err);
    return res.status(500).json({ error: err.message });
  }
}
