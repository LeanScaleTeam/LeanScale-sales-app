# API Hardening Guide — LeanScale Sales App

**Date:** 2026-02-11  
**Branch:** `feature/sales-diagnostic-sow-flow`  
**Status:** Spec — ready for implementation

---

## Table of Contents

1. [Authentication Middleware](#1-authentication-middleware)
2. [Input Validation](#2-input-validation)
3. [Rate Limiting](#3-rate-limiting)
4. [Schema Consolidation](#4-schema-consolidation)
5. [Foreign Key Fixes](#5-foreign-key-fixes)
6. [Error Handling](#6-error-handling)
7. [camelCase/snake_case Normalization](#7-camelcasesnake_case-normalization)
8. [Unused Code Cleanup](#8-unused-code-cleanup)

---

## 1. Authentication Middleware

**Priority: 🔴 Critical**

### Current State

- **No authentication middleware exists.** All API routes are publicly accessible.
- The `diagnostics/[type].js` endpoint has a `validateCustomerAccess` function that checks referer headers and cookie-based customer context — easily bypassed.
- Admin endpoints (`/api/admin/*`) have zero auth checks.
- The `service-catalog` POST (create) endpoint has no auth — anyone can add services.
- All write operations use `supabaseAdmin` (service_role key) server-side, so RLS provides no protection.

### Proposed Change

Create a reusable `withAuth` higher-order function wrapping Next.js API handlers with three access levels:

| Level | Use Case | Mechanism |
|-------|----------|-----------|
| `public` | Service catalog GET, availability | No auth required |
| `customer` | Diagnostic GET/PUT, SOW read | Customer session cookie + slug match |
| `admin` | SOW create/export, service catalog CRUD, all writes | Bearer token or session with admin role |

### Code: `lib/middleware/withAuth.js`

```js
import { getCustomerServer } from '../getCustomer';

/**
 * Auth levels:
 *  - 'public'    → no check
 *  - 'customer'  → valid customer session required
 *  - 'admin'     → ADMIN_API_KEY header or admin session
 */
export function withAuth(handler, { level = 'admin' } = {}) {
  return async (req, res) => {
    if (level === 'public') {
      return handler(req, res);
    }

    // --- Customer-level auth ---
    if (level === 'customer') {
      try {
        const customer = await getCustomerServer({ req, query: req.query });
        if (!customer) {
          return res.status(401).json({
            success: false,
            error: { code: 'AUTH_REQUIRED', message: 'Customer session required' },
          });
        }
        req.customer = customer;
        return handler(req, res);
      } catch {
        return res.status(401).json({
          success: false,
          error: { code: 'AUTH_FAILED', message: 'Invalid customer session' },
        });
      }
    }

    // --- Admin-level auth ---
    const apiKey = req.headers['x-api-key'] || req.headers.authorization?.replace('Bearer ', '');
    if (apiKey && apiKey === process.env.ADMIN_API_KEY) {
      req.isAdmin = true;
      return handler(req, res);
    }

    // Fallback: check for admin session cookie (future Supabase Auth integration)
    // For now, reject
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Admin access required' },
    });
  };
}
```

### Usage in API Routes

```js
// pages/api/service-catalog/index.js
import { withAuth } from '../../../lib/middleware/withAuth';

async function handler(req, res) {
  if (req.method === 'GET') { /* ... */ }
  if (req.method === 'POST') { /* ... */ }
}

// GET is public, POST requires admin — split or use method check:
export default withAuth(handler, { level: 'public' }); // then check admin inside POST

// Better: per-method auth
export default async function routeHandler(req, res) {
  if (req.method === 'GET') return publicHandler(req, res);
  return withAuth(adminHandler, { level: 'admin' })(req, res);
}
```

### Route-Level Auth Map

| Endpoint | GET | POST | PUT | DELETE |
|----------|-----|------|-----|--------|
| `/api/diagnostics/[type]` | customer | — | customer | — |
| `/api/sow` | admin | admin | — | — |
| `/api/sow/from-diagnostic` | — | admin | — | — |
| `/api/sow/[id]` | admin | — | admin | admin |
| `/api/sow/[id]/sections` | admin | admin | admin | — |
| `/api/sow/[id]/export` | — | admin | — | — |
| `/api/service-catalog` | public | admin | — | — |
| `/api/service-catalog/[id]` | public | — | admin | admin |
| `/api/customer` | public | — | — | — |

---

## 2. Input Validation

**Priority: 🔴 Critical**

### Current State

- Validation is ad-hoc `if (!field)` checks scattered across handlers.
- No schema validation library is used.
- The `from-diagnostic` endpoint validates `sowType` against an array but doesn't validate UUID format for `customerId` or `diagnosticResultId`.
- The `sections` POST accepts arbitrary JSONB in `deliverables` and `diagnosticItems` with no shape validation.
- Service catalog POST accepts `req.body` directly with zero validation.

### Proposed Change

Add `zod` as a dependency and define schemas for all request bodies/query params.

```bash
npm install zod
```

### Code: `lib/validation/schemas.js`

```js
import { z } from 'zod';

// ============================================
// Shared primitives
// ============================================
const uuid = z.string().uuid();
const diagnosticType = z.enum(['gtm', 'clay', 'cpq']);
const sowType = z.enum(['clay', 'q2c', 'embedded', 'custom']);
const sowStatus = z.enum(['draft', 'review', 'sent', 'accepted', 'declined']);
const processStatus = z.enum(['healthy', 'careful', 'warning', 'unable']);

// ============================================
// Diagnostic schemas
// ============================================
export const diagnosticProcess = z.object({
  name: z.string().min(1).max(200),
  status: processStatus,
  addToEngagement: z.boolean().optional().default(false),
  function: z.string().optional(),
  outcome: z.string().optional(),
  metric: z.string().optional(),
  serviceId: z.string().optional(),
  serviceType: z.enum(['strategic', 'managed']).optional(),
});

export const diagnosticGetQuery = z.object({
  type: diagnosticType,
  customerId: uuid,
});

export const diagnosticPutBody = z.object({
  customerId: uuid,
  processes: z.array(diagnosticProcess).min(1).max(200),
  tools: z.array(z.object({
    name: z.string(),
    category: z.string().optional(),
    status: z.string().optional(),
  })).optional(),
  createdBy: z.string().optional(),
});

// ============================================
// SOW schemas
// ============================================
export const sowFromDiagnosticBody = z.object({
  customerId: uuid,
  diagnosticResultId: uuid,
  diagnosticType: diagnosticType.optional().default('gtm'),
  customerName: z.string().max(200).optional(),
  sowType: sowType,
  createdBy: z.string().max(100).optional(),
});

export const sowCreateBody = z.object({
  customerId: uuid,
  title: z.string().min(1).max(500),
  sowType: sowType,
  content: z.record(z.unknown()).optional().default({}),
  createdBy: z.string().max(100).optional(),
});

export const sowUpdateBody = z.object({
  title: z.string().min(1).max(500).optional(),
  status: sowStatus.optional(),
  content: z.record(z.unknown()).optional(),
  total_hours: z.number().nonnegative().optional(),
  total_investment: z.number().nonnegative().optional(),
  start_date: z.string().date().optional().nullable(),
  end_date: z.string().date().optional().nullable(),
});

// ============================================
// SOW Section schemas
// ============================================
export const sectionCreateBody = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  deliverables: z.array(z.object({
    text: z.string(),
    completed: z.boolean().optional(),
  })).optional().default([]),
  hours: z.number().nonnegative().optional(),
  rate: z.number().nonnegative().optional(),
  startDate: z.string().date().optional().nullable(),
  endDate: z.string().date().optional().nullable(),
  diagnosticItems: z.array(z.string()).optional().default([]),
  sortOrder: z.number().int().nonnegative().optional(),
  service_catalog_id: uuid.optional().nullable(),
});

export const sectionReorderBody = z.object({
  ordering: z.array(z.object({
    id: uuid,
    sortOrder: z.number().int().nonnegative(),
  })).min(1),
});

// ============================================
// SOW Export schemas
// ============================================
export const sowExportBody = z.object({
  exportedBy: z.string().max(100).optional(),
  customerName: z.string().max(200).optional(),
});

// ============================================
// Service Catalog schemas
// ============================================
export const serviceCatalogCreateBody = z.object({
  name: z.string().min(1).max(300),
  category: z.string().max(100).optional(),
  subcategory: z.string().max(100).optional(),
  description: z.string().max(5000).optional(),
  deliverables: z.array(z.string()).optional().default([]),
  hours_low: z.number().nonnegative().optional(),
  hours_high: z.number().nonnegative().optional(),
  rate: z.number().nonnegative().optional(),
  active: z.boolean().optional().default(true),
});

export const serviceCatalogQuery = z.object({
  category: z.string().optional(),
  active: z.enum(['true', 'false']).optional(),
  search: z.string().max(200).optional(),
});
```

### Code: `lib/middleware/withValidation.js`

```js
/**
 * Validates req.body or req.query against a Zod schema.
 * Returns parsed data on success, sends 400 on failure.
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(source === 'body' ? req.body : req.query);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request',
          details: result.error.issues.map(i => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
      });
    }
    // Replace with parsed (coerced + defaulted) data
    if (source === 'body') req.body = result.data;
    else req.validatedQuery = result.data;
    return next ? next() : undefined;
  };
}

/**
 * HOF version for direct use in handlers
 */
export function validateBody(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    return { success: false, error: result.error };
  }
  return { success: true, data: result.data };
}
```

### Example: Updated `from-diagnostic.js`

```js
import { withAuth } from '../../../lib/middleware/withAuth';
import { validateBody } from '../../../lib/middleware/withValidation';
import { sowFromDiagnosticBody } from '../../../lib/validation/schemas';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { code: 'METHOD_NOT_ALLOWED' } });
  }

  const parsed = validateBody(sowFromDiagnosticBody, req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        details: parsed.error.issues,
      },
    });
  }

  const { customerId, diagnosticResultId, diagnosticType, customerName, sowType, createdBy } = parsed.data;
  // ... rest of handler
}

export default withAuth(handler, { level: 'admin' });
```

---

## 3. Rate Limiting

**Priority: 🟡 Major**

### Current State

- Zero rate limiting on any endpoint.
- SOW export (`/api/sow/[id]/export`) generates PDFs server-side — CPU-intensive, trivially abusable.
- SOW generation (`/api/sow/generate`) calls external n8n webhook + Slack — could rack up costs.
- The `from-diagnostic` endpoint does multiple DB writes per call.

### Proposed Change

Use an in-memory rate limiter for the Replit deployment (single-instance). If scaling to multi-instance, swap to Redis-backed.

```bash
npm install lru-cache
```

### Code: `lib/middleware/rateLimit.js`

```js
import { LRUCache } from 'lru-cache';

/**
 * Creates a rate limiter middleware.
 * @param {Object} opts
 * @param {number} opts.limit       - Max requests per window
 * @param {number} opts.windowMs    - Window in milliseconds
 * @param {function} opts.keyFn     - Extract key from req (default: IP)
 */
export function rateLimit({ limit = 10, windowMs = 60_000, keyFn } = {}) {
  const cache = new LRUCache({
    max: 5000,
    ttl: windowMs,
  });

  return (req, res) => {
    const key = keyFn ? keyFn(req) : getClientIp(req);
    const current = cache.get(key) || 0;

    if (current >= limit) {
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: `Too many requests. Limit: ${limit} per ${windowMs / 1000}s`,
        },
      });
    }

    cache.set(key, current + 1);
    return null; // proceed
  };
}

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.socket?.remoteAddress
    || 'unknown';
}
```

### Rate Limit Schedule

| Endpoint | Limit | Window | Key |
|----------|-------|--------|-----|
| `POST /api/sow/[id]/export` | 5 | 60s | IP |
| `POST /api/sow/generate` | 3 | 60s | IP |
| `POST /api/sow/from-diagnostic` | 10 | 60s | IP |
| `PUT /api/diagnostics/[type]` | 30 | 60s | IP + customerId |
| `POST /api/service-catalog` | 20 | 60s | IP |

### Usage in Export Endpoint

```js
import { rateLimit } from '../../../../lib/middleware/rateLimit';

const limiter = rateLimit({ limit: 5, windowMs: 60_000 });

export default async function handler(req, res) {
  const blocked = limiter(req, res);
  if (blocked) return; // already sent 429

  // ... existing handler
}
```

---

## 4. Schema Consolidation

**Priority: 🟡 Major**

### Current State

Four overlapping SQL files that must be run in a specific order:

| File | Tables | Issues |
|------|--------|--------|
| `schema.sql` | customers, availability_dates, form_submissions | Base file, includes sample data |
| `sow-schema.sql` | sows, diagnostic_snapshots | Original SOW design, `diagnostic_snapshots` now unused |
| `sow-redesign-schema.sql` | sows (re-create), diagnostic_results, diagnostic_notes, sow_sections, sow_versions + ALTER sows | Duplicates sows table, duplicates diagnostic tables |
| `diagnostic-results-schema.sql` | diagnostic_results, diagnostic_notes | Exact duplicate of what's in sow-redesign-schema.sql |

Problems:
- `diagnostic_snapshots` table from `sow-schema.sql` is dead (superseded by `sows.diagnostic_snapshot` JSONB column).
- `diagnostic_results` is defined in **two** files with conflicting FK constraints (one has `REFERENCES customers(id)`, the other doesn't).
- Running files out of order causes errors.
- No migration versioning — just raw SQL files.

### Proposed Change

Create a single canonical migration file and archive the old files.

### File: `supabase/migrations/001_consolidated_schema.sql`

```sql
-- LeanScale Sales App — Consolidated Schema
-- Version: 001
-- Date: 2026-02-11
-- Replaces: schema.sql, sow-schema.sql, sow-redesign-schema.sql, diagnostic-results-schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- CUSTOMERS
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  password TEXT NOT NULL,
  nda_link TEXT,
  intake_form_link TEXT,
  assigned_team TEXT[] DEFAULT '{}',
  youtube_video_id TEXT,
  google_slides_embed_url TEXT,
  is_demo BOOLEAN DEFAULT FALSE,
  diagnostic_type TEXT DEFAULT 'gtm' CHECK (diagnostic_type IN ('gtm', 'clay', 'cpq')),
  customer_type TEXT DEFAULT 'active' CHECK (customer_type IN ('prospect', 'active', 'churned')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_slug ON customers(slug);

-- ============================================
-- AVAILABILITY DATES
-- ============================================
CREATE TABLE IF NOT EXISTS availability_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  cohort_number INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'limited', 'waitlist', 'sold_out')),
  spots_total INTEGER DEFAULT 4,
  spots_left INTEGER DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FORM SUBMISSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  form_type TEXT NOT NULL CHECK (form_type IN ('getting_started', 'diagnostic_intake', 'contact')),
  data JSONB NOT NULL,
  slack_notified BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_customer ON form_submissions(customer_id);

-- ============================================
-- DIAGNOSTIC RESULTS
-- ============================================
CREATE TABLE IF NOT EXISTS diagnostic_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  diagnostic_type TEXT NOT NULL CHECK (diagnostic_type IN ('gtm', 'clay', 'cpq')),
  processes JSONB NOT NULL DEFAULT '[]',
  tools JSONB DEFAULT '[]',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, diagnostic_type)
);

CREATE INDEX IF NOT EXISTS idx_diagnostic_results_customer ON diagnostic_results(customer_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_results_type ON diagnostic_results(diagnostic_type);

-- ============================================
-- DIAGNOSTIC NOTES
-- ============================================
CREATE TABLE IF NOT EXISTS diagnostic_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diagnostic_result_id UUID NOT NULL REFERENCES diagnostic_results(id) ON DELETE CASCADE,
  process_name TEXT NOT NULL,
  note TEXT NOT NULL,
  author TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diagnostic_notes_result ON diagnostic_notes(diagnostic_result_id);

-- ============================================
-- SOWS
-- ============================================
CREATE TABLE IF NOT EXISTS sows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'sent', 'accepted', 'declined')),
  sow_type TEXT NOT NULL DEFAULT 'custom'
    CHECK (sow_type IN ('clay', 'q2c', 'embedded', 'custom')),
  intake_submission_id UUID REFERENCES form_submissions(id) ON DELETE SET NULL,
  transcript_text TEXT,
  diagnostic_snapshot JSONB,
  content JSONB NOT NULL DEFAULT '{}',
  generated_at TIMESTAMPTZ,
  created_by TEXT,
  -- Diagnostic links
  diagnostic_result_ids UUID[] DEFAULT '{}',
  overall_rating TEXT,
  -- Totals (computed from sections)
  total_hours NUMERIC(10,2),
  total_investment NUMERIC(10,2),
  start_date DATE,
  end_date DATE,
  -- Teamwork integration
  teamwork_project_id INTEGER,
  teamwork_project_url TEXT,
  -- Versioning
  current_version INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sows_customer ON sows(customer_id);
CREATE INDEX IF NOT EXISTS idx_sows_status ON sows(status);

-- ============================================
-- SOW SECTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS sow_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sow_id UUID NOT NULL REFERENCES sows(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  deliverables JSONB DEFAULT '[]',
  hours NUMERIC(10,2),
  rate NUMERIC(10,2),
  start_date DATE,
  end_date DATE,
  diagnostic_items JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  service_catalog_id UUID,  -- FK added in section 5
  teamwork_milestone_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sow_sections_sow ON sow_sections(sow_id);

-- ============================================
-- SOW VERSIONS
-- ============================================
CREATE TABLE IF NOT EXISTS sow_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sow_id UUID NOT NULL REFERENCES sows(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content_snapshot JSONB NOT NULL,
  sections_snapshot JSONB NOT NULL,
  exported_by TEXT,
  exported_at TIMESTAMPTZ DEFAULT NOW(),
  pdf_url TEXT,
  UNIQUE(sow_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_sow_versions_sow ON sow_versions(sow_id);

-- ============================================
-- SERVICE CATALOG
-- ============================================
CREATE TABLE IF NOT EXISTS service_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  description TEXT,
  deliverables JSONB DEFAULT '[]',
  hours_low NUMERIC(10,2),
  hours_high NUMERIC(10,2),
  rate NUMERIC(10,2) DEFAULT 200.00,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- UPDATED_AT TRIGGERS (all tables)
-- ============================================
DO $$ 
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'customers', 'availability_dates', 'diagnostic_results',
    'diagnostic_notes', 'sows', 'sow_sections', 'service_catalog'
  ])
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS update_%s_updated_at ON %I;
       CREATE TRIGGER update_%s_updated_at
         BEFORE UPDATE ON %I
         FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      tbl, tbl, tbl, tbl
    );
  END LOOP;
END $$;

-- ============================================
-- RLS POLICIES
-- ============================================
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'customers', 'availability_dates', 'form_submissions',
    'diagnostic_results', 'diagnostic_notes',
    'sows', 'sow_sections', 'sow_versions', 'service_catalog'
  ])
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format(
      'DROP POLICY IF EXISTS "service_role_full_%s" ON %I;
       CREATE POLICY "service_role_full_%s" ON %I FOR ALL TO service_role USING (true) WITH CHECK (true);',
      tbl, tbl, tbl, tbl
    );
  END LOOP;
END $$;

-- Public read on customers, availability, service_catalog
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY['customers', 'availability_dates', 'service_catalog'])
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS "public_read_%s" ON %I;
       CREATE POLICY "public_read_%s" ON %I FOR SELECT TO anon, authenticated USING (true);',
      tbl, tbl, tbl, tbl
    );
  END LOOP;
END $$;
```

### Migration Plan

1. Create `supabase/migrations/001_consolidated_schema.sql` (above).
2. Move old files to `supabase/archive/`:
   - `schema.sql` → `archive/schema.sql`
   - `sow-schema.sql` → `archive/sow-schema.sql`
   - `sow-redesign-schema.sql` → `archive/sow-redesign-schema.sql`
   - `diagnostic-results-schema.sql` → `archive/diagnostic-results-schema.sql`
3. Drop the `diagnostic_snapshots` table (see section 8).
4. For existing databases, create `supabase/migrations/002_drop_legacy.sql`:

```sql
-- Drop orphaned legacy table
DROP TABLE IF EXISTS diagnostic_snapshots;
```

---

## 5. Foreign Key Fixes

**Priority: 🟡 Major**

### Current State

| Relationship | Expected FK | Actual |
|---|---|---|
| `diagnostic_results.customer_id` → `customers.id` | `REFERENCES customers(id) ON DELETE CASCADE` | ✅ in `diagnostic-results-schema.sql`, ❌ **missing** in `sow-redesign-schema.sql` (just `UUID NOT NULL`) |
| `sows.customer_id` → `customers.id` | `REFERENCES customers(id) ON DELETE SET NULL` | ✅ in `sow-schema.sql`, ❌ missing in `sow-redesign-schema.sql` |
| `sow_sections.service_catalog_id` → `service_catalog.id` | Should reference | ❌ Column doesn't exist in schema (only passed in code as `service_catalog_id`) |
| `sows.diagnostic_result_ids` → `diagnostic_results.id` | Array FK not possible in PostgreSQL | ❌ Stored as `UUID[]` — no referential integrity |

### Proposed Changes

#### Migration: `supabase/migrations/003_foreign_key_fixes.sql`

```sql
-- 1. Ensure diagnostic_results.customer_id FK exists
-- (safe: no-ops if already present via diagnostic-results-schema.sql)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'diagnostic_results_customer_id_fkey'
      AND table_name = 'diagnostic_results'
  ) THEN
    ALTER TABLE diagnostic_results
      ADD CONSTRAINT diagnostic_results_customer_id_fkey
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 2. Ensure sows.customer_id FK exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'sows_customer_id_fkey'
      AND table_name = 'sows'
  ) THEN
    ALTER TABLE sows
      ADD CONSTRAINT sows_customer_id_fkey
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 3. Add service_catalog_id FK to sow_sections
ALTER TABLE sow_sections
  ADD COLUMN IF NOT EXISTS service_catalog_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'sow_sections_service_catalog_id_fkey'
  ) THEN
    ALTER TABLE sow_sections
      ADD CONSTRAINT sow_sections_service_catalog_id_fkey
      FOREIGN KEY (service_catalog_id) REFERENCES service_catalog(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 4. Replace diagnostic_result_ids UUID[] with a junction table for referential integrity
CREATE TABLE IF NOT EXISTS sow_diagnostic_links (
  sow_id UUID NOT NULL REFERENCES sows(id) ON DELETE CASCADE,
  diagnostic_result_id UUID NOT NULL REFERENCES diagnostic_results(id) ON DELETE CASCADE,
  PRIMARY KEY (sow_id, diagnostic_result_id)
);
```

### Code Change for Junction Table

In `lib/sow.js`, after creating a SOW with diagnostic link:

```js
// Replace: await updateSow(sow.id, { diagnostic_result_ids: [diagnosticResultId] });
// With:
await supabaseAdmin
  .from('sow_diagnostic_links')
  .insert({ sow_id: sow.id, diagnostic_result_id: diagnosticResultId });
```

Keep `diagnostic_result_ids` column temporarily for backward compatibility; deprecate over 2 sprints.

---

## 6. Error Handling

**Priority: 🟡 Major**

### Current State

- Response format is inconsistent: some routes return `{ success, error: string }`, others return `{ success, error: string, data: null }`.
- All 500 errors log to `console.error` and return generic "Internal server error" — no error codes, no correlation IDs.
- No React error boundaries — a rendering crash kills the entire page.
- PDF export can fail silently if `@react-pdf/renderer` receives bad data.

### Proposed Change

#### Standardized Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": [],
    "requestId": "req_abc123"
  }
}
```

#### Error Code Catalog

| Code | HTTP | Meaning |
|------|------|---------|
| `VALIDATION_ERROR` | 400 | Request body/query failed schema validation |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `METHOD_NOT_ALLOWED` | 405 | Wrong HTTP method |
| `AUTH_REQUIRED` | 401 | No credentials provided |
| `FORBIDDEN` | 403 | Credentials insufficient |
| `RATE_LIMITED` | 429 | Too many requests |
| `CONFLICT` | 409 | Duplicate or state conflict |
| `PDF_GENERATION_FAILED` | 500 | react-pdf rendering error |
| `EXTERNAL_SERVICE_ERROR` | 502 | n8n, Teamwork, or Slack call failed |
| `INTERNAL_ERROR` | 500 | Unhandled server error |

#### Code: `lib/errors.js`

```js
import { randomBytes } from 'crypto';

export class AppError extends Error {
  constructor(code, message, status = 500, details = null) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function sendError(res, error) {
  const requestId = `req_${randomBytes(6).toString('hex')}`;

  if (error instanceof AppError) {
    return res.status(error.status).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        requestId,
      },
    });
  }

  // Unhandled error — log full stack, return generic
  console.error(`[${requestId}]`, error);
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      requestId,
    },
  });
}

// Convenience constructors
export const Errors = {
  notFound: (resource) => new AppError('NOT_FOUND', `${resource} not found`, 404),
  validation: (details) => new AppError('VALIDATION_ERROR', 'Invalid request', 400, details),
  forbidden: () => new AppError('FORBIDDEN', 'Access denied', 403),
  conflict: (msg) => new AppError('CONFLICT', msg, 409),
  pdfFailed: (msg) => new AppError('PDF_GENERATION_FAILED', msg || 'PDF generation failed', 500),
  external: (service) => new AppError('EXTERNAL_SERVICE_ERROR', `${service} request failed`, 502),
};
```

#### React Error Boundary

```jsx
// components/ErrorBoundary.js
import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page or contact support.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Wrap in `_app.js`:

```jsx
<ErrorBoundary>
  <CustomerProvider>
    <Component {...pageProps} />
  </CustomerProvider>
</ErrorBoundary>
```

---

## 7. camelCase/snake_case Normalization

**Priority: 🟢 Minor**

### Current State

The codebase inconsistently maps between JS camelCase and Postgres snake_case:

| Location | Example | Issue |
|----------|---------|-------|
| `from-diagnostic.js` body | `customerId`, `diagnosticResultId` | ✅ camelCase in, converted for DB |
| `sections.js` POST body | `startDate` → mapped to `start_date` in `createSection` | ✅ but manual |
| `sections.js` POST body | `service_catalog_id` | ❌ Already snake_case in the request |
| `sow-redesign-schema.sql` | `diagnostic_result_ids`, `overall_rating` | Direct snake_case in `updateSow` call |
| Supabase query results | All snake_case | Returned directly to client — client code uses `sow.customer_id` |

### Proposed Change

Create a mapping utility and apply it at the API boundary.

### Code: `lib/caseMapper.js`

```js
/**
 * Converts object keys between camelCase and snake_case.
 * Handles nested objects and arrays.
 */
export function toSnakeCase(obj) {
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  if (obj === null || typeof obj !== 'object') return obj;
  // Skip Date objects, Buffers, etc.
  if (obj.constructor !== Object) return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`),
      toSnakeCase(v),
    ])
  );
}

