# Conversation Intelligence Platform Implementation — Advisory

## 1) Project Overview

### What is the name of this project?

Conversation Intelligence Platform Implementation - AI-Powered Sales Conversation Recording, Analysis, and CRM Integration

### What is the purpose of this project?

This project deploys a conversation intelligence platform (Gong, Chorus/ZoomInfo, Clari Copilot, or Jiminny) across go-to-market teams to automatically record, transcribe, and analyze every customer-facing conversation. The platform surfaces deal risks, coaching opportunities, competitive mentions, and buyer sentiment--then syncs that data directly into the CRM so it becomes part of the revenue operating system.

**Core transformation:** From sales leaders making decisions based on rep self-reporting and gut feel to an organization where every coaching conversation, deal review, and forecast call is grounded in actual buyer conversation data.

### What Conversation Intelligence Platform Implementation Unlocks

- Managers can coach reps using real call data instead of relying on rep recollection or shadowing
- Deal risks surface automatically through AI analysis of buyer language, sentiment shifts, and missing qualification criteria
- Competitive intelligence aggregates across hundreds of calls without manual tracking
- CRM records auto-populate with call summaries, next steps, and key topics--eliminating manual note-taking
- New hire ramp accelerates through curated libraries of winning call examples by deal stage
- Marketing and Product teams get direct access to customer voice data for positioning and roadmap decisions

### What business outcomes does this project drive?

**Primary Outcomes:**

- Increased win rates through data-driven coaching--organizations using conversation intelligence report 26-34% higher win rates
- Reduced new hire ramp time by 20-50% through access to structured call libraries and AI-powered coaching
- Improved CRM data quality with 50%+ reduction in empty Next Steps and activity fields through automated sync
- Higher forecast accuracy through conversation-verified deal stages and AI-generated risk scores

**Secondary Outcomes:**

- Foundation for revenue intelligence initiatives (see Methodology for how conversation data feeds forecasting models)
- Cross-functional voice-of-customer data for Product and Marketing teams
- Compliance documentation for regulated industries where call recording is required
- Reduced manager administrative burden--less time chasing reps for updates, more time coaching

### Who in the Org can benefit from this project?

VP Sales, Sales Managers/Directors, Account Executives, SDRs/BDRs, VP Sales Operations, RevOps Manager, VP Marketing, Product Marketing Manager, VP Customer Success, CS Managers, CRO/CEO

### Pain Points this Project Solves

| Pain Point | What Conversation Intelligence Platform Implementation Enables |
|---|---|
| "We have no idea what reps actually say on calls" | Every call recorded and transcribed--searchable by keyword, topic, or speaker |
| "Our managers don't have time to sit in on calls for coaching" | AI highlights coachable moments; managers review 5-minute snippets, not full calls |
| "Reps tell us deals are fine, then they slip or go dark" | Deal risk scoring based on actual buyer engagement and language patterns |
| "We don't know why we lose to competitors" | Automated competitive mention tracking across all conversations |
| "New hires take 6+ months to ramp and we can't scale onboarding" | Curated call libraries and AI coaching accelerate time to first deal |
| "CRM data is unreliable--reps don't log call notes" | Auto-sync call summaries, action items, and key fields to opportunity records |
| "Marketing doesn't know which messaging resonates in real conversations" | Topic and keyword analytics show which positioning lands and which falls flat |

### The Data Behind the Problem

The gap between having call data and using it is substantial. Sales managers review less than 1% of all sales calls, and 75% of sales leaders don't listen to calls at all--even when they have recording tools available. Meanwhile, 73% of managers spend less than 5% of their time coaching.

This coaching deficit has measurable revenue impact. Companies with dynamic sales coaching programs achieve 28% higher win rates, yet 47% of managers spend less than 30 minutes per week coaching each rep. The conversation intelligence market has grown to $22.89 billion in 2024 precisely because organizations recognize this gap: over 65% of U.S. sales teams now use conversation analytics to improve closing rates and coaching.

On the data quality side, sales reps spend up to 72 minutes per day on manual data entry and connecting records across tools. Inaccurate B2B contact data wastes 27.3% of sales reps' time--546 hours per year per full-time inside sales rep. Organizations lose an average of $12.9 million per year due to poor data quality. Conversation intelligence platforms address this directly by auto-logging call data to CRM records.

### Key Metaphors or Frameworks

**"Game Film for Sales"**: Just as professional athletes review game film to improve performance, conversation intelligence gives sales teams their own game film. Coaches don't sit in the stands for every play--they review footage, identify patterns, and build training around what the tape shows. This metaphor works well with sales leaders who value coaching but feel they don't have time for it.

