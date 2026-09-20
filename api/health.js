// Health check endpoint
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

module.exports = async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    let dbStatus = 'disconnected';
    let dbError = null;

    if (supabase) {
      try {
        const { error } = await supabase.from('users').select('count').limit(1);
        if (!error) {
          dbStatus = 'connected';
        } else {
          dbError = error.message;
        }
      } catch (err) {
        dbError = err.message;
      }
    }

    res.status(200).json({
      status: 'OK',
      message: 'YAS Help Desk API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        error: dbError
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};