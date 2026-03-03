# Lead Scoring Model (Sales-Led) — Implementation

## Project One-Pager

### Lead Scoring Model (Sales-Led) One-Pager

#### Project Type

- **Category:** Balanced
- **Primary Deliverable:** Working lead scoring model in CRM/marketing automation platform that automatically ranks leads by fit (firmographic/demographic) and engagement (behavioral) to prioritize sales-ready prospects

##### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Medium | ICP definition, scoring criteria design, 2-3 refinement loops |
| 2. Engineering | Yes | Heavy | CRM/MAP configuration, scoring rules, automation workflows |
| 3. Enablement | Yes | Medium | Sales team training on score interpretation and workflow |
| 4. Handoff | Yes | Medium | Maintenance schedule, quarterly model review process |

#### Phase Overview

**This project's flow:**

- Full 4-phase execution. Strategy defines ICP criteria and scoring logic. Engineering is the heaviest phase — configuring scoring rules, automation, and thresholds in the CRM/MAP. Enablement trains sales reps on interpreting and acting on scores. Handoff includes quarterly review cadence.
- No phases skipped. Phase 2 carries the most weight because the scoring model requires detailed CRM/MAP configuration, automation workflows, and historical data validation.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Watch intro video explaining lead scoring concepts (fit vs. engagement, MQL thresholds)
- Complete intake form: current lead volume, CRM/MAP platform, existing scoring (if any), sales cycle length, ICP description
- Get stakeholder sign-off on definitions: MQL, SQL, Fit Score, Engagement Score
- Provide admin access to CRM and marketing automation platform

##### Track B: Architect Prep

- Pull sample of 50-100 recent leads from CRM to assess data completeness
- Inventory available data fields: demographic, firmographic, and behavioral
- Analyze closed-won deals from past 12 months to identify common ICP attributes
- Draft v0 scoring model framework with ASSUMED criteria and point values
- Prepare gap analysis: what data exists, what is missing, what needs enrichment

#### Refinement Loop (1b -> 1c -> 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present v0 scoring model, validate ICP criteria | VP Marketing, VP Sales, RevOps | Corrected ICP + scoring draft |
| Refinement 1 | 1c | Review behavioral signals, validate point values | Marketing Ops, Sales Reps | v2 scoring model |
| Refinement 2 | 1c | Review thresholds, negative scoring, time decay | VP Sales, RevOps | v3 scoring model |
| Sign-Off | 1d | Final scoring model approval | All stakeholders | Approved scoring specification |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held — ICP criteria validated
- 1c. Refinement loop complete (v0 -> vFinal scoring model)
- 1d. Strategic sign-off obtained on scoring criteria, thresholds, and MQL definition

##### Phase 2: Engineering

- 2a. Tech spec created (scoring rules, field mappings, automation logic)
- 2b. Engineering handoff meeting held
- 2c. Build complete (score fields, scoring rules, MQL automation, notifications)
- 2d. QA/Test + customer sign-off (historical validation + pilot test)

##### Phase 3: Enablement

- 3a. Training materials prepped (score interpretation guide, CRM walkthrough)
- 3b. Training sessions delivered (sales team + marketing ops)
- 3c. Hypercare period complete (2-week pilot with subset of reps)
- 3d. Enablement sign-off

##### Phase 4: Handoff

- 4a. Maintenance schedule documented (monthly score health check, quarterly model review)
- 4b. Internal handoff (SME -> Architect) complete
- 4c. External handoff complete
- 4d. Project closed and archived

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| Lead data audit spreadsheet | Assess data completeness and quality | All fields inventoried, gaps identified |
| ICP criteria matrix | Define fit attributes with weighted point values | Validated by sales leadership |
| Behavioral signal map | Catalog engagement actions with intent levels | All trackable behaviors assigned point values |
| Scoring model specification | Complete model with all criteria and thresholds | Sign-off from sales and marketing leadership |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| Lead Scoring Model Document | ICP matrix + behavioral map | Internal reference and onboarding new reps |
| Score Interpretation Guide | Scoring model spec | Sales team daily workflow |
| MQL/SQL Threshold Reference | Model specification | Marketing-sales alignment |
| Monitoring Dashboard | QA validation data | Ongoing model health tracking |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Leadership | VP Sales, VP Marketing, RevOps Director | Interpret score distributions, MQL volume trends | 30 min |
| Sales Team | AEs, SDRs/BDRs | How to use scores in daily workflow, filter by score | 45 min |
| Technical | Marketing Ops, RevOps Admin | How to maintain scoring rules, adjust thresholds | 60 min |

##### Hypercare

- Applies: Yes
- Duration: 2 weeks (pilot with 3-5 sales reps, then full rollout)
- Office Hours: Yes — weekly 30-min slot for score accuracy questions

##### Training Assets to Create

- Video walkthrough: Scoring model walkthrough (how fit + engagement combine)
- Video walkthrough: CRM dashboard walkthrough (filtering and sorting by score)
- Doc: Score interpretation quick-reference card (score ranges -> recommended actions)
- Doc: Scoring criteria reference (all attributes, point values, thresholds)

#### Handoff & Retention

##### Internal Handoff (SME -> Architect)

- Key context for Architect: Scoring model logic, which thresholds were set and why, any edge cases discovered during pilot
- Escalation trigger: Any request to change scoring criteria, add new ICP attributes, or modify MQL/SQL thresholds

