module.exports = ({ transactionService, DB }) => {
  const getProfile = async (httpRequest) => {
    try {
      const { address } = httpRequest.query;
      const PROOF_COLLECTIVE_PASS_ADDRESS =
        "0x08d7c0242953446436f34b4c78fe9da38c73668d";
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
      const {
        address,
        hasMoonbird,
        hasProof,
        username,
        hostRating,
        profileImageUrl,
        deviceToken,
        location,
      } = httpRequest.body;
      const userAddress = await DB.User.findByAddress(address);
      if (userAddress) {
        return {
          status: 409,
          data: {
            message: "User address already exists",
          },
        };
      }
      const userUsername = await DB.User.findByUsername(username);
      if (userUsername) {
        return {
          status: 409,
          data: {
            message: "User name aleady exists",
          },
        };
      }
      const user = await DB.User.create({
        address,
        hasProof,
        hasMoonbird,
        username,
        hostRating,
        profileImageUrl,
        deviceToken,
        location,
      });

      console.log(`user device token ${user.deviceToken}`);
      
      return {
        status: 200,
        data: {
          user,
        },
      };
    } catch (error) {
      return {
        status: 500,
        data: {
          message: error.message,
        },
      };
    }
  };

  const updateUser = async (httpRequest) => {
    try {
      const { address, username, hostRating, profileImageUrl, deviceToken , location } =
        httpRequest.body;
      const user = await DB.User.findByAddress(address);
      if (!user) {
        return {
          status: 404,
          message: "user is not found",
        };
      }
      await DB.User.updateByAddress(address, {
        username,
        hostRating,
        profileImageUrl,
        deviceToken,
        location
      });
      const updatedUser = await DB.User.findByAddress(address);
      return {
        status: 200,
        data: {
          updatedUser,
        },
      };
    } catch (error) {
      return {
        status: 500,
        data: {
          message: error.message,
        },
      };
    }
  };

  const deleteUser = async (httpRequest) => {
    try {
      const { address } = httpRequest.query;
      const user = await DB.User.findByAddress(address);
      if (!user) {
        return {
          status: 404,
          data: {
            message: "User is not found",
          },
        };
      }
      await DB.User.deleteByAddress(address);
      return {
        status: 200,
        data: {
          message: "User is deleted successfully",
        },
      };
    } catch (error) {
      return {
        status: 500,
        data: {
          message: error.message,
        },
      };
    }
  };

  const getUser = async (httpRequest) => {
    try {
      const { address } = httpRequest.query;
      if (address) {
        const user = await DB.User.findByAddress(address);
        if (!user) {
          return {
            status: 404,
            data: {
              message: "User is not found",
            },
          };
        }
        const userInfo = {
          walletAddress: user.address,
          imageurl: user.profileImageUrl,
          hostRating: user.hostRating,
          username: user.username,
          deviceToken: user.deviceToken
        };

        return {
          status: 200,
          data: {
            userInfo,
          },
        };
      } else {
        const users = await DB.User.findAll();
        if (!users) {
          return {
            status: 404,
            data: {
              message: "No users were found",
            },
          };
        }
        const usersInfo = users.map((user) => {
          const userData = user.dataValues;
          return {
            walletAddress: userData.address,
            imageurl: userData.profileImageUrl,
            hostRating: userData.hostRating,
            username: userData.username,
            deviceToken: userData.deviceToken
          };
        });

        return {
          status: 200,
          data: {
            usersInfo,
          },
        };
      }
    } catch (error) {
      return {
        status: 500,
        data: {
          message: error.message,
        },
      };
    }
  };

  const updateUserNotificationSettings = async (httpRequest) => {
    try {
      const {
        address,
        possibleAttendees,
        distanceFromAttendees,
        location,
        minHostRating,
      } = httpRequest.body;

      if (address) {
        const user = await DB.User.findByAddress(address);
        if (!user) {
          return {
            status: 404,
            data: {
              message: "User is not found",
            },
          };
        }

        await DB.User.updateByAddress(address, {
          hasProof: user.hasProof,
          hasMoonbird: user.hasMoonbird,
          username: user.username,
          hostRating: user.hostRating,
          profileImageUrl: user.profileImageUrl,
          notificationPreferences: {
            minPossibleAttendees: possibleAttendees,
            distanceFromPossibleAttendees: distanceFromAttendees,
            location,
            minHostRating,
          },
        });
        const updatedUser = await DB.User.findByAddress(address);
        const userInfo = {
          walletAddress: updatedUser.address,
          imageurl: updatedUser.profileImageUrl,
          hostRating: updatedUser.hostRating,
          username: updatedUser.username,
          preferences: updatedUser.notificationPreferences,
        };

        return {
          status: 200,
          data: {
            userInfo,
          },
        };
      }
      return {
        status: 400,
        data: {
          message: "Address is not provided",
        },
      };
    } catch (error) {
      return {
        status: 500,
        data: {
          message: error.message,
        },
      };
    }
  };

  return Object.freeze({
    getProfile,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    updateUserNotificationSettings,
  });
};
