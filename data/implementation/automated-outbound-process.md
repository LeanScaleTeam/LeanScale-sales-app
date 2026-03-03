# Automated Outbound Process — Implementation

## Project One-Pager

### Project Type

- **Category:** Technical (heavy engineering, moderate strategy)
- **Primary Deliverable:** Fully automated multi-channel outbound sales system with enriched data pipelines, configured sequences, and SDR workflows

#### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Med | 2-3 meetings to align on ICP, channel mix, and tool stack |
| 2. Engineering | Yes | Heavy | Tool procurement, data pipeline build, sequence configuration |
| 3. Enablement | Yes | Med | SDR training on tools, sequences, and reply handling |
| 4. Handoff | Yes | Med | Troubleshooting guides, optimization playbook, ownership transfer |

#### Phase Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. STRATEGY  │────▶│ 2. ENGINEER  │────▶│3. ENABLEMENT │────▶│  4. HANDOFF  │
│     Med      │     │    Heavy     │     │     Med      │     │     Med      │
│ 1a→1b→1c→1d │     │ 2a→2b→2c→2d │     │ 3a→3b→3c→3d │     │ 4a→4b→4c→4d │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
  2-3 meetings         Pipelines +          SDR training         Troubleshooting
  ICP + tool stack     sequences + sync     + pilot launch       + optimization
