# Salesforce Diagnostic Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Salesforce CRM diagnostic support to the v2 GTM diagnostic — OAuth API-first with metadata zip upload fallback, same 17 shared items + 5-item Platform Health layer.

**Architecture:** Mirrors the existing HubSpot integration pattern. `lib/salesforce.js` handles OAuth, `lib/salesforce-downloader.js` pulls metadata via REST/SOQL/Tooling APIs, `lib/salesforce-metadata-parser.js` handles zip uploads. Both paths feed `signal-extractor-sf.js` which produces the same `computedSignals` shape consumed by the existing diagnostic engine. A new `gradePlatformHealth()` grader adds 5 Salesforce-specific items (P1-P5).

**Tech Stack:** Next.js API routes, Supabase (PostgreSQL), Salesforce REST/Tooling/SOQL APIs, JSZip for metadata parsing, existing framer-motion UI.

**Design doc:** `docs/plans/2026-02-25-salesforce-diagnostic-design.md`

---

### Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/009_salesforce_diagnostic.sql`

**Step 1: Write the migration**

```sql
-- ============================================
-- Salesforce Diagnostic Migration
-- Adds Salesforce OAuth connections, metadata storage, and intake status
-- ============================================

-- ============================================
-- SALESFORCE CONNECTIONS (OAuth tokens per customer/org)
-- ============================================
CREATE TABLE IF NOT EXISTS salesforce_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  org_id TEXT NOT NULL,
  instance_url TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  is_sandbox BOOLEAN DEFAULT false,
  scopes_granted TEXT[],
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, org_id)
);

ALTER TABLE salesforce_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on salesforce_connections"
  ON salesforce_connections FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_salesforce_connections_customer
  ON salesforce_connections(customer_id);

-- ============================================
-- SALESFORCE METADATA (raw API downloads + parsed zip + computed signals)
-- ============================================
CREATE TABLE IF NOT EXISTS salesforce_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  org_id TEXT,
  source TEXT NOT NULL CHECK (source IN ('api', 'upload')),
  objects JSONB,
  stages JSONB,
  users JSONB,
  flows JSONB,
  workflow_rules JSONB,
  validation_rules JSONB,
  apex_triggers JSONB,
  apex_classes JSONB,
  profiles JSONB,
  permission_sets JSONB,
  roles JSONB,
  reports JSONB,
  dashboards JSONB,
  connected_apps JSONB,
  named_credentials JSONB,
  record_types JSONB,
  computed_signals JSONB,
  fetch_status JSONB,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, org_id)
);

ALTER TABLE salesforce_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on salesforce_metadata"
  ON salesforce_metadata FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_salesforce_metadata_customer
  ON salesforce_metadata(customer_id);

-- ============================================
-- ALTER diagnostic_intake for status tracking
-- ============================================
ALTER TABLE diagnostic_intake
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'awaiting_crm_data', 'complete'));

-- ============================================
-- ALTER diagnostic_results for Salesforce metadata reference
-- ============================================
ALTER TABLE diagnostic_results
  ADD COLUMN IF NOT EXISTS salesforce_metadata_id UUID REFERENCES salesforce_metadata(id),
  ADD COLUMN IF NOT EXISTS crm_type TEXT DEFAULT 'unknown';
```

**Step 2: Run the migration**

Run: `npx supabase db push` (or apply via Supabase dashboard)
Expected: Tables created, columns added.

**Step 3: Commit**

```bash
git add supabase/migrations/009_salesforce_diagnostic.sql
git commit -m "feat: add Salesforce diagnostic database tables and intake status column"
```

---

### Task 2: Environment Variables

**Files:**
- Modify: `.env.example:28-30` (add Salesforce vars after HubSpot vars)

**Step 1: Add Salesforce env vars to .env.example**

Add after the existing HUBSPOT_ lines (line 30):

```
SALESFORCE_CLIENT_ID=your-salesforce-connected-app-client-id
SALESFORCE_CLIENT_SECRET=your-salesforce-connected-app-client-secret
SALESFORCE_REDIRECT_URI=http://localhost:3000/api/salesforce/callback
```

**Step 2: Add to local .env.local**

Same vars with actual Connected App values. (Manual step — do not commit.)

**Step 3: Commit**

```bash
git add .env.example
git commit -m "feat: add Salesforce OAuth env vars to .env.example"
```

---

### Task 3: Salesforce OAuth Library

**Files:**
- Create: `lib/salesforce.js`

**Reference:** `lib/hubspot.js` — same structure, Salesforce OAuth endpoints.

**Step 1: Write lib/salesforce.js**

```js
/**
 * Salesforce OAuth helpers
 *
 * Handles authorization URL generation, code exchange, token refresh,
 * and org identity retrieval. Stores tokens in Supabase salesforce_connections.
 */

import { supabaseAdmin } from './supabase';

const SF_LOGIN_URL = 'https://login.salesforce.com';
const SF_SANDBOX_LOGIN_URL = 'https://test.salesforce.com';

/**
 * Build Salesforce OAuth authorization URL.
 * @param {string} customerId - UUID of the customer
 * @param {string} slug - Customer slug for redirect back
 * @param {boolean} isSandbox - Whether to use sandbox login
 * @returns {string} Full authorization URL
 */
export function getAuthorizationUrl(customerId, slug, isSandbox = false) {
  const baseUrl = isSandbox ? SF_SANDBOX_LOGIN_URL : SF_LOGIN_URL;
  const state = Buffer.from(JSON.stringify({ customerId, slug, isSandbox })).toString('base64url');

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SALESFORCE_CLIENT_ID,
    redirect_uri: process.env.SALESFORCE_REDIRECT_URI,
    state,
  });

  return `${baseUrl}/services/oauth2/authorize?${params}`;
}

/**
 * Exchange authorization code for access + refresh tokens.
 * @param {string} code - Authorization code from callback
 * @param {boolean} isSandbox - Whether to use sandbox token endpoint
 * @returns {Promise<{access_token, refresh_token, instance_url, id}>}
 */
export async function exchangeCodeForTokens(code, isSandbox = false) {
  const baseUrl = isSandbox ? SF_SANDBOX_LOGIN_URL : SF_LOGIN_URL;

  const res = await fetch(`${baseUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      redirect_uri: process.env.SALESFORCE_REDIRECT_URI,
      code,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  return res.json();
}

/**
 * Refresh an expired access token.
 * @param {string} refreshToken - The refresh token
 * @param {boolean} isSandbox - Whether to use sandbox token endpoint
 * @returns {Promise<{access_token, instance_url}>}
 */
export async function refreshAccessToken(refreshToken, isSandbox = false) {
  const baseUrl = isSandbox ? SF_SANDBOX_LOGIN_URL : SF_LOGIN_URL;

  const res = await fetch(`${baseUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Token refresh failed: ${error}`);
  }

  return res.json();
}

/**
 * Get a valid access token for a customer, auto-refreshing if needed.
 * Salesforce access tokens expire ~2 hours after issue.
 * We proactively refresh if connected_at + 1.5 hours has passed.
 * @param {string} customerId - UUID of the customer
 * @returns {Promise<{accessToken, instanceUrl, orgId}|null>}
 */
