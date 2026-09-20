// Add note to ticket endpoint
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

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
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const id = req.query.id;

  if (req.method === 'POST') {
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

      const { note, is_internal = true } = body || {};

      if (!note) {
        return res.status(400).json({ error: 'Note is required' });
      }

      // Add note
      const { data: newNote, error } = await supabase
        .from('ticket_notes')
        .insert({
          ticket_id: id,
          user_id: decoded.userId,
          note,
          is_internal
        })
        .select('*, user:users(id, name)')
        .single();

      if (error) {
        return res.status(500).json({ error: 'Failed to add note' });
      }

      // Add activity
      await supabase.from('ticket_activities').insert({
        ticket_id: id,
        label: 'تمت إضافة ملاحظة داخلية',
        description: note.substring(0, 80) + (note.length > 80 ? '...' : ''),
        type: 'note'
      });

      res.status(201).json({
        success: true,
        message: 'Note added successfully',
        data: newNote
      });
    } catch (error) {
      console.error('Add note error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};