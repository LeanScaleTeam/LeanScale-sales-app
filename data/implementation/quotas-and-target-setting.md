# Quotas and Target Setting — Implementation

## Project One-Pager

### Project Type
- **Category:** Balanced (Strategy-leaning)
- **Primary Deliverable:** Data-driven quota allocation model with CRM-integrated attainment dashboards

### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Heavy | 3-5 refinement loops; data gathering, territory weighting, model building |
| 2. Engineering | Yes | Medium | CRM quota fields, attainment dashboards, visual indicators |
| 3. Enablement | Yes | Medium | Manager + rep rollout, methodology transparency training |
| 4. Handoff | Yes | Medium | Quarterly review cadence, maintenance schedule, ownership transfer |

### Phase Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. STRATEGY  │────▶│ 2. ENGINEER  │────▶│3. ENABLEMENT │────▶│  4. HANDOFF  │
│    Heavy     │     │    Medium    │     │    Medium    │     │    Medium    │
│ 1a→1b→1c→1d │     │ 2a→2b→2c→2d │     │ 3a→3b→3c→3d │     │ 4a→4b→4c→4d │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
3-5 refinement       CRM quota fields     Manager + rep        Quarterly review
loops, model build   attainment dashbds   rollout + training   cadence + transfer
```

**Project flow:** Full 4-phase execution with heavy strategy (data analysis, model building, scenario testing), medium engineering (CRM configuration and dashboards), medium enablement (leadership + rep rollout), and standard handoff. Some customers may extend Phase 1 if territory redesign is needed upstream. Phase 2 may be light if the customer only wants the strategic model without CRM integration.

---

## Pre-Kickoff (1a)

### Track A: Customer Homework

**Checklist:**
- [ ] Watch intro video explaining quota modeling and data-driven allocation importance
- [ ] Complete intake form: current quota methodology, headcount, territory structure, revenue targets
- [ ] Provide CRM admin access for historical data pull (12-24 months closed-won data)
- [ ] Get stakeholder sign-off on Definition Alignment Document
- [ ] Share approved headcount plan with new hire start dates

### Track B: Architect Prep

**Checklist:**
- [ ] Pull 12-24 months of CRM closed-won data (deal size, close date, rep assignment, territory)
- [ ] Calculate baseline metrics by rep: win rate, average deal size, sales cycle length, total bookings
- [ ] Segment data by territory and identify performance variation patterns
- [ ] Run gap analysis on current quota methodology vs. best practices
- [ ] Create v0 quota model with ASSUMED territory weights and blended allocations

### Stakeholder Alignment Document

Get stakeholder sign-off on terms **before** building the model.

| Term | Our Definition | Internally Approved? |
|------|----------------|----------------------|
| Quota | Individual revenue target for a defined period, allocated from company ARR goals | [ ] Yes / [ ] No |
| Quota Attainment | Actual closed-won bookings / quota target, expressed as percentage | [ ] Yes / [ ] No |
| Territory Weight | Multiplier normalizing quota allocation based on market potential, account density, and win rates | [ ] Yes / [ ] No |
| Ramp Period | Graduated quota expectations for new hires until full productivity (typically 3-6 months) | [ ] Yes / [ ] No |
| Pipeline Coverage | Active pipeline value / quota; minimum 3x required for healthy attainment probability | [ ] Yes / [ ] No |
| New Business | Revenue from net-new logos, not previously a customer | [ ] Yes / [ ] No |
| Expansion Revenue | Revenue from existing customers via upsell, cross-sell, or seat expansion | [ ] Yes / [ ] No |

**Instructions to customer:**

Review each definition with your VP of Sales and CRO. Check "Yes" when approved. We cannot proceed with model building until all terms are aligned. Disagreements on definitions—especially what counts as "new business" vs. "expansion"—will cause quota allocation disputes later.

---

## Refinement Loop (1b → 1c → 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present v0 model, validate historical data, confirm targets | VP Sales, CRO, RevOps | Corrections for v1 |
| Data Validation | 1c | Clean data issues, confirm territory definitions | RevOps, Sales Ops | Validated data set |
| Model Review | 1c | Review territory weights, ramp schedules, segment splits | VP Sales, Finance | Refined model v2 |
| Back-Test Review | 1c | Present back-test results and scenario analysis | VP Sales, CRO | Approved methodology |
| Sign-Off | 1d | Final model approval, confirm individual rep quotas | VP Sales, CRO, RevOps | Signed-off quota allocations |

---

## Phase Checklists

### Phase 1: Strategy

- [ ] 1a. Pre-Kickoff complete (Track A + Track B)
- [ ] 1b. Kickoff call held, v0 presented
- [ ] 1c. Refinement loop complete (data validated, model iterated, back-tested)
- [ ] 1d. Strategic sign-off on final quota allocations

### Phase 2: Engineering

- [ ] 2a. Tech spec created for CRM quota fields and dashboards
- [ ] 2b. Engineering handoff meeting held
- [ ] 2c. CRM quota tracking configured and dashboards built
- [ ] 2d. QA/Test + customer sign-off on dashboards

### Phase 3: Enablement

- [ ] 3a. Training materials prepped (manager talking points, rep communication package)
- [ ] 3b. Training sessions delivered (leadership rollout + rep Q&A)
- [ ] 3c. Hypercare period complete (first quota period monitoring)
- [ ] 3d. Enablement sign-off

### Phase 4: Handoff

- [ ] 4a. Maintenance schedule documented and handed off
- [ ] 4b. Internal handoff (SME → Architect) complete
- [ ] 4c. External handoff complete
- [ ] 4d. Project closed and archived

---

## Document Types

### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| Historical data extract | Baseline performance metrics by rep/territory | All data quality issues resolved |
| Territory weighting worksheet | Score and weight territories for fair allocation | Weights validated by sales leadership |
| Blended quota model spreadsheet | Calculate individual rep quotas | Top-down and bottom-up reconciled |
| Ramp schedule table | Define quota expectations for new hires | All planned hires accounted for |
| Back-test analysis | Validate model against historical data | 70-80% attainment confirmed |

### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| Quota allocation model | Blended model + back-test | Individual rep quota assignments |
| Methodology documentation | Territory weights + model | Transparency for reps and leadership |
| CRM attainment dashboards | Tech spec + model | Real-time quota tracking |
| Quota communication package | Model + methodology | Rep-level rollout and FAQ |

---

## Enablement Details

### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Leadership | VP Sales, CRO, Sales Managers | Methodology walkthrough, how to use dashboards, talking points for rep conversations | 60 min |
| Manager | Front-line Sales Managers | Individual rep quotas, territory weights, ramp schedules, handling rep objections | 45 min |
| Rep-facing | All quota-carrying reps | How quota was calculated, where to track progress, Q&A | 30 min |
| Technical | RevOps, Sales Ops Admin | CRM configuration, dashboard maintenance, quarterly refresh process | 60 min |

### Hypercare

- **Applies:** Yes
- **Duration:** 4-6 weeks (first month of quota period)
- **Office Hours:** Yes — weekly 30-min slot for first 4 weeks post-rollout

### Training Assets to Create

- [ ] Video walkthrough: Quota methodology walkthrough for managers
- [ ] Video walkthrough: CRM dashboard navigation and attainment tracking
- [ ] Doc: Manager talking points for rep-level quota conversations
- [ ] Doc: Rep FAQ — how quotas were set and how to track progress
- [ ] Doc: RevOps runbook — how to run quarterly quota refresh

---

## Handoff & Retention

### Internal Handoff (SME → Architect)

**Key context for Architect:**
- Quota methodology
- Territory weighting factors
- Ramp schedule logic
- Which reps flagged concerns during rollout

**Escalation trigger:** Any structural model change (territory redesign, segment addition, mid-period quota adjustment for more than 1 rep)

### External Handoff

**Final meeting agenda:**
- Methodology review
- Dashboard walkthrough
- Maintenance schedule
- Quarterly review cadence setup

**Documentation package:**
- Quota model workbook
- Methodology runbook
- CRM config notes
- Training recordings
- FAQ

### Maintenance Schedule

- Monthly attainment tracking
- Quarterly model review
- Annual recalibration
- **Ownership:** Single project = customer RevOps owns | Dedicated = Architect owns

### Retention/Expansion Path

**If Single Project:**
Upsell: Managed Services (ongoing quota calibration + territory optimization) → if no → Downsell: Commission Plan Design or Forecasting Process project → Retry retainer

**If Multi-Project (Dedicated):**
- Refinement check-in scheduled: End of Q1 (first full quarter under new quotas)
- Internal prep trigger: 2 weeks before check-in
- Decision: Architect handles attainment review / SME needed for model restructuring

---

## Key Assets

| Asset | When Used |
|-------|-----------|
| Quota model template (XLSX) | Phase 1 — model building |
| Territory weighting worksheet | Phase 1 — territory scoring |
| CRM dashboard spec template | Phase 2 — engineering |
| Quota communication template | Phase 3 — rep rollout |
| Quarterly review agenda template | Phase 4 — maintenance cadence |

---

## Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| Quota | The revenue target assigned to an individual rep for a defined period (monthly, quarterly, annual) |
| Quota Attainment | Actual bookings divided by quota, expressed as a percentage |
| Territory Weight | A multiplier (e.g., 0.7x-1.3x) applied to normalize quotas based on territory market potential |
| Ramp Schedule | Graduated quota expectations for new hires (e.g., 25%/50%/75%/100% over 4 months) |
| Blended Model | Quota methodology combining top-down revenue targets with bottom-up capacity analysis |
| Pipeline Coverage | Ratio of pipeline value to quota; 3x coverage is the standard B2B SaaS benchmark |
| Quota-to-OTE Ratio | The ratio of a rep's quota to their on-target earnings; typically 4-6x for B2B SaaS field sales |
| Back-Test | Applying proposed quotas to historical performance data to validate achievability |

---

## Common Gotchas

- Quotas set by arbitrary percentage increase ("add 10% to last year") without data validation — always back-test against historical data first
- Identical quotas assigned regardless of territory size or market maturity — use territory weighting factors to normalize for equivalent opportunity
- New hire quotas not prorated — build explicit ramp schedules and exclude ramping reps from full team quota calculations
- Methodology not communicated to reps — share the data, logic, and assumptions during rollout; transparency drives buy-in
- Quota model built before territories are finalized — confirm territory definitions are locked before building allocation model
- Mid-quarter territory changes without quota adjustment — define triggers and process for mid-period quota revisions upfront

---

## Methodology Options

| Option | When to Use | Complexity |
|--------|-------------|-----------|
| Top-Down Only | Early-stage company, <5 reps, simple territory structure | Low |
| Blended (Top-Down + Bottom-Up) | Growth-stage company, 5-50 reps, defined territories | Medium |
| Segment-Weighted Blended | Multi-segment org (SMB + MM + Enterprise), product-based splits | High |

---

# Phase 1: Strategy

**Goal:** Get stakeholder sign-off on the quota allocation model, territory weights, ramp schedules, and individual rep quotas.

**Output:** Approved quota allocation model + Definition Alignment Document (signed off by VP Sales/CRO).

## 1a. Pre-Kickoff

Two parallel tracks run after the deal closes and before the kickoff call.

### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video | Explain quota methodology and why data-driven allocation matters | Video walkthrough (5-10 min) |
| Definition Alignment Document | Get sign-off on quota, attainment, territory weight, ramp definitions | Google Doc |
| Pre-filled intake form | Confirm revenue targets, headcount, territory structure, current methodology | Google Form or Doc |

**Quota-specific homework items:**

- Provide approved annual/quarterly revenue targets from leadership
- Share current territory definitions with account assignments per rep
- List all planned new hires with expected start dates
- Share current comp plan framework (OTE, quota-to-OTE ratio guidelines)
- Provide CRM admin credentials for historical data pull

**Completion tracking:** RevOps lead owns follow-up. Do not cancel kickoff if incomplete, but CRM access is a hard blocker for Track B.

### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Export 12-24 months CRM data (closed-won, pipeline, conversions) | Raw data set |
| 2 | Calculate baseline metrics by rep and territory | Performance summary tables |
| 3 | Audit current quota methodology | Gap analysis (current vs. best practice) |
| 4 | Build v0 quota model with ASSUMED territory weights | `quota-model-v0.xlsx` |
| 5 | Prepare kickoff assets (model walkthrough, questions list) | Kickoff presentation deck |

**Data extraction checklist:**

- Closed-won deals: deal size, close date, rep, territory, product/segment
- Pipeline data: stage, probability, expected close date, amount
- Conversion rates: opportunity-to-close by rep and territory
- Rep tenure data: start dates, ramp status, territory history
- Flag data quality issues: missing assignments, incomplete territory tags, orphaned records

**Critical:** Mark every assumption in v0 as ASSUMED. The kickoff validates.

### Stakeholder Alignment Document

Get stakeholder sign-off on terms **before** building the model.

| Term | Our Definition | Internally Approved? |
|------|----------------|----------------------|
| Quota | Individual revenue target for a defined period, allocated from company ARR goals | [ ] Yes / [ ] No |
| Quota Attainment | Actual closed-won bookings / quota target, expressed as percentage | [ ] Yes / [ ] No |
| Territory Weight | Multiplier normalizing quota allocation based on market potential, account density, and win rates | [ ] Yes / [ ] No |
| Ramp Period | Graduated quota expectations for new hires until full productivity (typically 3-6 months) | [ ] Yes / [ ] No |
| Pipeline Coverage | Active pipeline value / quota; minimum 3x required for healthy attainment probability | [ ] Yes / [ ] No |
| New Business | Revenue from net-new logos, not previously a customer | [ ] Yes / [ ] No |
| Expansion Revenue | Revenue from existing customers via upsell, cross-sell, or seat expansion | [ ] Yes / [ ] No |

**Instructions to customer:**

Review each definition with your VP of Sales and CRO. Check "Yes" when approved. We cannot proceed with model building until all terms are aligned. Disagreements on definitions—especially what counts as "new business" vs. "expansion"—will cause quota allocation disputes later.

---

## 1b. Kickoff Call

**Purpose:** Present v0 quota model and validate assumptions. We walk in with a draft model — customer reacts and corrects, not creates from scratch.

### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through v0 model | "Here's what we built from your data and intake form" |
| 15-30 | Validate data & assumptions | Confirm revenue targets, territory definitions, headcount plan |
| 30-40 | Definition alignment | Review Definition Alignment Document |
| 40-50 | Current state gaps | Discuss audit findings — where current methodology falls short |
| 50-60 | Data quality issues | Review flagged data problems, assign cleanup owners |
| 60+ | Next steps | Schedule refinement meetings, assign homework |

### What We Bring

- v0 quota model (built in Track B prep)
- Historical performance summary tables by rep and territory
- Gap analysis of current quota methodology
- Questions list (what we need validated)
- Definition Alignment Document (pre-filled with our recommendations)

### What We Leave With

- Confirmed or corrected revenue targets and growth expectations
- Validated territory definitions (or identified changes needed)
- Data quality cleanup assignments with owners and deadlines
- Confirmed headcount plan with start dates
- Alignment loop scheduled

---

## 1c. Alignment Loop & Strategic Meeting Cadence

**Purpose:** Iterate on the quota model until all inputs are **CONFIRMED** and back-testing validates achievability.

### The Pattern

```
Kickoff (gather info, validate data)
    |
