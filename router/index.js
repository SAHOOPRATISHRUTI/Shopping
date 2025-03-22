const express = require("express");
const app = express();
const userRouter = require("./userRouter")
const cartRouter = require("./cartrouter")
const productRouter = require("./productRouter")
app.use("/user",userRouter)
app.use("/product",productRouter)
app.use("/cart",cartRouter)
module.exports = app