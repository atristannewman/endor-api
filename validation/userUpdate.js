const Joi = require("joi");

const schema = Joi.object({
  hasProof: Joi.boolean().optional(),
  hasMoonbird: Joi.boolean().optional(),
  username: Joi.string().required(),
  hostRating: Joi.number().optional(),
  profileImageUrl: Joi.string().optional(),
  notificationPreferences: Joi.object().optional(),
});

exports.userUpdateValidate = (args) => {
  return Joi.attempt(args, schema, "Failed parameter validation for User");
};
