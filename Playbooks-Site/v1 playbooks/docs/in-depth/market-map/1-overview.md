---
displayed_sidebar: inDepthSidebar
title: "Market Map Overview"
sidebar_position: 1
---

# Market Map Overview

Market Map - Strategic Data Infrastructure & ICP Operationalization

## 1. Project Overview

### What is Market Map?

**Definition:** A strategic data infrastructure project that identifies, enriches, and tiers your Total Addressable Market (TAM) into actionable account segments with ICP fit scores, then operationalizes this intelligence directly in your CRM and outbound tools (Clay, ZoomInfo, Apollo). The output is a living, queryable market database that enables precise targeting across sales, marketing, and RevOps.

**What it is NOT:** Not a one-time ICP definition exercise (personas without data). Not a competitive analysis report. Not a CRM cleanup project (that's data hygiene). Not lead scoring implementation (that's a downstream project). Not territory planning (though it informs it).

**The core transformation:** Your ICP goes from a document sitting in a Google Doc to infrastructure loaded into your CRM, powering your dashboards, telling your team where to focus. This is what it looks like when ICP is infrastructure — it powers everything downstream.


### What Market Map Unlocks

| Before | After |
|--------|-------|
| "Who should I call?" | Filter T1 + Tier 1 personas |
| Manual lead routing | Automatic routing by tier |
| Arbitrary territories | Equitable valuation per rep |
| Enrich everything | Enrich only ICP |
| Signals lost in noise | T1 signals surfaced instantly |

**What you get:**
- All accounts from your TAM in CRM with propensity scoring
- All target personas at those accounts
- Account valuations for territory design
- Foundation for real-time signals on accounts that matter

**Signals become actionable once you have Market Map:**
- When a T1 account posts a job for a role your product supports — you see it
- When a T1 account's competitor just made a move — you see it
- When a T1 account hits a buying trigger — your rep knows about it that day

Market Map is the foundation for signals, ABM, and territory design.


### The Clay Use Case Pyramid

There are 4 primary use cases for Clay, and Market Map sits at the base — the foundation that everything else relies on.

**Why Market Map is the foundation:**

When you build your Market Map first, it becomes the infrastructure that all other Clay workflows reference:

- **Automated inbound flows** check the Market Map to see if a lead is at a T1 account before spending credits on enrichment
- **Automated outbound systems** reference the Market Map to know who to target
- **Signal workflows** (job changes, intent triggers, competitor moves) filter against the Market Map to prioritize T1 accounts

Without Market Map, you're burning credits in silos — re-enriching the same accounts across different workflows, enriching accounts that don't matter, with no single source of truth.

With Market Map, every other Clay use case becomes more efficient because it has a tiered, valued account foundation to build on.


### Business Outcomes

**Primary Outcomes:**
- Better territory design (equitable sales territories based on actual account value)
- Cleaner lead routing (near-instant routing based on fit score)
- Higher marketing conversion rates (segment audiences by tier for more focused targeting)
- Automated outbound at scale
- Smarter Clay credit and budget management (focus enrichment only on ICP accounts)
- Better targeting on intent signal data (cut down noise, prioritize hotter accounts more surgically)

**Secondary Outcomes:**
- Existing account expansion visibility (compare where accounts could be vs where they are - identifies upsell potential)
- Data visibility for bottoms-up and top-down capacity planning (validate quotas against actual TAM)
- Foundation for all Clay signals use-cases

**Who Benefits:** CRO, VP Sales, VP Marketing, Head of RevOps, RevOps Manager, Sales Leadership, Marketing Leadership


### Pain Points This Project Solves

Market Map is foundational infrastructure — it creates the data layer that enables multiple downstream capabilities. The specific pain it solves depends on what you're trying to unlock:

| Pain Point | What Market Map Enables |
|------------|------------------------|
| No systematic ICP definition | Enrichable, scoreable ICP criteria that automation can apply at scale |
| Enriching wrong accounts and wasting Clay credits | Focus enrichment only on ICP-qualified accounts |
| Time spent on wrong leads (not dead leads — wrong fit based on technographics, industry, etc.) | Tier-based prioritization so reps know who to call |
| Inability to do signals-based outreach | Foundation for all Clay signals use-cases — you need to know WHO to target before you can act on signals |
| Marketing struggling to segment audiences | Tier-based segmentation for focused targeting |
| Sales territories designed arbitrarily | Account valuation enables equitable territory design |


