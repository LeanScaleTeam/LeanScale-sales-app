# AI Automated Inbound - Playbook

## 1. Definition

**What it is**: A technical implementation project that deploys AI-powered chat and real-time meeting booking on the website to engage, qualify, and route high-intent visitors to Sales instantly—transforming website traffic into a predictable pipeline channel through tools like Qualified.com.

**What it is NOT**: Not a general chatbot or support bot implementation (that's customer service). Not a Marketing Automation Platform setup (that's lead nurturing workflows). Not a CRM implementation project. Not a static lead form optimization.

## 2. ICP Value Proposition

**Pain it solves**: Sales teams lose 70% of inbound leads due to slow response times. Static forms create friction and delay follow-up. High-intent buyers leave the website before connecting with Sales, and reps waste time chasing unqualified visitors while hot leads go cold.

**Outcome delivered**: Real-time AI-powered engagement that instantly identifies visitors, qualifies them through conversational flows, and books meetings with the right rep—reducing speed-to-lead from hours/days to minutes. MQL-to-SQL conversion increases 2-3X, and meetings booked from inbound traffic double.

**Who owns it**: VP of Marketing or VP of Demand Generation, with RevOps supporting integration and Sales providing input on qualification criteria and routing rules.

## 3. Implementation Procedure

### Part 1: Discovery & Current State Assessment

#### Step 1: Conduct Stakeholder Discovery Session

**Step Overview:** Meet with Marketing, Sales, and RevOps leadership to align on inbound engagement goals and define success metrics. End state: Documented goals for MQL-to-SQL conversion, speed-to-lead targets, and meeting booking rates.

- Schedule 60-90 minute discovery session with Marketing, Sales Ops, and Sales leadership
- Define primary inbound engagement goals (e.g., 2X meetings booked, &lt;5 min speed-to-lead)
- Document current MQL-to-SQL conversion rate as baseline
- Identify key buyer segments and their typical on-site behaviors
- Clarify budget and timeline constraints for tool selection
- Capture stakeholder expectations for AI vs. human handoff scenarios

#### Step 2: Audit Current Inbound Workflows

**Step Overview:** Assess existing inbound processes, website visitor data, and qualification criteria to identify gaps and opportunities. End state: Gap analysis showing current state vs. desired state with specific improvement areas.

- Map current lead capture mechanisms (forms, demo requests, contact pages)
- Pull speed-to-lead metrics from CRM (time from form submission to first response)
- Document existing qualification criteria (BANT, MEDDIC, or custom framework)
- Identify high-traffic pages where inbound intent signals are strongest
- Review current routing rules and SLA compliance rates
- Quantify missed opportunities (e.g., "40% of demo requests never get follow-up within 24 hours")

#### Step 3: Evaluate and Select AI Inbound Tool

**Step Overview:** Compare AI inbound platform options against client's tech stack, requirements, and budget. End state: Tool selected (e.g., Qualified.com, Drift) with procurement approved.

- Document client's current tech stack (CRM, MAP, website platform, existing chat tools)
- Evaluate options: Qualified.com, Drift, Intercom, HubSpot Conversations
- Compare on: CRM compatibility, AI capabilities, meeting booking, analytics depth, cost per seat
- Assess integration complexity with existing systems
- Present recommendation with ROI projections to stakeholders
- Get budget approval and initiate procurement/contract process

---

### Part 2: Buyer Journey & Playbook Design

#### Step 1: Map Buyer Segments and On-Site Behaviors

**Step Overview:** Define key buyer personas and the on-site behaviors that indicate buying intent for each segment. End state: Documented buyer segment map with intent signals and qualification criteria per segment.

- Identify 3-5 primary buyer segments (e.g., enterprise vs. SMB, by industry, by role)
- Map high-intent behaviors per segment (pricing page visits, demo page, security pages)
- Define qualification criteria for each segment using existing framework
- Document account signals (company size, industry, tech stack) that indicate fit
- Create segment-specific routing rules (e.g., enterprise → AE, SMB → SDR)
- Validate segment definitions with Sales leadership

#### Step 2: Design Conversational Playbooks

**Step Overview:** Create AI chat playbooks with qualification questions, value prompts, and objection handling for each buyer segment. End state: Complete conversational flow documents ready for tool configuration.

- Draft 3-5 conversational playbooks aligned to buyer segments and intent levels
- Define opening messages based on page context (pricing vs. blog vs. product pages)
- Create qualification question sequences (3-5 questions per flow)
- Write value prompts and benefit statements for key objections
- Define escalation triggers for human handoff (complex questions, high-value accounts)
- Include meeting booking CTAs at optimal points in conversation flow
- Document fallback responses for out-of-scope questions

#### Step 3: Define Routing Rules and Escalation Logic

**Step Overview:** Establish routing rules for hot leads, existing customers, target accounts, and non-fit visitors. End state: Complete routing matrix with owner assignments and SLA targets.

