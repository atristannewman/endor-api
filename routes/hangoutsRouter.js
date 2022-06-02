const express = require("express");
const hangoutsRouter = express.Router();
const { hangoutController } = require("../controllers");
const requestHandler = require("../requestHandler");

hangoutsRouter.get("/", requestHandler(hangoutController.getHangouts));
hangoutsRouter.post("/", requestHandler(hangoutController.createHangout));
hangoutsRouter.put("/", requestHandler(hangoutController.updateHangout));
hangoutsRouter.delete("/", requestHandler(hangoutController.deleteHangout));

module.exports = hangoutsRouter;
