# Renewal Management - Playbook

## 1. Definition

**What it is**: A strategic and technical project that builds the workflows, automation, health scoring, and reporting infrastructure needed to proactively manage customer renewals, reduce churn, and maximize recurring revenue retention (GRR/NRR).

**What it is NOT**: Not a one-time renewal campaign or outreach effort. Not a CRM implementation project (assumes CRM exists). Not a customer success strategy overhaul (focuses specifically on renewal mechanics). Not an upsell/expansion playbook (though renewal infrastructure enables it).

## 2. ICP Value Proposition

**Pain it solves**: Renewals are reactive and chaotic - the team only realizes a renewal is due when the invoice arrives or the customer churns. No centralized visibility into upcoming renewals, customer health signals are scattered, and there's no standardized process for renewal outreach. Result: preventable churn, missed negotiation windows, and unpredictable revenue.

**Outcome delivered**: A proactive renewal engine with 90-day visibility, automated health scoring and alerts, standardized CSM playbooks, and real-time dashboards showing renewal pipeline and risk accounts. The team moves from reactive firefighting to predictable retention management.

**Who owns it**: VP of Customer Success or Head of CS, with collaboration from RevOps and Finance.

## 3. Implementation Procedure

### Part 1: Assess Current State & Define Requirements

#### Step 1: Audit Current Renewal Tracking Method

**Step Overview:** Document how renewals are currently tracked and identify gaps in visibility, process, and data quality. End state: Complete inventory of current renewal process with documented pain points and gaps.

- Review existing renewal tracking method (spreadsheets, CRM fields, calendar reminders, or nothing)
- Document where renewal dates are stored and how accurate/complete the data is
- Identify which renewals in the last 6 months were discovered late or missed entirely
- Interview 2-3 CS team members on their current renewal workflow and pain points
- Map where renewals currently fall through the cracks (no owner, no alert, no visibility)
- Create gap analysis document showing current state vs. desired state

#### Step 2: Calculate Baseline Retention Metrics

**Step Overview:** Pull historical renewal data to establish baseline GRR, NRR, and churn rates by segment. End state: Documented baseline metrics that will be used to measure project success.

- Pull last 12 months of renewal data from CRM/billing system
- Calculate Gross Revenue Retention (GRR) - renewals without expansion
- Calculate Net Revenue Retention (NRR) - renewals including expansion/contraction
- Segment metrics by customer type (enterprise, mid-market, SMB) if applicable
- Document churn reasons from churned accounts (categorize as preventable vs. unpreventable)
- Identify which segments have highest churn risk for prioritization

#### Step 3: Inventory Customer Health Data Sources

**Step Overview:** Document all available customer health signals and assess data quality and accessibility. End state: Complete inventory of health signals with integration requirements for health scoring.

- List all product usage/analytics data available (logins, feature usage, adoption metrics)
- Document support ticket data sources and accessibility (volume, severity, resolution time)
- Identify NPS/CSAT survey data and collection frequency
- Map engagement signals (email opens, meeting attendance, executive sponsor activity)
- Assess data quality and completeness for each signal source
- Note integration requirements to pull each data source into CRM

#### Step 4: Define Renewal Timeline and Alert Requirements

**Step Overview:** Work with CS leadership to define the renewal timeline, alert thresholds, and ownership model. End state: Documented requirements for 90/60/30-day alerts, escalation paths, and renewal owner assignment logic.

- Define 90/60/30-day renewal timeline stages with expected CSM actions at each stage
- Determine alert delivery method (CRM tasks, Slack notifications, email, or combination)
- Establish renewal owner assignment logic (by segment, CSM territory, or account owner)
- Define escalation thresholds for at-risk renewals (health score cutoffs, no-response triggers)
- Document notice period requirements from contracts (auto-renewal clauses, cancellation windows)
- Get sign-off from CS leadership on requirements before proceeding to build

---

### Part 2: Build Renewal Tracking & Health Scoring Infrastructure

#### Step 1: Configure Centralized Renewal Tracking View

**Step Overview:** Build the core renewal tracking view in CRM showing all upcoming renewals with key details. End state: Single view showing all renewals with dates, values, owners, and status visible to CS team.

