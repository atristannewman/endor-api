module.exports.sendNotification = (deviceToken, msg, payload) => {
  const jwt = require("jsonwebtoken");
  const http2 = require("http2");
  const fs = require("fs");

  const key = fs.readFileSync(process.env.APNS_KEY, "utf8");

  // "iat" should not be older than 1 hr from current time or will get rejected
  const token = jwt.sign(
    {
      iss: process.env.APNS_TEAM_ID, // "team ID" of your developer account
      iat: Date.now() / 1000 // Replace with current unix epoch time [Not in milliseconds, frustated me :D]
    },
    key,
    {
      header: {
        alg: "ES256",
        kid: process.env.APNS_KEY_ID // issuer key which is "key ID" of your p8 file
      }
    }
  );

  /*
          Use 'https://api.production.push.apple.com' for production build
        */

  const host = process.env.APNS_HOST;
  const path = `/3/device/${deviceToken}`;

  const client = http2.connect(host);

  client.on("error", (err) => console.error(err));

  const body = {
    aps: {
      alert: msg,
      "content-available": 1,
      payload
    }
  };

  const headers = {
    ":method": "POST",
    "apns-topic": process.env.APNS_TOPIC, // your application bundle ID
    ":scheme": "https",
    ":path": path,
    authorization: `bearer ${token}`
  };

  const request = client.request(headers);

  request.on("response", (headers, flags) => {
    for (const name in headers) {
      console.log(`${name}: ${headers[name]}`);
    }

    return {
      headers
    }
  });

  request.setEncoding("utf8");
  let data = "";
  request.on("data", (chunk) => { data += chunk; });
  request.write(JSON.stringify(body));
  request.on("end", () => {
    console.log(`\n${data}`);
    client.close();
  });
  request.end();
};
