# Salesforce to HubSpot CRM Migration — Implementation

## Project One-Pager

Quick reference for architects. Fill this out FIRST — it serves as the project's identity card.

### Project Type

- **Category:** Technical (Engineering-Heavy)
- **Primary Deliverable:** Fully operational HubSpot CRM with clean migrated data, rebuilt workflows, trained users, and decommissioned Salesforce instance

#### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Medium | Stakeholder alignment, scope definition, migration approach |
| 2. Engineering | Yes | Heavy | Data migration, workflow rebuild, integration cutover |
| 3. Enablement | Yes | Medium | Role-based training, hypercare for adoption |
| 4. Handoff | Yes | Medium | Cutover validation, Salesforce decommission, maintenance plan |

#### Phase Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. STRATEGY  │────▶│ 2. ENGINEER  │────▶│3. ENABLEMENT │────▶│  4. HANDOFF  │
│    Medium    │     │    Heavy     │     │    Medium    │     │    Medium    │
│ 1a→1b→1c→1d │     │ 2a→2b→2c→2d │     │ 3a→3b→3c→3d │     │ 4a→4b→4c→4d │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
  SF audit + scope     Data migration       Role-based CRM       Cutover + SF
  Migration charter    Workflow rebuild      training + hyper-    decommission
                       Integration swap      care support
