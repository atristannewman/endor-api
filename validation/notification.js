const Joi = require("joi");
const Notification = require("./notification.js")

const schema = Joi.object({
  topic: Joi.string().required(),
  deviceTokenQueue: Joi.array().allow('').items(Joi.string()),
  subscriberDeviceTokens: Joi.array().allow('').items(Joi.string())
});

exports.validate = (args) => {
    console.log(`validating notification`)
    console.log(`args ln 12 notification.js validation ${JSON.stringify(args)}`)
    console.log(`schema.validate(args) ln 12 notification.js validation ${JSON.stringify(schema.validate(args))}`)
  return schema.validate(args);
};