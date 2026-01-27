# Lead Routing - Playbook

## 1. Definition

**What it is**: A technical implementation project that designs and deploys automated lead distribution logic to route incoming leads to the appropriate sales representatives or teams based on defined criteria (territory, segment, product line, account ownership). The deliverable is a working routing system in the CRM with proper fallback logic, speed-to-lead optimization, and operational documentation.

**What it is NOT**: Not a Lead Scoring project (that determines lead quality/priority, not destination). Not a Lead Lifecycle/GTM Lifecycle project (that defines stages and statuses). Not a Sales Engagement Platform implementation (sequences/cadences). Not a CRM migration or data cleanup project (though data quality impacts routing effectiveness).

## 2. ICP Value Proposition

**Pain it solves**: Leads are falling through the cracks or being routed to the wrong reps, causing slow response times and lost pipeline. Research shows 25.5% of marketing-generated leads are misrouted, and 73% of MQLs never get contacted. Speed-to-lead suffers when routing logic is manual, undocumented, or brittle.

**Outcome delivered**: Automated lead routing system that distributes leads to the right rep within minutes based on clear criteria (territory, segment, account ownership, round-robin). Fallback logic ensures no lead is orphaned. Speed-to-lead tracking enables accountability. Reps receive leads with context, improving conversion rates.

**Who owns it**: VP of Sales Operations, RevOps Leader, or Marketing Operations Manager.

## 3. Implementation Procedure

### Part 1: Assess Current State & Define Routing Strategy

#### Step 1: Audit Current Lead Routing Process

**Step Overview:** Document how leads are currently being routed and identify gaps, bottlenecks, and failure points. End state: Current state map showing routing paths, ownership, and known issues.

- Pull lead assignment data from CRM for last 90 days (who assigned, when, routing path)
- Identify how many leads are unassigned or sitting in queues >24 hours
- Interview 2-3 sales reps and 1-2 SDR managers on routing pain points
- Document current routing mechanisms (assignment rules, workflows, manual processes)
- Calculate current speed-to-lead metrics (time from lead creation to first touch)
- Identify data quality issues that break routing (missing fields, inconsistent values)

#### Step 2: Define Routing Criteria and Business Rules

**Step Overview:** Establish the criteria that will determine where leads are routed based on business strategy and sales team structure. End state: Documented routing criteria matrix approved by sales leadership.

- Define primary routing dimensions (territory/geography, segment/company size, product line, industry)
- Document account ownership rules (existing customers, named accounts, ABM target accounts)
- Establish round-robin rules for unmatched leads (team pools, weighting, capacity limits)
- Define fallback logic for incomplete data scenarios (catch-all queue, default assignment)
- Get sign-off from VP Sales on routing hierarchy and rules of engagement
- Document edge cases (partner leads, channel leads, existing customer leads, disqualified leads)

#### Step 3: Select and Confirm Routing Tool Approach

**Step Overview:** Evaluate whether native CRM capabilities or third-party routing tools best fit the client's needs and complexity. End state: Tool decision made with implementation approach confirmed.

- Assess complexity of routing requirements (simple territory vs. multi-layer logic)
- Evaluate native CRM capabilities (Salesforce Assignment Rules/Flows, HubSpot Workflows)
- Compare third-party options if needed (LeanData, Chili Piper, Default, Traction Complete)
- Consider integration requirements with existing tech stack (forms, chat, scheduling)
- Document tool recommendation with pros/cons and cost implications
- Get budget approval if third-party tool required

---

### Part 2: Design Routing Logic Architecture

#### Step 1: Map Lead Sources to Routing Paths

**Step Overview:** Document all lead entry points and how each source should flow through the routing system. End state: Lead source routing matrix showing entry point to destination mapping.

- Inventory all lead sources (website forms, chat, events, paid campaigns, partner referrals)
- Map each source to appropriate routing path and priority level
- Identify which sources require immediate routing vs. batch processing
- Document source-specific data requirements (UTM parameters, form fields needed for routing)
- Define handling for each lead source that feeds into routing logic

