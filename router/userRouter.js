const express = require("express");
const userControllers= require("../controllers/userController");
const  authValidator = require("../validator/userValidator");

const router = express.Router();

router.post("/register", authValidator, userControllers.register);
router.post("/login",  authValidator, userControllers.login);

module.exports = router;