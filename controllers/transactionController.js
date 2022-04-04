module.exports = ({ transactionService }) => {
  const getTransactionHistory = async (httpRequest) => {
    try {
      const { address } = httpRequest.query;
      const response = await transactionService.getAddressTransactionHistory(
        address
      );
      const { data } = response;
      return {
        status: 200,
        data,
      };
    } catch (error) {
      throw error;
    }
  };

  const getTokenList = async (httpRequest) => {
    try {
      const { address } = httpRequest.query;

      const response = await transactionService.getListOfTokensOfAddress(
        address
      );

      const { data } = response;
      return {
        status: 200,
        data,
      };
    } catch (error) {
      throw error;
    }
  };

  return Object.freeze({
    getTransactionHistory,
    getTokenList,
  });
};
