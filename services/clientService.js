const Client = require("../models/clientSchema");
const Subscription = require("../models/manageSubscriptionModel");
const Coupon = require("../models/couponModel");

// Fetch All Active Subscriptions (Latest as per WEF)
const getActiveSubscriptions = async () => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    return await Subscription.find({ 
        status: "ACTIVE", 
        wef: { 
            $gte: new Date(today + "T00:00:00.000Z") // Get records from today onwards
        }
    })
    .populate("masterSubscription", "name descriptions")
    .sort({ wef: 1 }) // Sort in ascending order to get the nearest date first
    .limit(3); // Show only today's record and the nearest future one
};



// Register a Client with Subscription & Coupon (if applied)
const registerClient = async (clientData) => {
    const { name, email, subscriptionId, couponCode } = clientData;

    // Check if Email is already registered
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
        throw new Error("Client with this email already exists");
    }

    // Fetch Subscription Details
    const subscription = await Subscription.findById(subscriptionId).populate("masterSubscription");
    if (!subscription) {
        throw new Error("Invalid Subscription ID");
    }

    let finalPrice = subscription.sellingPrice;
    let appliedCoupon = null;
    let discountAmount = 0; // 👈 Initialize Discount

    // Validate Coupon if applied
    if (couponCode) {
        const coupon = await Coupon.findOne({
            code: couponCode,
            startsFrom: { $lte: new Date() },
            endsOn: { $gte: new Date() },
        });

        if (!coupon) {
            throw new Error("Invalid or Expired Coupon Code");
        }

        appliedCoupon = coupon._id;

        // Apply Coupon Discount
        if (coupon.couponType === "Percentage") {
            discountAmount = (finalPrice * coupon.couponValue) / 100;
            finalPrice -= discountAmount;
        } else if (coupon.couponType === "Fixed") {
            discountAmount = coupon.couponValue;
            finalPrice -= discountAmount;
        }

        if (finalPrice < 0) finalPrice = 0; // Prevent negative price
    }

    // Register Client
    const newClient = new Client({
        name,
        email,
        subscription: subscriptionId,
        displayPrice: subscription.displayPrice,
        sellingPrice: subscription.sellingPrice,
        appliedCoupon,
        finalPrice,
        discountAmount, // 👈 Store Discount Amount
    });

    await newClient.save();
    return newClient;
};


// Fetch Available Coupons (Active Coupons Based on Registration Date)
const getAvailableCoupons = async () => {
    return await Coupon.find({
        startsFrom: { $lte: new Date() },
        endsOn: { $gte: new Date() },
    });
};
const getAllClients = async () => {
    return Client.find().sort({ createdAt: -1 });
};


// Export Service Functions
module.exports = { getActiveSubscriptions, registerClient, getAvailableCoupons,getAllClients };
