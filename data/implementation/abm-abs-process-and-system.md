# ABM/ABS Process and System — Implementation

## Project One-Pager

### ABM/ABS Process and System One-Pager

#### Project Type

- Category: Balanced
- Primary Deliverable: Fully operational ABM/ABS motion with integrated platform, tiered target account list, buying committee mapping, and coordinated multichannel campaign execution

##### Phase Relevance

| Phase | Applies? | Notes |
|-------|----------|-------|
| 1. Strategy | Yes | ICP framework, target account tiering, buying committee personas, cross-functional alignment -- 3-5 refinement loops typical |
| 2. Engineering | Yes | ABM platform implementation (6sense/Demandbase), CRM integration, intent data configuration, ad platform setup, website personalization |
| 3. Enablement | Yes | Sales training on intent signals, marketing training on campaign ops, joint ABM workflow enablement |
| 4. Handoff | Yes | Internal + External -- maintenance schedule for ongoing account list refresh, campaign optimization, and governance cadence |

#### Phase Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. STRATEGY  │────>│ 2. ENGINEER  │────>│3. ENABLEMENT │────>│  4. HANDOFF  │
│    Heavy     │     │    Heavy     │     │   Medium     │     │   Medium     │
│ 1a->1b->1c->1d│     │ 2a->2b->2c->2d│     │ 3a->3b->3c->3d│     │ 4a->4b->4c->4d│
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
  ICP & Account        Platform Setup       Sales & Marketing    Governance &
   Strategy            + Integrations       Training             Operations Handoff
