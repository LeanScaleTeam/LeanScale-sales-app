# Lead Scoring Model (Product-Led) — Implementation

## Project One-Pager

### Lead Scoring Model (Product-Led) One-Pager

#### Project Type

- Category: Balanced (Strategy + Technical)
- Primary Deliverable: Working, automated PQL-based lead scoring system integrated into CRM/MAP that surfaces Product-Qualified Leads for sales prioritization

##### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Heavy | 3-4 refinement loops -- ICP fit criteria, product signal mapping, threshold alignment |
| 2. Engineering | Yes | Heavy | CRM/MAP scoring rules, product analytics integration, workflow automation |
| 3. Enablement | Yes | Medium | Sales training on PQL interpretation, score-based prioritization |
| 4. Handoff | Yes | Medium | Maintenance schedule, scoring tuning guidance, ongoing optimization path |

#### Phase Overview

**This project's flow:**

- Full 4-phase. Heavy strategy (ICP fit + product signal identification requires cross-functional input), heavy engineering (scoring rules, data integrations, automation workflows), standard enablement and handoff.
- Strategy requires input from Sales, Marketing, Product, and RevOps -- expect 3-4 meetings minimum.
- Engineering depends on product analytics maturity. If Segment/CDP is already piping events to CRM, engineering compresses. If custom integration work is needed, engineering expands.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Watch intro video on product-led scoring methodology (fit + behavioral scoring explained)
- Complete intake form covering: current lead prioritization process, product analytics stack, CRM platform, key product events tracked, ICP criteria
- Provide admin access to CRM (Salesforce/HubSpot) and product analytics platform (Segment, Amplitude, Mixpanel)
- Get Sales leadership sign-off on what "sales-ready" means today

##### Track B: Architect Prep

- Pull closed-won/closed-lost deal data from CRM for past 12 months
- Audit product analytics events currently tracked and synced to CRM
- Assess data quality for key scoring fields (job title, company size, product usage events)
- Draft v0 scoring criteria matrix based on ICP analysis and available product signals

#### Refinement Loop (1b > 1c > 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present v0 scoring criteria, validate ICP fit attributes | VP Marketing, VP RevOps, Sales | Info for v1 scoring model |
| Refinement 1 | 1c | Review product usage signals, map to scoring weights | Product, RevOps, Sales | v2 with behavioral scoring |
| Refinement 2 | 1c | Validate combined score formula, agree on PQL threshold | Sales, Marketing, RevOps | v3 with threshold calibrated |
| Sign-Off | 1d | Final scoring model approval, confirm data requirements | All stakeholders | Final strategic scoring package |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held -- ICP fit criteria validated
- 1c. Refinement loop complete (scoring model v0 > vFinal)
- 1d. Strategic sign-off obtained on scoring model, thresholds, and data requirements

##### Phase 2: Engineering

- 2a. Tech spec created (field mappings, scoring rules, integration specs)
- 2b. Engineering handoff meeting held
- 2c. Build complete (fit scoring, behavioral scoring, decay rules, PQL workflow)
- 2d. QA/Test + customer sign-off on scoring accuracy

##### Phase 3: Enablement

- 3a. Training materials prepped (score interpretation guide, PQL playbook)
- 3b. Training sessions delivered to Sales, Marketing, RevOps
- 3c. Hypercare period complete (2 weeks of PQL quality monitoring)
- 3d. Enablement sign-off

##### Phase 4: Handoff

- 4a. Maintenance schedule documented and handed off
- 4b. Internal handoff (SME > Architect) complete
- 4c. External handoff complete
- 4d. Project closed and archived

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| ICP Fit Scoring Matrix | Map firmographic attributes to point values | All attributes scored, Sales-validated |
| Product Signal Inventory | Catalog product events and usage patterns | All signals mapped with correlation data |
| Combined Scoring Formula | Define fit + behavioral + decay logic | Formula approved, PQL threshold set |
| Data Integration Audit | Document data sources, gaps, sync status | All gaps flagged, integration plan agreed |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| Scoring Model Reference Sheet | All working documents | Internal alignment, stakeholder communication |
| PQL Threshold Documentation | Combined Scoring Formula | Sales team quick reference |
| Data Architecture Diagram | Data Integration Audit | Engineering team implementation reference |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Leadership | VP Marketing, VP RevOps, CRO | Interpret PQL metrics, understand scoring impact | 30 min |
| Sales | AEs, SDRs, Sales Managers | PQL interpretation, prioritization workflow, outreach timing | 45 min |
| Technical | RevOps, Marketing Ops, Admins | Scoring rule maintenance, threshold tuning, data troubleshooting | 60 min |

##### Hypercare

- Applies: Yes
- Duration: 2 weeks post-launch
- Office Hours: Yes -- weekly 30-min slot for score quality feedback and tuning

##### Training Assets to Create

- Video walkthrough: PQL scoring model (how fit + behavioral scores combine)
- Video walkthrough: How to interpret lead scores in CRM (for sales reps)
- Doc: Scoring model reference sheet (all rules, weights, thresholds)
- Doc: Admin guide for scoring rule adjustments
- Doc: PQL follow-up playbook (suggested outreach by score range)

#### Handoff & Retention

##### Internal Handoff (SME > Architect)

- Key context for Architect: Scoring model logic, PQL threshold rationale, which product signals are weighted highest, common false-positive patterns
- Escalation trigger: Any structural scoring model changes (adding/removing criteria, changing PQL threshold by >10 points, new product signal integration)

##### External Handoff

- Final meeting agenda: Scoring model review, maintenance walkthrough, tuning guidance, Q&A
- Documentation package: Scoring model reference, admin guide, training recordings, maintenance schedule

##### Maintenance Schedule

