# HubSpot to Salesforce Migration — Methodology

## 1) Core Concepts

### ETL vs ELT

**What is it?**

Two approaches to data transformation during a CRM migration. ETL (Extract, Transform, Load) cleans and restructures data _before_ loading it into the destination system. ELT (Extract, Load, Transform) moves data as-is into the destination system and transforms it _after_ loading.

In a CRM context: ETL means auditing every field, deduplicating records, restructuring picklist values, and consolidating objects in a staging environment before any data touches Salesforce. ELT means importing raw HubSpot data into Salesforce first, then cleaning it up inside the live system.

**Why does it matter?**

The choice affects project sequence, timeline, budget, and end-state quality. ETL produces a cleaner Salesforce instance from day one but requires more upfront effort. ELT gets the system live faster but creates downstream cleanup work that often exceeds the time saved.

**Key insight:**

"If you're not doing any transformation, it's just field mapping and data migration - which is how zero migrations actually get done."

Every real-world migration involves some transformation. The question is whether you do it before or after loading. Industry data supports the ETL-first approach: skipping thorough data cleansing causes 70% of migration failures.

**Examples:**

| Context | How ETL/ELT Applies |
|---------|-------------------|
| Client with 500 HubSpot fields, 30% junk data, and budget for cleanup | ETL: Audit fields, deduplicate, restructure, then load clean data into Salesforce. Results in a usable system from day one. |
| Client with tight timeline, clean-ish data, constrained budget | ELT may be necessary: Load data as-is, transform iteratively in Salesforce. Risk of compounding issues post-launch. |
| A prior migration (real example) | Went ELT and had complications downstream. Time saved upfront was lost in post-load cleanup. |

**Common misunderstandings:**

- **Misconception:** ELT is faster, so it is better for tight timelines. **Reality:** ELT shifts work to the post-launch period when the team is also handling user adoption, training, and bug fixes. Prior migrations have demonstrated that ELT complications can exceed the original time savings. ETL front-loads the hard work when the team has the most focus.

- **Misconception:** ETL and ELT are binary choices. **Reality:** Most migrations are ETL-dominant with selective ELT for low-risk objects. For example, you might ETL contacts/leads (complex transformation) while ELT-ing accounts (relatively simple 1:1 mapping).

### Contacts-to-Leads Architecture

**What is it?**

The fundamental architectural difference between how HubSpot and Salesforce store people records. HubSpot uses a single Contact object for everyone - prospects, leads, customers, and partners all live in one place. Salesforce separates people into two distinct objects: Leads (pre-qualification) and Contacts (post-qualification, attached to Accounts).

Every HubSpot-to-Salesforce migration must decide how to split one object into two. This decision cascades into conversion flows, lifecycle stage design, automation triggers, and reporting structure.

**Why does it matter?**

"The contacts-to-leads decision is particularly noteworthy because it's the one that isn't one-to-one between the systems. HubSpot has contacts, Salesforce has leads AND contacts - they're fundamentally different. This specific architectural decision impacts conversion flows, creation flows, and lead lifecycle design."

This is the single most impactful architecture decision in the migration. Get it wrong, and every downstream automation, report, and user workflow breaks.

**The Framework:**

| Feature | HubSpot | Salesforce | Why It Matters |
|---------|---------|-----------|---|
| Object model | Single Contact object for leads + contacts | Separate Lead and Contact objects | Architecture decision required during scoping |
| Contact attachment | Contacts can be free-floating | Contacts MUST attach to an Account | Gmail/personal email signups need a routing strategy |
| Deal/Opp mapping | Deals | Opportunities | Generally one-to-one mapping |
| Quoting | Native quoting built in | No native equivalent | May need CPQ tool evaluation (DealHub, Subskribe, Salesforce CPQ) |

**Approach options:**

