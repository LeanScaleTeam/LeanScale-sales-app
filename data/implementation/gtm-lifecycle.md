# GTM Lifecycle — Implementation

## Project One-Pager

### Project Classification
- **Category**: Strategic (with light engineering)
- **Primary Deliverable**: Unified lifecycle stage architecture with entry criteria, signed off by stakeholders and configured in CRM

### Phase Relevance Matrix

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Heavy | 3-4 refinement loops to align stage definitions across GTM teams |
| 2. Engineering | Yes | Light | CRM field configuration, lifecycle stage setup, basic automation |
| 3. Enablement | Yes | Light | Training on new stage definitions, field usage, dashboard reading |
| 4. Handoff | Yes | Light | Maintenance cadence for stage definition governance |

Phase 1 is where 80% of the value is created: defining the shared stage language, aligning stakeholders across Marketing, Sales, CS, and RevOps.

Phase 2 is CRM configuration only -- no custom code, no complex integrations.

---

## Phase 1: Strategy

**Goal**: Get stakeholder sign-off on the unified lifecycle stage architecture.

**Output**: Signed-off Definition Alignment Document + Lifecycle Architecture (stage names, entry/exit criteria for all domains).

### 1a. Pre-Kickoff

Two parallel tracks execute after deal close and before the kickoff call:

#### Track A: Customer Homework

**Materials Provided:**

| Item | Purpose | Format |
|------|---------|--------|
| GTM Lifecycle intro video | Explain lifecycle stages, entry criteria importance, Golden Stages concept | Video (5-10 min) |
| Definition Alignment Document | Pre-filled with LeanScale-recommended definitions | Google Doc |
| Lifecycle Intake Form | Capture current CRM, team structure, stage definitions, pain points | Google Form or Doc |

#### Track B: Architect Preparation

**Five-Step Preparation Process:**

1. **Data Extraction**: Pull current CRM lifecycle data (all lifecycle/status fields, pipeline stages, custom fields)
2. **Current State Audit**: Map every lifecycle-related field across Lead, Contact, Opportunity, Account, and Ticket objects
3. **Problem Documentation**: Identify overlapping systems, missing stages, non-lifecycle concepts in lifecycle fields
4. **v0 Architecture Build**: Create recommended stages across Lead, Sales, Customer, and Company domains
5. **Asset Preparation**: Create presentation-ready materials

**Critical Note**: Mark everything as ASSUMED. The kickoff call validates.

---

### 1b. Kickoff Call

**Duration**: 60-75 minutes

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-20 min | Walk through current state audit | "Here's what we found in your CRM" |
| 20-35 min | Present v0 lifecycle architecture | "Here's what we recommend" |
| 35-50 min | Validate assumptions | ASSUMED -> CONFIRMED or corrected |
| 50-60 min | Review Definition Alignment Doc | Get initial reactions on terms |
| 60-75 min | Next steps | Schedule refinement meetings, assign homework |

---

### 1c. Alignment Loop & Strategic Meeting Cadence

**The Iteration Pattern:**

```
Kickoff Call (present current state + v0, gather corrections)
    |
Process feedback --> v1
    |
Refinement 1 (present v1, focus on Marketing/Sales handoff definitions) --> v2
    |
Refinement 2 (present v2, focus on edge cases and remaining ASSUMED items) --> v3
    |
Final Review --> Sign-off
```

| Meeting | Focus | Key Stakeholder | Output |
|---------|-------|-----------------|--------|
| Kickoff | Current state audit, v0 presentation | VP RevOps + all department reps | Info for v1 |
| Refinement 1 | Lead + Sales stage definitions, MQL/SAL/SQL alignment | VP RevOps, VP Marketing, VP Sales | v2 |
| Refinement 2 | Customer lifecycle stages, edge cases, measurement plan | VP RevOps, VP CS, CRM Admin | v3 (near-final) |
| Final Review | Full lifecycle walkthrough, sign-off | All stakeholders | Signed-off architecture |

### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 2-3 days |
| Kickoff call | Day 1 of engagement |
| Refinement loop | 1-2 weeks |
| Final review + sign-off | When all definitions CONFIRMED |
| **Total Phase 1** | **~2-3 weeks** |

---

### 1d. Strategic Sign-Off

#### Validation Checkpoint

- Definition Alignment Document signed off by VP RevOps, VP Marketing, VP Sales, VP CS
- All lifecycle stages named with entry/exit criteria documented
- Golden Stages (SQL, Closed Won, Early Adoption) defined with specific criteria
- Contact Status vs. Lifecycle Stage separation agreed upon
- Measurement framework agreed
- Edge cases addressed
- No blockers for CRM configuration

**Decision Point**: Proceed to Engineering OR Project Complete (strategy-only deliverable).

---

## Phase 2: Engineering

**Goal**: Configure lifecycle stages, pipelines, automation, and reporting in the customer's CRM.

**Output**: CRM configured with correct lifecycle stages, automated stage transitions, and a lifecycle measurement dashboard.

### 2a. Tech Spec

Translate signed-off lifecycle architecture into CRM-specific configuration instructions.

#### Salesforce Specifications

- Lead Status picklist values
- Opportunity Stage picklist values with probability percentages (25%/50%/75%/90%/100%)
- Custom Contact Lifecycle Stage field
- Account-level lifecycle field
- Validation rules for entry criteria
- Flow/Process Builder automation for stage transitions
- Report types and dashboards

#### HubSpot Specifications

- Lifecycle Stage property configuration (requires Enterprise tier)
- Lead Status property values
- Deal Pipeline stages for each pipeline
- Workflow automation for lifecycle stage progression
- Contact-to-Company lifecycle sync rules
- Dashboard and report specifications
- **Important**: Disable HubSpot's native lifecycle automation before configuring custom rules

### 2b. Engineering Handoff

30-minute review with CRM Admin. Build order:

1. Create/update lifecycle stage field values
2. Create/update pipeline stages
3. Build automation rules for stage transitions
4. Build dashboards and reports
5. Test with sample records

### 2c. Build (Configure)

| Component | What to Build | CRM Object |
|-----------|---------------|-----------|
| Lead/Contact Lifecycle Stages | Add/rename/remove stages | Lead, Contact |
| Sales Pipeline Stages | Configure with weightings and entry criteria | Opportunity/Deal |
| Customer Lifecycle Stages | Configure post-sale stages | Custom Object/Ticket |
| Company Lifecycle | Roll up from Contact activity | Account/Company |
| Stage Transition Automation | Workflows/Flows | Cross-object |
| Lifecycle Measurement Dashboard | Production, conversion, time in stage reports | Reporting |
| Drop-off Reason Fields | Picklist fields for documenting failures | Lead, Opportunity |

### 2d. QA / Test + Sign-Off

#### Technical Testing Checklist

- All lifecycle stage values appear correctly
- Stage transitions fire correctly
- Lifecycle cannot move backward accidentally
- Contact-to-Company lifecycle sync works
- Pipeline stages have correct probability weightings
- Dashboard shows accurate data
- Drop-off reason fields appear and are required
- No conflicts with existing automation
- Edge cases handled

---

## Phase 3: Enablement

**Goal**: Customer team can use the new lifecycle stages correctly and read the measurement dashboards.

### 3a. Training Prep

Create training materials from the lifecycle architecture and CRM configuration.

### 3b. Training Sessions

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Leadership | VP RevOps, VP Sales, VP Marketing, VP CS | Dashboard reading, metric interpretation | 30 min |
| Technical | RevOps, CRM Admin | Configuration, automation, troubleshooting | 45 min |
| End User | SDRs, AEs, CSMs | Stage updating, entry criteria, drop-off reasons | 30 min |

### 3c. Hypercare

- 2-week post-launch support
- Weekly 30-min office hours
- Monitor stage adoption and automation
- Fix any bugs found

### 3d. Enablement Sign-Off

