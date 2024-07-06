module.exports = ({ DB /*paymentService, */}) => {
  const createPaymentIntent = async (httpRequest) => {
    const { amount, payment_method, user_id } = httpRequest.body;
    try {
      console.log("create payment intent from payment controller called")
      //const client_secret = await paymentService.createPaymentIntent(amount, payment_method, user_id);
      return {
          status: 200,
        data: {
          test: "create payment intent from payment controller response",
        },
      };
    } catch(error) {
      console.log("create payment intent from payment controller error thrown")
      throw(error)
    }
  }
  
  const confirmPaymentIntent = async (httpRequest) => {
    // const { client_secret } = httpRequest.body;
    try {
      //const intent = await paymentService.confirmPaymentIntent(client_secret);
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