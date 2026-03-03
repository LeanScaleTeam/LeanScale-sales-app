# Automated Inbound — Implementation

> End-to-end process for delivering Automated Inbound projects using a 4-phase framework: Strategy, Engineering, Enablement, Handoff.

## Project One-Pager

### Automated Inbound One-Pager

#### Project Type

- Category: Balanced (Strategy + Technical)
- Primary Deliverable: Enriched, routed, and automated inbound lead flow -- from form fill to rep action in under 5 minutes

##### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Medium | 2-3 meetings to align on channels, MQL definition, routing logic |
| 2. Engineering | Yes | Heavy | Clay enrichment table, webhook config, CRM routing, sequence setup |
| 3. Enablement | Yes | Light | RevOps + SDR training, 2-week hypercare |
| 4. Handoff | Yes | Light | Maintenance schedule + handoff, minimal ongoing complexity |

#### Phase Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. STRATEGY  │────▶│ 2. ENGINEER  │────▶│3. ENABLEMENT │────▶│  4. HANDOFF  │
│    Medium    │     │    Heavy     │     │    Light     │     │    Light     │
│ 1a→1b→1c→1d │     │ 2a→2b→2c→2d │     │ 3a→3b→3c→3d │     │ 4a→4b→4c→4d │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
  2-3 meetings         Clay + webhooks      RevOps + SDR         Maintenance +
  MQL + routing        CRM routing          2-week hypercare     handoff
