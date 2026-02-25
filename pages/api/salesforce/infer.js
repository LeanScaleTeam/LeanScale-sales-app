/**
 * Salesforce Intake Inference
 * POST /api/salesforce/infer
 *
 * Reads the most recent salesforce_metadata row for a customer,
 * remaps DB columns to camelCase, and runs the intake inferrer
 * to produce pre-filled intake answers.
 */

import { supabaseAdmin } from '../../../lib/supabase';
import { inferIntakeAnswers } from '../../../lib/diagnostic-engine/intake-inferrer-sf';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.body || {};

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    const { data: row } = await supabaseAdmin
      .from('salesforce_metadata')
      .select('*')
      .eq('customer_id', customerId)
      .order('fetched_at', { ascending: false })
      .limit(1)
      .single();

    if (!row) {
      return res.status(404).json({ error: 'No metadata found for this customer' });
    }

    // Remap snake_case DB columns to camelCase for the inferrer
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
    };

    const preFill = inferIntakeAnswers(metadata);

    return res.status(200).json({ success: true, preFill });
  } catch (err) {
    console.error('Salesforce infer error:', err);
    return res.status(500).json({ error: 'Failed to infer intake answers' });
  }
}
