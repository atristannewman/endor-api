var apn = require('apn');
const nearByLocation = require('../utils/nearByLocation')

exports.setNotificationToken = function (req, res, next) {
    var user = req.user;
    user.apn_token = req.body.token;
    user.save(function (err) {
        if (err) { return next(err) }
        return res.json({ success: "true" });
    })
}

module.exports = ({ DB }) => {

    const sendNotification = async (httpRequest) => { // Sends notification to development given deviceToken and message
        // Development environment for notifications includes the APS Environment setting in the XCode project's Provisioning Profile file

        const jwt = require('jsonwebtoken');
        const http2 = require('http2');
        const fs = require('fs');
        const deviceToken = httpRequest.body.deviceToken;

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

    const testHangout = async (httpRequest) => { // Test Api
        const address = httpRequest.body.address;
        const user = await DB.User.findByAddress(address);
        if (!user) {
            return {
                status: 404,
                data: {
                    message: "User is not found",
                },
            };
        }
        if (!user.location?.latitude && !user.location?.longitude) {
            return {
                status: 404,
                data: {
                    message: "User location not found",
                },
            };
        }
        const location = user.location;
        const notificationPreferences = user.notificationPreferences;
        const distanceFromPossibleAttendees = notificationPreferences.distanceFromPossibleAttendees;
        const data = await DB.User.findAllByLocation(user.address);
        let i = 0, j = 0, array = [], secondIteration = [], successCount = 0;
        while (i < data.length) {
            // First Iteration for initial user
            if (nearByLocation.getDistance(location.latitude, location.longitude, data[i].location.latitude, data[i].location.longitude, "K") <= distanceFromPossibleAttendees) {
                array.push({ address: data[i].address, location: data[i].location, notificationPreferences: data[i].notificationPreferences });
            }
            ++i;
        }
        console.log('First Iteration Users', array.length);
        if (notificationPreferences.minPossibleAttendees > array.length) {
            return {
                status: 404,
                data: {
                    message: "User minPossibleAttendees not met",
                },
            };
        }
        
        while (j < array.length) {
            i = 0;
            console.log('Second Iteration');
            secondIteration = [];
            if (array[j].notificationPreferences.minPossibleAttendees <= 1) {
                ++successCount;
            } else {
                // Second Iteration for initial user hangout users found
                while (i < data.length) {
                    if (nearByLocation.getDistance(array[j].location.latitude, array[j].location.longitude, data[i].location.latitude, data[i].location.longitude, "K") <= array[j].notificationPreferences.distanceFromPossibleAttendees) {
                        
                        secondIteration.push(
                            {
                                address: data[i].address,
                                location: data[i].location,
                                notificationPreferences: data[i].notificationPreferences
                            }
                        );
                    }
                    ++i;
                }
            }

            console.log(`Required Users for ${array[j].address} : ${array[j].notificationPreferences.minPossibleAttendees}`);

            console.log('Found Users', secondIteration.length);
            if (secondIteration.length >= (array[j].notificationPreferences.minPossibleAttendees)) {
                ++successCount;
            }
            
            ++j;
        }
        console.log('Success Count', successCount);
        let nearByUsers = array.length;
        if (successCount >= notificationPreferences.minPossibleAttendees) {
            return {
                status: 200,
                data: {
                    nearByUsers,
                    username: user.username
                },
            };
        } else {
            return {
                status: 409,
                data: {

                    nearByUsers,
                    message: "User minPossibleAttendees not met",
                },
            };
        }


    };

    return Object.freeze({
        sendNotification,
        testHangout
    });
};
