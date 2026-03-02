# Commission Tool Implementation — Implementation

## Project One-Pager

### Commission Tool Implementation One-Pager

#### Project Type

- **Category:** Technical
- **Primary Deliverable:** Fully configured commission management platform connected to CRM, finance, and HR systems with role-specific plans, crediting logic, automated calculations, and real-time visibility for reps, managers, and finance.

##### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Medium | Discovery, requirements gathering, plan documentation, tool selection |
| 2. Engineering | Yes | Heavy | Platform setup, integrations, plan configuration, data migration, QA |
| 3. Enablement | Yes | Medium | Admin training, manager training, rep rollout, hypercare |
| 4. Handoff | Yes | Medium | Documentation package, maintenance schedule, ownership transfer |

#### Phase Overview

Full 4-phase approach. Medium strategy (auditing current process, gathering plan docs, confirming tool). Heavy engineering (platform config, CRM/Finance/HR integrations, plan builds, crediting rules, historical data migration, QA). Medium enablement (tiered training: admins, managers, reps). Medium handoff (documentation package, maintenance cadence, vendor support contacts).

No phases are skipped. Engineering is the heaviest phase — typically 50-60% of total project effort.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Gather all current commission plan documents for every compensated role
- Document current commission calculation process (who does it, what tools, how long it takes)
- Provide admin access credentials for CRM (Salesforce/HubSpot), finance system (QuickBooks/NetSuite), and HRIS
- Identify all roles receiving commissions and their plan types
- Compile historical commission payment records (12-24 months)
- Confirm decision on commission tool (or provide budget parameters for selection)

##### Track B: Architect Prep

- Review CRM data model — identify opportunity fields, custom objects, and record types relevant to commissions
- Audit current commission spreadsheets or tools for calculation logic patterns
- Research client's selected commission tool (or prepare comparison matrix if tool not yet selected)
- Draft current-state process map with identified gaps and bottlenecks
- Prepare requirements checklist based on initial intake notes

#### Refinement Loop (1b -> 1c -> 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present current-state audit, validate plan inventory | VP Sales Ops, Finance, RevOps | Confirmed requirements, plan docs |
| Refinement 1 | 1c | Review crediting rules, split scenarios, edge cases | RevOps, Sales Leadership | Crediting logic document |
| Refinement 2 | 1c | Validate integration requirements, data mapping | RevOps, IT/Engineering | Integration spec confirmed |
| Sign-Off | 1d | Approve configuration plan, integration scope, timeline | All stakeholders | Strategic package signed off |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held
- 1c. Refinement loop complete (crediting rules + integration requirements confirmed)
- 1d. Strategic sign-off obtained

##### Phase 2: Engineering

- 2a. Tech spec created (platform configuration plan + integration mapping)
- 2b. Engineering handoff meeting held
- 2c. Build complete (platform, integrations, plans, crediting, data migration)
- 2d. QA/Test + customer sign-off (calculation accuracy validated)

##### Phase 3: Enablement

- 3a. Training materials prepped (admin, manager, rep guides)
- 3b. Training sessions delivered (3 tiers)
- 3c. Hypercare period complete (first full payout cycle supported)
- 3d. Enablement sign-off

##### Phase 4: Handoff

- 4a. Maintenance schedule documented and handed off
- 4b. Internal handoff (SME -> Architect) complete
- 4c. External handoff (implementation team -> Customer) complete
- 4d. Project closed and archived

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| Commission plan inventory | Catalog all plans, rates, tiers, rules | All roles documented with plan details |
| Crediting rules matrix | Map credit scenarios (primary, split, overlay) | Every deal scenario has a defined crediting rule |
| Integration requirements doc | Define CRM/Finance/HR connections and field maps | All system connections and field mappings listed |
| Historical data audit | Clean and normalize 12-24 months of data | Data ready for import with zero unresolved gaps |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| Configured commission platform | Plan inventory + crediting rules | Automated commission calculations |
| Integration documentation | Integration requirements doc | Understanding data flow between systems |
| Calculation test results | QA testing | Finance sign-off on accuracy |
| Admin operations guide | Configuration settings | Self-service platform management |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Admin | Finance, RevOps admins | Plan configuration, adjustments, disputes, exports | 60-90m |
| Manager | Sales managers | Team dashboards, attainment tracking, coaching | 30-45m |
| Rep | All sales reps | Self-service: earnings, quota, payout history | 20-30m |

##### Hypercare

- **Applies:** Yes
- **Duration:** 4-6 weeks (covers at least one full payout cycle)
- **Office Hours:** Yes — weekly 30-min slot for first month

##### Training Assets to Create

