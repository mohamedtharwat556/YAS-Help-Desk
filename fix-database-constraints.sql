-- ============================================================
-- YAS Help Desk - Fix Database Constraints
-- Execute this in Supabase SQL Editor to fix any issues
-- ============================================================

-- First, check current table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'tickets'
ORDER BY ordinal_position;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for the public-ticket endpoint)
DROP POLICY IF EXISTS "Allow public access to customers" ON customers;
CREATE POLICY "Allow public access to customers" ON customers
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to devices" ON devices;
CREATE POLICY "Allow public access to devices" ON devices
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to tickets" ON tickets;
CREATE POLICY "Allow public access to tickets" ON tickets
  FOR ALL USING (true) WITH CHECK (true);

-- Add assigned_user_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tickets' AND column_name = 'assigned_user_id'
  ) THEN
    ALTER TABLE tickets ADD COLUMN assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Check if there are any existing tickets without proper foreign keys
SELECT
  t.id,
  t.ticket_number,
  t.customer_id,
  t.device_id,
  c.name as customer_name,
  d.model as device_model
FROM tickets t
LEFT JOIN customers c ON t.customer_id = c.id
LEFT JOIN devices d ON t.device_id = d.id
WHERE c.id IS NULL OR d.id IS NULL;

-- Fix any orphaned tickets (if any)
UPDATE tickets t
SET customer_id = (SELECT id FROM customers LIMIT 1)
WHERE customer_id IS NULL OR customer_id NOT IN (SELECT id FROM customers);

UPDATE tickets t
SET device_id = (SELECT id FROM devices LIMIT 1)
WHERE device_id IS NULL OR device_id NOT IN (SELECT id FROM devices);

-- Verify the fix
SELECT
  t.ticket_number,
  c.name as customer_name,
  d.model as device_model,
  t.request_type,
  t.status
FROM tickets t
JOIN customers c ON t.customer_id = c.id
JOIN devices d ON t.device_id = d.id
ORDER BY t.created_at DESC;