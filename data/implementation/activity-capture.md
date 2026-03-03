# Activity Capture — Implementation

## Project One-Pager

### Activity Capture One-Pager

#### Project Type
- **Category:** Technical
- **Primary Deliverable:** Fully configured automated activity capture system syncing all email, calendar, and call activities into the CRM without manual rep input

##### Phase Relevance

| Phase | Applies? |
|-------|----------|
| 1. Strategy | Yes |
| 2. Engineering | Yes |
| 3. Enablement | Yes |
| 4. Handoff | Yes |

#### Phase Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. STRATEGY  │────▶│ 2. ENGINEER  │────▶│3. ENABLEMENT │────▶│  4. HANDOFF  │
│    Light     │     │    Heavy     │     │     Med      │     │     Med      │
│ 1a→1b→1c→1d │     │ 2a→2b→2c→2d │     │ 3a→3b→3c→3d │     │ 4a→4b→4c→4d │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
  1-2 meetings         OAuth + sync         Phased rollout       Dashboards +
  tool selection       config + dashboards  training             runbook
```

**This project's flow:**

- Full 4-phase. Light strategy (tool already exists or shortlist is known), heavy engineering (OAuth, sync config, field mapping, dashboards), standard enablement with phased rollout.
- If client already has a tool selected (e.g., Einstein Activity Capture included in Salesforce license), Phase 1 compresses to gap analysis + configuration planning only.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Provide email system details (Google Workspace or Microsoft 365) and admin access confirmation
- Provide list of all email domains used by sales team (including aliases)
- Provide list of users to enable for activity capture (with email addresses and roles)
- Complete decision on data visibility settings (who can see whose activities)
- Confirm IT/Security approval for OAuth connections

##### Track B: Architect Prep

- Pull CRM activity reports for last 90 days (emails logged, meetings logged, calls logged)
- Request email/calendar volume data from IT to quantify the capture gap
- Document current tech stack (CRM edition, email platform, phone/dialer tools)
- Draft tool comparison matrix if tool not yet selected
- Create v0 configuration plan based on tech stack audit

#### Refinement Loop (1b -> 1c -> 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present gap analysis, validate tech stack, discuss tool | VP Sales Ops, IT/Security | Tool decision + config plan |
| Refinement 1 | 1c | Review config plan, finalize visibility/filtering rules | VP Sales Ops, RevOps Lead | Approved configuration spec |
| Sign-Off | 1d | Approve final tool selection, config spec, rollout plan | VP Sales/CRO, VP Sales Ops | Green light for engineering |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held -- gap analysis presented, tool discussed
- 1c. Refinement loop complete -- configuration spec finalized
- 1d. Strategic sign-off obtained -- tool selected, budget approved, config spec approved

##### Phase 2: Engineering

- 2a. Tech spec created -- field mapping, sync rules, dashboard requirements documented
- 2b. Engineering handoff meeting held
- 2c. Build complete -- tool configured, CRM integration active, dashboards built
- 2d. QA/Test + customer sign-off on pilot results

##### Phase 3: Enablement

- 3a. Training materials prepped
- 3b. Training sessions delivered to sales team
- 3c. Hypercare period complete (2-week monitoring post-full-rollout)
- 3d. Enablement sign-off -- all users capturing at expected rates

##### Phase 4: Handoff

- 4a. Maintenance schedule documented and handed off
- 4b. Internal handoff (SME -> Architect) complete
- 4c. External handoff (LeanScale -> Customer) complete
- 4d. Project closed and archived

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| Activity Gap Analysis | Quantify what % of activities are being missed | Gap percentages calculated per channel |
| Tech Stack Audit | Map email, calendar, phone systems for compatibility | All systems documented with integration notes |
| Tool Comparison Matrix | Evaluate activity capture tool options | Tool selected with budget approved |
| Configuration Spec | Define sync rules, visibility, filtering, mapping | All rules documented and client-approved |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| Activity Capture Gap Report | Activity Gap Analysis | Internal justification for the project |
| Configuration Documentation | Configuration Spec | Admin reference for ongoing maintenance |
| Activity Monitoring Dashboard | Dashboard build | Ongoing capture rate monitoring |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Leadership | VP Sales, CRO, Sales Managers | How to interpret activity data for coaching/forecasting | 30m |
| Sales Team | SDRs, AEs, full sales team | What's auto-captured, what still needs manual logging, privacy | 30-45m |
| Technical | RevOps Admin, Sales Ops Manager | How to maintain sync, monitor dashboards, troubleshoot | 60m |

##### Hypercare

- Applies: Yes
- Duration: 2 weeks post-full-rollout
- Office Hours: Yes -- weekly 30-min slot for first 2 weeks

##### Training Assets to Create

- Video walkthrough: What's captured vs. what's not (rep-facing overview)
- Video walkthrough: Dashboard walkthrough for managers
- Doc: Quick-reference one-pager (what's auto-captured per channel)
- Doc: Admin troubleshooting runbook (sync errors, OAuth failures)

#### Handoff & Retention

##### Internal Handoff (SME -> Architect)

- Key context for Architect: Tool configured, sync settings, known edge cases (shared domains, personal email filtering), dashboard locations
- Escalation trigger: Any sync rule changes, new user provisioning issues, tool migration

##### External Handoff (LeanScale -> Customer)

- Final meeting agenda: Review capture rates, walk through dashboards, confirm documentation package, address open questions
- Documentation package: Configuration spec, troubleshooting runbook, training recordings, monitoring dashboard access

##### Maintenance Schedule

- Monthly: Check capture rates, review sync error logs, verify user adoption
- Quarterly: Full sync health audit, review for new channels or tools
- Who owns: Single project = customer owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services -> if no -> Downsell: Related project (Conversation Intelligence, Sales Engagement Platform) -> Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~90 days post-launch
- Internal prep trigger: 2 weeks before
- Decision: Architect handles / SME needed

#### Key Assets

| Asset | When Used |
|-------|-----------|
| Activity Gap Analysis Template | Phase 1 -- Pre-Kickoff |
| Tool Comparison Matrix | Phase 1 -- Tool Selection |
| Configuration Spec Template | Phase 1d/2a -- Sign-off/Spec |
| Monitoring Dashboard Template | Phase 2c -- Build |
| Training One-Pager Template | Phase 3a -- Training Prep |

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| Activity | Any email, calendar event, or call that represents a sales interaction with a prospect or customer |
| Activity Capture | Automated syncing of activities from communication tools (email, calendar, phone) into CRM records |
| Sync Direction | Whether data flows one-way (email -> CRM) or bi-directional (email <-> CRM) |
| Visibility Level | Who can see captured activities: private (rep only), team, or organization-wide |
| Domain Exclusion | Email domains filtered out of capture (internal company domains, personal email providers) |
| Contact Matching | Logic that links a captured activity to the correct Contact/Lead record via email address |
| Domain-to-Account Mapping | Logic that links activities to Account records based on the email domain |
| Capture Rate | Percentage of actual communication activities that are successfully logged in the CRM |
| Orphaned Activity | A captured activity that could not be linked to any Contact, Lead, or Account record |

#### Common Gotchas

- Einstein Activity Capture stores data outside standard Salesforce objects -- activities are not available in reports, list views, or Flow automations unless using the Enhanced version [1] -> Confirm data storage model during tool selection; if reporting is a requirement, choose a tool that writes to standard Activity objects
- Activities sync but link to wrong records because contact matching fails on shared email domains or contacts at multiple companies -> Configure both email-to-contact AND domain-to-account matching; test extensively with edge cases before go-live
- Reps disable sync or mark all activities as private, negating the visibility goal -> Lock organizational defaults via admin controls; prevent user-level overrides; address concerns proactively in training
- Data retention limits create gaps (Einstein: 24 months standard, some tools shorter) -> Document retention limits upfront; evaluate tools with unlimited retention if long-term analysis is critical [2]
- Duplicate activities from competing integrations (e.g., Outreach already logging sequenced emails) -> Map ALL existing activity sources during discovery; disable overlapping integrations before enabling capture tool
- OAuth token expiration causes silent sync failures -> Set up sync error monitoring alerts; include token refresh procedures in troubleshooting runbook

#### Methodology Options

| Option | When to Use | Complexity |
|--------|------------|-----------|
| Native CRM (Einstein/HubSpot) | Client already on Salesforce or HubSpot; budget-constrained; reporting not critical | Low |
| Third-Party (Revenue Grid, Clari Capture, Ebsta) | Client needs activities in standard CRM objects; reporting/API access required; multi-CRM environment | Medium |
| Enterprise (Affinity, People.ai) | Client needs relationship intelligence beyond capture; unlimited retention; advanced analytics | High |

See Methodology for detailed tool comparison frameworks and decision criteria.

---

## Phase 1: Strategy

**Goal:** Get stakeholder sign-off on tool selection, configuration approach, and rollout plan.

**Output:** Approved Activity Gap Analysis + Tool Selection + Configuration Spec.

### 1a. Pre-Kickoff

Two parallel tracks run before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video | Explain what activity capture is and what changes for reps | Video (5-10 min) |
| Tech Stack Questionnaire | Confirm email system, calendar, phone, CRM details | Google Form |
| User List Template | Collect all users to enable with roles and email addresses | Google Sheet |
| Visibility Policy Decision | Get executive decision on who sees whose activities | Google Doc |

**Completion tracking:** RevOps lead or project sponsor owns follow-up. Do not cancel kickoff if incomplete, but push hard -- we need IT/Security approval and email system details before engineering can start.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Pull CRM activity reports (last 90 days) | Raw activity data by type, user, time |
| 2 | Request email/calendar volume data from IT | Baseline communication volume |
| 3 | Calculate activity capture gap | Gap analysis (e.g., "Only 15% of emails logged") |
| 4 | Audit tech stack for tool compatibility | Tech Stack Audit document |
| 5 | Draft tool comparison matrix (if tool not selected) | Tool Comparison Matrix with recommendation |
| 6 | Create v0 configuration plan | Draft sync rules, domain exclusions, visibility settings |

**Critical:** Mark all configuration assumptions as ASSUMED. The kickoff call validates. Research shows sales reps spend an average of 6+ hours per week on manual data entry [3], and only 10-15% of actual activities get manually logged -- use these benchmarks to frame the gap analysis.

#### Stakeholder Alignment Document

Get stakeholder sign-off on terms BEFORE building anything.

| Term | Our Definition | Internally Approved? |
|------|----------------|----------------------|
| Activity | Any email, calendar event, or call representing a sales interaction | [ ] Yes / [ ] No |
| Activity Capture | Automated sync of activities from email/calendar/phone into CRM | [ ] Yes / [ ] No |
| Visibility Level | Who sees captured activities: private, team, or org-wide | [ ] Yes / [ ] No |
| Manual Logging | Activities that still require rep input (texts, LinkedIn, personal phone) | [ ] Yes / [ ] No |

**Instructions to customer:**

Review each definition with your leadership team. Check "Yes" when approved. We cannot proceed with configuration until visibility policy and activity scope are aligned.

---

### 1b. Kickoff Call

**Purpose:** Present the activity capture gap, validate tech stack, and align on tool selection and configuration approach.

#### Agenda (60 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Present gap analysis | "Here's what we found -- only X% of activities are logged" |
| 15-30 | Tech stack review | Validate email, calendar, phone systems and constraints |
| 30-40 | Tool discussion | Present comparison matrix, discuss recommendation |
| 40-50 | Configuration approach | Walk through draft sync rules, visibility, exclusions |
| 50-60 | Next steps | Assign homework, schedule refinement meeting |

#### What We Bring

- Activity Gap Analysis (CRM activity counts vs. actual volume)
- Tech Stack Audit (systems and compatibility)
- Tool Comparison Matrix (if tool not yet selected)
- Draft Configuration Plan (v0 sync rules, domain exclusions, visibility)

#### What We Leave With

- Tool direction (selected or shortlisted to 1-2 finalists)
- Feedback on visibility policy and configuration approach
- IT/Security contact for OAuth approval
- Homework assignments: client to finalize user list, confirm IT approval

---

### 1c. Alignment Loop & Strategic Meeting Cadence

**Purpose:** Finalize tool selection and configuration spec before engineering begins.

#### The Pattern

```
Kickoff Call (present gap, discuss tool)
    |
