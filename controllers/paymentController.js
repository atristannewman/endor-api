module.exports = ({ DB, paymentService}) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET);
  const createPaymentIntent = async (httpRequest) => {
    try {
      console.log("create payment intent from payment controller called")
      const client_secret = await paymentService.createPaymentIntent();
      console.log(`paymentController.js ln 6 client_secret: ${client_secret}`)

      return {
          status: 200,
        data: {
          clientSecret: client_secret,
        },
      };
    } catch(error) {
      console.log("create payment intent from payment controller error thrown")
      throw(error)
    }
  }
  
  const confirmPaymentIntent = async (httpRequest) => {
    const { client_secret } = httpRequest.body;
    try {
      const intent = await paymentService.confirmPaymentIntent(client_secret);
      return {
          status: 200,
        data: {
          test: 'confirm payment intent from payment controller response',
        },
      };
    } catch(error) {
      console.log("confirm payment intent from payment controller error thrown")
      throw(error)
    }
  }
  
  const stripeClientSecret = async (httpRequest) => {
    console.log("create payment method from payment controller called")
    try {
      const customer = await stripe.customers.create();
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
        }
      });
      console.log('returning stripe client secret ', setupIntent.client_secret)

      return {
        status: 200,
        data: {
          clientSecret: setupIntent.client_secret
        }
      };
    } catch (error) {
      console.log("create payment method from payment controller error thrown")
      throw (error)
    }
  }

  const paymentMethods = async (httpRequest) => {
    const { customerId } = httpRequest.body;

    try {
      const paymentMethods = await paymentService.paymentMethods(customerId);
      return {
        status: 200,
        data: {
          paymentMethods: paymentMethods
        }
      };
    } catch (error) {
      console.log("payment methods from payment controller error thrown")
      throw (error)
    }
  }
  
  


  return Object.freeze({
    createPaymentIntent,
    confirmPaymentIntent,
    stripeClientSecret,
    paymentMethods
  });
};