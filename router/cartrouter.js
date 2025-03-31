// const express = require("express");
// const cartController = require("../controllers/cartController");
// const cartValidator = require("../validator/cartValidator");
// const verifyToken = require("../middlewares/authMiddleware");
// const couponValidator = require("../validator/couponValidator");
// const router = express.Router();

// // Create Cart
// router.post("/create", verifyToken, cartValidator.createCartValidator, cartController.createCart);

// // Update Cart
// router.put("/update/:cartId", verifyToken, cartValidator.updateCartValidator, cartController.updateCart);

// // Get All Carts
// router.get("/all", verifyToken, cartController.getAllCarts);

// // Get Cart by ID
// router.get("/:cartId", verifyToken, cartController.getCartById);

// // Delete Cart
// router.delete("/delete/:cartId", verifyToken, cartController.deleteCart);

// // Add Product to Cart
// router.post("/add-product/:cartId", verifyToken, cartValidator.addProductValidator, cartController.addProductToCart);

// // Remove Product from Cart
// router.delete("/remove-product/:cartId/:productId", verifyToken, cartController.removeProductFromCart);

// router.post(
//     "/apply-coupon/:cartId",
//     verifyToken,
//     cartValidator.applyCouponValidator,
//     cartController.applyCouponToCart
// );
// module.exports = router;

const express = require("express");
const cartController = require("../controllers/cartController");
const cartValidator = require("../validator/cartValidator");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

/** 🛒 Cart Routes */

// Create Cart
router.post("/", verifyToken, cartValidator.createCartValidator, cartController.createCart);

// Update Cart
router.put("/:cartId", verifyToken, cartValidator.updateCartValidator, cartController.updateCart);

// Get All Carts
router.get("/", verifyToken, cartController.getAllCarts);

// Get Cart by ID
router.get("/:cartId", verifyToken, cartController.getCartById);

// Delete Cart
router.delete("/:cartId", verifyToken, cartController.deleteCart);

/** 🛍 Product in Cart Routes */

// Add Product to Cart
router.post("/:cartId/product", verifyToken, cartValidator.addProductValidator, cartController.addProductToCart);

// Remove Product from Cart
router.delete("/:cartId/product/:productId", verifyToken, cartController.removeProductFromCart);

/** 🎟 Coupon Routes */

// Apply Coupon to Cart
router.post("/:cartId/coupon", verifyToken, cartValidator.applyCouponValidator, cartController.applyCouponToCart);

module.exports = router;
