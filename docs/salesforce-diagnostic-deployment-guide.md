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

Add these three variables to your deployment environment (Vercel, .env.local, etc.):

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

### Vercel deployment

```bash
vercel env add SALESFORCE_CLIENT_ID production
vercel env add SALESFORCE_CLIENT_SECRET production
vercel env add SALESFORCE_REDIRECT_URI production
```

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
  → App exchanges code for tokens
  → App downloads metadata from 16 API endpoints in parallel
  → App extracts ~55 diagnostic signals
  → If intake was submitted → auto-runs diagnostic engine
  → Consultant redirected to intake form with success banner
  → Clicks "Run Diagnostic" → results page with 4 layers
```

### Path B: Metadata ZIP Upload (fallback)

When OAuth isn't possible (e.g., security restrictions, no admin access):

```
Consultant exports metadata from customer org via CLI:
  $ sf org login web --alias customer-org
  $ sf project retrieve start \
      --metadata CustomObject,CustomField,Flow,WorkflowRule,ValidationRule \
      --metadata ApexTrigger,ApexClass,Profile,PermissionSet \
      --metadata Role,DuplicateRule,ConnectedApp,NamedCredential \
      --metadata Layout,RecordType,Report,Dashboard \
      --target-org customer-org

Consultant uploads the resulting ZIP on the Review step
  → App parses XML metadata into JSON
  → App extracts diagnostic signals
  → If intake was submitted → auto-runs diagnostic
```

### Waiting State

If the consultant submits the intake form **before** connecting CRM:
- Intake is saved with `status = 'awaiting_crm_data'`
- When CRM data arrives later (OAuth or upload), the diagnostic auto-runs
- No manual re-submission needed

---

## 5. API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/salesforce/authorize?customerId=X&slug=Y&sandbox=false` | Start OAuth flow |
| GET | `/api/salesforce/callback?code=X&state=Y` | Handle OAuth callback |
| GET | `/api/salesforce/status/{customerId}` | Check connection status |
| POST | `/api/salesforce/upload` | Upload metadata ZIP (multipart) |

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

The Connected App requests minimal scopes. Here's exactly what the downloader reads:

### REST API (Object Describes)
- Lead, Contact, Account, Opportunity, Case, Campaign
- Reads: field definitions, picklist values, record type info

### SOQL Queries
- `OpportunityStage` — pipeline stage names, probabilities
- `LeadStatus` — lead lifecycle stages
- `User WHERE IsActive = true` — active user list with profiles/roles
- `RecordType GROUP BY SobjectType` — record type counts
- `Report LIMIT 200` — report inventory
- `Dashboard LIMIT 200` — dashboard inventory
- `UserRole` — role hierarchy

### Tooling API
- `Flow WHERE Status = 'Active'` — active automation flows
- `WorkflowRule WHERE Active = true` — legacy workflow rules
- `ValidationRule WHERE Active = true` — validation rules by object
- `ApexTrigger` — custom code triggers
- `ApexClass WHERE NamespacePrefix = null` — custom Apex classes
- `Profile` — security profiles
- `PermissionSet WHERE IsOwnedByProfile = false` — custom permission sets
- `ConnectedApplication` — integration inventory
- `NamedCredential` — integration credentials

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
| `redirect_uri_mismatch` | Callback URL doesn't match Connected App | Verify `SALESFORCE_REDIRECT_URI` matches exactly |
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
| IP allowlisting | OAuth callback blocked | Add Vercel IPs or use metadata upload path |
| Tooling API disabled | Flows/triggers not downloaded | Upload metadata ZIP instead |
| API limits exhausted | 429 errors | Downloader retries 3x automatically; wait and retry |
| MFA required | OAuth may require extra step | Consultant must complete MFA during OAuth |
