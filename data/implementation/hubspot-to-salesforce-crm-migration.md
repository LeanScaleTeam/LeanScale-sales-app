# HubSpot to Salesforce Migration — Implementation

## Project One-Pager

### HubSpot to Salesforce Migration One-Pager

#### Project Type

- Category: Technical
- Primary Deliverable: Fully configured Salesforce instance with migrated data, automations, layouts, and connected third-party tools

##### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Light | ~30 days of scoping; The Big Five decisions + workback plan |
| 2. Engineering | Yes | Heavy | Field mapping, automations, layouts, data migration, integrations |
| 3. Enablement | Yes | Light | End user + admin training, 2-4 weeks hypercare |
| 4. Handoff | Yes | Light | Internal + External handoff, transition to steady-state |

#### Phase Overview

**This project's flow:**

- Full 4-phase. Light strategy (scoping-focused), heavy engineering (60-80% of effort), light enablement, standard handoff.
- No phases skipped. Phase 2 is the bulk of the project (~150 hours standard, 350-400 for mergers).
- Phase 1 runs ~30 days before engineering begins. Salesforce license needed by start of Phase 2c.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Provide admin access to HubSpot instance
- Complete inventory of connected third-party tools (Gong, Salesloft, Outreach, ChurnZero, etc.)
- Identify key decision-makers for architecture decisions
- Gather any existing documentation on current HubSpot setup (workflows, lifecycle stages, custom objects)

##### Track B: Architect Prep

- Gain admin access to HubSpot and begin initial inventory (fields, workflows, integrations)
- Review current HubSpot field structure per object (contacts, companies, deals)
- Identify scope signals: data volume, custom objects, third-party tool count
- Draft initial scoping questions for kickoff based on inventory findings

#### Refinement Loop (1b → 1c → 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Establish timeline, scope, working relationship | Architect + Client leads | Initial scoping direction |
| Scoping 1 | 1c | Accounts + Opportunities architecture | Architect + Client | Account/Opp decisions documented |
| Scoping 2 | 1c | Contacts/Leads architecture + lead lifecycle | Architect + Client | Contact routing + lifecycle design |
| Scoping 3 | 1c | Technology strategy + data structure decisions | Architect + Client | Third-party one-pagers, ETL/ELT decision |
| Workback Review | 1c | Review workback plan, align on milestones | Architect + Client | Approved workback plan |
| Sign-Off | 1d | Confirm all Big Five decisions, approve build plan | All stakeholders | Strategic sign-off to begin build |

**Cadence:** Two meetings per week during scoping phase.

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (HubSpot access + initial inventory)
- 1b. Kickoff call held
- 1c. All Big Five categories scoped (Accounts, Opportunities, Contacts/Leads, Technology, Data Structure)
- 1c. ETL vs ELT approach decided
- 1c. Contacts-to-Leads architecture decided (lead-based vs contact-only)
- 1c. Workback plan created and reviewed
- 1d. Strategic sign-off obtained — ready for engineering

##### Phase 2: Engineering

- 2a. Tech spec created (field mapping docs + automation specs)
- 2b. Engineering handoff meeting held (Architect → Engineer)
- 2c. Field mapping & data audit complete (per object)
- 2c. Automations & workflows built (including The Hits)
- 2c. Layout design & UX configured
- 2c. Data migration executed
- 2c. Third-party tools installed and connected
- 2d. QA complete (10-item checklist) + launch/cutover executed

##### Phase 3: Enablement

- 3a. Training materials prepped (workflow docs, admin guides)
- 3b. End user training delivered
- 3b. Admin training delivered
- 3c. Hypercare period complete (2-4 weeks)
- 3d. Enablement sign-off — team operating independently

##### Phase 4: Handoff

