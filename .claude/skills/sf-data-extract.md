---
name: sf-data-extract
description: Extract Salesforce CRM data via CLI when OAuth is blocked. Runs SOQL queries, assembles metadata, uploads to the sales app for diagnostic pre-fill.
---

# Salesforce CLI Data Extract

When a customer's Salesforce org blocks OAuth from external Connected Apps, use this skill to extract the same data (and more) via the Salesforce CLI.

## Prerequisites

- Salesforce CLI (`sf`) installed
- Authenticated to the target org (run `sf org login web --alias <name>` if not)
- Sales app running (localhost or deployed)

## Step 1: Preflight

Run `sf org list --json` and present the authenticated orgs to the user. Ask them to confirm which org alias to use.

Ask the user for the customer slug (the URL path segment, e.g. "scandit" from `/scandit/try-leanscale/diagnostic`).

Resolve the slug to a customerId:
```bash
curl -s "https://app.leanscale.com/api/customers/lookup?slug=<SLUG>" | jq .id
```
(Or use localhost:3000 for local dev)

Store the org alias as `$ORG` and customerId as `$CUSTOMER_ID` for the rest of the script.

## Step 2: Object Describes (Phase A)

Create the temp directory and extract object describes:

```bash
mkdir -p /tmp/sf-extract
```

For each standard object, run the describe command and capture the JSON output:

```bash
sf sobject describe -s Lead -o $ORG --json > /tmp/sf-extract/Lead.json
sf sobject describe -s Contact -o $ORG --json > /tmp/sf-extract/Contact.json
sf sobject describe -s Account -o $ORG --json > /tmp/sf-extract/Account.json
sf sobject describe -s Opportunity -o $ORG --json > /tmp/sf-extract/Opportunity.json
sf sobject describe -s Case -o $ORG --json > /tmp/sf-extract/Case.json
sf sobject describe -s Campaign -o $ORG --json > /tmp/sf-extract/Campaign.json
```

Parse each JSON result to extract the `fields` array from `result.fields`. Build an objects map:
```json
{ "Lead": { "fields": [...] }, "Contact": { "fields": [...] }, ... }
```

## Step 3: Core SOQL Queries (Phase B)

Run each query via `sf data query`. For Tooling API queries use `--use-tooling-api`.

### Standard SOQL Queries

```bash
sf data query -q "SELECT Id, Name, IsActive, Profile.Name, UserRole.Name FROM User WHERE IsActive = true" -o $ORG --json > /tmp/sf-extract/users.json

sf data query -q "SELECT MasterLabel, DefaultProbability, IsClosed, IsWon, SortOrder FROM OpportunityStage ORDER BY SortOrder" -o $ORG --json > /tmp/sf-extract/opp-stages.json

sf data query -q "SELECT MasterLabel, SortOrder FROM LeadStatus ORDER BY SortOrder" -o $ORG --json > /tmp/sf-extract/lead-statuses.json

sf data query -q "SELECT Id, DeveloperName, ParentRoleId FROM UserRole" -o $ORG --json > /tmp/sf-extract/roles.json

sf data query -q "SELECT Id, Name, FolderName FROM Report LIMIT 200" -o $ORG --json > /tmp/sf-extract/reports.json

sf data query -q "SELECT Id, Title, FolderName FROM Dashboard LIMIT 200" -o $ORG --json > /tmp/sf-extract/dashboards.json

sf data query -q "SELECT SobjectType, COUNT(Id) cnt FROM RecordType GROUP BY SobjectType" -o $ORG --json > /tmp/sf-extract/record-types.json

sf data query -q "SELECT Id, Name, Type, IsActive, NumberOfContacts, NumberOfOpportunities, NumberOfLeads FROM Campaign WHERE IsActive = true LIMIT 200" -o $ORG --json > /tmp/sf-extract/campaigns.json

sf data query -q "SELECT CronJobDetail.Name, CronExpression, State FROM CronTrigger WHERE CronJobDetail.JobType = '8' AND State = 'WAITING' LIMIT 100" -o $ORG --json > /tmp/sf-extract/report-schedules.json

sf data query -q "SELECT COUNT(Id) cnt FROM EmailTemplate WHERE IsActive = true" -o $ORG --json > /tmp/sf-extract/email-templates.json

sf data query -q "SELECT COUNT(Id) total, Status FROM Task WHERE CreatedDate > LAST_N_DAYS:90 GROUP BY Status" -o $ORG --json > /tmp/sf-extract/task-aggregates.json

sf data query -q "SELECT Subject, IsRecurrence, RecurrenceType FROM Event WHERE IsRecurrence = true AND ActivityDate > LAST_N_DAYS:90 LIMIT 500" -o $ORG --json > /tmp/sf-extract/event-patterns.json

sf data query -q "SELECT Title, FileType, CreatedDate FROM ContentVersion WHERE IsLatest = true ORDER BY CreatedDate DESC LIMIT 100" -o $ORG --json > /tmp/sf-extract/content-versions.json

sf data query -q "SELECT COUNT(Id) cnt FROM CampaignMember" -o $ORG --json > /tmp/sf-extract/campaign-members.json
```

