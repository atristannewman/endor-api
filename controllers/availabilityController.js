const { User } = require('../databases/postgres/entity/user');

module.exports = ({ DB, locationService }) => {
  const updateAvailability = async (httpRequest) => {
    const { user, status, location } = await _validateAndGetUpdateParams(
      httpRequest.body
    );

    if (status === 'available' && location) {
      await locationService.updateUserLocation(user.uuid, location);
    } else if (status == 'unavailable') {
      await locationService.removeUserLocationFromCache(user.uuid);
    }

    await DB.User.updateAvailabilityStatusByUUID(user.uuid, status);

    return {
      status: 200,
      data: {
        message: `Availability status set to [ ${status} ]`,
      },
    };
  };

  const queryNearbyAvailableUsers = async (httpRequest) => {
    const { location, radiusInMiles } = await _validateAndGetQueryParams(
      httpRequest.body
    );

    // retrieve a list of { uuid, distance } objects for nearby users
    nearbyUuidsWithDistances = locationService.getUsersWithinRadius(
      location,
      radiusInMiles
    );

    // hydrate the list of full user objects based on the uuids that are nearby
    usersWithinRadius = await _hydrateNearbyUsersList(nearbyUuidsWithDistances);

    return {
      status: 200,
      data: {
        nearbyUsers: usersWithinRadius,
      },
    };
  };

  async function _validateAndGetUpdateParams(reqBody) {
    const { uuid, status, location } = reqBody;
    const user = await _getUserByUuid(uuid);
    if (status !== 'available' && status !== 'unavailable') {
      throw new Error(
        'Invalid status. Please use a valid status from this list : [ available, unavailable ]'
      );
    }
    return { user, status, location };
  }

  async function _validateAndGetQueryParams(reqBody) {
    const { location, radiusInMiles } = reqBody;
    if (!location) {
      throw new Error('location is required');
    }
    if (!radiusInMiles) {
      throw new Error('radiusInMiles is required');
    }
    return { location, radiusInMiles };
  }

  async function _hydrateNearbyUsersList(userUuidsWithinRadius) {
    // get list of nearby users from the database using the list of uuids in userUuidsWithinRadius
    const uuidList = userUuidsWithinRadius.map((user) => user.uuid);
    const users = await DB.User.getUsersFromListOfUuids(uuidList);

    // transform list of user objects to a map of uuid to user object for easier access
    const usersMap = users.reduce((acc, user) => {
      acc[user.uuid] = user;
      return acc;
    }, {});

    // do a safe hydration of nearby users which will exclude any users that are not in the database
    const safeResultSet = [];
    for ({ uuid, distance } of userUuidsWithinRadius) {
      const user = usersMap[uuid];
      if (user) {
        // convert to standard object so we can add a new property
        jsonUser = JSON.parse(JSON.stringify(user));
        jsonUser.distance = distance;
        safeResultSet.push(jsonUser);
      }
    }
    return safeResultSet;
  }

  async function _getUserByUuid(uuid) {
    const user = await User.findOne({
      where: {
        uuid,
      },
    });
    if (!user) throw new Error(`User not found: [ ${uuid} ] `);
    return user;
  }

  return Object.freeze({
    updateAvailability,
    queryNearbyAvailableUsers,
  });
};
