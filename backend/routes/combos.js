const express = require('express');
const router = express.Router();
const Combo = require('../models/Combo');
const MenuItem = require('../models/MenuItem');

// @route   GET /api/combos
// @desc    Get all available combos
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            isVeg,
            minPrice,
            maxPrice,
            sort = 'name',
            page = 1,
            limit = 20
        } = req.query;

        // Build filter object
        let filter = {
            isAvailable: true,
            isActive: true,
            validFrom: { $lte: new Date() },
            validUntil: { $gte: new Date() }
        };

        if (isVeg !== undefined) {
            filter.isVeg = isVeg === 'true';
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Build sort object
        let sortObj = {};
        if (sort === 'price_low') {
            sortObj = { price: 1 };
        } else if (sort === 'price_high') {
            sortObj = { price: -1 };
        } else if (sort === 'savings') {
            sortObj = { savings: -1 };
        } else if (sort === 'popular') {
            sortObj = { totalOrders: -1, rating: -1 };
        } else {
            sortObj = { name: 1 };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query with populated items
        const combos = await Combo.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit))
            .select('-__v')
            .lean();

        const total = await Combo.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: combos.length,
            total,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            },
            data: combos
        });
    } catch (error) {
        console.error('Error fetching combos:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   GET /api/combos/:id
// @desc    Get single combo with full details
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const combo = await Combo.findById(req.params.id)
            .select('-__v')
            .lean();

        if (!combo || !combo.isAvailable || !combo.isActive) {
            return res.status(404).json({
                success: false,
                error: 'Combo not found or not available'
            });
        }

        // Check if combo is currently available
        const now = new Date();
        if (now < combo.validFrom || now > combo.validUntil) {
            return res.status(404).json({
                success: false,
                error: 'Combo is not currently available'
            });
        }

        // Check daily limit
        if (combo.ordersToday >= combo.maxOrdersPerDay) {
            return res.status(404).json({
                success: false,
                error: 'Combo has reached daily limit'
            });
        }

        res.status(200).json({
            success: true,
            data: combo
        });
    } catch (error) {
        console.error('Error fetching combo:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   GET /api/combos/featured/deals
// @desc    Get featured combo deals
// @access  Public
router.get('/featured/deals', async (req, res) => {
    try {
        const limit = req.query.limit || 3;

        const featuredCombos = await Combo.find({
            isAvailable: true,
            isActive: true,
            validFrom: { $lte: new Date() },
            validUntil: { $gte: new Date() }
        })
            .sort({ savings: -1, rating: -1 })
            .limit(Number(limit))
            .select('-__v')
            .lean();

        res.status(200).json({
            success: true,
            count: featuredCombos.length,
            data: featuredCombos
        });
    } catch (error) {
        console.error('Error fetching featured combos:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   POST /api/combos
// @desc    Create new combo (Admin only)
// @access  Private
router.post('/', async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            originalPrice,
            image,
            rating,
            isVeg,
            items,
            validFrom,
            validUntil,
            maxOrdersPerDay
        } = req.body;

        // Validate that all menu items exist
        const menuItemIds = items.map(item => item.menuItemId);
        const existingMenuItems = await MenuItem.find({
            _id: { $in: menuItemIds },
            isAvailable: true
        });

        if (existingMenuItems.length !== menuItemIds.length) {
            return res.status(400).json({
                success: false,
                error: 'One or more menu items are not available'
            });
        }

        // Calculate savings
        const savings = originalPrice - price;

        const combo = await Combo.create({
            name,
            description,
            price,
            originalPrice,
            savings,
            image,
            rating,
            isVeg,
            items,
            validFrom,
            validUntil,
            maxOrdersPerDay
        });

        res.status(201).json({
            success: true,
            data: combo
        });
    } catch (error) {
        console.error('Error creating combo:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   PUT /api/combos/:id
// @desc    Update combo (Admin only)
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        // If updating items, validate they exist
        if (req.body.items) {
            const menuItemIds = req.body.items.map(item => item.menuItemId);
            const existingMenuItems = await MenuItem.find({
                _id: { $in: menuItemIds },
                isAvailable: true
            });

            if (existingMenuItems.length !== menuItemIds.length) {
                return res.status(400).json({
                    success: false,
                    error: 'One or more menu items are not available'
                });
            }
        }

        // Recalculate savings if prices are updated
        if (req.body.price || req.body.originalPrice) {
            const combo = await Combo.findById(req.params.id);
            if (!combo) {
                return res.status(404).json({
                    success: false,
                    error: 'Combo not found'
                });
            }

            const price = req.body.price || combo.price;
            const originalPrice = req.body.originalPrice || combo.originalPrice;
            req.body.savings = originalPrice - price;
        }

        const combo = await Combo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-__v');

        if (!combo) {
            return res.status(404).json({
                success: false,
                error: 'Combo not found'
            });
        }

        res.status(200).json({
            success: true,
            data: combo
        });
    } catch (error) {
        console.error('Error updating combo:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   DELETE /api/combos/:id
// @desc    Delete combo (Admin only)
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        // Soft delete - mark as inactive
        const combo = await Combo.findByIdAndUpdate(
            req.params.id,
            { isActive: false, isAvailable: false },
            { new: true }
        );

        if (!combo) {
            return res.status(404).json({
                success: false,
                error: 'Combo not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Combo deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting combo:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   PUT /api/combos/:id/availability
// @desc    Toggle combo availability
// @access  Private
router.put('/:id/availability', async (req, res) => {
    try {
        const { isAvailable } = req.body;

        const combo = await Combo.findByIdAndUpdate(
            req.params.id,
            { isAvailable },
            { new: true }
        ).select('-__v');

        if (!combo) {
            return res.status(404).json({
                success: false,
                error: 'Combo not found'
            });
        }

        res.status(200).json({
            success: true,
            data: combo
        });
    } catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   POST /api/combos/:id/order
// @desc    Increment combo order count
// @access  Private
router.post('/:id/order', async (req, res) => {
    try {
        const combo = await Combo.findById(req.params.id);

        if (!combo || !combo.checkAvailability()) {
            return res.status(404).json({
                success: false,
                error: 'Combo not available'
            });
        }

        await combo.incrementOrderCount();

        res.status(200).json({
            success: true,
            message: 'Order count updated',
            data: {
                ordersToday: combo.ordersToday,
                totalOrders: combo.totalOrders
            }
        });
    } catch (error) {
        console.error('Error updating order count:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   POST /api/combos/reset-daily-counts
// @desc    Reset daily order counts (Admin cron job)
// @access  Private
router.post('/reset-daily-counts', async (req, res) => {
    try {
        await Combo.resetDailyCounts();

        res.status(200).json({
            success: true,
            message: 'Daily counts reset successfully'
        });
    } catch (error) {
        console.error('Error resetting daily counts:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   GET /api/combos/stats/analytics
// @desc    Get combo analytics and statistics
// @access  Private
router.get('/stats/analytics', async (req, res) => {
    try {
        const stats = await Combo.aggregate([
            {
                $match: {
                    isActive: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalCombos: { $sum: 1 },
                    averagePrice: { $avg: '$price' },
                    totalSavings: { $sum: '$savings' },
                    totalOrders: { $sum: '$totalOrders' },
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);

        const popularCombos = await Combo.find({ isActive: true })
            .sort({ totalOrders: -1 })
            .limit(5)
            .select('name totalOrders rating');

        const result = stats[0] || {
            totalCombos: 0,
            averagePrice: 0,
            totalSavings: 0,
            totalOrders: 0,
            averageRating: 0
        };

        res.status(200).json({
            success: true,
            data: {
                ...result,
                popularCombos
            }
        });
    } catch (error) {
        console.error('Error fetching combo analytics:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

module.exports = router;