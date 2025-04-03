const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    masterSubscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionMaster", // Reference SubscriptionMaster
        required: true,
    },
    wef: {
        type: Date,
        required: true,
    },
    displayPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    sellingPrice: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value < this.displayPrice;
            },
            message: "Selling price must be less than display price",
        },
    },
    maxEmployees: {
        type: Number,
        required: true,
        min: 1,
    },
    validityInDays: {
        type: Number,
        required: true,
        min: 1,
    },
    status: {
        type: String,
        enum: ["ACTIVE", "DISABLED"],
        default: "ACTIVE",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure uniqueness of masterSubscription + WEF
subscriptionSchema.index({ masterSubscription: 1, wef: 1 }, { unique: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
