---
sidebar_position: 5
title: "CS Processes"
description: "Customer success processes for Scale stage — scaled onboarding, health scoring, expansion"
---

> **Scale Stage** | $5-15M ARR | 30-80 headcount
>
> Main challenge: Adding capacity without chaos. Process debt and tool sprawl.
>
> *[← Back to Scale Overview](./overview)*

## Customer Success Processes

**Stage-appropriate approach:** CS becomes a team with process and metrics at Scale. Health scoring becomes real. Expansion is a process, not just luck. Support is staffed. The question shifts from "are customers happy?" to "how do we know customers are healthy at scale?"

## Customer Onboarding

**Stage-appropriate approach:** Process-driven onboarding with documented playbooks. Onboarding is no longer CSM-dependent — it's consistent and measurable.

**Onboarding at Scale:**

| Component | What It Contains | Who Owns |
|-----------|-----------------|----------|
| **Kickoff** | Goals, stakeholders, timeline, success criteria | CSM + customer |
| **Implementation** | Technical setup, integrations, data migration | CSM + technical resource |
| **Training** | User training, admin training, documentation | CSM or enablement |
| **Go-live** | Launch support, escalation plan | CSM |
| **First value** | Time to first value milestone | CSM |

**Onboarding playbook requirements:**

- **Milestone-based structure** — clear checkpoints, not just calendar time
- **Templates** — kickoff deck, project plan, training materials
- **Escalation paths** — when to involve leadership, technical resources
- **Handoff from sales** — documented requirements before onboarding starts

**Onboarding metrics:**

| Metric | What It Measures | Typical Target |
|--------|-----------------|----------------|
| **Time to first value** | How long until customer achieves initial goal | Under 30-60 days |
| **Onboarding completion rate** | % of customers completing all milestones | >90% |
| **Onboarding NPS/CSAT** | Customer satisfaction with onboarding | >50 NPS |
| **Implementation success rate** | % of implementations without major issues | >85% |

**Segment-specific onboarding:**

| Segment | Approach | Touch Level |
|---------|----------|-------------|
| **SMB** | Tech-touch, self-serve resources | Low (automated + office hours) |
| **Mid-Market** | CSM-led with templates | Medium (scheduled calls + async) |
| **Enterprise** | White-glove, dedicated PM | High (dedicated resources) |

**What NOT to do:**

- **One-size-fits-all** — SMB and enterprise need different onboarding
- **Calendar-based milestones** — "week 3" means nothing; outcomes matter
- **Skipping kickoff** — rushing to implementation without alignment causes problems later
- **No measurement** — can't improve what isn't tracked

**Playbook reference:** → Onboarding and Process Improvement

---

## Health Scoring

**Stage-appropriate approach:** Health scoring becomes real at Scale. Teams have enough customers and data to identify patterns. The goal is predictive — identify at-risk customers before they churn.

**Health score components:**

| Component | Signals | Weight (typical) |
|-----------|---------|------------------|
| **Product usage** | Login frequency, feature adoption, depth of use | 30-40% |
| **Engagement** | Response time, meeting attendance, NPS | 20-30% |
| **Relationship** | Stakeholder access, champion strength | 15-20% |
| **Outcomes** | Achieving stated goals, ROI realization | 15-20% |
| **Commercial** | Payment history, contract status | 10-15% |

**Health score implementation:**

- **Define "healthy"** — what does a successful customer look like?
- **Identify signals** — what data indicates health? What's available in systems?
- **Weight appropriately** — usage matters more than payment in most models
- **Set thresholds** — green/yellow/red or numerical scoring
- **Action triggers** — what happens when health drops?

**Health score levels:**

| Level | Definition | Action |
|-------|-----------|--------|
| **Green** | Healthy, engaged, achieving value | Standard touch, expansion opportunity |
| **Yellow** | Some risk signals | Proactive outreach, deeper engagement |
| **Red** | Multiple risk signals, likely churn | Escalation, executive involvement |

**Implementation considerations:**

- **Start simple** — 5-7 signals max initially
- **Iterate** — health score should improve based on actual churn correlation
- **Don't overcomplicate** — complex models that nobody trusts don't get used
- **Combine with judgment** — scores inform, CSMs decide

**What NOT to do:**

- **Score without action** — a score that doesn't trigger action is useless
- **Over-weight easy metrics** — login frequency isn't health; outcomes are
- **Set and forget** — health models need regular calibration
- **Ignore CSM judgment** — humans catch things algorithms miss

**Playbook reference:** → Customer Lifecycle, Health Scoring Model

---

## Product Feedback Collection

**Stage-appropriate approach:** Feedback system — not just collection, but routing, prioritization, and closing the loop. Feedback should influence product decisions.

**Feedback infrastructure:**

| Channel | Purpose | Volume | Routing |
|---------|---------|--------|---------|
| **In-app feedback** | Feature requests, friction | High | Product via tool |
| **CSM conversations** | Strategic needs, pain | Medium | CS to Product |
| **Support tickets** | Bugs, issues | High | Support to Product |
| **NPS/surveys** | Sentiment, open feedback | Periodic | CS/Product |
| **CAB (Customer Advisory Board)** | Strategic direction | Low | Product/Leadership |

