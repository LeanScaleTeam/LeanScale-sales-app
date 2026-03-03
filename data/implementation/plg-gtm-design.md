# PLG GTM Design — Implementation

## Project One-Pager

### PLG GTM Design One-Pager

#### Project Type

- **Category:** Balanced (Strategy-heavy with significant Engineering)
- **Primary Deliverable:** Complete PLG go-to-market design with mapped customer journeys, system architecture, pricing/billing integration plan, cross-functional alignment documentation, and PQL scoring model

##### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Heavy | 6-8 stakeholder workshops, cross-functional alignment, pricing design |
| 2. Engineering | Yes | Heavy | Data pipeline, CRM config, billing integration, PQL scoring |
| 3. Enablement | Yes | Medium | Training per function (Sales, CS, Marketing, RevOps, Finance) |
| 4. Handoff | Yes | Medium | Internal + External, ongoing optimization cadence |

#### Phase Overview

Full 4-phase execution. Strategy is the heaviest — 6-8 workshops with stakeholders across Sales, Marketing, Product, CS, Engineering, and Finance to design the complete PLG motion before building.

Engineering is the second-heaviest phase — requires product analytics instrumentation, data pipeline configuration, CRM customization, billing system setup, and PQL scoring model deployment.

Phase 1 can be a natural exit point if only the PLG design (strategic deliverable) is needed without implementation. Confirm at sign-off whether Phase 2+ proceeds.

---

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Watch PLG orientation video walkthrough (what PLG means, why it differs from sales-led, what decisions they need to make)
- Complete PLG readiness intake form (current GTM motion, product self-serve capability, existing tools, growth targets)
- Review and approve Definition Alignment Document (PQL, activation, free-to-paid conversion, expansion revenue definitions)
- Provide access to CRM, product analytics (if any), billing system, and marketing automation
- Get VP Sales, VP Marketing, VP Product, VP CS, and Finance lead availability for discovery sessions

##### Track B: Architect Prep

- Pull CRM data to assess current lead/account volume and GTM motion structure
- Audit existing system landscape (CRM, marketing automation, CS platform, billing)
- Research competitor PLG motions for benchmarking
- Draft v0 PLG architecture diagram based on intake form and system audit
- Prepare discovery session question sets tailored per stakeholder function

---

#### Refinement Loop (1b > 1c > 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present v0 PLG architecture, validate assumptions, review definitions | All key stakeholders | Info for v1 |
| Growth Model Workshop | 1c | Finalize PLG metrics, targets, and growth model alignment | CRO/VP Rev, Finance | PLG metrics framework v1 |
| Pricing Workshop | 1c | Design pricing tiers, free tier, upgrade triggers | VP Product, Finance, VP Sales | Pricing model v1 |
| Journey Mapping | 1c | Map pre-acquisition, onboarding, activation, conversion journeys | VP Marketing, VP Product | Customer journey maps v1 |
| System Architecture | 1c | Design target state data pipeline, CRM config, billing integration | RevOps, VP Product, Eng Lead | System architecture v1 |
| CS/Support Design | 1c | Design tiered support model, CS engagement model, billing ops | VP CS, Support Lead, Finance | CS/Support/Billing ops model v1 |
| Cross-Functional | 1c | Align Marketing, Sales, Finance on PLG handoffs and compensation | All department leads | Cross-functional alignment doc v1 |
| Sign-Off | 1d | Final review of complete PLG design package | All stakeholders | Final strategic package |

---

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held — v0 presented, assumptions validated
- 1c. All workshops complete (Growth Model, Pricing, Journey, Architecture, CS/Support, Cross-Functional)
- 1d. Strategic sign-off obtained from all stakeholder groups

##### Phase 2: Engineering

- 2a. Tech spec created from strategic package
- 2b. Engineering handoff meeting held with implementation team
- 2c. Build complete (product analytics, data pipeline, CRM, billing, PQL scoring, dashboards)
- 2d. QA/Test + customer sign-off on all systems

##### Phase 3: Enablement

- 3a. Training materials prepped per function
- 3b. Training sessions delivered (Sales, Marketing, CS, RevOps, Finance)
- 3c. Hypercare period complete (4-6 weeks post-launch)
- 3d. Enablement sign-off

##### Phase 4: Handoff

- 4a. Maintenance schedule documented and handed off
- 4b. Internal handoff (SME > Architect) complete
- 4c. External handoff (team > customer) complete
- 4d. Project closed and archived

---

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|---------------|
| PLG Readiness Intake Form | Capture current state, goals, constraints | All fields filled, validated in kickoff |
| Growth Model PLG Targets | Define PLG metrics and targets | Metrics tied to EOY bookings, all teams aligned |
| Pricing Model Worksheet | Design free tier, paid tiers, upgrade paths | Finance and Product approved |
| Customer Journey Maps | Map all touchpoints from acquisition to expansion | All decision points and outcomes documented |
| System Architecture Diagram | Map current state, target state, gap analysis | Gaps prioritized, integration plan agreed |
| PQL Scoring Model Definition | Define scoring criteria, thresholds, handoff triggers | Sales and Product aligned on criteria |
| CS/Support/Billing Operations Doc | Design tiered support, CS engagement, billing ops | SLAs set, ownership defined |
| Cross-Functional Alignment Doc | Capture alignment decisions across functions | All department leads signed off |
| Data Dictionary | Standardize metric definitions across all teams | All teams approved definitions |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| PLG GTM Design Package | All working documents | Board presentation, internal alignment |
| Customer Journey Mermaid Diagrams | Journey Maps | Product and Engineering reference |
| System Architecture Blueprint | Architecture Diagram + Gap Analysis | Engineering implementation planning |
| PQL Scoring Model Documentation | PQL Scoring Model Definition | Sales enablement, RevOps configuration |
| Pricing & Billing Requirements Doc | Pricing Model + Billing Ops | Finance approval, billing system configuration |
| Definition Alignment Document | Data Dictionary + team workshops | Cross-functional reference standard |

---

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Executive | CRO, VP Product, VP Finance | PLG motion overview, metrics interpretation, board reporting | 45m |
| Sales | VP Sales, AEs, SDRs | PQL handoff, when to engage vs let self-serve, compensation | 60m |
| Marketing | VP Marketing, Demand Gen | Attribution, PQL nurturing, campaign integration with PLG data | 60m |
| CS/Support | VP CS, CSMs, Support Lead | Health scoring, engagement triggers, tiered support operations | 60m |
| RevOps/Admin | RevOps Manager, CRM Admin | System administration, data pipeline monitoring, troubleshoot | 90m |
| Finance | Controller, FP&A | Revenue recognition, billing ops, ERP integration monitoring | 45m |

##### Hypercare

