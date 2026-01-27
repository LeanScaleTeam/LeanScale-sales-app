# Foundational Automations and Reporting Logic - Playbook

## 1. Definition

**What it is**: A foundational CRM implementation project that establishes core automation workflows (lead capture, lifecycle stage management, task assignment, renewal reminders) and builds essential reporting infrastructure (pipeline dashboards, CAC/CLV metrics, churn monitoring) to enable data-driven GTM decision-making across Marketing, Sales, and Customer Success.

**What it is NOT**: Not a CRM migration or implementation from scratch (assumes CRM already exists). Not a Sales Engagement Platform setup (cadences/sequences). Not advanced analytics or BI platform implementation. Not lead scoring model design (that's a separate project). Not Attribution modeling (separate project).

## 2. ICP Value Proposition

**Pain it solves**: GTM teams are operating with manual processes, inconsistent data, and ad-hoc reporting. Automations either don't exist, are broken, or use deprecated formats (Process Builders, Workflow Rules). Sales and Marketing leaders can't get reliable data on pipeline health, customer acquisition costs, or churn without manual spreadsheet work. Reps waste time on manual data entry instead of selling.

**Outcome delivered**: A unified automation foundation with working lead capture flows, lifecycle stage automation with date/time stamps, automated task assignments, and renewal reminders. Reporting infrastructure with organized dashboards showing pipeline analysis, CAC, CLV, churn rates, and campaign performance—all synced and accessible without manual effort.

**Who owns it**: RevOps Leader or Sales/Marketing Operations Manager. Cross-functional impact means VP Sales, VP Marketing, and CS Leadership are stakeholders.

## 3. Implementation Procedure

### Part 1: Assess Current State and Define Requirements

#### Step 1: Audit Existing Automations

**Step Overview:** Document all current CRM automations, their format (Flow vs Process Builder vs Workflow Rules), and operational status. End state: Complete inventory of automations with status flags (working, broken, deprecated).

- Pull list of all active automations from Salesforce Setup or HubSpot Workflows
- Identify format for each automation (Flow, Process Builder, Workflow Rule, HubSpot Workflow)
- Test each automation to verify it's functioning correctly
- Flag deprecated automations that need migration to Flow/modern format
- Document automation owners and last modified dates
- Note any automation conflicts or redundant logic between systems

#### Step 2: Audit Existing Reports and Dashboards

**Step Overview:** Inventory all existing reports and dashboards, assess their accuracy, and identify gaps in coverage. End state: Report inventory with quality ratings and gap analysis.

- Export list of all reports and dashboards from CRM
- Categorize reports by function (Sales, Marketing, CS, Executive)
- Check report accuracy by comparing to known data points
- Identify orphaned reports not connected to dashboards
- Document folder organization (or lack thereof)
- List missing reports needed for CAC, CLV, churn, pipeline analysis

#### Step 3: Define System Ownership Model

**Step Overview:** Establish which system (Salesforce or HubSpot) is source of truth for each data type and define sync rules. End state: Documented system ownership model with clear data flow rules.

- Map data objects between systems (Lead/Contact/Account/Opportunity)
- Define source of truth for each field type
- Document sync direction and frequency requirements
- Identify potential conflict points in workflow logic
- Get stakeholder sign-off on ownership model
- Create field mapping documentation for integration

---

### Part 2: Build Lead Capture and Assignment Automations

#### Step 1: Configure Lead Capture Automation

**Step Overview:** Set up automated lead capture from all sources (website forms, email, social) into the CRM with proper field population. End state: All lead sources automatically flowing into CRM with complete data.

- Audit all lead sources (website forms, landing pages, social, email)
- Configure form-to-CRM integrations (HubSpot forms, web-to-lead)
- Map form fields to CRM lead fields
- Set up UTM parameter capture for attribution
- Configure lead source and campaign tracking
- Test each lead source with sample submissions

#### Step 2: Build Lead Assignment Flow

**Step Overview:** Create automated lead routing that assigns leads to appropriate reps based on territory, round-robin, or other rules. End state: All new leads automatically assigned to correct owner without manual intervention.

- Document lead assignment rules (territory, industry, size, round-robin)
- Build assignment Flow in Salesforce or Workflow in HubSpot
- Configure fallback logic for unmatched leads
- Set up notification to assigned rep (email/Slack)
- Build exception handling for leads that fail assignment
- Test assignment logic with sample leads across all rule scenarios

#### Step 3: Create Task Assignment Automation

**Step Overview:** Set up automated task creation and assignment based on lead activity and engagement triggers. End state: Reps receive automated follow-up tasks based on prospect behavior.

- Define trigger events for task creation (form fill, email open, website visit)
- Configure task templates with appropriate due dates
- Set task priority based on lead score or engagement level
- Build notification system for new tasks
- Create escalation logic for overdue tasks
- Test task creation flow end-to-end

---

### Part 3: Implement Lifecycle Stage Automation

#### Step 1: Configure Lead Lifecycle Automation

**Step Overview:** Build automation that moves leads through lifecycle stages based on activity and qualification criteria, with date/time stamps for each stage transition. End state: Lead lifecycle fully automated with stage hit tracking.

- Define lead lifecycle stages (New, Contacted, Qualified, Converted, Disqualified)
- Create stage transition criteria and triggers
- Build Flow/Workflow to automate stage changes
- Add date/time stamp fields for each stage (Lead_Stage_Qualified_Date__c, etc.)
- Configure stamp population on stage change
- Test lifecycle flow with sample leads through all stages

#### Step 2: Configure Contact and Account Lifecycle Automation

**Step Overview:** Extend lifecycle automation to Contact and Account objects with appropriate stage definitions and date stamps. End state: Contact and Account lifecycle stages automated with full tracking.

- Define Contact lifecycle stages (Active, Engaged, Customer, Churned)
- Define Account lifecycle stages (Prospect, Customer, Churned, Partner)
- Build automation flows for stage transitions
- Add date/time stamp fields for Contact stages
- Add date/time stamp fields for Account stages
- Test lifecycle transitions triggered by related record changes

#### Step 3: Configure Opportunity Stage Automation

**Step Overview:** Set up Opportunity stage automation with stage hit date tracking for pipeline analysis. End state: Opportunity stages have automated date stamps enabling stage duration analysis.

- Create stage hit date fields for each Opportunity stage
- Build Flow to populate stage dates on stage change
- Configure validation to prevent skipping stages (if required)
- Add automation for stale opportunity alerts
- Create stage duration calculations (time in stage)
- Test with sample Opportunities through full sales cycle

---

### Part 4: Build Renewal and Customer Automation

#### Step 1: Configure Renewal Reminder System

**Step Overview:** Set up automated renewal reminders based on contract end dates and customer health signals. End state: CS and Sales receive automated renewal alerts 90/60/30 days before contract end.

- Identify contract end date field on Account or Opportunity
- Build renewal reminder Flow with 90/60/30 day triggers
- Configure reminder recipients (Account Owner, CS Manager)
- Create Task or Email notifications for each reminder
- Add renewal opportunity creation automation (if applicable)
- Test reminder triggers with sample contract dates

#### Step 2: Build Upsell Opportunity Detection

**Step Overview:** Create automation that identifies upsell opportunities based on usage patterns and customer signals. End state: System flags accounts with upsell potential and notifies appropriate owners.

- Define upsell trigger criteria (usage thresholds, engagement scores)
- Build automation to detect qualifying accounts
- Create notification to Account Owner or CS rep
- Configure upsell opportunity record creation (if applicable)
- Set up tracking for upsell pipeline
- Test detection logic with sample account data

---

### Part 5: Build Reporting Infrastructure

#### Step 1: Create Sales Pipeline Reports and Dashboard

**Step Overview:** Build pipeline analysis reports showing stage progression, conversion rates, and bottleneck identification. End state: Executive-ready pipeline dashboard with drill-down capabilities.

- Create Opportunity pipeline report by stage
- Build stage conversion rate report using stage hit dates
- Create average time-in-stage analysis
- Build pipeline by rep/team/territory views
- Configure pipeline dashboard with key metrics
- Set up dashboard refresh schedule and subscriptions

#### Step 2: Build CAC and CLV Reporting

**Step Overview:** Create Customer Acquisition Cost and Customer Lifetime Value reports with the necessary calculations and data sources. End state: CAC and CLV metrics available in dashboards with trend analysis.

- Define CAC calculation formula and required data inputs
- Create report pulling marketing/sales spend data
- Build CAC report with channel/campaign breakdowns
- Define CLV calculation methodology
- Create CLV report by customer segment
- Add CAC and CLV metrics to executive dashboard

#### Step 3: Configure Churn Rate Monitoring

**Step Overview:** Build churn tracking reports that measure customer loss rate and identify trends. End state: Churn dashboard showing monthly/quarterly rates with segment breakdowns.

- Define churn criteria (contract cancellation, non-renewal, downgrade)
- Create churn tracking fields if not present
- Build monthly and quarterly churn rate reports
- Create churn by reason/segment analysis
- Configure churn alerts for CS leadership
- Add churn metrics to executive dashboard

#### Step 4: Build Campaign Performance Reports

**Step Overview:** Create marketing campaign performance reporting with conversion tracking and ROI analysis. End state: Campaign dashboard showing performance metrics across all channels.

- Configure Campaign member status tracking
- Create campaign conversion funnel report
- Build campaign ROI calculation report
- Create channel comparison analysis
- Configure campaign influence reporting
- Add campaign metrics to marketing dashboard

---

### Part 6: Organize and Hand Off

#### Step 1: Organize Reports and Dashboards

**Step Overview:** Structure all reports and dashboards into logical folders with consistent naming conventions. End state: All reports organized by function with clear naming and shared appropriately.

- Create folder structure by function (Sales, Marketing, CS, Executive)
- Move all reports to appropriate folders
- Apply consistent naming convention (Function - Report Name - Timeframe)
- Set folder permissions by role/team
- Archive or delete orphaned/duplicate reports
- Document folder structure for future reference

#### Step 2: Create Admin Documentation

**Step Overview:** Document all automations, reports, and configurations for ongoing administration. End state: Complete admin runbook enabling client self-service.

- Document all automation flows with trigger conditions and actions
- Create field mapping documentation
- Document report calculations and data sources
- Write troubleshooting guide for common issues
- Create user guide for key dashboards
- Compile into admin handoff package

#### Step 3: Conduct Training and Hand Off

**Step Overview:** Train client team on automation management and reporting usage, then transfer ownership. End state: Client team trained and self-sufficient with admin credentials transferred.

- Schedule training session (60-90 minutes)
- Cover automation monitoring and error handling
- Train on report/dashboard usage and customization
- Transfer admin credentials and access
- Deliver documentation package
- Schedule 30-day check-in for questions

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM system in place (Salesforce or HubSpot)
- Admin access to CRM with permission to create automations and reports
- Basic data hygiene (no critical duplicate or data quality issues blocking automation)
- Defined sales process and lifecycle stages (conceptually, even if not yet in CRM)
- Integration user license available (if Salesforce-HubSpot integration needed)

**What client must provide:**
- CRM admin credentials or admin user to execute configurations
- Business rules for lead assignment (territories, routing logic)
- Defined lifecycle stages for Lead, Contact, Account, Opportunity
- Contract/renewal date field location and format
- Marketing spend data for CAC calculations
- Stakeholder availability for requirements and review sessions

## 5. Common Pitfalls

- **Pitfall 1**: Building new automations without deactivating deprecated ones, causing duplicate processing and conflicting logic. → **Mitigation**: Complete automation audit in Part 1 and deactivate old Process Builders/Workflow Rules before building new Flows.

- **Pitfall 2**: Sync conflicts between Salesforce and HubSpot when system ownership isn't defined, leading to data overwrites and broken workflows. → **Mitigation**: Define System Ownership Model in Step 3 of Part 1 and get stakeholder sign-off before any automation work.

- **Pitfall 3**: Reports showing incorrect data because underlying fields aren't being populated consistently by automations. → **Mitigation**: Test each automation end-to-end before building reports that depend on the data it creates.

- **Pitfall 4**: Picklist value mismatches between systems causing sync errors and data quality issues. → **Mitigation**: Standardize picklist values across systems during field mapping documentation.

## 6. Success Metrics

- **Leading Indicator**: All automations running without errors for 7+ consecutive days; all stage hit date fields populating correctly on new records.

- **Lagging Indicator**: 30-day post-launch: 50%+ reduction in manual data entry time reported by reps; Executive dashboards being accessed weekly by leadership; CAC/CLV/Churn metrics available without manual calculation.

---

