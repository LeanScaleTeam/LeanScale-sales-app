# Opportunity Management UX Improvements — Implementation

## Project One-Pager

Quick reference for architects. One per project type. Fill this out FIRST — it serves as the project's identity card.

### Opportunity Management UX Improvements One-Pager

#### Project Type

- **Category:** Technical
- **Primary Deliverable:** Redesigned Salesforce opportunity page layouts, compact layouts, quick actions, Sales Path configuration, and Kanban view — all optimized to reduce rep friction and increase CRM adoption

##### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Medium | Audit current state, gather rep feedback, design blueprints |
| 2. Engineering | Yes | Heavy | Build layouts, quick actions, Sales Path, Kanban in sandbox |
| 3. Enablement | Yes | Medium | Train reps on new UX, establish adoption champion |
| 4. Handoff | Yes | Light | Documentation package, maintenance schedule, metrics review |

#### Phase Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. STRATEGY  │────▶│ 2. ENGINEER  │────▶│3. ENABLEMENT │────▶│  4. HANDOFF  │
│   Medium     │     │    Heavy     │     │   Medium     │     │    Light     │
│ 1a→1b→1c→1d │     │ 2a→2b→2c→2d │     │ 3a→3b→3c→3d │     │ 4a→4b→4c→4d │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
  Audit & Blueprint    Build in Sandbox     Train Sales Team     Docs & Metrics
  Rep Interviews       QA & Pilot Test      Adoption Champion    Ownership Transfer
