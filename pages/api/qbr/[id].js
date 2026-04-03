/**
 * /api/qbr/[id] — Get, update, or delete a single QBR record
 */

import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id required' });

  switch (req.method) {
    case 'GET':    return handleGet(req, res, id);
    case 'PUT':    return handlePut(req, res, id);
    case 'DELETE': return handleDelete(req, res, id);
    default:       return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req, res, id) {
  const { data, error } = await supabaseAdmin
    .from('customer_qbrs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: 'QBR not found' });
  return res.status(200).json({ qbr: data });
}

async function handlePut(req, res, id) {
  // Map camelCase body keys to snake_case columns
  const body = req.body;
  const updates = {};

  const fieldMap = {
    quarterLabel:             'quarter_label',
    periodStart:              'period_start',
    periodEnd:                'period_end',
    status:                   'status',
    isBaseline:               'is_baseline',
    executiveSummary:         'executive_summary',
    architectNotes:           'architect_notes',
    wins:                     'wins',
    power10Snapshot:          'power10_snapshot',
    scoresSnapshot:           'scores_snapshot',
    projectsCompleted:        'projects_completed',
    projectsInProgress:       'projects_in_progress',
    nextQuarterFocus:         'next_quarter_focus',
    accomplishmentsMarkdown:  'accomplishments_markdown',
    hoursUsed:                'hours_used',
    hoursBudgeted:            'hours_budgeted',
  };

  for (const [camel, snake] of Object.entries(fieldMap)) {
    if (body[camel] !== undefined) updates[snake] = body[camel];
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  const { data, error } = await supabaseAdmin
    .from('customer_qbrs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ qbr: data });
}

async function handleDelete(req, res, id) {
  const { error } = await supabaseAdmin
    .from('customer_qbrs')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true });
}
