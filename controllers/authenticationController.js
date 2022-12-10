/* eslint-disable no-useless-catch */
// const geolib = require("geolib");


module.exports = ({ DB }) => {
  const createTokenproofAddress = async (httpRequest) => {
    try {
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

  const getTokenproofWalletForNonce = async (httpRequest) => {
    try {
      const {nonce} = httpRequest.query
      const walletAddress = await DB.TokenproofAddress.findByNonce(nonce)

      return {
        status: 200,
        data: {
          walletAddress
        }
      };
    } catch (error) {
      throw error;
    }
  };

  return Object.freeze({
    createTokenproofAddress,
    getTokenproofWalletForNonce
  });
};
