const cartService = require("../services/cartService");
const Response = require("../helpers/response");
const messages = require("../contstants/constantMessage");
const couponService = require("../services/couponService");
const Coupon = require("../models/couponModel");
/** Apply Coupon */

const createCoupon = async (req, res) => {
    const { code, startsFrom, endsOn } = req.body;
    console.log(req.body);
    console.log("33333");
    // Validate required fields
    if (!code || !startsFrom || !endsOn) {
        return Response.failResponse(req, res, null, "All fields are required.", 400);
    }

    // Validate date logic
    if (new Date(endsOn) <= new Date(startsFrom)) {
        return Response.failResponse(req, res, null, "End date must be greater than start date.", 400);
    }
    console.log("8888");
    // Call service to create coupon
    const result = await couponService.createCoupon(req.body);
    console.log("555");

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



module.exports = {
    createCoupon,
    getAllCoupons,
    getCouponByCode,

};
