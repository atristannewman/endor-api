const { validate } = require("../../validation/userAddress");
const makeTokenproofAddress = require("./tokenproofAddress");

module.exports = makeTokenproofAddress({ validate });