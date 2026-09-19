-- ============================================================
-- YAS Help Desk - Supabase Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Users Table (Custom users for engineers)
-- ============================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'engineer', -- engineer, admin, manager
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Customers Table
-- ============================================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    company VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Devices Table
-- ============================================================
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- laptop, desktop, pos, hikvision, projector, monitor, printer, network, accessories, other
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    purchase_date DATE,
    warranty_status VARCHAR(50) DEFAULT 'unknown', -- unknown, active, expiring, expired
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Tickets Table
-- ============================================================
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL, -- YAS-SUP-XXXXX
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Request info
    request_type VARCHAR(50) NOT NULL, -- technical, maintenance, warranty, complaint, inquiry, installation, followup, other
    priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, critical
    description TEXT NOT NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'received', -- received, reviewing, contacting, diagnosing, maintenance, waiting, resolved, closed
    
    -- Files
    files JSONB DEFAULT '[]',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================
-- Ticket Notes Table
-- ============================================================
CREATE TABLE ticket_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT true, -- true = internal, false = visible to customer
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Ticket Activities Table
-- ============================================================
CREATE TABLE ticket_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- create, assign, status, note, contact, action
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Notifications Table
-- ============================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- new, resolved, assigned, mentioned, system
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Settings Table
-- ============================================================
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Maintenance Records Table
-- ============================================================
CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
    technician_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- inspection, repair, replacement, installation
    description TEXT,
    cost DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Warranty Records Table
-- ============================================================
CREATE TABLE warranty_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
    warranty_type VARCHAR(50) NOT NULL, -- manufacturer, extended, service
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Indexes for performance
-- ============================================================

-- Tickets indexes
CREATE INDEX idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX idx_tickets_device_id ON tickets(device_id);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX idx_tickets_ticket_number ON tickets(ticket_number);

-- Customers indexes
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);

-- Devices indexes
CREATE INDEX idx_devices_customer_id ON devices(customer_id);
CREATE INDEX idx_devices_serial_number ON devices(serial_number);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Ticket notes indexes
CREATE INDEX idx_ticket_notes_ticket_id ON ticket_notes(ticket_id);

-- Ticket activities indexes
CREATE INDEX idx_ticket_activities_ticket_id ON ticket_activities(ticket_id);
CREATE INDEX idx_ticket_activities_created_at ON ticket_activities(created_at DESC);

-- ============================================================
-- Trigger for updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Ticket Number Generator
-- ============================================================
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS VARCHAR(50) AS $$
DECLARE
    next_num INTEGER;
BEGIN
    -- Get the last ticket number or start from 10481
    SELECT COALESCE(MAX(SUBSTRING(ticket_number FROM 'YAS-SUP-(\d+)')::INTEGER), 10480)
    INTO next_num
    FROM tickets;
    
    next_num := next_num + 1;
    
    RETURN 'YAS-SUP-' || next_num;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Initial Data
-- ============================================================

-- Insert default admin user (password: admin123 - change this in production)
INSERT INTO users (email, password_hash, name, role, phone) VALUES
('admin@yas.sa', '$2b$10$rK3q6Z8Y8Y8Y8Y8Y8Y8Y8e5X7Z9Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'Admin User', 'admin', '0500000000'),
('adam@yas.sa', '$2b$10$rK3q6Z8Y8Y8Y8Y8Y8Y8Y8e5X7Z9Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1', 'Eng. Adam Farouk', 'engineer', '0501234567');

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('company', '{"name": "YAS", "whatsapp": "", "email": "info@yas.sa"}', 'Company information'),
('auto_assign', '{"enabled": true, "default_engineer_id": "adam@yas.sa"}', 'Auto assignment settings'),
('notifications', '{"email_enabled": false, "sms_enabled": false}', 'Notification settings'),
('sla', '{"critical_hours": 4, "high_hours": 8, "medium_hours": 24, "low_hours": 48}', 'SLA settings');
