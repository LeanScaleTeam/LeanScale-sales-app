# Market Map Implementation Playbook

## Project One-Pager

### Market Map One-Pager

#### Project Type

- Category: Balanced (Strategic + Technical)
- Primary Deliverable: Enriched CRM with tiered accounts, valued territories, scored personas, and operational dashboards

#### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Heavy | ICP workshop, persona workshop, 2-4 refinement loops |
| 2. Engineering | Yes | Heavy | Clay table build, CRM enrichment, data push, reporting |
| 3. Enablement | Yes | Medium | Training by stakeholder role, 30-day hypercare |
| 4. Handoff | Yes | Medium | Maintenance schedule + refinement cadence critical |

#### Phase Overview

Full 4-phase engagement with heavy strategy (ICP/Persona definition, valuation methodology, fit scoring) and heavy engineering (Clay tables, CRM fields, data push, reporting), standard enablement. Some customers skip persona enrichment in Phase 2 and treat it as a fast-follow or ongoing engagement. Approach varies significantly by TAM size, company type (vertical vs horizontal), and historical data availability.

---

## Pre-Kickoff (1a)

### Track A: Customer Homework

- Watch Market Map intro video (explaining ICP operationalization)
- Complete intake form (CRM type, team size, existing ICP docs, verticals, geos, tech stack, data providers, Clay credit budget)
- Provide CRM exports: all closed won/lost opportunities with firmographic attributes, current account/contact exports
- Provide CRM admin access + Clay credentials
- Begin Definition Alignment Document review (pre-filled with LeanScale recommendations)

### Track B: Architect Prep

- Pull and analyze CRM closed won/lost data for correlation patterns (win rate, deal size, sales cycle by segment)
- Run Clay Searcher to validate proposed ICP vectors against actual market data
- Draft v0 ICP Matrix with vectors, weights, and tier thresholds (mark all as ASSUMED)
- Draft v0 Valuation Methodology based on pricing model and historical deal data
- Create kickoff assets: current-state tier distribution, preliminary TAM sizing, questions list

---

## Refinement Loop (1b → 1c → 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present v0 ICP Matrix and valuation approach, validate vectors | CRO, RevOps, Sales Leadership | Corrections for v1 |
| ICP Workshop | 1c | Deep dive on vectors, weights, tier thresholds | CRO, RevOps, Sales Leadership | Refined ICP Matrix v1 |
| Persona Workshop | 1c | Define persona vectors, titles, seniority, scoring rubric | Sales Leadership, Marketing | Persona Matrix v1 |
| ICP Data Review | 1c | Present tier distribution from Clay pull, adjust thresholds | RevOps, CRO | Validated tier distribution |
| ICP Data Review 2+ | 1c | Repeat until alignment on tier distribution and valuations | RevOps, CRO | Final tier distribution |
| Sign-Off | 1d | Strategic approval of ICP Matrix, Persona Matrix, Valuation | All stakeholders | Final strategic package |

Note: ICP Data Review calls are repeating milestones—iterate until stakeholders agree with tier distribution.

---

## Phase Checklists

### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held
- 1c. ICP Workshop complete, ICP Matrix signed off
- 1c. Persona Workshop complete, Persona Matrix signed off
- 1c. ICP Data Review calls complete (tier distribution validated)
- 1d. Strategic sign-off obtained (ICP Matrix + Persona Matrix + Valuation Methodology)

### Phase 2: Engineering

- 2a. Clay table architecture designed (accounts + contacts + signal tables)
- 2b. Engineering handoff meeting held (Architect walks engineer through ICP Matrix and Clay build plan)
- 2c. Account enrichment build complete (Clay tables, CRM fields, data push, reporting)
- 2c. Persona enrichment build complete (contact tables, CRM push, coverage validation)
- 2d. QA complete + customer sign-off on data in CRM

### Phase 3: Enablement

- 3a. Training materials prepped (video walkthrough scripts, CRM guides, maintenance playbook)
- 3b. Training sessions delivered (by stakeholder role)
- 3c. Hypercare period complete (30 days)
- 3d. Enablement sign-off

### Phase 4: Handoff

- 4a. Maintenance schedule documented and handed off
- 4b. Internal handoff complete
- 4c. External handoff (LeanScale to Customer) complete
- 4d. Project closed and archived

---

## Document Types

### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| Intake form | Capture business context, CRM state, tool access | All fields filled by customer |
| ICP Matrix (working version) | Define vectors, weights, tier thresholds iteratively | All vectors confirmed, thresholds validated |
| Persona Matrix (working) | Define persona vectors, scoring, coverage targets | Persona vectors confirmed, thresholds set |
| Valuation Methodology doc | Define how accounts are valued (coefficient approach) | Formula tested against existing customers |
| Clay Table Architecture doc | Map Clay tables, columns, data providers, workflows | All tables specified, build sequence agreed |
| CRM Field Mapping doc | Map Clay columns to CRM fields, override rules | All fields mapped, picklist values aligned |

### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| ICP Matrix (final) | Working ICP Matrix | Internal reference for ICP criteria |
| Persona Matrix (final) | Working Persona Matrix | Outbound targeting reference |
| Valuation Formula doc | Valuation Methodology doc | Territory design, planning validation |
| CRM Reports & Dashboards | Built during Phase 2 | Executive insight, rep prioritization |
| Maintenance Playbook | Phase 4a documentation | Ongoing system health, refinement triggers |

---

## Enablement Details

### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| RevOps | RevOps Manager, CRM Admin | Clay table maintenance, incremental enrichment, credit monitoring, CRM field management, troubleshooting sync issues | 60m |
| Sales Leadership | VP Sales, Sales Directors | CRM tier filtering, outbound list building, territory valuation reports, closed won/lost by tier tracking | 45m |
| Marketing | VP Marketing, Demand Gen | Audience segmentation by tier, campaign targeting, conversion rate tracking by tier | 30m |
| AE / SDR | Individual Contributors | What T1/T2/T3 means, how to prioritize outreach, using persona data for personalization, interpreting fit scores | 30m |
| Leadership | CRO, Executive Sponsor | Strategic interpretation: tier distribution, territory equity, TAM feasibility, planning validation | 30m |

### Hypercare

- Applies: Yes
- Duration: 30 days (aligned with first sales cycle validation)
- Office Hours: Weekly 30-min slot for Q&A
- Scope: Bug fixes, data quality issues, tier misclassification reports, CRM filtering questions

### Training Assets to Create

- Video walkthrough: ICP Matrix walkthrough (what each vector means, how scoring works)
- Video walkthrough: CRM dashboard navigation (filtering by tier, using persona data)
- Video walkthrough: Clay table maintenance (adding new accounts, running incremental enrichment)
- Video walkthrough: Maintenance playbook walkthrough (monthly/quarterly/annual tasks)
- Doc: CRM field usage guide (field definitions, picklist values, how to filter)
- Doc: Clay table architecture guide (what each column does, data providers used, credit optimization)

---

## Handoff & Retention

### Internal Handoff

- Key context for Architect: ICP criteria, valuation formula, tier distribution, which stakeholders own what, CRM dashboard locations
- Escalation trigger: ICP criteria changes, valuation formula updates, segment additions, Clay workflow modifications

### External Handoff (LeanScale to Customer)

- Final meeting agenda: Walk through CRM filtered by T1, show tier distribution, demonstrate territory equity, review maintenance schedule, set refinement expectations
- Documentation package: ICP Matrix, Persona Matrix, Valuation doc, CRM field guide, Clay architecture doc, Maintenance Playbook, all video recordings

### Maintenance Schedule

- Monthly: Incremental enrichment, credit monitoring, CRM data quality checks
- Quarterly: Persona coverage refresh, data provider optimization
- After first sales cycle (30-90 days): ICP refinement based on closed won/lost by tier
- Every 6-12 months: Full ICP validation review, valuation recalibration
- Who owns: Single project = customer owns | Dedicated = Architect owns

### Retention/Expansion Path

**If Single Project:**
Upsell: Managed Services (ongoing Market Map maintenance + signals) → if no → Downsell: Another project (automated inbound, outbound enrichment, territory design) → Retry retainer

**If Multi-Project (Dedicated):**
- Refinement check-in scheduled: ~90 days out (aligned with first sales cycle completion)
- Internal prep trigger: 2 weeks before
- Decision: Architect handles / specialist needed (if ICP criteria changes required, specialist needed)

---

## Key Assets

| Asset | Format | When Used |
|-------|--------|-----------|
| ICP Matrix Template | Google Sheet | Phase 1: Strategy (ICP Workshop) |
| Persona Matrix Template | Google Sheet | Phase 1: Strategy (Persona Workshop) |
| Definition Alignment Document | Google Doc | Phase 1a: Pre-Kickoff (Track A homework) |
| Clay Table Architecture Guide | Internal doc | Phase 2: Engineering (Clay build) |
| CRM Field Mapping Template | Google Sheet | Phase 2: Engineering (CRM push) |
| Maintenance Playbook Template | Google Doc | Phase 4a: Handoff |

---

## Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| ICP (Ideal Customer Profile) | Firmographic, technographic, and behavioral attributes that define best-fit accounts |
| TAM (Total Addressable Market) | Total universe of accounts that could theoretically buy your product |
| ICP Vector | Single criterion used to score account fit (e.g., geography, employee count, tech stack) |
| Fit Score | 0-100 point score calculated from weighted ICP vectors that determines tier placement |
| Tier 1 (T1) | Highest-fit accounts—AE-driven, personalized outreach, top priority |
| Tier 2 (T2) | Good-fit accounts—SDR/marketing-driven, moderate personalization |
| Tier 3 (T3) | Low-fit accounts—marketing nurture only, automated outreach |
| Valuation | Estimated ARR potential of account based on firmographic coefficients (revenue, headcount, product-specific) |
| Persona Vector | Single criterion used to score contact fit (e.g., title, seniority, department, tenure) |
| Persona Tier | Classification of contacts by fit score (Tier 1 = exact match, Tier 2 = adjacent, Tier 3 = weak match) |
| Enrichable Criteria | ICP or persona attributes that can be answered by data providers (vs. theoretical criteria) |
| White Space | Gap between current contract value and estimated potential value for existing customers (upsell opportunity) |

---

## Common Gotchas

