const connectDatabase = require('../databases');
// const associations = require("../databases/associations");
const transactionService = require('../services/transaction');
const moralisService = require('../services/moralisService');

const makeTransactionController = require('./transactionController');
const makeUserController = require('./userController');
const makeVendorController = require('./vendorController');
const makeHangoutController = require('./hangoutController');
const makeNotificationController = require('./notificationController');
const makeAuthenticationController = require('./authenticationController');
const makeAvailabilityController = require('./availabilityController');

const DB = connectDatabase({ db: 'postgres', isMock: false });

const transactionController = makeTransactionController({ transactionService });
const userController = makeUserController({
  transactionService,
  DB,
  moralisService,
});
const vendorController = makeVendorController({ DB });
const notificationController = makeNotificationController({ DB });
const hangoutController = makeHangoutController({ DB, notificationController });
const authenticationController = makeAuthenticationController({ DB });
const availabilityController = makeAvailabilityController({ DB });

module.exports = Object.freeze({
  transactionController,
  userController,
  vendorController,
  hangoutController,
  notificationController,
  authenticationController,
  availabilityController,
});
