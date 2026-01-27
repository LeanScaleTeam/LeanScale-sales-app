# Customer Lifecycle - Project Details / Task List

**Tag:** `customer-lifecycle`
**Total Hours:** 30h
**Structure:** Single Milestone (&lt;=50h)

---

## Milestone: Customer Lifecycle
**Description:** A strategic and technical project that designs and implements a customer lifecycle structure in the CRM, establishing clear stage definitions, automated transitions, and stage date/time stamps to track customers through their journey from onboarding through retention and expansion.

---

### Task List: (Customer Lifecycle) 1. Discovery & Stage Definition
**Contains:** Parts 1-2

| Task | Est | Description |
|------|-----|-------------|
| 1. Conduct Stakeholder Interviews | 2h | Meet with CS, Sales, and GTM leadership to understand business objectives, current processes, and pain points with customer tracking. End state: Documented requirements and alignment on project goals.<br /><br />• Schedule 30-45 min interviews with VP CS, CS Managers, RevOps, and Sales leadership<br />• Document current pain points (e.g., "we don't know how many customers are stuck in onboarding")<br />• Identify what decisions leadership wants to make with lifecycle data<br />• Understand existing customer journey documentation or tribal knowledge<br />• Capture any compliance or reporting requirements (board metrics, investor reporting) |
| 2. Audit Current Lifecycle Tracking | 2h | Assess the current state of customer lifecycle tracking in the CRM to establish baseline and identify gaps. End state: Gap analysis showing what's missing vs. ideal state.<br /><br />• Pull current customer stage/status fields from CRM (Account Status, Customer Stage, etc.)<br />• Document which fields are being used and which are stale or inconsistent<br />• Check for existing date stamp fields (e.g., "Onboarding Start Date", "Go-Live Date")<br />• Review any existing automations that move customers between stages<br />• Compare current state against the diagnostic rubric (Red/Yellow/Green) |
| 3. Gather Existing Documentation | 1.5h | Collect any existing process documentation, playbooks, or definitions that inform the lifecycle design. End state: Complete inventory of existing materials to incorporate.<br /><br />• Request CS playbooks, onboarding checklists, and renewal runbooks<br />• Collect any existing stage definitions or criteria (even if informal)<br />• Review CS tool configurations if Gainsight/ChurnZero/Catalyst is in place<br />• Document current reporting (what dashboards exist for customer funnel)<br />• Note gaps where documentation doesn't exist |
| 4. Define Lifecycle Stage Structure | 2h | Design the customer lifecycle stages that will be tracked in the CRM, ensuring alignment with business processes. End state: Documented list of lifecycle stages with clear definitions.<br /><br />• Define core stages (typical: New Customer, Onboarding, Adopting, Healthy/Mature, At-Risk, Churned)<br />• Ensure stages are mutually exclusive (customer can only be in one stage)<br />• Align stage names with terminology already used by CS team<br />• Validate stage structure with CS leadership before proceeding<br />• Document stage definitions in a shared reference doc |
| 5. Establish Entry & Exit Criteria | 2h | Define the specific criteria that determine when a customer enters and exits each lifecycle stage. End state: Documented entry/exit criteria for every stage transition.<br /><br />• Define quantitative criteria where possible (e.g., "Onboarding Complete when product usage > X")<br />• Define qualitative criteria with clear ownership (e.g., "CSM marks onboarding complete")<br />• Ensure criteria are measurable and enforceable in the CRM<br />• Document which criteria trigger automatic vs. manual transitions<br />• Create decision tree or flowchart for stage transitions |
| 6. Define Date Stamp Requirements | 1.5h | Identify which date/time stamps need to be captured for each stage to enable velocity reporting. End state: List of date fields to create with naming conventions.<br /><br />• Define "Stage Entry Date" fields for each lifecycle stage<br />• Determine if "Stage Exit Date" fields are also needed<br />• Establish naming convention (e.g., "Lifecycle_Onboarding_Start_Date__c")<br />• Identify which timestamps feed key metrics (Time to Value, Time in Onboarding)<br />• Document calculation logic for duration fields if needed |

---

### Task List: (Customer Lifecycle) 2. Configuration & Testing
**Contains:** Parts 3-4

