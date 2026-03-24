const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// @route   GET /api/kitchen/orders
// @desc    Get today's orders for kitchen (simplified view)
// @access  Private (Kitchen, Admin)
router.get('/orders', authMiddleware, roleCheck('kitchen', 'admin'), async (req, res) => {
    try {
        // Get start of today (IST)
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const orders = await Order.find({
            createdAt: { $gte: startOfDay },
            orderStatus: { $ne: 'served' } // Exclude served orders
        })
        .select('orderNumber customerName items specialInstructions orderStatus paymentStatus createdAt')
        .sort({ createdAt: -1 });

        // Simplify the response for kitchen - only name and order number visible
        const kitchenOrders = orders.map(order => ({
            _id: order._id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            items: order.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                specialInstructions: item.specialInstructions
            })),
            orderInstructions: order.specialInstructions,
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt
        }));

        res.status(200).json({
            success: true,
            count: kitchenOrders.length,
            data: kitchenOrders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error fetching kitchen orders'
        });
    }
});

// @route   PUT /api/kitchen/orders/:id/confirm
// @desc    Confirm payment and start preparing (Kitchen action)
// @access  Private (Kitchen, Admin)
router.put('/orders/:id/confirm', authMiddleware, roleCheck('kitchen', 'admin'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Can only confirm orders in 'received' status with 'pending' payment
        if (order.orderStatus !== 'received' || order.paymentStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                error: 'Order cannot be confirmed in current state'
            });
        }

        order.paymentStatus = 'paid';
        order.orderStatus = 'preparing';
        await order.save();

        res.status(200).json({
            success: true,
            data: {
                orderNumber: order.orderNumber,
                orderStatus: order.orderStatus,
                paymentStatus: order.paymentStatus
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error confirming order'
        });
    }
});

// @route   PUT /api/kitchen/orders/:id/ready
// @desc    Mark order as ready (Kitchen action)
// @access  Private (Kitchen, Admin)
router.put('/orders/:id/ready', authMiddleware, roleCheck('kitchen', 'admin'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Can only mark ready if status is 'preparing'
        if (order.orderStatus !== 'preparing') {
            return res.status(400).json({
                success: false,
                error: 'Order must be in preparing status to mark as ready'
            });
        }

        order.orderStatus = 'ready';
        order.actualReadyTime = new Date();
        order.preparationTime = Math.ceil((order.actualReadyTime - order.createdAt) / (1000 * 60));
        await order.save();

        res.status(200).json({
            success: true,
            data: {
                orderNumber: order.orderNumber,
                orderStatus: order.orderStatus,
                preparationTime: order.preparationTime
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error marking order ready'
        });
    }
});

// @route   PUT /api/kitchen/orders/:id/served
// @desc    Mark order as served (Kitchen action)
// @access  Private (Kitchen, Admin)
router.put('/orders/:id/served', authMiddleware, roleCheck('kitchen', 'admin'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Can only mark served if status is 'ready'
        if (order.orderStatus !== 'ready') {
            return res.status(400).json({
                success: false,
                error: 'Order must be in ready status to mark as served'
            });
        }

        order.orderStatus = 'served';
        order.servedTime = new Date();
        await order.save();

        res.status(200).json({
            success: true,
            data: {
                orderNumber: order.orderNumber,
                orderStatus: order.orderStatus,
                servedTime: order.servedTime
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error marking order served'
        });
    }
});

// @route   PUT /api/kitchen/orders/:id/cancel
// @desc    Cancel order (only if not paid yet)
// @access  Private (Kitchen, Admin)
router.put('/orders/:id/cancel', authMiddleware, roleCheck('kitchen', 'admin'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Can only cancel orders in 'received' status with 'pending' payment
        if (order.orderStatus !== 'received' || order.paymentStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                error: 'Can only cancel orders that have not been paid yet'
            });
        }

        order.paymentStatus = 'cancelled';
        order.orderStatus = 'cancelled';
        await order.save();

        res.status(200).json({
            success: true,
            data: {
                orderNumber: order.orderNumber,
                orderStatus: order.orderStatus,
                paymentStatus: order.paymentStatus
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error cancelling order'
        });
    }
});

// @route   GET /api/kitchen/orders/new-count
// @desc    Get count of new orders since last check (for notifications)
// @access  Private (Kitchen, Admin)
router.get('/orders/new-count', authMiddleware, roleCheck('kitchen', 'admin'), async (req, res) => {
    try {
        const since = req.query.since ? new Date(req.query.since) : new Date(Date.now() - 30000); // Default 30 seconds

        const newOrdersCount = await Order.countDocuments({
            createdAt: { $gte: since },
            orderStatus: 'received',
            paymentStatus: 'pending'
        });

        res.status(200).json({
            success: true,
            data: {
                newOrdersCount,
                since
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error getting new orders count'
        });
    }
});

module.exports = router;
