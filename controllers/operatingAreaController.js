module.exports = () => {
  const getOperatingArea = async (httpRequest) => {
    try {
      const { latitude, longitude, radius } = httpRequest.query;

      if (!latitude || !longitude || !radius) {
        return {
          status: 400,
          data: { message: 'Latitude, longitude, and radius are required.' },
        };
      }

      console.log(`Successfully received request for operating area:
        Latitude: ${latitude}
        Longitude: ${longitude}
        Radius: ${radius} miles`);

      // TODO: Implement the logic to process and return the operating area

      return {
        status: 200,
        data: {
          message: 'Operating area request received successfully.',
          latitude,
          longitude,
          radius,
        },
      };
    } catch (error) {
      console.error('Error in getOperatingArea:', error);
      return {
        status: 500,
        data: {
          message: 'Internal server error.',
        },
      };
    }
  };

  return Object.freeze({
    getOperatingArea,
  });
};
