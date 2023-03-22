const { Hangout } = require('../databases/postgres/entity/hangout');
const { User } = require('../databases/postgres/entity/user');

module.exports = ({ DB }) => {
  const updateAvailability = async (httpRequest) => {
    const { user, status, location } = await _validateAndGetParams(
      httpRequest.body
    );

    await _updateUserLocation(user.uuid, location);

    if (status === 'available') {
      await _createHangoutStub(user);
    } else if (status === 'unavailable') {
      await _removeHangoutStub(user);
    }

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

  async function _createHangoutStub(user) {
    // If the user already has a hangout stub, do nothing and return
    const hangout = await DB.Hangout.findAvailableByUserId(user.uuid);
    if (hangout) {
      console.log(
        `User [ ${user.uuid} ] already has a hangout stub. Doing nothing.`
      );
      return;
    }

    // create a hangout to represent this user's availability
    // TODO : reformat this to desired format -- should we use ISO standard?
    const currDateTime = new Date() + '';
    const hangoutParams = {
      name: "Let's Hang Out!",
      address: 'TBD',
      startTime: currDateTime,
      endTime: '',
      host: user,
      userId: user.uuid,
      type: 'available',
    };
    await DB.Hangout.create(hangoutParams);
    console.log(`Available Hangout stub created for user: [ ${user.uuid} ]`);
  }

  async function _removeHangoutStub(user) {
    // delete the hangout representing this user's availability
    console.log('Deleting the stub hangout since user is no longer available');
    const hangout = await DB.Hangout.findAvailableByUserId(user.uuid);
    if (hangout) {
      await DB.Hangout.deleteById(hangout.id);
      console.log(`Deleted Available Hangout stub for user : [ ${user.uuid} ]`);
    } else
      console.log(
        `User [ ${user.uuid} ] does not have a hangout stub. Doing nothing.`
      );
  }

  return Object.freeze({
    updateAvailability,
  });
};
