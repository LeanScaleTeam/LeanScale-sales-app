# Marketing-to-Sales Handoff & SLA Tracking - Playbook

## 1. Definition

**What it is**: A cross-functional implementation project that establishes clear lead qualification criteria, automated handoff workflows, and measurable SLAs between Marketing and Sales teams to ensure every qualified lead receives timely, consistent follow-up with full visibility into response times and conversion performance.

**What it is NOT**: Not a Lead Scoring implementation (that's about ranking leads by fit/intent). Not a Lead Routing project (that's about assignment rules). Not a Marketing Attribution project (that's about source/channel tracking). Not a GTM Lifecycle build (that's about stage definitions across the full funnel).

## 2. ICP Value Proposition

**Pain it solves**: Marketing generates leads that fall into a black hole—Sales claims leads are unqualified, Marketing claims Sales isn't following up, and leadership has no visibility into response times or handoff bottlenecks. Average B2B response time is 42 hours, and 58% of companies don't respond at all, resulting in lost revenue from leads that go cold.

**Outcome delivered**: A documented handoff process with clear MQL/SQL definitions, automated lead routing with SLA timers, real-time dashboards showing response times and follow-up compliance, and a feedback loop that improves lead quality over time. Companies with active SLAs are 34% more likely to see greater YoY ROI.

**Who owns it**: VP of Marketing or VP of Sales Operations, with joint accountability between Marketing Ops and Sales Ops/RevOps.

## 3. Implementation Procedure

### Part 1: Discovery & Stakeholder Alignment

#### Step 1: Audit Current Handoff Process

**Step Overview:** Document how leads currently flow from Marketing to Sales, including where breakdowns occur. End state: Gap analysis showing current handoff points, SLA gaps, and conversion bottlenecks.

- Interview Marketing Ops, Sales Ops, and 2-3 SDRs/AEs on current lead flow
- Pull MQL-to-SQL conversion rates from CRM for last 90 days
- Document current lead stages and status values in CRM/MAP
- Identify where leads are getting stuck or falling through cracks
- Measure current average response time to new MQLs
- Quantify lead leakage (leads passed but never worked)

#### Step 2: Align on Definitions and Goals

**Step Overview:** Get Marketing and Sales leadership to agree on shared definitions for MQL, SAL (Sales Accepted Lead), and SQL. End state: Documented qualification criteria and success metrics approved by both teams.

- Facilitate alignment meeting with Marketing, Sales, and RevOps leadership
- Define MQL criteria using firmographics (industry, company size, title) and behavioral signals (demo requests, content engagement, webinar attendance)
- Define SQL criteria using frameworks like BANT (Budget, Authority, Need, Timeline)
- Agree on SAL stage for Sales acceptance before full qualification
- Document shared KPIs: MQL-to-SQL conversion rate, average response time, SLA compliance rate
- Get sign-off from VP Marketing and VP Sales on definitions

#### Step 3: Define SLA Requirements

**Step Overview:** Establish specific response time commitments, follow-up cadences, and escalation rules. End state: SLA framework document with timelines, touch requirements, and recycling rules.

- Set response time SLA by lead type (e.g., demo requests within 5 minutes, content leads within 4 hours)
- Define required follow-up cadence (number of calls, emails, touches)
- Establish rules for lead recycling (when unresponsive leads return to Marketing)
- Define escalation paths for SLA breaches (manager notification, reassignment)
- Document lead rejection criteria and required feedback fields
- Get stakeholder approval on SLA commitments

---

### Part 2: CRM/MAP Configuration

#### Step 1: Configure Lead Status and Stage Fields

**Step Overview:** Set up the CRM and MAP fields needed to track handoff stages and SLA compliance. End state: Lead status picklist and date/time stamp fields configured and documented.

- Create or update Lead Status picklist values (New, MQL, SAL, SQL, Recycled, Disqualified)
- Add date/time stamp fields for MQL Date, SAL Date, SQL Date
- Create First Response Date field to track time-to-first-touch
- Add SLA Breach checkbox or formula field
- Configure Lead Rejection Reason picklist for Sales feedback
- Document field definitions in data dictionary

#### Step 2: Build Handoff Automation Rules

**Step Overview:** Configure automation to move leads through handoff stages and trigger notifications. End state: Working automation that routes MQLs to Sales and tracks stage transitions.

- Build MQL qualification automation based on scoring threshold or trigger criteria
- Configure lead assignment rules (round-robin, territory, account-based)
- Set up auto-assignment to SDR queues or specific reps
- Create workflow to stamp MQL Date when lead qualifies
- Build SAL/SQL stage transition rules based on Sales actions
- Test automation with sample leads through full handoff flow

#### Step 3: Configure SLA Timer and Notifications

**Step Overview:** Implement SLA tracking with automated alerts for approaching and breached SLAs. End state: SLA timers active with notifications firing to reps and managers.

- Set up SLA timer starting from MQL Date (or assignment time)
- Configure tiered notifications: 50% of SLA elapsed, 80% elapsed, SLA breached
- Route notifications via email and Slack/Teams integration
- Build escalation to manager for SLA breaches
- Configure pause/stop conditions for SLA timer (e.g., paused if lead responds)
- Set up SLA timer for SAL-to-SQL conversion if applicable

---

### Part 3: Reporting & Dashboard Build

#### Step 1: Build SLA Compliance Dashboard

**Step Overview:** Create a dashboard showing real-time SLA performance by rep, team, and lead source. End state: Live dashboard accessible to Sales and Marketing leadership.