| Approach | Frequency | When to Use | Key Considerations |
|----------|-----------|-------------|---|
| Lead-based (recommended) | ~93% of projects (~14 of 15) | Most scenarios | Anything earlier than an opportunity goes to Leads. Requires lead lifecycle design including statuses, conversion triggers, and routing rules. |
| Contact-only | ~7% of projects (~1 of 15) | Very rare; only with tight data universe control | Gmail/personal email signups become problematic because Salesforce Contacts must attach to an Account. There is no "Google" account to attach a gmail.com signup to. May require "orphanage" accounts as a workaround. |

**Common misunderstandings:**

- **Misconception:** Contact-only is simpler because you skip the Lead object entirely. **Reality:** Contact-only creates new problems. Every Contact in Salesforce must attach to an Account. When web visitors sign up with personal email addresses (gmail.com, yahoo.com), there is no company Account to attach them to. You end up creating workaround "orphanage" Accounts, which defeats the purpose of simplification.

- **Misconception:** The Lead-based approach is more work. **Reality:** Lead-based is more setup initially, but it aligns with Salesforce's native architecture. Conversion flows, reporting, and automation all work as Salesforce intended. Fighting the platform's design creates more long-term maintenance burden.

### The Big Five (Scoping Categories)

**What is it?**

Five object categories that must be scoped and decided upon in every HubSpot-to-Salesforce migration. These form the backbone of the scoping phase and produce the architecture decisions that cascade into every subsequent project phase.

1. **Accounts** - Company records. Usually the least controversial; HubSpot Companies map relatively cleanly to Salesforce Accounts. Key decisions: hierarchy structure, record types, and parent-child relationships.

2. **Opportunities** - Revenue records. HubSpot Deals map to Salesforce Opportunities. Key decisions: stage definitions, multiple opportunity types (new business, renewal, expansion), and pipeline structure.

3. **Contacts/Leads** - People records. The noteworthy category because HubSpot's single Contact object maps to Salesforce's dual Lead + Contact objects. Key decisions: lead-based vs contact-only, lifecycle stages, conversion triggers. (See "Contacts-to-Leads Architecture" above.)

4. **Technology** - Third-party tool strategy. Every tool connected to HubSpot needs a migration plan: reconnect to Salesforce, replace with an alternative, or deprecate. Examples: Gong, Salesloft, Outreach, ChurnZero, CPQ tools.

5. **Overall Data Structure** - Transformational decisions that cut across all objects. Key decisions: custom objects, field consolidation, data cleanup scope, and whether to restructure processes during the move.

**Why does it matter?**

Each of these five categories requires architecture decisions that produce downstream dependencies. Skipping or deferring decisions in any category creates blockers later. Scoping outputs are documented in Word documents, Lucid charts, and data mapping spreadsheets - these become the source of truth for the engineering phase.

**Key insight:**

The Big Five categories are sequential in priority but parallel in execution. Accounts and Opportunities can often be scoped simultaneously, while Contacts/Leads requires dedicated focus due to the object model difference. Technology scoping runs in parallel throughout. Data Structure decisions crystallize last, once the other four categories reveal transformation needs.

### The Hits (Foundational Automations)

**What is it?**

A set of high-impact, low-effort automations included in every migration as best practices. These are the foundational workflows that every well-built Salesforce instance should have, regardless of the client's specific business. During a migration, "The Hits" get built as part of the Salesforce configuration phase.

**What they include:**

| Automation | Purpose |
|-----------|---------|
| Stage timestamps | Record when Leads and Opportunities move between stages; enables velocity reporting |
| Conversion checkboxes | Track whether a Lead has been converted; supports lifecycle reporting |
| Stage timing workflows | Document how long records spend in each lifecycle stage |
| Renewal infrastructure | Automatically generate recurring revenue renewal Opportunities |
| ACV/TCV calculations | Calculate Annual Contract Value and Total Contract Value from Opportunity fields |
| Increase/expansion tracking | Fields to track upsell and expansion revenue separately from new business |
| Commission-related fields | Fields needed for sales compensation calculations |
| Attribution fields (basic) | Simple attribution tracking - source, campaign, first/last touch |

**Why does it matter?**

