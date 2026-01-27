# Sales to CS Handoff Process Implementation - Playbook

## 1. Definition

**What it is**: A process design and automation project that creates a standardized, CRM-integrated handoff workflow between Sales and Customer Success teams. The deliverable is a documented process with automated triggers, required data fields, and clear ownership transitions that ensure CS teams receive full customer context before onboarding begins.

**What it is NOT**: Not a Customer Success Platform implementation (that's CS tooling setup). Not an onboarding workflow project (that's post-handoff). Not a CRM customization project (handoff is one workflow, not full CRM rebuild). Not sales process redesign (focuses only on the transition point).

## 2. ICP Value Proposition

**Pain it solves**: CS teams start customer relationships with incomplete context because Sales captured information informally or in scattered notes. Customers repeat their goals and pain points to multiple people, eroding trust. Time to first value suffers because CS wastes the first 2-3 weeks gathering information that Sales already knew.

**Outcome delivered**: Standardized handoff checklist with required fields that must be completed before deal closes. Automated handoff notifications trigger CS engagement within 24 hours of close. CS begins onboarding with full context on customer goals, stakeholders, risks, and scope. Handoff completion rate tracked and visible to leadership.

**Who owns it**: VP of Customer Success or RevOps Leader (requires cross-functional authority).

## 3. Implementation Procedure

### Part 1: Assess Current State & Define Handoff Criteria

#### Step 1: Audit Current Handoff Process

**Step Overview:** Document how Sales-to-CS handoffs happen today, including informal practices. End state: Gap analysis showing what information is captured, what's missing, and where handoffs fail.

- Interview 3-5 Sales reps on how they currently hand off accounts
- Interview 3-5 CSMs on what context they receive vs. what they need
- Review last 10-15 closed deals to assess data completeness in CRM
- Document current handoff timing (when does CS first engage?)
- Identify recurring pain points (e.g., missing stakeholder info, unclear goals)
- Quantify impact: average time CS spends gathering info post-close

#### Step 2: Define Handoff Trigger Criteria

**Step Overview:** Establish the specific conditions that trigger the handoff process. End state: Documented trigger criteria agreed upon by Sales and CS leadership.

- Define the deal stage that initiates handoff (e.g., Closed-Won, Contract Signed)
- Determine if early CS introduction is needed for complex deals
- Specify deal size or complexity thresholds for different handoff types (high-touch vs. low-touch)
- Document any exceptions or special handling rules
- Get sign-off from VP Sales and VP CS on trigger criteria

#### Step 3: Align on Required Handoff Information

**Step Overview:** Create the definitive list of information CS needs to begin onboarding effectively. End state: Handoff information checklist approved by both teams.

- Define customer context fields: business goals, pain points, success criteria
- Define stakeholder fields: champion, decision-maker, executive sponsor, technical contact
- Define scope fields: products purchased, contract terms, implementation timeline
- Define risk fields: known objections, concerns raised during sales, competitor threats
- Define relationship fields: communication preferences, key conversations, promises made
- Prioritize fields as required vs. optional based on customer segment

---

### Part 2: Design Handoff Workflow & CRM Integration

#### Step 1: Design the Handoff Workflow Process

**Step Overview:** Create the step-by-step process for how handoffs will execute, including timing, ownership, and escalation paths. End state: Documented workflow with clear roles and SLAs.

- Map the end-to-end handoff workflow from trigger to CS first contact
- Define ownership for each step (Sales owns until X, CS owns after Y)
- Set SLAs: time from close to handoff completion, time from handoff to CS first touch
- Create escalation path for incomplete handoffs (who follows up, when)
- Design workflow variations for different customer segments (enterprise vs. SMB)

#### Step 2: Configure CRM Handoff Fields and Objects

**Step Overview:** Build the required CRM infrastructure to capture and display handoff information. End state: CRM fields, layouts, and page sections configured for handoff data.

- Create or repurpose CRM fields for all required handoff information
- Add handoff section to Opportunity/Account page layout in Salesforce/HubSpot
- Configure field validation rules (required fields before stage advancement)
- Set up handoff completion checkbox or status field
- Create handoff notes field for qualitative context
- Test field visibility and permissions for Sales and CS roles

#### Step 3: Build Handoff Automation and Notifications

**Step Overview:** Implement automated triggers that notify CS and enforce handoff completion. End state: Automation active that alerts CS on close and blocks incomplete handoffs.

- Create automation: when deal closes, assign CS owner if not already set
- Build notification: Slack/email alert to assigned CSM when deal closes
- Configure task creation: auto-create handoff review task for CSM
- Set up validation rule: prevent Closed-Won without required handoff fields
- Build handoff summary report that auto-populates with key deal info
- Test automation with sample records before go-live

#### Step 4: Create Handoff Documentation Templates

**Step Overview:** Build standardized templates that capture handoff information in a consistent format. End state: Handoff document template ready for Sales to complete.

