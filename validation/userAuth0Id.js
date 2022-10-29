const Joi = require("joi");

const schema = Joi.object({
    auth0Id: Joi.string().required(),
});

exports.userAuth0IdValidate = (args) => {
    return Joi.attempt(args, schema, "Failed parameter validation for User Auth0 Id");
};