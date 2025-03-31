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
    totalPrice: {  // Original total before discount
        type: Number,
        required: true
    },
    discountPrice: {  // Amount reduced by coupon
        type: Number,
        default: 0
    },
    finalPrice: {  // Total after discount
        type: Number
    },
    coupon: {
        code: { type: String },
        discount: { type: Number, default: 0 },  
        discountType: { type: String, enum: ["PERCENTAGE", "FIXED"], default: null }  
    }
}, { timestamps: true });

// ✅ Automatically update finalPrice before saving
cartSchema.pre("save", function (next) {
    this.finalPrice = this.totalPrice - this.discountPrice;
    next();
});

module.exports = mongoose.model("Cart", cartSchema);
