module.exports = ({ transactionService, DB }) => {
  const urlencodedToRawAddressesArray = async (walletAddresses) => {
    let walletAddressesArray = walletAddresses
    // Clean x-www-urlencoded data
    if(!walletAddressesArray.includes(",") && walletAddresses.length) {
      walletAddressesArray = [walletAddressesArray]
    } else {
      walletAddressesArray = walletAddressesArray.split(",")
    }

    return walletAddressesArray
  }

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

  const getAllUsers = async (httpRequest) => {
    try {
      const allUsers = await DB.User.findAll();

      return {
        status: 200,
        data: {
          allUsers
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

  const createUser = async (httpRequest) => {
    try {
      const {
        auth0Id,
        walletAddresses,
        hasMoonbird,
        hasProof,
        username,
        hostRating,
        profileImageUrl,
        deviceToken,
        location,
        notificationPreferences
      } = httpRequest.body;

      const cleanAddressesArray = urlencodedToRawAddressesArray(walletAddresses)

      const userByAddresses = await DB.User.findByAddresses(cleanAddressesArray);
      if (userByAddresses) {
        return {
          status: 409,
          data: {
            message: "User address already exists",
          },
        };
      }

      const userByAuth0Id = await DB.User.findByAuth0Id(auth0Id);
      if (userByAuth0Id) {
        return {
          status: 409,
          data: {
            message: "User auth0 id already exists",
          },
        };
      }

      const userByUsername = await DB.User.findByUsername(username);
      if (userByUsername) {
        return {
          status: 409,
          data: {
            message: "User name aleady exists",
          },
        };
      }
      
      const user = await DB.User.create({
        auth0Id,
        walletAddresses: cleanAddressesArray,
        hasProof,
        hasMoonbird,
        username,
        hostRating,
        profileImageUrl,
        deviceToken,
        location,
        notificationPreferences
      });

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

      const {
        walletAddresses, 
        username, 
        hostRating, 
        profileImageUrl, 
        location, 
        notificationPreferences,
        deviceToken,
        auth0Id 
      } = httpRequest.body;

      const cleanAddressesArray = urlencodedToRawAddressesArray(walletAddresses)

      const userByAuth0Id = await DB.User.findByAuth0Id(auth0Id);
      if (!userByAuth0Id) {
        return {
          status: 409,
          data: {
            message: "User auth0 id does not exists",
          },
        };
      }

      const userByAddresses = await DB.User.findByAddresses(cleanAddressesArray);
      if (userByAddresses && userByAddresses.auth0Id != auth0Id) {
        return {
          status: 409,
          data: {
            message: "Wallet address registered to another wallet",
          },
        };
      }
            
      await DB.User.updateByAuth0Id(auth0Id, {
        username,
        hostRating,
        profileImageUrl,
        location,
        notificationPreferences,
        deviceToken,
        walletAddresses: cleanAddressesArray
      });

      const updatedUser = await DB.User.findByAuth0Id(auth0Id);
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
      const { uuid } = httpRequest.query;

      const userByUUID = await DB.User.findByUUID(uuid);
      if (!userByUUID) {
        return {
          status: 404,
          data: {
            message: "User is not found",
          },
        };
      }
     
      if (userByUUID) {
        await DB.User.deleteByUUID(uuid);
        return {
          status: 200,
          data: {
            message: "User is deleted successfully",
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

  const getUser = async (httpRequest) => {
    try {
      const { auth0Id, address } = httpRequest.query;

      // Return user with this auth0Id
      if (auth0Id) {
        console.log("auth0Id sent")
        const user = await DB.User.findByAuth0Id(auth0Id);
        if (user) {
          return {
            status: 200,
            data: {
              user
            }
          }
        } else if (!user) {
          return {
            status: 404,
            data: {
              message: "No user found",
            },
          };
        }
      }

      // Return user with this address
      if (address) {
        console.log("address sent")
        const user = await DB.User.findByAddresses([address]);

        if (user) {
          return {
            status: 200,
            data: {
              user
            }
          }
        } else if (!user) {
          return {
            status: 404,
            data: {
              message: "No user found",
            },
          };
        }
      }


    //   

    //   const usersInfo = users.map((user) => {
    //     const userData = user.dataValues;
    //     return {
    //       walletAddress: userData.address,
    //       imageurl: userData.profileImageUrl,
    //       hostRating: userData.hostRating,
    //       username: userData.username,
    //       deviceToken: userData.deviceToken
    //     };
    //   });

    //   return {
    //     status: 200,
    //     data: {
    //       usersInfo,
    //     },
    //   };
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
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    updateUserNotificationSettings,
  });
};