- Create custom renewal object or opportunity stage in CRM for renewal tracking
- Build renewal list view showing: account name, renewal date, contract value, renewal owner, health status
- Configure renewal date field to auto-populate from contract or subscription data
- Set up renewal owner field with required assignment (no orphan renewals)
- Create filtered views by time period (next 30/60/90 days) and by CSM
- Test view with sample data to ensure all fields populate correctly

#### Step 2: Build Customer Health Score Formula

**Step Overview:** Configure the health score calculation combining multiple signals into a single risk indicator. End state: Working health score formula that categorizes accounts as healthy, at-risk, or critical.

- Define health score scale (0-100 or Red/Yellow/Green categories)
- Weight each signal based on historical churn correlation analysis
- Configure product usage signals (login frequency, feature adoption, active users)
- Add support health signals (ticket volume, escalations, unresolved issues)
- Include engagement signals (meeting attendance, email responsiveness, executive sponsor status)
- Add NPS/CSAT scores if available
- Build the formula in CRM (Salesforce formula field, HubSpot calculated property, or external tool)
- Test health scores against known churned accounts to validate accuracy

#### Step 3: Create Automated Renewal Alert Workflows

**Step Overview:** Build the 90/60/30-day alert automation that triggers CSM tasks and notifications. End state: Working automation that fires alerts at correct intervals and assigns tasks to renewal owners.

- Build 90-day renewal alert workflow (initial outreach trigger)
- Build 60-day renewal alert workflow (follow-up/escalation trigger)
- Build 30-day renewal alert workflow (urgent action trigger)
- Configure task creation with specific instructions for each stage
- Set up Slack/email notifications to CSM and manager for at-risk accounts
- Add escalation automation for accounts with declining health + upcoming renewal
- Test each workflow with sample accounts to verify correct timing and assignment

#### Step 4: Build Renewal Pipeline Dashboard

**Step Overview:** Create the reporting dashboard showing renewal pipeline, risk distribution, and CSM workload. End state: Live dashboard providing at-a-glance renewal visibility for CS leadership.

- Build renewal pipeline view showing total renewal value by month (next 3-6 months)
- Add health status breakdown (healthy/at-risk/critical) with dollar values
- Create CSM workload view showing renewals by owner with health distribution
- Add trend charts showing health score changes over time
- Include churn risk summary highlighting accounts needing immediate attention
- Configure dashboard permissions and sharing for CS team access
- Set up scheduled dashboard email to leadership (weekly renewal summary)

---

### Part 3: Document CSM Playbook & Processes

#### Step 1: Create Standardized CSM Renewal Playbook

**Step Overview:** Document the step-by-step renewal process with touchpoint cadence, talk tracks, and templates. End state: Written playbook that CSMs can follow for consistent renewal execution.

- Document 90-day touchpoint sequence (email templates, call scripts, meeting agendas)
- Create renewal conversation guide with discovery questions for renewal call
- Build objection handling matrix for common renewal hesitations (budget, usage, competition)
- Document escalation criteria and paths (when to involve leadership, when to offer discounts)
- Create renewal negotiation guidelines (acceptable discount thresholds, approval requirements)
- Include expansion opportunity identification checklist (upsell triggers during renewal)

#### Step 2: Define Renewal Meeting and Review Cadence

**Step Overview:** Establish the ongoing governance cadence for renewal pipeline review. End state: Documented meeting format and cadence for regular renewal pipeline reviews.

- Define weekly renewal pipeline review meeting format (attendees, agenda, duration)
- Create renewal review meeting template with standard discussion points
- Document at-risk account escalation process for pipeline review
- Establish monthly renewal metrics review with leadership (GRR/NRR tracking)
- Set up renewal forecast reporting for finance alignment
- Document handoff process between CSM and renewal owner if different roles

#### Step 3: Build Risk Intervention Workflows

**Step Overview:** Create playbooks for proactive intervention when health scores decline or at-risk signals appear. End state: Documented intervention playbooks for different risk scenarios with specific actions.

- Create "Declining Usage" intervention playbook (re-engagement campaign, training offer)
- Build "Support Escalation" intervention playbook (executive outreach, issue resolution fast-track)
- Document "Silent Account" intervention playbook (accounts with no engagement)
- Create "Executive Sponsor Change" intervention playbook (new relationship building)
- Define intervention timing relative to renewal date (different approaches for 90+ vs 30 days out)
- Include success criteria for each intervention type