```

**This project's flow:**

- Full 4-phase. Heavy strategy (ICP definition, account tiering, buying committee mapping, cross-functional alignment). Heavy engineering (ABM platform implementation, CRM integration, intent data, ad platforms, website personalization). Medium enablement (joint sales + marketing training). Medium handoff (governance model, ongoing account refresh cadence).
- Some customers skip 3c Hypercare if the ABM platform is already partially deployed and teams have prior ABM experience.
- Pilot campaign (10-20 accounts) runs as part of Phase 2d validation before full-scale rollout.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Watch ABM/ABS intro video explaining the project scope, timeline, and what ABM means for their organization
- Complete intake form: current targeting approach, tech stack, historical win rates by segment, budget range for ABM platform and ad spend
- Provide CRM access with admin permissions for integration assessment
- Share 12-24 months of closed-won/lost deal data for ICP analysis
- Identify executive sponsors (CMO/CRO) and confirm availability for kickoff

##### Track B: Architect Prep

- Pull CRM data: closed-won deal characteristics, win rates by segment, ACV distribution
- Run current state diagnostic: tech stack compatibility, data quality assessment, account hierarchy audit
- Draft v0 ICP scoring framework based on historical deal analysis
- Create v0 target account tiering structure (Tier 1/2/3 size recommendations)
- Prepare ABM platform comparison matrix based on client tech stack and requirements

#### Refinement Loop (1b -> 1c -> 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present v0 ICP framework, validate deal data findings | VP Marketing, VP Sales, RevOps | Corrected ICP criteria for v1 |
| Refinement 1 | 1c | Review v1 ICP scoring, tiering approach, platform rec | CMO/CRO + RevOps | Refined scoring model, platform decision |
| Refinement 2 | 1c | Buying committee personas, engagement sequence design | Sales Leadership + Marketing | Validated personas, channel plan |
| Refinement 3 | 1c | Full target account list review, campaign architecture | All stakeholders | Final account list, campaign plan |
| Sign-Off | 1d | Strategic approval of ICP, accounts, platform, campaign | All | Final strategic package |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held -- ICP framework and deal analysis presented
- 1c. Refinement loop complete (ICP scoring -> tiering -> personas -> account list -> campaign architecture)
- 1d. Strategic sign-off obtained -- ICP, target accounts, platform selection, and campaign plan approved

##### Phase 2: Engineering

- 2a. Tech spec created for ABM platform configuration, CRM integration, and campaign infrastructure
- 2b. Engineering handoff meeting held with platform implementation team
- 2c. Build complete -- platform configured, integrations live, campaigns set up
- 2d. QA/Test + customer sign-off -- pilot campaign executed and validated

##### Phase 3: Enablement

- 3a. Training materials prepped for sales and marketing teams
- 3b. Training sessions delivered (sales: intent signals + ABM workflow; marketing: campaign ops + platform admin)
- 3c. Hypercare period complete -- 4-6 weeks post-pilot launch
- 3d. Enablement sign-off -- teams operating independently

##### Phase 4: Handoff

- 4a. Maintenance schedule documented (account list refresh, campaign optimization, governance cadence)
- 4b. Internal handoff (SME -> Architect) complete
- 4c. External handoff (LeanScale -> Customer) complete with full documentation package
- 4d. Project closed and archived

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| ICP Scoring Framework | Define and weight firmographic, technographic, behavioral criteria | All criteria weighted and validated by sales |
| Target Account List (tiered) | Prioritized list of 50-500 accounts across 3 tiers | Tiers assigned, sales-validated, enriched |
| Buying Committee Persona Map | Document roles, pain points, messaging per persona | All personas defined, messaging approved |
| ABM Platform Requirements Matrix | Compare platforms against requirements and budget | Platform selected and budget approved |
| Campaign Architecture Doc | Channel mix, sequencing, content mapping by tier/persona | Campaign plan approved by all stakeholders |
| Data Enrichment Tracker | Track account data completeness and gaps | All Tier 1 accounts fully enriched |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| ICP Criteria Document | ICP Scoring Framework | Internal alignment on target customer profile |
| Tiered Target Account Report | Target Account List | Board-level reporting, sales territory planning |
| ABM Campaign Playbook | Campaign Architecture Doc | Ongoing campaign execution guide |
| Buying Committee Engagement Map | Persona Map + Enrichment Data | Sales account planning, outreach coordination |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Leadership | CMO, CRO, VP Marketing, VP Sales | ABM program goals, interpreting engagement metrics, ROI tracking | 30 min |
| Sales | AEs, SDRs/BDRs, Sales Management | Intent signal interpretation, account scoring, ABM timing discipline, buying committee engagement | 60 min |
| Marketing | Demand Gen, Marketing Ops, Content | ABM platform admin, campaign management, ad targeting, website personalization, reporting | 90 min |
| RevOps | RevOps Manager, CRM Admin | Platform configuration, data sync maintenance, scoring model tuning, troubleshooting | 60 min |

##### Hypercare

- Applies: Yes
- Duration: 4-6 weeks post-pilot launch
- Office Hours: Yes -- weekly 30-min slot for sales + marketing questions

##### Training Assets to Create

- Video walkthrough: ABM platform walkthrough (how to read intent signals, account scores)
- Video walkthrough: Sales workflow -- from surging account alert to outreach sequence
- Doc: Buying committee engagement playbook (per persona messaging templates)
- Doc: ABM platform admin guide (account list updates, campaign creation, reporting)
- Doc: ABM governance and meeting cadence reference
- Video walkthrough: Marketing campaign ops -- ad campaign setup, website personalization, email integration

#### Handoff & Retention

##### Internal Handoff (SME -> Architect)

- Key context for Architect: ICP criteria rationale, platform configuration decisions, account tier rationale, campaign performance baselines, known data quality issues
- Escalation trigger: Any changes to ICP scoring model, account tier restructuring, platform integration changes, or scoring model recalibration

##### External Handoff (LeanScale -> Customer)

- Final meeting agenda: ABM program performance review, documentation walkthrough, governance model confirmation, maintenance schedule review, 60/90-day check-in scheduling
- Documentation package: ICP documentation, target account list with scoring, buying committee maps, ABM platform admin guide, campaign playbooks, governance model, maintenance schedule

##### Maintenance Schedule

- Monthly: Account engagement review, campaign performance check, data hygiene audit
- Quarterly: Target account list refresh, ICP revalidation, scoring model recalibration
- Who owns: Single project = customer owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services (ongoing ABM campaign optimization) -> if no -> Downsell: Another project (e.g., Lead Scoring, Attribution) -> Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~quarter out from handoff
- Internal prep trigger: 2 weeks before
- Decision: Architect handles routine optimization / SME needed for ICP or scoring overhaul

#### Key Assets

| Asset | When Used |
|-------|-----------|
| ICP Scoring Template | Phase 1 -- Strategy |
| Target Account List Template | Phase 1 -- Strategy |
| Buying Committee Map Template | Phase 1 -- Strategy |
| ABM Platform Comparison Matrix | Phase 1 -- Strategy |
| Campaign Architecture Template | Phase 1/2 -- Strategy/Engineering |
| ABM Performance Dashboard | Phase 2/3/4 -- Ongoing |

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| Target Account | A company that matches ICP criteria, has been scored and tiered, and is approved for ABM engagement |
| Tier 1 Account | Highest-value accounts (10-50) receiving 1:1 personalized engagement across all channels |
| Tier 2 Account | Mid-value accounts (50-200) receiving 1:few engagement with industry/segment-level personalization |
| Tier 3 Account | Broader set (200-500) receiving 1:many programmatic engagement through ads and automated sequences |
| Buying Committee | The group of stakeholders within a target account who influence or make the purchase decision |
| Intent Signal | Third-party or first-party data indicating an account is actively researching topics related to the product |
| Account Engagement Score | Composite score combining intent signals, website visits, ad interactions, and sales touchpoints |
| Surging Account | An account whose engagement score has crossed a defined threshold, triggering immediate sales outreach |
| ICP (Ideal Customer Profile) | Data-driven criteria (firmographic, technographic, behavioral) defining which companies are most likely to buy and succeed |
| ABM/ABS Motion | The coordinated marketing + sales approach of engaging named target accounts through personalized multichannel campaigns |

#### Common Gotchas

- Sales outreach triggers before sufficient engagement signals accumulate -> Define clear score thresholds before any outreach begins; enforce "do not contact yet" rules in the sales engagement platform
- Target account list built from intuition rather than data -> Always anchor in closed-won deal analysis; validate ICP scores against historical win rates
- Marketing and sales run parallel but uncoordinated campaigns -> Require weekly ABM sync meeting from day one; use shared dashboard as single source of truth
- CRM account hierarchies are messy (duplicates, subsidiaries not linked) -> Run CRM data audit in Track B before platform integration; fix account hierarchy issues before loading into ABM platform
- ABM platform configured but nobody checks the data -> Set up automated alerts for surging accounts; assign clear ownership for alert response
- Trying to personalize for 500 accounts simultaneously -> Start with 10-20 Tier 1 accounts in pilot; scale only after validating engagement lift

#### Methodology Options

| Option | When to Use | Complexity |
|--------|-------------|-----------|
| 1:1 ABM (Tier 1) | <50 high-value strategic accounts; ACV >$100K; long sales cycles | High |
| 1:Few ABM (Tier 2) | 50-200 accounts; industry/segment clusters; ACV $25K-$100K | Medium |
| 1:Many ABM (Tier 3) | 200-500+ accounts; programmatic targeting; ACV <$25K | Low |
| Hybrid ABM | Mix of tiers; most B2B SaaS companies use all three simultaneously | Medium-High |

---

## Phase 1: Strategy

> **Goal:** Get stakeholder sign-off on ICP framework, target account list, buying committee mapping, ABM platform selection, and campaign architecture.
>
> **Output:** Definition Alignment Document + Strategic Package (ICP scoring model, tiered target account list, buying committee personas, platform recommendation, campaign plan) signed off by stakeholders.

### 1a. Pre-Kickoff

> Two parallel tracks run after the AE closes and before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| ABM/ABS Intro Video | Explain what ABM/ABS is, why it matters, and what the project covers | Video (8-10 min) |
| Definition Alignment Document | Get stakeholder sign-off on ICP, buying committee, and engagement terms | Google Doc |
| Pre-filled Intake Form | Confirm current targeting approach, tech stack, budget, goals | Google Form or Doc |
| CRM Access Request | Admin access for integration assessment and data analysis | Email with checklist |

**Intake form asks for:**

- Current account targeting method (spray-and-pray, manual list, existing ABM)
- CRM platform and version (Salesforce/HubSpot)
- Existing sales engagement platform (Outreach, Salesloft, or similar)
- Marketing automation platform (Marketo, HubSpot, Pardot)
- Historical win rate data availability (12-24 months)
- Budget range for ABM platform licensing ($30K-$150K/year typical)
- Budget range for advertising spend ($5K-$50K/month typical)
- Executive sponsors confirmed (CMO and/or CRO)
- Any existing target account lists or strategic account programs

**Completion tracking:** RevOps leader or project sponsor follows up. Don't cancel kickoff if incomplete, but push hard after -- CRM data access is critical for Track B.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Pull CRM data: closed-won deals, win rates by segment, ACV ranges | Raw deal data for ICP analysis |
| 2 | Analyze deal patterns: common firmographics, technographics, behaviors | Draft ICP criteria with initial weights |
| 3 | Assess current tech stack compatibility for ABM platform integration | Integration readiness assessment |
| 4 | Audit CRM account data quality (duplicates, hierarchies, completeness) | Data quality scorecard with remediation priorities |
| 5 | Draft v0 ICP scoring framework and target account tiering structure | v0 ICP model + tier definitions |
| 6 | Prepare ABM platform comparison matrix | Platform options with pros/cons/pricing |

**Critical:** Mark everything as ASSUMED. The kickoff call validates ICP criteria, scoring weights, and tier definitions with sales and marketing leadership.

#### Stakeholder Alignment Document

> Get stakeholder sign-off on terms BEFORE building anything.

| Term | Our Definition | Internally Approved? |
|------|---|---|
| Target Account | A company matching ICP criteria, scored and tiered, approved for ABM engagement | [ ] Yes / [ ] No |
| Ideal Customer Profile | Data-driven criteria defining which companies are most likely to buy and succeed | [ ] Yes / [ ] No |
| Tier 1 (1:1) | 10-50 accounts receiving fully personalized, high-touch engagement | [ ] Yes / [ ] No |
| Tier 2 (1:Few) | 50-200 accounts receiving segment-level personalization | [ ] Yes / [ ] No |
| Tier 3 (1:Many) | 200-500 accounts receiving programmatic, automated engagement | [ ] Yes / [ ] No |
| Buying Committee | Group of stakeholders influencing or making the purchase decision | [ ] Yes / [ ] No |
| Intent Signal | Data indicating an account is actively researching relevant topics | [ ] Yes / [ ] No |
| Surging Account | Account whose engagement score crosses threshold, triggering sales outreach | [ ] Yes / [ ] No |
| Account Engagement Score | Composite score combining intent, web visits, ad interactions, sales touchpoints | [ ] Yes / [ ] No |
| Marketing Qualified Account (MQA) | Account meeting engagement thresholds that warrant sales follow-up | [ ] Yes / [ ] No |

**Instructions to customer:**

> Review each definition with your sales and marketing leadership team. Check "Yes" when approved. We cannot proceed with ABM platform configuration or campaign design until all terms are aligned.

---

### 1b. Kickoff Call

> **Purpose:** Present v0 ICP framework and deal analysis. Walk in with work done -- customer reacts, not creates from scratch.

#### Agenda (90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-20 | Present v0 ICP framework | "Here's what your CRM data tells us about your best customers" |
| 20-35 | Validate ICP criteria | ASSUMED criteria -> CONFIRMED or corrected by sales leadership |
| 35-50 | Review current state assessment | Tech stack, data quality findings, integration readiness |
| 50-65 | Definition alignment | Walk through Definition Alignment Document, flag disagreements |
| 65-80 | ABM platform comparison | Present platform options, discuss requirements and budget |
| 80-90 | Next steps | Schedule refinement meetings, assign homework |

#### What We Bring

- v0 ICP scoring framework (built from CRM data in Track B)
- Current state assessment (tech stack compatibility, data quality scorecard)
- ABM platform comparison matrix
- Definition Alignment Document (pre-filled with our recommendations)
- Questions list: What criteria do your best AEs use to pick accounts? Which recent deals were surprises (won unexpectedly)? Where does marketing-to-sales handoff break down today?

#### What We Leave With

- Validated (or corrected) ICP criteria and scoring weights
- Platform preference direction (or clear evaluation criteria for vendor demos)
- Confirmed definitions (or specific blockers requiring executive resolution)
- Refinement loop scheduled (3-4 additional meetings over 2-3 weeks)
- Clear homework: customer provides sales team input on "best fit" accounts, competitive landscape, and budget approval path

---

### 1c. Alignment Loop & Strategic Meeting Cadence

> **Purpose:** Iterate on ICP framework, target account list, buying committee mapping, and campaign architecture until sign-off.

#### The Pattern

```
Kickoff Call (validate ICP assumptions)
    |
