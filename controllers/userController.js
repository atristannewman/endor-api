module.exports = ({ DB, paymentService }) => {

  const createCustomer = async (httpRequest) => {
    const { email, customerId } = httpRequest.body

    if (!customerId) {
      throw new Error("Customer id is required")
    }
    
    if (email === "user@gmail.com") {
      throw new Error("Customer email is required")
    }

    // Check if customer already exists
    const existingCustomer = await DB.ApiKey.findByEmail(email);
    if (existingCustomer) {
      return {
        status: 200,
        data: {
          message: "Customer already exists"
        }
      };
    }

    const paymentMethods = await paymentService.paymentMethods(customerId)
      .then((paymentMethodsData) => {
        if (!paymentMethodsData || paymentMethodsData.length === 0) {
          throw new Error("No payment methods found for customer id")
        } else {
          return paymentMethodsData
        }
      }); 

    const savedCustomerId = await DB.CustomerId.create(email, customerId)

    return {
      status: 200,
      data: await DB.ApiKey.create(email).then((apiKeyData) => {

        return {
          email,
          customerId: savedCustomerId.stripeCustomerId,
          apiKey: apiKeyData.apiKey,
          paymentMethodLast4: paymentMethods[0].card.last4
        }
      })
    }

    
  }


  const getCustomer = async (httpRequest) => {
    try {
      const email = httpRequest.query.email

      const apiKeyProfile = await DB.ApiKey.findByEmail(email);
      const customerId = await DB.CustomerId.findByEmail(email)
      const paymentMethods = await paymentService.paymentMethods(customerId.stripeCustomerId)

      if (!apiKeyProfile) {
        return {
          status: 404,
          data: {
            message: "Customer not found"
          }
        }
      }

      return {
        status: 200,
        data: {
          apiKey: apiKeyProfile.apiKey,
          email,
          paymentMethodLast4: paymentMethods[0].card.last4,
          customerId: customerId.stripeCustomerId
        }
      }
    } catch (error) {
      return {
        status: 500,
        data: {
          message: error.message,
        },
      };
    }
  }

  const deleteCustomer = async (httpRequest) => {
    const { email } = httpRequest.body

    try {
          // Start of Selection
          const customer = await DB.CustomerId.findByEmail(email);
          const apiKey = await DB.ApiKey.findByEmail(email);
          if (!customer || !apiKey) {
            throw new Error('Customer or API key does not exist.');
          } else {
            await DB.ApiKey.destroyByEmail(email);
            await DB.CustomerId.destroyByEmail(email);
          }
          
      return {
        status: 200,
        data: {
          message: "Customer deleted"
        }
      }
    } catch (error) {
      console.error('Error deleting API key by email:', error);
      return {
        status: 500,
        data: {
          message: error.message
        }
      }
    }
  }

  const updateCustomer = async (httpRequest) => {
    const { email } = httpRequest.body

    try {
      await DB.ApiKey.destroyByEmail(email)
      return {
        status: 200,
        data: {
          message: "Customer deleted"
        }
      }
    } catch (error) {
      console.error('Error deleting API key by email:', error);
      return {
        status: 500,
        data: {
          message: error.message
        }
      }
    }
  }

  return Object.freeze({
    createCustomer,
    getCustomer,
    deleteCustomer
  });
};
