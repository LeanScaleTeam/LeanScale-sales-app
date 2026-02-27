-- ============================================
-- Salesforce CLI Upload Support
-- Adds enhanced_signals, enhanced_data columns and updates source constraint
-- ============================================

-- Drop the existing source CHECK constraint and add 'cli' as a valid value
ALTER TABLE salesforce_metadata DROP CONSTRAINT IF EXISTS salesforce_metadata_source_check;
ALTER TABLE salesforce_metadata ADD CONSTRAINT salesforce_metadata_source_check
  CHECK (source IN ('api', 'upload', 'cli'));

-- Add columns for enhanced inferrer output and raw enhanced query data
ALTER TABLE salesforce_metadata
  ADD COLUMN IF NOT EXISTS enhanced_signals JSONB,
  ADD COLUMN IF NOT EXISTS enhanced_data JSONB;
