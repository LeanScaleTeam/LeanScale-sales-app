# Sales to CS Handoff Process Implementation — Implementation

## Project One-Pager

### Project Type
- **Category:** Balanced
- **Primary Deliverable:** Documented, CRM-integrated handoff workflow between Sales and Customer Success with automated triggers, required data fields, and clear ownership transitions

### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Medium | 2-3 alignment meetings between Sales and CS leadership |
| 2. Engineering | Yes | Medium | CRM field config, automation rules, validation logic |
| 3. Enablement | Yes | Medium | Both Sales and CS teams need training, pilot period |
| 4. Handoff | Yes | Medium | Internal + External, governance handoff to RevOps |

### Phase Overview

Full 4-phase execution with medium-weight strategy (cross-functional alignment critical), medium engineering (CRM config + automation), medium enablement (both Sales and CS must adopt), standard handoff. No phases skipped. Pilot maps into Phase 2d QA/Test and Phase 3c Hypercare.

**This project's flow:**
- Full 4-phase execution
- Medium-weight strategy (cross-functional alignment is critical)
- Medium engineering (CRM config + automation)
- Medium enablement (both Sales and CS must adopt)
- Standard handoff
- No phases skipped
- Pilot maps into Phase 2d QA/Test and Phase 3c Hypercare

## Pre-Kickoff (1a)

### Track A: Customer Homework

**Completion tracking:** RevOps contact or project champion follows up. Do not cancel kickoff if incomplete, but push hard for CRM access and VP availability.

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video | Explain what a structured handoff process looks like and why it reduces churn and time-to-value | Video walkthrough (5-10 min) |
| Definition Alignment Document | Get stakeholder agreement on handoff terminology | Google Doc |
| Pre-filled intake form | Confirm current practices, CRM platform, CS model | Google Form or Doc |

The intro video should cover: "Up to 67% of SaaS customer churn originates during onboarding, and a significant portion of that traces back to poor handoff execution between Sales and CS. A well-executed handoff makes a customer 3.5x more likely to continue their journey with the vendor. This project eliminates the information gap between teams."

### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Get CRM access, review last 10-15 closed deals for data gaps | Gap analysis: what fields exist, what's missing |
| 2 | Interview 3-5 Sales reps (async or live) on current handoff | Qualitative pain points, informal practices |
| 3 | Interview 3-5 CSMs on what context they receive vs. need | CS wish list, recurring information gaps |
| 4 | Draft v0 handoff checklist based on audit + interviews | v0 Handoff Information Checklist |
| 5 | Draft v0 handoff workflow (trigger → steps → CS first touch) | v0 Handoff Workflow Map |

**Critical:** Mark everything as ASSUMED. The kickoff call validates. Pre-populate the checklist with industry-standard handoff fields (customer goals, stakeholders, scope, risks, communication preferences) and flag which ones the client's CRM currently captures.

### Stakeholder Alignment Document

Get stakeholder sign-off on terms BEFORE building anything.

| Term | Our Definition | Internally Approved? |
|------|---|---|
| Handoff | Structured transfer of account context from Sales to CS at deal close | [ ] Yes / [ ] No |
| Handoff Trigger | Deal stage that initiates the handoff process (recommend: Closed-Won) | [ ] Yes / [ ] No |
| Handoff Completion | All required fields populated + CS owner assigned + handoff summary reviewed | [ ] Yes / [ ] No |
| Time to First Touch | Hours from deal close to first CSM outreach to customer | [ ] Yes / [ ] No |
| High-Touch Handoff | Enterprise deals requiring a live AE-to-CSM handoff call | [ ] Yes / [ ] No |
| Low-Touch Handoff | Standard deals handled via automated notification + CRM data transfer | [ ] Yes / [ ] No |

**Instructions to customer:**

> Review each definition with your Sales and CS leadership. Check "Yes" when approved. We cannot proceed to CRM build until all terms are aligned — misaligned definitions mid-build cause rework and scope creep.

---

