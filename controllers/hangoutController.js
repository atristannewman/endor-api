const geolib = require('geolib');
const appleNotification = require("../services/appleNotificationService");

module.exports = ({ DB }) => {
  const createHangout = async (httpRequest) => {
    try {
      const { name, startTime, endTime, address, tags, host } = httpRequest.body;
      const hangout = await DB.Hangout.create({
        name,
        startTime,
        endTime,
        address,
        tags
      });
      if (hangout) {
        const usersByLocation = await DB.User.findAllByLocation({ raw: true });
        let h = 0; let i = 0; let k = 0; let l = 0; let potentialUserArray = []; let potentialUserCount = 0;
        let potentialUser; let notifiedUserArray = []; let potentialNotificationPreferences; let potentialDistanceFromPossibleAttendees; let user;
        let location = {          // Will make dynamic
          latitude: '31.485427',
          longitude: '74.331426'
        };
        let users = usersByLocation;
        // Need to Discuss
        // Min Distance
        // Geo Location or lat, long
        while (i < users.length) {
          let distance = geolib.getDistance(
            { latitude: location.latitude, longitude: location.longitude },
            { latitude: users[i].location.latitude, longitude: users[i].location.longitude },
            0.1
          );
          distance = geolib.convertDistance(distance, "km");
          if (distance <= 1) {
            potentialUserArray.push({ address: users[i].address, location: users[i].location, notificationPreferences: users[i].notificationPreferences, deviceToken: users[i].deviceToken });
          }
          ++i;
        }
        i = 0;
        console.log(`Found Potential Users ${potentialUserArray.length}`);
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
          user = notifiedUserArray[l];
          console.log('Sending Notifications');
          //appleNotification.sendNotification(user.deviceToken, "A Proof Hangout has been scheduled near by...");
          ++l;
        }
        k = 0;
        console.log('Total Found', notifiedUserArray.length);
      }
      //const hangouts = await DB.Hangout.findAll();
      return {
        status: 200,
        data: {
          hangout
        },
      };
    } catch (error) {
      throw error;
    }
  };

  const updateHangout = async (httpRequest) => {
    try {
      const { id, name, startTime, endTime, address, tags } = httpRequest.body;
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
          hangout,
        },
      };
    } catch (error) {
      throw error;
    }
  };

  const deleteHangout = async (httpRequest) => {
    try {
      const { id } = httpRequest.body;
      await DB.Hangout.deleteById(id);
      const hangouts = await DB.Hangout.findAll();

      return {
        status: 200,
        data: {
          hangouts
        },
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
        },
      };
    } catch (error) {
      throw error;
    }
  };

  return Object.freeze({
    createHangout,
    updateHangout,
    deleteHangout,
    getHangouts,
  });
};