*Use when:* Positioning to VP Sales or Sales Managers who see themselves as coaches. Works particularly well in organizations that already have a coaching culture but lack the tools to scale it.

*Don't use when:* Reps perceive the tool as surveillance. In those contexts, lead with the "personal highlight reel" angle--reps can review their own calls to self-improve and share winning moments.

### Target Motion

Sales-Led Growth (SLG) and hybrid SLG/PLG motions where customer-facing calls are a primary touchpoint. The platform is most valuable when reps conduct 5+ external meetings per week and deals involve multiple stakeholder conversations.

*Not a fit for:* Pure PLG motions with no sales-assist, companies doing fewer than 50 recorded calls per month (insufficient data for AI insights), or organizations where all sales happen in-person with no virtual component.

---

## 2) Tools & Systems

### Primary Tools

**Gong**

Market leader in conversation intelligence. Records calls across Zoom, Teams, Google Meet, and phone systems. AI-powered transcription, deal intelligence, coaching features, and CRM sync. Best native Salesforce integration. Pricing starts around $100-150/user/month with annual commitments and minimum seat counts.

**Chorus (by ZoomInfo)**

Strong conversation intelligence with deep ZoomInfo data integration. Good fit for organizations already in the ZoomInfo ecosystem. Native integration with Salesforce and HubSpot. Typically bundled with ZoomInfo licenses at a discount.

**Clari Copilot (formerly Wingman)**

Conversation intelligence focused on real-time deal coaching and forecasting integration. Strong fit for organizations already using Clari for revenue operations. Lighter-weight than Gong, faster to deploy.

**Jiminny**

Mid-market conversation intelligence platform. Lower price point than Gong, good HubSpot integration, easier self-service setup. Good fit for teams of 10-50 reps who need core recording and coaching without enterprise complexity.

**Salesloft Conversations**

Built into the Salesloft sales engagement platform. Best for teams already on Salesloft who want conversation intelligence without adding another vendor. More limited AI features compared to Gong.

**Integration Ecosystem:**

- Video conferencing: Zoom, Google Meet, Microsoft Teams (integration required)
- Phone/Dialer: Outreach, Salesloft, RingCentral, Aircall, Dialpad (optional integration for phone calls)
- CRM: Salesforce or HubSpot (required integration target)
- Calendar: Google Calendar or Microsoft Outlook (auto-detection of meetings)

---

## 3) Stakeholders & Roles

### Client-Side Stakeholders

**VP Sales / CRO (Executive Sponsor)**

- Required for: Kickoff, platform selection sign-off, adoption messaging, quarterly reviews
- Responsibilities: Champion the initiative, position as coaching tool (not surveillance), set manager expectations for usage

**VP Sales Operations / RevOps Leader (Project Owner)**

- Required for: All phases -- discovery through handoff
- Responsibilities: Provide CRM access, define tracker requirements, own platform administration post-handoff, drive adoption metrics

**Sales Managers/Directors (Primary Users)**

- Required for: Requirements, training, pilot feedback, ongoing coaching adoption
- Responsibilities: Define coaching use cases, validate tracker accuracy, adopt call review workflows, model desired usage behavior

**IT/Security Lead (Approver)**

- Required for: Platform evaluation, security review, integration approval
- Responsibilities: Approve vendor security posture, authorize integrations, review data retention policies

**Legal/Compliance (Approver)**

- Required for: Pre-implementation compliance review
- Responsibilities: Confirm recording consent requirements by jurisdiction, approve disclosure language, review data retention policies

### Technical Owners

**RevOps Manager / Sales Operations Manager (Primary Technical Owner)**

- Owns platform configuration and ongoing administration post-handoff
- Manages user provisioning, tracker maintenance, and integration monitoring
- First point of contact for sync issues, recording failures, and configuration changes

**CRM Administrator (Secondary Technical Owner, if separate from RevOps)**

- Required when: CRM admin is a separate role from RevOps (common in organizations with 100+ CRM users)
- Handles: CRM-side field creation, permission sets, workflow rules triggered by CIP data

**Enterprise Considerations:**

- Organizations with multiple business units may need separate CIP workspaces with different configurations
- Global deployments require country-specific recording consent configurations
- SOC 2 or ISO 27001 environments may need additional security review cycles (add 2-4 weeks)

---

## 4) Scoping

### Scoping Factors

**1. Platform Selection Status**

