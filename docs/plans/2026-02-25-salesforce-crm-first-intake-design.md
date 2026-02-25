# Salesforce CRM-First Intake — Design Document

**Date:** 2026-02-25
**Status:** Approved

## Overview

Reverse the intake flow for Salesforce customers: connect CRM early, download metadata, and pre-fill the intake form with inferred answers. The consultant reviews, corrects overrides, and fills remaining gaps. Reduces manual input from ~30 questions to ~12-15.

HubSpot flow is unchanged — the form was designed around HubSpot's API limitations.

## Key Decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Flow order | Minimal profile (A1/A3/A4/A5) → CRM connect → pre-filled form |
| 2 | Pre-fill UX | Pre-selected answers with "Auto-detected" badge, consultant can override |
| 3 | HubSpot changes | None — Salesforce only for this iteration |
| 4 | Loading state | Blocking loader with progress steps (3-8 seconds) |
| 5 | Re-connect | Not supported in v1 — start new intake if wrong org |

---

## Flow Architecture

### New Flow (A1 = Salesforce)

```
Step 1: Section A — Minimal Profile
         A1: CRM → "Salesforce"
         A3: ARR range
         A4: GTM motion
         A5: Partner program
         → "Continue" triggers CRM connect step

Step 2: Salesforce Connect
         OAuth button + sandbox toggle
         (or upload fallback)
         → On success, download metadata + extract signals

Step 3: Analyzing Screen
         "Connecting to Salesforce..." ✓
         "Downloading metadata..." ✓
         "Analyzing your org..." ✓
         → Calls /api/salesforce/infer → produces pre-fill map

Step 4: Pre-filled Form
         A2: Pre-selected from user count
         Section B: Tools pre-checked from ConnectedApps + field patterns
         Section C: Process answers pre-selected where inferable
         Section D: Dashboard count pre-selected, Power 10 manual
         → Each pre-filled answer has "Auto-detected" badge
         → Consultant reviews, corrects, fills gaps

Step 5: Review & Submit
         Same as today — summary of all answers
         Diagnostic runs immediately (CRM already connected)
```

### Existing Flow (A1 = HubSpot or Other)

Unchanged. Full form → CRM connect at review → submit.

---

## Inference Engine

### Module: `lib/diagnostic-engine/intake-inferrer-sf.js`

Takes `salesforce_metadata` (same data already stored), returns a pre-fill map keyed by question ID.

### Output Shape

```js
{
  A2: { value: '16-50', confidence: 'high', evidence: '23 active sales users' },
  C5: { value: 'Some stages', confidence: 'high', evidence: '4 validation rules on Opportunity' },
  B1_tools: { value: ['sales_engagement', 'data_enrichment'], confidence: 'medium', evidence: 'ConnectedApps: Outreach, ZoomInfo' },
}
```

### High-Confidence Inferences (auto-select)

| Question | Logic | Example |
|----------|-------|---------|
| A2 (rep count) | Count active users with sales-related profiles | 23 users → "16-50" |
| C5 (required fields) | ValidationRules on Opportunity | 4 rules → "Some stages" |
| C6 (closed-lost reasons) | Opportunity describe for loss reason field + required flag | Field exists, required → "Required field" |
| C10 (dedup) | DuplicateRule count > 0 | 3 rules → "Automated tool" |
| D1 (dashboard count) | Dashboard SOQL count | 12 dashboards → "10+" |

### Medium-Confidence Inferences (auto-select with evidence)

| Question | Logic | Example |
|----------|-------|---------|
| B1 (tools) | ConnectedApps names + field prefixes matching known tools | ConnectedApp "Outreach" → check `sales_engagement` |
| C1 (lead capture) | Web-to-Lead fields + Lead-creation Flows | Flow "Auto Create Lead" → "CRM forms" |
| C3 (MQL definition) | Fields matching `*Score*`, `*MQL*`, `*Qualified*` on Lead | `Lead_Score__c` exists → "Yes, with lead scoring" |
| C4 (qualification) | Fields matching MEDDIC/BANT/SPICED on Opportunity | `MEDDIC_Score__c` → "MEDDIC/MEDDPICC" |
| C8 (renewals) | RecordType named `*Renewal*` on Opportunity | Found → "Automated in CRM" |
| C11 (nurture) | Campaign records with type Email + Pardot in ConnectedApps | Pardot connected → "Yes, in CRM/MAP" |

