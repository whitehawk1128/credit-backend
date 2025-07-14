const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

router.get('/:uid', async (req, res) => {
  const userRef = db.collection('users').doc(req.params.uid);
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({ credits: 10 });
    return res.json({ credits: 10 });
  }

  res.json({ credits: doc.data().credits });
});

module.exports = router;