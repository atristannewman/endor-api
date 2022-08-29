const appleNotification = require("../services/appleNotificationService");
const geolib = require("geolib");
exports.setNotificationToken = function (req, res, next) {
  const user = req.user;
  user.apn_token = req.body.token;
  user.save(function (err) {
    if (err) { return next(err); }
    return res.json({ success: "true" });
  });
};

module.exports = ({ DB }) => {

  const sendHangoutPromptNotificationOld = async (httpRequest) => { // Test Api
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
        let distance = geolib.getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: users[i].location.latitude, longitude: users[i].location.longitude },
          0.1
        );
        distance = geolib.convertDistance(distance, "km");
        console.log(distance);
        if (distance <= distanceFromPossibleAttendees) {
          array.push({ address: users[i].address, location: users[i].location, notificationPreferences: users[i].notificationPreferences });
        }
        ++i;
      }
      console.log(`Required Users ${notificationPreferences.minPossibleAttendees - 1}`);
      console.log(`Found Users ${array.length}`);
      if (array.length >= (notificationPreferences.minPossibleAttendees - 1)) {
        console.log(`Notification Success ${user.address}`);
        appleNotification.sendNotification(user.deviceToken, "Enough Proof members are nearby, would you like to start a Hangout?");
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
  const sendHangoutPromptNotification = async (httpRequest) => { // Test Api
    const usersByLocation = await DB.User.findAllByLocation({ raw: true }); // All Users Array
    let originUsers = usersByLocation; // Origin Users Array
    let users = [];
    let h = 0; let i = 0; let k = 0; let l = 0; let potentialUserArray = []; let potentialUserCount = 0; let potentialUser; let notifiedUserArray = []; let location = {};
    let notificationPreferences; let distanceFromPossibleAttendees; let potentialNotificationPreferences;
    let potentialDistanceFromPossibleAttendees; let user;
    while (h < originUsers.length) {
      console.log("Initial Origin Length: ", originUsers.length);
      users = usersByLocation;
      user = originUsers[h]; // Zero index Origin user
      users = users.filter(function (el) { // Need to filter out Origin User from Potential User Search
        return el.address !== user.address;
      });
      console.log("User Address", user.address);
      location = user.location;
      notificationPreferences = user.notificationPreferences;
      distanceFromPossibleAttendees = notificationPreferences.distanceFromPossibleAttendees;
      while (i < users.length) {
        let distance = geolib.getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: users[i].location.latitude, longitude: users[i].location.longitude },
          0.1
        );
        distance = geolib.convertDistance(distance, "km");
        // console.log(distance); // Uncomment to debug distance
        if (distance <= distanceFromPossibleAttendees) {
          potentialUserArray.push({ address: users[i].address, location: users[i].location, notificationPreferences: users[i].notificationPreferences, deviceToken: users[i].deviceToken });
        }
        ++i;
      }
      i = 0;
      console.log(`Required Potential Users ${notificationPreferences.minPossibleAttendees}`);
      console.log(`Found Potential Users ${potentialUserArray.length}`);
      if (potentialUserArray.length >= (notificationPreferences.minPossibleAttendees)) {
        notifiedUserArray.push({ address: user.address, location: user.location, notificationPreferences: user.notificationPreferences, deviceToken: user.deviceToken }); // Add Origin User to Notified Array
        console.log(`Potential Users Met for ${user.address}`);
        while (k < potentialUserArray.length) {
          potentialUser = potentialUserArray[k];
          potentialNotificationPreferences = potentialUser.notificationPreferences;
          potentialDistanceFromPossibleAttendees = potentialNotificationPreferences.distanceFromPossibleAttendees;
          while (l < users.length) { // Iterate for each potential User found for Origin User
            let distance = geolib.getDistance(
              { latitude: potentialUser.location.latitude, longitude: potentialUser.location.longitude },
              { latitude: users[l].location.latitude, longitude: users[l].location.longitude },
              0.1
            );
            distance = geolib.convertDistance(distance, "km");
            // console.log(distance); // Uncomment to debug distance
            if (distance <= potentialDistanceFromPossibleAttendees) {
              ++potentialUserCount; // No need of array just keep count of attendees for potential user
            }
            ++l;
          }
          l = 0;
          if (potentialUserCount >= (potentialNotificationPreferences.minPossibleAttendees)) {
            console.log("Attendees Found For Potential User: ", potentialUser.address);
            notifiedUserArray.push({ address: potentialUser.address, location: potentialUser.location, notificationPreferences: potentialUser.notificationPreferences, deviceToken: potentialUser.deviceToken });
          } else {
            console.log("Attendees Not Found For Potential User: ", potentialUser.address);
          }
          potentialUserCount = 0;
          if (notifiedUserArray.length === notificationPreferences.minPossibleAttendees) {
            console.log("All Potential Users have Criteria Sending Push");
            potentialUserArray = [];
            while (l < notifiedUserArray.length) {
              user = notifiedUserArray[l];
              //appleNotification.sendNotification(user.deviceToken, "Enough Proof members are nearby, would you like to start a Hangout?");
              ++l;
            }
            l = 0;
          }
          ++k;
        }
        k = 0;
        if (notifiedUserArray.length === notificationPreferences.minPossibleAttendees) {
          notifiedUserArray = notifiedUserArray.map(a => a.address);
          console.log(notifiedUserArray);
          originUsers = originUsers.filter(i => !notifiedUserArray.includes(i.address));
        } else {
          originUsers.splice(0, 1); // Remove Origin User from Origin Array
        }
      } else {
        console.log(`Potential Users does not meet for ${user.address}`);
        originUsers.splice(0, 1); // Remove Origin User from Origin Array
      }

      notifiedUserArray = [];
      potentialUserArray = []; // Empty Potential Users for next Origin User
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
    sendHangoutPromptNotification
  });
};
