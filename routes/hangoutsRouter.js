const express = require("express");
const hangoutsRouter = express.Router();
const { hangoutController } = require("../controllers");
const requestHandler = require("../requestHandler");

hangoutsRouter.get("/", requestHandler(hangoutController.createHangout));
// hangoutsRouter.post("/", requestHandler(hangoutsController.createHangouts));
// hangoutsRouter.put("/", requestHandler(hangoutsController.updateHangouts));
// hangoutsRouter.delete("/", requestHandler(hangoutsController.deleteHangouts));

module.exports = hangoutsRouter;
