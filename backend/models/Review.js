const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    comment: {
        type: String,
        required: [true, 'Please provide feedback'],
        trim: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    instagram: {
        type: String,
        trim: true,
        maxlength: [50, 'Instagram handle cannot exceed 50 characters'],
        validate: {
            validator: function(v) {
                return !v || /^[a-zA-Z0-9_.]+$/.test(v);
            },
            message: 'Instagram handle can only contain letters, numbers, dots, and underscores'
        }
    },
    orderNumber: {
        type: String,
        trim: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    isReported: {
        type: Boolean,
        default: false
    },
    reportReason: {
        type: String,
        enum: ['spam', 'inappropriate', 'fake', 'other']
    },
    adminNotes: {
        type: String,
        maxlength: [500, 'Admin notes cannot exceed 500 characters']
    },
    customerEmail: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    customerPhone: {
        type: String,
        match: [/^[6-9]\d{9}$/, 'Please provide a valid phone number']
    },
    ipAddress: String,
    userAgent: String,
    location: {
        country: String,
        city: String
    },
    sentiment: {
        type: String,
        enum: ['positive', 'neutral', 'negative'],
        default: function() {
            // Simple sentiment analysis based on rating
            if (this.rating >= 4) return 'positive';
            if (this.rating >= 3) return 'neutral';
            return 'negative';
        }
    },
    tags: [{
        type: String,
        enum: ['food-quality', 'service', 'ambiance', 'value', 'speed', 'cleanliness']
    }],
    helpfulness: {
        upvotes: { type: Number, default: 0 },
        downvotes: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Indexes for better performance
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ isApproved: 1, isVisible: 1 });
reviewSchema.index({ sentiment: 1 });
reviewSchema.index({ customerName: 'text', comment: 'text' });

// Virtual for helpfulness score
reviewSchema.virtual('helpfulnessScore').get(function() {
    const total = this.helpfulness.upvotes + this.helpfulness.downvotes;
    if (total === 0) return 0;
    return (this.helpfulness.upvotes / total) * 100;
});

// Pre-save middleware to auto-approve high ratings
reviewSchema.pre('save', function(next) {
    // Auto-approve reviews with 4+ stars (you can adjust this logic)
    if (this.rating >= 4 && this.comment.length >= 10) {
        this.isApproved = true;
    }
    next();
});

// Static method to get review statistics
reviewSchema.statics.getStats = async function() {
    const pipeline = [
        { $match: { isApproved: true, isVisible: true } },
        {
            $group: {
                _id: null,
                totalReviews: { $sum: 1 },
                averageRating: { $avg: '$rating' },
                five_star: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
                four_star: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
                three_star: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
                two_star: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
                one_star: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
            }
        }
    ];

    const result = await this.aggregate(pipeline);
    return result[0] || {
        totalReviews: 0,
        averageRating: 0,
        five_star: 0,
        four_star: 0,
        three_star: 0,
        two_star: 0,
        one_star: 0
    };
};

// Method to approve review
reviewSchema.methods.approve = async function(adminNotes = '') {
    this.isApproved = true;
    this.adminNotes = adminNotes;
    return await this.save();
};

// Method to reject review
reviewSchema.methods.reject = async function(reason = '') {
    this.isApproved = false;
    this.isVisible = false;
    this.adminNotes = reason;
    return await this.save();
};

// Method to report review
reviewSchema.methods.report = async function(reason, reporterInfo = {}) {
    this.isReported = true;
    this.reportReason = reason;
    this.adminNotes = `Reported for: ${reason}. Reporter info: ${JSON.stringify(reporterInfo)}`;
    return await this.save();
};

module.exports = mongoose.model('Review', reviewSchema);