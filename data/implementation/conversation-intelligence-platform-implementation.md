# Conversation Intelligence Platform Implementation — Implementation

## Project One-Pager

### Conversation Intelligence Platform Implementation One-Pager

#### Project Type

- **Category:** Technical
- **Primary Deliverable:** Fully deployed conversation intelligence platform integrated with CRM and video conferencing, with configured trackers, coaching scorecards, dashboards, and trained GTM team actively using the system.

##### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Med | Requirements gathering, platform selection, success criteria |
| 2. Engineering | Yes | Heavy | Platform config, CRM integration, tracker setup, dashboards |
| 3. Enablement | Yes | Heavy | Role-based training, adoption drive, coaching workflow setup |
| 4. Handoff | Yes | Med | Admin training, maintenance schedule, ongoing tracker tuning |

#### Phase Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. STRATEGY  │────>│ 2. ENGINEER  │────>│3. ENABLEMENT │────>│  4. HANDOFF  │
│   Medium     │     │    Heavy     │     │    Heavy     │     │   Medium     │
│ 1a->1b->1c->1d│    │ 2a->2b->2c->2d│   │ 3a->3b->3c->3d│   │ 4a->4b->4c->4d│
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
   Requirements &       Platform config,    Champion rollout,    Admin handoff,
   platform selection   CRM integration,    full team training,  maintenance plan,
   + success criteria   trackers & alerts   coaching workflows   ongoing tuning
