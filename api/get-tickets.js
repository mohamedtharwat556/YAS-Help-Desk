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
          .select('*, notes, activities')
          .eq('ticket_number', normalizedTicketNumber)
          .single();

        if (error || !ticket) {
          console.log('[GetTickets API] Track not found:', error);
          return res.status(404).json({ error: 'Ticket not found' });
        }

        console.log('[GetTickets API] Track found:', ticket.ticket_number);
        console.log('[GetTickets API] Ticket notes:', ticket.notes);
        console.log('[GetTickets API] Ticket activities:', ticket.activities);

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
      console.log('[Tickets API] Fetching tickets from Supabase...');

      // Fetch tickets without relations first
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('*, notes, activities')
        .order('created_at', { ascending: false });

      console.log('[Tickets API] Supabase response:', { tickets, error });

      if (error) {
        console.error('[Tickets API] Supabase error:', error);
        throw error;
      }

      console.log('[Tickets API] Fetched tickets count:', tickets?.length || 0);
      console.log('[Tickets API] Tickets data:', JSON.stringify(tickets, null, 2));

      // Enrich tickets with customer, device, and assigned_user data
      const enrichedTickets = await Promise.all(tickets.map(async (ticket) => {
        let customer = null;
        let device = null;
        let assignedUser = null;

        // Fetch customer
        if (ticket.customer_id) {
          const { data: cust } = await supabase
            .from('customers')
            .select('*')
            .eq('id', ticket.customer_id)
            .single();
          if (cust) customer = cust;
        }

        // Fetch device
        if (ticket.device_id) {
          const { data: dev } = await supabase
            .from('devices')
            .select('*')
            .eq('id', ticket.device_id)
            .single();
          if (dev) device = dev;
        }

        // Fetch assigned user
        if (ticket.assigned_user_id) {
          const { data: user } = await supabase
            .from('users')
            .select('id, name, email, role')
            .eq('id', ticket.assigned_user_id)
            .single();
          if (user) assignedUser = user;
        }

        return {
          ...ticket,
          customer: customer,
          device: device,
          assigned_user: assignedUser
        };
      }));

      console.log('[Tickets API] Enriched tickets count:', enrichedTickets.length);

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

      // Fetch customer details for email
      let customer = null;
      try {
        const { data: customerData } = await supabase
          .from('customers')
          .select('*')
          .eq('id', ticket.customer_id)
          .single();
        
        if (customerData) {
          customer = customerData;
        }
      } catch (error) {
        console.log('[GetTickets API] Could not fetch customer for email');
      }

      // Send email notification for status change
      if (body.status && body.status !== existingTicket.status && customer) {
        try {
          const statusLabels = {
            'received': 'مستلمة',
            'contacting': 'جاري التواصل',
            'diagnosing': 'جاري الفحص',
            'maintenance': 'قيد الصيانة',
            'waiting': 'بانتظار العميل',
            'resolved': 'تم الحل',
            'closed': 'مغلق'
          };

          const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تحديث حالة التذكرة - YAS Help Desk</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1a56db 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .status-update { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #10b981; }
    .status-update h2 { margin-top: 0; color: #10b981; font-size: 18px; }
    .old-status { color: #ef4444; font-weight: bold; }
    .new-status { color: #10b981; font-weight: bold; font-size: 20px; }
    .info-row { display: flex; margin: 10px 0; }
    .info-label { font-weight: bold; width: 120px; color: #666; }
    .info-value { flex: 1; }
    .cta-button { display: inline-block; background: #1a56db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📢 تحديث حالة التذكرة</h1>
      <p>تم تحديث حالة تذكرتك</p>
    </div>
    <div class="content">
      <div class="status-update">
        <h2>تغيير الحالة</h2>
        <div class="info-row">
          <span class="info-label">من:</span>
          <span class="old-status">${statusLabels[existingTicket.status] || existingTicket.status}</span>
        </div>
        <div class="info-row">
          <span class="info-label">إلى:</span>
          <span class="new-status">${statusLabels[body.status] || body.status}</span>
        </div>
        <div class="info-row">
          <span class="info-label">رقم التذكرة:</span>
          <span class="info-value">${ticket.ticket_number}</span>
        </div>
      </div>
      <div style="text-align: center;">
        <a href="https://yas-help-desk.vercel.app/tracking.html" class="cta-button">تتبع حالة تذكرتك</a>
      </div>
      <div class="footer">
        <p>للتتبع حالة تذكرتك، يمكنك زيارة <a href="https://yas-help-desk.vercel.app/tracking.html">صفحة التتبع</a></p>
        <p>تواصل معنا على واتساب: <a href="https://wa.me/201101267185">+201101267185</a></p>
        <p>© 2026 YAS Help Desk - جميع الحقوق محفوظة</p>
      </div>
    </div>
  </div>
</body>
</html>
          `;

          const emailText = `
تحديث حالة التذكرة - YAS Help Desk

رقم التذكرة: ${ticket.ticket_number}
الحالة السابقة: ${statusLabels[existingTicket.status] || existingTicket.status}
الحالة الجديدة: ${statusLabels[body.status] || body.status}

لتتبع حالة تذكرتك: https://yas-help-desk.vercel.app/tracking.html
تواصل معنا: https://wa.me/201101267185
          `;

          fetch('https://yas-help-desk.vercel.app/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: customer.email || customer.phone + '@example.com',
              subject: `تحديث حالة التذكرة - ${ticket.ticket_number}`,
              html: emailHtml,
              text: emailText
            })
          }).catch(err => console.error('[GetTickets API] Email notification error:', err));

          console.log('[GetTickets API] Email notification queued for status change');
        } catch (emailError) {
          console.error('[GetTickets API] Email notification error:', emailError);
        }
      }

      // Send email notification for ticket closure
      if (body.status === 'closed' && existingTicket.status !== 'closed' && customer) {
        try {
          const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تم إغلاق التذكرة - YAS Help Desk</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .ticket-closed { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #10b981; }
    .ticket-closed h2 { margin-top: 0; color: #10b981; font-size: 18px; }
    .info-row { display: flex; margin: 10px 0; }
    .info-label { font-weight: bold; width: 120px; color: #666; }
    .info-value { flex: 1; }
    .rating-section { background: #fffbeb; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 2px dashed #f59e0b; }
    .rating-section h3 { margin-top: 0; color: #f59e0b; }
    .cta-button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ تم إغلاق التذكرة</h1>
      <p>شكراً لك على تواصلك معنا</p>
    </div>
    <div class="content">
      <div class="ticket-closed">
        <h2>تم إغلاق التذكرة بنجاح</h2>
        <div class="info-row">
          <span class="info-label">رقم التذكرة:</span>
          <span class="info-value">${ticket.ticket_number}</span>
        </div>
      </div>
      <div class="rating-section">
        <h3>⭐ قيم خدمتنا</h3>
        <p>نحب معرفة رأيك في الخدمة التي قدمناها لك.</p>
        <p>يمكنك تقييم الخدمة من خلال صفحة التتبع.</p>
      </div>
      <div style="text-align: center;">
        <a href="https://yas-help-desk.vercel.app/tracking.html" class="cta-button">تتبع حالة تذكرتك</a>
      </div>
      <div class="footer">
        <p>للتتبع حالة تذكرتك: <a href="https://yas-help-desk.vercel.app/tracking.html">صفحة التتبع</a></p>
        <p>تواصل معنا على واتساب: <a href="https://wa.me/201101267185">+201101267185</a></p>
        <p>© 2026 YAS Help Desk - جميع الحقوق محفوظة</p>
      </div>
    </div>
  </div>
</body>
</html>
          `;

          const emailText = `
تم إغلاق التذكرة - YAS Help Desk

رقم التذكرة: ${ticket.ticket_number}

شكراً لك على تواصلك معنا.
نحب معرفة رأيك في الخدمة من خلال صفحة التتبع.

لتتبع حالة تذكرتك: https://yas-help-desk.vercel.app/tracking.html
تواصل معنا: https://wa.me/201101267185
          `;

          fetch('https://yas-help-desk.vercel.app/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: customer.email || customer.phone + '@example.com',
              subject: `تم إغلاق التذكرة - ${ticket.ticket_number}`,
              html: emailHtml,
              text: emailText
            })
          }).catch(err => console.error('[GetTickets API] Email notification error:', err));

          console.log('[GetTickets API] Email notification queued for ticket closure');
        } catch (emailError) {
          console.error('[GetTickets API] Email notification error:', emailError);
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