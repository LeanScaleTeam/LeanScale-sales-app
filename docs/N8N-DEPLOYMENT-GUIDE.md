# n8n Workflow Deployment Guide

## Prerequisites

Before deploying the workflow, complete these setup steps:

---

## 1. Salesforce Custom Fields

Create these custom fields on the **Opportunity** object:

| Field Label | API Name | Type | Description |
|-------------|----------|------|-------------|
| Sales Portal Ready | `Sales_Portal_Ready__c` | Checkbox | Check when account is enriched and ready for portal |
| Sales Portal URL | `Sales_Portal_URL__c` | URL | Auto-populated with portal link |
| Sales Portal Created | `Sales_Portal_Created__c` | Checkbox | Auto-checked when portal is created |

Create this custom field on the **Account** object:

| Field Label | API Name | Type | Description |
|-------------|----------|------|-------------|
| Logo URL | `Logo_URL__c` | URL | Company logo from Clay enrichment |

### SFDC Workflow/Flow to Trigger n8n

Create a **Record-Triggered Flow** on Opportunity:
- **Object**: Opportunity
- **Trigger**: When record is created or updated
- **Condition**: `Sales_Portal_Ready__c = TRUE AND Sales_Portal_Created__c = FALSE`
- **Action**: HTTP Callout to n8n webhook URL

**Outbound Message Payload** (or Apex HTTP callout):
```json
{
  "Id": "{!Opportunity.Id}",
  "Name": "{!Opportunity.Name}",
  "Account": {
    "Id": "{!Opportunity.Account.Id}",
    "Name": "{!Opportunity.Account.Name}",
    "Website": "{!Opportunity.Account.Website}",
    "Industry": "{!Opportunity.Account.Industry}",
    "Logo_URL__c": "{!Opportunity.Account.Logo_URL__c}"
  },
  "Owner": {
    "Email": "{!Opportunity.Owner.Email}",
    "Name": "{!Opportunity.Owner.Name}"
  },
  "Sales_Portal_Ready__c": true
}
```

---

## 2. Clay Table Setup

### Create a New Clay Table

1. Go to [Clay.com](https://clay.com) → Create new table
2. Set up a **Webhook trigger** as the data source
3. Note the webhook URL (format: `https://api.clay.com/v3/sources/webhook/{WEBHOOK_ID}`)

### Configure Enrichment Columns

Add these enrichment columns:

| Column | Enrichment | Input |
|--------|------------|-------|
| `logo_url` | Company Logo (Clearbit/Apollo) | `domain` |
| `description` | Company Description | `domain` |
| `industry` | Industry Classification | `domain` |
| `employee_count` | Employee Count | `domain` |
| `linkedin_url` | Company LinkedIn | `domain` |

### Clay Response Webhook (Optional)

If you want Clay to push enriched data back:
1. Add a "Send Webhook" action column
2. Configure it to POST to a second n8n webhook
3. This allows async enrichment (recommended for production)

---

## 3. Environment Variables

Set these in your n8n instance:

```
CLAY_WEBHOOK_ID=your-clay-webhook-id
CLAY_API_KEY=your-clay-api-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

---

## 4. n8n Credentials

### Salesforce OAuth2

1. In n8n, go to **Credentials** → **New** → **Salesforce OAuth2 API**
2. Create a Connected App in Salesforce:
   - Setup → App Manager → New Connected App
   - Enable OAuth Settings
   - Callback URL: Your n8n OAuth callback
   - Scopes: `api`, `refresh_token`
3. Use Client ID and Secret in n8n

### Slack OAuth2

1. Create Slack app at [api.slack.com](https://api.slack.com)
2. Add OAuth scopes: `chat:write`, `chat:write.public`
3. Install to workspace
4. In n8n: **Credentials** → **New** → **Slack OAuth2 API**
5. Use Bot Token

---

## 5. Deploy the Workflow

### Import to n8n

1. Open n8n dashboard
2. Go to **Workflows** → **Import from File**
3. Select `n8n/customer-site-creation.json`
4. Click **Import**

### Configure Nodes

After import, update these nodes:

1. **When Webhook Received**: Copy the webhook URL for SFDC
2. **Enrich with Clay**: Verify environment variables are set
3. **Create Customer in Supabase**: Verify Supabase URL/key
4. **Update SFDC Opp**: Connect Salesforce credentials
5. **Slack Notification**: Connect Slack credentials, verify channel name

### Activate Workflow

1. Click **Active** toggle in top-right
2. Copy the webhook URL
3. Update SFDC Flow with the webhook URL

---

## 6. Testing

### Test with Sample Data

1. In n8n, click **Execute Workflow**
2. Use this test payload in the webhook node:

```json
{
  "Id": "006TEST123",
  "Name": "Test Company - Growth Package",
  "Account": {
    "Id": "001TEST123",
    "Name": "Test Company Inc",
    "Website": "https://testcompany.com",
    "Industry": "Technology"
  },
  "Owner": {
    "Email": "test@leanscale.team",
    "Name": "Test User"
  },
  "Sales_Portal_Ready__c": true
}
```

### Verify Results

Check:
- [ ] Customer created in Supabase `customers` table
- [ ] Slack message received in #sales-notifications
- [ ] Portal accessible at `https://clients.leanscale.team/c/{slug}`

---

## 7. Production Checklist

- [ ] SFDC custom fields created
- [ ] SFDC Flow/Trigger configured
- [ ] Clay table with enrichment set up
- [ ] n8n environment variables set
- [ ] Salesforce OAuth2 credentials connected
- [ ] Slack OAuth2 credentials connected
- [ ] Workflow imported and activated
- [ ] Test execution successful
- [ ] Webhook URL added to SFDC Flow

---

## Workflow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         n8n: Customer Site Creation                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐    ┌─────────────┐    ┌───────────┐    ┌─────────────────┐   │
│  │ Webhook  │───▶│ Check Ready │───▶│   Clay    │───▶│ Generate Slug   │   │
│  │ (SFDC)   │    │ (If node)   │    │ Enrich    │    │ & Prepare Data  │   │
│  └──────────┘    └──────┬──────┘    └───────────┘    └────────┬────────┘   │
│                         │                                      │            │
│                         │ FALSE                                │            │
│                         ▼                                      ▼            │
│                  ┌─────────────┐                      ┌─────────────────┐   │
│                  │ Slack:      │                      │ Create Customer │   │
│                  │ Not Ready   │                      │ in Supabase     │   │
│                  └─────────────┘                      └────────┬────────┘   │
│                                                                │            │
│                                                                ▼            │
│                                                       ┌─────────────────┐   │
│                                                       │ Update SFDC Opp │   │
│                                                       │ (Portal URL)    │   │
│                                                       └────────┬────────┘   │
│                                                                │            │
│                                                                ▼            │
│                                                       ┌─────────────────┐   │
│                                                       │ Slack: Success  │   │
│                                                       │ Notification    │   │
│                                                       └─────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Webhook not triggering
- Verify SFDC Flow is active
- Check SFDC debug logs for HTTP callout errors
- Ensure n8n workflow is activated

### Clay enrichment fails
- Check API key is valid
- Verify webhook ID is correct
- Check Clay table exists and has correct columns

### Supabase insert fails
- Verify service role key (not anon key)
- Check `customers` table schema matches payload
- Look for unique constraint violations (duplicate slug)

### SFDC update fails
- Re-authenticate Salesforce credentials
- Check user has edit permissions on Opportunity
- Verify field API names are correct

### Slack message not sending
- Verify bot is in the channel
- Check OAuth scopes include `chat:write`
- Verify channel name (with or without #)
