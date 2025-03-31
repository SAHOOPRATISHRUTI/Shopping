// const Cart = require("../models/cartModel");
// const Product = require("../models/productModel");
// const Coupon = require("../models/couponModel");
// /** 🛒 Create Cart */
// const createCart = async (userId, products) => {
//     let totalPrice = 0;

//     const productDetails = await Promise.all(products.map(async (item) => {
//         const product = await Product.findById(item.productId);
//         if (!product) return { isProductNotFound: true, productId: item.productId };
//         totalPrice += product.price * item.quantity;
//         return { productId: item.productId, quantity: item.quantity };
//     }));

//     if (productDetails.some(p => p.isProductNotFound)) {
//         return productDetails.find(p => p.isProductNotFound);
//     }

//     totalPrice = parseFloat(totalPrice.toFixed(2));

//     return await Cart.create({ userId, products: productDetails, totalPrice });
// };

// /** 🛍 Update Cart */
// const updateCart = async (cartId, updateData) => {
//     // Check if cart exists
//     const cart = await Cart.findById(cartId);
//     if (!cart) {
//         return { isCartNotFound: true };
//     }

//     let totalPrice = 0;
//     const productDetails = [];

//     for (const item of updateData.products) {
//         // Validate quantity
//         if (!item.quantity || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
//             return { isInvalidQuantity: true, productId: item.productId };
//         }

//         // Fetch product details
//         const product = await Product.findById(item.productId);
//         if (!product) {
//             return { isProductNotFound: true, productId: item.productId };
//         }

//         // Check stock availability
//         if (item.quantity > product.stock) {
//             return { isInsufficientStock: true, productId: item.productId };
//         }

//         totalPrice += product.price * item.quantity;
//         productDetails.push({ productId: item.productId, quantity: item.quantity });
//     }

//     updateData.totalPrice = parseFloat(totalPrice.toFixed(2));
//     updateData.products = productDetails;

//     return await Cart.findByIdAndUpdate(cartId, updateData, { new: true, runValidators: true });
// };

// module.exports = { updateCart };


// /** 📦 Get All Carts */
// const getAllCarts = async () => {
//     return await Cart.find().populate("userId").populate("products.productId");
// };

// /** 🔍 Get Cart by ID */
// const getCartById = async (cartId) => {
//     const cart = await Cart.findById(cartId).populate("userId").populate("products.productId");
//     if (!cart) return { isCartNotFound: true };
//     return cart;
// };

// /** 🗑 Delete Cart */
// const deleteCart = async (cartId) => {
//     const cart = await Cart.findByIdAndDelete(cartId);
//     if (!cart) return { isCartNotFound: true };
//     return cart;
// };

// /** ➕ Add Product to Cart */
// const addProductToCart = async (cartId, productId, quantity) => {
//     const cart = await Cart.findById(cartId);
//     if (!cart) return { isCartNotFound: true };

//     const product = await Product.findById(productId);
//     if (!product) return { isProductNotFound: true };

//     let productExists = cart.products.find(item => item.productId.toString() === productId);

//     if (productExists) {
//         productExists.quantity += quantity;
//     } else {
//         cart.products.push({ productId, quantity });
//     }

//     cart.totalPrice = cart.products.reduce((sum, item) => {
//         const productPrice = item.productId.equals(product._id) ? product.price : item.productId.price;
//         return sum + productPrice * item.quantity;
//     }, 0);

//     cart.totalPrice = parseFloat(cart.totalPrice.toFixed(2));

//     return await cart.save();
// };

// /** ➖ Remove Product from Cart */
// const removeProductFromCart = async (cartId, productId) => {
//     const cart = await Cart.findById(cartId);
//     if (!cart) return { isCartNotFound: true };

//     const product = await Product.findById(productId);
//     if (!product) return { isProductNotFound: true };

//     const productToRemove = cart.products.find(item => item.productId.toString() === productId);
//     if (!productToRemove) return { isProductNotInCart: true };

//     cart.products = cart.products.filter(item => item.productId.toString() !== productId);

//     cart.totalPrice = cart.products.reduce((sum, item) => {
//         const productPrice = item.productId.equals(product._id) ? product.price : item.productId.price;
//         return sum + productPrice * item.quantity;
//     }, 0);

