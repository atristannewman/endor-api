const MagicLink = require("../../models/magicLink");
const ApiKey = require("../../models/apiKey");
const CustomerId = require("../../models/customerId");
const CustomerData = require("../../models/customerData");

module.exports = Object.freeze({
  mockDB: {},
  DB: {
    MagicLink,
    ApiKey,
    CustomerId,
    CustomerData
  },
});
