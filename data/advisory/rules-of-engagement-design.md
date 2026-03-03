# Rules of Engagement Design — Advisory

## 1) Project Overview

### Project Name
Rules of Engagement Design - Sales Ownership & Dispute Resolution Policy

### Purpose
This initiative creates comprehensive policies defining how sales representatives interact with leads, accounts, and opportunities. It produces documented ownership rules for all deal scenarios, a dispute resolution process with escalation paths and SLAs, and CRM enforcement configurations.

**Core Transformation:** Moves organizations from ad hoc ownership decisions causing conflict and slow deal progression to a codified, CRM-enforced system where representatives understand exactly who owns what deal type.

### What This Project Unlocks
After completion, sales organizations can:
- Assign ownership for any deal scenario without manager intervention
- Resolve disputes within 24-48 hours through documented escalation paths
- Enforce ownership rules automatically through CRM validation
- Onboard new reps with clear, written guidelines
- Track and report on dispute frequency, resolution time, and fairness metrics

### Business Outcomes

**Primary:**
- Reduced ownership disputes escalated to management (target: 50% reduction within 30 days)
- Faster deal progression without ownership debate delays
- Improved rep morale and reduced voluntary turnover from perceived unfairness

**Secondary:**
- Foundation for territory redesign projects
- Improved forecasting accuracy through cleaner pipeline data
- Better customer experience via single-thread communication
- Data for future compensation plan design

### Beneficiaries
VP of Sales, CRO, Sales Managers, Account Executives, SDRs/BDRs, Account Managers, Customer Success Managers, RevOps/Sales Ops Manager, Channel/Partner Manager

### Pain Points Addressed

| Challenge | Solution |
|-----------|----------|
| Managers spend 5+ hours weekly arbitrating disputes | Documented if/then rules resolve most scenarios; disputes have defined SLAs |
| Multiple reps reach out to same prospect | CRM enforcement flags duplicates and assigns single ownership |
| New reps rely on asking around | Published ROE document with concrete examples |
| Reps perceive unfairness, causing turnover | Transparent written rules with leadership sign-off build trust |
| Partner deals lack clear credit attribution | Deal registration windows and sourced-vs-influenced rules defined upfront |
| Territory changes blocked by unclear ownership | ROE provides policy foundation territory design depends upon |

### Supporting Data

The cost of unclear rules is measurable:

- **Rep productivity loss:** Sales representatives spend only 28% of time selling, with administrative overhead consuming majority of time
- **Territory conflict frequency:** 58% of B2B companies rate territory design efforts as ineffective, with territory overlap driving ownership disputes
- **Turnover risk:** Average B2B sales rep annual turnover is 13.9%, with unbalanced territories and unclear ownership contributing factors
- **Productivity upside:** Well-structured ownership models show up to 25% improvement in salesperson productivity

### Key Framework
The "Traffic Laws" metaphor: Rules of engagement function like traffic laws for sales organizations. Without them, every overlapping account or boundary becomes negotiation. With them, everyone knows who has right-of-way, and disputes become exceptions.

### Target Motion
Sales-led growth organizations with multiple reps, segments, or channels benefit most. Critical for organizations with:
- Multiple sales roles touching same accounts (AE + CSM + AM)
- Concurrent inbound and outbound motions
- Named account or territory-based selling
- Channel/partner programs with co-sell or deal registration scenarios

**Not ideal for:** Solo-founder sales, pure product-led growth without sales teams, or organizations with fewer than 3 sales reps.

### Common Belief Barriers

**"We don't need this written down -- our team just knows the rules."**
Tribal knowledge fails when hiring new reps, promoting team members, or facing disputed deals. Unwritten rules are opinions, not policies. Most scaling teams experience 3-5 active ownership disputes preventable through written ROE.

**"This will slow our reps down with bureaucracy."**
Clear ROE eliminates hidden overhead. Representatives currently waste time in Slack threads, manager calls, and all-hands debates about ownership. Written ROE replaces ad hoc processes with 30-second lookups.

**"We tried this before and nobody followed the rules."**
Previous attempts typically failed due to vague rules, absent CRM enforcement, or insufficient team buy-in. This approach uses specific if/then language, CRM automation, and structured rollout with rep acknowledgment.

---

