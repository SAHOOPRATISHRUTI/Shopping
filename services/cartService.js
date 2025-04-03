
const Cart = require("../models/cartModel");
const Product = require("../models/SubscriptionMaster");
const Coupon = require("../models/couponModel");
const User = require("../models/userModel")
/** 🛒 Create Cart */
const createCart = async (userId, products, couponCode = null) => {
    const user = await User.findById(userId);
    if (!user) return { userNotFound: true };
    if (!user.isActive) return { notActiveUser: true };

    let totalPrice = 0;
    let discountPrice = 0;
    let finalPrice = 0;
    const productDetails = [];
    const insufficientStockProducts = [];

    let cart = await Cart.findOne({ userId });

    // Fetch all requested products
    const productList = await Promise.all(
        products.map(item => Product.findById(item.productId))
    );

    // Validate products and calculate total price
    for (let i = 0; i < products.length; i++) {
        const item = products[i];
        const product = productList[i];

        if (!product) {
            insufficientStockProducts.push({ error: "Product not found", productId: item.productId });
            continue;
        }
        if (item.quantity > product.stock) {
            insufficientStockProducts.push({ error: "Insufficient stock", productId: item.productId });
            continue;
        }

        totalPrice += product.price * item.quantity;
        productDetails.push({ productId: item.productId, quantity: item.quantity });
    }

    if (insufficientStockProducts.length > 0) {
        return { errors: insufficientStockProducts };
    }

    // Apply coupon discount if provided
    let coupon = null;
    if (couponCode) {
        coupon = await Coupon.findOne({ code: couponCode });
        if (coupon) {
            discountPrice = coupon.discountType === "FIXED"
                ? coupon.discount
                : (totalPrice * coupon.discount) / 100;
        }
    }

    finalPrice = totalPrice - discountPrice;
    if (finalPrice < 0) finalPrice = 0;

    if (cart) {
        productDetails.forEach(newItem => {
            const existingItem = cart.products.find(item => item.productId.toString() === newItem.productId.toString());

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                cart.products.push(newItem);
            }
        });

        // ✅ Fetch product prices dynamically when recalculating totalPrice
        const updatedProductList = await Promise.all(
            cart.products.map(item => Product.findById(item.productId))
        );

        cart.totalPrice = cart.products.reduce((sum, item, index) => {
            const product = updatedProductList[index];
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);

        cart.discountPrice = discountPrice;
        cart.finalPrice = cart.totalPrice - cart.discountPrice;
        cart.updatedAt = new Date();
        await cart.save();
        return { success: true, cart };
    }

    // Create a new cart if it doesn't exist
    cart = await Cart.create({
        userId,
        products: productDetails,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        discountPrice,
        finalPrice: parseFloat(finalPrice.toFixed(2)),
        coupon
    });

    return { success: true, cart };
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

    // Check if product already exists in cart
    let productExists = cart.products.find(item => item.productId.toString() === productId);

    if (productExists) {
        productExists.quantity += quantity; // Update quantity
    } else {
        cart.products.push({ productId, quantity }); // Add new product
    }

    // 🔄 **Recalculate total price based on all cart items**
    const updatedProductList = await Promise.all(
        cart.products.map(item => Product.findById(item.productId))
    );

    cart.totalPrice = cart.products.reduce((sum, item, index) => {
        const product = updatedProductList[index];
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    cart.totalPrice = parseFloat(cart.totalPrice.toFixed(2)); // Ensure 2 decimal places

    await cart.save();
    return cart;
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
    const carts = await Cart.find()
        .populate("userId")
        .populate("products.productId");

    // ✅ Ensure total price is calculated correctly
    carts.forEach(cart => {
        let calculatedTotal = 0;
        cart.products.forEach(item => {
            if (item.productId) {
                calculatedTotal += item.productId.price * item.quantity;
            }
        });
        cart.totalPrice = calculatedTotal; // ✅ Ensure correct total
    });

    return carts;
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
