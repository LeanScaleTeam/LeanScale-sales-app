# Attribution Implementation - Full Playbook

## Project One-Pager

### Attribution One-Pager

#### Project Type

- **Category:** Balanced (30-40% Strategy, 30-40% Engineering, 20-30% Enablement)
- **Primary Deliverable:** Fully functional attribution tracking system in MAP/CRM with reporting and documentation

##### Phase Relevance

| Phase | Applies? | Weight | Notes |
|-------|----------|--------|-------|
| 1. Strategy | Yes | Heavy | 3-4 meetings: taxonomy workshop, UTM alignment, methodology |
| 2. Engineering | Yes | Heavy | 12-step technical build in HubSpot + Salesforce |
| 3. Enablement | Yes | Medium | Training by role + 4-week hypercare |
| 4. Handoff | Yes | Medium | Internal + External, maintenance schedule critical |

#### Phase Overview

```
      ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
      │ 1. STRATEGY  │────▶│ 2. ENGINEER  │────▶│3. ENABLEMENT │────▶│  4. HANDOFF  │
      │    Heavy     │     │    Heavy     │     │    Medium    │     │    Medium    │
      │ 1a→1b→1c→1d │     │ 2a→2b→2c→2d │     │ 3a→3b→3c→3d │     │ 4a→4b→4c→4d │
      └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
      3-4 meetings         12-step build        Training by role     Internal + External
      taxonomy + UTMs      HubSpot + SFDC       4-week hypercare     maintenance schedule
```

**This project's flow:**

- Full 4-phase. Heavy strategy (taxonomy + methodology alignment), heavy engineering (12-step CRM/MAP build), standard enablement (training + hypercare), standard handoff.
- Phase 1 cannot be skipped or compressed — taxonomy alignment is the blueprint for everything downstream.
- Phase 2 is the most time-intensive phase (40-50 hours for full build).
- No natural exit after Phase 1. Attribution always requires engineering.

#### Pre-Kickoff (1a)

##### Track A: Customer Homework