- 4a. Maintenance schedule documented
- 4b. Internal handoff complete
- 4c. External handoff (LeanScale → Customer) complete
- 4d. Project closed and archived

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| Field Audit Spreadsheets | Per-object field analysis and migration action | All fields reviewed, client decisions captured |
| Workback Plan | Milestone tracking, dependencies, deadlines | All milestones listed, timeline agreed |
| Scoping Documents (Word/Docs) | Architecture decisions for The Big Five | All five categories decided |
| Third-Party Tool One-Pagers | Per-tool migration strategy | Strategy documented for every connected tool |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| Fully configured Salesforce instance | Field audits + scoping | Daily CRM operations |
| Data migration (historical preserved) | Field mapping + ETL work | Continuity of business records |
| Connected third-party integrations | Tool one-pagers | Sales/marketing tool ecosystem |
| Architecture diagrams (Lucidchart) | Scoping documents | Internal documentation |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| End User | Sales reps, marketing, CS | Navigate new Salesforce UI, complete common tasks, key workflow changes | 60 min |
| Admin | RevOps, Salesforce admin | System management, workflow maintenance, troubleshooting, field/layout changes | 60-90 min |

##### Hypercare

- Applies: Yes
- Duration: 2-4 weeks post-launch
- Office Hours: Yes — reactive support for issues, scheduled availability

##### Training Assets to Create

- Video walkthrough: End user walkthrough of new Salesforce instance
- Video walkthrough: Admin training on system management and maintenance
- Doc: Key process and workflow documentation
- Doc: Field mapping reference (what moved where)

#### Handoff & Retention

##### Internal Handoff

- Key context for Architect: Architecture decisions made (Big Five), any edge cases or client-specific workarounds, list of third-party tools and cutover status
- Escalation trigger: Any structural changes to object architecture, workflow logic modifications, new third-party tool integrations

##### External Handoff (LeanScale → Customer)

- Final meeting agenda: Confirm all data migrated, review key workflows, walk through new UI/UX, confirm all third-party tools connected, set expectations for post-hypercare steady-state
- Documentation package: Field audit spreadsheets, scoping documents, training recordings, workflow documentation

##### Maintenance Schedule

- Post-hypercare: Transition to steady-state operations with standard ongoing optimization as needed
- Who owns: Single project = customer owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services → if no → Downsell: Adjacent project (Attribution, Lead Lifecycle, Deduplication, CPQ) → Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~1 quarter post-launch
- Internal prep trigger: 2 weeks before
- Decision: Architect handles / Engineer needed

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| Lead (Salesforce) | A person who has expressed interest but is not yet associated with an Account/Opportunity |
| Contact (Salesforce) | A person attached to an Account — typically post-conversion from Lead |
| Contact (HubSpot) | A single object representing both leads and contacts — no Lead/Contact split |
| Conversion | The act of turning a Salesforce Lead into a Contact + Account (+ optionally Opportunity) |
| The Big Five | The five object categories scoped in every migration: Accounts, Opportunities, Contacts/Leads, Technology, Data Structure |
| ETL | Extract, Transform, Load — transform data before loading into Salesforce |
| ELT | Extract, Load, Transform — load data as-is into Salesforce, transform after |
| The Hits | Foundational automations included in every migration (timestamps, conversion checkboxes, renewal infrastructure, etc.) |
| Workback Plan | Milestone-based planning document listing all deliverables, decisions, and dependencies with deadlines |
| Hypercare | 2-4 week period of intensive post-launch support for issue resolution and system stabilization |

#### Common Gotchas

- **ELT complications** — Going ELT can cause downstream issues. The time saved upfront can be lost in post-load cleanup. → Use ETL approach when possible; only go ELT if timeline truly requires it.
- **Third-party tool cutover timing** — Sales engagement tools (Salesloft, Outreach) have very tight cutover windows. Disconnect HubSpot too early = missing data. Connect Salesforce too late = missing data. → Plan cutovers precisely with just-in-time strategy. Identify which tools can go early vs which must be cut over at launch.
- **Unexpected workflow behavior in production** — Even with thorough QA, some workflows behave differently with real user data at scale. → Plan for hypercare support period; treat it as expected, not optional.
- **Historical data transformation decisions** — Deciding what to do with historical anomalies (multiple opps per renewal, conflicting picklist values, dead fields) can be contentious and time-consuming. → Address during field audit and scoping phases (Phase 1c/2c). Don't defer these to migration day.
- **Attribution over-engineering** — Scope creep on attribution during migration can consume disproportionate hours. → Gauge appetite during scoping. Basic attribution = part of The Hits. Deep attribution = separate project.

