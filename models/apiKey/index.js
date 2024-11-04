const Sequelize = require('sequelize');
const db = require('../../databases/postgres/sequelize');
const { generateToken } = require('../../utils/tokenGenerator');

const ApiKey = db.define('apiKeys', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  apiKey: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  }
});

const create = async (email) => {
  try {
    const apiKey = generateToken(); // Make sure to pass the email as an argument
    
    return await ApiKey.create({ 
        email,
        apiKey
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
};

const findByApiKey = async (apiKey) => {
  try {
    return await ApiKey.findOne({
      where: { apiKey }
    });
  } catch (error) {
    console.error('Error finding API key:', error);
    throw error;
  }
};

const findByCustomerId = async (customerId) => {
  try {
    return await ApiKey.findOne({
      where: { customerId }
    });
  } catch (error) {
    console.error('Error finding API key by customer ID:', error);
    throw error;
  }
};

const findByEmail = async (email) => {
  try {
    return await ApiKey.findOne({
      where: { email }
    });
  } catch (error) {
    console.error('Error finding API key by email:', error);
    throw error;
  }
};

const destroyByEmail = async (email) => {
  try {
    return await ApiKey.destroy({
      where: { email }
    });
  } catch (error) {
    console.error('Error deleting API key by email:', error);
    throw error;
  }
};

module.exports = {
  ApiKey,
  create,
  findByApiKey,
  findByCustomerId,
  findByEmail,
  destroyByEmail
};