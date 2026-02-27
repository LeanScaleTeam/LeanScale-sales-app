/**
 * Salesforce CLI JSON Metadata Upload
 * POST /api/salesforce/upload-json
 *
 * Accepts a full JSON payload of Salesforce metadata extracted via the CLI
 * (instead of a ZIP file). Processes both standard metadata and enhanced SOQL results.
 */

import { supabaseAdmin } from '../../../lib/supabase';
import { extractSalesforceSignals } from '../../../lib/diagnostic-engine/signal-extractor-sf';
import { inferEnhancedAnswers } from '../../../lib/diagnostic-engine/intake-inferrer-sf-enhanced';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerId, metadata, enhanced } = req.body || {};

    if (!customerId) {
      return res.status(400).json({ error: 'customerId is required' });
    }

    // Extract signals from standard metadata
    const computedSignals = extractSalesforceSignals(metadata);

    // Run enhanced inferrer on SOQL results
    const enhancedSignals = inferEnhancedAnswers(enhanced, metadata);

    // Store in Supabase
    const { error: dbError } = await supabaseAdmin.from('salesforce_metadata').upsert(
      {
        customer_id: customerId,
        org_id: 'cli',
        source: 'cli',
        objects: metadata?.objects,
        stages: metadata?.stages,
        users: metadata?.users,
        flows: metadata?.flows,
        workflow_rules: metadata?.workflowRules,
        validation_rules: metadata?.validationRules,
        apex_triggers: metadata?.apexTriggers,
        apex_classes: metadata?.apexClasses,
        profiles: metadata?.profiles,
        permission_sets: metadata?.permissionSets,
        roles: metadata?.roles,
        reports: metadata?.reports,
        dashboards: metadata?.dashboards,
        connected_apps: metadata?.connectedApps,
        named_credentials: metadata?.namedCredentials,
        record_types: metadata?.recordTypes,
        // v3 expansion columns
        campaigns: metadata?.campaigns,
        installed_packages: metadata?.installedPackages,
        territories: metadata?.territories,
        forecasting_types: metadata?.forecastingTypes,
        duplicate_rules: metadata?.duplicateRules,
        report_schedules: metadata?.reportSchedules,
        email_templates: metadata?.emailTemplates,
        task_aggregates: metadata?.taskAggregates,
        event_patterns: metadata?.eventPatterns,
        content_versions: metadata?.contentVersions,
        knowledge_articles: metadata?.knowledgeArticles,
        // Campaign member count (if provided)
        campaign_members_count: metadata?.campaignMembersCount || null,
        // Computed signals
        computed_signals: computedSignals,
        enhanced_signals: enhancedSignals,
        // Enhanced query data (gap analysis additions)
        enhanced_data: enhanced || null,
        fetch_status: { source: 'cli' },
        fetched_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'customer_id,org_id' }
    );

    if (dbError) {
      console.error('Error storing Salesforce CLI upload:', dbError);
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
      enhancedCount: Object.keys(enhancedSignals).length,
      preFillCount: Object.keys(enhancedSignals).length,
    });
  } catch (err) {
    console.error('Salesforce CLI upload error:', err);
    return res.status(500).json({ error: err.message || 'Upload processing failed' });
  }
}
