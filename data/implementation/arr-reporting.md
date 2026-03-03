# ARR Reporting — Implementation

## Project One-Pager

### ARR Reporting One-Pager

#### Project Type
- Category: Balanced (Strategy + Technical)
- Primary Deliverable: Automated ARR reporting system in CRM with executive dashboards, change tracking, and governance processes

##### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Heavy | ARR definition alignment across Finance, RevOps, Sales, CS — requires 2-3 refinement loops |
| 2. Engineering | Yes | Heavy | CRM field creation, billing system integration, formula automation, dashboard build |
| 3. Enablement | Yes | Medium | Training for Sales, Finance, CS on ARR definitions and dashboards |
| 4. Handoff | Yes | Medium | Governance process handoff, reconciliation cadence, maintenance schedule |

#### Phase Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. STRATEGY  │────>│ 2. ENGINEER  │────>│3. ENABLEMENT │────>│  4. HANDOFF  │
│    Heavy     │     │    Heavy     │     │   Medium     │     │   Medium     │
│ 1a→1b→1c→1d │     │ 2a→2b→2c→2d │     │ 3a→3b→3c→3d │     │ 4a→4b→4c→4d │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘

Define ARR rules     Build fields,        Train teams on       Governance handoff
& data model         integrations,        definitions &        & reconciliation
                     dashboards           dashboard usage      cadence
