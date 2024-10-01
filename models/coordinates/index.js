const Sequelize = require('sequelize');
const db = require('../../databases/postgres/sequelize');

const Coordinates = db.define('customerCoordinates', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  coordinates: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const create = async (email, coordinates) => {
  try {
    return await Coordinates.create({ 
      email,
      coordinates
    });
  } catch (error) {
    console.error('Error creating coordinates:', error);
    throw error;
  }
};

const findByEmail = async (email) => {
  return await Coordinates.findOne({ where: { email } });
};

const update = async (email, coordinates) => {
  try {
    const [updatedRows] = await Coordinates.update(
      { coordinates },
      { where: { email } }
    );

    return updatedRows === 1;
  } catch (error) {
    console.error('Error updating customer coordinates:', error);
    throw error;
  }
};

const destroy = async (email) => {
  return await Coordinates.destroy({ where: { email } });
};


module.exports = {
    Coordinates,
    create,
    findByEmail,
    update,
    destroy
}