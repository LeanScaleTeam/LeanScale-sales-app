---
displayed_sidebar: inDepthSidebar
title: "Market Map Implementation"
sidebar_position: 3
---

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

*Why:* It allows free validation ("Identify ICP step"). You can preview results, see total counts, and hone criteria (e.g., "Exclude companies with &lt;10 employees") without spending credits.

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


### Step 4: Refine Ideal Matrix (Realistic)

- Review initial data distribution by tier
- Validate valuation accuracy
- Adjust ICP/Persona criteria if patterns don't match expectations
- Update Clay tables with refined criteria


## Part 3: Push Enriched Accounts into CRM

### Step 1: Create CRM Fields

- Create custom fields for accounts (Account Tier, Account Valuation, ICP Fit Score, plus optional ICP-specific fields)
- Create custom fields for contacts (Persona Tier, Persona Fit Score, LinkedIn URL, Years of Experience)
- Validate picklist values align between Clay outputs and CRM
- **Granular Tier Fields (Advanced):** For complex ICPs, create sub-tier fields (e.g., Tier CCIE, Tier CISO, Tier Geographic, Tier Industry, Tier Auxiliary Titles) that roll up into master ICP Tier field via formula/flow


### Step 2: Map Fields to Clay

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


### Step 3: Push Clay Data into CRM

- Test CRM update workflow on 10-20 sample accounts
- Execute full CRM update for all accounts found in CRM
- Test CRM create workflow on 10-20 sample accounts
- Execute full CRM create for all new accounts
- Test CRM workflows for contacts (10-20 samples)
- Execute full CRM update/create for all contacts
- Run CRM validation reports (accounts and contacts by tier, valuation distribution, persona coverage)


## Part 4: Reporting

**Key insight:** Reporting operationalizes the data. Having tiered accounts in CRM is useless without reports that make the data actionable. Three levels of reporting create a pyramid from executive insight down to individual rep usage.

**Critical Validation Point:** This is where leadership validates the model. Before investing in persona enrichment or enablement, use reporting to sanity-check the tiering:
- Pull a sample of T1 accounts — do they look right?
- Show territory valuation distribution — is it equitable?
- Review the tier breakdown — does the distribution make sense?

If something looks off (T1 accounts are all tiny companies, or one territory has 10x the value of another), catch it here before proceeding. Reporting serves as both the operational layer AND the validation checkpoint.


### Step 1: Create Executive Business Insight Reports

- Closed-won / lost by tier (are we closing T1 or spending time on T3?)
- Conversion rates by tier (is tiering predictive of outcomes?)
- Revenue by tier (growth model validation)
- Win rates across segments (tiering efficacy)


### Step 2: Create Finger-on-the-Pulse Distribution Reports

- Territory valuation by rep (prove territories are fair based on account value)
- Account distribution by tier (T1/T2/T3 counts per territory)
- Persona coverage by tier (enough Tier 1 Personas at T1 accounts?)
- Which reps have which accounts, are territories balanced?


### Step 3: Create Individual Rep Cockpit/Dashboard

- **Market Map Dashboard:** Segment all core metrics (ARR, bookings, pipeline created, conversion rates) by tier
- **Signals Dashboard (optional):** Shows T1 accounts with active buying signals (e.g., peer events, new locations, hiring)
  - Peer signals often more valuable than direct signals: "Your peers just got breached" creates urgency without defensiveness
  - Combine tier + ABM grade for prioritization (e.g., Tier 1 + A1 scoring = "1A1" accounts as best-of-best)
- **ABM Dashboard (optional):** Combination of tier + stakeholder profile + account-level engagement = scoring grade


## Part 5: Personas

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


### Step 1: Define Persona Vectors (via Interviews & CRM Data)

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

#### 3 Methods to Discover Your Persona Vectors:

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


### Step 2: Assign Point Values to Persona Vectors

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


### Step 3: Define Persona Tier Thresholds

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


### Step 4: Compile Persona Matrix

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


### Step 5: Build Clay Contact Table

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


### Step 6: Refine Persona Matrix

- Review persona distribution across account tiers
- Validate persona coverage (enough Tier 1 Personas at T1 accounts?)
- Run coverage gap report
- Adjust criteria if patterns don't match expectations

**Refinement Triggers:**
- &lt;50% of T1 accounts have Tier 1 personas → broaden title criteria
- Average 30+ contacts per account → tighten criteria
- SDRs report wrong people → review title-to-tier mapping


### Step 7: Push Persona Data into CRM

- Create contact custom fields (Persona Tier, Persona Fit Score, LinkedIn URL)
- Map Clay contact columns to CRM contact fields
- Set up update vs create logic (same override considerations as accounts)
- Test on 10-20 sample contacts
- Execute full contact data load
- Run validation report: Persona coverage by account tier


### Combining Account + Persona Tiers for Prioritization

| Account | Persona | Priority | Action |
|---------|---------|----------|--------|
| T1 | Tier 1 | Highest | AE immediate outreach |
| T1 | Tier 2 | High | Warm intro target, multi-thread |
| T2 | Tier 1 | High | SDR sequence, meeting booking |
| T2 | Tier 2 | Medium | SDR sequence, lower priority |
| T3 | Any | Low | Marketing nurture only |


### Handling Persona Coverage Gaps

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


## Part 6: Enablement

**Key insight:** Enablement is the final step that ensures all the data work actually translates to changed behavior. With reporting built and personas loaded, reps can now be trained on how to use the full system.

**The "Get to Work" Moment:** Enablement is where Market Map stops being a strategic exercise and becomes a tactical tool. Before this point, you've built infrastructure — accounts, tiers, valuations, reports, personas. Now reps can finally take action:
- Filter for T1 accounts + Tier 1 personas and start sequences
- Multi-thread into their top accounts with real names and emails
- Use dashboards to prioritize their day based on tier + signals

This is why enablement MUST come after personas. You can't train reps on outbound workflows when they don't have people to contact. The full system only works when all pieces are in place.


### Step 1: Final Handoff Call

- Walk through CRM filtered by T1 accounts (show the data live)
- Show valuation distribution across tiers
- Show persona coverage at top accounts
- Explain tiering: What makes an account T1 vs T2 vs T3
  - T1 = highest value, AE-driven
  - T2 = SDR / marketing driven
  - T3 = don't focus
- Demonstrate territory equity (show territory valuation by rep report, prove territories are fair)


### Step 2: How to Use It

- **Outbound:** Filter for T1 accounts with Tier 1 personas
- **Lead Routing:** T1 goes to AE, T2 goes to SDR
- **Marketing:** Segment campaigns by tier
- Walk through dashboard navigation and filtering


### Step 3: Set Refinement Expectations

- After 1 sales cycle (30–90 days), review closed won / lost by tier
- If closing more T3 than T1, refine ICP criteria
- Document any accounts that seem wrong tier for future refinement
- Schedule refinement check-in (calendar invite for 30-90 days out)


### Step 4: Documentation Delivery

- ICP Matrix with T1/T2/T3 definitions
- Persona Matrix with Tier 1/2/3 definitions
- Valuation methodology and formula
- Clay table documentation (what each column does, data providers used)
- CRM field usage guide
- Ongoing maintenance playbook
