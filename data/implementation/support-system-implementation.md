# Support System Implementation — Implementation Guide

## Project One-Pager

### Project Type
- **Category:** Technical
- **Primary Deliverable:** Fully configured multi-channel support platform with ticketing workflows, SLA tracking, CRM integration, self-service help center, and reporting dashboards

### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Medium | Requirements gathering, platform selection, SLA definition |
| 2. Engineering | Yes | Heavy | Platform config, integrations, automations, knowledge base |
| 3. Enablement | Yes | Medium | Agent training, soft launch, full rollout |
| 4. Handoff | Yes | Medium | Admin runbooks, troubleshooting guide, maintenance schedule |

### Phase Overview

The project flows through four sequential phases:
1. **STRATEGY (Medium):** Requirements and platform selection
2. **ENGINEER (Heavy):** Platform configuration, integrations, knowledge base
3. **ENABLEMENT (Medium):** Agent training, staged rollout
4. **HANDOFF (Medium):** Admin runbooks, maintenance schedule

Phase 2 is the heaviest phase with most work focused on platform configuration, integrations, automations, and help center creation.

---

## Pre-Kickoff (1a)

### Track A: Customer Homework

- [ ] Complete support operations intake form (current channels, volume, team size, pain points)
- [ ] Provide 90-day support volume data from current inbox/system
- [ ] Confirm budget approval for platform licensing
- [ ] Provide admin access to CRM (Salesforce or HubSpot)
- [ ] Share brand guidelines (logo, colors, fonts) for platform customization
- [ ] Provide list of current support team members with roles

### Track B: Architect Prep

- [ ] Audit current support workflow from intake data and CRM access
- [ ] Pull ticket volume distribution and response time baselines
- [ ] Draft gap analysis (current state vs. desired capabilities)
- [ ] Prepare platform evaluation scorecard if selection not yet made
- [ ] Create v0 requirements document with ASSUMED values

---

## Refinement Loop (1b → 1c → 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present audit findings, validate requirements, demo v0 | VP CS, Head of Support, RevOps | Validated requirements for v1 |
| Refinement 1 | 1c | Review platform recommendation, SLA definitions, routing | VP CS, Head of Support | Approved platform + SLA targets |
| Refinement 2 | 1c | Integration mapping, knowledge base plan, rollout plan | Support Lead, RevOps, IT | Final requirements package |
| Sign-Off | 1d | Strategic approval on full implementation plan | All | Signed-off implementation package |

---

## Phase Checklists

### Phase 1: Strategy
- [ ] 1a. Pre-Kickoff complete (Track A + Track B)
- [ ] 1b. Kickoff call held — requirements validated
- [ ] 1c. Refinement loop complete — platform selected, SLAs defined, integrations scoped
- [ ] 1d. Strategic sign-off obtained

### Phase 2: Engineering
- [ ] 2a. Tech spec created (platform config, integration specs, automation rules)
- [ ] 2b. Engineering handoff meeting held
- [ ] 2c. Build complete (platform, channels, routing, SLAs, automations, integrations, help center)
- [ ] 2d. QA/Test + customer sign-off

### Phase 3: Enablement
- [ ] 3a. Training materials prepped (agent guide, admin runbook, video walkthrough scripts)
- [ ] 3b. Training sessions delivered (agents + supervisors)
- [ ] 3c. Hypercare period complete (soft launch → full rollout monitoring)
- [ ] 3d. Enablement sign-off

### Phase 4: Handoff
- [ ] 4a. Maintenance schedule documented and handed off
- [ ] 4b. Internal handoff (SME → Architect) complete
- [ ] 4c. External handoff (implementation team → Customer) complete
- [ ] 4d. Project closed and archived

---

## Document Types

### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| Support Operations Intake Form | Capture current state, pain points, requirements | All fields filled, reviewed in kickoff |
| Gap Analysis Table | Map current vs. desired capabilities | Gaps prioritized, approved by stakeholder |
| Platform Evaluation Scorecard | Compare Zendesk / Intercom / Freshdesk / etc. | Platform selected with stakeholder buy-in |
| Requirements Document | Channels, SLAs, integrations, user roles | All items CONFIRMED, signed off |
| Ticket Taxonomy Worksheet | Categories, priorities, custom fields, tags | Approved by support lead |
| Knowledge Base Content Plan | Article list targeting top ticket drivers | 20-30 articles identified, owners assigned |

### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|------------------|
| Current vs. Future State Diagram | Gap Analysis Table | Internal alignment, board presentation |
| SLA Policy Document | Requirements Document | Customer-facing SLA communication |
| Integration Architecture Map | Requirements + Tech Spec | IT team reference, ongoing maintenance |
| Agent Quick-Reference Guide | Training materials | Day-to-day agent operations |
| Admin Runbook | Configuration documentation | Ongoing system administration |

---

## Enablement Details

### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Leadership | VP CS, Head of Support | Dashboard interpretation, SLA reporting, CSAT trends | 30 min |
| Agent | Support Reps (Tier 1, Tier 2) | Ticket handling, macros, escalation, CRM context | 60-90 min |
| Technical | Support Ops Admin, RevOps | Platform admin, automation management, integration | 60 min |
| Supervisor | Team Leads | Queue management, SLA monitoring, agent performance | 45 min |

### Hypercare

- **Applies:** Yes
- **Duration:** 3 weeks (1 week soft launch + 2 weeks post-full-launch)
- **Office Hours:** Yes — daily 30-min slot for first week, then twice-weekly for weeks 2-3

### Training Assets to Create

- Video walkthrough: Ticket handling workflow (agent view)
- Video walkthrough: Dashboard and reporting overview (leadership view)
- Video walkthrough: Admin tasks (add user, update SLA, create macro)
- Doc: Agent quick-reference guide (macros, escalation paths, SLA expectations)
- Doc: Admin runbook (common admin tasks with step-by-step instructions)
- Doc: Integration troubleshooting guide

