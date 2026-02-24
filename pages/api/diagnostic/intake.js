/**
 * Diagnostic Intake API
 * POST /api/diagnostic/intake
 *
 * Saves/updates intake form answers to diagnostic_intake table.
 * Supports per-section saves so clients can resume after OAuth redirect.
 */

import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId, section, answers, submitted } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'answers object is required' });
  }

  try {
    // Get existing intake (if any)
    const { data: existing } = await supabaseAdmin
      .from('diagnostic_intake')
      .select('id, answers, sections_completed')
      .eq('customer_id', customerId)
      .single();

    // Merge new answers with existing
    const mergedAnswers = existing ? { ...existing.answers, ...answers } : { ...answers };

    // Track completed sections
    let sectionsCompleted = existing?.sections_completed || [];
    if (section && !sectionsCompleted.includes(section)) {
      sectionsCompleted = [...sectionsCompleted, section];
    }

    // Upsert
    const { data, error } = await supabaseAdmin.from('diagnostic_intake').upsert(
      {
        customer_id: customerId,
        answers: mergedAnswers,
        sections_completed: sectionsCompleted,
        submitted_at: submitted ? new Date().toISOString() : existing?.submitted_at || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'customer_id' }
    );

    if (error) {
      console.error('Intake save error:', error);
      return res.status(500).json({ error: 'Failed to save intake' });
    }

    return res.status(200).json({
      success: true,
      sectionsCompleted,
      answerCount: Object.keys(mergedAnswers).length,
    });
  } catch (err) {
    console.error('Intake API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
