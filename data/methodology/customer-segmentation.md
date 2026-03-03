# Customer Segmentation — Methodology

## Overview

This comprehensive guide covers the foundational concepts, frameworks, and calculations for implementing customer segmentation. The document establishes that segmentation requires actionable differentiation—not just categorization—to deliver meaningful business value.

## Core Principles

**Segmentation vs. Categorization:** The critical distinction is that "segmentation without action is just categorization." Each segment must answer two questions: who belongs in it and what treatment differs for them. Research shows companies executing personalized strategies based on segments generate 10-15% more revenue, with top performers reaching 25% gains.

**Three Segmentation Dimensions:**
- **Firmographic**: Company characteristics (industry, size, geography, growth stage)
- **Behavioral**: Product engagement patterns (usage frequency, feature adoption, support volume)
- **Value-Based**: Strategic worth (ARR, expansion potential, lifetime value)

Most effective models combine at least two dimensions. Behavioral signals alone predict churn risk better than firmographics.

**Service Model Mapping:** Three engagement levels form a spectrum:
- High-Touch: 15-50 accounts per CSM, dedicated support, monthly check-ins
- Low-Touch: 50-200 accounts per CSM, templated processes, quarterly reviews
- Tech-Touch: 200-1,000+ accounts per CSM, automated sequences, self-serve resources

Companies implementing differentiated service models achieve 6-12 point lifts in net revenue retention.

## Decision Framework

**Approach Selection Depends On:**
- Customer base size (<200 vs. 200-2,000 vs. 2,000+)
- Data maturity (60% vs. 80% vs. 95%+ field completeness)
- Tool capabilities (CRM-only vs. CRM+CSP vs. advanced analytics)
- Product complexity (single vs. multi-product organizations)

Early-stage teams should start with firmographic-only segmentation; established orgs with CSP should pursue composite multi-dimensional approaches.

## Key Benchmarks

**Customer Tier Thresholds (by ARR):**
- SMB/Tech-Touch: <$25K, 200-1,000:1 CSM ratio
- Mid-Market/Low-Touch: $25K-$100K, 50-200:1 CSM ratio
- Enterprise/High-Touch: $100K+, 15-50:1 CSM ratio

**Segment Health Indicators:**
- Segments operationalized: 4-8 with distinct actions (red flag if 16+ or only 1-2)
- Account coverage: 95%+ assigned segments
- Field completeness: 85%+ on key fields
- Quarterly review cadence required minimum

## Calculations

**Composite Segment Score Formula:**
```
Score = (Firmographic × 0.25) + (Behavioral × 0.40) + (Value × 0.35)
```

Typical weights emphasize behavioral data (40%) for retention-focused orgs. Accounts scoring 4.0+ are Tier 1 (High-Touch), 2.5-3.99 are Tier 2 (Low-Touch), below 2.5 are Tier 3 (Tech-Touch).

Scoring rubrics provide 1-5 point scales for company size, industry fit, geography, growth stage, ARR, expansion potential, and contract length.

## Governance Requirements

Segment governance covers definition reviews (quarterly), data audits (monthly), rule validation (quarterly), and distribution checks (monthly). Without governance, segments decay within 90 days as customer data changes.

## Edge Cases

The methodology addresses: new customers lacking behavioral data (use provisional assignments), multi-product organizations (primary segment + product-level tags), poor data quality (require deduplication and enrichment first), boundary-crossing accounts (30-day joint transition periods), and acquisition-driven changes (manual review before updating).

---

*For implementation details, see the accompanying Implementation guide. For strategic context, consult the Advisory section.*
