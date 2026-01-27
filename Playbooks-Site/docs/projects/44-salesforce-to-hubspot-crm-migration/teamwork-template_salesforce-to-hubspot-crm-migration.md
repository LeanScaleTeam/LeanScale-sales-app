# Salesforce to HubSpot CRM Migration - Project Details / Task List

**Tag:** `sf-hubspot-migration`
**Total Hours:** 225h
**Structure:** Multi-Milestone (>50h)

---

## Milestone 1: Salesforce to HubSpot CRM Migration - 1. Discovery & Data Assessment
**Tag:** `sf-hubspot-migration`
**Description:** Stakeholder alignment, Salesforce audit, migration strategy, data quality assessment, and cleanup preparation
**Hours:** 56h

### Task List: (SF-HubSpot Migration) 1. Discovery & Strategy
**Contains:** Part 1

| Task | Est | Description |
|------|-----|-------------|
| 1. Conduct Stakeholder Alignment Workshop | 4h | Align all stakeholders (Sales, Marketing, RevOps, CS, IT) on migration goals, success criteria, and timeline expectations. End state: Documented migration charter with signed-off objectives and RACI matrix.<br /><br />• Schedule kickoff with VP Sales, VP Marketing, RevOps Lead, CS Lead, and IT representative<br />• Document each team's must-have requirements and pain points with current Salesforce setup<br />• Define unified migration objectives (cost reduction, adoption improvement, marketing-sales alignment)<br />• Establish success metrics for each department (e.g., adoption rate, data accuracy, reporting capability)<br />• Create RACI matrix for migration decisions and approvals<br />• Set realistic timeline expectations (typically 2-4 months for full migration) |
| 2. Audit Current Salesforce Environment | 8h | Document the complete Salesforce configuration including objects, fields, workflows, integrations, and customizations. End state: Comprehensive Salesforce audit document with all elements requiring migration or transformation.<br /><br />• Export Salesforce object model including standard and custom objects<br />• Document all custom fields with data types, picklist values, and field dependencies<br />• Map all active workflows, process builder flows, and automation rules<br />• Inventory all third-party integrations (Outreach, Salesloft, ZoomInfo, etc.)<br />• List all reports and dashboards currently in use by each department<br />• Identify custom code (Apex triggers, Lightning components) requiring HubSpot alternatives<br />• Document user roles, profiles, and permission sets |
| 3. Define Migration Scope and Approach | 6h | Determine what data and processes will migrate vs. be retired, and select migration methodology (phased vs. big bang). End state: Approved migration scope document with clear in/out boundaries.<br /><br />• Analyze data volumes (contacts, companies, deals, activities) to determine migration complexity<br />• Decide between phased migration (department by department) or big bang (all at once)<br />• Identify Salesforce processes to retire vs. recreate (opportunity to simplify, not just replicate)<br />• Determine historical data cutoff (e.g., last 3 years of closed deals, all open opportunities)<br />• Document custom objects that need HubSpot custom object equivalents<br />• Create risk assessment for each migration phase<br />• Get executive sign-off on migration scope and timeline |

---

### Task List: (SF-HubSpot Migration) 2. Data Assessment & Cleanup
**Contains:** Part 2

| Task | Est | Description |
|------|-----|-------------|
| 4. Analyze Data Quality in Salesforce | 8h | Assess current data quality to identify cleanup requirements before migration. End state: Data quality report with specific issues quantified and prioritization for cleanup.<br /><br />• Run duplicate detection reports on Contacts, Leads, and Accounts<br />• Analyze field completion rates for critical fields (email, phone, industry, etc.)<br />• Identify records with missing owners or invalid owner references<br />• Check for inconsistent formatting (state/province names, country codes, phone formats)<br />• Quantify stale data (contacts with no activity in 2+ years, closed-lost opportunities)<br />• Assess email validity using bounce history and engagement data<br />• Document data quality score and cleanup effort estimate |
| 5. Execute Data Cleanup in Salesforce | 20h | Clean and standardize data in Salesforce before migration to avoid importing garbage. End state: Clean dataset ready for migration with documented cleanup actions taken.<br /><br />• Merge duplicate records using Salesforce deduplication tools or third-party (Cloudingo, RingLead)<br />• Standardize picklist values and ensure consistent formatting<br />• Archive or delete records outside migration scope (old closed-lost, churned accounts)<br />• Fix missing record owners and reassign orphaned records<br />• Validate and standardize email addresses (remove known bounces, fix formatting)<br />• Clean up inconsistent naming conventions (company names, contact titles)<br />• Document all cleanup actions for audit trail |
| 6. Create Data Migration Mapping Document | 10h | Map every Salesforce field and object to its HubSpot equivalent or transformation logic. End state: Complete field mapping spreadsheet approved by stakeholders.<br /><br />• Create mapping spreadsheet with columns: SF Object, SF Field, SF Type, HubSpot Object, HubSpot Property, HubSpot Type, Transformation Notes<br />• Map standard objects (Account→Company, Contact→Contact, Opportunity→Deal, Lead→Contact)<br />• Map custom Salesforce objects to HubSpot custom objects or alternative structures<br />• Identify property type mismatches (picklist→dropdown, formula→calculated property)<br />• Document fields that will be deprecated vs. migrated<br />• Map record type variations to HubSpot pipelines or property segmentation<br />• Get sign-off from each department on their critical field mappings |

