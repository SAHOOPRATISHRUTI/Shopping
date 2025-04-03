const express = require("express");
const app = express();
const userRouter = require("./userRouter")
const cartRouter = require("./cartrouter")
const subRouter = require("./subRouter")
const couponRouter = require("./couponRoutes")
const manageSubscriptionRouter = require("./manageSubscriptionRouter")
const client = require("./clientRouter")

app.use("/user",userRouter)
app.use("/subscription",subRouter)
app.use("/cart",cartRouter)
app.use("/coupon",couponRouter)
app.use("/manageSubscription",manageSubscriptionRouter)
app.use("/client",client)
module.exports = app