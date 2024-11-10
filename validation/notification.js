const Joi = require("joi");
const Notification = require("./notification.js")

const schema = Joi.object({
  topic: Joi.string().required(),
  deviceTokenQueue: Joi.array().allow('').items(Joi.string()),
  subscriberDeviceTokens: Joi.array().allow('').items(Joi.string()),
  topicId: Joi.string().required()
});

exports.validate = (args) => {
  console.log("validating create notification args")
  return schema.validate(args);
};