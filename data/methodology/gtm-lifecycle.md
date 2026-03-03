# GTM Lifecycle — Methodology

## 1) Core Concepts

### Concept 1: The GTM Lifecycle (Full Scope)

**What is it?**

A unified framework mapping every stage a prospect or customer passes through—from anonymous website visitor through mature product adoption. It spans five functional domains: Lead/Marketing stages, Sales stages, Customer Success stages, Renewal stages, and POC/POV stages. Not a sales pipeline, but the full revenue motion end-to-end.

**Why does it matter?**

The GTM Lifecycle serves as the measurement backbone of revenue operations. All funnel reporting, conversion tracking, stage velocity analysis, and cost-per-stage economics depend on defined stages with clear entry criteria. Without it, teams operate in silos with disconnected definitions.

**Key insight:**

"The go to market life cycle goes beyond the sales stages and we take a look at marketing, customer success, and implementation teams." The most common mistake is treating this as only a sales pipeline construct.

**Examples:**

| Context | How the GTM Lifecycle Applies |
|---------|------|
| Board-level reporting | Enables a single funnel view from first touch to renewal, not three separate team reports |
| Marketing-Sales alignment | Provides a shared definition of MQL, SAL, and SQL that both teams agree on |
| CS accountability | Extends the managed lifecycle past Closed Won, giving CS teams defined stages and entry criteria |
| Post-merger alignment | Acts as the "reunification playbook" — re-establishes shared stage language across merged teams |

**Common misunderstandings:**

- **Misconception:** The lifecycle is just the sales pipeline with a few extra stages. **Reality:** The lifecycle covers five functional domains. The sales pipeline is one component. Lead stages, customer stages, renewal stages, and POC stages each have their own progression logic, entry criteria, and measurement implications.

- **Misconception:** Every company needs every stage. **Reality:** The lifecycle is a reference framework, not a rigid mandate. Stages should be evaluated for relevance per business. A company without a POC process skips POC stages. A company with no renewal motion skips renewal stages.

---

### Concept 2: Golden Stages

**What is it?**

Three stages in the GTM Lifecycle designated as "Golden"—the most critical transition points requiring the highest accuracy and control:

1. **SQL (Sales Qualified Lead)** — "The closed won of marketing." Defines created pipeline. First stage used for accurate pipeline numbers.
2. **Closed Won** — "The most important stage in the funnel process. Accuracy and control of this stage is imperative."
3. **Early Adoption** — "Moving to this stage signifies a successful customer onboarding and implementation with the customer experiencing value."

**Why does it matter?**

These three stages represent handoff points between major organizational functions: Marketing to Sales (SQL), Sales to CS/Delivery (Closed Won), and Delivery to Long-Term Success (Early Adoption). Getting these wrong cascades errors through all downstream metrics—pipeline numbers, revenue attribution, customer health reporting.

**Key insight:**

Each Golden Stage marks a fundamentally different type of value creation. SQL creates pipeline. Closed Won creates revenue. Early Adoption creates retention. If a company could only track three stages perfectly, these are the three.

**The Framework:**

```
Marketing Funnel          Sales Funnel          Customer Funnel
Lead -> MQL -> SAL -> [SQL] -> SAO -> Proposal -> [CW] -> Onboarding -> [EA] -> Mature Adoption
                       ^^^                        ^^^                    ^^^
                    GOLDEN 1                   GOLDEN 2              GOLDEN 3
                  (Pipeline)                  (Revenue)            (Retention)
```

---

### Concept 3: Lifecycle vs Status vs Type

**What is it?**

A three-dimensional classification system preventing the common error of collapsing different concepts into a single CRM field:

- **Lifecycle** tracks where a record is in its journey (funnel milestones). Answers: "How far along is this prospect/customer?"
- **Status** tracks the current working state (what is happening right now). Answers: "What is the rep/CSM doing with this record?"
- **Type** tracks identity (what kind of entity this is). Answers: "What is this record?"

**Why does it matter?**

When these concepts are mixed into a single field, automation breaks, reporting becomes unreliable, and teams disagree on what a record's "stage" means. This is the single most common architecture error in GTM systems. Separating them enables independent automation on each dimension.

**Key insight:**

"Clearly separates lifecycle (funnel milestones) from status (working states), eliminating ambiguity and enabling more predictable routing, automation, and reporting."

**Examples:**

