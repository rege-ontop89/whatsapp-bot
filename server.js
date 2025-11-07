// server.js

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();
const { google } = require('googleapis');
const sheets = google.sheets('v4');

async function fetchPrices() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const client = await auth.getClient();

  const spreadsheetId = '10riuqvT4gGpIv0Xd-yLDoHKTfKweTrdI3P3ZF_w3wLs'; // from the Sheet URL
  const range = 'Sheet1!A2:C'; // assumes headers in row 1

  const response = await sheets.spreadsheets.values.get({
    auth: client,
    spreadsheetId,
    range,
  });

  const rows = response.data.values || [];
  const prices = rows.map(([model, storage, price]) => ({
    model: model.toLowerCase(),
    storage,
    price,
  }));

  return prices;
}
const prices = await fetchPrices();
const userModel = incomingMsg.replace('swap', '').trim().toLowerCase();
const match = prices.find(p => userModel.includes(p.model));

if (match) {
  reply = `✅ The current swap value for ${match.model} (${match.storage}) is ₦${match.price}.`;
} else {
  reply = `❌ Sorry, I couldn't find that phone model in our list.`;
}


const { createClient } = require ('redis') ;
// Initialize Redis client safely
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('⚠️ Redis connection failed:', err);
  }
})();
const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

// Default route
app.get('/', (req, res) => {
  res.send('✅ Phone Swap Bot is running...');
});

// ✅ IMPORTANT: This must be below app.use() and above app.listen()
app.post('/webhook', (req, res) => {
  console.log("📩 Incoming data:", req.body);

  const incomingMsg = req.body.Body ? req.body.Body.toLowerCase() : "";
  const from = req.body.From;

  let reply = "Hi there! 👋 Welcome to Phone Swap Bot.\n\nType:\n1️⃣ Swap Phone\n2️⃣ Sell Phone\n3️⃣ Contact Support";

  if (incomingMsg.includes('swap')) {
    reply = "📱 Great! Let's start your phone swap process. Please tell me the brand and model of your old phone.";
  } else if (incomingMsg.includes('sell')) {
    reply = "💰 Awesome! Please tell me your phone’s brand and condition to get an offer.";
  } else if (incomingMsg.includes('support')) {
    reply = "🧑‍💻 You can reach our support at +234XXXXXXXXXX.";
  }

  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(reply);

  res.type('text/xml');
  res.send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
