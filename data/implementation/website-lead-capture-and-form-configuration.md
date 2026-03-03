# Website Lead Capture and Form Configuration — Implementation

## Project One-Pager

### Project Type
- **Category:** Technical
- **Primary Deliverable:** Fully operational lead capture system with optimized forms, MAP/CRM integration, UTM attribution tracking, automated follow-up workflows, and performance dashboard

### Phase Relevance

| Phase          | Applies? | Weight | Notes                                                   |
| -------------- | -------- | ------ | ------------------------------------------------------- |
| 1. Strategy    | Yes      | Light  | 1-2 refinement loops; mostly requirements gathering     |
| 2. Engineering | Yes      | Heavy  | Core build: forms, hidden fields, field mapping, workflows |
| 3. Enablement  | Yes      | Medium | Training on form management and troubleshooting          |
| 4. Handoff     | Yes      | Medium | Documentation package + maintenance schedule             |

### Phase Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. STRATEGY  │────▶│ 2. ENGINEER  │────▶│3. ENABLEMENT │────▶│  4. HANDOFF  │
│    Light     │     │    Heavy     │     │    Medium    │     │    Medium    │
│ 1a→1b→1c→1d │     │ 2a→2b→2c→2d │     │ 3a→3b→3c→3d │     │ 4a→4b→4c→4d │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
  1-2 loops            Forms + fields        Admin training        Doc package +
  audit +             MAP-CRM mapping       form management       maintenance schedule
  requirements
