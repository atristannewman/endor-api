module.exports = ({ validate }) => {
  return (args) => {
    try {
      // validate(args); // TODO: Bugged

      return Object.freeze({
        getWalletAddress: () => args.walletAddress,
        getNonce: () => args.nonce
      });
    } catch (error) {
      throw error;
    }
  };
};