```

**This project's flow:**

- Full 4-phase. Medium strategy (requirements + vendor selection may already be done), heavy engineering (platform configuration, CRM integration, tracker setup), heavy enablement (adoption is the primary risk), medium handoff.
- If vendor is already selected, Phase 1 compresses. Platform selection steps (1c vendor demos) become optional.
- Enablement is critical: 80%+ adoption within 30 days is the target. Without active adoption efforts, the platform becomes shelf-ware. Sales reps spend only "28-30% of their time actually selling," and conversation intelligence aims to reduce administrative burden while adding coaching value.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Complete intake form covering: current recording tools, CRM type, team size, video conferencing platform, compliance requirements
- Provide CRM admin access credentials (Salesforce or HubSpot)
- Confirm executive sponsorship and legal/compliance review of recording consent
- Provide list of users to license by role (reps, managers, executives)
- Document sales methodology in use (MEDDIC, BANT, SPICED, etc.)
- List top competitors and key topics/objections to track

##### Track B: Architect Prep

- Audit current state of conversation visibility (what percentage of calls are recorded/reviewed today)
- Pull CRM data to assess manual note-taking burden and field completion rates
- Research recording consent requirements for client's operating states/countries
- Draft platform evaluation scorecard if vendor not yet selected
- Prepare v0 requirements document with recommended configuration approach

#### Refinement Loop (1b -> 1c -> 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present requirements, validate use cases | VP Sales, RevOps, IT | Confirmed requirements for v1 |
| Vendor Demo | 1c | Evaluate shortlisted platforms (if needed) | RevOps, Sales Mgr, IT | Platform selection |
| Config Plan | 1c | Review integration plan, tracker design | RevOps, CRM Admin | Approved config spec |
| Sign-Off | 1d | Approve platform, timeline, success KPIs | All stakeholders | Go/no-go for engineering |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held, use cases confirmed
- 1c. Platform selected (or confirmed), configuration plan approved
- 1d. Success criteria signed off, compliance review complete

##### Phase 2: Engineering

- 2a. Tech spec created (platform config, CRM field mapping, tracker design)
- 2b. Engineering handoff meeting held with CRM admin
- 2c. Platform configured: org structure, recording settings, CRM integration, trackers
- 2d. QA/Test: recording quality verified, CRM sync validated, trackers tested

##### Phase 3: Enablement

- 3a. Training materials prepped (role-specific guides, quick-start docs)
- 3b. Champion pilot (10-15 users) + full team training sessions delivered
- 3c. Hypercare period complete (30 days active adoption support)
- 3d. Enablement sign-off (80%+ weekly active users)

##### Phase 4: Handoff

- 4a. Maintenance schedule documented (tracker tuning, user management, reporting)
- 4b. Internal handoff (SME -> Architect) complete
- 4c. External handoff complete with admin training
- 4d. Project closed and archived

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| Requirements intake form | Capture use cases, tech stack, compliance needs | All fields filled, stakeholders agree |
| Platform evaluation scorecard | Compare vendors against weighted criteria | Vendor selected with TCO analysis |
| CRM field mapping document | Map CIP data to CRM objects and fields | All fields mapped, matching rules set |
| Tracker design document | Define keyword trackers, topics, alert rules | 10-15 high-value trackers configured |
| Coaching scorecard template | Define scoring criteria aligned to methodology | Approved by sales leadership |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| Configuration documentation | CRM mapping + tracker design | Ongoing admin reference |
| Role-based training guides | Requirements + built platform | Onboarding new users |
| Coaching workflow playbook | Scorecard + coaching sessions | Manager coaching cadence |
| Dashboard & reporting guide | Configured dashboards | Interpreting platform insights |
| Admin runbook | All config docs | Self-managing platform post-handoff |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Rep Training | Sales Reps, SDRs/BDRs | Reviewing own calls, finding competitive intel, sharing | 45 min |
| Manager | Sales Managers, Team Leads | Coaching workflows, scorecards, dashboards, call review | 60 min |
| Executive | VP Sales, CRO, CMO | Executive dashboards, deal risk signals, trend analysis | 30 min |
| Technical | RevOps, CRM Admin | Platform admin, tracker management, user provisioning | 90 min |
| Marketing/CS | Marketing, CS Managers | Competitive intel feeds, churn signals, product feedback | 30 min |

##### Hypercare

- **Applies:** Yes
- **Duration:** 4 weeks (30-day adoption sprint)
- **Office Hours:** Yes -- weekly 30-min slot for first 4 weeks

##### Training Assets to Create

- Video walkthrough: Platform overview and navigation
- Video walkthrough: How to review and share call snippets
- Video walkthrough: Manager coaching workflow (finding coachable moments, leaving comments)
- Video walkthrough: Executive dashboard interpretation
- Doc: Quick-start guide by role (Rep, Manager, Executive)
- Doc: Privacy/compliance guidelines (what is recorded, who can see what)
- Doc: Tracker management guide (adding/editing/removing trackers)
- Doc: CRM integration field reference

#### Handoff & Retention

##### Internal Handoff (SME -> Architect)

- Key context for Architect: Platform type selected, CRM integration details, compliance settings, key stakeholder contacts, adoption metrics at handoff
- Escalation trigger: CRM sync failures, tracker overhaul requests, structural configuration changes, new team/department rollouts

##### External Handoff

- Final meeting agenda: Review adoption metrics, walk through admin runbook, demonstrate maintenance tasks, confirm support channels
- Documentation package: All video walkthroughs, admin runbook, configuration documentation, coaching workflow playbook, FAQ doc

##### Maintenance Schedule

- **Monthly:** Review tracker accuracy, user provisioning for new hires/departures, sync health check
- **Quarterly:** Full tracker audit, dashboard refresh, adoption metrics review, coaching scorecard calibration
- **Who owns:** Single project = customer RevOps owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services (ongoing tracker optimization, reporting builds, adoption campaigns) -> if no -> Downsell: Related project (Sales Enablement Platform, Forecasting Process) -> Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~3 months post-launch
- Decision: Architect handles routine optimization / SME needed for structural changes

#### Key Assets

| Asset | Format | When Used |
|-------|--------|-----------|
| Requirements intake form | Google Form | 1a Pre-Kickoff |
| Platform evaluation scorecard | Google Sheet | 1c Vendor evaluation |
| CRM field mapping template | Google Sheet | 2a Tech Spec |
| Tracker design template | Google Doc | 2c Build |
| Coaching scorecard template | Google Doc | 3a Training Prep |
| Admin runbook template | Google Doc | 4c External Handoff |

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| Conversation Intelligence | AI-powered recording, transcription, and analysis of sales/customer conversations |
| Tracker | Keyword or AI topic detector that flags mentions of competitors, objections, pricing, etc. |
| Coaching Scorecard | Structured rubric for evaluating call quality against sales methodology criteria |
| Talk-to-Listen Ratio | Percentage of time the rep speaks vs. listens during a call (ideal: 40-60% talk) |
| Deal Board | Visual pipeline view enriched with conversation signals and engagement scores |
| CRM Sync | Bidirectional data flow between CIP and CRM, linking conversations to accounts/opportunities |
| Recording Consent | Legal requirement to notify/obtain permission before recording; varies by jurisdiction (one-party vs two-party) |
| Engagement Score | Platform-calculated metric reflecting buyer participation, question asking, and sentiment |

#### Common Gotchas

- Dedicated CRM integration user not created -> individual leaves, integration breaks. Always use a service account.
- Recording consent misconfigured -> legal risk in two-party consent states (CA, FL, IL, etc.). Verify state-by-state requirements before launch.
- Too many trackers at launch -> noise overwhelms users, they stop checking. Start with 10-15 high-value trackers, expand later.
- Managers not trained before reps -> reps have no one to model behavior from. Always train managers first.
- Bot joins meetings before host -> awkward customer experience. Configure bot to join 30-60 seconds after meeting starts.
- CRM matching rules too loose -> conversations linked to wrong accounts. Spend extra time testing matching logic with sample calls.

#### Methodology Options (if applicable)

| Option | When to Use | Complexity |
|--------|-------------|-----------|
| MEDDIC Scorecards | Enterprise sales with complex buying committees | High |
| BANT Scorecards | SMB/mid-market with shorter sales cycles | Low |
| SPICED Scorecards | Customer success-oriented deal qualification | Medium |
| Custom Scorecards | Proprietary sales methodology already in use | Variable |

---

## Phase 1: Strategy

> **Goal:** Get stakeholder sign-off on platform choice, configuration plan, and success criteria.
>
> **Output:** Approved requirements document + platform selection + success KPIs with baselines.

### 1a. Pre-Kickoff

> Two parallel tracks run before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video | Explain what CIP is, how it transforms coaching | Video (5-10 min) |
| Definition Alignment Document | Get sign-off on key terms (tracker, scorecard, etc.) | Google Doc |
| Pre-filled intake form | Capture tech stack, team size, compliance needs | Google Form |

**Intake form captures:**

- Current CRM (Salesforce or HubSpot) and admin access confirmation
- Video conferencing platform (Zoom, Teams, Google Meet)
- Phone/dialer system (Outreach, Salesloft, RingCentral, Aircall, or none)
- Team size by role (reps, managers, executives)
- Sales methodology in use (MEDDIC, BANT, SPICED, custom)
- Top 5-10 competitors to track
- Common objections and topics to monitor
- Recording consent status (legal review done? operating states/countries?)
- Current coaching practices (frequency, format, tools used)
- Primary use cases prioritized (coaching, deal risk, competitive intel, customer feedback)

**Completion tracking:** RevOps or project sponsor follows up. Do not cancel kickoff if incomplete, but push hard -- incomplete intake means ASSUMED values in v0.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Pull CRM data (field completion rates, activity logs) | Baseline metrics for key KPIs |
| 2 | Research recording consent requirements for client's states | Compliance configuration plan |
| 3 | Audit current conversation capture (what's recorded today) | Gap analysis (% calls unrecorded) |
| 4 | Draft use case matrix and recommended tracker categories | v0 requirements document |
| 5 | If vendor not selected: prepare evaluation scorecard | Platform comparison framework |

**Recording consent research:** Map all states/countries where client operates. Approximately "13 U.S. states require two-party (all-party) consent," including California, Florida, Illinois, and Pennsylvania. Default to two-party consent configuration when in doubt -- the CIP bot announces recording at meeting start.

**Critical:** Mark everything as ASSUMED. The kickoff call validates.

#### Stakeholder Alignment Document

> Get stakeholder sign-off on terms BEFORE configuring anything.

| Term | Our Definition | Internally Approved? |
|------|----------------|----------------------|
| Conversation Intelligence | AI recording + transcription + analysis of customer-facing calls | [ ] Yes / [ ] No |
| Tracker | Keyword/AI detector that flags competitor mentions, objections, pricing talk | [ ] Yes / [ ] No |
| Coaching Scorecard | Structured rubric for call quality based on your sales methodology | [ ] Yes / [ ] No |
| Deal Risk Signal | Platform-identified indicator that a deal may be stalling or at risk | [ ] Yes / [ ] No |
| Recording Consent | Legal notification/permission before recording; configuration approach agreed | [ ] Yes / [ ] No |
| Success Criteria | Specific KPIs with baselines and targets for measuring implementation success | [ ] Yes / [ ] No |

**Instructions to customer:**

> Review each definition with your leadership team. Check "Yes" when approved. We cannot proceed to platform configuration until recording consent approach and success criteria are aligned.

---

### 1b. Kickoff Call

> **Purpose:** Present v0 requirements and get alignment on use cases, platform choice, and success criteria. We walk in with a drafted configuration plan -- customer reacts, not creates from scratch.

#### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through v0 requirements | "Here's what we built from your intake form" |
| 15-30 | Validate use cases | Rank primary use cases: coaching, deal risk, competitive, feedback |
| 30-40 | Recording consent plan | Review compliance approach, confirm announcement settings |
| 40-50 | Define success KPIs | Agree on 3-5 measurable KPIs with baselines and targets |
| 50-60 | Platform discussion | Confirm vendor (if selected) or schedule vendor demos |
| 60+ | Next steps | Assign homework, schedule next meeting |

#### What We Bring

- v0 requirements document with use case matrix
- Recording consent compliance plan
- CRM data analysis (current field completion rates, manual logging burden)
- Platform evaluation scorecard (if vendor not yet selected)
- Definition Alignment Document (pre-filled)

#### What We Leave With

- Confirmed use cases and priority ranking
- Validated compliance approach
- Baseline metrics for KPIs (or clear assignments to pull them)
- Platform confirmed or demo schedule set
- Alignment loop scheduled

---

### 1c. Alignment Loop & Strategic Meeting Cadence

> **Purpose:** Finalize platform selection (if needed) and approve configuration plan.

#### The Pattern

```
Kickoff Call (requirements + use cases)
    |
    v
