// ============================================================
// YAS Help Desk - API Client with Simplified Backend
// Connects to Vercel serverless functions with Supabase
// ============================================================

'use strict';

const YAS_API = {
  // Use environment variable for production, fallback to localhost for development
  baseURL: window.ENV?.API_URL || 'http://localhost:3000/api',
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
      // For Vercel, use .js suffix for serverless functions
      // But don't add .js if already present or if it's a full URL with query params
      if (endpoint.includes('.js') || endpoint.includes('?')) {
        url = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
      } else {
        url = `/api${endpoint}.js`;
      }
    } else {
      url = `${this.baseURL}${endpoint}`;
    }

    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const isVercel = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    let url;
    
    if (isVercel) {
      // For Vercel, add .js suffix before query params
      const queryString = new URLSearchParams(params).toString();
      const baseEndpoint = endpoint.endsWith('.js') ? endpoint : `${endpoint}.js`;
      url = queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;
    } else {
      const queryString = new URLSearchParams(params).toString();
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
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
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
    return this.get('/tickets', params);
  },

  /**
   * Create ticket
   */
  async createTicket(ticketData) {
    return this.post('/tickets', ticketData);
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