Process notes --> v1 (cleaned data, refined weights)
    |
Data Validation Meeting (confirm territories, fix data) --> v2
    |
Model Review Meeting (territory weights, ramp, segments) --> v3
    |
Back-Test Review (historical validation, scenarios) --> finalize
    |
Sign-Off --> Approved quota allocations
```

### Meeting Types for Quotas and Target Setting

| Meeting Type | Focus | Stakeholder |
|--------------|-------|-------------|
| Data Validation | Clean data, confirm territory definitions, validate baselines | RevOps, Sales Ops |
| Model Review | Territory weights, ramp schedules, segment splits, role quotas | VP Sales, Finance |
| Back-Test Review | Historical attainment simulation, scenario analysis | VP Sales, CRO |
| Final Review | Individual rep quotas, sign-off | VP Sales, CRO, RevOps |

### Before Each Meeting

1. Process previous meeting transcript/notes
2. Update quota model (v[n-1] → v[n])
3. Prepare specific questions for next validation round

### During Each Meeting

1. Walk through current model version
2. Capture corrections (territory boundaries, data fixes, weight adjustments)
3. Validate what moved from ASSUMED to CONFIRMED
4. Identify remaining ASSUMED items

### After Each Meeting

1. Update model with meeting outputs
2. Track ASSUMED → CONFIRMED progression
3. Update model and working documents

### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 3-5 days (data extraction + v0 model building) |
| Kickoff call | Day 1 of engagement |
| Data validation | Week 1 (depends on data quality) |
| Model review iterations | Weeks 2-3 (2-3 meetings typical) |
| Back-test and scenario review | Week 3-4 |
| Final review + sign-off | When all inputs CONFIRMED and back-test passes |

---

## 1d. Strategic Sign-Off

**Purpose:** Confirm the quota model is complete and defensible before proceeding to CRM configuration.

### Validation Checkpoint

- Definition Alignment Document signed off by VP Sales and CRO
- Historical data cleaned and validated
- Territory weighting factors confirmed by sales leadership
- Blended model reconciled (top-down total = sum of bottom-up allocations)
- Back-test shows 70-80% of reps would have hit quota historically
- Ramp schedules defined for all planned new hires
- Segment and role variations documented (AE vs. SDR vs. AM quotas)
- Individual rep quotas reviewed and approved
- No data blockers for engineering

### Decision Point

- **Proceed to Engineering** — Customer wants CRM integration and attainment dashboards
- **Project complete at Phase 1** — Some customers only need the strategic model (spreadsheet-based); CRM configuration is optional or handled internally

---

# Phase 2: Engineering

**Goal:** Configure CRM quota tracking and build real-time attainment dashboards based on the approved model.

**Output:** CRM reflecting individual quotas with live attainment tracking visible to reps and managers.

| Project Type | Engineering Weight | What Gets Built |
|--------------|-------------------|-----------------|
| Full (typical) | Medium (30-40%) | Quota fields, attainment dashboard, visual indicators |
| Light | Light (10-20%) | Quota fields only, customer builds own reports |

## Sub-Phases

```
2a Tech Spec --> 2b Engineering Handoff --> 2c Build --> 2d Test
```

---

## 2a. Tech Spec

**Purpose:** Translate the approved quota model into CRM field specifications and dashboard designs.

**Input:** Signed-off quota model, territory weights, ramp schedules, individual rep quotas

**Output:** Draft tech spec containing:

- Custom quota fields: annual quota, period quota (monthly/quarterly), quota type (new biz, expansion, renewal)
- Attainment calculation logic: current bookings / period quota
- Dashboard specifications: rep-level and manager-level views
- Visual indicators: red (<60% attainment), yellow (60-90%), green (>90%)
- Ramp schedule automation: prorated quotas for new hires based on start date
- Data integration: which CRM objects feed attainment calculations

**CRM-specific considerations:**

| CRM | Quota Setup Approach |
|-----|---------------------|
| Salesforce | Use Forecasting Quotas (Setup > Forecast Settings) or custom number fields on User object. Build attainment reports via CRM Analytics or native reports |
| HubSpot | Use Goals tool (Sales > Goals) for target tracking. Build custom reports for attainment dashboards |

---

## 2b. Engineering Handoff

**Purpose:** Review tech specs with engineer before building.

**Who attends:** Architect + Engineer (or RevOps admin)

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through specs | Architect explains strategic context + quota model logic |
| 15-30 | Engineer questions | Clarify field types, calculation methods, dashboard scope |
| 30-45 | Refine and approve | Adjust specs for CRM-specific constraints |

**What Architect brings:**

- Approved quota model (for context)
- Draft tech spec (from 2a)
- Individual rep quota values (for data load)

**What engineer leaves with:**

- Approved tech spec
- Clear build sequence (fields first, then data load, then dashboards)
- Known dependencies (e.g., territory object must exist, user roles configured)

---

## 2c. Build (Configure)

**Purpose:** Configure CRM quota tracking and build attainment dashboards.

**Input:** Approved tech spec from 2b

**Build sequence:**

| Step | Component | What Gets Built |
|------|-----------|-----------------|
| 1 | Custom quota fields | Annual quota, period quota, quota type on User/Opportunity Owner |
| 2 | Data load | Load approved quota values for each rep/territory |
| 3 | Attainment calculations | Formula fields or report calculations (bookings / quota) |
| 4 | Rep-level dashboard | Current bookings, quota, attainment %, gap to quota |
| 5 | Manager-level dashboard | Team roll-up, red/yellow/green indicators, ramp tracking |
| 6 | Visual indicators | Conditional formatting for at-risk, on-track, exceeding |

**Build tracking:**

- Custom quota fields created
- Quota values loaded for all reps
- Attainment calculation formulas tested
- Rep-level dashboard built and tested
- Manager-level dashboard built and tested
- Visual indicators configured (red/yellow/green thresholds)
- Ramp schedule automation configured (if applicable)

---

## 2d. QA / Test + Sign-Off

**Purpose:** Verify the CRM build works and get customer approval.

**Technical testing checklist:**

- All quota fields populated with correct values per rep
- Attainment calculation matches manual calculation (bookings / quota = expected %)
- Dashboard filters work correctly (by rep, territory, time period, segment)
- Visual indicators trigger at correct thresholds (red <60%, yellow 60-90%, green >90%)
- Ramp schedule prorations calculate correctly for new hires
- Manager roll-up totals match sum of individual reps
- Dashboard loads within acceptable time (<5 seconds)

**Customer testing:**

- Walk VP Sales and RevOps through dashboards
- Have managers test filtering by their team
- Verify a sample of individual rep quotas against the approved model
- Capture feedback, fix issues

**Engineering sign-off checkpoint:**

- CRM configuration matches tech spec
- All technical tests passing
- Customer has tested and approved dashboards
- Ready for enablement (rollout to broader team)

**Decision point:**

- **Proceed to Enablement** — Dashboards approved, ready for team rollout
- **Loop back to Build** — Dashboard issues, calculation errors, or missing fields

---

# Phase 3: Enablement

**Goal:** Sales leadership, managers, and reps understand their quotas, the methodology behind them, and how to track progress.

**Output:** Trained team with documentation, no open questions about quota methodology, all reps with dashboard access.

## Sub-Phases

```
3a Training Prep --> 3b Training Sessions --> 3c Hypercare --> 3d Enablement Sign-Off
```

---

## 3a. Training Prep

**Purpose:** Create communication and training materials from the quota model and methodology documentation.

**Input:** Approved quota model + methodology doc + CRM dashboards

**Output:** Training package containing:

- **Manager talking points:** How each rep's quota was calculated, territory weight rationale, how to handle rep questions
- **Rep communication package:** Individual quota letter template, methodology summary, FAQ
- **Video walkthrough scripts:** Quota methodology walkthrough, CRM dashboard navigation
- **RevOps maintenance guide:** How to update quotas, run quarterly reviews, handle mid-period adjustments
- **FAQ draft:** Common questions (Why is my quota higher than last year? How does territory weighting work? What happens if I switch territories?)

---

## 3b. Training Sessions

**Purpose:** Roll out quotas to the organization with transparency and buy-in. Research shows that when reps perceive quotas as challenging but attainable and understand the methodology, they judge performance expectations as fair — reducing turnover intentions.

**Session sequence (order matters):**

| Session | Audience | Focus | Duration |
|---------|----------|-------|----------|
| 1 | VP Sales + CRO | Final methodology review, confirm rollout messaging | 30 min |
| 2 | Front-line Managers | Individual team quotas, territory weights, talking points for rep 1:1s | 45 min |
| 3 | All quota-carrying reps | Methodology overview, individual quota communication, dashboard access, Q&A | 30 min |
| 4 | RevOps / Sales Ops | CRM configuration walkthrough, maintenance procedures, quarterly refresh | 60 min |

**Training delivery:**

1. Leadership first — they need to be aligned before managers hear quotas
2. Managers second — they carry quotas to their reps, need talking points
3. Reps third — they hear it from their managers (1:1) first, then attend group Q&A
4. RevOps last — technical handoff for ongoing maintenance

**Output:**

- Trained stakeholders at all levels
- Video walkthrough recordings for future reference
- Questions log (feeds into FAQ updates)

---

## 3c. Hypercare

**Purpose:** Monitor the first quota period to catch issues early and build confidence in the model.

**Duration:** 4-6 weeks (first month of new quota period)

**What happens:**

- Weekly attainment pulse check — are reps tracking to expected pace?
- Office hours: weekly 30-min slot for manager/rep questions
- Dashboard troubleshooting — are calculations rendering correctly with live data?
- Early warning flag: if more than 30% of reps are below 50% attainment pace in first month, investigate root cause (market shift, data error, or model issue)

**When to skip:** If the project is strategic-only (Phase 2 was skipped and customer is self-managing quotas in spreadsheets), hypercare may be limited to one check-in call.

**Output:** Stabilized quota system, confidence in the model, no critical issues outstanding

---

## 3d. Enablement Sign-Off

**Purpose:** Confirm the sales organization can operate under the new quotas independently.

**Validation checkpoint:**

- All training sessions delivered (leadership, managers, reps, RevOps)
- Training recordings and documentation provided
- Hypercare period complete
- No critical dashboard issues outstanding
- Reps have self-service access to attainment dashboards
- RevOps can run quarterly quota refresh independently
- FAQ document covers all questions raised during rollout
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** — Organization enabled, system stable
- **Extend Hypercare** — Significant questions or dashboard issues remain

---

# Phase 4: Handoff

**Goal:** Clean project close with quarterly review cadence established, maintenance plan documented, and retention/expansion path set.

**Output:** Maintenance schedule documented, internal context transferred, customer owns the quota system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule --> 4b Internal Handoff --> 4c External Handoff --> 4d Project Close
                              (SME --> Architect)      (to Customer)          (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|---------------------|---------------|
| Single Project | Customer owns | 4c (External Handoff) — customer RevOps receives schedule and runs it themselves |
| Dedicated (Multi-Project) | Architect owns | 4b (Internal Handoff) — Architect receives schedule and manages quarterly reviews for customer |

---

## 4a. Maintenance Schedule

**Purpose:** Document what needs ongoing attention to keep quotas relevant and the system accurate.

### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|--------------------|
| Attainment pulse check | Current attainment % vs. expected pace for the period | >30% of reps below 50% pace at month-end |
| Pipeline coverage review | Pipeline-to-quota ratio by rep | Any rep below 2x coverage for next period |
| New hire ramp tracking | Ramping reps vs. expected milestone (25/50/75/100%) | Rep >30 days behind ramp milestone |
| Territory balance check | Are any territories significantly over/under-performing? | >20% variance from territory weight prediction |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|---|---|
| Full attainment analysis | End-of-quarter attainment rates vs. 70-80% target | If <50% attainment, investigate model assumptions |
| Territory weight validation | Do actual results confirm territory scoring was accurate? | Adjust weights for next period if >15% variance |
| Ramp schedule accuracy | Did new hires track to modeled ramp curve? | Adjust ramp milestones if consistent under/over |
| Headcount plan reconciliation | Actual hires vs. planned; departures and backfills | Recalculate team quota coverage |
| Quota-to-OTE ratio check | Is the ratio still within 4-6x target range? | Flag to compensation team if drifting |

**After First Business Cycle (End of Q1):**

- Full attainment analysis: did the model predict actual performance within +/-10%?
- Pipeline-to-bookings validation: did pipeline created in first period convert at expected rate?
- New hire productivity check: are new hires tracking to modeled ramp curve?
- Key question: Is overall team on track for annual revenue target? If gap, is it pipeline volume, conversion rate, quota allocation, or timing?

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Attainment rate drop | <50% of reps hitting quota for 2+ months | Re-engage SME; investigate model vs. market vs. execution |
| Territory imbalance | Any territory >25% over/under plan | Re-score territory weights, consider realignment |
| Headcount change | >2 unplanned departures or hires in quarter | Recalculate team quota distribution |
| Market shift | Win rates drop >10 points from baseline | Scope quota recalibration project |

**Every 6-12 Months:**

- Full model recalibration: update all conversion rates, sales cycles, and efficiency ratios with fresh historical data
- Territory weight refresh: re-score all territories with updated market data
- Segment mix review: has the segment mix shifted? May require quota redistribution across SMB/MM/Enterprise
- Annual quota planning: feed updated model into next fiscal year's quota cycle

---

## 4b. Internal Handoff (SME → Architect)

**Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- Quota methodology and rationale (why blended, why these territory weights)
- Which reps flagged concerns during rollout and what their issues were
- Dashboard location and how to read attainment reports
- Common questions from rollout FAQ
- **Maintenance schedule** (if Dedicated engagement — Architect runs quarterly reviews)

**Escalation guidelines:**

| Issue Type | Who Handles | Example |
|-----------|-----------|---------|
| Dashboard filter questions, access issues | Architect | "Rep can't see their attainment number" |
| Individual quota adjustments (<3 reps) | Architect (with RevOps) | "Rep changed territories mid-quarter" |
| Model restructuring, territory redesign | SME (re-engage) | "We're adding a new market segment" |
| Annual quota recalibration | SME (scope new engagement or refinement project) | "Need to rebuild model for next fiscal year" |

**For Dedicated engagements:** Architect receives the maintenance schedule (4a) and becomes responsible for quarterly review execution. SME walks Architect through each task.

---

## 4c. External Handoff

**Purpose:** Formal project completion with customer.

**Final project meeting:**

- Review what was delivered (model, dashboards, documentation)
- Walk through quarterly review cadence and agenda template
- Walk through maintenance schedule
- Confirm nothing outstanding
- Answer final questions
- Make it explicit: "Project complete"
- **For Single Project engagements:** Hand over the maintenance schedule and walk customer RevOps through every task

**Documentation package:**

- Quota model workbook (XLSX with all calculations visible)
- Methodology documentation (territory weights, ramp schedules, segment splits, back-test results)
- CRM configuration notes (which fields, where, how calculations work)
- Definition Alignment Document (final version)
- All training video recordings
- FAQ document
- Maintenance schedule with quarterly review agenda template
- Support contact info

**For Single Project engagements:** Record a video walkthrough of the maintenance schedule. This is the customer's operating manual for quarterly quota reviews.

**Output:** Customer owns the quota system. Project formally complete.

---

## 4d. Project Close

**Purpose:** Clean internal wrap-up + establish retention/expansion path.

### Archive Checklist

- All project artifacts saved to proper location
- Handoff documentation complete
- Project status updated in tracking system
- Time/billing finalized

### Internal Debrief (Optional but Recommended)

- What went well? (methodology buy-in, data quality, stakeholder engagement)
- What would we do differently? (data gaps, timeline, meeting cadence)
- Any learnings to feed back into quota model SOPs?

### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| Single Project | Upsell → Downsell → Retry |
| Multi-Project (Dedicated) | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (ongoing quota calibration + territory optimization retainer)
   | if no
2. Downsell: Another one-time project (Commission Plan Design, Forecasting Process, Territory Design)
   | if yes
3. Retry retainer at end of next project cycle
```