Process feedback -> v1 ICP + scoring model
    |
Meeting 2 (refine ICP scoring, platform decision) -> v2
    |
Meeting 3 (buying committee personas, engagement sequences) -> v3
    |
Meeting 4 (target account list review, campaign architecture) -> v4
    |
Final Review -> Sign-off
```

#### Before Each Meeting

1. Process previous meeting transcript/notes
2. Update ICP scoring model, account list, or campaign plan (v[n-1] -> v[n])
3. Prepare questions for next validation round

#### During Each Meeting

1. Walk through current version of the working asset
2. Capture corrections and refinements
3. Validate what's now CONFIRMED
4. Identify remaining ASSUMED items

#### After Each Meeting

1. Update ICP scoring, account enrichment, or campaign sequences
2. Track what moved from ASSUMED -> CONFIRMED
3. Update working documents

#### ABM-Specific Meeting Types

| Meeting Type | Focus | Stakeholder |
|--------------|-------|-------------|
| ICP & Scoring Review | Finalize ICP criteria weights, validate scoring model | VP Sales, Sales Ops, RevOps |
| Platform Selection | Vendor demos, feature comparison, budget approval | CMO/CRO, IT, RevOps |
| Buying Committee Design | Define personas, map pain points, design messaging | Sales Leadership, Marketing |
| Account List Validation | Review tiered list, validate strategic fit, flag removals | VP Sales, Regional Leaders |
| Campaign Architecture | Channel mix, sequencing, content plan, budget allocation | VP Marketing, Demand Gen |
| Final Review | Full walkthrough of strategic package, sign-off | All stakeholders |

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 3-5 days (CRM data pull + analysis) |
| Kickoff call | Day 1 of engagement |
| Meeting loop | 2-4 weeks (4-5 meetings typical) |
| Platform vendor demos | Overlap with meeting loop (1-2 weeks) |
| Final review + sign-off | When all inputs CONFIRMED |

---

### 1d. Strategic Sign-Off

> **Purpose:** Confirm we have everything before proceeding to ABM platform implementation.

#### Validation Checkpoint

- Definition Alignment Document signed off by CMO, CRO, and RevOps leader
- ICP scoring framework finalized with weighted criteria
- Target account list built, tiered, and validated by sales leadership
- Buying committee personas defined with messaging per role
- ABM platform selected and budget approved
- Campaign architecture approved (channel mix, tier-based engagement model, content plan)
- Ad spend budget confirmed and allocated by tier
- All critical inputs CONFIRMED (vs ASSUMED)
- No blockers for engineering

#### Decision Point

- **Proceed to Engineering** -> Customer wants full ABM platform implementation, integrations, and campaign launch
- **Partial proceed** -> Customer wants platform implementation only (campaigns to be managed internally); scope Engineering to platform + CRM integration, skip campaign build

---

## Phase 2: Engineering

> **Goal:** Build the ABM technology infrastructure: platform configuration, CRM integration, intent data setup, campaign infrastructure, and pilot campaign execution.
>
> **Output:** Fully configured ABM platform integrated with CRM, intent data flowing, campaign infrastructure live, pilot campaign validated.

### Project Type

| Type | Engineering Weight | Example |
|------|-------------------|---------|
| Strategic-heavy | N/A | ABM/ABS is never strategic-only -- platform implementation is core |
| Balanced | Heavy (50-60%) | ABM/ABS typical -- significant platform, integration, and campaign build |
| Technical-heavy | Heavy (70-80%) | Client already has strategy; needs platform migration or rebuild |

### Sub-Phases

```
2a Tech Spec -> 2b Engineering Handoff -> 2c Build -> 2d Test (Pilot Campaign)
```

---

### 2a. Tech Spec

> **Purpose:** Translate strategic package into technical specifications for ABM platform configuration, integrations, and campaign setup.

**Input:** Signed-off strategic package from Phase 1 (ICP scoring model, target account list, buying committee personas, platform selection, campaign architecture)

**What happens:**

1. Translate ICP criteria -> platform scoring configuration
2. Map buying committee personas -> engagement sequences
3. Output draft technical specification

**Output:** Draft tech spec containing:

- **Platform Configuration:** Admin settings, user roles/permissions, account matching rules
- **CRM Integration:** Field mappings (strategic terms -> CRM fields), data sync configuration (accounts, contacts, opportunities, activities), bidirectional flow requirements
- **Intent Data Setup:** Intent topic keywords, third-party intent feed configuration, first-party tracking (website visits, content engagement), scoring model parameters, alert thresholds
- **Campaign Infrastructure:** Ad platform connections (LinkedIn, Google, programmatic), audience segments by tier/persona, website personalization rules, sales engagement integration (Outreach/Salesloft sequences)
- **Build Sequence:** Platform core config -> CRM integration -> intent data -> ad platforms -> website personalization -> sales engagement -> pilot launch

---

### 2b. Engineering Handoff

> **Purpose:** Review tech specs with engineer before building.

**Who attends:** Architect + Engineer (or platform implementation specialist)

**Agenda (45-60 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Strategic context | Architect explains ICP rationale, tier strategy, persona logic |
| 15-30 | Walk through tech spec | Platform config, integration requirements, scoring model |
| 30-45 | Engineer questions | Clarify CRM data model, integration constraints, API limits |
| 45-60 | Refine and approve | Adjust specs for technical feasibility, confirm build sequence |

**What Architect brings:**

- Strategic package (ICP framework, target accounts, personas, campaign plan)
- Draft tech spec (from 2a)
- CRM data quality scorecard (from 1a Track B)
- Platform vendor documentation and integration guides

**What engineer leaves with:**

- Approved tech spec with build sequence
- CRM field mapping document
- Known risks: data quality issues, API rate limits, account matching complexity
- Clear dependencies: what must be built before what

---

### 2c. Build (Configure)

> **Purpose:** Build the ABM technology stack -- platform configuration, integrations, and campaign infrastructure.

**Input:** Approved tech spec from 2b

**Build sequence and components:**

#### Component 1: ABM Platform Core Configuration

- Create platform account, configure admin settings
- Set up user roles and permissions (marketing admins, sales users, RevOps admins)
- Configure account matching rules to link platform data to CRM accounts
- Import target account list with tier tags

#### Component 2: CRM Integration

- Connect CRM (Salesforce/HubSpot) via native integration or API
- Configure bidirectional data sync: accounts, contacts, opportunities, activities
- Map CRM fields to platform fields (account tier, ICP score, buying committee role)
- Verify data flow in both directions with test records
- Configure account hierarchy handling (parent/child relationships)

#### Component 3: Intent Data & Account Scoring

- Define intent topics (product keywords, competitor names, pain point terms)
- Configure third-party intent data feeds within platform
- Set up first-party intent tracking (website visitor identification, content engagement)
- Build account scoring model combining intent signals + engagement data + ICP fit
- Define score thresholds for "surging" accounts
- Configure automated alerts to sales when accounts cross thresholds
- Test scoring with known active accounts to validate model accuracy

#### Component 4: Account-Based Advertising

- Connect ABM platform to ad channels (LinkedIn Campaign Manager, Google Ads, programmatic DSP)
- Upload target account lists to LinkedIn for matched audiences
- Configure IP-based targeting for programmatic display (if applicable)
- Create audience segments by tier and persona
- Set up retargeting for website visitors from target accounts
- Define budget allocation by tier (Tier 1: highest per-account spend)
- Build initial ad creatives aligned with persona messaging from Phase 1

#### Component 5: Website Personalization

- Implement ABM platform's website personalization code/script
- Create personalized content variants for key pages (homepage, product, pricing)
- Define personalization rules by account tier, industry, or persona
- Set up personalized CTAs for target account visitors
- Configure reverse-IP identification to recognize account visitors
- Test personalization with sample accounts from each tier

#### Component 6: Sales Engagement Integration

- Connect sales engagement platform (Outreach/Salesloft) to ABM platform
- Sync target account lists and engagement data
- Configure activity tracking to flow back to ABM platform
- Set up automated triggers: intent signal -> sales alert -> outreach sequence enrollment
- Build email templates aligned with persona messaging from Phase 1
- Create sequences for each tier and persona combination

**Execution approaches:**

| Approach | When to Use |
|----------|-------------|
| Manual build | First ABM implementation for this client; complex CRM |
| Assisted build | Platform config patterns established; standard CRM setup |

---

### 2d. QA / Test + Sign-Off (Pilot Campaign)

> **Purpose:** Verify the build works through a pilot campaign with Tier 1 accounts, then get customer approval.

**Two types of testing:**

| Type | Who | Purpose |
|------|-----|---------|
| Technical Testing | Our team | Verify integrations, data flow, scoring, and alerts work |
| Pilot Campaign | Joint | Validate ABM motion end-to-end with real accounts |

**Technical testing checklist:**

- CRM data syncing correctly in both directions
- Account matching rules working (no orphaned accounts)
- Intent data flowing and populating account scores
- Score thresholds triggering alerts correctly
- Ad platforms receiving and matching target account lists
- Website personalization displaying correct content per tier
- Sales engagement sequences enrolling contacts correctly
- Reporting dashboards showing accurate data

**Pilot campaign execution (10-20 Tier 1 accounts):**

- Select 10-20 Tier 1 accounts for pilot -- choose accounts with known engagement signals
- Activate advertising campaigns targeting pilot accounts
- Launch personalized website experiences for pilot accounts
- Initiate sales outreach sequences to mapped buying committee members
- Coordinate marketing and sales touchpoints (avoid overwhelming accounts)
- Monitor engagement signals daily during 2-3 week pilot period
- Document learnings and issues in real-time

**Pilot measurement:**

- Ad impressions and clicks from target accounts
- Website visits from target accounts (before vs. after)
- Account engagement score changes
- Sales conversations generated
- Email open/reply rates by persona
- Any technical issues or data discrepancies

**Engineering sign-off checkpoint:**

- All integrations functioning correctly
- Pilot campaign generated measurable engagement lift
- Account scoring model validated against known active accounts
- Sales alerts firing appropriately (not too many, not too few)
- Customer has reviewed pilot results and approved full rollout
- Ready for enablement

**Decision point:**

- **Proceed to Enablement** -> Pilot validated, scale to full target account list during/after enablement
- **Loop back to Build** -> Scoring model needs tuning, integrations have issues, pilot results below baseline

---

## Phase 3: Enablement

> **Goal:** Sales and marketing teams can operate the ABM/ABS motion independently -- interpreting intent signals, running campaigns, and engaging target accounts effectively.
>
> **Output:** Trained teams with documentation, full-scale campaign live across all tiers, no critical issues.

### Sub-Phases

```
3a Training Prep -> 3b Training Sessions -> 3c Hypercare -> 3d Enablement Sign-Off
```

---

### 3a. Training Prep

> **Purpose:** Create training materials from strategic documentation, tech specs, and pilot learnings.

**Input:** Strategic package + tech specs + pilot campaign results + built system

**What happens:**

1. Gather all project documentation
2. Generate draft training materials segmented by audience
3. Architect reviews, refines, and adds pilot-specific examples

**Output:** Training package containing:

- **Sales Training Kit:** Intent signal interpretation guide, account scoring explainer, "when to reach out vs. when to wait" rules, buying committee engagement playbook, ABM platform quick-reference card
- **Marketing Training Kit:** ABM platform admin guide, campaign creation workflows, ad platform management, website personalization configuration, reporting dashboard walkthrough
- **RevOps Training Kit:** Platform maintenance tasks, data sync monitoring, scoring model tuning process, troubleshooting guide
- **Leadership Briefing:** ABM program goals and KPIs, how to read the executive dashboard, expected timeline to ROI
- **FAQ Document:** Based on pilot learnings and common questions from similar ABM implementations

---

### 3b. Training Sessions

> **Purpose:** Transfer knowledge to customer team so they can operate ABM independently.

**Training delivery by stakeholder:**

| Session | Audience | Topics | Duration |
|---------|----------|--------|----------|
| Executive Briefing | CMO, CRO, VP Marketing, VP Sales | ABM program goals, KPIs, how to interpret the executive dashboard | 30 min |
| Sales ABM Workflow | AEs, SDRs/BDRs, Sales Management | Intent signals, account scores, when to engage, buying committee playbook, sales engagement sequences | 60 min |
| Marketing Campaign Ops | Demand Gen, Marketing Ops, Content | ABM platform admin, campaign creation, ad targeting, website personalization, email integration, reporting | 90 min |
| RevOps Platform Management | RevOps Manager, CRM Admin | Platform maintenance, data sync, scoring model tuning, troubleshooting | 60 min |

**Key training emphasis for sales -- ABM timing discipline:** ABM requires a different approach than traditional outbound. Sales must understand that early intent signals are marketing's territory. The handoff to sales outreach happens when accounts cross defined score thresholds. Jumping on accounts too early wastes the coordinated campaign investment and can alienate prospects.

**Training delivery:**

1. Schedule sessions with appropriate stakeholders (spread across 1-2 weeks)
2. Deliver training live with Q&A
3. Record video walkthroughs for future reference and onboarding new team members
4. Note gaps and additional questions for FAQ document

**Output:**

- Trained stakeholders across sales, marketing, and RevOps
- Video recordings for each session
- Updated FAQ based on training questions

---

### 3c. Hypercare

> **Purpose:** Intensive post-launch support as ABM campaigns scale from pilot to full target account list.

**Duration:** 4-6 weeks (covers pilot scale-up and first full campaign cycle)

**What happens during hypercare:**

- **Week 1-2:** Scale campaigns from pilot to Tier 2 and Tier 3 accounts. Apply pilot learnings to campaign templates and sequences. Monitor for technical issues as volume increases.
- **Week 3-4:** Tune scoring model based on expanded data. Adjust ad spend allocation based on performance by tier. Refine sales alert frequency (too many alerts = noise; too few = missed opportunities).
- **Week 5-6:** Stabilize campaign performance. Document optimization insights. Transition from daily monitoring to weekly cadence.

**Support channels:**

- Office hours: Weekly 30-min slot for sales + marketing questions
- Email: Quick response to bugs, data issues, and campaign questions
- Escalation: Platform vendor support for technical issues

**When to extend:** If scoring model accuracy is below 70%, integrations are dropping data, or engagement rates from target accounts are not lifting above baseline after 4 weeks.

**Output:** Stabilized full-scale ABM program, no critical issues outstanding

---

### 3d. Enablement Sign-Off

> **Purpose:** Confirm customer can operate ABM program independently.

**Validation checkpoint:**

- All training sessions delivered (sales, marketing, RevOps, leadership)
- Training recordings and documentation provided
- Full-scale campaign live across all tiers
- Hypercare period complete with no critical issues outstanding
- Sales team successfully engaging surging accounts using ABM workflow
- Marketing team managing campaigns independently (ad refreshes, personalization updates)
- RevOps team maintaining platform (data sync, scoring tuning, troubleshooting)
- ABM governance meeting cadence established (weekly sync, monthly review)
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** -> Customer is enabled, ABM program running, project wrapping up
- **Extend Hypercare** -> Scoring model still inaccurate, campaign performance below target, team confidence low

---

## Phase 4: Handoff

> **Goal:** Clean project close with ABM maintenance plan established and retention/expansion path set.
>
> **Output:** Maintenance schedule documented (account refresh, campaign optimization, governance), internal context transferred, customer owns the ABM program, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule -> 4b Internal Handoff -> 4c External Handoff -> 4d Project Close
                            (SME -> Architect)      (LeanScale -> Customer)  (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|---------------------|---------------|
| **Single Project** | Customer owns | 4c (External Handoff) -- customer receives maintenance schedule and runs it themselves |
| **Dedicated (Multi-Project)** | Architect owns | 4b (Internal Handoff) -- Architect receives maintenance schedule and runs it for customer |

---

### 4a. Maintenance Schedule

> **Purpose:** Document what needs ongoing attention after the project is complete -- account refresh cadences, campaign optimization tasks, governance rhythms, and triggers for re-engagement.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|-------------------|
| Target Account Engagement Review | % of target accounts showing multi-channel engagement | <20% of Tier 1 accounts engaged in trailing 30 days |
| Campaign Performance Check | Ad CTR, email open/reply rates, website personalization lift | CTR <0.3% on LinkedIn, open rates <15% |
| Scoring Model Accuracy Audit | Are surging alerts leading to sales conversations? | <30% of alerts converting to sales conversation |
| Data Hygiene Audit | CRM-ABM sync errors, duplicate accounts, missing contacts | >5% sync error rate or >50 unmatched accounts |
| Buying Committee Coverage Update | New contacts identified, departed contacts flagged | Tier 1 accounts with <3 active contacts |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|----------------|-------------------|
| Target Account List Refresh | ICP fit revalidation, add new accounts, remove disqualified | Re-run ICP scoring against updated CRM data |
| ICP Criteria Revalidation | Have win patterns changed? New segments emerging? | Adjust scoring weights, add/remove criteria |
| Scoring Model Recalibration | Compare predicted vs actual outcomes for surging accounts | Tune thresholds and signal weights |
| Campaign Channel Mix Analysis | Which channels drive engagement by tier? ROI by channel | Reallocate budget from underperforming channels |
| Buying Committee Persona Review | Are persona pain points and messaging still resonating? | Update messaging templates and engagement sequences |

**After First Business Cycle (60-90 days post-launch):**

- Pipeline from Target Accounts: Has ABM-sourced pipeline increased? Compare target account pipeline contribution vs. non-target baseline.
- Conversion Rate Lift: Are target accounts converting MQA -> opportunity at higher rates than non-target accounts? ABM Tier 1 accounts should show 20-40% faster pipeline velocity.
- Sales + Marketing Alignment Score: Are weekly ABM syncs happening? Is the shared dashboard being used? Are SLAs for surging account follow-up being met?
- Key Question: Is the ABM investment generating measurable lift above what the team was achieving with their previous targeting approach?

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Target account engagement decline | <15% engagement rate for 2+ consecutive months | Re-evaluate ICP criteria, refresh account list |
| Pipeline contribution stall | ABM-sourced pipeline <10% of total for 2+ quarters | Reassess campaign strategy, evaluate platform ROI |
| Scoring model drift | Alert-to-conversation rate drops below 25% | Recalibrate scoring model with updated conversion data |
| Sales adoption decline | <50% of surging alerts followed up within SLA | Retrain sales team, adjust alert frequency |

**Every 6-12 Months:**

- Full ICP Recalibration: Update all scoring criteria with fresh 12-month closed-won data. Assess new firmographic/technographic signals.
- Target Account List Overhaul: Complete rebuild of tiered list. Evaluate segment mix shifts, new market entries.
- ABM Platform Evaluation: Is the current platform still the best fit? Evaluate new features, competitor offerings, contract renewal terms.
- Campaign Strategy Refresh: Update messaging, content, channel mix based on full-year performance data. Incorporate industry trends and competitive shifts.

---

### 4b. Internal Handoff (SME -> Architect)

> **Purpose:** Transfer context so Architect can manage ongoing ABM relationship.

**What the Architect needs to know:**

- ICP criteria rationale and how scoring weights were determined
- Target account tiering logic and which accounts are strategic priorities
- ABM platform configuration decisions (why certain thresholds, why certain channels)
- Campaign performance baselines (what "good" looks like for this client)
- Known data quality issues and workarounds
- Customer stakeholder map: who owns what, who responds to what, who the champion is
- Common issues: scoring drift, ad fatigue on Tier 1 accounts, CRM sync lag

**Escalation guidelines:**

| Issue Type | Who Handles |
|-----------|------------|
| Account list updates, adding new target accounts | Architect |
| Campaign refresh, new ad creative, content updates | Architect |
| ICP scoring model changes, new segment addition | SME |
| Platform integration issues, scoring model rebuild | SME |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing it. SME walks Architect through each maintenance task, especially the quarterly account list refresh and scoring recalibration.

---

### 4c. External Handoff (LeanScale -> Customer)

> **Purpose:** Formal project completion with customer.

**Final project meeting:**

- Review what was delivered: ICP framework, target account list, ABM platform configuration, campaign infrastructure, pilot and full-launch results
- Walk through documentation package
- Review ABM program performance vs. initial goals
- Confirm ABM governance model (weekly syncs, monthly reviews, quarterly refreshes)
- Walk through maintenance schedule in detail
- Answer final questions
- Make it explicit: "Project complete"
- **For Single Project engagements:** Hand over the maintenance schedule (4a) and walk the customer through it step by step

**Documentation package:**

- ICP Criteria Document (final version)
- Target Account List with scoring (exportable, updatable)
- Buying Committee Engagement Playbook
- ABM Platform Admin Guide
- Campaign Playbooks (per tier, per persona)
- Governance Model & Meeting Cadence Reference
- Definition Alignment Document (final version)
- All training video recordings
- FAQ document
- Maintenance Schedule
- Troubleshooting Guide
- Support contact info

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video walkthrough of the walkthrough. Emphasize the quarterly account list refresh and scoring recalibration -- these are the most common tasks to skip, and skipping them causes ABM programs to decay.

**Output:** Customer owns the ABM program. Project formally complete.

---

### 4d. Project Close

> **Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved to proper location
- Handoff documentation complete
- Project status updated in tracking system
- Time/billing finalized

#### Internal Debrief (Optional but Recommended)

- What went well? (e.g., ICP framework resonated, pilot exceeded expectations)
- What would we do differently? (e.g., earlier CRM data quality audit, more vendor demo time)
- Any learnings to feed back into SOPs? (e.g., new ICP scoring patterns, platform gotchas)

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| **Single Project** | Upsell -> Downsell -> Retry |
| **Multi-Project (Dedicated)** | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (ongoing ABM campaign optimization, account list management, scoring tuning)
   | if no
2. Downsell: Another one-time project (Lead Scoring, Attribution, Sales Engagement)
   | if yes
3. Retry retainer at end of next project cycle
```

