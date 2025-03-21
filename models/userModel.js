const mongoose = require("mongoose");
const validator = require("validator")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    email: {
        type: String,
        validate: {
            validator: validator.isEmail,
            message: "{VALUE} is not a valid email"
        },
        default: null,
        required:true,
        index:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"

    },
    isActive: {
        type: Boolean,
        required: true,
        index: true,
        default: true,
      },
    
});

module.exports = mongoose.model("User",userSchema)