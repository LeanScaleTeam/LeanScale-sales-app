# Revenue Recognition - Playbook

## 1. Definition

**What it is**: A systems and process implementation project that establishes accurate tracking and reporting of revenue from quote-to-cash, including standardized metric definitions (ARR, ACV, TCV, Net New ARR, Contract ARR), CRM field configuration with automated calculations, and cross-departmental alignment between Sales, Finance, and RevOps to ensure ASC 606-compliant revenue recognition.

**What it is NOT**: Not a CPQ implementation (that's a separate project focused on quoting workflows). Not an accounting software migration or ERP implementation. Not a financial audit or compliance review. Not a bookings policy redesign (this project implements existing policy in systems). Not a billing system implementation.

## 2. ICP Value Proposition

**Pain it solves**: Finance and RevOps teams are calculating ARR, ACV, and TCV inconsistently across spreadsheets and CRM reports, leading to mismatched investor reporting, inaccurate forecasting, and audit risk. Sales is booking deals without clear visibility into how revenue will be recognized over time. Multiple definitions of the same metric exist across departments, causing confusion during board meetings and investor updates.

**Outcome delivered**: A single source of truth for revenue metrics in the CRM with standardized field definitions, automated formula calculations, validation rules preventing incomplete data, and clear process documentation that Finance, Sales, and RevOps can all trust for reporting, forecasting, and decision-making. Finance can close monthly books using CRM revenue reports as primary source.

**Who owns it**: VP of Finance or Controller (with heavy collaboration from RevOps and Sales leadership)

## 3. Implementation Procedure

### Part 1: Assess Current State & Define Requirements

#### Step 1: Audit Current Revenue Tracking Practices

**Step Overview:** Document how revenue metrics are currently being tracked across CRM, spreadsheets, and accounting systems to establish baseline and identify gaps. End state: Current state assessment showing what exists, what's missing, and where inconsistencies occur.

- Interview Finance Controller and VP of Finance to document current revenue recognition policies and pain points
- Pull existing CRM opportunity field list and identify which revenue metrics exist vs. are missing (ARR, ACV, TCV, Net New ARR, Contract ARR, Net ARR)
- Review sample of 10-15 closed-won deals to identify inconsistencies in how revenue is being recorded
- Document all spreadsheets and manual calculations currently used for revenue reporting
- Map current quote-to-cash process flow from opportunity creation through invoice generation

#### Step 2: Map System Integration Points

**Step Overview:** Document all systems involved in the revenue lifecycle and how data flows between them. End state: Clear integration map showing CRM, billing, and accounting system connections and data dependencies.

- Identify all systems in quote-to-cash process (CRM, CPQ, billing, accounting/ERP)
- Document integration points between CRM and billing system (e.g., Salesforce to Stripe/Chargebee)
- Map data flow from CRM to accounting software (e.g., Salesforce to QuickBooks/NetSuite/Xero)
- Identify which system is current source of truth for each revenue metric
- Document any API connections, sync schedules, and data transformation logic

#### Step 3: Define Revenue Metric Specifications

**Step Overview:** Align Finance and Sales on exact definitions and calculation logic for each revenue metric before building. End state: Written metric definitions document signed off by VP Finance, Controller, and VP Sales.

- Define ARR calculation logic (include/exclude one-time fees, how to handle multi-year deals)
- Define ACV calculation (annual contract value including any one-time components)
- Define TCV calculation (total contract value across full term)
- Define Net New ARR (new logo ARR + expansion ARR - contraction ARR - churn ARR)
- Define Contract ARR (ARR at time of contract signature vs. start date)
- Document handling rules for edge cases: usage-based pricing, ramped deals, mid-term upgrades/downgrades
- Get explicit written sign-off from Finance and Sales leadership on all definitions

---

### Part 2: Configure CRM Revenue Fields & Calculations

#### Step 1: Build Core Revenue Metric Fields

**Step Overview:** Create the primary revenue tracking fields in the CRM with formula calculations that auto-compute based on opportunity data. End state: Six core revenue fields created and calculating correctly on opportunity records.

- Create ARR field with formula based on subscription amount and contract term
- Create ACV field with formula including subscription + one-time fees (per definition)
- Create TCV field with formula calculating total value across contract term
- Create Net New ARR field (may require rollup or flow logic for expansion/contraction tracking)
- Create Contract ARR field capturing ARR at booking moment
- Create Monthly Recognized Revenue field for deferred revenue tracking
- Test all formula calculations against 5 sample opportunities with known correct values

#### Step 2: Build Supporting Fields for Revenue Tracking

**Step Overview:** Create the secondary fields needed to support revenue calculations and handle various deal structures. End state: Complete field set supporting all revenue scenarios the client encounters.

- Create Contract Start Date and Contract End Date fields (if not existing)
- Create Contract Term (Months) field with formula calculating term length
- Create Revenue Type picklist (New, Expansion, Renewal, Contraction, Churn)
- Create One-Time Fees field to separate from recurring revenue
- Create Usage/Variable Revenue field for variable pricing components
- Create Billing Frequency field (Monthly, Quarterly, Annual, Upfront)
- Document field dependencies and calculation order

#### Step 3: Configure Validation Rules & Data Quality Controls

**Step Overview:** Implement validation rules that prevent deals from closing without complete revenue data. End state: Validation rules active ensuring data integrity at deal close.

- Create validation rule requiring Contract Start Date before marking Closed Won
- Create validation rule requiring Contract Term (Months) with minimum/maximum bounds
- Create validation rule requiring Revenue Type selection at Closed Won
- Add error messages explaining what's missing and how to fix it
- Configure validation rule exceptions for edge case handling (documented)
- Test validation rules by attempting to close opportunities with missing data

---

### Part 3: Build Revenue Recognition Schedules & Reporting

#### Step 1: Create Revenue Schedule Templates

**Step Overview:** Set up deferred revenue tracking that automatically calculates monthly recognition based on contract terms. End state: Revenue schedule objects/logic that break contract value into monthly recognition amounts.

- Design revenue schedule object structure (parent-child with opportunity or custom object)
- Build logic to generate monthly revenue schedule records from opportunity data
- Configure recognition start date logic (contract start vs. first invoice vs. service delivery)
- Handle pro-rated first/last month calculations
- Set up revenue schedule status tracking (Scheduled, Recognized, Adjusted)
- Create sample revenue schedules for 3-5 deal types (monthly, annual, multi-year)

#### Step 2: Build Revenue Dashboards & Reports

**Step Overview:** Create CRM reports and dashboards showing key revenue metrics for Finance and leadership. End state: Executive dashboard with ARR by segment, Net New ARR trending, and revenue waterfall views.

- Build ARR by segment/product report (filterable by time period, owner, region)
- Create Net New ARR by quarter report showing new, expansion, contraction, churn components
- Build Contract ARR waterfall report showing opening → changes → closing ARR
- Create revenue forecast vs. recognized revenue comparison report
- Build Finance reconciliation report matching CRM to billing/accounting records
- Configure dashboard with key metrics: Total ARR, Net New ARR (QTD/YTD), ARR Growth Rate
- Set up scheduled report delivery to Finance and RevOps stakeholders

#### Step 3: Test Revenue Calculations Against Edge Cases

**Step Overview:** Validate all revenue field calculations and schedules work correctly across different deal scenarios. End state: Documented test results confirming calculations handle all standard and edge case scenarios.

- Test standard new business deal (12-month subscription, annual billing)
- Test multi-year deal (36-month contract with annual escalator)
- Test expansion mid-contract (upgrade adding ARR to existing deal)
- Test contraction/downgrade scenario
- Test early renewal scenario (renewal before current term ends)
- Test usage-based component mixed with subscription
- Document any calculation issues and fix formulas as needed
- Get Finance sign-off that calculations match their expected values

---

### Part 4: Enable Adoption & Train Teams

#### Step 1: Conduct Sales Team Training

**Step Overview:** Train sales team on new opportunity fields, revenue data requirements, and why accurate entry matters. End state: Sales team trained and comfortable entering required revenue data on deals.

- Schedule 45-minute training session with full sales team
- Cover: what each revenue field means, why Finance needs accurate data, validation rule expectations
- Walk through deal entry process with new required fields
- Demonstrate what happens when trying to close deal with missing data
- Create quick-reference guide for reps (1-page PDF with field definitions)
- Record training session for future onboarding
- Send follow-up email with recording link and reference doc

#### Step 2: Train Finance Team on CRM Revenue Reporting

**Step Overview:** Enable Finance to pull revenue reports from CRM and reconcile with accounting system. End state: Finance team self-sufficient in accessing CRM revenue data and running reconciliation.

- Schedule 45-minute training session with Finance/Accounting team
- Cover: how to access revenue dashboards, how to run standard reports, export options
- Walk through monthly reconciliation process: CRM ARR vs. billing system vs. GL
- Demonstrate revenue schedule views and deferred revenue tracking
- Show how to identify and flag data discrepancies for RevOps to fix
- Create Finance user guide with report locations and reconciliation steps
- Record training and share with Finance team

#### Step 3: Create Revenue Recognition Documentation Package

**Step Overview:** Document all field definitions, calculation logic, and processes for ongoing reference and compliance. End state: Complete documentation package enabling client self-sufficiency.

- Create Revenue Recognition Policy document with all metric definitions and formulas
- Document field descriptions and calculation logic for admin reference
- Write step-by-step reconciliation runbook for monthly Finance process
- Create troubleshooting guide for common data issues
- Document edge case handling procedures for non-standard deals
- Compile all docs into single folder/location for client access

---

### Part 5: Validate & Handoff

#### Step 1: Run Parallel Reconciliation Period

**Step Overview:** Run CRM revenue reports alongside existing process for 1-2 weeks to validate accuracy before cutting over. End state: Confirmed that CRM revenue metrics match Finance expectations within acceptable tolerance.

- Run first monthly close using both old process and new CRM reports
- Compare ARR totals between CRM and existing spreadsheet/system
- Identify and resolve any discrepancies (data entry errors vs. calculation issues)
- Document variance explanations for Finance leadership
- Make any final formula adjustments based on reconciliation findings
- Get Finance sign-off that CRM can become primary revenue source

#### Step 2: Establish Ongoing Data Quality Process

**Step Overview:** Set up recurring checks and responsibilities to maintain revenue data integrity over time. End state: Monthly data quality process documented and assigned to specific owner.

- Create monthly revenue data quality checklist for RevOps
- Set up automated report flagging opportunities with missing/suspicious revenue data
- Define escalation path for deals that fail validation but need exception handling
- Assign data quality owner (typically RevOps) with clear responsibilities
- Schedule recurring monthly data quality review meeting (15-30 min)

#### Step 3: Project Handoff & Close

**Step Overview:** Transfer all documentation, access, and ownership to client team and close out engagement. End state: Client fully self-sufficient with all credentials, documentation, and support contacts.

- Transfer admin credentials and access to client RevOps lead
- Deliver complete documentation package (policy doc, field guide, runbooks)
- Conduct final walkthrough of system with primary client stakeholders
- Schedule 30-day check-in call to address questions and edge cases
- Document any known limitations or future enhancement recommendations
- Close out project and confirm client satisfaction

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Active CRM (Salesforce or HubSpot) with opportunity object and closed-won deal history
- Documented revenue recognition policy from Finance (or willingness to define one)
- Admin access to CRM for field creation, formula configuration, and validation rules
- Access to billing/accounting system for integration mapping and reconciliation
- At least 6 months of historical closed-won deals for testing and validation

**What client must provide:**
- Finance stakeholder availability for metric definition sign-off (2-3 hours total across project)
- Sample contracts showing different deal structures (multi-year, usage-based, one-time fees, ramped pricing)
- Current revenue reporting templates/spreadsheets being used for board/investor reporting
- List of all systems involved in quote-to-cash process with admin contacts
- Decision maker availability for training sessions (VP Sales, Controller)

## 5. Common Pitfalls

- **Pitfall 1**: Finance and Sales define ARR differently (e.g., including vs. excluding one-time fees, recognition timing) leading to persistent reporting mismatches. → **Mitigation**: Force alignment in Part 1 by documenting written definitions with specific examples and getting explicit sign-off from both VP Sales and Controller before building any fields.

- **Pitfall 2**: Deferred revenue is not properly tracked, causing revenue to be recognized at booking instead of over contract term (ASC 606 violation risk). → **Mitigation**: Build revenue schedule object/fields that automatically calculate monthly recognition based on contract start date and term length. Include in Finance training.

- **Pitfall 3**: Edge cases (contract amendments, early renewals, downgrades, usage-based components) break the formula logic after launch. → **Mitigation**: Test all revenue field calculations against 5+ edge case scenarios before go-live, document handling procedures for non-standard deals, and build exception handling process.

- **Pitfall 4**: Sales team bypasses new fields because they add friction to deal entry, leading to incomplete data. → **Mitigation**: Make critical revenue fields required at Closed Won stage with clear error messages, include field completion rationale in Sales training, and get VP Sales to reinforce expectations.

- **Pitfall 5**: Variable consideration and contract modifications handled inconsistently, creating audit risk. → **Mitigation**: Document explicit rules for how to handle contract mods (new opportunity vs. amendment to existing), and create validation logic to flag deals needing Finance review.

## 6. Success Metrics

- **Leading Indicator**: 100% of closed-won opportunities have all 6 revenue metric fields populated within 30 days of launch
- **Lagging Indicator**: Finance can close monthly books using CRM revenue reports as primary source (eliminating manual spreadsheet reconciliation) within 60 days

---