```

**This project's flow:**
- Full 4-phase. Light strategy (audit + requirements), heavy engineering (form build, field mapping, workflow automation), medium enablement (admin training), standard handoff.
- Phase 1 compresses to 2-3 meetings since requirements are relatively straightforward (field lists, routing rules, UTM taxonomy).
- Phase 2 is the core of the work: form configuration, hidden field setup, MAP-to-CRM mapping, automation workflows.

---

## Pre-Kickoff (1a)

### Track A: Customer Homework

- [ ] Provide MAP admin access (HubSpot, Marketo, or equivalent)
- [ ] Provide CRM admin access (Salesforce, HubSpot CRM)
- [ ] Provide CMS/website admin access for form embedding
- [ ] Complete intake form: existing form inventory, lead routing rules, UTM naming conventions
- [ ] Confirm stakeholders for kickoff (Marketing Ops, Demand Gen lead, Sales leader)

### Track B: Architect Prep

- [ ] Pull current form list from MAP form library
- [ ] Submit test leads through top 5 forms and document data flow
- [ ] Audit current UTM parameter passing and hidden field configuration
- [ ] Document baseline form submission volumes and conversion rates (90-day lookback)
- [ ] Create v0 form inventory spreadsheet and data flow diagram

---

## Refinement Loop (1b → 1c → 1d)

| Meeting      | Sub-Phase | Focus                                          | Stakeholder                    | Output                                |
| ------------ | --------- | ---------------------------------------------- | ------------------------------ | ------------------------------------- |
| Kickoff      | 1b        | Present audit findings, validate requirements   | Marketing Ops, Demand Gen, Sales | Confirmed field requirements + routing rules |
| Refinement 1 | 1c        | Review form field specs, UTM taxonomy, workflow design | Marketing Ops, Demand Gen       | Approved form specs + workflow logic   |
| Sign-Off     | 1d        | Final approval on build plan                    | All stakeholders               | Signed-off strategic package           |

---

## Phase Checklists

### Phase 1: Strategy

- [ ] 1a. Pre-Kickoff complete (Track A + Track B)
- [ ] 1b. Kickoff call held
- [ ] 1c. Refinement loop complete (form specs + workflow design approved)
- [ ] 1d. Strategic sign-off obtained

### Phase 2: Engineering

- [ ] 2a. Tech spec created (form field specs, hidden field config, MAP-to-CRM mapping, workflow logic)
- [ ] 2b. Engineering handoff meeting held
- [ ] 2c. Build complete (forms, hidden fields, field mappings, routing, notifications, nurture workflows)
- [ ] 2d. QA/Test + customer sign-off

### Phase 3: Enablement

- [ ] 3a. Training materials prepped
- [ ] 3b. Training sessions delivered (Marketing Ops + Demand Gen)
- [ ] 3c. Hypercare period complete (2 weeks)
- [ ] 3d. Enablement sign-off

### Phase 4: Handoff

- [ ] 4a. Maintenance schedule documented and handed off
- [ ] 4b. Internal handoff complete
- [ ] 4c. External handoff (to Customer) complete
- [ ] 4d. Project closed and archived

---

## Document Types

### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|---------------|
| Form inventory spreadsheet | Catalog all forms, locations, field configs, CVRs | All forms documented with baseline metrics |
| Data flow diagram | Map submission path from form to CRM | All gap points identified and documented |
| Field requirements document | Define fields per form type by funnel stage | Sales + Marketing sign-off obtained |
| UTM taxonomy document | Standardize UTM naming conventions | All campaigns mapped to naming convention |
| Workflow logic document | Define routing rules, notifications, nurture flows | All automation logic approved |

### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| Form configuration guide | Field requirements doc | Reference for future form changes |
| Field mapping reference | Data flow diagram | Troubleshooting sync issues |
| Automation workflow documentation | Workflow logic document | Understanding and maintaining workflows |
| Form performance dashboard | Baseline metrics + build | Ongoing form performance monitoring |

---

## Enablement Details

### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Technical | Marketing Ops, RevOps Admin | Form editing, field updates, field mapping changes | 45 min |
| Operational | Demand Gen, Marketing Manager | Dashboard interpretation, form performance review | 30 min |

### Hypercare

- **Applies:** Yes
- **Duration:** 2 weeks
- **Office Hours:** Yes, weekly 30-min slot

### Training Assets to Create

- [ ] Video walkthrough: Form editing and field management
- [ ] Video walkthrough: UTM hidden field troubleshooting
- [ ] Doc: Field mapping reference (MAP field to CRM field)
- [ ] Doc: Workflow logic and automation rules
- [ ] Doc: Form performance dashboard interpretation guide

---

## Handoff & Retention

### Internal Handoff

- **Key context:** Form field specs, UTM taxonomy, routing rules, notification escalation logic
- **Escalation trigger:** Any changes to field mapping structure, routing rule modifications, or new form types

### External Handoff (to Customer)

- **Final meeting agenda:** Review all forms, walk through dashboard, confirm documentation, demonstrate troubleshooting workflow
- **Documentation package:** Form config guide, field mapping reference, workflow documentation, training video walkthroughs, FAQ

### Maintenance Schedule

- **Monthly:** Check form conversion rates, verify UTM data integrity, review for unknown-source leads
- **Quarterly:** Full form audit, field mapping validation, workflow performance review
- **Who owns:** Single project = customer owns | Dedicated = Architect owns

### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services (ongoing form optimization, A/B testing) -- if no -- Downsell: Lead Scoring or Inbound Lead Journey Mapping project -- Retry retainer

**If Multi-Project (Dedicated):**
- Refinement check-in scheduled at 30 days post-launch
- Internal prep trigger: 2 weeks before
- Decision: Architect handles if minor optimization / SME needed for structural changes

---

## Key Assets

| Asset | When Used |
|-------|-----------|
| Form inventory template | Phase 1: Strategy |
| Field mapping reference | Phase 2-4 |
| Form performance dashboard | Phase 2-4 |
| Training video walkthroughs | Phase 3-4 |

---

## Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| Lead Capture | The process of collecting prospect information through website forms and storing it in MAP/CRM |
| Form Conversion Rate | Percentage of page visitors who submit a form (submissions / unique page views) |
| UTM Parameters | Urchin Tracking Module tags appended to URLs to track traffic source, medium, campaign, content, term |
| Hidden Fields | Form fields invisible to the user that auto-populate with tracking data (UTMs, page URL, referrer) |
| Progressive Profiling | Showing different form fields to returning visitors to gather incremental data over multiple visits |
| Speed-to-Lead | Time elapsed between form submission and first Sales response (target: under 5 minutes for demo requests) |
| MAP (Marketing Automation Platform) | System used to manage forms, email automation, and lead nurture (HubSpot, Marketo, Pardot) |
| Lead Routing | Rules that determine which Sales rep receives a new lead based on geography, company size, or round-robin |

---

## Common Gotchas

- Asking for too many form fields kills conversion rates. "Each additional field beyond 5 imposes a 20-30% conversion penalty." Use 2-3 fields for TOFU, 4-5 for MOFU, and 5-7 for BOFU maximum.
- Hidden field JavaScript fails on specific browsers or when ad blockers interfere. Test UTM capture across Chrome, Safari, Firefox, and with common ad blockers enabled.
- MAP-to-CRM field type mismatches (e.g., text field mapped to picklist) cause silent sync failures. Verify data types match before going live.
- Round-robin assignment breaks when reps are added or removed. Document the assignment pool and create a process for updating it.
- UTM values get stripped when links redirect through URL shorteners or third-party tracking pixels. Test the full click path from ad platform through to CRM record.
- Form submissions from bots inflate metrics and pollute the database. Implement CAPTCHA or honeypot fields on high-traffic forms.

---

## Methodology Options

| Option | When to Use | Complexity |
|--------|-------------|-----------|
| Native MAP Forms | HubSpot or Marketo is the CMS, simple form needs | Low |
| Embedded MAP Forms | Third-party CMS (WordPress, Webflow), standard fields | Medium |
| Custom HTML + API | Custom CMS, advanced conditional logic, multi-step forms | High |

> See Methodology for detailed form architecture decision frameworks and field strategy by funnel stage.

---

## Phase 1: Strategy

> **Goal:** Get stakeholder sign-off on form field requirements, UTM taxonomy, lead routing rules, and automation workflow design.
>
> **Output:** Approved form specifications document + workflow logic design + UTM naming convention.

### 1a. Pre-Kickoff

> Two parallel tracks run before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Intro video walkthrough | Explain what this project covers and why it matters | Video (5-8 min) |
| Definition Alignment Document | Get sign-off on key terms (lead capture, CVR, UTM, etc.) | Google Doc |
| Pre-filled intake form | Confirm form inventory, routing rules, UTM conventions | Google Form or Doc |

The intro video covers: what a well-configured lead capture system looks like, why UTM attribution matters ("inconsistent UTM parameters cause up to 35% data loss in campaign attribution"), and what the customer can expect from this engagement.

**Completion tracking:** Marketing Ops owner follows up. Do not cancel kickoff if incomplete, but push hard on MAP/CRM access -- the audit cannot proceed without it.

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Export form list from MAP library | Raw form inventory with field configurations |
| 2 | Submit test leads through each major form type | Data flow map with gap points identified |
| 3 | Audit UTM parameter passing from URL through form to CRM | UTM gap analysis (captured vs. lost) |
| 4 | Pull 90-day submission volumes and conversion rates per form | Baseline performance metrics |
| 5 | Create v0: form inventory + data flow diagram + gap analysis | Kickoff presentation materials |

**Critical:** Mark everything as ASSUMED. The kickoff call validates. Flag any forms with conversion rates below 2% for priority attention -- "the average B2B form conversion rate sits at 2.9%, and top performers exceed 5%."

#### Stakeholder Alignment Document

> Get stakeholder sign-off on terms BEFORE building anything.

| Term | Our Definition | Internally Approved? |
|------|----------------|----------------------|
| Form Conversion Rate | Submissions / unique page views, measured per form | [ ] Yes / [ ] No |
| Lead (from form) | Any individual who submits a website form with valid email | [ ] Yes / [ ] No |
| MQL | Lead that meets defined scoring/qualification criteria after form submission | [ ] Yes / [ ] No |
| Speed-to-Lead SLA | Maximum time between form submission and first Sales contact attempt | [ ] Yes / [ ] No |
| Lead Source | First-touch UTM source that drove the form submission | [ ] Yes / [ ] No |
| Progressive Profiling | Strategy for asking different fields on return visits | [ ] Yes / [ ] No |

**Instructions to customer:**

> Review each definition with your Marketing and Sales leadership. Check "Yes" when approved. We cannot proceed with form configuration until field requirements and definitions are aligned.

---

### 1b. Kickoff Call

> **Purpose:** Present the form audit (v0) and get alignment on field requirements, routing rules, and UTM taxonomy.

#### Agenda (60 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Present form audit | Walk through current forms, CVRs, data flow gaps |
| 15-25 | Validate field requirements | Confirm what data Sales needs, what Marketing needs to track |
| 25-35 | UTM taxonomy review | Agree on naming conventions for source, medium, campaign |
| 35-45 | Lead routing and SLAs | Confirm assignment rules and response time expectations |
| 45-55 | Workflow design | High-level review of notification and nurture plans |
| 55-60 | Next steps | Assign homework, schedule refinement meeting |

#### What We Bring

- v0 form inventory with baseline performance metrics
- Data flow diagram showing current submission-to-CRM path
- UTM gap analysis (what attribution data is captured vs. lost)
- Proposed field strategy by funnel stage (TOFU/MOFU/BOFU)
- Definition Alignment Document (pre-filled with recommendations)

#### What We Leave With

- Confirmed field requirements for each form type (signed off by Sales + Marketing)
- Approved UTM naming convention
- Lead routing rules and assignment logic
- Speed-to-lead SLA targets (target: under 5 minutes for demo/pricing requests)
- Clear homework assignments

---

### 1c. Alignment Loop & Strategic Meeting Cadence

> **Purpose:** Finalize form specifications, workflow logic, and build plan.

#### The Pattern

```
Kickoff Call (present audit, gather requirements)
    |