---

## Handoff & Retention

### Internal Handoff (SME → Architect)

- **Key context for Architect:** Platform configuration choices and rationale, integration architecture, SLA targets and current performance, common agent questions from training
- **Escalation trigger:** Any workflow/automation logic changes, new integration requests, SLA policy modifications, or platform upgrade decisions

### External Handoff (Implementation Team → Customer)

- **Final meeting agenda:** Review all delivered assets, walk through admin runbook, confirm support channels operational, hand over maintenance schedule
- **Documentation package:** All training recordings, admin runbook, agent guide, integration architecture map, SLA policy document, maintenance schedule

### Maintenance Schedule

- **Monthly:** SLA compliance review, automation effectiveness check, knowledge base gap analysis
- **Quarterly:** Full platform audit, integration health check, CSAT trend review
- **Who owns:** Single project = customer owns | Dedicated = Architect owns

### Retention/Expansion Path

**If Single Project:** 
Upsell managed services (ongoing optimization, reporting, knowledge base expansion) → if no → Downsell knowledge base expansion project or chatbot/AI enhancement → Retry retainer

**If Multi-Project (Dedicated):**
- Refinement check-in scheduled: ~8 weeks post-launch
- Internal prep trigger: 2 weeks before check-in
- Decision: Architect handles routine optimization / SME needed for workflow redesign or new integration

---

## Key Assets

| Asset | When Used |
|-------|-----------|
| Support Operations Intake | Pre-Kickoff (1a) |
| Platform Evaluation Scorecard | Strategy (1b-1c) |
| Requirements Document | Strategy (1c-1d) |
| Tech Spec | Engineering (2a) |
| Agent Quick-Reference Guide | Enablement (3b) |
| Admin Runbook | Handoff (4c) |

---

## Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| First Response Time | Time from ticket creation to first human reply (auto-acknowledgments do not count) |
| Resolution Time | Time from ticket creation to ticket marked as solved/closed |
| SLA Breach | When a ticket exceeds the defined response or resolution time target for its priority level |
| Ticket Deflection | A support inquiry resolved via self-service (knowledge base, chatbot) without creating a human-handled ticket |
| CSAT | Customer Satisfaction Score — post-resolution survey rating, typically on a 1-5 or 1-10 scale |
| Priority Level (P1-P4) | Severity classification: P1=System Down, P2=Major Impact, P3=Minor Impact, P4=General Question |
| Macro | Pre-written response template agents use for common ticket types to ensure consistency and speed |
| Escalation | Moving a ticket to a higher-tier agent, supervisor, or cross-functional team (e.g., Engineering for bugs) |
| Help Center | Customer-facing self-service portal with knowledge base articles, FAQ, and search |
| Ticket Routing | Automated assignment of tickets to the correct team or agent based on type, priority, or customer attributes |

---

## Common Gotchas

- **Over-engineering automations on day one** — teams build 30+ rules before understanding actual ticket patterns → Start with 5-10 core automations, add more after 30 days of real data

- **CRM integration only pulling basic contact info** — missing ARR, customer tier, or CSM assignment → Map all customer context fields upfront and test the agent sidebar view before launch

- **Launching help center with fewer than 15 articles** — expecting meaningful ticket deflection → Commit to 20-30 articles minimum at launch, targeting the top 10 ticket drivers from audit data. Companies with mature knowledge bases achieve "20-45% ticket deflection"

- **Selecting platform based on feature demos** — instead of actual requirements → Start with the requirements document, not vendor demos. Match platform complexity to team size and maturity

- **No SLA baseline before launch** → Measure current response/resolution times during the audit phase to set realistic targets and demonstrate improvement. "Satisfaction drops sharply beyond the 8-12 hour response window"

- **Forgetting to configure offline chat handling** — Set up offline message capture and auto-response for after-hours chat requests before go-live

---

## Methodology Options

| Option | When to Use | Complexity |
|--------|-------------|-----------|
| Simple (email-only) | <500 tickets/month, 1-3 agents, no live chat needed | Low |
| Standard (multi-channel) | 500-5000 tickets/month, 3-15 agents, email + chat + help center | Medium |
| Advanced (full omnichannel + AI) | 5000+ tickets/month, 15+ agents, all channels + AI bot + advanced routing | High |

---

## Phase 1: Strategy

**Goal:** Get stakeholder sign-off on what we're going to build — platform selection, SLA targets, integration scope, rollout plan.

**Output:** Signed-off requirements document + platform selection + SLA definitions + integration architecture.

### 1a. Pre-Kickoff

Two parallel tracks run before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video | Explain what a support system implementation involves | Video walkthrough (5-10 min) |
| Definition Alignment Document | Get stakeholder sign-off on support terminology (SLA, CSAT, FRT, etc.) | Google Doc |
| Support Operations Intake Form | Capture current channels, volume, team size, pain points, requirements | Google Form |

**What we include in the intake form:**

- Current support channels in use (email, chat, phone, social)
- Monthly ticket/email volume (last 90 days if available)
- Current team size and roles (Tier 1, Tier 2, specialized)
- Top 5 pain points in current support workflow
- CRM in use (Salesforce, HubSpot, other)
- Engineering project tool (Jira, Linear, other)
- Internal communication tool
- Existing knowledge base or FAQ content (if any)
- Budget range for platform licensing
- SSO/SAML requirements
- Brand guidelines location

