const { validate } = require("../../validation/user");
const makeUser = require("./user");

module.exports = makeUser({ validate });
