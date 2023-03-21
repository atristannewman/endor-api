const express = require('express');
const availabilityRouter = express.Router();
const { availabilityController } = require('../controllers');
const requestHandler = require('../requestHandler');

console.log('Initializing availabilityRouter');
console.log('availabilityController: ', availabilityController);
availabilityRouter.post(
  '/',
  requestHandler(availabilityController.updateAvailability)
);

module.exports = availabilityRouter;
