# Revenue Intelligence Process - Playbook

## 1. Definition

**What it is**: A process implementation project that deploys conversation intelligence and pipeline analytics systems (such as Gong, Clari, or similar platforms) to capture sales conversation data, surface deal insights, and improve forecasting accuracy through systematic deal inspection workflows.

**What it is NOT**: Not a CRM implementation (the CRM should already exist). Not a sales process redesign (though it may surface process gaps). Not a compensation or quota-setting exercise. Not a sales methodology training program (though it enables coaching). Not Activity Capture (that's email/calendar sync without conversation intelligence).

## 2. ICP Value Proposition

**Pain it solves**: Leadership lacks visibility into what's actually happening in sales conversations and deals. Forecast accuracy is poor (&lt;70%), reps self-report activity inconsistently, deal reviews are based on gut feel rather than data, and new rep onboarding takes too long because best practices aren't captured or shared.

**Outcome delivered**: A fully operational revenue intelligence system where 100% of customer conversations are captured and analyzed, deals are automatically scored for risk, forecast accuracy exceeds 85%, and managers have coaching scorecards to accelerate rep performance.

**Who owns it**: VP of Sales or CRO (executive sponsor), with RevOps/Sales Ops as the day-to-day administrator.

## 3. Implementation Procedure

### Part 1: Assess Current State & Define Success Criteria

#### Step 1: Audit Current Conversation Capture Coverage

**Step Overview:** Assess how much conversation data is currently being captured across all sales channels. End state: Gap analysis document showing capture rate by channel and identifying blind spots.

- Pull call recording stats from existing dialer system (if any) for last 90 days
- Audit Zoom/Teams/Meet recording settings and adoption rates across sales team
- Interview 2-3 sales managers on current deal review process and visibility gaps
- Document which channels are NOT being captured (in-person meetings, mobile calls, LinkedIn messages)
- Quantify the gap (e.g., "Only 40% of customer conversations are recorded")

#### Step 2: Establish Baseline Forecast Accuracy Metrics

**Step Overview:** Document current forecast accuracy and deal velocity metrics to enable ROI measurement post-implementation. End state: Baseline metrics document with 4 quarters of historical data.

- Pull historical forecast vs. actual reports from CRM for last 4 quarters
- Calculate forecast accuracy percentage by rep, team, and segment
- Document current win rates by stage, deal size, and sales cycle length
- Interview Sales Leadership (CRO, VP Sales) on forecasting pain points and current processes
- Record average deal slippage rate (deals that push from one quarter to next)

#### Step 3: Map Tech Stack and Define Integration Requirements

**Step Overview:** Document all systems that must integrate with the revenue intelligence platform and identify compatibility requirements. End state: Integration map with API/authentication requirements for each system.

- Inventory current tech stack: CRM, dialer, video conferencing, email, calendar
- Document authentication methods available (OAuth, API keys, native integrations)
- Identify data fields that need to flow between systems (opportunity stages, contact roles, activity types)
- Note any compliance requirements (call recording consent, data residency, GDPR)
- Assess CRM data quality - flag critical hygiene issues that could impact deal scoring

#### Step 4: Define Success Criteria and Select Platform

**Step Overview:** Establish measurable success criteria and evaluate platform options against client requirements. End state: Platform selected with documented success criteria and stakeholder alignment.

- Define 3-5 success criteria with measurable targets (e.g., forecast accuracy from 65% to 85%)
- Evaluate platform options: Gong, Clari, Chorus, Revenue Grid, Avoma
- Compare on: CRM compatibility, pricing model, implementation complexity, feature fit
- Present recommendation with pros/cons to executive sponsor
- Get budget approval and procurement initiated

---

### Part 2: Configure Core Platform & CRM Integration

#### Step 1: Set Up Platform Account and Admin Access

**Step Overview:** Create the revenue intelligence platform account and establish administrative access structure. End state: Platform provisioned with admin accounts and role hierarchy configured.

- Create platform account with enterprise license
- Configure SSO integration if applicable (Okta, Azure AD, Google)
- Set up admin accounts for RevOps team with full configuration access
- Define user role hierarchy (Admin, Manager, Rep, Read-Only)
- Document admin credentials and access procedures for client handoff

#### Step 2: Configure CRM Sync and Field Mapping

**Step Overview:** Establish bidirectional sync between revenue intelligence platform and CRM with proper field mapping. End state: CRM connected with all required fields syncing correctly.

- Connect to Salesforce/HubSpot via OAuth with read/write permissions
- Map standard objects: Opportunities, Accounts, Contacts, Activities
- Configure custom field sync for deal-specific data (MEDDIC fields, custom stages)
- Set sync frequency (real-time vs. scheduled) based on data volume
- Verify connection and run initial data sync - validate sample records

#### Step 3: Configure Call Recording Integrations

**Step Overview:** Set up recording integrations for all conversation channels used by sales team. End state: All customer conversation channels connected and recording automatically.

- Configure Zoom integration with automatic recording for external meetings
- Set up Microsoft Teams or Google Meet integration (based on client stack)
- Connect dialer system (Outreach, Salesloft, Aircall, RingCentral) for phone recording
- Configure recording consent settings based on legal requirements (one-party vs. two-party)
- Test recording on each channel type and verify transcription accuracy

---

### Part 3: Build Deal Scoring and Pipeline Analytics

#### Step 1: Configure Deal Risk Scoring Rules

**Step Overview:** Build automated deal risk scoring based on conversation signals and CRM data patterns. End state: Deal risk scores appearing on all active opportunities with clear risk indicators.

- Define risk signals from conversations (competitor mentions, stakeholder drop-off, timeline shifts)
- Configure CRM-based risk rules (stalled deals, missing next steps, no recent activity)
- Set up engagement scoring (single-threaded vs. multi-threaded, champion engagement)
- Calibrate scoring weights based on client's historical win/loss patterns
- Test scoring on sample deals and validate with sales leadership feedback

#### Step 2: Build Pipeline Analytics Dashboards

**Step Overview:** Create pipeline visibility dashboards with forecast roll-up views for different stakeholders. End state: Dashboard suite deployed with rep, manager, and executive views.

- Build rep-level dashboard: personal pipeline, deal health, activity metrics
- Build manager-level dashboard: team pipeline, forecast vs. quota, rep performance
- Build executive dashboard: company forecast roll-up, quarter projection, risk summary
- Configure drill-down paths from summary views to deal details
- Set up scheduled dashboard email delivery to stakeholders

#### Step 3: Create Forecast Submission Workflow

**Step Overview:** Configure forecast submission process with commit categories and roll-up logic. End state: Weekly forecast submission workflow active with proper approval chain.

- Define forecast categories (Commit, Best Case, Pipeline, Omitted)
- Configure submission workflow with rep input and manager override capability
- Set up forecast snapshot schedule (weekly, monthly, quarterly)
- Build forecast accuracy tracking to compare submissions vs. actuals over time
- Configure automated reminders for forecast submission deadlines

---

### Part 4: Deploy Coaching and Conversation Intelligence

#### Step 1: Configure Coaching Scorecards

**Step Overview:** Build coaching scorecards with talk ratio, question frequency, and topic coverage metrics. End state: Coaching scorecards active with benchmarks set from top performer data.

- Define coaching metrics: talk-to-listen ratio, question frequency, monologue length
- Configure topic detection for key conversation elements (discovery, demo, negotiation)
- Set up competitor mention alerts and tracking
- Establish benchmark values from top performer analysis
- Build manager view for comparing rep performance to benchmarks

#### Step 2: Set Up Automated Deal Alerts

**Step Overview:** Configure automated alerts for at-risk deals and important conversation signals. End state: Alert system active with notifications going to appropriate stakeholders.

- Define alert triggers: ghosting risk, competitor mention, champion departure, timeline change
- Configure notification channels (email, Slack, in-platform)
- Set up escalation rules (rep notified first, manager notified if no action)
- Build weekly deal health digest for managers
- Test alert triggers with sample scenarios

#### Step 3: Create Call Library and Best Practice Repository

**Step Overview:** Set up searchable call library with tagging for training and onboarding use cases. End state: Call library organized with playlists for common coaching scenarios.

- Configure call tagging taxonomy (discovery, demo, objection handling, negotiation)
- Build playlists for new rep onboarding (best discovery calls, winning demos)
- Set up snippet creation workflow for managers to capture coaching moments
- Create competitive intelligence library (calls with competitor mentions)
- Document process for reps and managers to contribute to library

---

### Part 5: Rollout, Training & Enablement

#### Step 1: Conduct Sales Manager Training

**Step Overview:** Train sales managers on deal inspection workflows, coaching scorecards, and forecast submission. End state: Managers trained and able to run data-driven deal reviews.

- Schedule 60-minute training session for all sales managers
- Cover: deal inspection workflow, dashboard navigation, coaching scorecards
- Walk through sample deal review using live data
- Provide quick-reference guide for weekly deal review process
- Record session for managers who cannot attend live

#### Step 2: Conduct Sales Rep Training

**Step Overview:** Train sales reps on what's being captured and how to use insights for self-coaching. End state: Reps understand recording settings and can access their own metrics.

- Schedule 30-minute training session for sales reps
- Cover: what's auto-recorded, privacy settings, how to review own calls
- Show how to use call insights for self-improvement
- Address common concerns about monitoring and data usage
- Distribute FAQ document addressing rep privacy questions

#### Step 3: Train RevOps Admin on Platform Administration

**Step Overview:** Transfer platform administration knowledge to client RevOps team. End state: Client admin self-sufficient for user management, reporting, and troubleshooting.

- Conduct hands-on admin training session (60-90 minutes)
- Cover: user provisioning, permission management, integration monitoring
- Walk through common troubleshooting scenarios (sync issues, recording failures)
- Document admin runbook with step-by-step procedures
- Transfer admin credentials and confirm client access

---

### Part 6: Establish Cadences & Handoff

#### Step 1: Document Weekly Deal Review Process

**Step Overview:** Create standardized deal review process with agenda template and required dashboards. End state: Deal review playbook ready for managers to adopt.

- Create deal review meeting agenda template (30-45 minute format)
- Define required pre-work for reps before deal review
- Document which dashboards/reports to use in each section
- Build deal inspection checklist for managers
- Distribute playbook to all managers with example meeting recording

#### Step 2: Establish Forecast Review Cadence

**Step Overview:** Set up recurring forecast review meetings at rep, team, and company levels. End state: Forecast cadence calendar published with meeting invites sent.

- Define forecast cadence: weekly pipeline review, monthly forecast call, quarterly business review
- Create meeting invite templates with pre-read requirements
- Build forecast review deck template with required data views
- Document escalation process for deals that need executive attention
- Send calendar invites and publish cadence to sales team

#### Step 3: Conduct Handoff and Schedule Follow-Up

**Step Overview:** Complete formal handoff to client with documentation package and schedule adoption check-in. End state: Project closed with 30-day and 90-day follow-up scheduled.

- Compile documentation package: config settings, admin runbook, training materials
- Conduct handoff meeting with RevOps owner and executive sponsor
- Review success criteria and establish adoption tracking metrics
- Schedule 30-day adoption check-in to review usage and address friction
- Schedule 90-day ROI review to measure against baseline metrics

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce, HubSpot) with reasonably clean opportunity data and defined sales stages
- Consistent meeting platform (Zoom, Teams, or Meet) used across the sales team
- Defined sales process with clear stage definitions and exit criteria
- Executive buy-in for call recording (legal/compliance approval where required)

