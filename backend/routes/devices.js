// ============================================================
// YAS Help Desk - Devices Routes
// ============================================================

const express = require('express');
const { body, validationResult, query } = require('express-validator');
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/devices
 * @desc    Get all devices with pagination
 * @access  Private
 */
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
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
    const { search } = req.query;

    let query = supabase
      .from('devices')
      .select('*, customer:customers(*)', { count: 'exact' });

    if (search) {
      query = query.or(`serial_number.ilike.%${search}%,model.ilike.%${search}%,brand.ilike.%${search}%`);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: devices, error, count } = await query;

    if (error) {
      console.error('Get devices error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch devices'
      });
    }

    res.json({
      success: true,
      data: devices,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/devices/:id
 * @desc    Get single device by ID
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: device, error } = await supabase
      .from('devices')
      .select('*, customer:customers(*), tickets(*)')
      .eq('id', id)
      .single();

    if (error || !device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      data: device
    });
  } catch (error) {
    console.error('Get device error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/devices
 * @desc    Create new device
 * @access  Private
 */
router.post('/', authenticate, [
  body('customer_id').notEmpty().withMessage('Customer ID is required'),
  body('type').notEmpty().withMessage('Device type is required'),
  body('model').notEmpty().withMessage('Model is required')
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

    const { customer_id, type, brand, model, serial_number, purchase_date, warranty_status } = req.body;

    const { data: device, error } = await supabase
      .from('devices')
      .insert({
        customer_id,
        type,
        brand,
        model,
        serial_number,
        purchase_date,
        warranty_status: warranty_status || 'unknown'
      })
      .select('*, customer:customers(*)')
      .single();

    if (error) {
      console.error('Create device error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create device'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Device created successfully',
      data: device
    });
  } catch (error) {
    console.error('Create device error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/devices/:id
 * @desc    Update device
 * @access  Private
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data: device, error } = await supabase
      .from('devices')
      .update(updates)
      .eq('id', id)
      .select('*, customer:customers(*)')
      .single();

    if (error || !device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    res.json({
      success: true,
      message: 'Device updated successfully',
      data: device
    });
  } catch (error) {
    console.error('Update device error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   DELETE /api/devices/:id
 * @desc    Delete device
 * @access  Private
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete device error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete device'
      });
    }

    res.json({
      success: true,
      message: 'Device deleted successfully'
    });
  } catch (error) {
    console.error('Delete device error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
