-- Add power10_metrics JSONB column to diagnostic_results
-- Stores Power10 metrics with status data (same shape as MetricsView expects)
-- Each element: { name, ableToReport, statusAgainstPlan, currentPerformance }

ALTER TABLE diagnostic_results
  ADD COLUMN IF NOT EXISTS power10_metrics JSONB DEFAULT '[]';
