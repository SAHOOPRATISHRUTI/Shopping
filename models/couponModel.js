const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    discountType: {
        type: String,
        enum: ["PERCENTAGE", "FIXED"],
        required: true
    },
    minPurchase: {
        type: Number,
        default: 0  // Minimum cart value required to apply the coupon
    },
    expiresAt: {
        type: Date,
        required: true  // Expiry date for the coupon
    },
    usageLimit: {
        type: Number,
        default: 1  // Max number of times a coupon can be used
    },
    usedCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