- Video walkthrough: Admin — plan configuration, adjustments, exports
- Video walkthrough: Manager dashboard navigation and team views
- Video walkthrough: Rep self-service — earnings, quota attainment, payout history
- Doc: Admin quick-reference guide (common tasks, troubleshooting)
- Doc: Manager quick-reference guide
- Doc: Rep FAQ — "How do I check my commissions?"

#### Handoff & Retention

##### Internal Handoff (SME -> Architect)

- **Key context for Architect:** Commission plan structures, crediting edge cases, integration architecture, known data quirks
- **Escalation trigger:** Any plan structure changes, new role additions, crediting logic modifications, integration failures

##### External Handoff

- **Final meeting agenda:** Review configuration, walk through documentation package, confirm maintenance cadence, answer final questions
- **Documentation package:** Configuration settings, integration details, troubleshooting guide, training recordings, admin/manager/rep reference guides

##### Maintenance Schedule

- **Monthly:** Verify calculation accuracy against Finance records, process new hire/departure changes
- **Quarterly:** Review plan configurations against business changes, audit crediting rules
- **Who owns:** Single project = customer owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services -> if no -> Downsell: Commission Plan Redesign or Comp Plan Design project -> Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~1 quarter after go-live
- Internal prep trigger: 2 weeks before
- Decision: Architect handles / SME needed

#### Key Assets

| Asset | When Used |
|-------|-----------|
| Commission plan inventory | Phase 1 (Strategy) |
| Crediting rules matrix | Phase 1-2 (Strategy/Build) |
| Integration mapping doc | Phase 2 (Engineering) |
| Calculation test results | Phase 2 (QA) |
| Admin quick-reference guide | Phase 3-4 (Enablement/Handoff) |

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| Closed-Won | Opportunity stage at which commission eligibility begins (may differ from invoice/payment date) |
| Quota | Target revenue or bookings amount assigned to a rep for a given period |
| Attainment | Percentage of quota achieved (e.g., $80K closed / $100K quota = 80% attainment) |
| Accelerator | Higher commission rate applied when rep exceeds quota threshold (e.g., 120%+ attainment) |
| Decelerator | Reduced commission rate applied when rep is below a minimum attainment threshold |
| Split Credit | When multiple reps receive partial credit for the same deal (e.g., 50/50 between two AEs) |
| Overlay Credit | Additional credit given to a supporting role (SE, CSM) without reducing primary rep's credit |
| Clawback | Commission reversal when a deal is cancelled, churns within a defined period, or invoice goes unpaid |
| SPIF | Sales Performance Incentive Fund — short-term bonus for specific behaviors or product pushes |
| Proration | Adjusting quota proportionally when a rep starts, leaves, or changes roles mid-period |

#### Common Gotchas

- Not getting real commission data on day 1 -> delays validation by weeks. Get data access commitment in kickoff prerequisites.
- Underestimating crediting complexity -> split credits, overlays, and mid-deal rep reassignments create edge cases that break calculations. Document every scenario upfront.
- Skipping historical validation -> going live without back-testing against actual payouts causes rep distrust. Always reconcile.
- Missing RevOps involvement -> implementation team cannot figure out custom CRM objects without someone who knows the data model. Require a dedicated RevOps resource.
- Payout timing misalignment -> commission tool calculates on close date but Finance pays on invoice date. Align timing logic before build.

#### Methodology Options

| Option | When to Use | Complexity |
|--------|------------|-----------|
| Single-plan implementation | Client has 1-2 simple commission plans, no splits | Low |
| Multi-plan with splits | Client has 3+ roles, split credits, overlays, accelerators | Medium |
| Enterprise with migration | Client has complex plans, historical data, multiple systems | High |

---

## Phase 1: Strategy

**Goal:** Get stakeholder sign-off on commission tool configuration requirements, crediting rules, and integration scope.

**Output:** Commission plan inventory + crediting rules matrix + integration requirements doc (signed off by Finance, RevOps, and Sales Leadership).

### 1a. Pre-Kickoff

Two parallel tracks run before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video | Explain what the commission tool project covers and why | Video (5-10 min) |
| Commission plan intake form | Collect all plan docs, roles, rates, rules in one place | Google Doc |
| Definition Alignment Document | Get sign-off on key terms (quota, attainment, clawback) | Google Doc |
| Data access checklist | Confirm admin access to CRM, Finance system, HRIS | Google Doc |

**What the customer provides:**

- Current commission plan documents for all compensated roles
- Historical commission payment records (12-24 months)
- Admin access to CRM (Salesforce/HubSpot), Finance system (QuickBooks/NetSuite), and HRIS
- Identification of the RevOps/SalesOps person who knows the CRM data model
- Decision on commission tool (or budget parameters for tool selection)

