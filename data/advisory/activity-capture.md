# Activity Capture — Advisory

## 1) Project Overview

### What is the name of this project?

Activity Capture - Automated Sales Activity Logging and CRM Data Completeness

### What is the purpose of this project?

Activity Capture deploys automated tools and integrations that capture all sales activities -- emails, calls, meetings, and calendar events -- directly into the CRM without manual rep input. The project eliminates the data entry burden that costs reps 5+ hours per week, fills the massive gap between actual communication volume and what gets logged (typically only 10-15% of activities), and gives leadership accurate visibility into sales engagement patterns.

**Core transformation:** From blind leadership making decisions on 10-15% of actual sales activity data to full automated visibility across every rep interaction, with zero manual logging required.

### What Activity Capture Unlocks

After Activity Capture is complete, the sales organization gains:

- Complete engagement history on every Contact, Account, and Opportunity record without rep effort
- Accurate activity-based coaching data so managers can identify reps who need help before deals slip
- Foundation for activity-based forecasting models that correlate engagement volume to win rates
- Data to answer "what does a winning deal look like?" based on actual touchpoint patterns
- Elimination of the #1 complaint from sales reps: mandatory CRM data entry

### Before/After Comparison

| Aspect | Before | After |
|--------|--------|-------|
| Sales activities logged in CRM | Only 10-15% | 90%+ of emails, meetings, and calls auto-captured |
| Rep time on manual data entry | 5+ hours/week | Zero manual activity logging required |
| Manager visibility | Cannot see rep engagement patterns | Full visibility into activity volume, frequency, and distribution by rep |
| Forecasting approach | Relies on rep self-reporting | Activity data available as a leading indicator for deal health |
| Contact/account records | Incomplete | Every interaction linked to the correct CRM record automatically |
| Rep perception | "Big Brother" perception drives logging avoidance | Automated capture removes the friction and the stigma |

### What business outcomes does this project drive?

**Primary Outcomes:**

- Recovered selling time: reps save 5+ hours/week previously spent on manual data entry, reclaiming up to 200 hours per year per rep
- Complete CRM data: activity capture rates exceed 90%, up from 10-15% with manual logging
- Accurate engagement visibility: managers see real activity volume by rep, account, and opportunity

**Secondary Outcomes:**

- Foundation for activity-based forecasting (requires correlation analysis after 60-90 days of complete data)
- Improved manager coaching conversations driven by objective activity data rather than rep self-reporting
- Data infrastructure for revenue intelligence tools (Clari, Gong) that depend on complete activity records
- CRM health score improvements that support board reporting and investor due diligence

### Who in the Org can benefit from this project?

VP Sales, CRO, Sales Managers, SDRs, AEs, VP Sales Operations, RevOps Manager, Sales Enablement Lead

### Pain Points this Project Solves

| Pain Point | What Activity Capture Enables |
|------------|------------------------------|
| "Our reps spend too much time on data entry instead of selling" | Automated capture eliminates manual logging -- reps save 5+ hours/week |
| "We can't see what our reps are actually doing" | Full email, meeting, and call activity visible on every CRM record |
| "Our CRM data is incomplete -- only a fraction of activities get logged" | Capture rates jump from 10-15% to 90%+ with automated sync |
| "We don't trust our activity reports because they depend on reps logging" | Automated capture removes human compliance as a variable |
| "Managers can't coach effectively without seeing engagement patterns" | Activity dashboards show volume, frequency, and distribution by rep and account |
| "Our forecasting doesn't account for engagement levels" | Complete activity data enables correlation between touchpoints and deal outcomes |
| "New reps have no context on account history when they inherit deals" | Every prior email, meeting, and call is automatically on the record |

### The Data Behind the Problem

The gap between actual sales communication and what gets logged in CRM is well-documented:

- "Sales reps spend only 28% of their time actually selling" -- the rest goes to administrative tasks including CRM data entry. A separate study found 32% of sales reps spend more than one hour per day on manual data entry alone.
- "CRM automation reduces administrative tasks by up to 80%" and saves teams 4-5 hours per week per rep by eliminating manual data entry and duplicate work.
- "AI-powered CRM automation boosts sales productivity by up to 34%" when manual data entry is removed from the workflow.
- "CRM software reduces employee workload by 5-10 hours per week" according to 43% of businesses surveyed.
- "Automation cuts lead research and response times by more than 60%", meaning the time savings compound beyond just data entry.

The business case is straightforward: if you have 20 reps each saving 5 hours per week, that is 5,200 recovered selling hours per year.