- Monthly: Score distribution review, PQL conversion rate check, false-positive audit
- Quarterly: Full scoring model re-validation against closed-won data
- Who owns: Single project = customer owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services > if no > Downsell: Predictive scoring upgrade or lead routing project > Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~90 days post-launch
- Internal prep trigger: 2 weeks before
- Decision: Architect handles / SME needed

#### Key Assets

| Asset | When Used |
|-------|-----------|
| ICP Fit Scoring Matrix | Phase 1 -- Strategy |
| Product Signal Inventory | Phase 1 -- Strategy |
| Scoring Model Reference Sheet | Phase 1d -- Sign-Off onward |
| Tech Spec (field mappings) | Phase 2a -- Engineering |
| PQL Follow-Up Playbook | Phase 3 -- Enablement |
| Admin Tuning Guide | Phase 4 -- Handoff |

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| Product-Qualified Lead (PQL) | A lead that has demonstrated buying intent through product usage behavior AND meets minimum ICP fit criteria |
| Fit Score | Numeric score based on firmographic and demographic attributes (company size, industry, job title) |
| Behavioral Score | Numeric score based on product usage signals (feature adoption, login frequency, milestone completion) |
| Combined Lead Score | Fit Score + Behavioral Score = Total Lead Score used for PQL determination |
| PQL Threshold | The minimum combined score at which a lead is flagged as sales-ready (typically 70-85 points) |
| Activation Milestone | A specific product action that correlates with conversion (e.g., first integration, invited teammates) |
| Score Decay | Time-based point reduction for leads that become inactive (prevents stale high scores) |
| Engagement Velocity | Rate of product actions within a time window -- rapid engagement signals urgent buying intent |

#### Common Gotchas

- Overweighting firmographic fit vs. product behavior -- product signals should be weighted 2-3x higher than demographics in PLG motions. See Methodology for weighting frameworks.
- Launching without score decay -- scores inflate over time, flooding sales with stale leads. Configure 30-day decay from day one.
- Setting PQL threshold without historical validation -- always backtest against 6-12 months of closed-won data before going live.
- Product analytics events not syncing to CRM -- verify data pipeline before building scoring rules. A 24-hour sync delay can cause missed PQL windows.
- Sales ignoring PQLs because they do not trust the model -- involve Sales in threshold definition and run a 2-week pilot before full rollout.

#### Methodology Options

| Option | When to Use | Complexity |
|--------|-------------|-----------|
| Rules-Based Scoring | First-time scoring model, <5000 leads/month | Low |
| Weighted Multi-Signal Scoring | Established PLG with multiple product events tracked | Medium |
| Hybrid (Rules + ML-Assisted) | High-volume PLG with 12+ months of conversion data | High |

---

## Phase 1: Strategy

> **Goal:** Get stakeholder sign-off on the complete scoring model -- ICP fit criteria, product usage signals, scoring weights, decay rules, and PQL threshold.
>
> **Output:** Scoring Model Reference Sheet + Data Integration Architecture Document (signed off by stakeholders).

### 1a. Pre-Kickoff

> Two parallel tracks run after the deal closes and before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video | Explain PLG scoring methodology: fit vs. behavioral scores, PQL concept | Video (8-10 min) |
| Definition Alignment Document | Get stakeholder sign-off on PQL, fit score, behavioral score, activation milestone | Google Doc |
| Pre-filled intake form | Confirm product analytics stack, CRM platform, ICP criteria, key product events | Google Form or Doc |

**What the intake form covers:**

- Current lead prioritization process (how does sales decide who to call?)
- Product analytics platform (Segment, Amplitude, Mixpanel, native)
- CRM platform (Salesforce, HubSpot) and MAP if separate (Marketo, Pardot)
- Key product events currently tracked (signups, feature usage, upgrades)
- ICP definition (company size ranges, target industries, buyer personas)
- Current trial/freemium conversion rates (baseline metrics)
- Sales team size and lead volume (to calibrate PQL volume expectations)

**Completion tracking:** RevOps point of contact follows up. Do not cancel kickoff if incomplete, but flag missing items for discussion.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Pull closed-won/closed-lost data (12 months) from CRM | Raw conversion data for backtest validation |
| 2 | Audit product analytics -- events tracked, CRM sync status, gaps | Data availability report |
| 3 | Analyze converted vs. churned users for product usage patterns | Draft product signal correlation analysis |
| 4 | Build v0 ICP Fit Scoring Matrix from deal data + intake form | Fit criteria with proposed weights |
| 5 | Create kickoff presentation with v0 scoring model and data findings | Kickoff deck + questions list |

**Critical:** Mark everything as ASSUMED. The kickoff call validates assumptions against Sales and Product reality.

#### Stakeholder Alignment Document

> Get stakeholder sign-off on terms BEFORE building anything.

| Term | Our Definition | Internally Approved? |
|------|---|---|
| Product-Qualified Lead (PQL) | A lead meeting minimum fit criteria AND reaching the behavioral score threshold through product usage | [ ] Yes / [ ] No |
| Fit Score | Numeric score (0-100) based on firmographic alignment with ICP | [ ] Yes / [ ] No |
| Behavioral Score | Numeric score (0-100) based on product usage signals weighted by conversion correlation | [ ] Yes / [ ] No |
| Activation Milestone | The specific in-product action that signals a user has experienced core value | [ ] Yes / [ ] No |
| PQL Threshold | The combined score (e.g., 80+) at which a lead is flagged for sales outreach | [ ] Yes / [ ] No |
| Score Decay | Automatic score reduction after defined inactivity periods | [ ] Yes / [ ] No |

**Instructions to customer:**

> Review each definition with your Sales, Marketing, and Product leadership. Check "Yes" when approved. We cannot proceed to engineering until all terms are aligned. Disagreements here surface early -- better now than mid-build.

---

### 1b. Kickoff Call

> **Purpose:** Present v0 scoring model and get alignment on ICP fit criteria and product signal direction. We walk in with work done -- customer reacts, not creates from scratch.

