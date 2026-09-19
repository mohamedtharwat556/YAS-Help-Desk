// ============================================================
// YAS Help Desk - Settings Routes
// ============================================================

const express = require('express');
const { body, validationResult } = require('express-validator');
const supabase = require('../config/supabase');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/settings
 * @desc    Get all settings
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*');

    if (error) {
      console.error('Get settings error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch settings'
      });
    }

    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.json({
      success: true,
      data: settingsObj
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   GET /api/settings/:key
 * @desc    Get single setting by key
 * @access  Private
 */
router.get('/:key', authenticate, async (req, res) => {
  try {
    const { key } = req.params;

    const { data: setting, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();

    if (error || !setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    res.json({
      success: true,
      data: setting.value
    });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   PUT /api/settings/:key
 * @desc    Update setting
 * @access  Private (Admin only)
 */
router.put('/:key', authenticate, authorize('admin'), [
  body('value').notEmpty().withMessage('Value is required')
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

    const { key } = req.params;
    const { value, description } = req.body;

    const { data: setting, error } = await supabase
      .from('settings')
      .upsert({
        key,
        value,
        description
      }, {
        onConflict: 'key'
      })
      .select()
      .single();

    if (error) {
      console.error('Update setting error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update setting'
      });
    }

    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: setting.value
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
