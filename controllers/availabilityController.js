const { Hangout } = require('../databases/postgres/entity/hangout');
const { User } = require('../databases/postgres/entity/user');

module.exports = ({ DB, hangoutController }) => {
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
    if (!user) throw new Error('User does not exist with corresponding uuid.');
    return user;
  }

  async function _updateUserLocation(uuid, location) {
    try {
      const res = await DB.User.updateByUuid(uuid, { location: location });
    } catch (err) {
      console.log('Error updating user location in database. ', err);
      throw new Error('Error updating user location');
    }
  }

  async function _createHangoutStub(user) {
    // If the user already has a hangout stub, do nothing and return
    const hangouts = await DB.Hangout.findAll();
    // TODO : replace this with a more efficient way of finding the hangout
    for (const h of hangouts) {
      if (h.host && h.host.uuid === user.uuid) {
        // TODO : add conditional for checking the type of hangout once implemented
        return;
      }
    }
    // create a hangout to represent this user's availability
    const currDateTime = new Date() + ''; // TODO : reformat this to desired format -- should we use ISO standard?
    const hangoutParams = {
      name: "Let's Hang Out!",
      address: 'TBD',
      startTime: currDateTime,
      endTime: '',
      host: user,
    };
    // TODO : add the hangout type once implemented
    await DB.Hangout.create(hangoutParams);
  }

  async function _removeHangoutStub(user) {
    // delete the hangout representing this user's availability
    console.log('Deleting the stub hangout since user is no longer available');
    const hangouts = await DB.Hangout.findAll();

    // TODO : replace this with a more efficient way of finding the hangout
    for (const h of hangouts) {
      if (h.host && h.host.uuid === user.uuid) {
        console.log('hangout retrieved: ', h);
        const hangoutResponse = await DB.Hangout.deleteById(h.id);
        console.log(hangoutResponse);
        break;
      }
    }
  }

  return Object.freeze({
    updateAvailability,
  });
};
