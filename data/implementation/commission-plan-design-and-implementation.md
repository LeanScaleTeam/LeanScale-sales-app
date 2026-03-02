# Commission Plan Design and Implementation — Implementation

## Project One-Pager

Quick reference for architects. One per project type. Fill this out FIRST — it serves as the project's identity card.

### Commission Plan Design and Implementation One-Pager

#### Project Type

- Category: Balanced
- Primary Deliverable: Documented commission plan with configured tracking system, real-time dashboards, and payout processing workflow

##### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Heavy | 3-5 refinement loops across plan design, crediting rules, and quota framework |
| 2. Engineering | Yes | Medium | Commission tracking system configuration, dashboard builds, payout workflow setup |
| 3. Enablement | Yes | Medium | Rep-facing training, manager guide, admin runbook for payout processing |
| 4. Handoff | Yes | Medium | Maintenance schedule for monthly payouts, quarterly plan reviews, annual refresh |

#### Phase Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. STRATEGY  │────>│ 2. ENGINEER  │────>│3. ENABLEMENT │────>│  4. HANDOFF  │
│    Heavy     │     │    Medium    │     │    Medium    │     │    Medium    │
│ 1a->1b->1c->1d │   │ 2a->2b->2c->2d │   │ 3a->3b->3c->3d │   │ 4a->4b->4c->4d │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
  Plan design &        Tracking system      Rep & manager        Payout process
  crediting rules      config + dashboards  training + docs      handoff + governance
