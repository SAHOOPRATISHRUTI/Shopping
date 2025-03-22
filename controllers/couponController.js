const cartService = require("../services/cartService");
const Response = require("../helpers/response");
const messages = require("../contstants/constantMessage");
const couponService = require("../services/couponService");
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
    try {
        const result = await couponService.createCoupon(req.body);

        if (result.isDuplicate) {
            return Response.failResponse(req, res, null, messages.couponExists, 400);
        }

        return Response.successResponse(req, res, result, messages.couponCreated, 201);
    } catch (error) {
        console.error("Create Coupon Error:", error);
        return Response.errorResponse(req, res, error);
    }
};

/** Get All Coupons */
const getAllCoupons = async (req, res) => {
    try {
        const result = await couponService.getAllCoupons();
        return Response.successResponse(req, res, result, messages.couponsFetched, 200);
    } catch (error) {
        console.error("Get All Coupons Error:", error);
        return Response.errorResponse(req, res, error);
    }
};

/** Get Coupon By Code */
const getCouponByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const result = await couponService.getCouponByCode(code);

        if (!result) {
            return Response.failResponse(req, res, null, messages.couponNotFound, 404);
        }

        return Response.successResponse(req, res, result, messages.couponFetched, 200);
    } catch (error) {
        console.error("Get Coupon By Code Error:", error);
        return Response.errorResponse(req, res, error);
    }
};

/** Delete Coupon */
const deleteCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        const result = await couponService.deleteCoupon(couponId);

        if (result.isNotFound) {
            return Response.failResponse(req, res, null, messages.couponNotFound, 404);
        }

        return Response.successResponse(req, res, result, messages.couponDeleted, 200);
    } catch (error) {
        console.error("Delete Coupon Error:", error);
        return Response.errorResponse(req, res, error);
    }
};


module.exports = {
    createCoupon,
    getAllCoupons,
    getCouponByCode,
    deleteCoupon,
    applyCouponToCart
};