export async function getAccessToken(customerId) {
  const { data: conn, error } = await supabaseAdmin
    .from('salesforce_connections')
    .select('*')
    .eq('customer_id', customerId)
    .order('connected_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !conn) return null;

  // Salesforce tokens last ~2 hours; refresh proactively after 1.5 hours
  const connectedAt = new Date(conn.updated_at || conn.connected_at);
  const ninetyMinLater = new Date(connectedAt.getTime() + 90 * 60 * 1000);

  if (new Date() < ninetyMinLater) {
    return {
      accessToken: conn.access_token,
      instanceUrl: conn.instance_url,
      orgId: conn.org_id,
    };
  }

  // Refresh the token
  const tokens = await refreshAccessToken(conn.refresh_token, conn.is_sandbox);

  await supabaseAdmin
    .from('salesforce_connections')
    .update({
      access_token: tokens.access_token,
      instance_url: tokens.instance_url || conn.instance_url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', conn.id);

  return {
    accessToken: tokens.access_token,
    instanceUrl: tokens.instance_url || conn.instance_url,
    orgId: conn.org_id,
  };
}

/**
 * Get Salesforce org identity from the identity URL.
 * @param {string} identityUrl - The 'id' field from token response
 * @param {string} accessToken - Valid access token
 * @returns {Promise<{orgId: string, userId: string, displayName: string}>}
 */
export async function getOrgIdentity(identityUrl, accessToken) {
  const res = await fetch(identityUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to get org identity: ${res.status}`);
  }

  const data = await res.json();
  return {
    orgId: data.organization_id,
    userId: data.user_id,
    displayName: data.display_name || data.username || 'Unknown',
  };
}
```

**Step 2: Commit**

```bash
git add lib/salesforce.js
git commit -m "feat: add Salesforce OAuth library with authorize, token exchange, and refresh"
```

---

### Task 4: Salesforce OAuth API Routes

**Files:**
- Create: `pages/api/salesforce/authorize.js`
- Create: `pages/api/salesforce/callback.js`
- Create: `pages/api/salesforce/status/[customerId].js`

**Reference:** `pages/api/hubspot/authorize.js`, `pages/api/hubspot/callback.js`, `pages/api/hubspot/status/[customerId].js`

**Step 1: Write authorize.js**

```js
/**
 * Salesforce OAuth Authorize
 * GET /api/salesforce/authorize?customerId=xxx&slug=yyy&sandbox=false
 */

import { getAuthorizationUrl } from '../../../lib/salesforce';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId, slug, sandbox } = req.query;

  if (!customerId || !slug) {
    return res.status(400).json({ error: 'customerId and slug are required' });
  }

  const isSandbox = sandbox === 'true';
  const url = getAuthorizationUrl(customerId, slug, isSandbox);
  res.redirect(url);
}
```

**Step 2: Write callback.js**

```js
/**
 * Salesforce OAuth Callback
 * GET /api/salesforce/callback?code=xxx&state=xxx
 */

import { exchangeCodeForTokens, getOrgIdentity } from '../../../lib/salesforce';
import { downloadAndStoreMetadata } from '../../../lib/salesforce-downloader';
import { supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error: oauthError, state } = req.query;

  let customerId, slug, isSandbox;
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString());
    customerId = decoded.customerId;
    slug = decoded.slug;
    isSandbox = decoded.isSandbox || false;
  } catch {
    return res.status(400).json({ error: 'Invalid state parameter' });
  }

  if (oauthError) {
    return res.redirect(
      `/c/${slug}/diagnostic/intake?salesforce=error&reason=${encodeURIComponent(oauthError)}`
    );
  }

  if (!code) {
    return res.redirect(`/c/${slug}/diagnostic/intake?salesforce=error&reason=no_code`);
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, isSandbox);

    // Get org identity
    const identity = await getOrgIdentity(tokens.id, tokens.access_token);

    // Store connection
    await supabaseAdmin.from('salesforce_connections').upsert(
      {
        customer_id: customerId,
        org_id: identity.orgId,
        instance_url: tokens.instance_url,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        is_sandbox: isSandbox,
        connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'customer_id,org_id' }
    );

    // Update customer CRM type
    await supabaseAdmin
      .from('customers')
      .update({ crm_type: 'salesforce' })
      .eq('id', customerId);

    // Download metadata (blocking)
    await downloadAndStoreMetadata(customerId, identity.orgId, tokens.instance_url, tokens.access_token);

    // Check if intake is awaiting CRM data — if so, auto-run diagnostic
    const { data: intake } = await supabaseAdmin
      .from('diagnostic_intake')
      .select('id, status, answers')
      .eq('customer_id', customerId)
      .single();

    if (intake?.status === 'awaiting_crm_data') {
      const { runDiagnostic } = await import('../../../lib/diagnostic-engine');
      const { data: metadata } = await supabaseAdmin
        .from('salesforce_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .single();

      const result = runDiagnostic(intake.answers, metadata?.computed_signals || {}, 'salesforce');

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
          salesforce_metadata_id: metadata?.id || null,
        },
        { onConflict: 'customer_id,diagnostic_type' }
      );

      await supabaseAdmin
        .from('diagnostic_intake')
        .update({ status: 'complete' })
        .eq('customer_id', customerId);
    }

    // Redirect back
    const orgName = encodeURIComponent(identity.displayName);
    res.redirect(`/c/${slug}/diagnostic/intake?salesforce=connected&orgName=${orgName}`);
  } catch (err) {
    console.error('Salesforce callback error:', err);
    res.redirect(
      `/c/${slug}/diagnostic/intake?salesforce=error&reason=${encodeURIComponent(err.message)}`
    );
  }
}
```

**Step 3: Write status/[customerId].js**

```js
/**
 * Salesforce Connection Status
 * GET /api/salesforce/status/[customerId]
 */

import { supabaseAdmin } from '../../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.query;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    const { data: connection } = await supabaseAdmin
      .from('salesforce_connections')
      .select('org_id, instance_url, is_sandbox, connected_at, updated_at')
      .eq('customer_id', customerId)
      .order('connected_at', { ascending: false })
      .limit(1)
      .single();

    if (!connection) {
      return res.status(200).json({
        connected: false,
        orgId: null,
        instanceUrl: null,
        lastDownloaded: null,
        signalsReady: false,
      });
    }

    const { data: metadata } = await supabaseAdmin
      .from('salesforce_metadata')
      .select('fetched_at, computed_signals, source')
      .eq('customer_id', customerId)
      .order('fetched_at', { ascending: false })
      .limit(1)
      .single();

    return res.status(200).json({
      connected: true,
      orgId: connection.org_id,
      instanceUrl: connection.instance_url,
      isSandbox: connection.is_sandbox,
      connectedAt: connection.connected_at,
      lastDownloaded: metadata?.fetched_at || null,
      signalsReady: !!metadata?.computed_signals,
      source: metadata?.source || null,
    });
  } catch (err) {
    console.error('Salesforce status error:', err);
    return res.status(500).json({ error: 'Failed to check status' });
  }
}
```

**Step 4: Commit**

```bash
git add pages/api/salesforce/
git commit -m "feat: add Salesforce OAuth authorize, callback, and status API routes"
```

---

### Task 5: Salesforce Metadata Downloader (API Path)

**Files:**
- Create: `lib/salesforce-downloader.js`

**Reference:** `lib/hubspot-downloader.js` — same pattern, Salesforce API endpoints.

**Step 1: Write salesforce-downloader.js**

```js
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
```

**Step 2: Commit**

```bash
git add lib/salesforce-downloader.js
git commit -m "feat: add Salesforce metadata downloader with REST, SOQL, and Tooling API support"
```

---

### Task 6: Salesforce Signal Extractor

**Files:**
- Create: `lib/diagnostic-engine/signal-extractor-sf.js`

**Reference:** `lib/diagnostic-engine/signal-extractor.js` — produces same shared signal keys + Platform Health signals.

**Step 1: Write signal-extractor-sf.js**

```js
/**
 * Salesforce Signal Extractor
 *
 * Takes raw Salesforce metadata (from API or parsed zip) and produces
 * a flat signal object with:
 * - ~40 shared signals (same keys as HubSpot signal-extractor.js)
 * - ~15 Platform Health signals (Salesforce-only, P1-P5)
 */

/**
 * Extract all diagnostic signals from Salesforce metadata.
 * @param {object} metadata - Normalized Salesforce metadata
 * @returns {object} Flat signal object
 */
export function extractSalesforceSignals(metadata) {
  const {
    objects, stages, users, flows, workflowRules, validationRules,
    apexTriggers, apexClasses, profiles, permissionSets, roles,
    reports, dashboards, connectedApps, namedCredentials, recordTypes,
  } = metadata || {};

  const activeFlows = Array.isArray(flows) ? flows : [];
  const activeWorkflowRules = Array.isArray(workflowRules) ? workflowRules : [];
  const allAutomations = [...activeFlows, ...activeWorkflowRules];

  return {
    // ── F1: CRM Data Model ──
    contact_total_properties: countFields(objects?.Contact) + countFields(objects?.Lead),
    contact_custom_properties: countCustomFields(objects?.Contact) + countCustomFields(objects?.Lead),
    company_total_properties: countFields(objects?.Account),
    company_custom_properties: countCustomFields(objects?.Account),
    deal_total_properties: countFields(objects?.Opportunity),
    deal_custom_properties: countCustomFields(objects?.Opportunity),
    ticket_total_properties: countFields(objects?.Case),
    ticket_custom_properties: countCustomFields(objects?.Case),
    enrichment_tool_detected: detectEnrichmentTool(objects),
    enrichment_field_count: countEnrichmentFields(objects),

    // ── F2: Pipeline Design ──
    deal_pipeline_count: 1, // Salesforce has a single Opportunity pipeline (stages define it)
    deal_pipeline_stages: [{
      name: 'Opportunity Pipeline',
      stageCount: stages?.opportunityStages?.length || 0,
      hasStalled: (stages?.opportunityStages || []).some((s) => /stall|park|on hold/i.test(s.MasterLabel || '')),
      probabilities: (stages?.opportunityStages || []).map((s) => parseFloat(s.DefaultProbability || 0)),
      hasClosedLost: (stages?.opportunityStages || []).some((s) => s.IsClosed && !s.IsWon),
    }],
    ticket_pipeline_count: 1, // Salesforce Cases use a single status-based pipeline
    ticket_pipeline_customized: countCustomFields(objects?.Case) > 5,

    // ── F3: Lifecycle & Lead Status ──
    lifecycle_workflow_count: allAutomations.filter((a) => /lifecycle|life.?cycle|stage.*transition|mql|sql/i.test(a.Label || a.Name || '')).length,
    lead_status_workflow_count: allAutomations.filter((a) => /lead.?status|lead.*state|new.*lead|qualification/i.test(a.Label || a.Name || '')).length,
    lifecycle_stages_covered: detectLifecycleStages(stages, objects),
    has_cross_object_sync: allAutomations.some((a) => /account.*contact|contact.*account|cross.*object|sync/i.test(a.Label || a.Name || '')),

    // ── F4: Automation Engine ──
    total_active_workflows: activeFlows.length + activeWorkflowRules.length,
    total_disabled_workflows: 0, // We only query active in the downloader
    workflow_categories: categorizeAutomations(allAutomations),
    workflow_category_count: Object.keys(categorizeAutomations(allAutomations)).length,
    has_task_automation: allAutomations.some((a) => /task|to.?do|assign/i.test(a.Label || a.Name || '')),
    has_deal_creation_automation: allAutomations.some((a) => /create.*opp|new.*opp|auto.*opp|opp.*creation/i.test(a.Label || a.Name || '')),

    // ── F5: Team & Ownership ──
    total_owners: Array.isArray(users) ? users.length : 0,
    teams: extractRoleNames(users),
    team_count: extractRoleNames(users).length,
    orphan_owner_count: Array.isArray(users) ? users.filter((u) => !u.UserRole?.Name).length : 0,
    owner_to_team_coverage: calcRoleCoverage(users),

    // ── F6: Data Enrichment ──
    enrichment_tools: detectAllEnrichmentTools(objects),
    enrichment_multi_object: checkMultiObjectEnrichment(objects),
    has_enrichment_workflow: allAutomations.some((a) => /enrich|clay|zoominfo|clearbit|append/i.test(a.Label || a.Name || '')),

    // ── M1: Inbound Lead Flow ──
    form_count: countWebToLead(objects?.Lead),
    lead_capture_forms: countWebToLead(objects?.Lead),
    has_lead_routing_workflow: allAutomations.some((a) => /lead.*rout|round.?robin|assign.*lead|distribute|assignment/i.test(a.Label || a.Name || '')),
    has_speed_to_lead: allAutomations.some((a) => /speed.?to.?lead|instant.*response|quick.*response|new.*lead.*notif/i.test(a.Label || a.Name || '')),

    // ── M2: Marketing Email & Nurture ──
    marketing_email_count: countCampaignEmails(objects?.Campaign),
    published_emails: countCampaignEmails(objects?.Campaign),
    nurture_workflow_count: allAutomations.filter((a) => /nurture|drip|email.*sequence|follow.?up/i.test(a.Label || a.Name || '')).length,
    dynamic_list_count: 0, // Salesforce uses reports/views instead of lists
    static_list_count: 0,

    // ── M3: Sales Execution ──
    has_stalled_deal_notification: allAutomations.some((a) => /stall|stagnant|inactive.*opp|no.*activity|stuck|aging/i.test(a.Label || a.Name || '')),

    // ── M4: Attribution ──
    attribution_workflow_count: allAutomations.filter((a) => /attribution|source.*track|utm|campaign.*track/i.test(a.Label || a.Name || '')).length,
    has_deal_source_property: hasField(objects?.Opportunity, ['LeadSource', 'CampaignId', 'Source__c', 'Lead_Source__c']),

    // ── M5: Deal-to-Close ──
    has_competitor_property: hasField(objects?.Opportunity, ['Competitor__c', 'Competitors__c', 'Competitive_Landscape__c']),
    has_close_reason_property: hasField(objects?.Opportunity, ['Loss_Reason__c', 'Closed_Lost_Reason__c', 'StageName']),
    has_closed_won_automation: allAutomations.some((a) => /closed.?won|deal.*won|won.*deal|customer.*welcome|handoff/i.test(a.Label || a.Name || '')),

    // ── M6: Customer Success ──
    has_cs_handoff_workflow: allAutomations.some((a) => /handoff|hand.?off|sales.?to.?cs|cs.*handoff|onboard.*trigger/i.test(a.Label || a.Name || '')),
    has_onboarding_workflow: allAutomations.some((a) => /onboard|welcome.*customer|new.*customer|implementation/i.test(a.Label || a.Name || '')),

    // ── M7: Partner ──
    has_partner_pipeline: hasField(objects?.Opportunity, ['Partner__c', 'Partner_Account__c', 'IsPartnerDeal__c']),
    has_referral_workflow: allAutomations.some((a) => /referral|partner.*deal|channel|resell/i.test(a.Label || a.Name || '')),

    // ── R4: Win/Loss ──
    has_competitor_tracking: hasField(objects?.Opportunity, ['Competitor__c', 'Competitors__c']),
    has_closed_lost_reason: hasField(objects?.Opportunity, ['Loss_Reason__c', 'Closed_Lost_Reason__c', 'Close_Lost_Reason__c']),

    // ── Reporting signals ──
    has_reporting_dashboards: (Array.isArray(dashboards) ? dashboards.length : 0) + (Array.isArray(reports) ? reports.length : 0),

    // ══════════════════════════════════════
    // PLATFORM HEALTH SIGNALS (Salesforce-only)
    // ══════════════════════════════════════

    // P1: Apex Code Health
    apex_trigger_count: Array.isArray(apexTriggers) ? apexTriggers.length : 0,
    apex_class_count: Array.isArray(apexClasses) ? apexClasses.length : 0,
    apex_total_lines: Array.isArray(apexClasses) ? apexClasses.reduce((sum, c) => sum + (c.LengthWithoutComments || 0), 0) : 0,

    // P2: Validation & Data Quality
    validation_rule_count: Array.isArray(validationRules) ? validationRules.length : 0,
    validation_rules_by_object: groupByObject(validationRules, 'EntityDefinition'),
    duplicate_rule_count: 0, // Not queried in v1; placeholder

    // P3: Security & Access Model
    profile_count: Array.isArray(profiles) ? profiles.length : 0,
    permission_set_count: Array.isArray(permissionSets) ? permissionSets.length : 0,
    role_hierarchy_depth: calcRoleHierarchyDepth(roles),

    // P4: Record Type & Layout Design
    record_type_count: Array.isArray(recordTypes) ? recordTypes.reduce((sum, r) => sum + (r.cnt || 0), 0) : 0,
    record_types_by_object: groupRecordTypes(recordTypes),
    page_layout_count: 0, // Layout count from metadata; placeholder for API path

    // P5: Integration Footprint
    connected_app_count: Array.isArray(connectedApps) ? connectedApps.length : 0,
    named_credential_count: Array.isArray(namedCredentials) ? namedCredentials.length : 0,
    outbound_flow_count: activeFlows.filter((f) => /callout|http|api|integration|outbound/i.test(f.Label || f.ProcessType || '')).length,
  };
}

// ── Helper Functions ──

function countFields(objectDescribe) {
  return objectDescribe?.fields?.length || 0;
}

function countCustomFields(objectDescribe) {
  if (!objectDescribe?.fields) return 0;
  return objectDescribe.fields.filter((f) => f.custom).length;
}

const ENRICHMENT_PATTERNS = [
  { name: 'AdvizorPro', pattern: /advizor/i },
  { name: 'ZoomInfo', pattern: /zoominfo|zi_/i },
  { name: 'Clearbit', pattern: /clearbit/i },
  { name: 'Apollo', pattern: /apollo/i },
  { name: 'Clay', pattern: /^clay_|_clay_/i },
  { name: 'Cognism', pattern: /cognism/i },
  { name: 'Lusha', pattern: /lusha/i },
  { name: '6sense', pattern: /6sense/i },
  { name: 'Demandbase', pattern: /demandbase/i },
];

function detectEnrichmentTool(objects) {
  const allFields = getAllFieldNames(objects);
  for (const tool of ENRICHMENT_PATTERNS) {
    if (allFields.some((name) => tool.pattern.test(name))) return tool.name;
  }
  return null;
}

function countEnrichmentFields(objects) {
  const allFields = getAllFieldNames(objects);
  let count = 0;
  for (const name of allFields) {
    if (ENRICHMENT_PATTERNS.some((t) => t.pattern.test(name))) count++;
  }
  return count;
}

function detectAllEnrichmentTools(objects) {
  const allFields = getAllFieldNames(objects);
  const found = [];
  for (const tool of ENRICHMENT_PATTERNS) {
    const fields = allFields.filter((name) => tool.pattern.test(name));
    if (fields.length > 0) found.push({ name: tool.name, fieldCount: fields.length });
  }
  return found;
}

function checkMultiObjectEnrichment(objects) {
  const contactFields = getFieldNames(objects?.Contact).concat(getFieldNames(objects?.Lead));
  const accountFields = getFieldNames(objects?.Account);
  const contactEnriched = contactFields.some((n) => ENRICHMENT_PATTERNS.some((t) => t.pattern.test(n)));
  const accountEnriched = accountFields.some((n) => ENRICHMENT_PATTERNS.some((t) => t.pattern.test(n)));
  return contactEnriched && accountEnriched;
}

function getAllFieldNames(objects) {
  if (!objects) return [];
  const names = [];
  for (const obj of Object.values(objects)) {
    if (obj?.fields) {
      for (const f of obj.fields) {
        names.push(f.name || '');
        names.push(f.label || '');
      }
    }
  }
  return names;
}

function getFieldNames(objectDescribe) {
  if (!objectDescribe?.fields) return [];
  return objectDescribe.fields.map((f) => f.name || '');
}

function hasField(objectDescribe, fieldNames) {
  if (!objectDescribe?.fields || !Array.isArray(fieldNames)) return false;
  const names = objectDescribe.fields.map((f) => f.name);
  return fieldNames.some((n) => names.includes(n));
}

function detectLifecycleStages(stages, objects) {
  const covered = new Set();
  const leadStatuses = (stages?.leadStatuses || []).map((s) => s.MasterLabel || '');
  const stagePatterns = [
    { stage: 'Lead', pattern: /\bnew\b|\bopen\b|\blead\b/i },
    { stage: 'MQL', pattern: /\bmql\b|marketing.?qualified/i },
    { stage: 'SQL', pattern: /\bsql\b|sales.?qualified/i },
    { stage: 'Opportunity', pattern: /\bqualified\b|\bworking\b/i },
    { stage: 'Customer', pattern: /\bcustomer\b|\bconverted\b|\bclosed.?won\b/i },
  ];
  for (const status of leadStatuses) {
    for (const { stage, pattern } of stagePatterns) {
      if (pattern.test(status)) covered.add(stage);
    }
  }
  // Check for lifecycle stage custom field on Lead/Contact
  if (hasField(objects?.Lead, ['Lifecycle_Stage__c', 'LifecycleStage__c'])) {
    covered.add('Lead'); covered.add('MQL');
  }
  return [...covered];
}

function categorizeAutomations(automations) {
  const categories = {
    lifecycle: [], task: [], notification: [], data_sync: [], deal: [], marketing: [], other: [],
  };
  for (const a of automations) {
    const name = (a.Label || a.Name || '').toLowerCase();
    if (/lifecycle|stage|status/i.test(name)) categories.lifecycle.push(a.Label || a.Name);
    else if (/task|to.?do|reminder/i.test(name)) categories.task.push(a.Label || a.Name);
    else if (/notif|alert|slack|email.*internal/i.test(name)) categories.notification.push(a.Label || a.Name);
    else if (/sync|update|copy|mirror/i.test(name)) categories.data_sync.push(a.Label || a.Name);
    else if (/deal|opp|pipeline|closed/i.test(name)) categories.deal.push(a.Label || a.Name);
    else if (/marketing|email|nurture|campaign/i.test(name)) categories.marketing.push(a.Label || a.Name);
    else categories.other.push(a.Label || a.Name);
  }
  const result = {};
  for (const [key, arr] of Object.entries(categories)) {
    if (arr.length > 0) result[key] = arr;
  }
  return result;
}

function extractRoleNames(users) {
  if (!Array.isArray(users)) return [];
  const roles = new Set();
  for (const u of users) {
    if (u.UserRole?.Name) roles.add(u.UserRole.Name);
  }
  return [...roles];
}

function calcRoleCoverage(users) {
  if (!Array.isArray(users) || users.length === 0) return 0;
  const withRole = users.filter((u) => u.UserRole?.Name).length;
  return Math.round((withRole / users.length) * 100);
}

function countWebToLead(leadDescribe) {
  if (!leadDescribe?.fields) return 0;
  // Web-to-Lead is indicated by fields like LeadSource with 'Web' in picklist
  return leadDescribe.fields.some((f) => f.name === 'LeadSource') ? 1 : 0;
}

function countCampaignEmails(campaignDescribe) {
  if (!campaignDescribe?.fields) return 0;
  return campaignDescribe.fields.some((f) => f.name === 'Type') ? 1 : 0;
}

function groupByObject(items, entityField) {
  if (!Array.isArray(items)) return {};
  const groups = {};
  for (const item of items) {
    const obj = item[entityField]?.QualifiedApiName || item.EntityDefinitionId || 'Unknown';
    if (!groups[obj]) groups[obj] = 0;
    groups[obj]++;
  }
  return groups;
}

function groupRecordTypes(recordTypes) {
  if (!Array.isArray(recordTypes)) return {};
  const groups = {};
  for (const rt of recordTypes) {
    groups[rt.SobjectType] = rt.cnt || 0;
  }
  return groups;
}

function calcRoleHierarchyDepth(roles) {
  if (!Array.isArray(roles) || roles.length === 0) return 0;
  // Build parent map and find max depth
  const parentMap = {};
  for (const role of roles) {
    parentMap[role.Id] = role.ParentRoleId;
  }
  let maxDepth = 0;
  for (const role of roles) {
    let depth = 0;
    let current = role.Id;
    const visited = new Set();
    while (parentMap[current] && !visited.has(current)) {
      visited.add(current);
      current = parentMap[current];
      depth++;
    }
    if (depth > maxDepth) maxDepth = depth;
  }
  return maxDepth;
}
```

**Step 2: Commit**

```bash
git add lib/diagnostic-engine/signal-extractor-sf.js
git commit -m "feat: add Salesforce signal extractor with shared + Platform Health signals"
```

---

### Task 7: Platform Health Grader + Constants Update

**Files:**
- Create: `lib/diagnostic-engine/graders/platform-health.js`
- Modify: `lib/diagnostic-engine/constants.js:14-18` (add Platform Health layer weight)
- Modify: `lib/diagnostic-engine/constants.js:191` (add P1-P5 items)

**Step 1: Create graders directory and platform-health.js**

```js
/**
 * Platform Health Layer Grading (P1-P5)
 *
 * Salesforce-only layer grading Apex code health, validation rules,
 * security model, record type design, and integration footprint.
 */

import { SOURCE_TYPES } from '../constants';

export function gradePlatformHealth(signals) {
  return [
    gradeP1(signals),
    gradeP2(signals),
    gradeP3(signals),
    gradeP4(signals),
    gradeP5(signals),
  ];
}

/**
 * P1: Apex Code Health
 */
function gradeP1(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Trigger count
  const triggerCount = s.apex_trigger_count || 0;
  if (triggerCount <= 20) {
    score += 3;
    itemSignals.push({ name: 'Apex triggers', value: `${triggerCount}`, impact: 'positive', source: 'api' });
  } else if (triggerCount <= 50) {
    score += 2;
    itemSignals.push({ name: 'Apex triggers', value: `${triggerCount}`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Apex triggers', value: `${triggerCount}`, impact: 'negative', source: 'api' });
  }
  count++;

  // Class count and complexity
  const classCount = s.apex_class_count || 0;
  const totalLines = s.apex_total_lines || 0;
  const avgLines = classCount > 0 ? Math.round(totalLines / classCount) : 0;

  if (classCount > 0 && avgLines < 200) {
    score += 3;
    itemSignals.push({ name: 'Apex classes', value: `${classCount} (avg ${avgLines} lines)`, impact: 'positive', source: 'api' });
  } else if (classCount > 0 && avgLines < 500) {
    score += 2;
    itemSignals.push({ name: 'Apex classes', value: `${classCount} (avg ${avgLines} lines)`, impact: 'neutral', source: 'api' });
  } else {
    score += classCount > 0 ? 1 : 2; // No Apex is neutral, not bad
    itemSignals.push({ name: 'Apex classes', value: classCount > 0 ? `${classCount} (avg ${avgLines} lines)` : 'None', impact: classCount > 0 ? 'negative' : 'neutral', source: 'api' });
  }
  count++;

  const avg = count > 0 ? score / count : 2;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'P1', name: 'Apex Code Health', layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY, status, score: Math.round(avg * 100) / 100,
    signals: itemSignals,
  };
}

/**
 * P2: Validation & Data Quality Rules
 */
function gradeP2(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Validation rule coverage
  const ruleCount = s.validation_rule_count || 0;
  const rulesByObject = s.validation_rules_by_object || {};
  const objectsWithRules = Object.keys(rulesByObject).length;

  if (objectsWithRules >= 4 && ruleCount >= 10) {
    score += 3;
    itemSignals.push({ name: 'Validation rules', value: `${ruleCount} across ${objectsWithRules} objects`, impact: 'positive', source: 'api' });
  } else if (objectsWithRules >= 2 && ruleCount >= 3) {
    score += 2;
    itemSignals.push({ name: 'Validation rules', value: `${ruleCount} across ${objectsWithRules} objects`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Validation rules', value: ruleCount > 0 ? `${ruleCount} across ${objectsWithRules} objects` : 'None', impact: 'negative', source: 'api' });
  }
  count++;

  const avg = count > 0 ? score / count : 2;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'P2', name: 'Validation & Data Quality', layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY, status, score: Math.round(avg * 100) / 100,
    signals: itemSignals,
  };
}

/**
 * P3: Security & Access Model
 */
function gradeP3(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  // Role hierarchy
  const depth = s.role_hierarchy_depth || 0;
  if (depth >= 2 && depth <= 6) {
    score += 3;
    itemSignals.push({ name: 'Role hierarchy depth', value: `${depth} levels`, impact: 'positive', source: 'api' });
  } else if (depth >= 1) {
    score += 2;
    itemSignals.push({ name: 'Role hierarchy depth', value: `${depth} level(s)`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Role hierarchy depth', value: 'No hierarchy', impact: 'negative', source: 'api' });
  }
  count++;

  // Profile/PermSet sprawl
  const profileCount = s.profile_count || 0;
  const permSetCount = s.permission_set_count || 0;

  if (profileCount <= 15 && permSetCount <= 30) {
    score += 3;
    itemSignals.push({ name: 'Profiles / Permission Sets', value: `${profileCount} / ${permSetCount}`, impact: 'positive', source: 'api' });
  } else if (profileCount <= 30 && permSetCount <= 60) {
    score += 2;
    itemSignals.push({ name: 'Profiles / Permission Sets', value: `${profileCount} / ${permSetCount}`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Profiles / Permission Sets', value: `${profileCount} / ${permSetCount}`, impact: 'negative', source: 'api' });
  }
  count++;

  const avg = count > 0 ? score / count : 2;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'P3', name: 'Security & Access Model', layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY, status, score: Math.round(avg * 100) / 100,
    signals: itemSignals,
  };
}

/**
 * P4: Record Type & Layout Design
 */
function gradeP4(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  const rtCount = s.record_type_count || 0;
  const rtByObject = s.record_types_by_object || {};
  const maxPerObject = Math.max(0, ...Object.values(rtByObject));

  if (rtCount > 0 && maxPerObject <= 5) {
    score += 3;
    itemSignals.push({ name: 'Record types', value: `${rtCount} total (max ${maxPerObject} per object)`, impact: 'positive', source: 'api' });
  } else if (rtCount > 0 && maxPerObject <= 10) {
    score += 2;
    itemSignals.push({ name: 'Record types', value: `${rtCount} total (max ${maxPerObject} per object)`, impact: 'neutral', source: 'api' });
  } else if (rtCount === 0) {
    score += 2; // No record types is neutral
    itemSignals.push({ name: 'Record types', value: 'None', impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Record types', value: `${rtCount} total (max ${maxPerObject} per object)`, impact: 'negative', source: 'api' });
  }
  count++;

  const avg = count > 0 ? score / count : 2;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'P4', name: 'Record Type & Layout Design', layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY, status, score: Math.round(avg * 100) / 100,
    signals: itemSignals,
  };
}

/**
 * P5: Integration Footprint
 */
function gradeP5(s) {
  const itemSignals = [];
  let score = 0;
  let count = 0;

  const appCount = s.connected_app_count || 0;
  const credCount = s.named_credential_count || 0;
  const outboundFlows = s.outbound_flow_count || 0;

  // Named credentials indicate well-managed integrations
  if (credCount > 0 && appCount <= 15) {
    score += 3;
    itemSignals.push({ name: 'Integrations', value: `${appCount} apps, ${credCount} named credentials`, impact: 'positive', source: 'api' });
  } else if (appCount <= 20) {
    score += 2;
    itemSignals.push({ name: 'Integrations', value: `${appCount} apps, ${credCount} named credentials`, impact: 'neutral', source: 'api' });
  } else {
    score += 1;
    itemSignals.push({ name: 'Integrations', value: `${appCount} apps, ${credCount} named credentials`, impact: 'negative', source: 'api' });
  }
  count++;

  if (outboundFlows > 0) {
    itemSignals.push({ name: 'Outbound flows', value: `${outboundFlows}`, impact: 'neutral', source: 'api' });
  }

  const avg = count > 0 ? score / count : 2;
  const status = avg >= 2.5 ? 'healthy' : avg >= 1.5 ? 'careful' : 'warning';

  return {
    id: 'P5', name: 'Integration Footprint', layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY, status, score: Math.round(avg * 100) / 100,
    signals: itemSignals,
  };
}
```

**Step 2: Update constants.js — add SALESFORCE_LAYER_WEIGHTS**

At `lib/diagnostic-engine/constants.js:18`, add after `LAYER_WEIGHTS`:

```js
export const SALESFORCE_LAYER_WEIGHTS = {
  foundation: 0.35,
  motions: 0.30,
  maturity: 0.20,
  platformHealth: 0.15,
};
```

**Step 3: Update constants.js — add P1-P5 items**

At `lib/diagnostic-engine/constants.js:191` (after R4 definition), add:

```js
  // Platform Health (P1-P5) — Salesforce-only, API_ONLY
  {
    id: 'P1',
    name: 'Apex Code Health',
    layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY,
    weight: 1,
    serviceIds: [],
    description: 'Apex trigger count, class complexity, and code organization.',
  },
  {
    id: 'P2',
    name: 'Validation & Data Quality',
    layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY,
    weight: 1,
    serviceIds: [],
    description: 'Validation rule coverage across key objects and duplicate rules.',
  },
  {
    id: 'P3',
    name: 'Security & Access Model',
    layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY,
    weight: 1,
    serviceIds: [],
    description: 'Role hierarchy, profiles, permission sets, and sharing rules.',
  },
  {
    id: 'P4',
    name: 'Record Type & Layout Design',
    layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY,
    weight: 1,
    serviceIds: [],
    description: 'Record type usage, page layout complexity, and design intent.',
  },
  {
    id: 'P5',
    name: 'Integration Footprint',
    layer: 'platformHealth',
    source: SOURCE_TYPES.API_ONLY,
    weight: 1,
    serviceIds: [],
    description: 'Connected Apps, Named Credentials, and outbound integrations.',
  },
```

**Step 4: Commit**

```bash
git add lib/diagnostic-engine/graders/ lib/diagnostic-engine/constants.js
git commit -m "feat: add Platform Health grader (P1-P5) and Salesforce layer weights"
```

---

### Task 8: Diagnostic Engine Updates

**Files:**
- Modify: `lib/diagnostic-engine/index.js:24` (add crmType param, call gradePlatformHealth)
- Modify: `lib/diagnostic-engine/compute-scores.js:14` (support platformHealth layer)
- Modify: `lib/diagnostic-engine/generate-recommendations.js:235` (add P1-P5 recommendations)
- Modify: `pages/api/diagnostic/run.js:42-54` (detect CRM type, load SF metadata)

**Step 1: Update index.js**

Replace the `runDiagnostic` function at `lib/diagnostic-engine/index.js:24-67`:

```js
export function runDiagnostic(intakeAnswers = {}, computedSignals = {}, crmType = null) {
  const signals = computedSignals || {};
  const detectedCrmType = crmType || intakeAnswers.A1?.toLowerCase() || 'unknown';

  // Grade each layer
  const foundationItems = gradeFoundation(signals);
  const motionItems = gradeMotions(signals, intakeAnswers);
  const maturityItems = gradeMaturity(signals, intakeAnswers);

  // Salesforce-only: Platform Health layer
  let platformHealthItems = [];
  if (detectedCrmType === 'salesforce') {
    const { gradePlatformHealth } = require('./graders/platform-health');
    platformHealthItems = gradePlatformHealth(signals);
  }

  // Combine all items
  const items = [...foundationItems, ...motionItems, ...maturityItems, ...platformHealthItems];

  // Attach recommendations based on status
  attachRecommendations(items);

  // Compute composite scores
  const scores = computeScores(items, detectedCrmType);

  // Build company profile from intake
  const companyProfile = {
    crm: intakeAnswers.A1 || 'unknown',
    repCount: intakeAnswers.A2 || 'unknown',
    arrRange: intakeAnswers.A3 || 'unknown',
    gtmMotion: intakeAnswers.A4 || 'unknown',
    hasPartners: intakeAnswers.A5 !== 'No',
  };

  // Collect actionable service IDs
  const actionableServices = collectActionableServiceIds(items);

  return {
    version: 2,
    crmType: detectedCrmType,
    company_profile: companyProfile,
    items,
    scores,
    actionable_services: actionableServices,
    metadata: {
      generatedAt: new Date().toISOString(),
      apiDataAvailable: Object.keys(signals).length > 0,
      intakeCompleted: Object.keys(intakeAnswers).length > 0,
      itemCount: items.length,
      signalCount: Object.keys(signals).length,
    },
  };
}
```

**Step 2: Update compute-scores.js**

Replace `lib/diagnostic-engine/compute-scores.js:14-48`:

```js
import { STATUS_NUMERIC, LAYER_WEIGHTS, SALESFORCE_LAYER_WEIGHTS } from './constants';

export function computeScores(items, crmType = 'hubspot') {
  const layers = { foundation: [], motions: [], maturity: [] };

  // Add platformHealth layer if Salesforce
  const isSalesforce = crmType === 'salesforce';
  if (isSalesforce) {
    layers.platformHealth = [];
  }

  for (const item of items) {
    if (item.status !== 'unable' && STATUS_NUMERIC[item.status] !== undefined) {
      if (layers[item.layer]) {
        layers[item.layer].push(STATUS_NUMERIC[item.status]);
      }
    }
  }

  const foundation = average(layers.foundation);
  const motions = average(layers.motions);
  const maturity = average(layers.maturity);

  const weights = isSalesforce ? SALESFORCE_LAYER_WEIGHTS : LAYER_WEIGHTS;

  let overall = foundation * weights.foundation +
    motions * weights.motions +
    maturity * weights.maturity;

  const result = {
    foundation: round2(foundation),
    motions: round2(motions),
    maturity: round2(maturity),
    overall: 0,
    overallStatus: 'warning',
  };

  if (isSalesforce) {
    const platformHealth = average(layers.platformHealth);
    overall += platformHealth * weights.platformHealth;
    result.platformHealth = round2(platformHealth);
  }

  result.overall = round2(overall);
  result.overallStatus = overall >= 2.5 ? 'healthy' : overall >= 1.5 ? 'careful' : 'warning';

  return result;
}
```

**Step 3: Add P1-P5 recommendations to generate-recommendations.js**

Add after `R4` block at `lib/diagnostic-engine/generate-recommendations.js:234`:

```js
  P1: {
    warning: [
      'Audit Apex triggers for one-trigger-per-object pattern to avoid conflicts.',
      'Refactor large Apex classes (>500 lines) into smaller, testable units.',
    ],
    careful: [
      'Review trigger order and consider a trigger framework for maintainability.',
    ],
    healthy: [
      'Apex codebase is well-structured. Maintain code review practices.',
    ],
  },
  P2: {
    warning: [
      'Add validation rules on Opportunity, Lead, and Account to enforce data quality.',
      'Implement duplicate rules for Lead and Contact deduplication.',
    ],
    careful: [
      'Extend validation rule coverage to all key objects.',
    ],
    healthy: [
      'Validation coverage is strong. Review rules as processes evolve.',
    ],
  },
  P3: {
    warning: [
      'Build a role hierarchy reflecting your organizational structure for reporting and sharing.',
      'Consolidate excessive profiles and move to permission sets for flexibility.',
    ],
    careful: [
      'Review permission set sprawl and consolidate where possible.',
    ],
    healthy: [
      'Security model is well-designed. Audit quarterly for permission creep.',
    ],
  },
  P4: {
    warning: [
      'Audit record types for each object — remove unused types and consolidate.',
      'Review page layouts for relevance and simplify where possible.',
    ],
    careful: [
      'Document the purpose of each record type and align with business processes.',
    ],
    healthy: [
      'Record type design is intentional and well-maintained.',
    ],
  },
  P5: {
    warning: [
      'Audit connected apps and remove unused integrations for security.',
      'Migrate hardcoded credentials to Named Credentials.',
    ],
    careful: [
      'Document all active integrations and their purpose.',
    ],
    healthy: [
      'Integration footprint is well-managed with Named Credentials.',
    ],
  },
```

**Step 4: Update run.js**

Replace `pages/api/diagnostic/run.js:42-54` (the metadata fetching section in `handleRun`):

```js
    // Detect CRM type
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('crm_type')
      .eq('id', customerId)
      .single();

    const crmType = customer?.crm_type || 'unknown';
    let computedSignals = {};
    let metadataId = null;

    if (crmType === 'salesforce') {
      // Read Salesforce signals
      const { data: sfMetadata } = await supabaseAdmin
        .from('salesforce_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .single();

      computedSignals = sfMetadata?.computed_signals || {};
      metadataId = sfMetadata?.id || null;
    } else {
      // Read HubSpot signals (existing behavior)
      const { data: metadata } = await supabaseAdmin
        .from('hubspot_metadata')
        .select('id, computed_signals')
        .eq('customer_id', customerId)
        .order('downloaded_at', { ascending: false })
        .limit(1)
        .single();

      computedSignals = metadata?.computed_signals || {};
      metadataId = metadata?.id || null;
    }

    // Run the diagnostic engine
    const result = runDiagnostic(intake.answers, computedSignals, crmType);
```

Also update the upsert to include the new fields:

```js
    const { data: stored, error } = await supabaseAdmin
      .from('diagnostic_results')
      .upsert(
        {
          customer_id: customerId,
          diagnostic_type: 'gtm',
          version: 2,
          crm_type: crmType,
          items: result.items,
          scores: result.scores,
          company_profile: result.company_profile,
          metadata: result.metadata,
          intake_id: intake.id,
          hubspot_metadata_id: crmType === 'hubspot' ? metadataId : null,
          salesforce_metadata_id: crmType === 'salesforce' ? metadataId : null,
        },
        { onConflict: 'customer_id,diagnostic_type' }
      )
```

**Step 5: Commit**

```bash
git add lib/diagnostic-engine/index.js lib/diagnostic-engine/compute-scores.js lib/diagnostic-engine/generate-recommendations.js pages/api/diagnostic/run.js
git commit -m "feat: wire Salesforce into diagnostic engine with Platform Health scoring and CRM-aware run endpoint"
```

---

### Task 9: Metadata Upload Path

**Files:**
- Create: `lib/salesforce-metadata-parser.js`
- Create: `pages/api/salesforce/upload.js`

**Dependencies:** `jszip` npm package

**Step 1: Install jszip**

Run: `npm install jszip`

**Step 2: Write salesforce-metadata-parser.js**

```js
/**
 * Salesforce Metadata Parser
 *
 * Parses a Salesforce CLI metadata zip (from `sf project retrieve start`)
 * into the same JSON shape as the API downloader output. This ensures
 * signal-extractor-sf.js has a single input format.
 */

import JSZip from 'jszip';

/**
 * Parse a Salesforce metadata zip buffer into normalized metadata.
 * @param {Buffer} zipBuffer - The uploaded zip file
 * @returns {Promise<object>} Normalized metadata matching API downloader shape
 */
export async function parseMetadataZip(zipBuffer) {
  const zip = await JSZip.loadAsync(zipBuffer);
  const files = {};

  // Collect all file paths and contents
  for (const [path, entry] of Object.entries(zip.files)) {
    if (!entry.dir) {
      files[path] = await entry.async('string');
    }
  }

  // Find the root directory (force-app/main/default/ or unpackaged/)
  const root = detectRoot(Object.keys(files));

  return {
    objects: parseObjects(files, root),
    stages: { opportunityStages: [], leadStatuses: [] }, // Not available in metadata zip
    users: [], // Not available in metadata zip
    flows: parseFlows(files, root),
    workflowRules: parseWorkflowRules(files, root),
    validationRules: parseValidationRules(files, root),
    apexTriggers: parseTriggers(files, root),
    apexClasses: parseClasses(files, root),
    profiles: parseProfiles(files, root),
    permissionSets: parsePermissionSets(files, root),
    roles: parseRoles(files, root),
    reports: listByFolder(files, root, 'reports'),
    dashboards: listByFolder(files, root, 'dashboards'),
    connectedApps: listByFolder(files, root, 'connectedApps'),
    namedCredentials: listByFolder(files, root, 'namedCredentials'),
    recordTypes: extractRecordTypes(files, root),
  };
}

function detectRoot(paths) {
  for (const p of paths) {
    if (p.includes('force-app/main/default/')) return p.split('force-app/main/default/')[0] + 'force-app/main/default/';
    if (p.includes('unpackaged/')) return p.split('unpackaged/')[0] + 'unpackaged/';
  }
  return '';
}

/**
 * Parse object metadata to match describe API shape.
 */
function parseObjects(files, root) {
  const objectNames = ['Lead', 'Contact', 'Account', 'Opportunity', 'Case', 'Campaign'];
  const result = {};

  for (const objName of objectNames) {
    const fields = [];
    const prefix = `${root}objects/${objName}/fields/`;

    for (const [path, content] of Object.entries(files)) {
      if (path.startsWith(prefix) && path.endsWith('.field-meta.xml')) {
        const field = parseFieldXML(content, path);
        if (field) fields.push(field);
      }
    }

    result[objName] = { fields };
  }

  return result;
}

function parseFieldXML(xml, path) {
  const name = path.split('/').pop().replace('.field-meta.xml', '');
  const isCustom = name.endsWith('__c');
  const label = extractXMLValue(xml, 'label') || name;
  const type = extractXMLValue(xml, 'type') || 'Text';

  return { name, label, type, custom: isCustom };
}

function parseFlows(files, root) {
  const flows = [];
  const prefix = `${root}flows/`;

  for (const [path, content] of Object.entries(files)) {
    if (path.startsWith(prefix) && path.endsWith('.flow-meta.xml')) {
      const label = extractXMLValue(content, 'label') || path.split('/').pop().replace('.flow-meta.xml', '');
      const processType = extractXMLValue(content, 'processType') || '';
      const status = extractXMLValue(content, 'status') || 'Active';
      flows.push({ Label: label, ProcessType: processType, Status: status });
    }
  }

  return flows;
}

function parseWorkflowRules(files, root) {
  const rules = [];
  const prefix = `${root}workflows/`;

  for (const [path, content] of Object.entries(files)) {
    if (path.startsWith(prefix) && path.endsWith('.workflow-meta.xml')) {
      const name = path.split('/').pop().replace('.workflow-meta.xml', '');
      // Extract individual rules from workflow XML
      const ruleMatches = content.match(/<rules>[\s\S]*?<\/rules>/g) || [];
      for (const ruleXml of ruleMatches) {
        const ruleName = extractXMLValue(ruleXml, 'fullName') || name;
        const active = extractXMLValue(ruleXml, 'active');
        if (active !== 'false') {
          rules.push({ Name: ruleName, TableEnumOrId: name, Active: true });
        }
      }
    }
  }

  return rules;
}

function parseValidationRules(files, root) {
  const rules = [];

  for (const [path, content] of Object.entries(files)) {
    if (path.includes('/validationRules/') && path.endsWith('.validationRule-meta.xml')) {
      const name = extractXMLValue(content, 'fullName') || path.split('/').pop().replace('.validationRule-meta.xml', '');
      const active = extractXMLValue(content, 'active');
      const objectName = path.split('/objects/')[1]?.split('/')[0] || 'Unknown';
      if (active !== 'false') {
        rules.push({
          ValidationName: name,
          Active: true,
          EntityDefinition: { QualifiedApiName: objectName },
        });
      }
    }
  }

  return rules;
}

function parseTriggers(files, root) {
  const triggers = [];
  const prefix = `${root}triggers/`;

  for (const [path] of Object.entries(files)) {
    if (path.startsWith(prefix) && path.endsWith('.trigger-meta.xml')) {
      const name = path.split('/').pop().replace('.trigger-meta.xml', '');
      triggers.push({ Name: name, Status: 'Active' });
    }
  }

  return triggers;
}

function parseClasses(files, root) {
  const classes = [];
  const prefix = `${root}classes/`;

  for (const [path, content] of Object.entries(files)) {
    if (path.startsWith(prefix) && path.endsWith('.cls')) {
      const name = path.split('/').pop().replace('.cls', '');
      const lines = content.split('\n').filter((l) => l.trim() && !l.trim().startsWith('//')).length;
      classes.push({ Name: name, LengthWithoutComments: lines, NamespacePrefix: null });
    }
  }

  return classes;
}

function parseProfiles(files, root) {
  const items = [];
  const prefix = `${root}profiles/`;

  for (const [path] of Object.entries(files)) {
    if (path.startsWith(prefix) && path.endsWith('.profile-meta.xml')) {
      const name = path.split('/').pop().replace('.profile-meta.xml', '');
      items.push({ Name: name });
    }
  }

  return items;
}

function parsePermissionSets(files, root) {
  const items = [];
  const prefix = `${root}permissionsets/`;

  for (const [path] of Object.entries(files)) {
    if (path.startsWith(prefix) && path.endsWith('.permissionset-meta.xml')) {
      const name = path.split('/').pop().replace('.permissionset-meta.xml', '');
      items.push({ Label: name, IsCustom: true });
    }
  }

  return items;
}

function parseRoles(files, root) {
  const items = [];
  const prefix = `${root}roles/`;

  for (const [path, content] of Object.entries(files)) {
    if (path.startsWith(prefix) && path.endsWith('.role-meta.xml')) {
      const name = path.split('/').pop().replace('.role-meta.xml', '');
      const parentRole = extractXMLValue(content, 'parentRole');
      items.push({ Id: name, DeveloperName: name, ParentRoleId: parentRole || null });
    }
  }

  return items;
}

function listByFolder(files, root, folder) {
  const items = [];
  const prefix = `${root}${folder}/`;

  for (const [path] of Object.entries(files)) {
    if (path.startsWith(prefix)) {
      const name = path.replace(prefix, '').split('/')[0];
      if (!items.some((i) => i.Name === name)) {
        items.push({ Name: name, Id: name });
      }
    }
  }

  return items;
}

function extractRecordTypes(files, root) {
  const counts = {};

  for (const [path] of Object.entries(files)) {
    if (path.includes('/recordTypes/') && path.endsWith('.recordType-meta.xml')) {
      const objectName = path.split('/objects/')[1]?.split('/')[0] || 'Unknown';
      counts[objectName] = (counts[objectName] || 0) + 1;
    }
  }

  return Object.entries(counts).map(([obj, cnt]) => ({ SobjectType: obj, cnt }));
}

/**
 * Simple XML value extractor (no full parser needed for metadata XML).
 */
function extractXMLValue(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return match ? match[1] : null;
}
```

**Step 3: Write upload.js**

```js
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
```

**Step 4: Install formidable if not present**

Run: `npm install formidable`

**Step 5: Commit**

```bash
git add lib/salesforce-metadata-parser.js pages/api/salesforce/upload.js package.json package-lock.json
git commit -m "feat: add Salesforce metadata zip upload path with XML parser"
```

---

### Task 10: SalesforceConnect UI Component

**Files:**
- Create: `components/diagnostic-intake/SalesforceConnect.js`

**Reference:** `components/diagnostic-intake/HubSpotConnect.js`

**Step 1: Write SalesforceConnect.js**

```js
/**
 * SalesforceConnect — OAuth button + metadata zip upload + connection status
 */

import { useState, useRef } from 'react';

export default function SalesforceConnect({ customerId, slug, status, onSaveAllAnswers }) {
  const [isSandbox, setIsSandbox] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [savingForOAuth, setSavingForOAuth] = useState(false);
  const fileInputRef = useRef(null);

  const isConnected = status?.connected;

  if (isConnected) {
    return (
      <div style={styles.connectedBanner}>
        <div style={styles.connectedIcon}>&#10003;</div>
        <div>
          <div style={styles.connectedTitle}>Salesforce Connected</div>
          <div style={styles.connectedDetail}>
            {status.instanceUrl || status.orgId}
            {status.isSandbox && ' (Sandbox)'}
            {status.signalsReady && ' — CRM data downloaded'}
            {status.source === 'upload' && ' — via metadata upload'}
          </div>
        </div>
      </div>
    );
  }

  const handleConnectOAuth = async () => {
    setSavingForOAuth(true);
    try {
      if (onSaveAllAnswers) await onSaveAllAnswers();
      window.location.href = `/api/salesforce/authorize?customerId=${customerId}&slug=${slug}&sandbox=${isSandbox}`;
    } catch {
      setSavingForOAuth(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      if (onSaveAllAnswers) await onSaveAllAnswers();

      const formData = new FormData();
      formData.append('customerId', customerId);
      formData.append('file', file);

      const res = await fetch('/api/salesforce/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }

      setUploadSuccess(true);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <div style={styles.connectedBanner}>
        <div style={styles.connectedIcon}>&#10003;</div>
        <div>
          <div style={styles.connectedTitle}>Salesforce Metadata Uploaded</div>
          <div style={styles.connectedDetail}>CRM metadata processed successfully</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.connectBanner}>
      {/* OAuth path */}
      <div style={styles.oauthSection}>
        <div style={styles.connectTitle}>Connect Salesforce</div>
        <div style={styles.connectDesc}>
          Log in to the customer&apos;s Salesforce org to automatically pull CRM metadata.
        </div>
        <div style={styles.oauthRow}>
          <button
            onClick={handleConnectOAuth}
            disabled={savingForOAuth}
            style={{ ...styles.connectBtn, opacity: savingForOAuth ? 0.6 : 1 }}
          >
            {savingForOAuth ? 'Saving...' : 'Connect via OAuth'}
          </button>
          <label style={styles.sandboxToggle}>
            <input
              type="checkbox"
              checked={isSandbox}
              onChange={(e) => setIsSandbox(e.target.checked)}
              style={styles.checkbox}
            />
            <span style={styles.sandboxLabel}>Sandbox</span>
          </label>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider}>
        <span style={styles.dividerText}>or</span>
      </div>

      {/* Upload path */}
      <div style={styles.uploadSection}>
        <div style={styles.uploadTitle}>Upload Metadata Export</div>
        <div
          style={styles.dropzone}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileUpload({ target: { files: [file] } });
          }}
        >
          {uploading ? (
            <span>Processing metadata...</span>
          ) : (
            <span>Drag &amp; drop metadata zip here, or click to browse</span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

        {uploadError && (
          <div style={styles.uploadError}>{uploadError}</div>
        )}

        {/* Instructions toggle */}
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          style={styles.instructionsToggle}
        >
          {showInstructions ? 'Hide' : 'How to export metadata'}
        </button>

        {showInstructions && (
          <div style={styles.instructions}>
            <ol style={styles.instructionsList}>
              <li>Install the Salesforce CLI: <a href="https://developer.salesforce.com/tools/salesforcecli" target="_blank" rel="noopener noreferrer" style={styles.link}>developer.salesforce.com/tools/salesforcecli</a></li>
              <li>Authenticate to the customer org:<br />
                <code style={styles.code}>sf org login web --alias customer-org</code>
              </li>
              <li>Retrieve metadata:<br />
                <code style={styles.code}>
                  sf project retrieve start \<br />
                  &nbsp;&nbsp;--metadata CustomObject,CustomField,Flow,WorkflowRule,ValidationRule \<br />
                  &nbsp;&nbsp;--metadata ApexTrigger,ApexClass,Profile,PermissionSet \<br />
                  &nbsp;&nbsp;--metadata Role,DuplicateRule,ConnectedApp,NamedCredential \<br />
                  &nbsp;&nbsp;--metadata Layout,RecordType,Report,Dashboard \<br />
                  &nbsp;&nbsp;--target-org customer-org
                </code>
              </li>
              <li>Upload the resulting zip file above.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  connectedBanner: {
    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem',
    background: 'var(--status-healthy-bg)', border: '1px solid var(--status-healthy)',
    borderRadius: 'var(--radius-md, 8px)', marginBottom: '0.75rem',
  },
  connectedIcon: {
    width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--status-healthy)',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 'bold', fontSize: 'var(--text-sm)', flexShrink: 0,
  },
  connectedTitle: {
    fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--status-healthy-text)',
  },
  connectedDetail: {
    fontSize: 'var(--text-xs)', color: 'var(--status-healthy-text)', opacity: 0.8,
  },
  connectBanner: {
    padding: '1.25rem', background: '#EFF6FF', border: '1px solid #93C5FD',
    borderRadius: 'var(--radius-md, 8px)', marginBottom: '0.75rem',
  },
  oauthSection: { marginBottom: '1rem' },
  connectTitle: {
    fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: '#1E40AF',
  },
  connectDesc: {
    fontSize: 'var(--text-xs)', color: '#1E40AF', opacity: 0.8, marginTop: '0.25rem', marginBottom: '0.75rem',
  },
  oauthRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
  connectBtn: {
    padding: '0.5rem 1.25rem', background: '#0B5CAB', color: 'white', border: 'none',
    borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)', cursor: 'pointer',
  },
  sandboxToggle: { display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' },
  checkbox: { cursor: 'pointer' },
  sandboxLabel: { fontSize: 'var(--text-xs)', color: '#1E40AF' },
  divider: {
    textAlign: 'center', margin: '1rem 0', borderTop: '1px solid #BFDBFE', position: 'relative',
  },
  dividerText: {
    position: 'relative', top: '-0.6rem', background: '#EFF6FF', padding: '0 0.75rem',
    fontSize: 'var(--text-xs)', color: '#6B7280',
  },
  uploadSection: {},
  uploadTitle: {
    fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: '#1E40AF', marginBottom: '0.5rem',
  },
  dropzone: {
    border: '2px dashed #93C5FD', borderRadius: 'var(--radius-md, 8px)', padding: '1.5rem',
    textAlign: 'center', cursor: 'pointer', fontSize: 'var(--text-xs)', color: '#6B7280',
    transition: 'border-color 0.2s',
  },
  uploadError: {
    fontSize: 'var(--text-xs)', color: '#991b1b', marginTop: '0.5rem',
  },
  instructionsToggle: {
    background: 'none', border: 'none', fontSize: 'var(--text-xs)', color: '#1E40AF',
    cursor: 'pointer', textDecoration: 'underline', marginTop: '0.75rem', padding: 0,
  },
  instructions: {
    marginTop: '0.75rem', padding: '1rem', background: 'white',
    borderRadius: 'var(--radius-md, 8px)', border: '1px solid #DBEAFE',
  },
  instructionsList: {
    margin: 0, paddingLeft: '1.25rem', fontSize: 'var(--text-xs)', color: '#374151',
    lineHeight: 1.8,
  },
  code: {
    display: 'block', background: '#F3F4F6', padding: '0.5rem', borderRadius: '4px',
    fontSize: 'var(--text-xs)', fontFamily: 'monospace', marginTop: '0.25rem',
    overflowX: 'auto', whiteSpace: 'pre',
  },
  link: { color: '#1E40AF' },
};
```

**Step 2: Commit**

```bash
git add components/diagnostic-intake/SalesforceConnect.js
git commit -m "feat: add SalesforceConnect component with OAuth + upload dropzone"
```

---

### Task 11: Intake Form Integration

**Files:**
- Modify: `components/diagnostic-intake/IntakeForm.js:39-40,62-97,290-303`
- Modify: `components/diagnostic-intake/IntakeReview.js:8-12,72-104`

**Step 1: Update IntakeForm.js — add Salesforce state**

At `IntakeForm.js:39-40`, add Salesforce state alongside HubSpot:

```js
  const [hubspotStatus, setHubspotStatus] = useState(null);
  const [hubspotError, setHubspotError] = useState(null);
  const [salesforceStatus, setSalesforceStatus] = useState(null);
  const [salesforceError, setSalesforceError] = useState(null);
```

**Step 2: Update IntakeForm.js — load Salesforce status on mount**

At `IntakeForm.js:62-82`, after the HubSpot status check, add Salesforce:

```js
            // If returning from OAuth, jump to review section
            if (router.query.hubspot || router.query.salesforce) {
              setCurrentSection('review');
            }
```

And after the HubSpot status load (line 69-73):

```js
        // Load Salesforce status
        const sfRes = await fetch(`/api/salesforce/status/${customer.id}`);
        if (sfRes.ok) {
          const sfData = await sfRes.json();
          setSalesforceStatus(sfData);
        }
```

**Step 3: Update IntakeForm.js — handle Salesforce callback params**

At `IntakeForm.js:84-98`, extend the useEffect:

```js
  useEffect(() => {
    const { hubspot, portalName, reason, salesforce, orgName } = router.query;
    if (hubspot === 'connected') {
      setHubspotStatus((prev) => ({ ...prev, connected: true, portalName: portalName || prev?.portalName, signalsReady: true }));
      setHubspotError(null);
    } else if (hubspot === 'error') {
      setHubspotError(reason || 'HubSpot connection failed.');
    }
    if (salesforce === 'connected') {
      setSalesforceStatus((prev) => ({ ...prev, connected: true, signalsReady: true }));
      setSalesforceError(null);
    } else if (salesforce === 'error') {
      setSalesforceError(reason || 'Salesforce connection failed. Please try again.');
    }
  }, [router.query]);
```

**Step 4: Update IntakeForm.js — pass Salesforce props to IntakeReview**

At `IntakeForm.js:290-303`, add Salesforce props:

```js
            <IntakeReview
              answers={answers}
              sectionTitles={SECTION_TITLES}
              hubspotStatus={hubspotStatus}
              showHubSpotConnect={skipRules.showHubSpotConnect}
              salesforceStatus={salesforceStatus}
              showSalesforceConnect={skipRules.showSalesforceConnect}
              customerId={customer?.id}
              slug={customer?.slug}
              onSaveAllAnswers={() => saveSection('review', answers)}
              onSubmit={handleSubmit}
              onBack={handleBack}
              onEditSection={setCurrentSection}
              submitting={submitting}
            />
```

**Step 5: Add Salesforce error banner**

After the HubSpot error banner (line 232-237):

```js
      {salesforceError && (
        <div style={salesforceErrorBannerStyle}>
          <span>{salesforceError}</span>
          <button onClick={() => setSalesforceError(null)} style={errorDismissStyle}>&times;</button>
        </div>
      )}
```

And add the style at the bottom:

```js
const salesforceErrorBannerStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '0.75rem 1rem', background: '#EFF6FF', border: '1px solid #93C5FD',
  borderRadius: 'var(--radius-md, 8px)', marginBottom: '1rem',
  fontSize: 'var(--text-sm)', color: '#1E40AF',
};
```

**Step 6: Update IntakeReview.js — add Salesforce support**

Update props at `IntakeReview.js:8-12`:

```js
export default function IntakeReview({
  answers, sectionTitles, hubspotStatus,
  showHubSpotConnect, salesforceStatus, showSalesforceConnect,
  customerId, slug, onSaveAllAnswers,
  onSubmit, onBack, onEditSection, submitting,
}) {
```

Add import at top:

```js
import SalesforceConnect from './SalesforceConnect';
```

After the HubSpot connection block (line 72-104), add:

```js
      {/* Salesforce connection */}
      {showSalesforceConnect && (
        <SalesforceConnect
          customerId={customerId}
          slug={slug}
          status={salesforceStatus}
          onSaveAllAnswers={onSaveAllAnswers}
        />
      )}
```

**Step 7: Commit**

```bash
git add components/diagnostic-intake/IntakeForm.js components/diagnostic-intake/IntakeReview.js
git commit -m "feat: wire SalesforceConnect into intake form with OAuth callback and status handling"
```

---

### Task 12: Results UI Updates

**Files:**
- Modify: `components/diagnostic/LayerView.js:15`
- Modify: `components/diagnostic/LayerHeader.js:19-29`
- Modify: `components/diagnostic/DiagnosticSummary.js:23-27`

**Step 1: Update LayerView.js — dynamic layer order**

Replace `LayerView.js:15`:

```js
const LAYER_ORDER = ['foundation', 'motions', 'maturity', 'platformHealth'];
```

The existing filter logic `items.filter((it) => it.layer === layer)` will naturally produce an empty array for `platformHealth` when it doesn't exist, and `layerGroups` will have 0 items for it. Add a filter to exclude empty layers:

At `LayerView.js:43-47`, update:

```js
  const layerGroups = LAYER_ORDER
    .map((layer) => ({
      layer,
      items: items.filter((it) => it.layer === layer),
      score: scores[layer] ?? 0,
    }))
    .filter(({ items: layerItems }) => layerItems.length > 0);
```

**Step 2: Update LayerHeader.js — add platformHealth labels**

At `LayerHeader.js:19-29`:

```js
const LAYER_LABELS = {
  foundation: 'Foundation',
  motions: 'Motions',
  maturity: 'Maturity',
  platformHealth: 'Platform Health',
};

const LAYER_DESCRIPTIONS = {
  foundation: 'CRM infrastructure, data model, and automation backbone',
  motions: 'Go-to-market motions, lead flow, and execution processes',
  maturity: 'Reporting maturity, forecasting, and revenue metrics',
  platformHealth: 'Salesforce platform configuration, code health, and security',
};
```

**Step 3: Update DiagnosticSummary.js — dynamic layer cards**

Replace `DiagnosticSummary.js:23-27`:

```js
  const layers = [
    { key: 'foundation', label: 'Foundation', weight: scores.platformHealth !== undefined ? '35%' : '40%', score: scores.foundation },
    { key: 'motions', label: 'Motions', weight: scores.platformHealth !== undefined ? '30%' : '35%', score: scores.motions },
    { key: 'maturity', label: 'Maturity', weight: scores.platformHealth !== undefined ? '20%' : '25%', score: scores.maturity },
    ...(scores.platformHealth !== undefined ? [
      { key: 'platformHealth', label: 'Platform Health', weight: '15%', score: scores.platformHealth },
    ] : []),
  ];
```

Update the grid at `DiagnosticSummary.js:102`:

```js
  layerGrid: {
    display: 'grid',
    gridTemplateColumns: `repeat(${scores?.platformHealth !== undefined ? 4 : 3}, 1fr)`,
    gap: '1rem',
    marginBottom: '1rem',
  },
```

Wait — since `scores` is a prop, we can't use it in the static styles object. Instead, use inline style:

```js
      <div style={{ ...styles.layerGrid, gridTemplateColumns: `repeat(${layers.length}, 1fr)` }}>
```

**Step 4: Commit**

```bash
git add components/diagnostic/LayerView.js components/diagnostic/LayerHeader.js components/diagnostic/DiagnosticSummary.js
git commit -m "feat: update results UI to render 4-layer Salesforce diagnostics dynamically"
```

---

### Task 13: Intake Waiting State

**Files:**
- Modify: `components/diagnostic-intake/IntakeForm.js:150-188` (handleSubmit)
- Modify: `pages/api/diagnostic/intake.js` (save status)

**Step 1: Update handleSubmit in IntakeForm.js**

Replace the `handleSubmit` callback at `IntakeForm.js:150-188`:

```js
  const handleSubmit = useCallback(async () => {
    if (isDemo || !customer?.id) return;
    setSubmitting(true);
    setError(null);

    try {
      // Check if CRM is connected
      const crmType = answers.A1;
      const crmConnected =
        (crmType === 'HubSpot' && hubspotStatus?.connected) ||
        (crmType === 'Salesforce' && salesforceStatus?.connected);

      // Save intake with appropriate status
      const status = crmConnected ? 'complete' : 'awaiting_crm_data';

      const saveRes = await fetch('/api/diagnostic/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          answers,
          submitted: true,
          status,
        }),
      });
      if (!saveRes.ok) throw new Error('Failed to save intake answers');

      if (!crmConnected) {
        // Stay on review page — show waiting state
        setError(null);
        setSubmitting(false);
        return;
      }

      // Run the diagnostic engine
      const runRes = await fetch('/api/diagnostic/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customer.id }),
      });

      if (!runRes.ok) {
        const errData = await runRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Diagnostic engine failed');
      }

      // Navigate to results
      router.push(customerPath('/try-leanscale/diagnostic?view=layers'));
    } catch (err) {
      console.error('Error submitting diagnostic:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [customer?.id, isDemo, answers, customerPath, router, hubspotStatus, salesforceStatus]);
```

**Step 2: Update intake API to accept status**

In `pages/api/diagnostic/intake.js`, update the POST handler to accept and store the `status` field from the request body. Add `status: body.status || undefined` to the upsert payload (only if provided).

**Step 3: Commit**

```bash
git add components/diagnostic-intake/IntakeForm.js pages/api/diagnostic/intake.js
git commit -m "feat: add waiting state when CRM not connected at intake submission"
```

---

### Task 14: Final Integration Test

**Step 1: Verify all files created**

Run: `ls -la lib/salesforce*.js lib/diagnostic-engine/signal-extractor-sf.js lib/diagnostic-engine/graders/platform-health.js pages/api/salesforce/ components/diagnostic-intake/SalesforceConnect.js`

Expected: All files exist.

**Step 2: Run dev server**

Run: `npm run dev`
Expected: No import/syntax errors on startup.

**Step 3: Manual test flow**

1. Navigate to `/c/demo/diagnostic/intake`
2. Select `A1 = Salesforce` in Section A
3. Complete all sections through to Review
4. Verify SalesforceConnect component appears with OAuth button + upload dropzone
5. Verify "Run Diagnostic" without CRM data sets waiting state

**Step 4: Commit all changes**

```bash
git add -A
git commit -m "feat: complete Salesforce diagnostic integration"
```
