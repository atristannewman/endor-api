const appleNotification = require("../services/appleNotificationService");
const geolib = require('geolib');
exports.setNotificationToken = function (req, res, next) {
  const user = req.user;
  user.apn_token = req.body.token;
  user.save(function (err) {
    if (err) { return next(err); }
    return res.json({ success: "true" });
  });
};

module.exports = ({ DB }) => {

  const sendHangoutPromptNotification = async (httpRequest) => { 
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
        distance = geolib.convertDistance(distance, 'km');
        console.log(distance);
        if (distance <= distanceFromPossibleAttendees) {
          array.push({ address: users[i].address, location: users[i].location, notificationPreferences: users[i].notificationPreferences });
        }
        ++i;
      }
      console.log(`Required Users ${notificationPreferences.minPossibleAttendees -1}`);
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
    sendHangoutPromptNotification
  });
};
