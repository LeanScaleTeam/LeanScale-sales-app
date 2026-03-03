# CPQ Implementation - Implementation Phase

## Project One-Pager

### CPQ Implementation One-Pager

#### Project Type

- **Category**: Balanced (Strategy + Engineering + Enablement carry significant weight)
- **Primary Deliverable**: Configured CPQ system with governed quoting workflows, standardized output documents, approval routing, and CRM integration

##### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Med-Heavy | Discovery-heavy: pricing model assessment, catalog readiness audit, approach selection |
| 2. Engineering | Yes | Heavy | Core build: product catalog, pricing rules, approval workflows, quote templates, output documents, CRM integration. Recommended 4-week rollout |
| 3. Enablement | Yes | Med-Heavy | Seller adoption is make-or-break. Different training tracks for AEs, deal desk, sales managers, admins |
| 4. Handoff | Yes | Medium | Admin knowledge transfer, maintenance schedule, catalog governance handoff |

#### Phase Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. STRATEGY  │────▶│ 2. ENGINEER  │────▶│3. ENABLEMENT │────▶│  4. HANDOFF  │
│  Med-Heavy   │     │    Heavy     │     │  Med-Heavy   │     │    Medium    │
│ 1a→1b→1c→1d │     │ 2a→2b→2c→2d │     │ 3a→3b→3c→3d │     │ 4a→4b→4c→4d │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**This project's flow:**

- Full 4-phase. Discovery-heavy strategy (CPQ has the most variation in output and tooling), heavy engineering, critical enablement for seller adoption
- Phase 1 may take longer than other project types because customers have specific pricing and packaging structures
- Phase 2 timeline is 2-4 weeks for the build depending on process maturity
- Phase 3 cannot be skipped. CPQ implementations fail most often due to inadequate seller training and reversion to manual workarounds

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- **Organize product catalog with SKUs and pricing** – An organized product sheet or catalog of SKUs with pricing is required for successful CPQ implementation
- **Provide existing output document / order form** – The single most critical input. Without an output document, the team cannot configure how quotes are expressed to the market
- **Document current approval workflows** – Who approves what, at what discount thresholds, for which deal types
- **Decide line item structure** – Year-by-year vs flat; ramps or no ramps. One of the first conversations, especially with SaaS companies
- **Define year-over-year ramp decisions** – Seat increases, percentage escalation, pricing escalation structure
- **Document permissions model** – What salespeople can do vs admins vs management
- **Assess pricing stability** – If pricing is changing in the next 3 months, CPQ implementation should wait. Unstable policies make implementation difficult
- **Watch CPQ intro video** (5-10 min)
- **Complete Definition Alignment Document** – Review and approve key term definitions with leadership

##### Track B: Architect Prep

- **Pull CRM data audit** – Check for existing products, price books, line item usage, field complexity (flows, required fields, restricted picklists)
- **Run CPQ readiness diagnostic** – Evaluate rep count thresholds (<10 / 10-25 / 25-50 / 75-100+), product complexity, pricing model, approval needs
- **Assess current state** – Map current quoting process (tools used, time-to-quote, error rates, approval bottlenecks)
- **Conduct gap analysis (draft)** – 12-workstream framework as baseline: Catalog & Pricing, Discount Policy & Approvals, Quote Lifecycle, Contracting & CLM, Orders/Billing/Rev Rec, Renewals & Amendments, Services Quoting, Data & Auditability, Integrations, Security & RBAC, Performance & UX, Governance & Ops
- **Determine approach recommendation** – Native CRM build (simple), Dedicated CPQ tool (complex), or PLG payment processor (self-serve) per scoping factors
- **Set up DealHub sandbox** (if DealHub is the recommended tool)
- **Create v0 CPQ design document** – Pre-filled with assumptions from CRM audit and readiness diagnostic

#### Refinement Loop (1b → 1c → 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff | 1b | Present readiness assessment and approach recommendation. Validate current state. Confirm scoping factors | RevOps lead, Sales leader, Deal Desk | Info for v1 design document |
| Catalog Design | 1c | Product catalog structure, SKU organization, bundle rules, pricing rules | RevOps, Product, Finance | Catalog spec (v2) |
| Approval & Governance | 1c | Approval workflow design, discount authority tiers, permission model | Sales leadership, Deal Desk, Legal | Approval workflow spec (v3) |
| Quote Template & Output Doc | 1c | Output document layout, conditional content, pricing table structure, legal language | Sales, Legal, Marketing | Output document spec (v4) |
| Integration Mapping | 1c | CRM field mapping, data sync requirements, billing integration boundaries | RevOps, IT/Admin | Integration spec (v5) |
| Final Review | 1d | End-to-end design walkthrough, sign-off | All stakeholders | Signed-off CPQ design document |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1b. Kickoff call held; approach confirmed (DealHub / PandaDoc / native CRM / other)
- 1c. Refinement loop complete – catalog, pricing, approval, output doc, integration specs all finalized
- 1d. Strategic sign-off obtained on full CPQ design document

##### Phase 2: Engineering

- 2a. Tech spec created from signed-off design document (12-workstream gap analysis mapped to build items)
- 2b. Engineering handoff meeting held with DealHub admin / system configurator
- 2c. Build complete (4-week rollout timeline)
- 2d. QA/Test complete (closed-group testing + full UAT) + customer sign-off

##### Phase 3: Enablement

- 3a. Training materials prepped (role-specific tracks)
- 3b. Training sessions delivered (sellers, sales managers, deal desk, admins)
- 3c. Hypercare period complete (2-4 weeks post-launch)
- 3d. Enablement sign-off (adoption metrics validated)

##### Phase 4: Handoff

