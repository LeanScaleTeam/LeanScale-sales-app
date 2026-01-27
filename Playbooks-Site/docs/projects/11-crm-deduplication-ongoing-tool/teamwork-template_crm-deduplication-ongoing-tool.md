# CRM Deduplication Ongoing Tool - Project Details / Task List

**Tag:** `crm-dedup`
**Total Hours:** 15h
**Structure:** Single Milestone (&lt;=50h)

---

## Milestone: CRM Deduplication Ongoing Tool
**Description:** A technical implementation project that deploys and configures dedicated deduplication software within the CRM environment to automate the ongoing identification, prevention, and merging of duplicate records across Contacts, Leads, and Accounts/Companies.

---

### Task List: (CRM Dedup) 1. Assessment & Configuration
**Contains:** Parts 1-2

| Task | Est | Description |
|------|-----|-------------|
| 1. Audit Current Duplicate Landscape | 1.5h | Analyze the existing CRM to understand the scope and sources of duplicate records. End state: Documented assessment of duplicate volume, affected objects, and root causes.<br /><br />• Run duplicate reports in CRM for Contacts/Leads and Accounts/Companies<br />• Identify common duplicate patterns (email variations, company name inconsistencies, typos)<br />• Document duplicate sources (manual entry, imports, form submissions, integrations)<br />• Quantify the duplicate rate per object (e.g., "15% of Contacts have duplicates")<br />• Interview RevOps/Sales Ops on current manual deduplication pain points<br />• Review any existing deduplication rules or validation checks in place |
| 2. Define Tool Requirements and Evaluate Options | 1.5h | Document requirements and evaluate deduplication tool options against client tech stack and needs. End state: Shortlist of 2-3 tools with feature comparison matrix.<br /><br />• Document CRM platform (Salesforce vs HubSpot) and edition/tier<br />• List integration requirements (sync between CRM and MAP, third-party tools)<br />• Define key requirements: fuzzy matching, automated vs on-demand, preview capability, unmerge/rollback<br />• Research and compare tools: Openprise, Ringlead, DemandTools, Insycle, Dedupely, native CRM tools<br />• Evaluate on: matching algorithms, automation capabilities, audit trails, cost per user<br />• Create comparison matrix with pros/cons for client review |
| 3. Select Tool and Secure Budget | 1h | Present tool recommendation and get client approval for procurement. End state: Tool selected with budget approved and procurement initiated.<br /><br />• Prepare recommendation summary with top 1-2 options<br />• Document total cost of ownership (licensing, implementation, ongoing maintenance)<br />• Present to client stakeholders with business case<br />• Get budget approval and initiate procurement/trial<br />• Confirm admin access will be provisioned |
| 4. Set Up Tool Account and CRM Connection | 1h | Create the deduplication tool account and establish connection to the CRM with proper API permissions. End state: Tool connected to CRM and ready for configuration.<br /><br />• Create deduplication tool account (admin and user accounts as needed)<br />• Connect to Salesforce/HubSpot via OAuth or API key<br />• Grant required API permissions (read/write for Contacts, Leads, Accounts, Companies)<br />• Verify connection status in tool dashboard<br />• Document credentials and admin access for client handoff |
| 5. Configure Matching Rules for Contacts/Leads | 1.5h | Set up duplicate matching rules for person records (Contacts and Leads). End state: Matching rules configured to catch exact and fuzzy duplicates on person records.<br /><br />• Define primary matching field (email address for B2B)<br />• Configure fuzzy matching rules for name variations (Sara K. vs Sarah Khan)<br />• Set matching thresholds/confidence scores for auto-merge vs manual review<br />• Add secondary matching criteria (phone, company, domain)<br />• Configure cross-object matching (Contacts vs Leads deduplication)<br />• Test rules with sample data to verify accuracy |
| 6. Configure Matching Rules for Accounts/Companies | 1h | Set up duplicate matching rules for company records. End state: Matching rules configured for Accounts/Companies with domain and name variations.<br /><br />• Define primary matching field (domain/website for B2B companies)<br />• Configure fuzzy matching for company name variations (Inc vs Incorporated, typos)<br />• Handle parent/child account relationships appropriately<br />• Set confidence thresholds for auto-merge vs manual review<br />• Address HubSpot-specific setting: disable auto-create company from contact activity if synced<br />• Test rules with sample company data |
| 7. Define Master Record Selection Rules | 1h | Configure rules for which record survives as the master when merging duplicates. End state: Master record selection criteria defined and configured.<br /><br />• Define master record criteria: most complete data, most recent activity, earliest created<br />• Configure field-level survivorship rules (which field values to keep)<br />• Ensure work email addresses are prioritized over personal for B2B<br />• Set rules for preserving opt-out/unsubscribe preferences (critical for compliance)<br />• Configure handling of related records (activities, opportunities, notes)<br />• Document master selection logic for team reference |

