# Automated Inbound Data Enrichment - Playbook

## 1. Definition

**What it is**: A technical implementation project that deploys automated systems to enrich incoming lead data with firmographic, technographic, and contact information in real-time as leads enter the CRM. The deliverable is a working enrichment pipeline that enhances lead quality, enables smarter routing/scoring, and supports personalized outreach.

**What it is NOT**: Not a data cleansing/deduplication project (that focuses on fixing existing bad data). Not a lead scoring model build (that uses enriched data but is separate scope). Not a market mapping/ICP exercise (that defines target criteria). Not a lead routing implementation (that uses enriched data for assignment logic).

## 2. ICP Value Proposition

**Pain it solves**: Marketing and sales teams receive inbound leads with minimal information (name, email, company) forcing SDRs to spend 10-15 minutes manually researching each lead before outreach. This delays speed-to-lead, creates inconsistent data quality, and wastes selling time on research.

**Outcome delivered**: Every inbound lead is automatically enriched with 15-25 data points (company size, industry, tech stack, job title, direct dial, funding, etc.) within seconds of form submission. SDRs can immediately prioritize and personalize outreach. Lead scoring and routing operate on complete data.

**Who owns it**: VP of Marketing Operations or RevOps Leader (with input from Demand Gen and Sales Development leadership).

## 3. Implementation Procedure

### Part 1: Assess Current State & Define Requirements

#### Step 1: Audit Current Lead Data Quality

**Step Overview:** Analyze the current state of inbound lead data to identify gaps between what's captured vs. what's needed for routing, scoring, and outreach. End state: Gap analysis document showing which data points are missing and their business impact.

- Export last 90 days of inbound leads from CRM (MQLs, form submissions)
- Analyze field completion rates for key attributes (company size, industry, title, phone)
- Compare captured data against ICP criteria and scoring model inputs
- Interview 2-3 SDRs on manual research time per lead and biggest data gaps
- Document which missing fields block routing/scoring decisions
- Quantify the gap (e.g., "Only 30% of leads have company size, 15% have direct dial")

#### Step 2: Define Enrichment Requirements

**Step Overview:** Specify exactly which data points to enrich based on lead routing rules, scoring model inputs, and personalization needs. End state: Prioritized list of enrichment fields with business justification for each.

- Map current lead scoring model inputs to identify required firmographic/technographic fields
- Map lead routing rules to identify fields needed for assignment logic
- Identify fields SDRs need for personalization (tech stack, recent news, funding)
- Prioritize fields into tiers: Tier 1 (blocks decisions), Tier 2 (improves quality), Tier 3 (nice-to-have)
- Document expected enrichment rates per field (not all fields available for all leads)
- Get stakeholder sign-off on enrichment field requirements

---

### Part 2: Select Enrichment Tool & Design Workflow

#### Step 1: Evaluate and Select Enrichment Provider

**Step Overview:** Compare enrichment tool options against client's requirements, tech stack compatibility, and budget. End state: Tool selected with procurement approved and account created.

- Document client's CRM (Salesforce/HubSpot) and MAP (Marketo/Pardot/HubSpot)
- Evaluate providers: Clay (waterfall enrichment), ZoomInfo, Clearbit, Apollo, Cognism, Lusha
- Compare on: data coverage for client's ICP segments, CRM native integration, API capabilities
- Compare on: pricing model (per-enrichment vs. seat-based), match rates, data freshness
- Request trial accounts and test enrichment on 50-100 sample leads
- Present recommendation with match rate results and pricing to client
- Get budget approval and complete procurement

#### Step 2: Design Enrichment Workflow Architecture

**Step Overview:** Map out the end-to-end flow of how leads will be enriched, including triggers, timing, and data flow. End state: Workflow diagram showing trigger → enrichment → CRM update flow.

- Define trigger events (new lead creation, form submission, lead update)
- Determine enrichment timing (real-time sync vs. near-real-time batch)
- Map data flow: Form → CRM → Enrichment Tool → CRM (or Form → Enrichment → CRM)
- Identify whether to use native CRM integration, API, or middleware (Zapier/Workato/Tray)
- Document retry logic for failed enrichments
- Design handling for leads that don't match (confidence thresholds, fallback logic)

#### Step 3: Establish Data Governance Rules

**Step Overview:** Define rules for how enriched data overwrites or preserves existing CRM data to prevent conflicts and maintain data integrity. End state: Documented governance rules for enrichment field mapping.

- Define overwrite logic per field (always overwrite, never overwrite, overwrite if blank)
- Establish source hierarchy when enrichment conflicts with existing data
- Identify protected fields that should never be auto-updated (e.g., manually verified titles)
- Set minimum confidence score thresholds for accepting enriched data
- Document update frequency (enrich once vs. re-enrich on trigger)
- Create exception handling rules for low-confidence matches

---

### Part 3: Configure Integration & Field Mapping

#### Step 1: Set Up Enrichment Tool Account and CRM Connection

**Step Overview:** Create the enrichment tool account and establish the connection to CRM with proper API permissions. End state: Tool connected to CRM, authenticated, and ready for configuration.

- Create enrichment tool account with appropriate user seats/credits
- Connect to Salesforce/HubSpot via OAuth or API key
- Grant required API permissions (read/write leads, contacts, accounts)
- Verify connection status in enrichment tool dashboard
- Test basic connectivity with single record enrichment
- Document credentials and admin access for client handoff

