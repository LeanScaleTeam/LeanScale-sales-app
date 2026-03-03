# Sales Qualification Methodology — Advisory

## 1) Project Overview

### Project Name
Sales Qualification Methodology - Structured Deal Evaluation & CRM Deployment

### Purpose
This initiative implements a structured qualification framework (MEDDIC, BANT, SPICED, or similar) enabling sales representatives to systematically evaluate opportunities using consistent criteria embedded in the CRM. It includes field configuration, team training, manager coaching infrastructure, and adoption monitoring.

**Core transformation:** Moving from subjective qualification decisions toward systematized opportunity scoring that feeds reliable forecasts and coaching conversations.

### Key Capabilities Unlocked
After completion, the sales organization can:

- Identify and disqualify low-probability deals early, freeing capacity for winnable opportunities
- Conduct pipeline reviews grounded in structured data rather than anecdotal updates
- Produce accurate forecasts using qualification fields as objective deal health signals
- Provide targeted rep coaching on specific qualification gaps
- Correlate qualification completeness to win rates for internal benchmarking

### Business Outcomes

**Primary:**
- Win rate improvement of 15-30% as reps focus on qualification-aligned deals
- Forecast accuracy improvement of 15-25% through standardized opportunity data
- Reduced sales cycle length for qualified opportunities
- Qualification field completion rate >80% within 30 days of rollout

**Secondary:**
- Foundation for AI-powered deal scoring once data is consistently captured
- Data-driven territory and capacity planning
- Reduced "no decision" losses (61% of B2B losses stem from buyer indecision that better qualification surfaces earlier)
- Improved sales-marketing alignment through shared qualified opportunity definitions

### Target Beneficiaries
VP of Sales, Sales Managers/Directors, Account Executives, SDRs/BDRs, RevOps Manager, Sales Ops Analyst, VP of Marketing

### Pain Points Addressed

| Pain Point | Solution |
|-----------|----------|
| "We don't know which deals are real" | Structured criteria separate high-probability from low-probability deals |
| "Pipeline is inflated and forecasts miss" | Mandatory qualification fields provide objective data |
| "Reps spend months on deals that go nowhere" | Early disqualification frees 20-30% of currently wasted rep time |
| "New reps don't know what a good deal looks like" | Framework codifies institutional knowledge into repeatable checklists |
| "Pipeline reviews are unstructured" | Managers use qualification dashboards to focus coaching on specific gaps |
| "67% of losses stem from poor qualification" | Framework directly addresses this documented challenge |

### Supporting Research

The qualification gap in B2B sales is well-documented:

- **67% of lost sales** stem from inadequate lead qualification
- **61% of B2B deals** are lost to "no decision," not competitors—fundamentally a qualification failure
- Only **40% of organizations** consistently apply qualification criteria
- Sales reps spend just **29% of workweek** on actual selling; 71% consumed by administrative tasks
- **Weekly pipeline velocity tracking** drives 34% revenue growth vs. 11% without it
- Top sales performers are **588% more likely** to follow structured methodologies

### Key Frameworks

**The Doctor's Diagnosis Metaphor:** Qualification resembles medical diagnosis rather than checklists. Effective qualification feels like discovery conversation where the rep diagnoses solution fit. When reps treat qualification as data entry, answer quality suffers. When treated as diagnosis, it yields truth.

**The Funnel Filter Metaphor:** Qualification acts as progressive filtration. At each sales stage, additional criteria must be met. Opportunities missing threshold criteria either return to marketing nurture or face disqualification. Without these gates, unqualified deals distort all downstream metrics.

### Target Motion

Designed for Sales-Led Growth motions where AEs run discovery, demos, and multi-stakeholder cycles. Applies to inbound-led and outbound-led pipelines.

**Best fit for:**
- Deal sizes $10K-$500K+ ARR
- Sales cycles 30-180+ days
- 2-15 stakeholder involvement
- Dedicated AE or full-cycle rep roles

