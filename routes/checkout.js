const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

router.post('/', async (req, res) => {
  const { uid } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'usd',
        unit_amount: 500, // $5.00
        product_data: {
          name: '100 AI Credits',
        },
      },
      quantity: 1,
    }],
    metadata: { uid },
    success_url: 'https://credit-backend-production.up.railway.app/?success=true',
    cancel_url: 'https://credit-backend-production.up.railway.app/?cancelled=true',
  });

  res.json({ url: session.url });
});

module.exports = router;
