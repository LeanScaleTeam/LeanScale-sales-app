# Customer Lifecycle - Playbook

## 1. Definition

**What it is**: A strategic and technical project that designs and implements a customer lifecycle structure in the CRM, establishing clear stage definitions, automated transitions, and stage date/time stamps to track customers through their journey from onboarding through retention and expansion.

**What it is NOT**: Not a Customer Success Platform implementation (that's deploying Gainsight/ChurnZero). Not a Customer Health Score project (that's scoring methodology). Not a Renewal Management process (that's deal tracking for renewals). Not a Customer Onboarding project (that's implementation playbooks).

## 2. ICP Value Proposition

**Pain it solves**: CS and GTM leadership have no visibility into where customers are in their journey. There's no standardized definition of lifecycle stages, no automation moving customers between stages, and no timestamp data to measure time-in-stage or velocity. Teams can't answer basic questions like "how many customers are in onboarding?" or "what's our average time to value?"

**Outcome delivered**: A fully documented and automated customer lifecycle with clear stage definitions, entry/exit criteria, automated stage transitions, and timestamp tracking. Leadership gets a customer funnel view with velocity metrics and the ability to identify bottlenecks in the customer journey.

**Who owns it**: VP of Customer Success or RevOps Leader.

## 3. Implementation Procedure

### Part 1: Discovery & Requirements Gathering

#### Step 1: Conduct Stakeholder Interviews

**Step Overview:** Meet with CS, Sales, and GTM leadership to understand business objectives, current processes, and pain points with customer tracking. End state: Documented requirements and alignment on project goals.

- Schedule 30-45 min interviews with VP CS, CS Managers, RevOps, and Sales leadership
- Document current pain points (e.g., "we don't know how many customers are stuck in onboarding")
- Identify what decisions leadership wants to make with lifecycle data
- Understand existing customer journey documentation or tribal knowledge
- Capture any compliance or reporting requirements (board metrics, investor reporting)

#### Step 2: Audit Current Lifecycle Tracking

**Step Overview:** Assess the current state of customer lifecycle tracking in the CRM to establish baseline and identify gaps. End state: Gap analysis showing what's missing vs. ideal state.

- Pull current customer stage/status fields from CRM (Account Status, Customer Stage, etc.)
- Document which fields are being used and which are stale or inconsistent
- Check for existing date stamp fields (e.g., "Onboarding Start Date", "Go-Live Date")
- Review any existing automations that move customers between stages
- Compare current state against the diagnostic rubric (Red/Yellow/Green)

#### Step 3: Gather Existing Documentation

**Step Overview:** Collect any existing process documentation, playbooks, or definitions that inform the lifecycle design. End state: Complete inventory of existing materials to incorporate.

- Request CS playbooks, onboarding checklists, and renewal runbooks
- Collect any existing stage definitions or criteria (even if informal)
- Review CS tool configurations if Gainsight/ChurnZero/Catalyst is in place
- Document current reporting (what dashboards exist for customer funnel)
- Note gaps where documentation doesn't exist

---

### Part 2: Define Lifecycle Stages & Criteria

#### Step 1: Define Lifecycle Stage Structure

**Step Overview:** Design the customer lifecycle stages that will be tracked in the CRM, ensuring alignment with business processes. End state: Documented list of lifecycle stages with clear definitions.

- Define core stages (typical: New Customer, Onboarding, Adopting, Healthy/Mature, At-Risk, Churned)
- Ensure stages are mutually exclusive (customer can only be in one stage)
- Align stage names with terminology already used by CS team
- Validate stage structure with CS leadership before proceeding
- Document stage definitions in a shared reference doc

#### Step 2: Establish Entry & Exit Criteria

**Step Overview:** Define the specific criteria that determine when a customer enters and exits each lifecycle stage. End state: Documented entry/exit criteria for every stage transition.

- Define quantitative criteria where possible (e.g., "Onboarding Complete when product usage > X")
- Define qualitative criteria with clear ownership (e.g., "CSM marks onboarding complete")
- Ensure criteria are measurable and enforceable in the CRM
- Document which criteria trigger automatic vs. manual transitions
- Create decision tree or flowchart for stage transitions

#### Step 3: Define Date Stamp Requirements

**Step Overview:** Identify which date/time stamps need to be captured for each stage to enable velocity reporting. End state: List of date fields to create with naming conventions.

- Define "Stage Entry Date" fields for each lifecycle stage
- Determine if "Stage Exit Date" fields are also needed
- Establish naming convention (e.g., "Lifecycle_Onboarding_Start_Date__c")
- Identify which timestamps feed key metrics (Time to Value, Time in Onboarding)
- Document calculation logic for duration fields if needed

---

### Part 3: CRM Configuration & Automation

#### Step 1: Create Lifecycle Fields in CRM

**Step Overview:** Build the lifecycle stage field and all associated date stamp fields in the CRM. End state: All lifecycle fields created and visible on appropriate page layouts.

- Create picklist field for Customer Lifecycle Stage on Account object
- Create date fields for each stage entry timestamp
- Add fields to Account page layout in logical grouping
- Set field-level security to ensure appropriate access
- Document field API names for automation reference

#### Step 2: Build Stage Transition Automations

**Step Overview:** Configure automation rules that move customers between lifecycle stages based on defined criteria. End state: Automated transitions functioning for all stage changes.

- Build Flow/Process Builder (Salesforce) or Workflow (HubSpot) for each automatic transition
- Configure triggers based on entry criteria (e.g., Opportunity Closed Won triggers New Customer)
- Ensure automations populate date stamp fields when stage changes
- Build validation rules to prevent manual overrides of automated stages if needed
- Test each automation individually with sample records