##### External Handoff

- Final meeting agenda: Review scoring model performance, walk through maintenance schedule, demonstrate quarterly review process
- Documentation package: Scoring model document, automation workflow map, dashboard guide, troubleshooting runbook

##### Maintenance Schedule

- Monthly: Score distribution health check, MQL volume review
- Quarterly: Full scoring model review with conversion rate analysis by score band
- Who owns: Single project = customer owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services (ongoing scoring optimization) -> if no -> Downsell: Lead Routing/Assignment project or Lead Lifecycle project -> Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~90 days post-launch
- Internal prep trigger: 2 weeks before
- Decision: Architect handles / SME needed

#### Key Assets

| Asset | When Used |
|-------|-----------|
| Lead Data Audit Template | Phase 1a (Pre-Kickoff) |
| ICP Criteria Matrix Template | Phase 1b-1c (Strategy) |
| Scoring Model Spec Template | Phase 1c-1d (Strategy) |
| Score Validation Spreadsheet | Phase 2d (QA/Test) |

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| Fit Score | Numeric score (0-100) measuring how closely a lead matches the Ideal Customer Profile based on firmographic/demographic attributes |
| Engagement Score | Numeric score (0-100) measuring a lead's behavioral activity and buying intent signals |
| Total Score | Combined Fit Score + Engagement Score used for overall lead prioritization |
| MQL | Marketing Qualified Lead — a lead that meets minimum Fit Score AND Engagement Score thresholds |
| SQL | Sales Qualified Lead — an MQL that a sales rep has accepted and confirmed as a real opportunity |
| Time Decay | Automatic score reduction for leads with no engagement activity over a defined period |
| Negative Scoring | Points subtracted for disqualifying attributes (competitor email, student domain, unsubscribe) |
| ICP | Ideal Customer Profile — the firmographic and demographic attributes of a best-fit customer |

#### Common Gotchas

- Over-scoring low-intent behaviors (email opens, blog visits) inflates scores and reduces differentiation -> Reserve 20+ points for high-intent actions only; cap awareness-stage behaviors at 5-10 points
- Setting MQL threshold too low floods sales with unqualified leads -> Target the top 20% of leads by score (typically 50-75 on a 100-point scale)
- Forgetting time decay rules makes stale leads appear hot -> Implement 25% monthly score reduction for leads with no new activity
- Marketing-sales misalignment on what MQL means -> Include sales leadership in scoring model design from Day 1; require BOTH fit and engagement minimums
- Scoring model goes stale within 6 months -> Build quarterly review into handoff with conversion-rate-by-score-band dashboard

#### Methodology Options

| Option | When to Use | Complexity |
|--------|------------|-----------|
| Manual Rules-Based Scoring | First scoring model, limited data history, simpler sales motion | Low |
| Weighted Multi-Attribute Model | Established ICP, 12+ months of deal data, multiple segments | Medium |
| Predictive/AI-Assisted Scoring | 1000+ historical leads, existing manual model to validate against | High |

> See Methodology for detailed scoring frameworks, calculation rubrics, and the decision matrix for choosing between manual and predictive approaches.

---

## Phase 1: Strategy

> **Goal:** Get stakeholder sign-off on the scoring model design — ICP criteria, behavioral signals, point values, and MQL/SQL thresholds.
>
> **Output:** Approved Scoring Model Specification + Definition Alignment Document (signed off by VP Marketing, VP Sales, RevOps).

### 1a. Pre-Kickoff

> Two parallel tracks run after the project is scoped and before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video | Explain lead scoring concepts: fit vs. engagement, how MQL thresholds work, what scores mean for sales | Video (8-10 min) |
| Definition Alignment Document | Get stakeholder sign-off on MQL, SQL, Fit Score, Engagement Score, ICP | Google Doc |
| Pre-filled intake form | Current lead volume, CRM/MAP platform, existing scoring, sales cycle length, ICP description | Google Form or Doc |

**What the intake form asks:**

- What CRM and marketing automation platform do you use?
- Do you have any existing lead scoring in place? If yes, describe it.
- What is your current MQL definition?
- What is your average monthly lead volume?
- What is your average sales cycle length?
- What industries and company sizes do you sell to?
- How many sales reps will use the scoring model?
- What are the top 3 signals your best reps use to prioritize leads today?

**Completion tracking:** Follow up within 48 hours if intake form is not returned. Do not cancel kickoff if incomplete, but push hard — the CRM data audit can proceed independently.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Pull 50-100 recent leads from CRM for data completeness audit | Lead Data Audit spreadsheet |
| 2 | Analyze closed-won deals (12 months) for ICP attribute patterns | Draft ICP criteria with frequency analysis |
| 3 | Inventory all trackable behavioral signals in MAP | Behavioral signal catalog |
| 4 | Draft v0 scoring model with fit + engagement criteria | v0 Scoring Model Specification (all ASSUMED) |
| 5 | Prepare kickoff assets: gap analysis, draft scoring matrix | Kickoff presentation materials |

**Key data to pull for v0:**

- Closed-won analysis: industry distribution, company size ranges, common titles, average deal size
- Lead data completeness: % of leads with title, company size, industry, revenue, email engagement data
- Behavioral data availability: which actions are tracked (page views, form fills, email clicks, content downloads)

