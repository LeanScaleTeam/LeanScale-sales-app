/**
 * Transcript Management API
 *
 * POST /api/diagnostic/transcript — Upload transcript text
 * POST /api/diagnostic/transcript?action=prepare-analyze — Get prompt config for client-side competency analysis
 * POST /api/diagnostic/transcript?action=prepare-intake — Get prompt config for client-side intake extraction
 * POST /api/diagnostic/transcript?action=prepare-project-signals — Get prompt config for client-side project signal extraction
 * POST /api/diagnostic/transcript?action=store-analyze — Store competency analysis results from client
 * POST /api/diagnostic/transcript?action=store-intake — Validate + return intake extraction results from client
 * POST /api/diagnostic/transcript?action=store-project-signals — Validate + store project signal results from client
 * POST /api/diagnostic/transcript?action=analyze — (Legacy) Run server-side Claude analysis
 * POST /api/diagnostic/transcript?action=extract-intake — (Legacy) Run server-side intake extraction
 * GET  /api/diagnostic/transcript?customerId=... — List transcripts for customer
 */

import { supabaseAdmin } from '../../../lib/supabase';
import { analyzeTranscript, buildAnalyzePromptConfig, parseExtractionResponse } from '../../../lib/diagnostic-engine/v3/transcript-analyzer';
import { extractIntakeFromTranscript, buildIntakePromptConfig, parseIntakeResponse } from '../../../lib/diagnostic-engine/v3/transcript-intake-extractor';
import { buildProjectSignalPromptConfig, parseProjectSignalResponse } from '../../../lib/diagnostic-engine/v3/transcript-project-extractor';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Transcripts can be large
    },
  },
};

function isAdminRequest(req) {
  const cookies = req.cookies || {};
  return Object.keys(cookies).some(
    key => key.startsWith('sb-') && key.endsWith('-auth-token')
  ) || !!(cookies['admin-session']);
}

