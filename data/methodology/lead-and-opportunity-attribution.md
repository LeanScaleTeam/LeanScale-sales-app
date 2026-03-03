# Attribution — Methodology

## 1) Core Concepts

### Lead Source vs Channel

**What is it?**

Lead Source describes the ACTION the lead takes (CTAs, form submissions, content downloads). Channel describes WHERE the lead came from (paid search, organic social, direct traffic, email).

These are two separate dimensions of attribution data that must never be combined into a single field.

**Why does it matter?**

A single lead source (like "Demo Request") can come from multiple channels (paid search, organic social, direct). Combining them into one picklist makes data unusable because you cannot answer "which channels drive demo requests?" or "which lead sources perform best on LinkedIn?"

**Key insight:**

"This is something that almost every client gets wrong. They conflate and combine channels and lead sources into one single custom picklist." — LeanScale

**Examples:**

| Lead Sources (Actions) | Channels (Where From) |
|---|---|
| Demo Request | Paid Search |
| Contact Us | Paid Social |
| Webinar Registration | Organic Search |
| Content Download | Organic Social |
| Trial Signup | Direct |
| Event Attendance | Referral |
| Chatbot Interaction | Email |

**Common misunderstandings:**

- **Misconception:** "Our lead source field includes values like 'Google Ads' and 'Demo Request'" **Reality:** Those are different dimensions. Google Ads is a channel/subchannel. Demo Request is a lead source. Keep them in separate fields.

- **Misconception:** "We track everything in one 'Lead Source' picklist for simplicity" **Reality:** This creates unusable data. You cannot analyze channel performance by lead source or vice versa.

---

### Record Source vs Lead Source

**What is it?**

Record Source describes how the contact record was CREATED in the system (ZoomInfo import, Clay enrichment, manual entry, integration sync). Lead Source describes meaningful ACTIONS the lead has taken that demonstrate engagement or intent.

**Why does it matter?**

A lead created via ZoomInfo import has not taken any action — they may not even know the company exists. Tracking this as a "lead source" makes first-touch attribution data meaningless because you are measuring record creation, not lead engagement.

**Key insight:**

"If a contact was created in the CRM from ZoomInfo, but that contact has not done anything else, all versions of lead source and channel fields should be blank, but the record source should show as ZoomInfo." — LeanScale

**The Framework:**

```
Record Source = WHO/WHAT created the record
Lead Source = WHAT ACTION the lead took
Record Source is ALWAYS populated (how did this record get here?)
Lead Source is ONLY populated when the lead takes a meaningful action
```

**Examples:**

| Scenario | Record Source | Lead Source | Reason |
|---|---|---|---|
| Contact imported from ZoomInfo, no engagement | ZoomInfo | Blank | No action taken by lead |
| Contact enriched from Clay, sales rep sends outbound email, no reply | Clay | Blank | Email sent TO lead, not action BY lead |
| Contact created when they filled out demo form | HubSpot Form | Demo Request | Form submission is a lead action |
| Contact imported from event list upload | Manual Upload | Event Attendance | Attending event was a lead action |
| Contact created from ZoomInfo, later fills out content download | ZoomInfo | Content Download | Record source stays, lead source reflects first action |

**Common misunderstandings:**

- **Misconception:** "ZoomInfo should be a lead source since that's where we got the lead" **Reality:** ZoomInfo is a record source. The lead did not take any action — you purchased their data. Lead source requires lead-initiated engagement.

- **Misconception:** "Outbound email should be a lead source" **Reality:** Sending an email TO a lead is not an action BY the lead. That email might go to spam or get ignored. Only track positive responses (reply, form fill) as lead sources.

---

### Touchpoint Definition — Lead Actions Only

**What is it?**

A touchpoint in attribution should only describe actions taken BY THE LEAD, not actions taken by salespeople or marketers toward the lead.

**Why does it matter?**

Including sales actions (like "outbound email sent") muddies the data. A sent email going to spam or being ignored is not a meaningful touch. Attribution should measure positive signals of lead engagement.

**Key insight:**

"A lot of companies will think that a lead source can be outbound. They think of a touchpoint as when a sales rep sends an email to a lead. That is not a touchpoint in terms of how we define it here. For all we know that email went to their spam folder." — LeanScale

