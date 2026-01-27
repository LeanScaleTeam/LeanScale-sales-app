# LeanScale Sales Portal - Project Context

## Overview
Rebuilding the Coda-based customer sales portal as a web app deployed on Replit.

## Current Coda Portal
- URL: https://coda.io/@leanscale-j/copy-of-v4-customer-demo
- 43 pages of content
- Per-customer branding (logo, name in header)
- Password protected

## Architecture Decisions

### Deployment
- **Platform:** Replit
- **Approach:** Per-customer (each customer = separate Replit project)
- **URL format:** `customer-leanscale.replit.app` or custom domain

### Authentication
- Simple shared password per customer
- Auto-generated passwords acceptable

## Portal Structure

### Navigation (3 Main Sections)

#### 1. Why LeanScale?
- About Us
- Key Resources
- Customer References
- LeanScale Services Catalog
- GTM Ops Glossary

#### 2. Try LeanScale
- Start Diagnostic
- Services Catalog
- GTM Diagnostic Demo

#### 3. Buy LeanScale
- Investor Perks
- Engagement Calculator
- Getting Started

### Home Page Elements
- Hero banner with logo + tagline
- Company overview (tl;dr bullet points)
- Embedded YouTube video
- Embedded Google Slides (same deck for all customers)
- Quick Links navigation (3 columns)
- Customer testimonial card
- Promotional banner (Clay x LeanScale)

### Per-Customer Customizations
- Customer logo in top-left header
- Page title: "[Customer] | LeanScale"
- Customer-specific password

### Shared Content (Same for All)
- Google Slides deck
- YouTube videos
- All written content
- Services catalog
- Testimonials

## Brand Guidelines

### Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Black | #000000 | Primary background |
| Dark Purple/Eggplant | #301934 | Signature LeanScale color |
| Light Gray | #E9E9E7 | Light backgrounds |
| Lime Green | #E8FFCF | Primary accent |
| Pink/Mauve | #D9AFD0 | Secondary accent |
| Purple | #642585 | Buttons, CTAs |
| Off-White | #FFFBFF | Text on dark backgrounds |

### Typography
- **Primary:** Plus Jakarta Sans
- **Fallback:** Arial

### Brand Assets Location
`/Users/josephzaghloul/Documents/GitHub/LeanScale-Context/Brand Guidelines`

## Content Types
- Written content (markdown)
- Embedded YouTube videos
- Embedded Google Slides
- Screenshots/images
- Interactive calculators (Engagement Calculator)

## Technical Stack (Planned)
- Next.js or similar framework
- Markdown files for content
- Simple config file per customer
- Basic password middleware

## Next Steps
1. Gather remaining screenshots of inner pages
2. Build Next.js portal app with LeanScale branding
3. Create per-customer config system
4. Add password protection
5. Create markdown content templates for 3 sections
6. Write Replit deployment instructions

## Diagnostic System - Technical Details

### Two-App Architecture (Current Coda Setup)
1. **Demo App** (demo.leanscale.team)
   - Evergreen public-facing demo
   - Same link sent to all prospects after discovery call
   - Contains: Sales Page, Sample Diagnostic, Sample Engagement Overview, Services Catalog

2. **Diagnostic App** (per-customer)
   - Duplicated from template for each prospect
   - Contains: Sales Page, Real Diagnostic, Real Engagement Overview, Technician View
   - Published with custom URL: `PROSPECTNAME.coda.io`

### Diagnostic Data Inputs (Technician Views)
Three main input tables that feed all visualizations:

#### 1. Processes Table (63 items)
- **Fields:** Diagnostic Owner, Name (raw), Diagnostic Name (customizable), Health Status, Diagnostic Notes, Add to Engagement, Start Date, End Date
- **Health Status Options:** 🟢 Healthy, 🟡 Careful, 🔴 Warning, ⚫ Unable to Report

#### 2. Power10 Metrics Table (10 items)
- **Fields:** Able to Report, Status Against Plan, Current Performance, Diagnostic Notes
- **Metrics:** ARR, Bookings, Gross churn, Gross retention, MQL→Opportunity conversion, MQL production, Net retention, Opportunity/Deal CW cycle time, Opportunity/Deal CW conversion rate, Pipeline production
- **Health Status Options:** 🟢 Healthy, 🟡 Careful, 🔴 Warning, ⚫ Unable to Report

#### 3. Tools Table (17 items)
- **Fields:** Health Status, Diagnostic Notes
- **Health Status Options:** 🟢 Implemented Properly, 🟡 Not Fully Implemented, 🔴 Needed but Not Implemented, ⚫ Not Needed at Current Stage

#### 4. Custom Projects (up to 6)
- **Fields:** Diagnostic Name, Diagnostic Notes, Health Status
- For projects not in the standard catalog

### Diagnostic Outputs (Customer-Facing Views)
All views pull from the same source data:
- Power10 GTM Metric Health (cards with status indicators)
- GTM Tool Health (horizontal bar chart)
- Processes Overall Health (stacked bar chart with percentages)
- by GTM Outcome (grouped stacked bars + filterable table)
- by GTM Metric/Power10 (grouped stacked bars)
- by Function (grouped by: Cross Functional, Marketing, Sales, Customer Success, Partnerships)

### Engagement Overview
- **Gantt-style roadmap** showing recommended projects on timeline
- **Engagement Details table** with columns: Function, Diagnostic Name, Health Status, Low Hours, High Hours, GTM Outcome, Start Date, End Date, Add to Engagement checkbox
- Filtered based on "Add to Engagement" checkbox
- Color-coded by function

