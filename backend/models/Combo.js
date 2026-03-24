const mongoose = require('mongoose');

const comboItemSchema = new mongoose.Schema({
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: [1, 'Quantity must be at least 1']
    }
}, { _id: false });

const comboSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide combo name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide combo description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide combo price'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        required: [true, 'Please provide original price'],
        min: [0, 'Original price cannot be negative']
    },
    savings: {
        type: Number,
        default: function() {
            return this.originalPrice - this.price;
        }
    },
    image: {
        type: String,
        required: [true, 'Please provide combo image URL']
    },
    rating: {
        type: Number,
        default: 4.5,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot be more than 5']
    },
    isVeg: {
        type: Boolean,
        default: true
    },
    items: [comboItemSchema],
    isAvailable: {
        type: Boolean,
        default: true
    },
    validFrom: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date,
        default: function() {
            // Default to 1 month from now
            const date = new Date();
            date.setMonth(date.getMonth() + 1);
            return date;
        }
    },
    maxOrdersPerDay: {
        type: Number,
        default: 100
    },
    ordersToday: {
        type: Number,
        default: 0
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual for checking if combo is currently available
comboSchema.virtual('isCurrentlyAvailable').get(function() {
    const now = new Date();
    return this.isAvailable &&
           this.isActive &&
           now >= this.validFrom &&
           now <= this.validUntil &&
           this.ordersToday < this.maxOrdersPerDay;
});

// Index for better performance
comboSchema.index({ isAvailable: 1, isActive: 1 });
comboSchema.index({ validFrom: 1, validUntil: 1 });
comboSchema.index({ name: 'text', description: 'text' });

// Middleware to populate menu items
comboSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'items.menuItemId',
        select: 'name category price image isVeg'
    });
    next();
});

// Method to check availability
comboSchema.methods.checkAvailability = function() {
    return this.isCurrentlyAvailable;
};

// Method to increment order count
comboSchema.methods.incrementOrderCount = async function() {
    this.ordersToday += 1;
    this.totalOrders += 1;
    return await this.save();
};

// Static method to reset daily counts
comboSchema.statics.resetDailyCounts = async function() {
    return await this.updateMany({}, { ordersToday: 0 });
};

module.exports = mongoose.model('Combo', comboSchema);