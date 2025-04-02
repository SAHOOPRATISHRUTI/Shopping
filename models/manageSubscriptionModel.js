const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        uppercase: true, // Normalize to uppercase
    },
    wef: {
        type: Date,
        required: true,
    },
    displayPrice: {
        type: Number,
        required: true,
        min: 0, // Must be non-negative
    },
    sellingPrice: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value < this.displayPrice; // Selling price must be less than display price
            },
            message: "Selling price must be less than display price",
        },
    },
    maxEmployees: {
        type: Number,
        required: true,
        min: 1, // Must allow at least 1 employee
    },
    validityInDays: {
        type: Number,
        required: true,
        min: 1, // Minimum validity is 1 day
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure uniqueness of subscription name + WEF
subscriptionSchema.index({ name: 1, wef: 1 }, { unique: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);