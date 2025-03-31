// const cartService = require("../services/cartService");
// const Response = require("../helpers/response");
// const messages = require("../contstants/constantMessage");

// /** Create Cart */
// const createCart = async (req, res) => {
//     try {
//         const { userId, products } = req.body;

//         const result = await cartService.createCart(userId, products);

//         if (result.isProductnotFound) {
//             return Response.failResponse(req, res, null, messages.productNotFound, 404);
//         }

//         return Response.successResponse(req, res, result, messages.cartCreated, 201);
//     } catch (error) {
//         console.error("Create Cart Error:", error);
//         return Response.errorResponse(req, res, error);
//     }
// };

// /** Update Cart */
// const updateCart = async (req, res) => {
//     try {
//         const { cartId } = req.params;
//         const updateData = req.body;

//         const result = await cartService.updateCart(cartId, updateData);

//         if (result.isCartNotFound) {
//             return Response.failResponse(req, res, null, messages.cartNotFound, 404);
//         }
//         if (result.isProductNotFound) {
//             return Response.failResponse(req, res, null, messages.productNotFound, 404);
//         }
//         if (result.isInvalidQuantity) {
//             return Response.failResponse(req, res, null, messages.invalidQuantity, 400);
//         }
//         if (result.isInsufficientStock) {
//             return Response.failResponse(req, res, null, messages.insufficientStock, 400);
//         }

//         return Response.successResponse(req, res, result, messages.cartUpdated, 200);
//     } catch (error) {
//         console.error("Update Cart Error:", error);
//         return Response.errorResponse(req, res, error);
//     }
// };

// /** Get All Carts */
// const getAllCarts = async (req, res) => {
//     try {
//         const result = await cartService.getAllCarts();
//         return Response.successResponse(req, res, result, messages.cartFetched, 200);
//     } catch (error) {
//         console.error("Get All Carts Error:", error);
//         return Response.errorResponse(req, res, error);
//     }
// };

// /** Get Cart By ID */
// const getCartById = async (req, res) => {
//     try {
//         const { cartId } = req.params;

//         const result = await cartService.getCartById(cartId);

//         if (result.isCartNotFound) {
//             return Response.failResponse(req, res, null, messages.cartNotFound, 404);
//         }

//         return Response.successResponse(req, res, result, messages.cartFetched, 200);
//     } catch (error) {
//         console.error("Get Cart By ID Error:", error);
//         return Response.errorResponse(req, res, error);
//     }
// };

// /** Delete Cart */
// const deleteCart = async (req, res) => {
//     try {
//         const { cartId } = req.params;

//         const result = await cartService.deleteCart(cartId);

//         if (result.isCartNotFound) {
//             return Response.failResponse(req, res, null, messages.cartNotFound, 404);
//         }

//         return Response.successResponse(req, res, result, messages.cartDeleted, 200);
//     } catch (error) {
//         console.error("Delete Cart Error:", error);
//         return Response.errorResponse(req, res, error);
//     }
// };
// /** Add Product to Cart */
// const addProductToCart = async (req, res) => {
//     try {
//         const { cartId } = req.params;
//         const { productId, quantity } = req.body;

//         const result = await cartService.addProductToCart(cartId, productId, quantity);

//         if (result.isCartNotFound) {
//             return Response.failResponse(req, res, null, messages.cartNotFound, 404);
//         }
//         if (result.isProductNotFound) {
//             return Response.failResponse(req, res, null, messages.productNotFound, 404);
//         }

//         return Response.successResponse(req, res, result, messages.productAddedToCart, 200);
//     } catch (error) {
//         console.error("Add Product to Cart Error:", error);
//         return Response.errorResponse(req, res, error);
//     }
// };

// /** Remove Product from Cart */
// const removeProductFromCart = async (req, res) => {
//     try {
//         const { cartId, productId } = req.params;

//         const result = await cartService.removeProductFromCart(cartId, productId);

//         if (result.isCartNotFound) {
//             return Response.failResponse(req, res, null, messages.cartNotFound, 404);
//         }
//         if (result.isProductNotFound) {
//             return Response.failResponse(req, res, null, messages.productNotFound, 404);
//         }
//         if (result.isProductNotInCart) {
//             return Response.failResponse(req, res, null, messages.productNotInCart, 400);
//         }

//         return Response.successResponse(req, res, result, messages.productRemovedFromCart, 200);
//     } catch (error) {
//         console.error("Remove Product from Cart Error:", error);
//         return Response.errorResponse(req, res, error);
//     }
// };

// const applyCouponToCart = async (req, res) => {
//     try {
//         const { cartId } = req.params;
//         console.log(cartId);
        
//         const { couponCode } = req.body;
//         console.log(couponCode);

//         const result = await cartService.applyCoupon(cartId, couponCode);

//         if (result.isCartNotFound) {
//             return Response.failResponse(req, res, null, messages.cartNotFound, 404);
//         }
//         if (result.isCouponInvalid) {
//             return Response.failResponse(req, res, null, messages.invalidCoupon, 400);
//         }

//         return Response.successResponse(req, res, result, messages.couponApplied, 200);
//     } catch (error) {
//         console.error("Apply Coupon Error:", error);
//         return Response.errorResponse(req, res, error);
//     }
// };


