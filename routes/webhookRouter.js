const express = require('express');
const webhookRouter = express.Router();
const { webhookController } = require('../controllers');
const requestHandler = require('../requestHandler');

webhookRouter.post('/stripe', webhookController.handleStripeEvent);

module.exports = webhookRouter;