-- Add volume_metrics_performance column to vasco_snapshots — stores latest-full-month
-- actuals÷forecast ratios sourced from Vasco volume_metrics.perf_* measures.
-- Populated by the Vasco Data Sync routine (Step 2b §i).
-- Shape: { period: 'YYYY-MM', D5_bookings: { perf: 0.95 }, D5_mql: { perf: 0.45 }, ... }
ALTER TABLE vasco_snapshots
  ADD COLUMN IF NOT EXISTS volume_metrics_performance JSONB;
