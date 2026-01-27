---
title: "Automated Inbound"
sidebar_position: 0
displayed_sidebar: inDepthSidebar
---

# Automated Inbound

**Project Type:** Lead Enrichment, Routing & Speed-to-Lead Automation

Automate the enrichment, scoring, routing, and follow-up of inbound leads using Clay and CRM workflows so leads are instantly actioned—not sitting in a queue.

## What's in This Playbook

| Page | Description |
|------|-------------|
| [Overview](overview) | What Automated Inbound is, what it unlocks, business outcomes, speed-to-lead data |
| [Methodology](methodology) | Scoping & discovery, channel mapping, MQL criteria, approach selection |
| [Implementation](implementation) | Build Clay enrichment, configure routing, create sequences, QA & deploy |
| [Post Support](support) | Dependencies, pitfalls, success metrics, maintenance, AI usage, edge cases |

---

## Quick Links

### Overview
- [What is Automated Inbound?](overview#what-is-automated-inbound) - Definition and core transformation
- [What Automated Inbound Unlocks](overview#what-automated-inbound-unlocks) - Before/after comparison
- [Business Outcomes](overview#business-outcomes) - Primary and secondary outcomes
- [The Data Behind the Problem](overview#the-data-behind-the-problem) - Speed-to-lead research

### Methodology
- [Target Motion & Ideal Profile](methodology#target-motion--ideal-profile) - Who this is for
- [Stakeholders & Roles](methodology#stakeholders--roles) - RACI and ownership
- [Scoping Factors](methodology#scoping-factors) - 8 factors that shape the approach
- [Discovery Questions](methodology#discovery-questions) - What to ask in kickoff
- [Multiple Approaches](methodology#multiple-approaches) - Post-Market Map vs Standalone

### Implementation
- [Part 1: Map Channels & Define Triggers](implementation#part-1-map-channels--define-triggers)
- [Part 2: Build Clay Enrichment Table](implementation#part-2-build-clay-enrichment-table)
- [Part 3: Build Routing Logic](implementation#part-3-build-routing-logic)
- [Part 4: Build Messaging & Sequences](implementation#part-4-build-messaging--sequences)
- [Part 5: QA & Deployment](implementation#part-5-qa--deployment)

### Support
- [Dependencies & Inputs](support#dependencies--inputs) - What must exist before starting
- [Common Pitfalls](support#common-pitfalls) - Mistakes to avoid
- [Success Metrics](support#success-metrics) - How to measure success
- [Edge Cases & Troubleshooting](support#edge-cases--troubleshooting) - Common issues

---

## Key Concepts

- **Speed-to-Lead:** The time between a lead filling out a form and receiving a response (target: under 5 minutes)
- **Tier-Based Routing:** Prioritizing T1 accounts for human follow-up while automating T2/T3
- **Waterfall Enrichment:** Querying multiple data providers in sequence until data is found (80%+ match rates)
- **Webhook Receiver:** Real-time trigger that sends leads from CRM to Clay for instant processing
- **Market Map Integration:** Using existing account data to check fit before spending enrichment credits

---

## When to Use This Project

**Good fit:**
- B2B SaaS company with inbound lead flow (demo requests, trial signups, contact forms)
- At least 50+ inbound leads/month (to justify automation investment)
- Using Clay or open to Clay for enrichment
- CRM is Salesforce or HubSpot
- Inbound volume exceeding what reps can manually process

**Prerequisites:**
- CRM with admin access
- Defined ICP criteria and lead scoring model (even if basic)
- Lead routing rules documented
- Inbound lead forms operational

**Related Projects:**
- Market Map (foundation for tier-based prioritization)
- Lead Lifecycle Definition (MQL criteria)
- Automated Outbound (similar architecture for outbound motion)

---

## The Speed-to-Lead Imperative

**Why this matters:**

- **5-minute window:** Responding in 5 minutes makes you 21x more likely to qualify vs 30 minutes
- **First responder wins:** 78% of B2B customers buy from the vendor who responds first
- **The reality gap:** Average B2B response time is 42-47 hours; 63% of companies never respond at all

**What you get:**
- Leads contacted within minutes, not hours
- Tier-based routing (T1 gets white glove treatment)
- Consistent off-hours follow-up via automation
- Enrichment data available before rep outreach
