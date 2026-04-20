-- Extend vasco_snapshots with architect/quarter metadata + matrix statuses
-- for QBR upload workflow (skill-generated JSON files uploaded via admin UI).
ALTER TABLE vasco_snapshots
  ADD COLUMN IF NOT EXISTS architect TEXT,
  ADD COLUMN IF NOT EXISTS quarter TEXT,
  ADD COLUMN IF NOT EXISTS matrix_statuses JSONB,
  ADD COLUMN IF NOT EXISTS tech_stack JSONB,
  ADD COLUMN IF NOT EXISTS claude_insights JSONB,
  ADD COLUMN IF NOT EXISTS schema_version TEXT,
  ADD COLUMN IF NOT EXISTS upload_source TEXT,
  ADD COLUMN IF NOT EXISTS uploaded_by TEXT,
  ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMPTZ;

-- Index for quarter-based lookups (QBR comparisons)
CREATE INDEX IF NOT EXISTS idx_vasco_snapshots_quarter
  ON vasco_snapshots(customer_id, quarter);
