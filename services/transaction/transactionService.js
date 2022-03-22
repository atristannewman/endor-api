module.exports = ({ fetchRequest }) => {
  const getAddressTransactionHistory = async (address) => {
    try {
      const options = {
        Headers: {
          "content-type": "application/json",
        },
      };
      const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.ETHSCAN_TOKEN}`;

      const response = await fetchRequest(url, options);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return Object.freeze({
    getAddressTransactionHistory,
  });
};
