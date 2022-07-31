const Joi = require("joi");

const schema = Joi.object({
  address: Joi.string().required(),
  hasProof: Joi.boolean().required(),
  hasMoonbird: Joi.boolean().required(),
  username:Joi.string().optional(),
  hostRating:Joi.number().optional(),
  profileImageUrl:Joi.string().optional(),
  deviceToken: Joi.string().optional()
});

exports.validate = (args) => {
  return Joi.attempt(args, schema, "Failed parameter validation for User");
};
