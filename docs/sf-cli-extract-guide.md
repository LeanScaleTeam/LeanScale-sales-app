# Salesforce CLI Data Extract — Consultant Guide

Extract Salesforce metadata and diagnostic signals when a customer's org blocks OAuth (Connected App) access. This produces the same data as the in-app OAuth flow — plus enhanced SOQL queries for deeper coverage.

## Prerequisites

1. **Salesforce CLI** (`sf`) installed — [install guide](https://developer.salesforce.com/tools/salesforcecli)
2. **Authenticated to the target org:**
   ```bash
   sf org login web --alias customer-org
   ```
   This opens a browser for OAuth login. Use an admin account with API access.
3. **Verify connection:**
   ```bash
   sf org display -o customer-org
   ```

## Quick Start

Run the `/sf-data-extract` skill in Claude Code:

```
/sf-data-extract
```

Claude will prompt for:
- **Org alias** — the name you used in `sf org login web --alias <name>`
- **Customer slug** — the URL path segment (e.g., `scandit-2` from `/c/scandit-2/...`)
- **API target** — Production (`clients.leanscale.team`) or Local (`localhost:3000`)

The skill runs ~50 SOQL queries in 3 phases, assembles a JSON payload, and uploads it.

## What Gets Extracted

### Phase A: Object Describes (6 queries)
Field metadata for Lead, Contact, Account, Opportunity, Case, Campaign. Used to detect:
- Custom field patterns (enrichment tools, methodology fields, commission tracking)
- Data model maturity and CRM hygiene

### Phase B: Core SOQL (~25 queries)
| Category | Queries | What It Detects |
|----------|---------|-----------------|
| Users & Roles | 2 | Rep count, team structure, org hierarchy |
| Pipeline | 2 | Stage design, lead lifecycle |
| Automation | 3 | Flows, validation rules, workflow rules |
| Platform | 5 | Apex, profiles, permission sets, packages |
| Content | 4 | Reports, dashboards, templates, files |
| Activity | 3 | Campaigns, tasks, recurring events |

### Phase C: Enhanced SOQL (~15 queries)
| Query | Intake Question(s) It Fills |
|-------|---------------------------|
| Won opp aggregate (THIS_YEAR) | A3 (ARR range) |
| Lead source distribution | A4 (GTM motion) |
| Won opps by type | D4 (growth model), D5_bookings |
| Lead conversion count | D5_mql, D5_mql_opp |
| Campaign types | C12 (events) |
| Login history (7 days) | C17 (IC daily use) |
| Report names | Power 10 metric reportability |
| Dashboard/report counts | D1, D2, D5 |
| Forecasting items | D3 (forecasting method) |
| Stage history count | D5_cycle |
| Contract count | D5_grr, D5_nrr |

## Coverage Expectations

After a full extract + deployment of latest inferrers:

| Section | Questions | Auto-filled | Notes |
|---------|-----------|-------------|-------|
| A — Company Profile | 5 | 3 | A1 (CRM type) always manual |
| B — GTM Tools | 2 | 1 | B2 (adoption level) is human-only |
| C — Processes | 16 | 13 | C14 (headcount), C15 (reviews), C18 (coaching) need human input |
| D — Reporting | 16 | 14 | Power 10 metrics + forecasting |
| T — Team & Org | 5 | 3 | T2 (ramp time), T4 depends on comp fields |
| E — Planning | 4 | 3 | E4 (bottleneck) is human-only |
| **Total** | **48** | **~37 (77%)** | |

## Troubleshooting

### "No such column" errors on Tooling API queries
Some orgs have different Tooling API schemas. Common fixes:
- `WorkflowRule.Active` doesn't exist → remove the `WHERE Active = true` filter
- `DuplicateRule` not supported → the skill auto-falls back to empty results
- `Flow.Label` vs `MasterLabel` → skill uses `MasterLabel` (correct for all orgs)

### API limit errors
Wait 5 minutes and retry. The extract makes ~50 queries; most orgs have 15,000/day.

### "sObject type not supported" errors
Some features (Territory2, KnowledgeArticle, ForecastingType) aren't enabled in every org. The skill handles this with fallback empty results.

### Customer slug not found
Ask the customer for their diagnostic URL. The slug is the path segment: `clients.leanscale.team/c/{slug}/try-leanscale/diagnostic`

### Upload returns 500
- Verify the customer ID is correct for the target environment
- `clients.leanscale.team` and `app.leanscale.com` have different customer IDs
- Use `curl -s "https://{domain}/api/customers/lookup?slug={slug}" | jq .id` to get the right ID

## Manual Re-upload

If you need to re-upload without re-querying:
```bash
curl -X POST https://clients.leanscale.team/api/salesforce/upload-json \
  -H "Content-Type: application/json" \
  -d @/tmp/sf-extract/payload.json
```

## File Reference

All extracted data is stored in `/tmp/sf-extract/`:
- `*.json` — Individual SOQL query results
- `payload.json` — Assembled upload payload
- `assemble.js` — Script that builds the payload from individual files

The data persists across sessions, so you can re-upload or inspect without re-querying.
