# Attribution Implementation

Build Tracking Infrastructure - Configure Attribution Model - Launch & Enablement

## Part 2: Build Tracking Infrastructure

### Step 1: Standardize UTM Taxonomy and Tracking URLs

**Step Overview:** Create a consistent UTM parameter taxonomy and tracking URL templates for all marketing campaigns. End state: Documented UTM taxonomy with templates and tracking URL builder for marketing team.

- Define UTM parameter standards: utm_source (channel), utm_medium (type), utm_campaign (campaign name), utm_content (variation)
- Create standardized naming conventions (lowercase, underscores, no spaces)
- Build tracking URL template spreadsheet or tool (e.g., Google Sheets UTM builder)
- Document taxonomy rules with examples for each channel (paid search, social, email, events)
- Review existing URLs and campaigns for compliance; flag inconsistencies for cleanup
- Train marketing team on UTM standards and URL builder usage

**UTM Taxonomy Template:**

| Parameter | Purpose | Values | Example |
|-----------|---------|--------|---------|
| utm_source | Channel/Platform | google, linkedin, email, direct | utm_source=linkedin |
| utm_medium | Marketing type | cpc, organic, email, webinar | utm_medium=cpc |
| utm_campaign | Campaign name | [year]_[quarter]_[name] | utm_campaign=2024_q1_product_launch |
| utm_content | Variation/CTA | cta_a, banner_1, sidebar | utm_content=cta_a |
| utm_term | Keyword (paid) | [keyword] | utm_term=crm_software |

**Naming Convention Rules:**
- Always lowercase
- Use underscores instead of spaces or dashes
- No special characters
- Consistent abbreviations (q1, q2 not Q1, quarter1)
- Date format: YYYY_QX or YYYY_MM

### Step 2: Configure Lead Source Normalization Rules

**Step Overview:** Build lead source normalization logic to consolidate inconsistent source values into clean categories. End state: Automated normalization rules that clean lead source data on ingest.

- Create master Lead Source taxonomy with 10-15 clean values (e.g., Paid Search, Organic Search, Referral, Event, Outbound)
- Map existing messy values to clean categories (e.g., "Google" + "google ads" + "adwords" → "Paid Search")
- Build normalization automation in CRM (Salesforce Flow, HubSpot Workflow, or Marketo Smart Campaign)
- Configure rules to run on lead creation and update
- Test normalization with sample records; verify correct categorization
- Document normalization logic for ongoing maintenance

**Lead Source Normalization Map:**

| Messy Values | Clean Value |
|--------------|-------------|
| Google, google ads, adwords, Google Ads, gclid | Paid Search |
| organic, seo, google organic | Organic Search |
| linkedin, LinkedIn, LI | Social - LinkedIn |
| facebook, fb, Facebook Ads | Social - Facebook |
| email, newsletter, nurture | Email Marketing |
| event, tradeshow, webinar | Events |
| referral, partner, customer referral | Referral |
| outbound, cold call, SDR | Outbound |
| direct, (none), blank | Direct/Unknown |