export default async function handler(req, res) {
  if (req.method === 'GET') return handleList(req, res);
  if (req.method === 'POST') {
    if (req.query.action === 'prepare-analyze') return handlePrepareAnalyze(req, res);
    if (req.query.action === 'prepare-intake') return handlePrepareIntake(req, res);
    if (req.query.action === 'prepare-project-signals') return handlePrepareProjectSignals(req, res);
    if (req.query.action === 'store-analyze') return handleStoreAnalyze(req, res);
    if (req.query.action === 'store-intake') return handleStoreIntake(req, res);
    if (req.query.action === 'store-project-signals') return handleStoreProjectSignals(req, res);
    if (req.query.action === 'analyze') return handleAnalyze(req, res);
    if (req.query.action === 'extract-intake') return handleExtractIntake(req, res);
    return handleUpload(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Upload a transcript.
 * Body: { customerId, text, source?, uploadedBy? }
 */
async function handleUpload(req, res) {
  const { customerId, text, source = 'upload', uploadedBy, fileName } = req.body;

  if (!customerId || !text) {
    return res.status(400).json({ error: 'customerId and text are required' });
  }

  // Postgres TEXT columns reject NUL bytes and other malformed Unicode
  // (error 22P05 "unsupported Unicode escape sequence"). PDF parsing via
  // pdf.js occasionally emits NULs, other C0 control chars, and lone UTF-16
  // surrogates. Strip them before insert; they have no legitimate meaning
  // in transcript content. Preserved: \t \n \r.
  const sanitizedText = String(text)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/[\uD800-\uDFFF]/g, '');

  try {
    const { data, error } = await supabaseAdmin
      .from('diagnostic_transcripts')
      .insert({
        customer_id: customerId,
        source,
        raw_text: sanitizedText,
        // Original document name when the user dropped/selected a file. Pasted
        // text leaves this null — the UI falls back to a generic label.
        file_name: typeof fileName === 'string' && fileName.trim() ? fileName.trim().slice(0, 255) : null,
        uploaded_by: uploadedBy || 'unknown',
        uploaded_at: new Date().toISOString(),
      })
      .select('id, uploaded_at')
      .maybeSingle();

    if (error) {
      console.error('Error storing transcript:', error);
      // Surface the underlying Supabase error so problems like payload size,
      // constraint violations, or RLS issues are visible to the client.
      return res.status(500).json({
        error: 'Failed to store transcript',
        detail: error.message || String(error),
        code: error.code || null,
      });
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
      .maybeSingle();

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
      model_version: model || 'anthropic/claude-sonnet-4',
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
 * Extract intake form answers from a transcript.
 * Body: { transcriptId, customerId }
 */
async function handleExtractIntake(req, res) {
  const { transcriptId, customerId } = req.body;

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
      .maybeSingle();

    if (fetchError || !transcript) {
      return res.status(404).json({ error: 'Transcript not found' });
    }

    // Run intake extraction
    const preFill = await extractIntakeFromTranscript(transcript.raw_text);

    return res.status(200).json({
      success: true,
      data: {
        transcriptId,
        preFill,
        extractedCount: Object.keys(preFill).length,
      },
    });
  } catch (err) {
    console.error('Transcript intake extraction error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

// ── Client-side LLM pattern (avoids Netlify function timeout) ──

/**
 * Return prompt config + API key for client-side competency analysis.
 * Body: { transcriptId, customerId }
 */
async function handlePrepareAnalyze(req, res) {
  const { transcriptId, customerId } = req.body;
  if (!transcriptId || !customerId) {
    return res.status(400).json({ error: 'transcriptId and customerId are required' });
  }

  try {
    const { data: transcript, error } = await supabaseAdmin
      .from('diagnostic_transcripts')
      .select('id, raw_text')
      .eq('id', transcriptId)
      .eq('customer_id', customerId)
      .maybeSingle();

    if (error || !transcript) {
      return res.status(404).json({ error: 'Transcript not found' });
    }

    const config = buildAnalyzePromptConfig(transcript.raw_text);

    return res.status(200).json({
      success: true,
      data: {
        apiKey: process.env.OPENROUTER_API_KEY,
        config,
      },
    });
  } catch (err) {
    console.error('Prepare analyze error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Return prompt config + API key for client-side intake extraction.
 * Body: { transcriptId, customerId }
 */
async function handlePrepareIntake(req, res) {
  const { transcriptId, customerId } = req.body;
  if (!transcriptId || !customerId) {
    return res.status(400).json({ error: 'transcriptId and customerId are required' });
  }

  try {
    const { data: transcript, error } = await supabaseAdmin
      .from('diagnostic_transcripts')
      .select('id, raw_text')
      .eq('id', transcriptId)
      .eq('customer_id', customerId)
      .maybeSingle();

    if (error || !transcript) {
      return res.status(404).json({ error: 'Transcript not found' });
    }

    const config = buildIntakePromptConfig(transcript.raw_text);

    return res.status(200).json({
      success: true,
      data: {
        apiKey: process.env.OPENROUTER_API_KEY,
        config,
      },
    });
  } catch (err) {
    console.error('Prepare intake error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Validate and store competency analysis results from client-side OpenRouter call.
 * Body: { transcriptId, customerId, openRouterResponse }
 */
async function handleStoreAnalyze(req, res) {
  const { transcriptId, customerId, openRouterResponse } = req.body;
  if (!transcriptId || !customerId || !openRouterResponse) {
    return res.status(400).json({ error: 'transcriptId, customerId, and openRouterResponse are required' });
  }

  try {
    // Validate the LLM response using the same parser as server-side analysis
    const assessments = parseExtractionResponse(openRouterResponse);

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
      model_version: 'anthropic/claude-sonnet-4',
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
    console.error('Store analyze error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

/**
 * Validate and return intake extraction results from client-side OpenRouter call.
 * Body: { transcriptId, customerId, openRouterResponse }
 */
async function handleStoreIntake(req, res) {
  const { transcriptId, customerId, openRouterResponse } = req.body;
  if (!transcriptId || !customerId || !openRouterResponse) {
    return res.status(400).json({ error: 'transcriptId, customerId, and openRouterResponse are required' });
  }

  try {
    // Validate the LLM response using the same parser as server-side extraction
    const preFill = parseIntakeResponse(openRouterResponse);

    return res.status(200).json({
      success: true,
      data: {
        transcriptId,
        preFill,
        extractedCount: Object.keys(preFill).length,
      },
    });
  } catch (err) {
    console.error('Store intake error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

/**
 * Return prompt config + API key for client-side project signal extraction.
 * Body: { transcriptId, customerId }
 */
async function handlePrepareProjectSignals(req, res) {
  const { transcriptId, customerId } = req.body;
  if (!transcriptId || !customerId) {
    return res.status(400).json({ error: 'transcriptId and customerId are required' });
  }

  try {
    const { data: transcript, error } = await supabaseAdmin
      .from('diagnostic_transcripts')
      .select('id, raw_text')
      .eq('id', transcriptId)
      .eq('customer_id', customerId)
      .maybeSingle();

    if (error || !transcript) {
      return res.status(404).json({ error: 'Transcript not found' });
    }

    const config = buildProjectSignalPromptConfig(transcript.raw_text);

    return res.status(200).json({
      success: true,
      data: {
        apiKey: process.env.OPENROUTER_API_KEY,
        config,
      },
    });
  } catch (err) {
    console.error('Prepare project signals error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Validate and store project signal results from client-side OpenRouter call.
 * Body: { transcriptId, customerId, openRouterResponse }
 */
async function handleStoreProjectSignals(req, res) {
  const { transcriptId, customerId, openRouterResponse } = req.body;
  if (!transcriptId || !customerId || !openRouterResponse) {
    return res.status(400).json({ error: 'transcriptId, customerId, and openRouterResponse are required' });
  }

  try {
    const signals = parseProjectSignalResponse(openRouterResponse);

    if (signals.length > 0) {
      // Delete existing signals for this transcript to avoid duplicates on re-analysis
      await supabaseAdmin
        .from('transcript_project_signals')
        .delete()
        .eq('transcript_id', transcriptId)
        .eq('customer_id', customerId);

      const rows = signals.map((s) => ({
        customer_id: customerId,
        transcript_id: transcriptId,
        service_id: s.service_id,
        signal_type: s.signal_type,
        confidence: s.confidence,
        evidence: s.evidence,
        reasoning: s.reasoning,
        model_version: 'anthropic/claude-sonnet-4',
        created_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabaseAdmin
        .from('transcript_project_signals')
        .insert(rows);

      if (insertError) {
        console.error('Error storing project signals:', insertError);
        return res.status(500).json({ error: 'Failed to store project signals' });
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        transcriptId,
        signalCount: signals.length,
        signals,
      },
    });
  } catch (err) {
    console.error('Store project signals error:', err);
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
      .select('id, source, file_name, uploaded_by, uploaded_at, duration_seconds')
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
