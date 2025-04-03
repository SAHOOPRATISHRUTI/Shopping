const SubscriptionService = require("../services/subscriptionService");
const Responses = require("../helpers/response");

// Create a new subscription
const createSubscription = async (req, res) => {
    try {
        console.log("🟢 Received Payload:", req.body);

        const result = await SubscriptionService.addSubscription(req.body);

        if (result?.alreadyExists) {
            return Responses.failResponse(req, res, null, 'Subscription name already exists!', 400);
        }

        if (result?.error) {
            return Responses.failResponse(req, res, null, result.error, 400);
        }

        return Responses.successResponse(req, res, result, 'Subscription created successfully!', 201);
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

const getSubscriptions = async (req, res) => {
    console.log("Fetching subscriptions...");
    
    try {
        const subscriptions = await SubscriptionService.getSubscriptions();
        
        if (!subscriptions.data || subscriptions.data.length === 0) {
            return Responses.failResponse(req, res, null, 'No subscriptions found', 404);
        }

        return Responses.successResponse(req, res, subscriptions, 'Subscriptions retrieved successfully', 200);
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};


// Activate a subscription
const activateSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const subscription = await SubscriptionService.activateSubscription(subscriptionId);

        return Responses.successResponse(req, res, subscription, 'Subscription activated successfully!', 200);
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Deactivate a subscription
const deactivateSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const subscription = await SubscriptionService.deactivateSubscription(subscriptionId);

        return Responses.successResponse(req, res, subscription, 'Subscription deactivated successfully!', 200);
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Update a subscription description
const updateSubscriptionDescription = async (req, res) => {
    try {
        const { subscriptionId, descriptionIndex } = req.params;
        const { newDescription } = req.body;

        if (!newDescription?.trim()) {
            return Responses.failResponse(req, res, null, 'Description cannot be empty!', 400);
        }

        const updatedSubscription = await SubscriptionService.updateSubscriptionDescription(subscriptionId, descriptionIndex, newDescription);

        return Responses.successResponse(req, res, updatedSubscription, 'Subscription description updated successfully!', 200);
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Delete a subscription description
const deleteSubscriptionDescription = async (req, res) => {
    try {
        const { subscriptionId, descriptionIndex } = req.params;

        const updatedSubscription = await SubscriptionService.deleteSubscriptionDescription(subscriptionId, descriptionIndex);

        return Responses.successResponse(req, res, updatedSubscription, 'Subscription description deleted successfully!', 200);
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};

module.exports = {
    createSubscription,
    getSubscriptions,
    activateSubscription,
    deactivateSubscription,
    updateSubscriptionDescription,
    deleteSubscriptionDescription
};
