# Salesforce CLI Data Extract — Design Document

**Date:** 2026-02-27
**Status:** Approved

## Problem

When a customer's Salesforce org blocks OAuth from external Connected Apps, the current fallback (metadata ZIP upload) produces significant gaps — no user data, no stages, no SOQL-derived insights. This results in a weak diagnostic with many unanswered intake questions.

## Solution

A Claude Code skill (`/sf-data-extract`) that guides a consultant through extracting complete Salesforce data via the `sf` CLI, then uploads it to a new API endpoint. The skill runs the same SOQL queries as the OAuth path **plus** 13 enhanced queries that go beyond OAuth, enabling ~24 of ~34 intake questions to be auto-filled.

## Architecture

### Skill Flow

```
1. Preflight     → sf org list, pick org, enter customer slug
2. Phase A       → sf sobject describe (6 objects)
3. Phase B       → Core SOQL queries (~20, replicate OAuth path)
4. Phase C       → Enhanced SOQL queries (~13, beyond OAuth)
5. Assemble      → Combine into JSON matching downloader shape
6. Upload        → POST /api/salesforce/upload-json
7. Report        → Summary of signals + pre-filled questions
```

### New API Endpoint

`POST /api/salesforce/upload-json`

Accepts:
```json
{
  "customerId": "uuid",
  "metadata": { /* same shape as salesforce-downloader output */ },
  "enhanced": {
    "arrAggregate": [...],
    "leadSourceDistribution": [...],
    "campaignTypes": [...],
    "loginHistory": [...],
    "partnerObjects": [...],
    ...
  }
}
```

Processing:
1. Run `extractSalesforceSignals(metadata)` — existing signal extractor
2. Run `inferEnhancedAnswers(enhanced, metadata)` — new enhanced inferrer
3. Store in `salesforce_metadata` table (same columns + enhanced_signals)
4. Trigger diagnostic if intake is `awaiting_crm_data`

### Enhanced Inferrer

New file: `lib/diagnostic-engine/intake-inferrer-sf-enhanced.js`

| Question | SOQL Source | Inference Logic |
|----------|-------------|-----------------|
| A3 (ARR) | `SUM(Amount) FROM Opportunity WHERE IsWon=true AND CloseDate=THIS_YEAR` | Map total to ARR bucket |
| A4 (GTM motion) | `SELECT LeadSource, COUNT(Id) FROM Lead GROUP BY LeadSource` | Dominant source → motion |
| A5 (Partner) | Check `PartnerRole` object + partner record types | Partner objects → "Yes, active" |
| C2 (Response time) | `SELECT AVG(...)` on Lead-to-first-Task gap | Map to time bucket |
| C7 (CS handoff) | CS-related profiles/roles + ownership-change flows | Detect handoff process |
| C9 (NPS/CSAT) | Account/Contact fields matching `nps\|csat\|survey` | Detect survey program |
| C12 (Events) | `SELECT Type, COUNT(Id) FROM Campaign GROUP BY Type` | Event types → "Yes, regularly" |
| C16 (Manager dashboards) | Dashboard folder names with `manager\|director\|leadership` | Detect management views |
| C17 (IC daily use) | `LoginHistory` last 7 days | High frequency → "Yes" |
| D3 (Forecasting) | `ForecastingType` + forecast fields on Opportunity | Detect forecast tool |
| D5 (Report distribution) | `CronTrigger` scheduled reports | Scheduled → "Automated" |
| D6 (Playbooks) | `ContentVersion` + `KnowledgeArticleVersion` keywords | Detect documentation |
| Power 10 | Report names matching metric keywords | Per-metric reportability |

### Customer Lookup Endpoint

`GET /api/customers/lookup?slug=<slug>`

Returns `{ id, name, slug }` for the given slug. Used by the skill to resolve human-readable slug to UUID.

## SOQL Queries

### Phase B: Core Queries (replicate OAuth)

