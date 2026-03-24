const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/settings
// @desc    Get cafe settings (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const settings = await Settings.getSettings();

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error fetching settings'
        });
    }
});

// @route   PUT /api/settings
// @desc    Update cafe settings
// @access  Private (Admin)
router.put('/', authMiddleware, roleCheck('admin'), async (req, res) => {
    try {
        const allowedUpdates = [
            'cafeName',
            'operatingHours',
            'contactPhone',
            'instagram',
            'address',
            'taxPercentage'
        ];

        // Filter only allowed fields
        const updates = {};
        for (const key of allowedUpdates) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        const settings = await Settings.updateSettings(updates);

        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// @route   GET /api/settings/tax
// @desc    Get just tax percentage (public - for calculations)
// @access  Public
router.get('/tax', async (req, res) => {
    try {
        const settings = await Settings.getSettings();

        res.status(200).json({
            success: true,
            data: {
                taxPercentage: settings.taxPercentage || 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error fetching tax rate'
        });
    }
});

module.exports = router;
