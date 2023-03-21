const Joi = require('joi');
const User = require('./user.js');

const schema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  host: Joi.object({ User }).required(),
});

exports.validate = (args) => {
  return schema.validate(args);
};
