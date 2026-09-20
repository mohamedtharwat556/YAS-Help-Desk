-- ============================================================
-- YAS Help Desk - Complete Database Setup
-- Execute this in Supabase SQL Editor
-- ============================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'engineer',
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  whatsapp TEXT,
  email TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  purchase_date DATE,
  warranty_status TEXT DEFAULT 'unknown',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
  assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  request_type TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  description TEXT,
  status TEXT DEFAULT 'received',
  files TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default users
DELETE FROM users WHERE email IN ('admin@yas.sa', 'adam@yas.sa');

INSERT INTO users (email, password_hash, name, role, phone, is_active) VALUES
('admin@yas.sa', '$2a$10$T1DDFcWsksoelcA2cv3Dr.kQo3GLMb.5FqfwR5GLD/OqPQy6tadHm', 'Admin User', 'admin', '0500000000', true),
('adam@yas.sa', '$2a$10$T1DDFcWsksoelcA2cv3Dr.kQo3GLMb.5FqfwR5GLD/OqPQy6tadHm', 'Eng. Adam Farouk', 'engineer', '0501234567', true);

-- Verify insertion
SELECT id, email, name, role, phone, is_active, created_at FROM users WHERE email IN ('admin@yas.sa', 'adam@yas.sa');
