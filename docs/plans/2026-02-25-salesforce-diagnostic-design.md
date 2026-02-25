# Salesforce Diagnostic — Design Document

**Date:** 2026-02-25
**Status:** Approved

## Overview

Add Salesforce CRM support to the v2 GTM diagnostic alongside the existing HubSpot integration. Salesforce diagnostics include all 17 shared diagnostic items plus a new 4th "Platform Health" layer with 5 Salesforce-specific items (22 total).

## Key Decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Auth approach | Hybrid — OAuth API-first + metadata zip upload fallback |
| 2 | Primary user | LeanScale consultant (not customer self-serve) |
| 3 | Connected App host | LeanScale's primary Salesforce org |
| 4 | Signal mapping | Same 17 items + 5 Salesforce-specific Platform Health items |
| 5 | Extra items structure | 4th "Platform Health" layer (P1-P5) |
| 6 | APIs targeted | REST, SOQL, Tooling, Metadata, Reports (v1) |
| 7 | Intake flow | CRM connect at review step (end of form) |
| 8 | Upload format | Salesforce CLI metadata zip for v1 |
| 9 | CRM data requirement | Required — waiting state if not yet connected |
| 10 | Sandbox support | Production/Sandbox toggle on connect UI |

---

## Architecture

### New Files

```
lib/
├── salesforce.js                          # OAuth helpers (authorize URL, token exchange, refresh)
├── salesforce-downloader.js               # API-first: pull metadata via REST/SOQL/Tooling APIs
├── salesforce-metadata-parser.js          # Upload path: parse CLI metadata zip (XML → JSON)
├── diagnostic-engine/
│   ├── signal-extractor-sf.js             # Map Salesforce data → shared + Platform Health signals
│   └── graders/
│       └── platform-health.js             # Grade P1-P5 items (Salesforce-only layer)

pages/api/
├── salesforce/
│   ├── authorize.js                       # Redirect to Salesforce OAuth
│   ├── callback.js                        # Handle OAuth callback, store tokens, download metadata
│   ├── status/[customerId].js             # Check connection status
│   └── upload.js                          # Accept metadata zip, parse, store

components/diagnostic-intake/
├── SalesforceConnect.js                   # OAuth button + upload dropzone + connection status
```

### Modified Files

- `lib/diagnostic-engine/index.js` — add `gradePlatformHealth()` call when CRM = Salesforce
- `lib/diagnostic-engine/skip-logic.js` — add `A1='Salesforce'` → `showSalesforceConnect: true`
- `components/diagnostic-intake/IntakeReview.js` — add SalesforceConnect alongside HubSpotConnect
- `components/diagnostic-intake/IntakeForm.js` — handle salesforce query params, waiting state
- `components/diagnostic/LayerView.js` — render 4th layer when present
- `components/diagnostic/DiagnosticSummary.js` — handle 4-layer scoring display
- `pages/api/diagnostic/run.js` — detect Salesforce CRM, load SF metadata, run Platform Health grading

### Supabase Tables (New)

**`salesforce_connections`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| customer_id | uuid | FK → customers |
| org_id | text | Salesforce org ID |
| instance_url | text | e.g., https://na1.salesforce.com |
| access_token | text | encrypted |
| refresh_token | text | encrypted |
| is_sandbox | boolean | default false |
| scopes_granted | text[] | |
| connected_at | timestamptz | |
| UNIQUE | | (customer_id, org_id) |

**`salesforce_metadata`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| customer_id | uuid | FK → customers |
| org_id | text | |
| source | text | 'api' or 'upload' |
| objects | jsonb | Lead, Contact, Account, Opportunity, Case, Campaign describes |
| stages | jsonb | OpportunityStage, LeadStatus |
| users | jsonb | Active users |
| flows | jsonb | FlowDefinition results |
| workflow_rules | jsonb | WorkflowRule results |
| validation_rules | jsonb | ValidationRule results |
| apex_triggers | jsonb | ApexTrigger results |
| apex_classes | jsonb | ApexClass results |
| profiles | jsonb | Profile list |
| permission_sets | jsonb | PermissionSet list |
| roles | jsonb | UserRole hierarchy |
| reports | jsonb | Report inventory |
| dashboards | jsonb | Dashboard inventory |
| connected_apps | jsonb | ConnectedApplication list |
| named_credentials | jsonb | NamedCredential list |
| record_types | jsonb | RecordType counts |
| computed_signals | jsonb | Output of signal-extractor-sf.js |
| fetch_status | jsonb | Per-API-family success/error status |
| fetched_at | timestamptz | |

