# Salesforce to HubSpot CRM Migration - Playbook

## 1. Definition

**What it is**: A comprehensive technical and strategic project that migrates all CRM data, processes, workflows, and automations from Salesforce to HubSpot, ensuring data integrity, business continuity, and cross-functional alignment. The deliverable is a fully operational HubSpot CRM with clean migrated data, rebuilt workflows, trained users, and decommissioned Salesforce instance.

**What it is NOT**: Not a CRM integration project (where both systems remain active and sync). Not a simple data export/import (requires workflow rebuilding and process transformation). Not a HubSpot implementation from scratch (leverages existing Salesforce processes as foundation). Not a Salesforce optimization project.

## 2. ICP Value Proposition

**Pain it solves**: Companies outgrow Salesforce's complexity and cost structure, or find sales/marketing alignment difficult when marketing lives in HubSpot while sales uses Salesforce. High license costs ($150-300/user/month), slow adoption (70% of CRM projects fail due to poor usage), and fragmented reporting across systems create friction and reduce GTM effectiveness.

**Outcome delivered**: Unified CRM with sales, marketing, and service on one platform. Clean migrated data with historical context preserved. Rebuilt workflows and automations native to HubSpot. Full team adoption through structured training. Typical outcomes include 30-50% reduction in CRM costs, improved cross-functional visibility, and ability to track sales back to specific marketing activities and campaigns.

**Who owns it**: VP of Revenue Operations or Head of Sales Operations, with close partnership from VP Marketing and IT leadership for technical execution.

## 3. Implementation Procedure

### Part 1: Discovery & Migration Strategy

#### Step 1: Conduct Stakeholder Alignment Workshop

**Step Overview:** Align all stakeholders (Sales, Marketing, RevOps, CS, IT) on migration goals, success criteria, and timeline expectations. End state: Documented migration charter with signed-off objectives and RACI matrix.

- Schedule kickoff with VP Sales, VP Marketing, RevOps Lead, CS Lead, and IT representative
- Document each team's must-have requirements and pain points with current Salesforce setup
- Define unified migration objectives (cost reduction, adoption improvement, marketing-sales alignment)
- Establish success metrics for each department (e.g., adoption rate, data accuracy, reporting capability)
- Create RACI matrix for migration decisions and approvals
- Set realistic timeline expectations (typically 2-4 months for full migration)

#### Step 2: Audit Current Salesforce Environment

**Step Overview:** Document the complete Salesforce configuration including objects, fields, workflows, integrations, and customizations. End state: Comprehensive Salesforce audit document with all elements requiring migration or transformation.

- Export Salesforce object model including standard and custom objects
- Document all custom fields with data types, picklist values, and field dependencies
- Map all active workflows, process builder flows, and automation rules
- Inventory all third-party integrations (Outreach, Salesloft, ZoomInfo, etc.)
- List all reports and dashboards currently in use by each department
- Identify custom code (Apex triggers, Lightning components) requiring HubSpot alternatives
- Document user roles, profiles, and permission sets

#### Step 3: Define Migration Scope and Approach

**Step Overview:** Determine what data and processes will migrate vs. be retired, and select migration methodology (phased vs. big bang). End state: Approved migration scope document with clear in/out boundaries.

- Analyze data volumes (contacts, companies, deals, activities) to determine migration complexity
- Decide between phased migration (department by department) or big bang (all at once)
- Identify Salesforce processes to retire vs. recreate (opportunity to simplify, not just replicate)
- Determine historical data cutoff (e.g., last 3 years of closed deals, all open opportunities)
- Document custom objects that need HubSpot custom object equivalents
- Create risk assessment for each migration phase
- Get executive sign-off on migration scope and timeline

---

### Part 2: Data Assessment & Cleanup

#### Step 1: Analyze Data Quality in Salesforce

**Step Overview:** Assess current data quality to identify cleanup requirements before migration. End state: Data quality report with specific issues quantified and prioritization for cleanup.