```

**This project's flow:**

- Full 4-phase execution. Strategy focuses on Salesforce audit, scope definition, and migration approach (phased vs. big bang). Engineering is the heaviest phase — data cleanup, field mapping, test migration, production migration, workflow rebuild, and integration cutover. Enablement covers role-based HubSpot training and 2–4 weeks of hypercare. Handoff includes final cutover validation, Salesforce decommissioning, and maintenance transfer.
- No phases are skipped. Engineering typically consumes 50–60% of project effort. Over 80% of data migration projects exceed timelines or budgets, making rigorous Phase 1 scoping and Phase 2 QA critical.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Watch CRM migration intro video (video walkthrough explaining what migration entails, timeline, and their responsibilities)
- Complete migration intake form (current Salesforce usage, integrations, user count, historical data requirements)
- Provide Salesforce admin + API credentials
- Provide list of all third-party tools integrated with Salesforce
- Get internal alignment on data retention requirements (how far back to migrate)
- Provide list of all active reports and dashboards by department

##### Track B: Architect Prep

- Review intake form and assess migration complexity
- Pull Salesforce object inventory via Salesforce Metadata API or admin export
- Run initial data quality assessment (duplicate rates, field completion, stale records)
- Draft preliminary field mapping document (SF Object > HubSpot Object, SF Field > HubSpot Property)
- Assess integration landscape and identify cutover dependencies
- Create v0 migration plan with timeline estimate and risk register

#### Refinement Loop (1b > 1c > 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present v0 migration plan, validate SF audit findings | VP RevOps, VP Sales, VP Mktg, IT | Corrections for v1 |
| Refinement 1 | 1c | Review field mapping, data cleanup scope, pipeline design | RevOps, Sales Ops, Marketing Ops | Approved field mapping v2 |
| Refinement 2 | 1c | Integration cutover plan, workflow rebuild priorities | IT, RevOps, Sales Leadership | Integration plan v3 |
| Sign-Off | 1d | Final migration scope, timeline, RACI approval | All stakeholders | Signed migration charter |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held — v0 migration plan presented and validated
- 1c. Refinement loop complete (field mapping, integration plan, workflow priorities finalized)
- 1d. Strategic sign-off obtained — migration charter approved by all stakeholders

##### Phase 2: Engineering

- 2a. Tech spec created (field mapping document, data migration sequence, workflow rebuild plan)
- 2b. Engineering handoff meeting held
- 2c. Build complete (data migrated, workflows rebuilt, integrations reconnected)
- 2d. QA/Test + customer sign-off (test migration validated, production migration verified)

##### Phase 3: Enablement

- 3a. Training materials prepped (role-specific guides, video walkthrough scripts, FAQ)
- 3b. Training sessions delivered (Sales, Marketing, RevOps, CS)
- 3c. Hypercare period complete (2–4 weeks post-go-live)
- 3d. Enablement sign-off

##### Phase 4: Handoff

- 4a. Maintenance schedule documented and handed off
- 4b. Internal handoff (SME > Architect) complete
- 4c. External handoff (Firm > Customer) complete — Salesforce decommissioned
- 4d. Project closed and archived

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| Migration Intake Form | Capture SF environment details, user list, requirements | All fields completed by customer |
| Salesforce Audit Document | Inventory of objects, fields, workflows, integrations | Full SF environment documented |
| Field Mapping Spreadsheet | Map every SF field to HubSpot property equivalent | Every field mapped, type-checked, stakeholder-approved |
| Data Quality Report | Quantify duplicates, stale records, field gaps | Cleanup thresholds defined, cleanup plan created |
| Workflow Rebuild Priority Matrix | Categorize SF automations as P1/P2/P3 for HubSpot rebuild | All workflows categorized, HubSpot approach documented |
| Integration Cutover Plan | Sequence for switching integrations from SF to HubSpot | All integrations mapped with cutover order and rollback plan |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| Migration Charter | Intake form + SF audit | Internal alignment, executive approval |
| Data Migration Reconciliation Report | Field mapping + migration logs | Verify data integrity, audit trail |
| HubSpot Configuration Guide | Tech spec + build documentation | Ongoing reference for CRM administration |
| Training Recordings | Training sessions | New hire onboarding, ongoing reference |
| Maintenance Schedule | Project experience + system docs | Post-project system health monitoring |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Sales Rep | AEs, SDRs/BDRs | Daily HubSpot CRM usage: records, activities, deal mgmt | 60 min |
| Sales Mgmt | VP Sales, Sales Directors | Pipeline management, forecasting, coaching views | 60 min |
| Marketing | Marketing Ops, Demand Gen | Contact management, list building, campaign tracking | 60 min |
| RevOps | RevOps Lead, Sales Ops, CRM Admin | Property management, workflow editing, integration admin | 90 min |
| CS/Support | CSMs, Support Managers | Account management, service features, ticket workflows | 45 min |
| Leadership | CMO, CRO, VP RevOps | Dashboard interpretation, reporting, strategic decisions | 30 min |

##### Hypercare

- **Applies:** Yes
- **Duration:** 2–4 weeks (scaled to migration complexity)
- **Office Hours:** Yes — daily 30-min slots in week 1, bi-weekly 30-min slots in weeks 2–4
- **Dedicated channel for real-time HubSpot questions**

##### Training Assets to Create

- Video walkthrough: Sales rep daily workflow in HubSpot (record navigation, activity logging, deal updates)
- Video walkthrough: Sales manager pipeline and forecasting views
- Video walkthrough: Marketing contact management and campaign tracking
- Video walkthrough: RevOps admin guide (properties, workflows, integrations)
- Doc: Salesforce-to-HubSpot quick reference (what changed, where things live now)
- Doc: Field mapping reference (old SF field > new HubSpot property)
- Doc: FAQ addressing common SF > HubSpot questions

#### Handoff & Retention

##### Internal Handoff (SME > Architect)

- Key context for Architect: Migration scope, which integrations were rebuilt, key stakeholder personalities, outstanding known issues
- Escalation trigger: Any schema changes (new custom objects, pipeline restructuring), integration failures, data quality issues requiring re-migration

##### External Handoff (Firm > Customer)

- Final meeting agenda: Migration reconciliation walkthrough, documentation package review, Salesforce decommission timeline, maintenance schedule overview
- Documentation package: All training recordings, HubSpot configuration guide, field mapping reference, FAQ, maintenance schedule

##### Maintenance Schedule

- **Monthly:** Data quality spot-checks, workflow health review, integration sync monitoring
- **Quarterly:** Report accuracy validation, user adoption audit, process optimization review
- **Who owns:** Single project = customer owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services (ongoing CRM optimization, workflow tuning, new integration builds) > if no > Downsell: Follow-on project (e.g., lead scoring, attribution, reporting pack) > Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~90 days post-migration
- Internal prep trigger: 2 weeks before check-in
- Decision: Architect handles routine optimization / SME needed for structural changes

#### Key Assets

| Asset | When Used |
|-------|-----------|
| Migration Intake Form Template | Phase 1a — Pre-Kickoff |
| Field Mapping Spreadsheet | Phase 1c — Refinement through 2c |
| Data Quality Report Template | Phase 1a — Pre-Kickoff through 2c |
| HubSpot Import Guide | Phase 2c — Build |
| Workflow Rebuild Checklist | Phase 2c — Build |

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| Migration Scope | The specific objects, records, fields, workflows, and integrations included in the SF > HubSpot transfer |
| Data Cutoff | The historical date boundary for migrated records (e.g., "all records created or updated in the last 3 years") |
| Big Bang Migration | All data and users migrate simultaneously on a single cutover date |
| Phased Migration | Data and users migrate in stages (e.g., by department or object type) over multiple cutover dates |
| Field Mapping | The documented correspondence between each Salesforce field and its HubSpot property equivalent |
| Test Migration | A trial import using a representative data sample (1,000–5,000 records) to validate mapping accuracy |
| Delta Migration | The final incremental sync of records created/updated between the last full export and cutover |
| Cutover | The moment when HubSpot becomes the system of record and Salesforce access is restricted |
| Hypercare | Intensive post-go-live support period (2–4 weeks) with daily office hours and rapid issue resolution |
| Workflow Rebuild | Recreating Salesforce automation (Process Builder, Flows, Apex triggers) as native HubSpot workflows |

#### Common Gotchas

- Migrating dirty data without cleanup first leads to duplicate-infested HubSpot instance — up to 70% of CRM records become inaccurate within a year without active management. Mandate data cleanup phase before any import.
- Property type mismatches (e.g., SF picklist mapped to HubSpot single-line text) cause silent data loss. Validate every field mapping for type compatibility during test migration.
- Workflow rebuild effort is consistently underestimated. Budget 30–40% of total project time for workflow audit, design, and HubSpot rebuild. Some complex Salesforce automations (Apex triggers, complex Process Builder flows) require HubSpot Operations Hub for equivalent logic.
- Third-party tools like Outreach and Salesloft can only connect to one CRM at a time. Plan the integration cutover sequence carefully, and confirm rollback options before disconnecting from Salesforce.
- Salesforce formula fields do not have direct HubSpot equivalents. Each formula must be assessed: recreate as HubSpot calculated property, rebuild via workflow, or handle via Operations Hub custom code.
- Record associations (Contact > Company, Deal > Contact) must be validated post-import. HubSpot uses association labels differently than Salesforce lookup relationships.
- Salesforce record types and page layouts do not map 1:1 to HubSpot. Record types typically become separate pipelines or property-based segmentation.

#### Methodology Options

| Option | When to Use | Complexity |
|--------|-------------|------------|
| Big Bang Migration | Smaller teams (<50 users), simpler SF config, tight timeline | High risk, lower duration |
| Phased Migration | Large teams (50+ users), complex integrations, risk-averse org | Lower risk, longer duration |
| Hybrid (Core + Phase) | Migrate core data (companies, contacts) at once, phase departments for workflows/training | Medium risk, medium duration |

---

## Phase 1: Strategy

> **Goal:** Get stakeholder sign-off on migration scope, approach, field mapping, and timeline.
>
> **Output:** Migration Charter + Field Mapping Document + RACI Matrix (signed off by stakeholders).

### 1a. Pre-Kickoff

> Two parallel tracks run after the deal closes and before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Migration intro video | Explain what migration entails, timeline, and their role | Video walkthrough (5–10 min) |
| Definition Alignment Document | Get stakeholder sign-off on migration terms | Google Doc |
| Migration intake form | SF environment details, user list, data requirements | Google Form or Doc |

**Migration-specific intake items:**

- Total Salesforce user count by role (AE, SDR, Manager, Marketing, CS, Admin)
- List of all active third-party integrations (Outreach, Salesloft, ZoomInfo, Gong, etc.)
- Salesforce edition and installed packages
- Custom object inventory (names, approximate record counts)
- Historical data retention requirements (how many years of closed deals, activities)
- Current report/dashboard inventory by department
- Known pain points with current Salesforce setup
- HubSpot subscription tier (Sales Hub, Marketing Hub, Service Hub, Operations Hub)

**Completion tracking:** RevOps lead or IT contact is the designated follow-up owner. Do not cancel kickoff if incomplete, but push hard after — the field mapping cannot start without the intake form and SF admin access.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Review intake form; request SF admin access | Context for audit |
| 2 | Export Salesforce metadata (objects, fields, workflows, integrations) | Raw SF audit data |
| 3 | Run data quality assessment (duplicates, field completion, stale records) | Data Quality Report |
| 4 | Draft field mapping v0 (SF Object > HubSpot Object, field-by-field) | Field Mapping Spreadsheet v0 |
| 5 | Assess integration landscape (which tools connect, data flow direction) | Integration Inventory |
| 6 | Create v0 migration plan (approach, timeline, risk register) | Migration Plan v0 |

**Critical:** Mark everything as ASSUMED. The kickoff call validates. Nearly 70% of data migration projects go over time or budget — rigorous pre-kickoff scoping reduces this risk.

#### Stakeholder Alignment Document

> Get stakeholder sign-off on terms BEFORE building anything.

| Term | Our Definition | Internally Approved? |
|------|----------------|----------------------|
| Migration Scope | Objects, records, fields, workflows, and integrations included in the transfer | [ ] Yes / [ ] No |
| Data Cutoff | Historical boundary for migrated records (recommend: last 3 years of activity) | [ ] Yes / [ ] No |
| Migration Approach | Big Bang / Phased / Hybrid (our recommendation based on assessment) | [ ] Yes / [ ] No |
| Cutover Date | The date HubSpot becomes system of record | [ ] Yes / [ ] No |
| Workflow Rebuild Scope | Which SF automations are recreated vs. retired in HubSpot | [ ] Yes / [ ] No |
| Success Metrics | Adoption rate, data quality score, cost reduction, time-to-value targets | [ ] Yes / [ ] No |

**Instructions to customer:**

> Review each definition with your leadership team. Check "Yes" when approved. We cannot begin data migration until migration scope and data cutoff are aligned.

---

### 1b. Kickoff Call

> **Purpose:** Present v0 migration plan and SF audit findings. We walk in with work done — customer reacts, not creates from scratch.

#### Agenda (90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0–20 | Walk through v0 migration plan | Timeline, approach recommendation, risk register |
| 20–35 | Present Salesforce audit findings | Object inventory, data quality findings, complexity |
| 35–50 | Review draft field mapping | Walk through critical object mappings, identify gaps |
| 50–65 | Definition alignment | Review terms document, get initial feedback |
| 65–80 | Integration inventory review | Confirm all connected tools, discuss cutover sequence |
| 80–90 | Next steps | Assign homework, schedule refinement meetings |

#### What We Bring

- v0 Migration Plan (approach, timeline, risk register)
- Salesforce Audit Document (objects, fields, workflows, integrations)
- Data Quality Report (duplicate rates, field gaps, stale data volume)
- Draft Field Mapping Spreadsheet v0
- Integration Inventory
- Definition Alignment Document (pre-filled with our recommendations)

#### What We Leave With

- Feedback and corrections on migration plan and field mapping (info for v1)
- Confirmed or corrected data cutoff and retention requirements
- Department-specific requirements for field mapping
- Confirmed integration priority order
- Alignment loop scheduled
- Clear homework assignments (theirs: stakeholder sign-offs, missing data; ours: updated mapping, refined plan)

---

### 1c. Alignment Loop & Strategic Meeting Cadence

> **Purpose:** Iterate on migration plan and field mapping until stakeholder sign-off.

#### The Pattern

```
Kickoff Call (gather info)
    |
    v