```

**This project's flow:**

- Full 4-phase. Heavy strategy (definition alignment is the hardest part), heavy engineering (billing integration + CRM build), medium enablement, standard handoff.
- Phase 1 is the gate: no building until all stakeholders agree on a single ARR definition.
- Phase 2 can start partially once ARR definition is signed off, even if dashboard design is still refining.

---

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Review ARR definition questionnaire — answer: what counts as recurring revenue, what doesn't, how multi-year contracts are treated
- Provide admin access to CRM (Salesforce or HubSpot) and billing system (Stripe, Chargebee, Zuora, or NetSuite)
- Export sample of 10-20 customer contracts covering new, renewal, expansion, and churn scenarios
- Identify Finance stakeholder for ARR definition sign-off
- Document current ARR calculation methodology (if any — even if it lives in a spreadsheet)

##### Track B: Architect Prep

- Audit CRM object model — identify where subscription/contract data lives today
- Pull billing system field inventory — map available fields (amount, term, start date, end date, status)
- Draft v0 ARR data model: proposed CRM objects, fields, and relationships
- Research client's billing system integration options (native connector vs. middleware vs. ETL)
- Prepare ARR definition questionnaire with recommended answers pre-filled based on industry standards

---

#### Refinement Loop (1b → 1c → 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present v0 ARR definition and data model, gather input | Finance, RevOps, Sales, CS | Info for v1 definition |
| Refinement 1 | 1c | Review v1 definition, resolve edge cases (multi-currency, usage-based, discounts) | Finance + RevOps | v2 definition + data model |
| Refinement 2 | 1c | Validate billing system field mapping, confirm integration approach | RevOps + Engineering | Final data model + integration spec |
| Sign-Off | 1d | ARR definition and data model approval | All stakeholders | Signed-off ARR policy document |

---

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held — v0 ARR definition presented
- 1c. Refinement loop complete (ARR definition v0 → vFinal)
- 1d. Strategic sign-off — one-page ARR policy approved by Finance and RevOps

##### Phase 2: Engineering

- 2a. Tech spec created — field mappings, formula logic, integration specs
- 2b. Engineering handoff meeting held
- 2c. Build complete — CRM fields, billing integration, ARR automation, dashboards
- 2d. QA/Test + customer sign-off on ARR calculations and dashboard accuracy

##### Phase 3: Enablement

- 3a. Training materials prepped (ARR quick-reference guide, dashboard walkthrough scripts)
- 3b. Training sessions delivered to Sales, Finance, CS, RevOps
- 3c. Hypercare period complete (2-4 weeks)
- 3d. Enablement sign-off

##### Phase 4: Handoff

- 4a. Maintenance schedule documented and handed off
- 4b. Internal handoff (SME → Architect) complete
- 4c. External handoff (LeanScale → Customer) complete
- 4d. Project closed and archived

---

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| ARR Definition Questionnaire | Capture stakeholder inputs on what counts as ARR | All questions answered, edge cases documented |
| Billing System Field Mapping | Map billing fields to CRM ARR fields | All required fields mapped and confirmed |
| ARR Data Model Spec | Define CRM objects, fields, relationships | Approved by RevOps and Engineering |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| One-Page ARR Policy Document | ARR Definition Questionnaire | Internal alignment, board reporting definition |
| ARR Executive Dashboard | Data model + dashboard build | Board reporting, executive reviews |
| ARR Bridge Report | ARR component calculations | Period-over-period ARR movement analysis |

---

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Leadership | CFO, VP Finance, CEO | Interpret ARR dashboard, board reporting views | 30m |
| RevOps | RevOps Manager, Sales Ops | ARR calculations, reconciliation, troubleshooting | 60m |
| Sales | Sales Managers, AEs | What counts as ARR, how to enter contract data correctly | 30m |
| CS | CS Managers, CSMs | Churn/contraction tracking, renewal ARR impact | 30m |

##### Hypercare

- Applies: Yes
- Duration: 2-4 weeks (covers at least one month-end close cycle)
- Office Hours: Yes — weekly 30-min slot for ARR calculation questions and reconciliation support

##### Training Assets to Create

- Video walkthrough: ARR dashboard walkthrough for executives
- Video walkthrough: How to update contract records and trigger ARR recalculation
- Doc: ARR definition quick-reference guide (one-pager)
- Doc: Billing system sync troubleshooting guide
- Doc: Monthly reconciliation process checklist

---

#### Handoff & Retention

##### Internal Handoff (SME → Architect)

- Key context for Architect: ARR definition nuances (especially edge cases like multi-currency, usage-based minimums), billing sync frequency, and dashboard refresh cadence
- Escalation trigger: Any changes to ARR definition, new product lines affecting ARR calculation, or billing system migration

##### External Handoff (LeanScale → Customer)

- Final meeting agenda: Dashboard walkthrough, reconciliation process review, governance cadence confirmation, edge case escalation paths
- Documentation package: ARR policy document, data model diagram, dashboard guide, reconciliation SOP, troubleshooting guide

##### Maintenance Schedule

- Monthly: ARR reconciliation (CRM vs. billing system), data anomaly review
- Quarterly: Spot-check audit of 10-20 contracts, governance review
- Who owns: Single project = customer RevOps owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services → if no → Downsell: Another project (e.g., NRR/GRR reporting, renewal management) → Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~90 days post-launch
- Internal prep trigger: 2 weeks before
- Decision: Architect handles / SME needed

---

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| ARR | Annualized value of all active recurring subscription contracts |
| MRR | Monthly Recurring Revenue = ARR / 12 |
| New ARR | ARR from net-new customers who did not have a prior subscription |
| Expansion ARR | Incremental ARR from existing customers (upsells, cross-sells, seat additions) |
| Churned ARR | ARR lost from customers who fully cancelled their subscription |
| Contraction ARR | ARR reduction from existing customers (downgrades, seat removals) |
| CARR | Contracted ARR — includes signed contracts not yet live |
| LARR | Live ARR — only includes active, in-service subscriptions |
| Net New ARR | New ARR + Expansion ARR - Churned ARR - Contraction ARR |
| Multi-year treatment | Total contract value / number of years = annual ARR |

---

#### Common Gotchas

- Finance and Sales use different ARR calculations — always get Finance sign-off first, then align Sales to match
- Using Opportunity Close Date instead of Contract Start Date inflates ARR at booking time → define CARR vs. LARR upfront
- Billing system cancellations don't sync to CRM automatically — set up error alerting on day one
- Multi-currency conversions need a defined exchange rate policy (daily spot rate vs. monthly average vs. contract rate)
- Usage-based revenue components create ARR ambiguity — define whether contracted minimums count and if/how overages are annualized

---

#### Methodology Options

| Option | When to Use | Complexity |
|--------|------------|-----------|
| Simple (Formula Fields Only) | Low volume (<500 contracts), single product, no usage-based | Low |
| Standard (Workflow + Formulas) | Medium volume, multiple products, billing system integration | Medium |
| Advanced (Custom Objects + ETL) | High volume, multi-currency, usage-based, complex hierarchy | High |

> See Methodology for detailed decision framework on which approach fits the client's billing complexity.

---

## Phase 1: Strategy

> **Goal:** Get stakeholder sign-off on the ARR definition and data model before building anything.
>
> **Output:** One-page ARR Policy Document + Data Model Specification (signed off by Finance, RevOps, and executive sponsor).

ARR definition alignment is the hardest and most valuable part of this project. "SaaS companies lose an estimated 3-5% of ARR annually to revenue leakage caused by" misalignment. Most of that starts with inconsistent definitions — Sales counts ARR at booking, Finance counts at go-live, and CS counts something else entirely. Phase 1 forces a single definition before any system is built.

### 3.1. Pre-Kickoff (1a)

> Two parallel tracks run after the AE closes and before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| ARR intro video | Explain what this project delivers and why definition alignment matters | Video walkthrough (5-10 min) |
| ARR Definition Questionnaire | Get stakeholder input on what counts as ARR, edge cases, unit of record | Google Doc |
| Definition Alignment Document | Get sign-off on key terms (ARR, MRR, New/Expansion/Churn/Contraction) | Google Doc |
| System access request | Confirm admin access to CRM and billing system | Email checklist |

**What the questionnaire covers:**

1. What revenue counts as recurring? (Subscriptions, contracted minimums, recurring add-ons)
2. What revenue does NOT count? (One-time fees, professional services, setup fees)
3. How do you handle multi-year contracts? (Divide by term, or recognize at start?)
4. Are you tracking CARR (contracted) or LARR (live)?
5. How do you handle mid-term upgrades/downgrades?
6. Do you have usage-based pricing? If so, do contracted minimums count as ARR?
7. What currencies are your contracts in? How do you handle FX rates?

**Completion tracking:** RevOps lead follows up. Kickoff proceeds even if incomplete, but push for Finance answers before meeting.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Audit CRM object model (Opportunities, Contracts, custom) | Where subscription data lives today |
| 2 | Pull billing system field inventory | Available fields, data types, sync options |
| 3 | Draft v0 ARR definition (pre-filled with best practices) | Recommended ARR policy |
| 4 | Draft v0 data model (CRM objects, fields, relationships) | Proposed schema ready for kickoff |
| 5 | Research integration options for client's billing system | Native connector vs. middleware vs. ETL |
| 6 | Prepare kickoff materials (diagrams, questions list) | Presentation-ready assets |

**Critical:** Mark everything as ASSUMED. The kickoff call validates. Pre-fill ARR definitions using standard B2B SaaS conventions — the customer reacts and corrects, not creates from scratch.

#### Stakeholder Alignment Document

> Get stakeholder sign-off on terms BEFORE building anything.

| Term | Our Definition | Internally Approved? |
|------|----------------|---------------------|
| ARR | Annualized value of all active recurring subscription contracts | [ ] Yes / [ ] No |
| MRR | ARR / 12 | [ ] Yes / [ ] No |
| New ARR | ARR from net-new customers with no prior subscription | [ ] Yes / [ ] No |
| Expansion ARR | Incremental ARR from upsells, cross-sells, seat additions | [ ] Yes / [ ] No |
| Churned ARR | ARR lost from full cancellations | [ ] Yes / [ ] No |
| Contraction ARR | ARR reduction from downgrades or seat removals | [ ] Yes / [ ] No |
| CARR vs. LARR | Contracted ARR (at signing) vs. Live ARR (at go-live) — which we track | [ ] Yes / [ ] No |
| Multi-year handling | Total contract value / term years = annual ARR | [ ] Yes / [ ] No |

**Instructions to customer:**

> Review each definition with your Finance and RevOps teams. Check "Yes" when approved. We cannot proceed to build until all terms are aligned. Disagreement on these terms is the #1 source of project delays.

---

### 3.2. Kickoff Call (1b)

> **Purpose:** Present v0 ARR definition and data model. Walk in with work done — customer reacts, not creates.

#### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through v0 ARR def | "Here's what we recommend based on B2B SaaS standard practice" |
| 15-30 | Validate assumptions | ASSUMED → CONFIRMED: what counts, what doesn't, edge cases |
| 30-45 | Definition Alignment review | Walk through each term, get preliminary agreement |
| 45-55 | Data model walkthrough | Show proposed CRM objects and fields, gather reactions |
| 55-65 | Billing integration options | Present connector options, discuss sync frequency |
| 65-75 | Identify gaps | What data is missing, who owns it, what edge cases remain |
| 75-90 | Next steps | Schedule refinement meetings, assign homework |

#### What We Bring

- v0 ARR Policy Document (pre-filled with recommended definitions)
- v0 Data Model Specification (proposed CRM objects, fields, relationships)
- Current state diagram showing where subscription data lives today
- Billing system integration options brief
- Questions list (edge cases we need stakeholder input on)
- Definition Alignment Document (pre-filled)

#### What We Leave With

- Feedback and corrections on ARR definition (info needed for v1)
- Preliminary agreement on key terms or clear blockers requiring escalation
- Edge cases documented (multi-currency, usage-based, discounts)
- Refinement loop scheduled
- Homework assignments: Finance to confirm multi-year handling, RevOps to provide sample contracts for testing

---

### 3.3. Alignment Loop & Strategic Meeting Cadence (1c)

> **Purpose:** Iterate on the ARR definition and data model until sign-off.

#### The Pattern

```
Kickoff Call (present v0, gather input)
    ↓
