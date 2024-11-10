/* eslint-disable no-useless-catch */
const Sequelize = require('sequelize');
const db = require('../sequelize');
const makeHangout = require('../../../models/hangout');
const { User } = require('./user');

const Hangout = db.define(
  'hangout',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    address: Sequelize.STRING,
    startTime: Sequelize.STRING,
    endTime: Sequelize.STRING,
    // tags: Sequelize.ARRAY(Sequelize.STRING), // of strings
    host: User,
    type: Sequelize.STRING,
    userId: Sequelize.UUID,
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// () => {
//   Hangout.belongsTo(db.user,
//   //   {
//   //   foreignKey: 'user_id',
//   //   as: "host",
//   // }
//   )
// }

// db.Users.hasMany(db.hangouts,{
//   foreignKey:"user_id",
//   as:"Hangout"
//   })

//   db.Hangouts.belongsTo(db.users,{
//   foreignKey:"user_id",
//   as:"User"
//   })

// Hangout.sync({alter: true}); //This overwrites the last database
// db.sync(); //Not sure what this does, but it does not add columns
// Editing the schema requires migration scripts or a third party package I haven't found yet

const create = async (args) => {
  const hangoutInstance = makeHangout(args);
  try {
    console.log('make hangout hangout entity');
    return await Hangout.create({
      name: hangoutInstance.getName(),
      address: hangoutInstance.getAddress(),
      startTime: hangoutInstance.getStartTime(),
      endTime: hangoutInstance.getEndTime(),
      tags: hangoutInstance.getTags(),
      host: hangoutInstance.getHost(),
      type: hangoutInstance.getType(),
      userId: hangoutInstance.getUserId(),
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

const findAvailableByUserId = async (userId) => {
  try {
    return await Hangout.findOne({
      where: {
        userId: userId,
        type: 'available',
      },
    });
  } catch (error) {
    console.log(`error in hangout find by id: ${error}`);
    throw error;
  }
};

const updateById = async (id, args) => {
  try {
    return await Hangout.upsert({
      id,
      name: args.name,
      address: args.address,
      startTime: args.startTime,
      endTime: args.endTime,
      tags: Array(JSON.parse(args.tags)),
      host: args.host,
      type: args.type ? args.type : 'scheduled',
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
  Hangout,
  create,
  updateById,
  deleteById,
  findAll,
  findById,
  findAvailableByUserId,
});
