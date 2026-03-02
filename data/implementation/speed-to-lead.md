# Speed-to-Lead SLA Tracking - Implementation Guide

## Project One-Pager

### Speed to Lead (& SLA Tracking) One-Pager

#### Project Type

- **Category:** Balanced (significant strategy + significant engineering + standard enablement)
- **Primary Deliverable:** Automated speed-to-lead tracking system, SLA performance tracking system with escalation alerts, and reporting dashboard

##### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Med | Discovery, SLA rules alignment, technical design doc |
| 2. Engineering | Yes | Heavy | Custom fields, workflows, alert system, reporting build |
| 3. Enablement | Yes | Med | Sales team training critical before alert go-live |
| 4. Handoff | Yes | Light | Low ongoing maintenance; documentation package |

#### Phase Overview

The project follows a full 4-phase model: Strategy (medium weight) focuses on scoping components and defining SLA rules; Engineering (heavy weight) handles fields, workflows, and alerts; Enablement (medium weight) emphasizes sales training before alerts go live; Handoff (light weight) provides low maintenance documentation.

**Project Flow:**
- Medium strategy (scoping components, defining SLA rules)
- Heavy engineering (fields, workflows, alerts)
- Medium enablement (sales training required before alert go-live)
- Light handoff

Three optional components determine scope:
1. Systems Delay Mitigation
2. SLA Tracking & Alerts (always included)
3. Automated Meeting Scheduling (usually separate project)

**Critical Sequencing:** Phase 3b training MUST complete before SLA alerts route to sales team—non-negotiable.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

Customers should:

- Watch introductory video explaining Speed to Lead vs SLA Tracking distinction, why it matters, and project deliverables (5-10 min)
- Complete intake form capturing: current lead types/categories, suspected follow-up time, current tech stack (MAP, CRM, routing tool), escalation alert recipients
- Draft initial SLA rules by lead type (hand-raiser vs non-hand-raiser, plus any additional tiers like hot/warm/cold)
- Confirm Definition Alignment Document with sign-off on: speed to lead, SLA, systems delay, human delay, hand-raiser, SLA hit, SLA miss

##### Track B: Architect Prep

The architect should:

- Request system access: CRM (Salesforce), MAP (HubSpot or equivalent), routing tool (LeanData if applicable)
- Sample 12+ recent leads manually: record time from form submission to owner assignment (systems delay), and from assignment to first sales touch (human delay). Calculate averages.
- Review Inbound Lead Journey System Map findings (if prerequisite project was completed) OR run manual sampling
- Assess systems delay severity against benchmarks: <5 min = good, 10+ min = yellow flag, 15-20+ min = red alert, 30+ min = critical
- Determine which components to recommend based on findings
- Draft tech design document outline based on reference implementation

#### Refinement Loop (1b → 1c → 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present findings (systems delay baseline, component recommendation), gather SLA rules, align on lead categories | CMO, Head of Demand Gen, SDR Leadership, Sales Leadership | SLA rules draft, component scope confirmed |
| Technical Review | 1c | Present finalized technical scope: all custom fields, workflows, alert escalation design, reporting structure | CMO, Head of Demand Gen, technical stakeholders (if any) | Approved tech design document |
| Sign-Off | 1d | Final alignment on SLA rules, escalation tiers, alert content, alert delivery method, exclusions | All stakeholders | Signed-off tech design, build authorization |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff/discovery call held, SLA rules drafted
- 1c. Technical scope presented and reviewed
- 1d. Strategic sign-off obtained on all SLA rules, escalation tiers, and technical design

##### Phase 2: Engineering

- 2a. Tech spec created (all custom fields, workflows, alerts documented)
- 2b. Engineering handoff meeting held (senior engineer if Component 1 included)
- 2c. Build complete (fields, workflows, alerts, dashboard)
- 2d. QA/Test complete (test case spreadsheet + silent production monitoring)

##### Phase 3: Enablement

- 3a. Training materials prepped (alert examples, SLA rules summary, FAQ)
- 3b. Sales team training delivered BEFORE alerts go live
- 3b. Leadership/reporting training delivered
- 3c. Silent monitoring period complete (2-5 days minimum)
- 3d. Alerts switched from test user to actual sales team

##### Phase 4: Handoff

- 4a. Maintenance schedule documented and handed off
- 4b. Internal handoff complete
- 4c. External handoff complete with documentation package
- 4d. Project closed and archived

#### Document Types

**Working Documents:** SLA Rules Alignment Spreadsheet, Systems Delay Investigation Doc, Custom Field Specification Sheet, Test Case Spreadsheet.

**Deliverables:** Technical Systems Design Document, Speed-to-Lead Reporting Dashboard, SLA Alert Configuration Doc.

#### Enablement Details

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Sales Team | SDRs, AEs, Sales Managers | What SLA alerts look like, SLA rules by lead type, business hours handling, how data is used | 45-60m |
| Leadership | CMO, Head of Demand Gen, Sales Leadership | How to use reporting dashboard, how to extract insights, what the data means | 30-45m |

**Hypercare:** 2-5 business days of silent monitoring, then 1-2 weeks post-go-live. Office hours optional (recommended if client has concerns about SLA fairness).

