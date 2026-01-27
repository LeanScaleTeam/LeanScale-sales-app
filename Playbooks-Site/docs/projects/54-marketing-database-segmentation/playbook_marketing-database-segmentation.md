# Marketing Database Segmentation - Playbook

## 1. Definition

**What it is**: A strategic and technical implementation project that creates a segmented marketing database enabling targeted marketing efforts through defined segmentation criteria, enriched data, and operationalized segments in the MAP/CRM. The deliverable is a working segmentation system that allows marketing and sales teams to target specific customer categories with tailored messaging.

**What it is NOT**: Not a Market Map/ICP project (that defines ideal customer profile from scratch). Not a Lead Lifecycle project (that builds stage definitions and routing). Not a Data Enrichment-only project (segmentation uses enrichment but goes beyond just adding data fields). Not an Email Operations project (segmentation enables email targeting but doesn't build the campaigns).

## 2. ICP Value Proposition

**Pain it solves**: Marketing sends the same messaging to the entire database, resulting in low engagement rates and wasted spend. Sales can't prioritize outreach because there's no systematic way to identify which accounts fit their ICP or buying stage. The database is a single undifferentiated list rather than actionable segments.

**Outcome delivered**: A fully operationalized segmentation framework with enriched data, standardized fields, and usable segments in MAP/CRM. Marketing can run targeted campaigns by industry, company size, buying stage, or behavior. Sales can filter and prioritize accounts based on segment criteria. Reporting reflects segment-level performance.

**Who owns it**: VP of Marketing or Marketing Operations Manager, with RevOps support for CRM implementation.

## 3. Implementation Procedure

### Part 1: Define Segmentation Strategy & Criteria

#### Step 1: Assess Current Database State

**Step Overview:** Audit the existing database to understand data quality, completeness, and any existing segmentation. End state: Gap analysis documenting current state, data quality issues, and segmentation opportunities.

- Pull database summary from CRM/MAP (total records, field completion rates, duplicate count)
- Review existing segments, lists, or filters currently in use
- Interview marketing and sales stakeholders on current pain points with database targeting
- Document which fields are populated vs. empty (industry, company size, revenue, location)
- Quantify data quality issues (duplicates, outdated records, non-standardized values)
- Assess percentage of contacts associated to companies vs. orphan records

#### Step 2: Define Segmentation Criteria Framework

**Step Overview:** Establish the specific criteria and dimensions that will be used to segment the database. End state: Approved segmentation framework document with 3-5 primary segmentation dimensions.

- Identify firmographic criteria (industry, company size, revenue band, geographic region)
- Define behavioral criteria (engagement level, product interest, buying stage)
- Determine technographic criteria if relevant (tech stack, tools used)
- Align segmentation criteria with ICP and target account definitions
- Prioritize 3-5 primary segmentation dimensions based on business impact
- Get stakeholder sign-off on segmentation framework (Marketing, Sales, RevOps)

#### Step 3: Map Data Requirements to Sources

**Step Overview:** Identify what data is needed for each segmentation dimension and where it will come from. End state: Data requirements matrix showing each field, source, and enrichment method.

- List all data fields required for defined segmentation criteria
- Identify which fields exist in CRM vs. need enrichment
- Map enrichment sources for missing fields (Clay, ZoomInfo, Apollo, Clearbit)
- Document data standardization needs (industry values, company size bands, job title normalization)
- Estimate enrichment costs and coverage rates by source
- Create data requirements matrix with field, source, and priority

---

### Part 2: Data Enrichment & Cleaning

#### Step 1: Execute Data Enrichment

**Step Overview:** Enrich the database with missing segmentation fields from third-party data providers. End state: Target fields populated for 85%+ of account/contact records.

- Set up enrichment tool connections (Clay, ZoomInfo, Apollo, or similar)
- Configure field mappings between enrichment tool and CRM/MAP
- Run enrichment on account/company records first (industry, size, revenue, location)
- Run enrichment on contact records (job title, department, seniority level)
- Validate enrichment results with spot checks (10-20 sample records)
- Document enrichment coverage rates and any gaps requiring manual research

#### Step 2: Standardize Field Values

**Step Overview:** Normalize enriched and existing data into consistent, segmentable values. End state: All segmentation fields contain standardized values from defined picklists.

- Create standardized picklist values for industry (consolidate variations like "Tech" vs "Technology" vs "Information Technology")
- Define company size bands with clear thresholds (1-50, 51-200, 201-1000, 1000+)
- Normalize job titles to standard roles (C-Level, VP, Director, Manager, Individual Contributor)
- Build automation rules or use tools like Insycle to apply standardization
- Validate standardized values match across MAP and CRM
- Document standardization rules for ongoing data governance

#### Step 3: Clean and Deduplicate Database

**Step Overview:** Remove duplicates, merge records, and clean invalid data to ensure segment accuracy. End state: Database deduplicated with &lt;2% duplicate rate and orphan contacts associated to companies.

- Run duplicate detection on contacts and companies (use native tools or third-party)
- Merge or delete duplicate records following defined merge rules
- Associate orphan contacts to companies using domain matching or manual research
- Remove invalid records (bounced emails, defunct companies, test data)
- Verify data sync between HubSpot/Marketo and Salesforce after cleanup
- Document final record counts and data quality metrics

---

### Part 3: Build Segments in MAP/CRM

#### Step 1: Create Segment Definitions

**Step Overview:** Define the specific filter criteria for each segment in the MAP/CRM. End state: Documented segment definitions with clear inclusion/exclusion criteria.

- Translate segmentation framework into specific filter logic (AND/OR conditions)
- Define segment naming convention for consistency (e.g., "Industry: Technology | Size: Mid-Market")
- Create segment hierarchy if using nested segments (primary → sub-segments)
- Document each segment with name, description, criteria, and expected record count
- Validate segment logic with stakeholders before building
- Estimate segment sizes and flag any that are too small or too large to be actionable

#### Step 2: Build Segments in Marketing Automation Platform

**Step Overview:** Create the actual segments/lists in HubSpot, Marketo, or other MAP. End state: All defined segments live in MAP with contacts dynamically assigned.

- Build active/smart lists for each segment in MAP
- Configure dynamic membership criteria so contacts flow in/out automatically
- Test segment membership with sample records across different criteria combinations
- Verify segment counts match expected estimates
- Set up segment exclusions where needed (do not email, competitors, etc.)
- Document any segment dependencies or nesting relationships

#### Step 3: Sync Segments to CRM

**Step Overview:** Ensure segment data is visible and usable in Salesforce/CRM for sales team. End state: Segment fields visible on account/contact records in CRM with accurate sync.

- Create or update CRM fields to store segment values
- Configure MAP-to-CRM field mapping for segment fields
- Set up sync rules to push segment membership to CRM
- Validate sync is working correctly with test records
- Verify segment fields are visible on account and contact page layouts
- Test sales team can filter views and reports by segment criteria

---

### Part 4: Reporting, Training & Handoff

#### Step 1: Update Marketing and Sales Reporting

**Step Overview:** Modify existing reports and dashboards to leverage new segmentation data. End state: Key reports show segment-level performance metrics.

- Identify existing reports that should incorporate segment dimensions
- Add segment filters and breakdowns to marketing performance dashboards
- Update pipeline reports to show conversion by segment
- Create new segment performance report (records per segment, engagement by segment)
- Validate report accuracy with spot checks against raw data
- Document any reporting limitations or caveats

#### Step 2: Train Marketing Team on Segment Usage

**Step Overview:** Enable marketing team to use segments for campaigns and targeting. End state: Marketing team self-sufficient in using segments for campaign targeting.

- Schedule training session with marketing team (30-45 minutes)
- Demonstrate how to use segments in email campaigns, ads, and workflows
- Walk through segment selection and exclusion best practices
- Show how to interpret segment performance reports
- Create quick-reference guide for segment usage
- Record session for future reference and new team members

#### Step 3: Train Sales Team on Segment Filters

**Step Overview:** Enable sales team to use segment data for prioritization and outreach. End state: Sales team can filter and prioritize accounts using segment criteria in CRM.

- Schedule training session with sales team (20-30 minutes)
- Demonstrate how to filter account/contact views by segment
- Show how to identify high-priority accounts using segment data
- Walk through segment fields on record layouts
- Address questions about segment definitions and updates
- Create quick-reference guide for sales segment usage

#### Step 4: Document and Hand Off to Client

**Step Overview:** Transfer ownership of segmentation system to client with full documentation. End state: Client self-sufficient with documentation, governance rules, and admin access.

- Compile segmentation framework documentation (criteria, definitions, logic)
- Document data governance rules for maintaining segment quality
- Create troubleshooting guide for common segment issues
- Transfer admin access and credentials to client RevOps
- Schedule 30-day check-in to address questions
- Close out project with delivery confirmation

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce or HubSpot) with account and contact records
- Marketing Automation Platform (HubSpot, Marketo, or similar) connected to CRM
- Basic ICP definition or target market understanding
- Admin access to both CRM and MAP

