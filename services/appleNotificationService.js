module.exports.sendNotification = (deviceToken, msg, payload) => {
  const fs = require("fs");
  const apn = require('apn');

  // Create the APN provider with the certificate and key
  const key = fs.readFileSync(process.env.APNS_KEY, "utf8");
  // const cert = fs.readFileSync(process.env.APNS_CERT, "utf8");

  const provider = new apn.Provider({
    token: {
      // cert: cert,
      key: key,
      teamId: process.env.APNS_TEAM_ID,
      keyId: process.env.APNS_KEY_ID
    },
    production: true // set to false for development environment
  });

  const notification = new apn.Notification();
  notification.alert = msg;
  notification.topic = process.env.APNS_TOPIC;


  provider.send(notification, deviceToken).then((result) => {
    console.log(JSON.stringify(result));
  });
};