**Completion tracking:** Someone's job to follow up. Don't cancel kickoff if incomplete, but push hard after. Real commission data on day 1 is a prerequisite — without it, validation stalls.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Review intake form and background notes | Preliminary requirements list |
| 2 | Audit CRM data model (opportunity fields, custom objects, stages) | Data model map for commission relevance |
| 3 | Audit current commission spreadsheets/tools | Current-state process map with gaps |
| 4 | Research commission tool capabilities (if tool not yet selected) | Tool comparison matrix |
| 5 | Draft configuration requirements | v0 configuration plan |

**Critical:** Mark everything as ASSUMED. The kickoff call validates.

#### Stakeholder Alignment Document

Get stakeholder sign-off on terms BEFORE building anything. Commission terms are a top source of disputes — ensuring alignment prevents costly rework.

| Term | Our Definition | Internally Approved? |
|------|---|---|
| Closed-Won | Opportunity stage triggering commission eligibility | [ ] Yes / [ ] No |
| Quota | Target revenue assigned per rep per period | [ ] Yes / [ ] No |
| Attainment | % of quota achieved in a period | [ ] Yes / [ ] No |
| Accelerator | Higher rate applied above quota threshold | [ ] Yes / [ ] No |
| Split Credit | How credit divides when multiple reps work a deal | [ ] Yes / [ ] No |
| Clawback | When and how commissions are reversed (churn, cancellation, non-payment) | [ ] Yes / [ ] No |
| Proration | How quota adjusts for mid-period role/territory changes | [ ] Yes / [ ] No |

**Instructions to customer:**

Review each definition with your Finance and Sales Leadership team. Check "Yes" when approved. We cannot proceed with platform configuration until all terms are aligned.

---

### 1b. Kickoff Call

**Purpose:** Present current-state audit and v0 configuration plan. Validate commission plan inventory and crediting rules. We walk in with work done — customer reacts, not creates from scratch.

#### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through current-state audit | "Here's what we found in your CRM and commission process" |
| 15-30 | Validate plan inventory | Confirm all roles, plan types, rates, tiers |
| 30-45 | Review crediting scenarios | Identify primary, split, overlay, territory-based credits |
| 45-55 | Integration requirements | Confirm CRM, Finance, HRIS connections needed |
| 55-70 | Definition alignment | Review Definition Alignment Doc |
| 70+ | Next steps | Schedule refinement meetings, assign homework |

#### What We Bring

- v0 configuration plan (built from Track B prep)
- Current-state process map with identified gaps and pain points
- Commission plan inventory (pre-filled from intake form)
- Questions list (crediting edge cases, integration specifics)
- Definition Alignment Document (pre-filled with recommended definitions)

#### What We Leave With

- Confirmed commission plan inventory (or clear gaps to fill)
- Identified crediting scenarios requiring further discussion
- Integration requirements confirmed or flagged
- Homework: client to provide missing plan docs, historical data, edge case examples
- Refinement meetings scheduled

---

### 1c. Alignment Loop & Strategic Meeting Cadence

**Purpose:** Iterate on configuration requirements until sign-off. Typically 2-3 refinement meetings for commission tool projects.

#### The Pattern

```
Kickoff Call (audit, validate plan inventory)
    |
    v
Meeting 2: Deep-dive on crediting rules
    |
    v
Meeting 3: Integration and data requirements
    |
    v
Final Review -> Sign-off
```

#### Meeting Types for Commission Tool Implementation

| Meeting Type | Focus | Stakeholder |
|---|---|---|
| Crediting rules deep-dive | Split credits, overlays, territory changes, edge cases | RevOps, Sales Leadership |
| Integration & data mapping | CRM fields, Finance system, HRIS, sync frequency | RevOps, IT/Engineering |
| Finance validation | Payout timing, clawback logic, calculation frequency | VP Finance, Controller |
| Final review | Full configuration plan walkthrough, sign-off | All stakeholders |

#### Before Each Meeting

1. Update configuration plan with previous meeting's confirmed decisions
2. Prepare specific questions for remaining ASSUMED items
3. Draft crediting scenario test cases for validation

#### During Each Meeting

1. Walk through current configuration plan state
2. Capture corrections and new requirements
3. Validate what's now CONFIRMED
4. Flag remaining ASSUMED items

#### After Each Meeting

1. Update working documents (plan inventory, crediting matrix, integration doc)
2. Track what moved from ASSUMED -> CONFIRMED
3. Identify blockers for next meeting

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 2-3 days |
| Kickoff call | Day 1 of engagement |
| Refinement meetings | 1-2 weeks (2-3 meetings) |
| Final review + sign-off | When all plan and crediting rules CONFIRMED |

---

### 1d. Strategic Sign-Off

**Purpose:** Confirm we have everything to configure the platform.