**Not ideal for:** Pure Product-Led Growth (PLG) with self-serve conversion or transactional one-call-close models.

---

## 2) Tools & Systems

### Primary Tools

**Salesforce** – Primary CRM for building qualification fields, page layouts, validation rules, and reporting. Qualification fields are added to the Opportunity object with custom picklists, text fields, and checkbox fields.

**HubSpot** – Alternative CRM option. Qualification properties are added to the Deal object. HubSpot's required fields and pipeline automation features enforce data capture at stage transitions.

**Gong / Chorus** – Conversation intelligence platforms for auditing qualification conversation quality post-implementation. Call recordings reveal whether reps ask qualification questions naturally or skip them.

**Google Slides / PowerPoint** – Training deck creation and delivery, including methodology overview, company-specific customization, CRM walkthrough, and role-play scenarios.

---

## 3) Stakeholders & Roles

### Client-Side Stakeholders

**VP of Sales (Executive Sponsor)**
- Approves selected framework
- Communicates importance to team
- Enforces adoption expectations

**Sales Ops / RevOps Manager (Technical Owner)**
- Provides CRM admin access
- Reviews field configuration
- Owns post-project report maintenance

**Sales Managers / Directors (Coaching Owners)**
- Reinforce methodology in 1:1s and team meetings
- Use qualification dashboards for coaching
- Provide feedback on framework fit

**Account Executives / SDRs (End Users)**
- Participate in current state interviews
- Attend training sessions
- Adopt framework in daily selling
- Complete qualification fields on every opportunity

### Technical Owners

**Sales Ops / RevOps Manager** – Owns CRM field configuration post-handoff, manages validation rules, maintains qualification dashboards and reporting.

**CRM Admin (if separate role)** – Handles field-level security, page layout assignments by profile, and validation rule testing.

**Enterprise Considerations** – IT Security review may be required for regulated environments. Change Advisory Board (CAB) approval may be needed for production CRM changes. Multiple sales segments may require role-based page layouts.

---

## 4) Scoping

### Scoping Factors

**1. Sales Motion Complexity**
- Transactional (1-2 decision makers, <60 days, <$25K ACV) → BANT or simplified framework; 4-6 qualification fields
- Mid-market (3-5 stakeholders, 60-120 days, $25K-$100K ACV) → MEDDIC; 6-8 qualification fields
- Enterprise (5-15 stakeholders, 120+ days, >$100K ACV) → MEDDPICC; 8-12 fields with scoring

**2. Team Size**
- Small (5-10 reps) → Single training session, one pilot, faster rollout (2-3 weeks)
- Medium (10-30 reps) → Multiple training cohorts, phased rollout, dedicated pilot team
- Large (30+ reps) → Train-the-trainer model, regional rollouts, extended pilot and monitoring

**3. CRM Platform and Maturity**
- Salesforce with existing custom fields → Extend existing configuration; review for conflicts
- HubSpot with basic setup → Build from scratch; simpler but fewer validation options
- Heavy customization → Careful integration with existing automation, workflows, and page layouts

**4. Number of Sales Segments**
- Single segment → One qualification framework across team
- Multiple segments → May need different frameworks or required fields per segment

**5. Existing Methodology Maturity**
- No formal methodology → Full implementation from scratch; higher training investment
- Informal/inconsistent methodology → Formalize what partially exists; moderate effort
- Previous failed implementation → Address change management resistance; coaching-first approach

### Multiple Approaches

**Approach 1: Standard Deployment**
- Single sales segment, 5-20 reps, one CRM, no prior methodology
- Linear process: assess, select, customize, configure, train, launch, monitor
- Estimated effort: 40-55 hours

**Approach 2: Multi-Segment Deployment**
- Multiple sales motions (e.g., SMB self-serve + Enterprise AE-led), 20+ reps
- Deploy different frameworks per segment, configure role-based CRM layouts
- Estimated effort: 55-75 hours

