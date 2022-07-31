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
      try {
        console.log("post notification");
        const id = httpRequest.params.id
        const deviceToken = httpRequest.body.deviceToken

        var apnProvider = new apn.Provider({
            token: {
                key: __dirname + '/AuthKey_XS2HX5FS8N.p8',
                keyId: __dirname + 'XS2HX5FS8N',
                teamId: "HL3TG6P8PX"
            },
            // ,
            // proxy: {
            //   host: "192.168.10.92",
            //   port: 8080
            // }
            production: false
        });

        var notification = new apn.Notification();

        notification.topic = httpRequest.body.appBundleId
        notification.expiry = Math.floor(Date.now() / 1000) + 3600;
        notification.badge = 3;
        notification.sound = "ping.aiff";
        notification.alert = "\uD83D\uDCE7 \u2709 You have a new message";
        notification.payload = {id: 123};

        console.log(`test device token ${deviceToken}`);

        apnProvider.send(notification, deviceToken).then( (response) => {
          // see documentation for an explanation of result
          console.log(`send notification request response, ${response}`);
          console.log(`tokens: ${response.sent}`)
          response.sent.forEach((token) => {
            console.log(`send notification request response, ${token.device}`);
          })

          response.failed.forEach((token) => {
            console.log(`send notification request response error, ${token.error}`);
            console.log(`send notification request response device, ${token.device}`);
            console.log(`send notification request response, ${token.response}`);

          })
          console.log(`failed token: ${response.failed}`)
        });
      
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
        return {
          status: 200,
          data: {
            // user,
            success: "notification sent"
          },
        };
      } catch (error) {
        return {
          status: 500,
          data: {
            message: error.message,
          },
        };
      }
    };
  
    return Object.freeze({
        sendNotification
    });
};
  