| Task | Est | Description |
|------|-----|-------------|
| 7. Create Lifecycle Fields in CRM | 2.5h | Build the lifecycle stage field and all associated date stamp fields in the CRM. End state: All lifecycle fields created and visible on appropriate page layouts.<br /><br />• Create picklist field for Customer Lifecycle Stage on Account object<br />• Create date fields for each stage entry timestamp<br />• Add fields to Account page layout in logical grouping<br />• Set field-level security to ensure appropriate access<br />• Document field API names for automation reference |
| 8. Build Stage Transition Automations | 3.5h | Configure automation rules that move customers between lifecycle stages based on defined criteria. End state: Automated transitions functioning for all stage changes.<br /><br />• Build Flow/Process Builder (Salesforce) or Workflow (HubSpot) for each automatic transition<br />• Configure triggers based on entry criteria (e.g., Opportunity Closed Won triggers New Customer)<br />• Ensure automations populate date stamp fields when stage changes<br />• Build validation rules to prevent manual overrides of automated stages if needed<br />• Test each automation individually with sample records |
| 9. Configure Manual Transition Process | 2h | Set up the process for manual stage transitions where automation isn't appropriate. End state: Clear process for CSMs to manually update stages with guardrails.<br /><br />• Identify which transitions require manual CSM action<br />• Build screen flow or guided action for CSM stage changes<br />• Include required fields (reason for transition, notes)<br />• Ensure manual transitions also populate date stamps<br />• Document the manual process for CS team reference |
| 10. Integrate with CS Platform (if applicable) | 2.5h | Connect lifecycle stages to Customer Success platform to ensure data flows between systems. End state: Bi-directional sync between CRM and CS platform.<br /><br />• Map CRM lifecycle stages to CS platform stages (Gainsight/ChurnZero/etc.)<br />• Configure sync rules (which system is source of truth for which stages)<br />• Set up sync frequency and conflict resolution rules<br />• Test sync with sample records in both directions<br />• Document integration architecture for client ops team |
| 11. Test Lifecycle Transitions End-to-End | 2h | Validate that all stage transitions work correctly with real customer scenarios. End state: Confirmed that all transitions fire correctly and date stamps populate.<br /><br />• Create test accounts representing each lifecycle stage<br />• Trigger each automated transition and verify stage changes<br />• Confirm date stamp fields populate correctly<br />• Test manual transitions via screen flow<br />• Document any bugs or edge cases found |
| 12. Validate Reporting Accuracy | 2h | Confirm that lifecycle data supports required reporting and metrics. End state: Reports showing accurate customer funnel and velocity metrics.<br /><br />• Build test report showing customer count by lifecycle stage<br />• Build velocity report showing time-in-stage metrics<br />• Validate counts against manual spot-checks<br />• Test filters and groupings needed for leadership views<br />• Identify any data quality issues requiring cleanup |
| 13. Conduct User Acceptance Testing | 1.5h | Have CS team members test the lifecycle in their daily workflow to confirm usability. End state: Sign-off from CS team that lifecycle is ready for rollout.<br /><br />• Select 2-3 CSMs for pilot testing<br />• Have them process 5-10 real customer transitions<br />• Gather feedback on usability and process clarity<br />• Address critical issues before full rollout<br />• Get formal sign-off from CS leadership |

---

### Task List: (Customer Lifecycle) 3. Training & Rollout
**Contains:** Part 5

| Task | Est | Description |
|------|-----|-------------|
| 14. Create Training Materials | 1.5h | Develop documentation and training content for the CS team on the new lifecycle. End state: Complete training package ready for delivery.<br /><br />• Create one-pager with lifecycle stage definitions and criteria<br />• Build quick-reference guide for common scenarios<br />• Document FAQ for edge cases and exceptions<br />• Create short video walkthrough (3-5 min) of key processes<br />• Prepare training deck for live session |
| 15. Deliver Training to CS Team | 1.5h | Train the full CS team on lifecycle definitions, processes, and CRM usage. End state: All CSMs trained and comfortable with new lifecycle.<br /><br />• Schedule 45-60 min training session with full CS team<br />• Walk through stage definitions and transition criteria<br />• Demonstrate CRM screens and automation in action<br />• Cover manual transition process and when to use it<br />• Record session for future onboarding of new CSMs |
| 16. Roll Out to Production | 2h | Activate the lifecycle for all customers and migrate existing customers to appropriate stages. End state: All customers assigned to lifecycle stages with baseline data.<br /><br />• Run data migration to assign existing customers to current stage<br />• Backfill date stamps where historical data exists<br />• Activate all automations in production<br />• Communicate go-live to CS team<br />• Monitor for first 48 hours for issues |
| 17. Hand Off to Client | 2h | Transfer ownership of the lifecycle to client RevOps/CS Ops with full documentation. End state: Client self-sufficient to maintain and iterate on lifecycle.<br /><br />• Deliver documentation package (stage definitions, automation logic, field reference)<br />• Transfer admin access and credentials<br />• Provide runbook for common maintenance tasks<br />• Schedule 30-day check-in to review adoption and metrics<br />• Close out project and capture lessons learned |

---

## Summary
- **Total Task Lists:** 3 (consolidated from 5 Parts)
- **Total Tasks:** 17 (one per Step)
- **Total Hours:** 30h
- **Generated from:** playbook_customer-lifecycle.md
- **Generated on:** 2025-12-31
