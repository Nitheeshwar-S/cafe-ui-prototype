const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Combo = require('../models/Combo');

// @route   POST /api/orders
// @desc    Create new order
// @access  Public
router.post('/', async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            customerPhone,
            items,
            subtotal,
            tax,
            discount = 0,
            total,
            paymentMethod,
            specialInstructions,
            promoId
        } = req.body;

        // Validate required fields
        if (!customerName || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Calculate estimated ready time based on items
        const estimatedTime = items.reduce((total, item) => {
            return total + (item.isCombo ? 15 : 10) * item.quantity;
        }, 0);

        const estimatedReadyTime = new Date();
        estimatedReadyTime.setMinutes(estimatedReadyTime.getMinutes() + estimatedTime);

        const order = await Order.create({
            customerName,
            customerEmail,
            customerPhone,
            items,
            subtotal,
            tax,
            discount,
            total,
            paymentMethod: paymentMethod || 'counter',
            specialInstructions,
            promoId,
            estimatedReadyTime,
            paymentStatus: 'pending'
        });

        // Update combo order counts
        for (const item of items) {
            if (item.isCombo) {
                try {
                    const combo = await Combo.findById(item.itemId);
                    if (combo) {
                        await combo.incrementOrderCount();
                    }
                } catch (err) {
                    console.error('Error updating combo count:', err);
                }
            }
        }

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error creating order:', error);

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

// @route   GET /api/orders
// @desc    Get orders (Admin only - with filters)
// @access  Private
router.get('/', async (req, res) => {
    try {
        const {
            status,
            paymentStatus,
            customerPhone,
            startDate,
            endDate,
            sort = '-createdAt',
            page = 1,
            limit = 20
        } = req.query;

        // Build filter object
        let filter = {};

        if (status) {
            filter.orderStatus = status;
        }

        if (paymentStatus) {
            filter.paymentStatus = paymentStatus;
        }

        if (customerPhone) {
            filter.customerPhone = customerPhone;
        }

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        const orders = await Order.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .select('-__v');

        const total = await Order.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            },
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   GET /api/orders/:orderNumber
// @desc    Get order by order number
// @access  Public
router.get('/:orderNumber', async (req, res) => {
    try {
        const order = await Order.findOne({
            orderNumber: req.params.orderNumber
        }).select('-__v');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['received', 'preparing', 'ready', 'served', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        await order.updateStatus(status);

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   PUT /api/orders/:id/payment
// @desc    Update payment status
// @access  Private
router.put('/:id/payment', async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        const validPaymentStatuses = ['pending', 'paid', 'cancelled'];
        if (!validPaymentStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid payment status'
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { paymentStatus },
            { new: true }
        ).select('-__v');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   POST /api/orders/:id/feedback
// @desc    Add customer feedback to order
// @access  Public
router.post('/:id/feedback', async (req, res) => {
    try {
        const { rating, feedback } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                error: 'Rating must be between 1 and 5'
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                customerRating: rating,
                customerFeedback: feedback
            },
            { new: true }
        ).select('-__v');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error adding feedback:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   GET /api/orders/customer/:phone
// @desc    Get customer order history
// @access  Public
router.get('/customer/:phone', async (req, res) => {
    try {
        const { phone } = req.params;
        const { limit = 10, page = 1 } = req.query;

        const skip = (page - 1) * limit;

        const orders = await Order.find({ customerPhone: phone })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .select('-__v');

        const total = await Order.countDocuments({ customerPhone: phone });

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   GET /api/orders/stats/dashboard
// @desc    Get order statistics for dashboard
// @access  Private
router.get('/stats/dashboard', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Today's stats
        const todaysStats = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: today, $lt: tomorrow },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$total' },
                    averageOrderValue: { $avg: '$total' }
                }
            }
        ]);

        // This week's stats
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());

        const weekStats = await Order.getRevenueStats(weekStart, tomorrow);

        // Order status breakdown
        const statusBreakdown = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: today, $lt: tomorrow }
                }
            },
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Popular items today
        const popularItems = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: today, $lt: tomorrow }
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.name',
                    count: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const result = {
            today: todaysStats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 },
            week: weekStats,
            statusBreakdown,
            popularItems
        };

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching order stats:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   DELETE /api/orders/:id
// @desc    Cancel/Delete order (Admin only)
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Can only cancel orders that are not yet served
        if (['served', 'cancelled'].includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                error: 'Cannot cancel this order'
            });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

module.exports = router;