```

**This project's flow:**

- Full 4-phase. Medium strategy (audit + design), heavy engineering (Salesforce configuration), medium enablement (training + champion), light handoff.
- Engineering is the heaviest phase because the value comes from actually reconfiguring page layouts, compact layouts, quick actions, Sales Path, and Kanban views in Salesforce.
- Some customers may skip 3c Hypercare if changes are purely layout-based with no workflow automation.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Share access to Salesforce Setup (admin credentials or grant Architect profile)
- Provide list of all opportunity record types currently in use
- Provide current page layout assignments by profile/role
- Identify 3-5 sales reps available for 30-minute friction interviews
- List all active reports and dashboards that reference opportunity fields

##### Track B: Architect Prep

- Export all opportunity page layouts and profile assignments from Setup
- Run Salesforce Optimizer or install Field Trip app to pull field usage data
- Screenshot current opportunity page layouts (section by section)
- Count total fields per layout, identify fields above vs. below the fold
- Document all related lists and their column configurations

#### Refinement Loop (1b -> 1c -> 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present audit findings, validate pain points | VP Sales, RevOps Lead | Confirmed friction points |
| Refinement 1 | 1c | Review layout blueprint, field hierarchy decisions | RevOps Lead, Sales Manager | Approved field placement plan |
| Refinement 2 | 1c | Review quick action designs, Sales Path content | VP Sales, RevOps Lead | Approved action + path designs |
| Sign-Off | 1d | Final blueprint approval, sandbox build authorization | VP Sales, RevOps Lead | Signed-off design package |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held — audit findings presented
- 1c. Refinement loop complete (blueprint finalized)
- 1d. Strategic sign-off obtained on layout designs

##### Phase 2: Engineering

- 2a. Tech spec created (field mapping, layout configurations, quick action specs)
- 2b. Engineering handoff meeting held
- 2c. Build complete (layouts, compact layouts, quick actions, Sales Path, Kanban)
- 2d. QA/Test + pilot user validation + customer sign-off

##### Phase 3: Enablement

- 3a. Training materials prepped (quick reference guide, video walkthrough scripts)
- 3b. Training sessions delivered (live demo + recording)
- 3c. Hypercare period complete (2 weeks post-launch monitoring)
- 3d. Enablement sign-off

##### Phase 4: Handoff

- 4a. Maintenance schedule documented and handed off
- 4b. Internal handoff (SME -> Architect) complete
- 4c. External handoff (delivery team -> Customer) complete
- 4d. Project closed and archived

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| Field Usage Audit Spreadsheet | Field completion rates, usage data per layout | All fields analyzed, flagged for action |
| Rep Friction Interview Notes | Qualitative pain points, workflow observations | 3-5 reps interviewed, themes identified |
| Baseline Metrics Document | Time-to-update, data completeness, satisfaction | All metrics captured pre-deployment |
| Layout Blueprint | Field hierarchy, section groupings, rationale | Stakeholder sign-off on placement |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| Optimized Page Layouts | Blueprint + field audit | Daily opportunity management |
| Quick Reference Guide | Training session content | Ongoing rep reference |
| Before/After Metrics Report | Baseline + 30-day post-launch data | ROI justification, leadership reporting |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Leadership | VP Sales, Sales Managers | New layout rationale, adoption metrics to track | 30 min |
| Rep Team | All Sales Reps | Hands-on: new layout, quick actions, Kanban | 30 min |
| Technical | RevOps Admin | How to maintain layouts, add/remove fields | 45 min |

##### Hypercare

- **Applies:** Yes
- **Duration:** 2 weeks post-deployment
- **Office Hours:** Yes — daily availability Week 1, weekly 30-min slot Week 2

##### Training Assets to Create

- Video walkthrough: Full opportunity update walkthrough (new layout)
- Video walkthrough: Quick actions demo (log activity, update stage, schedule follow-up)
- Video walkthrough: Kanban view drag-and-drop demo
- Doc: 1-2 page quick reference guide with annotated screenshots
- Doc: Troubleshooting FAQ (5 common questions)

#### Handoff & Retention

##### Internal Handoff (SME -> Architect)

- Key context for Architect: Which fields were removed vs. archived, quick action configurations, Sales Path content per stage, any validation rules modified
- Escalation trigger: Any request to add new record types, modify validation rules, or change Sales Path stage definitions

##### External Handoff (Delivery Team -> Customer)

- Final meeting agenda: Before/after metrics comparison, documentation walkthrough, maintenance schedule review, Q&A
- Documentation package: Quick reference guide, training video recordings, field audit spreadsheet, layout blueprint, maintenance schedule

##### Maintenance Schedule

- **Monthly:** Review quick action usage, check field completion rates, audit new field requests
- **Quarterly:** Survey rep satisfaction, review adoption dashboard, assess refinement needs
- **Who owns:** Single project = customer RevOps owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services -> if no -> Downsell: Another project (e.g., Sales Process Optimization, Forecasting Process Implementation) -> Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~90 days post-launch
- Internal prep trigger: 2 weeks before
- Decision: Architect handles / SME needed

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| Page Layout | The arrangement of fields, sections, and related lists on a Salesforce record page |
| Compact Layout | The 4-5 key fields displayed in the record highlights panel at the top of a Lightning record page |
| Quick Action | A one-click shortcut that opens a pre-configured form for common tasks (log activity, update stage) |
| Sales Path | A visual progress bar showing opportunity stages with guidance text and key fields per stage |
| Kanban View | A drag-and-drop board view of opportunities organized by stage columns |
| Field Completion Rate | The percentage of records where a given field has a non-null value over a defined time period |
| Record Type | A Salesforce feature that controls page layouts, picklist values, and business processes by type |
| Validation Rule | A formula-based rule that prevents saving a record unless specified conditions are met |

#### Common Gotchas

- Removing a field that feeds an active report or dashboard breaks the report → Cross-reference field usage with active reports before removing any field
- Over-engineering validation rules drives reps to Excel → Limit validation rules to critical-path fields only; organizations with 20+ rules see significant CRM abandonment
- Deploying without a rollback plan → Always document current page layout assignments so you can revert within minutes
- Creating multiple record types when page layouts suffice → Use record types only when the sales process is fundamentally different or access control requires it
- Launching without baseline metrics → Capture time-to-update, data completeness, and rep satisfaction BEFORE changes to prove ROI at 30 and 90 days

#### Methodology Options

| Option | When to Use | Complexity |
|--------|-------------|-----------|
| Layout Optimization Only | Minor cleanup — reduce fields, reorganize sections | Low |
| Full UX Overhaul | Layouts + quick actions + Sales Path + Kanban | Medium |
| UX + Dynamic Forms | Enterprise orgs needing conditional field visibility | High |

---

## Phase 1: Strategy

> **Goal:** Audit the current opportunity experience, gather rep feedback, and design an optimized layout blueprint that stakeholders approve.
> 
> **Output:** Layout Blueprint Document + Field Usage Audit + Baseline Metrics + Definition Alignment Document (signed off by stakeholders).

### 1a. Pre-Kickoff

> Two parallel tracks run before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video | Explain what this project is and why UX matters for CRM adoption | Video (5-10 min) |
| Definition Alignment Document | Get stakeholder sign-off on terms (page layout, compact layout, quick action, Sales Path, validation rule) | Google Doc |
| Pre-filled intake form | Confirm record types, profile assignments, known pain points | Google Form or Doc |

**What we need from the customer:**

- Salesforce admin access (Setup permissions for Page Layouts, Lightning App Builder, Quick Actions)
- Sandbox environment access for building and testing
- List of all opportunity record types and their profile assignments
- Names of 3-5 sales reps available for friction interviews (mix of roles and tenures)
- List of active reports/dashboards referencing opportunity fields

**Completion tracking:** RevOps Lead owns follow-up. Do not cancel kickoff if incomplete, but push hard for admin access and record type list before the call.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Export all opportunity page layouts and profile assignments from Setup | Layout inventory spreadsheet |
| 2 | Run Salesforce Optimizer or install Field Trip to analyze field usage | Field completion rates (90-180 day window) |
| 3 | Screenshot each page layout section by section (top to bottom) | Visual audit document |
| 4 | Count total fields per layout, identify above/below fold | Quantitative layout assessment |
| 5 | Document related lists, dynamic forms, conditional visibility rules | Configuration inventory |
| 6 | Flag fields <10% completion as removal candidates | Candidate removal list |

**Critical:** All recommendations are ASSUMED until validated in kickoff. The field usage data is quantitative evidence, but business context from interviews determines final decisions.

#### Stakeholder Alignment Document

> Get stakeholder sign-off on terms BEFORE redesigning anything.

| Term | Our Definition | Internally Approved? |
|------|----------------|----------------------|
| Page Layout | The arrangement of fields, sections, and related lists on an opp record | [ ] Yes / [ ] No |
| Compact Layout | The 4-5 key fields in the record highlights panel at page top | [ ] Yes / [ ] No |
| Quick Action | One-click shortcut for common tasks (log activity, update stage) | [ ] Yes / [ ] No |
| Sales Path | Visual progress bar with stage-specific guidance and key fields | [ ] Yes / [ ] No |
| Field Completion Rate | % of records with non-null value for a field over a defined period | [ ] Yes / [ ] No |
| Archive Section | Collapsed section at bottom of layout for rarely-used but required fields | [ ] Yes / [ ] No |

**Instructions to customer:**

> Review each definition with your sales leadership team. Check "Yes" when approved. We need alignment on these terms before presenting our layout recommendations.

---

### 1b. Kickoff Call

> **Purpose:** Present the field usage audit and gather qualitative validation. We walk in with data — customer reacts to findings, not creates from scratch.

#### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through field usage data | "Here's what we found: X fields, Y% completion rates" |
| 15-30 | Present initial findings | Fields flagged for removal, sections that need reorganizing |
| 30-45 | Definition alignment | Review Definition Alignment Doc |
| 45-60 | Schedule rep interviews | Identify 3-5 reps, schedule 30-min slots |
| 60+ | Next steps | Assign homework, schedule refinement meetings |

#### What We Bring

- Field usage audit spreadsheet (quantitative data from Salesforce Optimizer/Field Trip)
- Visual screenshots of current page layouts with annotations
- Layout inventory (total fields, sections, related lists per layout)
- Definition Alignment Document (pre-filled with our recommendations)
- Questions for validation: Which fields does leadership rely on? Which reports are mission-critical?

#### What We Leave With

- Validated pain points (confirmed or corrected from data)
- List of fields leadership considers non-negotiable (even if low rep usage)
- Reports/dashboards that must not break
- Rep interview schedule confirmed
- Clear homework assignments (theirs: schedule rep interviews, ours: conduct interviews and draft blueprint)

---

### 1c. Alignment Loop & Strategic Meeting Cadence

> **Purpose:** Conduct rep interviews, build the layout blueprint, and iterate until sign-off.

#### The Pattern

```
Kickoff Call (present audit, schedule interviews)
    |
