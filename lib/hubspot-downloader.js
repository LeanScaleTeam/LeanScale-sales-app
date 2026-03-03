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
  const [properties, pipelines, workflows, forms, lists, owners, marketingEmails, sequences, dealAggregates, contactSources] =
    await Promise.all([
      downloadProperties(headers),
      downloadPipelines(headers),
      downloadWorkflows(headers),
      fetchJSON(`${API_BASE}/marketing/v3/forms`, headers),
      fetchJSON(`${API_BASE}/contacts/v1/lists?count=250`, headers),
      fetchJSON(`${API_BASE}/crm/v3/owners`, headers),
      fetchJSON(`${API_BASE}/marketing/v3/emails?limit=100`, headers),
      fetchJSON(`${API_BASE}/automation/v4/actions/sequences`, headers),
      downloadDealAggregates(headers),
      downloadContactSources(headers),
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
      deal_aggregates: dealAggregates,
      contact_sources: contactSources,
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
 * Download closed-won deal amounts for ARR estimation (A3).
 * Uses search API to find closed-won deals in current year, sums amounts.
 */
async function downloadDealAggregates(headers) {
  const currentYear = new Date().getFullYear();
  const yearStart = `${currentYear}-01-01T00:00:00.000Z`;

  try {
    let totalAmount = 0;
    let dealCount = 0;
    let after = undefined;

    // Page through up to 300 results (3 pages)
    for (let page = 0; page < 3; page++) {
      const body = {
        filterGroups: [{
          filters: [
            { propertyName: 'dealstage', operator: 'EQ', value: 'closedwon' },
            { propertyName: 'closedate', operator: 'GTE', value: yearStart },
          ],
        }],
        properties: ['amount', 'closedate'],
        limit: 100,
      };
      if (after) body.after = after;

      const res = await fetch(`${API_BASE}/crm/v3/objects/deals/search`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) break;
      const data = await res.json();
      const results = data.results || [];

      for (const deal of results) {
        const amount = parseFloat(deal.properties?.amount || 0);
        if (amount > 0) totalAmount += amount;
        dealCount++;
      }

      after = data.paging?.next?.after;
      if (!after) break;
    }

    return { total_closed_won_amount: totalAmount, closed_won_deal_count: dealCount, year: currentYear };
  } catch (err) {
    console.warn('HubSpot deal aggregates error:', err.message);
    return null;
  }
}

/**
 * Download contact source distribution for GTM motion inference (A4).
 * Aggregates contacts by hs_analytics_source.
 */
async function downloadContactSources(headers) {
  try {
    const sourceCounts = {};
    let after = undefined;

    // Page through up to 200 contacts (2 pages)
    for (let page = 0; page < 2; page++) {
      const body = {
        filterGroups: [{
          filters: [
            { propertyName: 'hs_analytics_source', operator: 'HAS_PROPERTY' },
          ],
        }],
        properties: ['hs_analytics_source'],
        limit: 100,
      };
      if (after) body.after = after;

      const res = await fetch(`${API_BASE}/crm/v3/objects/contacts/search`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) break;
      const data = await res.json();
      const results = data.results || [];

      for (const contact of results) {
        const source = contact.properties?.hs_analytics_source || 'unknown';
        sourceCounts[source] = (sourceCounts[source] || 0) + 1;
      }

      after = data.paging?.next?.after;
      if (!after) break;
    }

    return { source_distribution: sourceCounts, sample_size: Object.values(sourceCounts).reduce((a, b) => a + b, 0) };
  } catch (err) {
    console.warn('HubSpot contact sources error:', err.message);
    return null;
  }
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
