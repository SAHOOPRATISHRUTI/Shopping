const cartService = require("../services/cartService");
const Response = require("../helpers/response");
const messages = require("../contstants/constantMessage");
const couponService = require("../services/couponService");
const Coupon = require("../models/couponModel");
/** Apply Coupon */
const applyCouponToCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { couponCode } = req.body;

        const result = await cartService.applyCoupon(cartId, couponCode);

        if (result.isCartNotFound) {
            return Response.failResponse(req, res, null, messages.cartNotFound, 404);
        }

        if (result.isCouponNotFound) {
            return Response.failResponse(req, res, null, messages.couponNotFound, 404);
        }

        if (result.isCouponExpired) {
            return Response.failResponse(req, res, null, messages.couponExpired, 400);
        }

        if (result.isCouponLimitReached) {
            return Response.failResponse(req, res, null, messages.couponLimitReached, 400);
        }

        if (result.isMinPurchaseNotMet) {
            return Response.failResponse(req, res, null, messages.couponMinPurchase, 400);
        }

        return Response.successResponse(req, res, result.cart, messages.couponApplied, 200);
    } catch (error) {
        console.error("Apply Coupon Error:", error);
        return Response.errorResponse(req, res, error);
    }
};
const createCoupon = async (req, res) => {
    const result = await couponService.createCoupon(req.body);

    if (result.error) {
        return Response.failResponse(req, res, null, result.message, 400);
    }

    return Response.successResponse(req, res, result.coupon, messages.couponCreated, 201);
};

/** Get All Coupons */
const getAllCoupons = async (req, res) => {
    const result = await couponService.getAllCoupons();
    return Response.successResponse(req, res, result.coupons, messages.couponsFetched, 200);
};

/** Get Coupon By Code */
const getCouponByCode = async (req, res) => {
    const { code } = req.params;
    const result = await couponService.getCouponByCode(code);

    if (result.error) {
        return Response.failResponse(req, res, null, result.message, 404);
    }

    return Response.successResponse(req, res, result.coupon, messages.couponFetched, 200);
};

/** Delete Coupon */
const deleteCoupon = async (req, res) => {
    const { couponId } = req.params;
    const result = await couponService.deleteCoupon(couponId);

    if (result.error) {
        return Response.failResponse(req, res, null, result.message, 404);
    }

    return Response.successResponse(req, res, result.coupon, messages.couponDeleted, 200);
};

const updateCouponById = async (req, res) => {
    const { couponId } = req.params;
    const updateData = req.body;

    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updateData, { new: true, runValidators: true });

        if (!updatedCoupon) {
            return Response.failResponse(req, res, null, messages.couponNotFound, 404);
        }

        return Response.successResponse(req, res, updatedCoupon, messages.couponUpdated, 200);
    } catch (error) {
        console.error("Update Coupon Error:", error);
        return Response.errorResponse(req, res, error);
    }
};

module.exports = {
    createCoupon,
    getAllCoupons,
    getCouponByCode,
    deleteCoupon,
    updateCouponById,
    applyCouponToCart,
};
