# Fed/PubSec CRM Partitioning - Project Details / Task List

**Tag:** `fed-pubsec-partitioning`
**Total Hours:** 75h
**Structure:** Multi-Milestone (>50h)

---

## Milestone 1: Fed/PubSec CRM Partitioning - 1. Discovery, Strategy & Configuration
**Tag:** `fed-pubsec-partitioning`
**Description:** Discovery, compliance requirements gathering, architecture assessment, strategy design, CRM configuration, and integration setup for Fed/PubSec data partitioning
**Hours:** 54h

### Task List: (Fed/PubSec CRM Partitioning) 1. Discovery & Strategy
**Contains:** Parts 1-2

| Task | Est | Description |
|------|-----|-------------|
| 1. Interview Key Stakeholders Across Both Segments | 3h | Conduct discovery sessions with Fed/PubSec leadership, commercial sales leadership, and compliance/legal to understand data handling requirements and operational needs. End state: Documented list of stakeholder requirements and concerns from both segments.<br /><br />• Schedule 30-45 min interviews with Fed/PubSec sales director and 2-3 reps<br />• Interview commercial sales leadership to understand their data access needs<br />• Meet with legal/compliance to identify regulatory requirements (ITAR, FedRAMP, DFARS, CUI handling)<br />• Document which user roles need access to which data segments<br />• Identify any cross-segment collaboration needs (e.g., account handoffs, shared pipeline reporting) |
| 2. Map Data Sensitivity Levels and Compliance Requirements | 3h | Create a comprehensive map of data sensitivity levels and the specific compliance frameworks that apply to the Fed/PubSec segment. End state: Data classification matrix showing what data requires partitioning and which regulations apply.<br /><br />• Identify which compliance frameworks apply (ITAR, FedRAMP, DFARS, CMMC, EAR)<br />• Classify data types by sensitivity level (public, internal, confidential, restricted)<br />• Document which CRM objects contain sensitive Fed/PubSec data (Accounts, Contacts, Opportunities, custom objects)<br />• Map specific fields that may contain controlled information (contract values, technical specs, agency contacts)<br />• Create data classification matrix for implementation team reference |
| 3. Document Current User Roles and Access Patterns | 2.5h | Audit existing user roles, profiles, and permission sets to understand current access levels and identify gaps. End state: Current state access audit showing who can see what data today.<br /><br />• Export list of all CRM users with their roles and profiles<br />• Map current permission sets and their assignments<br />• Document existing sharing rules and org-wide defaults<br />• Identify users who currently have access to both Fed/PubSec and commercial data<br />• Flag any compliance gaps in current access patterns |
| 4. Assess Current CRM Architecture for Partitioning Options | 3h | Evaluate the existing CRM setup to determine which partitioning approach is technically feasible and compliant. End state: Technical assessment document outlining architecture options with pros/cons.<br /><br />• Review current org structure (single org vs multi-org)<br />• Assess existing role hierarchy and whether it supports segmentation<br />• Evaluate current sharing model (OWD settings, sharing rules, manual shares)<br />• Identify integration points that may be affected (marketing automation, BI tools, APIs)<br />• Document any existing record types or business units that could be leveraged |
| 5. Design Partitioning Strategy | 4h | Select the optimal partitioning approach based on compliance requirements, technical constraints, and operational needs. End state: Approved partitioning strategy document with implementation roadmap.<br /><br />• Evaluate three primary approaches: (1) Single org with RBAC/sharing rules, (2) Separate business units within same org, (3) Completely separate CRM instance<br />• For ITAR-controlled data, assess whether GovCloud or separate instance is required<br />• Design role-based access control structure for Fed/PubSec vs commercial<br />• Define data tagging strategy (record types, custom fields, or account segmentation field)<br />• Create decision matrix and present recommendation to stakeholders for approval |
| 6. Define Data Classification and Tagging Rules | 3h | Establish the rules and logic for how records will be classified and tagged as Fed/PubSec vs commercial. End state: Data tagging ruleset with automation requirements documented.<br /><br />• Define the trigger criteria for Fed/PubSec classification (account type, industry, billing address, contract type)<br />• Design automation rules for auto-tagging new records<br />• Establish process for handling ambiguous or edge cases (e.g., commercial company with one government contract)<br />• Document rules for account ownership handoffs between segments<br />• Create process for re-classification requests when accounts change status |

