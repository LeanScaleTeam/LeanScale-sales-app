# Market Map Playbook

## 1. Project Overview

### What is Market Map?

**Definition:** A strategic data infrastructure project that identifies, enriches, and tiers your Total Addressable Market (TAM) into actionable account segments with ICP fit scores, then operationalizes this intelligence directly in your CRM and outbound tools (Clay, ZoomInfo, Apollo). The output is a living, queryable market database that enables precise targeting across sales, marketing, and RevOps.

**What it is NOT:** Not a one-time ICP definition exercise (personas without data). Not a competitive analysis report. Not a CRM cleanup project (that's data hygiene). Not lead scoring implementation (that's a downstream project). Not territory planning (though it informs it).

**The core transformation:** Your ICP goes from a document sitting in a Google Doc to infrastructure loaded into your CRM, powering your dashboards, telling your team where to focus. This is what it looks like when ICP is infrastructure — it powers everything downstream.

---

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

---

### The Clay Use Case Pyramid

There are 4 primary use cases for Clay, and Market Map sits at the base — the foundation that everything else relies on.

**Why Market Map is the foundation:**

When you build your Market Map first, it becomes the infrastructure that all other Clay workflows reference:

- **Automated inbound flows** check the Market Map to see if a lead is at a T1 account before spending credits on enrichment
- **Automated outbound systems** reference the Market Map to know who to target
- **Signal workflows** (job changes, intent triggers, competitor moves) filter against the Market Map to prioritize T1 accounts

Without Market Map, you're burning credits in silos — re-enriching the same accounts across different workflows, enriching accounts that don't matter, with no single source of truth.

With Market Map, every other Clay use case becomes more efficient because it has a tiered, valued account foundation to build on.

---

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

---

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

---

### The Data Behind the Problem

These pain points aren't theoretical. Research from the 2025 FullCast report analyzed 440,000 opportunities worth $43 billion and found:

- **Only 23% of pipeline actually fits ICP** — meaning 77% of the deals in pipeline are wrong fit
- **Wrong-fit deals are 8x harder to close** — sales cycles are longer, win rates are lower
- **77% of sellers missed quota in 2025** — even after companies cut quotas by 13%
- **63% of CROs admit they have little or no confidence in their own ICP definition**

The problem isn't that companies don't have an ICP — it's that the ICP isn't operationalized. It's not in the CRM. It's not powering automations. Sales and marketing can't actually use it.

**Market Map solves this.** It takes your ICP from a document sitting somewhere to infrastructure powering your systems.

---

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

---

## 2. Scoping & Discovery

### Target Motion

Market Map is centered on SLG (Sales-Led Growth) B2B companies. PLG (Product-Led Growth) companies may have market mapping needs, but it would be closer to B2C market research - a fundamentally different approach.

**Growth Context:** Scaling outbound, hiring new reps and need fair territory allocation, need TAM visibility for funding rounds.

---

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

---

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

---

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

---

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

---

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

---

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

---

## 3. Implementation Procedure

### Important Note on Approaches

The 6-part step-by-step process (Define Enrichable ICP → Build Master Clay Tables → Push Enriched Accounts into CRM → Reporting → Personas → Enablement) remains the same across all 6 approaches.

The differences are in scope and depth, not in the fundamental steps:
- **Approach 1 (Full TAM):** Execute all 6 parts completely, pull entire TAM in Part 2 Step 2
- **Approach 2 (Tiered Pull):** Execute all 6 parts, but Part 2 Step 2 only pulls T1/T2 initially, expand to T3 later
- **Approach 3 (T1 Only):** Execute all 6 parts with tighter criteria in Part 1 Step 3, Part 2 Step 2 pulls minimal accounts (50-1k)
- **Approach 4 (CRM Cleanup First):** Add domain cleanup substeps to Part 2 Step 2 before enrichment
- **Approach 5 (Historical Data Heavy):** Part 1 Step 1 correlation analysis is mandatory and drives Part 1 Step 3 ICP criteria
- **Approach 6 (No Historical Data):** Skip Part 1 Step 1 correlation analysis, rely more heavily on Part 1 Step 3 Clay Searcher validation

---

### Part 1: Define Enrichable ICP

#### Step 1: Define ICP Vectors (via Interviews & CRM Data)

**Step Overview:** In this step, we are identifying the 5-10 criteria that define your Ideal Customers. This comes from stakeholder interviews and CRM data analysis. End state: a hypothesis of ICP vectors that feed into the fit scoring in Step 3.

**What are ICP Vectors?**

The columns/criteria — both standard and custom — that define your ideal customers and allow systems to create a "fit score."

Vectors are custom per company. Some are standard across companies (geography, company size, firmographics), but many will be unique.

**Common Vector Categories:**
- **Geography:** What region do they primarily do business in?
- **Firmographic:** What type of business are they and how big/complex is the organization?
- **Technographic:** What technologies do they use or are likely to use?
- **Problem:** What problem are they likely experiencing?
- **Sponsors:** Who is the person in the organization accountable for this problem?
- **Champions:** Who feels the pain of the problem in the organization?
- **Revenue / Employee Count:** Company size indicators
- **GTM Motion:** B2B vs B2C, sales-led vs product-led
- **Industry Prioritization:** Where should we focus best efforts?

**ICP Vector Examples:**

*Example 1: B2B SaaS Company*
- Geography: North America
- Company Size: 50-500 employees (mid-market sweet spot)
- Tech Stack: Salesforce or HubSpot CRM
- GTM Motion: Outbound-led B2B sales
- Problem Indicator: Recently hired VP Sales or RevOps
- Funding Stage: Series A through Series C

*Example 2: Cybersecurity Company*
- Geography: North America + EMEA
- Industry: Financial services, Healthcare, Manufacturing
- Employee Count: 500-5,000 (needs network complexity, not too large for enterprise competitors)
- Technographic: Uses legacy NAC or no NAC solution
- **Custom Vector:** # of physical locations (more locations = more network complexity = better fit)
- Compliance requirements: SOC2, HIPAA, or PCI-DSS required

*Example 3: Nonprofit Software Company*
- Geography: US and Canada (data provider coverage)
- Organization Type: 501(c)(3) nonprofits only
- Annual Revenue: $5M-$100M operating budget
- **Custom Vector:** Number of related entities (orgs with 2+ related entities need consolidation software)
- **Custom Vector:** National vs regional scope (national orgs have more complex needs)

##### 4 Methods to Discover Your Vectors:

**Method 1: Stakeholder Interviews**

*Who to Interview:* CRO, RevOps Manager, Sales leadership, Customer Success, Product

*Questions to Ask:*
1. Geographic: What region do they primarily do business in?
2. Firmographic: What type of business are they and how big/complex is the organization?
3. Technographic: What technologies do they use or are likely to use?
4. Problem: What problem are they likely experiencing?
5. Sponsors: Who is the person in the organization accountable for this problem?
6. Champions: Who feels the pain of the problem in the organization?
7. Industry Prioritization: Where should we focus your best efforts the most?