### Tooling API Queries

```bash
sf data query -q "SELECT Id, Status, ProcessType, Label FROM Flow WHERE Status = 'Active'" -o $ORG --use-tooling-api --json > /tmp/sf-extract/flows.json

sf data query -q "SELECT Id, Name, TableEnumOrId FROM WorkflowRule WHERE Active = true" -o $ORG --use-tooling-api --json > /tmp/sf-extract/workflow-rules.json

sf data query -q "SELECT Id, ValidationName, EntityDefinition.QualifiedApiName, Active FROM ValidationRule WHERE Active = true" -o $ORG --use-tooling-api --json > /tmp/sf-extract/validation-rules.json

sf data query -q "SELECT Id, Name, Status, TableEnumOrId FROM ApexTrigger" -o $ORG --use-tooling-api --json > /tmp/sf-extract/apex-triggers.json

sf data query -q "SELECT Id, Name, LengthWithoutComments, NamespacePrefix FROM ApexClass WHERE NamespacePrefix = null" -o $ORG --use-tooling-api --json > /tmp/sf-extract/apex-classes.json

sf data query -q "SELECT Id, Name FROM Profile" -o $ORG --use-tooling-api --json > /tmp/sf-extract/profiles.json

sf data query -q "SELECT Id, Label, IsCustom FROM PermissionSet WHERE IsOwnedByProfile = false" -o $ORG --use-tooling-api --json > /tmp/sf-extract/permission-sets.json

sf data query -q "SELECT Id, Name FROM ConnectedApplication" -o $ORG --use-tooling-api --json > /tmp/sf-extract/connected-apps.json

sf data query -q "SELECT Id, MasterLabel FROM NamedCredential" -o $ORG --use-tooling-api --json > /tmp/sf-extract/named-credentials.json

sf data query -q "SELECT Id, SubscriberPackage.Name, SubscriberPackageVersion.Name FROM InstalledSubscriberPackage" -o $ORG --use-tooling-api --json > /tmp/sf-extract/installed-packages.json

sf data query -q "SELECT Id, DeveloperName, SobjectType, IsActive FROM DuplicateRule WHERE IsActive = true" -o $ORG --use-tooling-api --json > /tmp/sf-extract/duplicate-rules.json
```

### Optional Queries (may fail if feature not enabled)

```bash
sf data query -q "SELECT Id, State FROM Territory2Model WHERE State = 'Active'" -o $ORG --json > /tmp/sf-extract/territories.json 2>/dev/null || echo '{"result":{"records":[]}}' > /tmp/sf-extract/territories.json

sf data query -q "SELECT Id, DeveloperName, IsActive FROM ForecastingType WHERE IsActive = true" -o $ORG --json > /tmp/sf-extract/forecasting-types.json 2>/dev/null || echo '{"result":{"records":[]}}' > /tmp/sf-extract/forecasting-types.json

sf data query -q "SELECT Id, Title FROM KnowledgeArticleVersion WHERE PublishStatus = 'Online' AND IsLatest = true LIMIT 100" -o $ORG --json > /tmp/sf-extract/knowledge-articles.json 2>/dev/null || echo '{"result":{"records":[]}}' > /tmp/sf-extract/knowledge-articles.json
```

## Step 4: Enhanced Queries (Phase C)

These go beyond what OAuth collects, enabling additional intake question inference:

### Revenue & Pipeline Queries
```bash
sf data query -q "SELECT SUM(Amount) total FROM Opportunity WHERE IsClosed = true AND IsWon = true AND CloseDate = THIS_YEAR" -o $ORG --json > /tmp/sf-extract/arr-aggregate.json

sf data query -q "SELECT Type, COUNT(Id) cnt, SUM(Amount) total FROM Opportunity WHERE IsClosed = true AND IsWon = true AND CloseDate >= LAST_N_DAYS:365 GROUP BY Type" -o $ORG --json > /tmp/sf-extract/won-opps-by-type.json
```

### Lead & Conversion Queries
```bash
sf data query -q "SELECT LeadSource, COUNT(Id) cnt FROM Lead WHERE CreatedDate = THIS_YEAR GROUP BY LeadSource" -o $ORG --json > /tmp/sf-extract/lead-sources.json

sf data query -q "SELECT COUNT(Id) cnt FROM Lead WHERE IsConverted = true AND ConvertedDate >= LAST_N_DAYS:365" -o $ORG --json > /tmp/sf-extract/lead-conversion-count.json

sf data query -q "SELECT LeadSource, COUNT(Id) cnt FROM Lead WHERE IsConverted = true AND ConvertedDate >= LAST_N_DAYS:365 GROUP BY LeadSource" -o $ORG --json > /tmp/sf-extract/lead-conversion-by-source.json
```

### Campaign & Activity Queries
```bash
sf data query -q "SELECT Type, COUNT(Id) cnt FROM Campaign WHERE IsActive = true GROUP BY Type" -o $ORG --json > /tmp/sf-extract/campaign-types.json

sf data query -q "SELECT UserId, COUNT(Id) cnt FROM LoginHistory WHERE LoginTime = LAST_N_DAYS:7 GROUP BY UserId" -o $ORG --json > /tmp/sf-extract/login-history.json
```

