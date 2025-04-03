const mongoose = require("mongoose");

const subscriptionMasterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        uppercase: true, 
        unique: true 
    },
    descriptions: [{
        type: String,
        required: true
    }],
    isActive: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Register the model
const SubscriptionMaster = mongoose.model("SubscriptionMaster", subscriptionMasterSchema);
module.exports = SubscriptionMaster;