#### Validation Checkpoint

- Definition Alignment Document signed off by Finance and Sales Leadership
- Commission plan inventory complete (all roles, all plan types)
- Crediting rules matrix complete (every deal scenario has a rule)
- Integration requirements confirmed (CRM, Finance, HRIS connections and field mappings)
- Payout timing and calculation frequency agreed
- Clawback and adjustment policies documented
- Historical data scope confirmed (which periods, which data sources)
- Tool selected and procurement complete (if new tool purchase)
- Customer understands what we're building and the build timeline

#### Decision Point

- **Proceed to Engineering** -> All plans, rules, and integrations documented and approved. This is the standard path — commission tool projects always require engineering.

---

## Phase 2: Engineering

**Goal:** Configure the commission platform, build integrations, migrate data, and validate calculations.

**Output:** Fully configured commission tool with accurate calculations verified against historical payouts.

| Project Type | Engineering Weight | Example |
|---|---|---|
| Commission Tool (this one) | Heavy (50-60%) | Platform config, 3+ integrations, plan builds, data migration |

### Sub-Phases

```
2a Tech Spec -> 2b Engineering Handoff -> 2c Build -> 2d Test
```

---

### 2a. Tech Spec

**Purpose:** Translate strategic package into platform configuration specifications.

**Input:** Signed-off commission plan inventory, crediting rules matrix, integration requirements doc

**What happens:**

1. Map commission plans to platform configuration (plan templates, rates, tiers, quotas per role)
2. Translate crediting rules into platform logic (primary assignment, split percentages, overlay configurations)
3. Define integration specifications (CRM field mapping, Finance system connection, HRIS data feeds)
4. Specify data migration plan (which historical periods, data cleaning requirements, import format)

**Output:** Draft tech spec containing:

- Plan configuration map: each role -> plan template -> rates -> tiers -> accelerators
- Crediting logic specification: each deal scenario -> credit allocation rule
- Integration spec: each system -> connection method -> field mapping -> sync frequency
- Data migration spec: source data -> cleaning steps -> import format -> validation criteria
- Build sequence: (1) Platform setup -> (2) CRM integration -> (3) Finance/HR integrations -> (4) Plan configuration -> (5) Crediting rules -> (6) Payout workflows -> (7) Data migration -> (8) QA

---

### 2b. Engineering Handoff

**Purpose:** Review tech specs with engineer before building.

**Who attends:** Architect + Engineer

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-10 | Strategic context | Why this client needs this specific configuration |
| 10-25 | Walk through tech spec | Plan configs, crediting rules, integration specs, data plan |
| 25-35 | Risk identification | CRM customization complexity, data quality concerns |
| 35-45 | Build sequence | Confirm order and dependencies |

**What Architect brings:**

- Strategic package (plan inventory, crediting matrix, Definition Alignment Doc)
- Draft tech spec (from 2a)
- CRM data model map
- Known data quality issues from current-state audit

**What engineer leaves with:**

- Approved tech spec with build sequence
- Admin credentials for commission tool, CRM, Finance system, HRIS
- Clear dependencies (e.g., "CRM integration must work before plan configuration can be tested")
- Known risks and workarounds

---

### 2c. Build (Configure)

**Purpose:** Configure the commission platform, build integrations, set up plans and crediting rules, migrate historical data.

**Input:** Approved tech spec from 2b

**Build components and sequence:**

#### Component 1: Platform Setup

- Create commission tool account with admin credentials
- Set up organizational hierarchy (teams, managers, reporting structure)
- Create user accounts for reps, managers, finance admins
- Configure role-based permissions (rep sees own data, manager sees team, finance sees all)
- Set up manager-to-rep relationships for roll-up reporting
- Document admin credentials for client handoff

#### Component 2: CRM Integration

- Connect to Salesforce/HubSpot via native integration or OAuth
- Map opportunity fields (Amount, Close Date, Stage, Owner)
- Configure commission-eligible opportunity record types and stages
- Map custom fields for crediting logic (deal type, product line, region)
- Set sync frequency (real-time preferred; scheduled as fallback)
- Test data flow with sample opportunities — verify field mapping accuracy

#### Component 3: Finance and HR System Integration

- Connect QuickBooks/NetSuite for bookings/payment data
- Map invoice fields to commission calculations (amount, date, customer)
- Connect HRIS for employee start dates, termination dates, role changes
- Configure quota proration rules for mid-period role changes
- Set data refresh schedules for each integration
- Validate data consistency across all connected systems

#### Component 4: Commission Plan Configuration

- Create plan templates for each role (AE, SDR, AM, SE overlay, CSM)
- Configure base commission rates and quota targets per role
- Set up attainment tiers (e.g., 0-80%, 80-100%, 100-120%, 120%+)
- Configure accelerators for over-quota performance
- Set up decelerators or caps if applicable
- Build SPIF structures for promotional periods

