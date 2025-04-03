const Client = require("../models/clientSchema");
const Subscription = require("../models/manageSubscriptionModel");
const Coupon = require("../models/couponModel");

// Fetch All Active Subscriptions (Latest as per WEF)
const getActiveSubscriptions = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for date-only comparison

    // Fetch all active subscriptions sorted by wef date
    const activeSubscriptions = await Subscription.find({ 
        status: "ACTIVE", 
        wef: { $gte: today } // Get today and future records
    })
    .populate("masterSubscription", "name descriptions")
    .sort({ wef: 1 }); // Sort to get the nearest dates first

    // Group by masterSubscription._id and keep only the closest date
    const closestSubscriptions = {};
    for (const sub of activeSubscriptions) {
        const masterId = sub.masterSubscription._id.toString();
        if (!closestSubscriptions[masterId]) {
            closestSubscriptions[masterId] = sub; // Store the first (nearest) subscription per masterSubscription._id
        }
    }

    // Convert object values back to an array
    return Object.values(closestSubscriptions);
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

    let finalPrice = parseFloat(subscription.sellingPrice); // Ensure it's a number
    let appliedCoupon = null;
    let discountAmount = 0; // 👈 Initialize Discount

    // **Only validate coupon if it's provided**
    if (couponCode) {
        const coupon = await Coupon.findOne({
            code: couponCode,
            startsFrom: { $lte: new Date() },
            endsOn: { $gte: new Date() },
        });

        if (coupon) {
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
        // If coupon is invalid, ignore it (instead of throwing an error)
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
