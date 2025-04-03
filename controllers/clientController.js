const clientService = require("../services/clientService");

/**
 * Get all active subscriptions (latest based on WEF)
 */
exports.getActiveSubscriptions = async (req, res) => {
    try {
        const subscriptions = await clientService.getActiveSubscriptions();
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get all available coupons (valid coupons for registration date)
 */
exports.getAvailableCoupons = async (req, res) => {
    try {
        const coupons = await clientService.getAvailableCoupons();
        res.status(200).json({ success: true, data: coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Register a new client with subscription and optional coupon
 */
exports.registerClient = async (req, res) => {
    try {
        const clientData = req.body;

        // **Check for required fields**
        if (!clientData.name || !clientData.email || !clientData.subscriptionId) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and subscription ID are required.",
            });
        }

        // **Call service to register client**
        const newClient = await clientService.registerClient(clientData);

        return res.status(201).json({
            success: true,
            message: "Client Registered Successfully",
            data: newClient,
        });
    } catch (error) {
        console.error("Error registering client:", error); // Log for debugging

        // Differentiate validation errors vs server errors
        const statusCode = error.message.includes("exists") || error.message.includes("Invalid") ? 400 : 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

exports .getAllClients = async (req, res) => {
    try {
        const clients = await clientService.getAllClients();
        res.status(200).json({ data: clients });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
