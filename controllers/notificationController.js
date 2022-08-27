const nearByLocation = require("../utils/nearByLocation");
const appleNotification = require("../services/appleNotificationService");
exports.setNotificationToken = function (req, res, next) {
  const user = req.user;
  user.apn_token = req.body.token;
  user.save(function (err) {
    if (err) { return next(err); }
    return res.json({ success: "true" });
  });
};

module.exports = ({ DB }) => {

  const testHangout = async (httpRequest) => { // Test Api
    const address = httpRequest.body.address;
    const user = await DB.User.findByAddress(address);
    if (!user) {
      return {
        status: 404,
        data: {
          message: "User is not found"
        }
      };
    }
    if (!user.location?.latitude && !user.location?.longitude) {
      return {
        status: 404,
        data: {
          message: "User location not found"
        }
      };
    }
    const location = user.location;
    const notificationPreferences = user.notificationPreferences;
    const distanceFromPossibleAttendees = notificationPreferences.distanceFromPossibleAttendees;
    const data = await DB.User.findAllByLocation();

    let i = 0; let j = 0; const array = []; let secondIteration = []; let successCount = 0;
    while (i < data.length) {
      // First Iteration for initial user
      if (nearByLocation.getDistance(location.latitude, location.longitude, data[i].location.latitude, data[i].location.longitude, "K") <= distanceFromPossibleAttendees) {
        array.push({ address: data[i].address, location: data[i].location, notificationPreferences: data[i].notificationPreferences });
      }
      ++i;
    }
    console.log("First Iteration Users", array.length);
    if (notificationPreferences.minPossibleAttendees > array.length) {
      return {
        status: 404,
        data: {
          message: "User minPossibleAttendees not met"
        }
      };
    }

    while (j < array.length) {
      i = 0;
      console.log("Second Iteration");
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

      console.log("Found Users", secondIteration.length);
      if (secondIteration.length >= (array[j].notificationPreferences.minPossibleAttendees)) {
        ++successCount;
      }

      ++j;
    }
    console.log("Success Count", successCount);
    const nearByUsers = array.length;
    if (successCount >= notificationPreferences.minPossibleAttendees) {
      console.log(`Notification Success ${user.address}`);
    } else {
      console.log(`Notification Failure ${user.address}`);
    }
  };

  const sendHangoutPromptNotification = async (httpRequest) => { // Test Api
    const usersByLocation = await DB.User.findAllByLocation({ raw: true });
    let users = [];
    let h = 0; let i = 0; let array = []; let location = {}; let notificationPreferences; let distanceFromPossibleAttendees; let user;
    while (h < usersByLocation.length) {
      users = usersByLocation;
      user = usersByLocation[h];
      location = user.location;
      notificationPreferences = user.notificationPreferences;
      distanceFromPossibleAttendees = notificationPreferences.distanceFromPossibleAttendees;
      while (i < users.length) {
        if (nearByLocation.getDistance(location.latitude, location.longitude, users[i].location.latitude, users[i].location.longitude, "K") <= distanceFromPossibleAttendees) {
          array.push({ address: users[i].address, location: users[i].location, notificationPreferences: users[i].notificationPreferences });
        }
        ++i;
      }
      console.log(`Required Users ${notificationPreferences.minPossibleAttendees}`);
      console.log(`Found Users ${array.length}`);
      if (array.length >= (notificationPreferences.minPossibleAttendees - 1)) {
        console.log(`Notification Success ${user.address}`);
        appleNotification.sendNotification(user.deviceToken,'Enough Proof members are nearby, would you like to start a Hangout?');
      } else {
        console.log(`Notification Failure ${user.address}`);
      }
      ++h;
      i = 0;
      array = [];
    }

    return {
      status: 200,
      data: {
        message: "All Users Completed",
        totalUsers: usersByLocation.length
      }
    };
  };

  return Object.freeze({
    testHangout,
    sendHangoutPromptNotification
  });
};
