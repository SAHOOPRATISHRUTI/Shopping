const express = require("express");
const app = express();
const userRouter = require("./userRouter")
const cartRouter = require("./cartrouter")
const productRouter = require("./productRouter")
const couponRouter = require("./couponRoutes")
const manageSubscriptionRouter = require("./manageSubscriptionRouter")

app.use("/user",userRouter)
app.use("/product",productRouter)
app.use("/cart",cartRouter)
app.use("/coupon",couponRouter)
app.use("/manageSubscription",manageSubscriptionRouter)
module.exports = app