## 2) Tools & Systems

### Primary Tools

**Salesforce**
Primary CRM for enforcement. Handles ownership assignment automation, validation rules preventing unauthorized changes, workflow alerts for potential violations, and dispute tracking reports and dashboards. Territory Management 2.0 provides native framework for territory-based ownership rules.

**HubSpot**
Alternative CRM platform. Uses workflows for contact/company ownership automation, deal pipeline ownership rules, and round-robin assignment for inbound leads. Workflow engine handles ownership timeout automation and reassignment logic.

**LeanData**
Lead-to-account matching and routing platform. Matches inbound leads to existing accounts, ensuring correct owner receives leads automatically, preventing inbound leads from routing to wrong representative when accounts are already owned.

**Documentation Platforms**
Google Docs, Notion, or Confluence house the ROE policy document itself. Final deliverable must be accessible to all reps and version-controlled for tracking changes.

---

## 3) Stakeholders & Roles

### Client-Side Stakeholders

**VP of Sales (Executive Sponsor)**
- Discovery interviews, leadership review, final sign-off
- Approves final ROE document, serves as final arbiter for disputes, champions rollout

**CRO (Executive Sponsor, if applicable)**
- Initial scoping, cross-functional rules approval
- Ensures alignment with overall GTM strategy; resolves cross-departmental disputes

**Sales Managers**
- Discovery interviews, leadership review, rollout meeting
- Provides frontline perspective, validates proposed rules, enforces post-rollout

**RevOps / Sales Ops Manager (Technical Owner)**
- Involved throughout all phases
- Provides CRM access, supplies dispute data, owns ongoing maintenance and quarterly reviews

**Sales Reps**
- Discovery interviews (3-5 reps), rollout meeting, acknowledgment
- Shares frontline concerns, validates rules against real scenarios, acknowledges final ROE

### Technical Owners

**RevOps / Sales Ops Manager**
- Owns CRM enforcement configurations post-handoff
- Manages dispute tracking report/dashboard
- Runs quarterly ROE review process
- Proposes amendments as organization evolves

**CRM Administrator (if separate from RevOps)**
- Needed when RevOps lacks Salesforce admin access
- Handles validation rule deployment, Flow automation, Territory Management configuration

**Enterprise Considerations**
- Legal review may be required if ROE ties to compensation or employment terms
- Multiple regional sales leaders may need to approve region-specific rules
- IT security review if CRM automation changes affect data access controls

---

## 4) Scoping

### Scoping Factors

**1. Number of Sales Segments**
- Single segment = simpler ROE with fewer handoff scenarios
- Multiple segments (SMB, Mid-Market, Enterprise) = requires handoff rules, boundary definitions, escalation for segment-changing accounts

**2. Sales Roles Involved**
- AEs only = straightforward ownership rules
- AE + SDR/BDR = meeting-booked handoff rules and SLAs
- AE + CSM + AM = upsell/expansion ownership boundaries, renewal ownership, cross-sell rules
- All roles + Partner Manager = full complexity with channel deal registration and co-sell rules

**3. GTM Motion Mix**
- Inbound only = round-robin/territory assignment focus
- Outbound only = named account protections and prospecting boundaries
- Inbound + Outbound = rules for when inbound leads hit accounts being actively prospected outbound

**4. Partner/Channel Involvement**
- No partners = eliminates scenario category
- Active partner program = requires deal registration windows, credit rules, co-sell engagement rules

**5. CRM Platform and Maturity**
- Salesforce with clean data = full CRM enforcement feasible
- HubSpot with clean data = enforcement via workflows with some territorial management limitations
- Poor data quality = cleanup may be needed before enforcement rules work

**6. Existing ROE Documentation**
- No existing ROE = full build from scratch (60-80 hours)
- Outdated/incomplete ROE = audit and update (40-60 hours)
- Existing ROE needing CRM enforcement only = configuration focus (30-50 hours)

### Multiple Approaches

**Approach 1: Full Build**
- Criteria: No existing ROE, or documentation too outdated to be useful; multiple segments and roles
- Execution: Full discovery with stakeholder interviews, scenario mapping, draft from scratch, leadership review, team rollout, CRM enforcement build

