/**
 * Salesforce Metadata Upload
 * POST /api/salesforce/upload
 *
 * Accepts a multipart form upload of a Salesforce CLI metadata zip.
 */

import { IncomingForm } from 'formidable';
import { readFileSync } from 'fs';
import { supabaseAdmin } from '../../../lib/supabase';
import { parseMetadataZip } from '../../../lib/salesforce-metadata-parser';
import { extractSalesforceSignals } from '../../../lib/diagnostic-engine/signal-extractor-sf';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);
    const customerId = fields.customerId?.[0] || fields.customerId;

    if (!customerId) {
      return res.status(400).json({ error: 'customerId is required' });
    }

    const file = files.file?.[0] || files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large. Maximum 50MB.' });
    }

    // Read and parse the zip
    const zipBuffer = readFileSync(file.filepath);
    const metadata = await parseMetadataZip(zipBuffer);

    // Extract signals
    const computedSignals = extractSalesforceSignals(metadata);

    // Store in Supabase
    const { error: dbError } = await supabaseAdmin.from('salesforce_metadata').upsert(
      {
        customer_id: customerId,
        org_id: 'upload',
        source: 'upload',
        objects: metadata.objects,
        stages: metadata.stages,
        users: metadata.users,
        flows: metadata.flows,
        workflow_rules: metadata.workflowRules,
        validation_rules: metadata.validationRules,
        apex_triggers: metadata.apexTriggers,
        apex_classes: metadata.apexClasses,
        profiles: metadata.profiles,
        permission_sets: metadata.permissionSets,
        roles: metadata.roles,
        reports: metadata.reports,
        dashboards: metadata.dashboards,
        connected_apps: metadata.connectedApps,
        named_credentials: metadata.namedCredentials,
        record_types: metadata.recordTypes,
        computed_signals: computedSignals,
        fetch_status: { source: 'upload' },
        fetched_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'customer_id,org_id' }
    );

    if (dbError) {
      console.error('Error storing Salesforce upload:', dbError);
      return res.status(500).json({ error: 'Failed to store metadata' });
    }

    // Update customer CRM type
    await supabaseAdmin
      .from('customers')
      .update({ crm_type: 'salesforce' })
      .eq('id', customerId);

    // Check if intake is awaiting CRM data — auto-run diagnostic
    const { data: intake } = await supabaseAdmin
      .from('diagnostic_intake')
      .select('id, status, answers')
      .eq('customer_id', customerId)
      .single();

    if (intake?.status === 'awaiting_crm_data') {
      const { runDiagnostic } = await import('../../../lib/diagnostic-engine');

      const result = runDiagnostic(intake.answers, computedSignals, 'salesforce');

      await supabaseAdmin.from('diagnostic_results').upsert(
        {
          customer_id: customerId,
          diagnostic_type: 'gtm',
          version: 2,
          crm_type: 'salesforce',
          items: result.items,
          scores: result.scores,
          company_profile: result.company_profile,
          metadata: result.metadata,
          intake_id: intake.id,
        },
        { onConflict: 'customer_id,diagnostic_type' }
      );

      await supabaseAdmin
        .from('diagnostic_intake')
        .update({ status: 'complete' })
        .eq('customer_id', customerId);
    }

    return res.status(200).json({
      success: true,
      signalCount: Object.keys(computedSignals).length,
    });
  } catch (err) {
    console.error('Salesforce upload error:', err);
    return res.status(500).json({ error: err.message || 'Upload processing failed' });
  }
}

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ maxFileSize: 50 * 1024 * 1024 });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}
