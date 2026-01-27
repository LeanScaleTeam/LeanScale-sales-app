# ARR Reporting - Playbook

## 1. Definition

**What it is**: A foundational RevOps project that establishes ARR (Annual Recurring Revenue) as a single source of truth in the CRM by defining calculation rules, modeling data fields, integrating billing systems, and building executive dashboards. The deliverable is a working ARR reporting system with automated calculations, change tracking, and governance processes.

**What it is NOT**: Not a billing system implementation (Stripe, Chargebee setup). Not a full revenue recognition/ASC 606 compliance project. Not a financial close process redesign. Not a CPQ implementation (quote-to-cash is a separate project).

## 2. ICP Value Proposition

**Pain it solves**: Leadership can't trust the ARR number because it's calculated manually in spreadsheets, definitions differ between sales, finance, and success teams, and there's no visibility into ARR components (new, expansion, churn, contraction). Usage-based and hybrid pricing models make it even harder to capture what ARR actually means.

**Outcome delivered**: A single, automated ARR metric in the CRM that reflects live customer contracts, supports board-level reporting (net revenue retention, growth rate, forecasting), and enables cohort analysis by segment, product, region, and rep. All teams aligned on one ARR definition.

**Who owns it**: VP of Finance or RevOps Leader, with close collaboration between Finance, Sales Ops, and Customer Success.

## 3. Implementation Procedure

### Part 1: Define ARR Rules & Data Model

#### Step 1: Document ARR Definition & Business Rules

**Step Overview:** Align stakeholders on what counts as ARR and create a written policy document. End state: One-page ARR definition document approved by Finance and RevOps.

- Convene stakeholders (Finance, RevOps, Sales, CS) to align on ARR scope
- Define what revenue counts: recurring subscription fees, recurring add-ons, contracted usage minimums
- Define what revenue does NOT count: one-time onboarding, setup fees, professional services, perpetual licenses
- Decide unit of record: Account level, Contract/Subscription level, or both
- Document formula: Annualized Contract Value = (Monthly Recurring Amount x 12)
- Define handling for multi-year contracts (divide total value by term)
- Define handling for mid-term upgrades/downgrades and pro-ration rules
- Create written ARR policy document (1-page) and get Finance sign-off

#### Step 2: Design ARR Data Model in CRM

**Step Overview:** Determine which CRM objects will store ARR data and define the required custom fields. End state: Data model documented with field specifications ready for build.

- Decide system of record for ARR (Opportunity, Contract, or custom Subscription object)
- Specify required custom fields: ARR (currency), MRR (if useful), ARR Start Date, ARR End Date
- Define ARR component fields: New ARR, Expansion ARR, Churned ARR, Contraction ARR
- Design validation rules to enforce required field population
- Map relationships between objects (Account → Contract → ARR fields)
- Document field definitions, picklist values, and data types

---

### Part 2: Build CRM Fields & Integrate Data Sources

#### Step 1: Create ARR Fields and Objects in CRM

**Step Overview:** Build the custom fields and any required custom objects in the CRM. End state: All ARR fields created and visible on appropriate page layouts.

- Create ARR, MRR, and date fields on the designated object (Contract/Opportunity)
- Create ARR component fields (New, Expansion, Churn, Contraction)
- Build validation rules to enforce required field population
- Add fields to page layouts for relevant user roles
- Configure field-level security and sharing rules
- Test field creation with sample records

#### Step 2: Connect Billing/Subscription System

**Step Overview:** Establish integration between the billing system and CRM to sync subscription data. End state: Billing system connected with data flowing into CRM fields.

- Document current billing system (Stripe, Chargebee, Zuora, NetSuite, or other)
- Evaluate integration options: native connector, middleware (Zapier, Workato), or ETL pipeline
- Map billing system fields to CRM ARR fields
- Configure sync for cancellations, expansions, renewals, and new subscriptions
- Set sync frequency (near-real-time vs. batch)
- Test integration with sample transactions
- Document error handling and alerting for failed syncs

#### Step 3: Build ARR Calculation Automation

**Step Overview:** Automate ARR calculations using formula fields and/or workflow automation. End state: ARR recalculates automatically when contract data changes.

- Build formula fields to auto-calculate ARR from contract amount and term
- Create workflow/flow automation to recalculate on key events (renewal, upgrade, churn)
- Set up scheduled jobs for nightly ARR re-evaluation if needed
- Handle edge cases: multi-currency, partial months, discounts, usage-based components
- Test calculations with various contract scenarios (new, renewal, expansion, downgrade)
- Validate ARR totals against known source data

