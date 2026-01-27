# Marketing Reporting Pack - Playbook

## 1. Definition

**What it is**: A comprehensive monthly reporting system that consolidates marketing performance data from MAP, CRM, and BI tools into standardized dashboards and reports, enabling the marketing team to measure KPIs, track campaign performance, and make data-driven decisions aligned with the company's growth model.

**What it is NOT**: Not a one-time analytics audit or ad-hoc reporting. Not Marketing Automation Platform implementation (that's the technical platform setup). Not Lead Attribution (that's the tracking model). Not a Growth Model project (that's defining the targets this pack measures against).

## 2. ICP Value Proposition

**Pain it solves**: Marketing teams lack visibility into true performance because data is fragmented across MAP, CRM, and spreadsheets. Leaders can't answer basic questions like "What's our cost per MQL?" or "Which channels drive pipeline?" without hours of manual data pulling. This leads to misallocated budget and inability to prove marketing's contribution to revenue.

**Outcome delivered**: A self-updating monthly reporting pack with standardized dashboards showing funnel performance, channel attribution, campaign ROI, and pipeline contribution. Marketing team can answer performance questions in minutes instead of hours, and leadership has confidence in the numbers.

**Who owns it**: VP of Marketing or Marketing Operations Manager.

## 3. Implementation Procedure

### Part 1: Define Reporting Requirements & Data Strategy

#### Step 1: Align Reporting Objectives with Growth Model

**Step Overview:** Meet with marketing leadership to define the specific questions the reporting pack must answer and align KPIs with the company's growth model targets. End state: Documented list of priority questions, KPIs, and target benchmarks.

- Schedule kickoff meeting with VP Marketing and Marketing Ops stakeholders
- Review existing growth model to identify marketing-owned metrics (MQLs, pipeline contribution, CAC)
- Document the top 5-7 questions leadership needs answered monthly (e.g., "Are we hitting MQL targets?", "What's our channel mix?")
- Define primary KPIs: MQL volume, MQL-to-SQL conversion rate, pipeline velocity, cost per MQL, marketing-sourced pipeline
- Establish baseline benchmarks and target thresholds for red/yellow/green status indicators
- Get sign-off on reporting priorities before moving to data assessment

#### Step 2: Audit Current Data Sources and Gaps

**Step Overview:** Inventory all available data sources across MAP, CRM, and other platforms to identify what data exists, where it lives, and what gaps need addressing. End state: Data source inventory with gap analysis document.

- List all marketing tech stack tools generating data (HubSpot/Marketo, Salesforce, Google Analytics, ad platforms)
- Document which metrics are available from each source and at what granularity
- Identify data gaps—metrics needed for reporting that don't currently exist or aren't tracked
- Assess data quality issues: missing UTM parameters, inconsistent naming conventions, duplicate records
- Map data refresh frequencies and determine if real-time vs. batch is required
- Document integration points between systems (API connections, native syncs, manual exports)

#### Step 3: Establish Metric Definitions and Ownership

**Step Overview:** Create shared definitions for all metrics to eliminate cross-team discrepancies and assign ownership for each KPI. End state: Metric glossary document with ownership assignments.

- Define MQL criteria to match between MAP and CRM (prevent discrepancy issues between systems)
- Document funnel stage definitions (Lead → MQL → SQL → Opportunity → Closed Won)
- Create attribution model definitions (first-touch, last-touch, multi-touch rules)
- Assign a named owner to each primary metric who is accountable for data accuracy
- Align definitions with Sales/RevOps to ensure consistent reporting across teams
- Publish metric glossary in accessible location (wiki, shared drive)

---

### Part 2: Design and Build Reporting Infrastructure

#### Step 1: Design Reporting Template and Dashboard Prototype

**Step Overview:** Create the visual design and layout for the monthly reporting pack, balancing executive summary views with detailed drill-down capability. End state: Approved mockup/wireframe of the reporting pack structure.

- Design executive summary page with top-level KPIs and red/yellow/green status indicators
- Plan funnel visualization showing conversion rates between stages
- Create channel performance section with spend, leads, and cost-per-lead by channel
- Design campaign performance view for tracking individual campaign ROI
- Include pipeline contribution section showing marketing-sourced vs. influenced pipeline
- Build in trend lines to show month-over-month and year-over-year comparisons
- Review prototype with stakeholders and incorporate feedback before building

#### Step 2: Build Data Pipeline and Connections

**Step Overview:** Establish the technical infrastructure to pull data from source systems into the reporting tool automatically. End state: Automated data pipeline refreshing on schedule without manual intervention.

- Determine reporting tool (native CRM dashboards, BI tool like Tableau/Looker, or GTM system like Vasco)
- Connect primary data sources via native integrations or API
- Build data transformations to harmonize metrics across platforms (consistent naming, date formats)
- Configure refresh schedules (daily recommended for pipeline data, weekly acceptable for campaign metrics)
- Set up error alerting for failed data syncs or connection issues
- Test data accuracy by comparing dashboard output to source system spot-checks

#### Step 3: Build Core Dashboard Components

**Step Overview:** Construct the actual dashboard views and reports in the selected reporting tool. End state: Functional dashboard with all planned components populated with live data.

- Build MQL and lead volume tracking with source breakdowns
- Create funnel conversion rate visualizations (Lead → MQL → SQL → Opp → Closed)
- Construct channel performance tables with spend, leads, CPL, and pipeline contribution
- Add campaign-level performance reports with ROI calculations
- Build pipeline velocity metrics (average time between stages)
- Create forecast vs. actual comparison views tied to growth model targets
- Add filters for date range, segment, region, and other relevant dimensions

---

### Part 3: Validate, Automate, and Document

#### Step 1: Validate Data Accuracy with Stakeholders

**Step Overview:** Conduct thorough validation of dashboard data against source systems with stakeholder review to build trust in the numbers. End state: Stakeholders confirm data matches expectations and approve for production use.

- Pull sample data from CRM and compare to dashboard output for the same period
- Walk through each metric with Marketing Ops to verify calculations are correct
- Have Sales/RevOps validate pipeline numbers match their Salesforce reports
- Document any known discrepancies and their root causes
- Fix data issues identified during validation before going live
- Get formal sign-off from marketing leadership on data accuracy

#### Step 2: Automate Report Generation and Distribution

**Step Overview:** Set up automated report delivery so the monthly pack arrives without manual effort. End state: Reports auto-generate and distribute to stakeholders on schedule.

- Configure scheduled report snapshots at month-end
- Set up automated email distribution to marketing team and leadership
- Create PDF export templates for board/executive presentations
- Configure automated alerts for metrics hitting threshold triggers (e.g., MQL below target)
- Test end-to-end automation by running a full cycle manually
- Document the automation schedule and recipient lists

#### Step 3: Create Documentation and Maintenance Runbook

**Step Overview:** Document the entire reporting system so the client can maintain and troubleshoot it independently. End state: Complete documentation package enabling client self-sufficiency.

- Create metric glossary with calculation methodologies
- Document data source connections and refresh schedules
- Write troubleshooting guide for common issues (failed refreshes, data discrepancies)
- Create "How to add a new metric" guide for future expansion
- Document access permissions and admin credentials
- Include contact information for tool vendor support

---

### Part 4: Launch, Enable, and Hand Off

#### Step 1: Conduct Marketing Team Training

**Step Overview:** Train the marketing team on how to use the reporting pack for their regular decision-making. End state: Team confidently using reports in weekly/monthly rhythms.

- Schedule training session (45-60 minutes) with full marketing team
- Walk through each dashboard section and explain metric definitions
- Demonstrate how to apply filters and drill into data
- Show how to export data and create ad-hoc views
- Address questions about interpreting the data
- Record session and share with team for future reference
- Provide quick-reference guide for common actions

#### Step 2: Establish Reporting Cadence and Rituals

**Step Overview:** Integrate the reporting pack into the team's operating rhythm by establishing when and how it will be used. End state: Reporting pack embedded into standing meetings and decision processes.

- Define monthly review meeting where pack is primary input (e.g., Monthly Marketing Review)
- Establish weekly check-in metrics for marketing leadership
- Create agenda template for monthly review meeting tied to report sections
- Assign responsibility for presenting each section of the pack
- Document escalation process when metrics are off-target
- Schedule first monthly review meeting on the calendar

#### Step 3: Hand Off to Client and Close Project

**Step Overview:** Transfer full ownership of the reporting system to the client team with all documentation and access. End state: Client self-sufficient with scheduled check-in planned.

- Transfer admin access to client Marketing Ops lead
- Deliver complete documentation package (runbook, glossary, troubleshooting guide)
- Review known limitations and future enhancement opportunities
- Schedule 30-day check-in to address any issues after go-live
- Document lessons learned and recommendations for future improvements
- Formally close project and confirm client acceptance

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Growth Model defined with marketing targets (MQL goals, pipeline contribution targets)
- Marketing Automation Platform implemented and tracking leads
- CRM system with opportunity/pipeline tracking in place
- Lead Lifecycle stages defined and implemented
- Basic UTM tracking or campaign tracking in place

**What client must provide:**
- Admin access to MAP (HubSpot/Marketo), CRM (Salesforce), and any BI tools
- Stakeholder availability for requirements gathering (VP Marketing, Marketing Ops)
- List of current ad-hoc reports and what questions they're trying to answer
- Historical data access for establishing baselines (minimum 6 months preferred)
- Clarity on reporting tool preference (native CRM, BI tool, or GTM system)
- Budget information for channel spend tracking (if tracking marketing ROI)

## 5. Common Pitfalls

- **Data discrepancy between tools destroys trust**: When stakeholders see different MQL counts in the dashboard vs. CRM, they lose confidence in all the data and revert to manual spreadsheets. → **Mitigation**: Establish metric definitions upfront, validate exhaustively before launch, and document known discrepancies with explanations.

- **Tracking vanity metrics instead of revenue-tied KPIs**: Reporting on email opens, page views, and social followers creates the illusion of progress while missing pipeline impact. → **Mitigation**: Anchor every metric back to the growth model and pipeline contribution; if a metric doesn't connect to revenue, question whether it belongs.

- **Building top-of-funnel only and ignoring the full journey**: Dashboard shows leads and MQLs but doesn't connect to SQL, pipeline, and closed-won outcomes. → **Mitigation**: Build full-funnel visibility from first touch through closed-won, ensuring marketing can see true conversion and revenue impact.

- **No metric ownership leads to data decay**: Without someone accountable for each metric, data quality degrades over time as definitions drift and sources break. → **Mitigation**: Assign named owners to every primary metric and include data quality check in monthly review cadence.

## 6. Success Metrics

- **Leading Indicator**: Time to answer marketing performance questions drops from hours to under 5 minutes; marketing team actively references dashboards in weekly meetings.

- **Lagging Indicator**: Marketing can accurately forecast pipeline contribution within 10% accuracy; leadership expresses confidence in marketing metrics during board meetings; budget allocation decisions are made using dashboard data rather than gut feel.

---

