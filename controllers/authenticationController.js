/* eslint-disable no-useless-catch */
// const geolib = require("geolib");


module.exports = ({ DB }) => {
  const createTokenproofAddress = async (httpRequest) => {
    try {
      console.log(`authenticationController.js ln 7 httpRequest.body ${JSON.stringify(httpRequest.body)}`)
      const nonce = httpRequest.body.nonce
      const walletAddress = httpRequest.body.account

      const tokenproofAddress = {
        nonce,
        walletAddress
      }

      DB.TokenproofAddress.create(tokenproofAddress);

      return {
        status: 200,
        data: {
          message: "tokenproof address created"
        }
      };
    } catch (error) {
      throw error;
    }
  };

  return Object.freeze({
    createTokenproofAddress
  });
};
