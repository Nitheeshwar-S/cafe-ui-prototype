const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide item name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide item description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Please specify category'],
        enum: {
            values: ['coffee', 'beverages', 'snacks', 'desserts'],
            message: 'Category must be one of: coffee, beverages, snacks, desserts'
        }
    },
    price: {
        type: Number,
        required: [true, 'Please provide price'],
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        required: [true, 'Please provide image URL']
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
    sizes: [{
        type: String,
        enum: ['S', 'M', 'L', '6 pcs', '9 pcs', '12 pcs']
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: Number,
        default: 10 // in minutes
    },
    ingredients: [String],
    allergens: [String],
    nutritionalInfo: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number
    }
}, {
    timestamps: true
});

// Index for better search performance
menuItemSchema.index({ name: 'text', description: 'text' });
menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ isVeg: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);