**Critical:** Mark everything as ASSUMED. The kickoff call validates.

#### Stakeholder Alignment Document

> Get stakeholder sign-off on terms BEFORE building anything.

| Term | Our Recommended Definition | Internally Approved? |
|------|---------------------------|----------------------|
| MQL | A lead with Fit Score >= 50 AND Engagement Score >= 25, indicating both ICP match and active interest | [ ] Yes / [ ] No |
| SQL | An MQL accepted by a sales rep after initial outreach, confirmed as a real opportunity | [ ] Yes / [ ] No |
| Fit Score | 0-100 score based on firmographic/demographic match to ICP (industry, size, title, geography) | [ ] Yes / [ ] No |
| Engagement Score | 0-100 score based on behavioral signals indicating buying intent (page views, downloads, demo requests) | [ ] Yes / [ ] No |
| Time Decay | Automatic score reduction (25% per month) for leads with no new engagement activity | [ ] Yes / [ ] No |
| Negative Scoring | Score deductions for disqualifying signals (competitor domain, student email, unsubscribe) | [ ] Yes / [ ] No |

**Instructions to customer:**

> Review each definition with your Sales and Marketing leadership. Check "Yes" when approved. We cannot proceed with building the scoring model until all terms are aligned — misalignment here is the #1 cause of scoring model failure.

---

### 1b. Kickoff Call

> **Purpose:** Present v0 scoring model and get alignment on ICP criteria, behavioral signals, and scoring approach. We walk in with work done — customer reacts, not creates from scratch.

#### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through v0 scoring model | Present draft ICP criteria + behavioral signals from data audit |
| 15-30 | Validate ICP criteria | Sales leadership confirms/corrects fit attributes |
| 30-40 | Review behavioral signals | Marketing Ops validates which actions are trackable and relevant |
| 40-50 | Definition alignment | Review MQL/SQL definitions, get verbal agreement |
| 50-60 | Identify gaps | What data is missing, what enrichment is needed |
| 60+ | Next steps | Schedule refinement meetings, assign homework |

#### What We Bring

- v0 scoring model (ICP criteria + behavioral signals + proposed thresholds, all marked ASSUMED)
- Lead data audit results (data completeness, field coverage)
- Closed-won deal analysis (ICP pattern findings)
- Definition Alignment Document (pre-filled with our recommendations)
- Questions list: What signals do your best reps use? What makes a "bad" lead? What does MQL mean to your team today?

#### What We Leave With

- Validated or corrected ICP criteria (ASSUMED -> CONFIRMED where possible)
- Feedback on behavioral signals (which ones matter, which are noise)
- Agreement on scoring approach (manual rules-based vs. weighted multi-attribute)
- Clear homework: data gaps to fill, additional sales rep interviews if needed
- Alignment loop scheduled

---

### 1c. Alignment Loop & Strategic Meeting Cadence

> **Purpose:** Iterate on the scoring model until all criteria, point values, and thresholds are approved.

#### The Pattern

    Kickoff Call (validate ICP + signals)
    |
    v Scoring model updated with feedback -> v1
    |
    v Meeting 2 (review behavioral scoring detail) -> v2
    |
    v Meeting 3 (review thresholds, negative scoring, time decay) -> v3
    |
    v Final Review -> Sign-off

#### Meeting 2: Behavioral Signal Deep-Dive

**Focus:** Refine engagement scoring with Marketing Ops and 2-3 sales reps.

**Topics:**

1. Walk through all trackable behaviors and proposed point values
2. Validate intent classification: high (demo request = 50 pts), medium (case study download = 20 pts), low (blog visit = 5 pts)
3. Discuss negative scoring triggers: competitor domains, personal email addresses, unsubscribes
4. Discuss time decay approach: 25% reduction per 30 days of no activity vs. absolute point subtraction

**Output:** v2 scoring model with validated behavioral criteria.

#### Meeting 3: Thresholds & Edge Cases

**Focus:** Set MQL/SQL thresholds and address edge cases with VP Sales and RevOps.

**Topics:**

1. Review proposed MQL threshold (Fit >= 50 AND Engagement >= 25)
2. Review proposed SQL threshold (Total Score >= 75 with recent high-intent action)
3. Address edge cases: high fit / low engagement leads, low fit / high engagement leads
4. Discuss re-MQL logic (leads that drop below threshold and re-engage)
5. Review scoring matrix: how 5-10 different lead profiles would score under the model

**Output:** v3 scoring model with finalized thresholds.

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 2-3 days |
| Kickoff call | Day 1 of engagement |
| Meeting loop | 1-2 weeks (2 refinement meetings) |
| Final review + sign-off | When all criteria CONFIRMED |

---

### 1d. Strategic Sign-Off

> **Purpose:** Confirm we have everything before building the scoring model.

#### Validation Checkpoint

- Definition Alignment Document signed off by VP Sales + VP Marketing
- ICP criteria validated (industry, company size, revenue, title, geography)
- Behavioral signals mapped with point values (high, medium, low intent)
- Negative scoring triggers defined
- Time decay rules agreed
- MQL threshold defined and agreed (Fit >= X AND Engagement >= Y)
- SQL threshold defined and agreed
- Scoring matrix reviewed (sample lead profiles scored correctly)
- Data gaps identified with resolution plan
- No blockers for engineering

#### Decision Point

