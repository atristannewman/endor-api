const User = require("./entity/user");
const Vendor = require("./entity/vendor");
const Hangout = require("./entity/hangout");
const TokenproofAddress = require("./entity/tokenproofAddress");
const Notification = require("./entity/notification");
const MagicLink = require("./entity/magicLink");
const ApiKey = require("../../models/apiKey");

module.exports = Object.freeze({
  mockDB: {},
  DB: {
    User,
    Vendor,
    Hangout,
    TokenproofAddress,
    Notification,
    MagicLink,
    ApiKey
  },
});