- Build report showing response time distribution (under SLA, approaching, breached)
- Create SLA compliance rate by SDR/AE and by team
- Add trending view of SLA performance over time
- Include drill-down capability to individual lead records
- Configure dashboard filters by date range, lead source, and owner
- Share dashboard with Sales leadership, Marketing Ops, and RevOps

#### Step 2: Build Handoff Conversion Reporting

**Step Overview:** Create reports tracking conversion rates through each handoff stage. End state: Funnel reporting showing MQL-to-SAL, SAL-to-SQL, and SQL-to-Opportunity conversion rates.

- Build funnel report: MQL > SAL > SQL > Opportunity
- Calculate conversion rates at each stage
- Add average cycle time between stages
- Create report showing rejection reasons and volumes
- Build lead source performance by conversion rate
- Set up scheduled report delivery to stakeholders

#### Step 3: Create Feedback Loop Reporting

**Step Overview:** Build reporting that captures Sales feedback on lead quality to improve Marketing targeting. End state: Lead quality feedback visible to Marketing with actionable insights.

- Build report on Lead Rejection Reasons by volume and trend
- Create lead quality score based on SAL acceptance rate by source/campaign
- Build report showing which Marketing campaigns produce highest SQL conversion
- Set up weekly digest of rejection feedback to Marketing Ops
- Document process for Marketing to act on feedback data

---

### Part 4: Rollout & Enablement

#### Step 1: Create Process Documentation

**Step Overview:** Document the handoff process, SLAs, and system instructions in SOPs and quick-reference guides. End state: Published documentation accessible to all stakeholders.

- Write SLA playbook with response time requirements and escalation paths
- Create SDR/AE quick-reference guide for lead handling
- Document CRM field definitions and status transition rules
- Build FAQ document addressing common questions
- Create process flow diagram showing handoff stages
- Publish documentation in team wiki or knowledge base

#### Step 2: Conduct Team Training

**Step Overview:** Train Sales and Marketing teams on the new handoff process, SLAs, and reporting. End state: Teams trained and equipped to follow the new process.

- Schedule training session for SDR/AE team (30-45 minutes)
- Cover: lead status definitions, SLA requirements, CRM actions required
- Demo the SLA notifications and what to do when alerts fire
- Walk through dashboards and how to check personal SLA performance
- Train Marketing Ops on feedback loop reporting
- Send recording and documentation to all attendees

#### Step 3: Launch and Validate

**Step Overview:** Go live with the new process and validate that automation, notifications, and reporting are working correctly. End state: Process live with confirmed functionality.

- Activate all automation and SLA timers
- Monitor first 24-48 hours for any automation errors
- Verify notifications are reaching correct recipients
- Test dashboard data accuracy with sample lead records
- Confirm SLA timers are calculating correctly
- Address any issues identified during validation

---

### Part 5: Monitor & Optimize

#### Step 1: Conduct 30-Day Review

**Step Overview:** Review SLA performance and process adoption at 30 days post-launch. End state: Performance baseline established with initial optimization recommendations.

- Pull SLA compliance metrics for first 30 days
- Calculate MQL-to-SQL conversion rate vs. baseline
- Review rejection reasons and lead quality feedback
- Gather qualitative feedback from SDRs and Marketing
- Identify any automation or notification issues
- Document optimization recommendations

#### Step 2: Iterate and Refine

**Step Overview:** Implement improvements based on 30-day review findings and establish ongoing governance. End state: Optimized process with regular review cadence established.

- Adjust SLA timers if response time targets need refinement
- Update MQL qualification criteria based on Sales feedback
- Refine notification timing or escalation rules as needed
- Schedule monthly Sales-Marketing alignment meeting
- Set up quarterly SLA review cadence
- Hand off ongoing monitoring to RevOps owner

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce or HubSpot) with admin access for configuration
- Marketing Automation Platform connected to CRM
- Lead scoring or qualification criteria defined (or project to define them)
- Lead routing/assignment rules in place (or concurrent project)
- Executive sponsorship from both Sales and Marketing leadership

**What client must provide:**
- Access to CRM and MAP admin settings
- Historical lead and conversion data (90 days minimum)
- Time from Sales Ops, Marketing Ops, and SDR/AE stakeholders for interviews
- Decision-makers available for alignment meetings
- Slack/Teams access if integrating notifications

## 5. Common Pitfalls

- **Pitfall 1**: Marketing and Sales can't agree on MQL definition, causing endless debate. -> **Mitigation**: Start with objective, measurable criteria (job title list, company size range, specific actions). Use data to validate—show which criteria correlate with closed-won deals.

- **Pitfall 2**: SLAs are set but not enforced, becoming meaningless. -> **Mitigation**: Build automated escalation that notifies managers of breaches. Include SLA compliance in SDR/AE performance reviews. Make dashboards visible to leadership.

- **Pitfall 3**: Sales rejects leads without providing feedback, killing the feedback loop. -> **Mitigation**: Make rejection reason a required field when changing lead status. Keep the picklist short (5-7 options) to reduce friction. Review rejection data in weekly Sales-Marketing sync.

- **Pitfall 4**: SLA timers don't account for business hours, unfairly penalizing reps. -> **Mitigation**: Configure SLA calculations to use business hours only. Exclude weekends and holidays. Test timer accuracy before launch.

## 6. Success Metrics

- **Leading Indicator**: SLA compliance rate above 85% within first 30 days; average response time under target (e.g., < 1 hour for demo requests)

- **Lagging Indicator**: MQL-to-SQL conversion rate increases by 20%+ within 90 days; lead acceptance rate improves from baseline (typical B2B baseline is 42%)

---

