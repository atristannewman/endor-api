const express = require("express");
const userRouter = express.Router();
const { userController } = require("../controllers");
const requestHandler = require("../requestHandler");

userRouter.get("/", requestHandler(userController.getUsers));
userRouter.get("/getProfile", requestHandler(userController.getProfile));
userRouter.post("/", requestHandler(userController.createUser));

module.exports = userRouter;