```

**This project's flow:**

- Full 4-phase. Heavy strategy (plan design, crediting logic, quota framework require multiple stakeholder loops with Sales, Finance, and RevOps). Medium engineering (tracking system config, dashboards, payout workflow). Medium enablement (rep training, manager coaching, admin runbook). Medium handoff (monthly payout cadence, quarterly reviews, annual refresh).
- No phases skipped. Strategy is the heaviest phase because commission plan design requires alignment across Sales, Finance, and RevOps before any system configuration begins.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Watch intro video explaining commission plan design process and the Vasco approach
- Complete intake form covering: current plan documentation, role coverage, pain points, business priorities
- Gather and share all existing commission plan documents, policy memos, and spreadsheet templates
- Provide 6-12 months of historical payout data (amounts, timing, disputes)
- Get executive sponsor and Finance stakeholder confirmed for kickoff call

##### Track B: Architect Prep

- Pull CRM opportunity data to understand deal types, sizes, and sales cycle patterns
- Audit current commission tracking method (CRM reports, spreadsheets, dedicated software)
- Research industry benchmarks for client's stage/size (median AE OTE is $190K with 53:47 base-variable split [1]; median commission rate is 11.5% of ACV [2])
- Draft v0 commission plan structure based on intake form and benchmarks
- Create current-state process map of existing payout workflow

#### Refinement Loop (1b -> 1c -> 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present v0 plan structure, validate current state | VP Sales Ops, Finance Lead | Corrections for v1 |
| Refinement 1 | 1c | Review v1 plan rates and quota framework | VP Sales, RevOps, Finance | Rate and quota adjustments for v2 |
| Refinement 2 | 1c | Finalize crediting rules, ROE, dispute process | VP Sales, Sales Managers | Crediting logic locked for v3 |
| Refinement 3 | 1c | Review special incentives, clawbacks, edge cases | VP Sales, Finance, Legal | Final plan document draft |
| Sign-Off | 1d | Full plan walkthrough and strategic approval | All stakeholders | Signed-off commission plan |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held
- 1c. Refinement loop complete (v0 -> vFinal commission plan)
- 1d. Strategic sign-off obtained on plan design, crediting rules, and quota framework

##### Phase 2: Engineering

- 2a. Tech spec created for tracking system configuration
- 2b. Engineering handoff meeting held
- 2c. Build complete (tracking system, dashboards, payout workflow)
- 2d. QA/Test + customer sign-off on calculations and dashboards

##### Phase 3: Enablement

- 3a. Training materials prepped (rep summary, manager guide, admin runbook)
- 3b. Training sessions delivered (reps, managers, RevOps/Finance admins)
- 3c. Hypercare period complete (30-day monitoring)
- 3d. Enablement sign-off

##### Phase 4: Handoff

- 4a. Maintenance schedule documented (monthly payouts, quarterly reviews, annual refresh)
- 4b. Internal handoff (SME -> Architect) complete
- 4c. External handoff (Vasco -> Customer) complete
- 4d. Project closed and archived

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| Commission plan intake form | Capture current state, pain points, goals | All fields filled, historical data received |
| Plan design worksheet | Iterate on rates, tiers, accelerators, thresholds | All roles covered, benchmarks applied |
| Crediting rules matrix | Document ownership, splits, ROE scenarios | All common scenarios addressed, edge cases noted |
| Quota framework document | Define quota methodology, ramps, adjustments | Methodology selected, ramp schedule set |
| Tracking system requirements | Define what the tracking system must do | All requirements prioritized |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| Commission plan document | Plan design worksheet | Sales team distribution, board reporting |
| Visual one-pager | Plan design worksheet | Quick reference for reps and managers |
| Rules of engagement document | Crediting rules matrix | Dispute prevention, onboarding new reps |
| Configured tracking system | Tracking system requirements | Real-time commission visibility |
| Dashboard package | Tracking system requirements | Rep, manager, and Finance reporting |
| Admin runbook | Build documentation | Monthly payout processing by RevOps/Finance |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Sales Reps | AEs, SDRs, AMs | Plan structure, rates, how to check earnings, dispute process | 45-60m |
| Managers | Sales Leaders, Team Leads | Team dashboards, coaching on attainment, handling rep questions | 30-45m |
| Admin | RevOps, Finance, Sales Ops | Payout processing, system maintenance, troubleshooting | 60m |
| Leadership | VP Sales, CFO | Commission expense reporting, quota attainment distribution | 30m |

##### Hypercare

- Applies: Yes
- Duration: 30 days (covers at least one full payout cycle)
- Office Hours: Yes — weekly 30-min slot for first 4 weeks

##### Training Assets to Create

- Video walkthrough: Commission plan overview (rates, tiers, accelerators with examples)
- Video walkthrough: Dashboard navigation for reps (how to check earnings)
- Video walkthrough: Monthly payout processing walkthrough for admins
- Doc: Commission plan summary (2-3 pages, plain language)
- Doc: Visual one-pager with rates, thresholds, and example calculations
- Doc: FAQ document (top 20 anticipated questions)
- Doc: Admin runbook for payout processing

#### Handoff & Retention

##### Internal Handoff (SME -> Architect)

- Key context for Architect: Plan design rationale, crediting rules nuances, known edge cases, Finance payout preferences
- Escalation trigger: Any plan structure changes, new role additions, crediting rule modifications, accelerator/decelerator adjustments

##### External Handoff (Vasco -> Customer)

- Final meeting agenda: Deliverables review, payout process walkthrough, quarterly review cadence setup, Q&A
- Documentation package: Commission plan doc, visual one-pager, ROE doc, FAQ, admin runbook, training video walkthroughs, maintenance schedule

##### Maintenance Schedule

- Monthly: Payout processing, dispute review, dashboard accuracy check
- Quarterly: Quota attainment distribution review, plan effectiveness assessment
- Annually: Full commission plan refresh aligned with fiscal year planning
- Who owns: Single project = customer owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services (quarterly plan optimization, ongoing payout processing support) -> if no -> Downsell: Annual plan refresh project -> Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~1 quarter post-launch
- Internal prep trigger: 2 weeks before
- Decision: Architect handles routine adjustments / SME needed for structural plan changes

#### Key Assets

| Asset | When Used |
|-------|-----------|
| Commission plan intake form | Phase 1a |
| Plan design worksheet template | Phase 1b-1c |
| Crediting rules matrix template | Phase 1c |
| Tracking system evaluation scorecard | Phase 2a |
| Rep-facing plan summary template | Phase 3a |
| Admin runbook template | Phase 3a |

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| OTE (On-Target Earnings) | Total annual compensation (base + variable) when a rep hits 100% of quota |
| ACV (Annual Contract Value) | Annualized value of a contract, used as the commission basis for most SaaS companies |
| Pay Mix | Ratio of base salary to variable compensation (e.g., 50/50 means equal base and variable) |
| Quota | Revenue target a rep must achieve in a given period to earn 100% of their variable compensation |
| Attainment | Percentage of quota achieved (e.g., 80% attainment = rep closed 80% of their quota) |
| Accelerator | Higher commission rate that kicks in above a defined quota threshold (e.g., 1.5x rate above 100%) |
| Decelerator | Lower commission rate applied below a defined quota threshold (e.g., 0.5x rate below 50% attainment) |
| Clawback | Reversal of commission paid on a deal that churns within a defined period (typically 3-12 months) |
| SPIFF | Short-term incentive for specific behaviors (e.g., bonus for selling a new product) |
| Draw | Guaranteed minimum payout during ramp period; can be recoverable (deducted later) or non-recoverable |
| Rules of Engagement (ROE) | Documented policies for deal crediting, territory boundaries, and split scenarios |
| Split Credit | When multiple reps receive partial commission credit on the same deal (e.g., AE 70% / SDR 30%) |

#### Common Gotchas

- Overcomplicating the plan with too many metrics -> Limit to 2-3 metrics per role; only 24% of reps can easily calculate their own commissions [3]
- Designing plan misaligned with business goals -> Start with the 2-3 behaviors you want to drive, then build plan elements around those behaviors; 39% of revenue leaders admit misalignment [4]
- Building tracking system before plan is signed off -> Complete Phase 1 fully before configuring any system; changes post-build are expensive
- Unclear crediting rules causing disputes -> Document ROE and walk through 10+ real scenarios with sales leadership before rollout
- Skipping Finance alignment -> Finance must approve commission expense budget and payout workflow; involve them from kickoff
- Forgetting ramp quota for new hires -> New reps need graduated quotas (25%/50%/75%/100% over first 4 months) to avoid early demotivation

#### Methodology Options

| Option | When to Use | Complexity |
|--------|-------------|------------|
| Spreadsheet-based | <20 reps, simple plan, budget-constrained | Low |
| CRM-native tracking | 20-50 reps, moderate plan complexity, Salesforce/HubSpot already in place | Medium |
| Dedicated commission software | 50+ reps OR complex plans (multi-tier, splits, clawbacks) | High |

---

## Phase 1: Strategy

**Goal:** Get stakeholder sign-off on the complete commission plan design, including rates, tiers, crediting rules, quota framework, and special incentives.

**Output:** Signed-off commission plan document + Definition Alignment Document + Rules of Engagement document.

### 1a. Pre-Kickoff

Two parallel tracks run after the AE closes and before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video | Explain commission plan design process, what we need from them, and why alignment matters | Video (5-10 min) |
| Definition Alignment Document | Get stakeholder sign-off on compensation terms (OTE, ACV, Pay Mix, Quota, Attainment, Accelerator, Clawback, etc.) | Google Doc |
| Pre-filled intake form | Capture current plan details, pain points, business priorities, covered roles, budget constraints | Google Form or Doc |
| Document request | Collect all existing plan documents, policy memos, payout spreadsheets, and 6-12 months of payout history | Email with checklist |

**Completion tracking:** RevOps or Sales Ops point of contact follows up. Do not cancel kickoff if incomplete, but push hard. Missing payout data and plan documents are the top blockers.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Gather inputs (intake form, existing plan docs, CRM opp data) | Raw data collected |
| 2 | Current state assessment: map existing plan structure and payout workflow | Where they are now (rates, tiers, tracking method, pain points) |
| 3 | Benchmark analysis: compare current plan to SaaS benchmarks | Gap identification vs. industry standards |
| 4 | Future state design: draft v0 commission plan structure | Recommended rates, tiers, accelerators, quota framework |
| 5 | Create kickoff call assets | Current-state process map, benchmark comparison, questions list |

**Critical:** Mark everything as ASSUMED. The kickoff call validates.

#### Stakeholder Alignment Document

Get stakeholder sign-off on terms BEFORE building anything. Commission projects stall when Sales and Finance disagree on definitions mid-build.

| Term | Our Definition | Internally Approved? |
|------|---|---|
| OTE (On-Target Earnings) | Total annual compensation (base + variable) at 100% quota attainment | [ ] Yes / [ ] No |
| ACV (Annual Contract Value) | Annualized value of a contract; primary commission basis | [ ] Yes / [ ] No |
| Quota | Revenue target assigned to a rep for a defined period | [ ] Yes / [ ] No |
| Attainment | Percentage of quota achieved in the measurement period | [ ] Yes / [ ] No |
| Pay Mix | Ratio of base salary to variable compensation | [ ] Yes / [ ] No |
| Accelerator | Higher commission rate applied above a defined attainment threshold | [ ] Yes / [ ] No |
| Clawback | Commission reversal when a customer churns within a specified period | [ ] Yes / [ ] No |
| Split Credit | Multiple reps receiving partial commission credit on the same deal | [ ] Yes / [ ] No |
| Draw | Guaranteed minimum payout during ramp (recoverable or non-recoverable) | [ ] Yes / [ ] No |

**Instructions to customer:**

Review each definition with your Sales and Finance leadership teams. Check "Yes" when approved. We cannot proceed with plan design until all terms are aligned — misaligned definitions are the #1 cause of plan disputes post-launch.

---

### 1b. Kickoff Call

**Purpose:** Present v0 commission plan and get alignment on current state, business priorities, and initial plan direction. We walk in with work done — customer reacts, not creates from scratch.

#### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through v0 plan structure | "Here's what we built from your intake and benchmarks" |
| 15-30 | Validate assumptions | ASSUMED items -> CONFIRMED or corrected (current rates, roles covered, pain points) |
| 30-45 | Definition alignment | Review Definition Alignment Doc; flag terms needing internal discussion |
| 45-55 | Business priority alignment | Confirm: new business vs expansion vs retention priority for plan design |
| 55-65 | Identify gaps | Missing data, stakeholders not yet consulted, unclear priorities |
| 65-75 | Next steps | Schedule refinement meetings, assign homework |

#### What We Bring

- v0 commission plan structure (rates, tiers, accelerators, quota framework — all ASSUMED)
- Current-state process map of existing payout workflow
- Benchmark comparison (client's current plan vs. SaaS benchmarks)
- Definition Alignment Document (pre-filled with our recommendations)
- Questions list (what we need to validate)

#### What We Leave With

- Feedback and corrections on v0 (info needed to create v1)
- Confirmed business priorities (which behaviors to incentivize)
- Confirmed definitions (or clear blockers requiring executive alignment)
- Refinement meeting schedule
- Homework: Finance to confirm commission expense budget, Sales to review crediting scenarios

---

### 1c. Alignment Loop & Strategic Meeting Cadence

**Purpose:** Iterate on the commission plan until sign-off.

#### The Pattern

```
Kickoff Call (gather info)
    |
