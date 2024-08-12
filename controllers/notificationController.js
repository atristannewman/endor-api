const appleNotification = require("../services/appleNotificationService");
const geolib = require("geolib");
const { INTEGER } = require("sequelize");
const user = require("../models/user");
const requestHandler = require("../requestHandler");

module.exports.setNotificationToken = function (req, res, next) {
  const user = req.user;
  user.apn_token = req.body.token;
  user.save(function (err) {
    if (err) { return next(err); }
    return res.json({ success: "true" });
  });
};

// module.exports.

module.exports = ({ DB }) => {

  const createNotificationQueueForHangout = function (notification) {
    DB.Notification.create(notification)
  };

  const createNotificationQueue = async (httpRequest) => {
    try{
      console.log(`httpRequest ${JSON.stringify(httpRequest)}`)
      const {topic, deviceTokenQueue, subscriberDeviceTokens, topicId} = httpRequest.body
      console.log(`httpRequest.body ${JSON.stringify(httpRequest.body)}`)
      createNotificationQueueForHangout({
        topic,
        deviceTokenQueue,
        subscriberDeviceTokens,
        topicId
      })

      const notifications = await DB.Notification.findAll()

      return {
        status: 200,
        notifications
      }
    } catch (error) {
      throw error;
    }   
  }

  const getNotificationQueues = async () => {
    try{
      const notifications = await DB.Notification.findAll();
      console.log(`notifications ${JSON.stringify(notifications)}`)

      return {
        status: 200,
        data: {
          notifications
        }
      };
    } catch (error) {
      throw error;
    }   
  }

  const addNotificationSubscriber = async ({query, body}) => {
    try{
      let deviceToken = ""
      console.log(`query ${JSON.stringify(query)}`)

      if (query.queuer) {
        throw("Must send subscriber to update instead of queuer")
      }

      await DB.Notification.addSubscriberWithTopicAndId({
        topic: body.topic,
        topicId: body.topicId,
        subscriber: query["subscriber"]
      }).then((notification) => {
        if (notification.subscriberDeviceTokens.includes(query["subscriber"])) {
          deviceToken = query["subscriber"]
        }
      })

      return {
        status: 200,
        data: {
          deviceToken,
          message: "added subscriber to notification"
        }
      };
    } catch (error) {
      throw error;
    }   
  }

  const removeNotificationSubscriber = async ({query, body}) => { 
    try{
      let deviceToken = ""
      console.log(`query ${JSON.stringify(query)}`)

      if (query.queuer) {
        throw("Must send subscriber to update instead of queuer")
      }

      await DB.Notification.removeSubscriberWithTopicAndId({
        topic: body.topic,
        topicId: body.topicId,
        subscriber: query["subscriber"]
      }).then((subscribedToken) => {
        deviceToken = query["subscriber"]
      })

      return {
        status: 200,
        data: {
          deviceToken,
          message: "removed subscriber from notification"
        }
      };
    } catch (error) {
      throw error;
    }
  }

  const queueNotificationSubscribers = async ({query, body}) => { 
    try{
      console.log(`query ${JSON.stringify(query)}`)

      await DB.Notification.refreshQueueWithTopicAndId({
        topic: body.topic,
        topicId: body.topicId,
        notifier: query["notifier"]
      })

      return {
        status: 200,
        data: {
          message: `${body.topic} ${body.topicId} notification queue refreshed`
        }
      };
    } catch (error) {
      throw error;
    }
  }

  const notifyQueue = async ({body}) => {
    try {
      console.log(`notify by topic: ${JSON.stringify(body.topic)}, topicId: ${JSON.stringify(body.topicId)}}`);
  
      var notification = await DB.Notification.findByTopicAndId({
          topic: String(body.topic),
          topicId: String(body.topicId)
      });

      // Build the push message
      let notificationMessage = null
      switch (body.topic) {
        case "chat":
          notificationMessage = "New message in Hangout Chat"
      }
      
      // Build the push payload
      const notificationPayload = {
        topic: body.topic,
        topicId: body.topicId
      }

      // Creates encryption key
      let decryptionKeyArray = process.env.DEVICE_TOKEN_ENCRYPTION_KEY.split(',');
      console.log(`decryptionKeyArray ${decryptionKeyArray}`)
      let decryptionKey = {};
      decryptionKeyArray.forEach((item) => {
        let itemArray = item.split(':');
        console.log(`itemArray ${itemArray}`)
        decryptionKey[itemArray[0]] = itemArray[1];
      })
      console.log(`decryptionKey ${JSON.stringify(decryptionKey)}`)
  
      // Go through all encrypted tokens in queue..
      // notification.deviceTokenQueue.forEach((token) => {
      let deviceQueue = notification.deviceTokenQueue

      // Notify queued devices
      deviceQueue.forEach((token) => {
        console.log(`token ${token}`)
        // Encrypt device tokens
        const deviceTokenArray = token.split(":")
        console.log(`deviceTokenArray ${deviceTokenArray}`)
        const decryptedDeviceToken = deviceTokenArray.map((char) => {return decryptionKey[char]}).join("")
        console.log(`decryptedDeviceToken ${decryptedDeviceToken}`)
        appleNotification.sendNotification(decryptedDeviceToken, notificationMessage, notificationPayload)

        return notification
      })
      
      const {topic, topicId} = notification
      const notified = []

      DB.Notification.removeNotifiedFromQueue({topic, topicId, notified})

      return {
        status: 200,
        data: {
          message: `${body.topic} ${body.topicId} notification queue notified`
        }
      };
      
    } catch (error) {
      console.log(`error queue failed to be notified ${error}`);
      throw error;
    }
  };

  const getSubscriberNotificationsForTopic = async ({query, body}) => {
    try{
      const subscriberToken = query["subscriber"]
      const topic = query["topic"]
      const notifications = await DB.Notification.findAll();
      let subscribedNotifications = notifications.filter((notification) => {
        return notification.subscriberDeviceTokens.includes(subscriberToken) &&
        notification.topic === topic
      }).map(({topic, topicId}) => {
        return {
          topic,
          topicId,
          subscriberToken
        }
      })

      return {
        status: 200,
        data: {
          notifications: subscribedNotifications
        }
      };
    } catch (error) {
      throw error;
    }   
  }

  const sendHangoutPromptNotificationOld = async (httpRequest) => { // Test Api
    const usersByLocation = await DB.User.findAllWithLocation({ raw: true });
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
        if (distance <= preferredDistanceFromPossibleAttendees) {
          array.push({ address: users[i].address, 
            location: users[i].location, 
            notificationPreferences: users[i].notificationPreferences 
          });
        }
        ++i;
      }

      if (array.length >= (notificationPreferences.minPossibleAttendees - 1)) {
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

    let h = 0;
    while (h < originUsers.length) {
      users = usersWithLocation;
      originUser = originUsers[h]; // Zero index Origin user
      users = users.filter(function (element) { // Need to filter out Origin User from Potential User Search
        return originUser.address !== element.address;
      });

      location = originUser.location;
      originUserNotificationPreferences = originUser.notificationPreferences;
      preferredDistanceFromPossibleAttendees = originUserNotificationPreferences.distanceFromPossibleAttendees;

      // For all users within the origin users preferred travel radius
      let i = 0;
      while (i < users.length) {
        let distanceFromPotentialGuestUser = geolib.getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: users[i].location.latitude, longitude: users[i].location.longitude },
          0.1
        );

        distanceFromOtherUser = geolib.convertDistance(distanceFromPotentialGuestUser, "mi");
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



      // For possible attendees requirement met
      if (potentialGuestArray.length + 1 >= (originUserNotificationPreferences.minPossibleAttendees)) {
        
        potentialUserToNotifyArray.push({ 
          address: originUser.address, 
          location: originUser.location, 
          notificationPreferences: originUser.notificationPreferences, 
          deviceToken: originUser.deviceToken 
        }); // Add Origin User to potential user to notify Array
        
        
        // Iterates through potential guests
        let k = 0; 
        while (k < potentialGuestArray.length) {
          potentialGuest = potentialGuestArray[k];
          potentialGuestNotificationPreferences = potentialGuest.notificationPreferences;
          potentialGuestPreferredDistanceFromPossibleAttendees = potentialGuestNotificationPreferences.distanceFromPossibleAttendees;
          
          let l = 0; 
          let potentialAttendeeCountForPossibleGuest = 0; // of origin user
          while (l < users.length) { // Iterate for each potential guest found for Origin User
            let distanceFromPotentialGuestToPossibleAttendee = geolib.getDistance(
              { latitude: potentialGuest.location.latitude, longitude: potentialGuest.location.longitude },
              { latitude: users[l].location.latitude, longitude: users[l].location.longitude },
              0.1
            );

            distanceFromPotentialGuestToPossibleAttendee = geolib.convertDistance(distanceFromPotentialGuestToPossibleAttendee, "mi");
            if (distanceFromPotentialGuestToPossibleAttendee <= potentialGuestPreferredDistanceFromPossibleAttendees) {
              ++potentialAttendeeCountForPossibleGuest; // No need of array just keep count of attendees for potential user
            }
            ++l;
          }
          l = 0;

          // At this point distance from origin user and number of minimum preferred 
          // attendees has been accounted for

          const minimumAttendeesForGuest = potentialGuestNotificationPreferences.minPossibleAttendees - 1; //For
          if (potentialAttendeeCountForPossibleGuest >= minimumAttendeesForGuest) {
            potentialUserToNotifyArray.push({ 
              address: potentialGuest.address, 
              location: potentialGuest.location, 
              notificationPreferences: potentialGuest.notificationPreferences, 
              deviceToken: potentialGuest.deviceToken 
            });
          } else {
            console.log("Not enough potential attendees within potential guests (of origin users) preferred radius, guest wallet address: ", potentialGuest.address);
          }
          potentialAttendeeCountForPossibleGuest = 0;

          ++k;
        }
        k = 0;

        if (potentialUserToNotifyArray.length === originUserNotificationPreferences.minPossibleAttendees) {

          console.log("Enough potential users have criteria sending push to possible attendee queue");

          l = 0
          while (l < potentialUserToNotifyArray.length) {

            const promptHangoutPayload = {
              "navigation": "goToAddHangout"
            }
            const notifyingUser = potentialUserToNotifyArray[l];
            appleNotification.sendNotification(potentialUserToNotifyArray[i].deviceToken, "Enough Proof members are nearby, would you like to start a Hangout?", promptHangoutPayload);
            notifiedUserArray.push(notifyingUser);
            ++l;
          }
          l = 0;

          const potentialUserToNotifyAddressesArray = potentialUserToNotifyArray.map(a => a.address);
          originUsers = originUsers.filter(user => !potentialUserToNotifyAddressesArray.includes(user.address));
        } else {
          originUsers.shift(); // Remove Origin User from Origin Array
        }
      } else {
        originUsers.shift(); // Remove Origin User from Origin Array

      }

      potentialUserToNotifyArray = []; // Empty users to notify array
      potentialGuestArray = []; // Empty Potential Guests for next Origin User
    }


    notifiedUserArray = [...new Map(notifiedUserArray.map(item =>
      [item.address, item])).values()];

    l = 0;
    while (l < notifiedUserArray.length) {
      originUser = notifiedUserArray[l];
      appleNotification.sendNotification(user.deviceToken, "Enough Proof members are nearby, would you like to start a Hangout?");
      ++l;
    }
    notifiedUserArray = notifiedUserArray.map(a => a.address);

    return {
      status: 200,
      data: {
        message: "All Hangout prompt notification check completed",
        totalUsersNotified: notifiedUserArray.length
      }
    };
  };

  return Object.freeze({
    sendHangoutPromptNotification,
    getNotificationQueues,
    createNotificationQueue,
    addNotificationSubscriber,
    removeNotificationSubscriber,
    queueNotificationSubscribers,
    notifyQueue,
    getSubscriberNotificationsForTopic,
    createNotificationQueueForHangout
  });
};
