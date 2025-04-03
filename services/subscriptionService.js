const SubscriptionMaster = require("../models/SubscriptionMaster");

// Create a new subscription
const addSubscription = async (data) => {
    console.log("🟢 Received in addSubscription:", data);

    // Validate required fields
    if (!data?.name?.trim() || !data?.descriptions) {
        return { error: true, message: "Subscription name and at least one description are required!" };
    }

    // Ensure descriptions is an array
    let descriptions = Array.isArray(data.descriptions) 
        ? data.descriptions.map(desc => desc.trim()) 
        : [data.descriptions.trim()];

    if (descriptions.length === 0) {
        return { error: true, message: "At least one description is required!" };
    }

    // Check if subscription name already exists (case-insensitive)
    const existingSub = await SubscriptionMaster.findOne({ name: new RegExp(`^${data.name.trim()}$`, "i") });
    if (existingSub) {
        return { error: true, message: "Subscription name already exists!" };
    }

    // Create new subscription
    const newSubscription = new SubscriptionMaster({
        name: data.name.trim().toUpperCase(),
        descriptions,
        isActive: false, // By default, a new subscription is inactive
    });

    // Save subscription
    const savedSubscription = await newSubscription.save();
    return { success: true, message: "Subscription added successfully!", data: savedSubscription };
};

// Fetch all subscriptions
const getSubscriptions = async () => {
    console.log("=5999999999999");
    const subscriptions = await SubscriptionMaster.find();
    return { success: true, data: subscriptions };
};

// Activate a subscription
const activateSubscription = async (subscriptionId) => {
    const subscription = await SubscriptionMaster.findById(subscriptionId);
    if (!subscription) return { error: true, message: "Subscription not found" };
    if (subscription.isActive) return { error: true, message: "Subscription is already active" };

    subscription.isActive = true;
    await subscription.save();
    return { success: true, message: "Subscription activated!", data: subscription };
};

// Deactivate a subscription
const deactivateSubscription = async (subscriptionId) => {
    const subscription = await SubscriptionMaster.findById(subscriptionId);
    if (!subscription) return { error: true, message: "Subscription not found" };
    if (!subscription.isActive) return { error: true, message: "Subscription is already inactive" };

    subscription.isActive = false;
    await subscription.save();
    return { success: true, message: "Subscription deactivated!", data: subscription };
};

// Update a subscription description
const updateSubscriptionDescription = async (subscriptionId, descriptionIndex, newDescription) => {
    const subscription = await SubscriptionMaster.findById(subscriptionId);
    if (!subscription) return { error: true, message: "Subscription not found" };
    
    if (descriptionIndex < 0 || descriptionIndex >= subscription.descriptions.length) {
        return { error: true, message: "Invalid description index" };
    }

    subscription.descriptions[descriptionIndex] = newDescription.trim();
    await subscription.save();
    return { success: true, message: "Subscription description updated!", data: subscription };
};

// Delete a subscription description
const deleteSubscriptionDescription = async (subscriptionId, descriptionIndex) => {
    const subscription = await SubscriptionMaster.findById(subscriptionId);
    if (!subscription) return { error: true, message: "Subscription not found" };

    if (descriptionIndex < 0 || descriptionIndex >= subscription.descriptions.length) {
        return { error: true, message: "Invalid description index" };
    }

    subscription.descriptions.splice(descriptionIndex, 1);

    if (subscription.descriptions.length === 0) {
        return { error: true, message: "At least one description is required!" };
    }

    await subscription.save();
    return { success: true, message: "Subscription description deleted!", data: subscription };
};

module.exports = {
    addSubscription,
    getSubscriptions,
    activateSubscription,
    deactivateSubscription,
    updateSubscriptionDescription,
    deleteSubscriptionDescription
};
