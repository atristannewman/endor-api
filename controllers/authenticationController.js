/* eslint-disable no-useless-catch */
// const geolib = require("geolib");
// const { sendMagicLinkToEmail } = require('../services/mailgunService');
const { generateToken } = require('../utils/tokenGenerator');
// const MagicLink = require('../databases/postgres/entity/magicLink');
const MagicLink = require('../models/magiclink');  // Adjust path as necessary


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
      const token = generateToken();
      const expiresAt = new Date(Date.now() + 3600000) // Token expires in 1 hour
      const magicLinkUrl = `https://flockapp.xyz/magic-link?token=${token}`;
      const magicLink = await DB.MagicLink.create({
        email,
        token,
        expires_at: expiresAt,
      })

      // Save the token in the database
      // await MagicLink.create({
      //   email,
      //   token,
      //   expires_at: expiresAt,
      // });

      // Send the magic link via email
      // await emailAuthenticationService.sendMagicLinkToEmail(email, magicLink);
      console.log("authenticationController ln 76 error")
      return {
        status: 200,
        data: {
          magicLink
        }
      };
    } catch (error) {
      console.log("authenticationController ln 84 error")
      console.error('Error sending magic link:', error);
      return {
        status: 500,
        data: { error: 'Failed to send magic link' }
      };
    }
  };

  const verifyMagicLink = async (httpRequest) => {
    try {
      const magicLink = await MagicLink.findOne({ where: { token } });

      if (!magicLink || new Date() > magicLink.expires_at) {
        return {
          status: 400,
          data: { error: 'Invalid or expired token' }
        };
      }

      // Token is valid, proceed with authentication or other logic
      return {
        status: 200,
        data: { email: magicLink.email }
      };
    } catch (error) {
      console.error('Error verifying magic link:', error);
      return {
        status: 500,
        data: { error: 'Failed to verify magic link' }
      };
    }
  }

  return Object.freeze({
    createTokenproofAddress,
    getTokenproofWalletForNonce,
    sendMagicLink,
    verifyMagicLink,
  });
};
