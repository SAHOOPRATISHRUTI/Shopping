const Subscription = require("../models/manageSubscriptionModel");
const SubscriptionMaster = require("../models/SubscriptionMaster");

const createSubscription = async (subscriptionData) => {
    const { masterSubscriptionId, wef, sellingPrice, displayPrice, validityInDays, maxEmployees } = subscriptionData;

    // Ensure all required fields are provided
    if (!masterSubscriptionId || !wef || !validityInDays || !maxEmployees || !sellingPrice || !displayPrice) {
        return { error: true, message: "All fields (masterSubscriptionId, wef, sellingPrice, displayPrice, validityInDays, maxEmployees) are required." };
    }

    // Ensure selling price is less than display price
   // Convert to numbers
const numericSellingPrice = parseFloat(sellingPrice);
const numericDisplayPrice = parseFloat(displayPrice);

// Ensure selling price is less than display price
if (isNaN(numericSellingPrice) || isNaN(numericDisplayPrice)) {
    return { error: true, message: "Invalid price values." };
}

if (numericSellingPrice >= numericDisplayPrice) {
    return { error: true, message: "Selling price must be less than display price." };
}

    const wefDate = new Date(wef);

    // Reset current date to midnight for accurate comparison
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Ensure WEF date is not in the past
    if (wefDate < currentDate) {
        return { error: true, message: "WEF date cannot be in the past." };
    }

    // Check if SubscriptionMaster exists
    const masterSubscription = await SubscriptionMaster.findById(masterSubscriptionId);
    if (!masterSubscription) {
        return { error: true, message: "Invalid masterSubscriptionId. No such subscription master exists." };
    }

    // Fetch the most recent active subscription (for comparison)
    const activeSubscription = await Subscription.findOne({
        masterSubscription: masterSubscriptionId,
        wef: { $lt: currentDate }
    }).sort({ wef: -1 });

    // Ensure the new WEF is after the last active subscription's expiry date
    if (activeSubscription) {
        const latestExpiryDate = new Date(activeSubscription.wef);
        latestExpiryDate.setDate(latestExpiryDate.getDate() + activeSubscription.validityInDays);

        if (wefDate <= latestExpiryDate) {
            return { error: true, message: `Next subscription can only start on or after ${latestExpiryDate.toISOString().split("T")[0]}.` };
        }
    }

    // Fetch all future subscriptions for the same master subscription
    const allFutureSubscriptions = await Subscription.find({
        masterSubscription: masterSubscriptionId,
        wef: { $gte: currentDate }
    }).lean();

    // Ensure only 2 future subscriptions exist
    if (allFutureSubscriptions.length >= 2) {
        return { error: true, message: "Only 2 future subscriptions are allowed for this plan." };
    }

    // Fetch subscriptions from today and the nearest future subscription
    const activeSubscriptions = await Subscription.find({ 
        status: "ACTIVE", 
        wef: { $gte: currentDate } // Get records from today onwards
    })
    .populate("masterSubscription", "name descriptions")
    .sort({ wef: 1 }) // Sort to get the nearest future one first
    .limit(2); // Show today's subscription and the nearest future one

    // Create the new subscription
    const newSubscription = await Subscription.create({
        masterSubscription: masterSubscriptionId,
        wef,
        sellingPrice,
        displayPrice,
        validityInDays,
        maxEmployees
    });

    return { 
        success: true, 
        subscription: newSubscription, 
        activeSubscriptions // Include active subscriptions in the response
    };
};


const listSubscriptions = async () => {
    const subscriptions = await Subscription.find()
        .populate("masterSubscription", "name descriptions") // Ensure correct field names
        .sort({ wef: 1 });

    return { success: true, subscriptions };
};


module.exports = { 
    createSubscription, 
    listSubscriptions, 
};
