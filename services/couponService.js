const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");



const createCoupon = async (couponData) => {
    // Check if the coupon code is unique
    const existingCoupon = await Coupon.findOne({ code: couponData.code }).lean();
    if (existingCoupon) {
        return { error: true, message: "Coupon with this code already exists." };
    }

    // Validate start and end dates
    if (new Date(couponData.endsOn) <= new Date(couponData.startsFrom)) {
        return { error: true, message: "End date must be greater than start date." };
    }

    // Create new coupon
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



module.exports = {
  
    createCoupon,
    getAllCoupons,
    getCouponByCode,
 
};