### The Data Behind the Problem

These pain points aren't theoretical. Research from the 2025 FullCast report analyzed 440,000 opportunities worth $43 billion and found:

- **Only 23% of pipeline actually fits ICP** — meaning 77% of the deals in pipeline are wrong fit
- **Wrong-fit deals are 8x harder to close** — sales cycles are longer, win rates are lower
- **77% of sellers missed quota in 2025** — even after companies cut quotas by 13%
- **63% of CROs admit they have little or no confidence in their own ICP definition**

The problem isn't that companies don't have an ICP — it's that the ICP isn't operationalized. It's not in the CRM. It's not powering automations. Sales and marketing can't actually use it.

**Market Map solves this.** It takes your ICP from a document sitting somewhere to infrastructure powering your systems.


### The Gold Miner Metaphor

*Use this metaphor when explaining the territory design benefit specifically.*

Imagine you have three experienced miners sent to mine gold from three different mountains. You assign one miner per mountain.

- **Miner 1** comes back with a couple of gold nuggets. You blame him for not mining hard enough.
- **Miner 2** comes back with a wheelbarrow full of gold. You praise him and send him back.
- **Miner 3** comes back with a train-load of gold. You promote him to President's Club.

But here's the question: **Why didn't you figure out how much gold was in each mountain FIRST?**

This is exactly what happens in sales territory design. Organizations assign reps to territories without knowing the actual value in each.

**Market Map solves this.** Before assigning territories, we:
1. Identify every account in your TAM
2. Valuate each account (estimate potential ARR)
3. Tier accounts by fit and potential value
4. THEN design territories with data on where the "gold" is


## 2. Scoping & Discovery

### Target Motion

Market Map is centered on SLG (Sales-Led Growth) B2B companies. PLG (Product-Led Growth) companies may have market mapping needs, but it would be closer to B2C market research - a fundamentally different approach.

**Growth Context:** Scaling outbound, hiring new reps and need fair territory allocation, need TAM visibility for funding rounds.


### Tools & Systems

**Primary Tools:**

**Clay** — Primary enrichment platform used for account/contact search, firmographic/technographic enrichment, ICP fit scoring, valuation calculation, CRM sync workflows.

**CRM (Salesforce or HubSpot)** — Where enriched accounts and contacts are loaded with tier, valuation, and fit score fields.

**Data Providers (varies by vertical):**
- Standard B2B: Apollo, Clearbit, ZoomInfo
- Nonprofits/Associations: Cause IQ (NTEE codes, board size, related entities)
- Financial Services: iBanknet (AUM, advisor count, branch locations)
- Healthcare: Definitive Healthcare
- Education: IPEDS data

**Required Tool Features & Access:**

**Clay:**
- Clay Searcher (find companies based on ICP criteria)
- Claygent (for custom enrichment prompts)
- CRM integration connector (Salesforce or HubSpot)
- Minimum 10k credits recommended for initial enrichment
- Waterfall enrichment
- Score Row feature (for calculations without using credits)

**CRM (Salesforce/HubSpot):**
- Admin access (create fields, pull reports, export data)
- API enabled for Clay connection
- Permission to create custom fields

**Data Providers:**
- Active subscriptions (Apollo, Clearbit, Cause IQ, iBanknet - depending on vertical)
- Connected to Clay with valid API credentials


### Stakeholders & Roles

**CRO / VP Sales (Executive Sponsor & Decision Maker)**
- Required for ICP workshop
- Approves final ICP criteria, valuation methodology, and territory design
- Participates in delivery meeting

**RevOps Manager (Technical Owner & Day-to-Day Partner)**
- Required for all 5 meetings
- Provides CRM access and exports
- Executes CRM field creation
- Validates data loads
- Owns ongoing maintenance post-project

**Sales Leadership (Input Provider)**
- Required for ICP workshop and Persona workshop
- Validates criteria match field reality
- Provides customer insights
- Tests territory assignments

