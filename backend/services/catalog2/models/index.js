const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DB || 'sms',
  port: process.env.PG_PORT || 5432,
  // Opsione shtesë për performancë
  max: 20, // Numri maksimal i klientëve në pool
  idleTimeoutMillis: 30000, // Sa kohë një klient mund të jetë idle para se të lirohet
  connectionTimeoutMillis: 2000, // Sa kohë të presë për lidhje
});

// Event listeners për monitoring
pool.on('connect', () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('✅ Catalog2 Database connected successfully');
  }
});

pool.on('acquire', (client) => {
  // console.log('🔗 Client acquired from pool');
});

pool.on('release', (err, client) => {
  if (err) {
    console.error('❌ Error releasing client:', err);
  }
});

pool.on('error', (err, client) => {
  console.error('❌ Database pool error:', err);
});

// Test connection on startup
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('📊 Catalog2 Database test query successful:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('❌ Catalog2 Database connection test failed:', error.message);
  }
};

// Ekzekuto test connection
testConnection();

// Eksporto pool për përdorim në modele
module.exports = pool;
// Close pool when application exits
process.on('SIGTERM', () => {
  pool.end(() => {
    console.log('📊 Catalog2 Database pool has ended');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  pool.end(() => {
    console.log('📊 Catalog2 Database pool has ended');
    process.exit(0);
  });
});