**Script:**

"Now that your quota model is live and reps are tracking attainment, there are two ways we can continue working together. Option 1: We can set you up on managed services where we handle quarterly recalibration, territory optimization, and annual planning. Option 2: If there's a specific adjacent project — like commission plan design or forecasting process — we can scope that out. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

"At the end of Q1 [specific date], we'll review attainment results under the new model and determine if any adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull attainment data, assess: Is the model tracking? |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points with data. |

**At the refinement check-in:**

- Review attainment rates against 70-80% target
- Identify territories or reps significantly over/under quota
- If minor: Architect adjusts individual quotas with RevOps
- If major: Scope recalibration project (restart the assembly line)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

# Deliverables & Assets Summary

**Strategic Deliverables:**

- Quota allocation model (XLSX workbook with all calculations, territory weights, ramp schedules, segment splits)
- Methodology documentation (how quotas were set, data sources, weighting rationale)
- Back-test analysis (historical validation results)
- Definition Alignment Document (final approved version)
- Scenario analysis (best-case, expected, worst-case)

**Technical Deliverables (Phase 2):**

- CRM custom quota fields (annual and period quotas per rep)
- Rep-level attainment dashboard (bookings, quota, attainment %, gap)
- Manager-level attainment dashboard (team roll-up, red/yellow/green indicators)
- Ramp tracking view (new hire progress against milestones)