Conduct 3-5 rep friction interviews (30 min each)
    |
Capture baseline metrics (time-to-update, data completeness, satisfaction)
    |
Draft layout blueprint (field hierarchy, quick action designs, Sales Path content)
    |
Meeting 2 (present blueprint, gather feedback) -> refine -> v2
    |
Meeting 3 (present refined blueprint, finalize) -> v3
    |
Final Review -> Sign-off
```

#### Rep Friction Interviews (Between Meetings)

These interviews are the qualitative backbone of the project. Schedule 30 minutes with each of 3-5 reps across different roles and tenures.

**Structured interview protocol:**

1. "Walk me through how you update an opportunity after a sales call" (observe, count clicks)
2. "Which fields do you always fill out? Which do you skip or put placeholder data in?"
3. "Do you use any workarounds? External trackers, notes in wrong fields?"
4. "If you could change one thing about the opportunity page, what would it be?"
5. Time common actions: stage change, close date update, add note, log activity

**Output:** Friction interview summary with prioritized themes and click counts for common actions.

#### Baseline Metrics Capture

| Metric | How to Measure | Target Improvement |
|--------|----------------|--------------------|
| Time to complete opp update | Observe 3-5 reps completing a full update, average time | Reduce by 40%+ |
| Data completeness rate | % of key fields filled (Amount, Close Date, Next Step) | Increase by 20%+ |
| Rep CRM satisfaction | Survey (1-5 scale, 3-5 questions) | Increase by 1+ point |
| Opportunity update frequency | Pull from Activity History (updates per rep per week) | Increase by 25%+ |
| Validation rule error rate | Count errors per 100 saves from Setup audit | Reduce by 30%+ |

#### Potential Meeting Types

| Meeting Type | Focus | Stakeholder |
|--------------|-------|-------------|
| Audit Review | Present field usage data, validate removal candidates | VP Sales, RevOps Lead |
| Blueprint Review | Walk through field hierarchy, section groupings, rationale | RevOps Lead, Sales Mgr |
| Quick Action/Path | Review quick action designs and Sales Path content | VP Sales, RevOps Lead |
| Final Review | Complete design walkthrough, sign-off | All stakeholders |

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 2-3 days |
| Kickoff call | Day 1 of engagement |
| Rep interviews | Days 2-5 (3-5 interviews) |
| Baseline metrics capture | Days 2-5 (parallel with interviews) |
| Blueprint draft | Days 5-7 |
| Meeting loop | 1-2 weeks (depends on stakeholder availability) |
| Final review + sign-off | When blueprint is approved |

---

### 1d. Strategic Sign-Off

> **Purpose:** Confirm the layout blueprint is complete and approved before building.

#### Validation Checkpoint

- Definition Alignment Document signed off by VP Sales and RevOps Lead
- Field usage audit reviewed — removal/archive decisions confirmed
- Layout blueprint approved (field hierarchy, section groupings, rationale documented)
- Quick action designs approved (which actions, which fields per action)
- Sales Path content approved (guidance text, key fields, exit criteria per stage)
- Compact layout field selection approved (top 5 fields)
- Reports/dashboards verified — no breaking changes from field removals
- Baseline metrics captured and documented
- No blockers for sandbox build

#### Decision Point

- **Proceed to Engineering** → Blueprint is approved, build in sandbox
- This project type always proceeds to Phase 2. The strategic deliverable (blueprint) is not the end product — the configured Salesforce layouts are the deliverable.

---

## Phase 2: Engineering

> **Goal:** Build and test the optimized layouts, quick actions, Sales Path, and Kanban view in sandbox, then deploy to production.
> 
> **Output:** Built system that matches the approved blueprint, pilot-tested and customer-approved.

| Project Type | Engineering Weight | Notes |
|--------------|-------------------|-------|
| This project | Heavy (50-60%) | Core value is in the Salesforce configuration work |

### Sub-Phases

```
2a Tech Spec -> 2b Engineering Handoff -> 2c Build -> 2d Test
```

---

### 2a. Tech Spec

> **Purpose:** Translate the approved layout blueprint into specific Salesforce configuration instructions.

**Input:** Signed-off layout blueprint + field usage audit + quick action designs + Sales Path content

**Output:** Draft tech spec containing:

- Field-level changes: which fields to remove, archive, or reposition (with API names)
- Section structure: new section names, column layouts, collapsible settings
- Compact layout configuration: 5 fields in priority order with API names
- Quick action specifications: action type, fields included, field order, required vs. optional
- Sales Path configuration: stage names, guidance text, key fields (up to 5 per stage), celebration settings
- Kanban view setup: list view filters, summarize-by field, amount rollup settings
- Deployment sequence: what to build first, dependencies

---

### 2b. Engineering Handoff

> **Purpose:** Review tech specs with the engineer before building.

**Who attends:** Architect + Engineer (or Salesforce Admin)

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through specs | Architect explains blueprint context + tech spec details |
| 15-30 | Engineer questions | Clarify field dependencies, report impacts, deployment risks |
| 30-45 | Refine and approve | Adjust specs, confirm build sequence |

**What Architect brings:**

- Layout blueprint (for design context)
- Draft tech spec (from 2a)
- List of reports/dashboards that must not break
- Questions list (anything flagged as unclear)

**What engineer leaves with:**

- Approved tech spec with field API names
- Clear build sequence (layouts first, then compact, then quick actions, then Sales Path, then Kanban)
- Known risks: fields used in workflow rules, process builder, or Apex triggers

---

### 2c. Build (Configure)

> **Purpose:** Build the optimized layouts in sandbox and validate with pilot users.

**Input:** Approved tech spec from 2b

**Build sequence:**

| Step | Component | Action | Verification |
|------|-----------|--------|--------------|
| 1 | Clone existing layouts | Clone current page layout as starting point (preserves audit trail) | Clone appears in Setup |
| 2 | Remove/archive fields | Remove flagged fields, verify not breaking reports first | No report errors |
| 3 | Reorganize sections | Create new sections per blueprint (Deal Details, Contact Info, Forecasting) | Visual match to blueprint |
| 4 | Section properties | Set columns (1 or 2), enable collapsible for Archive section | Sections collapse/expand correctly |
| 5 | Compact layout | Create compact layout: Amount, Stage, Close Date, Next Step, Owner | Highlights panel shows correct 5 fields |
| 6 | Quick Action: Log Activity | Create with minimal fields (Subject, Comments, Date) | Action appears in toolbar, saves correctly |
| 7 | Quick Action: Update Stage | Create with Stage picklist + Next Step + Close Date | Stage change persists, fields update |
| 8 | Quick Action: Schedule Follow-up | Create with Date, Activity Type, Description | Task created with correct due date |
| 9 | Add quick actions | Add all 3 quick actions to page layout action bar | First 3 actions visible without dropdown |
| 10 | Configure related lists | Set Activities, Contacts, Products with relevant columns only | Lists display cleanly, no unnecessary cols |
| 11 | Sales Path setup | Enable Sales Path, create for primary record type | Path displays in record detail |
| 12 | Sales Path content | Add guidance, key fields, exit criteria per stage; enable Closed Won celebration | Guidance displays on stage click |
| 13 | Kanban view | Create list view filtered for current user's opps, enable Kanban | Drag-and-drop works, amounts roll up |
| 14 | Profile assignments | Assign new layouts to appropriate profiles | Reps see new layout in sandbox |

**Build tracking:**

- Component 1: Page layout clone and field cleanup
- Component 2: Section reorganization
- Component 3: Compact layout configuration
- Component 4: Quick actions (3 total)
- Component 5: Sales Path setup + content
- Component 6: Kanban view configuration
- Component 7: Profile assignments
- Component 8: Related list cleanup

---

### 2d. QA / Test + Sign-Off

> **Purpose:** Validate the build with pilot users and get customer approval for production deployment.

**Two types of testing:**

| Type | Who | Purpose |
|------|-----|---------|
| Technical Testing | Architect/Engineer | Verify configurations work (layouts render, actions save, Path displays) |
| Pilot Testing | 2-3 Sales Reps | Verify it actually reduces friction for real workflows |

**Technical testing checklist:**

- All page layouts render correctly with no missing fields
- Compact layout shows correct 5 fields in highlights panel
- Quick Action: Log Activity saves successfully
- Quick Action: Update Stage changes stage and updates related fields
- Quick Action: Schedule Follow-up creates task with correct date
- Sales Path displays guidance and key fields for each stage
- Sales Path celebration fires on Closed Won
- Kanban view displays correctly with drag-and-drop functional
- Kanban drag triggers required field prompts correctly
- Mobile display shows correct compact layout fields
- No report or dashboard errors from field removals
- Validation rules still fire correctly
- No errors in Setup > Debug Logs

**Pilot testing protocol:**

1. Grant sandbox access to 2-3 selected pilot users
2. Have pilots complete 3-5 realistic scenarios:
   - Update an opportunity after a sales call (stage change + notes)
   - Log an activity using the quick action
   - Schedule a follow-up using the quick action
   - Move an opportunity via Kanban drag-and-drop
   - Navigate Sales Path guidance for their current stage
3. Time each scenario — compare to baseline measurements
4. Gather structured feedback: what works, what is confusing, what is missing
5. Iterate on layout based on pilot findings (adjust field order, fix issues)
6. Document all changes made during pilot phase

**Pilot success criteria:**

- Pilot users complete opportunity updates in <2 minutes (baseline comparison)
- Pilot user satisfaction 4/5+ on new layout
- No critical issues or broken workflows identified

**Engineering sign-off checkpoint:**

- Built system matches approved blueprint and tech spec
- All technical tests passing
- Pilot users have tested and provided positive feedback
- Pilot-requested changes incorporated
- Ready for production deployment

**Decision point:**

- **Proceed to Deployment** → All tests pass, pilots approve
- **Loop back to Build** → Issues found, needs fixes

---

### 2e. Production Deployment

> **Purpose:** Move optimized layouts from sandbox to production with rollback plan.

**Deployment protocol:**

1. Schedule deployment during low-activity window (early morning or weekend)
2. Document rollback procedure:
   - Record current page layout assignments by profile (screenshot or export)
   - Prepare change set to revert if needed
3. Deploy using Change Set or Metadata API:
   - Page layouts
   - Compact layouts
   - Quick actions
   - Sales Path configuration
4. Post-deployment verification:
   - Spot-check 3-5 opportunity records across different record types
   - Test all 3 quick actions in production
   - Verify Sales Path displays correctly
   - Verify Kanban view works
   - Check mobile display
5. Monitor for immediate issues in first 2 hours post-deployment

---

## Phase 3: Enablement

> **Goal:** Sales team can actually use the new opportunity experience. Reps understand the new layout, use quick actions, and see value in the changes.
> 
> **Output:** Trained team with documentation, adoption champion activated, stabilized system, no critical issues.

### Sub-Phases

```
3a Training Prep -> 3b Training Sessions -> 3c Hypercare -> 3d Enablement Sign-Off
```

---

### 3a. Training Prep

> **Purpose:** Create training materials from the blueprint, built system, and pilot feedback.

**Input:** Layout blueprint + built system + pilot user feedback

**Output:** Training package containing:

- Video script: Full opportunity update walkthrough on new layout (5-7 min)
- Video script: Quick actions demo — log activity, update stage, schedule follow-up (3-5 min)
- Video script: Kanban view and Sales Path demo (3-5 min)
- Quick reference guide: 1-2 pages with annotated screenshots showing key field locations, quick action usage, Kanban instructions
- Troubleshooting FAQ: 5 common questions (e.g., "Where did field X go?", "How do I use Kanban?", "Why do I see different fields than before?")

---

### 3b. Training Sessions

> **Purpose:** Transfer knowledge to the sales team with live demo and hands-on practice.

**Three training types:**

| Type | Audience | Focus |
|------|----------|-------|
| Leadership briefing | VP Sales, Sales Managers | Why we made these changes, what metrics to watch, how to reinforce adoption |
| Rep team training | All Sales Reps | Hands-on: walk through update workflow, practice quick actions, use Kanban |
| Technical training | RevOps Admin | How to maintain layouts, add/remove fields, modify quick actions, edit Sales Path |

**Training delivery for rep team session (30 min):**

1. Demo new layout: walk through a complete opportunity update, highlighting reduced fields and logical grouping
2. Show quick actions: how to log activity and update stage in 2 clicks (vs. 5+ clicks before)
3. Demonstrate Kanban view: drag-and-drop stage updates, visual pipeline overview
4. Highlight Sales Path: stage-specific guidance, key fields, celebration on Closed Won
5. Q&A: address concerns, note any remaining friction
6. Record session and share with team + absent members

**Output:**

- Trained stakeholders across all three audiences
- Video recordings for future reference and new hire onboarding
- Questions log (feeds into FAQ updates)

---

### 3c. Hypercare

> **Purpose:** Intensive post-launch support to stabilize adoption and catch issues early.

**Duration:** 2 weeks

**What happens:**

- **Week 1:** Daily availability for questions, daily check-in with adoption champion, monitor quick action usage in Setup audit logs
- **Week 2:** Weekly 30-min office hours, review adoption metrics, address any remaining issues
- Bug triage and quick fixes (field placement adjustments, quick action tweaks)
- Monitor validation rule error rates (should decrease with simplified layouts)

**When to skip:** Skip only if the changes are minimal (e.g., removing <5 fields, no new quick actions or Sales Path). Full UX overhaul always needs hypercare.

**Output:** Stabilized system, no critical issues outstanding, reps using quick actions

---

### 3d. Enablement Sign-Off

> **Purpose:** Confirm the sales team can operate independently with the new layouts.

**Validation checkpoint:**

- All training sessions delivered (leadership, rep team, technical)
- Training recordings and quick reference guide distributed
- Adoption champion briefed and actively supporting peer adoption
- Hypercare period complete — no critical issues outstanding
- Quick action usage visible in audit logs (reps are actually using them)
- Rep satisfaction trending positive (informal pulse check)
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** → Team is enabled, adoption is trending positive
- **Extend Hypercare** → Low adoption, ongoing confusion, critical issues

---

## Phase 4: Handoff

> **Goal:** Clean project close with maintenance plan established, metrics comparison delivered, and retention/expansion path set.
> 
> **Output:** Maintenance schedule documented, internal context transferred, customer owns the system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule -> 4b Internal Handoff -> 4c External Handoff -> 4d Project Close
                          (SME -> Architect)      (Team -> Customer)     (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|---------------------|---------------|
| **Single Project** | Customer RevOps owns | 4c (External Handoff) |
| **Dedicated (Multi-Project)** | Architect owns | 4b (Internal Handoff) |

---

### 4a. Maintenance Schedule

> **Purpose:** Document what needs ongoing attention after the project is complete.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|-------------------|
| Quick Action Usage Audit | Are reps using quick actions? Check Setup audit log | <30% of reps used quick actions this month |
| Field Completion Rate Check | Key field completion rates (Amount, Close Date, Next Step) | Completion rate drops >5% from post-launch baseline |
| New Field Request Review | Any requests to add fields? Evaluate against "8/10 rule" | >3 new field requests (may indicate scope creep) |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|----------------|--------------------|
| Rep CRM Satisfaction Survey | Survey reps (same 1-5 scale as baseline) | If satisfaction drops, investigate friction points |
| Adoption Dashboard Review | Update frequency, data completeness trends | If metrics declining, schedule intervention |
| Sales Path Content Refresh | Is stage guidance still accurate and helpful? | Update guidance text for changed processes |

**After First Business Cycle (30-90 days post-launch):**

- Compare time-to-update, data completeness, and satisfaction to baseline
- Identify any fields reps are consistently skipping (candidates for next cleanup)
- Pull opportunity update frequency from Activity History and compare to pre-launch
- Deliver before/after metrics report to VP Sales and RevOps Lead

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Data completeness decline | Key field completion drops >10% from peak | Investigate cause, may need layout adjustments |
| Quick action abandonment | <20% of reps using quick actions at day 60 | Retrain team, simplify action forms |
| Rep satisfaction decline | Average score drops below 3/5 | Conduct friction interviews, scope refinement |
| New sales process adopted | Stage definitions change materially | Re-scope Sales Path and potentially layouts |
| New record types needed | New business line or major process change | Scope new project (new layout design required) |

**Every 6-12 Months:**

- Full layout review: have field usage patterns shifted? Are archived fields now needed or vice versa?
- Evaluate new Salesforce features (Dynamic Forms, Enhanced Related Lists) for potential improvements
- Benchmark against updated industry data — assess if further optimization is possible

---

### 4b. Internal Handoff (SME -> Architect)

> **Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- What was changed and why (layout decisions, field removals, archive choices)
- Customer context (which stakeholders care about which fields, political sensitivities)
- Common issues and how to resolve them (field visibility questions, quick action bugs)
- When to escalate back to SME (record type changes, validation rule logic, dynamic forms)
- Maintenance schedule (if Dedicated engagement — Architect runs this)

**Escalation guidelines:**

| Issue Type | Who Handles | Example |
|------------|-------------|---------|
| Field placement adjustments, FAQ questions | Architect | "Move Close Date above Next Step" |
| Quick action field changes, minor tweaks | Architect | "Add Notes field to Log Activity action" |
| Record type changes, validation rule logic | SME | "Need separate layout for renewal opps" |
| Sales Path restructuring, new stage addition | SME | "Adding 'Legal Review' stage to process" |
| Dynamic Forms implementation | SME | "Need conditional field visibility by role" |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing it. SME walks Architect through each maintenance task, field audit methodology, and report dependencies.

---

### 4c. External Handoff (Delivery Team -> Customer)

> **Purpose:** Formal project completion with customer.

**Final project meeting agenda:**

1. **Before/After Metrics Review** — compare baseline to 30-day post-launch numbers (time-to-update, data completeness, satisfaction)
2. **Documentation Walkthrough** — quick reference guide, training recordings, field audit spreadsheet
3. **Maintenance Schedule Review** — monthly and quarterly tasks, red flag thresholds
4. **Q&A** — answer remaining questions
5. **Formal Close** — "Project complete. Here's everything you need to maintain this independently."

**Documentation package:**

- All training video recordings (3 videos)
- Quick reference guide (annotated screenshots, 1-2 pages)
- Field audit spreadsheet (original data + decisions made)
- Layout blueprint document (field placement decisions with rationale)
- Definition Alignment Document (final version)
- Troubleshooting FAQ document
- Maintenance schedule
- Support contact info

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Show them how to run the Salesforce Optimizer periodically. Record a video walkthrough of the maintenance process.

**Output:** Customer owns the optimized opportunity experience. Project formally complete.

---

### 4d. Project Close

> **Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved to proper location (field audit, blueprint, tech spec, training assets)
- Handoff documentation complete
- Project status updated in tracking system
- Time/billing finalized
- Before/after metrics report delivered

#### Internal Debrief (Optional but Recommended)

- What went well? (e.g., "Rep interviews surfaced issues field data alone wouldn't have found")
- What would we do differently? (e.g., "Should have captured baseline metrics earlier")
- Any learnings to feed back into SOPs? (e.g., "Field Trip app was faster than Salesforce Optimizer for this org size")

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| **Single Project** | Upsell -> Downsell -> Retry |
| **Multi-Project (Dedicated)** | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (retainer for ongoing CRM optimization)
   | if no
2. Downsell: Another one-time project (e.g., Sales Process Optimization, Forecasting Process)
   | if yes
3. Retry retainer at end of next project cycle
```