Process info -> v1
    |
Meeting 2 (present v1 rates and quotas, gather) -> v2
    |
Meeting 3 (present v2 crediting rules, gather) -> v3
    |
Meeting 4 (review special incentives and edge cases) -> v4
    |
Final Review -> Sign-off
```

#### Before Each Meeting

1. Process previous meeting transcript/notes into updated plan version
2. Update commission plan version (v[n-1] -> v[n])
3. Prepare questions for next validation round
4. Flag any items that require Finance or Legal review

#### During Each Meeting

1. Walk through current version of relevant plan section
2. Capture corrections and refinements
3. Validate what is now CONFIRMED
4. Identify remaining ASSUMED items
5. Test plan against real deal scenarios (ask: "If Rep X closed Deal Y, what would they earn?")

#### After Each Meeting

1. Update plan version
2. Track what moved from ASSUMED -> CONFIRMED
3. Update working documents (crediting matrix, quota framework, rate tables)

#### Meeting Types

| Meeting Type | Focus | Stakeholder |
|--------------|-------|-------------|
| Plan Structure Review | Rates, tiers, accelerators, decelerators, pay mix | VP Sales, Finance, RevOps |
| Quota Framework Review | Quota methodology, ramp schedule, attainment thresholds | VP Sales, Sales Managers |
| Crediting & ROE Review | Deal ownership, split scenarios, dispute resolution | VP Sales, Sales Managers |
| Special Incentives | Multi-year deals, SPIFFs, clawbacks, kickers | VP Sales, Finance, Legal |
| Final Review | Full plan walkthrough, tracking system requirements | All stakeholders |

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 2-3 days |
| Kickoff call | Day 1 of engagement |
| Meeting loop | 2-4 weeks (depends on stakeholder availability and plan complexity) |
| Final review + sign-off | When all plan elements CONFIRMED |

---

### 1d. Strategic Sign-Off

**Purpose:** Confirm we have a complete, approved commission plan before building any tracking systems.

#### Validation Checkpoint

- Definition Alignment Document signed off by Sales and Finance stakeholders
- Commission plan rates and tiers confirmed for all covered roles (AE, SDR, AM, etc.)
- Quota framework approved (methodology, thresholds, ramps, adjustments)
- Rules of engagement documented and reviewed against 10+ real scenarios
- Special incentives defined (multi-year, SPIFFs, clawbacks, kickers)
- Dispute resolution process documented
- Exception handling policies documented with approval authority
- Commission expense projected within Finance budget
- Tracking system selected and requirements documented
- All critical inputs CONFIRMED (vs ASSUMED)

#### Decision Point

- **Proceed to Engineering** -> Customer wants tracking system built and dashboards configured
- **Project reduced scope** -> Some customers may only need plan design documentation without system implementation. If so, skip Phase 2 and move to Enablement with documentation-only training.

---

## Phase 2: Engineering

**Goal:** Build and test the commission tracking system, dashboards, and payout processing workflow based on the approved commission plan.

**Output:** Configured tracking system with accurate calculations, real-time dashboards, and documented payout workflow — all tested and customer-approved.

| Project Type | Engineering Weight | Description |
|--------------|-------------------|-------------|
| Spreadsheet | Light (20-30%) | Structured spreadsheet with formulas, limited dashboard needs |
| CRM-native | Medium (40-50%) | Salesforce/HubSpot reports, custom fields, basic automation |
| Dedicated SW | Heavy (50-60%) | CaptivateIQ, QuotaPath, or Everstage configuration with integrations |

### Sub-Phases

```
2a Tech Spec -> 2b Engineering Handoff -> 2c Build -> 2d Test
```

---

### 2a. Tech Spec

**Purpose:** Translate the signed-off commission plan into technical specifications for the tracking system.

**Input:** Signed-off commission plan, crediting rules, quota framework, tracking system selection

**Output:** Draft tech spec containing:

- Commission rate table configuration (base rates, tier breakpoints, accelerator multipliers per role)
- Quota assignment mapping (rep -> quota amount -> measurement period)
- Calculation logic for each plan element (attainment %, tier determination, accelerator trigger, clawback logic)
- Data source mapping (CRM opportunity fields -> commission system inputs: deal amount, close date, deal owner, deal type)
- Dashboard specifications (rep view, manager view, Finance/admin view)
- Payout workflow configuration (calculation cutoff, approval chain, payroll export format)
- Integration specs (CRM -> commission system data sync frequency, field mappings)

---

### 2b. Engineering Handoff

**Purpose:** Review tech specs with engineer before building.

**Who attends:** Architect + Engineer (or engineering team)

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through specs | Architect explains plan design rationale + tech spec |
| 15-30 | Engineer questions | Clarify calculation logic, flag integration risks, discuss edge cases |
| 30-45 | Refine and approve | Adjust specs, confirm build sequence, agree on testing approach |

**What Architect brings:**

- Signed-off commission plan (for strategic context)
- Draft tech spec (from 2a)
- Sample calculations (5-10 deal scenarios with expected commission amounts)
- Questions list (anything flagged as unclear)

**What engineer leaves with:**

- Approved tech spec
- Build sequence: (1) Rate tables -> (2) Quota assignments -> (3) Calculation logic -> (4) Dashboards -> (5) Payout workflow -> (6) Integrations
- Known risks/dependencies (CRM data quality, integration latency, historical data migration)

---

### 2c. Build (Configure)

**Purpose:** Configure the commission tracking system based on approved tech spec.

**Input:** Approved tech spec from 2b

**Build sequence:**

| Component | What Gets Built | System |
|-----------|-----------------|--------|
| 1. Rate tables | Commission rates by role, tier breakpoints, accelerator multipliers | Commission system or spreadsheet |
| 2. Quota assignments | Rep-level quota amounts, measurement periods, ramp schedules | Commission system or spreadsheet |
| 3. Calculation logic | Attainment %, tier determination, accelerator triggers, clawback rules | Commission system or spreadsheet |
| 4. CRM integration | Opportunity data sync (deal amounts, dates, owners, types) | CRM -> commission system |
| 5. Rep dashboards | Quota attainment, commissions earned, projected payout | Commission system or BI tool |
| 6. Manager dashboards | Team attainment, payout forecast, individual performance | Commission system or BI tool |
| 7. Admin/Finance views | Payout processing, audit trails, commission expense reporting | Commission system or spreadsheet |
| 8. Alerts | Deal closed, quota achieved, accelerator triggered | Commission system or email |
| 9. Payout workflow | Calculation cutoff, approval chain, payroll export | Commission system or manual process |
| 10. Reporting | Month-end and quarter-end commission summary reports | Commission system or BI tool |

**Build tracking:**

- Component 1: Rate tables configured
- Component 2: Quota assignments loaded
- Component 3: Calculation logic implemented
- Component 4: CRM integration connected and syncing
- Component 5: Rep dashboards built
- Component 6: Manager dashboards built
- Component 7: Admin/Finance views built
- Component 8: Alerts configured
- Component 9: Payout workflow established
- Component 10: Summary reports created

---

### 2d. QA / Test + Sign-Off

**Purpose:** Verify calculations are accurate and get customer approval.

**Two types of testing:**

| Type | Who | Purpose |
|------|-----|---------|
| Technical Testing | Our team | Verify calculations match plan design across all scenarios |
| Customer Testing | Customer | Verify system does what they need and outputs are understandable |

**Technical testing checklist:**

- Run 20-30 historical deals through new plan calculations
- Compare new plan payouts to what would have been paid under old plan
- Test base rate calculations at 50%, 75%, 100%, 125%, 150% attainment
- Test accelerator triggers at exact breakpoints and above
- Test decelerator logic (if applicable) at below-threshold attainment
- Test split credit scenarios (AE/SDR, AE/AE, overlay roles)
- Test multi-year deal incentives
- Test clawback calculations for churned deals
- Test ramp quota calculations for new hires at each ramp stage
- Test territory change and mid-period adjustments
- Verify dashboard data accuracy for 3+ reps across different attainment levels
- Verify payout export matches expected format for payroll
- Confirm data refresh frequency and document any lag between CRM and commission system

**Customer testing:**

- Walk RevOps/Finance through payout processing workflow end-to-end
- Have 2-3 sales reps test dashboard and verify they can understand their commission statements
- Walk Sales Leadership through manager dashboard and confirm it answers their questions
- Test a real payout cycle (or simulated payout cycle) end-to-end

**Engineering sign-off checkpoint:**

- All calculations match plan design for every scenario tested
- Dashboards render correctly for all role types
- Payout workflow tested end-to-end
- Historical deal comparison reviewed — no unexpected outliers
- Customer has tested and approved
- Ready for enablement

**Decision point:**

- **Proceed to Enablement** -> System is built, calculations verified, needs training/adoption
- **Loop back to Build** -> Calculation errors found, dashboard issues, or plan design changes required

---

## Phase 3: Enablement

**Goal:** Sales reps, managers, and admins can use the new commission plan and tracking system independently.

**Output:** Trained team with complete documentation, first payout cycle completed, no critical issues.

### Sub-Phases

```
3a Training Prep -> 3b Training Sessions -> 3c Hypercare -> 3d Enablement Sign-Off
```

---

### 3a. Training Prep

**Purpose:** Create training materials from commission plan documents and tracking system configuration.

**Input:** Signed-off commission plan + crediting rules + configured tracking system + dashboards

**Output:** Training package containing:

- **Rep-facing commission plan summary** (2-3 pages, plain language): rates, thresholds, examples of commission calculations at different attainment levels, how to access dashboard
- **Visual one-pager**: rates, tiers, accelerators shown graphically with example deals
- **Manager guide**: how to interpret team dashboards, coaching reps on attainment, handling commission questions
- **Admin runbook**: step-by-step monthly payout processing, reconciliation checklist, error handling, audit trail procedures
- **FAQ document**: top 20 anticipated questions covering plan mechanics, crediting scenarios, dispute process, system access
- **Example scenarios**: 5-10 worked examples showing commission calculations for different deal types, attainment levels, and split scenarios

---

### 3b. Training Sessions

**Purpose:** Transfer knowledge to customer team across all stakeholder groups.

**Training delivery sequence:**

| Session | Audience | Focus | Duration | Materials |
|---------|----------|-------|----------|-----------|
| 1 | All Sales Reps | Plan structure, rates, quotas, crediting rules, how to check earnings, dispute process | 45-60m | Plan summary, one-pager, FAQ |
| 2 | Sales Managers | Team dashboards, attainment coaching, handling rep questions, escalation path | 30-45m | Manager guide, dashboard walkthrough |
| 3 | RevOps/Finance Admins | Payout processing workflow, reconciliation, troubleshooting, system admin | 60m | Admin runbook, system documentation |
| 4 | Leadership (VP Sales, CFO) | Commission expense reporting, quota attainment distribution, plan governance | 30m | Dashboard walkthrough, governance cadence |

**Training delivery process:**

1. Schedule sessions by audience (reps first, then managers, then admins, then leadership)
2. Deliver training live with screen sharing of actual system
3. Walk through real example calculations (not hypothetical — use real deal data anonymized if needed)
4. Record session as video walkthrough for future reference and absent attendees
5. Answer questions and document any requiring policy clarification
6. Distribute documentation package immediately after session

**Output:**

- Trained stakeholders across all role types
- Video recordings for each session
- Questions log (feeds into FAQ updates)

---

### 3c. Hypercare

**Purpose:** Intensive post-launch support through the first payout cycle to catch issues early.

**Duration:** 30 days (covers at least one full payout cycle)

**What happens:**

- Monitor first payout cycle end-to-end (calculation -> approval -> payroll export -> payment)
- Weekly 30-min office hours for questions from reps, managers, and admins
- Track dispute volume and types in first 30 days (target: <5% of reps filing disputes)
- Monitor dashboard adoption (target: 80%+ of reps accessing dashboard within first 30 days) [5]
- Bug triage and fixes for any calculation errors or dashboard issues
- Rapid response (within 24 hours) to payout-related issues
- FAQ updates based on questions received during hypercare

**When issues arise during first payout cycle:**

1. Document the issue (deal, expected vs. actual commission)
2. Determine if it is a system bug, plan design issue, or data quality problem
3. Fix system bugs immediately
4. Escalate plan design issues to SME
5. Document data quality issues and remediation steps

**Output:** First payout cycle completed accurately, dispute volume below target, stabilized system

---

### 3d. Enablement Sign-Off

**Purpose:** Confirm customer can operate the commission plan and tracking system independently.

**Validation checkpoint:**

- All training sessions delivered and recorded
- Training recordings and documentation package distributed
- First payout cycle completed successfully
- Hypercare period complete — no critical issues outstanding
- Dashboard adoption meets target (80%+ of reps accessing)
- Dispute volume within acceptable range (<5% of reps)
- RevOps/Finance can process payouts without support
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** -> Customer is enabled, first payout cycle clean, team can operate independently
- **Extend Hypercare** -> Payout errors found, low adoption, high dispute volume — needs another cycle

---

## Phase 4: Handoff

**Goal:** Clean project close with maintenance plan established and retention/expansion path set.

**Output:** Maintenance schedule documented, internal context transferred, customer owns the commission system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule -> 4b Internal Handoff -> 4c External Handoff -> 4d Project Close
                              (SME -> Architect)      (Vasco -> Customer)    (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|-------------------|---------------|
| Single Project | Customer owns | 4c (External Handoff) — customer receives maintenance schedule and runs it themselves |
| Dedicated (Multi-Project) | Architect owns | 4b (Internal Handoff) — Architect receives maintenance schedule and runs it for customer |

---

### 4a. Maintenance Schedule

**Purpose:** Document what needs ongoing attention after the project is complete — cadences, tasks, triggers for re-engagement.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|-------------------|-------------------|
| Payout processing cycle | Calculate commissions, run approval workflow, export to payroll | Payout delayed >3 business days past scheduled date |
| Dispute review | Review all disputes filed in the month, resolve per SLA | >5% of reps filing disputes in a single month |
| Dashboard accuracy check | Verify 3-5 rep commission statements against source data | Any calculation discrepancy >$100 |
| New hire onboarding | Add new reps to system, set ramp quotas, provide plan docs | New rep not in system within 5 business days of start |
| Departed rep processing | Calculate final commissions, handle pipeline handoff credits | Departed rep commissions not finalized within 30 days |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|---|---|---|
| Quota attainment distribution | % of reps at <50%, 50-100%, 100-150%, >150% attainment | If <40% of reps hitting quota, review quota-setting methodology. Industry target: 60-80% [6] |
| Commission expense vs. budget | Total commission expense as % of revenue vs. plan | If >5% over budget, review accelerator triggers and plan structure |
| Plan effectiveness assessment | Are incentivized behaviors actually changing? (e.g., multi-year deal volume) | If target behaviors not increasing, reassess incentive weightings |
| Dispute pattern analysis | Categorize disputes by type — are the same issues recurring? | If same dispute type >3x in a quarter, update ROE or crediting rules |

**After First Business Cycle (30-90 days post-launch):**

- Full payout cycle audit: verify every calculation from raw deal data through to payroll export
- Rep satisfaction pulse: 5-question survey on plan clarity, dashboard usability, payout accuracy
- Compare actual commission expense to projected — identify any structural surprises

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Quota attainment collapse | <40% of reps hitting quota for 2+ months | Re-engage SME to review quota methodology and plan calibration |
| Commission expense blowout | >10% over budget for 2+ consecutive months | Review accelerator structure, consider introducing decelerators |
| Dispute volume spike | >10% of reps filing disputes in a single month | Review ROE, update crediting rules, consider additional training |
| New role/segment added | Company adds new sales role or market segment | Scope plan extension — new role needs its own plan component |
| Acquisition or restructuring | Territory or org changes affecting >25% of reps | Scope full plan revision project |

**Every 6-12 Months:**

- Annual commission plan refresh aligned with fiscal year planning
- Benchmark update: compare current plan to latest SaaS compensation benchmarks (median OTE, quota-to-OTE ratios, commission rates)
- Full plan document review: update rates, tiers, accelerators based on business performance and market conditions
- Quota-setting process for new fiscal year

---

### 4b. Internal Handoff (SME -> Architect)

**Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- Plan design rationale: why specific rates, tiers, and accelerators were chosen
- Customer context: stakeholder dynamics (Sales vs Finance tensions, if any), approval preferences, communication style
- Known edge cases: deals that required manual overrides, unusual split scenarios, exception precedents
- Tracking system specifics: where calculations live, data refresh timing, known limitations
- When to escalate back to SME

**Escalation guidelines:**

| Issue Type | Who Handles | Examples |
|-----------|-------------|----------|
| Monthly payout processing questions | Architect | "How do I run the export?" "A rep's quota looks wrong" |
| Dashboard tweaks, minor report adjustments | Architect | Adding a filter, fixing a label, adjusting date ranges |
| New rep onboarding to plan | Architect | Adding quota, setting ramp, providing plan docs |
| Plan structure changes (rates, tiers) | SME | Changing accelerator multiplier, adding new tier |
| New role plan design | SME | Designing plan for new CS or SE commission role |
| Crediting rule changes | SME | Modifying split percentages, changing ROE policies |
| Significant calculation logic changes | SME | Adding clawback, changing commission basis |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing it. SME walks Architect through each maintenance task, especially the monthly payout processing cycle.

---

### 4c. External Handoff (Vasco -> Customer)

**Purpose:** Formal project completion with customer.

**Final project meeting agenda:**

1. Review everything delivered: commission plan document, tracking system, dashboards, payout workflow
2. Walk through documentation package (plan summary, one-pager, ROE, FAQ, admin runbook)
3. Review maintenance schedule in detail (monthly, quarterly, annual tasks)
4. Confirm nothing outstanding — all disputes from hypercare resolved, all edge cases documented
5. Answer final questions
6. Make it explicit: "Project complete. You are now self-sufficient to run this."
7. Schedule 60-day follow-up call
8. **For Single Project engagements:** Hand over the maintenance schedule and record a video walkthrough of the full process

**Documentation package:**

- Commission plan document (final version)
- Visual one-pager
- Rules of engagement document
- Dispute resolution process document
- FAQ document
- Admin runbook for monthly payout processing
- All training video recordings
- Definition Alignment Document (final version)
- Dashboard user guide
- Maintenance Schedule
- Support contact info

**Output:** Customer owns the commission system. Project formally complete.

---

### 4d. Project Close

**Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved to proper location (plan docs, tech specs, training materials)
- Handoff documentation complete
- Project status updated in tracking system
- Time/billing finalized

#### Internal Debrief (Optional but Recommended)

- What went well? (e.g., Finance engagement, plan simplicity, clean first payout)
- What would we do differently? (e.g., earlier Finance involvement, more historical deal testing)
- Any learnings to feed back into SOPs? (e.g., new edge case pattern, improved benchmark data)

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|---|---|
| Single Project | Upsell -> Downsell -> Retry |
| Multi-Project (Dedicated) | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (quarterly plan optimization, ongoing payout support, annual refresh)
   | if no
2. Downsell: Annual plan refresh project (one-time, each fiscal year)
   | if yes
3. Retry retainer at end of next project cycle
```