**Documentation Package:**

- Training video recordings (methodology walkthrough, dashboard navigation, maintenance guide)
- Manager talking points document
- Rep FAQ document
- RevOps maintenance runbook
- Quarterly review agenda template
- Maintenance schedule

---

# Appendix

## Roles

| Role | What They Do |
|------|--------------|
| **Architect** | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| **Engineer** | CRM build, automation, dashboards (Phase 2) |
| **SME** | Project/implementation team brought in for project-specific work |

---

## What Each Phase Produces

| Phase | Output | Gate Criteria |
|-------|--------|--------------|
| **Phase 1: Strategy** | Signed-off quota model (allocations, weights, ramp schedules) | VP Sales/CRO approved; back-test shows 70-80% attainment; definitions aligned |
| **Phase 2: Engineering** | CRM quota tracking + attainment dashboards | Dashboards match model, all tests pass, customer approved |
| **Phase 3: Enablement** | Trained organization (leadership, managers, reps, RevOps) | All training delivered, hypercare complete, team can track independently |
| **Phase 4: Handoff** | Independent customer + archived project | Quarterly review cadence set, maintenance plan in place, project closed |

---

## How to Adapt Per Project Type

Quotas and Target Setting is a **balanced project (strategy-leaning)**. Strategy is the heaviest phase because the model must be data-validated and stakeholder-approved before any CRM work begins. Engineering is medium — dashboard configuration is straightforward once the model is locked. Enablement is medium — quota rollout is high-stakes politically and requires careful sequencing (leadership first, then managers, then reps).