**`diagnostic_intake` modification**
- Add column: `status` text CHECK (`'in_progress'`, `'awaiting_crm_data'`, `'ready'`, `'complete'`)

---

## OAuth Flow

### Connected App (LeanScale's Salesforce Org)

- **Callback URL:** `https://clients.leanscale.team/api/salesforce/callback`
- **Scopes:** `api`, `refresh_token`, `offline_access`
- **Env vars:** `SALESFORCE_CLIENT_ID`, `SALESFORCE_CLIENT_SECRET`

### Authorize (`/api/salesforce/authorize`)

```
GET /api/salesforce/authorize?customerId=xxx&slug=yyy&sandbox=false
→ Redirect to: https://login.salesforce.com/services/oauth2/authorize
  ?response_type=code
  &client_id={SALESFORCE_CLIENT_ID}
  &redirect_uri={callback_url}
  &state={base64url({customerId, slug})}
```

Sandbox uses `test.salesforce.com` instead of `login.salesforce.com`.

### Callback (`/api/salesforce/callback`)

1. Decode state → `{customerId, slug}`
2. Exchange code for tokens at `/services/oauth2/token`
3. Extract `instance_url`, `access_token`, `refresh_token` from response
4. Fetch identity URL → extract `org_id`
5. Upsert `salesforce_connections` (conflict: `customer_id, org_id`)
6. Update `customers.crm_type = 'salesforce'`
7. Call `downloadAndStoreMetadata(customerId, instanceUrl, accessToken)`
8. Check if intake status = `awaiting_crm_data` → auto-run diagnostic
9. Redirect to `/c/slug/diagnostic/intake?salesforce=connected`

### Token Refresh

`getAccessToken(customerId)` in `lib/salesforce.js`:
- Check token age (Salesforce tokens expire ~2 hours)
- Refresh via `/services/oauth2/token` with `grant_type=refresh_token`
- Same pattern as `lib/hubspot.js`

---

## Metadata Download — API Path

`downloadAndStoreMetadata(customerId, instanceUrl, accessToken)` in `lib/salesforce-downloader.js`.

### 1. REST API — Object Describes

```
GET /services/data/v59.0/sobjects/{Object}/describe
Objects: Lead, Contact, Account, Opportunity, Case, Campaign
```

### 2. SOQL Queries

```sql
SELECT MasterLabel, DefaultProbability, IsClosed, IsWon, SortOrder FROM OpportunityStage
SELECT MasterLabel, SortOrder FROM LeadStatus
SELECT Id, Name, IsActive, Profile.Name FROM User WHERE IsActive = true
SELECT SobjectType, COUNT(Id) cnt FROM RecordType GROUP BY SobjectType
SELECT Id, Name, FolderName FROM Report LIMIT 200
SELECT Id, Title, FolderName FROM Dashboard LIMIT 200
```

### 3. Tooling API

```sql
SELECT Id, FullName, ActiveVersionId FROM FlowDefinition
SELECT Id, Name, TableEnumOrId FROM WorkflowRule
SELECT Id, Name, EntityDefinitionId FROM ValidationRule WHERE Active = true
SELECT Id, Name, Status FROM ApexTrigger
SELECT Id, Name, LengthWithoutComments FROM ApexClass
```

### 4. Metadata API (via Tooling)

```sql
SELECT Id, MasterLabel FROM PermissionSet
SELECT Id, Name FROM Profile
SELECT Id, DeveloperName, ParentRoleId FROM UserRole
```

### 5. Integration Inventory

```sql
SELECT Id, Name FROM ConnectedApplication
SELECT Id, MasterLabel FROM NamedCredential
```

### Error Handling

- Each API family runs independently; partial failures stored in `fetch_status`
- Signal extractor handles `null` data gracefully
- Per-family status: `{rest: 'ok', soql: 'ok', tooling: 'error:INSUFFICIENT_ACCESS', ...}`

