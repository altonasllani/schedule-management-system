// backend/shared/db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Pool i PostgreSQL – përdoret nga të gjitha mikroshërbimet
const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT) || 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
});

// testim i lidhjes
pool.connect()
  .then(() => {
    console.log('📌 PostgreSQL connected successfully');
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection error:', err.message);
  });

module.exports = { pool };
