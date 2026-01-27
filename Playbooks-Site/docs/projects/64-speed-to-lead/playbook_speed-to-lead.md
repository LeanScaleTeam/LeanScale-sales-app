# Speed-to-Lead - Playbook

## 1. Definition

**What it is**: A comprehensive assessment and implementation project that identifies and eliminates systemic delays in the lead management lifecycle, optimizes lead routing and follow-up processes across MAP/CRM/routing tools, and establishes measurable SLAs to ensure inbound leads receive prompt, efficient follow-up that directly improves lead-to-opportunity conversion rates.

**What it is NOT**: Not a Lead Routing-only project (that's a subset of this). Not a CRM Implementation (assumes CRM exists). Not a Sales Engagement Platform setup (that's sequencing/cadences). Not a Marketing Automation Platform migration. Not Lead Scoring (though scoring may inform prioritization).

## 2. ICP Value Proposition

**Pain it solves**: Sales teams are losing deals because leads sit untouched for hours or days. The average B2B lead response time is 47 hours, yet conversion rates drop 80% after the first 5 minutes. Manual routing, disjointed systems, and lack of SLA visibility create bottlenecks that let competitors win by responding first.

**Outcome delivered**: Sub-10-minute response times for high-intent leads with automated routing, real-time SLA tracking, and rep accountability dashboards. Intent-specific routing ensures hand-raisers get immediate attention while lower-priority leads are efficiently queued. Teams see measurable improvement in lead-to-opportunity conversion rates.

**Who owns it**: VP of Sales Operations, RevOps Leader, or VP of Marketing (depending on where lead management sits in the org).

## 3. Implementation Procedure

### Part 1: Discovery & Current State Assessment

#### Step 1: Map Current Lead Flow End-to-End

**Step Overview:** Document how leads currently flow from capture to first sales touch across all systems. End state: Visual process map showing every handoff point and system involved.

- Identify all lead sources (web forms, chat, paid media, events, content syndication)
- Trace lead path through MAP, CRM, and any routing tools (Chili Piper, LeanData, etc.)
- Document each system handoff and data transformation point
- Note where manual intervention is required vs. automated
- Create swimlane diagram showing marketing, RevOps, and sales touchpoints

#### Step 2: Measure Current Lead Response Times

**Step Overview:** Establish baseline metrics for how long leads currently wait before first contact. End state: Quantified baseline showing actual response times by lead source and segment.

- Pull lead response time data from CRM for last 90 days
- Segment by lead source (demo request vs. content download vs. event)
- Calculate average, median, and 90th percentile response times
- Identify which lead types have longest delays
- Document current SLAs (if any exist) and actual performance against them

#### Step 3: Identify Bottlenecks and Delay Sources

**Step Overview:** Pinpoint specific causes of delay in the lead management process. End state: Prioritized list of bottlenecks with estimated time impact of each.

- Analyze where leads queue longest (system transitions, assignment, follow-up)
- Check for data quality issues causing routing failures or manual intervention
- Review enrichment processes for delays (batch vs. real-time)
- Interview 3-5 sales reps/BDRs on pain points and perceived delays
- Interview 1-2 marketing ops team members on lead handoff challenges

---

### Part 2: Design SLA Framework & Routing Strategy

#### Step 1: Define Intent-Based Lead Segmentation

**Step Overview:** Create lead categories based on buying intent signals to enable differentiated response time targets. End state: Documented lead segmentation model with clear criteria for each tier.

- Define high-intent indicators (demo requests, pricing page visits, competitor comparisons)
- Define medium-intent indicators (content downloads, webinar attendance)
- Define low-intent indicators (general newsletter, trade show booth scans)
- Map existing lead scoring to intent tiers (or design scoring if none exists)
- Document routing priority for each segment

#### Step 2: Establish Response Time SLAs by Segment

**Step Overview:** Set specific, measurable response time targets for each lead segment. End state: Documented SLA framework approved by sales and marketing leadership.

- Set SLA for high-intent leads (recommend 5-10 minutes)
- Set SLA for medium-intent leads (recommend 1-4 hours)
- Set SLA for low-intent leads (recommend 24 hours)
- Define what constitutes "response" (call attempt, email, meeting scheduled)
- Get sign-off from VP Sales and VP Marketing on SLA targets

#### Step 3: Design Optimized Routing Logic