## Phase 1: Strategy

**Goal:** Get Sales and CS leadership aligned on handoff process design — what information transfers, when, how, and who owns each step.

**Output:** Signed-off Handoff Process Design Document + Definition Alignment Document + Handoff Information Checklist.

### 1b. Kickoff Call

**Purpose:** Present v0 handoff checklist and workflow, validate assumptions against real-world practices. We walk in with work done — customer reacts, not creates from scratch.

#### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Current state walkthrough | Present gap analysis: "Here's what we found in your CRM" |
| 15-30 | v0 handoff checklist review | Walk through proposed required fields, get reactions |
| 30-45 | Handoff workflow review | Present trigger criteria, SLAs, escalation paths |
| 45-55 | Definition alignment | Review Definition Alignment Doc, identify disagreements |
| 55-70 | Segment discussion | Discuss whether enterprise and SMB need different handoff types |
| 70+ | Next steps | Schedule refinement meetings, assign homework |

#### What We Bring

- v0 Handoff Information Checklist (pre-filled with recommended fields)
- v0 Handoff Workflow Map (trigger → steps → CS first touch)
- Gap analysis from CRM audit
- Definition Alignment Document (pre-filled with our recommendations)
- Interview summaries (anonymized themes from Sales and CS conversations)

#### What We Leave With

- Feedback and corrections on v0 checklist (info needed for v1)
- Initial alignment on handoff trigger (Closed-Won vs. earlier for complex deals)
- Understanding of segment differences (enterprise vs. SMB)
- Confirmed definitions or clear blockers requiring stakeholder escalation
- Homework assignments (theirs: internal alignment on definitions; ours: updated process design)

### 1c. Alignment Loop & Strategic Meeting Cadence

**Purpose:** Iterate on the handoff process design until Sales and CS leadership both sign off.

#### The Pattern

```
Kickoff Call (present v0, gather feedback)
    ↓
Update handoff checklist + workflow → v1
    ↓
Meeting 2 (align on required fields, SLAs, escalation) → v2
    ↓
Meeting 3 (segment variations, edge cases) → v3
    ↓
Final Review → Sign-off
```

#### Meeting Types for This Project

| Meeting Type | Focus | Stakeholder |
|---|---|---|
| Cross-functional align | Required fields, trigger criteria, SLAs | VP Sales, VP CS, RevOps |
| Segment design | Enterprise vs SMB handoff variations | Sales Managers, CSM Leads |
| Data validation | Verify CRM can support required fields, review layouts | RevOps, CRM Admin |
| Final review | Full process walkthrough, sign-off | All stakeholders |

#### Before Each Meeting

1. Update handoff process design based on previous meeting feedback
2. Prepare specific questions for next validation round
3. Flag any unresolved conflicts between Sales and CS requirements

#### During Each Meeting

1. Walk through current version of handoff design
2. Capture corrections and refinements
3. Validate what's now CONFIRMED vs. still ASSUMED
4. Surface and resolve cross-team disagreements (Sales wants fewer required fields, CS wants more)

#### After Each Meeting

1. Update handoff checklist and workflow documents
2. Track what moved from ASSUMED → CONFIRMED
3. Document any decisions that need executive escalation

#### Typical Timeline

| Milestone | Timing |
|---|---|
| Pre-kickoff prep | 3-5 days (includes interviews + CRM audit) |
| Kickoff call | Day 1 of engagement |
| Meeting loop | 1-2 weeks (2-3 refinement meetings) |
| Final review + sign-off | When VP Sales and VP CS both approve the handoff design |

### 1d. Strategic Sign-Off

**Purpose:** Confirm we have everything to proceed to CRM build.

#### Validation Checkpoint

- [ ] Definition Alignment Document signed off by VP Sales and VP CS
- [ ] Handoff Information Checklist finalized (required vs. optional fields by segment)
- [ ] Handoff Workflow Map approved (trigger, SLAs, escalation paths, segment variations)
- [ ] All critical decisions CONFIRMED (trigger criteria, field requirements, ownership model)
- [ ] CRM admin access confirmed and fields scoped
- [ ] No blockers for engineering

