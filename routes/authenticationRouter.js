const express = require('express');
const authenticationRouter = express.Router();
const { authenticationController } = require('../controllers');
const requestHandler = require('../requestHandler');

authenticationRouter.post(
  '/',
  requestHandler(authenticationController.createTokenproofAddress)
);
authenticationRouter.get(
  '/',
  requestHandler(authenticationController.getTokenproofWalletForNonce)
);
authenticationRouter.post(
  '/send-magic-link',
  requestHandler(authenticationController.sendMagicLink)
)

module.exports = authenticationRouter;
