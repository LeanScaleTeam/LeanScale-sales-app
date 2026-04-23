/**
 * Vasco QBR Upload endpoint.
 *
 * Accepts a JSON snapshot file produced by the vasco-qbr-snapshot skill and
 * persists it to vasco_snapshots, optionally overwriting by (customer, quarter).
 *
 * POST /api/admin/vasco-upload
 *   body: { snapshot: <parsed JSON>, mode?: 'create' | 'overwrite' | 'prompt' }
 *
 * Response: { success, snapshotId, customer, action: 'created' | 'overwrote' | 'conflict' }
 */

import { supabaseAdmin } from '../../../lib/supabase';

const ALLOWED_STATUSES = new Set([
  'OK', 'Set', 'To Double Check', 'Needs Refinement', 'Needs Work',
  'Need', 'Not Set', 'Paused', 'Working', 'N/A',
]);

function verifyAuth(req) {
  const cookies = req.cookies || {};
  return Object.keys(cookies).some(
    key => key.startsWith('sb-') && key.endsWith('-auth-token')
  ) || !!(cookies['admin-session']);
}

const ALLOWED_SOURCES = new Set(['vasco', 'hubspot', 'salesforce', 'manual']);

function validateSnapshot(snapshot) {
  const errors = [];
  if (!snapshot || typeof snapshot !== 'object') return ['Snapshot must be a JSON object'];

  if (!snapshot.customer_slug) errors.push('customer_slug is required');
  if (!snapshot.snapshot_date) errors.push('snapshot_date is required (YYYY-MM-DD)');

  // Accept either `vasco` (legacy) or `crm` (hubspot/salesforce) as the data container
  const hasDataContainer = (snapshot.vasco && typeof snapshot.vasco === 'object') ||
                           (snapshot.crm && typeof snapshot.crm === 'object');
  if (!hasDataContainer) errors.push('A `vasco` or `crm` data object is required');

  if (snapshot.schema_version && snapshot.schema_version !== '1.0') {
    errors.push(`Unsupported schema_version: ${snapshot.schema_version}`);
  }

  // Validate source if provided
  if (snapshot.source && !ALLOWED_SOURCES.has(snapshot.source)) {
    errors.push(`Invalid source "${snapshot.source}" — must be one of: ${[...ALLOWED_SOURCES].join(', ')}`);
  }

  // Validate matrix statuses use allowed values
  if (snapshot.matrix_statuses) {
    const walk = (obj, path = '') => {
      for (const [k, v] of Object.entries(obj)) {
        if (v && typeof v === 'object' && 'status' in v) {
          if (!ALLOWED_STATUSES.has(v.status)) {
            errors.push(`Invalid status "${v.status}" at ${path}${k}`);
          }
        } else if (v && typeof v === 'object' && !Array.isArray(v)) {
          walk(v, `${path}${k}.`);
        }
      }
    };
    walk(snapshot.matrix_statuses);
  }

  return errors;
}

