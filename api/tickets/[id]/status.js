// Update ticket status endpoint
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
  res.setHeader('Access-Control-Allow-Methods', 'PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  const id = req.query.id;

  if (req.method === 'PUT') {
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

      const { status, note } = body || {};

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const statusLabels = {
        received: 'تم الاستلام',
        reviewing: 'قيد المراجعة',
        contacting: 'جاري التواصل',
        diagnosing: 'جاري الفحص',
        maintenance: 'قيد الصيانة',
        waiting: 'بانتظار العميل',
        resolved: 'تم الحل',
        closed: 'مغلق'
      };

      const activityLabel = statusLabels[status] || status;

      const { data: ticket, error } = await supabase
        .from('tickets')
        .update({
          status,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null,
          closed_at: status === 'closed' ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select()
        .single();

      if (error || !ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      // Add activity
      await supabase.from('ticket_activities').insert({
        ticket_id: id,
        label: `تحديث الحالة: ${activityLabel}`,
        description: note || `تم تحديث حالة الطلب إلى "${activityLabel}"`,
        type: 'status'
      });

      // Create notification for resolved/closed tickets
      if (status === 'resolved' || status === 'closed') {
        await supabase.from('notifications').insert({
          user_id: ticket.assigned_to,
          type: 'resolved',
          title: 'تم حل الطلب',
          message: `تم تحديث الطلب ${ticket.ticket_number} إلى "${activityLabel}"`,
          ticket_id: id
        });
      }

      res.status(200).json({
        success: true,
        message: 'Status updated successfully',
        data: ticket
      });
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};