**Script:**

> "Now that the ABM program is live and your teams are running it, there are two ways we can continue working together. Option 1: We handle ongoing ABM optimization -- account list refreshes, scoring tuning, campaign performance analysis -- as part of managed services. Option 2: If there's another specific project you need help with, like lead scoring or attribution, we can scope that out. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

> "On [date ~quarter out], we'll review how the ABM program is performing -- engagement rates, pipeline contribution, scoring accuracy -- and see if any adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull ABM dashboard data: engagement rates, pipeline from target accounts, scoring accuracy |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points. |

**At the refinement check-in:**

- Review performance against original ABM program goals
- Identify any adjustments needed (ICP drift, scoring model decay, campaign fatigue)
- If minor: Architect handles tweaks (ad refresh, account list additions)
- If major: Scope new project (ICP overhaul, platform migration, new market ABM launch)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- ICP Criteria Document: Weighted scoring framework with firmographic, technographic, and behavioral criteria
- Tiered Target Account List: 50-500 accounts across 3 tiers with scoring, enriched data, and buying committee mapping
- Buying Committee Persona Profiles: Role definitions, pain points, messaging themes, content preferences per persona
- ABM Platform Recommendation: Platform comparison with rationale for selection
- Campaign Architecture: Channel mix, engagement sequences, and content plan by tier and persona

