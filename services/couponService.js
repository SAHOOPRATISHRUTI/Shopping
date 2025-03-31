const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");

// const applyCoupon = async (cartId, couponCode) => {
//     const cart = await Cart.findById(cartId);
//     if (!cart) return { isCartNotFound: true };

//     if (!cart.totalPrice || cart.totalPrice <= 0) {
//         return { isCartTotalInvalid: true };
//     }

//     const coupon = await Coupon.findOne({ code: couponCode });
//     if (!coupon) return { isCouponInvalid: true };

//     if (new Date(coupon.expiresAt) < new Date()) {
//         return { isCouponExpired: true };
//     }

//     if (coupon.usedCount >= coupon.usageLimit) {
//         return { isCouponLimitReached: true };
//     }

//     if (cart.totalPrice < coupon.minPurchase) {
//         return { isMinimumPurchaseNotMet: true };
//     }

//     console.log("Applying Coupon:", coupon.code);
//     console.log("Discount Type:", coupon.discountType);
//     console.log("Discount Value:", coupon.discount);
//     console.log("Cart Total Before:", cart.totalPrice);

//     let discount = 0;
//     if (coupon.discountType === "PERCENTAGE") {
//         discount = (cart.totalPrice * coupon.discount) / 100;
//     } else if (coupon.discountType === "FIXED") {
//         discount = coupon.discount;
//     }

//     console.log("Calculated Discount:", discount);

//     cart.totalPrice = Math.max(0, cart.totalPrice - discount); // Ensure price doesn't go negative
//     cart.coupon = {
//         discountType: coupon.discountType,
//         discount: discount
//     };

//     await cart.save();

//     // Update coupon usage
//     coupon.usedCount += 1;
//     await coupon.save();

//     console.log("Updated Cart Total:", cart.totalPrice);

//     return { success: true, cart };
// };

const applyCoupon = async (cartId, couponCode) => {
    const cart = await Cart.findById(cartId);
    if (!cart) return { isCartNotFound: true };

    if (!cart.totalPrice || cart.totalPrice <= 0) {
        return { isCartTotalInvalid: true };
    }

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) return { isCouponInvalid: true };

    if (new Date(coupon.expiresAt) < new Date()) {
        return { isCouponExpired: true };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
        return { isCouponLimitReached: true };
    }

    if (cart.totalPrice < coupon.minPurchase) {
        return { isMinimumPurchaseNotMet: true };
    }

    console.log("Applying Coupon:", coupon.code);
    console.log("Discount Type:", coupon.discountType);
    console.log("Discount Value:", coupon.discount);
    console.log("Cart Total Before:", cart.totalPrice);

    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
        discount = (cart.totalPrice * coupon.discount) / 100;
    } else if (coupon.discountType === "FIXED") {
        discount = coupon.discount;
    }

    discount = parseFloat(discount.toFixed(2)); // Ensure proper formatting
    console.log("Calculated Discount:", discount);

    cart.totalPrice = parseFloat(Math.max(0, cart.totalPrice - discount).toFixed(2)); // Ensure correct price format
    cart.coupon = {
        code: coupon.code,
        discountType: coupon.discountType,
        discount: discount
    };

    await cart.save();

    // Increment coupon usage count safely
    await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });

    console.log("Updated Cart Total:", cart.totalPrice);

    return { success: true, cart };
};


const createCoupon = async (couponData) => {
    const existingCoupon = await Coupon.findOne({ code: couponData.code }).lean();
    if (existingCoupon) {
        return { error: true, message: "Coupon with this code already exists." };
    }

    const newCoupon = await Coupon.create(couponData);
    return { success: true, coupon: newCoupon };
};

const getAllCoupons = async () => {
    const coupons = await Coupon.find().lean();
    return { success: true, coupons };
};

const getCouponByCode = async (code) => {
    const coupon = await Coupon.findOne({ code }).lean();
    if (!coupon) {
        return { error: true, message: "Coupon not found." };
    }
    return { success: true, coupon };
};

const deleteCoupon = async (couponId) => {
    const deletedCoupon = await Coupon.findByIdAndDelete(couponId).lean();
    if (!deletedCoupon) {
        return { error: true, message: "Coupon not found." };
    }
    return { success: true, coupon: deletedCoupon };
};

const updateCouponById = (couponId, updateData) => {
    return Coupon.findByIdAndUpdate(
        couponId,
        updateData,
        { new: true, runValidators: true }
    ).exec();
};

module.exports = {
    applyCoupon,
    createCoupon,
    getAllCoupons,
    getCouponByCode,
    deleteCoupon,
    updateCouponById
};
