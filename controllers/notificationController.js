var apn = require('apn');

exports.setNotificationToken = function(req, res, next) {
    var user = req.user;
    user.apn_token = req.body.token;
    user.save(function(err) {
        if (err) { return next(err) }
        return res.json({success: "true"});
    })
}

module.exports = ({ DB }) => {

    const sendNotification = async (httpRequest) => { // Sends notification to development given deviceToken and message
        // Development environment for notifications includes the APS Environment setting in the XCode project's Provisioning Profile file

      const jwt = require('jsonwebtoken');
      const http2 = require('http2');
      const fs = require('fs');
      const deviceToken = httpRequest.query.deviceToken;

      const key = fs.readFileSync(__dirname + "/FlockAppAPNsKey.p8", 'utf8')

      //"iat" should not be older than 1 hr from current time or will get rejected
      const token = jwt.sign(
          {
              iss: "HL3TG6P8PX", //"team ID" of your developer account
              iat: Date.now() / 1000  //Replace with current unix epoch time [Not in milliseconds, frustated me :D]
          },
          key,
          {
              header: {
                  alg: "ES256",
                  kid: "CB4MN6UCR4", //issuer key which is "key ID" of your p8 file
              }
          }
      )

      /* 
        Use 'https://api.production.push.apple.com' for production build
      */

      host = 'https://api.sandbox.push.apple.com'
      path = `/3/device/${deviceToken}`
      
      const client = http2.connect(host);

      client.on('error', (err) => console.error(err));

      body = {
          "aps": {
              "alert": `${httpRequest.body.message}`,
              "content-available": 1
          }
      }

      headers = {
          ':method': 'POST',
          'apns-topic': 'com.tristannewman.FlockApp', //your application bundle ID
          ':scheme': 'https',
          ':path': path,
          'authorization': `bearer ${token}`
      }

      const request = client.request(headers);

      request.on('response', (headers, flags) => {
          for (const name in headers) {
              console.log(`${name}: ${headers[name]}`);
          }
      });

      request.setEncoding('utf8');
      let data = ''
      request.on('data', (chunk) => { data += chunk; });
      request.write(JSON.stringify(body))
      request.on('end', () => {
          console.log(`\n${data}`);
          client.close();
      });
      request.end();
    };
  
    return Object.freeze({
        sendNotification
    });
};
  