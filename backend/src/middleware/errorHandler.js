/**
 * requestLogger — logs method, URL, status and response time
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const color =
      res.statusCode >= 500 ? '\x1b[31m' : // red
      res.statusCode >= 400 ? '\x1b[33m' : // yellow
      res.statusCode >= 300 ? '\x1b[36m' : // cyan
      '\x1b[32m';                           // green
    console.log(
      `${color}[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} — ${duration}ms\x1b[0m`
    );
  });
  next();
};

/**
 * notFound — 404 handler for unknown routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * errorHandler — global error middleware
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

module.exports = { requestLogger, notFound, errorHandler };
