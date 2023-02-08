/* eslint-disable no-useless-catch */
const Sequelize = require("sequelize");
const db = require("../sequelize");
const makeNotification = require("../../../model/notification");

const Notification = db.define("notifications", {
    topic: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: false,
      allowNull: false
    },
    topicId: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: false,
      allowNull: false
    },
    deviceTokenQueue: {
      type: Sequelize.ARRAY({
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      }),
      defaultValue: []
    },
    subscriberDeviceTokens: {
      type: Sequelize.ARRAY({
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      }),
      defaultValue: []
    }
  },{
    timestamps: false
});

const create = async (args) => {
  console.log("notification entity ln 40")
  const notificationInstance = makeNotification(args);
  try {
    console.log("make notification");
    return await Notification.create({
      topic: notificationInstance.getTopic(),
      deviceTokenQueue: notificationInstance.getDeviceTokenQueue(),
      subscriberDeviceTokens: notificationInstance.getSubscriberDeviceTokens(),
      topicId: notificationInstance.getTopicId()
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findAll = async () => {
  try {
    console.log("find all notification queues")
    const notificationQueues = await Notification.findAll();
    console.log(`notificationQueues ${JSON.stringify(notificationQueues)}`)
    return notificationQueues
  } catch (error) {
    throw error;
  }
};

const findByTopic = async (topic) => {
  try {
    return await Notification.findOne({
      where: {
        topic
      }
    });
  } catch (error) {
    console.log(`error in notification find by topic: ${error}`);
    throw error;
  }
};

const addSubscriberWithTopicAndId = async ({topic, topicId, subscriber}) => {
  try {
    console.log(`update by topic: ${JSON.stringify(topic)}, topicId: ${JSON.stringify(topicId)}, subscriber: ${JSON.stringify(subscriber)}`);

    let notification = await Notification.findOne({
      where: {
        topic: String(topic),
        topicId: String(topicId)
      }
    });

    if (subscriber) {
      let newDeviceTokens = notification.subscriberDeviceTokens.filter((token) =>{
        return token != subscriber
      })
      newDeviceTokens.push(subscriber)
      console.log(`${Array.isArray(newDeviceTokens)}`)

      return await notification.update({
        subscriberDeviceTokens: newDeviceTokens
      });
    } else {
      throw("no subscriber token sent")
    }
    
  } catch (error) {
    console.log(`error in notification update: ${error}`);
    throw error;
  }
};

const removeSubscriberWithTopicAndId = async ({topic, topicId, subscriber}) => {
  try {
    console.log(`update by topic: ${JSON.stringify(topic)}, topicId: ${JSON.stringify(topicId)}, subscriber: ${JSON.stringify(subscriber)}`);

    let notification = await Notification.findOne({
      where: {
        topic: String(topic),
        topicId: String(topicId)
      }
    });

    if (subscriber) {
      let newSubscribersDeviceTokens = notification.subscriberDeviceTokens.filter((token) =>{
        return token != subscriber
      })

      let newQueueDeviceTokens = notification.deviceTokenQueue.filter((token) =>{
        return token != subscriber
      })

      return await notification.update({
        subscriberDeviceTokens: newSubscribersDeviceTokens,
        deviceTokenQueue: newQueueDeviceTokens
      });
    } else {
      throw("no subscriber token sent")
    }
    
  } catch (error) {
    console.log(`error in notification update: ${error}`);
    throw error;
  }
};

const deleteByTopic = async (topic, topicId) => {
  try {
    Notification.destroy({
      where: {
        topicId, 
        topic
      }
    });
  } catch (error) {
    throw error;
  }
};

module.exports = Object.freeze({
  Notification,
  create,
  addSubscriberWithTopicAndId,
  deleteByTopic,
  findAll,
  findByTopic,
  removeSubscriberWithTopicAndId
});