---

## Milestone 2: Salesforce to HubSpot CRM Migration - 2. Environment Setup & Data Migration
**Tag:** `sf-hubspot-migration`
**Description:** HubSpot configuration, custom properties and objects setup, deal pipelines, and full data migration execution
**Hours:** 71h

### Task List: (SF-HubSpot Migration) 3. Environment Setup
**Contains:** Part 3

| Task | Est | Description |
|------|-----|-------------|
| 7. Configure HubSpot Account Structure | 8h | Set up HubSpot account with proper structure, users, and base configuration. End state: HubSpot account ready to receive migrated data with users provisioned.<br /><br />• Provision HubSpot Enterprise licenses (Sales Hub, Marketing Hub, Service Hub as needed)<br />• Create user accounts with appropriate permission sets matching Salesforce roles<br />• Set up teams structure mirroring sales territories/regions<br />• Configure company settings (fiscal year, currency, timezone)<br />• Set up connected email domains and tracking settings<br />• Configure default properties and mandatory fields<br />• Establish naming conventions for properties, pipelines, and workflows |
| 8. Create Custom Properties and Objects | 12h | Build all custom properties and custom objects in HubSpot based on field mapping document. End state: All custom data structure created and validated before data import.<br /><br />• Create custom properties for Contacts matching Salesforce custom fields<br />• Create custom properties for Companies matching Salesforce Account fields<br />• Create custom properties for Deals matching Salesforce Opportunity fields<br />• Build custom objects in HubSpot for any Salesforce custom objects being migrated<br />• Configure property groups for logical organization<br />• Set up calculated properties for formulas that existed in Salesforce<br />• Validate property types match mapping document exactly |
| 9. Configure Deal Pipelines and Stages | 8h | Recreate Salesforce opportunity record types and sales processes as HubSpot deal pipelines. End state: All deal pipelines configured with stages, probabilities, and required properties.<br /><br />• Map each Salesforce record type/sales process to a HubSpot pipeline<br />• Configure stages with matching names and probability percentages<br />• Set required properties for each stage (matching Salesforce page layouts)<br />• Configure stage automation rules (required fields, property updates)<br />• Set up pipeline-specific dashboards for sales leadership<br />• Document any stage consolidation or simplification from Salesforce setup |

---

### Task List: (SF-HubSpot Migration) 4. Data Migration Execution
**Contains:** Part 4

| Task | Est | Description |
|------|-----|-------------|
| 10. Execute Test Migration | 8h | Run test migration with subset of data to validate mapping and identify issues. End state: Test data in HubSpot with validation report documenting any errors or mapping corrections needed.<br /><br />• Select representative sample (1,000-5,000 records per object)<br />• Use HubSpot import tool or migration service for test import<br />• Validate field mapping accuracy on imported records<br />• Check association integrity (contacts→companies, deals→contacts)<br />• Test calculated properties and property dependencies<br />• Document all mapping errors and required corrections<br />• Clear test data from HubSpot after validation |
| 11. Migrate Core Objects (Companies, Contacts) | 12h | Execute production migration of company and contact records with all historical data. End state: All companies and contacts migrated with proper associations and data integrity verified.<br /><br />• Prepare final export from Salesforce with all mapped fields<br />• Run deduplication check on export file before import<br />• Import Companies first (Salesforce Accounts)<br />• Import Contacts with company associations<br />• Verify contact-to-company associations are correct<br />• Spot-check 50-100 records for data accuracy<br />• Run data quality report comparing Salesforce to HubSpot counts |
| 12. Migrate Deals and Activities | 12h | Migrate opportunity/deal records and historical activity data. End state: All deals migrated to correct pipelines with activity history preserved.<br /><br />• Export Salesforce Opportunities with all custom fields and stage history<br />• Map opportunities to correct HubSpot pipelines based on record type<br />• Import deals with contact and company associations<br />• Migrate historical activities (emails, calls, meetings, tasks)<br />• Import notes and attachments to appropriate records<br />• Verify deal amounts, close dates, and stage accuracy<br />• Validate activity timeline displays correctly on records |
| 13. Migrate Custom Objects and Remaining Data | 11h | Complete migration of any custom objects and supplementary data. End state: All scoped data migrated with final reconciliation complete.<br /><br />• Import custom object records with proper associations<br />• Migrate any remaining standard objects (Products, Quotes if applicable)<br />• Import list memberships and segmentation data<br />• Migrate campaign membership and attribution data<br />• Run final record count reconciliation (SF vs HubSpot)<br />• Document any records that failed to migrate with root cause<br />• Get stakeholder sign-off on data migration completeness |

