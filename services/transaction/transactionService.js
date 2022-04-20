const axios = require("axios");

module.exports = ({ fetchRequest }) => {
  const getAddressTransactionHistory = async (address) => {
    try {
      const config = {
        method: "GET",
        url: `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.ETHSCAN_TOKEN}`,
        headers: {
          "content-type": "application/json",
        },
      };

      const response = await fetchRequest(config);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getListOfTokensOfAddress = async (address) => {
    try {
      const config = {
        method: "GET",
        url: `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=${process.env.ETHPLORER_TOKEN}`,
        headers: {
          "content-type": "application/json",
        },
      };

      const response = await fetchRequest(config);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const checkProofTokenExist = async (address) => {
    try {
      var config = {
        method: "get",
        url: `https://deep-index.moralis.io/api/v2/nft/${address}/owners?chain=eth&format=decimal`,
        headers: {
          "X-API-Key": process.env.MORALIS_TOKEN,
        },
      };
      const response = await axios(config);

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  return Object.freeze({
    getAddressTransactionHistory,
    getListOfTokensOfAddress,
    checkProofTokenExist,
  });
};