**Step Overview:** Architect the routing rules that will get the right lead to the right rep at the right time. End state: Documented routing logic ready for implementation.

- Define routing criteria (territory, account ownership, round-robin, capacity-based)
- Design escalation paths when assigned rep doesn't respond within SLA
- Plan for edge cases (no territory match, existing account, named accounts)
- Map rep capacity and availability considerations (PTO, working hours)
- Document fallback routing for after-hours and overflow scenarios

---

### Part 3: System Configuration & Automation Build

#### Step 1: Configure Lead Routing Automation

**Step Overview:** Implement automated routing rules in the routing tool (Chili Piper, LeanData, or native CRM). End state: Leads automatically route to correct rep within seconds of creation.

- Build routing rules based on approved logic document
- Configure assignment priorities and weighting
- Set up account matching to route to existing account owners
- Configure round-robin pools with availability/capacity settings
- Test routing with sample leads across all segments and territories

#### Step 2: Implement Real-Time Enrichment Pipeline

**Step Overview:** Ensure lead data is enriched before routing to enable accurate assignment and rep context. End state: Leads enriched with company/contact data in real-time before assignment.

- Configure enrichment tool (ZoomInfo, Apollo, Clearbit) for real-time firing
- Map enrichment fields to CRM fields (company size, industry, tech stack)
- Set fallback values for leads that don't match enrichment databases
- Test enrichment latency to ensure it doesn't delay routing
- Verify enriched data flows correctly to rep views

#### Step 3: Build SLA Tracking Fields and Automation

**Step Overview:** Create the data infrastructure to measure and enforce SLAs. End state: CRM captures timestamps and calculates SLA status automatically.

- Create timestamp fields: Lead Created, First Assigned, First Touch Attempt
- Build formula/workflow to calculate response time in minutes
- Create SLA Status field (Met, At Risk, Breached)
- Configure real-time alerts when leads approach SLA breach
- Set up automated escalation when SLA is breached (reassign or notify manager)

#### Step 4: Configure Rep Notification System

**Step Overview:** Ensure reps are immediately notified of new lead assignments through their preferred channels. End state: Multi-channel notifications that reps actually see and act on.

- Configure email notifications for new lead assignments
- Set up Slack/Teams notifications for real-time alerts
- Configure mobile push notifications if available
- Include lead context in notifications (name, company, intent signal, SLA countdown)
- Test notification delivery speed and visibility with pilot reps

---

### Part 4: Dashboard & Reporting Build

#### Step 1: Build Real-Time SLA Performance Dashboard

**Step Overview:** Create a live dashboard showing current SLA status across all leads and reps. End state: Leadership and reps can see real-time SLA performance at a glance.

- Build lead queue view showing open leads by SLA status (green/yellow/red)
- Create rep-level SLA scorecard showing individual performance
- Add trend line showing average response time over rolling 7/30 days
- Include drill-down capability to see individual lead details
- Ensure dashboard auto-refreshes for real-time monitoring

#### Step 2: Build SLA Compliance Reporting

**Step Overview:** Create weekly/monthly reports for SLA performance review and accountability. End state: Automated reports delivered to leadership showing compliance trends.

- Build SLA compliance report by rep (% of leads contacted within SLA)
- Build SLA compliance report by lead source/segment
- Create trend analysis showing improvement over time
- Include breakdown of breach reasons (after hours, rep overload, routing issue)
- Schedule automated report delivery to sales and marketing leadership

#### Step 3: Build Conversion Impact Analysis

**Step Overview:** Create reporting that ties response time to downstream conversion metrics. End state: Clear visibility into how speed-to-lead impacts pipeline and revenue.

- Build report showing conversion rate by response time bucket
- Calculate pipeline value generated from SLA-compliant vs. breached leads
- Create comparison of before/after implementation metrics
- Track win rate correlation with response time
- Document ROI methodology for executive reporting

---

### Part 5: Rollout & Team Enablement

#### Step 1: Conduct Rep Training on New Process

**Step Overview:** Train sales reps and BDRs on the new lead notification, response expectations, and SLA tracking. End state: All reps understand the new process and their accountability.

- Schedule 30-45 minute training session for sales team
- Cover: new notification system, SLA expectations, escalation process
- Demonstrate how to view their SLA dashboard and lead queue
- Walk through the "ideal response" workflow
- Address questions and concerns about accountability