Process feedback --> v1 migration plan + field mapping
    |
    v
Meeting 2 (field mapping deep-dive, data cleanup scope) --> v2
    |
    v
Meeting 3 (integration plan, workflow priorities) --> v3
    |
    v
Final Review --> Sign-off
```

#### Migration-Specific Meeting Types

| Meeting Type | Focus | Stakeholder |
|--------------|-------|-------------|
| Field Mapping Deep-Dive | Object-by-object mapping review, property type validation | RevOps, Sales Ops, Marketing Ops |
| Integration Planning | Cutover sequence, API connections, rollback plan | IT, RevOps |
| Workflow Prioritization | P1/P2/P3 classification, HubSpot approach for each | RevOps, Sales Leadership |
| Pipeline Design | SF record types > HubSpot pipelines, stage mapping | VP Sales, Sales Ops |
| Data Cleanup Scope | What to clean before migration, effort estimate | RevOps, Data team |
| Final Review + Sign-Off | Full migration charter walkthrough, get approval | All stakeholders |

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 3–5 days |
| Kickoff call | Day 1 of engagement |
| Meeting loop | 2–3 weeks (3–4 meetings typical) |
| Final review + sign-off | When all field mappings CONFIRMED |

---

### 1d. Strategic Sign-Off

> **Purpose:** Confirm we have everything before proceeding to engineering.

#### Validation Checkpoint

- Definition Alignment Document signed off by stakeholders
- Migration scope finalized (objects, records, data cutoff)
- Field mapping document approved by all departments
- Migration approach decided (big bang / phased / hybrid)
- Data cleanup requirements documented with timeline
- Workflow rebuild priorities agreed (P1/P2/P3)
- Integration cutover sequence planned
- HubSpot environment provisioned (licenses, users, base config)
- RACI matrix approved
- Cutover date agreed
- No blockers for engineering

#### Decision Point

- **Proceed to Engineering** — Migration charter signed, HubSpot environment ready
- **Extended Strategy** — Complex integrations or stakeholder disagreements require additional alignment meetings

---

## Phase 2: Engineering

> **Goal:** Migrate all data, rebuild workflows, reconnect integrations, and validate the complete HubSpot environment.
>
> **Output:** Fully operational HubSpot CRM with clean migrated data, rebuilt workflows, connected integrations — tested and customer-approved.

### Project Type

| Engineering Weight | Example |
|-------------------|---------|
| Heavy (60–70%) | This project — massive data/config work |

### Sub-Phases

```
2a Tech Spec --> 2b Engineering Handoff --> 2c Build --> 2d Test
```

---

### 2a. Tech Spec

> **Purpose:** Translate migration charter and field mapping into technical specifications.

**Input:** Signed-off Migration Charter + Field Mapping Document + Workflow Priority Matrix

**What happens:**

1. Convert field mapping spreadsheet into import-ready configuration (column mappings, transformation rules, property creation list)
2. Define data migration sequence: Companies first, then Contacts, then Deals, then Activities, then Custom Objects
3. Document workflow rebuild specifications (trigger > condition > action for each P1 workflow)
4. Specify integration cutover steps (disconnect from SF, connect to HubSpot, validate sync)

**Output:** Technical Migration Spec containing:

- HubSpot property creation list (custom properties needed, with data types)
- Pipeline and stage configuration (mapped from SF record types)
- Import sequence with dependencies (which objects import first, association mapping)
- Data transformation rules (field value conversions, picklist standardization)
- Workflow rebuild specifications (P1 workflows with full trigger/condition/action logic)
- Integration cutover checklist (per-tool disconnect/reconnect steps)
- Test migration plan (sample size, validation criteria, rollback procedure)

---

### 2b. Engineering Handoff

> **Purpose:** Review tech specs with engineer before building.

**Who attends:** Architect + Engineer (or engineering team)

**Agenda (45–60 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0–15 | Migration sequence review | Walk through data migration order, dependencies, timing |
| 15–30 | Property + pipeline setup | Review custom properties to create, pipeline configurations |
| 30–45 | Workflow rebuild plan | Review P1 workflows, discuss HubSpot-native approaches |
| 45–60 | Integration cutover | Review per-tool cutover steps, identify risks, confirm rollback |

**What Architect brings:**

- Migration Charter (for strategic context)
- Technical Migration Spec (from 2a)
- Known risks (data quality issues, complex workflows flagged during strategy)

**What engineer leaves with:**

- Approved tech spec with clear build sequence
- Property creation list ready for HubSpot
- Workflow rebuild specifications
- Integration cutover checklist
- Test migration plan with success criteria

---

### 2c. Build (Configure)

> **Purpose:** Execute the full migration — configure HubSpot, migrate data, rebuild workflows, reconnect integrations.

**Input:** Approved Technical Migration Spec from 2b

**The build follows a strict sequence:**

#### Step 1: Data Cleanup in Salesforce (Pre-Migration)

| Task | Tool/Method | Completion Criteria |
|------|-------------|-------------------|
| Merge duplicate records | Cloudingo, RingLead, or SF native | <5% duplicate rate on Contacts + Accounts |
| Standardize picklist values | SF Data Loader + cleanup scripts | Consistent formatting across all picklists |
| Archive stale records | SF reports + mass delete/archive | Records outside scope removed |
| Fix orphaned records | SF admin reassignment | All records have valid owners |
| Validate email addresses | Bounce history + NeverBounce/ZeroBounce | Known bounces removed or flagged |
| Standardize naming | Manual + bulk update | Company names, titles consistently formatted |

#### Step 2: Configure HubSpot Environment

| Task | Detail |
|------|--------|
| Provision users | Create user accounts matching SF roles and permissions |
| Set up teams | Mirror sales territories/regions from Salesforce |
| Create custom properties | All properties from property creation list |
| Configure deal pipelines + stages | Map SF record types to HubSpot pipelines |
| Set required properties per stage | Match SF page layout required fields |
| Configure company settings | Fiscal year, currency, timezone, connected domains |
| Set up property groups | Organize properties logically by function |

#### Step 3: Test Migration

| Task | Detail |
|------|--------|
| Select representative sample | 1,000–5,000 records per object type |
| Import test data | Use HubSpot import tool or migration service (Trujay/SyncMatters) |
| Validate field mapping accuracy | Spot-check 100+ records across all object types |
| Verify associations | Contacts > Companies, Deals > Contacts, Custom objects |
| Test calculated properties | Confirm formulas and dependencies work correctly |
| Document errors | Log all mapping issues, fix, and re-test |
| Clear test data | Remove test records before production import |

#### Step 4: Production Data Migration

Execute in this order to maintain referential integrity:

| Sequence | Object | SF Source | HubSpot Target | Key Validation |
|----------|--------|-----------|----------------|----------------|
| 1 | Companies | Accounts | Companies | Record count match, field accuracy |
| 2 | Contacts | Contacts + Leads | Contacts | Company associations correct |
| 3 | Deals | Opportunities | Deals | Pipeline/stage mapping, amounts, dates |
| 4 | Activities | Tasks, Events, Emails | Activities | Timeline displays correctly on records |
| 5 | Notes/Attachments | Notes, Attachments | Notes | Associated to correct records |
| 6 | Custom Objects | Custom SF Objects | Custom Objects | Associations and field accuracy |
| 7 | Lists/Campaigns | Campaign Members | Lists + Campaigns | Membership and attribution preserved |

**After each object import:** Run reconciliation (SF count vs HubSpot count), spot-check 50–100 records, verify associations.

#### Step 5: Workflow Rebuild

| Priority | Category | Example Workflows | HubSpot Tool |
|----------|----------|-------------------|--------------|
| P1 | Lead Routing | Round-robin assignment, territory-based routing | HubSpot Workflows |
| P1 | Lifecycle Automation | Stage transitions, MQL/SQL automation | HubSpot Workflows |
| P1 | Deal Stage Automation | Required fields per stage, auto-updates | Pipeline Settings + Workflows |
| P1 | Notifications | New lead alerts, deal stage change alerts | HubSpot Workflows |
| P2 | Lead Scoring | Demographic + behavioral scoring | HubSpot Lead Scoring |
| P2 | Enrichment | Auto-enrich from ZoomInfo/Clearbit on new contact | HubSpot Workflows + Integration |
| P2 | Forecasting | Forecast category automation | Deal Properties + Workflows |
| P3 | Duplicate Management | Auto-merge rules, duplicate prevention | HubSpot Dedup + Ops Hub |
| P3 | Renewal Workflows | Renewal opportunity creation, expansion triggers | HubSpot Workflows |

**For each workflow:** Document the trigger, conditions, and actions. Test with sample records before activating.

#### Step 6: Integration Reconnection

| Integration Type | Examples | Cutover Approach |
|------------------|----------|-----------------|
| Sales Engagement | Outreach, Salesloft | Disconnect SF > Connect HubSpot (single CRM only) |
| Data Enrichment | ZoomInfo, Apollo, Clearbit | Reconfigure to write to HubSpot properties |
| Conversation Intel | Gong, Chorus | Connect native HubSpot integration |
| Meeting Scheduling | Chilipiper, Calendly | Switch CRM connection, verify routing rules |
| Marketing Automation | HubSpot Marketing Hub | Already native — verify property mappings |
| CPQ/Quoting | PandaDoc, Proposify | Reconnect to HubSpot Deals |
| Data Warehouse | Snowflake, BigQuery | Update ETL source from SF to HubSpot API/Export |

#### Step 7: Report and Dashboard Rebuild

| Report Category | Key Reports to Recreate | HubSpot Tool |
|-----------------|------------------------|--------------|
| Pipeline | Pipeline by stage, by rep, by period | Deal Reports |
| Activity | Calls, emails, meetings per rep | Activity Reports |
| Lead Flow | New leads, conversion rates, source attribution | Contact Reports |
| Forecasting | Weighted pipeline, forecast vs. actual | Forecast Tool + Reports |
| Marketing Attribution | Campaign influence, lead source performance | Attribution Reports |
| Data Health | Field completion, duplicate rate, stale records | Custom Reports |

Build department-specific dashboards: Sales Leadership, Marketing, RevOps, Individual Rep.

**Build tracking:**

- Data cleanup in Salesforce: [status]
- HubSpot environment configuration: [status]
- Test migration: [status]
- Production migration — Companies: [status]
- Production migration — Contacts: [status]
- Production migration — Deals: [status]
- Production migration — Activities: [status]
- Production migration — Custom Objects: [status]
- Workflow rebuild — P1: [status]
- Workflow rebuild — P2: [status]
- Integration reconnection: [status]
- Report/Dashboard rebuild: [status]
- Final reconciliation: [status]

---

### 2d. QA / Test + Sign-Off

> **Purpose:** Verify the migration is complete and accurate, then get customer approval.

**Two types of testing:**

| Type | Who | Purpose |
|------|-----|---------|
| Technical Testing | Our team | Verify data integrity, workflows firing, integrations syncing |
| Customer Testing | Customer | Verify their daily workflows work, data looks correct |

**Technical testing checklist:**

- Record count reconciliation: SF total vs HubSpot total for every object type (variance <1%)
- Field accuracy: spot-check 100+ records per object for data integrity
- Association integrity: Contacts linked to correct Companies, Deals linked to correct Contacts
- All P1 workflows firing correctly with test records
- All integrations syncing bidirectionally (or per-spec direction)
- All deal pipelines configured with correct stages and probabilities
- Reports producing accurate data matching Salesforce baseline
- Dashboards populating correctly for all audiences
- Lead routing working for new inbound leads
- Email tracking and activity logging operational
- No errors in HubSpot workflow logs or integration logs

**Customer testing:**

- Walk customer through 5–10 representative records across objects
- Have sales reps test their daily workflow (log activity, move deal, create task)
- Have marketing test contact management and list building
- Have RevOps test reporting and dashboards against known SF numbers
- Capture and resolve any discrepancies

**Engineering sign-off checkpoint:**

- Built system matches tech spec
- All technical tests passing
- Customer has tested and approved
- Data reconciliation report signed off
- Ready for enablement and go-live

**Decision point:**

- **Proceed to Enablement** — System is built and verified, needs training before cutover
- **Loop back to Build** — Issues found, needs fixes before customer-facing testing

---

## Phase 3: Enablement

> **Goal:** Customer team can actually use HubSpot CRM and is ready for cutover from Salesforce.
>
> **Output:** Trained team with documentation, adoption baseline established, ready for go-live.

### Sub-Phases

```
3a Training Prep --> 3b Training Sessions --> 3c Hypercare --> 3d Enablement Sign-Off
```

---

### 3a. Training Prep

> **Purpose:** Create training materials tailored to each role's HubSpot workflow.

**Input:** Migration Charter + Technical Migration Spec + built HubSpot environment

**Output:** Training package containing:

**Video walkthroughs:** Per-role walkthroughs covering daily HubSpot tasks

- Sales Rep: Record navigation, activity logging, deal management, mobile app
- Sales Manager: Pipeline views, forecasting, coaching, rep performance
- Marketing: Contact management, list building, campaign tracking, form submissions
- RevOps/Admin: Property management, workflow editing, integration monitoring, user administration

**Written guides:**

- "What Changed" quick reference (SF term > HubSpot equivalent, where things live now)
- Field mapping reference (downloadable for each department)
- HubSpot navigation guide with screenshots

**FAQ document:** Pre-populated with common Salesforce-to-HubSpot questions:

- "Where did my Salesforce views go?" — HubSpot saved filters
- "How do I log a call?" — Activity logging in HubSpot
- "Where are my reports?" — HubSpot Reports > Dashboard navigation
- "What happened to record types?" — Pipeline-based segmentation in HubSpot

---

### 3b. Training Sessions

> **Purpose:** Transfer knowledge to customer team. Role-based training is mandatory, not optional.

**Training sessions by role:**

| Session | Audience | Focus | Duration | Timing |
|---------|----------|-------|----------|--------|
| Sales Rep | AEs, SDRs, BDRs | Daily workflow: records, activities, deals, mobile app | 60 min | 1 week pre-cutover |
| Sales Manager | VP Sales, Directors | Pipeline management, forecasting, coaching views, rep dashboards | 60 min | 1 week pre-cutover |
| Marketing | Marketing Ops, Demand Gen | Contact management, lists, campaigns, form submissions | 60 min | 1 week pre-cutover |
| CS/Support | CSMs, Support Managers | Account management, service features, ticket workflows | 45 min | 1 week pre-cutover |
| RevOps Admin | RevOps, CRM Admin | Properties, workflows, integrations, user admin, troubleshooting | 90 min | 3–5 days pre-cutover |
| Leadership | CRO, CMO, VP RevOps | Dashboards, executive reports, strategic views | 30 min | Day of cutover |

**Training delivery:**

1. Schedule all sessions within the week before cutover
2. Use the actual migrated data during training (not dummy data)
3. Include hands-on exercises: "Update a deal stage," "Log a call," "Build a report"
4. Record all sessions as video walkthroughs for future reference and new hire onboarding
5. Distribute written guides and FAQ immediately after each session
6. Identify and designate HubSpot champions in each department for peer support

**Output:**

- Trained stakeholders across all roles
- Video recordings of every session
- Updated FAQ (incorporating questions raised during training)
- Identified department champions

---

### 3c. Hypercare

> **Purpose:** Intensive post-cutover support to stabilize the system and drive adoption.

**Duration:** 2–4 weeks (scale with migration complexity and user count)

**Migration-specific hypercare details:**

- **Week 1:** Daily 30-minute office hours. Monitor adoption metrics hourly. Dedicated channel with <2 hour response SLA.
- **Weeks 2–4:** Bi-weekly 30-minute office hours. Monitor adoption daily. Channel with <4 hour response SLA.

**What happens:**

- Quick response to issues, bugs, navigation questions
- Proactive monitoring of adoption metrics (login frequency, record updates, activity logging)
- Bug triage and fixes (workflow misfires, integration sync issues, data display problems)
- Identification and resolution of workflow friction points
- Tracking of user-reported issues with resolution within 24 hours

**Adoption metrics to monitor during hypercare:**

| Metric | Target | Red Flag |
|--------|--------|----------|
| Daily login rate | 90%+ by week 2 | <70% after week 1 |
| Activities logged per rep | Match SF baseline | <50% of SF baseline |
| Deal updates per week | Match SF baseline | Reps reverting to spreadsheets |
| Support tickets/questions | Declining week over week | Increasing after week 2 |

**When to extend:** If login rates remain below 80% or critical workflows are still broken after the standard hypercare window.

**Output:** Stabilized system, adoption metrics meeting targets, no critical issues outstanding.

---

### 3d. Enablement Sign-Off

> **Purpose:** Confirm customer can operate independently in HubSpot.

**Validation checkpoint:**

- All training sessions delivered (every role covered)
- Training recordings and documentation distributed
- Hypercare period complete
- Adoption metrics meeting targets (90%+ daily login, 80%+ activities logged)
- No critical issues outstanding
- HubSpot champions identified and functioning in each department
- Customer team can operate without daily support
- Ready for handoff and Salesforce decommission

**Decision point:**

- **Proceed to Handoff** — Customer is enabled, adoption is on track, ready to decommission Salesforce
- **Extend Hypercare** — Adoption metrics below target, critical issues remain

---

## Phase 4: Handoff

> **Goal:** Execute final cutover, decommission Salesforce, establish maintenance plan, close project.
>
> **Output:** Maintenance schedule documented, internal context transferred, customer owns HubSpot, Salesforce decommissioned, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule --> 4b Internal Handoff --> 4c External Handoff --> 4d Project Close
                              (SME > Architect)       (Firm > Customer)        (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|---------------------|----------------|
| Single Project | Customer owns | 4c (External Handoff) — customer receives maintenance schedule |
| Dedicated (Multi-Project) | Architect owns | 4b (Internal Handoff) — Architect receives and executes schedule |

---

### 4a. Maintenance Schedule

> **Purpose:** Document what needs ongoing attention after migration is complete.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|--------------------|
| Data Quality Spot-Check | Duplicate rate, field completion on critical fields | Duplicate rate >5%, field completion <90% |
| Workflow Health Review | All P1 workflows firing correctly, error logs clean | Any P1 workflow errors, >5% enrollment failures |
| Integration Sync Monitoring | All integrations syncing on schedule, no error backlog | Sync failures >24 hours, data discrepancies |
| New User Onboarding Check | New hires added to HubSpot, trained, assigned to teams | New hires >1 week without CRM access |
| Adoption Metrics Review | Login rates, activity logging rates per team | Any team <80% login rate |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|----------------|---------------------|
| Report Accuracy Validation | Cross-check HubSpot reports against source-of-truth data | Investigate discrepancies, fix data or report logic |
| Pipeline Process Audit | Stage progression patterns, stuck deals, conversion rates | Adjust stage definitions or required properties |
| Workflow Optimization Review | Usage of P2/P3 workflows, new automation opportunities | Build new workflows or retire unused ones |
| Integration Performance Review | Sync volume, error rates, any new tools to connect | Upgrade integration tier or add new connections |
| User Permission Audit | Role assignments match current org structure | Update teams, permissions, visibility rules |

**After First Business Cycle (60–90 days post-cutover):**

- Full data quality audit: Re-run deduplication check, validate field completion rates
- Adoption maturity assessment: Are all departments using HubSpot as primary CRM?
- Report baseline validation: Do HubSpot reports align with expected business metrics?
- Integration health check: All connections stable and performing?
- Key question: Is HubSpot delivering the cost savings and visibility improvements promised in the Migration Charter?

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Adoption decline | Any department <70% login rate for 2+ weeks | Re-engage for targeted training |
| Data quality degradation | Duplicate rate >10% or field completion <85% | Scope data cleanup or dedup tool project |
| Integration failure | Sync down >48 hours | Escalate to SME for integration troubleshooting |
| Process change | New sales process, team restructuring | Scope pipeline/workflow modification project |
| New tool addition | New sales/marketing tool needs CRM connection | Scope integration project |

**Every 6–12 Months:**

- Full CRM health assessment: Data quality, workflow performance, integration stability, user adoption
- Process evolution review: Has the business changed enough to warrant pipeline restructuring or workflow redesign?
- Cost comparison: HubSpot total cost vs. original Salesforce spend — confirm ROI delivery
- Technology stack review: Any new tools or HubSpot features that could improve the system?

---

### 4b. Internal Handoff (SME > Architect)

> **Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- Migration scope and approach used (what was migrated, what was retired)
- Key stakeholder map (who owns what, decision-making dynamics)
- Integration landscape (which tools are connected, configuration details)
- Known quirks or limitations (workflows with workarounds, data quality exceptions)
- Salesforce decommission status (read-only period, termination date)
- **Maintenance schedule** (if Dedicated engagement — Architect executes this)

**Escalation guidelines:**

| Issue Type | Who Handles | Example |
|------------|-------------|---------|
| Simple property or view changes | Architect | "Add a new dropdown value," "Change dashboard filter" |
| User training or onboarding questions | Architect | New hire needs HubSpot walkthrough |
| Pipeline restructuring or new custom objects | SME | New sales process, new product line |
| Workflow logic changes | SME | Routing rule changes, new automation triggers |
| Integration failures or new integrations | SME | Tool disconnected, new vendor needs connecting |
| Data migration issues discovered post-cutover | SME | Missing records, incorrect associations |

**For Dedicated engagements:** Architect receives the maintenance schedule (4a) and becomes responsible for executing monthly and quarterly tasks. SME walks Architect through each task in detail.

---

### 4c. External Handoff (Firm > Customer)

> **Purpose:** Formal project completion, Salesforce decommission plan, maintenance transfer.

**Final project meeting:**

- Review what was delivered (data migrated, workflows rebuilt, integrations connected)
- Walk through Data Migration Reconciliation Report
- Walk through documentation package
- Review Salesforce decommission timeline (recommend 30–90 day read-only period)
- Walk through maintenance schedule (for Single Project engagements)
- Answer final questions
- Make it explicit: "Migration project complete"

**Salesforce Decommission Plan:**

| Timeframe | Action |
|-----------|--------|
| Cutover day | Restrict SF to read-only access (do not delete) |
| Days 1–30 | Monitor HubSpot stability, SF available as reference |
| Day 30–60 | Export final SF backup for compliance/archive |
| Day 60–90 | Submit SF license termination request |
| Day 90+ | SF fully decommissioned, archived data stored per retention policy |

**Documentation package:**

- All training video recordings
- HubSpot Configuration Guide (properties, pipelines, workflows documented)
- Field Mapping Reference (SF field > HubSpot property, complete)
- Data Migration Reconciliation Report (SF vs HubSpot record counts)
- Definition Alignment Document (final version)
- FAQ document
- Maintenance Schedule
- Integration documentation (which tools connected, configuration settings)

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video walkthrough. Make sure they understand what to check, how often, and when to call us back.

**Output:** Customer owns HubSpot. Salesforce decommission plan in motion. Project formally complete.

---

### 4d. Project Close

> **Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved to proper location
- Handoff documentation complete
- Project status updated in tracking system
- Time/billing finalized
- Salesforce decommission timeline confirmed with customer

#### Internal Debrief (Optional but Recommended)

- What went well? (Data quality, timeline adherence, adoption rates)
- What would we do differently? (Scoping accuracy, workflow rebuild estimates, training approach)
- Any learnings to feed back into SOPs?
- Were there unexpected Salesforce complexities? Document for future migrations.

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| Single Project | Upsell > Downsell > Retry |
| Multi-Project (Dedicated) | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (ongoing CRM optimization, workflow tuning, reporting evolution)
   | if no
   v
2. Downsell: Follow-on project (lead scoring, attribution, reporting pack, lead routing)
   | if yes
   v
3. Retry retainer at end of next project cycle
```

