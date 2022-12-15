/* eslint-disable no-useless-catch */
const Sequelize = require("sequelize");
const db = require("../sequelize");
const makeUser = require("../../../model/user");
const { userAddressValidate } = require("../../../validation/userAddress.js");
const { userAddressesValidate } = require("../../../validation/userAddresses.js");
const { userUpdateValidate } = require("../../../validation/userUpdate");
const { userAuth0IdValidate } = require("../../../validation/userAuth0Id");

const User = db.define(
  "user",
  {
    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    auth0Id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    walletAddresses: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      notEmpty: true
    },
    profileImageUrl: {
      type: Sequelize.STRING,
      allowNull: true
    },
    hasProof: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    hasMoonbird: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    hostRating: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    notificationPreferences: {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {
        minPossibleAttendees: 0,
        distanceFromPossibleAttendees: 0,
        minHostRating: 5
      },
      set (value) {
        const notificationPreferences = {
          minPossibleAttendees: parseInt(value.minPossibleAttendees),
          distanceFromPossibleAttendees: parseInt(value.distanceFromPossibleAttendees),
          minHostRating: parseInt(value.minHostRating)
        };
        this.setDataValue("notificationPreferences", notificationPreferences);
      }
    },
    deviceToken: {
      type: Sequelize.STRING,
      allowNull: true
    },
    location: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {
        latitude: null,
        longitude: null
      }
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

const create = async (args) => {

  const userInstance = makeUser(args);

  let location = userInstance.getLocation();
  if (location?.latitude === "null" && location?.longitude === "null") {
    location.latitude = null;
    location.longitude = null;
  } else if (location?.latitude === "" && location?.longitude === "") {
    location.latitude = null;
    location.longitude = null;
  } else if (location?.latitude && location?.longitude) {
    location.latitude = parseFloat(location.latitude);
    location.longitude = parseFloat(location.longitude);
  } else if (location === "" || location === null || location === "null") {
    location = {
      latitude: null,
      longitude: null
    };
  }

  try {
    return await User.create({
      auth0Id: userInstance.getAuth0Id(),
      walletAddresses: userInstance.getWalletAddresses(),
      hasProof: userInstance.getHasProof(),
      hasMoonbird: userInstance.getHasMoonBird(),
      username: userInstance.getUsername(),
      hostRating: userInstance.getHostRating(),
      profileImageUrl: userInstance.getProfileImageUrl(),
      location: userInstance.getLocation(),
      deviceToken: userInstance.getDeviceToken(),
      notificationPreferences: userInstance.getNotificationPreferences()
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const findByAddress = async (address) => {
  // eslint-disable-next-line no-useless-catch
  try {
    userAddressValidate({ address });
    const userByAddress = await User.findOne({
      where: {
        walletAddresses: { [Sequelize.contains]: [address] }
      }
    });
    
    return userByAddress
  } catch (error) {
    throw error;
  }
};

const arrayOfUsersWallets = async (users) => {
  var arrayOfWallets = []
  var index = 0

  do {
    // Had to clean the letters here, because if you call toLowerCase on the array, it won't adjust the elemenst
    // characters.
    const userWalletAddressesLowerCase = users[index].walletAddresses.map((address) => {return address.toLowerCase()})
    arrayOfWallets.push(userWalletAddressesLowerCase)
    index++

    if (index === users.length) {
      return arrayOfWallets
    }
  } while (index < users.length);
}

const getIndexOfMatchingWallets = async (arrayOfAllUserWalletArrays, walletAddresses) => {
  var returnIndex = null
  var index = 0

  do {
    arrayOfAllUserWalletArrays[index].forEach((address) =>{
      
      if(walletAddresses.includes(address.toLowerCase())) {
        returnIndex = index
      }
    })

    if (index == arrayOfAllUserWalletArrays.length - 1) {
      return
    }

    if(returnIndex) {
      return returnIndex
    }
    index++
  } while (!returnIndex && index < arrayOfAllUserWalletArrays.length);
}

const findByAddresses = async (walletAddresses) => {
  // eslint-disable-next-line no-useless-catch
  try { 
    userAddressesValidate({ walletAddresses });
    const allUsers = await User.findAll()
    const arrayOfAllUserWallets = await arrayOfUsersWallets(allUsers)
    const cleanSearchedWalletAddresses = walletAddresses.map((address) => {return address.toLowerCase()})
    const indexOfUserWithMatchingWallet = await getIndexOfMatchingWallets(arrayOfAllUserWallets, cleanSearchedWalletAddresses)
    return allUsers[indexOfUserWithMatchingWallet]
  } catch (error) {
    throw error;
  }
};

const addressesInTrueWallets = async (addresses, trueAddresses) => {
  let returnAddresses = addresses.filter( address => {
    walletAddresses.includes(address)
  })

  return returnAddresses
}

const findByAuth0Id = async (auth0Id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    userAuth0IdValidate({ auth0Id });
    const userByAuth0Id = await User.findOne({
      where: {
        auth0Id
      }
    })

    return userByAuth0Id
  } catch (error) {
    throw error;
  }
};

const findAll = async () => {
  try {
    return await User.findAll();
  } catch (error) {
    throw error;
  }
};

const findAllWithLocation = async () => {
  try {
    return await User.findAll({
      where: {
        location: {
          latitude: {
            [Sequelize.Op.not]: null
          },
          longitude: {
            [Sequelize.Op.not]: null
          }
        },
        notificationPreferences: {
          minPossibleAttendees: {
            [Sequelize.Op.gt]: 1
          }
        }
        // Uncomment this in production
        // deviceToken: {
        //   [Sequelize.Op.not]: null
        // }
      },
      order: [
        ["notificationPreferences.minPossibleAttendees", "DESC"]
      ]
    });
  } catch (error) {
    throw error;
  }
};

const findByUsername = async (username) => {
  try {
    return await User.findOne({
      where: {
        username
      }
    });
  } catch (error) {
    throw error;
  }
};

const findByUUID = async (uuid) => {
  try {
    return await User.findOne({
      where: {
        uuid
      }
    });
  } catch (error) {
    throw error;
  }
};

const update = async (id, args) => {
  try {
    User.update(args, {
      where: {
        id
      }
    });
  } catch (error) {
    throw error;
  }
};

const updateByAuth0Id = async (auth0Id, args) => {
  try {
    userUpdateValidate(args);

    const location = args?.location;
    if (location) {
      if (location?.latitude === "null" && location?.longitude === "null") {
        args.location.latitude = null;
        args.location.longitude = null;
      } else if (location?.latitude === "" && location?.longitude === "") {
        args.location.latitude = null;
        args.location.longitude = null;
      } else if (location?.latitude && location?.longitude) {
        args.location.latitude = parseFloat(location.latitude);
        args.location.longitude = parseFloat(location.longitude);
      } else if (location === "" || location === null || location === "null") {
        args.location.latitude = null;
        args.location.longitude = null;
      }
    }

    return User.update(args, {
      where: {
        auth0Id
      }
    });
  } catch (error) {
    console.log(`error in user update: ${error}`);
    throw error;
  }
};

const deleteByAddress = async (address) => {
  try {
    userAddressValidate({ address });
    User.destroy({
      where: {
        walletAddresses: {$contains: address}
      }
    });
  } catch (error) {
    throw error;
  }
};

const deleteByUUID = async (uuid) => {
  try {
    User.destroy({
      where: {
        uuid
      }
    });
  } catch (error) {
    throw error;
  }
};

module.exports = Object.freeze({
  User,
  create,
  update,
  findByAddress,
  findByAddresses,
  findByUUID,
  findAll,
  deleteByUUID,
  findByUsername,
  findAllWithLocation,
  findByAuth0Id,
  updateByAuth0Id
});
