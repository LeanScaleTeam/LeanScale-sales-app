# Consultant Audit Form Redesign — Design Document

**Date:** 2026-02-27
**Status:** Approved

## Problem

The current consultant assessment form presents 21 required competencies x 4 departments = ~72 cells to score. Each cell is a bare 1-5 button with no guidance on what to check in the CRM. Consultants don't know where to look, what signals matter, or what questions to ask. The form feels like a chore rather than a guided audit.

## Solution

Two deliverables:

1. **CRM Audit Form** — A sequential checklist with 14 consolidated competencies (~28 cells), CRM-specific check instructions, pre-populated signals from existing metadata, and suggested scores the consultant can confirm or override.

2. **Discovery Call Prep Sheet** — A printable per-customer page with company snapshot, conversation questions organized by topic, and gap-specific probing areas based on CRM signals.

## Consolidated Competency Model

Merge 21 required competencies down to 14. Classify each as org-level (scored once) or dept-specific (scored per department).

| # | ID | Name | Scope | Depts | Cells | Merges |
|---|-----|------|-------|-------|-------|--------|
| 1 | PL-A | Strategic planning & goals | org | all | 1 | PL-1 + PL-4 |
| 2 | PL-B | Capacity & headcount model | org | all | 1 | PL-2 |
| 3 | PL-C | Budget allocation | org | all | 1 | PL-3 |
| 4 | PL-D | Review cadence (QBR/WBR) | org | all | 1 | PL-5 |
| 5 | PE-A | Hiring maturity | org | all | 1 | PE-1 + PE-2 |
| 6 | PE-B | Onboarding (30/60/90) | org | all | 1 | PE-3 |
| 7 | PE-C | Comp & commission design | dept | sales, cs, partners | 3 | PE-4 |
| 8 | PE-D | Performance management | org | all | 1 | PE-5 |
| 9 | PR-A | Partner program maturity | dept | partners | 1 | PR-4 |
| 10 | PR-B | ABM / target account process | dept | marketing, sales | 2 | PR-8 |
| 11 | RP-A | Dashboard adoption & trust | dept | marketing, sales, cs | 3 | RP-2 + RP-3 |
| 12 | RP-B | Reporting cadence | org | all | 1 | RP-4 |
| 13 | EN-A | Content & playbook maturity | org | all | 1 | EN-1 + EN-2 + EN-5 |
| 14 | EN-B | Coaching & training program | dept | sales, cs | 2 | EN-3 + EN-4 |

**Total: 14 competencies, ~21 cells** (down from 21 competencies, ~72 cells)

### Merge Map

When a consultant scores a V2 competency, the system fans the score out to the original V1 competency IDs in `consultant_assessments`:

```
PL-A → PL-1, PL-4
PE-A → PE-1, PE-2
RP-A → RP-2, RP-3
EN-A → EN-1, EN-2, EN-5
EN-B → EN-3, EN-4
```

All other V2 IDs map 1:1 to their V1 equivalent.

## CRM Audit Form

### UX Pattern

Sequential checklist (not accordion grid). Each competency shows:

1. **"What We Found" panel** — auto-populated from existing CRM signals
2. **CRM check instructions** — tailored to Salesforce or HubSpot
3. **Scoring guide** — compressed 1/3/5 anchors
4. **Score + notes** — one click to confirm suggested score, or override

```
┌─────────────────────────────────────────────────────┐
│ ☐  PL-A: Strategic Planning & Goals          [org]  │
│                                                     │
│  ┌─ WHAT WE FOUND ─────────────────────────────┐   │
│  │  ✓ 6 scheduled reports (weekly/monthly)      │   │
│  │  ✓ 14 dashboards in "Executive" folders      │   │
│  │  ✗ No OKR/Goal custom fields on Opportunity  │   │
│  │                                              │   │
│  │  Suggested score: 3 (Average)                │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  VERIFY IN SALESFORCE:                              │
│  • Reports → search "quarterly" or "OKR"            │
│  • Dashboard folders → "Executive"/"Leadership"     │
│  • Scheduled Reports → recurring goal tracking?     │
│                                                     │
│  SCORING GUIDE:                                     │
│  1 — No planning artifacts found                    │
│  3 — Reports exist but ad-hoc, no regular cadence   │
│  5 — Quarterly dashboards with automated delivery   │
│                                                     │
│  Score: (1) (2) ③ (4) (5)    Notes: [________]     │
└─────────────────────────────────────────────────────┘
```

