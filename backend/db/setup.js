import pool from '../src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const setupDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log('Setting up database tables...');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        reset_password_token VARCHAR(255),
        reset_password_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Restaurants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        rating DECIMAL(3, 2),
        delivery_time INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Foods table
    await client.query(`
      CREATE TABLE IF NOT EXISTS foods (
        id SERIAL PRIMARY KEY,
        restaurant_id INT REFERENCES restaurants(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255),
        image_url VARCHAR(255),
        category VARCHAR(100) DEFAULT 'Local Dishes',
        rating DECIMAL(3, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Cart items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        food_id INT NOT NULL REFERENCES foods(id),
        quantity INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id),
        total_price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        delivery_location TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Order items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        food_id INT NOT NULL REFERENCES foods(id),
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add missing columns to existing tables (safe to run multiple times)
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP;
      ALTER TABLE foods ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);
      ALTER TABLE foods ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Local Dishes';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_location TEXT;
    `);

    // Profile columns (safe to run multiple times)
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
    `);

    console.log('✅ Database tables created successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
};

setupDatabase();
