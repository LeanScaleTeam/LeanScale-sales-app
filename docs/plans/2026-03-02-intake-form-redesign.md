# Intake Form Redesign — Design Document

**Date:** 2026-03-02
**Status:** Approved

## Problem

The current intake form has ~45 in-app questions + ~30 Fillout questions. Many questions ask for information already auto-detected from CRM metadata (dashboard counts, validation rules, dedup process). Meanwhile, critical areas like team structure, ramp time, territory methodology, and coaching cadence are never asked. Salesforce customers get ~28 auto-filled answers; HubSpot customers get ~0 auto-fills but answer the same form.

## Solution

Restructure both the Fillout (external) and in-app intake forms:
- Reduce from ~45 to ~30 questions for Salesforce customers (auto-detected questions hidden)
- HubSpot/Other customers see ~30 questions (same count but better organized)
- Add 9 new questions covering team, planning, and enablement gaps
- Make Fillout goals step optional (highest friction, lowest diagnostic value)
- CRM-adaptive visibility: questions hidden when auto-detection covers them

## New Form Structure

| Section | Questions | Maps To | SF Auto-Fill |
|---------|-----------|---------|--------------|
| 1. Company Profile | 5 | A1-A5 | 3 of 5 |
| 2. Tools | 13 categories | B1_tools, B2_details | Auto-detected |
| 3. Team & Organization | 5 (new) | PE-A, PE-B, PE-C, PL-B | 0 — human only |
| 4. Process Maturity | 10-18 (CRM-adaptive) | C1-C18, PR-A, PR-B | 6 of 10 (SF) |
| 5. Reporting & Data | 13-15 (CRM-adaptive) | D1-D6, Power 10 | 10 of 13 (SF) |
| 6. Planning & Enablement | 4 (new) | PL-A, PL-C, EN-A, EN-B | 0 — human only |

## Questions Removed for Salesforce Customers (11)

These are hidden when `hasSalesforceSignals = true`. They remain visible for HubSpot/Other. The inferrer auto-fills their values silently.

| ID | Question | Auto-Detection Source |
|----|----------|----------------------|
| C2 | Lead response time | Speed-to-lead tools in installedPackages |
| C5 | Required stage fields | Validation rules on Opportunity |
| C8 | Renewal tracking | Record types matching "renewal" |
| C10 | Dedup process | Flows matching "dedup", "duplicate", "merge" |
| C11 | Email nurture campaigns | MAP connected apps + campaign types |
| C12 | Events program | Campaign types (event, webinar, conference) |
| C14 | Headcount/capacity model | Moved to consultant audit (PL-B) |
| C15 | Business review frequency | Moved to consultant audit (PL-D) |
| C16 | Manager dashboards | Dashboard folder naming patterns |
| C17 | IC daily CRM use | Login history frequency |
| D1 | Dashboard count | SOQL COUNT(*) |
| D5 | Report distribution | Scheduled report count |
| M4_model | Attribution model | Low signal, removed entirely |

## New Questions Added (9)

### Section 3: Team & Organization

| ID | Question | Options | Maps To |
|----|----------|---------|---------|
| T1 | How many people are in your GTM org total? | 1-10, 11-25, 26-50, 51-100, 100+ | PL-B |
| T2 | How long does it take a new rep to reach full productivity? | <30 days, 30-60 days, 60-90 days, 90+ days, Don't know | PE-B |
| T3 | How are territories or accounts assigned? | Named accounts, Geographic, Round-robin, No formal process | PL-B |
| T4 | Is there a documented comp plan with variable components? | Yes with accelerators, Yes basic, Informal, No | PE-C |
| T5 | How is your team structured? | By function (SDR/AE/AM), By segment, By geography, Flat/generalist | PE-A |

### Section 6: Planning & Enablement

| ID | Question | Options | Maps To |
|----|----------|---------|---------|
| E1 | What data informs your quarterly planning? | CRM data + finance, CRM data only, Spreadsheets, Gut feel | PL-A, PL-C |
| E2 | How do reps access playbooks and sales content? | Enablement platform, Shared drive/wiki, CRM embedded, No central place | EN-A |
| E3 | How often do managers review calls or meetings with reps? | Weekly, Monthly, Quarterly, Rarely/never | EN-B |
| E4 | What is your biggest operational bottleneck right now? | Data quality, Process gaps, Tool adoption, Reporting gaps, Hiring/ramp, Cross-team alignment | Cross-cutting |

## CRM-Adaptive Visibility

Questions use a `hideWhenAutoDetected` flag. Visibility logic:

```
skipRules = {
  skipPartnerQuestions: A5 === 'No',
  skipEnterpriseQuestions: A3 in ['<$1M', '$1-5M'],
  hasSalesforceSignals: A1 === 'Salesforce' && crmMetadataExists,
  hasHubSpotSignals: A1 === 'HubSpot' && crmMetadataExists,
}
```

