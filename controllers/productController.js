const Product = require("../services/productService")

const Response = require("../helpers/response")
const  messages= require("../contstants/constantMessage")


const createProduct = async(req,res)=>{
    try{
        const result = await Product.createProduct(req.body);

        return Response.successResponse(req,res,result,messages.productCreated,201)

    }catch(error){
        console.log(error);
        Response.errorResponse(req,res,error)
        
    }
}


const getProductByid = async(req,res)=>{
    console.log(req.params);
    
    try{
        const result = await Product.getProductById(req.params.id)
        if(!result){
            return Response.failResponse(req,res,null,messages.productNotFound,500)

        }
        return Response.successResponse(req,res,result,messages.productFetched,200)
        
    }catch(error){
        console.log(error);
        return Response.errorResponse(req,res,error)
        
    }
}

const getAllProduct = async(req,res)=>{
    try{
        const result = await Product.getAllProduct()
        return Response.successResponse(req,res,result,messages.allProductsFetched,200)

    }catch(error){
        console.log(error);
        return Response.errorResponse(req,res,error)
    }
}
const updateProduct = async(req,res)=>{
    console.log("ffffffffffff",req.params);
    try{
        const result= await Product.updateProduct(req.params.id, req.body);

        if(!result){
            return Response.failResponse(req,res,null,messages.productCreated,200)
        }
        return Response.successResponse(req,res,result,messages.updateSuccess,200)
    }catch(error){
        console.log(error);
        return Response.errorResponse(req,res,error)
    }
}

const deleteProduct=async(req,res)=>{
    try{
      const result = await Product.deleteProduct(req.params.id)
      if(!result){
        return Response.failResponse(req,res,null,messages.productNotFound,200)
      }
      return Response.successResponse(req,res,result,messages.deleted,200)
    }
    catch(error){
        console.log(error);
        return Response.errorResponse(req,res,error)
    }
}








module.exports={
    createProduct,
    getProductByid,
    getAllProduct,
    updateProduct,
    deleteProduct
}