#### Component 5: Crediting and Attribution Rules

- Set up primary rep crediting (opportunity owner gets credit)
- Configure split credit rules for team selling scenarios
- Set up overlay crediting for SE, CSM, or partner involvement
- Define territory-based vs. account-based credit assignment
- Configure mid-deal reassignment logic (who gets credit when reps change)
- Test each crediting scenario with sample data

#### Component 6: Payout Workflow Configuration

- Set commission calculation frequency (monthly or bi-weekly)
- Configure payout timing relative to deal close or invoice date
- Set up clawback rules for cancelled deals or chargebacks
- Configure adjustment workflows (disputes, corrections, manual entries)
- Set up approval workflows (manager review -> finance sign-off)
- Configure payroll export format

#### Component 7: Historical Data Migration

- Extract 12-24 months of closed-won opportunities from CRM
- Extract historical quota assignments by rep and period
- Gather historical commission payments from Finance records
- Clean and normalize data (dates, rep names, amounts, consistent formats)
- Map historical data to commission tool import format
- Import historical data into platform
- Run commission calculations on historical periods
- Compare calculated commissions to actual historical payouts
- Identify and resolve discrepancies (this typically reveals configuration issues)
- Document known variances with explanations

**Execution approach for this project type:**

| Approach | When to Use | Example |
|----------|------------|---------|
| Manual build | First implementation of a given tool, complex crediting logic | Engineer builds in commission tool |
| Assisted | Repeatable plan configurations, standard integrations | Draft plan specs from template |

---

### 2d. QA / Test + Sign-Off

**Purpose:** Verify all calculations are accurate and all users have correct access before go-live.

**Two types of testing:**

| Type | Who | Purpose |
|------|-----|---------|
| Calculation Testing | Our team | Verify every plan type calculates correctly at every tier |
| User Access Testing | Our team | Verify permissions and reports function correctly |
| Pilot Testing | Select reps | Run live commissions for one pay period |

**Calculation testing checklist:**

- At-quota scenario calculated correctly for each plan type
- Under-quota scenario calculated correctly (decelerators applied)
- Over-quota scenario calculated correctly (accelerators applied at each tier)
- Split credit calculations distribute correctly across involved reps
- Overlay credit calculations add correctly without reducing primary rep credit
- Clawback calculations reverse correctly when triggered
- SPIF calculations apply correctly during promotional windows
- Proration calculates correctly for mid-period role changes
- Historical back-test: calculated commissions match actual payouts within acceptable variance
- Finance lead has signed off on calculation accuracy

**User access testing:**

- Rep view: reps see only their own earnings, quota, and attainment
- Manager view: managers see team roll-ups and individual rep drill-downs
- Finance admin view: full access to all data, exports, and adjustment capabilities
- Standard reports validated: attainment summary, payout summary, team leaderboard
- Dashboard data matches source CRM and Finance data
- Payroll export format matches Finance requirements
- Mobile access works (if applicable)

**Pilot testing:**

- Select 3-5 pilot reps across different plan types
- Run live commissions for pilot users for one pay period
- Gather feedback on accuracy, usability, and visibility
- Address issues identified during pilot
- Get pilot user sign-off that calculations match expectations
- Document lessons learned for full rollout

**Engineering sign-off checkpoint:**

- All plan types configured and calculating correctly
- All integrations flowing data accurately
- Historical back-test reconciled with acceptable variance
- Pilot users have validated calculations
- Finance has signed off on accuracy
- Ready for enablement

**Decision point:**

- **Proceed to Enablement** -> All calculations verified, pilot complete, Finance approved
- **Loop back to Build** -> Calculation discrepancies found, configuration fixes needed

---

## Phase 3: Enablement

**Goal:** Finance admins, sales managers, and sales reps can all use the commission tool independently.

**Output:** Trained team with documentation, system running through first full payout cycle without issues.

### Sub-Phases

```
3a Training Prep -> 3b Training Sessions -> 3c Hypercare -> 3d Enablement Sign-Off
```

---

### 3a. Training Prep

**Purpose:** Create training materials from configuration documentation and test results.

**Input:** Configuration settings, integration documentation, QA results, admin guide

**What happens:**

1. Generate draft training materials segmented by audience (admin, manager, rep)
2. Architect reviews and customizes for client's terminology
3. Records video walkthroughs for each audience

**Output:** Training package containing:

- Admin training deck and video script: plan configuration, adjustments, dispute resolution, reporting, payroll exports
- Manager training deck and video script: team dashboards, individual attainment, coaching using commission data
- Rep training deck and video script: accessing earnings, quota attainment, payout history, submitting disputes
- FAQ draft: based on common questions from similar commission tool implementations (e.g., "When do commissions show up?", "What if I think my calculation is wrong?", "How are split deals credited?")