Vendor Demos (if needed) -> Platform Selected
    |
    v
Config Plan Review -> Approved tech spec
    |
    v
Sign-Off -> Proceed to Engineering
```

#### Meeting Types for This Project

| Meeting Type | Focus | Stakeholder | When |
|--------------|-------|-------------|------|
| Vendor Demo | Evaluate 2-3 platforms against scorecard (if not pre-selected) | RevOps, Sales Mgr, IT | Week 1-2 (2-4 week pilot) |
| Config Plan Review | CRM integration plan, tracker design, scorecard criteria | RevOps, CRM Admin | After platform selected |
| Compliance Review | Recording consent settings, data retention, security | IT, Legal | Parallel with config plan |
| Final Review | Full configuration spec walkthrough, timeline, resource plan | All stakeholders | Before engineering starts |

#### Platform Evaluation (if vendor not selected)

Create evaluation scorecard based on requirements. Key criteria:

| Criteria | Weight | Gong | Chorus (ZoomInfo) | Clari Copilot | Jiminny |
|----------|--------|------|-------------------|---------------|---------|
| CRM native integration | 25% | Score | Score | Score | Score |
| AI insight quality | 20% | Score | Score | Score | Score |
| Coaching features | 15% | Score | Score | Score | Score |
| Security/compliance | 15% | Score | Score | Score | Score |
| Ease of admin/maintenance | 10% | Score | Score | Score | Score |
| Video/phone integrations | 10% | Score | Score | Score | Score |
| Pricing (TCO) | 5% | Score | Score | Score | Score |

**Pilot approach:** 2-4 week pilot with 5-10 users (mix of reps and managers). Evaluate on: recording quality, transcription accuracy, insight value, ease of use, CRM sync reliability.

Gong and Chorus alone account for over "25% of all enterprise deployments," making them the default shortlist for most B2B SaaS companies. However, Clari Copilot and Jiminny offer competitive alternatives at lower price points for mid-market.

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 3-5 days |
| Kickoff call | Day 1 of engagement |
| Vendor evaluation | 2-4 weeks (if needed) |
| Config plan approval | 1-2 weeks after vendor selected |
| Sign-off | When all inputs confirmed |

---

### 1d. Strategic Sign-Off

> **Purpose:** Confirm we have everything before proceeding to platform configuration.

#### Validation Checkpoint

- Definition Alignment Document signed off
- Platform selected and contract signed (or confirmed if pre-existing)
- Recording consent approach approved by Legal/IT
- CRM admin access confirmed and tested
- Video conferencing admin access confirmed
- Success KPIs defined with baselines:
  - Manager call review activity (baseline: \_\_\_ reviews/month, target: 3-5 per rep/month)
  - User adoption rate (target: 80%+ weekly active by day 30)
  - Win rate improvement (target: 10-15% within 6 months)
  - New hire ramp time (target: 25-30% reduction)
  - CRM data quality (target: 50%+ reduction in empty Next Steps fields)
- User list finalized by role with permission levels
- Tracker categories and coaching scorecard criteria approved
- No blockers for engineering

#### Decision Point

- **Proceed to Engineering** -> Platform selected, requirements approved, access confirmed
- **Hold for vendor selection** -> Need more time evaluating platforms or awaiting contract

---

## Phase 2: Engineering

> **Goal:** Configure the conversation intelligence platform, integrate with CRM and communication tools, and set up trackers, scorecards, and dashboards.
>
> **Output:** Fully configured platform with verified recording, transcription, CRM sync, trackers, and dashboards.

**Project Profile:**

| Engineering Weight | Notes |
|-------------------|-------|
| Heavy (50-60%) | Multi-system integration: CIP + CRM + video + phone + alerts |

### Sub-Phases

```
2a Tech Spec -> 2b Engineering Handoff -> 2c Build -> 2d Test
```

---

### 2a. Tech Spec

> **Purpose:** Translate approved requirements into technical configuration specifications.

**Input:** Signed-off requirements document, platform selection, user list, tracker categories

**What happens:**

1. Map organizational hierarchy to platform structure (teams, managers, reporting lines)
2. Define CRM integration specification (field mapping, matching rules, sync direction)
3. Design tracker configuration (keyword lists, AI topic categories, alert rules)
4. Define coaching scorecard criteria aligned to sales methodology
5. Specify dashboard requirements by role

**Output:** Technical configuration spec containing:

**Platform setup:**
- Workspace settings
- Recording consent configuration
- Data retention policies
- Language/transcription settings

**CRM integration spec:**
- Dedicated integration user (service account -- never use a personal account)
- Object mapping: Conversations -> Accounts, Contacts, Opportunities
- Field write-back config: Call summaries, Next Steps, Competitor Mentions, Key Topics to CRM fields
- Matching rules: Email-to-Contact matching, calendar-to-Opportunity linking

**Communication integrations:**
- Video platform (Zoom/Teams/Meet)
- Calendar
- Phone/dialer

**Tracker design:**
- Competitor trackers (name variants, product names, comparisons)
- Objection trackers (pricing pushback, timeline delays, authority questions)
- Methodology trackers (MEDDIC criteria mentioned, BANT qualification steps)
- Risk signal trackers (churn language, escalation requests, competitor evaluations)
- Feature request trackers (product feedback, integration asks)

**Coaching scorecard spec:**
- Criteria
- Weights
- Scoring scale
- Methodology alignment

**Dashboard specs:**
- Executive view
- Manager view
- Marketing/CS view
- Automated report schedules

**Bot/notetaker settings:**
- Join timing (30-60 sec after start)
- Display name
- Participant announcement text

---

### 2b. Engineering Handoff

> **Purpose:** Review tech spec with CRM admin before building.

**Who attends:** Architect + CRM Admin + IT (for integration approvals)

**Agenda (45-60 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Platform config overview | Walk through workspace settings, recording consent plan |
| 15-30 | CRM integration detail | Review field mapping, matching rules, sync direction |
| 30-45 | Tracker and scorecard | Review tracker categories, coaching scorecard criteria |
| 45-60 | Timeline and dependencies | Confirm who builds what, integration approval process |

**What Architect brings:**

- Technical configuration spec (from 2a)
- CRM field inventory (existing fields to map to or create)
- Recording consent requirements by state/country
- Questions list (API limits, integration user setup, security approvals)

**What CRM admin leaves with:**

- Approved tech spec
- Clear list of CRM changes needed (new fields, updated layouts)
- Integration user setup instructions
- Build sequence and timeline

---

### 2c. Build (Configure)

> **Purpose:** Configure the conversation intelligence platform and all integrations.

**Input:** Approved tech spec from 2b

**Build sequence:**

| Order | Component | System | Estimated Effort |
|-------|-----------|--------|------------------|
| 1 | Platform account + workspace setup | CIP | 2-4 hours |
| 2 | Org hierarchy + user provisioning | CIP | 2-4 hours |
| 3 | Recording consent configuration | CIP | 1-2 hours |
| 4 | Video conferencing integration | CIP + Zoom/Teams | 2-4 hours |
| 5 | Calendar integration | CIP + Calendar | 1-2 hours |
| 6 | Phone/dialer integration | CIP + Dialer | 2-4 hours |
| 7 | CRM integration (dedicated user) | CIP + CRM | 4-8 hours |
| 8 | CRM field mapping + matching rules | CIP + CRM | 4-8 hours |
| 9 | Keyword trackers + AI topics | CIP | 4-6 hours |
| 10 | Coaching scorecards | CIP | 2-4 hours |
| 11 | Automated alerts | CIP | 1-2 hours |
| 12 | Dashboards + reports | CIP | 4-8 hours |
| 13 | Data retention policies | CIP | 1 hour |

**Total estimated build effort:** 30-55 hours

**CRM integration critical steps (Salesforce/HubSpot):**

1. Create dedicated integration user in CRM (service account with API access)
2. Authorize OAuth connection between CIP and CRM
3. Import CRM objects: Accounts, Contacts, Opportunities, Leads
4. Configure field write-back: Call Summary, Next Steps, Key Topics, Competitor Mentions
5. Set up matching rules: link conversations to correct CRM records via email, calendar event, or opportunity
6. Create new CRM fields if needed (e.g., "Last Conversation Date," "Engagement Score," "Deal Risk Level")
7. Test with 5-10 sample conversations across different scenarios

**Tracker configuration guidelines:**

Start with 10-15 high-value trackers. Over-engineering trackers is one of the most common implementation mistakes -- dozens of keyword trackers generate noise requiring significant ongoing maintenance. Use AI topic detection (available in Gong, Chorus) rather than relying solely on exact keyword matches.

| Tracker Category | Example Phrases/Topics | Alert To |
|------------------|------------------------|----------|
| Competitors | "[Competitor A]," "[Competitor B]," "other vendors," "evaluating" | Sales Mgr |
| Pricing objections | "too expensive," "over budget," "need discount," "pricing" | Sales Mgr |
| Next steps | "next steps," "follow up," "action items," "schedule" | Rep (self) |
| Churn signals | "cancel," "not renewing," "looking at alternatives," "frustrated" | CS Mgr |
| Feature requests | "wish it could," "feature request," "roadmap," "missing" | Product |
| Legal/escalation | "legal," "escalate," "contract issue," "compliance" | Sales Mgr |
| Methodology (MEDDIC) | "decision maker," "economic buyer," "timeline," "metrics" | Sales Mgr |

**Build tracking:**

- Component 1: Platform account and workspace
- Component 2: Org hierarchy and users
- Component 3: Recording consent
- Component 4: Video conferencing
- Component 5: Calendar integration
- Component 6: Phone/dialer
- Component 7: CRM connection
- Component 8: CRM field mapping
- Component 9: Trackers and topics
- Component 10: Coaching scorecards
- Component 11: Alerts
- Component 12: Dashboards and reports
- Component 13: Data retention

---

### 2d. QA / Test + Sign-Off

> **Purpose:** Verify all integrations work and platform is ready for users.

**Two types of testing:**

| Type | Who | Purpose |
|------|-----|---------|
| Technical Testing | Our team | Verify integrations, data flow, tracker accuracy |
| Customer Testing | Customer | Verify it meets their use cases, data looks correct |

**Technical testing checklist:**

- Recording works on all configured platforms (Zoom, Teams, Meet)
- Recording consent announcement plays/displays correctly
- Transcription quality is acceptable (spot-check 5+ calls)
- Speaker identification works (reps vs. prospects correctly labeled)
- CRM sync: conversations link to correct Account/Contact/Opportunity
- CRM field write-back: summary, next steps, key topics populate correctly
- No duplicate records created in CRM
- Trackers fire on expected keywords/topics (test with sample calls)
- Coaching scorecards display correctly and criteria match methodology
- Dashboards render with correct data (manager view, executive view)
- Automated alerts trigger and deliver to correct recipients
- User permissions work correctly (reps see own calls, managers see team)
- Bot join timing is appropriate (not joining before host)
- Data retention policies applied correctly

**Customer testing:**

- Walk CRM admin through integration settings and sync logs
- Have a sales manager review 2-3 real calls using coaching scorecard
- Have a rep search for a specific topic or competitor mention
- Verify executive dashboard shows meaningful data
- Test edge cases: internal-only meeting (should not record), declined meeting, multi-party call

**Engineering sign-off checkpoint:**

- All integrations connected and syncing
- Recording quality verified across all channels
- CRM data accuracy confirmed (>95% correct matching)
- Trackers tested and refined
- Dashboards approved by stakeholders
- Ready for champion pilot

**Decision point:**

- **Proceed to Enablement** -> Platform configured, tested, and approved
- **Loop back to Build** -> Integration issues, tracker inaccuracy, or data quality problems

---

## Phase 3: Enablement

> **Goal:** Drive 80%+ adoption within 30 days through champion pilot, role-based training, coaching workflow establishment, and active adoption management.
>
> **Output:** Trained GTM team actively using the platform for coaching, deal review, and competitive intelligence. Established coaching workflows. No critical issues.

### Sub-Phases

```
3a Training Prep -> 3b Training Sessions -> 3c Hypercare -> 3d Enablement Sign-Off
```

---

### 3a. Training Prep

> **Purpose:** Create role-specific training materials from configuration documentation and platform.

**Input:** Technical configuration spec + built platform + coaching scorecard + dashboard designs

**Output:** Training package containing:

- **Rep training guide:** How to review own calls, find competitive intel, share snippets, use AI summaries for CRM updates
- **Manager training guide:** How to find coachable moments, use scorecards, run coaching 1:1s with call data, track team metrics
- **Executive guide:** How to read dashboards, interpret deal risk signals, use trending data for forecast calls
- **Admin guide:** User provisioning, tracker updates, integration health monitoring, troubleshooting common issues
- **Marketing/CS guide:** Accessing competitive intel feeds, monitoring churn signals, finding product feedback
- **FAQ document:** Addressing privacy concerns ("Am I being watched?"), access controls, data retention, best practices
- **"Day in the life" examples:** What each role's first 10 minutes in the platform look like

**Critical messaging point:** Position as coaching and enablement, NOT surveillance. Research shows "81% of sales organizations now use AI in coaching," with a direct correlation to revenue growth ("83% vs. 66% for non-adopters"). Frame accordingly: "This helps you win more deals" for reps, "This makes you a better coach in less time" for managers.

---

### 3b. Training Sessions

> **Purpose:** Transfer knowledge to customer team through champion pilot and full rollout.

**Phase 3b runs in two stages:**

#### Stage 1: Champion Pilot (2 weeks)

Select 10-15 champions across teams (mix of enthusiastic and influential users -- include at least 2-3 managers).

| Activity | Timing | Purpose |
|----------|--------|---------|
| Champion kickoff training | Day 1 | 60-90 min live session with full platform walkthrough |
| White-glove support | Days 1-14 | Daily check-ins, immediate issue resolution |
| Feedback collection | Day 7 + Day 14 | Survey + interviews on config, usability, value |
| Config iteration | Days 7-14 | Refine trackers, alerts, and workflows from feedback |
| Identify adoption blockers | Ongoing | Surface and address "surveillance" perception early |

**Champion selection criteria:**

- Mix of top performers and average performers (not just power users)
- At least 2 managers who will coach using the tool
- Representatives from each team/department being rolled out to
- At least 1 skeptic (if they convert, they become the most credible advocate)

#### Stage 2: Full Team Rollout

| Session | Audience | Duration | Focus |
|---------|----------|----------|-------|
| Manager training | All sales managers | 60 min | Coaching workflows, scorecards, team dashboards |
| Rep training (sales) | AEs, SDRs/BDRs | 45 min | Call review, snippets, competitive intel, AI notes |
| Rep training (CS) | CSMs, Account Managers | 45 min | Churn signals, expansion cues, account health |
| Executive briefing | VP Sales, CRO, CMO | 30 min | Dashboards, deal risk, strategic insights |
| Marketing briefing | Product Marketing, Demand Gen | 30 min | Competitive intel, messaging effectiveness |
| Admin deep-dive | RevOps, CRM Admin | 90 min | Full admin capabilities, troubleshooting |

**Training delivery principles:**

- Train managers BEFORE reps (managers model behavior and answer questions)
- Use real examples from champion pilot (anonymized if needed) to demonstrate value
- Show reps a "quick win" in the first session (find competitive intel on a recent deal, see AI-generated call summary)
- Record all sessions as video walkthroughs for async learners and future new hires
- Set up a shared channel for questions and tips
- Establish usage expectations: managers review 3-5 calls per rep per month, reps review 1 own call per week

---

### 3c. Hypercare

> **Purpose:** 30-day intensive adoption sprint to establish habits before users disengage.

**Duration:** 4 weeks

**What happens:**

| Week | Activity | Metric Target |
|------|----------|----------------|
| 1 | Daily adoption tracking (logins, calls reviewed, comments) | 60%+ of users logged in |
| 2 | 1:1 outreach to non-adopters, "quick wins" campaign | 70%+ weekly active users |
| 3 | Manager coaching workflow launch (structured call reviews) | 75%+ weekly active, managers reviewing |
| 4 | Celebrate wins publicly, address remaining friction | 80%+ weekly active users |

**Adoption tracking metrics (daily in weeks 1-2, then weekly):**

- User logins (by role)
- Calls reviewed per user
- Comments/coaching notes left (by managers)
- Snippets shared
- Tracker alert engagement
- Dashboard views

**Adoption playbook:**

- **Non-adopters (not logged in after day 5):** 1:1 outreach with specific "try this" task relevant to their role
- **Low adopters (logged in but not engaging):** Pair with champion for a 15-min walkthrough of their actual recent calls
- **Managers not coaching:** Schedule 1:1 with sales leader to review coaching workflow and set expectations
- **Quick wins to drive engagement:** Help a manager find a coaching moment from a recent lost deal. Help a rep find competitive intel from a prospect call. Show executive a deal risk signal that matches their intuition.

**Weekly office hours:** 30-min open slot where anyone can join with questions or issues. Record and post for async review.

**When to skip:** Hypercare should NOT be skipped for this project type. Adoption is the primary risk. Without active 30-day adoption management, conversation intelligence platforms become shelf-ware within 60 days.

---

### 3d. Enablement Sign-Off

> **Purpose:** Confirm adoption targets are met and customer can operate independently.

**Validation checkpoint:**

- All training sessions delivered (rep, manager, executive, admin)
- Training recordings and documentation provided
- Champion pilot feedback incorporated into configuration
- 80%+ of licensed users logging in weekly
- Managers actively reviewing calls and leaving coaching comments
- Coaching workflow established (regular call review cadence)
- No critical integration issues outstanding
- Customer admin can provision users and update trackers
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** -> Adoption targets met, no critical issues, admin team trained
- **Extend Hypercare** -> Adoption below 70%, managers not coaching, integration instability

---

## Phase 4: Handoff

> **Goal:** Clean project close with maintenance plan established, admin team independent, and retention/expansion path set.
>
> **Output:** Maintenance schedule documented, internal context transferred, customer owns the system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule -> 4b Internal Handoff -> 4c External Handoff -> 4d Project Close
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|---------------------|---------------|
| Single Project | Customer owns | 4c (External Handoff) |
| Dedicated (Multi-Project) | Architect owns | 4b (Internal Handoff) |

---

### 4a. Maintenance Schedule

> **Purpose:** Document what needs ongoing attention after implementation -- tracker tuning, user management, adoption monitoring, and integration health.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|--------------------|
| User provisioning | New hires added, departures removed, roles updated | >5 unlicensed active users |
| Tracker accuracy review | Sample 10 tracker hits: are they relevant or noise? | >30% false positive rate on any tracker |
| CRM sync health check | Integration status, sync errors, matching accuracy | >5 sync errors in a month, or integration down |
| Adoption metrics | Weekly active users, calls reviewed, coaching activity | Adoption drops below 70% |
| Recording quality spot-check | Transcription accuracy, speaker ID correctness | Consistent transcription errors on a platform |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|----------------|-------------------|
| Full tracker audit | All trackers: relevance, accuracy, coverage | Archive low-value trackers, add new categories |
| Coaching scorecard calibration | Are scorecard criteria still aligned to methodology? | Update criteria, retrain managers if changed |
| Dashboard and report refresh | Are stakeholders using dashboards? Any new needs? | Add/modify dashboards, retire unused ones |
| KPI progress review | Win rate, ramp time, CRM data quality vs. baselines | Adjust configuration, expand tracker coverage |
| Competitor tracker update | New competitors emerged? Old ones irrelevant? | Add new competitor trackers, archive outdated |

**After First Business Cycle (60-90 days post-launch):**

- Adoption validation: Has weekly active usage stabilized above 80%?
- Coaching impact check: Are managers actually changing behavior based on call insights?
- KPI first look: Any early signal on win rate, ramp time, or CRM data quality improvement?
- Tracker ROI: Which trackers are generating the most actionable insights? Which are pure noise?
- Key question: Is the platform changing behavior, or just generating data no one acts on?

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Adoption decline | Drops below 60% weekly active | Re-run adoption sprint, diagnose root cause |
| Manager coaching stops | <1 call review per rep per month | Manager re-training, escalate to VP Sales |
| CRM sync breaks | Integration disconnected >24 hours | Emergency troubleshoot, verify integration user |
| New team/department rollout | New team >10 users needs onboarding | Scope mini-enablement project |
| Platform migration | Switching CIP vendors | Scope new implementation project |

**Every 6-12 Months:**

- Full platform health assessment: integrations, tracker library, scorecard criteria, dashboard utilization
- Vendor relationship review: contract terms, feature roadmap, pricing changes
- Coaching program evolution: advanced coaching scenarios, peer coaching enablement, call library curation
- Cross-functional expansion: evaluate use cases for marketing, CS, product that are not yet active

---

### 4b. Internal Handoff (SME -> Architect)

> **Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- Platform selected and key configuration choices (recording consent approach, tracker philosophy)
- CRM integration details (dedicated user, field mapping, matching rules)
- Customer context: key stakeholders (project sponsor, CRM admin, sales leader champion), adoption trajectory, outstanding issues
- Compliance configuration (two-party consent states, bot announcement settings)
- Common issues and how to resolve them (see troubleshooting scenarios below)
- When to escalate back to SME

**Escalation guidelines:**

| Issue Type | Who Handles |
|-----------|-------------|
| User provisioning, basic tracker edits | Architect or customer admin |
| CRM sync errors, integration reconnection | Customer admin (runbook) or Architect |
| Scorecard redesign, new methodology alignment | SME re-engagement |
| New department rollout (>10 users) | SME scopes mini-project |
| Platform migration or major reconfiguration | SME scopes new project |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing monthly/quarterly tasks. SME walks Architect through each task during handoff.

---

### 4c. External Handoff

> **Purpose:** Formal project completion with customer.

**Final project meeting (60 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Adoption metrics review | Present 30-day adoption data vs. targets |
| 15-30 | Admin runbook walkthrough | Demonstrate key admin tasks (user mgmt, trackers, sync) |
| 30-45 | Maintenance schedule review | Walk through monthly/quarterly tasks and red flag triggers |
| 45-55 | Open Q&A | Address remaining questions |
| 55-60 | Project close | Confirm project complete, establish support channels |

**Documentation package:**

- All training video walkthroughs (rep, manager, executive, admin)
- Admin runbook (user management, tracker updates, integration troubleshooting)
- Configuration documentation (all settings, field mappings, tracker definitions)
- Coaching workflow playbook (cadence, scorecard usage, best practices)
- FAQ document (privacy, access controls, troubleshooting)
- Definition Alignment Document (final version)
- Maintenance Schedule (for Single Project -- customer runs this themselves)
- KPI tracking dashboard (baseline vs. current performance)

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video walkthrough. Ensure CRM admin is confident managing: user provisioning, tracker updates, sync monitoring, and escalation to vendor support.

**Output:** Customer owns the system. Project formally complete.

---

### 4d. Project Close

> **Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved to proper location
- Handoff documentation complete
- Project status updated in tracking system
- Time/billing finalized
- Adoption metrics documented (30-day snapshot)

#### Internal Debrief (Optional but Recommended)

- What went well? (Champion pilot approach, tracker design, CRM integration)
- What would we do differently? (Timeline, stakeholder engagement, training format)
- Any learnings to feed back into SOPs or playbook? (New gotchas, better tracker templates)
- Recording consent complexity -- any new state/country edge cases?

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| Single Project | Upsell -> Downsell -> Retry |
| Multi-Project (Dedicated) | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (ongoing optimization, tracker tuning, adoption campaigns)
   |
   | if no
   v
2. Downsell: Related project (Sales Enablement Platform, Forecasting Process, Revenue Intelligence)
   |
   | if yes
   v
3. Retry retainer at end of next project cycle
```