### Adaptive Behavior

- **Strong signals detected**: Show as "Review" — suggested score pre-selected, one click to confirm
- **No signals detected**: Show full CRM check instructions — consultant must research and score
- **Partial signals**: Show what was found, highlight gaps to verify

### CRM-Specific Check Instructions

Each V2 competency has `crmChecks.salesforce` and `crmChecks.hubspot` arrays. The form reads the customer's `crm_type` and shows the appropriate set.

| ID | Salesforce Checks | HubSpot Checks |
|----|------------------|----------------|
| PL-A | Search Reports/Dashboards for "quarterly", "OKR", "goal". Check for custom Goal objects or fields. Look at scheduled report delivery. | Check Goals tool usage. Search Reports for "quarterly" or "OKR". Look at Dashboard sharing patterns. |
| PL-B | Check User count by Role. Look for Territory2Model. Compare active users to role hierarchy depth. | Check Teams setup. Look at user count vs pipeline assignments. |
| PL-C | Search Reports for "budget", "ROI", "spend". Look for Campaign budget/cost fields. Check Campaign Influence. | Check Campaigns with budget fields. Look at ad spend integrations. |
| PL-D | Check CronTrigger for scheduled reports. Look for recurring Events with "review", "QBR", "WBR" subjects. | Check recurring meeting activities. Look at scheduled report emails. |
| PE-A | Check Profile names (beyond "System Admin" and "Standard User"). Look at Role hierarchy depth and structure. | Check Teams and permission structure. Look for role-based views. |
| PE-B | Check ContentVersion for onboarding docs. Look for Task templates or Flow triggers on new User creation. Search Knowledge articles. | Check Knowledge Base for onboarding articles. Look for onboarding Sequences. |
| PE-C | Check Opportunity custom fields: "Commission", "Comp", "SPIFF". Look for Installed Packages (Xactly, CaptivateIQ, Spiff). | Check deal properties for commission. Look at calculated properties. Check comp tool integrations. |
| PE-D | Check custom objects/fields tracking rep performance. Look for Dashboard folders named after managers. Check scheduled reports to management roles. | Check rep-level filtered dashboards. Look at activity-based reports per user. |
| PR-A | Check PartnerRole object existence. Look for Partner record types on Account/Opportunity. Check partner-specific Profiles/Permission Sets. | Check partner deal pipeline. Look for partner contact properties. |
| PR-B | Look for Account fields: "Tier", "Target", "ICP Score", "ABM". Check Installed Packages (6sense, Demandbase, Terminus). Look at Campaign types with "ABM". | Check company scoring properties. Look at static lists named "target" or "ABM". |
| RP-A | Count Dashboards vs active users (ratio). Check folder structure (by team/role?). Look for Manager/Director/IC folder naming patterns. | Check Dashboard creation and sharing patterns. Look at report view frequency. |
| RP-B | Count CronTrigger scheduled reports and frequency patterns. Look for report distribution lists. | Check scheduled email reports. Look at report delivery frequency. |
| EN-A | Count ContentVersion docs. Search for "playbook", "process", "guide", "SOP". Check KnowledgeArticleVersion count. Look for Installed Packages (Highspot, Seismic, Showpad). | Check Documents tool. Search for playbook content. Look at Templates library size. |
| EN-B | Look for Installed Packages (Gong, Chorus, Clari, ExecVision). Check coaching-related Dashboard folders. Look at Activity/Event patterns suggesting call reviews. | Check conversation intelligence integrations. Look at call recording settings. |

### Signal-to-Score Mapping

Each competency has a `signalMapping` function that takes `(computedSignals, enhancedSignals, metadata)` and returns `{ score, confidence, evidence[] }` or `null`. This powers the "Suggested score" feature.

## Discovery Call Prep Sheet

### URL

`/[slug]/diagnostic/call-prep`

Printable via browser print (clean print CSS, no nav chrome).

### Sections

**Part 1: Company Snapshot**
Auto-generated from CRM metadata:
- CRM type, instance URL
- ARR / bookings data
- GTM motion (from lead source distribution)
- Active users / login frequency
- Tech stack (installed packages)
- Automation depth (flows, workflows, validation rules)
- Reporting depth (report/dashboard counts)