export function toCamelCase(obj) {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj.constructor !== Object) return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
      toCamelCase(v),
    ])
  );
}
```

### Application Strategy

1. **API input** (req.body) → `toSnakeCase()` before DB write
2. **API output** (DB rows) → `toCamelCase()` before `res.json()`
3. Apply at the `lib/` layer, not in each route handler

Example in `lib/sow.js`:

```js
import { toSnakeCase, toCamelCase } from './caseMapper';

export async function createSow(input) {
  const row = toSnakeCase(input);
  const { data, error } = await supabaseAdmin
    .from('sows')
    .insert(row)
    .select()
    .single();
  return data ? toCamelCase(data) : null;
}
```

### Migration Path

1. Add `caseMapper.js` utility.
2. Apply to new code immediately.
3. Retrofit existing `lib/` CRUD functions one file at a time.
4. Update client code to expect camelCase responses (search for `data.customer_id` patterns → `data.customerId`).

---

## 8. Unused Code Cleanup

**Priority: 🟢 Minor**

### Dead Files to Remove

| File | Reason | Action |
|------|--------|--------|
| `data/customer-config.js` | Fully superseded by `customers` DB table + `CustomerContext`. Imported nowhere. | Delete |
| `supabase/sow-schema.sql` | Superseded by `sow-redesign-schema.sql`. Contains `diagnostic_snapshots` table that's unused. | Archive to `supabase/archive/` |
| `supabase/diagnostic-results-schema.sql` | Duplicate of tables in `sow-redesign-schema.sql`. | Archive |
| `supabase/schema.sql` (standalone) | Incorporated into consolidated migration. | Archive |
| `supabase/sow-redesign-schema.sql` | Replaced by consolidated migration. | Archive |

### Dead Database Objects

| Object | Reason | Action |
|--------|--------|--------|
| `diagnostic_snapshots` table | Superseded by `sows.diagnostic_snapshot` JSONB column + `diagnostic_results` table. Referenced by `listDiagnosticSnapshots` and `createDiagnosticSnapshot` in `lib/sow.js` but not used in any active flow. | Drop table, remove functions from `lib/sow.js` |
| `sow_versions.pdf_url` column | Always null — PDFs are streamed, never stored. | Keep for now (future S3 integration) but document as unused |

### Dead Code in `lib/sow.js`

Remove these functions (grep for callers to confirm):

```js
// These reference the dead diagnostic_snapshots table:
export async function listDiagnosticSnapshots(customerId) { ... }
export async function createDiagnosticSnapshot({ ... }) { ... }
```

### Overlap: `components/SowPreview.js`

- Legacy component rendering SOWs from `content` JSONB (old format).
- `SowPage.js` falls back to it for old SOWs.
- **Action:** Keep for now but mark deprecated. Plan removal after migrating legacy SOW data to sections format.

### Cleanup Checklist

```bash
# 1. Remove dead static file
rm data/customer-config.js

