const express = require('express');
const router = express.Router();
const Promo = require('../models/Promo');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

// @route   GET /api/promos
// @desc    Get all active promos (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const promos = await Promo.find({ isActive: true })
            .sort({ displayOrder: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: promos.length,
            data: promos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error fetching promos'
        });
    }
});

// @route   GET /api/promos/all
// @desc    Get all promos including inactive (admin only)
// @access  Private (Admin)
router.get('/all', authMiddleware, roleCheck('admin'), async (req, res) => {
    try {
        const promos = await Promo.find()
            .sort({ displayOrder: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: promos.length,
            data: promos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error fetching promos'
        });
    }
});

// @route   GET /api/promos/:id
// @desc    Get single promo
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const promo = await Promo.findById(req.params.id);

        if (!promo) {
            return res.status(404).json({
                success: false,
                error: 'Promo not found'
            });
        }

        res.status(200).json({
            success: true,
            data: promo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error fetching promo'
        });
    }
});

// @route   POST /api/promos
// @desc    Create new promo
// @access  Private (Admin)
router.post('/', authMiddleware, roleCheck('admin'), upload.single('image'), async (req, res) => {
    try {
        const promoData = { ...req.body };

        // If image was uploaded, set the path
        if (req.file) {
            promoData.image = `/uploads/promos/${req.file.filename}`;
        }

        const promo = await Promo.create(promoData);

        res.status(201).json({
            success: true,
            data: promo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// @route   PUT /api/promos/:id
// @desc    Update promo
// @access  Private (Admin)
router.put('/:id', authMiddleware, roleCheck('admin'), upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };

        // If image was uploaded, update the path
        if (req.file) {
            updateData.image = `/uploads/promos/${req.file.filename}`;
        }

        const promo = await Promo.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!promo) {
            return res.status(404).json({
                success: false,
                error: 'Promo not found'
            });
        }

        res.status(200).json({
            success: true,
            data: promo
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// @route   DELETE /api/promos/:id
// @desc    Delete promo
// @access  Private (Admin)
router.delete('/:id', authMiddleware, roleCheck('admin'), async (req, res) => {
    try {
        const promo = await Promo.findByIdAndDelete(req.params.id);

        if (!promo) {
            return res.status(404).json({
                success: false,
                error: 'Promo not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Promo deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error deleting promo'
        });
    }
});

// @route   PUT /api/promos/:id/impression
// @desc    Track promo impression
// @access  Public
router.put('/:id/impression', async (req, res) => {
    try {
        const promo = await Promo.findByIdAndUpdate(
            req.params.id,
            { $inc: { impressions: 1 } },
            { new: true }
        );

        if (!promo) {
            return res.status(404).json({
                success: false,
                error: 'Promo not found'
            });
        }

        res.status(200).json({
            success: true,
            data: { impressions: promo.impressions }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error tracking impression'
        });
    }
});

// @route   PUT /api/promos/:id/click
// @desc    Track promo click
// @access  Public
router.put('/:id/click', async (req, res) => {
    try {
        const promo = await Promo.findByIdAndUpdate(
            req.params.id,
            { $inc: { clicks: 1 } },
            { new: true }
        );

        if (!promo) {
            return res.status(404).json({
                success: false,
                error: 'Promo not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                clicks: promo.clicks,
                clickThroughRate: promo.clickThroughRate
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error tracking click'
        });
    }
});

// @route   PUT /api/promos/:id/conversion
// @desc    Track promo conversion (order placed after clicking)
// @access  Public
router.put('/:id/conversion', async (req, res) => {
    try {
        const promo = await Promo.findByIdAndUpdate(
            req.params.id,
            { $inc: { conversions: 1 } },
            { new: true }
        );

        if (!promo) {
            return res.status(404).json({
                success: false,
                error: 'Promo not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                conversions: promo.conversions,
                conversionRate: promo.conversionRate
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error tracking conversion'
        });
    }
});

// @route   PUT /api/promos/:id/toggle
// @desc    Toggle promo active status
// @access  Private (Admin)
router.put('/:id/toggle', authMiddleware, roleCheck('admin'), async (req, res) => {
    try {
        const promo = await Promo.findById(req.params.id);

        if (!promo) {
            return res.status(404).json({
                success: false,
                error: 'Promo not found'
            });
        }

        promo.isActive = !promo.isActive;
        await promo.save();

        res.status(200).json({
            success: true,
            data: promo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error toggling promo status'
        });
    }
});

module.exports = router;