**Script:**

> "Now that your CRM migration is complete and your team is up and running on HubSpot, we can continue working together in two ways. Option 1: We handle ongoing CRM optimization on a managed services retainer. Option 2: We scope a specific next project, like lead scoring or attribution reporting."

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

> "On [date ~90 days out], we'll review HubSpot performance — adoption metrics, data quality, workflow health — and see if adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull adoption data, data quality scores, workflow error logs |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points. |

**At the refinement check-in:**

- Review adoption metrics against original targets
- Assess data quality trends
- Identify workflow optimization opportunities
- If minor: Architect handles tweaks
- If major: Scope new project (restart the assembly line)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Migration Charter (scope, approach, timeline, RACI, risk register)
- Salesforce Audit Document (full environment inventory)
- Field Mapping Document (every SF field > HubSpot property)
- Definition Alignment Document (signed off by stakeholders)
- Data Quality Report (pre-migration assessment)

**Technical Deliverables:**

- Fully configured HubSpot CRM (users, teams, properties, pipelines)
- Migrated data (Companies, Contacts, Deals, Activities, Custom Objects)
- Rebuilt workflows (P1 and P2 automations)
- Reconnected integrations (all third-party tools operational)
- Reports and dashboards (per-department views)
- Data Migration Reconciliation Report (SF vs HubSpot counts)

