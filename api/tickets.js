// Tickets endpoint for Vercel
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const path = req.url.replace('/api/tickets', '');

  // GET /api/tickets
  if ((path === '' || path.startsWith('?')) && req.method === 'GET') {
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
          assigned_user:users(id, name, email, role)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.status(200).json({
        success: true,
        data: tickets || []
      });
    } catch (error) {
      console.error('Get tickets error:', error);
      res.status(500).json({ error: 'Failed to fetch tickets' });
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
  // PUT /api/tickets/:id
  else if (path.match(/^\/\w+/) && req.method === 'PUT') {
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
      const id = path.replace('/', '');
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      const { data: ticket, error } = await supabase
        .from('tickets')
        .update(body)
        .eq('id', id)
        .select(`
          *,
          customer:customers(*),
          device:devices(*),
          assigned_user:users(id, name, email, role)
        `)
        .single();

      if (error || !ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Ticket updated successfully',
        data: ticket
      });
    } catch (error) {
      console.error('Update ticket error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};