**Marketing Leadership (Input Provider)**
- Required for Persona workshop
- Validates persona pain points / goals for campaign alignment
- Confirms segmentation strategy

**Technical Owners:**

**RevOps Manager (Primary Technical Owner)**
- Provides CRM admin access
- Creates custom fields
- Manages Clay integration
- Executes data loads
- Troubleshoots sync issues
- Owns ongoing Clay table maintenance

**CRM Administrator (If Separate from RevOps)**
- Grants admin access
- Approves custom field creation
- Validates CRM governance / field architecture requirements

**IT / Security (If Enterprise Org)**
- Approves Clay integration and API access to CRM
- Grants vendor approval for new data providers


### Scoping Factors

**1. Company Type (Vertical vs Horizontal)**
- Vertical companies → Pull full TAM, easier to define clear ICP boundaries
- Horizontal companies → T1 only approach, need very restrictive criteria

**2. TAM Size**
- &lt;100k accounts → Full TAM pull feasible
- 500k+ accounts → Tiered approach (T1/T2/T3)
- Millions of accounts → T1 only mandatory

**3. Sales Team Size**
- 1-3 reps → T1 only (500-2k accounts)
- 5-10 reps → T1/T2 pull (2,500-10k accounts)
- 10+ reps → Full TAM pull viable if vertical

**4. Company Stage & Historical Data**
- Early stage (&lt;50 customers) → No Historical Data approach
- Series A/B (100-500 customers) → Historical Data Heavy approach
- Series C+ (500+ customers) → Robust data analysis

**5. CRM Data Quality**
- Clean CRM → Standard approach
- Messy CRM → CRM Cleanup First approach
- No CRM → Net-new only

**6. Data Provider Coverage**
- Standard B2B SaaS → Apollo, Clearbit
- Nonprofits/Associations → Cause IQ required
- Financial Services → iBanknet required
- Healthcare → Definitive Healthcare
- Education → IPEDS data

**7. Product Pricing Model**
- Per-seat → Employee headcount coefficient
- Usage-based → Revenue coefficient
- Enterprise deals → Like accounts comparison
- Tiered packages → Combination approach

**8. Renewal/Churn Rates by Segment**
- If certain verticals have significantly higher churn, factor this into ICP scoring
- Deprioritize verticals where you get displaced frequently, even if they close initially

**9. Existing GTM Motion**
- Outbound-heavy → Full contact enrichment (3-5 contacts per T1 account)
- Inbound-led → Lighter contact enrichment (1-2 contacts per account)
- PLG motion → Incorporate product signals into fit scoring

**10. Territory Design Urgency**
- Hiring new reps soon → Need precise territory valuation
- Existing territories stable → Can phase rollout

**11. Clay Credit Budget**
- Unlimited credits → Enrich aggressively
- Limited credits (5k-10k) → T1 only approach

**12. Technical Complexity of ICP Criteria**
- Simple firmographics → Fast build (1-2 days)
- Complex custom criteria → Slower build (3-5 days)

**13. Stakeholder Alignment Level**
- Strong ICP alignment → 3 meeting approach
- Misaligned stakeholders → 5 meeting approach with refinement call

**14. Speed to Market Need**
- Urgent (launching campaign next month) → T1 only, 3-week sprint
- Strategic (building foundation for next year) → Full TAM, 6-week build


### Multiple Approaches

**Approach 1: Full TAM Pull (Vertical Company with Narrow TAM)**
- Criteria: Company targets specific vertical (e.g., nonprofits with 10+ board members, financial services with $500M+ AUM), TAM is &lt;100k accounts, sales team of 5+ reps
- Execution: Pull entire TAM into Clay → Enrich all → Tier all → Load all into CRM

**Approach 2: Tiered Pull Only (Horizontal or Large TAM)**
- Criteria: Horizontal product (any company could be customer), TAM is 500k+ accounts, smaller sales team (1-3 reps)
- Execution: Define T1/T2/T3 criteria → Pull only T1 initially (50-10k accounts per rep max) → Enrich → Load → Expand to T2/T3 later

**Approach 3: T1 Only (Minimum Viable Market Map)**
- Criteria: Small team, limited budget, want quick wins, clear T1 definition
- Execution: Define T1 criteria very tightly → Pull 50-1k accounts → Enrich → Load → Validate over 1 sales cycle → Expand later