**Documentation Package:**

- Training video recordings (per-role)
- HubSpot Configuration Guide
- Field Mapping Reference
- "What Changed" Quick Reference (SF > HubSpot)
- FAQ Document
- Definition Alignment Document (final version)
- Maintenance Schedule
- Integration Documentation
- Salesforce Decommission Plan

---

## Appendix

### Roles

| Role | What They Do |
|------|--------------|
| **Architect** | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| **Engineer** | CRM build, automation, dashboards (Phase 2) |
| **SME** | Project/implementation team brought in for project-specific work |

### Phase Outputs & Gates

| Phase | Output | Gate Criteria |
|-------|--------|---------------|
| **Phase 1: Strategy** | Migration Charter + Field Mapping + RACI (signed off) | Stakeholders approved scope, approach, field mapping, and timeline |
| **Phase 2: Engineering** | Fully migrated HubSpot CRM with workflows and integrations | Data reconciliation passed, workflows tested, integrations verified, customer approved |
| **Phase 3: Enablement** | Trained team with documentation and adoption metrics on target | All training delivered, hypercare complete, 90%+ adoption |
| **Phase 4: Handoff** | Independent customer + SF decommissioned + project archived | Handoffs complete, maintenance plan in place, SF decommission timeline confirmed |

### Object Mapping Reference