**What client must provide:**
- Admin access to CRM with permission to create custom fields and workflows
- Admin access to video conferencing platform for recording configuration
- List of all reps and managers to be onboarded with role assignments
- Decision on platform vendor (or willingness to evaluate during Discovery)
- 2-3 hours per week from RevOps/Sales Ops lead during implementation

**What LeanScale provides:**
- Platform configuration and integration expertise
- Dashboard and scorecard design templates
- Change management and training facilitation
- Best practice playbooks for deal review and forecasting cadences

## 5. Common Pitfalls

- **Pitfall 1**: Deploying before CRM data is clean (duplicate accounts, missing fields, inconsistent stage definitions) leads to inaccurate deal scoring and low user trust. → **Mitigation**: Run a CRM hygiene audit in Discovery phase and address critical data quality issues before platform go-live. Forrester reports 58% of teams have "dirty data" issues that undermine forecasts.

- **Pitfall 2**: Treating implementation as a "set and forget" IT project rather than a change management initiative results in &lt;30% adoption. → **Mitigation**: Assign a Sales Ops owner, require managers to use dashboards in weekly deal reviews, and track adoption metrics for the first 90 days.

- **Pitfall 3**: Overwhelming users by enabling every feature at once creates confusion and resistance. → **Mitigation**: Start with one high-value use case (e.g., deal risk alerts or forecast roll-up) and add features incrementally as adoption grows.

- **Pitfall 4**: No baseline metrics means you cannot prove ROI and justify continued investment. → **Mitigation**: Document current forecast accuracy, win rates, and deal velocity in Discovery so you can measure improvement at 90-day review.

- **Pitfall 5**: Over-investing in dual-tool stacks (e.g., Gong + Clari) creates redundancy, integration complexity, and budget strain. → **Mitigation**: Evaluate platforms holistically and select one that covers core needs before adding secondary tools.

## 6. Success Metrics

- **Leading Indicator**: Call recording coverage reaches 95%+ within first 2 weeks; managers access dashboards at least 3x per week; forecast submission compliance >90%
- **Lagging Indicator**: Forecast accuracy improves by 15+ percentage points within 2 quarters; new rep ramp time decreases by 20%+ due to coaching scorecard insights; deal slippage rate reduced by 30%

---

