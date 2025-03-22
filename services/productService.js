const Product = require("../models/productModel")


const createProduct = async(productData)=>{
    const {name,price,description,category,stock,image} = productData
    return await Product.create({name,price,description,category,stock,image})
} 

const updateProduct = async (productId, updateData) => {
    return await Product.findByIdAndUpdate({ _id: productId }, updateData, { new: true, runValidators: true });
};

const getAllProduct = async()=>{
    return await Product.find()
}

const getProductById = async(productId)=>{
    return await Product.findById(productId)
}

const deleteProduct = async(productId)=>{
    return await Product.findByIdAndDelete(productId)
}

module.exports = {
    createProduct,
    updateProduct,
    getProductById,
    getAllProduct,
    deleteProduct
}