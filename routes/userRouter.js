const express = require("express");
const userRouter = express.Router();
const { userController } = require("../controllers");
const requestHandler = require("../requestHandler");

userRouter.get("/getProfile", requestHandler(userController.getProfile));
userRouter.post("/createUser",requestHandler(userController.createUser));
userRouter.post("/updateUser",requestHandler(userController.updateUser));
userRouter.post("/deleteUser",requestHandler(userController.deleteUser));
userRouter.get("/getUser",requestHandler(userController.getUser));

module.exports = userRouter;