| Salesforce Object | HubSpot Object | Notes |
|------------------|----------------|-------|
| Account | Company | 1:1 mapping; Account record types become property-based segments |
| Contact | Contact | 1:1 mapping; merge with converted Leads |
| Lead | Contact | Leads and Contacts both become HubSpot Contacts |
| Opportunity | Deal | Record types become separate pipelines |
| Task | Task (Activity) | Logged as activity on associated record |
| Event | Meeting (Activity) | Logged as activity on associated record |
| Campaign | Campaign | Campaign membership migrates as list membership + attribution |
| Campaign Member | List Membership | Maps to HubSpot list or campaign association |
| Product | Product | Available in HubSpot Sales Hub Enterprise |
| Quote | Quote | Available in HubSpot Sales Hub Professional+ |
| Custom Objects | Custom Objects | Requires HubSpot Enterprise; define via API or developer tools |

### Property Type Mapping Reference

| Salesforce Field Type | HubSpot Property Type | Migration Notes |
|----------------------|----------------------|-----------------|
| Text | Single-line text | Direct mapping |
| Text Area | Multi-line text | Direct mapping |
| Picklist | Dropdown select | Values must match exactly; standardize before migration |
| Multi-Select Picklist | Multiple checkboxes | Values must match; delimiter differences may cause issues |
| Number | Number | Direct mapping |
| Currency | Number (formatted) | Set property as currency type in HubSpot |
| Date | Date picker | Verify timezone handling |
| DateTime | Date picker | HubSpot stores midnight UTC; time precision may be lost |
| Checkbox | Single checkbox | Direct mapping (boolean) |
| Formula | Calculated property / Workflow | Requires case-by-case assessment; complex formulas may need Operations Hub |
| Lookup | Association | Becomes HubSpot record association, not a field |
| Email | Email | Direct mapping |
| Phone | Phone number | Direct mapping; standardize formatting before migration |
| URL | URL | Direct mapping |