**Adaptation rules:**

- If customer only needs the strategic model (spreadsheet-based, no CRM integration), Phase 2 can be marked `[SKIP]` or `[LIGHT]`
- If territories need redesign, that is a separate upstream project — do not attempt to redesign territories and set quotas simultaneously
- If customer has an existing quota system in CRM, Phase 2 focuses on reconfiguration rather than net-new build

---

## Key Industry Context

The quota attainment challenge is acute: as of 2024, average B2B quota attainment sits at approximately 43%, and only about 30% of reps hit their full annual quota. Sales quotas rose 37% in 2024 compared to the prior year, compressing attainment further. The median quota-to-OTE ratio is 4.2x, with a typical range of 3.2-4.8x for B2B SaaS. New sales hire ramp time averages 5.7 months for SaaS AEs, up from 4.3 months in 2020. These benchmarks directly inform the model: quotas must be data-validated, not arbitrary, to avoid the 57% miss rate that plagues most organizations.

The cost of getting quotas wrong is not just missed revenue — it is turnover. Average annual B2B sales rep turnover is 13.9%, with a reported average cost per turnover of $97,690. Unfair quotas are a direct driver: academic research confirms that perceived quota fairness is significantly related to turnover intentions.

---

## Phase Guides

### Phase 1: How We Create Value in Quotas Strategy