```

**This project's flow:**

- Full 4-phase. Moderate strategy (ICP definition, tool selection, channel mix), heavy engineering (data pipelines, sequence builds, integrations), standard enablement (SDR training), standard handoff.
- Phase 2 is the longest phase -- tool procurement, data infrastructure, and sequence configuration run in parallel streams.
- Some customers may compress Phase 1 if ICP and tool stack are pre-decided.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Watch outbound automation intro video (video walkthrough explaining the project scope and what to expect)
- Complete outbound intake form (current tools, SDR team size, target segments, existing sequence data)
- Provide CRM admin access and API credentials
- Share existing ICP documentation and target account criteria
- Confirm email domain authentication status (SPF, DKIM, DMARC)
- Provide approved messaging and value propositions

##### Track B: Architect Prep

- Pull current CRM data to assess account/contact data quality
- Audit existing sequence performance data (if applicable)
- Run tech stack diagnostic -- identify gaps in enrichment, engagement, and automation tools
- Draft gap analysis: current outbound state vs. desired automated state
- Prepare tool evaluation matrix based on client CRM and budget

#### Refinement Loop (1b -> 1c -> 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present gap analysis, validate ICP, align on goals | VP Sales, Head of SDR, RevOps Leader | Info for v1 outbound strategy |
| Refinement 1 | 1c | Finalize tool stack, channel mix, sequence strategy | Head of SDR, RevOps Leader | v2 with confirmed tool selections |
| Sign-Off | 1d | Approve strategy, tool procurement, and data plan | VP Sales, Finance (budget approval) | Final strategic package |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held
- 1c. Refinement loop complete (v0 -> vFinal)
- 1d. Strategic sign-off obtained

##### Phase 2: Engineering

- 2a. Tech spec created (tool configurations, data flow architecture, sequence designs)
- 2b. Engineering handoff meeting held
- 2c. Build complete (data pipelines, sequences, integrations, automation rules)
- 2d. QA/Test + customer sign-off

##### Phase 3: Enablement

- 3a. Training materials prepped (tool guides, sequence playbooks, reply handling SOPs)
- 3b. Training sessions delivered (SDR team + SDR managers)
- 3c. Pilot launch complete with select SDRs
- 3d. Enablement sign-off

##### Phase 4: Handoff

- 4a. Maintenance schedule documented and handed off
- 4b. Internal handoff (SME -> Architect) complete
- 4c. External handoff (LeanScale -> Customer) complete
- 4d. Project closed and archived

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|---|
| Outbound intake form | Capture current state, ICP, goals | All fields filled, validated at kickoff |
| Gap analysis table | Map current vs. desired outbound state | Gaps prioritized, tools identified |
| Tool evaluation matrix | Compare enrichment, engagement, automation tools | Vendor selected, procurement approved |
| Sequence design document | Map touchpoints, timing, channel mix, branching | All sequences designed and approved |
| Data flow architecture diagram | Document integrations between all tools | All connections mapped and validated |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| Outbound strategy document | Gap analysis + intake | Internal alignment, board reporting |
| Sequence playbook | Sequence design document | SDR daily reference |
| Data pipeline documentation | Data flow architecture | RevOps maintenance and troubleshooting |
| SDR quick-reference guide | Training materials | Daily workflow reference |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Leadership | VP Sales, Head of SDR | Dashboard interpretation, pipeline metrics, optimization cadence | 30m |
| SDR Team | All SDRs | Tool navigation, sequence enrollment, task management, reply handling | 90m |
| Technical | RevOps Admin | Data pipeline maintenance, integration troubleshooting, list refresh | 60m |

##### Hypercare

- **Applies:** Yes
- **Duration:** 3 weeks (pilot + first week of full rollout)
- **Office Hours:** Yes -- daily 15-min standups during pilot, weekly 30-min slot during full rollout

##### Training Assets to Create

- Video walkthrough: Sales engagement platform walkthrough (sequence enrollment, task management)
- Video walkthrough: Data enrichment pipeline overview (how lists refresh, waterfall enrichment flow)
- Video walkthrough: Reply handling workflow (classify, respond, escalate)
- Doc: Sequence playbook (all touchpoints, timing, personalization tokens)
- Doc: Troubleshooting guide (deliverability issues, sync errors, bounce handling)
- Doc: SDR daily workflow checklist

#### Handoff & Retention

##### Internal Handoff (SME -> Architect)

- **Key context for Architect:** Tool stack configuration, data pipeline architecture, sequence naming conventions, SDR team structure, key stakeholder preferences
- **Escalation trigger:** Any changes to sequence logic, data enrichment provider changes, deliverability crises, new segment/persona additions

##### External Handoff (LeanScale -> Customer)

- **Final meeting agenda:** Performance review against baseline, documentation walkthrough, optimization framework, Q&A
- **Documentation package:** All training video walkthroughs, sequence playbook, data pipeline docs, troubleshooting guide, maintenance schedule

##### Maintenance Schedule

- **Weekly:** Deliverability monitoring, bounce rate review, sequence performance check
- **Monthly:** A/B test analysis, list refresh, enrichment quality audit
- **Who owns:** Single project = customer RevOps owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services (ongoing sequence optimization + data pipeline management) -> if no -> Downsell: Another project (e.g., lead scoring, ABM) -> Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~90 days post-launch
- Internal prep trigger: 2 weeks before
- Decision: Architect handles routine optimization / SME needed for structural changes

---

## Phase 1: Strategy

> **Goal:** Get stakeholder sign-off on outbound strategy, tool stack, channel mix, and target segments.
>
> **Output:** Outbound Strategy Document + Tool Evaluation Matrix + Sequence Design Approach (signed off by stakeholders).

### 3a. Pre-Kickoff

> Two parallel tracks run after the engagement is scoped and before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video | Explain what automated outbound is, project scope, timeline | Video walkthrough (5-10 min) |
| Outbound intake form | Capture current tools, processes, SDR team info, goals | Google Form or Doc |
| Definition Alignment Doc | Get sign-off on key outbound terms (MQL, SQL, SAL, SDR-sourced pipeline) | Google Doc |

**Completion tracking:** RevOps lead or Head of SDR owns follow-up. Do not cancel kickoff if incomplete, but push hard after.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Gather inputs (intake form, CRM access, existing sequence data) | Raw data collected |
| 2 | Audit current outbound operations (tools, sequences, data quality) | Current state assessment |
| 3 | Draft tool evaluation matrix (enrichment, engagement, automation) | Tool comparison with recommendations |
| 4 | Gap analysis (current manual process vs. automated target state) | Gap analysis document (v0) |
| 5 | Create kickoff call assets (data quality snapshot, tool options) | Presentation deck, questions list |

**Critical:** Mark everything as ASSUMED. The kickoff call validates.

#### Stakeholder Alignment Document

> Get stakeholder sign-off on terms BEFORE building anything.

| Term | Our Definition | Internally Approved? |
|------|---|---|
| SDR-Sourced Pipeline | Pipeline generated from outbound sequences where SDR booked the meeting | [ ] Yes / [ ] No |
| Sales Accepted Lead (SAL) | A lead the AE has accepted and agreed to work after SDR qualification | [ ] Yes / [ ] No |
| Meeting Booked | A confirmed calendar event between prospect and AE or SDR, with attendance | [ ] Yes / [ ] No |
| Sequence Completion | Prospect reached final touchpoint without positive reply or meeting booked | [ ] Yes / [ ] No |
| Positive Reply | Any reply indicating interest, requesting info, or agreeing to a meeting | [ ] Yes / [ ] No |
| Target Account | An account matching ICP criteria, scored tier A or B, not already in active pipeline | [ ] Yes / [ ] No |

**Instructions to customer:**

> Review each definition with your sales leadership team. Check "Yes" when approved. We cannot proceed with sequence design until all terms are aligned.

---

### 3b. Kickoff Call

> **Purpose:** Present gap analysis and current state audit. Walk in with tool recommendations and preliminary ICP analysis. Customer reacts, does not create from scratch.

#### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|---|
| 0-15 | Walk through current state audit | "Here's what we found in your CRM and existing sequences" |
| 15-30 | Present gap analysis | Current manual processes vs. automated target state |
| 30-45 | Validate ICP and segments | ASSUMED ICP criteria -> CONFIRMED or corrected |
| 45-55 | Review tool options | Present evaluation matrix, get directional feedback |
| 55-70 | Definition alignment | Review Definition Alignment Doc, push for sign-off |
| 70-80 | Outbound goals and KPIs | Align on meeting targets, pipeline goals, timeline |
| 80-90 | Next steps | Schedule refinement meeting, assign homework |

#### What We Bring

- Current state audit (CRM data quality, existing sequence performance, tool usage)
- Gap analysis document (v0)
- Tool evaluation matrix (enrichment, engagement, automation options)
- ICP analysis with ASSUMED criteria
- Definition Alignment Document (pre-filled with recommendations)

#### What We Leave With

- Feedback and corrections on gap analysis (info for v1)
- Confirmed or corrected ICP criteria
- Directional tool preferences (which vendors to evaluate deeper)
- Budget parameters for tool procurement
- Alignment loop scheduled

---

### 3c. Alignment Loop & Strategic Meeting Cadence

> **Purpose:** Iterate on outbound strategy until sign-off. Typically 1 refinement meeting before final sign-off.

#### The Pattern

```
Kickoff Call (gather info, validate ICP)
    |
    v
