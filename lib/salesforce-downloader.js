/**
 * Salesforce Metadata Downloader
 *
 * Downloads CRM metadata from Salesforce APIs (REST, SOQL, Tooling),
 * stores raw JSON in Supabase salesforce_metadata, and runs signal extraction.
 */

import { supabaseAdmin } from './supabase';
import { extractSalesforceSignals } from './diagnostic-engine/signal-extractor-sf';
import { extractSignalsV3Salesforce } from './diagnostic-engine/v3/signal-extractor-v3';

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

  // Download all API families in parallel (core + v3 expansion)
  const [objects, stages, users, flows, workflowRules, validationRules,
    apexTriggers, apexClasses, profiles, permissionSets, roles,
    reports, dashboards, connectedApps, namedCredentials, recordTypes,
    // v3 Phase 2: New SOQL queries
    campaigns, installedPackages, territories, forecastingTypes,
    duplicateRules, reportSchedules, emailTemplates,
    // v3 Phase 3: Activity & content queries
    taskAggregates, eventPatterns, contentVersions, knowledgeArticles,
    campaignMembersCount] =
    await Promise.all([
      // ── Core queries (existing) ──
      downloadObjectDescribes(baseUrl, headers, fetchStatus),
      downloadStages(baseUrl, headers, fetchStatus),
      downloadUsers(baseUrl, headers, fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, DefinitionId, Status, ProcessType, MasterLabel FROM Flow WHERE Status = \'Active\'', 'flows', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, Name, TableEnumOrId FROM WorkflowRule', 'workflowRules', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, ValidationName, EntityDefinition.QualifiedApiName, Active FROM ValidationRule WHERE Active = true', 'validationRules', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, Name, Status, TableEnumOrId FROM ApexTrigger', 'apexTriggers', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, Name, LengthWithoutComments, NamespacePrefix FROM ApexClass WHERE NamespacePrefix = null', 'apexClasses', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, Name FROM Profile', 'profiles', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, Label, IsCustom FROM PermissionSet WHERE IsOwnedByProfile = false', 'permissionSets', fetchStatus),
      downloadSOQL(baseUrl, headers, 'SELECT Id, Name, DeveloperName, ParentRoleId FROM UserRole', 'roles', fetchStatus),
      downloadSOQL(baseUrl, headers, 'SELECT Id, Name, FolderName FROM Report LIMIT 200', 'reports', fetchStatus),
      downloadSOQL(baseUrl, headers, 'SELECT Id, Title, FolderName FROM Dashboard LIMIT 200', 'dashboards', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, Name FROM ConnectedApplication', 'connectedApps', fetchStatus),
      downloadTooling(baseUrl, headers, 'SELECT Id, MasterLabel FROM NamedCredential', 'namedCredentials', fetchStatus),
      downloadSOQL(baseUrl, headers, 'SELECT Id, Name, DeveloperName, SobjectType, IsActive FROM RecordType WHERE IsActive = true', 'recordTypes', fetchStatus),

      // ── v3 Phase 2: New SOQL queries ──
      downloadSOQL(baseUrl, headers, 'SELECT Id, Name, Type, IsActive, NumberOfContacts, NumberOfOpportunities, NumberOfLeads FROM Campaign WHERE IsActive = true LIMIT 200', 'campaigns', fetchStatus),
      downloadToolingSafe(baseUrl, headers, 'SELECT Id, SubscriberPackage.Name, SubscriberPackageVersion.Name FROM InstalledSubscriberPackage', 'installedPackages', fetchStatus),
      downloadSOQLSafe(baseUrl, headers, 'SELECT Id, State FROM Territory2Model WHERE State = \'Active\'', 'territories', fetchStatus),
      downloadSOQLSafe(baseUrl, headers, 'SELECT Id, DeveloperName, IsActive FROM ForecastingType WHERE IsActive = true', 'forecastingTypes', fetchStatus),
      downloadToolingSafe(baseUrl, headers, 'SELECT Id, DeveloperName, SobjectType, IsActive FROM DuplicateRule WHERE IsActive = true', 'duplicateRules', fetchStatus),
      downloadSOQLSafe(baseUrl, headers, 'SELECT CronJobDetail.Name, CronExpression, State FROM CronTrigger WHERE CronJobDetail.JobType = \'8\' AND State = \'WAITING\' LIMIT 100', 'reportSchedules', fetchStatus),
      downloadSOQLSafe(baseUrl, headers, 'SELECT COUNT(Id) cnt FROM EmailTemplate WHERE IsActive = true', 'emailTemplates', fetchStatus),

      // ── v3 Phase 3: Activity & content queries ──
      downloadSOQLSafe(baseUrl, headers, 'SELECT COUNT(Id) total, Status FROM Task WHERE CreatedDate > LAST_N_DAYS:90 GROUP BY Status', 'taskAggregates', fetchStatus),
      downloadSOQLSafe(baseUrl, headers, 'SELECT Subject, IsRecurrence, RecurrenceType FROM Event WHERE IsRecurrence = true AND ActivityDate > LAST_N_DAYS:90 LIMIT 500', 'eventPatterns', fetchStatus),
      downloadSOQLSafe(baseUrl, headers, 'SELECT Title, FileType, CreatedDate FROM ContentVersion WHERE IsLatest = true ORDER BY CreatedDate DESC LIMIT 100', 'contentVersions', fetchStatus),
      downloadSOQLSafe(baseUrl, headers, 'SELECT Id, Title FROM KnowledgeArticleVersion WHERE PublishStatus = \'Online\' AND IsLatest = true LIMIT 100', 'knowledgeArticles', fetchStatus),
      downloadSOQLSafe(baseUrl, headers, 'SELECT COUNT(Id) cnt FROM CampaignMember', 'campaignMembersCount', fetchStatus),
    ]);

  // Process task aggregates into summary
  const taskAgg = processTaskAggregates(taskAggregates);

  // Process campaign member count
  const campaignMemberCount = Array.isArray(campaignMembersCount) && campaignMembersCount[0]
    ? campaignMembersCount[0].cnt || 0
    : 0;

  // Build full metadata object for signal extraction
  const fullMetadata = {
    objects, stages, users, flows, workflowRules, validationRules,
    apexTriggers, apexClasses, profiles, permissionSets, roles,
    reports, dashboards, connectedApps, namedCredentials, recordTypes,
    // v3 expansion data
    campaigns, installedPackages, territories: territories || [],
    forecastingTypes: forecastingTypes || [], contentVersions: contentVersions || [],
    knowledgeArticles: knowledgeArticles || [], reportSchedules: reportSchedules || [],
    duplicateRules: duplicateRules || [], taskAggregates: taskAgg,
    eventPatterns: eventPatterns || [], emailTemplates: emailTemplates || [],
    campaignMemberCount,
  };

  // Extract v3 signals (superset of base signals — includes dashboard analysis,
  // installed package detection, activity patterns, content classification)
  const computedSignals = extractSignalsV3Salesforce(fullMetadata);

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
      // v3 expansion columns
      campaigns, installed_packages: installedPackages,
      territories, forecasting_types: forecastingTypes,
      duplicate_rules: duplicateRules, report_schedules: reportSchedules,
      email_templates: emailTemplates, task_aggregates: taskAgg,
      event_patterns: eventPatterns, content_versions: contentVersions,
      knowledge_articles: knowledgeArticles,
      campaign_members_count: { count: campaignMemberCount },
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
 * Run a standard SOQL query with graceful degradation.
 * Some queries (Territory2, ForecastingType, KnowledgeArticleVersion)
 * may fail if the feature isn't enabled in the org. Returns [] on error.
 */
async function downloadSOQLSafe(baseUrl, headers, soql, key, fetchStatus) {
  try {
    const result = await fetchJSON(
      `${baseUrl}/query?q=${encodeURIComponent(soql)}`,
      headers
    );
    if (!result) {
      fetchStatus[key] = 'not_available';
      return [];
    }
    fetchStatus[key] = 'ok';
    return result?.records || [];
  } catch (err) {
    fetchStatus[key] = `optional:${err.message}`;
    return [];
  }
}

/**
 * Run a Tooling API query with graceful degradation.
 * InstalledSubscriberPackage may require specific permissions.
 */
async function downloadToolingSafe(baseUrl, headers, soql, key, fetchStatus) {
  try {
    const result = await fetchJSON(
      `${baseUrl}/tooling/query?q=${encodeURIComponent(soql)}`,
      headers
    );
    if (!result) {
      fetchStatus[key] = 'not_available';
      return [];
    }
    fetchStatus[key] = 'ok';
    return result?.records || [];
  } catch (err) {
    fetchStatus[key] = `optional:${err.message}`;
    return [];
  }
}

/**
 * Process raw Task aggregate query results into a summary object.
 */
function processTaskAggregates(taskAggregates) {
  if (!Array.isArray(taskAggregates) || taskAggregates.length === 0) {
    return { total: 0, completionRate: 0, byStatus: {} };
  }

  let total = 0;
  let completed = 0;
  const byStatus = {};

  for (const row of taskAggregates) {
    const count = row.total || row.cnt || 0;
    const status = row.Status || 'Unknown';
    total += count;
    byStatus[status] = count;
    if (/completed|closed/i.test(status)) completed += count;
  }

  return {
    total,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    byStatus,
  };
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