```

**This project's flow:**

- Full 4-phase. Strategy scopes channels, MQL criteria, and routing logic. Engineering is the heaviest phase -- Clay tables, webhooks, CRM workflows, sequence configuration. Enablement is lighter -- RevOps and SDR training. Handoff includes maintenance cadences for data decay monitoring.
- Post-Market Map projects compress Phase 2 significantly (duplicate Clay table, reuse tiering). Standalone projects add ICP/tiering build time.
- No phases skipped. Some customers compress 3c Hypercare to 1 week if routing is simple.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Watch intro video explaining inbound enrichment and routing concepts (5-10 min)
- Complete intake form: current inbound channels, volume, CRM, tool stack, MQL definition status, team structure
- Provide CRM admin access (Salesforce or HubSpot) for system audit
- Confirm MQL definition exists or flag that lead lifecycle needs fixing first
- Share existing routing rules, sequence templates, and flow diagrams if any exist

##### Track B: Architect Prep

- Audit CRM for existing lead lifecycle stages, routing rules, and inbound workflows
- Check if Market Map exists -- if yes, pull existing Clay table structure, tiering logic, and ICP criteria
- Identify all active inbound channels from CRM data (form submissions, trial signups, chat transcripts)
- Draft v0 channel map with intent tiers based on CRM data and intake form
- Draft v0 routing decision tree based on team structure and coverage hours
- Prepare Definition Alignment Document with recommended MQL criteria and tier definitions

#### Refinement Loop (1b -> 1c -> 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present v0 channel map and routing tree, validate MQLs | RevOps Manager, SDR Leadership | Corrections for v1 |
| Refinement 1 | 1c | Review v1 routing logic, finalize human/auto split | RevOps Manager, Head of RevOps | v2 with approved decision tree |
| Refinement 2 | 1c | Final adjustments to tier thresholds and timing logic | RevOps Manager | v3 ready for sign-off |
| Sign-Off | 1d | Strategic approval of channels, MQL, routing, sequences | Head of RevOps, VP Sales | Approved strategic package |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held
- 1c. Refinement loop complete (v0 -> vFinal)
- 1d. Strategic sign-off obtained

##### Phase 2: Engineering

- 2a. Tech spec created (Clay table design, webhook architecture, CRM field mapping)
- 2b. Engineering handoff meeting held
- 2c. Build complete (Clay table, webhooks, routing workflows, sequences)
- 2d. QA/Test + customer sign-off

##### Phase 3: Enablement

- 3a. Training materials prepped
- 3b. Training sessions delivered (RevOps, SDR/BDR, Sales Reps)
- 3c. Hypercare period complete (2 weeks)
- 3d. Enablement sign-off

##### Phase 4: Handoff

- 4a. Maintenance schedule documented and handed off
- 4b. Internal handoff complete
- 4c. External handoff (LeanScale -> Customer) complete
- 4d. Project closed and archived

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| Intake form | Capture inbound channels, volume, tools, MQL status | All fields filled, reviewed in kickoff |
| Channel map | Map every inbound source with intent tier | All channels documented with tier assignments |
| Routing decision tree | Visual logic for lead routing | All paths validated against real scenarios |
| Definition Alignment Doc | Align on MQL, tier, and routing terminology | All terms approved by stakeholders |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|------------------|
| Routing decision tree (Lucidchart) | Working routing doc | Internal alignment, onboarding new reps |
| Channel-to-action flow diagram | Channel map | Ops documentation, troubleshooting reference |
| Maintenance schedule | Post-support cadences | Ongoing system health monitoring |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Technical | RevOps Manager | Webhook monitoring, Clay enrichment troubleshooting, routing rules | 60 min |
| Operational | SDR/BDR Leadership | Sequence performance, manual follow-up queue, edge case handling | 45 min |
| End User | Sales Reps | Enrichment data in CRM, when they get routed leads, context usage | 30 min |

##### Hypercare

- Applies: Yes
- Duration: 2 weeks
- Office Hours: Yes -- weekly 30-min slot for the RevOps Manager to surface issues

##### Training Assets to Create

- Video walkthrough: End-to-end lead flow (form -> enrichment -> routing -> sequence)
- Video walkthrough: Clay table and webhook monitoring guide
- Doc: Routing decision tree reference (Lucidchart export)
- Doc: Troubleshooting guide (webhook failures, enrichment issues, routing misassignment)
- Doc: Sequence structure reference (steps, timing, methods -- copy is customer-owned)

#### Handoff & Retention

##### Internal Handoff

- Key context for ongoing team: Which approach was used (post-Market Map vs standalone), routing complexity, customer's MQL definition, Clay credit budget
- Escalation trigger: Routing logic changes, new inbound channel additions, MQL criteria changes, Clay table hitting 50k webhook limit

##### External Handoff (LeanScale -> Customer)

- Final meeting agenda: Live demo of lead flowing through system, routing tree walkthrough, maintenance schedule review, Q&A
- Documentation package: Training recordings, routing decision tree, sequence structure doc, troubleshooting guide, maintenance schedule

##### Maintenance Schedule

- Weekly: webhook monitoring, sequence performance, speed-to-lead sampling
- Monthly: Clay credit audit, routing accuracy spot-check, T1 exception review
- Quarterly: MQL criteria validation, enrichment provider optimization, decision tree review, new channel integration
- Full cadences documented in Phase 4a below
- Who owns: Single project = customer owns | Dedicated = ongoing team owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services (retainer for ongoing optimization) -> if no -> Downsell: Lead Routing Optimization, Automated Outbound, or Signal-Based Workflows -> Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~1 quarter after go-live
- Internal prep trigger: 2 weeks before
- Decision: Ongoing team handles (routing tweaks, threshold adjustments) / Specialist needed (structural changes, new channel architecture)

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| MQL (Marketing Qualified Lead) | A lead that meets both ICP fit criteria (firmographic match) and demonstrated intent (behavioral signals like form fills, page views) |
| Intent Tier | Classification of lead urgency: T1 (high intent, <5 min response), T2 (medium, same business day), T3 (low, 24-48 hr nurture) |
| Speed-to-Lead | Time elapsed from form submission to first meaningful response (human or automated) |
| Enrichment Waterfall | Sequential query of multiple data providers in Clay until valid data is found, achieving 80%+ match rates |
| Routing Decision Tree | Branching logic that determines lead path based on tier, timing (business hours vs off-hours), and Calendly booking status |
| Proof of Data | Hyperlinked context from Clay enrichment (job postings, news articles, technographic sources) that arms reps with verification |
| Deduplication / Lookup | Check if account already exists in CRM (from Market Map) before spending credits on enrichment |
| Copywriting Boundary | LeanScale provides sequence structure (steps, methods, triggers); customer writes all actual copy/messaging |

#### Common Gotchas

- Lead lifecycle not clean -> If MQL definitions are unclear or lifecycle stages have tech debt, pause this project and fix lifecycle first. Discovery reveals this when customer cannot answer "what makes someone an MQL?"
- Copywriting scope creep -> Customer expects LeanScale to write automated message copy. Set expectation in kickoff: we build structure, you write messaging. Writing copy with AI dragged projects into brand/style decisions that derailed timelines.
- Enrichment credit overruns -> Enriching every lead without pre-filtering wastes Clay credits. Always implement lookup step (check CRM for existing account) and pre-enrichment filters (skip Gmail, below-threshold companies) before waterfall.
- Webhook 50k limit -> Clay webhook tables have a hard 50,000 submission limit that persists even after deleting rows. Plan for table rotation; create new webhook and update workflows when approaching limit.
- Timing race conditions -> Routing must fire AFTER enrichment data lands in CRM. If routing triggers before tier is populated, leads route incorrectly. Validate sequence order in CRM workflow builder.
- Off-hours gap -> Without automated acknowledgment, off-hours leads can wait 10-13 hours. Always send automated response within 5 minutes regardless of human follow-up plans.
- Existing customer gets prospecting sequence -> Add exclusion criteria: if contact lifecycle = Customer or associated with closed-won opportunity, skip sequence and route to CSM/AM.

#### Methodology Options

| Option | When to Use | Complexity | Hours |
|--------|-------------|-----------|-------|
| Post-Market Map | Market Map exists with tiering and enrichment -- duplicate Clay table, add routing | Low-Medium | 15-20 |
| Standalone (No Market Map) | No prior Market Map -- build ICP criteria, enrichment waterfall, scoring from scratch | Medium-High | 20-25 |
| Calendly-First (Minimal) | Just want basic "didn't book" follow-up after Calendly popup | Low | 5-10 |
| Hybrid Human/Automated | Want humans for business hours, automation for off-hours, with tier-based branching | Medium-High | 20-25 |

---

## Phase 1: Strategy

> **Goal:** Get stakeholder sign-off on what channels to enrich, how to define MQLs, and how to route leads.
>
> **Output:** Definition Alignment Document + approved channel map + approved routing decision tree.

### 1a. Pre-Kickoff

> Two parallel tracks run after the deal closes and before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video | Explain automated inbound enrichment and routing -- what it is, why speed-to-lead matters, what to expect | Video (5-10 min) |
| Definition Alignment Document | Pre-filled with recommended MQL criteria, tier definitions, speed-to-lead SLAs -- customer reviews with leadership | Google Doc |
| Intake form | Capture current inbound channels, volume, CRM type, tool stack, MQL status, team structure, coverage hours | Google Form or Doc |
| CRM admin access request | We need admin access to audit existing lead lifecycle, routing rules, and inbound workflows | Email |

**Completion tracking:** Architect follows up. Do not cancel kickoff if incomplete -- push hard after, but proceed with what is available.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Check if Market Map exists -- if yes, pull Clay table, tiering, ICP criteria | Foundation decision: duplicate vs build from scratch |
| 2 | Audit CRM for existing lead lifecycle stages, routing rules, inbound workflows | Current state assessment |
| 3 | Identify all active inbound channels from CRM data and intake form | Raw channel list |
| 4 | Draft v0 channel map with intent tiers (High/Medium/Low) | Channel map v0 with ASSUMED tier assignments |
| 5 | Draft v0 routing decision tree (T1/T2/T3 paths, timing logic, exceptions) | Routing tree v0 with ASSUMED logic |
| 6 | Draft Definition Alignment Document with recommended MQL and tier definitions | DAD v0 ready for kickoff review |

**Critical:** Mark everything as ASSUMED. The kickoff call validates.

#### Stakeholder Alignment Document

> Get stakeholder sign-off on terms BEFORE building anything.

| Term | Our Definition | Internally Approved? |
|------|----------------|----------------------|
| MQL (Marketing Qualified Lead) | Lead that meets ICP fit criteria + demonstrated intent via behavioral signals | Yes / No |
| T1 (High Intent) | Demo request, "Talk to Sales," trial signup -- requires <5 min response | Yes / No |
| T2 (Medium Intent) | Pricing page engagement, multiple content downloads -- same business day | Yes / No |
| T3 (Low Intent) | Single white paper, newsletter signup -- 24-48 hr nurture | Yes / No |
| Speed-to-Lead SLA | Target time from form submission to first response: <5 min for T1 | Yes / No |
| Routing Model | Fully automated / Human follow-up / Hybrid (based on tier + timing) | Yes / No |
| Copywriting Ownership | Customer writes all sequence messaging; LeanScale provides structure only | Yes / No |

**Instructions to customer:**

> Review each definition with your RevOps and Sales leadership. Check "Yes" when approved. We cannot proceed to engineering until routing logic and MQL criteria are aligned.

---

### 1b. Kickoff Call

> **Purpose:** Present v0 channel map and routing tree. Customer reacts, validates, and corrects. We leave with information to build v1.

#### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through v0 channel map | "Here are all the inbound channels we found -- validate this list" |
| 15-30 | Review intent tier assignments | ASSUMED tiers -> CONFIRMED or corrected per channel |
| 30-45 | Routing decision tree review | Walk through T1/T2/T3 paths, timing logic, Calendly booking flow |
| 45-55 | Definition alignment | Review DAD -- MQL criteria, tier definitions, speed-to-lead SLA |
| 55-65 | Human vs automated vs hybrid | Confirm approach: which tiers get humans, which get automation |
| 65-75 | Coverage and timing | Business hours, timezone coverage, high-value exception rules |
| 75-90 | Next steps | Assign homework (copy ownership, tool access), schedule refinement |

#### What We Bring

- v0 channel map with ASSUMED intent tiers
- v0 routing decision tree with ASSUMED logic
- Definition Alignment Document pre-filled with recommendations
- Questions list: MQL status, coverage hours, sequence preferences, tool stack confirmation

#### What We Leave With

- Feedback on v0 channel map and routing tree (info needed for v1)
- Confirmed or revised tier definitions
- Human/automated/hybrid decision
- Coverage hours and exception rules confirmed
- Clear homework: customer confirms copy ownership, provides access to sequencing tool

---

### 1c. Alignment Loop & Strategic Meeting Cadence

> **Purpose:** Iterate on channel map, routing tree, and definitions until sign-off.

#### The Pattern

```
Kickoff Call (gather info, present v0)
    |
