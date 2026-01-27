# CRM Deduplication - Playbook

## 1. Definition

**What it is**: A systematic data quality project that identifies, analyzes, and merges duplicate records (contacts, leads, accounts) within the CRM to ensure a single, accurate source of truth for every customer and prospect. The project establishes both the initial cleanup and ongoing governance processes to prevent duplicate re-creation.

**What it is NOT**: Not a CRM migration project (that's separate). Not a general data enrichment project (enrichment adds new data; deduplication consolidates existing data). Not a one-time cleanup exercise without ongoing governance. Not a Salesforce-HubSpot sync fix (that's integration troubleshooting).

## 2. ICP Value Proposition

**Pain it solves**: Sales reps waste time chasing leads already owned by colleagues, marketing sends duplicate emails damaging brand credibility, reporting shows inflated pipeline and contact counts, and attribution becomes impossible when the same person exists as 3 different records. The average duplicate rate in CRM databases is 20-30%, causing automation failures, routing errors, and eroded trust in data.

**Outcome delivered**: A clean CRM with a single, comprehensive record for each contact and account, automated duplicate prevention rules in place, and clear data governance policies that maintain data quality over time. Reps stop hearing "I'm already working that lead" and marketing can trust their audience counts.

**Who owns it**: RevOps Manager or CRM Administrator (with buy-in from Sales and Marketing leadership)

## 3. Implementation Procedure

### Part 1: Assess Current State & Define Strategy

#### Step 1: Audit Current Duplicate Landscape

**Step Overview:** Export sample data and quantify the duplicate problem across CRM objects. End state: Documented baseline of duplicate rates and patterns for contacts, leads, and accounts.

- Pull export of contacts, leads, and accounts from CRM (last 90 days of created records minimum)
- Run duplicate detection report using native CRM tools or trial of deduplication tool
- Categorize duplicates by type: exact email matches, fuzzy name matches, company variations
- Calculate duplicate percentage for each object (contacts typically 20-30% in uncleaned databases)
- Identify top 5 sources creating duplicates (web forms, imports, manual creation, integrations)
- Document sample duplicate clusters showing the merge complexity

#### Step 2: Interview Stakeholders on Pain Points

**Step Overview:** Gather qualitative input from CRM users on duplicate-related friction. End state: List of prioritized pain points and business rules that must be preserved during merge.

- Interview CRM admin to understand current data entry processes and known problem areas
- Interview 2-3 sales reps on "I'm already working that lead" frequency and manual workarounds
- Interview marketing ops on email bounce rates and campaign segmentation issues
- Document any custom fields or integration IDs that must be preserved during merges
- Identify any existing duplicate handling processes (even informal ones)

#### Step 3: Define Matching Criteria and Master Record Rules

**Step Overview:** Establish the technical rules for what constitutes a duplicate and which record wins. End state: Documented deduplication rules approved by stakeholders.

- Define primary matching criteria (email address is typically the anchor for B2B)
- Define secondary matching criteria (phone, company name + first/last name combination)
- Establish fuzzy matching thresholds (how similar must names be to flag as potential duplicates)
- Create master record selection hierarchy (e.g., most recent activity > most complete data > oldest created date)
- Document special handling for free email domains (Gmail, Hotmail should not be master unless only option)
- Get sign-off from RevOps lead and CRM admin on rules before proceeding

---

### Part 2: Select and Configure Deduplication Tool

#### Step 1: Evaluate Tool Options Against Requirements

**Step Overview:** Compare deduplication tool options based on client's CRM, budget, and matching needs. End state: Tool selected with procurement initiated.

