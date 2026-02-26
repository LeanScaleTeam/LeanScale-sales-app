/**
 * Transcript Management API
 *
 * POST /api/diagnostic/transcript — Upload transcript text
 * POST /api/diagnostic/transcript?action=analyze — Run Claude analysis on transcript
 * GET  /api/diagnostic/transcript?customerId=... — List transcripts for customer
 */

import { supabaseAdmin } from '../../../lib/supabase';
import { analyzeTranscript, mergeTranscriptAssessments } from '../../../lib/diagnostic-engine/v3/transcript-analyzer';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Transcripts can be large
    },
  },
};

export default async function handler(req, res) {
  if (req.method === 'GET') return handleList(req, res);
  if (req.method === 'POST') {
    if (req.query.action === 'analyze') return handleAnalyze(req, res);
    return handleUpload(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Upload a transcript.
 * Body: { customerId, text, source?, uploadedBy? }
 */
async function handleUpload(req, res) {
  const { customerId, text, source = 'upload', uploadedBy } = req.body;

  if (!customerId || !text) {
    return res.status(400).json({ error: 'customerId and text are required' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('diagnostic_transcripts')
      .insert({
        customer_id: customerId,
        source,
        raw_text: text,
        uploaded_by: uploadedBy || 'unknown',
        uploaded_at: new Date().toISOString(),
      })
      .select('id, uploaded_at')
      .single();

    if (error) {
      console.error('Error storing transcript:', error);
      return res.status(500).json({ error: 'Failed to store transcript' });
    }

    return res.status(201).json({
      success: true,
      data: { id: data.id, uploadedAt: data.uploaded_at },
    });
  } catch (err) {
    console.error('Transcript upload error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Analyze a transcript with Claude.
 * Body: { transcriptId, customerId, model? }
 */
async function handleAnalyze(req, res) {
  const { transcriptId, customerId, model } = req.body;

  if (!transcriptId || !customerId) {
    return res.status(400).json({ error: 'transcriptId and customerId are required' });
  }

  try {
    // Fetch transcript text
    const { data: transcript, error: fetchError } = await supabaseAdmin
      .from('diagnostic_transcripts')
      .select('id, raw_text')
      .eq('id', transcriptId)
      .eq('customer_id', customerId)
      .single();

    if (fetchError || !transcript) {
      return res.status(404).json({ error: 'Transcript not found' });
    }

    // Run Claude analysis
    const assessments = await analyzeTranscript(transcript.raw_text, { model });

    // Store assessments
    const rows = assessments.map((a) => ({
      transcript_id: transcriptId,
      customer_id: customerId,
      competency_id: a.competency_id,
      department: a.department,
      score: a.score,
      confidence: a.confidence,
      evidence_quotes: a.evidence_quotes,
      assessment: a.assessment,
      reasoning: a.reasoning,
      model_version: model || 'claude-sonnet-4-6',
      analyzed_at: new Date().toISOString(),
    }));

    if (rows.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from('transcript_assessments')
        .insert(rows);

      if (insertError) {
        console.error('Error storing transcript assessments:', insertError);
        return res.status(500).json({ error: 'Failed to store assessments' });
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        transcriptId,
        assessmentCount: assessments.length,
        assessments,
        lowConfidenceCount: assessments.filter((a) => a.confidence < 0.5).length,
      },
    });
  } catch (err) {
    console.error('Transcript analysis error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

/**
 * List transcripts for a customer.
 */
async function handleList(req, res) {
  const { customerId } = req.query;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    const { data: transcripts, error } = await supabaseAdmin
      .from('diagnostic_transcripts')
      .select('id, source, uploaded_by, uploaded_at, duration_seconds')
      .eq('customer_id', customerId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error listing transcripts:', error);
      return res.status(500).json({ error: 'Failed to list transcripts' });
    }

    // Get assessment counts per transcript
    const transcriptIds = (transcripts || []).map((t) => t.id);
    let assessmentCounts = {};

    if (transcriptIds.length > 0) {
      const { data: counts } = await supabaseAdmin
        .from('transcript_assessments')
        .select('transcript_id')
        .in('transcript_id', transcriptIds);

      for (const row of counts || []) {
        assessmentCounts[row.transcript_id] = (assessmentCounts[row.transcript_id] || 0) + 1;
      }
    }

    const result = (transcripts || []).map((t) => ({
      ...t,
      assessmentCount: assessmentCounts[t.id] || 0,
      analyzed: (assessmentCounts[t.id] || 0) > 0,
    }));

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('Transcript list error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