//     cart.totalPrice = parseFloat(cart.totalPrice.toFixed(2));

//     return await cart.save();
// };
// const applyCoupon = async (cartId, couponCode) => { 
//     const cart = await Cart.findById(cartId);
//     if (!cart) return { isCartNotFound: true };

//     if (!cart.totalPrice || cart.totalPrice <= 0) {
//         return { isCartTotalInvalid: true };
//     }

//     const coupon = await Coupon.findOne({ code: couponCode });
//     if (!coupon) return { isCouponInvalid: true };

//     console.log("🚀 Coupon Found:", coupon); 
//     console.log("📌 Coupon Type (Stored):", coupon.discountType);
//     console.log("📌 Coupon Value:", coupon.discount);
    
//     if (new Date(coupon.expiresAt) < new Date()) {
//         return { isCouponExpired: true };
//     }

//     if (coupon.usedCount >= coupon.usageLimit) {
//         return { isCouponLimitReached: true };
//     }

//     if (cart.totalPrice < coupon.minPurchase) {
//         return { isMinimumPurchaseNotMet: true };
//     }

//     let discount = 0;
//     const discountType = coupon.discountType.toUpperCase(); // Convert to uppercase

//     if (discountType === "PERCENTAGE") {
//         discount = (cart.totalPrice * coupon.discount) / 100;
//     } else if (discountType === "FIXED") {
//         discount = coupon.discount;
//     }

//     console.log("✅ Calculated Discount:", discount);
    
//     if (discount <= 0) {
//         return { isDiscountInvalid: true };
//     }

//     cart.totalPrice = Math.max(0, cart.totalPrice - discount); // Ensure price doesn’t go negative
//     cart.coupon = {
//         discountType: discountType, 
//         discount: discount
//     };

//     console.log("🛒 Updated Cart Total:", cart.totalPrice);
//     console.log("🎟️ Applied Coupon:", cart.coupon);

//     await cart.save();

//     // Update coupon usage
//     coupon.usedCount += 1;
//     await coupon.save();

//     return { success: true, cart };
// };




// module.exports = {
//     createCart,
//     updateCart,
//     getAllCarts,
//     getCartById,
//     deleteCart,
//     addProductToCart,
//     removeProductFromCart,
//     applyCoupon
// };
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const User = require("../models/userModel")
/** 🛒 Create Cart */
const createCart = async (userId, products) => {
    // Check if user exists and is active
    const user = await User.findById(userId);
    if (!user) return { userNotFound: true };
    if (!user.isActive) return { notActiveUser: true };

    let totalPrice = 0;
    const productDetails = [];
    const insufficientStockProducts = [];

    // Fetch all products concurrently
    const productList = await Promise.all(
        products.map(item => Product.findById(item.productId))
    );

    // Validate products
    products.forEach((item, index) => {
        const product = productList[index];
        if (!product) {
            insufficientStockProducts.push({ error: "Product not found", productId: item.productId });
            return;
        }
        if (item.quantity > product.stock) {
            insufficientStockProducts.push({ error: "Insufficient stock", productId: item.productId });
            return;
        }

        totalPrice += product.price * item.quantity;
        productDetails.push({ productId: item.productId, quantity: item.quantity });
    });

    // If there are any product errors, return them
    if (insufficientStockProducts.length > 0) {
        return { errors: insufficientStockProducts };
    }

    // Round total price
    totalPrice = parseFloat(totalPrice.toFixed(2));

    // Create cart
    return await Cart.create({ userId, products: productDetails, totalPrice });
};


