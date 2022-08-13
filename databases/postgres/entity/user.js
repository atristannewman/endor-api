const Sequelize = require("sequelize");
const db = require("../sequelize");
const makeUser = require("../../../model/user");
const { validate } = require("../../../validation/userAddress");
const { userUpdateValidate } = require("../../../validation/userUpdate");

const User = db.define(
  "user",
  {
    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    profileImageUrl: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    hasProof: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    hasMoonbird: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    hostRating: {
      type: Sequelize.DOUBLE,
      allowNull: true,
    },
    notificationPreferences: {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {
        minPossibleAttendees: 0,
        distanceFromPossibleAttendees: 0,
        location: "",
        minHostRating: 5,
      },
    },
    deviceToken: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

const create = async (args) => {
  const userInstance = makeUser(args);
  try {
    return await User.create({
      address: userInstance.getAddress(),
      hasProof: userInstance.getHasProof(),
      hasMoonbird: userInstance.getHasMoonBird(),
      username: userInstance.getUsername(),
      hostRating: userInstance.getHostRating(),
      profileImageUrl: userInstance.getProfileImageUrl(),
      deviceToken: userInstance.getDeviceToken()
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findByAddress = async (address) => {
  try {
    validate({ address });
    return await User.findOne({
      where: {
        address,
      },
    });
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

const findByUsername = async (username) => {
  try {
    return await User.findOne({
      where: {
        username,
      },
    });
  } catch (error) {
    throw error;
  }
};

const update = async (id, args) => {
  try {
    User.update(args, {
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
};

const updateByAddress = async (address, args) => {
  try {
    validate({ address });
    userUpdateValidate(args);
    return User.update(args, {
      where: {
        address,
      },
    });
  } catch (error) {
    console.log(`error in user update: ${error}`);
    throw error;
  }
};

const deleteByAddress = async (address) => {
  try {
    validate({ address });
    User.destroy({
      where: {
        address,
      },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = Object.freeze({
  User,
  create,
  update,
  updateByAddress,
  findByAddress,
  findAll,
  deleteByAddress,
  findByUsername,
});