**Script:**

> "Now that Commission Plan Design and Implementation is complete, there are two ways we can continue working together. Option 1: We set you up on managed services where we handle quarterly plan reviews, payout processing support, and the annual plan refresh. Option 2: We scope an annual plan refresh project when your next fiscal year approaches. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

> "On [date ~quarter out], we'll review how the commission plan is performing — quota attainment distribution, commission expense vs. budget, dispute volume — and see if any adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull quota attainment distribution, commission expense, dispute data |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points. |

**At the refinement check-in:**

- Review performance: quota attainment distribution (target: 60-80% hitting quota)
- Review commission expense vs. budget (target: within 5% of plan)
- Review dispute volume and patterns
- If minor adjustments: Architect handles tweaks (quota adjustments, ramp schedule updates)
- If major changes needed: Scope new project (plan redesign, new role addition, structural changes)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Commission plan document (rates, tiers, accelerators, decelerators, caps, quotas, ramps, draws by role)
- Rules of engagement document (crediting rules, split scenarios, territory handoff policies)
- Quota framework document (methodology, thresholds, ramp schedules, adjustment policies)
- Dispute resolution process document
- Exception handling policies
- Definition Alignment Document (final, signed off)

**Technical Deliverables (Phase 2):**

- Configured commission tracking system (rate tables, quota assignments, calculation logic)
- Rep-facing dashboard (quota attainment, commissions earned, projected payout)
- Manager dashboard (team attainment, payout forecast, individual performance)
- Finance/Admin dashboard (payout processing, audit trail, commission expense reporting)
- Payout workflow (calculation cutoff, approval chain, payroll export)
- Automated alerts (deal closed, quota achieved, accelerator triggered)
- Month-end and quarter-end commission summary reports

