# Renewal, Churn, NRR/GRR Reporting — Methodology

## Core Concepts Overview

This document establishes foundational definitions for retention metrics in SaaS businesses.

### Net Revenue Retention (NRR)

NRR measures recurring revenue retention from existing customers including expansion, contraction, and churn impacts. The guide emphasizes that "NRR is the 'compounding engine' of a SaaS business," with small percentage differences compounding significantly over years.

**Key insight:** An NRR difference of 5 points (105% vs 110%) results in 26% greater value over five years from identical starting revenue.

Common misconception addressed: High NRR can mask significant churn if expansion revenue is strong. Companies should examine both NRR and Gross Revenue Retention (GRR) together.

### Gross Revenue Retention (GRR)

GRR isolates the "leaky bucket" by measuring retention excluding expansion. It's capped at 100% and represents the revenue floor before any upsells are factored in.

The document states: "You can only build the ceiling as high as the floor is solid. A company with 80% GRR needs 25% expansion just to break even."

### Churn Classification

Churn splits into two dimensions:
- **Logo vs. Revenue:** Customer count losses versus dollar value losses
- **Voluntary vs. Involuntary:** Active cancellations versus payment failures

Involuntary churn accounts for 20-40% of total churn and can be recovered 30-70% through improved dunning and payment retry logic.

### ARR Waterfall

The ARR waterfall visualizes revenue movement: Beginning ARR + New Business + Expansion - Contraction - Churn = Ending ARR. This serves as both communication tool and underlying data model.

### Measurement Approaches

**Period-based:** Compares total revenue at period start versus end across all customers.

**Cohort-based:** Groups customers by shared attributes and tracks each cohort independently, providing more accurate retention behavior insights.

## Decision Frameworks

### Approach Selection

The guide recommends different methodologies based on company stage:
- **Under $5M ARR:** Simple period-based monthly approach
- **$5M-$30M ARR:** Cohort-based quarterly with ARR waterfall
- **Over $30M ARR:** Dual approach combining cohort monthly and period-based quarterly

### Key Scoping Factors

1. **Contract Structure:** Annual contracts use annual cohorts; monthly contracts use monthly cohorts with rolling 12-month views
2. **Data Maturity:** Clean subscription data enables full cohort analysis; partial data requires cleanup phase
3. **Stakeholder Needs:** Board reporting requires finance-reconciled accuracy; operational reporting prioritizes timeliness
4. **Product Complexity:** Single products require straightforward calculations; multiple products need per-product GRR/NRR analysis

## Benchmarks by Segment

### NRR Benchmarks

| Segment | Typical | Notes |
|---------|---------|-------|
| Enterprise (>$50K ACV) | 118% | High switching costs drive retention |
| Mid-Market ($15K-$50K ACV) | 108% | Moderate expansion; renewal-driven |
| SMB (<$15K ACV) | 97% | Higher logo churn offset by volume |
| All B2B SaaS (median) | 106% | Venture-backed median |

### GRR Benchmarks

| Segment | Typical | Notes |
|---------|---------|-------|
| Enterprise | 94% | Long contracts, high switching costs |
| Mid-Market | 90% | Variable by industry and competition |
| SMB | 85% | Monthly billing drives higher churn |
| All B2B SaaS | 90% | Top quartile exceeds 95% |

### Churn Rate Thresholds

- Annual gross revenue churn: Good <8%, Warning 8-15%, Red flag >15%
- Annual logo churn: Good <10%, Warning 10-20%, Red flag >20%
- Monthly revenue churn: Good <0.7%, Warning 0.7-1.5%, Red flag >1.5%

## Calculation Formulas

### GRR Formula

`(Starting MRR - Contraction MRR - Churn MRR) / Starting MRR`

**Example:** ($500K - $15K - $35K) / $500K = 90.0%

### NRR Formula

`(Starting MRR + Expansion MRR - Contraction MRR - Churn MRR) / Starting MRR`

**Example:** ($500K + $60K - $15K - $35K) / $500K = 102.0%

### ARR Waterfall Formula

`Ending ARR = Beginning ARR + New ARR + Expansion ARR - Contraction ARR - Churn ARR`

### Cohort Retention

`Cohort NRR = ARR of Cohort at Month 12 / ARR of Cohort at Month 0`

## Critical Edge Cases

### Multi-Year Contracts

Include in Starting MRR every period. Segment reporting should show "up for renewal" cohort separately from "under contract" cohort. The "up for renewal" GRR/NRR reveals true retention strength.

### Mid-Contract Changes

Recognize contraction or expansion at the effective date when MRR actually changes in the billing system. Don't defer to renewal periods.

### Non-Recurring Revenue

Exclude implementation fees, training, and professional services from ARR calculations. Tag revenue line items as "recurring" versus "non-recurring" in billing systems.

### Renewal Timing

Define grace periods (typically 30-60 days) for late renewals. Renewals within the grace period count as retained; beyond the grace period become churn-and-rebook.

### Finance vs. CS Alignment

Reconcile differences between systems using a bridge showing Finance number, CS number, and adjustment factors (timing, scope, definition). Target convergence within 2%.

## Key Validation Checks

- GRR should never exceed 100%
- NRR must be ≥ GRR always
- Churn reasons captured for >90% of churned accounts
- Renewal pipeline created 90+ days in advance
- Finance and CS numbers within <2% variance
- All contracts have start/end dates and values

The methodology emphasizes that retention metrics require consistent definitions, clean data, and stakeholder alignment to drive actionable insights and credible board reporting.
