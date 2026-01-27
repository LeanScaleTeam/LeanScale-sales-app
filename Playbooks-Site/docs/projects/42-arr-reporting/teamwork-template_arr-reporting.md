# ARR Reporting - Project Details / Task List

**Tag:** `arr-reporting`
**Total Hours:** 15h
**Structure:** Single Milestone (&lt;=50h)

---

## Milestone: ARR Reporting
**Description:** A foundational RevOps project that establishes ARR (Annual Recurring Revenue) as a single source of truth in the CRM by defining calculation rules, modeling data fields, integrating billing systems, and building executive dashboards.

---

### Task List: (ARR Reporting) 1. Definition & Build
**Contains:** Parts 1-2

| Task | Est | Description |
|------|-----|-------------|
| 1. Document ARR Definition & Business Rules | 2h | Align stakeholders on what counts as ARR and create a written policy document. End state: One-page ARR definition document approved by Finance and RevOps.<br /><br />• Convene stakeholders (Finance, RevOps, Sales, CS) to align on ARR scope<br />• Define what revenue counts: recurring subscription fees, recurring add-ons, contracted usage minimums<br />• Define what revenue does NOT count: one-time onboarding, setup fees, professional services, perpetual licenses<br />• Decide unit of record: Account level, Contract/Subscription level, or both<br />• Document formula: Annualized Contract Value = (Monthly Recurring Amount x 12)<br />• Define handling for multi-year contracts (divide total value by term)<br />• Define handling for mid-term upgrades/downgrades and pro-ration rules<br />• Create written ARR policy document (1-page) and get Finance sign-off |
| 2. Design ARR Data Model in CRM | 2h | Determine which CRM objects will store ARR data and define the required custom fields. End state: Data model documented with field specifications ready for build.<br /><br />• Decide system of record for ARR (Opportunity, Contract, or custom Subscription object)<br />• Specify required custom fields: ARR (currency), MRR (if useful), ARR Start Date, ARR End Date<br />• Define ARR component fields: New ARR, Expansion ARR, Churned ARR, Contraction ARR<br />• Design validation rules to enforce required field population<br />• Map relationships between objects (Account → Contract → ARR fields)<br />• Document field definitions, picklist values, and data types |
| 3. Create ARR Fields and Objects in CRM | 1.5h | Build the custom fields and any required custom objects in the CRM. End state: All ARR fields created and visible on appropriate page layouts.<br /><br />• Create ARR, MRR, and date fields on the designated object (Contract/Opportunity)<br />• Create ARR component fields (New, Expansion, Churn, Contraction)<br />• Build validation rules to enforce required field population<br />• Add fields to page layouts for relevant user roles<br />• Configure field-level security and sharing rules<br />• Test field creation with sample records |
| 4. Connect Billing/Subscription System | 2h | Establish integration between the billing system and CRM to sync subscription data. End state: Billing system connected with data flowing into CRM fields.<br /><br />• Document current billing system (Stripe, Chargebee, Zuora, NetSuite, or other)<br />• Evaluate integration options: native connector, middleware (Zapier, Workato), or ETL pipeline<br />• Map billing system fields to CRM ARR fields<br />• Configure sync for cancellations, expansions, renewals, and new subscriptions<br />• Set sync frequency (near-real-time vs. batch)<br />• Test integration with sample transactions<br />• Document error handling and alerting for failed syncs |
| 5. Build ARR Calculation Automation | 2h | Automate ARR calculations using formula fields and/or workflow automation. End state: ARR recalculates automatically when contract data changes.<br /><br />• Build formula fields to auto-calculate ARR from contract amount and term<br />• Create workflow/flow automation to recalculate on key events (renewal, upgrade, churn)<br />• Set up scheduled jobs for nightly ARR re-evaluation if needed<br />• Handle edge cases: multi-currency, partial months, discounts, usage-based components<br />• Test calculations with various contract scenarios (new, renewal, expansion, downgrade)<br />• Validate ARR totals against known source data |

---

### Task List: (ARR Reporting) 2. Reporting & Handoff
**Contains:** Parts 3-4

| Task | Est | Description |
|------|-----|-------------|
| 6. Set Up ARR History Tracking | 1h | Enable tracking of ARR changes over time for audit and trend reporting. End state: Full history of ARR changes available for reporting.<br /><br />• Enable field history tracking on ARR fields (or create custom history object)<br />• Consider dedicated "Subscription History" object for full auditability<br />• Define what changes to capture: amount changes, status changes, date changes<br />• Build snapshot process for point-in-time ARR reporting (end-of-month snapshots)<br />• Test history capture with sample ARR changes |
| 7. Build ARR Reports and Dashboards | 2h | Create executive dashboards and operational reports for ARR visibility. End state: Live ARR dashboard accessible to leadership.<br /><br />• Build Executive Dashboard: Total ARR, New ARR, Churned ARR, Net ARR Growth<br />• Create ARR Bridge report showing movement between periods<br />• Build cohort views: ARR by segment, product, region, rep<br />• Create forecasting reports projecting future ARR from pipeline<br />• Set up drill-down reports for ARR component analysis<br />• Configure dashboard refresh schedule and sharing permissions<br />• Test all reports with current data and validate accuracy |
| 8. Establish Governance Process | 1h | Define ongoing data hygiene and ownership for ARR accuracy. End state: Documented governance process with assigned owners.<br /><br />• Assign Revenue Ops owner for edge case review (multi-currency, partial months, discounts)<br />• Define quarterly audit process: spot-check 10-20 contracts for consistent treatment<br />• Create data hygiene checklist for expired contracts and stale ARR values<br />• Document reconciliation process: ARR to recognized revenue bridge<br />• Set up alerting for data anomalies (unusual ARR spikes/drops) |
| 9. Conduct Training & Documentation | 1h | Train all stakeholder teams on ARR definitions and system usage. End state: Teams trained with documentation delivered.<br /><br />• Create ARR definition quick-reference guide for Sales, Finance, and CS<br />• Schedule training sessions for each team (30-45 min each)<br />• Cover: what counts as ARR, how to update records, where to find reports<br />• Address questions on edge cases and escalation path<br />• Record training sessions for future onboarding<br />• Deliver documentation package to client |
| 10. Hand Off to Client | 0.5h | Transfer ownership and close out the project. End state: Client self-sufficient with admin access and ongoing support plan.<br /><br />• Transfer admin credentials and integration access to client RevOps<br />• Deliver final documentation package (config settings, troubleshooting guide, ARR policy)<br />• Walk through dashboard and reporting with executive stakeholders<br />• Schedule 30-day check-in for questions and optimization<br />• Close out project and transition to support mode |

---

## Summary
- **Total Task Lists:** 2 (consolidated from 4 Parts)
- **Total Tasks:** 10 (one per Step)
- **Total Hours:** 15h
- **Generated from:** playbook_arr-reporting.md
- **Generated on:** 2025-12-31
