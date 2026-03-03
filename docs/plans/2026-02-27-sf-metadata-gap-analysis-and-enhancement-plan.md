# Salesforce Metadata Download & Signal Enhancement Plan

**Date:** 2026-02-27
**Context:** Analysis of Scandit Salesforce org (00D20000000ndOpEAI) revealed significant signal gaps between what our diagnostic questions ask and what our metadata downloader + signal extractor currently capture.

## Executive Summary

Our diagnostic has **38 questions across Processes (22) and Reporting (16)** sections. Many answers require CRM signals that exist in the org but are either:

1. **Not downloaded** - queries we don't run
2. **Downloaded but not extracted** - data we fetch but don't parse into signals
3. **Extracted but too shallow** - signals that detect field existence but miss picklist values, record counts, or usage patterns

The API downloader (`salesforce-downloader.js`) already fetches 27 data types. We need to add **~12 new queries** and enhance signal extraction for **~20 new signals**.

---

## Part 1: Queries Run During Scandit Analysis

These are the exact queries (translated to SOQL for the API downloader) that produced answers for the 38 diagnostic questions.

### Already in the downloader (working correctly)

| # | Query | Downloader Location | What It Feeds |
|---|-------|-------------------|---------------|
| 1 | `sobjects/{Object}/describe` for Lead, Contact, Account, Opportunity, Case, Campaign | `downloadObjectDescribes()` | Field counts, enrichment detection, methodology fields, renewal tracking, health scoring |
| 2 | `SELECT MasterLabel, DefaultProbability, IsClosed, IsWon FROM OpportunityStage` | `downloadStages()` | Pipeline design (PR-2) |
| 3 | `SELECT Id, Name, IsActive, Profile.Name, UserRole.Name FROM User WHERE IsActive = true` | `downloadUsers()` | Team structure (F5) |
| 4 | Active Flows | `downloadTooling()` | Automation classification |
| 5 | Active ValidationRules | `downloadTooling()` | Stage-gated validation detection |
| 6 | Dashboards (LIMIT 200) | `downloadSOQL()` | RP-1, RP-2, RP-3 dashboard counts |
| 7 | Reports (LIMIT 200) | `downloadSOQL()` | RP-4 reporting cadence |
| 8 | Campaigns (active, LIMIT 200) | `downloadSOQL()` | PR-9 attribution, PR-8 ABM |
| 9 | InstalledSubscriberPackage | `downloadToolingSafe()` | Tool detection (Marketo, ZoomInfo, Highspot, etc.) |
| 10 | ForecastingType (active) | `downloadSOQLSafe()` | RP-6 forecasting methodology |
| 11 | DuplicateRule (active) | `downloadToolingSafe()` | Data quality signal |
| 12 | CampaignMember COUNT | `downloadSOQLSafe()` | Attribution depth |

### NEW queries needed (not in downloader)

