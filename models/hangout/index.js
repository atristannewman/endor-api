const { validate } = require("../../validation/hangout");
const makeHangout = require("../hangout/hangout");

module.exports = makeHangout({ validate });
