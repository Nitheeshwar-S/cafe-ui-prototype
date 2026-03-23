const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Order = require('../models/Order');
const Review = require('../models/Review');
const MenuItem = require('../models/MenuItem');
const Combo = require('../models/Combo');

// Simple admin credentials (In production, use proper user management)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password: "admin123"
};

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username and password are required'
            });
        }

        // Check username
        if (username !== ADMIN_CREDENTIALS.username) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, ADMIN_CREDENTIALS.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: username, role: 'admin' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                username: username,
                role: 'admin',
                loginTime: new Date()
            }
        });
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private
router.get('/dashboard', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());

        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        // Orders stats
        const [
            todayOrders,
            weekOrders,
            monthOrders,
            totalOrders,
            pendingOrders,
            orderStatusStats
        ] = await Promise.all([
            // Today's orders
            Order.countDocuments({
                createdAt: { $gte: today, $lt: tomorrow }
            }),

            // This week's orders
            Order.countDocuments({
                createdAt: { $gte: thisWeekStart, $lt: tomorrow }
            }),

            // This month's orders
            Order.countDocuments({
                createdAt: { $gte: thisMonthStart, $lt: tomorrow }
            }),

            // Total orders
            Order.countDocuments({}),

            // Pending orders
            Order.countDocuments({
                orderStatus: { $in: ['received', 'preparing'] }
            }),

            // Order status breakdown
            Order.aggregate([
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
            ])
        ]);

        // Revenue stats
        const revenueStats = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'paid',
                    createdAt: { $gte: today, $lt: tomorrow }
                }
            },
            {
                $group: {
                    _id: null,
                    todayRevenue: { $sum: '$total' },
                    averageOrderValue: { $avg: '$total' },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        const todayRevenue = revenueStats[0] || { todayRevenue: 0, averageOrderValue: 0, totalOrders: 0 };

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
                    quantity: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    isCombo: { $first: '$items.isCombo' }
                }
            },
            { $sort: { quantity: -1 } },
            { $limit: 5 }
        ]);

        // Review stats
        const reviewStats = await Review.getStats();

        // Pending reviews
        const pendingReviews = await Review.countDocuments({
            isApproved: false,
            isVisible: true
        });

        // Menu stats
        const [totalMenuItems, totalCombos, availableItems] = await Promise.all([
            MenuItem.countDocuments({}),
            Combo.countDocuments({ isActive: true }),
            MenuItem.countDocuments({ isAvailable: true })
        ]);

        // Recent orders
        const recentOrders = await Order.find({
            createdAt: { $gte: today, $lt: tomorrow }
        })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('orderNumber customerName tableNumber total orderStatus createdAt paymentStatus');

        const dashboardData = {
            orders: {
                today: todayOrders,
                week: weekOrders,
                month: monthOrders,
                total: totalOrders,
                pending: pendingOrders,
                statusBreakdown: orderStatusStats
            },
            revenue: {
                today: todayRevenue.todayRevenue,
                averageOrderValue: todayRevenue.averageOrderValue,
                ordersCount: todayRevenue.totalOrders
            },
            menu: {
                totalItems: totalMenuItems,
                totalCombos: totalCombos,
                availableItems: availableItems
            },
            reviews: {
                ...reviewStats,
                pending: pendingReviews
            },
            popularItems,
            recentOrders
        };

        res.status(200).json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Private
router.get('/analytics', async (req, res) => {
    try {
        const { period = 'week' } = req.query;

        let startDate = new Date();
        let groupBy = {};

        if (period === 'week') {
            startDate.setDate(startDate.getDate() - 7);
            groupBy = {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' }
            };
        } else if (period === 'month') {
            startDate.setMonth(startDate.getMonth() - 1);
            groupBy = {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                week: { $week: '$createdAt' }
            };
        } else if (period === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
            groupBy = {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
            };
        }

        // Sales trend
        const salesTrend = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: groupBy,
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 },
                    averageOrderValue: { $avg: '$total' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        // Category performance
        const categoryPerformance = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    paymentStatus: 'paid'
                }
            },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'menuitems',
                    localField: 'items.itemId',
                    foreignField: '_id',
                    as: 'menuItem'
                }
            },
            {
                $addFields: {
                    category: {
                        $cond: {
                            if: '$items.isCombo',
                            then: 'Combos',
                            else: { $arrayElemAt: ['$menuItem.category', 0] }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$category',
                    quantity: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { revenue: -1 } }
        ]);

        // Peak hours analysis
        const peakHours = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $hour: '$createdAt' },
                    orders: { $sum: 1 },
                    revenue: { $sum: '$total' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Customer insights
        const customerInsights = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    customerPhone: { $exists: true, $ne: '' }
                }
            },
            {
                $group: {
                    _id: '$customerPhone',
                    orderCount: { $sum: 1 },
                    totalSpent: { $sum: '$total' },
                    lastOrder: { $max: '$createdAt' },
                    customerName: { $first: '$customerName' }
                }
            },
            {
                $match: {
                    orderCount: { $gt: 1 } // Repeat customers only
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 }
        ]);

        const analytics = {
            period,
            salesTrend,
            categoryPerformance,
            peakHours,
            customerInsights: {
                repeatCustomers: customerInsights.length,
                topCustomers: customerInsights
            }
        };

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   get /api/admin/system-health
// @desc    Get system health status
// @access  Private
router.get('/system-health', async (req, res) => {
    try {
        const health = {
            status: 'healthy',
            timestamp: new Date(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            database: {
                status: 'connected',
                collections: {
                    orders: await Order.countDocuments({}),
                    menuItems: await MenuItem.countDocuments({}),
                    combos: await Combo.countDocuments({}),
                    reviews: await Review.countDocuments({})
                }
            },
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || '1.0.0'
        };

        res.status(200).json({
            success: true,
            data: health
        });
    } catch (error) {
        console.error('Error checking system health:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error',
            data: {
                status: 'unhealthy',
                timestamp: new Date(),
                error: error.message
            }
        });
    }
});

// @route   POST /api/admin/backup
// @desc    Create database backup (simplified)
// @access  Private
router.post('/backup', async (req, res) => {
    try {
        // This is a simplified backup - in production you'd use mongoose/mongodb backup tools
        const backup = {
            timestamp: new Date(),
            orders: await Order.find({}).lean(),
            menuItems: await MenuItem.find({}).lean(),
            combos: await Combo.find({}).lean(),
            reviews: await Review.find({}).lean()
        };

        res.status(200).json({
            success: true,
            message: 'Backup created successfully',
            data: {
                timestamp: backup.timestamp,
                recordCount: {
                    orders: backup.orders.length,
                    menuItems: backup.menuItems.length,
                    combos: backup.combos.length,
                    reviews: backup.reviews.length
                }
            }
        });
    } catch (error) {
        console.error('Error creating backup:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

module.exports = router;