// Tickets API endpoint
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Helper function to verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  // For GET requests, verify token
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    try {
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select(`
          *,
          customer:customers(*),
          device:devices(*),
          assigned_to_user:users(id, name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.status(200).json({
        success: true,
        data: tickets || []
      });
    } catch (error) {
      console.error('Tickets error:', error);
      res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  } else if (req.method === 'POST') {
    try {
      const ticketData = req.body;

      // Generate ticket number
      const { data: lastTicket } = await supabase
        .from('tickets')
        .select('ticket_number')
        .order('created_at', { ascending: false })
        .limit(1);

      const lastNumber = lastTicket && lastTicket.length > 0
        ? parseInt(lastTicket[0].ticket_number.replace('YAS-SUP-', ''))
        : 10480;
      const ticketNumber = `YAS-SUP-${lastNumber + 1}`;

      const { data: ticket, error } = await supabase
        .from('tickets')
        .insert({
          ...ticketData,
          ticket_number: ticketNumber,
          status: 'received'
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: ticket
      });
    } catch (error) {
      console.error('Create ticket error:', error);
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};