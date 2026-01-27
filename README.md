# LeanScale Sales Portal

A customer-facing sales portal for LeanScale, rebuilt from Coda as a Next.js application.

## Features

- **Why LeanScale?** - About, Resources, References, Services Catalog, Glossary
- **Try LeanScale** - Start Diagnostic, GTM Diagnostic views, Engagement Overview
- **Buy LeanScale** - Investor Perks, One-Time Projects, Calculator, Getting Started

## Per-Customer Configuration

Edit `data/customer-config.js` to customize for each customer:

```js
const customerConfig = {
  customerName: "Acme Corp",
  customerLogo: "/customer-logo.png",
  password: "acme2026",
  // ... other settings
};
```

## Deployment on Replit

1. Create a new Replit project
2. Import from GitHub (connect this repo)
3. Replit will auto-detect Next.js and configure
4. Click "Run" to start the dev server
5. For production: Deploy using Replit Deployments

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── components/        # Reusable UI components
│   ├── Layout.js      # Page layout with navigation
│   ├── Navigation.js  # Top navigation bar
│   └── HealthBar.js   # Health status visualization
├── data/              # Data files
│   ├── customer-config.js  # Per-customer settings
│   ├── diagnostic-data.js  # Diagnostic items
│   └── team.js        # Team member data
├── pages/             # Next.js pages
│   ├── why-leanscale/ # Why LeanScale section
│   ├── try-leanscale/ # Try LeanScale section
│   └── buy-leanscale/ # Buy LeanScale section
├── public/            # Static assets
└── styles/            # CSS styles
```

## Creating a New Customer Portal

1. Fork/duplicate this repo
2. Update `data/customer-config.js` with customer details
3. Add customer logo to `public/`
4. Deploy to Replit
5. Share the URL with the customer

## Tech Stack

- Next.js 14
- React 18
- CSS (no external UI library)
