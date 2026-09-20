// ============================================================
// YAS Help Desk - API Client
// Connects frontend to backend API
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
      // For Vercel, use /api path without .js suffix
      url = `/api${endpoint}`;
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
        throw new Error(data.message || 'API request failed');
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
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
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
    const response = await this.post('/auth/login', { email, password });
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
      return response.data;
    }
    throw new Error('Login failed');
  },

  /**
   * Register user
   */
  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
      return response.data;
    }
    throw new Error('Registration failed');
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    return this.get('/auth/me');
  },

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword) {
    return this.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
  },

  /**
   * Logout
   */
  logout() {
    this.setToken(null);
    localStorage.removeItem('yas_api_token');
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
   * Get single ticket
   */
  async getTicket(id) {
    return this.get(`/tickets/${id}`);
  },

  /**
   * Create ticket
   */
  async createTicket(ticketData) {
    return this.post('/tickets', ticketData);
  },

  /**
   * Submit public ticket (no authentication required)
   */
  async submitPublicTicket(ticketData) {
    const isVercel = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const url = isVercel ? '/api/public/submit-ticket' : '/api/public/submit-ticket';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit ticket');
    }

    return data;
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
    return this.put(`/tickets/${id}/status`, { status, note });
  },

  /**
   * Add note to ticket
   */
  async addTicketNote(id, note, isInternal = true) {
    return this.post(`/tickets/${id}/notes`, {
      note,
      is_internal: isInternal
    });
  },

  /**
   * Delete ticket
   */
  async deleteTicket(id) {
    return this.delete(`/tickets/${id}`);
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

  /**
   * Get single customer
   */
  async getCustomer(id) {
    return this.get(`/customers/${id}`);
  },

  /**
   * Create customer
   */
  async createCustomer(customerData) {
    return this.post('/customers', customerData);
  },

  /**
   * Update customer
   */
  async updateCustomer(id, updates) {
    return this.put(`/customers/${id}`, updates);
  },

  /**
   * Delete customer
   */
  async deleteCustomer(id) {
    return this.delete(`/customers/${id}`);
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

  /**
   * Get single device
   */
  async getDevice(id) {
    return this.get(`/devices/${id}`);
  },

  /**
   * Create device
   */
  async createDevice(deviceData) {
    return this.post('/devices', deviceData);
  },

  /**
   * Update device
   */
  async updateDevice(id, updates) {
    return this.put(`/devices/${id}`, updates);
  },

  /**
   * Delete device
   */
  async deleteDevice(id) {
    return this.delete(`/devices/${id}`);
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

  /**
   * Get single user
   */
  async getUser(id) {
    return this.get(`/users/${id}`);
  },

  /**
   * Update user
   */
  async updateUser(id, updates) {
    return this.put(`/users/${id}`, updates);
  },

  /**
   * Delete user
   */
  async deleteUser(id) {
    return this.delete(`/users/${id}`);
  },

  // ============================================================
  // Notifications Methods
  // ============================================================

  /**
   * Get notifications
   */
  async getNotifications() {
    return this.get('/notifications');
  },

  /**
   * Mark notification as read
   */
  async markNotificationRead(id) {
    return this.put(`/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead() {
    return this.put('/notifications/read-all');
  },

  /**
   * Delete notification
   */
  async deleteNotification(id) {
    return this.delete(`/notifications/${id}`);
  },

  /**
   * Clear all notifications
   */
  async clearNotifications() {
    return this.delete('/notifications/clear-all');
  },

  // ============================================================
  // Maintenance Methods
  // ============================================================

  /**
   * Get maintenance records
   */
  async getMaintenanceRecords() {
    return this.get('/maintenance');
  },

  /**
   * Create maintenance record
   */
  async createMaintenanceRecord(recordData) {
    return this.post('/maintenance', recordData);
  },

  /**
   * Update maintenance record
   */
  async updateMaintenanceRecord(id, updates) {
    return this.put(`/maintenance/${id}`, updates);
  },

  // ============================================================
  // Settings Methods
  // ============================================================

  /**
   * Get all settings
   */
  async getSettings() {
    return this.get('/settings');
  },

  /**
   * Get single setting
   */
  async getSetting(key) {
    return this.get(`/settings/${key}`);
  },

  /**
   * Update setting
   */
  async updateSetting(key, value, description) {
    return this.put(`/settings/${key}`, { value, description });
  },

  // ============================================================
  // File Upload Methods
  // ============================================================

  /**
   * Upload file
   */
  async uploadFile(file) {
    const isVercel = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const url = isVercel ? '/api/upload' : `${this.baseURL}/upload`;
    
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    });

    return response.json();
  },

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(files) {
    const isVercel = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const url = isVercel ? '/api/upload/multiple' : `${this.baseURL}/upload/multiple`;
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    });

    return response.json();
  },

  /**
   * Delete file
   */
  async deleteFile(filename) {
    return this.delete(`/upload/${filename}`);
  },

  // ============================================================
  // Statistics Methods
  // ============================================================

  /**
   * Get statistics
   */
  async getStats() {
    // This could be implemented as a dedicated endpoint
    // For now, we'll calculate from tickets
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
