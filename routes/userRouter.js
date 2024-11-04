const express = require("express");
const userRouter = express.Router();
const { userController } = require("../controllers");
const requestHandler = require("../requestHandler");

userRouter.get("/customer", requestHandler(userController.getCustomer));
userRouter.delete("/customer",requestHandler(userController.deleteCustomer));
userRouter.get("/all",requestHandler(userController.getAllUsers));
userRouter.get("/", requestHandler(userController.get));


userRouter.post("/create-customer", requestHandler(userController.createCustomer))
module.exports = userRouter;
