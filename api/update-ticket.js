// Update ticket endpoint for Vercel
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const jwtSecret = process.env.JWT_SECRET || 'yas-helpdesk-2026-secret-key';

let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

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
  res.setHeader('Access-Control-Allow-Methods', 'PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Prevent Vercel caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get ticket ID from query parameter
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Ticket ID is required' });
  }

  // Verify authentication
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
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    // Extract id from body if present (for frontend compatibility)
    const ticketId = body.id || id;
    delete body.id; // Remove id from the update data

    console.log('[Update Ticket] Updating ticket:', ticketId);
    console.log('[Update Ticket] Update data:', body);

    // Update ticket
    const { data: ticket, error } = await supabase
      .from('tickets')
      .update(body)
      .eq('id', ticketId)
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        assigned_user:users(id, name, email, role)
      `)
      .single();

    if (error || !ticket) {
      console.error('[Update Ticket] Error:', error);
      return res.status(404).json({ error: 'Ticket not found or update failed' });
    }

    console.log('[Update Ticket] Updated successfully:', ticket.ticket_number);

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket
    });
  } catch (error) {
    console.error('[Update Ticket] Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
