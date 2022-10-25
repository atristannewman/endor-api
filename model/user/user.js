/* eslint-disable no-useless-catch */
module.exports = ({ validate }) => {
  return (args) => {
    try {
      validate(args);

      return Object.freeze({
        getAuth0Id: () => args.auth0Id,
        getAddresses: () => args.addresses,
        getHasProof: () => args.hasProof,
        getHasMoonBird: () => args.hasMoonbird,
        getUsername: () => args.username,
        getHostRating: () => args.hostRating,
        getProfileImageUrl: () => args.profileImageUrl,
        getNotificationPreferences: () => args.notificationPreferences === "null" ? null : args.notificationPreferences,
        getLocation: () => args.location === "null" ? null : args.location,
        getDeviceToken: () => args.deviceToken
      });
    } catch (error) {
      throw error;
    }
  };
};
