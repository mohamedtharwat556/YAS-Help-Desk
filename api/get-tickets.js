// Get tickets endpoint for Vercel - FRESH VERSION Sept 21 2026
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
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

  const path = req.url.replace('/api/get-tickets', '');

  console.log('[GetTickets API] Request path:', path);
  console.log('[GetTickets API] Request URL:', req.url);

  // GET /api/get-tickets
  if ((path === '' || path.startsWith('?')) && req.method === 'GET') {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const ticketNumber = urlParams.get('ticket_number');

    console.log('[GetTickets API] ticket_number param:', ticketNumber);

    // Public tracking by ticket_number (no auth required) - check FIRST
    if (ticketNumber) {
      try {
        // Normalize ticket number
        let normalizedTicketNumber = ticketNumber.trim().toUpperCase();
        if (!normalizedTicketNumber.startsWith('YAS-SUP-')) {
          normalizedTicketNumber = `YAS-SUP-${normalizedTicketNumber}`;
        }

        console.log('[GetTickets API] Public tracking by ticket_number:', normalizedTicketNumber);

        // Simple query without relations first
        const { data: ticket, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('ticket_number', normalizedTicketNumber)
          .single();

        if (error || !ticket) {
          console.log('[GetTickets API] Track not found:', error);
          return res.status(404).json({ error: 'Ticket not found' });
        }

        console.log('[GetTickets API] Track found:', ticket.ticket_number);

        // Fetch customer and device separately
        const [customerResult, deviceResult] = await Promise.all([
          supabase.from('customers').select('*').eq('id', ticket.customer_id).single(),
          supabase.from('devices').select('*').eq('id', ticket.device_id).single()
        ]);

        const enrichedTicket = {
          ...ticket,
          customer: customerResult.data || null,
          device: deviceResult.data || null,
          assigned_user: null
        };

        // Try to fetch assigned user if assigned_user_id exists
        if (ticket.assigned_user_id) {
          const { data: assignedUser } = await supabase
            .from('users')
            .select('id, name, email, role')
            .eq('id', ticket.assigned_user_id)
            .single();
          
          if (assignedUser) {
            enrichedTicket.assigned_user = assignedUser;
          }
        }

        res.status(200).json({
          success: true,
          data: enrichedTicket
        });
        return;
      } catch (error) {
        console.error('[GetTickets API] Track error:', error);
        res.status(500).json({ error: 'Failed to track ticket', details: error.message });
        return;
      }
    }

    // List all tickets (authenticated)
    const authHeader = req.headers.authorization;
    console.log('[Tickets API] Auth header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[Tickets API] Unauthorized - missing or invalid auth header');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    console.log('[Tickets API] Token length:', token.length);
    const decoded = verifyToken(token);
    console.log('[Tickets API] Token decoded:', !!decoded);

    if (!decoded) {
      console.log('[Tickets API] Invalid token');
      return res.status(401).json({ error: 'Invalid token' });
    }

    try {
      // Fetch tickets without relations to avoid Supabase relationship errors
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('[Tickets API] Fetched tickets count:', tickets?.length || 0);

      // Enrich tickets with assigned_user data
      const enrichedTickets = await Promise.all(tickets.map(async (ticket) => {
        let assignedUser = null;
        if (ticket.assigned_user_id) {
          const { data: user } = await supabase
            .from('users')
            .select('id, name, email, role')
            .eq('id', ticket.assigned_user_id)
            .single();
          
          if (user) {
            assignedUser = user;
          }
        }
        
        return {
          ...ticket,
          assigned_user: assignedUser
        };
      }));

      res.status(200).json({
        success: true,
        data: enrichedTickets || []
      });
    } catch (error) {
      console.error('Get tickets error:', error);
      res.status(500).json({ error: 'Failed to fetch tickets', details: error.message });
    }
  }
  // PUT /api/get-tickets (update ticket via query param)
  else if (req.method === 'PUT') {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const id = urlParams.get('id');

    console.log('[GetTickets API] PUT request received');
    console.log('[GetTickets API] Full URL:', req.url);
    console.log('[GetTickets API] Query params:', Object.fromEntries(urlParams));
    console.log('[GetTickets API] Ticket ID from query:', id);

    if (!id) {
      return res.status(400).json({ error: 'Ticket ID is required' });
    }

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

      console.log('[GetTickets API] Update data:', body);

      // Handle arrays (activities, notes) properly
      let updateData = { ...body };

      // If we're updating activities or notes, we need to fetch current values first
      if (body.activities || body.notes) {
        const { data: currentTicket } = await supabase
          .from('tickets')
          .select('activities, notes')
          .eq('id', id)
          .single();

        console.log('[GetTickets API] Current ticket for merge:', currentTicket);

        if (currentTicket) {
          if (body.activities) {
            updateData.activities = [...(currentTicket.activities || []), ...body.activities];
          }
          if (body.notes) {
            updateData.notes = [...(currentTicket.notes || []), ...body.notes];
          }
        }
      }

      console.log('[GetTickets API] Final update data:', updateData);

      // First, check if ticket exists
      const { data: existingTicket, error: checkError } = await supabase
        .from('tickets')
        .select('id, ticket_number, status')
        .eq('id', id)
        .single();

      console.log('[GetTickets API] Existing ticket check:', { existingTicket, checkError });

      if (checkError || !existingTicket) {
        console.error('[GetTickets API] Ticket does not exist:', checkError);
        return res.status(404).json({ error: 'Ticket not found', details: checkError?.message });
      }

      // Update ticket
      const { data: ticket, error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      console.log('[GetTickets API] Update result:', { ticket, error });

      if (error || !ticket) {
        console.error('[GetTickets API] Update error:', error);
        return res.status(404).json({ error: 'Ticket not found or update failed' });
      }

      // Fetch assigned user if assigned_user_id exists
      let assignedUser = null;
      if (ticket.assigned_user_id) {
        const { data: user } = await supabase
          .from('users')
          .select('id, name, email, role')
          .eq('id', ticket.assigned_user_id)
          .single();
        
        if (user) {
          assignedUser = user;
        }
      }

      const enrichedTicket = {
        ...ticket,
        assigned_user: assignedUser
      };

      console.log('[GetTickets API] Updated successfully:', ticket.ticket_number);

      res.status(200).json({
        success: true,
        message: 'Ticket updated successfully',
        data: enrichedTicket
      });
    } catch (error) {
      console.error('[GetTickets API] Update error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};