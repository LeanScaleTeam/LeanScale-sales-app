# Salesforce Diagnostic — Deployment & Implementation Guide

## Overview

This guide covers everything needed to deploy the Salesforce diagnostic feature: creating the Connected App in Salesforce, running database migrations, configuring environment variables, and verifying the end-to-end flow.

---

## 1. Salesforce Connected App Setup

The Connected App lives in **LeanScale's primary Salesforce org** (not the customer's). Customers authenticate via OAuth — no app installation required on their side.

### Create the Connected App

1. Log in to **LeanScale's Salesforce org** (production)
2. Navigate to: **Setup > App Manager > New Connected App**
3. Fill in:

| Field | Value |
|-------|-------|
| Connected App Name | `LeanScale GTM Diagnostic` |
| API Name | `LeanScale_GTM_Diagnostic` |
| Contact Email | ops@leanscale.com (or team DL) |
| Enable OAuth Settings | Checked |
| Callback URL | `https://clients.leanscale.team/api/salesforce/callback` |
| Selected OAuth Scopes | `Access and manage your data (api)` |
| | `Perform requests at any time (refresh_token, offline_access)` |
| Require Secret for Web Server Flow | Checked |
| Require Secret for Refresh Token Flow | Checked |

4. Click **Save**, then **Continue**

5. After saving, go to **Manage Consumer Details** (you may need to verify via email)

6. Copy these values — you'll need them for environment variables:
   - **Consumer Key** → `SALESFORCE_CLIENT_ID`
   - **Consumer Secret** → `SALESFORCE_CLIENT_SECRET`

### Connected App Policies (recommended)

After creating the app, go to **Manage** on the Connected App:

| Policy | Setting |
|--------|---------|
| Permitted Users | All users may self-authorize |
| IP Relaxation | Relax IP restrictions |
| Refresh Token Policy | Refresh token is valid until revoked |

> **Why "All users may self-authorize"?** LeanScale consultants authenticate on behalf of customer orgs. The customer's Salesforce admin grants access via the OAuth consent screen — no pre-approval or app install needed.

### Add Sandbox Callback URL (optional)

If you want to support sandbox orgs during testing, add a second callback URL:

1. Edit the Connected App
2. Add to Callback URL (one per line):
   ```
   https://clients.leanscale.team/api/salesforce/callback
   http://localhost:3000/api/salesforce/callback
   ```

The app automatically routes sandbox auth through `test.salesforce.com` — the callback URL is the same for both.

---

## 2. Supabase Database Migration

### Run the migration

The migration file is at `supabase/migrations/009_salesforce_diagnostic.sql`.

**Option A: Supabase CLI** (recommended)
```bash
supabase db push
```

**Option B: Supabase Dashboard**
1. Go to Supabase Dashboard > SQL Editor
2. Paste the contents of `009_salesforce_diagnostic.sql`
3. Run

### What the migration creates

| Object | Type | Purpose |
|--------|------|---------|
| `salesforce_connections` | Table | OAuth tokens per customer/org |
| `salesforce_metadata` | Table | Raw API downloads + computed signals (20 JSONB columns) |
| `diagnostic_intake.status` | Column | Tracks `in_progress` → `awaiting_crm_data` → `complete` |
| `diagnostic_results.salesforce_metadata_id` | Column | FK linking result to metadata source |
| `diagnostic_results.crm_type` | Column | `'salesforce'`, `'hubspot'`, or `'unknown'` |

### Verify migration success

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('salesforce_connections', 'salesforce_metadata');

-- Check new columns on existing tables
SELECT column_name FROM information_schema.columns
WHERE table_name = 'diagnostic_intake' AND column_name = 'status';

SELECT column_name FROM information_schema.columns
WHERE table_name = 'diagnostic_results'
AND column_name IN ('salesforce_metadata_id', 'crm_type');
```

All queries should return results.

---

## 3. Environment Variables

Add these three variables to your deployment environment (Netlify, .env.local, etc.):

```bash
# From the Connected App created in Step 1
SALESFORCE_CLIENT_ID=<Consumer Key from Connected App>
SALESFORCE_CLIENT_SECRET=<Consumer Secret from Connected App>

# Must match exactly what's in the Connected App callback URL
SALESFORCE_REDIRECT_URI=https://clients.leanscale.team/api/salesforce/callback
```

### Per-environment values

| Environment | `SALESFORCE_REDIRECT_URI` |
|-------------|--------------------------|
| Production | `https://clients.leanscale.team/api/salesforce/callback` |
| Local dev | `http://localhost:3000/api/salesforce/callback` |