Architect refines form specs + workflow design --> v1
    |
Refinement Meeting (review v1, finalize) --> v2 (final)
    |
Sign-Off (approve build plan)
```

This project typically requires only 1 refinement meeting because the requirements are concrete (field lists, routing rules, UTM taxonomy) rather than conceptual.

#### Before Refinement Meeting

1. Update form field specifications based on kickoff feedback
2. Design workflow logic (routing rules, notification triggers, nurture sequences)
3. Document progressive profiling plan for repeat visitors
4. Prepare mobile optimization checklist

#### During Refinement Meeting

1. Walk through updated form specs by funnel stage
2. Review automation workflow design
3. Confirm progressive profiling approach
4. Validate mobile form UX requirements -- "B2B SaaS websites receive roughly 35% mobile traffic," so mobile optimization directly impacts lead volume

#### After Refinement Meeting

1. Finalize form field specifications
2. Complete workflow logic documentation
3. Prepare tech spec for engineering phase

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 1-2 days |
| Kickoff call | Day 1 of engagement |
| Refinement meeting | Day 3-5 |
| Sign-off | Day 5-7 |

---

### 1d. Strategic Sign-Off

> **Purpose:** Confirm all requirements are locked before building.

#### Validation Checkpoint

- [ ] Definition Alignment Document signed off by stakeholders
- [ ] Form field specifications approved by Sales and Marketing
- [ ] UTM taxonomy finalized and documented
- [ ] Lead routing rules confirmed with clear ownership
- [ ] Speed-to-lead SLAs agreed (target: demo requests under 5 minutes)
- [ ] Notification and nurture workflow logic approved
- [ ] Progressive profiling strategy confirmed
- [ ] Mobile optimization requirements documented
- [ ] No blockers for engineering

#### Decision Point

- **Proceed to Engineering** -- all specifications approved, build can begin
- This project does NOT have a natural exit point after Phase 1. The value is in the technical build and live system.

---

## Phase 2: Engineering

> **Goal:** Build and test the complete lead capture system: forms, hidden fields, MAP-to-CRM mappings, routing rules, notifications, nurture workflows, and performance dashboard.
>
> **Output:** Fully functional lead capture system with all forms live, data flowing to CRM, and automation workflows active.

**Project Type:** This project -- Engineering Weight: Heavy (60-70%) -- Context: Core value is the technical build: forms, integrations, automations

### Sub-Phases

```
2a Tech Spec --> 2b Engineering Handoff --> 2c Build --> 2d Test
```

---

### 2a. Tech Spec

> **Purpose:** Translate approved form specifications and workflow logic into technical build instructions.

**Input:** Signed-off form field specs, UTM taxonomy, routing rules, workflow logic from Phase 1.

**What happens:**

1. Map each form's fields to MAP form builder configuration
2. Define hidden field JavaScript or native MAP functionality for UTM capture
3. Map every form field to the correct CRM lead/contact field with matching data types
4. Document workflow triggers, conditions, and actions for routing, notifications, and nurture

**Output:** Tech spec containing:

- Form build specifications (fields, validation rules, button text, mobile layout)
- Hidden field configuration (UTM parameters, page URL, referrer)
- MAP-to-CRM field mapping table (MAP field name, CRM field name, data type, default value)
- Lead routing logic (assignment rules, round-robin config, fallback assignment)
- Notification configuration (triggers, channels, data included)
- Nurture workflow logic (timing, content, exit conditions)
- Build sequence and dependencies

---

### 2b. Engineering Handoff

> **Purpose:** Review tech specs before building.

**Who attends:** Architect + Engineer (or Marketing Ops if client self-builds)

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through form specs | Review field configs, hidden fields, mobile requirements |
| 15-25 | Review field mappings | Confirm data types match, picklist values aligned |
| 25-35 | Review workflow logic | Routing rules, notification triggers, nurture sequences |
| 35-45 | Build sequence + risks | Confirm order of operations, flag potential sync issues |

**What Architect brings:**

- Complete tech spec from 2a
- Strategic package (form requirements, UTM taxonomy) for context
- Known risks (e.g., CRM field type conflicts, existing workflow conflicts)

**What engineer leaves with:**

- Approved tech spec
- Clear build sequence: forms first, then hidden fields, then field mappings, then workflows
- Known dependencies (e.g., CRM admin must create custom fields before mapping)

---

### 2c. Build (Configure)

> **Purpose:** Build the complete lead capture system in MAP and CRM.

**Input:** Approved tech spec from 2b.

**Build sequence (order matters):**

#### Component 1: Form Configuration

1. Build TOFU forms (lead magnet downloads): 2-3 fields max (name, email), targeting 15-25% CVR
2. Build MOFU forms (demo requests): 4-5 fields (name, email, company, role), targeting 8-12% CVR. Consider multi-step layout to boost start rates.
3. Build BOFU forms (pricing/trial): 5-7 fields (add phone, company size, use case), targeting 5-8% CVR
4. Configure field validation and clear error messaging for each form
5. Optimize button text (action-oriented: "Get My Demo" not "Submit")
6. Verify mobile responsiveness (large touch targets, single-column layout, minimal scrolling)
7. Add social proof where appropriate (G2 rating badge, customer logos)
8. Configure progressive profiling rules for repeat visitors -- "companies using progressive profiling achieve 42% higher lead-to-customer conversion"

#### Component 2: Hidden Fields for Attribution

1. Add hidden fields to every form: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
2. Add hidden field for `page_url` (the page where form was submitted)
3. Add hidden field for `referrer_url`
4. Configure JavaScript (or native MAP functionality) to auto-populate hidden fields from URL parameters
5. Test hidden field population across traffic sources: direct, organic, paid search, paid social, email, referral
6. Test with ad blockers enabled to verify fallback behavior

#### Component 3: MAP-to-CRM Field Mapping

1. Map each form field to corresponding CRM lead/contact field
2. Verify data types match (text to text, picklist to picklist, date to date)
3. Configure picklist value mappings where MAP and CRM values differ
4. Set up default values for optional fields that may be empty
5. Test end-to-end sync with sample submissions and verify data arrives correctly

#### Component 4: Lead Routing and Assignment

1. Build lead assignment rules based on approved criteria (geography, company size, industry, product interest)
2. Configure round-robin assignment for demo requests to distribute leads evenly
3. Set up fallback assignment rule for leads matching no other criteria
4. Test assignment logic with sample leads from different segments
5. Document the assignment pool and update process

#### Component 5: Submission Notifications

1. Configure email notifications to lead owners on demo/pricing form submissions
2. Set up messaging platform notifications to the sales team channel (include: lead name, company, form type, UTM source)
3. Test notification delivery timing -- target: under 1 minute from submission
4. Configure escalation notification if lead is not contacted within SLA (e.g., 5-minute or 15-minute threshold)

#### Component 6: Automated Follow-Up Workflows

1. Build thank-you/confirmation email per form type (include relevant next steps: download link, meeting booking link)
2. Configure Day 0 confirmation with appropriate CTA
3. Build nurture sequence: Day 2 (case study/social proof), Day 5 (demo invite if not yet converted)
4. Personalize emails with form data (company name, use case if captured)
5. Set up exit conditions: remove from nurture if they convert, book a meeting, or reply

**Build tracking:**

- [ ] Component 1: Form configuration (TOFU, MOFU, BOFU)
- [ ] Component 2: Hidden fields for attribution
- [ ] Component 3: MAP-to-CRM field mapping
- [ ] Component 4: Lead routing and assignment
- [ ] Component 5: Submission notifications
- [ ] Component 6: Automated follow-up workflows

---

### 2d. QA / Test + Sign-Off

> **Purpose:** Verify the entire lead capture system works end-to-end.

**Two types of testing:**

| Type | Who | Purpose |
|------|-----|---------|
| Technical Testing | Our team | Verify forms work, data flows, workflows fire correctly |
| Customer Testing | Customer | Verify it meets their requirements and data looks right |

**Technical testing checklist:**

**Cross-Device QA:**
- [ ] Test each form on desktop (Chrome, Firefox, Safari)
- [ ] Test each form on mobile (iOS Safari, Android Chrome)
- [ ] Verify field validation displays correctly on all devices
- [ ] Confirm mobile UX: buttons tappable, fields easy to complete, no horizontal scroll
- [ ] Test with ad blockers enabled

**End-to-End Submission Testing:**
- [ ] Submit test leads with UTM parameters through each form type
- [ ] Verify lead appears in MAP with all field data captured correctly
- [ ] Confirm hidden fields populated (UTMs, page URL, referrer)
- [ ] Verify lead syncs to CRM with correct field mapping
- [ ] Confirm lead assignment fires to correct owner
- [ ] Test notification delivery within 1-minute target
- [ ] Verify confirmation email triggers immediately
- [ ] Confirm nurture workflow enrollment works as expected
- [ ] Test progressive profiling (submit same email twice, verify different fields appear)
- [ ] Test fallback assignment for leads that match no routing rule

**Customer testing:**
- [ ] Walk customer through each form type with live submissions
- [ ] Have them verify CRM records look correct
- [ ] Confirm notification format and content meets expectations
- [ ] Review dashboard metrics for accuracy

**Engineering sign-off checkpoint:**

- [ ] All forms are live and functional across devices
- [ ] Hidden fields capturing UTM data from all traffic sources
- [ ] MAP-to-CRM sync working with correct field mapping
- [ ] Lead routing and assignment firing correctly
- [ ] Notifications delivering within 1-minute SLA
- [ ] Automated emails triggering as designed
- [ ] Customer has tested and approved
- [ ] Ready for enablement

**Decision point:**

- **Proceed to Enablement** -- system is built and verified, team needs training
- **Loop back to Build** -- issues found, needs fixes

---

## Phase 3: Enablement

> **Goal:** Marketing Ops team can independently manage forms, update fields, troubleshoot sync issues, and interpret the performance dashboard.
>
> **Output:** Trained team with documentation, stabilized system, no critical issues.

### Sub-Phases

```
3a Training Prep --> 3b Training Sessions --> 3c Hypercare --> 3d Enablement Sign-Off
```

---

### 3a. Training Prep

> **Purpose:** Create training materials from form configurations and workflow documentation.

**Input:** All project documentation + built system

**Output:** Training package containing:

- Video walkthrough scripts: form editing walkthrough, UTM troubleshooting, dashboard navigation
- Written guides: field mapping reference, workflow logic, form performance interpretation
- FAQ draft covering common questions (see Phase 4 troubleshooting for source material)

---

### 3b. Training Sessions

> **Purpose:** Transfer knowledge to Marketing Ops team.

**Training sessions by audience:**

| Audience | Focus | Duration |
|----------|-------|----------|
| Marketing Ops / Admin | How to edit forms, add/remove fields, update field mappings, pause workflows | 45 min |
| Demand Gen / Marketing | Dashboard interpretation, form performance analysis, when to request changes | 30 min |

**Marketing Ops training covers:**

1. How to edit existing forms in MAP (add/remove fields, change validation, update button text)
2. How hidden fields work and how to verify UTM data is capturing
3. How to update MAP-to-CRM field mappings when new fields are added
4. How to modify routing rules (add/remove reps from round-robin)
5. How to pause or update nurture sequences
6. Common troubleshooting: what to check when data is not syncing

**Training delivery:**

1. Deliver live session (record for future reference)
2. Record standalone video walkthroughs for key procedures
3. Answer questions, note any gaps
4. Provide documentation package

**Output:**

- [ ] Trained stakeholders
- [ ] Video walkthrough recordings
- [ ] Questions log (feeds into FAQ)

---

### 3c. Hypercare

> **Purpose:** Intensive post-launch support to catch and fix issues during the first live period.

**Duration:** 2 weeks

**What happens:**

- Monitor form submissions daily for first week (verify data flowing correctly)
- Check for "unknown source" leads in CRM (indicates UTM tracking gaps)
- Respond to questions or issues within 4 hours
- Office hours: weekly 30-min slot for Q&A
- Fix any sync failures, missing data, or workflow misfires

**Key monitoring during hypercare:**

- Form conversion rates vs. baseline (should improve or hold steady)
- UTM capture rate (target: <10% unknown-source leads; most organizations see 15-30% before optimization)
- Notification delivery timing (target: under 1 minute)
- Lead assignment accuracy
- Nurture email open and click rates

**Output:** Stabilized system, no critical issues outstanding

---

### 3d. Enablement Sign-Off

> **Purpose:** Confirm the Marketing Ops team can operate independently.

**Validation checkpoint:**

- [ ] All training sessions delivered
- [ ] Training recordings and documentation provided
- [ ] Hypercare period complete
- [ ] No critical issues outstanding
- [ ] Marketing Ops can add/edit forms without support
- [ ] Marketing Ops can troubleshoot common sync issues independently
- [ ] Ready for handoff

**Decision point:**

- **Proceed to Handoff** -- customer is enabled
- **Extend Hypercare** -- still encountering issues, needs more support time

---

## Phase 4: Handoff

> **Goal:** Clean project close with maintenance plan established and retention/expansion path set.
>
> **Output:** Maintenance schedule documented, internal context transferred, customer owns the system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule --> 4b Internal Handoff --> 4c External Handoff --> 4d Project Close
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|----------------------|---------------|
| Single Project | Customer owns | 4c (External Handoff) |
| Dedicated (Multi-Project) | Architect owns | 4b (Internal Handoff) |

---

### 4a. Maintenance Schedule

> **Purpose:** Document what needs ongoing attention to keep the lead capture system accurate and performant.

#### Standard Maintenance Framework

**Monthly Tasks:**

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|-------------------|
| Form CVR monitoring | Submission rate per form vs. baseline | >20% drop from baseline for any form |
| UTM data integrity | Percentage of leads with "unknown" or "direct" source in CRM | >10% unknown-source leads in a month |
| Assignment accuracy | Spot-check 10 leads for correct routing | >5% misrouted leads |
| Notification timing | Check speed-to-lead metrics | Average response time exceeding SLA |
| Workflow health | Verify nurture enrollment and email delivery rates | Email delivery rate drops below 95% |

**Quarterly Tasks:**

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|---|---|
| Full form audit | All forms still active, no broken embeds, fields still relevant | Remove deprecated forms, update field specs |
| Field mapping validation | Submit test leads, verify all fields sync correctly to CRM | Fix any mapping drift or data type mismatches |
| Progressive profiling review | Are repeat visitors getting different fields? Is it working? | Adjust profiling queue if fields are stale |
| Conversion rate benchmarking | Compare CVRs to industry benchmarks (B2B average: 2.9%) | Optimize underperforming forms |

**After First Business Cycle (30-60 days post-launch):**

- Form performance review: Are CVRs meeting targets by funnel stage? (TOFU 15-25%, MOFU 8-12%, BOFU 5-8%)
- Attribution clarity: Has the percentage of "unknown source" leads decreased?
- Speed-to-lead: Are demo requests getting contacted within 5-minute SLA?
- Key question: Is the lead capture system producing more MQLs from website sources than before?

**Refinement Triggers (when to re-engage):**

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Form CVR drop | >30% decline from baseline for 2+ weeks | Re-engage for form optimization |
| Unknown-source leads spike | >20% unknown in any month | Audit UTM setup, check for broken JavaScript |
| New form type needed | Customer launches new product/campaign | Scope new form build as add-on or new project |
| MAP or CRM platform change | Customer migrates tools | Full re-implementation required |

**Every 6-12 Months:**

- Full system audit: Re-run the same audit performed in Phase 1 (form inventory, data flow, UTM integrity)
- Field relevance review: Are we still asking the right questions? Has Sales' data needs changed?
- Automation performance: Are nurture sequences still relevant? Update content and timing.

---

### 4b. Internal Handoff

> **Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- What was built: form types (TOFU/MOFU/BOFU), routing logic, notification setup, nurture workflows
- Customer context: who the Marketing Ops owner is, Sales leader preferences, any custom routing quirks
- Common issues: sync delays, UTM capture failures on specific browsers, round-robin pool updates
- When to escalate back to SME: field mapping structure changes, new form type requests, workflow logic modifications
- **Maintenance schedule** (if Dedicated engagement -- Architect runs this)

**Escalation guidelines:**

| Issue Type | Who Handles | Examples |
|-----------|-------------|----------|
| Small tweaks, minor questions | Architect | Update button text, add rep to round-robin, pause nurture |
| Significant changes, complex issues | SME | New form type, field mapping restructure, UTM script fix |

**For Dedicated engagements:** Architect receives the maintenance schedule (4a) and becomes responsible for executing monthly and quarterly checks. SME walks Architect through each task.

---

### 4c. External Handoff (to Customer)

> **Purpose:** Formal project completion with customer.

**Final project meeting:**

- Review all forms built and their locations
- Walk through the performance dashboard
- Demonstrate how to edit forms and update fields
- Confirm notification and workflow logic
- Hand over documentation package
- Make it explicit: "Project complete"
- **For Single Project engagements:** Hand over the maintenance schedule and walk through monthly/quarterly tasks

**Documentation package:**

- Form configuration guide (all forms, fields, locations)
- Field mapping reference (MAP to CRM)
- UTM taxonomy document
- Workflow logic documentation (routing, notifications, nurture)
- Training video walkthrough recordings
- FAQ document
- Form performance dashboard access
- **Maintenance Schedule** (for Single Project engagements)

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video walkthrough of the session. Make sure they understand: what to check monthly, how to run quarterly validations, and when to re-engage.

**Output:** Customer owns the system. Project formally complete.

---

### 4d. Project Close

> **Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- [ ] All project artifacts saved to proper location
- [ ] Handoff documentation complete
- [ ] Project status updated in tracking system
- [ ] Time/billing finalized

#### Internal Debrief (Optional but Recommended)

- What went well? (e.g., UTM setup was clean, customer had good intake data)
- What would we do differently? (e.g., should have tested ad blockers earlier, needed more CRM admin access)
- Any learnings to feed back into SOPs?

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| Single Project | Upsell -- Downsell -- Retry |
| Multi-Project (Dedicated) | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (ongoing form optimization, A/B testing, conversion rate improvement)
   | if no
2. Downsell: Related project (Lead Scoring, Inbound Lead Journey Mapping, Marketing Automation Platform tuning)
   | if yes
3. Retry retainer at end of next project cycle
```

