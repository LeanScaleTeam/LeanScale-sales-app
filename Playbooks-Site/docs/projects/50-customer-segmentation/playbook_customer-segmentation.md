# Customer Segmentation - Playbook

## 1. Definition

**What it is**: A strategic and technical project that defines, implements, and operationalizes customer segmentation criteria within the CRM to enable targeted customer success strategies, personalized experiences, and data-driven retention initiatives. The deliverable is working segmentation fields, automated segment assignment, and reporting dashboards that slice customer data by meaningful business attributes.

**What it is NOT**: Not a Customer Health Scoring project (that focuses on predictive churn indicators). Not a general CRM cleanup or data enrichment project (those are prerequisites). Not a marketing segmentation project for lead/prospect targeting (this is for existing customers).

## 2. ICP Value Proposition

**Pain it solves**: Customer Success teams treat all customers the same because they lack meaningful ways to categorize and prioritize accounts beyond contract value. Leadership cannot answer questions like "How are enterprise manufacturing customers performing vs. mid-market tech companies?" or "Which customer segments have the highest churn risk?"

**Outcome delivered**: Clear, actionable customer segments implemented in the CRM with automated assignment rules. CS teams can filter, prioritize, and report by segment. Leadership has dashboards showing segment-level retention, expansion, and health metrics.

**Who owns it**: VP of Customer Success or Customer Operations Leader, with support from RevOps.

## 3. Implementation Procedure

### Part 1: Define Segmentation Strategy & Objectives

#### Step 1: Conduct Stakeholder Discovery Session

**Step Overview:** Facilitate a workshop with CS leadership and key stakeholders to understand their segmentation needs and use cases. End state: Documented list of business questions segmentation should answer and how segments will be used operationally.

- Schedule 60-90 minute discovery session with VP CS, CS Ops, and 1-2 senior CSMs
- Ask: "What questions can't you answer today about your customer base?"
- Document current pain points (e.g., "We treat all customers the same," "Can't prioritize book of business")
- Identify intended use cases: reporting, playbook triggers, resource allocation, QBR segmentation
- List specific business questions segmentation should answer (e.g., "Which industries churn most?")
- Confirm who will consume the segments (CS team, leadership, marketing)

#### Step 2: Audit Current Segmentation State

**Step Overview:** Assess existing segmentation fields, data quality, and gaps in the CRM. End state: Gap analysis showing what segmentation exists today vs. what's needed.

- Pull list of all customer-related fields in CRM (Account object in Salesforce, Company in HubSpot)
- Identify existing segmentation fields (industry, company size, region, tier)
- Assess data completeness for each field (% populated, % accurate)
- Document how current segments are used (if at all) in reporting and workflows
- Compare current state to stakeholder needs from discovery session
- Create gap analysis: "Have vs. Need" for segmentation criteria

#### Step 3: Define Segmentation Framework

**Step Overview:** Design the segmentation model with specific criteria and segment definitions. End state: Approved segmentation framework document with 3-5 segmentation dimensions and clear criteria for each.

- Select 3-5 segmentation dimensions based on discovery (firmographic, behavioral, value-based)
- Define specific criteria for each dimension (e.g., Company Size: SMB &lt;100, Mid-Market 100-1000, Enterprise 1000+)
- Create segment naming conventions that are intuitive and actionable
- Map segments to operational actions (e.g., Enterprise = white-glove service, SMB = tech-touch)
- Review framework with stakeholders and get sign-off
- Document final segmentation framework with definitions and business rules

---

### Part 2: Data Collection & Preparation

#### Step 1: Identify Data Sources and Enrichment Needs

**Step Overview:** Map where segmentation data will come from and identify gaps requiring enrichment. End state: Data source map showing which fields come from which systems, plus enrichment plan for gaps.