| Context | Lifecycle | Status | Type |
|---------|-----------|--------|------|
| New form fill, not yet worked | Lead | New | — |
| SDR actively reaching out | MQL | Working | — |
| Paying customer in onboarding | Customer | Active | Customer |
| Former customer who churned | Churned | Churned | Customer |
| Contact permanently disqualified | Disqualified | — | Non-ICP |

**Common misunderstandings:**

- **Misconception:** "Lead Status" and "Lifecycle Stage" are interchangeable. **Reality:** Status values like "In Progress," "Attempted," and "Connected" describe working states, not funnel progression. Mixing them into lifecycle stages creates overlap and makes reliable automation impossible.

- **Misconception:** Deal outcomes (Won/Lost) belong in the lifecycle field. **Reality:** Deal outcomes are terminal states that have nothing to do with funnel position. A contact whose deal was lost should move to Nurture in lifecycle, not "Lost Opportunity." Lifecycle tracks forward progression; deal outcomes live in the deal pipeline.

---

### Concept 4: Entry Criteria

**What is it?**

Objective, documented conditions determining when a record moves from one lifecycle stage to the next. Every stage across every domain (Lead, Sales, Customer, Renewal, POC) must have defined entry criteria. Entry criteria answer: "What specifically must be true before this record advances?"

**Why does it matter?**

Without clear entry criteria, stage movement becomes subjective. Reps move deals based on gut feel, CSMs advance customers based on time elapsed rather than milestones achieved, and marketing marks leads as qualified without consistent thresholds. The result: corrupted pipeline data, inaccurate forecasting, and broken reporting.

**Key insight:**

"These criteria should be the objective benchmarks that determine when an opportunity or customer moves from one stage to the next. Clearly defined entry criteria will help us report accurately, make data-driven decisions, and ensure alignment across the teams involved."

**Examples:**

| Stage Transition | Entry Criteria Example |
|------------------|------------------------|
| Lead to MQL | Lead scoring threshold met, OR demo request submitted, OR product trial activated |
| MQL to SAL | Sales accepts the MQL via routing or manual acceptance; not immediately disqualified |
| SAL to SQL | Qualification confirmed: ICP fit, pain identified, intent demonstrated, timing reasonable |
| SQL to SAO | Discovery/demo call completed; rep determines prospect meets qualification criteria (e.g., BANT); pipeline value assigned |
| Closed Won to Pre-Onboarding | Contract signed; CS team notified; onboarding ticket auto-created |
| Onboarding to Early Adoption | First Time to Value (FTV) achieved — customer is getting results from the product |

---

### Concept 5: Past-Tense Stage Naming

**What is it?**

A naming convention where every stage name reflects a completed action rather than an in-progress activity. "Demo Completed" instead of "Demo." "Proposal Sent" instead of "Proposal." "Negotiations Completed" instead of "Negotiation."

**Why does it matter?**

Removes ambiguity about whether an activity has happened or is still happening. When a deal sits in "Demo Completed," everyone looking at the pipeline knows exactly what has been done and what the next step is.

**Key insight:**

"We don't have the stage labeled as 'demo' because you may question — has the demo been completed? Are you in the process of demoing? Are you scheduling a demo? Instead we label the stage as demo completed."

**Common misunderstandings:**

- **Misconception:** Label stages by the activity (e.g., "Demo," "Negotiation," "Proposal"). **Reality:** Label stages by the completed milestone (e.g., "Demo Completed," "Negotiations Completed," "Proposal Sent"). This eliminates ambiguity.

---

### Concept 6: Buyer-Commitment-Based Pipeline Staging

**What is it?**

Pipeline stages should represent buyer commitments—actions the buyer has taken—not internal tasks, time-based countdowns, or sales rep activities. Each stage advancement means the buyer has done something that moves the deal forward.

**Why does it matter?**

When stages represent internal signals (like "Trending Up/Down" or "Early Conversation") or time-based markers (like "120-Day Renewal"), pipeline metrics become unreliable. Forecasting accuracy drops because stages do not reflect actual buying intent.

**Key insight:**

"Aligns stages directly to buyer commitments rather than internal tasks, which improves forecasting accuracy, MEDDPIC alignment, and deal qualification discipline."

