# Opportunity Management UX Improvements - Playbook

## 1. Definition

**What it is**: A CRM optimization project that redesigns the opportunity page layout, streamlines data entry workflows, and improves visual hierarchy to reduce friction for sales reps managing their pipeline. The goal is to make opportunity updates fast, intuitive, and valuable to the rep - not just management.

**What it is NOT**: Not a full Salesforce implementation or migration. Not a sales process redesign (stages, qualification criteria). Not a reporting/dashboard project. Not CPQ configuration (that's a separate project). Not a training-only initiative without configuration changes.

## 2. ICP Value Proposition

**Pain it solves**: Sales reps avoid updating opportunities because the CRM is cluttered, requires too many clicks, and feels like busywork rather than a sales tool. Studies show 50% of sales leaders say their CRM is difficult to use, and reps spend up to an hour daily on manual data entry. Organizations with over-engineered validation rules see reps resort to Excel for forecasting, destroying data quality. Nearly 79% of B2B deals stall due to poor opportunity management.

**Outcome delivered**: An optimized opportunity experience where reps can update deals in under 2 minutes, see only relevant fields, and get value back (insights, guided selling) from the system. Companies with structured opportunity management see 33% higher performance, 23% improvement in forecast accuracy, and 32% improvement in deal velocity.

**Who owns it**: VP of Sales or RevOps Leader (owns CRM adoption and data quality)

## 3. Implementation Procedure

### Part 1: Assess Current State & Gather Requirements

#### Step 1: Audit Current Opportunity Page Layouts

**Step Overview:** Document all visible fields, sections, and related lists across each opportunity record type. End state: Complete inventory of current layout configuration with field counts and section structure.

- Export list of all opportunity page layouts and their profile assignments from Setup
- Screenshot or document each page layout section by section (top to bottom)
- Count total fields per layout and identify fields above vs. below the fold
- Document all related lists displayed and their column configurations
- Note any dynamic forms, conditional visibility rules, or record type variations
- Map which profiles/roles use which page layouts

#### Step 2: Analyze Field Usage Data

**Step Overview:** Pull quantitative data on field completion rates to identify unused or underutilized fields. End state: Field usage report showing completion percentages for every opportunity field.

- Run Salesforce Optimizer or install Field Trip app to analyze field usage
- Pull field completion rates for all opportunity fields over last 90-180 days
- Flag fields with &lt;10% completion rate as candidates for removal
- Identify fields with >80% identical values (potential for defaults)
- Cross-reference low-usage fields with active reports and dashboards
- Export findings to spreadsheet for prioritization in next step

#### Step 3: Conduct Rep Friction Interviews

**Step Overview:** Interview 3-5 sales reps to identify workflow pain points, unused fields, and time wasters. End state: Qualitative feedback summary with prioritized list of rep frustrations.

- Schedule 30-minute interviews with 3-5 reps across different roles/tenures
- Ask structured questions: "Walk me through updating an opp after a call"
- Count clicks required for common actions (stage change, close date update, add note)
- Identify which fields reps skip or fill with placeholder data
- Document any workarounds reps use (notes in wrong fields, external trackers)
- Capture wish-list items: "What would make this faster?"

#### Step 4: Document Baseline Metrics

**Step Overview:** Capture current-state metrics to enable ROI measurement post-implementation. End state: Baseline metrics document with time-to-update, data completeness, and satisfaction scores.

- Measure average time to complete a full opportunity update (observe 3-5 reps)
- Calculate data completeness rate for key fields (Amount, Close Date, Next Step)
- Survey reps on CRM satisfaction (simple 1-5 scale, 3-5 questions)
- Pull opportunity update frequency from Activity History
- Document current validation rule count and error frequency
- Save all baseline metrics in assessment document for comparison

---

### Part 2: Design Optimized Layouts

#### Step 1: Prioritize Fields and Create Layout Blueprint

**Step Overview:** Design the new field hierarchy based on usage data and rep feedback. End state: Layout blueprint document showing field placement decisions and rationale.

- Categorize fields into: Must-Have (top), Should-Have (middle), Archive (bottom)
- Apply the "8 out of 10" rule: if a field isn't used on 80% of records, move it down
- Group related fields into logical sections (Deal Details, Contact Info, Forecasting)
- Decide which fields to remove entirely vs. archive in collapsed section
- Document rationale for each field placement decision
- Get stakeholder sign-off on proposed field hierarchy before building

#### Step 2: Configure Compact Layouts

**Step Overview:** Set up compact layouts to display the 5 most critical fields in record highlights. End state: Compact layouts configured showing Amount, Stage, Close Date, Next Step, and Owner.

- Navigate to Object Manager > Opportunity > Compact Layouts
- Create new compact layout with top 5 fields (Amount, Stage, Close Date, Next Step, Owner)
- Assign compact layout to appropriate record types
- Test compact layout appears correctly in record highlights and related lists
- Verify mobile display shows correct compact layout fields

#### Step 3: Design Quick Actions for Common Tasks

**Step Overview:** Create quick actions that reduce clicks for frequent rep activities. End state: 3-4 quick actions configured for log activity, update stage, schedule follow-up.

- Identify 3-4 most common rep actions from interview findings
- Create Quick Action: "Log Activity" with minimal required fields
- Create Quick Action: "Update Stage" with stage picklist and next step
- Create Quick Action: "Schedule Follow-up" with date picker and activity type
- Configure action layouts with only essential fields (no clutter)
- Test each quick action in sandbox to verify smooth workflow

---

### Part 3: Build & Configure in Sandbox

#### Step 1: Build Optimized Page Layouts

**Step Overview:** Create new page layouts in sandbox with streamlined field groupings and section organization. End state: New page layouts built with reduced fields, logical sections, and clean visual hierarchy.

- Clone existing page layout as starting point (preserve audit trail)
- Remove fields flagged for removal (verify not breaking reports first)
- Reorganize sections following blueprint (Deal Details first, Archive last)
- Set section properties (columns, collapsible sections for less-used fields)
- Add Quick Actions to page layout action bar
- Configure related lists (Activities, Contacts, Products) with relevant columns only

#### Step 2: Configure Sales Path with Stage Guidance

**Step Overview:** Set up Sales Path with stage-specific guidance fields and key activities. End state: Sales Path enabled with coaching tips, key fields, and celebration confetti.

- Enable Sales Path in Setup if not already active
- Create new Sales Path for primary opportunity record type
- For each stage, add: stage definition, 2-3 key activities, exit criteria
- Configure Key Fields to display (up to 5 fields per stage)
- Enable Success celebration for Closed Won stage
- Test path progression and verify guidance displays correctly

#### Step 3: Set Up Kanban Board View

**Step Overview:** Configure Kanban view for visual pipeline management with drag-and-drop. End state: Kanban view available in Lightning App Builder for pipeline visualization.

- Create new List View filtered for current user's opportunities
- Enable Kanban view for the list view
- Configure Kanban to summarize by Stage with Amount rollup
- Test drag-and-drop functionality for stage changes
- Verify any required fields prompt correctly when moving stages
- Add Kanban view to relevant Lightning app pages

#### Step 4: Test with Pilot Users

**Step Overview:** Validate new layouts with 2-3 pilot users and iterate based on feedback. End state: Pilot-tested configuration ready for production deployment.

- Grant sandbox access to 2-3 selected pilot users
- Have pilots complete 3-5 realistic opportunity update scenarios
- Observe pilots and time task completion (compare to baseline)
- Gather structured feedback: what works, what's confusing, what's missing
- Iterate on layout based on pilot findings (adjust field order, fix issues)
- Document any changes made during pilot phase

---

### Part 4: Deploy & Enable the Team

#### Step 1: Deploy to Production

**Step Overview:** Move optimized layouts from sandbox to production with rollback plan. End state: New layouts live in production with successful deployment verification.

- Schedule deployment during low-activity window (early morning or weekend)
- Document rollback procedure (page layout assignments to revert)
- Deploy using Change Set or Metadata API (page layouts, quick actions, Sales Path)
- Verify deployment by spot-checking 3-5 opportunity records
- Test quick actions and Sales Path function correctly in production
- Monitor for immediate issues in first 2 hours post-deployment

#### Step 2: Conduct Team Training Session

**Step Overview:** Train sales team on new layout, quick actions, and Kanban view with live demo. End state: Team trained with recording available for future reference.

- Schedule 30-minute live training session (Zoom or in-person)
- Demo new layout: walk through a complete opportunity update
- Show quick actions: how to log activity and update stage in 2 clicks
- Demonstrate Kanban view: drag-and-drop stage updates
- Highlight Sales Path: stage guidance and celebration
- Record session and share with team + absent members

#### Step 3: Create Quick Reference Documentation

**Step Overview:** Deliver visual quick reference guide for ongoing support. End state: PDF or Salesforce Help article with screenshots and common workflows.

- Create 1-2 page quick reference guide with annotated screenshots
- Include: key field locations, how to use quick actions, Kanban instructions
- Add troubleshooting FAQ (3-5 common questions)
- Upload to Salesforce Files or internal knowledge base
- Pin link in team Slack channel or email to all reps
- Consider in-app guidance using Salesforce Walk-Throughs (optional)

#### Step 4: Establish Adoption Champion

**Step Overview:** Identify and enable a sales champion to drive peer adoption. End state: Champion identified, briefed, and actively supporting team during rollout.

- Select one tech-savvy, respected rep as adoption champion
- Brief champion 1-2 days before team launch with extra detail
- Provide champion with FAQ document and escalation path
- Have champion available on Slack to answer peer questions week 1-2
- Check in with champion daily during first week for issue identification
- Recognize champion's contribution to team

---

### Part 5: Validate & Optimize

#### Step 1: Monitor Post-Launch Adoption Metrics

**Step Overview:** Track adoption and usage metrics for 30 days post-launch. End state: Adoption dashboard showing usage trends and issue areas.

- Pull opportunity update frequency compared to pre-launch baseline
- Check quick action usage in Setup > Quick Action Audit
- Monitor validation rule error rates (should decrease)
- Track average time to update opportunity (survey or observe)
- Identify any fields with declining completion rates
- Document any support tickets or Slack questions related to changes

#### Step 2: Gather Structured Feedback

**Step Overview:** Collect rep feedback at 30-day mark to identify refinements. End state: Feedback summary with prioritized enhancement requests.

- Send quick survey (5 questions max) to all reps at day 30
- Ask: satisfaction score, time saved, remaining friction points
- Schedule optional 15-minute feedback calls with willing reps
- Compile feedback into themes and prioritize by impact
- Share feedback summary with RevOps and Sales leadership
- Identify quick wins vs. backlog items for future iterations

#### Step 3: Implement Refinements and Hand Off

**Step Overview:** Make minor adjustments based on feedback and transfer ownership to client. End state: Final refinements deployed, documentation updated, and client self-sufficient.

- Implement top 2-3 quick-win refinements from feedback
- Update documentation to reflect any post-launch changes
- Transfer admin credentials and documentation to client RevOps
- Deliver final metrics comparison (before vs. after)
- Schedule 90-day check-in to review lagging indicators
- Close out project with success summary

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Salesforce Lightning Experience enabled (not Classic)
- Admin access to Salesforce Setup (Page Layouts, Lightning App Builder, Quick Actions)
- Defined opportunity stages and sales process already in place
- At least 6 months of opportunity data to analyze field usage patterns
- Sandbox environment for building and testing changes

**What client must provide:**
- Access to 3-5 sales reps for interviews (30 min each)
- List of opportunity record types in use
- Current opportunity page layout assignments by profile
- Sales leadership sign-off on layout changes
- List of active reports/dashboards using opportunity fields (to avoid breaking)

## 5. Common Pitfalls

- **Pitfall 1**: Removing fields that reps don't use without checking if leadership/reporting needs them → **Mitigation**: Cross-reference field usage with active reports and dashboards before removing; create "Archive" section at bottom for rarely-used but required fields

- **Pitfall 2**: Over-engineering with too many validation rules (orgs with 20+ rules see reps abandon CRM for Excel) → **Mitigation**: Limit validation rules to critical-path fields only; prioritize usability over data enforcement; remove friction to eliminate excuses for non-adoption

- **Pitfall 3**: Launching without adequate training, leading reps to struggle with new interface → **Mitigation**: Use in-app guidance (Sales Path, field-level help text), provide visual quick reference guide, schedule live training with recording

- **Pitfall 4**: Not measuring baseline metrics before changes, making ROI impossible to prove → **Mitigation**: Capture time-to-update, data completeness, and rep satisfaction BEFORE deploying changes; compare at 30 and 90 days

- **Pitfall 5**: Creating too many record types when page layouts would suffice → **Mitigation**: Use record types only when process is vastly different or access rights vary; use page layouts for profile-specific field visibility

## 6. Success Metrics

- **Leading Indicator**: Pilot user feedback positive (4/5+ satisfaction), reps complete test opportunity updates in &lt;2 minutes during training, quick action usage visible in audit logs within first week

- **Lagging Indicator**: 30-day post-launch metrics show 20%+ improvement in opportunity data completeness, reduction in average clicks per update, positive shift in rep CRM satisfaction survey scores, decreased validation rule error frequency

---

