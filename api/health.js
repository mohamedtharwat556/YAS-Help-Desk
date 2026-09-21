// Health check endpoint for Vercel
module.exports = async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.1',
      environment: process.env.NODE_ENV || 'production',
      database: process.env.SUPABASE_URL ? 'configured' : 'not configured'
    };

    res.status(200).json({
      success: true,
      data: health
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
