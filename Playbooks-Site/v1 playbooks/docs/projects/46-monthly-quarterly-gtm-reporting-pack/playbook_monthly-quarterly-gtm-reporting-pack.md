# Monthly/Quarterly GTM Reporting Pack - Playbook

## 1. Definition

**What it is**: A strategic project that creates a polished, repeatable reporting deck compiling all key GTM metrics—anchored by the Power 10 GTM Metrics—along with operational KPIs for each function. The deliverable is a presentation-ready pack used for MBRs, QBRs, executive leadership updates, investor reporting, and board presentations.

**What it is NOT**: Not a BI tool implementation (that's dashboard infrastructure). Not a data warehouse project (that's data engineering). Not a one-time report (this creates a repeatable template and process). Not a metrics definition project alone (though definitions are included).

## 2. ICP Value Proposition

**Pain it solves**: Leadership spends hours each month manually compiling reports from scattered sources, with inconsistent metrics, formatting, and definitions across teams. Reports aren't trusted as a single source of truth, requiring rework before every board or investor meeting. Teams operate in silos—marketing reports MQLs, sales reports closed-won, CS reports renewals—with no unified GTM view.

**Outcome delivered**: A standardized, board-ready reporting deck updated on a recurring cadence. All Power 10 GTM Metrics and operational KPIs are accurately tracked, clearly presented, and trusted by all stakeholders. The pack can be directly repurposed for board, investor, and executive updates without rework. Internal teams have a repeatable process for monthly/quarterly updates.

**Who owns it**: VP of Finance, VP of Operations, RevOps Leader, or Chief of Staff. Often requested by CEO or CFO for investor/board reporting needs.

## 3. Implementation Procedure

### Part 1: Reporting Requirements Discovery

#### Step 1: Identify Audiences and Use Cases

**Step Overview:** Map all stakeholders who will consume the reporting pack and document their specific needs. End state: Clear audience matrix with use cases, detail levels, and frequency requirements.

- Interview key stakeholders (CEO, CFO, VP Sales, VP Marketing, Board members if accessible)
- Document primary use cases: MBRs, QBRs, board meetings, investor updates, all-hands
- Identify detail level requirements per audience (executive summary vs. operational drill-down)
- Determine delivery frequency and format preferences (slides, PDF, live dashboard)
- Capture any existing reporting pain points or trust issues with current data

#### Step 2: Audit Current Reporting State

**Step Overview:** Assess existing reports, data sources, and metric definitions across teams. End state: Gap analysis showing what exists vs. what's needed, plus data source inventory.

- Collect all existing monthly/quarterly reports from each function (Sales, Marketing, CS, Finance)
- Document current metric definitions and identify inconsistencies across teams
- Inventory data sources: CRM, marketing automation, CS platform, finance systems
- Identify metrics that are manually calculated vs. automated
- Flag data quality issues, missing metrics, or definition conflicts between teams

#### Step 3: Define Metric Framework

**Step Overview:** Confirm the Power 10 GTM Metrics and operational KPIs to include with consistent definitions. End state: Approved metric list with standardized definitions, owners, and data sources.

- Map Power 10 GTM Metrics to client's specific context and naming conventions
- Define operational KPIs for each function (Sales, Marketing, CS, Finance)
- Establish calculation methodology and data source for each metric
- Assign metric owners responsible for data accuracy
- Get stakeholder sign-off on metric definitions to prevent future disputes

---

### Part 2: Data Consolidation and Validation

#### Step 1: Map Data Sources to Metrics

**Step Overview:** Connect each approved metric to its authoritative data source and document extraction requirements. End state: Data architecture map showing metric → source → extraction method.

- Create metric-to-source mapping document
- Identify primary vs. secondary data sources for each metric
- Document API access, export methods, or manual pull requirements
- Flag metrics requiring cross-system calculations (e.g., CAC needs marketing + sales data)
- Identify refresh frequency capabilities for each source

#### Step 2: Build Data Extraction Process

**Step Overview:** Establish repeatable process for pulling data from all sources on a scheduled basis. End state: Documented extraction workflow with automation where possible.

- Set up scheduled exports or API pulls from primary systems
- Create data staging area (spreadsheet or lightweight database)
- Build validation checks to catch data anomalies (nulls, duplicates, outliers)
- Document manual steps required and time estimates
- Test full extraction cycle and document any issues

#### Step 3: Validate Historical Data

**Step Overview:** Pull and verify 3-6 months of historical data to establish baselines and validate accuracy. End state: Verified historical dataset ready for trend analysis.

- Extract historical data for all approved metrics (minimum 3 months, ideally 6-12)
- Cross-reference against known benchmarks (previous board decks, finance actuals)
- Reconcile discrepancies between sources
- Document any data gaps or periods with unreliable data
- Get stakeholder validation that historical numbers are accurate

---

### Part 3: Deck Design and Construction

#### Step 1: Design Deck Structure and Layout

**Step Overview:** Create the logical flow and visual framework for the reporting pack. End state: Approved deck skeleton with section headers, slide types, and navigation.

