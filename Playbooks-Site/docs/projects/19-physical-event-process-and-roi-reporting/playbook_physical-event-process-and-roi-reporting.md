# Physical Event Process and ROI Reporting - Playbook

## 1. Definition

**What it is**: A strategic and technical implementation project that establishes standardized processes for planning, executing, and measuring in-person events (trade shows, conferences, field events), including lead capture workflows, CRM/MAP integration, and ROI reporting dashboards to track event performance and pipeline impact.

**What it is NOT**: Not a virtual/digital event platform implementation. Not a marketing automation platform setup (assumes MAP exists). Not a general CRM implementation project. Not event logistics/vendor management (focuses on RevOps processes, not venue booking).

## 2. ICP Value Proposition

**Pain it solves**: Marketing teams invest significant budget in physical events but lack visibility into true ROI. Lead capture is inconsistent or manual, follow-up is delayed (80% of trade show leads never receive follow-up), and there's no standardized way to measure pipeline influenced by events vs. other channels.

**Outcome delivered**: Standardized event playbook with documented processes for pre-event planning, on-site lead capture, and post-event follow-up. Automated lead flow from capture tools to CRM/MAP. ROI dashboards showing leads generated, pipeline influenced, and revenue attributed to each event with 30/60/90-day tracking.

**Who owns it**: VP of Marketing or Director of Field Marketing, with RevOps/Marketing Ops as implementation partner.

## 3. Implementation Procedure

### Part 1: Event Strategy & Process Definition

#### Step 1: Audit Current Event Operations

**Step Overview:** Assess the client's current approach to physical events, including how leads are captured, processed, and measured. End state: Gap analysis documenting what's working, what's missing, and priority areas for improvement.

- Interview marketing and sales stakeholders on current event processes and pain points
- Review last 3-5 events for lead capture methods used (badge scanners, paper forms, apps)
- Analyze existing event data in CRM to assess data quality and completeness
- Document current lead handoff process from marketing to sales post-event
- Identify gaps in attribution and ROI tracking capabilities
- Quantify the problem (e.g., "Average 5-day delay from event to lead upload")

#### Step 2: Define Event Goals and Success Metrics Framework

**Step Overview:** Establish standardized goals and KPIs that will apply to all physical events, aligned with overall GTM objectives. End state: Documented event goals framework with primary and secondary metrics for different event types.

- Define primary event objectives by event type (trade show vs. conference vs. field event)
- Establish lead generation targets (MQLs, qualified conversations, demos booked)
- Set pipeline influence metrics (pipeline created within 30/60/90 days)
- Define revenue attribution methodology (first-touch, multi-touch, or influenced)
- Create event tier classification system (Tier 1/2/3) based on investment and expected returns
- Document expected ROI benchmarks by event tier (industry average is 5:1 for enterprise B2B)

#### Step 3: Design Standard Event Process Workflows

**Step Overview:** Create repeatable, documented workflows for the full event lifecycle following the 40-20-40 framework (pre-event, during event, post-event). End state: Event SOP document with checklists and process maps for each phase.

- Document pre-event planning checklist (6-8 weeks before): goals, target accounts, messaging
- Create on-site lead capture protocol: who captures, what data, how qualified
- Design post-event follow-up workflow: timelines, ownership, escalation paths
- Define lead qualification criteria specific to events (BANT, engagement level)
- Create lead routing rules for post-event handoff to sales
- Build event briefing template for sales team pre-event

---

### Part 2: Lead Capture & CRM Integration

#### Step 1: Select and Configure Lead Capture Tools

**Step Overview:** Evaluate and implement lead capture technology that integrates with the client's CRM and MAP. End state: Lead capture solution selected, configured, and ready for testing.

- Assess current lead capture tools (badge scanners, event apps, QR codes)
- Evaluate options based on CRM compatibility: native integrations with Salesforce/HubSpot
- Consider tools like Cvent, Bizzabo, momencio, or built-in scanner apps
- Configure lead capture forms with required fields (contact info, qualification questions)
- Set up QR code or smart badge scanning capabilities
- Test data capture with sample leads to verify field mapping

#### Step 2: Build CRM Campaign Structure for Events

**Step Overview:** Create standardized CRM campaign structure that will house event leads and enable attribution. End state: Campaign templates and hierarchy set up in CRM for consistent event tracking.

- Design campaign hierarchy (Parent campaign for event, child campaigns for sessions/activities)
- Create campaign member statuses reflecting event engagement (Registered, Attended, Met with Rep, Demo Requested)
- Build campaign templates that can be cloned for each new event
- Configure campaign attribution settings (first-touch, influenced, multi-touch)
- Set up UTM parameter conventions for event-related digital touchpoints
- Document campaign naming conventions for consistency

#### Step 3: Configure Lead Flow Automation

**Step Overview:** Set up automated workflows to move leads from capture tools into CRM/MAP with proper routing and enrichment. End state: Same-day automated lead flow from event capture to CRM with assignment rules.

- Build integration between lead capture tool and CRM (API, native, or Zapier)
- Configure automatic lead creation with event campaign membership
- Set up lead enrichment triggers (ZoomInfo, Clearbit, or similar)
- Create lead routing rules based on territory, account ownership, or round-robin
- Build automated lead assignment notifications to sales reps
- Configure same-day follow-up task creation for assigned reps
- Test end-to-end flow with sample data before first event

---

### Part 3: ROI Reporting & Dashboards

#### Step 1: Define ROI Calculation Methodology

