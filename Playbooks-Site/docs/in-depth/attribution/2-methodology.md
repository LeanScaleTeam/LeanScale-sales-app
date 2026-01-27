---
displayed_sidebar: inDepthSidebar
title: "Attribution Methodology"
sidebar_position: 2
---

# Attribution Methodology

Discovery & Data Audit - Buyer Journey Mapping - Attribution Model Selection

## Part 1: Discovery & Data Audit

### Step 1: Audit Current CRM Lead Source and Campaign Data

**Step Overview:** Assess what touchpoint data is currently captured in the CRM and identify data quality gaps. End state: Documented inventory of existing lead source values, campaign tracking fields, and data completeness percentages.

- Pull list of all Lead Source picklist values and analyze distribution across last 6 months of leads
- Identify inconsistent or duplicate source values (e.g., "Google" vs "google" vs "Google Ads" vs "Paid Search")
- Audit Campaign object usage: count campaigns created, campaign member records, and influence tracking
- Document which touchpoint data is captured vs missing (first touch, subsequent touches, offline events)
- Quantify data quality gaps (e.g., "35% of leads have blank Lead Source")
- Export sample of 20-30 closed-won opportunities and manually trace their touchpoint history

---
displayed_sidebar: inDepthSidebar

**Data Quality Assessment Template:**

| Field | % Populated | # Unique Values | Issues Found |
|-------|-------------|-----------------|--------------|
| Lead Source | | | |
| Original Source | | | |
| Campaign Member | | | |
| UTM Source | | | |
| UTM Medium | | | |
| UTM Campaign | | | |

**Common Data Quality Issues:**
- Inconsistent naming (capitalization, abbreviations)
- Duplicate values meaning the same thing
- Blank or "Unknown" values
- Outdated picklist options no longer used
- Missing UTM parameter capture from forms

---
displayed_sidebar: inDepthSidebar

### Step 2: Map the Buyer Journey with Stakeholders

**Step Overview:** Interview marketing and sales to document the typical touchpoints from first interaction to closed-won. End state: Visual buyer journey map showing key touchpoints and conversion milestones.

- Schedule 45-60 min buyer journey mapping session with marketing (Demand Gen, Content) and sales leadership
- Document common first-touch channels (paid search, organic, events, referrals, outbound)
- Identify key conversion milestones: first touch, lead creation, MQL, SQL, opportunity creation, closed-won
- Map typical touchpoints between milestones (nurture emails, webinars, sales calls, content downloads)
- Note differences in journey by segment (enterprise vs SMB, inbound vs outbound)
- Create visual journey map showing touchpoints at each stage for stakeholder alignment

---
displayed_sidebar: inDepthSidebar

**Buyer Journey Workshop Agenda (60 min):**

| Time | Activity |
|------|----------|
| 0-10 min | Context setting: why we're doing this, what good looks like |
| 10-25 min | Map first-touch channels (whiteboard exercise) |
| 25-40 min | Map touchpoints between milestones |
| 40-50 min | Identify segment differences (enterprise vs SMB) |
| 50-60 min | Validate and prioritize gaps |

**Key Questions to Ask:**
- What are the most common ways prospects first find us?
- What content or events do prospects typically engage with before becoming MQL?
- How do enterprise deals differ from SMB in their journey?
- What touchpoints happen offline that we're not tracking?
- When do sales and marketing overlap in touching the same prospect?

---
displayed_sidebar: inDepthSidebar

### Step 3: Evaluate and Select Attribution Model

**Step Overview:** Analyze attribution model options against client's sales cycle and business needs, then recommend the appropriate model. End state: Attribution model selected and documented with stakeholder buy-in.

- Review attribution model options: first-touch, last-touch, linear, U-shaped, W-shaped, time-decay
- Analyze client's average sales cycle length (short cycles favor simpler models; 6+ month cycles need multi-touch)
- Consider buying committee complexity (multiple stakeholders require account-level attribution)
- Evaluate CRM/MA native attribution capabilities (Salesforce Campaign Influence vs custom solution)
- Present recommendation with pros/cons to VP Marketing and RevOps
- Document selected model rationale and get stakeholder sign-off

---
displayed_sidebar: inDepthSidebar

**Model Selection Decision Framework:**

| Factor | Simpler Model (First/Last/Linear) | Complex Model (U/W/Time-Decay) |
|--------|-----------------------------------|--------------------------------|
| Sales cycle | Under 30 days | 30+ days |
| Buying committee | Single buyer | Multiple stakeholders |
| Marketing complexity | Few channels | Many channels and touchpoints |
| Data maturity | Limited touchpoint data | Rich touchpoint history |
| Technical resources | Limited RevOps capacity | Dedicated attribution owner |

**Native Tool Capabilities:**

| CRM | Native Attribution | Customization Level |
|-----|-------------------|---------------------|
| Salesforce | Campaign Influence (Primary + Multi-Touch) | High - customizable models |
| HubSpot | Multi-Touch Revenue Attribution | Medium - preset models |
| Dynamics | Marketing attribution | Medium |

---
displayed_sidebar: inDepthSidebar

**Attribution Model Recommendation Template:**

```
RECOMMENDED MODEL: [Model Name]

RATIONALE:
- Sales cycle: [X days/months average]
- Buying committee: [Typical # stakeholders]
- Current data maturity: [Assessment]
- Technical feasibility: [Assessment]

PROS:
- [Pro 1]
- [Pro 2]

CONS/LIMITATIONS:
- [Con 1]
- [Con 2]

ALTERNATIVE CONSIDERED: [Model Name]
- Why not selected: [Reason]

STAKEHOLDER SIGN-OFF:
- VP Marketing: [Date]
- RevOps: [Date]
```

---
displayed_sidebar: inDepthSidebar

## Discovery Output Summary

At the end of the Discovery & Methodology phase, you should have:

1. **Data Quality Assessment**
   - Inventory of current Lead Source values with % populated
   - Campaign tracking audit (# campaigns, members, influence records)
   - Quantified data gaps (% blank, % inconsistent)
   - Sample opportunity touchpoint traces

2. **Buyer Journey Map**
   - Visual map of touchpoints by stage
   - First-touch channel distribution
   - Segment-specific journey variations
   - Offline touchpoint inventory

3. **Attribution Model Selection**
   - Recommended model with rationale
   - Stakeholder sign-off documented
   - Technical approach (native vs custom)
   - Lookback window determined

**Key Decisions Made:**
- Which attribution model to implement
- What lookback window to use (typically 90-180 days)
- How to handle offline touchpoints
- Whether to use native CRM capabilities or build custom
