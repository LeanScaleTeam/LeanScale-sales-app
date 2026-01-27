# CPQ Implementation - Playbook

## 1. Definition

**What it is**: A Configure, Price, Quote (CPQ) implementation project that deploys and configures software to automate product configuration, pricing rules, discount approvals, and quote generation within the client's sales tech stack. The goal is to eliminate manual quoting processes, reduce pricing errors, and accelerate deal velocity from opportunity to signed contract.

**What it is NOT**: Not a CRM implementation (CRM should already exist and be actively used). Not a Contract Lifecycle Management (CLM) project (that's a separate milestone). Not a sales process redesign (process should be defined before CPQ automates it). Not an e-signature implementation (often paired but distinct). Not a billing or revenue recognition system (CPQ creates quotes, billing handles invoicing).

## 2. ICP Value Proposition

**Pain it solves**: Sales reps spend hours manually building quotes in spreadsheets or Word docs, leading to pricing errors, inconsistent discounting, slow approval cycles, and lost deals due to delayed proposals. Finance and RevOps lack visibility into quoted vs. booked pricing, creating revenue recognition headaches and billing reconciliation nightmares.

**Outcome delivered**: Automated quote generation with enforced pricing rules, streamlined approval workflows, CRM-synced deal data, and contract-ready documents. Quote creation time reduced from hours to under 15 minutes, approval cycles cut by up to 95%, and pricing error rates drop to near-zero.

**Who owns it**: VP Sales, CRO, or VP Revenue Operations (with input from Finance for pricing governance and IT/RevOps for system integration).

## 3. Implementation Procedure

### Part 1: Assess Current State & Define Requirements

#### Step 1: Audit Current Quoting Process

**Step Overview:** Document the existing quote-to-cash workflow from opportunity creation to signed contract. End state: Complete process map showing all current steps, handoffs, tools, and pain points.

- Interview 3-5 sales reps to understand their current quoting workflow and pain points
- Shadow 2-3 quote creation sessions to observe actual process vs. stated process
- Document time spent on each quoting step (configuration, pricing lookup, approval, document creation)
- Identify all current tools used (spreadsheets, Word docs, email for approvals)
- Map all handoff points between Sales, Finance, Legal, and RevOps
- Quantify current pain: average quote creation time, error rate, approval cycle length

#### Step 2: Audit Product Catalog and Pricing Structure

**Step Overview:** Review all products, SKUs, bundles, and pricing models to understand configuration complexity. End state: Complete inventory of products, pricing rules, and configuration logic that CPQ must support.

- Export current product catalog from CRM or spreadsheets
- Identify all SKUs, bundles, and product families
- Document pricing models: list price, volume discounts, term-based, usage-based, hybrid
- Map product configuration rules (what can be bundled, what's mutually exclusive)
- Identify any redundant or outdated SKUs that should be deprecated before CPQ
- Document any custom or one-off pricing exceptions that exist

#### Step 3: Map Discount Approval Workflow

**Step Overview:** Document current discount approval matrix including thresholds, approvers, and exception handling. End state: Complete approval workflow diagram ready for CPQ configuration.

- Interview Finance and Sales leadership on current approval thresholds
- Document discount levels and corresponding approvers (e.g., 10% = manager, 20% = VP, 30% = CFO)
- Identify exception handling processes for non-standard deals
- Map approval routing logic for different deal types or regions
- Document average approval cycle time and bottlenecks
- Validate approval matrix with Finance before proceeding

---

### Part 2: Select CPQ Tool & Plan Integration

#### Step 1: Evaluate CPQ Platform Options

**Step Overview:** Compare CPQ tool options against client's tech stack, requirements, and budget. End state: Tool selected with pros/cons documented and budget approved.

- Document client's existing tech stack (CRM, ERP, billing, e-signature)
- Evaluate CPQ options based on tech stack: Salesforce CPQ, DealHub, PandaDoc, Subskribe, Conga
- Compare on: CRM compatibility, SaaS pricing model support, implementation timeline, cost per user
- Assess no-code vs. custom development requirements for each option
- Present recommendation with 2-3 options to client stakeholders
- Get budget approval and initiate procurement/licensing

#### Step 2: Define Integration Architecture

**Step Overview:** Map all system integrations required between CPQ and existing tools. End state: Integration architecture document specifying all data flows, sync directions, and API requirements.

- Map CRM integration requirements (Salesforce/HubSpot opportunity sync, contact data)
- Document ERP integration needs for order processing (if applicable)
- Define e-signature integration flow (DocuSign, Adobe Sign)
- Identify billing system handoff requirements (Stripe, Chargebee, NetSuite)
- Document data sync direction for each integration (one-way vs. bidirectional)
- Specify API permissions and authentication requirements

#### Step 3: Create CPQ Requirements Document

**Step Overview:** Compile all discovery findings into a formal requirements document. End state: Signed-off requirements document that serves as the build blueprint.

- Consolidate product catalog audit, pricing rules, and approval workflows into one document
- Define MVP scope vs. future phase features
- Document integration requirements and data mapping
- Specify quote template requirements (branding, terms, dynamic fields)
- Get sign-off from Sales, Finance, and RevOps stakeholders
- Establish success metrics and KPIs for the implementation

---

### Part 3: Configure Product Catalog & Pricing

#### Step 1: Set Up CPQ Environment and CRM Connection

**Step Overview:** Create CPQ instance and establish connection to CRM with proper API permissions. End state: CPQ connected to CRM sandbox with admin access configured.

- Provision CPQ sandbox environment with admin accounts
- Connect to Salesforce/HubSpot CRM via OAuth
- Grant required API permissions (read/write opportunities, contacts, accounts, products)
- Configure SSO if required by client security policy
- Verify connection status and test basic data sync
- Document admin credentials for client handoff

#### Step 2: Build Product Catalog in CPQ

**Step Overview:** Configure all products, SKUs, bundles, and product rules in CPQ. End state: Complete product catalog configured with all offerings available for quoting.

- Import product catalog data (SKUs, names, descriptions, product families)
- Configure product bundles and package options
- Set up product rules (required components, optional add-ons, exclusions)
- Configure product dependencies and compatibility rules
- Set up guided selling questions to help reps select appropriate products
- Test product configuration with 5-10 sample quote scenarios

#### Step 3: Configure Pricing Rules and Discounting

**Step Overview:** Implement all pricing models, discount rules, and pricing tiers. End state: Pricing engine accurately calculates quotes for all product/pricing combinations.

- Configure list prices for all products
- Set up volume discount tiers and thresholds
- Implement term-based pricing (annual vs. multi-year discounts)
- Configure usage-based pricing models if applicable
- Set up regional or segment-specific pricing rules
- Test pricing calculations against 10+ known quote scenarios to validate accuracy

---

### Part 4: Build Approval Workflows & Quote Templates

#### Step 1: Configure Discount Approval Workflows

**Step Overview:** Build approval routing logic based on discount thresholds and deal criteria. End state: Automated approval workflows routing to correct approvers based on deal characteristics.

- Configure approval thresholds matching documented approval matrix
- Set up approver assignments by role and hierarchy
- Build routing logic for multi-level approvals
- Configure escalation rules for delayed approvals
- Set up email/Slack notifications for pending approvals
- Test approval flow with sample deals at each threshold level

#### Step 2: Create Quote Document Templates

**Step Overview:** Design and configure quote document templates with branding and dynamic fields. End state: Professional quote templates that auto-populate with deal data.

- Design quote layout matching client brand guidelines
- Configure dynamic field mapping (company name, products, pricing, terms)
- Add standard terms and conditions sections
- Set up signature blocks and approval stamps
- Create templates for different quote types (new business, renewal, expansion)
- Test template generation with sample data and review with stakeholders

#### Step 3: Configure CRM Data Sync

**Step Overview:** Set up bidirectional data sync between CPQ and CRM. End state: Quote data flows seamlessly to/from CRM opportunities with correct field mapping.

- Map CPQ fields to CRM opportunity fields
- Configure sync triggers (on quote creation, approval, signature)
- Set up quote status updates to reflect in CRM
- Configure won/lost quote handling
- Test data sync with sample quotes through full lifecycle
- Validate CRM reports reflect accurate quote data

---

### Part 5: Integration & System Testing

#### Step 1: Configure E-Signature Integration

**Step Overview:** Connect CPQ to e-signature platform for seamless quote delivery and signature capture. End state: Quotes can be sent for signature directly from CPQ with signed documents synced back.

- Connect to DocuSign/Adobe Sign via API or native integration
- Configure signature routing (customer signers, internal countersign)
- Set up automatic signed document storage
- Configure signature completion triggers (update quote status, notify team)
- Test end-to-end signature flow with sample documents

#### Step 2: Build ERP/Billing Handoff (if applicable)

**Step Overview:** Configure order creation and handoff to ERP or billing system. End state: Approved/signed quotes can trigger order creation in downstream systems.

- Map quote data to order/invoice fields in ERP/billing
- Configure order creation triggers (on signature, on manual submit)
- Set up order status sync back to CPQ/CRM
- Document any manual handoff steps required
- Test order creation flow with sample approved quotes

#### Step 3: Execute End-to-End System Testing

**Step Overview:** Validate complete quote-to-order flow across all integrated systems. End state: Documented test results showing all integrations working correctly.

- Create test scripts covering all major quote scenarios
- Test product configuration edge cases (complex bundles, custom SKUs)
- Validate pricing calculations across all discount scenarios
- Test approval workflow at all threshold levels
- Execute integration tests across CRM, e-sign, and billing
- Document any issues and remediate before UAT

---

### Part 6: User Acceptance Testing & Pilot

#### Step 1: Prepare UAT Environment and Test Cases

**Step Overview:** Set up UAT environment and create test cases using real deal scenarios. End state: UAT-ready environment with documented test cases for pilot users.

- Clone sandbox configuration to UAT environment
- Create test cases based on actual recent deals (5-10 scenarios)
- Prepare test data (sample accounts, contacts, opportunities)
- Create UAT feedback form for pilot users
- Schedule UAT sessions with 3-5 pilot sales reps
- Brief pilot users on testing objectives and process

#### Step 2: Execute User Acceptance Testing

**Step Overview:** Conduct UAT sessions with pilot group using real deal scenarios. End state: UAT complete with documented feedback and issue list.

- Facilitate hands-on UAT sessions (2-3 hours each)
- Observe users creating quotes through full workflow
- Capture usability issues and confusion points
- Document feature requests and improvement suggestions
- Prioritize issues by severity (blockers, major, minor)
- Share UAT summary with project stakeholders

#### Step 3: Remediate Issues and Refine Configuration

**Step Overview:** Address UAT feedback and refine system configuration before go-live. End state: All blocking issues resolved, major issues addressed, go-live readiness confirmed.

- Fix all blocking issues identified in UAT
- Address high-priority usability improvements
- Update quote templates based on feedback
- Refine guided selling logic if users struggled with product selection
- Re-test remediated items with pilot users
- Get stakeholder sign-off for production deployment

---

### Part 7: Production Deployment & Training

#### Step 1: Execute Production Deployment

**Step Overview:** Deploy CPQ configuration to production environment and validate all integrations. End state: Production CPQ system live and verified working.

- Migrate configuration from UAT to production
- Validate all integrations are functioning in production
- Verify product catalog, pricing, and approval workflows
- Confirm user access and permissions are correctly set
- Run smoke tests on critical flows (quote creation, approval, signature)
- Document any production-specific configuration differences

#### Step 2: Deliver Sales Team Training

**Step Overview:** Train all sales team members on CPQ usage with hands-on exercises. End state: Sales team trained and confident using CPQ for daily quoting.

- Schedule training sessions (60-90 minutes each)
- Cover quote creation workflow from opportunity to signature
- Demonstrate approval submission and tracking
- Walk through common scenarios (new business, renewal, expansion)
- Conduct hands-on exercises with practice quotes
- Record training session for future reference

#### Step 3: Create User Documentation Package

**Step Overview:** Develop documentation resources for ongoing user support. End state: Complete documentation package including quick-start guide, FAQ, and video walkthroughs.

- Create quick-start guide (2-3 pages) for daily CPQ use
- Document FAQs based on training questions
- Create video walkthroughs for key workflows
- Build troubleshooting guide for common issues
- Document admin procedures for product/pricing updates
- Share documentation in company wiki/knowledge base

---

### Part 8: Go-Live Support & Handoff

#### Step 1: Execute Go-Live and Hypercare Support

**Step Overview:** Go live with full sales team and provide intensive support during first two weeks. End state: Team actively using CPQ with issues addressed in real-time.

- Announce go-live with clear expectations and support channels
- Monitor CPQ usage and adoption metrics daily
- Provide real-time support via Slack/Teams channel
- Address issues and questions as they arise
- Track common questions to inform documentation updates
- Escalate any system issues for immediate resolution

#### Step 2: Monitor Adoption Metrics and Address Resistance

**Step Overview:** Track adoption metrics and intervene with users not adopting CPQ. End state: 80%+ of reps actively using CPQ within 30 days.

- Pull weekly adoption reports (quotes created per rep)
- Identify reps with low or no CPQ usage
- Conduct 1:1 check-ins with non-adopters to understand blockers
- Provide additional coaching or training as needed
- Celebrate early wins and power users to drive adoption
- Report adoption metrics to Sales leadership weekly

#### Step 3: Transfer Ownership and Schedule Check-Ins

**Step Overview:** Hand off CPQ administration to client team and establish ongoing support cadence. End state: Client self-sufficient with admin access, documentation, and scheduled check-ins.

- Transfer admin credentials and permissions to client RevOps
- Walk through admin procedures (adding products, updating pricing)
- Deliver complete documentation package
- Schedule 30-day post-launch review meeting
- Define escalation path for future issues
- Close out project with lessons learned debrief

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce or HubSpot) is implemented and actively used by sales team
- Product catalog and pricing structure is defined (even if in spreadsheets)
- Discount approval policy exists with documented thresholds
- Sales process is stable and documented (CPQ automates process, doesn't define it)
- Key stakeholders (Sales, Finance, RevOps) are identified and available for workshops
- Budget approved for CPQ licensing

**What client must provide:**
- Complete product catalog with SKUs, descriptions, and current pricing
- Discount approval matrix with thresholds and approvers
- Sample quotes and order forms from recent deals (5-10 examples)
- Admin access to CRM with full permissions
- List of all systems requiring integration (ERP, billing, e-signature)
- Availability for weekly check-ins and UAT participation
- Designated CPQ admin/champion for ongoing ownership

## 5. Common Pitfalls

- **Pitfall 1**: Buying CPQ before the organization is ready—process is undefined, product catalog is messy, or team is too small to benefit. → **Mitigation**: Complete process mapping and product catalog cleanup before CPQ selection; validate that current manual quoting pain justifies CPQ investment.

- **Pitfall 2**: Over-customizing the CPQ to match every edge case in the current process, leading to 16-24 month implementations. → **Mitigation**: Define MVP scope focused on 1-2 product lines or segments; simplify product catalog and pricing rules before automating; use out-of-the-box features where possible.

- **Pitfall 3**: Poor data quality in product catalog and pricing leads to inaccurate quotes post-launch, eroding trust in the system. → **Mitigation**: Conduct thorough data cleanup sprint before CPQ configuration; establish single source of truth for product and pricing data; validate pricing calculations against known quotes.

- **Pitfall 4**: Lack of Finance alignment causes billing and revenue recognition issues when quotes don't match downstream systems. → **Mitigation**: Include Finance in requirements gathering and UAT from day one; validate that CPQ pricing models mirror billing engine logic; test quote-to-invoice handoff before go-live.

- **Pitfall 5**: Insufficient training leads to low adoption and reps reverting to manual quoting (spreadsheets, Word docs). → **Mitigation**: Invest in hands-on training with real sales scenarios; appoint CPQ champion/admin for ongoing support; track adoption metrics weekly and intervene with non-adopters.

## 6. Success Metrics

- **Leading Indicator**: 80%+ of sales reps generating quotes through CPQ within 30 days of launch (adoption rate)
- **Leading Indicator**: Average quote creation time reduced from hours to under 15 minutes
- **Leading Indicator**: Approval cycle time reduced by 50%+ compared to pre-CPQ baseline
- **Lagging Indicator**: Quote-to-close cycle time reduced by 30%+ within 90 days
- **Lagging Indicator**: Pricing error rate drops to near-zero (measured by Finance during billing reconciliation)
- **Lagging Indicator**: SQL-to-Closed Won conversion rate improves due to faster proposal delivery

---

