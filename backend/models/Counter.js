const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    }, // 'order-counter-YYYY-MM-DD'
    date: {
        type: String,
        required: true
    }, // 'YYYY-MM-DD'
    sequence: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Static method to get next order number
counterSchema.statics.getNextOrderNumber = async function() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const counterId = `order-counter-${today}`;

    const counter = await this.findOneAndUpdate(
        { _id: counterId, date: today },
        { $inc: { sequence: 1 } },
        { upsert: true, new: true }
    );

    // Format as 0001, 0002, etc.
    return counter.sequence.toString().padStart(4, '0');
};

module.exports = mongoose.model('Counter', counterSchema);
