---
sidebar_position: 3
title: "Sales Processes"
description: "Sales processes for Scale stage — segmentation, territories, sales management"
---

> **Scale Stage** | $5-15M ARR | 30-80 headcount
>
> Main challenge: Adding capacity without chaos. Process debt and tool sprawl.
>
> *[← Back to Scale Overview](./overview)*

## Sales Processes

**Stage-appropriate approach:** All sales subsections now apply. Territory design is essential, not optional. Qualification methodology needs to be formal and consistent across the team. The focus shifts from "does this work?" to "does this scale?"

## ICP and Personas

**Stage-appropriate approach:** ICP is no longer a hypothesis — it's segmented. Teams at this stage have enough data to know which customers succeed and which don't. The work now is segmentation and prioritization.

**What "segmented ICP" means:**

- **Segment by outcome** — which customer profiles have highest win rates, fastest sales cycles, best retention?
- **Segment by motion** — some customers need high-touch sales, others convert through self-serve
- **Segment by ACV** — SMB, mid-market, and enterprise have different needs and economics

| Segment | Definition | Typical ACV | Motion |
|---------|-----------|-------------|--------|
| **SMB** | Under 100 employees | $5-15K | Self-serve or low-touch |
| **Mid-Market** | 100-1,000 employees | $15-50K | Sales-assisted |
| **Enterprise** | >1,000 employees | $50K+ | High-touch, multi-threaded |

**Persona documentation at Scale:**

- **Primary personas per segment** — who are the buyers, users, and decision-makers in each segment?
- **Persona-specific messaging** — what resonates with each persona? What problems do they care about?
- **Content mapping** — which content works for which persona at which stage?

**What NOT to do:**

- **Treat all customers the same** — the SMB motion can't work for enterprise, and vice versa
- **Ignore segment economics** — if SMB CAC > LTV, either fix the motion or stop selling to SMB
- **Over-segment too early** — 3-4 segments is enough; more creates complexity without value

**Playbook reference:** → Market Map, ICP/Personas Documentation

---

## Qualification Framework

**Stage-appropriate approach:** Qualification methodology must be formal and consistent. Every rep should qualify the same way. This isn't about following a script — it's about ensuring the right information is captured for accurate forecasting.

**Methodology comparison:**

| Framework | Best For | Key Focus |
|-----------|----------|-----------|
| **BANT** | Transactional, shorter cycles | Budget, Authority, Need, Timeline — simple but shallow |
| **MEDDIC** | Enterprise, complex deals | Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion |
| **SPICED** | Customer-centric, modern sales | Situation, Pain, Impact, Critical Event, Decision |

**At Scale, most B2B SaaS companies should use MEDDIC or SPICED.** BANT is too shallow for deals over $20K ACV or 60+ day cycles.

**Implementation requirements:**

- **CRM fields for each qualification element** — capture data where it can be analyzed
- **Qualification review in deal reviews** — managers should check qualification completeness
- **Minimum qualification bar for stage progression** — deals can't move forward without key information

**Sample MEDDIC implementation:**

| Element | Required Field | When to Capture |
|---------|---------------|-----------------|
| Metrics | Quantified business impact | Discovery |
| Economic Buyer | Name and access level | Discovery/Validation |
| Decision Criteria | Technical and business criteria | Validation |
| Decision Process | Steps, approvals, timeline | Validation |
| Identify Pain | Pain articulated, implications understood | Discovery |
| Champion | Name, influence level, access | Throughout |

**What NOT to do:**

- **Optional qualification fields** — if it's optional, it won't get filled
- **Changing methodology quarterly** — pick one and commit for 12+ months
- **No enforcement** — methodology without accountability is just documentation

**Playbook reference:** → Sales Qualification Methodology

---

## Sales Stage Entry/Exit Criteria

**Stage-appropriate approach:** Detailed entry and exit criteria for each stage. No ambiguity about when a deal moves forward. This is the foundation for accurate forecasting — without it, stage distribution is meaningless.

**Scale-stage sales process (typical 5-7 stage process):**

| Stage | Entry Criteria | Exit Criteria | Typical Duration |
|-------|---------------|---------------|------------------|
| **0 - Prospect** | Identified as potential fit | Initial outreach completed | N/A |
| **1 - Discovery** | Meeting scheduled | Pain identified, stakeholders mapped | 1-2 weeks |
| **2 - Qualification** | Discovery complete | MEDDIC elements captured, budget range confirmed | 2-3 weeks |
| **3 - Evaluation** | Qualified opportunity | Technical validation complete, champion confirmed | 3-4 weeks |
| **4 - Proposal** | Evaluation passed | Proposal delivered, pricing discussed | 1-2 weeks |
| **5 - Negotiation** | Proposal reviewed | Terms agreed, legal/procurement engaged | 2-4 weeks |
| **6 - Closed Won/Lost** | Verbal or written agreement | Contract signed / deal lost | N/A |