- Platform already selected and licensed -- Implementation-only scope (saves 20-40 hours)
- Platform not yet selected -- Include vendor evaluation, demos, and pilot in scope (adds 20-40 hours)

**2. Number of Communication Channels**

- Video conferencing only (Zoom/Teams/Meet) -- Standard integration complexity
- Video + phone/dialer system -- Additional integration and testing required (adds 10-20 hours)
- Video + phone + in-person (via mobile recording) -- Complex multi-channel setup (adds 15-25 hours)

**3. CRM Complexity**

- Single CRM, standard objects -- Straightforward field mapping
- Single CRM, custom objects or complex opportunity structure -- Additional mapping and matching rules needed (adds 10-15 hours)
- Multiple CRMs or CRM + data warehouse -- Significant additional integration work (adds 20-40 hours)

**4. Team Size and Structure**

- Under 25 users -- Single-phase rollout feasible
- 25-100 users -- Champion group pilot recommended before full rollout (adds 1-2 weeks)
- 100+ users -- Phased rollout by department/region required (adds 3-4 weeks)

**5. Compliance Requirements**

- All users in one-party consent jurisdictions -- Standard disclosure configuration
- Mix of one-party and two-party consent states -- Per-user or per-meeting consent rules required (adds 5-10 hours)
- International calls (GDPR, etc.) -- Additional compliance configuration and legal review (adds 10-20 hours)

**6. Sales Methodology Maturity**

- Established methodology (MEDDIC, BANT, SPIN, etc.) documented -- Can build coaching scorecards immediately
- Methodology exists but undocumented -- Needs documentation before scorecard creation (adds 5-10 hours)
- No formal methodology -- Coaching scorecards deferred to Phase 2 post-adoption

**7. Tracker Complexity**

- Basic trackers (5-10 categories: competitors, pricing, objections) -- Standard configuration
- Advanced trackers (15-25 categories with custom AI topic models) -- Iterative tuning required (adds 10-20 hours)
- Enterprise tracker requirements (compliance keywords, multi-language) -- Significant configuration effort (adds 20+ hours)

### Multiple Approaches

**Approach 1: Focused Launch**

- Criteria: Platform already selected, single team (AEs or SDRs), standard CRM, basic tracker needs
- Execution: 8-10 week implementation. Platform config, single CRM integration, 10-15 trackers, one training session per role, 2-week pilot with champions, full team rollout.

**Approach 2: Full GTM Rollout**

- Criteria: Platform selected, multiple teams (Sales + CS or Sales + Marketing), CRM + dialer integration, coaching scorecards needed
- Execution: 10-14 week implementation. Multiple integration points, role-specific trackers, phased rollout (Sales first, then CS/Marketing), manager coaching workflow design.

**Approach 3: End-to-End (Selection + Implementation)**

- Criteria: Platform not yet selected, or significant vendor evaluation needed. Enterprise-level requirements.
- Execution: 14-20 week project. Vendor evaluation (2-4 weeks), pilot (2-4 weeks), then full implementation. Custom API work, advanced trackers, multi-team phased rollout, ongoing optimization period.

---

## 5) Discovery Questions

### Questions for Project Kickoff

**Business Context**

- What is the primary driver for this initiative? (Coaching, deal visibility, competitive intelligence, CRM data quality, all of the above?)
- What specific revenue outcomes are you hoping to impact? (Win rate, ramp time, forecast accuracy, churn?)
- Has the organization tried conversation recording or intelligence tools before? What happened?

**Current State**

- How do managers currently coach reps? What does a typical coaching session look like today?
- What percentage of customer calls are conducted virtually vs. phone vs. in-person?
- How are reps currently logging call notes and next steps in the CRM? What is the compliance rate?
- Do you have an established sales methodology? (MEDDIC, BANT, SPIN, Challenger, custom?) Is it documented?

**Technical Environment**

- Which CRM are you on? (Salesforce edition, HubSpot tier) Who is the CRM admin?
- What video conferencing platform(s) are used? (Zoom, Teams, Meet -- or multiple?)
- Are phone calls a significant channel? If so, what dialer/phone system is in use?
- Are there existing recording tools in place? (Zoom cloud recording, Teams recording, etc.)
- Any existing integrations that touch opportunity or activity records that could conflict?

**Compliance & Legal**

- Have you completed a legal review of recording consent requirements for your territories?
- Do you sell into two-party consent states (California, Florida, Illinois, etc.) or international markets (GDPR)?
- Are there data retention policies or industry-specific compliance requirements? (HIPAA, SOX, etc.)

**Team & Adoption**

