# CLM Implementation — Implementation

## Project One-Pager

### Quick Reference for Architects

**Project Type**
- Category: Technical
- Primary Deliverable: Fully configured CLM platform with CRM integration, automated approval workflows, standardized contract templates, clause library, and reporting dashboards

**Phase Relevance**

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Med | Discovery, workflow mapping, vendor selection, definition alignment |
| 2. Engineering | Yes | Heavy | Platform setup, template config, workflow automation, CRM integration |
| 3. Enablement | Yes | Med | Role-specific training (legal + sales), pilot, full rollout |
| 4. Handoff | Yes | Med | Admin transfer, measurement cadence, troubleshooting runbook |

**Phase Overview Flow**
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. STRATEGY  │────▶│ 2. ENGINEER  │────▶│3. ENABLEMENT │────▶│  4. HANDOFF  │
│     Med      │     │    Heavy     │     │     Med      │     │     Med      │
│ 1a→1b→1c→1d │     │ 2a→2b→2c→2d │     │ 3a→3b→3c→3d │     │ 4a→4b→4c→4d │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**Project Flow Summary**
- Full 4-phase approach
- Medium strategy (discovery + vendor alignment)
- Heavy engineering (platform config + CRM integration)
- Medium enablement (legal + sales training)
- Standard handoff
- Engineering is the heaviest phase with template configuration, workflow automation, CRM integration, and clause library setup requiring significant build and QA time
- Some customers arrive with vendor pre-selected, compressing Phase 1

---

## Pre-Kickoff (1a)

### Track A: Customer Homework

**Required Items**
- [ ] Watch CLM intro video explaining what CLM is, why it matters, and how it reduces contract cycle time
- [ ] Complete intake form: current contract volume, contract types, approval matrix, tech stack (CRM, e-signature)
- [ ] Provide existing contract templates (MSA, NDA, SOW, Order Forms) in Word/PDF format
- [ ] Provide approved clause language for clause library seeding
- [ ] Get stakeholder sign-off on key definitions (contract types, approval authorities, risk tiers)

### Track B: Architect Prep

**Architect Activities**
- [ ] Review intake form and contract samples to assess complexity
- [ ] Pull CRM data: opportunity volume, current contract-related fields, existing integrations
- [ ] Map current-state contract workflow (draft from intake + CRM audit)
- [ ] Research client's industry for compliance-specific contract requirements
- [ ] Create v0 workflow mapping and requirements document

---

## Refinement Loop (1b → 1c → 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present v0 workflow map, validate assumptions | Legal, Sales Ops, IT, Exec Sponsor | Info for v1 requirements doc |
| Refinement 1 | 1c | Review approval matrix, template priorities | Legal, Sales Ops | v2 requirements + vendor shortlist |
| Refinement 2 | 1c | Vendor demo feedback, integration requirements | Legal, Sales Ops, IT | Final vendor recommendation |
| Sign-Off | 1d | Approve vendor, workflow design, implementation plan | All stakeholders | Signed-off strategic package |

---

## Phase 1: Strategy

### Goal
Get stakeholder sign-off on CLM vendor selection, contract workflow design, template priorities, and integration requirements.

### Output
Definition Alignment Document + Strategic Package (approved vendor, workflow map, approval matrix, template inventory, integration requirements).

---

## 3.1. Pre-Kickoff

### Two Parallel Tracks

After engagement confirmation and before kickoff call, execute Track A (customer) and Track B (architect) simultaneously.

### Track A: Customer Homework

**What LeanScale Sends**

| Item | Purpose | Format |
|------|---------|--------|
| CLM intro video | Explain CLM, why it reduces cycle time, how project works | Video walkthrough (5-10 min) |
| Definition Alignment Document | Get stakeholder sign-off on contract lifecycle terms | Google Doc |
| Pre-filled intake form | Confirm contract volume, types, current tools, approval structure | Google Form or Doc |

**CLM-Specific Homework Items**
- Current contract volume by type (NDAs/month, MSAs/month, SOWs/month, Order Forms/month)
- Current average contract cycle time by type
- Existing approval matrix (who approves what, at what dollar thresholds)
- List of contract templates currently in use (provide in Word/PDF)
- Approved clause language and any "non-negotiable" terms
- E-signature tool currently in use (DocuSign, Adobe Sign, or none)
- CRM type and admin access credentials
- IT contact for SSO/SAML configuration

**Completion Tracking**
- Follow up with legal ops lead
- Do not cancel kickoff if templates haven't arrived yet, but escalate
- Template collection is the most common pre-kickoff bottleneck

