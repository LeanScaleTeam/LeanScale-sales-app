# Diagnostic v2 — User & Admin Guide

## Overview

The GTM Diagnostic v2 assesses your go-to-market operations across **17 items** in three layers:

| Layer | Weight | What It Measures |
|-------|--------|-----------------|
| **Foundation** (F1-F6) | 40% | CRM data model, pipeline design, lifecycle stages, automation, team structure, data enrichment |
| **Motions** (M1-M7) | 35% | Inbound lead flow, email/nurture, sales execution, attribution, deal-to-close, customer success, partner ops |
| **Maturity** (R1-R4) | 25% | Executive reporting, revenue metrics (Power 10), forecasting, win/loss analysis |

Each item is graded as **Healthy** (3), **Needs Attention** (2), or **Critical** (1). Foundation items are auto-graded from your HubSpot CRM data. Motion and Maturity items combine CRM signals with your intake form answers.

---

## For End Users

### Running the Diagnostic

#### Step 1: Start the Intake

Navigate to your diagnostic page and click **Run v2 Diagnostic** (or **Re-run Diagnostic** if you've run it before). This opens a guided intake form with 4 sections.

#### Step 2: Company Profile (Section A)

Answer 5 questions about your organization:
- Primary CRM (HubSpot, Salesforce, Other)
- Sales team size
- ARR range
- GTM motion (Inbound, Outbound, Product-led, etc.)
- Partner program status

These answers control which questions appear in later sections. For example, selecting "No" for partner program skips partner-related questions.

**Your answers are saved automatically** after each section. You can close your browser and come back later — your progress will be restored.

#### Step 3: Connect HubSpot (Section B)

If you selected HubSpot as your CRM, you'll see a **Connect HubSpot** button. This is how the diagnostic auto-grades your Foundation items.

1. Click **Connect HubSpot**
2. You'll be redirected to HubSpot to authorize access
3. After authorization, we download your CRM metadata (properties, pipelines, workflows, etc.)
4. You'll be redirected back to the intake form automatically

**What we access:** Read-only CRM metadata — property definitions, pipeline configurations, workflow structure, team/owner data. We do not access individual contact/deal records.

**If you skip this:** Foundation items will have limited grading data. We recommend connecting for the most accurate results.

**If connection fails:** You'll see an orange warning banner. You can continue without HubSpot or try connecting again.

#### Step 4: GTM Tools (Section B continued)

Select which tools your team uses (sales engagement, enrichment, lead routing, etc.) and answer follow-up questions about adoption and CRM integration for each.

#### Step 5: Processes (Section C)

Answer questions about your go-to-market processes: lead routing, MQL definitions, sales qualification, deal management, customer success handoffs, etc.

Questions are tailored based on your company profile. For example, product-led companies see PLG-specific questions instead of outbound questions.

#### Step 6: Reporting & Metrics (Section D)

Two parts:
1. **General reporting** — Dashboard usage, forecast methods, growth models
2. **Revenue Metrics (Power 10)** — For each of 10 key metrics (ARR, bookings, pipeline, MQLs, churn, GRR, NRR, conversion rates, cycle time), indicate whether you can report it: Automated, Manual calc, or Can't report

#### Step 7: Review & Submit

Review a summary of all your answers organized by section. You can click **Edit** on any section to go back and change answers.

When ready, click **Run Diagnostic**. The engine processes your answers and CRM data, then redirects you to the results page.

### Understanding Your Results

#### Overall Score

The results page opens with an executive summary showing:
- **Overall health score** (0-3 scale) displayed as an animated ring
- **Overall status**: Healthy, Needs Attention, or Critical
- **Layer scores**: Foundation, Motions, and Maturity each shown with their weight
- **Company profile badges**: Your CRM, team size, and ARR range

#### Layer View (Default)

Items are organized into 3 collapsible layers. Layers containing Critical items are automatically expanded so you can see what needs attention first.

Each item shows:
- **Status indicator** (green/yellow/red dot)
- **Item ID and name** (e.g., "F1: CRM Data Model")
- **Grade** (Healthy, Needs Attention, or Critical)
- **Source badge**: "CRM Auto-Graded", "CRM + Intake", or "Intake Graded"

Click any item to expand and see:
- **Description** — What this item measures
- **Signals** — Specific data points that influenced the grade (marked +/−/~ for positive/negative/neutral)
- **Recommendations** — Actionable next steps to improve
- **Related services** — Links to relevant service catalog entries

#### Table View

Switch to the Table tab for a flat sortable list of all 17 items. Columns: Name, Layer, Status, Priority. Click column headers to sort.

---

## For Admins

### Editing Grades

1. Click **Edit** in the navigation bar to enter edit mode
2. Each item now shows a cycle button (&#8635;) next to its status
3. Click the button to cycle through: Healthy → Needs Attention → Critical
4. **Changes auto-save** after 800ms of inactivity
5. **Scores automatically recompute** — layer and overall scores update based on your edits
6. Click **Exit Edit** when done

Use this to override auto-graded items when you have context the engine doesn't. For example, if the engine grades "Pipeline Design" as Healthy based on metadata, but you know the pipeline was recently restructured and isn't yet representative.

### Building a SOW

1. Make sure you're satisfied with the diagnostic grades (edit if needed)
2. Click **Build SOW** in the navigation bar
3. A Statement of Work is automatically generated with:
   - Executive summary based on scores and item count
   - Sections grouped by layer (Foundation Improvements, Motions Improvements, etc.)
   - Deliverables mapped from the service catalog
   - Hour estimates from catalog data (where available)
4. You'll be redirected to the SOW editor to review and customize

The SOW is linked to the diagnostic — if you later re-run or edit the diagnostic, you can update the SOW to reflect changes.

### Re-running the Diagnostic

Click **Re-run Diagnostic** on the results page to start a new intake. The existing diagnostic will be overwritten when the new one completes. Previous intake answers are preserved so you can update only what's changed.

### What Gets Saved

| Data | Storage | Retention |
|------|---------|-----------|
| Intake answers | `diagnostic_intake` table | Kept until overwritten by new intake |
| HubSpot tokens | `hubspot_connections` table | Refreshed automatically, revocable from HubSpot |
| CRM metadata | `hubspot_metadata` table | Snapshot at connection time; re-download via admin |
| Diagnostic result | `diagnostic_results` table | Overwritten on re-run |
| Admin edits | Same row in `diagnostic_results` | Scores recomputed on each edit |

---

## Scoring Methodology

### Item Grades

Each item is graded on a 3-point scale:

| Grade | Score | Meaning |
|-------|-------|---------|
| Healthy | 3 | Meets or exceeds best practices |
| Needs Attention | 2 | Partially implemented, room for improvement |
| Critical | 1 | Missing, broken, or significantly below standard |

### Layer Scores

Layer score = weighted average of item scores within that layer (items with "unable" status are excluded from the average).

### Overall Score

Overall score = weighted sum of layer scores:
- Foundation × 0.40
- Motions × 0.35
- Maturity × 0.25

### Overall Status

| Score Range | Status |
|-------------|--------|
| 2.5 - 3.0 | Healthy |
| 1.5 - 2.49 | Needs Attention |
| 1.0 - 1.49 | Critical |

---

## Item Reference

### Foundation Layer (F1-F6) — Auto-graded from CRM

| ID | Name | What's Measured |
|----|------|----------------|
| F1 | CRM Data Model | Custom properties across deals/contacts/tickets, enrichment field coverage |
| F2 | Pipeline Design | Stage count (ideal: 5-8), probability progression, stalled deal stage |
| F3 | Lifecycle & Lead Status | Lifecycle stage coverage, lead status workflows, cross-object sync |
| F4 | Automation Engine | Active workflow count, category diversity, task/deal automation |
| F5 | Team & Ownership | Team structure, owner coverage, orphaned owners |
| F6 | Data Enrichment | Enrichment tool presence, field count, multi-object coverage |

### Motions Layer (M1-M7) — CRM + Intake

| ID | Name | What's Measured |
|----|------|----------------|
| M1 | Inbound Lead Flow | Form count, lead routing, response time, MQL definition |
| M2 | Marketing Email & Nurture | Published emails, nurture workflows, dynamic list usage |
| M3 | Sales Execution | Stalled deal alerts, task automation, qualification framework |
| M4 | Attribution | Attribution workflows, deal source tracking, pipeline by source |
| M5 | Deal-to-Close | Competitor tracking, close reasons, closed-won automation |
| M6 | Customer Success | CS handoff process, onboarding, renewals, NPS tracking |
| M7 | Partner Operations | Partner pipeline, referral workflows (skipped if no partner program) |

### Maturity Layer (R1-R4) — Intake-graded

| ID | Name | What's Measured |
|----|------|----------------|
| R1 | Executive Reporting | Dashboard count and trust level |
| R2 | Revenue Metrics (Power 10) | Ability to report 10 key metrics (automated vs manual vs unable) |
| R3 | Forecasting & Planning | Forecast method, growth model completeness |
| R4 | Win/Loss Analysis | Competitor field, close-lost reasons, structured win/loss reviews |

---

## FAQ

**Q: How long does the intake take?**
A: About 5-8 minutes. Your progress is saved automatically so you can take breaks.

**Q: Do I need HubSpot to run the diagnostic?**
A: HubSpot connection is recommended for the most accurate Foundation scores. Without it, Foundation items will have limited grading data based on your intake answers alone.

**Q: Can I re-run the diagnostic later?**
A: Yes. Click "Re-run Diagnostic" on the results page. Your previous intake answers are preserved so you can update only what's changed.

**Q: Who can see my results?**
A: Results are scoped to your customer account. Only users with access to your account can view them.

**Q: Can admin edits be undone?**
A: Admin status changes take effect immediately. To revert, cycle the status back to its original value. Re-running the diagnostic resets all grades to engine-computed values.

**Q: What happens to my HubSpot data?**
A: We store a read-only snapshot of CRM metadata (property definitions, pipeline configs, workflow structure). We do not access individual contact or deal records. You can revoke access anytime from HubSpot Settings > Integrations.
