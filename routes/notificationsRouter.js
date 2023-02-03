const express = require("express");
const notificationsRouter = express.Router();
const { notificationController } = require("../controllers");
const requestHandler = require("../requestHandler");

notificationsRouter.post("/hangout",requestHandler(notificationController.sendHangoutPromptNotification));
notificationsRouter.post("/queues",requestHandler(notificationController.createNotificationQueue));
notificationsRouter.get("/queues", requestHandler(notificationController.getNotificationQueues));

module.exports = notificationsRouter;
