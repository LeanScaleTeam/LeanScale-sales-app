# Lead Routing - Project Details / Task List

**Tag:** `lead-routing`
**Total Hours:** 45h
**Structure:** Single Milestone (&lt;=50h)

---

## Milestone: Lead Routing
**Description:** A technical implementation project that designs and deploys automated lead distribution logic to route incoming leads to the appropriate sales representatives or teams based on defined criteria (territory, segment, product line, account ownership).

---

### Task List: (Lead Routing) 1. Assessment & Architecture
**Contains:** Parts 1-2

| Task | Est | Description |
|------|-----|-------------|
| 1. Audit Current Lead Routing Process | 3h | Document how leads are currently being routed and identify gaps, bottlenecks, and failure points. End state: Current state map showing routing paths, ownership, and known issues.<br /><br />• Pull lead assignment data from CRM for last 90 days (who assigned, when, routing path)<br />• Identify how many leads are unassigned or sitting in queues >24 hours<br />• Interview 2-3 sales reps and 1-2 SDR managers on routing pain points<br />• Document current routing mechanisms (assignment rules, workflows, manual processes)<br />• Calculate current speed-to-lead metrics (time from lead creation to first touch)<br />• Identify data quality issues that break routing (missing fields, inconsistent values) |
| 2. Define Routing Criteria and Business Rules | 3h | Establish the criteria that will determine where leads are routed based on business strategy and sales team structure. End state: Documented routing criteria matrix approved by sales leadership.<br /><br />• Define primary routing dimensions (territory/geography, segment/company size, product line, industry)<br />• Document account ownership rules (existing customers, named accounts, ABM target accounts)<br />• Establish round-robin rules for unmatched leads (team pools, weighting, capacity limits)<br />• Define fallback logic for incomplete data scenarios (catch-all queue, default assignment)<br />• Get sign-off from VP Sales on routing hierarchy and rules of engagement<br />• Document edge cases (partner leads, channel leads, existing customer leads, disqualified leads) |
| 3. Select and Confirm Routing Tool Approach | 2.5h | Evaluate whether native CRM capabilities or third-party routing tools best fit the client's needs and complexity. End state: Tool decision made with implementation approach confirmed.<br /><br />• Assess complexity of routing requirements (simple territory vs. multi-layer logic)<br />• Evaluate native CRM capabilities (Salesforce Assignment Rules/Flows, HubSpot Workflows)<br />• Compare third-party options if needed (LeanData, Chili Piper, Default, Traction Complete)<br />• Consider integration requirements with existing tech stack (forms, chat, scheduling)<br />• Document tool recommendation with pros/cons and cost implications<br />• Get budget approval if third-party tool required |
| 4. Map Lead Sources to Routing Paths | 2.5h | Document all lead entry points and how each source should flow through the routing system. End state: Lead source routing matrix showing entry point to destination mapping.<br /><br />• Inventory all lead sources (website forms, chat, events, paid campaigns, partner referrals)<br />• Map each source to appropriate routing path and priority level<br />• Identify which sources require immediate routing vs. batch processing<br />• Document source-specific data requirements (UTM parameters, form fields needed for routing)<br />• Define handling for each lead source that feeds into routing logic |
| 5. Design Layered Routing Framework | 3.5h | Build a multi-tier routing logic that prioritizes ownership and context before defaulting to general distribution. End state: Routing flowchart showing decision tree with all branches and fallbacks.<br /><br />• Layer 1: Account ownership check (route to existing account owner if match found)<br />• Layer 2: Territory/geography match (assign based on region or market)<br />• Layer 3: Segment/vertical routing (company size, industry, product interest)<br />• Layer 4: Round-robin fallback (distribute unmatched leads evenly across available reps)<br />• Define timeout rules at each layer (how long before escalating to next layer)<br />• Document availability-based routing rules (calendar integration, business hours, OOO handling) |
| 6. Define Data Requirements and Enrichment Needs | 2.5h | Identify what data fields are required for routing decisions and how missing data will be handled. End state: Data requirements document with enrichment strategy for gaps.<br /><br />• List required fields for routing logic (country, state, company size, industry, lead source)<br />• Identify which fields are reliably populated vs. frequently missing<br />• Define enrichment strategy for missing data (real-time enrichment tools, default values)<br />• Establish data validation rules to catch bad data before routing<br />• Document how incomplete leads should be handled (manual queue, default assignment) |

---

### Task List: (Lead Routing) 2. Build & Validation
**Contains:** Parts 3-4

