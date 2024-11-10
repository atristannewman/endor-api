const turf = require('@turf/turf');

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

      // Create a circular polygon using Turf.js
      const center = turf.point([parseFloat(longitude), parseFloat(latitude)]);
      const options = { steps: 64, units: 'miles' };
      const circle = turf.circle(center, parseFloat(radius), options);

      return {
        status: 200,
        data: {
          message: 'Operating area generated successfully.',
          geoJson: circle,
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