The Hits serve two purposes: (1) they give every new Salesforce instance a working operational foundation, and (2) they capture improvements that would otherwise get deferred indefinitely. Migration is the best window for this work because you are already introducing disruption.

**Key insight:**

"Some Hits are a subcomponent of a larger project (e.g., attribution Hit vs. full Attribution project). Migration = basic setup. Full implementation with operational depth = separate project."

The critical warning here is scope control. During scoping, gauge the client's appetite for each Hit. A prior migration is the cautionary example:

"One client got 8 attribution fields when they only needed 1. Gauge appetite during scoping."

Migration-level attribution means 1-2 basic fields (e.g., Lead Source, Original Campaign). A full attribution implementation with multi-touch models, weighted scoring, and reporting dashboards is a separate project.

### Field Audit Methodology

**What is it?**

A systematic per-field analysis of every field in the source HubSpot instance to determine the migration action: keep, transform, or delete. The field audit is performed per object (Contacts, Companies, Deals) and produces a spreadsheet that becomes the migration specification.

**Per-field criteria:**

For every field, document:

| Criterion | What to Capture | Why It Matters |
|-----------|-----------------|---|
| Field name | Exact HubSpot field name | Mapping reference |
| Field type | Text, number, picklist, date, etc. | Determines Salesforce field type and potential conversion issues |
| Fill rate | Percentage of records with a value | Fields below ~10% fill rate are candidates for deletion |
| Last updated date | When the field was last modified | Stale fields (no updates in 6+ months) may be deprecated |
| Update method | Manual entry, workflow, calculated, integration | Determines whether automation recreation is needed |
| System field? | Yes/No - is it created by the system? | System fields may not need explicit migration |
| Used in workflows? | Yes/No - is it referenced in active workflows? | Deleting a workflow-dependent field breaks automation |
| Picklist options | All dropdown values | Opportunity to consolidate, rename, or remove unused values |

**Transformation priorities during the audit:**

- **Minimize multi-picklist fields** - These cause reporting issues in Salesforce because each combination is treated as a unique value
- **Minimize free-text fields** - Causes data consistency issues; convert to picklists where possible
- **Identify duplicates** - Fields that capture the same information under different names
- **Identify junk data** - Records or field values that should not migrate

**Key insight:**

"If they have 500 fields in HubSpot, we're not going to lift and replace. We want to analyze: Are these fields actually being used? Are they providing value? Is there anything funky about the data structure itself?"

Industry benchmarks support aggressive field rationalization. Salesforce best practices suggest that 20-40 critical fields across core objects (Opportunities, Accounts, Cases) are sufficient to support executive dashboards and operational reporting. A typical mid-market HubSpot instance may have 200-500+ fields per object, but fill rates commonly reveal that only 30-50% are actively used.

The typical B2B CRM contains 15-30% duplicate records. A field audit that surfaces these duplicates before migration prevents compounding the problem in the new system. Sales teams waste approximately 550 hours per rep annually due to inaccurate CRM data, including duplicates.

### Workback Plan as Living Document

**What is it?**

A milestone-based planning document (Excel/Google Sheets or Gantt-style) that lists all deliverables, decisions, and dependencies needed to complete the migration on time. Unlike a static project plan, the workback plan evolves as scoping decisions are made and new requirements surface.

**Characteristics:**

| Attribute | Detail |
|-----------|--------|
| Typical size | 25-30 items for standard migration; 100+ for mergers |
| Format | Excel/Google Sheets or Gantt chart |
| Contents | Decision deadlines, deliverable deadlines, team/license needs by date, dependencies between items |
| Update frequency | Updated as scope evolves (e.g., CPQ evaluation gets added when that decision surfaces) |

**Why does it matter?**

The workback plan serves as the shared artifact between LeanScale and the client that tracks what needs to happen and when. It answers questions like: "When do we need Salesforce licenses by?" and "What decisions need to be made before we can start building automations?"

**Key distinction:**