#### Agenda (75-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through v0 scoring model | "Here's the fit criteria and product signals we identified" |
| 15-30 | Validate ICP fit attributes | Sales confirms/corrects firmographic weights |
| 30-45 | Review product signal inventory | Product team identifies missing signals, confirms activation milestones |
| 45-60 | Data integration discussion | Assess: What product events sync to CRM today? What is missing? |
| 60-75 | Definition alignment review | Walk through Definition Alignment Document |
| 75-90 | Next steps | Schedule refinement meetings, assign data access homework |

#### What We Bring

- v0 ICP Fit Scoring Matrix (with proposed weights, all marked ASSUMED)
- v0 Product Signal Inventory (available events and proposed scoring impact)
- Data audit findings (what syncs today, what is missing, gap severity)
- Definition Alignment Document (pre-filled with our recommendations)

#### What We Leave With

- Feedback and corrections on fit criteria (info needed to create v1)
- Product team input on which usage signals correlate with conversion
- Data integration requirements clarity (custom work needed or not)
- Confirmed definitions (or clear blockers if stakeholder sign-off needed)
- Homework: Product team to export activation milestone data for analysis

---

### 1c. Alignment Loop & Strategic Meeting Cadence

> **Purpose:** Iterate on the scoring model until sign-off.

#### The Pattern

```
Kickoff Call (validate fit criteria, gather product signals)
    |
    vScoring model updated > v1
    |
    vMeeting 2: Product Signal Deep-Dive > v2
    |
    vMeeting 3: Combined Model + Threshold > v3
    |
    vFinal Review > Sign-off
```

#### Meeting Types for This Project

| Meeting Type | Focus | Stakeholder |
|--------------|-------|-------------|
| ICP Fit Validation | Firmographic and demographic scoring weights | VP Sales, Sales Managers |
| Product Signal Deep-Dive | Product usage patterns, activation milestones, behavioral scoring | Product Lead, Growth/PLG Lead |
| Threshold Calibration | Combined formula, PQL threshold, historical backtest | VP Marketing, VP RevOps, Sales |
| Data Architecture Review | Integration specs, sync frequency, data transformations | RevOps, Engineering, Product Analytics |
| Final Review | Full model walkthrough, sign-off | All stakeholders |

#### Before Each Meeting

1. Process previous meeting transcript/notes and update scoring model
2. Update scoring model (v[n-1] > v[n])
3. Run backtest against historical data if criteria changed
4. Prepare questions for next validation round

#### During Each Meeting

1. Walk through current version of scoring model
2. Capture corrections and refinements to criteria/weights
3. Validate what is now CONFIRMED
4. Identify remaining ASSUMED items

#### After Each Meeting

1. Update scoring criteria and weights
2. Track what moved from ASSUMED > CONFIRMED
3. Update data integration requirements if new signals identified
4. Re-run historical backtest with updated criteria

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 2-3 days |
| Kickoff call | Day 1 of engagement |
| Meeting loop | 2-3 weeks (3-4 meetings, depends on data readiness) |
| Final review + sign-off | When all scoring criteria CONFIRMED and backtest validates |

---

### 1d. Strategic Sign-Off

> **Purpose:** Confirm the scoring model is complete and validated before engineering.

#### Validation Checkpoint

- Definition Alignment Document signed off by Sales, Marketing, Product
- ICP Fit Scoring Matrix finalized with validated weights
- Product Signal Inventory complete with behavioral scoring weights
- Combined scoring formula approved (fit + behavioral + decay)
- PQL threshold set based on historical backtest
- Data integration requirements documented (what syncs, how, frequency)
- Negative scoring signals defined (competitor domains, careers page visits, wrong geo)
- No blockers for engineering (data access confirmed, integration approach agreed)

#### Decision Point

- **Proceed to Engineering** > Scoring model approved, data integration path clear
- **Loop back to Strategy** > If historical backtest shows weak correlation, revisit signal selection

---

## Phase 2: Engineering

> **Goal:** Build and test the complete scoring system in CRM/MAP with product analytics integration.
>
> **Output:** Working scoring rules (fit + behavioral + decay), PQL automation workflow, product data pipeline, all tested against historical data.

| Project Type | Engineering Weight | Context |
|--------------|-------------------|---------|
| Lead Scoring (Product-Led) | Heavy (50-60%) | Scoring rules in CRM/MAP + product analytics integration + automation workflows |

### Sub-Phases

```
2a Tech Spec > 2b Engineering Handoff > 2c Build > 2d Test
```

---

### 2a. Tech Spec

> **Purpose:** Translate the strategic scoring model into CRM/MAP technical specifications.

**Input:** Signed-off scoring model (ICP Fit Matrix + Product Signal Inventory + Combined Formula + PQL Threshold)

**Output:** Draft tech spec containing:

- **CRM field mappings:** New custom fields needed (fit_score, behavioral_score, combined_score, pql_status, last_product_activity, activation_status)
- **Fit scoring rules:** Conditions and point values for each firmographic attribute
- **Behavioral scoring rules:** Product event triggers and point values for each usage signal
- **Decay logic:** Time-based decay schedule, floor scores, velocity bonuses
- **Combined formula:** How fit + behavioral scores produce the combined score
- **PQL automation:** Threshold trigger, notification workflow, assignment logic
- **Integration spec:** Product analytics > CRM data pipeline (Segment destinations, API endpoints, sync frequency)
- **Build sequence:** Recommended order of implementation (fields > fit scoring > integration > behavioral scoring > decay > PQL workflow)

---

### 2b. Engineering Handoff

> **Purpose:** Review tech specs with engineer before building.

**Who attends:** Architect + Engineer (or engineering team)

