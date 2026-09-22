// Tickets endpoint for Vercel
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

  const path = req.url.replace('/api/tickets', '');

  console.log('[Tickets API] Request path:', path);
  console.log('[Tickets API] Request method:', req.method);

  // PUT /api/tickets (update ticket via query param) - check FIRST
  if (req.method === 'PUT') {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const id = urlParams.get('id');

    console.log('[Tickets API] PUT request received');
    console.log('[Tickets API] Query params:', Object.fromEntries(urlParams));
    console.log('[Tickets API] Ticket ID from query:', id);

    if (!id) {
      console.log('[Tickets API] No ID provided');
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

      console.log('[Tickets API] Update data:', body);

      // Handle arrays (activities, notes) properly
      let updateData = { ...body };

      // If we're updating activities or notes, we need to fetch current values first
      if (body.activities || body.notes) {
        const { data: currentTicket } = await supabase
          .from('tickets')
          .select('activities, notes')
          .eq('id', id)
          .single();

        if (currentTicket) {
          if (body.activities) {
            updateData.activities = [...(currentTicket.activities || []), ...body.activities];
          }
          if (body.notes) {
            updateData.notes = [...(currentTicket.notes || []), ...body.notes];
          }
        }
      }

      console.log('[Tickets API] Final update data:', updateData);

      // Update ticket
      const { data: ticket, error } = await supabase
        .from('tickets')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          customer:customers(*),
          device:devices(*),
          assigned_user:users(id, name, email, role)
        `)
        .single();

      if (error || !ticket) {
        console.error('[Tickets API] Update error:', error);
        return res.status(404).json({ error: 'Ticket not found or update failed' });
      }

      console.log('[Tickets API] Updated successfully:', ticket.ticket_number);

      res.status(200).json({
        success: true,
        message: 'Ticket updated successfully',
        data: ticket
      });
    } catch (error) {
      console.error('[Tickets API] Update error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
  // GET /api/tickets (list all or single)
  else if (req.method === 'GET') {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const id = urlParams.get('id');
    const ticketNumber = urlParams.get('ticket_number');

    // Single ticket by ID (authenticated)
    if (id && !ticketNumber) {
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
        // Fetch ticket without relations first
        const { data: ticket, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !ticket) {
          return res.status(404).json({ error: 'Ticket not found' });
        }

        // Fetch customer and device separately
        const [customerResult, deviceResult] = await Promise.all([
          supabase.from('customers').select('*').eq('id', ticket.customer_id).single(),
          supabase.from('devices').select('*').eq('id', ticket.device_id).single()
        ]);

        // Build enriched ticket object
        const enrichedTicket = {
          ...ticket,
          customer: customerResult.data || null,
          device: deviceResult.data || null
        };

        res.status(200).json({
          success: true,
          data: enrichedTicket
        });
      } catch (error) {
        console.error('Get ticket error:', error);
        res.status(500).json({ error: 'Failed to fetch ticket', details: error.message });
      }
    }
    // Public tracking by ticket_number or ID
    else if (ticketNumber || id) {
      try {
        let ticket;
        let error;

        console.log('[Tickets API] Public tracking request');
        console.log('[Tickets API] ticket_number:', ticketNumber);
        console.log('[Tickets API] id:', id);

        // Try to search by ticket_number first (for public tracking)
        if (ticketNumber) {
          // Normalize ticket number
          let normalizedTicketNumber = ticketNumber.trim().toUpperCase();
          if (!normalizedTicketNumber.startsWith('YAS-SUP-')) {
            normalizedTicketNumber = `YAS-SUP-${normalizedTicketNumber}`;
          }

          console.log('[Tickets API] Tracking by ticket_number:', normalizedTicketNumber);

          const result = await supabase
            .from('tickets')
            .select(`
              *,
              customer:customers(*),
              device:devices(*),
              assigned_user:users(id, name, email, role)
            `)
            .eq('ticket_number', normalizedTicketNumber)
            .single();

          console.log('[Tickets API] Tracking result:', result);
          ticket = result.data;
          error = result.error;
        } else if (id) {
          // Try to search by UUID (for authenticated endpoints)
          console.log('[Tickets API] Tracking by ID:', id);

          const result = await supabase
            .from('tickets')
            .select(`
              *,
              customer:customers(*),
              device:devices(*),
              assigned_user:users(id, name, email, role)
            `)
            .eq('id', id)
            .single();

          console.log('[Tickets API] Tracking by ID result:', result);
          ticket = result.data;
          error = result.error;
        }

        if (error || !ticket) {
          console.log('[Tickets API] Track not found:', error);
          return res.status(404).json({ error: 'Ticket not found' });
        }

        console.log('[Tickets API] Track found:', ticket.ticket_number);

        res.status(200).json({
          success: true,
          data: ticket
        });
        return;
      } catch (error) {
        console.error('[Tickets API] Track error:', error);
        res.status(500).json({ error: 'Failed to track ticket', details: error.message });
        return;
      }
    }
    // List all tickets (authenticated)
    else {
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

        res.status(200).json({
          success: true,
          data: tickets || []
        });
      } catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({ error: 'Failed to fetch tickets', details: error.message });
      }
    }
  } 
  // POST /api/tickets
  else if (path === '' && req.method === 'POST') {
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

      const { customer, device, request_type, priority = 'medium', description, files = [] } = body || {};

      // Create or update customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .upsert({
          name: customer.name,
          phone: customer.phone,
          whatsapp: customer.whatsapp || customer.phone,
          email: customer.email,
          company: customer.company
        }, {
          onConflict: 'phone'
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Create device
      const { data: newDevice, error: deviceError } = await supabase
        .from('devices')
        .insert({
          customer_id: newCustomer.id,
          type: device.type,
          brand: device.brand,
          model: device.model,
          serial_number: device.serial_number,
          purchase_date: device.purchase_date,
          warranty_status: device.warranty_status || 'unknown'
        })
        .select()
        .single();

      if (deviceError) throw deviceError;

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

      // Create ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          ticket_number: ticketNumber,
          customer_id: newCustomer.id,
          device_id: newDevice.id,
          request_type,
          priority,
          description,
          files,
          status: 'received'
        })
        .select(`
          *,
          customer:customers(*),
          device:devices(*),
          assigned_user:users(id, name, email, role)
        `)
        .single();

      if (ticketError) throw ticketError;

      res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: ticket
      });
    } catch (error) {
      console.error('Create ticket error:', error);
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};