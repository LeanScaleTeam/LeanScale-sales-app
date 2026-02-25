/**
 * Diagnostic Engine Run
 * POST /api/diagnostic/run
 * PUT  /api/diagnostic/run  (admin override of item statuses)
 *
 * POST: Reads intake + metadata, runs engine, stores result (version=2).
 * PUT:  Updates individual item statuses (admin editing).
 */

import { supabaseAdmin } from '../../../lib/supabase';
import { runDiagnostic } from '../../../lib/diagnostic-engine';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleRun(req, res);
  }
  if (req.method === 'PUT') {
    return handleUpdate(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleRun(req, res) {
  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    // Read intake answers
    const { data: intake } = await supabaseAdmin
      .from('diagnostic_intake')
      .select('id, answers')
      .eq('customer_id', customerId)
      .single();

    if (!intake) {
      return res.status(404).json({ error: 'No intake found. Complete the intake form first.' });
    }

    // Detect CRM type
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('crm_type')
      .eq('id', customerId)
      .single();

    const crmType = customer?.crm_type || 'unknown';
    let computedSignals = {};
    let metadataId = null;

    if (crmType === 'salesforce') {
      // Read Salesforce signals
      const { data: sfMetadata } = await supabaseAdmin
        .from('salesforce_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .single();

      computedSignals = sfMetadata?.computed_signals || {};
      metadataId = sfMetadata?.id || null;
    } else {
      // Read HubSpot signals (existing behavior)
      const { data: metadata } = await supabaseAdmin
        .from('hubspot_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('downloaded_at', { ascending: false })
        .limit(1)
        .single();

      computedSignals = metadata?.computed_signals || {};
      metadataId = metadata?.id || null;
    }

    // Run the diagnostic engine
    const result = runDiagnostic(intake.answers, computedSignals, crmType);

    // Store result in diagnostic_results (version=2)
    const { data: stored, error } = await supabaseAdmin
      .from('diagnostic_results')
      .upsert(
        {
          customer_id: customerId,
          diagnostic_type: 'gtm',
          version: 2,
          crm_type: crmType,
          items: result.items,
          scores: result.scores,
          company_profile: result.company_profile,
          metadata: result.metadata,
          intake_id: intake.id,
          hubspot_metadata_id: crmType === 'hubspot' ? metadataId : null,
          salesforce_metadata_id: crmType === 'salesforce' ? metadataId : null,
        },
        { onConflict: 'customer_id,diagnostic_type' }
      )
      .select('id')
      .single();

    if (error) {
      console.error('Error storing diagnostic result:', error);
      return res.status(500).json({ error: 'Failed to store result' });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: stored?.id,
        ...result,
      },
    });
  } catch (err) {
    console.error('Diagnostic run error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Admin override: update individual item statuses.
 * Body: { customerId, items: [{ id: 'F1', status: 'healthy' }, ...] }
 */
async function handleUpdate(req, res) {
  const { customerId, items: updatedItems } = req.body;

  if (!customerId || !updatedItems) {
    return res.status(400).json({ error: 'customerId and items are required' });
  }

  try {
    // Get existing result
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('diagnostic_results')
      .select('id, items, scores, crm_type')
      .eq('customer_id', customerId)
      .eq('diagnostic_type', 'gtm')
      .eq('version', 2)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'No v2 diagnostic result found' });
    }

    // Apply overrides
    const currentItems = existing.items || [];
    for (const update of updatedItems) {
      const idx = currentItems.findIndex((i) => i.id === update.id);
      if (idx !== -1) {
        currentItems[idx].status = update.status;
      }
    }

    // Recompute scores with updated statuses
    const { computeScores } = await import('../../../lib/diagnostic-engine/compute-scores');
    const { attachRecommendations } = await import('../../../lib/diagnostic-engine/generate-recommendations');

    attachRecommendations(currentItems);
    const newScores = computeScores(currentItems, existing.crm_type);

    // Update
    const { error: updateError } = await supabaseAdmin
      .from('diagnostic_results')
      .update({
        items: currentItems,
        scores: newScores,
      })
      .eq('id', existing.id);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update' });
    }

    return res.status(200).json({
      success: true,
      items: currentItems,
      scores: newScores,
    });
  } catch (err) {
    console.error('Diagnostic update error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