---

### Task List: (Fed/PubSec CRM Partitioning) 2. Configuration & Integration
**Contains:** Parts 3-4

| Task | Est | Description |
|------|-----|-------------|
| 7. Configure Profiles, Permission Sets, and Role Hierarchy | 4h | Build the RBAC foundation in the CRM to enforce data partitioning at the user level. End state: Profiles and permission sets configured and assigned to appropriate users.<br /><br />• Create Fed/PubSec-specific profiles cloned from existing sales profiles<br />• Build permission sets for Fed/PubSec data access<br />• Configure role hierarchy to separate Fed/PubSec branch from commercial branch<br />• Set up profile-level field security to restrict sensitive fields from commercial users<br />• Assign users to appropriate profiles and permission sets |
| 8. Implement Sharing Rules and OWD Settings | 4h | Configure organization-wide defaults and sharing rules to enforce record-level visibility controls. End state: Sharing model configured with Fed/PubSec records isolated from commercial users.<br /><br />• Set OWD to Private for Accounts, Contacts, Opportunities (if not already)<br />• Create criteria-based sharing rules to grant Fed/PubSec users access to Fed/PubSec records<br />• Create criteria-based sharing rules to grant commercial users access to commercial records<br />• Configure sharing rules for related objects (Activities, Cases, custom objects)<br />• Test that implicit sharing (child records) works correctly |
| 9. Build Record Type and Data Segmentation Structure | 4h | Implement record types and custom fields to enforce data segmentation and enable proper filtering. End state: Record types and segmentation fields deployed and functional.<br /><br />• Create Fed/PubSec record types for Account, Contact, Opportunity, Lead<br />• Create custom "Business Segment" field with picklist (Fed/PubSec, Commercial)<br />• Build validation rules to enforce record type / segment alignment<br />• Configure page layouts to show segment-appropriate fields<br />• Set up default record type assignments by profile |
| 10. Migrate and Tag Existing Data | 6h | Classify and tag all existing records to comply with the new partitioning structure. End state: All historical data properly tagged and visible only to appropriate users.<br /><br />• Export existing accounts and classify as Fed/PubSec or Commercial<br />• Update Account records with Business Segment field values<br />• Cascade segmentation to child records (Contacts, Opportunities, Cases)<br />• Run data validation to ensure no records are untagged<br />• Document any records requiring manual review for classification |
| 11. Update Integrations for Partitioned Data | 7h | Modify integration points to respect data partitioning and prevent data leakage through connected systems. End state: All integrations updated with appropriate data filters and access controls.<br /><br />• Audit all active integrations (marketing automation, enrichment tools, BI, APIs)<br />• Update API user permissions to respect partitioning<br />• Configure marketing automation platform to segment Fed/PubSec contacts<br />• Update data sync filters to prevent cross-segment data flow<br />• Test integrations to confirm no data leakage |
| 12. Build Segment-Specific Reports and Dashboards | 7h | Create reporting infrastructure that respects partitioning while enabling appropriate visibility for leadership. End state: Dashboard package deployed with segment-specific and executive roll-up views.<br /><br />• Build Fed/PubSec-specific pipeline and activity reports<br />• Build commercial-specific pipeline and activity reports<br />• Create executive dashboard with aggregate metrics (no record-level detail exposure)<br />• Configure report folder security to restrict access appropriately<br />• Test dashboard filters to confirm data isolation |

---

