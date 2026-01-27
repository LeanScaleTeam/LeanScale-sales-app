# Sales Lifecycle (GTM Lifecycle) - Playbook

## 1. Definition

**What it is**: A strategic and technical implementation project that designs and builds an opportunity stage or deal lifecycle structure in your CRM, complete with clear stage definitions, entry/exit criteria, automations, and stage date/timestamp tracking to enable visibility into how deals move through the sales funnel.

**What it is NOT**: Not a lead lifecycle/scoring project (that focuses on MQL/SQL definitions). Not a forecasting methodology project (that's about probability and commit categories). Not a sales process redesign (this assumes the sales process exists and needs CRM representation).

## 2. ICP Value Proposition

**Pain it solves**: Sales and GTM leadership lack visibility into where deals actually are in the pipeline. Stages are inconsistently used, have no clear definitions, and reps pick stages randomly. No timestamp data exists to measure sales velocity or identify where deals stall.

**Outcome delivered**: A fully documented opportunity lifecycle with clear entry/exit criteria for each stage, automated stage progression where appropriate, timestamp fields capturing when opportunities hit each stage, and dashboards showing pipeline velocity and stage conversion rates.

**Who owns it**: VP of Sales Operations or RevOps Leader, with input from VP Sales and Sales Management.

## 3. Implementation Procedure

### Part 1: Discovery & Current State Assessment

#### Step 1: Conduct Stakeholder Interviews

**Step Overview:** Interview key stakeholders to understand business objectives, current sales process, and pain points with existing lifecycle tracking. End state: Documented understanding of how the sales team currently works and what visibility gaps exist.

- Schedule 30-45 minute interviews with VP Sales, Sales Managers, and 2-3 top-performing reps
- Document how deals currently progress from creation to close (their mental model)
- Identify pain points: Where do reps get confused about stages? Where do deals stall?
- Understand what reports/visibility leadership currently lacks
- Capture any existing stage definitions or documentation (often informal or tribal knowledge)
- Note which CRM (Salesforce or HubSpot) and current opportunity object configuration

#### Step 2: Audit Current Opportunity Data

**Step Overview:** Pull reports on existing opportunity data to understand current usage patterns and data quality issues. End state: Quantified baseline of current stage usage, stagnation rates, and data gaps.

- Export opportunity report showing all stages, time in stage, and conversion rates for last 6 months
- Identify stages with high stagnation (opportunities sitting 30+ days without movement)
- Document which stage fields exist (picklist values, date fields, probability mappings)
- Check for existing stage timestamp fields (Stage Hit Date fields) and their population rates
- Assess data quality: percentage of opps with blank required fields, inconsistent stage usage
- Create a "before" snapshot for comparison after implementation

#### Step 3: Document Current vs. Desired State

**Step Overview:** Synthesize interview findings and data audit into a gap analysis. End state: Clear documentation of what exists today versus what the ideal lifecycle looks like.

- Map current stages against actual sales process milestones
- Identify stages that are "catch-all buckets" with no clear meaning
- Document missing stages that would improve pipeline visibility
- List automation gaps (manual stage changes that should be automated)
- Quantify the visibility problem (e.g., "No way to measure average days in Proposal stage")

---

### Part 2: Design Lifecycle Stages & Criteria

#### Step 1: Define Opportunity Stages and Entry Criteria

**Step Overview:** Design the complete set of opportunity stages with clear, documented entry and exit criteria for each. End state: Written stage definitions that everyone on the team can understand and apply consistently.

- Define 5-8 opportunity stages aligned to actual sales milestones (avoid generic names like "Evaluation")
- Use process-specific naming (e.g., "Demo Scheduled", "Demo Completed", "Proposal Sent", "Contract Negotiation")
- Write 2-3 bullet entry criteria for each stage (what must be true to enter this stage)
- Define exit criteria where relevant (what triggers move to next stage)
- Assign probability percentages to each stage for forecasting purposes
- Review with VP Sales and get sign-off before implementation

#### Step 2: Design Stage Date Timestamp Fields

**Step Overview:** Determine which stage date fields are needed to track when opportunities hit each stage. End state: Field specification for all timestamp fields to be created in CRM.

- Identify which stages need dedicated timestamp fields (typically all stages except Closed Lost/Won)
- Define field naming convention (e.g., "Stage Hit Date - Discovery", "Stage Hit Date - Proposal")
- Determine whether to track first entry date only or also track re-entry
- Specify field type (Date vs. DateTime) based on reporting needs
- Document which fields should be auto-populated vs. editable

#### Step 3: Plan Automation Rules

**Step Overview:** Design the automation logic for stage transitions and field updates. End state: Documented automation specification ready for CRM implementation.

- Identify which stage transitions should be automated (e.g., meeting booked triggers stage change)
- Define validation rules to prevent skipping stages or backward movement without approval
- Specify workflow/process builder logic for timestamp field population
- Plan automation for probability updates when stage changes
- Document edge cases: what happens when opp is reopened from Closed Lost?

---

### Part 3: CRM Implementation & Configuration

#### Step 1: Configure Opportunity Stage Picklist

**Step Overview:** Update the opportunity stage picklist in CRM to reflect the new lifecycle design. End state: CRM opportunity stage field updated with new values and old values either removed or mapped.

- Create new stage values in Salesforce/HubSpot opportunity object
- Set default probability percentages for each stage
- Map existing opportunities to new stages (create migration plan for in-flight deals)
- Remove or archive deprecated stage values
- Update any Sales Process / Record Type associations in Salesforce
- Configure stage order for proper pipeline visualization

#### Step 2: Create Stage Timestamp Fields and Automation

**Step Overview:** Build the timestamp fields and automation to populate them. End state: All stage date fields created and auto-populating when opportunities change stages.

- Create custom date fields for each stage timestamp
- Build workflow rules or Process Builder flows to set timestamp on stage entry
- Configure logic to prevent timestamp overwrite (only set if blank)
- Test automation with sample opportunity through all stages
- Verify timestamp fields appear in opportunity page layout

#### Step 3: Set Up Validation and Required Fields

**Step Overview:** Implement validation rules to enforce stage criteria and data quality. End state: Reps cannot advance stages without meeting entry requirements.

- Create validation rules requiring key fields before stage advancement
- Configure required field logic (e.g., "Close Date" required for Negotiation stage)
- Set up path/guidance for each stage in Salesforce Lightning or HubSpot deal properties
- Balance enforcement with usability - avoid over-complicating and frustrating reps
- Test validation rules with sales team member before full deployment

#### Step 4: Build Pipeline and Velocity Dashboards

**Step Overview:** Create dashboards that visualize pipeline health and stage velocity. End state: Leadership has real-time visibility into pipeline progression and bottlenecks.

- Build pipeline stage distribution chart (count and value by stage)
- Create stage conversion rate report (what % move from Stage A to B)
- Build "time in stage" report showing average days per stage
- Create stagnation alert report (opps stuck in stage 14+ days)
- Add dashboards to Sales Manager homepage
- Configure scheduled dashboard email to leadership

---

### Part 4: Testing, Training & Rollout

#### Step 1: Pilot Test with Small User Group

**Step Overview:** Test the new lifecycle with a small group of reps before full rollout. End state: Validated that the lifecycle works in practice and any issues are identified.

- Select 3-5 reps for pilot group (mix of tenures and skill levels)
- Have pilot reps process 5-10 opportunities through full lifecycle
- Observe and note any confusion, friction, or workaround behaviors
- Collect feedback on stage definitions, validation rules, and usability
- Adjust configuration based on pilot findings before full rollout

#### Step 2: Conduct Sales Team Training

**Step Overview:** Train the full sales team on the new opportunity lifecycle and stage definitions. End state: All reps understand how to correctly stage opportunities and why it matters.

- Schedule 45-60 minute training session (live or recorded)
- Cover: stage definitions, entry criteria, what happens when you change stage
- Demonstrate how timestamp data enables velocity reporting
- Show reps what reports/dashboards they can now access
- Create quick-reference guide (1-page PDF of stages and criteria)
- Record session and distribute to team with reference materials

#### Step 3: Hand Off to Client and Establish Governance

**Step Overview:** Transfer ownership of the lifecycle to client RevOps and establish ongoing governance. End state: Client is self-sufficient with documentation, admin access, and change management process.

- Transfer admin documentation (field specifications, automation logic, dashboard filters)
- Train client RevOps on how to modify stages, update automations, add new fields
- Establish change request process (how to request lifecycle modifications)
- Define data hygiene cadence (weekly pipeline review for stagnant opps)
- Schedule 30-day check-in to review adoption and answer questions
- Close out project with final deliverables summary

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce or HubSpot) with opportunities/deals object in use
- Defined sales process (even if informal) that maps to stages
- Admin access to CRM for configuration changes
- At least 3 months of historical opportunity data for baseline