- Applies: Yes
- Duration: 4-6 weeks (PLG motions require extended monitoring due to cross-functional dependencies)
- Office Hours: Yes — Weekly 45-min slot for first 4 weeks, bi-weekly for weeks 5-6

##### Training Assets to Create

- Video walkthrough: PLG customer journey (all teams)
- Video walkthrough: PQL scoring and handoff process (Sales + RevOps)
- Video walkthrough: Dashboard and reporting navigation (all teams)
- Video walkthrough: Billing operations and self-serve flows (Finance + RevOps)
- Doc: CRM field mapping and PLG object reference (RevOps)
- Doc: System integration monitoring checklist (RevOps)
- Doc: Tiered support playbook (CS/Support)
- Doc: PQL engagement runbook (Sales)

---

#### Handoff & Retention

##### Internal Handoff (SME > Architect)

- Key context for Architect: PLG motion spans 6+ functions — Architect must understand the handoff triggers between self-serve and sales-assisted, the PQL scoring thresholds, and which systems feed which dashboards
- Escalation trigger: Any changes to PQL scoring logic, pricing tier structure, billing integration, or data pipeline architecture require SME re-engagement

##### External Handoff (Team > Customer)

- Final meeting agenda: Walk through PLG design package, demonstrate all dashboards, confirm optimization cadence, answer final questions
- Documentation package: All video walkthrough recordings, written guides, Definition Alignment Document, PQL model documentation, maintenance schedule, data dictionary

##### Maintenance Schedule

- Monthly: PLG funnel metrics review, PQL conversion audit, data quality check
- Quarterly: Full PQL model recalibration, pricing performance review, support tier utilization
- Who owns: Single project = customer RevOps owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services (ongoing PLG optimization + PQL model tuning) > if no > Downsell: Adjacent project (Lead Scoring Model Product-Led, Customer Health Model) > Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~90 days post-launch (first full business cycle)
- Internal prep trigger: 2 weeks before
- Decision: Architect handles metric reviews / SME needed for PQL recalibration or pricing changes

---

#### Key Assets

| Asset | When Used |
|-------|-----------|
| PLG Readiness Intake Form | 1a Pre-Kickoff |
| Definition Alignment Template | 1a Pre-Kickoff |
| PLG Customer Journey Template | 1c Journey Mapping |
| System Architecture Diagram Tool | 1c Architecture |
| PQL Scoring Model Template | 1c/2a Scoring Design |
| Billing Integration Requirements | 2c Build |
| PLG Training Deck Template | 3a Training Prep |

---

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| Product Qualified Lead (PQL) | A free user or account that has reached specific usage thresholds indicating readiness for paid conversion or sales assist |
| Activation | The moment a user completes the key action(s) that correlate with long-term retention and conversion |
| Free-to-Paid Conversion | A free user or account that upgrades to any paid tier through self-serve checkout or sales-assisted close |
| Expansion Revenue | Additional revenue from existing customers through seat additions, tier upgrades, or usage-based overages |
| Net Revenue Retention (NRR) | (Starting MRR + Expansion - Contraction - Churn) / Starting MRR, measured for PLG cohorts specifically |
| Self-Serve | Any purchase, upgrade, or account action completed without human sales involvement |
| Sales-Assisted | Any deal where a sales rep engages based on PQL signals, deal size thresholds, or enterprise buying signals |
| Tech-Touch | Automated CS engagement through in-app messaging, email sequences, and usage-triggered prompts |
| High-Touch | Human CS engagement reserved for accounts above a defined ARR or expansion potential threshold |

---

#### Common Gotchas

- Treating PLG as a marketing-only initiative > Involve Product, Engineering, Finance, and Sales from Day 1
- Unclear PQL-to-sales handoff criteria > Define explicit thresholds with Sales buy-in before any system build
- Billing system cannot handle hybrid self-serve + enterprise > Conduct billing system assessment during discovery, involve Finance early
- Product usage data not flowing reliably to CRM > Validate data pipeline architecture and quality before building downstream automations
- Teams using different metric definitions (MQL vs PQL vs SQL) > Establish formal data dictionary with sign-off from all teams before implementation
- Scope creep into product development (feature building vs GTM design) > PLG GTM Design scopes the motion, not the product features — redirect feature requests to Product backlog
- Compensation model conflicts when PLG deals overlap with sales territory > Address territory and comp implications in the Sales Alignment Workshop — do not defer this conversation

---

#### Methodology Options

| Option | When to Use | Complexity |
|--------|-------------|-----------|
| PLG-Only (Pure Self-Serve) | Simple product, SMB-focused, low ACV (<$5K), no enterprise motion | Low |
| Hybrid PLG + Sales-Led | Mid-market to enterprise, ACV $5K-$100K+, need both motions | High |
| PLG as Lead Gen for Sales | Complex product, long sales cycle, PLG feeds pipeline not revenue | Medium |

See Methodology for detailed decision frameworks on which PLG approach fits the market, product complexity, and organizational maturity.

---

## Phase 1: Strategy

**Goal:** Get stakeholder sign-off on the complete PLG GTM design — customer journeys, system architecture, pricing model, PQL criteria, CS/Support operations, and cross-functional alignment.

**Output:** Definition Alignment Document + PLG GTM Design Package (signed off by all stakeholder groups).

PLG GTM Design is one of the most stakeholder-intensive strategy phases in this portfolio. Guidance indicates that "91% of B2B SaaS companies now plan to increase PLG investment," but the design work requires alignment across 6+ functions that rarely coordinate at this level. Getting alignment before building prevents the rework cycles that derail most PLG implementations.

### 1a. Pre-Kickoff

Two parallel tracks run after the deal closes and before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| PLG Orientation Video | Explain what PLG means vs sales-led, what decisions they'll make | Video walkthrough (10-15 min) |
| Definition Alignment Document | Get stakeholder sign-off on PQL, activation, conversion terms | Google Doc |
| PLG Readiness Intake Form | Capture current GTM motion, product capability, tools, goals | Google Form or Doc |

The PLG orientation video is critical. Most stakeholders understand "free trial" but not the system-level implications: data pipelines, PQL scoring, billing hybrid, CS tier design, and compensation changes. Educating them before kickoff means they can participate meaningfully rather than asking foundational questions that consume meeting time.

**Completion tracking:** RevOps or PM owns follow-up. Push hard for system access and intake form before kickoff. Definition Alignment Document can be reviewed during kickoff if not completed pre-meeting.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Gather inputs (intake form, system access, competitor PLG research) | Raw data collected, competitor PLG landscape documented |
| 2 | Run PLG System Audit against current tech stack | Current state system map with identified PLG gaps |
| 3 | Draft PLG architecture (product analytics, data pipeline, CRM, billing) | v0 system architecture diagram with all items ASSUMED |
| 4 | Draft customer journey maps (pre-acquisition through expansion) | v0 journey maps showing acquisition, activation, conversion |
| 5 | Prepare stakeholder-specific discovery questions | Question sets for Sales, Marketing, Product, CS, Finance |

