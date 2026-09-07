module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || null,
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  AI_ENGINE_URL: process.env.AI_ENGINE_URL || null,
  GIS_ENGINE_URL: process.env.GIS_ENGINE_URL || null,
}
