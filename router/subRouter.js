const express = require("express");
const router = express.Router();
const subsController = require("../controllers/subscriptionController.js");

// Create a new subscription
router.post("/add-subs", subsController.createSubscription);

// Get all subscriptions
router.get("/subscriptions", subsController.getSubscriptions);

// Activate a subscription
router.put("/activate/:subscriptionId", subsController.activateSubscription);

// Deactivate a subscription
router.put("/deactivate/:subscriptionId", subsController.deactivateSubscription);

// Update a subscription description
router.put(
    "/update-description/:subscriptionId/:descriptionIndex",
    subsController.updateSubscriptionDescription
);

// Delete a subscription description
router.delete(
    "/delete-description/:subscriptionId/:descriptionIndex",
    subsController.deleteSubscriptionDescription
);

module.exports = router;
