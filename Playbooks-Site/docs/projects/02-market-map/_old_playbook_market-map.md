# Market Map - Playbook

## 1. Definition

**What it is**: A strategic data infrastructure project that identifies, enriches, and tiers your Total Addressable Market (TAM) into actionable account segments with ICP fit scores, then operationalizes this intelligence directly in your CRM and outbound tools (Clay, ZoomInfo, Apollo). The output is a living, queryable market database that enables precise targeting across sales, marketing, and RevOps.

**What it is NOT**: Not a one-time ICP definition exercise (personas without data). Not a competitive analysis report. Not a CRM cleanup project (that's data hygiene). Not lead scoring implementation (that's a downstream project). Not territory planning (though it informs it).

## 2. ICP Value Proposition

**Pain it solves**: Sales and marketing teams waste 40-60% of outbound effort targeting accounts that will never convert because there's no systematic way to identify which accounts in their TAM actually match their best customers. Reps chase logos based on gut feel while high-fit accounts go untouched.

**Outcome delivered**: A tiered account database (Tier 1/2/3) with enriched firmographic, technographic, and intent data loaded into CRM, enabling sales to focus exclusively on high-probability accounts and marketing to run segmented campaigns with 2-3x higher conversion rates.

**Who owns it**: VP of Marketing or Head of RevOps (occasionally CRO at smaller companies). Requires buy-in from Sales leadership since it dictates who reps will target.

## 3. Implementation Procedure

### Part 1: Assess Current State & Validate ICP

#### Step 1: Audit Existing Customer Data and Win Patterns

**Step Overview:** Analyze closed-won deal data to identify patterns among top-performing customers and establish a data-driven foundation for ICP criteria. End state: Clear understanding of what attributes correlate with successful deals.

- Pull closed-won deal data from CRM for last 12-24 months (minimum 50 deals, ideally 100+)
- Identify top 20% of customers by ACV, retention rate, and sales cycle length
- Document common firmographic attributes (industry, employee count, revenue range, geography)
- Identify technographic patterns (tech stack, tools used, infrastructure)
- Note behavioral signals present at time of close (funding events, hiring patterns, growth signals)
- Compare actual closed-won patterns against any existing ICP documentation to identify gaps

#### Step 2: Conduct Stakeholder Interviews for Tribal Knowledge

**Step Overview:** Capture qualitative insights from sales leaders about ideal customer characteristics that may not appear in CRM data. End state: Documented tribal knowledge on best-fit account signals beyond raw data.

- Schedule 30-45 minute interviews with 2-3 senior sales leaders or top performers
- Ask about characteristics of their best deals vs. worst deals (beyond firmographics)
- Probe for red flags and negative signals that indicate poor fit
- Document soft signals: decision-making speed, champion profiles, competitive landscape
- Identify patterns in deals that closed fast vs. stalled indefinitely
- Synthesize interview insights into candidate ICP attributes for validation

#### Step 3: Define ICP Scoring Attributes and Weights

**Step Overview:** Select and weight the 8-12 firmographic, technographic, and behavioral attributes that will drive tier assignment. End state: Draft ICP Fit Scoring Rubric with weighted attributes.

- Select 8-12 core attributes based on closed-won analysis and stakeholder input
- Assign weights to each attribute based on correlation with deal success (e.g., 1-5 scale)
- Define specific values for each attribute (e.g., employee count: 100-500 = 5 points, 50-100 = 3 points)
- Include at least 2-3 technographic signals (tech stack, infrastructure, tools)
- Include at least 1-2 behavioral/intent signals (funding, hiring, growth)
- Document negative attributes that disqualify accounts or reduce scores

---

### Part 2: Align on Tiering Model and Scope

#### Step 1: Define Tier Thresholds and Criteria

**Step Overview:** Establish clear, objective criteria for what constitutes Tier 1, Tier 2, and Tier 3 accounts based on ICP scores. End state: Documented tier definitions with score ranges and qualitative descriptions.

