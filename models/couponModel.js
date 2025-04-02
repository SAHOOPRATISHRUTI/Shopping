const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // Unique Coupon Code
    couponType: { type: String, enum: ['Percentage', 'Fixed'], required: true }, // Enum Type
    couponValue: { type: Number, required: true }, // Discount Value
    startsFrom: { type: Date, required: true }, // Start Date
    endsOn: { type: Date, required: true }, // End Date
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
