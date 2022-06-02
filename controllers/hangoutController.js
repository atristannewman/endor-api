module.exports = ({ DB }) => {
  const createHangout = async (httpRequest) => {
    try {
      const { id, name, startTime, endTime, address, tags, host } = httpRequest.body;
      const hangout = await DB.Hangout.create({
        id,
        name,
        startTime,
        endTime,
        address,
        tags,
        host
      });
      return {
        status: 200,
        data: {
          vendor,
        },
      };
    } catch (error) {
      throw error;
    }
  };
  const updateHangout = async (httpRequest) => {
    try {
      const { name, location, isActive, accessUrl, accessCode, entryInstruction } = httpRequest.body;
      await DB.Hangout.updateById(id, {
        name,
        startTime,
        endTime,
        address,
        tags,
        host,
      });
      const vendor = await DB.Vendor.findById(id);
      return {
        status: 200,
        data: {
          vendor,
        },
      };
    } catch (error) {
      throw error;
    }
  };
  const deleteHangout = async (httpRequest) => {
    try {
      const { id } = httpRequest.body;
      await DB.Vendor.deleteById(id);
      return {
        status: 200,
        data: {
          message: "Hangout is deleted successfully",
        },
      };
    } catch (error) {
      throw error;
    }
  };
  const getHangouts = async () => {
    try {
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

  return Object.freeze({
    createHangout,
    updateHangout,
    deleteHangout,
    getHangouts,
  });
};
