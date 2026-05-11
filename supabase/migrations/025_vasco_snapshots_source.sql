-- Add source column to vasco_snapshots to distinguish data source
-- Now supports: vasco, hubspot, salesforce, manual
-- (Table name retained for backwards compatibility; "CRM snapshots" is a more
-- accurate description at this point.)
ALTER TABLE vasco_snapshots
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'vasco'
    CHECK (source IN ('vasco', 'hubspot', 'salesforce', 'manual'));

-- Index for source-based filtering
CREATE INDEX IF NOT EXISTS idx_vasco_snapshots_source
  ON vasco_snapshots(customer_id, source, snapshot_date DESC);
