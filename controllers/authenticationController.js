/* eslint-disable no-useless-catch */
// const geolib = require("geolib");


module.exports = ({ DB, emailAuthenticationService }) => {
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

  const sendMagicLink = async (httpRequest) => {
    const { email } = httpRequest.body;
    if (!email) {
      return {
        status: 400,
        data: { error: 'Email is required' }
      };
    }
  
    try {
      await emailAuthenticationService.sendMagicLinkToEmail(email);
      return {
        status: 200,
        data: { message: 'Magic link sent to your email' }
      };
    } catch (error) {
      console.error('Error sending magic link:', error);
      return {
        status: 500,
        data: { error: 'Failed to send magic link' }
      };
    }
  };

  return Object.freeze({
    createTokenproofAddress,
    getTokenproofWalletForNonce,
    sendMagicLink
  });
};
