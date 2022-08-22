const express = require("express");
const notificationsRouter = express.Router();
const { notificationController } = require("../controllers");
const requestHandler = require("../requestHandler");

notificationsRouter.post("/hangout",requestHandler(notificationController.sendHangoutNotification));

module.exports = notificationsRouter;
