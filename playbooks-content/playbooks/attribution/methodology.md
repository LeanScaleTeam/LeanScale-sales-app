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

### Step 2: Map the Buyer Journey with Stakeholders

**Step Overview:** Interview marketing and sales to document the typical touchpoints from first interaction to closed-won. End state: Visual buyer journey map showing key touchpoints and conversion milestones.

- Schedule 45-60 min buyer journey mapping session with marketing (Demand Gen, Content) and sales leadership
- Document common first-touch channels (paid search, organic, events, referrals, outbound)
- Identify key conversion milestones: first touch, lead creation, MQL, SQL, opportunity creation, closed-won
- Map typical touchpoints between milestones (nurture emails, webinars, sales calls, content downloads)
- Note differences in journey by segment (enterprise vs SMB, inbound vs outbound)
- Create visual journey map showing touchpoints at each stage for stakeholder alignment

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
