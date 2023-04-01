module.exports = ({ DB }) => {
  class LocationCache {
    cache = {};

    async consructor() {
      console.log('location cache created!!');
    }

    addEntry(uuid, location) {
      this.cache[uuid] = {
        location: location,
        timestamp: Date.now(),
      };
    }

    removeEntry(uuid) {
      if (this.cache[uuid]) {
        delete this.cache[uuid];
      }
    }

    async populateCacheWithAvailableUsers() {
      const availableUsers = await DB.User.getAvailableUserUuidsAndLocations();
      for (const user of availableUsers) {
        this.addEntry(user.uuid, user.location);
      }
    }

    toString() {
      return JSON.stringify(this.cache);
    }
  }
  const locationCache = new LocationCache();
  locationCache.populateCacheWithAvailableUsers();

  async function updateUserLocation(uuid, location) {
    locationCache.addEntry(uuid, location);
    try {
      const res = await DB.User.updateByUuid(uuid, { location: location });
    } catch (err) {
      console.log(
        `Error updating user location in database for user : [ ${user.uuid} ] `,
        err
      );
      throw new Error('Error updating user location');
    }
  }

  async function removeUserLocationFromCache(uuid) {
    locationCache.removeEntry(uuid);
  }

  function getUsersWithinRadius(userLocation, radius) {
    const uuidsWithinRadius = [];
    for (const uuid in locationCache.cache) {
      const cacheUser = locationCache.cache[uuid];
      const distance = _distanceInMiles(
        userLocation.latitude,
        userLocation.longitude,
        cacheUser.location.latitude,
        cacheUser.location.longitude
      );
      if (distance <= radius) {
        uuidsWithinRadius.push({ uuid: uuid, distance: distance });
      }
    }
    return uuidsWithinRadius;
  }

  function _distanceInMiles(lat1, lon1, lat2, lon2) {
    // calculate the distance between two points in miles
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;

      return dist;
    }
  }

  return Object.freeze({
    updateUserLocation,
    removeUserLocationFromCache,
    getUsersWithinRadius,
  });
};
