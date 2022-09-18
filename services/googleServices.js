const NodeGeocoder = require('node-geocoder');
module.exports.geoCoding = async (address) => {
  const options = {
    provider: 'google',
    apiKey: process.env.GOOGLE_API_KEY, // for Mapquest, OpenCage, Google Premier
  };
  
  const geocoder = NodeGeocoder(options);
  const res = await geocoder.geocode({
    address:address,
    minConfidence: 0.5,
    limit: 1
  });
  return res.length>0?res[0]:[];
}
