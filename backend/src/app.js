const express = require('express');
const cors = require('cors');
const { requestLogger, errorHandler, notFound } = require('./middleware/errorHandler');

// Route imports
const healthRoutes = require('./routes/health');
const caseRoutes = require('./routes/cases');

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/cases', caseRoutes);

// ── Error Handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
