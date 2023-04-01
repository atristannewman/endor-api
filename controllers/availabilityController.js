const { User } = require('../databases/postgres/entity/user');

module.exports = ({ DB }) => {
  const updateAvailability = async (httpRequest) => {
    const { user, status, location } = await _validateAndGetParams(
      httpRequest.body
    );

    if (status === 'available' && location) {
      await _updateUserLocation(user.uuid, location);
    }

    await DB.User.updateAvailabilityStatusByUUID(user.uuid, status);

    return {
      status: 200,
      data: {
        message: `Availability status set to [ ${status} ]`,
      },
    };
  };

  async function _validateAndGetParams(reqBody) {
    const { uuid, status, location } = reqBody;
    const user = await _getUserByUuid(uuid);
    if (status !== 'available' && status !== 'unavailable') {
      throw new Error(
        'Invalid status. Please use a valid status from this list : [ available, unavailable ]'
      );
    }
    return { user, status, location };
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

  async function _updateUserLocation(uuid, location) {
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

  return Object.freeze({
    updateAvailability,
  });
};
