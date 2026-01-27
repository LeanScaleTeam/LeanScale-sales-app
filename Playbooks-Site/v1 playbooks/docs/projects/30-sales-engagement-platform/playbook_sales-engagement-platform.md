# Sales Engagement Platform - Playbook

## 1. Definition

**What it is**: A technical implementation project that deploys and configures a sales engagement platform (Outreach, Salesloft, Amplemarket, or similar) to automate multi-channel outreach sequences, track prospect communications, and provide engagement analytics within the CRM ecosystem.

**What it is NOT**: Not Activity Capture (auto-logging emails/calls). Not Conversation Intelligence (call recording/analysis like Gong). Not CRM customization. Not sales coaching or messaging strategy (we stay technical, not copywriting).

## 2. ICP Value Proposition

**Pain it solves**: Sales reps manually manage outreach across disconnected tools (email, phone, LinkedIn), resulting in inconsistent follow-up, dropped leads, and no visibility into what sequences actually work. Reps spend hours on administrative tasks instead of selling.

**Outcome delivered**: Unified multi-channel sales engagement platform with automated sequences, task management in a single view, CRM sync for full activity visibility, and analytics to identify what messaging and cadences drive conversions. Reps execute more touches with less effort.

**Who owns it**: VP of Sales Operations, RevOps Leader, or Head of Sales Development.

## 3. Implementation Procedure

### Part 1: Assess Current State & Define Requirements

#### Step 1: Audit Current Sales Engagement Process

**Step Overview:** Document how the sales team currently manages outreach and identify gaps in tooling and process. End state: Gap analysis showing current pain points and requirements for platform selection.

- Interview 3-5 SDRs/AEs on their current outreach workflow (email, phone, LinkedIn, tasks)
- Document what tools reps currently use (CRM native sequences, spreadsheets, manual tracking)
- Pull activity metrics from CRM to establish baseline (emails sent, calls logged, response rates)
- Identify data sources currently used for prospecting (ZoomInfo, Apollo, LinkedIn Sales Nav)
- Quantify time spent on manual tasks vs. actual selling time
- Document which channels are used and their relative priority (email vs. phone vs. social)

#### Step 2: Define Platform Requirements & Success Criteria

**Step Overview:** Translate sales team needs into platform requirements and establish measurable success criteria. End state: Requirements document with must-have features and success metrics.

- Define required CRM integration (Salesforce, HubSpot, or Microsoft Dynamics)
- Document email provider requirements (Google Workspace vs. Microsoft 365)
- List must-have features: sequences, dialer, LinkedIn integration, analytics
- Identify nice-to-have features: AI personalization, intent data, conversation intelligence
- Set success criteria (e.g., 50% increase in daily touches, 20% improvement in response rates)
- Document team size and licensing requirements

---

### Part 2: Platform Selection & Procurement

#### Step 1: Evaluate Platform Options

**Step Overview:** Compare sales engagement platform options against requirements and tech stack compatibility. End state: Shortlist of 2-3 platforms with pros/cons documented.

- Evaluate primary options: Outreach, Salesloft, Amplemarket, Apollo, Groove
- Score each platform on CRM integration depth (Outreach/Groove excel with Salesforce)
- Assess dialer functionality if outbound calling is priority (Salesloft, Outreach)
- Compare email deliverability features (inbox rotation, warm-up, domain health)
- Evaluate cost per seat and total cost of ownership
- Check integration capabilities with existing data enrichment tools (ZoomInfo, Clay, Clearbit)
- Note learning curve complexity (Outreach/Salesloft have steep learning curves)

#### Step 2: Conduct Platform Demo & Selection

**Step Overview:** Run demos with shortlisted vendors and make final platform selection with stakeholder buy-in. End state: Platform selected with budget approved and contract initiated.

- Schedule demos with 2-3 shortlisted vendors
- Include key stakeholders: Sales leadership, RevOps, IT (for security review)
- Test specific use cases during demo (sequence creation, CRM sync, reporting)
- Request trial period if available for hands-on evaluation
- Present recommendation with ROI analysis to decision makers
- Get budget approval and initiate procurement process

