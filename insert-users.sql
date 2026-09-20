-- ============================================================
-- Insert Default Users for YAS Help Desk
-- Execute this in Supabase SQL Editor
-- ============================================================

-- First, check if users table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        RAISE NOTICE 'Users table does not exist. Please run schema.sql first.';
    ELSE
        RAISE NOTICE 'Users table exists. Proceeding with user insertion.';
    END IF;
END $$;

-- Delete existing users if they exist (to avoid duplicates)
DELETE FROM users WHERE email IN ('admin@yas.sa', 'adam@yas.sa');

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role, phone, is_active) VALUES
('admin@yas.sa', '$2a$10$T1DDFcWsksoelcA2cv3Dr.kQo3GLMb.5FqfwR5GLD/OqPQy6tadHm', 'Admin User', 'admin', '0500000000', true),
('adam@yas.sa', '$2a$10$T1DDFcWsksoelcA2cv3Dr.kQo3GLMb.5FqfwR5GLD/OqPQy6tadHm', 'Eng. Adam Farouk', 'engineer', '0501234567', true);

-- Verify insertion
SELECT id, email, name, role, phone, is_active, created_at FROM users WHERE email IN ('admin@yas.sa', 'adam@yas.sa');