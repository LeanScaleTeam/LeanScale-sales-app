/**
 * Salesforce Metadata Downloader
 *
 * Downloads CRM metadata from Salesforce APIs (REST, SOQL, Tooling),
 * stores raw JSON in Supabase salesforce_metadata, and runs signal extraction.
 */

import { supabaseAdmin } from './supabase';
import { extractSalesforceSignals } from './diagnostic-engine/signal-extractor-sf';

const API_VERSION = 'v59.0';

/**
 * Download all Salesforce metadata and store in Supabase.
 * @param {string} customerId - Customer UUID
 * @param {string} orgId - Salesforce org ID
 * @param {string} instanceUrl - e.g. https://na1.salesforce.com
 * @param {string} accessToken - Valid access token
 * @returns {Promise<object>} Computed signals
 */
export async function downloadAndStoreMetadata(customerId, orgId, instanceUrl, accessToken) {
  const baseUrl = `${instanceUrl}/services/data/${API_VERSION}`;
  const headers = { Authorization: `Bearer ${accessToken}` };
  const fetchStatus = {};

  // Download all API families in parallel
  const [objects, stages, users, flows, workflowRules, validationRules,
    apexTriggers, apexClasses, profiles, permissionSets, roles,
    reports, dashboards, connectedApps, namedCredentials, recordTypes] =
    await Promise.all([
      downloadObjectDescribes(baseUrl, headers, fetchStatus),
      downloadStages(baseUrl, headers, fetchStatus),
      downloadUsers(baseUrl, headers, fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, DefinitionId, Status, ProcessType, Label FROM Flow WHERE Status = \'Active\'', 'flows', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, Name, TableEnumOrId FROM WorkflowRule WHERE Active = true', 'workflowRules', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, ValidationName, EntityDefinition.QualifiedApiName, Active FROM ValidationRule WHERE Active = true', 'validationRules', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, Name, Status, TableEnumOrId FROM ApexTrigger', 'apexTriggers', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, Name, LengthWithoutComments, NamespacePrefix FROM ApexClass WHERE NamespacePrefix = null', 'apexClasses', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, Name FROM Profile', 'profiles', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, Label, IsCustom FROM PermissionSet WHERE IsOwnedByProfile = false', 'permissionSets', fetchStatus),
      downloadSOQL(baseUrl, headers, 'SELECT Id, DeveloperName, ParentRoleId FROM UserRole', 'roles', fetchStatus),
      downloadSOQL(baseUrl, headers, 'SELECT Id, Name, FolderName FROM Report LIMIT 200', 'reports', fetchStatus),
      downloadSOQL(baseUrl, headers, 'SELECT Id, Title, FolderName FROM Dashboard LIMIT 200', 'dashboards', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, Name FROM ConnectedApplication', 'connectedApps', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, MasterLabel FROM NamedCredential', 'namedCredentials', fetchStatus),
      downloadSOQL(baseUrl, headers, 'SELECT SobjectType, COUNT(Id) cnt FROM RecordType GROUP BY SobjectType', 'recordTypes', fetchStatus),
    ]);

  // Extract computed signals
  const computedSignals = extractSalesforceSignals({
    objects, stages, users, flows, workflowRules, validationRules,
    apexTriggers, apexClasses, profiles, permissionSets, roles,
    reports, dashboards, connectedApps, namedCredentials, recordTypes,
  });

  // Store in Supabase
  const { error } = await supabaseAdmin.from('salesforce_metadata').upsert(
    {
      customer_id: customerId,
      org_id: orgId,
      source: 'api',
      objects, stages, users, flows, workflow_rules: workflowRules,
      validation_rules: validationRules, apex_triggers: apexTriggers,
      apex_classes: apexClasses, profiles, permission_sets: permissionSets,
      roles, reports, dashboards, connected_apps: connectedApps,
      named_credentials: namedCredentials, record_types: recordTypes,
      computed_signals: computedSignals,
      fetch_status: fetchStatus,
      fetched_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'customer_id,org_id' }
  );

  if (error) {
    console.error('Error storing Salesforce metadata:', error);
    throw new Error(`Failed to store metadata: ${error.message}`);
  }

  return computedSignals;
}

