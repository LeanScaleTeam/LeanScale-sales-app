# Quote to Cash - Playbook

## 1. Definition

**What it is**: A comprehensive RevOps implementation project that deploys an integrated Quote-to-Cash (Q2C) solution connecting CRM, CPQ, CLM, billing, and ERP systems to automate the entire revenue lifecycle from quote generation through payment collection and revenue recognition. The deliverable is a fully operational Q2C workflow that eliminates manual handoffs, reduces revenue leakage, and ensures ASC 606/IFRS 15 compliance.

**What it is NOT**: Not a standalone CPQ implementation (CPQ is one component of Q2C). Not a billing system migration alone. Not a CRM implementation project. Not contract management only (CLM is one piece). Not financial reporting or dashboard creation (those are outputs, not the core project).

## 2. ICP Value Proposition

**Pain it solves**: Revenue leakage from disconnected systems where CPQ data doesn't match billing records, manual quote-to-invoice handoffs create errors, and finance teams spend hours reconciling sales forecasts with actual billed revenue. Companies lose 10%+ of ARR to payment delays, billing errors, and post-signature friction. Sales cycles stall when quotes require multiple approval loops and contract amendments break synchronization between systems.

**Outcome delivered**: Unified Q2C workflow where quotes flow automatically to contracts, contracts trigger accurate invoices, and payments reconcile to recognized revenue without manual intervention. Reduction in quote-to-cash cycle time by 40-60%, elimination of billing errors from manual re-entry, real-time visibility into deal status from quote through cash collection, and audit-ready revenue recognition.

**Who owns it**: VP of Finance or CFO (for compliance and billing), with strong partnership from VP Sales Operations (for CPQ and quoting) and RevOps Leader (for cross-functional integration).

## 3. Implementation Procedure

### Part 1: Discovery and Current State Assessment

#### Step 1: Map the Existing Q2C Process Flow

**Step Overview:** Document the complete current-state workflow from quote creation through cash collection, identifying all systems, handoff points, and manual processes. End state: Visual process map showing each stage, system touchpoints, and data flow gaps.

- Interview stakeholders from Sales, Finance, Legal, and Operations to understand their role in Q2C
- Document current tools used at each stage (CRM, spreadsheets, CPQ if any, contract tools, billing system, ERP)
- Map data flow between systems and identify manual re-entry points
- Identify the "dark zones" where data doesn't transfer automatically (e.g., quote to contract, contract to invoice)
- Calculate current quote-to-cash cycle time and benchmark against industry standards (84 days average for B2B SaaS)

#### Step 2: Quantify Revenue Leakage and Inefficiencies

**Step Overview:** Measure the financial impact of current Q2C gaps including billing errors, payment delays, and manual effort costs. End state: Business case document with quantified losses and improvement targets.

- Pull billing error rate data from finance (incorrect invoices, credit memos, disputes)
- Calculate involuntary churn from payment failures (industry average is 0.8% of MRR)
- Measure time spent on manual quote creation, approval chasing, and invoice generation
- Identify revenue recognition issues or audit findings from past periods
- Document compliance gaps (ASC 606/IFRS 15 manual workarounds)
- Quantify the gap (e.g., "15% of invoices require manual correction, costing 20 hours/week")

#### Step 3: Define Requirements and Success Metrics

**Step Overview:** Gather requirements from all stakeholder groups and establish measurable success criteria. End state: Requirements document with prioritized features and KPIs.

- Conduct requirements workshops with Sales (quoting needs), Finance (billing/rev rec needs), Legal (contract needs)
- Document must-have vs. nice-to-have capabilities
- Define approval workflow requirements (discount thresholds, deal desk involvement)
- Establish success metrics: cycle time reduction target, error rate target, automation percentage
- Get executive sign-off on requirements and success criteria

---

### Part 2: Platform Selection and Vendor Evaluation

#### Step 1: Build Evaluation Criteria and Shortlist