### Common Salesforce-to-HubSpot Workflow Translations

| Salesforce Automation | HubSpot Equivalent | Complexity |
|----------------------|-------------------|------------|
| Process Builder: Field Update | Workflow: Set Property Value | Low |
| Process Builder: Email Alert | Workflow: Send Internal Notification | Low |
| Process Builder: Task Creation | Workflow: Create Task | Low |
| Flow: Record-Triggered | Workflow: Contact/Deal-based | Medium |
| Flow: Scheduled | Workflow: Date-based trigger | Medium |
| Lead Assignment Rule | Workflow: Rotate Records / Custom Code | Medium |
| Apex Trigger | Operations Hub: Custom Code Action | High |
| Validation Rule | Required Properties + Workflow | Medium |
| Approval Process | Workflow + Manual Step (limited) | High |
| Custom Lightning Component | No direct equivalent | Custom dev |

### Key Implementation Notes

**Why Strategy Matters for Migration:** Migration projects fail most often from poor scoping, not poor execution. Over 80% of data migration projects exceed timelines or budgets, and the root cause is typically unclear scope, unresolved stakeholder disagreements about what to migrate, or underestimated workflow complexity. Phase 1 forces these decisions before engineering begins.

**The Simplify-Don't-Replicate Principle:** Migration is an opportunity to simplify, not just replicate. Challenge every "we've always done it this way" with "does HubSpot have a better native approach?" Common simplification wins: retire unused Salesforce workflows, consolidate redundant picklist values, replace Apex triggers with native HubSpot workflow actions, simplify record type structures into cleaner pipeline designs.