---

## Metadata Upload — Fallback Path

### Consultant Instructions (shown in UI)

```
To export Salesforce metadata:

1. Install the Salesforce CLI: https://developer.salesforce.com/tools/salesforcecli
2. Authenticate to the customer org:
   sf org login web --alias customer-org
3. Retrieve metadata:
   sf project retrieve start \
     --metadata CustomObject,CustomField,Flow,WorkflowRule,ValidationRule \
     --metadata ApexTrigger,ApexClass,Profile,PermissionSet \
     --metadata Role,DuplicateRule,ConnectedApp,NamedCredential \
     --metadata Layout,RecordType,Report,Dashboard \
     --target-org customer-org
4. Upload the resulting zip file below.
```

### Parser (`lib/salesforce-metadata-parser.js`)

Parses the CLI zip (XML files under `force-app/main/default/` or `unpackaged/`) into the same JSON shape as the API downloader output. Single input format for `signal-extractor-sf.js`.

### Upload Endpoint (`/api/salesforce/upload`)

1. Accept multipart form: `customerId` + zip file
2. Validate: < 50MB, contains expected directory structure
3. Parse XML → JSON via `salesforce-metadata-parser.js`
4. Run `extractSalesforceSignals()` → `computedSignals`
5. Store in `salesforce_metadata` with `source: 'upload'`
6. Check if intake status = `awaiting_crm_data` → auto-run diagnostic
7. Return success

---

## Signal Extraction

### Shared Signals (~40, same keys as HubSpot)

| Signal Key | Salesforce Source |
|------------|-------------------|
| `contact_custom_properties` | Custom fields on Lead + Contact (from describe) |
| `deal_pipeline_stages` | `OpportunityStage` SOQL with probabilities |
| `lifecycle_stages_covered` | `LeadStatus` picklist + custom lifecycle field |
| `total_active_workflows` | Active Flow + WorkflowRule count |
| `has_lead_routing_workflow` | Flows/rules matching `*Assignment*`, `*Routing*`, `*Round_Robin*` |
| `enrichment_tools` | Field name patterns (ZoomInfo, Clay, Clearbit, Apollo, Cognism) |
| `owner_count` | Active Users with sales profiles |
| `has_marketing_email` | Campaign records with type = 'Email' |
| `has_sequences` | Flows matching outbound sequence patterns |
| `form_count` | Web-to-Lead config + Campaign forms |
| `has_reporting_dashboards` | Dashboard + Report count from SOQL |

### Platform Health Signals (~15, Salesforce-only)

| Signal Key | Source | Used By |
|------------|--------|---------|
| `apex_trigger_count` | Tooling API | P1 |
| `apex_class_count` | Tooling API | P1 |
| `apex_total_lines` | Sum of `LengthWithoutComments` | P1 |
| `validation_rule_count` | Tooling API | P2 |
| `validation_rules_by_object` | Grouped by entity | P2 |
| `duplicate_rule_count` | Metadata | P2 |
| `profile_count` | Tooling API | P3 |
| `permission_set_count` | Tooling API | P3 |
| `role_hierarchy_depth` | Traversed from SOQL | P3 |
| `record_type_count` | SOQL group by | P4 |
| `page_layout_count` | Metadata | P4 |
| `connected_app_count` | Tooling API | P5 |
| `named_credential_count` | Tooling API | P5 |
| `outbound_flow_count` | Flows with HTTP callouts | P5 |

---

## Diagnostic Engine Updates

### Platform Health Grading (`graders/platform-health.js`)

| Item | Healthy (3) | Careful (2) | Warning (1) |
|------|------------|-------------|-------------|
| **P1 Apex Code Health** | < 20 triggers, classes well-structured | 20-50 triggers, some complexity | 50+ triggers, high line counts |
| **P2 Validation & Data Quality** | Rules on all key objects + duplicate rules active | Partial coverage | No validation rules or duplicate rules |
| **P3 Security & Access Model** | Structured roles, reasonable profile/permset count | Some sprawl, flat hierarchy | Excessive profiles, no role hierarchy |
| **P4 Record Type & Layout Design** | Record types purposeful, layouts maintained | Some unused, minor sprawl | Excessive record types, layout bloat |
| **P5 Integration Footprint** | Named credentials used, documented apps | Mix of managed/unmanaged | Unknown connected apps, no credentials |

