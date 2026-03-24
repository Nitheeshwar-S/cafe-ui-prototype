const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide promo title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    discount: {
        type: String,
        trim: true
    }, // e.g., "30% OFF", "Buy 1 Get 1", "Save ₹200"
    image: {
        type: String,
        required: [true, 'Please provide promo image']
    }, // path: /uploads/promos/xxx.webp
    isActive: {
        type: Boolean,
        default: true
    },
    impressions: {
        type: Number,
        default: 0
    }, // How many times viewed
    clicks: {
        type: Number,
        default: 0
    }, // How many times clicked
    conversions: {
        type: Number,
        default: 0
    }, // How many orders placed after clicking
    displayOrder: {
        type: Number,
        default: 0
    } // for manual ordering
}, { timestamps: true });

// Virtual for click-through rate
promoSchema.virtual('clickThroughRate').get(function() {
    if (this.impressions === 0) return 0;
    return ((this.clicks / this.impressions) * 100).toFixed(2);
});

// Virtual for conversion rate
promoSchema.virtual('conversionRate').get(function() {
    if (this.clicks === 0) return 0;
    return ((this.conversions / this.clicks) * 100).toFixed(2);
});

// Ensure virtuals are included in JSON
promoSchema.set('toJSON', { virtuals: true });
promoSchema.set('toObject', { virtuals: true });

// Indexes for better performance
promoSchema.index({ isActive: 1, displayOrder: 1 });

module.exports = mongoose.model('Promo', promoSchema);
