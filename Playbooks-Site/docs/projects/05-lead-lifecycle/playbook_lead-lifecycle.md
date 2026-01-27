# Lead Lifecycle - Playbook

## 1. Definition

**What it is**: A strategic and technical implementation project that designs and deploys a lead lifecycle structure in the CRM with clearly defined stages, automated transitions, and timestamp tracking to monitor how leads move through the funnel from initial awareness to closed-won.

**What it is NOT**: Not lead scoring implementation (that's a separate rules-based project). Not lead routing/assignment (that's territory or round-robin logic). Not marketing automation setup (that's campaign/nurture configuration). Not CRM migration or data cleanup.

## 2. ICP Value Proposition

**Pain it solves**: Sales and marketing teams cannot measure conversion rates between funnel stages, leads get stuck in undefined statuses, and there is no visibility into how long leads take to progress. Marketing cannot prove ROI because they cannot track leads from MQL to closed-won. Teams argue about lead quality because there are no agreed-upon definitions.

**Outcome delivered**: A fully implemented lead lifecycle with documented stage definitions, automated stage transitions in the CRM, timestamp fields for each stage hit, and dashboards showing conversion rates and velocity between stages. Teams have shared visibility into the lead funnel.

**Who owns it**: VP of Marketing or RevOps Leader (with input from VP Sales on Sales Accepted criteria).

## 3. Implementation Procedure

### Part 1: Discovery and Current State Assessment

#### Step 1: Conduct Stakeholder Interviews

**Step Overview:** Meet with key stakeholders (marketing, sales, RevOps) to understand current pain points, business objectives, and how they conceptualize the lead funnel today. End state: Documented requirements and stakeholder alignment on project goals.

- Schedule 30-45 min interviews with VP Marketing, VP Sales, and RevOps lead
- Document how each team currently defines "qualified" leads and hand-off points
- Identify existing friction points in lead hand-offs between teams
- Gather any existing documentation on sales/marketing processes or SLAs
- Capture terminology preferences and any industry frameworks they reference (Forrester/SiriusDecisions, Winning by Design)

#### Step 2: Audit Current CRM Lead Data and Configuration

**Step Overview:** Assess how leads are currently tracked in the CRM, including existing status fields, automation rules, and data quality. End state: Gap analysis showing what exists vs. what's needed.

- Pull report of all leads by current status values (identify messy/inconsistent statuses)
- Document existing lead status picklist values and their definitions (if any)
- Check for existing automation rules that update lead status
- Identify if stage timestamp fields exist (e.g., MQL Date, SQL Date)
- Assess data quality: duplicate leads, leads with no status, leads stuck in limbo stages
- Quantify the gap (e.g., "60% of leads have no clear status, no timestamp tracking exists")

#### Step 3: Document Current State Process Map

**Step Overview:** Map the actual current lead flow from creation to closed-won (or disqualified), including all hand-off points and decision criteria. End state: Visual process map of current state with pain points identified.

- Create flowchart showing lead sources and entry points
- Map current hand-off triggers between marketing and sales
- Identify where leads fall through the cracks (common leakage points)
- Document manual processes that should be automated
- Flag inconsistencies between how different reps handle lead progression

---

### Part 2: Define Lead Lifecycle Stages and Criteria

#### Step 1: Design Stage Architecture

**Step Overview:** Define the lifecycle stages that leads will move through, aligned with industry best practices and stakeholder input. End state: Approved list of 5-7 lead stages with clear naming.

- Review industry frameworks (Forrester Demand Waterfall, Winning by Design Bowtie)
- Propose stage structure (e.g., New, Marketing Qualified, Sales Accepted, Working, Meeting Set, Opportunity Created, Disqualified)
- Limit stages to 5-7 maximum to avoid overcomplexity
- Ensure stages are action-oriented and measurable
- Present stage proposal to stakeholders for approval

#### Step 2: Document Stage Entry Criteria

**Step Overview:** Define the specific, objective criteria required for a lead to enter each stage. End state: Written criteria document that leaves no room for interpretation.

- Define MQL criteria (e.g., specific actions like demo request, content download + ICP fit)
- Define Sales Accepted criteria (e.g., ICP verified, valid contact info, budget timeline confirmed)
- Define Working/Engaged criteria (e.g., sales rep has made contact, discovery scheduled)
- Define Meeting Set criteria (e.g., confirmed meeting on calendar with decision-maker)
- Define Disqualified criteria and sub-reasons (bad fit, no budget, competitor, bad data)
- Get sign-off from both marketing and sales leadership on criteria

#### Step 3: Establish Stage Transition Rules

**Step Overview:** Define what triggers a lead to move from one stage to the next, including both automated triggers and manual updates. End state: Documented transition logic ready for CRM configuration.

- Map which transitions should be automated (e.g., form submission triggers MQL)
- Map which transitions require manual rep action (e.g., Sales Accepted after review)
- Define time-based rules (e.g., auto-disqualify after 90 days of no activity)
- Document reverse transitions (e.g., Working back to Nurture if discovery cancelled)
- Specify what data updates are required at each transition (fields to populate)

---

### Part 3: CRM Implementation and Integration

#### Step 1: Create Lead Status Fields and Picklist Values

**Step Overview:** Configure the CRM with the defined lead status picklist and any supporting fields. End state: Lead Status field updated with new values, old values deprecated.

- Create or update Lead Status picklist with approved values
- Add Lead Stage field if using stage vs. status distinction
- Create "Previous Status" field for transition tracking (optional)
- Deprecate or merge old status values (create mapping for data migration)
- Test field visibility across user profiles

#### Step 2: Create Stage Timestamp Fields

**Step Overview:** Build timestamp fields to capture when leads enter each stage, enabling velocity and time-in-stage reporting. End state: Date/time fields for each stage that auto-populate on transition.

- Create date/time field for each stage (e.g., MQL_Date__c, SAL_Date__c, SQL_Date__c)
- Create formula fields for time-in-stage calculations (e.g., Days_in_MQL__c)
- Consider creating a "First Stage Hit" vs. "Most Recent Stage Hit" distinction
- Test timestamp field updates in sandbox
- Document field API names for reporting and integration use

#### Step 3: Build Automation Rules for Stage Transitions

**Step Overview:** Configure automation (Salesforce Flow, HubSpot Workflows) to automatically update lead status and timestamp fields based on defined triggers. End state: Automated transitions working for all defined trigger scenarios.

- Build automation for inbound lead creation (source-based initial status)
- Build automation for MQL qualification (form submissions, lead score threshold)
- Build automation for time-based transitions (stale lead disqualification)
- Build automation for timestamp population on each stage change
- Configure notifications/alerts for sales on key transitions (new MQL assigned)
- Test all automation paths with sample records

#### Step 4: Integrate Marketing Automation Platform

**Step Overview:** Ensure lead status and lifecycle data syncs correctly between CRM and marketing automation platform. End state: Bidirectional sync working with no data conflicts.

- Map CRM Lead Status field to MAP lifecycle stage field
- Configure sync direction for each field (CRM-wins vs. MAP-wins)
- Set up sync filters to prevent bad data from syncing
- Test sync with new leads and status changes
- Document sync logic for future troubleshooting

---

### Part 4: Validation, Training, and Rollout

#### Step 1: Test Lifecycle Implementation with Pilot Group

**Step Overview:** Run the new lifecycle with a small group of leads and reps to validate all transitions, automations, and reporting work correctly. End state: Pilot validated with issues identified and resolved.

- Select 50-100 leads across various stages for pilot testing
- Assign 2-3 reps to work pilot leads using new lifecycle
- Monitor for automation failures or unexpected behavior
- Gather rep feedback on usability and stage definitions
- Fix issues identified during pilot before full rollout

#### Step 2: Build Lifecycle Reporting and Dashboards

**Step Overview:** Create reports and dashboards showing lead funnel metrics, conversion rates, and velocity. End state: Live dashboard accessible to sales and marketing leadership.

- Build conversion rate report (MQL to SAL, SAL to SQL, SQL to Opp, Opp to CW)
- Build velocity report (average days in each stage)
- Build volume report (leads by stage over time)
- Build leakage report (disqualified leads by reason)
- Create executive dashboard with key lifecycle KPIs
- Set up scheduled report delivery to leadership

#### Step 3: Train Sales and Marketing Teams

**Step Overview:** Train all users on the new lifecycle stages, definitions, and their responsibilities for updating lead status. End state: All users trained and reference documentation delivered.

- Schedule 30-45 min training session for sales team
- Schedule 30-45 min training session for marketing team
- Cover: stage definitions, transition criteria, how to update status, what's automated
- Create quick-reference guide (1-pager) for reps
- Create FAQ document addressing common scenarios
- Record training session for future onboarding

#### Step 4: Rollout and Handoff to Client

**Step Overview:** Deploy the lifecycle to all users, transition ownership to client RevOps, and establish ongoing governance process. End state: Client self-sufficient with documentation and governance cadence.

- Communicate go-live to all users with key changes summary
- Deprecate old status values (lock down or remove after transition period)
- Deliver complete documentation package (stage definitions, automation logic, troubleshooting)
- Transfer admin access and credentials to client RevOps
- Establish quarterly review cadence to revisit stage definitions
- Schedule 30-day check-in to address post-go-live questions

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce or HubSpot) with admin access
- Marketing automation platform connected to CRM
- Existing lead data in the system (even if messy)
- Access to sales and marketing leadership for interviews

