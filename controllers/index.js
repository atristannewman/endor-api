const connectDatabase = require("../databases");
const transactionService = require("../services/transaction");
const makeTransactionController = require("./transactionController");
const makeUserController = require("./userController");

const DB = connectDatabase({ db: "postgres", isMock: false });

const transactionController = makeTransactionController({ transactionService });
const userController = makeUserController({ transactionService, DB });

module.exports = Object.freeze({
  transactionController,
  userController,
});
