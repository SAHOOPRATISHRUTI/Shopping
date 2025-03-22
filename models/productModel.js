const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        trim:true,

    },
    category:{
        type:String,
        required:true

    },
    stock:{
        type:Number,
        default:0

    },
    image:{
        type:String
    }
},{timestamps:true})
module.exports = mongoose.model("Product",productSchema) 