### Scoring

- **Shared 3 layers (HubSpot or Salesforce):** Foundation 40%, Motions 35%, Maturity 25%
- **Salesforce 4 layers:** Foundation 35%, Motions 30%, Maturity 20%, Platform Health 15%
- Overall score remains 1-3 scale with same thresholds (>=2.5 healthy, >=1.5 careful)

### Engine Changes (`index.js`)

```js
function runDiagnostic(intakeAnswers, computedSignals, crmType) {
  const foundationItems = gradeFoundation(signals);
  const motionItems = gradeMotions(signals, intakeAnswers);
  const maturityItems = gradeMaturity(signals, intakeAnswers);

  let platformHealthItems = [];
  if (crmType === 'salesforce') {
    platformHealthItems = gradePlatformHealth(signals);
  }

  const items = [...foundationItems, ...motionItems, ...maturityItems, ...platformHealthItems];
  attachRecommendations(items);
  const scores = computeScores(items, crmType);
  return { items, scores };
}
```

---

## Intake Flow & Waiting State

### Two-Phase Completion

**Phase 1: Intake submitted, no CRM data**
- Answers saved to `diagnostic_intake`
- Status set to `awaiting_crm_data`
- Consultant sees waiting/connection page

**Phase 2: CRM data arrives (same session or later)**
- OAuth callback or upload endpoint detects `awaiting_crm_data` status
- Diagnostic engine runs automatically
- Status advances to `complete`
- Results available at diagnostic results page

### Intake Status Flow

```
in_progress → awaiting_crm_data → complete
                    ↑                  ↑
              (submit intake)    (CRM connected,
                                  diagnostic runs)
```

### Returning Consultant

When consultant visits `/c/[slug]/diagnostic/intake`:
- If `status = 'in_progress'` → show form (resume where they left off)
- If `status = 'awaiting_crm_data'` → show CRM connection page
- If `status = 'complete'` → redirect to results

This pattern applies to both HubSpot and Salesforce.

---

## UI Components

### SalesforceConnect Component

```
┌─────────────────────────────────────────────────┐
│  Connect Salesforce                              │
│                                                  │
│  [Connect via OAuth]        [Production ▾]      │
│                                                  │
│  ── or ──                                        │
│                                                  │
│  Upload Metadata Export                          │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐  │
│  │  Drag & drop metadata zip here            │  │
│  │  or click to browse                       │  │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘  │
│  How to export metadata (expandable)            │
└─────────────────────────────────────────────────┘
```

### LayerView Updates

Dynamically renders 3 or 4 layers based on `scores` object. Platform Health layer appears last when `crmType = 'salesforce'`.

### DiagnosticSummary Updates

- HealthScoreRing: no change (overall score)
- Layer score cards: responsive grid, 3 or 4 cards
- Company profile badges: show "Salesforce" CRM badge

### Results Data Shape

```json
{
  "version": 2,
  "crmType": "salesforce",
  "items": ["...17 shared items", "...5 platform health items"],
  "scores": {
    "overall": 2.1,
    "foundation": 2.3,
    "motions": 1.9,
    "maturity": 2.0,
    "platformHealth": 2.4
  }
}
```

---

## Implementation Order

1. **Database** — Create Supabase tables + add `status` column to `diagnostic_intake`
2. **OAuth** — `lib/salesforce.js` + authorize/callback API routes
3. **Downloader** — `lib/salesforce-downloader.js` (API-first metadata pull)
4. **Signal Extractor** — `lib/diagnostic-engine/signal-extractor-sf.js`
5. **Platform Health Grader** — `lib/diagnostic-engine/graders/platform-health.js`
6. **Engine Updates** — Wire Salesforce into `index.js` + update `computeScores()`
7. **Upload Path** — `salesforce-metadata-parser.js` + upload API route
8. **Intake Flow** — Skip logic, waiting state, IntakeReview updates
9. **SalesforceConnect Component** — OAuth button + dropzone + instructions
10. **Results UI** — LayerView + DiagnosticSummary 4-layer support
11. **Testing** — End-to-end with sample Salesforce org data
