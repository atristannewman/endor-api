module.exports = ({ DB, paymentService}) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET);
  const userController = require('./userController');

  
  const stripeClientSecret = async (httpRequest) => {
    try {
      const customer = await stripe.customers.create();

      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
        }
      });

      return {
        status: 200,
        data: {
          clientSecret: setupIntent.client_secret,
          customerId: setupIntent.customer
        }
      };
    } catch (error) {
      console.log("create payment method from payment controller error thrown")
      throw (error)
    }
  }

  const paymentMethods = async (httpRequest) => {
    const { email } = httpRequest.query;

    try {
      const paymentMethods = await paymentService.paymentMethods(email);
      let customer = await userController.getCustomer({ query: { email } });

      if (!customer) {
        // User not found, create a new customer
        const customerId = paymentMethods[0].customer
        userController.createCustomer({ email, customerId })
      }

      return {
        status: 200,
        data: {
          paymentMethods: paymentMethods
        }
      };
    } catch (error) {
      console.log("payment methods from payment controller error thrown");
      throw error;
    }
  }
  
  


  return Object.freeze({
    stripeClientSecret,
    paymentMethods
  });
};