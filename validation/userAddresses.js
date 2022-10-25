const Joi = require("joi");

const schema = Joi.object({
    addresses: Joi.array().items(Joi.string()).required(),
});

exports.userAddressesValidate = (args) => {
    return Joi.attempt(args, schema, "Failed parameter validation for User Addresses");
};