Update definition + data model → v1
    ↓
Meeting 2 (edge cases with Finance + RevOps) → v2
    ↓
Meeting 3 (billing field mapping with RevOps + Eng) → v3
    ↓
Final Review → Sign-off
```

#### Before Each Meeting

1. Update ARR definition document based on previous feedback
2. Update data model specification
3. Prepare specific questions for remaining edge cases

#### During Each Meeting

1. Walk through current version of ARR definition
2. Capture corrections and new edge cases
3. Validate what's now CONFIRMED
4. Identify remaining ASSUMED items

#### After Each Meeting

1. Update ARR policy document (v\[n-1\] → v\[n\])
2. Track what moved from ASSUMED → CONFIRMED
3. Update data model if definitions changed

#### Meeting Schedule

| Meeting Type | Focus | Stakeholder |
|--------------|-------|-------------|
| Edge Case Review | Multi-currency, usage-based, discounts, multi-year, pro-ration | Finance + RevOps |
| Data Validation | Billing system field mapping, integration approach, sync frequency | RevOps + Engineering |
| Final Review | Full walkthrough of ARR definition, data model, integration plan | All stakeholders |

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 2-3 days |
| Kickoff call | Day 1 of engagement |
| Refinement loop | 1-2 weeks (2-3 meetings) |
| Final review + sign-off | When all edge cases resolved |

---

### 3.4. Strategic Sign-Off (1d)

> **Purpose:** Confirm ARR definition and data model are fully approved before building.

#### Validation Checkpoint

- One-page ARR Policy Document signed off by Finance and RevOps
- Definition Alignment Document — all terms marked "Yes"
- CARR vs. LARR decision made and documented
- Edge cases documented: multi-currency, usage-based, discounts, multi-year, pro-ration
- Data model specification approved (objects, fields, relationships)
- Billing system integration approach confirmed
- Sample contracts provided for calculation testing
- All critical inputs CONFIRMED (vs ASSUMED)
- No blockers for engineering

#### Decision Point

- **Proceed to Engineering** → ARR definition approved, data model confirmed, integration approach selected
- **Loop back to refinement** → Stakeholder disagreement on definitions (most common: Finance vs. Sales on when ARR starts)

---

## Phase 2: Engineering

> **Goal:** Build the ARR reporting system in the CRM — fields, integration, automation, dashboards.
>
> **Output:** Working ARR system that calculates automatically, syncs with billing, tracks changes, and displays on executive dashboards.

| Project Type | Engineering Weight | This Project |
|--------------|-------------------|--------------|
| Balanced | Heavy (40-50%) | CRM field creation, billing integration, formula automation, dashboard build |

### Sub-Phases

```
2a Tech Spec → 2b Engineering Handoff → 2c Build → 2d Test
```

---

### 4.1. Tech Spec (2a)

> **Purpose:** Translate the signed-off ARR definition and data model into technical specifications.

**Input:** Signed-off ARR Policy Document + Data Model Specification from Phase 1

**Output:** Draft tech spec containing:

- **Field specifications:** Field names, data types, picklist values, formula logic for ARR/MRR/New/Expansion/Churn/Contraction
- **Object relationships:** Account → Contract/Subscription → ARR fields hierarchy
- **Formula logic:** ARR = (Monthly Amount x 12), multi-year handling (Total / Term), pro-ration rules
- **Validation rules:** Required fields, date range validation, amount floor/ceiling
- **Workflow specifications:** Triggers for ARR recalculation on key events (renewal, upgrade, churn, new subscription)
- **Integration specification:** Billing system field mapping, sync direction, frequency, error handling
- **History tracking specification:** Which fields to track, snapshot cadence, custom history object design
- **Dashboard specifications:** Executive dashboard components, ARR bridge report logic, cohort views, drill-down reports
- **Build sequence:** Recommended order of implementation

---

### 4.2. Engineering Handoff (2b)

> **Purpose:** Review tech specs with engineer before building.

**Who attends:** Architect + Engineer (or engineering team)

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through specs | Architect explains ARR definition context + tech spec |
| 15-30 | Engineer questions | Clarify: formula edge cases, billing API limits, sync frequency concerns |
| 30-45 | Refine and approve | Adjust specs, confirm build approach and sequence |

**What Architect brings:**

- ARR Policy Document (for strategic context)
- Draft tech spec (from 2a)
- Sample contracts (for testing reference)
- Integration options brief (connector details)

**What engineer leaves with:**

- Approved tech spec
- Clear build sequence (fields → formulas → integration → history → dashboards)
- Known risks: billing API rate limits, multi-currency formula complexity, large data volume handling

---

### 4.3. Build (2c)

> **Purpose:** Build the ARR reporting system in the CRM.

**Input:** Approved tech spec from 2b

**Build sequence (recommended order):**

| # | Component | Details | Estimated Effort |
|---|-----------|---------|------------------|
| 1 | Create ARR fields and objects | ARR, MRR, date fields, component fields on Contract/Subscription object | 2-4 hours |
| 2 | Build validation rules | Required field enforcement, date range validation, amount validation | 1-2 hours |
| 3 | Configure page layouts | Add ARR fields to relevant page layouts, set field-level security | 1-2 hours |
| 4 | Build formula fields | ARR calculation from contract amount and term, MRR formula | 2-4 hours |
| 5 | Build workflow automation | Recalculation triggers on renewal, upgrade, churn, new subscription | 3-5 hours |
| 6 | Connect billing system | Configure integration (native connector, Workato, Zapier, or ETL) | 4-8 hours |
| 7 | Set up ARR history tracking | Enable field history or create custom Subscription History object | 2-4 hours |
| 8 | Build month-end snapshot job | Scheduled job to capture point-in-time ARR for trend reporting | 2-3 hours |
| 9 | Build executive dashboard | Total ARR, New ARR, Churned ARR, Net ARR Growth | 3-5 hours |
| 10 | Build ARR Bridge report | Period-over-period movement: beginning ARR + movements = ending ARR | 2-4 hours |
| 11 | Build cohort views | ARR by segment, product, region, rep | 2-3 hours |
| 12 | Build forecasting reports | Projected ARR from pipeline data | 2-3 hours |
| 13 | Configure alerting | Data anomaly alerts for unusual ARR spikes/drops | 1-2 hours |

**Build tracking:**

- Component 1: ARR fields and objects
- Component 2: Validation rules
- Component 3: Page layouts and security
- Component 4: Formula fields
- Component 5: Workflow automation
- Component 6: Billing system integration
- Component 7: History tracking
- Component 8: Month-end snapshot job
- Component 9: Executive dashboard
- Component 10: ARR Bridge report
- Component 11: Cohort views
- Component 12: Forecasting reports
- Component 13: Alerting

---

### 4.4. QA / Test + Sign-Off (2d)

> **Purpose:** Verify ARR calculations are accurate and dashboards reflect reality.

**Two types of testing:**

| Type | Who | Purpose |
|------|-----|---------|
| Technical Testing | Our team | Verify calculations, data sync, workflow triggers, dashboards |
| Customer Testing | Customer | Verify ARR numbers match their expectations and billing records |

**Technical testing checklist:**

- ARR formula fields calculate correctly for: new contract, renewal, expansion, downgrade, churn
- Multi-year contract ARR = Total Value / Term Years
- Multi-currency contracts convert correctly using defined exchange rate policy
- Billing system sync: new subscriptions, cancellations, expansions, renewals flow into CRM
- Sync error alerting fires on failed syncs
- Validation rules prevent incomplete contract records
- Workflow automation: ARR recalculates on contract status changes
- History tracking captures all ARR field changes
- Month-end snapshot job runs and produces accurate point-in-time data
- Executive dashboard: Total ARR, component breakdowns, trend charts render correctly
- ARR Bridge report: Beginning ARR + movements = Ending ARR (numbers tie)
- Cohort views filter correctly by segment, product, region, rep
- Forecasting reports pull from pipeline data correctly
- **Critical validation:** CRM ARR total matches billing system total (variance < 2%)

**Customer testing:**

- Walk customer through ARR calculations using their sample contracts
- Have Finance verify ARR total against their known number
- Have RevOps test data entry workflow (create contract → verify ARR auto-calculates)
- Have executive sponsor review dashboard and confirm it meets board reporting needs

**Engineering sign-off checkpoint:**

- Built system matches tech spec
- All technical tests passing
- CRM ARR within 2% variance from billing system ARR
- Customer has tested and approved
- Ready for enablement

**Decision point:**

- **Proceed to Enablement** → System is built, calculations verified, dashboards ready
- **Loop back to Build** → Calculation errors, sync failures, or dashboard gaps found

---

## Phase 3: Enablement

> **Goal:** All stakeholder teams understand the ARR definition, can use the dashboards, and know how to maintain data quality.
>
> **Output:** Trained team with documentation, stabilized system, no critical calculation issues.

### Sub-Phases

```
3a Training Prep → 3b Training Sessions → 3c Hypercare → 3d Enablement Sign-Off
```

---

### 5.1. Training Prep (3a)

> **Purpose:** Create training materials from ARR definition, tech specs, and built system.

**Input:** ARR Policy Document + tech specs + built system

**Output:** Training package containing:

- **ARR Definition Quick-Reference Guide** (one-pager): What counts, what doesn't, how to enter data
- **Executive Dashboard Walkthrough** (video): How to read the ARR dashboard, what each metric means, how to drill down
- **RevOps Reconciliation Guide**: Step-by-step monthly reconciliation process
- **Contract Entry Guide**: How to create/update contract records so ARR calculates correctly
- **FAQ Draft**: Based on common questions (When does ARR start? How are discounts handled? What about usage overages?)

---

### 5.2. Training Sessions (3b)

> **Purpose:** Transfer knowledge to all stakeholder teams.

| Session | Audience | Focus | Duration | Key Topics |
|---------|----------|-------|----------|-----------|
| Executive | CFO, VP Finance, CEO | How to interpret ARR dashboard, board reporting views, what metrics mean | 30 min | Total ARR, Net New ARR, ARR Bridge, growth rate |
| RevOps | RevOps Manager, Ops | Full system walkthrough, reconciliation process, troubleshooting | 60 min | Data model, formulas, billing sync, reconciliation SOP, error handling |
| Sales | Sales Managers, AEs | What counts as ARR, how to enter contracts correctly | 30 min | Required fields, validation rules, common entry mistakes |
| Customer Success | CS Managers, CSMs | Churn/contraction tracking, renewal impact on ARR | 30 min | Churn recording, expansion tracking, ARR impact of renewals |

**Training delivery:**

1. Schedule sessions with each stakeholder group
2. Deliver training (live preferred, record for future onboarding)
3. Record video walkthroughs for each audience
4. Answer questions, log gaps for FAQ updates

**Output:**

- Trained stakeholders across Finance, RevOps, Sales, CS
- Video recordings for future reference
- Questions log (feeds into FAQ and troubleshooting guide)

---

### 5.3. Hypercare (3c)

> **Purpose:** Intensive post-launch support to stabilize the ARR system through at least one month-end close cycle.

**Duration:** 2-4 weeks (must cover at least one month-end close to validate reconciliation process)

**What happens:**

- Quick response to ARR calculation questions
- Office hours: weekly 30-min slot for reconciliation support
- Billing sync monitoring: watch for failed syncs during first close cycle
- Bug triage: fix formula errors, missing field mappings, sync failures
- First month-end reconciliation: walk RevOps through the process end-to-end

**Key focus during hypercare:**

1. **First month-end close:** Does CRM ARR reconcile to billing system within 2% variance?
2. **Data entry quality:** Are Sales and CS entering contract records correctly?
3. **Dashboard accuracy:** Are executives seeing correct data?
4. **Sync reliability:** Any billing system sync failures?

**When to extend hypercare:** If first month-end reconciliation shows > 5% variance, extend by 2 weeks and investigate root cause.

**Output:** Stabilized system, successful first month-end reconciliation, no critical issues outstanding

---

### 5.4. Enablement Sign-Off (3d)

> **Purpose:** Confirm customer team can operate the ARR system independently.

**Validation checkpoint:**

- All training sessions delivered (Executive, RevOps, Sales, CS)
- Training recordings and documentation provided
- At least one month-end close cycle completed successfully
- CRM-to-billing reconciliation < 2% variance
- Hypercare period complete
- No critical calculation or sync issues outstanding
- RevOps can run monthly reconciliation independently
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** → Customer is enabled, reconciliation process working
- **Extend Hypercare** → Reconciliation variance too high, sync issues unresolved, or team not confident

---

## Phase 4: Handoff

> **Goal:** Clean project close with governance process established, maintenance schedule documented, and retention/expansion path set.
>
> **Output:** Maintenance schedule documented, internal context transferred, customer owns the ARR system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule → 4b Internal Handoff → 4c External Handoff → 4d Project Close
                           (SME → Architect)      (LeanScale → Customer)  (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|---------------------|---------------|
| **Single Project** | Customer owns | 4c (External Handoff) — customer receives maintenance schedule and runs it themselves |
| **Dedicated (Multi-Project)** | Architect owns | 4b (Internal Handoff) — Architect receives maintenance schedule and runs it for customer |

---

### 6.1. Maintenance Schedule (4a)

> **Purpose:** Document what needs ongoing attention to keep ARR data accurate and dashboards trustworthy.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|-------------------|
| ARR Reconciliation | CRM total ARR vs. billing system total ARR | > 2% variance — investigate immediately |
| Billing Sync Health | Check for failed syncs, stale records, error queue | Any failed syncs unresolved for > 48 hours |
| Data Anomaly Review | Unusual ARR spikes or drops in dashboard | Any single-account ARR change > $50K without known contract event |
| Expired Contract Cleanup | Contracts past end date still showing active ARR | Any expired contracts showing active ARR |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|----------------|---------------------|
| Contract Spot-Check Audit | Randomly sample 10-20 contracts, verify ARR calculation | Fix errors, investigate if systemic pattern |
| Governance Review | Review ARR policy document — any new products, pricing changes, or edge cases? | Update policy, adjust formulas if needed |
| Dashboard Usage Audit | Are executives actually using the dashboard? | If low usage, schedule refresher training |
| Exchange Rate Policy Review | For multi-currency: are FX rates updating correctly? | Recalibrate if rates are stale |

**After First Business Cycle (60-90 days post-launch):**

- **Full ARR Reconciliation:** Deep-dive comparison of CRM ARR vs. billing system across all accounts (not just totals)
- **Component Accuracy:** Verify New/Expansion/Churn/Contraction buckets are categorizing correctly
- **Board Report Validation:** Has Finance used the CRM ARR dashboard for board reporting without manual adjustments?
- **Key Question:** Is the CRM the single source of truth for ARR, or are people still maintaining side spreadsheets?

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Reconciliation drift | CRM-to-billing variance > 5% for 2+ months | Re-engage SME, audit billing sync |
| New product line | New product with different pricing model | Scope ARR definition update project |
| Billing system migration | Client changing billing platform | Scope new integration project |
| ARR definition disagreement | Stakeholders reverting to old definitions | Schedule definition realignment session |

**Every 6-12 Months:**

- **Full ARR Policy Review:** Does the one-page definition still match how the business operates?
- **Billing Integration Health Check:** Any API deprecations, new fields available, performance issues?
- **Dashboard Refresh:** Are the cohort views still relevant? New segments or products to add?
- **Benchmark Comparison:** Compare client's NRR, GRR, churn rate against industry standards (elite B2B SaaS targets NRR > 120%, GRR > 90%)

---

### 6.2. Internal Handoff (SME → Architect) (4b)

> **Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- What was built: ARR fields, billing integration, dashboards, history tracking, governance process
- ARR definition nuances: Edge cases for this specific client (e.g., "usage overages are not ARR," "multi-year contracts use contract-date FX rate")
- Billing sync details: Which system, sync frequency, error alerting setup
- **Maintenance schedule** (if Dedicated engagement — Architect runs this)

**Escalation guidelines:**

| Issue Type | Who Handles | Examples |
|-----------|------------|----------|
| Small tweaks, minor questions | Architect | Dashboard filter changes, adding a new rep to cohort view, training a new hire |
| ARR definition changes, billing system changes | SME | New product line, pricing model change, billing system migration, formula logic changes |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing monthly reconciliation oversight and quarterly audits.

---

### 6.3. External Handoff (LeanScale → Customer) (4c)

> **Purpose:** Formal project completion with customer.

**Final project meeting:**

- Review what was delivered (ARR system, dashboards, integration, governance process)
- Walk through documentation package
- Walk through reconciliation SOP step-by-step
- Demonstrate monthly reconciliation process on live data
- Confirm nothing outstanding
- Answer final questions
- Make it explicit: "Project complete"
- **For Single Project engagements:** Hand over the maintenance schedule (4a) and walk customer through it in detail

**Documentation package:**

- One-Page ARR Policy Document (final, signed-off version)
- Data Model Specification (objects, fields, relationships, formulas)
- Billing Integration Documentation (connector config, sync frequency, error handling)
- Reconciliation SOP (step-by-step monthly process)
- Troubleshooting Guide (common issues and resolutions)
- Training video recordings (Executive, RevOps, Sales, CS)
- ARR Definition Quick-Reference Guide
- Dashboard Navigation Guide
- FAQ Document
- Definition Alignment Document (final version)
- Maintenance Schedule
- Support contact info

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video of the walkthrough. Make sure RevOps understands what to check monthly, quarterly, and when to call us back.

**Output:** Customer owns the ARR system. Project formally complete.

---

### 6.4. Project Close (4d)

> **Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved to proper location
- Handoff documentation complete
- Project status updated in tracking system
- Time/billing finalized

#### Internal Debrief (Optional but Recommended)

- What went well? (Definition alignment was smooth / Dashboard design exceeded expectations)
- What would we do differently? (Billing integration took longer than estimated / Should have pushed harder for Finance access earlier)
- Any learnings to feed back into SOPs? (New edge case for multi-currency handling)

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| **Single Project** | Upsell → Downsell → Retry |
| **Dedicated (Multi-Project)** | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (retainer for ongoing ARR governance + optimization)
   ↓ if no
2. Downsell: Another one-time project (NRR/GRR reporting, renewal management, forecasting)
   ↓ if yes
3. Retry retainer at end of next project cycle
```