v1 outbound strategy + refined tool matrix
    |
    v
Meeting 2 (present v1, finalize tool stack, channel mix)
    |
    v
v2 with procurement approved
    |
    v
Meeting 3 (final review, sign-off)
```

#### Potential Meeting Types

| Meeting Type | Focus | Stakeholder |
|---|---|---|
| Strategic/Executive | Budget approval, tool procurement, outbound goals | VP Sales, Finance |
| SDR Operations | Channel mix, sequence cadence, personalization | Head of SDR, SDR Team Lead |
| Technical/RevOps | Data infrastructure, integration requirements | RevOps Leader, CRM Admin |

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 2-3 days |
| Kickoff call | Day 1 of engagement |
| Refinement meeting | 1-2 weeks after kickoff (depends on procurement) |
| Final review + sign-off | When tool procurement approved and ICP finalized |

---

### 3d. Strategic Sign-Off

> **Purpose:** Confirm we have everything before building the automated outbound system.

#### Validation Checkpoint

- Definition Alignment Document signed off by sales leadership
- ICP criteria confirmed with target account and contact filters
- Tool stack selected and procurement approved (enrichment, engagement, automation)
- Channel mix strategy documented (email/phone/LinkedIn ratios)
- Outbound goals and KPIs defined (meetings booked target, pipeline contribution)
- Email domain authentication verified (SPF, DKIM, DMARC)
- SDR team capacity confirmed for outbound execution
- No blockers for engineering

#### Decision Point

- **Proceed to Engineering** -> Tool procurement initiated, data and sequences need to be built
- This project always proceeds to Phase 2. There is no natural exit point after strategy alone.

---

## Phase 2: Engineering

> **Goal:** Build the complete automated outbound system: data pipelines, enriched target lists, multi-channel sequences, integrations, and automation rules.
>
> **Output:** Fully configured outbound system, tested end-to-end, ready for pilot launch.

| Project Type | Engineering Weight | Context |
|---|---|---|
| Automated Outbound Process | Heavy (60-70%) | Data infrastructure, tool configurations, sequence builds, integrations |

### Sub-Phases

```
2a Tech Spec -> 2b Engineering Handoff -> 2c Build -> 2d Test
```

---

### 4a. Tech Spec

> **Purpose:** Translate outbound strategy into technical specifications for data pipelines, sequence configurations, and integration architecture.

**Input:** Signed-off outbound strategy document, tool selections, ICP criteria

**What happens:**

1. Map ICP criteria to data enrichment tool filters (firmographics, technographics, intent signals)
2. Design data flow architecture: enrichment tool -> CRM -> sales engagement platform (and reverse)
3. Specify sequence configurations: touchpoint count, timing, channel assignments, branching logic
4. Document automation rules: enrollment triggers, task routing, reply classification, mutual exclusion
5. Define integration specs: API connections, field mappings, sync frequency

**Output:** Tech spec containing:

- Data enrichment configuration (provider waterfall order, enrichment fields, quality thresholds)
- CRM field mappings (new fields needed, activity types, campaign attribution)
- Sequence specifications (touchpoints, timing, templates, personalization tokens, branching)
- Integration architecture (bi-directional sync config, API endpoints, authentication)
- Automation rules (enrollment criteria, daily caps, exclusion rules, re-enrollment logic)
- Build sequence (what to build first -- data pipelines before sequences)

---

### 4b. Engineering Handoff

> **Purpose:** Review tech specs before building. The Architect walks through the integration architecture and sequence logic with the engineering or RevOps specialist.

**Agenda (45-60 min):**

| Time | Topic | What Happens |
|------|-------|---|
| 0-15 | Walk through data flow architecture | Architect explains enrichment pipeline and CRM integration |
| 15-30 | Review sequence specifications | Touchpoints, timing, branching, personalization |
| 30-45 | Automation and integration specs | Enrollment rules, task routing, reply handling |
| 45-60 | Risk assessment and build plan | Flag deliverability risks, dependency order, timeline |

**What Architect brings:**

- Outbound strategy document (for context)
- Full tech spec (from 4a)
- Tool access credentials and admin permissions
- Questions list (data quality concerns, integration limitations)

**What the engineer leaves with:**

- Approved tech spec with confirmed build sequence
- Clear dependency chain: 1) tools provisioned -> 2) data pipelines -> 3) sequences -> 4) automation
- Known risks: domain warm-up timeline, data quality thresholds, sending limits

---

### 4c. Build (Configure)

> **Purpose:** Build the complete automated outbound system across data, sequences, and integrations.

**Input:** Approved tech spec from 4b

**The build runs in 5 parallel/sequential streams:**

#### Stream 1: Tool Provisioning and Configuration (Week 1)

- Provision data enrichment tool accounts (ZoomInfo, Apollo, Cognism, or selected vendor)
- Provision sales engagement platform (Outreach, Salesloft, or selected vendor)
- Provision workflow automation tool if needed (Clay, Make, or native CRM automation)
- Configure user permissions and roles in each tool
- Set up email domains for outbound (secondary domains, not primary corporate domain)
- Begin domain warm-up process (2-4 weeks to build sender reputation) [1]

#### Stream 2: Data Infrastructure (Week 1-2)

- Translate ICP criteria into data enrichment tool filters
- Pull initial target account list (2,000-10,000 accounts based on TAM size)
- Deduplicate against existing CRM accounts and customers
- Enrich account records with firmographic and technographic data
- Score and tier accounts (A/B/C based on fit criteria)
- Identify target personas per account (titles, departments, seniority)
- Pull contacts from primary data source
- Run waterfall enrichment for missing data (Clay enables checking 150+ providers in sequence, falling back to secondary sources when primary misses) [2]
- Verify email addresses (NeverBounce, ZeroBounce, or built-in verification)
- Enrich contacts with personalization data (LinkedIn URL, recent company news, tech stack)
- Load accounts and contacts into CRM with proper tagging and ownership

#### Stream 3: Data Sync and Pipelines (Week 2)

- Configure bi-directional sync between CRM and sales engagement platform
- Set up automated enrichment triggers for new accounts/contacts
- Create bounce-handling workflows (flag bounced emails, update contact status)
- Build automated list refresh cadence (weekly or monthly re-enrichment)
- Configure duplicate detection and merge rules
- Test data flows end-to-end with sample records

#### Stream 4: Sequence Design and Build (Week 2-3)

- Build email templates for each sequence stage (opener, value prop, social proof, break-up)
- Create personalization framework using available data points
- Build industry/vertical-specific template variations for top segments
- Configure personalization tokens in sales engagement platform with fallback values
- Write phone scripts with discovery questions and objection handling
- Create voicemail scripts (under 30 seconds with clear CTA)
- Build LinkedIn connection request and follow-up message templates
- Create sequence shells with naming conventions and tagging
- Add steps with correct timing and channel assignments
- Configure branching logic based on engagement signals (opens, clicks, replies)
- Set up A/B test variants for subject lines and messaging

#### Stream 5: Automation and Integration (Week 3-4)

- Define and configure enrollment triggers (list membership, lead score, intent signal)
- Build enrollment workflows in CRM or automation tool
- Configure mutual exclusion rules to prevent sequence overlap
- Set daily enrollment caps to protect sender reputation (start at 25 per mailbox per day, ramp to 50) [3]
- Create re-enrollment rules for completed-without-converting prospects
- Configure call task creation with priority and due date logic
- Set up task routing based on territory or account ownership
- Create engagement-triggered follow-up tasks
- Configure meeting-booked notifications and AE handoff tasks
- Set up overdue task escalation alerts
- Map sales engagement activities to CRM activity types
- Configure email, call, and LinkedIn activity logging to CRM
- Set up meeting-booked sync with opportunity creation rules
- Build campaign attribution for outbound touches
- Configure reply classification rules (positive, negative, OOO, auto-reply, referral)

**Build tracking:**

- Stream 1: Tool provisioning complete
- Stream 2: Data infrastructure built and loaded
- Stream 3: Data sync pipelines running
- Stream 4: All sequences built and internally tested
- Stream 5: Automation and integrations configured

---

### 4d. QA / Test + Sign-Off

> **Purpose:** Verify the entire outbound system works end-to-end and get customer approval.

**Two types of testing:**

| Type | Who | Purpose |
|------|-----|---------|
| Technical Testing | Our team | Verify data flows, sequences fire, integrations sync |
| Customer Testing | Customer | Verify targeting, messaging, and workflow match expectations |

**Technical testing checklist:**

- Data enrichment pipeline returns complete records for test accounts
- Waterfall enrichment fills gaps from secondary sources correctly
- Email verification catches invalid addresses before sequence enrollment
- CRM <> sales engagement platform sync is bi-directional and real-time
- Sequences fire correctly with proper timing between touchpoints
- Personalization tokens populate (and fallbacks display for missing data)
- Branching logic routes prospects correctly based on engagement
- Enrollment automation triggers on correct criteria
- Mutual exclusion rules prevent double-enrollment
- Daily sending caps enforce per-mailbox limits
- Reply classification correctly categorizes positive, negative, OOO, and auto-replies
- Meeting-booked notification reaches AE and creates opportunity in CRM
- All activities log correctly in CRM with proper attribution
- Deliverability check: test emails land in inbox (not spam) for Gmail and Outlook

**Customer testing:**

- Walk customer RevOps lead through data pipeline (enrichment -> CRM -> sequences)
- Have SDR manager review all email templates, phone scripts, and LinkedIn messages
- Run a sample prospect through the full sequence in test mode
- Verify CRM reports show outbound activity correctly

**Engineering sign-off checkpoint:**

- All 5 build streams complete and tested
- Domain warm-up at minimum 2 weeks (ideally 4 weeks before full volume)
- Customer has reviewed and approved messaging and workflows
- Ready for pilot launch (Phase 3)

**Decision point:**

- **Proceed to Enablement** -> System built, pilot launch next
- **Loop back to Build** -> Integration issues, data quality problems, or messaging changes needed

---

## Phase 3: Enablement

> **Goal:** SDR team can execute the automated outbound process independently. Pilot validates performance before full rollout.
>
> **Output:** Trained SDR team, validated sequence performance, stabilized system.

### Sub-Phases

```
3a Training Prep -> 3b Training Sessions -> 3c Hypercare (Pilot + Rollout) -> 3d Enablement Sign-Off
```

---

### 5a. Training Prep

> **Purpose:** Create training materials from the built system documentation and sequence playbooks.

**Input:** Tech spec + built system + sequence designs + automation rules

**What happens:**

1. Create video walkthrough scripts for each training session (SDR, leadership, technical)
2. Build SDR quick-reference guide (daily workflow, tool navigation, reply handling)
3. Create sequence playbook (all touchpoints mapped with timing, templates, and personalization guidance)
4. Draft FAQ from common questions in similar outbound projects

**Output:** Training package containing:

- Video walkthrough scripts for 3 training sessions (SDR team, leadership, technical)
- SDR quick-reference guide (one-page daily workflow)
- Sequence playbook (full touchpoint map with messaging)
- Reply handling decision tree (how to classify and respond to each reply type)
- FAQ document (top 15-20 questions SDRs ask during rollout)

---

### 5b. Training Sessions

> **Purpose:** Transfer knowledge to SDR team, SDR managers, and RevOps admins.

**Three training types:**

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| SDR Team Training | All SDRs | Tool navigation, sequence enrollment, task management, reply handling, personalization best practices | 90 min |
| Leadership Training | VP Sales, Head of SDR | Dashboard interpretation, pipeline metrics from outbound, optimization cadence | 30 min |
| Technical Training | RevOps Admin, CRM Admin | Data pipeline maintenance, integration monitoring, list refresh, troubleshooting | 60 min |

**SDR Team Training covers:**

1. Sales engagement platform navigation (sequences, tasks, analytics)
2. How to enroll prospects manually and understand automatic enrollment
3. Task queue management (call tasks, LinkedIn tasks, follow-ups)
4. Reply handling workflow: classify reply -> respond/escalate -> update CRM
5. When to personalize vs. send as-is (required personalization fields)
6. CRM logging requirements and data hygiene expectations
7. Deliverability dos and don'ts (no mass forwarding, watch sending limits)

**Training delivery:**

1. Schedule sessions with appropriate stakeholders (SDRs first, then leadership, then technical)
2. Deliver training live with screen sharing
3. Record all sessions as video walkthroughs for future reference
4. Answer questions, note gaps for FAQ updates
5. Set up office hours for first two weeks post-launch

**Output:**

- Trained stakeholders across all three groups
- Video walkthroughs of each session
- Updated FAQ document (incorporating questions from training)

---

### 5c. Hypercare (Pilot + Full Rollout)

> **Purpose:** Validate system performance through pilot, then stabilize during full rollout.

**Duration:** 3 weeks total (1-week pilot + 2-week full rollout monitoring)

**Week 1: Pilot Launch**

- Select 2-3 SDRs for pilot program with clear success criteria
- Enable sequences for pilot group with monitored enrollment
- Track key metrics daily: deliverability rate (target >95%), open rate, reply rate (target >5%), meetings booked [4]
- Daily 15-min standup with pilot SDRs to gather feedback
- Identify and fix issues before full rollout
- Document pilot learnings and optimization recommendations

**Pilot success criteria:**

| Metric | Target | Red Flag |
|--------|--------|----------|
| Email deliverability | >95% inbox | <90% inbox |
| Open rate | >40% | <25% |
| Reply rate | >5% | <2% |
| Positive reply rate | >2% | <0.5% |
| Bounce rate | <3% | >5% |
| Spam complaints | <0.1% | >0.1% |

**Week 2-3: Full Rollout**

- Enable sequences and automation for full SDR team
- Configure real-time dashboards tracking sequence metrics
- Set up weekly review cadence with SDR manager
- Create alerts for anomalies (deliverability drops, reply rate changes)
- Weekly 30-min office hours for SDR questions
- Document escalation path for technical issues

**When to skip pilot:** Never. Outbound automation without a pilot risks domain reputation damage from deliverability issues that are much harder to fix after the fact.

**Output:** Validated system, confirmed performance benchmarks, full team live

---

### 5d. Enablement Sign-Off

> **Purpose:** Confirm SDR team and RevOps can operate independently.

**Validation checkpoint:**

- All three training sessions delivered and recorded
- Pilot launch completed with metrics meeting targets
- Full rollout live with all SDRs enrolled
- Dashboards configured and leadership reviewing weekly
- No critical issues outstanding (deliverability, sync errors, enrollment bugs)
- SDR team completing tasks and handling replies without daily support
- RevOps admin comfortable with data pipeline monitoring
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** -> System stable, team enabled, metrics on track
- **Extend Hypercare** -> Deliverability issues, SDR adoption problems, or integration bugs still being resolved

---

## Phase 4: Handoff

> **Goal:** Clean project close with maintenance plan established and retention/expansion path set.
>
> **Output:** Maintenance schedule documented, internal context transferred, customer owns the outbound system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule -> 4b Internal Handoff -> 4c External Handoff -> 4d Project Close
                              (SME -> Architect)      (LeanScale -> Customer)  (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|---|---|---|
| **Single Project** | Customer owns | 4c (External Handoff) -- customer receives maintenance schedule and runs it themselves |
| **Dedicated (Multi-Project)** | Architect owns | 4b (Internal Handoff) -- Architect receives maintenance schedule and runs it for customer |

---

### 6a. Maintenance Schedule

> **Purpose:** Document what needs ongoing attention after the project is complete -- cadences, tasks, triggers for re-engagement.

#### Standard Maintenance Framework

**Weekly Tasks:**

| Weekly Task | What to Check | Red Flag Threshold |
|---|---|---|
| Deliverability monitoring | Inbox placement rate across all sending domains | <90% inbox rate for any domain |
| Bounce rate review | Hard and soft bounce rates per domain | >5% bounce rate on any domain |
| Sequence performance | Reply rates and meeting booked rates | Reply rate drops below 3% for 2+ consecutive weeks |
| Task completion | SDR task completion rates | <70% of tasks completed on time |

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|---|---|---|
| A/B test analysis | Subject line and messaging performance | No statistical significance after 500+ sends |
| List refresh | Re-enrich existing contacts, add new accounts | >15% of contacts have bounced emails |
| Enrichment quality audit | Data completeness and accuracy rates | <80% email coverage on target contacts |
| Sequence optimization | Touchpoint timing, channel mix, drop-off points | Meeting booked rate declining month-over-month |
| Sending domain health | Domain reputation across email providers | Any domain flagged or blacklisted |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|---|---|---|
| ICP validation | Are target accounts and personas still right? | Update ICP filters, refresh account lists |
| Channel mix assessment | Email vs. phone vs. LinkedIn effectiveness | Rebalance channel allocation in sequences |
| Tool stack evaluation | Are current tools meeting needs? New options? | Evaluate alternatives if coverage drops |
| SDR productivity review | Meetings booked per rep, pipeline generated | Retrain underperformers, adjust territory |

**After First Business Cycle (30-60 days post-launch):**

- Full sequence performance analysis (which sequences, templates, and channels drive meetings)
- Pipeline attribution review: outbound contribution to total pipeline
- SDR productivity benchmark vs. pre-automation baseline (target: 30%+ increase in meetings booked per SDR within 90 days [5])

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Deliverability crisis | Inbox rate <85% for 1+ week | Pause sequences, audit domain health, re-engage SME |
| Reply rate collapse | <2% reply rate for 3+ consecutive weeks | Review messaging, check data quality, adjust targeting |
| Meeting rate plateau | Meeting booked rate flat or declining for 60+ days | Scope optimization project or managed services retainer |
| New segment launch | Customer expanding to new market or persona | Scope new segment buildout (new lists, sequences, templates) |

**Every 6-12 Months:**

- Full outbound system audit (tool contracts, data provider accuracy, sequence architecture)
- Market conditions review (competitor messaging shifts, buyer behavior changes)
- Technology refresh (evaluate new AI capabilities, new enrichment sources, platform features)

---

### 6b. Internal Handoff (SME -> Architect)

> **Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- Tool stack and configuration (which enrichment provider, which engagement platform, how they connect)
- Sequence architecture (naming conventions, how many sequences, which segments get which sequences)
- Key stakeholder map (who owns what: Head of SDR for messaging, RevOps for data, VP Sales for strategy)
- Data pipeline health indicators (what to check in weekly dashboards)
- Common issues and quick fixes (see Troubleshooting Guide below)
- **Maintenance schedule** (if Dedicated engagement -- Architect runs this)

**Escalation guidelines:**

| Issue Type | Who Handles | Examples |
|---|---|---|
| Template tweaks, minor timing adjustments | Architect | "Change email 3 subject line," "Adjust step timing" |
| Deliverability issues, new segment builds, integration changes | SME | "Domain blacklisted," "Add new persona," "New CRM field sync" |

**For Dedicated engagements:** Architect also receives the maintenance schedule (6a) and becomes responsible for executing it. SME walks Architect through each maintenance task.

---

### 6c. External Handoff (LeanScale -> Customer)

> **Purpose:** Formal project completion with customer.

**Final project meeting:**

- Review what was delivered (data pipeline, sequences, integrations, automation)
- Walk through performance metrics (pilot results, current run-rate)
- Present documentation package
- Walk through maintenance schedule in detail
- Demo the optimization framework (how to A/B test, when to refresh lists, how to add segments)
- Answer final questions
- Make it explicit: "Project complete"
- **For Single Project engagements:** Hand over the maintenance schedule and record a video walkthrough

**Documentation package:**

- All training video walkthroughs (SDR, leadership, technical)
- Sequence playbook (all touchpoints, templates, personalization guidance)
- Data pipeline documentation (enrichment sources, sync architecture, field mappings)
- Automation rules documentation (enrollment triggers, exclusion rules, task routing)
- Troubleshooting guide (see below)
- SDR quick-reference guide
- FAQ document
- Definition Alignment Document (final version)
- Maintenance Schedule
- Optimization playbook (A/B testing framework, sequence iteration guide)

**Output:** Customer owns the outbound system. Project formally complete.

---

### 6d. Project Close

> **Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved to proper location
- Handoff documentation complete
- Project status updated in tracking system
- Time/billing finalized

#### Internal Debrief (Optional but Recommended)

- What went well? (Data quality, SDR adoption, tool selection)
- What would we do differently? (Procurement timeline, sequence iteration speed, pilot scope)
- Any learnings to feed back into SOPs?

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|---|---|
| **Single Project** | Upsell -> Downsell -> Retry |
| **Multi-Project (Dedicated)** | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (ongoing outbound optimization, list management, sequence testing)
   | if no
2. Downsell: Another one-time project (lead scoring, ABM/ABS, inbound automation)
   | if yes
3. Retry retainer at end of next project cycle
```