**Approach 3: Recovery / Re-Implementation**
- Previous methodology attempt that failed or was abandoned, team skepticism
- Start with coaching infrastructure and manager buy-in before training reps
- Smaller pilot with tight feedback loops
- Estimated effort: 50-70 hours

---

## 5) Discovery Questions

### Questions for Project Kickoff

**Business Context**
- What is your average deal size and sales cycle length? *(Determines methodology fit)*
- How many stakeholders are typically involved in buying decisions? *(Complexity indicator)*
- What is your current win rate, and where do you think deals are lost? *(Baseline and pain validation)*
- How accurate are your pipeline forecasts today? What is typical variance? *(Problem quantification)*

**Current State**
- Do your reps currently use any qualification framework, even informally? *(Maturity assessment)*
- Has the team tried a qualification methodology before? If so, what happened? *(Change management risk)*
- What qualification-related fields exist in your CRM today? Are they being used? *(Technical baseline)*
- What does a typical pipeline review look like? What data do managers review? *(Coaching infrastructure baseline)*

**Technical Environment**
- Which CRM are you using? What edition/tier? *(Configuration scope)*
- Who is the CRM admin and do they have time for configuration testing? *(Resource availability)*
- Are there existing validation rules or required fields on Opportunity/Deal object? *(Integration risk)*
- Do you use conversation intelligence tools (Gong, Chorus) that could reinforce adoption? *(Coaching amplifier)*

**Expectations**
- What does success look like in 90 days? *(Alignment on outcomes)*
- How much time can sales managers commit for training and coaching? *(Adoption dependency)*
- Is there a timeline driver (board meeting, QBR, fiscal year) for implementation? *(Urgency and deadline)*
- Are you open to a pilot approach before full rollout? *(Risk mitigation preference)*

### Information to Gather Before Implementation

**CRM Access:**
Salesforce or HubSpot admin credentials (sandbox preferred). List of existing custom fields on Opportunity/Deal object. Current page layout screenshots and validation rules.

**Sales Data:**
90-day opportunity export (stage, close date, amount, win/loss, owner). Current win rate and average sales cycle length by segment. Existing pipeline or forecast reports.

**Organizational Context:**
Sales team org chart with segments and reporting structure. Current pipeline review cadence and format. Any existing training materials, playbooks, or methodology documentation.

### Approach Decision Questions

| Question | Answer → Approach |
|----------|-------------------|
| How many distinct sales motions do you run? | 1 = Standard Deployment; 2+ = Multi-Segment Deployment |
| Have you tried a methodology before? | Yes (failed) = Recovery approach; No = Standard or Multi-Segment |
| How many reps? | <20 = Standard; 20+ = Multi-Segment or Recovery |
| What is deal complexity? | Low (1-2 stakeholders) = BANT; High (5+) = MEDDIC/MEDDPICC |

---

## 6) Overcoming Common Belief Barriers

### "Our reps already know how to qualify -- they don't need a framework."

Individual talent doesn't scale. When top 20% of reps carry 80% of quota, the question is what those performers do differently. Typically, they run a mental qualification process. A formal framework captures that mental model and makes it transferable. Without it, every new hire spends 6-12 months developing their own qualification instinct.

**The reframe:** "This makes what your best reps do instinctively into a repeatable, coachable, measurable standard."

### "Adding more CRM fields will just slow reps down."

The average sales rep spends 71% of their time on non-selling activities. The issue isn't the number of fields—it's whether those fields capture information reps would gather anyway or create net-new work. Well-designed qualification sections ask reps to document what they learned in discovery, not do extra research. Two minutes of data entry versus two months of wasted pipeline—the math is clear.

**The reframe:** "The fields don't slow reps down. Unqualified deals do. The fields make the invisible visible."

### "We tried MEDDIC before and it didn't stick."

