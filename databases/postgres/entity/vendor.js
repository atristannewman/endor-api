const Sequelize = require("sequelize");
const db = require("../sequelize");
const makeVendor = require("../../../models/vendor");
const { User } = require("./user");

const Vendor = db.define("vendors", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  location: Sequelize.STRING,
  isActive: Sequelize.BOOLEAN,
  accessUrl: Sequelize.STRING,
  accessCode: Sequelize.STRING,
  entryInstruction: Sequelize.STRING
});

// Vendor.sync({force: true}); //This overwrites the last database
// db.sync(); //Not sure what this does, but it does not add columns
// Editing the schema requires migration scripts or a third party package I haven't found yet

const create = async (args) => {
  const vendorInstance = makeVendor(args);
  try {
    return await Vendor.create({
      name: vendorInstance.getName(),
      location: vendorInstance.getLocation(),
      isActive: vendorInstance.isActive(),
      accessUrl: vendorInstance.getAccessUrl(),
      accessCode: vendorInstance.getAccessCode(),
      entryInstruction: vendorInstance.getEntryInstruction(),
      address: vendorInstance.getAddress(),
     
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findAll = async () => {
  try {
    return await Vendor.findAll({ include: { model: User, as: "host" } });
  } catch (error) {
    throw error;
  }
};

const findById = async (id) => {
  try {
    return await Vendor.findOne({
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
     return await Vendor.update(args, {
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
    Vendor.destroy({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = Object.freeze({
  Vendor,
  create,
  updateById,
  deleteById,
  findAll,
  findById,
});