**What client must provide:**
- List of current segmentation pain points and goals
- Approval on segmentation criteria and dimensions
- Budget for data enrichment tools if needed (Clay, ZoomInfo, etc.)
- Stakeholder time for interviews and training sessions
- Decision authority on segment definitions and naming

## 5. Common Pitfalls

- **Non-standardized field values causing segment leakage**: Variations like "Tech" vs "Technology" vs "IT" create incomplete segments. → **Mitigation**: Standardize all segmentation fields to picklist values before building segments, and enforce picklists going forward.

- **Orphan contacts not associated to companies**: Contacts without company associations can't be segmented by firmographic criteria. → **Mitigation**: Run company association rules using email domain matching before building segments.

- **Sync conflicts between MAP and CRM overwriting segment data**: Both systems trying to update the same field creates data inconsistency. → **Mitigation**: Define clear sync direction (MAP as source of truth for segments) and map workflows to avoid conflicts.

- **Segments too broad or too narrow to be actionable**: Segments with 50,000+ records are too broad for targeting; segments with &lt;100 records aren't worth separate treatment. → **Mitigation**: Validate segment sizes during definition phase and adjust criteria to get 500-10,000 record segments.

## 6. Success Metrics

- **Leading Indicator**: 85%+ field completion rate on primary segmentation fields (industry, company size, persona) within first 2 weeks of enrichment.

- **Lagging Indicator**: 20%+ improvement in email engagement rates (open/click) when using segment-targeted campaigns vs. full database sends, measured 60-90 days post-implementation.

---

