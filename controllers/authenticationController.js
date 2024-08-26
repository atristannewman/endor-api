/* eslint-disable no-useless-catch */
// const geolib = require("geolib");


module.exports = ({ DB }) => {
  const stytch = require("stytch");
  const stytchClient = new stytch.Client({
    project_id: process.env.STYTCH_TEST_PROJECT_ID,
    secret: process.env.STYTCH_TEST_SECRET,
  });

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

  const createMagicLink = async (httpRequest) => {
    try {
      const { email } = httpRequest.body;
      const resp = await stytchClient.magicLinks.email.loginOrCreate({email});
      console.log("creating magic")
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
      project_id: process.env.STYTCH_TEST_PROJECT_ID,
      secret: process.env.STYTCH_TEST_SECRET,
    });

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
