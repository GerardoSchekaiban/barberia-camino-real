const { Pool } = require("pg");

const isRailway = !!process.env.DATABASE_URL;
const isInternal = process.env.DATABASE_URL?.includes(".railway.internal");

const pool = new Pool(
  isRailway
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isInternal ? false : { rejectUnauthorized: false }
      }
    : {
        user:     process.env.DB_USER,
        host:     process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port:     process.env.DB_PORT
      }
);

module.exports = pool;