---

### Part 3: Enable Change Tracking & Reporting

#### Step 1: Set Up ARR History Tracking

**Step Overview:** Enable tracking of ARR changes over time for audit and trend reporting. End state: Full history of ARR changes available for reporting.

- Enable field history tracking on ARR fields (or create custom history object)
- Consider dedicated "Subscription History" object for full auditability
- Define what changes to capture: amount changes, status changes, date changes
- Build snapshot process for point-in-time ARR reporting (end-of-month snapshots)
- Test history capture with sample ARR changes

#### Step 2: Build ARR Reports and Dashboards

**Step Overview:** Create executive dashboards and operational reports for ARR visibility. End state: Live ARR dashboard accessible to leadership.

- Build Executive Dashboard: Total ARR, New ARR, Churned ARR, Net ARR Growth
- Create ARR Bridge report showing movement between periods
- Build cohort views: ARR by segment, product, region, rep
- Create forecasting reports projecting future ARR from pipeline
- Set up drill-down reports for ARR component analysis
- Configure dashboard refresh schedule and sharing permissions
- Test all reports with current data and validate accuracy

---

### Part 4: Governance, Training & Handoff

#### Step 1: Establish Governance Process

**Step Overview:** Define ongoing data hygiene and ownership for ARR accuracy. End state: Documented governance process with assigned owners.

- Assign Revenue Ops owner for edge case review (multi-currency, partial months, discounts)
- Define quarterly audit process: spot-check 10-20 contracts for consistent treatment
- Create data hygiene checklist for expired contracts and stale ARR values
- Document reconciliation process: ARR to recognized revenue bridge
- Set up alerting for data anomalies (unusual ARR spikes/drops)

#### Step 2: Conduct Training & Documentation

**Step Overview:** Train all stakeholder teams on ARR definitions and system usage. End state: Teams trained with documentation delivered.

- Create ARR definition quick-reference guide for Sales, Finance, and CS
- Schedule training sessions for each team (30-45 min each)
- Cover: what counts as ARR, how to update records, where to find reports
- Address questions on edge cases and escalation path
- Record training sessions for future onboarding
- Deliver documentation package to client

#### Step 3: Hand Off to Client

**Step Overview:** Transfer ownership and close out the project. End state: Client self-sufficient with admin access and ongoing support plan.

- Transfer admin credentials and integration access to client RevOps
- Deliver final documentation package (config settings, troubleshooting guide, ARR policy)
- Walk through dashboard and reporting with executive stakeholders
- Schedule 30-day check-in for questions and optimization
- Close out project and transition to support mode

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Active CRM (Salesforce or HubSpot) with admin access
- Billing/subscription system in use with accessible API or export
- Existing customer contracts or subscription data
- Finance stakeholder available for ARR definition alignment

**What client must provide:**
- Admin access to CRM and billing system
- Current ARR calculation methodology (if any exists)
- Sample contracts for testing calculations
- Executive sponsor for sign-off on ARR definition
- List of edge cases (multi-currency, usage-based, discounts)

## 5. Common Pitfalls

- **Inconsistent ARR definitions across teams**: Sales, Finance, and CS use different ARR calculations leading to conflicting reports. → **Mitigation**: Document ARR definition in a one-page policy and get sign-off from all stakeholders before building.

- **Using contract close date instead of start date**: Counting ARR at booking instead of when service goes live inflates reported ARR. → **Mitigation**: Define whether tracking CARR (contracted) vs LARR (live) and configure automation to use correct date field.

- **Manual data entry errors**: Fat-fingering subscription start/end dates or amounts breaks ARR calculations. → **Mitigation**: Build validation rules, use picklists where possible, and implement quarterly spot-check audits.

- **Billing system sync failures going unnoticed**: Cancellations or expansions don't sync to CRM, causing ARR drift from reality. → **Mitigation**: Set up error alerting for failed syncs and reconcile CRM ARR to billing system monthly.

## 6. Success Metrics

- **Leading Indicator**: ARR dashboard shows data within 24 hours of last billing system update; all stakeholders agree on the ARR number in first executive review.
- **Lagging Indicator**: Monthly ARR reconciliation between CRM and billing system shows &lt;2% variance; Finance uses CRM ARR for board reporting without manual adjustments.

---