The workback plan is NOT a project plan in the traditional sense. It does not assign individual tasks or track hours. It tracks _milestones and dependencies_ - the critical path items that, if delayed, push the entire timeline.

---

## 2) Decision Frameworks

### Approach Selection Matrix

The first thing to check when starting a migration project. Two independent decisions must be made: (1) transformation approach and (2) contact architecture.

**Transformation Approach:**

| Situation | Recommended Approach | Why |
|-----------|-------------------|-----|
| Data cleanup needed, budget allows, timeline is 12+ weeks | ETL (recommended) | Transform before loading. Cleaner end state from day one. Avoids post-launch cleanup burden. |
| Tight timeline (<8 weeks) or heavily constrained budget | ELT | Load as-is, transform later. Gets system live faster but creates technical debt. |
| Partial cleanup needed, some objects clean and some messy | Hybrid ETL/ELT | ETL the complex objects (Contacts/Leads, Opportunities), ELT the simple ones (Accounts). Balances timeline with quality. |

**Contact Architecture:**

| Situation | Recommended Approach | Why |
|-----------|-------------------|-----|
| Standard B2B operation (~93% of cases) | Lead-based (recommended) | Anything pre-opportunity goes to Leads. Aligns with Salesforce native architecture. Requires lead lifecycle design. |
| Very tight data universe control, no inbound from personal emails, rare (~7%) | Contact-only | Skips the Lead object. Only works when every person entering the system has a known company. Gmail/personal email signups break the model. |

### Scoping Factors

These ten variables determine project complexity, timeline, and which approaches to recommend. Assess each during discovery.

**1. Motion (PLG vs SLG vs ELG)**

- PLG (Product-Led Growth) -> Higher volume of leads, more self-serve signups, more personal email addresses. Strongly favors lead-based architecture with routing rules.
- SLG (Sales-Led Growth) -> More structured lead flow, usually from defined channels. Lead-based architecture with standard lifecycle.
- ELG (Ecosystem-Led Growth) -> Partner-originated leads, may need partner Account relationships. Adds Account hierarchy complexity.

**2. Appetite for Change**

- High appetite -> ETL approach with significant transformation. Client wants to use the migration as an opportunity to redesign processes.
- Low appetite -> Closer to lift-and-shift. Minimize disruption, replicate existing processes in Salesforce as closely as possible.

**3. Timeline**

- 12+ weeks available -> Standard ETL with full scoping, field audit, and transformation
- 8-12 weeks -> Compressed timeline, may need to parallelize scoping and early build phases
- <8 weeks -> ELT likely necessary; flag risk of post-launch complications

**4. Existing Infrastructure and Tech Debt**

- Heavy third-party tool ecosystem -> More coordination, more cutover windows, more risk
- Clean tech stack -> Simpler migration, fewer dependencies
- HubSpot-specific capabilities (e.g., native quoting) -> Need Salesforce alternatives identified during scoping

**5. Data Structure Complexity**

- Standard objects only -> Lower complexity
- Custom objects -> Each requires a Salesforce equivalent designed and built
- Transformational changes needed -> Usually more common in mergers; adds significant hours

**6. Transformation Scope**

- More transformation = more hours but better end state
- Less transformation = faster but carries forward existing problems
- Zero transformation is rare; the "T" in ETL is where the value is

**7. Third-Party Tool Ecosystem**

- Tools with tight cutover windows (Salesloft, Outreach) -> Precise timing required; too early or too late = data loss
- Tools that can go early (CPQ, new net-additions) -> Can build from day one without impacting current operations
- Tools requiring vendor coordination (ChurnZero, etc.) -> Check if client has negotiated migration support in contracts

**8. Data Volume**

- <10,000 records per object -> Simple, manual export/import may suffice
- 10,000-100,000 records -> Standard migration tooling, test migrations recommended
- 100,000+ records -> Performance considerations, batch processing, extended migration windows

**9. Custom Objects**