- Define deck sections: Executive Summary, Power 10 Metrics, Function Deep-Dives, Appendix
- Design slide templates for different content types (scorecards, trends, commentary)
- Establish visual hierarchy: what metrics get prominence vs. supporting detail
- Create consistent color coding for performance indicators (green/yellow/red)
- Build navigation system for longer decks (table of contents, section dividers)

#### Step 2: Build Executive Summary Section

**Step Overview:** Create the high-impact opening section that tells the business story at a glance. End state: 3-5 slide executive summary with key takeaways and Power 10 metrics.

- Design one-page business health scorecard with Power 10 metrics
- Create trend visualization showing month-over-month or quarter-over-quarter changes
- Build "Top 3 Wins / Top 3 Concerns" commentary section
- Include forward-looking indicators (pipeline coverage, forecast vs. target)
- Ensure section can stand alone for time-constrained audiences

#### Step 3: Build Functional Deep-Dive Sections

**Step Overview:** Create detailed sections for each GTM function with operational KPIs. End state: Dedicated section per function with relevant metrics and insights.

- Build Sales section: pipeline metrics, conversion rates, rep productivity, forecast accuracy
- Build Marketing section: funnel metrics, channel performance, CAC components, attribution
- Build Customer Success section: retention, expansion, NPS/health scores, churn drivers
- Build Finance/ARR section: revenue actuals, cohort analysis, unit economics
- Ensure consistent formatting across all functional sections

#### Step 4: Create Appendix and Data Documentation

**Step Overview:** Build supporting materials for drill-down questions and methodology transparency. End state: Appendix with detailed data, definitions, and methodology notes.

- Create metric definition glossary with calculation formulas
- Build detailed data tables for those who want to see raw numbers
- Document data sources and refresh dates
- Include methodology notes for complex calculations (attribution, CAC, LTV)
- Add contact information for metric owners/questions

---

### Part 4: Enablement and Handoff

#### Step 1: Create Update Runbook

**Step Overview:** Document the step-by-step process for updating the reporting pack each period. End state: Written SOP that internal team can follow independently.

- Document data extraction steps with screenshots and timing
- Create update checklist covering each section of the deck
- Specify review and approval workflow before distribution
- Include troubleshooting guide for common data issues
- Establish timeline: when to start, when to complete, when to distribute

#### Step 2: Train Internal Team

**Step Overview:** Enable client team to own ongoing updates and maintenance. End state: Team trained and confident in updating the pack independently.

- Schedule training session (60-90 min) with designated report owners
- Walk through full update cycle using the runbook
- Cover common data issues and how to resolve them
- Practice making updates with team observing
- Record session for future reference and new team member onboarding

#### Step 3: Conduct First Live Cycle

**Step Overview:** Support the first independent update cycle to ensure smooth handoff. End state: Client successfully produces first update with minimal support.

- Shadow team during first data pull and update cycle
- Provide real-time support for questions or issues
- Review completed deck before distribution
- Collect feedback on runbook clarity and process gaps
- Refine documentation based on first cycle learnings

#### Step 4: Complete Project Handoff

**Step Overview:** Transfer all materials and establish ongoing support cadence. End state: Client fully owns the reporting pack with clear escalation path.

- Deliver final documentation package (runbook, templates, metric definitions)
- Transfer any automation scripts or data connections to client ownership
- Establish escalation path for future questions
- Schedule 30-day and 90-day check-ins
- Close out project and transition to maintenance support if applicable

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM system with reliable activity and pipeline data (Salesforce or HubSpot)
- Finance system or spreadsheet with ARR/revenue actuals
- Marketing automation platform with campaign/funnel data
- Access credentials for all relevant data systems
- Executive sponsor with authority to approve metric definitions

**What client must provide:**
- Access to all data systems (admin or read-only as appropriate)
- 2-3 hours of stakeholder time for discovery interviews
- Examples of any existing reports or board decks
- Clear decision-maker for metric definition disputes
- Internal owner who will maintain the pack post-handoff
- Brand guidelines or slide templates if specific formatting required

## 5. Common Pitfalls

- **Metric definition disagreements surface late**: Teams discover they calculate the same metric differently after the deck is built. → **Mitigation**: Lock metric definitions with stakeholder sign-off in Part 1 before any data work begins.

- **Data quality issues undermine trust**: Report shows numbers that don't match what teams expect, eroding confidence. → **Mitigation**: Validate historical data against known benchmarks (previous board decks, finance actuals) before building the deck.

- **Pack becomes too complex to maintain**: 50+ slide deck with excessive detail that takes 20 hours to update each month. → **Mitigation**: Design for the primary audience first (executives), push detail to appendix, and time-box the update process.

- **No clear owner post-handoff**: Report stops being updated because no one owns it. → **Mitigation**: Assign a named owner during discovery and train them directly—not just "the team."

## 6. Success Metrics

- **Leading Indicator**: Update cycle time under 4 hours for monthly refresh; stakeholders approve metric definitions without reopening debates.
- **Lagging Indicator**: Pack used in 3+ consecutive board/investor meetings without major rework; executive team cites pack as single source of truth for GTM performance.

---

