const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const transactionRouter = require("./routes/transactionRouter");
const userRouter = require("./routes/userRouter");
const vendorRouter = require("./routes/vendorRouter");
const hangoutsRouter = require("./routes/hangoutsRouter");
const notificationsRouter = require("./routes/notificationsRouter");

require("dotenv").config();

const PORT = process.env.PORT || '23.90.200.170';

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded());

app.use("/api/transactions", transactionRouter);
app.use("/api/users", userRouter);
app.use("/api/vendors", vendorRouter);
app.use("/api/hangouts", hangoutsRouter);
app.use("/api/notifications", notificationsRouter);
app.get("/api/send.js", function(req, res, next) {
  const app = req.query.app;
  const deviceToken = req.query.deviceToken;
  const message = req.query.message;
  sendAPNS(deviceToken, message, app);
  res.sendStatus(200);
})

app.listen(PORT, () => {
  console.log(`Server listening on the port::${PORT}`);
});

function sendAPNS(deviceToken, message, app) {
  var apn = require('apn');

  var apnProvider = new apn.Provider({
    token: {
      key: 'AuthKey_XS2HX5FS8N.p8',
      keyId: '',
      teamId: 'TRISTAN Newman',
    },

    production: false
  });

  var notification = new apn.Notification();
  notification.topic = app;
  notification.expiry = Math.floor(Date.now() / 1000) + 3600;
  notification.badge = 3;
  notification.sound = 'ping.aiff';
  notification.alert = message;
  notification.payload = {
    id: 123
  };

  console.log(`device token ${deviceToken}`);
  apnProvider.send(notification, deviceToken).then((response) => {

  });
}