const userService = require("../services/userService")

const Response = require("../helpers/response")
const messages = require("../contstants/constantMessage")


const register = async(req,res)=>{
    try{
        const result = await userService.registerUser(req.body);

        if (result.isDuplicateEmail) {
          return Response.failResponse(req, res, null, messages.duplicateEmail, 500);
        }
    
       
     
        return Response.successResponse(req,res,result,messages.registered,200)

    }catch(error){
        console.error(error);
        return Response.errorResponse(req,res,error)
    }
}
const login = async (req, res) => {
    try {
      
  
      const result = await userService.loginUser(req.body.email, req.body.password);
      
      if (result.isInvalidCredential) {
        return Response.failResponse(req, res, null, messages.InvalidLogin, 500);
      }
  
      return Response.successResponse(req, res, result, messages.loginSuccess, 200);
    } catch (error) {
      console.error("Login Error:", error);
     
      return Response.errorResponse(req, res, error);
    }
  };
 
module.exports={
    register,login
}