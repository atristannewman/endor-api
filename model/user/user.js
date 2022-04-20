module.exports = ({ validate }) => {
  return (args) => {
    try {
      validate(args);

      return Object.freeze({
        getAddress: () => args.address,
        getHasProof: () => args.hasProof,
        getHasMoonBird: () => args.hasMoonbird,
      });
    } catch (error) {
      throw error;
    }
  };
};
