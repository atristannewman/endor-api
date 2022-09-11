const NodeGeocoder = require('node-geocoder');
module.exports.geoCoding = async (address) => {
  const options = {
    provider: 'google',
    apiKey: 'AIzaSyCbtE7ZiLCspJzEbmEO5g02DCPN1AbCQEE', // for Mapquest, OpenCage, Google Premier
  };
  
  const geocoder = NodeGeocoder(options);
  const res = await geocoder.geocode({
    address:address,
    minConfidence: 0.5,
    limit: 1
  });
  return res.length>0?res[0]:[];
}