**Documentation Package:**

- Training video recordings (plan walkthrough, dashboard navigation, payout processing)
- Commission plan summary (2-3 pages, plain language)
- Visual one-pager (rates, thresholds, example calculations)
- FAQ document (top 20 questions)
- Manager guide (team dashboards, coaching, handling questions)
- Admin runbook (monthly payout processing, reconciliation, troubleshooting)
- Definition Alignment Document (final version)
- Maintenance Schedule (monthly, quarterly, annual tasks)

---

## Appendix

### Roles

| Role | What They Do |
|------|--------------|
| Architect | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| Engineer | CRM build, automation, dashboards (Phase 2) |
| SME | Project/implementation team brought in for project-specific work |

### Playbook Structure

This is the **implementation playbook** — the step-by-step execution guide for delivering a Commission Plan Design and Implementation project from first contact to project close. It is the third file in a 3-file playbook structure:

| File | Purpose |
|------|---------|
| Advisory | What the project IS — positioning, outcomes, approaches |
| Methodology | HOW we think about the problem — frameworks, concepts, best practices |
| Implementation | WHAT to DO — step-by-step execution with checklists |

### What Each Phase Produces

| Phase | Output | Gate Criteria |
|-------|--------|---------------|
| Phase 1: Strategy | Signed-off commission plan (plan document + ROE + quota framework + Definition Alignment Doc) | Sales, Finance, and RevOps stakeholders have approved all plan elements |
| Phase 2: Engineering | Configured tracking system with dashboards and payout workflow | All calculations match plan design, customer has tested and approved |
| Phase 3: Enablement | Trained team with documentation, first payout cycle clean | All training delivered, hypercare complete, team can operate independently |
| Phase 4: Handoff | Independent customer + archived project | Internal/external handoffs complete, maintenance plan in place, project closed |