**Completion tracking:** Follow up within 3 business days. Don't cancel kickoff if incomplete, but push hard — the audit quality depends on having real volume data.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Gather inputs (intake form, CRM access, current inbox/system access) | Raw data collected |
| 2 | Analyze support volume data (last 90 days of tickets/emails) | Volume distribution, peak times, categories |
| 3 | Document current response time averages and support workflow | Baseline metrics |
| 4 | Map current escalation paths (who handles what, how bugs reach engineering) | Escalation flow diagram |
| 5 | Produce gap analysis + draft requirements | Gap analysis v0, requirements v0 |

**Critical:** Mark everything as ASSUMED. The kickoff call validates.

#### Stakeholder Alignment Document

Get stakeholder sign-off on terms BEFORE building anything.

| Term | Our Definition | Internally Approved? |
|------|----------------|---------------------|
| First Response Time | Time from ticket creation to first human reply (excludes auto-acknowledgments) | [ ] Yes / [ ] No |
| Resolution Time | Time from ticket creation to ticket marked solved/closed | [ ] Yes / [ ] No |
| SLA | Service Level Agreement — contractual response/resolution time targets by priority | [ ] Yes / [ ] No |
| CSAT | Customer Satisfaction — post-resolution survey on 1-5 scale | [ ] Yes / [ ] No |
| Ticket Deflection | Inquiry resolved via self-service without creating a human-handled ticket | [ ] Yes / [ ] No |
| Priority Levels | P1: System Down, P2: Major Impact, P3: Minor Impact, P4: General Question | [ ] Yes / [ ] No |
| Escalation | Moving ticket to higher tier, supervisor, or cross-functional team | [ ] Yes / [ ] No |

**Instructions to customer:**

Review each definition with your leadership team. Check "Yes" when approved. These definitions will drive your SLA policies, reporting, and team workflows. Misalignment here causes rework later.

---

### 1b. Kickoff Call

**Purpose:** Present audit findings and v0 requirements. Customer reacts and corrects, doesn't create from scratch.

#### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through gap analysis | "Here's what we found in your current support operations" |
| 15-30 | Present v0 requirements | Channels, SLAs, integrations, user roles — all marked ASSUMED |
| 30-40 | Definition alignment | Review Definition Alignment Document |
| 40-55 | Validate and correct | ASSUMED → CONFIRMED or corrected |
| 55-70 | Platform discussion | If not yet selected: present evaluation approach. If selected: confirm. |
| 70-80 | Identify gaps | What data is missing, who owns it |
| 80-90 | Next steps | Schedule refinement meetings, assign homework |

#### What We Bring

- Gap analysis (v0) showing current state vs. desired capabilities
- Draft requirements document with ASSUMED values
- Baseline metrics (current response times, volume distribution)
- Definition Alignment Document (pre-filled with recommendations)
- Platform evaluation scorecard (if platform not yet selected)

#### What We Leave With

- Corrections and validations on requirements (info for v1)
- Confirmed or contested definitions
- Platform preference or evaluation criteria
- Clear homework assignments (theirs: CRM access, brand assets, team list; ours: updated requirements, platform recommendation)

---

### 1c. Alignment Loop & Strategic Meeting Cadence

**Purpose:** Iterate on requirements and platform selection until sign-off.

#### The Pattern

```
Kickoff Call (gather info, validate gaps)
    ↓
Process feedback → v1 requirements
    ↓
Meeting 2 (platform + SLA alignment) → v2 requirements
    ↓
Meeting 3 (integrations + KB + rollout plan) → final requirements package
    ↓
Meeting 4: Sign-Off
```

#### Meeting Types for This Project

| Meeting Type | Focus | Stakeholder |
|-------------|-------|-------------|
| Platform + SLA Alignment | Platform selection, SLA definitions, priority levels | VP CS, Head of Support |
| Integration + KB Planning | CRM mapping, notification/escalation integrations, KB content plan | Support Lead, RevOps, IT, Product |
| Rollout Planning | Soft launch scope, full rollout timeline, communication | VP CS, Head of Support, Marketing |
| Sign-Off | Full walkthrough, final approval | All stakeholders |

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 3-5 days |
| Kickoff call | Day 1 of engagement |
| Platform selection | Week 1-2 (if not pre-selected) |
| Requirements sign-off | Week 2-3 |
| Engineering | Week 3-6 (2-3 weeks for standard, 3-4 for advanced) |
| Enablement + Rollout | Week 6-8 |
| Hypercare | Week 8-11 |
| Handoff | Week 11-12 |

---

### 1d. Strategic Sign-Off

**Purpose:** Confirm we have everything before building.

#### Validation Checkpoint

- Definition Alignment Document signed off by stakeholders
- Platform selected and procurement initiated
- SLA targets defined by priority level (P1-P4 response and resolution times)
- Support channels confirmed (email, chat, help center, optional: social, phone)
- Integration scope confirmed (CRM, notification tools, engineering escalation)
- User roles and permissions agreed (Admin, Supervisor, Agent, Light Agent, Read-Only)
- Ticket taxonomy approved (categories, priorities, custom fields)
- Knowledge base content plan approved (20-30 articles)
- Rollout plan agreed (soft launch scope, full launch date)
- All critical inputs CONFIRMED (vs ASSUMED)
- No blockers for engineering

#### Decision Point

- **Proceed to Engineering** → Requirements signed off, platform procured, ready to build
- **Loop back to Strategy** → Stakeholder disagreement on SLAs, platform, or scope (rare — address in alignment loop)

This project always proceeds to Engineering. The support platform is the deliverable — there is no natural exit point after Phase 1.

---

## Phase 2: Engineering

**Goal:** Build and test the complete support system based on approved requirements.

**Output:** Fully configured support platform with channels, routing, SLAs, automations, integrations, and help center — tested and customer-approved.

### Project Complexity