- How large is the team to be rolled out? How many managers, reps, and executives?
- Who will own platform administration after handoff? (RevOps, Sales Ops, IT?)
- Is there executive sponsorship for this initiative? Who is the champion?
- What is the team's general appetite for new tools? Have recent tool adoptions succeeded or struggled?

### Information to Gather Before Implementation

**CRM Access & Configuration:**

Salesforce or HubSpot admin credentials, current object model documentation (Account/Contact/Opportunity fields), any existing automation rules that touch activity or opportunity records. Need full admin access, not just user-level.

**User Roster:**

Complete list of users to license by role (Rep, Manager, Executive, Admin). Include team/reporting structure for workspace hierarchy setup. Need names, emails, roles, and manager assignments.

**Sales Methodology Documentation:**

Written qualification framework (MEDDIC criteria, BANT questions, etc.) if one exists. Needed for coaching scorecard configuration. If undocumented, schedule a 60-minute session with VP Sales to capture it.

**Competitive Landscape:**

List of top 5-10 competitors to track, including common names/abbreviations used in calls. List of key objections and topics to monitor. Product/Marketing typically has this documented.

**Compliance Requirements:**

Legal team confirmation on recording consent approach (universal disclosure recommended). Data retention policy. Any industry-specific requirements.

### Approach Decision Questions

| Question | Answer leads to Approach |
|---|---|
| Is the platform already selected and licensed? | No = Approach 3 (End-to-End), Yes = Approach 1 or 2 |
| How many teams will use the platform at launch? | 1 team = Approach 1, 2+ teams = Approach 2 |
| Are phone/dialer calls a significant channel? | No = Approach 1, Yes = Approach 2 (additional integration) |
| Do you need coaching scorecards at launch? | No = Approach 1, Yes = Approach 2 |
| Do you sell into two-party consent or international markets? | No = simpler compliance, Yes = adds 5-20 hours to any approach |
| Team size above 100? | Yes = Approach 2 minimum (phased rollout required) |

---

## 6) Overcoming Common Belief Barriers

### "This is just a surveillance tool -- our reps will hate it"

The surveillance perception is real and is the number one cause of adoption failure in conversation intelligence deployments. But the data tells a different story about what happens when it is positioned correctly: 81% of high-growth companies use call recordings to improve performance, and organizations that deploy conversation intelligence see 26-34% higher win rates.

The difference is entirely in how leadership frames and uses the tool. Organizations that fail position it as "we're going to listen to your calls." Organizations that succeed position it as "you now have game film to improve your own performance, and your manager can coach you on specific moments instead of vague feedback."

Practical steps that prevent the surveillance perception:

1. Start with positive coaching--managers share "great call" examples before any corrective feedback
2. Give reps self-service access to review their own calls first
3. Make sharing call snippets a two-way street (reps share wins, managers highlight coachable moments)
4. Never use call recordings in performance reviews for the first 90 days

**The reframe:** "This isn't about monitoring -- it's about giving every rep access to the coaching and call libraries that top-performing teams already use. Reps at companies with strong coaching programs achieve 28% higher win rates."

### "We already have Zoom/Teams recordings -- why pay more?"

Zoom and Teams record meetings. That is where their functionality ends. The recordings sit in a cloud folder, unsearchable, unanalyzed, and disconnected from CRM records. No one watches full hour-long recordings for coaching.

Conversation intelligence platforms provide: AI transcription with speaker separation, keyword and topic search across all calls, automated CRM field population (summaries, next steps, competitor mentions), coaching workflows with timestamped comments, deal risk scoring based on conversation patterns, competitive intelligence aggregated across hundreds of calls, and coaching scorecards aligned to sales methodology.

The analogy: Zoom recordings are security camera footage. Conversation intelligence is a sports analytics platform. One captures video; the other makes the video actionable.

| Capability | Zoom/Teams Recording | Conversation Intelligence Platform |
|---|---|---|
| Records calls | Yes | Yes |
| AI transcription + search | No | Yes |
| Auto-sync data to CRM | No | Yes |
| Coaching workflows + comments | No | Yes |
| Deal risk scoring | No | Yes |
| Competitive intelligence | No | Yes |
| Coaching scorecards | No | Yes |
| ROI from data | None | 481% three-year ROI |

**The reframe:** "Recordings without analysis are just storage costs. The value isn't in recording the call -- it's in what you do with the data afterward."

### "We tried this before and nobody used it"

Previous adoption failures almost always trace to one of three root causes: (1) it was positioned as surveillance, (2) managers didn't change their behavior, or (3) the tool was over-configured with noisy trackers that created alert fatigue.

