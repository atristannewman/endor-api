const express = require("express");
const vendorRouter = express.Router();
const { vendorController } = require("../controllers");
const requestHandler = require("../requestHandler");

vendorRouter.get("/", requestHandler(vendorController.getVendors));
vendorRouter.post("/", requestHandler(vendorController.createVendor));
vendorRouter.put("/", requestHandler(vendorController.updateVendor));
vendorRouter.delete("/", requestHandler(vendorController.deleteVendor));

module.exports = vendorRouter;
