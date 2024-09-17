module.exports = ({ transactionService, DB, moralisService, paymentService }) => {
  const urlencodedToRawAddressesArray = async (walletAddresses) => {
    if (!walletAddresses) {
      return []
    }

    let walletAddressesArray = walletAddresses
    // Clean x-www-urlencoded data
    if(!walletAddressesArray.includes(",") && walletAddresses.length) {
      walletAddressesArray = [walletAddressesArray]
    } else if (walletAddresses) {
      walletAddressesArray = walletAddressesArray.split(",")
    }
    return !walletAddressesArray ? [] : walletAddressesArray
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

  const getAllUsers = async () => {
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

      const cleanAddressesArray = await urlencodedToRawAddressesArray(walletAddresses)

      const addressesArrayWithoutTestWallet = cleanAddressesArray.filter(address =>{
        return address != "0xbebc733c64deba1c494e5b01b89ee16b5cafd2c5" // test wallet
      })
      
      const userByAddresses = await DB.User.findByAddresses(addressesArrayWithoutTestWallet);
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

  const getNFTCollectionsForWallets = async (walletAddresses) => {
    const nFTCollections = await moralisService.getNFTCollectionsForWallet(walletAddresses[0])
    return nFTCollections
  }

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
        auth0Id,
        blockedUserIds
      } = httpRequest.body;

      const cleanAddressesArray = await urlencodedToRawAddressesArray(walletAddresses)
      const cleanBlockedUserIdsArray = await urlencodedToRawAddressesArray(blockedUserIds)
      const userByAuth0Id = await DB.User.findByAuth0Id(auth0Id);

      if (!userByAuth0Id) {
        return {
          status: 409,
          data: {
            message: "User auth0 id does not exists",
          },
        };
      }

      const addressesArrayWithoutTestWallet = cleanAddressesArray.filter(address =>{
        return address != "0xbebc733c64deba1c494e5b01b89ee16b5cafd2c5" // test wallet
      })

      const userByAddresses = await DB.User.findByAddresses(addressesArrayWithoutTestWallet);
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
        walletAddresses: cleanAddressesArray,
        blockedUserIds: cleanBlockedUserIdsArray
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
      const { email } = httpRequest.query;
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

  const createCustomer = async (httpRequest) => {
    const { email, customerId } = httpRequest.body

    if (!customerId) {
      throw new Error("Customer id is required")
    }
    
    if (email !== "user@gmail.com") {
      throw new Error("Customer email is required")
    }

    // Check if customer already exists
    const existingCustomer = await DB.ApiKey.findByEmail(email);
    if (existingCustomer) {
      return {
        status: 200,
        data: {
          message: "Customer already exists"
        }
      };
    }

    const paymentMethods = await paymentService.paymentMethods(customerId)
      .then((paymentMethodsData) => {
        if (!paymentMethodsData || paymentMethodsData.length === 0) {
          throw new Error("No payment methods found for customer id")
        } else {
          return paymentMethodsData
        }
      }); 

    const savedCustomerId = await DB.CustomerId.create(email, customerId)

    return {
      status: 200,
      data: await DB.ApiKey.create(email).then((apiKeyData) => {

        return {
          email,
          customerId: savedCustomerId.stripeCustomerId,
          apiKey: apiKeyData.apiKey,
          paymentMethodLast4: paymentMethods[0].card.last4
        }
      })
    }

    
  }


  const getCustomer = async (httpRequest) => {
    try {
      console.log("getting customer")
      const email = httpRequest.query.email

      const apiKeyProfile = await DB.ApiKey.findByEmail(email);
      const customerId = await DB.CustomerId.findByEmail(email)
      const paymentMethods = await paymentService.paymentMethods(customerId.stripeCustomerId)

      if (!apiKeyProfile) {
        return {
          status: 404,
          data: {
            message: "Customer not found"
          }
        }
      }

      return {
        status: 200,
        data: {
          apiKey: apiKeyProfile.apiKey,
          email,
          paymentMethodLast4: paymentMethods[0].card.last4,
          customerId: customerId.stripeCustomerId
        }
      }
    } catch (error) {
      return {
        status: 500,
        data: {
          message: error.message,
        },
      };
    }
  }

  const deleteCustomer = async (httpRequest) => {
    const { email } = httpRequest.body

    try {
          // Start of Selection
          const customer = await DB.CustomerId.findByEmail(email);
          const apiKey = await DB.ApiKey.findByEmail(email);
          if (!customer || !apiKey) {
            throw new Error('Customer or API key does not exist.');
          } else {
            await DB.ApiKey.destroyByEmail(email);
            await DB.CustomerId.destroyByEmail(email);
          }
          
      return {
        status: 200,
        data: {
          message: "Customer deleted"
        }
      }
    } catch (error) {
      console.error('Error deleting API key by email:', error);
      return {
        status: 500,
        data: {
          message: error.message
        }
      }
    }
  }

  const updateCustomer = async (httpRequest) => {
    const { email } = httpRequest.body

    try {
      await DB.ApiKey.destroyByEmail(email)
      return {
        status: 200,
        data: {
          message: "Customer deleted"
        }
      }
    } catch (error) {
      console.error('Error deleting API key by email:', error);
      return {
        status: 500,
        data: {
          message: error.message
        }
      }
    }
  }

  return Object.freeze({
    getProfile,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    updateUserNotificationSettings,
    createCustomer,
    getCustomer,
    deleteCustomer
  });
};
