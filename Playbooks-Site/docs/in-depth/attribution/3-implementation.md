---
displayed_sidebar: inDepthSidebar
title: "Attribution Implementation"
sidebar_position: 3
---

# Attribution Implementation

Build Tracking Infrastructure - Configure Attribution Model - Launch & Enablement

## Part 2: Build Tracking Infrastructure

### Step 1: Standardize UTM Taxonomy and Tracking URLs

**Step Overview:** Create a consistent UTM parameter taxonomy and tracking URL templates for all marketing campaigns. End state: Documented UTM taxonomy with templates and tracking URL builder for marketing team.

- Define UTM parameter standards: utm_source (channel), utm_medium (type), utm_campaign (campaign name), utm_content (variation)
- Create standardized naming conventions (lowercase, underscores, no spaces)
- Build tracking URL template spreadsheet or tool (e.g., Google Sheets UTM builder)
- Document taxonomy rules with examples for each channel (paid search, social, email, events)
- Review existing URLs and campaigns for compliance; flag inconsistencies for cleanup
- Train marketing team on UTM standards and URL builder usage

---
displayed_sidebar: inDepthSidebar

**UTM Taxonomy Template:**

| Parameter | Purpose | Values | Example |
|-----------|---------|--------|---------|
| utm_source | Channel/Platform | google, linkedin, email, direct | utm_source=linkedin |
| utm_medium | Marketing type | cpc, organic, email, webinar | utm_medium=cpc |
| utm_campaign | Campaign name | [year]_[quarter]_[name] | utm_campaign=2024_q1_product_launch |
| utm_content | Variation/CTA | cta_a, banner_1, sidebar | utm_content=cta_a |
| utm_term | Keyword (paid) | [keyword] | utm_term=crm_software |

**Naming Convention Rules:**
- Always lowercase
- Use underscores instead of spaces or dashes
- No special characters
- Consistent abbreviations (q1, q2 not Q1, quarter1)
- Date format: YYYY_QX or YYYY_MM

---
displayed_sidebar: inDepthSidebar

### Step 2: Configure Lead Source Normalization Rules

**Step Overview:** Build lead source normalization logic to consolidate inconsistent source values into clean categories. End state: Automated normalization rules that clean lead source data on ingest.

- Create master Lead Source taxonomy with 10-15 clean values (e.g., Paid Search, Organic Search, Referral, Event, Outbound)
- Map existing messy values to clean categories (e.g., "Google" + "google ads" + "adwords" → "Paid Search")
- Build normalization automation in CRM (Salesforce Flow, HubSpot Workflow, or Marketo Smart Campaign)
- Configure rules to run on lead creation and update
- Test normalization with sample records; verify correct categorization
- Document normalization logic for ongoing maintenance

---
displayed_sidebar: inDepthSidebar

**Lead Source Normalization Map:**

| Messy Values | Clean Value |
|--------------|-------------|
| Google, google ads, adwords, Google Ads, gclid | Paid Search |
| organic, seo, google organic | Organic Search |
| linkedin, LinkedIn, LI | Social - LinkedIn |
| facebook, fb, Facebook Ads | Social - Facebook |
| email, newsletter, nurture | Email Marketing |
| event, tradeshow, webinar | Events |
| referral, partner, customer referral | Referral |
| outbound, cold call, SDR | Outbound |
| direct, (none), blank | Direct/Unknown |

---
displayed_sidebar: inDepthSidebar

### Step 3: Implement Touchpoint Capture on Lead/Contact Records

**Step Overview:** Configure fields and automation to capture first-touch and subsequent touchpoints on Lead and Contact records. End state: All new leads have first-touch source/campaign populated; subsequent touches tracked via campaign membership.

- Create custom fields for first-touch attribution: First Touch Source, First Touch Campaign, First Touch Date
- Build automation to stamp first-touch fields on lead creation (only if blank)
- Configure campaign member tracking to log subsequent touchpoints
- Set up hidden form fields to capture UTM parameters and pass to CRM
- Implement web-to-lead or form handler integration to preserve UTM data
- Test end-to-end: submit test form with UTM parameters, verify data flows to CRM fields

