---
displayed_sidebar: inDepthSidebar
title: "Market Map Methodology"
sidebar_position: 2
---

# Market Map Methodology

Part 1: Define Enrichable ICP

## Implementation Overview

### Important Note on Approaches

The 6-part step-by-step process (Define Enrichable ICP → Build Master Clay Tables → Push Enriched Accounts into CRM → Reporting → Personas → Enablement) remains the same across all 6 approaches.

The differences are in scope and depth, not in the fundamental steps:
- **Approach 1 (Full TAM):** Execute all 6 parts completely, pull entire TAM in Part 2 Step 2
- **Approach 2 (Tiered Pull):** Execute all 6 parts, but Part 2 Step 2 only pulls T1/T2 initially, expand to T3 later
- **Approach 3 (T1 Only):** Execute all 6 parts with tighter criteria in Part 1 Step 3, Part 2 Step 2 pulls minimal accounts (50-1k)
- **Approach 4 (CRM Cleanup First):** Add domain cleanup substeps to Part 2 Step 2 before enrichment
- **Approach 5 (Historical Data Heavy):** Part 1 Step 1 correlation analysis is mandatory and drives Part 1 Step 3 ICP criteria
- **Approach 6 (No Historical Data):** Skip Part 1 Step 1 correlation analysis, rely more heavily on Part 1 Step 3 Clay Searcher validation


## Part 1: Define Enrichable ICP

### Step 1: Define ICP Vectors (via Interviews & CRM Data)

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

#### 4 Methods to Discover Your Vectors:

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


### Step 2: Define Valuation Methodology

**Step Overview:** Determine how much each potential account is worth to your business. This is the most difficult part and requires judgment calls. By leveraging firmographic data and analyzing your existing customer base, you can make reasonable assumptions about potential value. End state: a valuation formula that lets you group accounts into equitable territories for your reps.

**Why This Matters:**

Once we figure out how much accounts are worth, we group them into territories and ensure fair, equitable distribution across reps. Without valuation, you can't prove territory balance.

**Important Note:** There is no one-size-fits-all method. Use these approaches as inspiration, not rigid rules.

#### 5 Approaches to Value a Potential Account

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

#### Additional Valuation Considerations

**White Space Analysis (Existing Customers)**

For existing customers, compare where accounts could be (based on comparable companies) vs where they are currently. This identifies upsell and expansion potential.

You need to know your valuation methodology so you can compare your existing contract value with where you think they should be — that difference is how much upside you still have.

*Example:* If your TAM valuation data says two similar-sized retail companies are roughly the same size and both are customers of yours, but one is paying a fifth of the contract of the other — that tells you there's upsell or expansion potential within that account.

This is critical for companies with land-and-expand or usage-based models. Understanding what features, new products, or new offerings can maximize existing business becomes equally important as net-new acquisition.

**Extrapolation Method (Net-New Prospects)**

Segment closed deals by company size (headcount/revenue), calculate average deal size per segment, apply those averages to all prospects in each segment to estimate total TAM value.


### Step 3: Define ICP Fit Criteria / Score

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


### Step 4: Define List Scope

**Step Overview:** Decide how many accounts to actually pull into the system. Pulling the entire world (TAM) is often unnecessary and expensive.

#### 3 Levels of List Pulling:

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


### Step 5: Create Ideal Clay ICP Matrix

- Compile ICP matrix with all criteria, valuation ranges, fit scores into tiered structure (T1/T2/T3)
- Facilitate Persona workshop (define persona criteria: titles, geography, seniority, experience, pain points, goals)
- Validate persona criteria against current contacts in CRM
- Define persona fit scoring criteria
- Create Persona matrix with tiered structure (Tier 1/2/3 Personas)
- Audit current contact universe in CRM

**Output:** Enrichable ICP Matrix document with all criteria, scoring rubric, and tier thresholds.
