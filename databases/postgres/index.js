const User = require("./entity/user");
const Vendor = require("./entity/vendor");

module.exports = Object.freeze({
  mockDB: {},
  DB: {
    User,
    Vendor,
  },
});
