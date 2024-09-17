const stripe = require('stripe')(process.env.STRIPE_SECRET);

const handleStripeEvent = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Save payment method details to your database
      // await DB.PaymentMethod.create({
      //   userId: paymentMethod.customer,
      //   paymentMethodId: paymentMethod.id,
      //   last4: paymentMethod.card.last4,
      //   brand: paymentMethod.card.brand,
      //   expMonth: paymentMethod.card.exp_month,
      //   expYear: paymentMethod.card.exp_year,
      // });
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = {
  handleStripeEvent,
};