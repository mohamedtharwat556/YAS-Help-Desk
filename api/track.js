// Public tracking endpoint (separate file for Vercel)
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ticket_number } = req.query;

  if (!ticket_number) {
    return res.status(400).json({ error: 'Ticket number is required' });
  }

  try {
    // Normalize ticket number
    let normalizedTicketNumber = ticket_number.trim().toUpperCase();
    if (!normalizedTicketNumber.startsWith('YAS-SUP-')) {
      normalizedTicketNumber = `YAS-SUP-${normalizedTicketNumber}`;
    }

    console.log('[Track API] Searching for:', normalizedTicketNumber);

    // Simple query without relations first
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('ticket_number', normalizedTicketNumber)
      .single();

    if (error || !ticket) {
      console.log('[Track API] Not found:', error);
      return res.status(404).json({ error: 'Ticket not found' });
    }

    console.log('[Track API] Found ticket:', ticket.ticket_number);

    // Fetch customer and device separately
    const [customerResult, deviceResult] = await Promise.all([
      supabase.from('customers').select('*').eq('id', ticket.customer_id).single(),
      supabase.from('devices').select('*').eq('id', ticket.device_id).single()
    ]);

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
    console.error('[Track API] Error:', error);
    res.status(500).json({ error: 'Failed to track ticket', details: error.message });
  }
};
