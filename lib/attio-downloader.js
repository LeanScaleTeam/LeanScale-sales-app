/**
 * Attio Metadata Downloader
 *
 * Downloads CRM metadata from Attio's v2 REST API, stores raw JSON in
 * Supabase attio_metadata, and runs signal extraction for the diagnostic engine.
 *
 * Rate limits: 100 req/s read, 25 req/s write. We respect read limits by
 * batching parallelism to 10-20 concurrent requests.
 *
 * Docs: https://docs.attio.com/rest-api/overview
 */

import { supabaseAdmin } from './supabase';
import { extractAttioSignals } from './diagnostic-engine/signal-extractor-attio';

const API_BASE = 'https://api.attio.com';

// Bounded concurrency helper — keeps us well under 100 req/s
async function mapWithLimit(items, limit, fn) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const idx = cursor++;
      try {
        results[idx] = await fn(items[idx], idx);
      } catch (err) {
        console.warn(`[attio-downloader] worker error at ${idx}:`, err.message);
        results[idx] = null;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function fetchJSON(url, accessToken, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get('retry-after') || '2', 10);
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return fetchJSON(url, accessToken, init);
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Attio API ${init.method || 'GET'} ${url} → ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * Download all Attio metadata for a workspace and store in Supabase.
 * @param {string} customerId - Customer UUID
 * @param {string} workspaceId - Attio workspace UUID
 * @param {string} accessToken - Valid access token
 * @returns {Promise<object>} Computed signals
 */
export async function downloadAndStoreMetadata(customerId, workspaceId, accessToken) {
  // 1. Identify token + workspace
  const selfInfo = await fetchJSON(`${API_BASE}/v2/self`, accessToken);

  // 2. Top-level resources in parallel
  const [objectsRes, listsRes, workspaceMembersRes, webhooksRes] = await Promise.all([
    fetchJSON(`${API_BASE}/v2/objects`, accessToken),
    fetchJSON(`${API_BASE}/v2/lists`, accessToken),
    fetchJSON(`${API_BASE}/v2/workspace-members`, accessToken),
    fetchJSON(`${API_BASE}/v2/webhooks`, accessToken).catch(() => ({ data: [] })),
  ]);

  const objects = objectsRes?.data || [];
  const lists = listsRes?.data || [];
  const workspaceMembers = workspaceMembersRes?.data || [];
  const webhooks = webhooksRes?.data || [];

  // 3. Attributes per object (parallel, bounded)
  const attributesByObject = {};
  await mapWithLimit(objects, 8, async (obj) => {
    const slug = obj.api_slug || obj.id?.object_id;
    if (!slug) return;
    const res = await fetchJSON(
      `${API_BASE}/v2/objects/${slug}/attributes`,
      accessToken
    ).catch(() => null);
    attributesByObject[slug] = res?.data || [];
  });

  // 4. Statuses for status-typed attributes (for pipeline stage detection)
  const statusesByAttr = {};
  for (const [objSlug, attrs] of Object.entries(attributesByObject)) {
    const statusAttrs = (attrs || []).filter((a) => a.type === 'status');
    await mapWithLimit(statusAttrs, 5, async (attr) => {
      const attrSlug = attr.api_slug;
      if (!attrSlug) return;
      const key = `${objSlug}.${attrSlug}`;
      const res = await fetchJSON(
        `${API_BASE}/v2/objects/${objSlug}/attributes/${attrSlug}/statuses`,
        accessToken
      ).catch(() => null);
      statusesByAttr[key] = res?.data || [];
    });
  }

  // 5. List entries (sampled — 100/list)
  const listEntries = {};
  await mapWithLimit(lists, 8, async (list) => {
    const listId = list.id?.list_id || list.api_slug;
    if (!listId) return;
    const res = await fetchJSON(
      `${API_BASE}/v2/lists/${listId}/entries/query`,
      accessToken,
      { method: 'POST', body: JSON.stringify({ limit: 100 }) }
    ).catch(() => null);
    listEntries[listId] = res?.data || [];
  });

  // 6. Tasks (paginate up to 500)
  const tasks = await paginateOffset(
    `${API_BASE}/v2/tasks`,
    accessToken,
    { limit: 100, maxRecords: 500 }
  );

  // 7. Record samples for actor-share (200 most recent per primary object)
  const recordSamples = {};
  const primaryObjects = objects.filter((o) =>
    ['people', 'companies', 'deals', 'workspaces', 'users'].includes(o.api_slug)
  );
  await mapWithLimit(primaryObjects, 5, async (obj) => {
    const slug = obj.api_slug;
    const res = await fetchJSON(
      `${API_BASE}/v2/objects/${slug}/records/query`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          limit: 200,
          sorts: [{ attribute: 'created_at', direction: 'desc' }],
        }),
      }
    ).catch(() => null);
    recordSamples[slug] = res?.data || [];
  });

  // 8. Deal aggregates — count + closed-won amounts (current year, capped at 2k)
  const dealAggregates = await computeDealAggregates(accessToken).catch((err) => {
    console.warn('[attio-downloader] dealAggregates failed:', err.message);
    return { closed_won_count: 0, closed_won_amount: 0, total_open_deals: 0 };
  });

  // 9. Extract signals
  const computedSignals = extractAttioSignals({
    self: selfInfo?.data || selfInfo,
    objects,
    attributes: attributesByObject,
    statuses: statusesByAttr,
    lists,
    list_entries: listEntries,
    workspace_members: workspaceMembers,
    tasks,
    webhooks,
    record_samples: recordSamples,
    deal_aggregates: dealAggregates,
  });

  // 10. Persist
  const { error } = await supabaseAdmin.from('attio_metadata').upsert(
    {
      customer_id: customerId,
      workspace_id: workspaceId,
      self_info: selfInfo,
      objects,
      attributes: attributesByObject,
      statuses: statusesByAttr,
      lists,
      list_entries: listEntries,
      workspace_members: workspaceMembers,
      tasks,
      webhooks,
      record_samples: recordSamples,
      deal_aggregates: dealAggregates,
      computed_signals: computedSignals,
      downloaded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'customer_id,workspace_id' }
  );

  if (error) {
    console.error('Error storing Attio metadata:', error);
    throw new Error(`Failed to store metadata: ${error.message}`);
  }

  return computedSignals;
}

