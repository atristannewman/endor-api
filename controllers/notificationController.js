const appleNotification = require("../services/appleNotificationService");
const geolib = require("geolib");
const { INTEGER } = require("sequelize");
const user = require("../model/user");
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

        distance = geolib.convertDistance(distance, "mi");
        console.log("Distance origin user to others: ", distance);
        if (distance <= preferredDistanceFromPossibleAttendees) {
          array.push({ address: users[i].address, 
            location: users[i].location, 
            notificationPreferences: users[i].notificationPreferences 
          });
        }
        ++i;
      }
      console.log(`Required users ${(notificationPreferences.minPossibleAttendees - 1)}`);
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
    const usersWithLocation = await DB.User.findAllWithLocation({ raw: true }); // All Users Array
    console.log(`users by location array length: ${usersWithLocation.length}`);
    let originUsers = usersWithLocation; // Origin Users Array

    let users = [];

    let potentialGuestArray = [];  
    let potentialGuest; 
    let potentialUserToNotifyArray = []; 
    let location = {};
    let originUserNotificationPreferences; 
    let distanceFromPossibleAttendees; 
    let potentialNotificationPreferences;
    let preferredDistanceFromPossibleAttendees; 
    let originUser; 
    let notifiedUserArray = [];

    console.log(`users with location: ${originUsers}`);

    let h = 0;
    while (h < originUsers.length) {
      console.log("Initial Users origin array length: ", originUsers.length);
      users = usersWithLocation;
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
        let distanceFromPotentialGuestUser = geolib.getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: users[i].location.latitude, longitude: users[i].location.longitude },
          0.1
        );
        console.log(`Distance from origin user: ${originUser.address} to ${users[i].address} is ${distanceFromPotentialGuestUser}`);

        distanceFromOtherUser = geolib.convertDistance(distanceFromPotentialGuestUser, "mi");
        if (distanceFromOtherUser <= preferredDistanceFromPossibleAttendees) {
          potentialGuestArray.push({ 
            address: users[i].address, 
            location: users[i].location, 
            notificationPreferences: users[i].notificationPreferences, 
            deviceToken: users[i].deviceToken 
          });

          console.log(`Saved user with address ${users[i].address} to potentialGuestArray`)
        }
        ++i;
      }
      i = 0;

      console.log(`Possible guests within origin users preferred distance: ${potentialGuestArray.length}`);


      // For possible attendees requirement met
      console.log(`Origin user minimum possible attendees preferred ${originUserNotificationPreferences.minPossibleAttendees}`);
      console.log(`Potential guest within origin users preferred distance from array length ${potentialGuestArray.length}`);
      console.log(`minimum possible attendees for origin user ${(originUserNotificationPreferences.minPossibleAttendees)}`)
      if (potentialGuestArray.length + 1 >= (originUserNotificationPreferences.minPossibleAttendees)) {
        
        potentialUserToNotifyArray.push({ 
          address: originUser.address, 
          location: originUser.location, 
          notificationPreferences: originUser.notificationPreferences, 
          deviceToken: originUser.deviceToken 
        }); // Add Origin User to potential user to notify Array
        
        console.log(`Finished checking potential guests for origin user ${originUser.address}`);
        
        // Iterates through potential guests
        let k = 0; 
        while (k < potentialGuestArray.length) {
          potentialGuest = potentialGuestArray[k];
          potentialGuestNotificationPreferences = potentialGuest.notificationPreferences;
          potentialGuestPreferredDistanceFromPossibleAttendees = potentialGuestNotificationPreferences.distanceFromPossibleAttendees;
          
          console.log(`Checking requirements for potential guest ${potentialGuest.address} of origin user ${originUser.address}`)
          let l = 0; 
          let potentialAttendeeCountForPossibleGuest = 0; // of origin user
          console.log("Checking possible attendees distance from possible guest of the origin user")
          while (l < users.length) { // Iterate for each potential guest found for Origin User
            let distanceFromPotentialGuestToPossibleAttendee = geolib.getDistance(
              { latitude: potentialGuest.location.latitude, longitude: potentialGuest.location.longitude },
              { latitude: users[l].location.latitude, longitude: users[l].location.longitude },
              0.1
            );

            distanceFromPotentialGuestToPossibleAttendee = geolib.convertDistance(distanceFromPotentialGuestToPossibleAttendee, "mi");
            console.log(`Distance from possible attendee ${users[l].address} to possible guest ${potentialGuest.address}  is ${distanceFromPotentialGuestToPossibleAttendee}`);
            if (distanceFromPotentialGuestToPossibleAttendee <= potentialGuestPreferredDistanceFromPossibleAttendees) {
              ++potentialAttendeeCountForPossibleGuest; // No need of array just keep count of attendees for potential user
            }
            ++l;
          }
          l = 0;

          // At this point distance from origin user and number of minimum preferred 
          // attendees has been accounted for
          // console.log(`number of possible attendees within the potential guest (of origin users) preferred distance ${potentialAttendeeCountForPossibleGuest} min attendees for guest minus origin user ${potentialGuestNotificationPreferences.minPossibleAttendees-1/*for origin user*/}`)

          const minimumAttendeesForGuest = potentialGuestNotificationPreferences.minPossibleAttendees - 1; //For
          console.log(`minimum attendees for guest ${minimumAttendeesForGuest}`)
          if (potentialAttendeeCountForPossibleGuest >= minimumAttendeesForGuest) {
            console.log("Enough attendees found for potential guest with wallet address: ", potentialGuest.address);
            potentialUserToNotifyArray.push({ 
              address: potentialGuest.address, 
              location: potentialGuest.location, 
              notificationPreferences: potentialGuest.notificationPreferences, 
              deviceToken: potentialGuest.deviceToken 
            });

            // TODO: Why is this happening VVV ? 
            // notifiedUserArray.push({ 
            //   address: potentialGuest.address, 
            //   location: potentialGuest.location, 
            //   notificationPreferences: potentialGuest.notificationPreferences, 
            //   deviceToken: potentialGuest.deviceToken 
            // });
          } else {
            console.log("Not enough potential attendees within potential guests (of origin users) preferred radius, guest wallet address: ", potentialGuest.address);
          }
          potentialAttendeeCountForPossibleGuest = 0;

          ++k;
        }
        k = 0;
        // potentialGuestArray = [];

        if (potentialUserToNotifyArray.length === originUserNotificationPreferences.minPossibleAttendees) {

          console.log("Enough potential users have criteria sending push to possible attendee queue");
          console.log(`test`)
          // console.log(`test ${l}`) 

          l = 0
          while (l < potentialUserToNotifyArray.length) {

            const notifyingUser = potentialUserToNotifyArray[l];
            appleNotification.sendNotification(potentialUserToNotifyArray[i].deviceToken, "Enough Proof members are nearby, would you like to start a Hangout?");
            notifiedUserArray.push(notifyingUser);
            ++l;
          }
          l = 0;

          console.log("potential users to notify array")
          const potentialUserToNotifyAddressesArray = potentialUserToNotifyArray.map(a => a.address);
          console.log(`potential users to notify address array ${potentialUserToNotifyAddressesArray}`)
          originUsers = originUsers.filter(user => !potentialUserToNotifyAddressesArray.includes(user.address));
          console.log(`origin users array length after filtering: ${originUsers.length}`)
        } else {
          originUsers.shift(); // Remove Origin User from Origin Array
        }
      } else {
        console.log(`Potential Users does not meet for ${originUser.address}`);
        originUsers.shift(); // Remove Origin User from Origin Array

      }

      console.log("Potential user to notify array and potential guest arrays reset")
      potentialUserToNotifyArray = []; // Empty users to notify array
      potentialGuestArray = []; // Empty Potential Guests for next Origin User
    }


    notifiedUserArray = [...new Map(notifiedUserArray.map(item =>
      [item.address, item])).values()];
    console.log("Notified Users Array Length", notifiedUserArray.length);

    l = 0;
    while (l < notifiedUserArray.length) {
      originUser = notifiedUserArray[l];
      appleNotification.sendNotification(user.deviceToken, "Enough Proof members are nearby, would you like to start a Hangout?");
      ++l;
    }
    notifiedUserArray = notifiedUserArray.map(a => a.address);
    console.log(`notified user array: ${notifiedUserArray}`);

    return {
      status: 200,
      data: {
        message: "All Users Completed",
        totalUsers: usersWithLocation.length
      }
    };
  };

  return Object.freeze({
    sendHangoutPromptNotification
  });
};
