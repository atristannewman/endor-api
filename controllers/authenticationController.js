/* eslint-disable no-useless-catch */
const { generateToken } = require('../utils/tokenGenerator');


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

      // Send the magic link via email
      await emailAuthenticationService.sendMagicLinkToEmail(email, magicLinkUrl);

      return {
        status: 200,
        data: {
          magicLink
        }
      };
    } catch (error) {
      console.error('Error sending magic link:', error);
      return {
        status: 500,
        data: { error: 'Failed to send magic link' }
      };
    }
  };

  const verifyMagicLink = async (httpRequest) => {
    const { token } = httpRequest.query
    if (!token) {
      return {
        status: 400,
        data: { error: 'Token is required' },
      };
    }

    try {
      console.log('Verifying magic link with token: ', token);
      // const magicLink = await DB.MagicLink.findByToken(token)
      const magicLink = await DB.MagicLink.findOne({ where: { token } });
      console.log('Verifyied token with magicLink: ', magicLink);

      if (!magicLink || new Date() > magicLink.expires_at) {
        return {
          status: 400,
          data: { error: 'Invalid or expired token' }
        };
      }

      // Generate a new token for the user's session
      // const userToken = generateToken(magicLink.email)

      // Set the token in the user's session (this example uses a cookie)
      // httpRequest.res.cookie('userToken', userToken, { httpOnly: true, secure: true });

      // Optionally delete the magic link after use
      await DB.MagicLink.deleteById(magicLink.id);

      return {
        status: 200,
        data: { message: 'Device verified and user token set', token: userToken },
      };
    } catch (error) {
      console.error('Error verifying magic link:', error);
      return {
        status: 500,
        data: { error: 'Failed to verify magic link' },
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