**Data Migration Sequence Matters:** Always migrate in dependency order: Companies first (no dependencies), then Contacts (depend on Companies for association), then Deals (depend on Contacts and Companies), then Activities (depend on all above). Importing out of order breaks associations and requires manual cleanup.

**The Test Migration Is Non-Negotiable:** A 25-person SaaS company that skipped test migration and imported 180K contacts directly ended up with 54K duplicate records (30% duplicate rate), costing 120 hours of manual cleanup and $23K in lost productivity. Always run a test migration with 1,000–5,000 representative records per object type before production import.

**Workflow Rebuild Takes Longer Than Expected:** Budget 30–40% of total project time for workflow rebuild. Salesforce automations do not migrate automatically. Each workflow must be audited, translated to HubSpot logic, built, and tested.

**Migration Training Is Change Management:** Unlike a greenfield CRM implementation, migration training must address the delta between what users know (Salesforce) and what they need to learn (HubSpot). The "What Changed" quick reference document is the single most important training asset.

**Salesforce Decommission Requires Patience:** Do not rush Salesforce termination. Maintain read-only access for 30–90 days as a safety net. The cost of 1–3 extra months of read-only Salesforce licenses is trivial compared to an emergency data recovery.

---

## References

[1] Oracle 2024 Data Migration Report — "Over 80% of data migration projects exceed timelines or budgets, with cost overruns averaging 30% and time delays reaching 41%."

[2] Introhive - CRM Data Migration Best Practices — "Up to 70% of CRM records become inaccurate within a year without active data management."

[3] Clearout - 10 Proven CRM Migration Best Practices — "Nearly 70% of data migration projects go over time, blow their budgets, or fail completely, with poor planning and data quality being the main causes."

[4] HubSpot - Switching from Salesforce — "70% of CRM projects fail due to poor user adoption. Role-based training and structured enablement are the primary mitigation."

[5] HubSpot Knowledge Base - Map Salesforce Record Types — "Both Leads and Contacts in Salesforce map to the Contacts object in HubSpot."

[6] Huble Digital - 10 Pitfalls to Avoid When Migrating from Salesforce to HubSpot — Case study of 25-person SaaS company with 30% duplicate rate post-migration due to skipping deduplication.

[7] Aptitude 8 - Salesforce to HubSpot Migration: Full Cost Comparison — "Most companies underestimate true Salesforce TCO; HubSpot typically delivers 30–50% reduction in total CRM costs."

[8] SmartBug Media - Salesforce to HubSpot Migration Guide — "Integration mapping document should outline HubSpot properties, Salesforce fields, sync direction, and custom object mapping before any migration work begins."