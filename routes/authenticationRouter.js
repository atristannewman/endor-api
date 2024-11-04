const express = require('express');
const authenticationRouter = express.Router();
const { authenticationController } = require('../controllers');
const requestHandler = require('../requestHandler');

authenticationRouter.post('/magic-link', requestHandler(authenticationController.createMagicLink));


module.exports = authenticationRouter;
