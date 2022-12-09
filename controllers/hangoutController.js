/* eslint-disable no-useless-catch */
const geolib = require("geolib");
const appleNotification = require("../services/appleNotificationService");
const googleServices = require("../services/googleServices");

module.exports = ({ DB }) => {
  const createHangout = async (httpRequest) => {
    try {
      const { name, startTime, endTime, address, tags, host } = httpRequest.body;
      const hangout = await DB.Hangout.create({
        name,
        startTime,
        endTime,
        address,
        tags,
        host
      });
      const location = await googleServices.geoCoding(address);

      if (hangout) {
        const usersWithLocation = await DB.User.findAllWithLocation({ raw: true });
        const h = 0; let k = 0; let l = 0; const potentialUserArray = []; let potentialUserCount = 0;
        let potentialUser;
        let notifiedUserArray = [];
        let potentialNotificationPreferences;
        let potentialDistanceFromPossibleAttendees;
        let user;
        const users = usersWithLocation;
        console.log(`Number of users with location: ${users.length}`);

        // Geo Location or lat, long
        let i = 0;
        while (i < users.length) {
          let distance = geolib.getDistance(
            { latitude: location.latitude, longitude: location.longitude },
            { latitude: users[i].location.latitude, longitude: users[i].location.longitude },
            0.1
          );

          distance = geolib.convertDistance(distance, "mi");
          console.log(`user prefered distance from hangout: ${users[i].notificationPreferences.distanceFromPossibleAttendees} 
          distance hangout is from user ${distance}`)
          if (distance <= users[i].notificationPreferences.distanceFromPossibleAttendees) {
            potentialUserArray.push({
              address: users[i].address,
              location: users[i].location,
              notificationPreferences: users[i].notificationPreferences,
              deviceToken: users[i].deviceToken
            });
          }

          ++i;
        }
        i = 0;
        console.log(`Number of users found within their distance preference of the new hangout ${potentialUserArray.length}`);

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
            distance = geolib.convertDistance(distance, "mi");
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
          ++k;
        }
        while (l < notifiedUserArray.length) {
          const createdHangoutPayload = {
            "navigation": "goToHangoutDetails",
            "hangoutId": hangout.id
          }
          user = notifiedUserArray[l];
          console.log("Sending Notifications");
          appleNotification.sendNotification(user.deviceToken, "A Proof Hangout has been scheduled near by.", createdHangoutPayload);
          ++l;
        }
        k = 0;
        console.log("Total Notified Users", notifiedUserArray.length);
        notifiedUserArray = notifiedUserArray.map(a => a.address);
        console.log(`notified user array: ${notifiedUserArray}`);
      }
      // const hangouts = await DB.Hangout.findAll();
      return {
        status: 200,
        data: {
          hangout
        }
      };
    } catch (error) {
      throw error;
    }
  };

  const updateHangout = async (httpRequest) => {
    try {
      const {
        id,
        name,
        startTime,
        endTime,
        address,
        tags
      } = httpRequest.body;

      await DB.Hangout.updateById(id, {
        name,
        startTime,
        endTime,
        address,
        tags
      });
      const hangout = await DB.Hangout.findById(id);
      return {
        status: 200,
        data: {
          hangout
        }
      };
    } catch (error) {
      throw error;
    }
  };

  const deleteHangout = async (httpRequest) => {
    try {
      const { id } = httpRequest.body;
      await DB.Hangout.deleteById(id).then(
        function () { const hangouts = DB.Hangout.findAll(); }
      );

      return {
        status: 200,
        data: {
          hangouts
        }
      };
    } catch (error) {
      throw error;
    }
  };

  const getHangouts = async () => {
    try {
      const hangouts = await DB.Hangout.findAll({

      });
      return {
        status: 200,
        data: {
          hangouts
        }
      };
    } catch (error) {
      throw error;
    }
  };

  return Object.freeze({
    createHangout,
    updateHangout,
    deleteHangout,
    getHangouts
  });
};
