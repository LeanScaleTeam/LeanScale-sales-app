# Onboarding and Process Improvement - Playbook

## 1. Definition

**What it is**: A strategic and technical project that designs, implements, and operationalizes a structured customer onboarding process within the CS platform to reduce time-to-value, increase product adoption, and set customers up for long-term success. The deliverable is a working onboarding system with automated playbooks, milestone tracking, and measurable outcomes.

**What it is NOT**: Not a Customer Success Platform implementation (that's the core platform setup). Not a Customer Health Model project (that's health scoring logic). Not customer segmentation (that's tier definitions). Not a training content creation project alone (this includes content as one component of the overall system).

## 2. ICP Value Proposition

**Pain it solves**: Customers take too long to see value from the product, leading to early churn risk. Current onboarding is ad-hoc with no clear milestones, inconsistent handoffs from Sales, and CSMs cannot articulate how customers define success. Without structured onboarding, 40-60% of new customers drop off after signup.

**Outcome delivered**: A structured, measurable onboarding process with defined milestones (first login, feature adoption, first value achieved), automated workflows in the CS platform, and clear ownership at each stage. Customers reach their "Aha! Moment" faster with reduced time-to-value and improved retention.

**Who owns it**: VP of Customer Success or Head of Customer Operations, with RevOps supporting the technical implementation.

## 3. Implementation Procedure

### Part 1: Assess Current State & Define Success

#### Step 1: Audit Current Onboarding Process

**Step Overview:** Document the existing onboarding process, identify gaps and pain points, and establish a baseline for improvement. End state: Current state assessment with documented inefficiencies and customer feedback.

- Map the existing onboarding workflow from closed-won to first value milestone
- Interview 3-5 CSMs on current pain points and what's working vs. not
- Review churned customer feedback to identify where customers got stuck or confused
- Analyze current time-to-value metrics and onboarding completion rates
- Document the Sales-to-CS handoff process and identify communication gaps
- Quantify the gap (e.g., "Only 40% of customers complete onboarding within target timeframe")

#### Step 2: Define Customer Success Milestones

**Step Overview:** Establish the key milestones that indicate successful onboarding progress and ultimate value realization. End state: Documented milestone definitions aligned with customer outcomes.

- Identify the "Aha! Moment" for each customer segment or product tier
- Define 4-6 progressive milestones (e.g., first login, initial setup complete, first feature adoption, first value achieved)
- Set target timeframes for each milestone based on customer segment complexity
- Validate milestone definitions with Sales and CS leadership
- Document milestone criteria that can be tracked in the CS platform

#### Step 3: Segment Customers and Define Onboarding Tiers

**Step Overview:** Determine onboarding approach by customer segment to ensure appropriate touch levels and resource allocation. End state: Segmentation matrix with onboarding tier assignments.

- Review customer segments by ARR, complexity, and strategic value
- Define high-touch vs. tech-touch vs. self-service onboarding tiers
- Determine CSM assignment criteria for high-value accounts
- Map persona types (power users, team leads, executives) to onboarding content needs
- Document tier-specific onboarding timelines and touchpoint frequency

---

### Part 2: Design Onboarding Workflow

#### Step 1: Map End-to-End Onboarding Journey

**Step Overview:** Create the complete onboarding workflow with stages, tasks, owners, and timing for each customer segment. End state: Visual workflow diagram with all steps documented.

- Define onboarding stages (Welcome, Technical Setup, Training, Adoption, Handoff to BAU)
- Map specific tasks within each stage with clear owners (CSM, Customer, Implementation)
- Set SLAs and target durations for each stage
- Identify decision points and branching logic for different scenarios
- Document escalation paths for stalled or at-risk onboarding

#### Step 2: Design Sales-to-CS Handoff Process

**Step Overview:** Create a standardized handoff process that ensures deal context transfers cleanly to the CS team. End state: Handoff checklist and required fields documented.

- Define required handoff information (customer goals, technical requirements, stakeholders, promises made)
- Create handoff checklist in CRM with mandatory fields before CS assignment
- Design kickoff call template that validates customer expectations
- Establish clear ownership transition point and internal notification triggers
- Document process for CS involvement in late-stage sales calls when applicable

#### Step 3: Build Onboarding Playbook Structure

**Step Overview:** Design the playbook structure that will be configured in the CS platform. End state: Playbook template with triggers, tasks, and success criteria.

- Create master playbook template with stage-gated progression
- Define task dependencies (what must complete before next task unlocks)
- Design automated reminders and escalation triggers for overdue tasks
- Build customer-facing milestone tracker concept (portal or email updates)
- Document conditional logic for segment-specific task variations

---

### Part 3: Configure CS Platform

#### Step 1: Set Up Onboarding Playbooks in CS Platform

**Step Overview:** Implement the designed workflows as automated playbooks in the CS platform (Gainsight, ChurnZero, Catalyst, etc.). End state: Working playbooks triggered on closed-won.

- Create onboarding journey program with stage definitions
- Configure playbook triggers based on closed-won opportunity status
- Build task sequences with owners, due dates, and dependencies
- Set up milestone tracking objects linked to customer records
- Configure segment-based playbook variations (high-touch vs. tech-touch)

#### Step 2: Implement Automated Communications

**Step Overview:** Configure automated emails and notifications that guide customers through onboarding. End state: Email sequences active and triggered appropriately.

- Build welcome email sequence with personalized content by segment
- Create milestone achievement notifications (internal and customer-facing)
- Configure stalled onboarding alerts for CSM intervention
- Set up executive stakeholder touchpoints at key milestones
- Test email deliverability and template rendering

#### Step 3: Build Onboarding Dashboards and Reports

**Step Overview:** Create visibility into onboarding performance for CSMs and leadership. End state: Dashboards showing onboarding health and trends.

- Build individual customer onboarding progress tracker
- Create CSM portfolio view showing all customers in onboarding
- Design leadership dashboard with aggregate metrics (TTV, completion rates, stage duration)
- Configure at-risk onboarding alerts based on SLA breaches
- Set up automated weekly/monthly onboarding performance reports

---

### Part 4: Develop Onboarding Content

#### Step 1: Create Customer-Facing Onboarding Materials

**Step Overview:** Develop the training materials and guides customers need for successful onboarding. End state: Content library ready for customer distribution.

- Build product setup guides tailored to each customer segment
- Create video walkthroughs for key feature activation
- Develop FAQ document addressing common onboarding questions
- Design quick-reference cards for power users vs. executives
- Organize content in knowledge base or customer portal

#### Step 2: Build Internal CSM Resources

**Step Overview:** Create playbooks and scripts that enable consistent CSM execution. End state: CSM enablement package complete.

- Write kickoff call script with discovery questions and agenda
- Create check-in call templates for each onboarding stage
- Develop objection handling guide for common customer concerns
- Build troubleshooting guide for technical onboarding issues
- Document escalation procedures and who to involve when

---

### Part 5: Rollout & Enablement

#### Step 1: Train Customer Success Team

**Step Overview:** Enable CSMs on the new onboarding process, tools, and expectations. End state: CS team trained and confident in new process.

- Schedule training session (60-90 min) covering process, playbooks, and tools
- Walk through live demonstration of playbook execution in CS platform
- Role-play kickoff calls and check-in scenarios
- Distribute quick-reference guide for daily use
- Address questions and document feedback for process refinement
- Send recording to team for future reference

#### Step 2: Pilot with New Customers

**Step Overview:** Test the new onboarding process with a cohort of new customers before full rollout. End state: Pilot complete with lessons learned documented.

- Select 5-10 new customers for pilot cohort across different segments
- Assign designated CSMs to pilot with close monitoring
- Gather feedback from CSMs and customers at each milestone
- Track pilot metrics against baseline (TTV, completion rates, satisfaction)
- Document what worked and what needs adjustment

#### Step 3: Full Rollout and Process Handoff

**Step Overview:** Launch the new onboarding process for all new customers and transfer ownership to client team. End state: Client self-sufficient with new onboarding system.

- Communicate go-live date and process changes to full CS team
- Transition all new customers to new onboarding playbooks
- Transfer admin access and documentation to client RevOps/CS Ops
- Deliver runbook for playbook maintenance and iteration
- Schedule 30-day and 60-day check-ins to review performance

---

### Part 6: Measure & Iterate

#### Step 1: Establish Ongoing Measurement Cadence

**Step Overview:** Set up regular review of onboarding metrics to drive continuous improvement. End state: Recurring review process with action tracking.

- Define weekly CSM review of individual customer progress
- Establish bi-weekly leadership review of aggregate metrics
- Create monthly retrospective template for process improvements
- Set up automated metric alerts for significant deviations
- Document iteration process for playbook updates

#### Step 2: Build Continuous Improvement Loop

**Step Overview:** Create mechanism for ongoing refinement based on data and feedback. End state: Documented improvement process with owner.

- Establish customer feedback collection at onboarding completion
- Create CSM feedback channel for process improvement suggestions
- Define quarterly playbook review and optimization cycle
- Document change management process for playbook updates
- Assign ongoing ownership to CS Ops or RevOps for maintenance

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Customer Success Platform deployed and operational (Gainsight, ChurnZero, Catalyst, etc.)
- CRM with closed-won opportunity data and customer records
- Basic customer segmentation defined (or can be done as part of this project)
- CS team structure and customer assignments in place

**What client must provide:**
- Access to CS platform with admin permissions
- Access to CRM for handoff field configuration
- Historical onboarding data and churn feedback if available
- 3-5 CSMs available for interviews and training
- CS and Sales leadership availability for milestone validation
- Customer segment definitions and ARR thresholds

## 5. Common Pitfalls

- **One-Size-Fits-All Onboarding**: Applying the same linear process to all customers regardless of complexity or segment. → **Mitigation**: Build segment-specific playbook variations with appropriate touch levels and timeline expectations from the start.

- **Poor Sales-to-CS Handoff**: Deal context lost in transition, promises made by Sales unknown to CS, causing customer frustration and misaligned expectations. → **Mitigation**: Implement mandatory handoff checklist in CRM and consider CS involvement in late-stage sales calls for strategic accounts.

- **Checklist Mentality Over Outcomes**: Focusing on completing tasks rather than achieving customer value milestones, leading to "completed" onboarding with no actual adoption. → **Mitigation**: Define outcome-based milestones (first value achieved) not just activity milestones (training completed).

- **No Clear Ownership During Transition**: Customer slips through cracks when no one clearly owns the onboarding relationship. → **Mitigation**: Assign explicit onboarding owner immediately at closed-won with automated notification and documented accountability.

## 6. Success Metrics

- **Leading Indicator**: Onboarding milestone completion rate (% of customers completing each milestone within target timeframe)
- **Lagging Indicator**: Time-to-Value reduction (days from closed-won to first value milestone achieved) and 90-day retention rate for newly onboarded customers

---

