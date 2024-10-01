const express = require('express');
const intakeRouter = express.Router();
const { intakeController } = require('../controllers');
const requestHandler = require("../requestHandler");

intakeRouter.post('/', requestHandler(intakeController.createIntake));
intakeRouter.get('/', requestHandler(intakeController.getIntake));
intakeRouter.put('/', requestHandler(intakeController.updateIntake));
intakeRouter.delete('/', requestHandler(intakeController.deleteIntake));

module.exports = intakeRouter;