- 4a. Maintenance schedule documented and handed off
- 4b. Internal handoff complete
- 4c. External handoff (to Customer) complete
- 4d. Project closed and archived

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| CPQ Readiness Assessment | Evaluate customer's readiness across 8 scoping factors (rep count, product complexity, pricing stability, output doc readiness, decision-maker accessibility, CRM maturity, ramp structure, internal alignment) | All factors scored, approach recommended |
| Current vs Target State Analysis | Map current pain points against target capabilities per 12-workstream format | All 12 workstreams assessed |
| Gap Analysis Table | Identify and prioritize gaps using Target State / Current State / Why It Matters / Timing / Timing Rationale / Seller Feedback structure | Gaps prioritized by timing bucket |
| Catalog Design Worksheet | Product hierarchy, SKU list, bundle rules, pricing rules, compatibility constraints | All products mapped, rules defined |
| Approval Workflow Map | Visual map of approval chains by deal type, discount tier, and role | All approval paths documented and approved |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| CPQ Design Document (signed-off) | Readiness assessment + gap analysis + all workshop outputs | Internal alignment, executive approval, vendor scoping |
| Current State Diagram (Mermaid) | Current vs target state analysis | Board presentations, stakeholder alignment |
| Configured CPQ System | Design document + tech spec | Daily quoting operations |
| Training Package | Training prep materials | Ongoing onboarding, reference |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Seller Training | AEs, BDRs, CS reps | How to create quotes, apply discounts, submit for approval, generate output documents. Focus on speed: go from 30 minutes to five minutes | 60 min |
| Manager Training | Sales Managers, Directors | How to review and approve deals, monitor discount usage, interpret approval dashboards | 45 min |
| Deal Desk Training | Deal Desk, Finance approvers | Exception management, complex deal handling, approval queue management, reporting on approval rates and common exceptions | 60 min |
| Admin Training | RevOps Admin, DealHub Admin | System maintenance: catalog updates, pricing rule changes, approval workflow modifications, user management, troubleshooting. At least one internal admin should be provisioned for ongoing operation | 90 min |
| Leadership Briefing | CRO, VP Sales | CPQ ROI interpretation, strategic metrics (deal velocity, discount waterfall, quote accuracy), when to request configuration changes | 30 min |

##### Hypercare

- **Applies**: Yes
- **Duration**: 2-4 weeks post-launch (scale with org complexity)
- **Office Hours**: Yes – weekly 30-min open slot for any seller to bring issues
- **Dedicated channel** for real-time question triage during hypercare
- **Bug triage SLA**: critical issues within 4 hours, non-critical within 24 hours

##### Training Assets to Create

- Video: End-to-end quote creation walkthrough (seller perspective)
- Video: Approval workflow – what triggers approvals and how to track status
- Video: Output document generation and customization options
- Video: Admin guide – catalog updates, pricing rule changes, user management
- Doc: Seller quick-reference card (1-page PDF with common actions)
- Doc: Approval authority matrix (who approves what, at what thresholds)
- Doc: Admin maintenance guide (monthly/quarterly tasks)
- Doc: FAQ – top 10 questions from training sessions

#### Handoff & Retention

##### Internal Handoff

- **Key context** for ongoing management: CPQ project scope, customer catalog complexity, approval workflow structure, key stakeholder relationships, common issues encountered during implementation
- **Escalation trigger**: Any catalog structural changes (new product families, pricing model changes), approval workflow redesign, integration modifications. Routine items include simple user provisioning, minor pricing updates, training questions

##### External Handoff (to Customer)

- **Final meeting agenda**: End-to-end system demo, documentation package walkthrough, maintenance schedule review, admin knowledge verification, Q&A
- **Documentation package**: All training recordings, admin guide, seller quick-reference, FAQ, Definition Alignment Document (final), maintenance schedule, support escalation contacts

##### Maintenance Schedule

- **Monthly**: Quote error rate review, approval override rate review, new user provisioning
- **Quarterly**: Pricing rule review, catalog updates (new products, retired SKUs), approval workflow audit
- **Annually**: Full system audit, performance review, vendor contract review

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services (ongoing catalog governance, quarterly pricing reviews) → if no → Downsell: Adjacent project (billing integration, CLM setup, pricing & packaging strategy) → Retry retainer

**If Multi-Project (Dedicated):**
- Refinement check-in scheduled: ~90 days post-launch
- Internal prep trigger: 2 weeks before
- Decision: Routine catalog updates handled in-house / Structural changes require re-engagement

#### Key Assets

| Asset | When Used |
|-------|-----------|
| CPQ Readiness Assessment Template | Phase 1a – Architect Prep |
| Current vs Target State Template | Phase 1a – Architect Prep |
| 12-Workstream Gap Analysis Template | Phase 1a/1c – Gap analysis |
| DealHub Sandbox Setup Guide | Phase 1a – Architect Prep |
| Seller Quick-Reference Card | Phase 3b – Training |
| Admin Maintenance Guide | Phase 4a – Handoff |

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| SKU (Stock Keeping Unit) | Unique product identifier in the catalog and quotes. Some customers don't have them – introducing line items can be transformative |
| Line Item | Fundamental unit of CPQ quoting – a single row on a quote representing one product/service with quantity, price, and terms. Must decide structure (flat vs year-by-year) before building |
| List Price | The published, non-discounted price for a product. Can be "floating" (rep enters each time) or configured (pulled from price book). Floating = fewer guardrails |
| Product Bundle | A group of products sold together with defined rules (required components, optional add-ons, incompatible combinations). All product families need bundle rules |
| Discount Authority | The maximum discount percentage a specific role can approve without escalation. Graduated by role: rep < manager < director < CRO |
| Quote Immutability | Signed/finalized quotes cannot be altered. Versions tracked. Cloning does not overwrite original. Critical for audit trails and M&A diligence |
| Approval Chain | The sequence of approvers a quote routes through based on deal attributes (discount level, deal size, product mix, region). Can be parallel or sequential |
| Deal Desk | The function that manages exception pricing, complex deal structuring, and approval routing. Distinct from sales managers in that deal desk owns process, managers own commercial decisions |
| Output Document | The buyer-facing artifact generated by CPQ: order form, proposal, contract, or quote PDF. Without an output document, CPQ configuration cannot begin |
| Co-Terming | Aligning multiple subscription end dates to a single contract end date. Requires consistent proration math |
| Proration | Calculating partial-period charges when a subscription starts mid-period. Co-term deals are hard to trust without proper proration |
| Year-Over-Year Ramp | Annual increases in seats, pricing, or both across multi-year contracts. Changes data architecture – must decide structure before building |
| Price Floor | Minimum allowed price per product. Without floors, 100% discounts are possible and margin protection depends entirely on human reviewers |
| Evidence Pack | Complete audit bundle: catalog, pricing policy, approvals, quotes, orders, invoices, revenue schedules. Required for M&A diligence |
| CPQ | Configure, Price, Quote – system/process to configure products, set pricing/discounts, and generate quotes/contracts |
| UAT | User Acceptance Testing – pre-production validation of changes before release to sellers |