#### Step 3: Configure Manual Transition Process

**Step Overview:** Set up the process for manual stage transitions where automation isn't appropriate. End state: Clear process for CSMs to manually update stages with guardrails.

- Identify which transitions require manual CSM action
- Build screen flow or guided action for CSM stage changes
- Include required fields (reason for transition, notes)
- Ensure manual transitions also populate date stamps
- Document the manual process for CS team reference

#### Step 4: Integrate with CS Platform (if applicable)

**Step Overview:** Connect lifecycle stages to Customer Success platform to ensure data flows between systems. End state: Bi-directional sync between CRM and CS platform.

- Map CRM lifecycle stages to CS platform stages (Gainsight/ChurnZero/etc.)
- Configure sync rules (which system is source of truth for which stages)
- Set up sync frequency and conflict resolution rules
- Test sync with sample records in both directions
- Document integration architecture for client ops team

---

### Part 4: Testing & Validation

#### Step 1: Test Lifecycle Transitions End-to-End

**Step Overview:** Validate that all stage transitions work correctly with real customer scenarios. End state: Confirmed that all transitions fire correctly and date stamps populate.

- Create test accounts representing each lifecycle stage
- Trigger each automated transition and verify stage changes
- Confirm date stamp fields populate correctly
- Test manual transitions via screen flow
- Document any bugs or edge cases found

#### Step 2: Validate Reporting Accuracy

**Step Overview:** Confirm that lifecycle data supports required reporting and metrics. End state: Reports showing accurate customer funnel and velocity metrics.

- Build test report showing customer count by lifecycle stage
- Build velocity report showing time-in-stage metrics
- Validate counts against manual spot-checks
- Test filters and groupings needed for leadership views
- Identify any data quality issues requiring cleanup

#### Step 3: Conduct User Acceptance Testing

**Step Overview:** Have CS team members test the lifecycle in their daily workflow to confirm usability. End state: Sign-off from CS team that lifecycle is ready for rollout.

- Select 2-3 CSMs for pilot testing
- Have them process 5-10 real customer transitions
- Gather feedback on usability and process clarity
- Address critical issues before full rollout
- Get formal sign-off from CS leadership

---

### Part 5: Training & Rollout

#### Step 1: Create Training Materials

**Step Overview:** Develop documentation and training content for the CS team on the new lifecycle. End state: Complete training package ready for delivery.

- Create one-pager with lifecycle stage definitions and criteria
- Build quick-reference guide for common scenarios
- Document FAQ for edge cases and exceptions
- Create short video walkthrough (3-5 min) of key processes
- Prepare training deck for live session

#### Step 2: Deliver Training to CS Team

**Step Overview:** Train the full CS team on lifecycle definitions, processes, and CRM usage. End state: All CSMs trained and comfortable with new lifecycle.

- Schedule 45-60 min training session with full CS team
- Walk through stage definitions and transition criteria
- Demonstrate CRM screens and automation in action
- Cover manual transition process and when to use it
- Record session for future onboarding of new CSMs

#### Step 3: Roll Out to Production

**Step Overview:** Activate the lifecycle for all customers and migrate existing customers to appropriate stages. End state: All customers assigned to lifecycle stages with baseline data.

- Run data migration to assign existing customers to current stage
- Backfill date stamps where historical data exists
- Activate all automations in production
- Communicate go-live to CS team
- Monitor for first 48 hours for issues

#### Step 4: Hand Off to Client

**Step Overview:** Transfer ownership of the lifecycle to client RevOps/CS Ops with full documentation. End state: Client self-sufficient to maintain and iterate on lifecycle.

- Deliver documentation package (stage definitions, automation logic, field reference)
- Transfer admin access and credentials
- Provide runbook for common maintenance tasks
- Schedule 30-day check-in to review adoption and metrics
- Close out project and capture lessons learned

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM admin access (Salesforce or HubSpot)
- Customer Success team with defined CS processes (even if informal)
- Clear definition of what "customer" means (closed won account, active subscription, etc.)
- Executive sponsor who can enforce adoption

**What client must provide:**
- Access to CS leadership and team members for interviews
- Existing process documentation (playbooks, onboarding checklists)
- Decision-making authority on stage definitions
- CS platform credentials if integration required (Gainsight, ChurnZero, etc.)
- Dedicated time from CSMs for training and UAT

## 5. Common Pitfalls

- **Pitfall 1**: Stages allow backward progression or skipping stages, causing inaccurate funnel data and broken velocity metrics. **Mitigation**: Build validation rules that enforce linear progression or require admin override for exceptions.

- **Pitfall 2**: No enforcement mechanism for manual transitions, so CSMs don't update stages and data becomes stale. **Mitigation**: Use guided screen flows that prompt CSMs during natural workflow moments, and include lifecycle stage in CS team metrics/accountability.

- **Pitfall 3**: Over-engineering with too many stages (8+) that create confusion and reduce adoption. **Mitigation**: Start with 4-6 core stages that match how CS actually thinks about customers; can always add granularity later.

- **Pitfall 4**: Disconnected systems where lifecycle exists in CRM but CS platform shows different stages. **Mitigation**: Establish single source of truth upfront and build bi-directional sync; document which system "wins" for each stage.

## 6. Success Metrics

- **Leading Indicator**: 100% of customers have a lifecycle stage assigned within 2 weeks of go-live; CSMs completing manual transitions without escalations
- **Lagging Indicator**: CS leadership using lifecycle funnel dashboard in weekly reviews; time-to-value metrics available for QBRs; reduction in "where is this customer?" questions

---

