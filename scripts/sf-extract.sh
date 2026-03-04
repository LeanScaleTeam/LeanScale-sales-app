#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# sf-extract.sh — Extract Salesforce metadata for LeanScale diagnostic
#
# Runs the same SOQL, Tooling, and Describe queries as the OAuth
# downloader, producing a JSON payload compatible with the
# /api/salesforce/upload-json endpoint.
#
# Prerequisites:
#   - Salesforce CLI v2 (sf): https://developer.salesforce.com/tools/salesforcecli
#   - jq: brew install jq (macOS) or apt-get install jq (Linux)
#
# Usage:
#   1. Authenticate to the customer org:
#      sf org login web --alias customer-org
#
#   2. Run the extraction:
#      ./scripts/sf-extract.sh customer-org
#
#   3. Upload the resulting JSON file on the diagnostic intake page
#      or via curl:
#      curl -X POST https://clients.leanscale.team/api/salesforce/upload-json \
#        -H "Content-Type: application/json" \
#        -d @sf-extract-output.json
#      (You'll need to add "customerId" to the JSON before uploading via curl)
# ──────────────────────────────────────────────────────────────────

set -euo pipefail

ORG="${1:-}"
if [ -z "$ORG" ]; then
  echo "Usage: $0 <org-alias>"
  echo ""
  echo "First authenticate:  sf org login web --alias customer-org"
  echo "Then extract:        $0 customer-org"
  exit 1
fi

# Verify sf CLI is installed
if ! command -v sf &>/dev/null; then
  echo "Error: Salesforce CLI (sf) not found."
  echo "Install: https://developer.salesforce.com/tools/salesforcecli"
  exit 1
fi

# Verify jq is installed
if ! command -v jq &>/dev/null; then
  echo "Error: jq not found."
  echo "Install: brew install jq (macOS) or apt-get install jq (Linux)"
  exit 1
fi

# Verify org is authenticated
if ! sf org display --target-org "$ORG" --json &>/dev/null; then
  echo "Error: Cannot connect to org '$ORG'."
  echo "Authenticate first: sf org login web --alias $ORG"
  exit 1
fi

echo "🔍 Extracting Salesforce metadata from org: $ORG"
echo "   This takes 1-2 minutes depending on org size..."
echo ""

TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

# ── Helpers ────────────────────────────────────────────────────────

# Run a SOQL query, return records array
soql() {
  local query="$1"
  local label="$2"
  local outfile="$TMPDIR/${label}.json"
  echo "   📊 $label"
  sf data query --query "$query" --target-org "$ORG" --json --result-format json 2>/dev/null \
    | jq '.result.records // []' > "$outfile" 2>/dev/null || echo "[]" > "$outfile"
}

# Run a Tooling API query, return records array
tooling() {
  local query="$1"
  local label="$2"
  local outfile="$TMPDIR/${label}.json"
  echo "   🔧 $label"
  sf data query --query "$query" --target-org "$ORG" --use-tooling-api --json --result-format json 2>/dev/null \
    | jq '.result.records // []' > "$outfile" 2>/dev/null || echo "[]" > "$outfile"
}

# Safe SOQL (returns [] on error — for optional features)
soql_safe() {
  local query="$1"
  local label="$2"
  local outfile="$TMPDIR/${label}.json"
  echo "   📊 $label (optional)"
  sf data query --query "$query" --target-org "$ORG" --json --result-format json 2>/dev/null \
    | jq '.result.records // []' > "$outfile" 2>/dev/null || echo "[]" > "$outfile"
}

# Safe Tooling (returns [] on error)
tooling_safe() {
  local query="$1"
  local label="$2"
  local outfile="$TMPDIR/${label}.json"
  echo "   🔧 $label (optional)"
  sf data query --query "$query" --target-org "$ORG" --use-tooling-api --json --result-format json 2>/dev/null \
    | jq '.result.records // []' > "$outfile" 2>/dev/null || echo "[]" > "$outfile"
}

# Get object describe
describe() {
  local obj="$1"
  local outfile="$TMPDIR/describe_${obj}.json"
  echo "   📦 Describe: $obj"
  sf sobject describe --sobject "$obj" --target-org "$ORG" --json 2>/dev/null \
    | jq '.result // {}' > "$outfile" 2>/dev/null || echo "{}" > "$outfile"
}

# ── Run all queries ────────────────────────────────────────────────

echo "── Object Describes ──"
describe "Lead" &
describe "Contact" &
describe "Account" &
describe "Opportunity" &
describe "Case" &
describe "Campaign" &
wait

echo ""
echo "── Core Queries ──"

