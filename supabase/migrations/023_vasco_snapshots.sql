-- Add vasco_org_id to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS vasco_org_id TEXT;

-- Create vasco_snapshots table for point-in-time Vasco data pulls
CREATE TABLE IF NOT EXISTS vasco_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  vasco_org_id TEXT NOT NULL,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  integrity_score JSONB,
  integrity_issues JSONB,
  gtm_stages JSONB,
  volume_metrics JSONB,
  time_in_stage JSONB,
  context_graph JSONB,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'running', 'complete', 'error')),
  sync_errors JSONB,
  raw_responses JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(customer_id, snapshot_date)
);

-- RLS policies
ALTER TABLE vasco_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on vasco_snapshots"
  ON vasco_snapshots FOR ALL
  USING (true) WITH CHECK (true);

-- Index for fast lookups by customer
CREATE INDEX IF NOT EXISTS idx_vasco_snapshots_customer_date
  ON vasco_snapshots(customer_id, snapshot_date DESC);