**Step Overview:** Create structured evaluation framework and identify candidate Q2C platforms based on requirements. End state: Shortlist of 3-4 vendors with evaluation scorecard criteria.

- Define evaluation criteria: CPQ capabilities, CLM features, billing automation, revenue recognition, integration depth
- Weight criteria based on client priorities (e.g., compliance vs. speed vs. cost)
- Research candidate platforms (DealHub, Subskribe, Maxio, Salesforce Revenue Cloud, Nue.io, Conga)
- Note: Salesforce legacy CPQ entering End of Sale March 2025; consider Revenue Cloud for SF shops
- Create shortlist of 3-4 vendors that match tech stack (CRM, ERP compatibility)

#### Step 2: Conduct Vendor Demos and POC

**Step Overview:** Run structured vendor demonstrations and proof-of-concept tests on core workflows. End state: Completed vendor scorecards with demo notes and POC results.

- Schedule vendor demos with standardized agenda covering all key use cases
- Prepare demo scenarios: standard quote, complex deal with discounts, contract amendment, invoice generation
- Evaluate ease of use for sales reps (adoption is critical)
- Test integration approach with existing CRM (Salesforce/HubSpot) and ERP (NetSuite/SAP)
- Score each vendor against evaluation criteria
- Conduct POC with top 1-2 vendors on actual client data if possible

#### Step 3: Finalize Selection and Procurement

**Step Overview:** Make final vendor recommendation, negotiate contracts, and complete procurement. End state: Signed vendor agreement with implementation timeline.

- Present recommendation to stakeholders with pros/cons analysis
- Negotiate licensing terms (per-user vs. transaction-based, annual vs. multi-year)
- Clarify implementation support included vs. additional cost
- Review data security and compliance certifications (SOC 2, GDPR)
- Finalize contract and initiate procurement process
- Establish implementation kickoff date

---

### Part 3: CPQ Configuration and Quote Workflow

#### Step 1: Configure Product Catalog and Pricing Rules

**Step Overview:** Set up the product catalog, pricing structures, and discount rules in the CPQ system. End state: Complete product catalog with pricing logic that mirrors current rate card and business rules.

- Import or build product catalog with all SKUs, bundles, and service offerings
- Configure pricing tiers (volume-based, customer segment-based)
- Set up discount approval thresholds (e.g., &lt;10% auto-approve, 10-20% manager, >20% deal desk)
- Build pricing rules for common scenarios (multi-year discounts, payment term adjustments)
- Ensure SKU naming conventions match billing system to prevent reconciliation issues
- Test pricing calculations against known good quotes

#### Step 2: Build Quote Templates and Document Generation

**Step Overview:** Create quote document templates and configure automated document generation. End state: Professional quote templates that auto-populate with deal data and generate PDFs.

- Design quote template with branding, terms summary, and pricing table
- Configure dynamic fields that pull from CRM opportunity and CPQ configuration
- Set up multiple templates for different scenarios (new business, renewal, expansion)
- Build approval stamp/signature block for internal approvals
- Test document generation with sample data
- Get Sales and Legal sign-off on template format

#### Step 3: Configure Approval Workflows

**Step Overview:** Build multi-stage approval workflows based on deal characteristics. End state: Automated approval routing that enforces discount policies and deal desk requirements.

- Map current approval matrix (who approves what based on discount, deal size, terms)
- Configure approval workflow stages in CPQ
- Set up notifications and escalation paths for stalled approvals
- Build deal desk queue for complex deals requiring manual review
- Configure mobile/email approval capabilities for managers
- Test approval routing with scenarios at each threshold level

---

### Part 4: Contract Lifecycle Management (CLM) Integration

#### Step 1: Configure Contract Templates and Clause Library

**Step Overview:** Set up contract templates and build a clause library for standard and negotiated terms. End state: Master service agreement and order form templates with modular clause options.