---

### Task List: (CRM Dedup) 2. Automation & Rollout
**Contains:** Parts 3-4

| Task | Est | Description |
|------|-----|-------------|
| 8. Configure Real-Time Duplicate Prevention | 1h | Set up preventative deduplication to stop duplicates at point of entry. End state: Validation rules active to alert or block duplicate creation.<br /><br />• Enable real-time duplicate detection on record creation<br />• Configure alert behavior: warn user, block creation, or auto-merge<br />• Set up prevention for web forms/lead capture sources<br />• Configure prevention for data imports/bulk uploads<br />• Test prevention with sample form submissions and manual entry<br />• Verify alerts display correctly to end users |
| 9. Configure Automated Merge Workflows | 1h | Set up scheduled automation to identify and merge duplicates on an ongoing basis. End state: Automated deduplication running on defined schedule with appropriate thresholds.<br /><br />• Define automation schedule (daily, weekly) based on data volume<br />• Set confidence thresholds for automated merges (high confidence only)<br />• Configure lower-confidence matches to queue for manual review<br />• Set up notification for manual review queue<br />• Enable preview/dry-run mode for initial automation runs<br />• Document automation logic and schedule |
| 10. Build Manual Review Queue and Process | 0.5h | Create a workflow for human review of uncertain duplicates. End state: Review queue configured with clear process for RevOps team.<br /><br />• Configure manual review queue in tool<br />• Define which duplicates route to manual review (below confidence threshold)<br />• Set up assignment rules (who reviews which record types)<br />• Create review checklist/criteria for merge decisions<br />• Configure unmerge capability as safeguard for incorrect merges<br />• Document manual review SOP for RevOps team |
| 11. Conduct Thorough Testing | 1.5h | Test all deduplication configurations before production rollout. End state: All matching rules, automations, and prevention validated with test data.<br /><br />• Run matching rules against test data set (known duplicates and non-duplicates)<br />• Verify false positive rate is acceptable (not merging non-duplicates)<br />• Verify false negative rate is acceptable (not missing actual duplicates)<br />• Test master record selection on merge scenarios<br />• Test prevention rules with form submissions and manual entry<br />• Test automated merge workflow in preview mode<br />• Document test results and any rule adjustments needed |
| 12. Run Initial Deduplication with Preview | 1h | Execute first production deduplication run with preview review before committing merges. End state: Initial duplicate backlog cleared with audit trail.<br /><br />• Generate preview report of all detected duplicates<br />• Review preview with client stakeholders for approval<br />• Address any unexpected matches or false positives<br />• Execute merge operation on approved duplicates<br />• Verify related records (activities, opportunities) transferred correctly<br />• Generate post-merge report showing records merged |
| 13. Train RevOps Team on Tool Usage | 1h | Train the RevOps/Sales Ops team on using the deduplication tool for ongoing management. End state: Team trained and confident in using the tool.<br /><br />• Schedule training session (30-45 minutes)<br />• Cover: how to review manual queue, how to run on-demand deduplication, how to adjust rules<br />• Walk through dashboard and reporting features<br />• Demonstrate unmerge/rollback process for incorrect merges<br />• Create quick-reference guide for common tasks<br />• Record session for future team members |
| 14. Hand Off to Client and Establish Monitoring | 0.5h | Transfer ownership to client team with documentation and establish ongoing monitoring cadence. End state: Client self-sufficient with clear monitoring routine.<br /><br />• Transfer admin credentials to client RevOps<br />• Deliver documentation package (configuration settings, matching rules, automation schedule)<br />• Set up monthly/quarterly review cadence for rule tuning<br />• Configure dashboard or report for ongoing duplicate metrics<br />• Schedule 30-day check-in to review tool performance<br />• Close out project |

---

## Summary
- **Total Task Lists:** 2 (consolidated from 4 Parts)
- **Total Tasks:** 14 (one per Step)
- **Total Hours:** 15h
- **Generated from:** playbook_crm-deduplication-ongoing-tool.md
- **Generated on:** 2025-12-31