**Script:**

> "Now that ARR Reporting is complete, there are two ways we can continue working together. Option 1: We handle ongoing ARR governance — monthly reconciliation, quarterly audits, dashboard optimization — on a managed services retainer. Option 2: If there's another specific project you need (NRR/GRR reporting, renewal management, forecasting), we can scope that. Which sounds more relevant?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

> "On \[date ~90 days out\], we'll review how the ARR system is performing — reconciliation accuracy, dashboard adoption, any new edge cases — and see if adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull reconciliation variance trends, dashboard usage |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points. |

**At the refinement check-in:**

- Review reconciliation accuracy over 90 days
- Review dashboard adoption (is Finance actually using it for board reports?)
- Identify any new products, pricing changes, or edge cases
- If minor: Architect handles adjustments
- If major: Scope ARR definition update or new integration project

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Troubleshooting Guide

> Common issues and resolutions for ARR Reporting systems.

| Scenario | Symptoms | Root Cause | Resolution |
|----------|----------|-----------|-----------|
| ARR total doesn't match billing system | CRM ARR differs from billing by > 2% | Date mismatches (booking vs. live), missed sync, stale cancellations | Run account-level reconciliation, identify mismatched records, verify sync queue for errors |
| ARR didn't update after contract change | Customer upgraded but ARR still shows old value | Workflow trigger not firing, or trigger condition doesn't match record type | Check workflow trigger criteria, verify record type matches automation scope, manually recalculate and fix trigger |
| Billing sync failures | New subscriptions or cancellations not appearing in CRM | API rate limit hit, authentication expired, field mapping changed | Check error queue, verify API credentials, confirm field mapping hasn't changed in billing system |
| Multi-currency ARR incorrect | FX conversion producing wrong numbers | Exchange rate policy mismatch (daily vs. monthly vs. contract-date) | Verify which rate policy was agreed in ARR definition, check rate source, recalculate affected records |
| Dashboard shows wrong period | Dashboard shows stale data or wrong time range | Dashboard filter defaults, snapshot job failed, cache not refreshed | Check dashboard filter settings, verify snapshot job ran, clear dashboard cache |
| Duplicate ARR records | Same contract counted twice, inflating ARR | Duplicate contract records in CRM, or billing sync creating duplicates | Identify duplicates via report, merge/delete extras, add validation to prevent recurrence |
| Expired contracts still showing active ARR | Old contracts past end date still counted in total | No automation to deactivate expired contracts, or end date field not populated | Build scheduled job to deactivate expired contracts, add validation rule requiring end date |
| ARR Bridge report doesn't balance | Beginning + movements does not equal ending | Component categorization error (e.g., renewal counted as both churn + new) | Audit component logic, verify each movement is categorized once, fix formula |

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- One-Page ARR Policy Document (defines what counts as ARR, signed off by Finance and RevOps)
- Definition Alignment Document (all key terms approved)
- Data Model Specification (CRM objects, fields, relationships, formulas)