#### Step 2: Configure Field Mapping

**Step Overview:** Map enrichment provider fields to CRM lead/contact fields, handling data type conversions and picklist values. End state: All enrichment fields mapped to corresponding CRM fields with correct formatting.

- Create custom fields in CRM for any new enrichment data points
- Map enrichment fields to CRM fields (e.g., ZoomInfo Company Size → Lead.Company_Size__c)
- Configure picklist value mappings (e.g., "1-50" → "SMB", "51-200" → "Mid-Market")
- Set up field normalization rules (title standardization, industry categorization)
- Configure multi-value field handling (tech stack as multi-select or text)
- Document complete field mapping table

#### Step 3: Build Enrichment Automation Workflow

**Step Overview:** Configure the automation that triggers enrichment and updates CRM records. End state: Working automation that enriches new leads upon creation.

- Create automation trigger on lead creation (or specified form submissions)
- Configure enrichment API call with required parameters
- Build field update actions based on mapping configuration
- Add conditional logic for overwrite rules and confidence thresholds
- Configure error handling and retry logic
- Set up notifications for enrichment failures or low match rates

---

### Part 4: Test, Validate & Rollout

#### Step 1: Test Enrichment Workflow

**Step Overview:** Validate the enrichment pipeline with test leads across various scenarios. End state: Confirmed working enrichment with documented match rates and processing times.

- Create 10-15 test leads representing different ICP segments
- Submit test leads through each form type that should trigger enrichment
- Verify enrichment fires within expected timeframe (real-time vs. batch)
- Validate field mapping accuracy in CRM records
- Test edge cases: leads with minimal info, international leads, personal email domains
- Document match rates, processing time, and any failed enrichments
- Test overwrite logic with leads that have existing data

#### Step 2: Validate Data Quality and Accuracy

**Step Overview:** Spot-check enriched data accuracy against known good sources. End state: Confidence in data accuracy with documented error rates.

- Sample 20-30 enriched leads and manually verify key fields
- Cross-reference enriched data against LinkedIn, company websites
- Calculate accuracy rate per field (target: >85% for core fields)
- Identify systematic errors (wrong company match, outdated titles)
- Adjust confidence thresholds or matching rules if needed
- Document validation results and any known limitations

#### Step 3: Enable for Production and Train Team

**Step Overview:** Roll out enrichment to production lead flow and enable sales/marketing teams. End state: Live enrichment processing all inbound leads with team trained on using enriched data.

- Switch enrichment to production mode (all new leads)
- Update lead scoring model to use enriched fields (if applicable)
- Update lead routing rules to use enriched fields (if applicable)
- Create quick-reference doc showing new fields and where to find them
- Train SDR team on enriched fields available and how to use in outreach
- Train marketing ops on monitoring enrichment health

#### Step 4: Hand Off and Establish Monitoring

**Step Overview:** Transfer ownership to client with documentation and monitoring dashboards. End state: Client self-sufficient with enrichment running and monitored.

- Transfer admin credentials to client RevOps team
- Deliver documentation package (field mapping, governance rules, troubleshooting)
- Build enrichment monitoring dashboard (match rates, credit usage, error rates)
- Set up alerts for enrichment failures or match rate drops
- Schedule 30-day check-in to review performance
- Close out project

---

## 4. Dependencies & Inputs

**What must exist before starting:**
- CRM (Salesforce or HubSpot) with admin access
- Defined ICP criteria and lead scoring model (even if basic)
- Lead routing rules documented (to understand what fields drive routing)
- Budget approved for enrichment tool subscription
- Inbound lead forms operational and generating leads

**What client must provide:**
- CRM admin access and sandbox environment for testing
- Export of recent inbound leads for gap analysis
- Documentation of current scoring model and routing rules
- List of stakeholders for requirements gathering
- Decision-maker for tool selection approval
- Budget range for enrichment tool

## 5. Common Pitfalls

- **Enriching without fixing existing data quality**: Adding enrichment on top of duplicate or corrupted data amplifies problems. → **Mitigation**: Recommend basic deduplication before enrichment implementation or scope dedup as Phase 0.

- **"Set and forget" mentality**: Teams configure enrichment and never monitor it, missing when match rates drop or credits run out. → **Mitigation**: Build monitoring dashboard and alerts as part of implementation, not afterthought.

- **Over-enriching with too many fields**: Requesting every possible field bloats the CRM and confuses users. → **Mitigation**: Start with 10-15 high-impact fields that drive decisions, expand later based on usage.

- **No overwrite governance**: Enriched data overwrites manually-verified data, frustrating reps who lose their research. → **Mitigation**: Document and configure overwrite rules before go-live, protect key manual fields.

- **Poor team adoption**: Reps don't trust enriched data and continue manual research. → **Mitigation**: Validate accuracy during testing, share results with team, show time savings in training.

## 6. Success Metrics

- **Leading Indicator**: Enrichment match rate >75% on new leads within first week of go-live; SDRs report reduced research time per lead
- **Lagging Indicator**: Speed-to-lead improves by 50%+ within 30 days; lead scoring model accuracy improves (higher correlation between score and conversion)

---

