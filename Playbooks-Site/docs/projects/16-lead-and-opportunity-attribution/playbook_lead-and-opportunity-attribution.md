# Lead & Opportunity Attribution - Playbook

## 1. Definition

**What it is**: A technical and strategic project that implements a multi-touch attribution model to track and assign credit to marketing and sales activities that contribute to lead generation and opportunity creation. The project connects CRM, marketing automation, and web analytics data to provide visibility into which campaigns, channels, and touchpoints drive pipeline and revenue.

**What it is NOT**: Not a marketing automation platform implementation (that's a prerequisite). Not a lead lifecycle/stage definition project (separate project). Not a reporting dashboard build (attribution provides the data model; reporting is a downstream deliverable). Not a budget allocation exercise (attribution is backward-looking and informs but does not prescribe spend).

## 2. ICP Value Proposition

**Pain it solves**: Marketing cannot prove ROI on campaigns because touchpoint data is siloed across CRM, marketing automation, and web analytics. Leadership asks "which campaigns are working?" and marketing can only point to vanity metrics (clicks, impressions) rather than pipeline contribution. Sales and marketing finger-point about lead quality because there's no shared view of the buyer journey.

**Outcome delivered**: A unified attribution model that assigns credit to touchpoints across the buyer journey, enabling marketing to report on pipeline contribution by campaign/channel/source. Clear visibility into which activities drive MQLs, opportunities, and closed-won revenue. Data foundation for optimizing marketing spend toward highest-performing channels.

**Who owns it**: VP Marketing or Director of Demand Gen (with RevOps as technical implementer)

## 3. Implementation Procedure

### Part 1: Discovery & Data Audit

#### Step 1: Audit Current CRM Lead Source and Campaign Data

**Step Overview:** Assess what touchpoint data is currently captured in the CRM and identify data quality gaps. End state: Documented inventory of existing lead source values, campaign tracking fields, and data completeness percentages.

- Pull list of all Lead Source picklist values and analyze distribution across last 6 months of leads
- Identify inconsistent or duplicate source values (e.g., "Google" vs "google" vs "Google Ads" vs "Paid Search")
- Audit Campaign object usage: count campaigns created, campaign member records, and influence tracking
- Document which touchpoint data is captured vs missing (first touch, subsequent touches, offline events)
- Quantify data quality gaps (e.g., "35% of leads have blank Lead Source")
- Export sample of 20-30 closed-won opportunities and manually trace their touchpoint history

#### Step 2: Map the Buyer Journey with Stakeholders

**Step Overview:** Interview marketing and sales to document the typical touchpoints from first interaction to closed-won. End state: Visual buyer journey map showing key touchpoints and conversion milestones.

- Schedule 45-60 min buyer journey mapping session with marketing (Demand Gen, Content) and sales leadership
- Document common first-touch channels (paid search, organic, events, referrals, outbound)
- Identify key conversion milestones: first touch, lead creation, MQL, SQL, opportunity creation, closed-won
- Map typical touchpoints between milestones (nurture emails, webinars, sales calls, content downloads)
- Note differences in journey by segment (enterprise vs SMB, inbound vs outbound)
- Create visual journey map showing touchpoints at each stage for stakeholder alignment

#### Step 3: Evaluate and Select Attribution Model

**Step Overview:** Analyze attribution model options against client's sales cycle and business needs, then recommend the appropriate model. End state: Attribution model selected and documented with stakeholder buy-in.

- Review attribution model options: first-touch, last-touch, linear, U-shaped, W-shaped, time-decay
- Analyze client's average sales cycle length (short cycles favor simpler models; 6+ month cycles need multi-touch)
- Consider buying committee complexity (multiple stakeholders require account-level attribution)
- Evaluate CRM/MA native attribution capabilities (Salesforce Campaign Influence vs custom solution)
- Present recommendation with pros/cons to VP Marketing and RevOps
- Document selected model rationale and get stakeholder sign-off

---

### Part 2: Build Tracking Infrastructure

#### Step 1: Standardize UTM Taxonomy and Tracking URLs

**Step Overview:** Create a consistent UTM parameter taxonomy and tracking URL templates for all marketing campaigns. End state: Documented UTM taxonomy with templates and tracking URL builder for marketing team.

- Define UTM parameter standards: utm_source (channel), utm_medium (type), utm_campaign (campaign name), utm_content (variation)
- Create standardized naming conventions (lowercase, underscores, no spaces)
- Build tracking URL template spreadsheet or tool (e.g., Google Sheets UTM builder)
- Document taxonomy rules with examples for each channel (paid search, social, email, events)
- Review existing URLs and campaigns for compliance; flag inconsistencies for cleanup
- Train marketing team on UTM standards and URL builder usage

#### Step 2: Configure Lead Source Normalization Rules

**Step Overview:** Build lead source normalization logic to consolidate inconsistent source values into clean categories. End state: Automated normalization rules that clean lead source data on ingest.

- Create master Lead Source taxonomy with 10-15 clean values (e.g., Paid Search, Organic Search, Referral, Event, Outbound)
- Map existing messy values to clean categories (e.g., "Google" + "google ads" + "adwords" → "Paid Search")
- Build normalization automation in CRM (Salesforce Flow, HubSpot Workflow, or Marketo Smart Campaign)
- Configure rules to run on lead creation and update
- Test normalization with sample records; verify correct categorization
- Document normalization logic for ongoing maintenance

#### Step 3: Implement Touchpoint Capture on Lead/Contact Records

**Step Overview:** Configure fields and automation to capture first-touch and subsequent touchpoints on Lead and Contact records. End state: All new leads have first-touch source/campaign populated; subsequent touches tracked via campaign membership.

- Create custom fields for first-touch attribution: First Touch Source, First Touch Campaign, First Touch Date
- Build automation to stamp first-touch fields on lead creation (only if blank)
- Configure campaign member tracking to log subsequent touchpoints
- Set up hidden form fields to capture UTM parameters and pass to CRM
- Implement web-to-lead or form handler integration to preserve UTM data
- Test end-to-end: submit test form with UTM parameters, verify data flows to CRM fields

---

### Part 3: Configure Attribution Model in CRM

#### Step 1: Set Up Multi-Touch Attribution Logic

**Step Overview:** Configure the selected attribution model in the CRM using campaign influence or custom attribution objects. End state: Attribution logic operational and assigning credit to touchpoints on opportunities.

- If Salesforce: Enable Customizable Campaign Influence and configure influence model (primary vs multi-touch)
- If HubSpot: Configure multi-touch revenue attribution reports with selected model
- Set attribution lookback window (e.g., 90 days, 180 days) based on sales cycle length
- Configure touchpoint weighting per selected model (e.g., W-shaped: 30/30/30/10)
- Build custom attribution object if native capabilities insufficient (junction object linking Opportunity to Campaigns with credit %)
- Document attribution logic configuration for troubleshooting and future modifications

#### Step 2: Create Opportunity-to-Campaign Linkage

**Step Overview:** Build the connection between opportunities and influencing campaigns to attribute pipeline and revenue. End state: Opportunities linked to all influencing campaigns with credit allocated per model.

- Configure Contact Role requirements on opportunities (essential for campaign influence to work)
- Set up automatic campaign member to opportunity association via Contact Roles
- Build automation to create Campaign Influence records when opportunities are created
- Configure influence credit calculation based on selected attribution model
- Test with sample opportunities: verify campaigns are linked and credit is allocated correctly
- Validate that influenced pipeline and revenue roll up to Campaign object

#### Step 3: Test Attribution Data Accuracy

**Step Overview:** Validate attribution logic by reconciling sample deals against known touchpoint history. End state: Confirmed accuracy of attribution data with documented test results.

- Select 10-15 recently closed-won opportunities with known marketing touchpoints
- Manually trace each opportunity's touchpoint history from first touch to close
- Compare manual trace to CRM attribution data; identify discrepancies
- Investigate and fix root causes of discrepancies (missing campaign members, broken automation)
- Re-test after fixes; document final accuracy rate
- Sign off on attribution accuracy with marketing stakeholder

---

### Part 4: Launch & Enablement

#### Step 1: Build Attribution Reports and Dashboards

**Step Overview:** Create reports and dashboards that surface attribution insights for marketing decision-making. End state: Live dashboards showing pipeline and revenue by source, campaign, and channel.

- Build core attribution reports: Pipeline by Source, Revenue by Campaign, Influenced Pipeline by Channel
- Create time-based views (monthly, quarterly) for trend analysis
- Build executive dashboard summarizing attribution insights (top performing campaigns, channel mix)
- Configure drill-down capability to see opportunity details behind attributed revenue
- Set up scheduled report distribution to marketing leadership
- Validate report numbers against raw data; ensure no double-counting

#### Step 2: Conduct Marketing Team Training

**Step Overview:** Train marketing team on interpreting attribution data and using it to optimize campaigns. End state: Marketing team capable of self-service attribution analysis and campaign optimization.

- Schedule 60-90 min training session with marketing team (Demand Gen, Marketing Ops, Content)
- Cover: attribution model logic, how to read dashboards, common interpretation mistakes
- Walk through real campaign examples showing attribution in action
- Demonstrate how to use data for budget decisions (which channels to invest in vs cut)
- Address questions about data accuracy and limitations of model
- Record session and share with team; create quick-reference guide

#### Step 3: Document Attribution System and Governance

**Step Overview:** Create documentation for ongoing attribution system maintenance and governance. End state: Complete documentation package enabling client self-sufficiency.

- Document UTM taxonomy with examples and naming conventions
- Create lead source value dictionary with definitions
- Write attribution model technical specification (fields, automation, logic)
- Build troubleshooting guide for common issues (missing data, incorrect attribution)
- Define governance process: who owns attribution, how to add new campaigns, quarterly review cadence
- Assign single owner (typically RevOps) for attribution data quality

#### Step 4: Hand Off and Schedule Refinement Check-In

**Step Overview:** Transfer system ownership to client and establish follow-up for model refinement. End state: Client self-sufficient with scheduled check-in for optimization.

- Deliver documentation package to RevOps and Marketing Ops
- Transfer admin access and credentials
- Walk through ongoing maintenance tasks (adding campaigns, UTM updates, quarterly reviews)
- Schedule 30-day check-in to validate data accuracy post-launch
- Define criteria for model refinement (when to adjust weights, change lookback window)
- Close out project with final status report to stakeholders

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Marketing automation platform (HubSpot, Marketo) connected to CRM
- CRM with campaign object or equivalent (Salesforce Campaigns, HubSpot Campaigns)
- Web analytics (Google Analytics or equivalent) with conversion tracking
- Minimum 6 months of historical lead/opportunity data for baseline analysis
- Basic form infrastructure capturing leads into CRM

**What client must provide:**
- Admin access to CRM and marketing automation platform
- List of all active marketing campaigns and channels
- Access to stakeholders for buyer journey interviews (marketing, sales, RevOps)
- Decision on attribution model selection (after LeanScale recommendation)
- Current UTM parameter usage documentation (if exists)

## 5. Common Pitfalls

- **Pitfall 1**: Implementing last-click only attribution because it's simpler --> **Mitigation**: Start with a multi-touch model (even linear) from day one; B2B buying involves 6-10 stakeholders and single-touch models miss 90%+ of influencing activities

- **Pitfall 2**: Ignoring anonymous website visitors (97% don't fill out forms) --> **Mitigation**: Set clear expectations with stakeholders that attribution will only cover converting visitors unless account identification tools (Clearbit, 6sense) are implemented

- **Pitfall 3**: Siloed data across online and offline channels --> **Mitigation**: Include offline touchpoints (events, sales calls, direct mail) in the attribution model by syncing Outreach/Salesloft and event attendance data to CRM campaigns

- **Pitfall 4**: No governance for ongoing UTM and source hygiene --> **Mitigation**: Create a UTM taxonomy document and review source values monthly; assign a single owner (usually RevOps) for attribution data quality

- **Pitfall 5**: Focusing on individual leads instead of account-level engagement --> **Mitigation**: For complex B2B deals with buying committees, ensure attribution tracks all contacts on an account and rolls up to account-level influence metrics

## 6. Success Metrics

- **Leading Indicator**: 100% of new leads have a populated first-touch source and campaign within 30 days of go-live
- **Lagging Indicator**: Marketing can report pipeline contribution by channel/campaign with confidence; quarterly business reviews include attribution data in budget discussions

---