#### Common Gotchas

| Gotcha | How It Manifests | How to Avoid |
|--------|-----------------|-------------|
| **No output document before kickoff** | Scope creep, executive rejection loops on document design | Require existing contract/order form in Track A homework. If none exists, scope a separate output document design workshop before CPQ build begins |
| **Pricing not finalized** | Implementation stalls while customer debates pricing internally. Team becomes sounding boards for internal discussions | Set hard prerequisite: pricing decisions must be stable before implementation starts. Separate pricing & packaging strategy work from CPQ implementation |
| **Decision-makers unreachable** | Admin can't get answers, creates week-long delays between every configuration decision | Identify all decision-makers at kickoff. Require direct access or a documented rapid escalation path. Include decision-maker availability in readiness assessment |
| **Conflicting permission requirements** | Every mid-build change creates rework | Finalize permission model in Phase 1c before any Phase 2 build work. Document trade-offs explicitly with sign-off |
| **No SKUs or line items in CRM** | Must introduce an entirely new concept to the sales team | Assess CRM maturity in Track B prep. If no line items exist, scope additional foundational CRM work and extend timeline by 1-2 weeks |
| **Complex CRM environment** | Higher CRM complexity in terms of flows, required fields, restricted picklists makes implementation more difficult | Audit CRM complexity in Track B. Factor into timeline estimate. Identify CRM fields/flows that will conflict with CPQ integration |
| **Internal pricing debates during implementation** | Team becomes sounding boards for internal discussions, unclear why they're there | Set expectation in kickoff: pricing decisions are prerequisites, not deliverables. If pricing debates emerge, pause CPQ build and scope a pricing & packaging project |
| **Output document cross-sectioning** | Items occupying multiple categories where finance-oriented categorization differs from product categories | Clarify reporting structure vs product structure in Phase 1c catalog design workshop. Get finance and product alignment before building |
| **Cloning breaks downstream years** | Multi-year quotes lose year 2/3 pricing after clone/edit. Sellers must re-verify every line after any duplication | Include multi-year clone testing as a dedicated QA test case in 2d. Harden duplication logic before UAT |
| **Discounts vanish on save** | Sellers apply discounts, save, reopen – discounts gone. Requires manual math checks by year | Add discount persistence as a P0 test case. Validate in closed-group testing (Week 2) before full UAT |
| **100% discounts possible** | No price floors set. Margin protection depends entirely on human reviewers catching $0 deals | Implement price floors as part of MVP scope. Cannot defer – this is the guardrail that keeps sellers from accidentally giving away the product |
| **Free-text pricing bypasses CPQ controls** | Contracts allow manual price entry, diverging from the CPQ quote. Creates billing disputes and audit risk | Disable freeform product entry. Enforce structured SKU creation. Contracts must pull prices from system, not free text |
| **Every quote requires approval** | 20+ rule-based approval workflows fire on all quotes, even list-price deals. Creates EOQ bottlenecks | Implement auto-approve for standard, in-policy deals. Trim approval triggers to material changes only |
| **Bad releases hit sellers immediately** | No UAT environment; configuration changes push straight to production | Establish cluster releases on schedule (1-2x/week). Require UAT validation before any production push |
| **Fixing governance too early slows execution** | Adding change request workflows before catalog/pricing stabilize creates bureaucratic overhead that delays foundational fixes | Sequence: guardrails first (MVP), analytics second, governance third. Layer governance after catalog/rules/pricing stabilize |

#### Methodology Options

| Option | When to Use | Complexity | Timeline |
|--------|------------|-----------|----------|
| **Native CRM Build (Simple)** | One product, one or few reps, simple flat-rate pricing, no complex approvals | Low | 1-2 weeks |
| **Dedicated CPQ Tool – DealHub** | Complex pricing models (tiered, usage, custom), multiple products with interrelationships, approval workflows needed, 10+ reps | High | 4-8 weeks (design + 4-week build) |
| **Dedicated CPQ Tool – PandaDoc CPQ** | Sales-led motion, document-heavy quoting, existing PandaDoc investment | Medium-High | 4-6 weeks |
| **Dedicated CPQ Tool – Nue** | Alternative to DealHub/PandaDoc for Salesforce-native orgs | Medium-High | 4-6 weeks |
| **PLG Payment Processor (Stripe)** | Product-led motion, self-serve purchasing, simple checkout. Not truly CPQ – overlaps with billing | Low-Medium | Varies |
| **CPQ Remediation (Fix Existing)** | Existing CPQ is broken. May require hundreds of hours to fix, with a platform decision gate required | Very High | 3-6 months (phased: MVP + hardening + governance) |

---

## Phase 1: Strategy

> **Goal:** Get stakeholder sign-off on the full CPQ design – catalog structure, pricing rules, approval workflows, output documents, and integration plan.
>
> **Output:** Signed-off CPQ Design Document + Definition Alignment Document.

### 1a. Pre-Kickoff

> Two parallel tracks run after the deal closes and before the kickoff call.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| CPQ intro video | Explain what CPQ is, why it matters, what the project looks like | Video walkthrough (5-10 min) |
| Definition Alignment Document | Get stakeholder sign-off on terms: SKU, Line Item, List Price, Product Bundle, Discount Authority, Quote Immutability, Approval Chain, Deal Desk, Output Document, Co-Terming, Proration, Year-Over-Year Ramp, Price Floor | Google Doc |
| Product catalog request | Organized product sheet with SKUs, pricing, product interrelationships. An organized catalog of SKUs is required for success | Spreadsheet template |
| Output document request | Existing order form, contract, or proposal template. Without an output document, configuration cannot begin | PDF/Word of current contract |
| Approval workflow documentation | Who approves what, at what thresholds, for which deal types | Simple form or doc |
| Pricing stability assessment | Confirm pricing is stable for next 6+ months. If changing soon, flag immediately | Y/N questionnaire |

**Completion tracking:** Architect follows up 3 business days after send. Do not cancel kickoff if incomplete, but flag gaps and assign owners at kickoff.

#### Track B: Architect Prep