- Import or create MSA, Order Form, and Amendment templates
- Build clause library with pre-approved language options (payment terms, liability caps, SLAs)
- Configure fallback clauses for negotiation scenarios
- Set up contract metadata fields (effective date, term length, renewal terms, auto-renewal)
- Integrate Legal playbook guidance for when to escalate non-standard terms
- Test template generation from CPQ quote data

#### Step 2: Build Contract-to-Quote Data Flow

**Step Overview:** Establish bidirectional data sync between CPQ and CLM so quotes automatically generate contracts and contract changes update deal records. End state: Seamless quote-to-contract flow without manual data re-entry.

- Map CPQ fields to CLM contract fields (products, pricing, customer info)
- Configure automatic contract generation when quote reaches "approved" status
- Build sync for contract status back to CRM opportunity (sent, negotiating, signed)
- Set up version control for contract amendments during negotiation
- Configure signature routing through e-signature tool (DocuSign, PandaDoc, Ironclad)
- Test end-to-end flow: quote approval triggers contract, signature triggers deal close

#### Step 3: Configure Amendment and Renewal Workflows

**Step Overview:** Build workflows for mid-contract amendments and renewal scenarios. End state: Amendment and renewal processes that keep CPQ, CLM, and billing in sync.

- Configure amendment workflow for add-ons, upgrades, and downgrades
- Build proration logic for mid-term changes
- Set up renewal notification triggers (90/60/30 days before expiration)
- Configure auto-renewal handling vs. manual renewal process
- Establish version tracking so amendments reference original contract
- Test amendment scenario: customer adds seats mid-contract, verify proration calculates correctly

---

### Part 5: Billing System Integration and Invoicing

#### Step 1: Map Contract Data to Billing Records

**Step Overview:** Configure the integration between CLM/CPQ and billing system so signed contracts automatically create billing records. End state: Signed contracts trigger invoice schedules without manual billing setup.

- Map contract fields to billing system fields (customer, products, pricing, dates, payment terms)
- Configure billing record creation trigger (contract signed, start date, etc.)
- Set up invoice schedule generation (monthly, quarterly, annual, milestone-based)
- Handle proration logic for mid-period starts
- Build SKU mapping table to resolve any naming differences between CPQ and billing
- Test: signed contract generates correct invoice schedule automatically

#### Step 2: Configure Invoice Generation and Delivery

**Step Overview:** Set up automated invoice generation, formatting, and delivery to customers. End state: Invoices auto-generate and deliver on schedule with correct line items and amounts.

- Configure invoice template with branding and required fields (PO number, billing contact)
- Set up invoice generation schedule (day of month, X days before due date)
- Configure delivery methods (email, customer portal, EDI for enterprise customers)
- Build dunning sequence for overdue invoices (reminder at 7/14/30 days)
- Set up credit memo and refund workflows for billing corrections
- Test invoice generation and verify amounts match contract terms

#### Step 3: Connect Payment Collection and Cash Application

**Step Overview:** Integrate payment gateways and configure cash application to close the loop from invoice to collected revenue. End state: Payments auto-apply to invoices with minimal manual reconciliation.

- Integrate payment gateway(s) (Stripe, ACH, wire, credit card)
- Configure automatic payment for customers on recurring billing
- Set up payment matching rules for manual payments (check, wire)
- Build failed payment retry logic and dunning escalation
- Configure cash application to match payments to open invoices
- Monitor involuntary churn metrics and payment failure rates

---

### Part 6: Revenue Recognition and Compliance

#### Step 1: Configure Revenue Recognition Rules

**Step Overview:** Set up ASC 606/IFRS 15 compliant revenue recognition in the billing or ERP system. End state: Revenue schedules auto-generate based on contract terms and performance obligations.

- Document client's revenue recognition policy (point-in-time vs. over time, performance obligations)
- Configure rev rec rules in billing/ERP system for each product type
- Set up deferred revenue handling for prepaid contracts
- Build revenue schedule generation from contract terms (pro-rata, milestone, usage-based)
- Configure handling for multi-element arrangements (software + services bundles)
- Validate rev rec treatment with Finance/Accounting team

