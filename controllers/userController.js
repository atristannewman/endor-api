module.exports = ({ transactionService, DB }) => {
  const getProfile = async (httpRequest) => {
    try {
      const { address } = httpRequest.query;
      const PROOF_COLLECTIVE_PASS_ADDRESS = "0x08d7c0242953446436f34b4c78fe9da38c73668d";
      const { data } = await transactionService.checkProofTokenExist(
        PROOF_COLLECTIVE_PASS_ADDRESS
      );
      const { result } = data;

      const profile = {
        address: address,
        hasProof: false,
        hasMoonbird: false,
      };

      if (result && result.length) {
        const lowerCaseAddress = address.toLowerCase();
        const exist = result.filter(
          (token) => token.owner_of === lowerCaseAddress
        );

        if (exist) {
          profile.hasProof = true;
        }
      }

      let user = await DB.User.findByAddress(address);

      if (!user) {
        user = await DB.User.create(profile);
      }

      return {
        status: 200,
        data: {
          profile: { ...profile },
        },
      };
    } catch (error) {
      throw error;
    }
  };

  return Object.freeze({
    getProfile,
  });
};