| Step | Action | Output |
|------|--------|--------|
| 1 | Pull CRM data: products, price books, line item usage, field complexity | CRM Readiness Summary |
| 2 | Score CPQ readiness across 8 factors (rep count, product complexity, pricing stability, output doc readiness, decision-maker access, CRM maturity, ramp structure, internal alignment) | CPQ Readiness Assessment |
| 3 | Map current state using current vs target state framework | Current vs Target State (draft) |
| 4 | Run 12-workstream gap analysis | Gap Analysis Table (draft) |
| 5 | Determine approach recommendation (Native CRM / DealHub / PandaDoc / Nue) using decision tree | Approach Recommendation |
| 6 | Set up vendor sandbox (if applicable) | Sandbox URL and credentials |
| 7 | Build v0 CPQ Design Document | Pre-filled design doc with ASSUMED flags |
| 8 | Prepare kickoff call assets | Presentation, diagrams, questions list |

**Critical:** Mark everything as ASSUMED. The kickoff call validates.

#### Stakeholder Alignment Document

| Term | Our Definition | Internally Approved? |
|------|----------------|----------------------|
| SKU | Unique product identifier in catalog and quotes | [ ] Yes / [ ] No |
| Line Item | Single row on a quote: one product/service with quantity, price, terms | [ ] Yes / [ ] No |
| List Price | Published, non-discounted price for a product | [ ] Yes / [ ] No |
| Product Bundle | Group of products sold together with defined rules | [ ] Yes / [ ] No |
| Discount Authority | Maximum discount a role can approve without escalation | [ ] Yes / [ ] No |
| Quote Immutability | Signed quotes cannot be altered; versions tracked | [ ] Yes / [ ] No |
| Approval Chain | Sequence of approvers based on deal attributes | [ ] Yes / [ ] No |
| Output Document | Buyer-facing artifact: order form, proposal, contract | [ ] Yes / [ ] No |
| Co-Terming | Aligning subscription end dates to single contract end date | [ ] Yes / [ ] No |
| Year-Over-Year Ramp | Annual increases in seats/pricing across multi-year contracts | [ ] Yes / [ ] No |
| Price Floor | Minimum allowed price per product | [ ] Yes / [ ] No |

**Instructions to customer:**

> Review each definition with your leadership team. Check "Yes" when approved. We cannot proceed with system configuration until all terms are aligned. Disagreements on definitions cause scope creep and rework during the build.

---

### 1b. Kickoff Call

> **Purpose:** Present readiness assessment and approach recommendation. Walk in with work done – customer reacts, not creates from scratch.

#### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|-------------|
| 0-15 | Present readiness assessment | Walk through 8 scoping factors with customer's data. Show where they fall on the CPQ need matrix |
| 15-25 | Present approach recommendation | "Based on your profile, we recommend DealHub / PandaDoc / native CRM. Here's why." Use tool selection decision tree |
| 25-40 | Walk through current state | Show CRM audit findings, current quoting pain points, gap analysis draft |
| 40-50 | Review Definition Alignment Doc | Validate definitions, identify any needing leadership approval |
| 50-60 | Validate Track A homework status | What's been submitted? What's missing? Who owns it? |
| 60-75 | Schedule refinement loop meetings | Catalog design, approval workflows, output document, integration mapping |
| 75-90 | Next steps and homework | Clear assignments, deadlines |

**What We Bring:**

- v0 CPQ Design Document (pre-filled with ASSUMED values)
- CPQ Readiness Assessment with scoping factor scores
- Current vs Target State analysis (draft)
- Gap Analysis Table (draft)
- Definition Alignment Document (pre-filled with recommended definitions)
- Questions list

**What We Leave With:**

- Validated (or corrected) readiness assessment
- Confirmed approach (tool selection agreed)
- Feedback on current state assessment (info for v1)
- Definition Alignment Document status (approved or flagged for leadership)
- Refinement loop schedule
- Clear homework assignments

**Readiness validation thresholds:**

| Factor | Ready (Proceed) | Warning (Proceed with caution) | Not Ready (Pause) |
|--------|-----------------|--------------------------------|------------------|
| Product catalog | Organized SKU list with pricing | Partial catalog, some gaps | No SKUs, "adjust amount on opp" |
| Output document | Existing contract/order form | Draft version, needs refinement | None exists |
| Pricing stability | Stable for 6+ months | Minor changes planned | Pricing changes expected within 3 months |
| Decision-maker access | Direct line to leadership | 1-2 day response time | More than a phone call away |
| CRM maturity | Products, price books, line items | Basic product records | No line items, no products |

---

### 1c. Alignment Loop & Strategic Meeting Cadence

> **Purpose:** Iterate on the CPQ design document through topic-specific workshops until all components are signed off.

#### The Pattern

```
Kickoff Call (validate approach, gather context)
    |
    Process info → v1 Design Document
    |
    Meeting 2: Catalog Design (SKUs, bundles, pricing rules) → v2
    |
    Meeting 3: Approval & Governance (workflows, permissions, thresholds) → v3
    |
    Meeting 4: Output Document (layout, content, legal) → v4
    |
    Meeting 5: Integration Mapping (CRM, billing, data sync) → v5
    |
    Final Review → Sign-off
```

#### CPQ-Specific Meeting Types

| Meeting Type | Focus | Stakeholder | Key Decisions |
|--------------|-------|-------------|---------------|
| Catalog Design Workshop | Product hierarchy, SKU structure, bundle rules, compatibility constraints, pricing rules | RevOps, Product, Finance | Bundle definitions, compatibility rules, price list structure |
| Approval Governance Session | Approval chains by deal type, discount authority tiers, auto-approve rules, permission model | Sales leadership, Deal Desk, Legal | Discount thresholds, approval routing, auto-approve criteria |
| Output Document Workshop | Order form layout, conditional content, pricing tables, legal language placement, signature flow | Sales, Legal, Marketing | Document structure, variable content rules, co-branding |
| Integration Planning | CRM field mapping, data sync direction, billing integration boundaries, reporting field requirements | RevOps, IT/Admin | System of record per field, sync direction, new reporting fields |
| Edge Case Review | Multi-year ramps, consumption pricing, complex renewals, proration scenarios, credit handling | Finance, Deal Desk, RevOps | How to handle each edge case in the CPQ system |

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 3-5 days |
| Kickoff call | Day 1 of engagement |
| Catalog Design (Mtg 2) | Week 1-2 (depends on catalog complexity) |
| Approval Governance (Mtg 3) | Week 2 |
| Output Document (Mtg 4) | Week 2-3 |
| Integration Mapping (Mtg 5) | Week 3 |
| Final Review + sign-off | Week 3-4 (when all inputs CONFIRMED) |