**Agenda (45-60 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Strategic context | Architect explains scoring model rationale and stakeholder decisions |
| 15-30 | Walk through tech spec | Review field mappings, scoring rules, integration approach |
| 30-45 | Product analytics integration | Discuss Segment/CDP configuration, event mapping, sync frequency |
| 45-60 | Risk assessment and build sequence | Flag dependencies, confirm build order, estimate timeline |

**What Architect brings:**

- Signed-off strategic scoring model
- Draft tech spec (from 2a)
- Data audit findings (integration gaps, sync status)
- Questions list (anything flagged as ambiguous)

**What engineer leaves with:**

- Approved tech spec
- Clear build sequence (fields > fit > integration > behavioral > decay > PQL workflow)
- Known risks (e.g., event latency, data gaps, API rate limits)
- Product analytics access credentials

---

### 2c. Build (Configure)

> **Purpose:** Build the complete scoring system in CRM/MAP with product analytics integration.

**Input:** Approved tech spec from 2b

**Build Components (in order):**

#### Component 1: CRM Custom Fields

Create the fields needed to store scoring data:

| Field Name | Type | Platform Location | Purpose |
|------------|------|-------------------|---------|
| Fit Score | Number | Lead/Contact record | Firmographic alignment score (0-100) |
| Behavioral Score | Number | Lead/Contact record | Product usage score (0-100) |
| Combined Lead Score | Formula | Lead/Contact record | Fit + Behavioral = Total |
| PQL Status | Checkbox | Lead/Contact record | TRUE when threshold reached |
| PQL Date | Date | Lead/Contact record | When lead first became PQL |
| Last Product Activity | Date | Lead/Contact record | Most recent product usage event |
| Activation Status | Picklist | Lead/Contact record | Not Started / Activated / Power User |
| Days Since Last Activity | Formula | Lead/Contact record | Drives decay logic |

#### Component 2: Fit Scoring Rules

Build positive and negative scoring rules in CRM/MAP:

**Positive fit signals (examples -- actual values from strategic package):**

| Attribute | Criteria | Points |
|-----------|----------|--------|
| ICP Industry | Match target industry | +20 |
| Company Size | 50-500 employees | +15 |
| Company Size | 500-5000 employees | +20 |
| Job Title Seniority | VP/Director/C-suite | +15 |
| Job Function | Match buyer persona | +10 |
| Tech Stack Match | Uses complementary tools | +10 |

**Negative fit signals:**

| Attribute | Criteria | Points |
|-----------|----------|--------|
| Competitor Employee | Domain match | -50 |
| Student/Academic | .edu domain or student title | -40 |
| Wrong Geography | Outside target regions | -20 |
| Company Too Small | <10 employees | -15 |
| Personal Email | Gmail/Yahoo/Hotmail | -10 |

#### Component 3: Product Analytics Integration

Connect product usage data to CRM/MAP:

| Integration Method | When to Use | Latency |
|-------------------|-------------|---------|
| Segment > CRM | Client has Segment CDP | Near-real-time |
| Native integration | HubSpot product tracking or Salesforce Engage | Minutes |
| Custom API | No CDP, need direct connection | Configurable |
| Daily batch sync | Non-time-sensitive signals | 24 hours |

**Key events to sync:**

- User signup / trial start
- Login events (frequency tracking)
- Feature usage events (specific features mapped in strategy)
- Activation milestone completion
- Invite sent to teammates
- Pricing page views / upgrade flow started
- Integration connected
- Data export / API key generated

#### Component 4: Behavioral Scoring Rules

Build product usage scoring in CRM/MAP:

**Activation milestones:**

| Product Signal | Criteria | Points |
|---|---|---|
| Completed onboarding | Finished setup wizard | +15 |
| First key action | Used core feature 1+ times | +20 |
| Invited teammates | Sent 1+ workspace invites | +25 |
| Connected integration | Set up 1+ integrations | +20 |
| Used premium feature | Engaged with paid-tier feature | +15 |

**Engagement frequency:**

| Product Signal | Criteria | Points |
|---|---|---|
| High login frequency | 5+ logins in past 7 days | +15 |
| Feature breadth | Used 3+ distinct features | +10 |
| Session depth | Avg session >5 min | +10 |
| Engagement velocity | 5+ key actions in 48 hours | +25 |

**High-intent actions:**

| Product Signal | Criteria | Points |
|---|---|---|
| Viewed pricing page | During active trial | +10 |
| Started upgrade flow | Clicked upgrade button | +20 |
| Contacted support | About billing or enterprise | +10 |
| Downloaded data export | Exporting data = invested user | +5 |

**Negative behavioral signals:**

| Product Signal | Criteria | Points |
|---|---|---|
| No login (14+ days) | Inactivity period | -10 |
| No login (30+ days) | Extended inactivity | -20 |
| Unsubscribed from emails | Disengagement signal | -15 |
| Deleted account data | Churn signal | -25 |

#### Component 5: Score Decay and Recency Logic

Configure time-based decay to keep scores reflecting current intent:

- **30-day decay:** Subtract 10 points per 30 days of no product engagement
- **Recency bonus:** Actions in past 7 days weighted 2x vs. actions 30+ days old
- **Engagement velocity bonus:** +25 points if 5+ key actions in 48 hours (signals active evaluation)
- **Score floor:** Combined score cannot go below 0 (prevent negative scores)
- **Decay exemption:** Fit score does not decay (firmographic data is stable). Only behavioral score decays.

#### Component 6: Combined Score + PQL Workflow

- **Formula:** Combined Lead Score = Fit Score + Behavioral Score
- **PQL threshold:** Set per strategic sign-off (typical range: 70-85 points)
- **PQL automation workflow:**
  1. When Combined Lead Score >= threshold AND PQL Status = FALSE
  2. Set PQL Status = TRUE, set PQL Date = today
  3. Assign to sales rep (round-robin, territory-based, or account-based per client)
  4. Send email notification to assigned rep with context: score breakdown, top behavioral signals, fit details
  5. Create CRM task: "Follow up with new PQL" with suggested messaging based on their product activity

**Build tracking:**

- Component 1: CRM custom fields created
- Component 2: Fit scoring rules live
- Component 3: Product analytics integration configured and syncing
- Component 4: Behavioral scoring rules live
- Component 5: Decay and recency logic configured
- Component 6: Combined score formula + PQL workflow active

---

### 2d. QA / Test + Sign-Off

> **Purpose:** Verify the scoring model works accurately and get customer approval.

**Two types of testing:**

| Type | Who | Purpose |
|------|-----|---------|
| Historical Backtest | Our team | Verify scoring model predicts actual conversion outcomes |
| Live Pilot | Sales team | Validate PQL quality in real sales workflows |

**Historical backtest process:**

1. Apply scoring model retroactively to leads from past 6-12 months
2. Compare score distribution of converted vs. non-converted leads
3. Calculate conversion rate by score bucket:

| Score Range | Expected Conversion Pattern |
|---|---|
| 0-25 | <5% conversion (unqualified) |
| 26-50 | 5-10% conversion (low intent) |
| 51-75 | 10-20% conversion (moderate) |
| 76-100 | 25-40% conversion (PQL-ready) |

4. Verify PQL threshold produces acceptable precision (target: PQLs convert at 3-5x the rate of non-PQLs)
5. Adjust scoring weights if backtest reveals weak correlation

**Live pilot process:**

1. Select 2-3 sales reps for 2-week pilot
2. Brief pilot reps on scoring methodology and how to interpret scores
3. Track daily: Are PQLs actually sales-ready? Feedback on quality by score range
4. Compare pilot reps' conversion rates on PQLs vs. non-PQLs
5. Document refinements needed based on pilot findings

**Technical testing checklist:**

- All custom fields created and populating correctly
- Fit scoring rules firing on lead creation and enrichment updates
- Product events syncing from analytics platform to CRM (check latency)
- Behavioral scoring updating when product events arrive
- Decay rules subtracting points after inactivity periods
- Engagement velocity bonus triggering on rapid activity
- Combined score formula calculating correctly
- PQL threshold triggering workflow at correct score
- Sales notifications delivering with correct context
- Lead assignment routing to correct reps
- Score floor preventing negative scores

**Engineering sign-off checkpoint:**

- Historical backtest shows PQLs convert at 3x+ rate of non-PQLs
- All scoring rules match approved strategic model
- Data pipeline stable (no sync failures in past 48 hours)
- Pilot sales reps confirm PQL quality acceptable
- Customer has tested and approved
- Ready for enablement

**Decision point:**

- **Proceed to Enablement** > Backtest validates, pilot positive, system stable
- **Loop back to Build** > If PQL quality is poor, re-calibrate weights and threshold

---

## Phase 3: Enablement

> **Goal:** Sales team can interpret and act on PQL scores effectively. RevOps can maintain and tune the scoring model independently.
>
> **Output:** Trained team with documentation, stabilized scoring system, no critical issues.

### Sub-Phases

```
3a Training Prep > 3b Training Sessions > 3c Hypercare > 3d Enablement Sign-Off
```

---

### 3a. Training Prep

> **Purpose:** Create training materials from scoring model documentation and pilot learnings.

**Input:** Strategic scoring model + tech specs + pilot results + built system

**Output:** Training package containing:

- **Leadership deck:** PQL scoring overview, expected impact on conversion rates, dashboard views for monitoring
- **Sales rep guide:** How to read lead scores, what PQL means, recommended outreach timing and messaging by score range
- **Technical admin guide:** How scoring rules work, how to adjust weights, how to troubleshoot common issues
- **PQL follow-up playbook:** Suggested outreach templates based on which product behaviors triggered PQL status
- **Video walkthrough scripts:** What to record for each audience
- **FAQ draft:** Based on pilot rep questions and common scoring model concerns

---

### 3b. Training Sessions

> **Purpose:** Transfer knowledge to customer team so they can use and maintain the scoring system.

**Training schedule:**

| Session | Audience | Focus | Duration | Format |
|---------|----------|-------|----------|--------|
| Leadership briefing | VP Marketing, VP RevOps, CRO | PQL metrics impact, scoring model ROI, dashboard interpretation | 30 min | Live + video recording |
| Sales team training | AEs, SDRs, Sales Managers | How to interpret scores, PQL follow-up playbook, prioritization workflow | 45 min | Live + video recording |
| Technical admin training | RevOps, Marketing Ops | Scoring rule maintenance, threshold tuning, data pipeline monitoring | 60 min | Live + video recording |

**Sales team training covers:**

1. What PQL means vs. MQL -- PQLs convert at 5-6x the rate of MLQs because they are based on actual product usage, not just content engagement
2. How to read lead scores in CRM: fit score (who they are) + behavioral score (what they did in the product) = combined score
3. PQL notification workflow: what triggers, what context is included, expected response time
4. Outreach strategies by score range:
   - 80-100: Hot PQL -- immediate outreach, reference their specific product usage
   - 60-79: Warm lead -- nurture with relevant content, offer product demo
   - Below 60: Continue automated nurture, do not prioritize for outbound
5. Walk through 3-5 example PQL profiles from pilot period

**Training delivery:**

1. Schedule sessions with appropriate stakeholders (can be same week)
2. Deliver training live, record for future reference
3. Field questions, document answers for FAQ
4. Distribute recording links and written guides

**Output:**

- Trained stakeholders across leadership, sales, and technical roles
- Video recordings for onboarding new team members
- Updated FAQ based on live session questions

---

### 3c. Hypercare

> **Purpose:** Intensive post-launch support to stabilize the scoring system and calibrate based on real-world performance.

**Duration:** 2 weeks

**What happens:**

- **Daily (first week):** Monitor PQL volume, score distributions, and conversion signals. Flag anomalies.
- **Weekly office hours:** 30-min open slot for sales reps to share PQL quality feedback, report false positives, or ask scoring questions.
- **Score calibration:** If PQL volume is too high (sales overwhelmed) or too low (sales starved), adjust threshold.
- **False positive triage:** Investigate any leads scored as PQL that sales identifies as unqualified. Determine if it is a data issue, a weighting issue, or a legitimate edge case.
- **Integration monitoring:** Verify product events continue syncing reliably, no pipeline failures.

**Hypercare triggers for action:**

| Symptom | Likely Cause | Action |
|---------|--------------|--------|
| Too many PQLs (>20/rep/week) | Threshold too low | Raise PQL threshold by 5-10 points |
| Too few PQLs (<2/rep/week) | Threshold too high or missing signals | Lower threshold or add scoring signals |
| Sales reports "junk" PQLs | Overweighted signals or missing negatives | Review false positives, adjust weights |
| Scores not updating | Integration failure or sync delay | Check data pipeline, verify events arriving |
| Scores clustering at same value | Insufficient signal differentiation | Add more behavioral scoring criteria |

**Output:** Stabilized scoring system, no critical issues, PQL quality acceptable to sales team

---

### 3d. Enablement Sign-Off

> **Purpose:** Confirm customer can operate the scoring system independently.

**Validation checkpoint:**

- All training sessions delivered (leadership, sales, technical)
- Training recordings and documentation distributed
- Hypercare period complete -- no critical issues remaining
- PQL conversion rate trending at target (3x+ vs. non-PQLs)
- Sales team actively using PQL scores for prioritization
- RevOps team can independently adjust scoring weights and thresholds
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** > Customer is enabled, scoring system stable
- **Extend Hypercare** > If sales adoption is low or scoring accuracy needs further tuning

---

## Phase 4: Handoff

> **Goal:** Clean project close with maintenance plan established and retention/expansion path set.
>
> **Output:** Maintenance schedule documented, internal context transferred, customer owns the scoring system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule > 4b Internal Handoff > 4c External Handoff > 4d Project Close
                          (SME > Architect)                          (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|---|---|---|
| Single Project | Customer owns | 4c (External Handoff) -- customer receives maintenance schedule and runs it themselves |
| Dedicated (Multi-Project) | Architect owns | 4b (Internal Handoff) -- Architect receives maintenance schedule and runs it for customer |

---

### 4a. Maintenance Schedule

> **Purpose:** Document what needs ongoing attention after the project is complete -- cadences, tasks, triggers for re-engagement.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|---|---|---|
| PQL Conversion Rate | PQL-to-opportunity conversion rate vs. non-PQL rate | PQL conversion drops below 2x non-PQL rate |
| Score Distribution Health | Distribution of scores across lead population | >50% of leads clustered in one score bucket |
| False Positive Audit | Sample 10-15 recent PQLs -- are they actually sales-ready? | >25% of PQLs flagged as unqualified by sales |
| Data Pipeline Check | Product events syncing to CRM without errors | Any sync failures in past 30 days |
| Sales Rep Feedback Pulse | Quick survey: "Are PQL scores helpful? Y/N + comments" | Majority of reps say "not helpful" |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|---|---|---|
| Full Scoring Model Backtest | Re-run backtest with past quarter's closed-won/lost data | Adjust weights for any criteria that lost correlation |
| ICP Fit Criteria Refresh | Has target market shifted? New industries, company sizes? | Update fit scoring rules if ICP evolved |
| Product Signal Audit | New product features launched? New usage patterns emerging? | Add new signals to behavioral scoring |
| PQL Threshold Re-calibration | Is the threshold still producing the right volume and quality? | Adjust threshold based on quarterly conversion data |
| Decay Rule Effectiveness | Are decayed leads actually lower-intent than active leads? | Tune decay rates if stale leads still converting |

**After First Business Cycle (30-90 days post-launch):**

- **PQL-to-Customer Validation:** Did PQLs from the first 30 days convert at the expected rate? If PQL conversion is <2x non-PQL, investigate signal quality.
- **Sales Workflow Adoption:** Are reps actually following up on PQL notifications within SLA? If follow-up rate is <70%, revisit training or notification workflow.
- **Scoring Model Drift Check:** Compare score distribution today vs. at launch. If significantly different, identify what changed (product, ICP, data).

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| PQL conversion rate decline | Drops below 2x non-PQL rate for 2+ months | Re-engage -- scoring model needs re-calibration |
| New product launch | Major feature release changes usage patterns | Add new behavioral signals, re-validate weights |
| ICP shift | Company enters new market or segment | Update fit scoring criteria |
| Sales team restructure | New territories or role changes | Update assignment workflows |
| Product analytics platform change | Migrate to new CDP/analytics tool | Re-build integration pipeline |

**Every 6-12 Months:**

- **Full Model Re-calibration:** Re-analyze all conversion data. Update all fit and behavioral weights based on 6-12 months of scored lead outcomes.
- **Competitive Benchmark Review:** Has PLG scoring evolved in the market? New best practices or signal types to incorporate?
- **Scoring Model Version Upgrade:** Consider moving from rules-based to hybrid (rules + ML-assisted) if data volume supports it. See Methodology for decision framework.

---

### 4b. Internal Handoff (SME > Architect)

> **Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- Scoring model logic: How fit and behavioral scores combine, what the PQL threshold is, why it was set there
- Top product signals: Which behavioral signals carry the most weight and why
- Common false-positive patterns: What types of leads score high but do not convert (e.g., developer users at non-ICP companies)
- Client quirks: Any unique scoring adjustments made for this client's specific product or market
- Maintenance schedule: Monthly and quarterly tasks (especially data pipeline monitoring)
- When to escalate back to SME

**Escalation guidelines:**

| Issue Type | Who Handles | Example |
|---|---|---|
| Threshold adjustment (minor) | Architect | Moving threshold up/down by 5 points |
| New negative scoring signal | Architect | Adding a competitor domain to negative list |
| Structural model change | SME | Adding a new scoring category, changing formula |
| New product signal integration | SME | New feature launched, needs behavioral scoring |
| Product analytics platform migration | SME | Changing from Segment to another CDP |
| PQL conversion rate decline >30% | SME | Fundamental model re-calibration needed |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing it. SME walks Architect through each maintenance task during a 30-min handoff session.

---

### 4c. External Handoff

> **Purpose:** Formal project completion with customer.

**Final project meeting (60 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Results review | PQL conversion rates, scoring model accuracy, pilot outcomes |
| 15-30 | Scoring model reference walkthrough | Review all scoring rules, weights, thresholds |
| 30-45 | Maintenance schedule walkthrough | Monthly and quarterly tasks, red flag thresholds |
| 45-55 | Admin tuning guide | How to adjust weights, change thresholds, add signals |
| 55-60 | Q&A and close | Final questions, confirm "project complete" |

**Documentation package:**

- Scoring Model Reference Sheet (all fit criteria, behavioral signals, weights, thresholds, decay rules)
- Admin Tuning Guide (step-by-step for common adjustments)
- Data Architecture Diagram (what connects to what, sync frequencies)
- PQL Follow-Up Playbook (outreach strategies by score range)
- Training video recordings (leadership, sales, technical)
- FAQ document (from training sessions and hypercare)
- Maintenance Schedule (monthly/quarterly task list with red flag thresholds)

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video walkthrough. Make sure RevOps understands what to check, how often, and when to re-engage.

**Output:** Customer owns the scoring system. Project formally complete.

---

### 4d. Project Close

> **Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved to proper location
- Handoff documentation complete (scoring model reference, admin guide, training recordings)
- Project status updated in tracking system
- Time/billing finalized

#### Internal Debrief (Optional but Recommended)

- What went well? (e.g., Product signal analysis was strong, pilot drove adoption)
- What would we do differently? (e.g., Should have audited data pipeline earlier)
- Any learnings to feed back into process or tooling?

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|---|---|
| Single Project | Upsell > Downsell > Retry |
| Multi-Project (Dedicated) | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (retainer for ongoing scoring optimization)
   | if no
   v2. Downsell: Predictive scoring upgrade (ML-assisted) or lead routing project
   | if yes
   v3. Retry retainer at end of next project cycle
```

**Script:**

> "Now that the scoring model is live, there are two ways we can continue working together. Option 1: We handle ongoing optimization -- monthly backtests, threshold tuning, new signal integration as your product evolves. Option 2: If there's a specific next project like lead routing or predictive scoring, we can scope that. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

> "On [date ~90 days out], we'll review how the scoring model is performing and see if any adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull PQL conversion data, score distribution, sales feedback |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points. |

**At the refinement check-in:**

- Review PQL conversion rates against original targets
- Assess score distribution health
- Identify any new product signals or ICP changes
- If minor: Architect handles threshold/weight tweaks
- If major: Scope scoring model re-calibration project (restart the process)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- ICP Fit Scoring Matrix (firmographic criteria with validated weights)
- Product Signal Inventory (product usage signals with behavioral scoring weights)
- Combined Scoring Formula Documentation (fit + behavioral + decay logic)
- Scoring Model Reference Sheet (single-page summary of all rules, weights, thresholds)

**Technical Deliverables:**

- CRM custom fields configured (fit_score, behavioral_score, combined_score, pql_status, etc.)
- Fit scoring rules live in CRM/MAP
- Behavioral scoring rules live in CRM/MAP with product analytics integration
- Score decay and recency rules configured
- PQL automation workflow (threshold trigger > assignment > notification > task)
- Data pipeline: Product analytics > CRM (Segment/CDP or custom integration)
- Sales alert and assignment workflows

**Documentation Package:**

- Training video recordings (leadership, sales, technical)
- PQL Follow-Up Playbook (outreach strategies by score range)
- Admin Tuning Guide (how to adjust weights, thresholds, signals)
- Data Architecture Diagram (integration map)
- FAQ document
- Definition Alignment Document (final version)
- Maintenance Schedule (monthly/quarterly tasks with red flag thresholds)

---

## Appendix: Implementation Guide

> Reference material for architects. This section does not change per project.

---

### Roles

| Role | What They Do |
|------|--------------|
| Architect | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| Engineer | CRM build, automation, dashboards (Phase 2) |
| SME | Project/implementation specialist brought in for project-specific work |

---

### Phase Gates

| Phase | Output | Gate Criteria |
|-------|--------|---------------|
| Phase 1: Strategy | Signed-off scoring model (fit matrix + signal inventory + formula) | All stakeholders approved scoring criteria, weights, threshold, and data plan |
| Phase 2: Engineering | Working scoring system with product analytics integration | Backtest validates, pilot positive, all scoring rules firing correctly |
| Phase 3: Enablement | Trained team with PQL follow-up playbook | All training delivered, hypercare complete, team using scores independently |
| Phase 4: Handoff | Independent customer + archived project | Internal/external handoffs complete, maintenance plan in place, project closed |

---

### How to Adapt Per Project

This is a **Balanced** project profile:

| Project Profile | Strategy Weight | Engineering Weight | Enablement Weight |
|---|---|---|---|
| Balanced | 30-40% | 40-50% | 15-20% |

**Adaptation notes:**

- If client has mature product analytics already piping to CRM, engineering compresses significantly (skip integration build)
- If client has no product analytics in CRM, engineering expands (custom integration work may add 1-2 weeks)
- Strategy phase may compress if client has existing MQL scoring that needs conversion to PQL model (framework exists, signals change)

---

### Phase 1 Guide: Strategy

**Why Phase 1 matters:** Product-led scoring fails when Sales and Product cannot agree on what "product-qualified" means. Phase 1 forces alignment BEFORE building anything. The real value is not the CRM configuration -- it is the education, alignment, and signal identification that happens here.

**How we create value in strategy:**

1. **We educate.** Most PLG companies understand MQLs but not PQLs. We educate them on why product usage signals are 5-6x more predictive of conversion than marketing engagement signals. They need to understand the PQL concept before they can give intelligent input on what product behaviors matter.

2. **We drive alignment.** Product-led scoring requires Sales, Marketing, AND Product to agree on what constitutes a "sales-ready" lead. This cross-functional alignment is harder than traditional MQL scoring because Product teams are not accustomed to participating in lead qualification. We facilitate that conversation.

3. **We come with an opinion.** We show up with a v0 scoring model based on their CRM data and product analytics. We have done this for similar PLG companies and know which signal patterns matter. They are confirming and adjusting, not creating from scratch.

4. **We show best practices.** We anchor in industry data: PQLs convert at 25-30% vs. MQLs at 2-5%. We share what scoring models look like at comparable PLG companies. We recommend proven behavioral signals (activation milestones, engagement velocity, feature breadth).

**Pre-Kickoff: The Two-Swarm Pattern:**

| Swarm | Source | Goal |
|-------|--------|------|
| Swarm 1: Extract | CRM closed-won/lost data, product analytics events, customer inputs | Identify ICP patterns and product signals |
| Swarm 2: Enrich | Industry PQL benchmarks, PLG best practices, comparable company models | Anchor in proven scoring approaches |

**Result:** v0 is 70% pre-filled. Customer reacts and corrects, not creates from scratch.

---

### Phase 2 Guide: Engineering

**Key principles:**

**Tech Spec (2a):** Translate the strategic scoring model (fit matrix + signal inventory + formula) into CRM-specific field mappings, scoring rules, and automation logic. Review for edge cases and client-specific CRM configuration needs.

**Engineering Handoff (2b):** Engineer must understand the WHY (which signals predict conversion and why those weights were chosen) not just the WHAT (configure these fields and rules). This context prevents incorrect shortcuts during build.

**Build (2c):** Build in order: fields first, then fit scoring, then integration, then behavioral scoring, then decay, then PQL workflow. Each layer depends on the previous one. Do NOT try to build behavioral scoring before the product analytics integration is verified.

**Test (2d):** Historical backtest is non-negotiable. PQLs should convert at 3-5x the rate of non-PQLs. If they do not, the model needs recalibration before going live. The 2-week pilot with real sales reps validates that scores are actionable in practice, not just statistically accurate.

---

### Phase 3 Guide: Enablement

**Key principles:**

**Training Prep (3a):** Draft materials, but customize based on pilot learnings. Generic scoring training fails -- reps need to see real PQL examples from their own system.

**Sales Training (3b):** The critical shift for sales teams: stop treating all leads equally and start trusting scores. PQL scores are the alignment mechanism -- sales trusts them because they are based on actual product behavior, not arbitrary marketing thresholds.

**Hypercare (3c):** The first 2 weeks are when false positives surface and trust is built or broken. Weekly office hours give reps a safe space to share feedback. Fast response to quality issues (same-day threshold adjustment if needed) builds confidence in the system.

---

### Phase 4 Guide: Handoff

**Why maintenance schedules matter:** Lead scoring models drift. Product changes, ICP evolves, market conditions shift. Without quarterly re-validation, a scoring model that launched at 30% PQL conversion can decay to 10% within 6-12 months. The maintenance schedule prevents this by making monitoring explicit and cadenced.

**Scoring Model Maintenance: What Drifts and Why:**

| What Drifts | Why | How to Catch It |
|---|---|---|
| Behavioral signal relevance | Product changes, new features, usage pattern shifts | Quarterly backtest with recent data |
| ICP fit criteria | Company enters new markets or segments | Quarterly closed-won analysis |
| PQL threshold accuracy | Lead volume changes, conversion rates shift | Monthly PQL conversion rate tracking |
| Data pipeline reliability | Platform updates, API changes, schema drift | Monthly sync failure monitoring |
| Score decay effectiveness | Sales cycle length changes | Quarterly decay rate vs. conversion check |

**Internal Handoff:** Architect can handle threshold tweaks and negative signal additions without bringing SME back. SME is only needed for structural changes (new scoring categories, formula changes, new integrations). This frees SME for new projects.

**Retention:** Scoring models naturally need evolution. Product launches, ICP changes, and market shifts all create reasons to re-engage. The 90-day check-in creates a natural expansion opportunity -- either ongoing optimization (retainer) or next project (predictive scoring, lead routing).

---

## References

- [WorkNet - 8 Lead Scoring Best Practices for SaaS](https://www.worknet.ai/blog/lead-scoring-best-practices)
- [ProductLed - Product-Led Growth Benchmarks](https://productled.com/blog/product-led-growth-benchmarks)
- [Amplitude - Goodbye MQLs: Why Product-Qualified Leads Drive Faster Growth](https://amplitude.com/blog/pqls-hubspot-integration)
- [Martal - B2B Lead Scoring: Top Practices Driving Results](https://martal.ca/b2b-lead-scoring-lb/)
- [Gainsight - Benchmark: Product Qualified Lead (PQL) Conversion Rates](https://www.gainsight.com/resource/benchmark-product-qualified-lead-pql-conversion-rates/)
- [HubSpot - Build Lead Scores to Qualify Contacts, Companies, and Deals](https://knowledge.hubspot.com/scoring/build-lead-scores)
- [Ortto - A Modern, Product-Led Approach to Lead Scoring for SaaS](https://ortto.com/learn/product-led-approach-building-a-lead-scoring-framework-for-saas-marketing/)