**The Exception — When Outbound CAN Be Tracked:**

Outbound can be tracked as a lead source ONLY if:

1. They have robust tracking of positive email replies to outbound emails, OR
2. A link in an outbound email leads to a form submission (the form fill is the touchpoint, not the email send)

**Examples:**

| Action | Track as Touchpoint? | Why |
|---|---|---|
| Lead fills out demo request form | Yes | Lead-initiated action |
| Sales rep sends outbound email | No | Sales action, not lead action |
| Lead replies positively to outbound email | Yes (if trackable) | Lead-initiated response |
| Lead clicks link in email and fills form | Yes | Form fill is lead action |
| Lead attends webinar | Yes | Lead-initiated action |
| Marketing sends nurture email | No | Marketing action, not lead action |
| Lead downloads gated content | Yes | Lead-initiated action |

---

### Three Attribution Touch Types

**What is it?**

Attribution tracking uses three distinct touch types to capture different points in the buyer journey:

1. **First Touch (Original)** — The very first meaningful action a lead takes
2. **MQL Touch** — The action that pushed the lead over the marketing qualification threshold
3. **Latest Touch** — The most recent action taken

**Why does it matter?**

Each touch type answers different questions:

- First Touch: "What initially attracted this lead to us?"
- MQL Touch: "What finally qualified this lead for sales?"
- Latest Touch: "What is this lead currently engaged with?"

**The Framework:**

```
Latest Touch Fields:
    Constantly overwritten with each new action

First Touch Fields:
    Copy from Latest Touch ONCE (when first action occurs)
    Never overwritten again

MQL Touch Fields:
    Copy from Latest Touch when MQL criteria met
    May be overwritten if lead re-MQLs (depending on rules)
```

**Field Sets for Each Touch Type:**

| Field Name | First Touch | MQL Touch | Latest Touch |
|---|---|---|---|
| Lead Source | Original Lead Source | MQL Lead Source | Latest Lead Source |
| Lead Source Detail | Original Lead Source Detail | MQL Lead Source Detail | Latest Lead Source Detail |
| Lead Source Detail 2 | Original Lead Source Detail 2 | MQL Lead Source Detail 2 | Latest Lead Source Detail 2 |
| Channel | Original Channel | MQL Channel | Latest Channel |
| Sub-Channel | Original Sub-Channel | MQL Sub-Channel | Latest Sub-Channel |
| Campaign | Original Campaign | MQL Campaign | Latest Campaign |

**Key insight:**

"At the end of it, you'll have latest touch, which is constantly being overwritten with whatever the most recent thing they did was. First touch, which is the very first thing that happens, never to be overwritten ever again. And then MQL touch, which gets overwritten possibly, and only occasionally." — LeanScale

---

### Lead Attribution vs Opportunity Attribution

**What is it?**

**Lead Attribution:** Tracking the specific actions and channels associated with individual leads (first touch, MQL touch, latest touch). Operates at the contact level.

**Opportunity Attribution:** A lookback exercise when an opportunity is created — determining whether marketing or sales should get "credit" for generating that opportunity. Operates at the opportunity/account level.

**Why does it matter?**

These are fundamentally different exercises with different data, processes, and purposes. They should not be conflated.

**Key insight:**

"I'm very hesitant to use the word credit, because this by nature is a super oversimplification of where credit should go for generating an opportunity. In reality, especially if the company is doing a lot of ABM work, targeting and sales are reaching out and doing things to the same list of target companies at the same time." — LeanScale

**The Framework:**

| Dimension | Lead Attribution | Opportunity Attribution |
|---|---|---|
| Object Level | Contact | Opportunity/Account |
| Timing | Continuous (each action) | Point-in-time (opp creation) |
| Question Answered | "What did this lead do?" | "Who sourced this opp?" |
| Primary Use | Channel optimization | Target setting, forecasting |
| Precision | High (tracks specific actions) | Low (simplified categorization) |

**Important caveat:**

Opportunity attribution (inbound vs outbound) should ONLY be used for:

- Setting pipeline targets for each organization (marketing vs sales)
- High-level forecasting and planning

It should NOT be used for:

- Precise credit assignment (impossible in ABM environments)
- Compensation decisions (too oversimplified)
- Proving one team's value over another

---

### Attribution Models (First Touch vs Last Touch vs Multi-Touch)

