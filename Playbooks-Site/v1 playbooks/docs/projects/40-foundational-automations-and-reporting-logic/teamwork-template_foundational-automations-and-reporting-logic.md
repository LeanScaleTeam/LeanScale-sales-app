# Foundational Automations and Reporting Logic - Project Details / Task List

**Tag:** `automations-reporting`
**Total Hours:** 75h
**Structure:** Multi-Milestone (>50h)

---

## Milestone 1: Foundational Automations and Reporting Logic - 1. Assessment & Automation Build
**Tag:** `automations-reporting`
**Description:** Assess current state, build lead capture/assignment automations, lifecycle stage automation, and renewal/customer automation workflows
**Hours:** 50h

### Task List: (Automations & Reporting) 1. Assessment & Lead Automation
**Contains:** Parts 1-2

| Task | Est | Description |
|------|-----|-------------|
| 1. Audit Existing Automations | 4h | Document all current CRM automations, their format (Flow vs Process Builder vs Workflow Rules), and operational status. End state: Complete inventory of automations with status flags (working, broken, deprecated).<br /><br />• Pull list of all active automations from Salesforce Setup or HubSpot Workflows<br />• Identify format for each automation (Flow, Process Builder, Workflow Rule, HubSpot Workflow)<br />• Test each automation to verify it's functioning correctly<br />• Flag deprecated automations that need migration to Flow/modern format<br />• Document automation owners and last modified dates<br />• Note any automation conflicts or redundant logic between systems |
| 2. Audit Existing Reports and Dashboards | 4h | Inventory all existing reports and dashboards, assess their accuracy, and identify gaps in coverage. End state: Report inventory with quality ratings and gap analysis.<br /><br />• Export list of all reports and dashboards from CRM<br />• Categorize reports by function (Sales, Marketing, CS, Executive)<br />• Check report accuracy by comparing to known data points<br />• Identify orphaned reports not connected to dashboards<br />• Document folder organization (or lack thereof)<br />• List missing reports needed for CAC, CLV, churn, pipeline analysis |
| 3. Define System Ownership Model | 4h | Establish which system (Salesforce or HubSpot) is source of truth for each data type and define sync rules. End state: Documented system ownership model with clear data flow rules.<br /><br />• Map data objects between systems (Lead/Contact/Account/Opportunity)<br />• Define source of truth for each field type<br />• Document sync direction and frequency requirements<br />• Identify potential conflict points in workflow logic<br />• Get stakeholder sign-off on ownership model<br />• Create field mapping documentation for integration |
| 4. Configure Lead Capture Automation | 4h | Set up automated lead capture from all sources (website forms, email, social) into the CRM with proper field population. End state: All lead sources automatically flowing into CRM with complete data.<br /><br />• Audit all lead sources (website forms, landing pages, social, email)<br />• Configure form-to-CRM integrations (HubSpot forms, web-to-lead)<br />• Map form fields to CRM lead fields<br />• Set up UTM parameter capture for attribution<br />• Configure lead source and campaign tracking<br />• Test each lead source with sample submissions |
| 5. Build Lead Assignment Flow | 4h | Create automated lead routing that assigns leads to appropriate reps based on territory, round-robin, or other rules. End state: All new leads automatically assigned to correct owner without manual intervention.<br /><br />• Document lead assignment rules (territory, industry, size, round-robin)<br />• Build assignment Flow in Salesforce or Workflow in HubSpot<br />• Configure fallback logic for unmatched leads<br />• Set up notification to assigned rep (email/Slack)<br />• Build exception handling for leads that fail assignment<br />• Test assignment logic with sample leads across all rule scenarios |
| 6. Create Task Assignment Automation | 4h | Set up automated task creation and assignment based on lead activity and engagement triggers. End state: Reps receive automated follow-up tasks based on prospect behavior.<br /><br />• Define trigger events for task creation (form fill, email open, website visit)<br />• Configure task templates with appropriate due dates<br />• Set task priority based on lead score or engagement level<br />• Build notification system for new tasks<br />• Create escalation logic for overdue tasks<br />• Test task creation flow end-to-end |

---

### Task List: (Automations & Reporting) 2. Lifecycle & Renewal Automation
**Contains:** Parts 3-4