---
displayed_sidebar: inDepthSidebar

**First-Touch Fields to Create:**

| Field Name | Type | Description |
|------------|------|-------------|
| First Touch Source | Picklist | Channel of first interaction |
| First Touch Campaign | Lookup/Text | Campaign of first interaction |
| First Touch Date | Date | Date of first interaction |
| First Touch Medium | Picklist | Marketing type of first interaction |
| Original Referrer | URL | Website referrer URL |

**Form Configuration:**
- Add hidden fields for: utm_source, utm_medium, utm_campaign, utm_content, utm_term
- Pass cookie/session values to capture returning visitor UTMs
- Preserve UTM data on page redirects (landing page → form page)

---
displayed_sidebar: inDepthSidebar

## Part 3: Configure Attribution Model in CRM

### Step 1: Set Up Multi-Touch Attribution Logic

**Step Overview:** Configure the selected attribution model in the CRM using campaign influence or custom attribution objects. End state: Attribution logic operational and assigning credit to touchpoints on opportunities.

- If Salesforce: Enable Customizable Campaign Influence and configure influence model (primary vs multi-touch)
- If HubSpot: Configure multi-touch revenue attribution reports with selected model
- Set attribution lookback window (e.g., 90 days, 180 days) based on sales cycle length
- Configure touchpoint weighting per selected model (e.g., W-shaped: 30/30/30/10)
- Build custom attribution object if native capabilities insufficient (junction object linking Opportunity to Campaigns with credit %)
- Document attribution logic configuration for troubleshooting and future modifications

---
displayed_sidebar: inDepthSidebar

**Salesforce Campaign Influence Setup:**

1. **Enable Customizable Campaign Influence**
   - Setup → Campaign Influence → Enable Customizable Campaign Influence

2. **Configure Attribution Model**
   - Create new model or modify existing
   - Set model type (Primary Campaign Source vs Multi-Touch)
   - Configure attribution percentage rules

3. **Set Lookback Window**
   - Define how far back to look for influencing campaigns
   - Typical: 90-180 days for B2B

4. **Configure Auto-Association**
   - Link Campaign Members to Opportunity Contact Roles automatically

---
displayed_sidebar: inDepthSidebar

### Step 2: Create Opportunity-to-Campaign Linkage

**Step Overview:** Build the connection between opportunities and influencing campaigns to attribute pipeline and revenue. End state: Opportunities linked to all influencing campaigns with credit allocated per model.

- Configure Contact Role requirements on opportunities (essential for campaign influence to work)
- Set up automatic campaign member to opportunity association via Contact Roles
- Build automation to create Campaign Influence records when opportunities are created
- Configure influence credit calculation based on selected attribution model
- Test with sample opportunities: verify campaigns are linked and credit is allocated correctly
- Validate that influenced pipeline and revenue roll up to Campaign object

---
displayed_sidebar: inDepthSidebar

**Contact Role Configuration:**

Campaign influence typically works through Contact Roles:
1. Contact is Campaign Member (touched by campaign)
2. Contact becomes Contact Role on Opportunity
3. Campaign Influence record created linking Campaign → Opportunity
4. Attribution credit calculated based on model

**Critical Setup Points:**
- Ensure Contact Roles are required or strongly encouraged on Opportunities
- Create automation to auto-add primary contact as Contact Role
- Validate that sales is adding Contact Roles consistently

---
displayed_sidebar: inDepthSidebar

### Step 3: Test Attribution Data Accuracy

**Step Overview:** Validate attribution logic by reconciling sample deals against known touchpoint history. End state: Confirmed accuracy of attribution data with documented test results.

- Select 10-15 recently closed-won opportunities with known marketing touchpoints
- Manually trace each opportunity's touchpoint history from first touch to close
- Compare manual trace to CRM attribution data; identify discrepancies
- Investigate and fix root causes of discrepancies (missing campaign members, broken automation)
- Re-test after fixes; document final accuracy rate
- Sign off on attribution accuracy with marketing stakeholder