# 2. Archive old schema files
mkdir -p supabase/archive
mv supabase/schema.sql supabase/archive/
mv supabase/sow-schema.sql supabase/archive/
mv supabase/sow-redesign-schema.sql supabase/archive/
mv supabase/diagnostic-results-schema.sql supabase/archive/

# 3. Remove dead functions from lib/sow.js
# (manual edit — remove listDiagnosticSnapshots, createDiagnosticSnapshot)

# 4. Drop legacy table (run in Supabase SQL editor)
# DROP TABLE IF EXISTS diagnostic_snapshots;

# 5. Verify no broken imports
grep -r "customer-config" pages/ components/ lib/ --include="*.js"
grep -r "diagnostic_snapshots" lib/ pages/ --include="*.js"
```

---

## Implementation Priority & Sequencing

| Phase | Items | Effort |
|-------|-------|--------|
| **Phase 1 (Week 1)** | Auth middleware (#1), Error handling (#6) | 2-3 days |
| **Phase 2 (Week 1-2)** | Input validation (#2), Rate limiting (#3) | 2 days |
| **Phase 3 (Week 2)** | Schema consolidation (#4), FK fixes (#5) | 1-2 days |
| **Phase 4 (Week 3)** | Case normalization (#7), Dead code cleanup (#8) | 1 day |

**Dependencies:**
- Error handling (#6) should land first — all other items use the error format.
- Auth middleware (#1) depends on error format from #6.
- Validation (#2) depends on #1 (schemas used in auth-wrapped handlers).
- Schema consolidation (#4) must happen before FK fixes (#5).
- Case normalization (#7) is independent but touching the same files — do last to minimize merge conflicts.