**Script:**

> "Now that your lead capture system is live, there are two ways we can continue working together. Option 1: We handle ongoing optimization -- A/B testing form layouts, monitoring conversion rates, keeping your UTM tracking clean. Option 2: If there is a specific next project like lead scoring or inbound journey mapping, we can scope that out. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

> "On [date ~30 days out], we will review form performance and see if any adjustments are needed."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull form CVRs, UTM capture rates, speed-to-lead data |
| 3. Decide ownership | Can Architect handle this check-in, or need SME? |
| 4. Prep materials | If SME needed, brief them. If Architect, prep talking points. |

**At the refinement check-in:**

- Review form conversion rates against targets
- Assess attribution clarity (unknown-source percentage)
- Identify any forms needing optimization
- If minor: Architect handles tweaks
- If major: Scope new project (e.g., form redesign, new form types, A/B testing program)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Form inventory with baseline metrics
- Field requirements document (approved by Sales + Marketing)
- UTM taxonomy and naming conventions document
- Workflow logic design (routing, notifications, nurture)

**Technical Deliverables:**

- Configured forms in MAP (TOFU, MOFU, BOFU) with progressive profiling
- Hidden field setup for UTM attribution tracking
- MAP-to-CRM field mappings
- Lead routing and assignment rules
- Submission notification workflows
- Automated follow-up email sequences
- Form performance dashboard