- None -> Standard migration path
- 1-3 custom objects -> Moderate additional scoping and build time
- 4+ custom objects -> Significant additional complexity; each needs schema design, field mapping, and relationship configuration

**10. Contacts-to-Leads Architecture Decision**

- Lead-based (most common, ~14 of 15) -> See Contacts-to-Leads Architecture in Core Concepts
- Contact-only (rare) -> See Contact-Only edge case below

### ETL Approach (Recommended)

**Best for:**

- Organizations with significant data quality issues (>15% duplicate rate, low field fill rates)
- Clients who want to use the migration as a process improvement opportunity
- Projects with 12+ week timelines
- Situations where the end state matters more than speed to go-live

**Not recommended for:**

- Extremely tight timelines where the system must be live in <8 weeks
- Severely constrained budgets that cannot accommodate transformation hours
- Situations where HubSpot data is already clean and well-structured (rare)

**Key differences from lift-and-shift:**

| Aspect | Lift-and-Shift (ELT) | ETL |
|--------|-----------------|-----|
| When transformation happens | After data is in Salesforce | Before data enters Salesforce |
| End-state quality | Carries forward existing problems | Clean from day one |
| Timeline | Faster to go-live, longer to stabilize | Longer to go-live, immediate stability |
| Risk profile | Post-launch complications likely | Front-loaded effort, lower post-launch risk |
| Typical hours | ~100-120 for migration, but ongoing cleanup | ~150 for standard, includes transformation |

### ELT Approach

**Best for:**

- Tight timelines (<8 weeks to go-live)
- Constrained budgets where transformation hours are not funded
- Relatively clean source data that needs minimal restructuring
- Situations where getting off HubSpot quickly is the priority (e.g., contract expiration)

**Not recommended for:**

- Messy source data with high duplicate rates or low field fill rates
- Organizations that want process improvements as part of the migration
- Projects where post-launch cleanup resources are not guaranteed

**Key risks:**

1. Post-launch cleanup often exceeds estimated effort because problems compound once users start interacting with the system
2. Prior migrations that used ELT experienced downstream complications that required significant rework
3. User adoption suffers when the new system inherits old problems - training becomes harder when data quality is inconsistent

---

## 3) Benchmarks & Standards

> **Note:** This is a qualitative/process project. Benchmarks here serve as reference points for scoping, timeline estimation, and data quality assessment - not as scoring metrics.

### How to Use Benchmarks

Benchmarks are guidelines, not rules. Always:

1. Start with benchmark as baseline
2. Adjust based on client-specific data (record volume, complexity, tech stack)
3. Validate against their actual HubSpot instance during the field audit
4. Document deviations and rationale in the workback plan

### Migration Timeline Benchmarks

| Factor | Small (Quick) | Standard | Complex (Merger) | Source |
|--------|--------------|----------|-----------------|--------|
| Total project hours | 80-120 | ~150 | 350-400 | LeanScale internal data |
| Total project duration | 6-10 weeks | 12-16 weeks | 20-30 weeks | Industry benchmarks |
| Scoping phase | 1-2 weeks | ~4 weeks (first 30 days) | 6-8 weeks | LeanScale internal data |
| Data cleanup/transformation | 1-2 weeks | 2-4 weeks | 4-8 weeks | Industry benchmarks |
| Build phase | 2-4 weeks | 4-6 weeks | 8-12 weeks | LeanScale internal data |
| Hyper-care | 2 weeks | 2-4 weeks | 4+ weeks | LeanScale internal data |

**Interpretation:**

- **Below small range:** Likely a partial migration or lift-and-shift with minimal transformation. Confirm this is intentional.
- **Above complex range:** Likely involves a merger, multiple source systems, or significant process redesign beyond migration scope.

### Data Quality Benchmarks

