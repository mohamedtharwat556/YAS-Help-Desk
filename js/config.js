// ============================================================
// YAS Help Desk - Configuration
// Environment variables for different deployment environments
// ============================================================

'use strict';

// API URL configuration
// For local development: http://localhost:3000/api
// For Vercel deployment: use .js file paths
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : '/api';

window.ENV = {
  API_URL: API_URL
};