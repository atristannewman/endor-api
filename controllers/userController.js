module.exports = ({ transactionService, DB }) => {
  const getProfile = async (httpRequest) => {
    try {
      const { address } = httpRequest.query;
      const response = await transactionService.getListOfTokensOfAddress(
        address
      );
      const { data } = response;
      const PROOF_COLLECTIVE_PASS_ADDRESS =
        "0x08d7c0242953446436f34b4c78fe9da38c73668d";
      const profile = {
        address: address,
        proof: false,
        moonbird: false,
      };

      if (data.tokens && data.tokens.length) {
        const exist = data.tokens.find(
          (token) => token.tokenInfo.address === PROOF_COLLECTIVE_PASS_ADDRESS
        );

        if (exist) {
          profile.proof = true;
        }
      }

      let result = await DB.User.findByAddress(address);

      if (!result) {
        result = await DB.User.create(profile);
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