The implementation approach matters more than the tool choice. See Implementation for the champion-first rollout strategy that addresses each failure mode:

- Champions validate configuration before broad rollout
- Manager training happens before rep training (managers model desired behavior)
- Trackers start with 10-15 high-value categories, not 50+ noisy keywords
- Usage expectations are explicit (managers review X calls/week, reps share Y wins/month)

**The reframe:** "The tool didn't fail -- the rollout did. With the right adoption sequence (champions first, managers trained before reps, explicit usage expectations), organizations consistently hit 80%+ weekly active usage within 30 days."

### "Our team is too small for this"

A team of 5 reps conducting 5+ external calls per week generates 100+ calls per month. That is already far more than any manager can review manually. The question is not headcount but call volume and whether the coaching gap is costing you deals.

For smaller teams ($5-15M ARR, 5-15 reps), the ROI often comes from a different place than enterprise: faster new hire ramp (critical when every rep matters), win rate improvement on the deals you do have (smaller pipeline means each deal matters more), and founder/VP Sales time savings (stop sitting in on every call to know what is happening).

**The reframe:** "Smaller teams actually see faster ROI because each deal and each rep matters more. A 10% win rate improvement on a 50-deal pipeline is 5 more closed deals."

---

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

| Power 10 Metric | Impact Direction | Expected Magnitude | Notes |
|---|---|---|---|
| Opp-to-CW Conversion | Increase | +10-34% | Coaching on actual call data improves qualification and closing |
| Sales Cycle Time | Decrease | -10-20% | Faster deal progression through better next-step capture and risk alerts |
| New Hire Ramp Time | Decrease | -20-50% | Call libraries and AI coaching accelerate time to first deal |
| Forecast Accuracy | Increase | +15-25% | Conversation-verified deal stages replace rep self-reporting |
| Gross Retention | Increase | +5-10% | CS teams detect churn signals earlier through conversation analysis |

### Expected Outcomes

| Metric | Before | After | Source |
|---|---|---|---|
| Manager call review rate | Less than 1% of calls reviewed | 3-5 calls per rep per month reviewed | Avoma research |
| Win rate | Baseline (varies) | +26-34% improvement | Gong Labs, Mintel case study |
| New hire ramp time | 3-5 months average | 20-50% reduction | Jiminny, Gong research |
| CRM data quality (empty fields) | 40-60% of Next Steps fields empty | 50%+ reduction in empty fields | Auto-sync from CIP |
| Rep time on manual CRM updates | 72 min/day on data entry | 15-30 min/day (summaries auto-populated) | Salesforce research |
| Forecast accuracy | Based on rep self-reporting | Conversation-verified with deal risk scores | Platform analytics |
| User adoption (weekly active) | N/A | 80%+ within 30 days of rollout | Industry benchmark |

### How to Measure Success

**Leading Indicators (Early signals, Week 1-4):**

- Platform login rate: 80%+ of licensed users logging in weekly by day 30
- Manager call review activity: each manager reviewing 3-5 calls per rep per month
- Recording capture rate: 90%+ of external meetings being recorded (check for gaps in phone calls or specific meeting types)
- CRM sync verification: spot-check 20 recent calls and confirm summaries and fields populated correctly
- Champion group NPS: survey pilot users at week 2--target 7+ average score

**Lagging Indicators (Proof of success, Month 2-6):**

- Win rate improvement: 10-15% increase in Opp-to-CW conversion within 6 months (compare cohorts pre/post)
- New hire ramp time: track time-to-first-deal for reps onboarded with vs. without conversation intelligence
- CRM data completeness: measure reduction in empty Next Steps, Competitor, and Call Summary fields
- Coaching cadence adherence: percentage of managers conducting weekly call reviews using platform data
- Forecast accuracy: compare forecast variance pre/post implementation over 2+ quarters

---

## References

[1] Avoma - Sales Coaching: Why Sales Leaders Review Less Than 1% of Calls

[2] Salesforce - State of Sales Report

[3] Forrester TEI Study - 481% ROI for Gong Revenue Intelligence Platform

[4] Gong Case Study - Mintel Achieves 34% Win Rate Increase

[5] Jiminny - The True Impact Rep Ramp Times Have on Business Growth

[6] MySalesCoach - Sales Coaching Statistics 2026

[7] Gitnux - Sales Coaching Statistics 2025

[8] Market Growth Reports - Conversation Intelligence Platform Market 2033

[9] Plauti - The Hidden Costs of Poor CRM Data

[10] Gartner - Data Quality Market Survey
