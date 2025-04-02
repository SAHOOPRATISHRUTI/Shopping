const Subscription = require("../models/manageSubscriptionModel");
const createSubscription = async (subscriptionData) => {
    const { name, wef, sellingPrice, displayPrice, validityInDays, maxEmployees } = subscriptionData;

    // Ensure all required fields are provided
    if (!name || !wef || !validityInDays || !maxEmployees || !sellingPrice || !displayPrice) {
        return { error: true, message: "All fields (name, wef, sellingPrice, displayPrice, validityInDays, maxEmployees) are required." };
    }

    // Ensure selling price is less than display price
    if (sellingPrice >= displayPrice) {
        return { error: true, message: "Selling price must be less than display price." };
    }

    const subscriptionName = name.toUpperCase();
    const wefDate = new Date(wef);

    // Reset current date to midnight for accurate comparison
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Ensure WEF date is not in the past
    if (wefDate < currentDate) {
        return { error: true, message: "WEF date cannot be in the past." };
    }

    // Fetch the most recent active subscription (for comparison)
    const activeSubscription = await Subscription.findOne({
        name: subscriptionName,
        wef: { $lt: currentDate }
    }).sort({ wef: -1 });

    // If there is an active subscription, ensure that the new WEF is after the current active subscription's expiry
    if (activeSubscription) {
        const latestExpiryDate = new Date(activeSubscription.wef);
        latestExpiryDate.setDate(latestExpiryDate.getDate() + activeSubscription.validityInDays);

        // If the new WEF is on or before the expiry of the current active subscription, prevent creation
        if (wefDate <= latestExpiryDate) {
            return { error: true, message: `Next subscription can only start on or after ${latestExpiryDate.toISOString().split("T")[0]}.` };
        }
    }

    // Fetch all future subscriptions for the same name (checking both active and future subscriptions)
    const allFutureSubscriptions = await Subscription.find({
        name: subscriptionName,
        wef: { $gte: currentDate }
    }).lean();

    // Ensure only 2 future subscriptions exist (1 can be active, and 2 can be future)
    if (allFutureSubscriptions.length >= 2) {
        return { error: true, message: "Only 2 future subscriptions are allowed for this plan." };
    }

    // Create the new subscription
    const newSubscription = await Subscription.create({
        name: subscriptionName,
        wef,
        sellingPrice,
        displayPrice,
        validityInDays,
        maxEmployees
    });

    // Return success with the newly created subscription data
    return { success: true, subscription: newSubscription };
};

const listSubscriptions = async () => {
    const subscriptions = await Subscription.find().sort({ wef: 1 });
    return { success: true, subscriptions };
};

const getSubscriptionById = async (subscriptionId) => {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
        return { error: true, message: "Subscription not found" };
    }
    return { success: true, subscription };
};

module.exports = { 
    createSubscription, 
    listSubscriptions, 
    getSubscriptionById, 
};
