/* eslint-disable no-useless-catch */
//In Use
const config = require('../config');
//In Use

// In Use
module.exports = ({ DB }) => {
  // In Use
  const stytch = require("stytch");
  const stytchClient = new stytch.Client({
    project_id: config.services.stytch.projectId,
    secret: config.services.stytch.secret,
  });
  // In Use

 //In Use
  const createMagicLink = async (http) => {
    try {
      const { email } = http.body;

      console.log("authentication controller file cleaned")
      const resp = await stytchClient.magicLinks.email.loginOrCreate({email});
      resp.status = 200
      resp.message = "Magic link sent successfully"
      return resp

    } catch (error) {
      console.error("Error creating magic link:", error);
      throw error;
    }
  };
  // In Use

  const authenticateMagicLink = async (httpRequest) => {
    const { token } = httpRequest.query;

    const client = new stytch.Client({
      project_id: config.services.stytch.projectId,
      secret: config.services.stytch.secret,
    });


    await stytchClient.magicLinks
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
    createMagicLink,
    authenticateMagicLink
  });
};
