// NeuroTrace - Backend Entry Point
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Router imports
const authRouter = require('./routes/auth');
const questionsRouter = require('./routes/questions');
const attemptsRouter = require('./routes/attempts');
const profileRouter = require('./routes/profile');
const analyticsRouter = require('./routes/analytics');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', project: 'NeuroTrace' });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/attempts', attemptsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/analytics', analyticsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB();
  app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
  });
}

module.exports = app;