#### Step 2: Design Layered Routing Framework

**Step Overview:** Build a multi-tier routing logic that prioritizes ownership and context before defaulting to general distribution. End state: Routing flowchart showing decision tree with all branches and fallbacks.

- Layer 1: Account ownership check (route to existing account owner if match found)
- Layer 2: Territory/geography match (assign based on region or market)
- Layer 3: Segment/vertical routing (company size, industry, product interest)
- Layer 4: Round-robin fallback (distribute unmatched leads evenly across available reps)
- Define timeout rules at each layer (how long before escalating to next layer)
- Document availability-based routing rules (calendar integration, business hours, OOO handling)

#### Step 3: Define Data Requirements and Enrichment Needs

**Step Overview:** Identify what data fields are required for routing decisions and how missing data will be handled. End state: Data requirements document with enrichment strategy for gaps.

- List required fields for routing logic (country, state, company size, industry, lead source)
- Identify which fields are reliably populated vs. frequently missing
- Define enrichment strategy for missing data (real-time enrichment tools, default values)
- Establish data validation rules to catch bad data before routing
- Document how incomplete leads should be handled (manual queue, default assignment)

---

### Part 3: Build and Configure Routing System

#### Step 1: Configure CRM Objects and Fields

**Step Overview:** Set up required fields, picklist values, and object relationships in the CRM to support routing logic. End state: CRM configured with all fields and values needed for routing.

- Create or update territory/region picklist values in CRM
- Add routing-specific fields (assigned queue, routing timestamp, routing source)
- Configure lead-to-account matching rules if using account-based routing
- Set up queue objects for round-robin pools (SDR queues, regional queues)
- Update record types or page layouts to surface routing information

#### Step 2: Build Routing Rules and Automation

**Step Overview:** Implement the routing logic in the selected tool (native CRM or third-party). End state: Routing automation live in sandbox, ready for testing.

- Build assignment rules or flows based on routing framework design
- Configure round-robin logic with appropriate weighting and capacity limits
- Set up availability-based routing (calendar integration, business hours)
- Implement fallback/catch-all rules for unmatched leads
- Configure notifications to reps when leads are assigned (email, Slack, in-app)
- Set up re-routing triggers for lead updates (e.g., company size enriched after creation)

#### Step 3: Implement Speed-to-Lead Tracking

**Step Overview:** Build tracking mechanisms to measure how quickly leads are being routed and contacted. End state: Speed-to-lead metrics captured automatically in CRM.

- Create timestamp fields: lead created, lead assigned, first contact attempt
- Build formula fields to calculate routing time and response time
- Configure automation to stamp timestamps at key routing milestones
- Set up alerts for leads exceeding SLA thresholds (e.g., >5 min unassigned)
- Create reports/dashboards to monitor speed-to-lead in real-time

---

### Part 4: Test and Validate Routing System

#### Step 1: Develop Test Plan and Test Cases

**Step Overview:** Create comprehensive test scenarios covering all routing paths, edge cases, and failure modes. End state: Test plan document with test cases ready for execution.

- Document test cases for each routing path (territory, segment, account match)
- Create edge case scenarios (missing data, duplicate leads, existing customers)
- Define expected outcomes for each test case
- Prepare test data with various field combinations
- Identify who will execute tests and validate results

#### Step 2: Execute Testing in Sandbox

**Step Overview:** Run all test cases in sandbox environment and document results. End state: All test cases passed or issues documented for resolution.

- Execute each test case and document actual vs. expected outcome
- Test round-robin distribution across multiple leads
- Verify fallback logic triggers correctly when primary rules don't match
- Test speed-to-lead tracking and timestamp accuracy
- Validate notifications are firing correctly to assigned reps
- Test integration points (forms, chat, third-party tools feeding leads)

#### Step 3: Resolve Issues and Retest