### Key Metaphors or Frameworks

**The Security Camera Metaphor:** Activity capture works like security cameras in a retail store. Nobody has to manually write down every customer interaction -- the cameras record everything automatically. Reps don't have to change their behavior at all; they just send emails, take calls, and attend meetings like they always do. The system captures it.

_When to use:_ When reps express concern about additional work or process change. This metaphor clarifies that activity capture requires zero behavior change from them.

_When NOT to use:_ When reps express privacy or surveillance concerns. The security camera metaphor can reinforce "Big Brother" fears. Switch to the "automatic receipt" framing instead -- "Just like your credit card automatically tracks every purchase, activity capture tracks every sales touchpoint. It's a record for you, not surveillance of you."

### Target Motion

Activity Capture fits any sales motion that involves email, calendar, and phone communication with prospects and customers:

- **Sales-Led Growth (SLG):** Primary fit. High-touch sales cycles generate the most activity data and benefit most from automated capture.
- **Hybrid SLG/PLG:** Strong fit for the sales-assisted portion of the motion.
- **Outbound-heavy:** Strong fit. SDR/BDR teams generate high email and call volume that is difficult to log manually.
- **Inbound-led:** Good fit. Ensures inbound responses and follow-ups are tracked alongside marketing-sourced activities.

_Not a fit for:_ Pure product-led growth companies with no sales team or human-to-human communication. Also not appropriate for organizations where all communication happens inside a single platform that already logs natively (e.g., all communication via Salesforce Email-to-Case).

### Common Belief Barriers

**"Our reps should just log their activities -- it's part of the job."** -- Manual logging has a ceiling of 10-15% compliance regardless of enforcement. The issue is not willingness; it is that manual entry competes with selling time. Reps who log more are often selling less. Automated capture removes the trade-off entirely.

**"We already have Salesforce Einstein Activity Capture -- aren't we covered?"** -- Einstein Activity Capture historically stored data in a separate cloud outside Salesforce, making captured activities unavailable for reports, dashboards, automations, or API queries. Salesforce's Summer '25 release addressed this for new email syncs, but calendar events and historical data may still have limitations. Whether EAC is sufficient depends on whether you need activities in standard Salesforce reporting. See Methodology for the detailed tool comparison framework.

**"This sounds like Big Brother monitoring."** -- Activity capture records the same data that already exists in email and calendar systems. It does not record call content (that is Conversation Intelligence, a separate project), does not track browsing or desktop activity, and does not change what reps do. The purpose is data completeness, not surveillance. Framing it as "we're giving you credit for work you already do" shifts the conversation.

**"We tried this before and the data was messy -- duplicates, wrong records, missing links."** -- Data quality issues typically result from poor initial configuration, not tool limitations. The implementation process includes contact matching logic, domain-to-account mapping, duplicate handling rules, and a pilot phase specifically to catch these issues before full rollout. See Implementation for the detailed configuration and QA process.

---

## 2) Tools & Systems

### Primary Tools

**Einstein Activity Capture (Salesforce native)**

Salesforce's built-in activity sync for email and calendar. Included with Sales Cloud licenses. Connects to Google Workspace or Microsoft 365 via OAuth. Historical limitation: activities stored outside core Salesforce objects and unavailable for reports/automation. Summer '25 release changed this for new email setups, but calendar and legacy data constraints remain.

**Revenue Grid**

Third-party activity capture platform with full native Salesforce integration. Writes activities to standard Salesforce objects, making them available for reports, dashboards, and automation. Activity Capture 360 at $30/user/month. Supports email, calendar, and has broader object association capabilities.

**Clari Capture**

Part of Clari's revenue orchestration platform. Auto-captures email and calendar activities and syncs to CRM. Strongest when combined with Clari's forecasting and pipeline management tools. Requires separate module for call tracking.

**Ebsta**

Revenue intelligence platform focused on relationship analytics and engagement scoring. Captures email and calendar activities and provides relationship strength metrics. Strong CRM integration. Best for organizations that want activity capture combined with relationship health tracking.

**Affinity**