---
displayed_sidebar: inDepthSidebar

## Part 4: Launch & Enablement

### Step 1: Build Attribution Reports and Dashboards

**Step Overview:** Create reports and dashboards that surface attribution insights for marketing decision-making. End state: Live dashboards showing pipeline and revenue by source, campaign, and channel.

- Build core attribution reports: Pipeline by Source, Revenue by Campaign, Influenced Pipeline by Channel
- Create time-based views (monthly, quarterly) for trend analysis
- Build executive dashboard summarizing attribution insights (top performing campaigns, channel mix)
- Configure drill-down capability to see opportunity details behind attributed revenue
- Set up scheduled report distribution to marketing leadership
- Validate report numbers against raw data; ensure no double-counting

---
displayed_sidebar: inDepthSidebar

**Core Attribution Reports:**

| Report | Purpose | Audience |
|--------|---------|----------|
| Pipeline by Channel | Which channels drive pipeline | VP Marketing |
| Revenue by Campaign | Campaign ROI | Demand Gen |
| First-Touch Analysis | Top-of-funnel effectiveness | Marketing Ops |
| Multi-Touch Attribution | Full journey influence | RevOps |
| Campaign ROI | Investment vs return | Finance |

---
displayed_sidebar: inDepthSidebar

### Step 2: Conduct Marketing Team Training

**Step Overview:** Train marketing team on interpreting attribution data and using it to optimize campaigns. End state: Marketing team capable of self-service attribution analysis and campaign optimization.

- Schedule 60-90 min training session with marketing team (Demand Gen, Marketing Ops, Content)
- Cover: attribution model logic, how to read dashboards, common interpretation mistakes
- Walk through real campaign examples showing attribution in action
- Demonstrate how to use data for budget decisions (which channels to invest in vs cut)
- Address questions about data accuracy and limitations of model
- Record session and share with team; create quick-reference guide

---
displayed_sidebar: inDepthSidebar

### Step 3: Document Attribution System and Governance

**Step Overview:** Create documentation for ongoing attribution system maintenance and governance. End state: Complete documentation package enabling client self-sufficiency.

- Document UTM taxonomy with examples and naming conventions
- Create lead source value dictionary with definitions
- Write attribution model technical specification (fields, automation, logic)
- Build troubleshooting guide for common issues (missing data, incorrect attribution)
- Define governance process: who owns attribution, how to add new campaigns, quarterly review cadence
- Assign single owner (typically RevOps) for attribution data quality

---
displayed_sidebar: inDepthSidebar

### Step 4: Hand Off and Schedule Refinement Check-In

**Step Overview:** Transfer system ownership to client and establish follow-up for model refinement. End state: Client self-sufficient with scheduled check-in for optimization.

- Deliver documentation package to RevOps and Marketing Ops
- Transfer admin access and credentials
- Walk through ongoing maintenance tasks (adding campaigns, UTM updates, quarterly reviews)
- Schedule 30-day check-in to validate data accuracy post-launch
- Define criteria for model refinement (when to adjust weights, change lookback window)
- Close out project with final status report to stakeholders

---
displayed_sidebar: inDepthSidebar

## Implementation Output Summary

At the end of the Implementation phase, you should have:

1. **Tracking Infrastructure**
   - UTM taxonomy documented and URL builder deployed
   - Lead Source normalization rules active
   - First-touch fields created and automation live
   - Form UTM capture validated

2. **Attribution Configuration**
   - Attribution model configured in CRM
   - Opportunity-to-Campaign linkage working
   - Campaign Influence records being created
   - Attribution accuracy validated on sample deals

3. **Reporting & Enablement**
   - Core attribution reports built
   - Executive dashboard live
   - Marketing team trained
   - Documentation package delivered

4. **Governance**
   - Attribution owner assigned
   - Maintenance cadence defined
   - 30-day check-in scheduled
