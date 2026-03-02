# Marketing Automation Platform Implementation — Implementation

## Project One-Pager

### Marketing Automation Platform Implementation One-Pager

#### Project Type

- Category: Technical
- Primary Deliverable: Fully configured marketing automation platform (HubSpot, Marketo, or Pardot) integrated with CRM, with lead scoring, nurture workflows, routing, reporting dashboards, and email deliverability operational

##### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Med | 3-5 discovery sessions, requirements gathering, scope |
| 2. Engineering | Yes | Heavy | Data migration, platform config, CRM integration |
| 3. Enablement | Yes | Med | Marketing + sales training, hypercare period |
| 4. Handoff | Yes | Med | Internal + external handoff, maintenance documentation |

#### Phase Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. STRATEGY  │────▶│ 2. ENGINEER  │────▶│3. ENABLEMENT │────▶│  4. HANDOFF  │
│     Med      │     │    Heavy     │     │     Med      │     │     Med      │
│ 1a→1b→1c→1d │     │ 2a→2b→2c→2d │     │ 3a→3b→3c→3d │     │ 4a→4b→4c→4d │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘

3-5 discovery        Data migration +     Mktg + Sales        Internal + external
sessions + scope     platform config      training + hypercare handoff + maint
```

**This project's flow:**

- Full 4-phase. Medium strategy (requirements + platform selection), heavy engineering (data migration + full platform configuration), medium enablement (marketing team + sales team training), standard handoff.
- Migration projects add a data migration workstream in Phase 2 that net-new implementations skip.
- Platform selection only applies to new implementations where the platform is not yet chosen.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Watch intro video explaining what marketing automation implementation covers and why it matters
- Complete intake form: current tech stack, platform preference (if any), team size, campaign types, integrations needed
- Provide admin access to legacy platform (if migration)
- Provide CRM admin access (Salesforce or HubSpot CRM)
- Share brand assets (logos, colors, fonts) for template creation
- Complete Definition Alignment Document for key terms (MQL, SQL, lifecycle stages, lead scoring thresholds)

##### Track B: Architect Prep

- Pull current platform audit data (if migration): active campaigns, workflows, custom fields, integrations
- Run CRM field mapping diagnostic against target platform
- Create v0 implementation roadmap with estimated timeline
- Draft data migration strategy (if migration) or platform configuration plan (if new)
- Prepare platform comparison matrix (if platform not yet selected)

#### Refinement Loop (1b -> 1c -> 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present v0 roadmap, validate requirements, audit | VP Marketing, Marketing Ops, RevOps | Requirements confirmed, info for v1 |
| Refinement 1 | 1c | Review data mapping, platform config decisions | Marketing Ops, Sales Ops | Approved field mapping, config plan |
| Refinement 2 | 1c | Review lead scoring model, nurture strategy | VP Marketing, Demand Gen | Scoring criteria + nurture logic |
| Sign-Off | 1d | Final scope approval, timeline confirmation | All stakeholders | Signed-off implementation plan |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held
- 1c. Refinement loop complete (v0 -> vFinal)
- 1d. Strategic sign-off obtained

##### Phase 2: Engineering

- 2a. Tech spec created (data mapping + platform config spec)
- 2b. Engineering handoff meeting held
- 2c. Build complete (data migration + platform configuration + CRM integration + assets + automation)
- 2d. QA/Test + customer sign-off (system test + end-to-end test + UAT)

##### Phase 3: Enablement

- 3a. Training materials prepped
- 3b. Training sessions delivered (marketing team + sales team)
- 3c. Hypercare period complete (2 weeks post-launch)
- 3d. Enablement sign-off

##### Phase 4: Handoff

- 4a. Maintenance schedule documented and handed off
- 4b. Internal handoff (SME -> Architect) complete
- 4c. External handoff (delivery team -> customer) complete
- 4d. Project closed and archived

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| Requirements intake form | Capture stakeholder needs, integrations, KPIs | All fields filled, validated at kickoff |
| Data mapping spreadsheet | Map fields between legacy system and new platform | All fields mapped, transformations noted |
| Platform comparison matrix | Evaluate platform options (new impl only) | Recommendation approved |
| Lead scoring criteria doc | Define scoring rules and thresholds | Scoring model signed off |
| Nurture flow diagrams | Map buyer journey stages to nurture tracks | All branches documented |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| Implementation roadmap | Requirements + intake | Internal alignment, timeline mgmt |
| Data migration report | Data mapping spreadsheet | Audit trail, validation |
| Platform configuration document | Tech spec + build outputs | System documentation |
| Dashboard and reporting package | Reporting requirements | Ongoing campaign performance tracking |
| Training materials package | Config doc + system builds | Team onboarding, ongoing reference |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Leadership | VP Marketing, CMO | Dashboard interpretation, campaign attribution, ROI tracking | 30m |
| Marketing | Marketing Ops, Demand Gen, Content | Campaign creation, nurture management, list building | 90m x 2 |
| Technical | RevOps, Admin | Platform admin, CRM sync monitoring, troubleshooting | 60m |
| Sales | Sales Reps, Sales Managers | Lead context in CRM, MQL follow-up process, SLA expectations | 45m |

##### Hypercare

- Applies: Yes
- Duration: 2 weeks post go-live
- Office Hours: Yes — daily standup first week, then weekly 30-min slot

##### Training Assets to Create

- Video walkthrough: Platform navigation and core features
- Video walkthrough: Campaign creation workflow (email + landing page + form)
- Video walkthrough: Dashboard and reporting
- Video walkthrough: Lead scoring model explanation and monitoring
- Doc: Platform SOPs (create email, build list, send campaign, create form)
- Doc: CRM integration field mapping reference
- Doc: Troubleshooting guide for common issues
- Doc: Quick-reference cards for daily use

#### Handoff & Retention

##### Internal Handoff (SME -> Architect)

- Key context for Architect: Platform configuration decisions, CRM integration architecture, lead scoring model logic, known quirks with specific integrations
- Escalation trigger: Any changes to lead scoring model, CRM sync field mapping, workflow automation logic, or email domain configuration

##### External Handoff

- Final meeting agenda: Review all deliverables, walk through maintenance schedule, confirm no outstanding issues, answer final questions
- Documentation package: Training video recordings, SOPs, field mapping reference, troubleshooting guide, FAQ, maintenance schedule

##### Maintenance Schedule

- Monthly: email deliverability monitoring, lead flow audit, scoring model accuracy check
- Quarterly: full funnel conversion review, nurture program performance audit, CRM sync health check
- Who owns: Single Project = customer owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services -> if no -> Downsell: Another project (e.g., ABM, Advanced Attribution, Nurture Optimization) -> Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~90 days post go-live
- Decision: Architect handles / SME needed

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| MQL (Marketing Qualified Lead) | A lead that has met demographic and behavioral scoring thresholds indicating sales readiness |
| SQL (Sales Qualified Lead) | A lead that sales has accepted and confirmed as a viable opportunity |
| Lifecycle Stage | The current position of a lead in the buyer journey (Subscriber, Lead, MQL, SQL, Opportunity, Customer) |
| Lead Score | Numeric value assigned based on demographic fit and behavioral engagement signals |
| Score Degradation | Automatic reduction of lead score over time when engagement activity stops |
| Nurture Program | Automated email sequence designed to move leads through buyer journey stages |
| Attribution Model | Method for assigning credit to marketing touchpoints that influenced pipeline and revenue |
| IP Warming | Gradual increase of email send volume on a new sending IP to build sender reputation with ISPs |
| Progressive Profiling | Form technique that asks different questions on each visit to build a complete lead profile over time |

#### Common Gotchas

- Field mapping between Marketo and HubSpot is not 1:1 — custom fields, smart campaigns, and segmentation logic must be manually recreated → Build detailed field mapping doc and validate with test migration first
- Migrating dirty data pollutes the new platform from day one → Deduplicate, clean, and archive old records before migration; use migration as opportunity to start fresh
- Trying to recreate every legacy workflow 1:1 adds unnecessary complexity → Ask "do we still need this?" for every workflow before rebuilding; use migration as a simplification opportunity
- Skipping IP warming on a new sending domain destroys deliverability → Plan a 4-week IP warming schedule; start with 500 emails/day and double weekly
- Insufficient training time means the team goes live unable to use the platform → Build training into the timeline, not as an afterthought; require hands-on practice before go-live
- No hypercare period means post-launch issues fester → Plan 2 weeks of intensive support with daily check-ins
- GDPR/consent data not migrated properly creates compliance risk → Map subscription and consent data explicitly; verify opt-in status transfers correctly
- CRM sync conflicts when field direction is not defined → Document sync direction (MA->CRM, CRM->MA, bidirectional) for every field before enabling sync

#### Methodology Options

| Option | When to Use | Complexity |
|--------|-------------|-----------|
| New Implementation | Client has no existing marketing automation platform | Medium |
| Platform Migration | Client moving from one platform to another (e.g., Marketo -> HubSpot) | High |
| Platform Upgrade | Client staying on same platform but needs reconfiguration | Low-Medium |

---

## Phase 1: Strategy

> **Goal:** Get stakeholder sign-off on requirements, platform selection (if applicable), data migration strategy, and implementation scope.
>
> **Output:** Signed-off requirements document + implementation roadmap + Definition Alignment Document + data mapping spreadsheet (migration).

### 1a. Pre-Kickoff

> Two parallel tracks run after the deal closes and before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video | Explain what MAP implementation covers and why it matters | Video (5-10 min) |
| Definition Alignment Document | Get stakeholder sign-off on MQL, SQL, lifecycle stages | Google Doc |
| Requirements intake form | Current stack, integrations, campaign types, team skills | Google Form or Doc |
| Access request checklist | Legacy platform admin, CRM admin, DNS, brand assets | Checklist |

**Completion tracking:** Marketing Ops or RevOps point-of-contact follows up. Do not cancel kickoff if incomplete, but push hard — missing access credentials are the most common delay.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Gather inputs (intake form, system access, legacy platform audit) | Raw data collected |
| 2 | Audit legacy system (if migration) | Complete inventory: campaigns, fields, workflows |
| 3 | Generate draft field mapping | Data mapping spreadsheet (source -> target) |
| 4 | Current state assessment: what works, what is broken, what is missing | Gap analysis document |
| 5 | Build v0 implementation roadmap with timeline and resource needs | Implementation roadmap + platform comparison (if new) |
| 6 | Prepare kickoff call assets | Presentation, questions list, diagrams |

**Critical:** Mark everything as ASSUMED. The kickoff call validates.

#### Stakeholder Alignment Document

> Get stakeholder sign-off on terms BEFORE building anything.

| Term | Our Definition | Internally Approved? |
|------|----------------|----------------------|
| MQL | Lead meeting demographic + behavioral scoring thresholds indicating sales readiness | [ ] Yes / [ ] No |
| SQL | Lead accepted by sales as viable opportunity after qualification | [ ] Yes / [ ] No |
| Lifecycle Stages | Subscriber -> Lead -> MQL -> SQL -> Opportunity -> Customer | [ ] Yes / [ ] No |
| Lead Score Threshold | Minimum score that triggers MQL status and sales notification | [ ] Yes / [ ] No |
| Score Degradation | Points removed after X days of inactivity | [ ] Yes / [ ] No |
| Attribution Model | First-touch, last-touch, multi-touch, or W-shaped credit assignment | [ ] Yes / [ ] No |

**Instructions to customer:**

> Review each definition with your marketing and sales leadership. Check "Yes" when approved. We cannot proceed with lead scoring or lifecycle configuration until all terms are aligned.

---

### 1b. Kickoff Call

> **Purpose:** Present v0 roadmap and audit findings. Customer reacts and validates, not creates from scratch.

#### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through v0 roadmap | "Here's what we built from your intake and audit" |
| 15-30 | Validate requirements | ASSUMED requirements -> CONFIRMED or corrected |
| 30-40 | Review legacy audit (migration) | Current workflows, what to keep vs. deprecate |
| 40-50 | Definition alignment | Review Definition Alignment Doc, flag disagreements |
| 50-60 | Integrations and data quality | Confirm integration list, discuss data cleanup needs |
| 60+ | Next steps | Schedule refinement meetings, assign access homework |

#### What We Bring

- v0 implementation roadmap (built in Track B prep)
- Legacy platform audit report (migration only)
- Draft data mapping spreadsheet (migration only)
- Questions list (what we need to validate)
- Definition Alignment Document (pre-filled with our recommendations)
- Platform comparison matrix (new implementation only)

#### What We Leave With

- Feedback and corrections on v0 (info needed to create v1)
- Confirmed requirements and integration list
- Platform selection decision (new implementation) or migration scope (migration)
- Definition alignment status (approved or blockers identified)
- Clear homework assignments (theirs and ours)

---

### 1c. Alignment Loop & Strategic Meeting Cadence

> **Purpose:** Iterate on requirements and config plan until sign-off.

#### The Pattern

```
Kickoff Call (validate requirements)
    |
    v1 roadmap + mapping doc
    |