**Critical:** Mark everything as ASSUMED. PLG design has more interdependencies than most projects — a pricing decision affects billing architecture, which affects CRM objects, which affects PQL scoring. Each workshop validates and locks down one domain while revealing implications for others.

#### Stakeholder Alignment Document

Get stakeholder sign-off on terms BEFORE building anything. PLG introduces new concepts (PQL, activation, self-serve conversion) that stakeholders will define differently unless explicitly aligned.

| Term | Our Definition | Internally Approved? |
|------|----------------|----------------------|
| Product Qualified Lead (PQL) | A free user or account that reaches specific usage thresholds indicating readiness for conversion or sales assist | \[ \] Yes / \[ \] No |
| Activation | User completes \[specific key actions\] that correlate with long-term retention | \[ \] Yes / \[ \] No |
| Free-to-Paid Conversion | A free user/account upgrades to any paid tier through self-serve or sales-assisted close | \[ \] Yes / \[ \] No |
| Self-Serve Revenue | Revenue from purchases completed without human sales involvement | \[ \] Yes / \[ \] No |
| Sales-Assisted Revenue | Revenue from deals where a sales rep engaged based on PQL signals or deal size | \[ \] Yes / \[ \] No |
| Expansion Revenue | Additional revenue from existing customers (seats, upgrades, usage overage) | \[ \] Yes / \[ \] No |
| Net Revenue Retention (NRR) | (Starting MRR + Expansion - Contraction - Churn) / Starting MRR for PLG cohorts | \[ \] Yes / \[ \] No |
| MQL | Marketing Qualified Lead — meets marketing engagement threshold | \[ \] Yes / \[ \] No |
| SQL | Sales Qualified Lead — meets BANT or similar qualification criteria via sales interaction | \[ \] Yes / \[ \] No |

**Instructions to customer:**

Review each definition with your leadership team. Check "Yes" when approved. The PQL and Activation definitions are the two most critical — they determine how the entire PLG motion routes leads and triggers sales engagement. We cannot build PQL scoring or handoff automation until these are locked.

---

### 1b. Kickoff Call

**Purpose:** Present v0 PLG architecture and journey maps. Customer reacts and corrects, not creates from scratch.

#### Agenda (90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | PLG motion overview | What we're designing, how it differs from current sales-led motion |
| 15-35 | Walk through v0 architecture | System landscape, proposed data flows, identified gaps |
| 35-50 | Walk through v0 journey maps | Pre-acquisition through expansion, proposed PQL triggers |
| 50-65 | Validate assumptions | ASSUMED > CONFIRMED or corrected, surface unknowns |
| 65-80 | Definition alignment | Review Definition Alignment Doc, flag disagreements |
| 80-90 | Workshop schedule + homework | Schedule 6 workshops, assign pre-work per function |

#### What We Bring

- v0 system architecture diagram (from Track B audit)
- v0 customer journey maps (draft)
- Competitor PLG benchmarking (2-3 relevant competitors)
- Question sets per stakeholder function
- Definition Alignment Document (pre-filled with recommendations)

#### What We Leave With

- Corrections and feedback on v0 (info to create v1)
- Confirmed or disputed definitions (clear blockers identified)
- Workshop schedule locked (6 workshops over 2-3 weeks)
- Homework per function (e.g., Product team provides usage data, Finance provides pricing constraints)

---

### 1c. Alignment Loop & Strategic Meeting Cadence

**Purpose:** Iterate through domain-specific workshops until all PLG design components are validated and signed off. Each workshop covers a distinct domain but reveals cross-functional implications.

#### The Pattern

```
Kickoff Call (gather info, validate v0)
    |
    v
Growth Model Workshop --> update PLG metrics framework
    |
    v
Pricing Workshop --> update pricing model, initial PQL criteria
    |
    v
Journey Mapping Workshop --> update customer journey maps
    |
    v
System Architecture Workshop --> update architecture, finalize gap analysis
    |
    v
CS/Support/Billing Workshop --> update operations model
    |
    v
Cross-Functional Alignment --> synthesize all feedback, resolve conflicts
    |
    v
Final Review --> Sign-off on complete PLG GTM Design Package
```

#### Workshop Details

**Workshop 1: Growth Model PLG Targets (60 min)**

- Stakeholders: CRO/VP Revenue, VP Finance
- Focus: PLG-specific metrics (sign-up volume, activation rate, free-to-paid conversion, PQL volume), targets per metric, integration with overall growth model
- Key benchmark: Resources state that "freemium products typically see 3-5% free-to-paid conversion, free trials see 8-12% median. Top-quartile products in the <$5K ACV range reach 24% conversion"
- Output: PLG metrics framework with targets tied to EOY bookings

**Workshop 2: Pricing & Freemium Design (90 min)**

- Stakeholders: VP Product, Finance Lead, VP Sales
- Focus: Freemium vs free trial vs hybrid, tier structure, feature gates, upgrade triggers, enterprise pricing relationship, cannibalization risk assessment
- Key decisions: What goes in the free tier (enough value to hook, not enough to fully satisfy), how many paid self-serve tiers (1-3 optimal), where the enterprise agreement boundary sits
- Output: Pricing model with tier definitions, feature gates, and upgrade paths

**Workshop 3: Customer Journey Mapping (90 min)**

- Stakeholders: VP Marketing, VP Product
- Focus: Pre-acquisition channels, sign-up flow, onboarding to activation, conversion triggers, expansion paths, churn/re-engagement paths, decision trees for all user outcomes
- Key metric: "Time-to-value should stay under 30 minutes for PLG products, with top performers achieving 5-15 minutes"
- Output: Complete customer journey maps (acquisition > activation > conversion > expansion > churn recovery)

**Workshop 4: System & Data Architecture (90 min)**

- Stakeholders: RevOps Lead, VP Product, Engineering Lead
- Focus: Product analytics tool selection (Amplitude, Mixpanel, Heap), data pipeline design (product > warehouse > CRM), PQL scoring model location, reverse ETL requirements, billing platform selection (Stripe, Chargebee, Recurly), CRM customizations for PLG objects
- Key challenge: "Traditional CRMs were not designed for PLG workflows — product usage events, self-serve signups, and PQLs need custom object design"
- Output: Target state system architecture with integration specifications

**Workshop 5: CS, Support & Billing Operations (60 min)**