**Technical Deliverables:**

- Configured ABM Platform: Full setup including CRM integration, intent data, scoring model, and alerts
- Campaign Infrastructure: Ad platform connections, website personalization, sales engagement integration
- ABM Performance Dashboard: Live reporting on target account engagement, pipeline contribution, and campaign ROI
- Automated Workflows: Intent signal -> sales alert -> outreach sequence enrollment

**Documentation Package:**

- Training video recordings (4 sessions: leadership, sales, marketing, RevOps)
- ABM Platform Admin Guide
- Buying Committee Engagement Playbook
- Campaign Operations Runbook
- FAQ document
- Definition Alignment Document (final version)
- Maintenance Schedule
- Troubleshooting Guide
- ABM Governance Model & Meeting Cadence Reference

---

## Appendix: Implementation Guide

> Reference material for Architect. This section does not change per project.

---

### What This Document Is

This is the **implementation playbook** -- the step-by-step execution guide an Architect follows to deliver an ABM/ABS Process and System project from first contact to project close. It is the third file in a 3-file playbook structure:

| File | Purpose | Audience |
|------|---------|----------|
| `1-advisory.md` | What the project IS -- positioning, outcomes, approaches | Architect + Sales (scoping) |
| `2-methodology.md` | HOW we think about ABM/ABS -- frameworks, concepts, best practices | Architect (depth understanding) |
| `3-implementation.md` | WHAT to DO -- step-by-step execution with checklists | Architect (daily execution) |