Meeting 2 (review data mapping + config decisions) -> v2
    |
Meeting 3 (review scoring model + nurture strategy) -> v3
    |
Final Review -> Sign-off
```

#### Before Each Meeting

1. Process previous meeting transcript/notes
2. Update data mapping doc and implementation roadmap (v[n-1] -> v[n])
3. Prepare questions for next validation round

#### During Each Meeting

1. Walk through current version of roadmap and config spec
2. Capture corrections and refinements
3. Validate what is now CONFIRMED
4. Identify remaining ASSUMED items

#### After Each Meeting

1. Update technical specification
2. Track what moved from ASSUMED -> CONFIRMED
3. Update working documents

#### Meeting Schedule

| Meeting Type | Focus | Stakeholder |
|--------------|-------|-------------|
| Data & Integration | Field mapping, CRM sync architecture, data cleanup scope | Marketing Ops, Sales Ops, RevOps |
| Scoring & Nurture | Lead scoring criteria, nurture program design, routing | VP Marketing, Demand Gen |
| Platform Selection | Platform comparison review (new implementation only) | VP Marketing, Finance, RevOps |
| Final Review | Full walkthrough, sign-off | All stakeholders |

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 3-5 days |
| Kickoff call | Day 1 of engagement |
| Meeting loop | 1-2 weeks (2-3 refinement meetings) |
| Final review + sign-off | When all requirements CONFIRMED |

---

### 1d. Strategic Sign-Off

> **Purpose:** Confirm we have everything before proceeding to engineering.

#### Validation Checkpoint

- Definition Alignment Document signed off by stakeholders
- Requirements validated and integration list confirmed
- Data mapping spreadsheet reviewed (migration) or platform selected (new)
- Lead scoring criteria and thresholds approved
- Nurture program strategy documented
- Go-live criteria and acceptance tests defined
- All critical inputs CONFIRMED (vs ASSUMED)
- No blockers for engineering

#### Decision Point

- **Proceed to Engineering** — Always. This project type requires technical build.
- This project does NOT have a natural exit point after Phase 1. The deliverable is a configured system, not a strategic document.

---

## Phase 2: Engineering

> **Goal:** Build the complete marketing automation platform: data migration, platform configuration, CRM integration, marketing assets, automation workflows, reporting.
>
> **Output:** Fully configured and tested marketing automation platform ready for go-live.

| Project Type | Engineering Weight | Scope |
|--------------|-------------------|-------|
| New Implementation | Heavy (70%) | Full platform setup, no data migration |
| Platform Migration | Heavy (80%) | Full platform setup + data migration + asset recreation |

### Sub-Phases

```
2a Tech Spec -> 2b Engineering Handoff -> 2c Build -> 2d Test
```

---

### 2a. Tech Spec

> **Purpose:** Translate strategic requirements into technical configuration specifications.

**Input:** Signed-off requirements document + data mapping spreadsheet + scoring criteria

**Output:** Draft tech spec containing:

- Field mapping document: legacy field -> new platform field (with transformations)
- CRM sync specification: field-by-field sync direction (MA->CRM, CRM->MA, bidirectional)
- Lead scoring configuration: demographic criteria, behavioral criteria, negative scoring, thresholds
- Lifecycle stage configuration: stage definitions, transition rules, SLA alerts
- Email domain configuration: SPF, DKIM, DMARC records needed
- IP warming schedule (if new sending domain)
- Nurture program logic: enrollment triggers, branch logic, exit criteria, send cadence
- Lead routing rules: assignment logic, notification workflows, SLA monitoring
- Integration specifications: which platforms connect, API vs native, data flow direction
- Reporting configuration: dashboard layouts, attribution model, KPI calculations
- Build sequence: what to build first, dependencies between components

---

### 2b. Engineering Handoff

> **Purpose:** Review tech specs with engineer before building.

**Who attends:** Architect + Engineer (or engineering team)

**Agenda (45-60 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through data migration | Architect explains migration scope, field mapping, data cleanup decisions |
| 15-30 | Platform config spec review | Scoring, lifecycle, CRM sync, domain setup, nurture programs |
| 30-45 | Integration architecture | CRM sync rules, API connections, third-party tool integrations |
| 45-60 | Build sequence and risks | Confirm build order, flag dependencies, identify risk areas |

**What Architect brings:**

- Strategic package (requirements, scoring criteria, nurture strategy)
- Draft tech spec (from 2a)
- Data mapping spreadsheet
- Questions list (anything flagged as unclear)

**What engineer leaves with:**

- Approved tech spec
- Clear build sequence with dependencies
- Known risks (data quality issues, integration limitations, timeline constraints)

---

### 2c. Build (Configure)

> **Purpose:** Build the complete marketing automation platform according to approved tech spec.

**Input:** Approved tech spec from 2b

**The build is organized into 6 workstreams, executed in dependency order:**

#### Workstream 1: Data Migration & Cleanup (Migration Only)

| Step | Action | End State |
|------|--------|-----------|
| 1 | Remove duplicate records using deduplication rules | Unique records only |
| 2 | Clean incomplete records (missing required fields) | All records have minimum required data |
| 3 | Standardize field values (country names, job titles, industries) | Consistent data formats |
| 4 | Archive records with no engagement in 24+ months | Active database only |
| 5 | Verify email validity using email verification tool (e.g., NeverBounce, ZeroBounce) | Invalid emails removed |
| 6 | Import test batch of 1,000 contacts to validate field mapping | Mapping verified |
| 7 | Execute full data import in batches | All records migrated |
| 8 | Migrate account/company records | Account hierarchy preserved |
| 9 | Import historical activity data where applicable | Engagement history available |
| 10 | Run data validation scripts: record counts, field population rates | Migration verified |

#### Workstream 2: Core Platform Settings

| Step | Action | End State |
|------|--------|-----------|
| 1 | Configure email sending domain with SPF, DKIM, and DMARC records | Domain authenticated. Fully authenticated domains achieve 2.7x higher inbox placement |
| 2 | Set up tracking domain for link tracking | Click tracking operational |
| 3 | Configure user roles and permissions | Team members have appropriate access |
| 4 | Set up teams and business units (if applicable) | Organizational structure reflected |
| 5 | Configure default timezone and locale settings | Regional settings correct |
| 6 | Enable GDPR/privacy compliance settings (cookie consent, data processing) | Compliance controls active |
| 7 | Set up IP warming schedule if new sending domain (start at 500/day, double weekly over 4 weeks) | Sender reputation building |

#### Workstream 3: Lead Scoring & Lifecycle

| Step | Action | End State |
|------|--------|-----------|
| 1 | Configure demographic/firmographic scoring (title, company size, industry) | Fit scoring active |
| 2 | Map behavioral scoring actions (email opens, form fills, page visits, content downloads) | Engagement scoring active |
| 3 | Implement negative scoring (competitor domains, student emails, invalid addresses) | Disqualification rules active |
| 4 | Configure MQL score threshold and sales-readiness trigger | MQL automation operational |
| 5 | Set up score degradation rules for aging leads | Score decay preventing stale MQLs |
| 6 | Define lifecycle stages (Subscriber, Lead, MQL, SQL, Opportunity, Customer) | Stages configured |
| 7 | Configure stage transition rules (automated for scoring-based, manual for sales actions) | Transitions working |
| 8 | Map lifecycle stages to CRM fields and sync settings | CRM stage sync operational |
| 9 | Set up SLA alerts for stage transitions (e.g., MQL not contacted in 24 hours) | SLA monitoring active |
| 10 | Test scoring and lifecycle with sample records | Logic validated |

Companies implementing lead scoring see 77% higher lead generation ROI than those without. Medium-sized B2B companies report 38% higher conversion rates from lead to opportunity after implementing structured scoring models.

#### Workstream 4: CRM Integration

| Step | Action | End State |
|------|--------|-----------|
| 1 | Enable CRM integration (Salesforce, HubSpot CRM, or other) | Connection established |
| 2 | Map fields between platforms (lead fields, account fields, opportunity fields) | Field mapping complete |
| 3 | Configure sync direction for each field per tech spec | Sync rules defined |
| 4 | Set up selective sync rules (which records sync, which do not) | Selective sync active |
| 5 | Configure campaign/list sync for attribution | Campaign data flowing |
| 6 | Test sync with sample records in both directions | Bidirectional sync verified |
| 7 | Document field mapping and sync rules for maintenance reference | Documentation complete |

#### Workstream 5: Marketing Assets & Automation

| Step | Action | End State |
|------|--------|-----------|
| 1 | Build master email template with brand styling (header, footer, colors, fonts) | Brand template ready |
| 2 | Create nurture email template with dynamic content blocks | Nurture template ready |
| 3 | Build promotional/campaign template and transactional template | Template library complete |
| 4 | Configure personalization tokens and fallback values | Personalization working |
| 5 | Test templates across email clients (Gmail, Outlook, Apple Mail, mobile) | Cross-client rendering verified |
| 6 | Build landing page template with brand styling | Landing page template ready |
| 7 | Create forms for key conversion points (demo request, content download, newsletter) | Forms live |
| 8 | Configure progressive profiling to gather data over time | Progressive fields active |
| 9 | Implement hidden fields for UTM capture and attribution | UTM tracking operational |
| 10 | Build awareness-stage nurture (educational content) | Awareness nurture active |
| 11 | Build consideration-stage nurture (product/solution focused) | Consideration nurture active |
| 12 | Configure enrollment triggers, exit criteria, and branch logic | Nurture automation complete |
| 13 | Configure lead assignment rules (territory, round-robin, named accounts) | Routing rules active |
| 14 | Set up MQL notification workflow to alert sales reps | Sales notifications firing |
| 15 | Configure high-intent behavior alerts (pricing page, demo request) | Real-time alerts operational |
| 16 | Integrate with sales engagement platform if applicable (Outreach, Salesloft) | SE platform connected |

#### Workstream 6: Reporting & Analytics

| Step | Action | End State |
|------|--------|-----------|
| 1 | Build marketing performance dashboard (leads, MQLs, conversion rates) | Performance dashboard live |
| 2 | Create campaign attribution dashboard | Attribution visible |
| 3 | Build email performance dashboard (opens, clicks, unsubscribes) | Email metrics tracked |
| 4 | Create lead funnel dashboard (volume by stage, conversion rates) | Funnel visibility complete |
| 5 | Set up SLA monitoring dashboard (response times, aging leads) | SLA tracking live |
| 6 | Select and configure attribution model (first-touch, last-touch, multi-touch, W-shaped) | Attribution model active |
| 7 | Configure UTM parameter capture and campaign tracking | Campaign source tracking operational |
| 8 | Integrate with CRM opportunity data for pipeline attribution | Revenue attribution functional |

**Build tracking:**

- Workstream 1: Data Migration & Cleanup (migration only)
- Workstream 2: Core Platform Settings
- Workstream 3: Lead Scoring & Lifecycle
- Workstream 4: CRM Integration
- Workstream 5: Marketing Assets & Automation
- Workstream 6: Reporting & Analytics

---

### 2d. QA / Test + Sign-Off

> **Purpose:** Verify the build works and get customer approval.

**Three layers of testing:**

| Type | Who | Purpose |
|------|-----|---------|
| System Testing | Our team | Verify each component works individually |
| End-to-End Testing | Our team | Verify complete lead journey from first touch to MQL handoff |
| UAT | Customer | Verify it meets their requirements |

**System testing checklist:**

- Email deliverability validated using seed list
- Form submissions create leads correctly with all field data
- Lead scoring calculations match expected values for sample scenarios
- Lifecycle stage progressions fire correctly
- CRM sync working in both directions, all mapped fields populating
- Nurture enrollment triggers and email sends working
- Lead routing assigns to correct owners
- Reporting dashboards rendering with accurate data
- Attribution model crediting touchpoints correctly
- SLA alerts firing within defined thresholds
- IP warming progressing on schedule (deliverability above 95%)

**End-to-end testing checklist:**

- Create test leads that simulate real buyer behavior
- Track leads through nurture programs across all branches
- Verify scoring accumulates correctly through buyer journey
- Test MQL threshold trigger and sales notification
- Validate lead appears correctly in CRM with full engagement history
- Verify sales follow-up workflow triggers correctly
- Test full attribution path from first touch to opportunity creation

**Customer UAT:**

- Create UAT test script covering key use cases
- Have marketing team execute test scenarios
- Document feedback and required changes
- Implement fixes for critical issues
- Conduct regression testing on changes
- Get formal sign-off from marketing stakeholder

**Engineering sign-off checkpoint:**

- Built system matches tech spec
- All system tests passing
- End-to-end lead journey validated
- Customer has tested and approved
- Ready for go-live and enablement

**Decision point:**

- **Proceed to Enablement** — System is built and tested, needs training and go-live
- **Loop back to Build** — Issues found in testing, needs fixes

---

## Phase 3: Enablement

> **Goal:** Marketing and sales teams can use the platform. System is stable in production.
>
> **Output:** Trained teams with documentation, live production system, no critical issues.

### Sub-Phases

```
3a Training Prep -> 3b Training Sessions -> 3c Hypercare (incl. Go-Live) -> 3d Enablement Sign-Off
```

---

### 3a. Training Prep

> **Purpose:** Create training materials from strategic and technical documentation.

**Input:** Strategic package + tech specs + built system + config documentation

**Output:** Training package containing:

- Platform overview guide (navigation, key features by role)
- SOPs for common tasks (create email campaign, build list, send campaign, create form, build landing page)
- Scripts for video walkthroughs (dashboard, campaign workflow, scoring model, reporting)
- Quick-reference cards for daily use
- Troubleshooting guide for common issues
- Hands-on exercises with real scenarios for training sessions
- Sales-specific guide: how leads appear in CRM, engagement history, MQL follow-up process

---

### 3b. Training Sessions

> **Purpose:** Transfer knowledge to customer team.

**Training delivery by audience:**

| Session | Audience | Focus | Duration | Format |
|---------|----------|-------|----------|--------|
| 1 | Marketing Ops team | Platform navigation, campaign creation, list management, forms | 90 min | Live + video walkthrough |
| 2 | Marketing Ops + Demand Gen | Nurture programs, lead scoring monitoring, A/B testing, attribution | 90 min | Live + video walkthrough |
| 3 | VP Marketing, Leadership | Dashboard interpretation, campaign ROI, strategic metrics | 30 min | Live + video walkthrough |
| 4 | Sales team | Lead context in CRM, engagement history, MQL follow-up SLA, feedback | 45 min | Live + video walkthrough |
| 5 | RevOps / Admin | Platform admin, CRM sync monitoring, user management, troubleshooting | 60 min | Live + video walkthrough |

**Training delivery process:**

1. Schedule sessions with appropriate stakeholders (recommend spreading over 1 week)
2. Deliver training with hands-on exercises using real scenarios
3. Record all sessions for future reference
4. Answer questions and document for FAQ
5. Provide quick-reference cards for daily use

**Output:**

- Trained stakeholders across marketing, sales, and admin roles
- Recordings for all sessions
- FAQ document (based on questions raised in training)

---

### 3c. Hypercare (Includes Go-Live)

> **Purpose:** Launch the platform into production and provide intensive post-launch support to catch and resolve issues.

**Duration:** 2 weeks post go-live

#### Go-Live Checklist (Day 0)

- Run final data validation checks
- Verify all integrations are active and syncing
- Confirm email deliverability is healthy (inbox rate >95%)
- Activate lead scoring and routing in production
- Turn on live nurture programs
- Enable tracking and analytics
- Communicate go-live to all stakeholders
- Document go-live timestamp and system state

#### Hypercare Activities

**Week 1 (daily standups):**

- Monitor email deliverability daily (bounce rates, spam complaints, inbox placement)
- Check lead flow and routing daily (leads reaching correct owners)
- Review error logs and failed CRM syncs
- Address user questions within 4 hours
- Hold 15-min daily standup with Marketing Ops point-of-contact
- Document issues and resolutions

**Week 2 (transition to weekly):**

- Monitor email deliverability and lead flow
- Review accumulated issues and ensure resolution
- Hold weekly 30-min check-in
- Address remaining user questions
- Escalate critical issues immediately

**When to skip hypercare:** Never for this project type. Marketing automation implementations always need hypercare due to deliverability, sync, and workflow complexity.

**Output:** Stabilized production system. No critical issues outstanding. Email deliverability maintaining healthy rates.

---

### 3d. Enablement Sign-Off

> **Purpose:** Confirm customer can operate independently.

**Validation checkpoint:**

- All training sessions delivered (marketing, sales, admin, leadership)
- Training recordings and documentation provided
- Hypercare period complete (2 weeks)
- Email deliverability stable (inbox rate >95%, spam complaints <0.1%)
- No critical issues outstanding
- Lead flow, scoring, routing operational in production
- CRM sync running cleanly (no error backlog)
- Marketing team can create and send campaigns independently
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** — Customer is enabled, system is stable
- **Extend Hypercare** — Deliverability issues, sync problems, or team not ready. Extend 1-2 additional weeks.

---

## Phase 4: Handoff

> **Goal:** Clean project close with maintenance plan established and retention/expansion path set.
>
> **Output:** Maintenance schedule documented, internal context transferred, customer owns the system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule -> 4b Internal Handoff -> 4c External Handoff -> 4d Project Close
                          (SME -> Architect)       (Team -> Customer)     (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|----------------------|---------------|
| **Single Project** | Customer owns | 4c (External Handoff) |
| **Dedicated (Multi-Project)** | Architect owns | 4b (Internal Handoff) |

---

### 4a. Maintenance Schedule

> **Purpose:** Document what needs ongoing attention after the project is complete.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|--------------------|
| Email Deliverability Monitoring | Inbox placement rate, bounce rate, spam complaints | Inbox rate <90% or spam complaints >0.1% |
| Lead Flow Audit | Volume of new leads, MQLs generated, routing accuracy | >10% of leads routed incorrectly |
| Scoring Model Accuracy | MQL-to-SQL acceptance rate | Acceptance rate <40% (scoring too loose) or >90% (scoring too tight) |
| CRM Sync Health | Failed sync records, field mapping errors | >5 failed syncs per day or field drift detected |
| Nurture Program Performance | Enrollment rates, open rates, click rates, unsubscribe rates | Unsubscribe >2% or open rates <15% |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|---------------|----------------|----------------------|
| Full Funnel Conversion Review | Lead->MQL->SQL->Opp conversion rates by channel | Adjust scoring thresholds or nurture content |
| Lead Scoring Model Recalibration | Compare scored predictions vs actual sales outcomes | Adjust weights, add/remove scoring criteria |
| Nurture Content Refresh | Are nurture emails still relevant and performing? | Update content, add new tracks, retire stale flows |
| Integration Health Check | All third-party integrations still connected and flowing | Reconnect broken integrations, update API keys |
| Database Hygiene | Duplicate rate, invalid emails, unengaged contacts | Run dedup, prune bounced/unengaged contacts |

**After First Business Cycle (60-90 days post-launch):**

- Lead-to-MQL Conversion Validation: Is the scoring model producing MQLs at the expected rate?
- MQL-to-SQL Acceptance: Are sales accepting the MQLs being sent? If <40%, scoring is too loose.
- Attribution Accuracy Check: Are top-performing channels matching expectations? If not, check UTM capture and attribution logic.
- Key Question: Is marketing automation driving pipeline? If gap, is it lead volume, scoring accuracy, or nurture effectiveness?

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Email Deliverability Degradation | Inbox rate drops below 85% for 2+ weeks | Audit domain authentication, check blacklists, review content |
| MQL Quality Complaints | Sales rejects >50% of MQLs for 30+ days | Recalibrate scoring model |
| Nurture Fatigue | Open rates drop >30% from baseline | Scope content refresh or new nurture tracks |
| CRM Sync Failures | >20 failed syncs per day for 1+ week | Integration troubleshooting |

**Every 6-12 Months:**

- Full Platform Audit: Review all workflows, scoring rules, and integrations for relevance and accuracy
- Lead Scoring Overhaul: Rebuild scoring model with 6-12 months of actual conversion data
- Nurture Program Redesign: Refresh all content, add new tracks based on product/market changes
- Technology Stack Review: Evaluate whether current platform and integrations still meet needs

---

### 4b. Internal Handoff (SME -> Architect)

> **Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- What was built and why (platform chosen, key configuration decisions, integration architecture)
- Customer context (stakeholders, technical skill level, team dynamics)
- Common issues and how to resolve them (deliverability dips, sync failures, scoring adjustments)
- When to escalate back to SME
- **Maintenance schedule** (if Dedicated engagement — Architect runs this)

**Escalation guidelines:**

| Issue Type | Who Handles | Examples |
|-----------|-------------|----------|
| Small tweaks, minor questions | Architect | Add new user, update email template, adjust list filter |
| Significant changes, complex issues | SME | Scoring model changes, CRM sync architecture, new integrations, deliverability issues |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing it. SME walks Architect through each maintenance task.

---

### 4c. External Handoff (Team -> Customer)

> **Purpose:** Formal project completion with customer.

**Final project meeting:**

- Review what was delivered (platform configuration, integrations, assets, reporting)
- Walk through documentation package
- Walk through maintenance schedule in detail (especially for Single Project engagements)
- Confirm nothing outstanding
- Answer final questions
- Make it explicit: "Project complete"

**Documentation package:**

- All training video recordings
- Platform SOPs (create email, build list, send campaign, create form)
- CRM integration field mapping reference
- Lead scoring model documentation
- Nurture program documentation (enrollment triggers, branch logic, exit criteria)
- Troubleshooting guide
- FAQ document
- Definition Alignment Document (final version)
- Support contact info (platform vendor + escalation path)
- **Maintenance Schedule** (for Single Project engagements — this becomes the customer's responsibility)

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video walkthrough.

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

- What went well? (e.g., data migration was clean, training adoption was high)
- What would we do differently? (e.g., should have pushed harder on data cleanup earlier)
- Any learnings to feed back into SOPs?

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| **Single Project** | Upsell -> Downsell -> Retry |
| **Multi-Project (Dedicated)** | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (ongoing marketing ops support, campaign optimization)
   | if no
2. Downsell: Another one-time project (ABM implementation, advanced attribution, nurture optimization, lead scoring overhaul)
   | if yes
3. Retry retainer at end of next project cycle
```