**Step Overview:** Establish the specific formulas and attribution logic that will be used to calculate event ROI consistently. End state: Documented ROI methodology with clear definitions and calculation examples.

- Define event cost tracking categories (booth, travel, sponsorship, swag, staff time)
- Establish revenue attribution windows (30, 60, 90-day and 6-month tracking)
- Choose attribution model (first-touch, influenced, or blended)
- Create pipeline influence calculation logic (opportunity touched by event contact)
- Define "event-sourced" vs. "event-influenced" pipeline distinction
- Document ROI formula: (Pipeline Influenced - Event Cost) / Event Cost

#### Step 2: Build Event Performance Dashboards

**Step Overview:** Create CRM/BI dashboards that visualize event performance, lead flow, and ROI metrics. End state: Live dashboards accessible to marketing and sales leadership showing event ROI.

- Build lead metrics dashboard: leads captured, MQL conversion, SQL conversion by event
- Create pipeline dashboard: opportunities created, pipeline value, by event and timeframe
- Design ROI summary view: cost vs. pipeline, projected vs. actual ROI
- Add trend analysis: event performance over time, year-over-year comparison
- Include drill-down capability to individual event and lead level
- Configure scheduled report delivery to stakeholders (weekly/monthly)

#### Step 3: Create Event Post-Mortem Report Template

**Step Overview:** Build a standardized post-event report template that captures learnings and ROI for each event. End state: Reusable report template with automated data population where possible.

- Design report template sections: goals vs. actuals, lead summary, pipeline, ROI, learnings
- Configure automated data pulls for lead and pipeline metrics
- Include qualitative sections for team feedback and improvement recommendations
- Add benchmark comparison to previous events and industry averages
- Create executive summary format for leadership reviews
- Document report timeline (preliminary at 30 days, final at 90 days)

---

### Part 4: Enablement & Continuous Improvement

#### Step 1: Train Marketing Team on Event Processes

**Step Overview:** Enable the marketing team on new event workflows, tools, and reporting. End state: Marketing team trained and confident executing events with new processes.

- Conduct training session on event planning SOP and checklists (60-90 min)
- Walk through lead capture tool usage and troubleshooting
- Review campaign setup process and naming conventions
- Demonstrate dashboard access and interpretation
- Create quick-reference guide for on-site lead capture
- Record training session for future team members

#### Step 2: Train Sales Team on Lead Follow-Up

**Step Overview:** Enable sales team on event lead handling, follow-up expectations, and how to leverage event context. End state: Sales team trained on event lead workflow with clear SLAs.

- Conduct sales training on event lead routing and assignment (30-45 min)
- Set follow-up SLA expectations (same-day or next-day for hot leads)
- Provide talk tracks leveraging event context ("We met at [Event]...")
- Review how to update lead status and log activities in CRM
- Share dashboard access for visibility into event pipeline
- Create follow-up email templates for post-event outreach

#### Step 3: Document and Hand Off to Client

**Step Overview:** Transfer all documentation, templates, and ownership to client team. End state: Client self-sufficient with complete documentation package.

- Compile event playbook with all SOPs, checklists, and templates
- Document tool configurations and admin access credentials
- Create troubleshooting guide for common issues
- Deliver final documentation package to client RevOps
- Schedule 30-day check-in to review first event execution
- Close out project with final summary and recommendations

#### Step 4: Establish Continuous Improvement Process

**Step Overview:** Set up ongoing review cadence to iterate on event processes based on performance data. End state: Quarterly review process established with improvement framework.

- Define quarterly event review cadence with marketing leadership
- Create improvement tracking document for process iterations
- Set up event benchmarking to compare performance across events
- Establish feedback loop from sales on lead quality
- Document process for updating SOPs based on learnings
- Schedule first quarterly review 90 days post-implementation

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce or HubSpot) in place with admin access
- Marketing automation platform configured and integrated with CRM
- At least one upcoming physical event within 60 days for pilot
- Budget approved for lead capture tool if not already in place

**What client must provide:**
- Access to CRM and MAP as admin or with admin support
- List of upcoming events for next 6 months with budget information
- Historical event data (costs, leads, outcomes) for last 3-5 events
- Sales and marketing stakeholders for process definition interviews
- Current event planning documents/checklists if they exist

## 5. Common Pitfalls

- **Delayed lead upload post-event**: Teams wait 3-5 days to upload leads, causing cold follow-up and lost opportunities. → **Mitigation**: Build same-day automated lead flow and set SLA for manual upload within 24 hours.

- **Poor lead data quality from capture**: Incomplete or illegible data from rushed booth conversations. → **Mitigation**: Design capture forms with required fields, use QR/badge scanning to auto-populate, train booth staff on data collection.

- **Misaligned attribution windows**: Measuring ROI at 30 days when sales cycle is 6+ months understates event value. → **Mitigation**: Set attribution windows aligned to average sales cycle, track 30/60/90-day AND 6-month influenced pipeline.

- **No sales follow-up ownership**: Leads sit unassigned or assigned reps don't prioritize event leads. → **Mitigation**: Configure automatic assignment with SLA alerts, include event lead follow-up in sales performance tracking.

## 6. Success Metrics

- **Leading Indicator**: Lead upload time reduced to same-day or next-day; sales follow-up within 48 hours of event; all events have CRM campaigns created
- **Lagging Indicator**: Event-sourced pipeline trackable at 30/60/90 days; ROI calculable for all events; event-influenced deals converting at higher rate than baseline (industry benchmark: 34% higher than digital leads)

---

