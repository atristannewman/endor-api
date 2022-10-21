const Joi = require("joi");
const { FLOAT } = require("sequelize");

const schema = Joi.object({
  auth0Id: Joi.string().required(),
  address: Joi.string().required(),
  hasProof: Joi.boolean().required(),
  hasMoonbird: Joi.boolean().required(),
  username:Joi.string().optional(),
  hostRating:Joi.number().optional(),
  profileImageUrl:Joi.string().optional(),
  deviceToken: Joi.string().optional().allow('null',null),
  username:Joi.string().required(),
  hostRating:Joi.number().required(),
  profileImageUrl:Joi.string().optional(),
  location: Joi.object({
    latitude: Joi.number().required().allow('null',null,''),
    longitude: Joi.number().required().allow('null',null,'')
  }).optional().allow('','null',null),
  notificationPreferences: Joi.object({
    minHostRating: Joi.number().required(),
    minPossibleAttendees: Joi.number().required(),
    distanceFromPossibleAttendees: Joi.number().required()
  }).optional().allow('','null',null)
});

exports.validate = (args) => {
  return Joi.attempt(args, schema, "Failed parameter validation for User");
};
