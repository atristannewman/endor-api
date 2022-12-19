/* eslint-disable no-useless-catch */
const Sequelize = require("sequelize");
const db = require("../sequelize");
const makeTokenproofAddress = require("../../../model/tokenproofAddress");
const { userAddressValidate } = require("../../../validation/userAddress.js");

const TokenproofAddress = db.define(
    "tokenproofAddresses",
    {
      walletAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nonce: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
    },
    {
      // don't add the timestamp attributes (updatedAt, createdAt)
      timestamps: false
    }
)

const create = async (args) => {
    const tokenproofAddressInstance = makeTokenproofAddress(args);

    try {

        return await TokenproofAddress.create({
          walletAddress: tokenproofAddressInstance.getWalletAddress(),
          nonce: tokenproofAddressInstance.getNonce()
        });
    } catch (error) {
    console.log(error);
    throw error;
    }
};

const findByNonce = async (args) => {
  try {
    const tokenproofAddress = await TokenproofAddress.findOne({
      where: {
        nonce: args
      }
    });

    return tokenproofAddress.walletAddress
  } catch (error) {
  console.log(error);
  throw error;
  }
};

module.exports = Object.freeze({
    TokenproofAddress,
    create,
    findByNonce
})