- Stakeholders: VP CS, Support Lead, Finance Lead
- Focus: Tiered support model (free, self-serve paid, enterprise), SLA definitions, self-serve support resources (knowledge base, chatbot, community), CS engagement model (tech-touch vs high-touch), billing operations ownership, dunning/payment recovery, revenue recognition requirements
- Output: CS/Support/Billing operations model with SLAs and staffing estimates

**Workshop 6: Cross-Functional Alignment (90 min)**

- Stakeholders: All department leads
- Focus: Synthesize feedback from all workshops, resolve conflicts (especially around territory/compensation for PLG deals), finalize attribution model for PLG acquisitions, align on PQL handoff process, confirm data dictionary
- Output: Cross-functional alignment document, resolved conflicts, updated all working documents

#### Before Each Meeting

1. Process previous workshop transcript and notes
2. Update relevant working documents (v\[n-1\] > v\[n\])
3. Prepare questions for next validation round
4. Identify cross-functional implications from previous workshop

#### During Each Meeting

1. Walk through current version of domain-specific deliverable
2. Capture corrections and refinements
3. Validate what's now CONFIRMED
4. Surface cross-functional implications for other workshops

#### After Each Meeting

1. Update deliverables from workshop output
2. Track ASSUMED > CONFIRMED movement
3. Update working documents
4. Flag cross-functional implications for upcoming workshops

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 3-5 days (PLG requires more prep than typical projects) |
| Kickoff call | Day 1 of engagement |
| Workshop loop | 2-4 weeks (6 workshops, depends on stakeholder availability) |
| Final review + sign-off | After all workshops complete and feedback synthesized |

---

### 1d. Strategic Sign-Off

**Purpose:** Confirm all PLG design components are aligned and approved before proceeding to Engineering (or project complete).

#### Validation Checkpoint

- Definition Alignment Document signed off by all stakeholders (especially PQL and Activation)
- PLG metrics and targets aligned with growth model and EOY bookings
- Pricing model approved by Product, Finance, and Sales (cannibalization risk addressed)
- Customer journey maps complete — all paths documented, decision trees mapped
- System architecture approved — tool selections confirmed, integration plan agreed
- PQL scoring criteria defined and approved by Sales and Product
- CS/Support/Billing operations model approved with SLAs and ownership defined
- Cross-functional alignment documented — territory, compensation, attribution resolved
- Data dictionary distributed and approved by all teams
- No blockers for engineering

#### Decision Point

- **Proceed to Engineering** — Customer wants the PLG motion built and implemented
- **Project complete** — Strategic design package is the end product (customer implements internally or with their own engineering resources)

PLG GTM Design can be a natural exit point after Phase 1 for customers who have internal engineering capacity to implement but needed the cross-functional design work. If exiting here, deliver the full documentation package and schedule a 90-day check-in to review implementation progress.

---

## Phase 2: Engineering

**Goal:** Build and configure all systems required to support the PLG motion based on approved strategic package.

**Output:** Working PLG infrastructure — product analytics, data pipeline, CRM configuration, billing integration, PQL scoring model, automated workflows, and dashboards — tested end-to-end and customer-approved.

| Project Type | Engineering Weight | For PLG GTM Design |
|--------------|-------------------|-------------------|
| PLG GTM Design | Heavy (40-50%) | Data pipelines, CRM config, billing, PQL scoring, dashboards |

### Sub-Phases

```
2a Tech Spec --> 2b Engineering Handoff --> 2c Build --> 2d Test
```

---

### 2a. Tech Spec

**Purpose:** Translate PLG strategic package into technical specifications for every system component.

**Input:** Signed-off PLG GTM Design Package from Phase 1

**What happens:**

1. Receive strategic deliverables (architecture, journey maps, PQL model, pricing model, billing requirements)
2. Translate strategic language into system-level specifications
3. Output draft technical specification

**Output:** Draft tech spec containing:

- **Product Analytics Configuration:** Event taxonomy, user identification, property tracking for Amplitude/Mixpanel/Heap
- **Data Pipeline Specs:** Source-to-destination mapping, sync frequency, transformation logic, identity resolution rules
- **CRM Configuration:** Custom objects (Product Users, Usage Events, PQLs), field definitions, relationship mappings, workflow automation rules
- **Billing Integration:** Stripe/Chargebee/Recurly configuration, pricing tier setup, upgrade/downgrade flow logic, dunning rules
- **PQL Scoring Model:** Scoring criteria with weights, threshold definitions, score decay rules, handoff trigger logic
- **Reverse ETL:** Data warehouse to CRM sync specs, enrichment data flow, marketing tool sync
- **Dashboard Specs:** PLG funnel dashboard, PQL pipeline report, usage/health dashboard, attribution report, executive dashboard
- **Build sequence:** What to build first (data pipeline before scoring, scoring before handoff automation)

---

### 2b. Engineering Handoff

**Purpose:** Review tech specs with engineering team before building. PLG builds span multiple systems — the engineer needs to understand the end-to-end data flow, not just individual components.

**Who attends:** Architect + Engineer(s) covering CRM, data pipeline, billing

