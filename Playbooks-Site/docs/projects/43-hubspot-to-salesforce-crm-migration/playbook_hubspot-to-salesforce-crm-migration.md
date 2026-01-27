# HubSpot to Salesforce CRM Migration - Playbook

## 1. Definition

**What it is**: A comprehensive CRM migration project that transfers all relevant data, workflows, automations, and reporting structures from HubSpot to Salesforce while ensuring data integrity, minimal operational disruption, and a scalable foundation for revenue operations.

**What it is NOT**: Not a CRM integration project (running both systems in parallel). Not a Salesforce implementation from scratch (assumes HubSpot history exists). Not a simple data export/import (requires workflow rebuilding, field mapping, and process alignment).

## 2. ICP Value Proposition

**Pain it solves**: Growing B2B SaaS companies hit HubSpot's limitations on customization, advanced reporting, and enterprise integrations. Data complexity increases, sales processes mature, and teams need more sophisticated pipeline management than HubSpot can provide.

**Outcome delivered**: Complete migration of all CRM data (accounts, contacts, deals, activities) to Salesforce with replicated workflows, automation, and reporting. Clean, deduplicated data with proper field mapping. Teams trained and productive on Salesforce within 30 days of go-live.

**Who owns it**: VP of RevOps or VP of Sales Operations, with cross-functional involvement from Sales, Marketing, and Customer Success leadership.

## 3. Implementation Procedure

### Part 1: Discovery & Migration Planning

#### Step 1: Define Migration Scope and Objectives

**Step Overview:** Establish clear migration goals, success criteria, and stakeholder alignment across all affected teams. End state: Signed-off migration scope document with defined success metrics.

- Conduct stakeholder interviews with Sales, Marketing, CS, and RevOps leaders
- Document current HubSpot pain points and Salesforce requirements
- Define what data migrates (all historical vs. active only) and cutoff dates
- Establish success metrics (data accuracy %, user adoption %, timeline adherence)
- Create RACI matrix for migration responsibilities
- Get executive sign-off on scope and timeline

#### Step 2: Audit Current HubSpot Environment

**Step Overview:** Document all existing HubSpot data, objects, workflows, and integrations to understand migration complexity. End state: Complete inventory of HubSpot assets requiring migration or rebuilding.

- Export full object inventory: Contacts, Companies, Deals, Tickets, Custom Objects
- Document all custom properties and their usage across objects
- Map all active workflows, sequences, and automation rules
- List all integrations (ZoomInfo, Outreach, Gong, etc.) and their data flows
- Identify reporting dashboards and metrics currently tracked
- Quantify data volume: record counts per object, activity history depth

#### Step 3: Assess Data Quality and Create Cleanup Plan

**Step Overview:** Evaluate data hygiene issues that must be resolved before migration. End state: Prioritized data cleanup plan with assigned owners and deadlines.

- Run duplicate analysis across Contacts and Companies
- Identify records with missing required fields (email, company name, owner)
- Flag stale records (no activity in 12+ months) for archive vs. migrate decision
- Document data format inconsistencies (phone numbers, addresses, picklist values)
- Create cleanup task list with effort estimates
- Assign cleanup tasks to appropriate team members with deadlines

---

### Part 2: Data Architecture & Field Mapping

#### Step 1: Design Salesforce Data Model

**Step Overview:** Define how HubSpot data structures will translate to Salesforce objects and relationships. End state: Approved Salesforce data model diagram showing all objects and relationships.

- Map HubSpot objects to Salesforce equivalents (Company→Account, Contact→Contact, Deal→Opportunity)
- Design Lead vs. Contact strategy (HubSpot has no Lead object concept)
- Define Account hierarchy structure for parent/child relationships
- Plan custom object requirements for any HubSpot custom objects
- Document Person Account vs. Business Account approach if applicable
- Review and approve data model with stakeholders

#### Step 2: Create Comprehensive Field Mapping Document

**Step Overview:** Map every HubSpot property to its Salesforce field equivalent with data type validation. End state: Complete field mapping spreadsheet covering all objects.

- Export all HubSpot properties with data types and picklist values
- Map standard fields to Salesforce standard fields
- Identify custom fields needed in Salesforce for unmapped properties
- Document data type conversions (HubSpot multi-select to Salesforce multi-picklist)
- Flag fields requiring value transformation (date formats, currency)
- Validate picklist value alignment between systems

#### Step 3: Plan Record Ownership and Assignment

**Step Overview:** Define how record ownership transfers from HubSpot to Salesforce users. End state: User mapping document and ownership assignment rules.