**Natural expansion projects from Opportunity Management UX Improvements:**

- Sales Process Optimization (stages, qualification criteria — the "why" behind the UX)
- Forecasting Process Implementation (builds on cleaner opp data)
- Activity Capture (automate the data entry quick actions were designed to simplify)
- Sales Engagement Platform Implementation (extends the rep productivity theme)

**Script:**

> "Now that your opportunity layouts are optimized, there are two ways we can continue working together. Option 1: We set you up on managed services where we handle ongoing CRM optimization — layout refinements, new field requests, quarterly reviews. Option 2: If there's a specific project like forecasting or sales process optimization that builds on this cleaner data, we can scope that. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

> "On [date ~90 days out], we'll review how the new layouts are performing and see if any adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull adoption data: quick action usage, field completion rates |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points. |

**At the refinement check-in:**

- Review performance against baseline and 30-day metrics
- Identify any adjustments needed (field additions, quick action tweaks, Sales Path updates)
- If minor: Architect handles tweaks
- If major: Scope new project (restart the assembly line)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Field Usage Audit Spreadsheet (quantitative analysis of all opportunity fields over 90-180 days)
- Rep Friction Interview Summary (qualitative themes, click counts, pain points)
- Layout Blueprint Document (field hierarchy, section groupings, rationale for every placement decision)
- Baseline Metrics Document (time-to-update, data completeness, satisfaction scores)