### Track B: Architect Prep

**Architect Actions**

| Step | Action | Output |
|------|--------|--------|
| 1 | Review intake form and contract samples | Complexity assessment |
| 2 | Audit CRM: Opportunity fields, contract-related objects | CRM readiness assessment |
| 3 | Map current-state contract workflow (draft from intake) | v0 workflow map with pain points |
| 4 | Draft future-state workflow with automation opportunities | Recommended workflow design |
| 5 | Prepare vendor comparison matrix (if vendor not pre-selected) | Vendor shortlist with pros/cons |
| 6 | Create kickoff presentation | Workflow diagrams, questions list |

**Critical Note**
Mark all workflow assumptions as ASSUMED. Kickoff call validates with legal and sales ops stakeholders who live in these workflows daily.

### Stakeholder Alignment Document

Get stakeholder sign-off on terms BEFORE building anything. Contract terminology is especially prone to misalignment -- "approval" means different things to legal vs. sales.

| Term | Our Definition | Internally Approved? |
|------|---|---|
| Contract Lifecycle | Full process from request through execution and renewal/expiration | [ ] Yes / [ ] No |
| Approval Authority | The person(s) authorized to approve a contract based on type, value, and risk | [ ] Yes / [ ] No |
| Standard Terms | Pre-approved contract language that does not require legal review for each use | [ ] Yes / [ ] No |
| Non-Standard Terms | Any deviation from approved templates/clauses that triggers additional legal review | [ ] Yes / [ ] No |
| Auto-Approve Threshold | Contract types or values below which automated approval is acceptable (e.g., standard NDAs) | [ ] Yes / [ ] No |
| Contract Cycle Time | Elapsed time from contract request to fully executed signature | [ ] Yes / [ ] No |
| Risk Tier | Classification system for contract risk (Standard / Elevated / High) that determines routing | [ ] Yes / [ ] No |

**Instructions to Customer**
Review each definition with legal and sales leadership. Check "Yes" when approved. Cannot proceed to platform configuration until approval authority and risk tiers are aligned.

---

## 3.2. Kickoff Call

### Purpose
Present v0 workflow map and requirements, validate assumptions with people who live in these workflows.

### Agenda (60-90 minutes)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through v0 workflow map | "Here's what we built from your intake -- current and future state" |
| 15-30 | Validate approval matrix | ASSUMED approval paths → CONFIRMED or corrected |
| 30-40 | Definition alignment | Review Definition Alignment Doc terms |
| 40-50 | Template prioritization | Which contract types to configure first (usually NDA + MSA) |
| 50-60 | Integration requirements | CRM fields, e-signature, SSO -- confirm what connects to what |
| 60+ | Next steps | Schedule refinement calls, assign template collection homework |

### What Architect Brings
- v0 workflow map (current + recommended future state)
- Draft approval matrix
- Vendor comparison matrix (if applicable)
- Definition Alignment Document (pre-filled with recommendations)
- Questions list for validation

### What Architect Leaves With
- Feedback and corrections on workflow design (info for v1)
- Confirmed or adjusted definitions
- Template collection timeline
- Vendor demo schedule (if not pre-selected)
- Clear homework assignments

---

## 3.3. Alignment Loop & Strategic Meeting Cadence

### Purpose
Iterate on workflow design, approval matrix, and vendor selection until all stakeholders sign off.

### The Pattern
```
Kickoff Call (gather info)
    |
Architect processes feedback → v1 requirements
    |
Meeting 2 (approval matrix + template priorities) → v2
    |
Meeting 3 (vendor alignment + integration requirements) → v3
    |
Final Review → Sign-off
```

### CLM-Specific Meeting Types

| Meeting Type | Focus | Stakeholder |
|--------------|-------|-------------|
| Kickoff | Current state, workflow validation | Legal, Sales Ops, IT, Exec |
| Approval Matrix Review | Who approves what, at what thresholds | Legal, VP Sales, Finance |
| Vendor Demo/Selection | Compare platforms against requirements | Legal, Sales Ops, IT, Exec |
| Integration Planning | CRM fields, e-signature, SSO requirements | IT, Sales Ops |
| Final Review | Full requirements walkthrough, sign-off | All stakeholders |

### Before Each Meeting
1. Process previous meeting transcript/notes
2. Update requirements document (v[n-1] → v[n])
3. Prepare questions for next validation round

### After Each Meeting
1. Update workflow map and requirements doc
2. Track what moved from ASSUMED → CONFIRMED
3. Follow up on outstanding template collection

### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 2-3 days |
| Kickoff call | Day 1 of engagement |
| Meeting loop | 1-3 weeks (depends on vendor selection timeline) |
| Final review + sign-off | When vendor confirmed and all workflows approved |

---

## 3.4. Strategic Sign-Off

### Purpose
Confirm everything is ready before engineering begins.

### Validation Checkpoint
- Definition Alignment Document signed off by legal and sales leadership
- Current state and future state workflow maps agreed
- Approval matrix finalized (by contract type, value, and risk)
- Template priority list confirmed (which templates to configure first)
- Vendor selected and contract signed (if applicable)
- CRM integration requirements documented and confirmed by IT
- E-signature integration requirements confirmed
- SSO/SAML timeline confirmed with IT
- All critical inputs CONFIRMED (vs ASSUMED)
- Customer understands what we're building

### Decision Point
- **Proceed to Engineering** → Most CLM projects proceed to full platform build
- **Hold for vendor procurement** → If vendor selection is taking longer than expected, pause before engineering but continue template prep

---

## Phase 2: Engineering

### Goal
Build and test the complete CLM platform based on approved strategic package.

### Output
Fully configured CLM platform with templates, workflows, CRM integration, and dashboards -- tested and customer-approved.

### Context
CLM Implementation is engineering-heavy. This phase represents approximately 50-60% of total project effort. Organizations that implement CLM effectively reduce contract cycle time by 30-75%. The build quality here directly determines whether you hit those numbers.

### Sub-Phases Flow
```
2a Tech Spec → 2b Engineering Handoff → 2c Build → 2d Test
```

---

## 4.1. Tech Spec

### Purpose
Translate strategic package into CLM platform configuration specifications.

### Input
Signed-off strategic package (workflow map, approval matrix, template inventory, integration requirements)

### Output
Draft tech spec containing:

- Platform admin configuration checklist (org structure, SSO, security)
- Permission matrix (role → access level mapping for each user type)
- Template configuration specs (dynamic fields, conditional logic, formatting)
- Clause library structure (categories, risk tiers, alternative clauses)
- Workflow automation rules (routing conditions, escalation triggers, SLA timers)
- CRM integration mapping (CLM field → CRM field, sync direction, frequency)
- Dashboard specifications (which metrics, which audience, which filters)
- Build sequence (dependencies: admin config → permissions → templates → workflows → integration → dashboards)

---

## 4.2. Engineering Handoff

### Purpose
Review tech specs before building. CLM builds have many interdependent components -- permissions affect templates, templates affect workflows, workflows affect integration.

### Attendees
Architect + Engineer (or engineering team)

### Agenda (30-45 minutes)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through specs | Architect explains strategic context + tech spec for each component |
| 15-30 | Engineer questions | Clarify integration risks, SSO dependencies, template complexity |
| 30-45 | Refine and approve | Adjust build sequence, confirm approach for each component |

### What Architect Brings
- Strategic package (workflow maps, approval matrix)
- Draft tech spec (from 4.1)
- Questions list (integration risks, SSO timeline, e-signature compatibility)

### What Engineer Leaves With
- Approved tech spec with build sequence
- Clear dependencies (e.g., SSO must complete before user provisioning)
- Known risks (e.g., CRM package installation may require Salesforce admin approval)

---

## 4.3. Build (Configure)

### Purpose
Build and configure the CLM platform per approved tech spec.

### Input
Approved tech spec from 4.2

### Build Sequence for CLM Implementation

#### Phase 4.3-1: Platform Foundation

- Create CLM platform account and assign super admin access
- Configure organizational structure (departments, teams, regions)
- Set up SSO/SAML authentication with company identity provider
- Configure security settings (data retention, access logging, IP restrictions)
- Set up user roles and permission templates (Legal Admin, Sales User, Finance Read-Only, IT Admin)
- Test permissions with sample users from each role
- Document admin credentials and access procedures

#### Phase 4.3-2: Template & Clause Configuration

- Convert existing contract templates to CLM platform format with dynamic fields
- Configure variable fields (company name, effective date, term length, pricing, custom fields)
- Set up template versioning and approval workflows for template changes
- Build clause library: organize by category (indemnification, liability, data protection, payment terms)
- Tag clauses with metadata (category, risk level, use case, contract type)
- Configure clause alternatives (if prospect rejects Clause A, offer Clause B)
- Configure clause risk levels (standard, negotiable, non-negotiable)
- Test template generation with sample data
- Get legal sign-off on template accuracy and formatting