Architect updates channel map + routing tree -> v1
    |
Meeting 2 (present v1, finalize routing logic) -> v2
    |
Meeting 3 (sign-off)
```

#### Meeting Sequence

| Meeting Type | Focus | Stakeholder |
|--------------|-------|-------------|
| Kickoff (1b) | Present v0, validate channels and tiers, MQL alignment | RevOps Manager, SDR Leadership |
| Refinement (1c) | Finalize routing logic, human/auto split, sequencing decisions | RevOps Manager, Head of RevOps |
| Sign-Off (1d) | Final walkthrough, stakeholder approval | Head of RevOps, VP Sales |

#### Before Each Meeting

1. Update channel map and routing tree with feedback from previous meeting
2. Track what moved from ASSUMED to CONFIRMED
3. Prepare questions for remaining open items

#### During Each Meeting

1. Walk through current version
2. Capture corrections and refinements
3. Validate what is now CONFIRMED
4. Identify remaining ASSUMED items

#### After Each Meeting

1. Update all working documents
2. Track ASSUMED to CONFIRMED progress
3. Prepare next version

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 1-2 days |
| Kickoff call | Day 1 of engagement |
| Refinement meetings | 1-2 weeks (depends on stakeholder access) |
| Final review + sign-off | When all routing logic CONFIRMED |

---

### 1d. Strategic Sign-Off

> **Purpose:** Confirm everything before engineering begins.

#### Validation Checkpoint

- Definition Alignment Document signed off by RevOps and Sales leadership
- Channel map finalized -- all inbound sources documented with intent tiers
- MQL criteria defined and approved
- Routing decision tree approved -- T1/T2/T3 paths, timing logic, exceptions
- Human vs automated vs hybrid approach confirmed
- Sequencing tool and message origination source confirmed
- Coverage hours and timezone logic confirmed
- Copywriting ownership confirmed (customer writes messaging)
- All critical inputs CONFIRMED (vs ASSUMED)
- No blockers for engineering

#### Decision Point

- **Proceed to Engineering** -- routing logic approved, tools confirmed, ready to build
- This project type does NOT have a natural exit after Phase 1 -- strategy without engineering leaves the customer with documentation but no operational system

---

## Phase 2: Engineering

> **Goal:** Build and test the automated inbound system: Clay enrichment, webhooks, CRM routing, sequences.
>
> **Output:** Working system that enriches, routes, and sequences inbound leads -- tested and customer-approved.

| Project Variant | Engineering Weight | Notes |
|-----------------|-------------------|-------|
| Post-Market Map | Medium (40-50%) | Duplicate Clay table, add webhook + routing. 15-20 hours. |
| Standalone | Heavy (60-70%) | Build ICP, enrichment waterfall, scoring from scratch. 20-25 hours. |

### Sub-Phases

```
2a Tech Spec -> 2b Engineering Handoff -> 2c Build -> 2d Test
```

---

### 2a. Tech Spec

> **Purpose:** Translate approved strategic package into technical specifications for building.

**Input:** Signed-off channel map, routing decision tree, MQL criteria, tier definitions, tool selections

**What happens:**

1. Architect translates strategic routing logic into CRM workflow specifications
2. Architect maps approved tier definitions to Clay enrichment and scoring configuration
3. Architect documents webhook architecture: CRM -> middleware -> Clay -> CRM round-trip

**Output:** Draft tech spec containing:

- **Clay table design:** Field structure (lead fields, enrichment output, tier assignment, routing decision, timestamps), webhook receiver configuration, lookup step logic (check CRM for existing account), enrichment waterfall provider sequence
- **Webhook architecture:** CRM trigger type (contact created, company created, or both), middleware choice (n8n, Zapier, or HubSpot Ops Hub), payload format, retry logic
- **CRM field mapping:** Lead Tier (T1/T2/T3), Lead Score / ICP Fit Score, enriched firmographic fields, routing assignment field, sequence enrollment triggers
- **Routing workflow logic:** IF/THEN branches per tier and timing, round robin or territory assignment rules, unworked lead rerouting threshold (e.g., 30 minutes), high-value exception Slack alerts
- **Sequence structure:** Number of steps per tier, cadence (Day 0, Day 2, Day 5), methods (email, LinkedIn, phone), branching paths ("didn't book" flow, engagement-based escalation)
- **Build sequence:** What to build first (Clay table -> webhook -> routing -> sequences)

**Post-Market Map shortcut:** If Market Map exists, tech spec references existing Clay table structure and tiering logic. Primary additions: webhook receiver, lookup step, routing workflows, sequence enrollment.

---

### 2b. Engineering Handoff

> **Purpose:** Review tech specs with engineer before building.

**Who attends:** Architect + Engineer

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through specs | Architect explains strategic context: why this routing logic, why these tiers |
| 15-30 | Engineer questions | Clay configuration approach, webhook architecture, CRM workflow risks |
| 30-45 | Refine and approve | Adjust specs, confirm build sequence, flag dependencies |

**What Architect brings:**

- Strategic package (channel map, routing tree, Definition Alignment Doc)
- Draft tech spec (from 2a)
- Questions: anything unclear about Market Map reuse, middleware choice, or CRM workflow sequencing

**What engineer leaves with:**

- Approved tech spec
- Clear build sequence: Clay table first, then webhook, then routing workflows, then sequences
- Known risks: webhook 50k limit, timing race conditions, personal email handling

---

### 2c. Build (Configure)

> **Purpose:** Build the automated inbound system in Clay, CRM, and sequencing tools.

**Input:** Approved tech spec from 2b

**Build Components:**

#### Component 1: Clay Enrichment Table

- **If Market Map exists:** Duplicate existing Clay table. Reuse enrichment waterfall, ICP criteria, and scoring logic. Add webhook receiver column and lookup step.
- **If standalone:** Create new Clay table with: lead/contact fields, enrichment output fields, tier assignment field, routing decision field, timestamp fields.
- Configure lookup step: take incoming lead's company domain, query CRM for existing account. If found, pull existing tier (skip account-level enrichment, save credits). If not found, proceed to full enrichment.
- Configure pre-enrichment filters: skip personal emails (@gmail, @yahoo), skip companies below size threshold, skip outside-target geographies.
- Configure enrichment waterfall: order providers by cost (low-credit first). For account level: firmographics, technographics, tier assignment. For contact level: name, title, LinkedIn, seniority.
- Configure tier scoring logic (if standalone): ICP fit criteria mapped to T1/T2/T3 based on approved definitions.
- Add proof of data: hyperlinked context (job postings, news, technographic sources) for rep research.
- Configure CRM write-back: push enriched data to CRM fields (Lead Tier, ICP Fit Score, firmographics, routing assignment).

#### Component 2: Webhook Configuration

- Set up CRM trigger: new contact created (or both contact + company for HubSpot native matching).
- Configure middleware: HubSpot Ops Hub (native webhook, $800+/mo) OR n8n/Zapier (cost-effective alternative).
- Flow: CRM form submission -> CRM workflow -> middleware webhook -> Clay table.
- Implement retry logic with exponential backoff in middleware for Clay outages.
- Validate payload format (application/json) and size (<100KB).
- Test round-trip: CRM -> Clay -> CRM in <60 seconds.

#### Component 3: CRM Routing Workflows

- Build routing workflows implementing approved decision tree:
  - IF Calendly booked -> send automated thank you + context sharing
  - IF T1 AND business hours -> assign to human (round robin or territory)
  - IF T1 AND off-hours -> send automated response + queue for morning + optional Slack alert
  - IF T1 AND high-value exception (Fortune 500 on watch list) -> Slack alert immediately regardless of timing
  - IF T2 -> enroll in automated nurture sequence
  - IF T3 -> add to hold list (no active prospecting)
- Configure lead-to-account matching (domain-based or LeanData).
- Configure unworked lead rerouting: if no response within threshold (e.g., 30 min), reassign.
- Set up Slack/email alerts for high-priority leads with enrichment context in notification.

#### Component 4: Sequence Configuration

- Configure sequences in approved sequencing tool (HubSpot, Outreach, Amplemarket, Salesloft).
- Build sequence structure per approved spec (steps, timing, methods) -- customer provides copy.
- Build branching paths: "didn't book" flow (Calendly shown but not booked -> follow-up sequence), engagement-based escalation (opened but no reply -> nudge), high-value account low engagement -> escalate to human.
- Configure enrollment triggers from CRM routing workflows.
- Configure exclusion rules: existing customers, active opportunities, recent sequence enrollment (<30 days), competitor domains.
- Configure deduplication: same person multiple form fills within 24 hours -> don't re-enroll, aggregate signals instead.

**Build tracking:**

- Component 1: Clay table with webhook receiver, lookup, enrichment waterfall, tier scoring, CRM write-back
- Component 2: Webhook middleware configured, round-trip validated <60 seconds
- Component 3: CRM routing workflows active (all tier/timing branches)
- Component 4: Sequences configured with branching logic and exclusion rules

---

### 2d. QA / Test + Sign-Off

> **Purpose:** Verify the entire automated inbound flow works end-to-end before going live.

**Full Flow Test Checklist:**

- Submit test form on each inbound channel
- Verify webhook fires to Clay (check Clay table for new row)
- Verify lookup step: test with existing Market Map account (should pull tier, skip enrichment) and net-new account (should proceed to enrichment)
- Verify enrichment completes and populates CRM fields (tier, firmographics, routing assignment)
- Verify routing assigns correctly: T1 during business hours -> human, T1 off-hours -> automated + queue, T2 -> nurture, T3 -> hold
- Verify sequence enrollment fires correctly
- Verify timing logic (business hours vs off-hours routing)
- Verify high-value exception routing (Slack alert fires)
- Verify unworked lead rerouting (if no response in 30 min -> reassign)

**Speed Validation:**

| Stage | Target |
|-------|--------|
| Form submit to enrichment complete | <60 seconds |
| Enrichment to routing assignment | <30 seconds |
| Total time to first response | <5 minutes |

**Edge Case Tests:**

- Personal email (Gmail) -> pre-filter prevents enrichment waste, routes to lower-tier or manual review
- Existing customer -> exclusion rule fires, routes to CSM/AM instead of prospecting sequence
- Existing active opportunity -> routes to opportunity owner, not round robin
- Duplicate lead (same person, second form fill within 24 hours) -> deduplication prevents re-enrollment
- High-value exception (Fortune 500 off-hours) -> Slack alert fires immediately
- Competitor domain -> flagged and skipped
- Bot/spam submission -> validation rules prevent webhook fire or enrichment

**Customer Testing:**

- Walk customer (RevOps Manager) through live test lead flowing through the system
- Have them submit test forms and verify routing
- Capture feedback, fix issues

**Engineering Sign-Off Checkpoint:**

- Built system matches tech spec
- All full-flow tests passing
- All edge case tests passing
- Speed targets met (<5 min end-to-end)
- Customer has tested and approved
- Clay credit usage within expected budget
- Ready for enablement

---

## Phase 3: Enablement

> **Goal:** RevOps, SDR/BDR leadership, and sales reps can operate and monitor the system independently.
>
> **Output:** Trained team with documentation, stabilized system after 2-week hypercare.

### Sub-Phases

```
3a Training Prep -> 3b Training Sessions -> 3c Hypercare -> 3d Enablement Sign-Off
```

---

### 3a. Training Prep

> **Purpose:** Create training materials from strategic and technical documentation.

**Input:** Strategic package (channel map, routing tree, DAD) + tech spec + built system

**Output:** Training package containing:

- Video scripts for end-to-end flow walkthrough (form -> enrichment -> routing -> sequence)
- Video script for Clay table and webhook monitoring
- Written troubleshooting guide: webhook not firing, enrichment failures, routing misassignment, sequence issues, record limit management
- Written routing decision tree reference (exported from Lucidchart)
- Written sequence structure reference (steps, timing, methods)
- FAQ draft based on common questions: "Why did this lead go to automation instead of me?", "How do I know if enrichment is working?", "What happens if Clay goes down?"

---

### 3b. Training Sessions

> **Purpose:** Transfer knowledge to customer team so they can operate and monitor independently.

**Three training sessions by audience:**

| Session | Audience | Focus | Duration |
|---------|----------|-------|----------|
| Technical | RevOps Manager | Webhook monitoring and task history logs, Clay enrichment troubleshooting, routing rule modification, adding new inbound channels, sequence enrollment trigger adjustment, 50k webhook table limit management | 60 min |
| Operational | SDR/BDR Leadership | Sequence performance metrics (open rates, reply rates, meetings), manual follow-up queue prioritization, handling edge cases (personal emails, leads that escape automation), copy/messaging updates based on response data | 45 min |
| End User | Sales Reps | What automated sequences are running (steps, timing), when leads route to them vs automation (tier + timing logic), what enrichment context is available in CRM, how to use proof of data hyperlinks for personalization | 30 min |

**Training delivery:**

1. Schedule sessions with appropriate stakeholders
2. Deliver training live
3. Record video walkthroughs for future reference and onboarding new team members
4. Answer questions, note gaps for FAQ updates

**Output:**

- Trained stakeholders at all three levels
- Video recordings for each session
- Updated FAQ based on questions surfaced

---

### 3c. Hypercare

> **Purpose:** Intensive post-launch support to stabilize the system and catch issues with real lead volume.

**Duration:** 2 weeks

**What happens:**

- Weekly 30-minute office hours slot for RevOps Manager to surface issues
- Quick response to webhook failures, enrichment issues, routing misassignment
- Bug triage and fixes
- Monitor first 10-20 live leads manually to validate system behavior
- Track speed-to-lead metrics against SLA targets

**Monitoring during hypercare:**

- Webhook success rate (target: 100% of form fills fire)
- Enrichment completion rate (target: 80%+ match rate for unknown accounts)
- Routing assignment accuracy (spot-check: right tier, right rep)
- Sequence enrollment rate
- Speed-to-lead (target: <5 min for T1)
- Clay credit usage (within budget expectations)

**When to extend:** If webhook reliability is below 95%, or routing accuracy is below 90%, or significant edge cases are surfacing -- extend hypercare by 1 week.

**Output:** Stabilized system, no critical issues outstanding, confidence in production readiness.

---

### 3d. Enablement Sign-Off

> **Purpose:** Confirm customer can operate the system independently.

**Validation checkpoint:**

- All three training sessions delivered (Technical, Operational, End User)
- Training video recordings provided
- Written troubleshooting guide and FAQ delivered
- Hypercare period complete (2 weeks)
- No critical issues outstanding
- RevOps Manager can monitor webhooks, troubleshoot enrichment, modify routing rules
- SDR leadership can read sequence metrics and manage follow-up queue
- Sales reps understand when leads come to them and what context is available
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** -- system is stable, team is enabled
- **Extend Hypercare** -- still unstable or training gaps remain

---

## Phase 4: Handoff

> **Goal:** Clean project close with maintenance plan established and retention/expansion path set.
>
> **Output:** Maintenance schedule documented, internal context transferred, customer owns the system, project archived.

**Structure:**

```
4a Maintenance Schedule -> 4b Internal Handoff -> 4c External Handoff -> 4d Project Close
                                                   (LS -> Customer)       (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|----------------------|---------------|
| **Single Project** | Customer owns | 4c (External Handoff) -- customer receives maintenance schedule and runs it themselves |
| **Dedicated (Multi-Project)** | Ongoing team owns | 4b (Internal Handoff) -- ongoing team receives maintenance schedule and runs it for customer |

---

### 4a. Maintenance Schedule

> **Purpose:** Document what needs ongoing attention. B2B data decays at 22-30% per year, with email data decaying at 28% annually. Without maintenance, the system slowly becomes irrelevant.

#### Standard Maintenance Framework

**Weekly Tasks:**

| Weekly Task | What to Check | Red Flag Threshold |
|------------|---------------|-------------------|
| Webhook health | Leads flowing from CRM -> Clay -> back to CRM without failures | Any webhook failure = investigate immediately |
| Sequence performance | Open rates, reply rates, meeting bookings per sequence | Reply rate <2% for 2+ consecutive weeks |
| Speed-to-lead sampling | Sample 10 leads: time from form fill to first response | Any T1 lead >5 min response time |

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|------------|---------------|-------------------|
| Clay credit monitoring | Track enrichment costs per lead, look for runaway enrichments | Credit usage >150% of projected budget |
| Routing accuracy audit | Review 20 random leads to confirm they routed correctly | >10% routing to wrong rep or wrong tier |
| Sequence copy refresh | Update messaging based on response data and A/B results | Open rates declining month-over-month |
| T1 exception review | Check if any T1/high-value leads were missed by automation | Any Fortune 500 or watch-list lead missed |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|------------|---------------|-------------------|
| MQL criteria validation | Are MQL definitions still matching actual buyer behavior? | Revise criteria based on conversion data |
| Enrichment provider optimization | Test if switching providers improves accuracy or reduces costs | Swap provider position in waterfall |
| Decision tree review | Is the human/automated split still correct? Should thresholds change? | Adjust routing logic in CRM workflows |
| New inbound channel integration | Marketing launched new campaigns -- add channels to the flow | Configure new webhook triggers and routing |
| Data refresh cycle | Re-enrich records older than 60-90 days (70.8% of contacts change within 12 months) | Run bulk re-enrichment for stale records |

**After First Sales Cycle (30-90 days post-launch):**

- Conversion analysis by tier: Are T1 leads converting at higher rates than T2/T3? If not, tier definitions may need adjustment.
- Speed-to-lead correlation: Is faster response actually improving conversion? Validate the SLA investment.
- Sequence refinement: Which steps are working? Which should be cut or modified? Data should be sufficient for informed changes.
- Routing refinement: Should more leads go to humans? Or more to automation? Adjust based on conversion outcomes.

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Routing accuracy decline | >15% of leads misrouted for 2+ weeks | Re-engage to audit and fix routing logic |
| Speed-to-lead SLA breach | T1 response time >10 min consistently | Investigate webhook/enrichment bottleneck |
| Clay credit budget exceeded | >200% of projected monthly budget | Tighten pre-enrichment filters, review triggers |
| Webhook table approaching 50k limit | >40,000 submissions in current table | Create new webhook table, update middleware |
| Conversion rate decline | T1 conversion drops >20% from baseline for 2+ months | Scope refinement project |

**Every 6-12 Months:**

- Full enrichment stack audit: Are data providers still the best options? New providers available?
- Routing logic overhaul: Team structure changes, territory changes, new product lines -- any structural shift warrants routing review.
- Sequence strategy refresh: Messaging fatigue sets in. Review entire sequence library for staleness.
- Clay credit renegotiation: Usage patterns are now clear -- optimize credit allocation.

---

### 4b. Internal Handoff

> **Purpose:** Transfer context so the ongoing team can manage the relationship.

**What the ongoing team needs to know:**

- What was built: Clay enrichment table, webhook configuration, CRM routing workflows, automated sequences
- Approach used: Post-Market Map (duplicate table) or Standalone (built from scratch)
- Customer context: Which stakeholders own what (RevOps Manager = technical owner, SDR Leadership = sequence performance, VP Sales = outcome sponsor)
- MQL and tier definitions in use
- Common issues: webhook 50k limit, timing race conditions, personal email handling
- **Maintenance schedule** (if Dedicated engagement -- ongoing team runs this)

**Escalation guidelines:**

| Issue Type | Who Handles | Analogy |
|------------|-------------|---------|
| Sequence copy updates, minor threshold tweaks, adding a rep to round robin | Ongoing team ("tile that broke") | General contractor |
| New inbound channel addition, routing logic restructure, MQL criteria changes, Clay table migration | Specialist ("anything with electrical") | Specialist tradesperson |

**For Dedicated engagements:** The ongoing team also receives the maintenance schedule (4a) and becomes responsible for executing weekly, monthly, and quarterly tasks. The specialist walks them through each maintenance task before handoff.

---

### 4c. External Handoff (LeanScale -> Customer)

> **Purpose:** Formal project completion with customer.

**Final project meeting (60 min):**

- Live demo: lead flowing through enrichment -> routing -> sequence enrollment
- Walk through routing decision tree (Lucidchart) as delivered documentation
- Walk through maintenance schedule in detail
- Confirm nothing outstanding
- Answer final questions
- Make it explicit: "Project complete"
- **For Single Project engagements:** Walk customer through entire maintenance schedule. Record a video walkthrough. Make sure they understand what to check, how often, and when to call us back.

**Documentation package:**

- All training video recordings (flow walkthrough, Clay monitoring, session recordings)
- Routing decision tree (Lucidchart export)
- Troubleshooting guide
- Definition Alignment Document (final version)
- FAQ document
- Sequence structure reference
- Support contact info
- **Maintenance Schedule** (for Single Project engagements -- this becomes the customer's responsibility)

**Output:** Customer owns the system. Project formally complete.

---

### 4d. Project Close

> **Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved to proper location
- Handoff documentation complete
- Project status updated in tracking system
- Time/billing finalized

#### Internal Debrief (Optional but Recommended)

- What went well?
- What would we do differently?
- Any learnings to feed back into playbook? (new edge cases, tool discoveries, process improvements)

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| **Single Project** | Upsell -> Downsell -> Retry |
| **Multi-Project (Dedicated)** | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (retainer for ongoing inbound optimization, sequence A/B testing, routing refinement)
   | if no
2. Downsell: Lead Routing Optimization, Automated Outbound, Signal-Based Workflows, or Lead Lifecycle Cleanup
   | if yes
3. Retry retainer at end of next project cycle
```

**Script:**

> "Now that your automated inbound system is live, there are two ways we can continue working together. Option 1: We set you up on managed services where we handle ongoing optimization -- monitoring speed-to-lead, refining routing, A/B testing sequences, managing Clay credits. Option 2: If there's a specific adjacent project like automated outbound or signal-based workflows, we can scope that out. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

> "On [date ~quarter out], we'll review how the automated inbound system is performing -- conversion rates by tier, speed-to-lead metrics, sequence performance -- and see if any adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull speed-to-lead data, conversion by tier, sequence performance |
| 3. Decide ownership | Can the ongoing team handle this check-in, or need a specialist? |
| 4. Prep materials | If specialist needed, brief them. If ongoing team, prep talking points. |

**At the refinement check-in:**

- Review speed-to-lead metrics against SLA targets
- Review conversion rates by tier (T1 vs T2 vs T3)
- Review sequence performance (open, reply, meeting rates)
- Identify any adjustments needed
- If minor: ongoing team handles tweaks (threshold adjustments, adding reps to round robin)
- If major: Scope new project (routing overhaul, new channel architecture, MQL redefinition)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Channel map with intent tier assignments (all inbound sources documented)
- Routing decision tree (Lucidchart -- T1/T2/T3 paths, timing logic, exceptions)
- Definition Alignment Document (MQL criteria, tier definitions, speed-to-lead SLA)
- Sequence structure documentation (steps, timing, methods, branching paths)

**Technical Deliverables:**

- Clay enrichment table with webhook receiver, lookup step, enrichment waterfall, tier scoring, CRM write-back
- CRM routing workflows (tier-based assignment, timing logic, round robin or territory rules, unworked lead rerouting, high-value exception alerts)
- Configured sequences in sales engagement platform (enrollment triggers, branching logic, exclusion rules, deduplication)
- Webhook middleware configuration (n8n/Zapier or HubSpot Ops Hub)

**Documentation Package:**

- Training video recordings (flow walkthrough, Clay monitoring, per-audience sessions)
- Written troubleshooting guide (webhook issues, enrichment failures, routing misassignment)
- FAQ document
- Definition Alignment Document (final version)
- Maintenance Schedule (weekly/monthly/quarterly cadences)
- Routing decision tree reference (Lucidchart export)

---

## Appendix

### What This Document Is

This is the implementation playbook -- the step-by-step execution guide for delivering Automated Inbound projects from first contact to project close. It is the third file in a 3-file playbook structure: Overview (what the project IS), Methodology (how we think about it), and Implementation (what to do).

### What Each Phase Produces

| Phase | Output | Gate Criteria |
|-------|--------|---------------|
| **Phase 1: Strategy** | Signed-off strategic package (Definition Alignment Doc + deliverables) | Customer stakeholders have approved definitions and strategic asset |
| **Phase 2: Engineering** | Built and tested system | System matches tech spec, all tests pass, customer has approved |
| **Phase 3: Enablement** | Trained team with documentation | All training delivered, hypercare complete, team can operate independently |
| **Phase 4: Handoff** | Independent customer + archived project | Internal/external handoffs complete, maintenance plan in place, project closed |

### How to Adapt Per Project Type

Not every project weighs each phase equally. Before starting, determine the project's profile:

| Project Profile | Strategy Weight | Engineering Weight | Enablement Weight | Example Projects |
|-----------------|-----------------|-------------------|-------------------|------------------|
| **Strategic-heavy** | 60-80% | 10-20% | 10-20% | Growth Model, GTM Strategy |
| **Engineering-heavy** | 10-20% | 60-80% | 10-20% | CRM Migration, Data Pipeline |
| **Enablement-heavy** | 20-30% | 20-30% | 40-50% | Quote-to-Cash, Process Rollout |
| **Balanced** | 30-40% | 30-40% | 20-30% | Attribution, Lead Scoring |

**Adaptation rules:**

- **Light phases** can compress sub-phases (e.g., a strategic-only project may skip Phase 2 entirely)
- **Heavy phases** expand with more sub-steps, more meetings, more detail
- **Phase 4 always applies** -- every project needs handoff, but the maintenance schedule complexity varies
- Mark phases as SKIP or LIGHT in the One-Pager if they don't fully apply