**What is it?**

**First Touch Attribution:** Assigns 100% of conversion credit to the first interaction a prospect had with the brand. Best for understanding awareness sources.

**Last Touch Attribution:** Assigns 100% of conversion credit to the final interaction before conversion. Best for understanding what closes deals.

**Multi-Touch Attribution (MTA):** Distributes credit across multiple touchpoints throughout the buyer journey. Models include linear (equal credit), time-decay (more credit to recent), U-shaped (40% first, 40% last, 20% middle), and W-shaped (33% each to first, lead creation, opportunity creation).

**Why does it matter?**

The model you choose determines what insights you can extract and what decisions you can make with the data.

**Key insight:**

"Multi-touch attribution gives you 5% of the value that you're looking for out of an attribution project. The other 95% typically comes from just really solid and robust first and last touch attribution." — LeanScale

**The LeanScale Position on MTA:**

| Use Case | Is MTA Useful? | Better Alternative |
|---|---|---|
| Daily optimization | No | First/Last touch analysis |
| Weekly optimization | No | First/Last touch analysis |
| Monthly optimization | No | First/Last touch analysis |
| Quarterly planning | Marginally | First/Last touch with influenced data |
| Annual planning | Yes | Full MTA if implemented |

**The reasoning:**

- MTA is only useful for quarterly and annual planning
- 95% of the time, clients need weekly/monthly optimization, which MTA does not help with
- MTA tools are expensive and still require all the same implementation work
- First-party first/last touch data is more accurate than third-party MTA tools

**Industry context:**

According to 6sense's 2024 B2B Marketing Attribution Benchmark, "78% of B2B marketers struggle with cross-channel data integration." The average B2B deal requires 266 touchpoints and the journey spans approximately 211 days. Given this complexity, precise MTA is often impractical — solid first and last touch attribution delivers more actionable insights.

---

### UTM Parameter Strategy

**What is it?**

UTM parameters (Urchin Tracking Module) are standardized tags added to URLs that track traffic sources. The five parameters are:

- **utm_source:** The platform or domain (e.g., google, linkedin, newsletter)
- **utm_medium:** The channel type (e.g., cpc, email, organic-social)
- **utm_campaign:** The specific campaign name (e.g., q1-product-launch)
- **utm_content:** Differentiates similar content (e.g., banner-a, sidebar-cta)
- **utm_term:** The keyword for paid search

**Why does it matter?**

UTM values are the raw data that feeds into your attribution system. Without standardized UTMs, your channel and campaign reporting will be fragmented and unreliable.

**Key insight:**

"It doesn't really matter WHAT UTM values you use. It just matters that you agree to which ones you're going to use and you don't change that unless it's absolutely necessary. If they start using a different UTM value and they don't tell us, then it will get bucketed under an unknown or website direct channel." — LeanScale

**The Framework — Channel Translator Approach:**

Rather than forcing all teams to use specific UTM values, build a centralized "Channel Translator" workflow that:

1. Accepts any UTM values (even coded acronyms like "ppc" or "cpc")
2. Maps them to standardized, plain-English channel/sub-channel values
3. Stamps the standardized values on contact records for clean reporting

```
Raw UTM Data (messy) -> Channel Translator -> Clean Channel/Sub-Channel (reportable)
```

**Example UTM to Channel Mapping:**

| UTM Medium | UTM Source | Channel (Output) | Sub-Channel (Output) |
|---|---|---|---|
| cpc | google | Paid Search | Google Ads |
| cpc | bing | Paid Search | Bing Ads |
| paid-social | linkedin | Paid Social | LinkedIn |
| paid-social | facebook | Paid Social | Facebook/Meta |
| email | newsletter | Email | Newsletter |
| email | nurture | Email | Nurture Campaign |
| organic | linkedin | Organic Social | LinkedIn |
| referral | partner-name | Referral | Partner Name |

**Best Practices:**

1. **Use consistent formatting:** All lowercase with hyphens (e.g., linkedin-cpc, not LinkedIn CPC)
2. **Lock down conventions:** Create a master list of approved values with clear definitions
3. **Document the mapping:** Maintain a source-of-truth spreadsheet for all UTM-to-channel mappings
4. **Automate enforcement:** Use UTM builder tools to reduce manual errors
5. **Never change established values:** Changing UTMs breaks historical comparisons

