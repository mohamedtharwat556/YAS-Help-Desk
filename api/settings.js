// Settings endpoint for Vercel
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      if (!supabase) {
        return res.status(500).json({ error: 'Database not configured' });
      }

      const { data: settings, error } = await supabase
        .from('settings')
        .select('*');

      if (error) {
        console.error('Settings error:', error);
        return res.status(500).json({ error: 'Failed to fetch settings' });
      }

      res.status(200).json({
        success: true,
        data: settings || []
      });
    } catch (error) {
      console.error('Settings endpoint error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};