- **Aspirational T1 vs actual T1:** After 6 months, one client discovered T2 was converting better than T1 (T1 accounts were too large and chose enterprise competitors). Validate tiering against closed-won data early and adjust.
- **Horizontal company tries to pull full TAM:** Results in millions of accounts. Force T1 Only approach with very restrictive criteria (500-2k accounts max).
- **ICP criteria not enrichable:** Stakeholders define criteria like "has active board committees" but no data provider has this field. Use Claygent AI enrichment with custom prompts, or remove criteria if hit rate <50%.
- **Picklist value mismatch:** Clay returns "T1" but CRM expects "Tier 1", causing blank fields. Validate picklist alignment before pushing data.
- **Clay credit burn exceeds budget:** Add "only run if" conditions to expensive enrichments. Use free Score Row for calculations. Use waterfall enrichment (cheapest provider first).
- **Domain normalization:** CRM domains have www vs non-www, HTTP vs HTTPS mismatches. Normalize in Clay before matching.
- **Corporate/branch data override:** Franchise/dealership scenarios where systematic updates would overwrite better local data. Add prevent-override checkbox field.
- **Stakeholder misalignment on ICP:** Sales says SMB, Marketing says Enterprise. Use historical correlation analysis to let data force alignment—show actual win rates by segment.
- **Adoption failure:** Technical build does not equal organizational adoption. One client completed Market Map technically but never fully adopted the signals-driven approach. Invest in enablement.
- **Concentrated TAM edge case:** One client had ~100 target accounts total. Standard tiering doesn't apply when all targets are effectively T1. Shift focus to deep account intelligence and expansion signals.

---

## Methodology Options

| Option | When to Use | Complexity | Approach |
|--------|------------|-----------|----------|
| Approach 1: Full TAM Pull | Vertical company, narrow TAM (<100k accounts), 5+ reps | Medium | Standard tiering across full addressable market |
| Approach 2: Tiered Pull (T1/T2/T3) | Horizontal or large TAM, 500k+ accounts, pull T1 initially, expand later | Medium | Pull T1 accounts first, expand to T2/T3 in phases |
| Approach 3: T1 Only (Minimum) | Small team, limited budget, quick wins, clear T1 definition (500-2k accounts) | Low | Focus on highest-fit accounts only |
| Approach 4: CRM Cleanup First | Messy CRM with garbage data, domains not normalized, duplicates | High | Deduplicate and normalize CRM data before enrichment |
| Approach 5: Historical Data Heavy | 200+ closed won/lost, robust firmographic data, mature sales org | Medium | Rely heavily on correlation analysis from closed data |
| Approach 6: No Historical Data | Early stage (<50 customers), sparse CRM data, rely on interviews + Clay Searcher | Medium | Use interviews and Clay Searcher to validate criteria |

**Approach selection decision tree:**

| Question | Answer → Approach |
|----------|-------------------|
| How many sales reps? | 1-3 = T1 only, 5-10 = Tiered, 10+ = Full TAM if vertical |
| TAM size? | <100k = Full TAM, 500k+ = Tiered, Millions = T1 only |
| Vertical or horizontal? | Vertical = Full TAM feasible, Horizontal = T1 only |
| How many customers? | <50 = No Historical Data, 100-500 = Historical Heavy, 500+ = Full |
| CRM data quality? | Clean = Standard, Messy = CRM Cleanup First |
| Clay credit budget? | Unlimited = Enrich aggressively, Limited = T1 only |
| Stakeholder alignment? | Aligned = 3-4 meetings, Misaligned = 5+ meetings with refinement |

**Valuation methodology options:**

| Method | When to Use | Data Source |
|--------|------------|-------------|
| Revenue Coefficient | License-based or usage-based products | Company revenue vs your pricing |
| Employee Headcount Coefficient | Per-seat pricing models (HR tech, SaaS) | Headcount x seat price |
| Product-Specific Coefficient | Niche products with signal-based value indicators | Traffic, funding stage, etc. |
| Like Accounts Comparison | Can't find other coefficients | Existing customer profiles |
| Combination | Multiple data points available for triangulation | Average across methods |

---

# Phase 1: Strategy

**Goal:** Get stakeholder sign-off on ICP Matrix, Persona Matrix, and Valuation Methodology before building anything in Clay or CRM.

**Output:** Signed-off ICP Matrix (with tier thresholds), Persona Matrix (with scoring rubric), Valuation Methodology, Definition Alignment Document.

## 1a. Pre-Kickoff

Two parallel tracks run after the deal closes and before the kickoff call.

### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Market Map intro video | Explain what ICP operationalization means and why it matters | Video walkthrough (5-10 min) |
| Definition Alignment Document | Get stakeholder sign-off on ICP terms before building | Google Doc |
| Pre-filled intake form | Confirm CRM type, team size, existing ICP docs, verticals, geos, tools, Clay credits | Google Form or Doc |

**Intake form captures:**

- CRM type (Salesforce, HubSpot) and admin access status
- Sales team size (informs account volume: 50-10k per rep for T1)
- Existing ICP documentation (if any—will be re-engineered "the Clay Way")
- Target geographies, industries, verticals
- Technographic requirements
- Historical closed won/lost data availability (100+ customers? 200+ total closed?)
- Clay account status and credit budget
- Existing data provider subscriptions
- Stakeholder availability for 5+ meetings

**CRM exports needed:**

- All closed won and closed lost opportunities with firmographic attributes (minimum 1-2 years)
- Current account export with all available fields
- Current contact export

**Completion tracking:** RevOps Manager owns completion. Do not cancel kickoff if incomplete, but push hard afterward—the correlation analysis in Track B depends on this data.

### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Analyze CRM exports: run correlation analysis on closed won/lost | Win rate, deal size, sales cycle by segment |
| 2 | Run Clay Searcher to validate proposed ICP vectors | Market size estimates, vector feasibility |
| 3 | Draft v0 ICP Matrix (vectors, weights, thresholds—all ASSUMED) | ICP Matrix v0 |
| 4 | Draft v0 Valuation Methodology based on pricing model | Valuation formula draft |
| 5 | Test valuation formula against 10-20 existing customers | Calibrated formula |
| 6 | Create kickoff assets (preliminary tier distribution, questions list) | Kickoff presentation |

**Correlation analysis process (if sufficient historical data):**

