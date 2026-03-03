-- Migration: Add diagnostic_version to customers table
-- Controls which diagnostic engine version runs for GTM customers (v1/v2/v3)
-- Only meaningful when diagnostic_type = 'gtm'

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS diagnostic_version SMALLINT DEFAULT 2
    CHECK (diagnostic_version IN (1, 2, 3));

-- Existing customers keep v2 (the current default)
UPDATE customers SET diagnostic_version = 2 WHERE diagnostic_version IS NULL;
