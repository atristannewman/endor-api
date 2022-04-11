const express = require("express");
const transactionRouter = express.Router();
const { transactionController } = require("../controllers");
const requestHandler = require("../requestHandler");

transactionRouter.get(
  "/history",
  requestHandler(transactionController.getTransactionHistory)
);

transactionRouter.get(
  "/tokenlist",
  requestHandler(transactionController.getTokenList)
);

module.exports = transactionRouter;