**Documentation Package:**

- Training video walkthrough recordings (form editing, UTM troubleshooting, dashboard navigation)
- Written guides (form configuration, field mapping reference, workflow logic)
- FAQ document
- Definition Alignment Document (final version)
- Maintenance Schedule

---

## Troubleshooting Guide

> Common issues encountered during and after Website Lead Capture and Form Configuration projects. Use this as a reference during hypercare and for ongoing maintenance.

| Scenario | Symptoms | Resolution |
|----------|----------|-----------|
| UTM parameters not passing to form | Hidden fields empty on form submission; leads show "unknown" source in CRM | Check JavaScript is loading on the page. Verify URL parameter names match hidden field names exactly. Test with browser console open to see errors. |
| Form not syncing to CRM | Leads appear in MAP but not in CRM; sync errors in MAP log | Check MAP-to-CRM connector status. Verify field data types match. Check for required CRM fields that are empty on the form. |
| Lead assigned to wrong rep | Lead owner in CRM does not match routing rules | Review assignment rule order (first match wins). Check if the lead matched an unexpected rule. Verify round-robin pool is current. |
| Notifications not firing | Sales not receiving alerts on form submission | Check workflow enrollment criteria. Verify notification email/channel is active. Check MAP workflow is turned on. |
| Form conversion rate dropped sharply | Submissions per week declined >30% | Check if form is still embedded correctly on the page. Verify no broken validation or error messages. Check for page changes that may have moved or hidden the form. Check mobile rendering. |
| Progressive profiling not working | Returning visitors see the same fields | Verify cookie/tracking is active. Check MAP progressive field configuration. Confirm the contact record exists with previously captured data. |
| Nurture emails not sending | Leads submit form but do not receive confirmation email | Check workflow status (active vs. paused). Verify enrollment triggers match form names. Check email send limits and suppression lists. |
| Duplicate leads in CRM | Same person appears multiple times after form submissions | Check MAP deduplication rules. Verify email is used as the unique identifier. Review CRM matching rules. |
| Mobile form renders poorly | Users report difficulty completing form on phone | Test on actual devices (not just browser resize). Check for horizontal scroll, tiny buttons, overlapping elements. Reduce fields on mobile if possible. |
| Bot submissions inflating metrics | Spike in form submissions with fake data | Enable CAPTCHA or reCAPTCHA on high-traffic forms. Add honeypot field. Review submission IP patterns and block known bots. |

---

## Appendix

### Roles

| Role | What They Do |
|------|--------------|
| Architect | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| Engineer | CRM build, automation, dashboards (Phase 2) |
| SME | Project/implementation team brought in for project-specific work |

---

## References

[1] Factors Labs - What's The Right Number of Demo Form Fields?

[2] CampaignTrackly - 10 Campaign Tracking Issues That Quietly Break Attribution

[3] Chili Piper - 2025 Benchmark Report on Demo Form Conversion Rates

[4] Kixie - The Impact of Speed to Lead: Response Time Statistics

[5] DesignRush - 40+ Mobile Traffic Statistics 2025

[6] Genesys Growth - Landing Page Conversion Rates: 40 Statistics

[7] Vende Digital - Top 10 B2B Marketing Attribution Data Leaks

[8] Workato - We Tested 114 B2B Companies' Lead Response Times

[9] LeadAngel - What Is Speed to Lead? Statistics, Strategies, and Software

[10] FormStory - Online Form Statistics: Abandonments & Conversion Stats