### Diagnostic Name vs Name (Raw)
- **Name (raw):** Fixed, pulled from Main Catalog
- **Diagnostic Name:** Customizable display name to match prospect's terminology
- Example: Catalog name "Growth Model" → Diagnostic Name "Growth Plan"

### Workflow for New Customer Diagnostic
1. After discovery call: Send prospect DEMO link
2. Conduct Reverse Demo Call
3. Duplicate Diagnostic App template
4. Turn off Auto Sync (freezes data for this customer)
5. Fill in Technician Views (Processes, Power10, Tools health statuses)
6. Add Custom Projects if needed
7. Set engagement dates and check "Add to Engagement" for selected projects
8. Verify charts/graphs populate correctly
9. Hide Sample Diagnostic, Unhide Real Diagnostic + Engagement Overview
10. Publish doc with prospect name as URL
11. Share final diagnostic link with prospect

### External Integrations
- **NDA:** DocuSign PowerForm (https://powerforms.docusign.net/...)
- **Intake Form:** Fillout form (https://forms.fillout.com/t/nqEbrHoL5Eus)
  - Steps: Tech Stack → Goals → Obstacles → Docs
  - Collects: Email, CRM selection, Marketing Automation Platform

### SOW Generation
- Uses diagnostic transcript + sop-maker skill
- Example output: /Users/josephzaghloul/Documents/GitHub/Skills-and-SOPs/SOWs/Amilia/Amilia-Statement-of-Work.md

## Loom Training Videos
- Demo vs Diagnostic App: https://www.loom.com/share/8bb3bc19df4e4edab69d80e48f570810
- Coda Doc Views: https://www.loom.com/share/a825195f4de044d6a7dc21bfcb534748
- How to Duplicate & Edit: https://www.loom.com/share/a873683e9f5c40b0b067e5fb8b2c420b
- GTM Diagnostic Explained: https://www.loom.com/share/aebd00efdf6b4adaa1276734cda6ef4f
- Diagnostic Name Explained: https://www.loom.com/share/a8fb57c5f6154852a4d00f2901b2be1f
- Custom Projects: https://www.loom.com/share/127aa97fc6734f24b6f471514674883b
- Conducting a Diagnostic: https://www.loom.com/share/f5bfa178bf4648e5a3a388d8a7fc043a
- Prepping Engagement Overview: https://www.loom.com/share/734d67a31f6d4f7fb6486c130a19de67
- Low & High Hours Edit: https://www.loom.com/share/5921f8ed84a84ae4a9cbd701ea379e7f

## Buy LeanScale Section - Complete Documentation

### Landing Page
- Hero banner with LeanScale logo + tagline: "Accelerate Your Go-To-Market with Top-Tier GTM Operations"
- 8 navigation buttons: Investor Perks, One-Time Projects, Clay x LeanScale, Security, Your Team, Available Start Dates, Engagement Calculator, Getting Started
- Embedded YouTube video: "LeanScale | GTM Ops for Hypergrowth Startups"

### Investor Perks
- Title: "Helping Portcos Scale Faster"
- Tagline: "Complimentary Support for Your Portcos from the GTM Ops team behind some of the fastest growing names in B2B tech"
- Video with Joseph presenting (GTM Pods slide, client logos: Clio, Mistral AI, Chaingage, Human, SpyCloud, Anrok)

### One-Time Projects
- Subtitle: "3 Months, $45,000 Each"
- 8 project cards:
  - Market Map (Available)
  - Automated Inbound Enrichment (Available)
  - Automated Outbound Outreach (Available)
  - Custom Enrichment Signals - Clay (Available)
  - CRM Migration (Available)
  - Quote-to-Cash (Available)
  - Lead Attribution Rebuild (Coming Q1 2026)
  - Lead Routing Rebuild (Coming Q1 2026)
- Expandable project detail sections

### Clay x LeanScale
- Wistia video embed (8:06)
- Highlighted: "LeanScale | Clay Enterprise Partner"
- Copy: "LeanScale is one of Clay's only accredited Enterprise Solution Partners. Work directly with Clay to implement Clay for the fastest-growing B2B startups."

### Security
- Privacy Policy sections: Data Collection, Use of Information, Sharing of Information, Data Security, Your Rights
- W9 Form (available upon request)
- Security Measures section

### Your Team
- Grouped by role (Architect section shown)
- Team member cards with:
  - Photo
  - Name (linked)
  - Experience bullets
  - Personal note/interests
- Sample team: Izzy Navin, Brian Reeves, John Attley, David Beitler (DMB), + more

### Available Start Dates
- Calendar view (month navigation)
- Shows availability per date:
  - "Waitlist Only" dates
  - Available dates (unmarked)
- Month/Today navigation buttons

### Engagement Calculator
- **Monthly Hours** (radio select):
  - 50 hours → $15,000/mo
  - 100 hours → $25,000/mo
  - 225 hours → $50,000/mo
- **Cancellation Notice**:
  - Month-to-Month (+7%)
  - Quarterly (Default, 0%)
  - Annual (-7%)
- **Payment Terms**:
  - Monthly (+7%)
  - Quarterly (Default, 0%)
  - Annually (-7%)
- **Summary**: Monthly Total + Hours display

### Getting Started (Contract Form)
- Form fields:
  - Your Name*, Company Name*, Billing Email*
  - Signer Name*, Signer Title*, Signer Email*
- Selections (pre-populated from calculator):
  - Monthly Hours (50/100/225)
  - Cancellation Notice (Month-to-Month/Quarterly/Annual)
  - Payment Terms (Monthly/Quarterly/Annually)
  - Start Date (real-time availability with spots remaining)
- Submit button

## Session Notes
- Screenshots over 8000px cause API errors - need to crop/resize
- Successfully captured: All sections complete
- Ready to build