| Metric | Good | Warning | Red Flag | Source |
|--------|------|---------|----------|--------|
| Duplicate record rate | <3% | 3-10% | >10% (actively preventing sales team from functioning) | Industry data |
| Field fill rate (critical fields) | >85% | 60-85% | <60% | Salesforce best practices |
| Active fields vs total fields | >50% actively used | 30-50% actively used | <30% actively used (heavy rationalization needed) | Field audit pattern |
| Stale fields (no updates in 6+ months) | <20% of total fields | 20-40% | >40% | Field audit pattern |
| Records with outdated info | <15% | 15-25% | >25% | B2B data decay rates |

**Interpretation:**

- **Duplicate rate above 10%:** The field audit will uncover significant deduplication work. Factor additional hours into the workback plan. Consider whether deduplication should be a separate parallel project.
- **Field fill rate below 60%:** Most fields are empty. Aggressive field rationalization during the audit will reduce Salesforce build scope and simplify the migration.

### Field Audit Sizing Benchmarks

| Instance Size | Typical Field Count (per object) | Expected Keep Rate | Audit Duration |
|---------------|--------------------------------|------------------|---|
| Small (startup, <50 employees) | 50-150 fields | 60-70% | 1-2 days per object |
| Mid-market (50-500 employees) | 150-350 fields | 40-60% | 2-4 days per object |
| Enterprise (500+ employees) | 300-500+ fields | 30-50% | 4-7 days per object |

**Key reference point:** Salesforce allows up to 500 custom fields per object on Enterprise Edition, but best practice holds that 500 fields is too many from both a scaling and user experience perspective. The field audit exists precisely to prevent this bloat from transferring between systems.

### Quick Reference Thresholds

| Question | Good | Warning | Red Flag |
|----------|------|---------|----------|
| How many hours for this migration? | ~150 (standard) | 200-300 (complex, multiple custom objects) | 350+ (merger or multi-system consolidation) |
| How long until go-live? | 12-16 weeks | 8-12 weeks (compressed, higher risk) | <8 weeks (ELT likely, significant post-launch work) |
| How many fields should survive the audit? | 30-60% of source fields | 60-80% (not enough rationalization) | >80% (likely rubber-stamping, not truly auditing) |
| What duplicate rate is acceptable post-migration? | <3% | 3-5% | >5% (dedup project needed) |

---

## 4) Calculations & Scoring

This section does not apply to the HubSpot to Salesforce Migration project. This is a qualitative, process-driven project. There are no formulas, scoring rubrics, or point-based calculations in the methodology.

The closest equivalent is the **Field Audit Methodology** (documented in Core Concepts), which uses qualitative criteria (fill rate, update method, workflow dependency, data type) to make keep/transform/delete decisions per field. These decisions are judgment-based, not formula-based.

---

## 5) Edge Cases & Deep Dives

### Edge Case 1: Mergers (Multi-System Consolidation)

**Scenario:**

The migration involves more than one source system - either a Salesforce-to-Salesforce merger or multiple HubSpot instances consolidating into one Salesforce. This is fundamentally different from a single-source migration because you must scope BOTH (or all) instances and design a unified architecture that combines them.

**Challenge:**

Complexity is non-linear. A merger is not 2x the effort of a standard migration - it is significantly more because every architecture decision must account for conflicting data models, different field definitions, duplicate records across systems, and competing business processes. Merger-scale projects typically run 350-400 hours vs ~150 hours for a standard single-source migration.

**Approach:**

1. Scope each source system independently first
2. Map conflicts between systems (different field names for same data, different stage definitions, different lifecycle models)
3. Design the unified target architecture that reconciles both sources
4. Create a merged workback plan (expect 100+ items vs 25-30 for standard)
5. Plan data migration in sequence - typically migrate the "primary" system first, then merge the second
6. Extend hyper-care period (4+ weeks) because edge cases multiply

### Edge Case 2: Partial or Phased Migrations

**Scenario:**

Not all users move at once. Some teams migrate to Salesforce while others remain on HubSpot temporarily. Common when different business units have different readiness levels or when a phased rollout reduces risk.

**Challenge:**

Running two CRM systems in parallel creates data synchronization issues. Tools like Salesloft need to know which system is the source of truth for each user segment.

**Approach:**

