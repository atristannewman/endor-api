const express = require('express');
const paymentRouter = express.Router();
const { paymentController } = require('../controllers');
const requestHandler = require("../requestHandler");

paymentRouter.post('/intent', requestHandler(paymentController.createPaymentIntent));
paymentRouter.post('/confirm-intent', requestHandler(paymentController.confirmPaymentIntent));

module.exports = paymentRouter;