1. Pull all closed won and closed lost deals
2. Enrich missing firmographic data in Clay before analysis
3. Calculate win rate, average deal size, and sales cycle length by segment
4. Identify which segments win at significantly higher rates
5. Run negative data analysis: compare closed lost vs closed won across segments
6. Identify high-loss segments, high-churn segments, displacement patterns

**For early-stage clients (<50 customers):** Skip correlation analysis. Rely on stakeholder interviews, Clay Searcher real-time validation, and AI deep research for initial vector hypotheses.

**Critical:** Mark everything in v0 as ASSUMED. The kickoff call validates.

### Stakeholder Alignment Document

Get stakeholder sign-off on ICP terms BEFORE building anything.

| Term | Our Definition | Internally Approved? |
|------|----------------|----------------------|
| ICP (Ideal Customer Profile) | Firmographic + technographic + behavioral attributes defining best-fit accounts | [ ] Yes / [ ] No |
| Tier 1 | Highest-fit accounts meeting X+ point threshold on fit score rubric | [ ] Yes / [ ] No |
| Tier 2 | Good-fit accounts meeting Y-X point threshold | [ ] Yes / [ ] No |
| Tier 3 | Accounts below Y point threshold | [ ] Yes / [ ] No |
| Account Valuation | Estimated ARR potential based on [coefficient approach] | [ ] Yes / [ ] No |
| Persona Tier 1 | Contacts matching exact title, right seniority, right department | [ ] Yes / [ ] No |

**Instructions to customer:**

Review each definition with your leadership team. Check "Yes" when approved. We cannot proceed until all terms are aligned. These definitions will drive every downstream decision—tier thresholds, territory equity, outreach prioritization.

---

## 1b. Kickoff Call

**Purpose:** Present v0 ICP Matrix and Valuation Methodology. Customer reacts and corrects, not creates from scratch.

### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-20 | Walk through v0 ICP Matrix | Present vectors, weights, preliminary tier distribution |
| 20-35 | Validate assumptions | Each ASSUMED vector: CONFIRMED or corrected |
| 35-50 | Valuation methodology review | Present coefficient approach, test against known accounts |
| 50-60 | Definition alignment | Review Definition Alignment Doc |
| 60-75 | ICP approach decision | Full TAM vs Tiered vs T1 Only based on scoping factors |
| 75-90 | Next steps | Schedule ICP Workshop, assign homework |

### What We Bring

- v0 ICP Matrix with all vectors marked ASSUMED
- Preliminary tier distribution from Clay Searcher validation
- Correlation analysis results (if historical data available)
- Valuation methodology draft
- Definition Alignment Document (pre-filled)
- Questions list (what we need to validate)

### What We Leave With

- Corrections to ICP vectors (info needed to create v1)
- Confirmed or revised valuation approach
- ICP approach decision (which of 6 approaches to use)
- Clear homework assignments (stakeholder data, CRM access, etc.)
- ICP Workshop scheduled

---

## 1c. Alignment Loop & Strategic Meeting Cadence

**Purpose:** Iterate on ICP Matrix, Persona Matrix, and Valuation Methodology until stakeholder sign-off.

### The Pattern

```
Kickoff (validate v0)
    |
Architect refines --> v1 ICP Matrix
    |
ICP Workshop (deep dive vectors, weights, thresholds)
    |
Architect refines --> v2 ICP Matrix, v1 Persona Matrix
    |
Persona Workshop (define personas, scoring)
    |
Architect refines --> Final matrices, begin Clay pull
    |
ICP Data Review 1 (present tier distribution from Clay)
    |
Adjust thresholds if needed --> Re-pull
    |
ICP Data Review 2+ (repeat until alignment)
    |
Sign-Off
```

### Meeting Sequence

| Meeting Type | Focus | Stakeholder | Duration |
|--------------|-------|-------------|----------|
| ICP Workshop | Vectors, weights, tier thresholds, fit scoring rubric | CRO, RevOps, Sales Leadership | 2 hours |
| Persona Workshop | Persona vectors, titles, seniority, scoring, coverage targets | Sales Leadership, Marketing | 2 hours |
| ICP Data Review | Tier distribution validation from actual Clay pull | RevOps, CRO | 1 hour |
| Final Review | Full walkthrough of all matrices and valuation, sign-off | All stakeholders | 1.5 hours |

**ICP Data Review calls are repeating milestones.** After pulling data into Clay, present tier distribution and valuation totals. May require multiple iterations—the real-world data often surprises stakeholders. Keep iterating until alignment.

**Persona Workshop is more flexible than ICP work.** Account lists are stable for 6-12 months, but people move constantly. Persona enrichment is often a fast-follow or ongoing engagement rather than a rigid milestone. Priority: get the right accounts with the right values first, then layer personas.

### Before Each Meeting

1. Process previous meeting transcript/notes
2. Update matrices (v[n-1] to v[n])
3. If post-Clay-pull: regenerate tier distribution
4. Prepare questions for next validation round

### After Each Meeting

1. Update ICP Matrix and/or Persona Matrix
2. Track what moved from ASSUMED to CONFIRMED
3. If Clay pull complete: re-run distribution and prepare Data Review

### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 1-2 days |
| Kickoff call | Day 1 of engagement |
| ICP + Persona Workshops | Week 1-2 |
| Clay pull + Data Review | Week 2-3 (may require 2-3 review cycles) |
| Strategic sign-off | Week 3-4 (when all inputs CONFIRMED) |

---

## 1d. Strategic Sign-Off

**Purpose:** Confirm we have everything before proceeding to Clay build.

### Validation Checkpoint

