-- Allow 'dual' as a crm_type value and add columns for dual-system tracking
-- Note: crm_type is a TEXT column, no enum constraint to update

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