- Define Tier 1 threshold (e.g., ICP score 80+) representing highest-fit accounts
- Define Tier 2 threshold (e.g., ICP score 50-79) representing good-fit accounts
- Define Tier 3 threshold (e.g., ICP score below 50) representing nurture-only accounts
- Create qualitative descriptions for each tier (e.g., Tier 1 = "Looks exactly like our top 20% customers")
- Determine if any attributes are automatic qualifiers or disqualifiers regardless of score
- Validate tier definitions against 10-20 known accounts to test accuracy

#### Step 2: Scope TAM Geography and Segments

**Step Overview:** Define the geographic and segment boundaries for the market map to ensure enrichment efforts are focused and manageable. End state: Clear scope document with geographic limits and segment definitions.

- Confirm geographic scope with stakeholders (US-only, North America, global, specific regions)
- Define industry/vertical scope (all industries vs. specific verticals)
- Determine company size ranges to include (SMB, mid-market, enterprise, or specific ranges)
- Identify any explicit exclusions (competitors, existing customers, specific industries)
- Estimate total account volume based on scope to inform tool selection and budget
- Document scope decisions for future reference and maintenance

#### Step 3: Conduct Stakeholder Alignment Session

**Step Overview:** Present ICP rubric and tier definitions to key stakeholders for validation and buy-in before building the market map. End state: Approved ICP Fit Scoring Rubric and tier model signed off by leadership.

- Schedule 60-minute alignment session with VP Marketing, VP Sales, and RevOps lead
- Present closed-won analysis findings and proposed ICP attributes
- Walk through tier definitions with example accounts from each tier
- Address concerns and incorporate feedback into rubric
- Get explicit sign-off on rubric and tier definitions before proceeding
- Document any adjustments made during session and update rubric accordingly

---

### Part 3: Source and Build TAM Account List

#### Step 1: Extract Initial TAM from Data Providers

**Step Overview:** Build the foundational TAM account list using ZoomInfo, Apollo, LinkedIn Sales Navigator, or similar tools based on defined scope. End state: Raw TAM list with basic firmographic data ready for enrichment.

- Log into primary data provider (ZoomInfo, Apollo, or LinkedIn Sales Navigator)
- Apply firmographic filters based on scope (industry, employee count, revenue, geography)
- Export initial account list with basic firmographic fields (name, domain, industry, size, location)
- Note data provider's estimated match count vs. your target TAM size
- Document any filter limitations or data gaps observed during extraction
- Save raw export with timestamp for audit trail

#### Step 2: Deduplicate Against Existing CRM Records

**Step Overview:** Match extracted TAM accounts against existing CRM records to prevent duplicates and identify net-new accounts. End state: Clean TAM list with duplicate flags and match/no-match categorization.

- Export existing CRM accounts (active customers, prospects, leads)
- Run domain-based matching between TAM extract and CRM records
- Flag exact matches (already in CRM) for update vs. creation decisions
- Identify fuzzy matches (similar names, same domain variants) for manual review
- Document match rates and prepare decision log for merge vs. create scenarios
- Create net-new account list by removing confirmed duplicates

#### Step 3: Validate Data Quality with Sample Review

**Step Overview:** Manually review a sample of TAM accounts to validate data accuracy before full enrichment. End state: Confidence level established for data quality with documented issues.

- Select random sample of 50-100 accounts from TAM list
- Manually verify 10-15 accounts against LinkedIn/company websites
- Check accuracy of key fields: industry, employee count, location, domain
- Document error rate and types of errors found (wrong industry, outdated size, etc.)
- Flag systematic data quality issues for enrichment tool to address
- Decide if data quality is acceptable or if alternative source is needed

---

### Part 4: Enrich TAM with ICP Attributes

#### Step 1: Configure Clay Enrichment Workflows

**Step Overview:** Set up Clay tables and workflows to pull enrichment data from multiple sources for each TAM account. End state: Configured Clay table with connected data sources and enrichment columns.

- Create new Clay table and import TAM account list
- Connect data sources: ZoomInfo, Clearbit, Apollo, Crunchbase, BuiltWith (as available)
- Configure firmographic enrichment columns (employee count, revenue, industry, funding)
- Configure technographic enrichment columns (tech stack, tools used, infrastructure)
- Set up intent/behavioral columns (recent funding, hiring signals, job postings)
- Test enrichment on sample of 20-50 accounts before running full batch

