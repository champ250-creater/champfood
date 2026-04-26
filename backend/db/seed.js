import pool from '../src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log('Seeding database...');

    // 1. Insert local Rwandan restaurants
    const restaurantResult = await client.query(`
      INSERT INTO restaurants (name, description, image, rating, delivery_time) VALUES
      ('Kigali Grill Hub', 'Best brochettes and roasted meats in town', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', 4.8, 25),
      ('Akabenz Palace', 'Premium roasted pork and traditional sides', 'https://images.unsplash.com/photo-1544025162-d76694265947', 4.9, 30),
      ('Mama Africa Foods', 'Authentic Rwandan Agatogo and local dishes', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 4.7, 40)
      RETURNING id;
    `);

    // Store the generated restaurant IDs
    const r1 = restaurantResult.rows[0].id; // Kigali Grill
    const r2 = restaurantResult.rows[1].id; // Akabenz Palace
    const r3 = restaurantResult.rows[2].id; // Mama Africa

    // 2. Insert foods and assign them to the correct restaurant ID
    // Notice the array [r1, r2, r3] at the very end of the query! That fixes your bug.
    await client.query(`
      INSERT INTO foods (restaurant_id, name, description, price, image, rating) VALUES
      ($1, 'Goat Brochette & Chips', 'Classic grilled goat skewers served with a side of crispy fries', 4500, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', 4.8),
      ($1, 'Beef Brochette', 'Tender marinated beef skewers', 4000, 'https://images.unsplash.com/photo-1601050690597-df0568f70950', 4.7),
      ($2, 'Akabenz (1kg)', 'Deliciously marinated and roasted pork, a true local favorite', 5000, 'https://images.unsplash.com/photo-1544025162-d76694265947', 4.9),
      ($2, 'Roasted Potatoes', 'Crispy herb-roasted potatoes', 1500, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 4.5),
      ($3, 'Agatogo', 'Hearty plantain stew slow-cooked with tender beef', 3500, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 4.6),
      ($3, 'Beef Sambusa', 'Crispy, golden pastry filled with savory spiced minced beef', 1000, 'https://images.unsplash.com/photo-1601050690597-df0568f70950', 4.8);
    `, [r1, r2, r3]); 

    console.log('✅ Database seeded successfully with Rwandan dishes!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
};

seedDatabase();