- **Proceed to Engineering** -> Customer wants scoring model built and configured in CRM/MAP
- This project type does NOT have a natural exit point after Phase 1 — the strategic deliverable requires system implementation to deliver value.

---

## Phase 2: Engineering

> **Goal:** Build and configure the lead scoring model in the CRM/marketing automation platform, validate against historical data, and pilot with sales reps.
>
> **Output:** Working scoring system calculating fit and engagement scores for all leads in real-time, with MQL automation and sales notifications.

| Project Type | Engineering Weight | This Project |
|--------------|-------------------|--------------|
| Balanced | Heavy (50-60%) | CRM field creation, scoring rules, automation workflows, historical validation, pilot test |

### Sub-Phases

    2a Tech Spec -> 2b Engineering Handoff -> 2c Build -> 2d Test

---

### 2a. Tech Spec

> **Purpose:** Translate the approved scoring model specification into technical configuration details.

**Input:** Signed-off scoring model specification from Phase 1

**Output:** Draft tech spec containing:

- **Field mappings:** Fit Score (number, 0-100), Engagement Score (number, 0-100), Total Score (formula field), Score Date (date/time), MQL Date (date/time)
- **Fit scoring rules:** For each ICP attribute — field source, scoring logic, point values
  - Example: Industry = "SaaS" -> +20 pts; Industry = "Tech" -> +10 pts; Industry = other -> 0 pts
- **Engagement scoring rules:** For each behavior — trigger event, point value, decay schedule
  - Example: Demo Request form submit -> +50 pts; Pricing page view -> +30 pts; Blog visit -> +5 pts
- **Negative scoring rules:** Trigger conditions and deduction amounts
  - Example: Email domain contains "competitor.com" -> -100 pts; Title contains "Student" -> -50 pts
- **Time decay automation:** Scheduled workflow to subtract engagement points for inactive leads
- **MQL threshold automation:** Workflow logic, notification recipients, assignment rules
- **Re-MQL logic:** How leads that drop below threshold and return are handled
- **Build sequence:** What to configure first (fields -> fit rules -> engagement rules -> negative scoring -> time decay -> MQL automation -> notifications)

---

### 2b. Engineering Handoff

> **Purpose:** Review tech specs with engineer before building.

**Who attends:** Architect + Engineer (or RevOps implementer)

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through specs | Architect explains scoring model strategy + tech spec |
| 15-30 | Platform specifics | Discuss CRM/MAP-specific implementation approach |
| 30-45 | Refine and approve | Confirm field types, automation triggers, build sequence |

**Platform-specific considerations:**

| Platform | Fit Scoring Approach | Engagement Scoring Approach | Key Consideration |
|----------|---------------------|----------------------------|--------------------|
| HubSpot | Use HubSpot Score property with criteria sets | Use HubSpot Score property with behavior rules | Score property supports positive + negative rules natively |
| Salesforce + Marketo | Marketo scoring programs for engagement | Custom fields in SFDC, Marketo syncs scores | Requires Marketo-SFDC field sync configuration |
| Salesforce + Pardot | Pardot scoring rules for both fit + engagement | Native Pardot scoring with grade + score | Pardot separates "Grade" (fit) from "Score" (engagement) |

**What engineer leaves with:**

- Approved tech spec with platform-specific implementation notes
- Clear build sequence
- Known risks: data quality issues, missing tracking, field limits

---

### 2c. Build (Configure)

> **Purpose:** Build the scoring model in the CRM/marketing automation platform.

**Input:** Approved tech spec from 2b

**Build sequence:**

| Step | Component | What to Configure | Platform Reference |
|------|-----------|-------------------|-------------------|
| 1 | Create score fields | Fit Score, Engagement Score, Total Score, Score Date, MQL Date | CRM custom fields |
| 2 | Configure fit scoring rules | Demographic/firmographic criteria with point values | MAP scoring program |
| 3 | Configure engagement scoring | Behavioral triggers with point values for each action type | MAP scoring program |
| 4 | Build negative scoring | Competitor domains, disqualifying titles, personal emails | MAP scoring program |
| 5 | Configure time decay | Scheduled job: reduce engagement score 25%/month for inactive leads | MAP automation/workflow |
| 6 | Build MQL threshold automation | When Fit >= X AND Engagement >= Y -> update status to MQL | MAP workflow or CRM flow |
| 7 | Configure notifications | Email alert to assigned rep or round-robin on new MQL | MAP or CRM notification |
| 8 | Build re-MQL logic | Leads that drop below and re-engage: re-trigger MQL workflow | MAP workflow with conditions |
| 9 | Set up lead assignment | Integration with routing system (LeanData, round-robin, territory) | CRM assignment rules |

**Execution approach for lead scoring:** Manual build recommended for first-time implementation. Each scoring rule should be configured and tested individually before moving to the next.

**Build tracking:**

- Score fields created in CRM
- Fit scoring rules configured (all ICP attributes)
- Engagement scoring rules configured (all behavioral triggers)
- Negative scoring rules configured
- Time decay automation running
- MQL threshold automation configured
- Notifications configured
- Re-MQL logic configured
- Lead assignment integration tested

---

### 2d. QA / Test + Sign-Off

> **Purpose:** Validate the scoring model against historical data and run a live pilot with sales reps.

**Two stages of testing:**

#### Stage 1: Historical Validation

