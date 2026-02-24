-- ============================================
-- Diagnostic v2 Migration
-- Adds HubSpot OAuth, CRM metadata, intake form, and v2 diagnostic columns
-- ============================================

-- ============================================
-- HUBSPOT CONNECTIONS (OAuth tokens per customer/portal)
-- ============================================
CREATE TABLE IF NOT EXISTS hubspot_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  portal_id BIGINT NOT NULL,
  portal_name TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  scopes_granted TEXT[],
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, portal_id)
);

ALTER TABLE hubspot_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on hubspot_connections"
  ON hubspot_connections FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_hubspot_connections_customer
  ON hubspot_connections(customer_id);

-- ============================================
-- HUBSPOT METADATA (raw API downloads + computed signals)
-- ============================================
CREATE TABLE IF NOT EXISTS hubspot_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  portal_id BIGINT NOT NULL,
  properties JSONB,
  pipelines JSONB,
  workflows JSONB,
  forms JSONB,
  lists JSONB,
  owners JSONB,
  marketing_emails JSONB,
  sequences JSONB,
  computed_signals JSONB,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, portal_id)
);

ALTER TABLE hubspot_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on hubspot_metadata"
  ON hubspot_metadata FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_hubspot_metadata_customer
  ON hubspot_metadata(customer_id);

-- ============================================
-- DIAGNOSTIC INTAKE (intake form answers with skip logic)
-- ============================================
CREATE TABLE IF NOT EXISTS diagnostic_intake (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  sections_completed TEXT[] DEFAULT '{}',
  skip_logic_applied JSONB,
  submitted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id)
);

ALTER TABLE diagnostic_intake ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on diagnostic_intake"
  ON diagnostic_intake FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ============================================
-- ALTER diagnostic_results for v2 columns
-- ============================================
ALTER TABLE diagnostic_results
  ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS items JSONB,
  ADD COLUMN IF NOT EXISTS scores JSONB,
  ADD COLUMN IF NOT EXISTS company_profile JSONB,
  ADD COLUMN IF NOT EXISTS metadata JSONB,
  ADD COLUMN IF NOT EXISTS intake_id UUID REFERENCES diagnostic_intake(id),
  ADD COLUMN IF NOT EXISTS hubspot_metadata_id UUID REFERENCES hubspot_metadata(id);

-- ============================================
-- ALTER customers for CRM type
-- ============================================
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS crm_type TEXT DEFAULT 'unknown'
    CHECK (crm_type IN ('hubspot', 'salesforce', 'other', 'unknown')),
  ADD COLUMN IF NOT EXISTS hubspot_portal_id BIGINT;