#### Decision Point

- **Proceed to Engineering** → Build the handoff workflow in CRM (standard path for this project)
- **Loop back to Strategy** → If Sales and CS leadership cannot agree on required fields or trigger criteria, facilitate an executive alignment session

> This project type always proceeds to Engineering. The strategic deliverable (process design document) is not the end product — the CRM-integrated workflow is.

---

## Phase 2: Engineering

**Goal:** Build and test the handoff workflow in CRM — fields, validation rules, automations, templates, and notifications.

**Output:** Fully configured CRM handoff system, tested with sample records and piloted with 5-10 real deals.

### Sub-Phases

```
2a Tech Spec → 2b Engineering Handoff → 2c Build → 2d Test/Pilot
```

### 2a. Tech Spec

**Purpose:** Translate the approved handoff process design into CRM-specific technical specifications.

**Input:** Signed-off handoff process design from Phase 1

**What happens:**

1. Map each handoff field to a CRM object and field type
2. Define automation rules (triggers, conditions, actions)
3. Output draft technical specification

**Output:** Draft tech spec containing:

- **Field mappings:** Each handoff field → CRM object (Opportunity/Account), field type (text, picklist, checkbox), required vs. optional
- **Page layout changes:** Handoff section added to Opportunity and/or Account layouts
- **Validation rules:** Required fields before stage advancement to Closed-Won
- **Automation rules:** Deal close → CS owner assignment, email notification, task creation
- **Handoff summary template:** Auto-populated report or document format
- **Permission sets:** Field visibility for Sales vs. CS roles

### 2b. Engineering Handoff

**Purpose:** Review tech specs with CRM admin before building.

**Who attends:** Architect + CRM Admin (or RevOps engineer)

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through tech spec | Architect explains handoff design context + spec |
| 15-30 | Admin questions | Clarify field types, automation feasibility, layout limits |
| 30-45 | Refine and approve | Adjust spec for CRM-specific constraints, confirm approach |

**What Architect brings:**

- Handoff process design (for strategic context)
- Draft tech spec (from 2a)
- Questions list (field naming conventions, existing automation conflicts)

**What admin leaves with:**

- Approved tech spec with build sequence
- Known dependencies (e.g., existing validation rules that may conflict)
- Clear priority: which automations to build first

### 2c. Build (Configure)

**Purpose:** Build the handoff workflow in the CRM.

**Input:** Approved tech spec from 2b

**Build sequence (recommended order):**

| Order | Component | Platform Detail |
|------|---|---|
| 1 | Create/repurpose CRM fields | Salesforce: custom fields on Opportunity/Account; HubSpot: deal/company properties |
| 2 | Add handoff section to page layouts | Salesforce: Lightning page layout; HubSpot: record customization |
| 3 | Configure validation rules | Salesforce: validation rule on Closed-Won; HubSpot: required properties on deal stage |
| 4 | Build CS owner assignment automation | Salesforce: Flow/Process Builder; HubSpot: workflow |
| 5 | Build notification automation | Email alert to assigned CSM on deal close |
| 6 | Build task creation automation | Auto-create handoff review task for CSM |
| 7 | Create handoff summary template | Google Doc template, CRM notes template, or auto-generated report |
| 8 | Set up handoff metrics dashboard | Completion rate, time to first touch, escalation count |
| 9 | Configure permission sets | Sales can edit handoff fields, CS has read access + intake fields |

**Build tracking:**

- [ ] Component 1: CRM fields created
- [ ] Component 2: Page layouts updated
- [ ] Component 3: Validation rules active
- [ ] Component 4: CS owner assignment automation
- [ ] Component 5: Notification automation
- [ ] Component 6: Task creation automation
- [ ] Component 7: Handoff summary template
- [ ] Component 8: Metrics dashboard
- [ ] Component 9: Permission sets configured