**Training Assets:** Sales team training recording, leadership reporting walkthrough, SLA Rules Reference doc, Technical Systems Design Document.

#### Handoff & Retention

- **Internal Handoff:** Architect receives SLA rules by lead type, escalation tier recipients, which systems fields live in, and what can break the system (new lead categories, routing changes)
- **External Handoff:** Review deliverables, walk through dashboard, demonstrate SLA rule updates, hand over documentation package
- **Maintenance:** Low ongoing maintenance. Things that BREAK: new lead types/categories. Things that REDUCE accuracy: routing failures, rep departures/PTO without routing updates. Single project = customer owns | Dedicated = Architect owns
- **Retention:** Single project: Upsell Managed Services or downsell related project (Lead Routing, Attribution, Automated Meeting Scheduling). Dedicated: Refinement check-in ~1 quarter after go-live

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| Speed to Lead | Total elapsed time from a lead's engagement (form submission, CTA click, list upload) to the first sales follow-up touch |
| SLA (Service Level Agreement) | A set of business-defined rules for acceptable follow-up times, segmented by lead type |
| Systems Delay | Time from lead engagement (e.g., form submission) to lead being fully assigned to a sales rep. Covers all automation: MAP logging, workflow execution, routing logic, and final assignment |
| Human Delay | Time from when a lead is properly assigned and the rep is notified, to when the rep actually follows up |
| SLA Hit | The assigned rep followed up at or before the SLA threshold for that lead type |
| SLA Miss | The assigned rep did NOT follow up before the SLA threshold expired |
| Hand-Raiser | A lead that has explicitly indicated buying intent (demo request, pricing page form, "talk to sales" CTA) |
| Non-Hand-Raiser | A lead that engaged with content but has not indicated direct buying intent (event attendee, content download, webinar registrant) |
| Escalation Tier | A level in the SLA miss notification chain: Tier 1 = rep, Tier 2 = manager, Tier 3 = executive (CRO/CMO) |

#### Common Gotchas

- **Training skipped before alert go-live:** Reps receive SLA miss alerts with zero context and panic. Always complete sales training (Phase 3b) before routing alerts to the sales team.

- **Business hours not accounted for:** Leads arriving Friday evening or weekends trigger SLA misses for reps who are not working. Address business hours calculation in SLA design (Phase 1c) and call out in training.

- **Systems delay blamed on reps:** If speed to lead and SLA tracking are conflated, reps get penalized for 30-minute systems delays they cannot control. Always separate systems delay measurement from SLA (human delay) measurement.

- **Hard-coded workflow delays left in place:** Existing 5-10 minute wait steps in HubSpot workflows or LeanData routing accumulate into 30+ minutes of systems delay. Map and remove during Component 1 work.

- **New lead categories introduced without SLA updates:** Marketing launches a new lead source or categorization scheme after the system is built; existing SLA rules and field logic do not account for the new type. System produces inaccurate data or stops tracking entirely.

- **Rep leaves or goes on PTO without routing update:** Leads assigned to unavailable reps have zero response, inflating SLA miss numbers. This is a routing/process failure, not an SLA system failure, but it pollutes the data.

- **Routing breaks upstream:** LeanData or CRM-native routing malfunctions cause leads to be delayed or misrouted. SLA data shows a spike in misses that is not caused by rep behavior. Investigate spikes before concluding it is a human performance issue.

- **Alert fatigue from noisy notifications:** Too many low-priority alerts desensitize reps. Segment SLA rules tightly by lead type so alerts reflect genuine urgency (hand-raiser miss at 30 min is urgent; content download miss at 24 hours is not).

- **Stale enrichment data causing misrouting:** Bad data in routing criteria fields sends leads to the wrong rep, adding delay before the correct rep is notified. Ensure enrichment data quality as an upstream dependency.

#### Methodology Options

| Option | When to Use | Complexity |
|--------|------------|-----------|
| Core (Component 2 only) | No significant systems delay; just need SLA tracking and alerting | Low-Medium |
| Standard (Components 1 + 2) | Significant systems delay (>10 min avg) discovered AND SLA tracking | Medium-High |
| Full (Components 1 + 2 + 3) | Systems delay + SLA tracking + automated meeting scheduling (rare; usually separate project for Component 3) | High |
| Systems Delay Only (Component 1) | Major systems delay issue; SLA tracking can wait. Rename to "Systems Delay Mitigation" | Medium-High |

---

## Phase 1: Strategy

**Goal:** Get stakeholder sign-off on SLA rules, escalation design, and technical scope before building anything.

**Output:** Approved SLA Rules Document + Technical Design Document (signed off by stakeholders).

### 1a. Pre-Kickoff

Two parallel tracks run after the deal closes and before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video | Explain Speed to Lead vs SLA Tracking distinction, why it matters, what the project delivers | Video (5-10 min) |
| Definition Alignment Document | Get stakeholder sign-off on: speed to lead, SLA, systems delay, human delay, hand-raiser, SLA hit/miss | Google Doc |
| SLA Rules Intake Form | Capture lead types/categories, suspected follow-up times, desired SLA thresholds per lead type, escalation tier recipients, alert delivery preference (Slack/email) | Google Form or Doc |

