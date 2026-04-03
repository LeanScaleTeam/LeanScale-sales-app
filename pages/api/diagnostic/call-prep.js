/**
 * Call Prep Generator API
 * POST /api/diagnostic/call-prep
 *
 * Generates a discovery call prep sheet for a customer by reading
 * their CRM metadata and running the call-prep generator.
 */

import { supabaseAdmin } from '../../../lib/supabase';
import { generateCallPrep } from '../../../lib/diagnostic-engine/v3/call-prep-generator';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.body || {};

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    // Get customer's CRM type
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('crm_type')
      .eq('id', customerId)
      .single();

    const crmType = customer?.crm_type || 'salesforce';

    // Get latest metadata
    const { data: row } = await supabaseAdmin
      .from('salesforce_metadata')
      .select('*')
      .eq('customer_id', customerId)
      .order('fetched_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!row) {
      return res.status(404).json({ error: 'No CRM metadata found for this customer' });
    }

    // Remap to camelCase
    const metadata = {
      objects: row.objects,
      stages: row.stages,
      users: row.users,
      flows: row.flows,
      workflowRules: row.workflow_rules,
      validationRules: row.validation_rules,
      apexTriggers: row.apex_triggers,
      apexClasses: row.apex_classes,
      profiles: row.profiles,
      permissionSets: row.permission_sets,
      roles: row.roles,
      reports: row.reports,
      dashboards: row.dashboards,
      connectedApps: row.connected_apps,
      namedCredentials: row.named_credentials,
      recordTypes: row.record_types,
      campaigns: row.campaigns,
      installedPackages: row.installed_packages,
      territories: row.territories,
      forecastingTypes: row.forecasting_types,
      duplicateRules: row.duplicate_rules,
      reportSchedules: row.report_schedules,
      emailTemplates: row.email_templates,
      taskAggregates: row.task_aggregates,
      eventPatterns: row.event_patterns,
      contentVersions: row.content_versions,
      knowledgeArticles: row.knowledge_articles,
    };

    const enhancedData = row.enhanced_data || {};

    const data = generateCallPrep(metadata, enhancedData, crmType);

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Call prep generation error:', err);
    return res.status(500).json({ error: 'Failed to generate call prep sheet' });
  }
}