**1. We educate.** Most sales leaders do not understand territory weighting, blended modeling, or what "defensible" quota methodology looks like. We educate them on these concepts so they can make informed decisions about their team's targets.

**2. We drive alignment.** Quota disputes happen when VP Sales, Finance, and individual managers disagree on what's "fair." The Definition Alignment Document and back-test results create a shared foundation that prevents mid-quarter arguments.

**3. We come with an opinion.** We show up with v0 built on their data. We recommend territory weights based on what we have seen work. They are confirming and adjusting, not starting from a blank spreadsheet.

**4. We show best practices.** We anchor in industry benchmarks: 70-80% attainment target, 4-6x quota-to-OTE ratio, 3x pipeline coverage, graduated ramp schedules. These are not arbitrary — they are proven across dozens of B2B SaaS implementations.

**Why Definition Alignment Matters for Quotas:** Quotas fail politically when stakeholders disagree on what "counts." Does a multi-year deal count at full value in Year 1? Does expansion revenue go to the AE or the AM? Is a renewal a "booking"? Getting sign-off on these definitions **before** building the model prevents rework and trust erosion.

**The Back-Test:** The back-test is the single most powerful tool for building quota credibility. By applying proposed quotas to historical data, you can show leadership: "Under this methodology, 75% of your reps would have hit quota last year." This transforms the conversation from "these numbers feel too high" to evidence-based validation. If the back-test shows <60% attainment, the model needs adjustment before rollout.

