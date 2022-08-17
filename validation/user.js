const Joi = require("joi");

const schema = Joi.object({
  address: Joi.string().required(),
  hasProof: Joi.boolean().required(),
  hasMoonbird: Joi.boolean().required(),
  username:Joi.string().required(),
  hostRating:Joi.number().required(),
  profileImageUrl:Joi.string().optional(),
  location: [Joi.object({
    latitude:Joi.number().required(),
    longitude:Joi.number().required()
  }).optional(),Joi.string().allow('null')],
});

exports.validate = (args) => {
  return Joi.attempt(args, schema, "Failed parameter validation for User");
};