### 2d. QA / Test + Pilot + Sign-Off

**Purpose:** Verify the build works, then pilot with real deals before full rollout.

**Two phases of testing:**

| Phase | Who | Purpose |
|---|---|---|
| Technical QA | Our team | Verify automations fire, fields validate, notifications send |
| Pilot (5-10 deals) | Sales + CS | Test with real handoffs, collect usability feedback |

**Technical testing checklist:**

- [ ] Validation rule prevents Closed-Won without required handoff fields
- [ ] Validation rule allows exception workflow (manager override if needed)
- [ ] CS owner auto-assigned on deal close
- [ ] Email notification sent to CSM within 5 minutes of close
- [ ] Handoff review task auto-created for CSM
- [ ] Handoff summary populates with correct deal data
- [ ] Dashboard displays accurate completion rates
- [ ] Permission sets enforce correct visibility (Sales edits, CS reads)
- [ ] Edge case: deal re-opened after close does not duplicate notifications

**Pilot execution (5-10 deals):**

1. Select 5-10 upcoming deals for pilot (mix of enterprise and SMB if applicable)
2. Brief participating AEs and CSMs on pilot process
3. Execute handoffs using new workflow and templates
4. Track: time to complete handoff, time to CS first touch, data completeness
5. Collect structured feedback from pilot AEs ("What was hard? What was missing?")
6. Collect structured feedback from pilot CSMs ("Did you get what you needed?")
7. Survey pilot customers on their handoff experience (optional)
8. Fix issues, update templates and automations based on feedback

**Engineering sign-off checkpoint:**

- [ ] Built system matches tech spec
- [ ] All technical tests passing
- [ ] Pilot completed with 5-10 deals
- [ ] Pilot feedback incorporated
- [ ] Ready for full rollout and enablement

**Decision point:**

- **Proceed to Enablement** → Pilot successful, system stable, proceed to full training
- **Loop back to Build** → Critical issues found in pilot, fix before rollout

---

## Phase 3: Enablement

**Goal:** Both Sales and CS teams can execute the new handoff process independently.

**Output:** Trained teams with documentation, stabilized process through hypercare, no critical issues.

### Sub-Phases

```
3a Training Prep → 3b Training Sessions → 3c Hypercare → 3d Enablement Sign-Off
```

### 3a. Training Prep

**Purpose:** Create training materials from the handoff process design and CRM build.

**Input:** Handoff process document + tech spec + CRM screenshots + pilot feedback

**Output:** Training package containing:

- **Sales Training Guide:** Quick-reference card with required fields, timing expectations, handoff template walkthrough, what "done" looks like
- **CS Intake Guide:** Where to find handoff data in CRM, intake checklist, escalation process for incomplete handoffs, how to flag issues
- **Leadership Brief:** Dashboard interpretation, governance cadence, what to watch
- **FAQ Document:** Common questions from pilot (e.g., "What if I don't have the info yet?", "What about mid-quarter deal changes?")
- **Video walkthrough scripts:** Walkthrough recordings for Sales and CS separately

### 3b. Training Sessions

**Purpose:** Transfer knowledge to Sales and CS teams.

**Training schedule:**

| Session | Audience | Duration | Focus |
|---|---|---|---|
| 1 | Sales Team (all AEs) | 45 min | Handoff requirements, required fields, template, timing SLAs |
| 2 | CS Team (all CSMs) | 45 min | Intake process, CRM navigation, escalation, verify completeness |
| 3 | Leadership | 30 min | Dashboard review, governance rhythm, metrics to watch |

**Sales training agenda:**

1. Why this matters (customer experience, reduced churn, CS efficiency)
2. Walk through a sample handoff using real CRM screens
3. Required fields walkthrough — what each one means and why CS needs it
4. Handoff summary template — how to complete it in 5-10 minutes per deal
5. Timing expectations — when to start filling fields, deadline for completion
6. Edge cases — what to do when you do not have the information
7. Q&A

**CS training agenda:**