| Complexity | Engineering Weight | Example |
|-----------|-------------------|---------|
| Simple (email-only) | Medium (40-50%) | Single email channel, basic routing, minimal integrations |
| Standard | Heavy (60-70%) | Multi-channel, CRM + notification integrations, 20+ KB articles |
| Advanced | Very Heavy (70-80%) | Omnichannel, AI bot, complex routing, multiple integrations |

### Sub-Phases

```
2a Tech Spec → 2b Engineering Handoff → 2c Build → 2d Test
```

---

### 2a. Tech Spec

**Purpose:** Translate signed-off requirements into a platform-specific configuration spec.

**Input:** Signed-off requirements package from Phase 1

**Output:** Draft tech spec containing:

- **Account Configuration:** Business hours, timezone, subdomain, branding specs
- **User Roles Matrix:** Role → permissions mapping for each team
- **Channel Configuration:** Email forwarding rules, chat widget specs, offline handling
- **Ticket Taxonomy:** Category hierarchy, priority definitions, custom fields with data types, tag structure
- **Routing Rules:** Assignment logic (round-robin, load-balanced, skill-based), escalation triggers, VIP routing criteria
- **SLA Policies:** Response/resolution times by priority, breach notification rules, business hours vs. 24/7 scope
- **Automation Rules:** Auto-close timing, auto-tagging keywords, satisfaction survey triggers, escalation macros
- **Macro Library:** 10-15 core macros with response text and actions
- **CRM Integration Spec:** Field mapping (Account Name, ARR, Customer Tier, CSM, Renewal Date), sync direction, sidebar configuration
- **Notification Integration Spec:** Channel mapping, notification rules by ticket priority/tag
- **Engineering Escalation Integration Spec:** Project mapping, field mapping, escalation workflow, bidirectional sync rules
- **Help Center Structure:** Category hierarchy, article list, search configuration, branding specs
- **AI Bot Configuration (optional):** Trigger rules, handoff criteria, tone settings
- **Build Sequence:** Ordered list of what to configure first

---

### 2b. Engineering Handoff

**Purpose:** Review tech specs with engineer/configurer before building.

**Who attends:** Architect + Engineer (or platform configurer)

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through specs | Architect explains strategic context (why these SLAs, why this routing) |
| 15-30 | Engineer questions | Clarify integration dependencies, flag platform limitations |
| 30-45 | Refine and approve | Adjust specs, confirm build sequence, identify parallel work |

**What Architect brings:**

- Requirements package (for strategic context)
- Draft tech spec (from 2a)
- Platform admin credentials
- CRM admin access details

**What engineer leaves with:**

- Approved tech spec
- Clear build sequence
- Known risks/dependencies (e.g., SSO requires IT involvement, CRM sync requires Salesforce admin)
- Access credentials for all systems

---

### 2c. Build (Configure)

**Purpose:** Configure the support platform, all integrations, and the help center.

**Input:** Approved tech spec from 2b

**Build sequence (recommended order):**

#### Block 1: Platform Foundation (Day 1-2)

| Component | Configuration Details | Validation |
|-----------|----------------------|-----------|
| Admin account setup | Create admin account, invite initial admin users | All admins can log in |
| Company profile | Name, logo, brand colors, favicon | Branding matches guidelines |
| Business hours | Define schedules, holidays, timezone settings | Hours display correctly |
| Subdomain | Configure help center subdomain (help.company.com) | DNS resolves, SSL active |
| SSO/SAML (if required) | Configure identity provider integration | SSO login works |

#### Block 2: Users & Permissions (Day 2-3)

| Component | Configuration Details | Validation |
|-----------|----------------------|-----------|
| Role hierarchy | Admin, Supervisor, Agent, Light Agent, Read-only | Roles match requirements document |
| Custom roles | CS viewing tickets, Product viewing feedback | Cross-functional access works |
| Permissions | Ticket assignment, deletion, reporting access by role | Each role can only do what's permitted |
| Group structure | Support Tier 1, Tier 2, Billing, Technical | Agents in correct groups |

#### Block 3: Channels (Day 3-4)

| Component | Configuration Details | Validation |
|-----------|----------------------|-----------|
| Email | Forward [[email protected]](/cdn-cgi/l/email-protection) → platform, set up signatures, auto-ack messages | Send test email, verify ticket created |
| Live chat | Install widget on website/app, configure appearance, availability hours | Chat creates ticket, offline message works |
| Help center | Activate customer-facing portal, configure search, branding | Portal accessible, search works |
| Social (optional) | Facebook, Twitter, WhatsApp, SMS channel connections | Messages create tickets |

#### Block 4: Ticket Taxonomy (Day 4-5)

| Component | Configuration Details | Validation |
|-----------|----------------------|-----------|
| Categories/Types | Bug Report, Feature Request, Billing, How-To, Account Issue | Dropdowns populated correctly |
| Custom fields | Product Area, Customer Tier, Issue Severity | Fields appear on ticket form |
| Priority levels | P1: System Down, P2: Major Impact, P3: Minor, P4: Question | Priorities selectable, definitions match |
| Tags | churn-risk, upsell-opportunity, bug-confirmed, escalated | Tags available for agent use |

#### Block 5: Routing & SLAs (Day 5-6)

| Component | Configuration Details | Validation |
|-----------|----------------------|-----------|
| Assignment rules | Round-robin or load-balanced by group, skill-based for specialized queues | Tickets route to correct group/agent |
| Auto-assignment | Triggers based on ticket type, channel, customer tier | VIP customers reach senior agents |
| Escalation rules | Auto-escalate after X hours without response | Escalation fires correctly |
| Keyword routing | "billing" → finance team, "bug" → technical team | Keyword-triggered routing works |
| SLA policies | P1: 1hr response/4hr resolution, P2: 4hr/24hr, P3: 8hr/48hr, P4: 24hr/72hr | SLA timers visible on tickets |
| Breach warnings | Alert at 75% of SLA time elapsed | Warnings appear in agent view |
| Breach notifications | Notify supervisors + notification channels on breach | Breach notification fires correctly |

