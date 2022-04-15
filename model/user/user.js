module.exports = ({ validate }) => {
  return (args) => {
    try {
      validate(args);

      return Object.freeze({
        getAddress: () => args.address,
        getProof: () => args.proof,
        getMoonBird: () => args.moonbird,
      });
    } catch (error) {
      throw error;
    }
  };
};