### Metric Reportability Queries (from gap analysis)
```bash
sf data query -q "SELECT COUNT(Id) cnt FROM ForecastingItem" -o $ORG --json > /tmp/sf-extract/forecasting-item-count.json 2>/dev/null || echo '{"result":{"records":[{"cnt":0}]}}' > /tmp/sf-extract/forecasting-item-count.json

sf data query -q "SELECT COUNT(Id) cnt FROM OpportunityLineItem" -o $ORG --json > /tmp/sf-extract/opp-line-item-count.json 2>/dev/null || echo '{"result":{"records":[{"cnt":0}]}}' > /tmp/sf-extract/opp-line-item-count.json

sf data query -q "SELECT COUNT(Id) cnt FROM Contract" -o $ORG --json > /tmp/sf-extract/contract-count.json 2>/dev/null || echo '{"result":{"records":[{"cnt":0}]}}' > /tmp/sf-extract/contract-count.json

sf data query -q "SELECT COUNT(Id) cnt FROM OpportunityFieldHistory WHERE Field = 'StageName'" -o $ORG --json > /tmp/sf-extract/stage-history-count.json 2>/dev/null || echo '{"result":{"records":[{"cnt":0}]}}' > /tmp/sf-extract/stage-history-count.json
```

### True Counts (fixes LIMIT 200 undercount)
```bash
sf data query -q "SELECT COUNT(Id) cnt FROM Dashboard" -o $ORG --json > /tmp/sf-extract/total-dashboard-count.json

sf data query -q "SELECT COUNT(Id) cnt FROM Report" -o $ORG --json > /tmp/sf-extract/total-report-count.json

sf data query -q "SELECT Name FROM Report WHERE FolderName != 'Private Reports' LIMIT 500" -o $ORG --json > /tmp/sf-extract/report-names.json
```

### Partner Check
```bash
sf data query -q "SELECT Id FROM PartnerRole LIMIT 1" -o $ORG --json > /tmp/sf-extract/partner-roles.json 2>/dev/null || echo '{"result":{"records":[]}}' > /tmp/sf-extract/partner-roles.json
```

## Step 5: Assemble JSON

Read all the temp JSON files. For each file, extract the records array from `result.records` (the sf CLI wraps results in a `result` object).

Build the payload matching this shape:
```json
{
  "customerId": "<CUSTOMER_ID>",
  "metadata": {
    "objects": { "Lead": { "fields": [...] }, ... },
    "stages": { "opportunityStages": [...], "leadStatuses": [...] },
    "users": [...],
    "flows": [...],
    "workflowRules": [...],
    "validationRules": [...],
    "apexTriggers": [...],
    "apexClasses": [...],
    "profiles": [...],
    "permissionSets": [...],
    "roles": [...],
    "reports": [...],
    "dashboards": [...],
    "connectedApps": [...],
    "namedCredentials": [...],
    "recordTypes": [...],
    "campaigns": [...],
    "installedPackages": [...],
    "territories": [...],
    "forecastingTypes": [...],
    "duplicateRules": [...],
    "reportSchedules": [...],
    "emailTemplates": [...],
    "taskAggregates": {},
    "eventPatterns": [...],
    "contentVersions": [...],
    "knowledgeArticles": [...]
  },
  "enhanced": {
    "arrAggregate": [...],
    "wonOppsByType": [...],
    "leadSourceDistribution": [...],
    "leadConversionCount": [...],
    "leadConversionBySource": [...],
    "campaignTypes": [...],
    "loginHistory": [...],
    "partnerRoles": [...],
    "reportNames": [...],
    "totalDashboardCount": [...],
    "totalReportCount": [...],
    "forecastingItemCount": [...],
    "oppLineItemCount": [...],
    "contractCount": [...],
    "stageHistoryCount": [...]
  }
}
```

Write this to `/tmp/sf-extract/payload.json`.

## Step 6: Upload

```bash
curl -X POST https://app.leanscale.com/api/salesforce/upload-json \
  -H "Content-Type: application/json" \
  -d @/tmp/sf-extract/payload.json
```

Use `http://localhost:3000` for local dev.

## Step 7: Report

Show the user:
- Number of signals extracted
- Number of intake questions pre-filled
- Any queries that failed (and what they affect)
- Link to the diagnostic intake form for the customer

## Error Handling

- If a query fails, log it and continue with an empty array for that data
- Optional queries (Territory2, ForecastingType, KnowledgeArticle, PartnerRole) are expected to fail in some orgs — this is normal
- If the upload fails, save the payload to a file the user can upload manually later
- If the customer slug lookup fails, ask the user to provide the customerId directly

## Tips

- Run `sf org display -o $ORG` to verify your connection before starting
- The full extraction takes 2-3 minutes depending on org size
- If you get API limit errors, wait a few minutes and retry
- The `/tmp/sf-extract/` directory is preserved so you can re-upload without re-querying