**Script:**

> "Now that the conversation intelligence platform is live and your team is actively using it, there are two ways we can continue working together. Option 1: We handle ongoing optimization -- tracker tuning, adoption campaigns, new team rollouts, quarterly reviews. Option 2: If there's a specific next project, like connecting this data to your forecasting process or rolling out a sales enablement platform, we can scope that out. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

> "On [date ~3 months out], we'll review how the platform is performing -- adoption trends, tracker effectiveness, coaching impact -- and see if any adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull adoption data, KPI progress, tracker usage |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points. |

**At the refinement check-in:**

- Review adoption metrics (is usage sustained or declining?)
- Review KPI progress (win rate, ramp time, CRM data quality)
- Identify tracker optimization needs
- If minor: Architect handles tracker tuning, dashboard updates
- If major: Scope new project (new department rollout, platform migration, advanced analytics)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Requirements document with use case matrix and priority ranking
- Platform evaluation scorecard (if vendor selection was in scope)
- Recording consent compliance plan
- Success KPIs with baselines and targets
- Definition Alignment Document

**Technical Deliverables:**

- Configured conversation intelligence platform (Gong, Chorus, Clari Copilot, or Jiminny)
- CRM integration (Salesforce or HubSpot) with field mapping and matching rules
- Video conferencing and phone/dialer integrations
- 10-15 configured keyword trackers and AI topic categories
- Coaching scorecards aligned to sales methodology
- Role-specific dashboards (manager, executive, marketing/CS)
- Automated alert rules for critical mentions

