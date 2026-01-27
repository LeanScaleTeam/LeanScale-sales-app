# GTM Lifecycle - Playbook

## 1. Definition

**What it is**: A foundational RevOps project that designs and implements the complete journey stages a lead or account travels from initial awareness through becoming a customer and beyond—with clear entry criteria, automated transitions, and date/time stamps configured in the CRM. This creates a shared language across marketing, sales, and customer success for measuring pipeline health and conversion rates.

**What it is NOT**: Not a lead scoring project (that's a separate optimization). Not a CRM migration or implementation (assumes CRM is already in place). Not a sales process redesign (focuses on lifecycle stages, not sales methodology). Not a marketing automation campaign setup.

## 2. ICP Value Proposition

**Pain it solves**: Sales and marketing can't agree on what "qualified" means. Marketing says they're sending good leads, sales says they're not. There's no visibility into where leads get stuck in the funnel, no way to calculate conversion rates between stages, and no accountability for handoff SLAs. Every leader has their own definition of MQL and SQL.

**Outcome delivered**: A unified, documented lifecycle framework implemented in CRM with automated stage transitions, entry criteria enforcement, and stage hit date stamps—enabling accurate conversion rate reporting, funnel velocity tracking, and cross-team accountability. All GTM teams work from the same definitions.

**Who owns it**: VP of Revenue Operations or Director of Marketing Operations (with input from VP Sales and VP Marketing)

## 3. Implementation Procedure

### Part 1: Assess Current State & Document Requirements

#### Step 1: Conduct Stakeholder Interviews

**Step Overview:** Meet with marketing, sales, and customer success leaders to understand their current lifecycle definitions and handoff processes. End state: Interview notes capturing each team's perspective on stage definitions and pain points.

- Schedule 30-45 minute interviews with VP Marketing, VP Sales, and CS leader
- Document each stakeholder's current understanding of lifecycle stages (MQL, SQL, SAL, etc.)
- Capture their definition of "qualified"—what makes a lead ready for handoff
- Identify where they see leads falling through the cracks or getting stuck
- Note any existing SLAs or handoff agreements (formal or informal)
- Document friction points between teams regarding lead quality or timing

#### Step 2: Audit Existing CRM Configuration

**Step Overview:** Review current CRM fields, picklist values, and automation rules related to lead/contact/account stages. End state: Technical inventory of all lifecycle-related fields and automation in the CRM.

- Pull list of all Lead Status and Contact Status picklist values from CRM
- Identify any Account-level lifecycle fields (e.g., Account Stage, Customer Status)
- Document existing automation rules that change lifecycle stages
- Review any validation rules that govern stage progression
- Check for existing date stamp fields (e.g., MQL Date, SQL Date)
- Note any duplicate or conflicting fields tracking similar data
- Export field dependencies and workflow rules for reference

#### Step 3: Establish Baseline Conversion Metrics

**Step Overview:** Pull historical data to calculate current conversion rates between stages. End state: Baseline metrics document showing stage-to-stage conversion rates and average time-in-stage.

- Pull lead volume by stage for last 90 days from CRM reports
- Calculate conversion rates: Lead-to-MQL, MQL-to-SQL, SQL-to-Opportunity, Opportunity-to-Closed Won
- Measure average time-in-stage for each lifecycle phase (if date stamps exist)
- Identify stages with highest drop-off rates
- Compare marketing's reported MQL numbers to sales' accepted SQL numbers
- Document any gaps in data (e.g., "no date stamps exist, velocity unmeasurable")

#### Step 4: Create Current State Assessment Document

**Step Overview:** Synthesize findings from interviews, CRM audit, and baseline metrics into a single assessment document. End state: Shareable document with gap analysis ready for stakeholder review.

- Summarize current lifecycle stage definitions (or lack thereof)
- Document misalignments between team definitions
- List baseline conversion metrics with data quality caveats
- Identify top 3-5 pain points and root causes
- Map gaps between current state and best practice lifecycle management
- Include recommendations for stage structure in next phase

---

### Part 2: Design Lifecycle Stage Framework

#### Step 1: Define Lifecycle Stages and Entry Criteria

**Step Overview:** Collaboratively define each lifecycle stage with clear, measurable entry criteria that all teams agree to. End state: Documented stage definitions with binary, objective entry criteria for each stage.

- Facilitate working session with marketing, sales, and CS stakeholders (60-90 min)
- Define standard stages: Subscriber, Lead, MQL, SQL/SAL, Opportunity, Customer, Churned
- Establish measurable entry criteria for each stage (e.g., "MQL = Lead Score >= 50 AND visited pricing page")
- Define exit criteria and what triggers backward movement (disqualification, recycling)
- Document responsible team for each stage (who owns it, who updates it)
- Ensure criteria are binary (yes/no) not subjective ("seems ready")
- Get verbal sign-off from each stakeholder on definitions

#### Step 2: Map Handoff Points and SLAs

**Step Overview:** Define explicit handoff points between teams with response time SLAs. End state: SLA document specifying handoff triggers and expected response times.

- Define MQL-to-Sales handoff trigger and SDR/AE response SLA (e.g., 4 hours)
- Define SQL acceptance/rejection process and required disposition
- Map Opportunity-to-CS handoff for closed-won deals
- Document what happens when a lead is recycled (back to nurture)
- Establish escalation path for SLA breaches
- Define who monitors SLA compliance and how often

#### Step 3: Design Date Stamp Fields and Velocity Tracking

**Step Overview:** Design the date stamp architecture to enable time-in-stage and velocity reporting. End state: Field specification document listing all date stamp fields to be created.

- List all date stamp fields needed (MQL Date, SQL Date, Opportunity Created Date, Closed Won Date, etc.)
- Define what triggers each date stamp (automation vs. manual)
- Determine if date stamps should reset on recycling (e.g., re-MQL date)
- Plan for historical backfill if possible (use existing dates for current records)
- Specify date format and field type in CRM
- Document how velocity will be calculated (e.g., days from MQL to SQL)

#### Step 4: Get Stakeholder Sign-Off on Design

**Step Overview:** Present the complete lifecycle design to decision-makers for formal approval. End state: Signed-off design document authorizing CRM build.

- Prepare lifecycle design presentation (stages, criteria, SLAs, date stamps)
- Schedule sign-off meeting with VP Marketing, VP Sales, and RevOps leader
- Walk through each stage definition and entry criteria
- Confirm SLA agreements are realistic and accepted
- Document any requested changes and update design
- Get formal approval (email or meeting notes) before proceeding to build

---

### Part 3: Configure CRM Lifecycle Infrastructure

#### Step 1: Create or Update Picklist Fields

**Step Overview:** Configure the lifecycle stage picklist field(s) in CRM with agreed-upon values. End state: Single source-of-truth picklist field for lifecycle stages on Lead, Contact, and/or Account objects.

- Create or update Lead Status picklist with approved stage values
- Create or update Contact Status picklist (if tracking at contact level)
- Consider Account-level lifecycle field for ABM motions
- Set default values for new records (e.g., "Subscriber" or "New Lead")
- Configure field-level security (who can edit, who is read-only)
- Add picklist to page layouts and ensure visibility for all users

#### Step 2: Build Automation Rules for Stage Transitions

**Step Overview:** Configure automation to move records between stages based on defined entry criteria. End state: Automation rules triggering stage changes when criteria are met.

- Build MQL trigger automation (e.g., when Lead Score >= 50 AND pricing page visited, set stage to MQL)
- Build SQL handoff automation (e.g., when SDR qualifies lead, set stage to SQL)
- Build Opportunity creation automation (e.g., when Opportunity created, update related Lead/Contact to "Opportunity" stage)
- Build Closed Won automation (e.g., when Opportunity closed won, set Account to "Customer" stage)
- Build recycling automation (e.g., when disqualified, set stage to "Recycled" or "Nurture")
- Test each automation in sandbox before deploying to production

#### Step 3: Configure Date Stamp Fields and Triggers

**Step Overview:** Create date fields for each lifecycle stage and automation to populate them. End state: Date stamp fields populated automatically on stage entry.

- Create date fields: MQL_Date__c, SQL_Date__c, Opportunity_Date__c, Closed_Won_Date__c, etc.
- Build automation to stamp date when stage changes (Process Builder, Flow, or Apex trigger)
- Decide handling for re-entry (overwrite date vs. preserve original)
- Configure first-touch date stamps where needed (First MQL Date if tracking re-MQLs)
- Test date stamps with sample records (advance stage, verify date populates)
- Backfill historical records if data exists (use Closed Date for Closed Won, etc.)

#### Step 4: Build Validation Rules for Stage Integrity

**Step Overview:** Create validation rules to prevent invalid stage changes or data quality issues. End state: Validation rules enforcing stage progression logic and data integrity.

- Build validation rule to prevent backward movement (e.g., can't go from SQL back to Lead without disposition)
- Require disposition reason when disqualifying or recycling leads
- Enforce required fields at certain stages (e.g., SQL requires Company Size and Budget Timeline)
- Prevent reps from manually overriding automated stage changes (if desired)
- Test validation rules to ensure they don't block legitimate use cases
- Document validation rules and error messages for user training

---

### Part 4: Build Reporting and Dashboards

#### Step 1: Create Conversion Rate Reports

**Step Overview:** Build reports showing stage-to-stage conversion rates for funnel analysis. End state: Conversion rate reports available to marketing, sales, and RevOps leaders.

- Build Lead-to-MQL conversion rate report (MQLs / Total Leads by period)
- Build MQL-to-SQL conversion rate report (SQLs / MQLs by period)
- Build SQL-to-Opportunity conversion rate report
- Build Opportunity-to-Closed Won win rate report
- Add filtering by lead source, campaign, rep, and time period
- Create report folders with appropriate sharing settings

#### Step 2: Build Velocity and Time-in-Stage Reports

**Step Overview:** Create reports showing average time records spend in each stage. End state: Velocity reports enabling funnel speed optimization.

- Build average time from Lead to MQL report (using date stamp fields)
- Build average time from MQL to SQL report
- Build average time from SQL to Closed Won report
- Add segmentation by lead source, deal size, and rep
- Identify outliers (leads stuck in stage > X days) for follow-up
- Create velocity trend report showing improvement over time

#### Step 3: Create Lifecycle Dashboard

**Step Overview:** Consolidate reports into a single dashboard for executive visibility. End state: Executive-ready dashboard showing funnel health and velocity metrics.

- Create dashboard with conversion rate charts by stage
- Add velocity metrics showing average time-in-stage
- Include volume metrics (leads entering each stage by week/month)
- Add leaderboard or breakdown by rep/team if applicable
- Configure dashboard refresh schedule (daily or real-time)
- Set dashboard visibility for marketing, sales, and CS leaders

---

### Part 5: Training and Rollout

#### Step 1: Create Lifecycle Documentation Package

**Step Overview:** Document the complete lifecycle framework for team reference. End state: Comprehensive documentation ready for training and ongoing reference.

- Write lifecycle stage definitions with entry/exit criteria
- Document which team owns each stage and their responsibilities
- Include screenshots of CRM fields and where to find them
- Create quick-reference card (one-pager) for reps
- Document SLAs and escalation paths
- Include FAQ section for common edge cases

#### Step 2: Conduct Marketing Team Training

**Step Overview:** Train marketing team on MQL criteria, automation triggers, and their responsibilities in the lifecycle. End state: Marketing team understands MQL definition and handoff process.

- Schedule 30-45 minute training session with marketing team
- Review MQL definition and entry criteria
- Explain automation triggers (what causes MQL status change)
- Walk through handoff to sales and SLA expectations
- Demonstrate where to view MQL conversion metrics
- Address questions and document edge cases raised

#### Step 3: Conduct Sales Team Training

**Step Overview:** Train sales team on SQL acceptance, stage update responsibilities, and how to use lifecycle data. End state: Sales team understands their role in lifecycle tracking.

- Schedule 30-45 minute training session with sales/SDR team
- Review SQL definition and acceptance criteria
- Explain what to do when receiving MQL handoff (accept, reject with reason)
- Demonstrate how to update stages in CRM correctly
- Show conversion rate reports and how to interpret them
- Address questions about recycling leads and edge cases

#### Step 4: Execute Rollout and Monitor Adoption

**Step Overview:** Go live with new lifecycle stages and monitor for issues during first week. End state: Lifecycle live in production with adoption tracking in place.

- Deploy all configuration changes to production (if not already done)
- Send announcement to all GTM teams with go-live date
- Monitor CRM for stage change activity in first 48 hours
- Check automation logs for errors or unexpected behavior
- Identify records stuck in limbo or incorrectly staged
- Address urgent issues same-day and document for refinement

---

### Part 6: Handoff and Optimization

#### Step 1: Conduct 30-Day Check-In Review

**Step Overview:** Review adoption metrics and gather feedback 30 days after go-live. End state: List of refinements needed based on real-world usage.

- Pull adoption metrics: stage changes per week, SLA compliance rates
- Compare conversion rates to pre-implementation baseline
- Interview sales and marketing leads on what's working and what's not
- Identify edge cases that aren't handled by current logic
- Document feedback for criteria adjustments or automation fixes
- Prioritize refinements based on impact

#### Step 2: Refine Stage Criteria and Automation

**Step Overview:** Make adjustments to stage criteria and automation based on 30-day feedback. End state: Optimized lifecycle logic addressing identified issues.

- Update entry criteria for any stages with definitional confusion
- Fix automation rules that are misfiring or missing cases
- Add handling for newly identified edge cases
- Update validation rules if they're blocking legitimate work
- Test changes in sandbox before deploying to production
- Communicate changes to affected teams

#### Step 3: Transfer Ownership and Close Project

**Step Overview:** Hand off lifecycle management to client RevOps team with documentation and admin access. End state: Client self-sufficient with lifecycle management.

- Transfer admin access and credentials to client RevOps lead
- Deliver final documentation package (design doc, training materials, runbooks)
- Review how to make future stage or criteria changes
- Provide troubleshooting guide for common issues
- Schedule optional 90-day follow-up if desired
- Close out project and archive deliverables

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM platform (Salesforce or HubSpot) is active with basic lead/contact records
- At least 6 months of historical deal data to establish baseline conversion rates
- Clear understanding of who owns the lead-to-opportunity handoff process
- Executive alignment that lifecycle standardization is a priority

**What client must provide:**
- CRM admin access for the LeanScale architect
- Availability of marketing, sales, and CS stakeholders for interviews (2-3 hours total)
- Decision-maker availability for stage definition sign-off
- List of current stage definitions (if any) and known pain points

**What LeanScale provides:**
- Lifecycle stage framework and best practice recommendations
- CRM configuration and automation build
- Documentation templates and training materials
- Conversion rate dashboard design

## 5. Common Pitfalls

- **Pitfall 1**: Teams define stages without clear, objective entry criteria (e.g., "MQL = marketing thinks they're ready") leading to inconsistent application and gaming of metrics. → **Mitigation**: Require every stage to have measurable, binary criteria (e.g., "MQL = Lead Score >= 50 AND has visited pricing page"). No subjective definitions allowed.

- **Pitfall 2**: Building lifecycle stages that stop at "Customer" and ignore post-sale stages like Onboarding, Adoption, and Expansion. → **Mitigation**: Design the full lifecycle from first touch through renewal/expansion, including customer success stages with clear health indicators.

- **Pitfall 3**: No stage hit date stamps configured, making it impossible to calculate time-in-stage or funnel velocity. → **Mitigation**: Create automation that stamps a date field every time a record enters a new stage (e.g., "MQL Date", "SQL Date", "Closed Won Date").

- **Pitfall 4**: Overly complex lifecycle with too many stages (10+), causing confusion and inconsistent usage. → **Mitigation**: Start with 5-7 core stages that map to clear handoff points. Add granularity only where it drives action or reporting value.

- **Pitfall 5**: No single owner for lifecycle governance, leading to definitional drift between teams over time. → **Mitigation**: Assign RevOps as the explicit owner of lifecycle definitions with quarterly review cadence.

## 6. Success Metrics

- **Leading Indicator**: All GTM stakeholders can articulate the entry criteria for each lifecycle stage consistently (verify in 30-day check-in); SLA compliance rate exceeds 85% within first month
- **Lagging Indicator**: Conversion rate visibility improves from "unknown" to trackable stage-to-stage metrics within 60 days; funnel velocity decreases by 10%+ as handoff friction is removed; stage-to-stage conversion variance decreases as teams align on definitions

---

