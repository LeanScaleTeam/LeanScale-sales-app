---
sidebar_position: 2
title: "Glossary"
description: "GTM terminology definitions — how LeanScale defines key terms"
---

# GTM Glossary

This glossary defines key terms as LeanScale uses them in the GTM OS. Where industry practice varies, we note common alternatives and why we use our definition.

---

## Marketing Terms

| Term | Definition | Notes |
|------|------------|-------|
| **MAL** (Marketing Accepted Lead) | Any contact in database | Email address exists — could be personal, non-ICP |
| **MEL** (Marketing Engaged Lead) | Contact who has engaged with content | Chat, gated content, paid ad click, etc. |
| **MQL** (Marketing Qualified Lead) | High-intent or target account contact | Demo request, beacon product request, or BDR/Sales identified target |
| **SAL** (Sales Accepted Lead) | Lead with meeting scheduled | Sales person has accepted a meeting |
| **CPL** (Cost Per Lead) | Marketing spend divided by leads generated | Varies wildly by channel ($31 SEO to $110 LinkedIn) |
| **Lead Scoring** | Numerical ranking of lead quality/intent | Can be behavioral, firmographic, or both |
| **Attribution** | Crediting marketing touchpoints for revenue | See attribution methodologies below |

**On MQL definitions:** Industry practice varies significantly. Some companies define MQL as any demo request; others require firmographic fit. LeanScale defines MQL as high-intent OR target account — this captures both inbound demand and outbound-sourced meetings.

### Attribution Methodologies

| Method | What It Measures | Best For |
|--------|-----------------|----------|
| **First Touch** | Initial lead source | High velocity sales (0-60 day cycles) |
| **Last Touch** | Final source before SQL | Mid-long cycles, outbound-heavy |
| **Blended** | Both first and last | Most use cases with proper reporting |
| **Multi-touch** | All touchpoints | Enterprise (ACV >$100K, cycle >6mo) |

---

## Sales Terms

| Term | Definition | Notes |
|------|------------|-------|
| **SQL** (Sales Qualified Lead) | Opportunity created after sales qualifies lead | Post-meeting qualification; some orgs call this "Opportunity" |
| **Closed Won** (CW) | Deal signed | Contract executed |
| **Closed Lost** | Deal lost | Competitor win, no decision, or lost to status quo |
| **ACV** (Annual Contract Value) | Annualized value of a contract | If 3-year deal at $300K total, ACV = $100K |
| **TCV** (Total Contract Value) | Full value of a contract | If 3-year deal at $300K total, TCV = $300K |
| **Win Rate** | Deals won / Deals closed | Measure at each stage for funnel health |
| **Sales Cycle** | Time from opportunity creation to close | Track median, not average (outliers skew) |
| **Pipeline Coverage** | Pipeline value / Quota | 3-4x is healthy; varies by win rate |
| **Quota Attainment** | Revenue closed / Quota assigned | >70% at quota is healthy team performance |

**On SQL vs Opportunity:** Some orgs use "Opportunity" once Sales accepts. LeanScale uses SQL to mean "qualified opportunity created" — the moment a deal enters the pipeline with a real chance to close.

### Qualification Frameworks

| Framework | Focus | Best For |
|-----------|-------|----------|
| **BANT** | Budget, Authority, Need, Timeline | Transactional sales |
| **MEDDIC** | Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion | Enterprise sales |
| **MEDDPICC** | MEDDIC + Paper Process, Competition | Complex enterprise deals |

---

## Customer Success Terms

| Term | Definition | Notes |
|------|------------|-------|
| **GRR** (Gross Revenue Retention) | Revenue retained excluding expansion | Target: >85-90% |
| **NRR** (Net Revenue Retention) | Revenue retained including expansion | Target: >100-110% (sales-led), >120% (PLG) |
| **Churn** | Revenue lost from customers leaving | Can be logo churn (count) or revenue churn ($) |
| **Expansion** | Additional revenue from existing customers | Upsell, cross-sell, or usage growth |
| **Health Score** | Composite metric predicting retention risk | Varies by company; combine usage, engagement, support |
| **Time to Value** (TTV) | Days from closed won to first value milestone | Shorter TTV = better retention |
| **CSM** (Customer Success Manager) | Person responsible for customer outcomes | Not support; focused on adoption and retention |

**On NRR benchmarks:** 105% is the Series A/B standard for sales-led motions. PLG and usage-based companies often see 120-130%+ due to natural expansion. Comparing NRR across motions is misleading.

### Customer Success Stages