Most methodology failures are coaching failures, not framework failures. Research shows that without ongoing reinforcement, only 10-20% of training content is retained after 30 days. This project includes manager coaching infrastructure—dashboards, coaching frameworks, pipeline review redesign—because training alone doesn't change behavior.

**The reframe:** "MEDDIC didn't fail. The coaching infrastructure around it did. This time, we build the coaching first and let the methodology follow."

| Previous Approach | This Approach |
|------------------|---------------|
| 1-day training workshop, then "go use it" | Training + manager coaching cadence + adoption dashboards |
| CRM fields added with no context | Fields with help text, examples, and validation rules |
| No measurement of adoption | Weekly field completion tracking and manager accountability |
| VP announces, then moves on | VP participates in pipeline reviews using the methodology |

### "BANT is outdated / MEDDIC is overkill for our deals."

BANT remains effective for transactional sales with 1-2 decision makers and cycles under 60 days. MEDDIC is purpose-built for enterprise deals with 5+ stakeholders and 90+ day cycles. The right answer depends on the sales motion. Forcing MEDDPICC on teams selling $15K ACV deals creates friction. Using BANT for $200K enterprise deals leaves critical blind spots.

**The reframe:** "We're here to match the right methodology to your sales motion so it actually gets adopted."

---

## 7) Metrics Impact & Success Measurement

### Power 10 Metrics Impacted

| Metric | Impact Direction | Expected Magnitude | Notes |
|--------|-----------------|-------------------|-------|
| Opp-to-Close Won Conversion Rate | Increase | +15-30% | Reps focus on winnable deals; unqualified opps removed earlier |
| Average Sales Cycle Length | Decrease | -10-20% | Qualified pipeline moves faster; stalled deals disqualified |
| Pipeline Coverage Ratio | More accurate | Improved accuracy, not necessarily higher | Inflated pipeline decreases; remaining pipeline is higher quality |
| Forecast Accuracy | Increase | +15-25% | Standardized qualification data replaces subjective rep confidence |

### Expected Outcomes

| Metric | Before | After | Source |
|--------|--------|-------|--------|
| Qualification field completion rate | 20-40% (if fields exist) | >80% within 30 days | LeanScale project benchmarks |
| Win rate | 15-22% (B2B SaaS average) | 25-35% with full adoption | Spotlight.ai research |
| Deals lost to "no decision" | ~60% of losses | 35-45% with earlier qualification | Pavilion/Jolt Effect research |
| Forecast accuracy | 50-65% without standardized data | 70-85% with qualification data | Forecastio B2B benchmarks |
| Pipeline review effectiveness | Subjective, anecdotal | Data-driven coaching against gaps | Qualitative improvement |

### How to Measure Success

**Leading Indicators (Early signals, Week 1-4):**
- Qualification field completion rate >80% across all active opportunities
- Sales managers conducting qualification reviews in weekly 1:1s
- Number of opportunities disqualified or moved to nurture
- Rep feedback scores on training usefulness (target: 4+/5)

**Lagging Indicators (Proof of success, Month 2-6):**
- Win rate improvement of 10-15% within 90 days of full rollout
- Forecast accuracy improvement (quarter-over-quarter variance comparison)
- Reduction in average sales cycle length for closed-won deals
- Decrease in "no decision" as a loss reason
- Pipeline quality ratio improves quarter-over-quarter

---

## References

- [1] Forecastio - Sales Forecasting Accuracy Guide
- [2] Salesforce - BANT vs MEDDIC
- [3] Saleslion - 60% of Deals Lost to No Decision
- [4] Spiich - 29% Selling, 71% Admin
- [5] Spotlight.ai - Overcoming Resistance to Sales Framework Adoption
- [6] Landbase - 35 Lead Qualification Statistics
- [7] SPOTIO - 140+ Sales Statistics 2026
- [8] Oliv.ai - MEDDIC Sales Methodology Guide