#### Step 2: Create Process Documentation

**Step Overview:** Document the new speed-to-lead process for ongoing reference and new hire onboarding. End state: Complete process documentation accessible to all stakeholders.

- Create quick-reference guide for reps (1-pager on response workflow)
- Document routing rules and logic for RevOps maintenance
- Create SLA definitions and measurement methodology doc
- Build FAQ for common scenarios and edge cases
- Store documentation in team wiki/knowledge base

#### Step 3: Execute Pilot Rollout

**Step Overview:** Launch with a pilot group before full rollout to identify issues. End state: Pilot complete with lessons learned documented.

- Select pilot group (1-2 territories or specific rep team)
- Run pilot for 1-2 weeks with close monitoring
- Gather pilot rep feedback on notification effectiveness and workload
- Identify and fix any routing errors or system issues
- Document changes needed before full rollout

#### Step 4: Execute Full Rollout

**Step Overview:** Launch the new speed-to-lead process across the entire sales organization. End state: All reps live on new process with full SLA tracking active.

- Communicate launch to full sales team
- Enable routing and notifications for all territories
- Monitor first 48 hours closely for issues
- Provide real-time support for rep questions
- Send day-1 and week-1 performance snapshots to leadership

---

### Part 6: Optimization & Handoff

#### Step 1: Conduct 2-Week Performance Review

**Step Overview:** Analyze initial performance data and make adjustments. End state: Performance baseline established with initial optimizations implemented.

- Review SLA compliance rates across all segments
- Identify underperforming areas (specific reps, lead sources, time periods)
- Adjust routing rules based on actual capacity/performance
- Fine-tune notification cadence if reps report alert fatigue
- Implement quick wins identified during review

#### Step 2: Deliver Executive Summary

**Step Overview:** Present results and impact to leadership with recommendations for ongoing optimization. End state: Leadership aligned on results and next steps.

- Compile before/after metrics comparison
- Calculate ROI based on conversion improvement
- Present findings to VP Sales and VP Marketing
- Provide recommendations for continued improvement
- Document any out-of-scope items for future phases

#### Step 3: Hand Off to Client RevOps

**Step Overview:** Transfer ownership and documentation to client team for ongoing management. End state: Client self-sufficient with admin access and maintenance runbooks.

- Transfer admin credentials and access to client RevOps
- Walk through routing rule maintenance procedures
- Review SLA threshold adjustment process
- Deliver complete documentation package
- Schedule 30-day check-in call
- Close out project

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce or HubSpot) with lead object configured
- Marketing Automation Platform integrated with CRM
- Lead sources actively generating inbound leads
- Basic lead data flowing into CRM (name, email, company at minimum)
- Sales team/BDRs assigned to work inbound leads

**What client must provide:**
- Admin access to CRM, MAP, and any routing tools
- Current lead routing documentation (if it exists)
- Territory/rep assignment rules or criteria
- Stakeholder availability for interviews and sign-offs
- Decision on SLA targets (or delegation to recommend)
- Access to historical lead data for baseline analysis

## 5. Common Pitfalls

- **Pitfall 1: Setting SLAs without system support** - Teams commit to 5-minute SLAs but don't have real-time notifications or alerts set up. Reps don't even know leads are waiting. **Mitigation**: Build the notification and tracking infrastructure before announcing SLA expectations.

- **Pitfall 2: Ignoring data quality upstream** - Routing rules depend on fields (territory, industry, company size) that are often blank or wrong. Leads route incorrectly or get stuck. **Mitigation**: Implement real-time enrichment before routing and build fallback rules for unmatched leads.

- **Pitfall 3: Overloading top performers** - Without capacity-based routing, best reps get slammed while others are underutilized. SLAs suffer despite good intentions. **Mitigation**: Implement capacity limits and round-robin with availability awareness.

- **Pitfall 4: Measuring response time incorrectly** - Using "lead created" timestamp when leads sit in MAP for hours before syncing to CRM. Real delay is hidden. **Mitigation**: Measure from true inbound moment (form submission) not CRM record creation.

## 6. Success Metrics

- **Leading Indicator**: Average response time drops below SLA target within first 2 weeks; SLA compliance rate exceeds 80%
- **Lagging Indicator**: Lead-to-opportunity conversion rate improves 15-30% within 60-90 days; qualified pipeline from inbound increases measurably

---

