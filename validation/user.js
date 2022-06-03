const Joi = require("joi");

const schema = Joi.object({
  address: Joi.string().required(),
  hasProof: Joi.boolean().required(),
  hasMoonbird: Joi.boolean().required(),
  // newColumn: Joi.string().required(),
});

exports.validate = (args) => {
  return Joi.attempt(args, schema, "Failed parameter validation for User");
};
