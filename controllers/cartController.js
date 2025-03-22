const cartService = require("../services/cartService");
const Response = require("../helpers/response");
const messages = require("../contstants/constantMessage");

/** Create Cart */
const createCart = async (req, res) => {
    try {
        const { userId, products } = req.body;

        const result = await cartService.createCart(userId, products);

        if (result.isProductnotFound) {
            return Response.failResponse(req, res, null, messages.productNotFound, 404);
        }

        return Response.successResponse(req, res, result, messages.cartCreated, 201);
    } catch (error) {
        console.error("Create Cart Error:", error);
        return Response.errorResponse(req, res, error);
    }
};

/** Update Cart */
const updateCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const updateData = req.body;

        const result = await cartService.updateCart(cartId, updateData);

        if (result.isProductNotFound) {
            return Response.failResponse(req, res, null, messages.productNotFound, 404);
        }

        return Response.successResponse(req, res, result, messages.cartUpdated, 200);
    } catch (error) {
        console.error("Update Cart Error:", error);
        return Response.errorResponse(req, res, error);
    }
};

/** Get All Carts */
const getAllCarts = async (req, res) => {
    try {
        const result = await cartService.getAllCarts();
        return Response.successResponse(req, res, result, messages.cartFetched, 200);
    } catch (error) {
        console.error("Get All Carts Error:", error);
        return Response.errorResponse(req, res, error);
    }
};

/** Get Cart By ID */
const getCartById = async (req, res) => {
    try {
        const { cartId } = req.params;

        const result = await cartService.getCartById(cartId);

        if (result.isCartNotFound) {
            return Response.failResponse(req, res, null, messages.cartNotFound, 404);
        }

        return Response.successResponse(req, res, result, messages.cartFetched, 200);
    } catch (error) {
        console.error("Get Cart By ID Error:", error);
        return Response.errorResponse(req, res, error);
    }
};

/** Delete Cart */
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
/** Add Product to Cart */
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

/** Remove Product from Cart */
const removeProductFromCart = async (req, res) => {
    try {
        const { cartId, productId } = req.params;

        const result = await cartService.removeProductFromCart(cartId, productId);

        if (result.isCartNotFound) {
            return Response.failResponse(req, res, null, messages.cartNotFound, 404);
        }
        if (result.isProductNotFound) {
            return Response.failResponse(req, res, null, messages.productNotFound, 404);
        }
        if (result.isProductNotInCart) {
            return Response.failResponse(req, res, null, messages.productNotInCart, 400);
        }

        return Response.successResponse(req, res, result, messages.productRemovedFromCart, 200);
    } catch (error) {
        console.error("Remove Product from Cart Error:", error);
        return Response.errorResponse(req, res, error);
    }
};


module.exports = {
    createCart,
    updateCart,
    getAllCarts,
    getCartById,
    deleteCart,
    removeProductFromCart,
    addProductToCart
};