- Create handoff summary template (Google Doc, Notion, or CRM notes)
- Include sections for: customer goals, stakeholders, scope, risks, key conversations
- Add prompts/questions to guide Sales through comprehensive documentation
- Build CS intake checklist to verify handoff completeness
- Create quick-reference card for Sales on handoff requirements

---

### Part 3: Pilot & Iterate

#### Step 1: Conduct Pilot with Select Accounts

**Step Overview:** Test the new handoff process with a small group of deals before full rollout. End state: Pilot completed with 5-10 handoffs and feedback collected.

- Select 5-10 upcoming deals for pilot (mix of deal sizes)
- Brief participating Sales reps and CSMs on pilot process
- Execute handoffs using new workflow and templates
- Track time to complete handoff and time to CS first touch
- Document friction points and missing elements

#### Step 2: Gather Feedback and Refine Process

**Step Overview:** Collect structured feedback from pilot participants and iterate on the process. End state: Process refined based on real-world feedback.

- Conduct feedback sessions with pilot Sales reps (what was hard, what was missing)
- Conduct feedback sessions with pilot CSMs (did they get what they needed)
- Survey customers from pilot accounts on their handoff experience
- Identify quick wins for immediate fixes
- Update workflow, templates, and CRM configuration based on feedback
- Document changes for training materials

---

### Part 4: Rollout & Enablement

#### Step 1: Train Sales Team on Handoff Requirements

**Step Overview:** Enable the full Sales team on the new handoff process and their responsibilities. End state: All Sales reps trained and equipped to execute handoffs.

- Schedule training session for Sales team (30-45 minutes)
- Cover: trigger criteria, required fields, documentation template, timing expectations
- Walk through a sample handoff using real CRM screens
- Provide quick-reference guide and FAQ document
- Record session for new hire onboarding

#### Step 2: Train CS Team on Intake Process

**Step Overview:** Enable the CS team on how to receive handoffs, verify completeness, and escalate issues. End state: All CSMs trained on intake workflow.

- Schedule training session for CS team (30-45 minutes)
- Cover: how to find handoff data in CRM, intake checklist, escalation process
- Walk through reviewing a completed handoff
- Practice identifying incomplete handoffs and requesting missing info
- Provide quick-reference guide and escalation contacts

#### Step 3: Communicate Process to Leadership and Launch

**Step Overview:** Inform leadership, set expectations, and officially launch the new process. End state: Process live with leadership visibility and accountability.

- Create executive summary of new process for VP Sales and VP CS
- Set up handoff metrics dashboard (completion rate, time to first touch, escalations)
- Announce launch to full revenue org via email/Slack
- Set go-live date and communicate clearly to both teams
- Schedule weekly check-in for first month to address issues quickly

#### Step 4: Hand Off to Client and Establish Governance

**Step Overview:** Transfer ownership of the process to client RevOps team with documentation and monitoring. End state: Client self-sufficient with process running and metrics tracked.

- Transfer admin access to CRM automations and reports
- Deliver documentation package: process doc, templates, training recordings
- Establish governance rhythm: who reviews handoff metrics, how often
- Define process for updating handoff requirements over time
- Schedule 30-day and 60-day check-ins to assess adoption
- Close out project

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce or HubSpot) with admin access
- Defined deal stages in CRM (specifically Closed-Won stage)
- CS platform or CS workflow in CRM (Gainsight, Totango, or native CRM)
- Identified CS ownership model (how CSMs are assigned to accounts)
- Executive sponsorship from both Sales and CS leadership

**What client must provide:**
- Access to CRM with admin permissions
- Access to 3-5 Sales reps and 3-5 CSMs for interviews
- VP Sales and VP CS availability for alignment meetings
- Historical closed deal data (last 90 days) for audit
- Decision-making authority on required handoff fields
- Time commitment for Sales and CS teams for training (1 hour each)

## 5. Common Pitfalls

- **Pitfall 1**: Sales views handoff requirements as administrative burden and skips fields. **Mitigation**: Make handoff fields genuinely useful (not just busywork), use validation rules to enforce completion, and get Sales leadership to reinforce importance in team meetings.

- **Pitfall 2**: CS team doesn't check handoff data and continues asking customers to repeat information. **Mitigation**: Build CS intake checklist as a required step, include handoff review in CSM onboarding workflow, measure and report on customers asked to repeat info.

- **Pitfall 3**: Handoff works for standard deals but breaks for complex enterprise accounts. **Mitigation**: Design tiered handoff process from the start (SMB quick handoff vs. enterprise with live call), allow flexibility without sacrificing core requirements.

- **Pitfall 4**: Process works at launch but degrades over time as enforcement loosens. **Mitigation**: Establish monthly governance review of handoff completion rates, include handoff quality in Sales and CS performance metrics, assign RevOps owner for ongoing process health.

## 6. Success Metrics

- **Leading Indicator**: Handoff completion rate (% of closed deals with all required fields populated) - target 90%+ within 30 days of launch
- **Lagging Indicator**: Time to First Value reduction (measured 60-90 days post-launch) - target 20%+ improvement; Customer satisfaction with onboarding experience (NPS or survey)

---

