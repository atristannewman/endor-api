const { validate } = require("../../validation/magicLink");
const makeMagicLink = require("./magicLink");

module.exports = makeMagicLink({ validate });
