const express = require("express");
const authenticationRouter = express.Router();
const { authenticationController } = require("../controllers");
const requestHandler = require("../requestHandler");

authenticationRouter.post("/",requestHandler(authenticationController.createTokenproofAddress));

module.exports = authenticationRouter;
