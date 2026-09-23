// Submit ticket endpoint (no auth required) - FRESH VERSION Sept 21 2026
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://dqepsuecouvnvozcnjth.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZXBzdWVjb3V2bnZvemNuanRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTgxODY3NCwiZXhwIjoyMTA1Mzk0Njc0fQ.yn1zGz8RIbyPKTkjw8YwTZr5cnTvyvd4Tp5COv046HE';

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
    console.error('[SUBMIT-TICKET] Supabase not configured:', { url: !!supabaseUrl, key: !!supabaseKey });
    return res.status(500).json({ error: 'Database not configured' });
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      console.log('[SUBMIT-TICKET] Creating ticket with data:', { customer: body.customer?.name, device: body.device?.model, request_type: body.request_type, timestamp: new Date().toISOString() });

      const { customer, device, request_type, priority = 'medium', description, files = [] } = body || {};

      console.log('[SUBMIT-TICKET] Parsed request data:', { customer, device, request_type, priority, description });

      // Validate required fields
      if (!request_type) {
        console.error('[SUBMIT-TICKET] Missing request_type in request body:', body);
        return res.status(400).json({ error: 'request_type is required' });
      }

      if (!customer || !customer.name || !customer.phone) {
        console.error('[SUBMIT-TICKET] Missing customer data:', customer);
        return res.status(400).json({ error: 'Customer name and phone are required' });
      }

      if (!device || !device.model) {
        console.error('[SUBMIT-TICKET] Missing device data:', device);
        return res.status(400).json({ error: 'Device model is required' });
      }

      // Create or update customer
      let newCustomer;
      try {
        const result = await supabase
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

        if (result.error) {
          console.error('[SUBMIT-TICKET] Customer creation error:', result.error);
          throw result.error;
        }

        newCustomer = result.data;
        console.log('[SUBMIT-TICKET] Customer created:', newCustomer.id);
      } catch (error) {
        console.error('[SUBMIT-TICKET] Customer creation exception:', error);
        return res.status(500).json({ error: 'Failed to create customer', details: error.message });
      }

      // Create device
      let newDevice;
      try {
        const deviceData = {
          customer_id: newCustomer.id,
          type: device.type,
          brand: device.brand,
          model: device.model,
          warranty_status: device.warranty_status || 'unknown'
        };

        // Only add serial_number and purchase_date if they exist
        if (device.serial_number) {
          deviceData.serial_number = device.serial_number;
        }
        if (device.purchase_date) {
          deviceData.purchase_date = device.purchase_date;
        }

        console.log('[SUBMIT-TICKET] Device data to insert:', deviceData);

        const result = await supabase
          .from('devices')
          .insert(deviceData)
          .select()
          .single();

        if (result.error) {
          console.error('[SUBMIT-TICKET] Device creation error:', result.error);
          throw result.error;
        }

        newDevice = result.data;
        console.log('[SUBMIT-TICKET] Device created:', newDevice.id);
      } catch (error) {
        console.error('[SUBMIT-TICKET] Device creation exception:', error);
        return res.status(500).json({ error: 'Failed to create device', details: error.message });
      }

      // Generate ticket number with retry logic
      let finalTicketNumber;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        const { data: lastTicket } = await supabase
          .from('tickets')
          .select('ticket_number')
          .order('created_at', { ascending: false })
          .limit(1);

        const lastNumber = lastTicket && lastTicket.length > 0
          ? parseInt(lastTicket[0].ticket_number.replace('YAS-SUP-', ''))
          : 10480;

        // Start from lastNumber + 1 + attempts to find next available
        const ticketNumber = `YAS-SUP-${lastNumber + 1 + attempts}`;

        console.log(`[SUBMIT-TICKET] Attempt ${attempts + 1}: Generated ticket number: ${ticketNumber} (last was: ${lastNumber})`);

        // Check if this ticket number already exists
        const { data: existingTicket } = await supabase
          .from('tickets')
          .select('id')
          .eq('ticket_number', ticketNumber)
          .single();

        if (!existingTicket) {
          finalTicketNumber = ticketNumber;
          console.log(`[SUBMIT-TICKET] Found unique ticket number: ${finalTicketNumber}`);
          break;
        }

        console.log(`[SUBMIT-TICKET] Ticket number ${ticketNumber} already exists, trying next...`);
        attempts++;
      }

      if (!finalTicketNumber) {
        throw new Error('Failed to generate unique ticket number after multiple attempts');
      }

      console.log('[SUBMIT-TICKET] Final ticket number:', finalTicketNumber);

      // Get Adam Farouk's user ID to assign as default technician
      let adamUserId = null;
      try {
        const { data: adamUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', 'adam@yas.sa')
          .single();
        
        if (adamUser) {
          adamUserId = adamUser.id;
          console.log('[SUBMIT-TICKET] Found Adam Farouk ID:', adamUserId);
        }
      } catch (error) {
        console.log('[SUBMIT-TICKET] Could not find Adam Farouk, will leave unassigned');
      }

      // Create ticket
      let ticket;
      try {
        console.log('[SUBMIT-TICKET] About to create ticket with data:', {
          ticket_number: finalTicketNumber,
          customer_id: newCustomer.id,
          device_id: newDevice.id,
          request_type,
          priority,
          description,
          assigned_user_id: adamUserId
        });

        const result = await supabase
          .from('tickets')
          .insert({
            ticket_number: finalTicketNumber,
            customer_id: newCustomer.id,
            device_id: newDevice.id,
            request_type,
            priority,
            description,
            files,
            status: 'received',
            assigned_user_id: adamUserId
          })
          .select(`
            *,
            customer:customers(*),
            device:devices(*),
            assigned_user:users(id, name, email, role)
          `)
          .single();

        console.log('[SUBMIT-TICKET] Supabase insert result:', result);

        if (result.error) {
          console.error('[SUBMIT-TICKET] Ticket creation error:', result.error);
          throw result.error;
        }

        ticket = result.data;
        console.log('[SUBMIT-TICKET] Ticket created successfully:', ticket.id, 'Ticket number:', ticket.ticket_number);
        console.log('[SUBMIT-TICKET] Full ticket object:', JSON.stringify(ticket, null, 2));

        res.status(201).json({
          success: true,
          message: 'Ticket created successfully',
          data: ticket
        });
      } catch (error) {
        console.error('[SUBMIT-TICKET] Ticket creation exception:', error);
        return res.status(500).json({ error: 'Failed to create ticket', details: error.message });
      }
    } catch (error) {
      console.error('[SUBMIT-TICKET] Create ticket error:', error);
      res.status(500).json({ error: 'Failed to create ticket', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};