- Map each segmentation field to its data source (CRM, billing, product, enrichment tool)
- Identify fields requiring external enrichment (firmographic data from ZoomInfo, Apollo, Clearbit)
- Determine product usage data needs (from Customer Success Platform: ChurnZero, Gainsight, Vitally)
- Document data sync frequencies and potential latency issues
- Create enrichment plan: which tool, which fields, estimated coverage
- Get budget approval for any new enrichment tools or credits needed

#### Step 2: Execute Data Cleanup and Standardization

**Step Overview:** Clean and standardize existing CRM data to ensure segmentation accuracy. End state: CRM customer data cleaned with standardized values and duplicates merged.

- Run duplicate detection report and merge duplicate account records
- Standardize industry values using picklist (convert free-text to controlled values)
- Normalize company size data (employee count ranges, ARR tiers)
- Clean geographic data (country codes, region mapping)
- Validate key fields against external data sources where possible
- Document data quality improvements (before/after metrics)

#### Step 3: Enrich Customer Data

**Step Overview:** Fill data gaps using enrichment tools and manual research. End state: Key segmentation fields populated to 80%+ coverage across customer base.

- Configure enrichment tool (Clay, ZoomInfo, Apollo, Clearbit) with customer list
- Run bulk enrichment for firmographic fields (employee count, industry, revenue, tech stack)
- Review enrichment results and handle non-matches manually
- Import enriched data back to CRM with proper field mapping
- Validate a sample of enriched records for accuracy
- Document final coverage rates for each segmentation field

---

### Part 3: Build Segmentation in CRM

#### Step 1: Create Segmentation Fields and Picklists

**Step Overview:** Build the required custom fields in the CRM to store segment values. End state: All segmentation fields created with correct data types and picklist values.

- Create custom fields for each segmentation dimension (e.g., Customer_Tier__c, Industry_Segment__c)
- Define picklist values matching the approved segmentation framework
- Set appropriate field-level security (visible to CS and Sales teams)
- Add fields to relevant page layouts and record types
- Create field descriptions documenting the business rules for each value
- Test field creation in sandbox before production deployment

#### Step 2: Build Automated Segment Assignment Rules

**Step Overview:** Create automation to assign segments based on defined criteria. End state: Automation running that assigns correct segment values when records are created or updated.

- Build assignment logic for each segmentation dimension (formula fields, flows, or automation rules)
- For firmographic segments: use employee count and ARR thresholds
- For behavioral segments: integrate with CSP data (usage scores, engagement metrics)
- For value-based segments: use ARR, expansion potential, strategic importance
- Handle edge cases and null values with default assignments
- Test automation with sample records covering all segment combinations

#### Step 3: Run Initial Segment Assignment

**Step Overview:** Execute bulk update to assign segments to all existing customers. End state: 100% of active customer accounts have segment values assigned.

- Run bulk data update to assign initial segment values to all customer accounts
- Use data loader or native mass update for initial population
- Validate segment distribution matches expectations (sanity check percentages)
- Review outliers and exceptions (large accounts in SMB segment, etc.)
- Make manual corrections where data quality issues caused mis-assignment
- Document final segment distribution for baseline reporting

---

### Part 4: Build Reporting & Dashboards

#### Step 1: Create Segment-Based Reports

**Step Overview:** Build core reports that slice customer metrics by segment. End state: Report library with key CS metrics filterable and groupable by segment.

- Create "Customers by Segment" summary report showing distribution
- Build "ARR by Segment" report with revenue breakdown
- Create "Churn by Segment" report showing retention rates per segment
- Build "NPS/Health by Segment" report (if health scores exist)
- Create "CSM Book of Business" report grouped by segment
- Test all reports with various filter combinations

#### Step 2: Build Executive Dashboard

**Step Overview:** Create a dashboard providing leadership visibility into segment performance. End state: Executive dashboard showing segment-level KPIs accessible to CS leadership.

- Design dashboard layout with key segment metrics (ARR, retention, expansion, health)
- Add segment distribution chart (pie or bar showing customer count by segment)
- Include segment performance comparison (retention rate by segment)
- Add trending charts showing segment metrics over time
- Configure dashboard filters for time period and segment selection
- Share dashboard with CS leadership and get feedback