### How to Adapt Per Project Type

| Tracking Approach | Strategy Weight | Engineering Weight | Enablement Weight | Notes |
|---|---|---|---|---|
| Spreadsheet-based | 50% | 20% | 30% | Lighter build, heavier training on spreadsheet maintenance |
| CRM-native | 40% | 35% | 25% | Moderate build in Salesforce/HubSpot |
| Dedicated software | 35% | 40% | 25% | CaptivateIQ, QuotaPath, or Everstage — more config, less manual process training |

**Adaptation rules:**

- Spreadsheet-based tracking compresses Phase 2 but expands Phase 3 (more training needed on manual processes)
- Dedicated software expands Phase 2 (more configuration) but compresses Phase 3 (system is self-service)
- **Phase 1 always applies heavily** — plan design is the core value regardless of tracking method
- **Phase 4 always applies** — every project needs handoff, but maintenance complexity varies by tracking approach

### Single vs Dedicated Client Split

| Engagement Type | What It Means | Key Difference |
|---|---|---|
| Single Project | One-off project engagement | Customer owns maintenance post-handoff (4c) |
| Dedicated (Multi-Project) | Ongoing retainer / multiple projects | Architect owns maintenance post-handoff (4b) |

### Phase 1 Key Principles

**1. We educate.** Most sales leaders have strong opinions about comp plans but limited exposure to B2B SaaS benchmarks. We educate them on what the data says — median commission rates (11.5% of ACV [2]), typical pay mixes (53:47 base-to-variable [1]), and quota-to-OTE ratios (median 4.2x [7]) — so they can make informed decisions rather than gut-feel choices.

