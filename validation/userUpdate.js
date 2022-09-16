const Joi = require("joi");

const schema = Joi.object({
  hasProof: Joi.boolean().optional(),
  hasMoonbird: Joi.boolean().optional(),
  username: Joi.string().required(),
  hostRating: Joi.number().optional(),
  profileImageUrl: Joi.string().optional(),
  notificationPreferences: Joi.object({
    minHostRating: Joi.number().required(),
    minPossibleAttendees: Joi.number().required(),
    distanceFromPossibleAttendees: Joi.number().required()
  }).optional().allow('','null',null),
  deviceToken: Joi.string().required().allow('null',null,''),
  location: Joi.object({
    latitude:Joi.number().required().allow('null',null,''),
    longitude:Joi.number().required().allow('null',null,'')
  }).optional().allow('','null',null),
});

exports.userUpdateValidate = (args) => {
  return Joi.attempt(args, schema, "Failed parameter validation for User");
};
