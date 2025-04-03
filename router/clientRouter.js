const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

// Get all active subscriptions
router.get("/subscriptions", clientController.getActiveSubscriptions);

// Get all available coupons
router.get("/coupons", clientController.getAvailableCoupons);

// Register a new client
router.post("/register", clientController.registerClient);

router.get("/list", clientController.getAllClients);
module.exports = router;
