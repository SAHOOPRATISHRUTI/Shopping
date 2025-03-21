const express = require("express");
const app = express();
const userRouter = require("./userRouter")

app.use("/user",userRouter)
module.exports = app