**What client must provide:**
- Admin credentials for CRM and marketing automation platform
- List of stakeholders for interviews (VP Sales, VP Marketing, RevOps)
- Any existing process documentation or SLAs between sales and marketing
- Access to CRM sandbox for testing (if available)
- Decision-making authority on stage definitions

## 5. Common Pitfalls

- **Overcomplicating with too many stages**: Companies often create 10+ stages that become impossible to track and confuse reps. **Mitigation**: Limit to 5-7 stages maximum. Each stage should represent a meaningful conversion point.

- **Sales and marketing disagreement on MQL definition**: Teams argue endlessly about what "qualified" means, stalling the project. **Mitigation**: Get both VPs in the same room during Step 2 of Part 2. Document agreed criteria and get written sign-off before building anything.

- **Missing timestamp fields**: The lifecycle gets built but without timestamp tracking, making velocity reporting impossible. **Mitigation**: Build timestamp fields as a required step (Part 3, Step 2), not an afterthought.

- **Poor user adoption after go-live**: Reps ignore the new stages and continue using old habits because the process feels cumbersome. **Mitigation**: Involve 2-3 reps in pilot testing to get buy-in, automate as much as possible so reps don't have to manually update status, and use training to explain the "why" behind the changes.

## 6. Success Metrics

- **Leading Indicator**: 90%+ of leads have a valid lifecycle status within 30 days of go-live (no blank or deprecated status values)
- **Lagging Indicator**: Ability to report on MQL to Opportunity conversion rate with 95%+ data accuracy at the 60-day mark

---