```sql
-- Users
SELECT Id, Name, IsActive, Profile.Name, UserRole.Name FROM User WHERE IsActive = true

-- Opportunity Stages
SELECT MasterLabel, DefaultProbability, IsClosed, IsWon, SortOrder FROM OpportunityStage ORDER BY SortOrder

-- Lead Statuses
SELECT MasterLabel, SortOrder FROM LeadStatus ORDER BY SortOrder

-- Flows (Tooling API — use sf data query --use-tooling-api)
SELECT Id, Status, ProcessType, Label FROM Flow WHERE Status = 'Active'

-- Workflow Rules (Tooling)
SELECT Id, Name, TableEnumOrId FROM WorkflowRule WHERE Active = true

-- Validation Rules (Tooling)
SELECT Id, ValidationName, EntityDefinition.QualifiedApiName, Active FROM ValidationRule WHERE Active = true

-- Apex Triggers (Tooling)
SELECT Id, Name, Status, TableEnumOrId FROM ApexTrigger

-- Apex Classes (Tooling)
SELECT Id, Name, LengthWithoutComments, NamespacePrefix FROM ApexClass WHERE NamespacePrefix = null

-- Profiles (Tooling)
SELECT Id, Name FROM Profile

-- Permission Sets (Tooling)
SELECT Id, Label, IsCustom FROM PermissionSet WHERE IsOwnedByProfile = false

-- Roles
SELECT Id, DeveloperName, ParentRoleId FROM UserRole

-- Reports
SELECT Id, Name, FolderName FROM Report LIMIT 200

-- Dashboards
SELECT Id, Title, FolderName FROM Dashboard LIMIT 200

-- Connected Apps (Tooling)
SELECT Id, Name FROM ConnectedApplication

-- Named Credentials (Tooling)
SELECT Id, MasterLabel FROM NamedCredential

-- Record Types
SELECT SobjectType, COUNT(Id) cnt FROM RecordType GROUP BY SobjectType

-- Campaigns
SELECT Id, Name, Type, IsActive, NumberOfContacts, NumberOfOpportunities, NumberOfLeads FROM Campaign WHERE IsActive = true LIMIT 200

-- Installed Packages (Tooling)
SELECT Id, SubscriberPackage.Name, SubscriberPackageVersion.Name FROM InstalledSubscriberPackage

-- Territories
SELECT Id, State FROM Territory2Model WHERE State = 'Active'

-- Forecasting Types
SELECT Id, DeveloperName, IsActive FROM ForecastingType WHERE IsActive = true

-- Duplicate Rules (Tooling)
SELECT Id, DeveloperName, SobjectType, IsActive FROM DuplicateRule WHERE IsActive = true

-- Report Schedules
SELECT CronJobDetail.Name, CronExpression, State FROM CronTrigger WHERE CronJobDetail.JobType = '8' AND State = 'WAITING' LIMIT 100

-- Email Templates
SELECT COUNT(Id) cnt FROM EmailTemplate WHERE IsActive = true

-- Task Aggregates
SELECT COUNT(Id) total, Status FROM Task WHERE CreatedDate > LAST_N_DAYS:90 GROUP BY Status

-- Event Patterns
SELECT Subject, IsRecurrence, RecurrenceType FROM Event WHERE IsRecurrence = true AND ActivityDate > LAST_N_DAYS:90 LIMIT 500

-- Content Versions
SELECT Title, FileType, CreatedDate FROM ContentVersion WHERE IsLatest = true ORDER BY CreatedDate DESC LIMIT 100

-- Knowledge Articles
SELECT Id, Title FROM KnowledgeArticleVersion WHERE PublishStatus = 'Online' AND IsLatest = true LIMIT 100

-- Campaign Members
SELECT COUNT(Id) cnt FROM CampaignMember
```

### Phase C: Enhanced Queries (new — beyond OAuth)

```sql
-- ARR / Bookings aggregate
SELECT SUM(Amount) total FROM Opportunity WHERE IsClosed = true AND IsWon = true AND CloseDate = THIS_YEAR

-- Lead source distribution
SELECT LeadSource, COUNT(Id) cnt FROM Lead WHERE CreatedDate = THIS_YEAR GROUP BY LeadSource

-- Campaign type distribution
SELECT Type, COUNT(Id) cnt FROM Campaign WHERE IsActive = true GROUP BY Type

-- Login history (last 7 days)
SELECT UserId, COUNT(Id) cnt FROM LoginHistory WHERE LoginTime = LAST_N_DAYS:7 GROUP BY UserId

-- Partner role check
SELECT Id FROM PartnerRole LIMIT 1

-- Report names (for Power 10 metric detection)
SELECT Name FROM Report WHERE FolderName != 'Private Reports' LIMIT 500
```

## Deliverables

1. **Skill file:** `.claude/skills/sf-data-extract.md`
2. **API endpoint:** `pages/api/salesforce/upload-json.js`
3. **Enhanced inferrer:** `lib/diagnostic-engine/intake-inferrer-sf-enhanced.js`
4. **Customer lookup:** `pages/api/customers/lookup.js`
5. **Update upload-json to merge enhanced pre-fills into AnalyzingScreen flow**

## Coverage Summary (merged with gap analysis plan)

| Category | Questions | Currently Inferred | After Enhancement |
|----------|-----------|-------------------|-------------------|
| Section A (Profile) | 5 | 1 (A2) | 4 (A2, A3, A4, A5) |
| Section B (Tools) | 1 + follow-ups | 1 (B1_tools) | 1 (B1_tools) |
| Section C (Processes) | 18 | 7 (C1,C3,C4,C5,C6,C8,C10,C11) | 14 (+C2,C7,C9,C11,C12,C13,C15) |
| Section D (Reporting) | 6 + Power 10 | 1 (D1) | 6 (D1,D2,D3,D4,D5,D6) + Power 10 |
| **Total** | **~40** | **11** | **~27 + Power 10** |

### Enhanced queries merged from gap analysis plan:
- True dashboard/report COUNT() queries (fixes LIMIT 200 undercount)
- Won opp breakdown by type (new/expansion bookings split)
- Lead conversion count + by-source (MQL-to-opp rate)
- ForecastingItem count (forecasting depth)
- OpportunityLineItem count (product catalog usage)
- Contract count (renewal/retention tracking depth)
- OpportunityFieldHistory for StageName (sales cycle tracking)
- Installed package detection for speed-to-lead, coaching, CPQ, enablement tools
- Picklist value extraction from object describes
- Data-backed Power 10 auto-scoring (not just report name matching)