**Script:**

> "Now that your automated outbound system is live and performing, there are two ways we can continue working together. Option 1: We can manage ongoing optimization -- A/B testing, list refreshes, new segment builds, and deliverability monitoring. Option 2: If there's another specific project you need help with, like lead scoring or ABM, we can scope that out. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

> "On [date ~90 days out], we'll review how the outbound system is performing, analyze which sequences are driving the most pipeline, and see if any adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|---|---|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull outbound dashboard data, assess pipeline contribution |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points. |

**At the refinement check-in:**

- Review outbound pipeline contribution against original goals
- Analyze sequence performance (which sequences, templates, and channels drive meetings)
- Identify optimization opportunities (new segments, messaging refresh, tool upgrades)
- If minor: Architect handles sequence tweaks and list refreshes
- If major: Scope new project (new segment build, platform migration, ABM overlay)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Troubleshooting Guide

> Common issues and resolutions for the automated outbound system. Reference during hypercare and include in handoff documentation.

### Deliverability Issues

| Scenario | Symptoms | Resolution |
|----------|----------|-----------|
| Emails landing in spam | Open rates drop below 15%, replies near zero | Check domain reputation (MXToolbox), pause sequences, reduce daily volume, verify SPF/DKIM/DMARC, increase warm-up engagement |
| High bounce rate | >5% hard bounces on sends | Pause enrollment, re-verify email list, check enrichment source accuracy, tighten verification threshold |
| Domain blacklisted | Emails rejected by major providers | Pause all sends from affected domain, submit delisting requests, rotate to backup domain, investigate root cause (spam complaints, bad list) |
| Sending limits exceeded | Emails queued but not sent, delivery delays | Check per-mailbox daily caps, distribute volume across more mailboxes, reduce enrollment rate |

