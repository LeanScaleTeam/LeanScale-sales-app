-- Add recurring_revenue_changes column to vasco_snapshots for churn / GRR / NRR computation.
-- Populated by the Vasco Data Sync routine (Step 2b §g + balance queries).
-- Shape: { period: 'YYYY-MM', monthly: [...], balances: { start_of_period, end_of_period } }
ALTER TABLE vasco_snapshots
  ADD COLUMN IF NOT EXISTS recurring_revenue_changes JSONB;
