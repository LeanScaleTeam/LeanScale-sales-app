/**
 * Salesforce Metadata Upload
 * POST /api/salesforce/upload
 *
 * Accepts a multipart form upload of either:
 * 1. A Salesforce CLI metadata zip (from `sf project retrieve start`)
 * 2. A CLI extraction zip containing payload.json (metadata + enhanced SOQL)
 */

import { IncomingForm } from 'formidable';
import { readFileSync } from 'fs';
import JSZip from 'jszip';
import { supabaseAdmin } from '../../../lib/supabase';
import { parseMetadataZip } from '../../../lib/salesforce-metadata-parser';
import { extractSalesforceSignals } from '../../../lib/diagnostic-engine/signal-extractor-sf';
import { inferEnhancedAnswers } from '../../../lib/diagnostic-engine/intake-inferrer-sf-enhanced';

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

    const zipBuffer = readFileSync(file.filepath);

    // Check if zip contains a payload.json (CLI extraction format)
    let metadata;
    let enhanced = null;
    const zip = await JSZip.loadAsync(zipBuffer);
    const payloadEntry = zip.file('payload.json');

    if (payloadEntry) {
      // CLI extraction zip — parse JSON payload directly
      const payloadText = await payloadEntry.async('string');
      const payload = JSON.parse(payloadText);
      metadata = payload.metadata || {};
      enhanced = payload.enhanced || null;
    } else {
      // Standard Salesforce CLI metadata zip (XML files)
      metadata = await parseMetadataZip(zipBuffer);
    }

    // Extract signals
    const computedSignals = extractSalesforceSignals(metadata);

    // Run enhanced inferrer if SOQL data is available
    let enhancedSignals = {};
    if (enhanced) {
      enhancedSignals = inferEnhancedAnswers(enhanced, metadata);
    }


    // Store in Supabase — core columns first, then try with expansion columns
    const coreRow = {
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
    };

    // v3 expansion + enhanced columns (may not exist on older DBs)
    const expansionColumns = {
      campaigns: metadata.campaigns,
      installed_packages: metadata.installedPackages,
      territories: metadata.territories,
      forecasting_types: metadata.forecastingTypes,
      duplicate_rules: metadata.duplicateRules,
      report_schedules: metadata.reportSchedules,
      email_templates: metadata.emailTemplates,
      task_aggregates: metadata.taskAggregates,
      event_patterns: metadata.eventPatterns,
      content_versions: metadata.contentVersions,
      knowledge_articles: metadata.knowledgeArticles,
      ...(enhanced ? {
        enhanced_signals: enhancedSignals,
        enhanced_data: enhanced,
      } : {}),
    };

    // Try full upsert first (all columns)
    let { error: dbError } = await supabaseAdmin.from('salesforce_metadata').upsert(
      { ...coreRow, ...expansionColumns },
      { onConflict: 'customer_id,org_id' }
    );

    // If full upsert fails (missing columns), fall back to core-only
    if (dbError) {
      console.warn('Full upsert failed, trying core columns only:', dbError.message);
      const fallback = await supabaseAdmin.from('salesforce_metadata').upsert(
        coreRow,
        { onConflict: 'customer_id,org_id' }
      );
      dbError = fallback.error;
    }

    if (dbError) {
      console.error('Error storing Salesforce upload:', dbError);
      return res.status(500).json({ error: 'Failed to store metadata' });
    }

    // Update customer CRM type (check if HubSpot is also connected → dual)
    const { data: hsConn } = await supabaseAdmin
      .from('hubspot_connections')
      .select('id')
      .eq('customer_id', customerId)
      .single();

    const newCrmType = hsConn ? 'dual' : 'salesforce';
    await supabaseAdmin
      .from('customers')
      .update({ crm_type: newCrmType })
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
      enhancedCount: Object.keys(enhancedSignals).length,
      source: enhanced ? 'cli-extraction' : 'metadata-xml',
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
