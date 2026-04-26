import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  // CRITICAL: Neon and other cloud providers require SSL
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;