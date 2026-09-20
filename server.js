// Vercel serverless function - using backend server
const serverless = require('serverless-http');
const app = require('./backend/server');

module.exports = serverless(app);