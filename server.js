// Simple Vercel serverless function
module.exports = (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Health check
  if (req.url === '/health' || req.url === '/api/health') {
    res.status(200).json({
      status: 'OK',
      message: 'YAS Help Desk API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
    return;
  }

  // Simple auth endpoint for testing
  if (req.url === '/api/auth/login' && req.method === 'POST') {
    res.status(200).json({
      message: 'Auth endpoint placeholder',
      method: req.method,
      body: req.body
    });
    return;
  }

  // Default response
  res.status(200).json({
    message: 'YAS Help Desk API',
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
};