**Why this matters:** As stated in the content, "leads contacted within 5 minutes are 21x more likely to qualify than leads contacted after 30 minutes." Yet the average B2B company takes 42 hours to respond to an inbound lead. Most clients do not know their actual response time—they guess anecdotally. This project replaces guesswork with measurement and accountability.

**Completion tracking:** Follow up on homework completion. Do not cancel kickoff if incomplete, but the SLA rules intake is critical for a productive first meeting.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Get system access: CRM (Salesforce), MAP (HubSpot or equiv), routing tool (LeanData if applicable) | Access confirmed |
| 2 | Sample 12+ recent leads: record form submission timestamp, owner assignment timestamp, first sales touch timestamp | Raw timing data |
| 3 | Calculate average systems delay and average human delay from sample | Systems delay baseline (compare to benchmarks) |
| 4 | Review Inbound Lead Journey System Map (if completed as prerequisite) | Known delay sources identified |
| 5 | Assess systems delay severity: <5 min = good, 10+ min = flag, 15-20+ min = red alert | Component 1 recommendation |
| 6 | Draft component recommendation and kickoff presentation | Kickoff-ready materials |

**Systems Delay Benchmarks:**

| Systems Delay Average | Rating | Action |
|-----------------------|--------|--------|
| 2-3 minutes | Best possible (rare) | No Component 1 needed |
| ~5 minutes | Realistic best-in-class | No Component 1 needed; feel good about this |
| 10+ minutes | Yellow flag | Recommend Component 1; take a deeper dive |
| 15-20+ minutes | Red alert | Component 1 is urgent. No reason this should be happening. |
| 30+ minutes | Critical | Component 1 is top priority |

**Critical:** These are averages, not outliers. Platform outages (HubSpot downtime, etc.) create outliers that should not be counted against the average.

#### Stakeholder Alignment Document

Get stakeholder sign-off on key terms BEFORE building anything. Terms to align on: Speed to Lead, SLA, Systems Delay, Human Delay, SLA Hit, SLA Miss, Hand-Raiser, Non-Hand-Raiser. See the Definition Alignment Terms table in the One-Pager above for full definitions.

The document states: "Review each definition with your leadership team. We cannot proceed until all terms are aligned. This is critical because SLA rules are built on top of these definitions—if 'hand-raiser' means different things to different people, the SLA system will produce contested results."

---

### 1b. Kickoff Call

**Purpose:** Present systems delay findings, confirm project scope, and gather SLA business requirements.

#### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Systems delay baseline | Present findings from lead sampling: "Your average systems delay is X minutes" |
| 15-25 | Component scope | Recommend which components to include based on findings |
| 25-40 | SLA rules alignment | For each lead type: what SLA threshold? (Typical: hand-raiser = 30 min, non-hand-raiser = 24-48 hrs). Some clients use 3-4 tiers (hot/warm/cold) |
| 40-55 | Escalation design | Who receives alerts at each tier? Tier 1: rep (immediately on miss). Tier 2: manager (2-3 hrs after miss). Tier 3: CRO/CMO (full day, no follow-up) |
| 55-70 | Alert configuration | Delivery method (Slack, email, both). Alert content requirements. Exclusion rules. Business hours handling. |
| 70-80 | Definition alignment review | Walk through Definition Alignment Doc. Confirm or correct. |
| 80-90 | Next steps | Schedule technical scope review, assign remaining homework |

#### What We Bring

- Systems delay baseline data (from 12+ lead sample or Inbound Lead Journey System Map), component recommendation with rationale, SLA rules template (pre-filled with industry-standard defaults), Definition Alignment Document, reference implementation (sanitized)

#### What We Leave With

- Confirmed component scope, draft SLA rules by lead type, escalation tier recipients identified, alert delivery preferences, business hours decision, Definition Alignment Document status

---

### 1c. Alignment Loop & Strategic Meeting Cadence

**Purpose:** Finalize technical scope and get full alignment before building.

#### The Pattern

This project typically requires only 1-2 alignment meetings after kickoff (lighter than strategic-heavy projects like Growth Model):

```
Kickoff Call (gather SLA rules, confirm scope)
    |
Architect drafts full technical design document
    |
Technical Scope Review (present tech design, get alignment)
    |
Optional: Technical Build Review (if client has technical stakeholders)
    |
Sign-Off -> Proceed to Build
```

#### Technical Scope Review Meeting (60 min)

Present the finalized technical scope back to the client. Walk through every custom field (purpose, data type, which system), every workflow (trigger, logic, action), alert escalation design, reporting dashboard structure, and business hours handling approach. This meeting confirms "this is exactly what we are going to build" before a single field is created.

#### Potential Meeting Types

| Meeting Type | Focus | Stakeholder |
|--------------|-------|-------------|
| Kickoff / Discovery | Systems delay baseline, SLA rules, component scope | CMO, Demand Gen, SDR/Sales Leaders |
| Technical Scope | Full tech design walkthrough, alert configuration | All stakeholders + ops team |
| Technical Build (opt) | Detailed review with client's technical team | CRM admin, RevOps, technical owners |

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 2-3 days (lead sampling takes time) |
| Kickoff call | Day 1 of engagement |
| Technical scope review | 3-5 business days after kickoff |
| Sign-off | Same meeting as tech review, or 1-2 days after |