/**
 * Download object describes for standard CRM objects.
 */
async function downloadObjectDescribes(baseUrl, headers, fetchStatus) {
  const objectNames = ['Lead', 'Contact', 'Account', 'Opportunity', 'Case', 'Campaign'];
  try {
    const results = {};
    const responses = await Promise.all(
      objectNames.map((name) =>
        fetchJSON(`${baseUrl}/sobjects/${name}/describe`, headers)
      )
    );
    objectNames.forEach((name, i) => {
      results[name] = responses[i];
    });
    fetchStatus.objects = 'ok';
    return results;
  } catch (err) {
    fetchStatus.objects = `error:${err.message}`;
    return {};
  }
}

/**
 * Download OpportunityStage and LeadStatus.
 */
async function downloadStages(baseUrl, headers, fetchStatus) {
  try {
    const [oppStages, leadStatuses] = await Promise.all([
      fetchJSON(`${baseUrl}/query?q=${encodeURIComponent('SELECT MasterLabel, DefaultProbability, IsClosed, IsWon, SortOrder FROM OpportunityStage ORDER BY SortOrder')}`, headers),
      fetchJSON(`${baseUrl}/query?q=${encodeURIComponent('SELECT MasterLabel, SortOrder FROM LeadStatus ORDER BY SortOrder')}`, headers),
    ]);
    fetchStatus.stages = 'ok';
    return {
      opportunityStages: oppStages?.records || [],
      leadStatuses: leadStatuses?.records || [],
    };
  } catch (err) {
    fetchStatus.stages = `error:${err.message}`;
    return { opportunityStages: [], leadStatuses: [] };
  }
}

/**
 * Download active users.
 */
async function downloadUsers(baseUrl, headers, fetchStatus) {
  try {
    const result = await fetchJSON(
      `${baseUrl}/query?q=${encodeURIComponent('SELECT Id, Name, IsActive, Profile.Name, UserRole.Name FROM User WHERE IsActive = true')}`,
      headers
    );
    fetchStatus.users = 'ok';
    return result?.records || [];
  } catch (err) {
    fetchStatus.users = `error:${err.message}`;
    return [];
  }
}

/**
 * Run a Tooling API query.
 */
async function downloadTooling(baseUrl, headers, soql, key, fetchStatus) {
  try {
    const result = await fetchJSON(
      `${baseUrl}/tooling/query?q=${encodeURIComponent(soql)}`,
      headers
    );
    fetchStatus[key] = 'ok';
    return result?.records || [];
  } catch (err) {
    fetchStatus[key] = `error:${err.message}`;
    return [];
  }
}

/**
 * Run a standard SOQL query.
 */
async function downloadSOQL(baseUrl, headers, soql, key, fetchStatus) {
  try {
    const result = await fetchJSON(
      `${baseUrl}/query?q=${encodeURIComponent(soql)}`,
      headers
    );
    fetchStatus[key] = 'ok';
    return result?.records || [];
  } catch (err) {
    fetchStatus[key] = `error:${err.message}`;
    return [];
  }
}

/**
 * Fetch JSON with retry on 429/503.
 */
async function fetchJSON(url, headers, retries = 3) {
  try {
    const res = await fetch(url, { headers });

    if ((res.status === 429 || res.status === 503) && retries > 0) {
      const retryAfter = parseInt(res.headers.get('Retry-After') || '5', 10);
      await new Promise((r) => setTimeout(r, retryAfter * 1000));
      return fetchJSON(url, headers, retries - 1);
    }

    if (!res.ok) {
      console.warn(`Salesforce API ${res.status} for ${url}`);
      return null;
    }

    return res.json();
  } catch (err) {
    console.warn(`Salesforce API error for ${url}:`, err.message);
    return null;
  }
}