- Run duplicate detection reports on Contacts, Leads, and Accounts
- Analyze field completion rates for critical fields (email, phone, industry, etc.)
- Identify records with missing owners or invalid owner references
- Check for inconsistent formatting (state/province names, country codes, phone formats)
- Quantify stale data (contacts with no activity in 2+ years, closed-lost opportunities)
- Assess email validity using bounce history and engagement data
- Document data quality score and cleanup effort estimate

#### Step 2: Execute Data Cleanup in Salesforce

**Step Overview:** Clean and standardize data in Salesforce before migration to avoid importing garbage. End state: Clean dataset ready for migration with documented cleanup actions taken.

- Merge duplicate records using Salesforce deduplication tools or third-party (Cloudingo, RingLead)
- Standardize picklist values and ensure consistent formatting
- Archive or delete records outside migration scope (old closed-lost, churned accounts)
- Fix missing record owners and reassign orphaned records
- Validate and standardize email addresses (remove known bounces, fix formatting)
- Clean up inconsistent naming conventions (company names, contact titles)
- Document all cleanup actions for audit trail

#### Step 3: Create Data Migration Mapping Document

**Step Overview:** Map every Salesforce field and object to its HubSpot equivalent or transformation logic. End state: Complete field mapping spreadsheet approved by stakeholders.

- Create mapping spreadsheet with columns: SF Object, SF Field, SF Type, HubSpot Object, HubSpot Property, HubSpot Type, Transformation Notes
- Map standard objects (Account→Company, Contact→Contact, Opportunity→Deal, Lead→Contact)
- Map custom Salesforce objects to HubSpot custom objects or alternative structures
- Identify property type mismatches (picklist→dropdown, formula→calculated property)
- Document fields that will be deprecated vs. migrated
- Map record type variations to HubSpot pipelines or property segmentation
- Get sign-off from each department on their critical field mappings

---

### Part 3: HubSpot Environment Setup

#### Step 1: Configure HubSpot Account Structure

**Step Overview:** Set up HubSpot account with proper structure, users, and base configuration. End state: HubSpot account ready to receive migrated data with users provisioned.

- Provision HubSpot Enterprise licenses (Sales Hub, Marketing Hub, Service Hub as needed)
- Create user accounts with appropriate permission sets matching Salesforce roles
- Set up teams structure mirroring sales territories/regions
- Configure company settings (fiscal year, currency, timezone)
- Set up connected email domains and tracking settings
- Configure default properties and mandatory fields
- Establish naming conventions for properties, pipelines, and workflows

#### Step 2: Create Custom Properties and Objects

**Step Overview:** Build all custom properties and custom objects in HubSpot based on field mapping document. End state: All custom data structure created and validated before data import.

- Create custom properties for Contacts matching Salesforce custom fields
- Create custom properties for Companies matching Salesforce Account fields
- Create custom properties for Deals matching Salesforce Opportunity fields
- Build custom objects in HubSpot for any Salesforce custom objects being migrated
- Configure property groups for logical organization
- Set up calculated properties for formulas that existed in Salesforce
- Validate property types match mapping document exactly

#### Step 3: Configure Deal Pipelines and Stages

**Step Overview:** Recreate Salesforce opportunity record types and sales processes as HubSpot deal pipelines. End state: All deal pipelines configured with stages, probabilities, and required properties.

- Map each Salesforce record type/sales process to a HubSpot pipeline
- Configure stages with matching names and probability percentages
- Set required properties for each stage (matching Salesforce page layouts)
- Configure stage automation rules (required fields, property updates)
- Set up pipeline-specific dashboards for sales leadership
- Document any stage consolidation or simplification from Salesforce setup

---

### Part 4: Data Migration Execution

#### Step 1: Execute Test Migration

**Step Overview:** Run test migration with subset of data to validate mapping and identify issues. End state: Test data in HubSpot with validation report documenting any errors or mapping corrections needed.