| # | SOQL Query | Purpose | Questions Answered | Priority |
|---|-----------|---------|-------------------|----------|
| N1 | `SELECT COUNT() FROM ForecastingItem` | Forecasting usage depth (0 = configured but unused, 46K = heavy) | RP-6: Forecasting methodology, D3: Growth model | HIGH |
| N2 | `SELECT COUNT() FROM OpportunityLineItem` | Product catalog usage | D8: New + expansion bookings reportability | HIGH |
| N3 | `SELECT COUNT() FROM Product2 WHERE IsActive = true` | Active product count | D8: Bookings breakdown | MEDIUM |
| N4 | `SELECT COUNT() FROM Contract` | Contract object usage | D7: Revenue churn, D12/D13: GDR/NDR | HIGH |
| N5 | `SELECT COUNT() FROM OpportunityFieldHistory WHERE Field = 'StageName'` | Stage history tracking enabled | D16: Average sales cycle time | MEDIUM |
| N6 | `SELECT Type, COUNT(Id) cnt, SUM(Amount) total FROM Opportunity WHERE IsClosed = true AND IsWon = true AND CloseDate >= LAST_N_DAYS:365 GROUP BY Type` | Won opp breakdown by type | D8: New + expansion bookings | HIGH |
| N7 | `SELECT COUNT() FROM Lead WHERE IsConverted = true AND ConvertedDate >= LAST_N_DAYS:365` | Lead conversion volume | D14: MQL-to-opp conversion rate | HIGH |
| N8 | `SELECT LeadSource, COUNT(Id) cnt FROM Lead WHERE IsConverted = true AND ConvertedDate >= LAST_N_DAYS:365 GROUP BY LeadSource` | Conversion by source | D10: MQLs by source | MEDIUM |
| N9 | `SELECT COUNT() FROM Dashboard` | **Total dashboard count** (current query is LIMIT 200) | D1: Dashboard count (825 in Scandit, we'd only see 200) | HIGH |
| N10 | `SELECT COUNT() FROM Report` | **Total report count** (current query is LIMIT 200) | Reporting maturity | HIGH |
| N11 | `SELECT COUNT() FROM Order` | Order object usage | Subscription management maturity | LOW |
| N12 | `SELECT Id, Name, IsActive, Profile.Name, UserRole.Name, LastLoginDate FROM User WHERE IsActive = true` | **Add LastLoginDate** to existing user query | C21: ICs use CRM daily | HIGH |

### Existing queries that need enhancement

| # | Current Query | Enhancement | Why |
|---|--------------|-------------|-----|
| E1 | `SELECT Id, Title, FolderName FROM Dashboard LIMIT 200` | Change to: `SELECT COUNT() FROM Dashboard` (separate count query) + keep detail query for folder analysis | Scandit has 825 dashboards; LIMIT 200 understates |
| E2 | `SELECT Id, Name, FolderName FROM Report LIMIT 200` | Same: add COUNT() query + keep detail | Scandit has 20,034 reports; LIMIT 200 massively understates |
| E3 | User query | Add `LastLoginDate` field | Need login recency for IC usage signal |

---

## Part 2: New Signals to Extract

### Signal Extractor Changes (`signal-extractor-sf.js` + `signal-extractor-v3.js`)

#### A. New signals from new queries

| Signal Name | Type | Source Query | Grader | Description |
|------------|------|-------------|--------|-------------|
| `forecasting_item_count` | number | N1 | RP-6 | Number of ForecastingItem records (usage depth) |
| `has_product_catalog` | boolean | N2 | RP-5 | OpportunityLineItem count > 0 |
| `product_line_item_count` | number | N2 | RP-5 | Raw count |
| `active_product_count` | number | N3 | RP-5 | Active Product2 records |
| `contract_count` | number | N4 | PR-3 | Contract records (renewal tracking strength) |
| `has_stage_history` | boolean | N5 | RP-5 | OpportunityFieldHistory for StageName exists |
| `stage_history_count` | number | N5 | RP-5 | Count of stage change records |
| `won_opp_by_type` | object | N6 | RP-5 | `{ "New Business": { count, amount }, "Existing Business": { count, amount }, ... }` |
| `has_bookings_split` | boolean | N6 | RP-5 | More than 1 Opp Type in won opps |
| `lead_conversion_count_365d` | number | N7 | RP-5 | Converted leads in last year |
| `lead_conversion_by_source` | object | N8 | RP-5 | `{ "Marketing Generated": 100, "Sales Generated": 50, ... }` |
| `total_dashboard_count` | number | N9 | RP-1 | True total (not LIMIT 200) |
| `total_report_count` | number | N10 | RP-1, RP-4 | True total |
| `user_login_recency` | object | N12/E3 | RP-3 | `{ active_last_30d: N, active_last_90d: N, never_logged_in: N }` |
| `ic_daily_usage_rate` | number | N12/E3 | RP-3 | % of non-admin users logged in within 7 days |

#### B. New signals from existing data (already downloaded, just need extraction)

| Signal Name | Type | Source | Grader | Description |
|------------|------|--------|--------|-------------|
| `opp_validation_rule_count` | number | validationRules (filter EntityDefinition = Opportunity) | PR-6 | Count of validation rules specifically on Opportunity |
| `has_closed_lost_reason_required` | boolean | validationRules (name contains 'Closed_lost' or 'stage_Closed') | PR-2, R4 | Validation rule enforces closed-lost reason |
| `has_speed_to_lead_tool` | boolean | installedPackages (Chili Piper, Qualified, LeanData patterns) | PR-5 | Speed-to-lead tooling detected |
| `has_sales_coaching_tool` | boolean | installedPackages (SalesCoach, Gong, Chorus patterns) | EN-3 | Coaching platform detected |
| `has_cpq_tool` | boolean | installedPackages (DealHub, Salesforce CPQ, Apttus patterns) | SY-2 | CPQ/quote management tool |
| `has_subscription_management` | boolean | installedPackages (DealHub Subscription, Zuora, Chargebee) | PR-3 | Subscription management for renewals |
| `dashboard_folder_names` | string[] | dashboards[].FolderName | RP-1, RP-2 | Unique folder names for classification |
| `has_weekly_review_dashboards` | boolean | dashboards[].Title matching /weekly/i | RP-4 | Weekly cadence signal |
| `has_forecast_dashboards` | boolean | dashboards[].Title or FolderName matching /forecast/i | RP-6 | Forecast dashboard presence |
| `campaign_type_counts` | object | campaigns[].Type grouped | PR-9 | `{ "Tradeshow": 5, "Content Syndication": 3, ... }` |
| `has_event_campaigns` | boolean | campaigns[].Type in [Tradeshow, Field Events, Webinar, ...] | C12 | Events signal |
| `has_nurture_campaigns` | boolean | campaigns[].Type matching /email|newsletter|nurture/i | C11 | Email nurture signal |

#### C. Picklist value extraction (from object describes - already downloaded)

The `describe` API returns `picklistValues` for every picklist field. We download these but **never extract the values**. These are critical for answering diagnostic questions.

| Signal Name | Object.Field | What It Reveals |
|------------|-------------|-----------------|
| `closed_lost_reason_values` | Opportunity.Closed_Lost_Reason__c (or similar) | C6: Structured closed-lost tracking |
| `opp_source_values` | Opportunity.Opportunity_Source__c / LeadSource | C14: Marketing vs sales sourced |
| `lead_source_values` | Lead.LeadSource | C1: How inbound leads reach CRM |
| `opp_type_values` | Opportunity.Type | Renewal vs New Business tracking |
| `forecast_category_values` | Opportunity.ForecastCategory / ForecastCategoryName | RP-6: Forecasting methodology depth |
| `budget_field_values` | Opportunity.Budget__c (or similar BANT field) | C4: Qualification methodology |
| `lead_status_values` | Lead.Status | C3: MQL definition |
| `opp_stage_count` | Opportunity.StageName picklistValues.length | C5: Stage transitions |

**Implementation approach:** In `extractSalesforceSignals()`, after getting `opportunityFields`, scan for known picklist fields and extract their values:

```javascript
// Example extraction pattern
const closedLostField = opportunityFields.find(f =>
  /closed.*lost.*reason|loss.*reason/i.test(f.name || f.label || '')
);
signals.closed_lost_reason_values = closedLostField?.picklistValues?.map(pv => pv.value) || [];
signals.has_structured_closed_lost = (signals.closed_lost_reason_values.length >= 3);
```

---

## Part 3: Grader Enhancements

### RP-5: Revenue Metrics (Power 10) - Currently INTAKE_ONLY

This is the biggest opportunity. Currently RP-5 relies entirely on intake answers (`power10_metrics_count`). With the new queries, we can **auto-detect reportability** for most of the Power 10:

| Metric | Auto-Detect Logic | New Signals Used |
|--------|------------------|------------------|
| 1. ARR by segment | `has_arr_field` on Account AND `has_segment_field` on Account | Existing describes (need new field pattern) |
| 2. New + expansion bookings | `has_bookings_split` (won opps have multiple Types) | N6: `won_opp_by_type` |
| 3. Pipeline by source & stage | `has_deal_source_property` AND `opp_stage_count > 3` | Existing signals |
| 4. MQLs by source & channel | `lead_conversion_count_365d > 0` AND UTM fields on Lead | N7 + existing describes |
| 5. Revenue churn ex-expansions | `has_churn_field` on Opp AND `has_bookings_split` | New field pattern + N6 |
| 6. Gross dollar retention | `has_arr_field` AND `contract_count > 0` AND `has_renewal_tracking` | N4 + existing |
| 7. Net dollar retention | Same as GDR + `has_bookings_split` | N4 + N6 + existing |
| 8. MQL-to-opp conversion | `lead_conversion_count_365d > 0` | N7 |
| 9. Opp-to-won rate | Always reportable (standard fields) | Always true |
| 10. Avg sales cycle time | `has_stage_history` OR always reportable (CreatedDate → CloseDate) | N5 |

**Proposed new grading:** Compute `power10_api_count` by counting how many metrics are auto-detected as "Automated". Use this as a floor for the intake score.

### RP-1: Dashboard count accuracy

Current: Uses `dashboard_count` which is capped at LIMIT 200.
Fix: Use `total_dashboard_count` from the COUNT() query.

### RP-6: Forecasting depth

Current: Binary `has_forecasting_config` (true/false).
Enhancement: Use `forecasting_item_count` for graduated scoring:
- 0 items: configured but unused (score 3)
- 1-1000: light usage (score 4)
- 1000+: heavy usage (score 5)

---

## Part 4: Implementation Changes

### File 1: `lib/salesforce-downloader.js`

**Add new queries to `Promise.all`:**

```javascript
// ── v4: Metric Reportability Queries ──
downloadSOQLSafe(baseUrl, headers,
  'SELECT COUNT() FROM ForecastingItem',
  'forecastingItemCount', fetchStatus),

downloadSOQLSafe(baseUrl, headers,
  'SELECT COUNT() FROM OpportunityLineItem',
  'oppLineItemCount', fetchStatus),

downloadSOQLSafe(baseUrl, headers,
  'SELECT COUNT() FROM Product2 WHERE IsActive = true',
  'activeProductCount', fetchStatus),

downloadSOQLSafe(baseUrl, headers,
  'SELECT COUNT() FROM Contract',
  'contractCount', fetchStatus),

downloadSOQLSafe(baseUrl, headers,
  'SELECT COUNT() FROM OpportunityFieldHistory WHERE Field = \'StageName\'',
  'stageHistoryCount', fetchStatus),

downloadSOQLSafe(baseUrl, headers,
  'SELECT Type, COUNT(Id) cnt, SUM(Amount) total FROM Opportunity WHERE IsClosed = true AND IsWon = true AND CloseDate >= LAST_N_DAYS:365 GROUP BY Type',
  'wonOppsByType', fetchStatus),

downloadSOQLSafe(baseUrl, headers,
  'SELECT COUNT() FROM Lead WHERE IsConverted = true AND ConvertedDate >= LAST_N_DAYS:365',
  'leadConversionCount', fetchStatus),

downloadSOQLSafe(baseUrl, headers,
  'SELECT LeadSource, COUNT(Id) cnt FROM Lead WHERE IsConverted = true AND ConvertedDate >= LAST_N_DAYS:365 GROUP BY LeadSource',
  'leadConversionBySource', fetchStatus),

downloadSOQLSafe(baseUrl, headers,
  'SELECT COUNT() FROM Dashboard',
  'totalDashboardCount', fetchStatus),

downloadSOQLSafe(baseUrl, headers,
  'SELECT COUNT() FROM Report',
  'totalReportCount', fetchStatus),
```

**Modify existing user query (add LastLoginDate):**

```javascript
// Change from:
'SELECT Id, Name, IsActive, Profile.Name, UserRole.Name FROM User WHERE IsActive = true'
// To:
'SELECT Id, Name, IsActive, Profile.Name, UserRole.Name, LastLoginDate FROM User WHERE IsActive = true'
```

**Add new data to fullMetadata object and Supabase upsert.**

### File 2: `lib/diagnostic-engine/signal-extractor-sf.js`

**Add new field pattern detections:**

```javascript
// ARR field detection on Account
has_arr_field: detectFieldPattern(accountFields, /\barr\b|annual.*recurring|mrr|monthly.*recurring/i),

// Churn field detection on Opportunity
has_churn_field: detectFieldPattern(opportunityFields, /churn|forecasted.*churn|renewal.*risk/i),

// Segment field detection on Account
has_segment_field: detectFieldPattern(accountFields, /segment|tier|classification|customer_segment/i),

// UTM field detection on Lead (web attribution)
has_utm_fields: detectFieldPattern(
  [...getFields(objects?.Lead), ...getFields(objects?.Contact)],
  /utm_source|utm_medium|utm_campaign|utm_content|utm_term/i
),

// Speed-to-lead tool detection (Chili Piper, Qualified, LeanData)
has_speed_to_lead_tool: false, // Set in v3 extractor from packages

// Opp validation rule count
opp_validation_rule_count: valRuleList.filter(v => {
  const entity = v.EntityDefinition?.QualifiedApiName || v.EntityDefinition || '';
  return /^Opportunity$/i.test(typeof entity === 'string' ? entity : '');
}).length,
```

**Add picklist value extraction:**

```javascript
// Closed-lost reason values
closed_lost_reason_values: extractPicklistValues(opportunityFields, /closed.*lost.*reason|loss.*reason/i),
has_structured_closed_lost: extractPicklistValues(opportunityFields, /closed.*lost.*reason|loss.*reason/i).length >= 3,

// Opportunity source/lead source values
opp_source_values: extractPicklistValues(opportunityFields, /opportunity.*source|opp.*source/i),
lead_source_values: extractPicklistValues(opportunityFields, /^LeadSource$/),

// Opportunity type values
opp_type_values: extractPicklistValues(opportunityFields, /^Type$/),

// BANT/methodology picklist values
budget_values: extractPicklistValues(opportunityFields, /^budget/i),
authority_values: extractPicklistValues(opportunityFields, /^authority/i),
timeline_values: extractPicklistValues(opportunityFields, /^timeline|^timeliness/i),
```

**New helper function:**

```javascript
function extractPicklistValues(fields, namePattern) {
  if (!Array.isArray(fields)) return [];
  const field = fields.find(f => namePattern.test(f.name || '') || namePattern.test(f.label || ''));
  if (!field || !Array.isArray(field.picklistValues)) return [];
  return field.picklistValues
    .filter(pv => pv.active !== false)
    .map(pv => pv.value || pv.label || '');
}
```

### File 3: `lib/diagnostic-engine/v3/signal-extractor-v3.js`

**Add processing for new query results in `extractSignalsV3Salesforce()`:**

```javascript
// Destructure new fields from metadata
const {
  // ... existing ...
  // v4: Metric reportability data
  forecastingItemCount, oppLineItemCount, activeProductCount,
  contractCount, stageHistoryCount, wonOppsByType,
  leadConversionCount, leadConversionBySource,
  totalDashboardCount, totalReportCount,
} = metadata || {};

// ── v4 Signals ──

// Forecasting depth
const fiCount = extractCount(forecastingItemCount);
base.forecasting_item_count = fiCount;

// Product catalog
const oliCount = extractCount(oppLineItemCount);
base.has_product_catalog = oliCount > 0;
base.product_line_item_count = oliCount;
base.active_product_count = extractCount(activeProductCount);

// Contracts
base.contract_count = extractCount(contractCount);

// Stage history
const shCount = extractCount(stageHistoryCount);
base.has_stage_history = shCount > 0;
base.stage_history_count = shCount;

// Won opps by type
const wonByType = Array.isArray(wonOppsByType) ? wonOppsByType : [];
base.won_opp_by_type = {};
for (const row of wonByType) {
  base.won_opp_by_type[row.Type || 'Unknown'] = { count: row.cnt || 0, amount: row.total || 0 };
}
base.has_bookings_split = Object.keys(base.won_opp_by_type).length > 1;

// Lead conversion
base.lead_conversion_count_365d = extractCount(leadConversionCount);
const convBySource = Array.isArray(leadConversionBySource) ? leadConversionBySource : [];
base.lead_conversion_by_source = {};
for (const row of convBySource) {
  base.lead_conversion_by_source[row.LeadSource || 'Unknown'] = row.cnt || 0;
}

// True dashboard/report counts (override LIMIT 200 counts)
base.total_dashboard_count = extractCount(totalDashboardCount) || base.dashboard_count;
base.total_report_count = extractCount(totalReportCount) || base.report_count;

// Override dashboard_count for graders if total is available
if (base.total_dashboard_count > base.dashboard_count) {
  base.dashboard_count = base.total_dashboard_count;
}
if (base.total_report_count > base.report_count) {
  base.report_count = base.total_report_count;
}

// User login recency
const userList = Array.isArray(metadata.users) ? metadata.users : [];
const now = new Date();
const d30 = new Date(now - 30 * 86400000);
const d7 = new Date(now - 7 * 86400000);
const nonAdminUsers = userList.filter(u => !/system.?admin/i.test(u.Profile?.Name || ''));
base.user_login_recency = {
  active_last_7d: nonAdminUsers.filter(u => u.LastLoginDate && new Date(u.LastLoginDate) > d7).length,
  active_last_30d: nonAdminUsers.filter(u => u.LastLoginDate && new Date(u.LastLoginDate) > d30).length,
  total_non_admin: nonAdminUsers.length,
};
base.ic_daily_usage_rate = nonAdminUsers.length > 0
  ? Math.round((base.user_login_recency.active_last_7d / nonAdminUsers.length) * 100)
  : 0;

// Speed-to-lead tool detection from packages
const speedToLeadPatterns = /chili.?piper|qualified|leanddata|chili/i;
base.has_speed_to_lead_tool = packageNames.some(n => speedToLeadPatterns.test(n));

// Coaching tool detection
const coachingPatterns = /gong|chorus|exec.?vision|sales.?coach|clari|avoma/i;
base.has_sales_coaching_tool = packageNames.some(n => coachingPatterns.test(n));

// CPQ tool detection
const cpqPatterns = /dealhub|salesforce.*cpq|apttus|conga|pandadoc|proposify/i;
base.has_cpq_tool = packageNames.some(n => cpqPatterns.test(n));

// Subscription management
const subMgmtPatterns = /dealhub.*subscription|zuora|chargebee|recurly|stripe/i;
base.has_subscription_management = packageNames.some(n => subMgmtPatterns.test(n));

// Dashboard folder analysis (enhanced)
const dashFolders = [...new Set(dashboardList.map(d => d.FolderName).filter(Boolean))];
base.dashboard_folder_names = dashFolders;
base.has_weekly_review_dashboards = dashboardList.some(d => /weekly/i.test(d.Title || ''));
base.has_forecast_dashboards = dashboardList.some(d =>
  /forecast/i.test(d.Title || '') || /forecast/i.test(d.FolderName || '')
);

// Campaign type analysis
const campaignTypes = {};
for (const c of campaignList) {
  const t = c.Type || 'Unknown';
  campaignTypes[t] = (campaignTypes[t] || 0) + 1;
}
base.campaign_type_counts = campaignTypes;
base.has_event_campaigns = campaignList.some(c =>
  /tradeshow|field.?event|conference|dinner|webinar|virtual.?event/i.test(c.Type || '')
);
base.has_nurture_campaigns = campaignList.some(c =>
  /email|newsletter|nurture|promotional/i.test(c.Type || c.Name || '')
);

// Power 10 auto-detection
base.power10_auto_scores = {
  arr_by_segment: (base.has_arr_field && base.has_segment_field) ? 'automated' : 'cant_report',
  new_expansion_bookings: base.has_bookings_split ? 'automated' : 'cant_report',
  pipeline_by_source_stage: (base.has_deal_source_property && (base.deal_pipeline_stages?.length > 0)) ? 'automated' : 'cant_report',
  mqls_by_source: (base.lead_conversion_count_365d > 0 && base.has_utm_fields) ? 'automated' : (base.lead_conversion_count_365d > 0 ? 'manual_calc' : 'cant_report'),
  revenue_churn: (base.has_churn_field && base.has_bookings_split) ? 'automated' : (base.has_renewal_tracking ? 'manual_calc' : 'cant_report'),
  gross_dollar_retention: (base.has_arr_field && base.contract_count > 0) ? 'manual_calc' : 'cant_report',
  net_dollar_retention: (base.has_arr_field && base.contract_count > 0 && base.has_bookings_split) ? 'manual_calc' : 'cant_report',
  mql_to_opp: base.lead_conversion_count_365d > 0 ? 'automated' : 'cant_report',
  opp_to_won: 'automated', // Always reportable
  avg_sales_cycle: 'automated', // Always reportable (CreatedDate - CloseDate)
};
base.power10_api_count = Object.values(base.power10_auto_scores).filter(v => v === 'automated').length;
```

**New helper:**

```javascript
function extractCount(queryResult) {
  if (!queryResult) return 0;
  if (typeof queryResult === 'number') return queryResult;
  if (Array.isArray(queryResult) && queryResult[0]) {
    return queryResult[0].cnt || queryResult[0].expr0 || queryResult[0].total || 0;
  }
  return 0;
}
```

### File 4: Supabase Migration (new)

```sql
-- 013_salesforce_v4_metric_signals.sql
ALTER TABLE salesforce_metadata
  ADD COLUMN IF NOT EXISTS forecasting_item_count JSONB,
  ADD COLUMN IF NOT EXISTS opp_line_item_count JSONB,
  ADD COLUMN IF NOT EXISTS active_product_count JSONB,
  ADD COLUMN IF NOT EXISTS contract_count JSONB,
  ADD COLUMN IF NOT EXISTS stage_history_count JSONB,
  ADD COLUMN IF NOT EXISTS won_opps_by_type JSONB,
  ADD COLUMN IF NOT EXISTS lead_conversion_count JSONB,
  ADD COLUMN IF NOT EXISTS lead_conversion_by_source JSONB,
  ADD COLUMN IF NOT EXISTS total_dashboard_count JSONB,
  ADD COLUMN IF NOT EXISTS total_report_count JSONB;
```

### File 5: `lib/salesforce-metadata-parser.js` (zip upload path)

The zip parser is a fundamentally limited path because `sf project retrieve start` doesn't include:
- Standard object field describes (no picklist values)
- User data
- Stage configurations
- Dashboard/report records
- Campaign records
- Installed packages
- Most SOQL-queryable data

**Recommended approach:** Keep the zip parser as a basic fallback but clearly communicate to users that OAuth connection provides 10x better diagnostic accuracy. Add a note to the upload UI:

> "For the most accurate diagnostic, connect your Salesforce org via OAuth. ZIP upload provides limited analysis (~40% of available signals)."

No changes to the zip parser itself are needed - the signal extractor already handles missing data gracefully with `null` scores.

---

## Part 5: Scandit Org Query Results Reference

### Key Metadata Found

**Opportunity (331 custom fields)**
- Stages: 17 (Validate → Discover → Evaluate → Select → Negotiate → Awaiting Signature → Purchase → Closed Won/Lost/Booked/Billable/Rejected + Renewal + Ren Strategy 1/2 + Acc Strategy + Sales Rejected)
- Record Types: 5 (New Business, Existing Business, Closed Billable, Existing Business Closed Billable, View Layout)
- Types: New Business, New Business (Growth), New Business (Upsell), Existing Business, Pilot, Restructure
- Closed Lost Reasons: 14 structured values (required via validation rule)
- Methodology: BANT-influenced (Budget, Authority, Timeline, Compelling Event, Decision Criteria, Next Step Date)
- Validation Rules: 47 active on Opportunity
- Forecast Fields: ForecastCategory, Forecast_Stage_SD__c, Forecast_Stage_VP__c, HoS_ACV_Forecast1__c, Pipeline_Forecast_Category__c
- Source Fields: Opportunity_Source__c, Sub_Opportunity_Source__c (29 values), Scandit_Opportunity_Source__c, True_Source__c (15 values)
- Renewal Fields: 25+ fields including Renewal_Forecast__c, Original_Renewal_Amount__c, Forecasted_Churn__c, Auto_Renewal__c, Forecast_Stage__c (renewal-specific)
- Competitor Fields: Primary_Competitor__c + 3 additional competitor picklists, competitor comments

**Lead (254 custom fields)**
- Sources: Sales Generated, Marketing Generated, Partner Generated, Customer Success
- Statuses: Open - not contacted, BDR/Sales Nurture, Working, Sales Qualified, Permanent Rejection, Return to Marketing, Open/Won Opportunity, Insufficient/Incorrect Data
- Scoring: mkto71_Lead_Score__c, Behavior_Score__c, Demographic_Score__c, Score_at_MQL__c, Score_at_SAL__c
- MQL Tracking: Date_MQL__c, Date_Latest_MQL__c, MQL_Date_Time__c, Days_in_MQL__c, Changed_to_MQL__c, Date_Recycled_to_MQL__c
- UTM Fields: UTM_Source__c, UTM_Medium__c, UTM_Term__c, UTM_Campaign__c, UTM_Content__c

**Account**
- ARR: ARR__c, ARR_converted_in_USD__c
- Segments: Customer_Segment__c (Tier 1/2/3), Segmentation__c (Segment 1/2a/2b/3/4), Proposed_Tier_2023__c (Strat 1/2, Core 1/2, Small Business, ISV/Partner)
- CSM: Customer_Success_Manager__c (lookup), Customer_Success_Manager_for_Zendesk__c
- Partners: 19 partner-related fields including tier, engagement stage, priority, agreement tracking
- No NPS/CSAT/Health fields detected

**Org-wide counts**
- 825 Dashboards (organized by team: US Core, EMEA Core, US Strategic, EMEA Strategic, SMB, Japan)
- 20,034 Reports
- 10,687 Active Campaigns (includes Tradeshow, Content Syndication, ABM BDR Outreach, Newsletter)
- 103 Active Flows
- 143 Active Users (last login since Dec 2025)
- 46,065 ForecastingItems (heavy collaborative forecasting)
- 8,051 OpportunityLineItems, 717 Active Products
- 322 Contracts
- 15,316 Stage change history records
- 2,419,162 CampaignMember records
- 32 Installed Packages (Marketo, ZoomInfo, Salesloft, DealHub, Zendesk, Slack, Qualified, Clay, RingLead/UniqueEntry, Highspot, SalesCoach Lightning, Oktopost, Nintex, Email to Case Premium)

---

## Part 6: Implementation Order

### Phase 1: Quick Wins (fix undercounting)
1. Add `total_dashboard_count` and `total_report_count` COUNT() queries
2. Add `LastLoginDate` to user query
3. Wire into signal extractor (override LIMIT 200 counts)

### Phase 2: Metric Reportability Queries
4. Add N1-N8 queries (ForecastingItem, OLI, Product, Contract, StageHistory, WonOpps, LeadConversion)
5. Add new signal extraction in v3 extractor
6. Run Supabase migration

### Phase 3: Enhanced Signal Extraction
7. Add picklist value extraction to base extractor
8. Add new package detection patterns (Chili Piper, Qualified, DealHub Sub, coaching tools)
9. Add Power 10 auto-detection logic
10. Add campaign type analysis
11. Add dashboard folder classification enhancements

### Phase 4: Grader Updates
12. Update RP-1 to use `total_dashboard_count`
13. Update RP-5 to blend `power10_api_count` with intake
14. Update RP-6 to use `forecasting_item_count` for graduated scoring
15. Update PR-3 to boost score if `contract_count > 0`

---

## Appendix: Diagnostic Question → Signal Mapping

### Processes (22 questions)

| # | Question | Best Answer for Scandit | Key Signals Needed |
|---|---------|----------------------|-------------------|
| C1 | Inbound lead channels | Mix | `lead_source_values`, `has_utm_fields`, installed packages |
| C2 | Response time | <5 min | `has_speed_to_lead_tool` (Chili Piper, Qualified) |
| C3 | MQL definition | Yes, with lead scoring | `has_lead_scoring` (Marketo fields), MQL date fields |
| C4 | Qualification methodology | Custom (BANT+) | `methodology_field_count`, `budget_values`, `authority_values` |
| C5 | Stage enforcement | Yes, all | `opp_validation_rule_count` (47 for Scandit) |
| C6 | Closed-lost reasons | Required | `has_structured_closed_lost`, `has_closed_lost_reason_required` |
| C7 | Sales-to-CS handoff | Documented | CSM fields on Opp+Account, `has_cs_handoff_workflow` |
| C8 | Renewal tracking | Automated | `has_renewal_tracking`, renewal field count, `contract_count` |
| C9 | NPS/CSAT | No | `has_health_scoring` (false for Scandit) |
| C10 | Deduplication | Automated tool | `duplicate_rule_count`, RingLead/UniqueEntry package |
| C11 | Email nurture | Yes, in MAP | `has_marketing_automation_package`, `has_nurture_campaigns` |
| C12 | Events | Yes, regularly | `has_event_campaigns`, campaign types |
| C13 | Partner tracking | Tags/fields | Partner fields on Account, Opp source values |
| C14 | Marketing vs sales pipeline | Yes, in CRM | `opp_source_values`, `has_deal_source_property` |
| C15 | Attribution model | First-touch | Campaign tracking, UTM fields, no multi-touch tool |
| C16 | Win/loss analysis | Ad hoc | Competitor fields, `has_structured_closed_lost` |
| C17 | Operating/GTM plan | Yes quarterly | Dashboard folders with "CFQ", forecast dashboards |
| C18 | Headcount model | Basic | Profile distribution, EditQuotas package |
| C19 | Business review frequency | W/M/Q | `has_weekly_review_dashboards`, dashboard patterns |
| C20 | Manager dashboards | Yes per team | `manager_dashboard_count`, dashboard folder analysis |
| C21 | IC daily CRM use | Yes with views | `ic_daily_usage_rate`, validation rule enforcement |
| C22 | Coaching program | Informal | `has_sales_coaching_tool`, Must-Win field |

### Reporting (16 questions)

| # | Question | Best Answer for Scandit | Key Signals Needed |
|---|---------|----------------------|-------------------|
| D1 | Dashboard count | 10+ (825) | `total_dashboard_count` |
| D2 | Dashboard trust | Yes, primary | Dashboard count + folder diversity |
| D3 | Forecasting method | CRM forecast tool | `has_forecasting_config`, `forecasting_item_count` |
| D4 | Growth model | Yes, comprehensive | ARR tracking, bookings split, segment fields |
| D5 | Report distribution | On-demand | `report_schedule_count`, `total_report_count` |
| D6 | Playbooks documented | Yes in enablement | `has_enablement_package` (Highspot) |
| D7 | ARR by segment | Automated | `has_arr_field` + `has_segment_field` |
| D8 | New + expansion bookings | Automated | `won_opp_by_type`, `has_bookings_split` |
| D9 | Pipeline by source & stage | Automated | `has_deal_source_property` + stage count |
| D10 | MQLs by source | Automated | `lead_conversion_by_source`, UTM fields |
| D11 | Revenue churn | Automated | `has_churn_field`, Forecast_Stage renewal values |
| D12 | Gross dollar retention | Manual calc | `has_arr_field`, `contract_count`, `has_renewal_tracking` |
| D13 | Net dollar retention | Manual calc | Same as D12 + `has_bookings_split` |
| D14 | MQL-to-opp conversion | Automated | `lead_conversion_count_365d` |
| D15 | Opp-to-won rate | Automated | Always (standard fields) |
| D16 | Avg sales cycle | Automated | `has_stage_history` or always (CreatedDate-CloseDate) |
