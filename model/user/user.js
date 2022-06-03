module.exports = ({ validate }) => {
  return (args) => {
    try {
      validate(args);

      return Object.freeze({
        getAddress: () => args.address,
        getHasProof: () => args.hasProof,
        getHasMoonBird: () => args.hasMoonbird,
        // getNewColumn: () => args.newColumn,
      });
    } catch (error) {
      throw error;
    }
  };
};