**Technical Deliverables:**

- CRM ARR fields and custom objects (configured and tested)
- Billing system integration (connector configured, syncing, error-alerting active)
- ARR calculation automation (formula fields + workflow triggers)
- ARR history tracking (field history + month-end snapshot job)
- Executive Dashboard (Total ARR, component breakdowns, growth rate, trends)
- ARR Bridge Report (period-over-period movement analysis)
- Cohort Reports (ARR by segment, product, region, rep)
- Forecasting Reports (projected ARR from pipeline)
- Data anomaly alerts (unusual ARR changes)

**Documentation Package:**

- Training video recordings (4 sessions: Executive, RevOps, Sales, CS)
- ARR Definition Quick-Reference Guide
- Dashboard Navigation Guide
- Reconciliation SOP (monthly process)
- Troubleshooting Guide
- Billing Integration Documentation
- FAQ Document
- Definition Alignment Document (final version)
- Maintenance Schedule

---

## Appendix

### Roles

| Role | What They Do |
|------|--------------|
| **Architect** | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| **Engineer** | CRM build, automation, dashboards (Phase 2) |
| **SME** | Project/implementation team brought in for project specific work |

### Phase Gates

| Phase | Output | Gate Criteria |
|-------|--------|---------------|
| **Phase 1: Strategy** | Signed-off ARR Policy Document + Data Model Specification | Finance and RevOps approve definitions, all edge cases resolved |
| **Phase 2: Engineering** | Built and tested ARR system (fields, integration, automation, dashboards) | CRM ARR within 2% variance from billing, all tests pass, customer approved |
| **Phase 3: Enablement** | Trained team with documentation | All training delivered, first month-end close successful, team independent |
| **Phase 4: Handoff** | Independent customer + archived project | Handoffs complete, maintenance plan in place, governance cadence established |

