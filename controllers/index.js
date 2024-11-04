const connectDatabase = require('../databases');
const paymentService = require('../services/paymentService');
const makeUserController = require('./userController');
const makeAuthenticationController = require('./authenticationController');
const makePaymentController = require('./paymentController');
const makeIntakeController = require('./intakeController');


const DB = connectDatabase({ db: 'postgres', isMock: false });

const userController = makeUserController({
  DB,
  paymentService
});
const authenticationController = makeAuthenticationController({ DB });
const paymentController = makePaymentController({ DB, paymentService });
const webhookController = require('./webhookController')


const intakeController = makeIntakeController({ DB });


module.exports = Object.freeze({
  userController,
  authenticationController,
  paymentController,
  intakeController,
  webhookController
});
