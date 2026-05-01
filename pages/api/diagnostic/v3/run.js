/**
 * Diagnostic v3 Engine Run
 * POST /api/diagnostic/v3/run — Run full v3 diagnostic
 * PUT  /api/diagnostic/v3/run — Admin override of specific cell scores
 */

import { supabaseAdmin } from '../../../../lib/supabase';
import { runDiagnosticV3, recomputeV3 } from '../../../../lib/diagnostic-engine/v3';
import { mergeSignals } from '../../../../lib/diagnostic-engine/signal-merger';
import { vascoSnapshotToComputedSignals, mergeVascoSignals } from '../../../../lib/vasco/signals-adapter';

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
  const { customerId, preserveRoadmap } = req.body;

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

    // Detect CRM type
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('crm_type')
      .eq('id', customerId)
      .maybeSingle();

    const crmType = customer?.crm_type || 'unknown';
    let computedSignals = {};
    let sfMetadataId = null;
    let hsMetadataId = null;

    // Fetch CRM signals
    if (crmType === 'dual' || crmType === 'salesforce') {
      const { data: sfMetadata } = await supabaseAdmin
        .from('salesforce_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (sfMetadata) {
        sfMetadataId = sfMetadata.id;
        computedSignals = sfMetadata.computed_signals || {};
      }
    }

    if (crmType === 'dual' || crmType === 'hubspot') {
      const { data: hsMetadata } = await supabaseAdmin
        .from('hubspot_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('downloaded_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (hsMetadata) {
        hsMetadataId = hsMetadata.id;
        if (crmType === 'dual') {
          computedSignals = mergeSignals(computedSignals, hsMetadata.computed_signals || {});
        } else {
          computedSignals = hsMetadata.computed_signals || {};
        }
      }
    }

    // Vasco-only or Vasco-augmented mode: inject signals derived from the latest
    // completed snapshot into computedSignals. When crm_type='vasco' this is the
    // sole source; when CRM is also connected, CRM signals win on schema-level
    // metrics and Vasco fills gaps (mostly tool presence + matrix-derived counts).
    if (crmType === 'vasco' || crmType === 'salesforce' || crmType === 'hubspot' || crmType === 'dual') {
      const { data: vascoSnapshot } = await supabaseAdmin
        .from('vasco_snapshots')
        .select('id, snapshot_date, integrity_score, gtm_stages, volume_metrics, time_in_stage, context_graph, matrix_statuses, tech_stack')
        .eq('customer_id', customerId)
        .eq('sync_status', 'complete')
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (vascoSnapshot) {
        const vascoSignals = vascoSnapshotToComputedSignals(vascoSnapshot);
        if (crmType === 'vasco') {
          // Vasco is the sole signal source
          computedSignals = vascoSignals;
        } else {
          // CRM-primary: merge Vasco signals into the gaps
          computedSignals = mergeVascoSignals(computedSignals, vascoSignals);
        }
      } else if (crmType === 'vasco') {
        // Vasco-only customer with no completed snapshot yet — proceed with empty
        // signals; consultant_assessments and transcripts will fill scoring.
        computedSignals = { _vasco_only: true, _no_snapshot: true };
      }
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
    // Vasco-derived rows are tagged with assessed_by='vasco-auto' — surface this
    // in the engine's signal trail by prefixing the notes so the UI can show
    // "Auto-scored from Vasco" instead of treating it as a manual override.
    const { data: consultantRows } = await supabaseAdmin
      .from('consultant_assessments')
      .select('competency_id, department, score, notes, assessed_by')
      .eq('customer_id', customerId);

    const consultantAssessments = {};
    if (consultantRows) {
      for (const row of consultantRows) {
        const key = `${row.competency_id}_${row.department}`;
        const isVasco = row.assessed_by === 'vasco-auto';
        consultantAssessments[key] = {
          score: row.score,
          notes: isVasco
            ? `[From Vasco] ${row.notes || `Score: ${row.score}`}`
            : row.notes,
          assessed_by: row.assessed_by || null,
        };
      }
    }

    // Fetch transcript IDs
    const { data: transcripts } = await supabaseAdmin
      .from('diagnostic_transcripts')
      .select('id')
      .eq('customer_id', customerId);

    const transcriptIds = (transcripts || []).map((t) => t.id);

    // Fetch transcript project signals
    const { data: signalRows } = await supabaseAdmin
      .from('transcript_project_signals')
      .select('service_id, signal_type, confidence, evidence, reasoning')
      .eq('customer_id', customerId);

    // Deduplicate: keep highest confidence per service_id
    const signalMap = {};
    for (const row of signalRows || []) {
      if (!signalMap[row.service_id] || row.confidence > signalMap[row.service_id].confidence) {
        signalMap[row.service_id] = row;
      }
    }
    const projectSignals = Object.values(signalMap);

    // Run the v3 engine
    // 'dual' collapses to 'salesforce' (engine treats them the same); 'vasco' also
    // maps to 'salesforce' since signals are now CRM-shaped — the engine doesn't
    // need to know they came from Vasco.
    const effectiveCrmType = (crmType === 'dual' || crmType === 'vasco') ? 'salesforce' : crmType;
    const result = runDiagnosticV3(
      intake?.answers || {},
      computedSignals,
      transcriptAssessments,
      consultantAssessments,
      effectiveCrmType,
      projectSignals
    );

    // Store result — when preserveRoadmap is set, only update scores (not roadmap)
    const upsertData = {
      customer_id: customerId,
      version: 3,
      crm_type: crmType,
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
    // Only include dual-specific columns if relevant (avoids failure if migration not yet applied)
    if (hsMetadataId) upsertData.hubspot_metadata_id = hsMetadataId;
    if (sfMetadataId) upsertData.salesforce_metadata_id = sfMetadataId;
    if (crmType === 'dual') upsertData.merged_signals = computedSignals;

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

    let computedSignals = {};
    const crmType = existing.crm_type || 'unknown';

    if (crmType === 'dual' || crmType === 'salesforce') {
      const { data: sf } = await supabaseAdmin
        .from('salesforce_metadata')
        .select('computed_signals')
        .eq('customer_id', customerId)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (sf) {
        computedSignals = sf.computed_signals || {};
      }
    }

    if (crmType === 'dual' || crmType === 'hubspot') {
      const { data: hs } = await supabaseAdmin
        .from('hubspot_metadata')
        .select('computed_signals')
        .eq('customer_id', customerId)
        .order('downloaded_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (hs) {
        if (crmType === 'dual') {
          computedSignals = mergeSignals(computedSignals, hs.computed_signals || {});
        } else {
          computedSignals = hs.computed_signals || {};
        }
      }
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
    const effectiveType = crmType === 'dual' ? 'salesforce' : crmType;
    const result = runDiagnosticV3(
      intake?.answers || {},
      computedSignals,
      transcriptAssessments,
      consultantOverrides,
      effectiveType
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
