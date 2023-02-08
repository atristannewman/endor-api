const express = require("express");
const notificationsRouter = express.Router();
const { notificationController } = require("../controllers");
const requestHandler = require("../requestHandler");

notificationsRouter.post("/hangout",requestHandler(notificationController.sendHangoutPromptNotification));
notificationsRouter.post("/queues",requestHandler(notificationController.createNotificationQueue));
notificationsRouter.post("/queues/notify", requestHandler(notificationController.notifyNotificationSubscribers));
notificationsRouter.get("/queues", requestHandler(notificationController.getNotificationQueues));
notificationsRouter.put("/queues", requestHandler(notificationController.addNotificationSubscriber));
notificationsRouter.delete("/queues", requestHandler(notificationController.removeNotificationSubscriber));


module.exports = notificationsRouter;
