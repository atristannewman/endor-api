/* eslint-disable no-useless-catch */
const Sequelize = require("sequelize");
const db = require("../sequelize");
const makeTokenproofAddress = require("../../../model/tokenproofAddress");
const { userAddressValidate } = require("../../../validation/userAddress.js");

const TokenproofAddress = db.define(
    "tokenproofAddress",
    {
      walletAddress: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nonce: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      }
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

module.exports = Object.freeze({
    TokenproofAddress,
    create
})