**Script:**

> "Now that your marketing automation platform is live and your team is trained, there are two ways we can continue working together. Option 1: We handle ongoing marketing ops support — scoring optimization, nurture program management, deliverability monitoring, and campaign analytics. Option 2: If there's a specific project you want to tackle next, like ABM, advanced attribution, or outbound automation, we can scope that out. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

> "On [date ~90 days out], we'll review how the platform is performing — deliverability, lead flow, scoring accuracy — and see if any adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull deliverability data, lead flow data, scoring acceptance rates |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | Brief SME if needed, or prepare talking points |

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Requirements document (validated and signed off)
- Implementation roadmap with timeline and milestones
- Data mapping spreadsheet (migration projects)
- Platform comparison matrix with recommendation (new implementation projects)
- Definition Alignment Document (final version)

**Technical Deliverables:**

- Configured marketing automation platform (HubSpot, Marketo, or Pardot)
- CRM integration (bidirectional sync operational)
- Lead scoring model (demographic + behavioral + degradation)
- Lifecycle stage configuration
- Email templates (master, nurture, promotional, transactional)
- Landing page templates and forms
- Nurture programs (awareness + consideration stages)
- Lead routing and notification workflows
- Reporting dashboards (marketing performance, campaign attribution, email performance, lead funnel, SLA monitoring)
- Attribution reporting configuration

