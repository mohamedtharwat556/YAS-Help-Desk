// Public ticket submission endpoint (no authentication required)
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

  if (req.method === 'POST') {
    try {
      const { customer_name, customer_phone, customer_email, customer_company, device_type, device_brand, device_model, device_serial, request_type, priority, description } = req.body || {};

      // Validate required fields
      if (!customer_name || !customer_phone || !device_type || !request_type || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!supabase) {
        return res.status(500).json({ error: 'Database not configured' });
      }

      // Check if customer exists by phone
      let customerId;
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', customer_phone)
        .single();

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Create new customer
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: customer_name,
            phone: customer_phone,
            email: customer_email || null,
            company: customer_company || null
          })
          .select()
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // Create device if provided
      let deviceId = null;
      if (device_type && device_brand) {
        const { data: newDevice, error: deviceError } = await supabase
          .from('devices')
          .insert({
            customer_id: customerId,
            type: device_type,
            brand: device_brand,
            model: device_model || null,
            serial_number: device_serial || null
          })
          .select()
          .single();

        if (!deviceError) {
          deviceId = newDevice.id;
        }
      }

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
          customer_id: customerId,
          device_id: deviceId,
          request_type: request_type,
          priority: priority || 'medium',
          description: description,
          status: 'received'
        })
        .select(`
          *,
          customer:customers(*),
          device:devices(*)
        `)
        .single();

      if (ticketError) throw ticketError;

      res.status(201).json({
        success: true,
        message: 'Ticket submitted successfully',
        data: ticket
      });
    } catch (error) {
      console.error('Submit ticket error:', error);
      res.status(500).json({ error: 'Failed to submit ticket' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};