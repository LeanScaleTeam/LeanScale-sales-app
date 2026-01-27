# Sales Territory Design - Playbook

## 1. Definition

**What it is**: A strategic planning and implementation project that defines geographic, industry-based, or account-based boundaries for sales representatives to ensure optimal coverage, balanced workloads, and maximized revenue potential. The project delivers territory assignments configured in the CRM with clear rules of engagement and documented ownership.

**What it is NOT**: Not quota setting (that's Quotas and Target Setting project). Not account scoring or ICP definition (that's Market Map). Not Rules of Engagement documentation alone (though ROE is a dependency). Not sales compensation design.

## 2. ICP Value Proposition

**Pain it solves**: Sales leaders struggle with unbalanced territories where some reps have too many high-potential accounts while others are starved for opportunity. This causes uneven quota attainment, rep frustration, increased turnover, and lost revenue from under-served markets. Territory disputes and account ownership conflicts waste selling time and confuse prospects.

**Outcome delivered**: Balanced, data-driven territory assignments where each rep has fair opportunity to hit quota. Clear account ownership rules configured in the CRM. Visibility into territory coverage gaps and market potential. Sales teams aligned on who owns what with minimal conflict.

**Who owns it**: VP of Sales or Sales Operations Leader, with input from RevOps and Finance for quota alignment.

## 3. Implementation Procedure

### Part 1: Assess Current State & Define Segmentation Strategy

#### Step 1: Audit Current Territory Structure and Performance

**Step Overview:** Analyze existing territory assignments, coverage patterns, and performance data to identify imbalances and gaps. End state: Gap analysis document showing territory performance disparities and coverage issues.

- Pull territory performance reports from CRM for last 4 quarters (revenue, pipeline, win rate by territory)
- Identify quota attainment variance across territories (flag if >20% variance between top and bottom performers)
- Map current account distribution per rep (count of accounts, total ACV potential)
- Document existing territory assignment logic (geographic, industry, named accounts, or hybrid)
- Interview 2-3 sales managers on perceived territory imbalances and rep complaints
- Quantify coverage gaps (accounts with no owner, white space in target market)

#### Step 2: Define Segmentation Criteria and Territory Model

**Step Overview:** Determine the criteria for territory segmentation based on company strategy, market structure, and sales motion. End state: Documented segmentation framework approved by sales leadership.

- Review company growth objectives (new markets, verticals, customer segments)
- Evaluate territory model options: geographic, industry-based, named account, or hybrid
- For B2B SaaS: recommend hybrid model (enterprise by industry, SMB by geography)
- Define primary and secondary segmentation criteria (e.g., geography + company size)
- Document account assignment rules (what determines which rep owns an account)
- Get sign-off from VP Sales on segmentation approach before proceeding

---

### Part 2: Gather Market Data & Score Accounts

#### Step 1: Collect and Clean Account Data

**Step Overview:** Gather comprehensive data on target accounts, market potential, and competitive landscape to inform territory design. End state: Clean, deduplicated account list with key attributes populated.

- Export full account list from CRM with key fields (industry, size, location, owner, revenue)
- Identify and merge duplicate accounts to prevent double-counting
- Build account hierarchy (link subsidiaries to parent companies) to avoid territory disputes
- Enrich missing data using ZoomInfo, Apollo, or similar tools (employee count, revenue, industry)
- Flag accounts missing critical segmentation data for manual review
- Validate data quality with sales managers (spot-check 20-30 accounts)

#### Step 2: Score and Prioritize Accounts

**Step Overview:** Build a scoring model to prioritize accounts by revenue potential and fit. End state: All target accounts scored and ranked with clear tier assignments.

- Define scoring criteria: deal size potential, ICP fit, buying signals, competitive presence
- Build simple 1-5 scoring model (or leverage existing lead scoring if available)
- Apply scores to full account list programmatically
- Segment accounts into tiers (A/B/C or Enterprise/Mid-Market/SMB)
- Validate scoring output with sales leadership (top 50 accounts should feel right)
- Document scoring methodology for future territory reviews

---

### Part 3: Design Balanced Territories

#### Step 1: Calculate Territory Capacity and Workload

**Step Overview:** Determine how many accounts each rep can effectively manage based on sales motion and deal complexity. End state: Defined capacity targets per rep role (e.g., 50 accounts for enterprise AE, 200 for SMB).

- Analyze historical data: average accounts per rep, deals closed per quarter, time per deal
- Factor in sales cycle length and deal complexity by segment
- Define target account load per rep role (enterprise AE vs. SMB AE vs. SDR)
- Calculate total capacity needed vs. current headcount
- Identify if territory design requires headcount changes (flag for leadership)

#### Step 2: Create Balanced Territory Assignments

**Step Overview:** Design territories that provide equal opportunity for sales reps while maximizing market coverage. End state: Draft territory map with accounts assigned to reps and balanced workload distribution.