### Data and Enrichment Issues

| Scenario | Symptoms | Resolution |
|----------|----------|-----------|
| Low enrichment coverage | >20% of contacts missing email or phone | Review waterfall enrichment order, add secondary data sources, check ICP filter breadth |
| Stale contact data | Increasing bounces over time, wrong titles | Run re-enrichment workflow, set up automated monthly refresh, configure job-change alerts |
| Duplicate contacts in sequences | Same prospect getting multiple sequences | Check mutual exclusion rules, audit duplicate detection, verify dedup runs before enrollment |
| CRM sync failures | Activities missing from CRM, data mismatches | Check API connection status, verify field mappings, review sync logs for errors, test with single record |

### Sequence and Automation Issues

| Scenario | Symptoms | Resolution |
|----------|----------|-----------|
| Prospects not enrolling | Sequence enrollment numbers below expected | Verify enrollment trigger criteria, check list filters, confirm automation is enabled, test with manual enrollment |
| Reply classification errors | Positive replies marked as negative (or vice versa) | Review classification rules, adjust sentiment keywords, add training examples, manually reclassify and retrain |
| Tasks not generating | SDRs see empty task queues despite active sequences | Check task creation rules, verify step types are configured for task generation, review platform settings |
| SDRs overwhelmed with tasks | Task queues growing faster than completion | Reduce enrollment rate, adjust daily caps, prioritize tasks by account tier, review sequence step count |