**Feedback process:**

1. **Collection** — multiple channels, low friction
2. **Aggregation** — central repository, deduplication
3. **Categorization** — themes, segments, impact
4. **Prioritization** — product input, business impact, effort
5. **Communication** — close the loop with customers

**Feedback tools at Scale:**

| Tool Type | Examples | Purpose |
|-----------|----------|---------|
| **In-app feedback** | Pendo, UserVoice, Canny | Feature requests, voting |
| **Survey** | Delighted, Wootric, Typeform | NPS, CSAT |
| **Product analytics** | Amplitude, Heap, Mixpanel | Usage patterns as implicit feedback |

**What NOT to do:**

- **Collect without action** — feedback fatigue is real; if customers don't see impact, they stop sharing
- **No prioritization** — loudest customer ≠ most important request
- **Feature factory** — building everything requested leads to product bloat
- **Ignore segment patterns** — enterprise feedback may differ from SMB

**Playbook reference:** → NPS and Voice of Customer Launch, Product Feedback Process

---

## Renewal Process

**Stage-appropriate approach:** Renewal is a process with timeline, ownership, and metrics. No more "surprise" renewals or last-minute scrambles.

**Renewal process timeline:**

| Timing | Activity | Owner |
|--------|----------|-------|
| **180 days before** | Renewal flagged, health reviewed | CS Ops |
| **120 days before** | Renewal kickoff call | CSM |
| **90 days before** | Business review, value recap | CSM |
| **60 days before** | Commercial discussion, terms | CSM + Sales (if expansion) |
| **30 days before** | Contract sent, signature process | CSM + Legal |
| **Renewal date** | Executed contract | N/A |

**Renewal metrics:**

| Metric | What It Measures | Typical Target |
|--------|-----------------|----------------|
| **Gross retention rate (GRR)** | Revenue retained, excluding expansion | >85-90% |
| **Renewal rate (logo)** | % of customers renewing | >85% |
| **On-time renewal rate** | % renewed before expiration | >90% |
| **Renewal forecast accuracy** | Predicted vs. actual | >85% |

**Renewal ownership:**

At Scale, most companies have CSM own renewals (with sales involved only for expansion). Alternative models:

| Model | Pros | Cons |
|-------|------|------|
| **CSM owns renewal** | Relationship continuity, simpler | CSM bandwidth, commercial skills |
| **Sales owns renewal** | Commercial focus, expansion alignment | Relationship disruption |
| **Renewal Manager** | Dedicated focus | Additional headcount, handoff risk |

**What NOT to do:**

- **Start at 30 days** — too late for meaningful intervention
- **Surprise pricing changes** — multi-year price locks or early communication
- **Ignore usage trends** — declining usage is a renewal risk signal
- **CSM alone on red accounts** — escalation needed when accounts are at risk

**Playbook reference:** → Renewal, Churn, NRR, GRR Reporting

---

## Expansion and Upsell

**Stage-appropriate approach:** Expansion is a process at Scale, not just opportunistic. Identify signals, run plays, measure results.

**Expansion types:**

| Type | Definition | Signal |
|------|-----------|--------|
| **Upsell** | Larger package, higher tier | Usage near limits, feature requests |
| **Cross-sell** | Additional products | Use case expansion, new stakeholders |
| **Add seats** | More users | New teams, growth, hiring |
| **Add functionality** | Modules, add-ons | Specific feature interest |

**Expansion process:**

1. **Signal identification** — usage patterns, stakeholder conversations, contract triggers
2. **Qualification** — is expansion right for customer? Budget? Timing?
3. **Proposal** — value-based pitch, not just "buy more"
4. **Negotiation** — terms, timing, co-termination
5. **Close** — contract update, implementation if needed

**Expansion metrics:**

| Metric | What It Measures | Typical Target |
|--------|-----------------|----------------|
| **Net retention rate (NRR)** | GRR + expansion | >100-110% |
| **Expansion revenue** | Revenue from existing customers | 20-40% of new ARR |
| **Expansion rate** | % of customers expanding annually | 20-30% |
| **Expansion pipeline** | Identified expansion opportunities | 2-3x target |

**Ownership:**

| Model | When to Use |
|-------|-------------|
| **CSM identifies, sales closes** | Large expansions, enterprise |
| **CSM owns end-to-end** | SMB/MM, smaller expansions |
| **Account Manager** | Dedicated expansion role (Optimize stage) |

**What NOT to do:**

- **Push expansion to unhealthy accounts** — fix health first
- **Ignore signals** — usage limits and feature requests are buying signals
- **No quota for expansion** — if it's not measured, it won't be prioritized
- **Wait for renewal** — expansion can happen any time

**Playbook reference:** → Expansion Playbook, Upsell Process

---

## Reference and Testimonial Program