**Anti-patterns to avoid:**

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Time-based stages (120/90/60/30-day) | Inflates pipeline, obscures forecast | Replace with commercial progression (Open Renewal, Review, Proposal, Negotiation, Closed) |
| Internal signal stages (Trending Up/Down) | Not buyer commitments; creates noise | Track as CRM properties or scores, not pipeline stages |
| Task-level stages (50%, 75%, 90% complete) | Operational noise mixed with lifecycle | Move to project/task management, not pipeline |
| Activity stages mixed with qualification stages | Conflates meetings with milestones | Define clear milestone meaning for each stage |

---

### Concept 7: First Time to Value (FTV)

**What is it?**

The point at which a customer first realizes actual value from the product or service. FTV marks the transition from setup/implementation to active usage with results. It is the entry criteria for the Early Adoption stage.

**Why does it matter?**

FTV is the central goal of onboarding and implementation. It is the dividing line between high-churn-risk stages (onboarding, implementation) and low-churn-risk stages (early adoption, mature adoption). Structured onboarding that achieves FTV within 90 days increases first-year retention by 25%.

**Key insight:**

"The goal of onboarding and implementation is always to get them to first time to value as soon as possible." Early Adoption, triggered by FTV, is the "closed won" equivalent for customer success—the milestone that signals the customer relationship is secured.

**Common misunderstandings:**

- **Misconception:** FTV is the same for every company. **Reality:** "Early adoption might look different for a lot of different types of companies — for some companies it may be a certain level of utilization with your product and for others it may be actual outcomes and success criteria." The definition must be specific to the product.

---

### Concept 8: Three-Pipeline Architecture

**What is it?**

All revenue motions consolidated into exactly three deal pipelines with structurally parallel stages:

| New Business | Renewal | Expansion |
|--------------|---------|-----------|
| Lead | Open Renewal | Expansion Identified |
| Demo Booked | Review Completed | Discovery Complete |
| Demo Completed | Proposal Sent | Use Case Defined |
| Use Case Defined | Negotiation Complete | Proposal Sent |
| Proposal Sent | Closed Won / Lost | Negotiation Completed |
| Negotiation Complete | — | Closed Won / Lost |
| Closed Won / Lost | — | — |

**Why does it matter?**

Pipeline proliferation—the pattern where companies create separate pipelines for enterprise, self-service, upsell, renewal countdown, and channel deals—creates reporting fragmentation, inconsistent forecasting, and coaching overhead. Three pipelines with consistent stage naming enable cross-pipeline reporting and a single forecasting methodology.

**Key insight:**

"Creates a consistent, simplified stage architecture across all revenue motions (New Business, Renewal, Expansion), enabling clean forecasting and predictable funnel conversion tracking."

---

### Concept 9: The Six Measurement Categories

**What is it?**

A framework for measuring the effectiveness of the GTM Lifecycle across six dimensions:

1. **Production by Stage** — Volume of records at each stage (how many MQLs, SQLs, Closed Won, etc.)
2. **Stage Conversion** — Rate at which records move from one stage to the next (MQL-to-SQL %, SQL-to-CW %)
3. **Time in Stage** — How long records take to move between stages (cycle time)
4. **Drop-off Reasons** — Why records fail to advance (documented root causes per transition)
5. **Cost to Enter Stage** — Total cost to move a record into a given stage (economic efficiency)
6. **Segmentation** — Breaking all metrics above by contributor, customer segment, region, and channel

**Why does it matter?**

"The go to market life cycle process is the backbone of your revenue operation and this is why — everything that you're trying to measure to see if your revenue operation is operating well, or there's bottlenecks or areas of improvement, is based on these stages and based on this entry criteria that you've laid out."

**Key insight:**

Cost to Enter Stage is singled out as "the most important metric to measure your efficiency." Volume and conversion may look healthy, but if the cost to get records to each stage is unsustainable, the GTM motion fails. Segmentation is the layer that prevents averaging from masking problems—enterprise segment performance may differ dramatically from SMB.

---

### Concept 10: Foundation Playbook vs Depth Playbooks

**What is it?**

The GTM Lifecycle playbook hierarchy has two layers:

- **Foundation Playbook** (GTM Lifecycle umbrella): Defines shared stage language, handoff points, SLAs, and unified reporting across all teams.
- **Depth Playbooks** (Lead Lifecycle, Sales Lifecycle, Customer Lifecycle): Implement the foundation definitions deeply for each functional area.

