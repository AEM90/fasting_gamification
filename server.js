'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter);

const habitsRouter = require('./routes/habits');
const seasonsRouter = require('./routes/seasons');

app.use('/api/habits', habitsRouter);
app.use('/api/seasons', seasonsRouter);

// Serve the single-page app for all other routes
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Fasting Gamification app running at http://localhost:${PORT}`);
});

module.exports = app;
