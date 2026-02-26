/**
 * Diagnostic v3 Engine Run
 * POST /api/diagnostic/v3/run — Run full v3 diagnostic
 * PUT  /api/diagnostic/v3/run — Admin override of specific cell scores
 */

import { supabaseAdmin } from '../../../../lib/supabase';
import { runDiagnosticV3, recomputeV3 } from '../../../../lib/diagnostic-engine/v3';

export default async function handler(req, res) {
  if (req.method === 'POST') return handleRun(req, res);
  if (req.method === 'PUT') return handleUpdate(req, res);
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

    // Detect CRM type
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('crm_type')
      .eq('id', customerId)
      .single();

    const crmType = customer?.crm_type || 'unknown';
    let computedSignals = {};
    let metadataId = null;

    // Fetch CRM signals
    if (crmType === 'salesforce') {
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
      const { data: hsMetadata } = await supabaseAdmin
        .from('hubspot_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('downloaded_at', { ascending: false })
        .limit(1)
        .single();

      computedSignals = hsMetadata?.computed_signals || {};
      metadataId = hsMetadata?.id || null;
    }

    // Fetch transcript assessments
    const { data: transcriptRows } = await supabaseAdmin
      .from('transcript_assessments')
      .select('competency_id, department, score, confidence, evidence_quotes, assessment, reasoning')
      .eq('customer_id', customerId);

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
    const { data: consultantRows } = await supabaseAdmin
      .from('consultant_assessments')
      .select('competency_id, department, score, notes')
      .eq('customer_id', customerId);

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
    const { data: transcripts } = await supabaseAdmin
      .from('diagnostic_transcripts')
      .select('id')
      .eq('customer_id', customerId);

    const transcriptIds = (transcripts || []).map((t) => t.id);

    // Run the v3 engine
    const result = runDiagnosticV3(
      intake?.answers || {},
      computedSignals,
      transcriptAssessments,
      consultantAssessments,
      crmType
    );

    // Store result
    const { data: stored, error } = await supabaseAdmin
      .from('diagnostic_results_v3')
      .upsert(
        {
          customer_id: customerId,
          version: 3,
          crm_type: crmType,
          score_card: result.score_card,
          pillar_scores: result.pillar_scores,
          department_scores: result.department_scores,
          overall_score: result.overall_score,
          roadmap: result.roadmap,
          intake_id: intake?.id || null,
          hubspot_metadata_id: crmType === 'hubspot' ? metadataId : null,
          salesforce_metadata_id: crmType === 'salesforce' ? metadataId : null,
          transcript_ids: transcriptIds,
          company_profile: result.company_profile,
          data_coverage: result.data_coverage,
          metadata: result.metadata,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'customer_id' }
      )
      .select('id')
      .single();

    if (error) {
      console.error('Error storing v3 diagnostic result:', error);
      return res.status(500).json({ error: 'Failed to store result' });
    }

    return res.status(200).json({
      success: true,
      data: { id: stored?.id, ...result },
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
      .single();

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
      .single();

    let computedSignals = {};
    const crmType = existing.crm_type || 'unknown';

    if (crmType === 'salesforce') {
      const { data: sf } = await supabaseAdmin
        .from('salesforce_metadata')
        .select('computed_signals')
        .eq('customer_id', customerId)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .single();
      computedSignals = sf?.computed_signals || {};
    } else {
      const { data: hs } = await supabaseAdmin
        .from('hubspot_metadata')
        .select('computed_signals')
        .eq('customer_id', customerId)
        .order('downloaded_at', { ascending: false })
        .limit(1)
        .single();
      computedSignals = hs?.computed_signals || {};
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
      crmType
    );

    // Update stored result
    const { error: updateError } = await supabaseAdmin
      .from('diagnostic_results_v3')
      .update({
        score_card: result.score_card,
        pillar_scores: result.pillar_scores,
        department_scores: result.department_scores,
        overall_score: result.overall_score,
        roadmap: result.roadmap,
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