- Group accounts by segmentation criteria (geography, industry, tier)
- Use territory mapping tool (Salesforce Maps, Fullcast, Anaplan) or spreadsheet model
- Assign accounts to reps balancing: total ACV potential, account count, geographic proximity
- Target &lt;15% variance in territory potential between reps at same level
- Create visual territory map showing coverage and rep assignments
- Document rationale for assignment decisions (for stakeholder review)

#### Step 3: Define Rules of Engagement

**Step Overview:** Document clear ownership rules for edge cases and account transitions. End state: ROE document covering account ownership, lead routing, and conflict resolution.

- Define account ownership triggers (what moves an account to a new rep)
- Document lead routing rules for inbound in each territory
- Address national accounts with local presence (who owns what)
- Define handoff process when accounts change territories
- Create conflict resolution process (who decides disputed accounts)
- Get legal/compliance review if territories cross international boundaries

---

### Part 4: Validate, Implement & Roll Out

#### Step 1: Validate with Sales Leadership

**Step Overview:** Review proposed territories with sales leadership and incorporate feedback before implementation. End state: Final territory assignments approved by VP Sales and sales managers.

- Present territory proposal to sales leadership (VP Sales, regional managers)
- Share territory maps, account assignments, and balance metrics
- Collect feedback on specific account assignments and potential issues
- Adjust territories based on rep knowledge (account relationships, historical context)
- Document approved changes and final assignments
- Get formal sign-off before CRM implementation

#### Step 2: Implement Territory Assignments in CRM

**Step Overview:** Configure territory assignments in the CRM system with proper account ownership and visibility rules. End state: CRM updated with new territory assignments, owners, and reporting structure.

- Back up current territory/ownership data before making changes
- Update account owner fields in Salesforce/HubSpot for reassigned accounts
- Configure territory management features (Salesforce Territory Management 2.0 or equivalent)
- Set up territory-based sharing rules for visibility requirements
- Update lead assignment rules to route to correct territory owners
- Build territory performance reports and dashboards
- Test with 5-10 sample accounts to verify assignments and routing

#### Step 3: Communicate Changes and Train Sales Team

**Step Overview:** Roll out new territory assignments to the sales team with clear documentation and training. End state: Sales team understands new territories, account assignments, and rules of engagement.

- Prepare territory change communication (email, deck, or video)
- Explain rationale for changes (data-driven, growth-focused, balanced opportunity)
- Provide each rep with their account list and territory boundaries
- Walk through ROE document and conflict resolution process
- Host Q&A session to address concerns and questions
- Distribute quick-reference guide for territory rules

#### Step 4: Establish Monitoring and Review Cadence

**Step Overview:** Set up tracking to monitor territory performance and schedule regular reviews. End state: Reporting in place and quarterly review cadence established.

- Build territory performance dashboard (revenue, pipeline, quota attainment by territory)
- Define key metrics to track: revenue per territory, pipeline coverage (3-4x quota), win rates
- Schedule quarterly territory reviews with sales leadership
- Document trigger points for ad-hoc review (market shifts, rep attrition, M&A)
- Create process for territory adjustments between major reviews
- Hand off monitoring and adjustment process to sales ops owner

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Clean account data in CRM (company name, industry, size, location)
- Defined ICP and target market (from Market Map project)
- Current sales team headcount and role definitions
- Historical sales performance data (at least 2-4 quarters)
- Quota or target expectations (even rough ranges help with balancing)

**What client must provide:**
- Admin access to CRM (Salesforce or HubSpot)
- Access to territory management tool if used (Fullcast, Anaplan, Salesforce Maps)
- Sales leadership availability for validation meetings (2-3 hours total)
- Org chart showing sales team structure and reporting relationships
- Any existing territory documentation or tribal knowledge

## 5. Common Pitfalls

- **Relying on historical precedent only**: Designing territories based solely on where sales came from historically, not where growth opportunities exist. → **Mitigation**: Use forward-looking market potential data and ICP scoring, not just past performance.

- **Skipping account hierarchy and deduplication**: Failing to link subsidiaries to parent companies or merge duplicates causes double-counting, territory disputes, and inaccurate balance metrics. → **Mitigation**: Clean and link account data before territory design; use data enrichment tools.

- **Creating imbalanced territories**: Rushing to get territories carved without analytical rigor leads to some reps with 80% quota attainment potential while others have 120%. → **Mitigation**: Target &lt;15% variance in territory potential; use scoring and capacity models.

- **Poor change management with sales team**: Surprising reps with territory changes without explanation causes distrust and resistance. → **Mitigation**: Communicate early that changes are coming, explain the data-driven rationale, and involve managers in validation.

## 6. Success Metrics

- **Leading Indicator**: Territory balance metrics within target variance (&lt;15% difference in potential between reps at same level); sales team understands and accepts new assignments
- **Lagging Indicator**: Reduced variance in quota attainment across territories (from 40%+ spread to &lt;20%); 10-20% improvement in sales productivity within 2-3 quarters

---

