const express = require("express");
const userControllers= require("../controllers/userController");
const  authValidator = require("../validator/userValidator");
const verifyToken = require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/register" ,authValidator.userRegisterValidator, userControllers.register);
router.post("/login", authValidator.loginValidatorSchema, userControllers.login);

module.exports = router;