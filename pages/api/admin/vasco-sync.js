/**
 * Admin API for triggering Vasco data sync via Claude Code RemoteTrigger.
 *
 * POST — kick off a Vasco sync for a customer
 *   body: { customerId, customerName }
 *
 * GET  — check the latest snapshot status for a customer
 *   query: ?customerId=<uuid>
 */

import { supabaseAdmin } from '../../../lib/supabase';

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

  switch (req.method) {
    case 'POST':
      return handleSync(req, res);
    case 'GET':
      return handleStatus(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleSync(req, res) {
  const { customerId, customerName } = req.body;

  if (!customerId || !customerName) {
    return res.status(400).json({ error: 'customerId and customerName are required' });
  }

  const triggerToken = process.env.CLAUDE_TRIGGER_API_TOKEN;
  const triggerId = process.env.CLAUDE_VASCO_TRIGGER_ID;

  if (!triggerToken || !triggerId) {
    return res.status(500).json({ error: 'Claude trigger not configured (missing CLAUDE_TRIGGER_API_TOKEN or CLAUDE_VASCO_TRIGGER_ID)' });
  }

  try {
    // Upsert a snapshot record with status=running for today
    const today = new Date().toISOString().split('T')[0];
    const { data: snapshot, error: upsertErr } = await supabaseAdmin
      .from('vasco_snapshots')
      .upsert(
        {
          customer_id: customerId,
          vasco_org_id: 'pending',
          snapshot_date: today,
          sync_status: 'running',
          sync_errors: null,
        },
        { onConflict: 'customer_id,snapshot_date' }
      )
      .select('id')
      .single();

    if (upsertErr) throw upsertErr;

    // Invoke the Claude Code RemoteTrigger
    const triggerRes = await fetch(
      `https://api.claude.ai/v1/code/triggers/${triggerId}/run`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${triggerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_id: customerId,
          snapshot_id: snapshot.id,
          snapshot_date: today,
        }),
      }
    );

    if (!triggerRes.ok) {
      const errBody = await triggerRes.text();
      // Mark snapshot as error
      await supabaseAdmin
        .from('vasco_snapshots')
        .update({ sync_status: 'error', sync_errors: { trigger_error: errBody } })
        .eq('id', snapshot.id);
      throw new Error(`Trigger API ${triggerRes.status}: ${errBody}`);
    }

    const triggerData = await triggerRes.json();

    return res.status(200).json({
      success: true,
      snapshotId: snapshot.id,
      triggerResponse: triggerData,
      message: `Vasco sync started for ${customerName}`,
    });
  } catch (err) {
    console.error('Vasco sync error:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function handleStatus(req, res) {
  const { customerId } = req.query;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId query param is required' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('vasco_snapshots')
      .select('id, snapshot_date, sync_status, sync_errors, integrity_score, gtm_stages, created_at, updated_at')
      .eq('customer_id', customerId)
      .order('snapshot_date', { ascending: false })
      .limit(5);

    if (error) throw error;

    return res.status(200).json({ snapshots: data || [] });
  } catch (err) {
    console.error('Vasco status error:', err);
    return res.status(500).json({ error: err.message });
  }
}