/** 🛍 Update Cart */
const updateCart = async (cartId, updateData) => {
    // Check if the cart exists
    const cart = await Cart.findById(cartId);
    if (!cart) return { cartNotFound: true };

    // Check if the user is active
    const user = await User.findById(cart.userId);
    if (!user) return { userNotFound: true };
    if (!user.isActive) return { notActiveUser: true };

    let totalPrice = 0;
    const updatedProducts = [];
    const productErrors = [];

    // Fetch all products concurrently
    const productList = await Promise.all(
        updateData.products.map(item => Product.findById(item.productId))
    );

    // Validate products
    updateData.products.forEach((item, index) => {
        const product = productList[index];

        if (!product) {
            productErrors.push({ error: "Product not found", productId: item.productId });
            return;
        }
        if (!item.quantity || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
            productErrors.push({ error: "Invalid quantity", productId: item.productId });
            return;
        }
        if (item.quantity > product.stock) {
            productErrors.push({ error: "Insufficient stock", productId: item.productId });
            return;
        }

        totalPrice += product.price * item.quantity;
        updatedProducts.push({ productId: item.productId, quantity: item.quantity });
    });

    // If there are product errors, return them
    if (productErrors.length > 0) {
        return { errors: productErrors };
    }

    // Update cart details
    updateData.totalPrice = parseFloat(totalPrice.toFixed(2));
    updateData.products = updatedProducts;

    return await Cart.findByIdAndUpdate(cartId, updateData, { new: true, runValidators: true });
};


/** ➕ Add Product to Cart */
const addProductToCart = async (cartId, productId, quantity) => {
    const cart = await Cart.findById(cartId);
    if (!cart) return { error: "Cart not found" };

    const product = await Product.findById(productId);
    if (!product) return { error: "Product not found" };

    if (quantity > product.stock) {
        return { error: "Insufficient stock", productId };
    }

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
    const cart = await Cart.findById(cartId).populate("products.productId"); // Populate product details
    
    if (!cart) return { cartNotFound: true };

    const productToRemove = cart.products.find(item => item.productId._id.toString() === productId);
    if (!productToRemove) return { productNotInCart: true };

    // Remove product from cart
    cart.products = cart.products.filter(item => item.productId._id.toString() !== productId);

    // Update total price
    cart.totalPrice = cart.products.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
    cart.totalPrice = parseFloat(cart.totalPrice.toFixed(2));

    await cart.save();
    return cart;
};

// ✅ Helper function to calculate the total discount already applied



/** 🎟 Apply Coupon */
const applyCoupon = async (cartId, couponCode) => {
    const cart = await Cart.findById(cartId);
    if (!cart) return { error: "Cart not found" };

    if (!cart.totalPrice || cart.totalPrice <= 0) {
        return { error: "Invalid cart total" };
    }

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) return { error: "Invalid coupon code" };

    if (new Date(coupon.expiresAt) < new Date()) {
        return { error: "Coupon expired" };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
        return { error: "Coupon usage limit reached" };
    }

    if (cart.totalPrice < coupon.minPurchase) {
        return { error: `Minimum purchase of ₹${coupon.minPurchase} required` };
    }

    let discount = 0;
    if (coupon.discountType.toUpperCase() === "PERCENTAGE") {
        discount = (cart.totalPrice * coupon.discount) / 100;
    } else if (coupon.discountType.toUpperCase() === "FIXED") {
        discount = coupon.discount;
    }

    if (discount <= 0) {
        return { error: "Invalid discount" };
    }

    // ✅ Ensure discount does not exceed the total price
    discount = Math.min(discount, cart.totalPrice);

    // ✅ Store discount separately instead of modifying totalPrice
    cart.discountPrice = discount;
    cart.coupon = { code: couponCode, discountType: coupon.discountType, discount };

    await cart.save();

    // ✅ Update coupon usage count
    await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });

    return { 
        success: true, 
        cart: { 
            ...cart.toObject(), 
            finalPrice: cart.totalPrice - cart.discountPrice
        } 
    };
};





/** 📦 Get All Carts */
const getAllCarts = async () => {
    return await Cart.find().populate("userId").populate("products.productId");
};

/** 🔍 Get Cart by ID */
const getCartById = async (cartId) => {
    const cart = await Cart.findById(cartId)
        .populate("userId")
        .populate("products.productId");

    if (!cart) return { cartNotFound: true };

    // Check if user exists and is active
    if (!cart.userId) return { userNotFound: true };
    if (!cart.userId.isActive) return { notActiveUser: true };

    return cart;
};


/** 🗑 Delete Cart */
const deleteCart = async (cartId) => {
    const cart = await Cart.findByIdAndDelete(cartId);
    if (!cart) return { error: "Cart not found" };
    return cart;
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
