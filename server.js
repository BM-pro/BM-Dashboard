// server.js
const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

require('dotenv').config(); // Add this at the top

const PORT = process.env.PORT || 3000;

const MESSAGES_FILE = path.join(__dirname, 'messages.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

// Ensure messages file exists
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify([]));
}

// Get all messages
app.get('/api/messages', (req, res) => {
  const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE));
  res.json(messages);
});

// Post a new message
app.post('/api/messages', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Message text is required' });

  const newMessage = {
    time: new Date().toLocaleTimeString(),
    text
  };

  const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE));
  messages.push(newMessage);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages));

  res.status(201).json(newMessage);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
