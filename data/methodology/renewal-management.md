# Renewal Management — Methodology

This comprehensive guide covers the foundational frameworks, calculations, and decision models for implementing renewal management in B2B SaaS organizations.

## Core Concepts

### Proactive vs. Reactive Renewal Management

The document distinguishes between two approaches: proactive management identifies risks 90+ days before contract end using health data, while reactive management responds only after problems surface. A key insight states that "resolving renewal issues proactively costs 3-5x less than handling them reactively."

The foundational principle emphasizes that renewal success begins at customer onboarding—every interaction either builds or erodes renewal probability.

### GRR vs. NRR

**Gross Revenue Retention (GRR)** measures retained revenue excluding expansion and cannot exceed 100%. **Net Revenue Retention (NRR)** includes expansion and can exceed 100%. The document warns that high NRR with declining GRR indicates a critical problem: reliance on expansion masks underlying churn that becomes dangerous if expansion opportunities slow.

### Customer Health Scoring

Health scores combine four signal categories weighted by predictive power:

- **Product Usage** (30-45% weight): login frequency, feature adoption, seat utilization
- **Support Health** (20-25% weight): ticket volume, escalation rates, unresolved issues
- **Engagement** (15-30% weight): meeting attendance, responsiveness, executive sponsor activity
- **Sentiment** (15-25% weight): NPS scores, qualitative feedback, CSM assessment

The document recommends 4-6 strong signals rather than excessive data points that introduce noise.

### The 90/60/30-Day Cadence

A structured sequence triggers touchpoints at:
- **90 days**: Initial renewal outreach and intent confirmation
- **60 days**: Formal renewal proposal and expansion opportunity presentation
- **30 days**: Final terms confirmation and contract execution
- **15 days**: Executive escalation if unsigned

The document notes this represents a minimum; enterprise accounts with longer procurement cycles should extend to 120-180 days.

## Decision Frameworks

### Approach Selection Matrix

Three implementation paths serve different scales:

1. **Manual/Spreadsheet**: <50 accounts, no CS platform
2. **CRM-Native**: 50-500 accounts with CRM in place
3. **CS Platform**: 500+ accounts requiring automated health scoring

### Scoping Factors

Implementation approach depends on:
- Customer segment mix (SMB vs. mid-market vs. enterprise)
- Data maturity (usage data availability and CRM integration)
- Existing process maturity
- Contract structure (monthly, annual, or multi-year)

## Benchmarks & Standards

### Retention Rate Targets

Metric benchmarks by segment:

| Metric | Typical | Top Quartile |
|--------|---------|--------------|
| GRR | 90% | >95% |
| NRR (Enterprise) | 118% | >130% |
| NRR (Mid-Market) | 108% | >120% |
| Annual Logo Churn | 10-12% | <7% |

GRR below 85% signals fundamental product-market fit or customer experience problems requiring investigation.

### Health Score Thresholds

- **Green (75-100)**: Low risk, standard cadence
- **Yellow (50-74)**: Moderate risk, proactive intervention within one week
- **Red (0-49)**: High risk, immediate escalation within 48 hours

## Calculations & Scoring

### GRR Formula

```
GRR = (Beginning ARR - Churn ARR - Contraction ARR) / Beginning ARR
```

Example: ($10M - $800K - $200K) / $10M = 90%

### NRR Formula

```
NRR = (Beginning ARR - Churn ARR - Contraction ARR + Expansion ARR) / Beginning ARR
```

Example: ($10M - $800K - $200K + $1.5M) / $10M = 105%

### Health Score Calculation

```
Health Score = (Weight_usage × Score_usage) + (Weight_support × Score_support) + (Weight_engagement × Score_engagement) + (Weight_sentiment × Score_sentiment)
```

Recommended mid-market weights: Usage 35%, Support 25%, Engagement 25%, Sentiment 15%.

All signals normalize to 0-100 before weighting.

## Edge Cases

The document addresses five critical scenarios:

1. **New customers** lacking historical data—use onboarding milestone completion as temporary baseline
2. **Multi-product accounts**—create health scores per contract, using worst-case product score as account level
3. **Declining usage with no churn intent**—implement usage pattern overrides for seasonal/project-based accounts
4. **Renewal owner departure**—escalate to CS leadership for immediate warm handoff
5. **Auto-renewal contracts**—maintain same monitoring as non-auto accounts; auto-renewal creates false security

## Key Takeaways

The methodology emphasizes that renewal management is not a 90-day activity—it represents continuous retention work beginning at onboarding. Health scoring should balance automation with CSM judgment ("CSM Pulse" input), and all metrics must be viewed together rather than in isolation to avoid masking underlying retention weakness.
