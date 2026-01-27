# Conversation Intelligence Platform Implementation - Playbook

## 1. Definition

**What it is**: A technical implementation project that deploys a conversation intelligence platform (such as Gong, Chorus, Clari, or Jiminny) across go-to-market teams to automatically record, transcribe, and analyze sales and customer conversations, extracting actionable insights and syncing data to CRM systems.

**What it is NOT**: Not a Sales Engagement Platform implementation (that's email sequencing/cadences). Not Activity Capture only (that's auto-logging emails/calendar). Not CRM customization or reporting projects. Not a sales methodology training program (though it supports coaching).

## 2. ICP Value Proposition

**Pain it solves**: Sales leaders lack visibility into what's actually being said on calls - they can't coach effectively, can't understand why deals stall, and rely on rep self-reporting which is inconsistent and biased. Marketing doesn't know which messaging resonates. Customer Success misses early churn signals.

**Outcome delivered**: All customer-facing conversations automatically recorded, transcribed, and analyzed. AI-powered insights surface deal risks, coaching opportunities, and competitive mentions. Data flows to CRM automatically. Managers can coach from actual call data, not guesswork.

**Who owns it**: VP of Sales Operations, RevOps Leader, or VP Sales (with RevOps execution).

## 3. Implementation Procedure

### Part 1: Discovery & Requirements Definition

#### Step 1: Audit Current State of Conversation Visibility