**Documentation Package:**

- Training video recordings (5+ recordings covering all audience segments)
- Platform SOPs
- CRM field mapping reference
- Lead scoring model documentation
- Nurture program documentation
- Troubleshooting guide
- FAQ document
- Definition Alignment Document (final version)
- Maintenance Schedule

---

## Appendix: Reference Guide

### Roles

| Role | What They Do |
|------|--------------|
| **Architect** | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| **Engineer** | CRM build, automation, dashboards (Phase 2) |
| **SME** | Brought in for project-specific work |

### What Each Phase Produces

| Phase | Output | Gate Criteria |
|-------|--------|--------------|
| **Phase 1: Strategy** | Signed-off requirements + implementation roadmap + data mapping | All stakeholders approved requirements, definitions aligned, scope confirmed |
| **Phase 2: Engineering** | Built and tested marketing automation platform | System matches tech spec, all tests pass, customer has approved via UAT |
| **Phase 3: Enablement** | Trained team with documentation, stable production system | All training delivered, hypercare complete, team can operate independently |
| **Phase 4: Handoff** | Independent customer + archived project | Internal/external handoffs complete, maintenance plan in place, project closed |

### Typical Project Timelines

| Project Type | Duration | Consulting Cost Range | Notes |
|--------------|----------|----------------------|-------|
| HubSpot (new) | 6-8 weeks | ~$15,000 | Faster due to native CRM integration |
| Pardot (new) | 4-8 weeks | ~$10,000-$20,000 | Fast if already on Salesforce CRM |
| Marketo (new) | 8-16 weeks | $30,000+ | More complex, more customization |
| Platform Migration | 10-20 weeks | $25,000-$50,000+ | Data migration adds 4-8 weeks |