- Definition Alignment Document signed off by stakeholders
- ICP Matrix finalized: all vectors CONFIRMED, weights agreed, tier thresholds validated against Clay data
- Persona Matrix finalized: all persona vectors confirmed, scoring rubric agreed, coverage targets set
- Valuation Methodology confirmed: formula tested against existing customers, produces realistic estimates
- Tier distribution validated: stakeholders agree T1/T2/T3 counts and valuations make sense
- Approach confirmed (Full TAM / Tiered / T1 Only / etc.)
- Customer understands what we are building in Clay and CRM
- No blockers for engineering

### Decision Point

- **Proceed to Engineering** → Customer wants enriched CRM with tiered accounts and personas
- **Phase out** → Rare for Market Map; the strategic deliverables alone have limited value without operationalization. Market Map almost always proceeds through Phase 2.

---

# Phase 2: Engineering

**Goal:** Build Clay tables, enrich accounts and personas, push to CRM, create reporting.

**Output:** Enriched CRM with tiered accounts, valued territories, scored personas, and operational dashboards.

Market Map engineering is heavy—accounts and personas must be enriched, scored, pushed to CRM, and validated. This phase typically takes 40-60% of total project effort.

## Sub-Phases

```
2a Clay Architecture & Tech Spec --> 2b Engineering Handoff --> 2c Build --> 2d QA + Sign-Off
```

---

## 2a. Tech Spec

**Purpose:** Translate signed-off ICP and Persona Matrices into Clay table architecture and CRM field specifications.

**Input:** Signed-off ICP Matrix, Persona Matrix, Valuation Methodology from Phase 1

**What happens:**

1. Design Clay table architecture: account table, contact table, optional signal tables (M&A, job postings, security breaches, etc.)
2. Map each ICP vector to a Clay column and data provider
3. Determine enrichment sequence: which providers for which vectors, waterfall order, "only run if" conditions
4. Specify CRM fields to create: Account Tier, Valuation, ICP Fit Score, Persona Tier, Persona Fit Score, plus any ICP-specific fields
5. Define CRM push behavior per field: overwrite all, overwrite if blank, never overwrite
6. Define build sequence: accounts first, then reporting, then personas

**Clay table architecture decisions:**

| Decision | Options |
|----------|---------|
| Single vs multiple tables | Single master table for simple ICPs; multiple tables by signal type for complex setups |
| Data providers | Standard B2B: Apollo, Clearbit, ZoomInfo. Vertical-specific: Cause IQ (nonprofits), iBanknet (financial services), Definitive Healthcare, IPEDS (education) |
| Credit optimization | "Only run if" conditions on expensive enrichments, Score Row (free) for calculations, waterfall enrichment (cheapest first) |
| CRM push method | Clay CRM connector (Salesforce or HubSpot), update vs create workflows |

**Output:** Clay Table Architecture doc + CRM Field Mapping doc

---

## 2b. Engineering Handoff

**Purpose:** Review tech specs with engineer before building.

**Who attends:** Architect + Engineer (or engineering team)

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through ICP Matrix | Architect explains strategic context: why these vectors, why these weights |
| 15-25 | Clay table architecture | Review table structure, enrichment sequence, data providers |
| 25-35 | CRM field mapping | Review field names, picklist values, override rules |
| 35-45 | Build sequence and risks | Agree on order: accounts → reporting → personas. Flag credit budget concerns. |

**Engineer leaves with:**

- Approved Clay table architecture
- Clear CRM field mapping
- Build sequence with known dependencies
- Credit budget constraints

---

## 2c. Build (Configure)

**Purpose:** Build Clay tables, enrich data, push to CRM, create reporting.

### Build Sequence

#### Step 1: Account Table Build

1. Set up Clay account table with all ICP vector columns
2. Add valuation column, fit score column, tier assignment column
3. Pull accounts using appropriate method:
   - Clay Searcher (for net-new discovery)
   - CRM import (for existing account enrichment)
   - Hybrid waterfall (import CRM accounts, then find net-new via Clay Searcher, deduplicate)
4. Handle large lists: Clay has 2k record import limit—split into multiple source reports if needed

#### Step 2: Account Enrichment

1. Enrich firmographic data using data providers (Apollo, Clearbit, vertical-specific providers)
2. For custom criteria: use Claygent with custom enrichment prompts (e.g., "Does this nonprofit have 2+ related entities?", "Is this company showing EV incentive activity?")
3. Implement valuation calculation:
   - Simple: Score Row (free) for formulas like `IF(Employees > 1000, 100000, 50000)`
   - Complex: AI column with valuation prompt
4. Calculate ICP fit scores using Score Row
5. Assign tier based on thresholds
6. Add "only run if" conditions to optimize credits

#### Step 3: CRM Field Creation and Data Push

1. Create custom account fields: Account Tier, Account Valuation, ICP Fit Score (plus ICP-specific fields)
2. Validate picklist values align between Clay and CRM
3. Set up Clay CRM integration
4. Build update workflow (existing accounts) and create workflow (new accounts)
5. Set override behavior per field (overwrite all / overwrite if blank / never overwrite)
6. Add prevent-override checkbox for franchise/dealership scenarios
7. Normalize data before push (state codes, formatting) using AI column if needed
8. Test on 10-20 sample accounts, validate in CRM
9. Execute full push
10. Run validation: compare Clay counts to CRM counts, check for duplicates

#### Step 4: Reporting Build

Three levels of reporting (build before persona enrichment—reporting validates the model):

