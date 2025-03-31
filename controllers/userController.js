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
        console.log("Login attempt for:", req.body.email); // ✅ Only logs email, not password

        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: true, message: "Email and password are required" });
        }

        const result = await userService.loginUser(req.body.email, req.body.password);

        if (result.isInvalidCredential) {
            return Response.failResponse(req, res, null, messages.InvalidLogin, 401); // 🔹 Change 500 → 401 Unauthorized
        }

        return Response.successResponse(req, res, result, messages.loginSuccess, 200);
    } catch (error) {
        console.error("Login Error:", error);
        return Response.errorResponse(req, res, error);
    }
};
// const login = async (req, res) => {
//     try {
//         console.log("Login attempt for:", req.body.email); // ✅ Only logs email, not password

//         if (!req.body.email || !req.body.password) {
//             return res.status(400).json({ error: true, message: "Email and password are required" });
//         }

//         const result = await userService.loginUser(req.body.email, req.body.password);

//         if (result.isEmailNotRegistered) {
//             return Response.failResponse(req, res, null, messages.emailNotRegistered, 404); // 🔹 404 for unregistered email
//         }

//         if (result.isInvalidCredential) {
//             return Response.failResponse(req, res, null, messages.InvalidLogin, 401); // 🔹 401 for incorrect password
//         }

//         return Response.successResponse(req, res, result, messages.loginSuccess, 200);
//     } catch (error) {
//         console.error("Login Error:", error);
//         return Response.errorResponse(req, res, error);
//     }
// };



 
module.exports={
    register,login
}