**Stage-appropriate approach:** Reference program at Scale — systematic identification, cultivation, and deployment of customer advocates.

**Reference program components:**

| Component | Purpose | Owner |
|-----------|---------|-------|
| **Reference database** | Who, what segment, what topics | CS Ops |
| **Ask process** | How to request reference participation | Sales enablement |
| **Incentives** | Recognition, perks, exclusive access | Marketing/CS |
| **Content pipeline** | Case studies, testimonials, videos | Marketing |
| **Review management** | G2, Capterra, TrustRadius | Marketing |

**Reference cultivation:**

- **Identify potential advocates** — high NPS, strong relationship, visible brand
- **Develop relationship** — not transactional, genuine engagement
- **Match thoughtfully** — right reference for right prospect
- **Protect from overuse** — track asks, respect boundaries
- **Recognize and reward** — thank you notes, swag, early access, events

**Reference metrics:**

| Metric | What It Measures |
|--------|-----------------|
| **References available per segment** | Coverage for sales needs |
| **Reference utilization** | How often references are used |
| **Reference influence on deals** | Win rate when reference used vs. not |
| **Customer content produced** | Case studies, testimonials, reviews |

**What NOT to do:**

- **Burn out best advocates** — asking too much kills willingness
- **No tracking** — same customer asked 10 times without coordination
- **Generic references** — "happy customer" isn't useful; segment/use case match matters
- **Ignore review sites** — G2 and others influence buying decisions

**Playbook reference:** → Reference and Testimonial Program, Customer Advocacy

---

## Support Operations

**Stage-appropriate approach:** Support is a team at Scale, not a shared responsibility. Tiered support emerges. SLAs are real and measured.

**Support structure at Scale:**

| Tier | Handles | Typical Staffing |
|------|---------|------------------|
| **Tier 1** | Basic questions, known issues, documentation | Support specialists (2-4) |
| **Tier 2** | Complex issues, troubleshooting | Senior support, technical (1-2) |
| **Tier 3** | Engineering escalation, bugs | Engineering (shared) |

**Support metrics:**

| Metric | What It Measures | Typical Target |
|--------|-----------------|----------------|
| **First response time** | Time to initial response | Under 2-4 hours (business hours) |
| **Resolution time** | Time to close ticket | Under 24-48 hours (Tier 1) |
| **CSAT** | Customer satisfaction with support | >90% |
| **Ticket volume** | Support demand | Trend, not absolute |
| **Self-serve deflection** | Issues resolved without ticket | >30% |

**SLA structure:**

| Priority | Definition | Response Target | Resolution Target |
|----------|-----------|-----------------|-------------------|
| **P1** | System down, critical | Under 1 hour | Under 4 hours |
| **P2** | Significant impact | Under 4 hours | Under 24 hours |
| **P3** | Standard issue | Under 8 hours | Under 48 hours |
| **P4** | Minor/enhancement | Under 24 hours | Best effort |

**Support channels:**

| Channel | When Appropriate | Investment |
|---------|------------------|------------|
| **Help center** | Self-serve, documentation | Required |
| **Email/ticket** | Asynchronous issues | Required |
| **Chat** | Quick questions, urgent | If motion supports |
| **Phone** | Enterprise, critical | Enterprise only |

**What NOT to do:**

- **No SLAs** — customers need to know what to expect
- **One person = support team** — single points of failure are risk
- **Ignore patterns** — repeat tickets signal product issues or doc gaps
- **Support in CS** — separate functions with separate skills

**Playbook reference:** → Support System Implementation

---

## CS Platform Evaluation

**Stage-appropriate approach:** Consider CS platform at Scale. Whether to invest depends on customer count, complexity, and team size. Not required, but often valuable.

**CS platform decision factors:**

| Factor | Buy Signal | Wait Signal |
|--------|-----------|-------------|
| **Customer count** | >100 customers | Under 100 customers |
| **CSM team size** | >3 CSMs | 1-2 CSMs |
| **Data sources** | Multiple systems to integrate | Simple stack |
| **Health scoring** | Need automated scoring | Manual works |
| **Renewal complexity** | Multi-year, segmented | Simple renewals |

**CS platform options:**

| Tool | Best For | Typical Cost |
|------|----------|-------------|
| **Gainsight** | Enterprise CS teams | $$$ |
| **ChurnZero** | Mid-market CS teams | $$ |
| **Totango** | Product-led CS | $$ |
| **Vitally** | Smaller CS teams | $ |
| **Planhat** | European, growing teams | $$ |

**Implementation considerations:**

- **Data integration** — CRM, product, support, billing
- **Process definition first** — platform implements process, doesn't define it
- **Adoption planning** — CSMs must actually use it
- **Time investment** — 2-4 months to implement properly

**What NOT to do:**

- **Buy before process** — platform won't fix undefined processes
- **Overbuy** — enterprise platforms for SMB CS teams
- **Underestimate integration** — data sync is the hardest part
- **Assume magic** — platforms are tools, not strategies

**Playbook reference:** → Customer Success Platform Implementation

---