#### Methodology Options

| Option | When to Use | Complexity |
|--------|-------------|-----------|
| ETL (recommended) | Cleanup needed, budget allows, standard timeline | Medium |
| ELT | Tight timeline or constrained budget | High (downstream risk) |
| Lead-based (recommended) | Most scenarios (~14 of 15 customers) | Medium |
| Contact-only | Very rare; tight data universe control required | High (Gmail signups problematic) |

---

## Phase 1: Strategy

> **Goal:** Get stakeholder sign-off on architecture decisions across The Big Five before building anything.
>
> **Output:** Scoping documents (Word/Docs), architecture diagrams (Lucidchart), data mapping spreadsheets, workback plan — all signed off by client stakeholders.

### 1a. Pre-Kickoff

> Two parallel tracks run after the deal closes and before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Access request | Grant admin access to HubSpot instance | Email |
| Third-party tool inventory request | Complete list of all connected tools | Spreadsheet/Email |
| Stakeholder identification | Identify decision-makers for architecture choices | Email |

**Completion tracking:** Follow up on HubSpot admin access immediately — this is the critical-path blocker. Without access, inventory cannot begin.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Gain admin access to HubSpot instance | Access confirmed |
| 2 | Begin initial inventory — fields per object, active workflows, integrations | Raw inventory data |
| 3 | Identify scope signals — data volume, custom objects, tool count | Initial complexity estimate |
| 4 | Review for merger indicators (multiple instances, conflicting schemas) | Standard (~150 hrs) or merger (~350-400 hrs) estimate |
| 5 | Draft scoping questions based on inventory findings | Kickoff meeting prep |

**Critical:** This is reconnaissance, not decision-making. Inventory first, scope second.

---

### 1b. Kickoff Call

> **Purpose:** Establish the working relationship and begin scoping The Big Five.

#### Agenda (60 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Introductions + project overview | Establish timeline expectations, overall scope, roles |
| 15-30 | Migration drivers | What's driving the move? (Data visibility, usability, Salesforce comfort) |
| 30-45 | Initial scoping discussion | Begin collecting info on The Big Five categories |
| 45-60 | Next steps | Set meeting cadence (2x/week), assign homework |

#### What We Bring

- Initial HubSpot inventory findings
- Scoping questions drafted from inventory review
- High-level project timeline estimate

#### What We Leave With

- Understanding of migration drivers and priorities
- Initial direction on accounts and opportunities architecture
- Client-side stakeholder map and decision authority
- Confirmed meeting cadence (two meetings per week)

---

### 1c. Alignment Loop & Strategic Meeting Cadence

> **Purpose:** Scope all five categories of The Big Five and create the workback plan. This is the structured decision-making phase.

#### The Pattern

```
Kickoff (gather context)
    ↓
Scoping Meeting 1: Accounts + Opportunities
    ↓
Scoping Meeting 2: Contacts/Leads + Lead Lifecycle
    ↓
Scoping Meeting 3: Technology Strategy
    ↓
Scoping Meeting 4: Data Structure + Workback Plan Review
    ↓
Sign-Off Meeting: Approve all decisions, begin engineering
```

**Cadence:** Two meetings per week. First ~30 days are primarily scoping-focused before build begins.

#### The Big Five Scoping Sequence

**Category 1: Accounts Architecture**

- Review current HubSpot company structure
- Define Salesforce account hierarchy needs
- Typically the least controversial object
- Output: Account architecture documented

**Category 2: Opportunities Architecture**

- Review current HubSpot deals structure
- Map to Salesforce opportunity stages
- Address transformation needs (e.g., consolidating multiple renewal/expansion opps)
- Output: Opportunity architecture documented

**Category 3: Contacts/Leads Architecture** (the noteworthy one)

