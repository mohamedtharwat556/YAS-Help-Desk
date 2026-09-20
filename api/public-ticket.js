// Public ticket creation endpoint (no auth required)
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
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!supabase) {
    console.error('Supabase not configured:', { url: !!supabaseUrl, key: !!supabaseKey });
    return res.status(500).json({ error: 'Database not configured' });
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      console.log('Creating ticket with data:', { customer: body.customer?.name, device: body.device?.model, request_type: body.request_type });

      const { customer, device, request_type, priority = 'medium', description, files = [] } = body || {};

      // Validate required fields
      if (!request_type) {
        console.error('Missing request_type in request body:', body);
        return res.status(400).json({ error: 'request_type is required' });
      }

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

      if (customerError) {
        console.error('Customer creation error:', customerError);
        throw customerError;
      }

      console.log('Customer created:', newCustomer.id);

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

      if (deviceError) {
        console.error('Device creation error:', deviceError);
        throw deviceError;
      }

      console.log('Device created:', newDevice.id);

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

      console.log('Ticket number:', ticketNumber);

      // Check if ticket number already exists (to avoid duplicates)
      const { data: existingTicket } = await supabase
        .from('tickets')
        .select('id')
        .eq('ticket_number', ticketNumber)
        .single();

      let finalTicketNumber = ticketNumber;
      if (existingTicket) {
        console.log('Ticket number already exists, trying next number');
        finalTicketNumber = `YAS-SUP-${lastNumber + 2}`;
        console.log('Final ticket number:', finalTicketNumber);
      }

      // Create ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          ticket_number: finalTicketNumber,
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

      if (ticketError) {
        console.error('Ticket creation error:', ticketError);
        throw ticketError;
      }

      console.log('Ticket created successfully:', ticket.id, 'Ticket number:', ticket.ticket_number);
      console.log('Full ticket object:', JSON.stringify(ticket, null, 2));

      res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: ticket
      });
    } catch (error) {
      console.error('Create ticket error:', error);
      res.status(500).json({ error: 'Failed to create ticket', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