**Step Overview:** Assess how customer conversations are currently captured and analyzed across all GTM teams. End state: Gap analysis documenting what percentage of conversations are being recorded and how insights are (or aren't) being extracted.

- Interview sales managers on current coaching practices and call review frequency
- Document existing recording tools (Zoom recordings, Google Meet, Teams) and their limitations
- Identify which conversation types are NOT being captured (phone calls, in-person, certain meeting types)
- Pull CRM data to assess how much call/meeting context is manually logged today
- Survey reps on time spent on manual note-taking and CRM updates post-call
- Quantify the visibility gap (e.g., "Only 30% of calls are reviewed for coaching")

#### Step 2: Define Success Criteria and KPIs

**Step Overview:** Establish specific, measurable goals for the CIP implementation aligned with business outcomes. End state: Documented KPIs with baseline measurements and target improvements.

- Identify primary use cases (sales coaching, deal risk identification, competitive intel, customer feedback)
- Define 3-5 measurable KPIs (e.g., manager coaching hours, win rate, ramp time, CRM data quality)
- Pull baseline metrics for each KPI from current systems
- Set target improvements (realistic: 15-25% improvement in primary metrics within 6 months)
- Document secondary benefits to track (time savings, deal cycle reduction, churn signal detection)
- Get stakeholder sign-off on success criteria

#### Step 3: Map Stakeholder Requirements

**Step Overview:** Gather requirements from all GTM teams who will use the platform to ensure implementation meets cross-functional needs. End state: Requirements document covering sales, marketing, CS, and leadership needs.

- Conduct requirements sessions with Sales (managers + reps), Marketing, and Customer Success
- Document must-have vs nice-to-have features per team
- Identify compliance requirements (recording consent laws, data retention policies, security needs)
- Map required integrations (CRM, calendar, video conferencing, sales enablement tools)
- Define user roles and permission levels needed
- Prioritize requirements into Phase 1 (launch) vs Phase 2 (post-launch enhancements)

---

### Part 2: Platform Selection & Procurement

#### Step 1: Evaluate Platform Options

**Step Overview:** Research and compare conversation intelligence platforms against client's specific requirements and tech stack. End state: Shortlist of 2-3 platforms with detailed feature comparison.

- Create evaluation scorecard based on requirements (integrations, AI capabilities, coaching features, security)
- Research leading platforms: Gong, Chorus (ZoomInfo), Clari Copilot, Jiminny, Salesloft Conversations
- Assess CRM compatibility (Salesforce vs HubSpot native integrations vary significantly)
- Compare pricing models (per seat, usage-based, annual commitments)
- Check vendor references and G2/TrustRadius reviews for similar company size/industry
- Document integration complexity - some platforms require dedicated integration users and custom API work

#### Step 2: Conduct Vendor Demos and Pilot

**Step Overview:** Run structured demos with shortlisted vendors and conduct a pilot with a subset of users. End state: Platform selected with pilot results validating fit.

- Schedule demos with top 2-3 vendors using standardized evaluation criteria
- Prepare demo script with specific use case scenarios (coaching session, deal review, competitive analysis)
- Conduct 2-4 week pilot with 5-10 users (mix of reps and managers)
- Evaluate pilot on: ease of setup, recording quality, transcription accuracy, insight value, user adoption
- Gather pilot user feedback via survey and interviews
- Make final platform recommendation with TCO analysis (licenses + implementation + ongoing maintenance)

#### Step 3: Complete Procurement and Contracts

**Step Overview:** Finalize vendor selection, negotiate contract terms, and complete procurement. End state: Contract signed with clear terms on implementation support, SLAs, and pricing.

- Negotiate contract terms (term length - avoid multi-year if uncertain, user minimums, price locks)
- Review security/compliance documentation with IT and Legal
- Clarify implementation support included vs additional cost
- Document SLAs for uptime, support response, and data processing times
- Complete procurement approval process
- Obtain signed contract and implementation kickoff date

---

### Part 3: Technical Configuration & CRM Integration

#### Step 1: Set Up Platform Account and Core Configuration

**Step Overview:** Create the CIP account, configure organizational settings, and establish the foundation for recording and analysis. End state: Platform operational with correct organizational structure and recording settings.

- Create platform account and configure company/workspace settings
- Set up organizational hierarchy (teams, managers, reporting structure)
- Configure recording consent settings based on legal requirements (one-party vs two-party states)
- Set up recording triggers (auto-record all external meetings vs opt-in)
- Configure transcription language settings and speaker identification
- Establish data retention policies in compliance with company/legal requirements

#### Step 2: Integrate with Video Conferencing and Phone Systems

**Step Overview:** Connect the CIP to all communication channels where customer conversations occur. End state: All video conferencing and phone systems connected and recording properly.

- Integrate with primary video platform (Zoom, Google Meet, Microsoft Teams)
- Connect calendar integration for automatic meeting detection
- Set up phone/dialer integration if applicable (Outreach, Salesloft, RingCentral, Aircall)
- Configure bot/notetaker settings (join timing, display name, participant announcements)
- Test recording and transcription quality across each channel
- Document any channels that cannot be integrated and manual workarounds

#### Step 3: Configure CRM Integration and Field Mapping

**Step Overview:** Establish bidirectional sync between CIP and CRM so conversation data flows automatically to account/opportunity records. End state: CRM integration live with conversation summaries and key data syncing to correct records.

- Connect CRM via native integration (Salesforce or HubSpot)
- Map conversation records to correct CRM objects (Accounts, Contacts, Opportunities)
- Configure which data syncs to CRM (call summaries, action items, custom fields, scores)
- Set up matching rules for linking conversations to correct records
- Create/update CRM fields to receive CIP data (Next Steps, Key Topics, Competitor Mentions)
- Test sync with sample conversations and verify data accuracy in CRM

#### Step 4: Set Up Trackers and AI-Powered Insights

**Step Overview:** Configure keyword trackers, topics, and AI features to surface the insights most valuable to the organization. End state: Custom trackers and insights configured for client's specific needs.

- Define tracker categories: competitors, pricing, objections, next steps, feature requests, churn signals
- Create keyword/phrase trackers for each category (avoid over-reliance on exact keywords - use AI topic detection)
- Configure deal risk scoring and stage verification (if available)
- Set up coaching scorecards based on sales methodology (MEDDIC, BANT, etc.)
- Configure automated alerts for critical mentions (competitor, legal, escalation)
- Test tracker accuracy and refine based on sample calls

---

### Part 4: User Rollout & Adoption

#### Step 1: Develop Training Materials and Resources

**Step Overview:** Create training content that enables users to effectively leverage the platform for their specific roles. End state: Role-based training materials ready for delivery.

- Create role-specific training paths: Rep training, Manager training, Executive dashboards
- Develop quick-start guides for common workflows (reviewing calls, sharing snippets, finding insights)
- Build FAQ document addressing common questions and concerns
- Create video tutorials for key features (searching, filtering, coaching comments)
- Document privacy/compliance guidelines for users (what's recorded, who can see what)
- Prepare "day in the life" examples showing how each role uses the tool

#### Step 2: Conduct Pilot Rollout with Champion Group

**Step Overview:** Roll out to a select group of early adopters who will validate the configuration and become internal champions. End state: Champion group actively using platform with feedback incorporated.

- Select 10-15 champions across teams (mix of enthusiastic + influential users)
- Conduct live training session (60-90 minutes) with champion group
- Provide white-glove support during first 2 weeks
- Gather feedback on configuration, missing features, and adoption barriers
- Iterate on trackers, alerts, and workflows based on champion feedback
- Identify and address user adoption concerns (especially "surveillance" perception)

#### Step 3: Execute Full Team Rollout

**Step Overview:** Expand to all users with structured enablement and change management. End state: All intended users onboarded and actively using the platform.

- Schedule team training sessions by role/department (keep under 60 minutes)
- Position as coaching and enablement tool, NOT surveillance
- Demonstrate value with real examples from pilot (anonymized if needed)
- Provide on-demand training recordings for async learners and new hires
- Set up Slack/Teams channel for questions and tips
- Establish usage expectations (managers review X calls/week, reps share wins)

#### Step 4: Drive Initial Adoption and Engagement

**Step Overview:** Actively drive adoption in the first 30 days to establish habits before users disengage. End state: 80%+ of users actively engaging with the platform.

- Track adoption metrics daily in first 2 weeks (logins, calls reviewed, comments left)
- Identify non-adopters early and provide 1:1 support
- Create "quick wins" - help managers find coaching moments, help reps find competitive intel
- Run weekly adoption check-ins with team leads
- Celebrate early wins publicly (deals saved, skills improved, insights discovered)
- Address technical issues immediately (recording failures, sync errors)

---

### Part 5: Operationalization & Manager Enablement

#### Step 1: Establish Coaching Workflows for Managers

**Step Overview:** Build systematic coaching processes that leverage conversation intelligence data. End state: Managers have repeatable workflows for using CIP in coaching.

- Define coaching cadence (weekly 1:1s include call review, team call review sessions)
- Train managers on finding coachable moments efficiently (filters, search, AI highlights)
- Create coaching templates/checklists managers can use during call reviews
- Set up saved searches and playlists for common coaching scenarios
- Configure manager dashboards showing team performance and coaching opportunities
- Build library of exemplar calls for each stage of sales process

#### Step 2: Configure Reporting and Dashboards

**Step Overview:** Build dashboards and reports that surface actionable insights for different stakeholders. End state: Role-specific dashboards delivering valuable insights without manual effort.

- Create executive dashboard (deal risks, competitive trends, team performance)
- Build manager dashboard (rep scorecards, coaching activity, talk time metrics)
- Set up Marketing/Product dashboard (feature requests, positioning feedback, competitive intel)
- Configure automated reports (weekly deal risk digest, monthly coaching summary)
- Create Customer Success views (health signals, expansion opportunities, churn risks)
- Test that insights are actionable - not just interesting data

#### Step 3: Integrate with Forecasting and Deal Review Processes

**Step Overview:** Embed conversation intelligence data into existing deal review and forecasting workflows. End state: CIP data incorporated into forecast calls and pipeline reviews.

- Add CIP data points to forecast call template (verified stages, buyer engagement scores)
- Train managers to reference call evidence in deal reviews
- Set up deal risk alerts that feed into forecast adjustments
- Connect CIP scores/signals to opportunity fields in CRM for reporting
- Create "conversation evidence" requirement for late-stage deals
- Document how CIP insights should influence stage changes and commit calls

---

### Part 6: Handoff & Continuous Improvement

#### Step 1: Document Configuration and Admin Procedures

**Step Overview:** Create comprehensive documentation for ongoing administration and troubleshooting. End state: Client team has everything needed to self-manage the platform.

- Document all configuration settings (trackers, integrations, permissions, workflows)
- Create admin runbook (adding users, updating trackers, troubleshooting sync issues)
- Document escalation paths for technical issues (vendor support, known issues)
- Record admin training session for future reference
- Create tracker maintenance schedule (quarterly review and refinement)
- Document API configurations if custom integrations were built

#### Step 2: Transfer Ownership and Train Admins

**Step Overview:** Formally hand off platform ownership to client team with appropriate training. End state: Client admin team confident in managing the platform independently.

- Identify 1-2 client platform admins (typically RevOps)
- Conduct admin training session (user management, configuration changes, reporting)
- Transfer credentials and admin access
- Walk through common maintenance tasks and troubleshooting scenarios
- Establish ongoing support arrangement (if applicable)
- Schedule 30-day check-in to address questions and review adoption metrics

#### Step 3: Establish Success Measurement Cadence

**Step Overview:** Set up ongoing measurement against the KPIs defined at project start. End state: Regular reporting cadence showing ROI and areas for optimization.

- Create KPI tracking dashboard comparing baseline to current performance
- Schedule monthly adoption review (usage metrics, feature utilization)
- Set up quarterly business review with stakeholders (ROI, expansion opportunities)
- Document early wins and quantified impact for internal case study
- Identify optimization opportunities (underused features, tracker refinements)
- Plan Phase 2 enhancements based on learnings

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- Active CRM (Salesforce or HubSpot) with proper admin access
- Video conferencing platform in use (Zoom, Teams, or Google Meet)
- Sales team actively conducting virtual customer calls
- Executive sponsorship for recording customer conversations
- Legal/compliance review of recording consent requirements completed
- Budget approved for platform licensing

**What client must provide:**
- CRM admin access (Salesforce or HubSpot)
- Video conferencing admin access
- IT/Security review and approval
- List of users to be licensed (by role: reps, managers, executives)
- Sales methodology/qualification framework documentation (MEDDIC, BANT, etc.)
- Competitive landscape and key competitors to track
- Key objections and topics to monitor
- Stakeholder availability for requirements and training sessions

## 5. Common Pitfalls

- **User adoption failure due to surveillance perception**: Reps resist the tool if positioned as monitoring vs coaching. **Mitigation**: Lead with "this helps you win more deals" messaging. Show reps how to use insights for self-improvement. Have managers use it for positive coaching first (celebrate good calls before critiquing).

- **Over-engineering trackers that require constant maintenance**: Creating dozens of keyword trackers that generate noise and require 40+ hours/month to maintain. **Mitigation**: Start with 10-15 high-value trackers. Use AI topic detection where available. Review and prune trackers quarterly.

- **CRM sync issues causing data quality problems**: Conversations linked to wrong accounts, duplicate records, or missing data breaks trust in the system. **Mitigation**: Spend extra time on matching rules. Test thoroughly before rollout. Monitor sync logs weekly in first month.

- **Implementation delays from underestimating RevOps effort**: Complex platforms like Gong can take 3-6 months to fully implement with ongoing 40+ hours/month maintenance. **Mitigation**: Scope realistic timeline (8-12 weeks minimum). Dedicate RevOps resource. Start simple and add complexity over time.

- **Managers don't change behavior**: Tool is implemented but managers don't actually review calls or change coaching approach. **Mitigation**: Make call review part of formal coaching process. Track manager usage. Start with manager training before rep rollout.

## 6. Success Metrics

- **Leading Indicator**: Manager call review activity (target: each manager reviews 3-5 calls per rep per month within 30 days of rollout)
- **Leading Indicator**: User adoption rate (target: 80%+ of licensed users logging in weekly by day 30)
- **Lagging Indicator**: Improvement in win rate or stage conversion (target: 10-15% improvement within 6 months)
- **Lagging Indicator**: Reduction in new hire ramp time (target: 20-30% faster time to first deal)
- **Lagging Indicator**: CRM data quality improvement (target: 50%+ reduction in empty Next Steps fields)

---

