/**
 * Diagnostic v3 Engine Run
 * POST /api/diagnostic/v3/run — Run full v3 diagnostic
 * PUT  /api/diagnostic/v3/run — Admin override of specific cell scores
 */

import { supabaseAdmin } from '../../../../lib/supabase';
import { runDiagnosticV3, recomputeV3 } from '../../../../lib/diagnostic-engine/v3';
import { mergeMultiSourceSignals } from '../../../../lib/diagnostic-engine/signal-merger';
import {
  SYSTEM_KEYS,
  normalizeCrmSystems,
  deriveLegacyCrmType,
} from '../../../../lib/diagnostic-engine/crm-systems';

function isAdmin(req) {
  const cookies = req.cookies || {};
  return Object.keys(cookies).some(
    key => key.startsWith('sb-') && key.endsWith('-auth-token')
  ) || !!(cookies['admin-session']);
}

export default async function handler(req, res) {
  if (req.method === 'POST') return handleRun(req, res);
  if (req.method === 'PUT') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
    return handleUpdate(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleRun(req, res) {
  const { customerId, preserveRoadmap, force } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    // Snapshot existing roadmap so we can refuse to overwrite a non-empty one
    // with an empty regenerated one (data-loss guard).
    const { data: existingRow } = await supabaseAdmin
      .from('diagnostic_results_v3')
      .select('roadmap')
      .eq('customer_id', customerId)
      .maybeSingle();
    const existingRoadmapLen = Array.isArray(existingRow?.roadmap)
      ? existingRow.roadmap.length
      : 0;

    // Read intake answers
    const { data: intake, error: intakeError } = await supabaseAdmin
      .from('diagnostic_intake')
      .select('id, answers')
      .eq('customer_id', customerId)
      .maybeSingle();
    if (intakeError) throw new Error(`intake fetch failed: ${intakeError.message}`);

    // Detect CRM systems (multi-CRM aware). Prefer the new crm_systems array;
    // fall back to legacy crm_type and finally to intake A1.
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('crm_type, crm_systems')
      .eq('id', customerId)
      .maybeSingle();
    if (customerError) throw new Error(`customer fetch failed: ${customerError.message}`);

    let crmSystems = normalizeCrmSystems(customer?.crm_systems);
    if (crmSystems.length === 0) {
      crmSystems = normalizeCrmSystems(customer?.crm_type);
    }
    if (crmSystems.length === 0) {
      crmSystems = normalizeCrmSystems(intake?.answers?.A1);
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
      const { data: sfMetadata, error: sfError } = await supabaseAdmin
        .from('salesforce_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (sfError) throw new Error(`salesforce_metadata fetch failed: ${sfError.message}`);
      if (sfMetadata) {
        sfMetadataId = sfMetadata.id;
        sfSignals = sfMetadata.computed_signals || {};
      }
    }

    if (needsHubspot) {
      const { data: hsMetadata, error: hsError } = await supabaseAdmin
        .from('hubspot_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('downloaded_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (hsError) throw new Error(`hubspot_metadata fetch failed: ${hsError.message}`);
      if (hsMetadata) {
        hsMetadataId = hsMetadata.id;
        hsSignals = hsMetadata.computed_signals || {};
      }
    }

    if (needsAttio) {
      const { data: attioMetadata, error: attioError } = await supabaseAdmin
        .from('attio_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('downloaded_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (attioError) throw new Error(`attio_metadata fetch failed: ${attioError.message}`);
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

    // Fetch transcript assessments
    const { data: transcriptRows, error: trError } = await supabaseAdmin
      .from('transcript_assessments')
      .select('competency_id, department, score, confidence, evidence_quotes, assessment, reasoning')
      .eq('customer_id', customerId);
    if (trError) throw new Error(`transcript_assessments fetch failed: ${trError.message}`);

    const transcriptAssessments = {};
    if (transcriptRows) {
      // Take highest-confidence per competency+department
      for (const row of transcriptRows) {
        const key = `${row.competency_id}_${row.department}`;
        if (!transcriptAssessments[key] || row.confidence > transcriptAssessments[key].confidence) {
          transcriptAssessments[key] = {
            score: row.score,
            confidence: row.confidence,
            evidence: row.evidence_quotes || [],
            assessment: row.assessment,
            reasoning: row.reasoning,
          };
        }
      }
    }

    // Fetch consultant assessments
    const { data: consultantRows, error: caError } = await supabaseAdmin
      .from('consultant_assessments')
      .select('competency_id, department, score, notes')
      .eq('customer_id', customerId);
    if (caError) throw new Error(`consultant_assessments fetch failed: ${caError.message}`);

    const consultantAssessments = {};
    if (consultantRows) {
      for (const row of consultantRows) {
        const key = `${row.competency_id}_${row.department}`;
        consultantAssessments[key] = {
          score: row.score,
          notes: row.notes,
        };
      }
    }

    // Fetch transcript IDs
    const { data: transcripts, error: dtError } = await supabaseAdmin
      .from('diagnostic_transcripts')
      .select('id')
      .eq('customer_id', customerId);
    if (dtError) throw new Error(`diagnostic_transcripts fetch failed: ${dtError.message}`);

    const transcriptIds = (transcripts || []).map((t) => t.id);

    // Fetch transcript project signals
    const { data: signalRows, error: psError } = await supabaseAdmin
      .from('transcript_project_signals')
      .select('service_id, signal_type, confidence, evidence, reasoning')
      .eq('customer_id', customerId);
    if (psError) throw new Error(`transcript_project_signals fetch failed: ${psError.message}`);

    // Deduplicate: keep highest confidence per service_id
    const signalMap = {};
    for (const row of signalRows || []) {
      if (!signalMap[row.service_id] || row.confidence > signalMap[row.service_id].confidence) {
        signalMap[row.service_id] = row;
      }
    }
    const projectSignals = Object.values(signalMap);

    // Run the v3 engine — pass the canonical crm_systems array.
    const result = runDiagnosticV3(
      intake?.answers || {},
      computedSignals,
      transcriptAssessments,
      consultantAssessments,
      crmSystems,
      projectSignals
    );

    const newRoadmapLen = Array.isArray(result.roadmap) ? result.roadmap.length : 0;

    // Data-loss guard: if we are about to overwrite a non-empty stored roadmap
    // with an empty regenerated one, refuse unless caller passed force=true.
    // This prevents accidental wipes when input fetches return empty (RLS, env
    // misconfig, transient DB errors) and the engine produces no items.
    if (!preserveRoadmap && existingRoadmapLen > 0 && newRoadmapLen === 0 && !force) {
      return res.status(409).json({
        error: 'Refusing to overwrite non-empty roadmap with empty regenerated roadmap',
        existingRoadmapItems: existingRoadmapLen,
        diagnostics: {
          projectSignalCount: projectSignals.length,
          transcriptAssessmentCount: Object.keys(transcriptAssessments).length,
          consultantAssessmentCount: Object.keys(consultantAssessments).length,
          crmSignalCount: Object.keys(computedSignals).length,
          intakePresent: !!intake,
        },
        hint: 'Pass { force: true } to override, or { preserveRoadmap: true } to keep the stored roadmap.',
      });
    }

    // Store result — when preserveRoadmap is set, only update scores (not roadmap)
    const upsertData = {
      customer_id: customerId,
      version: 3,
      crm_type: legacyCrmType,
      score_card: result.score_card,
      pillar_scores: result.pillar_scores,
      department_scores: result.department_scores,
      overall_score: result.overall_score,
      intake_id: intake?.id || null,
      transcript_ids: transcriptIds,
      company_profile: result.company_profile,
      data_coverage: result.data_coverage,
      metadata: result.metadata,
      updated_at: new Date().toISOString(),
    };
    // Only include per-system columns if relevant (avoids failure if migration not yet applied)
    if (hsMetadataId) upsertData.hubspot_metadata_id = hsMetadataId;
    if (sfMetadataId) upsertData.salesforce_metadata_id = sfMetadataId;
    if (attioMetadataId) upsertData.attio_metadata_id = attioMetadataId;
    if (sourceCount > 1) upsertData.merged_signals = computedSignals;

    // Only overwrite the roadmap when not preserving it
    if (!preserveRoadmap) {
      upsertData.roadmap = result.roadmap;
    }

    const { data: stored, error } = await supabaseAdmin
      .from('diagnostic_results_v3')
      .upsert(upsertData, { onConflict: 'customer_id' })
      .select('id, roadmap')
      .maybeSingle();

    if (error) {
      console.error('Error storing v3 diagnostic result:', error);
      return res.status(500).json({ error: 'Failed to store result' });
    }

    // When preserving roadmap, return the existing roadmap from DB
    // but also include the freshly generated one as suggestedRoadmap for diffing
    const responseData = { id: stored?.id, ...result };
    if (preserveRoadmap && stored?.roadmap) {
      responseData.suggestedRoadmap = result.roadmap;
      responseData.roadmap = stored.roadmap;
    }

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (err) {
    console.error('v3 diagnostic run error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Admin override: update specific competency/department scores.
 * Body: { customerId, overrides: [{ competencyId, department, score }] }
 */
async function handleUpdate(req, res) {
  const { customerId, overrides } = req.body;

  if (!customerId || !overrides) {
    return res.status(400).json({ error: 'customerId and overrides are required' });
  }

  try {
    // Get existing result
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('diagnostic_results_v3')
      .select('*')
      .eq('customer_id', customerId)
      .maybeSingle();

    if (fetchError || !existing) {
      return res.status(404).json({ error: 'No v3 diagnostic result found' });
    }

    // Apply overrides to score_card
    const scoreCard = existing.score_card || {};
    for (const { competencyId, department, score } of overrides) {
      if (!scoreCard[competencyId]) scoreCard[competencyId] = {};
      scoreCard[competencyId][department] = score;
    }

    // Rebuild competencies from score_card for recomputation
    // We need the full competency objects; reconstruct from stored data
    // For simplicity, re-run the engine with overrides applied as consultant scores
    const consultantOverrides = {};
    for (const { competencyId, department, score } of overrides) {
      const key = `${competencyId}_${department}`;
      consultantOverrides[key] = { score, notes: 'Admin override' };
    }

    // Merge with existing consultant assessments
    const { data: existingConsultant } = await supabaseAdmin
      .from('consultant_assessments')
      .select('competency_id, department, score, notes')
      .eq('customer_id', customerId);

    for (const row of existingConsultant || []) {
      const key = `${row.competency_id}_${row.department}`;
      if (!consultantOverrides[key]) {
        consultantOverrides[key] = { score: row.score, notes: row.notes };
      }
    }

    // Also upsert into consultant_assessments for persistence
    for (const { competencyId, department, score } of overrides) {
      await supabaseAdmin
        .from('consultant_assessments')
        .upsert(
          {
            customer_id: customerId,
            competency_id: competencyId,
            department,
            score,
            notes: 'Admin override',
            assessed_by: 'admin',
            assessed_at: new Date().toISOString(),
          },
          { onConflict: 'customer_id,competency_id,department' }
        );
    }

    // Re-run the full engine with updated consultant scores
    // Fetch all needed data
    const { data: intake } = await supabaseAdmin
      .from('diagnostic_intake')
      .select('answers')
      .eq('customer_id', customerId)
      .maybeSingle();

    // Re-resolve crm_systems (multi-CRM aware)
    const { data: customerRow } = await supabaseAdmin
      .from('customers')
      .select('crm_type, crm_systems')
      .eq('id', customerId)
      .maybeSingle();
    let recomputeCrmSystems = normalizeCrmSystems(customerRow?.crm_systems);
    if (recomputeCrmSystems.length === 0) {
      recomputeCrmSystems = normalizeCrmSystems(existing.crm_type || customerRow?.crm_type);
    }

    let computedSignals = {};
    let recomputeSf = {};
    let recomputeHs = {};
    let recomputeAttio = {};

    if (recomputeCrmSystems.includes(SYSTEM_KEYS.SALESFORCE)) {
      const { data: sf } = await supabaseAdmin
        .from('salesforce_metadata')
        .select('computed_signals')
        .eq('customer_id', customerId)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (sf) recomputeSf = sf.computed_signals || {};
    }

    if (
      recomputeCrmSystems.includes(SYSTEM_KEYS.HUBSPOT_CRM) ||
      recomputeCrmSystems.includes(SYSTEM_KEYS.HUBSPOT_MAP)
    ) {
      const { data: hs } = await supabaseAdmin
        .from('hubspot_metadata')
        .select('computed_signals')
        .eq('customer_id', customerId)
        .order('downloaded_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (hs) recomputeHs = hs.computed_signals || {};
    }

    if (recomputeCrmSystems.includes(SYSTEM_KEYS.ATTIO)) {
      const { data: at } = await supabaseAdmin
        .from('attio_metadata')
        .select('computed_signals')
        .eq('customer_id', customerId)
        .order('downloaded_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (at) recomputeAttio = at.computed_signals || {};
    }

    const recomputeSourceCount = [
      Object.keys(recomputeSf).length > 0,
      Object.keys(recomputeHs).length > 0,
      Object.keys(recomputeAttio).length > 0,
    ].filter(Boolean).length;

    if (recomputeSourceCount > 1) {
      computedSignals = mergeMultiSourceSignals({
        salesforce: recomputeSf,
        hubspot: recomputeHs,
        attio: recomputeAttio,
      });
    } else if (Object.keys(recomputeAttio).length > 0) {
      computedSignals = recomputeAttio;
    } else if (Object.keys(recomputeHs).length > 0) {
      computedSignals = recomputeHs;
    } else {
      computedSignals = recomputeSf;
    }

    const { data: transcriptRows } = await supabaseAdmin
      .from('transcript_assessments')
      .select('competency_id, department, score, confidence, evidence_quotes')
      .eq('customer_id', customerId);

    const transcriptAssessments = {};
    for (const row of transcriptRows || []) {
      const key = `${row.competency_id}_${row.department}`;
      if (!transcriptAssessments[key] || row.confidence > transcriptAssessments[key].confidence) {
        transcriptAssessments[key] = { score: row.score, confidence: row.confidence, evidence: row.evidence_quotes || [] };
      }
    }

    const { runDiagnosticV3 } = await import('../../../../lib/diagnostic-engine/v3');
    const result = runDiagnosticV3(
      intake?.answers || {},
      computedSignals,
      transcriptAssessments,
      consultantOverrides,
      recomputeCrmSystems
    );

    // Update stored result — preserve existing roadmap (admin overrides are score-only)
    const { error: updateError } = await supabaseAdmin
      .from('diagnostic_results_v3')
      .update({
        score_card: result.score_card,
        pillar_scores: result.pillar_scores,
        department_scores: result.department_scores,
        overall_score: result.overall_score,
        data_coverage: result.data_coverage,
        metadata: result.metadata,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update' });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('v3 diagnostic update error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