---

### 1d. Strategic Sign-Off

**Purpose:** Confirm we have everything before proceeding to build.

#### Validation Checkpoint

- Definition Alignment Document signed off by stakeholders
- SLA rules confirmed for every lead type (hand-raiser, non-hand-raiser, and any additional tiers)
- Escalation tiers confirmed: who receives alerts at each level
- Alert delivery method confirmed (Slack, email, or both)
- Alert content requirements confirmed
- Alert exclusion rules confirmed
- Business hours handling approach confirmed
- Component scope finalized (which of the three components are in scope)
- Technical design document reviewed and approved
- If Component 1 (systems delay): all hard-coded delays mapped and removal approach agreed
- No blockers for engineering

#### Decision Point

- **Proceed to Engineering:** All SLA rules and technical design approved. Build authorization given.
- **Loop back to Strategy:** Stakeholder disagreement on SLA rules (most common blocker: marketing and sales cannot agree on what constitutes a "hand-raiser" or what a fair SLA threshold is).

**Note:** This project does NOT have a natural exit point after Phase 1. The strategic output (SLA rules, technical design) has no value without the engineering build. Phase 2 always follows.

---

## Phase 2: Engineering

**Goal:** Build the speed-to-lead tracking system, SLA tracking system, alert workflows, and reporting dashboard.

**Output:** Fully functional system with all fields populating, alerts firing, and dashboard reporting—tested and customer-approved.

| Project Scope | Engineering Weight | Notes |
|---------------|-------------------|-------|
| Core (Component 2 only) | Heavy (60-70%) | Custom fields, workflows, alerts, dashboard |
| Standard (Components 1 + 2) | Heavy (70-80%) | Add systems delay investigation and remediation |
| Full (Components 1 + 2 + 3) | Very Heavy (80%+) | Add automated meeting scheduling (usually separate project) |

### Sub-Phases

```
2a Tech Spec -> 2b Engineering Handoff -> 2c Build -> 2d Test
```

---

### 2a. Tech Spec

**Purpose:** Translate approved SLA rules and technical design into field-level, workflow-level specifications.

**Input:** Signed-off SLA rules + technical design document from Phase 1

**What happens:**

1. Document every custom field needed, organized by system (CRM vs MAP vs routing tool)
2. Document every workflow needed to populate those fields
3. Document alert workflow logic (triggers, conditions, escalation timing, recipients, content)
4. Document reporting dashboard specifications

**Output: Technical Specification containing:**

#### 1. Custom Field Specification

Two separate sets of fields (never conflate these):

**Speed-to-Lead Fields:**

- Form Submission Datetime (or lead engagement trigger datetime)
- Owner Assignment Datetime
- First Sales Touch Datetime
- Systems Delay (calculated: assignment datetime minus engagement datetime)
- Human Delay (calculated: first touch datetime minus assignment datetime)
- Total Speed to Lead (calculated: first touch datetime minus engagement datetime)
- Latest Attribution Completed Datetime (if removing hard-coded delays—used as race condition trigger)

**SLA Fields:**

- Lead Type/Category (hand-raiser, non-hand-raiser, or client-defined tiers)
- SLA Threshold (the allowed time for that lead type—may be a formula based on lead type)
- Actual Response Time (time from assignment to first touch—same as Human Delay)
- SLA Status (Hit or Miss—formula or workflow-populated)
- SLA Miss Duration (how far past the threshold the response was—useful for severity reporting)

Note: Some of these can be formula fields; others require workflow automation. The architect/engineer determines the optimal approach per field based on system capabilities.

#### 2. Workflow Specification

Field population workflows (triggers and logic for each datetime stamp and calculated field), SLA evaluation workflow (typically triggered when first sales touch is logged), alert workflows (trigger conditions, recipients at each tier, timing, content template, delivery channel).

#### 3. Alert Configuration Specification

Alert content (lead name, lead type, company name, assigned rep, SLA rule missed, time elapsed, CRM record link). Escalation tier timing: Tier 1 (immediately on miss), Tier 2 (2-3 hours after miss), Tier 3 (1 full business day after miss). Alert exclusion rules: conditions under which alerts should NOT fire (lead disqualified, non-business hours, etc.).

#### 4. Dashboard Specification

Average speed to lead over time (trend line), systems delay vs human delay breakdown, SLA hit/miss percentage by lead type, by rep, and over time.

---

### 2b. Engineering Handoff

**Purpose:** Review tech specs with engineer before building. If Component 1 (systems delay mitigation) is in scope, this handoff should involve a senior engineer or architect.

**Who attends:** Architect + Engineer (senior level if Component 1)

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through SLA rules and context | Architect explains the business requirements: lead types, SLA thresholds, escalation design |
| 15-25 | Review field and workflow specs | Engineer reviews every field, confirms data types, formula logic, and which system each lives in |
| 25-35 | Review alert and dashboard specs | Engineer confirms alert workflow logic, escalation timing, delivery method, dashboard structure |
| 35-45 | Build sequence and risk review | Confirm what to build first. Flag risks: fields that span multiple systems, hard-coded delays that may break if removed, routing tool dependencies |

