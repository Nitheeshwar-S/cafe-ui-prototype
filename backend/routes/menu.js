const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            category,
            isVeg,
            minPrice,
            maxPrice,
            search,
            sort = 'name',
            page = 1,
            limit = 50
        } = req.query;

        // Build filter object
        let filter = { isAvailable: true };

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (isVeg !== undefined) {
            filter.isVeg = isVeg === 'true';
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (search) {
            filter.$text = { $search: search };
        }

        // Build sort object
        let sortObj = {};
        if (sort === 'price_low') {
            sortObj = { price: 1 };
        } else if (sort === 'price_high') {
            sortObj = { price: -1 };
        } else if (sort === 'rating') {
            sortObj = { rating: -1 };
        } else if (sort === 'popular') {
            sortObj = { rating: -1, createdAt: -1 };
        } else {
            sortObj = { name: 1 };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query
        const menuItems = await MenuItem.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit))
            .select('-__v');

        const total = await MenuItem.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: menuItems.length,
            total,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            },
            data: menuItems
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   GET /api/menu/categories/list
// @desc    Get all categories
// @access  Public
router.get('/categories/list', async (req, res) => {
    try {
        const categories = await MenuItem.distinct('category', { isAvailable: true });

        res.status(200).json({
            success: true,
            data: categories.sort()
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   GET /api/menu/featured/items
// @desc    Get featured/popular menu items
// @access  Public
router.get('/featured/items', async (req, res) => {
    try {
        const limit = req.query.limit || 6;

        const featuredItems = await MenuItem.find({ isAvailable: true })
            .sort({ rating: -1, createdAt: -1 })
            .limit(Number(limit))
            .select('-__v');

        res.status(200).json({
            success: true,
            count: featuredItems.length,
            data: featuredItems
        });
    } catch (error) {
        console.error('Error fetching featured items:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id).select('-__v');

        if (!menuItem || !menuItem.isAvailable) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        console.error('Error fetching menu item:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   POST /api/menu
// @desc    Create new menu item (Admin only)
// @access  Private
router.post('/', async (req, res) => {
    try {
        // In a real app, you'd add authentication middleware here
        // For now, we'll allow anyone to create items

        const {
            name,
            description,
            category,
            price,
            image,
            rating,
            isVeg,
            sizes,
            preparationTime,
            ingredients,
            allergens,
            nutritionalInfo
        } = req.body;

        const menuItem = await MenuItem.create({
            name,
            description,
            category,
            price,
            image,
            rating,
            isVeg,
            sizes,
            preparationTime,
            ingredients,
            allergens,
            nutritionalInfo
        });

        res.status(201).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        console.error('Error creating menu item:', error);

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

// @route   PUT /api/menu/:id
// @desc    Update menu item (Admin only)
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).select('-__v');

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        console.error('Error updating menu item:', error);

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

// @route   DELETE /api/menu/:id
// @desc    Delete menu item (Admin only)
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        // Soft delete - just mark as unavailable
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            { isAvailable: false },
            { new: true }
        );

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   PUT /api/menu/:id/availability
// @desc    Toggle menu item availability
// @access  Private
router.put('/:id/availability', async (req, res) => {
    try {
        const { isAvailable } = req.body;

        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            { isAvailable },
            { new: true }
        ).select('-__v');

        if (!menuItem) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: menuItem
        });
    } catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

module.exports = router;