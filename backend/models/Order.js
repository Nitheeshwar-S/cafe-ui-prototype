const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    itemId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    size: String,
    specialInstructions: {
        type: String,
        maxlength: [200, 'Special instructions cannot exceed 200 characters']
    },
    isCombo: {
        type: Boolean,
        default: false
    },
    comboItems: [{
        id: Number,
        name: String,
        size: String,
        quantity: Number
    }]
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    customerName: {
        type: String,
        required: [true, 'Please provide customer name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
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
    tableNumber: {
        type: String,
        required: [true, 'Please provide table number'],
        trim: true
    },
    items: [orderItemSchema],
    subtotal: {
        type: Number,
        required: true,
        min: [0, 'Subtotal cannot be negative']
    },
    tax: {
        type: Number,
        required: true,
        min: [0, 'Tax cannot be negative'],
        default: function() {
            return this.subtotal * 0.05; // 5% tax
        }
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative']
    },
    total: {
        type: Number,
        required: true,
        min: [0, 'Total cannot be negative']
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: {
            values: ['cash', 'card', 'wallet', 'upi'],
            message: 'Payment method must be one of: cash, card, wallet, upi'
        }
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['received', 'preparing', 'ready', 'served', 'cancelled'],
        default: 'received'
    },
    specialInstructions: {
        type: String,
        maxlength: [500, 'Special instructions cannot exceed 500 characters']
    },
    estimatedReadyTime: {
        type: Date,
        default: function() {
            const readyTime = new Date();
            readyTime.setMinutes(readyTime.getMinutes() + 20); // Default 20 minutes
            return readyTime;
        }
    },
    actualReadyTime: Date,
    servedTime: Date,
    preparationTime: Number, // in minutes
    customerRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    customerFeedback: {
        type: String,
        maxlength: [1000, 'Feedback cannot exceed 1000 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for better performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customerPhone: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

// Virtual for order duration
orderSchema.virtual('orderDuration').get(function() {
    if (this.servedTime && this.createdAt) {
        return Math.ceil((this.servedTime - this.createdAt) / (1000 * 60)); // in minutes
    }
    return null;
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        // Generate order number: YYYYMMDD + random 4 digits
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(1000 + Math.random() * 9000);
        this.orderNumber = `CF${today}${random}`;
    }
    next();
});

// Method to update order status
orderSchema.methods.updateStatus = async function(status, userId = null) {
    this.orderStatus = status;

    if (status === 'ready' && !this.actualReadyTime) {
        this.actualReadyTime = new Date();
        this.preparationTime = Math.ceil((this.actualReadyTime - this.createdAt) / (1000 * 60));
    } else if (status === 'served' && !this.servedTime) {
        this.servedTime = new Date();
    }

    return await this.save();
};

// Static method to get revenue statistics
orderSchema.statics.getRevenueStats = async function(startDate, endDate) {
    const pipeline = [
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                paymentStatus: 'paid'
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$total' },
                totalOrders: { $sum: 1 },
                averageOrderValue: { $avg: '$total' }
            }
        }
    ];

    const result = await this.aggregate(pipeline);
    return result[0] || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };
};

module.exports = mongoose.model('Order', orderSchema);