**Technical Deliverables:**

- Optimized Page Layouts (deployed to production, assigned to appropriate profiles)
- Compact Layouts (top 5 fields: Amount, Stage, Close Date, Next Step, Owner)
- Quick Actions (3 total: Log Activity, Update Stage, Schedule Follow-up)
- Sales Path Configuration (stage guidance, key fields, exit criteria, Closed Won celebration)
- Kanban View (list view with stage-based columns and amount rollup)

**Documentation Package:**

- Training video recordings (3 videos: layout walkthrough, quick actions, Kanban/Sales Path)
- Quick reference guide (1-2 pages, annotated screenshots)
- Troubleshooting FAQ (5 common questions)
- Definition Alignment Document (final version)
- Maintenance Schedule (monthly/quarterly tasks with red flag thresholds)
- Before/After Metrics Report (delivered at 30-day mark)

---

## Appendix

### Roles

| Role | What They Do |
|------|--------------|
| **Architect** | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| **Engineer** | CRM build, automation, dashboards (Phase 2) |
| **SME** | Project/implementation team brought in for project specific work |

---

### How to Use This Playbook

#### What Each Phase Produces

| Phase | Output | Gate Criteria |
|-------|--------|---------------|
| **Phase 1: Strategy** | Signed-off layout blueprint + field audit + baseline metrics | VP Sales and RevOps Lead have approved layout design and field decisions |
| **Phase 2: Engineering** | Built and tested Salesforce configuration (layouts, actions, Path) | System matches blueprint, pilot users approved, ready for production |
| **Phase 3: Enablement** | Trained sales team with documentation and adoption champion | All training delivered, hypercare complete, team using new layouts |
| **Phase 4: Handoff** | Independent customer + archived project + metrics report | Internal/external handoffs complete, maintenance plan in place, project closed |

