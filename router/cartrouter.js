const express = require("express");
const cartController = require("../controllers/cartController");
const cartValidator = require("../validator/cartValidator");
const verifyToken = require("../middlewares/authMiddleware");
const couponValidator = require("../validator/couponValidator");
const router = express.Router();

// Create Cart
router.post("/create", verifyToken, cartValidator.createCartValidator, cartController.createCart);

// Update Cart
router.put("/update/:cartId", verifyToken, cartValidator.updateCartValidator, cartController.updateCart);

// Get All Carts
router.get("/all", verifyToken, cartController.getAllCarts);

// Get Cart by ID
router.get("/:cartId", verifyToken, cartController.getCartById);

// Delete Cart
router.delete("/delete/:cartId", verifyToken, cartController.deleteCart);

// Add Product to Cart
router.post("/add-product/:cartId", verifyToken, cartValidator.addProductValidator, cartController.addProductToCart);

// Remove Product from Cart
router.delete("/remove-product/:cartId/:productId", verifyToken, cartController.removeProductFromCart);

router.post(
    "/apply-coupon/:cartId",
    verifyToken,
    cartValidator.applyCouponValidator,
    cartController.applyCouponToCart
);
module.exports = router;

