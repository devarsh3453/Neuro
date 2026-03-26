// NeuroTrace - Phase 1 scaffold

const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', project: 'NeuroTrace' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`NeuroTrace server running on port ${PORT}`);
});