1. Where to find handoff data in CRM — navigate to handoff section
2. Intake checklist — how to verify completeness before first customer touch
3. Escalation process — what to do when handoff is incomplete
4. Practice identifying an incomplete handoff and requesting missing info
5. Dashboard walkthrough — where to see your pipeline of incoming handoffs
6. Q&A

**Output:**

- Trained Sales and CS teams
- Video recordings of both sessions
- Questions log (feeds into updated FAQ)

### 3c. Hypercare

**Purpose:** Intensive post-launch support to catch issues and stabilize the new process.

**Duration:** 4 weeks

**What happens:**

- Weekly 30-minute office hours — anyone from Sales or CS can hop on with questions
- Async questions channel for ongoing support
- Bug triage: fix automation issues within 24 hours
- Process refinement: adjust fields, templates, or escalation paths based on real usage
- Monitor handoff completion rates daily for first 2 weeks, then weekly

**Specific monitoring during hypercare:**

| Week | Focus | Red Flag |
|---|---|---|
| 1 | Are notifications firing? Are Sales reps completing fields? | Completion rate below 50% |
| 2 | Is CS using the handoff data? Are escalations working? | CSMs still asking customers to repeat info |
| 3 | Are edge cases handled? Any automation conflicts? | More than 3 unresolved exception requests |
| 4 | Is the process stable without daily intervention? | Completion rate not trending toward 80%+ |

**When to extend:** If handoff completion rate is below 70% at week 4, extend hypercare by 2 weeks and investigate root causes (field confusion, automation gaps, management reinforcement needed).

**Output:** Stabilized system, no critical issues, process running without daily Architect support.

### 3d. Enablement Sign-Off

**Purpose:** Confirm both teams can operate the handoff process independently.

**Validation checkpoint:**

- [ ] All training sessions delivered and recorded
- [ ] Training recordings and documentation provided to customer
- [ ] Hypercare period complete
- [ ] Handoff completion rate trending above 80%
- [ ] No critical issues outstanding
- [ ] Sales and CS teams operating without daily support
- [ ] Ready for handoff

**Decision point:**

- **Proceed to Handoff** → Teams are enabled, process stable
- **Extend Hypercare** → Adoption still below threshold, needs more coaching or process adjustments

---

## Phase 4: Handoff

**Goal:** Clean project close with maintenance plan, governance rhythm, and retention path established.

**Output:** Maintenance schedule documented, internal context transferred, customer owns the process, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule → 4b Internal Handoff → 4c External Handoff → 4d Project Close
                            (SME → Architect)      (LS → Customer)       (Archive + Debrief)
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|---|---|---|
| Single Project | Customer RevOps owns | 4c — customer receives maintenance schedule and runs it |
| Dedicated (Multi-Project) | Architect owns | 4b — Architect receives maintenance schedule and runs it for customer |

### 4a. Maintenance Schedule

**Purpose:** Document what needs ongoing attention after the project is complete.

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|---|---|---|
| Handoff completion rate review | % of closed deals with all required fields populated | Below 85% for 2+ consecutive months |
| Time to first touch review | Average hours from close to CSM first outreach | Above 48 hours consistently |
| Escalation volume check | Number of incomplete handoff escalations | More than 20% of handoffs require escalation |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|---|---|---|
| Handoff field relevance review | Are all required fields still useful? Any new ones needed? | Add/remove fields, update validation rules |
| SLA performance review | Are handoff and first-touch SLAs being met? | Adjust SLAs or escalation triggers |
| Process feedback collection | Survey Sales and CS on friction points | Update templates, training, or automation |
| New hire onboarding check | Are new AEs and CSMs trained on handoff process? | Schedule refresher training |

**After First Business Cycle (60-90 days post-launch):**