#### Block 6: Automations & Macros (Day 6-7)

| Component | Configuration Details | Validation |
|-----------|----------------------|-----------|
| Auto-close | Close inactive tickets after 7 days with no customer response | Auto-close fires, customer notified |
| Auto-tagging | Tag based on keywords in ticket content | Tags applied correctly |
| CSAT survey | Trigger satisfaction survey on ticket resolution | Survey sends, responses recorded |
| Core macros (10-15) | Password reset, feature request logged, billing inquiry, escalation templates | Each macro applies correctly |
| Escalation macros | Escalate to Tier 2, Escalate to Engineering, Escalate to Billing | Macro changes assignee + adds note |

#### Block 7: Integrations (Day 7-10)

| Component | Configuration Details | Validation |
|-----------|----------------------|-----------|
| CRM integration | Install native connector (Zendesk-Salesforce, Intercom-HubSpot) | Connector active, authenticated |
| CRM field mapping | Account Name, ARR, CSM, Customer Tier, Renewal Date → agent sidebar | All mapped fields display on ticket |
| Bidirectional CRM sync | Tickets create activities in CRM, CRM updates reflect in platform | Create ticket → check CRM activity created |
| Notification integration | Set up alert channels, notification rules | Notifications post to correct channels |
| Notification rules | P1 → critical alerts, bugs → engineering channel, general → support channel | Each rule fires correctly |
| Engineering escalation integration | Install, configure project mapping, field mapping | "Escalate to Engineering" creates issue |
| Bidirectional escalation sync | Engineering status updates reflect in support ticket | Status change → ticket comment |
| Product feedback workflow | Feature request tag → product feedback queue | Tagged tickets appear in product queue |

#### Block 8: Help Center & Knowledge Base (Day 10-14)

| Component | Configuration Details | Validation |
|-----------|----------------------|-----------|
| Help center structure | Top-level categories: Getting Started, Account & Billing, Features, Troubleshooting | Navigation intuitive, categories correct |
| Subcategories | Based on top ticket categories from audit | Subcategories match ticket themes |
| Homepage layout | Branded homepage with search bar, category grid, promoted articles | Design matches brand guidelines |
| Initial articles | 15-20 how-to articles, 5-10 troubleshooting articles, 3-5 getting started guides | All articles published, links work |
| Article feedback | "Was this helpful? Yes/No" mechanism on each article | Feedback captured in reporting |
| Search configuration | Suggested articles, search synonyms | Search returns relevant results |

#### Block 9: AI Answer Bot (Optional) (Day 14-15)

| Component | Configuration Details | Validation |
|-----------|----------------------|-----------|
| Bot activation | Enable AI answer bot in platform settings | Bot responds to chat initiations |
| Trigger rules | Activate on chat initiation, before ticket submission | Bot triggers at correct moments |
| Knowledge base link | Train bot on published knowledge base content | Bot suggests relevant articles |
| Human handoff | Define when bot escalates to human agent (confidence threshold, explicit request) | Handoff works correctly |
| Tone configuration | Match bot personality to brand voice | Tone consistent with brand guidelines |

**Build tracking:**

- Block 1: Platform Foundation
- Block 2: Users & Permissions
- Block 3: Channels
- Block 4: Ticket Taxonomy
- Block 5: Routing & SLAs
- Block 6: Automations & Macros
- Block 7: Integrations
- Block 8: Help Center & Knowledge Base
- Block 9: AI Answer Bot (optional)

---

### 2d. QA / Test + Sign-Off

**Purpose:** Verify the entire system works end-to-end and get customer approval.

**Two types of testing:**

| Type | Who | Purpose |
|------|-----|---------|
| Technical Testing | Our team | Verify it works (channels, routing, SLAs, integrations) |
| Customer Testing | Customer | Verify it does what they need (real-world scenarios) |

**Technical testing checklist:**

- Email channel: send test email → ticket created → routed correctly → SLA timer starts
- Chat channel: initiate chat → ticket created → agent receives → offline handling works
- Help center: search for article → article loads → feedback mechanism works
- Routing: submit tickets of each type → each routes to correct group
- VIP routing: submit ticket from high-value customer → routes to senior agent
- SLA: create P1 ticket → SLA timer displays correct target → breach warning fires at 75%
- Automations: inactive ticket → auto-close fires after 7 days → customer notified
- Macros: apply each macro → correct response inserted, correct fields updated
- CRM integration: create ticket → customer data displays in sidebar → activity logged in CRM
- Notification integration: create P1 ticket → notification posts to correct channel
- Engineering escalation: click "Escalate to Engineering" → issue created with correct fields
- Help center: navigate all categories → articles load → search returns relevant results
- AI bot (if enabled): initiate chat → bot suggests article → handoff to human works

**Customer testing:**

- Walk customer's support lead through a day-in-the-life scenario
- Have them process 5-10 sample tickets across different types and priorities
- Test the CRM sidebar with real customer records
- Review the help center as an end-customer would
- Capture feedback, fix issues before sign-off

**Engineering sign-off checkpoint:**

- All channels operational and creating tickets
- Routing rules verified across all ticket types
- SLA policies active with correct timers
- All integrations syncing correctly (CRM, notifications, engineering escalation)
- Help center live with 20-30 articles
- All automations and macros tested
- Customer has tested and approved
- Ready for enablement

**Decision point:**

- **Proceed to Enablement** → System built, all tests passing, ready for training
- **Loop back to Build** → Issues found, routing incorrect, integration not syncing

---

## Phase 3: Enablement

**Goal:** Support team can actually use the system. Staged rollout validates configuration before full launch.