- Select representative sample (1,000-5,000 records per object)
- Use HubSpot import tool or migration service for test import
- Validate field mapping accuracy on imported records
- Check association integrity (contacts→companies, deals→contacts)
- Test calculated properties and property dependencies
- Document all mapping errors and required corrections
- Clear test data from HubSpot after validation

#### Step 2: Migrate Core Objects (Companies, Contacts)

**Step Overview:** Execute production migration of company and contact records with all historical data. End state: All companies and contacts migrated with proper associations and data integrity verified.

- Prepare final export from Salesforce with all mapped fields
- Run deduplication check on export file before import
- Import Companies first (Salesforce Accounts)
- Import Contacts with company associations
- Verify contact-to-company associations are correct
- Spot-check 50-100 records for data accuracy
- Run data quality report comparing Salesforce to HubSpot counts

#### Step 3: Migrate Deals and Activities

**Step Overview:** Migrate opportunity/deal records and historical activity data. End state: All deals migrated to correct pipelines with activity history preserved.

- Export Salesforce Opportunities with all custom fields and stage history
- Map opportunities to correct HubSpot pipelines based on record type
- Import deals with contact and company associations
- Migrate historical activities (emails, calls, meetings, tasks)
- Import notes and attachments to appropriate records
- Verify deal amounts, close dates, and stage accuracy
- Validate activity timeline displays correctly on records

#### Step 4: Migrate Custom Objects and Remaining Data

**Step Overview:** Complete migration of any custom objects and supplementary data. End state: All scoped data migrated with final reconciliation complete.

- Import custom object records with proper associations
- Migrate any remaining standard objects (Products, Quotes if applicable)
- Import list memberships and segmentation data
- Migrate campaign membership and attribution data
- Run final record count reconciliation (SF vs HubSpot)
- Document any records that failed to migrate with root cause
- Get stakeholder sign-off on data migration completeness

---

### Part 5: Workflow and Automation Rebuild

#### Step 1: Map and Prioritize Workflow Rebuild

**Step Overview:** Document all Salesforce workflows/automations and prioritize which to recreate in HubSpot. End state: Prioritized list of workflows to rebuild with HubSpot implementation approach for each.

- Export list of all active Salesforce workflows, process builder flows, and flow automations
- Categorize by function: lead routing, deal updates, notifications, field updates
- Identify workflows that can be simplified or retired in HubSpot
- Map Salesforce automation capabilities to HubSpot equivalents
- Prioritize rebuilds: P1 (critical for operations), P2 (important), P3 (nice-to-have)
- Identify any workflows requiring HubSpot Operations Hub for complex logic

#### Step 2: Rebuild Lead and Contact Workflows

**Step Overview:** Recreate lead/contact automation including routing, lifecycle management, and notifications. End state: All critical lead/contact workflows operational in HubSpot.

- Build lead routing workflows (round-robin, territory-based, or criteria-based assignment)
- Create lifecycle stage automation workflows
- Set up lead scoring if previously configured in Salesforce
- Build notification workflows for new leads, lead status changes
- Create contact enrichment workflows (integration with ZoomInfo, Clearbit if used)
- Configure duplicate management and merge rules
- Test each workflow with sample records

#### Step 3: Rebuild Deal and Pipeline Workflows

**Step Overview:** Recreate opportunity/deal automation including stage updates, notifications, and forecasting support. End state: All deal workflows operational supporting sales process.

- Build deal stage automation (required fields, automatic property updates)
- Create notification workflows for deal stage changes, at-risk deals
- Set up deal rotation or assignment rules if applicable
- Configure forecasting category automation
- Build closed-won/closed-lost post-processing workflows
- Create renewal or expansion opportunity workflows if applicable
- Integrate with CPQ or quoting tools if in scope

#### Step 4: Rebuild Integration Workflows

**Step Overview:** Reestablish integrations with third-party tools that were connected to Salesforce. End state: All critical integrations operational with HubSpot.

