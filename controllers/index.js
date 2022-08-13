const connectDatabase = require("../databases");
// const associations = require("../databases/associations");
const transactionService = require("../services/transaction");
const makeTransactionController = require("./transactionController");
const makeUserController = require("./userController");
const makeVendorController = require("./vendorController");
const makeHangoutController = require("./hangoutController");
const makeNotificationController = require("./notificationController");

const DB = connectDatabase({ db: "postgres", isMock: false });

const transactionController = makeTransactionController({ transactionService });
const userController = makeUserController({ transactionService, DB });
const vendorController = makeVendorController({ DB });
const hangoutController = makeHangoutController({ DB });
const notificationController = makeNotificationController({ DB })

module.exports = Object.freeze({
  transactionController,
  userController,
  vendorController,
  hangoutController,
  notificationController
});
