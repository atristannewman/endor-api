const Joi = require("joi");
const { FLOAT } = require("sequelize");

const schema = Joi.object({
  auth0Id: Joi.string().required(),
  walletAddresses: Joi.array().optional().empty(Joi.array().length(0)),
  hasProof: Joi.boolean().required(),
  hasMoonbird: Joi.boolean().required(),
  username:Joi.string().optional(),
  hostRating:Joi.number().optional(),
  profileImageUrl:Joi.string().optional(),
  deviceToken: Joi.string().optional().allow('null',null),
  username:Joi.string().required(),
  hostRating:Joi.number().required(),
  profileImageUrl:Joi.string().optional(),
  location: Joi.object({
    latitude: Joi.number().required().allow('null',null,''),
    longitude: Joi.number().required().allow('null',null,'')
  }).optional().allow('','null',null),
  notificationPreferences: Joi.object({
    minHostRating: Joi.number().required(),
    minPossibleAttendees: Joi.number().required(),
    distanceFromPossibleAttendees: Joi.number().required()
  }).optional().allow('','null',null),
  NFTs: Joi.array().items(Joi.object({
    logoUrl: Joi.string().required(),
    ethFloorPrice: Joi.number().required(),
    name: Joi.string().required(),
    contractAddress: Joi.string().required()
  })).required()
});

exports.validate = (args) => {
  return Joi.attempt(args, schema, "Failed parameter validation for User");
};