#### How to Adapt Per Project Type

This is a **technical-heavy** project. The core value is in the Salesforce configuration work (Phase 2), supported by solid discovery (Phase 1) and training (Phase 3).

| Project Profile | Strategy Weight | Engineering Weight | Enablement Weight | Fit for This Project |
|-----------------|-----------------|-------------------|-------------------|----------------------|
| **Strategic-heavy** | 60-80% | 10-20% | 10-20% | No — this is not strategic-only |
| **Engineering-heavy** | 10-20% | 60-80% | 10-20% | Close, but enablement matters |
| **Balanced** | 25-30% | 45-50% | 20-25% | Best fit for this project type |

**Adaptation rules for this project:**

- Phase 1 compresses if the customer already has field usage data (skip Salesforce Optimizer step)
- Phase 2 expands for orgs with multiple record types (each needs its own layout design)
- Phase 3 is critical — sales reps resist UI changes, so training and champion support drive adoption
- Phase 4 is light but includes the essential before/after metrics comparison

#### Single vs Dedicated Client Split

| Engagement Type | What It Means | Key Difference |
|-----------------|---------------|-----------------|
| **Single Project** | One-off project engagement | Customer owns maintenance post-handoff (4c) |
| **Dedicated (Multi-Project)** | Ongoing retainer / multiple projects | Architect owns maintenance post-handoff (4b) |

