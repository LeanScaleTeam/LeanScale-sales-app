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
