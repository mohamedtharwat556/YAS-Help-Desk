// ============================================================
// YAS Help Desk - Local API Server
// Simple Express server to run API endpoints locally
// ============================================================

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://dqepsuecouvnvozcnjth.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZXBzdWVjb3V2bnZvemNuanRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTgxODY3NCwiZXhwIjoyMTA1Mzk0Njc0fQ.yn1zGz8RIbyPKTkjw8YwTZr5cnTvyvd4Tp5COv046HE';
const jwtSecret = process.env.JWT_SECRET || 'yas-helpdesk-2026-secret-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions
function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
}

// Middleware to verify auth
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = decoded;
  next();
}

// ============================================================
// API Routes
// ============================================================

// Auth endpoint
app.post('/api/auth', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Public ticket creation (no auth required)
app.post('/api/public-ticket', async (req, res) => {
  try {
    const { customer, device, request_type, priority = 'medium', description, files = [] } = req.body;

    // Create or update customer
    const { data: newCustomer, error: customerError } = await supabase
      .from('customers')
      .upsert({
        name: customer.name,
        phone: customer.phone,
        whatsapp: customer.whatsapp || customer.phone,
        email: customer.email,
        company: customer.company
      }, {
        onConflict: 'phone'
      })
      .select()
      .single();

    if (customerError) throw customerError;

    // Create device
    const { data: newDevice, error: deviceError } = await supabase
      .from('devices')
      .insert({
        customer_id: newCustomer.id,
        type: device.type,
        brand: device.brand,
        model: device.model,
        serial_number: device.serial_number,
        purchase_date: device.purchase_date,
        warranty_status: device.warranty_status || 'unknown'
      })
      .select()
      .single();

    if (deviceError) throw deviceError;

    // Generate ticket number
    const { data: lastTicket } = await supabase
      .from('tickets')
      .select('ticket_number')
      .order('created_at', { ascending: false })
      .limit(1);

    const lastNumber = lastTicket && lastTicket.length > 0
      ? parseInt(lastTicket[0].ticket_number.replace('YAS-SUP-', ''))
      : 10480;
    const ticketNumber = `YAS-SUP-${lastNumber + 1}`;

    // Create ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        customer_id: newCustomer.id,
        device_id: newDevice.id,
        request_type,
        priority,
        description,
        files,
        status: 'received'
      })
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        assigned_user:users(id, name, email, role)
      `)
      .single();

    if (ticketError) throw ticketError;

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Failed to create ticket', details: error.message });
  }
});

// Get all tickets (auth required)
app.get('/api/tickets', authenticate, async (req, res) => {
  try {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        assigned_user:users(id, name, email, role)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: tickets || []
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Create ticket (auth required)
app.post('/api/tickets', authenticate, async (req, res) => {
  try {
    const { customer, device, request_type, priority = 'medium', description, files = [] } = req.body;

    // Create or update customer
    const { data: newCustomer, error: customerError } = await supabase
      .from('customers')
      .upsert({
        name: customer.name,
        phone: customer.phone,
        whatsapp: customer.whatsapp || customer.phone,
        email: customer.email,
        company: customer.company
      }, {
        onConflict: 'phone'
      })
      .select()
      .single();

    if (customerError) throw customerError;

    // Create device
    const { data: newDevice, error: deviceError } = await supabase
      .from('devices')
      .insert({
        customer_id: newCustomer.id,
        type: device.type,
        brand: device.brand,
        model: device.model,
        serial_number: device.serial_number,
        purchase_date: device.purchase_date,
        warranty_status: device.warranty_status || 'unknown'
      })
      .select()
      .single();

    if (deviceError) throw deviceError;

    // Generate ticket number
    const { data: lastTicket } = await supabase
      .from('tickets')
      .select('ticket_number')
      .order('created_at', { ascending: false })
      .limit(1);

    const lastNumber = lastTicket && lastTicket.length > 0
      ? parseInt(lastTicket[0].ticket_number.replace('YAS-SUP-', ''))
      : 10480;
    const ticketNumber = `YAS-SUP-${lastNumber + 1}`;

    // Create ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert({
        ticket_number: ticketNumber,
        customer_id: newCustomer.id,
        device_id: newDevice.id,
        request_type,
        priority,
        description,
        files,
        status: 'received'
      })
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        assigned_user:users(id, name, email, role)
      `)
      .single();

    if (ticketError) throw ticketError;

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Update ticket (auth required)
app.put('/api/tickets/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: ticket, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        assigned_user:users(id, name, email, role)
      `)
      .single();

    if (error || !ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get ticket by ID (auth required)
app.get('/api/tickets/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: ticket, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        assigned_user:users(id, name, email, role)
      `)
      .eq('id', id)
      .single();

    if (error || !ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// Get customers (auth required)
app.get('/api/customers', authenticate, async (req, res) => {
  try {
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: customers || []
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get devices (auth required)
app.get('/api/devices', authenticate, async (req, res) => {
  try {
    const { data: devices, error } = await supabase
      .from('devices')
      .select('*, customers(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: devices || []
    });
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Get users (auth required)
app.get('/api/users', authenticate, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, name, role, phone, is_active, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: users || []
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get current user (auth required)
app.get('/api/me', authenticate, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, phone, is_active')
      .eq('id', req.user.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 YAS Help Desk API Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend available at http://localhost:${PORT}`);
});

module.exports = app;