---

### 3b. Training Sessions

**Purpose:** Transfer knowledge to customer team in three tiers.

**Training delivery by audience:**

| Session | Audience | Duration | Focus |
|---------|----------|----------|-------|
| Admin Training | Finance, RevOps admins | 60-90m | Plan config changes, adjustment/dispute workflows, exports, maintenance |
| Manager Training | Sales managers | 30-45m | Team dashboards, individual attainment, how to answer rep questions |
| Sales Team Launch | All sales reps | 20-30m | Access tool, view earnings/quota/payout history, submit disputes |

**Admin training covers:**

- Plan configuration and modification procedures
- Adjustment and dispute resolution workflows
- Reporting and export capabilities for payroll
- Common maintenance tasks: new hires, role changes, plan updates, SPIF setup
- Where to find vendor support documentation

**Manager training covers:**

- Team performance dashboards and drill-down views
- Tracking individual rep attainment and forecasting
- Reviewing and approving adjustments (if applicable)
- How to answer rep questions using the tool

**Rep training covers:**

- How to access the tool and navigate dashboards
- Viewing earnings, quota attainment, and payout history
- Understanding what's auto-calculated vs. what requires manual input
- How to submit a dispute if a calculation looks wrong
- FAQs and common concerns

**Training delivery:**

1. Schedule sessions with appropriate stakeholders (admins first, then managers, then reps)
2. Deliver training live (admins and managers) or via recorded all-hands (reps)
3. Record video walkthroughs of each session for future reference
4. Answer questions, note gaps for FAQ updates

**Output:**

- Trained stakeholders at all three tiers
- Video recordings for each audience
- Updated FAQ based on real questions from training sessions

---

### 3c. Hypercare

**Purpose:** Intensive post-launch support through the first full payout cycle.

**Duration:** 4-6 weeks (must cover at least one complete commission payout cycle)

**What happens:**

- Quick response to issues, bugs, calculation questions
- Office hours: weekly 30-minute slot for first month (any admin, manager, or rep can join)
- Monitor first live payout cycle: verify calculations match expectations
- Fix any configuration issues found during live usage
- Address rep disputes and help admins learn the dispute workflow
- Verify data sync accuracy between CRM, Finance, and commission tool

**When to extend:** If the first payout cycle reveals significant calculation discrepancies or integration data issues.

**Output:** System running through at least one full payout cycle with no critical issues outstanding.

---

### 3d. Enablement Sign-Off

**Purpose:** Confirm customer can operate the commission tool independently.

**Validation checkpoint:**

- All three training sessions delivered (admin, manager, rep)
- Training recordings and documentation provided
- First full payout cycle completed through the platform
- No critical calculation issues outstanding
- Finance team has processed at least one payroll export from the tool
- Admin team can handle new hires, role changes, and plan updates independently
- Rep dispute volume has stabilized (initial spike resolved)
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** -> Customer is enabled, first payout cycle clean
- **Extend Hypercare** -> Calculation issues or integration instability persist

---

## Phase 4: Handoff

**Goal:** Clean project close with maintenance plan established and retention/expansion path set.