#### Phase 4.3-3: Workflow Automation

- Map approval workflows by contract type (NDA = auto-approve, MSA = legal review, Custom = VP Legal)
- Configure value-based routing (e.g., contracts above threshold require finance review)
- Set up risk-based routing for non-standard terms or clause deviations
- Configure automated notifications (pending review, approaching deadline, expired)
- Set up renewal and expiration alerts (30/60/90 day warnings)
- Build escalation rules for stalled approvals (e.g., no action in 48 hours → escalate)
- Test all workflow paths with sample contracts

#### Phase 4.3-4: CRM Integration

- Install CLM app/package in Salesforce or HubSpot
- Configure OAuth connection between systems
- Map CLM fields to CRM Opportunity/Account fields
- Set up contract creation button on Opportunity record
- Configure which Opportunity data auto-populates contract fields
- Define sync settings: which fields sync, direction (one-way vs bi-directional), frequency (real-time vs batch)
- Map contract status values to CRM stage or custom fields
- Test connection and field mapping with sample Opportunities

#### Phase 4.3-5: Reporting & Dashboards

- Build legal dashboard: pending approvals, redline queue, avg review time
- Build sales dashboard: contract status by Opportunity, deals waiting on contracts
- Build exec dashboard: total contract volume, cycle time trends, renewal pipeline
- Create scheduled reports for contract expiration warnings
- Set up alerts for SLA breaches (contracts exceeding target cycle time)
- Test dashboard data accuracy against known test contracts

---

## 4.4. QA / Test + Sign-Off

### Purpose
Verify the complete build works end-to-end and get customer approval before rollout.

### Two Types of Testing

| Type | Who | Purpose |
|------|-----|---------|
| Technical Testing | Our team | Verify all components work (workflows fire, data syncs, permissions hold) |
| Customer Testing | Customer | Verify the system handles their real contract scenarios |

### Technical Testing Checklist

- All templates generate correctly with dynamic fields populated
- Clause library is searchable and returns correct results
- Approval workflows route to correct approvers by type, value, and risk
- Escalation rules fire on schedule (e.g., 48-hour stall notification)
- Renewal/expiration alerts trigger at correct intervals (30/60/90 days)
- CRM integration: contract creation from Opportunity populates all fields
- CRM sync: contract status updates reflect in CRM within expected timeframe
- Permissions: each role can only access what they should (test all 4 roles)
- SSO login works for all user types
- Dashboards display accurate data from test contracts
- E-signature integration sends and returns signed documents

### Customer Pilot Testing

- Select pilot group (3-5 sales reps, 1-2 legal team members)
- Process 5-10 real contracts through the system end-to-end
- Document issues, friction points, and user feedback
- Refine workflows, templates, and permissions based on pilot learnings
- Validate CRM sync accuracy with actual contract data
- Get pilot group sign-off before proceeding to full rollout

### Engineering Sign-Off Checkpoint

- Built system matches tech spec
- All technical tests passing
- Pilot complete with 5-10 real contracts processed
- Customer pilot group has tested and approved
- Ready for enablement

### Decision Point

- **Proceed to Enablement** → System is built and pilot-validated
- **Loop back to Build** → Issues found in pilot that require fixes

---

## Phase 3: Enablement

### Goal
Legal and sales teams can use the CLM platform independently. Adoption is the primary risk here -- organizations report missed opportunities due to contract lifecycle inefficiencies. A poorly adopted CLM just adds another tool nobody uses.

### Output
Trained teams with documentation, decommissioned old processes, stabilized system.

### Sub-Phases Flow
```
3a Training Prep → 3b Training Sessions → 3c Hypercare → 3d Enablement Sign-Off
```

---

## 5.1. Training Prep

### Purpose
Create role-specific training materials from project documentation.

### Input
Strategic package + tech specs + configured CLM platform

### Output
Training package containing:

- **Legal Admin training deck:** Template management, clause library maintenance, approval workflow configuration, compliance features (audit logs, version control)
- **Sales User training deck:** Contract initiation from CRM, status tracking, requesting expedited review, finding approved templates
- **Leadership overview deck:** Dashboard interpretation, cycle time monitoring, renewal pipeline visibility
- **Video walkthrough scripts:** One per training type (3 scripts total)
- **Quick-reference guides:** One for legal admin, one for sales users (with screenshots)
- **FAQ draft:** Based on common CLM adoption questions from similar implementations

---

## 5.2. Training Sessions

### Purpose
Transfer knowledge so each role can operate within the CLM without reverting to old processes.