### Integration Complexity by Billing System

| Billing System | Integration Approach | Typical Complexity | Notes |
|----------------|---------------------|-------------------|-------|
| Stripe | Native connector or Zapier | Low-Medium | Well-documented API, many pre-built connectors |
| Chargebee | Native connector or Workato | Medium | Good API, some custom mapping needed |
| Zuora | Native connector | Medium-High | Complex object model, requires careful mapping |
| NetSuite | Middleware (Workato/Celigo) | High | ERP complexity, custom sync logic likely needed |
| Spreadsheet | Manual import or ETL | Low (but brittle) | Temporary solution, plan for system migration |

### Why Phase 1 Matters

SaaS companies frequently discover that their ARR number differs depending on who you ask. "The proportion of ARR from expansion increased from 28.8% in 2020 to 32.3% in 2023" — but companies can only track this trend if they have consistent component definitions. Phase 1 forces that consistency before building anything.

The #1 risk in ARR Reporting is building a system on a definition that one stakeholder later disputes. Getting Finance sign-off on the one-page ARR policy BEFORE building prevents rework, political blockers, and the dreaded "that's not how we calculate ARR" comment in the first board meeting.

### Why Maintenance Schedules Matter

The most common failure mode post-ARR-project is not a broken system — it's a system that slowly drifts from reality. Billing sync failures go unnoticed. New products get added without updating ARR calculations. Exchange rates become stale. The maintenance schedule prevents drift by making reconciliation explicit and cadenced.

"SaaS teams lose 3-5% of ARR annually to revenue leakage," and at a 7x revenue multiple, that 3% leakage destroys 21% of enterprise value. Regular reconciliation catches drift before it compounds.

---

## References

[1] LedgerUp - Revenue Leakage in SaaS: Why You're Losing 3-5% of ARR

[2] Orb - B2B SaaS Benchmarks in 2025

[3] Vena Solutions - 85 SaaS Statistics, Trends and Benchmarks for 2025

[4] Gary Smith Partnership - How To Measure Recurring Revenue In Salesforce

[5] AccountAim - How to Build and Use an ARR Waterfall in Revenue Operations

[6] ScaleXP - HubSpot QuickBooks Integration for SaaS