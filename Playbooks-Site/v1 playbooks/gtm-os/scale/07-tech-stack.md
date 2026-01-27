---
sidebar_position: 7
title: "Tech Stack"
description: "GTM tech stack for Scale stage — enterprise tools, integration requirements"
---

> **Scale Stage** | $5-15M ARR | 30-80 headcount
>
> Main challenge: Adding capacity without chaos. Process debt and tool sprawl.
>
> *[← Back to Scale Overview](./overview)*

## Tech Stack

**Principle:** Invest in scalable infrastructure. Integrations matter. The stack should support process, not create workarounds.

## Stack Evolution from Stabilize to Scale

| Category | Stabilize | Scale | Key Change |
|----------|-----------|-------|------------|
| **CRM** | Starter/Pro | Professional/Enterprise | Advanced automation, reporting |
| **MAP** | Basic automation | Full platform | Scoring, nurture, attribution |
| **SEP** | Basic or manual | Full platform | Sequences, cadences, analytics |
| **Enrichment** | Manual or light | Automated, scaled | Data quality at volume |
| **Conversation Intel** | Maybe | Essential | Coaching, deal intelligence |
| **CS Platform** | N/A | Consider | Health scoring, automation |
| **BI/Analytics** | Built-in reports | Real BI | Cross-system analytics |
| **RevOps tools** | Spreadsheets | Purpose-built | Forecasting, territory, comp |

## Tech Stack Recommendations

| Category | Recommendation | Why at Scale | Common Mistake |
|----------|---------------|--------------|----------------|
| **CRM** | HubSpot Pro/Enterprise, Salesforce | Advanced automation, enterprise reporting | Over-customizing, creating technical debt |
| **MAP** | HubSpot Pro, Marketo, Pardot | Scoring, attribution, complex nurture | Buying enterprise when Pro is enough |
| **SEP** | Outreach, Salesloft, Apollo | Rep productivity, sequence optimization | Not integrating with CRM |
| **Enrichment** | Clay, Clearbit, ZoomInfo | Data quality at volume | Buying before data strategy |
| **Conversation Intel** | Gong, Chorus | Coaching, deal visibility | Not enforcing recording adoption |
| **CS Platform** | ChurnZero, Gainsight | Health scoring, playbooks | Buying before process is defined |
| **BI** | Looker, Tableau, Mode | Cross-system reporting | Building dashboards nobody uses |
| **Forecasting** | Clari, Aviso | Forecast accuracy | Forecasting tool without forecast discipline |

## Integration Requirements

At Scale, integration becomes critical:

| Integration | Priority | Why |
|-------------|----------|-----|
| **CRM ↔ MAP** | Required | Lead flow, attribution |
| **CRM ↔ SEP** | Required | Activity sync |
| **CRM ↔ Enrichment** | Required | Data quality |
| **CRM ↔ CS Platform** | Required if CS platform | Customer 360 |
| **All ↔ BI** | Required | Unified reporting |
| **Conversation Intel ↔ CRM** | Required | Deal context |

**What NOT to do:**

- **Tool sprawl** — consolidate where possible, every tool has maintenance cost
- **No integration strategy** — siloed tools = siloed data
- **Buying ahead** — enterprise tools for non-enterprise needs
- **Ignoring adoption** — tools nobody uses are expensive decoration

**Scale stage tool pricing (2025):**

| Category | Tool | Price Range | Notes |
|----------|------|-------------|-------|
| **SEP** | Outreach | ~$100-160/user/mo | Enterprise-grade; often $20K+ annual minimum |
| **SEP** | Salesloft | ~$100-150/user/mo | Similar tier to Outreach |
| **Rev Intel** | Gong | ~$1,400-1,600/user/yr + $5K platform | Adds coaching, deal intel |
| **CS Platform** | Gainsight | ~$2,500+/mo (company) | Enterprise CS; requires dedicated ops |
| **CS Platform** | Totango | ~$1,000+/mo | Mid-market alternative |
| **CRM** | Salesforce Sales Cloud | $165/user/mo (Enterprise) | Full enterprise CRM |
| **MAP** | HubSpot Marketing Pro | ~$800/mo (3 seats) | Or Marketo for enterprise |

**Playbook reference:** → Tech stack playbooks (CRM, MAP, SEP, etc.)

---

