-- Add hide_engagement flag to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS hide_engagement BOOLEAN DEFAULT false;
