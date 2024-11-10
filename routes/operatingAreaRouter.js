const express = require("express");
const operatingAreaRouter = express.Router();
const { operatingAreaController } = require("../controllers");
const requestHandler = require("../requestHandler");

operatingAreaRouter.get("/", requestHandler(operatingAreaController.getOperatingArea));

module.exports = operatingAreaRouter;
