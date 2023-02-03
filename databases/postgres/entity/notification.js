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

const updateByTopic = async (topic, args) => {
  try {
    console.log(`update by topic: ${topic}, args: ${args}`);
    return await Notification.upsert({
        topic,
        deviceTokenQueue: args.deviceTokenQueue,
        subscriberDeviceTokens: args.subscriberDeviceTokens,
        topicId: args.topicId
    });
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
  updateByTopic,
  deleteByTopic,
  findAll,
  findByTopic
});