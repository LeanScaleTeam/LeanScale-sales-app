-- Add Teamwork hours breakdown columns to customer_qbrs
-- hours_by_month: [{month: '2026-01', hours: 45.5}, ...]
-- hours_by_project: [{project: 'CRM Setup', hours: 23.0}, ...]

ALTER TABLE customer_qbrs
  ADD COLUMN IF NOT EXISTS hours_by_month   JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS hours_by_project JSONB DEFAULT '[]';
