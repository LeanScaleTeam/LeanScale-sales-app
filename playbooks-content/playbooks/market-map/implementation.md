# Market Map Implementation

Parts 2-6: Build, Push, Reporting, Personas, Enablement

## Part 2: Build Master Clay Tables

### Step 1: Accounts Table + Criteria Columns

- Set up Clay account table
- Add criteria columns for all ICP attributes (firmographics, technographics, custom criteria)
- Add valuation column
- Add ICP fit score column
- Add tier assignment column
- **Multiple Tables Option:** Consider separate tables by signal type (M&A activity, security breaches, job postings, etc.) for flexibility to customize triggers per tier rather than one master table


### Step 2: Pull Accounts (Technical Execution)

**Step Overview:** Gather the raw list of accounts from creating a "Universe" of companies to enrich.

#### Method 1: Clay Searcher (Recommended for Discovery)

Use Clay's internal database to find companies.

*Why:* It allows free validation ("Identify ICP step"). You can preview results, see total counts, and hone criteria (e.g., "Exclude companies with fewer than 10 employees") without spending credits.

*Process:*
1. Build search query in Clay
2. Validate list size (aiming for T1 target)
3. Import to table

#### Method 2: Import from CRM

Pull existing accounts from Salesforce or HubSpot into Clay for enrichment.

*Prerequisite:* Domain hygiene. If CRM domains are messy (missing, non-standard), clean them in the CRM first or use a temporary Clay table to normalize them before the master run.

*Salesforce:* Use a List View.
*HubSpot:* Use a Static List.

**Technical Note: Handling Large Lists**
Clay reports often have a 2k record limit per import.
- **If >2k records:** Split into multiple source reports or use "Leads" object if source is Salesforce.
- **Workflow:** Create a "Master Account Table" that acts as the single source of truth.

#### Method 3: Hybrid (Waterfall)

1. Import T1 accounts from CRM
2. Create a "Universe" table in Clay
3. Use Clay Searcher to find *net-new* accounts not in CRM
4. Deduplicate against the CRM import


### Step 3: Enrich Criteria (Using AI)

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