### SDR Adoption Issues

| Scenario | Symptoms | Resolution |
|----------|----------|-----------|
| Low task completion rates | <50% of tasks completed on time | Retrain on task management, simplify workflow, gamify completion, review task load per rep |
| SDRs bypassing the system | Manual emails outside sequences, CRM not updated | Reinforce process, show data on system vs. manual performance, address specific objections |
| Personalization not happening | Generic emails despite available data | Review which fields are required vs. optional, simplify personalization, add more pre-built snippets |

---

## Edge Cases

- **Customer has no existing outbound process** -> Start from zero. Strategy phase includes full outbound strategy creation, not just automation of existing process. Add 1-2 weeks to timeline.
- **Customer already has Outreach/Salesloft but poor adoption** -> Skip tool procurement. Focus engineering phase on reconfiguration and sequence redesign. Increase enablement weight.
- **Customer wants outbound but has no dedicated SDR team** -> Flag in discovery. AE-led outbound automation is possible but requires different sequence design (fewer touchpoints, higher personalization, integration with deal workflow).
- **Customer's CRM data is severely messy** -> Requires CRM data cleanup as a prerequisite or parallel project. Do not build data pipelines on a dirty foundation. Recommend CRM Deduplication project first.
- **Multiple email domains needed for scale** -> Common for teams with 5+ SDRs. Each SDR needs a dedicated sending domain. Factor domain warm-up timeline (30 days minimum per domain [1]) into project plan.
- **International outbound (GDPR/privacy compliance)** -> Add compliance review step in Phase 1. Configure opt-out handling per jurisdiction. May require separate sequences for EU vs. US prospects.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Outbound Strategy Document (ICP criteria, channel mix, goals, KPIs)
- Tool Evaluation Matrix (selected vendors with rationale)
- Definition Alignment Document (signed off by stakeholders)

