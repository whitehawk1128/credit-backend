require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/credits', require('./routes/credits'));
app.use('/generate', require('./routes/generate'));
app.use('/create-checkout-session', require('./routes/checkout'));
app.use('/webhook', require('./routes/webhook'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
