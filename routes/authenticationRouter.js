const express = require('express');
const authenticationRouter = express.Router();
const { authenticationController } = require('../controllers');
const requestHandler = require('../requestHandler');

console.log('Initializing authenticationRouter');
console.log('authenticationController: ', authenticationController);

authenticationRouter.post(
  '/',
  requestHandler(authenticationController.createTokenproofAddress)
);
authenticationRouter.get(
  '/',
  requestHandler(authenticationController.getTokenproofWalletForNonce)
);

module.exports = authenticationRouter;