| Level | Reports |
|-------|---------|
| Executive Business Insight | Closed won/lost by tier, conversion rates by tier, revenue by tier, win rates across segments |
| Distribution / Finger on Pulse | Territory valuation by rep, account distribution by tier, which reps have which accounts |
| Individual Rep Cockpit | Market Map Dashboard (all metrics by tier), Signals Dashboard (optional: T1 accounts with buying signals), ABM Dashboard (optional: tier + ABM score overlay) |

**Reporting as validation checkpoint:** Before investing in persona enrichment, use reporting to sanity-check tiering. Pull sample T1 accounts—do they look right? Show territory valuation—is it equitable? If something is off, catch it here before proceeding.

#### Step 5: Persona / Contact Table Build

1. Set up Clay contact table linked to accounts table
2. Use Clay's People Search to find contacts at accounts based on persona criteria
3. Enrich contact data with waterfall: Apollo → Clearbit → ZoomInfo
4. Calculate persona fit scores, assign persona tier
5. Build duplicate prevention logic: Lookup by Account ID + Email, then by Account ID + LinkedIn URL, only create if both return 0
6. Prioritize just-in-time enrichment: T1 account personas first, T2 only when entering outbound cadence, T3 minimal

#### Step 6: Contact CRM Push

1. Create custom contact fields: Persona Tier, Persona Fit Score, LinkedIn URL
2. Map Clay contact columns to CRM fields
3. Test on 10-20 samples, then full push
4. Run persona coverage validation: enough Tier 1 personas at T1 accounts?

---

## 2d. QA / Test + Sign-Off

**Purpose:** Verify the build works and get customer approval.

**Data QA checklist:**