---

### Inbound vs Outbound Opportunity Attribution

**What is it?**

A methodology for determining whether an opportunity was sourced through inbound marketing efforts or outbound sales efforts. This is applied at the moment of opportunity creation.

**Why does it matter?**

Sales and marketing teams commit to specific pipeline targets. Without a clear methodology to distinguish inbound from outbound, you cannot measure whether each team is delivering on their commitments.

**The Framework — Two Approaches:**

**Simplified Approach (Recommended for Series B and below):**

```
If ANY contact associated with the opportunity/account logged an MQL
within [X] days prior to opportunity creation:
    -> Mark as INBOUND
Else:
    -> Mark as OUTBOUND

Typical lookback window: 60 days
```

**Advanced Approach (Series C+ only):**

Also considers the pre-MQL period:

- Was there significant sales activity on the account BEFORE the MQL was logged?
- If yes, sales may have "warmed up" the account, so inbound credit is less clear

Complexity is 3-4x higher than simplified approach. Only recommended when:
- Company has robust activity tracking
- ABM program creates attribution ambiguity
- Stakeholders demand higher precision

**Key insight:**

"The simplified version, likely better for series B or below companies, is simply saying: has any contact associated with the opportunity or the account logged as an MQL within a certain period of time prior to opportunity creation. If yes, consider it inbound, if no, consider it outbound." — LeanScale

**Caveat — Attribution is Always Oversimplified:**

Deals result from combined efforts of sales, marketing, and sometimes product teams. Per Dreamdata, "inbound and outbound will be forever entwined, and trying to break them apart for deal attribution is a futile exercise." Use inbound/outbound attribution for target-setting, not for proving one team's value over another.

---

## 2) Decision Frameworks

### Approach Selection Matrix

| Company Stage | Marketing Spend | Channel Diversity | Recommended Approach |
|---|---|---|---|
| Series A/B | Any | Low-Medium | Simplified Core Attribution |
| Series A/B | High ($100k+/mo) | High | Phased Full Attribution |
| Series C+ | Any | Any | Full Kitchen Sink |

### Scoping Factors

**1. Company Size/Maturity**

- **Series A/B** → Simplified approach
  - Skip grouping fields
  - Skip MQL form submit URL tracking
  - Optional: Skip first-party cookie tracking
  - Use simple inbound/outbound methodology
- **Series C+** → Full build-out
  - Include all optional fields
  - Implement first-party cookie tracking
  - Consider advanced inbound/outbound methodology

**2. Marketing Program Budget**

- **Low spend (<$10k/month)** → Attribution less urgent, simplified approach acceptable
- **Medium spend ($10k-$100k/month)** → Standard attribution build
- **High spend ($100k+/month)** → Attribution highly important, full build recommended

**3. Channel Diversity**

- **Few channels (1-3 paid + organic)** → Faster project, fewer workflows
- **Many channels (5+ paid platforms, offline events)** → Larger project, more workflows needed

**4. SLG vs PLG Motion**

- Minimal impact on approach
- Main requirement: Clear lead/opportunity stage tracking exists
- PLG: Align touchpoints with PQL (Product Qualified Lead) definition
- SLG: Align touchpoints with MQL definition

---

### Build vs Buy Decision Framework

**Build (Custom First-Party Attribution) — RECOMMENDED**

**Best for:**

- All scenarios where possible
- Companies wanting highest accuracy ceiling
- Companies with web development resources available
- Cost-conscious organizations

**Why build wins:**

- Third-party attribution tools cost $200-$2,400+/month
- Even with third-party tools, you still need to do most of the implementation work anyway
- Third-party tools have same privacy restrictions as native tools (third-party cookie limitations)
- First-party custom-built systems can maintain more data without legal/privacy issues
- First-party systems have a higher accuracy ceiling that third-party tools cannot reach
- MTA (the major value prop of third-party tools) is typically overkill for operational needs

**Buy (Third-Party Attribution Tools) — NOT RECOMMENDED**

**Only consider when:**

- No web development resources available
- Executive mandate for specific vendor
- Multi-touch attribution is genuinely required for annual planning

**Disadvantages:**

