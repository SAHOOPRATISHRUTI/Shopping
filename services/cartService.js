const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
/** 🛒 Create Cart */
const createCart = async (userId, products) => {
    let totalPrice = 0;

    const productDetails = await Promise.all(products.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) return { isProductNotFound: true, productId: item.productId };
        totalPrice += product.price * item.quantity;
        return { productId: item.productId, quantity: item.quantity };
    }));

    if (productDetails.some(p => p.isProductNotFound)) {
        return productDetails.find(p => p.isProductNotFound);
    }

    totalPrice = parseFloat(totalPrice.toFixed(2));

    return await Cart.create({ userId, products: productDetails, totalPrice });
};

/** 🛍 Update Cart */
const updateCart = async (cartId, updateData) => {
    let totalPrice = 0;

    const productDetails = await Promise.all(updateData.products.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) return { isProductNotFound: true, productId: item.productId };
        totalPrice += product.price * item.quantity;
        return { productId: item.productId, quantity: item.quantity };
    }));

    if (productDetails.some(p => p.isProductNotFound)) {
        return productDetails.find(p => p.isProductNotFound);
    }

    updateData.totalPrice = parseFloat(totalPrice.toFixed(2));

    return await Cart.findByIdAndUpdate(cartId, updateData, { new: true, runValidators: true });
};

/** 📦 Get All Carts */
const getAllCarts = async () => {
    return await Cart.find().populate("userId").populate("products.productId");
};

/** 🔍 Get Cart by ID */
const getCartById = async (cartId) => {
    const cart = await Cart.findById(cartId).populate("userId").populate("products.productId");
    if (!cart) return { isCartNotFound: true };
    return cart;
};

/** 🗑 Delete Cart */
const deleteCart = async (cartId) => {
    const cart = await Cart.findByIdAndDelete(cartId);
    if (!cart) return { isCartNotFound: true };
    return cart;
};

/** ➕ Add Product to Cart */
const addProductToCart = async (cartId, productId, quantity) => {
    const cart = await Cart.findById(cartId);
    if (!cart) return { isCartNotFound: true };

    const product = await Product.findById(productId);
    if (!product) return { isProductNotFound: true };

    let productExists = cart.products.find(item => item.productId.toString() === productId);

    if (productExists) {
        productExists.quantity += quantity;
    } else {
        cart.products.push({ productId, quantity });
    }

    cart.totalPrice = cart.products.reduce((sum, item) => {
        const productPrice = item.productId.equals(product._id) ? product.price : item.productId.price;
        return sum + productPrice * item.quantity;
    }, 0);

    cart.totalPrice = parseFloat(cart.totalPrice.toFixed(2));

    return await cart.save();
};

/** ➖ Remove Product from Cart */
const removeProductFromCart = async (cartId, productId) => {
    const cart = await Cart.findById(cartId);
    if (!cart) return { isCartNotFound: true };

    const product = await Product.findById(productId);
    if (!product) return { isProductNotFound: true };

    const productToRemove = cart.products.find(item => item.productId.toString() === productId);
    if (!productToRemove) return { isProductNotInCart: true };

    cart.products = cart.products.filter(item => item.productId.toString() !== productId);

    cart.totalPrice = cart.products.reduce((sum, item) => {
        const productPrice = item.productId.equals(product._id) ? product.price : item.productId.price;
        return sum + productPrice * item.quantity;
    }, 0);

    cart.totalPrice = parseFloat(cart.totalPrice.toFixed(2));

    return await cart.save();
};
const applyCoupon = async (cartId, couponCode) => {
    const cart = await Cart.findById(cartId);
    if (!cart) return { isCartNotFound: true };

    if (!cart.totalPrice || cart.totalPrice <= 0) {
        return { isCartTotalInvalid: true };
    }

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) return { isCouponInvalid: true };

    console.log("🚀 Coupon Found:", coupon); 
    console.log("📌 Coupon Type (Stored):", coupon.discountType);
    console.log("📌 Coupon Value:", coupon.discount);
    
    if (new Date(coupon.expiresAt) < new Date()) {
        return { isCouponExpired: true };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
        return { isCouponLimitReached: true };
    }

    if (cart.totalPrice < coupon.minPurchase) {
        return { isMinimumPurchaseNotMet: true };
    }

    let discount = 0;
    const discountType = coupon.discountType.toUpperCase(); // Convert to uppercase

    if (discountType === "PERCENTAGE") {
        discount = (cart.totalPrice * coupon.discount) / 100;
    } else if (discountType === "FIXED") {
        discount = coupon.discount;
    }

    console.log("✅ Calculated Discount:", discount);
    
    if (discount <= 0) {
        return { isDiscountInvalid: true };
    }

    cart.totalPrice = Math.max(0, cart.totalPrice - discount); // Ensure price doesn’t go negative
    cart.coupon = {
        discountType: discountType, 
        discount: discount
    };

    console.log("🛒 Updated Cart Total:", cart.totalPrice);
    console.log("🎟️ Applied Coupon:", cart.coupon);

    await cart.save();

    // Update coupon usage
    coupon.usedCount += 1;
    await coupon.save();

    return { success: true, cart };
};




module.exports = {
    createCart,
    updateCart,
    getAllCarts,
    getCartById,
    deleteCart,
    addProductToCart,
    removeProductFromCart,
    applyCoupon
};