**Output:** Maintenance schedule documented, internal context transferred, customer owns the system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule -> 4b Internal Handoff -> 4c External Handoff -> 4d Project Close
                           (SME -> Architect)      (team -> Customer)     (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|---|---|---|
| **Single Project** | Customer owns | 4c (External Handoff) — customer receives maintenance schedule and runs it themselves |
| **Dedicated (Multi-Project)** | Architect owns | 4b (Internal Handoff) — Architect receives maintenance schedule and runs it for customer |

---

### 4a. Maintenance Schedule

**Purpose:** Document what needs ongoing attention after go-live — cadences, tasks, triggers for re-engagement.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|---|---|---|
| Calculation accuracy audit | Compare tool payouts to Finance records for latest period | Any discrepancy > $100 or > 2% variance per rep |
| New hire / departure processing | Add new reps, deactivate departed reps, reassign deals | Processing backlog > 1 week behind actual start/end dates |
| Integration health check | Verify CRM and Finance data sync is running on schedule | Any sync failure or data lag > 24 hours |
| Dispute resolution review | Check open disputes, ensure timely resolution | > 5 open disputes unresolved for > 2 weeks |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|---|---|---|
| Plan configuration audit | Compare configured plans to any business/comp changes | Update plan configs to reflect changes (new rates, tiers) |
| Crediting rules review | Check if any new deal types or team structures introduced | Add new crediting scenarios, test edge cases |
| User access audit | Review who has access, remove former employees | Update permissions, revoke access for departed staff |
| Report accuracy validation | Spot-check dashboard data against source systems | Investigate and fix data discrepancies |

**After First Business Cycle (60-90 days post-launch):**

- Full calculation reconciliation: compare all payouts since launch against what Finance would have calculated manually
- Rep satisfaction check: survey reps on tool usability and trust in calculations
- Integration stability review: any sync failures or data quality issues in the first quarter?
- Process efficiency measurement: how much time is Finance saving per payout cycle?

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Calculation accuracy | > 5% variance on any rep's payout for 2+ periods | Re-engage to audit plan configuration |
| Commission disputes | > 10% of reps filing disputes per period | Audit crediting rules and data accuracy |
| New plan types needed | New role or comp structure introduced | Scope plan addition as mini-project or new engagement |
| Integration failure | Repeated sync failures (3+ in a month) | Escalate to vendor support, review integration config |

**Every 6-12 Months:**

- Annual comp plan review: most B2B SaaS companies update commission plans annually. Platform configuration must be updated to match.
- Full platform health check: user adoption, calculation accuracy trending, integration stability
- Vendor feature review: commission tools release new features regularly. Evaluate if new capabilities benefit the client.

---

### 4b. Internal Handoff (SME -> Architect)

**Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- How the commission plans are structured and why specific rules were chosen
- Customer context: key contacts (Finance lead, RevOps admin, Sales VP), communication preferences
- Known edge cases and how they were resolved (specific crediting scenarios that required manual workarounds)
- Integration architecture: which systems connect, what field mappings exist, where data quirks live
- When to escalate back to SME

**Escalation guidelines:**

| Issue Type | Who Handles | Analogy |
|---|---|---|
| New hire setup, user access changes | Architect ("tile that broke") | General contractor |
| Simple plan rate updates (same structure) | Architect | General contractor |
| New plan structures, crediting logic changes | SME ("anything with electrical") | Specialist tradesperson |
| Integration failures, data pipeline issues | SME | Specialist tradesperson |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing it. SME walks Architect through each maintenance task.

---

### 4c. External Handoff (Team -> Customer)

**Purpose:** Formal project completion with customer.

**Final project meeting:**

- Review what was delivered: configured platform, integrations, plans, crediting rules, historical data
- Walk through documentation package (see below)
- Walk through maintenance schedule — what they need to do monthly and quarterly
- Confirm vendor support contacts and escalation paths
- Answer final questions
- Make it explicit: "Project complete"
- **For Single Project engagements:** Hand over the maintenance schedule (4a) and walk the customer through it. Record a maintenance video walkthrough.

**Documentation package:**

- All training video recordings (admin, manager, rep)
- Configuration reference document (all plans, rates, tiers, crediting rules as configured)
- Integration documentation (which systems connect, field mappings, sync schedules)
- Troubleshooting guide (see scenarios below)
- Admin quick-reference guide (common tasks: new hires, role changes, plan updates)
- Manager quick-reference guide (dashboard navigation, team views)
- Rep FAQ document
- Definition Alignment Document (final version)
- Maintenance Schedule (with monthly/quarterly tasks)
- Vendor support contacts and escalation paths

**Troubleshooting Guide — Common Scenarios:**

| Scenario | Symptoms | Resolution |
|----------|----------|-----------|
| Rep's commission doesn't match expectations | Rep reports discrepancy vs. their manual calculation | Check deal data in CRM, verify crediting rule applied, review attainment tier |
| Deal not appearing in commission tool | Closed-won deal in CRM but no commission calculated | Verify opportunity stage matches commission-eligible criteria, check sync status |
| Split credit not calculating correctly | One rep gets full credit, partner gets nothing | Review split credit configuration, verify both reps are assigned in CRM |
| Historical data mismatch | Back-test shows different numbers than actual payouts | Check if historical data includes manual adjustments not captured in CRM |
| Integration sync failure | Data stops flowing from CRM to commission tool | Check OAuth token expiration, verify API limits, re-authenticate if needed |
| Clawback not triggering | Cancelled deal but commission not reversed | Verify clawback trigger (stage change, invoice void), check timing rules |
| New hire not appearing | Rep onboarded but can't see their commissions | Add user to platform, assign to correct plan, set quota and start date |
| Payroll export format mismatch | Finance can't import export file into payroll system | Verify export template matches payroll requirements, adjust field mapping |

**Output:** Customer owns the system. Project formally complete.

---

### 4d. Project Close

**Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved to proper location
- Configuration documentation complete
- Integration documentation complete
- Project status updated in tracking system
- Time/billing finalized

#### Internal Debrief (Optional but Recommended)

- What went well?
- What would we do differently?
- Were there crediting scenarios we didn't anticipate?
- Any learnings to feed back into SOPs or playbooks?
- How long did historical data migration take vs. estimate?

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|---|---|
| **Single Project** | Upsell -> Downsell -> Retry |
| **Multi-Project (Dedicated)** | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (retainer for ongoing comp plan management)
   | if no
2. Downsell: Commission Plan Redesign project or Quota/Territory project
   | if yes
3. Retry retainer at end of next project cycle
```

**Script:**

"Now that your commission tool is live and running, there are two ways we can continue working together. Option 1: We can set you up on managed services where we handle ongoing plan updates, quarterly audits, and annual comp plan reconfiguration. Option 2: If there's a specific project — like redesigning your commission plans for next fiscal year or building out territory management — we can scope that out. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

"On [date ~quarter out], we'll review how the commission system is performing — calculation accuracy, rep satisfaction, any plan changes needed — and see if any adjustments are required."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull data: calculation accuracy, dispute rates, usage |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points. |

**At the refinement check-in:**

- Review calculation accuracy and dispute trends since go-live
- Identify any plan changes needed (new roles, rate changes, new crediting scenarios)
- If minor: Architect handles plan configuration updates
- If major: Scope new project (commission plan redesign, new tool migration)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Commission plan inventory (all roles, plans, rates, tiers, rules documented)
- Crediting rules matrix (every deal scenario mapped to a credit allocation rule)
- Definition Alignment Document (signed off by stakeholders)
- Integration requirements document

**Technical Deliverables:**

- Fully configured commission platform with all plans and crediting rules active
- CRM integration (Salesforce/HubSpot connected and syncing)
- Finance system integration (QuickBooks/NetSuite connected)
- HRIS integration (employee data flowing)
- Historical data migrated and validated
- Calculation test results with Finance sign-off

**Documentation Package:**

- Training video recordings (admin, manager, rep)
- Admin quick-reference guide
- Manager quick-reference guide
- Rep FAQ document
- Configuration reference document
- Integration documentation
- Troubleshooting guide
- Definition Alignment Document (final version)
- Maintenance Schedule

---

## Appendix

### Roles

| Role | What They Do |
|------|--------------|
| **Architect** | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| **Engineer** | CRM build, automation, dashboards (Phase 2) |
| **SME** | Project/implementation specialist brought in for project-specific work |

### Phase Outputs and Gate Criteria

| Phase | Output | Gate Criteria |
|-------|--------|---------------|
| **Phase 1: Strategy** | Commission plan inventory + crediting rules matrix + integration req doc (signed off) | Finance and Sales Leadership have approved all plans, rules, and integration scope |
| **Phase 2: Engineering** | Configured platform with validated calculations | All calculations match historical payouts, pilot complete, Finance approved |
| **Phase 3: Enablement** | Trained team (admin, manager, rep) with documentation | All training delivered, first payout cycle completed successfully |
| **Phase 4: Handoff** | Independent customer + archived project | Internal/external handoffs complete, maintenance plan in place, project closed |

### How to Adapt Per Project Type

| Project Profile | Strategy Weight | Engineering Weight | Enablement Weight | Notes |
|---|---|---|---|---|
| **Simple (1-2 plans)** | 20% | 50% | 30% | No splits, single CRM, minimal migration |
| **Standard (3-5 plans)** | 25% | 50% | 25% | Splits and overlays, CRM + Finance |
| **Complex (enterprise)** | 20% | 60% | 20% | Multiple plan types, 3+ integrations, heavy migration |

- Simple projects may compress Phase 1 to 1-2 meetings and skip historical data migration
- Complex projects expand Phase 2 significantly — more crediting scenarios, more integration points, more QA cycles
- Phase 4 always applies — every project needs handoff, but maintenance schedule complexity varies with plan count
- Enablement scope scales with number of roles/reps — 10 reps vs. 200 reps requires different training approaches

### Single vs. Dedicated Engagement

| Engagement Type | What It Means | Key Difference |
|---|---|---|
| **Single Project** | One-off project engagement | Customer owns maintenance post-handoff (4c) |
| **Dedicated (Multi-Project)** | Ongoing retainer / multiple projects | Architect owns maintenance post-handoff (4b) |

---

## References

[1] Commission tool implementation projects require early data access to prevent validation delays.

[2] Misaligned commission definitions create significant payout discrepancies and rep distrust.

[3] Excel-based commission tracking prevents scalable, accurate compensation management.

[4] Sales commission platforms integrate with CRM, finance, and HR systems for automated calculation.

[5] Automation reduces manual commission calculation errors and processing time.

[6] Purpose-built commission software provides transparency and dispute resolution tools.

[7] Sales commission automation software streamlines compensations workflows.
