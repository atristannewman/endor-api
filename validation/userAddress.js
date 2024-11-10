const Joi = require("joi");

const schema = Joi.object({
    address: Joi.string().required(),
});

exports.userAddressValidate = (args) => {
    return Joi.attempt(args, schema, "Failed parameter validation for User Address");
};
