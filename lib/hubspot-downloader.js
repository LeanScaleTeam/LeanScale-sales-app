/**
 * HubSpot Metadata Downloader
 *
 * Downloads CRM metadata from HubSpot API endpoints, stores raw JSON
 * in Supabase hubspot_metadata, and runs signal extraction for the
 * diagnostic engine.
 *
 * Reference: Diagnostic-Repo/HubSpot Metadata Downloader/download_hubspot_metadata.py
 */

import { supabaseAdmin } from './supabase';
import { extractSignals } from './diagnostic-engine/signal-extractor';

const API_BASE = 'https://api.hubapi.com';

/**
 * Download all HubSpot metadata for a portal and store in Supabase.
 * @param {string} customerId - Customer UUID
 * @param {number} portalId - HubSpot portal ID
 * @param {string} accessToken - Valid access token
 * @returns {Promise<object>} Computed signals
 */
export async function downloadAndStoreMetadata(customerId, portalId, accessToken) {
  const headers = { Authorization: `Bearer ${accessToken}` };

  // Download all endpoints in parallel
  const [properties, pipelines, workflows, forms, lists, owners, marketingEmails, sequences] =
    await Promise.all([
      downloadProperties(headers),
      downloadPipelines(headers),
      downloadWorkflows(headers),
      fetchJSON(`${API_BASE}/marketing/v3/forms`, headers),
      fetchJSON(`${API_BASE}/contacts/v1/lists?count=250`, headers),
      fetchJSON(`${API_BASE}/crm/v3/owners`, headers),
      fetchJSON(`${API_BASE}/marketing/v3/emails?limit=100`, headers),
      fetchJSON(`${API_BASE}/automation/v4/actions/sequences`, headers),
    ]);

  // Extract computed signals from raw metadata
  const computedSignals = extractSignals({
    properties,
    pipelines,
    workflows: workflows?.results || workflows,
    forms,
    lists,
    owners,
    marketing_emails: marketingEmails,
    sequences,
  });

  // Store in Supabase (upsert on customer_id + portal_id)
  const { error } = await supabaseAdmin.from('hubspot_metadata').upsert(
    {
      customer_id: customerId,
      portal_id: portalId,
      properties,
      pipelines,
      workflows,
      forms,
      lists,
      owners,
      marketing_emails: marketingEmails,
      sequences,
      computed_signals: computedSignals,
      downloaded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'customer_id,portal_id' }
  );

  if (error) {
    console.error('Error storing HubSpot metadata:', error);
    throw new Error(`Failed to store metadata: ${error.message}`);
  }

  return computedSignals;
}

/**
 * Download properties for all standard object types.
 */
async function downloadProperties(headers) {
  const types = ['contacts', 'companies', 'deals', 'tickets', 'products', 'line_items'];
  const results = {};

  // Download in parallel
  const responses = await Promise.all(
    types.map((type) => fetchJSON(`${API_BASE}/crm/v3/properties/${type}`, headers))
  );

  types.forEach((type, i) => {
    results[type] = responses[i];
  });

  return results;
}

/**
 * Download deal and ticket pipelines.
 */
async function downloadPipelines(headers) {
  const [deals, tickets] = await Promise.all([
    fetchJSON(`${API_BASE}/crm/v3/pipelines/deals`, headers),
    fetchJSON(`${API_BASE}/crm/v3/pipelines/tickets`, headers),
  ]);

  return {
    deals: deals?.results || [],
    tickets: tickets?.results || [],
  };
}

/**
 * Download workflow/automation data.
 */
async function downloadWorkflows(headers) {
  return fetchJSON(`${API_BASE}/automation/v4/flows`, headers);
}

/**
 * Fetch JSON from a URL with automatic 429 retry handling.
 * @param {string} url - API endpoint URL
 * @param {object} headers - Request headers
 * @param {number} retries - Max retries remaining
 * @returns {Promise<object|null>}
 */
async function fetchJSON(url, headers, retries = 3) {
  try {
    const res = await fetch(url, { headers });

    if (res.status === 429 && retries > 0) {
      const retryAfter = parseInt(res.headers.get('Retry-After') || '10', 10);
      await new Promise((r) => setTimeout(r, retryAfter * 1000));
      return fetchJSON(url, headers, retries - 1);
    }

    if (!res.ok) {
      console.warn(`HubSpot API ${res.status} for ${url}`);
      return null;
    }

    return res.json();
  } catch (err) {
    console.warn(`HubSpot API error for ${url}:`, err.message);
    return null;
  }
}