**Method 2: Historical Data Analysis (CRM)**

*Note:* If you don't have good closed won data or a solid universe, acknowledge that limitation — you may not be able to use this method effectively.

*Prerequisites:* Need at least 100 closed won customers OR 200 total closed (won + lost) — typically Series A or later.

*Correlation Analysis Process:*
1. Pull all Closed Lost deals
2. Pull all Closed Won deals
3. Enrich missing firmographic data in Clay before analysis
4. Calculate win rate, average deal size, and sales cycle length by segment
5. Identify which segments win at significantly higher rates

*Negative Data Analysis:*
Compare Closed Lost vs Closed Won across segments. Don't just analyze winners — analyze losers:
- High-loss segments → Deprioritize or exclude from T1
- High-churn segments → Deprioritize even if initial win rate is good
- Displacement patterns (lost to specific competitor) → Factor into scoring

**Method 3: Clay Searcher (for Brainstorm)**

Use Clay Searcher to validate and brainstorm vectors in real-time. Test whether proposed vectors are actually enrichable and see how the market segments.

**Method 4: AI Deep Research**

Use AI tools to research industry patterns, competitor ICPs, and market segmentation approaches to develop initial hypotheses about what vectors might matter.

---

#### Step 2: Define Valuation Methodology

**Step Overview:** Determine how much each potential account is worth to your business. This is the most difficult part and requires judgment calls. By leveraging firmographic data and analyzing your existing customer base, you can make reasonable assumptions about potential value. End state: a valuation formula that lets you group accounts into equitable territories for your reps.

**Why This Matters:**

Once we figure out how much accounts are worth, we group them into territories and ensure fair, equitable distribution across reps. Without valuation, you can't prove territory balance.

**Important Note:** There is no one-size-fits-all method. Use these approaches as inspiration, not rigid rules.

##### 5 Approaches to Value a Potential Account

**Approach 1: Revenue Coefficient (Firmographic Data)**

Create a coefficient related to the potential customer's annual revenue. Compare their company revenue to potential spend with you.

Works well for license-based or usage-based products. Create a "revenue coefficient" (e.g., every $X of company revenue = $Y potential spend with us).

**Approach 2: Employee Headcount Coefficient (Firmographic Data)**

Create a coefficient related to the potential customer's employee headcount. Especially useful for per-seat or per-user pricing models (HR tech, SaaS).

Multiply their headcount by your seat price to estimate potential account worth. Easy to source, but not always available.

**Approach 3: Product-Specific Coefficient**

Create a coefficient based on specific volumes associated with your product. Tie value to product-relevant signals (e.g., web traffic for cybersecurity tools). Go beyond revenue or employee count.

Data sources exist for traffic, online presence, and other product-related signals. Not always possible to find a product-specific coefficient, but if you can, it's one of the best ones.

*Example:* For a company selling to venture-backed startups, use funding rounds as a valuation proxy — Series A, B, C = different needs and engagement levels. Funding stage and amount raised directly correlate with potential value.

**Approach 4: Like Accounts Comparison**

Segment and profile your existing customers, then match potential customers to similar closed accounts. Map prospects against your existing customer base using firmographic, geographic, and industry profiles.

This is a directional indicator of potential value. Often undervalues accounts since penetration of accounts you've already closed is rarely complete — but useful if you can't find any other coefficient.

**Approach 5: Combination Approach**

Combine multiple valuation methods to triangulate the account's potential. Take averages or medians across methodologies for a more reliable valuation.

##### Additional Valuation Considerations

**White Space Analysis (Existing Customers)**

For existing customers, compare where accounts could be (based on comparable companies) vs where they are currently. This identifies upsell and expansion potential.

You need to know your valuation methodology so you can compare your existing contract value with where you think they should be — that difference is how much upside you still have.

*Example:* If your TAM valuation data says two similar-sized retail companies are roughly the same size and both are customers of yours, but one is paying a fifth of the contract of the other — that tells you there's upsell or expansion potential within that account.

This is critical for companies with land-and-expand or usage-based models. Understanding what features, new products, or new offerings can maximize existing business becomes equally important as net-new acquisition.

**Extrapolation Method (Net-New Prospects)**

Segment closed deals by company size (headcount/revenue), calculate average deal size per segment, apply those averages to all prospects in each segment to estimate total TAM value.

---

#### Step 3: Define ICP Fit Criteria / Score

- Facilitate ICP workshop using exploration methods (stakeholder interviews, historical data, Clay Searcher validation, AI research)
- Refine ICP criteria using Clay Searcher real-time validation
- Define ICP fit scoring criteria (assign point values to each criterion)
- Decide what ICP level to pull (Full TAM vs T1/T2/T3 vs T1 only)

**Building the Fit Score Rubric:**

T1 doesn't mean you meet ALL criteria — it means your total score crosses a threshold. The point system handles nuance.

1. **Weight each criterion** (e.g., Geography 20%, Company Size 25%, Industry 20%, Funding 15%, Tech Stack 20%)
2. **Assign points per value** (e.g., US-Major Metro = 20 pts, US-Other = 15 pts, Canada = 10 pts)
3. **Set tier thresholds** (e.g., T1 = 75-100 pts, T2 = 50-74 pts, T3 = 25-49 pts)
4. **Test against known accounts** — score 20-30 existing customers, adjust until model matches reality

*In Clay:* Use Score Row (free) for simple math, or AI column with prompt: "Calculate ICP fit score 0-100 using this rubric: [paste rubric]"

---

#### Step 4: Define List Scope

**Step Overview:** Decide how many accounts to actually pull into the system. Pulling the entire world (TAM) is often unnecessary and expensive.

##### 3 Levels of List Pulling:

**Level 1: Full TAM**
Pull every possible account that matches criteria.
*Use when:* The market is niche enough that the total universe is manageable (&lt;50k accounts).
*Avoid when:* Selling horizontal products where "anyone with a support team" is a prospect. The TAM is too large to be useful.

**Level 2: All Tier List (T1/T2/T3)**
Pull all accounts that fall into a defined tier, but exclude the rest of the TAM.
*Use when:* You have specific enough T1/T2/T3 definitions to filter out noise.

**Level 3: T1 Only (Minimum)**
Pull only the "slam dunk" accounts.
*Use when:* You are resource-constrained or testing a new market.

**List Size Guidelines per Rep:**
- **Sweet Spot:** 50 - 2,000 accounts per rep
- **Warning Zone:** >2,000 accounts per rep. Hard to personalize or conceptualize the territory.
- **Red Flag:** >10,000 accounts per rep. This suggests the criteria are too loose. T1 accounts should be perfect fits; if there are 10k of them per rep, they aren't "Best Fits," they are just "Fits."

---

#### Step 5: Create Ideal Clay ICP Matrix

