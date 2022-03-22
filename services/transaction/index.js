const fetchRequest = require("../../utils/request");
const makeTransactionService = require("./transactionService");

const transactionService = makeTransactionService({ fetchRequest });

module.exports = transactionService;