### Phase 2: Engineering for Quotas Is Configuration, Not Development

This is a configuration project, not a software development project. The CRM build involves:

- Creating custom fields (number fields on User or custom objects)
- Loading data (quota values per rep per period)
- Building reports and dashboards (standard CRM reporting tools)
- Setting up visual indicators (conditional formatting)

No custom code required for most implementations. Salesforce Forecasting Quotas and HubSpot Goals provide native quota tracking — the question is whether native tools meet the specificity of the model or custom configuration is needed.

### Phase 3: Why Quota Rollout Sequencing Matters

Quota communication is a political event. Reps will compare numbers with each other. Managers will be asked to defend allocations they did not set. The sequencing — leadership, then managers, then reps — gives each layer time to understand and prepare before the next layer hears the numbers.

The methodology transparency is not optional. Research shows that fairness perception drives engagement more than the actual number. A rep with a $500K quota who understands why will outperform a rep with a $400K quota who thinks it was pulled from thin air.

Hypercare is shorter for quota projects than for CRM migrations, but the stakes are high. The first month under new quotas reveals whether the model works in practice. Watch for: dashboard errors (calculation bugs only visible with live data), territory weight inaccuracies (actual performance diverging from weights), and rep morale signals (complaints about fairness, disengagement).

### Phase 4: Why Maintenance Schedules Matter for Quotas