Score a sample of 200+ historical leads (mix of closed-won, closed-lost, and disqualified) to test model accuracy.

**Historical validation checklist:**

- Export 200+ historical leads with known outcomes
- Run all leads through scoring model
- Analyze score distribution: Do closed-won deals cluster at higher scores?
- Calculate conversion rates by score band:
  - 0-25: Expected low conversion (< 5%)
  - 26-50: Moderate conversion (5-15%)
  - 51-75: Good conversion (15-30%)
  - 76-100: High conversion (30%+)
- Verify negative scoring works (competitor leads scored near 0)
- Identify over-weighted or under-weighted criteria
- Adjust point values based on findings

**Key validation metric:** Closed-won deals should score in the top 25% of the scoring distribution. If not, criteria weights need adjustment.

#### Stage 2: Pilot Test (2 weeks)

Run the scoring model live with 3-5 sales reps to validate real-world accuracy.

**Pilot test checklist:**

- Select 3-5 reps for pilot program
- Brief pilot reps on scoring methodology and how to interpret scores
- Have reps work scored leads for 2 weeks and track outcomes
- Collect feedback via survey: Are high-scored leads actually better? Any false positives/negatives?
- Conduct 1:1 interviews on score accuracy perception
- Document adjustments needed based on pilot learnings
- Adjust point values and thresholds based on pilot data

**Engineering sign-off checkpoint:**

- Historical validation shows score-to-conversion correlation
- Pilot reps confirm scores align with lead quality
- All scoring rules firing correctly
- MQL automation working (status updates, notifications)
- Time decay running on schedule
- Ready for full rollout

**Decision point:**

- **Proceed to Enablement** -> Scoring model validated, ready for full sales team training
- **Loop back to Build** -> Pilot revealed scoring issues, needs adjustment

---

## Phase 3: Enablement

> **Goal:** Sales team understands the scoring model and uses it effectively in their daily workflow.
>
> **Output:** Trained team with documentation, stabilized system, no critical issues.

### Sub-Phases

    3a Training Prep -> 3b Training Sessions -> 3c Hypercare -> 3d Enablement Sign-Off

---

### 3a. Training Prep

> **Purpose:** Create training materials from the scoring model specification and CRM configuration.

**Input:** Scoring model specification + tech spec + built system + pilot feedback

**Output:** Training package containing:

- **Score Interpretation Guide:** One-page reference showing what Fit Score, Engagement Score, and Total Score mean, with recommended actions for each score band
- **CRM Walkthrough Script:** Step-by-step video walkthrough script for viewing and filtering leads by score in the CRM
- **FAQ Document:** Based on pilot rep feedback and common scoring questions
  - "Why does this lead have a high fit score but low engagement?"
  - "How often do scores update?"
  - "What happens when a lead re-engages after going cold?"
  - "Can I override a score?"

---

### 3b. Training Sessions

> **Purpose:** Transfer knowledge to the full sales team and marketing ops.

**Training sessions by audience:**

| Session | Audience | Focus | Duration |
|---------|----------|-------|----------|
| Sales Team | All AEs, SDRs, BDRs | What scores mean, how to filter/sort by score, recommended actions per band | 45 min |
| Marketing Ops | Marketing Ops, Demand Gen | How scoring rules work, how to monitor MQL volume, when to flag issues | 45 min |
| Leadership | VP Sales, VP Marketing, RevOps | Score distribution trends, MQL volume and quality metrics, dashboard navigation | 30 min |
| Technical Admin | RevOps Admin, CRM Admin | How to adjust scoring rules, modify thresholds, add new criteria, troubleshoot | 60 min |

