// Vercel Serverless Function Entry Point
const serverless = require('serverless-http');
const app = require('./backend/server');

module.exports = serverless(app);