module.exports = ({ DB }) => {
  const createHangout = async (httpRequest) => {
    try {
      const { name, startTime, endTime, address, tags, host } = httpRequest.body;
      const hangout = await DB.Hangout.create({
        name,
        startTime,
        endTime,
        address,
        tags,
        host
      });

      const hangouts = await DB.Hangout.findAll();
      return {
        status: 200,
        data: {
          hangouts
        },
      };
    } catch (error) {
      throw error;
    }
  };

  const updateHangout = async (httpRequest) => {
    try {
      const { id, name, startTime, endTime, address, tags} = httpRequest.body;
      await DB.Hangout.updateById(id, {
        name,
        startTime,
        endTime,
        address,
        tags
      });
      const hangout = await DB.Hangout.findById(id);
      return {
        status: 200,
        data: {
          hangout,
        },
      };
    } catch (error) {
      throw error;
    }
  };

  const deleteHangout = async (httpRequest) => {
    try {
      const { id } = httpRequest.body;
      await DB.Hangout.deleteById(id);
      const hangouts = await DB.Hangout.findAll();

      return {
        status: 200,
        data: {
          hangouts
        },
      };
    } catch (error) {
      throw error;
    }
  };

  const getHangouts = async () => {
    try {
      const hangouts = await DB.Hangout.findAll({

      });
      return {
        status: 200,
        data: {
          hangouts
        },
      };
    } catch (error) {
      throw error;
    }
  };

  return Object.freeze({
    createHangout,
    updateHangout,
    deleteHangout,
    getHangouts,
  });
};