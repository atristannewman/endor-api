const Sequelize = require("sequelize");
const db = require("../sequelize");
const makeHangout = require("../../../model/hangout");
const { STRING } = require("sequelize");

const Hangout = db.define("hangouts", {
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
  tags: Sequelize.ARRAY(Sequelize.STRING), // of strings
});

// Hangout.sync({force: true}); //This overwrites the last database
// db.sync(); //Not sure what this does, but it does not add columns
// Editing the schema requires migration scripts or a third party package I haven't found yet

const create = async (args) => {
  const hangoutInstance = makeHangout(args);
  try {
    console.log("make hangout hangout entity");
    return await Hangout.create({
      name: hangoutInstance.getName(),
      address: hangoutInstance.getAddress(),
      startTime: hangoutInstance.getStartTime(),
      endTime: hangoutInstance.getEndTime(),
      host: hangoutInstance.getHost(),
      tags: hangoutInstance.getTags()
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
    console.log(`error in hangout find by id: ${error}`);
    throw error;
  }
};

const updateById = async (id, args) => {
  try {
    console.log(`update by id: ${id}, args: ${args}`)
     return await Hangout.upsert({id: id,
       name: args.name,
       address: args.address,
       startTime: args.startTime,
       endTime: args.endTime,
       tags: Array(JSON.parse(args.tags)),
       host: args.host
     });
  } catch (error) {
    console.log(`error in hangout update: ${error}`);
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
