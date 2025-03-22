const express = require("express");
const app = express();
const userRouter = require("./userRouter")
const productRouter = require("./productRouter")
app.use("/user",userRouter)
app.use("/product",productRouter)
module.exports = app