---

### Part 3: Configure Platform Foundation

#### Step 1: Set Up Platform Account & CRM Connection

**Step Overview:** Create the platform account, establish admin structure, and connect to CRM with proper API permissions. End state: Platform connected to CRM with bidirectional sync enabled.

- Create platform account with proper admin/user hierarchy
- Connect to Salesforce/HubSpot via OAuth authentication
- Configure API permissions (read/write for contacts, accounts, activities, opportunities)
- Set up field mappings between platform and CRM objects
- Enable bidirectional sync for activity logging
- Test sync with sample records to verify data flow
- Document admin credentials for client handoff

#### Step 2: Configure Email Infrastructure

**Step Overview:** Set up email connectivity and deliverability settings to ensure high inbox placement. End state: Email infrastructure connected with deliverability best practices configured.

- Connect email provider (Google Workspace or Microsoft 365)
- Set up custom tracking domain for link tracking (improves deliverability)
- Configure inbox warm-up if platform supports (Amplemarket, Apollo)
- Set daily send limits per user to avoid spam filters (20-30 emails/day initially)
- Configure domain authentication (SPF, DKIM, DMARC verification)
- Set up inbox rotation if team needs higher volume
- Test email deliverability with sample sends

#### Step 3: Configure Dialer & Phone Settings

**Step Overview:** Set up phone/dialer functionality for outbound calling capability. End state: Dialer operational with call logging to CRM.

- Configure dialer integration (native or third-party like Dialpad, Aircall)
- Set up local presence dialing if required
- Configure call recording settings (ensure compliance with recording laws)
- Map call dispositions to CRM activity types
- Set up voicemail drop templates
- Test call logging flow to CRM
- Configure call analytics tracking

---

### Part 4: Build Sequences & Workflows

#### Step 1: Design Sequence Framework

**Step Overview:** Define the sequence architecture including cadence patterns, channel mix, and timing rules. End state: Sequence framework documented with templates for different use cases.

- Define primary sequence types needed (cold outreach, inbound follow-up, re-engagement)
- Establish cadence timing rules (days between steps, time of day)
- Set multi-channel step mix (email, call, LinkedIn, manual tasks)
- Create naming conventions for sequences
- Define reply handling rules (remove on reply, move to different sequence)
- Establish A/B testing framework for subject lines and messaging
- Document sequence governance (who can create/edit)

#### Step 2: Build Core Sequences

**Step Overview:** Build the primary sequences in the platform based on the framework. End state: 3-5 core sequences built and ready for review.

- Build cold outbound prospecting sequence (typically 8-12 steps over 3-4 weeks)
- Build inbound lead follow-up sequence (faster cadence, 5-7 steps over 2 weeks)
- Build re-engagement/nurture sequence for stale opportunities
- Configure personalization tokens (name, company, industry, title)
- Set up task types for manual steps (research, LinkedIn connect, video)
- Configure exit criteria and completion rules
- Note: Stay technical - use placeholder copy, client owns messaging strategy

#### Step 3: Configure Workflow Automations

**Step Overview:** Set up automation rules that trigger sequences and manage prospect routing. End state: Key automation workflows configured and tested.

- Build lead-to-sequence assignment rules based on lead source/segment
- Configure automation for lead status updates based on engagement
- Set up automatic task creation for key trigger events
- Build integration with data enrichment tools (Clay, ZoomInfo) if applicable
- Configure automation for bounced email handling
- Set up alerts for hot prospect engagement signals
- Test automation workflows end-to-end

---

### Part 5: Reporting & Analytics Setup

#### Step 1: Configure Activity Tracking & Dashboards

**Step Overview:** Set up activity tracking and build dashboards for sales management visibility. End state: Rep-level and team-level dashboards operational.

- Configure activity metrics to track (emails sent, calls made, meetings booked)
- Build rep-level activity dashboard (daily touches, response rates, meetings)
- Create team/manager dashboard (aggregate metrics, rep comparisons)
- Set up sequence performance reporting (open rates, reply rates by sequence)
- Configure pipeline attribution to track sequence influence on deals
- Build real-time alerts for engagement spikes