- `hideWhenAutoDetected: true` + `hasSalesforceSignals` → question hidden, auto-fill used
- `hideWhenAutoDetected: true` + `hasHubSpotSignals` → question shown (HS detection is weaker)
- `hideWhenAutoDetected: true` + no signals → question shown

Result:
- **Salesforce**: ~22 questions
- **HubSpot**: ~30 questions
- **Other CRM**: ~30 questions

## Question ID Mapping

### Unchanged IDs
```
A1-A5, B1_tools, B2_details, C1, C3, C4, C6, C7, C9, C13,
M7_tracking, M4_pipeline, R4_winloss, D2, D3, D4, D6,
D5_arr, D5_bookings, D5_pipeline, D5_mql, D5_gross_churn,
D5_grr, D5_nrr, D5_mql_opp, D5_opp_cw, D5_cycle
```

### New IDs
```
T1, T2, T3, T4, T5, E1, E2, E3, E4
```

### Retired IDs (kept in DB, no longer asked to SF customers)
```
C2, C5, C8, C10, C11, C12, C14, C15, C16, C17, C18,
D1, D5, M4_model
```

## Fillout Form Structure

| Step | Content | Required |
|------|---------|----------|
| 1. Tech Stack | 15 checkbox categories + email + free-text wishlist | Yes |
| 2. Team & Organization | T1-T5 | Yes |
| 3. Process & Reporting | C1, C3, C4, C6, C7, C9, C13, M4_pipeline, R4_winloss, D2, D3, D4, D6 | Yes |
| 4. Planning & Enablement | E1-E4, Power 10 metrics | Yes |
| 5. Goals (Optional) | 13 numeric ARR/bookings/conversion fields | No — skip button prominent |
| 6. Docs + Review | File upload + review page | No |

## Backward Compatibility

1. Existing `diagnostic_intake` rows untouched — old answers stay in JSONB
2. Graders already handle missing keys (default to null, skip scoring)
3. New IDs (T1-T5, E1-E4) absent from old records — treated as unanswered
4. V2 consultant competencies read new IDs as additional signal but don't require them
5. No database migration needed

## Architecture

### New Files

| File | Purpose |
|------|---------|
| `components/diagnostic-intake/SectionC_TeamOrg.js` | Team & Organization (T1-T5) |
| `components/diagnostic-intake/SectionF_PlanningEnablement.js` | Planning & Enablement (E1-E4) |

### Modified Files

| File | Change |
|------|--------|
| `IntakeForm.js` | Update step flow A→B→C→D→E→F, progress bar for 6 sections, pass CRM-adaptive skipRules |
| `SectionC_Processes.js` → `SectionD_Processes.js` | Rename. Add hideWhenAutoDetected support. Remove retired questions for SF. |
| `SectionD_Reporting.js` → `SectionE_Reporting.js` | Rename. Hide D1/D5 for SF customers. |
| `intake-inferrer-sf.js` | Add mappings so retired questions still get auto-fill values for downstream graders |
| `Diagnostic Intake Form v2.json` | Restructure Fillout steps to match new structure |

### Unchanged

- `SectionA_CompanyProfile.js`, `SectionB_Tools.js` — no changes
- All signal extractors, graders, diagnostic engine — unchanged
- `diagnostic_intake` table — JSONB accepts any keys
- All existing diagnostic results — backward compatible

## Implementation Plan

### Step 1: New in-app sections
- Create `SectionC_TeamOrg.js` (T1-T5)
- Create `SectionF_PlanningEnablement.js` (E1-E4)

### Step 2: Refactor existing sections
- Rename and update `SectionC_Processes.js` → `SectionD_Processes.js`
- Rename and update `SectionD_Reporting.js` → `SectionE_Reporting.js`
- Add `hideWhenAutoDetected` filtering logic

### Step 3: Update IntakeForm orchestrator
- Update step flow and progress tracking
- Add CRM-adaptive skipRules with `hasSalesforceSignals`
- Wire up CRM status check on mount

### Step 4: Update Fillout JSON
- Restructure steps to match new flow
- Add Team & Org and Planning & Enablement steps
- Make Goals step optional with skip button

### Step 5: Update inferrer
- Ensure retired questions still get auto-fill values for SF customers
- Map new T/E question IDs for future HubSpot inferrer

## Metrics

- Customer-facing questions: ~45 → ~22 (SF) / ~30 (HS)
- New coverage areas: 9 questions filling V2 competency gaps
- Fillout required fields: ~43 → ~28
- Goals step: required → optional (reduces abandon rate)
- Diagnostic coverage: 14/14 V2 competencies now have at least one intake signal