- Inventory all third-party integrations from Salesforce audit
- Configure native HubSpot integrations where available (Outreach, Salesloft, Gong, etc.)
- Set up custom integrations via HubSpot API or Operations Hub
- Rebuild any Zapier/Workato/Tray automations for HubSpot
- Test bidirectional sync with connected tools
- Document integration settings and data flow direction
- Establish monitoring for integration health

---

### Part 6: Reporting and Dashboard Migration

#### Step 1: Recreate Core Reports

**Step Overview:** Rebuild critical Salesforce reports in HubSpot's reporting engine. End state: All P1 reports recreated and validated against Salesforce baseline.

- Export list of all Salesforce reports with usage frequency
- Identify most-used reports by each department
- Rebuild pipeline and deal reports (by stage, by rep, by period)
- Recreate activity reports (calls, emails, meetings per rep)
- Build contact/lead reports (new leads, conversion rates)
- Configure report filters to match Salesforce report criteria
- Validate report numbers against Salesforce baseline data

#### Step 2: Build Departmental Dashboards

**Step Overview:** Create role-specific dashboards for Sales, Marketing, and RevOps leadership. End state: Live dashboards delivering same visibility as Salesforce.

- Build Sales leadership dashboard (pipeline, forecast, rep performance)
- Build Marketing dashboard (lead flow, MQL conversion, campaign performance)
- Build RevOps dashboard (data health, process metrics, cross-funnel view)
- Build individual rep dashboard (their pipeline, activities, quota attainment)
- Configure dashboard permissions and sharing settings
- Schedule automated report delivery via email where needed
- Get sign-off from dashboard consumers on completeness

---

### Part 7: User Training and Enablement

#### Step 1: Develop Training Materials

**Step Overview:** Create HubSpot training materials tailored to each role's workflow. End state: Complete training curriculum with role-specific guides and videos.

- Create sales rep quickstart guide (navigation, record management, activities)
- Create sales manager guide (pipeline management, reporting, coaching views)
- Create marketing user guide (contact management, list building, campaign tracking)
- Create RevOps admin guide (property management, workflow editing, integration settings)
- Record short video walkthroughs for common tasks
- Document key differences from Salesforce for change management
- Create FAQ document addressing common Salesforce→HubSpot questions

#### Step 2: Conduct Role-Based Training Sessions

**Step Overview:** Deliver live training to all user groups with hands-on practice. End state: All users trained and comfortable with basic HubSpot operations.

- Schedule training sessions by role (sales reps, managers, marketing, CS)
- Conduct 60-90 minute live training for each group
- Include hands-on exercises using their actual migrated data
- Address questions and concerns specific to each role's workflow
- Record sessions for future reference and new hire onboarding
- Distribute quickstart guides and reference materials post-training
- Establish HubSpot champions in each department for peer support

#### Step 3: Execute Hypercare Support Period

**Step Overview:** Provide intensive support during first 2-4 weeks post-go-live to drive adoption. End state: Users self-sufficient with HubSpot, adoption metrics meeting targets.

- Set up dedicated Slack channel or Teams channel for HubSpot questions
- Schedule daily office hours during first week post-go-live
- Monitor adoption metrics (login frequency, record updates, activity logging)
- Track and resolve user-reported issues within 24 hours
- Identify and address workflow friction points quickly
- Celebrate wins and share success stories to build momentum
- Transition to standard support model after hypercare period

---

### Part 8: Cutover and Decommission

#### Step 1: Execute Final Cutover

**Step Overview:** Complete final data sync and officially transition all users to HubSpot. End state: HubSpot is system of record, Salesforce access restricted.