| Task | Est | Description |
|------|-----|-------------|
| 7. Configure CRM Objects and Fields | 3h | Set up required fields, picklist values, and object relationships in the CRM to support routing logic. End state: CRM configured with all fields and values needed for routing.<br /><br />• Create or update territory/region picklist values in CRM<br />• Add routing-specific fields (assigned queue, routing timestamp, routing source)<br />• Configure lead-to-account matching rules if using account-based routing<br />• Set up queue objects for round-robin pools (SDR queues, regional queues)<br />• Update record types or page layouts to surface routing information |
| 8. Build Routing Rules and Automation | 4h | Implement the routing logic in the selected tool (native CRM or third-party). End state: Routing automation live in sandbox, ready for testing.<br /><br />• Build assignment rules or flows based on routing framework design<br />• Configure round-robin logic with appropriate weighting and capacity limits<br />• Set up availability-based routing (calendar integration, business hours)<br />• Implement fallback/catch-all rules for unmatched leads<br />• Configure notifications to reps when leads are assigned (email, Slack, in-app)<br />• Set up re-routing triggers for lead updates (e.g., company size enriched after creation) |
| 9. Implement Speed-to-Lead Tracking | 3h | Build tracking mechanisms to measure how quickly leads are being routed and contacted. End state: Speed-to-lead metrics captured automatically in CRM.<br /><br />• Create timestamp fields: lead created, lead assigned, first contact attempt<br />• Build formula fields to calculate routing time and response time<br />• Configure automation to stamp timestamps at key routing milestones<br />• Set up alerts for leads exceeding SLA thresholds (e.g., >5 min unassigned)<br />• Create reports/dashboards to monitor speed-to-lead in real-time |
| 10. Develop Test Plan and Test Cases | 2h | Create comprehensive test scenarios covering all routing paths, edge cases, and failure modes. End state: Test plan document with test cases ready for execution.<br /><br />• Document test cases for each routing path (territory, segment, account match)<br />• Create edge case scenarios (missing data, duplicate leads, existing customers)<br />• Define expected outcomes for each test case<br />• Prepare test data with various field combinations<br />• Identify who will execute tests and validate results |
| 11. Execute Testing in Sandbox | 2.5h | Run all test cases in sandbox environment and document results. End state: All test cases passed or issues documented for resolution.<br /><br />• Execute each test case and document actual vs. expected outcome<br />• Test round-robin distribution across multiple leads<br />• Verify fallback logic triggers correctly when primary rules don't match<br />• Test speed-to-lead tracking and timestamp accuracy<br />• Validate notifications are firing correctly to assigned reps<br />• Test integration points (forms, chat, third-party tools feeding leads) |
| 12. Resolve Issues and Retest | 2h | Fix any routing failures identified during testing and re-validate. End state: All routing paths working correctly, ready for production.<br /><br />• Prioritize and fix routing failures by severity<br />• Retest failed scenarios after fixes applied<br />• Validate data quality rules are catching bad data appropriately<br />• Confirm fallback logic is working for all edge cases<br />• Get sign-off from stakeholders on test results |

---

### Task List: (Lead Routing) 3. Deploy & Enablement
**Contains:** Part 5

| Task | Est | Description |
|------|-----|-------------|
| 13. Deploy Routing System to Production | 2.5h | Move tested routing configuration from sandbox to production environment. End state: Routing system live in production, processing real leads.<br /><br />• Schedule deployment during low-volume period<br />• Deploy routing rules/flows to production using change sets or deployment tools<br />• Activate assignment rules or enable routing automation<br />• Monitor first batch of leads through new routing system<br />• Have rollback plan ready if critical issues emerge |
| 14. Create Operational Documentation | 3h | Document the routing system architecture, rules, and maintenance procedures for ongoing operations. End state: Complete documentation package for RevOps team.<br /><br />• Document routing logic flowchart with all decision points<br />• Create admin guide for modifying routing rules (adding territories, reps, queues)<br />• Document troubleshooting guide for common routing failures<br />• Create data dictionary for routing-related fields<br />• Document escalation procedures for routing issues |
| 15. Train Sales and RevOps Teams | 2.5h | Enable sales team to understand routing and RevOps team to maintain the system. End state: Teams trained and confident using/managing routing.<br /><br />• Conduct sales team training (30 min): what to expect, how to flag routing issues<br />• Train RevOps/Ops team on administration: how to add reps, modify rules, troubleshoot<br />• Create quick reference guide for common routing questions<br />• Record training sessions for future onboarding<br />• Set up Slack channel or process for routing issue escalation |
| 16. Hand Off and Establish Ongoing Governance | 3h | Transfer ownership to client team and establish monitoring/optimization cadence. End state: Client self-sufficient with routing system, optimization process in place.<br /><br />• Transfer admin credentials and documentation to client RevOps<br />• Set up weekly/monthly routing performance review cadence<br />• Establish process for requesting routing rule changes<br />• Schedule 30-day check-in to review performance and address issues<br />• Close out project with final status report |

---

## Summary
- **Total Task Lists:** 3 (consolidated from 5 Parts)
- **Total Tasks:** 16 (one per Step)
- **Total Hours:** 45h
- **Generated from:** playbook_lead-routing.md
- **Generated on:** 2025-12-31
