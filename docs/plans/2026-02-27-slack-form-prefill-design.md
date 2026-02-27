# Slack Form Pre-fill + Salesforce OAuth Fix

**Date:** 2026-02-27

---

## Feature 1: Slack Form Pre-fill

### Overview

Add a collapsible banner on Section A of the diagnostic intake form that lets consultants paste the raw output from the Slack-submitted pre-diagnostic questionnaire. The parser maps fields to intake form answers, pre-filling Sections A through D.

### UI Flow

1. Consultant opens `/c/{slug}/diagnostic/intake`
2. Section A loads with a collapsible banner at the top: "Have a completed intake form? Paste it here to pre-fill."
3. Clicking the banner reveals a textarea
4. Consultant pastes raw Slack form text and clicks **Parse & Pre-fill**
5. Banner collapses, shows summary: "Pre-filled X of Y fields from intake form"
6. A sticky "Notes from intake call" panel appears at the top of every section showing "Biggest pains" and "Biggest opportunities" text
7. Pre-filled answers show blue "From intake form" badges (same style as Salesforce inference badges)
8. Badges disappear when the consultant overrides an answer
9. Consultant proceeds through Sections A-D normally, reviewing/adjusting pre-filled values

### Parser Logic

**Input format:** Newline-separated `Key:Value` pairs from Slack form output.

**Field mappings:**

| Slack Field | Intake Key | Mapping Logic |
|-------------|-----------|---------------|
| CRM | A1 | Direct: "Salesforce" → "Salesforce", "HubSpot" → "HubSpot" |
| Beginning of Year ARR ($) | A3 | Range match: <$1M, $1-5M, $5-20M, $20-50M, $50M+ |
| Marketing Automation Platform | B1_tools → marketing_automation | Tool name lookup |
| Customer Success Platform | B1_tools → csp | Tool name lookup ("CRM-only" → skip) |
| Customer Support Platform | B1_tools → support | Tool name lookup ("CRM-only" → skip) |
| Partner Relationship Management | B1_tools → prm_tool | Tool name lookup ("Don't Have" → skip) |
| Data Enrichment | B1_tools → data_enrichment | Comma-split, tool name lookup |
| Sales Engagement Platform | B1_tools → sales_engagement | Comma-split, tool name lookup |
| Revenue Intelligence | B1_tools → conversation_intel | Tool name lookup |
| Lead Routing | B1_tools → lead_routing | Tool name lookup |
| CPQ | B1_tools → cpq | Tool name lookup ("CRM-only" → skip) |
| Data Analytics | B1_tools → bi_analytics | Tool name lookup ("CRM" → skip) |
| GTM/Sales Enablement | B1_tools → enablement_platform | Tool name lookup |
| Quota/Commission Management | B1_tools → forecasting_tool | Tool name lookup |
| Contract Lifecycle Management | B1_tools → esign | Tool name lookup |
| De-duplication Platform | B1_tools → dedup | "Don't Have" → skip |
| Annual Bookings Goal ($) | D5_bookings | Normalize to number |
| Annual Created SQL Goal ($) | D5_pipeline | Normalize to number |
| Annual Created MQL Goal (#) | D5_mql | "none" → skip |
| Annual SQL to CW Conversion (%) | D5_opp_cw | Normalize percentage |
| MQL to SQL Conversion (%) | D5_mql_opp | "none" → skip |
| SQL to CW Time to Close (days) | D5_cycle | Map range to option |
| Annual Gross Churn goal ($) | D5_gross_churn | Normalize percentage |
| Annual Gross retention rate (%) | D5_grr | Normalize percentage |
| Annual Net retention rate (%) | D5_nrr | Normalize percentage |
| Biggest pains | _contextNotes.pains | Free text, displayed in context panel |
| Biggest opportunities | _contextNotes.opportunities | Free text, displayed in context panel |
| Email | _contextNotes.email | Stored for reference |

**Tool name lookup table:** Hard-coded map of known tool names to B1_tools category keys. Examples:
- Salesloft, Outreach, Apollo → sales_engagement
- Gong, Chorus → conversation_intel
- Clay, ZoomInfo, Clearbit, 6sense → data_enrichment
- Planhat, Gainsight, Totango, ChurnZero → csp
- ChiliPiper, LeanData → lead_routing
- DocuSign, Ironclad → esign
- Highspot, Seismic, Showpad → enablement_platform
- SPIFF, CaptivateIQ, Xactly → forecasting_tool
- Marketo, Pardot, HubSpot Marketing → marketing_automation

**"Don't Have" / "CRM-only" / "none":** These indicate absence — skip the field (don't pre-fill).

### Layering with Salesforce Inference

If the consultant pastes a Slack form AND connects Salesforce:
- Slack form pre-fills first (during Section A)
- Salesforce inference runs after OAuth (during sf-analyzing step)
- CRM inference values overwrite Slack pre-fills for overlapping fields (CRM data is more authoritative)
- Both badge types can coexist: "From intake form" and "Auto-detected: [evidence]"

### Context Panel

A persistent panel shown at the top of Sections B, C, and D containing:
- **Pains:** Free text from "Biggest pains" field
- **Opportunities:** Free text from "Biggest opportunities" field
- Styled as a light blue info card, collapsible
- Helps consultant contextualize answers while reviewing

---

## Feature 2: Force Salesforce Re-login

### Problem

When a consultant is logged into multiple Salesforce orgs, the OAuth flow reuses the last active browser session instead of prompting for credentials. This causes the wrong org to be connected.

### Fix

Add `prompt: 'login'` to the OAuth authorize URL parameters in `lib/salesforce.js`. This forces Salesforce to display the login screen on every connection attempt.

### Files Changed

- `lib/salesforce.js` — add `prompt: 'login'` to `URLSearchParams` in `getAuthorizationUrl()`

---

## Implementation Plan

### Task 1: Salesforce OAuth fix (5 min)
- Add `prompt: 'login'` to `lib/salesforce.js` authorize URL

### Task 2: Slack form parser (core logic)
- Create `lib/slack-form-parser.js`
- Implement `Label:Value` line parser
- Implement tool name lookup table
- Implement ARR/metrics normalization
- Map all fields to intake form answer keys
- Return `{ answers, contextNotes, summary }`

### Task 3: Pre-fill banner component
- Create `components/diagnostic-intake/SlackFormBanner.js`
- Collapsible banner with textarea and Parse button
- Summary display after parsing
- Wire into IntakeForm.js Section A

### Task 4: Context notes panel
- Create `components/diagnostic-intake/IntakeContextPanel.js`
- Display pains/opportunities text
- Add to Sections B, C, D

### Task 5: Pre-fill integration
- Wire parser output into IntakeForm answers state
- Add "From intake form" badges to Sections B, C, D
- Handle override tracking (reuse existing `overridden` Set pattern)
- Handle layering with Salesforce inference

### Task 6: Update user guide
- Add Slack form pre-fill section to docs/user-guide.md
