const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { db } = require('../firebase');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { uid, prompt } = req.body;
  const userRef = db.collection('users').doc(uid);
  const doc = await userRef.get();
  const credits = doc.data()?.credits || 0;

  if (credits <= 0) return res.status(403).json({ error: 'No credits' });

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response.text();

  await userRef.update({ credits: credits - 1 });
  res.json({ text: response });
});

module.exports = router;