**Documentation Package:**

- Training video walkthroughs (rep, manager, executive, admin, marketing/CS)
- Written quick-start guides by role
- Admin runbook (user management, tracker updates, integration troubleshooting)
- Coaching workflow playbook
- FAQ document (privacy, access, best practices)
- Configuration documentation (all settings reference)
- Maintenance Schedule
- Definition Alignment Document (final version)

---

## Troubleshooting Scenarios

> Common issues and their resolutions. Use in Phase 3 hypercare and Phase 4 handoff documentation.

| Scenario | Symptoms | Resolution |
|----------|----------|-----------|
| CRM integration disconnects | Conversations stop linking to CRM, sync errors in logs | Check dedicated integration user is active. Re-authorize OAuth. Verify API limits not exceeded. |
| Conversations link to wrong accounts | Call data appears on incorrect Account/Opportunity in CRM | Review matching rules. Tighten email-to-contact matching. Check for duplicate records in CRM. |
| Bot joins before host / awkward bot behavior | Customer sees "Gong Notetaker" before meeting starts | Adjust bot join delay to 45-60 seconds after scheduled start. Update bot display name. |
| Trackers generating too much noise | Alert fatigue, users ignoring tracker notifications | Reduce tracker count. Switch from keyword to AI topic detection. Add exclusion terms. |
| Low adoption after rollout | <60% weekly active users after 2 weeks | 1:1 outreach to non-adopters. Quick-win sessions. Manager accountability for call reviews. |
| Managers not coaching from call data | Manager dashboard unused, no coaching comments on calls | Retrain managers 1:1. Tie call review to existing coaching cadence. Get VP Sales mandate. |
| Reps perceive surveillance | Active resistance, complaints to management, low engagement | Reframe as coaching tool. Show reps their own insights. Have champions share success stories. |
| Transcription quality issues | Inaccurate transcripts, wrong speaker labels | Check audio quality. Verify language settings. Report to vendor support for model tuning. |
| Recording consent misconfigured | No announcement on calls in two-party consent states | Audit consent configuration. Enable bot announcement for all external meetings. Legal review. |
| Dashboards not showing data | Empty dashboards despite active recording | Check data processing lag (24-48 hrs typical). Verify user permissions. Check filter settings. |