#### Step 2: Build Audit Trail and Compliance Reporting

**Step Overview:** Establish audit-ready documentation and compliance reporting for revenue transactions. End state: Complete audit trail from quote through recognized revenue with compliance reports.

- Configure audit logging for all quote, contract, invoice, and payment changes
- Build compliance reports for ASC 606 disclosure requirements
- Set up data retention policies for quotes, contracts, and invoices (7+ years typical)
- Document revenue recognition methodology for auditors
- Create reconciliation reports: bookings vs. billings vs. revenue
- Test audit trail by tracing sample deal from quote through rev rec

#### Step 3: Set Up Financial System Integration

**Step Overview:** Configure integration between billing system and general ledger/ERP for financial close. End state: Billing data flows to GL automatically with proper account mapping.

- Map billing line items to GL account codes (revenue, deferred revenue, AR)
- Configure journal entry generation frequency (daily, weekly, real-time)
- Build reconciliation reports between billing system and GL
- Set up month-end close automation for revenue reports
- Test month-end close process with Finance team
- Document close calendar and integration touchpoints

---

### Part 7: Testing and Quality Assurance

#### Step 1: Execute End-to-End Integration Testing

**Step Overview:** Test the complete Q2C flow from quote creation through revenue recognition with realistic scenarios. End state: Validated end-to-end workflow with documented test results.

- Create test plan covering all Q2C stages and integration points
- Execute test scenarios: new customer, expansion, renewal, amendment, cancellation
- Test edge cases: complex discounts, multi-currency, international tax, custom terms
- Verify data accuracy at each handoff point (CPQ to CLM, CLM to billing, billing to GL)
- Document integration failures and work with vendors to resolve
- Achieve sign-off on integration testing before UAT

#### Step 2: Conduct User Acceptance Testing (UAT)

**Step Overview:** Run UAT with actual users from Sales, Finance, and Operations to validate usability and accuracy. End state: UAT sign-off from all stakeholder groups.

- Recruit UAT participants from each user group (sales reps, managers, deal desk, finance)
- Create UAT scripts based on their daily workflows
- Facilitate UAT sessions with guided scenarios and open exploration
- Track issues and categorize (blocker, major, minor, enhancement)
- Work through blockers and major issues before go-live
- Obtain formal UAT sign-off from each stakeholder group

#### Step 3: Perform Data Migration and Validation

**Step Overview:** Migrate historical data (products, customers, contracts, pricing) and validate accuracy. End state: Clean, validated data in production systems ready for go-live.

- Define data migration scope (active contracts, pricing history, customer records)
- Extract and transform data from legacy systems
- Load data into Q2C platform(s) with validation checks
- Reconcile migrated data against source systems
- Clean up duplicates and data quality issues
- Get Finance approval on migrated financial data accuracy

---

### Part 8: Deployment, Training, and Enablement

#### Step 1: Develop Training Materials and Documentation

**Step Overview:** Create role-specific training materials, quick reference guides, and process documentation. End state: Complete training curriculum and documentation package.

- Build training deck covering Q2C process overview and system workflows
- Create role-specific guides: Sales (quoting), Deal Desk (approvals), Finance (billing/rev rec)
- Develop quick reference cards for common tasks (create quote, process amendment, generate invoice)
- Document troubleshooting procedures for common issues
- Record video walkthroughs for self-service learning
- Build FAQ based on UAT feedback and questions

#### Step 2: Conduct Training Sessions

**Step Overview:** Deliver training to all user groups with hands-on practice in the system. End state: All users trained and confident using the new Q2C workflow.

- Schedule training sessions by role (Sales team, Deal Desk, Finance, Operations)
- Deliver live training with hands-on exercises in sandbox environment
- Allow time for questions and real-world scenario practice
- Distribute training materials and documentation
- Set up office hours for follow-up questions during first 2 weeks
- Track training completion and follow up with no-shows

