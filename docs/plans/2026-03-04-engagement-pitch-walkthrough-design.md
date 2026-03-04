# Engagement Pitch Walkthrough — Design Document

**Date**: 2026-03-04
**Status**: Design approved, ready for implementation

## Problem

The diagnostic flow produces accurate scoring but doesn't tell a compelling sales story. Results feel like a report card, not a pitch. When walking a prospect through findings on a call, there's no clear narrative connecting diagnostic gaps → business impact → LeanScale engagement → outcomes. The goal is to make the diagnostic a sales tool that drives embedded retainer engagements.

## Design

A new **Engagement Pitch** view — an interactive walkthrough mode designed for live prospect calls. It follows a 5-step narrative arc.

---

### Step 1: Power 10 Snapshot (Opening Anchor)

The walkthrough opens with the 10 metrics every GTM org needs. This creates the emotional hook before diving into specifics.

**Display**: A table showing each Power 10 metric with two status columns:

| Metric | Can You Report It? | Performance to Goal |
|--------|-------------------|-------------------|
| ARR | 🔴 Warning | 🔴 Warning |
| Pipeline Production | 🟡 Careful | 🟡 Careful |
| MQL→Opp Conversion | 🟢 Healthy | 🟡 Careful |
| ... | ... | ... |

**Punchline summary**: Auto-generated one-liner like:
> "You can reliably report on **3 of 10** metrics. Of those 3, **only 1** is on track."

**Data source**: Power 10 data from diagnostic results (`power10Data`). Where the prospect provided ARR and rep count (A2, A3), calculate estimated revenue impact of the gaps.

**Calculated impact examples**:
- At $X ARR with Y reps, inability to track Pipeline Production means ~$Z in unmonitored pipeline
- MQL conversion below benchmark = estimated N leads/quarter lost

Fall back to **benchmark ranges** when we don't have enough data to calculate specific numbers (e.g., "Companies your size typically lose 15-25% of inbound leads without proper routing").

---

### Step 2: Finding Deep-Dives

Each diagnostic finding becomes a **Problem → Impact → Solution → Outcome** card with a function/metric context strip.

**Card layout**:

```
┌─────────────────────────────────────────────────┐
│ 🏷 Sales  →  Improve Sales Efficiency           │
│ 📊 Impacts: Pipeline Production, Bookings       │
├─────────────────────────────────────────────────┤
│ PROBLEM                                         │
│ [What's broken, with CRM evidence]              │
│                                                 │
│ IMPACT                                          │
│ [Calculated or benchmark cost of inaction]      │
│                                                 │
│ SOLUTION → [LeanScale Project Name]             │
│ [Hours range] · [Brief scope description]       │
│                                                 │
│ OUTCOME                                         │
│ [What good looks like + metric improvement]     │
└─────────────────────────────────────────────────┘
```

**Data enrichment needed**: Each v2 diagnostic item and v3 competency needs:
- `primaryFunction` — Marketing | Sales | Customer Success | Partnerships | Cross Functional
- `outcomes` — array from: Increase Pipeline, Improve Sales Efficiency, Reduce Churn, Improve Data Quality, Scale Operations, Optimize Reporting
- `power10Metrics` — array of which Power 10 metrics this finding impacts
- `impactStatement` — template string for business impact (with variables for ARR, rep count, etc.)
- `outcomeStatement` — what success looks like

These fields largely exist in the v1 `diagnostic-data.js` process entries and need to be mapped onto v2 items.

**Grouping**: Findings can be viewed grouped by function (what your Sales team needs vs Marketing team) or by priority (most critical first). Default to priority.

**Filtering**: Only show `warning` and `careful` items — don't waste call time on healthy items.

---

### Step 3: Phased Roadmap (Stabilize → Activate → Optimize → Scale)

Findings roll up into a quarterly roadmap showing what the embedded LeanScale team focuses on over time.

**Four phases**:

| Phase | Quarter | Theme | Description |
|-------|---------|-------|-------------|
| **Stabilize** | Q1 | Fix the foundation | CRM cleanup, lifecycle design, pipeline redesign, basic automations and reporting |
| **Activate** | Q2 | Turn on growth motions | Lead routing, scoring, enrichment, CS handoff, sales processes |
| **Optimize** | Q3 | Tune for performance | Attribution, forecasting, territory design, dashboards, integrations |
| **Scale** | Q4 | Full operating rhythm | Executive reporting, growth model, competitive intel, continuous improvement |

Each phase shows:
1. **Strategic projects** — LeanScale-led initiatives with hours and descriptions
2. **Managed systems** — tools we operate (HubSpot, Salesforce, Clay, Outreach, etc.)
3. **Power 10 progress** — which metrics unlock or improve ("Reportable metrics: 3→6")

**Dynamic assignment**: Projects auto-assign to phases based on the v3 roadmap generator's priority formula (`gap_score × pillar_weight × dept_importance × dependency_bonus`). Highest-priority gaps go to Stabilize, lower-priority to later phases.

**Phase compression/expansion**: Phases reflow based on selected engagement tier (Step 4). Higher tiers compress or parallelize phases.

---

### Step 4: Engagement Tier Recommendation

The roadmap maps to one of three embedded engagement tiers:

| | **Growth** | **Scale** | **Enterprise** |
|---|---|---|---|
| **Monthly Investment** | $15,000 | $25,000 | $50,000 |
| **Monthly Hours** | 50 hrs | 100 hrs | 225 hrs |
| **Time to All 10 Green** | 12-18 months | 6-9 months | 4-6 months |

**Roadmap at each tier**:

- **Growth** ($15K/mo): Q1-Q2 Stabilize, Q3-Q4 Activate, Year 2 Optimize→Scale
- **Scale** ($25K/mo): Q1 Stabilize, Q2 Activate, Q3 Optimize, Q4 Scale
- **Enterprise** ($50K/mo): Q1 Stabilize+Activate (parallel), Q2 Optimize, Q3-Q4 Scale + continuous improvement

**Auto-recommendation**: Suggest a tier based on:
- ARR range (A3): <$5M → Growth, $5-20M → Scale, $20M+ → Enterprise
- Number of warning findings: >10 warnings pushes up a tier
- Power 10 red count: >7 unable/warning pushes up a tier
- Rep count (A2): 50+ reps pushes up a tier

**Interactive**: Clicking a tier reflows the roadmap timeline. Prospect sees the same work at different speeds — makes the upsell feel natural.

---

### Step 5: "Let's Start" — Phase 1 Scope

The final screen zooms into Phase 1 specifically:

- Specific projects with descriptions and estimated hours
- Systems to be onboarded/managed
- First 30/60/90 day milestones
- Power 10 metrics that will be unlocked by end of Phase 1
- Monthly investment for selected tier
- Kickoff timeline

---

## Data Model Changes

### 1. Enrich v2 diagnostic items (`constants.js`)

Add to each `DIAGNOSTIC_ITEMS` entry:
```js
{
  id: 'F3',
  name: 'Lifecycle & Lead Status',
  // ... existing fields ...
  primaryFunction: 'Cross Functional',
  outcomes: ['Improve Data Quality', 'Scale Operations'],
  power10Metrics: ['MQL -> Opportunity conversion rate', 'Gross retention'],
  impactTemplate: 'Without automated lifecycle tracking, {repCount} reps manually update stages — ~{hours}hrs/week of lost selling time.',
  outcomeStatement: 'Automated lifecycle progression with real-time stage tracking across all objects.',
}
```

### 2. Engagement tiers data (`data/engagement-tiers.js`)

```js
export const engagementTiers = [
  { id: 'growth', name: 'Growth', monthlyPrice: 15000, monthlyHours: 50, timeToGreen: '12-18 months' },
  { id: 'scale', name: 'Scale', monthlyPrice: 25000, monthlyHours: 100, timeToGreen: '6-9 months' },
  { id: 'enterprise', name: 'Enterprise', monthlyPrice: 50000, monthlyHours: 225, timeToGreen: '4-6 months' },
];
```

### 3. Phase definitions (`data/engagement-phases.js`)

```js
export const engagementPhases = [
  { id: 'stabilize', name: 'Stabilize', quarter: 'Q1', tagline: 'Fix the foundation' },
  { id: 'activate', name: 'Activate', quarter: 'Q2', tagline: 'Turn on growth motions' },
  { id: 'optimize', name: 'Optimize', quarter: 'Q3', tagline: 'Tune for performance' },
  { id: 'scale', name: 'Scale', quarter: 'Q4', tagline: 'Full operating rhythm' },
];
```

### 4. Phase assignment logic (`lib/engagement-roadmap.js`)

- Takes diagnostic results + tier selection
- Assigns projects to phases based on priority scoring
- Compresses/expands phases based on tier hours
- Calculates Power 10 progress per phase
- Returns structured roadmap for rendering

### 5. Impact calculator (`lib/impact-calculator.js`)

- Takes intake answers (ARR, rep count, deal size) + diagnostic findings
- Produces calculated impact statements where data supports it
- Falls back to benchmark ranges where data is insufficient
- Outputs per-finding impact + aggregate "total cost of inaction"

---

## New Components

| Component | Purpose |
|-----------|---------|
| `EngagementPitch.js` | Top-level walkthrough container with step navigation |
| `Power10Anchor.js` | Step 1 — Power 10 snapshot with summary punchline |
| `FindingCard.js` | Step 2 — Problem/Impact/Solution/Outcome card |
| `FindingsWalkthrough.js` | Step 2 — Container for finding cards with function grouping |
| `PhaseRoadmap.js` | Step 3 — Four-phase visual timeline |
| `TierSelector.js` | Step 4 — Tier cards with roadmap reflow |
| `Phase1Scope.js` | Step 5 — Detailed Phase 1 kickoff view |

All components live in `components/engagement-pitch/`.

---

## Integration Points

- **Entry**: New tab/view option on the diagnostic results page alongside existing views (layers, priority, scorecard, etc.)
- **Data flow**: Reuses existing diagnostic results + intake answers. New logic layers on top — no changes to diagnostic engine scoring.
- **SOW connection**: "Let's Start" screen can pre-populate SOW builder with Phase 1 projects from the selected tier.
- **v2 and v3 support**: Works with both engine versions. v2 uses enriched `DIAGNOSTIC_ITEMS`, v3 uses enriched competencies.

---

## Implementation Order

1. **Data enrichment** — Add primaryFunction, outcomes, power10Metrics, impact/outcome fields to v2 constants and v3 constants
2. **Engagement data files** — Create tiers, phases, and tier-recommendation logic
3. **Impact calculator** — Build the calculated + benchmark impact engine
4. **Phase assignment logic** — Build the roadmap generator that assigns projects to phases per tier
5. **Power10Anchor component** — Step 1 of the walkthrough
6. **FindingCard + FindingsWalkthrough** — Step 2
7. **PhaseRoadmap component** — Step 3
8. **TierSelector component** — Step 4 with roadmap reflow
9. **Phase1Scope component** — Step 5
10. **EngagementPitch container** — Wire it all together with step navigation
11. **Integration** — Add as a view option on diagnostic results page, wire SOW pre-population