- Freeze new data entry in Salesforce 24-48 hours before cutover
- Run final delta migration for records created/updated since last import
- Verify final record counts and data integrity
- Update all integration endpoints from Salesforce to HubSpot
- Send company-wide communication announcing official cutover
- Restrict Salesforce to read-only access (don't delete yet)
- Monitor HubSpot closely for first 48 hours post-cutover

#### Step 2: Validate Go-Live Success

**Step Overview:** Confirm all critical processes are operational and users are successfully working in HubSpot. End state: Go-live success criteria met, no critical blockers.

- Verify all workflows are triggering correctly
- Confirm integrations are syncing bidirectionally
- Check that reports and dashboards are populating correctly
- Validate lead routing is working for new inbound leads
- Ensure deal updates and stage changes are processing
- Get verbal confirmation from key stakeholders that team is operational
- Document any issues requiring post-go-live remediation

#### Step 3: Decommission Salesforce

**Step Overview:** Archive Salesforce data and terminate licenses after stability period. End state: Salesforce fully decommissioned with data archived per retention policy.

- Maintain Salesforce read-only access for 30-90 days as safety net
- Export final backup of all Salesforce data for compliance/archive
- Document any Salesforce data not migrated (for reference)
- Submit license termination request to Salesforce
- Update any documentation or links referencing Salesforce
- Archive Salesforce credentials and admin documentation
- Close out migration project and conduct retrospective

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Active Salesforce instance with admin access and API access
- HubSpot subscription with appropriate Hub licenses (Sales Hub, Marketing Hub, etc.)
- Clear executive sponsorship and budget approval for migration project
- Inventory of all third-party tools integrated with Salesforce
- Designated project lead from client side with decision-making authority

**What client must provide:**
- Salesforce admin credentials and API access
- HubSpot super admin access
- Complete list of users to be migrated with roles
- Documentation of any Salesforce customizations (Apex, Lightning components)
- Historical data retention requirements (how far back to migrate)
- List of critical reports and dashboards currently in use
- Access to stakeholders for requirements gathering and sign-off meetings
- Availability for training sessions (typically 2-4 hours per role)

## 5. Common Pitfalls

- **Pitfall 1**: Migrating dirty data without cleanup first → **Mitigation**: Mandate data cleanup phase before any migration; set data quality thresholds that must be met before proceeding. Poor data quality is cited as the #1 cause of migration failure.

- **Pitfall 2**: Replicating Salesforce complexity instead of simplifying → **Mitigation**: Use migration as opportunity to retire unused workflows and simplify processes. Challenge every "we've always done it this way" with "does HubSpot have a better native approach?"

- **Pitfall 3**: Property type mismatches causing data loss → **Mitigation**: Validate every field mapping for type compatibility (e.g., Salesforce picklist must map to HubSpot dropdown, not text field). Run test migration and spot-check 100+ records before production import.

- **Pitfall 4**: Underestimating workflow rebuild effort → **Mitigation**: Workflows do NOT migrate automatically. Budget significant time (often 30-40% of project) for workflow audit, design, and rebuild in HubSpot. Some complex Salesforce automations require HubSpot Operations Hub.

- **Pitfall 5**: Inadequate training leading to poor adoption → **Mitigation**: Role-based training is mandatory, not optional. 70% of CRM projects fail due to poor usage. Plan hypercare support for 2-4 weeks post-go-live.

- **Pitfall 6**: Third-party integration conflicts during transition → **Mitigation**: Inventory all integrations early; plan integration cutover sequence carefully. Some tools (Outreach, Salesloft) can only connect to one CRM at a time.

## 6. Success Metrics

- **Leading Indicator**: User adoption rate in first 30 days (target: 90%+ daily login rate, 80%+ of activities logged in HubSpot)
- **Leading Indicator**: Data quality score post-migration (target: &lt;5% duplicate rate, >95% field completion on critical fields)
- **Lagging Indicator**: Sales rep time savings (target: 3-5 hours/week reduction in CRM administration)
- **Lagging Indicator**: Cost reduction achieved (target: 30-50% reduction in total CRM spend vs. Salesforce)
- **Lagging Indicator**: Marketing-to-sales attribution accuracy (target: ability to trace closed deals to originating campaign within 90 days)

---