**Technical Deliverables:**

- Configured data enrichment pipeline with waterfall enrichment
- Target account and contact lists (enriched, verified, loaded into CRM)
- Multi-channel sequences built in sales engagement platform (all touchpoints configured)
- Automation rules (enrollment, task routing, reply classification, AE handoff)
- CRM integrations (bi-directional sync, activity logging, campaign attribution)
- Real-time dashboards tracking sequence performance and pipeline metrics

**Documentation Package:**

- Training video walkthroughs (SDR, leadership, technical)
- Sequence playbook (all touchpoints with templates and timing)
- Data pipeline documentation (sources, architecture, field mappings)
- SDR quick-reference guide
- Troubleshooting guide
- FAQ document
- Definition Alignment Document (final version)
- Maintenance Schedule
- Optimization playbook (A/B testing framework)

---

## Definition Alignment Terms

| Term | Typical Definition |
|------|---|
| SDR-Sourced Pipeline | Pipeline where the meeting was booked by an SDR through outbound sequences |
| Sales Accepted Lead (SAL) | A lead the AE has accepted and agreed to work after SDR passes it |
| Meeting Booked | A confirmed calendar event between prospect and AE/SDR with attendance confirmed |
| Sequence Completion | Prospect reached final touchpoint in sequence without positive reply or meeting |
| Positive Reply | Any reply expressing interest, requesting information, or agreeing to a meeting |
| Target Account | Account matching ICP criteria, scored tier A or B, not already in active pipeline |
| Waterfall Enrichment | Sequential querying of multiple data providers to fill gaps in contact records |
| Domain Warm-Up | Gradual increase of email volume from a new domain to build sender reputation |
| Mutual Exclusion | Rules preventing a prospect from being enrolled in multiple sequences simultaneously |
| Reply Classification | Automated categorization of replies (positive, negative, OOO, auto-reply, referral) |

