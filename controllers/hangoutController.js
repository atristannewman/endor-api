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
      if(hangout)
      {
        const usersByLocation = await DB.User.findAllByLocation({ raw: true });
        let h = 0; let array = []; let notificationPreferences; let distanceFromPossibleAttendees; let user;
        let location = {          // Will make dynamic
          latitude:'31.485427',
          longitude:'74.331426'
        };
        // Need to Discuss
        // Min Distance
        // Geo Location or lat, long
        while (h < usersByLocation.length) {
          user = usersByLocation[h];
          let distance = geolib.getDistance(
            { latitude: location.latitude, longitude: location.longitude },
            { latitude: user.location.latitude, longitude: user.location.longitude },
            0.1
          );
          distance = geolib.convertDistance(distance, 'km');
          console.log(distance);
          notificationPreferences = user.notificationPreferences;
          distanceFromPossibleAttendees = 1;  // Will need to dicuss this as well
          if (distance <= distanceFromPossibleAttendees) {
            array.push({ address: user.address, location: user.location, notificationPreferences: user.notificationPreferences });
            console.log(`Notification Success ${user.address}`);
            appleNotification.sendNotification(user.deviceToken,'A Proof Hangout has been scheduled near by...');
          }else{
            console.log(`Notification Failed ${user.address}`);
          }
          ++h;
        }
        console.log('Total Found',array.length);
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
      const { id, name, startTime, endTime, address, tags} = httpRequest.body;
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