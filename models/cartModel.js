const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    coupon: {
        code: { type: String },  // Coupon code
        discount: { type: Number, default: 0 },  // Discount amount
        discountType: { type: String, enum: ["PERCENTAGE", "FIXED"], default: null }  // Discount type
    }
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