**What client must provide:**
- Access to VP Sales and 2-3 sales reps for interviews
- List of current opportunity stage values and any existing documentation
- Decision authority for stage definitions (who approves final design)
- Time commitment from 3-5 reps for pilot testing
- Agreement to enforce new lifecycle (management accountability)

## 5. Common Pitfalls

- **Over-complicating with too many stages**: More stages means more confusion and lower adoption. Reps will randomly select stages if there are too many options. **Mitigation**: Limit to 5-8 stages maximum; each stage must represent a meaningful sales milestone.

- **Generic stage names with no clear criteria**: Stages like "Evaluation" or "Solution Validation" become catch-all buckets where deals stagnate. **Mitigation**: Use process-specific names (e.g., "Demo Completed", "Proposal Sent") and require 2-3 specific entry criteria for each stage.

- **Ignoring usability for data purity**: Making the system too rigid with excessive validation rules frustrates reps and leads to workarounds or garbage data. **Mitigation**: Balance enforcement with usability; only require fields that are truly needed for stage advancement.

- **No governance after go-live**: Without ongoing attention, stage definitions drift, new stages get added haphazardly, and data quality degrades. **Mitigation**: Establish a change request process and assign a lifecycle owner responsible for maintaining integrity.

## 6. Success Metrics

- **Leading Indicator**: Stage adoption rate - 95%+ of new opportunities have all timestamp fields populated within 30 days of go-live, and pipeline review meetings reference the new stages consistently.
- **Lagging Indicator**: 15-25% improvement in pipeline velocity (reduced average days to close) within 60-90 days, plus measurable reduction in opportunities stagnating in mid-funnel stages.

---

