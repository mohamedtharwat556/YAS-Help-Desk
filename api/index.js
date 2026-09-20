// Simple health check for testing
module.exports = function handler(req, res) {
  res.status(200).json({
    status: 'OK',
    message: 'YAS Help Desk API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    method: req.method,
    url: req.url
  });
};