/**
 * Generic offset-paginated GET (Attio uses limit/offset).
 */
async function paginateOffset(url, accessToken, { limit = 100, maxRecords = 500 } = {}) {
  const all = [];
  let offset = 0;
  while (all.length < maxRecords) {
    const u = new URL(url);
    u.searchParams.set('limit', String(limit));
    u.searchParams.set('offset', String(offset));
    const res = await fetchJSON(u.toString(), accessToken).catch(() => null);
    const batch = res?.data || [];
    if (batch.length === 0) break;
    all.push(...batch);
    if (batch.length < limit) break;
    offset += limit;
  }
  return all.slice(0, maxRecords);
}

/**
 * Compute deal aggregates by paging through the deals object.
 * Returns counts by stage + closed-won amount (current year).
 */
async function computeDealAggregates(accessToken) {
  const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString();
  let totalAmount = 0;
  let closedWonCount = 0;
  let totalOpen = 0;
  const stageCounts = {};

  let offset = 0;
  const pageSize = 200;
  const maxPages = 10; // 2k deals max
  for (let i = 0; i < maxPages; i++) {
    const res = await fetchJSON(
      `${API_BASE}/v2/objects/deals/records/query`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({ limit: pageSize, offset }),
      }
    ).catch(() => null);
    const batch = res?.data || [];
    if (batch.length === 0) break;

    for (const deal of batch) {
      const values = deal.values || {};
      const stageEntry = values.stage?.[0] || values.deal_stage?.[0];
      const stageLabel = stageEntry?.status?.title || stageEntry?.value || 'unknown';
      stageCounts[stageLabel] = (stageCounts[stageLabel] || 0) + 1;

      const amount = parseFloat(values.value?.[0]?.currency_value || values.amount?.[0]?.value || 0);
      const closedAt = values.closed_at?.[0]?.value || values.close_date?.[0]?.value;

      if (/won/i.test(stageLabel)) {
        if (!closedAt || closedAt >= yearStart) {
          closedWonCount++;
          if (amount > 0) totalAmount += amount;
        }
      } else if (!/lost/i.test(stageLabel)) {
        totalOpen++;
      }
    }

    if (batch.length < pageSize) break;
    offset += pageSize;
  }

  return {
    closed_won_count: closedWonCount,
    closed_won_amount: totalAmount,
    total_open_deals: totalOpen,
    stage_counts: stageCounts,
    year: new Date().getFullYear(),
  };
}