```
GTM Lifecycle (Foundation)
  - Shared stage language
  - Handoff points + SLAs
  - Unified reporting
        |
   +---------+---------+---------+
   |         |         |         |
Lead     Sales    Customer
Lifecycle Lifecycle Lifecycle
(Depth)   (Depth)   (Depth)
```

**Why does it matter?**

Without the foundation, depth playbooks do not connect—Lead Lifecycle's exit IS Sales Lifecycle's entry. Without depth, the foundation stays surface-level. The question of "which do we need?" depends on company stage and maturity.

**Key insight:**

"GTM Lifecycle's sub-projects are more like chapters of the same book vs. Q2C's sub-projects which are more like books in the same series." The sub-projects share the same CRM, same data model, and often the same admin. The umbrella is not just orchestration—it is the shared definitions that make the sub-projects work.

---

## 2) Decision Frameworks

### Approach Selection: Foundation vs Depth

| Situation | Recommended Approach | Rationale |
|-----------|----------------------|-----------|
| Early-stage ($0-5M), no lifecycle exists | GTM Lifecycle Foundation only | One person often defines everything; 3 separate playbooks for 10 people is overkill |
| Growing ($5M+), has basic lifecycle but one area is broken (e.g., Sales) | Single Depth Playbook (e.g., Sales Lifecycle only) | Do not make them redo the whole thing; fix what is broken |
| Mid-market ($10M+), complete overhaul needed | GTM Lifecycle Foundation + all 3 Depth Playbooks (phased) | Foundation first, then depth. Phase the depth playbooks over 3-4 weeks each |
| Post-merger or re-org, teams misaligned | GTM Lifecycle Foundation only | The "reunification playbook." Re-establish shared language first, then deepen |

### Lead Lifecycle Orchestration: Approach Selection

| Situation | Recommended Approach | Why |
|-----------|----------------------|-----|
| Low lead volume, simple motion | Trigger Based | Stage movement fully reliant on binary triggers. Simple to implement. |
| Scalable volume, buying profiles not the primary concern | Simple Scoring | Lead scoring through prospect actions. Scalable prioritization. |
| Complex/mature organization, need to prioritize best-fit leads | Matrix Lead Scoring | Actions overlaid with profile grades (e.g., A2 = top profile fit + nearly ideal activity score). |

### Sales Stage Movement: Action-Based vs Qualification Methodology

| Situation | Recommended Approach | Why |
|-----------|----------------------|-----|
| Clear milestone-based sales process | Action-Based Movement | One completed action = stage advancement. |
| Complex enterprise deals with multiple stakeholders | MEDDPIC | Need to assess multiple dimensions before advancing. |
| Budget/authority uncertainty in mid-market deals | BANT or CHAMP | Need to validate commercial viability before investing more effort. |
| SAL stage specifically | Action-Based (always) | "At this point there's really no need to have a scoring methodology in place." |

---

## 3) Benchmarks & Standards

### Stage Conversion Rate Benchmarks

| Conversion | Low | Typical | High | Notes |
|---|---|---|---|---|
| Visitor to Lead | <1% | 1.4-2.3% | 3%+ | Varies by traffic quality |
| Lead to MQL | 20% | 31-41% | 50%+ | Depends on lead scoring model |
| MQL to SQL | 12% | 15-21% | 40% | Key bottleneck in most funnels |
| SQL to Opportunity (SAO) | 30% | 42% | 55%+ | Driven by qualification rigor |
| Opportunity to Closed Won | 20% | 22-39% | 45%+ | 39% for SMB/mid-market; 31% for enterprise |
| Onboarding to Early Adoption | 60% | 75% | 90%+ | Driven by onboarding program structure |

### Sales Cycle Length Benchmarks

| Segment | Low | Typical | High | Notes |
|---|---|---|---|---|
| SMB (<$15K ACV) | 14 days | 30-40 days | 90 days | Fastest cycle, lowest ACV |
| Mid-Market ($15K-$100K ACV) | 30 days | 60-90 days | 120 days | 3-4 month cycles common |
| Enterprise (>$100K ACV) | 90 days | 120-170 days | 270+ days | 6-9 months for $100K+ deals |

### Speed-to-Lead Benchmarks

