const subscriptionService = require("../services/manageSubscriptionService");
const Response = require("../helpers/response");
const messages = require("../contstants/constantMessage");


const createSubscription = async (req, res) => {
    console.log("Creating Subscription");

    try {
        const { name, wef, displayPrice, sellingPrice, maxEmployees, validityInDays } = req.body;

        // Ensure all fields are present
        if (!name || !wef || !displayPrice || !sellingPrice || !maxEmployees || !validityInDays) {
            return Response.failResponse(req, res, null, "All fields are required.", 400);
        }

        // Call service function to create the subscription with added validation logic
        const result = await subscriptionService.createSubscription({
            name,
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
        console.error("Error creating subscription:", error);  // Add logging for debugging
        return Response.failResponse(req, res, null, error.message, 500);
    }
};



const listSubscriptions = async (req, res) => {
    const result = await subscriptionService.listSubscriptions();

    return Response.successResponse(req, res, result.subscriptions, messages.subscriptionFetched, 200);
};


const getSubscriptionById = async (req, res) => {
    const result = await subscriptionService.getSubscriptionById(req.params.id);

    if (result.error) {
        return Response.failResponse(req, res, null, result.message, 404);
    }

    return Response.successResponse(req, res, result.subscription, messages.subscriptionFetched, 200);
};

module.exports = { createSubscription ,listSubscriptions,getSubscriptionById};