### CLM-Specific Training Sessions

| Session | Audience | Focus | Duration |
|---------|----------|-------|----------|
| Legal Admin | Legal Ops, paralegals, GC | Template management, clause library updates, approval workflows, compliance reporting, amendment tracking | 60-90 min |
| Sales User | Sales reps, SDRs, Sales Ops | Initiate contracts from Opportunity, track status, request expedited review, use clause alternatives | 30-45 min |
| Leadership | VP Legal, VP Sales, Exec | Dashboard navigation, cycle time interpretation, renewal pipeline, escalation triggers | 30 min |
| IT Admin | Systems admin | User provisioning, SSO maintenance, integration monitoring, troubleshooting | 30 min |

### Training Delivery for Each Session

1. Present training deck (live or recorded)
2. Walk through the actual CLM platform with real examples
3. Have attendees complete a sample workflow (e.g., sales creates a contract, legal reviews, approval routes)
4. Record video walkthrough for future reference
5. Answer questions, note gaps for FAQ

### Output

- Trained stakeholders across all 4 roles
- Video walkthrough recordings for each session
- Updated FAQ (incorporating questions from training)
- Questions log for hypercare monitoring

---

## 5.3. Hypercare

### Purpose
Intensive post-launch support to catch adoption issues and workflow bugs before they become habits.

### Duration
2 weeks post-full rollout

### What Happens

| Week | Support Level | Focus |
|------|---------------|-------|
| 1 | Daily 15-min office hours | Answer questions, fix workflow bugs, monitor adoption metrics |
| 2 | Twice-weekly 30-min slots | Address edge cases, refine workflows, confirm stabilization |

### Key Activities

- Monitor adoption metrics daily: contracts initiated through CLM vs. old processes
- Respond to support tickets within 4 hours during business hours
- Track and fix workflow bugs (incorrect routing, missing notifications, sync failures)
- Identify users reverting to email/shared drive and proactively address
- Ensure old contract request processes are fully decommissioned

### Adoption Metrics to Monitor

| Metric | Target (Week 1) | Target (Week 2) |
|--------|-----------------|-----------------|
| Contracts initiated via CLM | >70% of new deals | >90% of new deals |
| Avg time to first approval | Baseline captured | 20%+ improvement |
| Support tickets | Trending down | fewer than 3/day |
| Users logging in to CLM | >80% of trained | >90% of trained |

### Output
Stabilized system, adoption targets met, no critical issues outstanding

---

## 5.4. Enablement Sign-Off

### Purpose
Confirm the team can operate the CLM platform without daily support.

### Validation Checkpoint

- All training sessions delivered (legal, sales, leadership, IT)
- Training recordings and documentation provided
- Hypercare period complete (2 weeks)
- Adoption metrics meeting targets (>90% CLM usage for new contracts)
- No critical issues outstanding
- Old contract processes fully decommissioned
- Customer team can operate without daily support
- Ready for handoff

### Decision Point

- **Proceed to Handoff** → Customer is enabled, adoption metrics solid
- **Extend Hypercare** → Adoption below 70%, critical workflow issues remain, or key user group resisting

---

## Phase 4: Handoff

### Goal
Clean project close with maintenance plan established and retention/expansion path set.

### Output
Maintenance schedule documented, internal context transferred, customer owns the system, project archived, future revenue path established.

### Structure Flow
```
4a Maintenance Schedule → 4b Internal Handoff → 4c External Handoff → 4d Project Close
                            (SME → Architect)      (LeanScale → Customer)  (Archive + Debrief)
```

### Maintenance Ownership by Engagement Type

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|---------------------|---------------|
| **Single Project** | Customer owns | 4c (External Handoff) -- customer receives maintenance schedule and runs it themselves |
| **Dedicated (Multi-Project)** | Architect owns | 4b (Internal Handoff) -- Architect receives maintenance schedule and runs it for customer |

---

## 6.1. Maintenance Schedule

### Purpose
Document what needs ongoing attention to keep the CLM platform accurate and adopted.

### Standard Maintenance Framework

#### Monthly Tasks

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|--------------------|
| Template usage audit | Which templates are being used, which are stale | Any template with 0 uses in past 30 days |
| Approval queue health | Average time contracts sit in approval, stalled contracts count | Avg approval time >48 hours or >5 stalled |
| CRM sync validation | Spot-check 10 recent contracts for correct CRM field sync | Any sync failures or data mismatches |
| Adoption rate check | % of new contracts initiated through CLM vs. bypassed | Less than 85% CLM usage |
| Expiration/renewal alerts | Confirm alerts are firing correctly for upcoming renewals | Any missed renewal alert |

