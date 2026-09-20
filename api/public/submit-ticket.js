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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      const { customer, device, request_type, priority = 'medium', description, files = [] } = body || {};

      if (!customer || !customer.name || !customer.phone) {
        return res.status(400).json({ error: 'Customer name and phone are required' });
      }

      if (!device || !device.type || !device.model) {
        return res.status(400).json({ error: 'Device type and model are required' });
      }

      if (!request_type || !description) {
        return res.status(400).json({ error: 'Request type and description are required' });
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
        return res.status(500).json({ error: 'Failed to create customer' });
      }

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
        return res.status(500).json({ error: 'Failed to create device' });
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

      // Get settings for auto-assignment
      const { data: settings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'auto_assign')
        .single();

      let assignedTo = null;
      if (settings?.value?.enabled) {
        const { data: engineer } = await supabase
          .from('users')
          .select('id')
          .eq('email', settings.value.default_engineer_id)
          .single();
        assignedTo = engineer?.id;
      }

      // Create ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          ticket_number: ticketNumber,
          customer_id: newCustomer.id,
          device_id: newDevice.id,
          assigned_to: assignedTo,
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
        return res.status(500).json({ error: 'Failed to create ticket' });
      }

      // Create initial activities
      const activities = [
        {
          ticket_id: ticket.id,
          label: 'تم إنشاء الطلب',
          description: `أنشأ العميل ${customer.name} طلب دعم جديد`,
          type: 'create'
        },
        {
          ticket_id: ticket.id,
          label: 'تم استلام الطلب',
          description: assignedTo ? 'تم استلام الطلب وإسناده تلقائياً' : 'تم استلام الطلب',
          type: 'assign'
        }
      ];

      await supabase.from('ticket_activities').insert(activities);

      // Create notification
      if (assignedTo) {
        await supabase.from('notifications').insert({
          user_id: assignedTo,
          type: 'new',
          title: 'طلب دعم جديد',
          message: `طلب دعم جديد من ${customer.name} — ${ticket.ticket_number}`,
          ticket_id: ticket.id
        });
      }

      res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: ticket
      });
    } catch (error) {
      console.error('Create ticket error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};