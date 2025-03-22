const Cart = require("../models/cartModel")
const Product = require("../models/productModel")

const createCart = async(userId,products)=>{
    let totalPrice = 0;

    for(let item of products){
        const product = await Product.findById(item.productId)
        if(!product){
            return{isProductnotFound:true,productId:item.productId}
        }
        totalPrice += product.price * item.quantity;

    }
    return await Cart.create({userId,products,totalPrice})
}



const updateCart = async (cartId, updateData) => {
    let totalPrice = 0;

    for (let item of updateData.products) {
        const product = await Product.findById(item.productId);
        if (!product) {
            return { isProductNotFound: true, productId: item.productId };
        }
        totalPrice += product.price * item.quantity;
    }

    updateData.totalPrice = totalPrice;

    return await Cart.findByIdAndUpdate(cartId, updateData, { new: true, runValidators: true });
};

/** Get all carts */
const getAllCarts = async () => {
    return await Cart.find().populate("userId").populate("products.productId");
};

/** Get cart by ID */
const getCartById = async (cartId) => {
    const cart = await Cart.findById(cartId).populate("userId").populate("products.productId");
    if (!cart) {
        return { isCartNotFound: true };
    }
    return cart;
};

/** Delete a cart */
const deleteCart = async (cartId) => {
    const cart = await Cart.findByIdAndDelete(cartId);
    if (!cart) {
        return { isCartNotFound: true };
    }
    return cart;
};
/** Add a product to cart */
const addProductToCart = async (cartId, productId, quantity) => {
    const cart = await Cart.findById(cartId);
    if (!cart) {
        return { isCartNotFound: true };
    }

    const product = await Product.findById(productId);
    if (!product) {
        return { isProductNotFound: true };
    }

    let productExists = false;

    cart.products = cart.products.map((item) => {
        if (item.productId.toString() === productId) {
            item.quantity += quantity;
            productExists = true;
        }
        return item;
    });

    if (!productExists) {
        cart.products.push({ productId, quantity });
    }

    cart.totalPrice += product.price * quantity;
    return await cart.save();
};

/** Remove a product from cart */
const removeProductFromCart = async (cartId, productId) => {
    const cart = await Cart.findById(cartId);
    if (!cart) {
        return { isCartNotFound: true };
    }

    const product = await Product.findById(productId);
    if (!product) {
        return { isProductNotFound: true };
    }

    const productToRemove = cart.products.find(item => item.productId.toString() === productId);
    if (!productToRemove) {
        return { isProductNotInCart: true };
    }

    cart.products = cart.products.filter((item) => item.productId.toString() !== productId);
    cart.totalPrice -= product.price * productToRemove.quantity;

    return await cart.save();
};



module.exports={
    createCart,
    updateCart,
    getAllCarts,
    getCartById,
    deleteCart,
    addProductToCart,
    removeProductFromCart
}