**What Architect brings:** Approved SLA rules document, technical specification (from 2a), reference materials.

**What engineer leaves with:** Approved tech spec with build sequence, clear understanding of SLA rules (the "why" behind each field), known risks and dependencies. If Component 1: map of every hard-coded delay with notes on what race condition each was solving.

**Key consideration for Component 1:** Systems delay mitigation is highly technical and unique to each client. The engineer must understand why hard-coded delays were added before removing them. Recommended approach: replace time-based delays with custom field triggers. Example: instead of "wait 5 minutes for attribution to complete," create a "Latest Attribution Completed Datetime" field that workflows fire off of—only proceeding when the field is populated, not after an arbitrary wait.

---

### 2c. Build (Configure)

**Purpose:** Build all custom fields, workflows, alert logic, and reporting dashboard.

**Input:** Approved tech spec from 2b

**Build sequence:**

**Part 1: Custom Fields**

1. Create all speed-to-lead custom fields in CRM/MAP
2. Create all SLA custom fields in CRM/MAP
3. Verify field data types, formula logic, and visibility settings

**Part 2: Field Population Workflows**

4. Build workflows to automatically populate speed-to-lead datetime fields (form submission timestamp, owner assignment timestamp)
5. Build workflows to detect first sales touch and populate first touch datetime
6. Build formula or workflow logic to calculate systems delay, human delay, and total speed to lead
7. Build formula or workflow logic to evaluate SLA hit vs miss based on lead type threshold

**Part 3: SLA Alert Workflows**

8. Build Tier 1 alert: fires immediately when SLA is missed, notifies assigned rep
9. Build Tier 2 alert: fires N hours after SLA miss if still no follow-up, notifies rep's manager
10. Build Tier 3 alert: fires N hours/days after SLA miss if still no follow-up, notifies CRO/CMO
11. Configure alert content for each tier (include: lead name, lead type, company, assigned rep, SLA rule, time elapsed, CRM record link)
12. Configure alert delivery channel (Slack and/or email)—Slack is recommended for speed; email as backup
13. Configure alert exclusion rules

**Part 4: Systems Delay Mitigation (if Component 1 in scope)**

14. Map every hard-coded delay in MAP workflows and routing tool (LeanData routing graph, HubSpot workflows, etc.)
15. For each delay: document what race condition it was solving
16. Design custom field triggers to replace time-based delays (e.g., "Latest Attribution Completed Datetime" field)
17. Remove hard-coded delays one at a time, testing after each removal
18. Verify that the race conditions are still properly handled by the new trigger approach

**Part 5: Automated Meeting Scheduling (if Component 3 in scope)**

19. Select vendor tool (ChiliPiper Concierge, LeanData BookIt, Qualified, Default)
20. Follow vendor-specific implementation playbook
21. Partner with vendor CSM for setup support
22. Note: this component alone is typically 50+ hours. Recommend scoping as a separate project.

**Part 6: Reporting Dashboard**

23. Build reporting dashboard in CRM with views: speed-to-lead trend, systems delay vs human delay breakdown, SLA hit/miss by lead type, SLA hit/miss by rep, SLA performance over time

**Build tracking:**

- Part 1: Custom fields created
- Part 2: Field population workflows built and firing
- Part 3: SLA alert workflows built (routing to test user for testing)
- Part 4: Systems delay mitigation (if applicable)
- Part 5: Automated meeting scheduling (if applicable)
- Part 6: Reporting dashboard built

**Where to build:** The build spans CRM, MAP, and routing tool. Where to place specific fields and workflows depends on the architect/engineer's confidence in each system and the client's tech stack. Reference approach: HubSpot (MAP) for workflow execution, LeanData for routing-related logic, Salesforce (CRM) for custom fields, formulas, and reporting.

---

### 2d. QA / Test + Sign-Off

**Purpose:** Verify the build works through two phases of testing before going live with the sales team.

**Phase 1 of QA: Test Case Spreadsheet**

Create a test case spreadsheet covering every condition combination. Each unique combination = one row with expected outcome.

Test conditions to combine:

| Condition | Variations |
|-----------|-----------|
| Lead type | Hand-raiser, non-hand-raiser, plus any additional tiers |
| SLA outcome | Hit (responded within threshold), Miss (did not respond) |
| Escalation tier reached | Tier 1 only, Tier 2 reached, Tier 3 reached |
| First touch type | Phone call, email, LinkedIn message (however client defines "first touch") |
| Edge cases | Lead disqualified before follow-up, lead ghosted entirely, lead reassigned mid-SLA window |
| Business hours | Lead arrived during business hours, lead arrived outside business hours / weekend |

For each row: document the expected field values, expected alert behavior, and expected dashboard impact. Execute each test scenario and record pass/fail.

**Phase 2 of QA: Silent Production Monitoring**

