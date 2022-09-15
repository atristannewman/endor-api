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
    let h = 0; 
    let i = 0; 
    let array = []; 
    let location = {}; 
    let notificationPreferences; 
    let preferredDistanceFromPossibleAttendees; 
    let user;

    while (h < usersByLocation.length) {
      users = usersByLocation;
      user = usersByLocation[h];
      location = user.location;
      notificationPreferences = user.notificationPreferences;
      preferredDistanceFromPossibleAttendees = notificationPreferences.preferredDistanceFromPossibleAttendees;

      while (i < users.length) {
        let distance = geolib.getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: users[i].location.latitude, longitude: users[i].location.longitude },
          0.1
        );

        distance = geolib.convertDistance(distance, "ml");
        console.log("Distance origin user to others: ", distance);
        if (distance <= preferredDistanceFromPossibleAttendees) {
          array.push({ address: users[i].address, 
            location: users[i].location, 
            notificationPreferences: users[i].notificationPreferences 
          });
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
    const usersByLocation = await DB.User.findAllWithLocation({ raw: true }); // All Users Array
    console.log(`users by location array length: ${usersByLocation.length}`);
    let originUsers = usersByLocation; // Origin Users Array

    let users = [];

    const h = 0;  
    let k = 0; 
    let potentialGuestArray = []; 
    let potentialGuestCountForOriginUser = 0; 
    let potentialGuest; 
    let originUserToNotifyArray = []; 
    let location = {};
    let notificationPreferences; 
    let distanceFromPossibleAttendees; 
    let potentialNotificationPreferences;
    let preferredDistanceFromPossibleAttendees; 
    let originUser; 
    let notifiedUserArray = [];

    console.log(`users with location: ${originUsers}`);

    while (h < originUsers.length) {
      console.log("Initial Users origin array length: ", originUsers.length);
      users = usersByLocation;
      originUser = originUsers[h]; // Zero index Origin user
      users = users.filter(function (element) { // Need to filter out Origin User from Potential User Search
        return originUser.address !== element.address;
      });

      console.log("Origin user being assessed wallet address", originUser.address);
      location = originUser.location;
      originUserNotificationPreferences = originUser.notificationPreferences;
      preferredDistanceFromPossibleAttendees = originUserNotificationPreferences.distanceFromPossibleAttendees;

      // For all users within the origin users preferred travel radius
      let i = 0;
      console.log(`Users to be assesed based on distance from origin user: ${users.length}`);
      while (i < users.length) {
        let distanceFromOtherUser = geolib.getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: users[i].location.latitude, longitude: users[i].location.longitude },
          0.1
        );
        console.log(`Distance from origin user: ${originUser.address} to ${users[i]} is ${distanceFromOtherUser}`);

        distanceFromOtherUser = geolib.convertDistance(distanceFromOtherUser, "ml");
        if (distanceFromOtherUser <= preferredDistanceFromPossibleAttendees) {
          potentialGuestArray.push({ 
            address: users[i].address, 
            location: users[i].location, 
            notificationPreferences: users[i].notificationPreferences, 
            deviceToken: users[i].deviceToken 
          });
        }
        ++i;
      }
      i = 0;

      console.log(`Possible guests within origin users preferred distance: ${potentialGuestArray.length}`);


      // For possible attendees requirement met
      console.log(`Origin user minimum possible attendees preferred ${originUserNotificationPreferences.minPossibleAttendees}`);
      console.log(`Potential guest within origin users preferred distance from array length ${potentialGuestArray.length}`);
      if (potentialGuestArray.length >= (originUserNotificationPreferences.minPossibleAttendees - 1)) {
        
        originUserToNotifyArray.push({ 
          address: originUser.address, 
          location: originUser.location, 
          notificationPreferences: originUser.notificationPreferences, 
          deviceToken: originUser.deviceToken 
        }); // Add Origin User to to notify Array
        // CODE REVIEW NOTE: TODO: Origin user should not be added here. We don't know if the other users 
        // prefer to meet the origin user at this point
        
        console.log(`Checking potential guests for origin user ${originUser.address} within their preferred distance`);
        // Iterates through potential guests
        while (k < potentialGuestArray.length) {
          potentialGuest = potentialGuestArray[k];
          potentialGuestNotificationPreferences = potentialGuest.notificationPreferences;
          potentialGuestDistanceFromPossibleAttendees = potentialGuestNotificationPreferences.distanceFromPossibleAttendees;
          
          let l = 0; 
          while (l < users.length) { // Iterate for each potential guest found for Origin User
            let distanceFromOriginUser = geolib.getDistance(
              { latitude: potentialGuest.location.latitude, longitude: potentialGuest.location.longitude },
              { latitude: users[l].location.latitude, longitude: users[l].location.longitude },
              0.1
            );

            distanceFromOriginUser = geolib.convertDistance(distanceFromOriginUser, "ml");
            // console.log(distance); // Uncomment to debug distance
            if (distanceFromOriginUser <= preferedDistanceFromPossibleAttendees) {
              ++potentialGuestCountForOriginUser; // No need of array just keep count of attendees for potential user
            }
            ++l;
          }

          // At this point distance from origin user and number of minimum preferred 
          // attendeehas been accounted for
          console.log(`number of potential guests within the origin users ${potentialGuestCountForOriginUser}`)

          l = 0;
          if (potentialGuestCountForOriginUser >= (potentialGuestNotificationPreferences.minPossibleAttendees)) {
            console.log("Attendees Found For Potential Guest: ", potentialGuest.address);
            originUserToNotifyArray.push({ address: potentialGuest.address, location: potentialGuest.location, notificationPreferences: potentialGuest.notificationPreferences, deviceToken: potentialGuest.deviceToken });
            notifiedUserArray.push({ address: potentialGuest.address, location: potentialGuest.location, notificationPreferences: potentialGuest.notificationPreferences, deviceToken: potentialGuest.deviceToken });
          } else {
            console.log("Not enough potential attendees within origin users preferred radius, user: ", potentialGuest.address);
          }

          potentialGuestCountForOriginUser = 0;
          if (originUserToNotifyArray.length === notificationPreferences.minPossibleAttendees) {
            // What if the amount of users we need to notify are greater than the origin users min possible attendees
            // preference
            console.log("All Potential Users have Criteria Sending Push");
            potentialGuestArray = [];

            while (l < originUserToNotifyArray.length) {
              originUser = originUserToNotifyArray[l];
              notifiedUserArray.push(originUser);
              // appleNotification.sendNotification(user.deviceToken, "Enough Proof members are nearby, would you like to start a Hangout?");
              ++l;
            }
            l = 0;
          }

          ++k;
        }
        // console.log(`notification user array length: ${originUserToNotifyArray.length}`);
        // console.log(`notification preferences min possible attendees: ${notificationPreferences.minPossibleAttendees}`)

        k = 0;
        if (originUserToNotifyArray.length === notificationPreferences.minPossibleAttendees) {
          originUserToNotifyArray = originUserToNotifyArray.map(a => a.address);
          originUsers = originUsers.filter(i => !originUserToNotifyArray.includes(i.address));
        } else {
          originUsers.splice(0, 1); // Remove Origin User from Origin Array
        }
      } else {
        console.log(`Potential Users does not meet for ${originUser.address}`);
        originUsers.splice(0, 1); // Remove Origin User from Origin Array
      }

      originUserToNotifyArray = [];
      potentialGuestArray = []; // Empty Potential Users for next Origin User
    }

    notifiedUserArray = [...new Map(notifiedUserArray.map(item =>
      [item.address, item])).values()];
    console.log("Notified Users Array Length", notifiedUserArray.length);
    l = 0;
    while (l < notifiedUserArray.length) {
      originUser = notifiedUserArray[l];
      // appleNotification.sendNotification(user.deviceToken, "Enough Proof members are nearby, would you like to start a Hangout?");
      ++l;
    }
    notifiedUserArray = notifiedUserArray.map(a => a.address);
    console.log(`notified user array: ${notifiedUserArray}`);
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
