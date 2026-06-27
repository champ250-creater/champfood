import pool from '../src/config/database.js';
import dotenv from 'dotenv';
dotenv.config();

const migrate = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
    `);
    console.log('✅ Profile columns migration done!');
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
};

migrate();