- All training sessions delivered
- Training videos recorded and shared
- Stage Reference Card delivered
- FAQ document delivered
- Teams using stages correctly

---

## Phase 4: Handoff

**Goal**: Clean project close with maintenance plan for ongoing lifecycle governance.

### 4a. Maintenance Schedule

**Monthly Tasks:**

| Task | What to Check | Red Flag Threshold |
|------|---------------|-------------------|
| Stage Conversion Rate Check | All conversion rates | Any rate drops >5 percentage points |
| Production by Stage Volume | Volume entering each stage | Any stage volume drops >20% |
| Rogue Stage Audit | New unauthorized picklist values | Any new values found |
| Drop-off Reason Review | Top 3 non-advancement reasons | Same reason appearing >30% |

**Quarterly Tasks:**

| Task | What to Review | Action if Off-Track |
|------|----------------|---------------------|
| Full Lifecycle Stage Review | Stage definitions accuracy | Schedule refinement session |
| Time in Stage Analysis | Stage velocity changes | Investigate bottleneck stages |
| Cost to Enter Stage Review | Cost per MQL, SQL, CW trends | Review marketing spend efficiency |
| Segmentation Deep Dive | Metrics by segment, region, rep | Identify underperforming segments |
| Definition Alignment Check | Ask department leads if definitions still correct | Update if changed |

### 4b. Internal Handoff

Transfer context for ongoing lifecycle governance. Cover: architecture built and why, stakeholder dynamics, common issues, measurement framework, maintenance schedule.

### 4c. External Handoff (LeanScale -> Customer)

Final meeting agenda:

1. Review lifecycle architecture (5 min)
2. Walk through documentation package (10 min)
3. Walk through maintenance schedule (15 min)
4. Show lifecycle measurement dashboard (5 min)
5. Q&A (10 min)
6. "Project complete. Here's when to call us back." (5 min)

#### Documentation Package

- Lifecycle Architecture Diagram (final version)
- Definition Alignment Document (final, signed-off)
- Stage Reference Card (one-page PDF)
- CRM Configuration Spec
- Training video recordings
- FAQ document
- Maintenance Schedule

### 4d. Project Close

Archive all artifacts, update tracking, finalize billing.

#### Retention / Expansion Path

**Single Project:**
1. Upsell: Managed Services (lifecycle governance retainer)
2. Downsell: Depth project (Lead Scoring, Sales Stages, Customer Lifecycle, Attribution)
3. Retry retainer at end of next project cycle

**Multi-Project (Dedicated):**
Schedule refinement check-in at ~1 quarter out.

---

## Deliverables Summary

### Strategic Deliverables

| Deliverable | Description |
|-------------|-------------|
| Lifecycle Architecture Diagram | Visual of all stages across Lead, Sales, Customer domains |
| Definition Alignment Document | All stage names with definitions, entry/exit criteria, signed off |
| Current State Audit | Current CRM lifecycle fields and identified problems |
| Measurement Framework | Which of the 6 metric categories to track and how |

### Technical Deliverables (if Phase 2 applies)

| Deliverable | Description |
|-------------|-------------|
| CRM Configuration Spec | Field-level specification for lifecycle stages, pipelines, automation |
| Configured Lifecycle Stages | Lifecycle stage picklist values in CRM |
| Automation Rules | Stage transition workflows (configured and tested) |
| Lifecycle Measurement Dashboard | Reports for production, conversion, velocity, drop-off, cost |
| Drop-off Reason Fields | Picklist fields for recording why records don't advance |

## References

- HubSpot - Lifecycle Stage and Lead Status Guide
- RevBlack - Salesforce Lead Stage vs Lead Status
- LeanScale - Measuring GTM Lifecycle
- RT Dynamic - The Ultimate Guide to Salesforce Opportunity Stages
- HubSpot - Create and Customize Lifecycle Stages
- The Digital Bloom - B2B SaaS Funnel Benchmarks
- Data-Mania - MQL to SQL Conversion Rate Benchmarks
- Kalungi - HubSpot CRM Optimization for SaaS Companies