- Compile ICP matrix with all criteria, valuation ranges, fit scores into tiered structure (T1/T2/T3)
- Facilitate Persona workshop (define persona criteria: titles, geography, seniority, experience, pain points, goals)
- Validate persona criteria against current contacts in CRM
- Define persona fit scoring criteria
- Create Persona matrix with tiered structure (Tier 1/2/3 Personas)
- Audit current contact universe in CRM

---

### Part 2: Build Master Clay Tables

#### Step 1: Accounts Table + Criteria Columns

- Set up Clay account table
- Add criteria columns for all ICP attributes (firmographics, technographics, custom criteria)
- Add valuation column
- Add ICP fit score column
- Add tier assignment column
- **Multiple Tables Option:** Consider separate tables by signal type (M&A activity, security breaches, job postings, etc.) for flexibility to customize triggers per tier rather than one master table

---

#### Step 2: Pull Accounts (Technical Execution)

**Step Overview:** Gather the raw list of accounts from creating a "Universe" of companies to enrich.

##### Method 1: Clay Searcher (Recommended for Discovery)

Use Clay's internal database to find companies.

*Why:* It allows free validation ("Identify ICP step"). You can preview results, see total counts, and hone criteria (e.g., "Exclude companies with &lt;10 employees") without spending credits.

*Process:*
1. Build search query in Clay
2. Validate list size (aiming for T1 target)
3. Import to table

##### Method 2: Import from CRM

Pull existing accounts from Salesforce or HubSpot into Clay for enrichment.

*Prerequisite:* Domain hygiene. If CRM domains are messy (missing, non-standard), clean them in the CRM first or use a temporary Clay table to normalize them before the master run.

*Salesforce:* Use a List View.
*HubSpot:* Use a Static List.

**Technical Note: Handling Large Lists**
Clay reports often have a 2k record limit per import.
- **If >2k records:** Split into multiple source reports or use "Leads" object if source is Salesforce.
- **Workflow:** Create a "Master Account Table" that acts as the single source of truth.

##### Method 3: Hybrid (Waterfall)

1. Import T1 accounts from CRM
2. Create a "Universe" table in Clay
3. Use Clay Searcher to find *net-new* accounts not in CRM
4. Deduplicate against the CRM import

---

#### Step 3: Enrich Criteria (Using AI)

- Enrich missing firmographic data using Clay data providers (Apollo, Clearbit, Cause IQ, iBanknet)
- For custom ICP criteria, use Claygent enrichment with custom prompts
- **Custom signal examples:**
  - "Do they have a dedicated risk team somewhere in their org chart?" (more likely to buy than companies without a risk team)
  - EV incentives, tax credits, and subsidies as buying signals for relevant industries
  - Digital footprint scoring for rural/urban differentiation
  - Industry-specific data providers for niche verticals (the more niche the industry, the more specialized data providers needed)
- **Implement valuation methodology:**
  - *Option A (Simple):* Use Clay's "Score Row" feature. Assign points or values based on firmographic columns (e.g., `IF(Employees > 1000, 100000, 50000)`)
  - *Option B (Complex):* Use Claygent/AI column for advanced logic. Prompt: "Based on these 5 columns, calculate the estimated ARR potential using this formula..."
  - *Technical Note:* Ensure the output format matches the CRM field (Currency vs Number)
- Calculate ICP fit score using "Score Row" feature
- Add "only run if" conditions to optimize Clay credits (e.g., `#totalfound equals 0`, `If CRM industry is blank`)
- Set up Clay contact table and pull accounts from CRM
- Use Clay's People Search to find contacts at each account based on persona criteria
- Enrich contact data using waterfall enrichment
- Calculate persona fit score
- Build waterfall logic to prevent duplicate contacts:
  1. Lookup by Account ID + Email
  2. If not found, lookup by Account ID + LinkedIn URL
  3. Only create contact if both return 0 results

---

#### Step 4: Refine Ideal Matrix (Realistic)

- Review initial data distribution by tier
- Validate valuation accuracy
- Adjust ICP/Persona criteria if patterns don't match expectations
- Update Clay tables with refined criteria

---

### Part 3: Push Enriched Accounts into CRM

#### Step 1: Create CRM Fields

- Create custom fields for accounts (Account Tier, Account Valuation, ICP Fit Score, plus optional ICP-specific fields)
- Create custom fields for contacts (Persona Tier, Persona Fit Score, LinkedIn URL, Years of Experience)
- Validate picklist values align between Clay outputs and CRM
- **Granular Tier Fields (Advanced):** For complex ICPs, create sub-tier fields (e.g., Tier CCIE, Tier CISO, Tier Geographic, Tier Industry, Tier Auxiliary Titles) that roll up into master ICP Tier field via formula/flow

---

#### Step 2: Map Fields to Clay

- Set up Clay CRM integration (connect to Salesforce/HubSpot)
- Build CRM update workflow for existing accounts (map Clay columns to CRM fields)
- Build CRM create workflow for new accounts: Add enrichment → Create object → Object type: Company → Map fields (domain, name, tier, valuation)
- Build CRM update workflow for existing contacts
- Build CRM create workflow for new contacts
- **Data override handling:** Decide update behavior per field:
  - Overwrite all: Always update with Clay data
  - Overwrite if blank: Only update empty fields, preserve existing data
  - Never overwrite: Keep CRM data, only create new records
