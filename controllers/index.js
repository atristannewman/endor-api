const transactionService = require("../services/transaction");
const makeTransactionController = require("./transactionController");

const transactionController = makeTransactionController({ transactionService });

module.exports = Object.freeze({
  transactionController,
});