#### Step 2: Set Up Analytics & Optimization Reports

**Step Overview:** Configure analytics for ongoing optimization and message testing. End state: Analytics framework in place to drive continuous improvement.

- Set up A/B test tracking for subject lines and templates
- Configure email deliverability monitoring dashboard
- Build best-time-to-send analysis reports
- Set up prospect engagement scoring if supported
- Create content effectiveness reports (what messaging drives replies)
- Configure export/integration with BI tools if needed

---

### Part 6: Rollout & Enablement

#### Step 1: Conduct Pilot Testing

**Step Overview:** Run pilot with small group of users to validate configuration and gather feedback. End state: Pilot complete with issues resolved and feedback incorporated.

- Select 3-5 pilot users (mix of SDRs and AEs)
- Provide pilot group with initial training (30-45 min)
- Run pilot for 1-2 weeks with active monitoring
- Collect feedback on usability and workflow issues
- Resolve configuration issues identified during pilot
- Refine sequences and automations based on pilot learnings
- Validate CRM sync and data accuracy

#### Step 2: Train Full Sales Team

**Step Overview:** Deliver training to full sales team on platform usage and best practices. End state: Full team trained and confident using the platform.

- Schedule training sessions (45-60 min, split by role if needed)
- Cover core workflows: adding prospects, running sequences, managing tasks
- Train on dialer usage and call logging
- Demonstrate dashboard and personal analytics
- Address common questions and troubleshooting
- Create quick-reference guide for daily usage
- Record training session for future onboarding

#### Step 3: Hand Off to Client

**Step Overview:** Transfer platform ownership and documentation to client RevOps team. End state: Client self-sufficient with admin access, documentation, and support resources.

- Transfer admin credentials to client RevOps/Sales Ops owner
- Deliver documentation package (configuration settings, sequence library, governance)
- Provide troubleshooting guide for common issues
- Document vendor support resources and escalation paths
- Schedule 30-day check-in for optimization review
- Hand off monitoring responsibilities
- Close out project

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce or HubSpot) fully implemented and actively used
- Email system (Google Workspace or Microsoft 365) deployed to sales team
- Sales team structure and territories defined
- Budget approved for platform licensing

**What client must provide:**
- Admin access to CRM with API permissions
- Admin access to email system for connection
- List of users to be licensed on platform
- Current sequence/cadence examples if any exist
- Ideal customer profile and target segments for sequence design
- Stakeholder availability for demos and training sessions

## 5. Common Pitfalls

- **Data silo between platform and CRM**: Platform activities don't sync properly to CRM, causing duplicate data entry and visibility gaps. **Mitigation**: Test bidirectional sync thoroughly during setup, validate with sample records before rollout, and monitor sync logs weekly post-launch.

- **Email deliverability degradation**: Reps send too many emails too fast, triggering spam filters and hurting domain reputation. **Mitigation**: Set conservative daily limits (20-30/day), configure inbox warm-up, use custom tracking domains, and monitor deliverability metrics.

- **Overwhelming complexity for reps**: Platforms like Outreach and Salesloft have steep learning curves that lead to low adoption. **Mitigation**: Invest in proper training, create simple quick-reference guides, start with basic workflows before adding advanced features.

- **Disconnected data enrichment workflow**: Platform isn't integrated with data sources (ZoomInfo, Apollo), causing manual prospecting work. **Mitigation**: Build data enrichment integrations during configuration phase, or use a RevOps partner to design seamless data workflows.

## 6. Success Metrics

- **Leading Indicator**: Rep adoption rate (% of reps actively using platform daily within 2 weeks of launch), sequence enrollment rates, and daily touch volume per rep.

- **Lagging Indicator**: Meeting booking rate improvement (20%+ increase in meetings booked per rep), response rate improvement on outbound sequences, and pipeline generated from sequenced prospects (track via CRM attribution).

---

