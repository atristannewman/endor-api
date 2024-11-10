const express = require('express');
const availabilityRouter = express.Router();
const { availabilityController } = require('../controllers');
const requestHandler = require('../requestHandler');

availabilityRouter.post(
  '/',
  requestHandler(availabilityController.updateAvailability)
);

availabilityRouter.post(
  '/query',
  requestHandler(availabilityController.queryNearbyAvailableUsers)
);

module.exports = availabilityRouter;
