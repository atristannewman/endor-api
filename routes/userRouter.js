const express = require("express");
const userRouter = express.Router();
const { userController } = require("../controllers");
const requestHandler = require("../requestHandler");

userRouter.get("/getProfile", requestHandler(userController.getProfile));

module.exports = userRouter;