- Create routing matrix: segment × intent level × owner/queue
- Define rules for existing customers (route to CSM or dedicated queue)
- Set up ABM-specific routing for target accounts (priority queue, specific AE)
- Establish non-target visitor handling (resource offer, nurture path, graceful exit)
- Define SLA targets for each queue (e.g., hot leads &lt;2 min, standard &lt;5 min)
- Document after-hours routing logic (meeting booking only vs. queue for morning)

---

### Part 3: Data Integration & Enrichment Setup

#### Step 1: Connect AI Platform to CRM

**Step Overview:** Establish bidirectional connection between Qualified.com (or selected tool) and CRM with proper API permissions. End state: AI platform connected to CRM with leads/contacts syncing correctly.

- Configure OAuth connection to Salesforce or HubSpot
- Grant required API permissions (read/write leads, contacts, accounts, activities)
- Map AI platform fields to CRM standard and custom fields
- Set up lead/contact creation rules (create new vs. update existing)
- Configure account matching logic for known visitors
- Test bidirectional sync with sample records
- Document integration settings for client handoff

#### Step 2: Set Up Data Enrichment Integration

**Step Overview:** Connect data enrichment tools to enable real-time visitor identification and account scoring. End state: Enrichment flowing into AI platform for personalized, data-driven conversations.

- Connect enrichment tools (Clearbit, ZoomInfo, 6sense, or native enrichment)
- Configure reverse IP lookup for company identification
- Set up contact enrichment for known visitors (title, seniority, department)
- Define enrichment triggers (on page load vs. on engagement)
- Map enriched data to AI platform variables for personalization
- Test enrichment accuracy with sample visitors

#### Step 3: Integrate Marketing Automation Platform

**Step Overview:** Connect AI platform to MAP for lead scoring sync and nurture workflow triggers. End state: Leads scored correctly with automated nurture enrollment based on AI interactions.

- Connect to HubSpot, Marketo, or Pardot via native integration or API
- Configure lead score sync from MAP to AI platform (for prioritization)
- Set up activity logging from AI platform to MAP (conversation events)
- Define nurture enrollment triggers based on AI qualification outcomes
- Configure lead source/campaign tracking for attribution
- Test end-to-end flow: visitor → AI chat → CRM lead → MAP nurture

---

### Part 4: Build, Configure & Test AI Experiences

#### Step 1: Configure AI Chatbot Foundation

**Step Overview:** Set up core AI chatbot configuration including appearance, behavior settings, and base AI training. End state: AI chatbot deployed on website with foundational settings in place.

- Configure chatbot appearance (colors, logo, positioning) to match brand
- Set up bot personality and tone of voice aligned with company brand guidelines
- Configure AI training with company-specific context (product info, pricing tiers, competitors)
- Set up knowledge base connections for accurate responses
- Define bot behavior by page type (aggressive on pricing, passive on blog)
- Configure mobile vs. desktop experience differences
- Set initial AI confidence thresholds for escalation

#### Step 2: Implement Conversational Playbooks

**Step Overview:** Build out the designed conversational flows in the AI platform with all qualification paths and routing logic. End state: All playbooks configured and ready for testing.

- Build each conversational playbook in the platform
- Configure conditional branching based on visitor responses
- Set up qualification data capture (company size, use case, timeline, budget)
- Implement routing logic per playbook (trigger assignments, queue selections)
- Configure meeting booking integration (calendar connections, availability rules)
- Set up real-time alerts for high-priority visitors (Slack, email, SMS)
- Add personalization tokens using enrichment data

#### Step 3: Configure Meeting Booking Experience

**Step Overview:** Set up real-time meeting booking with calendar integrations and availability rules. End state: Visitors can book meetings directly from AI conversations with correct rep calendars.

- Connect rep calendars (Google Calendar or Outlook) to AI platform
- Configure availability windows and buffer times per rep
- Set up round-robin or weighted distribution logic
- Define meeting types (15 min intro, 30 min demo, 60 min deep dive)
- Configure confirmation emails and calendar invites
- Set up rescheduling and cancellation workflows
- Test booking flow end-to-end with multiple rep calendars

#### Step 4: QA and Test All AI Experiences

**Step Overview:** Conduct comprehensive testing of all conversational flows, routing, and integrations before launch. End state: All flows tested, issues resolved, and system ready for pilot launch.

- Test each playbook flow manually (happy path and edge cases)
- Verify routing delivers to correct owner/queue for each scenario
- Test CRM record creation and field mapping accuracy
- Verify enrichment data appearing correctly in conversations
- Test meeting booking across all rep calendars and time zones
- Validate mobile experience functionality
- Test after-hours behavior and fallback scenarios
- Document any issues and resolve before pilot

---

### Part 5: Rollout, Training & Enablement

#### Step 1: Launch Pilot with Select Rep Group

**Step Overview:** Deploy AI inbound to a subset of traffic/reps to validate performance before full rollout. End state: Pilot running with initial data on engagement, meeting booking, and rep feedback.

