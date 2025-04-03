const subscriptionService = require("../services/manageSubscriptionService");
const Response = require("../helpers/response");
const messages = require("../contstants/constantMessage");

const createSubscription = async (req, res) => {
    console.log("Creating Subscription");

    try {
        const { masterSubscriptionId, wef, displayPrice, sellingPrice, maxEmployees, validityInDays } = req.body;

        // Ensure all fields are present
        if (!masterSubscriptionId || !wef || !displayPrice || !sellingPrice || !maxEmployees || !validityInDays) {
            return Response.failResponse(req, res, null, "All fields are required.", 400);
        }

        // Call service function to create the subscription
        const result = await subscriptionService.createSubscription({
            masterSubscriptionId, // ✅ Fixed reference to SubscriptionMaster
            wef,
            displayPrice,
            sellingPrice,
            maxEmployees,
            validityInDays,
        });

        // Check if the service returned an error
        if (result.error) {
            return Response.failResponse(req, res, null, result.message, 400);
        }

        return Response.successResponse(req, res, result.subscription, "Subscription created successfully.", 201);
    } catch (error) {
        console.error("Error creating subscription:", error);
        return Response.failResponse(req, res, null, error.message, 500);
    }
};

const listSubscriptions = async (req, res) => {
    try {
        const result = await subscriptionService.listSubscriptions();

        return Response.successResponse(req, res, result.subscriptions, messages.subscriptionFetched, 200);
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return Response.failResponse(req, res, null, "Failed to fetch subscriptions.", 500);
    }
};

module.exports = { createSubscription, listSubscriptions };
