/* eslint-disable no-useless-catch */
const { generateToken } = require('../utils/tokenGenerator');
const config = require('../config');


module.exports = ({ DB }) => {
  const stytch = require("stytch");
  console.log("config.services.stytch", config.services.stytch)
  const stytchClient = new stytch.Client({
    project_id: config.services.stytch.projectId,
    secret: config.services.stytch.secret,
  });
  console.log("stytchClient", stytchClient)

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

  const createMagicLink = async (http) => {
    try {
      const { email } = http.body;
      console.log("config.services.stytch", config.services.stytch)

      const resp = await stytchClient.magicLinks.email.loginOrCreate({email});
      resp.status = 200
      resp.message = "Magic link sent successfully"
      return resp

    } catch (error) {
      console.error("Error creating magic link:", error);
      throw error;
    }
  };

  const authenticateMagicLink = async (httpRequest) => {
    const { token } = httpRequest.query;

    const client = new stytch.Client({
      project_id: config.services.stytch.projectId,
      secret: config.services.stytch.secret,
    });

    console.log("stytch client", client)

    const response = await client.magicLinks
    .authenticate(token)
    .then((response) => {
      return {
        status: 200,
        data: {
          message: "Magic link authenticated successfully",
          user: response.user,
        }
      };
    })
    .catch((error) => {
      return {
        status: 400,
        data: {
        message: "Magic link authentication failed",
        }
      };
    });
  }
  


  return Object.freeze({
    createTokenproofAddress,
    getTokenproofWalletForNonce,
    createMagicLink,
    authenticateMagicLink
  });
};
