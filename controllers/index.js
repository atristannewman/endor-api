const transactionService = require("../services/transaction");
const makeTransactionController = require("./transactionController");
const makeUserController = require("./userController");

const transactionController = makeTransactionController({ transactionService });
const userController = makeUserController({ transactionService });

module.exports = Object.freeze({
  transactionController,
  userController,
});