**Total Phase 1 duration:** 2-4 weeks. Longer if customer does not have catalog or output document prepared (adds 1-3 weeks for those dependencies).

---

### 1d. Strategic Sign-Off

> **Purpose:** Confirm the complete CPQ design before building anything.

#### Validation Checkpoint

- Definition Alignment Document signed off by stakeholders
- Product catalog structure agreed (SKUs, bundles, compatibility rules, pricing rules)
- Approval workflows designed and approved (chains, thresholds, auto-approve rules, permissions)
- Output document template agreed (layout, conditional content, legal language, signature flow)
- Integration mapping confirmed (CRM fields, data sync, billing boundaries, new reporting fields)
- Edge cases documented and approach agreed (multi-year ramps, consumption pricing, proration, credits)
- All critical inputs CONFIRMED (no remaining ASSUMED items)
- Customer understands what will be built and the 4-week build timeline
- Pricing is stable – no expected changes during build period

#### Decision Point

- **Proceed to Engineering** → Customer wants the CPQ system configured. Move to Phase 2.
- **Pause for prerequisites** → Pricing not stable, output document not designed, catalog not organized. Pause CPQ build, scope prerequisite work.
- **Project complete at Strategy** → Rare for CPQ, but possible if customer only needed the readiness assessment and design document (e.g., to build internally or scope a vendor engagement).

---

## Phase 2: Engineering

> **Goal:** Configure the CPQ system based on the approved design document.
>
> **Output:** Fully configured CPQ system, tested and customer-approved.

| Project Type | Engineering Weight | Context |
|--------------|-------------------|---------|
| CPQ Implementation | Heavy (50-60%) | Product catalog, pricing rules, approval workflows, output documents, CRM integration, end-to-end testing |

### Sub-Phases

```
2a Tech Spec → 2b Engineering Handoff → 2c Build → 2d Test
```

---

### 2a. Tech Spec

> **Purpose:** Translate the signed-off CPQ Design Document into a technical configuration specification.

**Input:** Signed-off CPQ Design Document from Phase 1

**Output:** Draft tech spec containing:

- **Catalog & Pricing:** Product hierarchy configuration, SKU creation plan, bundle rule definitions, compatibility constraints, price list setup, required field enforcement
- **Discount Policy & Approvals:** Approval workflow rules (triggers, chains, auto-approve criteria), price floor configuration, discount threshold settings, permission sets by role
- **Quote Lifecycle:** Quote template configuration, duplication logic, duration input standardization, version control settings, stage gate progression
- **Contracting & CLM:** Output document template build spec, clause logic (conditional content rules), signature flow configuration (native or DocuSign), free-text elimination rules
- **CRM Integration:** Field mapping table (CPQ field → CRM field, sync direction), new reporting fields (approval rates, common exceptions, average discount), data sync triggers
- **Renewals & Amendments (if applicable):** Co-terming configuration, proration fields, auto-renew logic, renewal record automation
- **Security & RBAC:** Admin profiles, permission sets, user groups configuration
- **Performance & UX:** Error message configuration, recalculation speed targets, UI cleanup items

The gap analysis serves as the backbone of this tech spec – each gap item with a timing designation becomes a build item.

---

### 2b. Engineering Handoff

> **Purpose:** Review tech specs with the DealHub/CPQ administrator before building.

