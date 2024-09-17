const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const transactionRouter = require('./routes/transactionRouter');
const userRouter = require('./routes/userRouter');
const vendorRouter = require('./routes/vendorRouter');
const hangoutsRouter = require('./routes/hangoutsRouter');
const notificationsRouter = require('./routes/notificationsRouter');
const authenticationRouter = require('./routes/authenticationRouter');
const availabilityRouter = require('./routes/availabilityRouter');
const paymentRouter = require('./routes/paymentRouter');
const { auth, requiresAuth } = require('express-openid-connect');
const webhookRouter = express.Router();
const apiKeyAuth = require('./middleware/apiKeyAuth');


require('dotenv').config();

const LOCAL_PORT = "4321" || '23.90.200.170';

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded());

// ----- Routes ------ //
app.use('/api/transactions', transactionRouter);
app.use('/api/users', userRouter);
app.use('/api/vendors', vendorRouter);
app.use('/api/hangouts', hangoutsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/authentication', authenticationRouter);
app.use('/api/availability', apiKeyAuth,availabilityRouter);
app.use('/api/payments', paymentRouter);
app.use('/webhooks', webhookRouter);

// ----- from Auth0 start ------ //
const auth0Configuration = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  // callback: process.env.AUTH0_CALLBACK_URL,
  // redirectUri: process.env.AUTH0_CALLBACK_URL,
  secret: process.env.AUTH0_SECRET,
  // onRedirectCallback: "http://localhost:5432/"
};

// The `auth` router attaches /login, /logout
// and /callback routes to the baseURL
// app.use(auth(auth0Configuration));

// req.oidc.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.send({
      loginStatus: 'Logged in',
      profileAuth0Id: req.oidc.user.sub,
    });
  } else {
    res.send({
      loginStatus: 'Logged out',
    });
  }
});

// The /profile route will show the user profile as JSON
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

// ----- from Auth0 end ----- //

app.listen(LOCAL_PORT, () => {
  console.log(`Server listening on the port::${LOCAL_PORT}`);
});
