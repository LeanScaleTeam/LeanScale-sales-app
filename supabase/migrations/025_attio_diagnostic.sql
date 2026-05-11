-- ============================================
-- Attio Diagnostic Migration
-- Adds Attio OAuth tokens, raw metadata storage, and extends crm_type
-- ============================================

-- ============================================
-- ATTIO CONNECTIONS (OAuth tokens per customer/workspace)
-- ============================================
CREATE TABLE IF NOT EXISTS attio_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  workspace_name TEXT,
  workspace_slug TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scopes_granted TEXT[],
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, workspace_id)
);

ALTER TABLE attio_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on attio_connections"
  ON attio_connections FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_attio_connections_customer
  ON attio_connections(customer_id);

-- ============================================
-- ATTIO METADATA (raw API downloads + computed signals)
-- ============================================
CREATE TABLE IF NOT EXISTS attio_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL,
  self_info JSONB,              -- /v2/self response (scopes, workspace metadata)
  objects JSONB,                -- /v2/objects list
  attributes JSONB,             -- per-object attribute schemas { people: [...], companies: [...], deals: [...] }
  statuses JSONB,               -- pipeline stages per status attribute
  lists JSONB,                  -- /v2/lists
  list_entries JSONB,           -- sampled per-list entries
  workspace_members JSONB,      -- /v2/workspace-members
  tasks JSONB,                  -- /v2/tasks (paginated)
  notes JSONB,                  -- /v2/notes (sampled)
  webhooks JSONB,               -- /v2/webhooks — critical for automation pillar
  record_samples JSONB,         -- recent records per object for created_by_actor sampling
  deal_aggregates JSONB,        -- client-side computed deal counts / win rates
  computed_signals JSONB,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, workspace_id)
);

ALTER TABLE attio_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on attio_metadata"
  ON attio_metadata FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_attio_metadata_customer
  ON attio_metadata(customer_id);

-- ============================================
-- Extend customers.crm_type to allow 'attio'
-- ============================================
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_crm_type_check;
ALTER TABLE customers ADD CONSTRAINT customers_crm_type_check
  CHECK (crm_type IN ('hubspot', 'salesforce', 'attio', 'dual', 'other', 'unknown'));

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS attio_workspace_id TEXT;

-- ============================================
-- Link diagnostic_results to attio_metadata
-- ============================================
ALTER TABLE diagnostic_results
  ADD COLUMN IF NOT EXISTS attio_metadata_id UUID REFERENCES attio_metadata(id);

ALTER TABLE diagnostic_results_v3
  ADD COLUMN IF NOT EXISTS attio_metadata_id UUID REFERENCES attio_metadata(id);