- Full handoff completion rate analysis: trending toward 90%+ target?
- Time to First Value comparison: has onboarding ramp time decreased? Target: 20%+ improvement
- Customer satisfaction impact: any signal from NPS or onboarding surveys?
- Process maturity assessment: are teams self-sufficient?

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---|---|---|
| Handoff completion rate drop | Below 80% for 2+ months | Re-engage for process audit, refresh training |
| New customer segment launch | Adding enterprise/SMB tier | Scope new handoff variation, may require mini-project |
| CRM migration or major change | Platform change or major workflow update | Full process redesign required |
| CS team restructure | New CSM assignment model | Update automation rules, retrain on intake process |

**Every 6-12 Months:**

- Full process review: field relevance, automation health, SLA appropriateness
- Benchmark against industry standards: handoff completion rates above 90% indicate mature process
- Assess whether handoff data is feeding downstream processes (health scoring, renewal planning)

### 4b. Internal Handoff (SME → Architect)

**Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- What was built and why (handoff process design rationale, cross-functional alignment decisions)
- CRM automation logic (what triggers, what conditions, what actions)
- Customer context (who the key stakeholders are, any political dynamics between Sales and CS)
- Common issues and resolution steps (see troubleshooting guide in Appendix)
- When to escalate back to SME
- **Maintenance schedule** (if Dedicated engagement — Architect runs this)

**Escalation guidelines:**

| Issue Type | Who Handles | Example |
|---|---|---|
| Small tweaks, minor questions | Architect | Add a field, adjust notification timing |
| Significant changes, complex issues | SME | New segment handoff type, automation logic change |
| Field requirement changes | Architect (with RevOps) | Mark a field as optional instead of required |
| Process redesign or CRM platform changes | SME | Migration to new CRM, new CS ownership model |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing it. SME walks Architect through each maintenance task.

### 4c. External Handoff (LS → Customer)

**Purpose:** Formal project completion with customer.

**Final project meeting:**

- Review what was delivered (handoff process, CRM configuration, training materials)
- Walk through handoff metrics from first month — current completion rate, time to first touch
- Walk through documentation package
- Confirm governance owner (RevOps or CS Ops lead)
- Establish governance rhythm (who reviews handoff metrics, how often)
- Answer final questions
- Make it explicit: "Project complete"
- **For Single Project engagements:** Hand over the maintenance schedule and walk the customer through each cadence

**Documentation package:**

- Handoff Process Document (final version)
- CRM Configuration Guide (fields, validation rules, automations)
- Handoff Summary Template
- Sales Quick-Reference Card
- CS Intake Checklist
- Training video recordings (Sales and CS sessions)
- FAQ Document
- Metrics Dashboard guide
- Maintenance Schedule
- Definition Alignment Document (final version)

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video walkthrough. The customer's RevOps team takes ownership of monthly and quarterly reviews.

**Output:** Customer owns the handoff process. Project formally complete.

### 4d. Project Close

**Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- [ ] All project artifacts saved to proper location
- [ ] Handoff documentation complete
- [ ] Project status updated in tracking system
- [ ] Time/billing finalized

#### Internal Debrief (Optional but Recommended)

- What went well? (e.g., Sales leadership buy-in, clean CRM data, quick alignment)
- What would we do differently? (e.g., more time on CS training, earlier pilot)
- Any learnings to feed back into SOPs?
- How did cross-functional alignment go? Any patterns to reuse?

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|---|---|
| Single Project | Upsell → Downsell → Retry |
| Multi-Project (Dedicated) | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (retainer for ongoing process optimization)
   ↓ if no
2. Downsell: Customer Health Model, Onboarding Process Improvement, or NPS/VoC Launch
   ↓ if yes
