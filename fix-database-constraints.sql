-- ============================================================
-- YAS Help Desk - Fix Database Constraints
-- Execute this in Supabase SQL Editor to fix any issues
-- ============================================================

-- First, check current table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'devices'
ORDER BY ordinal_position;

-- Add serial_number column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devices' AND column_name = 'serial_number'
  ) THEN
    ALTER TABLE devices ADD COLUMN serial_number TEXT;
  END IF;
END $$;

-- Add purchase_date column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'devices' AND column_name = 'purchase_date'
  ) THEN
    ALTER TABLE devices ADD COLUMN purchase_date DATE;
  END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'devices' AND column_name IN ('serial_number', 'purchase_date')
ORDER BY ordinal_position;