### Market Context

The global marketing automation software market reached $6.65 billion in 2024, growing at "15.3% CAGR". For every dollar spent on marketing automation, companies see "an average ROI of $5.44 in the first three years, with 76% of companies generating positive ROI within the first year". Automated emails generate "320% more revenue than non-automated emails".

### Phase 2 Key Principles

**Build order:** Core platform settings (WS2) must come first. CRM integration (WS4) should be established early so field mapping can be validated. Marketing assets (WS5) and reporting (WS6) can run in parallel once integration is stable.

**End-to-end testing is non-negotiable.** The most common failure mode is components working individually but breaking when data flows through the full lead journey (form submit -> scoring -> lifecycle change -> CRM sync -> routing -> notification).

**Data Migration Principles:**

- Clean before migrating. Migrating dirty data pollutes the new platform from day one.
- Start with a test batch of 1,000 records. Validate field mapping before full import.
- Plan for data that will NOT migrate: some engagement history, some custom objects, and platform-specific features will not transfer 1:1.
- Preserve consent and subscription data explicitly. GDPR compliance depends on this.

**IP Warming Schedule (new sending domains):**

- Week 1: 500 emails/day to most engaged subscribers
- Week 2: 1,000-5,000 emails/day
- Week 3: 10,000-50,000 emails/day
- Week 4+: Scale up (never more than 2x week-over-week)