### Never Inferred (always manual)

A3, A4, A5 (asked in Step 1), C2, C7, C9, C12, D2, D3, D4, all D5 Power 10 metrics.

---

## API Endpoint

### `POST /api/salesforce/infer`

```
Request:  { customerId: "uuid" }
Response: { success: true, preFill: { ... } }
```

Reads `salesforce_metadata` from Supabase, runs inference engine, returns pre-fill map. Separate from callback/upload so both paths can call it after storing metadata.

### Data Flow

```
OAuth callback (existing)
  → Downloads metadata → stores in salesforce_metadata
  → Redirects to intake with ?salesforce=connected

Client detects ?salesforce=connected
  → Shows analyzing screen
  → Calls POST /api/salesforce/infer { customerId }
  → Receives preFill map
  → Stores preFill in IntakeForm state
  → Advances to Section B with preFill passed as prop

Upload path (existing)
  → Parses ZIP → stores in salesforce_metadata
  → Client calls POST /api/salesforce/infer { customerId }
  → Same flow from there
```

The pre-fill map is ephemeral — lives in React state during the form session. Not persisted. The final `answers` object (with overrides) saves to `diagnostic_intake` as today.

---

## UI Changes

### Section A Split

When A1 = "Salesforce", Section A shows only A1, A3, A4, A5 (not A2). Continue navigates to `sf-connect` step. For HubSpot/Other, Section A is unchanged.

### New Steps in SECTIONS Array

```js
const SECTIONS = ['A', 'sf-connect', 'sf-analyzing', 'B', 'C', 'D', 'review'];
// sf-connect and sf-analyzing only render when A1 = Salesforce
```

### Analyzing Screen (`AnalyzingScreen.js`)

Progress view with 3 animated stages:
- "Connecting to Salesforce..." (checkmark when OAuth done)
- "Downloading org metadata..." (checkmark when download done)
- "Analyzing your configuration..." (checkmark when inference done)

Auto-advances to Section B on completion.

### Pre-fill Badges

Each section component (B, C, D) receives optional `preFill` prop. When `preFill[questionKey]` exists:
- Answer is pre-selected
- Small badge below: "Auto-detected: 23 active sales users" in muted style
- Badge disappears if consultant clicks a different option (override)

---

## Files

### New Files

| File | Purpose |
|------|---------|
| `lib/diagnostic-engine/intake-inferrer-sf.js` | Inference engine — metadata → pre-fill map |
| `pages/api/salesforce/infer.js` | API endpoint wrapping the inferrer |
| `components/diagnostic-intake/AnalyzingScreen.js` | Progress UI during download + inference |

### Modified Files

| File | Change |
|------|--------|
| `components/diagnostic-intake/IntakeForm.js` | Add `sf-connect` and `sf-analyzing` steps. Route A1=Salesforce through new flow. Store `preFill` in state. Pass to sections. |
| `components/diagnostic-intake/SectionA_CompanyProfile.js` | Conditionally hide A2 when A1=Salesforce. |
| `components/diagnostic-intake/SectionB_Tools.js` | Accept `preFill` prop. Pre-check tools. Show badge. |
| `components/diagnostic-intake/SectionC_Processes.js` | Accept `preFill` prop. Pre-select answers. Show badge. |
| `components/diagnostic-intake/SectionD_Reporting.js` | Accept `preFill` prop. Pre-select D1. |

### Not Modified

IntakeReview, SalesforceConnect (reused as-is), diagnostic engine, signal extractor, graders, results UI, skip-logic.js, HubSpot flow.