| Metric | Industry Average | Best Practice | Impact |
|---|---|---|---|
| Lead response time | 42 hours | Under 5 minutes | 21x more likely to convert |
| MQL-to-SAL handoff speed | 24+ hours | Under 1 hour | 53% conversion vs 17% for 24+ hour response |
| Percentage of leads ever contacted | 27% | 90%+ | Up to 73% of inbound leads are never contacted |

---

## 4) Calculations & Scoring

### Formula Quick Reference

| Calculation | Formula | Example |
|---|---|---|
| Stage Conversion Rate | (Records entering Stage N+1) / (Records entering Stage N) x 100 | 100 MQLs, 25 become SQLs = 25% |
| Cost to Enter Stage | (Total spend to reach stage) / (Count of records entering stage) | $50,000 / 200 MQLs = $250 per MQL |
| Time in Stage | AVG(Stage N+1 entry date - Stage N entry date) | Average 14 days from Proposal to Negotiation |
| Pipeline Velocity | (# Opps x Avg Deal Size x Win Rate) / Avg Sales Cycle (days) | (100 x $5,000 x 0.30) / 45 = $3,333/day |
| Weighted Pipeline | SUM(Deal Value x Stage Probability) for all open deals | $100K deal at Proposal Sent (75%) = $75K |

---

## 5) Edge Cases

### Edge Case 1: Two Lead Stage Models in the Organization

**Scenario:** Two different lead stage models exist during lifecycle definition.

**Approach:** Both models are valid. Choose based on whether the company tracks anonymous web visitors and whether "Engaged" is a meaningful operational stage.

### Edge Case 2: Multi-Product Lifecycle Recycling

**Scenario:** A customer is at Mature Adoption for Product A, but the company sells them Product B.

**Approach:** Track lifecycle stages per product/service, not per account. Use a custom object linked to both the Account and the Product.

### Edge Case 3: Successful POC but Lost Deal

**Scenario:** The POC demonstrates value successfully, but the deal is lost for non-product reasons.

**Approach:** Track POC outcome separately from deal outcome. This reveals whether the product demonstration process works independently of commercial negotiation.

### Edge Case 4: No Implementation Stage Needed

**Scenario:** Product is simple enough that there is no technical implementation.

**Approach:** Skip the Implementation stage entirely. The customer lifecycle becomes 4 stages.

### Edge Case 5: Churned Customer Re-Activation

**Scenario:** A customer who churned wants to come back.

**Approach:** At the contact level, move to Lead or MQL. At the company level, a new Closed Won deal is required. Preserve historical data.

### Edge Case 6: Customer On Hold

**Scenario:** Customer pauses due to internal issues, budget freeze, or slow adoption.

**Approach:** The CS Pipeline should have an explicit "On Hold" stage. Track time in On Hold separately.

### Edge Case 7: Post-Merger / Re-Org Company

**Scenario:** Company has gone through a merger or reorganization.

**Approach:** Deliver GTM Lifecycle Foundation first. Position as "the reunification playbook."

### Edge Case 8: Customer Scenario Classification

**Scenario:** A returning buyer at a new company, or a new buyer at an existing customer account.

**Approach:** Use a Revenue Type field on the deal to distinguish (New Firm and New Buyer, New Buyer at Same Firm, Existing Buyer at New Firm, Current Customer, Past Customer, Repeat Customer, Stale Customer).

### Edge Case 9: Aggregation Masks Problems

**Scenario:** Overall MQL-to-SQL conversion is healthy but when segmented, one segment is underperforming.

**Approach:** Always segment lifecycle metrics by customer segment, region, individual contributor, and channel.

## References

[1] Vitally - B2B SaaS Churn Rate Benchmarks 2025
[2] First Page Sage - B2B SaaS Funnel Conversion Benchmarks
[3] The Digital Bloom - 2025 B2B SaaS Funnel Benchmarks & Pipeline Audit Framework
[4] Understory - MQL to SQL Conversion Rates: B2B SaaS Benchmarks
[5] Optifai - B2B SaaS Sales Cycle Length Benchmark 2025
[6] Databox - B2B Sales Cycle Length
[7] Martal - 2025 B2B Marketing ROI Benchmarks
[8] First Page Sage - B2B SaaS Customer Acquisition Cost 2025 Report
[9] Kixie - Speed-to-Lead Response Time Statistics
[10] InsideSales - Lead Response Study
[11] Forrester - The SiriusDecisions Demand Waterfall
[12] Factors.ai - Pipeline Velocity: Definition, Formula & Strategies
