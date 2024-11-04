/* eslint-disable no-useless-catch */
module.exports = () => {
    return (args) => {
      try {
        return Object.freeze({
          uuid: args.uuid,
          email: args.email,
          token: args.token,
          expires_at: args.expires_at,
        });
      } catch (error) {
        throw error;
      }
    };
};