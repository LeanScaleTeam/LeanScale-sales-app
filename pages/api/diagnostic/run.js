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
import { mergeMultiSourceSignals } from '../../../lib/diagnostic-engine/signal-merger';
import {
  SYSTEM_KEYS,
  normalizeCrmSystems,
  deriveLegacyCrmType,
} from '../../../lib/diagnostic-engine/crm-systems';

function isAdmin(req) {
  const cookies = req.cookies || {};
  return Object.keys(cookies).some(
    key => key.startsWith('sb-') && key.endsWith('-auth-token')
  ) || !!(cookies['admin-session']);
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleRun(req, res);
  }
  if (req.method === 'PUT') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
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
      .maybeSingle();

    if (!intake) {
      return res.status(404).json({ error: 'No intake found. Complete the intake form first.' });
    }

    // Detect CRM type. Prefer the new crm_systems array (multi-CRM); fall back
    // to legacy crm_type + intake A1 if absent.
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('crm_type, crm_systems')
      .eq('id', customerId)
      .maybeSingle();

    let crmSystems = normalizeCrmSystems(customer?.crm_systems);
    if (crmSystems.length === 0) {
      crmSystems = normalizeCrmSystems(customer?.crm_type);
    }
    if (crmSystems.length === 0) {
      crmSystems = normalizeCrmSystems(intake.answers.A1);
    }
    const legacyCrmType = deriveLegacyCrmType(crmSystems);

    const needsSalesforce = crmSystems.includes(SYSTEM_KEYS.SALESFORCE);
    const needsHubspot =
      crmSystems.includes(SYSTEM_KEYS.HUBSPOT_CRM) ||
      crmSystems.includes(SYSTEM_KEYS.HUBSPOT_MAP);
    const needsAttio = crmSystems.includes(SYSTEM_KEYS.ATTIO);

    let sfMetadataId = null;
    let hsMetadataId = null;
    let attioMetadataId = null;
    let sfSignals = {};
    let hsSignals = {};
    let attioSignals = {};

    if (needsSalesforce) {
      const { data: sfMetadata } = await supabaseAdmin
        .from('salesforce_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (sfMetadata) {
        sfMetadataId = sfMetadata.id;
        sfSignals = sfMetadata.computed_signals || {};
      }
    }

    if (needsHubspot) {
      const { data: hsMetadata } = await supabaseAdmin
        .from('hubspot_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('downloaded_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (hsMetadata) {
        hsMetadataId = hsMetadata.id;
        hsSignals = hsMetadata.computed_signals || {};
      }
    }

    if (needsAttio) {
      const { data: attioMetadata } = await supabaseAdmin
        .from('attio_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('downloaded_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (attioMetadata) {
        attioMetadataId = attioMetadata.id;
        attioSignals = attioMetadata.computed_signals || {};
      }
    }

    const sourceCount = [
      Object.keys(sfSignals).length > 0,
      Object.keys(hsSignals).length > 0,
      Object.keys(attioSignals).length > 0,
    ].filter(Boolean).length;

    let computedSignals;
    if (sourceCount > 1) {
      computedSignals = mergeMultiSourceSignals({
        salesforce: sfSignals,
        hubspot: hsSignals,
        attio: attioSignals,
      });
    } else if (Object.keys(attioSignals).length > 0) {
      computedSignals = attioSignals;
    } else if (Object.keys(hsSignals).length > 0) {
      computedSignals = hsSignals;
    } else {
      computedSignals = sfSignals;
    }

    // Run the diagnostic engine — pass the canonical crm_systems array.
    const result = runDiagnostic(intake.answers, computedSignals, crmSystems);

    // Store result in diagnostic_results (version=2)
    const upsertData = {
      customer_id: customerId,
      diagnostic_type: 'gtm',
      version: 2,
      crm_type: legacyCrmType,
      items: result.items,
      scores: result.scores,
      company_profile: result.company_profile,
      metadata: result.metadata,
      intake_id: intake.id,
      hubspot_metadata_id: hsMetadataId,
      salesforce_metadata_id: sfMetadataId,
      attio_metadata_id: attioMetadataId,
    };
    if (sourceCount > 1) {
      upsertData.merged_signals = computedSignals;
    }
    // Remove undefined keys so Supabase doesn't try to set missing columns
    for (const key of Object.keys(upsertData)) {
      if (upsertData[key] === undefined) delete upsertData[key];
    }

    const { data: stored, error } = await supabaseAdmin
      .from('diagnostic_results')
      .upsert(upsertData, { onConflict: 'customer_id,diagnostic_type' })
      .select('id')
      .maybeSingle();

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
 * Admin override: update individual item statuses and/or engagement overrides.
 * Body: { customerId, items?: [...], engagementOverrides?: {...}, diagnosticResultId?: string }
 */
async function handleUpdate(req, res) {
  const { customerId, items: updatedItems, engagementOverrides, diagnosticResultId, diagnosticVersion } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    // If only saving engagement overrides (v2/v3), use diagnosticResultId directly
    if (engagementOverrides && !updatedItems) {
      const isV3 = diagnosticVersion === 3;
      const table = isV3 ? 'diagnostic_results_v3' : 'diagnostic_results';
      let id = diagnosticResultId;

      if (!id) {
        // Fallback: look up by customerId
        const { data: existing } = await supabaseAdmin
          .from(table)
          .select('id')
          .eq('customer_id', customerId)
          .eq('diagnostic_type', 'gtm')
          .maybeSingle();
        id = existing?.id;
      }

      if (id) {
        const { error } = await supabaseAdmin
          .from(table)
          .update({ engagement_overrides: engagementOverrides })
          .eq('id', id);

        if (error) {
          console.error(`Error saving engagement overrides to ${table}:`, error);
          return res.status(500).json({ error: 'Failed to save engagement overrides' });
        }

        return res.status(200).json({ success: true });
      }

      return res.status(404).json({ error: 'No diagnostic result found' });
    }

    // Original v2 item status update flow
    if (!updatedItems) {
      return res.status(400).json({ error: 'items or engagementOverrides required' });
    }

    // Get existing result
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('diagnostic_results')
      .select('id, items, scores, crm_type')
      .eq('customer_id', customerId)
      .eq('diagnostic_type', 'gtm')
      .eq('version', 2)
      .maybeSingle();

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

    // Build update payload
    const updatePayload = {
      items: currentItems,
      scores: newScores,
    };
    if (engagementOverrides) {
      updatePayload.engagement_overrides = engagementOverrides;
    }

    // Update
    const { error: updateError } = await supabaseAdmin
      .from('diagnostic_results')
      .update(updatePayload)
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
