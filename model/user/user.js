module.exports = ({ validate }) => {
  return (args) => {
    try {
      validate(args);

      return Object.freeze({
        getAddress: () => args.address,
        getHasProof: () => args.hasProof,
        getHasMoonBird: () => args.hasMoonbird,
        getUsername: ()=> args.username,
        getHostRating: ()=> args.hostRating,
        getProfileImageUrl:()=> args.profileImageUrl
      });
    } catch (error) {
      throw error;
    }
  };
};
