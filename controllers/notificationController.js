var apn = require('apn');

exports.setNotificationToken = function(req, res, next) {
    var user = req.user;
    user.apn_token = req.body.token;
    user.save(function(err) {
        if (err) { return next(err) }
        return res.json({success: "true"});
    })
}

// exports.createNotification = function(req, res, next) {
//     var user_id = req.params.user_id;
//     User.findById(user_id, function(err, user) {
//       if (err) { return next(err) }
//       var token = user.apn_token;
  
//       var options = {
//         token: {
//             // cert: __dirname + '/cert.pem',
//             key: __dirname + '/key.pem',
//             teamId: "FlockApp"
//         }
        // ,
        // proxy: {
        //   host: "192.168.10.92",
        //   port: 8080
        // }
        // production: false
      // };

      // var apnConnection = new apn.Connection(options);
  
  //     var myDevice = new apn.Device(token);
  
  //     var note = new apn.Notification();
  
  //     note.expiry = Math.floor(Date.now() / 1000) + 3600;
  //     note.badge = 3;
  //     note.sound = "ping.aiff";
  //     note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
  //     note.payload = {'messageFrom': 'Caroline'};
  //     apnConnection.pushNotification(note, myDevice);
  
  //     return res.json({success: "true"});
  //   });
  // }

module.exports = ({ DB }) => {

    const sendNotification = async (httpRequest) => {

      const jwt = require('jsonwebtoken');
      const http2 = require('http2');
      const fs = require('fs');

      /*
      Read p8 file. Assumes p8 file to be in same directory
      */
      const key = fs.readFileSync(__dirname + "/FlockAppAPNsKey.p8", 'utf8')

      //"iat" should not be older than 1 hr from current time or will get rejected
      const token = jwt.sign(
          {
              iss: "HL3TG6P8PX", //"team ID" of your developer account
              iat: 1659352493 //Replace with current unix epoch time [Not in milliseconds, frustated me :D]
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
        Use 'https://api.push.apple.com' for production build
      */

      host = 'https://api.sandbox.push.apple.com'
      path = '/3/device/40429b12f1cba3c648f8b0f42600232944d2d6b200bf0f18d553af2c2528aed0'

      const client = http2.connect(host);

      client.on('error', (err) => console.error(err));

      body = {
          "aps": {
              "alert": "hello",
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
      // const http2 = require('http2');
      // const fs = require('fs');

      // /* 
      //   Use 'https://api.push.apple.com' for production build
      // */

      // host = 'https://api.sandbox.push.apple.com'
      // path = '/3/device/40429b12f1cba3c648f8b0f42600232944d2d6b200bf0f18d553af2c2528aed0'

      // /*
      // Using certificate converted from p12.
      // The code assumes that your certificate file is in same directory.
      // Replace/rename as you please
      // */

      // const client = http2.connect(host, {
      //   key: fs.readFileSync(__dirname + '/CertificatesKey.pem'),
      //   cert: fs.readFileSync(__dirname + '/Certificates.pem')
      // });

      // client.on('error', (err) => console.error(err));

      // body = {
      //   "aps": {
      //     "alert": "hello",
      //     "content-available": 1
      //   }
      // }

      // headers = {
      //   ':method': 'POST',
      //   'apns-topic': 'com.tristannewman.FlockApp', //you application bundle ID
      //   ':scheme': 'https',
      //   ':path': path
      // }

      // const request = client.request(headers);
      
      // console.log("made it to request.on");

      // request.on('response', (headers, flags) => {
      //   for (const name in headers) {
      //     console.log(`${name}: ${headers[name]}`);
      //   }
      // });

      // request.setEncoding('utf8');

      // console.log("made it past set encoding");

      // let data = '';
      // request.on('data', (chunk) => { data += chunk; });
      // request.write(JSON.stringify(body));

      // console.log("made it past json write");

      // request.on('end', () => {
      //   console.log(`\n${data}`);
      //   client.close();
      // });
      // request.end();

      // console.log("made it past request end");

      // try {
      //   console.log("post notification");
      //   const id = httpRequest.params.id
      //   const deviceToken = httpRequest.body.deviceToken

      //   var apnProvider = new apn.Provider({
      //       token: {
      //           key: __dirname + '/AuthKey_XS2HX5FS8N.p8',
      //           // key: __dirname + '/key.pem',
      //           keyId: __dirname + 'XS2HX5FS8N',
      //           teamId: "HL3TG6P8PX"
      //       },
      //       // ,
      //       // proxy: {
      //       //   host: "192.168.10.92",
      //       //   port: 8080
      //       // }
      //       production: true
      //   });

      //   var notification = new apn.Notification();

      //   notification.topic = httpRequest.body.appBundleId
      //   notification.expiry = Math.floor(Date.now() / 1000) + 3600;
      //   notification.badge = 1;
      //   notification.sound = "ping.aiff";
      //   notification.alert = "\uD83D\uDCE7 \u2709 You have a new message";
      //   notification.payload = {id: 123};

      //   console.log(`test device token ${deviceToken}`);

      //   apnProvider.send(notification, [deviceToken]).then( (response) => {
      //     // see documentation for an explanation of result
      //     console.log(`send notification request response, ${response}`);
      //     console.log(`tokens: ${response.sent}`)
      //     response.sent.forEach((token) => {
      //       console.log(`send notification request response, ${token.device}`);
      //     })

      //     response.failed.forEach((token) => {
      //       console.log(`send notification request response error, ${token.error}`);
      //       console.log(`send notification request response device, ${token.device}`);
      //       console.log(`send notification request response, ${token.response}`);

      //     })
      //   });
      
        //   return res.json({});
        // const {
        //   address,
        //   hasMoonbird,
        //   hasProof,
        //   username,
        //   hostRating,
        //   profileImageUrl,
        // } = httpRequest.body;
        // const userAddress = await DB.User.findByAddress(address);
        // if (userAddress) {
        //   return {
        //     status: 409,
        //     data: {
        //       message: "User address already exists",
        //     },
        //   };
        // }
        // const userUsername = await DB.User.findByUsername(username);
        // if (userUsername) {
        //   return {
        //     status: 409,
        //     data: {
        //       message: "User name aleady exists",
        //     },
        //   };
        // }
        // const user = await DB.User.create({
        //   address,
        //   hasProof,
        //   hasMoonbird,
        //   username,
        //   hostRating,
        //   profileImageUrl,
        // });
      //   return {
      //     status: 200,
      //     data: {
      //       // user,
      //       success: "notification sent"
      //     },
      //   };
      // } catch (error) {
      //   return {
      //     status: 500,
      //     data: {
      //       message: error.message,
      //     },
      //   };
      // }
    };
  
    return Object.freeze({
        sendNotification
    });
};
  