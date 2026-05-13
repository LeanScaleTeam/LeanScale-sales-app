-- ============================================
-- Multi-CRM Support Migration
-- Adds customers.crm_systems TEXT[] for N-system selection (Salesforce + HubSpot CRM
-- + HubSpot MAP + Attio + Other), with dual-write to legacy crm_type for back-compat.
-- ============================================

-- Stable system keys (snake_case, matches A1 values stored in intake answers)
--   'salesforce'   — Salesforce CRM
--   'hubspot_crm'  — HubSpot used as the primary CRM
--   'hubspot_map'  — HubSpot used as marketing automation (forms, email, nurture)
--   'attio'        — Attio
--   'other'        — Customer uses something not in our list

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS crm_systems TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Backfill crm_systems from legacy crm_type for rows that haven't been touched.
-- This is a one-time soft migration; new rows populate crm_systems directly.
UPDATE customers SET crm_systems = CASE
  WHEN crm_type = 'salesforce'  THEN ARRAY['salesforce']
  WHEN crm_type = 'hubspot'     THEN ARRAY['hubspot_crm']
  WHEN crm_type = 'attio'       THEN ARRAY['attio']
  WHEN crm_type = 'dual'        THEN ARRAY['salesforce', 'hubspot_map']
  WHEN crm_type = 'other'       THEN ARRAY['other']
  ELSE ARRAY[]::TEXT[]
END
WHERE crm_systems = ARRAY[]::TEXT[] OR crm_systems IS NULL;

-- Constrain crm_systems values
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_crm_systems_check;
ALTER TABLE customers ADD CONSTRAINT customers_crm_systems_check
  CHECK (
    crm_systems <@ ARRAY['salesforce', 'hubspot_crm', 'hubspot_map', 'attio', 'other']::TEXT[]
  );

CREATE INDEX IF NOT EXISTS idx_customers_crm_systems
  ON customers USING GIN (crm_systems);

-- Note: legacy customers.crm_type stays as-is. The intake form and diagnostic
-- engine read crm_systems first; if absent, they fall back to deriving from
-- crm_type. Once all customers are re-run through intake, crm_type can be
-- deprecated in a future migration.
