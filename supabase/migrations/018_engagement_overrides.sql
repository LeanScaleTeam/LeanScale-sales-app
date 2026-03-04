-- Add engagement_overrides JSONB column to both diagnostic result tables
-- Stores user edits (power10 status overrides, finding edits, roadmap phase reassignments)

ALTER TABLE diagnostic_results
  ADD COLUMN IF NOT EXISTS engagement_overrides JSONB;

ALTER TABLE diagnostic_results_v3
  ADD COLUMN IF NOT EXISTS engagement_overrides JSONB;