#### Quarterly Tasks

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|----------------|--------------------|
| Full workflow review | Are approval workflows still matching current business needs? | Update routing rules, add new contract types |
| Clause library update | New negotiation patterns, new regulatory requirements | Add/update clauses, retire outdated ones |
| User access audit | Are permissions still correct? Any departed employees? | Deprovision, update roles |
| Dashboard accuracy check | Do dashboards reflect accurate cycle time and volume data? | Fix data source, reconfigure filters |
| Template version review | Are templates current with latest legal language? | Update templates, version-control the change |

#### After First Business Cycle (30-90 days post-launch)

- Contract cycle time comparison: pre-CLM vs. post-CLM average by contract type
- Adoption rate assessment: what % of contracts flow through CLM
- User satisfaction: quick survey to legal and sales on friction points
- Key Question: Are we hitting the 30%+ cycle time reduction target? If not, where is the bottleneck (drafting, review, approval, execution)?

#### Refinement Triggers (when to re-engage)

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Cycle time regression | Avg cycle time increases >20% from post-launch baseline | Investigate: is it a workflow issue, adoption issue, or volume spike? |
| Adoption drop | CLM usage falls below 75% | Retraining, decommission any lingering old processes |
| Template proliferation | More than 5 ad-hoc template variants created outside library | Audit, consolidate, retrain on clause library usage |
| Integration failures | CRM sync errors more than 3 per week | IT investigation, re-validate integration config |

#### Every 6-12 Months

- Full CLM platform health check: performance, storage, user count vs. license
- Template library refresh: update for new regulatory requirements, new product lines, pricing changes
- Workflow optimization: adjust routing rules based on 6-12 months of data on actual approval patterns
- Integration review: confirm CRM sync is still accurate, check for platform API changes
- Vendor contract review: license renewal, feature updates, migration to newer versions

---

## 6.2. Internal Handoff (SME → Architect)

### Purpose
Transfer context so Architect can manage the ongoing CLM relationship.

### What Architect Needs to Know

- Which CLM platform was deployed and key admin credentials location
- CRM integration architecture (what connects, how, sync frequency)
- Approval workflow logic (the rules behind who approves what)
- Key stakeholder map (who to call for legal questions vs. sales vs. IT)
- Any custom configurations or workarounds implemented
- **Maintenance schedule** (if Dedicated engagement -- Architect runs this)

### Escalation Guidelines

| Issue Type | Who Handles | Example |
|------------|-------------|---------|
| User provisioning, password resets, basic Q&A | Architect | "New sales rep needs CLM access" |
| Template text updates (minor wording changes) | Architect | "Update company address in MSA footer" |
| New contract type addition | SME | "We need a Partner Agreement template and workflow" |
| Workflow logic changes | SME | "Change approval threshold from $100K to $75K" |
| CRM integration issues | SME + IT | "Contract status not syncing to Opportunities" |
| Clause library restructuring | SME | "Need to reorganize clauses for new compliance requirement" |

### For Dedicated Engagements
Architect receives the maintenance schedule (6.1) and becomes responsible for executing it. SME walks Architect through each maintenance task during handoff.

---

## 6.3. External Handoff (LeanScale → Customer)

### Purpose
Formal project completion with customer.

### Final Project Meeting Agenda

1. Review what was delivered (platform, templates, workflows, integrations, dashboards)
2. Walk through documentation package
3. Demo the maintenance tasks (show them how to run each monthly/quarterly check)
4. Review adoption metrics and cycle time improvement data
5. Confirm admin access is fully transferred
6. Answer final questions
7. Make it explicit: "Project complete"
8. **For Single Project engagements:** Walk through maintenance schedule in detail, record a video walkthrough

### Documentation Package

- All training video walkthrough recordings (legal admin, sales user, leadership, IT admin)
- Technical documentation (integration architecture, workflow logic, permission matrix)
- Definition Alignment Document (final version)
- Admin quick-reference guide
- Sales quick-reference guide
- FAQ document
- Troubleshooting runbook
- Maintenance schedule
- Vendor support contacts and escalation process

### Output
Customer owns the CLM system. Project formally complete.

---

## 6.4. Project Close

### Purpose
Clean internal wrap-up + establish retention/expansion path.

### Archive Checklist

- All project artifacts saved to proper location
- Handoff documentation complete
- Project status updated in tracking system
- Time/billing finalized

### Internal Debrief (Optional but Recommended)

