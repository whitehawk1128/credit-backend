const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const bodyParser = require('body-parser');

router.post('/', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(err.message);
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const uid = event.data.object.metadata.uid;
    const userRef = db.collection('users').doc(uid);
    userRef.get().then(doc => {
      const credits = doc.data()?.credits || 0;
      userRef.update({ credits: credits + 100 });
    });
  }

  res.sendStatus(200);
});

module.exports = router;
