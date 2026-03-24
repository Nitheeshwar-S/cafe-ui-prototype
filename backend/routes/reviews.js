const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// @route   GET /api/reviews
// @desc    Get all approved reviews (public)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            rating,
            sentiment,
            limit = 10,
            page = 1,
            sort = '-createdAt'
        } = req.query;

        // Build filter for public reviews
        let filter = {
            isApproved: true,
            isVisible: true
        };

        if (rating) {
            filter.rating = Number(rating);
        }

        if (sentiment) {
            filter.sentiment = sentiment;
        }

        const skip = (page - 1) * limit;

        const reviews = await Review.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .select('customerName rating comment instagram createdAt sentiment tags helpfulness -_id');

        const total = await Review.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            },
            data: reviews
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   POST /api/reviews
// @desc    Create new review
// @access  Public
router.post('/', async (req, res) => {
    try {
        const {
            customerName,
            rating,
            comment,
            instagram,
            orderNumber,
            customerEmail,
            customerPhone
        } = req.body;

        // Basic validation
        if (!customerName || !rating || !comment) {
            return res.status(400).json({
                success: false,
                error: 'Name, rating, and comment are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                error: 'Rating must be between 1 and 5'
            });
        }

        // Get IP and user agent for spam prevention
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');

        // Check for duplicate reviews from same IP within 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const recentReview = await Review.findOne({
            ipAddress,
            createdAt: { $gte: yesterday }
        });

        if (recentReview) {
            return res.status(429).json({
                success: false,
                error: 'You can only submit one review per day'
            });
        }

        // Auto-generate tags based on comment keywords
        const tags = [];
        const comment_lower = comment.toLowerCase();

        if (comment_lower.includes('food') || comment_lower.includes('taste') || comment_lower.includes('delicious')) {
            tags.push('food-quality');
        }
        if (comment_lower.includes('service') || comment_lower.includes('staff') || comment_lower.includes('waiter')) {
            tags.push('service');
        }
        if (comment_lower.includes('ambiance') || comment_lower.includes('atmosphere') || comment_lower.includes('vibe')) {
            tags.push('ambiance');
        }
        if (comment_lower.includes('price') || comment_lower.includes('value') || comment_lower.includes('worth')) {
            tags.push('value');
        }
        if (comment_lower.includes('fast') || comment_lower.includes('quick') || comment_lower.includes('slow')) {
            tags.push('speed');
        }
        if (comment_lower.includes('clean') || comment_lower.includes('hygiene')) {
            tags.push('cleanliness');
        }

        const review = await Review.create({
            customerName,
            rating,
            comment,
            instagram,
            orderNumber,
            customerEmail,
            customerPhone,
            ipAddress,
            userAgent,
            tags
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully. It will be published after approval.',
            data: {
                id: review._id,
                customerName: review.customerName,
                rating: review.rating,
                comment: review.comment,
                isApproved: review.isApproved
            }
        });
    } catch (error) {
        console.error('Error creating review:', error);

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

// @route   GET /api/reviews/stats
// @desc    Get review statistics
// @access  Public
router.get('/stats', async (req, res) => {
    try {
        const stats = await Review.getStats();

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching review stats:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   GET /api/reviews/featured
// @desc    Get featured reviews (admin-selected)
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const limit = req.query.limit || 6;

        const featuredReviews = await Review.find({
            isApproved: true,
            isVisible: true,
            isFeatured: true
        })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .select('customerName rating comment instagram createdAt tags -_id');

        res.status(200).json({
            success: true,
            count: featuredReviews.length,
            data: featuredReviews
        });
    } catch (error) {
        console.error('Error fetching featured reviews:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Public
router.post('/:id/helpful', async (req, res) => {
    try {
        const { helpful } = req.body; // true for upvote, false for downvote

        const review = await Review.findById(req.params.id);

        if (!review || !review.isApproved || !review.isVisible) {
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        if (helpful === true) {
            review.helpfulness.upvotes += 1;
        } else if (helpful === false) {
            review.helpfulness.downvotes += 1;
        } else {
            return res.status(400).json({
                success: false,
                error: 'Helpful parameter must be true or false'
            });
        }

        await review.save();

        res.status(200).json({
            success: true,
            message: 'Thank you for your feedback!',
            data: {
                helpfulness: review.helpfulness,
                helpfulnessScore: review.helpfulnessScore
            }
        });
    } catch (error) {
        console.error('Error updating helpfulness:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   POST /api/reviews/:id/report
// @desc    Report inappropriate review
// @access  Public
router.post('/:id/report', async (req, res) => {
    try {
        const { reason, reporterEmail } = req.body;

        const validReasons = ['spam', 'inappropriate', 'fake', 'other'];
        if (!validReasons.includes(reason)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid report reason'
            });
        }

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        const reporterInfo = {
            email: reporterEmail,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            timestamp: new Date()
        };

        await review.report(reason, reporterInfo);

        res.status(200).json({
            success: true,
            message: 'Review reported successfully. Thank you for helping us maintain quality.'
        });
    } catch (error) {
        console.error('Error reporting review:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// ===========================================
// ADMIN ROUTES (Protected - require admin auth)
// ===========================================

// @route   GET /api/reviews/admin/all
// @desc    Get all reviews (including pending) - Admin only
// @access  Private
router.get('/admin/all', async (req, res) => {
    try {
        const {
            isApproved,
            isReported,
            rating,
            sentiment,
            sort = '-createdAt',
            page = 1,
            limit = 20
        } = req.query;

        let filter = {};

        if (isApproved !== undefined) {
            filter.isApproved = isApproved === 'true';
        }

        if (isReported !== undefined) {
            filter.isReported = isReported === 'true';
        }

        if (rating) {
            filter.rating = Number(rating);
        }

        if (sentiment) {
            filter.sentiment = sentiment;
        }

        const skip = (page - 1) * limit;

        const reviews = await Review.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .select('-__v');

        const total = await Review.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: reviews.length,
            total,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            },
            data: reviews
        });
    } catch (error) {
        console.error('Error fetching admin reviews:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   PUT /api/reviews/:id/approve
// @desc    Approve review - Admin only
// @access  Private
router.put('/:id/approve', async (req, res) => {
    try {
        const { adminNotes } = req.body;

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        await review.approve(adminNotes);

        res.status(200).json({
            success: true,
            message: 'Review approved successfully',
            data: review
        });
    } catch (error) {
        console.error('Error approving review:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   PUT /api/reviews/:id/reject
// @desc    Reject review - Admin only
// @access  Private
router.put('/:id/reject', async (req, res) => {
    try {
        const { reason } = req.body;

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        await review.reject(reason);

        res.status(200).json({
            success: true,
            message: 'Review rejected successfully',
            data: review
        });
    } catch (error) {
        console.error('Error rejecting review:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   PUT /api/reviews/:id/feature
// @desc    Toggle featured status - Admin only
// @access  Private
router.put('/:id/feature', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        // Can only feature approved reviews
        if (!review.isApproved && !review.isFeatured) {
            return res.status(400).json({
                success: false,
                error: 'Cannot feature unapproved review. Please approve first.'
            });
        }

        // Check max featured limit (10)
        if (!review.isFeatured) {
            const featuredCount = await Review.countDocuments({ isFeatured: true });
            if (featuredCount >= 10) {
                return res.status(400).json({
                    success: false,
                    error: 'Maximum 10 featured reviews allowed. Please unfeature another review first.'
                });
            }
        }

        review.isFeatured = !review.isFeatured;
        await review.save();

        res.status(200).json({
            success: true,
            message: review.isFeatured ? 'Review featured successfully' : 'Review unfeatured successfully',
            data: review
        });
    } catch (error) {
        console.error('Error toggling featured status:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review - Admin only
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

module.exports = router;