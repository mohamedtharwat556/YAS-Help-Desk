// ============================================================
// YAS Help Desk - Tickets Routes
// ============================================================

const express = require('express');
const { body, validationResult, query } = require('express-validator');
const supabase = require('../config/supabase');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/tickets
 * @desc    Get all tickets with pagination and filtering
 * @access  Private
 */
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional(),
  query('priority').optional(),
  query('search').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { status, priority, search } = req.query;

    // Build query
    let query = supabase
      .from('tickets')
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        assigned_user:users(id, name, email, role)
      `, { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (priority) {
      query = query.eq('priority', priority);
    }
    if (search) {
      query = query.or(`ticket_number.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: tickets, error, count } = await query;

    if (error) {
      console.error('Get tickets error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch tickets'
      });
    }

    res.json({
      success: true,
      data: tickets,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/tickets/:id
 * @desc    Get single ticket by ID
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: ticket, error } = await supabase
      .from('tickets')
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        assigned_user:users(id, name, email, role),
        notes:ticket_notes(*, user:users(id, name)),
        activities:ticket_activities(*)
      `)
      .eq('id', id)
      .single();

    if (error || !ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/tickets
 * @desc    Create new ticket
 * @access  Private
 */
router.post('/', authenticate, [
  body('customer.name').notEmpty().withMessage('Customer name is required'),
  body('customer.phone').notEmpty().withMessage('Customer phone is required'),
  body('device.type').notEmpty().withMessage('Device type is required'),
  body('device.model').notEmpty().withMessage('Device model is required'),
  body('request_type').notEmpty().withMessage('Request type is required'),
  body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: errors.array()
      });
    }

    const { customer, device, request_type, priority = 'medium', description, files = [] } = req.body;

    // Start transaction
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
      return res.status(500).json({
        success: false,
        message: 'Failed to create customer'
      });
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
      console.error('Device creation error:', deviceError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create device'
      });
    }

    // Generate ticket number
    const { data: ticketNumberData } = await supabase
      .rpc('generate_ticket_number');

    const ticketNumber = ticketNumberData || `YAS-SUP-${Date.now()}`;

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
      console.error('Ticket creation error:', ticketError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create ticket'
      });
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
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/tickets/:id
 * @desc    Update ticket
 * @access  Private
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: ticket, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        assigned_user:users(id, name, email, role)
      `)
      .single();

    if (error || !ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/tickets/:id/status
 * @desc    Update ticket status
 * @access  Private
 */
router.put('/:id/status', authenticate, [
  body('status').notEmpty().withMessage('Status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { status, note } = req.body;

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

    // Update ticket status
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
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
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

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: ticket
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/tickets/:id/notes
 * @desc    Add note to ticket
 * @access  Private
 */
router.post('/:id/notes', authenticate, [
  body('note').notEmpty().withMessage('Note is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { note, is_internal = true } = req.body;

    // Add note
    const { data: newNote, error } = await supabase
      .from('ticket_notes')
      .insert({
        ticket_id: id,
        user_id: req.user.id,
        note,
        is_internal
      })
      .select('*, user:users(id, name)')
      .single();

    if (error) {
      console.error('Add note error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to add note'
      });
    }

    // Add activity
    await supabase.from('ticket_activities').insert({
      ticket_id: id,
      label: 'تمت إضافة ملاحظة داخلية',
      description: note.substring(0, 80) + (note.length > 80 ? '...' : ''),
      type: 'note'
    });

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: newNote
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   DELETE /api/tickets/:id
 * @desc    Delete ticket
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete ticket error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete ticket'
      });
    }

    res.json({
      success: true,
      message: 'Ticket deleted successfully'
    });
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