**Sales team training agenda (45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-10 | Scoring model overview | Explain fit + engagement scoring, what MQL means |
| 10-20 | Score interpretation | Walk through score bands and recommended actions |
| 20-30 | CRM walkthrough | Live demo: filtering, sorting, viewing lead scores |
| 30-40 | Common scenarios | High fit / low engagement, low fit / high engagement, re-MQL |
| 40-45 | Q&A | Address questions from the team |

**Score band action guide (for sales team training):**

| Score Band | Label | Recommended Action |
|------------|-------|-------------------|
| 76-100 | Hot | Contact within 1 hour. High fit + high engagement = priority |
| 51-75 | Warm | Contact within 24 hours. Good fit or strong engagement |
| 26-50 | Developing | Nurture via marketing sequences. Monitor for score increase |
| 0-25 | Cold | Do not outreach. Let marketing automation handle |

**Training delivery:**

1. Schedule sessions with appropriate stakeholders (stagger over 1 week)
2. Deliver training live (record for future reference)
3. Record video walkthroughs for each session as future onboarding resources
4. Capture questions — feed into FAQ document

**Output:**

- Trained stakeholders across all roles
- Video recordings for onboarding future hires
- Updated FAQ based on training questions

---

### 3c. Hypercare

> **Purpose:** Intensive post-rollout support to stabilize the scoring model with the full team.

**Duration:** 2 weeks post-full-rollout (after the initial 2-week pilot in Phase 2d)

**What happens:**

- Weekly 30-minute office hours for score accuracy questions
- Email channel for quick questions
- Monitor MQL volume: sudden spikes or drops indicate scoring issues
- Triage and fix scoring bugs reported by reps
- Track rep adoption: Are reps actually filtering by score?

**When issues arise:**

| Issue Type | Resolution |
|-----------|-----------|
| Score not updating for a lead | Check automation triggers, verify field sync |
| MQL volume too high | Raise thresholds (increase Fit or Engagement minimum) |
| MQL volume too low | Lower thresholds or review if scoring rules are firing |
| Reps ignoring scores | Reinforce training, address specific objections |
| Score inflation (too many high scores) | Review low-intent behavior weights, check time decay |

**Output:** Stabilized scoring system, no critical issues, reps actively using scores.

---

### 3d. Enablement Sign-Off

> **Purpose:** Confirm the sales team can operate independently with the scoring model.

**Validation checkpoint:**

- All training sessions delivered (sales, marketing ops, leadership, admin)
- Training recordings and documentation provided
- Hypercare period complete
- MQL volume is within expected range (not spiking or dropping)
- Sales reps report improved lead quality in feedback survey
- No critical scoring issues outstanding
- Marketing Ops can troubleshoot basic scoring questions
- RevOps Admin can adjust criteria and thresholds
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** -> Team is enabled, model is stable
- **Extend Hypercare** -> Adoption is low or scoring issues persist

---

## Phase 4: Handoff

> **Goal:** Clean project close with maintenance plan established, quarterly review process documented, and retention/expansion path set.
>
> **Output:** Maintenance schedule documented, internal context transferred, customer owns the scoring model, project archived, future revenue path established.

**Structure:**

    4a Maintenance Schedule -> 4b Internal Handoff -> 4c External Handoff -> 4d Project Close
                               (SME -> Architect)       (to Customer)          (Archive + Debrief)

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|-------------------|---------------|
| **Single Project** | Customer owns | 4c (External Handoff) — customer receives maintenance schedule and runs it themselves |
| **Dedicated (Multi-Project)** | Architect owns | 4b (Internal Handoff) — Architect receives maintenance schedule and runs it for customer |

---

### 4a. Maintenance Schedule

> **Purpose:** Document what needs ongoing attention to keep the scoring model accurate and effective over time. Lead scoring models lose predictive accuracy within 6-12 months without recalibration.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|-------------|--------------|-------------------|
| Score Distribution Check | Histogram of current lead scores — is it bell-shaped? | > 40% of leads scoring above MQL threshold (inflation) |
| MQL Volume Review | Compare MQL count to previous month | > 30% increase or decrease month-over-month |
| Conversion Rate by Band | MQL-to-SQL acceptance rate by score band | Top band converting < 20% (model losing accuracy) |
| Time Decay Verification | Confirm decay automation is running | Stale leads (90+ days inactive) still scoring high |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|---------------|----------------|-------------------|
| Full Model Accuracy Review | Conversion rates by score band vs. initial baselines | Adjust point values for under/over-weighted criteria |
| ICP Criteria Validation | Do closed-won deals still match original ICP? | Update ICP attributes and fit scoring rules |
| Behavioral Signal Relevance | Are scored behaviors still correlated with conversion? | Add new high-intent signals, remove low-value ones |
| MQL Threshold Calibration | Is MQL volume appropriate for sales capacity? | Raise or lower threshold based on acceptance rate |

**After First Business Cycle (60-90 days post-launch):**

- MQL-to-SQL Acceptance Rate: Target 20%+ improvement over pre-scoring baseline
- Score-to-Conversion Correlation: Do higher-scored leads convert at meaningfully higher rates?
- Sales Rep Feedback: Are reps reporting improved lead quality?
- Key Question: Is the model directing reps to the right leads? If not, which criteria need weight adjustment?

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| MQL-to-SQL rate dropping | Below 15% for 2+ months | Review scoring criteria, may need model refresh |
| Score inflation | > 50% of leads above MQL threshold | Tighten criteria weights, add negative scoring |
| New product/market launch | Company enters new segment or vertical | Add new ICP criteria, update fit scoring rules |
| Sales cycle change | Extending by > 30 days vs. model baseline | Recalibrate time decay rules |

**Every 6-12 Months:**

- Full Model Recalibration: Re-analyze closed-won deals, recalculate point values with fresh data
- ICP Refresh: Market conditions, product changes, and competitive landscape may shift ideal customer profile
- Technology Review: New tracking capabilities in MAP may enable scoring on previously unmeasurable behaviors

---

### 4b. Internal Handoff (SME -> Architect)

> **Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- Scoring model logic: what each score component means, how thresholds were set
- Customer context: which stakeholders are engaged, any dynamics around MQL definitions
- Pilot learnings: what was adjusted and why during pilot testing
- Common questions reps ask and how to answer them
- Maintenance schedule and what to watch for monthly
- When to escalate back to SME

**Escalation guidelines:**

| Issue Type | Who Handles |
|-----------|------------|
| "My score looks wrong" questions | Architect |
| MQL threshold adjustment requests | Architect (if minor < 10 pts) |
| Add new ICP criteria or scoring attributes | SME |
| Model recalibration or structural changes | SME |
| Integration with new lead routing system | SME |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing it. SME walks Architect through each monthly and quarterly task.

---

### 4c. External Handoff

> **Purpose:** Formal project completion with customer.

**Final project meeting:**

- Review what was delivered: scoring model, automation, dashboards
- Walk through documentation package
- Demonstrate quarterly review process using monitoring dashboards
- Walk through maintenance schedule in detail
- Record a video walkthrough of the maintenance process
- Address final questions
- Make it explicit: "Scoring model is live and project is complete"

**Documentation package:**

- Scoring Model Specification (all criteria, point values, thresholds)
- Automation Workflow Map (where scoring rules, MQL workflows, and notifications live)
- Score Interpretation Guide (one-pager for sales reps)
- Training video recordings (sales team, marketing ops, admin)
- FAQ Document
- Monitoring Dashboard Guide (what each dashboard shows, how to interpret)
- Troubleshooting Runbook (see below)
- Maintenance Schedule (monthly/quarterly tasks with red flag thresholds)
- Optimization Guide: How to review and adjust scores quarterly

**Troubleshooting runbook for common issues:**

| Scenario | Likely Cause | Resolution Steps |
|---------|-------------|-----------------|
| Lead score not updating | Automation trigger not firing | Check MAP workflow status, verify trigger conditions are met |
| Lead stuck at old score | Time decay not running | Verify scheduled job is active, check job execution logs |
| Wrong MQL status | Threshold logic error or field sync delay | Check MQL workflow conditions, verify CRM-MAP field sync |
| Score inflation (many leads scoring high) | Low-intent behaviors weighted too heavily | Reduce points for email opens, blog visits; increase time decay |
| MQL volume suddenly drops | Scoring rules accidentally modified or disabled | Audit MAP scoring program for recent changes, check rule status |
| Sales reps not seeing scores | CRM layout not updated or field not visible | Add score fields to CRM page layout, check field-level security |
| Notification not firing | Workflow deactivated or email recipient changed | Re-activate notification workflow, verify recipient list |
| Lead re-MQLing incorrectly | Re-MQL logic misconfigured | Review re-MQL workflow conditions, add cooldown period if needed |

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video walkthrough. Make sure they understand what to check, how often, and when to call back.

**Output:** Customer owns the scoring model. Project formally complete.

---

### 4d. Project Close

> **Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved (scoring model spec, tech spec, validation data, training recordings)
- Handoff documentation complete
- Project status updated in tracking system
- Time/billing finalized

#### Internal Debrief (Optional but Recommended)

- What went well? (e.g., pilot test surfaced good refinements)
- What would we do differently? (e.g., should have interviewed more reps in Phase 1)
- Any learnings to feed back into scoring model SOP?

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| **Single Project** | Upsell -> Downsell -> Retry |
| **Multi-Project (Dedicated)** | Schedule Refinement Check-In |

**Single Project Path:**

    1. Upsell: Managed Services (retainer for ongoing scoring optimization)
       | if no
       v
    2. Downsell: Lead Routing/Assignment project (natural next step after scoring)
       | if no
       v
    3. Downsell: Lead Lifecycle project (stage definitions complement scoring)
       | if yes
       v
    4. Retry retainer at end of next project cycle

**Script:**

> "Now that your lead scoring model is live, there are two ways we can continue. Option 1: We handle ongoing scoring optimization and quarterly reviews as part of managed services. Option 2: The natural next step is lead routing — now that you know which leads are highest priority, we can automate how they get assigned to the right rep. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

> "On [date ~90 days out], we'll review how the scoring model is performing — are MQL conversion rates improving? Does the model need recalibration? We'll have dashboard data to review."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull score distribution, MQL volume, conversion by band |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points. |

**At the refinement check-in:**

- Review MQL-to-SQL acceptance rate vs. baseline
- Review conversion rates by score band
- Identify any scoring criteria that need adjustment
- If minor: Architect handles threshold tweaks
- If major: Scope model recalibration project

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Scoring Model Specification: All ICP criteria, behavioral signals, point values, thresholds, negative scoring rules, time decay configuration
- Definition Alignment Document: Agreed definitions for MQL, SQL, Fit Score, Engagement Score
- ICP Criteria Matrix: Weighted firmographic/demographic attributes with tier scoring
- Behavioral Signal Map: Cataloged engagement actions with intent classification and point values

**Technical Deliverables:**

- CRM score fields (Fit Score, Engagement Score, Total Score, Score Date, MQL Date)
- MAP scoring program (fit rules + engagement rules + negative scoring + time decay)
- MQL threshold automation workflow
- Sales notification configuration
- Re-MQL automation logic
- Monitoring dashboards: score distribution, MQL volume, conversion by score band

**Documentation Package:**

- Training video recordings (4 sessions: sales team, marketing ops, leadership, admin)
- Score Interpretation Guide (one-pager)
- FAQ Document
- Troubleshooting Runbook
- Maintenance Schedule (monthly + quarterly tasks)
- Optimization Guide (how to run quarterly reviews)
- Definition Alignment Document (final version)

---

## Appendix

### Roles

| Role | What They Do |
|------|--------------|
| **Architect** | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| **Engineer** | CRM build, automation, dashboards (Phase 2) |
| **SME** | Specialist brought in for project-specific work |

### Phase Outputs & Gate Criteria

| Phase | Output | Gate Criteria |
|-------|--------|--------------|
| **Phase 1: Strategy** | Signed-off Scoring Model Specification + Definition Alignment Document | VP Sales + VP Marketing approved all criteria, thresholds, and definitions |
| **Phase 2: Engineering** | Built and tested scoring system in CRM/MAP | Historical validation passes, pilot reps confirm accuracy, automations working |
| **Phase 3: Enablement** | Trained sales team with documentation | All training delivered, hypercare complete, reps using scores in daily workflow |
| **Phase 4: Handoff** | Independent customer + archived project | Internal/external handoffs complete, maintenance schedule in place, project closed |

### How to Adapt Per Engagement Type

| Engagement Type | What It Means | Key Difference |
|-----------------|--------------|-----------------|
| **Single Project** | One-off scoring model implementation | Customer owns maintenance and quarterly reviews (4c) |
| **Dedicated (Multi-Project)** | Ongoing retainer / multiple projects | Architect owns maintenance and quarterly reviews (4b) |

**Adaptation notes:**

- Phase 1 may compress if the customer already has a documented ICP and historical deal analysis
- Phase 2 expands if multiple scoring models are needed (e.g., by segment, by product line, or by geography)
- Phase 3 is critical — sales reps will not use scores they do not understand. Do not skip training.
- Phase 4 always applies — scoring models degrade without quarterly maintenance

### Phase Guide Summaries

**Phase 1 — How We Create Value in Strategy:**

1. We educate. Most companies think lead scoring is just "assign points to stuff." We educate them on the dual-axis model (fit + engagement), why both dimensions matter, and what separates a scoring model that works from one that creates noise.
2. We drive alignment. The #1 scoring model failure mode is marketing-sales misalignment on MQL definitions. We force alignment through the Definition Alignment Document and joint design sessions.
3. We come with an opinion. We show up with a v0 scoring model built from their own CRM data. We have recommended thresholds based on having done this for similar companies. They are confirming and adjusting, not creating from scratch.
4. We show best practices. We anchor in proven patterns: separate fit and engagement scores, require minimums for both to qualify as MQL, implement time decay, and use score bands to guide rep behavior.

**Phase 2 — Key Principles:**

- **Tech Spec (2a):** Translate scoring model specification into platform-specific configuration. Review for edge cases the spec did not anticipate (e.g., leads from acquired companies, partner-referred leads).
- **Engineering Handoff (2b):** The engineer must understand WHY certain behaviors are scored higher than others — not just the point values. Context prevents "optimizing" the configuration in ways that break the strategic intent.
- **Build (2c):** Build scoring rules one category at a time: fit rules first, then engagement, then negative, then time decay, then automation. Test each category before adding the next. This isolates issues during QA.
- **Historical Validation (2d):** This is the most critical QA step. B2B SaaS companies using behavioral scoring models achieve 39-40% MQL-to-SQL conversion rates, far exceeding the 13% average. If the historical validation does not show score-to-conversion correlation, the model needs revision before going live.

**Phase 3 — Key Principles:**

- **Training Prep (3a):** The Score Interpretation Guide is the single most important training asset. Reps need a one-page reference showing score bands and recommended actions — not a 20-page document explaining scoring methodology.
- **Training Sessions (3b):** Demonstrate with real leads. Pull 5-10 current leads from the CRM and walk through their scores live. Show why a high-fit/low-engagement lead scored where it did. Show why a competitor lead scored near zero.
- **Hypercare (3c):** Office hours pattern — put recurring time on calendar, anyone can hop on and share what is not working. The first 2 weeks after full rollout are when adoption either sticks or fails. Monitor rep behavior: are they filtering by score? If not, find out why.

**Phase 4 — Why Maintenance Schedules Matter:** Lead scoring models are not "set and forget." Markets shift, products evolve, and buyer behaviors change. A model built on 2024 data may not accurately predict 2025 conversions. The maintenance schedule prevents drift by making monitoring explicit and cadenced. Research shows that scoring models lose predictive accuracy within 6-12 months without recalibration. The quarterly review built into the maintenance schedule catches drift before it becomes a problem.

### Troubleshooting: Edge Cases

| Edge Case | Symptoms | Resolution |
|-----------|----------|-----------|
| High fit / low engagement leads | Good ICP match but no activity — scored as "Warm" not "Hot" | Expected behavior. Marketing should nurture. Do not lower fit threshold. |
| Low fit / high engagement leads | Bad ICP match but very active on website | Expected behavior. Negative fit score should keep total below MQL. If these are converting, revisit ICP criteria. |
| Score inflation over time | MQL volume increases without proportional conversion improvement | Time decay not aggressive enough or too many low-intent behaviors scored |
| New employee at existing customer | Same domain, new contact — scores high on fit | Add logic to flag existing customer domains (score or route differently) |
| Partner-referred leads | Referral source should boost score but no automation | Add "referral source" as positive scoring attribute in engagement |
| Multiple contacts from same account | Five contacts from one company all score as MQL | Consider account-level scoring: if 3+ contacts from same account engage, escalate the account |

---

## References

[1] Landbase - 35 Lead Qualification Statistics for B2B Sales

[2] Martal Group - B2B Lead Scoring: Top Practices Driving Results

[3] Forwrd.ai - Lead Qualification Benchmarks: In-Depth Guide

[4] HubSpot - Set Up Score Properties to Qualify Contacts, Companies, and Deals

[5] Salesforce Trailhead - Lead Scoring and Grading in Account Engagement

[6] Data-Mania - MQL to SQL Conversion Rate Benchmarks 2026

[7] Worknet.ai - 8 Lead Scoring Best Practices for SaaS

[8] Salesforce - Sales Research 2023: Reps Spend Less Than 30% of Time Selling