## Milestone 2: Fed/PubSec CRM Partitioning - 2. Testing & Rollout
**Tag:** `fed-pubsec-partitioning`
**Description:** Testing, validation, user training, and go-live for Fed/PubSec CRM partitioning
**Hours:** 21h

### Task List: (Fed/PubSec CRM Partitioning) 3. Testing & Rollout
**Contains:** Parts 5-6

| Task | Est | Description |
|------|-----|-------------|
| 13. Conduct User Access Testing | 3h | Systematically test that each user role can only access appropriate data segments. End state: Access testing matrix completed with all scenarios passing.<br /><br />• Create test matrix with all user roles and expected access levels<br />• Log in as each test user type and verify record visibility<br />• Test search functionality to confirm Fed/PubSec records don't appear for commercial users<br />• Test list views and reports for proper filtering<br />• Document any access control failures for remediation |
| 14. Perform Data Leakage Audit | 3h | Conduct internal security audit to verify no data leakage paths exist. End state: Security audit report with no critical findings or all findings remediated.<br /><br />• Attempt to access Fed/PubSec data via API as commercial integration user<br />• Test report exports to confirm partitioning holds<br />• Verify that implicit sharing doesn't create unintended access<br />• Check that global search respects partitioning<br />• Review audit trail for any unauthorized access attempts during testing |
| 15. Validate Reporting Integrity | 2h | Confirm that all reports and dashboards respect partitioning boundaries and show accurate data. End state: Report validation checklist completed with all metrics verified.<br /><br />• Compare Fed/PubSec dashboard totals to direct queries<br />• Verify executive roll-up reports aggregate correctly without exposing detail<br />• Test dashboard running user settings for proper data scoping<br />• Confirm historical data appears correctly after migration<br />• Sign off on reporting accuracy with stakeholders |
| 16. Train Admins on Partitioning Maintenance | 3h | Enable CRM admins to maintain the partitioning structure and handle common scenarios. End state: Admins trained with documentation for ongoing maintenance.<br /><br />• Conduct 60-90 min admin training session<br />• Cover: adding new users, changing segment assignments, handling edge cases<br />• Document process for creating new records in correct segment<br />• Create troubleshooting guide for common access issues<br />• Deliver admin runbook with escalation procedures |
| 17. Train End Users on New Data Handling Procedures | 3h | Educate Fed/PubSec and commercial users on the new data handling requirements and how to work within the partitioned system. End state: Users trained and aware of compliance requirements.<br /><br />• Schedule separate training sessions for Fed/PubSec and commercial teams<br />• Cover: why partitioning exists, what data is restricted, how to request access<br />• Demonstrate how to create records in correct segment<br />• Explain process for account handoffs between segments<br />• Distribute quick reference cards and FAQ document |
| 18. Execute Rollout and Go-Live | 4h | Transition to the partitioned system with monitoring and rapid response capability. End state: Partitioning live in production with no critical issues.<br /><br />• Announce go-live date and communicate changes to all users<br />• Enable partitioning settings in production<br />• Monitor for access issues and user confusion during first 48 hours<br />• Provide hypercare support channel for immediate issue resolution<br />• Conduct daily standups with stakeholders during first week |
| 19. Conduct Handoff and Close Project | 3h | Transfer ownership to client team with documentation and schedule follow-up review. End state: Client self-sufficient with scheduled compliance audit.<br /><br />• Deliver complete documentation package (architecture, runbooks, training materials)<br />• Transfer admin credentials and ownership to client RevOps/IT<br />• Schedule 30-day post-go-live review<br />• Establish ongoing compliance audit cadence (quarterly recommended)<br />• Close out project and archive deliverables |

---

## Summary
- **Total Milestones:** 2 (54h + 21h)
- **Total Task Lists:** 3 (consolidated from 6 Parts)
- **Total Tasks:** 19 (one per Step)
- **Total Hours:** 75h
- **Generated from:** playbook_fed-pubsec-crm-partitioning.md
- **Generated on:** 2025-12-31
