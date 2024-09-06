const stripe = require('stripe')(process.env.STRIPE_SECRET);
require('dotenv').config();
// const Card = require('../databases/postgres/entity/cards');
const environment = process.env.ENV || 'local'
const returnUrl = () => {
    switch (environment) {
        // case 'production':
        //   return 'production URL'
        //   break;
        case 'development':
          return process.env.DEVELOPMENT_URL
        default:
          return `localhost:${process.env.LOCAL_PORT || 4321}`
    }
}

async function paymentMethods(customerId) {
    try {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: 'card',
        });
        return paymentMethods;
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        throw error;
    }
}

/**
/**
 * Creates a new payment intent with Stripe and saves card details.
 * @param {number} amount - The amount to charge in cents.
 * @param {string} payment_method - The payment method ID (e.g., card_1234).
 * @param {string} userId - The UUID of the user to associate the card with.
 * @returns {Promise<string>} - The client secret for the created payment intent.
 */

async function createPaymentIntent() {
    try {
        console.log('creating payment intent')
        const { client_secret, amount, currency } = await stripe.paymentIntents.create({
          amount: amount,
          currency: currency,
        });
        console.log(`client_secret: ${client_secret}`)
        // await Card.createCard({
        //   userId,
        //   last4: paymentMethod.card.last4,
        //   brand: paymentMethod.card.brand,
        //   expMonth: paymentMethod.card.exp_month,
        //   expYear: paymentMethod.card.exp_year,
        // });
    
        return client_secret;
      } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
      }
}

/**
 * Confirms a payment intent with Stripe.
 * @param {string} client_secret - The client secret of the payment intent to confirm.
 * @returns {Promise<object>} - The confirmed payment intent object.
 */
// TODO: Need to enter valid payment method.
async function confirmPaymentIntent(client_secret) {
    console.log("confirming payment intent")
    if (!client_secret) {
        throw new Error('Client secret not provided.');
    }

    try {
        return await stripe.paymentIntents.confirm(client_secret);
    } catch (error) {
        console.error('Error confirming payment intent:', error);
        throw error;
    }
}

/**
 * Creates a new payment method with Stripe and associates it with a user.
 * @param {string} paymentMethodId - The ID of the payment method.
 * @param {string} userId - The UUID of the user to associate the payment method with.
 * @returns {Promise<object>} - The created payment method object.
 */
async function createPaymentMethod(paymentMethodId, userId) {
    try {
        const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
            customer: userId,
        });

        // Save payment method details to your database
        // await DB.PaymentMethod.create({
        //     userId,
        //     paymentMethodId: paymentMethod.id,
        //     last4: paymentMethod.card.last4,
        //     brand: paymentMethod.card.brand,
        //     expMonth: paymentMethod.card.exp_month,
        //     expYear: paymentMethod.card.exp_year,
        // });

        return paymentMethod;
    } catch (error) {
        console.error('Error creating payment method:', error);
        throw error;
    }
}

async function createACustomer() {
    try {
        const customer = await stripe.customers.create();
        return customer;
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
}

async function createSetupIntent(intentDetails) {
  try {
    console.log(`intent details: ${intentDetails}`)
    console.log(`stripe: ${stripe}`)
      const clientSecret = await stripe.setupIntents.create(intentDetails)
      return clientSecret;
  } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
  }
}

module.exports = {
    createPaymentIntent,
    confirmPaymentIntent,
    createPaymentMethod,
    createACustomer,
    createSetupIntent,
    paymentMethods
};