**Key principles:**

- **Entry criteria are objective** — not "I think they're interested" but "discovery meeting completed and notes logged"
- **Exit criteria require artifacts** — stage changes should leave evidence in CRM
- **Stage durations are guideline only** — use for forecasting averages, not deal policing

**CRM enforcement:**

- **Required fields per stage** — deal can't save in next stage without completing current stage fields
- **Validation rules** — system prevents backdating, requires close reasons on losses
- **Stage history tracking** — how long deals spend in each stage, for process optimization

**What NOT to do:**

- **Stages as % complete** — "50% close" doesn't mean anything
- **Rep-defined progression** — if reps decide when deals advance, forecasting is fiction
- **Too many stages** — 7 is plenty; 10+ creates confusion without value

**Playbook reference:** → Sales Lifecycle

---

## Deck and Demo Process

**Stage-appropriate approach:** Segment-specific decks and demos. The pitch that works for SMB won't work for enterprise. Enablement materials need to support multiple motions.

**Deck structure at Scale:**

| Deck Type | Purpose | When Used |
|-----------|---------|-----------|
| **Corporate overview** | High-level positioning | First meetings, exec intros |
| **Segment-specific pitch** | Tailored value prop | Discovery/qualification |
| **Persona-specific slides** | Modular inserts | Mixed-persona meetings |
| **ROI/business case** | Quantified value | Proposal/negotiation |
| **Customer proof points** | Social proof by segment | Throughout |

**Demo approach:**

- **Standard demo environment** — maintained, current, representative
- **Demo scripts by segment** — what to show, in what order, why it matters to that buyer
- **Custom demo prep process** — when to customize, how much time to allocate

**Demo quality requirements:**

- **Consistent storyline** — demo follows a narrative, not a feature tour
- **Discovery-informed** — demo ties back to customer's stated problems
- **Time-boxed** — demos have structure, not endless clicking

**What NOT to do:**

- **One deck for everyone** — "comprehensive" decks are ineffective decks
- **Live product demos on day one** — show the product after understanding the problem
- **Feature-focused demos** — nobody cares about features; they care about outcomes

**Playbook reference:** → Demo Script, Sales Deck Template (if exists)

---

## Proposal and Quote Generation

**Stage-appropriate approach:** Structured proposals with templates. Quote generation is consistent. Pricing is clear enough that proposals don't require founder approval on every deal.

**Proposal components:**

| Section | Purpose | Notes |
|---------|---------|-------|
| Executive summary | Restate problem and value | 1 page max |
| Solution overview | What they're buying | Aligned to their language |
| Pricing | Clear, professional format | No surprises |
| Implementation | What happens after signature | Timeline, responsibilities |
| Terms | Contract essentials | Standard unless negotiated |
| Social proof | Relevant customer references | Segment-matched |

**Quote generation:**

- **Standard pricing model documented** — reps know the rules without asking
- **Discount approval workflow** — who approves what discount level
- **CPQ consideration** — if deal complexity is high (multiple products, custom terms), consider CPQ tooling

**Discount governance:**

| Discount Level | Approval Required |
|----------------|-------------------|
| 0-10% | Rep authority |
| 10-20% | Manager approval |
| 20-30% | VP approval |
| >30% | C-level or founder |

**What NOT to do:**

- **Custom proposals every time** — templates save time and ensure consistency
- **No discount policy** — leads to race-to-the-bottom pricing
- **Pricing in emails** — formal proposals protect pricing integrity

**Playbook reference:** → Proposal Template, Quote Process

---

## Sales-to-CS Handoff

**Stage-appropriate approach:** Formalized handoff process with documentation and accountability. Handoff happens before signature or immediately after — not weeks later when CS is scrambling.

**Handoff components:**

| Component | What It Contains | Who Owns |
|-----------|-----------------|----------|
| **Deal summary** | What was sold, to whom, why | AE |
| **Success criteria** | What the customer is trying to achieve | AE + CS |
| **Stakeholder map** | Who's who, who has power, who's champion | AE |
| **Risk flags** | Anything that could derail success | AE |
| **Implementation notes** | Technical requirements, timeline expectations | AE + SE |
| **First 30/60/90 day plan** | What CS will do when | CS |

**Handoff process:**

