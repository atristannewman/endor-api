const express = require("express");
const notificationsRouter = express.Router();
const { notificationController } = require("../controllers");
const requestHandler = require("../requestHandler");

notificationsRouter.post("/",requestHandler(notificationController.sendNotification));

module.exports = notificationsRouter;