Relationship intelligence platform that captures activity data and maps relationship networks. Unlimited data retention (unlike Einstein's 24-month limit). Best fit for relationship-driven sales teams (professional services, financial services, VC).

---

## 3) Stakeholders & Roles

### Client-Side Stakeholders

**VP Sales or CRO (Executive Sponsor)**

- Required for: Kickoff, rollout communication, adoption enforcement
- Responsibilities: Communicates expectations to sales team, reinforces adoption, resolves "Big Brother" concerns from leadership level

**VP Sales Operations or RevOps Leader (Technical Owner)**

- Required for: All phases -- discovery through handoff
- Responsibilities: Provides CRM access, approves data model decisions, owns ongoing monitoring post-handoff

**IT/Security Lead (Input Provider)**

- Required for: Pre-kickoff (OAuth approval), configuration (system access)
- Responsibilities: Grants OAuth permissions, approves data sharing between systems, provides email admin access

**Sales Managers (Input Providers)**

- Required for: Pilot testing, rollout, training
- Responsibilities: Nominate pilot users, provide feedback on activity visibility needs, reinforce adoption with their teams

### Technical Owners

**RevOps Manager or Salesforce Admin**

- Owns ongoing activity capture monitoring post-handoff
- Manages user provisioning for new hires
- Troubleshoots sync errors and orphaned activities
- Maintains dashboard accuracy and reporting

**IT Admin (If Separate)**

- Needed when email/calendar system is managed by a separate IT team
- Handles OAuth token renewals and domain-wide delegation settings
- Manages security policy exceptions for activity capture integrations

**Enterprise Considerations (If Applicable)**

- Large organizations may require InfoSec review and approval for data flow between email system and activity capture tool
- Multi-region deployments may need separate OAuth configurations per region
- Companies with data residency requirements should verify where the activity capture tool stores synced data

---

## 4) Scoping

### Scoping Factors

**1. CRM Platform**

- Salesforce Enterprise/Unlimited -- full API access, broadest tool compatibility
- Salesforce Professional -- limited API, may restrict third-party tool options; Einstein Activity Capture still available
- HubSpot Professional/Enterprise -- native activity tracking built in, but may need enhancement for full capture

**2. Email/Calendar System**

- Google Workspace -- broad tool support, admin console for domain-wide delegation
- Microsoft 365 -- broad tool support, Azure AD app registration required
- Mixed environment (some reps on Google, some on Microsoft) -- increases configuration complexity, may require separate sync profiles

**3. Number of Communication Channels**

- Email + Calendar only -- standard scope (30-40 hours)
- Email + Calendar + Phone/Dialer -- extended scope (40-50 hours), requires dialer integration configuration
- Email + Calendar + Phone + LinkedIn/SMS -- maximum scope (50-60 hours), some channels may require manual logging documentation

**4. User Count**

- Under 25 users -- single-phase rollout feasible
- 25-100 users -- phased rollout by team (SDR, AE, management) recommended
- 100+ users -- phased rollout with dedicated pilot group and extended monitoring

**5. Data Visibility Policy**

- Open visibility (all managers see all rep activities) -- standard configuration
- Restricted visibility (reps' activities visible only to their direct manager) -- requires permission set configuration and role hierarchy mapping
- Hybrid (some fields shared, some private) -- most complex, requires custom visibility rules

**6. Activity Reporting Requirements**

- Display-only (activities visible on records but not needed in reports) -- Einstein Activity Capture may suffice
- Full reporting and dashboards -- requires tool that writes to standard CRM objects (Revenue Grid, Ebsta) or EAC with Summer '25 native sync enabled
- Automation triggers (e.g., no activity in 14 days triggers alert) -- requires activities as native CRM records

### Multiple Approaches

**Approach 1: Native CRM Activity Capture (Einstein Activity Capture)**

- Criteria: Salesforce Sales Cloud customer, display-only activity needs acceptable, budget-conscious, willing to accept known EAC limitations on reporting and calendar events
- Execution: Configure EAC within Salesforce, connect Google Workspace or Microsoft 365, set sync preferences. Faster setup (30-35 hours) but ongoing limitation management required.

**Approach 2: Third-Party Activity Capture Tool (Revenue Grid, Clari Capture, Ebsta)**

- Criteria: Full reporting requirements, need activities as standard CRM objects, want advanced features (relationship scoring, revenue intelligence), budget approved for per-user licensing ($30-$150/user/month)
- Execution: Procure and deploy third-party tool, configure CRM connection, map fields, set up sync rules. Longer setup (40-60 hours) but richer data model and reporting capability.

**Approach 3: CRM-Native + Phone Integration Hybrid**

- Criteria: Email and calendar handled by CRM-native tool, but phone/dialer requires separate integration (RingCentral, Dialpad)
- Execution: Deploy EAC or HubSpot native for email/calendar, configure dialer integration separately for call logging. Moderate complexity (40-50 hours), requires testing cross-channel deduplication.

---

## 5) Discovery Questions

### Questions for Project Kickoff

**Business Context**

- What is driving the urgency for activity capture right now? _(Identifies whether this is a visibility problem, a rep productivity problem, or a prerequisite for another initiative)_
- How do you currently measure sales rep engagement levels? _(Reveals baseline and exposes the gap)_
- What decisions would you make differently if you had complete activity data? _(Clarifies the real business outcome they want)_

**Current State**

- What percentage of sales activities do you estimate are currently logged in CRM? _(Baseline for measuring improvement)_
- How much time do reps spend on manual data entry per day? _(Quantifies the productivity pain)_
- Have you tried activity capture tools before? What happened? _(Identifies previous failures and concerns to address)_
- Are there any existing partial capture tools in place -- e.g., Outreach logging only sequenced emails? _(Prevents duplicate activity records)_

**Technical Environment**

- What CRM are you using, and what edition/tier? _(Determines API access and tool compatibility)_
- What email system does the sales team use -- Google Workspace or Microsoft 365? _(Determines OAuth configuration path)_
- What phone/dialer systems are in use? _(Scopes call capture requirements)_
- Are there any IT security policies that restrict OAuth connections or data sharing between systems? _(Early blocker identification)_
- Do you have CRM admin access, or does that require IT involvement? _(Identifies stakeholder dependencies)_

**Expectations and Concerns**

- What level of activity visibility do you need -- display on records, reports/dashboards, or automation triggers? _(Drives tool selection -- see Scoping Factors #6)_
- How do you expect the sales team to react? Any prior "Big Brother" pushback? _(Shapes change management approach)_
- Is there a budget range for per-user licensing if a third-party tool is recommended? _(Constrains tool selection)_
- What is your target go-live timeline? _(Scopes rollout phasing)_

### Approach Decision Questions

| Question | Answer -- Approach |
|----------|-------------------|
| Do you need activities available in CRM reports and dashboards? | Yes = Third-party tool (Approach 2); Display-only acceptable = EAC may work (Approach 1) |
| What is the per-user budget for activity capture tooling? | $0 = EAC (Approach 1); $30-150/user/month = Third-party (Approach 2) |
| Do you need phone call capture in addition to email/calendar? | Yes = Hybrid approach likely (Approach 3); No = Approach 1 or 2 |
| Are you a Salesforce customer on Enterprise or Unlimited edition? | Yes = All approaches available; Professional = EAC only or HubSpot-specific path |
| Do you want activity data to trigger automations (e.g., no-activity alerts)? | Yes = Must use tool that writes to standard CRM objects (Approach 2); No = Any approach |

---

## 6) Overcoming Common Belief Barriers

### "Our reps should just log their activities -- it's part of the job."

Manual logging fails at scale, regardless of enforcement. Research shows sales reps spend only 28% of their time selling, and 32% spend more than an hour per day on manual data entry. Even with strict logging mandates, organizations typically capture only 10-15% of actual sales activities because reps prioritize selling over documentation. The highest-performing reps are often the worst loggers because they are the busiest.

Automated capture does not reward laziness -- it removes a false trade-off between selling and documentation. Reps can do both when capture is automatic.

**The reframe:** "The question is not whether reps should log -- it's whether logging should compete with selling time. Automated capture means you get 100% of the data without sacrificing a single minute of selling."

### "We already have Einstein Activity Capture -- aren't we covered?"

Einstein Activity Capture has historically stored synced activities in a separate external data store (AWS/Hyperforce), outside of core Salesforce objects. This means captured activities were not available in Salesforce reports, dashboards, Flows, or automations. Salesforce's Summer '25 release began addressing this for newly captured emails, but calendar events, historical data, and existing EAC configurations may still have limitations.

The key diagnostic question is: "Can you pull a Salesforce report right now showing all emails sent by your sales team in the last 30 days from EAC data?" If the answer is no, EAC is providing display-only value, not reporting value.

| EAC Capability | Before Summer '25 | After Summer '25 (new setups) |
|---|---|---|
| Email display on records | Yes | Yes |
| Email in Salesforce reports | No | Yes (if enabled) |
| Calendar in reports | No | Limited |
| Automation triggers | No | Partial |
| Custom object association | No | No |

**The reframe:** "EAC gives you visibility on individual records, but if you need activity data in reports, dashboards, or automations, you may need to evaluate whether EAC's current capabilities match your requirements -- or whether a tool that writes to standard objects is a better fit."

### "This sounds like Big Brother monitoring."

Activity capture records the same email metadata and calendar events that already exist in Google Workspace or Microsoft 365. It does not record email body content on most configurations (only subject line and timestamp), does not record call content (that is Conversation Intelligence -- a separate project), and does not track desktop activity, browsing, or location.

The framing that works: activity capture gives reps credit for work they already do. Instead of managers asking "what have you been doing?" and reps scrambling to reconstruct from memory, the data speaks for itself. Reps who are working hard benefit the most because their effort is visible without extra work.

Proactive transparency also helps: during rollout training, show reps exactly what is captured and what is not. Let them see their own activity data first. Address the concern directly rather than hoping it goes away.

**The reframe:** "We're not adding monitoring -- we're removing the burden of self-reporting. Your reps are already doing the work. Activity capture just makes it visible without extra effort."

### "We tried this before and the data was messy -- duplicates, wrong records, missing links."

Data quality issues in activity capture almost always trace to three configuration gaps: (1) missing contact matching logic so activities go to wrong records, (2) no domain-to-account mapping so activities orphan without account association, and (3) no duplicate handling when multiple tools write to the same CRM records.

The implementation process addresses each of these with specific configuration steps, edge case testing (new leads without accounts, contacts at multiple companies, shared domains), and a 3-5 day pilot with selected users before full rollout. See Implementation for the detailed configuration and QA process.

**The reframe:** "Messy data is a configuration problem, not a tool problem. The right setup with proper matching logic, domain mapping, and pilot testing produces clean data. That's exactly what this project delivers."

---

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

| Power 10 Metric | Impact Direction | Expected Magnitude | Notes |
|---|---|---|---|
| Pipeline Production | Indirect ↑ Increase | +10-15% | Recovered selling time (5+ hrs/week per rep) redirected to pipeline generation |
| Opp-to-CW Conversion | Indirect ↑ Increase | +5-10% | Better coaching from activity visibility improves deal execution |
| Sales Cycle Time | ↓ Decrease | -5-10% | Complete engagement data enables earlier identification of stalled deals |
| Rep Ramp Time | ↓ Decrease | -10-20% | New reps inherit full account engagement history on every record |

### Expected Outcomes

| Metric | Before | After | Source |
|--------|--------|-------|--------|
| Activity capture rate (% of actual activities logged in CRM) | 10-15% | 90%+ | Pre/post comparison of CRM activity counts vs. email/calendar volume from IT |
| Rep time on manual data entry | 5-8 hours/week | Near zero | Rep time surveys pre/post deployment |
| Activities available in CRM reports | Partial or none (if EAC display-only) | 100% of captured activities reportable | CRM report validation |
| Orphaned activities (not linked to Account) | 20-40% of logged activities | Under 5% | Activity linkage quality report |
| Manager coaching sessions using activity data | Ad hoc | Weekly, data-driven | Manager feedback and dashboard usage tracking |

### How to Measure Success

**Leading Indicators (Early signals, Week 1-4):**

- Activity capture rate exceeds 90% within first 2 weeks (compare CRM activity count to email/calendar volume from IT reports)
- Zero sync errors in monitoring dashboard for 5 consecutive business days
- 100% of pilot users have activity capture active and syncing
- Orphaned activity rate below 5% (activities linked to correct Account/Contact records)

**Lagging Indicators (Proof of success, Month 2-6):**

- Rep-reported time savings of 5+ hours/week on data entry (via survey at 30 and 90 days)
- Increase in manager coaching conversations referencing activity data
- Improvement in activity-based forecasting accuracy (requires 60-90 days of complete data)
- CRM data quality score improvement in quarterly health audits
- Reduction in "no activity in 14+ days" alerts on active opportunities

---

## References

[1] Affinity - CRM Automation: What Is an Automated CRM

[2] Salesforce State of Sales - Sales Reps Spend 28% of Time Selling

[3] Nutshell - CRM Statistics That Prove CRM Helps Increase Revenue 2025

[4] Hints AI - Fix Manual Data Entry: AI-Powered CRM Solutions

[5] EverReady - Einstein Activity Capture Limitations: The 12 Biggest Problems

[6] Riva - Einstein Activity Capture in Salesforce: Benefits, Limits and Alternatives

[7] Revenue Grid - Einstein Activity Capture vs Revenue Grid

[8] Ebsta - Clari Comparison

[9] Affinity - Salesforce Activity Tracking Enhancement