**Output:** Trained team with documentation, system tested in production with real tickets, stable and ready for full customer base.

### Sub-Phases

```
3a Training Prep → 3b Training Sessions → 3c Hypercare (Soft Launch → Full Launch) → 3d Enablement Sign-Off
```

---

### 3a. Training Prep

**Purpose:** Create training materials from configuration documentation and strategic requirements.

**Input:** Requirements package + tech spec + configured system

**Output:** Training package containing:

- **Agent Quick-Reference Guide (PDF/Wiki):** Ticket handling workflow, macro reference, escalation paths, SLA expectations, CRM context features
- **Admin Runbook:** Common admin tasks (add user, update SLA, create macro, modify automation, run reports)
- **Video Walkthrough Scripts:** 3 recordings — agent workflow walkthrough, dashboard/reporting overview, admin tasks walkthrough
- **FAQ Draft:** Based on common questions from similar support platform implementations

---

### 3b. Training Sessions

**Purpose:** Transfer knowledge to all user types.

**Training sessions for this project:**

| Session | Audience | Focus | Duration |
|---------|----------|-------|----------|
| Agent Training | Support Reps (Tier 1, Tier 2) | Ticket handling workflow, macros, escalation, CRM context lookup | 60-90 min |
| Supervisor Training | Team Leads | Queue management, SLA monitoring, agent performance views, reporting | 45 min |
| Admin/Technical Training | Support Ops Admin, RevOps | Platform admin, automation management, integration monitoring | 60 min |
| Leadership Briefing | VP CS, Head of Support | Dashboard walkthrough, SLA reporting, CSAT trends, ticket analytics | 30 min |

**Training delivery:**

1. Schedule sessions grouped by role — agents first, then supervisors, then admin
2. Each session includes live demo + practice with test tickets in sandbox
3. Record every session for future reference and new hire onboarding
4. Distribute agent quick-reference guide before training (so they can follow along)
5. Collect questions — feed into FAQ document

**Output:**

- Trained stakeholders across all roles
- Recordings of each session
- Updated FAQ based on questions raised
- Agents confident enough for soft launch

---

### 3c. Hypercare

**Purpose:** Staged rollout with intensive support to validate configuration and catch issues before full customer exposure.

**Duration:** 3 weeks total

**Week 1: Soft Launch**

| Activity | Details |
|----------|---------|
| Internal dogfooding | Enable system for internal team only (Days 1-2) |
| Limited customer rollout | Enable for 10-20% of customers or a specific segment (Days 3-5) |
| Daily office hours | 30-min daily slot for agent questions and issue triage |
| Monitoring | Track routing accuracy, SLA compliance, integration sync errors |
| Adjustments | Fix routing rules, update macros, adjust automations based on real use |

**Week 2: Full Rollout**

| Activity | Details |
|----------|---------|
| Full customer launch | Enable for all customers |
| Customer communication | Send announcement with new support channels and help center link |
| Old email redirect | Redirect legacy support email to new platform |
| Website/app updates | Live chat widget active, help center linked |
| 48-hour intensive watch | Monitor ticket volume, response times, escalation accuracy closely |
| Twice-weekly office hours | 30-min slot twice per week |

**Week 3: Stabilization**

| Activity | Details |
|----------|---------|
| Ongoing monitoring | Track SLA compliance, CSAT scores, ticket deflection rate |
| Knowledge base gaps | Identify top unanswered questions, draft new articles |
| Process refinements | Adjust routing, add macros for newly discovered common scenarios |
| Twice-weekly office hours | Continue through end of week 3 |

**When to extend hypercare:** If SLA compliance is below 80%, CSAT drops below baseline, or more than 5% of tickets are misrouted after Week 2.

**Output:** Stabilized system with real production data, no critical issues outstanding, initial performance metrics captured.

---

### 3d. Enablement Sign-Off

**Purpose:** Confirm customer can operate independently.

**Validation checkpoint:**

- All training sessions delivered and recorded
- Agent quick-reference guide and admin runbook distributed
- Soft launch completed — routing and SLAs validated with real tickets
- Full rollout completed — all customers on new system
- 3-week hypercare period complete
- SLA compliance above target (or improving trend documented)
- No critical issues outstanding
- Support team operating without daily implementation team involvement
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** → System stable, team enabled, metrics trending positively
- **Extend Hypercare** → SLA compliance below 80%, critical issues unresolved, team not yet confident

---

## Phase 4: Handoff

**Goal:** Clean project close with maintenance plan established and retention/expansion path set.