// module.exports = {
//     createCart,
//     updateCart,
//     getAllCarts,
//     getCartById,
//     deleteCart,
//     removeProductFromCart,
//     applyCouponToCart,
//     addProductToCart,
// };
const cartService = require("../services/cartService");
const Response = require("../helpers/response");
 const messages = require("../contstants/constantMessage");

/** 🛒 Create Cart */
const createCart = async (req, res) => {
    try {
        const { userId, products } = req.body;
        const result = await cartService.createCart(userId, products);

        // Handle different error cases
        if (result.userNotFound) {
            return Response.failResponse(req, res, null, "User not found", 404);
        }
        if (result.notActiveUser) {
            return Response.failResponse(req, res, null, "User is not active", 403);
        }
        if (result.errors) {
            return Response.failResponse(req, res, result.errors, "Cart creation failed due to product issues", 400);
        }

        return Response.successResponse(req, res, result, "Cart created successfully", 201);
    } catch (error) {
        console.error("Create Cart Error:", error);
        return Response.errorResponse(req, res, error);
    }
};


/** 🛍 Update Cart */
const updateCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const updateData = req.body;

        const result = await cartService.updateCart(cartId, updateData);

        // Handle different error cases
        if (result.cartNotFound) {
            return Response.failResponse(req, res, null, messages.cartNotFound, 404);
        }
        if (result.userNotFound) {
            return Response.failResponse(req, res, null, messages.userNotFound, 404);
        }
        if (result.notActiveUser) {
            return Response.failResponse(req, res, null, messages.userNotActive, 403);
        }
        if (result.errors) {
            return Response.failResponse(req, res, result.errors, "Cart update failed due to product issues", 400);
        }

        return Response.successResponse(req, res, result, messages.cartUpdated, 200);
    } catch (error) {
        console.error("Update Cart Error:", error);
        return Response.errorResponse(req, res, error);
    }
};


/** 📦 Get All Carts */
const getAllCarts = async (req, res) => {
    try {
        const result = await cartService.getAllCarts();
        return Response.successResponse(req, res, result, messages.cartFetched, 200);
    } catch (error) {
        console.error("Get All Carts Error:", error);
        return Response.errorResponse(req, res, error);
    }
};

/** 🔍 Get Cart By ID */
const getCartById = async (req, res) => {
    try {
        const { cartId } = req.params;

        const result = await cartService.getCartById(cartId);

        if (result.cartNotFound) {
            return Response.failResponse(req, res, null, messages.cartNotFound, 404);
        }

        return Response.successResponse(req, res, result, messages.cartFetched, 200);
    } catch (error) {
        console.error("Get Cart By ID Error:", error);
        return Response.errorResponse(req, res, error);
    }
};



/** 🗑 Delete Cart */
const deleteCart = async (req, res) => {
    try {
        const { cartId } = req.params;

        const result = await cartService.deleteCart(cartId);

        if (result.isCartNotFound) {
            return Response.failResponse(req, res, null, messages.cartNotFound, 404);
        }

        return Response.successResponse(req, res, result, messages.cartDeleted, 200);
    } catch (error) {
        console.error("Delete Cart Error:", error);
        return Response.errorResponse(req, res, error);
    }
};

/** ➕ Add Product to Cart */
const addProductToCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { productId, quantity } = req.body;

        const result = await cartService.addProductToCart(cartId, productId, quantity);

        if (result.isCartNotFound) {
            return Response.failResponse(req, res, null, messages.cartNotFound, 404);
        }
        if (result.isProductNotFound) {
            return Response.failResponse(req, res, null, messages.productNotFound, 404);
        }

        return Response.successResponse(req, res, result, messages.productAddedToCart, 200);
    } catch (error) {
        console.error("Add Product to Cart Error:", error);
        return Response.errorResponse(req, res, error);
    }
};

/** ➖ Remove Product from Cart */
const removeProductFromCart = async (req, res) => {
    try {
        const { cartId, productId } = req.params;

        const result = await cartService.removeProductFromCart(cartId, productId);

        if (result.cartNotFound) {
            return Response.failResponse(req, res, null, messages.cartNotFound, 404);
        }
        if (result.productNotInCart) {
            return Response.failResponse(req, res, null, messages.productNotInCart, 400);
        }

        return Response.successResponse(req, res, result, messages.productRemoved, 200);
    } catch (error) {
        console.error("Remove Product Error:", error);
        return Response.errorResponse(req, res, error);
    }
};


/** 🎟 Apply Coupon to Cart */
const applyCouponToCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const { couponCode } = req.body;

        const result = await cartService.applyCoupon(cartId, couponCode);

        if (!result.success) {
            return Response.failResponse(req, res, null, result.message, result.status || 400);
        }

        return Response.successResponse(req, res, result, messages.couponApplied, 200);
    } catch (error) {
        console.error("❌ Apply Coupon Error:", error);
        return Response.errorResponse(req, res, error);
    }
};



module.exports = {
    createCart,
    updateCart,
    getAllCarts,
    getCartById,
    deleteCart,
    addProductToCart,
    removeProductFromCart,
    applyCouponToCart,
};