# Stages
soql "SELECT MasterLabel, DefaultProbability, IsClosed, IsWon, SortOrder FROM OpportunityStage ORDER BY SortOrder" "oppStages" &
soql "SELECT MasterLabel, SortOrder FROM LeadStatus ORDER BY SortOrder" "leadStatuses" &

# Users
soql "SELECT Id, Name, IsActive, Profile.Name, UserRole.Name FROM User WHERE IsActive = true" "users" &

# Tooling queries (core)
tooling "SELECT Id, DefinitionId, Status, ProcessType, MasterLabel FROM Flow WHERE Status = 'Active'" "flows" &
tooling "SELECT Id, Name, TableEnumOrId FROM WorkflowRule" "workflowRules" &
tooling "SELECT Id, ValidationName, EntityDefinition.QualifiedApiName, Active FROM ValidationRule WHERE Active = true" "validationRules" &
tooling "SELECT Id, Name, Status, TableEnumOrId FROM ApexTrigger" "apexTriggers" &
tooling "SELECT Id, Name, LengthWithoutComments, NamespacePrefix FROM ApexClass WHERE NamespacePrefix = null" "apexClasses" &
tooling "SELECT Id, Name FROM Profile" "profiles" &
tooling "SELECT Id, Label, IsCustom FROM PermissionSet WHERE IsOwnedByProfile = false" "permissionSets" &
tooling "SELECT Id, Name FROM ConnectedApplication" "connectedApps" &
tooling "SELECT Id, MasterLabel FROM NamedCredential" "namedCredentials" &

# SOQL queries (core)
soql "SELECT Id, Name, DeveloperName, ParentRoleId FROM UserRole" "roles" &
soql "SELECT Id, Name, FolderName FROM Report LIMIT 200" "reports" &
soql "SELECT Id, Title, FolderName FROM Dashboard LIMIT 200" "dashboards" &
soql "SELECT Id, Name, DeveloperName, SobjectType, IsActive FROM RecordType WHERE IsActive = true" "recordTypes" &
wait

echo ""
echo "── v3 Expansion Queries ──"

soql "SELECT Id, Name, Type, IsActive, NumberOfContacts, NumberOfOpportunities, NumberOfLeads FROM Campaign WHERE IsActive = true LIMIT 200" "campaigns" &
tooling_safe "SELECT Id, SubscriberPackage.Name, SubscriberPackageVersion.Name FROM InstalledSubscriberPackage" "installedPackages" &
soql_safe "SELECT Id, State FROM Territory2Model WHERE State = 'Active'" "territories" &
soql_safe "SELECT Id, DeveloperName, IsActive FROM ForecastingType WHERE IsActive = true" "forecastingTypes" &
tooling_safe "SELECT Id, DeveloperName, SobjectType, IsActive FROM DuplicateRule WHERE IsActive = true" "duplicateRules" &
soql_safe "SELECT CronJobDetail.Name, CronExpression, State FROM CronTrigger WHERE CronJobDetail.JobType = '8' AND State = 'WAITING' LIMIT 100" "reportSchedules" &
soql_safe "SELECT COUNT(Id) cnt FROM EmailTemplate WHERE IsActive = true" "emailTemplates" &
wait

echo ""
echo "── Activity & Content Queries ──"

soql_safe "SELECT COUNT(Id) total, Status FROM Task WHERE CreatedDate > LAST_N_DAYS:90 GROUP BY Status" "taskAggregates" &
soql_safe "SELECT Subject, IsRecurrence, RecurrenceType FROM Event WHERE IsRecurrence = true AND ActivityDate > LAST_N_DAYS:90 LIMIT 500" "eventPatterns" &
soql_safe "SELECT Title, FileType, CreatedDate FROM ContentVersion WHERE IsLatest = true ORDER BY CreatedDate DESC LIMIT 100" "contentVersions" &
soql_safe "SELECT Id, Title FROM KnowledgeArticleVersion WHERE PublishStatus = 'Online' AND IsLatest = true LIMIT 100" "knowledgeArticles" &
soql_safe "SELECT COUNT(Id) cnt FROM CampaignMember" "campaignMembersCount" &
wait

# ── Assemble JSON payload ──────────────────────────────────────────

echo ""
echo "📦 Assembling payload..."

OUTPUT="sf-extract-output.json"

