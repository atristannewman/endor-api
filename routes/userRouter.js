const express = require("express");
const userRouter = express.Router();
const { userController } = require("../controllers");
const requestHandler = require("../requestHandler");

userRouter.get("/getProfile", requestHandler(userController.getProfile));
userRouter.get("/getUsers", requestHandler(userController.getUsers));
userRouter.post("/createUser", requestHandler(userController.createUser));

module.exports = userRouter;