**Approach 2: Audit & Update**
- Criteria: Existing ROE covers some scenarios but has gaps (no partner rules, no segment handoff, no escalation); team has grown
- Execution: Gap analysis against current structure, expand existing document, add missing scenarios, strengthen CRM enforcement

**Approach 3: Enforcement-Only**
- Criteria: Written current ROE exists but lacks CRM enforcement; reps follow rules inconsistently
- Execution: Map existing rules to CRM configurations, build validation rules and automation, create monitoring dashboards, minimal document updates

---

## 5) Discovery Questions

### Questions for Project Kickoff

**Business Context**
- How many sales reps do you have, and how are they segmented? *(Determines scope and number of scenarios)*
- What's your GTM motion mix -- primarily inbound, outbound, or both? *(Drives which scenario categories to prioritize)*
- Do you have a channel/partner program? If so, how active is it? *(Determines if partner ROE is in scope)*
- When was the last time you hired a batch of new reps? *(Recent hires often surface ROE gaps fastest)*

**Current State**
- Do you have any written ROE today -- even informal wiki pages or Slack posts? *(Establishes starting point)*
- How many ownership disputes come up per month, roughly? *(Quantifies the problem)*
- How are disputes resolved today? Who makes the call? *(Reveals if an informal process exists)*
- What's the most common type of dispute -- inbound overlap, outbound poaching, upsell ownership, or something else? *(Prioritizes scenario mapping)*
- Have you lost any reps in the past year who cited unfairness or territory issues? *(Connects ROE to retention)*

**Technical Environment**
- Which CRM are you on -- Salesforce or HubSpot? What edition? *(Determines enforcement options)*
- Do you use a routing tool like LeanData, Chilipiper, or native CRM routing? *(Affects inbound assignment rules)*
- How clean is your CRM data -- specifically account hierarchy, industry, and revenue fields? *(Determines if CRM enforcement is immediately feasible)*
- Do you have a CRM admin or does RevOps handle administration? *(Identifies the technical counterpart)*

**Expectations**
- What does "done" look like for you? A document, CRM enforcement, or both? *(Scopes deliverables)*
- Who is the final decision-maker on ROE? *(Identifies the approval gate)*
- Are there any scenarios you already know are contentious? *(Gets ahead of political landmines)*
- What's your timeline -- is this tied to a new territory plan, hiring wave, or comp cycle? *(Drives urgency and phasing)*

### Information to Gather Before Implementation

**Dispute Data:**
Pull CRM data on ownership changes, opportunity reassignments, and duplicate contacts/leads from past 90 days. Collect Slack threads or email chains about disputed deals.

**Team Structure:**
Complete org chart of customer-facing roles: AEs, SDRs, CSMs, AMs, Partner Managers. Include segment assignments and any named account lists.

**Existing Documentation:**
Any written ROE, territory plans, compensation plan documents referencing ownership, or onboarding materials describing sales processes.

**CRM Access:**
Admin-level access to Salesforce or HubSpot to audit current automation, validation rules, and territory settings.

### Approach Decision Questions

| Question | Answer → Approach |
|----------|-------------------|
| Do you have any written ROE today? | No/unusable = Full Build; Partial = Audit & Update; Yes & current = Enforcement-Only |
| Is the main problem "we don't have rules" or "rules aren't enforced"? | No rules = Full Build; Not enforced = Enforcement-Only |
| How many segments and roles touch deals? | 1 segment + AEs only = Simpler scope; Multiple segments + AE/CSM/AM/Partner = Full complexity |
| Is a partner/channel program in scope? | Yes = adds 15-20 hours for partner scenarios; No = standard scope |

---

## 6) Overcoming Common Belief Barriers

### "We don't need this written down -- our team just knows the rules."

Every small sales team believes this until scaling exposes gaps. Breaking points include hiring new representatives, transferring reps between segments, or losing the manager who was "source of truth." The absence of written ROE then becomes crisis rather than planned project.

Data supports this: 58% of B2B companies rate territory design as ineffective, with undocumented ownership rules often being the root cause. Tribal knowledge typically scales to 5-8 reps before generating 2-3 disputes weekly.

**Reframe:** "Your team knows their version of the rules. The question is whether all versions match. Interviewing 5 reps separately typically yields 3-4 different answers about a given scenario."

### "This will slow our reps down with bureaucracy."

