const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: 'cafe-settings'
    }, // Single document
    cafeName: {
        type: String,
        default: 'Café Coffeto',
        trim: true,
        maxlength: [100, 'Cafe name cannot exceed 100 characters']
    },
    operatingHours: {
        type: String,
        default: 'Mon-Sun: 8:00 AM - 10:00 PM',
        trim: true
    },
    contactPhone: {
        type: String,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please provide a valid phone number']
    },
    instagram: {
        type: String,
        trim: true,
        maxlength: [50, 'Instagram handle cannot exceed 50 characters']
    },
    address: {
        type: String,
        trim: true,
        maxlength: [500, 'Address cannot exceed 500 characters']
    },
    taxPercentage: {
        type: Number,
        default: 0,
        min: [0, 'Tax percentage cannot be negative'],
        max: [100, 'Tax percentage cannot exceed 100']
    }
}, { timestamps: true });

// Static method to get settings (singleton pattern)
settingsSchema.statics.getSettings = async function() {
    let settings = await this.findById('cafe-settings');

    if (!settings) {
        // Create default settings if not exists
        settings = await this.create({
            _id: 'cafe-settings',
            cafeName: 'Café Coffeto',
            operatingHours: 'Mon-Sun: 8:00 AM - 10:00 PM',
            taxPercentage: 0
        });
    }

    return settings;
};

// Static method to update settings
settingsSchema.statics.updateSettings = async function(updates) {
    const settings = await this.findByIdAndUpdate(
        'cafe-settings',
        updates,
        { new: true, upsert: true, runValidators: true }
    );

    return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
