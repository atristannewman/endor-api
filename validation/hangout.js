const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional()
});

exports.validate = (args) => {
  return schema.validate(args);
};