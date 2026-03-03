-- ============================================
-- Add roadmap_overrides column to diagnostic_results_v3
-- Stores user edits: removed projects, phase moves,
-- custom projects, and reordering.
-- ============================================

ALTER TABLE diagnostic_results_v3
  ADD COLUMN IF NOT EXISTS roadmap_overrides JSONB DEFAULT NULL;