- What went well? (e.g., template config was faster than expected)
- What would we do differently? (e.g., should have involved IT earlier for SSO)
- Any learnings to feed back into CLM playbook?
- How did actual cycle time reduction compare to target?

### Retention / Expansion

**Two Paths Based on Engagement Type:**

| Engagement Type | Path |
|-----------------|------|
| **Single Project** | Upsell → Downsell → Retry |
| **Multi-Project (Dedicated)** | Schedule Refinement Check-In |

#### Single Project Path

```
1. Upsell: Managed Services (ongoing CLM optimization, new template creation, workflow tuning)
   | if no
2. Downsell: Another one-time project (e.g., CPQ Implementation, E-Signature Enhancement, Advanced CLM features like AI risk scoring)
   | if yes
3. Retry retainer at end of next project cycle
```

**Script**
"Now that CLM Implementation is complete, there are two ways we can continue working together. Option 1: We set you up on managed services where we handle ongoing template updates, workflow optimization, and new contract type additions as your business evolves. Option 2: If there's a specific enhancement you want -- like AI-powered clause analysis or advanced risk scoring -- we can scope that as a follow-up project. Which sounds more interesting?"

#### Multi-Project (Dedicated) Path

Schedule a refinement check-in at handoff:

"On [date ~quarter out], we'll review how CLM is performing against cycle time targets and see if any workflow adjustments are needed."

**Internal Prep (2 weeks before check-in)**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull cycle time data, adoption rates, support ticket trends |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points. |

### Output
Project archived. Future revenue path established.

---

## Troubleshooting Guide

Common issues encountered during and after CLM implementation, with resolution steps.

| Scenario | Symptoms | Resolution |
|----------|----------|-----------|
| Contract stuck in approval queue | Status shows "Pending Approval" for more than 48 hours | Check approver assignment, verify approver has platform access, check for notification delivery issues, escalate manually if needed |
| CRM sync not updating contract status | Contract executed in CLM but CRM Opportunity still shows old stage | Verify OAuth connection is active, check field mapping, confirm sync frequency setting, test with manual sync trigger |
| Template fields not populating | Dynamic fields show blank or placeholder text | Verify field mapping between CLM and CRM, check if source data exists on Opportunity, validate merge field syntax |
| Sales rep can't find "Create Contract" button | Button missing from Opportunity layout | Verify CLM app/package is installed, check page layout assignment, confirm user has correct permission set |
| Clause library search returns no results | User searches for clause by keyword, gets empty results | Check clause tagging/metadata, verify search index is built, confirm clause is tagged with searched term |
| Workflow routing to wrong approver | Finance team receiving contracts that should go to legal | Review routing rules: check contract type, value threshold, and risk tier conditions. Fix the routing condition that's mismatched |
| Renewal alerts not firing | Contracts approaching expiration with no notification | Check alert configuration for correct date field, verify alert schedule is active, confirm notification recipients are configured |
| Users bypassing CLM for email/shared drive | Contract requests coming through alternate channels, not CLM | Decommission old request channels, check if CLM workflow has friction point driving avoidance |
| E-signature integration failing | Signature requests not sending or returning | Verify e-signature API credentials, check document format compatibility, confirm recipient email addresses are valid |
| Permission errors when accessing contracts | "Access Denied" or contracts not visible to user | Review user role assignment, check if contract was created in a restricted department/team, verify permission set configuration |

---

## Deliverables & Assets Summary

### Strategic Deliverables

- Contract workflow map (current state + future state)
- Approval matrix (by contract type, value, and risk tier)
- Template inventory and prioritization
- Vendor selection recommendation (if applicable)
- Definition Alignment Document

### Technical Deliverables

- Configured CLM platform (templates, clause library, workflows, permissions)
- CRM integration (contract creation from Opportunity, bi-directional sync)
- E-signature integration
- Dashboards and reports (legal, sales, executive)
- Automated alerts (renewal, expiration, SLA breach)

### Documentation Package

- Training video walkthrough recordings (4 sessions)
- Legal admin quick-reference guide
- Sales user quick-reference guide
- Permission matrix reference
- Integration architecture document
- FAQ document
- Troubleshooting runbook
- Maintenance schedule
- Definition Alignment Document (final version)

---

## Appendix

### Roles

| Role | What They Do |
|------|--------------|
| **Architect** | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| **Engineer** | CLM build, automation, dashboards (Phase 2) |
| **SME** | Project/implementation team brought in for project-specific work |

---

## Project Profile

CLM Implementation is a **technical-heavy** project:

