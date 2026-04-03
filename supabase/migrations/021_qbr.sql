-- QBR (Quarterly Business Review) table
-- Stores per-quarter snapshots for active customers

CREATE TABLE IF NOT EXISTS customer_qbrs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id  UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  quarter      TEXT NOT NULL,           -- 'Q0-2025', 'Q1-2025', 'Q2-2025'
  quarter_label TEXT,                   -- 'Q1 2025 Business Review'
  period_start  DATE,
  period_end    DATE,
  status        TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_baseline   BOOLEAN DEFAULT FALSE,  -- TRUE for Q0/kickoff QBR

  -- Narrative
  executive_summary TEXT,
  architect_notes   TEXT,               -- internal only, never shown to customer

  -- Wins: [{title, description, impact_statement, emoji}]
  wins JSONB DEFAULT '[]',

  -- Power 10 snapshot at time of QBR
  -- Copy of the effectiveData array from Power10Anchor
  power10_snapshot JSONB DEFAULT '[]',

  -- Pillar scores snapshot: {overall, byPillar: {process, people, ...}}
  scores_snapshot JSONB DEFAULT '{}',

  -- Projects
  projects_completed   JSONB DEFAULT '[]', -- [{name, phase, description, hours}]
  projects_in_progress JSONB DEFAULT '[]', -- [{name, phase, description, pct_complete}]
  next_quarter_focus   JSONB DEFAULT '[]', -- [{title, description, priority: 'high'|'medium'}]

  -- Free markdown block (imported or typed)
  accomplishments_markdown TEXT,

  -- Hours tracking
  hours_used      INTEGER,
  hours_budgeted  INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_qbrs_customer
  ON customer_qbrs(customer_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_qbrs_quarter
  ON customer_qbrs(customer_id, quarter);

CREATE TRIGGER update_customer_qbrs_updated_at
  BEFORE UPDATE ON customer_qbrs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS: public read for published QBRs; service_role full access
ALTER TABLE customer_qbrs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published QBRs are readable by anyone"
  ON customer_qbrs FOR SELECT
  USING (status = 'published');

CREATE POLICY "Service role has full access"
  ON customer_qbrs FOR ALL
  USING (true)
  WITH CHECK (true);
