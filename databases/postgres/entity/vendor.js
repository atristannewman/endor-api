const Sequelize = require("sequelize");
const db = require("../sequelize");
const makeVendor = require("../../../model/vendor");

const Vendor = db.define("vendor", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  location: Sequelize.STRING,
  isActive: Sequelize.BOOLEAN,
  accessUrl: Sequelize.STRING,
});

// db.sync();

const create = async (args) => {
  const vendorInstance = makeVendor(args);
  try {
    return await Vendor.create({
      name: vendorInstance.getName(),
      location: vendorInstance.getLocation(),
      isActive: vendorInstance.isActive(),
      accessUrl: vendorInstance.getAccessUrl(),
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findAll = async () => {
  try {
    return await Vendor.findAll();
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
  create,
  updateById,
  deleteById,
  findAll,
  findById,
});
