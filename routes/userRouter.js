const express = require("express");
const userRouter = express.Router();
const { userController } = require("../controllers");
const requestHandler = require("../requestHandler");

userRouter.get("/getProfile", requestHandler(userController.getProfile));
userRouter.post("/",requestHandler(userController.createUser));
userRouter.put("/",requestHandler(userController.updateUser));
userRouter.delete("/",requestHandler(userController.deleteUser));
userRouter.get("/",requestHandler(userController.getUser));
userRouter.get("/all",requestHandler(userController.getAllUsers));

userRouter.put("/update-notification-prefs", requestHandler(userController.updateUserPreferences))

userRouter.post("/create-customer", requestHandler(userController.createCustomer))
module.exports = userRouter;