- Create HubSpot user to Salesforce user mapping
- Define rules for records with inactive/departed owners
- Plan territory or round-robin assignment for unowned records
- Document queue assignments for unworked leads
- Address multi-owner scenarios (HubSpot allows multiple, Salesforce typically doesn't)
- Validate all Salesforce users exist and have correct profiles

---

### Part 3: Salesforce Configuration

#### Step 1: Configure Salesforce Objects and Fields

**Step Overview:** Build the Salesforce data structure to receive migrated data based on the field mapping document. End state: All custom objects and fields created and validated in Salesforce.

- Create custom objects per data model design
- Build all custom fields with correct data types
- Configure picklist values to match HubSpot values (or create transformation mapping)
- Set up record types if needed for different business processes
- Configure page layouts for each object and record type
- Assign field-level security to appropriate profiles

#### Step 2: Rebuild Workflows and Automation

**Step Overview:** Recreate HubSpot workflows as Salesforce automation (Flows, Process Builder, or triggers). End state: All critical automation replicated and tested in Salesforce sandbox.

- Prioritize workflows by business criticality (lead routing, deal stage updates, notifications)
- Build lead assignment rules or Flow-based routing (no native round-robin in Salesforce)
- Recreate deal stage progression automation
- Set up email alerts and task creation automation
- Build approval processes for discount or deal approval workflows
- Document automation that cannot be replicated 1:1 and propose alternatives

#### Step 3: Configure Reports and Dashboards

**Step Overview:** Rebuild key HubSpot reports and dashboards in Salesforce to maintain visibility continuity. End state: Core reporting suite available in Salesforce matching current metrics.

- Identify top 10-15 most-used HubSpot reports and dashboards
- Map HubSpot report logic to Salesforce report types
- Build pipeline, activity, and conversion reports
- Create sales manager and executive dashboards
- Configure report folders and sharing permissions
- Schedule automated report delivery to match current cadence

---

### Part 4: Data Migration Execution

#### Step 1: Set Up Migration Infrastructure

**Step Overview:** Prepare the technical infrastructure for data migration including tools, sandbox, and backup processes. End state: Migration environment ready with backup and rollback capabilities.

- Select migration method: Data Loader, third-party tool (Trujay, Import2), or custom ETL
- Create full HubSpot data backup before any migration begins
- Set up Salesforce sandbox for migration testing
- Configure migration tool with HubSpot and Salesforce credentials
- Create migration scripts or templates for each object
- Establish rollback procedure in case of critical failure

#### Step 2: Execute Test Migration (Sandbox)

**Step Overview:** Run complete migration in Salesforce sandbox to identify and resolve issues before production. End state: Successful sandbox migration with documented issues and resolutions.

- Migrate Accounts/Companies first (parent records)
- Migrate Contacts with Account relationships
- Migrate Opportunities/Deals with stage history
- Migrate Activities (emails, calls, meetings, tasks)
- Validate record counts match between systems
- Test sample records for data accuracy and relationship integrity

#### Step 3: Resolve Migration Issues

**Step Overview:** Address all issues discovered during test migration before production run. End state: All blocking issues resolved, non-blocking issues documented with workarounds.

- Fix field mapping errors causing data loss or truncation
- Resolve relationship failures (orphaned contacts, missing accounts)
- Address data type conversion errors
- Handle duplicate records created during migration
- Document and accept minor data loss where unavoidable
- Re-run test migration to validate fixes

#### Step 4: Execute Production Migration

**Step Overview:** Perform final migration to production Salesforce with all data and relationships. End state: All data successfully migrated to production Salesforce.

- Schedule migration during low-activity period (weekend or after hours)
- Communicate blackout period to all users (no HubSpot updates during migration)
- Execute migration in object order: Accounts → Contacts → Opportunities → Activities
- Run validation queries after each object migration
- Verify record counts and spot-check data accuracy
- Create migration completion report with any exceptions

---

### Part 5: Integration Reconfiguration

#### Step 1: Redirect Third-Party Integrations

**Step Overview:** Reconfigure all tools that previously integrated with HubSpot to connect to Salesforce instead. End state: All critical integrations pointed to Salesforce and validated.

- Inventory all HubSpot integrations requiring redirection
- Reconfigure enrichment tools (ZoomInfo, Apollo, Clearbit) to write to Salesforce
- Update sales engagement platforms (Outreach, Salesloft) to sync with Salesforce
- Redirect conversation intelligence (Gong, Chorus) to Salesforce
- Update marketing automation connection if keeping HubSpot Marketing Hub
- Test each integration with sample records

#### Step 2: Configure Marketing Hub Integration (if applicable)

**Step Overview:** If retaining HubSpot Marketing Hub, set up native Salesforce-HubSpot sync for ongoing marketing operations. End state: Bidirectional sync active between HubSpot Marketing and Salesforce CRM.

- Enable HubSpot-Salesforce native integration
- Configure sync direction for each object (HubSpot→SF, SF→HubSpot, or bidirectional)
- Map marketing fields (lead source, campaign, lifecycle stage)
- Set up selective sync rules to prevent data pollution
- Configure lead/contact creation preferences
- Test sync with new leads and existing record updates

---

### Part 6: Testing & Validation

#### Step 1: Conduct Data Validation Testing

**Step Overview:** Systematically verify data accuracy and completeness across all migrated objects. End state: Signed-off data validation report confirming migration success.

- Compare record counts between HubSpot export and Salesforce totals
- Spot-check 50+ records per object for field accuracy
- Validate all relationships (Contact-to-Account, Opportunity-to-Account)
- Verify historical activities appear on correct records
- Confirm deal amounts and stages match source data
- Document and investigate any discrepancies

#### Step 2: Test Business Processes End-to-End

**Step Overview:** Validate that critical business workflows function correctly in the new Salesforce environment. End state: All critical processes validated and approved by process owners.

- Test lead creation and routing from web forms
- Validate opportunity stage progression and automation triggers
- Confirm email sync and activity capture working
- Test approval workflows for deals requiring sign-off
- Verify reporting accuracy against known benchmarks
- Have each team validate their specific workflows

---

### Part 7: Training & Enablement

#### Step 1: Develop Training Materials

**Step Overview:** Create role-specific training content for all Salesforce users. End state: Complete training package ready for delivery.

- Create sales rep quick-start guide (daily workflows in Salesforce)
- Build manager training for pipeline management and reporting
- Develop admin documentation for ongoing maintenance
- Record video walkthroughs for common tasks
- Create FAQ document addressing HubSpot vs. Salesforce differences
- Build reference card for key differences and new processes

#### Step 2: Deliver User Training

**Step Overview:** Train all users on Salesforce functionality and new processes before go-live. End state: All users trained and capable of performing daily tasks in Salesforce.

- Schedule role-based training sessions (sales, marketing, CS, leadership)
- Conduct live training sessions (60-90 minutes per role)
- Provide hands-on practice time in sandbox
- Address questions and concerns about workflow changes
- Distribute training materials and recordings
- Set up office hours for post-training questions

---

### Part 8: Go-Live & Handoff

#### Step 1: Execute Go-Live Cutover

**Step Overview:** Transition all users to Salesforce as the system of record with HubSpot CRM decommissioned. End state: Salesforce live as sole CRM with all users active.

- Announce go-live date and communicate expectations
- Disable HubSpot CRM write access (read-only for historical reference)
- Activate Salesforce for all users
- Monitor for critical issues in first 24-48 hours
- Provide hypercare support during first week
- Track adoption metrics (login rates, record creation, activity logging)

#### Step 2: Conduct Post-Migration Validation

**Step Overview:** Verify system stability and data integrity in the days following go-live. End state: Confirmed stable production environment with no critical issues.

- Run daily data validation reports for first week
- Monitor integration sync health
- Track and resolve user-reported issues
- Verify automation is firing correctly
- Confirm reporting accuracy with finance and leadership
- Document any ongoing issues requiring attention

#### Step 3: Complete Project Handoff

**Step Overview:** Transfer ownership and documentation to client team for ongoing operations. End state: Client self-sufficient with admin access, documentation, and support resources.

- Transfer all admin credentials and access
- Deliver complete documentation package (field mappings, automation logic, integration configs)
- Provide runbook for common maintenance tasks
- Schedule 30-day post-migration check-in
- Document lessons learned and recommendations for optimization
- Close out project and transition to ongoing support (if applicable)

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Active Salesforce org with appropriate licenses for all users
- Admin access to both HubSpot and Salesforce environments
- Stakeholder alignment on migration timeline and approach
- Budget for any required third-party migration tools
- Clear decision on what to do with HubSpot post-migration (keep Marketing Hub, full decommission, etc.)

**What client must provide:**
- HubSpot admin credentials and export access
- Salesforce admin credentials and sandbox access
- List of all third-party integrations currently connected to HubSpot
- User list with role mappings for Salesforce profiles
- Decision-makers available for scope and data model approvals
- Dedicated project sponsor to remove blockers
- User availability for training sessions

## 5. Common Pitfalls

- **Data model mismatch (Lead vs Contact)**: HubSpot has no Lead object; Salesforce requires deciding when to use Leads vs Contacts. Migrating everything as Contacts can break lead routing and conversion tracking. → **Mitigation**: Define Lead vs Contact strategy upfront based on sales process before any data moves.

- **Underestimating data cleanup effort**: Migrating dirty data just moves the problem to a new system. Duplicates, missing fields, and stale records cause adoption issues. → **Mitigation**: Budget 20-30% of project time for data cleanup. Clean before you migrate, not after.

- **Scope creep during migration**: Teams use migration as opportunity to redesign all processes. This delays go-live and increases risk. → **Mitigation**: Migrate current state first, optimize later. Document enhancement requests for Phase 2.

- **Insufficient user training**: Users familiar with HubSpot struggle with Salesforce's different UI and terminology. Low adoption kills ROI. → **Mitigation**: Role-specific training with hands-on practice. Provide comparison guides showing "how to do X in Salesforce vs HubSpot."

- **Integration timing failures**: Redirecting integrations too early or too late causes data sync gaps or duplicates. → **Mitigation**: Create integration cutover checklist with specific timing. Test each integration before and after cutover.

## 6. Success Metrics

- **Leading Indicator**: Migration test completion with &lt;2% data discrepancy rate; user training attendance >90%; zero critical blockers at go-live decision point.

- **Lagging Indicator**: 95%+ user adoption within 30 days (daily active users/total users); zero critical data issues requiring rollback; sales team productivity returns to baseline within 2 weeks of go-live.

---

