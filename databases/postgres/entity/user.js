const Sequelize = require("sequelize");
const db = require("../dbConfig");
const makeUser = require("../../../model/user");

const User = db.define("user", {
  address: Sequelize.STRING,
  proof: Sequelize.BOOLEAN,
  moonbird: Sequelize.BOOLEAN,
});

db.sync();

const create = async (args) => {
  const userInstance = makeUser(args);
  try {
    return await User.create({
      address: userInstance.getAddress(),
      proof: userInstance.getProof(),
      moonbird: userInstance.getMoonBird(),
    });
  } catch (error) {
    throw error;
  }
};

const findByAddress = async (address) => {
  try {
    return await User.findOne({
      where: {
        address,
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

module.exports = Object.freeze({
  create,
  update,
  findByAddress,
});