**Who attends:** Architect + DealHub Admin (internal or customer's admin) + Engineer (if separate)

**Agenda (45-60 min):**

| Time | Topic | What Happens |
|------|-------|-------------|
| 0-15 | Walk through design context | Architect explains the strategic rationale behind each design decision |
| 15-35 | Review tech spec | Walk through each workstream. Admin flags feasibility issues, platform-specific constraints, or configuration alternatives |
| 35-50 | Build sequence | Agree on configuration order: catalog first, then pricing rules, then approvals, then output documents, then integrations. Dependencies determine sequence |
| 50-60 | Risk review | Identify known risks: platform limitations, integration complexity, data migration needs. Schedule mitigation |

**What Architect brings:**

- Signed-off CPQ Design Document (for strategic context)
- Draft tech spec (from 2a)
- Gap analysis with timing buckets (for build sequencing reference)

**What engineer/admin leaves with:**

- Approved tech spec with build sequence
- Known risks and mitigation plan
- Week-by-week build plan (see 2c)

**Key principle:** Build guardrails first, analytics second, governance third. Layer governance after catalog/rules/pricing stabilize to avoid slowing execution.

---

### 2c. Build (Configure)

> **Purpose:** Configure the CPQ system according to the approved tech spec.

**Input:** Approved tech spec from 2b

**Recommended build timeline:** 4 weeks. Typical rollouts land in 2-3 weeks when processes are well-defined going in.

| Week | Phase | Activity |
|------|-------|----------|
| 1 | **Initial Build** | Core configuration: product catalog setup, pricing rules, approval workflow rules, quote template, output document template, CRM field mapping, basic integration testing |
| 2 | **Closed Group Testing + Revisions** | 3-5 power users (selected AEs, deal desk member) test real quoting scenarios. Iterate on feedback. Fix configuration issues. Test edge cases (multi-year ramps, discount scenarios, approval routing) |
| 3 | **Full User Acceptance Testing** | All end users test the system. Run through standard deal scenarios and edge cases. Document issues. Track quote creation times against <5 min target |
| 4 | **Finalize Revisions** | Fix remaining issues from UAT. Polish output documents. Finalize approval routing. Performance testing. Prepare for go-live |

**Build sequence** (based on dependency analysis):

1. **Catalog & Pricing** (foundation – everything else depends on this)
   - Product hierarchy and SKU creation
   - Required field enforcement
   - Price lists (standard and legacy if applicable)
   - Bundle and compatibility rules

2. **Discount Policy & Approvals** (depends on catalog)
   - Price floors and discount thresholds
   - Approval workflow rules
   - Auto-approve criteria for standard deals
   - Permission sets by role

3. **Quote Lifecycle** (depends on catalog + approvals)
   - Quote template configuration
   - Duplication and multi-year logic
   - Stage gate progression
   - Version control

4. **Output Document & CLM** (depends on quote lifecycle)
   - Document template build
   - Conditional content rules
   - Signature flow (DocuSign or native)

5. **CRM Integration** (depends on all above)
   - Field mapping and sync
   - New reporting fields
   - Data validation

6. **Renewals & Amendments** (depends on catalog + pricing + co-term logic)
   - Co-terming configuration
   - Proration fields
   - Auto-renew logic

**Build tracking:**

- Catalog & Pricing: [status]
- Discount Policy & Approvals: [status]
- Quote Lifecycle: [status]
- Output Document & CLM: [status]
- CRM Integration: [status]
- Renewals & Amendments: [status]

---

### 2d. QA / Test + Sign-Off

> **Purpose:** Verify the CPQ build works correctly and get customer approval.

**Two testing phases:**

| Phase | Timing | Who | Purpose |
|-------|--------|-----|---------|
| Closed Group Testing | Week 2 | 3-5 power users (selected AEs, deal desk) | Catch configuration issues early, iterate fast |
| Full UAT | Week 3 | All end users | Validate system handles all real-world scenarios |

**Technical testing checklist:**

**Product & Catalog:**

- All products created with correct SKUs, pricing, and required fields
- Bundle rules working (correct products included/excluded)
- Compatibility rules enforced (incompatible combinations blocked)
- Price lists correct (standard and legacy if applicable)
- $0 products eliminated; off-catalog lines blocked

**Pricing & Discounts:**

- Price floors enforced (cannot discount below floor)
- Discount thresholds trigger correct approval chains
- Multi-product discount balancing works ("lock Product A at 10%, balance B and C to hit 25% overall")
- Discounts persist after save/close/reopen
- Year-over-year ramps calculate correctly across all years
- 100% discounts blocked

**Approvals:**

- Standard deals auto-approve when in policy
- Discount-triggered approvals route to correct approver chain
- Approval status visible to reps ("who needs to approve, how many steps")
- List-price quotes do NOT trigger unnecessary approvals
- OOO/delegation routing works

**Quote Lifecycle:**

- New quote creation works end-to-end
- Quote duplication creates clean copy (multi-year values intact)
- Per-year editing works without requiring full rebuild
- Quote versioning tracks changes correctly
- Signed quotes are immutable (cannot be edited after signature)

**Output Documents:**

- PDF/Word output generates correctly with all pricing tables
- Conditional content shows/hides correctly based on deal attributes
- Legal language renders correctly
- Co-branding with customer details works
- Signature flow works (native or DocuSign)

**CRM Integration:**

- Data syncs correctly from CPQ to CRM opportunity
- New reporting fields populate (approval rates, exceptions, average discount)
- No data duplication or conflict with existing CRM fields

**Edge Cases:**

- Multi-year quote with year-over-year ramps
- Upsell/cross-sell to existing customer (co-terming)
- Renewal quote with uplift
- Complex approval scenario (multiple triggers on single quote)
- Large deal with many line items (performance test)

**Performance benchmarks:**

- Time to valid price: <10 minutes (stretch: <5 minutes)
- Quote price recalculation: <2 seconds
- Rule evaluation: <1 second

**Customer testing:**

- Walk customer power users through the build (Week 2: closed group)
- Have all users test real scenarios (Week 3: full UAT)
- Capture feedback in structured format, prioritize fixes
- Re-test after fixes

**Engineering sign-off checkpoint:**

- Built system matches tech spec across all 12 workstreams
- All technical tests passing
- Performance benchmarks met
- Customer has tested and approved (closed group + full UAT)
- No P0/P1 issues outstanding
- Ready for enablement

**Decision point:**

- **Proceed to Enablement** → System is built and tested. Ready for seller training.
- **Loop back to Build** → P0/P1 issues found in UAT. Fix and retest.

---

## Phase 3: Enablement

> **Goal:** The customer's sales team can actually use the CPQ system effectively. Adoption is the success metric, not just configuration.
>
> **Output:** Trained team with documentation, stabilized system, adoption metrics meeting targets.

### Sub-Phases

```
3a Training Prep → 3b Training Sessions → 3c Hypercare → 3d Enablement Sign-Off
```

---

### 3a. Training Prep

> **Purpose:** Create role-specific training materials from the CPQ design and configuration.

**Input:** CPQ Design Document + tech specs + configured system

**Output:** Training package containing:

- **Seller track:** Scripts for quote creation, discount application, approval submission, output document generation. Focus message: "This takes your quote time from 30 minutes to 5 minutes."
- **Manager track:** Scripts for deal review, approval queue management, discount monitoring
- **Deal Desk track:** Scripts for exception handling, complex deal configuration, approval workflow management, reporting
- **Admin track:** Written guide for catalog updates, pricing rule changes, approval workflow modifications, user provisioning, troubleshooting
- **Quick-reference materials:** 1-page seller card, approval authority matrix, FAQ document

**Key principle:** Involve users early. Without a focus on adoption, new CPQ processes may be met with resistance from users unfamiliar with the new system. Involving users early and often, gathering feedback, and transforming them into ambassadors for the tool drives success. The power users from Week 2 closed-group testing become training ambassadors.

---

### 3b. Training Sessions

> **Purpose:** Transfer knowledge to the customer team so they can operate the CPQ system independently.

**Role-specific training sessions:**

| Type | Audience | Focus | Duration | Key Message |
|------|----------|-------|----------|-------------|
| Seller Training | AEs, BDRs, CS reps | Quote creation, discount application, approval submission, output document generation | 60 min | "30 minutes to 5 minutes" |
| Manager Training | Sales Managers, Directors | Deal review, approval queue, discount dashboards, when to override | 45 min | "Predictable approvals, faster close" |
| Deal Desk Training | Deal Desk, Finance | Exception management, complex deals, approval workflows, reporting on approval rates and exceptions | 60 min | "Transparent workflows, less back-and-forth" |
| Admin Training | RevOps Admin, DealHub Admin | Catalog maintenance, pricing rule updates, approval workflow changes, user management, troubleshooting | 90 min | "You own this system now" |
| Leadership Briefing | CRO, VP Sales | Strategic CPQ metrics, ROI tracking, when to request changes | 30 min | "Trust in the numbers" |

**Training delivery:**

1. Schedule sessions with appropriate stakeholders (1-2 week window)
2. Deliver training (live, with screen share in the actual system)
3. Record sessions for future reference and new hire onboarding
4. Run live quoting exercises during seller training – sellers create a real quote during the session
5. Answer questions, note gaps for FAQ updates

**Adoption tactics:**

- Identify 2-3 seller champions from closed-group testing to serve as peer coaches
- Create a dedicated channel for CPQ questions during rollout
- Share "before and after" metrics (quote time, error rate) to demonstrate value
- Gamification: track and recognize sellers who complete their first 10 quotes in CPQ

**Output:**

- Trained stakeholders across all roles
- Video recordings for each training track
- FAQ document (updated from training questions)
- Identified seller champions for peer support

---

### 3c. Hypercare

> **Purpose:** Intensive post-launch support to stabilize the system and drive adoption through the first real business cycle.

**Duration:** 2-4 weeks (scale with org complexity: <25 reps = 2 weeks, 25-50 reps = 3 weeks, 50+ reps = 4 weeks)

**What happens:**

- **Weekly office hours:** 30-min open slot. Any seller can join with questions or issues. Builds confidence, catches adoption problems early.
- **Dedicated channel:** Real-time triage for blocking issues
- **Bug SLA:** P0 (system down / quote cannot be sent) = 4 hours. P1 (wrong pricing / approval routing error) = 24 hours. P2 (cosmetic / UX) = batched weekly.
- **Adoption monitoring:** Track key metrics daily during hypercare

**Hypercare metrics to monitor:**

| Metric | Baseline | Target | Red Flag |
|--------|----------|--------|----------|
| Median time to create/send quote | 30 min | <10 min | >15 min |
| Overall CPQ sentiment | 2.8/5 | 3.5+/5 | <3.0/5 |
| Edit/amend quote rating | 2.4/5 | 3.0+/5 | <2.5/5 |
| Approval rating | 2.67/5 | 3.5+/5 | <3.0/5 |
| Quote accuracy confidence | 2.8/5 | 3.5+/5 | <3.0/5 |
| % quotes created through CPQ (vs manual) | 0% (new system) | >90% | <70% |
| CPQ-related support tickets | N/A | Decreasing week-over-week | Increasing |

**When to extend hypercare:** If >30% of sellers are still bypassing CPQ after Week 2, or if P0/P1 bugs are still being discovered, extend by 1-2 weeks.

---

### 3d. Enablement Sign-Off

> **Purpose:** Confirm the customer team can operate the CPQ system independently.

**Validation checkpoint:**

- All training sessions delivered (seller, manager, deal desk, admin, leadership)
- Training videos recorded and shared
- Seller quick-reference card distributed
- Admin maintenance guide delivered
- FAQ document finalized
- Hypercare period complete
- No P0/P1 issues outstanding
- Adoption metrics meeting targets:
  - \>90% of quotes created through CPQ (not manually)
  - Median quote time <10 minutes
  - Overall sentiment improved from baseline
- Customer admin can perform routine maintenance tasks independently
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** → Customer team is enabled, system is stable, adoption targets met
- **Extend Hypercare** → Adoption below targets, ongoing bugs, sellers reverting to manual processes

---

## Phase 4: Handoff

> **Goal:** Clean project close with maintenance plan established and retention/expansion path set.
>
> **Output:** Maintenance schedule documented, internal context transferred, customer owns the system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule → 4b Internal Handoff → 4c External Handoff → 4d Project Close
```

---

### 4a. Maintenance Schedule

> **Purpose:** Document what needs ongoing attention after the CPQ project is complete.

#### Monthly Tasks

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|-------------------|
| Quote error rate review | % of quotes with pricing errors, approval routing errors, output document issues | >2% error rate |
| Approval override rate | % of deals where approval was overridden or bypassed | >10% override rate |
| New user provisioning | New sellers added to CPQ with correct permissions and training | Any new seller without CPQ access after 5 business days |
| Quote time monitoring | Median time to create/send quote | >10 minutes (regressing from <5 min target) |
| Manual quote bypass rate | % of deals quoted outside CPQ | >10% bypass rate |

#### Quarterly Tasks

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|----------------|-------------------|
| Pricing rule review | Are price lists current? Any new products missing? Price floors still appropriate? | Update price lists, add new SKUs, adjust floors |
| Catalog update review | New products launched? SKUs retired? Bundle definitions need updating? | Add/retire products, update bundles, enforce required fields |
| Approval workflow audit | Are approval chains still appropriate? Any unnecessary triggers? Any gaps? | Tune approval rules, add/remove approvers |
| Output document review | Legal language current? Layout needs updating? Customer feedback on proposals? | Update templates, adjust conditional content |
| Integration health check | CRM sync working correctly? Reporting fields accurate? Any data drift? | Fix sync issues, reconcile data |
| User satisfaction pulse | Quick 3-question survey to sellers: ease of use, speed, confidence in accuracy | If satisfaction <3.5/5, investigate and address |

#### After First Business Cycle (30-90 days post-launch)

- **Quote accuracy audit:** Pull 20 random quotes, verify pricing matches approved rules. Target: <1% error rate
- **Adoption check:** What % of deals are going through CPQ? Target: >95%
- **Time-to-quote validation:** Is the <5 min target holding in production?
- **Key question:** Are sellers using the system as designed, or have workarounds emerged?

#### Refinement Triggers (when to re-engage)

| Trigger | Threshold | Response |
|---------|-----------|----------|
| New product launch | Any new product family | Re-engage for catalog expansion, new bundle rules, updated output documents |
| Pricing model change | Any structural pricing change (new tiers, usage-based, etc.) | Re-engage for pricing rule reconfiguration |
| Quote error rate spike | >5% for 2+ months | Re-engage for root cause analysis and configuration fix |
| Org restructure | New approval hierarchy, new regions, M&A integration | Re-engage for approval workflow redesign |
| Quote time regression | Median >15 min for 2+ months | Re-engage for performance investigation |

#### Every 6-12 Months

- Full CPQ system audit: catalog hygiene, pricing rule validation, approval workflow review, integration health, output document freshness
- Vendor feature review: assess new DealHub/CPQ vendor features that could improve the system
- ROI reassessment: compare current quote times, error rates, and deal velocity against pre-CPQ baselines

---

### 4b. Internal Handoff

> **Purpose:** Transfer context so the ongoing account owner can manage the customer relationship.

**What needs to be transferred:**

- **What was built:** Catalog structure, pricing rules, approval workflows, output documents, integrations. Key design decisions and rationale.
- **Customer context:** Key stakeholders (RevOps lead, Sales leader, DealHub admin), communication preferences, history.
- **Common issues and how to resolve:** Seller can't find a product (check catalog), approval routing seems wrong (check discount thresholds), output document looks off (check conditional content rules).
- **When to escalate:** Catalog structural changes (new product families), pricing model changes, approval workflow redesign, integration modifications, any platform-level issue.
- **Maintenance schedule:** (if Dedicated engagement) Ongoing account owner runs monthly/quarterly tasks.

**Escalation guidelines:**

| Issue Type | Who Handles | Examples |
|-----------|------------|----------|
| Small tweaks, minor questions | Ongoing account owner | New user provisioning, simple pricing update for existing product, training question |
| Significant changes | Re-engagement required | New product family, pricing model change, approval workflow redesign, integration changes |
| Platform issues | Vendor escalation | DealHub bugs, performance degradation, feature requests |

---

### 4c. External Handoff (to Customer)

> **Purpose:** Formal project completion with customer.

**Final project meeting:**

- Review what was delivered (end-to-end system demo)
- Walk through documentation package
- Verify admin can perform maintenance tasks (live demo by customer admin)
- Walk through maintenance schedule (monthly/quarterly/annual tasks)
- Confirm nothing outstanding
- Answer final questions
- Make it explicit: "CPQ project is complete"

**Documentation package:**

- All training video recordings (seller, manager, deal desk, admin, leadership)
- Seller quick-reference card (1-page PDF)
- Admin maintenance guide
- Approval authority matrix
- FAQ document
- Definition Alignment Document (final version)
- CPQ Design Document (final version)
- Maintenance Schedule
- Support escalation contacts

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video walkthrough. The customer admin becomes responsible for executing all maintenance tasks.

---

### 4d. Project Close

> **Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved (CPQ Design Document, tech spec, gap analysis, training materials, recordings)
- Handoff documentation complete
- Project status updated in tracking system
- Time/billing finalized
- Customer satisfaction captured (quick 3-question debrief)

#### Internal Debrief (Recommended)

- What went well? (catalog design workshops, seller adoption, build timeline)
- What would we do differently? (prerequisites, meeting cadence, testing approach)
- Any learnings to feed back into the CPQ playbook?
- Were there new gotchas to document?

#### Retention / Expansion

**Single Project Path:**

```
1. Upsell: Managed Services (ongoing CPQ optimization, quarterly catalog reviews, new product launches)
   | if no
2. Downsell: Adjacent project (billing integration, CLM setup, pricing & packaging strategy, CRM migration)
   | if yes
3. Retry retainer at end of next project cycle
```

**Script:**

> "Now that your CPQ system is live and your team is trained, there are two ways we can continue working together. Option 1: Managed services – we handle ongoing catalog governance, quarterly pricing reviews, and configuration updates as your business evolves. Option 2: If there's a specific adjacent project – like billing integration or contract lifecycle management – we can scope that out. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule refinement check-in at handoff:

> "On a date approximately 90 days out, we'll review how the CPQ system is performing – adoption rates, quote times, error rates – and see if any adjustments are needed."

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

| Deliverable | Description |
|-------------|-------------|
| CPQ Readiness Assessment | 8-factor scoring across rep count, product complexity, pricing stability, output doc readiness, decision-maker access, CRM maturity, ramp structure, internal alignment. Includes approach recommendation |
| Current vs Target State Document | Current quoting pain points mapped against target capabilities across 12 workstreams |
| Gap Analysis Table | Prioritized gaps with timing buckets, rationale, and seller feedback |
| CPQ Design Document | Complete signed-off design: catalog structure, pricing rules, approval workflows, output documents, integration plan, edge case handling |

**Technical Deliverables:**

| Deliverable | Description |
|-------------|-------------|
| Configured CPQ Instance | DealHub (or equivalent) with product catalog, pricing rules, approval workflows, quote templates, output documents |
| CRM Integration | Field mappings, data sync, new reporting fields (approval rates, common exceptions, average discount) |
| Output Document Templates | Professional proposal/order form templates with conditional content, co-branding, legal language, signature flow |
| Approval Workflow Configuration | Role-based and rule-based approval chains, auto-approve for standard deals, delegation/backup routing |

**Documentation Package:**

| Document | Purpose |
|----------|---------|
| Training video recordings (5 tracks) | Seller, manager, deal desk, admin, leadership training |
| Seller quick-reference card | 1-page PDF for daily quoting reference |
| Admin maintenance guide | How to maintain the CPQ system (catalog updates, pricing changes, user management) |
| Approval authority matrix | Who approves what, at what thresholds |
| FAQ document | Top questions from training, updated during hypercare |
| Definition Alignment Document (final) | Agreed-upon definitions for all CPQ terms |
| Maintenance Schedule | Monthly, quarterly, and annual maintenance tasks with red flag thresholds |

---

## References

- [A Comprehensive Guide to Smooth CPQ Implementation](https://cpq-integrations.com/blog/a-comprehensive-guide-to-smooth-cpq-implementation/) – CPQ adoption and training best practices
- [12 CPQ Best Practices for a Successful Implementation | NetSuite](https://www.netsuite.com/portal/resource/articles/crm/cpq-best-practices.shtml) – Hypercare and post-launch support patterns
- [CPQ Software ROI: What SaaS Teams Should Expect](https://vendori.com/blog/cpq-software-roi) – ROI statistics: 200-700% over 3 years for SaaS, 10x faster quote generation
- [Six Great KPIs to Measure CPQ Performance | PROS](https://pros.com/b2b/learn/blog/six-great-kpis-measure-cpq-performance/) – CPQ performance metrics and KPIs
- [DealHub CPQ Implementation Guide](https://dealhub.io/glossary/cpq-implementation/) – 8-12 week implementation timeline, no-code configuration, phased deployment
- [Salesforce CPQ Testing Approaches | BrowserStack](https://www.browserstack.com/guide/salesforce-cpq-testing) – CPQ testing methodology and QA checklist
- [SaaS CPQ Implementation Guide | Cacheflow](https://www.getcacheflow.com/post/saas-cpq-implementation-guide) – B2B SaaS-specific CPQ implementation guidance
- [The Role of Hypercare Support in Post-Production CPQ Rollouts | IRE Journals](https://www.irejournals.com/paper-details/1702909) – Hypercare support patterns for CPQ implementations
- [Calculating CPQ ROI | NetSuite](https://www.netsuite.com/portal/resource/articles/crm/cpq-roi.shtml) – CPQ ROI calculation methodology