- All data pushed—compare Clay source counts to CRM counts
- No corporate/branch data overrides (franchise scenarios checked)
- Valuation formula produces realistic ARR estimates (tested against known customers)
- ICP fit scoring produces reasonable tier distribution (T1 not 90% or 0.1%)
- Expected account volume per rep is 50-10k accounts
- Clay credit usage within budget
- CRM field mapping is 1:1 correct, picklist values match exactly
- Waterfall duplicate prevention tested and working for contacts
- 10-20 accounts/contacts manually reviewed in CRM (all fields populated correctly)
- No duplicate accounts or contacts (search by domain/email/LinkedIn after load)
- Validation reports show expected distribution (T1/T2/T3 counts, valuation totals, persona coverage)
- Territory valuation equitable across reps (no rep has 10x another's value)

**Customer testing:**

1. Walk customer through CRM filtered by T1 accounts (show data live)
2. Show valuation distribution across tiers
3. Show persona coverage at top accounts
4. Have them test real scenarios: filter for T1 + Tier 1 persona, run territory report
5. Address any misclassified accounts—document for refinement

**Engineering sign-off checkpoint:**

- CRM data matches strategic intent from Phase 1
- All reports and dashboards rendering correctly
- Customer has tested and approved
- Ready for enablement

---

# Phase 3: Enablement

**Goal:** Customer team can actually use what we built—filter by tier, prioritize outreach, interpret dashboards, maintain the system.

**Output:** Trained team with documentation, stabilized system, no critical issues.

## Sub-Phases

```
3a Training Prep --> 3b Training Sessions --> 3c Hypercare --> 3d Enablement Sign-Off
```

---

## 3a. Training Prep

**Purpose:** Create training materials from strategic and technical documentation.

**Input:** ICP Matrix, Persona Matrix, CRM field mapping, dashboards, Clay table architecture

**Training package to create:**

- Video walkthrough scripts: ICP Matrix walkthrough, CRM dashboard navigation, Clay table maintenance, Maintenance playbook walkthrough
- Written guides: CRM field usage guide, Clay architecture guide
- FAQ draft: "What makes an account T1?", "How do I add new accounts?", "Why is this account Tier 2 not Tier 1?", "How do I interpret fit scores?"

---

## 3b. Training Sessions

**Purpose:** Transfer knowledge by stakeholder role.

| Session | Audience | Focus | Duration |
|---------|----------|-------|----------|
| RevOps Deep Dive | RevOps Manager | Clay table maintenance, incremental enrichment, credit monitoring, sync troubleshooting, how to add new accounts, how to update ICP criteria | 60 min |
| Sales Leadership | VP Sales, Directors | Territory valuation reports, closed won/lost by tier, building outbound lists, assigning territories based on valuation | 45 min |
| Marketing | VP Marketing, Demand Gen | Audience segmentation by tier, campaign targeting, conversion rate tracking by tier | 30 min |
| AE / SDR Training | Individual Contributors | What T1/T2/T3 means, how to prioritize outreach (T1 first), using persona data for personalization, interpreting fit scores, dashboard navigation | 30 min |
| Executive Briefing | CRO, Executive Sponsor | Strategic overview: tier distribution, territory equity, TAM feasibility, what to look for at 30/60/90 days | 30 min |

**Delivery:**

1. Schedule sessions with appropriate stakeholders
2. Deliver live and record as video walkthroughs
3. Answer questions, note gaps
4. Update FAQ with questions raised

**The "Get to Work" moment:** Enablement is where Market Map stops being a strategic exercise and becomes tactical. After this, reps can filter T1 + Tier 1 personas and start sequences, multi-thread into top accounts, and use dashboards to prioritize their day.

---

## 3c. Hypercare

**Purpose:** Intensive post-launch support to stabilize the system.

**Duration:** 30 days (aligned with first sales cycle validation window)

**What happens:**

- Weekly 30-min office hours (Q&A, troubleshooting)
- Quick response to data quality issues (misclassified accounts, missing fields)
- Bug triage and fixes (sync failures, formula errors)
- First sales cycle monitoring: are reps actually using tier data to prioritize?

**What to watch for:**

- Reps reverting to old behavior (ignoring tier data)
- Accounts that "feel wrong" (flag for refinement review)
- CRM filtering confusion
- Clay credit burn rate

---

## 3d. Enablement Sign-Off

**Purpose:** Confirm customer can operate independently.

**Validation checkpoint:**

- All training sessions delivered
- All video recordings and documentation provided
- Hypercare period complete (30 days)
- No critical issues outstanding
- RevOps can maintain Clay tables and run incremental enrichment
- Sales/Marketing can filter and report by tier
- Customer understands refinement triggers and maintenance cadence
- Ready for handoff

---

# Phase 4: Handoff

**Goal:** Clean project close with maintenance plan established and retention/expansion path set.

**Output:** Maintenance schedule documented, internal context transferred, customer owns the system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule --> 4b Internal Handoff --> 4c External Handoff --> 4d Project Close
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|--------------------|----|
| Single Project | Customer owns | 4c (External Handoff)—customer receives and runs it |
| Dedicated (Multi-Project) | Architect owns | 4b (Internal Handoff)—Architect receives and runs it |

---

## 4a. Maintenance Schedule

**Purpose:** Document what needs ongoing attention—Market Map is not one-and-done. Business priorities change, product offerings evolve, people move jobs, tiers need regular validation.

### Monthly Tasks

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|--------------------|
| Incremental account enrichment | Run new CRM accounts through Clay tables to enrich and tier | New accounts not being tiered within 30 days |
| Clay credit monitoring | Track credit burn, check for runaway enrichments | Burn rate exceeding monthly budget allocation |
| CRM data quality checks | Audit for duplicate accounts/contacts, domain normalization issues, blank tier/valuation fields | >5% of accounts with blank tier fields |
| Monthly account refresh (optional) | Redistribute hottest T1 accounts with highest intent signals to AEs (most companies do this quarterly or annually) | Stale accounts sitting with same rep >6 months |

### Quarterly Tasks

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|----------------|--------------------|
| Persona coverage refresh | Run People Search in Clay to find new Tier 1 personas at T1 accounts (people change jobs constantly) | If <50% T1 accounts have Tier 1 personas, trigger enrichment run |
| Report-driven persona enrichment | Build CRM report showing T1 accounts missing multiple seniority levels; push to Clay for persona fill | If significant gaps, run targeted enrichment |
| Data provider optimization | Test if switching providers reduces credit costs or improves data accuracy | Switch if >20% cost savings identified |

### After First Business Cycle (30-90 Days Post-Launch)

This is the critical validation checkpoint where the system can be measured against reality:

- **ICP refinement:** Pull CRM report on closed won/lost by tier. If closing more T3 than T1, or losing T1 consistently, adjust ICP criteria based on actual performance
- **Tier validation questions:**
  - Are T1 accounts taking the least time to close?
  - Are T1 accounts converting the strongest?
  - Are the people we expected to be buying still the ones buying?
  - If not, dig deeper and adjust criteria
- **Territory equity check:** Review territory valuations after first cycle of wins/losses

### Refinement Triggers (When to Re-engage)

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Closing T3 at higher rate than T1 | T3 win rate > T1 win rate for 60+ days | Re-engage specialist, adjust ICP criteria based on what's actually closing |
| Aspirational T1 not matching buying patterns | T2 converting better than T1 after 6 months | Consider flipping tiers (keep middle as T1, edges become T2/T3) |
| Significant business change | New product, pricing change, market shift | Scope refinement project |
| Territory imbalance | One rep has >2x another's territory value | Rebalance territory assignments |

### Every 6-12 Months (Minimum Twice Yearly)

- **ICP validation review:** Re-run historical closed won/lost correlation to validate ICP assumptions still hold
- **Valuation recalibration:** If pricing model or ACVs changed significantly, update valuation formula and re-score accounts
- **Territory rebalancing:** Review territory valuations to ensure reps have equitable values after wins/churn
- **Market conditions assessment:** External factors (economy, competitive landscape) may require re-baselining

---

## 4b. Internal Handoff

**Purpose:** Transfer context so Architect can manage ongoing relationship.

**What the Architect needs to know:**

- ICP criteria and valuation methodology (strategic context)
- Customer stakeholders: who owns CRM, who approved ICP, who is executive sponsor
- Tier distribution: how many T1/T2/T3 accounts, total valuations
- Common issues: which data providers are flaky, which CRM fields need monitoring
- Maintenance schedule: monthly/quarterly/annual tasks
- When to escalate back to specialist

**Escalation guidelines:**

| Issue Type | Who Handles |
|-----------|------------|
| Simple: add new accounts, re-run enrichment, minor CRM questions | Architect |
| Moderate: adjust tier thresholds, update valuation formula, new persona criteria | Specialist needed |
| Major: ICP criteria overhaul, segment additions, Clay workflow redesign | Specialist + new project scope |

**For Dedicated engagements:** Architect also receives the maintenance schedule and becomes responsible for executing it. The specialist walks Architect through each maintenance task.

---

## 4c. External Handoff (LeanScale to Customer)

**Purpose:** Formal project completion with customer.

**Final project meeting agenda:**

1. **Show the Results Live**
   - Walk through CRM filtered by T1 accounts
   - Show valuation distribution across tiers
   - Show persona coverage at top accounts
   - Demonstrate territory equity (territory valuation by rep report)

2. **Review Documentation Package**
   - ICP Matrix (final version)
   - Persona Matrix (final version)
   - Valuation methodology and formula
   - Clay table architecture guide
   - CRM field usage guide
   - All video recordings
   - FAQ document
   - Maintenance Playbook

3. **Walk Through Maintenance Schedule**
   - Monthly, quarterly, annual tasks
   - Refinement triggers
   - For Single Project: this is now the customer's responsibility

4. **Set Refinement Expectations**
   - After 1 sales cycle (30-90 days), review closed won/lost by tier
   - If closing more T3 than T1, refine ICP criteria
   - Document any accounts that seem wrong tier for future refinement

5. **Review the Numbers**
   - Total accounts/contacts loaded by tier
   - Total valuation by tier
   - Credit spend vs budget

6. **Confirm Project Complete**
   - Make it explicit: "Project complete"
   - Schedule refinement check-in (30-90 days out)

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video walkthrough. Make sure they understand what to check, how often, and when to call back.

---

## 4d. Project Close

**Purpose:** Clean internal wrap-up + establish retention/expansion path.

### Archive Checklist

- All project artifacts saved (ICP Matrix, Persona Matrix, Clay table docs, CRM field mapping)
- Handoff documentation complete
- Project status updated in tracking system
- Clay table ownership transferred to client account

### Retention / Expansion

**Single Project Path:**

```
1. Upsell: Managed Services (ongoing Market Map maintenance + signals monitoring)
   | if no
2. Downsell: Another project (automated inbound, outbound enrichment, territory design, lead scoring)
   | if yes
3. Retry retainer at end of next project cycle
```

**Script:**

Now that Market Map is complete, there are two ways we can continue working together. Option 1: We can set you up on managed services where we handle ongoing ICP refinement, persona enrichment, and signals monitoring. Option 2: If there's another specific project you need—like automated inbound flows that reference your Market Map for lead prioritization, or territory design using your account valuations—we can scope that out. Which sounds more interesting?

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff:

On [date ~90 days out], we'll review how Market Map is performing—are T1 accounts closing faster? Is the territory equity holding up? We'll adjust ICP criteria if needed based on real data.

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull closed won/lost by tier, territory valuation reports |
| 3. Decide ownership | Can Architect handle this check-in, or need specialist? |
| 4. Prep materials | If specialist needed, brief them. If Architect, prep talking points. |

---

# Deliverables & Assets Summary

**Strategic Deliverables:**

- ICP Matrix: T1/T2/T3 criteria, vector weights, tier thresholds, fit scoring rubric
- Persona Matrix: Tier 1/2/3 criteria, persona scoring rubric, coverage targets
- Valuation Methodology: coefficient approach, formula, tested against existing customers
- Definition Alignment Document (final signed-off version)

**Technical Deliverables:**

- Enriched CRM: all ICP-qualified accounts with tier, valuation, fit score fields; all personas with persona tier, persona fit score, LinkedIn URL
- Clay Tables: account table with enrichment workflows and scoring logic; contact table with persona enrichment and waterfall duplicate prevention; optional signal tables
- CRM Reports & Dashboards: Executive Business Insight (closed won/lost by tier), Distribution (territory valuation by rep), Rep Cockpit (metrics by tier, optional signals and ABM dashboards)

**Documentation Package:**

- Training video recordings (ICP walkthrough, CRM navigation, Clay maintenance, Maintenance playbook)
- CRM field usage guide
- Clay table architecture guide (columns, data providers, credit optimization)
- FAQ document
- Maintenance Playbook (monthly/quarterly/annual tasks, refinement triggers)

---

# Appendix

## What This Document Is

This is the implementation playbook—the step-by-step execution guide an Architect follows to deliver a Market Map project from first contact to project close. It is the third file in a 3-file playbook structure: Overview (what it is), Methodology (how we think about it), and Implementation (what to do).

## What Each Phase Produces

| Phase | Output | Gate Criteria |
|-------|--------|---------------|
| Phase 1: Strategy | Signed-off strategic package (Definition Alignment Doc + deliverables) | Customer stakeholders have approved definitions and strategic asset |
| Phase 2: Engineering | Built and tested system | System matches tech spec, all tests pass, customer has approved |
| Phase 3: Enablement | Trained team with documentation | All training delivered, hypercare complete, team can operate independently |
| Phase 4: Handoff | Independent customer + archived project | Internal/external handoffs complete, maintenance plan in place, project closed |

## How to Adapt Per Project Type

Not every project weighs each phase equally. Before filling this template, determine your project's profile:

| Project Profile | Strategy Weight | Engineering Weight | Enablement Weight | Example Projects |
|-----------------|-----------------|-------------------|-------------------|------------------|
| Strategic-heavy | 60-80% | 10-20% | 10-20% | Growth Model, GTM Strategy |
| Engineering-heavy | 10-20% | 60-80% | 10-20% | CRM Migration, Data Pipeline |
| Enablement-heavy | 20-30% | 20-30% | 40-50% | Quote-to-Cash, Process Rollout |
| Balanced | 30-40% | 30-40% | 20-30% | Attribution, Lead Scoring |

**Adaptation rules:**

- **Light phases** can compress sub-phases (e.g., a strategic-only project may skip Phase 2 entirely)
- **Heavy phases** expand with more sub-steps, more meetings, more agent runs
- **Phase 4 always applies**—every project needs handoff, but the maintenance schedule complexity varies
- Mark phases as `[SKIP]` or `[LIGHT]` in the One-Pager if they don't fully apply

## Roles

| Role | What They Do |
|------|--------------|
| Architect | Owns the customer relationship, leads strategy, creates specs, does enablement, owns account post-delivery |
| Engineer | CRM build, automation, dashboards (Phase 2) |
