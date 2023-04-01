/* eslint-disable no-useless-catch */
module.exports = ({ validate }) => {
  return (args) => {
    try {
      console.log('validating user');
      validate(args);

      return Object.freeze({
        getAuth0Id: () => args.auth0Id,
        getWalletAddresses: () => args.walletAddresses,
        getHasProof: () => args.hasProof,
        getHasMoonBird: () => args.hasMoonbird,
        getUsername: () => args.username,
        getHostRating: () => args.hostRating,
        getProfileImageUrl: () => args.profileImageUrl,
        getNotificationPreferences: () =>
          args.notificationPreferences === 'null'
            ? null
            : args.notificationPreferences,
        getLocation: () => (args.location === 'null' ? null : args.location),
        getDeviceToken: () => args.deviceToken,
        getNFTs: () => args.NFTs,
        getBlockedUserIds: () => args.blockedUserIds,
        getAvailabilityStatus: () => args.availabilityStatus,
        availabilityLastModifiedDate: () => args.availabilityLastModifiedDate,
      });
    } catch (error) {
      throw error;
    }
  };
};