export default async function handler(req, res) {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }
  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // GET → recent uploads (for history panel)
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('vasco_snapshots')
      .select('id, snapshot_date, quarter, architect, source, uploaded_at, integrity_score, customer:customers(id, slug, name)')
      .order('uploaded_at', { ascending: false, nullsFirst: false })
      .limit(15);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ recent: data || [] });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { snapshot, mode = 'prompt', customerIdOverride, architectOverride } = req.body || {};

  // Validate
  const errors = validateSnapshot(snapshot);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  try {
    // 1. Resolve customer — by override id first, else by slug
    let customer = null;
    if (customerIdOverride) {
      const { data } = await supabaseAdmin
        .from('customers')
        .select('id, name, slug')
        .eq('id', customerIdOverride)
        .single();
      customer = data;
    } else {
      const { data } = await supabaseAdmin
        .from('customers')
        .select('id, name, slug')
        .eq('slug', snapshot.customer_slug)
        .maybeSingle();
      customer = data;
    }

    if (!customer) {
      // Fuzzy-match candidates so the UI can offer a picker
      const slugStem = (snapshot.customer_slug || '').replace(/-\d+$/, '').toLowerCase();
      const { data: candidates } = await supabaseAdmin
        .from('customers')
        .select('id, name, slug')
        .or(`slug.ilike.%${slugStem}%,name.ilike.%${slugStem}%`)
        .limit(10);
      return res.status(404).json({
        error: `No customer found with slug "${snapshot.customer_slug}"`,
        candidates: candidates || [],
      });
    }

    // Infer quarter from snapshot_date if missing (fiscal-year = calendar year assumption)
    let quarter = snapshot.quarter || null;
    if (!quarter && snapshot.snapshot_date) {
      const d = new Date(snapshot.snapshot_date);
      if (!isNaN(d)) {
        const q = Math.floor(d.getUTCMonth() / 3) + 1;
        quarter = `Q${q}-${d.getUTCFullYear()}`;
      }
    }
    const snapshotDate = snapshot.snapshot_date;
    // Accept either shape — CRM skills use `crm`, Vasco skill uses `vasco`
    const dataContainer = snapshot.vasco || snapshot.crm || {};
    const source = snapshot.source || 'vasco';
    // Normalize: "org_id" for Vasco, "portal_id"/"org_id" for CRMs, "org_alias" for SFDC
    const orgIdentifier = dataContainer.org_id ||
                          dataContainer.portal_id ||
                          dataContainer.org_alias ||
                          'unknown';

    // 2. Check for existing snapshot by (customer, snapshot_date)
    const { data: existing } = await supabaseAdmin
      .from('vasco_snapshots')
      .select('id, quarter, architect, uploaded_at, integrity_score, volume_metrics')
      .eq('customer_id', customer.id)
      .eq('snapshot_date', snapshotDate)
      .maybeSingle();

    if (existing && mode === 'prompt') {
      const newMonths = dataContainer.volume_metrics?.data?.length || 0;
      const existingMonths = existing.volume_metrics?.data?.length || 0;
      return res.status(409).json({
        error: 'Snapshot already exists for this customer and date',
        existing: {
          id: existing.id,
          quarter: existing.quarter,
          architect: existing.architect,
          uploaded_at: existing.uploaded_at,
          integrity_score: existing.integrity_score?.score ?? null,
          months: existingMonths,
        },
        incoming: {
          quarter,
          architect: architectOverride || snapshot.architect || null,
          integrity_score: dataContainer.integrity_score?.score ?? null,
          months: newMonths,
        },
        hint: 'Re-submit with mode: "overwrite" to replace',
      });
    }

    // 3. Build the row
    // gtm_stages — Vasco calls them "gtm_stages", CRMs call them "stages"
    const stages = dataContainer.gtm_stages || dataContainer.stages;
    const row = {
      customer_id: customer.id,
      vasco_org_id: orgIdentifier,
      source,
      snapshot_date: snapshotDate,
      sync_status: 'complete',
      sync_errors: null,
      integrity_score: dataContainer.integrity_score || null,
      integrity_issues: dataContainer.integrity_issues ? { issues: dataContainer.integrity_issues } : null,
      gtm_stages: stages ? { stages } : null,
      volume_metrics: dataContainer.volume_metrics || null,
      time_in_stage: dataContainer.time_in_stage || null,
      context_graph: dataContainer.context_graph || null,
      architect: architectOverride || snapshot.architect || null,
      quarter,
      matrix_statuses: snapshot.matrix_statuses || null,
      tech_stack: snapshot.tech_stack || null,
      claude_insights: snapshot.claude_insights || null,
      schema_version: snapshot.schema_version || '1.0',
      upload_source: `skill-${source}`,
      uploaded_by: snapshot.generator_account || null,
      uploaded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let action;
    let snapshotId;

    if (existing) {
      const { data: updated, error: updErr } = await supabaseAdmin
        .from('vasco_snapshots')
        .update(row)
        .eq('id', existing.id)
        .select('id')
        .single();
      if (updErr) throw updErr;
      snapshotId = updated.id;
      action = 'overwrote';
    } else {
      const { data: created, error: insErr } = await supabaseAdmin
        .from('vasco_snapshots')
        .insert(row)
        .select('id')
        .single();
      if (insErr) throw insErr;
      snapshotId = created.id;
      action = 'created';
    }

    // 4. Update customer vasco_org_id only for Vasco-sourced snapshots
    // (HubSpot/Salesforce identifiers live elsewhere — portal_id in hubspot_connections, org_id in salesforce_connections)
    if (source === 'vasco' && dataContainer.org_id && dataContainer.org_id !== 'unknown') {
      await supabaseAdmin
        .from('customers')
        .update({ vasco_org_id: dataContainer.org_id })
        .eq('id', customer.id);
    }

    return res.status(200).json({
      success: true,
      snapshotId,
      customer: { id: customer.id, slug: customer.slug, name: customer.name },
      quarter,
      architect: snapshot.architect,
      source,
      action,
    });
  } catch (err) {
    console.error('Vasco upload error:', err);
    return res.status(500).json({ error: err.message });
  }
}
