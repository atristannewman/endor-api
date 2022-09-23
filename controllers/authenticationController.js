/* eslint-disable no-useless-catch */
// const geolib = require("geolib");

module.exports = ({ DB }) => {
  const createTokenproofAuthentication = async (httpRequest) => {
    try {
      // const hangouts = await DB.Hangout.findAll();
      return {
        status: 200,
        data: {
          message: "looks like we made it"
        }
      };
    } catch (error) {
      throw error;
    }
  };

  return Object.freeze({
    createTokenproofAuthentication
  });
};
