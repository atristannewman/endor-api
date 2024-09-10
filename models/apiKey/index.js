const Sequelize = require('sequelize');
const db = require('../../databases/postgres/sequelize');
const { generateToken } = require('../../utils/tokenGenerator');

const ApiKey = db.define('apiKeys', {
  customerId: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    references: {
      key: 'customerId',
    },
  },
  apiKey: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  }
});

const create = async (customerId) => {
  try {
    const apiKey = generateToken(); // Make sure to pass the email as an argument
    console.log(`apiKey ${apiKey}`)
    console.log('creating api key in db')
    return await ApiKey.create({ 
        customerId, 
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



module.exports = {
  ApiKey,
  create,
  findByApiKey,
  findByCustomerId
};