### What Each Phase Produces

| Phase | Output | Gate Criteria |
|-------|--------|---------------|
| **Phase 1: Strategy** | Signed-off ICP framework, tiered account list, persona map, platform rec, campaign plan | CMO/CRO have approved ICP, accounts, platform, and campaign architecture |
| **Phase 2: Engineering** | Configured ABM platform, CRM integration, campaign infra, validated pilot | All integrations working, pilot campaign shows measurable engagement lift |
| **Phase 3: Enablement** | Trained sales + marketing + RevOps teams, full-scale campaign live | All training delivered, teams operating independently, governance cadence established |
| **Phase 4: Handoff** | Independent customer + archived project | Internal/external handoffs complete, maintenance plan in place, project closed |

### How to Adapt Per Project Type

ABM/ABS projects are typically **Balanced** -- significant strategy work (ICP, accounts, personas) and significant engineering work (platform, integrations, campaigns), with moderate enablement. Specific adaptation guidance:

| Project Profile | Strategy Weight | Engineering Weight | Enablement Weight | When |
|-----------------|-----------------|-------------------|-------------------|------|
| **Full ABM Build (typical)** | 30-40% | 40-50% | 15-20% | Greenfield ABM -- no existing program or platform |
| **Platform Migration** | 10-20% | 60-70% | 15-20% | Switching from one ABM platform to another |
| **ABM Strategy Only** | 60-70% | 10-20% | 15-20% | Client has platform; needs ICP/account strategy |
| **Campaign Expansion** | 20-30% | 40-50% | 20-30% | Existing ABM program; adding new tiers or markets |

**Adaptation rules:**

- **Light phases** can compress sub-phases (e.g., Platform Migration may compress Phase 1 to ICP revalidation only)
- **Heavy phases** expand with more sub-steps, more meetings, more runs
- **Phase 4 always applies** -- every ABM project needs handoff, but maintenance complexity varies
- Mark phases as `[SKIP]` or `[LIGHT]` in the One-Pager if they don't fully apply

---

## References

[1] MarketOne - 6 Common ABM Mistakes to Avoid

[2] UserGems - Why B2B Account Based Marketing Campaigns Fail

[3] RevvGrowth - Account-Based Marketing Benchmarks

[4] AdRoll - 17 ABM Stats That Will Make You Rethink Your 2026 B2B Marketing Strategy

[5] TheCMO - 30 Eye-Opening ABM Statistics That Prove Its Effectiveness

[6] IMPACT - 5 Most Common Problems with B2B Account-Based Marketing

[7] CIENCE - 10 Common Account-Based Marketing Mistakes to Avoid