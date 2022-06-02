const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().optional(),
  host: Joi.string().required(),
  tags: Joi.array().optional()
});

exports.validate = (args) => {
  return Joi.attempt(args, schema, "Failed parameter validation for Vendor");
};