- Select 3-5 reps for pilot group (mix of SDR and AE if applicable)
- Configure traffic routing to limit AI exposure (e.g., 25% of traffic)
- Brief pilot reps on what to expect and how to handle AI-sourced leads
- Monitor first 48-72 hours closely for issues
- Collect rep feedback on lead quality and handoff experience
- Track pilot metrics: engagement rate, qualification rate, meetings booked
- Identify and resolve any issues before scaling

#### Step 2: Train Sales and Marketing Teams

**Step Overview:** Conduct training sessions for Sales and Marketing on using AI platform insights, notifications, and chat handoff. End state: Teams trained and confident using the new system.

- Schedule 45-minute training session with full Sales team
- Cover: how AI qualifies leads, real-time notification handling, chat takeover process
- Train on using AI platform dashboard for visitor insights
- Demonstrate how to access conversation transcripts in CRM
- Create quick-reference guide for common scenarios
- Train Marketing on monitoring AI engagement analytics
- Record training session for onboarding new reps

#### Step 3: Launch Full Rollout

**Step Overview:** Expand AI inbound to all traffic with full routing to all reps. End state: AI chatbot and meeting booking live across website with all reps receiving leads.

- Expand traffic routing to 100%
- Enable all reps in routing pool
- Configure monitoring dashboards for real-time performance tracking
- Set up daily/weekly automated reports to stakeholders
- Establish Slack channel for issue escalation and feedback
- Communicate launch internally with expectations and SLAs

---

### Part 6: Optimization & Handoff

#### Step 1: Establish Performance Monitoring Dashboards

**Step Overview:** Build dashboards tracking key AI inbound metrics for ongoing optimization. End state: Dashboards live showing engagement, conversion, and speed-to-lead metrics.

- Create AI platform native dashboard with key metrics
- Build CRM reports for AI-sourced lead conversion tracking
- Set up speed-to-lead measurement (form submit to first response)
- Configure meeting booking funnel metrics (booked → held → converted)
- Create comparison view: AI-sourced vs. traditional form leads
- Set up automated weekly report delivery to stakeholders

#### Step 2: Conduct 30/60/90 Day Reviews

**Step Overview:** Review AI inbound performance at regular intervals and refine playbooks based on data. End state: Documented optimizations implemented with measurable improvement.

- Schedule 30-day review meeting with stakeholders
- Analyze: which playbooks perform best, where visitors drop off, routing efficiency
- Identify underperforming segments or flows for optimization
- Review AI response accuracy and escalation patterns
- Adjust qualification questions based on Sales feedback
- Refine routing rules based on conversion data
- Document changes and expected impact
- Repeat at 60 and 90 days with deeper analysis

#### Step 3: Hand Off to Client

**Step Overview:** Transfer ownership, documentation, and ongoing optimization playbook to client team. End state: Client self-sufficient with admin access, runbooks, and clear optimization process.

- Transfer admin credentials to client RevOps/Marketing Ops
- Deliver documentation package (configuration settings, playbook logic, integration details)
- Create optimization runbook for ongoing refinement
- Document troubleshooting procedures for common issues
- Train client admin on making configuration changes
- Schedule 90-day check-in for questions and advanced optimization
- Close out project with final performance summary

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Website with sufficient traffic to justify AI investment (typically 10K+ monthly visitors)
- CRM in place (Salesforce or HubSpot) with leads/contacts configured
- Defined ICP and qualification criteria (even if informal)
- Sales team with capacity to handle increased inbound leads
- Budget approval for AI platform subscription

**What client must provide:**
- Admin access to website/CMS for script installation
- Admin access to CRM for integration setup
- Access to Marketing Automation Platform if applicable
- Rep calendar access or IT coordination for calendar connections
- Sales leadership time for playbook design and routing decisions
- 3-5 reps for pilot program participation

## 5. Common Pitfalls

- **Poor integration causing data gaps**: 40% of automation failures stem from integration issues. → **Mitigation**: Test bidirectional sync thoroughly before launch with sample records, and audit data flow weekly during first month.

- **Over-automating human touchpoints**: Trying to make AI handle complex or sensitive conversations frustrates buyers. → **Mitigation**: Define clear escalation triggers and ensure human handoff is seamless; don't retrofit AI into interactions that need human nuance.

- **Vanity metrics fixation**: Focusing on engagement rates without connecting to revenue outcomes. → **Mitigation**: Always track through to pipeline and closed-won; report on AI-sourced meetings held and converted, not just booked.

- **Set-and-forget AI training**: AI chatbot accuracy degrades without continuous feedback and training. → **Mitigation**: Establish weekly review of AI responses and regular refinement cadence; OpenAI improved accuracy from 60% to 98% through continuous training loops.

## 6. Success Metrics

- **Leading Indicator**: Speed-to-lead under 5 minutes for AI-engaged visitors; meeting booking rate from AI conversations >15%
- **Lagging Indicator**: 2X increase in MQL-to-SQL conversion rate; measurable pipeline sourced from AI inbound within 90 days

---

