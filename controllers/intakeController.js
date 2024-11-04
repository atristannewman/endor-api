module.exports = ({ DB }) => {
  /**
   * @desc Create a new intake record
   * @param {Object} httpRequest - The HTTP request object
   * @returns {Object} - The response object
   */
  const createIntake = async (httpRequest) => {
    try {
      const { customerData } = httpRequest.body;
      const email = String(httpRequest.query.email);


      if (!email) {
        return {
          status: 400,
          data: { message: 'Email is required.' },
        };
      }

      if (!customerData) {
        return {
          status: 400,
          data: { message: 'CustomerData is required.' },
        };
      }

      // Check if intake with the same email already exists
      const existingCustomerData = await DB.CustomerData.findByEmail(email);

      if (existingCustomerData) {
        return {
          status: 409,
          data: { message: 'CustomerData with this email already exists.' },
        };
      }

      // Create new customer customerData
      const newCustomerData = await DB.CustomerData.create(email, customerData);

      return {
        status: 200,
        data: {
          customerData: newCustomerData
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

      return await DB.CustomerData.findByEmail(email)
        .then((customerData) => {
          if (customerData) {
            return {
              status: 200,
              data: {
                email,
                customerData: customerData.data
              }
            }
          } else {
            return {
              status: 404,
              data: { message: 'Intake not found.' },
            };
          }
        })
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
      const { intake } = httpRequest.body;

      if (!email) {
        return {
          status: 400,
          data: { message: 'Email is required.' },
        };
      }

      if (!intake) {
        return {
          status: 400,
          data: { message: 'Intake statement required.'}
        }
      }

      // Check if previous intake exists
      const existingCustomerData = await DB.CustomerData.findByEmail(email);

      if (!existingCustomerData) {
        return {
          status: 404,
          data: { message: 'Intake not found.' },
        };
      }

      return await DB.CustomerData.update(email, intake)
      .then((newCustomerData) => {
          return {
            status: 200,
            data: newCustomerData
          }
        }
      )

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


      const customerDataDeletion = await DB.CustomerData.destroy(email);

      if (customerDataDeletion === 0) {
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
