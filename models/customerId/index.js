const Sequelize = require('sequelize');
const db = require('../../databases/postgres/sequelize');

const CustomerId = db.define('customerIds', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  stripeCustomerId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  }
});

const create = async (email, customerId) => {
  try {
    
    return await CustomerId.create({ 
        email,
        stripeCustomerId: customerId
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
};

const findByEmail = async (email) => {
  try {
    return await CustomerId.findOne({
      where: { email }
    });
  } catch (error) {
    console.error('Error finding API key:', error);
    throw error;
  }
};

const destroyByEmail = async (email) => {
  try {
    return await CustomerId.destroy({
      where: { email }
    });
  } catch (error) {
    console.error('Error deleting API key by email:', error);
    throw error;
  }
};

module.exports = {
  CustomerId,
  create,
  findByEmail,
  destroyByEmail
};