- Document client's CRM (Salesforce or HubSpot) and any integrations that affect deduplication
- Evaluate native CRM tools (Salesforce Duplicate Management, HubSpot native deduplication)
- Evaluate third-party options: Insycle, Dedupely, Cloudingo, DemandTools, RingLead
- Compare on: fuzzy matching capabilities, preview/undo options, bulk processing limits, cost per user
- Consider integration limitations (e.g., HubSpot can't merge companies when Salesforce integration is active)
- Present recommendation with pros/cons to client and get budget approval

#### Step 2: Configure Tool with Matching Rules

**Step Overview:** Set up the deduplication tool with the approved matching criteria and merge rules. End state: Tool configured and ready for test run.

- Install/connect deduplication tool to CRM environment
- Configure primary matching field (email) with exact match rules
- Configure secondary matching fields with appropriate fuzzy match thresholds
- Set up master record selection logic per approved hierarchy
- Configure field merge behavior (which fields take master value vs. concatenate vs. most recent)
- Define handling for related records (activities, tasks, opportunities linked to merged records)
- Save configuration and document settings for future reference

---

### Part 3: Execute Deduplication Process

#### Step 1: Run Test Batch and Validate Accuracy

**Step Overview:** Process a small test batch to validate matching accuracy before full execution. End state: Validated deduplication rules with acceptable false positive/negative rates.

- Select test batch of 300-500 records across objects (contacts, leads, accounts)
- Run deduplication tool in preview mode (no actual merges)
- Manually review 50+ potential duplicate pairs for accuracy
- Calculate false positive rate (records flagged that are NOT duplicates)
- Calculate false negative rate (known duplicates that were missed)
- Adjust matching thresholds if false positive rate exceeds 5%
- Document any edge cases requiring special handling

#### Step 2: Execute Full Deduplication in Batches

**Step Overview:** Process all duplicate records in controlled batches with rollback capability. End state: All identified duplicates merged with documented results.

- Ensure CRM backup is completed before proceeding (verify with client IT/admin)
- Start with lowest-risk object (typically contacts before accounts)
- Process in batches of 500-1000 records to maintain control
- Review batch results before proceeding to next batch
- Document merge counts: records before, records after, merge ratio
- Handle exceptions and edge cases flagged during batch processing
- Move to next object type after completing current object
- Generate final deduplication report with total records merged by object

#### Step 3: Verify Data Integrity Post-Merge

**Step Overview:** Confirm that merges preserved critical data and related records remained linked. End state: Verified clean database with no data loss or broken relationships.

- Spot-check 20-30 merged records to verify field values preserved correctly
- Verify related records (activities, opportunities, tasks) are still linked to surviving records
- Check that integration IDs (Salesforce ID, HubSpot ID, etc.) were preserved per rules
- Run critical reports/dashboards to confirm data integrity
- Address any data issues discovered during verification

---

### Part 4: Configure Duplicate Prevention

#### Step 1: Set Up Real-Time Duplicate Alerts

**Step Overview:** Configure CRM to warn users when creating potential duplicates. End state: Users receive alerts before creating duplicate records.

- Enable native duplicate detection rules in CRM (Salesforce Matching Rules, HubSpot duplicate management)
- Configure alert behavior (block vs. warn) based on match confidence
- Set up duplicate alerts for key entry points: manual creation, lead forms, imports
- Configure alert message with guidance on how to find existing record
- Test duplicate alert with sample records across each entry point

#### Step 2: Create Validation Rules to Prevent Duplicates

**Step Overview:** Implement hard blocks on duplicate creation where appropriate. End state: System-enforced prevention of obvious duplicates.

- Create validation rule to require email address on contact/lead creation (prevents duplicates impossible to match)
- Configure required field validation to ensure matching criteria fields are populated
- Set up email domain validation (standardize formatting, lowercase)
- Create workflow to standardize company names at entry (trim whitespace, standardize abbreviations)
- Test validation rules to ensure they don't block legitimate record creation

#### Step 3: Build Ongoing Automated Scans

**Step Overview:** Configure recurring deduplication scans to catch duplicates that slip through prevention. End state: Scheduled automated duplicate detection running weekly/monthly.

- Schedule recurring duplicate scan (weekly for high-volume databases, monthly for lower volume)
- Configure scan to generate report of potential duplicates for review
- Set up notification to RevOps admin when scan completes
- Define SLA for reviewing and resolving flagged duplicates
- Create process for handling low-confidence matches requiring manual review

---

### Part 5: Training & Governance Handoff

#### Step 1: Create Data Governance Documentation

**Step Overview:** Document all deduplication rules, processes, and procedures for ongoing maintenance. End state: Complete Data Governance SOP ready for client ownership.

- Document matching criteria and master record selection rules
- Create duplicate handling procedure (what to do when duplicate is found)
- Document import best practices to prevent duplicate creation
- Create troubleshooting guide for common duplicate scenarios
- Document tool admin access and configuration settings
- Include escalation path for complex duplicate situations

#### Step 2: Train Team on Data Entry Best Practices

**Step Overview:** Conduct training session with end users on preventing duplicates at the source. End state: Team trained and aligned on duplicate prevention.

- Schedule 30-45 minute training session with sales and marketing teams
- Cover: how duplicates impact their work, what prevention is now in place, how to respond to alerts
- Demonstrate how to search for existing records before creating new ones
- Review data entry standards (email format, company name standardization)
- Provide quick-reference card with duplicate prevention tips
- Record session for onboarding new team members

#### Step 3: Hand Off to Client RevOps Team

**Step Overview:** Transfer ownership of deduplication tools and ongoing maintenance to client. End state: Client self-sufficient with admin access, documentation, and scheduled reviews.

- Transfer deduplication tool admin credentials to client RevOps team
- Walk through tool configuration and how to adjust matching rules
- Review scheduled scan process and how to interpret results
- Deliver complete documentation package
- Schedule 30-day check-in to review new duplicate creation rate
- Provide guidance on when to re-run bulk deduplication (typically quarterly)

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Admin access to CRM (Salesforce, HubSpot, or target system)
- Decision on deduplication tool (client-provided or LeanScale-recommended)
- Stakeholder alignment on which objects to prioritize (contacts, leads, accounts, or all)
- Backup of CRM data completed before deduplication begins
- Understanding of any active integrations that affect duplicate handling (e.g., HubSpot-Salesforce sync)

**What client must provide:**
- CRM admin credentials or sandbox access for testing
- List of key fields that must be preserved during merges (custom fields, integration IDs)
- Business rules for master record selection (e.g., "always keep record with Salesforce integration ID")
- Time commitment from RevOps/CRM admin for review sessions (4-6 hours across project)
- Budget approval for third-party deduplication tool if needed

## 5. Common Pitfalls

- **Pitfall 1**: Merging records that are not actually duplicates (false positives) - leads to lost notes, confused deal history, and angry sales reps. **Mitigation**: Start with tight matching criteria (exact email match only), run preview reports, and manually review first batch before expanding to fuzzy matching.

- **Pitfall 2**: Treating deduplication as a one-time event - duplicates return within weeks without prevention rules. **Mitigation**: Always pair cleanup with prevention automation (duplicate alerts, validation rules) and schedule recurring deduplication scans.

- **Pitfall 3**: Ignoring integration constraints between platforms - merging in HubSpot while Salesforce integration is active can break sync or create orphaned records. **Mitigation**: Understand integration dependencies before merging, potentially pause sync during bulk operations, and test merge behavior in sandbox first.

- **Pitfall 4**: Relying solely on native CRM deduplication tools - they only catch exact matches and miss "Bob" vs "Robert" or address variations. **Mitigation**: Use specialized deduplication tools with fuzzy matching, phonetic matching, and customizable rules for B2B contexts.

## 6. Success Metrics

- **Leading Indicator**: Duplicate rate drops from baseline (e.g., 25% to under 5%) immediately post-cleanup; team reports fewer "I'm already working that lead" conflicts; duplicate alert triggers decrease over first 2 weeks
- **Lagging Indicator**: Sustained duplicate rate under 5% at 90-day check-in; reporting accuracy improves (pipeline counts, contact attribution); marketing email bounce/complaint rates decrease

---

