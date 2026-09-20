// ============================================================
// YAS Help Desk - Direct Supabase Integration
// No backend API needed - connects directly to Supabase
// ============================================================

'use strict';

// Load Supabase config dynamically
let supabase = null;
let SUPABASE_CONFIG = null;

// Function to load Supabase
async function loadSupabase() {
  if (supabase) return supabase;

  try {
    // Load Supabase from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = async () => {
      if (window.supabase) {
        SUPABASE_CONFIG = {
          url: 'https://dqepsuecouvnvozcnjth.supabase.co',
          anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZXBzdWVjb3V2bnZvemNuanRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MTg2NzQsImV4cCI6MjEwNTM5NDY3NH0.wwP_8ITnKaks3y1ZT0Yde_4tW_71VlhVEqne2-pYovE'
        };
        
        supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      }
    };
    document.head.appendChild(script);
    
    // Wait for script to load
    await new Promise(resolve => script.onload = resolve);
    
    return supabase;
  } catch (error) {
    console.error('Failed to load Supabase:', error);
    return null;
  }
}

const YAS_API = {
  token: localStorage.getItem('yas_api_token') || null,

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('yas_api_token', token);
    } else {
      localStorage.removeItem('yas_api_token');
    }
  },

  /**
   * Get Supabase client
   */
  async getClient() {
    return await loadSupabase();
  },

  // ============================================================
  // Authentication Methods
  // ============================================================

  /**
   * Login user
   */
  async login(email, password) {
    const client = await this.getClient();
    if (!client) throw new Error('Supabase not loaded');

    // First, get user from custom users table
    const { data: user, error } = await client
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Invalid credentials');
    }

    // For demo purposes, we'll use simple password check
    // In production, use proper authentication
    if (password === 'admin123' || password === 'password') {
      // Generate simple token (in production, use proper JWT)
      const token = btoa(`${user.id}:${user.email}:${user.role}`);
      this.setToken(token);
      
      const { password_hash, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    }

    throw new Error('Invalid credentials');
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    if (!this.token) return null;

    try {
      const decoded = atob(this.token);
      const [userId, email, role] = decoded.split(':');
      
      const client = await this.getClient();
      const { data: user, error } = await client
        .from('users')
        .select('id, email, name, role, phone, is_active, created_at, updated_at')
        .eq('id', userId)
        .single();

      if (error || !user) return null;
      return user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  /**
   * Logout
   */
  logout() {
    this.setToken(null);
  },

  // ============================================================
  // Tickets Methods
  // ============================================================

  /**
   * Get all tickets
   */
  async getTickets(params = {}) {
    const client = await this.getClient();
    if (!client) throw new Error('Supabase not loaded');

    let query = client
      .from('tickets')
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        assigned_user:users(id, name, email, role)
      `);

    // Apply filters
    if (params.status) {
      query = query.eq('status', params.status);
    }
    if (params.priority) {
      query = query.eq('priority', params.priority);
    }
    if (params.search) {
      query = query.or(`ticket_number.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    const { data: tickets, error } = await query
      .order('created_at', { ascending: false })
      .limit(params.limit || 20);

    if (error) throw error;
    return { success: true, data: tickets || [] };
  },

  /**
   * Create ticket
   */
  async createTicket(ticketData) {
    const client = await this.getClient();
    if (!client) throw new Error('Supabase not loaded');

    const { customer, device, request_type, priority = 'medium', description, files = [] } = ticketData;

    // Create or update customer
    const { data: newCustomer, error: customerError } = await client
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
    const { data: newDevice, error: deviceError } = await client
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
    const { data: lastTicket } = await client
      .from('tickets')
      .select('ticket_number')
      .order('created_at', { ascending: false })
      .limit(1);

    const lastNumber = lastTicket && lastTicket.length > 0
      ? parseInt(lastTicket[0].ticket_number.replace('YAS-SUP-', ''))
      : 10480;
    const ticketNumber = `YAS-SUP-${lastNumber + 1}`;

    // Create ticket
    const { data: ticket, error: ticketError } = await client
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

    return { success: true, message: 'Ticket created successfully', data: ticket };
  },

  /**
   * Update ticket status
   */
  async updateTicketStatus(id, status, note = '') {
    const client = await this.getClient();
    if (!client) throw new Error('Supabase not loaded');

    const { data: ticket, error } = await client
      .from('tickets')
      .update({
        status,
        resolved_at: status === 'resolved' ? new Date().toISOString() : null,
        closed_at: status === 'closed' ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, message: 'Status updated successfully', data: ticket };
  },

  // ============================================================
  // Customers Methods
  // ============================================================

  /**
   * Get all customers
   */
  async getCustomers(params = {}) {
    const client = await this.getClient();
    if (!client) throw new Error('Supabase not loaded');

    const { data: customers, error } = await client
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(params.limit || 20);

    if (error) throw error;
    return { success: true, data: customers || [] };
  },

  // ============================================================
  // Devices Methods
  // ============================================================

  /**
   * Get all devices
   */
  async getDevices(params = {}) {
    const client = await this.getClient();
    if (!client) throw new Error('Supabase not loaded');

    const { data: devices, error } = await client
      .from('devices')
      .select('*, customer:customers(*)')
      .order('created_at', { ascending: false })
      .limit(params.limit || 20);

    if (error) throw error;
    return { success: true, data: devices || [] };
  },

  // ============================================================
  // Statistics Methods
  // ============================================================

  /**
   * Get statistics
   */
  async getStats() {
    const response = await this.getTickets({ limit: 1000 });
    if (response.success) {
      const tickets = response.data;
      return {
        total: tickets.length,
        new: tickets.filter(t => t.status === 'received').length,
        inProgress: tickets.filter(t => 
          ['reviewing', 'contacting', 'diagnosing', 'maintenance'].includes(t.status)
        ).length,
        resolved: tickets.filter(t => ['resolved', 'closed'].includes(t.status)).length,
        urgent: tickets.filter(t => t.priority === 'critical').length
      };
    }
    return {};
  }
};

// ============================================================
// Initialize API client
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const storedToken = localStorage.getItem('yas_api_token');
  if (storedToken) {
    YAS_API.setToken(storedToken);
  }
});