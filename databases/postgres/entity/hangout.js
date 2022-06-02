const Sequelize = require("sequelize");
const db = require("../sequelize");
const makeVendor = require("../../../model/hangout");

const Vendor = db.define("vendors", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  address: Sequelize.STRING,
  startTime: Sequelize.STRING,
  endTime: Sequelize.STRING,
  host: Sequelize.STRING, // User
  tags: Sequelize.ARRAY // of strings
});

// Hangout.sync({force: true}); //This overwrites the last database
// db.sync(); //Not sure what this does, but it does not add columns
// Editing the schema requires migration scripts or a third party package I haven't found yet

const create = async (args) => {
  const hangoutInstance = makeHangout(args);
  try {
    return await Hangout.create({
      name: hangoutInstance.getName(),
      address: hangoutInstance.getAddress(),
      startTime: hangoutInstance.getStartTime(),
      endTime: hangoutInstance.getEndTime(),
      host: vendorInstance.getHost(),
      tags: vendorInstance.getTags()
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findAll = async () => {
  try {
    return await Hangout.findAll();
  } catch (error) {
    throw error;
  }
};

const findById = async (id) => {
  try {
    return await Hangout.findOne({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
};

const updateById = async (id, args) => {
  try {
     return await Hangout.update(args, {
       where: {
         id,
       },
     });
  } catch (error) {
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    Hangout.destroy({
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
  updateById,
  deleteById,
  findAll,
  findById,
});
