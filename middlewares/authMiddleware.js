const jwt = require("jsonwebtoken");
const Response = require("../helpers/response");
const messages = require("../contstants/constantMessage");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    

    if (!token) {
        return Response.failResponse(req, res, null, messages.tokenRequired, 401);
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; // Add decoded user data to request
        next();
    } catch (error) {
        return Response.failResponse(req, res, null, messages.invalidToken, 403);
    }
};

module.exports = verifyToken;