- Enterprise tools (HubSpot Enterprise, Salesforce Marketing Cloud): $1,250-$2,400+/month
- Mid-market tools: $150-$500/month
- Implementation takes 2-6x longer than vendors suggest (budget 3-6 months for enterprise)
- Still requires all the same taxonomy, workflow, and data quality work
- Subject to same third-party cookie restrictions
- Does not reduce required skill level for implementation

**Key insight:**

"Third-party attribution tools are very, very expensive. We can build just as good and likely better quality data without the client needing to spend a ton of money. Even if you leverage a third-party attribution tool, you still have to do a lot of things in this project anyways." — LeanScale

---

### Series A/B Approach (Simplified Core Attribution)

**Best for:**

- Earlier stage companies
- Smaller marketing teams
- Limited ops resources
- Shorter project timelines

**What to include:**

| Component | Include? | Notes |
|---|---|---|
| First Touch fields | Yes | Core requirement |
| MQL Touch fields | Yes | Core requirement |
| Latest Touch fields | Yes | Core requirement |
| Lead Source + Detail | Yes | Core requirement |
| Channel + Sub-Channel | Yes | Core requirement |
| Lead Source Grouping | No | Skip — overkill for early stage |
| Channel Grouping | No | Skip — overkill for early stage |
| MQL Form Submit URL | No | Skip — nice-to-have only |
| First-Party Cookie Tracking | Optional | Use HubSpot/MAP third-party tracking instead |
| Inbound/Outbound Methodology | Simple | MQL date only, no pre-MQL analysis |

**Estimated effort:** 50-70 hours

---

### Series C+ Approach (Full Kitchen Sink)

**Best for:**

- Mature companies with larger marketing teams
- High marketing spend requiring optimization
- Complex multi-channel programs
- Companies with web development resources

**What to include:**

| Component | Include? | Notes |
|---|---|---|
| First Touch fields | Yes | Core requirement |
| MQL Touch fields | Yes | Core requirement |
| Latest Touch fields | Yes | Core requirement |
| Lead Source + Detail + Detail 2 | Yes | Full hierarchy |
| Channel + Sub-Channel | Yes | Core requirement |
| Lead Source Grouping | Yes | For executive reporting |
| Channel Grouping | Yes | For executive reporting |
| MQL Form Submit URL | Yes | Attribution debugging |
| First-Party Cookie Tracking | Yes | Higher accuracy |
| Inbound/Outbound Methodology | Advanced | Include pre-MQL activity analysis |

**Estimated effort:** 70-100+ hours

---

## 3) Benchmarks & Standards

### How to Use Benchmarks

Benchmarks are guidelines, not rules. Always:

1. Start with benchmark as baseline
2. Adjust based on client-specific data
3. Validate against their actual numbers when available
4. Document deviations and rationale

### B2B Funnel Conversion Rate Benchmarks

| Stage Transition | Low | Typical | High | Notes |
|---|---|---|---|---|
| Website Visitor to Lead | 1.1% | 2.3% | 7.0% | Varies by industry and content quality |
| Lead to MQL | 20% | 31% | 50% | Depends on MQL definition strictness |
| MQL to SQL | 8% | 13% | 25% | Sales acceptance rate |
| SQL to Opportunity | 30% | 45% | 59% | Opportunity creation rate |
| Opportunity to Closed Won | 15% | 22-30% | 40% | Deal close rate |

**Source:** Ruler Analytics analysis of 100+ million data points, industry averages compiled from multiple sources.

**Interpretation:**

- **Below low:** Investigate data quality issues, funnel stage definitions, or channel mix problems
- **Above high:** Validate data accuracy — may indicate loose definitions or data issues

---

### Conversion Rates by Channel

| Channel | B2B Average | Top Performers | Notes |
|---|---|---|---|
| Referral | 2.9% | 4-5% | Highest converting channel |
| Organic Search | 2.6-2.7% | 4-5% | Strong intent signal |
| Email Marketing | 2.4% | 3-4% | Nurture and promotional |
| Paid Search | 1.5-3.2% | 4-5% | High variance by keyword intent |
| Paid Social | 1.0-2.0% | 2-3% | Awareness focus |
| Direct | 2.0% | 3% | Brand awareness signal |

**Source:** First Page Sage B2B Conversion Rates by Industry, Ruler Analytics

---

