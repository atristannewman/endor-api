const User = require("./entity/user");
const Vendor = require("./entity/vendor");
const Hangout = require("./entity/hangout");



module.exports = Object.freeze({
  mockDB: {},
  DB: {
    User,
    Vendor,
    Hangout,
  },
  // db
});


