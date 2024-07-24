module.exports = ({ DB, paymentService}) => {
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
  
  return Object.freeze({
    createPaymentIntent,
    confirmPaymentIntent
  });
};