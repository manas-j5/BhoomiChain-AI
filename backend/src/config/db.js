/**
 * Database configuration placeholder.
 * Wire PostgreSQL/Prisma here when the database is ready.
 *
 * Example (Prisma):
 *   const { PrismaClient } = require('@prisma/client');
 *   const prisma = new PrismaClient();
 *   module.exports = prisma;
 */

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bhoomichain',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

module.exports = config;
