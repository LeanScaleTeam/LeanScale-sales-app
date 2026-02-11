# LeanScale Pricing Model — Retainer-Based Tiers

## Overview

LeanScale uses a **retainer-based pricing model**, NOT a rate × hours model. Customers subscribe to a monthly tier that provides a set number of hours per month at a fixed monthly price.

## Tiers

| Tier    | Hours/Month | Monthly Price |
|---------|-------------|---------------|
| Starter | 50          | $15,000       |
| Growth  | 100         | $25,000       |
| Scale   | 225         | $50,000       |

## How It Works

1. **Service Catalog** provides base hour estimates per project (e.g., "Lead Routing" = 30–60 hours). The catalog has NO pricing/rates.

2. **SOW Sections** each have hours (from catalog, editable by reps). Sections do NOT have a rate or per-section investment.

3. **Total Hours** across all sections determines which tier is recommended. The system recommends the smallest tier that can complete the work within ~6 months.

4. **Monthly Price** comes from the selected tier, not from hours × rate.

5. **Duration** = Total Hours ÷ Tier Hours/Month (rounded up).

6. **Total Engagement Value** = Monthly Price × Duration in Months.

## Example

- SOW has 5 sections totaling 280 hours
- Growth tier (100h/mo) → 3 months → $75,000 total
- Scale tier (225h/mo) → 2 months → $100,000 total
- System recommends Growth (fits within 6 months, lower cost)

## Custom Tiers

For non-standard deals, reps can create a custom tier with custom hours/month and monthly price. This is stored in the SOW's `tier_config.customTier`.

## Key Rules for Developers

- **Never multiply hours × rate** to compute investment
- **Sections don't have a `rate` field** — only `hours` and `catalogHours` (the original suggestion)
- **Service catalog entries have `hours_low` and `hours_high`** — no `default_rate`
- **Investment = tier monthly price × duration**, always
- **Reps can adjust hours** per section (catalog value shown as "suggested", rep's value as "actual")

## Data Flow

```
Diagnostic → Priority Items → Catalog Lookup → Section Hours
                                                    ↓
                                              Total Hours
                                                    ↓
                                         Tier Recommendation
                                                    ↓
                                    Monthly Price + Duration = Total Value
```

## Files

- `lib/engagement-engine.js` — TIERS constant, tier recommendation logic
- `lib/sow-auto-builder.js` — Section generation (hours only, no rates)
- `lib/sow-preview-engine.js` — Client-side preview calculator
- `components/sow/InvestmentConfigurator.js` — Tier selector UI
- `components/sow/SowBuilder.js` — Main builder with retainer summary
- `components/sow/SowPdfDocument.js` — PDF export with tier-based investment table
- `lib/api-validation.js` — Zod schemas (no rate on sections or catalog)
- `data/services-catalog.js` — Static catalog (hours only, no pricing)