**Agenda (60 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-20 | End-to-end data flow walkthrough | Architect explains how data moves from product to CRM to billing |
| 20-35 | Component-by-component specs | Review each system's tech spec, flag ambiguities |
| 35-50 | Integration dependencies | Identify build order, parallel vs sequential work streams |
| 50-60 | Risk assessment + timeline | Flag technical risks, agree on build timeline, assign owners |

**What Architect brings:**

- PLG GTM Design Package (for strategic context)
- Draft tech spec (from 2a)
- System architecture diagram (visual reference)
- Questions list (anything flagged as unclear)

**What engineer leaves with:**

- Approved tech spec with build sequence
- Clear integration dependency map
- Known risks and mitigation plan
- Owner assignments per component

---

### 2c. Build (Configure)

**Purpose:** Build and configure all PLG systems per approved tech spec. PLG builds are large — typically 6-8 parallel work streams.

**Input:** Approved tech spec from 2b

**Build Components:**

| Component | Work Stream | Status |
|-----------|-------------|--------|
| Product Analytics Setup | Configure event tracking, user identification, property taxonomy | \[ \] |
| Data Pipeline (Product > Warehouse) | Set up usage data sync, transformation logic, identity resolution | \[ \] |
| Reverse ETL (Warehouse > CRM) | Configure enriched data sync to CRM and marketing tools | \[ \] |
| CRM Custom Objects & Fields | Create Product Users, Usage Events, PQL objects; field mappings | \[ \] |
| CRM Workflows & Automation | PQL routing, lead conversion, account assignment, expansion triggers | \[ \] |
| PQL Scoring Model | Deploy scoring logic, configure thresholds, set up score decay | \[ \] |
| Billing Platform Configuration | Set up pricing tiers, self-serve checkout, upgrade/downgrade flows | \[ \] |
| Billing-CRM Integration | Sync billing events to CRM, revenue recognition triggers | \[ \] |
| Marketing Automation PLG Flows | Onboarding sequences, activation prompts, conversion nurture, PQL alerts | \[ \] |
| Dashboards & Reporting | PLG funnel, PQL pipeline, usage/health, attribution, executive dashboard | \[ \] |

**Execution approaches:**

| Approach | When to Use | Example |
|----------|-------------|---------|
| Manual build | Billing integration, complex CRM workflows, first PLG build | Engineer configures Stripe+CRM integration directly |
| Assisted | CRM field creation, dashboard builds, standard automation | Create CRM objects, engineer reviews and refines |
| Automated | Event tracking setup (if using CDP), standard report templates | CDP auto-instruments common events |

**Build order recommendation:**

1. Product analytics + data pipeline (foundation — everything depends on usage data flowing)
2. CRM custom objects and fields (needs to receive pipeline data)
3. Reverse ETL + CRM workflows (needs both pipeline and CRM objects)
4. PQL scoring model (needs usage data in CRM to score against)
5. Billing platform + CRM integration (can parallel with #3-4)
6. Marketing automation PLG flows (needs PQL scoring active)
7. Dashboards and reporting (last — needs all data flowing to visualize)

---

### 2d. QA / Test + Sign-Off

**Purpose:** Verify the complete PLG infrastructure works end-to-end and get customer approval.

**Two types of testing:**

| Type | Who | Purpose |
|------|-----|---------|
| Technical Testing | Our team | Verify data flows, workflows fire, scoring calculates, billing works |
| Customer Testing | Customer | Verify it matches their PLG design, real scenarios produce expected results |

**Technical testing checklist:**

- Product usage events reaching data warehouse within expected latency
- Identity resolution correctly matching product users to CRM contacts
- Reverse ETL syncing enriched data to CRM on schedule
- PQL scoring model calculating correctly against test usage data
- PQL threshold triggers routing leads to correct sales reps
- Self-serve sign-up creating correct CRM records (Lead/Contact + Product User)
- Upgrade/downgrade flows processing correctly in billing platform
- Billing events syncing to CRM (new subscription, upgrade, downgrade, churn)
- Marketing automation sequences triggering on correct events (sign-up, activation stall, PQL threshold)
- All dashboards rendering with test data, calculations matching expected values
- Dunning/payment recovery flow tested with failed payment scenarios
- Edge cases: enterprise account signs up for free tier, existing CRM contact signs up self-serve, duplicate product user detection

**Customer testing:**

- Walk customer RevOps through complete data flow with live test accounts
- Have Sales test PQL notification and account view
- Have CS test health scoring and engagement triggers
- Have Finance verify billing data in ERP sync
- Capture feedback, fix issues before go-live

**Engineering sign-off checkpoint:**

- All systems match tech spec
- All technical tests passing
- Data flowing end-to-end reliably (verified over 48+ hours)
- Customer has tested and approved
- Ready for enablement

**Decision point:**

- **Proceed to Enablement** — All systems working, need team training and launch
- **Loop back to Build** — Issues found, needs fixes before training

---

## Phase 3: Enablement

**Goal:** Every GTM function understands their role in the PLG motion and can operate the new systems independently.

**Output:** Trained teams across Sales, Marketing, CS, RevOps, and Finance with documentation, stabilized PLG infrastructure, and no critical issues.

PLG enablement is more complex than typical project enablement because it touches every GTM function. Each team needs different training focused on their specific role in the PLG motion. Companies with NRR above 100% experience faster growth: one source notes they "grow at 48% year-over-year — 2x faster than those below 100%." Proper enablement is what separates a PLG motion that drives expansion from one that just adds complexity.

### Sub-Phases

```
3a Training Prep --> 3b Training Sessions --> 3c Hypercare --> 3d Enablement Sign-Off
```

---

### 3a. Training Prep

**Purpose:** Create function-specific training materials from the PLG design package, tech specs, and built systems.

**Input:** PLG GTM Design Package + tech specs + built system access

**Output:** Training package containing:

- **Sales Training Pack:** PQL notification walkthrough, when to engage vs let self-serve, account view with usage data, compensation/territory for PLG deals
- **Marketing Training Pack:** PLG attribution model, PQL nurture campaigns, usage data for targeting, campaign integration with product signals
- **CS/Support Training Pack:** Health scoring model, tiered support playbook, tech-touch vs high-touch engagement triggers, expansion opportunity identification
- **RevOps Training Pack:** System administration guide, data pipeline monitoring, PQL model tuning, dashboard management, troubleshooting runbook
- **Finance Training Pack:** Revenue recognition for self-serve vs enterprise, billing operations overview, ERP integration monitoring
- **Executive Training Pack:** PLG metrics interpretation, dashboard navigation, board reporting views

---

### 3b. Training Sessions

**Purpose:** Transfer knowledge to each GTM function on their specific role in the PLG motion.

**Six training sessions:**

| Session | Audience | Focus | Duration |
|---------|----------|-------|----------|
| Executive Briefing | CRO, VP Product, VP Finance | PLG motion overview, how to interpret PLG metrics, board reporting | 45 min |
| Sales Enablement | VP Sales, AEs, SDRs | PQL handoff process, when to engage, account engagement with usage data | 60 min |
| Marketing Alignment | VP Marketing, Demand Gen | PLG attribution, PQL nurture integration, usage data for campaigns | 60 min |
| CS/Support Launch | VP CS, CSMs, Support Lead | Health scoring, tiered support, engagement triggers, expansion handoffs | 60 min |
| RevOps Operations | RevOps Manager, CRM Admin | System admin, pipeline monitoring, PQL model tuning, troubleshooting | 90 min |
| Finance Operations | Controller, FP&A | Revenue recognition, billing ops, ERP integration, reporting | 45 min |

**Training delivery:**

1. Schedule sessions 1-2 weeks before planned go-live
2. Deliver live with screen sharing (walk through actual systems, not slides)
3. Record every session as a video walkthrough for future reference and new hire onboarding
4. Answer questions, note gaps, update FAQ document in real-time

**Output:**

- Trained stakeholders across all 6 functions
- Video walkthrough recordings (6 sessions)
- Updated FAQ document
- Confidence assessment per team (ready for launch vs needs additional support)

---

### 3c. Hypercare

**Purpose:** Intensive post-launch support to stabilize the PLG motion across all functions.

**Duration:** 4-6 weeks (PLG motions require extended hypercare because issues surface as real users hit the system — PQL scoring needs tuning, edge cases in billing emerge, handoff timing needs adjustment)

**What happens:**

- **Week 1-2:** Daily monitoring of data pipeline health, PQL scoring output, billing transactions. Respond to issues within 4 hours.
- **Week 3-4:** Weekly office hours (45 min). Review early PLG funnel metrics. Tune PQL thresholds based on initial data. Address cross-functional coordination issues.
- **Week 5-6:** Bi-weekly check-in. Review 30-day metrics against targets. Identify optimization priorities. Prepare for steady-state handoff.

**Office hours structure:**

| Time | Focus |
|------|-------|
| 0-10 | Open issues triage — what's broken or confusing |
| 10-25 | Metrics review — early funnel performance |
| 25-40 | Process refinement — any handoff or workflow adjustments |
| 40-45 | Action items and next steps |

**When hypercare surfaces issues:**

- PQL scoring threshold too low (flooding Sales with unqualified leads) > Adjust threshold, retrain Sales on updated criteria
- Data pipeline latency causing stale usage data in CRM > Work with engineering on sync frequency adjustment
- Self-serve users hitting billing edge cases (failed upgrades, proration issues) > Fix billing configuration, update support playbook
- Marketing automation sequences firing too aggressively or too passively > Tune trigger thresholds based on early user behavior data

**Output:** Stabilized PLG motion, tuned PQL model, resolved edge cases, no critical issues outstanding

---

### 3d. Enablement Sign-Off

**Purpose:** Confirm all teams can operate the PLG motion independently.

**Validation checkpoint:**

- All 6 training sessions delivered
- All video walkthrough recordings and documentation provided
- Hypercare period complete — no critical issues outstanding
- PQL scoring model tuned based on initial launch data
- Each team can demonstrate proficiency in their PLG responsibilities
- Data pipeline stable for 2+ weeks without intervention
- Billing system processing transactions without errors
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** — PLG motion running, teams enabled, system stable
- **Extend Hypercare** — Specific function or system still unstable, needs more support time

---

## Phase 4: Handoff

**Goal:** Clean project close with PLG maintenance plan established, optimization cadence defined, and retention/expansion path set.

**Output:** Maintenance schedule documented, internal context transferred, customer owns the PLG motion, project archived, optimization roadmap delivered.

**Structure:**

```
4a Maintenance Schedule --> 4b Internal Handoff --> 4c External Handoff --> 4d Project Close
                           (SME > Architect)        (Team > Customer)       (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|---------------------|---------------|
| Single Project | Customer RevOps owns | 4c (External Handoff) — customer receives maintenance schedule and runs it |
| Dedicated (Multi-Project) | Architect owns | 4b (Internal Handoff) — Architect receives maintenance schedule and runs it |

---

### 4a. Maintenance Schedule

**Purpose:** Document what needs ongoing attention after PLG launch — the PLG motion has more moving parts than typical projects, requiring active monitoring and optimization.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|--------------------|
| PLG Funnel Metrics Review | Sign-ups, activation rate, free-to-paid conversion, PQL volume | Activation rate drops below 35%, conversion drops below 2% |
| PQL Scoring Accuracy | PQL-to-close conversion rate, false positive rate | PQL-to-close rate drops below 15% or Sales rejects >40% of PQLs |
| Data Pipeline Health | Sync reliability, latency, data quality issues | Any sync failure >4 hours or >5% data mismatch |
| Billing Operations | Failed payments, dunning recovery rate, self-serve error rate | Failed payment recovery rate below 60% |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|----------------|-------------------|
| PQL Model Recalibration | Scoring weights vs actual conversion correlation | Re-run logistic regression on updated data, adjust weights |
| Pricing Performance Review | Free-to-paid conversion by tier, upgrade path effectiveness | Adjust feature gates or pricing if conversion below benchmark |
| Support Tier Utilization | Ticket volume by tier, SLA compliance, self-serve deflection rate | Rebalance support resources, update knowledge base |
| Cross-Functional Alignment | Handoff friction, territory conflicts, attribution disputes | Schedule alignment session, update processes as needed |

**After First Business Cycle (60-90 days post-launch):**

- Full PLG funnel analysis (sign-up > activation > conversion > expansion pipeline)
- PQL-to-close conversion analysis with Sales feedback
- Expansion revenue contribution assessment (target: 20-30% of PLG revenue from expansion)
- NRR measurement for PLG cohorts (target: 108% for mid-market, 118% for enterprise)
- Customer journey optimization priorities identified from drop-off analysis

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Free-to-paid conversion decline | Below 2% for 2+ consecutive months | Re-engage SME for PQL model and pricing review |
| Activation rate decline | Below 30% for 2+ consecutive months | Re-engage SME for onboarding flow analysis |
| Data pipeline reliability | 3+ sync failures per month | Engineering review of pipeline architecture |
| PLG-sourced bookings off-target | >25% below plan for 2+ months | Scope PLG optimization project |
| New market segment added | Company launches new product line or enters new ICP | Scope PLG expansion project for new segment |

**Every 6-12 Months:**

- Full PLG motion review against original design
- Market re-assessment (competitor PLG changes, new tools available)
- PQL scoring model rebuild (not just recalibration — full re-analysis of conversion drivers)
- Pricing model market comparison and adjustment
- System architecture review (new integration opportunities, deprecated tools)

---

### 4b. Internal Handoff (SME > Architect)

**Purpose:** Transfer context so Architect can manage the ongoing PLG relationship.

**What the Architect needs to know:**

- What was built: Complete PLG motion spanning product analytics, data pipeline, CRM, billing, scoring, and automation
- Why it was designed this way: Strategic rationale for pricing tiers, PQL criteria, handoff triggers, support tiers
- Customer context: Which stakeholders own which domain, any unresolved tensions
- The PLG-specific complexity: This is not a single-system project — issues in the data pipeline affect PQL scoring which affects Sales handoff which affects revenue
- When to escalate back to SME: Any changes to PQL scoring logic, pricing tier structure, billing integration architecture, or data pipeline design

**Escalation guidelines:**

| Issue Type | Who Handles | Analogy |
|-----------|-------------|---------|
| Dashboard filter changes, new user training | Architect | General contractor |
| PQL threshold adjustments based on Architect analysis | Architect with SME review | GC with specialist consult |
| PQL model redesign, pricing changes, new integration | SME | Specialist tradesperson |
| Data pipeline architecture changes | SME required | Specialist tradesperson |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing monthly and quarterly tasks. SME walks Architect through each maintenance task, demonstrates how to interpret PLG funnel metrics, and explains the PQL recalibration process.

---

### 4c. External Handoff (Team > Customer)

**Purpose:** Formal PLG GTM Design project completion with customer.

**Final project meeting (60 min):**

- Review what was delivered (walk through complete PLG design package, all built systems, all dashboards)
- Demonstrate the PLG funnel end-to-end with live data
- Walk through maintenance schedule (monthly, quarterly, annual tasks)
- Walk through troubleshooting guide (common issues and resolution)
- Confirm optimization cadence (when to review, when to re-engage)
- Make it explicit: "Project complete. Your PLG motion is live."
- **For Single Project engagements:** Record a video walkthrough of the maintenance walkthrough so customer RevOps can reference it

**Documentation package:**

- All training video walkthrough recordings (6 sessions + maintenance walkthrough)
- PLG GTM Design Package (journey maps, architecture diagram, pricing model)
- PQL Scoring Model Documentation (criteria, weights, thresholds, recalibration process)
- System Integration Guide (data pipeline, CRM objects, billing sync, reverse ETL)
- Data Dictionary (all metric definitions, formally approved)
- Tiered Support Playbook (SLAs, escalation paths, self-serve resources)
- Definition Alignment Document (final version)
- FAQ Document (compiled from training sessions and hypercare)
- Maintenance Schedule (monthly, quarterly, annual tasks with red flag thresholds)
- Troubleshooting Guide (common scenarios and resolutions)

**Output:** Customer owns the PLG motion. Project formally complete.

---

### 4d. Project Close

**Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved to proper location
- Handoff documentation complete
- Project status updated in tracking system
- Time/billing finalized
- PLG launch metrics captured (baseline for future comparison)

#### Internal Debrief (Recommended — PLG projects generate significant learnings)

- What went well? (Which workshops were most productive, which system builds were smooth)
- What would we do differently? (Which cross-functional conflicts slowed us down, where did scope creep happen)
- Any learnings to feed back into PLG playbook?
- What competitor PLG intelligence did we gather from this engagement?

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| Single Project | Upsell > Downsell > Retry |
| Multi-Project (Dedicated) | Schedule PLG Optimization Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (ongoing PLG optimization, PQL model tuning, A/B testing)
   | if no
2. Downsell: Adjacent project (Lead Scoring Model Product-Led, Customer Health Model, Customer Segmentation)
   | if yes
3. Retry retainer at end of next project cycle
```

**Script:**

"Now that your PLG motion is live, there are two ways we can continue working together. Option 1: We set you up on managed services where we handle ongoing PLG optimization — PQL model tuning, conversion funnel analysis, A/B testing of upgrade flows. Companies that actively optimize PLG see 1.5-2x higher conversion rates than those that set-and-forget. Option 2: If there's a specific adjacent project like refining your lead scoring model or building out customer health scoring, we can scope that. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a PLG optimization check-in at handoff:

"At the 90-day mark, we'll review how the PLG motion is performing against targets and identify the highest-impact optimizations."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: PLG optimization check-in in 2 weeks |
| 2. Pull metrics | PLG funnel performance, PQL conversion, expansion revenue, NRR |
| 3. Analyze | Compare to targets, identify top 3 optimization opportunities |
| 4. Decide ownership | Can Architect handle this, or does it need SME for PQL model changes? |

**At the optimization check-in:**

- Review PLG performance against original targets (sign-up volume, activation, conversion, PQL-to-close, NRR)
- Identify top optimization priorities
- If minor (threshold adjustments, dashboard tweaks): Architect handles
- If major (PQL model redesign, pricing restructure, new segment addition): Scope new project

**Output:** Project archived. PLG optimization path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- PLG GTM Design Package (comprehensive document covering all motion components)
- Customer Journey Maps (Mermaid diagrams: acquisition > activation > conversion > expansion > churn recovery)
- System Architecture Blueprint (current state, target state, integration map)
- PQL Scoring Model Documentation (criteria, weights, thresholds, recalibration methodology)
- Pricing & Billing Requirements Document (tier structure, feature gates, billing platform specs)
- Cross-Functional Alignment Document (territory, compensation, attribution, handoff agreements)
- Data Dictionary (all PLG metric definitions, formally approved)

**Technical Deliverables (Phase 2):**

- Product analytics configuration (event taxonomy, user identification)
- Data pipeline (product > warehouse > CRM)
- CRM custom objects, fields, and workflows (Product Users, Usage Events, PQLs)
- PQL scoring model deployed and active
- Billing platform configured with self-serve flows
- Billing-CRM integration (subscription events syncing)
- Marketing automation PLG flows (onboarding, activation, conversion, PQL alerts)
- Dashboards: PLG funnel, PQL pipeline, usage/health, attribution, executive

**Documentation Package:**

- Training video walkthrough recordings (6 function-specific sessions + maintenance walkthrough)
- Written guides and SOPs per function
- FAQ document
- Definition Alignment Document (final version)
- Maintenance Schedule (monthly, quarterly, annual with red flag thresholds)
- Troubleshooting Guide (scenario + resolution tables)
- System Integration Monitoring Checklist

---

## Appendix: Implementation Guide

Reference material for architects and implementation teams. This section does not change per project.

---

### Roles

| Role | What They Do |
|------|--------------|
| **Architect** | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| **Engineer** | CRM build, automation, dashboards (Phase 2) |
| **SME** | Project/implementation team brought in for project-specific work |

---

### What Each Phase Produces

| Phase | Output | Gate Criteria |
|-------|--------|---------------|
| **Phase 1: Strategy** | Signed-off PLG GTM Design Package (all working documents + deliverables) | All stakeholders approved definitions, architecture, pricing, PQL criteria, ops model |
| **Phase 2: Engineering** | Built PLG infrastructure (analytics, pipeline, CRM, billing, scoring, dashboards) | All systems match tech spec, end-to-end tested, customer approved |
| **Phase 3: Enablement** | Trained teams across 6 functions with documentation | All training delivered, hypercare complete, teams can operate independently |
| **Phase 4: Handoff** | Independent customer + archived project + optimization path | Internal/external handoffs complete, maintenance plan in place, project closed |

---

### How to Adapt Per Project Type

PLG GTM Design is a **Balanced** project with heavy Strategy and heavy Engineering:

| Project Profile | Strategy Weight | Engineering Weight | Enablement Weight | Notes |
|-----------------|-----------------|-------------------|-------------------|-------|
| **PLG GTM Design** | 40-50% | 35-40% | 15-20% | 6-8 workshops, complex multi-system build |

**Adaptation rules:**

- If only the strategic design is needed (no implementation), Phase 2 can be skipped entirely — project completes at Phase 1d sign-off
- If existing product analytics are already in place, the data pipeline work stream in Phase 2 can be lighter
- Phase 3 is always needed at some level — even strategic-only projects should include an executive briefing on the PLG design
- Phase 4 always applies — PLG maintenance is ongoing and requires clear ownership

---

### Phase 1 Guide: Strategy

#### How We Create Value in PLG GTM Design Strategy

**1. We educate.** Most stakeholders understand "free trial" but not PLG as a GTM motion. We educate on PQL scoring, activation metrics, self-serve billing, and how product usage data flows to revenue operations. Without this education, stakeholders give requirements for a free trial page, not a PLG motion.

**2. We drive alignment.** PLG touches 6+ functions that rarely coordinate. Sales worries about compensation. Finance worries about revenue recognition. Product worries about instrumentation effort. CS worries about support volume. We facilitate the hard conversations and create forcing functions (Definition Alignment Document, cross-functional workshop).

**3. We come with an opinion.** We show up with a v0 PLG architecture based on what works at similar companies. "Based on your product complexity and ACV range, we recommend a hybrid PLG + sales-led model with a freemium tier. Here's why." They confirm and adjust.

**4. We show best practices.** We anchor in PLG benchmarks: "3-5% freemium conversion is typical, 8-12% for free trials, activation should happen within 30 minutes, PQLs convert at 5-6x the rate of MQLs." Customers don't know what "good" looks like — we tell them.

#### Why Phase 1 Matters for PLG Specifically

PLG projects fail when teams build before aligning. The most common failure mode: Engineering instruments product events, RevOps builds PQL scoring, Sales sets up handoff processes — but nobody agreed on what "activation" means. The PQL model scores against the wrong events. Sales gets leads that aren't qualified. The motion appears broken within 30 days. Phase 1 prevents this by forcing agreement on definitions, architecture, and handoff criteria before any system work begins.

---

### Phase 2 Guide: Engineering

#### Engineering Sub-Phase Flow

```
+--------------------+--------------------+--------------------+--------------------+
|  2a TECH SPEC      |  2b ENG HANDOFF    |  2c BUILD          |  2d TEST           |
|                    |                    |                    |                    |
|  Translate         |  Walk through      |  6-8 parallel      |  End-to-end QA     |
|  strategic package |  end-to-end data   |  work streams      |  + customer        |
|  into system specs |  flow with         |  across systems    |  testing           |
|                    |  engineering team  |                    |                    |
+--------------------+--------------------+--------------------+--------------------+
|  OUTPUT:           |  OUTPUT:           |  OUTPUT:           |  OUTPUT:           |
|  Draft tech spec   |  Approved specs +  |  Working PLG       |  Tested +          |
|  (all components)  |  build sequence    |  infrastructure    |  approved          |
+--------------------+--------------------+--------------------+--------------------+
```

#### Key Principles

**Tech Spec (2a):** PLG tech specs are larger than most projects because they span multiple systems. The Architect must review for cross-system coherence — a field name in the CRM must match the property name in the data pipeline.

**Engineering Handoff (2b):** The engineer needs to understand the end-to-end data flow, not just their component. A billing engineer who doesn't understand PQL scoring won't build the right CRM integration triggers.

**Build (2c):** Start with the data pipeline. Everything downstream (scoring, automation, dashboards) depends on usage data flowing reliably. Build sequence matters more in PLG than in most projects.

---

### Phase 3 Guide: Enablement

#### Enablement Sub-Phase Flow

```
+--------------------+--------------------+--------------------+--------------------+
|  3a TRAINING       |  3b TRAINING       |  3c HYPERCARE      |  3d ENABLEMENT     |
|  PREP              |  SESSIONS          |                    |  SIGN-OFF          |
|                    |                    |                    |                    |
|  Create materials  |  6 function-       |  4-6 weeks         |  Confirm all       |
|  per function from |  specific          |  intensive         |  teams can         |
|  project docs      |  sessions          |  post-launch       |  operate           |
|                    |                    |  support           |  independently     |
+--------------------+--------------------+--------------------+--------------------+
|  OUTPUT:           |  OUTPUT:           |  OUTPUT:           |  OUTPUT:           |
|  Training package  |  Trained teams     |  Stabilized PLG    |  Enablement        |
|  (6 function packs)|  (6 sessions)      |  motion            |  complete          |
+--------------------+--------------------+--------------------+--------------------+
```

#### Key Principles

**Training Prep (3a):** Each function gets materials focused on their specific PLG responsibilities — do not train Sales on billing operations or CS on attribution models.

**Hypercare (3c):** PLG hypercare is longer than typical because issues surface as real users interact with the system. PQL scoring thresholds almost always need tuning within the first 30 days based on actual conversion data vs. the initial model built from assumptions and benchmarks.

---

### Phase 4 Guide: Handoff

#### Handoff Sub-Phase Flow

```
+--------------------+--------------------+--------------------+--------------------+
|  4a MAINTENANCE    |  4b INTERNAL       |  4c EXTERNAL       |  4d PROJECT        |
|  SCHEDULE          |  HANDOFF           |  HANDOFF           |  CLOSE             |
|                    |                    |                    |                    |
|  Document PLG      |  SME > Architect   |  Team > Customer   |  Archive +         |
|  monitoring and    |  context           |  final meeting     |  debrief +         |
|  optimization      |  transfer          |  + documentation   |  retention path    |
|  cadence           |                    |                    |                    |
+--------------------+--------------------+--------------------+--------------------+
|  OUTPUT:           |  OUTPUT:           |  OUTPUT:           |  OUTPUT:           |
|  PLG maintenance   |  Architect ready   |  Customer owns     |  Project           |
|  playbook          |  to manage PLG     |  PLG motion        |  archived +        |
|                    |  relationship      |                    |  optimization path |
+--------------------+--------------------+--------------------+--------------------+
```

#### Key Principles

**Maintenance Schedule (4a):** PLG maintenance is more active than most projects. The PQL scoring model degrades over time as user behavior patterns shift — quarterly recalibration is mandatory, not optional. Run a formal PQL audit quarterly.

**Internal Handoff (4b):** Architect must understand PLG as a system, not just individual components. The most common handoff failure: Architect adjusts a PQL threshold without understanding the downstream impact on Sales handoff volume and CS engagement triggers.

**External Handoff (4c):** Record the maintenance walkthrough as a video. PLG motions have more ongoing operational requirements than typical projects — the customer RevOps team needs a reference they can rewatch.

---

## References

\[1\] ProductLed - Product-Led Growth Benchmarks

\[2\] Userpilot - SaaS Average Free Trial Conversion Rate Benchmarks

\[3\] Hightouch - The Definitive Guide to PLG CRMs

\[4\] Optifai - B2B SaaS NRR Benchmark by Segment

\[5\] ProductLed - How to Build a Lead Scoring Model to Uncover PQLs

\[6\] ChartMogul - The SaaS Retention Report

\[7\] Census - Maximize Your Revenue with PQLs