#### Step 2: Run Enrichment and Apply ICP Scoring

**Step Overview:** Execute enrichment workflows across full TAM and calculate ICP fit scores based on approved rubric. End state: Fully enriched TAM with ICP scores and tier assignments.

- Run enrichment workflow across full TAM account list (batch or streaming)
- Monitor enrichment progress and address any API errors or rate limits
- Apply ICP scoring formula to calculate raw scores for each account
- Assign tier (1, 2, or 3) based on score thresholds defined in rubric
- Generate score distribution report to validate tier balance (expect ~20% Tier 1, ~30% Tier 2, ~50% Tier 3)
- Flag accounts with incomplete enrichment data for manual review or exclusion

#### Step 3: Quality Check Enriched Data and Tier Assignments

**Step Overview:** Validate enrichment accuracy and tier assignments against known accounts before CRM import. End state: Verified enriched dataset with corrected errors and confidence in tier accuracy.

- Review 20-30 accounts across each tier to validate tier assignment accuracy
- Cross-reference tier assignments against known customers (should score as Tier 1)
- Identify any scoring anomalies (high-fit accounts in Tier 3, poor-fit in Tier 1)
- Adjust scoring weights or thresholds if systematic misclassifications found
- Document final scoring formula and tier thresholds for CRM field descriptions
- Export final enriched, tiered dataset for CRM import

---

### Part 5: Import and Operationalize in CRM

#### Step 1: Create CRM Custom Fields for Market Map Data

**Step Overview:** Build custom fields in CRM to store ICP scores, tier assignments, and key enrichment attributes. End state: CRM schema ready to receive market map data with proper field types and picklist values.

- Create custom field: "ICP Score" (number, 0-100 scale)
- Create custom field: "ICP Tier" (picklist: Tier 1, Tier 2, Tier 3)
- Create custom fields for key enrichment attributes (tech stack, funding stage, employee count range)
- Set field-level security to allow appropriate teams to view/edit
- Add fields to account page layouts for visibility
- Document field definitions and data sources in CRM field descriptions

#### Step 2: Import Enriched TAM into CRM

**Step Overview:** Load the enriched and tiered account dataset into CRM with proper duplicate handling and field mapping. End state: All TAM accounts in CRM with ICP scores, tiers, and enrichment data populated.

- Prepare import file with CRM-ready column headers matching custom fields
- Set import rules for duplicate handling (update existing vs. skip)
- Run test import with 50-100 records to validate field mapping
- Execute full import in batches to avoid timeout issues
- Verify record counts match expected totals (imported + updated)
- Run spot-check on 20-30 records to confirm data imported correctly

#### Step 3: Build CRM Views and Reports for Tier-Based Targeting

**Step Overview:** Create CRM list views, reports, and dashboards that enable sales and marketing to filter and prioritize by tier. End state: Operational CRM views showing Tier 1 accounts by territory, industry, and engagement status.

- Create account list views filtered by tier (Tier 1, Tier 2, Tier 3)
- Build report: "Tier 1 Accounts by Territory" for sales leadership
- Build report: "Tier 1 Accounts by Industry" for marketing segmentation
- Create dashboard widget showing tier distribution across total TAM
- Add tier-based filters to existing pipeline and activity reports
- Train sales team on how to use tier filters in daily prospecting workflow

---

### Part 6: Enable Teams and Establish Governance

#### Step 1: Conduct Sales and Marketing Training Session

**Step Overview:** Train go-to-market teams on how to use the market map for targeting, prioritization, and campaign segmentation. End state: Teams trained and actively using tier-based targeting within 2 weeks.

- Schedule 30-45 minute training session for sales team
- Cover: what each tier means, how to filter by tier, why Tier 1 matters most
- Demonstrate CRM views and reports for tier-based prospecting
- Create 1-page quick reference guide for reps (tier definitions, how to filter)
- Record training for future new hire onboarding
- Schedule separate session with marketing for campaign segmentation use cases