| Stage | Definition | Entry Criteria |
|-------|------------|----------------|
| **Pre-onboarding** | CS involved before close | CS gets context pre-signature |
| **Onboarding Completed** | Handoff done | Sales-CS handoff complete |
| **Implementation Completed** | Technical setup done | Defined implementation milestones met |
| **Early Adoption** | First value realized | Initial time to value achieved |
| **Mature Adoption** | Full value realized | Renewal occurred or ongoing value proven |

---

## Financial & Reporting Terms

| Term | Definition | Notes |
|------|------------|-------|
| **ARR** (Annual Recurring Revenue) | Annualized recurring revenue | MRR × 12; excludes one-time fees |
| **MRR** (Monthly Recurring Revenue) | Monthly recurring revenue | ARR ÷ 12 |
| **CAC** (Customer Acquisition Cost) | Cost to acquire a customer | Sales + Marketing spend / New customers |
| **LTV** (Lifetime Value) | Total revenue from a customer | ACV × Gross Margin × (1 / Churn Rate) |
| **LTV:CAC** | Ratio of lifetime value to acquisition cost | Target: >3:1 |
| **CAC Payback** | Months to recover acquisition cost | Target: under 18 months |
| **Magic Number** | Sales efficiency metric | (QoQ ARR growth × 4) / Prior Q S&M spend |
| **Rule of 40** | Growth + Profitability balance | ARR Growth % + EBITDA Margin % ≥ 40 |
| **Gross Margin** | Revenue minus COGS | Target: >70% for SaaS |

**On CAC calculation:** Industry varies on what to include. LeanScale includes fully-loaded Sales + Marketing spend (salaries, tools, programs) divided by new customer count. Some orgs use new ARR in denominator instead.

### Benchmark Ranges (Series Stage)

| Metric | Series A | Series B | Series C+ |
|--------|----------|----------|-----------|
| **ARR** | $1-5M | $5-20M | $20-50M+ |
| **Growth Rate** | 100%+ | 75%+ | 50%+ |
| **NRR** | 100%+ | 105%+ | 110%+ |
| **CAC Payback** | under 24 mo | under 18 mo | under 12 mo |
| **LTV:CAC** | >2:1 | >3:1 | >4:1 |

---

## GTM Stage Terms

| Term | Definition | Characteristics |
|------|------------|-----------------|
| **Build** | Pre-PMF, founder-led sales | Under $1M ARR, proving the model works |
| **Stabilize** | First repeatable sales motion | $1-3M ARR, first dedicated sales reps |
| **Scale** | Scaling what works | $3-15M ARR, building the team |
| **Optimize** | Efficiency and segmentation | $15-40M ARR, unit economics focus |
| **Platform** | Multi-product, multi-segment | $40M+ ARR, enterprise complexity |

---

## Contentious Terms

These terms have different meanings across functions or industries. Here's how LeanScale defines them:

### Opportunity vs SQL

| Perspective | Definition |
|-------------|------------|
| **Sales view** | "Opportunity" = any deal in pipeline |
| **Marketing view** | "SQL" = qualified lead handed to sales |
| **LeanScale OS** | SQL = qualified opportunity created after sales meeting |

We use SQL because it's clearer that qualification happened. "Opportunity" can mean anything from first call to verbal commit.

### MQL Definition Variance

| Company Type | Typical MQL Definition |
|--------------|----------------------|
| **High-velocity** | Any demo request |
| **Enterprise** | Demo request + firmographic fit + engagement score |
| **PLG** | Product usage threshold + expansion signal |
| **LeanScale OS** | High-intent (demo request) OR target account (BDR-sourced) |

### Pipeline Coverage Targets

| Motion | Typical Coverage |
|--------|-----------------|
| **SMB (high velocity)** | 2-3x |
| **Mid-Market** | 3-4x |
| **Enterprise** | 4-5x |
| **LeanScale default** | 3-4x (adjust for win rate) |

Coverage requirements scale with sales cycle length and win rate uncertainty.

---

## Lead Source Categories

| Category | Examples |
|----------|----------|
| **Demand** | Email, Blog, Gated Content, Podcast, Webinar |
| **Organic** | Organic Search, Organic Social, Website, Chat |
| **Paid** | Paid Search, LinkedIn, Facebook, Display |
| **Partner** | Affiliate, Referral, Reseller |
| **Events** | Trade Shows, Customer Events, Prospect Events |
| **Outbound** | SDR/BDR prospecting, Sales prospecting |
| **Referral** | Customer referrals, Employee referrals, Investor referrals |
| **Product** | Referral codes, In-app upsell |

---
