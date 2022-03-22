const axios = require("axios");

const fetchRequest = async (url, options) => {
  try {
    return await axios(url, options);
  } catch (error) {
    throw error;
  }
};

module.exports = fetchRequest;