> The `CLIENT_ID` and `CLIENT_SECRET` are the same across all environments — they come from the single Connected App in LeanScale's org.

### Netlify deployment

Add via **Site settings > Environment variables** in the Netlify dashboard, or via CLI:

```bash
netlify env:set SALESFORCE_CLIENT_ID <value>
netlify env:set SALESFORCE_CLIENT_SECRET <value>
netlify env:set SALESFORCE_REDIRECT_URI https://clients.leanscale.team/api/salesforce/callback
```

All env vars in Netlify are server-only by default (never exposed to browser). Do not prefix with `NEXT_PUBLIC_`.

---

## 4. How It Works — End-to-End Flow

### Path A: OAuth (primary)

```
Consultant opens intake form
  → Selects "Salesforce" as CRM (question A1)
  → Completes all sections (A, B, C, D)
  → Arrives at Review step
  → Clicks "Connect Salesforce" button
  → Redirected to Salesforce OAuth consent screen
  → Consultant logs in with customer org credentials
  → Salesforce redirects back to /api/salesforce/callback
  → App exchanges code for tokens (PKCE + client secret)
  → App downloads metadata from 28 API endpoints in parallel
    (6 object describes, 11 core SOQL/Tooling, 7 v3 expansion, 5 activity/content)
  → App extracts diagnostic signals (v3 signal extractor)
  → If intake was submitted → auto-runs diagnostic engine
  → Consultant redirected to intake form with success banner
```

#### OAuth Troubleshooting: OAUTH_AUTHORIZATION_BLOCKED

This error means the **customer's Salesforce org** is blocking third-party OAuth apps. The Connected App lives in LeanScale's org, so it won't appear in the customer's org until they successfully authorize.

**Fix (customer admin must do this):**

1. **Setup → Identity → OAuth and OpenID Connect Settings**
   - Enable **"Allow Authorization Code and Credentials Flows"**
   - This is org-wide but safe — users still must explicitly consent
   - Can be turned back OFF after the OAuth flow completes (existing tokens continue to work)

2. If the app appears in **Setup → Security → Connected Apps OAuth Usage** with "Block" status → click **Unblock**

3. Check **Setup → Security → Session Settings** — "Lock sessions to the domain in which they were first used" can block cross-domain OAuth redirects

### Path B: CLI Extraction Script (recommended fallback)

When OAuth isn't possible (e.g., org blocks third-party OAuth, security restrictions, no admin access), use the CLI extraction script. This runs the **same 28 SOQL/Tooling/Describe queries** as the OAuth downloader, producing identical data quality.

#### Prerequisites

