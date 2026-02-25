-- ============================================
-- Diagnostic v3: 6-Pillar RevOps Assessment
-- Adds transcript storage, AI assessments, consultant assessments,
-- and v3 diagnostic results tables.
-- ============================================

-- ============================================
-- DISCOVERY CALL TRANSCRIPTS
-- ============================================
CREATE TABLE IF NOT EXISTS diagnostic_transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'upload',
  raw_text TEXT NOT NULL,
  file_url TEXT,
  duration_seconds INTEGER,
  uploaded_by TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE diagnostic_transcripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on diagnostic_transcripts"
  ON diagnostic_transcripts FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_diagnostic_transcripts_customer
  ON diagnostic_transcripts(customer_id);

-- ============================================
-- AI-EXTRACTED TRANSCRIPT ASSESSMENTS
-- Per competency per department, from Claude analysis
-- ============================================
CREATE TABLE IF NOT EXISTS transcript_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transcript_id UUID NOT NULL REFERENCES diagnostic_transcripts(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  competency_id TEXT NOT NULL,
  department TEXT NOT NULL,
  score SMALLINT CHECK (score >= 1 AND score <= 5),
  confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  evidence_quotes JSONB DEFAULT '[]'::jsonb,
  assessment TEXT,
  reasoning TEXT,
  model_version TEXT,
  analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transcript_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on transcript_assessments"
  ON transcript_assessments FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_transcript_assessments_customer
  ON transcript_assessments(customer_id);

CREATE INDEX IF NOT EXISTS idx_transcript_assessments_transcript
  ON transcript_assessments(transcript_id);

CREATE INDEX IF NOT EXISTS idx_transcript_assessments_competency
  ON transcript_assessments(competency_id, department);

-- ============================================
-- CONSULTANT MANUAL ASSESSMENTS
-- Per competency per department, entered by consultants
-- ============================================
CREATE TABLE IF NOT EXISTS consultant_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  competency_id TEXT NOT NULL,
  department TEXT NOT NULL,
  score SMALLINT CHECK (score >= 1 AND score <= 5),
  notes TEXT,
  assessed_by TEXT,
  assessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, competency_id, department)
);

ALTER TABLE consultant_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on consultant_assessments"
  ON consultant_assessments FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_consultant_assessments_customer
  ON consultant_assessments(customer_id);

-- ============================================
-- V3 DIAGNOSTIC RESULTS
-- Computed score card + roadmap (one per customer)
-- ============================================
CREATE TABLE IF NOT EXISTS diagnostic_results_v3 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 3,
  crm_type TEXT,
  score_card JSONB,
  pillar_scores JSONB,
  department_scores JSONB,
  overall_score DECIMAL(3,2),
  roadmap JSONB,
  intake_id UUID REFERENCES diagnostic_intake(id),
  hubspot_metadata_id UUID REFERENCES hubspot_metadata(id),
  salesforce_metadata_id UUID REFERENCES salesforce_metadata(id),
  transcript_ids UUID[] DEFAULT '{}',
  company_profile JSONB,
  data_coverage JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id)
);

ALTER TABLE diagnostic_results_v3 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service_role full access on diagnostic_results_v3"
  ON diagnostic_results_v3 FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_diagnostic_results_v3_customer
  ON diagnostic_results_v3(customer_id);
