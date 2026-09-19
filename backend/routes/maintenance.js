// ============================================================
// YAS Help Desk - Maintenance Routes
// ============================================================

const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/maintenance
 * @desc    Get all maintenance records
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { data: records, error } = await supabase
      .from('maintenance_records')
      .select('*, device:devices(*), ticket:tickets(ticket_number), technician:users(id, name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get maintenance records error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch maintenance records'
      });
    }

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Get maintenance records error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/maintenance
 * @desc    Create maintenance record
 * @access  Private
 */
router.post('/', authenticate, [
  body('device_id').notEmpty().withMessage('Device ID is required'),
  body('type').notEmpty().withMessage('Type is required'),
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

    const { device_id, ticket_id, type, description, cost, status = 'pending' } = req.body;

    const { data: record, error } = await supabase
      .from('maintenance_records')
      .insert({
        device_id,
        ticket_id,
        technician_id: req.user.id,
        type,
        description,
        cost,
        status
      })
      .select('*, device:devices(*), technician:users(id, name)')
      .single();

    if (error) {
      console.error('Create maintenance record error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create maintenance record'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Maintenance record created successfully',
      data: record
    });
  } catch (error) {
    console.error('Create maintenance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/maintenance/:id
 * @desc    Update maintenance record
 * @access  Private
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data: record, error } = await supabase
      .from('maintenance_records')
      .update(updates)
      .eq('id', id)
      .select('*, device:devices(*), technician:users(id, name)')
      .single();

    if (error || !record) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found'
      });
    }

    res.json({
      success: true,
      message: 'Maintenance record updated successfully',
      data: record
    });
  } catch (error) {
    console.error('Update maintenance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