3. Retry retainer at end of next project cycle
```

**Script:**

> "Now that the handoff process is live and running, there are two ways we can continue working together. Option 1: We can set you up on managed services where we handle ongoing optimization, new hire training, and quarterly reviews. Option 2: If there's another specific project — like building a customer health model or improving your onboarding workflow — we can scope that out. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

> "On [date ~90 days out], we'll review handoff completion rates, time-to-first-value trends, and see if any process adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|---|---|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull handoff completion rate, time to first touch, escalation data |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points. |

**At the refinement check-in:**

- Review handoff completion rates against 90% target
- Review time to first touch against SLA
- Identify any process adjustments needed
- If minor: Architect handles tweaks (field changes, template updates)
- If major: Scope new project (new segment handoff type, CRM migration support)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Handoff Process Design Document (trigger criteria, required fields, workflow, SLAs, escalation paths)
- Definition Alignment Document (signed-off terminology)
- Current State Gap Analysis (from CRM audit and interviews)

**Technical Deliverables:**

- CRM field configuration (handoff fields on Opportunity/Account)
- Validation rules (required fields before Closed-Won)
- Automation workflows (CS owner assignment, notifications, task creation)
- Handoff Summary Template (auto-populated or manually completed per deal)
- Metrics Dashboard (completion rate, time to first touch, escalation volume)

**Documentation Package:**

- Training video recordings (Sales session, CS session)
- Sales Quick-Reference Card
- CS Intake Checklist
- FAQ Document
- CRM Configuration Guide
- Maintenance Schedule
- Definition Alignment Document (final version)

---

## Appendix

### Roles

| Role | What They Do |
|---|---|
| Architect | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| Engineer | CRM build, automation, dashboards (Phase 2) |
| SME | Project/implementation team brought in for project-specific work |
| AE | Closes the deal (pre-project) |

### Phase Outputs & Gates

| Phase | Output | Gate Criteria |
|---|---|---|
| Phase 1: Strategy | Signed-off handoff process design + Definition Alignment Document | VP Sales and VP CS approve process design, all definitions aligned |
| Phase 2: Engineering | Built and tested CRM handoff system | System matches tech spec, pilot complete, customer approved |
| Phase 3: Enablement | Trained Sales and CS teams with documentation | All training delivered, hypercare complete, teams operating independently |
| Phase 4: Handoff | Independent customer + archived project | Internal/external handoffs complete, maintenance plan in place, project closed |

### How We Create Value in Strategy

1. **We educate.** Sales and CS teams often do not recognize how much revenue leaks from poor handoffs. We educate them on the cost: "up to 67% of churn originates during onboarding, and 60% of B2B buyers feel post-purchase regret within the first year due to poor post-sales handoff execution."

2. **We drive alignment.** Sales and CS leadership frequently disagree on what information should be required at handoff. Sales wants fewer mandatory fields; CS wants comprehensive context. We facilitate that conversation and create forcing functions (validation rules, required fields) to ensure compliance.

3. **We come with an opinion.** We show up with a v0 handoff checklist based on what we have seen work across dozens of similar implementations. They are confirming and adjusting, not creating from scratch.

4. **We show best practices.** We anchor the handoff design in industry data: "companies with structured handoff processes are 3.5x more likely to retain customers, and ideal onboarding completion happens within 30 days to maintain momentum."

#### Why Definition Alignment Matters

Handoff projects stall when Sales and CS define "handoff completion" differently. Sales may consider it done when they send a message; CS may consider it done only when all fields are populated. Getting sign-off on definitions BEFORE building prevents scope creep and rework.

### Engineering Principles

**Tech Spec (2a):** Translate the strategic handoff design into CRM-specific language. Review for CRM-specific constraints (field limits, automation quotas, existing workflow conflicts).

**Build (2c):** Start with fields and validation rules (these enforce the process). Then add automations (these make it easier). Finally, add templates and dashboards (these provide visibility). This sequence ensures the foundation is solid before adding convenience layers.

**Pilot (2d):** The pilot is critical for this project type. Handoff processes touch two teams with potentially conflicting incentives. Real-world testing reveals friction that technical QA cannot catch.

### Enablement Principles

**Training Prep (3a):** Draft training materials, then review and record video walkthroughs. Separate materials for Sales and CS — they have different concerns and different CRM views.

**Hypercare (3c):** The first 4 weeks after launch are when adoption either takes hold or fails. Office hours pattern — put recurring time on calendar, anyone can hop on. Monitor completion rates daily for the first 2 weeks. If rates are low, the problem is usually one of: (a) fields are confusing, (b) Sales managers are not reinforcing, or (c) validation rules have too many gaps.

### Troubleshooting Guide

| Scenario | Symptoms | Resolution |
|---|---|---|
| Sales reps skip required fields | Validation rule complaints, override requests | Review field list — remove truly optional fields, reinforce with Sales management, consider auto-populating from existing CRM data |
| CS still asks customers to repeat info | Customer complaints, CS not checking handoff data | Retrain CS on intake checklist, add handoff review as first step in onboarding workflow, measure and report repeat-ask rate |
| Enterprise deals break the process | Complex accounts get stuck, multiple stakeholders | Ensure tiered handoff is configured, add live handoff call option for enterprise, allow multi-CSM assignment |
| Notification fatigue | CSMs ignoring handoff alerts | Reduce to essential notifications only, batch alerts for high-volume days, use priority flags |
| Handoff summary template too long | Sales reps spending 30+ minutes per handoff | Simplify to essential fields, auto-populate where possible, target 5-10 minutes per deal |
| New hires do not know the process | Completion rates drop after hiring wave | Include handoff training in onboarding checklist, assign buddy system for first 5 handoffs |
| Process works for standard deals but not renewals | Renewals or upsells bypass handoff | Extend handoff trigger to include renewal/upsell close stages, create lighter-weight variation |

### Definition Alignment Terms

| Term | Typical Definition |
|---|---|
| Handoff | The structured transfer of account ownership and context from Sales to Customer Success at deal close |
| Handoff Trigger | The specific deal stage or event that initiates the handoff process (typically Closed-Won) |
| Handoff Completion | All required fields populated, CS owner assigned, handoff summary reviewed by CSM |
| Time to First Touch | Elapsed time from deal close to first CSM outreach to the customer |
| High-Touch Handoff | Enterprise/complex deals requiring a live handoff call between AE and CSM |
| Low-Touch Handoff | SMB/standard deals handled via automated notification and CRM data transfer only |
| Handoff Completion Rate | Percentage of closed deals where all required handoff fields are populated before or at close |
| Escalation Path | Defined process for addressing incomplete handoffs, including who follows up and when |

### Common Gotchas

- Sales views handoff fields as busywork and skips them → Make fields genuinely useful (pre-populate where possible), enforce with validation rules, get Sales leadership to reinforce in team meetings
- CS team ignores handoff data and re-asks customers → Build CS intake checklist as a required step, measure and report on customers asked to repeat info
- Enterprise deals break the standard handoff process → Design tiered handoff from the start (low-touch vs high-touch), allow flexibility on format while keeping core required fields
- Process adoption degrades after launch excitement fades → Establish monthly governance review, include handoff quality in performance metrics, assign RevOps owner
- CRM validation rules block legitimate edge cases → Build exception handling workflow (e.g., override with manager approval), document exceptions in FAQ
- Notification fatigue from too many automated alerts → Start with essential notifications only (CSM assignment, handoff ready), add more based on feedback

### Methodology Options

| Option | When to Use | Complexity |
|---|---|---|
| Low-Touch (Automated Only) | SMB deals, high volume, standard product | Low |
| High-Touch (Live Call) | Enterprise deals, complex scope, multiple stakeholders | High |
| Hybrid | Mix of deal sizes, segment-based routing | Medium |

---

## References

[1] UserGuiding - Customer Onboarding Statistics and Trends 2026

[2] RevPartners - Mastering the Sales to Customer Success Handoff

[3] Userpilot - Time-to-Value Benchmark Report 2024

[4] Custify - Customer Success Industry Market Statistics 2026

[5] Tryopine - The Hidden Retention Killer: Broken Presales to Post-Sales Handoffs

[6] Onramp - The Top Customer Onboarding Metrics to Prioritize in 2026

[7] HubSpot Academy - Sales Customer Success Handoff
