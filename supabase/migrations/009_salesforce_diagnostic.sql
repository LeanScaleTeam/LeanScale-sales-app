-- ============================================
-- Salesforce Diagnostic Migration
-- Adds Salesforce OAuth connections, metadata storage, and intake status
-- ============================================

-- ============================================
-- SALESFORCE CONNECTIONS (OAuth tokens per customer/org)
-- ============================================
CREATE TABLE IF NOT EXISTS salesforce_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  org_id TEXT NOT NULL,
  instance_url TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  is_sandbox BOOLEAN DEFAULT false,
  scopes_granted TEXT[],
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, org_id)
);

ALTER TABLE salesforce_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on salesforce_connections"
  ON salesforce_connections FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_salesforce_connections_customer
  ON salesforce_connections(customer_id);

-- ============================================
-- SALESFORCE METADATA (raw API downloads + parsed zip + computed signals)
-- ============================================
CREATE TABLE IF NOT EXISTS salesforce_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  org_id TEXT,
  source TEXT NOT NULL CHECK (source IN ('api', 'upload')),
  objects JSONB,
  stages JSONB,
  users JSONB,
  flows JSONB,
  workflow_rules JSONB,
  validation_rules JSONB,
  apex_triggers JSONB,
  apex_classes JSONB,
  profiles JSONB,
  permission_sets JSONB,
  roles JSONB,
  reports JSONB,
  dashboards JSONB,
  connected_apps JSONB,
  named_credentials JSONB,
  record_types JSONB,
  computed_signals JSONB,
  fetch_status JSONB,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, org_id)
);

ALTER TABLE salesforce_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on salesforce_metadata"
  ON salesforce_metadata FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_salesforce_metadata_customer
  ON salesforce_metadata(customer_id);

-- ============================================
-- ALTER diagnostic_intake for status tracking
-- ============================================
ALTER TABLE diagnostic_intake
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'awaiting_crm_data', 'complete'));

-- ============================================
-- ALTER diagnostic_results for Salesforce metadata reference
-- ============================================
ALTER TABLE diagnostic_results
  ADD COLUMN IF NOT EXISTS salesforce_metadata_id UUID REFERENCES salesforce_metadata(id),
  ADD COLUMN IF NOT EXISTS crm_type TEXT DEFAULT 'unknown';
