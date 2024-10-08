const connectDatabase = require('../databases');
// const associations = require("../databases/associations");
const transactionService = require('../services/transaction');
const moralisService = require('../services/moralisService');
const makeLocationService = require('../services/locationService');
const paymentService = require('../services/paymentService');
const emailAuthenticationService = require('../services/mailgunService');

const makeTransactionController = require('./transactionController');
const makeUserController = require('./userController');
const makeVendorController = require('./vendorController');
const makeHangoutController = require('./hangoutController');
const makeNotificationController = require('./notificationController');
const makeAuthenticationController = require('./authenticationController');
const makeAvailabilityController = require('./availabilityController');
const makePaymentController = require('./paymentController');

const DB = connectDatabase({ db: 'postgres', isMock: false });

const locationService = makeLocationService({ DB });
const transactionController = makeTransactionController({ transactionService });
const userController = makeUserController({
  transactionService,
  DB,
  moralisService,
  paymentService
});
const vendorController = makeVendorController({ DB });
const notificationController = makeNotificationController({ DB });
const hangoutController = makeHangoutController({ 
  DB, 
  notificationController 
});
const authenticationController = makeAuthenticationController({ DB, emailAuthenticationService });
const availabilityController = makeAvailabilityController({
  DB,
  locationService,
});
const paymentController = makePaymentController({ DB, paymentService });

const makeIntakeController = require('./intakeController');

const intakeController = makeIntakeController({ DB });

const operatingAreaController = require('./operatingAreaController')();

module.exports = Object.freeze({
  transactionController,
  userController,
  vendorController,
  hangoutController,
  notificationController,
  authenticationController,
  availabilityController,
  paymentController,
  intakeController,
  operatingAreaController
});
