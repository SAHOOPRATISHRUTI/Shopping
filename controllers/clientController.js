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
        const newClient = await clientService.registerClient(clientData);

        res.status(201).json({
            success: true,
            message: "Client Registered Successfully",
            data: newClient,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
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
