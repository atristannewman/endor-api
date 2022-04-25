module.exports = ({ DB }) => {
  const createVendor = async (httpRequest) => {
    try {
      const { name, location, isActive, accessUrl } = httpRequest.body;
      const vendor = await DB.Vendor.create({
        name,
        location,
        isActive,
        accessUrl,
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
  const updateVendor = async (httpRequest) => {
    try {
      const { id, name, location, isActive, accessUrl } = httpRequest.body;
      await DB.Vendor.updateById(id, {
        name,
        location,
        isActive,
        accessUrl,
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
  const deleteVendor = async (httpRequest) => {
    try {
      const { id } = httpRequest.body;
      await DB.Vendor.deleteById(id);
      return {
        status: 200,
        data: {
          message: "Vendor is deleted successfully",
        },
      };
    } catch (error) {
      throw error;
    }
  };
  const getVendors = async () => {
    try {
      const vendors = await DB.Vendor.findAll();
      return {
        status: 200,
        data: {
          vendors
        },
      };
    } catch (error) {
      throw error;
    }
  };

  return Object.freeze({
    createVendor,
    updateVendor,
    deleteVendor,
    getVendors,
  });
};
