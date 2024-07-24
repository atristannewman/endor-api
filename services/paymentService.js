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
        const { client_secret } = await stripe.paymentIntents.create({
          amount: '99',
          currency: 'usd',
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

module.exports = {
    createPaymentIntent,
    confirmPaymentIntent,
};