Architect refines configuration spec based on feedback -> v1
    |
Meeting 2 (present v1 config spec, finalize rules) -> v2
    |
Sign-Off (approve final spec, green light engineering)
```

#### Before Each Meeting

1. Update configuration spec with feedback from previous session
2. Resolve any open technical questions with client IT
3. Prepare specific questions for next validation round

#### During Each Meeting

1. Walk through updated configuration spec
2. Capture corrections (domain exclusions to add, visibility changes)
3. Validate what's now CONFIRMED vs. still ASSUMED
4. Identify remaining blockers (IT approval, budget, user list)

#### After Each Meeting

1. Update configuration spec (ASSUMED -> CONFIRMED)
2. Track decisions in working documents
3. Coordinate with IT on any security/compliance questions

#### Meeting Types for Activity Capture

| Meeting Type | Focus | Stakeholder |
|--------------|-------|-------------|
| Kickoff | Gap analysis, tool discussion, approach | VP Sales Ops, IT/Security |
| Configuration Review | Finalize sync rules, visibility, field mapping | RevOps Lead, VP Sales Ops |
| Sign-Off | Approve spec and rollout plan | VP Sales/CRO, VP Sales Ops |

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 2-3 days |
| Kickoff call | Day 1 of engagement |
| Configuration review | Day 3-5 |
| Sign-off | Day 5-7 |
| **Total Phase 1** | **1-2 weeks** |

---

### 1d. Strategic Sign-Off

**Purpose:** Confirm everything is ready before engineering begins.

#### Validation Checkpoint

- Tool selected and procurement initiated (license active or trial started)
- IT/Security approval for OAuth connections obtained
- Configuration spec approved (sync rules, visibility, domain exclusions, field mapping)
- User list finalized with roles and email addresses
- Activity type categorization schema approved
- Rollout plan approved (pilot group identified, phased schedule agreed)
- Executive sponsor committed to communicating expectations to sales team
- No blockers for engineering

#### Decision Point

- **Proceed to Engineering** -> Tool selected, spec approved, IT cleared
- **Hold** -> Waiting on IT approval, budget, or executive alignment (rare -- push to resolve)

This project does NOT have a natural exit after Phase 1. Activity Capture requires engineering build + enablement to deliver value.

---

## Phase 2: Engineering

**Goal:** Configure the activity capture tool, integrate with CRM, build monitoring dashboards, and validate via pilot.

**Output:** Fully configured activity capture system, tested and validated with pilot users.

### Sub-Phases

```
2a Tech Spec -> 2b Engineering Handoff -> 2c Build -> 2d Test
```

---

### 2a. Tech Spec

**Purpose:** Translate configuration spec into technical implementation steps.

**Input:** Approved configuration spec from Phase 1

**Output:** Draft tech spec containing:

- OAuth connection requirements and API permissions needed
- Email sync configuration (direction, visibility defaults, domain filter lists)
- Calendar sync configuration (meeting types, attendee matching rules)
- Call capture configuration (dialer integration details)
- Contact matching logic (email-to-Contact/Lead matching rules)
- Domain-to-Account mapping rules
- Activity type picklist values and auto-classification rules
- Custom field specifications (activity metadata)
- Dashboard component requirements (activity volume, capture rate, adoption, linkage quality)
- Build sequence (connection first, then email sync, calendar, calls, field mapping, dashboards)

---

### 2b. Engineering Handoff

**Purpose:** Review tech specs with engineer before building.

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through specs | Architect explains configuration requirements + context |
| 15-30 | Engineer questions | Clarify OAuth requirements, API limits, edge cases |
| 30-45 | Refine and approve | Adjust specs, confirm build sequence |

**What Architect brings:**

- Approved configuration spec (for business context)
- Draft tech spec (from 2a)
- Known risks: Einstein data storage limitations, shared domain handling, multi-company contacts

**What engineer leaves with:**

- Approved tech spec
- Clear build sequence: (1) Tool account + CRM connection -> (2) Email sync -> (3) Calendar sync -> (4) Call capture -> (5) Field mapping + contact matching -> (6) Activity categorization -> (7) Dashboards
- Known edge cases to test

---

### 2c. Build (Configure)

**Purpose:** Configure the activity capture tool, integrate with CRM, and build dashboards.

**Input:** Approved tech spec from 2b

**Build sequence:**

| # | Component | Action | Validation |
|---|-----------|--------|-----------|
| 1 | Tool Account + CRM Connection | Create account, connect via OAuth, grant API permissions | Connection status green in tool dashboard |
| 2 | Email Sync | Configure direction, visibility, domain exclusions (internal + personal) | Test with 3-5 sample emails across scenarios |
| 3 | Calendar Sync | Configure meeting type capture, internal/external rules, attendee matching | Test with sample calendar events |
| 4 | Call Capture (if applicable) | Configure dialer integration, call outcome picklist, duration tracking | Test with sample calls |
| 5 | Contact Matching + Domain Mapping | Configure email-to-Contact matching, domain-to-Account mapping | Test edge cases: new leads, multi-company contacts, shared domains |
| 6 | Activity Type Categorization | Create activity type picklist, configure auto-classification rules | Verify categorization with sample activities |
| 7 | Duplicate Prevention | Disable competing integrations, configure dedup rules | Confirm no duplicate activities on test records |
| 8 | Monitoring Dashboard | Build activity volume, capture rate, adoption, linkage quality reports | Verify dashboards render with sample data |

**Execution approach:** Manual build (engineer configures directly in tool + CRM). Activity capture tool configuration is system-specific and typically requires direct admin access.

**Build tracking:**

- Component 1: Tool account + CRM connection
- Component 2: Email sync configured and tested
- Component 3: Calendar sync configured and tested
- Component 4: Call capture configured and tested (if applicable)
- Component 5: Contact matching + domain mapping configured and tested
- Component 6: Activity type categorization configured
- Component 7: Duplicate prevention verified
- Component 8: Monitoring dashboard built

---

### 2d. QA / Test + Sign-Off

**Purpose:** Validate the build via pilot and get customer approval.

**Two types of testing:**

| Type | Who | Purpose |
|------|-----|---------|
| Technical Testing | Our team | Verify sync works, activities link correctly, no dupes |
| Pilot Testing | 3-5 users | Validate in real-world conditions over 3-5 days |

**Technical testing checklist:**

- Email sync active -- outbound and inbound emails appearing on correct CRM records
- Calendar sync active -- meetings appearing on correct Contact/Account records
- Call logging active (if applicable) -- calls with duration on correct records
- Contact matching working -- activities linking to correct Leads/Contacts
- Domain-to-Account mapping working -- activities appearing on correct Accounts
- Opportunity association working -- activities on Contacts linking to open Opportunities
- No duplicate activities from competing integrations
- Internal emails excluded (company domain filtering working)
- Personal email domains excluded (gmail.com, yahoo.com, hotmail.com)
- Activity types classifying correctly
- Monitoring dashboard showing accurate data
- Sync error monitoring detecting and reporting failures

**Pilot testing (3-5 business days):**

1. Select 3-5 pilot users representing different roles (SDR, AE, Manager) and email patterns
2. Enable activity capture for pilot group only
3. Monitor captured activities for accuracy daily
4. Review: correct record linking, no duplicates, no missing activities, no false captures
5. Gather pilot user feedback on concerns or issues
6. Fix configuration issues before full rollout

**Engineering sign-off checkpoint:**

- All sync channels active and tested (email, calendar, calls)
- Pilot completed successfully (3-5 days, no critical issues)
- Monitoring dashboard validated
- Customer has reviewed pilot results and approved
- Ready for enablement and full rollout

**Decision point:**

- **Proceed to Enablement** -> Pilot successful, ready for training and rollout
- **Loop back to Build** -> Configuration issues found during pilot, needs fixes

---

## Phase 3: Enablement

**Goal:** Sales team trained, full rollout executed, system stabilized.

**Output:** All users capturing activities, team trained on what's automated vs. manual, monitoring active.

### Sub-Phases

```
3a Training Prep -> 3b Training Sessions -> 3c Hypercare -> 3d Enablement Sign-Off
```

---

### 3a. Training Prep

**Purpose:** Create training materials from configuration documentation and pilot learnings.

**Input:** Configuration spec + pilot results + built system

**Output:** Training package containing:

- **Rep-facing one-pager:** What's auto-captured (email, calendar, calls) vs. what still needs manual logging (LinkedIn messages, texts, personal mobile calls)
- **Manager guide:** How to use activity data for coaching and pipeline visibility
- **Admin runbook:** How to monitor sync health, troubleshoot errors, onboard new users
- **FAQ document:** Addressing common concerns (privacy, "Big Brother" perception, what managers can see)
- **Video scripts:** Dashboard walkthrough for managers, system overview for reps

---

### 3b. Training Sessions

**Purpose:** Train the sales team on the new system before and during rollout.

**Training schedule:**

| Session | Audience | Focus | Duration | When |
|---------|----------|-------|----------|------|
| Session 1 | Full sales team | What's auto-captured, what's manual, visibility settings, FAQ | 30-45m | Before Phase 1 rollout |
| Session 2 | Sales managers | Activity dashboards, coaching use cases, pipeline visibility | 30m | After Phase 1 rollout |
| Session 3 | RevOps Admin | Monitoring dashboard, troubleshooting, new user setup | 60m | After full rollout |

**Training delivery:**

1. Schedule sessions with appropriate stakeholders
2. Deliver training live (record all sessions)
3. Address the "Big Brother" concern directly -- frame as "we're removing your data entry burden, not adding surveillance" with clear policy from executive sponsor
4. Distribute one-pager and FAQ to all reps
5. Record video walkthroughs for future reference and new hire onboarding

**Output:**

- Trained sales team and managers
- Recorded training sessions
- Distributed one-pager and FAQ
- Questions log (feeds into admin runbook updates)

---

### 3c. Hypercare

**Purpose:** Intensive post-rollout monitoring to catch and fix issues quickly.

**Duration:** 2 weeks post-full-rollout

**What happens:**

- Daily monitoring of sync error dashboard for first 5 business days
- Weekly 30-minute office hours slot (anyone can join with questions or issues)
- Triage and fix sync failures, OAuth token expirations, user-specific issues
- Monitor capture rates by user -- flag anyone below expected thresholds
- Address user-specific problems (OAuth failures, permission issues, disabled sync)

**When to skip:** Do not skip. Activity capture requires monitoring to catch silent failures (OAuth token expiration, sync errors that don't surface to users).

**Output:** Stabilized system -- all users capturing at expected rates, no critical issues outstanding.

---

### 3d. Enablement Sign-Off

**Purpose:** Confirm the system is stable and the customer team can operate independently.

**Validation checkpoint:**

- All training sessions delivered and recorded
- Training one-pager and FAQ distributed to all reps
- Admin runbook delivered to RevOps team
- Full rollout complete -- all target users enabled
- Capture rate exceeds 85% for 5+ consecutive business days
- No critical sync errors outstanding
- Monitoring dashboard active and understood by RevOps admin
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** -> System stable, team trained, capture rates healthy
- **Extend Hypercare** -> Capture rates below threshold, unresolved sync issues, user adoption problems

---

## Phase 4: Handoff

**Goal:** Clean project close with maintenance plan, documentation package delivered, retention path established.

**Output:** Customer owns the system with monitoring capability. Project archived. Future engagement path set.

**Structure:**

```
4a Maintenance Schedule -> 4b Internal Handoff -> 4c External Handoff -> 4d Project Close
                                (SME -> Architect)    (LeanScale -> Customer)  (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|---------------------|---------------|
| **Single Project** | Customer owns | 4c (External) |
| **Dedicated (Multi-Project)** | Architect owns | 4b (Internal) |

---

### 4a. Maintenance Schedule

**Purpose:** Document what needs ongoing attention to keep activity capture healthy.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|-------------------|
| Capture Rate Review | Compare CRM activity counts to expected volume by user | Any user below 70% capture rate for 2+ weeks |
| Sync Error Audit | Review sync error logs for failed or stuck activities | More than 5% error rate across all users |
| User Adoption Check | Verify all users have active sync (no disabled/expired) | Any user with sync disabled or OAuth expired |
| New User Onboarding | Enable activity capture for any new hires | New rep active >1 week without capture enabled |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|----------------|---------------------|
| Full Sync Health Audit | End-to-end review of all sync channels and error rates | Re-configure failing channels, escalate to vendor |
| Activity Linkage Quality | % of activities linked to Accounts vs. orphaned | Update contact matching rules, add missing domains |
| New Channel Review | Any new communication tools added (new dialer, messaging) | Evaluate integration options for new channels |
| Dashboard Usage Audit | Are managers actually using activity dashboards? | Re-train, adjust dashboard layout if underused |

**After First Business Cycle (30 days post-launch):**

- Capture Rate Validation: Are we hitting 90%+ capture rate as expected? If below 85%, investigate per-user issues
- Data Quality Check: Are activities linking to correct records? Sample 50 activities across 5 users and verify accuracy
- Manager Adoption: Are managers using activity data in coaching conversations? If not, schedule targeted manager training

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Capture rate decline | Drops below 80% for 2+ consecutive weeks | Investigate: OAuth expirations, disabled users, new tool conflicts |
| Activity linkage degradation | Orphaned activities exceed 15% | Review matching rules, add new domains |
| New communication tool | Client adopts new dialer, messaging platform | Scope integration or document manual logging requirement |
| Tool vendor sunset/migration | Entire system stops functioning | Re-evaluate tool, scope migration if necessary |

**Every 6-12 Months:**

- Full System Review: Audit all sync channels, matching rules, exclusion lists, and dashboard accuracy
- Tool Re-evaluation: Compare current tool to new market entrants -- activity capture market evolves quickly
- Process Audit: Review if manual logging requirements can be reduced with new integrations

---

### 4b. Internal Handoff (SME -> Architect)

**Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- What was built: which tool, which channels (email, calendar, calls), which CRM
- Configuration details: visibility settings, domain exclusions, sync direction
- Common issues: OAuth token expiration (most common), new user setup process, sync error triage
- When to escalate back to SME: sync rule changes, tool migration, new channel integration
- **Maintenance schedule** (if Dedicated -- Architect runs this)

**Escalation guidelines:**

| Issue Type | Who Handles | Example |
|-----------|-------------|---------|
| New user setup, basic dashboard questions | Architect | "Add a new hire to activity capture" |
| OAuth re-authorization, simple sync restart | Architect (with runbook) | "Rep's sync stopped -- re-authorize OAuth" |
| Sync rule changes, new channel integration | SME | "We switched dialers, need new integration" |
| Tool migration or major configuration overhaul | SME | "Moving from Einstein to Revenue Grid" |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing monthly and quarterly checks. SME walks Architect through each maintenance task during handoff.

---

### 4c. External Handoff (LeanScale -> Customer)

**Purpose:** Formal project completion with customer.

**Final project meeting:**

- Review capture rate results ("We're now capturing 93% of activities vs. 15% before")
- Walk through monitoring dashboard -- how to read it, what to watch
- Walk through admin troubleshooting runbook
- Confirm documentation package received
- Address any final questions
- Make it explicit: "Project complete"
- **For Single Project engagements:** Hand over maintenance schedule and walk through monthly/quarterly tasks in detail

**Documentation package:**

| Document | Contents |
|----------|----------|
| Configuration Spec (final) | All sync rules, domain exclusions, visibility settings |
| Admin Troubleshooting Runbook | Common issues, resolution steps, vendor escalation contacts |
| Training Recordings | All recorded training sessions |
| Rep One-Pager | What's captured vs. manual per channel |
| FAQ Document | Common questions and answers |
| Monitoring Dashboard Guide | How to read dashboard, what thresholds to watch |
| Maintenance Schedule | Monthly/quarterly tasks with red flag thresholds |

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video walkthrough. Make sure they understand capture rate thresholds and sync error monitoring.

**Output:** Customer owns the system. RevOps admin can monitor, troubleshoot, and onboard new users independently.

---

### 4d. Project Close

**Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved (configuration spec, gap analysis, tech stack audit, training materials)
- Handoff documentation complete and delivered
- Project status updated in tracking system
- Time/billing finalized

#### Internal Debrief (Optional but Recommended)

- What went well? (e.g., pilot caught the shared domain issue before full rollout)
- What would we do differently? (e.g., should have confirmed IT approval earlier)
- Any learnings to feed back into SOPs? (e.g., new edge case for contact matching)

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| **Single Project** | Upsell -> Downsell -> Retry |
| **Multi-Project (Dedicated)** | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (retainer -- we monitor and maintain activity capture + expand to other projects)
   | if no
2. Downsell: Related project (Conversation Intelligence, Sales Engagement Platform, Executive Reporting Suite)
   | if yes
3. Retry retainer at end of next project cycle
```

**Script:**

"Now that Activity Capture is live, there are two ways we can continue working together. Option 1: We set you up on managed services where we monitor capture rates, handle new user onboarding, and optimize as your tools evolve. Option 2: We can scope out a related project -- many clients follow Activity Capture with Conversation Intelligence (Gong/Chorus) or a full Sales Engagement Platform. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

"On [date ~90 days out], we'll review capture rates, identify any new channels to integrate, and assess if any configuration adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull capture rate trends, sync error rates, user adoption |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points. |

**At the refinement check-in:**

- Review capture rates against baseline and targets
- Identify any new communication tools adopted since launch
- Assess if configuration adjustments are needed
- If minor: Architect handles tweaks (new users, domain additions)
- If major: Scope new project (tool migration, new channel integration)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Activity Gap Analysis Report (CRM activities vs. actual communication volume)
- Tool Comparison Matrix (if tool selection was in scope)
- Configuration Spec (sync rules, visibility, domain exclusions, field mapping)

**Technical Deliverables:**

- Configured activity capture tool (email sync, calendar sync, call capture)
- CRM field mappings and contact matching logic
- Activity type categorization schema
- Activity Monitoring Dashboard (capture rate, sync errors, adoption, linkage quality)

**Documentation Package:**

- Training recordings (rep overview, manager dashboard walkthrough, admin runbook)
- Written guides: Rep one-pager, Admin troubleshooting runbook
- FAQ document
- Definition Alignment Document (final version)
- Maintenance Schedule (monthly/quarterly tasks with red flag thresholds)

---

## Appendix: Implementation Guide

Reference material for the implementation team. This section does not change per project.

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
|-------|--------|--------------|
| **Phase 1: Strategy** | Tool selection + Configuration Spec (signed off) | Tool selected, config spec approved, IT cleared, rollout plan agreed |
| **Phase 2: Engineering** | Configured system + pilot validated | All sync channels active, pilot passed, dashboards working |
| **Phase 3: Enablement** | Trained team + full rollout complete | All users capturing, training delivered, capture rate above threshold |
| **Phase 4: Handoff** | Independent customer + archived project | Documentation delivered, maintenance plan in place, project closed |

---

### How to Adapt Per Project Type

Activity Capture is a **technical-heavy** project:

| Project Profile | Strategy Weight | Engineering Weight | Enablement Weight |
|-----------------|-----------------|-------------------|-------------------|
| **Technical-heavy** | 15-20% | 50-60% | 20-25% |

**Adaptation notes:**

- Phase 1 compresses if the tool is already selected (client already has Einstein, or tool was chosen in a prior engagement)
- Phase 2 is the core -- most time and effort goes into configuration and piloting
- Phase 3 is medium-weight -- phased rollout is critical to catch issues before they affect the full team
- Phase 4 always applies -- monitoring dashboards and troubleshooting runbooks are essential for ongoing health

---

### Phase 1 Guide: Strategy (Activity Capture Specifics)

#### Why Phase 1 Is Light for This Project

Activity Capture is a technical implementation project. The strategic decisions are relatively constrained: which tool, what visibility settings, which channels to capture. Most of the complexity lives in Phase 2 (configuration) and Phase 3 (rollout). Phase 1's main goal is to get alignment on the tool and configuration approach quickly so engineering can begin.

#### Key Strategic Decisions

| Decision | Options | Impact |
|----------|---------|--------|
| Tool selection | Native CRM (Einstein/HubSpot) vs. third-party | Data storage, reporting capability, cost |
| Sync direction | One-way (email -> CRM) vs. bi-directional | Complexity, data conflict risk |
| Visibility policy | Private, team, or org-wide | Adoption, trust, coaching capability |
| Channel scope | Email only, email + calendar, full (email + cal + calls) | Implementation complexity, coverage |

See Methodology for detailed tool comparison frameworks, data storage model analysis, and decision criteria.

---

### Phase 2 Guide: Engineering (Activity Capture Specifics)

#### Why Phase 2 Is Heavy for This Project

Activity Capture requires precise configuration of multiple integrations (email, calendar, phone) with correct matching logic to link activities to the right CRM records. A misconfigured matching rule silently assigns activities to wrong records. A missing domain exclusion floods the CRM with internal emails. These are not visible to end users -- only monitoring dashboards catch them.

#### Critical Configuration Areas

1. **Domain exclusions:** Internal company domains AND common personal domains (gmail.com, yahoo.com, hotmail.com, outlook.com). Miss one and the CRM fills with noise.
2. **Contact matching:** Must handle: contacts at multiple companies, shared email domains (consulting firms), new leads without existing records.
3. **Duplicate prevention:** If client uses Outreach, Salesloft, or any tool that also logs activities, disable that tool's logging before enabling the capture tool.
4. **Data storage model:** Einstein Activity Capture stores data in a separate cloud outside standard Salesforce objects. Activities are visible on records but NOT available in Salesforce Reports, List Views, Flows, or APIs [1]. If reporting is a requirement, use a third-party tool that writes to standard Activity objects.

#### Einstein Activity Capture Specific Warnings

- Standard edition: 24-month data retention [2]
- Activities stored in Activity 360 (separate from core Salesforce)
- Cannot trigger automations based on captured activities
- Enhanced edition required for basic reporting capability
- Rule-based matching fails with duplicate accounts [1]

See Methodology for full tool comparison and data storage analysis.

---

### Phase 3 Guide: Enablement (Activity Capture Specifics)

#### The "Big Brother" Problem

The single biggest adoption risk for Activity Capture is the perception that management is surveilling reps. Address this head-on:

1. **Frame as burden removal:** "We're taking away 5+ hours of data entry per week" [3]
2. **Executive sponsor communicates first:** Before training, exec sends message: "We're implementing this to help you sell more, not to monitor you"
3. **Be transparent about visibility:** Tell reps exactly who can see what. No surprises.
4. **Show the coaching benefit:** Demonstrate how activity data helps managers identify support needs, not punish low performers

#### Phased Rollout Pattern

Do NOT enable all users at once. Roll out in phases with 2-3 business days between each:

```
Phase 1: SDRs (highest email volume, catches matching issues fast)
    | monitor 2-3 days
Phase 2: AEs (more varied activity patterns, catches edge cases)
    | monitor 2-3 days
Phase 3: Leadership/Managers (lightest volume, enables dashboards)
```

This pattern catches configuration issues before they affect the full team. SDRs generate the highest activity volume, so problems surface fastest with them.

---

### Phase 4 Guide: Handoff (Activity Capture Specifics)

#### Why Monitoring Matters Post-Handoff

Activity capture systems fail silently. Unlike a broken workflow that generates errors, a broken sync just means activities stop appearing. No one notices until a manager asks "Why does this rep have zero activities this week?" and the answer is "OAuth token expired 3 weeks ago."

The monitoring dashboard is the single most important handoff deliverable. Walk the customer through it in detail. Make sure the RevOps admin checks it weekly for the first month, then monthly thereafter.

#### Common Post-Launch Failures

| Failure Mode | Symptom | Prevention |
|--------------|---------|-----------|
| OAuth token expiration | Individual user's activities stop syncing | Sync error monitoring alerts; runbook procedure |
| New hire not provisioned | New rep has zero captured activities | Monthly new user check in maintenance schedule |
| Competing integration re-enabled | Duplicate activities on records | Document disabled integrations; alert on re-enable |
| Domain list not updated | New client domain treated as personal | Quarterly domain review in maintenance schedule |
| Tool vendor sunset/migration | Entire system stops functioning | Annual tool re-evaluation in maintenance schedule |

---

## References

[1] EverReady - 5 Key Limitations of Salesforce Einstein Activity Capture

[2] Revenue Grid - Einstein Activity Capture vs Revenue Grid Comparison

[3] JVG Labs - How AI Eliminates the CRM Tax and Boosts Sales

[4] LinkPoint360 - 43 CRM Statistics for 2024

[5] Salesforce Ben - Complete Guide to Salesforce Activity Tracking

[6] Tech.co - 53 CRM Statistics: The 2025 Data You Need