---

## Appendix

### Roles

| Role | What They Do |
|------|-------------|
| **Architect** | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| **Engineer** | CRM build, automation, dashboards (Phase 2) |
| **SME** | Project/implementation team brought in for project-specific work |

### References

\[1\] [Salesforce - New Research Reveals Sales Reps Spend Less than 30% of Time Selling](https://www.salesforce.com/news/stories/sales-research-2023/)

\[2\] [Avoma - Call Recording Laws by State](https://www.avoma.com/blog/call-recording-laws)

\[3\] [Business Research Insights - Conversation Intelligence Platform Market Size](https://www.businessresearchinsights.com/market-reports/conversation-intelligence-platform-market-102311)

\[4\] [TRAQ AI - What ROI Should You Expect From Conversation Intelligence Software?](https://www.traq.ai/what-roi-should-you-expect-from-conversation-intelligence-software/)

\[5\] [Mindtickle - How Managers Can Use Conversation Intelligence for Sales](https://www.mindtickle.com/blog/how-managers-can-use-conversation-intelligence-mindtickle/)

\[6\] [Gong Help Center - Manage Your CRM API Integration](https://help.gong.io/docs/manage-your-crm-api-integration)

\[7\] [Hyperbound - 2026 Sales Coaching Benchmarks](https://www.hyperbound.ai/blog/sales-coaching-benchmarks-2026)