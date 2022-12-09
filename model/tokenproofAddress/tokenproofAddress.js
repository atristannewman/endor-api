module.exports = ({ validate }) => {
  return (args) => {
    try {
      console.log(`tokenproofWalletAddresses.js ln 4 args.address ${JSON.stringify(args.walletAddress)}`)
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