1. Define clear boundaries: which users/teams migrate in each phase
2. Establish the source of truth for shared data during the parallel period
3. Plan data backfills for tools that need complete history (Salesloft, Outreach)
4. Coordinate cutover timing precisely for each phase
5. Document the parallel operating model so both teams know where to log activity

### Edge Case 3: Contact-Only Architecture

**Scenario:**

Rare (~1 out of 15 customers). The client chooses to skip the Lead object and use only Contacts in Salesforce.

**Challenge:**

In Salesforce, every Contact must attach to an Account. When web visitors sign up with personal email addresses (gmail.com, yahoo.com, hotmail.com), there is no company Account to attach them to.

**Approach:**

1. During scoping, map every inbound data source and identify which ones produce personal email addresses
2. If personal emails are present, design a routing strategy: create "orphanage" Accounts or implement email-to-domain matching
3. Test the routing strategy with a sample of real data before committing to contact-only

### Edge Case 4: Attribution During Migration

**Scenario:**

Client wants attribution tracking set up as part of the migration. Attribution fields are part of "The Hits" (foundational automations), but the depth of attribution can vary wildly from 1 basic field to a full multi-touch attribution system.

**Challenge:**

Risk of over-engineering. Attribution is one of the most common areas where migration scope creeps into a full separate project.

**Approach:**

1. During scoping, explicitly ask: "Do you need to know where a lead came from (1 field), or do you need multi-touch attribution across the entire funnel (8+ fields with models)?"
2. If the answer is basic tracking: Include 1-2 fields (Lead Source, Original Campaign) as part of The Hits. ~2-4 hours of work.
3. If the answer is full attribution: Flag this as a separate project. Do NOT scope it into the migration.
4. Document the decision and rationale in the scoping output so it does not resurface during the build phase.

### Edge Case 5: CPQ/Quoting Gap

**Scenario:**

HubSpot has native quoting functionality built into the platform. Salesforce does not. If the client uses HubSpot's quoting feature, they lose that capability on migration day unless a replacement is planned.

**Approach:**

1. Identify during the third-party technology strategy phase (Big Five: Technology)
2. Add CPQ evaluation to the workback plan as a decision milestone
3. Present options: Salesforce CPQ (native but complex), DealHub, Subskribe, or accept reduced functionality temporarily
4. Since CPQ is net-new in Salesforce, it can be built from day one without impacting current operations
5. If CPQ evaluation takes longer than the migration timeline, plan a phased approach: launch Salesforce without quoting, add CPQ in a follow-up phase

### Edge Case 6: ELT Complications (Post-Load Transformation Issues)

**Scenario:**

The team chose ELT (load first, transform later) and is now experiencing issues in the live Salesforce instance.

**Challenge:**

Dirty data in production causes cascading problems: incorrect workflow triggers, duplicate records created by automation, reporting inconsistencies, and user frustration that undermines adoption. CRM project failure rates are 55% overall, with user adoption as the leading cause. Launching with dirty data directly undermines the adoption you need.

**Approach:**

1. Triage: Identify which data quality issues are causing the most user-facing problems
2. Pause affected automations until data is cleaned
3. Run targeted cleanup sprints focused on the highest-impact issues first
4. Re-enable automations incrementally, validating each one
5. Extend hyper-care period to accommodate the cleanup

**Prevention:**

For future projects, use this edge case as evidence for the ETL approach. The time "saved" by ELT was spent (and then some) on post-launch cleanup, with the added cost of user frustration during the cleanup period.

---

## References

[1] WinPure - CRM Data Migration: Everything You Need To Know

[2] Salesforce Trailhead - Data Quality Assessment

[3] Dedupely - Why Every CRM Migration Needs Deduplication First

[4] Peeklogic - HubSpot to Salesforce Data Migration

[5] Folio3 - HubSpot to Salesforce Migration Guide

[6] Salesforce Help - Custom Fields Allowed Per Object

[7] Johnny Grow - The CRM Failure Rate is 55%
