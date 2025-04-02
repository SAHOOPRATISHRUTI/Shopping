const express = require("express");
const manageSubscription= require("../controllers/manageSubscriptionController");

const router = express.Router();

router.post("/register" , manageSubscription.createSubscription);
router.get("/", manageSubscription.listSubscriptions);
router.get("/:id", manageSubscription.getSubscriptionById);

// router.get("/active/:name", manageSubscription.getActiveSubscription); // Get active subscription by name

module.exports = router;