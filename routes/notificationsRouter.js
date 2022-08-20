const express = require("express");
const notificationsRouter = express.Router();
const { notificationController } = require("../controllers");
const requestHandler = require("../requestHandler");

notificationsRouter.post("/",requestHandler(notificationController.sendNotification));

notificationsRouter.post("/test",requestHandler(notificationController.testHangout));

module.exports = notificationsRouter;