---

### Phase 1 Guide: Strategy

#### How We Create Value in Strategy

**1. We educate.** Customers often do not realize how much their cluttered CRM layouts cost them. We show them the data: "50% of sales leaders say their CRM is difficult to use," and sales reps spend just 28% of their time selling — the rest goes to admin tasks. The field usage audit makes this cost tangible and specific to their org.

**2. We drive alignment.** Field removal decisions are political. Sales leadership wants certain fields for forecasting. Marketing wants campaign fields visible. RevOps wants clean data. We facilitate the prioritization conversation using quantitative data (field completion rates) so decisions are evidence-based, not opinion-based.

**3. We come with an opinion.** We show up with the "8 out of 10" rule: if a field is not used on 80% of records, it moves down or gets archived. We recommend the top 5 compact layout fields. We design the quick actions. The customer reacts and adjusts our recommendations.

**4. We show best practices.** Companies with structured opportunity management see higher performance. Organizations that implement Sales Path report increased deal closure rates. We anchor every design decision in what we have seen work across similar B2B SaaS clients.

#### Why Phase 1 Matters

This project lives or dies on discovery. If we skip rep interviews and rely only on field usage data, we miss the qualitative friction — workarounds, placeholder data, context switching pain. If we skip baseline metrics, we cannot prove ROI at 30 and 90 days. Phase 1 gives us the evidence to make confident design decisions and the baseline to prove value.

#### Document Types in Strategy

| Type | What It Is | Who Sees It | Examples |
|------|-----------|-------------|----------|
| **Working Documents** | Messy, in-progress docs we iterate WITH customer | Us + RevOps Lead | Field audit spreadsheet, interview notes |
| **Deliverables** | Polished outputs created FROM working docs | Customer presents internally | Layout blueprint, before/after metrics report |

**Flow:** `Inputs -> Working Docs (joint iteration) -> Deliverables (polished)`

#### Kickoff Call: The Shift

We walk in with field usage data. Customer reacts to our findings ("Yes, that field is useless" or "No, VP Sales needs that for board reports"), not creates from scratch. We do NOT leave with the blueprint. We leave with the INFORMATION needed to build v1 of the blueprint after rep interviews.

---

### Phase 2 Guide: Engineering

#### Engineering Sub-Phase Flow

```
+-----------------+-----------------+-----------------+-----------------+
|  2a TECH SPEC   |  2b ENG HANDOFF |  2c BUILD       |  2d TEST        |
|                 |                 |                 |                 |
|  Blueprint ->   |  Review meeting |  Configure in   |  QA + Pilot +   |
|  SF config      |  Architect +    |  Sandbox        |  Sign-off       |
|  steps          |  Engineer       |                 |                 |
+-----------------+-----------------+-----------------+-----------------+
|  OUTPUT:        |  OUTPUT:        |  OUTPUT:        |  OUTPUT:        |
|  Draft tech     |  Approved       |  Built system   |  Tested +       |
|  spec           |  tech spec      |  in sandbox     |  approved       |
+-----------------+-----------------+-----------------+-----------------+
```

