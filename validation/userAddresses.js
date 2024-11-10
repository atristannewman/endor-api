const Joi = require("joi");

const schema = Joi.object({
    walletAddresses: Joi.array().optional().empty(Joi.array().length(0)),
});

exports.userAddressesValidate = (args) => {
    return Joi.attempt(args, schema, "Failed parameter validation for User Addresses");
};