Monitor bounce rates, open rates, and spam complaints throughout. If spam complaints exceed 0.1%, pause and investigate before continuing.

### Phase 3 Key Principles

**Five audience segments, not one.** VP Marketing needs dashboards and ROI. Marketing Ops needs campaign creation. Sales needs lead context in CRM. RevOps needs admin and troubleshooting. One-size training does not work.

**Hypercare:** Email deliverability is the highest-risk area post go-live. Monitor daily. If inbox placement drops below 90%, pause outbound volume and investigate. The second-highest risk is CRM sync failures creating data gaps between marketing and sales views.

### Troubleshooting Guide

| Scenario | Symptoms | Resolution |
|----------|----------|------------|
| Email deliverability drops | Inbox rate <90%, high bounce rates, emails landing in spam | Check SPF/DKIM/DMARC records, review blacklist status, audit recent email content for spam triggers, reduce send volume temporarily |
| CRM sync failures | Records not appearing in CRM, field data missing or outdated | Check API connection status, review error logs for failed records, verify field mapping is still valid, check for changed permissions |
| Lead scoring inflation | Too many MQLs, sales rejection rate >50% | Increase score thresholds, add negative scoring criteria, reduce points for low-intent behaviors (e.g., email opens) |
| Lead scoring deflation | Too few MQLs, qualified leads stuck below threshold | Lower score thresholds, add scoring for additional behaviors, check if key scoring triggers are firing |
| Nurture emails not sending | Leads enrolled but no emails delivered | Check enrollment trigger criteria, verify email is active/approved, check send frequency limits, review suppression lists |
| Form submissions not creating leads | Forms appear to work but no new leads in platform | Check form-to-field mapping, verify form is connected to correct list/workflow, check for duplicate management rules blocking creation |
| Attribution data missing | Dashboard shows gaps in attribution data | Verify UTM parameters are being captured, check hidden fields on forms, confirm campaign sync between MA and CRM |
| IP warming stalled | Deliverability not improving despite warming schedule | Audit content quality, verify authentication records, check if sending to low-engagement segments, consider pausing and restarting with more engaged audience |

---

## References

1. [Braze - IP Warming](https://www.braze.com/docs/user_guide/message_building_by_channel/email/email_setup/ip_warming)

2. [Landbase - 35 Email Deliverability Statistics 2026](https://www.landbase.com/blog/email-deliverability-statistics)

3. [Landbase - 30 Lead Scoring Statistics 2025](https://www.landbase.com/blog/lead-scoring-statistics)

4. [Brixon Group - Predictive Lead Scoring with AI](https://brixongroup.com/en/predictive-lead-scoring-with-ai-setup-roi-and-avoiding-costly-pitfalls/)

5. [MarCloud Consulting - Pardot vs HubSpot vs Marketo](https://marcloudconsulting.com/implementation/pardot-vs-hubspot-vs-marketo/)

6. [Cropink - 35+ Marketing Automation Statistics 2026](https://cropink.com/marketing-automation-statistics)

7. [inBeat Agency - 70 Marketing Automation Statistics 2025](https://inbeat.agency/blog/marketing-automation-statistics)

8. [Cazoomi - 50 Marketing Automation Statistics 2025](https://www.cazoomi.com/blog/50-marketing-automation-statistics-you-need-to-know-in-2025-and-beyond/)