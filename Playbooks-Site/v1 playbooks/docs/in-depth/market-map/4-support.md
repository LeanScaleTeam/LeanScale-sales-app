---
displayed_sidebar: inDepthSidebar
title: "Market Map Post Support"
sidebar_position: 4
---

# Market Map Support

QA, Deliverables, Dependencies, Pitfalls, Metrics, Maintenance, AI Usage, Edge Cases

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


### Project Handoff Checklist

- [ ] Clay Access: Table ownership transferred, admin access confirmed
- [ ] CRM Access: Temporary admin access returned / removed if applicable
- [ ] Documentation Package: ICP matrix, Persona matrix, Methodology docs, Maintenance playbooks
- [ ] Data Provider Access: Login credentials for any new providers
- [ ] Validation Report: Final state (accounts / contacts loaded), Tier distribution, Valuation totals
- [ ] Refinement Check-In: Calendar invite scheduled for 30–90 days out


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


## 8. Success Metrics

- **Leading Indicator**: Sales team actively filters by Tier 1 accounts in CRM within 2 weeks of launch; 80%+ of new outbound sequences target Tier 1/Tier 2 accounts only

- **Lagging Indicator**: Tier 1 accounts convert at 2x+ the rate of Tier 3 accounts within 90 days; MQL-to-Opportunity conversion rate improves by 15-25% post-implementation


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
- How to resolve: Use Claygent AI enrichment with custom prompts, or remove criteria if Claygent hit rate is less than 50%

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