1. **Pre-signature handoff meeting** — AE introduces CS to champion before close
2. **Deal record complete** — all required fields populated in CRM
3. **Handoff document created** — summary of everything CS needs to know
4. **Kickoff scheduled** — onboarding meeting on calendar before or at signature
5. **AE accountability** — AE's job isn't done until CS confirms successful handoff

**What NOT to do:**

- **Email handoffs** — documentation gets lost, context dies
- **CS finds out at signature** — no time to prepare, scrambled start
- **AE disappears after close** — first renewal is easier if AE stays connected

**Playbook reference:** → Sales to CS Handoff Process

---

## Territory Design

**Stage-appropriate approach:** Essential at Scale. With multiple reps, territory design determines who works what accounts. Poor territory design creates conflict, coverage gaps, and morale problems.

**Territory design approaches:**

| Approach | Best For | Pros | Cons |
|----------|----------|------|------|
| **Geography** | Field sales, local presence matters | Clear boundaries, simple | Markets vary in size/quality |
| **Named accounts** | Enterprise, strategic deals | Rep accountability, relationship depth | May create uneven territories |
| **Vertical/industry** | Industry-specific solutions | Deep expertise, better positioning | May limit total market |
| **Account size (segment)** | Multi-motion companies | Motion-appropriate | Requires clear handoff rules |
| **Round-robin** | Inside sales, homogeneous leads | Fair distribution | No relationship continuity |

**Territory design principles:**

- **Balance opportunity, not just accounts** — territories should have comparable pipeline potential
- **Account for ramp** — new reps get territories they can succeed in while ramping
- **Clear rules for account changes** — when accounts move between territories (growth, segment change)
- **Annual review cadence** — territories need regular rebalancing

**Territory planning inputs:**

| Data Source | What It Informs |
|-------------|-----------------|
| TAM/SAM analysis | Total opportunity by territory |
| Historical performance | Which territories over/underperform |
| Rep capacity | How many accounts can a rep effectively manage |
| Customer concentration | Avoid over-reliance on single accounts/regions |

**What NOT to do:**

- **First-come-first-serve** — leads to cherry-picking and conflict
- **Static territories for years** — market changes, territories should too
- **Equal account counts** — equal accounts ≠ equal opportunity

**Playbook reference:** → Sales Territory Design

---

## Commission Plan Design

**Stage-appropriate approach:** Team compensation structures emerge at Scale. Multiple reps means consistent comp plans. Complexity increases but shouldn't be overwhelming.

**Commission plan components:**

| Component | Typical Structure at Scale |
|-----------|---------------------------|
| **Base salary** | 50-60% of OTE for AEs |
| **Variable/commission** | 40-50% of OTE |
| **Quota** | ARR target, usually quarterly |
| **Accelerators** | 1.5-2x rate above quota |
| **Decelerators** | 0.5-0.75x rate below threshold |

**Commission calculation example:**

| Performance | Rate | Example (@ $100K OTE, 50/50 split) |
|-------------|------|-----------------------------------|
| Under 70% of quota | 0.5x | $25K variable for 70% attainment |
| 70-100% of quota | 1.0x | $50K variable for 100% attainment |
| 100-150% of quota | 1.5x | $75K additional for 150% attainment |
| >150% of quota | 2.0x | Uncapped above 150% |

**Compensation philosophy decisions:**

- **Individual vs. team component** — most Scale companies are 100% individual; team components add complexity
- **New logo vs. expansion** — same rate, or higher rate for new logos?
- **Spiffs and SPIFs** — short-term incentives for strategic priorities
- **Claw-back provisions** — what happens when customers churn within X months

**Role-specific considerations:**

| Role | Comp Structure Notes |
|------|---------------------|
| **AE** | Quota-based, accelerators at 100%+ |
| **SDR** | Meeting-based or qualified opportunity-based |
| **Sales Manager** | Team attainment + individual (if carrying quota) |
| **CSM** | Often partially on retention/expansion (controversial) |

**What NOT to do:**

- **Complicated plans nobody understands** — if reps can't calculate their own commission, the plan is broken
- **Quarterly plan changes** — comp plan stability builds trust and focus
- **Capping commission** — caps motivate reps to sandbag, not accelerate
- **100% variable** — attracts wrong profile, creates desperation selling

**OTE benchmarks by role (Scale stage, Series A/B):**

| Role | SMB | Mid-Market | Enterprise |
|------|-----|------------|------------|
| **SDR** | $60-80K | $70-90K | $80-100K |
| **AE** | $120-150K | $150-200K | $200-280K |
| **Sales Manager** | $180-220K | $200-250K | $250-320K |

*Note: Ranges vary by geography (SF/NYC +20%, other markets -10-20%) and industry.*

**Playbook reference:** → Commission Plan Design (if exists)

---