After all test scenarios pass: turn everything on in production, route ALL alerts to a test user only (NOT to the sales team), and let it run live for at least 2-5 business days. Monitor that fields populate correctly on real production leads, alerts fire at the right times for the right conditions, the dashboard reflects accurate data, and there is no impact on existing processes.

**Exception:** Be careful if Component 1 (systems delay mitigation) required adding logic to the lead routing tool (e.g., LeanData routing graph). Changes to routing can affect existing lead assignment. Test routing changes separately before enabling SLA monitoring.

**Technical testing checklist:**

- All speed-to-lead fields populating correctly (systems delay, human delay, total)
- All SLA fields populating correctly (lead type, SLA threshold, actual response time, hit/miss)
- SLA calculation correctly accounts for business hours (if configured)
- Tier 1 alert fires immediately on SLA miss
- Tier 2 alert fires at configured delay after miss (if still no follow-up)
- Tier 3 alert fires at configured delay after miss (if still no follow-up)
- Alert content is correct and includes all required fields
- Alert exclusion rules work (disqualified leads, weekend leads, etc.)
- Dashboard displays correct data
- No interference with existing workflows or routing

**Speed-specific QA (not in standard routing QA):**

- Measure time from field creation to field population—verify the measurement system itself is not adding delay
- If Component 1: verify systems delay average decreased post-optimization (compare to pre-project baseline)

**Engineering sign-off checkpoint:**

- Built system matches tech spec
- All test scenarios passing
- Silent monitoring period complete with no issues
- Ready for sales team training (Phase 3b) and subsequent go-live

**Decision point:**

- **Proceed to Enablement:** All tests passing, silent monitoring clean. Schedule sales team training.
- **Loop back to Build:** Issues found during silent monitoring. Fix and re-test.

---

## Phase 3: Enablement

**Goal:** Train the sales team on SLA alerts and train leadership on the reporting dashboard BEFORE going live. This sequence is critical.

**Output:** Trained team with documentation. Alerts switched from test user to actual sales team.

### Sub-Phases

```
3a Training Prep -> 3b Training Sessions -> 3c Hypercare (Silent Monitoring) -> 3d Enablement Sign-Off
```

**Critical sequencing:** Training (3b) MUST happen before alerts route to the sales team. If alerts go live without training, reps will see SLA miss notifications with no context and react negatively. As soon as you start sending alerts, reps may panic because SLA misses directly reflect on them—they will have issues if you just turn this on without telling anyone.

---

### 3a. Training Prep

**Purpose:** Create training materials from the technical design and SLA rules.

**Input:** SLA rules document + technical design + built system

**Training package to create:**

1. **Sales Team Training Deck / Guide:** What SLA alerts look like (actual alert format/content), SLA rules for each lead type, business hours handling, what "SLA hit" and "SLA miss" mean for metrics, how data is used and reported, FAQ addressing common concerns (fairness, edge cases, routing breaks)

2. **Leadership Training Deck / Guide:** Dashboard walkthrough (each view), how to interpret speed-to-lead and SLA hit/miss trends, context on how data is populated, when to investigate anomalies vs system issues

3. **SLA Rules Quick Reference:** One-page summary of lead type → SLA threshold → escalation tiers → alert recipients. Post in shared Slack channel or team wiki.

---

### 3b. Training Sessions

**Purpose:** Transfer knowledge to the sales team and leadership before going live.

**Two required training sessions:**

| Type | Audience | Focus | Duration | When |
|------|----------|-------|----------|------|
| Sales Team Training | SDRs, AEs, Sales Managers, some Marketing attendees | SLA rules, alert format, business hours handling, fairness, how data is used | 45-60m | BEFORE alerts go live to sales team |
| Leadership / Reporting | CMO, Head of Demand Gen, Sales Leadership | Dashboard walkthrough, data interpretation, when to investigate vs ignore anomalies | 30-45m | After sales training, before or at go-live |

**Sales Team Training—Key content:**

1. **What is happening:** Explain that automated SLA tracking is being turned on with notifications for missed SLA windows
2. **What alerts look like:** Show actual alert format with lead name, lead type, company, SLA rule, time elapsed
3. **SLA rules by lead type:** Walk through every rule with specific thresholds (e.g., demo requests = 30 min, event attendees = 24 hrs)
4. **Business hours:** Clarify whether the SLA clock runs outside business hours and weekends
5. **Fairness assurance:** Emphasize that systems delay is separated from human delay—reps are NOT penalized for routing time
6. **How data is used:** SLA hit/miss reported over time; goal is team improvement, not individual punishment
7. **Addressing concerns:** Open Q&A. Common questions: "What if I'm in a meeting?", "What if the lead type is wrong?", "What if routing assigns it to the wrong person?"

**Leadership / Reporting Training—Key content:**

1. Walk through each dashboard view (speed-to-lead trend, SLA hit/miss by rep, by lead type, over time)
2. Explain the difference between speed-to-lead data (includes systems delay) and SLA data (human delay only)
3. Show how to identify anomalies: sudden spike in SLA misses may indicate routing break, not rep laziness
4. Explain what can cause data accuracy issues: routing breaks, PTO, new lead categories