- HubSpot has one Contact object. Salesforce has separate Lead and Contact objects. This is not 1:1.
- Decide: Lead-based (recommended, ~14 of 15 customers) vs Contact-only (rare)
- If lead-based: Design lead lifecycle and statuses, conversion triggers, creation flows
- If contact-only: Must have tight data universe control. Gmail/personal email signups have nowhere to go (no Google account to attach to). May need "orphanage" accounts as workaround.
- Output: Contacts/Leads architecture + lifecycle design documented

**Category 4: Technology Strategy**

- Inventory all third-party tools connected to HubSpot (Gong, Salesloft, Outreach, ChurnZero, CPQ tools, data enrichment, etc.)
- For each tool, create a one-pager: current state, migration strategy (reconnect, replace, or deprecate), timeline, dependencies
- Identify just-in-time cutover tools (Salesloft — too early = missing data, too late = missing data)
- Identify tools that can be built early (CPQ — net-new in Salesforce, doesn't replace existing)
- Check if client has negotiated migration support in vendor contracts
- Output: One-pager per tool

**Category 5: Overall Data Structure**

- Decide ETL vs ELT approach (ETL recommended — transform before loading. ELT can cause complications.)
- Determine transformation scope — how much cleanup during migration vs lift-and-shift
- More transformation = more hours but better end state
- Output: Data structure decisions documented

#### Workback Plan Creation (parallel with scoping)

The workback plan is created during scoping and evolves as decisions are made.

- Create workback plan document (Excel/Sheets or Gantt-style)
- List all milestones needed to deliver project on time
- Include decision deadlines and deliverable deadlines
- Include team/license needs by date (Salesforce license needed before Phase 2c)
- Include dependencies between items
- Typical size: 25-30 items (not 160+ like merger examples)
- Review workback plan with client — get alignment on timeline and milestones
- Update as scope evolves (e.g., CPQ evaluation added when decision is made)

---

### 1d. Strategic Sign-Off

> **Purpose:** Confirm all Big Five decisions are made and documented before proceeding to engineering.

#### Validation Checkpoint

- All five categories of The Big Five scoped and documented
- ETL vs ELT approach decided
- Contacts-to-Leads architecture decided (lead-based vs contact-only)
- Lead lifecycle designed (if lead-based)
- Third-party tool strategy documented (one-pager per tool)
- Workback plan reviewed and approved by client
- Salesforce license confirmed available (required for Phase 2c automations build)
- No blockers for engineering

#### Decision Point

- **Proceed to Engineering** → All scoping complete, license available, build can begin

---

## Phase 2: Engineering

> **Goal:** Build and configure the Salesforce instance per approved scoping decisions.
>
> **Output:** Fully configured Salesforce instance — fields mapped, automations built, layouts configured, data migrated, third-party tools connected, QA passed.

Project Type | Engineering Weight
---|---
This project | Engineering-heavy (60-80%)

Field mapping, automations, layouts, data migration, integrations — this is the bulk of the work

### Sub-Phases

```
2a Tech Spec → 2b Engineering Handoff → 2c Build → 2d QA/Test + Launch
```

---

### 2a. Tech Spec

> **Purpose:** Translate scoping decisions into technical specifications — the bridge between strategy and build.

**Input:** Signed-off scoping documents, architecture diagrams, workback plan from Phase 1

**What happens:**

1. Create field audit spreadsheet for each core object (Accounts, Opportunities, Contacts/Leads)
2. Per-field documentation:
   - Field name, field type, fill rate, last updated date
   - How it's primarily updated (manual, workflow, calculated, integration)
   - Is it a standard field created by the system?
   - Is it used in workflows? (If we delete it, will it break other things?)
   - Picklist options if applicable (what are all the options, do we want to keep all of them?)
3. Analyze each field for migration decision: Keep as-is / Transform / Delete
4. Document data transformation needs (duplicates, junk data, historical anomalies)

**Key priorities during field analysis:**

- Minimize multi-picklist fields (causes reporting issues)
- Minimize free-text fields (causes sustainability issues)
- Identify duplicates to merge
- Identify junk data to exclude from migration

**Key insight:**

> If they have 500 fields in HubSpot, we're not going to lift and replace. We want to analyze: Are these fields actually being used? Are they providing value? Is there anything funky about the data structure itself?

**Output:** Field audit spreadsheets per object with migration decisions documented

---

### 2b. Engineering Handoff

> **Purpose:** Transfer scoping context and tech specs from Architect to Engineer before build begins.

**Who attends:** Architect + Engineer

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through scoping decisions | Architect explains The Big Five decisions, architecture diagrams, and client context |
| 15-30 | Review field audit docs | Walk through field-by-field migration decisions per object |
| 30-45 | Build sequence and dependencies | Confirm order of operations, flag risks, agree on approach |

**What Architect brings:**

- Scoping documents and architecture diagrams
- Field audit spreadsheets with migration decisions
- Workback plan with build milestones
- Third-party tool one-pagers with cutover timelines

**What Engineer leaves with:**

- Full context on architecture decisions and client priorities
- Clear field-by-field build instructions
- Build sequence aligned to workback plan
- Known risks and dependencies

---

### 2c. Build (Configure)

> **Purpose:** Build the Salesforce instance — field mapping, automations, layouts, data migration, and integrations.

**Input:** Approved field audits and scoping decisions from 2a/2b

**Salesforce license is REQUIRED from this point forward.**

The build phase covers five parallel/sequential workstreams:

#### Workstream 1: Field Mapping & Data Strategy Execution

1. Review field audit with client — walk through recommendations, get client decisions on each field
2. Create tasks for each transformation (delete these fields, merge these fields, transform these picklist values, clean up these records)
3. Execute field transformations per approved decisions

> This is the tricky part of the 'T' in ETL. This is going to be the best time to do any transformational work because you're already introducing disruption.

**Common forks at this stage** (may spawn adjacent projects):

- GTM Lifecycle / Lead Lifecycle project
- Deduplication project
- Tool evaluation (CPQ, attribution depth)

#### Workstream 2: Automations & Workflows Build

1. Audit existing HubSpot workflows — document all active workflows, identify which need recreation, which are no longer needed
2. Build "The Hits" (Foundational Automations):
   - Timestamps for stage movement and velocity tracking (leads and opportunities)
   - Conversion checkboxes
   - Stage timing workflows for documenting customer lifecycle events
   - Renewal infrastructure (automatic generation of recurring revenue renewals)
   - ACV/TCV calculations
   - Increase/expansion tracking fields
   - Commission-related fields
   - Attribution fields (basic setup — gauge appetite; deep attribution is a separate project)
3. Build client-specific workflows — recreate necessary HubSpot workflows in Salesforce, implement new workflows identified during scoping
4. Build conversion flows (if lead-based approach) — Lead-to-Contact conversion process and related automation triggers
5. Document all automations built

**Warning:** Basic attribution = part of The Hits. Full attribution with operational depth = separate project. Gauge appetite during scoping to avoid scope creep.

#### Workstream 3: Layout Design & UX Configuration

1. Design page layouts for each object (Accounts, Contacts, Leads, Opportunities)
2. Configure record types if needed
3. Build Lightning pages and components
4. Configure list views and reports
5. Test user experience flows

#### Workstream 4: Data Migration

1. Prepare data extraction from HubSpot — export all records, apply transformations per ETL approach
2. Prepare Salesforce for import — ensure target fields exist, configure validation rules
3. Perform test migration — import subset, validate accuracy, test workflows fire correctly
4. Execute full data migration — import all records, maintain relationships, preserve historical data
5. Validate data migration — spot check records, verify record counts, confirm relationships intact

#### Workstream 5: Third-Party Tool Installations

1. Install and configure tools that can go early (CPQ tools, new tools not replacing existing)
2. Plan cutover timing for just-in-time tools
3. Execute just-in-time tool cutovers at launch (disconnect HubSpot, connect Salesforce, data backfills if needed)
4. Validate all integrations (test data flow, confirm functionality)

---

### 2d. QA / Test + Launch & Cutover

> **Purpose:** Verify the build works, then execute go-live.

#### QA Checklist (10 Items)

| # | Check | Pass? |
|---|-------|-------|
| 1 | All field mappings accurately transferred | [ ] |
| 2 | Data record counts match expectations | [ ] |
| 3 | No orphaned records (contacts without accounts in Salesforce) | [ ] |
| 4 | All workflows triggering correctly | [ ] |
| 5 | Lead conversion process working (if lead-based approach) | [ ] |
| 6 | All third-party integrations connected and flowing data | [ ] |
| 7 | User permissions configured correctly | [ ] |
| 8 | Reports and dashboards populated accurately | [ ] |
| 9 | Historical data preserved appropriately | [ ] |
| 10 | No duplicate records created during migration | [ ] |

Industry context: "CRM implementation projects have a 47-55% failure rate when measured against planned objectives. The QA phase directly addresses the most common failure driver — migrating dirty or mismatched data without validation."

#### Launch & Cutover

1. **Final QA pass** — test all workflows, integrations, user access/permissions
2. **Coordinate cutover timing** — align on go-live date, plan for minimal disruption
3. **Execute cutover** — make Salesforce system of record, complete remaining just-in-time tool cutovers
4. **Communicate launch to end users** — announce go-live, provide access credentials/instructions

#### Engineering Sign-Off Checkpoint

- All QA checklist items passing
- Salesforce is system of record
- All third-party tools connected and validated
- Data migration complete and verified
- Ready for enablement

**Decision point:**

- **Proceed to Enablement** → System is live, needs training and hypercare
- **Loop back to Build** → Critical issues found, needs fixes before go-live

---

## Phase 3: Enablement

> **Goal:** Customer team can use the new Salesforce instance effectively.
>
> **Output:** Trained team with documentation, stabilized system through hypercare, no critical issues outstanding.

### Sub-Phases

```
3a Training Prep → 3b Training Sessions → 3c Hypercare → 3d Enablement Sign-Off
```

---

### 3a. Training Prep

> **Purpose:** Prepare training materials based on the specific build delivered.

**Input:** Completed Salesforce build + scoping documents + workflow documentation

**What happens:**

1. Identify training audiences (end users vs admins)
2. Create training agenda for each audience
3. Prepare walkthrough scripts covering key workflows and daily-use patterns
4. Document key process changes from HubSpot to Salesforce (what moved, what's different)
5. Prepare FAQ based on common questions from similar migrations

**Output:** Training package containing:

- End user training agenda and walkthrough script
- Admin training agenda covering system management
- Process change documentation (HubSpot → Salesforce differences)
- FAQ draft

---

### 3b. Training Sessions

> **Purpose:** Transfer knowledge to customer team so they can operate in the new system.

**Two types of training:**

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| End User | Sales, marketing, CS | Navigate new Salesforce interface, complete common tasks, understand key workflow changes | 60 min |
| Admin | RevOps, Salesforce admin | System management, workflow maintenance, troubleshooting, how to make field/layout changes | 60-90 min |

**Training delivery:**

1. Schedule sessions with appropriate stakeholders
2. Deliver training (live — record for future reference)
3. Record video walkthroughs for async access
4. Answer questions, note gaps for FAQ updates

**Output:**

- Trained end users and admins
- Recordings of training sessions
- Updated FAQ with questions raised during training

---

### 3c. Hypercare

> **Purpose:** Intensive post-launch support to stabilize the system with real production data.

**Duration:** 2-4 weeks post-launch

Industry context: "Hypercare periods of 2-8 weeks post-launch are standard for CRM implementations, with dedicated resources for real-time monitoring and rapid issue resolution. For migrations specifically, the 2-4 week window is appropriate for standard complexity."

**What happens:**

- Reactive support for issues that arise in production
- Patch things that don't behave as expected with real user data at scale
- Address edge cases discovered with production data
- Monitor workflows for unexpected behavior
- Fine-tune automations based on user feedback
- Document all fixes and adjustments made

> One day we'll get a migration that doesn't have anything that needs to be fixed. The day that we do, it will be the first.

**Hypercare is not optional for migrations.** Technical projects at this complexity need it. The question is duration, not whether to do it.

**Output:** Stabilized system, all critical issues resolved, fixes documented

---

### 3d. Enablement Sign-Off

> **Purpose:** Confirm customer team can operate the new Salesforce instance independently.

#### Validation Checkpoint

- End user training delivered and recorded
- Admin training delivered and recorded
- Hypercare period complete (2-4 weeks)
- All critical issues discovered during hypercare resolved
- Customer team can operate without daily LeanScale support
- Training recordings and documentation provided
- Ready for handoff

#### Decision Point

- **Proceed to Handoff** → Customer is enabled, system is stable, project wrapping up
- **Extend Hypercare** → Still unstable, needs more support time

---

## Phase 4: Handoff

> **Goal:** Clean project close with maintenance plan established and retention/expansion path set.
>
> **Output:** Maintenance expectations documented, internal context transferred, customer owns the system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule → 4b Internal Handoff → 4c External Handoff → 4d Project Close
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|----------------------|---------------|
| **Single Project** | Customer owns | 4c (External Handoff) |
| **Dedicated (Multi-Project)** | Architect owns | 4b (Internal Handoff) |

---

### 4a. Maintenance Schedule

> **Purpose:** Document what needs ongoing attention after hypercare ends.

#### Post-Hypercare Monitoring

A CRM migration is a one-time project, but the system requires ongoing attention to prevent drift. After hypercare, the system transitions to steady-state operations.

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|-------------------|
| Workflow health check | All automations triggering correctly, no error logs | Any workflow failures or unexpected triggers |
| Data quality spot check | Duplicate records, orphaned contacts, fill rate drift | Duplicate rate exceeding pre-migration baseline |
| Integration monitoring | All third-party tools syncing correctly | Any sync failures or data gaps |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|----------------|---------------------|
| User adoption review | Login frequency, record update rates, feature usage | Additional training if adoption declining |
| Field utilization audit | Are new fields being used as intended? | Deprecate unused fields, adjust layouts |

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Workflow failures | Recurring failures in production | Re-engage Engineer for diagnosis |
| New tool integration needed | Client adds new tool requiring Salesforce connection | Scope as new mini-project |
| Data quality degradation | Duplicate rate or junk data rising significantly | Scope deduplication project |

---

### 4b. Internal Handoff

> **Purpose:** Transfer project context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- Architecture decisions made (The Big Five outcomes)
- Client context — key stakeholders, decision-making style, any sensitivities
- Third-party tool ecosystem and cutover status (all tools, their status, any ongoing considerations)
- Common issues seen during hypercare and how they were resolved
- When to escalate back to Engineer

**Escalation guidelines:**

| Issue Type | Who Handles | Example |
|------------|-------------|---------|
| Small tweaks, minor questions | Architect | Field label changes, report filter adjustments |
| Significant changes, complex issues | Architect/Engineer | Object architecture changes, new workflow logic, new integrations |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing it.

---

### 4c. External Handoff (LeanScale → Customer)

> **Purpose:** Formal project completion with customer.

**Final Project Meeting Agenda:**

1. Confirm all data migrated successfully
2. Review key workflows and how they function
3. Walk through the new UI/UX
4. Confirm all third-party tools connected
5. Review enablement materials and training recordings
6. Set expectations for post-hypercare steady-state
7. Discuss ongoing support model
8. Make it explicit: "Project complete"

**Documentation package delivered:**

- Field audit spreadsheets (per object) — what was mapped, transformed, or removed
- Scoping documents — all Big Five architecture decisions
- Third-party tool strategy one-pagers
- Training recordings (end user + admin)
- Workflow documentation — all automations built, including The Hits
- Workback plan (final version)

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video walkthrough. Make sure they understand what to check, how often, and when to call LeanScale back.

**Output:** Customer owns the system. Project formally complete.

---

### 4d. Project Close

> **Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved to proper location
- Field audits, scoping docs, and workback plan archived
- Handoff documentation complete
- Time/billing finalized

#### Internal Debrief (Optional but Recommended)

- What went well?
- What would we do differently?
- Any learnings to feed back into the migration playbook?
- Did the workback plan estimate hold? If not, where did scope expand?

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| **Single Project** | Upsell → Downsell → Retry |
| **Multi-Project (Dedicated)** | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (retainer)
   ↓ if no
2. Downsell: Adjacent one-time project
   - Lead Lifecycle Design
   - Attribution (full depth)
   - Deduplication
   - CPQ Implementation
   ↓ if yes
3. Retry retainer at end of next project cycle
```

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in ~1 quarter post-launch:

> On [date], we'll review how the Salesforce instance is performing and see if any adjustments are needed.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Scoping documents for all Big Five categories (Accounts, Opportunities, Contacts/Leads, Technology, Data Structure)
- Architecture diagrams (Lucidchart) where applicable
- Workback plan document (final version)
- Third-party tool strategy one-pagers

**Technical Deliverables:**

- Fully configured Salesforce instance:
  - All fields mapped and created per field audit decisions
  - All automations and workflows built (including The Hits)
  - Page layouts configured per object
  - User permissions set up
- Data migration completed with historical data preserved
- All third-party integrations connected and validated

**Documentation Package:**

- Field audit spreadsheets (per object)
- Training recordings (end user + admin)
- Workflow documentation (all automations built)
- Process change documentation (HubSpot → Salesforce differences)
- Maintenance schedule

---

## Appendix

### What This Document Is

This is the implementation playbook — the step-by-step execution guide an Architect follows to deliver a HubSpot to Salesforce migration from first contact to project close. It follows LeanScale's 4-phase framework: Strategy, Engineering, Enablement, Handoff.

### What Each Phase Produces

| Phase | Output | Gate Criteria |
|-------|--------|---------------|
| **Phase 1: Strategy** | Signed-off scoping package (Big Five decisions + workback plan) | Client stakeholders have approved architecture decisions and timeline |
| **Phase 2: Engineering** | Built and tested Salesforce instance | QA checklist passed, data migrated, tools connected, cutover executed |
| **Phase 3: Enablement** | Trained team with documentation | All training delivered, hypercare complete, team operating independently |
| **Phase 4: Handoff** | Independent customer + archived project | Internal/external handoffs complete, maintenance plan in place, project closed |

### How to Adapt Per Project Type

This project is **Engineering-heavy**:

| Project Profile | Strategy Weight | Engineering Weight | Enablement Weight |
|-----------------|-----------------|-------------------|-------------------|
| **Engineering-heavy** | 10-20% | 60-80% | 10-20% |
| HubSpot to Salesforce Migration | | | |

**Adaptation for this project:**

- Phase 1 compresses into ~30 days of scoping (light relative to total project)
- Phase 2 expands significantly with five parallel workstreams (field mapping, automations, layouts, data migration, integrations)
- Phase 3 is standard — end user + admin training, 2-4 weeks hypercare
- Phase 4 always applies — handoff and maintenance schedule

### Related Projects as Expansion Path

Migrations naturally expose adjacent project opportunities. These are identified during scoping or build but deferred to keep the migration on track:

1. **GTM Lifecycle / Lead Lifecycle Design** — Basic lifecycle is part of the migration. Full redesign with operational depth = separate project.
2. **Deduplication** — Basic cleanup during field audit. Deep dedup at scale = separate project.
3. **Attribution** — Basic fields included in The Hits. Deep attribution = separate project.
4. **CPQ Implementation** — HubSpot has native quoting, Salesforce doesn't. CPQ tool selection and implementation = separate project.
5. **Third-Party Tool Migrations** — Each complex tool migration (ChurnZero, Salesloft with heavy config) can be its own mini-project.

---

## References

\[1\] Johnny Grow - The CRM Failure Rate is 55%
\[2\] Salesforce - Why Do CRM Projects Fail
\[3\] Expert Allies - Why Hypercare Matters
\[4\] KamelBPO - Hypercare Explained: Best Practices and Benefits