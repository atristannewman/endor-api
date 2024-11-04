const axios = require("axios");

const fetchRequest = async (config) => {
  try {
    return await axios(config);
  } catch (error) {
    throw error;
  }
};

module.exports = fetchRequest;