---

## Milestone 3: Salesforce to HubSpot CRM Migration - 3. Workflows & Reporting
**Tag:** `sf-hubspot-migration`
**Description:** Rebuild all Salesforce automations in HubSpot, reestablish integrations, and recreate reports and dashboards
**Hours:** 56h

### Task List: (SF-HubSpot Migration) 5. Workflow & Automation Rebuild
**Contains:** Part 5

| Task | Est | Description |
|------|-----|-------------|
| 14. Map and Prioritize Workflow Rebuild | 6h | Document all Salesforce workflows/automations and prioritize which to recreate in HubSpot. End state: Prioritized list of workflows to rebuild with HubSpot implementation approach for each.<br /><br />• Export list of all active Salesforce workflows, process builder flows, and flow automations<br />• Categorize by function: lead routing, deal updates, notifications, field updates<br />• Identify workflows that can be simplified or retired in HubSpot<br />• Map Salesforce automation capabilities to HubSpot equivalents<br />• Prioritize rebuilds: P1 (critical for operations), P2 (important), P3 (nice-to-have)<br />• Identify any workflows requiring HubSpot Operations Hub for complex logic |
| 15. Rebuild Lead and Contact Workflows | 12h | Recreate lead/contact automation including routing, lifecycle management, and notifications. End state: All critical lead/contact workflows operational in HubSpot.<br /><br />• Build lead routing workflows (round-robin, territory-based, or criteria-based assignment)<br />• Create lifecycle stage automation workflows<br />• Set up lead scoring if previously configured in Salesforce<br />• Build notification workflows for new leads, lead status changes<br />• Create contact enrichment workflows (integration with ZoomInfo, Clearbit if used)<br />• Configure duplicate management and merge rules<br />• Test each workflow with sample records |
| 16. Rebuild Deal and Pipeline Workflows | 10h | Recreate opportunity/deal automation including stage updates, notifications, and forecasting support. End state: All deal workflows operational supporting sales process.<br /><br />• Build deal stage automation (required fields, automatic property updates)<br />• Create notification workflows for deal stage changes, at-risk deals<br />• Set up deal rotation or assignment rules if applicable<br />• Configure forecasting category automation<br />• Build closed-won/closed-lost post-processing workflows<br />• Create renewal or expansion opportunity workflows if applicable<br />• Integrate with CPQ or quoting tools if in scope |
| 17. Rebuild Integration Workflows | 10h | Reestablish integrations with third-party tools that were connected to Salesforce. End state: All critical integrations operational with HubSpot.<br /><br />• Inventory all third-party integrations from Salesforce audit<br />• Configure native HubSpot integrations where available (Outreach, Salesloft, Gong, etc.)<br />• Set up custom integrations via HubSpot API or Operations Hub<br />• Rebuild any Zapier/Workato/Tray automations for HubSpot<br />• Test bidirectional sync with connected tools<br />• Document integration settings and data flow direction<br />• Establish monitoring for integration health |

---

### Task List: (SF-HubSpot Migration) 6. Reporting & Dashboards
**Contains:** Part 6

| Task | Est | Description |
|------|-----|-------------|
| 18. Recreate Core Reports | 10h | Rebuild critical Salesforce reports in HubSpot's reporting engine. End state: All P1 reports recreated and validated against Salesforce baseline.<br /><br />• Export list of all Salesforce reports with usage frequency<br />• Identify most-used reports by each department<br />• Rebuild pipeline and deal reports (by stage, by rep, by period)<br />• Recreate activity reports (calls, emails, meetings per rep)<br />• Build contact/lead reports (new leads, conversion rates)<br />• Configure report filters to match Salesforce report criteria<br />• Validate report numbers against Salesforce baseline data |
| 19. Build Departmental Dashboards | 8h | Create role-specific dashboards for Sales, Marketing, and RevOps leadership. End state: Live dashboards delivering same visibility as Salesforce.<br /><br />• Build Sales leadership dashboard (pipeline, forecast, rep performance)<br />• Build Marketing dashboard (lead flow, MQL conversion, campaign performance)<br />• Build RevOps dashboard (data health, process metrics, cross-funnel view)<br />• Build individual rep dashboard (their pipeline, activities, quota attainment)<br />• Configure dashboard permissions and sharing settings<br />• Schedule automated report delivery via email where needed<br />• Get sign-off from dashboard consumers on completeness |