jq -n \
  --slurpfile lead "$TMPDIR/describe_Lead.json" \
  --slurpfile contact "$TMPDIR/describe_Contact.json" \
  --slurpfile account "$TMPDIR/describe_Account.json" \
  --slurpfile opportunity "$TMPDIR/describe_Opportunity.json" \
  --slurpfile caseObj "$TMPDIR/describe_Case.json" \
  --slurpfile campaign_desc "$TMPDIR/describe_Campaign.json" \
  --slurpfile oppStages "$TMPDIR/oppStages.json" \
  --slurpfile leadStatuses "$TMPDIR/leadStatuses.json" \
  --slurpfile users "$TMPDIR/users.json" \
  --slurpfile flows "$TMPDIR/flows.json" \
  --slurpfile workflowRules "$TMPDIR/workflowRules.json" \
  --slurpfile validationRules "$TMPDIR/validationRules.json" \
  --slurpfile apexTriggers "$TMPDIR/apexTriggers.json" \
  --slurpfile apexClasses "$TMPDIR/apexClasses.json" \
  --slurpfile profiles "$TMPDIR/profiles.json" \
  --slurpfile permissionSets "$TMPDIR/permissionSets.json" \
  --slurpfile roles "$TMPDIR/roles.json" \
  --slurpfile reports "$TMPDIR/reports.json" \
  --slurpfile dashboards "$TMPDIR/dashboards.json" \
  --slurpfile connectedApps "$TMPDIR/connectedApps.json" \
  --slurpfile namedCredentials "$TMPDIR/namedCredentials.json" \
  --slurpfile recordTypes "$TMPDIR/recordTypes.json" \
  --slurpfile campaigns "$TMPDIR/campaigns.json" \
  --slurpfile installedPackages "$TMPDIR/installedPackages.json" \
  --slurpfile territories "$TMPDIR/territories.json" \
  --slurpfile forecastingTypes "$TMPDIR/forecastingTypes.json" \
  --slurpfile duplicateRules "$TMPDIR/duplicateRules.json" \
  --slurpfile reportSchedules "$TMPDIR/reportSchedules.json" \
  --slurpfile emailTemplates "$TMPDIR/emailTemplates.json" \
  --slurpfile taskAggregates "$TMPDIR/taskAggregates.json" \
  --slurpfile eventPatterns "$TMPDIR/eventPatterns.json" \
  --slurpfile contentVersions "$TMPDIR/contentVersions.json" \
  --slurpfile knowledgeArticles "$TMPDIR/knowledgeArticles.json" \
  --slurpfile campaignMembersCount "$TMPDIR/campaignMembersCount.json" \
  '{
    metadata: {
      objects: {
        Lead: $lead[0],
        Contact: $contact[0],
        Account: $account[0],
        Opportunity: $opportunity[0],
        Case: $caseObj[0],
        Campaign: $campaign_desc[0]
      },
      stages: {
        opportunityStages: $oppStages[0],
        leadStatuses: $leadStatuses[0]
      },
      users: $users[0],
      flows: $flows[0],
      workflowRules: $workflowRules[0],
      validationRules: $validationRules[0],
      apexTriggers: $apexTriggers[0],
      apexClasses: $apexClasses[0],
      profiles: $profiles[0],
      permissionSets: $permissionSets[0],
      roles: $roles[0],
      reports: $reports[0],
      dashboards: $dashboards[0],
      connectedApps: $connectedApps[0],
      namedCredentials: $namedCredentials[0],
      recordTypes: $recordTypes[0],
      campaigns: $campaigns[0],
      installedPackages: $installedPackages[0],
      territories: $territories[0],
      forecastingTypes: $forecastingTypes[0],
      duplicateRules: $duplicateRules[0],
      reportSchedules: $reportSchedules[0],
      emailTemplates: $emailTemplates[0],
      taskAggregates: $taskAggregates[0],
      eventPatterns: $eventPatterns[0],
      contentVersions: $contentVersions[0],
      knowledgeArticles: $knowledgeArticles[0],
      campaignMembersCount: $campaignMembersCount[0]
    },
    enhanced: null
  }' > "$OUTPUT"

FILE_SIZE=$(du -h "$OUTPUT" | cut -f1)
SIGNAL_COUNT=$(jq '[.metadata | to_entries[] | select(.value != null and .value != [] and .value != {})] | length' "$OUTPUT")

echo ""
echo "✅ Extraction complete!"
echo "   Output: $OUTPUT ($FILE_SIZE)"
echo "   Data points: $SIGNAL_COUNT categories with data"
echo ""
echo "Next steps:"
echo "   1. Upload this file on the diagnostic intake page (drag & drop the .json file)"
echo "   2. Or via curl (replace CUSTOMER_ID):"
echo "      jq '. + {customerId: \"CUSTOMER_ID\"}' $OUTPUT | \\"
echo "        curl -X POST https://clients.leanscale.team/api/salesforce/upload-json \\"
echo "          -H 'Content-Type: application/json' -d @-"