- Watch attribution intro video: [LeanScale Attribution Explained](https://www.youtube.com/watch?v=upSIhk8Yx9U)
- Provide links to any existing lead source/channel reports
- Document current UTM parameter standards (if any exist)
- Identify who manages digital advertising (internal team or agency name + contact)
- Confirm lead lifecycle stages are defined and tracked in CRM/MAP (hard blocker if not)

##### Track B: Architect Prep

- Validate lead lifecycle prerequisites — check MQL stage is timestamped in MAP/CRM
- Visit client website, inventory all CTAs (demo forms, contact us, content gates, chatbot, trial)
- Copy Lead Sources & Channels Template and pre-fill Lead Sources tab from website audit
- Pre-fill Channels tab with standard B2B options (Paid Search, Paid Social, Organic Search, Organic Social, Direct, Email, Referral, Events)
- Determine approach: Full Build (Series C+) vs Core Build (Series A/B)
- Prepare discovery questions list

#### Refinement Loop (1b → 1c → 1d)

| Meeting | Sub-Phase | Focus | Stakeholder | Output |
|---------|-----------|-------|-------------|--------|
| Kickoff / Taxonomy Workshop | 1b | Present pre-filled taxonomy, educate on methodology | Marketing Leader, Demand Gen | Corrected lead sources + channels |
| UTM / Agency Alignment | 1c | Map UTM values to channels, align ad agency on standards | Demand Gen, Ad Agency | Completed UTM-to-Channel mapping |
| Opp Attribution Workshop | 1c | Align on inbound/outbound methodology and lookback window | Marketing Leader, Sales Leader | Documented inbound/outbound rules |
| Final Review / Sign-Off | 1d | Review complete taxonomy + methodology, get sign-off | All stakeholders | Approved strategic package |

#### Phase Checklists

##### Phase 1: Strategy

- 1a. Pre-Kickoff complete (Track A + Track B)
- 1a. Lead lifecycle prerequisites validated (hard blocker)
- 1b. Taxonomy workshop held — lead sources, channels, sub-channels agreed
- 1c. UTM-to-Channel mapping complete, ad agency aligned
- 1c. Inbound/outbound methodology documented with lookback window
- 1d. Field naming conventions confirmed
- 1d. Strategic sign-off obtained — client understands maintenance requirements

##### Phase 2: Engineering

- 2a. Tech spec created from strategic package (field list, workflow logic, build sequence)
- 2b. Engineering handoff meeting held (Architect + Engineer review specs)
- 2c. 12-step build complete (fields, forms, workflows, translator, stamping, opp attribution)
- 2d. Data quality lists created and validated — lists ARE the QA mechanism

##### Phase 3: Enablement

- 3a. Training materials prepped (video walkthrough scripts, written guides, FAQ)
- 3b. Marketing leadership training delivered (dashboard interpretation)
- 3b. Technical handoff training delivered (workflow maintenance, data quality monitoring)
- 3b. Demand gen / ad agency trained on UTM requirements
- 3c. Hypercare period complete (4 weeks — weekly office hours, bug triage)
- 3d. Enablement sign-off — customer can operate independently

##### Phase 4: Handoff

- 4a. Maintenance schedule documented (daily/weekly/monthly/quarterly cadences)
- 4b. Internal handoff complete
- 4c. External handoff complete with documentation package
- 4d. Project closed, archived, retention path established

#### Document Types

##### Working Documents (iterate together)

| Document | Purpose | When Complete |
|----------|---------|----------------|
| Lead Sources & Channels Template | Capture taxonomy decisions | All lead sources, channels, sub-channels agreed |
| UTM-to-Channel Mapping Tab | Map raw UTM values to clean channel names | All UTM combinations mapped |
| Discovery Interview Notes | Capture current state and prerequisites | All discovery questions answered |
| Inbound/Outbound Methodology Doc | Define rules for opp attribution | Lookback window and rules agreed |

##### Deliverables (polished outputs)

| Deliverable | Created From | Customer Uses For |
|-------------|--------------|-------------------|
| Completed Lead Sources & Channels | Taxonomy working doc | Reference for all attribution values |
| UTM Builder Template | UTM mapping working doc | Generating correctly tagged campaign URLs |
| Attribution Dashboard (Salesforce) | Strategic package + build | Channel performance analysis and budget decisions |
| Documentation Package | All project artifacts | Ongoing reference and maintenance |
| Data Quality Monitoring Lists | Build phase | Ongoing data quality assurance |

#### Enablement Details

##### Training Types

| Type | Audience | Focus | Duration |
|------|----------|-------|----------|
| Leadership | VP Marketing, Head of Demand Gen | Dashboard interpretation, channel performance, budget decisions | 30-45m |
| Technical | Marketing Ops, RevOps Admin | Workflow maintenance, data quality monitoring, channel translator updates | 60m (split across 2-3 sessions) |
| Sales | VP Sales (optional) | What attribution data exists, inbound/outbound meaning | 15-20m |
| Agency/DG | Ad Agency, Demand Gen Team | UTM parameter requirements, UTM Builder usage, consequences of changes | 20-30m |

##### Hypercare

- **Applies:** Yes
- **Duration:** 4 weeks
- **Office Hours:** Yes — weekly 30-min slot
- **Includes:** Bug triage, data quality list monitoring support, retroactive backfill monitoring

##### Training Assets to Create

- Video walkthrough: Dashboard walkthrough and interpretation
- Video walkthrough: Data quality monitoring list process
- Video walkthrough: Channel translator maintenance (adding new UTMs)
- Video walkthrough: Non-evergreen campaign workflow cloning
- Doc: Field mapping reference (all attribution fields with descriptions)
- Doc: Maintenance playbook (step-by-step for common tasks)

#### Handoff & Retention

##### Internal Handoff

- Key context for Architect: What attribution model was built, which stakeholders own which pieces, common data quality issues and how to spot them
- Escalation trigger: Any attribution logic changes, new channel integrations, channel translator structural changes

##### External Handoff (LeanScale → Customer)

- Final meeting agenda: Live dashboard walkthrough, data quality list demo, methodology recap, maintenance schedule review, Q&A
- Documentation package: All training recordings, field documentation, workflow inventory, data quality list inventory, UTM Builder, maintenance playbook

##### Maintenance Schedule

- Daily/weekly data quality list checks, monthly UTM compliance audit, quarterly model validation, post-first-cycle full funnel audit
- Who owns: Single project = customer owns | Dedicated = Architect owns

##### Retention/Expansion Path

**If Single Project:** Upsell: Managed Services (5-10 hrs/month maintenance) → if no → Downsell: Another project → Retry retainer

**If Multi-Project (Dedicated):**

- Refinement check-in scheduled: ~90 days post-launch (after first sales cycle)
- Internal prep trigger: 2 weeks before
- Decision: Architect handles or escalation needed

#### Key Assets

| Asset | Link | When Used |
|-------|------|-----------|
| Lead Sources & Channels Template | [Google Sheets](https://docs.google.com/spreadsheets/d/1AP5rDNXihji-XkaKUqIR7tMo_Xrf4GJ6Bqq310GMLKo/edit?gid=1553690660#gid=1553690660) | Phase 1 (1a-1d) |
| UTM Builder Template | [Google Sheets](https://docs.google.com/spreadsheets/d/1H8ct7Tk1Oqjxk2Q3G36DL1JBTegN135ljHB3DSK9A4M/edit?usp=sharing) | Phase 1 (1c) + Handoff |
| Attribution Data Flow Chart | [Lucidchart](https://lucid.app/lucidchart/a52f1dc2-c12f-49bc-958c-30e3d347702e/view) | Phase 2 (2a-2c) |
| Enhanced Attribution Tracking Guide | [Google Doc](https://docs.google.com/document/d/1U87kXv293Y3H5zgzuZaI2OgBlLkr9arBaJoQImaUD2M/edit?usp=sharing) | Phase 2 (2c, Step 4) |
| LeanScale Playbook Slides (Attribution) | [Google Slides](https://docs.google.com/presentation/d/1m7UOGcnGAg_dKcFIndgMm_tf5CXLhPzYACwHHGXORDg/edit?slide=id.g2ed01e295a7_0_1484) | Phase 1 (1b) |
| Attribution Methodology YouTube Video | [YouTube](https://www.youtube.com/watch?v=upSIhk8Yx9U) | Phase 1 (1a, Track A) |

#### Definition Alignment Terms

| Term | Typical Definition |
|------|-------------------|
| Lead Source | The ACTION a lead takes (Demo Request, Content Download, Webinar Registration) — not where they came from |
| Channel | WHERE the lead came from (Paid Search, Organic Social, Direct, Email) — not what they did |
| Sub-Channel | More specific channel detail (Google Ads under Paid Search, LinkedIn Ads under Paid Social) |
| Record Source | How the contact record was created in the system (ZoomInfo import, manual entry) — NOT a lead source |
| Lead Source Detail | More specific description within a lead source (e.g., "Ebook - RevOps Guide" under Content Download) |
| Lead Source Detail 2 | Event/campaign-specific identifier for non-evergreen sources (e.g., "SaaStr 2025" under Event) |
| First Touch (Original) | The very first meaningful action a lead takes — stamped once, never overwritten |
| MQL Touch | The action that pushed the lead over the marketing qualification threshold — may be overwritten on re-MQL |
| Latest Touch | The most recent action — constantly overwritten with each new lead action |
| MQL | Marketing Qualified Lead — a lead that meets qualification criteria (definition varies by customer) |
| SQL | Sales Qualified Lead — a lead accepted by sales as worth pursuing |
| Inbound Opportunity | Opportunity where any associated contact logged an MQL within the lookback window prior to opp creation |
| Outbound Opportunity | Opportunity where no associated contact logged an MQL within the lookback window — sales-sourced |
| Lookback Window | Number of days before opportunity creation to check for MQL activity (standard: 60 days) |
| Channel Translator | Centralized HubSpot workflow that converts raw UTM values to plain-English channel/sub-channel names |
| Evergreen Lead Source | Always-on digital touchpoints (demo forms, contact us, content downloads) that run continuously |
| Non-Evergreen Lead Source | Point-in-time campaigns (events, specific webinars) that happen once and need individual workflows |
| Touchpoint | A lead-initiated action demonstrating engagement or intent — NOT sales/marketing actions toward the lead |

#### Common Gotchas

- **Lead lifecycle not in place** → Hard blocker. Attribution cannot be built on inconsistent lead stage data. Recommend lead lifecycle project first (4-6 weeks), then attribution. Do not proceed without validated MQL timestamps.
- **UTM misalignment from ad agency** → The #1 source of attribution data quality issues post-launch. Agencies change UTM values without telling anyone. Set clear expectations upfront, provide UTM Builder, monitor "Untracked UTM" data quality lists weekly. If persistent, escalate to marketing leadership for agency accountability.
- **Conflating lead source and channel** → Almost every client gets this wrong. They put "Paid Search" and "Demo Request" in the same picklist. Educate early and hold ground — these are separate dimensions that must be tracked in separate fields.
- **Re-MQL overwrites MQL touch** → Expected behavior. MQL touch fields get overwritten when a lead re-MQLs. Only First Touch never changes. If client wants to preserve original MQL data, create a separate "First MQL Touch" field set.
- **Dark social / untrackable referrals** → Some attribution will always be "Direct" or "Unknown." Consider adding "How did you hear about us?" self-reported field to forms. Use qualitatively alongside automated attribution.
- **Records imported without attribution** → ZoomInfo/Clay imports are record sources, NOT lead sources. All lead source fields should be blank until the contact takes a meaningful action. Train client on this distinction.
- **Salesforce-HubSpot sync delays** → Attribution fields populate in HubSpot but lag in Salesforce. Verify field mapping, check for sync errors, ensure field types match. Reporting should happen in Salesforce but troubleshooting in HubSpot.
- **"Set it and forget it" expectation** → Attribution requires 5-10 hours/month of maintenance. Data quality lists need monitoring at least weekly, ideally daily. First year is highest maintenance. Set this expectation during Phase 1 sign-off.
- **Multiple agencies with different UTM conventions** → Either align all agencies on a single standard (preferred) or update Channel Translator to handle all variations (more maintenance burden). Both are workable.
- **Client wants to change established UTMs after launch** → Strongly discourage. If unavoidable, update Channel Translator to handle BOTH old and new values. Never remove old mappings. Document the change date.
- **High volume in "Unknown" or "Direct" channel** → Check hidden fields on forms, check Channel Translator for gaps, verify cookie tracking is functioning. Some direct traffic is expected.
- **No sandbox needed** → Nine times out of ten we build from scratch using new custom fields, so there is minimal risk of breaking existing systems. Build and launch directly in production. The data quality monitoring lists ARE the QA mechanism.

#### Methodology Options

| Option | When to Use | Complexity |
|--------|-------------|-----------|
| Full Build (Series C+) | Series C+ maturity, significant marketing spend, diverse channels, 70+ hours | High |
| Core Build (Series A/B) | Series A/B maturity, limited budget, focused channels, 50-60 hours | Medium |

**Full Build includes:** All field sets including grouping fields, first-party cookie tracking, advanced inbound/outbound methodology (considers pre-MQL sales activity), MQL form submit URL tracking.

**Core Build excludes:** Grouping fields, first-party cookie tracking (uses MAP third-party), advanced inbound/outbound (uses simple MQL-date-only method), MQL form submit URL tracking.

**Build vs Buy:** Always recommend build. Even clients using third-party tools (Bizible, Attribution, etc.) still need taxonomy alignment, field creation, and workflow configuration. Third-party tools do not reduce the work required. First-party custom-built systems have a higher accuracy ceiling.

---

## Phase 1: Strategy

> **Goal:** Get stakeholder sign-off on the attribution taxonomy, UTM mapping, and inbound/outbound methodology before building anything.
>
> **Output:** Completed Lead Sources & Channels template + UTM-to-Channel mapping + documented inbound/outbound methodology (signed off by stakeholders).

### 1a. Pre-Kickoff

> Two parallel tracks run after the deal closes and before the taxonomy workshop.

#### Track A: Customer Homework

**What we send:**

| Item | Purpose | Format |
|------|---------|--------|
| Attribution Methodology Video | Educate on first/MQL/last touch models before workshop | [YouTube (5 min)](https://www.youtube.com/watch?v=upSIhk8Yx9U) |
| Existing Reports Request | Understand current attribution capabilities | Email request |
| UTM Documentation Request | Identify if UTM standards exist today | Email request |
| Agency/Demand Gen Contact Request | Identify who manages digital advertising | Email request |
| Lead Lifecycle Confirmation | Validate hard prerequisite before proceeding | Email request |

**Completion tracking:** Follow up on lead lifecycle confirmation first — this is the hard blocker. If lifecycle stages are not defined or tracked, attribution project cannot proceed. Recommend lead lifecycle project first (4-6 weeks), then attribution.

**If lead lifecycle prerequisites are NOT met:**

This is a blocker. Lead lifecycle must be implemented first. Without clean MQL timestamps, you cannot build MQL-touch attribution. Without consistent opportunity stages, opportunity attribution will produce unreliable data. Document the gap and recommend sequencing:

- Lead lifecycle project (4-6 weeks)
- Then attribution project (6-8 weeks)

**Validation Checklist:**

1. Ask: "Are your lead lifecycle stages clearly defined? Can they be accurately reported on in your CRM or MAP?"
2. Request links to existing lead stage reports
3. Verify in the system that MQL stage is being timestamped on contacts
4. Verify opportunity stages are consistently used

#### Track B: Architect Prep

**What the Architect does:**

| Step | Action | Output |
|------|--------|--------|
| 1 | Validate lead lifecycle prerequisites in client's MAP/CRM | Confirmed or documented blocker |
| 2 | Visit client website — inventory all CTAs, forms, content gates, chatbot, trial | Raw list of lead sources observed |
| 3 | Copy Lead Sources & Channels Template, pre-fill from website audit | v0 taxonomy template |
| 4 | Pre-fill Channels tab with standard B2B options | Draft channel taxonomy |
| 5 | Conduct discovery interview (can be separate call or via email) | Discovery notes |
| 6 | Determine approach: Full Build vs Core Build | Scoping decision documented |
| 7 | Prepare workshop agenda and questions to validate | Ready for taxonomy workshop |

**Discovery Questions to Ask:**

| Question | Why It Matters |
|----------|----------------|
| Do you have any documentation on your lead source/channel taxonomy? | Determines workshop starting point |
| Do you have standardization around UTM parameters? | Identifies if agency alignment is needed |
| Are you working with an ad agency that has a UTM methodology? | Critical dependency for UTM alignment |
| Do you have any custom automations or fields for attribution today? | Identifies existing work to evaluate or retire |
| What is your level of marketing spend? | Validates priority of attribution project |
| How many channels/ad platforms are you using? | Scopes the project size |
| What is your company stage (Series A/B vs. C+)? | Determines full vs. streamlined approach |

**Critical:** Mark everything as ASSUMED in the pre-filled template. The taxonomy workshop validates.

#### Stakeholder Alignment Document

> Get stakeholder sign-off on terms BEFORE building anything. Attribution projects stall when stakeholders disagree on what "Lead Source" means vs "Channel" vs "Record Source" mid-build.

| Term | Our Definition | Internally Approved? |
|------|----------------|----------------------|
| Lead Source | ACTION the lead takes (Demo Request, Content Download) — not where they came from | [ ] Yes / [ ] No |
| Channel | WHERE the lead came from (Paid Search, Organic Social) — not what they did | [ ] Yes / [ ] No |
| Record Source | How the contact record was created in the system — NOT a lead source | [ ] Yes / [ ] No |
| MQL | [Client's definition] — the qualification threshold for marketing leads | [ ] Yes / [ ] No |
| SQL | [Client's definition] — sales-accepted lead | [ ] Yes / [ ] No |
| Inbound Opportunity | Opp where associated contact had MQL within lookback window before opp creation | [ ] Yes / [ ] No |
| Outbound Opportunity | Opp where no associated contact had MQL within lookback window | [ ] Yes / [ ] No |
| First Touch | First meaningful action a lead takes — stamped once, never overwritten | [ ] Yes / [ ] No |
| MQL Touch | Action that qualified the lead — overwritten on re-MQL | [ ] Yes / [ ] No |

**Instructions to customer:**

> Review each definition with your leadership team. Check "Yes" when approved. We cannot proceed with the technical build until all terms are aligned. Pay special attention to the Lead Source vs Channel distinction — this is the most commonly conflated concept and the foundation of the entire system.

---

### 1b. Kickoff Call (Taxonomy Workshop)

> **Purpose:** Educate client on attribution methodology, walk through pre-filled taxonomy, and align on lead sources, channels, and sub-channels. We walk in with a pre-filled template — client reacts and refines, not creates from scratch.

#### Agenda (60-90 min)

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-10 | Attribution education | First/MQL/Last touch models, lead source vs channel, record source |
| 10-30 | Walk through pre-filled taxonomy | "Here's what we found from your website and standard B2B channels" |
| 30-50 | Complete Lead Sources tab live | Validate, add, remove lead sources — hold ground on actions only |
| 50-65 | Complete Channels/Sub-Channels | More standardized — less room for client opinion |
| 65-80 | Inbound/outbound methodology | Present simplified vs advanced, align on lookback window |
| 80-90 | Next steps | UTM alignment meeting needed, field names, assign homework |

**Attribution Education Content (5-10 minutes):**

1. **Attribution Models Overview** — First Touch (what attracted them), MQL Touch (what qualified them), Latest Touch (what they did most recently)
2. **Why first/last touch over multi-touch** — MTA provides ~5% of the value. First/last enables weekly/monthly optimization (95% of what clients need).
3. **Lead Source vs Channel distinction (Critical)** — Lead Sources = ACTIONS (Demo Request, Content Download). Channels = WHERE FROM (Paid Search, Organic Social). These are separate dimensions tracked in separate fields.
4. **Record Source vs Lead Source distinction (Critical)** — Record Source = how the record was created (ZoomInfo import). Lead Source = meaningful action by the lead. A ZoomInfo import with no engagement = blank lead source fields.

**Key Quote to Use:**

> "In order for a lead source to be populated, it requires some sort of action or measurable intent being taken by the lead themselves. If a contact was created from ZoomInfo but hasn't done anything else, all lead source fields should be blank."

#### What We Bring

- v0 pre-filled Lead Sources & Channels template
- Standard B2B channel taxonomy
- Discovery questions to validate
- Attribution methodology slides

#### What We Leave With

- Corrected lead sources tab (info needed to finalize)
- Agreed channels and sub-channels
- Initial inbound/outbound methodology direction
- UTM alignment meeting scheduled with ad agency/demand gen
- Clear homework: provide UTM documentation, confirm definitions with leadership

**Key Guidance During Workshop:**

1. **Only include current or near-future sources** — This is not an exercise to plan every possible lead source for the next 3 years. Additional sources can be added later.
2. **Lead sources must be ACTIONS** — Reject suggestions like "Outbound" or "Sales Email" as lead sources. A sent email is not a lead action.
3. **Exception for outbound** — Outbound CAN be a lead source if they track positive email replies or if a link in an outbound email leads to a form submission.
4. **Be descriptive** — Avoid ambiguous names like "Event." Use "Event - Sponsored Booth" vs "Event - Hosted Webinar."
5. **Hold your ground** — This is where your expertise matters. Do not let clients conflate lead sources and channels.

**Lead Source Structure:**

| Field | Purpose | Example |
|-------|---------|---------|
| Lead Source | High-level action category | Demo Request, Content Download, Webinar, Event |
| Lead Source Detail | More specific description (optional) | "Ebook - RevOps Guide", "Feature X Demo" |
| Lead Source Detail 2 | Event-specific (for non-evergreen) | "SaaStr 2025", "Dreamforce 2024" |

---

### 1c. Alignment Loop & Strategic Meeting Cadence

> **Purpose:** Complete the UTM-to-Channel mapping, align ad agency on UTM standards, and finalize inbound/outbound methodology. These can happen as separate meetings or combined based on stakeholder availability.

#### The Pattern

```
Taxonomy Workshop (gather initial taxonomy)
    ↓
Architect finalizes template, prepares UTM mapping tab
    ↓
UTM / Agency Alignment Meeting (map UTMs, align agency)
    ↓
Opportunity Attribution Workshop (inbound/outbound rules)
    ↓
Architect compiles complete strategic package
    ↓
Final Review → Sign-off
```

#### UTM Alignment Meeting (30 min)

**Who must attend:** Whoever manages digital advertising platforms (internal demand gen or external agency). This is the #1 source of attribution data quality issues post-launch.

**Two Scenarios:**

**Scenario A: Client/Agency Has Existing UTM Standards**

1. Request their existing UTM documentation
2. Populate the mapping tab with their values
3. Validate that values are consistent across platforms
4. Document any gaps or inconsistencies to address

**Scenario B: No Existing Standards (More Common)**

1. Fill out UTM-to-Channel mapping tab with recommended values
2. Present to client: "These are the UTM values you need to use going forward"
3. Create a UTM Builder for them
4. Schedule alignment meeting with ad agency

**UTM-to-Channel Mapping Example:**

| UTM Medium | UTM Source | Channel | Sub-Channel |
|-----------|-----------|---------|------------|
| cpc | google | Paid Search | Google Ads |
| cpc | bing | Paid Search | Bing Ads |
| paid-social | linkedin | Paid Social | LinkedIn Ads |
| paid-social | facebook | Paid Social | Facebook Ads |
| email | newsletter | Email | Newsletter |
| email | nurture | Email | Nurture Sequence |

**Setting Critical Expectations:**

> "Once we agree on these UTM values, they cannot be changed without making systems changes. If someone starts using different UTM values without telling us, the data will break and attribution will be inaccurate."

#### Inbound vs Outbound Methodology Workshop (30 min)

**Important Framing:** Avoid the word "credit." Opportunity attribution should only be used for setting targets for each organization (marketing vs. sales pipeline targets), not for precise credit assignment.

**Simplified Methodology (Series A/B):**

Rule: If any contact associated with the opportunity/account logged an MQL within 60 days prior to opportunity creation, mark as Inbound. Otherwise, mark as Outbound.

**Advanced Methodology (Series C+):**

Also consider pre-MQL period:

- Was there significant sales activity (sequences, meetings) on the account before the MQL was logged?
- If yes, may warrant Outbound classification even with MQL present
- Complexity increases 3-4x — only recommend for mature companies

**Workshop Actions:**

1. Present both methodologies
2. Ask if they have existing rules
3. Align on lookback window (60 days is standard, can adjust)
4. Document the agreed methodology
5. Walk through 2-3 example scenarios to validate understanding

#### Field Naming Conventions

Confirm with client during alignment loop. Standard field names:

**First Touch (Original) Fields:**

- Original Lead Source, Original Lead Source Detail, Original Lead Source Detail 2
- Original Channel, Original Sub-Channel, Original Campaign

**MQL Touch Fields:**

- MQL Lead Source, MQL Lead Source Detail, MQL Lead Source Detail 2
- MQL Channel, MQL Sub-Channel, MQL Campaign

**Latest Touch Fields:**

- Latest Lead Source, Latest Lead Source Detail, Latest Lead Source Detail 2
- Latest Channel, Latest Sub-Channel, Latest Campaign
- Latest Attribution Completed Date/Time

**UTM Fields (DO NOT RENAME — HubSpot auto-populates):**

- utm\_source, utm\_medium, utm\_campaign

**Optional Fields (Series C+ Only):**

- Original/Latest Lead Source Grouping, Original/Latest Channel Grouping
- Original/MQL Form Submit URL

#### Typical Timeline

| Milestone | Timing |
|-----------|--------|
| Pre-kickoff prep | 1-2 days |
| Taxonomy Workshop | Day 1 of engagement |
| UTM / Agency Alignment | Within 1 week of workshop (depends on agency availability) |
| Opp Attribution Workshop | Can combine with workshop or schedule within same week |
| Final Review + Sign-off | When all inputs confirmed (~1-2 weeks after workshop) |

---

### 1d. Strategic Sign-Off

> **Purpose:** Confirm we have everything before proceeding to the technical build.

#### Validation Checkpoint

- Lead Sources & Channels template fully completed (lead sources, channels, sub-channels)
- UTM-to-Channel mapping complete — all UTM combinations documented
- Ad agency / demand gen team aligned on UTM standards
- Inbound/outbound methodology documented with lookback window
- Field naming conventions confirmed
- Approach confirmed: Full Build or Core Build
- Client understands maintenance requirements (5-10 hrs/month)
- All stakeholders aligned on definitions (Lead Source vs Channel vs Record Source)
- No blockers for engineering

#### Decision Point

- **Proceed to Engineering** → Always. Attribution projects do not have a natural exit after Phase 1. The strategic package is the blueprint, not the product.

**Maintenance Expectations to Communicate at Sign-Off:**

> "This is NOT a 'set it and forget it' project. After launch: data quality lists must be monitored weekly (ideally daily), any new channels or campaigns require attribution tracking updates, expect 5-10 hours per month for ongoing maintenance, and first year will have the highest maintenance as issues are identified and fixed."

---

## Phase 2: Engineering

> **Goal:** Build and test the complete attribution system in MAP and CRM based on the approved strategic package.
>
> **Output:** Fully functional attribution tracking system with all fields, workflows, monitoring lists, and dashboard — tested and customer-approved.

Attribution is a **Balanced** project type with **Medium-Heavy (30-40%)** engineering weight. This is a 12-step sequential build in HubSpot and Salesforce. No sandbox needed — we build from scratch using new custom fields with minimal risk of breaking existing systems.

### Sub-Phases

```
2a Tech Spec → 2b Engineering Handoff → 2c Build (12 Steps) → 2d Test (Data Quality Lists)
```

---

### 2a. Tech Spec

> **Purpose:** Translate the strategic package into a technical build specification.

**Input:** Signed-off strategic package from Phase 1 (completed taxonomy template, UTM mapping, methodology doc)

**What happens:**

1. Architect translates the Lead Sources & Channels template into a field creation list
2. Architect translates the UTM-to-Channel mapping into Channel Translator workflow logic
3. Architect documents the 12-step build sequence with specifics from this customer's taxonomy
4. Architect identifies approach-specific items to include or skip (Full Build vs Core Build)

**Output:** Tech spec containing:

- **Field list:** Every attribution field to create in HubSpot and Salesforce, with field types and picklist values from the approved taxonomy
- **Workflow logic:** Lead source workflow triggers (which forms trigger which lead source values), Channel Translator branching logic (every UTM combination), First Touch stamping logic, MQL Touch stamping additions
- **Build sequence:** The 12-step order with customer-specific details
- **Approach-specific scope:** Which optional steps to include (first-party cookies, grouping fields, etc.)

Reference: [Attribution Data Flow Chart](https://lucid.app/lucidchart/a52f1dc2-c12f-49bc-958c-30e3d347702e/view)

---

### 2b. Engineering Handoff

> **Purpose:** Review tech specs with engineer before building. Engineer should understand the WHY (strategic) not just the WHAT (technical).

**Agenda (30-45 min):**

| Time | Topic | What Happens |
|------|-------|--------------|
| 0-15 | Walk through taxonomy | Architect explains lead source vs channel distinction, customer's specific sources |
| 15-25 | Walk through build plan | 12-step sequence, field types, workflow logic |
| 25-35 | Review edge cases | Customer-specific considerations, approach (full vs core) |
| 35-45 | Q&A and confirm | Clarify ambiguities, confirm build approach |

**What Architect brings:**

- Strategic package (completed Lead Sources & Channels template, UTM mapping, methodology doc)
- Tech spec (field list, workflow logic, build sequence)
- Customer-specific notes (approach, edge cases, agency concerns)

**What engineer leaves with:**

- Approved tech spec with clear build sequence
- Access to client's HubSpot and Salesforce
- Known risks/dependencies (agency UTM compliance, existing workflows to avoid conflicting with)

---

### 2c. Build (12-Step Sequence)

> **Purpose:** Build the complete attribution system in HubSpot and Salesforce.

**Input:** Approved tech spec from 2b

**QA Approach:** No sandbox needed. Nine times out of ten we build from scratch using new custom fields, so there is minimal risk of breaking existing systems. Build and launch directly in production. The data quality monitoring lists (Step 12) ARE the QA mechanism.

#### Step 1: Create Attribution Fields in HubSpot

Create all custom fields on the Contact object in HubSpot.

**First Touch Fields:**

| Field Name | Field Type | Picklist Values |
|-----------|-----------|-----------------|
| Original Lead Source | Single-line text or Dropdown | All lead sources from taxonomy |
| Original Lead Source Detail | Single-line text | N/A |
| Original Lead Source Detail 2 | Single-line text | N/A |
| Original Channel | Dropdown | All channels from taxonomy |
| Original Sub-Channel | Dropdown | All sub-channels from taxonomy |
| Original Campaign | Single-line text | N/A |

**MQL Touch Fields:**

| Field Name | Field Type | Picklist Values |
|-----------|-----------|-----------------|
| MQL Lead Source | Single-line text or Dropdown | All lead sources from taxonomy |
| MQL Lead Source Detail | Single-line text | N/A |
| MQL Lead Source Detail 2 | Single-line text | N/A |
| MQL Channel | Dropdown | All channels from taxonomy |
| MQL Sub-Channel | Dropdown | All sub-channels from taxonomy |
| MQL Campaign | Single-line text | N/A |

**Latest Touch Fields:**

| Field Name | Field Type | Picklist Values |
|-----------|-----------|-----------------|
| Latest Lead Source | Single-line text or Dropdown | All lead sources from taxonomy |
| Latest Lead Source Detail | Single-line text | N/A |
| Latest Lead Source Detail 2 | Single-line text | N/A |
| Latest Channel | Dropdown | All channels from taxonomy |
| Latest Sub-Channel | Dropdown | All sub-channels from taxonomy |
| Latest Campaign | Single-line text | N/A |
| Latest Attribution Completed Date/Time | Date picker | N/A |

**UTM Fields (HubSpot Naming Convention — DO NOT CHANGE):**

| Field Name | Field Type | Notes |
|-----------|-----------|-------|
| utm\_source | Single-line text | HubSpot auto-populates if named exactly this way |
| utm\_medium | Single-line text | HubSpot auto-populates if named exactly this way |
| utm\_campaign | Single-line text | HubSpot auto-populates if named exactly this way |

**Optional Fields (Series C+):**

| Field Name | Field Type |
|-----------|-----------|
| Original Lead Source Grouping | Dropdown |
| Latest Lead Source Grouping | Dropdown |
| Original Channel Grouping | Dropdown |
| Latest Channel Grouping | Dropdown |
| Original Form Submit URL | Single-line text |
| MQL Form Submit URL | Single-line text |

**Technical Note:** The utm fields MUST be named exactly as shown (lowercase, underscore) for HubSpot to auto-populate them from form submissions. Any variation in naming will break the auto-population feature.

#### Step 2: Create Attribution Fields in Salesforce

Replicate all attribution fields in Salesforce on Contact, Lead, and Opportunity objects.

**Objects to Create Fields On:**

- Contact — all attribution fields mirrored from HubSpot
- Lead — all attribution fields mirrored from HubSpot
- Opportunity — Opportunity Attribution Type (Picklist: Inbound, Outbound), Opportunity Lead Source, Opportunity Channel, Opportunity Sub-Channel, Opportunity Campaign

**Actions:**

1. Create matching fields for all HubSpot attribution fields on Contact and Lead
2. Set up field mapping in HubSpot-Salesforce sync settings
3. Create Opportunity-specific fields for inbound/outbound attribution

**Technical Note:** All reporting should happen in Salesforce, even though logic is built in HubSpot. This ensures sales and marketing leadership see consistent data in their primary reporting tool.

#### Step 3: Configure Hidden Fields on HubSpot Forms

Add hidden UTM fields to all website forms to capture attribution data from URLs.

**Fields to Add as Hidden:**

- utm\_source
- utm\_medium
- utm\_campaign

**Process:**

1. Navigate to Marketing > Forms in HubSpot
2. Edit each website form
3. Add the three UTM fields
4. Set each field to "Hidden"
5. Enable "Pre-populate with URL parameter" for each
6. Save and publish

> **HubSpot Magic:** If you name the custom fields exactly `utm_source`, `utm_medium`, `utm_campaign` and add them as hidden fields on HubSpot forms, HubSpot will automatically pull UTM values from the URL into those fields. This is why we name them exactly that way — do NOT change these field names.

#### Step 4: Implement First-Party Cookie Tracking (Optional — Series C+ Recommended)

Work with the client's web development team to implement first-party cookie tracking for enhanced attribution accuracy.

**Why This Matters:** Third-party cookies (including HubSpot's tracking cookie) have limitations — users can opt out, cross-session attribution is lost when cookies are blocked. First-party cookies can be classified as "essential" with legal approval, providing more persistent tracking.

**When to Skip:**

- Series A/B companies (overkill for the stage)
- Client has no web development resources
- Shortened project timeline

**Implementation Process:**

1. Send web development team the implementation guide: [Enhanced Attribution Tracking Guide](https://docs.google.com/document/d/1U87kXv293Y3H5zgzuZaI2OgBlLkr9arBaJoQImaUD2M/edit?usp=sharing)
2. Schedule 30-minute alignment call with web dev team
3. Web dev implements first-party cookie tracking on the website
4. Coordinate with legal on cookie classification
5. Test that UTM values persist across sessions

**Technical Note:** LeanScale does not handle the web development work. This is a collaboration with the client's team. Our role is providing specifications and testing the implementation.

#### Step 5: Create Lead Source Workflows (Evergreen)

Create workflows for each evergreen lead source that stamp Latest attribution fields.

**What is an Evergreen Lead Source?** Always-on digital touchpoints: demo request forms, contact us forms, content downloads, newsletter signups, chatbot interactions, trial signups. They do not change per campaign.

**Workflow Structure for Each Lead Source:**

**Trigger:** Form submission (specific form or form type)

**Actions:**

1. Set Latest Lead Source = [Lead Source Value]
2. Clear Latest Lead Source Detail (or set specific value if applicable)
3. Clear Latest Lead Source Detail 2 (unless needed)
4. If online channel: Call the Channel Translator workflow (see Step 6)
5. If offline channel: Hardcode Latest Channel, Latest Sub-Channel, Latest Campaign
6. Set Latest Attribution Completed Date/Time = now

**Example: Demo Request Workflow**

| Step | Action | Value |
|------|--------|-------|
| 1 | Set Latest Lead Source | Demo Request |
| 2 | Clear Latest Lead Source Detail | (empty) |
| 3 | Clear Latest Lead Source Detail 2 | (empty) |
| 4 | Enroll in Workflow | Channel Translator |

**Example: Content Download Workflow**

| Step | Action | Value |
|------|--------|-------|
| 1 | Set Latest Lead Source | Content Download |
| 2 | Set Latest Lead Source Detail | Copy from form field (content name) |
| 3 | Clear Latest Lead Source Detail 2 | (empty) |
| 4 | Enroll in Workflow | Channel Translator |

**Technical Note:** When a field should be intentionally blank (e.g., demo request has no detail level), add explicit "Clear field" steps. This prevents stale data from a previous touchpoint carrying over incorrectly.

#### Step 6: Create the Channel Translator Workflow

Build the centralized workflow that converts UTM values to plain-English channel and sub-channel values. This is the heart of the attribution system.

**What is the Channel Translator?** A single HubSpot workflow that:

- Is only triggered by other workflows (not automatically)
- Takes the utm\_medium and utm\_source values
- Uses if/then branching to match UTM combinations
- Stamps Latest Channel and Latest Sub-Channel with plain English values
- Sets Latest Attribution Completed Date/Time at the end

**Why Centralized?** All lead source workflows call this one workflow. UTM-to-channel mapping logic exists in one place. When you need to add a new UTM mapping, you update one workflow. Consistency across all touchpoints.

**Workflow Structure:**

```
Trigger: Enrollment from another workflow only

Branch 1: If utm_medium = "cpc" AND utm_source = "google"
  -> Set Latest Channel = "Paid Search"
  -> Set Latest Sub-Channel = "Google Ads"

Branch 2: If utm_medium = "cpc" AND utm_source = "bing"
  -> Set Latest Channel = "Paid Search"
  -> Set Latest Sub-Channel = "Bing Ads"

Branch 3: If utm_medium = "paid-social" AND utm_source = "linkedin"
  -> Set Latest Channel = "Paid Social"
  -> Set Latest Sub-Channel = "LinkedIn Ads"

[Continue for all UTM combinations from taxonomy]

Fallback Branch: If utm values don't match any known combination
  -> Set Latest Channel = "Unknown"
  -> Set Latest Sub-Channel = "Unknown"
  -> Add to "Untracked UTM" list for monitoring

Final Step (all branches): Set Latest Attribution Completed Date/Time = now
```

**Technical Note:** Build the Channel Translator directly from the UTM-to-Channel mapping tab in the taxonomy spreadsheet. Every combination in that tab should have a corresponding branch in this workflow.

#### Step 7: Create Non-Evergreen Campaign Workflow Templates

Create cloneable workflow templates for point-in-time campaigns (events, webinars, content syndication).

**What are Non-Evergreen Lead Sources?** Campaigns that happen once: trade shows, specific webinars, sponsored events, content syndication pushes. Each instance needs its own workflow cloned from a template.

**Template Workflow Structure:**

**Trigger:** List membership (leads imported/added to campaign list)

**Actions:**

1. Set Latest Lead Source = [Campaign Type — e.g., "Event - Sponsored Booth"]
2. Set Latest Lead Source Detail = [CLONE: Enter event/campaign name]
3. Set Latest Lead Source Detail 2 = [CLONE: Enter year if applicable]
4. Set Latest Channel = [Hardcoded channel for campaign type]
5. Set Latest Sub-Channel = [Hardcoded sub-channel]
6. Set Latest Campaign = [CLONE: Enter campaign name]
7. Set Latest Attribution Completed Date/Time = now

**Templates to Create:**

| Template Name | Use Case |
|---------------|----------|
| Event Attribution - Sponsored Booth | Trade shows where we sponsor |
| Event Attribution - Hosted Webinar | Our own webinars |
| Event Attribution - Attended Webinar | 3rd party webinars |
| Content Syndication Attribution | 3rd party content distribution |

**Training Requirement:** Document the cloning process and train the client on: when to clone (every new non-evergreen campaign), which fields to customize, how to create the trigger list, and testing process before launch.

#### Step 8: Create Lead Source Grouping Workflow (Optional — Series C+)

Create a workflow that groups lead sources into higher-level categories for executive reporting.

**When to Include:**

- Series C+ companies with 10+ lead sources
- Executives want simplified reporting views
- Multiple similar lead sources need rollup

**Example Grouping Logic:**

| Lead Source | Lead Source Grouping |
|------------|----------------------|
| Demo Request | High Intent Inbound |
| Pricing Request | High Intent Inbound |
| Contact Us | High Intent Inbound |
| Content Download | Content Engagement |
| Blog Subscription | Content Engagement |
| Webinar - Attended | Event Engagement |
| Event - Booth Visit | Event Engagement |

**When to Skip:** Series A/B companies with fewer than 8 lead sources — grouping adds complexity without significant reporting benefit.

#### Step 9: Create First Touch Stamping Workflow

Create the workflow that copies Latest touch fields to Original (First) touch fields when they are blank. First touch is stamped once and never overwritten.

**Workflow Logic:**

**Trigger:**

- Latest Lead Source is known (not empty)
- Latest Attribution Completed Date/Time is known
- Original Lead Source is unknown (empty)

**Actions:** Copy all Latest fields to Original fields:

| Copy From | Copy To |
|-----------|---------|
| Latest Lead Source | Original Lead Source |
| Latest Lead Source Detail | Original Lead Source Detail |
| Latest Lead Source Detail 2 | Original Lead Source Detail 2 |
| Latest Channel | Original Channel |
| Latest Sub-Channel | Original Sub-Channel |
| Latest Campaign | Original Campaign |

**Why This Works:** The trigger condition "Original Lead Source is unknown" ensures this only fires once per contact. First touch is never overwritten because once the Original fields are populated, the trigger no longer matches.

Reference: [Attribution Data Flow Chart](https://lucid.app/lucidchart/a52f1dc2-c12f-49bc-958c-30e3d347702e/view)

#### Step 10: Update MQL Workflow to Stamp MQL Touch Fields

Add attribution stamping to the existing MQL stage workflow. This captures the touchpoint that pushed the lead over the qualification threshold.

**Prerequisite:** The client must have a centralized, single workflow where MQL stage is stamped. If MQL can be set from multiple workflows, consolidate first.

**Updates to Existing MQL Workflow:**

Add these steps after the existing MQL stage stamping:

| Step | Action |
|------|--------|
| 1 | Copy Latest Lead Source to MQL Lead Source |
| 2 | Copy Latest Lead Source Detail to MQL Lead Source Detail |
| 3 | Copy Latest Lead Source Detail 2 to MQL Lead Source Detail 2 |
| 4 | Copy Latest Channel to MQL Channel |
| 5 | Copy Latest Sub-Channel to MQL Sub-Channel |
| 6 | Copy Latest Campaign to MQL Campaign |

**Note on Re-MQL:** If the client allows leads to re-MQL after a cooling-off period, the MQL touch fields will be overwritten on re-qualification. This is expected behavior — only First touch never changes. If the client wants to preserve original MQL touch, create a separate "First MQL Touch" field set that only stamps once.

Reference: [Attribution Data Flow Chart](https://lucid.app/lucidchart/a52f1dc2-c12f-49bc-958c-30e3d347702e/view)

#### Step 11: Create Opportunity Attribution Workflow in Salesforce

Build the automation in Salesforce that stamps opportunities as Inbound or Outbound and copies attribution data from contacts.

**Workflow Logic (Simplified Methodology):**

**Trigger:** Opportunity created

**Process:**

1. Look at all contacts associated with the opportunity (via Contact Roles or Account)
2. Check: Does any contact have an MQL date within 60 days prior to opportunity creation date?
3. If YES: Set Opportunity Attribution Type = "Inbound"
4. If NO: Set Opportunity Attribution Type = "Outbound"
5. If Inbound: Copy MQL touch fields from the contact to the opportunity

**Fields to Copy to Opportunity (if Inbound):**

| Contact Field | Opportunity Field |
|--------------|-------------------|
| MQL Lead Source | Opportunity Lead Source |
| MQL Channel | Opportunity Channel |
| MQL Sub-Channel | Opportunity Sub-Channel |
| MQL Campaign | Opportunity Campaign |

**Implementation Options:**

1. **Salesforce Flow** (Recommended) — native, no additional tools
2. **Process Builder** (Legacy) — still works but being deprecated
3. **HubSpot Workflow** (if HubSpot manages opportunities) — can work if deal pipeline is in HubSpot

Reference: [Attribution Data Flow Chart](https://lucid.app/lucidchart/a52f1dc2-c12f-49bc-958c-30e3d347702e/view)

#### Step 12: Backfill Historical Data (Optional)

Attempt to populate attribution fields for existing records where possible.

**Expectation Setting:**

> "We did our best to backfill what we could, but in reality, this data is only really going to be reliable from launch date forward."

**What Can Be Backfilled:**

- Contacts with existing form submission history (limited)
- Contacts where utm fields were already captured
- Manual tagging of known campaign lists

**What Cannot Be Backfilled:**

- Sessions where cookies were cleared
- Contacts created before UTM fields existed
- Offline touchpoints that were not tracked

**Process:**

1. Export contacts with any existing attribution-like data
2. Map existing fields to new taxonomy where possible
3. Run bulk update or workflow to populate new fields
4. Document gaps and limitations
5. Set clear launch date after which data is reliable

---

### 2d. QA / Test + Sign-Off

> **Purpose:** Verify the build works using data quality monitoring lists and get customer approval.

**QA Approach:** The data quality monitoring lists ARE the QA mechanism. No sandbox needed. If something is broken, it will show up in the lists.

**Data Quality Monitoring Lists to Create:**

| List Name | Criteria | Purpose |
|-----------|----------|---------|
| Attribution Monitoring: Untracked UTM Source | Latest Sub-Channel = "Unknown" AND utm\_source is known | Catches new/wrong UTM sources not in translator |
| Attribution Monitoring: Untracked UTM Medium | Latest Channel = "Unknown" AND utm\_medium is known | Catches new/wrong UTM mediums not in translator |
| Attribution Monitoring: First Touch Blank, Latest Pop | Original Lead Source is empty AND Latest Lead Source is known | Catches first touch workflow failures |
| Attribution Monitoring: UTM Medium/Channel Mismatch | utm\_medium is known AND Latest Channel is empty | Catches translator gaps |
| Attribution Monitoring: UTM Source/SubChannel Mismatch | utm\_source is known AND Latest Sub-Channel is empty | Catches translator gaps |
| Attribution Monitoring: MQL without MQL Lead Source | MQL Date is known AND MQL Lead Source is empty | Catches MQL stamping failures |
| Attribution Monitoring: LS without Attribution Date | Latest Lead Source is known AND Latest Attribution Completed Date is empty | Catches incomplete workflow runs |
| Attribution Monitoring: Invalid Channel Values | Latest Channel not in approved list | Catches manual entry errors |
| Attribution Monitoring: Invalid Sub-Channel Values | Latest Sub-Channel not in approved list | Catches manual entry errors |

**Technical QA Checklist:**

- All lead sources from taxonomy have corresponding workflows
- All UTM combinations from mapping have corresponding Channel Translator branches
- Test form submission captures UTM values correctly
- Test lead source workflow stamps Latest fields correctly
- Test Channel Translator stamps Channel/Sub-Channel correctly
- Test First Touch workflow copies to Original fields
- Test MQL workflow copies to MQL fields
- Test Opportunity workflow stamps Inbound/Outbound correctly
- All picklist values match taxonomy exactly (spelling, capitalization)
- UTM field names use HubSpot convention (utm\_source, not utmSource)
- Hidden fields are actually hidden on all forms
- Field sync between HubSpot and Salesforce is working
- Workflows have proper enrollment triggers and re-enrollment settings
- All data quality monitoring lists created and showing 0 or near-0 members

**Customer Testing:**

- Walk customer through the build
- Show sample contacts with attribution data populated
- Demonstrate data flow from form submission to attribution fields
- Have them test real scenarios
- Capture feedback, fix issues

**Engineering sign-off checkpoint:**

- Built system matches tech spec
- All technical tests passing (data quality lists at 0 or near-0)
- Customer has tested and approved
- Ready for enablement

**Decision point:**

- **Proceed to Enablement** → System is built and verified
- **Loop back to Build** → Issues found in data quality lists, needs fixes

---

## Phase 3: Enablement

> **Goal:** Customer team can actually use the attribution system and interpret the data for decision-making.
>
> **Output:** Trained team with documentation, stabilized system, no critical issues.

### Sub-Phases

```
3a Training Prep → 3b Training Sessions → 3c Hypercare → 3d Enablement Sign-Off
```

---

### 3a. Training Prep

> **Purpose:** Create training materials from the strategic and technical documentation.

**Input:** Strategic package + tech specs + built system

**What happens:**

1. Architect creates training agendas tailored to each stakeholder role
2. Architect prepares video walkthrough scripts for each training recording
3. Architect compiles documentation package

**Output:** Training package containing:

- Video walkthrough scripts for dashboard walkthrough, data quality monitoring, channel translator maintenance, campaign workflow cloning
- Written guides: field mapping reference, maintenance playbook
- FAQ draft based on common questions from similar projects (e.g., "Why does my attribution not sum to 100%?", "What happens when someone re-MQLs?", "Why are so many leads showing as Direct?")

**Documentation Package to Compile:**

| Document | Contents |
|----------|----------|
| Lead Sources & Channels Template | Completed taxonomy with all mappings |
| UTM Builder | Client-specific UTM builder for campaign tagging |
| Field Documentation | List of all attribution fields with descriptions |
| Workflow Documentation | Links to all attribution workflows with descriptions |
| Data Quality List Documentation | List names, criteria, and monitoring process |
| Dashboard Documentation | Report descriptions and how to use them |
| Maintenance Playbook | Step-by-step for common maintenance tasks |

**Maintenance Playbook Contents:**

1. How to monitor data quality lists
2. How to add a new UTM source/medium to the Channel Translator
3. How to clone workflows for new non-evergreen campaigns
4. How to add a new lead source to the taxonomy
5. Troubleshooting common issues

---

### 3b. Training Sessions

> **Purpose:** Transfer knowledge to customer team by stakeholder role.

**Marketing Leadership Training (30-45 min):**

| Topic | Duration | Content |
|-------|----------|---------|
| Attribution Methodology Review | 5 min | Recap first vs MQL vs latest touch |
| Dashboard Walkthrough | 15 min | Each report, what it shows, how to filter |
| Interpreting Channel Performance | 10 min | High intent vs low intent channels, expected conversion rates |
| Creating Custom Reports | 10 min | Which fields to use, common filters |
| Q&A | 5 min | Address specific questions |

**Key Teaching Points:**

1. **First Touch vs MQL Touch** — First touch shows awareness sources; MQL touch shows conversion drivers. Both matter for different decisions.
2. **High Intent vs Low Intent Channels** — Paid search often has higher conversion but lower volume. Organic content has lower conversion but builds pipeline over time.
3. **Don't Compare Apples to Oranges** — A 5% conversion rate from organic content is good. A 5% conversion rate from demo requests is bad. Context matters.
4. **Use for Trends, Not Absolutes** — Look at directional changes over time, not single-month snapshots.

**Technical Handoff Training (if client taking over maintenance):**

Multiple sessions recommended:

| Session | Topic | Duration | Key Content |
|---------|-------|----------|------------|
| 1 | Workflow architecture and data flow | 60 min | How lead source workflows call channel translator |
| 2 | Channel translator maintenance | 30 min | How to add new UTM mappings |
| 3 | Data quality monitoring process | 30 min | How to interpret and fix issues on monitoring lists |
| 4 | Non-evergreen campaign workflow cloning | 30 min | Step-by-step for creating new campaign workflows |

**Training Topics Covered Across Sessions:**

| Topic | Key Content |
|-------|------------|
| Workflow Architecture | How lead source workflows call channel translator |
| Channel Translator Updates | How to add new UTM mappings |
| Data Quality Monitoring | How to interpret and fix issues on monitoring lists |
| Campaign Workflow Cloning | Step-by-step for creating new non-evergreen workflows |
| Field Dependencies | Which fields depend on which workflows |
| Troubleshooting | Common issues and how to diagnose |

**Sales Leadership Training (Optional — 15-20 min):**

- What attribution data exists and where to find it on contact/opportunity records
- What the inbound/outbound opportunity stamp means and its limitations (target-setting, not precise credit)

**Demand Gen / Ad Agency Training (20-30 min):**

- The exact UTM values they must use for each channel and platform
- Consequences of UTM changes (data gets bucketed as unknown, attribution chain breaks)
- How to use the UTM Builder template to generate correctly formatted URLs

**Reality Check:**

> "Unless they have really high-quality technical marketing operations talent in-house, odds are they're going to struggle to maintain the system." Set expectations accordingly and recommend ongoing LeanScale support if appropriate.

**Create Video Recordings:** Record each training session for future reference. Client team members change — recorded training provides continuity.

---

### 3c. Hypercare

> **Purpose:** Intensive post-launch support to stabilize the attribution system and catch issues early.

**Duration:** 4 weeks

**What happens:**

- Weekly 30-minute office hours slot — anyone can hop on and share what is not working
- Daily monitoring of data quality lists during first week, then weekly
- Bug triage and fixes as issues surface
- Retroactive backfill monitoring (if applicable)
- UTM compliance monitoring — catching agency deviations early

**Common issues during hypercare:**

- New UTM values from ad agency not yet in Channel Translator
- Forms missing hidden UTM fields (discovered when new forms are created)
- MQL workflow not triggering attribution stamping for edge-case MQL paths
- Sync delays between HubSpot and Salesforce

**When hypercare ends:** Data quality lists consistently at 0 or near-0 members, no critical issues for 2+ consecutive weeks, customer team demonstrating self-sufficiency on monitoring.

---

### 3d. Enablement Sign-Off

> **Purpose:** Confirm customer can operate the attribution system independently.

**Validation checkpoint:**

- Marketing leadership training delivered — they can interpret dashboards
- Technical handoff training delivered (if applicable) — they can maintain workflows
- Demand gen / ad agency trained on UTM requirements
- All video recordings created and shared
- Documentation package delivered and accessible
- Hypercare period complete (4 weeks)
- No critical issues outstanding
- Data quality lists at 0 or near-0 members consistently
- Customer team can monitor data quality lists independently
- Ready for handoff

**Decision point:**

- **Proceed to Handoff** → Customer is enabled, system is stable
- **Extend Hypercare** → Still unstable, data quality issues persisting, needs more support time

---

## Phase 4: Handoff

> **Goal:** Clean project close with maintenance plan established and retention/expansion path set.
>
> **Output:** Maintenance schedule documented, internal context transferred, customer owns the system, project archived, future revenue path established.

**Structure:**

```
4a Maintenance Schedule → 4b Internal Handoff → 4c External Handoff → 4d Project Close
```

**Maintenance ownership by engagement type:**

| Engagement Type | Who Owns Maintenance | Handed Off At |
|-----------------|-------------------|---------------|
| **Single Project** | Customer owns | 4c (External Handoff) — customer receives maintenance schedule and runs it themselves |
| **Dedicated (Multi-Project)** | Architect owns | 4b (Internal Handoff) — Architect receives maintenance schedule and runs it for customer |

---

### 4a. Maintenance Schedule

> **Purpose:** Document what needs ongoing attention after the project is complete. Attribution is NOT a "set it and forget it" project. Fair to assume 5-10 hours per month for maintenance.

#### Daily/Weekly Tasks

_Minimum weekly monitoring required. High-performing teams monitor daily._

| Task | What to Check | Red Flag Threshold |
|------|---------------|-------------------|
| Review data quality monitoring lists | Member counts on all 9+ QA lists — 0 = good, >0 = investigate | Any list with >0 members |
| Communicate UTM errors to ad agency | When lists reveal incorrect/new UTM values, contact agency immediately | Repeated errors from same agency |
| Clone workflows for new campaigns | When marketing launches new events/webinars, clone template workflow | Campaign goes live without workflow |

**Lists to check daily/weekly:**

- UTM Misalignment lists (medium and source)
- First Touch Blank but Latest Touch Populated
- Untracked UTM Source / UTM Medium
- Invalid Lead Source Detail values
- Invalid Sub-Channel values
- MQL Leads without MQL Lead Source

#### Monthly Tasks

| Monthly Task | What to Check | Red Flag Threshold |
|--------------|---------------|-------------------|
| Aggregate data quality review | Compile monthly summary: % leads with complete attribution, most common gaps, UTM compliance | Attribution completeness dropping below 85% |
| UTM compliance audit | Verify all active campaigns use agreed UTM parameters across ad platforms, email, partner links | >5% of campaigns with non-compliant UTMs |
| Channel Translator review | Check if new UTM values need to be added to the Channel Translator workflow | New values appearing in "Unknown" bucket |

#### Quarterly Tasks

| Quarterly Task | What to Review | Action if Off-Track |
|----------------|----------------|-------------------|
| Attribution model validation | Review attribution data against known outcomes — are channels aligning with expectations? | Investigate workflow failures, data anomalies |
| Dashboard and reporting review | Meet with marketing leadership — which reports are used, what questions remain? | Add/modify reports based on feedback |
| Taxonomy review | Review lead sources and channels with stakeholders — any sources retired or needed? | Update taxonomy, workflows, picklists |

#### After First Sales Cycle (30-90 Days Post-Launch)

_First major validation checkpoint. This is when you verify the project is working as intended._

- **Full funnel attribution audit:** Trace a sample of closed-won opportunities back through MQL-touch and first-touch data. Verify the attribution chain is complete and accurate.
- **Compare attribution data to reality:** Ask marketing leadership: "Does this data match what you know to be true about your pipeline sources?" Significant disconnects indicate workflow or data quality issues.
- **Backfill quality assessment:** If historical data was backfilled, assess quality. Communicate: "Data is only reliably accurate from [launch date] forward."

_Key validation questions:_

- Is inbound vs outbound opportunity stamping matching sales team's expectations?
- Are high-volume channels (paid search, organic) showing expected lead volume?
- Are offline channels (events, webinars) being properly attributed?
- What percentage of leads have complete first-touch attribution?

#### Refinement Triggers (When to Re-Engage)

| Trigger | Threshold | Response |
|---------|-----------|----------|
| Unknown/Direct channel percentage | >25% of attributed leads | Audit Channel Translator gaps, check cookie tracking |
| Data quality list membership | >10 members consistently | Investigate root cause, fix workflows |
| New marketing channels launched | Any new channel not in system | Add to taxonomy, create workflows, update translator |
| Agency change or UTM convention change | Any change | Re-align, update Channel Translator |
| Major business change (new product, market) | Structural change | Full taxonomy review, possible re-build |

#### Every 6-12 Months

- **Full attribution system audit:** Review all workflows, field mappings, and automation logic. Check for deprecated fields, broken workflow triggers, sync failures between MAP and CRM, orphaned workflows for discontinued campaigns.
- **Strategic alignment review:** Has the business changed significantly? New products, new markets, new channels? Attribution taxonomy may need updating to reflect business evolution.
- **Maintenance handoff assessment:** If LeanScale is maintaining, review whether client has developed internal capability to take over. If client is maintaining, assess whether they need additional training or support.
- **Inbound/outbound methodology review:** Should the methodology be revisited based on what has been learned? Does the lookback window need adjustment?

---

### 4b. Internal Handoff

> **Purpose:** Transfer context so the Architect can manage the ongoing relationship.

**What the Architect needs to know:**

- What was built: summary of attribution model, taxonomy, methodology choices
- Customer context: key stakeholders, their technical sophistication, common questions
- Common issues: most frequent data quality problems and how to resolve them
- When to escalate: what requires escalation vs what the Architect can handle

**Escalation guidelines:**

| Issue Type | Who Handles | Examples |
|-----------|------------|----------|
| Small tweaks, minor questions | Architect | New user training, dashboard filter changes, report adjustments |
| Significant changes, complex issues | Escalation required | Attribution logic changes, new channel integration, Channel Translator restructuring, methodology changes |

**For Dedicated engagements:** Architect also receives the maintenance schedule (4a) and becomes responsible for executing it. The implementation team walks the Architect through each maintenance task — data quality list monitoring, UTM compliance audits, quarterly reviews.

---

### 4c. External Handoff (LeanScale → Customer)

> **Purpose:** Formal project completion with customer.

**Final Project Meeting Agenda:**

| Topic | Duration | Content |
|-------|----------|---------|
| Show Results Live | 15 min | Walk through attribution dashboard, show sample contacts with data populated, demonstrate form-to-field data flow |
| Review Methodology | 5 min | Recap first/MQL/latest touch, confirm inbound/outbound methodology |
| Data Quality Monitoring Demo | 10 min | Show monitoring lists, walk through investigation process, demonstrate adding new UTM to translator |
| Dashboard Usage Training | 10 min | How to interpret each report, create custom reports, which fields to use |
| Maintenance Schedule Review | 5 min | Walk through daily/weekly/monthly/quarterly cadences, who owns what |
| Q&A | 5 min | Open questions, document follow-up items |

**Documentation package delivered:**

- All training video recordings
- Completed Lead Sources & Channels taxonomy spreadsheet
- UTM Builder template (customized for client)
- Field documentation (all attribution fields with descriptions)
- Workflow documentation (links to all workflows with descriptions)
- Data quality monitoring list inventory and process
- Dashboard documentation (report descriptions)
- Maintenance playbook (step-by-step for common tasks)
- UTM-to-Channel mapping documentation

**For Single Project engagements:** Walk the customer through the maintenance schedule in detail. Record a video walkthrough of the process. Make sure they understand what to check, how often, and when to call us back. Set clear expectation: 5-10 hours/month.

**Output:** Customer owns the attribution system. Project formally complete.

---

### 4d. Project Close

> **Purpose:** Clean internal wrap-up + establish retention/expansion path.

#### Archive Checklist

- All project artifacts saved to proper location
- Handoff documentation complete
- Project status updated in tracking system
- Time/billing finalized

#### Internal Debrief (Optional but Recommended)

- What went well?
- What would we do differently?
- Any learnings to feed back into SOPs?
- Was the approach (Full vs Core) appropriate for this customer?

#### Retention / Expansion

**Two paths based on engagement type:**

| Engagement Type | Path |
|-----------------|------|
| **Single Project** | Upsell → Downsell → Retry |
| **Multi-Project (Dedicated)** | Schedule Refinement Check-In |

**Single Project Path:**

```
1. Upsell: Managed Services (5-10 hrs/month attribution maintenance retainer)
   ↓ if no
2. Downsell: Another one-time project (lead scoring, lead lifecycle, CRM cleanup)
   ↓ if yes
3. Retry retainer at end of next project cycle
```

**Script:**

> "Now that attribution is complete, there are two ways we can continue working together. Option 1: We can set you up on managed services where we handle the ongoing data quality monitoring, UTM compliance, and system maintenance — that's typically 5-10 hours per month. Option 2: If there's another specific project you need help with, we can scope that out. Which sounds more interesting?"

**Multi-Project (Dedicated) Path:**

Schedule a refinement check-in at handoff — typically ~90 days post-launch (after one full sales cycle):

> "On [date ~90 days out], we'll review how attribution is performing — are the channels matching reality, is the data quality stable, and does anything need adjustment."

**Internal prep (2 weeks before check-in):**

| Step | What Happens |
|------|--------------|
| 1. Get pinged | System reminder: refinement check-in in 2 weeks |
| 2. Review metrics | Pull data quality list trends, check dashboard usage, review attribution completeness |
| 3. Decide ownership | Can the Architect handle this check-in, or is escalation needed? |
| 4. Prep materials | If escalation needed, brief them. If Architect, prep talking points. |

**At the refinement check-in:**

- Review attribution data quality against launch baseline
- Check inbound/outbound stamping accuracy against sales team expectations
- Identify any taxonomy updates needed (new channels, retired sources)
- If minor: Architect handles tweaks
- If major: Scope refinement project (restart the assembly line)

**Output:** Project archived. Future revenue path established. Ready for next engagement.

---

## Deliverables & Assets Summary

**Strategic Deliverables:**

- Completed Lead Sources & Channels taxonomy spreadsheet (lead sources, channels, sub-channels, UTM mapping)
- UTM Builder template (customized for client)
- Inbound/outbound methodology documentation with lookback window
- Definition Alignment Document (final version)

**Technical Deliverables:**

- All attribution fields in HubSpot (Contact object) — First Touch, MQL Touch, Latest Touch field sets
- All attribution fields in Salesforce (Contact, Lead, Opportunity objects) with HubSpot sync configured
- Hidden UTM fields on all HubSpot forms
- Lead source workflows for all evergreen touchpoints
- Channel Translator workflow (centralized UTM-to-channel mapping)
- Cloneable workflow templates for non-evergreen campaigns
- First Touch stamping workflow
- MQL Touch stamping (added to existing MQL workflow)
- Opportunity attribution automation in Salesforce (inbound/outbound)
- Lead source grouping workflow (if Full Build)
- First-party cookie tracking (if Full Build, implemented by client's web dev team)
- Data quality monitoring lists (9+ lists)
- Attribution dashboard in Salesforce with core reports

**Documentation Package:**

- Training video recordings (dashboard walkthrough, data quality monitoring, channel translator maintenance, campaign workflow cloning)
- Written guides: field mapping reference, workflow inventory
- Maintenance playbook (data quality monitoring, UTM updates, campaign cloning, troubleshooting)
- FAQ document

---

## Appendix

### What This Document Is

This is the implementation playbook — the step-by-step execution guide an Architect follows to deliver an attribution project from first contact to project close. It is the third file in a 3-file playbook structure: Overview (what the project IS), Methodology (HOW we think about the problem), and Implementation (WHAT to DO).

### What Each Phase Produces

| Phase | Output | Gate Criteria |
|-------|--------|---------------|
| **Phase 1: Strategy** | Signed-off strategic package (Definition Alignment Doc + deliverables) | Customer stakeholders have approved definitions and strategic asset |
| **Phase 2: Engineering** | Built and tested system | System matches tech spec, all tests pass, customer has approved |
| **Phase 3: Enablement** | Trained team with documentation | All training delivered, hypercare complete, team can operate independently |
| **Phase 4: Handoff** | Independent customer + archived project | Internal/external handoffs complete, maintenance plan in place, project closed |

### How to Adapt Per Project Type

Not every project weighs each phase equally. Before filling this template, determine your project's profile:

| Project Profile | Strategy Weight | Engineering Weight | Enablement Weight | Example Projects |
|-----------------|-----------------|-------------------|-------------------|------------------|
| **Strategic-heavy** | 60-80% | 10-20% | 10-20% | Growth Model, GTM Strategy |
| **Engineering-heavy** | 10-20% | 60-80% | 10-20% | CRM Migration, Data Pipeline |
| **Enablement-heavy** | 20-30% | 20-30% | 40-50% | Quote-to-Cash, Process Rollout |
| **Balanced** | 30-40% | 30-40% | 20-30% | Attribution, Lead Scoring |

**Adaptation rules:**

- **Light phases** can compress sub-phases (e.g., a strategic-only project may skip Phase 2 entirely)
- **Heavy phases** expand with more sub-steps, more meetings, more detail
- **Phase 4 always applies** — every project needs handoff, but the maintenance schedule complexity varies
- Mark phases as [SKIP] or [LIGHT] in the One-Pager if they don't fully apply