---

## Milestone 4: Salesforce to HubSpot CRM Migration - 4. Training & Cutover
**Tag:** `sf-hubspot-migration`
**Description:** User training and enablement, hypercare support, final cutover execution, and Salesforce decommission
**Hours:** 42h

### Task List: (SF-HubSpot Migration) 7. User Training & Enablement
**Contains:** Part 7

| Task | Est | Description |
|------|-----|-------------|
| 20. Develop Training Materials | 8h | Create HubSpot training materials tailored to each role's workflow. End state: Complete training curriculum with role-specific guides and videos.<br /><br />• Create sales rep quickstart guide (navigation, record management, activities)<br />• Create sales manager guide (pipeline management, reporting, coaching views)<br />• Create marketing user guide (contact management, list building, campaign tracking)<br />• Create RevOps admin guide (property management, workflow editing, integration settings)<br />• Record short video walkthroughs for common tasks<br />• Document key differences from Salesforce for change management<br />• Create FAQ document addressing common Salesforce→HubSpot questions |
| 21. Conduct Role-Based Training Sessions | 6h | Deliver live training to all user groups with hands-on practice. End state: All users trained and comfortable with basic HubSpot operations.<br /><br />• Schedule training sessions by role (sales reps, managers, marketing, CS)<br />• Conduct 60-90 minute live training for each group<br />• Include hands-on exercises using their actual migrated data<br />• Address questions and concerns specific to each role's workflow<br />• Record sessions for future reference and new hire onboarding<br />• Distribute quickstart guides and reference materials post-training<br />• Establish HubSpot champions in each department for peer support |
| 22. Execute Hypercare Support Period | 8h | Provide intensive support during first 2-4 weeks post-go-live to drive adoption. End state: Users self-sufficient with HubSpot, adoption metrics meeting targets.<br /><br />• Set up dedicated Slack channel or Teams channel for HubSpot questions<br />• Schedule daily office hours during first week post-go-live<br />• Monitor adoption metrics (login frequency, record updates, activity logging)<br />• Track and resolve user-reported issues within 24 hours<br />• Identify and address workflow friction points quickly<br />• Celebrate wins and share success stories to build momentum<br />• Transition to standard support model after hypercare period |

---

### Task List: (SF-HubSpot Migration) 8. Cutover & Decommission
**Contains:** Part 8

| Task | Est | Description |
|------|-----|-------------|
| 23. Execute Final Cutover | 8h | Complete final data sync and officially transition all users to HubSpot. End state: HubSpot is system of record, Salesforce access restricted.<br /><br />• Freeze new data entry in Salesforce 24-48 hours before cutover<br />• Run final delta migration for records created/updated since last import<br />• Verify final record counts and data integrity<br />• Update all integration endpoints from Salesforce to HubSpot<br />• Send company-wide communication announcing official cutover<br />• Restrict Salesforce to read-only access (don't delete yet)<br />• Monitor HubSpot closely for first 48 hours post-cutover |
| 24. Validate Go-Live Success | 4h | Confirm all critical processes are operational and users are successfully working in HubSpot. End state: Go-live success criteria met, no critical blockers.<br /><br />• Verify all workflows are triggering correctly<br />• Confirm integrations are syncing bidirectionally<br />• Check that reports and dashboards are populating correctly<br />• Validate lead routing is working for new inbound leads<br />• Ensure deal updates and stage changes are processing<br />• Get verbal confirmation from key stakeholders that team is operational<br />• Document any issues requiring post-go-live remediation |
| 25. Decommission Salesforce | 8h | Archive Salesforce data and terminate licenses after stability period. End state: Salesforce fully decommissioned with data archived per retention policy.<br /><br />• Maintain Salesforce read-only access for 30-90 days as safety net<br />• Export final backup of all Salesforce data for compliance/archive<br />• Document any Salesforce data not migrated (for reference)<br />• Submit license termination request to Salesforce<br />• Update any documentation or links referencing Salesforce<br />• Archive Salesforce credentials and admin documentation<br />• Close out migration project and conduct retrospective |

---

## Summary
- **Total Milestones:** 4 (56h + 71h + 56h + 42h)
- **Total Task Lists:** 8 (consolidated from 8 Parts)
- **Total Tasks:** 25 (one per Step)
- **Total Hours:** 225h
- **Generated from:** playbook_salesforce-to-hubspot-crm-migration.md
- **Generated on:** 2025-12-31