#### Step 3: Execute Phased Rollout

**Step Overview:** Launch Q2C system in phases to minimize disruption and allow for iterative improvements. End state: System live in production with all users active.

- Define rollout phases (by team, region, product line, or deal type)
- Launch Phase 1 with pilot group and monitor closely
- Maintain parallel processing with legacy systems during transition period
- Track adoption metrics (quotes created, approval times, invoice accuracy)
- Address issues discovered in each phase before expanding
- Execute cutover to full production once pilot phase validates stability

#### Step 4: Establish Ongoing Support and Optimization

**Step Overview:** Hand off to client team with support structure and continuous improvement plan. End state: Client self-sufficient with documented processes and optimization roadmap.

- Transfer admin credentials and documentation to client RevOps/IT team
- Define escalation path for issues (internal support vs. vendor support)
- Schedule 30/60/90 day check-ins to review performance metrics
- Create optimization backlog based on user feedback and performance data
- Document recommended enhancements for Phase 2 (advanced analytics, additional integrations)
- Close out project with executive stakeholder review

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM system in place (Salesforce or HubSpot) with opportunity management
- Finance/accounting system (QuickBooks, NetSuite, or ERP) for revenue recognition
- Defined pricing model and rate card
- Contract templates (MSA, Order Form) even if currently manual
- Executive sponsorship from both Sales and Finance leadership

**What client must provide:**
- Access to CRM with admin permissions for integration setup
- Access to ERP/accounting system for billing and rev rec configuration
- Current product catalog with SKUs, pricing, and discount policies
- Existing contract templates and clause library
- Current approval matrix (discount thresholds, deal desk criteria)
- Stakeholder availability for requirements, UAT, and training (minimum 2-4 hours/week)
- Budget approval for Q2C platform licensing
- IT resources for SSO, security review, and network configuration

## 5. Common Pitfalls

- **CPQ and billing SKU mismatch**: Product SKUs in CPQ don't match billing system records, causing invoice errors and revenue reconciliation failures. **Mitigation**: Build master SKU mapping table during configuration and enforce naming conventions; test with production data before go-live.

- **Amendment synchronization failures**: When customers upgrade mid-contract, CPQ and billing systems lose sync on pricing, prorations, and revenue schedules. **Mitigation**: Design and test amendment workflows extensively; build reconciliation reports that flag discrepancies between systems.

- **Underestimating integration complexity**: Q2C integrations typically take 6+ months and require heavy IT involvement; clients often expect faster timelines. **Mitigation**: Set realistic expectations during scoping; identify integration architect early; plan for iterative testing cycles.

- **Poor user adoption**: Sales reps resist new quoting tools if they're slower than spreadsheets or require more clicks. **Mitigation**: Involve sales reps in UAT; measure time-to-quote before and after; optimize high-friction workflows before rollout.

- **Revenue recognition gaps**: Finance discovers post-implementation that certain deal types (multi-element, usage-based) aren't handled correctly for ASC 606 compliance. **Mitigation**: Include Finance in requirements and UAT; test rev rec scenarios for all product types before go-live.

## 6. Success Metrics

- **Leading Indicators**:
  - Quote-to-contract cycle time reduction (target: 40%+ improvement from baseline)
  - Invoice accuracy rate (target: &lt;2% requiring correction)
  - User adoption rate (quotes created in new system vs. legacy/manual)
  - Approval cycle time (hours from quote submission to approval)

- **Lagging Indicators**:
  - Quote-to-cash cycle time (target: 30-50% reduction from baseline)
  - Revenue leakage rate (billing errors, payment failures as % of ARR)
  - Days Sales Outstanding (DSO) improvement
  - Clean audit opinion on revenue recognition
  - Finance team hours spent on manual reconciliation (target: 50%+ reduction)

---

