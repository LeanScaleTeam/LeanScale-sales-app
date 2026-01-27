# CPQ Implementation - Project Details / Task List

**Tag:** `cpq`
**Total Hours:** 175h
**Structure:** Multi-Milestone (>50h)

---

## Milestone 1: CPQ Implementation - 1. Requirements & Configuration
**Tag:** `cpq`
**Description:** Discovery, requirements definition, and core CPQ configuration including product catalog and pricing
**Hours:** 48h

---

### Task List: (CPQ) 1. Requirements & Planning
**Contains:** Parts 1-2

| Task | Est | Description |
|------|-----|-------------|
| 1. Audit Current Quoting Process | 3h | Document the existing quote-to-cash workflow from opportunity creation to signed contract. End state: Complete process map showing all current steps, handoffs, tools, and pain points.<br /><br />• Interview 3-5 sales reps to understand their current quoting workflow and pain points<br />• Shadow 2-3 quote creation sessions to observe actual process vs. stated process<br />• Document time spent on each quoting step (configuration, pricing lookup, approval, document creation)<br />• Identify all current tools used (spreadsheets, Word docs, email for approvals)<br />• Map all handoff points between Sales, Finance, Legal, and RevOps<br />• Quantify current pain: average quote creation time, error rate, approval cycle length |
| 2. Audit Product Catalog and Pricing Structure | 2.5h | Review all products, SKUs, bundles, and pricing models to understand configuration complexity. End state: Complete inventory of products, pricing rules, and configuration logic that CPQ must support.<br /><br />• Export current product catalog from CRM or spreadsheets<br />• Identify all SKUs, bundles, and product families<br />• Document pricing models: list price, volume discounts, term-based, usage-based, hybrid<br />• Map product configuration rules (what can be bundled, what's mutually exclusive)<br />• Identify any redundant or outdated SKUs that should be deprecated before CPQ<br />• Document any custom or one-off pricing exceptions that exist |
| 3. Map Discount Approval Workflow | 2h | Document current discount approval matrix including thresholds, approvers, and exception handling. End state: Complete approval workflow diagram ready for CPQ configuration.<br /><br />• Interview Finance and Sales leadership on current approval thresholds<br />• Document discount levels and corresponding approvers (e.g., 10% = manager, 20% = VP, 30% = CFO)<br />• Identify exception handling processes for non-standard deals<br />• Map approval routing logic for different deal types or regions<br />• Document average approval cycle time and bottlenecks<br />• Validate approval matrix with Finance before proceeding |
| 4. Evaluate CPQ Platform Options | 3h | Compare CPQ tool options against client's tech stack, requirements, and budget. End state: Tool selected with pros/cons documented and budget approved.<br /><br />• Document client's existing tech stack (CRM, ERP, billing, e-signature)<br />• Evaluate CPQ options based on tech stack: Salesforce CPQ, DealHub, PandaDoc, Subskribe, Conga<br />• Compare on: CRM compatibility, SaaS pricing model support, implementation timeline, cost per user<br />• Assess no-code vs. custom development requirements for each option<br />• Present recommendation with 2-3 options to client stakeholders<br />• Get budget approval and initiate procurement/licensing |
| 5. Define Integration Architecture | 2.5h | Map all system integrations required between CPQ and existing tools. End state: Integration architecture document specifying all data flows, sync directions, and API requirements.<br /><br />• Map CRM integration requirements (Salesforce/HubSpot opportunity sync, contact data)<br />• Document ERP integration needs for order processing (if applicable)<br />• Define e-signature integration flow (DocuSign, Adobe Sign)<br />• Identify billing system handoff requirements (Stripe, Chargebee, NetSuite)<br />• Document data sync direction for each integration (one-way vs. bidirectional)<br />• Specify API permissions and authentication requirements |
| 6. Create CPQ Requirements Document | 2h | Compile all discovery findings into a formal requirements document. End state: Signed-off requirements document that serves as the build blueprint.<br /><br />• Consolidate product catalog audit, pricing rules, and approval workflows into one document<br />• Define MVP scope vs. future phase features<br />• Document integration requirements and data mapping<br />• Specify quote template requirements (branding, terms, dynamic fields)<br />• Get sign-off from Sales, Finance, and RevOps stakeholders<br />• Establish success metrics and KPIs for the implementation |

---

### Task List: (CPQ) 2. Product Catalog & Pricing Configuration
**Contains:** Parts 3-4

| Task | Est | Description |
|------|-----|-------------|
| 7. Set Up CPQ Environment and CRM Connection | 3h | Create CPQ instance and establish connection to CRM with proper API permissions. End state: CPQ connected to CRM sandbox with admin access configured.<br /><br />• Provision CPQ sandbox environment with admin accounts<br />• Connect to Salesforce/HubSpot CRM via OAuth<br />• Grant required API permissions (read/write opportunities, contacts, accounts, products)<br />• Configure SSO if required by client security policy<br />• Verify connection status and test basic data sync<br />• Document admin credentials for client handoff |
| 8. Build Product Catalog in CPQ | 4h | Configure all products, SKUs, bundles, and product rules in CPQ. End state: Complete product catalog configured with all offerings available for quoting.<br /><br />• Import product catalog data (SKUs, names, descriptions, product families)<br />• Configure product bundles and package options<br />• Set up product rules (required components, optional add-ons, exclusions)<br />• Configure product dependencies and compatibility rules<br />• Set up guided selling questions to help reps select appropriate products<br />• Test product configuration with 5-10 sample quote scenarios |
| 9. Configure Pricing Rules and Discounting | 4h | Implement all pricing models, discount rules, and pricing tiers. End state: Pricing engine accurately calculates quotes for all product/pricing combinations.<br /><br />• Configure list prices for all products<br />• Set up volume discount tiers and thresholds<br />• Implement term-based pricing (annual vs. multi-year discounts)<br />• Configure usage-based pricing models if applicable<br />• Set up regional or segment-specific pricing rules<br />• Test pricing calculations against 10+ known quote scenarios to validate accuracy |
| 10. Configure Discount Approval Workflows | 3.5h | Build approval routing logic based on discount thresholds and deal criteria. End state: Automated approval workflows routing to correct approvers based on deal characteristics.<br /><br />• Configure approval thresholds matching documented approval matrix<br />• Set up approver assignments by role and hierarchy<br />• Build routing logic for multi-level approvals<br />• Configure escalation rules for delayed approvals<br />• Set up email/Slack notifications for pending approvals<br />• Test approval flow with sample deals at each threshold level |
| 11. Create Quote Document Templates | 3.5h | Design and configure quote document templates with branding and dynamic fields. End state: Professional quote templates that auto-populate with deal data.<br /><br />• Design quote layout matching client brand guidelines<br />• Configure dynamic field mapping (company name, products, pricing, terms)<br />• Add standard terms and conditions sections<br />• Set up signature blocks and approval stamps<br />• Create templates for different quote types (new business, renewal, expansion)<br />• Test template generation with sample data and review with stakeholders |
| 12. Configure CRM Data Sync | 3h | Set up bidirectional data sync between CPQ and CRM. End state: Quote data flows seamlessly to/from CRM opportunities with correct field mapping.<br /><br />• Map CPQ fields to CRM opportunity fields<br />• Configure sync triggers (on quote creation, approval, signature)<br />• Set up quote status updates to reflect in CRM<br />• Configure won/lost quote handling<br />• Test data sync with sample quotes through full lifecycle<br />• Validate CRM reports reflect accurate quote data |

---

## Milestone 2: CPQ Implementation - 2. Integrations & Testing
**Tag:** `cpq`
**Description:** System integrations, end-to-end testing, and user acceptance testing
**Hours:** 50h

---

### Task List: (CPQ) 3. Integrations & System Testing
**Contains:** Parts 5-6

| Task | Est | Description |
|------|-----|-------------|
| 13. Configure E-Signature Integration | 3h | Connect CPQ to e-signature platform for seamless quote delivery and signature capture. End state: Quotes can be sent for signature directly from CPQ with signed documents synced back.<br /><br />• Connect to DocuSign/Adobe Sign via API or native integration<br />• Configure signature routing (customer signers, internal countersign)<br />• Set up automatic signed document storage<br />• Configure signature completion triggers (update quote status, notify team)<br />• Test end-to-end signature flow with sample documents |
| 14. Build ERP/Billing Handoff | 3h | Configure order creation and handoff to ERP or billing system. End state: Approved/signed quotes can trigger order creation in downstream systems.<br /><br />• Map quote data to order/invoice fields in ERP/billing<br />• Configure order creation triggers (on signature, on manual submit)<br />• Set up order status sync back to CPQ/CRM<br />• Document any manual handoff steps required<br />• Test order creation flow with sample approved quotes |
| 15. Execute End-to-End System Testing | 4h | Validate complete quote-to-order flow across all integrated systems. End state: Documented test results showing all integrations working correctly.<br /><br />• Create test scripts covering all major quote scenarios<br />• Test product configuration edge cases (complex bundles, custom SKUs)<br />• Validate pricing calculations across all discount scenarios<br />• Test approval workflow at all threshold levels<br />• Execute integration tests across CRM, e-sign, and billing<br />• Document any issues and remediate before UAT |
| 16. Prepare UAT Environment and Test Cases | 2.5h | Set up UAT environment and create test cases using real deal scenarios. End state: UAT-ready environment with documented test cases for pilot users.<br /><br />• Clone sandbox configuration to UAT environment<br />• Create test cases based on actual recent deals (5-10 scenarios)<br />• Prepare test data (sample accounts, contacts, opportunities)<br />• Create UAT feedback form for pilot users<br />• Schedule UAT sessions with 3-5 pilot sales reps<br />• Brief pilot users on testing objectives and process |
| 17. Execute User Acceptance Testing | 3h | Conduct UAT sessions with pilot group using real deal scenarios. End state: UAT complete with documented feedback and issue list.<br /><br />• Facilitate hands-on UAT sessions (2-3 hours each)<br />• Observe users creating quotes through full workflow<br />• Capture usability issues and confusion points<br />• Document feature requests and improvement suggestions<br />• Prioritize issues by severity (blockers, major, minor)<br />• Share UAT summary with project stakeholders |
| 18. Remediate Issues and Refine Configuration | 3.5h | Address UAT feedback and refine system configuration before go-live. End state: All blocking issues resolved, major issues addressed, go-live readiness confirmed.<br /><br />• Fix all blocking issues identified in UAT<br />• Address high-priority usability improvements<br />• Update quote templates based on feedback<br />• Refine guided selling logic if users struggled with product selection<br />• Re-test remediated items with pilot users<br />• Get stakeholder sign-off for production deployment |

---

### Task List: (CPQ) 4. Deployment & Enablement
**Contains:** Part 7

| Task | Est | Description |
|------|-----|-------------|
| 19. Execute Production Deployment | 4h | Deploy CPQ configuration to production environment and validate all integrations. End state: Production CPQ system live and verified working.<br /><br />• Migrate configuration from UAT to production<br />• Validate all integrations are functioning in production<br />• Verify product catalog, pricing, and approval workflows<br />• Confirm user access and permissions are correctly set<br />• Run smoke tests on critical flows (quote creation, approval, signature)<br />• Document any production-specific configuration differences |
| 20. Deliver Sales Team Training | 3h | Train all sales team members on CPQ usage with hands-on exercises. End state: Sales team trained and confident using CPQ for daily quoting.<br /><br />• Schedule training sessions (60-90 minutes each)<br />• Cover quote creation workflow from opportunity to signature<br />• Demonstrate approval submission and tracking<br />• Walk through common scenarios (new business, renewal, expansion)<br />• Conduct hands-on exercises with practice quotes<br />• Record training session for future reference |
| 21. Create User Documentation Package | 2h | Develop documentation resources for ongoing user support. End state: Complete documentation package including quick-start guide, FAQ, and video walkthroughs.<br /><br />• Create quick-start guide (2-3 pages) for daily CPQ use<br />• Document FAQs based on training questions<br />• Create video walkthroughs for key workflows<br />• Build troubleshooting guide for common issues<br />• Document admin procedures for product/pricing updates<br />• Share documentation in company wiki/knowledge base |

---

## Milestone 3: CPQ Implementation - 3. Go-Live & Handoff
**Tag:** `cpq`
**Description:** Go-live support, adoption monitoring, and ownership transfer
**Hours:** 77h

---

### Task List: (CPQ) 5. Go-Live Support & Handoff
**Contains:** Part 8

| Task | Est | Description |
|------|-----|-------------|
| 22. Execute Go-Live and Hypercare Support | 35h | Go live with full sales team and provide intensive support during first two weeks. End state: Team actively using CPQ with issues addressed in real-time.<br /><br />• Announce go-live with clear expectations and support channels<br />• Monitor CPQ usage and adoption metrics daily<br />• Provide real-time support via Slack/Teams channel<br />• Address issues and questions as they arise<br />• Track common questions to inform documentation updates<br />• Escalate any system issues for immediate resolution |
| 23. Monitor Adoption Metrics and Address Resistance | 35h | Track adoption metrics and intervene with users not adopting CPQ. End state: 80%+ of reps actively using CPQ within 30 days.<br /><br />• Pull weekly adoption reports (quotes created per rep)<br />• Identify reps with low or no CPQ usage<br />• Conduct 1:1 check-ins with non-adopters to understand blockers<br />• Provide additional coaching or training as needed<br />• Celebrate early wins and power users to drive adoption<br />• Report adoption metrics to Sales leadership weekly |
| 24. Transfer Ownership and Schedule Check-Ins | 7h | Hand off CPQ administration to client team and establish ongoing support cadence. End state: Client self-sufficient with admin access, documentation, and scheduled check-ins.<br /><br />• Transfer admin credentials and permissions to client RevOps<br />• Walk through admin procedures (adding products, updating pricing)<br />• Deliver complete documentation package<br />• Schedule 30-day post-launch review meeting<br />• Define escalation path for future issues<br />• Close out project with lessons learned debrief |

---

## Summary
- **Total Milestones:** 3 (48h + 50h + 77h)
- **Total Task Lists:** 5 (consolidated from 8 Parts)
- **Total Tasks:** 24 (one per Step)
- **Total Hours:** 175h
- **Generated from:** playbook_cpq-implementation.md
- **Generated on:** 2025-12-31