#### Step 3: Create Operational Views for CSMs

**Step Overview:** Configure list views and workspace views for CSMs to work by segment. End state: CSMs can easily filter and prioritize their book of business by segment.

- Create filtered list views for each major segment (e.g., "My Enterprise Accounts")
- Configure CSP workspace views grouped by segment (in Gainsight, ChurnZero, etc.)
- Add segment field to key customer record layouts
- Create segment-based saved searches or smart lists
- Test views with CSM users and gather feedback
- Adjust views based on CSM workflow preferences

---

### Part 5: Rollout & Enablement

#### Step 1: Create Documentation and Reference Materials

**Step Overview:** Document the segmentation model and create reference guides for the team. End state: Segmentation playbook and reference documentation accessible to all CS team members.

- Create segmentation definition document (what each segment means)
- Document business rules for segment assignment
- Build quick-reference guide for CSMs (one-pager)
- Create FAQ document addressing common questions
- Document data sources and refresh frequencies
- Store documentation in team wiki or knowledge base

#### Step 2: Conduct Team Training Session

**Step Overview:** Train the CS team on the new segmentation model and how to use it. End state: CS team trained and confident using segments in daily work.

- Schedule 45-60 minute training session with full CS team
- Cover: segment definitions, how assignments work, how to use in reporting
- Walk through common use cases (filtering book of business, running segment reports)
- Demonstrate dashboard and list view navigation
- Address questions and concerns from team
- Record session and share with team for reference

#### Step 3: Hand Off to Client and Establish Governance

**Step Overview:** Transfer ownership to client team with governance processes for ongoing maintenance. End state: Client self-sufficient with clear ownership and processes for segment maintenance.

- Transfer admin access and documentation to client RevOps/CS Ops
- Define segment review cadence (quarterly review of definitions and assignments)
- Establish process for handling segment exceptions and edge cases
- Set up data quality monitoring alerts for segmentation fields
- Schedule 30-day check-in to review adoption and address issues
- Close out project with lessons learned and recommendations

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Clean CRM with accurate customer account records (no major duplicate issues)
- Access to CRM admin capabilities (custom fields, automation, reporting)
- Customer Success Platform in place (if behavioral segmentation required)
- Budget for enrichment tools if data gaps exist

**What client must provide:**
- Access to CRM with admin permissions
- Access to Customer Success Platform (if applicable)
- 60-90 minutes of stakeholder time for discovery workshop
- Business context on how they want to use segments operationally
- Sign-off on segmentation framework before implementation
- List of current customers with key identifiers for enrichment

## 5. Common Pitfalls

- **Over-segmentation creating too many micro-segments**: Teams create 15+ segments that are impossible to operationalize or report on meaningfully. **Mitigation**: Limit to 3-5 segmentation dimensions with 3-5 values each. Each segment should have enough accounts to be statistically meaningful.

- **Static segments that become stale**: Segments are set once and never updated as customer data changes. **Mitigation**: Build automated assignment rules that re-evaluate on data changes. Schedule quarterly segment reviews.

- **Segmentation without operational action**: Segments are built but never used to differentiate treatment or strategy. **Mitigation**: Define specific operational actions for each segment during discovery. Link segments to playbooks, resource allocation, and service levels.

- **Poor data quality undermining accuracy**: Garbage in, garbage out - segmentation built on incomplete or inaccurate data produces misleading results. **Mitigation**: Invest in data cleanup and enrichment before building segments. Monitor data quality ongoing.

## 6. Success Metrics

- **Leading Indicator**: 100% of active customer accounts have segment values assigned; CS team actively using segment filters in daily workflows within 2 weeks of launch

- **Lagging Indicator**: Leadership can report on retention, expansion, and health metrics by segment; segment-based strategies implemented within 60 days (e.g., different QBR cadence by segment, resource allocation adjusted)

---

