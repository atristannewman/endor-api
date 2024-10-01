module.exports = ({ DB }) => {
  /**
   * @desc Create a new intake record
   * @param {Object} httpRequest - The HTTP request object
   * @returns {Object} - The response object
   */
  const createIntake = async (httpRequest) => {
    try {
      const { context, coordinatesStatement } = httpRequest.body;
      const email = String(httpRequest.query.email);


      if (!email) {
        return {
          status: 400,
          data: { message: 'Email is required.' },
        };
      }

      if (!context) {
        return {
          status: 400,
          data: { message: 'Context is required.' },
        };
      }

      if (!coordinatesStatement) {
        return {
          status: 400,
          data: { message: 'Coordinates statement is required.' },
        };
      }

      // Check if intake with the same email already exists
      const existingContext = await DB.Context.findByEmail(email);
      const existingCoordinates = await DB.Coordinates.findByEmail(email);

      if (existingContext) {
        return {
          status: 409,
          data: { message: 'Context with this email already exists.' },
        };
      }

      if (existingCoordinates) {
        return {
          status: 409,
          data: { message: 'Coordinates with this email already exist.' },
        };
      }

      // Create new customer context
      const newContext = await DB.Context.create(email, context);
      const newCoordinates = await DB.Coordinates.create(email,coordinatesStatement);

      return {
        status: 200,
        data: {
          context: newContext.context,
          coordinates: newCoordinates.coordinates
        },
      };
    } catch (error) {
      console.error('Error creating customer intake:', error);
      return {
        status: 500,
        data: {
          message: 'Internal server error.',
        },
      };
    }
  };

  /**
   * @desc Retrieve a single intake record by email
   * @param {Object} httpRequest - The HTTP request object
   * @returns {Object} - The response object
   */
  const getIntake = async (httpRequest) => {
    try {
      const { email } = httpRequest.query;

      if (!email) {
        return {
          status: 400,
          data: { message: 'Email parameter is required.' },
        };
      }

      const context = await DB.Context.findByEmail(email);
      const coordinates = await DB.Coordinates.findByEmail(email);

      if (!context && !coordinates) {
        return {
          status: 404,
          data: { message: 'Intake not found.' },
        };
      }

      return {
        status: 200,
        data: {
          email,
          context: context ? context.context : null,
          coordinates: coordinates ? coordinates.coordinates : null,
        },
      };
    } catch (error) {
      console.error('Error retrieving customer intake:', error);
      return {
        status: 500,
        data: {
          message: 'Internal server error.',
        },
      };
    }
  };

  /**
   * @desc Update an existing intake record
   * @param {Object} httpRequest - The HTTP request object
   * @returns {Object} - The response object
   */
  const updateIntake = async (httpRequest) => {
    try {
      const email = httpRequest.query.email;
      const { context, coordinatesStatement } = httpRequest.body;
      let updatedContext = null;
      let updatedCoordinates = null;

      if (!email) {
        return {
          status: 400,
          data: { message: 'Email is required.' },
        };
      }

      if (!context && !coordinatesStatement) {
        return {
          status: 400,
          data: { message: 'Context or coordinates statement required.'}
        }
      }

      // Check if intake exists
      const existingContext = await DB.Context.findByEmail(email);
      const existingCoordinates = await DB.Coordinates.findByEmail(email);

      if (!existingContext && !existingCoordinates) {
        return {
          status: 404,
          data: { message: 'Intake not found.' },
        };
      }

      // Update or create customer context
      if (context) {
        const contextUpdated = await DB.Context.update(email, context);
        if (contextUpdated) {
          updatedContext = await DB.Context.findByEmail(email);
        } else if (!existingContext) {
          updatedContext = await DB.Context.create(email, context);
        }
      }

      // Update or create customer coordinates
      if (coordinatesStatement) {
        const coordinatesUpdated = await DB.Coordinates.update(email, coordinatesStatement);
        if (coordinatesUpdated) {
          updatedCoordinates = await DB.Coordinates.findByEmail(email);
        } else if (!existingCoordinates) {
          updatedCoordinates = await DB.Coordinates.create(email, coordinatesStatement);
        }
      }

      return {
        status: 200,
        data: {
          context: updatedContext ? updatedContext.context : null,
          coordinates: updatedCoordinates ? updatedCoordinates.coordinates : null,
        },
      };
    } catch (error) {
      console.error('Error updating customer intake:', error);
      return {
        status: 500,
        data: {
          message: 'Internal server error.',
        },
      };
    }
  };

  /**
   * @desc Delete an intake record by email
   * @param {Object} httpRequest - The HTTP request object
   * @returns {Object} - The response object
   */
  const deleteIntake = async (httpRequest) => {
    try {
      const { email } = httpRequest.query;

      if (!email) {
        return {
          status: 400,
          data: { message: 'Email parameter is required.' },
        };
      }


      const contextDeletion = await DB.Context.destroy(email);

      const coordinatesDeletion = await DB.Coordinates.destroy(email);

      if (contextDeletion === 0 && coordinatesDeletion === 0) {
        return {
          status: 404,
          data: { message: 'Intake not found.' },
        };
      }

      return {
        status: 200,
        data: { message: 'Customer intake deleted successfully.' },
      };
    } catch (error) {
      console.error('Error deleting customer intake:', error);
      return {
        status: 500,
        data: {
          message: 'Internal server error.',
        },
      };
    }
  };

  return Object.freeze({
    createIntake,
    getIntake,
    updateIntake,
    deleteIntake,
  });
};