**2. We drive alignment.** Commission plan projects stall when Sales wants aggressive accelerators but Finance wants cost containment. We facilitate the hard conversation between Sales and Finance, using data to anchor both sides. The Definition Alignment Document forces agreement on terms before building anything.

**3. We come with an opinion.** We show up with a v0 plan based on benchmarks, not a blank template. The customer reacts and adjusts, not creates from scratch.

**4. We show best practices.** We anchor everything in what works: fewer than 15% of SaaS companies cap commissions [4], 82% use accelerators [4], and clawback periods typically run 3-12 months.

**Why Phase 1 matters:** Commission plan projects are uniquely political. Sales, Finance, and RevOps all have different priorities — Sales wants motivation, Finance wants predictability, RevOps wants simplicity. Phase 1 forces alignment BEFORE configuring any tracking system. The real value is not the spreadsheet or dashboard — it is the cross-functional agreement on plan mechanics that happens through the refinement loop.

### Phase 2 Key Principles

**Tech Spec (2a):** The critical translation is from plan language ("15% accelerator above quota") to system language ("IF attainment > 100%, THEN rate = base_rate * 1.5"). Architect validates with sample calculations.

**Engineering Handoff (2b):** Engineer must understand the WHY behind each calculation rule. Commission calculations have business logic embedded in them — understanding the plan design prevents build errors.

