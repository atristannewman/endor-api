const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const authenticationRouter = require('./routes/authenticationRouter');
const paymentRouter = require('./routes/paymentRouter');
const intakeRouter = require('./routes/intakeRouter');
const webhookRouter = express.Router();
const apiKeyAuth = require('./middleware/apiKeyAuth');


require('dotenv').config();

const LOCAL_PORT = process.env.PORT || '4321';

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded());

// ----- Routes ------ //
app.use('/api/users', userRouter);
app.use('/api/authentication', authenticationRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/intake', apiKeyAuth, intakeRouter);
app.use('/webhooks', webhookRouter);

app.listen(LOCAL_PORT, () => {
  console.log(`Server listening on the port: ${LOCAL_PORT}`);
});