| Phase | Weight | Why |
|-------|--------|-----|
| Strategy | 20-30% | Discovery, vendor selection, workflow design |
| Engineering | 50-60% | Platform config, template setup, workflow automation, CRM integration |
| Enablement | 15-20% | Role-specific training, adoption monitoring |
| Handoff | 5-10% | Standard handoff with maintenance documentation |

---

## Key Industry Context

- "71% of companies cannot find 10% or more of their contracts" [4]
- "Poor contract management costs companies an average of 9.2% of annual revenue" [5]
- Contract cycles typically stretch 3-4 weeks, and sometimes over two months
- Organizations with CLM platforms reduce contract cycle time by 30-75%
- 80% of B2B revenue is governed by contractual agreements
- Only 11% of businesses rate their contract management as very effective

---

## Phase Guides

### Phase 1: Strategy

CLM projects stall when legal and sales disagree on approval authority, template scope, or what "standard terms" means. Phase 1 forces alignment on these definitions before anyone touches a platform. The real value is not the technology -- it's getting legal, sales, finance, and IT to agree on how contracts should flow.

**The Vendor Selection Factor**
Unlike many GTM projects, CLM Implementation may include vendor selection as part of Phase 1. This adds 1-2 weeks to the strategy phase but prevents costly platform switches later. Key vendors to evaluate: Ironclad, DocuSign CLM, Conga CLM, Icertis, Agiloft.

**Pre-Kickoff Bottleneck**
The single biggest pre-kickoff risk is template collection. Start requesting templates at deal close, not at kickoff. Track template collection status separately from other homework items.

### Phase 2: Engineering

**Build Sequence:**
```
Admin Config → Permissions → Templates → Clause Library → Workflows → CRM Integration → Dashboards
```

Do not start workflow configuration before templates are loaded. Do not connect CRM before workflows are tested. Each layer validates the one below it.

**Integration Complexity**
CRM integration is where most CLM engineering time is spent. Map contract fields to existing CRM fields where possible (don't create duplicates). Define sync direction for each field. Test sync with real data -- edge cases emerge with actual Opportunity data.

**The "Crawl-Walk-Run" Build Approach:**

1. **Crawl:** Contract repository + basic templates + manual routing = immediate visibility
2. **Walk:** Automated approval workflows + CRM integration = process acceleration
3. **Run:** Clause AI + risk scoring + advanced analytics = optimization

Most LeanScale CLM implementations target "Walk" as the go-live state, with "Run" features as a follow-up engagement.

### Phase 3: Enablement

**The Adoption Challenge**
CLM adoption fails for one primary reason: the old way is easier. Two critical enablement actions:

1. **Decommission the old process completely.** Don't leave email or shared drives as a fallback.
2. **Make the CLM faster than the old way.** If the CLM adds friction, fix the friction before rollout.

**Role-Specific Training Depth:**

- **Legal needs the deepest training** (60-90 min). They are the power users -- template management, clause library maintenance, approval configuration.
- **Sales needs the simplest training** (30-45 min). One button to create a contract from an Opportunity. One screen to check status.
- **Leadership needs interpretation training** (30 min). What does the dashboard tell them? When should they worry?

### Phase 4: Handoff

**Why Maintenance Schedules Matter**
The most common CLM failure mode 6 months post-launch: templates are outdated, clause library has grown stale, new contract types were added without proper workflows. The maintenance schedule prevents this drift.

**Internal Handoff - Key Contact**
For CLM projects, the primary ongoing contact is Legal Ops. Make sure the Architect knows who the Legal Ops lead is, their cadence for template updates, and when to escalate to SME (any workflow logic changes or new contract type additions).

**Natural Expansion Path:**

- **Phase 2 CLM:** AI-powered clause analysis, risk scoring, obligation tracking
- **Adjacent projects:** CPQ Implementation, E-Signature Enhancement, Renewal Management automation
- **Managed Services:** Ongoing template management, quarterly workflow optimization, new hire training

---

## References

[1] Strategic Market Research - Contract Lifecycle Management Market Report 2024-2030

[2] ContractPodAi - Contract Management Statistics & Trends 2025

[3] Ironclad - Contract Lifecycle Management Metrics

[4] Juro - Contract Management Statistics for 2026

[5] ProfileTree - 9.2% of Revenue Drained: Contract Management Statistics

[6] Gainfront - Reducing Contract Lifecycle Time with AI

[7] Gartner Peer Insights - Contract Life Cycle Management Reviews 2026

[8] Ironclad - Overcoming CLM Implementation Challenges
