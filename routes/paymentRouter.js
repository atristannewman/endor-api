const express = require('express');
const paymentRouter = express.Router();
const { paymentController } = require('../controllers');
const requestHandler = require("../requestHandler");

paymentRouter.get('/stripe-customer-client-secret', requestHandler(paymentController.stripeClientSecret));
paymentRouter.get('/payment-methods/', requestHandler(paymentController.paymentMethods));

module.exports = paymentRouter;