**Build (2c):** Commission tracking systems range from structured spreadsheets ($0, manual) to CaptivateIQ ($50+/user/month, automated) [8]. Match the tracking approach to the company's size, plan complexity, and budget. For <20 reps with a simple plan, a well-built spreadsheet is appropriate. For 50+ reps or complex multi-tier plans with splits and clawbacks, dedicated software pays for itself in time savings: companies using commission software save 1-4 admin days per monthly payout cycle compared to spreadsheets [9].

### Phase 3 Key Principles

**Training Prep (3a):** The most important training asset is the worked example — show a rep exactly how their commission is calculated on a real deal. Only 24% of reps can easily calculate their own commissions [3], so clarity in examples is the difference between adoption and confusion.

**Training Sessions (3b):** Train reps FIRST. If reps understand the plan and trust the numbers, manager questions drop. If reps are confused, managers get flooded with questions they cannot answer.

**Hypercare (3c):** The first payout cycle is the make-or-break moment. If the first payout is late, inaccurate, or confusing, trust erodes immediately. Monitor the first cycle closely and resolve any issues within 24 hours.

### Phase 4 Key Principles

**Maintenance Schedule (4a):** Commission plans require more ongoing maintenance than most projects. Monthly payout processing is a recurring operational task, not a one-time build. The maintenance schedule must be detailed enough for a new admin to follow.

**Internal Handoff (4b):** The most important context to transfer is the political dynamics. Commission plans touch compensation, so sensitivities run high. The Architect needs to know which stakeholders are sensitive about which topics.

**External Handoff (4c):** For Single Project engagements, the maintenance schedule handoff is critical. Walk the customer through the monthly payout process step-by-step, record it, and make sure they have a named person responsible for each task.

**Project Close (4d):** Commission plans are natural recurring revenue generators — the annual refresh is a predictable re-engagement point.

---

## References

[1] Bridge Group - 2024 SaaS AE Metrics & Compensation Benchmark Report

[2] Everstage - SaaS Sales Compensation Benchmarks

[3] Everstage - Sales Compensation Statistics 2025

[4] ActivatedScale - SaaS Sales Compensation Benchmarks 2025

[5] Qobra - B2B Sales Commission Structures & Best Practices

[6] The SaaS CFO - How to Create a Sales Compensation Plan for SaaS

[7] QuotaPath - Quota:OTE Ratio Calculator

[8] Qobra - Best Sales Commission Software 2026