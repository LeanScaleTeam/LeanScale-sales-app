# HubSpot to Salesforce CRM Migration - Project Details / Task List

**Tag:** `hubspot-sf-migration`
**Total Hours:** 225h
**Structure:** Multi-Milestone (>50h)

---

## Milestone 1: HubSpot to Salesforce CRM Migration - 1. Discovery & Data Architecture
**Tag:** `hubspot-sf-migration`
**Description:** Define migration scope, audit HubSpot environment, assess data quality, and design Salesforce data model with complete field mapping.
**Hours:** 52h

### Task List: (HubSpot to SF Migration) 1. Discovery & Data Architecture
**Contains:** Parts 1-2

| Task | Est | Description |
|------|-----|-------------|
| 1. Define Migration Scope and Objectives | 8h | Establish clear migration goals, success criteria, and stakeholder alignment across all affected teams. End state: Signed-off migration scope document with defined success metrics.<br /><br />• Conduct stakeholder interviews with Sales, Marketing, CS, and RevOps leaders<br />• Document current HubSpot pain points and Salesforce requirements<br />• Define what data migrates (all historical vs. active only) and cutoff dates<br />• Establish success metrics (data accuracy %, user adoption %, timeline adherence)<br />• Create RACI matrix for migration responsibilities<br />• Get executive sign-off on scope and timeline |
| 2. Audit Current HubSpot Environment | 10h | Document all existing HubSpot data, objects, workflows, and integrations to understand migration complexity. End state: Complete inventory of HubSpot assets requiring migration or rebuilding.<br /><br />• Export full object inventory: Contacts, Companies, Deals, Tickets, Custom Objects<br />• Document all custom properties and their usage across objects<br />• Map all active workflows, sequences, and automation rules<br />• List all integrations (ZoomInfo, Outreach, Gong, etc.) and their data flows<br />• Identify reporting dashboards and metrics currently tracked<br />• Quantify data volume: record counts per object, activity history depth |
| 3. Assess Data Quality and Create Cleanup Plan | 8h | Evaluate data hygiene issues that must be resolved before migration. End state: Prioritized data cleanup plan with assigned owners and deadlines.<br /><br />• Run duplicate analysis across Contacts and Companies<br />• Identify records with missing required fields (email, company name, owner)<br />• Flag stale records (no activity in 12+ months) for archive vs. migrate decision<br />• Document data format inconsistencies (phone numbers, addresses, picklist values)<br />• Create cleanup task list with effort estimates<br />• Assign cleanup tasks to appropriate team members with deadlines |
| 4. Design Salesforce Data Model | 10h | Define how HubSpot data structures will translate to Salesforce objects and relationships. End state: Approved Salesforce data model diagram showing all objects and relationships.<br /><br />• Map HubSpot objects to Salesforce equivalents (Company→Account, Contact→Contact, Deal→Opportunity)<br />• Design Lead vs. Contact strategy (HubSpot has no Lead object concept)<br />• Define Account hierarchy structure for parent/child relationships<br />• Plan custom object requirements for any HubSpot custom objects<br />• Document Person Account vs. Business Account approach if applicable<br />• Review and approve data model with stakeholders |
| 5. Create Comprehensive Field Mapping Document | 10h | Map every HubSpot property to its Salesforce field equivalent with data type validation. End state: Complete field mapping spreadsheet covering all objects.<br /><br />• Export all HubSpot properties with data types and picklist values<br />• Map standard fields to Salesforce standard fields<br />• Identify custom fields needed in Salesforce for unmapped properties<br />• Document data type conversions (HubSpot multi-select to Salesforce multi-picklist)<br />• Flag fields requiring value transformation (date formats, currency)<br />• Validate picklist value alignment between systems |
| 6. Plan Record Ownership and Assignment | 6h | Define how record ownership transfers from HubSpot to Salesforce users. End state: User mapping document and ownership assignment rules.<br /><br />• Create HubSpot user to Salesforce user mapping<br />• Define rules for records with inactive/departed owners<br />• Plan territory or round-robin assignment for unowned records<br />• Document queue assignments for unworked leads<br />• Address multi-owner scenarios (HubSpot allows multiple, Salesforce typically doesn't)<br />• Validate all Salesforce users exist and have correct profiles |

---

## Milestone 2: HubSpot to Salesforce CRM Migration - 2. Salesforce Configuration
**Tag:** `hubspot-sf-migration`
**Description:** Build Salesforce data structure, recreate automation and workflows, and configure reports and dashboards.
**Hours:** 50h

### Task List: (HubSpot to SF Migration) 2. Salesforce Configuration
**Contains:** Part 3

| Task | Est | Description |
|------|-----|-------------|
| 7. Configure Salesforce Objects and Fields | 18h | Build the Salesforce data structure to receive migrated data based on the field mapping document. End state: All custom objects and fields created and validated in Salesforce.<br /><br />• Create custom objects per data model design<br />• Build all custom fields with correct data types<br />• Configure picklist values to match HubSpot values (or create transformation mapping)<br />• Set up record types if needed for different business processes<br />• Configure page layouts for each object and record type<br />• Assign field-level security to appropriate profiles |
| 8. Rebuild Workflows and Automation | 20h | Recreate HubSpot workflows as Salesforce automation (Flows, Process Builder, or triggers). End state: All critical automation replicated and tested in Salesforce sandbox.<br /><br />• Prioritize workflows by business criticality (lead routing, deal stage updates, notifications)<br />• Build lead assignment rules or Flow-based routing (no native round-robin in Salesforce)<br />• Recreate deal stage progression automation<br />• Set up email alerts and task creation automation<br />• Build approval processes for discount or deal approval workflows<br />• Document automation that cannot be replicated 1:1 and propose alternatives |
| 9. Configure Reports and Dashboards | 12h | Rebuild key HubSpot reports and dashboards in Salesforce to maintain visibility continuity. End state: Core reporting suite available in Salesforce matching current metrics.<br /><br />• Identify top 10-15 most-used HubSpot reports and dashboards<br />• Map HubSpot report logic to Salesforce report types<br />• Build pipeline, activity, and conversion reports<br />• Create sales manager and executive dashboards<br />• Configure report folders and sharing permissions<br />• Schedule automated report delivery to match current cadence |

---

## Milestone 3: HubSpot to Salesforce CRM Migration - 3. Data Migration Execution
**Tag:** `hubspot-sf-migration`
**Description:** Set up migration infrastructure, execute test and production migrations, and resolve all migration issues.
**Hours:** 55h

### Task List: (HubSpot to SF Migration) 3. Data Migration Execution
**Contains:** Part 4

| Task | Est | Description |
|------|-----|-------------|
| 10. Set Up Migration Infrastructure | 10h | Prepare the technical infrastructure for data migration including tools, sandbox, and backup processes. End state: Migration environment ready with backup and rollback capabilities.<br /><br />• Select migration method: Data Loader, third-party tool (Trujay, Import2), or custom ETL<br />• Create full HubSpot data backup before any migration begins<br />• Set up Salesforce sandbox for migration testing<br />• Configure migration tool with HubSpot and Salesforce credentials<br />• Create migration scripts or templates for each object<br />• Establish rollback procedure in case of critical failure |
| 11. Execute Test Migration (Sandbox) | 18h | Run complete migration in Salesforce sandbox to identify and resolve issues before production. End state: Successful sandbox migration with documented issues and resolutions.<br /><br />• Migrate Accounts/Companies first (parent records)<br />• Migrate Contacts with Account relationships<br />• Migrate Opportunities/Deals with stage history<br />• Migrate Activities (emails, calls, meetings, tasks)<br />• Validate record counts match between systems<br />• Test sample records for data accuracy and relationship integrity |
| 12. Resolve Migration Issues | 12h | Address all issues discovered during test migration before production run. End state: All blocking issues resolved, non-blocking issues documented with workarounds.<br /><br />• Fix field mapping errors causing data loss or truncation<br />• Resolve relationship failures (orphaned contacts, missing accounts)<br />• Address data type conversion errors<br />• Handle duplicate records created during migration<br />• Document and accept minor data loss where unavoidable<br />• Re-run test migration to validate fixes |
| 13. Execute Production Migration | 15h | Perform final migration to production Salesforce with all data and relationships. End state: All data successfully migrated to production Salesforce.<br /><br />• Schedule migration during low-activity period (weekend or after hours)<br />• Communicate blackout period to all users (no HubSpot updates during migration)<br />• Execute migration in object order: Accounts → Contacts → Opportunities → Activities<br />• Run validation queries after each object migration<br />• Verify record counts and spot-check data accuracy<br />• Create migration completion report with any exceptions |

---

## Milestone 4: HubSpot to Salesforce CRM Migration - 4. Integration & Validation
**Tag:** `hubspot-sf-migration`
**Description:** Reconfigure third-party integrations, set up Marketing Hub sync if applicable, and conduct comprehensive validation testing.
**Hours:** 36h

### Task List: (HubSpot to SF Migration) 4. Integration & Validation
**Contains:** Parts 5-6

| Task | Est | Description |
|------|-----|-------------|
| 14. Redirect Third-Party Integrations | 10h | Reconfigure all tools that previously integrated with HubSpot to connect to Salesforce instead. End state: All critical integrations pointed to Salesforce and validated.<br /><br />• Inventory all HubSpot integrations requiring redirection<br />• Reconfigure enrichment tools (ZoomInfo, Apollo, Clearbit) to write to Salesforce<br />• Update sales engagement platforms (Outreach, Salesloft) to sync with Salesforce<br />• Redirect conversation intelligence (Gong, Chorus) to Salesforce<br />• Update marketing automation connection if keeping HubSpot Marketing Hub<br />• Test each integration with sample records |
| 15. Configure Marketing Hub Integration (if applicable) | 8h | If retaining HubSpot Marketing Hub, set up native Salesforce-HubSpot sync for ongoing marketing operations. End state: Bidirectional sync active between HubSpot Marketing and Salesforce CRM.<br /><br />• Enable HubSpot-Salesforce native integration<br />• Configure sync direction for each object (HubSpot→SF, SF→HubSpot, or bidirectional)<br />• Map marketing fields (lead source, campaign, lifecycle stage)<br />• Set up selective sync rules to prevent data pollution<br />• Configure lead/contact creation preferences<br />• Test sync with new leads and existing record updates |
| 16. Conduct Data Validation Testing | 10h | Systematically verify data accuracy and completeness across all migrated objects. End state: Signed-off data validation report confirming migration success.<br /><br />• Compare record counts between HubSpot export and Salesforce totals<br />• Spot-check 50+ records per object for field accuracy<br />• Validate all relationships (Contact-to-Account, Opportunity-to-Account)<br />• Verify historical activities appear on correct records<br />• Confirm deal amounts and stages match source data<br />• Document and investigate any discrepancies |
| 17. Test Business Processes End-to-End | 8h | Validate that critical business workflows function correctly in the new Salesforce environment. End state: All critical processes validated and approved by process owners.<br /><br />• Test lead creation and routing from web forms<br />• Validate opportunity stage progression and automation triggers<br />• Confirm email sync and activity capture working<br />• Test approval workflows for deals requiring sign-off<br />• Verify reporting accuracy against known benchmarks<br />• Have each team validate their specific workflows |

---

## Milestone 5: HubSpot to Salesforce CRM Migration - 5. Training & Go-Live
**Tag:** `hubspot-sf-migration`
**Description:** Develop and deliver user training, execute go-live cutover, conduct post-migration validation, and complete project handoff.
**Hours:** 32h

### Task List: (HubSpot to SF Migration) 5. Training & Go-Live
**Contains:** Parts 7-8

| Task | Est | Description |
|------|-----|-------------|
| 18. Develop Training Materials | 6h | Create role-specific training content for all Salesforce users. End state: Complete training package ready for delivery.<br /><br />• Create sales rep quick-start guide (daily workflows in Salesforce)<br />• Build manager training for pipeline management and reporting<br />• Develop admin documentation for ongoing maintenance<br />• Record video walkthroughs for common tasks<br />• Create FAQ document addressing HubSpot vs. Salesforce differences<br />• Build reference card for key differences and new processes |
| 19. Deliver User Training | 8h | Train all users on Salesforce functionality and new processes before go-live. End state: All users trained and capable of performing daily tasks in Salesforce.<br /><br />• Schedule role-based training sessions (sales, marketing, CS, leadership)<br />• Conduct live training sessions (60-90 minutes per role)<br />• Provide hands-on practice time in sandbox<br />• Address questions and concerns about workflow changes<br />• Distribute training materials and recordings<br />• Set up office hours for post-training questions |
| 20. Execute Go-Live Cutover | 6h | Transition all users to Salesforce as the system of record with HubSpot CRM decommissioned. End state: Salesforce live as sole CRM with all users active.<br /><br />• Announce go-live date and communicate expectations<br />• Disable HubSpot CRM write access (read-only for historical reference)<br />• Activate Salesforce for all users<br />• Monitor for critical issues in first 24-48 hours<br />• Provide hypercare support during first week<br />• Track adoption metrics (login rates, record creation, activity logging) |
| 21. Conduct Post-Migration Validation | 6h | Verify system stability and data integrity in the days following go-live. End state: Confirmed stable production environment with no critical issues.<br /><br />• Run daily data validation reports for first week<br />• Monitor integration sync health<br />• Track and resolve user-reported issues<br />• Verify automation is firing correctly<br />• Confirm reporting accuracy with finance and leadership<br />• Document any ongoing issues requiring attention |
| 22. Complete Project Handoff | 6h | Transfer ownership and documentation to client team for ongoing operations. End state: Client self-sufficient with admin access, documentation, and support resources.<br /><br />• Transfer all admin credentials and access<br />• Deliver complete documentation package (field mappings, automation logic, integration configs)<br />• Provide runbook for common maintenance tasks<br />• Schedule 30-day post-migration check-in<br />• Document lessons learned and recommendations for optimization<br />• Close out project and transition to ongoing support (if applicable) |

---

## Summary
- **Total Milestones:** 5 (52h + 50h + 55h + 36h + 32h)
- **Total Task Lists:** 5 (consolidated from 8 Parts)
- **Total Tasks:** 22 (one per Step)
- **Total Hours:** 225h
- **Generated from:** playbook_hubspot-to-salesforce-crm-migration.md
- **Generated on:** 2025-12-31