#### Key Principles

**Tech Spec (2a):** Translate design decisions into Salesforce-specific configuration steps with API field names. Review for report dependencies and workflow impacts.

**Engineering Handoff (2b):** Engineer must understand WHY each field was removed or repositioned — not just WHAT to build. The field audit rationale prevents "but why did we remove this?" questions during build.

**Build (2c):** Always clone existing layouts before modifying. This preserves the original as a rollback option and creates an audit trail. Build in sandbox first — never modify production layouts directly.

**Test (2d):** Pilot users must be real sales reps, not admins or managers. The point is to validate that the new layout reduces friction for the people doing daily opportunity updates.

---

### Phase 3 Guide: Enablement

#### Enablement Sub-Phase Flow

```
+-----------------+-----------------+-----------------+-----------------+
|  3a TRAINING    |  3b TRAINING    |  3c HYPERCARE   |  3d ENABLEMENT  |
|  PREP           |  SESSIONS       |                 |  SIGN-OFF       |
|                 |                 |                 |                 |
|  Create         |  Deliver to     |  2-week         |  Confirm ready  |
|  materials from |  3 audiences    |  post-launch    |  for handoff    |
|  project docs   |                 |  support        |                 |
+-----------------+-----------------+-----------------+-----------------+
|  OUTPUT:        |  OUTPUT:        |  OUTPUT:        |  OUTPUT:        |
|  Training       |  Trained team   |  Stabilized     |  Enablement     |
|  package        |  + recordings   |  adoption       |  complete       |
+-----------------+-----------------+-----------------+-----------------+
```

#### Key Principles

**Training Prep (3a):** Draft the quick reference guide and video scripts. Review for accuracy and record the videos.

**Training Sessions (3b):** The adoption champion gets briefed 1-2 days before the team session. They attend the session already knowing the material, which makes them a credible peer resource.

**Hypercare (3c):** Office hours pattern — daily availability in Week 1, weekly slot in Week 2. The adoption champion is the first line of defense for peer questions. Monitor quick action usage in audit logs to identify stragglers who may need 1-on-1 help.

---

### Phase 4 Guide: Handoff

#### Handoff Sub-Phase Flow

```
+-----------------+-----------------+-----------------+-----------------+
|  4a MAINTENANCE |  4b INTERNAL    |  4c EXTERNAL    |  4d PROJECT     |
|  SCHEDULE       |  HANDOFF        |  HANDOFF        |  CLOSE          |
|                 |                 |                 |                 |
|  Document what  |  SME -> Arch    |  Team ->        |  Archive +      |
|  needs ongoing  |  context        |  Customer       |  debrief +      |
|  attention      |  transfer       |  final meeting  |  expansion      |
+-----------------+-----------------+-----------------+-----------------+
|  OUTPUT:        |  OUTPUT:        |  OUTPUT:        |  OUTPUT:        |
|  Maintenance    |  Architect      |  Customer       |  Archived       |
|  schedule       |  enabled        |  independent    |  project        |
+-----------------+-----------------+-----------------+-----------------+
```

#### Key Principles

**Maintenance Schedule (4a):** The maintenance tasks are lightweight for this project type — mostly monitoring adoption metrics and reviewing new field requests. The biggest risk is "field creep" where stakeholders gradually add fields back, undoing the UX improvements.

**External Handoff (4c):** The before/after metrics report is the centerpiece of this meeting. It proves the ROI of the project and makes the case for continued CRM optimization work.

**Project Close (4d):** Opportunity Management UX Improvements naturally leads to expansion projects: Sales Process Optimization (redesign stages), Forecasting Process Implementation (capitalize on cleaner data), or Activity Capture (automate what quick actions started).

---

## References

[1] [Getweflow - 6 Best Practices for Salesforce Opportunity Management](https://www.getweflow.com/blog/salesforce-opportunity-management)

[2] [Salesforce State of Sales Report](https://www.salesforce.com/resources/research-reports/state-of-sales/) — Sales reps spend just 28% of their time selling; the rest is admin tasks.

[3] [Rep Order Management - 77 Sales Automation Statistics](https://www.repordermanagement.com/blog/sales-automation-statistics/) — CRM data entry automation reduces admin time by 17%.

[4] [Whatfix - How to Accelerate Salesforce User Adoption](https://whatfix.com/blog/salesforce-adoption-strategies/) — 50% of sales leaders say their CRM is difficult to use.

[5] [DemandFarm - Salesforce Opportunity Stages Best Practices](https://www.demandfarm.com/blog/salesforce-opportunity-stages-best-practices-are-you-managing-deals-or-losing-them/) — Companies with structured opportunity management see 33% higher performance.

[6] [Salesforce Ben - Enable Salesforce Path](https://www.salesforceben.com/implement-salesforce-path/) — Companies implementing Sales Path report 15% increase in deal closure rates.

[7] [Clari - 4 Salesforce Opportunity Management Best Practices](https://www.clari.com/blog/4-salesforce-opportunity-management-best-practices-for-better-forecasts/) — Companies enforcing strong opportunity exit criteria see 23% improvement in forecast accuracy and 32% improvement in deal velocity.

[8] [Salesforce Trailhead - Visualize Success with Path and Kanban](https://trailhead.salesforce.com/content/learn/modules/leads_opportunities_lightning_experience/visualize-success-with-path-and-kanban)

[9] [Scratchpad - Opportunity Teams in Salesforce 2024 Guide](https://www.scratchpad.com/blog/opportunity-teams-in-salesforce-2024-guide)