**Part 2: Discovery Questions**
Organized by topic (not competency ID). Ordered from broad to specific:

- Planning & Strategy (4 questions → PL-A through PL-D)
- Hiring & Team Development (4 questions → PE-A through PE-D)
- Go-to-Market Process (2 questions → PR-A, PR-B)
- Reporting & Dashboards (2 questions → RP-A, RP-B)
- Enablement & Coaching (2 questions → EN-A, EN-B)

**Part 3: Gaps to Probe**
Signal-driven. For each competency where CRM signals are missing or concerning, generate a specific probing question:
- "⚠ No forecast dashboards found → Ask: How do you forecast?"
- "⚠ 18 opp stages detected (high) → Ask: Are all stages actively used?"
- "✓ Gong detected → Probe adoption: How many reps reviewed per week?"

### Generation

`call-prep-generator.js` takes the customer's metadata row and produces a structured object:

```js
{
  snapshot: { crm, arr, gtmMotion, users, techStack, ... },
  questions: [{ topic, items: [{ question, mapsTo: 'PL-A' }] }],
  gaps: [{ signal, severity, probeQuestion, mapsTo: 'RP-A' }],
}
```

The page component renders this as clean HTML with print styles.

## Architecture

### New Files

| File | Purpose |
|------|---------|
| `lib/diagnostic-engine/v3/consultant-competencies.js` | V2 competency definitions, CRM checks, discovery questions, signal mappings, merge map |
| `components/diagnostic/v3/ConsultantAuditForm.js` | New sequential checklist form |
| `pages/[slug]/diagnostic/call-prep.js` | Discovery call prep sheet page |
| `lib/diagnostic-engine/v3/call-prep-generator.js` | Generates prep sheet content from metadata |

### Modified Files

| File | Change |
|------|--------|
| `pages/api/diagnostic/consultant.js` | Accept V2 IDs, fan out to original IDs via merge map |
| `components/diagnostic/v3/ConsultantForm.js` | Keep for backward compat, add link to new audit form |

### Unchanged

- `lib/diagnostic-engine/v3/constants-v3.js` — original 39 competencies untouched
- `lib/diagnostic-engine/v3/compute-scores-v3.js` — still works on original 39
- All grader files — untouched
- `diagnostic_results_v3` table — untouched
- All existing diagnostic results — backward compatible

### Data Flow

```
CRM Metadata (Supabase)
    │
    ├── ConsultantAuditForm
    │   ├── Reads: computed_signals, enhanced_signals, metadata
    │   ├── Runs: signalMapping per competency → suggested scores
    │   ├── Consultant confirms/overrides
    │   └── Saves: V2 IDs → fan out via merge map → consultant_assessments (V1 IDs)
    │
    └── Call Prep Sheet
        ├── Reads: metadata row
        ├── Runs: call-prep-generator
        └── Renders: snapshot + questions + gaps
```

## Implementation Plan

### Step 1: Consultant competency definitions
- Create `consultant-competencies.js` with all 14 V2 competencies
- Include: crmChecks, discoveryQuestions, rubric anchors, signalMapping functions, merge map
- Unit tests for merge map and signal mappings

### Step 2: Consultant API update
- Update `pages/api/diagnostic/consultant.js` to accept V2 IDs
- Fan out scores via merge map to V1 IDs in `consultant_assessments`
- Backward compatible — V1 IDs still accepted directly

### Step 3: ConsultantAuditForm component
- Build sequential checklist UI
- "What We Found" panel from signals
- CRM-specific check instructions (reads customer crm_type)
- Suggested scores with confirm/override
- Auto-advance on score
- Progress tracking

### Step 4: Call prep generator
- Create `call-prep-generator.js`
- Snapshot from metadata
- Questions mapped to V2 competencies
- Gaps from missing/concerning signals

### Step 5: Call prep page
- Create `pages/[slug]/diagnostic/call-prep.js`
- Clean layout with print CSS
- Auto-generated from customer metadata

## Metrics

- Consultant workload: 72 cells → ~21 cells (71% reduction)
- Items requiring research: ~6 (where no signal exists) vs ~8 confirm-only
- Time to complete: target <15 minutes (down from estimated 45-60)
- Discovery call prep: 0 → 1 auto-generated document per customer
