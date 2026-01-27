# CRM Deduplication Ongoing Tool - Playbook

## 1. Definition

**What it is**: A technical implementation project that deploys and configures dedicated deduplication software within the CRM environment to automate the ongoing identification, prevention, and merging of duplicate records across Contacts, Leads, and Accounts/Companies.

**What it is NOT**: Not a one-time data cleanup project (that's CRM Deduplication). Not a data enrichment implementation. Not CRM migration or integration work (though it may integrate with existing sync tools).

## 2. ICP Value Proposition

**Pain it solves**: Duplicate records waste sales time, create confusion in outreach, trigger automation errors, skew pipeline reporting, and can lead to compliance violations when opt-out preferences are lost. Manual deduplication is unsustainable as duplicates continuously re-enter through imports, form submissions, and third-party integrations.

**Outcome delivered**: Automated real-time duplicate detection and prevention with configurable merge rules, master record selection criteria, and ongoing monitoring. Duplicates are caught before they proliferate, and existing duplicates are systematically merged with audit trails.

**Who owns it**: RevOps Leader or Sales Operations Manager.

## 3. Implementation Procedure

### Part 1: Assess Current State & Tool Requirements

#### Step 1: Audit Current Duplicate Landscape

**Step Overview:** Analyze the existing CRM to understand the scope and sources of duplicate records. End state: Documented assessment of duplicate volume, affected objects, and root causes.

- Run duplicate reports in CRM for Contacts/Leads and Accounts/Companies
- Identify common duplicate patterns (email variations, company name inconsistencies, typos)
- Document duplicate sources (manual entry, imports, form submissions, integrations)
- Quantify the duplicate rate per object (e.g., "15% of Contacts have duplicates")
- Interview RevOps/Sales Ops on current manual deduplication pain points
- Review any existing deduplication rules or validation checks in place

#### Step 2: Define Tool Requirements and Evaluate Options

**Step Overview:** Document requirements and evaluate deduplication tool options against client tech stack and needs. End state: Shortlist of 2-3 tools with feature comparison matrix.

- Document CRM platform (Salesforce vs HubSpot) and edition/tier
- List integration requirements (sync between CRM and MAP, third-party tools)
- Define key requirements: fuzzy matching, automated vs on-demand, preview capability, unmerge/rollback
- Research and compare tools: Openprise, Ringlead, DemandTools, Insycle, Dedupely, native CRM tools
- Evaluate on: matching algorithms, automation capabilities, audit trails, cost per user
- Create comparison matrix with pros/cons for client review

#### Step 3: Select Tool and Secure Budget

**Step Overview:** Present tool recommendation and get client approval for procurement. End state: Tool selected with budget approved and procurement initiated.

- Prepare recommendation summary with top 1-2 options
- Document total cost of ownership (licensing, implementation, ongoing maintenance)
- Present to client stakeholders with business case
- Get budget approval and initiate procurement/trial
- Confirm admin access will be provisioned

---

### Part 2: Configure Deduplication Tool

#### Step 1: Set Up Tool Account and CRM Connection

**Step Overview:** Create the deduplication tool account and establish connection to the CRM with proper API permissions. End state: Tool connected to CRM and ready for configuration.

- Create deduplication tool account (admin and user accounts as needed)
- Connect to Salesforce/HubSpot via OAuth or API key
- Grant required API permissions (read/write for Contacts, Leads, Accounts, Companies)
- Verify connection status in tool dashboard
- Document credentials and admin access for client handoff

#### Step 2: Configure Matching Rules for Contacts/Leads

**Step Overview:** Set up duplicate matching rules for person records (Contacts and Leads). End state: Matching rules configured to catch exact and fuzzy duplicates on person records.

- Define primary matching field (email address for B2B)
- Configure fuzzy matching rules for name variations (Sara K. vs Sarah Khan)
- Set matching thresholds/confidence scores for auto-merge vs manual review
- Add secondary matching criteria (phone, company, domain)
- Configure cross-object matching (Contacts vs Leads deduplication)
- Test rules with sample data to verify accuracy

#### Step 3: Configure Matching Rules for Accounts/Companies

**Step Overview:** Set up duplicate matching rules for company records. End state: Matching rules configured for Accounts/Companies with domain and name variations.

- Define primary matching field (domain/website for B2B companies)
- Configure fuzzy matching for company name variations (Inc vs Incorporated, typos)
- Handle parent/child account relationships appropriately
- Set confidence thresholds for auto-merge vs manual review
- Address HubSpot-specific setting: disable auto-create company from contact activity if synced
- Test rules with sample company data

#### Step 4: Define Master Record Selection Rules

**Step Overview:** Configure rules for which record survives as the master when merging duplicates. End state: Master record selection criteria defined and configured.

- Define master record criteria: most complete data, most recent activity, earliest created
- Configure field-level survivorship rules (which field values to keep)
- Ensure work email addresses are prioritized over personal for B2B
- Set rules for preserving opt-out/unsubscribe preferences (critical for compliance)
- Configure handling of related records (activities, opportunities, notes)
- Document master selection logic for team reference

---

### Part 3: Set Up Prevention and Automation

#### Step 1: Configure Real-Time Duplicate Prevention

**Step Overview:** Set up preventative deduplication to stop duplicates at point of entry. End state: Validation rules active to alert or block duplicate creation.

- Enable real-time duplicate detection on record creation
- Configure alert behavior: warn user, block creation, or auto-merge
- Set up prevention for web forms/lead capture sources
- Configure prevention for data imports/bulk uploads
- Test prevention with sample form submissions and manual entry
- Verify alerts display correctly to end users

#### Step 2: Configure Automated Merge Workflows

**Step Overview:** Set up scheduled automation to identify and merge duplicates on an ongoing basis. End state: Automated deduplication running on defined schedule with appropriate thresholds.

- Define automation schedule (daily, weekly) based on data volume
- Set confidence thresholds for automated merges (high confidence only)
- Configure lower-confidence matches to queue for manual review
- Set up notification for manual review queue
- Enable preview/dry-run mode for initial automation runs
- Document automation logic and schedule

#### Step 3: Build Manual Review Queue and Process

**Step Overview:** Create a workflow for human review of uncertain duplicates. End state: Review queue configured with clear process for RevOps team.

- Configure manual review queue in tool
- Define which duplicates route to manual review (below confidence threshold)
- Set up assignment rules (who reviews which record types)
- Create review checklist/criteria for merge decisions
- Configure unmerge capability as safeguard for incorrect merges
- Document manual review SOP for RevOps team

---

### Part 4: Testing and Rollout

#### Step 1: Conduct Thorough Testing

**Step Overview:** Test all deduplication configurations before production rollout. End state: All matching rules, automations, and prevention validated with test data.

- Run matching rules against test data set (known duplicates and non-duplicates)
- Verify false positive rate is acceptable (not merging non-duplicates)
- Verify false negative rate is acceptable (not missing actual duplicates)
- Test master record selection on merge scenarios
- Test prevention rules with form submissions and manual entry
- Test automated merge workflow in preview mode
- Document test results and any rule adjustments needed

#### Step 2: Run Initial Deduplication with Preview

**Step Overview:** Execute first production deduplication run with preview review before committing merges. End state: Initial duplicate backlog cleared with audit trail.

- Generate preview report of all detected duplicates
- Review preview with client stakeholders for approval
- Address any unexpected matches or false positives
- Execute merge operation on approved duplicates
- Verify related records (activities, opportunities) transferred correctly
- Generate post-merge report showing records merged

#### Step 3: Train RevOps Team on Tool Usage

**Step Overview:** Train the RevOps/Sales Ops team on using the deduplication tool for ongoing management. End state: Team trained and confident in using the tool.

- Schedule training session (30-45 minutes)
- Cover: how to review manual queue, how to run on-demand deduplication, how to adjust rules
- Walk through dashboard and reporting features
- Demonstrate unmerge/rollback process for incorrect merges
- Create quick-reference guide for common tasks
- Record session for future team members

#### Step 4: Hand Off to Client and Establish Monitoring

**Step Overview:** Transfer ownership to client team with documentation and establish ongoing monitoring cadence. End state: Client self-sufficient with clear monitoring routine.

- Transfer admin credentials to client RevOps
- Deliver documentation package (configuration settings, matching rules, automation schedule)
- Set up monthly/quarterly review cadence for rule tuning
- Configure dashboard or report for ongoing duplicate metrics
- Schedule 30-day check-in to review tool performance
- Close out project

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM admin access (Salesforce or HubSpot) with API permissions
- Understanding of current CRM-MAP sync configuration (if applicable)
- Budget approval range for tool licensing
- Identified RevOps owner for ongoing management

**What client must provide:**
- List of critical fields that must be preserved during merges
- Business rules for master record selection preferences
- Access to sample duplicate records for testing
- Decision-maker availability for tool selection and budget approval
- Definition of acceptable automation thresholds (what can auto-merge vs manual review)

## 5. Common Pitfalls

- **Pitfall 1**: Merging records that should not be merged (false positives) -> **Mitigation**: Start with high confidence thresholds for automation, use preview mode, enable unmerge capability, and route uncertain matches to manual review.

- **Pitfall 2**: HubSpot-Salesforce sync conflicts when merging duplicates -> **Mitigation**: Disable HubSpot auto-create company setting, align duplicate rules across platforms, and understand which system is the source of truth before merging.

- **Pitfall 3**: Losing opt-out/unsubscribe preferences during merge -> **Mitigation**: Configure survivorship rules to always preserve opt-out status from any merged record; this is critical for compliance.

- **Pitfall 4**: Duplicates continue to re-enter after cleanup -> **Mitigation**: Implement real-time prevention at all entry points (forms, imports, manual entry) and schedule ongoing automated deduplication, not just one-time cleanup.

## 6. Success Metrics

- **Leading Indicator**: Duplicate detection rate in first 30 days (tool catching duplicates at entry) and manual review queue being processed regularly.
- **Lagging Indicator**: Overall duplicate rate in CRM reduced by 80%+ within 90 days and maintained below 5% threshold ongoing.

---

