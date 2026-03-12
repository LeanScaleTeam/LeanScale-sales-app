-- Allow 'dual' as a crm_type value and add columns for dual-system tracking

-- Update the CHECK constraint on customers.crm_type to include 'dual'
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_crm_type_check;
ALTER TABLE customers ADD CONSTRAINT customers_crm_type_check
  CHECK (crm_type IN ('hubspot', 'salesforce', 'dual', 'other', 'unknown'));

-- Add dual-system metadata columns to diagnostic results tables
ALTER TABLE diagnostic_results
  ADD COLUMN IF NOT EXISTS hubspot_metadata_id UUID,
  ADD COLUMN IF NOT EXISTS salesforce_metadata_id UUID;
-- (hubspot_metadata_id may already exist, salesforce_metadata_id may already exist — IF NOT EXISTS handles both)

ALTER TABLE diagnostic_results_v3
  ADD COLUMN IF NOT EXISTS hubspot_metadata_id UUID,
  ADD COLUMN IF NOT EXISTS salesforce_metadata_id UUID;

-- Add a merged_signals JSONB column to store the combined signal output
ALTER TABLE diagnostic_results
  ADD COLUMN IF NOT EXISTS merged_signals JSONB;

ALTER TABLE diagnostic_results_v3
  ADD COLUMN IF NOT EXISTS merged_signals JSONB;
