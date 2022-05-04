const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  isActive: Joi.boolean().required(),
  accessUrl: Joi.string().optional(),
});

exports.validate = (args) => {
  return Joi.attempt(args, schema, "Failed parameter validation for Vendor");
};
