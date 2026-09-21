// ============================================================
// YAS Help Desk - API Client with Simplified Backend
// Connects to Vercel serverless functions with Supabase
// ============================================================

'use strict';

const YAS_API = {
  // Use environment variable for production, fallback to localhost for development
  baseURL: window.ENV?.API_URL || 'http://localhost:3001/api',
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
   * Get authentication headers
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  },

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const isVercel = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    let url;

    if (isVercel) {
      // For Vercel, the api/ folder becomes serverless functions
      // The files in api/ folder are automatically served as /api/filename
      // No .js suffix needed for Vercel serverless functions
      if (endpoint.includes('submit-ticket')) {
        url = `/api/submit-ticket`;
      } else if (endpoint.includes('get-tickets')) {
        url = `/api/get-tickets`;
      } else if (endpoint.startsWith('/api')) {
        url = endpoint;
      } else {
        url = `/api${endpoint}`;
      }
    } else {
      // For local development, use direct paths
      url = `${this.baseURL}${endpoint}`;
    }

    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    };

    console.log('[API] Request:', url, config.method);

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      console.log('[API] Response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('[API] Error:', error);
      throw error;
    }
  },

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const isVercel = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    let url;

    // Add timestamp to prevent caching
    const cacheBuster = { _t: Date.now() };
    const allParams = { ...params, ...cacheBuster };

    if (isVercel) {
      // For Vercel, no .js suffix needed for serverless functions
      const queryString = new URLSearchParams(allParams).toString();
      const baseEndpoint = endpoint;
      url = queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;
    } else {
      const queryString = new URLSearchParams(allParams).toString();
      url = queryString ? `${endpoint}?${queryString}` : endpoint;
    }

    return this.request(url, { method: 'GET' });
  },

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // ============================================================
  // Authentication Methods
  // ============================================================

  /**
   * Login user
   */
  async login(email, password) {
    const response = await this.post('/auth', { email, password });
    console.log('[API] Login response:', response);
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
      console.log('[API] Token set successfully:', !!this.token);
      return response.data;
    }
    throw new Error('Login failed');
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    return this.get('/me');
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
    // Use fresh endpoint to bypass Vercel caching
    const response = await this.get('/get-tickets', params);
    if (response.success) {
      // Transform API response to match frontend expected format
      const transformedTickets = response.data.map(ticket => ({
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        status: ticket.status,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        request: {
          type: ticket.request_type,
          priority: ticket.priority,
          description: ticket.description
        },
        customer: ticket.customer || { name: 'Unknown', phone: '—' },
        device: ticket.device || { type: 'unknown', model: 'Unknown' },
        assignedTo: ticket.assigned_user?.name || ticket.assigned_to || 'Unassigned',
        assigned_user: ticket.assigned_user,
        assigned_to: ticket.assigned_to,
        // Keep original fields for backward compatibility
        request_type: ticket.request_type,
        priority: ticket.priority,
        description: ticket.description,
        // Add activities array for timeline
        activities: [],
        notes: []
      }));
      return { success: true, data: transformedTickets };
    }
    return response;
  },

  /**
   * Create ticket
   */
  async createTicket(ticketData) {
    // Transform frontend format to API format
    const apiData = {
      customer: ticketData.customer,
      device: ticketData.device,
      request_type: ticketData.request?.type || ticketData.request_type,
      priority: ticketData.request?.priority || ticketData.priority,
      description: ticketData.request?.description || ticketData.description,
      files: ticketData.request?.files || ticketData.files || []
    };

    const response = await this.post('/tickets', apiData);
    if (response.success) {
      // Transform response back to frontend format
      const transformedTicket = {
        ...response.data,
        request: {
          type: response.data.request_type,
          priority: response.data.priority,
          description: response.data.description
        },
        customer: response.data.customer || {},
        device: response.data.device || {},
        assignedTo: response.data.assigned_user?.name || 'Unassigned'
      };
      return { success: true, data: transformedTicket };
    }
    return response;
  },

  /**
   * Update ticket
   */
  async updateTicket(id, updates) {
    return this.put(`/tickets/${id}`, updates);
  },

  /**
   * Update ticket status
   */
  async updateTicketStatus(id, status, note = '') {
    return this.put(`/tickets/${id}`, { status, note });
  },

  // ============================================================
  // Customers Methods
  // ============================================================

  /**
   * Get all customers
   */
  async getCustomers(params = {}) {
    return this.get('/customers', params);
  },

  // ============================================================
  // Devices Methods
  // ============================================================

  /**
   * Get all devices
   */
  async getDevices(params = {}) {
    return this.get('/devices', params);
  },

  // ============================================================
  // Users Methods
  // ============================================================

  /**
   * Get all users
   */
  async getUsers() {
    return this.get('/users');
  },

  // ============================================================
  // Statistics Methods
  // ============================================================

  /**
   * Get statistics
   */
  async getStats() {
    const response = await this.get('/tickets', { limit: 1000 });
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
  },

  /**
   * Get notifications
   */
  async getNotifications() {
    // Notifications endpoint not implemented yet, return empty array
    return { success: true, data: [] };
  },

  /**
   * Submit public ticket (no auth required)
   */
  async submitPublicTicket(ticketData) {
    console.log('[API] Submitting public ticket with data:', ticketData);

    // Transform frontend format to API format
    const apiData = {
      customer: ticketData.customer,
      device: ticketData.device,
      request_type: ticketData.request?.type || ticketData.request_type,
      priority: ticketData.request?.priority || ticketData.priority,
      description: ticketData.request?.description || ticketData.description,
      files: ticketData.request?.files || ticketData.files || []
    };

    console.log('[API] Transformed API data:', apiData);

    // Use fresh endpoint to bypass Vercel caching
    const response = await this.post('/submit-ticket', apiData);
    console.log('[API] Used fresh endpoint /submit-ticket');
    console.log('[API] Public ticket response:', response);

    if (response.success) {
      // Transform response to match frontend format
      const transformedTicket = {
        id: response.data.id,
        ticket_number: response.data.ticket_number,
        status: response.data.status,
        created_at: response.data.created_at,
        updated_at: response.data.updated_at,
        request: {
          type: response.data.request_type,
          priority: response.data.priority,
          description: response.data.description
        },
        customer: response.data.customer || {},
        device: response.data.device || {},
        assignedTo: response.data.assigned_user?.name || 'Unassigned',
        assigned_user: response.data.assigned_user
      };
      console.log('[API] Transformed ticket:', transformedTicket);
      return { success: true, data: transformedTicket };
    }
    return response;
  }
};

// ============================================================
// Initialize API client with token from storage
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const storedToken = localStorage.getItem('yas_api_token');
  if (storedToken) {
    YAS_API.setToken(storedToken);
  }
});