This confuses documentation with process overhead. Written ROE doesn't add steps -- it removes unplanned interruptions from ambiguous ownership. Representatives currently spend time in Slack threads asking clarification questions, waiting for manager rulings, and avoiding outreach to accounts they're uncertain about.

Sales reps spend only 28% of time actually selling. Clear ROE reduces the "internal negotiation" portion of administrative overhead.

**Reframe:** "ROE doesn't add process -- it removes the hidden process you already have. Right now, every ambiguous deal triggers Slack messages, manager calls, and delayed outreach. Written ROE replaces that with a 30-second reference lookup."

### "We tried this before and nobody followed the rules."

This objection reflects real experience. Three common failure modes were:

1. **Vague rules:** "The AE owns the account" doesn't clarify scenarios where SDRs book meetings at CSM accounts. If/then language with specific examples is essential.
2. **No CRM enforcement:** If the CRM allows behavior violating ROE, the ROE becomes optional. Validation rules, automation, and alerts make compliance the easiest path.
3. **No buy-in process:** Rules imposed without rep input feel punitive. This project includes rep interviews and structured rollout with discussion.

**Reframe:** "What specifically failed previously? We'll design around those failure modes. Usually it's vague rules, absent CRM enforcement, or insufficient buy-in. We address all three."

### "Our sales team is too small to need this."

Organizations with 3-5 reps often think ROE is only for large teams. However, a single disputed deal at a startup ($50K-$200K ACV) costs proportionally more than at enterprise companies. Writing ROE early takes 30-40% less effort than writing it during crisis.

**Reframe:** "The best time to write ROE is before urgency demands it. You're hiring, meaning every new rep without clear rules increases dispute risk. Writing it now takes 40 hours; writing it after a blown deal takes 40 hours plus whatever that deal was worth."

---

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

| Metric | Impact Direction | Expected Magnitude | Notes |
|--------|------------------|-------------------|-------|
| Opp-to-CW Conversion Rate | Increase | +5-15% | Deals no longer stall during ownership debate |
| Sales Cycle Length | Decrease | -10-20% | Eliminates ownership-dispute delays |
| Pipeline Production | Increase | +10-20% | Reps prospect confidently knowing account ownership |
| Rep Productivity (Revenue/Rep) | Increase | +15-25% | Well-designed models boost productivity |

### Expected Outcomes

| Metric | Before | After | Source |
|--------|--------|-------|--------|
| Ownership disputes per month | 8-15 (typical for 20-person team) | 2-4 | LeanScale benchmarks |
| Time to resolve dispute | 3-7 days (Slack + manager intervention) | 24-48 hours (documented SLA) | ROE escalation SLA |
| Manager time on dispute arbitration | 5+ hours/week | <1 hour/week | Discovery interviews + tracking |
| Rep confidence in ownership clarity | Low (varies by tenure) | High (quarterly survey) | Pre/post rollout survey |
| CRM ownership data accuracy | Inconsistent (manual, tribal) | Automated enforcement | CRM audit pre/post |

### How to Measure Success

**Leading Indicators (Early signals, Week 1-4):**
- Reduction in ownership dispute Slack messages and manager escalations (track weekly volume)
- All reps have signed/acknowledged ROE document (100% completion within 2 weeks)
- CRM enforcement rules active and firing (monitor validation rule trigger count)
- Zero "who owns this?" questions in team Slack channels

**Lagging Indicators (Proof of success, Month 2-6):**
- 50%+ reduction in ownership disputes escalated to management within 30 days
- Zero ambiguous ownership situations causing deal delays or lost revenue within 90 days
- Rep satisfaction with ownership fairness in quarterly survey (target: 80%+ positive)
- Reduced voluntary rep turnover attributable to territory/ownership frustration
- ROE quarterly review cadence established and running (first review within 90 days)

---

## References

[1] Salesforce - State of Sales Report (2024)
[2] Highspot - Sales Territory Management: Planning Tips
[3] Alexander Group - Why Are Your Reps Leaving?
[4] Everstage - Sales Rules of Engagement Policy Document
[5] Salesforce Help - Enterprise Territory Management
[6] Gradient Works - Rules of Engagement Toolkit
[7] InsideSales - Time Management for Sales Reps
