# Marketing Reporting Pack — Methodology

## Overview
This comprehensive guide covers the foundational concepts, frameworks, and calculations for implementing a Marketing Reporting Pack. It's structured around five key sections: core concepts, decision frameworks, benchmarks, calculations, and edge cases.

## 1) Core Concepts

### The Marketing Reporting Stack
The reporting infrastructure consists of three layers: data sources (MAP, CRM, ad platforms), data integration (how metrics connect across systems), and presentation (dashboards and reports). The document emphasizes that "A reporting pack is only as trustworthy as its weakest data connection."

### Metric Hierarchy Framework
Metrics are tiered by revenue proximity:
- **Tier 1 (Revenue)**: Marketing-sourced pipeline, CAC, ROI
- **Tier 2 (Funnel)**: MQL volume, conversion rates, pipeline velocity
- **Tier 3 (Activity)**: Email opens, page views, social engagement

The guidance warns against reporting activity metrics without connecting them to revenue outcomes.

### Attribution Models
Six primary models are detailed:
- First-touch and last-touch (single credit)
- Linear, U-shaped, W-shaped (multi-touch with varying distributions)
- Full-path (22.5% each to key stages)

The framework notes that multi-touch requires clean tracking; inconsistent UTM data can undermine reliability.

### Metric Ownership
Explicit ownership assignment is critical. The document clarifies: "The metric owner is not the person who builds the dashboard. It is the person who gets called when the number looks wrong."

## 2) Decision Frameworks

### Approach Selection Matrix
- **Early-stage (<$10M ARR)**: Native CRM dashboards
- **Mid-market ($10M-$50M)**: BI tools (Tableau, Looker, Power BI)
- **Scaling ($50M+)**: Dedicated analytics platforms or data warehouses

### Scoping Factors
Project complexity depends on:
- Number of data sources (2-3 sources = 3-4 weeks; 7+ = 8-12 weeks)
- Data maturity (clean to poor quality adds 1-4 weeks)
- Stakeholder reporting needs (1-6 dashboards)
- Attribution complexity

### Dashboard Tiering
Recommended structure includes:
- **Executive**: Revenue impact, ROI, CAC (monthly refresh)
- **Operational**: Funnel performance, conversion rates (weekly)
- **Channel-specific**: CPL, ad performance (daily/real-time)
- **Campaign**: Individual ROI, A/B tests (per-campaign)

## 3) Benchmarks & Standards

### B2B SaaS Funnel Conversion Rates
| Transition | Typical | Range |
|-----------|---------|-------|
| Visitor → Lead | 1.4-2.3% | 0.7%-3.5%+ |
| Lead → MQL | 31-41% | 20%-55%+ |
| MQL → SQL | 15-21% | 10%-39-40% |
| SQL → Opportunity | 42-50% | 30%-65%+ |
| Opportunity → Close | 20-30% | 15%-40%+ |

### Cost Per Lead Benchmarks
- **Organic Search**: $50-80 CPL
- **Paid Search**: $100-200 CPL
- **LinkedIn Ads**: $150-300 CPL
- **Content Marketing**: $70-120 CPL
- **Events/Webinars**: $200-400 CPL

### Marketing Pipeline Contribution
- Marketing-sourced pipeline: 30-45% of total
- Marketing-influenced pipeline: 55-70% of total
- Marketing budget as % of revenue: 8-10%

### Status Thresholds
- **Green**: At or above target (within 5%)
- **Yellow**: 5-20% below target
- **Red**: >20% below target

## 4) Calculations & Scoring

### Key Formulas

**Cost per MQL**
```
Total Marketing Spend / # of MQLs
Example: $50,000 / 250 MQLs = $200 CPMQL
```

**Marketing ROI**
```
((Marketing-Sourced Revenue - Marketing Cost) / Marketing Cost) × 100
Example: ($2.4M - $600K) / $600K = 300% ROI
```

**Pipeline Velocity**
```
(Qualified Opportunities × Avg Deal Size × Win Rate) / Avg Sales Cycle (days)
Example: (40 × $35K × 0.22) / 90 = $3,422/day
```

**MQL-to-SQL Conversion**
```
# SQLs / # MQLs × 100
Example: 50 / 250 = 20%
```

## 5) Edge Cases & Solutions

### Data Discrepancy (MAP vs. CRM)
When counts diverge: reconcile record-by-record, identify root causes (sync delays, filter mismatches, definition conflicts), establish single source of truth.

### Insufficient Historical Data
Use industry benchmarks as temporary baselines for first 6 months, then replace with client-specific actuals. Mark benchmark-based targets as "provisional."

### Multiple Business Units
Build segment-level dashboards first, use weighted averages for consolidated views, ensure clean BU tagging on all records.

### Vanity Metric Resistance
Include activity metrics in channel-specific dashboards, add "so what?" connections to revenue outcomes, implement 90-day coexistence period before sunsetting old reports.

### Tool Limitations
Document specific gaps, assess whether they affect Tier 1 metrics (must fix) or lower tiers (can defer), consider hybrid solutions.

## Key Takeaways

The methodology emphasizes that successful reporting requires:
1. Clean, aligned data across sources
2. Revenue-focused metric selection
3. Clear ownership and governance
4. Appropriate tool selection for company scale
5. Industry context via benchmarks
6. Careful attention to attribution methods

The document provides concrete calculations, benchmark ranges, and practical guidance for common implementation challenges.