### Attribution Project Benchmarks

| Metric | Benchmark | Context |
|---|---|---|
| Implementation time | 70+ hours | Even at smaller companies |
| Time to reliable data | 30-60 days | From launch date forward |
| Maintenance hours/month | 5-10 hours | Ongoing data quality monitoring |
| Data quality list check frequency | Daily-Weekly minimum | Catch issues early |
| First-year maintenance level | High | Decreases after processes established |

---

### Industry Attribution Statistics

| Statistic | Value | Source |
|---|---|---|
| Marketers citing attribution as biggest challenge | 48% | Various industry reports |
| B2B marketers struggling with cross-channel data integration | 78% | 6sense 2024 Benchmark |
| Average B2B deal touchpoints | 266 | HockeyStack 2024 |
| Average B2B buyer journey duration | 192-211 days | Dreamdata, HockeyStack |
| Stakeholders involved in B2B purchase | 5-9 people | RevSure 2025 |
| Marketers using attribution modeling | 41% | Salesforce 2025 |
| Marketers reporting siloed systems | ~90% | Industry surveys |

---

### Quick Reference Thresholds

| Question | Good | Warning | Red Flag |
|---|---|---|---|
| Data quality list membership | 0 members | 1-10 members | 10+ members |
| Unknown/Direct channel % | <10% | 10-25% | >25% |
| Blank lead source on MQLs | <5% | 5-15% | >15% |
| UTM mismatch rate | <2% | 2-10% | >10% |
| First touch blank, latest populated | 0 | 1-5 | 5+ |

---

## 4) Calculations & Scoring

> **Note:** Attribution is primarily a process and data structure project. Unlike Growth Model or Market Map, there are limited formulas required. The "calculations" are mostly workflow logic, not mathematical formulas.

### Attribution Field Logic

**First Touch Stamping Logic:**

```
IF Latest Lead Source IS KNOWN
AND Latest Attribution Completed Date IS KNOWN
AND Original Lead Source IS BLANK
THEN:
    Copy Latest Lead Source -> Original Lead Source
    Copy Latest Lead Source Detail -> Original Lead Source Detail
    Copy Latest Lead Source Detail 2 -> Original Lead Source Detail 2
    Copy Latest Channel -> Original Channel
    Copy Latest Sub-Channel -> Original Sub-Channel
    Copy Latest Campaign -> Original Campaign
```

**MQL Touch Stamping Logic:**

```
IF Latest Attribution Completed Date IS KNOWN
AND MQL Criteria IS MET
THEN:
    Copy Latest Lead Source -> MQL Lead Source
    Copy Latest Lead Source Detail -> MQL Lead Source Detail
    Copy Latest Lead Source Detail 2 -> MQL Lead Source Detail 2
    Copy Latest Channel -> MQL Channel
    Copy Latest Sub-Channel -> MQL Sub-Channel
    Copy Latest Campaign -> MQL Campaign
```

**Inbound vs Outbound Logic (Simplified):**

```
WHEN Opportunity IS CREATED:
    Look at all contacts associated with opportunity/account
    IF ANY contact has MQL Date within [60 days] prior to Opp Creation Date
    THEN:
        Stamp Opp as "Inbound"
        Copy MQL Touch fields from that contact to Opp
    ELSE:
        Stamp Opp as "Outbound"
```

---

### Channel Translator Logic Pattern

```
IF utm_medium = "cpc" AND utm_source = "google"
THEN:
    Set Latest Channel = "Paid Search"
    Set Latest Sub-Channel = "Google Ads"
ELSE IF utm_medium = "cpc" AND utm_source = "bing"
THEN:
    Set Latest Channel = "Paid Search"
    Set Latest Sub-Channel = "Bing Ads"
ELSE IF utm_medium = "paid-social" AND utm_source = "linkedin"
THEN:
    Set Latest Channel = "Paid Social"
    Set Latest Sub-Channel = "LinkedIn"
... [continue for all UTM combinations]
ELSE:
    Set Latest Channel = "Unknown"
    Add to "Untracked UTM" data quality list
```

---

## 5) Edge Cases & Deep Dives

### Early Stage Companies (Series A/B)

Company is Series A or B maturity with limited ops resources. Full attribution build is overkill — identify what to cut without sacrificing core value.

**Approach:**

