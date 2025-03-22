const express = require("express");
const app = express();
const userRouter = require("./userRouter")
const cartRouter = require("./cartrouter")
const productRouter = require("./productRouter")
const couponRouter = require("./couponRoutes")


app.use("/user",userRouter)
app.use("/product",productRouter)
app.use("/cart",cartRouter)
app.use("/coupon",couponRouter)
module.exports = app