**Output:** Maintenance schedule documented, internal context transferred, customer owns the system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule → 4b Internal Handoff → 4c External Handoff → 4d Project Close
                              (SME → Architect)      (Team → Customer)     (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|---------------------|---------------|
| Single Project | Customer owns | 4c (External Handoff) — customer receives maintenance schedule and runs it themselves |
| Dedicated (Multi-Project) | Architect owns | 4b (Internal Handoff) — Architect receives maintenance schedule and runs it for customer |

---

### 4a. Maintenance Schedule

**Purpose:** Document what needs ongoing attention after the project is complete — cadences, tasks, triggers for re-engagement.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|-------------|---------------|-------------------|
| SLA Compliance Review | % of tickets meeting FRT and resolution SLA targets | Below 85% compliance for any priority level |
| CSAT Score Check | Rolling 30-day CSAT average | Drop of 5+ points from baseline |
| Automation Effectiveness | Auto-close rate, auto-tagging accuracy, macro usage | Auto-close causing customer complaints |
| Ticket Volume Trends | Month-over-month volume by category | >25% spike in any category (indicates product issue) |
| Knowledge Base Gap Analysis | Top unanswered questions, articles with low helpfulness | Top 3 ticket categories have no corresponding article |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|--------------------|-------------------|
| Full Platform Audit | User roles, permissions, groups — any stale accounts? | Remove inactive users, update permissions |
| Integration Health Check | CRM sync accuracy, notification routing, escalation workflow | Re-authenticate connections, fix field mapping drift |
| SLA Target Reassessment | Are current SLA targets still appropriate? | Tighten targets if consistently exceeding, loosen if unrealistic |
| Automation Rule Review | Are existing automations still relevant? | Remove obsolete rules, add new based on ticket patterns |
| Knowledge Base Content Refresh | Articles still accurate? New features covered? | Update outdated articles, create new for product changes |
| CSAT Trend Analysis | 90-day trend, satisfaction by channel and category | Investigate categories with below-average CSAT |

**After First Business Cycle (30-60 days post-launch):**

- Ticket deflection rate measurement: What % of inquiries are resolved via help center before ticket creation? Target: 20-30%
- First response time validation: Are agents meeting SLA targets consistently? Compare to pre-launch baseline
- Channel distribution analysis: Which channels drive the most volume? Does staffing match?
- Key Question: Is the support team handling more volume without additional headcount? The target is 2x volume capacity

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| SLA compliance drop | Below 80% for 2+ consecutive weeks | Re-engage — review routing, staffing, SLA targets |
| CSAT decline | 10+ point drop sustained over 30 days | Scope optimization project — root cause analysis |
| Ticket volume spike | >50% increase sustained over 2+ weeks | Review for product issues, add KB articles, adjust staffing |
| Integration failure | CRM/notification/escalation sync broken for 24+ hours | Escalate to platform vendor support |
| Knowledge base stale | >30% of articles not updated in 6 months | Scope KB refresh project |

**Every 6-12 Months:**

- Full system recalibration: Review all SLA targets, routing rules, automations against actual performance data
- Platform feature review: Evaluate new platform features (AI capabilities, analytics upgrades) for adoption
- Vendor contract review: Assess licensing costs vs. usage, evaluate upgrade or migration options
- Support process maturity assessment: Has the team outgrown the current configuration?

---

### 4b. Internal Handoff (SME → Architect)

**Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- What was built: Platform, channels, integrations, key configuration decisions and rationale
- Customer context: Key stakeholders (VP CS, Head of Support, Support Lead), communication preferences, historical pain points
- Performance baselines: First-launch SLA metrics, CSAT baseline, ticket volume baseline
- Common issues: Typical agent questions, known platform quirks, integration edge cases

**Escalation guidelines:**

| Issue Type | Who Handles | Example |
|-----------|-------------|---------|
| Agent training, minor macro updates | Architect | "How do I add a new macro for password resets?" |
| Reporting questions, dashboard interpretation | Architect | "What does this CSAT trend mean?" |
| Routing logic changes, SLA policy updates | SME | "We need to add a new priority level" |
| New integration (new tool connection) | SME | "We want to connect our billing system" |
| Platform migration or upgrade | SME | "We're considering moving between platforms" |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing monthly and quarterly tasks. SME walks Architect through each task during handoff.

---

### 4c. External Handoff (Implementation Team → Customer)

**Purpose:** Formal project completion with customer.

**Final project meeting (60 min):**

| Time | Topic | Details |
|------|-------|---------|
| 0-10 | Review what was delivered | Platform, channels, integrations, help center, reports |
| 10-25 | Walk through documentation package | Admin runbook, agent guide, integration architecture |
| 25-40 | Maintenance schedule walkthrough | Monthly/quarterly tasks, red flag thresholds, triggers |
| 40-50 | Answer final questions | Address any outstanding concerns |
| 50-55 | Confirm project complete | Explicit: "Project is complete" |
| 55-60 | Schedule 30-day check-in | Optimization review after first business cycle |

**Documentation package delivered:**

- All training recordings (agent, supervisor, admin, leadership)
- Agent Quick-Reference Guide
- Admin Runbook (common admin tasks with step-by-step instructions)
- Integration Architecture Map
- SLA Policy Document
- Definition Alignment Document (final version)
- FAQ Document
- Troubleshooting Guide (see below)
- **Maintenance Schedule** (for Single Project engagements)

**Troubleshooting Guide (included in documentation package):**

| Scenario | Symptoms | Resolution |
|----------|----------|-----------|
| Email tickets not creating | Emails to support@ not appearing in platform | Check email forwarding rules, verify DNS records, test with simple email |
| Chat widget not loading | Widget doesn't appear on website/app | Verify embed code, check for JavaScript conflicts, test incognito mode |
| CRM data not showing in sidebar | Agent sidebar shows "No data" for known customers | Re-authenticate CRM connection, verify field mapping, check sync logs |
| SLA timers not starting | Tickets show no SLA policy applied | Verify SLA policies are active, check business hours config, match priority |
| Notifications not posting | P1 tickets not appearing in alert channel | Re-authenticate integration, verify channel mapping, check notification rules |
| Engineering issues not creating | "Escalate to Engineering" doesn't create ticket | Re-authenticate connection, verify project mapping, check field requirements |
| Auto-close firing on active tickets | Tickets closing while customer is still waiting | Adjust auto-close rules to check for agent response, not just time elapsed |
| Routing to wrong group | Billing tickets going to Technical team | Review trigger conditions, check keyword routing rules, verify tag logic |
| CSAT surveys not sending | No satisfaction surveys after ticket resolution | Verify survey trigger is active, check that it fires on "Solved" not "Closed" |
| Help center search returning nothing | Customer searches return 0 results for common queries | Re-index help center, add search synonyms, verify articles are published |

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video walkthrough of the walkthrough. Make sure they understand what to check, how often, and when to re-engage.

**Output:** Customer owns the system. Project formally complete.

---

### 4d. Project Close

**Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved (requirements doc, tech spec, training recordings, admin runbook)
- Handoff documentation complete and delivered to customer
- Project status updated in tracking system
- Time/billing finalized

#### Internal Debrief (Optional but Recommended)

- What went well? (e.g., CRM integration went smoothly, agent training was well-received)
- What would we do differently? (e.g., should have pushed harder on knowledge base content during strategy)
- Any learnings to feed back into SOPs? (e.g., new macro template, better intake form question)

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| Single Project | Upsell → Downsell → Retry |
| Multi-Project (Dedicated) | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (ongoing optimization, KB expansion, reporting)
   ↓ if no
2. Downsell: Knowledge base expansion project, AI chatbot enhancement, or advanced analytics setup
   ↓ if yes
3. Retry retainer at end of next project cycle
```

**Script:**

"Now that your support system is live, there are two ways we can continue working together. Option 1: We can set you up on managed services where we handle ongoing optimization — SLA tuning, knowledge base expansion, new integration connections, and monthly performance reviews. Option 2: If there's a specific enhancement you need, like expanding your AI chatbot or adding advanced analytics, we can scope that as a project. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

"On [date ~8 weeks out], we'll review how the support system is performing — SLA compliance, CSAT trends, ticket deflection rates — and see if any adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull SLA compliance, CSAT, ticket volume, deflection rate |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points with metrics. |

**At the refinement check-in:**

- Review SLA compliance against targets
- Analyze CSAT trends (B2B SaaS companies average 68% CSAT — how does client compare?)
- Assess ticket deflection rate (target: 20-30% via self-service)
- If minor adjustments: Architect handles (macro updates, KB article additions)
- If major changes needed: Scope new project (workflow redesign, new integration, platform migration)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Requirements Document (signed-off channels, SLAs, integrations, user roles)
- Platform Evaluation Scorecard (if platform selection was part of scope)
- SLA Policy Document (priority definitions, response/resolution targets)
- Definition Alignment Document (all support terminology agreed by stakeholders)
- Current vs. Future State Diagram

**Technical Deliverables:**

- Configured support platform (Zendesk, Intercom, Freshdesk, or selected tool)
- Multi-channel support setup (email, chat, help center, optional social/phone)
- Ticket routing and assignment rules
- SLA policies with breach notifications
- 10-15 core macros
- CRM integration (Salesforce/HubSpot bidirectional sync with agent sidebar)
- Notification integration (alert channels by priority/tag)
- Engineering escalation integration (bug escalation workflow with bidirectional sync)
- Help center with 20-30 published articles
- AI answer bot (if opted in)

**Documentation Package:**

- Training recordings (agent, supervisor, admin, leadership)
- Agent Quick-Reference Guide
- Admin Runbook
- Integration Architecture Map
- FAQ Document
- Troubleshooting Guide
- Maintenance Schedule
- Definition Alignment Document (final version)

---

## Appendix

### How to Use This Playbook

This is the **implementation guide** for Support System Implementation — the step-by-step execution guide for deploying a centralized support platform from first contact to project close. It is the third file in a 3-file playbook structure:

| File | Purpose |
|------|---------|
| `1-advisory.md` | What the project IS — positioning, outcomes, approaches |
| `2-methodology.md` | HOW we think about the problem — frameworks, concepts, best practices |
| `3-implementation.md` | WHAT to DO — step-by-step execution with checklists |

See Advisory for project positioning and discovery questions. See Methodology for platform selection frameworks, SLA design principles, and integration architecture patterns.

### What Each Phase Produces

| Phase | Output | Gate Criteria |
|-------|--------|---------------|
| **Phase 1: Strategy** | Signed-off requirements + platform selection + SLA definitions | All stakeholders approved requirements, platform procured |
| **Phase 2: Engineering** | Built and tested support platform with all integrations | All channels, routing, SLAs, integrations, and KB tested and customer-approved |
| **Phase 3: Enablement** | Trained team, soft launch complete, full rollout stable | All training delivered, 3-week hypercare complete, team operating independently |
| **Phase 4: Handoff** | Independent customer + archived project | Internal/external handoffs complete, maintenance plan in place, project closed |

### Project Profile

This is a **technical-heavy** project:

| Phase Weight | Percentage | Rationale |
|-------------|-----------|-----------|
| Strategy | 20-25% | Requirements gathering, platform selection, SLA definition |
| Engineering | 50-60% | Platform config, integrations, automations, knowledge base |
| Enablement | 15-20% | Agent training, staged rollout, hypercare |
| Handoff | 5-10% | Documentation, maintenance schedule, project close |

### Key Industry Context

- B2B SaaS companies spend approximately "8-8.5% of ARR on support and success functions"
- "91% of customers would use a help center, and 76% prefer self-service over contacting support"
- "Companies with AI-driven support achieve 25-45% ticket deflection and 2-5x ROI within the first year"
- "The average cost of a B2B support agent interaction exceeds $13, while self-service costs pennies per interaction"
- "Top-performing B2B SaaS companies achieve average first response time under 1 hour for email and under 2 minutes for live chat"
- "Customer satisfaction drops sharply when response times exceed 8-12 hours"
- "First-contact resolution improvements reduce churn by up to 67%"
- "Organizations implementing AI-powered support see $3.50 return for every $1 invested"

---

## References

[1] Pylon - 50+ Customer Support Statistics & Trends for 2025

[2] Zendesk - Ticket Deflection: Enhance Your Self-Service with AI

[3] Thena - B2B Customer Service Response Time Benchmarks 2025

[4] LiveChatAI - The True Cost of Customer Support: 2025 Analysis

[5] Maxio - 2025 B2B SaaS Benchmarks Report

[6] Fullview - 100+ Customer Support Statistics & Trends for 2025

[7] Freshworks Customer Service Benchmark Report 2024