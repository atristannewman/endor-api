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
  const createUser = async (httpRequest) => {
    try {
      const { address, hasMoonbird, hasProof, username, hostRating, profileImageUrl } = httpRequest.body;
      const userAddress = await DB.User.findByAddress(address);
      const userUsername = await DB.User.findByUsername(username);
      if (userAddress) {
        return {
          status: 409,
          data: {
            message: 'User with that address already exists'
          }
        }
      }
      if (userUsername) {
        return {
          status: 409,
          data: {
            message: 'User with that username already exists'
          }
        }
      }
      const user = await DB.User.create({
        address, hasProof, hasMoonbird, username, hostRating, profileImageUrl
      })
      return {
        status: 200,
        data: {
          user
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (httpRequest) => {
    try {
      const { address, username, hostRating, profileImageUrl } = httpRequest.body;
      let user = await DB.User.findByAddress(address);
      if (!user) {
        return {
          status: 404,
          message: "User not found"
        }
      }
      
      const userUsername = await DB.User.findByUsername(username);
      if (userUsername) {
        return {
          status: 409,
          data: {
            message: 'User with that username aleady exists'
          }
        }

      }
      await DB.User.updateByAddress(address, {
        address,
        username,
        hostRating,
        profileImageUrl
      });

      user = await DB.User.findByAddress(address);
      return {
        status: 200,
        data: {
          user
        }
      }
    }
    catch (error) {
      throw error;
    }
  };

  const deleteUser = async (httpRequest) => {
    try {
      const { address } = httpRequest.body;
      const user = await DB.User.findByAddress(address);
      if (!user) {
        return {
          status: 404,
          data: {
            message: "User not found"
          }
        }
      }

      await DB.User.deleteByAddress(address);
      return {
        status: 200,
        data: {
          message: "User removed successfully",
        }
      }
    }
    catch (error) {
      throw error;
    }
  };

  const getUser = async (httpRequest) => {
    try {
      const { address } = httpRequest.body;
      const user = await DB.User.findByAddress(address);
      if (!user) {
        return {
          status: 404,
          data: {
            message: "User not found",
          }
        }
      }

      const userInfo = {
        walletAddress: user.address,
        imageurl: user.profileImageUrl,
        hostRating: user.hostRating,
        username: user.username
      }

      return {
        status: 200,
        data: {
          userInfo
        }
      }
    }

    catch (error) {
      throw error;
    }
  }

  return Object.freeze({
    getProfile,
    createUser,
    updateUser,
    deleteUser,
    getUser,
  });
};
