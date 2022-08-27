module.exports.getDistance = (latitude1, longitude1, latitude2, longitude2, unit) => {
    var radiusLatitude1 = Math.PI * latitude1/180
    var radiusLatitude2 = Math.PI * latitude2/180
    var theta = longitude1-longitude2
    var radiustheta = Math.PI * theta/180
    var dist = Math.sin(radiusLatitude1) * Math.sin(radiusLatitude2) + Math.cos(radiusLatitude1) * Math.cos(radiusLatitude2) * Math.cos(radiustheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    console.log(dist);
    return dist
};