**Approach 4: CRM Cleanup First**
- Criteria: CRM has garbage data, domains not normalized, duplicate accounts, tiering exists but wrong
- Execution: Audit current CRM → Export accounts → Clean domains in Clay → Match Clay search to CRM → Enrich only gaps → Reload with clean data

**Approach 5: Historical Data Heavy**
- Criteria: Client has 200+ closed won/lost, robust firmographic data in CRM, mature sales org
- Execution: Start with correlation analysis on closed won/lost → Let data inform ICP criteria → Validate hypothesis with stakeholder interviews → Build ICP matrix from data insights

**Approach 6: No Historical Data**
- Criteria: Early stage (&lt;50 customers), limited closed lost tracking, sparse CRM data
- Execution: Rely heavily on stakeholder interviews, use Clay Searcher for validation in real-time during workshops, emphasize refinement cycle


### Discovery Questions

**Business Context:**
- How many sales reps do you have? (informs target list size: 50-10k accounts per rep for T1)
- Do you have historical closed won/closed lost data? (need 100+ customers or 200+ total closed won/lost for correlation analysis)
- What's your current sales cycle length? (informs refinement timeline - typically 30-90 days)
- Are you vertical or horizontal? (horizontal = don't pull full TAM, focus on tiers only)

**ICP Clarity:**
- Do you already have ICP documentation? (need to redo it "the Clay Way" even if exists)
- What geographies do you primarily do business in?
- What industries or verticals are you targeting?
- Do you have any technographic requirements? (e.g., must use Salesforce, Office365)

**CRM State:**
- What CRM are you using? (Salesforce, HubSpot, etc)
- How clean is your CRM data? (especially domains - need normalized domains for matching)
- Do you already have accounts loaded? Are they tiered?
- Do you have custom fields for ICP criteria already created?

**Data & Tools:**
- Do you have Clay already? What's your credit situation?
- What data providers do you currently use?
- Have you already done any correlation analysis on your historical data?

**Expectations:**
- What would success look like for this project?
- How quickly do you need this completed?
- Who are the stakeholders who need to be involved?

**Approach Decision Questions:**

| Question | Answer → Approach |
|----------|-------------------|
| How many sales reps do you have? | 1-3 = T1 only, 5-10 = Tiered, 10+ = Full TAM if vertical |
| What's your total addressable market size? | &lt;100k = Full TAM, 500k+ = Tiered, Millions = T1 only |
| Are you vertical or horizontal? | Vertical = Full TAM feasible, Horizontal = T1 only |
| How many customers do you have? | &lt;50 = No Historical Data approach, 100-500 = Historical Data Heavy, 500+ = Full data analysis |
| How clean is your CRM? | Clean = Standard, Messy = CRM Cleanup First, None = Net-new only |
| What's your Clay credit budget? | Unlimited = Enrich aggressively, Limited = T1 only |
| How urgent is this? | Launching campaign next month = T1 sprint, Building foundation = Full TAM |
| Is sales/marketing aligned on ICP? | Aligned = 3 meetings, Misaligned = 5 meetings with refinement |


### Meeting Cadence

5+ meetings standard (can be reduced to 3-4 for simpler projects, may need more for complex alignment)

| Meeting | Duration | Purpose |
|---------|----------|---------|
| Meeting 1 | 1 hour | Kickoff & Discovery |
| Meeting 2 | 2 hours | ICP Workshop |
| Meeting 3 | 2 hours | Persona Workshop |
| Meeting 4+ | 1 hour | ICP Data Review Call(s) - repeating milestone until alignment on tier distribution |
| Final | 1.5 hours | Delivery & Training |

**Note on ICP Review Calls:** After pulling initial data into Clay, present tier distribution and valuation totals to stakeholders. May require multiple iterations (e.g., "Tier 1 is only $60M but Tier 3 is $1.9B - too restrictive, let's adjust"). Repeat until alignment before moving to delivery.

**Note on Persona Workshop:** More flexible than ICP work. Account lists are stable for 6-12 months, but people move constantly. Persona enrichment is often a fast-follow or ongoing engagement rather than rigid milestone.