---

## Common Gotchas

- **Skipping domain warm-up** -> "Sending high volume from a new domain tanks deliverability. Budget 2-4 weeks for warm-up" before pilot launch. This is the single most common timeline miss. [1]
- **Importing unverified lists** -> Bad email data destroys sender reputation. Always verify before any data enters sequences. A spam complaint rate of just 0.1% (1 per 1,000 emails) can trigger alarms [3].
- **Building sequences before data infrastructure** -> Sequences without clean, enriched data produce bad results. Always: data pipeline first, sequences second.
- **Over-automating reply handling** -> Not all replies can be classified by rules. Train SDRs on edge cases (competitor referrals, pricing questions, "not now" responses). Human judgment still matters.
- **No personalization requirements** -> Generic sequences get ignored. Build required personalization fields that force SDRs to customize before sending. Sales reps using personalized outreach see 2-3x higher reply rates than template-only approaches [4].
- **Forgetting LinkedIn as a channel** -> Multi-channel outreach (email + phone + LinkedIn) boosts engagement by 287% compared to single-channel approaches [6]. Do not build email-only sequences.
- **No baseline metrics captured** -> Measure current state (meetings booked per SDR, pipeline from outbound) before launch. Without a baseline, you cannot prove ROI.

---

## Methodology Options

| Option | When to Use | Complexity |
|--------|------------|-----------|
| Email-first automation | Small SDR team (<3), limited budget, email-heavy ICP | Low |
| Multi-channel full stack | 3+ SDRs, budget for all tools, enterprise-focused ICP | High |
| Clay-centric workflow | Data quality is primary pain, need advanced enrichment | Medium |
| Platform-native automation | Already own Outreach/Salesloft, need better utilization | Medium |

> See the Methodology guide for detailed decision frameworks on tool selection, channel mix optimization, and sequence architecture design.

---

## References

[1] MailReach - How to Warm Up Email Domain

[2] Clay - Waterfall Enrichment

[3] Clay Blog - 21 Cold Email Deliverability Best Practices

[4] The Digital Bloom - Cold Email Reply-Rate Benchmarks 2025

[5] Salesforce State of Sales Report

[6] SalesSo - Outbound SDR Statistics 2025

---

## Appendix: Reference Guide

### Roles

| Role | What They Do |
|------|---|
| **Architect** | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| **Engineer** | CRM build, automation, dashboards (Phase 2) |
| **SME** | Project/implementation specialist brought in for project-specific work |
| **AE** | Closes the deal (pre-project) |

### What Each Phase Produces

| Phase | Output | Gate Criteria |
|-------|--------|---|
| **Phase 1: Strategy** | Outbound strategy doc, tool selections, Definition Alignment Doc | ICP confirmed, tools approved, budget allocated, definitions signed off |
| **Phase 2: Engineering** | Fully configured outbound system (data + sequences + automation) | All 5 build streams complete, end-to-end testing passed, customer approved |
| **Phase 3: Enablement** | Trained SDR team, validated pilot metrics | All training delivered, pilot targets met, full rollout live |
| **Phase 4: Handoff** | Independent customer + archived project | Internal/external handoffs complete, maintenance plan in place, project closed |

### Project Profile

This project is **engineering-heavy**:

| Project Profile | Strategy Weight | Engineering Weight | Enablement Weight |
|---|---|---|---|
| Automated Outbound Process | 20-25% | 50-60% | 20-25% |

**Adaptation notes:**

- Strategy compresses if customer has pre-selected tools and defined ICP
- Engineering is always heavy -- data infrastructure, sequence builds, and integrations are substantial
- Enablement cannot be skimped -- SDR adoption determines project success
- Phase 4 always applies -- outbound systems require ongoing maintenance

### Single vs Dedicated Engagement

| Engagement Type | What It Means | Key Difference |
|---|---|---|
| **Single Project** | One-off outbound automation build | Customer owns maintenance post-handoff |
| **Dedicated (Multi-Project)** | Ongoing retainer / multiple projects | Architect owns maintenance post-handoff |