**Step Overview:** Fix any routing failures identified during testing and re-validate. End state: All routing paths working correctly, ready for production.

- Prioritize and fix routing failures by severity
- Retest failed scenarios after fixes applied
- Validate data quality rules are catching bad data appropriately
- Confirm fallback logic is working for all edge cases
- Get sign-off from stakeholders on test results

---

### Part 5: Deploy, Train, and Enable

#### Step 1: Deploy Routing System to Production

**Step Overview:** Move tested routing configuration from sandbox to production environment. End state: Routing system live in production, processing real leads.

- Schedule deployment during low-volume period
- Deploy routing rules/flows to production using change sets or deployment tools
- Activate assignment rules or enable routing automation
- Monitor first batch of leads through new routing system
- Have rollback plan ready if critical issues emerge

#### Step 2: Create Operational Documentation

**Step Overview:** Document the routing system architecture, rules, and maintenance procedures for ongoing operations. End state: Complete documentation package for RevOps team.

- Document routing logic flowchart with all decision points
- Create admin guide for modifying routing rules (adding territories, reps, queues)
- Document troubleshooting guide for common routing failures
- Create data dictionary for routing-related fields
- Document escalation procedures for routing issues

#### Step 3: Train Sales and RevOps Teams

**Step Overview:** Enable sales team to understand routing and RevOps team to maintain the system. End state: Teams trained and confident using/managing routing.

- Conduct sales team training (30 min): what to expect, how to flag routing issues
- Train RevOps/Ops team on administration: how to add reps, modify rules, troubleshoot
- Create quick reference guide for common routing questions
- Record training sessions for future onboarding
- Set up Slack channel or process for routing issue escalation

#### Step 4: Hand Off and Establish Ongoing Governance

**Step Overview:** Transfer ownership to client team and establish monitoring/optimization cadence. End state: Client self-sufficient with routing system, optimization process in place.

- Transfer admin credentials and documentation to client RevOps
- Set up weekly/monthly routing performance review cadence
- Establish process for requesting routing rule changes
- Schedule 30-day check-in to review performance and address issues
- Close out project with final status report

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM admin access (Salesforce or HubSpot) with permission to create/modify automation
- Defined sales team structure (territories, segments, queues)
- Account ownership data current in CRM (for account-based routing)
- Lead sources configured and flowing into CRM
- If using third-party tool: procurement and licensing complete

**What client must provide:**
- Sales leadership availability for routing criteria decisions
- Territory/segment definitions and rep assignments
- Business rules for edge cases (partner leads, existing customers, etc.)
- Access to current routing documentation (if any exists)
- Test users/reps for validation phase
- Sign-off authority for go-live decision

## 5. Common Pitfalls

- **Pitfall 1**: Data quality breaks routing logic → **Mitigation**: Build data validation rules and enrichment workflows before routing. Create fallback logic that handles missing/bad data gracefully rather than failing silently.

- **Pitfall 2**: No fallback logic creates orphaned leads → **Mitigation**: Always implement a catch-all queue with monitoring and alerts. Assign ownership of the catch-all queue to ensure leads are processed within SLA.

- **Pitfall 3**: Routing logic becomes brittle as business changes → **Mitigation**: Document all routing rules in a shared location outside the CRM. Establish quarterly review cadence to align routing with territory/team changes. Use dynamic assignments where possible.

- **Pitfall 4**: HubSpot-Salesforce integration conflicts on lead ownership → **Mitigation**: Clearly define which system owns assignment logic and configure integration settings accordingly. Test sync behavior thoroughly before go-live.

## 6. Success Metrics

- **Leading Indicator**: Speed-to-lead time under 5 minutes (from lead creation to rep assignment). Routing accuracy >95% (leads routed to correct rep on first assignment).

- **Lagging Indicator**: MQL-to-SQL conversion rate increase of 10-20% within 60 days. Reduction in lead leakage (orphaned or misrouted leads) to &lt;5%.

---

