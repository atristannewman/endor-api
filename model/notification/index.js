const { validate } = require("../../validation/notification");
const makeNotification = require("../notification/notification");

module.exports = makeNotification({ validate });