- [Salesforce CLI v2 (sf)](https://developer.salesforce.com/tools/salesforcecli) — `npm install -g @salesforce/cli` or `brew install sf`
- [jq](https://jqlang.github.io/jq/download/) — `brew install jq` (macOS) or `apt-get install jq` (Linux)

#### Steps

```bash
# 1. Authenticate to the customer org (opens browser for login)
sf org login web --alias customer-org

# 2. Run the extraction script (takes 1-2 minutes)
./scripts/sf-extract.sh customer-org

# 3. Upload the output file
#    Option A: Drag & drop sf-extract-output.json on the intake page upload zone
#    Option B: Via curl (replace CUSTOMER_ID with the UUID from the intake URL)
jq '. + {customerId: "CUSTOMER_ID"}' sf-extract-output.json | \
  curl -X POST https://clients.leanscale.team/api/salesforce/upload-json \
    -H 'Content-Type: application/json' -d @-
```

The script outputs a `sf-extract-output.json` file (typically 1-5MB) containing all metadata in the format expected by the upload-json endpoint. Upload it as a `.json` file — the intake page auto-detects JSON vs ZIP.

#### What the script extracts

| Category | Queries | Data |
|----------|---------|------|
| Object Describes | 6 | Lead, Contact, Account, Opportunity, Case, Campaign field definitions |
| Core SOQL | 5 | OpportunityStage, LeadStatus, User, UserRole, RecordType |
| Core Tooling | 6 | Flow, WorkflowRule, ValidationRule, ApexTrigger, ApexClass, Profile, PermissionSet |
| Inventory | 4 | Report, Dashboard, ConnectedApp, NamedCredential |
| v3 Expansion | 7 | Campaign, InstalledPackage, Territory, ForecastingType, DuplicateRule, ReportSchedule, EmailTemplate |
| Activity & Content | 5 | Task aggregates, Event patterns, ContentVersion, KnowledgeArticle, CampaignMember count |

Optional queries (v3 expansion, activity) degrade gracefully — if a feature isn't enabled in the org, the script returns `[]` and continues.

### Path C: XML Metadata ZIP Upload (minimal fallback)

If the CLI extraction script can't run (e.g., no `jq`, restricted environment), the XML metadata retrieve path works but captures **less data** — no stages, users, campaigns, activity data, or installed packages.

```bash
# 1. Authenticate
sf org login web --alias customer-org

# 2. Create a project (required by sf project retrieve)
sf project generate --name sf-extract
cd sf-extract

# 3. Retrieve metadata
sf project retrieve start \
  --metadata CustomObject,CustomField,Flow,WorkflowRule,ValidationRule \
  --metadata ApexTrigger,ApexClass,Profile,PermissionSet \
  --metadata Role,DuplicateRule,ConnectedApp,NamedCredential \
  --metadata Layout,RecordType,Report,Dashboard \
  --target-org customer-org

# 4. The output is in force-app/ — zip it and upload on the intake page
zip -r sf-metadata.zip force-app/
```

Upload the `.zip` file on the intake page. The app parses XML into JSON and extracts what signals it can.

### Waiting State

If the consultant submits the intake form **before** connecting CRM:
- Intake is saved with `status = 'awaiting_crm_data'`
- When CRM data arrives later (OAuth, CLI JSON, or ZIP upload), the diagnostic auto-runs
- No manual re-submission needed

---

## 5. API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/salesforce/authorize?customerId=X&slug=Y&sandbox=false` | Start OAuth flow |
| GET | `/api/salesforce/callback?code=X&state=Y` | Handle OAuth callback |
| GET | `/api/salesforce/status/{customerId}` | Check connection status |
| POST | `/api/salesforce/upload` | Upload metadata ZIP (multipart, 50MB max) |
| POST | `/api/salesforce/upload-json` | Upload CLI extraction JSON (10MB max) |

### Status endpoint response

```json
{
  "connected": true,
  "orgId": "00D5f000000XXXX",
  "instanceUrl": "https://na1.salesforce.com",
  "isSandbox": false,
  "signalsReady": true,
  "connectedAt": "2026-02-25T15:30:00.000Z"
}
```

---

## 6. Salesforce API Scopes & Data Accessed

The Connected App requests minimal scopes. Here's exactly what the downloader reads (28 queries total):

### REST API (Object Describes) — 6 queries
- Lead, Contact, Account, Opportunity, Case, Campaign
- Reads: field definitions, picklist values, record type info

### Core SOQL Queries — 5 queries
- `OpportunityStage` — pipeline stage names, probabilities
- `LeadStatus` — lead lifecycle stages
- `User WHERE IsActive = true` — active user list with profiles/roles
- `UserRole` — role hierarchy
- `RecordType WHERE IsActive = true` — record type inventory

### Core Tooling API — 6 queries
- `Flow WHERE Status = 'Active'` — active automation flows
- `WorkflowRule` — legacy workflow rules
- `ValidationRule WHERE Active = true` — validation rules by object
- `ApexTrigger` — custom code triggers
- `ApexClass WHERE NamespacePrefix = null` — custom Apex classes
- `Profile` / `PermissionSet` — security model

### Inventory Queries — 4 queries
- `Report LIMIT 200` — report inventory
- `Dashboard LIMIT 200` — dashboard inventory
- `ConnectedApplication` — integration inventory
- `NamedCredential` — integration credentials

### v3 Expansion Queries — 7 queries (optional, degrade gracefully)
- `Campaign WHERE IsActive = true` — marketing campaign inventory
- `InstalledSubscriberPackage` — installed AppExchange packages
- `Territory2Model WHERE State = 'Active'` — territory management
- `ForecastingType WHERE IsActive = true` — forecasting configuration
- `DuplicateRule WHERE IsActive = true` — dedup rules
- `CronTrigger` (report schedules) — scheduled report inventory
- `EmailTemplate WHERE IsActive = true` — email template count

### Activity & Content Queries — 5 queries (optional, degrade gracefully)
- `Task GROUP BY Status` (last 90 days) — task completion patterns
- `Event WHERE IsRecurrence = true` (last 90 days) — recurring meeting patterns
- `ContentVersion` (latest 100) — content library inventory
- `KnowledgeArticleVersion` (published) — knowledge base inventory
- `CampaignMember` count — marketing engagement volume

> **No data records are read.** Only metadata, configuration, and aggregate counts. No contact names, deal amounts, email content, etc.

---

## 7. Diagnostic Output

### 4-Layer Scoring (Salesforce only)

| Layer | Weight | Items |
|-------|--------|-------|
| Foundation | 35% | F1-F5 (data architecture, pipeline, lifecycle, enrichment, dedup) |
| Motions | 30% | M1-M7 (lead routing, nurture, outbound, forms, marketing, BDR, handoff) |
| Maturity | 20% | R1-R5 (reporting, dashboards, attribution, data quality, forecasting) |
| Platform Health | 15% | P1-P5 (Apex health, validation, security, record types, integrations) |

### Platform Health Items (P1-P5)

| ID | Item | Healthy (3) | Careful (2) | Warning (1) |
|----|------|-------------|-------------|-------------|
| P1 | Apex Code Health | < 20 triggers, clean class structure | 20-50 triggers, moderate complexity | 50+ triggers, high LOC |
| P2 | Validation & Data Quality | Rules on 4+ key objects, 10+ rules | Partial coverage | Minimal/no validation |
| P3 | Security & Access Model | Role hierarchy depth 2-6, < 15 profiles | Some sprawl | Excessive profiles, flat hierarchy |
| P4 | Record Type & Layout Design | Purposeful record types, < 5 per object | Some unused | Excessive or zero record types |
| P5 | Integration Footprint | Named credentials used, < 15 apps | Mix of managed/unmanaged | No credentials, excessive apps |

---

## 8. Testing Checklist

### Pre-deploy verification
- [ ] `npm run build` passes (confirmed — zero errors)
- [ ] Migration SQL is syntactically valid
- [ ] Environment variables set in deployment target

### Post-deploy verification
- [ ] Migration applied — tables exist in Supabase
- [ ] Visit intake form, select Salesforce as CRM
- [ ] Complete form, reach Review step
- [ ] SalesforceConnect component renders (OAuth button + upload area)
- [ ] Click "Connect Salesforce" — redirects to Salesforce OAuth
- [ ] After consent — redirects back with `?salesforce=connected`
- [ ] Status endpoint returns `{ connected: true, signalsReady: true }`
- [ ] Run diagnostic — results show 4 layers including Platform Health
- [ ] Existing HubSpot diagnostics still work (3 layers, unchanged)

### Upload path verification
- [ ] Export metadata via `sf project retrieve start`
- [ ] Upload ZIP on Review step
- [ ] Metadata parsed and signals extracted
- [ ] Diagnostic results show Platform Health layer

### Waiting state verification
- [ ] Submit intake without CRM connected → status = `awaiting_crm_data`
- [ ] Connect CRM after submission → diagnostic auto-runs
- [ ] Results available without re-submitting the form

---

## 9. Troubleshooting

### OAuth errors

| Error | Cause | Fix |
|-------|-------|-----|
| `OAUTH_AUTHORIZATION_BLOCKED` | Customer org blocks third-party OAuth apps | See "OAuth Troubleshooting" in Section 4 — toggle org-wide OAuth setting or use CLI extraction |
| `redirect_uri_mismatch` | Callback URL doesn't match Connected App | Verify `SALESFORCE_REDIRECT_URI` matches exactly (including protocol) |
| `invalid_client_id` | Wrong Consumer Key | Check `SALESFORCE_CLIENT_ID` env var |
| `invalid_grant` | Code expired or already used | Retry the OAuth flow from the beginning |
| `INSUFFICIENT_ACCESS` | Missing API scope | Verify Connected App has `api` and `refresh_token` scopes |

### Metadata download failures

The downloader tracks per-API-family status in `salesforce_metadata.fetch_status`:

```json
{
  "objects": "ok",
  "stages": "ok",
  "users": "ok",
  "flows": "error:INSUFFICIENT_ACCESS",
  "workflowRules": "ok"
}
```

Partial failures are fine — the signal extractor handles `null` data gracefully. Check the `fetch_status` column to diagnose which API family failed.

### Token refresh

Salesforce access tokens expire after ~2 hours. The app auto-refreshes after 90 minutes. If you see `Token refresh failed`:
- Verify the refresh token hasn't been revoked in Salesforce
- Check if Connected App policies changed
- The customer may need to re-authorize

### Common Salesforce org restrictions

| Restriction | Impact | Workaround |
|-------------|--------|------------|
| Third-party OAuth blocked | `OAUTH_AUTHORIZATION_BLOCKED` error | Use CLI extraction: `./scripts/sf-extract.sh` |
| IP allowlisting | OAuth callback blocked from server IP | Use CLI extraction (runs from consultant's machine) |
| Tooling API disabled | Flows/triggers return empty | CLI script degrades gracefully; core SOQL still works |
| API limits exhausted | 429 errors | OAuth downloader retries 3x; CLI script uses parallel queries |
| MFA required | OAuth requires interactive MFA step | Consultant completes MFA during consent; CLI uses `sf org login web` which handles MFA natively |
