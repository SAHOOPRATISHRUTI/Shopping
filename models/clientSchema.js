const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, // Client Name
    email: { type: String, required: true, unique: true, trim: true }, // Unique Email
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
        required: true, // Selected Subscription Type
    },
    displayPrice: { type: Number, required: true }, // Display Price
    sellingPrice: { type: Number, required: true }, // Selling Price before Coupon
    appliedCoupon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
        default: null, // Applied Coupon (Optional)
    },
    discountAmount: { type: Number, required: true },
    finalPrice: { type: Number, required: true }, // Final Price after Coupon
    registeredAt: { type: Date, default: Date.now }, // Registration Date
});

// Create Model
module.exports = mongoose.model("Client", clientSchema);
