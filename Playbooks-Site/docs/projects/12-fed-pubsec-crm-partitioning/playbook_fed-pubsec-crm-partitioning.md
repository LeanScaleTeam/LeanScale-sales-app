# Fed/PubSec CRM Partitioning - Playbook

## 1. Definition

**What it is**: A compliance-driven implementation project that creates logical or physical boundaries within the CRM to isolate Federal/Public Sector sales data from commercial sales data, ensuring sensitive government-related records remain protected and compliant with regulations like ITAR, FedRAMP, and DFARS.

**What it is NOT**: Not a full CRM migration or re-implementation. Not a FedRAMP/ITAR certification project (that's a security compliance initiative). Not a duplicate CRM instance setup (though that may be one approach). Not a data cleanup or enrichment project.

## 2. ICP Value Proposition

**Pain it solves**: Companies with Federal/Public Sector sales teams face legal and compliance risks when sensitive government data (potentially ITAR-controlled or CUI) is accessible to commercial sales reps or non-US persons. Without partitioning, one data breach or improper access could result in regulatory violations, lost government contracts, or legal penalties.

**Outcome delivered**: A fully partitioned CRM environment where Fed/PubSec data is isolated from commercial data with proper RBAC controls, sharing rules, and audit trails. Sales teams can operate independently without data leakage, and compliance requirements are documented and enforceable.

**Who owns it**: VP of Sales Operations, RevOps Leader, or Compliance/Legal stakeholder with sign-off from Fed/PubSec sales leadership.

## 3. Implementation Procedure

### Part 1: Discovery & Compliance Requirements Gathering

#### Step 1: Interview Key Stakeholders Across Both Segments

**Step Overview:** Conduct discovery sessions with Fed/PubSec leadership, commercial sales leadership, and compliance/legal to understand data handling requirements and operational needs. End state: Documented list of stakeholder requirements and concerns from both segments.

- Schedule 30-45 min interviews with Fed/PubSec sales director and 2-3 reps
- Interview commercial sales leadership to understand their data access needs
- Meet with legal/compliance to identify regulatory requirements (ITAR, FedRAMP, DFARS, CUI handling)
- Document which user roles need access to which data segments
- Identify any cross-segment collaboration needs (e.g., account handoffs, shared pipeline reporting)

#### Step 2: Map Data Sensitivity Levels and Compliance Requirements

**Step Overview:** Create a comprehensive map of data sensitivity levels and the specific compliance frameworks that apply to the Fed/PubSec segment. End state: Data classification matrix showing what data requires partitioning and which regulations apply.

- Identify which compliance frameworks apply (ITAR, FedRAMP, DFARS, CMMC, EAR)
- Classify data types by sensitivity level (public, internal, confidential, restricted)
- Document which CRM objects contain sensitive Fed/PubSec data (Accounts, Contacts, Opportunities, custom objects)
- Map specific fields that may contain controlled information (contract values, technical specs, agency contacts)
- Create data classification matrix for implementation team reference

#### Step 3: Document Current User Roles and Access Patterns

**Step Overview:** Audit existing user roles, profiles, and permission sets to understand current access levels and identify gaps. End state: Current state access audit showing who can see what data today.

- Export list of all CRM users with their roles and profiles
- Map current permission sets and their assignments
- Document existing sharing rules and org-wide defaults
- Identify users who currently have access to both Fed/PubSec and commercial data
- Flag any compliance gaps in current access patterns

---

### Part 2: Architecture Assessment & Strategy Design

#### Step 1: Assess Current CRM Architecture for Partitioning Options

**Step Overview:** Evaluate the existing CRM setup to determine which partitioning approach is technically feasible and compliant. End state: Technical assessment document outlining architecture options with pros/cons.

- Review current org structure (single org vs multi-org)
- Assess existing role hierarchy and whether it supports segmentation
- Evaluate current sharing model (OWD settings, sharing rules, manual shares)
- Identify integration points that may be affected (marketing automation, BI tools, APIs)
- Document any existing record types or business units that could be leveraged

#### Step 2: Design Partitioning Strategy

**Step Overview:** Select the optimal partitioning approach based on compliance requirements, technical constraints, and operational needs. End state: Approved partitioning strategy document with implementation roadmap.

- Evaluate three primary approaches: (1) Single org with RBAC/sharing rules, (2) Separate business units within same org, (3) Completely separate CRM instance
- For ITAR-controlled data, assess whether GovCloud or separate instance is required
- Design role-based access control structure for Fed/PubSec vs commercial
- Define data tagging strategy (record types, custom fields, or account segmentation field)
- Create decision matrix and present recommendation to stakeholders for approval

#### Step 3: Define Data Classification and Tagging Rules

**Step Overview:** Establish the rules and logic for how records will be classified and tagged as Fed/PubSec vs commercial. End state: Data tagging ruleset with automation requirements documented.

- Define the trigger criteria for Fed/PubSec classification (account type, industry, billing address, contract type)
- Design automation rules for auto-tagging new records
- Establish process for handling ambiguous or edge cases (e.g., commercial company with one government contract)
- Document rules for account ownership handoffs between segments
- Create process for re-classification requests when accounts change status

---

### Part 3: CRM Configuration & Implementation

#### Step 1: Configure Profiles, Permission Sets, and Role Hierarchy

**Step Overview:** Build the RBAC foundation in the CRM to enforce data partitioning at the user level. End state: Profiles and permission sets configured and assigned to appropriate users.

- Create Fed/PubSec-specific profiles cloned from existing sales profiles
- Build permission sets for Fed/PubSec data access
- Configure role hierarchy to separate Fed/PubSec branch from commercial branch
- Set up profile-level field security to restrict sensitive fields from commercial users
- Assign users to appropriate profiles and permission sets

#### Step 2: Implement Sharing Rules and OWD Settings

**Step Overview:** Configure organization-wide defaults and sharing rules to enforce record-level visibility controls. End state: Sharing model configured with Fed/PubSec records isolated from commercial users.

- Set OWD to Private for Accounts, Contacts, Opportunities (if not already)
- Create criteria-based sharing rules to grant Fed/PubSec users access to Fed/PubSec records
- Create criteria-based sharing rules to grant commercial users access to commercial records
- Configure sharing rules for related objects (Activities, Cases, custom objects)
- Test that implicit sharing (child records) works correctly

#### Step 3: Build Record Type and Data Segmentation Structure

**Step Overview:** Implement record types and custom fields to enforce data segmentation and enable proper filtering. End state: Record types and segmentation fields deployed and functional.

- Create Fed/PubSec record types for Account, Contact, Opportunity, Lead
- Create custom "Business Segment" field with picklist (Fed/PubSec, Commercial)
- Build validation rules to enforce record type / segment alignment
- Configure page layouts to show segment-appropriate fields
- Set up default record type assignments by profile

#### Step 4: Migrate and Tag Existing Data

**Step Overview:** Classify and tag all existing records to comply with the new partitioning structure. End state: All historical data properly tagged and visible only to appropriate users.

- Export existing accounts and classify as Fed/PubSec or Commercial
- Update Account records with Business Segment field values
- Cascade segmentation to child records (Contacts, Opportunities, Cases)
- Run data validation to ensure no records are untagged
- Document any records requiring manual review for classification

---

### Part 4: Integration & Reporting Configuration

#### Step 1: Update Integrations for Partitioned Data

**Step Overview:** Modify integration points to respect data partitioning and prevent data leakage through connected systems. End state: All integrations updated with appropriate data filters and access controls.

- Audit all active integrations (marketing automation, enrichment tools, BI, APIs)
- Update API user permissions to respect partitioning
- Configure marketing automation platform to segment Fed/PubSec contacts
- Update data sync filters to prevent cross-segment data flow
- Test integrations to confirm no data leakage

#### Step 2: Build Segment-Specific Reports and Dashboards

**Step Overview:** Create reporting infrastructure that respects partitioning while enabling appropriate visibility for leadership. End state: Dashboard package deployed with segment-specific and executive roll-up views.

- Build Fed/PubSec-specific pipeline and activity reports
- Build commercial-specific pipeline and activity reports
- Create executive dashboard with aggregate metrics (no record-level detail exposure)
- Configure report folder security to restrict access appropriately
- Test dashboard filters to confirm data isolation

---

### Part 5: Testing & Validation

#### Step 1: Conduct User Access Testing

**Step Overview:** Systematically test that each user role can only access appropriate data segments. End state: Access testing matrix completed with all scenarios passing.

- Create test matrix with all user roles and expected access levels
- Log in as each test user type and verify record visibility
- Test search functionality to confirm Fed/PubSec records don't appear for commercial users
- Test list views and reports for proper filtering
- Document any access control failures for remediation

#### Step 2: Perform Data Leakage Audit

**Step Overview:** Conduct internal security audit to verify no data leakage paths exist. End state: Security audit report with no critical findings or all findings remediated.

- Attempt to access Fed/PubSec data via API as commercial integration user
- Test report exports to confirm partitioning holds
- Verify that implicit sharing doesn't create unintended access
- Check that global search respects partitioning
- Review audit trail for any unauthorized access attempts during testing

#### Step 3: Validate Reporting Integrity

**Step Overview:** Confirm that all reports and dashboards respect partitioning boundaries and show accurate data. End state: Report validation checklist completed with all metrics verified.

- Compare Fed/PubSec dashboard totals to direct queries
- Verify executive roll-up reports aggregate correctly without exposing detail
- Test dashboard running user settings for proper data scoping
- Confirm historical data appears correctly after migration
- Sign off on reporting accuracy with stakeholders

---

### Part 6: Training & Rollout

#### Step 1: Train Admins on Partitioning Maintenance

**Step Overview:** Enable CRM admins to maintain the partitioning structure and handle common scenarios. End state: Admins trained with documentation for ongoing maintenance.

- Conduct 60-90 min admin training session
- Cover: adding new users, changing segment assignments, handling edge cases
- Document process for creating new records in correct segment
- Create troubleshooting guide for common access issues
- Deliver admin runbook with escalation procedures

#### Step 2: Train End Users on New Data Handling Procedures

**Step Overview:** Educate Fed/PubSec and commercial users on the new data handling requirements and how to work within the partitioned system. End state: Users trained and aware of compliance requirements.

- Schedule separate training sessions for Fed/PubSec and commercial teams
- Cover: why partitioning exists, what data is restricted, how to request access
- Demonstrate how to create records in correct segment
- Explain process for account handoffs between segments
- Distribute quick reference cards and FAQ document

#### Step 3: Execute Rollout and Go-Live

**Step Overview:** Transition to the partitioned system with monitoring and rapid response capability. End state: Partitioning live in production with no critical issues.

- Announce go-live date and communicate changes to all users
- Enable partitioning settings in production
- Monitor for access issues and user confusion during first 48 hours
- Provide hypercare support channel for immediate issue resolution
- Conduct daily standups with stakeholders during first week

#### Step 4: Conduct Handoff and Close Project

**Step Overview:** Transfer ownership to client team with documentation and schedule follow-up review. End state: Client self-sufficient with scheduled compliance audit.

- Deliver complete documentation package (architecture, runbooks, training materials)
- Transfer admin credentials and ownership to client RevOps/IT
- Schedule 30-day post-go-live review
- Establish ongoing compliance audit cadence (quarterly recommended)
- Close out project and archive deliverables

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM admin access with permission to modify sharing settings, profiles, and permission sets
- Clear list of which accounts/records are Fed/PubSec vs commercial
- Understanding of applicable compliance frameworks (ITAR, FedRAMP, DFARS)
- Executive sponsorship from both Fed/PubSec and commercial leadership

**What client must provide:**
- Stakeholder availability for discovery interviews (Fed/PubSec lead, commercial lead, legal/compliance)
- Account classification data or criteria for Fed/PubSec identification
- List of all current CRM users with their intended segment access
- Documentation of existing compliance requirements and audits
- Decision-making authority for partitioning strategy approval

## 5. Common Pitfalls

- **Pitfall 1**: Implicit sharing creates access loopholes (child records inherit parent sharing) → **Mitigation**: Test all parent-child relationships and configure OWD at each object level; use sharing rule filters that account for object relationships

- **Pitfall 2**: Integration users bypass partitioning (API users often have elevated permissions) → **Mitigation**: Create dedicated integration users for each segment with appropriately scoped permissions; audit all active integrations before go-live

- **Pitfall 3**: Report exports expose restricted data (users can export data they can see in reports) → **Mitigation**: Restrict export permissions in Fed/PubSec profiles; implement report folder security and dashboard running user controls

- **Pitfall 4**: Edge case accounts fall through classification (companies with both commercial and government contracts) → **Mitigation**: Establish clear classification rules and escalation process; consider account splitting for hybrid customers; document decisions for audit trail

## 6. Success Metrics

- **Leading Indicator**: Zero failed access tests during validation phase; all user roles pass visibility testing matrix; zero data leakage findings in security audit

- **Lagging Indicator**: Clean compliance audit at 90 days post-go-live; zero unauthorized access incidents; Fed/PubSec team reports full confidence in data isolation

---

