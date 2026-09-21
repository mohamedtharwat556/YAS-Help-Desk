// ============================================================
// YAS Help Desk - API Test Script
// Run this to test the API endpoints locally
// ============================================================

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://dqepsuecouvnvozcnjth.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxZXBzdWVjb3V2bnZvemNuanRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTgxODY3NCwiZXhwIjoyMTA1Mzk0Njc0fQ.yn1zGz8RIbyPKTkjw8YwTZr5cnTvyvd4Tp5COv046HE';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('[TEST] Starting API Test...');
console.log('[TEST] Supabase URL:', supabaseUrl);
console.log('[TEST] Supabase Key:', supabaseKey ? 'Present' : 'Missing');

// Test 1: Public Ticket Creation
app.post('/test-public-ticket', async (req, res) => {
  console.log('[TEST] Testing public ticket creation...');
  console.log('[TEST] Request body:', JSON.stringify(req.body, null, 2));

  try {
    const { customer, device, request_type, priority = 'medium', description, files = [] } = req.body;

    console.log('[TEST] Step 1: Creating customer...');
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
      console.error('[TEST] Customer creation failed:', customerError);
      return res.status(500).json({ error: 'Customer creation failed', details: customerError });
    }

    console.log('[TEST] Customer created successfully:', newCustomer.id);

    console.log('[TEST] Step 2: Creating device...');
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
      console.error('[TEST] Device creation failed:', deviceError);
      return res.status(500).json({ error: 'Device creation failed', details: deviceError });
    }

    console.log('[TEST] Device created successfully:', newDevice.id);

    console.log('[TEST] Step 3: Generating ticket number with retry logic...');
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

      console.log(`[TEST] Attempt ${attempts + 1}: Generated ticket number: ${ticketNumber} (last was: ${lastNumber})`);

      // Check if this ticket number already exists
      const { data: existingTicket } = await supabase
        .from('tickets')
        .select('id')
        .eq('ticket_number', ticketNumber)
        .single();

      if (!existingTicket) {
        finalTicketNumber = ticketNumber;
        console.log(`[TEST] Found unique ticket number: ${finalTicketNumber}`);
        break;
      }

      console.log(`[TEST] Ticket number ${ticketNumber} already exists, trying next...`);
      attempts++;
    }

    if (!finalTicketNumber) {
      throw new Error('Failed to generate unique ticket number after multiple attempts');
    }

    console.log('[TEST] Final ticket number:', finalTicketNumber);

    console.log('[TEST] Step 4: Creating ticket...');
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
        device:devices(*)
      `)
      .single();

    if (ticketError) {
      console.error('[TEST] Ticket creation failed:', ticketError);
      return res.status(500).json({ error: 'Ticket creation failed', details: ticketError });
    }

    console.log('[TEST] Ticket created successfully:', ticket.id, ticket.ticket_number);

    res.status(201).json({
      success: true,
      message: 'Test ticket created successfully',
      data: ticket
    });
  } catch (error) {
    console.error('[TEST] Test failed:', error);
    res.status(500).json({ error: 'Test failed', details: error.message });
  }
});

// Test 2: Get All Tickets
app.get('/test-tickets', async (req, res) => {
  console.log('[TEST] Testing get all tickets...');

  try {
    const { data: tickets, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customer:customers(*),
        device:devices(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[TEST] Get tickets failed:', error);
      return res.status(500).json({ error: 'Get tickets failed', details: error });
    }

    console.log('[TEST] Retrieved', tickets.length, 'tickets');

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('[TEST] Test failed:', error);
    res.status(500).json({ error: 'Test failed', details: error.message });
  }
});

// Test 3: Test Data for Manual Testing
app.get('/test-data', (req, res) => {
  res.json({
    testData: {
      customer: {
        name: 'Test User',
        phone: '0550000000',
        whatsapp: '0550000000',
        email: 'test@example.com',
        company: 'Test Company'
      },
      device: {
        type: 'laptop',
        brand: 'Dell',
        model: 'Test Model',
        serial_number: 'TEST-001',
        purchase_date: '2024-01-01',
        warranty_status: 'active'
      },
      request_type: 'technical',
      priority: 'medium',
      description: 'This is a test ticket from the API test script',
      files: []
    }
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🧪 API Test Server running on http://localhost:${PORT}`);
  console.log(`📡 Test endpoints available:`);
  console.log(`   POST http://localhost:${PORT}/test-public-ticket`);
  console.log(`   GET  http://localhost:${PORT}/test-tickets`);
  console.log(`   GET  http://localhost:${PORT}/test-data`);
  console.log(`\n🧪 To test, run:`);
  console.log(`   curl -X POST http://localhost:${PORT}/test-public-ticket -H "Content-Type: application/json" -d @test-data.json`);
});