**Training delivery:** Deliver live (video call), record the session as a video walkthrough for future reference and new hire onboarding. Post SLA Rules Quick Reference in accessible location (Slack channel, team wiki).

---

### 3c. Hypercare

**Purpose:** The silent monitoring period serves as the hypercare-equivalent for this project. It bridges QA and go-live.

**Duration:** 2-5 business days of silent monitoring (Phase 2d), then 1-2 weeks of post-go-live monitoring after alerts switch to the sales team.

**Pre-go-live:** All alerts route to a test user. Team verifies alerts fire correctly, fields populate correctly. Any issues are fixed before the sales team ever sees an alert.

**Post-go-live:** Alerts route to the actual sales team. Team monitors for 1-2 weeks, addresses rep questions, watches for SLA data anomalies indicating system issues (not rep issues), and makes minor adjustments to alert content or timing based on initial feedback.

**When to skip:** Do not skip. The silent monitoring period is non-negotiable. Going live without it risks sending incorrect alerts to the sales team, which destroys trust in the system.

**Output:** Stabilized system, alerts routing correctly, no critical issues.

---

### 3d. Enablement Sign-Off

**Purpose:** Confirm the system is live, the team is trained, and the sales team is receiving alerts.

**Validation checkpoint:**

- Sales team training delivered and recorded
- Leadership/reporting training delivered and recorded
- Silent monitoring period complete (no critical issues)
- Alerts switched from test user to actual sales team
- Sales team has been receiving live alerts for 2-3+ business days with no critical issues
- Leadership has access to dashboard and understands how to use it
- No critical issues outstanding
- Ready for handoff

**Decision point:**

- **Proceed to Handoff:** System is live, team is trained, alerts are routing correctly.
- **Extend Hypercare:** Issues with alert accuracy, rep complaints about fairness, dashboard data not matching expectations.

---

## Phase 4: Handoff

**Goal:** Clean project close with maintenance documented and retention/expansion path set.

**Output:** Maintenance schedule documented, internal context transferred, customer owns the system, project archived.

**Structure:** 4a Maintenance Schedule → 4b Internal Handoff → 4c External Handoff (LeanScale → Customer) → 4d Project Close

**Maintenance ownership:** Single Project = customer owns (handed off at 4c). Dedicated (Multi-Project) = Architect owns (handed off at 4b).

---

### 4a. Maintenance Schedule

**Purpose:** Document what needs ongoing attention. The good news: this project requires relatively low ongoing maintenance compared to projects like attribution. Once built, the data runs and populates automatically.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|-------------------|
| SLA data accuracy spot-check | Sample 5-10 recent leads. Verify SLA hit/miss matches reality. | Any mismatches indicate workflow issue. |
| Dashboard usage check | Confirm leadership is using the dashboard. | Dashboard not accessed in 30+ days. |
| Alert delivery verification | Confirm alerts are still routing correctly (Slack/email). | Any reports of missing alerts from reps. |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|----------------|-------------------|
| SLA rules relevance check | Are the SLA thresholds still appropriate? Has lead volume or team structure changed? | Adjust SLA thresholds. Should be a simple change (one place to update). |
| Speed-to-lead trend review | Is systems delay stable or creeping up? Is human delay improving or degrading? | If systems delay increasing: investigate new hard-coded delays or workflow changes. If human delay increasing: sales leadership action. |
| New lead type audit | Has marketing introduced any new lead sources, categories, or types? | Update SLA rules and field logic to cover new types. This is the most common maintenance trigger. |

**After First Business Cycle (30-90 days post-launch):**

- Review overall SLA hit/miss percentage. Is it improving week over week?
- Compare current speed-to-lead average to pre-project baseline. Quantify improvement.
- Identify any reps consistently missing SLAs—is it a training issue, a workload issue, or a routing issue?
- Key question: Is lead-to-opportunity conversion rate improving? (This is the ultimate business outcome.)

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Marketing introduces new lead types | Any new lead source or category | Update SLA rules and field logic. Without update, system breaks or produces inaccurate data. |
| SLA miss rate spikes | >20% increase in miss rate week-over-week | Investigate: routing break? Rep PTO? New lead volume? System issue? |
| Systems delay creeps up | Average increases by >3 minutes from baseline | Investigate: new hard-coded delays? New workflow steps? Platform performance? |
| Client wants to change SLA rules | Any SLA threshold change | Should be a simple update—likely one field or one workflow condition. |

**Every 6-12 Months:**

- Full review of SLA rules against current business reality
- Assess whether escalation tiers and recipients need updating (org changes, new managers)
- Review if any new lead routing changes have affected speed-to-lead data
- Validate that the systems delay baseline has held (no regression)

---

### 4b. Internal Handoff

**Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:** What was built (speed-to-lead tracking + SLA tracking + alert system + dashboard), SLA rules by lead type, escalation tier recipients, which systems the fields live in (CRM vs MAP vs routing tool), what can break the system (new lead categories is the #1 trigger), what can reduce data accuracy (routing failures, rep PTO/departures), and how to make simple SLA rule changes.

**Escalation guidelines:**

| Issue Type | Who Handles | Example |
|-----------|-----------|---------|
| SLA rule threshold change | Architect (simple config change) | "We want to change hand-raiser SLA from 30 min to 15 min" |
| New lead type needs SLA rules | Architect (if straightforward) or senior engineer | "We launched a new webinar category" |
| Alert routing changes (new manager, etc.) | Architect (simple config change) | "Sarah is now the SDR manager, update Tier 2" |
| Systems delay increasing / workflow issues | Senior engineer | "Our systems delay went from 5 min to 15 min" |
| SLA data seems wrong / investigation needed | Senior engineer | "Miss rate spiked 40% last week, we don't know why" |
| Adding new component (meeting scheduling) | Senior engineer (scope as new project) | "We want to add ChiliPiper now" |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing it.

---

### 4c. External Handoff (LeanScale → Customer)

**Purpose:** Formal project completion with customer.

**Final project meeting:** Review all deliverables, walk through dashboard one final time, demonstrate how to make common updates (SLA rule changes, alert recipient changes), explain what can break the system, set expectations for low ongoing maintenance, and make it explicit: "Project complete." For Single Project engagements: hand over the maintenance schedule (4a) and walk the customer through it.

**Documentation package:**

| Deliverable | Description |
|-------------|-------------|
| Technical Systems Design Document | All custom fields, workflows, alert logic, and their purpose |
| Speed-to-Lead Reporting Dashboard | Live dashboard in CRM showing speed-to-lead and SLA performance over time |
| Sales Team Training Recording | Video recording of the sales training session |
| Leadership Reporting Training Recording | Video recording of the dashboard walkthrough with leadership |
| SLA Rules Quick Reference | One-page summary of lead type → SLA threshold → escalation tiers |
| SLA Alert Configuration Doc | Alert content, delivery channels, exclusion rules, escalation timing |
| Test Case Spreadsheet | All test scenarios with expected outcomes (useful for future QA if changes are made) |
| Maintenance Schedule | Monthly, quarterly, and trigger-based maintenance tasks |

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail and record a video walkthrough.

**Output:** Customer owns the system. Project formally complete.

---

### 4d. Project Close

**Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved to proper location
- Technical design document finalized
- Training recordings uploaded and shared
- Project status updated in tracking system

#### Internal Debrief (Optional)

Recommended topics: What went well? Was the systems delay baseline accurate? Were SLA rules accepted by the sales team without pushback? Any learnings to feed back into this playbook?

#### Retention / Expansion

| Engagement Type | Path |
|-----------------|------|
| Single Project | Upsell (Managed Services) → Downsell (related project: Automated Meeting Scheduling, Lead Routing, Attribution) → Retry retainer |
| Multi-Project (Dedicated) | Schedule refinement check-in ~1 quarter after go-live |

**At the refinement check-in:** Review SLA hit/miss percentage trends, speed-to-lead trends, identify new lead types needing SLA coverage. If minor: Architect adjusts SLA rules. If major: Scope new project.

**Output:** Project archived. Future revenue path established.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- SLA Rules Document (lead types, thresholds, escalation tiers, alert recipients)
- Definition Alignment Document (signed off)

**Technical Deliverables:**

- Fully automated speed-to-lead tracking system (custom fields + workflows measuring systems delay, human delay, and total speed to lead)
- Fully automated SLA performance tracking system (hit/miss tracking against business-defined rules by lead type)
- SLA alert system with multi-tier escalation (rep → manager → executive)
- Speed-to-lead and SLA reporting dashboard in CRM
- Systems delay optimizations (if Component 1 in scope)

**Documentation Package:**

- Technical Systems Design Document
- Sales team training video recording
- Leadership/reporting training video recording
- SLA Rules Quick Reference (one-page)
- SLA Alert Configuration Doc
- Test Case Spreadsheet
- Maintenance Schedule

---

## Appendix

### What This Document Is

This is the end-to-end implementation guide for delivering Speed to Lead and SLA Tracking projects. It follows the 4-phase framework (Strategy, Engineering, Enablement, Handoff) and is designed to be duplicated per customer engagement. Each phase contains detailed sub-phase breakdowns, meeting agendas, checklists, and specifications.

### What Each Phase Produces

| Phase | Primary Output | Key Deliverable |
|-------|----------------|-----------------|
| 1. Strategy | Approved SLA rules + technical design | Signed-off SLA Rules Document + Technical Design Document |
| 2. Engineering | Fully functional tracking system | Custom fields, workflows, alerts, dashboard—all tested |
| 3. Enablement | Trained team, live system | Sales team trained, leadership trained, alerts live |
| 4. Handoff | Customer owns the system | Documentation package, maintenance schedule, project archived |

### How to Adapt Per Project Type

| Project Scope | Strategy Weight | Engineering Weight | Enablement Weight | Handoff Weight |
|---------------|-----------------|-------------------|-------------------|----------------|
| Core (Component 2 only) | Med | Heavy (60-70%) | Med | Light |
| Standard (Components 1 + 2) | Med | Heavy (70-80%) | Med | Light |
| Full (Components 1 + 2 + 3) | Med | Very Heavy (80%+) | Med-Heavy | Light |
| Systems Delay Only (Component 1) | Med | Heavy | Light | Light |
