const express = require("express");
const couponController = require("../controllers/couponController");
const couponValidator = require("../validator/couponValidator");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Apply Coupon to Cart
router.post("/apply/:cartId", verifyToken, couponValidator.applyCouponValidator, couponController.applyCouponToCart);
// router.post(
//     "/apply-coupon/:cartId",
//     verifyToken,
//     couponValidator.applyCouponValidator,
//     couponController.applyCouponToCart
// );

router.post("/create", couponValidator.createCouponValidator, couponController.createCoupon);

/** Get All Coupons */
router.get("/all", couponController.getAllCoupons);

/** Get Coupon By Code */
router.get("/:code", couponValidator.getCouponByCodeValidator, couponController.getCouponByCode);

/** Delete Coupon */
router.delete("/:couponId", couponValidator.deleteCouponValidator, couponController.deleteCoupon);

/** Apply Coupon */
// router.post("/apply", couponValidator.applyCouponValidator, couponController.applyCoupon);

module.exports = router;
