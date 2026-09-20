// Auth login endpoint
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

module.exports = async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      // Parse body for Vercel serverless functions
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          body = {};
        }
      }

      const { email, password } = body || {};
      
      console.log('Login attempt:', { email, hasPassword: !!password });

      if (!email || !password) {
        console.log('Missing credentials:', { email: !!email, password: !!password });
        return res.status(400).json({ error: 'Email and password are required' });
      }

      if (!supabase) {
        console.log('Supabase not configured:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
        return res.status(500).json({ error: 'Database not configured' });
      }

      console.log('Looking up user:', email);
      
      // Find user by email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      console.log('User lookup result:', { error: error?.message, userFound: !!user });

      if (error || !user) {
        console.log('User not found or error:', error?.message);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      console.log('Checking password for user:', user.email);
      const validPassword = await bcrypt.compare(password, user.password_hash);
      console.log('Password check result:', { valid: validPassword });
      
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is active
      if (!user.is_active) {
        return res.status(403).json({ error: 'Account is inactive' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};