---

### Part 4: Launch, Train & Hand Off

#### Step 1: Conduct CS Team Training Session

**Step Overview:** Train the CS team on the new renewal management system, dashboard, and playbooks. End state: CS team trained and confident using the new system for their upcoming renewals.

- Schedule 45-60 minute training session with full CS team
- Walk through renewal dashboard navigation and filters
- Demonstrate health score interpretation and what drives score changes
- Review automated alert workflows and expected task actions
- Practice using CSM playbook with role-play scenario
- Address questions and document additional training needs
- Record session and share with team for reference

#### Step 2: Run Parallel Testing with Live Renewals

**Step Overview:** Validate the system with real upcoming renewals to catch issues before full rollout. End state: Confirmed that alerts, health scores, and dashboards work correctly with live data.

- Select 3-5 upcoming renewals (mix of healthy and at-risk) for pilot testing
- Verify 90/60/30-day alerts fire at correct times for pilot accounts
- Confirm health scores reflect actual account health accurately
- Test CSM playbook execution with pilot accounts
- Document any issues or adjustments needed
- Refine health score weights or alert logic based on pilot feedback

#### Step 3: Create Documentation Package

**Step Overview:** Compile all system documentation for ongoing maintenance and troubleshooting. End state: Complete documentation package enabling client self-sufficiency.

- Document health score formula with signal weights and data sources
- Create alert workflow documentation with logic and troubleshooting steps
- Write dashboard guide explaining each view and how to interpret metrics
- Document CSM playbook with templates and escalation paths
- Create admin guide for adding new accounts, adjusting scores, and modifying alerts
- Package all documentation in shared folder accessible to CS and RevOps

#### Step 4: Establish Ongoing Governance and Hand Off

**Step Overview:** Transfer ownership to client and schedule follow-up refinement. End state: Client self-sufficient with clear ownership and scheduled optimization check-in.

- Transfer admin credentials and system access to client RevOps/CS Ops
- Confirm weekly renewal review meeting is scheduled and recurring
- Schedule 30-day refinement check-in to adjust health score weights based on real usage
- Establish feedback channel for ongoing questions and issues
- Document any outstanding optimizations for future iteration
- Close out project with summary of what was delivered and baseline metrics

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM with customer/account records and contract data (Salesforce, HubSpot, etc.)
- Historical renewal and churn data for at least 6-12 months
- Access to product usage/analytics data (if health scoring includes usage signals)
- CS team capacity to participate in discovery interviews and training
- Clear contract terms documented (renewal dates, auto-renewal clauses, notice periods)

**What client must provide:**
- Admin access to CRM and relevant systems (support platform, product analytics)
- List of current customers with contract end dates and ARR values
- Access to CS leadership for requirements alignment and playbook approval
- Historical churn reasons and any existing customer health tracking

## 5. Common Pitfalls

- **Pitfall 1**: Building health scores without validated churn predictors - using intuition instead of data to weight health signals leads to false positives and alert fatigue. **Mitigation**: Analyze historical churned accounts to identify which signals actually predicted churn before weighting the health score.

- **Pitfall 2**: Over-automating without CSM buy-in - creating complex workflows that CSMs ignore because they weren't involved in design. **Mitigation**: Co-design the playbook and automation with CS team leads; start with simple 90/60/30 alerts before adding complexity.

- **Pitfall 3**: No clear renewal ownership assignment - alerts fire but nobody owns the renewal, leading to the same missed renewals as before. **Mitigation**: Build renewal owner assignment logic into the system (by segment, CSM territory, or account owner) and enforce it as a required field.

- **Pitfall 4**: Focusing only on at-risk accounts - ignoring healthy accounts that could be expansion opportunities or have silent churn signals. **Mitigation**: Include "healthy but quiet" as a segment in the renewal dashboard to catch accounts with declining engagement despite good health scores.

## 6. Success Metrics

- **Leading Indicator**: 100% of renewals have owner assigned and 90-day alerts firing accurately within first 30 days of launch
- **Lagging Indicator**: Gross Revenue Retention (GRR) improves by 3-5 percentage points within two renewal cycles; surprise churn (no prior risk flag) drops to near zero

---