- **Prevent override checkbox:** For franchise/dealership scenarios, add checkbox field that blocks systematic updates when manual data is cleaner (e.g., dealership shouldn't get corporate data)
- **Ongoing CRM Hygiene:**
  - Before pushing, check for "dirty" data (e.g., non-standard state codes, formatting issues)
  - Use an AI column in Clay to normalize data to match CRM picklist values (e.g., "Transform 'Calif.' to 'CA'")
  - *Trigger:* Only run updates if data is missing or different

---

#### Step 3: Push Clay Data into CRM

- Test CRM update workflow on 10-20 sample accounts
- Execute full CRM update for all accounts found in CRM
- Test CRM create workflow on 10-20 sample accounts
- Execute full CRM create for all new accounts
- Test CRM workflows for contacts (10-20 samples)
- Execute full CRM update/create for all contacts
- Run CRM validation reports (accounts and contacts by tier, valuation distribution, persona coverage)

---

### Part 4: Reporting

**Key insight:** Reporting operationalizes the data. Having tiered accounts in CRM is useless without reports that make the data actionable. Three levels of reporting create a pyramid from executive insight down to individual rep usage.

**Critical Validation Point:** This is where leadership validates the model. Before investing in persona enrichment or enablement, use reporting to sanity-check the tiering:
- Pull a sample of T1 accounts — do they look right?
- Show territory valuation distribution — is it equitable?
- Review the tier breakdown — does the distribution make sense?

If something looks off (T1 accounts are all tiny companies, or one territory has 10x the value of another), catch it here before proceeding. Reporting serves as both the operational layer AND the validation checkpoint.

---

#### Step 1: Create Executive Business Insight Reports

- Closed-won / lost by tier (are we closing T1 or spending time on T3?)
- Conversion rates by tier (is tiering predictive of outcomes?)
- Revenue by tier (growth model validation)
- Win rates across segments (tiering efficacy)

---

#### Step 2: Create Finger-on-the-Pulse Distribution Reports

- Territory valuation by rep (prove territories are fair based on account value)
- Account distribution by tier (T1/T2/T3 counts per territory)
- Persona coverage by tier (enough Tier 1 Personas at T1 accounts?)
- Which reps have which accounts, are territories balanced?

---

#### Step 3: Create Individual Rep Cockpit/Dashboard

- **Market Map Dashboard:** Segment all core metrics (ARR, bookings, pipeline created, conversion rates) by tier
- **Signals Dashboard (optional):** Shows T1 accounts with active buying signals (e.g., peer events, new locations, hiring)
  - Peer signals often more valuable than direct signals: "Your peers just got breached" creates urgency without defensiveness
  - Combine tier + ABM grade for prioritization (e.g., Tier 1 + A1 scoring = "1A1" accounts as best-of-best)
- **ABM Dashboard (optional):** Combination of tier + stakeholder profile + account-level engagement = scoring grade

---

### Part 5: Personas

**Key insight:** You reach out to PEOPLE, not accounts. Personas are the bridge from theoretical ICP work to actually closing business. The ICP TAM might be solid, signals might be good, but you still need to identify the right people to contact.

**Why Personas Comes After Reporting:**

Dashboards work at the **account level**. Activity automations in most CRMs roll up from contact records to accounts — calls logged, emails sent, meetings booked all bubble up to the account record. So your executive reports, distribution reports, and rep dashboards can function with just tiered accounts.

After Part 4, leadership can **see** the data. They can validate tiering, check territory balance, confirm the model makes sense. You can even use reporting to drive your persona enrichment priorities — identify which T1 accounts are missing contacts and target those first.

But reps can't actually **get to work** yet.

You can't multi-thread with just accounts. Outbound requires people to contact. Sequences need email addresses. SDRs need names and titles to call. Without personas loaded, reps have beautiful dashboards showing T1 accounts they can't actually reach.

**Part 5 (Personas) is the "unlock" moment** — the point where Market Map goes from strategic visibility to tactical execution. Once personas are loaded:
- SDRs can filter for T1 accounts + Tier 1 personas and start sequences
- AEs can multi-thread into their top accounts
- Lead routing can match inbound contacts to tiered accounts

**Why Account Work Enables Persona Enrichment:**

All the work we did on accounts in Parts 1-4 wasn't just about dashboards and visibility — it directly enables Part 5.

The tiered accounts become the **input** for persona enrichment. We're not enriching contacts blindly across your entire TAM. We're finding people at the T1 accounts we already identified.

Without the account work, you'd be asking "find me VPs of Sales" across millions of companies — burning Clay credits with no prioritization. With the account work, you're asking "find me VPs of Sales at these 500 T1 accounts" — targeted, efficient, and actionable.

The previous work tells you WHERE to look. Personas tell you WHO to contact once you get there.

---

#### Step 1: Define Persona Vectors (via Interviews & CRM Data)

**Step Overview:** In this step, we are identifying the 5-7 criteria that define your Ideal Personas. This comes from stakeholder interviews and CRM contact analysis. End state: a hypothesis of Persona vectors that feed into the fit scoring in Step 3.

**What are Persona Vectors?**

The columns/criteria that define your ideal contacts and allow systems to create a "persona fit score."

Just like ICP vectors, some are standard across companies (title, seniority) but many will be unique.

**Common Persona Vector Categories:**
- **Title:** What job titles do your buyers hold?
- **Seniority:** What level in the org chart has authority?
- **Department/Function:** Which departments own this problem?
- **Geography:** What regions can you sell into?
- **Tenure in Role:** How long have they been in this position?
- **Buying Authority:** Economic buyer vs influencer vs user?

**The Enrichable Persona Concept**

Just like accounts have the distinction between Theoretical ICP and Enrichable ICP, personas have the same challenge.

**Enrichable Persona Criteria** (data providers can answer):
- Title (LinkedIn, Apollo, ZoomInfo)
- Seniority level (derived from title normalization)
- Geography/Location (LinkedIn)
- Years of experience (LinkedIn)
- Current company tenure (LinkedIn)
- Department (LinkedIn, inferred from title)

**Theoretical Persona Criteria** (can't be enriched directly):
- Pain points they're experiencing
- Goals/aspirations
- Buying authority level
- Budget ownership
- Personality/communication style

**AI-Enabled Enrichable** (Claygent can research):
- Have they posted about relevant topics on LinkedIn?
- Have they spoken at conferences?
- Are they new in role (&lt;1 year)?
- Are they hiring for roles related to your solution?

##### 3 Methods to Discover Your Persona Vectors:

**Method 1: Stakeholder Interviews**

*Who to Interview:* AEs who close deals, SDRs who book meetings, Customer Success

*Questions to Ask:*
1. Who do you typically talk to first at an account?
2. Who signs the contract vs who champions internally?
3. What titles convert from meeting to opportunity at highest rates?
4. What seniority level has budget authority?
5. What do your best contacts have in common?
6. What titles should we avoid (tire kickers, no authority)?

**Method 2: CRM Contact Analysis**

*Prerequisites:* Need contacts associated with closed won opportunities

*Analysis Process:*
1. Pull all contacts on closed won opportunities
2. Identify primary contact (decision maker role)
3. Analyze title patterns - which titles appear most on won deals?
4. Analyze seniority patterns
5. Look for negative patterns - titles on lost deals but not won

**Method 3: Clay People Search Validation**

Use Clay's People Search to test whether your persona criteria actually find people:
1. Pick 10 T1 accounts
2. Search for your hypothesized Tier 1 persona titles
3. Check: Do these people exist at these accounts?
4. If coverage is low (&lt;50%), broaden title criteria
5. If coverage is too high (50+ per account), tighten criteria

---

#### Step 2: Assign Point Values to Persona Vectors

**Step Overview:** Define the relative importance of each persona vector by assigning point values. Higher points = more important to your sales motion.

**Example Persona Scoring Rubric:**

| Vector | Tier 1 Value | Tier 2 Value | Tier 3 Value | Max Points |
|--------|--------------|--------------|--------------|------------|
| Title Match | Exact match (30) | Adjacent title (15) | Broad match (5) | 30 |
| Seniority | C-Level/VP (25) | Director (15) | Manager (5) | 25 |
| Department | Core buyer dept (20) | Adjacent dept (10) | Peripheral (5) | 20 |
| Geography | Primary market (15) | Secondary (10) | Tertiary (5) | 15 |
| Tenure in Role | New &lt;1yr (10) | 1-3 years (7) | 3+ years (3) | 10 |

**Max Possible Score: 100 points**

**Why "New in Role" Gets Points:**

Research shows new buyers spend 70% of their budget in the first 100 days. They're in exploration mode, looking to make an impact, and more open to new solutions. This is a validated B2B buying signal.

**Weighting Guidance:**
- Title Match gets highest weight (30) because wrong title = wrong person
- Seniority gets second highest (25) because it correlates with authority
- Department (20) ensures you're talking to the right function
- Geography (15) matters for sales coverage
- Tenure (10) is a signal, not a requirement

---

#### Step 3: Define Persona Tier Thresholds

**Step Overview:** Set the point thresholds that determine Tier 1 vs Tier 2 vs Tier 3 personas.

**Example Threshold Structure:**

| Persona Tier | Point Range | Description |
|--------------|-------------|-------------|
| Tier 1 | 70-100 | Perfect fit - exact title, right seniority, right dept |
| Tier 2 | 40-69 | Good fit - adjacent title or slightly off on one vector |
| Tier 3 | &lt;40 | Weak fit - multiple vectors misaligned |

**Threshold Validation:**

Same as ICP, you validate by checking distribution:
- If 80% of contacts are Tier 1, thresholds are too loose
- If only 5% are Tier 1, thresholds are too tight
- Sweet spot: 15-25% Tier 1, 40-50% Tier 2, rest Tier 3

**Coverage Targets by Account Tier:**

| Account Tier | Min Tier 1 Personas | Min Tier 2 Personas | Total Contacts |
|--------------|---------------------|---------------------|----------------|
| T1 Account | 2-3 | 3-5 | 5-8 |
| T2 Account | 1-2 | 2-3 | 3-5 |
| T3 Account | 0-1 | 1-2 | 1-3 |

**Why Multiple Contacts Matter:**
- Multi-threading: Don't rely on single champion
- Org chart coverage: Economic buyer + technical evaluator + user
- Redundancy: People leave, go dark, change roles

---

#### Step 4: Compile Persona Matrix

**Step Overview:** Document everything into the Persona Matrix - your blueprint for Clay contact enrichment.

**Persona Matrix Components:**
1. Persona vectors with definitions
2. Point values per vector per tier
3. Tier thresholds
4. Coverage targets per account tier
5. Negative personas (titles to exclude)

**Persona Matrix Columns:**

| Column | Description |
|--------|-------------|
| Title | CRO, VP Sales, Head of RevOps, etc. |
| Seniority | C-Level, VP, Director, Manager |
| Geography | US, Canada, EMEA, APAC |
| Experience | Years in role, first-time vs. repeat |
| Pain Points | What problems they face (board reporting, quota attainment) |
| Aspirations | What they're trying to achieve (exit, promotion) |

**Output:** Enrichable Persona Matrix document

---

#### Step 5: Build Clay Contact Table

- Set up Clay contact table linked to accounts table
- Add columns for all persona vectors (title, seniority, geography, tenure)
- Add persona fit score column (calculated from vectors)
- Add persona tier assignment column
- Use Clay's People Search to find contacts at accounts
- Filter by persona criteria
- Enrich contact data using waterfall (Apollo → Clearbit → ZoomInfo)
- Calculate persona fit scores using Score Row
- Assign persona tier based on thresholds

**Just-in-time Enrichment Strategy:**

Don't enrich all personas at once - too expensive and data decays fast (people change jobs constantly).

*Prioritization Approach:*
1. Enrich personas for T1 accounts first
2. Within T1, prioritize accounts in active sequences or with signals
3. Enrich T2 account personas only when entering outbound cadence
4. T3 accounts: minimal persona enrichment, marketing only

**Waterfall Logic to Prevent Duplicates:**
1. Lookup by Account ID + Email
2. If not found, lookup by Account ID + LinkedIn URL
3. Only create contact if both return 0 results

---

#### Step 6: Refine Persona Matrix

- Review persona distribution across account tiers
- Validate persona coverage (enough Tier 1 Personas at T1 accounts?)
- Run coverage gap report
- Adjust criteria if patterns don't match expectations

**Refinement Triggers:**
- &lt;50% of T1 accounts have Tier 1 personas → broaden title criteria
- Average 30+ contacts per account → tighten criteria
- SDRs report wrong people → review title-to-tier mapping

---

#### Step 7: Push Persona Data into CRM

- Create contact custom fields (Persona Tier, Persona Fit Score, LinkedIn URL)
- Map Clay contact columns to CRM contact fields
- Set up update vs create logic (same override considerations as accounts)
- Test on 10-20 sample contacts
- Execute full contact data load
- Run validation report: Persona coverage by account tier

---

#### Combining Account + Persona Tiers for Prioritization

| Account | Persona | Priority | Action |
|---------|---------|----------|--------|
| T1 | Tier 1 | Highest | AE immediate outreach |
| T1 | Tier 2 | High | Warm intro target, multi-thread |
| T2 | Tier 1 | High | SDR sequence, meeting booking |
| T2 | Tier 2 | Medium | SDR sequence, lower priority |
| T3 | Any | Low | Marketing nurture only |

---

#### Handling Persona Coverage Gaps

**Scenario 1: T1 Account with No Tier 1 Personas Found**
- First, expand title search (try adjacent titles)
- Second, check if company has unusual org structure
- Third, flag for manual research (SDR task)
- Don't deprioritize the account - the account is still T1

**Scenario 2: Too Many Personas Found (50+ per account)**
- Tighten seniority filter
- Add geography constraints
- Add department/function filter
- Goal: 5-15 contacts per T1 account

**Scenario 3: Persona Found But Email Not Enrichable**
- Use LinkedIn URL as fallback for outreach
- Flag for manual email research
- Still valuable for signal monitoring

---

### Part 6: Enablement

**Key insight:** Enablement is the final step that ensures all the data work actually translates to changed behavior. With reporting built and personas loaded, reps can now be trained on how to use the full system.

**The "Get to Work" Moment:** Enablement is where Market Map stops being a strategic exercise and becomes a tactical tool. Before this point, you've built infrastructure — accounts, tiers, valuations, reports, personas. Now reps can finally take action:
- Filter for T1 accounts + Tier 1 personas and start sequences
- Multi-thread into their top accounts with real names and emails
- Use dashboards to prioritize their day based on tier + signals

This is why enablement MUST come after personas. You can't train reps on outbound workflows when they don't have people to contact. The full system only works when all pieces are in place.

---

#### Step 1: Final Handoff Call

- Walk through CRM filtered by T1 accounts (show the data live)
- Show valuation distribution across tiers
- Show persona coverage at top accounts
- Explain tiering: What makes an account T1 vs T2 vs T3
  - T1 = highest value, AE-driven
  - T2 = SDR / marketing driven
  - T3 = don't focus
- Demonstrate territory equity (show territory valuation by rep report, prove territories are fair)

---

#### Step 2: How to Use It

- **Outbound:** Filter for T1 accounts with Tier 1 personas
- **Lead Routing:** T1 goes to AE, T2 goes to SDR
- **Marketing:** Segment campaigns by tier
- Walk through dashboard navigation and filtering

---

#### Step 3: Set Refinement Expectations

- After 1 sales cycle (30–90 days), review closed won / lost by tier
- If closing more T3 than T1, refine ICP criteria
- Document any accounts that seem wrong tier for future refinement
- Schedule refinement check-in (calendar invite for 30-90 days out)

---

#### Step 4: Documentation Delivery

- ICP Matrix with T1/T2/T3 definitions
- Persona Matrix with Tier 1/2/3 definitions
- Valuation methodology and formula
- Clay table documentation (what each column does, data providers used)
- CRM field usage guide
- Ongoing maintenance playbook

---

## 4. Quality Assurance

### QA Checklist

**Note:** QA happens throughout the project, not as a discrete step. Use this checklist during Part 2 (Clay Tables), Part 3 (CRM Push), and Part 5 (Personas) to validate work as you go.

**Data QA:**
- [ ] All data went through - compare source counts to CRM counts
- [ ] No corporate/branch data overrides (franchise scenarios - corporate replacing dealership data)
- [ ] Values are correct based on inputs (no unexpected blanks, formulas working)
- [ ] ICP criteria are actually enrichable via available Clay data providers (not theoretical)
- [ ] Valuation methodology tested against existing customers and produces realistic ARR estimates
- [ ] ICP fit scoring rubric produces reasonable tier distribution (T1 not 90% or 0.1% of accounts)
- [ ] Expected account volume per rep is 50-10k accounts (if outside range, criteria too loose/tight)
- [ ] Clay credit usage is within budget and "only run if" conditions optimize spend
- [ ] CRM field mapping is 1:1 correct and picklist values match Clay outputs exactly
- [ ] Waterfall logic prevents duplicate contacts (critical - test lookups return 0 before creating)
- [ ] Test sample of 10-20 accounts/contacts manually reviewed in CRM (all fields populated correctly)
- [ ] No duplicate accounts or contacts created in CRM (search by domain/email/LinkedIn after load)
- [ ] Validation reports show expected distribution (T1/T2/T3 counts, valuation totals, persona coverage)
- [ ] Territory valuation is equitable across reps (no rep has 10x another's territory value)
- [ ] Stakeholders can use CRM reports and filter by tier/persona (training delivered)

---

## 5. Deliverables

### Final Deliverables

**Enriched CRM**
- All ICP-qualified accounts loaded with T1 / T2 / T3 tiering
- All personas loaded with Tier 1 / 2 / 3 classification
- Custom fields populated: Account Tier, Valuation, ICP Fit Score, Persona Tier, Persona Fit Score

**Clay Tables**
- Account table with enrichment workflows and scoring logic
- Contact table with persona enrichment and waterfall duplicate prevention

**ICP & Persona Matrices**
- ICP Matrix: T1 / T2 / T3 criteria, valuation methodology, fit scoring rubric
- Persona Matrix: Tier 1 / 2 / 3 criteria, scoring rubric

**CRM Reports & Dashboards**

Three levels of reporting (pyramid approach):

**Level 1: Executive Business Insight**
- Closed-won / lost by tier
- Conversion rates by tier
- Revenue by tier
- Win rates across segments

**Level 2: Finger on the Pulse / Distribution**
- Territory valuation by rep
- Account distribution by tier
- Persona coverage by tier
- Territory balance reports

**Level 3: Individual Rep Cockpit**
- Market Map Dashboard (metrics by tier)
- Signals Dashboard (optional)
- ABM Dashboard (optional)

**Documentation**
- Market Map methodology
- How ICP was defined
- Data sources used
- Refinement process
- Validation report: Accounts created / updated, Contacts loaded, Tier distribution, Valuation totals

---

### Project Handoff Checklist

- [ ] Clay Access: Table ownership transferred, admin access confirmed
- [ ] CRM Access: Temporary admin access returned / removed if applicable
- [ ] Documentation Package: ICP matrix, Persona matrix, Methodology docs, Maintenance playbooks
- [ ] Data Provider Access: Login credentials for any new providers
- [ ] Validation Report: Final state (accounts / contacts loaded), Tier distribution, Valuation totals
- [ ] Refinement Check-In: Calendar invite scheduled for 30–90 days out

---

## 6. Dependencies & Inputs

### What Must Exist Before Starting

- Admin access to CRM (Salesforce/HubSpot) with permission to create custom fields and import records
- Active subscriptions to enrichment tools (Clay, ZoomInfo, Apollo, or equivalent)
- Minimum 50 closed-won deals in CRM for pattern analysis (ideally 100+)
- Clear ARR or revenue data on existing customers for top-performer identification

### What Must Be Provided

- CRM admin credentials or a designated RevOps contact with import permissions
- Access to historical deal data including close date, ACV, and customer attributes
- 2-3 hours of stakeholder time for ICP interviews and tier alignment sessions
- Decision on geographic scope (US-only, global, specific regions)
- Budget approval for enrichment tool usage/credits if not already in place

---

## 7. Common Pitfalls

- **Pitfall 1**: Defining ICP based on aspirational targets instead of closed-won data (wishful thinking ICP)
  - **Mitigation**: Always validate ICP criteria against actual top 20% customers before finalizing attributes; if aspiration diverges from reality, flag for leadership alignment

- **Pitfall 2**: Over-enriching with too many attributes, creating analysis paralysis and unmaintainable data
  - **Mitigation**: Limit to 8-12 core enrichment fields that directly influence tier scoring; additional "nice-to-have" attributes can be added post-validation

- **Pitfall 3**: Loading enriched data without deduplication, creating duplicate accounts and corrupting CRM integrity
  - **Mitigation**: Run matching logic against existing CRM records before import; establish clear rules for merge vs. create decisions

- **Pitfall 4**: Treating market map as a one-time project instead of a living system with data decay
  - **Mitigation**: Build in quarterly enrichment refresh process and assign clear ownership for ongoing maintenance from day one

- **Pitfall 5**: Relying solely on single data provider for TAM without validation
  - **Mitigation**: Cross-validate 10-15% of accounts manually against LinkedIn/company websites; industry filters from data providers can be wrong 50% of the time

---

## 8. Success Metrics

- **Leading Indicator**: Sales team actively filters by Tier 1 accounts in CRM within 2 weeks of launch; 80%+ of new outbound sequences target Tier 1/Tier 2 accounts only

- **Lagging Indicator**: Tier 1 accounts convert at 2x+ the rate of Tier 3 accounts within 90 days; MQL-to-Opportunity conversion rate improves by 15-25% post-implementation

---

## 9. Post-Project Support

### Maintenance Schedule

**Monthly Tasks**
- Incremental account enrichment: Run new CRM accounts through Clay tables to enrich and tier them
- Clay credit monitoring: Track credit burn, check for runaway enrichments or missing "only run if" conditions
- CRM data quality checks: Audit for duplicate accounts / contacts, domain normalization issues, blank tier / valuation fields
- Monthly account refresh (optional): On 1st of month, redistribute hottest T1 accounts with highest intent signals to AEs - alternative to static territories

**Quarterly Tasks**
- Persona coverage refresh: Run People Search in Clay to find new Tier 1 personas who joined T1 accounts
- **Report-driven persona enrichment:** Build CRM report showing T1 accounts missing multiple seniority levels, push to Clay for persona fill. Logic: show accounts with tier = T1, contact count < 4, no outreach yet → entry criteria for persona enrichment
- Data provider optimization: Test if switching providers reduces credit costs or improves data accuracy

**Every 6-12 Months**
- Territory rebalancing: Review territory valuations to ensure reps have equitable values after wins / churn

**After 1 Sales Cycle (30–90 Days)**
- ICP refinement: Pull CRM report on closed won / lost by tier
- If closing more T3 than T1, or losing T1 consistently, adjust ICP criteria based on actual performance
- Market Map is ongoing, not one-and-done: Business priorities change, product offerings evolve, tiers need regular validation

**Every 6–12 Months (Minimum Twice Yearly)**
- ICP validation review: At minimum, review twice per year - at the halfway point and during planning season
- Correlation analysis refresh: Re-run historical closed won / lost correlation to validate if ICP assumptions still hold
- Valuation recalibration: If pricing model or ACVs changed significantly, update valuation formula and re-score accounts
- Key validation questions to ask:
  - Are the people we expect to be buying still the ones buying?
  - Are T1 accounts taking the least time to close?
  - Are T1 accounts converting the strongest?
  - If not, dig deeper and adjust criteria

---

### Training Requirements

**RevOps Manager**
- How to maintain Clay tables
- Run incremental enrichment
- Add new accounts
- Update ICP criteria
- Monitor credit usage
- Troubleshoot sync issues

**Sales Leadership**
- Use CRM reports to filter by tier
- Build outbound lists
- Assign territories based on valuation
- Track closed won / lost by tier over time

**Marketing**
- Segment audiences by tier for campaigns
- Build targeted lists
- Track conversion rates by tier

**AE / SDR**
- What T1 / T2 / T3 tiers mean
- How to prioritize outreach (T1 first)
- How to use persona data for personalization
- How to interpret fit scores

---

## 10. AI Usage

### Current AI Applications

**Part 1, Step 1 - Clay Sculptor (Clay feature)**
- Pulling in CRM data for analysis using AI
- Available on all plans
- May be able to automate a great chunk of the ICP Matrix creation process (based on CRM data)
- Historical Data Correlation Analysis: AI can analyze closed won/lost exports and quickly surface firmographic patterns and win rate correlations by segment instead of manual spreadsheet pivoting
- Pull entire CRM's closed lost and closed won, run AI analysis on patterns

**Clay Audiences (New Feature)**
- Super table supporting 1M+ rows with live CRM sync
- Signals consolidated at population level vs individual tables
- Records stay fresh from CRM (not one-time pull)
- Useful when TAM exceeds 50k row table limit

**Part 2, Step 3 - Custom Criteria Enrichment with Claygent**
- For ICP criteria that standard data providers don't have, use Claygent AI enrichment with custom prompts
- Examples: "Does this nonprofit have 2+ related entities?", "Is this association national or regional scope?"

### Future AI Opportunities

**ICP Drift Detection**
- Monthly automated report showing closed won/lost rates by tier
- If closing T3 accounts at higher rates than T1, flag that ICP assumptions may be wrong and need refinement

**Valuation Recalibration Alerts**
- When actual closed deal values diverge significantly from estimated valuations (e.g., T1 accounts closing at $20k instead of predicted $60k), automatically flag for valuation formula review

---

## 11. Edge Cases & Troubleshooting

### Common Issues

**Duplicate Contacts Created in CRM**
- How to identify: After contact load, search CRM by email / LinkedIn URL and find multiple records for same person
- How to resolve: Build waterfall lookup logic in Clay (1st lookup by Account ID + Email, 2nd lookup by Account ID + LinkedIn URL, only create if both return 0). Test on 20 samples before full load.

**Domain Normalization Issues Causing Failed CRM Matching**
- How to identify: Clay CRM lookup returns "not found" but you can manually see the account exists in CRM (www. vs non-www, HTTP vs HTTPS mismatches)
- How to resolve: Audit CRM domains in Part 1 Step 4, normalize domains in Clay before matching (remove www., force lowercase, strip HTTP / HTTPS)

**T1 Account Volume Too High or Too Low**
- How to identify: T1 list is 50,000 accounts for 3-person team (too high) or 50 T1 accounts for 10-person team (too low)
- How to resolve: Target 50–10k accounts per rep. If too high, tighten criteria in Part 1 Step 3. If too low, loosen criteria or expand to T2.

**ICP Criteria Not Enrichable via Clay Data Providers**
- How to identify: Stakeholders define criteria like "has active board committees" but no data provider (Apollo, Clearbit, etc.) has this field
- How to resolve: Use Claygent AI enrichment with custom prompts, or remove criteria if Claygent hit rate is &lt;50%

**Valuation Formula Produces Unrealistic ARR Estimates**
- How to identify: T1 accounts showing $500k estimated ARR when actual customers close at $30k ARR
- How to resolve: Test formula against 10–20 existing customers in Part 1 Step 2, adjust coefficient until estimates are within 20–30% of actuals

**Picklist Values Mismatch Between Clay and CRM**
- How to identify: Clay returns "T1" but CRM picklist expects "Tier 1", causing blank fields after load
- How to resolve: Validate picklist alignment in Part 3 Step 1, use AI normalization column in Clay to convert values before CRM sync

**Clay Credit Burn Exceeds Budget**
- How to identify: Clay table uses 15k credits but only have 10k budget
- How to resolve: Add "only run if" conditions to expensive enrichments (only enrich if ICP fit score ≥ T2 threshold), use free Score Row feature instead of AI columns for calculations, use waterfall enrichment (try cheapest provider first)

**Stakeholders Misaligned on ICP Definition**
- How to identify: Sales says "we sell to SMB 10–50 employees" but Marketing says "enterprise 500+ employees only"
- How to resolve: Use historical data correlation analysis in Part 1 Step 1 to let data force alignment – show actual win rates by segment

**CRM Fields Already Exist But Named Differently**
- How to identify: Try to create "Account Tier" field but CRM already has "Account_Tier__c" or "Tier" field with different values
- How to resolve: Audit existing custom fields in Part 1 Step 4, decide to reuse existing field (and migrate old values) or create new field with unique name

**Horizontal Company Tries to Pull Full TAM**
- How to identify: Company sells to "any B2B SaaS company" and tries to pull entire TAM, resulting in 5 million accounts
- How to resolve: Force Approach 3 (T1 Only) – define very restrictive T1 criteria, pull 500–2k accounts max, expand later after validation

**Missing Closed Won / Lost Data for Correlation Analysis**
- How to identify: Has &lt;50 customers or closed lost opportunities not tracked in CRM
- How to resolve: Use Approach 6 (No Historical Data) – rely on stakeholder interviews and Clay Searcher real-time validation instead of data analysis

**Territory Valuations Not Equitable After Assignment**
- How to identify: Rep A has $10M territory valuation, Rep B has $1M territory valuation
- How to resolve: Run territory valuation report in Part 4 Step 2, rebalance account assignments until valuations are within 20% of each other

**Geographic Territories Revealed as Imbalanced**
- How to identify: Market Map shows certain geo territories have 10x the account value of others
- How to resolve: Consider switching from geographic to named account model - distribute top T1 accounts across sellers regardless of geography, use monthly refresh instead of static territories

**Closing T3 Accounts at Higher Rate Than T1 After Launch**
- How to identify: 30–90 days post-launch, closed won / lost by tier report shows T3 win rate = 40%, T1 win rate = 15%
- How to resolve: ICP assumptions are wrong – schedule refinement call, adjust ICP criteria based on what's actually closing, re-score accounts

**Aspirational T1 Doesn't Match Actual Buying Patterns**
- How to identify: After 6 months of selling, T2 (or middle tier) is converting better than T1. T1 accounts are too large and choosing enterprise competitors
- How to resolve: T1 may be aspirational rather than realistic. Consider flipping tiers - keep middle as T1, edges become T2/T3. What's closing should define your actual tier priority

---

### Special Scenarios

**Multi-Product Portfolio (Different ICPs per Product)**
- Scenario: Company sells 3 different products with completely different ICPs (Product A = SMB, Product B = Enterprise, Product C = Nonprofits)
- How to handle: Build separate ICP matrices per product, create product-specific fit score fields in CRM (Product_A_Tier, Product_B_Tier, Product_C_Tier), run separate Clay tables per product OR use one table with conditional scoring logic

**Channel / Partner Motion (Account Assignment Conflicts)**
- Scenario: Company sells through partners and direct sales – can't assign partner accounts to direct sales reps
- How to handle: Add "Channel Type" field to ICP criteria in Part 1 Step 3, filter partner accounts out of direct rep territories, create separate territory valuation reports for direct vs partner

**International Markets with No Data Provider Coverage**
- Scenario: Vertical targets EMEA / APAC but data providers only cover US / Canada
- How to handle: Build separate approach per geography – US / Canada use standard providers, EMEA / APAC use alternative providers or manual research, may need to reduce ICP criteria complexity for regions with limited data

**PLG Motion with Product Usage Data**
- Scenario: Company has product-led growth motion and wants to incorporate product usage signals into fit scoring (e.g., "active users >10" = higher tier)
- How to handle: Add product usage data as enrichment source in Part 2 Step 3 (pull from product database or data warehouse), incorporate into fit scoring rubric alongside firmographics

**Existing ABM Program with Conflicting Tier Definitions**
- Scenario: Marketing already has ABM tiers (Tier 1 = 100 target accounts) that conflict with Market Map T1 definition
- How to handle: Align tier definitions in Part 1 Step 3 ICP workshop, either adopt existing ABM tiers OR rename Market Map tiers to "ICP Tier" vs "ABM Tier" and maintain both in CRM

**Enterprise Orgs with Strict CRM Governance**
- Scenario: Enterprise requires architecture review board approval for custom fields, 2-week approval process
- How to handle: Flag in discovery (Part 1 Step 1), submit custom field requests early in project timeline, may need to add 2–3 weeks to project duration

**CRM Has No Domains (Using Company Name Only)**
- Scenario: CRM account records don't have website / domain field populated, only company name
- How to handle: Use fuzzy company name matching instead of domain matching in Part 2 Step 2, higher duplicate risk so require manual review of matches before loading

**Lead Scoring Not Account Scoring**
- Scenario: Primarily inbound-led and wants to score individual leads, not accounts
- How to handle: Adapt process – still build ICP matrix for account-level criteria, but add lead-level scoring in Part 3 (lead source, engagement score, form fills, demo requests) and create Lead Tier field instead of / in addition to Account Tier

**No CRM (Early Stage Startup)**
- Scenario: Doesn't have Salesforce / HubSpot, using spreadsheets or Airtable
- How to handle: Build Clay tables as normal (Part 1–2), export enriched accounts / contacts to CSV, manually import to their system, train on how to maintain in spreadsheet until CRM is implemented

**Intent Data Provider Integration (6sense, Demandbase)**
- Scenario: Already uses intent data and wants to incorporate into Market Map
- How to handle: Add intent signals as separate enrichment in Part 2 Step 3, keep intent separate from ICP fit score (ICP = static firmographics, Intent = dynamic behavior), may create "Propensity Score" = ICP Fit Score + Intent Score

**Existing HubSpot ABM Scoring**
- Scenario: Already has ABM scoring (e.g., 3x3 matrix A1-C3) in HubSpot or similar
- How to handle: Layer ICP tiering onto existing ABM scoring - can filter by "T1 accounts with highest ABM score (A1)" for prioritization. Keep both systems: ICP tier = static firmographic fit, ABM score = dynamic engagement/intent

**GDPR-Heavy Regions (EU Contact Enrichment Restrictions)**
- Scenario: Targets EU and has legal concerns about enriching contact emails / LinkedIn without consent
- How to handle: Focus on account-level enrichment only (Part 1–3), skip persona enrichment (Part 5) OR only enrich contacts who have opted in (existing CRM contacts), require legal review before contact data load

**Messy CRM Requires Full Cleanup Project First**
- Scenario: CRM has 50k accounts with 80% duplicates, no normalized domains, inconsistent data
- How to handle: Scope as Approach 4 (CRM Cleanup First) – dedupe accounts, normalize domains, merge records BEFORE starting Market Map, may require separate 2-week cleanup engagement before ICP work begins

**Sales Team Rotating Territories Quarterly**
- Scenario: Company rotates rep territories every quarter, so territory valuation needs to be recalculated frequently
- How to handle: Build automated territory valuation report in Part 4 Step 2, train RevOps Manager to run rebalancing analysis quarterly, document process in maintenance playbook

**Named Account Round Robin (Stale Account Reassignment)**
- Scenario: Company uses named accounts rather than geographic/industry territories, accounts go stale under same rep
- How to handle: Implement monthly process to review target accounts with no recent activity or successes - reassign stale accounts (e.g., 6+ months with no progress) to different reps. Can move thousands of accounts monthly. Gives fresh reps a shot at accounts that weren't converting. Alternative to traditional territory design that still uses Market Map tiering.

**Acquired Companies with Separate CRM Instances**
- Scenario: Recently acquired another company, has 2 Salesforce instances that need to merge
- How to handle: Decide in discovery which CRM instance is source of truth, pull accounts from both in Part 1 Step 3, dedupe across instances in Clay before loading to primary CRM, flag in project plan as high-complexity


