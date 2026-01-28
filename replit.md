# LeanScale Sales Portal

## Overview
A Next.js-based sales portal for LeanScale, a company providing fractional GTM Operations teams for B2B tech startups. The site features company information, resources, testimonials, a GTM diagnostic tool, and a comprehensive services catalog with 148 services organized by category and function.

## Project Architecture
- **Framework**: Next.js 14.0.4 with React 18
- **Pages**: Located in `/pages` directory (Next.js pages router)
- **Components**: Reusable components in `/components`
- **Data**: Static data files in `/data`
- **Styles**: Global styles in `/styles`
- **Public Assets**: Static assets in `/public`

## Running the Project
- **Development**: `npm run dev` (runs on port 5000)
- **Production Build**: `npm run build`
- **Production Start**: `npm start` (runs on port 5000)

## Key Pages
- `/` - Home page
- `/why-leanscale` - About the company and resources
- `/why-leanscale/services` - Complete services catalog (148 services)
- `/playbooks/[id]` - Dynamic playbook detail pages (68 detailed playbooks)
- `/try-leanscale` - GTM Diagnostic tool
- `/try-leanscale/start` - Diagnostic start page
- `/try-leanscale/diagnostic` - Diagnostic questionnaire
- `/buy-leanscale` - 3-step engagement wizard (plan selection, availability calendar, contact form)
- `/buy-leanscale/clay` - Clay x LeanScale partnership with Claybook pricing menu
- `/buy-leanscale/team` - Your Team page with 13 team members (5 Architects, 8 Engineers)
- `/buy-leanscale/one-time-projects` - One-time strategic projects linked to playbooks

## Services Catalog
- **68 Strategic Projects** (One-Time Projects)
- **11 Managed Services**
- **69 Tool Implementations**
- **148 Total Services**
- Organized by function: Cross Functional, Marketing, Sales, Customer Success, Partnerships
- All 68 strategic projects link to detailed playbooks with full implementation procedures

## Key Data Files
- `data/services-catalog.js` - All 148 services, 68 playbook links, function categories
- `data/playbook-content.js` - Detailed content for 68 playbooks (1MB+, imported from GitHub)
- `data/diagnostic-data.js` - GTM diagnostic questions and scoring
- `data/all-playbooks.json` - Raw playbook data fetched from GitHub
- `data/availability-calendar.js` - 26 cohorts for 2026 (every 2 weeks starting Mondays)
- `data/team.js` - 13 team members (5 Architects, 8 Engineers)
- `data/customer-config.js` - Customer-specific config (assignedTeam array for highlighting)
- `scripts/fetch-playbooks.js` - Script to fetch playbooks from GitHub API
- `scripts/generate-playbook-content.js` - Script to generate playbook-content.js from raw data

## Claybook Pricing (on /buy-leanscale/clay)
- 10 fixed-price Claybook implementations ($2,500 - $7,500)
- 3 bundles: GTM Foundation ($15k), Full Outbound Stack ($20k), Complete GTM Infrastructure ($35k)
- 5 add-ons: Additional data sources, vertical enrichment, extended scope, maintenance, training

## Playbook Content Structure
Each playbook includes:
- **Definition**: whatItIs, whatItIsNot
- **ICP Value Proposition**: painSolves, outcome, whoOwns
- **Implementation**: Full markdown procedure with phases and steps
- **Dependencies**: Required inputs and prerequisites
- **Pitfalls**: Common mistakes and how to avoid them

## Configuration
- Port 5000 is used for both development and production
- Host is bound to 0.0.0.0 for Replit compatibility