| Task | Est | Description |
|------|-----|-------------|
| 7. Configure Lead Lifecycle Automation | 5h | Build automation that moves leads through lifecycle stages based on activity and qualification criteria, with date/time stamps for each stage transition. End state: Lead lifecycle fully automated with stage hit tracking.<br /><br />• Define lead lifecycle stages (New, Contacted, Qualified, Converted, Disqualified)<br />• Create stage transition criteria and triggers<br />• Build Flow/Workflow to automate stage changes<br />• Add date/time stamp fields for each stage (Lead_Stage_Qualified_Date__c, etc.)<br />• Configure stamp population on stage change<br />• Test lifecycle flow with sample leads through all stages |
| 8. Configure Contact and Account Lifecycle Automation | 5h | Extend lifecycle automation to Contact and Account objects with appropriate stage definitions and date stamps. End state: Contact and Account lifecycle stages automated with full tracking.<br /><br />• Define Contact lifecycle stages (Active, Engaged, Customer, Churned)<br />• Define Account lifecycle stages (Prospect, Customer, Churned, Partner)<br />• Build automation flows for stage transitions<br />• Add date/time stamp fields for Contact stages<br />• Add date/time stamp fields for Account stages<br />• Test lifecycle transitions triggered by related record changes |
| 9. Configure Opportunity Stage Automation | 5h | Set up Opportunity stage automation with stage hit date tracking for pipeline analysis. End state: Opportunity stages have automated date stamps enabling stage duration analysis.<br /><br />• Create stage hit date fields for each Opportunity stage<br />• Build Flow to populate stage dates on stage change<br />• Configure validation to prevent skipping stages (if required)<br />• Add automation for stale opportunity alerts<br />• Create stage duration calculations (time in stage)<br />• Test with sample Opportunities through full sales cycle |
| 10. Configure Renewal Reminder System | 5h | Set up automated renewal reminders based on contract end dates and customer health signals. End state: CS and Sales receive automated renewal alerts 90/60/30 days before contract end.<br /><br />• Identify contract end date field on Account or Opportunity<br />• Build renewal reminder Flow with 90/60/30 day triggers<br />• Configure reminder recipients (Account Owner, CS Manager)<br />• Create Task or Email notifications for each reminder<br />• Add renewal opportunity creation automation (if applicable)<br />• Test reminder triggers with sample contract dates |
| 11. Build Upsell Opportunity Detection | 6h | Create automation that identifies upsell opportunities based on usage patterns and customer signals. End state: System flags accounts with upsell potential and notifies appropriate owners.<br /><br />• Define upsell trigger criteria (usage thresholds, engagement scores)<br />• Build automation to detect qualifying accounts<br />• Create notification to Account Owner or CS rep<br />• Configure upsell opportunity record creation (if applicable)<br />• Set up tracking for upsell pipeline<br />• Test detection logic with sample account data |

---

## Milestone 2: Foundational Automations and Reporting Logic - 2. Reporting & Handoff
**Tag:** `automations-reporting`
**Description:** Build reporting infrastructure including pipeline, CAC/CLV, churn, and campaign reporting, then organize and hand off to client
**Hours:** 25h

### Task List: (Automations & Reporting) 3. Reporting & Handoff
**Contains:** Parts 5-6

| Task | Est | Description |
|------|-----|-------------|
| 12. Create Sales Pipeline Reports and Dashboard | 4h | Build pipeline analysis reports showing stage progression, conversion rates, and bottleneck identification. End state: Executive-ready pipeline dashboard with drill-down capabilities.<br /><br />• Create Opportunity pipeline report by stage<br />• Build stage conversion rate report using stage hit dates<br />• Create average time-in-stage analysis<br />• Build pipeline by rep/team/territory views<br />• Configure pipeline dashboard with key metrics<br />• Set up dashboard refresh schedule and subscriptions |
| 13. Build CAC and CLV Reporting | 4h | Create Customer Acquisition Cost and Customer Lifetime Value reports with the necessary calculations and data sources. End state: CAC and CLV metrics available in dashboards with trend analysis.<br /><br />• Define CAC calculation formula and required data inputs<br />• Create report pulling marketing/sales spend data<br />• Build CAC report with channel/campaign breakdowns<br />• Define CLV calculation methodology<br />• Create CLV report by customer segment<br />• Add CAC and CLV metrics to executive dashboard |
| 14. Configure Churn Rate Monitoring | 3.5h | Build churn tracking reports that measure customer loss rate and identify trends. End state: Churn dashboard showing monthly/quarterly rates with segment breakdowns.<br /><br />• Define churn criteria (contract cancellation, non-renewal, downgrade)<br />• Create churn tracking fields if not present<br />• Build monthly and quarterly churn rate reports<br />• Create churn by reason/segment analysis<br />• Configure churn alerts for CS leadership<br />• Add churn metrics to executive dashboard |
| 15. Build Campaign Performance Reports | 3.5h | Create marketing campaign performance reporting with conversion tracking and ROI analysis. End state: Campaign dashboard showing performance metrics across all channels.<br /><br />• Configure Campaign member status tracking<br />• Create campaign conversion funnel report<br />• Build campaign ROI calculation report<br />• Create channel comparison analysis<br />• Configure campaign influence reporting<br />• Add campaign metrics to marketing dashboard |
| 16. Organize Reports and Dashboards | 3h | Structure all reports and dashboards into logical folders with consistent naming conventions. End state: All reports organized by function with clear naming and shared appropriately.<br /><br />• Create folder structure by function (Sales, Marketing, CS, Executive)<br />• Move all reports to appropriate folders<br />• Apply consistent naming convention (Function - Report Name - Timeframe)<br />• Set folder permissions by role/team<br />• Archive or delete orphaned/duplicate reports<br />• Document folder structure for future reference |
| 17. Create Admin Documentation | 3h | Document all automations, reports, and configurations for ongoing administration. End state: Complete admin runbook enabling client self-service.<br /><br />• Document all automation flows with trigger conditions and actions<br />• Create field mapping documentation<br />• Document report calculations and data sources<br />• Write troubleshooting guide for common issues<br />• Create user guide for key dashboards<br />• Compile into admin handoff package |
| 18. Conduct Training and Hand Off | 4h | Train client team on automation management and reporting usage, then transfer ownership. End state: Client team trained and self-sufficient with admin credentials transferred.<br /><br />• Schedule training session (60-90 minutes)<br />• Cover automation monitoring and error handling<br />• Train on report/dashboard usage and customization<br />• Transfer admin credentials and access<br />• Deliver documentation package<br />• Schedule 30-day check-in for questions |

---

## Summary
- **Total Milestones:** 2 (50h + 25h)
- **Total Task Lists:** 3 (consolidated from 6 Parts)
- **Total Tasks:** 18 (one per Step)
- **Total Hours:** 75h
- **Generated from:** playbook_foundational-automations-and-reporting-logic.md
- **Generated on:** 2025-12-31