Quotas are not a set-and-forget deliverable. Markets shift, reps turn over, territories evolve. The maintenance schedule prevents "quota drift" — the phenomenon where quotas become detached from reality because nobody recalibrates them. Monthly attainment tracking catches problems early. Quarterly reviews validate the model. Annual recalibration ensures the methodology stays current.

**Retention Path — Quotas Lead to Adjacent Projects:**

- **Commission Plan Design** — quotas inform comp, and clients often realize their comp plan needs updating after seeing the quota methodology
- **Forecasting Process** — once quotas are set, clients need a forecasting process to predict attainment
- **Territory Design** — quota analysis sometimes reveals territory imbalances that require a dedicated redesign project
- **Growth Model** — the company-level ARR targets that quotas operationalize may need their own strategic model

---

## References

[1] Bridge Group — 2024 SaaS AE Metrics & Compensation Benchmark Report

[2] Salesforce — Finalize Sales Analytics with Quotas Data

[3] Kennesaw State University — Quota Fairness, Procedural Justice, and Turnover Intentions

[4] Salesforce — State of Sales Report

[5] Everstage — Sales Compensation Statistics 2025

[6] Sales So — Quota Attainment Statistics 2025

[7] Sales So — Sales Ramp-Up Statistics 2025: Benchmarks & Best Practices

[8] DePaul University Sales Effectiveness Survey via Peak Sales Recruiting
