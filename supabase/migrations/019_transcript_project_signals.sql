-- Transcript project signals: stores project/service mentions detected
-- from discovery call transcripts via LLM extraction.
-- Used by the v3 diagnostic engine to add or boost roadmap projects.

CREATE TABLE IF NOT EXISTS transcript_project_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id),
  transcript_id uuid REFERENCES diagnostic_transcripts(id),
  service_id text NOT NULL,
  signal_type text NOT NULL CHECK (signal_type IN ('explicit_mention', 'pain_point', 'tool_gap', 'aspiration')),
  confidence float NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  evidence text,
  reasoning text,
  model_version text DEFAULT 'anthropic/claude-sonnet-4',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_signals_customer
  ON transcript_project_signals(customer_id);

CREATE INDEX IF NOT EXISTS idx_project_signals_transcript
  ON transcript_project_signals(transcript_id);