#### Step 2: Build Automation for Ongoing Lead Scoring

**Step Overview:** Implement automation rules to score and tier new inbound leads against the ICP rubric as they enter the system. End state: All new leads automatically scored and tiered without manual intervention.

- Create workflow rule or automation to trigger on new lead creation
- Map inbound lead fields to ICP scoring attributes
- Apply scoring formula and assign tier based on thresholds
- Set up enrichment trigger for missing data points (via Clay or native enrichment)
- Test automation with 10-15 sample leads to verify scoring accuracy
- Document automation logic for RevOps maintenance

#### Step 3: Establish Data Governance and Refresh Cadence

**Step Overview:** Define ownership, refresh schedule, and governance processes to prevent data decay and maintain market map accuracy. End state: Documented governance playbook with assigned ownership and quarterly refresh schedule.

- Assign market map ownership to specific RevOps team member
- Define quarterly enrichment refresh process and schedule in team calendar
- Create runbook for refreshing TAM data (re-enrich, re-score, update tiers)
- Establish SLA for data decay management (e.g., 10% of accounts refreshed monthly)
- Set up alerts for tier changes or significant score shifts
- Schedule 90-day calibration session to validate tier conversion rates and adjust weights

#### Step 4: Hand Off Documentation and Schedule Calibration

**Step Overview:** Transfer all documentation to client team and schedule post-implementation calibration check-in. End state: Client self-sufficient with complete documentation and 90-day calibration on calendar.

- Compile documentation package: ICP rubric, tier definitions, scoring formula, CRM field guide
- Transfer admin access for enrichment tools (Clay, ZoomInfo) to client RevOps
- Deliver training recordings and quick reference guides
- Schedule 90-day calibration session to review tier conversion rates
- Document process for requesting tier re-scoring or rubric adjustments
- Close out project with stakeholder sign-off

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Admin access to CRM (Salesforce/HubSpot) with permission to create custom fields and import records
- Active subscriptions to enrichment tools (Clay, ZoomInfo, Apollo, or equivalent)
- Minimum 50 closed-won deals in CRM for pattern analysis (ideally 100+)
- Clear ARR or revenue data on existing customers for top-performer identification

**What client must provide:**
- CRM admin credentials or a designated RevOps contact with import permissions
- Access to historical deal data including close date, ACV, and customer attributes
- 2-3 hours of stakeholder time for ICP interviews and tier alignment sessions
- Decision on geographic scope (US-only, global, specific regions)
- Budget approval for enrichment tool usage/credits if not already in place

## 5. Common Pitfalls

- **Pitfall 1**: Defining ICP based on aspirational targets instead of closed-won data (wishful thinking ICP) - **Mitigation**: Always validate ICP criteria against actual top 20% customers before finalizing attributes; if aspiration diverges from reality, flag for leadership alignment

- **Pitfall 2**: Over-enriching with too many attributes, creating analysis paralysis and unmaintainable data - **Mitigation**: Limit to 8-12 core enrichment fields that directly influence tier scoring; additional "nice-to-have" attributes can be added post-validation

- **Pitfall 3**: Loading enriched data without deduplication, creating duplicate accounts and corrupting CRM integrity - **Mitigation**: Run matching logic against existing CRM records before import; establish clear rules for merge vs. create decisions

- **Pitfall 4**: Treating market map as a one-time project instead of a living system with data decay - **Mitigation**: Build in quarterly enrichment refresh process and assign clear ownership for ongoing maintenance from day one

- **Pitfall 5**: Relying solely on single data provider for TAM without validation - **Mitigation**: Cross-validate 10-15% of accounts manually against LinkedIn/company websites; industry filters from data providers can be wrong 50% of the time

## 6. Success Metrics

- **Leading Indicator**: Sales team actively filters by Tier 1 accounts in CRM within 2 weeks of launch; 80%+ of new outbound sequences target Tier 1/Tier 2 accounts only
- **Lagging Indicator**: Tier 1 accounts convert at 2x+ the rate of Tier 3 accounts within 90 days; MQL-to-Opportunity conversion rate improves by 15-25% post-implementation

---