1. **Skip grouping fields** — Lead Source Grouping and Channel Grouping are for executive rollups. Early stage doesn't need them yet.
2. **Skip MQL Form Submit URL** — Nice for debugging but not essential.
3. **Use MAP third-party tracking** — Skip custom first-party cookie tracking. HubSpot's built-in tracking is "good enough" for early stage.
4. **Use simple inbound/outbound methodology** — MQL date only, no pre-MQL activity analysis.
5. **Reduce workflow count** — Focus on evergreen lead sources only.

**Validation:** Can they still answer "Which channels drive the most MQLs?" and "What lead sources convert best?" If yes, the simplified approach is working.

---

### Multiple Ad Agencies Using Different UTMs

Client uses multiple agencies for different platforms. Each agency has their own UTM conventions, creating fragmented data.

**Option A: Align all agencies on single standard** — Create master UTM documentation, hold alignment meeting, enforce compliance through UTM builder tools.

**Option B: Update Channel Translator to handle variations** — Document all variations, add to Channel Translator workflow, map to same standardized output values.

**Example Channel Translator handling variations:**

```
IF utm_medium IN ("cpc", "ppc", "paid_search", "google-ads")
AND utm_source IN ("google", "goog", "adwords", "google-ads")
THEN:
    Set Latest Channel = "Paid Search"
    Set Latest Sub-Channel = "Google Ads"
```

**Validation:** Check "Unknown Channel" volume weekly. If increasing, new UTM variations need to be added to the translator.

---

### Changing Established UTM Values

After attribution is live, a team wants to change UTM values (e.g., from "linkedin" to "li" for source). Changing UTMs breaks historical data comparisons and requires system updates.

**Approach:**

1. **Strongly discourage the change** — Explain the downstream impact
2. **If change is unavoidable:** Update Channel Translator to handle both old AND new values, document the change date
3. **For future campaigns:** Old UTMs keep mapping to same channel output; new UTMs added to translator with same output

---

### Weak Lead Lifecycle Tracking (Prerequisite Missing)

Client wants attribution, but their lead lifecycle stages are not clearly defined or tracked. MQL definition is unclear or inconsistently applied.

Attribution cannot succeed without clear MQL definition and tracking. **Stop the attribution project** and execute a Lead Lifecycle project first:

- Define lead stages (Lead, MQL, SQL, Opportunity)
- Build stage tracking workflows
- Validate stage data quality
- Resume attribution after lifecycle stages are reliable

**Key insight:**

"If they don't have really good, clean lead lifecycle stage tracking, that is very much a prerequisite project to this. You can't measure where leads are coming from if you can't measure leads in general." — LeanScale

---

### Re-MQL Scenario

Client's lead lifecycle allows contacts to "re-MQL" after a period of inactivity then new engagement.

MQL Touch fields need to be overwritten on re-MQL, but First Touch fields should never change.

**Workflow logic:**

```
IF MQL Criteria IS MET
THEN:
    Copy Latest Touch fields -> MQL Touch fields (overwrite)
    Set Most Recent MQL Date = Today
    IF Original MQL Date IS BLANK
    THEN:
        Set Original MQL Date = Today
    Increment MQL Count by 1
```

---

### Backfilling Historical Data

Client wants to populate attribution fields for historical records created before the attribution system was built. Historical data quality is typically poor or non-existent.

**Approach:**

1. **Set expectations:** Backfill quality will be spotty at best. Data is only truly reliable from launch date forward.
2. **Attempt backfill only if:** UTM data exists in historical records, form submission data is available, or list import sources are documented.
3. **Document limitations:** Clearly note which records were backfilled and establish a "reliable data start date" for analysis.

---

## References

[1] 6sense — 2024 B2B Marketing Attribution and Contribution Benchmark

[2] HockeyStack — 2024 B2B Customer Journey Report

[3] Improvado — UTM Tracking Best Practices

[4] Dreamdata — Inbound vs Outbound: Who Cares?

[5] Matomo — Marketing Attribution Software 2024

[6] EasyInsights — Top Marketing Attribution Tools 2024

[7] Ruler Analytics — Average Conversion Rate by Industry

[8] First Page Sage — B2B Conversion Rates by Industry 2025

[9] RevSure — State of B2B Marketing Attribution 2025
